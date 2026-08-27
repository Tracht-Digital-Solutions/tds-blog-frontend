import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The site key, pinned by reading the source rather than by calling anything.
 *
 * Both properties below are invisible at runtime in the ways that matter: a key
 * read from the wrong place is simply `undefined` forever, and a fetch that
 * forgets the header is simply an unauthenticated read. Neither throws, neither
 * logs, and in `off` mode neither even changes the output — so they would be
 * discovered on the day enforcement is switched on, in production, by a build
 * that quietly served stale content.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
/**
 * Read a module with its comments stripped.
 *
 * These assertions scan source text, and this very file documents the wrong
 * form in prose ("import.meta.env.TDS_SITE_KEY would be undefined") — so a
 * naive scan fails on the explanation of the rule it is enforcing. Same trap
 * as lint-primitives, which counts a tag name written inside a comment as
 * markup.
 */
const read = (name: string) =>
  readFileSync(join(HERE, name), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "");

/** Every module here that talks to the API at build time. */
const FETCHERS = ["content-api.ts"];

describe("site key", () => {
  it("comes from private paired state with a one-release process.env fallback", () => {
    // Astro/Vite inline ONLY `PUBLIC_`-prefixed names into import.meta.env, and
    // this repo declares no envField schema — so import.meta.env.TDS_SITE_KEY
    // would be undefined in every build, forever, with nothing to say so. That
    // is exactly how TOOLS_REGISTRY_TOKEN spent its entire life: the guard that
    // read it was unconditionally true and the sync never ran once.
    const connection = read("connection.ts");
    expect(connection).toMatch(/fallbackSiteKey:[\s\S]*process\.env\.TDS_SITE_KEY/);
    expect(connection).not.toMatch(/import\.meta\.env\.TDS_SITE_KEY/);
    expect(read("siteKey.ts")).toMatch(/connection\.siteKey\(\)/);
  });

  it("is not PUBLIC_-prefixed anywhere", () => {
    // A PUBLIC_ name is inlined into the shipped bundle, i.e. the credential
    // would be published. The "fix" for the point above is the worse bug.
    for (const name of ["siteKey.ts", ...FETCHERS]) {
      expect(read(name)).not.toMatch(/PUBLIC_TDS_SITE_KEY/);
    }
  });

  it("sends the key on every build-time fetch", () => {
    // A new fetch added without it is an unauthenticated read that looks
    // deliberate. Counted rather than spot-checked, so adding one fails here.
    for (const name of FETCHERS) {
      const src = read(name);
      const fetches = (src.match(/await fetch\(/g) ?? []).length;
      const headers = (src.match(/headers: siteKeyHeaders\(\)/g) ?? []).length;
      expect(headers, `${name}: fetch calls without the site key`).toBe(fetches);
    }
  });

  it("checks every build-time fetch for a rejected key", () => {
    // Without this the build stays fail-soft on a 401 and ships the baked
    // fallbacks while reporting success — the failure this feature exists to
    // remove.
    for (const name of FETCHERS) {
      const src = read(name);
      const fetches = (src.match(/await fetch\(/g) ?? []).length;
      const asserts = (src.match(/assertKeyAccepted\(res,/g) ?? []).length;
      expect(asserts, `${name}: fetch calls with no rejection check`).toBe(fetches);
    }
  });

  it("does not make the GitHub build depend on a runtime credential", () => {
    // A throw inside assertKeyAccepted is swallowed by the fail-soft try/catch
    // at every call site. That was the first version, and a real build against
    // a 401 stub printed the abort message five times and then completed GREEN.
    // astro:build:done runs outside all of them.
    const src = read("siteKey.ts");
    expect(src).not.toMatch(/astro:build:done/);
    expect(src).not.toMatch(/siteKeyGuard/);

    const config = readFileSync(join(HERE, "..", "..", "astro.config.mjs"), "utf8");
    expect(config).not.toMatch(/siteKeyGuard/);
    const workflow = readFileSync(join(HERE, "..", "..", ".github", "workflows", "_build.yml"), "utf8");
    expect(workflow).not.toMatch(/TDS_SITE_KEY/);
  });

  it("shares the rejection list through globalThis", () => {
    // astro.config.mjs and the page modules are two separate module graphs, so a
    // plain module-scoped array gives the integration its OWN empty one — the
    // guard reads zero while the pages record several. That was the SECOND
    // version, and it failed exactly like the first: build green, message
    // printed, nothing stopped.
    expect(read("siteKey.ts")).toMatch(/globalThis/);
  });

  it("throws only on 401/403, and only when a key is configured", () => {
    // A 500 or a timeout must stay fail-soft: an API hiccup should not fail a
    // deploy, and a site with no key must behave exactly as it always has.
    const src = read("siteKey.ts");
    expect(src).toMatch(/res\.status !== 401 && res\.status !== 403/);
    expect(src).toMatch(/currentSiteKey\(\) === ""\) return/);
  });
});

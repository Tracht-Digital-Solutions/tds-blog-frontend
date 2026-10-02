import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `scripts/geo-audit.mjs` is the same file in all four public repos; only its
 * `PROFILE` block differs. Nothing else keeps the copies in step, and the one
 * failure that matters is silent: a site that quietly audits less than its
 * siblings still reports "No hard failures".
 *
 * So this test reads the script as TEXT and pulls its arrays out with a
 * regex. It never imports or executes it — the script fetches a site on the
 * first line and calls `process.exit`, neither of which belongs in a test run.
 * Byte-parity across 400 lines would be brittle; the list of checks is the
 * part that has to agree.
 *
 * `tds-landingpage-frontend` is where the generic body is maintained. When it
 * is checked out beside this repo, the second block below holds this copy's
 * check list to be a superset of that one — the same `runIf(existsSync(…))`
 * convention `seo.test.ts` already uses for the sibling identity file.
 */
const script = readFileSync(resolve(process.cwd(), "scripts/geo-audit.mjs"), "utf8");

/** The checks every one of the four sites has to run. */
const UNIVERSAL = [
  "robots.agents",
  "robots.disallow",
  "robots.sitemap",
  "sitemap.index",
  "sitemap.pages",
  "page.status",
  "page.noindex",
  "page.lang",
  "title.present",
  "title.length",
  "title.distinct",
  "description.present",
  "description.length",
  "description.distinct",
  "heading.single-h1",
  "heading.levels",
  "canonical.self",
  "hreflang.present",
  "hreflang.reciprocal",
  "og.title-description",
  "og.image",
  "og.image-answers",
  "jsonld.parses",
  "jsonld.required-types",
  "jsonld.forbidden-types",
  "jsonld.id-unique",
  "jsonld.id-resolves",
  "jsonld.date-visible",
  "img.alt",
  "link.internal-resolves",
  "text.banned-words",
  "text.word-count",
  "llms.status",
  "llms.type",
  "llms.budget",
  "llms.covers-sitemap",
] as const;

/**
 * An array literal, read without evaluating the module. None of these arrays
 * nests a bracket, so "up to the next ]" is exact and works for the one-line
 * and the multi-line form alike.
 */
function arrayLiteral(source: string, name: string): string[] {
  const match = source.match(new RegExp(`(?:const ${name} = |\\b${name}: )\\[([^\\]]*)\\]`));
  if (!match) throw new Error(`${name} not found in the audit script`);
  return [...match[1]!.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
}

describe("geo-audit check list", () => {
  const ids = arrayLiteral(script, "CHECK_IDS");

  it.each(UNIVERSAL)("runs %s", (id) => {
    expect(ids).toContain(id);
  });

  it("lists each check once", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });
});

const SIBLING = resolve(process.cwd(), "..", "tds-landingpage-frontend", "scripts", "geo-audit.mjs");

describe.runIf(existsSync(SIBLING))("against the repo that maintains the harness", () => {
  it("runs at least every check the marketing site runs", () => {
    const theirs = arrayLiteral(readFileSync(SIBLING, "utf8"), "CHECK_IDS");
    const ours = new Set(arrayLiteral(script, "CHECK_IDS"));
    for (const id of theirs) {
      expect(ours.has(id), `the marketing site checks ${id} and this one does not`).toBe(true);
    }
  });
});

describe("geo-audit profile", () => {
  it("names the answer agents robots.txt is tested against", () => {
    // Both files carry the list; a name added to one and not the other means
    // the audit passes a robots.txt the contract test would reject.
    const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
    for (const agent of arrayLiteral(script, "agents")) {
      if (agent === "*") continue;
      expect(robots, agent).toMatch(new RegExp(`^User-agent: ${agent}$`, "mi"));
    }
  });

  it("closes the same paths the robots.txt test closes", () => {
    expect(arrayLiteral(script, "requiredDisallow")).toEqual(["/install/", "/tds/"]);
  });

  it("treats a posting as the page entity", () => {
    // An article's graph puts the date on the `BlogPosting`; the
    // `mainEntityOfPage` stub beside it carries none. Looking only for
    // `WebPage` would report every article as undated.
    expect(script).toContain("\"BlogPosting\"");
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Journal header posture test.
 *
 * Companion to layout.test.ts, same principle: these pin invariants whose
 * violation produces no error, no failing build and no visible symptom until
 * someone opens the page at a phone width.
 *
 * Below lg the journal is an app: a bottom tab bar with sheets
 * (AppChrome.astro, tds-shared/app). It replaced the docked hamburger sheet,
 * which itself had replaced a bespoke overlay with its own scroll lock and
 * Escape handler.
 */

const HEADER = join(process.cwd(), "src", "components", "JournalHeader.astro");
const GLOBAL_CSS = join(process.cwd(), "src", "styles", "global.css");
const raw = readFileSync(HEADER, "utf8");
const css = readFileSync(GLOBAL_CSS, "utf8");

/** This file documents the traps being pinned, so assert against code only. */
const source = raw
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/^\s*\/\/.*$/gm, "");

describe("mobile navigation", () => {
  const chromeRaw = readFileSync(join(process.cwd(), "src", "components", "AppChrome.astro"), "utf8");

  it("is the app tab bar, not a hamburger", () => {
    // The phone navigates with the bottom tab bar + sheets (AppChrome). A
    // second, hidden menu in the header would be a second source of truth.
    expect(source).not.toContain("tds-menu-toggle");
    expect(source).not.toContain("tds-mobile-menu");
    expect(chromeRaw).toContain('class="tds-tabbar"');
    expect(chromeRaw).toMatch(/mountAppTabBar\(/);
    expect(chromeRaw).toMatch(/mountTabPages\(/);
  });

  it("takes the header mechanics from tds-shared", () => {
    expect(source).toMatch(/from "@tracht-digital-solutions\/tds-shared\/app"/);
    expect(source).toContain("mountAppHeader(header)");
  });

  it("does not hand-roll the scroll lock", () => {
    expect(source).not.toContain("drawer-open");
    expect(source).not.toContain("body.style.overflow");
    expect(chromeRaw).not.toContain("body.style.overflow");
    expect(css).not.toContain("drawer-open");
  });

  it("keeps Escape for the Entdecken disclosure only", () => {
    // Sheets close on Escape natively (modal <dialog>); only the desktop
    // disclosure needs its own handler.
    const globalKeydown = source.match(/document\.addEventListener\(\s*"keydown"/g) ?? [];
    expect(globalKeydown).toHaveLength(1);
    expect(source).not.toMatch(/matchMedia\(\s*"\(min-width/);
  });

  it("hides its desktop chrome at lg, the width every public site uses", () => {
    expect(source).not.toMatch(/md:(flex|hidden)/);
    expect(source).toContain('<nav class="tds-sitebar__nav"');
    expect(source).toContain('<div class="tds-sitebar__desktop">');
    expect(source).toContain("hidden lg:flex");
  });

  it("bundles the script rather than inlining it", () => {
    expect(raw).not.toMatch(/<script[^>]*is:inline/);
    expect(chromeRaw).not.toMatch(/<script[^>]*is:inline/);
  });
});

describe("the desktop search field", () => {
  it("leaves its own display to the `hidden lg:flex` on the element", () => {
    // This file is unlayered and Tailwind's utilities live in
    // `@layer utilities`, so a `display: flex` in the rule beats `.hidden`
    // outright — the search field rendered at EVERY width and nobody noticed,
    // because nothing overflowed and `body { overflow-x: hidden }` would have
    // clipped it if it had. It cost 168px in a 375px bar, and the hamburger
    // went off the right edge the moment the account menu joined the row.
    const rule = css.match(/\.nav-search \{([^}]*)\}/)?.[1] ?? "";
    expect(rule).not.toBe("");
    expect(rule).not.toMatch(/^\s*display:/m);
    expect(source).toContain('class="nav-search hidden lg:flex"');
  });
});

describe("the property bar", () => {
  /**
   * The journal, the tools site and the shop share one bar. The three used to
   * differ in width, link style, and the names and order of the sibling links,
   * so following a link between them moved the logo and renamed the links.
   */

  it("is the shared bar, with no local copy of its pieces left behind", () => {
    expect(source).toContain('<div class="tds-shell tds-sitebar">');
    expect(source).toContain('class="tds-sitebar__brand brand-wordmark"');
    expect(source).not.toMatch(/\bjnav-item\b/);
    expect(css).not.toMatch(/\.jnav-item\b/);
    expect(css).not.toMatch(/\.nav-divider\b/);
  });

  it("lists the properties in the shared order, with Entdecken after the journal", async () => {
    const { primaryNav } = await import("../lib/nav");
    for (const lang of ["de", "en"] as const) {
      const nav = primaryNav(lang);
      expect(nav.map((node) => node.key)).toEqual(["journal", "entdecken", "tools", "shop", "main"]);
      for (const node of nav) {
        if (node.kind !== "link" || node.key === "journal") continue;
        // Siblings are absolute and stay in the reader's language.
        expect(node.href.endsWith("/en/")).toBe(lang === "en");
      }
    }
  });

  it("lets the CTA yield on a wrapper and sends it in the reader's language", () => {
    expect(source).toMatch(/<div class="tds-sitebar__wide">\s*<a href=\{contact\} class="btn btn-primary/);
    expect(source).toContain("propertyContact(lang)");
    expect(source).not.toContain("https://tracht-digital.de/#contact");
  });

  it("resolves the bar in the INSTALLED tds-shared", () => {
    const shared = join(process.cwd(), "node_modules", "@tracht-digital-solutions", "tds-shared");
    expect(readFileSync(join(shared, "styles", "primitives.css"), "utf8")).toContain(".tds-sitebar__wide");
    expect(readFileSync(join(shared, "styles", "surfaces", "blog.css"), "utf8")).toMatch(
      /--tds-shell-max:\s*120rem/,
    );
    expect(readFileSync(join(shared, "dist", "nav", "index.d.ts"), "utf8")).toMatch(/\bpropertyNav\b/);
  });
});

describe("the account menu", () => {
  /**
   * The shared session, visible in the header. The blog had no auth code at
   * all before this, so every assertion here is about a thing that fails
   * quietly: a mount inside the desktop-only cluster is invisible on a phone,
   * a utility on the island itself does nothing, and a caret pin that never
   * resolved the new version type-checks perfectly against the OLD one.
   */

  it("comes from tds-shared, not from a local copy", () => {
    expect(source).toMatch(
      /import \{[^}]*\bAccountMenu\b[^}]*\} from "@tracht-digital-solutions\/tds-shared\/components"/,
    );
  });

  it("is mounted with the page language", () => {
    expect(source).toMatch(/<AccountMenu\s+client:idle\s+lang=\{lang\}\s*\/>/);
  });

  it("says nothing to a signed-out reader", () => {
    // The blog is public and its header already carries a contact CTA; a
    // sign-in link beside it would be noise. `loggedOut` stays at its default.
    expect(source).not.toMatch(/<AccountMenu[^>]*loggedOut=/);
  });

  it("sits OUTSIDE the desktop-only cluster", () => {
    // Inside `hidden lg:flex` it would vanish on a phone — where it is the
    // only control in the bar (navigation lives in the tab bar), so its
    // absence would be total rather than partial.
    const desktopCluster = source.indexOf('<div class="tds-sitebar__desktop">');
    // The cluster's own closing tag: the second `</div>` after the CTA, which
    // sits in `.tds-sitebar__wide`. Searching from the end would find the
    // mobile sheet's copy of the same CTA, further down the file.
    const cta = source.indexOf("btn btn-primary", desktopCluster);
    const clusterEnd = source.indexOf("</div>", source.indexOf("</div>", cta) + 1);
    const mount = source.indexOf("<AccountMenu");

    expect(desktopCluster).toBeGreaterThan(-1);
    expect(mount).toBeGreaterThan(clusterEnd);
  });

  it("carries no visibility utility of its own", () => {
    // tds-shared's CSS is unlayered and Tailwind's utilities are layered, so
    // `hidden` on `.tds-dropdown` loses outright — it would look like the
    // island simply chose to render.
    const tag = source.slice(source.indexOf("<AccountMenu"));
    const opening = tag.slice(0, tag.indexOf(">") + 1);
    expect(opening).not.toMatch(/\bhidden\b/);
    expect(opening).not.toMatch(/\blg:hidden\b/);
  });

  it("resolves in the INSTALLED tds-shared, not just in this repo's source", () => {
    // A 0.x caret is minor-locked and `npm install --no-package-lock`
    // re-resolves every range on each build. A pin that cannot reach the
    // version carrying this export produces a build error at deploy time and
    // nothing at all before it.
    const dts = join(
      process.cwd(),
      "node_modules",
      "@tracht-digital-solutions",
      "tds-shared",
      "dist",
      "components",
      "index.d.ts",
    );
    expect(readFileSync(dts, "utf8")).toMatch(/declare const AccountMenu|AccountMenu\b/);
  });
});

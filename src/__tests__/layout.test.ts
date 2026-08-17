import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Layout posture tests.
 *
 * These do NOT check that the blog looks right — nothing in a jsdom test can.
 * They pin the handful of layout invariants whose violation produces NO
 * symptom: no error, no overflow, no failing build, and a page that simply
 * renders wrong (or renders nothing) in a browser nobody opened at that width.
 *
 * Every assertion here corresponds to a bug that actually shipped, or to one
 * that the fluid-layout rewrite would have introduced.
 *
 * Precedent for a source-reading posture test in this workspace:
 * tds-tools-frontend/src/lib/surface.test.ts.
 */

// Anchored to the vitest root (the repo root), not to import.meta.url: under
// the jsdom environment import.meta.url is not a file: URL.
const SRC = join(process.cwd(), "src");
const GLOBAL_CSS = join(SRC, "styles", "global.css");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const sourceFiles = walk(SRC).filter((f) => /\.(astro|tsx|ts)$/.test(f) && !f.includes("__tests__"));
const css = readFileSync(GLOBAL_CSS, "utf8");

/**
 * Strip comments before asserting. These files document the very traps being
 * pinned here, so a check for `left: max(` or `flexDirection` matches the
 * warning about it and the suite fails on its own prose.
 */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const cssCode = stripComments(css);
const codeOf = (file: string) => stripComments(readFileSync(file, "utf8"));

/**
 * The blog's own stylesheet PLUS the shared layers it imports. Most of the
 * layout scale lives in tds-shared now (base.css / primitives.css), and this
 * repo only overrides what it genuinely sets differently — so an assertion
 * that reads global.css alone would pass or fail for the wrong reason.
 * What matters is the CSS the page actually gets.
 */
const SHARED = join(
  process.cwd(),
  "node_modules",
  "@tracht-digital-solutions",
  "tds-shared",
  "styles",
);
const effectiveCss = [
  cssCode,
  ...["base.css", "primitives.css", "prose.css"].map((f) => codeOf(join(SHARED, f))),
].join("\n");

describe("page shell", () => {
  it("routes every page container through .tds-shell, not a copied max-w utility", () => {
    // The 64rem ceiling used to be `max-w-5xl mx-auto px-6` duplicated across
    // 22 call sites, which is why widening the blog meant editing 22 files and
    // why nobody ever did. One token owns it now.
    const offenders = sourceFiles.filter((f) => readFileSync(f, "utf8").includes("max-w-5xl"));
    expect(offenders).toEqual([]);
  });

  it("declares the layout tokens the shell and the grid read", () => {
    for (const token of [
      "--tds-shell-max",
      "--tds-shell-article",
      "--tds-shell-prose",
      "--tds-measure",
      "--tds-grid-min",
      "--tds-gutter",
      "--tds-rail",
    ]) {
      expect(effectiveCss, `${token} resolves to nothing`).toContain(`${token}:`);
    }
    // The two the blog genuinely overrides must be set HERE, or the site
    // silently renders at tds-shared's 90rem default.
    expect(cssCode).toMatch(/--tds-shell-max:\s*120rem/);
    expect(cssCode).toContain("--tds-rail:");
  });

  it("keeps every layout token name free of digits", () => {
    // tds-shared's design.test.ts scans surface files with
    // /var\((--tds-[a-z-]+)/ — a character class with no 0-9. A token named
    // `--tds-shell-2xl` is captured as `--tds-shell-`, which resolves to
    // nothing, and the shared suite goes red the moment one of these is
    // promoted into surfaces/blog.css. Enforce the constraint at the source.
    const declared = [...cssCode.matchAll(/(--tds-[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
    const withDigits = [...new Set(declared)].filter((n) => /\d/.test(n));
    expect(withDigits).toEqual([]);
  });

  it("sizes the article column from tokens and drops the viewport arithmetic", () => {
    // The old recentring formula measured with 100vw, which counts the
    // scrollbar, and lived on .article-col where focus mode could not reset
    // it — leaving the column a permanent 132px left of centre in focus mode.
    // Anchored so `padding-left: max(…)` — which is the REPLACEMENT — does not
    // match the property it replaced.
    expect(cssCode).not.toMatch(/(^|[;{\s])left:\s*max\(/);
    expect(cssCode).not.toContain("100vw");
  });

  it("reserves a real gutter for the fixed TOC rail", () => {
    // The shell used to reserve nothing, on the theory that both rails "float
    // in the side margins". True only when there ARE side margins: at 1280px
    // the text ran under the sidebar, at 1024px under the TOC. The left rail
    // is covered by .with-sidebar's own margin; the right one needs this.
    expect(cssCode).toMatch(/\.article-shell\.has-toc\s*\{[^}]*padding-right:\s*max\(/);
  });
});

describe("intrinsic grid", () => {
  it("derives the column count from available space, with an overflow guard", () => {
    const rule = effectiveCss.match(/\.tds-grid-auto\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("auto-fill");
    // `min(100%, …)` is what stops a 16rem track floor from overflowing a
    // viewport narrower than 16rem. body{overflow-x:hidden} would CLIP that
    // rather than reveal it, so it would never be noticed.
    expect(rule).toContain("min(100%");
    expect(rule).toContain("var(--tds-grid-min)");
  });

  it("never pins the grid gap with an inline style", () => {
    // tds-shared's stylesheets are unlayered and beat Tailwind utilities — but
    // NOT an inline style. A leftover `style={{ gap: 20 }}` on a .tds-grid-auto
    // silently freezes the gutter and the token does nothing.
    for (const file of sourceFiles) {
      const src = codeOf(file);
      if (!src.includes("tds-grid-auto")) continue;
      expect(src, `${file} sets an inline gap on an intrinsic grid`).not.toMatch(
        /tds-grid-auto[\s\S]{0,200}?style=\{\{[^}]*\bgap\b/,
      );
    }
  });
});

describe("container queries", () => {
  // container-type computes to `contain: layout style inline-size`, which makes
  // the element a containing block for position:fixed descendants. Putting one
  // on any of these re-anchors chrome that is meant to be viewport-anchored —
  // the reading-progress bar, the TOC rail, the fullscreen mobile menu, the
  // print controls — and NOTHING reports it.
  const FORBIDDEN = [
    "body",
    ".with-sidebar",
    ".article-shell",
    ".brand-header",
    ".print-shell",
  ];

  it("never makes a fixed-position ancestor into a container", () => {
    // Match each selector block that declares container-type and check what it
    // selects, rather than grepping loosely.
    const blocks = [...cssCode.matchAll(/([^{}]+)\{([^}]*container-type[^}]*)\}/g)];
    const selectors = blocks.map((m) => m[1].trim());
    for (const selector of selectors) {
      for (const banned of FORBIDDEN) {
        expect(
          selector.split(",").some((s) => s.trim() === banned || s.trim().endsWith(` ${banned}`)),
          `${banned} must not be a container query container`,
        ).toBe(false);
      }
    }
  });

  it("puts the container on the slot, never on the card that must react to it", () => {
    // A container query styles the DESCENDANTS of a container. An element can
    // never respond to its own container-type: it looks for an ANCESTOR
    // container, finds none, and the rule is simply dead. This shipped once —
    // the lead card sat at 1830px still stacked vertically — and it fails
    // completely silently, looking exactly like a card that chose not to
    // change. Pin the split: .post-card-slot declares it, .post-card does not.
    const slot = cssCode.match(/\.post-card-slot\s*\{[^}]*\}/)?.[0] ?? "";
    expect(slot).toContain("container-type");

    const card = cssCode.match(/\.post-card\s*\{[^}]*\}/)?.[0] ?? "";
    expect(card).not.toContain("container-type");
    // The card still has to fill its slot, which is what the removed
    // `<li class="flex">` wrappers used to do.
    expect(card).toContain("height: 100%");
  });

  it("wraps every PostCard in a slot", () => {
    for (const file of sourceFiles) {
      const src = codeOf(file);
      if (!src.includes("<PostCard")) continue;
      expect(src, `${file} renders a PostCard outside a .post-card-slot`).toContain(
        "post-card-slot",
      );
    }
  });

  it("never wraps a PostCard in a flex item", () => {
    // The other half of the same trap: three of the four call sites used to do
    // exactly this.
    for (const file of sourceFiles) {
      const src = codeOf(file);
      if (!src.includes("PostCard")) continue;
      expect(src, `${file} wraps a PostCard in a flex <li>`).not.toMatch(
        /<li[^>]*class(Name)?=\{?["'`][^"'`]*\bflex\b/,
      );
      expect(src, `${file} wraps a PostCard in a flex <li>`).not.toMatch(
        /<li[^>]*style=\{\{[^}]*display:\s*["']flex["']/,
      );
    }
  });

  it("keeps the card's own layout out of inline styles", () => {
    // An @container rule cannot override an inline style, so an inline
    // flexDirection/padding/aspectRatio would make the card unable to change
    // shape no matter what CSS is written for it.
    const card = codeOf(join(SRC, "components", "PostCard.tsx"));
    for (const prop of ["flexDirection", "aspectRatio", "padding", "WebkitLineClamp"]) {
      expect(card, `PostCard must not inline ${prop}`).not.toContain(prop);
    }
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Colour-band posture tests (2026-09-15).
 *
 * The journal separates its sections with flush colour bands and the blocks
 * inside them with 1px seams, instead of spacing boxes out on a white ground.
 * Nothing below fails visibly when it regresses: a margin that comes back only
 * shows the ground again, a white fill is merely "a bit bright", and a tone
 * that loses its dark override just stops being distinguishable from its
 * neighbour. So the invariants are pinned at the source, the way
 * layout.test.ts pins the fluid layout.
 */

// Anchored to the vitest root, as in layout.test.ts.
const SRC = join(process.cwd(), "src");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** The stylesheet documents the traps it avoids; assert against code only. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const css = stripComments(readFileSync(join(SRC, "styles", "global.css"), "utf8"));
const markup = walk(SRC).filter((f) => /\.(astro|tsx)$/.test(f) && !/\.test\.tsx$/.test(f));
const PAGES = join(SRC, "pages");

/** The bodies of every rule whose selector is exactly `selector`. */
function blocksOf(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|[}\\s])${escaped}\\s*\\{([^}]*)\\}`, "g");
  return [...css.matchAll(re)].map((m) => m[1]).join("\n");
}

describe("page ground", () => {
  it("paints the body soft, never paper", () => {
    const body = blocksOf("body");
    expect(body).toContain("background-color: var(--color-soft)");
    expect(body).not.toMatch(/background(-color)?:\s*var\(--color-paper\)/);
  });

  it("gives the tint its own dark-theme value", () => {
    // At the light theme's 9% the tint measures 1.02:1 against soft on the dark
    // theme — the alternating bands would read as one colour.
    expect(css).toMatch(/:root\[data-theme="dark"\]\s*\{[^}]*--jnl-tint:/);
  });

  it("re-maps the page tokens in the dark tones but leaves --color-primary alone", () => {
    // The slug covers draw with --color-primary; mapping it to white inside a
    // dark band would blank a cover.
    const dark =
      css.match(/\.jnl-tone-navy,\s*\.jnl-tone-ink,\s*\.jnl-tone-accent\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(dark).toContain("--color-muted:");
    expect(dark).toContain("--jnl-tile:");
    expect(dark).not.toContain("--color-primary:");
  });
});

describe("no margin between blocks", () => {
  it.each([".post-row", ".sidenav button.sidenav-item", ".toc a", ".tools-promo"])(
    "%s declares no margin",
    (selector) => {
      expect(blocksOf(selector)).not.toMatch(/\bmargin(-[a-z]+)?\s*:/);
    },
  );

  it("narrows every intrinsic grid to the 1px seam", () => {
    let grids = 0;
    for (const file of markup) {
      const src = stripComments(readFileSync(file, "utf8"));
      for (const m of src.matchAll(/class(?:Name)?=["'{`][^"'`]*tds-grid-auto[^"'`]*/g)) {
        grids++;
        expect(m[0], `${file} has an intrinsic grid without jnl-mosaic`).toContain("jnl-mosaic");
      }
    }
    // Guards the scan itself: a regex that matches nothing passes vacuously.
    expect(grids).toBeGreaterThan(5);
  });

  it("puts no page's <main> in a margin-spaced shell", () => {
    for (const file of markup.filter((f) => f.startsWith(PAGES))) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/<main[^>]*tds-shell[^>]*\bpy-/);
    }
  });

  it("stacks the article end as flush panels", () => {
    const article = readFileSync(join(SRC, "components", "Article.astro"), "utf8");
    expect(article).toContain('class="jnl-article-end"');
    expect(blocksOf(".jnl-article-end")).toContain("gap: 1px");
  });
});

describe("almost no white", () => {
  it("fills no island button with white", () => {
    for (const name of ["HeroSlider.tsx", "NewsletterSignup.tsx"]) {
      const src = readFileSync(join(SRC, "components", "islands", name), "utf8");
      expect(src, name).not.toMatch(/background:\s*"#fff(fff)?"/);
    }
  });

  it("gives the journal's own chrome no card or paper fill", () => {
    for (const selector of [".brand-header", ".blog-sidebar", ".toc", ".jnav-dropdown", ".sidebar-toggle"]) {
      const body = blocksOf(selector);
      expect(body, `${selector} is not declared`).not.toBe("");
      expect(body, selector).not.toMatch(/background(-color)?:\s*var\(--color-(card|paper)\)/);
    }
  });
});

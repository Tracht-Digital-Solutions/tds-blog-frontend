import { describe, expect, it } from "vitest";

import {
  RENDERED_META_LENGTH,
  archiveDescription,
  authorDescription,
  categoryDescription,
  clampToWord,
  tagDescription,
} from "./metaDescription";
import { siteConfig } from "./seo";

/**
 * The budget is a property of the SEARCH ENGINE, not of the current copy —
 * so it is asserted as one bound for every generated description, at both
 * ends. Seeding a per-page bound from whatever the sentence happens to be
 * today is what let the previous descriptions ossify at 39–58 characters.
 */
const MIN_USEFUL = 80;

/** Realistic worst cases: the taxonomy name is the variable part. */
const NAMES = [
  "SEO",
  "Digitalisierung",
  "Prozessautomatisierung im Mittelstand",
  "Ein außergewöhnlich langer Kategoriename, den niemand jemals vergeben sollte",
];

describe("generated descriptions stay inside what Google renders", () => {
  it.each(NAMES)("category %s (de + en)", (name) => {
    for (const lang of ["de", "en"] as const) {
      const text = categoryDescription(name, lang);
      expect(text.length, `${lang}: ${text}`).toBeLessThanOrEqual(RENDERED_META_LENGTH);
    }
  });

  it.each(NAMES)("tag %s (de + en)", (name) => {
    for (const lang of ["de", "en"] as const) {
      const text = tagDescription(name, lang);
      expect(text.length, `${lang}: ${text}`).toBeLessThanOrEqual(RENDERED_META_LENGTH);
    }
  });

  it("archive pages, including a three-digit page number", () => {
    for (const lang of ["de", "en"] as const) {
      for (const page of [2, 12, 137]) {
        const text = archiveDescription(page, lang);
        expect(text.length, `${lang} p${page}`).toBeLessThanOrEqual(RENDERED_META_LENGTH);
      }
    }
  });

  it.each(NAMES)("author %s (de + en)", (name) => {
    for (const lang of ["de", "en"] as const) {
      const text = authorDescription(name, lang);
      expect(text.length, `${lang}: ${text}`).toBeLessThanOrEqual(RENDERED_META_LENGTH);
    }
  });
});

describe("generated descriptions are long enough to be worth rendering", () => {
  it("clears the useful-length floor for ordinary names", () => {
    for (const lang of ["de", "en"] as const) {
      expect(categoryDescription("Digitalisierung", lang).length).toBeGreaterThan(MIN_USEFUL);
      expect(tagDescription("automatisierung", lang).length).toBeGreaterThan(MIN_USEFUL);
      expect(archiveDescription(2, lang).length).toBeGreaterThan(MIN_USEFUL);
      expect(authorDescription("Julian Tracht", lang).length).toBeGreaterThan(MIN_USEFUL);
    }
  });
});

describe("the taxonomy name always survives", () => {
  // The name is the only thing that distinguishes one listing page from the
  // next. A description that drops it describes every category equally, which
  // is a duplicate-content signal rather than a description.
  it.each(NAMES)("keeps %s in the rendered text", (name) => {
    for (const lang of ["de", "en"] as const) {
      const short = name.slice(0, 20);
      expect(categoryDescription(name, lang)).toContain(short);
      expect(tagDescription(name, lang)).toContain(short);
    }
  });

  it("names distinct categories distinctly", () => {
    expect(categoryDescription("SEO", "de")).not.toBe(categoryDescription("Webshop", "de"));
    expect(tagDescription("a", "en")).not.toBe(tagDescription("b", "en"));
  });
});

describe("clampToWord", () => {
  it("leaves a text that already fits untouched", () => {
    expect(clampToWord("kurz genug", 40)).toBe("kurz genug");
  });

  it("never cuts inside a word", () => {
    const out = clampToWord("Alle Beiträge im Journal mit dem Tag Automatisierung", 30);
    expect(out.length).toBeLessThanOrEqual(30);
    expect(out.endsWith("…")).toBe(true);
    // Everything before the ellipsis is a whole word from the source.
    expect("Alle Beiträge im Journal mit dem Tag Automatisierung").toContain(
      out.slice(0, -1),
    );
  });

  it("does not leave dangling punctuation before the ellipsis", () => {
    expect(clampToWord("Beiträge im Journal, und mehr Text der nicht passt", 22)).not.toMatch(
      /[\s.,;:—–-]…$/,
    );
  });
});

describe("the blog's own site-level description", () => {
  it("fits the render budget in both languages", () => {
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.length, `${lang} is ${text.length} chars`).toBeLessThanOrEqual(
        RENDERED_META_LENGTH,
      );
      expect(text.length, lang).toBeGreaterThan(MIN_USEFUL);
    }
  });

  it("keeps the Germany-wide keyword target (root CLAUDE.md)", () => {
    expect(siteConfig.description.de).toContain("Digitalisierung für Unternehmen");
  });

  it("keeps the LOCAL signal, and inside the part that gets rendered", () => {
    // The blog is one of the two indexable properties, so it carries the same
    // local commitment as the landingpage.
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.slice(0, RENDERED_META_LENGTH), lang).toMatch(/Schwarzenbek/);
    }
  });

  it("ships two distinct languages with no stray whitespace", () => {
    expect(siteConfig.description.de).not.toBe(siteConfig.description.en);
    for (const [lang, text] of Object.entries(siteConfig.description)) {
      expect(text.trim(), lang).toBe(text);
      expect(text, lang).not.toMatch(/\s{2,}/);
    }
  });
});

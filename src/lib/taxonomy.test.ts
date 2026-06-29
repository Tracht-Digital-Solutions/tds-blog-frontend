import { describe, expect, it } from "vitest";
import { categorySlug } from "./taxonomy";

/**
 * categorySlug turns a free-text German category name into the URL slug
 * used by /kategorie/[slug]. Umlaut transliteration must match the
 * sections/tag convention or category links 404.
 */
describe("categorySlug", () => {
  it("lowercases and hyphenates multi-word names", () => {
    expect(categorySlug("Web Development")).toBe("web-development");
  });

  it("transliterates German umlauts and ß", () => {
    expect(categorySlug("Qualität & Maß")).toBe("qualitaet-mass");
    expect(categorySlug("Über uns")).toBe("ueber-uns");
  });

  it("collapses runs of punctuation into single hyphens", () => {
    expect(categorySlug("C++ / PHP")).toBe("c-php");
  });

  it("trims leading and trailing hyphens", () => {
    expect(categorySlug("  !Hello!  ")).toBe("hello");
  });
});

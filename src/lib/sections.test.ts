import { describe, expect, it } from "vitest";
import { splitSections } from "./sections";

/**
 * splitSections carves rendered article HTML at <h2> boundaries for the
 * collapsible-section UI + TOC. The anchor-id derivation (umlaut
 * transliteration, dedupe on repeated headings) and the intro/body
 * slicing are the parts a markdown change could quietly break.
 */
describe("splitSections", () => {
  it("returns the whole HTML as intro when there are no headings", () => {
    const html = "<p>Just a paragraph.</p>";
    const out = splitSections(html);
    expect(out.intro).toBe(html);
    expect(out.sections).toEqual([]);
  });

  it("splits intro + sections at each h2", () => {
    const html = "<p>Intro</p><h2>First</h2><p>A</p><h2>Second</h2><p>B</p>";
    const out = splitSections(html);

    expect(out.intro).toBe("<p>Intro</p>");
    expect(out.sections).toHaveLength(2);
    expect(out.sections[0].heading).toBe("First");
    expect(out.sections[0].html).toBe("<p>A</p>");
    expect(out.sections[1].html).toBe("<p>B</p>");
  });

  it("derives umlaut-transliterated anchor ids and strips inline tags", () => {
    const out = splitSections("<h2>Über <em>Qualität</em></h2><p>x</p>");
    expect(out.sections[0].id).toBe("ueber-qualitaet");
    expect(out.sections[0].heading).toBe("Über Qualität");
  });

  it("disambiguates duplicate headings so ids stay unique", () => {
    const out = splitSections("<h2>Fazit</h2><p>a</p><h2>Fazit</h2><p>b</p>");
    const ids = out.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("fazit");
  });

  it("falls back to 'abschnitt' for a heading with no sluggable chars", () => {
    const out = splitSections("<h2>!!!</h2><p>x</p>");
    expect(out.sections[0].id).toBe("abschnitt");
  });
});

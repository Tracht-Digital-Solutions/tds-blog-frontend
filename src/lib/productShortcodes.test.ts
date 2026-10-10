import { describe, expect, it } from "vitest";

import { faqFromSections } from "./articleFaq";
import { splitProductShortcodes, stripProductShortcodes } from "./productShortcodes";

describe("product shortcodes in markdown articles", () => {
  const html =
    '<p>Intro.</p>\n<p>{{produkt:fritzbox-7690}}</p>\n<p>Weiter.</p>\n<p id="x">{{product:yubikey-5c-nfc inline}}</p>';

  it("splits prose and products in order, with card as the default variant", () => {
    expect(splitProductShortcodes(html)).toEqual([
      { kind: "html", html: "<p>Intro.</p>\n" },
      { kind: "product", slug: "fritzbox-7690", variant: "card" },
      { kind: "html", html: "\n<p>Weiter.</p>\n" },
      { kind: "product", slug: "yubikey-5c-nfc", variant: "inline" },
    ]);
  });

  it("leaves a shortcode inside running text alone", () => {
    // Only a paragraph of its own is an embed; prose that mentions the syntax stays prose.
    const prose = "<p>Schreiben Sie {{produkt:slug}} in eine eigene Zeile.</p>";
    expect(splitProductShortcodes(prose)).toEqual([{ kind: "html", html: prose }]);
  });

  it("strips embeds for word counts and print", () => {
    expect(stripProductShortcodes(html)).not.toContain("{{");
    expect(stripProductShortcodes(html)).toContain("Weiter.");
  });
});

describe("FAQ from the article's own section", () => {
  it("reads ### questions under the FAQ heading and ignores other sections", () => {
    const faq = faqFromSections([
      { heading: "Einleitung", html: "<h3>Keine Frage</h3><p>Text</p>" },
      {
        heading: "Häufige Fragen",
        html: '<h3 id="a">Wie lange dauert es?</h3>\n<p>Etwa <strong>zwei</strong> Wochen.</p>\n<h3>Leer?</h3>\n<h3>Was kostet &amp; bringt es?</h3><p>Mehr als es kostet.</p>',
      },
    ]);
    expect(faq).toEqual([
      { q: "Wie lange dauert es?", a: "Etwa zwei Wochen." },
      { q: "Was kostet & bringt es?", a: "Mehr als es kostet." },
    ]);
  });

  it("yields nothing without an FAQ section", () => {
    expect(faqFromSections([{ heading: "Fazit", html: "<h3>Q</h3><p>A</p>" }])).toEqual([]);
  });
});

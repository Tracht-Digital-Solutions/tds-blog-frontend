import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { MAX_PER_LANG, renderLlmsTxt, type LlmsPost } from "./llmsTxt";
import { siteConfig } from "./seo";

/**
 * The file that had to stop being a file.
 *
 * `public/llms.txt` was hand-written and named **not one article** — it
 * described the journal in the abstract to a reader whose only purpose is to
 * learn what is published here. Nothing could report that, because nothing
 * read it except a crawler.
 *
 * So the assertions below are mostly about coverage: every article named, both
 * language URLs where a twin exists, and the cap honoured with a pointer to
 * the surfaces that carry the rest.
 */
const post = (over: Partial<LlmsPost> & Pick<LlmsPost, "slug" | "title">): LlmsPost => ({
  lang: "de",
  excerpt: "Ein Auszug.",
  category: "Werkstatt",
  publishedAt: "2026-09-01T10:00:00Z",
  ...over,
});

const de: LlmsPost[] = [
  post({ slug: "erster-artikel", title: "Der erste Artikel", publishedAt: "2026-09-10T10:00:00Z" }),
  post({ slug: "zweiter-artikel", title: "Der zweite Artikel", publishedAt: "2026-08-01T10:00:00Z" }),
];
const en: LlmsPost[] = [
  post({ slug: "erster-artikel", lang: "en", title: "The first article" }),
  post({ slug: "english-only", lang: "en", title: "English only", category: "Workshop" }),
];

const llms = renderLlmsTxt({ de, en });

describe("llms.txt", () => {
  it("names every German article and its URL", () => {
    for (const entry of de) {
      expect(llms, entry.slug).toContain(`**${entry.title}**`);
      expect(llms, entry.slug).toContain(`${siteConfig.url}/${entry.slug}`);
    }
  });

  it("names the English twin where one exists", () => {
    expect(llms).toContain(`${siteConfig.url}/en/erster-artikel`);
  });

  it("names an article that exists only in English", () => {
    // Otherwise the file would quietly claim the journal holds nothing the
    // German tree does not.
    expect(llms).toContain("**English only**");
    expect(llms).toContain(`${siteConfig.url}/en/english-only`);
  });

  it("lists the newest first", () => {
    expect(llms.indexOf("Der erste Artikel")).toBeLessThan(llms.indexOf("Der zweite Artikel"));
  });

  it("names both catalogue pages and both feeds", () => {
    expect(llms).toContain(`${siteConfig.url}/`);
    expect(llms).toContain(`${siteConfig.url}/en/`);
    expect(llms).toContain(`${siteConfig.url}/rss.xml`);
    expect(llms).toContain(`${siteConfig.url}/en/rss.xml`);
    expect(llms).toContain(`${siteConfig.url}/sitemap-index.xml`);
  });

  it("caps the list and says where the rest is", () => {
    const many = Array.from({ length: MAX_PER_LANG + 5 }, (_, i) =>
      post({
        slug: `artikel-${i}`,
        title: `Artikel ${i}`,
        publishedAt: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
      }),
    );
    const capped = renderLlmsTxt({ de: many, en: [] });
    expect(capped).toContain(`Das sind die ${MAX_PER_LANG} neuesten von ${many.length} Artikeln.`);
    expect(capped).toMatch(/Sitemap und im RSS-Feed/);
    // The five oldest are the ones left out.
    expect(capped).not.toContain("**Artikel 0**");
    expect(capped).toContain(`**Artikel ${many.length - 1}**`);
  });

  it("renders without any article at all", () => {
    // An unreachable API answers an empty corpus. The file must still be a
    // valid, truthful document rather than a half-written one.
    const empty = renderLlmsTxt({ de: [], en: [] });
    expect(empty).toContain("# TDS Journal");
    expect(empty).not.toContain("## Artikel");
    expect(empty).toContain("## Maschinenlesbare Quellen");
  });

  it("stays one small file", () => {
    expect(llms).not.toMatch(/llms-full/);
  });

  it("has no static copy to shadow the route", () => {
    expect(existsSync(resolve(process.cwd(), "public/llms.txt"))).toBe(false);
  });
});

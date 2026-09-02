import { afterEach, describe, expect, it, vi } from "vitest";

import { absolute, renderSitemapIndex, renderUrlset, type SitemapUrl } from "./sitemap";

/**
 * The sitemap document, and the rules that make it valid.
 *
 * None of this was covered before: the module is hand-written precisely because
 * `@astrojs/sitemap` could not see server-rendered routes, and what replaced it
 * had no test. The failure it guards against is the one this codebase keeps
 * meeting — a well-formed file that is quietly wrong, with nothing red.
 */

const LAST = "2026-09-02";

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function alternates(xml: string): string[] {
  return [...xml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]} ${m[2]}`);
}

const plain = (path: string): SitemapUrl => ({ path, changefreq: "weekly", priority: 0.5 });
const article = (slug: string): SitemapUrl => ({
  path: `/${slug}`,
  changefreq: "monthly",
  priority: 0.8,
  alternate: { de: `/${slug}`, en: `/en/${slug}` },
});

describe("renderUrlset", () => {
  it("emits one url per entry, absolute", () => {
    expect(locs(renderUrlset([plain("/aktuelles")], LAST))).toEqual([absolute("/aktuelles")]);
  });

  it("gives an article the reciprocal de/en/x-default block", () => {
    // Search Console treats a set as valid only when the two URLs name each
    // other, and post-level hreflang also lives in the Layout head — the two
    // must agree, which is why both are emitted from this one list.
    expect(alternates(renderUrlset([article("mein-artikel")], LAST))).toEqual([
      `de-DE ${absolute("/mein-artikel")}`,
      `en-GB ${absolute("/en/mein-artikel")}`,
      `x-default ${absolute("/mein-artikel")}`,
    ]);
  });

  it("emits NO alternates for a page whose trees do not mirror", () => {
    // `/kategorie/…` vs `/en/category/…` — inventing a prefix twin here would
    // point an alternate at a 404 and invalidate the set.
    expect(alternates(renderUrlset([plain("/kategorie/recht")], LAST))).toEqual([]);
  });

  it("declares the xhtml namespace the alternates need", () => {
    // Without it they are unnamespaced elements every consumer ignores, and
    // the file still validates.
    expect(renderUrlset([article("x")], LAST)).toContain(
      'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    );
  });

  it("writes priority with one decimal and the given lastmod", () => {
    const xml = renderUrlset([{ path: "/", changefreq: "daily", priority: 1 }], LAST);
    expect(xml).toContain("<priority>1.0</priority>");
    expect(xml).toContain(`<lastmod>${LAST}</lastmod>`);
  });

  it("escapes XML metacharacters in a slug", () => {
    // A slug is data. One unescaped `&` makes the document unparseable, which
    // a crawler reports as "could not read", not "page missing".
    expect(renderUrlset([plain("/a&b")], LAST)).toContain("&amp;");
  });

  it("produces an empty urlset rather than malformed XML for no entries", () => {
    const xml = renderUrlset([], LAST);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("</urlset>");
    expect(locs(xml)).toEqual([]);
  });
});

describe("renderSitemapIndex", () => {
  it("names the file robots.txt advertises", () => {
    // The filenames are the ones `@astrojs/sitemap` produced and Search Console
    // already knows; renaming either orphans the entry point.
    expect(renderSitemapIndex(LAST)).toContain(`<loc>${absolute("/sitemap-0.xml")}</loc>`);
  });
});

describe("sitemapUrls", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  async function pathsWith(patterns: string[]): Promise<string[]> {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).includes("sitemap-exclusions")) {
          return new Response(JSON.stringify({ paths: patterns }), { status: 200 });
        }
        // No content API — `content-api.ts` falls back to the demo corpus.
        return new Response("no", { status: 500 });
      }),
    );
    const mod = await import("./sitemap");
    return (await mod.sitemapUrls()).map((u) => u.path);
  }

  it("lists both trees, the archive entry points and the articles", async () => {
    const paths = await pathsWith([]);
    expect(paths).toContain("/");
    expect(paths).toContain("/en/");
    expect(paths).toContain("/aktuelles");
    expect(paths).toContain("/digitalisierung-faengt-klein-an");
    expect(paths).toContain("/en/digitalisierung-faengt-klein-an");
  });

  it("omits /install, the print views and the OG endpoints", async () => {
    const paths = await pathsWith([]);
    expect(paths).not.toContain("/install");
    expect(paths.some((p) => p.endsWith("/print"))).toBe(false);
    expect(paths.some((p) => p.startsWith("/og/"))).toBe(false);
  });

  it("drops an article from BOTH trees when either URL is excluded", async () => {
    // The load-bearing case: an article carries reciprocal alternates, so a
    // half-removed pair would leave the survivor naming a page that is gone.
    for (const pattern of ["/digitalisierung-faengt-klein-an", "/en/digitalisierung-faengt-klein-an"]) {
      const paths = await pathsWith([pattern]);
      expect(paths).not.toContain("/digitalisierung-faengt-klein-an");
      expect(paths).not.toContain("/en/digitalisierung-faengt-klein-an");
    }
  });

  it("drops one taxonomy page per tree for an exact pattern", async () => {
    // Taxonomy slugs are NOT a translation pair — a category page is named
    // after the category, and the category itself is translated
    // ("Digitalisierung" / "Digitalization"). So an exact German pattern hits
    // the German page only, which is correct: the English URL is a different
    // string that the operator did not write and could not guess. It is also
    // harmless, because these pages carry no alternates to strand.
    const before = await pathsWith([]);
    const de = before.find((p) => p.startsWith("/kategorie/"));
    expect(de).toBeDefined();

    const after = await pathsWith([de as string]);
    expect(after).not.toContain(de);
    expect(after.some((p) => p.startsWith("/en/category/"))).toBe(true);
  });

  it("honours a prefix pattern across a whole subtree", async () => {
    const paths = await pathsWith(["/tag/*"]);
    expect(paths.some((p) => p.startsWith("/tag/"))).toBe(false);
    expect(paths.some((p) => p.startsWith("/en/tag/"))).toBe(false);
    expect(paths).toContain("/");
  });

  it("is unchanged by an empty list", async () => {
    expect(await pathsWith([])).toEqual(await pathsWith([]));
  });
});

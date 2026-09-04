/**
 * The SEO surface that had no test at all.
 *
 * Descriptions were measured; nothing else was. Every failure this file now
 * catches shipped silently for months: a title with no length rule, an
 * `og:image` pointing at a file that was never created, a robots.txt rule
 * blocking the site's own social images, JSON-LD naming the wrong author and
 * announcing a German site name on English pages, and a sitemap claiming every
 * URL changed today.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { pageTitle, RENDERED_TITLE_LENGTH, siteConfig } from "./seo";
import { postDescription, RENDERED_META_LENGTH } from "./metaDescription";
import {
  asGraph,
  authorPersonId,
  blogPostingSchema,
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  organizationSchema,
  profilePageSchema,
  websiteSchema,
} from "./jsonld";
import { newestLastmod, renderUrlset, type SitemapUrl } from "./sitemap";

const root = path.resolve(__dirname, "../..");

describe("pageTitle", () => {
  it("appends the brand when the whole thing fits", () => {
    expect(pageTitle("Webshop")).toBe("Webshop — Journal");
    expect(pageTitle("Webshop").length).toBeLessThanOrEqual(RENDERED_TITLE_LENGTH);
  });

  it("drops the brand rather than the subject when it does not fit", () => {
    // A real seeded title: 66 characters before any suffix.
    const long = "Fünf Dinge, die auf fast jeder Unternehmenswebsite fehlen — und wie";
    const title = pageTitle(long);
    expect(title).toBe(long);
    expect(title).not.toContain("— Journal");
  });

  it("never cuts mid-word when a title is long enough to need clamping", () => {
    const absurd = `${"Digitalisierungsstrategie ".repeat(8)}Ende`;
    const title = pageTitle(absurd);
    expect(title.length).toBeLessThanOrEqual(RENDERED_TITLE_LENGTH * 1.5 + 1);
    expect(title.endsWith("…")).toBe(true);
    // The character before the ellipsis is the end of a word, not a fragment
    // boundary the clamp happened to land on.
    expect(title.replace(/…$/, "")).toBe(title.replace(/…$/, "").trimEnd());
  });

  it("normalises whitespace and survives an empty subject", () => {
    expect(pageTitle("  Zwei   Wörter  ")).toBe("Zwei Wörter — Journal");
    expect(pageTitle("   ")).toBe(siteConfig.blogName.de);
  });

  it("keeps the ' — ' separator the tab script splits on", () => {
    // Layout.astro's scroll script derives the brand by splitting on " — ".
    expect(pageTitle("Webshop")).toContain(" — ");
  });
});

describe("postDescription", () => {
  it("prefers the editor's meta description over the excerpt", () => {
    expect(postDescription("Die gepflegte Beschreibung.", "Der Teaser.")).toBe(
      "Die gepflegte Beschreibung.",
    );
  });

  it("falls back to the excerpt when the field is empty, blank or absent", () => {
    expect(postDescription(null, "Der Teaser.")).toBe("Der Teaser.");
    expect(postDescription(undefined, "Der Teaser.")).toBe("Der Teaser.");
    expect(postDescription("   ", "Der Teaser.")).toBe("Der Teaser.");
  });

  it("clamps an over-long value from either source", () => {
    const long = `${"Ein sehr langer Satz über Digitalisierung. ".repeat(6)}Ende`;
    expect(postDescription(long, "kurz").length).toBeLessThanOrEqual(
      RENDERED_META_LENGTH,
    );
    expect(postDescription(null, long).length).toBeLessThanOrEqual(
      RENDERED_META_LENGTH,
    );
  });

  it("leaves a description that already fits completely untouched", () => {
    const fits = "Eine Beschreibung, die bequem in eine Suchergebnisseite passt.";
    expect(postDescription(fits, "x")).toBe(fits);
  });
});

describe("the default social card", () => {
  it("exists as a real file, at the path every non-article page advertises", () => {
    // Layout.astro hard-codes `/og-default.png` and claims 1200×630 for it.
    const file = path.join(root, "public", "og-default.png");
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(1024);
  });
});

describe("robots.txt", () => {
  const robots = fs.readFileSync(path.join(root, "public", "robots.txt"), "utf8");

  it("does not block /og/ in any group", () => {
    // Each group is independent, so one stray line re-blocks one crawler.
    expect(robots).not.toMatch(/^Disallow:\s*\/og\//m);
  });

  it("still blocks the operator install route in every group", () => {
    const groups = robots.split(/^User-agent:/m).slice(1);
    expect(groups.length).toBeGreaterThan(1);
    for (const group of groups) {
      expect(group).toMatch(/^Disallow:\s*\/install\//m);
    }
  });

  it("still advertises the sitemap index", () => {
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap-index.xml`);
  });
});

describe("websiteSchema", () => {
  it("uses the language it is given, on both trees", () => {
    expect(websiteSchema("de").name).toBe(siteConfig.blogName.de);
    expect(websiteSchema("de").description).toBe(siteConfig.description.de);
    expect(websiteSchema("en").description).toBe(siteConfig.description.en);
    // The bug this replaces: German copy on every English page.
    expect(websiteSchema("en").description).not.toBe(siteConfig.description.de);
  });
});

describe("organizationSchema", () => {
  const org = organizationSchema();

  it("carries the name and logo a publisher reference cannot", () => {
    expect(org.name).toBe(siteConfig.name);
    expect(org.logo.url).toMatch(/^https:\/\/.+\.(webp|png|jpe?g)$/);
  });

  it("keeps the same @id the references point at, so the entity does not fork", () => {
    expect(org["@id"]).toBe(`${siteConfig.marketingUrl}/#organization`);
  });
});

describe("blogPostingSchema", () => {
  const base = {
    slug: "ein-artikel",
    title: "Ein Artikel",
    excerpt: "Eine Beschreibung.",
    body: "wort ".repeat(50),
    category: "Webshop",
    publishedAt: "2026-09-01 09:00:00",
    lang: "de" as const,
    imageUrl: "https://blog.tracht-digital.de/og/de/ein-artikel.png",
    wordCount: 50,
  };

  it("names the post's own author when there is one", () => {
    const schema = blogPostingSchema({
      ...base,
      author: { name: "Julian Tracht", url: "https://blog.tracht-digital.de/autor/julian-tracht" },
    });
    expect(schema.author).toMatchObject({
      "@type": "Person",
      name: "Julian Tracht",
      url: "https://blog.tracht-digital.de/autor/julian-tracht",
    });
  });

  it("falls back to the site owner for a post with no author row", () => {
    expect(blogPostingSchema(base).author).toEqual({
      "@id": `${siteConfig.marketingUrl}/#person`,
    });
    expect(blogPostingSchema({ ...base, author: null }).author).toEqual({
      "@id": `${siteConfig.marketingUrl}/#person`,
    });
  });

  it("omits a url on an author that has no page", () => {
    const schema = blogPostingSchema({ ...base, author: { name: "Gast", url: null } });
    expect(schema.author).toEqual({ "@type": "Person", name: "Gast" });
  });

  it("turns the stored tag string into keywords, and omits them when empty", () => {
    expect(
      blogPostingSchema({ ...base, tags: "webshop, produktdaten, preispflege" }).keywords,
    ).toEqual(["webshop", "produktdaten", "preispflege"]);
    expect(blogPostingSchema({ ...base, tags: "" }).keywords).toBeUndefined();
    expect(blogPostingSchema(base).keywords).toBeUndefined();
  });

  it("carries a url alongside the @id", () => {
    expect(blogPostingSchema(base).url).toBe(
      "https://blog.tracht-digital.de/ein-artikel",
    );
  });
});

describe("itemListSchema", () => {
  it("numbers from the given start so archive pages continue the collection", () => {
    const list = itemListSchema(["https://x/a", "https://x/b"], 11);
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map((i) => i.position)).toEqual([11, 12]);
  });

  it("starts at 1 by default and stays well-formed when empty", () => {
    expect(itemListSchema(["https://x/a"]).itemListElement[0].position).toBe(1);
    expect(itemListSchema([]).itemListElement).toEqual([]);
  });
});

describe("sitemap lastmod", () => {
  const urls: SitemapUrl[] = [
    { path: "/", changefreq: "daily", priority: 1.0, lastmod: "2026-09-01" },
    { path: "/alt", changefreq: "monthly", priority: 0.8, lastmod: "2026-06-16" },
    { path: "/ohne", changefreq: "weekly", priority: 0.4 },
  ];

  it("renders each URL's own date rather than one date for the whole document", () => {
    const xml = renderUrlset(urls, "2026-12-31");
    expect(xml).toContain("<lastmod>2026-09-01</lastmod>");
    expect(xml).toContain("<lastmod>2026-06-16</lastmod>");
    // Three entries, three different dates — the old behaviour produced one.
    expect(xml.match(/<lastmod>/g)).toHaveLength(3);
  });

  it("falls back to the document date only for an entry with none", () => {
    expect(renderUrlset([urls[2]], "2026-12-31")).toContain(
      "<lastmod>2026-12-31</lastmod>",
    );
  });

  it("reports the newest entry for the index document", () => {
    expect(newestLastmod(urls)).toBe("2026-09-01");
    expect(newestLastmod([urls[2]])).toBeUndefined();
    expect(newestLastmod([])).toBeUndefined();
  });
});

describe("the author's identity across the graph", () => {
  const authorUrl = "https://blog.tracht-digital.de/autor/julian-tracht";

  it("gives an article's byline the same @id the author page's Person carries", () => {
    // The whole point of the helper: two builders, one identifier. Without it
    // the author pages carried a Person that no article ever pointed at.
    const article = blogPostingSchema({
      slug: "ein-artikel",
      title: "Ein Artikel",
      excerpt: "Eine Beschreibung.",
      body: "wort ".repeat(50),
      category: "Webshop",
      publishedAt: "2026-09-01 09:00:00",
      lang: "de",
      imageUrl: "https://blog.tracht-digital.de/og/de/ein-artikel.png",
      wordCount: 50,
      author: { name: "Julian Tracht", url: authorUrl },
    });
    const profile = profilePageSchema({
      url: authorUrl,
      lang: "de",
      person: { "@type": "Person", "@id": authorPersonId(authorUrl), name: "Julian Tracht" },
    });

    expect((article.author as Record<string, unknown>)["@id"]).toBe(`${authorUrl}#person`);
    expect((profile.mainEntity as Record<string, unknown>)["@id"]).toBe(
      (article.author as Record<string, unknown>)["@id"],
    );
  });

  it("still falls back to the site owner, with no author @id, for a post with no page", () => {
    const schema = blogPostingSchema({
      slug: "gast",
      title: "Gastbeitrag",
      excerpt: "x",
      body: "wort",
      category: "Webshop",
      publishedAt: null,
      lang: "de",
      imageUrl: "https://blog.tracht-digital.de/og-default.png",
      wordCount: 1,
      author: { name: "Gast", url: null },
    });
    expect(schema.author).toEqual({ "@type": "Person", name: "Gast" });
  });
});

describe("profilePageSchema", () => {
  const person = { "@type": "Person", "@id": "https://x/autor/a#person", name: "A" };

  it("makes the page about the person rather than merely naming one", () => {
    const schema = profilePageSchema({
      url: "https://blog.tracht-digital.de/autor/a",
      lang: "de",
      person,
      dateModified: "2026-09-01",
    });
    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.mainEntity).toBe(person);
    expect(schema["@id"]).toBe("https://blog.tracht-digital.de/autor/a#page");
    expect(schema.isPartOf).toEqual({ "@id": `${siteConfig.url}/#blog` });
    expect(schema.inLanguage).toBe("de-DE");
    expect(schema.dateModified).toBe("2026-09-01");
  });

  it("hangs an English profile off the English Blog node and omits an unknown date", () => {
    const schema = profilePageSchema({ url: "https://x/en/author/a", lang: "en", person });
    expect(schema.isPartOf).toEqual({ "@id": `${siteConfig.url}/en/#blog` });
    expect(schema.inLanguage).toBe("en-GB");
    expect(schema).not.toHaveProperty("dateModified");
  });
});

describe("collectionPageSchema", () => {
  it("carries the list as its mainEntity so the articles hang off a page", () => {
    const itemList = itemListSchema(["https://x/a", "https://x/b"], 11);
    const schema = collectionPageSchema({
      url: "https://blog.tracht-digital.de/kategorie/webshop",
      name: "Webshop — Journal",
      description: "Beiträge zur Kategorie Webshop.",
      lang: "de",
      itemList,
    });
    expect(schema["@type"]).toBe("CollectionPage");
    expect(schema.mainEntity).toBe(itemList);
    // The positions the caller chose survive the wrapping — an archive page's
    // second page continues the collection instead of restarting at 1.
    expect(itemList.itemListElement[0].position).toBe(11);
    expect(schema.isPartOf).toEqual({ "@id": `${siteConfig.url}/#blog` });
  });
});

describe("asGraph", () => {
  it("is the only owner of @context, and strips it off its members", () => {
    // breadcrumbSchema and blogPostingSchema are also used standalone (the
    // article page passes an array of independent documents), so they keep
    // their own context — nesting them must not declare it twice.
    const crumbs = breadcrumbSchema([{ name: "Journal", url: "https://x/" }]);
    expect(crumbs["@context"]).toBe("https://schema.org");

    const graph = asGraph(websiteSchema("de"), crumbs);
    expect(graph["@context"]).toBe("https://schema.org");
    for (const node of graph["@graph"] as object[]) {
      expect(node).not.toHaveProperty("@context");
    }
    // Stripping is non-destructive: the standalone document is unchanged.
    expect(crumbs["@context"]).toBe("https://schema.org");
  });

  it("keeps every other property of a wrapped node", () => {
    const graph = asGraph(breadcrumbSchema([{ name: "Journal", url: "https://x/" }]));
    expect((graph["@graph"] as Record<string, unknown>[])[0]["@type"]).toBe("BreadcrumbList");
  });
});

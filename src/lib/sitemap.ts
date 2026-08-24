/**
 * The sitemap, built from the corpus.
 *
 * ### Why this is hand-written now
 *
 * `@astrojs/sitemap` derives its entries from the routes the build EMITS.
 * Under `output: "server"` the articles, taxonomy pages and archive pages are
 * not emitted, so the integration would have shipped a sitemap containing only
 * `/install` and the error pages it used to filter out — a technically valid
 * file listing nothing anybody should index, with nothing red anywhere.
 *
 * ### No prefix-derived hreflang, deliberately
 *
 * The two language trees do not mirror: `/kategorie/…` vs `/en/category/…`,
 * `/autor/…` vs `/en/author/…`, and per-language tag sets and page counts.
 * Article slugs DO mirror (`/x` ↔ `/en/x`), so those get alternates and
 * nothing else does. Post-level hreflang also lives in the Layout `<head>`;
 * Search Console only treats a set as valid when the head and the sitemap
 * agree, which is why both are emitted from the same list here.
 */

import { corpus, type Lang } from "./routes";
import { PAGE_SIZE } from "./pagination";
import { categorySlug } from "./taxonomy";
import { siteConfig } from "./seo";

const PREFIX: Record<Lang, string> = { de: "", en: "/en" };
const SEGMENTS: Record<Lang, { category: string; author: string }> = {
  de: { category: "kategorie", author: "autor" },
  en: { category: "category", author: "author" },
};

export interface SitemapUrl {
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
  /** The other language's path, when the two really mirror. */
  alternate?: { de: string; en: string };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Absolute URL for a path on this site. */
export function absolute(path: string): string {
  return new URL(path, siteConfig.url).href;
}

/** Every indexable URL of one language tree. */
async function urlsFor(lang: Lang): Promise<SitemapUrl[]> {
  const p = PREFIX[lang];
  const s = SEGMENTS[lang];
  const posts = await corpus(lang);

  const urls: SitemapUrl[] = [
    { path: `${p}/`, changefreq: "daily", priority: 1.0 },
    { path: `${p}/aktuelles`, changefreq: "weekly", priority: 0.6 },
  ];

  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  for (let n = 2; n <= pageCount; n++) {
    urls.push({ path: `${p}/page/${n}`, changefreq: "weekly", priority: 0.4 });
  }

  const categories = new Set<string>();
  const tags = new Set<string>();
  const authors = new Set<string>();

  for (const post of posts) {
    urls.push({
      path: `${p}/${post.slug}`,
      changefreq: "monthly",
      priority: 0.8,
      // Slugs are shared across both trees — a post authored in one language
      // is machine-translated into the other, so both URLs always exist.
      alternate: { de: `/${post.slug}`, en: `/en/${post.slug}` },
    });

    const category = post.category?.trim();
    if (category) {
      const slug = categorySlug(category);
      if (slug) categories.add(slug);
    }
    for (const tag of (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase())) {
      if (tag) tags.add(tag);
    }
    if (post.author?.slug) authors.add(post.author.slug);
  }

  for (const slug of [...categories].sort()) {
    urls.push({ path: `${p}/${s.category}/${slug}`, changefreq: "weekly", priority: 0.5 });
  }
  for (const tag of [...tags].sort()) {
    urls.push({ path: `${p}/tag/${encodeURIComponent(tag)}`, changefreq: "weekly", priority: 0.4 });
  }
  for (const slug of [...authors].sort()) {
    urls.push({ path: `${p}/${s.author}/${slug}`, changefreq: "weekly", priority: 0.4 });
  }

  return urls;
}

/**
 * Every indexable URL, both trees.
 *
 * The print views, the OG endpoints, `/install`, the JSON index and the error
 * pages are absent — they were excluded by the old integration's `filter` and
 * the reasons have not changed. `/install` matters most: it is a noindex
 * operator page and listing it would invite a crawler to it.
 */
export async function sitemapUrls(): Promise<SitemapUrl[]> {
  const [de, en] = await Promise.all([urlsFor("de"), urlsFor("en")]);
  return [...de, ...en];
}

export function renderUrlset(urls: SitemapUrl[], lastmod: string): string {
  const body = urls
    .map((url) => {
      const alternates = url.alternate
        ? [
            `<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(absolute(url.alternate.de))}"/>`,
            `<xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(absolute(url.alternate.en))}"/>`,
            `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(url.alternate.de))}"/>`,
          ].join("")
        : "";
      return [
        "<url>",
        `<loc>${escapeXml(absolute(url.path))}</loc>`,
        alternates,
        `<lastmod>${escapeXml(lastmod)}</lastmod>`,
        `<changefreq>${url.changefreq}</changefreq>`,
        `<priority>${url.priority.toFixed(1)}</priority>`,
        "</url>",
      ].join("");
    })
    .join("");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    body +
    "</urlset>"
  );
}

/**
 * The index document.
 *
 * The filenames are the ones `@astrojs/sitemap` produced and `public/robots.txt`
 * advertises; changing them would orphan the entry point Search Console knows.
 */
export function renderSitemapIndex(lastmod: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    "<sitemap>" +
    `<loc>${escapeXml(absolute("/sitemap-0.xml"))}</loc>` +
    `<lastmod>${escapeXml(lastmod)}</lastmod>` +
    "</sitemap>" +
    "</sitemapindex>"
  );
}

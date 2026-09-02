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
import { exclusionPatterns, groupExcluded, hreflangGroup } from "./sitemapExclusions";

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
  /**
   * `YYYY-MM-DD`, derived from the newest post the URL actually shows.
   *
   * Every entry used to carry today's date, so the document claimed the whole
   * site had changed on every single fetch — which tells a crawler exactly as
   * much as saying nothing, and costs the signal on the pages that really did
   * change. Omitted when a URL has no post behind it; `renderUrlset` then falls
   * back to the document date.
   *
   * The source is `publishedAt`, not a modification timestamp: the list payload
   * from the content-API carries no `updatedAt` (`BlogCmsModule` sets it only
   * on the full-post read). Publication date understates an edited article,
   * which is the harmless direction — overstating is what "today" did.
   */
  lastmod?: string;
}

/** `YYYY-MM-DD` of the newest post in a set, or undefined for an empty one. */
function newestDate(posts: ReadonlyArray<{ publishedAt?: string | null }>): string | undefined {
  let newest: string | undefined;
  for (const post of posts) {
    const day = (post.publishedAt ?? "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    if (!newest || day > newest) newest = day;
  }
  return newest;
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

  // Newest first, so an archive page's slice and every "newest post" below are
  // taken from the same order the pages themselves render in.
  const ordered = [...posts].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const siteNewest = newestDate(ordered);

  const urls: SitemapUrl[] = [
    { path: `${p}/`, changefreq: "daily", priority: 1.0, lastmod: siteNewest },
    { path: `${p}/aktuelles`, changefreq: "weekly", priority: 0.6, lastmod: siteNewest },
    // The human-facing RSS explainer, not the feed. It is an ordinary
    // indexable page that carries a canonical and alternates like any other,
    // and it was the one such page missing from this list.
    { path: `${p}/rss`, changefreq: "monthly", priority: 0.3, lastmod: siteNewest },
  ];

  const pageCount = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  for (let n = 2; n <= pageCount; n++) {
    urls.push({
      path: `${p}/page/${n}`,
      changefreq: "weekly",
      priority: 0.4,
      // An archive page shows one slice, and an older page genuinely does not
      // change when a new article appears at the front.
      lastmod: newestDate(ordered.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE)),
    });
  }

  const categories = new Map<string, typeof ordered>();
  const tags = new Map<string, typeof ordered>();
  const authors = new Map<string, typeof ordered>();

  const collect = (map: Map<string, typeof ordered>, key: string, post: (typeof ordered)[number]) => {
    const bucket = map.get(key);
    if (bucket) bucket.push(post);
    else map.set(key, [post]);
  };

  for (const post of ordered) {
    urls.push({
      path: `${p}/${post.slug}`,
      changefreq: "monthly",
      priority: 0.8,
      // Slugs are shared across both trees — a post authored in one language
      // is machine-translated into the other, so both URLs always exist.
      alternate: { de: `/${post.slug}`, en: `/en/${post.slug}` },
      lastmod: newestDate([post]),
    });

    const category = post.category?.trim();
    if (category) {
      const slug = categorySlug(category);
      if (slug) collect(categories, slug, post);
    }
    for (const tag of (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase())) {
      if (tag) collect(tags, tag, post);
    }
    if (post.author?.slug) collect(authors, post.author.slug, post);
  }

  for (const slug of [...categories.keys()].sort()) {
    urls.push({
      path: `${p}/${s.category}/${slug}`,
      changefreq: "weekly",
      priority: 0.5,
      lastmod: newestDate(categories.get(slug)!),
    });
  }
  for (const tag of [...tags.keys()].sort()) {
    urls.push({
      path: `${p}/tag/${encodeURIComponent(tag)}`,
      changefreq: "weekly",
      priority: 0.4,
      lastmod: newestDate(tags.get(tag)!),
    });
  }
  for (const slug of [...authors.keys()].sort()) {
    urls.push({
      path: `${p}/${s.author}/${slug}`,
      changefreq: "weekly",
      priority: 0.4,
      lastmod: newestDate(authors.get(slug)!),
    });
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
  const [de, en, patterns] = await Promise.all([
    urlsFor("de"),
    urlsFor("en"),
    exclusionPatterns(),
  ]);
  const urls = [...de, ...en];
  if (patterns.length === 0) return urls;

  // Matched against the whole language group, never the single URL — and via
  // `hreflangGroup`, which knows that this site's trees are not a prefix pair
  // (`/kategorie/…` ↔ `/en/category/…`, `/autor/…` ↔ `/en/author/…`).
  //
  // Two reasons it must be the group even for pages that carry no alternates.
  // For an article it is correctness: the entries name each other, so removing
  // one side would leave the other pointing at a page no longer offered, and a
  // single dangling alternate invalidates the set on both sides. For a tag or
  // category page it is intent: `/tag/*` means "the tag pages", and an operator
  // who has to write the English spelling separately will one day write only
  // one of them and believe both are gone.
  return urls.filter((url) => !groupExcluded(hreflangGroup(url.path), patterns));
}

/**
 * The newest per-URL `lastmod` in a set — the date the index should carry.
 *
 * Undefined only when nothing in the list has a post behind it (an empty or
 * unreachable corpus), in which case the caller supplies the document date.
 */
export function newestLastmod(urls: readonly SitemapUrl[]): string | undefined {
  let newest: string | undefined;
  for (const url of urls) {
    if (url.lastmod && (!newest || url.lastmod > newest)) newest = url.lastmod;
  }
  return newest;
}

/** `lastmod` is the fallback for entries that carry no date of their own. */
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
        `<lastmod>${escapeXml(url.lastmod ?? lastmod)}</lastmod>`,
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

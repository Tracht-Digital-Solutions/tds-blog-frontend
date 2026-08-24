/**
 * This site's half of the page cache: which pages a content change dates, and
 * the memo that a rebuild throws away.
 *
 * The API sends *what changed* (`{type:"post", id:"mein-artikel", lang:"de"}`);
 * this file answers *which of my pages that is*. It is the richest of the three
 * sites' maps, and that richness is exactly why the API must not own it: one
 * saved article dates its own page, its print view, the journal index, the
 * paginated archive, its category, each of its tags, its author page, the feed,
 * the "Für Sie" index and the sitemap — and the English routes are not a prefix
 * of the German ones (`/kategorie/…` vs `/en/category/…`, `/autor/…` vs
 * `/en/author/…`).
 */

import {
  createGenerationCache,
  forLanguages,
  type CacheEvent,
  type EventMap,
} from "@tracht-digital-solutions/tds-shared/cache";

import { corpus, type Lang, type PostSummary } from "./routes";
import { categorySlug } from "./taxonomy";

/**
 * The one memo every content fetch on this site shares.
 *
 * It replaces the module-level caches `content-api.ts`, `taxonomy.ts` and
 * `translate.ts` used to keep. Those were right while this site was a static
 * build — one process, one walk of the corpus, then exit — and become
 * *permanent* under SSR: the server would answer with the corpus it read at
 * boot, for the life of the process, and a cache rebuild would faithfully
 * re-render that stale content and report success.
 */
export const contentCache = createGenerationCache();

/** Language-tree prefix. German lives at the root. */
const prefix = (lang: Lang) => (lang === "de" ? "" : "/en");

/** Taxonomy segment names differ per tree — they do not mirror by prefix. */
const segments = {
  de: { category: "kategorie", author: "autor" },
  en: { category: "category", author: "author" },
} as const;

/**
 * The pages that LIST articles, per language.
 *
 * Every archive page is included because pagination shifts: publishing one
 * article pushes the last item of every page onto the next, so rebuilding only
 * page 1 leaves the rest showing one article twice and hiding another. The
 * page count is derived from the corpus rather than guessed.
 */
async function indexPages(lang: Lang): Promise<string[]> {
  const p = prefix(lang);
  const posts = await corpus(lang);
  const pageCount = Math.max(1, Math.ceil(posts.length / 10));
  const archive: string[] = [];
  for (let n = 2; n <= pageCount; n++) archive.push(`${p}/page/${n}`);

  return [
    `${p}/`,
    ...archive,
    `${p}/aktuelles`,
    `${p}/rss.xml`,
    // The "Für Sie" island fetches this at runtime instead of hitting the
    // content API, so a new article is invisible to it until this is rebuilt.
    "/interests-index.json",
    "/sitemap-0.xml",
  ];
}

/** The taxonomy pages one article appears on, in its own language tree. */
function taxonomyPages(post: PostSummary, lang: Lang): string[] {
  const p = prefix(lang);
  const s = segments[lang];
  const out: string[] = [];

  const category = post.category?.trim();
  if (category) {
    const slug = categorySlug(category);
    if (slug) out.push(`${p}/${s.category}/${slug}`);
  }

  for (const tag of (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase())) {
    if (tag) out.push(`${p}/tag/${encodeURIComponent(tag)}`);
  }

  if (post.author?.slug) out.push(`${p}/${s.author}/${post.author.slug}`);

  return out;
}

/**
 * The route table, as the cache sees it.
 *
 * **The taxonomy pages are resolved by LOOKING THE ARTICLE UP**, which is why
 * the resolver is async. Category, tags and author are properties of the
 * article, not of the event, so without the lookup a save would never refresh
 * the category page that lists it.
 *
 * One limit worth stating plainly: this covers the article's CURRENT taxonomy.
 * Re-categorising an article leaves its former category page listing it, and
 * nothing in the event carries the old value. That is what "alles neu bauen"
 * is for, and it is a deliberate trade rather than an oversight.
 */
export const cacheEvents: EventMap = {
  /** An article was saved, published, unpublished or deleted. */
  post: async (event: CacheEvent) => {
    const slug = event.id;
    const langs: Lang[] =
      event.lang === "de" || event.lang === "en" ? [event.lang] : ["de", "en"];

    const paths: string[] = [];
    for (const lang of langs) {
      paths.push(...(await indexPages(lang)));
      if (!slug) continue;

      const p = prefix(lang);
      paths.push(`${p}/${slug}`, `${p}/${slug}/print`);

      const post = (await corpus(lang)).find((candidate) => candidate.slug === slug);
      if (post) paths.push(...taxonomyPages(post, lang));
    }
    return paths;
  },

  /**
   * A landing content block changed.
   *
   * The blog reads `/content/landing` too — its cookie-banner switch and the
   * AdSense configuration live in that site's blocks, and both appear on every
   * page here. Only the entry points are rebuilt; the rest of the corpus
   * catches up on the next "alles neu bauen", because rebuilding every article
   * for a banner toggle would be a denial of service against our own API.
   */
  block: (event: CacheEvent) => forLanguages(event, (lang) => [prefix(lang) + "/"]),

  /** The legal documents live on the landingpage; nothing here shows them. */
  legal: () => [],
};

/**
 * Pages a "rebuild everything" must include even when nothing is cached yet.
 *
 * Articles are deliberately absent: the cache cannot know the corpus, and
 * enumerating it here would be a fourth copy of the route table. "Rebuild
 * everything" covers whatever is already cached plus these entry points, which
 * is what an operator means by it.
 */
export const alwaysPaths = [
  "/",
  "/en/",
  "/aktuelles",
  "/en/aktuelles",
  "/rss.xml",
  "/en/rss.xml",
  "/interests-index.json",
  "/sitemap-0.xml",
  "/sitemap-index.xml",
];

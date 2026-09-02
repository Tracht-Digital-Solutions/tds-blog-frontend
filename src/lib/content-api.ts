/**
 * This site's client for the composed content API (`/content/*`).
 *
 * It used to be a BUILD-time client — `getStaticPaths` and page frontmatter
 * called it during the SSG build, so none of it ran for a reader. Under
 * `output: "server"` these run per REQUEST, on a page-cache miss, and that
 * changes what "cache" means here:
 *
 *   - anything read repeatedly is memoised through `contentCache`, the
 *     generation memo a rebuild throws away — never a module-level `let`,
 *     which under SSR lives as long as the process and would serve whatever
 *     it read at boot forever;
 *   - the corpus read ({@link listAllPosts}) is deliberately NOT memoised.
 *     Its own note says why, and it is not an oversight to tidy up.
 *
 * Every fetch stays fail-soft — an unreachable API renders the baked
 * fallbacks rather than a 500. The one failure that must not be swallowed is
 * a rejected site key; see ./siteKey.
 *
 * Override the base URL with CONTENT_API_URL to point at a staging or local
 * API during dev.
 */

import type { BlogPost, AdsMode } from "@tracht-digital-solutions/tds-shared";
import { contentCache } from "./cache";
import { DEMO_MODE, demoPost, demoPostList, demoTopics, type TopicsBlock } from "./demoContent";
import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";
import { contentApiBase } from "./connection";

export type { TopicItem, TopicsBlock } from "./demoContent";

interface ListResponse {
  posts: Array<Pick<BlogPost, "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt" | "viewCount" | "authorId" | "author" | "adsMode">>;
  nextCursor: number | null;
}

/** A post as it appears in list/get responses (author + covers resolved). */
export type ListPost = ListResponse["posts"][number];

/**
 * A full-post read, plus the one field tds-shared's `BlogPost` does not carry.
 *
 * The content-API returns `metaDescription` — but only on the full-post read,
 * never in the list payload (`BlogCmsModule` sets it inside the same branch as
 * `body`). The panel has offered the field since the SEO changepoint and the
 * seed migration writes one for every article, yet no page rendered it: the
 * type stopped at the API boundary, so `Article.astro` fell back to the excerpt
 * and every carefully written description went nowhere.
 *
 * Widened here rather than in tds-shared on purpose. The field is read by this
 * repo alone, and a minor there is minor-locked by six `0.x` carets — six
 * repins for one optional string.
 */
export type FullPost = BlogPost & {
  /** Editor-maintained `<meta name="description">`; null falls back to the excerpt. */
  metaDescription?: string | null;
};

/**
 * Make an uploaded cover URL absolute. The content-API's cover endpoint
 * persists `coverHint` as a storage-relative `/uploads/...` path, but every
 * consumer here (the `<img src>` in `PostCover`, the OG `explicitCover`) gates
 * on `startsWith("http")` — a relative path would resolve against the blog
 * origin (`blog.tracht-digital.de/uploads/...`) and 404. Resolving it against
 * `BASE_URL` (`…/content`) at the data layer means every downstream check just
 * works, retroactively, for whatever is already stored. Absolute or empty
 * values pass through unchanged.
 */
export function resolveCoverHint(coverHint?: string | null): string | null {
  if (!coverHint) return null;
  if (/^https?:\/\//.test(coverHint)) return coverHint;
  if (coverHint.startsWith("/")) return `${contentApiBase()}${coverHint}`;
  return coverHint;
}

/**
 * Make an author's avatar URL absolute — same reasoning as
 * {@link resolveCoverHint}. content-api stores `avatarUrl` as a storage-relative
 * `/uploads/avatars/...` path; a relative `<img src>` would resolve against the
 * blog origin and 404, so anchor it to the content-API origin at the data layer.
 */
export function resolveAvatar(avatarUrl?: string | null): string | null {
  if (!avatarUrl) return null;
  if (/^https?:\/\//.test(avatarUrl)) return avatarUrl;
  if (avatarUrl.startsWith("/")) return `${contentApiBase()}${avatarUrl}`;
  return avatarUrl;
}

/** Resolve an embedded author's avatar to an absolute URL (null author passes through). */
function withResolvedAuthor<T extends { author?: BlogPost["author"] }>(post: T): T {
  if (!post.author) return post;
  return { ...post, author: { ...post.author, avatarUrl: resolveAvatar(post.author.avatarUrl) } };
}

function withResolvedCovers<T extends { coverHint?: string | null; author?: BlogPost["author"] }>(posts: T[]): T[] {
  return posts.map((p) => withResolvedAuthor({ ...p, coverHint: resolveCoverHint(p.coverHint) }));
}

/**
 * Every published post, paginated out of the list endpoint until it is
 * exhausted.
 *
 * ### Why this one is NOT memoised through `contentCache`
 *
 * It is the obvious candidate — it is the most expensive read on the site and
 * the most repeated one — and memoising it would be a real bug.
 *
 * The cache's control plane resolves a rebuild's page list BEFORE it
 * invalidates the generation memo (`resolveEvents(...)` then `onInvalidate()`
 * in tds-shared's `pageCache`). Resolving a `post` event walks the corpus to
 * find the saved article and derive its category, tag and author pages — so a
 * memoised corpus would answer that lookup from the list read before the save.
 * A newly published article would simply not be found, its taxonomy pages
 * would never be rebuilt, and the rebuild would report success. Nothing would
 * go red; the category page would just quietly keep the old list.
 *
 * The cost is bounded in practice: a page-cache miss reads the corpus once and
 * the rendered page is then stored, so this runs per rebuilt page, not per
 * visitor.
 */
export async function listAllPosts(lang?: "de" | "en"): Promise<ListResponse["posts"]> {
  // No-API demo build: serve demo posts instead of fetching.
  if (DEMO_MODE) return demoPostList(lang);

  try {
    const all: ListResponse["posts"] = [];
    let cursor: number | null = null;

    do {
      const url = new URL(`${contentApiBase()}/blog`);
      url.searchParams.set("limit", "50");
      if (lang) url.searchParams.set("lang", lang);
      if (cursor !== null) url.searchParams.set("cursor", String(cursor));

      const res = await fetch(url, { headers: siteKeyHeaders() });
      assertKeyAccepted(res, url);
      if (!res.ok) {
        throw new Error(`content-api ${url.pathname} → ${res.status}`);
      }
      const data: ListResponse = await res.json();
      all.push(...data.posts);
      cursor = data.nextCursor;
    } while (cursor !== null);

    return withResolvedCovers(all);
  } catch (err) {
    // No content API reachable at build time → ship demo posts instead of
    // an empty blog. A *connected* API that returns 0 posts stays empty
    // (that path returns [] without throwing).
    console.warn("[tds-blog] content-api unreachable — serving demo posts:", err);
    return demoPostList(lang);
  }
}

/**
 * Most-viewed published posts for the blog hero's "Populär" tab. Baked
 * at build time (the popularity ordering refreshes on each rebuild);
 * view counts themselves accrue at runtime via the article-page beacon.
 * Falls back to the newest demo/posts on a DEMO build or a build-time
 * outage so the slider always has a populated tab.
 */
export async function listPopular(lang: "de" | "en", limit = 6): Promise<ListResponse["posts"]> {
  if (DEMO_MODE) return demoPostList(lang).slice(0, limit);

  const url = new URL(`${contentApiBase()}/blog/popular`);
  url.searchParams.set("lang", lang);
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (!res.ok) {
      throw new Error(`content-api ${url.pathname} → ${res.status}`);
    }
    const data = (await res.json()) as { posts: ListResponse["posts"] };
    return withResolvedCovers(data.posts ?? []);
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — serving demo popular:", err);
    return demoPostList(lang).slice(0, limit);
  }
}

/**
 * Curated "Aktuelle Themen" block for the /aktuelles page. Returns null when
 * the API is reachable but nothing is maintained yet (or the endpoint isn't
 * deployed) — the page then shows only the newest posts. Demo content is only
 * served for an explicit DEMO build or a genuine connection failure at build
 * time; a *reachable* API that errors stays null so we never bake demo topics
 * onto a production page.
 */
export async function listTopics(lang: "de" | "en"): Promise<TopicsBlock | null> {
  if (DEMO_MODE) return demoTopics(lang);

  const url = new URL(`${contentApiBase()}/topics`);
  url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (!res.ok) return null; // reachable but 404/5xx → no curated topics
    const data = (await res.json()) as { lang: string; topics: TopicsBlock | null };
    return data.topics ?? null;
  } catch (err) {
    // Host unreachable at build time → demo block (keeps a local/no-API
    // build from rendering an empty section), same as listAllPosts.
    console.warn("[tds-blog] content-api unreachable — serving demo topics:", err);
    return demoTopics(lang);
  }
}

/**
 * The blog's slice of the landing content blocks.
 *
 * TWO settings on this site live in that one payload — the cookie-banner
 * switch and the AdSense configuration — and `Layout.astro` reads both on
 * every page render. They used to fetch `/landing?lang=de` independently, so
 * an uncached render cost two identical requests, and only one of them was
 * memoised: the banner re-fetched for every page in the generation.
 *
 * One shared, memoised loader instead. It draws the line the memo needs:
 *
 *   - a reachable API answering 404/5xx is a STATE (nothing configured yet, or
 *     the endpoint is not deployed) and is remembered as `null`;
 *   - a transport failure or a rejected site key THROWS, and `contentCache`
 *     deliberately does not remember a rejected load — so one hiccup during a
 *     single render cannot pin "off" onto every later page in the generation.
 *
 * Each caller still degrades to its own safe default, so the fail-soft
 * contract is unchanged: an unreachable API means no banner and no ads.
 */
type LandingBlocks = Record<string, Record<string, unknown> | undefined>;

function landingBlocks(): Promise<LandingBlocks | null> {
  return contentCache.get("landing:blocks", loadLandingBlocks);
}

async function loadLandingBlocks(): Promise<LandingBlocks | null> {
  if (DEMO_MODE) return null;

  const url = new URL(`${contentApiBase()}/landing`);
  url.searchParams.set("lang", "de");

  const res = await fetch(url, { headers: siteKeyHeaders() });
  assertKeyAccepted(res, url);
  if (!res.ok) return null; // reachable, but nothing to read
  const data = (await res.json()) as { blocks?: LandingBlocks };
  return data.blocks ?? {};
}

/**
 * Whether the public cookie banner is enabled — the language-agnostic
 * `cookie_banner` landing content block ({ enabled }, stored under `lang=de`),
 * toggled in tds-admin (the toggle fires a rebuild of the entry pages).
 * Absent block, demo mode or an unreachable API mean "off" — the safe default.
 */
export async function cookieBannerEnabled(): Promise<boolean> {
  try {
    return (await landingBlocks())?.["cookie_banner"]?.enabled === true;
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — cookie banner off:", err);
    return false;
  }
}

/** Resolved AdSense config for the blog (from the language-agnostic `ads`
 *  landing content block). Off/empty on absent block, demo mode or API error. */
export interface AdsConfig {
  enabled: boolean;
  publisherId: string;
  defaultMode: "auto" | "manual";
  slotInArticle: string;
  slotEndArticle: string;
}

const ADS_OFF: AdsConfig = {
  enabled: false,
  publisherId: "",
  defaultMode: "auto",
  slotInArticle: "",
  slotEndArticle: "",
};

/**
 * The global AdSense config. `enabled` is the master switch; without an
 * `enabled` block or a `publisherId` the whole feature is off — the safe
 * default.
 *
 * Read through {@link landingBlocks}, i.e. memoised per GENERATION rather than
 * for the life of the process: under SSR a module-level memo never expires, so
 * switching ads on in the panel would never reach a reader no matter how often
 * the cache was rebuilt. See src/lib/cache.ts.
 */
export async function adsConfig(): Promise<AdsConfig> {
  let block: Record<string, unknown> | undefined;
  try {
    block = (await landingBlocks())?.["ads"];
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — ads off:", err);
    return ADS_OFF;
  }

  if (!block || block.enabled !== true) return ADS_OFF;
  const publisherId = typeof block.publisherId === "string" ? block.publisherId : "";
  if (!publisherId) return ADS_OFF;
  return {
    enabled: true,
    publisherId,
    defaultMode: block.defaultMode === "manual" ? "manual" : "auto",
    slotInArticle: typeof block.slotInArticle === "string" ? block.slotInArticle : "",
    slotEndArticle: typeof block.slotEndArticle === "string" ? block.slotEndArticle : "",
  };
}

/** Resolve a post's effective ad mode against the global config. */
export function effectiveAdsMode(
  postAdsMode: AdsMode | undefined,
  ads: AdsConfig,
): "off" | "auto" | "manual" {
  if (!ads.enabled || !ads.publisherId) return "off";
  const m = postAdsMode ?? "default";
  if (m === "off") return "off";
  if (m === "auto" || m === "manual") return m;
  return ads.defaultMode; // "default" → inherit
}

/** A custom building block referenced by a post's `custom` blocks. */
export interface BlogSnippet {
  id: number;
  kind: "preset" | "embed";
  definition: Record<string, unknown>;
}



/**
 * The custom-snippet catalog. Memoised through `contentCache` so every
 * article rendering a `custom` block shares one fetch, while a cache rebuild
 * still reads through. Empty on demo mode or an API outage.
 */
export function blogSnippets(): Promise<BlogSnippet[]> {
  return contentCache.get("blog:snippets", loadSnippets);
}

async function loadSnippets(): Promise<BlogSnippet[]> {
  if (DEMO_MODE) return [];
  const url = new URL(`${contentApiBase()}/snippets`);
  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (!res.ok) return [];
    const data = (await res.json()) as { snippets?: BlogSnippet[] };
    return data.snippets ?? [];
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — no custom snippets:", err);
    return [];
  }
}

export async function getPost(slug: string, lang: "de" | "en"): Promise<FullPost | null> {
  if (DEMO_MODE) return demoPost(slug, lang);

  const url = new URL(`${contentApiBase()}/blog/${encodeURIComponent(slug)}`);
  url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`content-api ${url.pathname} → ${res.status}`);
    }
    const { post } = (await res.json()) as { post: FullPost };
    return withResolvedAuthor({ ...post, coverHint: resolveCoverHint(post.coverHint) });
  } catch (err) {
    // API down → serve the matching demo post (keeps demo slugs from
    // listAllPosts() renderable). Returns null for an unknown slug.
    console.warn("[tds-blog] content-api unreachable — serving demo post:", err);
    return demoPost(slug, lang);
  }
}

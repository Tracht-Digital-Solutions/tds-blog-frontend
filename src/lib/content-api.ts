/**
 * Build-time client for tds-content-api. Astro's `getStaticPaths`
 * and frontmatter call these from the SSG build, so the rendered
 * HTML for each post ships static — no runtime API calls.
 *
 * Override the base URL with CONTENT_API_URL if you point at a
 * staging/local content-api during dev.
 */

import type { BlogPost, AdsMode } from "@tracht-digital-solutions/tds-shared";
import { DEMO_MODE, demoPost, demoPostList, demoTopics, type TopicsBlock } from "./demoContent";
import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";

export type { TopicItem, TopicsBlock } from "./demoContent";

const BASE_URL =
  import.meta.env.CONTENT_API_URL ?? "https://api.tracht-digital.de/content";

interface ListResponse {
  posts: Array<Pick<BlogPost, "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt" | "viewCount" | "authorId" | "author" | "adsMode">>;
  nextCursor: number | null;
}

/** A post as it appears in list/get responses (author + covers resolved). */
export type ListPost = ListResponse["posts"][number];

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
  if (coverHint.startsWith("/")) return `${BASE_URL}${coverHint}`;
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
  if (avatarUrl.startsWith("/")) return `${BASE_URL}${avatarUrl}`;
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

export async function listAllPosts(lang?: "de" | "en"): Promise<ListResponse["posts"]> {
  // No-API demo build: serve demo posts instead of fetching.
  if (DEMO_MODE) return demoPostList(lang);

  try {
    const all: ListResponse["posts"] = [];
    let cursor: number | null = null;

    do {
      const url = new URL(`${BASE_URL}/blog`);
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

  const url = new URL(`${BASE_URL}/blog/popular`);
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

  const url = new URL(`${BASE_URL}/topics`);
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
 * Whether the public cookie banner is enabled — the language-agnostic
 * `cookie_banner` landing content block ({ enabled }, stored under `lang=de`),
 * toggled in tds-admin and baked at build time (a toggle fires a blog
 * rebuild). Absent block, demo mode or an unreachable API mean "off" —
 * the safe default.
 */
export async function cookieBannerEnabled(): Promise<boolean> {
  if (DEMO_MODE) return false;

  const url = new URL(`${BASE_URL}/landing`);
  url.searchParams.set("lang", "de");

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (!res.ok) return false;
    const data = (await res.json()) as {
      blocks?: Record<string, { enabled?: unknown } | undefined>;
    };
    return data.blocks?.["cookie_banner"]?.enabled === true;
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

let adsConfigCache: Promise<AdsConfig> | null = null;

/**
 * The global AdSense config, baked at build time (an admin save fires a blog
 * rebuild). `enabled` is the master switch; without an `enabled` block or a
 * `publisherId` the whole feature is off — the safe default. Memoised for the
 * whole build so the 1000+ static pages share a single fetch.
 */
export function adsConfig(): Promise<AdsConfig> {
  if (!adsConfigCache) adsConfigCache = loadAdsConfig();
  return adsConfigCache;
}

async function loadAdsConfig(): Promise<AdsConfig> {
  if (DEMO_MODE) return ADS_OFF;

  const url = new URL(`${BASE_URL}/landing`);
  url.searchParams.set("lang", "de");

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (!res.ok) return ADS_OFF;
    const data = (await res.json()) as {
      blocks?: Record<string, Record<string, unknown> | undefined>;
    };
    const b = data.blocks?.["ads"];
    if (!b || b.enabled !== true) return ADS_OFF;
    const publisherId = typeof b.publisherId === "string" ? b.publisherId : "";
    if (!publisherId) return ADS_OFF;
    return {
      enabled: true,
      publisherId,
      defaultMode: b.defaultMode === "manual" ? "manual" : "auto",
      slotInArticle: typeof b.slotInArticle === "string" ? b.slotInArticle : "",
      slotEndArticle: typeof b.slotEndArticle === "string" ? b.slotEndArticle : "",
    };
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — ads off:", err);
    return ADS_OFF;
  }
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

let snippetsCache: Promise<BlogSnippet[]> | null = null;

/**
 * The custom-snippet catalog, baked at build time (an admin snippet save fires a
 * blog rebuild). Memoised for the whole build so every article page that renders
 * a `custom` block shares a single fetch. Empty on demo mode or an API outage.
 */
export function blogSnippets(): Promise<BlogSnippet[]> {
  if (!snippetsCache) snippetsCache = loadSnippets();
  return snippetsCache;
}

async function loadSnippets(): Promise<BlogSnippet[]> {
  if (DEMO_MODE) return [];
  try {
    const res = await fetch(new URL(`${BASE_URL}/snippets`), { headers: siteKeyHeaders() });
    assertKeyAccepted(res, new URL(`${BASE_URL}/snippets`));
    if (!res.ok) return [];
    const data = (await res.json()) as { snippets?: BlogSnippet[] };
    return data.snippets ?? [];
  } catch (err) {
    console.warn("[tds-blog] content-api unreachable — no custom snippets:", err);
    return [];
  }
}

export async function getPost(slug: string, lang: "de" | "en"): Promise<BlogPost | null> {
  if (DEMO_MODE) return demoPost(slug, lang);

  const url = new URL(`${BASE_URL}/blog/${encodeURIComponent(slug)}`);
  url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url, { headers: siteKeyHeaders() });
    assertKeyAccepted(res, url);
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`content-api ${url.pathname} → ${res.status}`);
    }
    const { post } = (await res.json()) as { post: BlogPost };
    return withResolvedAuthor({ ...post, coverHint: resolveCoverHint(post.coverHint) });
  } catch (err) {
    // API down → serve the matching demo post (keeps demo slugs from
    // listAllPosts() renderable). Returns null for an unknown slug.
    console.warn("[tds-blog] content-api unreachable — serving demo post:", err);
    return demoPost(slug, lang);
  }
}

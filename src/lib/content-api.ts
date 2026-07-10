/**
 * Build-time client for tds-content-api. Astro's `getStaticPaths`
 * and frontmatter call these from the SSG build, so the rendered
 * HTML for each post ships static — no runtime API calls.
 *
 * Override the base URL with CONTENT_API_URL if you point at a
 * staging/local content-api during dev.
 */

import type { BlogPost } from "@tracht-digital-solutions/tds-shared";
import { DEMO_MODE, demoPost, demoPostList, demoTopics, type TopicsBlock } from "./demoContent";

export type { TopicItem, TopicsBlock } from "./demoContent";

const BASE_URL =
  import.meta.env.CONTENT_API_URL ?? "https://api.tracht-digital.de/content";

interface ListResponse {
  posts: Array<Pick<BlogPost, "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt" | "viewCount" | "authorId" | "author">>;
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

      const res = await fetch(url);
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
    const res = await fetch(url);
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
    const res = await fetch(url);
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
    const res = await fetch(url);
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

export async function getPost(slug: string, lang: "de" | "en"): Promise<BlogPost | null> {
  if (DEMO_MODE) return demoPost(slug, lang);

  const url = new URL(`${BASE_URL}/blog/${encodeURIComponent(slug)}`);
  url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url);
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

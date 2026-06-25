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
  posts: Array<Pick<BlogPost, "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt">>;
  nextCursor: number | null;
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

    return all;
  } catch (err) {
    // No content API reachable at build time → ship demo posts instead of
    // an empty blog. A *connected* API that returns 0 posts stays empty
    // (that path returns [] without throwing).
    console.warn("[tds-blog] content-api unreachable — serving demo posts:", err);
    return demoPostList(lang);
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
    return post;
  } catch (err) {
    // API down → serve the matching demo post (keeps demo slugs from
    // listAllPosts() renderable). Returns null for an unknown slug.
    console.warn("[tds-blog] content-api unreachable — serving demo post:", err);
    return demoPost(slug, lang);
  }
}

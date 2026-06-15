/**
 * Build-time client for tds-content-api. Astro's `getStaticPaths`
 * and frontmatter call these from the SSG build, so the rendered
 * HTML for each post ships static — no runtime API calls.
 *
 * Override the base URL with CONTENT_API_URL if you point at a
 * staging/local content-api during dev.
 */

import type { BlogPost } from "@tracht-digital-solutions/tds-shared";
import { DEMO_MODE, demoPost, demoPostList } from "./demoContent";

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

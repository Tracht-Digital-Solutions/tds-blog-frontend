/**
 * Build-time client for tds-content-api. Astro's `getStaticPaths`
 * and frontmatter call these from the SSG build, so the rendered
 * HTML for each post ships static — no runtime API calls.
 *
 * Override the base URL with CONTENT_API_URL if you point at a
 * staging/local content-api during dev.
 */

import type { BlogPost } from "@tracht-digital-solutions/tds-shared";

const BASE_URL =
  import.meta.env.CONTENT_API_URL ?? "https://api.tracht-digital.de/content";

interface ListResponse {
  posts: Array<Pick<BlogPost, "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt">>;
  nextCursor: number | null;
}

export async function listAllPosts(lang?: "de" | "en"): Promise<ListResponse["posts"]> {
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
}

export async function getPost(slug: string, lang: "de" | "en"): Promise<BlogPost | null> {
  const url = new URL(`${BASE_URL}/blog/${encodeURIComponent(slug)}`);
  url.searchParams.set("lang", lang);

  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`content-api ${url.pathname} → ${res.status}`);
  }
  const { post } = (await res.json()) as { post: BlogPost };
  return post;
}

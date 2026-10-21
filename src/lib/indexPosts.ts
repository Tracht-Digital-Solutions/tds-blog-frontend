import type { IndexPost } from "~/components/islands/BlogIndex";
import type { listAllPosts } from "./content-api";

type ListedPost = Awaited<ReturnType<typeof listAllPosts>>[number];

/**
 * The fields the `BlogIndex` island actually reads — nothing more.
 *
 * The index passes the WHOLE corpus as island props so search and the filter
 * bar run client-side, and Astro serialises those props as JSON into the
 * `astro-island` element. Every field rides along on every index request, for
 * every post — the ten rendered cards and all the rest (tds-blog-frontend#28).
 * The list payload carries more than a card needs (`id`, `lang`, `authorId`,
 * `adsMode`, the author's `id` and `bio`), so the island gets a projection.
 *
 * Add a field here when the island starts reading it; the test pins the set.
 */
export function toIndexPost(p: ListedPost): IndexPost {
  return {
    slug: p.slug,
    category: p.category,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    coverHint: p.coverHint,
    author: p.author ? { name: p.author.name, slug: p.author.slug, avatarUrl: p.author.avatarUrl } : null,
    readingMinutes: p.readingMinutes ?? null,
    tags: p.tags ?? null,
    viewCount: p.viewCount,
  };
}

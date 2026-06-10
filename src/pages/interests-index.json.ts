/**
 * Build-time recommendation index. Bakes the lightweight metadata of
 * every published post (both languages) into a single static JSON
 * file. The "Für dich" island fetches THIS file at runtime — never the
 * content-api — so personalised recommendations stay SSG-conform.
 *
 * A failed content-api fetch emits an empty array so the build never
 * breaks on an API hiccup (same contract as the index pages).
 */
import { listAllPosts } from "~/lib/content-api";

export async function GET() {
  let posts: Awaited<ReturnType<typeof listAllPosts>> = [];
  try {
    posts = await listAllPosts();
  } catch (err) {
    console.error("[tds-blog] interests-index fetch failed:", err);
  }

  const index = posts.map((p) => ({
    slug: p.slug,
    lang: p.lang,
    category: p.category,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags ?? null,
    publishedAt: p.publishedAt,
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}

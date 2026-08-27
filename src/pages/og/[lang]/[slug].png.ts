import type { APIRoute } from "astro";
import { getPost } from "~/lib/content-api";
import { renderOgPng } from "~/og/render";

/**
 * Render on demand so publishing a post never requires a GitHub build. The
 * shared page-cache middleware stores the PNG as a normal cache entry. The
 * release bundle ships the renderer and its font assets explicitly.
 */
export const prerender = false;

/**
 * Per-post OG image. The endpoint receives lang + slug from the route params
 * and produces the PNG via the shared renderer.
 *
 * The image is referenced from Layout.astro's og:image meta as
 * `${site}/og/{lang}/{slug}.png`.
 */
export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang === "en" ? "en" : "de";
  const slug = params.slug;
  if (typeof slug !== "string" || slug === "") {
    return new Response("Not found", { status: 404 });
  }

  const post = await getPost(slug, lang);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const png = await renderOgPng({
    title: post.title,
    category: post.category,
    publishedAt: post.publishedAt,
    lang,
    author: post.author?.name ?? null,
  });

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};

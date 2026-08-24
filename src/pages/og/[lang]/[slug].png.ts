import type { APIRoute, GetStaticPaths } from "astro";
import { listAllPosts, getPost } from "~/lib/content-api";
import { renderOgPng } from "~/og/render";

/**
 * Prerendered, and it must stay that way.
 *
 * Two independent reasons. The renderer pulls in satori and @resvg/resvg-js,
 * the second a native addon that would then have to be installed on the
 * production host. And src/og/render.ts anchors its font directory to
 * process.cwd(), which is the project root during `astro build` and a deploy
 * tree with no src/ at runtime — served on demand this route would ENOENT on
 * its first request in production and nowhere else.
 *
 * The cost: an article published after the last deploy has no OG card of its
 * own until the next one. Layout.astro falls back to the default card, so it
 * degrades rather than breaks. Prerendering keeps `getStaticPaths`, which is
 * only allowed on prerendered routes.
 */
export const prerender = true;

/**
 * Per-post OG image. Astro emits a static .png file at build time
 * for every post returned by listAllPosts. The endpoint receives the
 * lang + slug from the route params and produces the PNG via the
 * shared renderer.
 *
 * The image is referenced from Layout.astro's og:image meta as
 * `${site}/og/{lang}/{slug}.png`.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  let posts: Awaited<ReturnType<typeof listAllPosts>> = [];
  try {
    posts = await listAllPosts();
  } catch (err) {
    console.error("[tds-blog/og] listAllPosts failed:", err);
    return [];
  }
  return posts.map((p) => ({
    params: { lang: p.lang, slug: p.slug },
  }));
};

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
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

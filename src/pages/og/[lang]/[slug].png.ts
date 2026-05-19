import type { APIRoute, GetStaticPaths } from "astro";
import { listAllPosts, getPost } from "~/lib/content-api";
import { renderOgPng } from "~/og/render";

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
  });

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

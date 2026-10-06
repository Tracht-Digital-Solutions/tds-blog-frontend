import type { APIRoute } from "astro";
import { renderUrlset, sitemapUrls } from "~/lib/sitemap";
import { isSitemapSection } from "~/lib/sitemapSections";

/**
 * One child of the sectioned sitemap: `/sitemap-pages.xml`, `/sitemap-posts.xml`,
 * `/sitemap-categories.xml`, `/sitemap-tags.xml`, `/sitemap-authors.xml`.
 * Server-rendered and cached like the index; `cache.ts` rebuilds every one of
 * them when the corpus moves (SITEMAP_PATHS). `/sitemap-0.xml` keeps its own
 * static route and still lists everything.
 */
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  if (!isSitemapSection(params.section)) return new Response(null, { status: 404 });
  const urls = (await sitemapUrls()).filter((url) => url.section === params.section);
  if (urls.length === 0) return new Response(null, { status: 404 });
  return new Response(renderUrlset(urls, new Date().toISOString().slice(0, 10)), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};

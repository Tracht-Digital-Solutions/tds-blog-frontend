import type { APIRoute } from "astro";
import { renderUrlset, sitemapUrls } from "~/lib/sitemap";

/**
 * Server-rendered and cached like any other page: this site's URL list comes
 * from the corpus, so it changes when an article does. `src/lib/cache.ts`
 * rebuilds it on every `post` event.
 */
export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(renderUrlset(await sitemapUrls(), new Date().toISOString().slice(0, 10)), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });

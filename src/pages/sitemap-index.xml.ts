import type { APIRoute } from "astro";
import { renderSitemapIndex } from "~/lib/sitemap";

/**
 * The entry point `public/robots.txt` advertises and Search Console already
 * knows. `@astrojs/sitemap` produced this exact pair of filenames; keeping
 * them means the migration off the integration is invisible from outside.
 */
export const prerender = false;

export const GET: APIRoute = () =>
  new Response(renderSitemapIndex(new Date().toISOString().slice(0, 10)), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });

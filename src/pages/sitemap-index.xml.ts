import type { APIRoute } from "astro";
import { newestLastmod, renderSitemapIndex, sitemapUrls } from "~/lib/sitemap";

/**
 * The entry point `public/robots.txt` advertises and Search Console already
 * knows. `@astrojs/sitemap` produced this exact pair of filenames; keeping
 * them means the migration off the integration is invisible from outside.
 *
 * The `lastmod` here is the newest article date, not today's date. An index
 * that reports "changed today" on every fetch is telling a crawler nothing,
 * and it did that even on days when no article had moved.
 */
export const prerender = false;

export const GET: APIRoute = async () => {
  const urls = await sitemapUrls();
  const lastmod = newestLastmod(urls) ?? new Date().toISOString().slice(0, 10);
  return new Response(renderSitemapIndex(lastmod), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};

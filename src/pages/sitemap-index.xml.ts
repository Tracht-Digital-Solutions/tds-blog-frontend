import type { APIRoute } from "astro";
import { renderSectionIndex, sitemapUrls } from "~/lib/sitemap";

/**
 * The entry point `public/robots.txt` advertises and Search Console already
 * knows. `@astrojs/sitemap` produced this exact pair of filenames; keeping
 * them means the migration off the integration is invisible from outside.
 *
 * Since 2026-10-06 it lists one child per kind of page (src/lib/sitemapSections.ts),
 * each with the newest date inside it — never today's date, which would tell a
 * crawler everything changed on every fetch.
 */
export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(renderSectionIndex(await sitemapUrls()), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });

import type { APIRoute } from "astro";
import { siteCache } from "~/lib/pageCache";

/**
 * The page cache's control plane: `status`, `rebuild`, `purge`.
 *
 * A real route, not middleware: Astro does not run middleware for a path no
 * route matches — it short-circuits into the 404 response — so a
 * middleware-mounted control plane answers every rebuild request with this
 * site's own 404 page. And it cannot live under `_cache/` either, because
 * Astro excludes any path segment beginning with `_` from routing.
 *
 * Note this is NOT the storage directory: that is `_tds-cache` in the document
 * root, which `.htaccess` blocks outright.
 *
 * A POST here must carry `Content-Type: application/json`, or Astro's
 * `security.checkOrigin` rejects it as a cross-site form submission.
 */
export const prerender = false;

const handle: APIRoute = ({ params, request, url }) =>
  siteCache.control(String(params.action ?? ""), request, url);

export const GET = handle;
export const POST = handle;

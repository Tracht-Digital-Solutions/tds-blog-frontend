import { t as sequence, ut as defineMiddleware } from "./chunks/sequence_CbUbm3Cx.mjs";
import { S as siteKeyRejectionCount } from "./chunks/cache_CMM7wTu7.mjs";
import { t as siteCache } from "./chunks/pageCache_CUKDMWr2.mjs";
//#region src/middleware.ts
/**
* Serve cached pages and store rendered ones.
*
* The control plane that drives it is NOT here — it is a real route
* (`src/pages/tds/cache/[action].ts`), because Astro never runs middleware for
* a path no route matches. See that file.
*
* ### In production Apache usually answers first
*
* `public/.htaccess` serves an existing cache entry straight off disk, so a
* hit normally never reaches Node at all — that is the point of the design.
* The hit path here still matters: it is what `npm run dev`, `npm start` and
* any host without the rewrite use, and having both read the same store keeps
* the two implementations honest.
*/
/**
* Refuse to STORE a page that was rendered while the API rejected our site key.
*
* `siteKeyGuard()` in `astro.config.mjs` covers the build, and it cannot cover
* this: every content fetch is deliberately fail-soft, so at request time a
* rejected key produces a perfectly valid page full of baked fallbacks. Cached,
* that page would outlive the misconfiguration and there would be nothing to
* see — a site quietly serving its own placeholder copy is exactly the failure
* the build-time guard exists to prevent.
*
* Comparing the rejection counter around the render is enough. Two requests
* racing can only make this refuse to store a page that was fine; it can never
* make it store one that was not, and a needless miss costs one render.
*/
var refuseStaleKey = defineMiddleware(async (_context, next) => {
	const before = siteKeyRejectionCount();
	const response = await next();
	if (siteKeyRejectionCount() > before) {
		const guarded = new Response(response.body, response);
		guarded.headers.set("cache-control", "no-store");
		return guarded;
	}
	return response;
});
/**
* `sequence` runs these outside-in, so the cache wraps the guard: the guard's
* `no-store` is already on the response by the time the cache decides whether
* to store it. Reversing the two would put the guard outside the cache, where
* it would see hits it never rendered and mark them unstorable for no reason.
*/
var onRequest$1 = sequence(defineMiddleware((context, next) => siteCache.middleware({
	request: context.request,
	url: context.url,
	isPrerendered: context.isPrerendered
}, next)), refuseStaleKey);
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };

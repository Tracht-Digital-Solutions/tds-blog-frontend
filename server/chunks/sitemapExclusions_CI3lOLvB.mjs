import { b as assertKeyAccepted, r as contentCache, x as siteKeyHeaders } from "./cache_C7psdfsG.mjs";
import { i as contentApiBase } from "./connection_C3w8iWPQ.mjs";
//#region src/lib/sitemapExclusions.ts
/**
* Paths the panel has taken out of the index.
*
* The sitemap is built from the corpus (see `sitemap.ts`); this is the
* subtraction on top of it, maintained in the API because most of what an
* operator wants to hide here has no row to hang a flag on. An article has one
* (`draft`), but `/tag/steuern`, `/kategorie/recht`, `/page/3` and `/aktuelles`
* are derived from *other* articles' fields, and a per-post `noindex` column
* could never reach them.
*
* ### The twin is not a prefix on this site
*
* Article slugs mirror (`/x` ↔ `/en/x`), but the taxonomy segments do not:
* `/kategorie/…` ↔ `/en/category/…`, `/autor/…` ↔ `/en/author/…`. Tags happen to
* share a segment. `hreflangGroup()` knows that mapping, so one exclusion
* covers both trees whichever URL the operator typed — which matters most for
* articles, the only pages this site gives reciprocal `hreflang` alternates,
* where keeping one side would point an alternate at a page no longer offered
* and invalidate the set on both sides.
*
* **What it maps is the SEGMENT, not the slug.** A category page is named after
* its category, and categories are translated ("Digitalisierung" /
* "Digitalization"), so `/kategorie/digitalisierung` and
* `/en/category/digitalization` are not derivable from one another without
* walking the corpus. The consequence is deliberate and worth stating: an
* EXACT taxonomy pattern hits one tree, a PREFIX one (`/kategorie/*`, `/tag/*`)
* hits both — the group of `/en/category/x` contains `/kategorie/x`, which the
* prefix matches whatever the slug is. Articles, where hreflang correctness
* actually rides on it, mirror exactly and are always taken as a pair.
*
* ### Fail-soft, in the safe direction
*
* Every failure answers "nothing excluded". The opposite default would empty
* the sitemap on an API hiccup, and because the API's own route is fail-soft
* too, neither end would go red.
*/
/** This site's id in the panel's site registry. */
var SITE_ID = "blog";
/**
* Taxonomy segments, per tree. The same table `cache.ts` keeps, for the same
* reason: these two trees are not a prefix pair and pretending otherwise is
* how a route silently stops mirroring.
*/
var SEGMENTS = {
	de: {
		category: "kategorie",
		author: "autor"
	},
	en: {
		category: "category",
		author: "author"
	}
};
/** Trailing slash folded away, root kept — `trailingSlash: "ignore"` in the Astro config. */
function canonical(path) {
	const value = path.trim();
	if (value === "" || value === "/") return "/";
	return value.replace(/\/+$/, "") || "/";
}
/**
* One pattern against one path.
*
* Deliberately the same two rules the API validates and documents: an exact
* path, or a trailing `*` making it a raw prefix. Kept dumb on purpose — a
* glob library here would accept patterns the API rejects, and the
* disagreement would only ever show as a page that quietly stayed indexed.
*/
function matchesPattern(path, pattern) {
	const value = pattern.trim();
	if (value === "") return false;
	if (value.endsWith("*")) {
		const prefix = value.slice(0, -1);
		return prefix === "" || canonical(path).startsWith(prefix);
	}
	return canonical(value) === canonical(path);
}
/** Does any pattern hit any member of this hreflang group? */
function groupExcluded(paths, patterns) {
	return paths.some((path) => patterns.some((pattern) => matchesPattern(path, pattern)));
}
/** Translate one tree's taxonomy segment into the other's. */
function translateSegment(rest, from, to) {
	const [, head, ...tail] = rest.split("/");
	const source = SEGMENTS[from];
	const target = SEGMENTS[to];
	let mapped = head;
	if (head === source.category) mapped = target.category;
	else if (head === source.author) mapped = target.author;
	return [
		"",
		mapped,
		...tail
	].join("/");
}
/**
* Both URLs of one page, German first.
*
* The German path is the identity of the page here; the English one is derived
* from it. Handed an English URL, this returns the same pair — the group is a
* property of the PAGE, so excluding via either URL has to mean the same thing.
*/
function hreflangGroup(pathname) {
	const path = canonical(pathname);
	const de = path === "/en" || path.startsWith("/en/") ? canonical(translateSegment(path.slice(3) || "/", "en", "de")) : path;
	const rest = translateSegment(de, "de", "en");
	const en = rest === "/" ? "/en/" : `/en${rest}`;
	return [de, canonical(en) === "/en" ? "/en/" : en];
}
async function load() {
	try {
		const url = new URL(`${contentApiBase()}/sitemap-exclusions`);
		url.searchParams.set("site", SITE_ID);
		const res = await fetch(url, {
			headers: siteKeyHeaders(),
			signal: AbortSignal.timeout(1e4)
		});
		assertKeyAccepted(res, url);
		if (!res.ok) return [];
		const data = await res.json();
		if (!Array.isArray(data.paths)) return [];
		return data.paths.filter((p) => typeof p === "string" && p.trim() !== "");
	} catch (err) {
		console.warn("[tds-blog] sitemap exclusions unreachable — nothing excluded:", err);
		return [];
	}
}
/**
* The patterns, memoised for the render generation.
*
* Through `contentCache` rather than a module-level promise: the latter would
* live as long as the server under SSR, so an exclusion added in the panel
* would never reach a visitor and nothing would log.
*/
function exclusionPatterns() {
	return contentCache.get("sitemap:exclusions", load);
}
/** Is this page excluded — counting its twin in the other tree as the same page? */
async function isExcluded(pathname) {
	const patterns = await exclusionPatterns();
	if (patterns.length === 0) return false;
	return groupExcluded(hreflangGroup(pathname), patterns);
}
//#endregion
export { isExcluded as i, groupExcluded as n, hreflangGroup as r, exclusionPatterns as t };

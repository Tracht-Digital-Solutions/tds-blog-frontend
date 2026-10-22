import { E as canonicalPath, O as createSitemapExclusions, T as readContentJson, w as memoisedOr } from "./cache_qYAc2MYZ.mjs";
import { i as contentApiBase } from "./connection_CMbEZdih.mjs";
// src/lib/sitemapExclusions.ts
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
	const path = canonicalPath(pathname);
	const de = path === "/en" || path.startsWith("/en/") ? canonicalPath(translateSegment(path.slice(3) || "/", "en", "de")) : path;
	const rest = translateSegment(de, "de", "en");
	const en = rest === "/" ? "/en/" : `/en${rest}`;
	return [de, canonicalPath(en) === "/en" ? "/en/" : en];
}
var exclusions = createSitemapExclusions({
	siteId: SITE_ID,
	contentBase: contentApiBase,
	read: (url) => readContentJson(new URL(url)),
	memo: memoisedOr,
	hreflangGroup,
	disabled: false
});
/**
* The patterns, memoised for the render generation.
*
* Through `contentCache` rather than a module-level promise: the latter would
* live as long as the server under SSR, so an exclusion added in the panel
* would never reach a visitor and nothing would log.
*/
var exclusionPatterns = exclusions.exclusionPatterns;
/** Is this page excluded — counting its twin in the other tree as the same page? */
var isExcluded = exclusions.isExcluded;
export { hreflangGroup as n, isExcluded as r, exclusionPatterns as t };

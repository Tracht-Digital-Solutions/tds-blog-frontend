import { r as contentCache } from "./cache_CMM7wTu7.mjs";
import "./connection_C3w8iWPQ.mjs";
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
	return [];
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

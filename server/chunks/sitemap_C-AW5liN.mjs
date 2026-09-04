import { c as corpus, l as categorySlug } from "./cache_CMM7wTu7.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { n as groupExcluded, r as hreflangGroup, t as exclusionPatterns } from "./sitemapExclusions_CHWN7KaI.mjs";
//#region src/lib/sitemap.ts
/**
* The sitemap, built from the corpus.
*
* ### Why this is hand-written now
*
* `@astrojs/sitemap` derives its entries from the routes the build EMITS.
* Under `output: "server"` the articles, taxonomy pages and archive pages are
* not emitted, so the integration would have shipped a sitemap containing only
* `/install` and the error pages it used to filter out — a technically valid
* file listing nothing anybody should index, with nothing red anywhere.
*
* ### No prefix-derived hreflang, deliberately
*
* The two language trees do not mirror: `/kategorie/…` vs `/en/category/…`,
* `/autor/…` vs `/en/author/…`, and per-language tag sets and page counts.
* Article slugs DO mirror (`/x` ↔ `/en/x`), so those get alternates and
* nothing else does. Post-level hreflang also lives in the Layout `<head>`;
* Search Console only treats a set as valid when the head and the sitemap
* agree, which is why both are emitted from the same list here.
*/
var PREFIX = {
	de: "",
	en: "/en"
};
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
/** `YYYY-MM-DD` of the newest post in a set, or undefined for an empty one. */
function newestDate(posts) {
	let newest;
	for (const post of posts) {
		const day = (post.publishedAt ?? "").slice(0, 10);
		if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
		if (!newest || day > newest) newest = day;
	}
	return newest;
}
function escapeXml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
/** Absolute URL for a path on this site. */
function absolute(path) {
	return new URL(path, siteConfig.url).href;
}
/** Every indexable URL of one language tree. */
async function urlsFor(lang) {
	const p = PREFIX[lang];
	const s = SEGMENTS[lang];
	const ordered = [...await corpus(lang)].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
	const siteNewest = newestDate(ordered);
	const urls = [
		{
			path: `${p}/`,
			changefreq: "daily",
			priority: 1,
			lastmod: siteNewest
		},
		{
			path: `${p}/aktuelles`,
			changefreq: "weekly",
			priority: .6,
			lastmod: siteNewest
		},
		{
			path: `${p}/rss`,
			changefreq: "monthly",
			priority: .3,
			lastmod: siteNewest
		}
	];
	const pageCount = Math.max(1, Math.ceil(ordered.length / 10));
	for (let n = 2; n <= pageCount; n++) urls.push({
		path: `${p}/page/${n}`,
		changefreq: "weekly",
		priority: .4,
		lastmod: newestDate(ordered.slice((n - 1) * 10, n * 10))
	});
	const categories = /* @__PURE__ */ new Map();
	const tags = /* @__PURE__ */ new Map();
	const authors = /* @__PURE__ */ new Map();
	const collect = (map, key, post) => {
		const bucket = map.get(key);
		if (bucket) bucket.push(post);
		else map.set(key, [post]);
	};
	for (const post of ordered) {
		urls.push({
			path: `${p}/${post.slug}`,
			changefreq: "monthly",
			priority: .8,
			alternate: {
				de: `/${post.slug}`,
				en: `/en/${post.slug}`
			},
			lastmod: newestDate([post])
		});
		const category = post.category?.trim();
		if (category) {
			const slug = categorySlug(category);
			if (slug) collect(categories, slug, post);
		}
		for (const tag of (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase())) if (tag) collect(tags, tag, post);
		if (post.author?.slug) collect(authors, post.author.slug, post);
	}
	for (const slug of [...categories.keys()].sort()) urls.push({
		path: `${p}/${s.category}/${slug}`,
		changefreq: "weekly",
		priority: .5,
		lastmod: newestDate(categories.get(slug))
	});
	for (const tag of [...tags.keys()].sort()) urls.push({
		path: `${p}/tag/${encodeURIComponent(tag)}`,
		changefreq: "weekly",
		priority: .4,
		lastmod: newestDate(tags.get(tag))
	});
	for (const slug of [...authors.keys()].sort()) urls.push({
		path: `${p}/${s.author}/${slug}`,
		changefreq: "weekly",
		priority: .4,
		lastmod: newestDate(authors.get(slug))
	});
	return urls;
}
/**
* Every indexable URL, both trees.
*
* The print views, the OG endpoints, `/install`, the JSON index and the error
* pages are absent — they were excluded by the old integration's `filter` and
* the reasons have not changed. `/install` matters most: it is a noindex
* operator page and listing it would invite a crawler to it.
*/
async function sitemapUrls() {
	const [de, en, patterns] = await Promise.all([
		urlsFor("de"),
		urlsFor("en"),
		exclusionPatterns()
	]);
	const urls = [...de, ...en];
	if (patterns.length === 0) return urls;
	return urls.filter((url) => !groupExcluded(hreflangGroup(url.path), patterns));
}
/**
* The newest per-URL `lastmod` in a set — the date the index should carry.
*
* Undefined only when nothing in the list has a post behind it (an empty or
* unreachable corpus), in which case the caller supplies the document date.
*/
function newestLastmod(urls) {
	let newest;
	for (const url of urls) if (url.lastmod && (!newest || url.lastmod > newest)) newest = url.lastmod;
	return newest;
}
/** `lastmod` is the fallback for entries that carry no date of their own. */
function renderUrlset(urls, lastmod) {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">" + urls.map((url) => {
		const alternates = url.alternate ? [
			`<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(absolute(url.alternate.de))}"/>`,
			`<xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(absolute(url.alternate.en))}"/>`,
			`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(url.alternate.de))}"/>`
		].join("") : "";
		return [
			"<url>",
			`<loc>${escapeXml(absolute(url.path))}</loc>`,
			alternates,
			`<lastmod>${escapeXml(url.lastmod ?? lastmod)}</lastmod>`,
			`<changefreq>${url.changefreq}</changefreq>`,
			`<priority>${url.priority.toFixed(1)}</priority>`,
			"</url>"
		].join("");
	}).join("") + "</urlset>";
}
/**
* The index document.
*
* The filenames are the ones `@astrojs/sitemap` produced and `public/robots.txt`
* advertises; changing them would orphan the entry point Search Console knows.
*/
function renderSitemapIndex(lastmod) {
	return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${escapeXml(absolute("/sitemap-0.xml"))}</loc><lastmod>${escapeXml(lastmod)}</lastmod></sitemap></sitemapindex>`;
}
//#endregion
export { sitemapUrls as i, renderSitemapIndex as n, renderUrlset as r, newestLastmod as t };

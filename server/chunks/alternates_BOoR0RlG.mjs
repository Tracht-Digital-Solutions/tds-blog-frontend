import { c as byAuthor, d as corpus, f as categorySlug, l as byCategory, s as archivePage, u as byTag } from "./cache_CmmuZktQ.mjs";
import { t as isIndexedTag } from "./tagIndexing_Cz1CQhDJ.mjs";
// src/lib/alternates.ts
/**
* `hreflang` for the LISTING pages — tag, category, author and archive.
*
* ### Why they had none
*
* Every listing route passes `altUrl={null}` to the layout, so only articles,
* the two home pages, `/aktuelles` and `/rss` ever carried alternates. The
* reason was sound: the two trees do not mirror by prefix. `/kategorie/…`
* becomes `/en/category/…`, `/autor/…` becomes `/en/author/…`, and — the part
* that actually bites — the *content* differs. German posts are tagged
* `webshop`, their English twins `online-shop`. A prefix-swapped alternate on
* a tag page would have pointed at a 404 on most tags, and one dangling
* alternate invalidates the whole set on both sides.
*
* ### What this does instead
*
* It asks. Each helper looks the counterpart page up in the other language's
* corpus and returns its path only when that page really exists. The corpus is
* fetched once per render generation and cached, so the check costs nothing
* beyond a list scan.
*
* The result is deliberately CONSERVATIVE. A German category whose English
* twin is filed under a different name gets no alternate — there genuinely is
* no page at the mirrored URL, and inventing a link to the nearest equivalent
* would be a claim this module cannot verify. Tags, authors and archive pages,
* whose keys really are identical across trees, gain the alternates they
* should always have had.
*/
/** The other tree. */
function otherLang(lang) {
	return lang === "de" ? "en" : "de";
}
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
/** `/en/tag/x` for `/tag/x`, when the other tree really has that tag. */
async function tagAlternate(lang, tag) {
	const other = otherLang(lang);
	const tagPath = (value) => `${PREFIX[other]}/tag/${encodeURIComponent(value.trim().toLowerCase())}`;
	const group = await byTag(other, tag);
	if (group && isIndexedTag(group.posts.length)) return tagPath(tag);
	if (group) return null;
	return derivedTagTwin(lang, tag).then((twin) => twin ? tagPath(twin) : null);
}
var tagsOf = (post) => (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
/**
* The tag the SAME ARTICLES carry in the other tree (2026-11-11), the way
* `categoryAlternate` derives a category: German posts tagged `digitalisierung`
* are tagged `digitalization` in English, so a slug match never finds them.
*
* Strict, because a wrong pair invalidates both hreflang sets: every
* translated article of this tag must carry the candidate, the candidate's
* page must be indexed, and the candidate's articles that have a twin here
* must be exactly this tag's translated articles. More than one such tag →
* no alternate.
*/
async function derivedTagTwin(lang, tag) {
	const other = otherLang(lang);
	const here = await byTag(lang, tag);
	if (!here || here.posts.length === 0) return null;
	const otherCorpus = await corpus(other);
	const twins = new Map(otherCorpus.map((post) => [post.slug, post]));
	const translated = here.posts.map((post) => twins.get(post.slug)).filter((post) => post !== void 0);
	if (translated.length === 0) return null;
	let candidates = new Set(tagsOf(translated[0]));
	for (const twin of translated.slice(1)) {
		const has = new Set(tagsOf(twin));
		candidates = new Set([...candidates].filter((t) => has.has(t)));
	}
	const hereSlugs = new Set(here.posts.map((post) => post.slug));
	const thisCorpus = new Set((await corpus(lang)).map((post) => post.slug));
	const matches = [];
	for (const candidate of candidates) {
		const group = await byTag(other, candidate);
		if (!group || !isIndexedTag(group.posts.length)) continue;
		const back = group.posts.filter((post) => thisCorpus.has(post.slug));
		if (back.length === translated.length && back.every((post) => hereSlugs.has(post.slug))) matches.push(candidate);
	}
	return matches.length === 1 ? matches[0] : null;
}
/**
* `/en/category/<y>` for `/kategorie/<x>`, where `<y>` is the category the
* SAME ARTICLES are filed under in the other tree.
*
* The slug match is tried first and still covers a category whose name happens
* not to be translated. When it misses — which is the normal case, because
* "Digitalisierung" is filed as "Digitalization" — the counterpart is derived
* from the articles themselves: an article and its translation share a slug,
* so the category its translations sit in IS this category in the other
* language.
*
* That is not "the nearest equivalent", which the module comment above rightly
* refuses. It is the pairing the corpus already states. The derivation is
* still conservative in two ways: at least one article must have a
* translation, and ALL translated articles must agree on one category. A
* category whose articles scatter across several in the other tree is not one
* page in two languages, and gets no alternate.
*/
async function categoryAlternate(lang, slug) {
	const other = otherLang(lang);
	const path = (value) => `${PREFIX[other]}/${SEGMENTS[other].category}/${categorySlug(value)}`;
	const direct = await byCategory(other, slug);
	if (direct && direct.posts.length > 0) return `${PREFIX[other]}/${SEGMENTS[other].category}/${slug.trim().toLowerCase()}`;
	const here = await byCategory(lang, slug);
	if (!here || here.posts.length === 0) return null;
	const twins = new Map((await corpus(other)).map((post) => [post.slug, post]));
	const categories = /* @__PURE__ */ new Set();
	for (const post of here.posts) {
		const twin = twins.get(post.slug);
		if (twin) categories.add(twin.category);
	}
	if (categories.size !== 1) return null;
	return path([...categories][0]);
}
/** `/en/author/x` for `/autor/x`, when that author has posts in the other tree. */
async function authorAlternate(lang, slug) {
	const other = otherLang(lang);
	const group = await byAuthor(other, slug);
	if (!group || group.posts.length === 0) return null;
	return `${PREFIX[other]}/${SEGMENTS[other].author}/${slug.trim()}`;
}
/**
* `/en/page/N` for `/page/N`, when the other tree is long enough to have that
* page. Both trees hold the same articles today, but a page count is derived
* from a live list and must not be assumed.
*/
async function archiveAlternate(lang, page) {
	if (!Number.isInteger(page) || page < 2) return null;
	const other = otherLang(lang);
	return await archivePage(other, String(page)) ? `${PREFIX[other]}/page/${page}` : null;
}
export { tagAlternate as i, authorAlternate as n, categoryAlternate as r, archiveAlternate as t };

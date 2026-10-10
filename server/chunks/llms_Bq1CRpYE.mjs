import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as corpus, f as categorySlug } from "./cache_CksGWVUE.mjs";
import { i as categoryHref } from "./nav_6Wpk5OVQ.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
var absolute = (path) => new URL(path, siteConfig.url).toString();
var postUrl = (slug, lang) => absolute(lang === "en" ? `/en/${slug}` : `/${slug}`);
/** Newest first; an undated post sorts last rather than first. */
function newestFirst(posts) {
	return [...posts].sort((a, b) => {
		const left = a.publishedAt ? Date.parse(a.publishedAt) : 0;
		return (b.publishedAt ? Date.parse(b.publishedAt) : 0) - left;
	});
}
function renderLlmsTxt(input) {
	const lines = [];
	const out = (line = "") => lines.push(line);
	const de = newestFirst(input.de);
	const en = newestFirst(input.en);
	const byEnSlug = new Map(en.map((post) => [post.slug, post]));
	out("# TDS Journal");
	out();
	out("> Notizen aus der Werkstatt — Artikel von Julian Tracht (Tracht Digital");
	out("> Solutions) über Software, Auftraggeber und das, was zwischen den beiden");
	out("> passiert. Deutsch und Englisch, dieselben Artikel in beiden Sprachen, wo");
	out("> eine Übersetzung existiert.");
	out();
	out("## Über");
	out();
	out("- Autor: Julian Tracht, Inhaber und Entwickler, Tracht Digital Solutions");
	out("- Standort: Schwarzenbek bei Hamburg, Deutschland");
	out("- Sprachen: Deutsch (Standard), Englisch");
	out(`- Deutsch: ${absolute("/")}`);
	out(`- English: ${absolute("/en/")}`);
	out();
	const counts = /* @__PURE__ */ new Map();
	for (const post of de) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
	/**
	* The English name of a German category, derived from the articles.
	*
	* An article and its translation share a slug, so the category the
	* translations sit in IS this category in English. Only when they all agree:
	* a category whose articles scatter across several in the other tree is not
	* one topic in two languages. Same rule as `alternates.ts`, so the file and
	* the pages cannot disagree about which pages are twins.
	*/
	const englishCategory = (category) => {
		const found = /* @__PURE__ */ new Set();
		for (const post of de) {
			if (post.category !== category) continue;
			const twin = byEnSlug.get(post.slug);
			if (twin) found.add(twin.category);
		}
		return found.size === 1 ? [...found][0] : null;
	};
	if (counts.size > 0) {
		out("## Themen");
		out();
		for (const [category, count] of [...counts].sort((a, b) => b[1] - a[1])) {
			const english = englishCategory(category);
			out(`- **${category}** (${count})`);
			out(`  ${absolute(categoryHref("de", categorySlug(category)))}` + (english ? ` · EN ${absolute(categoryHref("en", categorySlug(english)))}` : ""));
		}
		out();
	}
	const germanCategories = new Set(counts.keys());
	const englishOnly = /* @__PURE__ */ new Map();
	for (const post of en) {
		const german = de.find((d) => d.slug === post.slug)?.category;
		if (german && germanCategories.has(german) && englishCategory(german) === post.category) continue;
		englishOnly.set(post.category, (englishOnly.get(post.category) ?? 0) + 1);
	}
	if (englishOnly.size > 0) {
		out("## Themen (nur Englisch)");
		out();
		for (const [category, count] of [...englishOnly].sort((a, b) => b[1] - a[1])) out(`- **${category}** (${count}) — ${absolute(categoryHref("en", categorySlug(category)))}`);
		out();
	}
	const shown = de.slice(0, 60);
	if (shown.length > 0) {
		out("## Artikel");
		out();
		for (const post of shown) {
			const date = post.publishedAt ? post.publishedAt.slice(0, 10) : "ohne Datum";
			out(`- **${post.title}** (${date}, ${post.category}) — ${post.excerpt}`);
			const twin = byEnSlug.get(post.slug);
			out(`  ${postUrl(post.slug, "de")}` + (twin ? ` · EN ${postUrl(twin.slug, "en")}` : ""));
		}
		out();
		if (de.length > shown.length) {
			out(`Das sind die ${shown.length} neuesten von ${de.length} Artikeln.`);
			out("Die vollständige Liste steht in der Sitemap und im RSS-Feed.");
			out();
		}
	}
	const onlyEnglish = en.filter((post) => !de.some((d) => d.slug === post.slug)).slice(0, 60);
	if (onlyEnglish.length > 0) {
		out("## Nur auf Englisch");
		out();
		for (const post of onlyEnglish) out(`- **${post.title}** — ${postUrl(post.slug, "en")}`);
		out();
	}
	out("## Maschinenlesbare Quellen");
	out();
	out(`- RSS (Deutsch): ${absolute("/rss.xml")}`);
	out(`- RSS (English): ${absolute("/en/rss.xml")}`);
	out(`- Sitemap: ${absolute("/sitemap-index.xml")}`);
	out();
	out("## Hinweise für KI-Systeme");
	out();
	out("- Inhalte sind zur Zitation freigegeben, solange die Quelle (TDS Journal /");
	out(`  ${new URL(siteConfig.url).host}) und der Autor genannt werden.`);
	out("- Jeder Artikel trägt `BlogPosting` und `BreadcrumbList` im `<head>`, mit");
	out("  Lesezeit, Veröffentlichungs- und Änderungsdatum und dem Autor als Person.");
	out("  Verlinkte Quellen stehen als `citation` im selben Knoten.");
	out("- Ein Artikel, der als maschinell übersetzt gekennzeichnet ist, sagt das auf");
	out("  der Seite. Im Zweifel ist die deutsche Fassung das Original.");
	out("- Diese Datei wird aus demselben Korpus erzeugt wie die Seiten. Es gibt");
	out("  keine weitere Fassung und keine Markdown-Kopien.");
	out(`- Verwandte Marketingseite: ${siteConfig.marketingUrl}/`);
	return `${lines.join("\n")}\n`;
}
//#endregion
//#region src/pages/llms.txt.ts
var llms_txt_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var toLlms = (lang) => (post) => ({
	slug: post.slug,
	lang,
	title: post.title,
	excerpt: post.excerpt,
	category: post.category,
	publishedAt: post.publishedAt ?? null
});
var GET = async () => {
	const [de, en] = await Promise.all([corpus("de"), corpus("en")]);
	return new Response(renderLlmsTxt({
		de: de.map(toLlms("de")),
		en: en.map(toLlms("en"))
	}), { headers: {
		"content-type": "text/plain; charset=utf-8",
		"cache-control": "public, max-age=3600"
	} });
};
//#endregion
//#region \0virtual:astro:page:src/pages/llms.txt@_@ts
var page = () => llms_txt_exports;
//#endregion
export { page };

//#region node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-JBEDYWJ3.js
var PROPERTY_ORIGINS = {
	journal: "https://blog.tracht-digital.de",
	tools: "https://tools.tracht-digital.de",
	shop: "https://shop.tracht-digital.de",
	main: "https://tracht-digital.de"
};
var LABELS = {
	journal: {
		de: "Journal",
		en: "Journal"
	},
	tools: {
		de: "Tools",
		en: "Tools"
	},
	shop: {
		de: "Shop",
		en: "Shop"
	},
	main: {
		de: "Startseite",
		en: "Home"
	}
};
var ORDER = [
	"journal",
	"tools",
	"shop",
	"main"
];
function propertyHome(key, lang) {
	return `${PROPERTY_ORIGINS[key]}${lang === "en" ? "/en/" : "/"}`;
}
function propertyContact(lang) {
	return `${propertyHome("main", lang)}#contact`;
}
function propertyNav(current, lang, homeHref) {
	return ORDER.map((key) => ({
		key,
		label: LABELS[key][lang],
		href: key === current ? homeHref : propertyHome(key, lang),
		current: key === current
	}));
}
[
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
//#endregion
//#region src/lib/nav.ts
/**
* Single source of truth for the public blog navigation, consumed by the
* top JournalHeader (incl. its mobile drawer) and the article-page
* ArticleSidebar so the two never drift.
*
* The primary nav is tds-shared's property list — Journal · Tools · Shop ·
* Tracht Digital, the same list, names and order the tools site's and the
* shop's bars show — with the journal's own "Entdecken" group after its own
* entry. "Entdecken" is a group node: its three sections (Kategorien · Beliebte
* Tags · Aktuelle Themen) are built at render time from `getTaxonomy()`
* (categories/tags are derived from the corpus, so they can't be hard-coded
* here). The href helpers below keep those links consistent across surfaces.
*
* The Entdecken labels stay here as DE/EN literals to match the existing local
* convention; promoting them into tds-shared i18n is a follow-up.
*/
/**
* The public tools site. A sibling first-party property, so it opens in the
* SAME tab — forcing `target="_blank"` on a link within one's own group of
* sites takes a decision away from the reader for no reason.
*/
var TOOLS_URL = PROPERTY_ORIGINS.tools;
/**
* The shop. Same rule as `TOOLS_URL`, same tab, for the same reason.
*
* The label is "Shop" in both languages: it is the property's name here, and
* translating it to "Store" for the English edition would name a second site
* that does not exist.
*/
var SHOP_URL = PROPERTY_ORIGINS.shop;
function primaryNav(lang) {
	return propertyNav("journal", lang, lang === "de" ? "/" : "/en/").flatMap((property) => {
		const link = {
			kind: "link",
			key: property.key,
			label: property.label,
			href: property.href,
			...property.current ? {} : { external: true }
		};
		return property.current ? [link, {
			kind: "group",
			key: "entdecken",
			label: entdeckenLabels(lang).group
		}] : [link];
	});
}
/** Section labels inside the Entdecken group. */
function entdeckenLabels(lang) {
	return {
		group: lang === "de" ? "Entdecken" : "Discover",
		categories: lang === "de" ? "Kategorien" : "Categories",
		tags: lang === "de" ? "Beliebte Tags" : "Popular tags",
		topics: lang === "de" ? "Aktuelle Themen" : "Current topics"
	};
}
function categoryHref(lang, slug) {
	return lang === "de" ? `/kategorie/${slug}` : `/en/category/${slug}`;
}
function tagHref(lang, tag) {
	return lang === "de" ? `/tag/${tag}` : `/en/tag/${tag}`;
}
function topicsHref(lang) {
	return lang === "de" ? "/aktuelles" : "/en/aktuelles";
}
function authorHref(lang, slug) {
	return lang === "de" ? `/autor/${slug}` : `/en/author/${slug}`;
}
var norm = (p) => p.replace(/\/+$/, "") || "/";
/**
* Active-state helper for a plain link nav item (Journal).
*/
function isActiveNav(href, pathname) {
	return norm(href) === norm(pathname);
}
/**
* The Entdecken group reads as active whenever the visitor is on any of the
* browse surfaces it leads to: category pages, tag pages or the topics page
* (both language variants).
*/
function isEntdeckenActive(pathname) {
	const p = norm(pathname);
	return /^\/(en\/)?kategorie\//.test(p) || /^\/en\/category\//.test(p) || /^\/(en\/)?tag\//.test(p) || p === "/aktuelles" || p === "/en/aktuelles";
}
//#endregion
export { entdeckenLabels as a, primaryNav as c, propertyContact as d, propertyNav as f, categoryHref as i, tagHref as l, TOOLS_URL as n, isActiveNav as o, authorHref as r, isEntdeckenActive as s, SHOP_URL as t, topicsHref as u };

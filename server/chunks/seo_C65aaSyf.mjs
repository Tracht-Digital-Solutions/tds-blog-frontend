//#region src/lib/seo.ts
/**
* Shared SEO / identity config for tds-blog.
*
* Keeps the Organization + Person + Blog/WebSite JSON-LD in sync with
* tds-landingpage by reusing the same field shape. When the marketing
* site's seo.ts is updated post-launch (real address, phone, social
* URLs from issues #5/#6/#7 over there), mirror the change here.
*/
var siteConfig = {
	name: "Tracht Digital Solutions",
	shortName: "TDS",
	/** Production origin. Mirrors `astro.config.mjs#site`. */
	url: "https://blog.tracht-digital.de",
	/** Sister origin — used in WebSite + Organization references. */
	marketingUrl: "https://tracht-digital.de",
	defaultLocale: "de",
	/**
	* Meta descriptions. Google renders roughly the first 155–160 characters,
	* so both stay under 160 — `metaDescription.test.ts` fails the build if
	* either grows past it or shrinks below the length at which a description
	* carries any information.
	*
	* The blog is one of the two INDEXABLE properties, so it carries the same
	* two keyword commitments as the landingpage (root CLAUDE.md): the exact
	* phrase "Digitalisierung für Unternehmen" and the local signal
	* Schwarzenbek/Hamburg. The local half was missing here entirely until
	* 2026-08-16 — the journal ranked as a generic dev blog with nothing tying
	* it to the business it belongs to. Trim the topic list before either.
	*/
	description: {
		de: "Praxisnahe Artikel über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung — das Journal von Tracht Digital Solutions aus Schwarzenbek.",
		en: "Hands-on articles on digitalization for businesses, web development and automation — the journal of Tracht Digital Solutions, Schwarzenbek near Hamburg."
	},
	blogName: {
		de: "TDS Journal",
		en: "TDS Journal"
	},
	email: "kontakt@tracht-digital.de",
	legalName: "Julian Tracht",
	founder: {
		name: "Julian Tracht",
		jobTitle: "Inhaber & Entwickler"
	},
	/**
	* Verified postal code + locality (matches the landingpage Impressum).
	* The street stays Impressum-only over on tds-landingpage.
	*/
	address: {
		postalCode: "21493",
		addressLocality: "Schwarzenbek",
		addressRegion: "Schleswig-Holstein",
		addressCountry: "DE"
	},
	/** Public social URLs — mirror tds-landingpage's seo.ts. */
	socials: {
		linkedin: "https://www.linkedin.com/in/julian-tracht/",
		github: "https://github.com/Tracht-Digital-Solutions"
	}
};
/** The brand half of a page title, appended when there is room for it. */
var TITLE_SUFFIX = " — Journal";
/**
* Compose a page `<title>`.
*
* Every route used to build its own string inline, which produced two
* different brand halves (`— Journal` on articles and taxonomy pages,
* `— Tracht Digital Solutions` on the archive) and no length control at all:
* only descriptions were ever measured. A title past what a search result
* renders is cut by the engine, wherever that happens to land.
*
* The rule when it does not fit is to **drop the brand, never the subject**.
* The article's own words are what a reader scans for; the site name is the
* part that can be inferred from the URL. Clamping is the last resort, and
* only for a title long enough to be useless in a result either way.
*/
function pageTitle(subject) {
	const name = subject.trim().replace(/\s+/g, " ");
	if (!name) return siteConfig.blogName[siteConfig.defaultLocale];
	const full = `${name}${TITLE_SUFFIX}`;
	if (full.length <= 60) return full;
	if (name.length <= 90) return name;
	const cut = name.slice(0, Math.floor(90) - 1);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd().replace(/[\s.,;:—–-]+$/, "")}…`;
}
//#endregion
export { siteConfig as n, pageTitle as t };

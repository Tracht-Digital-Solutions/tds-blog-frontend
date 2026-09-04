import { n as siteConfig } from "./seo_C65aaSyf.mjs";
//#region src/lib/jsonld.ts
/**
* Schema.org JSON-LD generators for the journal.
*
* The Organization / Person nodes mirror tds-landingpage's so a search
* engine that crawls both sites can stitch them into a single entity
* graph via the @id URLs. The marketing site is the canonical home —
* Organization @id lives at `tracht-digital.de/#organization`,
* Person at `tracht-digital.de/#person`.
*
* The blog adds:
*   - Blog (the index)
*   - WebSite (with the journal-specific SearchAction stub)
*   - BlogPosting (per post)
*   - BreadcrumbList (per post)
*/
/** @id for the Organization, anchored on the marketing domain. */
var orgId = `${siteConfig.marketingUrl}/#organization`;
var personId = `${siteConfig.marketingUrl}/#person`;
/**
* The @id of the Person an author page describes. One rule, two callers —
* `blogPostingSchema` (the byline on an article) and `profilePageSchema`
* (the page itself) — because that shared identifier is the only thing that
* makes them the same entity to a crawler.
*/
function authorPersonId(authorPageUrl) {
	return `${authorPageUrl}#person`;
}
/** The @id of a language tree's Blog node (`blogSchema` owns the node). */
function blogId(lang) {
	return `${lang === "en" ? `${siteConfig.url}/en/` : `${siteConfig.url}/`}#blog`;
}
/**
* The Organization node itself, not just a reference.
*
* `organizationRef()` names an `@id` on the marketing domain and nothing else,
* which is correct only for a crawler that has also fetched that domain and
* resolved it. Every `publisher` on this site pointed at that bare `@id`, so on
* its own the blog's graph declared a publisher with no name and no logo —
* precisely the two properties Google's article guidance asks a publisher for.
*
* Emitting a consistent full node here does not fork the entity: the `@id` is
* the same, so the two descriptions merge. The values must therefore stay in
* step with the marketing site's `seo.ts`, which is why they all come from
* `siteConfig`.
*/
function organizationSchema() {
	const sameAs = Object.values(siteConfig.socials).filter((url) => typeof url === "string" && url !== "");
	return {
		"@type": "Organization",
		"@id": orgId,
		name: siteConfig.name,
		legalName: siteConfig.legalName,
		url: siteConfig.marketingUrl,
		email: siteConfig.email,
		logo: {
			"@type": "ImageObject",
			url: `${siteConfig.url}/brand/td-logomark.webp`
		},
		address: {
			"@type": "PostalAddress",
			postalCode: siteConfig.address.postalCode,
			addressLocality: siteConfig.address.addressLocality,
			addressRegion: siteConfig.address.addressRegion,
			addressCountry: siteConfig.address.addressCountry
		},
		founder: { "@id": personId },
		...sameAs.length > 0 ? { sameAs } : {}
	};
}
/**
* WebSite node for the blog. Deliberately WITHOUT a `potentialAction`
* SearchAction: the journal has no site search endpoint, and a
* non-functional url template is worse than none (crawlers probe it).
* Add one only when a real search route exists.
*
* `lang` is not decoration. This node used to hard-code `blogName.de` and
* `description.de`, so every English page shipped a German name and a German
* description in its structured data while the visible page and the `og:`
* tags said something else — a mismatch on exactly the pages that need the
* language signal most.
*/
function websiteSchema(lang = siteConfig.defaultLocale) {
	return {
		"@type": "WebSite",
		"@id": `${siteConfig.url}/#website`,
		url: siteConfig.url,
		name: siteConfig.blogName[lang],
		description: siteConfig.description[lang],
		publisher: { "@id": orgId },
		inLanguage: ["de-DE", "en-GB"]
	};
}
/**
* Blog node — used on every index page. inLanguage matters here so
* Google distinguishes the DE and EN landings.
*/
function blogSchema(lang) {
	const langUrl = lang === "en" ? `${siteConfig.url}/en/` : `${siteConfig.url}/`;
	return {
		"@type": "Blog",
		"@id": blogId(lang),
		url: langUrl,
		name: siteConfig.blogName[lang],
		description: siteConfig.description[lang],
		inLanguage: lang === "de" ? "de-DE" : "en-GB",
		publisher: { "@id": orgId },
		author: { "@id": personId }
	};
}
function blogPostingSchema(post) {
	const pageUrl = new URL(post.lang === "en" ? `/en/${post.slug}` : `/${post.slug}`, siteConfig.url).toString();
	const datePublished = post.publishedAt ?? void 0;
	const dateModified = post.updatedAt ?? post.publishedAt ?? void 0;
	const authorName = post.author?.name?.trim();
	const author = authorName ? {
		"@type": "Person",
		...post.author?.url ? {
			"@id": authorPersonId(post.author.url),
			url: post.author.url
		} : {},
		name: authorName
	} : { "@id": personId };
	const keywords = (post.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"@id": `${pageUrl}#article`,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": pageUrl
		},
		url: pageUrl,
		headline: post.title,
		description: post.excerpt,
		articleSection: post.category,
		...keywords.length > 0 ? { keywords } : {},
		inLanguage: post.lang === "de" ? "de-DE" : "en-GB",
		datePublished,
		dateModified,
		wordCount: post.wordCount,
		image: {
			"@type": "ImageObject",
			url: post.imageUrl,
			width: 1200,
			height: 630
		},
		author,
		publisher: { "@id": orgId },
		isPartOf: { "@id": blogId(post.lang) }
	};
}
/**
* What a listing page lists, in the order it lists it.
*
* Index, archive, tag, category and author pages emitted `WebSite + Blog` and
* stopped there — nothing said which articles were on the page or in what
* order, so a listing page's structured data was indistinguishable from the
* home page's. `ItemList` with `url`-only entries is the shape Google reads
* for a collection: it points at the articles, whose own `BlogPosting` carries
* the detail, rather than restating them here where they could drift.
*
* Positions are 1-based and follow the rendered order, so page 2 of the
* archive starts at 11 rather than at 1 — the list describes the page, but the
* positions describe the collection.
*/
function itemListSchema(urls, startPosition = 1) {
	return {
		"@type": "ItemList",
		itemListOrder: "https://schema.org/ItemListOrderDescending",
		numberOfItems: urls.length,
		itemListElement: urls.map((url, i) => ({
			"@type": "ListItem",
			position: startPosition + i,
			url
		}))
	};
}
/**
* The listing page itself.
*
* The listing routes emitted `WebSite + Blog + ItemList + BreadcrumbList` and
* nothing that *was* the page: the ItemList floated in the graph attached to
* no entity, so nothing said which page listed those articles or where it
* belonged. `CollectionPage` is that node — it carries the page's own URL,
* the same name and description the `<head>` already commits to, its place in
* the language tree, and the list as its `mainEntity`.
*
* The caller passes the ItemList it built, rather than the URLs, because
* archive pages number their positions from the corpus (page 2 starts at 11)
* and only the caller knows the offset.
*/
function collectionPageSchema(opts) {
	return {
		"@type": "CollectionPage",
		"@id": `${opts.url}#page`,
		url: opts.url,
		name: opts.name,
		description: opts.description,
		inLanguage: opts.lang === "de" ? "de-DE" : "en-GB",
		isPartOf: { "@id": blogId(opts.lang) },
		mainEntity: opts.itemList
	};
}
/**
* An author page.
*
* `ProfilePage` with the Person as `mainEntity` is the shape Google documents
* for author pages; a bare Person node says who someone is but never says the
* page is *about* them. The Person keeps the `@id` from `authorPersonId`, so
* every article that person wrote points at this same node.
*/
function profilePageSchema(opts) {
	return {
		"@type": "ProfilePage",
		"@id": `${opts.url}#page`,
		url: opts.url,
		inLanguage: opts.lang === "de" ? "de-DE" : "en-GB",
		isPartOf: { "@id": blogId(opts.lang) },
		...opts.dateModified ? { dateModified: opts.dateModified } : {},
		mainEntity: opts.person
	};
}
/** BreadcrumbList helper (Home → category → post). */
function breadcrumbSchema(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}
/**
* Wrap nodes into a single `@graph` document.
*
* The members are stripped of their own `@context` on the way in. Several
* builders here return a standalone document (they are also used on their
* own — `Article.astro` passes an array of independent objects to `JsonLd`,
* where each one needs its context), and nesting those inside `@graph` left
* the context declared twice: once on the document and once on a member that
* inherits it anyway. Harmless to a lenient parser, wrong per JSON-LD, and
* the kind of thing that only shows up in a validator months later.
*
* `asGraph` is the sole context owner for anything it wraps.
*/
function asGraph(...nodes) {
	return {
		"@context": "https://schema.org",
		"@graph": nodes.map((node) => {
			if (!("@context" in node)) return node;
			const { "@context": _ctx, ...rest } = node;
			return rest;
		})
	};
}
//#endregion
export { breadcrumbSchema as a, organizationSchema as c, blogSchema as i, profilePageSchema as l, authorPersonId as n, collectionPageSchema as o, blogPostingSchema as r, itemListSchema as s, asGraph as t, websiteSchema as u };

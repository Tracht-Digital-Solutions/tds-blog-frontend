import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_E54re6b9.mjs";
import { t as createComponent } from "./compiler_BvE05Vkz.mjs";
import { t as $$Layout } from "./Layout_CFBT5G7K.mjs";
import { l as byCategory } from "./cache_CksGWVUE.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, c as itemListSchema, d as websiteSchema, i as blogSchema, o as collectionPageSchema, t as asGraph } from "./jsonld_BRIJr-dK.mjs";
import { r as categoryDescription } from "./metaDescription_Bxyn0lUM.mjs";
import { r as categoryAlternate } from "./alternates_C0WbCexg.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_CxHD-aa4.mjs";
//#region src/pages/kategorie/[cat].astro
var _cat__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Cat,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Cat = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Cat;
	const cat = Astro.params.cat;
	const group = await byCategory("de", cat);
	if (!group) return new Response(null, { status: 404 });
	const { name, posts } = group;
	const altPath = await categoryAlternate("de", cat);
	const pageUrl = `${siteConfig.url}/kategorie/${cat}`;
	const title = pageTitle(name);
	const description = categoryDescription(name, "de");
	const jsonLd = asGraph(websiteSchema("de"), blogSchema("de"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "de",
		itemList: itemListSchema(posts.map((p) => `${siteConfig.url}/${p.slug}`))
	}), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/`
	}, {
		name,
		url: pageUrl
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><a href="/" class="btn-back"><span aria-hidden="true">←</span> Alle Beiträge</a><p class="section-num mb-4 mt-6">Journal · Kategorie</p><h1 class="display page-title"><span class="accent-italic">${name}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "Ein Artikel in dieser Kategorie." : `${posts.length} Artikel in dieser Kategorie.`}</p></div></header><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack jnl-shelf">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"readingMinutes": p.readingMinutes,
		"lang": "de"
	})}`)}</ul></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/kategorie/[cat].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/kategorie/[cat].astro";
var $$url = "/kategorie/[cat]";
//#endregion
//#region \0virtual:astro:page:src/pages/kategorie/[cat]@_@astro
var page = () => _cat__exports;
//#endregion
export { page };

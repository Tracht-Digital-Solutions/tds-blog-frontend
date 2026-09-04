import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_BwFgsHbM.mjs";
import { o as byCategory } from "./cache_C7psdfsG.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, i as blogSchema, o as collectionPageSchema, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { r as categoryDescription } from "./metaDescription_BzckGtuv.mjs";
import { r as categoryAlternate } from "./alternates_BBW_OARj.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_0pIXdyOa.mjs";
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
	if (!group) return new Response("Not found", { status: 404 });
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
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="tds-shell py-16 lg:py-24"><header class="mb-10"><a href="/" class="btn-back mb-6"><span aria-hidden="true">←</span> Alle Beiträge</a><p class="section-num mb-4 mt-6">Journal · Kategorie</p><h1 class="display page-title"><span class="accent-italic">${name}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "Ein Artikel in dieser Kategorie." : `${posts.length} Artikel in dieser Kategorie.`}</p></header><ul class="list-none p-0 m-0">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"lang": "de"
	})}`)}</ul></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/kategorie/[cat].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/kategorie/[cat].astro";
var $$url = "/kategorie/[cat]";
//#endregion
//#region \0virtual:astro:page:src/pages/kategorie/[cat]@_@astro
var page = () => _cat__exports;
//#endregion
export { page };

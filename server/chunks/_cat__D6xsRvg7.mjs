import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_ZXMBwXGa.mjs";
import { o as byCategory } from "./cache_CMM7wTu7.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, i as blogSchema, o as collectionPageSchema, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { r as categoryDescription } from "./metaDescription_BzckGtuv.mjs";
import { r as categoryAlternate } from "./alternates_C58gd8rp.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_0pIXdyOa.mjs";
//#region src/pages/en/category/[cat].astro
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
	const group = await byCategory("en", cat);
	if (!group) return new Response("Not found", { status: 404 });
	const { name, posts } = group;
	const altPath = await categoryAlternate("en", cat);
	const pageUrl = `${siteConfig.url}/en/category/${cat}`;
	const title = pageTitle(name);
	const description = categoryDescription(name, "en");
	const jsonLd = asGraph(websiteSchema("en"), blogSchema("en"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "en",
		itemList: itemListSchema(posts.map((p) => `${siteConfig.url}/en/${p.slug}`))
	}), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/en/`
	}, {
		name,
		url: `${siteConfig.url}/en/category/${cat}`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"lang": "en",
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="tds-shell py-16 lg:py-24"><header class="mb-10"><a href="/en/" class="btn-back mb-6"><span aria-hidden="true">←</span> All posts</a><p class="section-num mb-4 mt-6">Journal · Category</p><h1 class="display page-title"><span class="accent-italic">${name}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "One article in this category." : `${posts.length} articles in this category.`}</p></header><ul class="list-none p-0 m-0">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"lang": "en"
	})}`)}</ul></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/category/[cat].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/category/[cat].astro";
var $$url = "/en/category/[cat]";
//#endregion
//#region \0virtual:astro:page:src/pages/en/category/[cat]@_@astro
var page = () => _cat__exports;
//#endregion
export { page };

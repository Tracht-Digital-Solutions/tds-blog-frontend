import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_ReSFEh7V.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CpHEml6m.mjs";
import { t as $$Layout } from "./Layout_B_QEA2uz.mjs";
import { l as byCategory } from "./cache_qYAc2MYZ.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_DXIXsesw.mjs";
import { a as breadcrumbSchema, c as itemListSchema, d as websiteSchema, i as blogSchema, o as collectionPageSchema, t as asGraph } from "./jsonld_0HmREYVr.mjs";
import { r as categoryDescription } from "./metaDescription_QGOC0pux.mjs";
import { r as categoryAlternate } from "./alternates_Bt2IA9TW.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_COZ94kB5.mjs";
// src/pages/en/category/[cat].astro
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
	if (!group) return new Response(null, { status: 404 });
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
		name: "Ratgeber",
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
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><a href="/en/" class="btn-back"><span aria-hidden="true">←</span> All posts</a><p class="section-num mb-4 mt-6">Ratgeber · Category</p><h1 class="display page-title"><span class="accent-italic">${name}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "One article in this category." : `${posts.length} articles in this category.`}</p></div></header><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack jnl-shelf">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"readingMinutes": p.readingMinutes,
		"lang": "en"
	})}`)}</ul></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/category/[cat].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/category/[cat].astro";
var $$url = "/en/category/[cat]";
// \0virtual:astro:page:src/pages/en/category/[cat]@_@astro
var page = () => _cat__exports;
export { page };

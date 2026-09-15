import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_BU0hsnhb.mjs";
import { t as createComponent } from "./compiler_CDBSO3Ry.mjs";
import { t as $$Layout } from "./Layout_BQ20V1_U.mjs";
import { s as byTag } from "./cache_TutC0xtL.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { t as $$TagList } from "./TagList_Cm0VVrd6.mjs";
import { a as breadcrumbSchema, i as blogSchema, o as collectionPageSchema, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { o as tagDescription } from "./metaDescription_BzckGtuv.mjs";
import { i as tagAlternate } from "./alternates_Bde-7Osz.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_B8f7I59L.mjs";
//#region src/pages/en/tag/[tag].astro
var _tag__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Tag,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Tag = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tag;
	const tag = Astro.params.tag;
	const group = await byTag("en", tag);
	if (!group) return new Response("Not found", { status: 404 });
	const { posts, allPosts } = group;
	const altPath = await tagAlternate("en", tag);
	const pageUrl = `${siteConfig.url}/en/tag/${tag}`;
	const title = pageTitle(`#${tag}`);
	const description = tagDescription(tag, "en");
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
		name: `#${tag}`,
		url: `${siteConfig.url}/en/tag/${tag}`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"lang": "en",
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><a href="/en/" class="btn-back"><span aria-hidden="true">←</span> All posts</a><p class="section-num mb-4 mt-6">Journal · Tag</p><h1 class="display page-title">#<span class="accent-italic">${tag}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "One article on the topic." : `${posts.length} articles on the topic.`}</p></div></header><section class="jnl-band jnl-tone-sand"><div class="tds-shell">${renderComponent($$result, "TagList", $$TagList, {
		"posts": allPosts,
		"lang": "en",
		"activeTag": tag,
		"label": "All tags"
	})}</div></section><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"lang": "en"
	})}`)}</ul></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/tag/[tag].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/tag/[tag].astro";
var $$url = "/en/tag/[tag]";
//#endregion
//#region \0virtual:astro:page:src/pages/en/tag/[tag]@_@astro
var page = () => _tag__exports;
//#endregion
export { page };

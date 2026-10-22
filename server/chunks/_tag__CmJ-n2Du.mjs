import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_ReSFEh7V.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CpHEml6m.mjs";
import { t as $$Layout } from "./Layout_CLtREmTt.mjs";
import { u as byTag } from "./cache_BDdx2I78.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_DXIXsesw.mjs";
import { t as $$TagList } from "./TagList_DsePAqEz.mjs";
import { a as breadcrumbSchema, c as itemListSchema, d as websiteSchema, i as blogSchema, o as collectionPageSchema, t as asGraph } from "./jsonld_2FEpoJQm.mjs";
import { a as tagDescription } from "./metaDescription_BIbD_PiG.mjs";
import { t as isIndexedTag } from "./tagIndexing_Cz1CQhDJ.mjs";
import { i as tagAlternate } from "./alternates_5ASXsFlW.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_BUALpUGq.mjs";
// src/pages/tag/[tag].astro
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
	const group = await byTag("de", tag);
	if (!group) return new Response(null, { status: 404 });
	const { posts, allPosts } = group;
	const altPath = await tagAlternate("de", tag);
	const pageUrl = `${siteConfig.url}/tag/${tag}`;
	const title = pageTitle(`Beiträge zu #${tag}`);
	const description = tagDescription(tag, "de");
	const jsonLd = asGraph(websiteSchema("de"), blogSchema("de"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "de",
		itemList: itemListSchema(posts.map((p) => `${siteConfig.url}/${p.slug}`))
	}), breadcrumbSchema([{
		name: "Ratgeber",
		url: `${siteConfig.url}/`
	}, {
		name: `#${tag}`,
		url: pageUrl
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"jsonLd": jsonLd,
		"noindex": !isIndexedTag(posts.length),
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><a href="/" class="btn-back"><span aria-hidden="true">←</span> Alle Beiträge</a><p class="section-num mb-4 mt-6">Ratgeber · Tag</p><h1 class="display page-title">#<span class="accent-italic">${tag}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "Ein Artikel zum Thema." : `${posts.length} Artikel zum Thema.`}</p></div></header><section class="jnl-band jnl-tone-sand"><div class="tds-shell">${renderComponent($$result, "TagList", $$TagList, {
		"posts": allPosts,
		"lang": "de",
		"activeTag": tag,
		"label": "Alle Tags"
	})}</div></section><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack jnl-shelf">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"readingMinutes": p.readingMinutes,
		"lang": "de"
	})}`)}</ul></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/tag/[tag].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/tag/[tag].astro";
var $$url = "/tag/[tag]";
// \0virtual:astro:page:src/pages/tag/[tag]@_@astro
var page = () => _tag__exports;
export { page };

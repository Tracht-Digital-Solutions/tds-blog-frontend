import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as maybeRenderHead, C as renderComponent, k as renderTemplate } from "./sequence_4TwHRs5k.mjs";
import { t as createAstro } from "./compiler_DUKTb6Ws.mjs";
import { f as createComponent, t as $$Layout } from "./Layout_CE6wMohm.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_6tFRmkpZ.mjs";
import { t as $$TagList } from "./TagList_C3TZdAPu.mjs";
import { u as byTag } from "./cache_hGs3QUYP.mjs";
import { a as breadcrumbSchema, c as itemListSchema, d as websiteSchema, i as blogSchema, o as collectionPageSchema, t as asGraph } from "./jsonld_C09Kkd8q.mjs";
import { i as tagAlternate } from "./alternates_CHxyGa2n.mjs";
import { t as isIndexedTag } from "./tagIndexing_Cz1CQhDJ.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_DXIXsesw.mjs";
import { a as tagDescription } from "./metaDescription_B0TO73mZ.mjs";
// src/pages/en/tag/[tag].astro
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
	if (!group) return new Response(null, { status: 404 });
	const { posts, allPosts } = group;
	const altPath = await tagAlternate("en", tag);
	const pageUrl = `${siteConfig.url}/en/tag/${tag}`;
	const title = pageTitle(`Posts tagged #${tag}`);
	const description = tagDescription(tag, "en");
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
		name: `#${tag}`,
		url: `${siteConfig.url}/en/tag/${tag}`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"lang": "en",
		"jsonLd": jsonLd,
		"noindex": !isIndexedTag(posts.length),
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><a href="/en/" class="btn-back"><span aria-hidden="true">←</span> All posts</a><p class="section-num mb-4 mt-6">Ratgeber · Tag</p><h1 class="display page-title">#<span class="accent-italic">${tag}</span></h1><p class="marginalia mt-3">${posts.length === 1 ? "One article on the topic." : `${posts.length} articles on the topic.`}</p></div></header><section class="jnl-band jnl-tone-sand"><div class="tds-shell">${renderComponent($$result, "TagList", $$TagList, {
		"posts": allPosts,
		"lang": "en",
		"activeTag": tag,
		"label": "All tags"
	})}</div></section><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack jnl-shelf">${posts.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"readingMinutes": p.readingMinutes,
		"lang": "en"
	})}`)}</ul></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/tag/[tag].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/tag/[tag].astro";
var $$url = "/en/tag/[tag]";
// \0virtual:astro:page:src/pages/en/tag/[tag]@_@astro
var page = () => _tag__exports;
export { page };

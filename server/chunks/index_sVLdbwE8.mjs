import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent, k as maybeRenderHead } from "./sequence_C9xNxrDs.mjs";
import "./compiler_EL8fTkBE.mjs";
import { f as createComponent, t as $$Layout } from "./Layout_BMcC3_Tl.mjs";
import { i as BlogIndex, n as $$ToolsPromo, r as ForYou, t as toIndexPost } from "./indexPosts_qpDP3_e5.mjs";
import { S as listReads, b as listAllPosts, x as listPopular } from "./cache_BquBJcQv.mjs";
import { c as itemListSchema, d as websiteSchema, i as blogSchema, l as organizationSchema, t as asGraph } from "./jsonld_CojOQ45f.mjs";
import { n as siteConfig } from "./seo_DXIXsesw.mjs";
// src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	let allPosts = [];
	let popular = [];
	try {
		let reads;
		[allPosts, popular, reads] = await Promise.all([
			listAllPosts("de"),
			listPopular("de", 6),
			listReads("de")
		]);
		if (reads.size > 0) allPosts = allPosts.map((p) => ({
			...p,
			viewCount: reads.get(p.slug) ?? 0
		}));
	} catch (err) {
		console.error("[tds-blog] failed to fetch posts at build time:", err);
	}
	const jsonLd = asGraph(websiteSchema("de"), blogSchema("de"), organizationSchema(), itemListSchema(allPosts.slice(0, 10).map((p) => `${siteConfig.url}/${p.slug}`)));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Ratgeber — Digitalisierung, Software & Mittelstand",
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "BlogIndex", BlogIndex, {
		"posts": allPosts.map(toIndexPost),
		"popular": popular.map(toIndexPost),
		"lang": "de",
		"pageSize": 10,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/BlogIndex.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "ToolsPromo", $$ToolsPromo, { "lang": "de" })}${renderComponent($$result, "ForYou", ForYou, {
		"lang": "de",
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "~/components/islands/ForYou.tsx",
		"client:component-export": "default"
	})}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/index.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/index.astro";
// \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
export { page };

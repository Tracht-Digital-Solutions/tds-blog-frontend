import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_BeD7A7Kt.mjs";
import { n as createComponent } from "./compiler_DG-Tx2-f.mjs";
import { t as $$Layout } from "./Layout_DJgHM1El.mjs";
import { S as listReads, b as listAllPosts, x as listPopular } from "./cache_t01vT2Lk.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { c as itemListSchema, d as websiteSchema, i as blogSchema, l as organizationSchema, t as asGraph } from "./jsonld_BRIJr-dK.mjs";
import { n as ForYou, r as BlogIndex, t as $$ToolsPromo } from "./ToolsPromo_XKclniZv.mjs";
//#region src/pages/en/index.astro
var en_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => "/en"
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	let allPosts = [];
	let popular = [];
	try {
		let reads;
		[allPosts, popular, reads] = await Promise.all([
			listAllPosts("en"),
			listPopular("en", 6),
			listReads("en")
		]);
		if (reads.size > 0) allPosts = allPosts.map((p) => ({
			...p,
			viewCount: reads.get(p.slug) ?? 0
		}));
	} catch (err) {
		console.error("[tds-blog] failed to fetch posts at build time:", err);
	}
	const jsonLd = asGraph(websiteSchema("en"), blogSchema("en"), organizationSchema(), itemListSchema(allPosts.slice(0, 10).map((p) => `${siteConfig.url}/en/${p.slug}`)));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "TDS Journal — Digitalization, Software & SMEs",
		"lang": "en",
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "BlogIndex", BlogIndex, {
		"posts": allPosts,
		"popular": popular,
		"lang": "en",
		"pageSize": 10,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/BlogIndex.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "ToolsPromo", $$ToolsPromo, { "lang": "en" })}${renderComponent($$result, "ForYou", ForYou, {
		"lang": "en",
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "~/components/islands/ForYou.tsx",
		"client:component-export": "default"
	})}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/index.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/en/index@_@astro
var page = () => en_exports;
//#endregion
export { page };

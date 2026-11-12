import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as maybeRenderHead, C as renderComponent, k as renderTemplate } from "./sequence_4TwHRs5k.mjs";
import "./compiler_DUKTb6Ws.mjs";
import { f as createComponent, t as $$Layout } from "./Layout_CScXTsWv.mjs";
import { t as $$RssInfo } from "./RssInfo_DbiAcM5x.mjs";
import { a as breadcrumbSchema, d as websiteSchema, t as asGraph } from "./jsonld_By5_V016.mjs";
import { n as siteConfig } from "./seo_DXIXsesw.mjs";
// src/pages/en/rss.astro
var rss_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rss,
	file: () => $$file,
	url: () => $$url
});
var $$Rss = createComponent(($$result, $$props, $$slots) => {
	const jsonLd = asGraph(websiteSchema("en"), breadcrumbSchema([{
		name: "Ratgeber",
		url: `${siteConfig.url}/en/`
	}, {
		name: "RSS",
		url: `${siteConfig.url}/en/rss`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Subscribe via RSS — Ratgeber",
		"description": "Subscribe to the Ratgeber via RSS: the feed address, recommended RSS readers and what to expect from the posts.",
		"jsonLd": jsonLd,
		"lang": "en"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "RssInfo", $$RssInfo, { "lang": "en" })}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/rss.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/rss.astro";
var $$url = "/en/rss";
// \0virtual:astro:page:src/pages/en/rss@_@astro
var page = () => rss_exports;
export { page };

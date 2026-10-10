import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_E54re6b9.mjs";
import { t as createComponent } from "./compiler_BvE05Vkz.mjs";
import { t as $$Layout } from "./Layout_CSAT5jey.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, d as websiteSchema, t as asGraph } from "./jsonld_BRIJr-dK.mjs";
import { t as $$RssInfo } from "./RssInfo_DUR4ZRjX.mjs";
//#region src/pages/en/rss.astro
var rss_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rss,
	file: () => $$file,
	url: () => $$url
});
var $$Rss = createComponent(($$result, $$props, $$slots) => {
	const jsonLd = asGraph(websiteSchema("en"), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/en/`
	}, {
		name: "RSS",
		url: `${siteConfig.url}/en/rss`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Subscribe via RSS — Journal",
		"description": "Subscribe to the TDS Journal via RSS: the feed address, recommended RSS readers and what to expect from the posts.",
		"jsonLd": jsonLd,
		"lang": "en"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "RssInfo", $$RssInfo, { "lang": "en" })}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/rss.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/rss.astro";
var $$url = "/en/rss";
//#endregion
//#region \0virtual:astro:page:src/pages/en/rss@_@astro
var page = () => rss_exports;
//#endregion
export { page };

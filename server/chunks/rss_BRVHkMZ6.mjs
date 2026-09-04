import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_ZXMBwXGa.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { t as $$RssInfo } from "./RssInfo_SINjXBB5.mjs";
//#region src/pages/rss.astro
var rss_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rss,
	file: () => $$file,
	url: () => $$url
});
var $$Rss = createComponent(($$result, $$props, $$slots) => {
	const jsonLd = asGraph(websiteSchema("de"), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/`
	}, {
		name: "RSS",
		url: `${siteConfig.url}/rss`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "RSS abonnieren — Journal",
		"description": "Das TDS Journal per RSS abonnieren: die Feed-Adresse, empfohlene RSS-Programme und was dich in den Beiträgen erwartet.",
		"jsonLd": jsonLd,
		"lang": "de"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "RssInfo", $$RssInfo, { "lang": "de" })}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/rss.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/rss.astro";
var $$url = "/rss";
//#endregion
//#region \0virtual:astro:page:src/pages/rss@_@astro
var page = () => rss_exports;
//#endregion
export { page };

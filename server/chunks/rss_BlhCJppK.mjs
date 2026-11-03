import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent, k as maybeRenderHead } from "./sequence_C9xNxrDs.mjs";
import "./compiler_EL8fTkBE.mjs";
import { f as createComponent, t as $$Layout } from "./Layout_CLT5xWk1.mjs";
import { t as $$RssInfo } from "./RssInfo_Dti5l3-k.mjs";
import { a as breadcrumbSchema, d as websiteSchema, t as asGraph } from "./jsonld_CPDMtTYw.mjs";
import { n as siteConfig } from "./seo_DXIXsesw.mjs";
// src/pages/rss.astro
var rss_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rss,
	file: () => $$file,
	url: () => $$url
});
var $$Rss = createComponent(($$result, $$props, $$slots) => {
	const jsonLd = asGraph(websiteSchema("de"), breadcrumbSchema([{
		name: "Ratgeber",
		url: `${siteConfig.url}/`
	}, {
		name: "RSS",
		url: `${siteConfig.url}/rss`
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "RSS abonnieren — Ratgeber",
		"description": "Den Ratgeber per RSS abonnieren: die Feed-Adresse, empfohlene RSS-Programme und was dich in den Beiträgen erwartet.",
		"jsonLd": jsonLd,
		"lang": "de"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main">${renderComponent($$result, "RssInfo", $$RssInfo, { "lang": "de" })}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/rss.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/rss.astro";
var $$url = "/rss";
// \0virtual:astro:page:src/pages/rss@_@astro
var page = () => rss_exports;
export { page };

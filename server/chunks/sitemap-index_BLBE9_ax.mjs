import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { r as sitemapUrls, t as renderSectionIndex } from "./sitemap_B0_w4J6r.mjs";
// src/pages/sitemap-index.xml.ts
var sitemap_index_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => new Response(renderSectionIndex(await sitemapUrls()), { headers: { "content-type": "application/xml; charset=utf-8" } });
// \0virtual:astro:page:src/pages/sitemap-index.xml@_@ts
var page = () => sitemap_index_xml_exports;
export { page };

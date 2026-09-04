import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as sitemapUrls, n as renderSitemapIndex, t as newestLastmod } from "./sitemap_C-AW5liN.mjs";
//#region src/pages/sitemap-index.xml.ts
var sitemap_index_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	const urls = await sitemapUrls();
	const lastmod = newestLastmod(urls) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return new Response(renderSitemapIndex(lastmod), { headers: { "content-type": "application/xml; charset=utf-8" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap-index.xml@_@ts
var page = () => sitemap_index_xml_exports;
//#endregion
export { page };

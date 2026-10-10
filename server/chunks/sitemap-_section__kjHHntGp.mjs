import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as isSitemapSection } from "./cache_CksGWVUE.mjs";
import { n as renderUrlset, r as sitemapUrls } from "./sitemap_eV6XAUnC.mjs";
//#region src/pages/sitemap-[section].xml.ts
var sitemap__section__xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params }) => {
	if (!isSitemapSection(params.section)) return new Response(null, { status: 404 });
	const urls = (await sitemapUrls()).filter((url) => url.section === params.section);
	if (urls.length === 0) return new Response(null, { status: 404 });
	return new Response(renderUrlset(urls, (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)), { headers: { "content-type": "application/xml; charset=utf-8" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap-[section].xml@_@ts
var page = () => sitemap__section__xml_exports;
//#endregion
export { page };

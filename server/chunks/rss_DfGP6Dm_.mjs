import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as listAllPosts } from "./cache_CMM7wTu7.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import rss from "@astrojs/rss";
//#region src/pages/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
/**
* The German feed.
*
* Two things beyond the minimum, both of which readers depend on:
*
* - `lastBuildDate` from the newest post, not from "now". A feed that reports
*   the current time on every fetch gives an aggregator no way to tell a
*   re-poll from a real update, so it either re-reads everything or ignores
*   the field.
* - `<author>` per item. RSS wants an address there, and the journal does not
*   publish per-author addresses, so the shared contact address carries the
*   author's name after it — the form every reader displays.
*
* Item order follows the corpus (newest first); it is not re-sorted here.
*/
async function GET(context) {
	const posts = await listAllPosts("de").catch(() => []);
	const newest = posts.map((p) => p.publishedAt).filter((d) => typeof d === "string" && d !== "").sort().at(-1);
	return rss({
		title: "TDS Journal",
		description: siteConfig.description.de,
		site: context.site ?? "https://blog.tracht-digital.de",
		items: posts.map((p) => ({
			title: p.title,
			pubDate: p.publishedAt ? new Date(p.publishedAt) : /* @__PURE__ */ new Date(),
			description: p.excerpt,
			link: `/${p.slug}`,
			categories: [p.category],
			author: p.author?.name ? `${siteConfig.email} (${p.author.name})` : `${siteConfig.email} (${siteConfig.name})`
		})),
		customData: [`<language>de-de</language>`, newest ? `<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""].join("")
	});
}
//#endregion
//#region \0virtual:astro:page:src/pages/rss.xml@_@ts
var page = () => rss_xml_exports;
//#endregion
export { page };

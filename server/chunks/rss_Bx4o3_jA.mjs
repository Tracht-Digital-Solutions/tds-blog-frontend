import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as listAllPosts } from "./cache_BDdx2I78.mjs";
import { n as siteConfig } from "./seo_DXIXsesw.mjs";
import rss from "@astrojs/rss";
// src/pages/en/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
async function GET(context) {
	const posts = await listAllPosts("en").catch(() => []);
	const newest = posts.map((p) => p.publishedAt).filter((d) => typeof d === "string" && d !== "").sort().at(-1);
	return rss({
		title: "Ratgeber von Tracht Digital Solutions (English)",
		description: siteConfig.description.en,
		site: context.site ?? "https://blog.tracht-digital.de",
		items: posts.map((p) => ({
			title: p.title,
			pubDate: p.publishedAt ? new Date(p.publishedAt) : /* @__PURE__ */ new Date(),
			description: p.excerpt,
			link: `/en/${p.slug}`,
			categories: [p.category],
			author: p.author?.name ? `${siteConfig.email} (${p.author.name})` : `${siteConfig.email} (${siteConfig.name})`
		})),
		customData: [`<language>en-gb</language>`, newest ? `<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""].join("")
	});
}
// \0virtual:astro:page:src/pages/en/rss.xml@_@ts
var page = () => rss_xml_exports;
export { page };

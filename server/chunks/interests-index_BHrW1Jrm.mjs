import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as listAllPosts } from "./cache_CMM7wTu7.mjs";
//#region src/pages/interests-index.json.ts
/**
* Build-time recommendation index. Bakes the lightweight metadata of
* every published post (both languages) into a single static JSON
* file. The "Für Sie" island fetches THIS file at runtime — never the
* content-api — so personalised recommendations stay SSG-conform.
*
* A failed content-api fetch emits an empty array so the build never
* breaks on an API hiccup (same contract as the index pages).
*/
var interests_index_json_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
async function GET() {
	let posts = [];
	try {
		posts = await listAllPosts();
	} catch (err) {
		console.error("[tds-blog] interests-index fetch failed:", err);
	}
	const index = posts.map((p) => ({
		slug: p.slug,
		lang: p.lang,
		category: p.category,
		title: p.title,
		excerpt: p.excerpt,
		tags: p.tags ?? null,
		publishedAt: p.publishedAt
	}));
	return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
}
//#endregion
//#region \0virtual:astro:page:src/pages/interests-index.json@_@ts
var page = () => interests_index_json_exports;
//#endregion
export { page };

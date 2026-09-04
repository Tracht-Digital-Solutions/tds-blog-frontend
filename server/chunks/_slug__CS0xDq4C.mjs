import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { _ as listAllPosts } from "./cache_C7psdfsG.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_CevZi1K4.mjs";
import { t as $$Article } from "./Article_BC49N-Zg.mjs";
//#region src/pages/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	const allPosts = await listAllPosts();
	const localized = await resolveLocalizedPost(slug, "de");
	if (!localized) return new Response("Not found", { status: 404 });
	const bySlug = /* @__PURE__ */ new Map();
	for (const p of allPosts) if (!bySlug.has(p.slug) || p.lang === "de") bySlug.set(p.slug, p);
	const posts = [...bySlug.values()];
	return renderTemplate`${renderComponent($$result, "Article", $$Article, {
		"localized": localized,
		"lang": "de",
		"posts": posts
	})}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/[slug].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/[slug].astro";
var $$url = "/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };

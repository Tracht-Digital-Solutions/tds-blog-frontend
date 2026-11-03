import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_C9xNxrDs.mjs";
import { t as createAstro } from "./compiler_EL8fTkBE.mjs";
import { f as createComponent } from "./Layout_BMcC3_Tl.mjs";
import { t as $$Article } from "./Article_CIp4QKmj.mjs";
import { b as listAllPosts } from "./cache_BquBJcQv.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_MFrFLejq.mjs";
// src/pages/[slug].astro
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
	const localized = await resolveLocalizedPost(slug, "de");
	if (!localized) return new Response(null, { status: 404 });
	const allPosts = await listAllPosts();
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
// \0virtual:astro:page:src/pages/[slug]@_@astro
var page = () => _slug__exports;
export { page };

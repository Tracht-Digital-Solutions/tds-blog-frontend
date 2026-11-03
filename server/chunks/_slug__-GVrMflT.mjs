import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_C9xNxrDs.mjs";
import { t as createAstro } from "./compiler_EL8fTkBE.mjs";
import { f as createComponent } from "./Layout_CLT5xWk1.mjs";
import { t as $$Article } from "./Article_Cek0Px9H.mjs";
import { b as listAllPosts } from "./cache_CD4lKB0w.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_CM05Ctc7.mjs";
// src/pages/en/[slug].astro
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
	const localized = await resolveLocalizedPost(slug, "en");
	if (!localized) return new Response(null, { status: 404 });
	const allPosts = await listAllPosts();
	const bySlug = /* @__PURE__ */ new Map();
	for (const p of allPosts) if (!bySlug.has(p.slug) || p.lang === "en") bySlug.set(p.slug, p);
	const posts = [...bySlug.values()];
	return renderTemplate`${renderComponent($$result, "Article", $$Article, {
		"localized": localized,
		"lang": "en",
		"posts": posts
	})}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug].astro";
var $$url = "/en/[slug]";
// \0virtual:astro:page:src/pages/en/[slug]@_@astro
var page = () => _slug__exports;
export { page };

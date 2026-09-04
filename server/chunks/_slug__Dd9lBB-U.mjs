import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_BwFgsHbM.mjs";
import { a as byAuthor } from "./cache_C7psdfsG.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { a as breadcrumbSchema, i as blogSchema, l as profilePageSchema, n as authorPersonId, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { i as clampToWord, n as authorDescription } from "./metaDescription_BzckGtuv.mjs";
import { t as AuthorPostList } from "./AuthorPostList_BhTZLyhQ.mjs";
import { n as authorAlternate } from "./alternates_BBW_OARj.mjs";
//#region src/pages/autor/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const group = await byAuthor("de", String(Astro.params.slug ?? ""));
	if (!group) return new Response("Not found", { status: 404 });
	const { author, posts } = group;
	const pageUrl = `${siteConfig.url}/autor/${author.slug}`;
	const description = author.bio ? clampToWord(author.bio.trim()) : authorDescription(author.name, "de");
	const personSchema = {
		"@type": "Person",
		"@id": authorPersonId(pageUrl),
		name: author.name,
		url: pageUrl,
		...author.bio ? { description: author.bio } : {},
		...author.avatarUrl ? { image: author.avatarUrl } : {}
	};
	const newestPublished = posts.map((p) => p.publishedAt).filter(Boolean).sort().at(-1) ?? null;
	const altPath = await authorAlternate("de", author.slug);
	const jsonLd = asGraph(websiteSchema("de"), blogSchema("de"), profilePageSchema({
		url: pageUrl,
		lang: "de",
		person: personSchema,
		dateModified: newestPublished
	}), itemListSchema(posts.map((p) => `${siteConfig.url}/${p.slug}`)), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/`
	}, {
		name: author.name,
		url: pageUrl
	}]));
	const cards = posts.map((p) => ({
		slug: p.slug,
		category: p.category,
		title: p.title,
		excerpt: p.excerpt,
		publishedAt: p.publishedAt,
		coverHint: p.coverHint,
		viewCount: p.viewCount ?? 0,
		author
	}));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle(author.name),
		"description": description,
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main" class="tds-shell py-16 lg:py-24"><header class="mb-10"><a href="/" class="btn-back mb-6"><span aria-hidden="true">←</span> Alle Beiträge</a><p class="section-num mb-4 mt-6">Journal · Autor</p><div class="flex items-center gap-5">${author.avatarUrl ? renderTemplate`<img${addAttribute(author.avatarUrl, "src")} alt="" width="80" height="80" class="w-20 h-20 rounded-full object-cover shrink-0" loading="eager">` : renderTemplate`<span aria-hidden="true" class="w-20 h-20 inline-flex items-center justify-center text-2xl font-semibold text-white shrink-0" style="background: var(--color-surface-navy); font-family: var(--font-display); border-radius: 9999px;">${author.name.split(/\s+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase()}</span>`}<div><h1 class="display page-title">${author.name}</h1><p class="marginalia mt-2">${posts.length === 1 ? "Ein Artikel" : `${posts.length} Artikel`}</p></div></div>${author.bio && renderTemplate`<p class="lead mt-5 text-[var(--color-muted)] max-w-2xl" style="text-wrap: pretty;">${author.bio}</p>`}</header><h2 class="sr-only">Artikel von ${author.name}</h2>${renderComponent($$result, "AuthorPostList", AuthorPostList, {
		"posts": cards,
		"lang": "de",
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/AuthorPostList.tsx",
		"client:component-export": "default"
	})}</main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/autor/[slug].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/autor/[slug].astro";
var $$url = "/autor/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/autor/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };

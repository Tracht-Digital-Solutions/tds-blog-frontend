import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_BU0hsnhb.mjs";
import { t as createComponent } from "./compiler_CDBSO3Ry.mjs";
import { t as $$Layout } from "./Layout_Cs4gRr25.mjs";
import { d as paginate, i as archivePage } from "./cache_C5L6PGMb.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { i as blogSchema, o as collectionPageSchema, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
import { t as archiveDescription } from "./metaDescription_BzckGtuv.mjs";
import { t as archiveAlternate } from "./alternates_D4gIk_oP.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_B8f7I59L.mjs";
import { t as translations } from "./i18n_a_b3fn7c.mjs";
//#region src/pages/page/[num].astro
var _num__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Num,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Num = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Num;
	const archive = await archivePage("de", String(Astro.params.num ?? ""));
	if (!archive) return new Response("Not found", { status: 404 });
	const { allPosts, page } = archive;
	const t = translations.de;
	const { items, hasOlder, hasNewer, pageCount } = paginate(allPosts, page);
	const olderHref = page + 1 <= pageCount ? `/page/${page + 1}` : null;
	const newerHref = page - 1 <= 1 ? "/" : `/page/${page - 1}`;
	const altPath = await archiveAlternate("de", page);
	const pageUrl = `${siteConfig.url}/page/${page}`;
	const title = pageTitle(`Archiv · Seite ${page}`);
	const description = archiveDescription(page, "de");
	const jsonLd = asGraph(websiteSchema("de"), blogSchema("de"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "de",
		itemList: itemListSchema(items.map((p) => `${siteConfig.url}/${p.slug}`), (page - 1) * 10 + 1)
	}));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><p class="section-num mb-4">${t.blog.label} · Seite ${page} / ${pageCount}</p><h1 class="display page-title">${t.blog.headline}${" "}<span class="accent-italic">${t.blog.headlineAccent}</span></h1><p class="marginalia mt-3 max-w-prose">Ältere Notizen aus dem Archiv. Inhaltlich nicht weniger gültig, nur zeitlich weiter zurück.</p></div></header><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack">${items.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"lang": "de"
	})}`)}</ul><nav class="pt-10 flex items-center justify-between text-sm">${hasNewer ? renderTemplate`<a${addAttribute(newerHref, "href")} class="link-underline text-[var(--color-accent)]">← Neuere Artikel</a>` : renderTemplate`<span></span>`}${olderHref && hasOlder ? renderTemplate`<a${addAttribute(olderHref, "href")} class="link-underline text-[var(--color-accent)]">Ältere Artikel →</a>` : renderTemplate`<span></span>`}</nav></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/page/[num].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/page/[num].astro";
var $$url = "/page/[num]";
//#endregion
//#region \0virtual:astro:page:src/pages/page/[num]@_@astro
var page = () => _num__exports;
//#endregion
export { page };

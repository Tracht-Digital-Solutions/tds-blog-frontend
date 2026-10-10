import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_E54re6b9.mjs";
import { t as createComponent } from "./compiler_BvE05Vkz.mjs";
import { s as translations, t as $$Layout } from "./Layout_CSAT5jey.mjs";
import { m as paginate, s as archivePage } from "./cache_DNRBnnjj.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { c as itemListSchema, d as websiteSchema, i as blogSchema, o as collectionPageSchema, t as asGraph } from "./jsonld_BRIJr-dK.mjs";
import { t as archiveDescription } from "./metaDescription_Bxyn0lUM.mjs";
import { t as archiveAlternate } from "./alternates_CE99NHno.mjs";
import { t as $$BlogPostCard } from "./BlogPostCard_Bh912iGs.mjs";
//#region src/pages/en/page/[num].astro
var _num__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Num,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Num = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Num;
	const archive = await archivePage("en", String(Astro.params.num ?? ""));
	if (!archive) return new Response(null, { status: 404 });
	const { allPosts, page } = archive;
	const t = translations.en;
	const { items, hasOlder, hasNewer, pageCount } = paginate(allPosts, page);
	const olderHref = page + 1 <= pageCount ? `/en/page/${page + 1}` : null;
	const newerHref = page - 1 <= 1 ? "/en/" : `/en/page/${page - 1}`;
	const altPath = await archiveAlternate("en", page);
	const pageUrl = `${siteConfig.url}/en/page/${page}`;
	const title = pageTitle(`Archive · page ${page}`);
	const description = archiveDescription(page, "en");
	const jsonLd = asGraph(websiteSchema("en"), blogSchema("en"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "en",
		itemList: itemListSchema(items.map((p) => `${siteConfig.url}/en/${p.slug}`), (page - 1) * 10 + 1)
	}));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"lang": "en",
		"jsonLd": jsonLd,
		"altUrl": altPath ? new URL(altPath, siteConfig.url).toString() : null
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><header class="jnl-band jnl-tone-navy"><div class="tds-shell"><p class="section-num mb-4">${t.blog.label} · Page ${page} / ${pageCount}</p><h1 class="display page-title">${t.blog.headline}${" "}<span class="accent-italic">${t.blog.headlineAccent}</span></h1><p class="marginalia mt-3 max-w-prose">Older notes from the archive. Equally valid, just further back in time.</p></div></header><section class="jnl-band jnl-tone-tint"><div class="tds-shell"><ul class="jnl-stack jnl-shelf">${items.map((p) => renderTemplate`${renderComponent($$result, "BlogPostCard", $$BlogPostCard, {
		"slug": p.slug,
		"category": p.category,
		"title": p.title,
		"excerpt": p.excerpt,
		"publishedAt": p.publishedAt,
		"readingMinutes": p.readingMinutes,
		"lang": "en"
	})}`)}</ul><nav class="pt-10 flex items-center justify-between text-sm">${hasNewer ? renderTemplate`<a${addAttribute(newerHref, "href")} class="link-underline text-[var(--color-accent)]">← Newer articles</a>` : renderTemplate`<span></span>`}${olderHref && hasOlder ? renderTemplate`<a${addAttribute(olderHref, "href")} class="link-underline text-[var(--color-accent)]">Older articles →</a>` : renderTemplate`<span></span>`}</nav></div></section></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/page/[num].astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/page/[num].astro";
var $$url = "/en/page/[num]";
//#endregion
//#region \0virtual:astro:page:src/pages/en/page/[num]@_@astro
var page = () => _num__exports;
//#endregion
export { page };

import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_BwFgsHbM.mjs";
import { _ as listAllPosts, y as listTopics } from "./cache_C7psdfsG.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { n as PostCard } from "./PostCard_BfKijCrk.mjs";
import { a as breadcrumbSchema, i as blogSchema, o as collectionPageSchema, s as itemListSchema, t as asGraph, u as websiteSchema } from "./jsonld_DGTHkHu3.mjs";
//#region src/pages/en/aktuelles.astro
var aktuelles_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Aktuelles,
	file: () => $$file,
	url: () => $$url
});
var $$Aktuelles = createComponent(async ($$result, $$props, $$slots) => {
	const lang = "en";
	let posts = [];
	let topics = null;
	try {
		[posts, topics] = await Promise.all([listAllPosts(lang), listTopics(lang)]);
	} catch (err) {
		console.error("[tds-blog] /en/aktuelles build fetch failed:", err);
	}
	const latest = [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 6);
	const pageUrl = `${siteConfig.url}/en/aktuelles`;
	const title = pageTitle("Latest");
	const description = "The latest posts from the TDS Journal: current topics on digitalization for businesses, web development and everyday automation.";
	const jsonLd = asGraph(websiteSchema("en"), blogSchema("en"), collectionPageSchema({
		url: pageUrl,
		name: title,
		description,
		lang: "en",
		itemList: itemListSchema(latest.map((p) => `${siteConfig.url}/en/${p.slug}`))
	}), breadcrumbSchema([{
		name: "Journal",
		url: `${siteConfig.url}/en/`
	}, {
		name: "Latest",
		url: pageUrl
	}]));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"jsonLd": jsonLd,
		"lang": "en"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main id="main"><section style="background: var(--color-surface-navy); color: #fff;"><div class="tds-shell py-14 md:py-20"><p class="eyebrow" style="color: var(--color-accent-pink);">Journal · Latest</p><h1 class="display page-title mt-3">Current <span class="accent-italic">topics</span></h1><p class="mt-4 max-w-prose" style="color: rgba(255,255,255,.75); line-height: 1.6;">What I'm thinking about — and the newest posts.</p></div></section><div class="tds-shell py-16 lg:py-20">${topics && topics.items.length > 0 && renderTemplate`<section class="mb-16" aria-labelledby="topics-heading"><h2 id="topics-heading" class="display text-2xl md:text-3xl mb-2">${topics.headline}</h2>${topics.intro && renderTemplate`<p class="marginalia mb-6 max-w-prose">${topics.intro}</p>`}<ul class="list-none p-0 m-0 tds-grid-auto tds-grid-roomy">${topics.items.map((t) => renderTemplate`<li class="list-none">${t.href ? renderTemplate`<a${addAttribute(t.href, "href")} class="topic-card"><h3 class="topic-title">${t.title}</h3>${t.description && renderTemplate`<p class="topic-desc">${t.description}</p>`}</a>` : renderTemplate`<div class="topic-card topic-card--static"><h3 class="topic-title">${t.title}</h3>${t.description && renderTemplate`<p class="topic-desc">${t.description}</p>`}</div>`}</li>`)}</ul></section>`}<section aria-labelledby="latest-heading"><h2 id="latest-heading" class="display text-2xl md:text-3xl mb-6">Latest posts</h2>${latest.length === 0 ? renderTemplate`<p class="marginalia">No posts yet.</p>` : renderTemplate`<ul class="tds-grid-auto list-none p-0 m-0">${latest.map((p, i) => renderTemplate`<li${addAttribute(`post-card-slot${i === 0 ? " grid-span-all" : ""}`, "class")}>${renderComponent($$result, "PostCard", PostCard, {
		"post": p,
		"lang": "en",
		"large": i === 0
	})}</li>`)}</ul>`}</section></div></main>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/aktuelles.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/aktuelles.astro";
var $$url = "/en/aktuelles";
//#endregion
//#region \0virtual:astro:page:src/pages/en/aktuelles@_@astro
var page = () => aktuelles_exports;
//#endregion
export { page };

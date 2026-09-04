import { A as renderTemplate, N as addAttribute, P as defineScriptVars, T as Fragment, V as createAstro, j as maybeRenderHead, w as renderComponent, z as unescapeHTML } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { i as categoryHref, o as renderScript, r as authorHref, t as $$Layout } from "./Layout_ZXMBwXGa.mjs";
import { f as adsConfig, h as effectiveAdsMode, l as categorySlug, p as blogSnippets } from "./cache_CMM7wTu7.mjs";
import { i as contentApiBase } from "./connection_C3w8iWPQ.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_C65aaSyf.mjs";
import { i as slugify$1, n as renderBlockHtml } from "./localizedPost_CWfKcvt3.mjs";
import { n as PostCard } from "./PostCard_DYP5FLXg.mjs";
import { t as $$TagList } from "./TagList_C-Bv1T9H.mjs";
import { a as breadcrumbSchema, c as organizationSchema, r as blogPostingSchema } from "./jsonld_DGTHkHu3.mjs";
import { a as postDescription } from "./metaDescription_BzckGtuv.mjs";
//#region src/components/RelatedArticles.astro
createAstro("https://blog.tracht-digital.de");
var $$RelatedArticles = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RelatedArticles;
	const { posts, currentSlug, currentCategory, lang, limit = 3 } = Astro.props;
	const byDate = (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
	let picks = posts.filter((p) => p.slug !== currentSlug && p.category === currentCategory).sort(byDate).slice(0, limit);
	if (picks.length < limit) {
		const fallback = posts.filter((p) => p.slug !== currentSlug && !picks.some((q) => q.slug === p.slug)).sort(byDate).slice(0, limit - picks.length);
		picks = [...picks, ...fallback];
	}
	const labels = {
		de: { eyebrow: "Weiterlesen" },
		en: { eyebrow: "Keep reading" }
	}[lang];
	return renderTemplate`${picks.length > 0 && renderTemplate`${maybeRenderHead($$result)}<aside class="mt-16 pt-2" aria-labelledby="related-heading"><p class="section-num mb-3">${labels.eyebrow}</p><h2 id="related-heading" class="display-tight text-3xl mb-6">${lang === "de" ? "Ähnliche Artikel." : "Adjacent articles."}</h2><ul class="tds-grid-auto list-none p-0 m-0">${picks.map((p) => renderTemplate`<li class="post-card-slot">${renderComponent($$result, "PostCard", PostCard, {
		"post": p,
		"lang": lang
	})}</li>`)}</ul></aside>`}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/RelatedArticles.astro", void 0);
//#endregion
//#region src/components/AdSlot.astro
createAstro("https://blog.tracht-digital.de");
var $$AdSlot = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdSlot;
	const { client, slot, lang = "de" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="tds-adslot"${addAttribute(lang === "de" ? "Werbung" : "Advertisement", "aria-label")} data-astro-cid-ygkiugat><span class="tds-adslot__label" data-astro-cid-ygkiugat>${lang === "de" ? "Anzeige" : "Advertisement"}</span><ins class="adsbygoogle" style="display:block"${addAttribute(client, "data-ad-client")}${addAttribute(slot, "data-ad-slot")} data-ad-format="auto" data-full-width-responsive="true" data-astro-cid-ygkiugat></ins><script>
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  <\/script></aside>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/AdSlot.astro", void 0);
//#endregion
//#region src/components/BlockRenderer.astro
createAstro("https://blog.tracht-digital.de");
var $$BlockRenderer = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlockRenderer;
	const { blocks, ads = null, showAds = false, lang = "de", snippets = [], dropCap = false } = Astro.props;
	const parts = [];
	let buf = "";
	const flush = () => {
		if (buf.trim() !== "") parts.push({
			kind: "prose",
			html: buf
		});
		buf = "";
	};
	for (const block of blocks) {
		if (block.type === "adsense") {
			flush();
			parts.push({
				kind: "ad",
				slot: block.slot ?? null
			});
			continue;
		}
		if (block.type === "custom") {
			const s = snippets.find((x) => x.id === block.snippetId);
			if (!s) continue;
			if (s.kind === "embed" && typeof s.definition.html === "string") {
				flush();
				parts.push({
					kind: "raw",
					html: s.definition.html
				});
			} else if (s.kind === "preset" && typeof s.definition.type === "string") buf += await renderBlockHtml(s.definition);
			continue;
		}
		buf += await renderBlockHtml(block);
	}
	flush();
	const firstProse = parts.findIndex((p) => p.kind === "prose");
	return renderTemplate`${parts.map((part, i) => part.kind === "prose" ? renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["tds-prose", dropCap && i === firstProse && "drop-cap"], "class:list")}>${unescapeHTML(part.html)}</div>` : part.kind === "raw" ? renderTemplate`<div class="tds-block-embed">${unescapeHTML(part.html)}</div>` : showAds && ads?.publisherId ? renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": part.slot ?? ads.slotInArticle ?? "",
		"lang": lang
	})}` : null)}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/BlockRenderer.astro", void 0);
//#endregion
//#region src/lib/sections.ts
function slugify(text) {
	return text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "abschnitt";
}
function stripTags(html) {
	return html.replace(/<[^>]+>/g, "").trim();
}
function splitSections(html) {
	const matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
	if (matches.length === 0) return {
		intro: html,
		sections: []
	};
	const intro = html.slice(0, matches[0].index);
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	matches.forEach((m, i) => {
		const heading = stripTags(m[1]);
		let id = slugify(heading);
		while (seen.has(id)) id = `${id}-${i}`;
		seen.add(id);
		const bodyStart = (m.index ?? 0) + m[0].length;
		const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : html.length;
		sections.push({
			id,
			heading,
			html: html.slice(bodyStart, bodyEnd)
		});
	});
	return {
		intro,
		sections
	};
}
//#endregion
//#region src/lib/blockSections.ts
function splitBlockSections(blocks) {
	const intro = [];
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	let current = null;
	for (const block of blocks) {
		if (block.type === "heading" && block.level === 2) {
			let id = slugify$1(block.text);
			while (seen.has(id)) id = `${id}-${sections.length}`;
			seen.add(id);
			current = {
				id,
				heading: block.text,
				blocks: []
			};
			sections.push(current);
			continue;
		}
		if (current) current.blocks.push(block);
		else intro.push(block);
	}
	return {
		intro,
		sections
	};
}
//#endregion
//#region src/components/Article.astro
createAstro("https://blog.tracht-digital.de");
var $$Article = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Article;
	const { localized, lang, posts } = Astro2.props;
	const { post, bodyHtml, blocks, translated } = localized;
	const isBlocks = blocks != null;
	const snippets = isBlocks ? await blogSnippets() : [];
	const ads = await adsConfig();
	const adsMode = effectiveAdsMode(post.adsMode, ads);
	const showManualAds = adsMode === "manual" && !isBlocks;
	const showBlockAds = adsMode !== "off";
	const pfx = lang === "en" ? "/en" : "";
	const postHref = (slug) => `${pfx}/${slug}`;
	const mdSplit = isBlocks ? {
		intro: "",
		sections: []
	} : splitSections(bodyHtml);
	const blkSplit = isBlocks ? splitBlockSections(blocks) : {
		intro: [],
		sections: []
	};
	const sections = isBlocks ? blkSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	})) : mdSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	}));
	const intro = mdSplit.intro;
	const showToc = sections.length >= 2;
	const ordered = [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
	const orderedIdx = ordered.findIndex((p) => p.slug === post.slug);
	const newerPost = orderedIdx > 0 ? ordered[orderedIdx - 1] : null;
	const olderPost = orderedIdx >= 0 && orderedIdx < ordered.length - 1 ? ordered[orderedIdx + 1] : null;
	const interestTopics = Array.from(new Set([post.category, ...(post.tags ?? "").split(",")].map((t) => t.trim().toLowerCase()).filter(Boolean)));
	const explicitCover = post.coverHint?.startsWith("http") ? post.coverHint : void 0;
	const dateLabel = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const plain = isBlocks ? blocks.map((b) => {
		if (b.type === "paragraph" || b.type === "heading" || b.type === "quote" || b.type === "callout") return b.text;
		if (b.type === "list") return b.items.join(" ");
		if (b.type === "code") return b.code;
		return "";
	}).join(" ") : bodyHtml.replace(/<[^>]+>/g, " ");
	const wordCount = plain.split(/\s+/).filter(Boolean).length;
	const readingMinutes = Math.max(1, Math.round(wordCount / 220));
	const ogImagePath = explicitCover ?? `/og/${lang}/${post.slug}.png`;
	const imageUrl = ogImagePath.startsWith("http") ? ogImagePath : new URL(ogImagePath, siteConfig.url).toString();
	const journalLabel = "Journal";
	const journalHomeUrl = `${siteConfig.url}${pfx}/`;
	const postUrl = new URL(postHref(post.slug), siteConfig.url).toString();
	const contactUrl = `https://tracht-digital.de${pfx}/#contact`;
	const metaDesc = postDescription(post.metaDescription, post.excerpt);
	const tx = lang === "de" ? {
		back: "Alle Beiträge",
		read: "Min. Lesezeit",
		contents: "Inhalt",
		tocCollapse: "Inhalt einklappen",
		tocExpand: "Inhalt ausklappen",
		aboutAuthor: "Über den Autor",
		owner: "Inhaber, Tracht Digital Solutions",
		bio: "Entwickelt Software, Websites und Digitalisierungslösungen für kleine und mittlere Unternehmen — ansässig in Schwarzenbek bei Hamburg.",
		newer: "Neuerer Artikel",
		older: "Älterer Artikel",
		nav: "Artikel-Navigation",
		allArticles: "Alle Artikel",
		rss: "RSS abonnieren",
		print: "Drucken",
		machine: "Automatisch übersetzt — das Original ist auf Englisch verfasst.",
		contactHead: "Zusammenarbeiten",
		contactLead: "Ich baue Websites, Webshops und individuelle Lösungen für Selbstständige, kleine Unternehmen und lokale Betriebe — aus Schwarzenbek bei Hamburg.",
		contactCta: "Unverbindlich anfragen"
	} : {
		back: "All posts",
		read: "min read",
		contents: "Contents",
		tocCollapse: "Collapse contents",
		tocExpand: "Expand contents",
		aboutAuthor: "About the author",
		owner: "Owner, Tracht Digital Solutions",
		bio: "Builds software, websites and digitalization solutions for small and medium-sized businesses — based in Schwarzenbek near Hamburg.",
		newer: "Newer article",
		older: "Older article",
		nav: "Article navigation",
		allArticles: "All articles",
		rss: "Subscribe via RSS",
		print: "Print",
		machine: "Machine-translated — the original is written in German.",
		contactHead: "Work together",
		contactLead: "I build websites, online shops and custom solutions for freelancers, small companies and local businesses — from Schwarzenbek near Hamburg.",
		contactCta: "Get in touch"
	};
	const author = post.author ?? null;
	const authorName = author?.name ?? (lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial");
	const authorPageHref = author ? authorHref(lang, author.slug) : null;
	const authorAvatar = author?.avatarUrl ?? null;
	const authorBio = author?.bio ?? tx.bio;
	const authorInitials = authorName.split(/\s+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "TD";
	const jsonLd = [
		blogPostingSchema({
			slug: post.slug,
			title: post.title,
			excerpt: metaDesc,
			body: plain,
			category: post.category,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt ?? null,
			lang,
			imageUrl,
			wordCount,
			author: author ? {
				name: author.name,
				url: authorPageHref ? new URL(authorPageHref, siteConfig.url).toString() : null
			} : null,
			tags: post.tags
		}),
		organizationSchema(),
		breadcrumbSchema([
			{
				name: journalLabel,
				url: journalHomeUrl
			},
			{
				name: post.category,
				url: new URL(categoryHref(lang, categorySlug(post.category)), siteConfig.url).toString()
			},
			{
				name: post.title,
				url: postUrl
			}
		])
	];
	const beaconBase = contentApiBase();
	const beaconDisabled = true;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle(post.title),
		"description": metaDesc,
		"lang": lang,
		"ogImage": explicitCover,
		"article": {
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			author: authorName,
			section: post.category,
			slug: post.slug
		},
		"jsonLd": jsonLd,
		"sidebar": true,
		"focusable": true,
		"adsMode": adsMode
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div id="reading-progress" class="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left scale-x-0 bg-[var(--color-accent)]" aria-hidden="true"></div><main id="main"${addAttribute(["article-shell px-5 sm:px-6 md:px-8 py-10 lg:py-12", showToc && "has-toc"], "class:list")}>${showToc && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<nav class="toc"${addAttribute(tx.contents, "aria-label")} id="article-toc"><div class="toc-head"><p class="eyebrow toc-title">${tx.contents}</p><button type="button" class="toc-toggle" id="toc-toggle" aria-expanded="true" aria-controls="article-toc"${addAttribute(tx.tocCollapse, "title")}${addAttribute(tx.tocCollapse, "aria-label")}${addAttribute(tx.tocCollapse, "data-label-collapse")}${addAttribute(tx.tocExpand, "data-label-expand")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg></button></div><ol class="toc-list">${sections.map((sec) => renderTemplate`<li><a${addAttribute(`#${sec.id}`, "href")}${addAttribute(sec.id, "data-toc")} class="toc-link"><span class="toc-tick" aria-hidden="true"></span><span class="toc-label">${sec.heading}</span></a></li>`)}</ol></nav><script>
          (function () {
            try {
              if (localStorage.getItem("tds-blog-toc") === "collapsed") {
                var m = document.getElementById("main");
                if (m) m.classList.add("toc-collapsed");
                var t = document.getElementById("toc-toggle");
                if (t) t.setAttribute("aria-expanded", "false");
              }
            } catch (e) {
              /* storage disabled — start expanded */
            }
          })();
        <\/script>` })}`}<article class="article-col"><header class="mb-7"><div class="flex flex-wrap items-center gap-3.5 mb-3.5"><p class="eyebrow" style="color: var(--color-accent);">${post.category}</p><span aria-hidden="true" class="w-1 h-1 bg-[var(--color-line)]"></span><p class="text-[0.8125rem] text-[var(--color-muted)] tabular">${dateLabel && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${dateLabel} · ` })}`}~${readingMinutes} ${tx.read}</p><button type="button" id="focus-toggle" class="ml-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" aria-pressed="false"${addAttribute(lang === "de" ? "Fokusmodus (Taste F)" : "Focus mode (press F)", "title")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg><span data-focus-label>${lang === "de" ? "Fokus" : "Focus"}</span></button><a${addAttribute(`${pfx}/${post.slug}/print`, "href")} target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] no-underline transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg><span>${tx.print}</span></a></div><div class="title-row"><a${addAttribute(`${pfx}/`, "href")} class="back-rail"${addAttribute(tx.back, "aria-label")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></a><h1 class="display page-title" style="text-wrap: balance;">${post.title}</h1></div><p class="lead mt-3.5 text-[var(--color-muted)]" style="text-wrap: pretty;">${post.excerpt}</p><p class="mt-4 inline-flex items-center gap-2.5">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-7 h-7 rounded-full object-cover" width="28" height="28" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-7 h-7 inline-flex items-center justify-center text-[11px] font-semibold tracking-wide" style="background: var(--tds-flat-tint); color: var(--color-primary);">${authorInitials}</span>`}${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="text-[0.8125rem] font-medium link-underline">${authorName}</a>` : renderTemplate`<span class="text-[0.8125rem] font-medium">${authorName}</span>`}</p>${translated && renderTemplate`<p class="mt-4 text-[0.8125rem] text-[var(--color-muted)] border-l-2 pl-3" style="border-color: var(--color-accent);"><span aria-hidden="true">🌐 </span>${tx.machine}</p>`}</header><div class="mt-4">${isBlocks ? blkSplit.intro.length > 0 && renderTemplate`${renderComponent($$result2, "BlockRenderer", $$BlockRenderer, {
		"blocks": blkSplit.intro,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets,
		"dropCap": true
	})}` : intro.trim().length > 0 && renderTemplate`<div class="tds-prose drop-cap">${unescapeHTML(intro)}</div>`}${showManualAds && ads.slotInArticle && renderTemplate`${renderComponent($$result2, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotInArticle,
		"lang": lang
	})}`}${isBlocks ? blkSplit.sections.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner">${renderComponent($$result2, "BlockRenderer", $$BlockRenderer, {
		"blocks": sec.blocks,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets
	})}</div></div></section>`) : mdSplit.sections.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner"><div class="tds-prose">${unescapeHTML(sec.html)}</div></div></div></section>`)}${showManualAds && ads.slotEndArticle && renderTemplate`${renderComponent($$result2, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotEndArticle,
		"lang": lang
	})}`}<aside class="focus-hide mt-9 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style="background: var(--color-soft);"${addAttribute(tx.contactHead, "aria-label")}><div><p class="eyebrow mb-1.5">${tx.contactHead}</p><p class="text-sm text-[var(--color-muted)]" style="max-width: 44ch; text-wrap: pretty;">${tx.contactLead}</p></div><a${addAttribute(contactUrl, "href")} class="btn-flat shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16"></rect><path d="m22 6-10 7L2 6"></path></svg><span>${tx.contactCta}</span></a></aside><aside class="focus-hide grid grid-cols-[64px_1fr] gap-5 items-start mt-6 p-5" style="background: var(--color-soft);">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-16 h-16 rounded-full object-cover" width="64" height="64" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-16 h-16 inline-flex items-center justify-center text-lg font-semibold tracking-wide text-white" style="background: var(--color-surface-navy); font-family: var(--font-display);">${authorInitials}</span>`}<div><p class="eyebrow mb-2">${tx.aboutAuthor}</p><p class="font-semibold">${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="link-underline">${authorName}</a>` : authorName}${!author && renderTemplate`<span class="font-normal text-sm text-[var(--color-muted)]">· ${tx.owner}</span>`}</p><p class="text-sm leading-relaxed text-[var(--color-muted)] mt-2" style="text-wrap: pretty;">${authorBio}</p></div></aside></div><div class="focus-hide">${renderComponent($$result2, "RelatedArticles", $$RelatedArticles, {
		"posts": posts,
		"currentSlug": post.slug,
		"currentCategory": post.category,
		"lang": lang
	})}</div><div class="focus-hide mt-10">${renderComponent($$result2, "TagList", $$TagList, {
		"tags": post.tags,
		"lang": lang,
		"label": "Tags"
	})}</div>${(newerPost || olderPost) && renderTemplate`<nav class="focus-hide mt-16 grid sm:grid-cols-2 gap-4"${addAttribute(tx.nav, "aria-label")}>${newerPost ? renderTemplate`<a${addAttribute(postHref(newerPost.slug), "href")} class="block px-5 py-4 group transition-colors bg-[var(--color-soft)] hover:bg-[var(--tds-flat-hover)]"><p class="eyebrow mb-2">← ${tx.newer}</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${newerPost.title}</p></a>` : renderTemplate`<span class="hidden sm:block" aria-hidden="true"></span>`}${olderPost && renderTemplate`<a${addAttribute(postHref(olderPost.slug), "href")} class="block px-5 py-4 group transition-colors bg-[var(--color-soft)] hover:bg-[var(--tds-flat-hover)] sm:text-right"><p class="eyebrow mb-2">${tx.older} →</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${olderPost.title}</p></a>`}</nav>`}<footer class="mt-12 pt-8 hairline-t flex flex-wrap items-baseline justify-between gap-4 text-sm"><a${addAttribute(`${pfx}/`, "href")} class="link-underline text-[var(--color-accent)]">← ${tx.allArticles}</a><a${addAttribute(`${pfx}/rss`, "href")} class="link-underline text-[var(--color-muted)]">${tx.rss}</a></footer></article></main>${renderScript($$result2, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result2, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=1&lang.ts")}${renderScript($$result2, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=2&lang.ts")}<script>(function(){${defineScriptVars({ interestTopics })}
    (function () {
      try {
        var match = document.cookie.match(/(?:^|; )tds-interests=([^;]*)/);
        var weights = {};
        if (match) {
          try {
            weights = JSON.parse(decodeURIComponent(match[1])) || {};
          } catch (e) {
            weights = {};
          }
        }
        interestTopics.forEach(function (t) {
          weights[t] = Math.min((weights[t] || 0) + 1, 50);
        });
        var trimmed = {};
        Object.keys(weights)
          .sort(function (a, b) {
            return weights[b] - weights[a];
          })
          .slice(0, 12)
          .forEach(function (k) {
            trimmed[k] = weights[k];
          });
        document.cookie =
          "tds-interests=" +
          encodeURIComponent(JSON.stringify(trimmed)) +
          "; Max-Age=" + 180 * 24 * 3600 +
          "; Path=/; SameSite=Lax";
      } catch (e) {
        /* cookies disabled — recommendations simply stay generic */
      }
    })();
  })();<\/script><script>(function(){${defineScriptVars({
		viewSlug: post.slug,
		viewLang: lang,
		viewApiBase: beaconBase,
		viewDisabled: beaconDisabled
	})}
    (function () {
      if (viewDisabled) return;
      try {
        var key = "tds-viewed:" + viewLang + ":" + viewSlug;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch (e) {
        /* no sessionStorage — fall through and count the view anyway */
      }
      try {
        var url =
          viewApiBase + "/blog/" + encodeURIComponent(viewSlug) + "/view?lang=" + viewLang;
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url);
        } else {
          fetch(url, { method: "POST", keepalive: true, mode: "no-cors" });
        }
      } catch (e) {
        /* best-effort analytics — ignore failures */
      }
    })();
  })();<\/script>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro", void 0);
//#endregion
export { $$Article as t };

import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
//#region src/components/BlogPostCard.astro
createAstro("https://blog.tracht-digital.de");
var $$BlogPostCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlogPostCard;
	const { slug, category, title, excerpt, publishedAt, lang = "de" } = Astro.props;
	const locale = lang === "de" ? "de-DE" : "en-US";
	return renderTemplate`${maybeRenderHead($$result)}<li class="list-none"><a${addAttribute(`${lang === "en" ? "/en" : ""}/${slug}`, "href")} class="post-row"><div class="flex flex-col gap-2.5"><p class="eyebrow card-meta" style="color: var(--color-accent);"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 11 3l8 4.5v9L11 21l-8-4.5z"></path><circle cx="11" cy="9" r="1.4"></circle></svg>${category}</p>${publishedAt && renderTemplate`<time class="tabular card-meta text-[0.8125rem] text-[var(--color-muted)]"${addAttribute(publishedAt, "datetime")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16"></rect><path d="M3 9h18M8 2.5v4M16 2.5v4"></path></svg>${new Date(publishedAt).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric"
	})}</time>`}</div><div><h2 class="row-title">${title}</h2><p class="text-[0.9375rem] leading-relaxed text-[var(--color-muted)] m-0 max-w-prose" style="text-wrap: pretty;">${excerpt}</p></div><span class="row-arrow hidden md:block" aria-hidden="true">→</span></a></li>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/BlogPostCard.astro", void 0);
//#endregion
export { $$BlogPostCard as t };

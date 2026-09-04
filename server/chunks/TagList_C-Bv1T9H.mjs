import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
//#region src/components/TagChip.astro
createAstro("https://blog.tracht-digital.de");
var $$TagChip = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TagChip;
	const { tag, lang = "de", active = false } = Astro.props;
	const href = lang === "en" ? `/en/tag/${tag}` : `/tag/${tag}`;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(["chip transition-colors hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]", active && "chip-active"], "class:list")}${addAttribute(tag, "data-tag")}>${tag}</a>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/TagChip.astro", void 0);
//#endregion
//#region src/components/TagList.astro
createAstro("https://blog.tracht-digital.de");
var $$TagList = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TagList;
	const { posts, tags, lang = "de", activeTag = null, label = null } = Astro.props;
	function explode(raw) {
		if (!raw) return [];
		return raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
	}
	let tagList;
	if (Array.isArray(posts)) {
		const seen = /* @__PURE__ */ new Set();
		tagList = [];
		for (const p of posts) for (const t of explode(p.tags)) if (!seen.has(t)) {
			seen.add(t);
			tagList.push(t);
		}
		tagList.sort();
	} else tagList = explode(tags);
	return renderTemplate`${tagList.length > 0 && renderTemplate`${maybeRenderHead($$result)}<div class="mb-8">${label && renderTemplate`<p class="eyebrow mb-3">${label}</p>`}<div class="flex flex-wrap gap-2">${tagList.map((t) => renderTemplate`${renderComponent($$result, "TagChip", $$TagChip, {
		"tag": t,
		"lang": lang,
		"active": t === activeTag
	})}`)}</div></div>`}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/TagList.astro", void 0);
//#endregion
export { $$TagList as t };

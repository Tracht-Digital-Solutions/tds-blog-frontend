import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent, z as unescapeHTML } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$Layout } from "./Layout_BwFgsHbM.mjs";
import { p as blogSnippets } from "./cache_C7psdfsG.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { r as renderBlocksToHtml } from "./localizedPost_CevZi1K4.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/islands/PrintControls.tsx
var ORDER = [
	"cover",
	"category",
	"lead",
	"date",
	"reading",
	"author",
	"url",
	"tags"
];
var DEFAULTS = {
	cover: false,
	category: true,
	lead: true,
	date: true,
	reading: true,
	author: true,
	url: true,
	tags: true
};
var SIZES = [
	"a5",
	"a4",
	"a3"
];
var PAGE_NAME = {
	a5: "A5",
	a4: "A4",
	a3: "A3"
};
var PAGE_MARGIN = "16mm";
var FONT_SIZES = [
	"s",
	"m",
	"l"
];
var LABELS = {
	de: {
		size: "Seitenformat",
		font: "Schriftgröße",
		fonts: {
			s: "Klein",
			m: "Mittel",
			l: "Groß"
		},
		mark: "Markieren",
		clear: "Markierungen löschen",
		meta: "Meta-Infos",
		print: "Drucken / Als PDF",
		items: {
			cover: "Titelbild",
			category: "Kategorie",
			lead: "Kurzbeschreibung",
			date: "Datum",
			reading: "Lesezeit",
			author: "Autor",
			url: "Link zum Beitrag",
			tags: "Themen"
		}
	},
	en: {
		size: "Page size",
		font: "Font size",
		fonts: {
			s: "Small",
			m: "Medium",
			l: "Large"
		},
		mark: "Highlight",
		clear: "Clear highlights",
		meta: "Meta info",
		print: "Print / Save as PDF",
		items: {
			cover: "Cover image",
			category: "Category",
			lead: "Summary",
			date: "Date",
			reading: "Reading time",
			author: "Author",
			url: "Article link",
			tags: "Topics"
		}
	}
};
var META_KEY = "tds-print-meta";
var SIZE_KEY = "tds-print-size";
var FS_KEY = "tds-print-fs";
function PrintControls({ lang = "de", hasCover = false, hasTags = true }) {
	const t = LABELS[lang];
	const keys = ORDER.filter((k) => (k !== "cover" || hasCover) && (k !== "tags" || hasTags));
	const [state, setState] = useState(DEFAULTS);
	const [size, setSize] = useState("a4");
	const [fs, setFs] = useState("m");
	const [marking, setMarking] = useState(false);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(META_KEY);
			if (raw) setState((s) => ({
				...s,
				...JSON.parse(raw)
			}));
		} catch {}
		try {
			const s = localStorage.getItem(SIZE_KEY);
			if (s && SIZES.includes(s)) setSize(s);
		} catch {}
		try {
			const f = localStorage.getItem(FS_KEY);
			if (f && FONT_SIZES.includes(f)) setFs(f);
		} catch {}
	}, []);
	useEffect(() => {
		const root = document.getElementById("print-root");
		if (root) for (const k of ORDER) root.classList.toggle(`hide-${k}`, !state[k]);
		try {
			localStorage.setItem(META_KEY, JSON.stringify(state));
		} catch {}
	}, [state]);
	useEffect(() => {
		const root = document.getElementById("print-root");
		if (root) for (const s of SIZES) root.classList.toggle(`size-${s}`, s === size);
		let style = document.getElementById("tds-print-page");
		if (!style) {
			style = document.createElement("style");
			style.id = "tds-print-page";
			document.head.appendChild(style);
		}
		style.textContent = `@page { size: ${PAGE_NAME[size]}; margin: ${PAGE_MARGIN}; }`;
		try {
			localStorage.setItem(SIZE_KEY, size);
		} catch {}
	}, [size]);
	useEffect(() => {
		const root = document.getElementById("print-root");
		if (root) for (const f of FONT_SIZES) root.classList.toggle(`fs-${f}`, f === fs);
		try {
			localStorage.setItem(FS_KEY, fs);
		} catch {}
	}, [fs]);
	useEffect(() => {
		const root = document.getElementById("print-root");
		if (!root) return;
		root.classList.toggle("marking", marking);
		if (!marking) return;
		const onUp = () => {
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			if (!root.contains(range.commonAncestorContainer)) return;
			const mark = document.createElement("mark");
			mark.className = "print-mark";
			try {
				range.surroundContents(mark);
			} catch {
				mark.appendChild(range.extractContents());
				range.insertNode(mark);
			}
			sel.removeAllRanges();
		};
		document.addEventListener("mouseup", onUp);
		return () => document.removeEventListener("mouseup", onUp);
	}, [marking]);
	const clearMarks = () => {
		const root = document.getElementById("print-root");
		if (!root) return;
		root.querySelectorAll("mark.print-mark").forEach((m) => {
			const parent = m.parentNode;
			if (!parent) return;
			while (m.firstChild) parent.insertBefore(m.firstChild, m);
			parent.removeChild(m);
			parent.normalize();
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "print-controls-inner",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "print-group",
				children: [/* @__PURE__ */ jsx("p", {
					className: "print-controls-title",
					children: t.size
				}), /* @__PURE__ */ jsx("div", {
					className: "print-seg",
					role: "group",
					"aria-label": t.size,
					children: SIZES.map((s) => /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `print-seg-btn cursor-pointer${size === s ? " on" : ""}`,
						"aria-pressed": size === s,
						onClick: () => setSize(s),
						children: PAGE_NAME[s]
					}, s))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "print-group",
				children: [/* @__PURE__ */ jsx("p", {
					className: "print-controls-title",
					children: t.font
				}), /* @__PURE__ */ jsx("div", {
					className: "print-seg",
					role: "group",
					"aria-label": t.font,
					children: FONT_SIZES.map((f) => /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `print-seg-btn cursor-pointer${fs === f ? " on" : ""}`,
						"aria-pressed": fs === f,
						onClick: () => setFs(f),
						children: t.fonts[f]
					}, f))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "print-group",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `print-action cursor-pointer${marking ? " on" : ""}`,
					"aria-pressed": marking,
					onClick: () => setMarking((m) => !m),
					children: [/* @__PURE__ */ jsxs("svg", {
						width: "15",
						height: "15",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.75",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ jsx("path", { d: "M12 20h9" }), /* @__PURE__ */ jsx("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" })]
					}), /* @__PURE__ */ jsx("span", { children: t.mark })]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "print-clear cursor-pointer",
					onClick: clearMarks,
					children: t.clear
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "print-group",
				children: [/* @__PURE__ */ jsx("p", {
					className: "print-controls-title",
					children: t.meta
				}), /* @__PURE__ */ jsx("ul", {
					className: "print-switches list-none p-0 m-0",
					children: keys.map((k) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", {
						className: "print-switch",
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								className: "print-switch-input",
								checked: state[k],
								onChange: (e) => setState((s) => ({
									...s,
									[k]: e.target.checked
								}))
							}),
							/* @__PURE__ */ jsx("span", {
								className: "print-switch-track",
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx("span", { className: "print-switch-thumb" })
							}),
							/* @__PURE__ */ jsx("span", {
								className: "print-switch-label",
								children: t.items[k]
							})
						]
					}) }, k))
				})]
			}),
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "btn-flat print-do cursor-pointer",
				onClick: () => window.print(),
				children: [/* @__PURE__ */ jsxs("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.75",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ jsx("path", { d: "M6 9V2h12v7" }),
						/* @__PURE__ */ jsx("path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }),
						/* @__PURE__ */ jsx("path", { d: "M6 14h12v8H6z" })
					]
				}), /* @__PURE__ */ jsx("span", { children: t.print })]
			})
		]
	});
}
//#endregion
//#region src/components/PrintDoc.astro
createAstro("https://blog.tracht-digital.de");
var $$PrintDoc = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PrintDoc;
	const { localized, lang } = Astro.props;
	const { post, blocks } = localized;
	const bodyHtml = blocks != null ? await renderBlocksToHtml(blocks, await blogSnippets()) : localized.bodyHtml;
	const backHref = `${lang === "en" ? "/en" : ""}/${post.slug}`;
	const url = new URL(backHref, siteConfig.url).toString();
	const dateLabel = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const wordCount = bodyHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
	const readingMinutes = Math.max(1, Math.round(wordCount / 220));
	const explicitCover = post.coverHint?.startsWith("http") ? post.coverHint : void 0;
	const tags = (post.tags ?? "").split(",").map((s) => s.trim()).filter(Boolean);
	const authorName = post.author?.name ?? (lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial");
	const t = lang === "de" ? {
		readUnit: "Min. Lesezeit",
		by: "Von",
		tagsLabel: "Themen",
		back: "← Zum Beitrag",
		view: "Druckansicht"
	} : {
		readUnit: "min read",
		by: "By",
		tagsLabel: "Topics",
		back: "← Back to article",
		view: "Print view"
	};
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${post.title} — ${t.view}`,
		"description": post.excerpt,
		"lang": lang,
		"bare": true,
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="print-shell"><aside class="print-controls"><a${addAttribute(backHref, "href")} class="print-back-link">${t.back}</a>${renderComponent($$result, "PrintControls", PrintControls, {
		"lang": lang,
		"hasCover": !!explicitCover,
		"hasTags": tags.length > 0,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/PrintControls.tsx",
		"client:component-export": "default"
	})}</aside><article id="print-root" class="print-doc hide-cover size-a4 fs-m">${explicitCover && renderTemplate`<img class="pm-cover"${addAttribute(explicitCover, "src")} alt="">`}<p class="pm-category print-eyebrow">${post.category}</p><h1 class="print-title">${post.title}</h1><p class="pm-lead print-lead">${post.excerpt}</p><div class="print-meta">${dateLabel && renderTemplate`<span class="pm-date">${dateLabel}</span>`}<span class="pm-reading">~${readingMinutes} ${t.readUnit}</span><span class="pm-author">${t.by} ${authorName}</span></div><p class="pm-url print-url">${url}</p><div class="prose-print">${unescapeHTML(bodyHtml)}</div>${tags.length > 0 && renderTemplate`<p class="pm-tags print-tags">${t.tagsLabel}: ${tags.join(", ")}</p>`}</article></div>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/PrintDoc.astro", void 0);
//#endregion
export { $$PrintDoc as t };

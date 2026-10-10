import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead, w as renderComponent, z as unescapeHTML } from "./sequence_E54re6b9.mjs";
import { t as createComponent } from "./compiler_BvE05Vkz.mjs";
import { t as $$Layout } from "./Layout_CSAT5jey.mjs";
import { g as blogSnippets } from "./cache_DNRBnnjj.mjs";
import { o as stripProductShortcodes, r as renderBlocksToHtml } from "./localizedPost_CAGOf2kO.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/islands/printPaginate.ts
/**
* Splits the print view's article into real pages (2026-10-06).
*
* The preview used to be ONE sheet as wide as the paper and as long as the
* text, so "A4" changed the width and nothing else — no page ended anywhere.
* Now the content is laid out into `.print-page` boxes of the paper's exact
* height (CSS, per `size-*`), block by block: a block that would overflow the
* current page starts the next one. The same pages go to the printer with a
* forced break between them, so what the preview shows is what prints.
*
* Flow units are the article's own nodes, MOVED (never cloned), so highlights
* made with the marker survive a re-pagination. Units are the top-level
* children of the sheet plus the children of `.prose-print`, which is
* re-created per page so its typography still applies.
*
* Two rules keep the preview honest (2026-10-07):
*  - It is measured at TRUE size. The sheet is scaled to the screen with CSS
*    `zoom`, and text laid out at 42 % wraps (and so breaks pages) a little
*    differently from the paper. `paginate` lifts the zoom while it measures.
*  - A heading never ends a page. It moves to the next page with the block it
*    introduces — the printer would do the same (`break-after: avoid`), and a
*    preview that did not would break pages one block earlier than the paper.
*/
var PROSE = "prose-print";
var units = null;
var proseClass = PROSE;
function collectInitial(root) {
	const out = [];
	for (const child of Array.from(root.children)) if (child.classList.contains(PROSE)) {
		proseClass = child.className;
		for (const inner of Array.from(child.children)) out.push({
			node: inner,
			prose: true
		});
	} else out.push({
		node: child,
		prose: false
	});
	return out;
}
var isHeading = (el) => /^H[1-6]$/.test(el.tagName);
/** Lay `#print-root`'s content out into pages. Idempotent; call after any change of size, type or visibility. */
function paginate(root, pageLabel) {
	if (!units) units = collectInitial(root);
	const zoom = root.style.getPropertyValue("--print-scale");
	root.style.setProperty("--print-scale", "1");
	root.replaceChildren();
	root.classList.add("is-paged");
	const pages = [];
	let inner = root;
	let prose = null;
	let onPage = [];
	const newPage = () => {
		const page = document.createElement("section");
		page.className = "print-page";
		inner = document.createElement("div");
		inner.className = "print-page__inner";
		page.append(inner);
		root.append(page);
		pages.push(page);
		prose = null;
		onPage = [];
	};
	const overflows = () => inner.scrollHeight > inner.clientHeight + 1;
	const place = (unit) => {
		if (unit.prose) {
			if (!prose) {
				prose = document.createElement("div");
				prose.className = proseClass;
				inner.append(prose);
			}
			prose.append(unit.node);
		} else {
			prose = null;
			inner.append(unit.node);
		}
		onPage.push(unit);
	};
	const take = (unit) => {
		unit.node.remove();
		onPage.pop();
		const wrapper = prose;
		if (wrapper && wrapper.childElementCount === 0) {
			wrapper.remove();
			prose = null;
		}
	};
	newPage();
	for (const unit of units) {
		place(unit);
		if (!overflows() || onPage.length < 2) continue;
		take(unit);
		const carry = [];
		const prev = onPage[onPage.length - 1];
		if (prev && isHeading(prev.node) && onPage.length > 1) {
			take(prev);
			carry.push(prev);
		}
		newPage();
		for (const u of [...carry, unit]) place(u);
	}
	pages.forEach((page, i) => {
		const no = document.createElement("span");
		no.className = "print-page__no";
		no.setAttribute("aria-hidden", "true");
		no.textContent = pageLabel(i + 1, pages.length);
		page.append(no);
		page.setAttribute("aria-label", pageLabel(i + 1, pages.length));
	});
	if (zoom) root.style.setProperty("--print-scale", zoom);
	else root.style.removeProperty("--print-scale");
	return pages.length;
}
/** Inline parents whose whitespace-only text belongs to the sentence (the space between two links). */
var INLINE_TEXT_PARENT = /^(P|LI|H[1-6]|BLOCKQUOTE|TD|TH|DD|DT|FIGCAPTION|A|STRONG|EM|B|I|U|S|SPAN|CODE|SMALL|SUB|SUP|MARK|ABBR|CITE|Q|TIME)$/;
/**
* Wraps every piece of text the range covers in its own `<mark class="print-mark">`.
*
* Text node by text node, never `range.extractContents()`: a selection across
* two paragraphs used to be pulled out whole and re-inserted INSIDE one inline
* `<mark>`, which moved block elements into an inline one, merged the
* paragraphs and threw off the pagination. The pieces of one selection share
* a `data-mark` id, so one tap removes the whole highlight. Returns how many
* pieces it made.
*/
var nextMark = 0;
function highlightRange(range, root) {
	const scope = range.commonAncestorContainer;
	const base = scope.nodeType === Node.TEXT_NODE ? scope.parentNode : scope;
	if (!base) return 0;
	const walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, { acceptNode(n) {
		if (!range.intersectsNode(n) || !root.contains(n)) return NodeFilter.FILTER_REJECT;
		const parent = n.parentElement;
		if (!parent || parent.closest("mark.print-mark, .print-page__no")) return NodeFilter.FILTER_REJECT;
		if (!/\S/.test(n.textContent ?? "") && !INLINE_TEXT_PARENT.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
		return NodeFilter.FILTER_ACCEPT;
	} });
	const nodes = [];
	while (walker.nextNode()) nodes.push(walker.currentNode);
	const { startContainer, startOffset, endContainer, endOffset } = range;
	let made = 0;
	const id = `m${++nextMark}`;
	for (let node of nodes) {
		const start = node === startContainer ? startOffset : 0;
		const end = node === endContainer ? endOffset : node.length;
		if (start >= end) continue;
		if (end < node.length) node.splitText(end);
		if (start > 0) node = node.splitText(start);
		const mark = document.createElement("mark");
		mark.className = "print-mark";
		mark.dataset.mark = id;
		node.parentNode.insertBefore(mark, node);
		mark.appendChild(node);
		made++;
	}
	return made;
}
/** How many highlights (not pieces) there are under `root`. */
function countHighlights(root) {
	return new Set(Array.from(root.querySelectorAll("mark.print-mark"), (m) => m.dataset.mark)).size;
}
/** Unwraps one highlight (every piece of it), or every highlight under `target`. */
function removeHighlights(target, root = document.body) {
	const id = target.dataset?.mark;
	const marks = target.matches("mark.print-mark") ? id ? Array.from(root.querySelectorAll(`mark.print-mark[data-mark="${id}"]`)) : [target] : Array.from(target.querySelectorAll("mark.print-mark"));
	for (const m of marks) {
		const parent = m.parentNode;
		if (!parent) continue;
		while (m.firstChild) parent.insertBefore(m.firstChild, m);
		parent.removeChild(m);
		parent.normalize();
	}
}
//#endregion
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
/** Paper size in mm — the sheets are laid out at this true size and then
*  scaled to the screen, so A5/A4/A3 differ the way the paper does. */
var PAGE_MM = {
	a5: [148, 210],
	a4: [210, 297],
	a3: [297, 420]
};
var MM_TO_PX = 96 / 25.4;
var PAGE_MARGIN = "16mm";
/** The sheet's hard offset on screen (8px) plus a little air. */
var SHEET_EXTRA = 12;
var FONT_SIZES = [
	"s",
	"m",
	"l"
];
var FITS = [
	"page",
	"width",
	"actual"
];
var LABELS = {
	de: {
		back: "Zum Beitrag",
		settings: "Einstellungen",
		size: "Seitenformat",
		font: "Schriftgröße",
		fonts: {
			s: "Klein",
			m: "Mittel",
			l: "Groß"
		},
		view: "Ansicht",
		fits: {
			page: "Seite",
			width: "Breite",
			actual: "100 %"
		},
		mark: "Markieren",
		markMode: "Markier-Modus",
		markHint: "Text auswählen, dann „Markieren“ tippen.",
		unmark: "Markierung entfernen",
		clear: "Alle Markierungen löschen",
		meta: "Inhalte",
		print: "Drucken / Als PDF",
		scale: (pct) => `Vorschau in ${pct} % der Originalgröße`,
		pages: (n) => n === 1 ? "1 Seite" : `${n} Seiten`,
		pageNo: (n, total) => `Seite ${n} von ${total}`,
		pageNoCss: `"Seite " counter(page) " von " counter(pages)`,
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
		back: "Back to article",
		settings: "Settings",
		size: "Page size",
		font: "Font size",
		fonts: {
			s: "Small",
			m: "Medium",
			l: "Large"
		},
		view: "View",
		fits: {
			page: "Page",
			width: "Width",
			actual: "100%"
		},
		mark: "Highlight",
		markMode: "Marker mode",
		markHint: "Select text, then tap “Highlight”.",
		unmark: "Remove highlight",
		clear: "Clear all highlights",
		meta: "Contents",
		print: "Print / Save as PDF",
		scale: (pct) => `Preview at ${pct}% of actual size`,
		pages: (n) => n === 1 ? "1 page" : `${n} pages`,
		pageNo: (n, total) => `Page ${n} of ${total}`,
		pageNoCss: `"Page " counter(page) " of " counter(pages)`,
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
var WIDE = "(min-width: 900px)";
function PrintControls({ lang = "de", backHref, hasCover = false, hasTags = true }) {
	const t = LABELS[lang];
	const keys = ORDER.filter((k) => (k !== "cover" || hasCover) && (k !== "tags" || hasTags));
	const [state, setState] = useState(DEFAULTS);
	const [size, setSize] = useState("a4");
	const [fs, setFs] = useState("m");
	const [fit, setFit] = useState("width");
	const [open, setOpen] = useState(false);
	const [marking, setMarking] = useState(false);
	const [markCount, setMarkCount] = useState(0);
	const [selBar, setSelBar] = useState(null);
	const [scale, setScale] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const barRef = useRef(null);
	/** The last non-empty selection inside the sheet. A tap on the bar's button
	*  can collapse the live selection before the click arrives (iOS does). */
	const rangeRef = useRef(null);
	const root = () => document.getElementById("print-root");
	const countMarks = () => {
		const el = root();
		setMarkCount(el ? countHighlights(el) : 0);
	};
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
		setFit(window.matchMedia(WIDE).matches ? "page" : "width");
	}, []);
	useEffect(() => {
		const el = root();
		if (el) for (const k of ORDER) el.classList.toggle(`hide-${k}`, !state[k]);
		try {
			localStorage.setItem(META_KEY, JSON.stringify(state));
		} catch {}
	}, [state]);
	useEffect(() => {
		const el = root();
		if (el) for (const s of SIZES) el.classList.toggle(`size-${s}`, s === size);
		let style = document.getElementById("tds-print-page");
		if (!style) {
			style = document.createElement("style");
			style.id = "tds-print-page";
			document.head.appendChild(style);
		}
		style.textContent = `@page { size: ${PAGE_NAME[size]}; margin: ${PAGE_MARGIN}; @bottom-right { content: ${t.pageNoCss}; font-family: var(--font-body), sans-serif; font-size: 8.25pt; color: #71717a; vertical-align: middle; } }`;
		try {
			localStorage.setItem(SIZE_KEY, size);
		} catch {}
	}, [size]);
	useEffect(() => {
		const el = root();
		const stage = el?.parentElement;
		if (!el || !stage) return;
		const apply = () => {
			const [wMm, hMm] = PAGE_MM[size];
			const pageW = wMm * MM_TO_PX + SHEET_EXTRA;
			const pageH = hMm * MM_TO_PX + SHEET_EXTRA;
			const availW = stage.clientWidth;
			const bar = barRef.current?.closest(".print-controls");
			const barH = bar && getComputedStyle(bar).position === "sticky" ? bar.getBoundingClientRect().height : 0;
			const availH = window.innerHeight - barH - 48;
			let next = 1;
			if (fit === "width") next = Math.min(1, availW / pageW);
			else if (fit === "page") next = Math.min(1, availW / pageW, availH / pageH);
			next = Math.max(.2, next);
			el.style.setProperty("--print-scale", String(next));
			setScale(next);
		};
		apply();
		const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
		ro?.observe(stage);
		window.addEventListener("resize", apply);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", apply);
		};
	}, [size, fit]);
	useEffect(() => {
		const el = root();
		if (el) for (const f of FONT_SIZES) el.classList.toggle(`fs-${f}`, f === fs);
		try {
			localStorage.setItem(FS_KEY, fs);
		} catch {}
	}, [fs]);
	useEffect(() => {
		const el = root();
		if (!el) return;
		let cancelled = false;
		const run = () => {
			if (!cancelled) setPageCount(paginate(el, t.pageNo));
		};
		run();
		document.fonts?.ready.then(run).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [
		state,
		size,
		fs
	]);
	useEffect(() => {
		const el = root();
		if (!el) return;
		let timer = 0;
		const read = () => {
			const sel = window.getSelection();
			if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
				const range = sel.getRangeAt(0);
				if (el.contains(range.commonAncestorContainer)) {
					rangeRef.current = range.cloneRange();
					setSelBar({ kind: "mark" });
					return;
				}
			}
			setSelBar((b) => b?.kind === "mark" ? null : b);
		};
		const onChange = () => {
			clearTimeout(timer);
			timer = window.setTimeout(read, 160);
		};
		const onClick = (e) => {
			const mark = e.target?.closest?.("mark.print-mark");
			const sel = window.getSelection();
			if (mark && el.contains(mark) && (!sel || sel.isCollapsed)) setSelBar({
				kind: "unmark",
				mark
			});
			else if (!mark) setSelBar((b) => b?.kind === "unmark" ? null : b);
		};
		document.addEventListener("selectionchange", onChange);
		el.addEventListener("click", onClick);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("selectionchange", onChange);
			el.removeEventListener("click", onClick);
		};
	}, []);
	useEffect(() => {
		const el = root();
		if (!el) return;
		el.classList.toggle("marking", marking);
		if (!marking) return;
		const onUp = (e) => {
			if (e.pointerType !== "mouse") return;
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			if (!el.contains(range.commonAncestorContainer)) return;
			highlightRange(range, el);
			sel.removeAllRanges();
			rangeRef.current = null;
			setSelBar(null);
			countMarks();
		};
		document.addEventListener("pointerup", onUp);
		return () => document.removeEventListener("pointerup", onUp);
	}, [marking]);
	const markSelection = () => {
		const el = root();
		const range = rangeRef.current;
		if (!el || !range) return;
		highlightRange(range, el);
		window.getSelection()?.removeAllRanges();
		rangeRef.current = null;
		setSelBar(null);
		countMarks();
	};
	const unmark = (mark) => {
		const el = root();
		if (el) removeHighlights(mark, el);
		setSelBar(null);
		countMarks();
	};
	const clearMarks = () => {
		const el = root();
		if (!el) return;
		removeHighlights(el);
		setSelBar(null);
		countMarks();
	};
	const keepSelection = (e) => e.preventDefault();
	const seg = (label, options, value, set, name) => /* @__PURE__ */ jsxs("div", {
		className: "print-group",
		children: [/* @__PURE__ */ jsx("p", {
			className: "print-controls-title",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "print-seg",
			role: "group",
			"aria-label": label,
			children: options.map((o) => /* @__PURE__ */ jsx("button", {
				type: "button",
				className: `print-seg-btn cursor-pointer${value === o ? " on" : ""}`,
				"aria-pressed": value === o,
				onClick: () => set(o),
				children: name(o)
			}, o))
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		ref: barRef,
		className: `print-controls-inner${open ? " is-open" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "print-bar",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: backHref,
						className: "print-back-link",
						"aria-label": t.back,
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: "←"
						}), /* @__PURE__ */ jsx("span", {
							className: "print-back-text",
							children: t.back
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
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "print-more cursor-pointer",
						"aria-expanded": open,
						"aria-controls": "print-settings",
						"aria-label": t.settings,
						onClick: () => setOpen((o) => !o),
						children: /* @__PURE__ */ jsxs("svg", {
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.75",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ jsx("path", { d: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" }),
								/* @__PURE__ */ jsx("circle", {
									cx: "16",
									cy: "6",
									r: "2"
								}),
								/* @__PURE__ */ jsx("circle", {
									cx: "10",
									cy: "12",
									r: "2"
								}),
								/* @__PURE__ */ jsx("circle", {
									cx: "18",
									cy: "18",
									r: "2"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				id: "print-settings",
				className: "print-settings",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "print-row",
						children: [seg(t.size, SIZES, size, setSize, (s) => PAGE_NAME[s]), seg(t.font, FONT_SIZES, fs, setFs, (f) => t.fonts[f])]
					}),
					seg(t.view, FITS, fit, setFit, (f) => t.fits[f]),
					/* @__PURE__ */ jsxs("p", {
						className: "print-scale-note",
						"aria-live": "polite",
						children: [
							pageCount > 0 ? t.pages(pageCount) : null,
							pageCount > 0 && scale < 1 ? " · " : null,
							scale < 1 ? t.scale(Math.round(scale * 100)) : null
						]
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
					/* @__PURE__ */ jsxs("div", {
						className: "print-mark-row",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "print-mark-hint",
								children: t.markHint
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: `print-action print-mark-mode cursor-pointer${marking ? " on" : ""}`,
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
								}), /* @__PURE__ */ jsx("span", { children: t.markMode })]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "print-clear cursor-pointer",
								onClick: clearMarks,
								disabled: markCount === 0,
								children: [t.clear, markCount > 0 ? ` (${markCount})` : ""]
							})
						]
					})
				]
			}),
			selBar && /* @__PURE__ */ jsx("div", {
				className: "print-selbar",
				role: "toolbar",
				"aria-label": t.mark,
				children: selBar.kind === "mark" ? /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "print-selbar-btn is-mark cursor-pointer",
					onPointerDown: keepSelection,
					onMouseDown: keepSelection,
					onClick: markSelection,
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
						children: [/* @__PURE__ */ jsx("path", { d: "M12 20h9" }), /* @__PURE__ */ jsx("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" })]
					}), t.mark]
				}) : /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "print-selbar-btn cursor-pointer",
					onClick: () => unmark(selBar.mark),
					children: t.unmark
				})
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
	const bodyHtml = blocks != null ? await renderBlocksToHtml(blocks, await blogSnippets()) : stripProductShortcodes(localized.bodyHtml);
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
		view: "Druckansicht"
	} : {
		readUnit: "min read",
		by: "By",
		tagsLabel: "Topics",
		view: "Print view"
	};
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${post.title} — ${t.view}`,
		"description": post.excerpt,
		"lang": lang,
		"bare": true,
		"noindex": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="print-shell"><aside class="print-controls">${renderComponent($$result, "PrintControls", PrintControls, {
		"lang": lang,
		"backHref": backHref,
		"hasCover": !!explicitCover,
		"hasTags": tags.length > 0,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/PrintControls.tsx",
		"client:component-export": "default"
	})}</aside><div class="print-stage"><article id="print-root" class="print-doc hide-cover size-a4 fs-m">${explicitCover && renderTemplate`<img class="pm-cover"${addAttribute(explicitCover, "src")} alt="">`}<p class="pm-category print-eyebrow">${post.category}</p><h1 class="print-title">${post.title}</h1><p class="pm-lead print-lead">${post.excerpt}</p><div class="print-meta">${dateLabel && renderTemplate`<span class="pm-date">${dateLabel}</span>`}<span class="pm-reading">~${readingMinutes} ${t.readUnit}</span><span class="pm-author">${t.by} ${authorName}</span></div><p class="pm-url print-url">${url}</p><div class="prose-print">${unescapeHTML(bodyHtml)}</div>${tags.length > 0 && renderTemplate`<p class="pm-tags print-tags">${t.tagsLabel}: ${tags.join(", ")}</p>`}</article></div></div>` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/PrintDoc.astro", void 0);
//#endregion
export { $$PrintDoc as t };

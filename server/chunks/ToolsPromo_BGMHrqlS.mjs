import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { a as PostCover, n as TOOLS_URL } from "./Layout_BwFgsHbM.mjs";
import { i as formatPostDate, n as PostCard, r as fallbackAuthorName, t as AuthorChip } from "./PostCard_BfKijCrk.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/islands/HeroSlider.tsx
var LABELS$2 = {
	de: {
		intro: "Einblicke für den Mittelstand",
		read: "Artikel lesen",
		more: "Mehr aus dieser Auswahl",
		sets: {
			empfohlen: {
				id: "empfohlen",
				label: "Empfohlen",
				blurb: "Für Sie ausgewählt"
			},
			aktuelles: {
				id: "aktuelles",
				label: "Aktuelles",
				blurb: "Die neuesten Beiträge"
			},
			populaer: {
				id: "populaer",
				label: "Populär",
				blurb: "Am meisten gelesen"
			}
		}
	},
	en: {
		intro: "Insights for the Mittelstand",
		read: "Read article",
		more: "More from this set",
		sets: {
			empfohlen: {
				id: "empfohlen",
				label: "For you",
				blurb: "Picked for you"
			},
			aktuelles: {
				id: "aktuelles",
				label: "Latest",
				blurb: "The newest posts"
			},
			populaer: {
				id: "populaer",
				label: "Popular",
				blurb: "Most read"
			}
		}
	}
};
var DRAG_THRESHOLD = 64;
function readWeights$1() {
	const match = document.cookie.match(/(?:^|; )tds-interests=([^;]*)/);
	if (!match) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(match[1]));
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function topicsOf$1(post) {
	return [post.category, ...(post.tags ?? "").split(",")].map((t) => t.trim().toLowerCase()).filter(Boolean);
}
function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function hrefFor(lang, slug) {
	return `${lang === "en" ? "/en" : ""}/${slug}`;
}
function Slide({ posts, meta, lang, t }) {
	const [lead, ...rest] = posts;
	if (!lead) return null;
	const secondary = rest.slice(0, 2);
	return /* @__PURE__ */ jsxs("div", {
		className: "hero-grid grid md:grid-cols-2 gap-8 md:gap-11",
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				minWidth: 0
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 14,
						marginBottom: 20
					},
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							style: { color: "var(--color-accent-pink)" },
							children: meta.label
						}),
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							style: {
								width: 4,
								height: 4,
								background: "rgba(255,255,255,.4)"
							}
						}),
						/* @__PURE__ */ jsx("span", {
							style: {
								fontSize: 12,
								fontWeight: 500,
								color: "rgba(255,255,255,.6)"
							},
							children: lead.category
						})
					]
				}),
				/* @__PURE__ */ jsx("a", {
					href: hrefFor(lang, lead.slug),
					style: {
						textDecoration: "none",
						color: "inherit"
					},
					children: /* @__PURE__ */ jsx("h2", {
						className: "display",
						style: {
							fontSize: "clamp(2rem, 1.6rem + 1.9vw, 3.25rem)",
							margin: 0,
							textWrap: "balance"
						},
						children: lead.title
					})
				}),
				/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: 17,
						lineHeight: 1.6,
						color: "rgba(255,255,255,.75)",
						margin: "14px 0 0",
						maxWidth: "54ch",
						textWrap: "pretty",
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						overflow: "hidden"
					},
					children: lead.excerpt
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 18,
						marginTop: 18
					},
					children: [/* @__PURE__ */ jsx(AuthorChip, {
						inverse: true,
						name: lead.author?.name ?? fallbackAuthorName(lang),
						avatarUrl: lead.author?.avatarUrl
					}), lead.publishedAt && /* @__PURE__ */ jsx("span", {
						className: "tabular",
						style: {
							fontSize: 13,
							color: "rgba(255,255,255,.55)"
						},
						children: formatPostDate(lead.publishedAt, lang)
					})]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: hrefFor(lang, lead.slug),
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						marginTop: 22,
						height: 48,
						padding: "0 24px",
						background: "#fff",
						color: "var(--color-surface-navy)",
						textDecoration: "none",
						fontSize: 15,
						fontWeight: 600
					},
					children: [
						t.read,
						" ",
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: "→"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "hidden sm:flex",
			style: {
				flexDirection: "column",
				justifyContent: "center",
				gap: 16,
				minHeight: 0
			},
			children: [/* @__PURE__ */ jsx("a", {
				href: hrefFor(lang, lead.slug),
				className: "hero-cover",
				"aria-hidden": "true",
				tabIndex: -1,
				style: {
					overflow: "hidden",
					position: "relative",
					display: "block"
				},
				children: /* @__PURE__ */ jsx(PostCover, {
					slug: lead.slug,
					coverHint: lead.coverHint,
					title: lead.title,
					style: {
						position: "absolute",
						inset: 0
					}
				})
			}), secondary.length > 0 && /* @__PURE__ */ jsx("ul", {
				className: "list-none p-0 m-0",
				style: {
					display: "grid",
					gap: 8
				},
				children: secondary.map((p) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
					href: hrefFor(lang, p.slug),
					style: {
						display: "flex",
						gap: 10,
						color: "rgba(255,255,255,.78)",
						textDecoration: "none",
						fontSize: 13.5,
						lineHeight: 1.4
					},
					children: [/* @__PURE__ */ jsx("span", {
						"aria-hidden": "true",
						style: { color: "var(--color-accent-pink)" },
						children: "→"
					}), /* @__PURE__ */ jsx("span", {
						style: { textWrap: "balance" },
						children: p.title
					})]
				}) }, p.slug))
			})]
		})]
	});
}
function HeroSlider({ latest, popular, lang }) {
	const t = LABELS$2[lang];
	const [recommended, setRecommended] = useState([]);
	const [active, setActive] = useState("aktuelles");
	const [reducedMotion, setReducedMotion] = useState(false);
	const interacted = useRef(false);
	useEffect(() => setReducedMotion(prefersReducedMotion()), []);
	useEffect(() => {
		const weights = readWeights$1();
		if (!weights || Object.keys(weights).length === 0) return;
		const scored = latest.map((post) => ({
			post,
			score: topicsOf$1(post).reduce((sum, topic) => sum + (weights[topic] ?? 0), 0)
		})).filter((s) => s.score > 0).sort((a, b) => b.score - a.score || (b.post.publishedAt ?? "").localeCompare(a.post.publishedAt ?? "")).slice(0, 4).map((s) => s.post);
		if (scored.length > 0) {
			setRecommended(scored);
			if (!interacted.current) setActive("empfohlen");
		}
	}, [latest]);
	const sets = [];
	if (recommended.length > 0) sets.push({
		meta: t.sets.empfohlen,
		posts: recommended
	});
	if (latest.length > 0) sets.push({
		meta: t.sets.aktuelles,
		posts: latest
	});
	if (popular.length > 0) sets.push({
		meta: t.sets.populaer,
		posts: popular
	});
	const order = sets.map((s) => s.meta.id);
	const activeIndex = Math.max(0, order.indexOf(active));
	const go = useCallback((id) => {
		interacted.current = true;
		setActive(id);
	}, []);
	const step = useCallback((dir) => {
		if (order.length < 2) return;
		const next = order[(activeIndex + dir + order.length) % order.length];
		setActive(next);
	}, [order, activeIndex]);
	const drag = useRef({
		startX: 0,
		dx: 0,
		active: false,
		moved: false
	});
	const captured = useRef(false);
	const [dragDX, setDragDX] = useState(0);
	const [dragging, setDragging] = useState(false);
	const suppressClick = useRef(false);
	const onPointerDown = useCallback((e) => {
		if (order.length < 2) return;
		if (e.pointerType === "mouse" && e.button !== 0) return;
		drag.current = {
			startX: e.clientX,
			dx: 0,
			active: true,
			moved: false
		};
		captured.current = false;
		setDragging(true);
	}, [order.length]);
	const onPointerMove = useCallback((e) => {
		const s = drag.current;
		if (!s.active) return;
		let dx = e.clientX - s.startX;
		const atStart = activeIndex === 0 && dx > 0;
		const atEnd = activeIndex === order.length - 1 && dx < 0;
		if (atStart || atEnd) dx /= 3;
		s.dx = dx;
		if (!s.moved && Math.abs(e.clientX - s.startX) > 6) {
			s.moved = true;
			e.currentTarget.setPointerCapture?.(e.pointerId);
			captured.current = true;
		}
		setDragDX(dx);
	}, [activeIndex, order.length]);
	const endDrag = useCallback(() => {
		const s = drag.current;
		if (!s.active) return;
		s.active = false;
		if (s.moved && Math.abs(s.dx) > DRAG_THRESHOLD && order.length > 1) {
			const dir = s.dx < 0 ? 1 : -1;
			const target = activeIndex + dir;
			if (target >= 0 && target < order.length) {
				interacted.current = true;
				setActive(order[target]);
			}
		}
		if (s.moved) suppressClick.current = true;
		captured.current = false;
		setDragDX(0);
		setDragging(false);
	}, [order, activeIndex]);
	if (sets.length === 0) return null;
	const current = sets[activeIndex] ?? sets[0];
	const nav = lang === "de" ? {
		prev: "Vorherige Auswahl",
		next: "Nächste Auswahl"
	} : {
		prev: "Previous set",
		next: "Next set"
	};
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "var(--color-surface-navy)",
			color: "#fff"
		},
		"aria-roledescription": "carousel",
		"aria-label": "Journal",
		children: /* @__PURE__ */ jsxs("div", {
			className: "tds-shell",
			style: {
				paddingTop: 40,
				paddingBottom: 44
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3",
					style: { marginBottom: 26 },
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "baseline",
							gap: 16
						},
						children: [/* @__PURE__ */ jsx("h1", {
							className: "display",
							style: {
								fontSize: 17,
								letterSpacing: "0.14em",
								textTransform: "uppercase",
								margin: 0
							},
							children: "Journal"
						}), /* @__PURE__ */ jsx("span", {
							style: {
								fontSize: 14,
								color: "rgba(255,255,255,.55)"
							},
							children: current.meta.blurb
						})]
					}), sets.length > 1 && /* @__PURE__ */ jsx("div", {
						role: "tablist",
						"aria-label": lang === "de" ? "Journal-Auswahl" : "Journal selection",
						className: "flex items-center",
						style: { gap: 4 },
						onKeyDown: (e) => {
							if (e.key === "ArrowRight") {
								e.preventDefault();
								step(1);
							} else if (e.key === "ArrowLeft") {
								e.preventDefault();
								step(-1);
							}
						},
						children: sets.map(({ meta }) => {
							const on = meta.id === current.meta.id;
							return /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "tab",
								id: `hero-tab-${meta.id}`,
								"aria-controls": "hero-stage",
								"aria-selected": on,
								tabIndex: on ? 0 : -1,
								onClick: () => go(meta.id),
								className: "cursor-pointer",
								style: {
									background: "transparent",
									border: 0,
									padding: "6px 10px",
									fontFamily: "var(--font-body)",
									fontSize: 13,
									fontWeight: 600,
									letterSpacing: "0.02em",
									color: on ? "#fff" : "rgba(255,255,255,.55)",
									borderBottom: `2px solid ${on ? "var(--color-accent-pink)" : "transparent"}`,
									transition: "color 160ms ease, border-color 160ms ease"
								},
								children: meta.label
							}, meta.id);
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					role: sets.length > 1 ? "tabpanel" : void 0,
					id: "hero-stage",
					"aria-labelledby": sets.length > 1 ? `hero-tab-${current.meta.id}` : void 0,
					className: "hero-stage",
					onPointerDown,
					onPointerMove,
					onPointerUp: endDrag,
					onPointerCancel: endDrag,
					onDragStart: (e) => e.preventDefault(),
					onPointerLeave: () => {
						if (!captured.current) endDrag();
					},
					onClickCapture: (e) => {
						if (suppressClick.current) {
							e.preventDefault();
							e.stopPropagation();
							suppressClick.current = false;
						}
					},
					children: /* @__PURE__ */ jsx("div", {
						className: `hero-track${dragging ? " is-dragging" : ""}`,
						style: {
							transform: `translateX(calc(${-activeIndex * 100}% + ${dragDX}px))`,
							transition: dragging || reducedMotion ? "none" : "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)"
						},
						children: sets.map(({ meta, posts }, i) => {
							const on = i === activeIndex;
							return /* @__PURE__ */ jsx("div", {
								className: "hero-slide",
								"aria-hidden": !on,
								inert: !on,
								children: /* @__PURE__ */ jsx(Slide, {
									posts,
									meta,
									lang,
									t
								})
							}, meta.id);
						})
					})
				}),
				sets.length > 1 && /* @__PURE__ */ jsxs("div", {
					className: "hero-controls",
					role: "group",
					"aria-label": lang === "de" ? "Folien-Navigation" : "Slide navigation",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "hero-arrow cursor-pointer",
							"aria-label": nav.prev,
							onClick: () => {
								interacted.current = true;
								step(-1);
							},
							children: /* @__PURE__ */ jsx("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx("path", { d: "M15 18l-6-6 6-6" })
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hero-dots",
							children: sets.map(({ meta }) => {
								const on = meta.id === current.meta.id;
								return /* @__PURE__ */ jsx("button", {
									type: "button",
									className: `hero-dot cursor-pointer${on ? " on" : ""}`,
									"aria-label": meta.label,
									"aria-current": on ? "true" : void 0,
									onClick: () => go(meta.id)
								}, meta.id);
							})
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "hero-arrow cursor-pointer",
							"aria-label": nav.next,
							onClick: () => {
								interacted.current = true;
								step(1);
							},
							children: /* @__PURE__ */ jsx("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx("path", { d: "M9 18l6-6-6-6" })
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/islands/BlogIndex.tsx
/** Pick the singular for exactly one, the plural for everything else. */
function plural(forms, n) {
	return n === 1 ? forms[0] : forms[1];
}
var LABELS$1 = {
	de: {
		featured: "Im Fokus",
		readArticle: "Artikel lesen",
		all: "Alle Beiträge",
		categories: "Kategorien",
		expandCats: "Kategorien ausklappen",
		collapseCats: "Kategorien einklappen",
		results: ["Treffer für", "Treffer für"],
		inCategory: ["Beitrag in der Kategorie", "Beiträge in der Kategorie"],
		clear: "Zurücksetzen",
		noResults: "Keine Beiträge gefunden. Versuchen Sie einen anderen Suchbegriff.",
		empty: "Noch keine Artikel veröffentlicht.",
		older: "Ältere Artikel",
		minRead: "Min. Lesezeit"
	},
	en: {
		featured: "Featured",
		readArticle: "Read article",
		all: "All posts",
		categories: "Categories",
		expandCats: "Expand categories",
		collapseCats: "Collapse categories",
		results: ["result for", "results for"],
		inCategory: ["post in category", "posts in category"],
		clear: "Clear",
		noResults: "No posts found. Try a different search term.",
		empty: "No articles published yet.",
		older: "Older articles",
		minRead: "min read"
	}
};
function searchText(post) {
	return [
		post.title,
		post.excerpt,
		post.category,
		post.tags ?? ""
	].join(" ").toLowerCase();
}
function matchesQuery(post, q) {
	const query = q.trim().toLowerCase();
	if (!query) return true;
	const text = searchText(post);
	return query.split(/\s+/).every((word) => text.includes(word));
}
function Chevron({ left }) {
	return /* @__PURE__ */ jsx("svg", {
		width: "15",
		height: "15",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", { d: left ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6" })
	});
}
function CategorySidebar({ posts, cats, value, onChange, collapsed, onToggle, t }) {
	const count = (c) => c === "all" ? posts.length : posts.filter((p) => p.category === c).length;
	if (collapsed) return /* @__PURE__ */ jsx("nav", {
		className: "sidenav",
		id: "blog-cat-rail",
		"aria-label": t.categories,
		children: /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "sidenav-toggle",
			onClick: onToggle,
			"aria-label": t.expandCats,
			"aria-controls": "blog-cat-rail",
			"aria-expanded": "false",
			children: /* @__PURE__ */ jsx(Chevron, {})
		})
	});
	return /* @__PURE__ */ jsxs("nav", {
		className: "sidenav",
		id: "blog-cat-rail",
		"aria-label": t.categories,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "sidenav-head",
			children: [/* @__PURE__ */ jsx("span", { children: t.categories }), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "sidenav-toggle",
				onClick: onToggle,
				"aria-label": t.collapseCats,
				"aria-controls": "blog-cat-rail",
				"aria-expanded": "true",
				children: /* @__PURE__ */ jsx(Chevron, { left: true })
			})]
		}), ["all", ...cats].map((c) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			className: `sidenav-item${value === c ? " on" : ""}`,
			"aria-pressed": value === c,
			onClick: () => onChange(c),
			children: [/* @__PURE__ */ jsx("span", { children: c === "all" ? t.all : c }), /* @__PURE__ */ jsx("span", {
				className: "cnt",
				children: count(c)
			})]
		}, c))]
	});
}
function BlogIndex({ posts, popular = [], lang, pageSize = 10 }) {
	const t = LABELS$1[lang];
	const [cat, setCat] = useState("all");
	const [catsCollapsed, setCatsCollapsed] = useState(false);
	const [q, setQ] = useState("");
	const cats = useMemo(() => Array.from(new Set(posts.map((p) => p.category))).sort((a, b) => a.localeCompare(b)), [posts]);
	useEffect(() => {
		const initial = new URLSearchParams(location.search).get("q");
		if (initial) setQ(initial);
		const onSearch = (e) => setQ(e.detail ?? "");
		document.addEventListener("tds-blog-search", onSearch);
		document.documentElement.dataset.blogLiveSearch = "true";
		return () => {
			document.removeEventListener("tds-blog-search", onSearch);
			delete document.documentElement.dataset.blogLiveSearch;
		};
	}, []);
	useEffect(() => {
		const u = new URL(location.href);
		if (q.trim()) u.searchParams.set("q", q.trim());
		else u.searchParams.delete("q");
		history.replaceState(null, "", u);
	}, [q]);
	const searching = q.trim().length > 0;
	const filtering = searching || cat !== "all";
	const featured = posts[0];
	const matches = useMemo(() => posts.filter((p) => cat === "all" ? true : p.category === cat).filter((p) => matchesQuery(p, q)), [
		posts,
		cat,
		q
	]);
	const gridPosts = filtering ? matches : matches.filter((p) => p !== featured).slice(0, pageSize - 1);
	const hasOlder = !filtering && matches.length > pageSize;
	const quoted = lang === "de" ? `„${q.trim()}“` : `“${q.trim()}”`;
	const statusMessage = searching ? `${matches.length} ${plural(t.results, matches.length)} ${quoted}` : cat !== "all" ? `${matches.length} ${plural(t.inCategory, matches.length)} ${cat}` : "";
	const GridHeading = searching ? "h1" : "h2";
	if (posts.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "tds-shell py-16 text-[var(--color-muted)] italic",
		children: t.empty
	});
	return /* @__PURE__ */ jsxs("div", {
		id: "blog-index-island",
		children: [!searching && featured && /* @__PURE__ */ jsx(HeroSlider, {
			latest: posts,
			popular,
			lang
		}), /* @__PURE__ */ jsxs("section", {
			className: "tds-shell lg:flex lg:items-start lg:gap-8",
			style: {
				paddingTop: 40,
				paddingBottom: 56
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: `hidden lg:block shrink-0 blog-cat-rail${catsCollapsed ? " is-collapsed" : ""}`,
				children: /* @__PURE__ */ jsx(CategorySidebar, {
					posts,
					cats,
					value: cat,
					onChange: setCat,
					collapsed: catsCollapsed,
					onToggle: () => setCatsCollapsed((v) => !v),
					t
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "lg:hidden mb-6 overflow-x-auto blog-cat-strip",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex gap-2 w-max",
							children: ["all", ...cats].map((c) => /* @__PURE__ */ jsx("button", {
								type: "button",
								className: `chip-flat${cat === c ? " on" : ""}`,
								onClick: () => setCat(c),
								"aria-pressed": cat === c,
								children: c === "all" ? t.all : c
							}, c))
						})
					}),
					/* @__PURE__ */ jsx("p", {
						className: "sr-only",
						role: "status",
						children: statusMessage
					}),
					searching && /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 12,
							marginBottom: 16
						},
						children: [/* @__PURE__ */ jsxs("span", {
							style: {
								fontSize: 14,
								fontWeight: 500,
								color: "var(--color-muted)"
							},
							children: [
								matches.length,
								" ",
								plural(t.results, matches.length),
								" ",
								quoted
							]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "chip-flat",
							onClick: () => setQ(""),
							children: t.clear
						})]
					}),
					/* @__PURE__ */ jsxs(GridHeading, {
						className: "display-tight",
						style: {
							fontSize: "1.625rem",
							margin: "0 0 18px",
							display: "flex",
							alignItems: "center",
							gap: 10
						},
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "head-ico",
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ jsx("rect", {
									x: "3",
									y: "3",
									width: "7",
									height: "7"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "14",
									y: "3",
									width: "7",
									height: "7"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "3",
									y: "14",
									width: "7",
									height: "7"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "14",
									y: "14",
									width: "7",
									height: "7"
								})
							]
						}), cat === "all" ? t.all : cat]
					}),
					gridPosts.length === 0 ? /* @__PURE__ */ jsx("p", {
						style: {
							padding: "48px 0",
							color: "var(--color-muted)"
						},
						children: searching ? t.noResults : t.empty
					}) : /* @__PURE__ */ jsx("div", {
						className: "tds-grid-auto",
						children: gridPosts.map((p) => /* @__PURE__ */ jsx("div", {
							className: "post-card-slot",
							children: /* @__PURE__ */ jsx(PostCard, {
								post: p,
								lang
							})
						}, p.slug))
					}),
					hasOlder && /* @__PURE__ */ jsx("nav", {
						style: {
							marginTop: 28,
							display: "flex",
							justifyContent: "flex-end"
						},
						children: /* @__PURE__ */ jsxs("a", {
							className: "btn-back",
							href: lang === "de" ? "/page/2" : "/en/page/2",
							children: [
								t.older,
								" ",
								/* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									children: "→"
								})
							]
						})
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/islands/ForYou.tsx
var COOKIE = "tds-interests";
var LABELS = {
	de: {
		eyebrow: "Für Sie",
		heading: "Weil Sie dafür gelesen haben.",
		reset: "Zurücksetzen",
		read: "Lesen →"
	},
	en: {
		eyebrow: "For you",
		heading: "Because you read about this.",
		reset: "Reset",
		read: "Read →"
	}
};
function readWeights() {
	const match = document.cookie.match(/(?:^|; )tds-interests=([^;]*)/);
	if (!match) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(match[1]));
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function topicsOf(post) {
	return [post.category, ...(post.tags ?? "").split(",")].map((t) => t.trim().toLowerCase()).filter(Boolean);
}
function ForYou({ lang, limit = 3 }) {
	const [picks, setPicks] = useState([]);
	const t = LABELS[lang];
	useEffect(() => {
		const weights = readWeights();
		if (!weights || Object.keys(weights).length === 0) return;
		fetch("/interests-index.json").then((res) => res.ok ? res.json() : null).then((all) => {
			if (!all) return;
			const scored = all.filter((p) => p.lang === lang).map((p) => ({
				post: p,
				score: topicsOf(p).reduce((sum, topic) => sum + (weights[topic] ?? 0), 0)
			})).filter((s) => s.score > 0).sort((a, b) => b.score - a.score || (b.post.publishedAt ?? "").localeCompare(a.post.publishedAt ?? "")).slice(0, limit).map((s) => s.post);
			if (scored.length > 0) setPicks(scored);
		}).catch(() => {});
	}, [lang, limit]);
	const reset = () => {
		document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
		setPicks([]);
	};
	if (picks.length === 0) return null;
	const locale = lang === "de" ? "de-DE" : "en-US";
	return /* @__PURE__ */ jsxs("aside", {
		className: "mb-14 pb-12 hairline-b",
		"aria-labelledby": "for-you-heading",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-baseline justify-between gap-3 mb-8",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "section-num mb-3",
				children: t.eyebrow
			}), /* @__PURE__ */ jsx("h2", {
				id: "for-you-heading",
				className: "display-tight text-3xl",
				children: t.heading
			})] }), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: reset,
				className: "link-underline text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer",
				children: t.reset
			})]
		}), /* @__PURE__ */ jsx("ul", {
			className: "tds-grid-auto tds-grid-roomy",
			children: picks.map((p) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
				href: `/${p.slug}`,
				className: "block group",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "eyebrow mb-2",
						children: p.category
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "display-tight text-xl mb-2 group-hover:text-[var(--color-accent)] transition-colors",
						children: p.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3 mb-3",
						children: p.excerpt
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-xs text-[var(--color-muted)] flex items-center justify-between gap-3",
						children: [p.publishedAt && /* @__PURE__ */ jsx("time", {
							className: "tabular",
							dateTime: p.publishedAt,
							children: new Date(p.publishedAt).toLocaleDateString(locale, {
								year: "numeric",
								month: "short",
								day: "2-digit"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "link-underline text-[var(--color-accent)]",
							children: t.read
						})]
					})
				]
			}) }, p.slug))
		})]
	});
}
//#endregion
//#region src/components/ToolsPromo.astro
createAstro("https://blog.tracht-digital.de");
var $$ToolsPromo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ToolsPromo;
	const { lang = "de" } = Astro.props;
	const base = lang === "de" ? TOOLS_URL : `${TOOLS_URL}/en`;
	const copy = {
		de: {
			eyebrow: "TD Tools",
			heading: "Werkzeuge, die die Kleinarbeit erledigen",
			body: "Auf unserer Werkzeugseite läuft alles direkt im Browser — nichts wird hochgeladen, nichts installiert. Die meisten Werkzeuge sind frei nutzbar; ein paar aufwendigere schaltet man einmalig frei, ohne Abo.",
			lead: "Zum Beispiel:",
			all: "Alle Werkzeuge ansehen"
		},
		en: {
			eyebrow: "TD Tools",
			heading: "Tools that handle the small jobs",
			body: "Everything on our tools site runs straight in the browser — nothing is uploaded and nothing is installed. Most tools are free to use; a few of the heavier ones are unlocked once, with no subscription.",
			lead: "For example:",
			all: "See every tool"
		}
	}[lang];
	return renderTemplate`${maybeRenderHead($$result)}<aside class="tools-promo" aria-labelledby="tools-promo-heading"><p class="tools-promo__eyebrow">${copy.eyebrow}</p><h2 id="tools-promo-heading" class="tools-promo__heading">${copy.heading}</h2><p class="tools-promo__body">${copy.body}</p><p class="tools-promo__lead">${copy.lead}</p><ul class="tools-promo__list">${[
		{
			slug: "pdf-komprimieren",
			de: "PDF komprimieren",
			en: "Compress PDF"
		},
		{
			slug: "texterkennung",
			de: "Texterkennung (OCR)",
			en: "Text recognition (OCR)"
		},
		{
			slug: "etiketten-drucken",
			de: "Etiketten drucken",
			en: "Print labels"
		},
		{
			slug: "stundenzettel",
			de: "Stundenzettel",
			en: "Timesheet"
		},
		{
			slug: "qr-code-generator",
			de: "QR-Code-Generator",
			en: "QR code generator"
		}
	].map((p) => renderTemplate`<li><a${addAttribute(`${base}/tools/${p.slug}`, "href")} class="tools-promo__link">${lang === "de" ? p.de : p.en}</a></li>`)}</ul><p class="tools-promo__all"><a${addAttribute(base, "href")} class="tools-promo__link">${copy.all}</a></p></aside>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ToolsPromo.astro", void 0);
//#endregion
export { ForYou as n, BlogIndex as r, $$ToolsPromo as t };

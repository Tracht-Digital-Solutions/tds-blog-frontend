import { a as PostCover } from "./Layout_ZXMBwXGa.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/PostCard.tsx
/** Neutral byline for a post whose author is missing (deleted user / legacy). */
function fallbackAuthorName(lang) {
	return lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial";
}
function initialsOf(name) {
	return name.split(/\s+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "TD";
}
function AuthorChip({ inverse, name = "Tracht Digital", avatarUrl }) {
	return /* @__PURE__ */ jsxs("span", {
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: 10
		},
		children: [avatarUrl ? /* @__PURE__ */ jsx("img", {
			src: avatarUrl,
			alt: "",
			width: 28,
			height: 28,
			style: {
				width: 28,
				height: 28,
				borderRadius: "50%",
				objectFit: "cover"
			},
			loading: "lazy"
		}) : /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			style: {
				width: 28,
				height: 28,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				background: inverse ? "rgba(255,255,255,.14)" : "var(--tds-flat-tint)",
				color: inverse ? "#fff" : "var(--color-primary)",
				fontSize: 11,
				fontWeight: 600,
				letterSpacing: "0.04em"
			},
			children: initialsOf(name)
		}), /* @__PURE__ */ jsx("span", {
			style: {
				fontSize: 13,
				fontWeight: 500,
				color: inverse ? "rgba(255,255,255,.78)" : "var(--color-ink)"
			},
			children: name
		})]
	});
}
function formatPostDate(publishedAt, lang) {
	if (!publishedAt) return "";
	return new Date(publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function PostCard({ post, lang, large }) {
	return /* @__PURE__ */ jsxs("a", {
		className: `post-card${large ? " post-card--large" : ""}`,
		href: `${lang === "en" ? "/en" : ""}/${post.slug}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "post-card__cover",
			children: /* @__PURE__ */ jsx(PostCover, {
				slug: post.slug,
				coverHint: post.coverHint,
				title: post.title,
				style: {
					position: "absolute",
					inset: 0,
					height: "100%"
				}
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "post-card__body",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "post-card__meta",
					children: [/* @__PURE__ */ jsx("span", {
						className: "eyebrow",
						style: { color: "var(--color-accent)" },
						children: post.category
					}), post.publishedAt && /* @__PURE__ */ jsx("time", {
						dateTime: post.publishedAt,
						className: "tabular post-card__date",
						children: formatPostDate(post.publishedAt, lang)
					})]
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "card-title",
					children: post.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "post-card__excerpt",
					children: post.excerpt
				}),
				/* @__PURE__ */ jsx("div", {
					className: "post-card__foot",
					children: /* @__PURE__ */ jsx(AuthorChip, {
						name: post.author?.name ?? fallbackAuthorName(lang),
						avatarUrl: post.author?.avatarUrl
					})
				})
			]
		})]
	});
}
//#endregion
export { formatPostDate as i, PostCard as n, fallbackAuthorName as r, AuthorChip as t };

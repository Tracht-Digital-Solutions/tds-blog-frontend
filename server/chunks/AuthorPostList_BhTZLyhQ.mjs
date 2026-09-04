import { n as PostCard } from "./PostCard_BfKijCrk.mjs";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/islands/AuthorPostList.tsx
function daysSince(publishedAt) {
	if (!publishedAt) return 1;
	const then = new Date(publishedAt).getTime();
	if (Number.isNaN(then)) return 1;
	const days = (Date.now() - then) / 864e5;
	return Math.max(1, days);
}
function trendScore(p) {
	return (p.viewCount ?? 0) / daysSince(p.publishedAt);
}
function AuthorPostList({ posts, lang }) {
	const [sort, setSort] = useState("date");
	const labels = lang === "de" ? {
		sortBy: "Sortieren",
		date: "Datum",
		views: "Aufrufe",
		trend: "Trend"
	} : {
		sortBy: "Sort by",
		date: "Date",
		views: "Views",
		trend: "Trending"
	};
	const sorted = useMemo(() => {
		const list = [...posts];
		switch (sort) {
			case "views":
				list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
				break;
			case "trend":
				list.sort((a, b) => trendScore(b) - trendScore(a));
				break;
			default: list.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
		}
		return list;
	}, [posts, sort]);
	const options = [
		{
			key: "date",
			label: labels.date
		},
		{
			key: "views",
			label: labels.views
		},
		{
			key: "trend",
			label: labels.trend
		}
	];
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		role: "group",
		"aria-label": labels.sortBy,
		style: {
			display: "flex",
			alignItems: "center",
			gap: 8,
			marginBottom: 24,
			flexWrap: "wrap"
		},
		children: [/* @__PURE__ */ jsx("span", {
			className: "eyebrow",
			style: { color: "var(--color-muted)" },
			children: labels.sortBy
		}), options.map((o) => /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setSort(o.key),
			"aria-pressed": sort === o.key,
			className: "author-sort-btn",
			"data-active": sort === o.key ? "" : void 0,
			children: o.label
		}, o.key))]
	}), /* @__PURE__ */ jsx("ul", {
		className: "tds-grid-auto list-none p-0 m-0",
		children: sorted.map((p) => /* @__PURE__ */ jsx("li", {
			className: "post-card-slot",
			children: /* @__PURE__ */ jsx(PostCard, {
				post: p,
				lang
			})
		}, p.slug))
	})] });
}
//#endregion
export { AuthorPostList as t };

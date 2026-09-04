import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { g as getPost } from "./cache_C7psdfsG.mjs";
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
//#region src/og/render.ts
/**
* OG image renderer.
*
* Satori turns a JSX/object tree into SVG; resvg-js rasterises that
* SVG to PNG. Post cards are rendered on demand and stored by the file-backed
* page cache under /og/{lang}/{slug}.png — no content build or third-party
* service is required.
*
* Editorial template (1200×630 — the LinkedIn / Twitter Card size):
*
*   ┌────────────────────────────────────────────────────────────┐
*   │                                                            │
*   │  CATEGORY                                                  │
*   │                                                            │
*   │  Title runs across as many lines as it                     │
*   │  needs, with the last word in the accent colour.           │
*   │                                                            │
*   │                                                            │
*   │  ─── Date · Author          Tracht Journal                 │
*   └────────────────────────────────────────────────────────────┘
*/
var FONT_DIR = ["assets/og-fonts", "src/og/fonts"].map((candidate) => path.join(process.cwd(), candidate)).find((candidate) => fs.existsSync(path.join(candidate, "Lato-Bold.ttf"))) ?? path.join(process.cwd(), "src/og/fonts");
var latoBold = null;
function loadFonts() {
	if (latoBold === null) latoBold = fs.readFileSync(path.join(FONT_DIR, "Lato-Bold.ttf"));
	return { lato: latoBold };
}
var PAPER = "#fafaf7";
var INK = "#1a1a17";
var PRIMARY = "#050f68";
var ACCENT = "#820933";
var MUTED = "#6b6b66";
var LINE = "#e8e6df";
/**
* Splits the title so the last word can be rendered in burgundy,
* matching the "accent word" pattern the rest of the site uses.
* Falls back to plain rendering if the title is a single word.
*/
function splitForAccent(title) {
	const trimmed = title.trim();
	const idx = trimmed.lastIndexOf(" ");
	if (idx < 0) return {
		head: "",
		accent: trimmed
	};
	return {
		head: trimmed.slice(0, idx),
		accent: trimmed.slice(idx + 1)
	};
}
async function renderOgPng(opts) {
	const { lato } = loadFonts();
	const { head, accent } = splitForAccent(opts.title);
	const locale = opts.lang === "de" ? "de-DE" : "en-US";
	const dateLabel = opts.dateLabel ? opts.dateLabel : opts.publishedAt ? new Date(opts.publishedAt).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : opts.lang === "de" ? "Entwurf" : "Draft";
	const wordmark = opts.lang === "de" ? "Tracht Digital · Journal" : "Tracht Digital · Journal";
	const svg = await satori({
		type: "div",
		props: {
			style: {
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				backgroundColor: PAPER,
				padding: "72px 80px",
				fontFamily: "Lato",
				color: INK,
				position: "relative"
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "20px"
						},
						children: [{
							type: "div",
							props: { style: {
								width: "56px",
								height: "1px",
								backgroundColor: MUTED
							} }
						}, {
							type: "div",
							props: {
								style: {
									fontFamily: "Lato",
									fontSize: "20px",
									letterSpacing: "0.16em",
									textTransform: "uppercase",
									color: MUTED
								},
								children: opts.category
							}
						}]
					}
				},
				{
					type: "div",
					props: {
						style: {
							fontFamily: "Lato",
							fontWeight: 700,
							fontSize: "78px",
							lineHeight: 1.04,
							letterSpacing: "-0.03em",
							color: PRIMARY,
							display: "flex",
							flexWrap: "wrap",
							gap: "16px",
							marginTop: "36px"
						},
						children: [head ? {
							type: "span",
							props: { children: head }
						} : null, {
							type: "span",
							props: {
								style: { color: ACCENT },
								children: accent
							}
						}].filter(Boolean)
					}
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderTop: `1px solid ${LINE}`,
							paddingTop: "32px",
							fontFamily: "Lato",
							fontSize: "22px",
							color: MUTED
						},
						children: [{
							type: "div",
							props: {
								style: {
									display: "flex",
									gap: "16px"
								},
								children: [
									{
										type: "span",
										props: { children: dateLabel }
									},
									{
										type: "span",
										props: {
											style: { color: LINE },
											children: "·"
										}
									},
									{
										type: "span",
										props: { children: opts.author ?? (opts.lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial") }
									}
								]
							}
						}, {
							type: "span",
							props: {
								style: {
									fontFamily: "Lato",
									fontWeight: 700,
									fontSize: "24px",
									color: INK
								},
								children: wordmark
							}
						}]
					}
				}
			]
		}
	}, {
		width: 1200,
		height: 630,
		fonts: [{
			name: "Lato",
			data: lato,
			weight: 700,
			style: "normal"
		}]
	});
	return new Resvg(svg, { fitTo: {
		mode: "width",
		value: 1200
	} }).render().asPng();
}
//#endregion
//#region src/pages/og/[lang]/[slug].png.ts
var _slug__png_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Per-post OG image. The endpoint receives lang + slug from the route params
* and produces the PNG via the shared renderer.
*
* The image is referenced from Layout.astro's og:image meta as
* `${site}/og/{lang}/{slug}.png`.
*/
var GET = async ({ params }) => {
	const lang = params.lang === "en" ? "en" : "de";
	const slug = params.slug;
	if (typeof slug !== "string" || slug === "") return new Response("Not found", { status: 404 });
	const post = await getPost(slug, lang);
	if (!post) return new Response("Not found", { status: 404 });
	const png = await renderOgPng({
		title: post.title,
		category: post.category,
		publishedAt: post.publishedAt,
		lang,
		author: post.author?.name ?? null
	});
	return new Response(new Uint8Array(png), {
		status: 200,
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=0, must-revalidate"
		}
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/og/[lang]/[slug].png@_@ts
var page = () => _slug__png_exports;
//#endregion
export { page };

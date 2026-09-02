/**
 * Render the site-wide default social card to `public/og-default.png`.
 *
 * `Layout.astro` names `/og-default.png` as the `og:image` of every page that
 * is not an article — both home pages, tag, category, author, pagination,
 * `/aktuelles`, `/rss` — complete with `og:image:width/height/alt` claiming a
 * 1200×630 image. The file never existed. Nothing failed: a missing OG image
 * produces no error anywhere in the build, no warning in the browser and no
 * broken layout. It only shows up as a share preview with an empty box, which
 * is exactly where nobody looks.
 *
 * The output is COMMITTED rather than generated during the build, because
 * `/og/[lang]/[slug].png` is rendered on demand by the server while this one
 * has to be a plain static file under `public/`.
 *
 * Run: `npm run og:default` (only needed when the wording or the card design
 * changes).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderOgPng } from "../src/og/render.ts";

const out = path.join(fileURLToPath(new URL("..", import.meta.url)), "public", "og-default.png");

// German: the blog's default locale, and the card is one file for both trees.
// No date — see `OgOptions.dateLabel`; a generic card must not claim one.
const png = await renderOgPng({
  title: "Digitalisierung, die zu Ihrem Betrieb passt.",
  category: "TDS Journal",
  publishedAt: null,
  lang: "de",
  dateLabel: "Schwarzenbek bei Hamburg",
  author: "Tracht Digital Solutions",
});

fs.writeFileSync(out, png);
// eslint-disable-next-line no-console
console.log(`✓ wrote ${out} (${(png.length / 1024).toFixed(1)} KB)`);

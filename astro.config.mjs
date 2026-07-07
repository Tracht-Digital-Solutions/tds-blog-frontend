import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the .brand-header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";

export default defineConfig({
  site: "https://blog.tracht-digital.de",
  output: "static",
  integrations: [
    react(),
    sitemap({
      // Content pages only: drop the generated OG PNGs, JSON endpoints and
      // error pages. NO `i18n` option here (unlike the landingpage) — blog
      // routes don't mirror by prefix (/kategorie vs /en/category, per-language
      // tag sets and page counts), so prefix-derived alternates would point
      // at 404s. Post-level hreflang lives in the Layout <head> instead.
      filter: (page) =>
        !page.includes("/og/") &&
        !page.endsWith(".png") &&
        !page.includes("interests-index.json") &&
        !page.includes("/print") &&
        !page.includes("/404") &&
        !page.includes("/500"),
    }),
  ],
  vite: {
    build: { ...tdsViteBuild },
  },
  // Pin sharp explicitly so every `<Image />` consumer gets the
  // same WebP/AVIF defaults the IMAGES.md guide documents.
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  trailingSlash: "ignore",
  build: {
    format: "directory",
    // Inline small stylesheets into <head> so the critical CSS
    // ships in the initial HTML — eliminates the round-trip for
    // a separate .css file before paint.
    inlineStylesheets: "auto",
  },
});

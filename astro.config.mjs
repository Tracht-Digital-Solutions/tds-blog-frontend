import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the .brand-header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";

export default defineConfig({
  site: "https://blog.tracht-digital.de",
  output: "static",
  integrations: [react(), sitemap()],
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

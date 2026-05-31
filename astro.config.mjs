import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://blog.tracht-digital.de",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Squeeze a few more bytes out of the production CSS bundle
      // than the default esbuild minifier — relevant because the
      // blog ships one CSS file across every static post.
      cssMinify: "lightningcss",
    },
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

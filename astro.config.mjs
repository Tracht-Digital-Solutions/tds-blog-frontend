import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://blog.tracht-digital.de",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    build: {
      // Squeeze a few more bytes out of the production CSS bundle
      // than the default esbuild minifier — relevant because the
      // blog ships one CSS file across every static post.
      cssMinify: "lightningcss",
      // The lightningcss minify step derives its prefixing targets
      // from `cssTarget` (it ignores `css.lightningcss.targets`).
      // Without this pin it ships the shared `.brand-header`
      // `backdrop-filter` unprefixed-only, so the frosted header blur
      // breaks in Safari (needs `-webkit-`). Pinning a Safari target
      // makes lightningcss add the prefix while keeping the standard
      // property for Firefox/Chrome. See tds-shared#10.
      cssTarget: ["chrome90", "edge90", "firefox103", "safari15"],
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

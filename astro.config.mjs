import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
// Shared CSS minify settings (incl. the cssTarget that keeps lightningcss
// from dropping the .brand-header backdrop-filter prefix). See tds-shared#10.
import { tdsViteBuild } from "@tracht-digital-solutions/tds-shared/astro";

export default defineConfig({
  site: "https://blog.tracht-digital.de",

  // ─── Server-rendered, behind a file-backed page cache ───────────────────
  //
  // This site used to be a static build, and that build was the ONLY cache
  // between the CMS database and a reader: correcting a typo in one article
  // meant rebuilding every page, re-running the DeepL translations and
  // re-rendering one OG card per post. Now an article renders on demand and
  // the result is stored as a plain file the web server hands out directly —
  // a hit costs exactly what the static file cost — and a correction costs one
  // page render, triggered per article from the admin panel.
  //
  // Consequence for every dynamic route: `getStaticPaths` is not allowed on an
  // on-demand route. The twelve of them read `Astro.params` and answer 404
  // themselves; the corpus queries they used to inline live in src/lib/routes.ts.
  output: "server",
  adapter: node({
    mode: "standalone",
    // The cache writer needs a complete body before it can store a page.
    experimentalDisableStreaming: true,
  }),
  integrations: [
    react(),
    // @astrojs/sitemap is deliberately gone. It derives its entries from the
    // routes the build EMITS, and under `output: "server"` the articles,
    // taxonomy pages and archive pages are not emitted — it would have shipped
    // a sitemap holding only /install and the error pages it used to filter
    // out, with nothing red anywhere. src/pages/sitemap-*.xml.ts replaces it:
    // server-rendered from the corpus, and cached like any other page.
  ],
  vite: {
    build: { ...tdsViteBuild },
    ssr: {
      // Bundle first-party and pure-JS packages INTO dist/server, so the host
      // never needs a GitHub Packages token to boot. Enumerated rather than
      // `noExternal: true`, which drags in CJS-only packages and fails the
      // Rollup pass with a message that points nowhere near the cause.
      //
      // The rule of thumb, learned on the sibling sites: bundle a leaf, ship a
      // tree. A package with its own dependency tree costs one failed build
      // per transitive name if you bundle it; as a runtime dependency npm
      // resolves the tree in one step.
      noExternal: [
        /^@tracht-digital-solutions\//,
        // NOTE @astrojs/rss is deliberately NOT bundled: it pulls a small
        // tree of XML packages, and adding them one at a time is a rebuild per
        // name. It is a public-registry package, so it ships in
        // tds.release.runtimeDependencies instead and npm resolves its
        // transitives. Bundle a leaf; ship a tree.
        "marked",
        // Pinned to the grammars actually used — see shikiConfig. Bundling
        // every grammar would add megabytes to the server chunk.
        "shiki",
        "zod",
      ],
      // Native addons cannot be bundled.
      external: ["sharp", "@resvg/resvg-js", "satori"],
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

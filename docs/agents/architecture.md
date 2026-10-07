# Architecture

## How a published article reaches a reader

Not through a repository build. An article renders on demand and the result is stored as a plain file that
`public/.htaccess` serves directly. A cache hit is as fast as a static build because it is the same thing: a file
on disk, served by Apache, with Node asleep. Saving in the panel rebuilds exactly the pages that article dates: its
page, its print view, the index, the archive, its category, each tag, its author page, the feed, the "Für dich"
index and the sitemaps. A manual release still ships **code and design**.

| Where | What |
|---|---|
| `src/lib/cache.ts` | Which pages a content change dates; the shared `contentCache` memo; `SITEMAP_PATHS` |
| `src/lib/routes.ts` | Corpus queries for the dynamic routes |
| `src/lib/pageCache.ts` | The single `pageCache(...)` instance |
| `src/middleware.ts` | Serves hits, stores renders, refuses to store a bad-site-key render |
| `src/pages/tds/cache/[action].ts` | Control plane: `status`, `rebuild`, `purge` |
| `src/lib/sitemap.ts`, `sitemapSections.ts`, `sitemapExclusions.ts` | Sitemaps from the corpus; panel exclusions |
| `public/.htaccess` | Cache-first rewrite; ships to `dist/client/.htaccess`, the document root |
| `app.cjs`, tds-shared's `scripts/pack-release.mjs` (postbuild) | Passenger startup file and the release tree |

## Routes

- **No `getStaticPaths` on on-demand routes.** The dynamic routes read `Astro.params` and answer 404 themselves; a
  missing category, tag or author is a **404, not an empty page**.
- **The OG route keeps `getStaticPaths` and stays prerendered**: it pulls satori + `@resvg/resvg-js` (native) and
  `src/og/render.ts` anchors fonts to `process.cwd()`. An article published after the last deploy uses the default
  card until the next deploy.
- `src/pages/interests-index.json.ts` serves the post index for "Für dich".

## Things that cost time to find

- **`.htaccess` may only set `Options -Indexes`.** Plesk's restricted `AllowOverride` omits `FollowSymLinks`, and a
  disallowed option makes Apache answer every request with 500. If a cache hit ever answers 403, grant at the vhost
  level (*Additional Apache directives*). `.htaccess` also compresses (mod_deflate, `IfModule`).
- **The control plane can't be middleware** (Astro doesn't run middleware for unmatched paths) and can't live under
  `_cache/` (segments starting with `_` are excluded from routing).
- **A POST to it needs `Content-Type: application/json`**, or `security.checkOrigin` rejects it as a cross-site form.
- **Every module-level memo becomes permanent under SSR.** `content-api.ts` (ads, snippets) and `taxonomy.ts` go
  through `contentCache`, which a rebuild invalidates. `translate.ts` is the exception (its key contains the source
  text) and has a size ceiling.
- **`listAllPosts` must stay unmemoised.** The control plane resolves a rebuild's page list **before** invalidating
  the memo; memoised, a newly published article wouldn't be found and its taxonomy pages wouldn't rebuild.
- **The cookie banner and AdSense config are one fetch** (`landingBlocks()` over `/content/landing?lang=de`). A
  reachable API answering 404/5xx is remembered as `null`; a transport failure or rejected key throws, so one hiccup
  can't pin "off". `content-api.test.ts` pins the call counts.
- **Bundle a leaf; ship a tree.** `@astrojs/rss` ships in `tds.release.runtimeDependencies` instead of being bundled.
- **All CSS is inlined** (`build.inlineStylesheets: "always"`). A linked `/_astro/<hash>.css` disappears with the
  next deploy, and pages rendered before it (cache entries, open tabs, prefetched documents, offline copies) then
  paint unstyled.

## Data layer (`src/lib/content-api.ts`)

- The client for the composed content API; `CONTENT_API_URL` overrides the base. Reads go through
  `readContentJson` (`src/lib/contentFetch.ts`) and carry the site key.
- Cover and avatar URLs are made absolute at the data layer (`resolveCoverHint`, `resolveAvatar`): stored
  `/uploads/...` paths get the API base before any `startsWith("http")` check.
- `listTopics(lang)` feeds `/aktuelles`; `blogSnippets()` feeds block embeds.
- **Demo posts only on a connection failure** (`isConnectionFailure`). A reachable API answering 5xx fails the render,
  and a failed render is never cached. A reachable API with zero posts stays empty.

## Translation

Every post exists in DE and EN (`src/pages/[slug].astro`, `src/pages/en/[slug].astro`, both wrappers over
`Article.astro`). `resolveLocalizedPost(slug, lang)` (`src/lib/localizedPost.ts`) returns the authored version, a
stored machine-translated counterpart (the CMS creates those on save, flagged `machineTranslated`), or, as a
fallback, a DeepL translation via `src/lib/translate.ts` (title and excerpt as text, HTML with `tag_handling=html` so
code stays verbatim). A translated page shows a "machine-translated" notice. With `DEEPL_API_KEY` unset or on any API
error, the authored language renders.

## Site key (`TDS_SITE_KEY`)

Issued under *Einstellungen → Site-Verbindungen*; `src/lib/siteKey.ts` reads it and every fetch carries it. Optional.

- **`process.env`, never `import.meta.env`** (only `PUBLIC_*` is inlined; a `PUBLIC_` prefix would ship it).
- **A rejected key renders a valid page of fallbacks.** `assertKeyAccepted` counts rejections on `globalThis`, and the
  middleware refuses to store any page whose render grew the counter.
- **Never memoise a failed read.** `memoisedOr` remembers successes only.
- Shop products live under `/content/shop`; a key **scoped** to `/content/blog` is rejected there (see
  [content-integrations.md](content-integrations.md#if-embedded-products-render-blank)).

## Build pipeline and toolchain

- Tailwind runs through `@tailwindcss/postcss` (`postcss.config.mjs`), never the Vite plugin: one PostCSS setup across
  all Astro apps, asserted by `tds-auth-frontend`'s `static-posture.test.ts`. Changing it is a workspace decision.
- CSS minification uses tds-shared's `tdsViteBuild` preset; don't hand-author `cssTarget` (it keeps
  `-webkit-backdrop-filter` for Safari ≤ 17).
- Sharp is the image service (`<Image />` emits WebP/AVIF; see `IMAGES.md`). `<head>` preconnects to
  `api.tracht-digital.de` and `tracht-digital.de`. Body and display fonts are preloaded.
- Toolchain: TypeScript 6, vitest 4, jsdom 30, Astro 7, shiki 4, satori 0.33 (shared with the other public sites).
  TypeScript 7 is unavailable (`@astrojs/check` peer range).
- tds-shared is a 0.x caret (minor-locked): repin explicitly and verify with a fresh `npm install --no-package-lock`.
- **Under TS 6 a side-effect import needs a typed target:** import `@fontsource-variable/plus-jakarta-sans/index.css`,
  not the bare specifier (`ts(2882)`). Keep the `/index.css` suffix.
- `tsconfig.json` excludes `release/` and `var/` (generated bundles).
- `@testing-library/jest-dom` is deliberately absent.

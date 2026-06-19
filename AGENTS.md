# Agent notes — tds-blog

Astro 6 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.
Self-hosted Instrument Serif + Geist; the editorial type vocabulary
(`.display`, `.section-num`, `.marginalia`, …) comes from
`@tracht-digital-solutions/tds-shared` (`styles/base.css` +
`styles/app.css`), shared with the portals.

**Surface design: flat/"kantig"** (from the Tracht design-system
handoff, 2026-06): no border radii or hairline cards — separation via
colour blocks (`--color-soft`), fixed dark panels (hero, newsletter,
footer) on the `--color-surface-*` tokens so dark mode never inverts
them. The flat vocabulary (`.post-card`, `.post-row`, `.sidenav`,
`.toc`, `.btn-flat`, `.btn-back`, `.sec-head`/`.sec-body`,
`.blog-sidebar`/`.with-sidebar`, `.nav-search`, `.lang-toggle`) and the
brand-aware `.prose-article` long-form class live in
`src/styles/global.css`. The design bundle's Google-font substitutes
(Hanken Grotesk etc.) were deliberately NOT adopted — Instrument Serif
+ Geist stay canonical.

## Build pipeline

Tailwind runs through `@tailwindcss/postcss` (configured in
`postcss.config.mjs`), **not** the `@tailwindcss/vite` plugin —
Astro 6 ships Vite 7 with rolldown and the Vite plugin's build
hook calls `BindingViteResolvePluginConfig` with a shape missing
`tsconfigPaths` (withastro/astro#16542). Don't add `@tailwindcss/vite`
back. CSS minification routes through lightningcss, configured via the
shared `tdsViteBuild` preset spread into `vite.build` (from
`@tracht-digital-solutions/tds-shared/astro`, tds-shared 0.4.0). Don't
hand-author the `cssTarget` — the preset pins the Safari floor that keeps
lightningcss emitting `-webkit-backdrop-filter` on the frosted
`.brand-header`; without it the blur silently dies in Safari ≤17
(tds-shared#10). Small stylesheets inline into the initial HTML via
`build.inlineStylesheets: "auto"`.
Sharp is pinned as the image service so `<Image />` consumers auto-
emit WebP/AVIF — see `IMAGES.md` for the per-asset swap pattern and
favicon bundle. `<head>` preconnects to `api.tracht-digital.de` and
`tracht-digital.de` so cross-origin fetches don't pay the full TLS
handshake.

## Page chrome

* **Favicon** — `public/favicon.png` (901 × 901) is the real TDS
  logomark, shared verbatim with tds-landingpage / admin / customer
  so the four properties read as one identity. The favicon bundle
  table in IMAGES.md documents the optional full set (ICO,
  apple-touch-icon, PWA icons) if you ever want it.
* **Dark mode** — `data-theme="dark"` theme shared with the other
  three frontends. A no-flash inline script in `Layout.astro` sets
  `data-theme` on `<html>` from the `tds-theme` localStorage key (or
  the OS `prefers-color-scheme` fallback); the `ThemeToggle` island
  flips and persists it. Tokens live in `src/styles/global.css`: the
  structural tokens flip, while fixed dark surfaces use
  `--color-surface-navy/-accent/-ink` and elevated/glass surfaces use
  `--color-card`. The dark ground is a deep-navy family with warm
  ivory text — keep new dark surfaces in that family.
* **Dynamic document.title** — Layout-level inline script at the
  bottom of `<body>` observes every `<section id="…">` and
  prefixes the tab title with the section name as the user scrolls
  past it. No-ops on single-post layouts (most blog pages today)
  — kept for parity with the other frontends.

## How rebuilds get triggered

When a post is published in `tds-admin`, the admin posts to
`tds-content-api`, which is meant to fire a `workflow_dispatch`
against this repo's deploy workflow so the build picks up the
new post. The dispatch call isn't wired yet — tracked as
`tds-content-api#3`. Until then, rebuilds run on push to `main`
in this repo only.

## Status

- `src/pages/index.astro` + `src/pages/en/index.astro` — design-system
  index: featured-post hero (fixed navy), category sidebar with post
  counters (collapsible), flat card grid, live full-text search —
  all in the `BlogIndex` island (posts baked in as build-time props,
  filtering is client-side only; `?q=` round-trips in the URL). The
  nav search field (JournalHeader) drives it via `tds-blog-search`
  CustomEvents; on non-index pages Enter navigates to `/?q=…`.
  Hero + 9 grid cards mirror page 1 of the static pagination
- `src/components/PostCard.tsx` + `Covers.tsx` — flat card + the six
  abstract brand-geometry covers (slug-hashed variant; photo cover
  when `coverHint` is an http URL). Also rendered statically (no
  hydration) inside `RelatedArticles.astro`
- `src/components/islands/NewsletterSignup.tsx` — newsletter block in
  the footer; posts a well-formed message to tds-contact-api (no
  dedicated newsletter backend — Julian gets a signup mail)
- `src/components/ArticleSidebar.astro` — fixed collapsible left nav
  on article pages (lg+ only; small screens keep the top nav via the
  `sidebar` Layout prop). Collapsed = 64px icon rail, CTA becomes a
  phone icon; state persists in localStorage `tds-blog-sidenav`
- `src/lib/sections.ts` — splits rendered article HTML at h2
  boundaries for the collapsible sections + scrollspy TOC on
  `[slug].astro` (TOC renders only with ≥2 sections)
- `src/pages/page/[num].astro` + `src/pages/en/page/[num].astro` — pages 2..N
- `src/pages/[slug].astro` — article (both DE + EN via the lang prop
  from getStaticPaths); drop-cap on first paragraph, marginalia rail
  with date / reading time / author, RelatedArticles strip, reading-
  progress bar, chronological prev/next footer nav, and the inline
  interest-cookie script (see below)
- `src/pages/og/[lang]/[slug].png.ts` — build-time per-post OG image
  via the renderer in `src/og/render.ts` (Satori → Resvg)
- `src/pages/rss.xml.ts` — RSS feed
- `src/components/RelatedArticles.astro` — 3-card same-category strip
  with fallback to most-recent overall (links `/{slug}` for BOTH
  languages — there is no `/en/[slug]` route)
- `src/pages/interests-index.json.ts` — build-time static JSON index
  of all posts (slug/lang/category/title/excerpt/tags/publishedAt)
  for the recommendations island
- `src/components/islands/ForYou.tsx` — "Für dich" strip on the DE/EN
  index pages. Reads the `tds-interests` cookie (topic → weight map,
  written by an inline script on every article page from category +
  tags; 180 days, SameSite=Lax, capped at 12 topics), fetches the
  static interests-index.json (never the content-api), scores by
  topic overlap + recency, renders top 3 with a transparency note and
  a reset action. Renders nothing without a profile.
- `src/components/JournalHeader.astro` / `JournalFooter.astro` — chrome
- `src/components/BlogPostCard.astro` — list-item component (editorial-grid)
- `src/lib/content-api.ts` — build-time fetch client (cursor-paginated)
- `src/lib/pagination.ts` — page-window slicing
- `src/lib/seo.ts` — org/person identity (mirrors tds-landingpage)
- `src/lib/jsonld.ts` — Schema.org generators (BlogPosting, Blog,
  WebSite, BreadcrumbList)
- `src/components/JsonLd.astro` — head-injected ld+json utility
- `src/og/render.ts` — Satori + Resvg renderer; fonts under `src/og/fonts/`
- `public/robots.txt` + `public/llms.txt` — discovery files for
  search + AI crawlers
- `scripts/og-smoke.ts` — `npm run og:smoke` for OG regression checks

Markdown rendering uses `set:html` directly. Bodies are admin-only
today — if user-generated content ever ships, sanitise via DOMPurify
or similar.

## Open

- (nothing tracked here right now — check the GitHub issues)

## SEO + structured data

Layout.astro renders the per-page meta (canonical, hreflang,
OG with image dimensions, Twitter Card, `article:modified_time`,
theme-color) and passes through an optional `jsonLd` prop.

- `[slug].astro` emits `BlogPosting` (with author, publisher,
  image, wordCount, inLanguage, datePublished, dateModified) +
  `BreadcrumbList` (Home → category → post).
- Index pages (DE + EN, both page 1 and `/page/[num]`) emit
  `WebSite` + `Blog` graph.
- Organization + Person `@id`s are anchored on `tracht-digital.de`
  (the marketing origin), so this site references them by `@id`
  rather than redefining them.

When updating identity in tds-landingpage (street/phone/socials,
issues #5/#6/#7 over there), mirror the change in `src/lib/seo.ts`
here so the Organization graph stays consistent across both
domains.

## Don't (additions)

- Don't import the OG renderer from a runtime React island —
  Satori + Resvg pull in native deps and are build-time only.
- Don't drop the TTFs from `src/og/fonts/`. They're OFL-licensed
  and committed deliberately because @fontsource-variable ships
  woff2 only, which Satori can't read.
- Don't redefine Organization or Person nodes here — the marketing
  site is the canonical home for those.
- Don't delete `src/types/shared-augment.d.ts` until tds-shared
  ships `BlogPost.tags` and we bump the dep. The installed
  `@tracht-digital-solutions/tds-shared@0.4.0` `BlogPost` type
  is missing the field that the content-api already returns and
  `TagList` already renders. The augmentation patches it
  locally; tracked in tds-shared#8.
- Don't write `WithContext<object>` on Schema.org node builders.
  TypeScript treats `object` as too narrow to accept additional
  named property literals (`@type`, `@graph`), and the type-check
  fails with "Object literal may only specify known properties".
  The alias now defaults the generic to `Record<string, unknown>`
  — just write `WithContext` (no explicit type argument).

## Don't

- Don't fetch posts at runtime. SSG only.
- Don't import `marked` in a React island — it's heavy. Render to
  HTML at build time and pass the resulting string to islands if
  they need it.

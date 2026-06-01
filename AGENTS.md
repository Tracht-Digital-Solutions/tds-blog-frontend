# Agent notes — tds-blog

Astro 6 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.
Self-hosted Fraunces (opsz axis) + Geist; editorial design vocabulary
shared with the portals (`.display`, `.section-num`, `.editorial-grid`,
`.marginalia`, plus a brand-aware `.prose-article` long-form class).

## Build pipeline

Tailwind runs through `@tailwindcss/postcss` (configured in
`postcss.config.mjs`), **not** the `@tailwindcss/vite` plugin —
Astro 6 ships Vite 7 with rolldown and the Vite plugin's build
hook calls `BindingViteResolvePluginConfig` with a shape missing
`tsconfigPaths` (withastro/astro#16542). Don't add `@tailwindcss/vite`
back. CSS minification routes through lightningcss; small stylesheets
inline into the initial HTML via `build.inlineStylesheets: "auto"`.
Sharp is pinned as the image service so `<Image />` consumers auto-
emit WebP/AVIF — see `IMAGES.md` for the per-asset swap pattern and
favicon bundle. `<head>` preconnects to `api.tracht-digital.de` and
`tracht-digital.de` so cross-origin fetches don't pay the full TLS
handshake.

## How rebuilds get triggered

When a post is published in `tds-admin`, the admin posts to
`tds-content-api`, which is meant to fire a `workflow_dispatch`
against this repo's deploy workflow so the build picks up the
new post. The dispatch call isn't wired yet — tracked as
`tds-content-api#3`. Until then, rebuilds run on push to `main`
in this repo only.

## Status

- `src/pages/index.astro` + `src/pages/en/index.astro` — page 1 (10 newest)
- `src/pages/page/[num].astro` + `src/pages/en/page/[num].astro` — pages 2..N
- `src/pages/[slug].astro` — article (both DE + EN via the lang prop
  from getStaticPaths); drop-cap on first paragraph, marginalia rail
  with date / reading time / author, RelatedArticles strip
- `src/pages/og/[lang]/[slug].png.ts` — build-time per-post OG image
  via the renderer in `src/og/render.ts` (Satori → Resvg)
- `src/pages/rss.xml.ts` — RSS feed
- `src/components/RelatedArticles.astro` — 3-card same-category strip
  with fallback to most-recent overall
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

- Tag filtering UI — issue #6 (content-api `?tag=` filter is in)
- Code block syntax highlighting (Shiki) — issue #5

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
  `@tracht-digital-solutions/tds-shared@0.1.0` `BlogPost` type
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

# Agent notes — tds-blog

Astro 5 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.
Self-hosted Fraunces (opsz axis) + Geist; editorial design vocabulary
shared with the portals (`.display`, `.section-num`, `.editorial-grid`,
`.marginalia`, plus a brand-aware `.prose-article` long-form class).

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
- `src/og/render.ts` — Satori + Resvg renderer; fonts under `src/og/fonts/`
- `scripts/og-smoke.ts` — `npm run og:smoke` for OG regression checks

Markdown rendering uses `set:html` directly. Bodies are admin-only
today — if user-generated content ever ships, sanitise via DOMPurify
or similar.

## Open

- Tag filtering UI — issue #6 (content-api `?tag=` filter is in)
- Code block syntax highlighting (Shiki) — issue #5

## Don't (additions)

- Don't import the OG renderer from a runtime React island —
  Satori + Resvg pull in native deps and are build-time only.
- Don't drop the TTFs from `src/og/fonts/`. They're OFL-licensed
  and committed deliberately because @fontsource-variable ships
  woff2 only, which Satori can't read.

## Don't

- Don't fetch posts at runtime. SSG only.
- Don't import `marked` in a React island — it's heavy. Render to
  HTML at build time and pass the resulting string to islands if
  they need it.

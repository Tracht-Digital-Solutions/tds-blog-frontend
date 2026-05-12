# Agent notes — tds-blog

Astro 5 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.

## How rebuilds get triggered

When a post is published in `tds-admin`, the admin posts to
`tds-content-api`, which is meant to fire a `workflow_dispatch`
against this repo's deploy workflow so the build picks up the
new post. The dispatch call isn't wired yet — tracked as
`tds-content-api#3`. Until then, rebuilds run on push to `main`
in this repo only.

## Status

- `src/pages/index.astro` — page 1 (10 newest)
- `src/pages/page/[num].astro` — pages 2..N
- `src/pages/[slug].astro` — post detail, OG + canonical + hreflang
- `src/pages/rss.xml.ts` — RSS feed
- `src/components/BlogPostCard.astro` — list-item component
- `src/lib/content-api.ts` — build-time fetch client (cursor-paginated)
- `src/lib/pagination.ts` — page-window slicing

Markdown rendering uses `set:html` directly. Bodies are admin-only
today — if user-generated content ever ships, sanitise via DOMPurify
or similar.

## Open

- Tag filtering UI — issue #6 (content-api `?tag=` filter is in)
- Code block syntax highlighting (Shiki) — issue #5

## Don't

- Don't fetch posts at runtime. SSG only.
- Don't import `marked` in a React island — it's heavy. Render to
  HTML at build time and pass the resulting string to islands if
  they need it.

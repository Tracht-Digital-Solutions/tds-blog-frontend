# Agent notes — tds-blog

Astro 5 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.

## How rebuilds get triggered

When a post is published in `tds-admin`, the admin posts to
`tds-content-api`, which then fires a `workflow_dispatch` against
this repo's deploy workflow. That kicks off a new build with the
just-published post included. **Check `tds-content-api`'s post-create
action for the dispatch call.** TODO: implement that hook.

## Status

Scaffolded with:
- `src/pages/index.astro` — paginated list (currently fetches all)
- `src/pages/[slug].astro` — markdown render via `marked`
- `src/pages/rss.xml.ts` — RSS feed
- `src/lib/content-api.ts` — build-time fetch client

Markdown rendering currently uses `set:html` directly. The legacy
app uses the same approach behind admin auth; if blog post bodies
ever accept user-generated content, sanitise via DOMPurify or
similar.

## TODO

- [ ] BlogPostCard component port (currently inline in index.astro)
- [ ] Pagination UI (cursor-based, matching content-api)
- [ ] Tag filtering (depends on content-api adding tags)
- [ ] OpenGraph meta tags per post
- [ ] Consider syntax highlighting for code blocks (shiki)

## Don't

- Don't fetch posts at runtime. SSG only.
- Don't import `marked` in a React island — it's heavy. Render to
  HTML at build time and pass the resulting string to islands if
  they need it.

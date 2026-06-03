# tds-blog

> **Setting this up from scratch?** See [`INSTALL.md`](INSTALL.md) for
> the step-by-step bring-up (Packages auth → npm install → OG fonts
> → env → dev → og:smoke → build → manual deploy). This README
> documents the routing, structure and OG image generator.

---


Public blog at `blog.tracht-digital.de`. **Astro 5** SSG + **Tailwind v4**
with self-hosted **Instrument Serif + Geist** and the shared editorial
design system from **tds-shared**. Every post is fetched from
**`tds-content-api`** at build time
and rendered to static HTML — no runtime API calls, no client-side data
fetching. Each post also gets a per-post **OG preview image** rendered
at build time via Satori + Resvg.

Discovery surface includes Schema.org JSON-LD (`BlogPosting` with
author, publisher, image, wordCount, datePublished, dateModified;
`BreadcrumbList` on every post; `Blog` + `WebSite` on every index),
canonical URLs, hreflang DE/EN/x-default, OG with image dimensions,
Twitter Card, RSS, `robots.txt` with explicit allow-list for AI
crawlers (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
Google-Extended, etc.) and an `llms.txt` directory file. The
Organization + Person `@id`s are anchored on `tracht-digital.de`
so search engines stitch both domains into one entity graph.
See `AGENTS.md` for the layout.

---

## Quick start

```bash
export NPM_TOKEN=ghp_yourClassicPATWithReadPackagesScope
npm install         # honors the committed package-lock.json
npm run dev         # http://localhost:4321 — fetches against production content-api
```

For manual deploy, see [Manual deploy](#manual-deploy).

---

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 20 LTS or 22 LTS | Astro 5 baseline |
| npm | 10+ | Bundled with Node 20 |

### GitHub Packages authentication

`@tracht-digital-solutions/tds-shared` lives on GitHub Packages.
Classic PAT with `read:packages` scope required. Either:

```ini
# ~/.npmrc
@tracht-digital-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_yourPAT
```

…or set `NPM_TOKEN` in the environment — the repo's `.npmrc`
references it.

---

## Scripts

```bash
npm run dev          # Astro dev server with HMR (port 4321)
npm run build        # → dist/ static HTML + per-post /og/{lang}/{slug}.png
npm run preview      # serve dist/ to verify production build
npm run type-check   # astro check
npm run og:smoke     # render two fixture OG images to scripts/og-smoke-*.png
```

---

## Manual deploy

Auto-SFTP to netcup was removed. The repo now ships
`.github/workflows/build.yml` which only builds + force-pushes
`dist/` to an orphan `build` branch. Deploy from there by hand:

```bash
# 1. Build
npm run build

# 2. SFTP contents of dist/ to netcup at
#    ~/sites/blog.tracht-digital.de/releases/<TIMESTAMP>/

# 3. Activate by hitting
#    https://blog.tracht-digital.de/install.php?action=install-static
#        &target=blog.tracht-digital.de
#        &release=<TIMESTAMP>&token=<INSTALL_TOKEN>
```

---

## Pointing at a local content-api

By default, build fetches against
`https://api.tracht-digital.de/content`. Override:

```bash
# .env or .env.local
CONTENT_API_URL=http://localhost:8001
```

If the API is unreachable at build time the build still succeeds — the
list page and `/[slug]` paths simply skip (graceful fallback). Once
the API is back up, re-run `npm run build` and the pages come back.

---

## Rebuild-on-publish hook

When `tds-admin` publishes a post, `tds-content-api` should fire a
`workflow_dispatch` against this repo's `build.yml` so the blog
rebuilds with the new post (which will then appear on the `build`
branch ready for manual deploy). Implementation lives in
[`tds-content-api#3`](https://github.com/Tracht-Digital-Solutions/tds-content-api/issues/3)
(still pending).

---

## Pages

All pages share `JournalHeader.astro` + `JournalFooter.astro`
(wordmark + cross-links to main site, customer portal, RSS).

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | DE index — page 1 of the journal (newest 10) |
| `/page/[num]` | `src/pages/page/[num].astro` | DE pages 2..N |
| `/[slug]` | `src/pages/[slug].astro` | Article page (DE + EN both routed through here via `lang` prop); drop-cap on first paragraph, marginalia rail with date + reading time + author, and a `RelatedArticles` strip at the bottom |
| `/en/` | `src/pages/en/index.astro` | EN index — mirror of the DE index against `listAllPosts("en")` |
| `/en/page/[num]` | `src/pages/en/page/[num].astro` | EN pagination |
| `/og/[lang]/[slug].png` | `src/pages/og/[lang]/[slug].png.ts` | Per-post OG preview image, 1200×630, rendered at build time |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS 2.0 feed |
| `/sitemap-index.xml` | `@astrojs/sitemap` | Auto-generated |

---

## Project structure

```
src/
├── components/
│   ├── BlogPostCard.astro          # list-item: editorial-grid title + date marginalia
│   ├── JournalHeader.astro
│   ├── JournalFooter.astro
│   ├── JsonLd.astro                # Inline <script type="application/ld+json"> utility
│   └── RelatedArticles.astro       # 3-card strip on /[slug] (same-category + fallback)
├── layouts/Layout.astro            # canonical, hreflang, OG (auto-resolves to /og/...), Twitter Card, JSON-LD pass-through
├── lib/
│   ├── content-api.ts              # build-time fetch client (cursor-paginated)
│   ├── jsonld.ts                   # Schema.org generators (BlogPosting, Blog, WebSite, BreadcrumbList)
│   ├── pagination.ts               # window slicing (PAGE_SIZE = 10)
│   └── seo.ts                      # Org/person identity (mirrors tds-landingpage)
├── og/
│   ├── render.ts                   # Satori → Resvg pipeline, exports renderOgPng()
│   └── fonts/                      # Instrument Serif Regular + Italic (woff) + Geist Medium (ttf)
├── pages/
│   ├── index.astro                 # DE page 1
│   ├── page/[num].astro            # DE pages 2+
│   ├── [slug].astro                # article (DE + EN)
│   ├── en/index.astro              # EN page 1
│   ├── en/page/[num].astro         # EN pages 2+
│   ├── og/[lang]/[slug].png.ts     # build-time per-post OG image
│   └── rss.xml.ts                  # feed
├── public/                         # robots.txt, llms.txt, favicon
├── scripts/og-smoke.ts             # render two fixture OG images to disk
├── styles/global.css
└── types/
    └── shared-augment.d.ts         # tds-shared@0.1.0 patch: BlogPost.tags (tds-shared#8)
```

## Per-post OG images

Each post gets a 1200×630 PNG generated at build time and served as
a static file. Layout.astro auto-resolves `og:image` to
`/og/{lang}/{slug}.png` when the page passes an `article.slug`; an
explicit URL in `coverHint` still overrides if you ever want to
ship a hand-designed cover.

The template is editorial: hairline rule + category eyebrow →
Instrument Serif display headline with the last word italic-burgundy →
hairline footer with date · author + "Tracht Digital · Journal"
wordmark. See `src/og/render.ts` for the JSX-object tree.

`npm run og:smoke` renders two fixtures (DE short + EN long title)
to `scripts/og-smoke-*.png` for quick regression checks.

---

## Known gaps

| Issue | Status |
|---|---|
| Tag filtering UI | blocked — `tds-content-api#7` (tags model) ships first |
| Code block syntax highlighting (Shiki) | not yet — issue #5 |

---

## License

UNLICENSED — internal Tracht Digital Solutions project.

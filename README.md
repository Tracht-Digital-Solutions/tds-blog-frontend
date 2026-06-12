# tds-blog

> **Setting this up from scratch?** See [`INSTALL.md`](INSTALL.md) for
> the step-by-step bring-up (Packages auth → npm install → OG fonts
> → env → dev → og:smoke → build → auto-deploy). This README
> documents the routing, structure and OG image generator.

---


Public blog at `blog.tracht-digital.de`. **Astro** SSG + **Tailwind v4**
with self-hosted **Instrument Serif + Geist** on the shared token
system from **tds-shared**. The surface design is the **flat/"kantig"
blog design** from the Tracht design-system handoff: no border radii,
colour blocks instead of hairlines, compact spacing, fixed dark panels
(hero, newsletter, footer) on the `--color-surface-*` tokens. Every
post is fetched from **`tds-content-api`** at build time and rendered
to static HTML — no runtime API calls for content; the only
client-side work is filtering (search/categories) over data baked into
the page. Each post also gets a per-post **OG preview image** rendered
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

Deploys automatically on every push to `main`; see [Deploy](#deploy).

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

## Deploy

Deployment is automatic. On every push to `main`,
[`.github/workflows/build.yml`](.github/workflows/build.yml) builds the
static `dist/`, force-pushes it to an orphan `build` branch (latest
build only), then GET-pings the deploy webhook so the production host
pulls that branch and goes live.

**Required secret:** set `DEPLOY_WEBHOOK_URL` (repository secret) to the
host's deploy-hook URL — the deploy token is carried inside the URL.
Without it the build still publishes the `build` branch and the deploy
ping is skipped, so you can fall back to pulling the artifact:

```bash
git fetch origin build
git worktree add ../tds-blog-build origin/build   # holds the built dist/
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
branch ready to deploy). Implementation lives in
[`tds-content-api#3`](https://github.com/Tracht-Digital-Solutions/tds-content-api/issues/3)
(still pending).

---

## Pages

All pages share `JournalHeader.astro` (flat top nav: wordmark, nav
items, live search field, DE/EN toggle, CTA) and
`JournalFooter.astro` (newsletter panel + navy footer block with link
columns and the Schwarzenbek location). Article pages additionally get
`ArticleSidebar.astro` — a fixed, collapsible left nav on `lg+` (the
top nav stays for small screens) that minimises to an icon rail with a
phone-icon CTA.

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | DE index — `BlogIndex` island: featured-post hero on fixed navy, collapsible category sidebar with post counters, flat card grid (abstract brand-geometry covers), live full-text search (`?q=` round-trips) |
| `/page/[num]` | `src/pages/page/[num].astro` | DE pages 2..N — flat editorial rows |
| `/[slug]` | `src/pages/[slug].astro` | Article page (DE + EN both routed through here via `lang` prop); back button, scrollspy TOC, collapsible h2 sections, drop-cap intro, author-bio block, flat prev/next + `RelatedArticles` card strip |
| `/tag/[tag]` | `src/pages/tag/[tag].astro` | DE tag-filtered list |
| `/en/` | `src/pages/en/index.astro` | EN index — mirror of the DE index against `listAllPosts("en")` |
| `/en/page/[num]` | `src/pages/en/page/[num].astro` | EN pagination |
| `/en/tag/[tag]` | `src/pages/en/tag/[tag].astro` | EN tag-filtered list |
| `/og/[lang]/[slug].png` | `src/pages/og/[lang]/[slug].png.ts` | Per-post OG preview image, 1200×630, rendered at build time |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS 2.0 feed |
| `/interests-index.json` | `src/pages/interests-index.json.ts` | Static post index for the "Für dich" island |
| `/sitemap-index.xml` | `@astrojs/sitemap` | Auto-generated |

---

## Project structure

```
src/
├── components/
│   ├── ArticleSidebar.astro        # fixed collapsible left nav on /[slug] (lg+), phone icon when collapsed
│   ├── BlogPostCard.astro          # flat editorial list row (pagination + tag pages)
│   ├── Covers.tsx                  # 6 abstract brand-geometry covers (slug-hashed) + photo cover
│   ├── PostCard.tsx                # flat post card (island + static render in RelatedArticles)
│   ├── JournalHeader.astro         # flat top nav with live search, DE/EN toggle, CTA
│   ├── JournalFooter.astro         # newsletter panel + navy footer block
│   ├── JsonLd.astro                # Inline <script type="application/ld+json"> utility
│   ├── RelatedArticles.astro       # 3-card strip on /[slug] (same-category + fallback)
│   ├── TagChip.astro / TagList.astro
│   └── islands/
│       ├── BlogIndex.tsx           # hero + category sidebar + grid + live search
│       ├── ForYou.tsx              # interest-based recommendations
│       └── NewsletterSignup.tsx    # newsletter block → tds-contact-api
├── layouts/Layout.astro            # canonical, hreflang, OG (auto-resolves to /og/...), Twitter Card, JSON-LD pass-through, sidebar chrome prop
├── lib/
│   ├── content-api.ts              # build-time fetch client (cursor-paginated)
│   ├── jsonld.ts                   # Schema.org generators (BlogPosting, Blog, WebSite, BreadcrumbList)
│   ├── marked.ts                   # markdown → HTML with Shiki-highlighted code blocks
│   ├── pagination.ts               # window slicing (PAGE_SIZE = 10)
│   ├── sections.ts                 # split article HTML at h2s for collapsible sections + TOC
│   └── seo.ts                      # Org/person identity (mirrors tds-landingpage)
├── og/
│   ├── render.ts                   # Satori → Resvg pipeline, exports renderOgPng()
│   └── fonts/                      # Instrument Serif Regular + Italic (woff) + Geist Medium (ttf)
├── pages/
│   ├── index.astro                 # DE index (BlogIndex island)
│   ├── page/[num].astro            # DE pages 2+
│   ├── [slug].astro                # article (DE + EN)
│   ├── tag/[tag].astro             # DE tag pages
│   ├── en/…                        # EN mirrors (index, page, tag)
│   ├── interests-index.json.ts     # static post index for ForYou
│   ├── og/[lang]/[slug].png.ts     # build-time per-post OG image
│   └── rss.xml.ts                  # feed
├── public/                         # robots.txt, llms.txt, favicon
├── scripts/og-smoke.ts             # render two fixture OG images to disk
├── styles/global.css               # flat design vocabulary + .prose-article
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
| Rebuild-on-publish dispatch | pending — `tds-content-api#3`; until then rebuilds run on push to `main` only |
| Newsletter backend | none — the signup posts a contact message via tds-contact-api (Julian gets a notification mail), no actual mailing list yet |

---

## License

UNLICENSED — internal Tracht Digital Solutions project.

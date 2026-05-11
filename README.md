# tds-blog

Public blog at `blog.tracht-digital.de`. **Astro 5** SSG + **Tailwind v4**.
Every post is fetched from **`tds-content-api`** at build time and rendered
to static HTML — no runtime API calls, no client-side data fetching.

---

## Quick start

```bash
export NPM_TOKEN=ghp_yourClassicPATWithReadPackagesScope
npm install         # generates package-lock.json on first run
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
npm run build        # → dist/ static HTML
npm run preview      # serve dist/ to verify production build
npm run type-check   # astro check
```

---

## Manual deploy

The repo ships an automated `.github/workflows/deploy.yml` (push to
`main` → SFTP → `install.php`). To deploy by hand:

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
`workflow_dispatch` against this repo's deploy workflow so the blog
auto-rebuilds with the new post. Implementation lives in
[`tds-content-api#3`](https://github.com/Tracht-Digital-Solutions/tds-content-api/issues/3)
(still pending).

---

## Pages

| Path | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | First page of the journal (newest 10) |
| `/page/[num]` | `src/pages/page/[num].astro` | Pages 2..N (10 per page) |
| `/[slug]` | `src/pages/[slug].astro` | Detail page per post |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS 2.0 feed |
| `/sitemap-index.xml` | `@astrojs/sitemap` | Auto-generated |

---

## Project structure

```
src/
├── components/BlogPostCard.astro
├── layouts/Layout.astro            # canonical, hreflang, OG, Twitter Card
├── lib/
│   ├── content-api.ts              # build-time fetch client (cursor-paginated)
│   └── pagination.ts               # window slicing (PAGE_SIZE = 10)
├── pages/
│   ├── index.astro                 # page 1
│   ├── page/[num].astro            # pages 2+
│   ├── [slug].astro                # post detail
│   └── rss.xml.ts                  # feed
└── styles/global.css
```

---

## Known gaps

| Issue | Status |
|---|---|
| Tag filtering UI | blocked — `tds-content-api#7` (tags model) ships first |
| Code block syntax highlighting (Shiki) | not yet — issue #5 |

---

## License

UNLICENSED — internal Tracht Digital Solutions project.

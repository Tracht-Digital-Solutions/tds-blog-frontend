# AGENTS.md — tds-blog-frontend

The public journal at `blog.tracht-digital.de` (DE at `/`, EN at `/en/`). Astro 7, `output: "server"`
(`@astrojs/node`, standalone, under Passenger) behind a file-backed page cache: a page renders on demand
and is stored as a file Apache serves directly. Posts come from the composed content API (`/content/blog`,
served by `tds-ext-blog-cms-pkg`). It is the `blog` surface of tds-shared: flat, square, in colour bands.
Setup: [INSTALL.md](INSTALL.md); assets: [IMAGES.md](IMAGES.md).

## Commands

```bash
npm install --no-package-lock
npm run dev
npm run type-check      # astro check (doesn't parse CSS)
npm run test:run        # vitest
npm run build           # → dist/ + release/ (postbuild assembles and verifies)
npm run og:smoke        # after any OG renderer change
npm run audit:geo -- <url>
```

## Hard rules

- No per-visitor work on a cached route; never memoise a failed read; keep `listAllPosts` unmemoised.
- `TDS_SITE_KEY` is read from `process.env`, never `import.meta.env` or `PUBLIC_*`.
- `.htaccess` sets only `Options -Indexes`. All CSS stays inlined.
- No decorative motion; nothing ships at `opacity: 0`.
- Set tokens in tds-shared's surface layer; never re-declare a shared class in `global.css`.
- Never wrap a `PostCard` in a flex item; `container-type` never on fixed-position ancestors.
- Hreflang alternates for listings come from `src/lib/alternates.ts`, never a prefix swap.
- Titles via `pageTitle()` (index pages excepted); descriptions via `postDescription` / `metaDescription.ts`.
- No price on embedded products; never rebuild an affiliate URL.
- Never `setPointerCapture` on `pointerdown` in the hero slider.
- Font faces are JS imports in `Layout.astro`; the OG renderer stays build-time only.

## Topic files

| File | Read before |
|---|---|
| [docs/agents/architecture.md](docs/agents/architecture.md) | Changing routes, caching, data fetching, translation, the site key or the toolchain |
| [docs/agents/design.md](docs/agents/design.md) | Changing styles, bands, layout, shadows, the header, the phone app shell or motion |
| [docs/agents/reading-features.md](docs/agents/reading-features.md) | Touching the index, hero, article page, TOC, reading tools, print view, focus mode or "Für dich" |
| [docs/agents/content-integrations.md](docs/agents/content-integrations.md) | Touching block posts, shop products, authors, ads, cookie banner or demo content |
| [docs/agents/seo.md](docs/agents/seo.md) | Changing titles, descriptions, JSON-LD, hreflang, sitemap, RSS, robots or llms.txt |
| [docs/agents/verification.md](docs/agents/verification.md) | Running checks, tests or the local cache |

Workspace rules: `../CLAUDE.md`. Cross-repo state: `../MIGRATION-STATUS.md`.

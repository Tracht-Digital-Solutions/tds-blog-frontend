# SEO and structured data

`Layout.astro` renders canonical, hreflang, OG (with image dimensions), Twitter Card, `article:modified_time` and
theme-color, and passes an optional `jsonLd`. The default description is `siteConfig.description[lang]`.

## Titles and descriptions

- **Titles via `pageTitle()`** (`src/lib/seo.ts`): it owns the `" — Journal"` suffix and the length rule (drops the
  brand, never the subject). The tab script splits on that separator. **The two index pages are the exception** and
  stay inline (`TDS Journal — Digitalisierung, Software & Mittelstand`), within 60 characters. `/aktuelles` uses
  `pageTitle()`.
- **Generated descriptions come from `src/lib/metaDescription.ts`**, a two-tier sentence (a rich form when it fits, a
  shorter complete sentence for long names, `clampToWord` as backstop). `metaDescription.test.ts` asserts 80 < n ≤ 160
  for realistic worst-case names and that the taxonomy name survives.
- **Article descriptions go through `postDescription`** (the editor's `metaDescription`, else the excerpt, clamped);
  author bios through `clampToWord`. Never pass raw CMS text.
- `siteConfig.description` carries both keyword commitments: "Digitalisierung für Unternehmen" and the
  Schwarzenbek/Hamburg signal.
- `metaDescription` is read via the local `FullPost` type in `content-api.ts` (only this repo reads it).

## Hreflang (`altUrl` on `Layout`)

- `undefined` → derive by swapping the `/en/` prefix (correct for posts; every post exists in both languages).
- `null` → canonical only.
- string → explicit URL.

Listing routes (`tag/`, `kategorie/` ↔ `en/category/`, `autor/`, `page/`) don't mirror by prefix. They get alternates
from `src/lib/alternates.ts`, which looks the counterpart up in the other language's corpus and returns a path only
when it exists (`null` is the normal case for categories). **Never use a prefix swap** (`/en/tag/webshop` doesn't
exist), because one dangling alternate invalidates the whole set.

## Sitemap

- Hand-written in `src/lib/sitemap.ts`; `@astrojs/sitemap` was removed (under `output: "server"` it would list almost
  nothing).
- `/sitemap-index.xml` names `sitemap-{pages,posts,categories,tags,authors}.xml` (`src/lib/sitemapSections.ts`), each
  with its newest date; posts carry `image:image` (cover or OG card). `/sitemap-0.xml` still lists everything.
  `cache.ts` rebuilds all via `SITEMAP_PATHS`. Panel exclusions apply (`sitemapExclusions.ts`).
- Only article slugs get alternates.
- **`lastmod` is per URL** from the newest post it shows (`newestDate`), using `publishedAt` (the list payload has no
  `updatedAt`).

## JSON-LD (`src/lib/jsonld.ts`)

- Articles: `BlogPosting` (author, publisher, image, wordCount, inLanguage, dates) + `BreadcrumbList`.
- Index pages: `WebSite` + `Blog`. **No `SearchAction`** (there's no search endpoint).
- **Every listing route emits a page-level node with the `ItemList` inside:** `CollectionPage` (category, tag,
  archive, `/aktuelles`) via `collectionPageSchema`; `ProfilePage` around the `Person` on author pages via
  `profilePageSchema`. Pass the built list (only the caller knows an archive's position offset).
- **`authorPersonId(pageUrl)`** makes an article's author and the author page one entity; don't inline the fragment.
- **`asGraph` owns `@context`** and strips it from members.
- Organization and Person `@id`s are anchored on `tracht-digital.de`. This site emits a **consistent** full
  `organizationSchema()` node (from `siteConfig`) so publishers have a name and logo. Keep `src/lib/seo.ts` in step
  with the landing page's identity.
- Don't call `websiteSchema()` without a language.
- Write `WithContext` without a type argument (it defaults to `Record<string, unknown>`; `WithContext<object>` breaks
  the type check).

## OG cards (`src/og/render.ts`)

Satori + Resvg, build-time only; fonts under `src/og/fonts/` (committed OFL TTFs; Satori can't read woff2). Never import
the renderer from a runtime island. `npm run og:smoke` after changes; `npm run og:default` renders the default card.

## robots, llms.txt and geo audit

- **Don't reintroduce `Disallow: /og/`** in `public/robots.txt`; those are the pages' own images
  (`seoContract.test.ts`).
- `/llms.txt` is a generated route (`src/lib/llmsTxt.ts`, `src/pages/llms.txt.ts`); never add a static
  `public/llms.txt` (it would shadow the route).
- `npm run audit:geo -- <url>` runs the shared geo audit (`scripts/geo-audit.mjs`, `src/lib/geoAudit.test.ts`); the
  generic body is maintained in the landing page repo.

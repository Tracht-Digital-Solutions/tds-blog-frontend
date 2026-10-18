# Image swap guide

## Editorial series — 2026-10-16

`src/lib/editorialCovers.json` assigns all 15 published journal articles to
the coordinated editorial image series hosted on `https://tracht-digital.de/images/`.
The identical catalog lives in the landing-page repository; the URLs are shared
so a journal card has the same image on both sites. Uploaded CMS covers always
win. Unknown article slugs retain the abstract brand cover.

The data layer resolves the fallback for lists, articles, feeds, sitemaps and
social metadata. Demo posts use the same catalog. Article pages display a lazy
cover below the byline, with reserved space to avoid layout shifts.
Generated images are illustrative scenes, never evidence of a customer project.

Original PNGs, WebP exports and full prompts are sorted in the workspace under
`stuff/03-Materialien/Bildserie-2026-10-16/`. Publish the landing-page release
before this frontend so all image URLs already exist. The historical notes
below predate the current asset and runtime implementation.

Static blog rendered from `tds-content-api`. Most image surface is
either (a) inside the published post content itself (handled by
content authors via the CMS) or (b) generated programmatically at
build time. Only a few static assets need a manual hand-off before
launch.

## 1. Favicon

| | |
|---|---|
| **Reference** | `src/layouts/Layout.astro` — `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` |
| **Expected at** | `public/favicon.svg` |
| **Status** | **Shipping**: a 32 × 32 rounded square with the brand primary→accent gradient and a white italic "T" in Georgia — same mark shared with the landingpage / admin / customer so the four properties read as one identity. Stand-in for the final logomark. |
| **Recommended bundle** | When the real mark lands, ship this set, matching the landingpage so the two properties share an identity: |

| File | Size | Purpose |
|---|---|---|
| `public/favicon.svg` | viewBox `0 0 32 32` (scalable) | Primary, modern browsers |
| `public/favicon.ico` | 32 × 32 (multi-resolution 16 + 32 + 48) | IE / legacy fallback |
| `public/apple-touch-icon.png` | **180 × 180** | iOS home-screen, Safari tab |
| `public/icon-192.png` | **192 × 192** | Android home-screen, generic PWA |
| `public/icon-512.png` | **512 × 512** | PWA splash, generic high-res |

## 2. Open Graph cards

| | |
|---|---|
| **Default** | Referenced as `/og-default.png` in `Layout.astro:43` when an article has no slug-specific card. |
| **Per-article** | `/og/${lang}/${slug}.png` — generated at build time via Satori (see `src/og/render.ts` if the pipeline is mirrored from the landingpage). |
| **Dimensions** | **1200 × 630 px** (Open Graph spec — also satisfies Twitter `summary_large_image`; LinkedIn / WhatsApp pull the same file). |
| **Status** | Per-article cards build dynamically. The default fallback PNG should ship in `public/og-default.png`. |
| **Recommended** | Same Satori-rendered brand card pattern used by tds-landingpage-frontend (`src/og/render.ts` + `src/pages/og/default.png.ts`) so the two properties stay visually consistent. |

## 3. Article content images

Authors upload these through the CMS, not the codebase. They land
on the content API's storage and are served by URL — no
landingpage-side asset swap needed. Each post payload returns a
`coverHint` / `coverImageUrl` field that the blog renders into the
post layout when present.

## Once a real asset lands

1. Drop the file at the path listed above.
2. Verify in dev with `npm run dev` that the `<link rel="icon">` /
   OG meta resolves the new file.
3. Re-build (`npm run build`) and inspect `dist/` for the deployed
   asset.
4. Open a tracker issue if you want to capture the source files
   (e.g. AI / Figma file) alongside the SVG.

## Related

See [`../tds-landingpage/IMAGES.md`](https://github.com/Tracht-Digital-Solutions/tds-landingpage-frontend/blob/main/IMAGES.md)
for the bigger image-swap guide — the OG-card Satori pipeline and
favicon recommendations there apply 1:1 to this repo.


## Image semantics – 2026-10-18

The editorial catalog matches the landing image host and supplies true dimensions,
responsive sources and bilingual descriptions to cards, hero slides and article
photos. Article ImageObject and Open Graph metadata use the same source. The
43 own shop services have paired DE/EN product artwork; merchant images and
custom CMS uploads retain priority. Shared card image attributes require 0.56.1.

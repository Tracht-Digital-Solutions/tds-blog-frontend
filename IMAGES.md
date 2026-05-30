# Image swap guide

Static blog rendered from `tds-content-api`. Most image surface is
either (a) inside the published post content itself (handled by
content authors via the CMS) or (b) generated programmatically at
build time. Only a few static assets need a manual hand-off before
launch.

## 1. Favicon

| | |
|---|---|
| **Reference** | `src/layouts/Layout.astro:69` — `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` |
| **Expected at** | `public/favicon.svg` |
| **Status** | The link tag is wired but no file ships at the path today. Browsers fall back to the default favicon until the SVG lands. |
| **Recommended set** | A small bundle, matching the landingpage so the two properties share an identity: |

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
| **Recommended** | Same Satori-rendered brand card pattern used by tds-landingpage (`src/og/render.ts` + `src/pages/og/default.png.ts`) so the two properties stay visually consistent. |

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

See [`../tds-landingpage/IMAGES.md`](https://github.com/Tracht-Digital-Solutions/tds-landingpage/blob/main/IMAGES.md)
for the bigger image-swap guide — the OG-card Satori pipeline and
favicon recommendations there apply 1:1 to this repo.

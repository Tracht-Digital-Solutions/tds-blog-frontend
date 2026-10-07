# Verification

## Commands

```bash
npm run type-check     # astro check; doesn't parse CSS (a broken <style> only fails at build)
npm run test:run       # vitest
npm run build          # dist/ + release/
npm run og:smoke
npm run audit:geo -- <url>
```

## Running the cache locally

```bash
npm run build
cd release && node app.cjs
curl -sI localhost:4321/      # X-TDS-Cache: MISS, then HIT

curl -X POST -H 'x-tds-cache-token: …' -H 'content-type: application/json' \
     -d '{"events":[{"type":"post","id":"mein-artikel","lang":"de"}]}' \
     localhost:4321/tds/cache/rebuild
```

## Tests worth knowing

| Suite | Pins |
|---|---|
| `src/__tests__/layout.test.ts` | Shell, grid, container queries, article centring, fluid headings |
| `src/__tests__/bands.test.ts` | Soft ground, dark tint, untouched primary, margin-free rows, mosaics, article-end stack, no white fills |
| `src/__tests__/header.test.ts` | App shell, account menu placement, `.nav-search` display |
| `HeroSlider.test.tsx` | No pointer capture on `pointerdown`; `dragstart` prevented (read from source) |
| `content-api.test.ts` | Landing-block call counts in all three cases |
| `metaDescription.test.ts`, `seoContract.test.ts` | Description budgets; `/og/` crawlable |
| `printPaginate.test.ts` | True-size pagination, no viewport units on the sheet |
| `src/lib/*.test.ts` | Alternates, cache events, sitemap and exclusions, site key, shop API, localisation, sections, taxonomy, pagination, robots, llms.txt, geo audit |

## Regression checks on the build

- Decorative motion: `cat dist/_astro/*.css | grep -o "animation:[^;}]*" | sort -u`; only `tds-` keyframes allowed.
- Judge the hero slider, print view and layout widths in a browser; several bugs here produced no error.

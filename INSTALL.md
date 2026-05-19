# Installation — tds-blog

> Part of the Tracht Digital Solutions multi-repo project.
> tds-blog is the **public journal** at `blog.tracht-digital.de`. Astro
> SSG → static HTML; every post is fetched from `tds-content-api` at
> build time + each post also gets a per-post OG preview PNG rendered
> at build time via Satori + Resvg.
>
> Bring this up after `tds-content-api` is reachable.

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 20 LTS or 22 LTS | Astro 5 baseline |
| npm | 10+ | Bundled with Node 20 |
| Git | any | Repo hosting |
| Classic GitHub PAT | with `read:packages` | Install `@tracht-digital-solutions/tds-shared` |

## 1. GitHub Packages access

```ini
# ~/.npmrc
@tracht-digital-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_yourClassicPATWithReadPackagesScope
```

…or set `NPM_TOKEN` in the env (the repo's `.npmrc` references it).
For the 403 on `read_package`, see
[tds-shared INSTALL §5](https://github.com/Tracht-Digital-Solutions/tds-shared/blob/main/INSTALL.md).

## 2. Clone + install

```bash
git clone https://github.com/Tracht-Digital-Solutions/tds-blog.git
cd tds-blog
npm install
```

The install pulls **Satori + @resvg/resvg-js** alongside Astro —
both are needed for the per-post OG image renderer. resvg-js has
a native addon; if `npm install` complains about prebuilt binaries
on an unusual platform, see Troubleshooting.

## 3. Brand fonts

Three TTFs live committed under `src/og/fonts/`:

- `Fraunces-Regular.ttf` — display headline
- `Fraunces-Italic.ttf` — accent word
- `Geist-Medium.ttf` — eyebrow + footer meta

They're sourced from upstream OFL repos (Fraunces from
`undercasetype/Fraunces` master, Geist from `vercel/geist-font`)
and committed deliberately because `@fontsource-variable/fraunces`
ships woff2 only — Satori can't read woff2.

**Don't delete these.** If they ever need updating, fetch fresh
copies and re-run `npm run og:smoke` to verify the renderer.

## 4. Configure

```bash
# .env (build-time)
CONTENT_API_URL=http://localhost:8003
```

The default points at `https://api.tracht-digital.de/content` — so
for a quick build against production posts you can leave `.env`
empty.

## 5. Local development

```bash
npm run dev            # http://localhost:4321
```

The dev server fetches against whichever `CONTENT_API_URL` is set.
If the API is unreachable, the build still succeeds — the listing
page and `/[slug]` paths just show zero posts.

## 6. Verify the OG renderer

```bash
npm run og:smoke
# → scripts/og-smoke-1-de.png (~47 KB)
# → scripts/og-smoke-2-en.png (~50 KB)
```

Open both — you should see the editorial template (hairline rule +
category eyebrow + Fraunces headline with italic-burgundy accent
on the last word + hairline footer with date · author + "Tracht
Digital · Journal" wordmark). If anything renders wrong, the fix
lives in `src/og/render.ts`.

## 7. Verify the build

```bash
npm run type-check     # 0 errors
npm run build          # → dist/ + dist/og/{lang}/{slug}.png per post
npm run preview        # serve dist/ for visual inspection
```

## 8. Production deployment

Auto-SFTP was removed. The repo's `build.yml` only force-pushes
`dist/` to a `build` branch. Deploy from there by hand:

```bash
# Option A — build locally then SFTP
npm run build
# SFTP dist/ to ~/sites/blog.tracht-digital.de/releases/<TIMESTAMP>/
curl --fail \
  "https://blog.tracht-digital.de/install.php?action=install-static\
&target=blog.tracht-digital.de&release=<TIMESTAMP>&token=<INSTALL_TOKEN>"

# Option B — pull from the build branch
git fetch origin build
git worktree add ../tds-blog-build origin/build
# SFTP ../tds-blog-build/ to netcup as above
```

## 9. Rebuild-on-publish (open)

When `tds-admin` publishes a post, `tds-content-api` should fire a
`workflow_dispatch` against this repo's `build.yml` so the new
post + its OG image land on the `build` branch automatically.
Implementation lives in
[`tds-content-api#3`](https://github.com/Tracht-Digital-Solutions/tds-content-api/issues/3).
Until then, push a trivial commit to this repo's main, or hit "Run
workflow" in the Actions tab.

## Related repos

- [tds-shared](https://github.com/Tracht-Digital-Solutions/tds-shared) — `BlogPost` type, i18n strings
- [tds-content-api](https://github.com/Tracht-Digital-Solutions/tds-content-api) — post source, fetched at build time

## Troubleshooting

**`npm install` fails on @resvg/resvg-js postinstall.**
The package downloads a platform-specific prebuilt native binary.
On unusual archs (ARM Linux without prebuilt support), force the
fallback to JS: `npm install --legacy-peer-deps` then retry with
`@resvg/resvg-js-fallback`.

**`npm run og:smoke` errors with `Cannot find font`.**
The TTFs are missing from `src/og/fonts/`. Re-fetch:

```bash
curl -L "https://raw.githubusercontent.com/undercasetype/Fraunces/master/fonts/ttf/Fraunces144pt-Regular.ttf" \
  -o src/og/fonts/Fraunces-Regular.ttf
curl -L "https://raw.githubusercontent.com/undercasetype/Fraunces/master/fonts/ttf/Fraunces144pt-Italic.ttf" \
  -o src/og/fonts/Fraunces-Italic.ttf
curl -L "https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-sans/Geist-Medium.ttf" \
  -o src/og/fonts/Geist-Medium.ttf
```

**Build emits zero OG pages.**
`CONTENT_API_URL` unreachable at build time. `listAllPosts()`
returns `[]`, `getStaticPaths()` returns `[]`, no PNGs are emitted.
Bring up content-api first.

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
| Node.js | 22.12+ | Astro 6 baseline (Node 18/20 unsupported) |
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

One font file lives committed under `src/og/fonts/`, used only by the
Satori OG-card renderer:

- `Geist-Medium.ttf` — the whole card (headline, eyebrow, footer meta)

Geist is from `vercel/geist-font`, committed deliberately so the build
doesn't depend on resolving font files out of node_modules. (The OG card
renders entirely in Geist since the brand retired Instrument Serif.)

**Don't delete this.** If it ever needs updating, copy a fresh `.ttf`
and re-run `npm run og:smoke` to verify the renderer.

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
category eyebrow + Geist headline with a burgundy accent on the last
word + hairline footer with date · author + "Tracht Digital · Journal"
wordmark). If anything renders wrong, the fix lives in `src/og/render.ts`.

## 7. Verify the build

```bash
npm run type-check     # 0 errors
npm run build          # → dist/ + dist/og/{lang}/{slug}.png per post
npm run preview        # serve dist/ for visual inspection
```

## 8. Production deployment

Two branches (the old `build` branch is gone):

- **`dev`** — every push to `main` auto-builds `dist/` (Staging/Demo config) to
  the orphan `dev` branch. Not deployed.
- **`release`** — the manual *Actions → Release → Run workflow* button builds the
  production `dist/` to the `release` branch and POST-pings the deploy webhook so
  the host pulls `release` and goes live.

One-time: add the `DEPLOY_WEBHOOK_URL` repository secret (host deploy-hook URL;
token inside the URL) — used only by the release run. Pull by hand with:

```bash
git fetch origin release
git worktree add ../tds-blog-release origin/release   # holds the built dist/
```

## 9. Rebuild-on-publish

When `tds-admin` publishes a post, `tds-content-api` fires a
`workflow_dispatch` against this repo's `dev.yml` so the new post + its OG image
land on the `dev` branch automatically (production picks it up on the next
manual Release). Implementation lives in
[`tds-content-api#3`](https://github.com/Tracht-Digital-Solutions/tds-content-api/issues/3).
Until then, push a trivial commit to this repo's main, or hit "Run
workflow" in the Actions tab.

## Related repos

- [tds-shared](https://github.com/Tracht-Digital-Solutions/tds-shared) — `BlogPost` type, i18n strings
- [tds-content-api](https://github.com/Tracht-Digital-Solutions/tds-content-api) — post source, fetched at build time

## Troubleshooting

**`Cannot find module @rollup/rollup-linux-x64-gnu` (or any other
`*-linux-x64-gnu`) in CI.**
The lockfile was generated on Windows and only registers win32
platform binaries (npm/cli#4828). CI installs with `npm install
--no-package-lock` to bypass this — if the workflow has been
reverted to `npm ci` or plain `npm install`, this comes back.

**`npm install` fails on @resvg/resvg-js postinstall.**
The package downloads a platform-specific prebuilt native binary.
On unusual archs (ARM Linux without prebuilt support), force the
fallback to JS: `npm install --legacy-peer-deps` then retry with
`@resvg/resvg-js-fallback`.

**`npm run og:smoke` errors with `Cannot find font`.**
The font file is missing from `src/og/fonts/`. Geist comes from upstream:

```bash
curl -L "https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-sans/Geist-Medium.ttf" \
  -o src/og/fonts/Geist-Medium.ttf
```

**Build emits zero OG pages.**
`CONTENT_API_URL` unreachable at build time. `listAllPosts()`
returns `[]`, `getStaticPaths()` returns `[]`, no PNGs are emitted.
Bring up content-api first.

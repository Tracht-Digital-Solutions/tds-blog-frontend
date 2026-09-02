# Agent notes — tds-blog-frontend

Astro 6 SSG. Public blog at `blog.tracht-digital.de`. All posts are
fetched at **build time** from `tds-content-api` so the rendered HTML
ships static — no runtime API calls, no client-side data fetching.

> Status: **required, not superseded.** Still deployed. Posts come from
> `tds-content-api` today; after the frontend-platform cutover the source becomes
> `tds-ext-blog-cms-pkg` (`/blogs/...`), read at build time the same way. See the root
> `MIGRATION-STATUS.md`.
Self-hosted **Lato** (display) + **Plus Jakarta Sans** (body) +
**JetBrains Mono** (mono). The editorial type vocabulary (`.display`,
`.section-num`, `.marginalia`, …) comes from
`@tracht-digital-solutions/tds-shared`. Any note claiming the display face
is Hanken Grotesk is stale — that was retired, as was Instrument Serif
before it.

**Surface design: flat/"kantig"** (from the Tracht design-system
handoff, 2026-06): no border radii or hairline cards — separation via
colour blocks (`--color-soft`, `--tds-flat-tint`), fixed dark surfaces
(hero, newsletter, footer) on the `--color-surface-*` tokens so dark mode
never inverts them.

**This app is the `blog` surface of the shared design library.**
`<html data-surface="blog">` in `Layout.astro` activates
`tds-shared/styles/surfaces/blog.css`, which owns the flat kit: every
radius collapses to 0, no elevation, the 800 display voice, the
display-face eyebrow, and `--tds-flat-tint` / `--tds-flat-hover`.
`global.css` imports `base.css` → `primitives.css` → `prose.css` →
`app.css` → `surfaces/blog.css`.

> **The rule here used to say the opposite** — *"geometry is app-local per
> repo convention — don't 'fix' this in tds-shared-pkg"* — and that is
> exactly what let one design drift into three separately-maintained
> variations. It is reversed. Set a token in the surface layer; never
> re-declare a shared class in `global.css`.

Removed from `global.css` by the unification (do not reintroduce): the
`--font-display`/`-body`/`-mono` re-declarations, the `.display` (800) /
`.display-tight` (700) / `.eyebrow` forks, the byte-identical
`.brand-wordmark` copy, `.chip { border-radius: 0 }`, and the local
`--flat-tint` / `--flat-hover` (now `--tds-flat-*`, from the surface layer).

**Decoration on this surface is deliberately minimal ("Digitale
Maßarbeit", tds-shared ≥0.23.0).** The shared layer ships `.tds-wash`,
`.tds-shape*` and `.tds-circuit`, and the blog uses **none of them**: the
flat kit separates with colour blocks and 2px accent bars, and a soft
radial field is the opposite of "kantig". What it does take is the
`.tds-brandbar` in the footer (square here, since `--tds-radius-bar` is 0
on this surface) and `.tds-tone-navy` on the footer instead of the inline
`background`/`color` pair — the tone also re-maps ink/muted/line/card, so
hairlines inside it read on the dark ground. The warm `--color-line` and
the rest of the palette arrive through the token layer with no work here.
That is a decision, not an omission — don't "finish the job" by adding
washes to the blog.

The long-form class is **`.tds-prose`**, promoted out of this repo into
`tds-shared/styles/prose.css`: it was the only long-form typography
implementation in the project, and the blog-CMS editor's preview pane
needed it too (that pane asked for `@tailwindcss/typography`'s `prose`
class — a plugin installed in no product — so it had always rendered
unstyled). The block-renderer classes moved with it: `.tds-callout*`,
`.tds-block-button`, `.tds-video-embed`, `.tds-block-embed`. Callouts are
square on this surface now, their radius following `--tds-radius-alert`
instead of the hard-coded `0.4rem` this file used to flag as breaking the
flat kit.

Still local, and correctly so: the flat vocabulary (`.post-card`,
`.post-row`, `.sidenav`, `.toc`, `.btn-flat`, `.btn-back`,
`.sec-head`/`.sec-body`, `.blog-sidebar`/`.with-sidebar`, `.nav-search`,
`.lang-toggle`), the hero carousel, the print/PDF sheet (deliberately
theme-free with hard-coded neutrals so it never inverts) and focus mode.

## Build pipeline

Tailwind runs through `@tailwindcss/postcss` (configured in
`postcss.config.mjs`), **not** the `@tailwindcss/vite` plugin. The original
reason is gone — that plugin broke under Astro 6's Vite 7 + rolldown
(withastro/astro#16542) and builds fine under Vite 8 — so do not reintroduce it
as a *fix*: nothing here is broken. It stays a deliberate convention, one
PostCSS setup across all six Astro apps, and `tds-auth-frontend`'s
`static-posture.test.ts` asserts it for the workspace. Changing it is a
six-app decision, not a per-repo one.
CSS minification routes through lightningcss, configured via the
shared `tdsViteBuild` preset spread into `vite.build` (from
`@tracht-digital-solutions/tds-shared/astro`, tds-shared-pkg 0.4.0). Don't
hand-author the `cssTarget` — the preset pins the Safari floor that keeps
lightningcss emitting `-webkit-backdrop-filter` on the frosted
`.brand-header`; without it the blur silently dies in Safari ≤17
(tds-shared-pkg#10). Small stylesheets inline into the initial HTML via
`build.inlineStylesheets: "auto"`.
Sharp is pinned as the image service so `<Image />` consumers auto-
emit WebP/AVIF — see `IMAGES.md` for the per-asset swap pattern and
favicon bundle. `<head>` preconnects to `api.tracht-digital.de` and
`tracht-digital.de` so cross-origin fetches don't pay the full TLS
handshake.

### Toolchain (2026-08-24)

The site runs the platform's current line: **TypeScript 6, vitest 4, jsdom 30,
Astro 7.2.5, shiki 4, satori 0.33** — the same set `tds-tools-frontend` moved
to, so the three public sites stay one toolchain.

The current shared-library line is **`tds-shared ^0.33.0`**. A caret on a
`0.x` package never crosses the minor boundary, so every new shared minor must
be repinned explicitly and verified with a fresh `npm install
--no-package-lock`; a green build against the old installed tree proves
nothing about the released line.

- **TypeScript 7 is not a deferred decision, it is unavailable.**
  `@astrojs/check` declares `peerDependencies: { typescript: "^5.0.0 || ^6.0.0" }`,
  and `astro check` *is* the correctness gate here. Re-test it when
  `@astrojs/check` widens that range.
- **Under TS 6 a side-effect import needs a typed target.** `ts(2882)` —
  *"Cannot find module or type declarations for side-effect import"* — fired on
  `import "@fontsource-variable/plus-jakarta-sans"`, because those packages
  publish no `types` condition, while `@fontsource/lato` does. The fix is to
  import the CSS entry explicitly (`…/index.css`): the same bytes, and Astro's
  own `declare module "*.css"` then types it. **Keep the `/index.css` suffix**
  — dropping it back to the bare specifier reddens the gate, not the build.
- **`tsconfig.json` excludes `release/` and `var/`.** Neither is committed, but
  both exist locally and in CI after a build, and nothing stopped `astro check`
  from type-checking the *minified server and client bundles* in there: 159
  files instead of 91, four genuine unused-import hints buried under 82 from
  Rollup output. `tds-tools-frontend` and `tds-landingpage-frontend` carry the
  same tsconfig without the exclude, and the tools site's `astro check` now
  runs V8 out of heap locally for exactly this reason.
- **`@testing-library/jest-dom` is deliberately absent.** Nothing imported it;
  the one island suite uses `@testing-library/react` and plain vitest matchers.
  `@testing-library/dom` stays because RTL peer-depends on it.

## Page chrome

* **Favicon** — `public/favicon.png` (901 × 901) is the real TDS
  logomark, shared verbatim with tds-landingpage-frontend / admin / customer
  so the four properties read as one identity. The favicon bundle
  table in IMAGES.md documents the optional full set (ICO,
  apple-touch-icon, PWA icons) if you ever want it.
* **Dark mode** — `data-theme="dark"` theme shared with the other
  three frontends. A no-flash inline script in `Layout.astro` sets
  `data-theme` on `<html>` from the `tds-theme` localStorage key (or
  the OS `prefers-color-scheme` fallback); the `ThemeToggle` island
  flips and persists it. **That script is now shared** — it is
  `themeBootstrapScript` from
  `@tracht-digital-solutions/tds-shared/astro`, injected as
  `<script is:inline set:html={themeBootstrapScript} />` (never as a
  template body — Astro would leak the literal braces into `dist/`), and
  `THEME_STORAGE_KEY` lives in `tds-shared/design`. It must
  stay in `<head>` and stay `is:inline`.
  (There used to be a second inline script setting a `js` class on `<html>`.
  It existed only so the scroll-reveal CSS could hide content safely; both are
  gone — see "No decorative motion" below.)
  Tokens live in `src/styles/global.css`: the
  structural tokens flip, while fixed dark surfaces use
  `--color-surface-navy/-accent/-ink` and elevated/glass surfaces use
  `--color-card`. The dark ground is a deep-navy family with warm
  ivory text — keep new dark surfaces in that family.
* **Dynamic document.title** — Layout-level inline script at the
  bottom of `<body>` observes every `<section id="…">` and
  prefixes the tab title with the section name as the user scrolls
  past it. No-ops on single-post layouts (most blog pages today)
  — kept for parity with the other frontends.

## Mobile navigation (2026-08-18, tds-shared 0.25.0)

The hamburger opens the **shared** `.tds-mobile-menu` sheet, docked under the
sticky bar, and every mechanic comes from `mountMobileNav`
(`@tracht-digital-solutions/tds-shared/nav`). What this repo used to own — a
`position: fixed; inset: 0` full-screen overlay, `body.drawer-open` as a scroll
lock, its own Escape handler and its own `matchMedia("(min-width: 768px)")` — is
gone. `src/__tests__/header.test.ts` fails if any of it comes back.

Three things about this that are easy to get wrong again:

* **The breakpoint moved from `md` to `lg`.** All three public sites hide their
  desktop nav at 1024px now, and `.tds-mobile-menu` bakes that width in. If the
  bar went back to `md:` the two would disagree across 256px of viewport — with
  neither the desktop nav nor a hamburger on screen, and nothing to report it.
* **Never hide the toggle or the panel with `lg:hidden`.** tds-shared is
  unlayered CSS and Tailwind's utilities sit in `@layer utilities`, so `hidden`
  on an element wearing `.btn` loses outright. The breakpoint belongs to the
  shared classes; a utility here is a silent no-op.
* **`--tds-mobile-menu-inset` must match the panel's `top-[…]`.** It is what the
  shared `max-height` subtracts, and this menu is the long one — nav plus the
  full Entdecken taxonomy plus the language and theme controls plus the CTA. Get
  them out of step and the sheet runs past the bottom of the viewport: a fixed
  element shows no scrollbar and throws no error, so the tail is simply
  unreachable.

The journal's editorial link optics (`.jnl-fullmenu-*`) deliberately stayed
local — the surface keeps its voice, only the mechanics converged. The desktop
"Entdecken" disclosure is a separate control and keeps its own state and its own
Escape handler.

## The language switch moved into tds-shared (2026-08-18, 0.25.3)

`.lang-toggle` was defined here and nowhere else, so the tools site — this
blog's sibling public property, which links here from its nav, hero and footer —
shipped a plain text link instead of a switch. The class is now
**`.tds-lang-toggle`** in tds-shared and this repo consumes it; the local block
in `global.css` is gone.

- **Markup changed in three places** (`JournalHeader` desktop + drawer,
  `ArticleSidebar`); only the class name. The full-width sidebar variant stays
  local, since it is this repo's layout and not the control.
- What the library version changes: transitions run on `--tds-dur-base` /
  `--tds-ease-out` instead of a hard-coded `180ms`, geometry follows
  `--tds-radius-chip` (still square here, a pill on marketing), and reduced
  motion resets the end state rather than only shortening it.
- **This repo points both halves at the two home pages; the tools site points at
  the equivalent page.** That difference is intentional, not drift — see
  tds-shared's AGENTS.md.

## The account menu (2026-08-22, tds-shared 0.25.6)

The header carries `AccountMenu` from
`@tracht-digital-solutions/tds-shared/components` — avatar, name, dropdown, top
right, the same control the panel has. The session cookie is
`Domain=.tracht-digital.de`, so a login at `auth.tracht-digital.de` was always
valid here; this blog simply showed a signed-in customer what it shows a
stranger, and had no auth code at all.

- **Signed out it renders NOTHING**, so an anonymous reader's header is
  byte-identical to what it was. That is `loggedOut`'s default and it is not an
  oversight: this bar already carries a contact CTA, and a sign-in link beside
  it would be noise on a public article. The tools site passes
  `loggedOut="login"` because there a session unlocks something.
- **It is mounted OUTSIDE the `hidden lg:flex` cluster**, next to the hamburger.
  Who you are is not desktop chrome, and below `lg` this is the only control in
  the bar besides the toggle — inside that cluster it would be absent, not
  merely smaller. Pinned by `header.test.ts`.
- **Utilities go on the wrapper `<div>`, never on `<AccountMenu>`.** tds-shared's
  CSS is unlayered and Tailwind's utilities are in `@layer utilities`, so a
  `hidden` on `.tds-dropdown` would lose and look like the island chose to
  render.
- **Signing out reloads this page**; it does not bounce to the login form. The
  panel redirects because it has nothing to show a signed-out visitor. Here the
  reader came for an article.
- **`ArticleSidebar` deliberately does not get one.** The sticky header is on
  article pages too, and two identity controls on one screen are two answers to
  one question.
- The `blog` profile in `tds-shared/src/install/profiles.ts` publishes
  `loginUrl`, which the operator sets at `/install`. Without a wizard run the
  sign-in link falls back to `https://auth.tracht-digital.de`, which is the right
  value anyway.

### What it exposed: `.nav-search` was never hidden

The account menu did not fit, and the reason was 168px of search field that had
been rendering at phone widths all along. `.nav-search` declared its own
`display: flex` in this repo's unlayered `global.css`, which beats `.hidden`
from `@layer utilities` — the same trap the CTA and the hamburger already carry
comments about. Nothing overflowed before, so nothing showed it, and
`body { overflow-x: hidden }` would have clipped it if it had. The rule no
longer declares `display`; the `hidden lg:flex` on the element supplies it, as
with `.panel-topbar` in tds-shared. `header.test.ts` pins both halves.

## The tools promo on the index (2026-08-18)

`ToolsPromo.astro` sits between the post grid and `ForYou` on both index pages.
The blog already linked to `tools.tracht-digital.de` from the nav and footer, but
only as a bare destination: a reader had no idea the site does PDFs, labels,
timesheets or OCR, and nothing said the paid tools are a one-off rather than a
subscription.

- It is a plain block on the page's own ground, not a card. This is an editorial
  index, and a boxed advert under the article grid reads as bait.
- The origin comes from `TOOLS_URL` (`lib/nav.ts`) and is never retyped; the
  English tree is the same slugs under `/en`, so only the base changes.
- The footer label was **"Kostenlose Tools" / "Free tools"** and is now
  "Werkzeuge" / "Tools": 8 of the 14 tools over there are premium, so the old
  label had quietly become a false claim.

## Fluid layout (2026-08-18)

The site used to be frozen at 1024px: `max-w-5xl mx-auto px-6` was copied into
**22** files, the largest breakpoint anywhere was `1024px`, `xl:`/`2xl:` did
not occur once, and the card grid stopped at two columns on every screen up to
2560px. It is token- and container-driven now.

* **One shell, one token.** Every page container is `class="tds-shell"`
  (`max-width: var(--tds-shell-max)` + `--tds-gutter`). The blog raises the
  ceiling to **120rem**; the grid answers the extra room with more columns, not
  longer lines. **Expect 1920 and 2560 to render identically** — the column
  count freezes at the cap. That is the editorial answer (bigger content, not
  more of it), not a bug.
* **The card grid has no breakpoint.** `.tds-grid-auto` is
  `repeat(auto-fill, minmax(min(100%, var(--tds-grid-min)), 1fr))` — 1 column
  on a phone, 5 at 1920px, and it reacts to the category rail collapsing
  without either component knowing about the other. `.tds-grid-roomy` raises
  the floor to 22rem for short text cards (topics, RSS programs, ForYou).
  `.grid-span-all` spans a lead item across however many tracks resolved;
  `sm:col-span-2 lg:col-span-3` cannot, because `auto-fill` has no fixed count.
* **The card is a container-query component — and the container is the SLOT.**
  `.post-card-slot` declares `container-type: inline-size`; `.post-card`
  responds. **A container styles its DESCENDANTS: an element can never respond
  to its own `container-type`.** Putting it on the card and writing
  `@container { .post-card { … } }` matches nothing at all — the card looks for
  an ancestor container, finds none, and the rule is dead. This shipped once
  (a 1830px lead card still stacked vertically) and it fails completely
  silently. Above 34rem of slot width the card goes cover-beside-text.
* **Two hard rules around that container.**
  1. **Never wrap a `PostCard` in a flex item.** A flex item takes its base
     size from `max-content`, and size containment makes `max-content` **zero**
     — the card collapses to a 0px sliver and `overflow: hidden` renders it as
     *nothing*. No error, no overflow, no failing test. `.post-card`'s
     `height: 100%` does the row-filling job the old `<li class="flex">` did.
  2. **`container-type` must never land on `body`, `.with-sidebar`,
     `.article-shell`, `.brand-header` or `.print-shell`.** Containment makes
     an element the containing block for `position: fixed` descendants, and
     those subtrees hold `#reading-progress`, `.toc`, the fullscreen mobile
     menu (`inset: 0`) and `.print-controls`.
* **The article shell reserves its rails.** The old
  `left: max(calc(--nav-w / -2), calc((--nav-w + 48rem - 100vw)/2 + .75rem))`
  on `.article-col` is gone. It measured with `100vw` (which counts the
  scrollbar), it sat where focus mode's existing reset could not reach it — so
  the column was a permanent **132px left of centre in focus mode** — and it
  only ever considered the LEFT rail, running the text under the TOC at
  1024px. Now `.with-sidebar`'s own `margin-left` clears the sidebar,
  `.article-shell.has-toc` pads for the TOC, and the column simply centres in
  what is left, landing within 2px of the optical centre of the free band.
* **Headings are fluid.** `.page-title` (`clamp(2.25rem, 1.75rem + 2.2vw,
  4rem)`) replaces the `text-4xl md:text-5xl` pair that was on 12 headings and
  had its larger step arrive at 768px — so the headline was the same size at
  768 as at 2560.
* **`src/__tests__/layout.test.ts` pins all of the above.** It exists because
  every failure listed here is invisible: no error, no overflow, a green build,
  and a page that is simply wrong at a width nobody opened.
* **The scale itself lives in tds-shared (0.24.4).** `.tds-shell`,
  `.tds-grid-auto` and the `--tds-shell-*` / `--tds-measure` / `--tds-grid-min`
  / `--tds-gutter` tokens are in the shared `base.css` / `primitives.css`.
  `global.css` keeps only what this site genuinely sets differently:
  `--tds-shell-max: 120rem` (the shared default is 90rem), `--tds-shell-wide`,
  and `--tds-rail`, which is blog-only because nothing shared has a rail.
  They are **not** in `surfaces/blog.css`: `tds-tools-frontend` renders the
  same blog surface, so a shell width there would silently widen the public
  tools site too.

## How a published article reaches a reader (2026-08-24)

**Not through a repo build any more.** This site is `output: "server"`
(`@astrojs/node`, standalone, under Passenger) behind a file-backed full-page
cache: an article renders on demand and the result is stored as a plain file
`public/.htaccess` serves directly. Saving in the panel rebuilds the cache of
exactly the pages that article dates — its own page, its print view, the index,
the archive, its category, each of its tags, its author page, the feed, the
"Für Sie" index and the sitemap.

A **cache hit is exactly as fast as the old static build, because it is the
same thing**: a file on disk, served by Apache, with Node asleep.

A `workflow_dispatch` release is still what ships *code and design*. Content no
longer needs one — which is the point, since a full build here also re-runs the
DeepL translations and re-renders one OG card per post.

### The moving parts

| Where | What |
|---|---|
| `src/lib/cache.ts` | Which pages a content change dates + the shared `contentCache` memo |
| `src/lib/routes.ts` | The corpus queries the dynamic routes used to express as `getStaticPaths` |
| `src/lib/pageCache.ts` | The single `pageCache(...)` instance both halves share |
| `src/middleware.ts` | Serves hits, stores renders, refuses to store a bad-site-key render |
| `src/pages/tds/cache/[action].ts` | Control plane: `status`, `rebuild`, `purge` |
| `src/lib/sitemap.ts` | The sitemap, built from the corpus |
| `src/lib/sitemapExclusions.ts` | Paths the panel took out of the index, and the tree-pairing an exclusion follows |
| `public/.htaccess` | Cache-first rewrite; ships to `dist/client/.htaccess`, the document root |
| `app.cjs`, `scripts/pack-release.mjs` | Passenger startup file + the release tree it starts from |

### What changed in the routes, and why it had to

- **`getStaticPaths` is not allowed on an on-demand route.** All twelve dynamic
  routes read `Astro.params` and answer 404 themselves; the grouping they used
  to inline lives in `src/lib/routes.ts`. A missing category/tag/author is a
  **404, not an empty page** — an indexable, permanently-200 listing for
  something nobody wrote is worse than nothing.
- **The OG route keeps `getStaticPaths` and stays prerendered**, deliberately.
  It pulls satori + `@resvg/resvg-js` (a native addon), and `src/og/render.ts`
  anchors its font directory to `process.cwd()` — which is the project root
  during a build and a deploy tree with no `src/` at runtime. The cost is that
  an article published after the last deploy has no card of its own until the
  next one; `Layout.astro` falls back to the default card, so it degrades
  rather than breaks.
- **`@astrojs/sitemap` is gone.** It derives entries from the routes the build
  *emits*, and articles are no longer emitted — it would have shipped a sitemap
  containing only `/install` and the error pages it used to filter out, with
  nothing red anywhere. `src/lib/sitemap.ts` replaces it, keeping the exact
  filenames `robots.txt` and Search Console already know, and emitting hreflang
  alternates **only for article slugs**, which really do mirror across trees.

### Things that cost time to find

- **`.htaccess` may not ask for `Options +FollowSymLinks`.** Plesk grants its
  vhosts a restricted `AllowOverride Options=…` that omits it, and an Option the
  host does not allow is **fatal rather than ignored**: Apache answers *every*
  request with 500 and logs `Option FollowSymLinks not allowed here` — the whole
  site, not just the rule that wanted it. It shipped that way with the SSR move
  on 2026-08-24 and took the domain down on every path. `Options -Indexes` is
  all this file may set. Nothing here needs more: per-directory rewriting
  already works under the vhost's own grant (`api.tracht-digital.de` rewrites
  everything with `-Indexes` alone), and the `_tds-cache` symlink is created by
  the same user that owns its target, which satisfies SymLinksIfOwnerMatch. If a
  cache hit ever answers 403, grant it at the **vhost** level in Plesk's
  *Additional Apache directives*, which `AllowOverride` does not restrict.
- **The control plane cannot be middleware.** Astro does not run middleware for
  a path no route matches — it short-circuits into the 404 response. Mounted
  there, every rebuild request came back as this site's own 404 page. And it
  cannot live under `_cache/`: Astro excludes any segment beginning with `_`
  from routing.
- **A POST to it needs `Content-Type: application/json`**, or Astro's
  `security.checkOrigin` rejects it as a cross-site form submission — with a
  message that says nothing about content types.
- **Every module-level memo becomes permanent under SSR.** `content-api.ts`
  (ads, snippets) and `taxonomy.ts` went through `contentCache`, which the
  rebuild invalidates. `translate.ts` is the documented exception: its key
  contains the source text, so an entry cannot go stale — it only gained a
  size ceiling, which a build never needed.
- **`listAllPosts` is the OTHER exception, and it must stay unmemoised.** It is
  the most expensive and most repeated read on the site, so putting it through
  `contentCache` is the obvious next optimization — and it would break
  rebuilds silently. tds-shared's control plane resolves a rebuild's page list
  **before** it invalidates the generation memo (`resolveEvents(…)` then
  `onInvalidate()`), and resolving a `post` event walks the corpus to find the
  saved article and derive its category, tag and author pages. Memoised, that
  lookup would answer from the list read *before* the save: a newly published
  article would not be found, its taxonomy pages would never be rebuilt, and
  the rebuild would report success with nothing red anywhere.
- **The cookie banner and the AdSense config are one fetch, not two.** Both are
  blocks of `/content/landing?lang=de` and `Layout.astro` reads both on every
  render; they used to fetch it separately, and only the ads half was memoised,
  so the banner re-requested it for every page in the generation. They share
  `landingBlocks()` now, which draws the line the memo needs: a reachable API
  answering 404/5xx is a *state* and is remembered as `null`, while a transport
  failure or a rejected site key **throws** — `contentCache` does not remember
  a rejected load, so one hiccup during a single render cannot pin "off" onto
  every later page. Both callers still degrade to their own safe default.
  `content-api.test.ts` pins the call count in all three cases.
- **Bundle a leaf; ship a tree.** `@astrojs/rss` pulls a small tree of XML
  packages, and bundling it cost one failed build per transitive name. It is a
  public-registry package, so it ships in `tds.release.runtimeDependencies`
  instead and npm resolves the rest in one step.

### Running it locally

```bash
npm run build                 # → dist/ + release/ (postbuild assembles + verifies)
cd release && node app.cjs
curl -sI localhost:4321/      # X-TDS-Cache: MISS, then HIT

curl -X POST -H 'x-tds-cache-token: …' -H 'content-type: application/json' \
     -d '{"events":[{"type":"post","id":"mein-artikel","lang":"de"}]}' \
     localhost:4321/tds/cache/rebuild
```

## Status

- `src/pages/index.astro` + `src/pages/en/index.astro` — design-system
  index: featured-post hero (fixed navy), category sidebar with post
  counters (collapsible), flat card grid, live full-text search —
  all in the `BlogIndex` island (posts baked in as build-time props,
  filtering is client-side only; `?q=` round-trips in the URL). The
  nav search field (JournalHeader) drives it via `tds-blog-search`
  CustomEvents; on non-index pages Enter navigates to `/?q=…`.
  Hero + 9 grid cards mirror page 1 of the static pagination
- `src/components/islands/HeroSlider.tsx` — the navy Journal hero on the
  index: a real **carousel track** rotating up to three sets (Empfohlen /
  Aktuelles / Populär). **All sets are rendered side-by-side in `.hero-track`
  (`flex:0 0 100%` per slide, `global.css`) and the component translates the
  track by `-activeIndex*100% (+ live drag px)`** — so a set change *slides*
  the strip and a pointer-drag reveals the neighbouring set instead of blank
  navy (the old build rendered only the active slide, so dragging it exposed an
  empty band). Mouse/touch drag via Pointer Events: the track follows the
  cursor, releasing past `DRAG_THRESHOLD` (64px) snaps to the neighbour,
  otherwise it springs back; the ends **rubber-band** (overscroll ÷3, no wrap
  past first/last on drag) and a real drag swallows the trailing click
  (`suppressClick`). Off-screen slides carry `inert`+`aria-hidden` so their
  links aren't tabbable/clickable. Tabs/arrows/dots wrap via `step`.
  **Every slide LINKS — headline, cover and "Artikel lesen" to the lead
  article, the two secondary titles to their own — and keeping that true is
  the delicate part of the drag gesture. Two rules, both browser-only:**
  - **Never `setPointerCapture` on `pointerdown`.** While an element holds
    pointer capture the browser retargets the compatibility mouse events —
    `click` included — at the capture element, so every `<a>` inside the stage
    stops navigating: the click fires on `.hero-stage` and the link never sees
    it. The hero shipped that way and led nowhere; nothing errored, the cursor
    still said `grab`, and the carousel itself worked. Capture is taken in
    `onPointerMove` instead, once the gesture passes the 6px threshold — a
    plain click never gets that far, and by then `suppressClick` owns the
    trailing click anyway.
  - **The stage must `preventDefault()` on `dragstart`.** Capture on
    pointerdown had been suppressing the browser's *native* drag-and-drop for
    free. Without it, a horizontal press-and-move on the slide's links or
    cover image starts a link drag and Chrome fires `pointercancel` on the
    first move — the track never moves at all, while the arrows and tabs keep
    working. jsdom fires no `pointercancel`, so `HeroSlider.test.tsx` guards
    both rules by reading the source; judge a change here in a browser.
  **It does not auto-rotate** — the set only changes when the reader changes
  it. `prefers-reduced-motion` drops the
  track transition (instant jump) — resolved after hydration into `reducedMotion`
  state to avoid an SSR mismatch. **Empfohlen** is client-scored from the
  `tds-interests` cookie (mirrors `ForYou`, no runtime content-api call)
- `src/components/PostCard.tsx` + `Covers.tsx` — flat card + the six
  abstract brand-geometry covers (slug-hashed variant; photo cover
  when `coverHint` is an http URL). Also rendered statically (no
  hydration) inside `RelatedArticles.astro`. **The covers themselves now
  live in `tds-shared` (0.29.0) and `Covers.tsx` is a re-export**, because
  the landingpage's Journal row draws the same artwork — and the variant is
  a hash of the slug, so a second copy would silently give the same article
  two different pictures on the two public properties. Change the drawings
  there, not here. **Cover URLs are made
  absolute at the data layer** (`content-api.ts` `resolveCoverHint`):
  the content-API persists an uploaded `coverHint` as a storage-relative
  `/uploads/...` path, so `listAllPosts`/`listPopular`/`getPost` prefix
  it with the content-API base before it reaches any `startsWith("http")`
  render gate — otherwise the photo cover would 404 against the blog origin.
- `src/components/islands/NewsletterSignup.tsx` — newsletter block in
  the footer; posts a well-formed message to tds-contact-api (no
  dedicated newsletter backend — Julian gets a signup mail). While
  submitting the button shows the shared `<Spinner size="sm" />` from
  `@tracht-digital-solutions/tds-shared/components` (the one loading
  primitive the blog uses; CSS ships in tds-shared-pkg `styles/base.css`).
- `src/components/ArticleSidebar.astro` — fixed collapsible left nav
  on article pages (lg+ only; small screens keep the top nav via the
  `sidebar` Layout prop). Collapsed = 64px icon rail, CTA becomes a
  phone icon; state persists in localStorage `tds-blog-sidenav`
- `src/lib/sections.ts` — splits rendered article HTML at h2
  boundaries for the collapsible sections + scrollspy TOC on
  `[slug].astro` (TOC renders only with ≥2 sections). The TOC (`.toc`
  in `Article.astro`) is a **fixed rail on the RIGHT viewport edge**
  (`right: 14px`, vertically centered, z-30) that visually merges with
  the brand scrollbar; the article shell reserves `padding-right`
  (`--toc-w`) for it instead of a grid column. **Expanded frontend is a peek
  nav:** the section-heading rows rest faint (`opacity: .5`) + small
  (`.toc-label` `0.6875rem`) and only rise to full opacity/size on
  `.toc:hover`/`:focus-within` — the in-view section (`.toc-link.on`) stays
  legible so the reading position is always visible (scoped
  `.article-shell:not(.toc-collapsed)` so the collapsed rail keeps its own
  label logic). Collapsible to a tick
  rail (toggle + `localStorage["tds-blog-toc"]`, pre-paint restore);
  when collapsed, a heading's floating label (left of the rail) shows
  **only while that `<h2>` is visible in the viewport** (per-heading
  IntersectionObserver → `.in-view`; several can show at once), plus on
  hover/focus — the active section keeps its wider accent tick. A second
  observer fades the rail out (`.rail-off`) once the reader scrolls past
  the article column. Back navigation is a **single arrow-only** control
  (`.back-rail`, a centred SVG arrow) sitting **directly left of the heading**
  (`.title-row`): inline before the `<h1>` on small screens, and on lg+ it
  hangs into the left margin (absolute, `right: 100%`) so the heading isn't
  indented.
- **Reading column is window-centred on sidebar pages** (the "Mitte der Seite"
  fix). The `.with-sidebar` wrapper stays offset by the sidebar (keeps the
  footer/newsletter clear of it), and `--nav-w` (264px / 64px collapsed, set on
  `#page-shift`) drives everything: `.with-sidebar .article-col` is nudged
  left by half of it so it lands on the true viewport centre and
  **doesn't move when the sidebar toggles** (the offset + nudge cancel). Uses
  `position/left`, not `transform`, so the fixed `.toc` keeps its viewport
  anchor. The fixed TOC (right) and sidebar (left) overlay the side whitespace.
  - **The nudge is CLAMPED with `max()`, and that clamp is not optional.** The
    recentring only clears the fixed sidebar while `(100vw − 48rem) / 2 ≥
    --nav-w`, i.e. from ~1296px up. Below that the column slid *under* the
    sidebar — at 1280, the most common desktop width there is, by 8px, so every
    line of every article lost its first characters: the eyebrow rendered
    "ESIGN", the lede "arben, Typografie…". Nothing overflowed, nothing errored,
    nothing logged; the text was painted behind an opaque panel.
  - This note used to call that an "accepted trade-off for exact
    window-centring". **It was not a trade-off worth accepting, and the clamp
    costs nothing:** the second term of the `max()` is the largest shift that
    still leaves a 0.75rem gutter, so viewports ≥1296px keep the exact
    window-centring the rule was written for (measured: 336px at 1440, 576px at
    1920 — both the true centre) and narrower ones stop at the sidebar edge
    instead of behind it.
- `src/pages/page/[num].astro` + `src/pages/en/page/[num].astro` — pages 2..N
- `src/pages/[slug].astro` — article (both DE + EN via the lang prop
  from getStaticPaths); drop-cap on first paragraph, marginalia rail
  with date / reading time / author, RelatedArticles strip, reading-
  progress bar, chronological prev/next footer nav, and the inline
  interest-cookie script (see below)
- `src/pages/[slug]/print.astro` + `src/pages/en/[slug]/print.astro` — the
  **print / PDF view**, opened in its own tab from the "Drucken" button in the
  article header. Both are thin wrappers over `src/components/PrintDoc.astro`
  (shared like `Article.astro`), rendered with Layout `bare` + `noindex` (no
  site chrome; excluded from the sitemap). It's a colourless, single-flow
  rendering (`.prose-print`, hard-coded neutral colours so it never inverts in
  dark mode). The `PrintControls` island renders as a **floating bar on the
  right** (`.print-controls`, `position: fixed`, flat/no shadow) with: a **page
  size** segmented control (A5/A4/A3, sorted small→large — writes both a
  `size-<x>` class on `#print-root` for the sheet preview and an injected
  `@page { size … margin … }` rule for the actual print/PDF); **font size**
  (S/M/L — an `fs-<x>` class driving the `--print-fs` var the body prose reads,
  so the choice carries into print); a **highlighter** (`Markieren` toggle —
  while on, a `mouseup` handler wraps the current selection inside `#print-root`
  in `<mark class="print-mark">`, forced to print via `print-color-adjust:
  exact`; a Clear button unwraps all); and **meta Kippschalter** flipping
  `hide-<key>` classes to show/hide each block (cover/category/summary/date/
  reading/author/link/tags in document-flow order; cover defaults **off**).
  Size/font/meta persist in `localStorage`. The sheet (`.print-doc`) is
  page-sized (`148/210/297mm`) with a 16mm **Seitenabstand** (padding mirrored
  by the `@page` margin);
  `@media print` resets the sheet frame so the margin isn't doubled and drops
  the frontend. A "Drucken / Als PDF" button calls `window.print()`. No runtime
  fetch — the body is baked at build time.
- `src/pages/og/[lang]/[slug].png.ts` — build-time per-post OG image
  via the renderer in `src/og/render.ts` (Satori → Resvg)
- `src/pages/rss.xml.ts` — RSS feed
- `src/components/RelatedArticles.astro` — 3-card same-category strip
  with fallback to most-recent overall (links are language-prefixed:
  `/{slug}` for DE, `/en/{slug}` for EN)
- **Language-aware posts** — every post is reachable in both DE
  (`src/pages/[slug].astro`) and EN (`src/pages/en/[slug].astro`), both thin
  wrappers over the shared `src/components/Article.astro`. A post authored in
  only one language is **machine-translated into the other at build time via
  DeepL** (`src/lib/translate.ts` + `src/lib/localizedPost.ts`): the route
  asks `resolveLocalizedPost(slug, lang)`, which returns the authored version
  or a DeepL-translated one (title/excerpt as text, the rendered HTML with
  `tag_handling=html` so code blocks stay verbatim). Translations are memoised
  per build; a translated page shows a "machine-translated" notice. **Graceful
  fallback**: with `DEEPL_API_KEY` unset or on any API error, the page renders
  the authored-language content — still static, build-time only, build never
  breaks. (Same-slug rows in DE + EN are treated as the two language versions
  of one post.) **Save-time sync note:** tds-content-api now machine-creates
  the counterpart row on save (flagged `machineTranslated` in the API payload),
  so the build-time path above is a rarely-firing fallback for content the
  backfill hasn't covered. `resolveLocalizedPost` treats a stored
  `machineTranslated` row like a build-time translation (`translated: true`) so
  the notice still shows; the flag is optional on tds-shared-pkg's `BlogPost`
  (≥ 0.8.7). `_build.yml` exports the `DEEPL_API_KEY` repo secret into the
  Build step for the fallback (optional; unset = graceful no-op).
- `src/pages/interests-index.json.ts` — build-time static JSON index
  of all posts (slug/lang/category/title/excerpt/tags/publishedAt)
  for the recommendations island
- `src/components/islands/ForYou.tsx` — "Für dich" strip on the DE/EN
  index pages. Reads the `tds-interests` cookie (topic → weight map,
  written by an inline script on every article page from category +
  tags; 180 days, SameSite=Lax, capped at 12 topics), fetches the
  static interests-index.json (never the content-api), scores by
  topic overlap + recency, renders top 3 with a transparency note and
  a reset action. Renders nothing without a profile.
- `src/components/JournalHeader.astro` / `JournalFooter.astro` — chrome.
  Below `md` the section links/search/CTA collapse into a flat slide-down
  frontend behind a hamburger. **The hamburger bars are `.tds-menu-bar*` from
  tds-shared `primitives.css`**, not the old local `.jnl-menu-bar*` — that block
  and the landingpage's were the same rules under two names. The bars stay
  square because `[data-surface="blog"]` sets `--tds-radius-bar: 0`, which was
  the only real difference. Nav links come from `src/lib/nav.ts` (the single
  source shared with `ArticleSidebar.astro`): **Journal**, **Aktuelles**,
  **RSS** — "Kundenportal" lives in the footer only. Active/hover is a flat
  accent underline (`.jnav-item`) / left bar (`.snav-item`), no filled pill.
- `src/pages/aktuelles.astro` + `src/pages/en/aktuelles.astro` — the
  **"Aktuelles"** page: curated "Aktuelle Themen" (the content-api `topics`
  block, admin-maintained, fetched via `listTopics`) rendered as flat
  `.topic-card`s, followed by the newest ~6 posts (`BlogPostCard`). A
  missing/unreachable topics block degrades to just the post list.
- `src/components/BlogPostCard.astro` — list-item component (editorial-grid)
- `src/lib/content-api.ts` — build-time fetch client (cursor-paginated);
  `listTopics(lang)` fetches the `/topics` block for `/aktuelles`;
  `cookieBannerEnabled()` reads the language-agnostic `cookie_banner`
  landing block (`/landing?lang=de`) — `Layout.astro` bakes the shared
  `CookieNotice` island (tds-shared-pkg ≥0.8.8, `client:idle`) on every
  non-bare page when `{ enabled: true }`. Toggled in tds-admin
  (Landingpage → Cookie-Banner); a save fires a blog rebuild. Absent
  block / demo / API down = banner off; dismissal persists per origin
  in localStorage (`tds-cookie-notice`)
- **AdSense monetisation** (blog only) — `adsConfig()` reads the language-
  agnostic `ads` landing block (`{ enabled, publisherId, defaultMode:
  auto|manual, slotInArticle?, slotEndArticle? }`, admin-toggled, blog rebuild
  on save). Per post, `post.adsMode` (`default|off|auto|manual`) overrides it;
  `effectiveAdsMode()` resolves it (master switch + inherit). `Layout.astro`
  loads `adsbygoogle.js` **only after ad consent** — when `ads.enabled` it shows
  the `CookieNotice` **consent** variant (Accept/Decline → `tds-ad-consent`) and
  a `define:vars` inline gate that injects the loader on `granted` (now or via
  the `tds-ad-consent` event); nothing loads and no ad cookie is set beforehand.
  `manual` mode places `AdSlot.astro` units after the intro + before the contact
  CTA (`Article.astro`); `auto` relies on Auto Ads (account-level). `JournalFooter`
  shows an "Werbe-Einwilligung ändern" revoke link when ads are enabled. Off by
  default; the Datenschutz (landingpage) discloses AdSense.
- `src/lib/nav.ts` — shared public-nav item list + active-state helper
- `src/lib/pagination.ts` — page-window slicing
- `src/lib/seo.ts` — org/person identity (mirrors tds-landingpage-frontend)
- `src/lib/jsonld.ts` — Schema.org generators (BlogPosting, Blog,
  WebSite, BreadcrumbList)
- `src/components/JsonLd.astro` — head-injected ld+json utility
- `src/og/render.ts` — Satori + Resvg renderer; fonts under `src/og/fonts/`
- `public/robots.txt` + `public/llms.txt` — discovery files for
  search + AI crawlers
- `scripts/og-smoke.ts` — `npm run og:smoke` for OG regression checks

Markdown rendering uses `set:html` directly. Bodies are admin-only
today — if user-generated content ever ships, sanitise via DOMPurify
or similar.

## Block posts (`bodyFormat = "blocks"`)

A post's body is one of two formats (`post.bodyFormat`, from tds-content-api). A
**markdown** post takes the pipeline above (`renderMarkdown` → `splitSections` →
`set:html`). A **block** post carries a JSON `BlogDocument` (tds-shared-pkg) that
`resolveLocalizedPost` parses into `localized.blocks`; `Article.astro` branches on
that and renders each section body with **`BlockRenderer.astro`** instead of
`set:html`.

- `src/lib/renderBlock.ts` — one block → HTML. Text fields are inline markdown
  (`marked.parseInline`); **code blocks reuse the shared Shiki `renderMarkdown`**
  so highlighting matches the markdown path. `renderBlocksToHtml` flattens a whole
  document (used by the print view).
- `src/components/BlockRenderer.astro` — runs of text/structural blocks render to
  one `.tds-prose` container; **embeds break the flow**: `adsense` → the real
  `<AdSlot>` (its inline push script runs, unlike script injected via `set:html`);
  `custom` → resolved from the `blogSnippets()` catalog (`preset` renders as its
  block, `embed` injects raw HTML — **`<script>` still won't execute** under
  `set:html`, so script-bearing third-party embeds beyond AdSense need their own
  allowlisted component). Video/callout/button are plain HTML (no script).
- `src/lib/blockSections.ts` — the block-aware analogue of `sections.ts`: groups
  blocks at level-2 `heading` blocks so TOC / collapsible / scroll-spy are
  unchanged.
- `blogSnippets()` in `content-api.ts` — build-time snippet catalog fetch (memoised
  for the whole build; empty on demo/outage).

## No decorative motion

The blog does not animate for effect. What used to be here and is now gone:

- **Scroll-reveal.** `[data-reveal]` elements started at `opacity: 0` and rose
  in on an IntersectionObserver, staggered. It was the largest piece of motion
  on the site and it made every list arrive in pieces. Removing it also removed
  the `html.js` flag, which existed *only* so that CSS could hide content
  without trapping no-JS readers behind an `opacity: 0` it would never clear.
- **The 404's looping animations** (`err-glow`, `err-float`, `err-in`). Two of
  the three ran forever, on a page a visitor reaches by accident.
- **The hero carousel's 12s auto-rotation** — content that moved without being
  asked (WCAG 2.2.2). The tabs, arrows, dots and drag all still work; the
  hover/focus "pause" plumbing went with it, because pausing is only needed by
  something that moves on its own.
- **Hover lift on post cards** and the 4px arrow nudges. The growing accent bar
  and the colour change already say "interactive"; the movement was decoration
  layered on a working affordance.
- **The category rail's `transition: width`**, which reflowed the article grid
  next to it on every frame.

**What stays, and why.** Motion that reports something:

| Kept | Because |
|---|---|
| colour / border / opacity transitions on hover + focus | affordance — it says the thing is interactive |
| the nav underline (`scaleX`), dropdown caret, section chevron | they encode **state** (active / open / collapsed) |
| the mobile menu slide | spatial — it says where the panel came from |
| disclosure `grid-template-rows` | ties the expanded panel to the control that opened it |
| the carousel track transform | a response to a deliberate action; `prefers-reduced-motion` drops it |
| `tds-spin`, `tds-skeleton-pulse`, `tds-toast-in`, `tds-modal-in` | from tds-shared; all report loading or an outcome |

The cheap regression check is the built bundle, not the source:

```bash
npm run build && cat dist/_astro/*.css | grep -o "animation:[^;}]*" | sort -u
```

Anything beyond the four `tds-*` keyframes above is new decoration. Note that
`npm run type-check` will NOT catch a broken `<style>` block — astro check does
not parse CSS, so a mangled rule only surfaces at build time.

## Reader focus mode

Article pages pass `focusable` to `Layout`, enabling a **distraction-free reading
toggle** (`html.focus-mode`). Restored pre-paint by a gated inline script in the
Layout head (mirrors the theme/TOC no-flash pattern; keyed `tds-blog-focus`, only
applied on article pages so it never leaks onto listings). The header button
(`#focus-toggle`) + the **`f`** key toggle it, **`Escape`** exits; state persists.
The CSS (`global.css`, `html.focus-mode …`) hides the sidebar/header/footer/TOC/
ads and every `.focus-hide` extra (contact CTA, author bio, related, tags,
prev/next), centring `.article-col`. Fully reversible, no layout dependency on it.

## Blog authors & author pages

Every post now carries a **denormalised author** (`post.author`: name/slug/
avatar/bio) served by tds-content-api's `blog_author` snapshot (synced from the
frontend's app_user). `content-api.ts` widens the list/get shapes to include
`author` + `viewCount` and **resolves the avatar** (`resolveAvatar`, the same
`/uploads/...` → absolute-URL trick as `resolveCoverHint`). The byline replaced
the hard-coded "Julian Tracht" everywhere — `Article.astro` (header byline +
"Über den Autor" block, both **linked** to the author page when present),
`PostCard.tsx` `AuthorChip` (name + avatar), `PrintDoc.astro`, and the OG card
(`og/render.ts`, `author` option). A post **without** an author (deleted user /
legacy) falls back to a neutral, **unlinked** studio byline
(`fallbackAuthorName`) — the page never breaks on a missing author.

**Author pages** — `src/pages/autor/[slug].astro` + `src/pages/en/author/[slug].astro`
(mirror `kategorie/[cat].astro`): `getStaticPaths` groups `listAllPosts(lang)` by
`author.slug`; the profile header shows avatar/name/bio and the
**`AuthorPostList` island** renders the posts with a client-side sort control —
**Datum / Aufrufe / Trend**, where Trend = `viewCount / max(1, days since
publishedAt)` (a recency-weighted popularity proxy). `authorHref(lang, slug)`
lives in `nav.ts`. Indexable (DE + EN), `altUrl={null}` like the category pages
(routes don't mirror by a prefix swap), with a JSON-LD **Person** node. Demo
content ships one author so a no-API build still generates + exercises the pages.

Depends on **tds-shared-pkg ≥ 0.9.1** (the `BlogAuthor` type + `BlogPost.author` /
`authorId` / `viewCount`). Build against the published package — a stale
tds-shared-pkg makes the author types unresolvable.

## Demo / fallback content (`src/lib/demoContent.ts`)

Served when `PUBLIC_DEMO_MODE=true` **or** the content API is unreachable (a
*reachable* API returning zero posts stays empty — see `content-api.ts`). Two
rules:

- **It mirrors the launch articles seeded by `tds-ext-blog-cms-pkg`'s
  `BlogCmsSeedPosts` migration** — same slugs, same titles, condensed bodies.
  A fallback exists so a visitor cannot tell it apart from the real site; the
  three developer-topic articles that used to live here (SSG, design tokens,
  headless CMS) advertised something the business does not sell. Keep slugs and
  titles in step with the migration; the bodies need not match word for word.
- **Every seed carries BOTH languages.** Until 2026-08-16 the seeds were German
  only and `demoPostList("en")` returned the German text labelled `lang: "en"`,
  so an English demo build rendered a German blog with nothing to flag it.

`demoTopics`' hrefs point at tag pages, so each tag it links must actually occur
in some seed's `tags`, and tags are used **verbatim** as the URL segment — keep
them lowercase, hyphenated and free of spaces and umlauts.

## Open

- (nothing tracked here right now — check the GitHub issues)

## SEO + structured data

Layout.astro renders the per-page meta (canonical, hreflang,
OG with image dimensions, Twitter Card, `article:modified_time`,
theme-color) and passes through an optional `jsonLd` prop. The
default description is `siteConfig.description[lang]` (journal
copy with the "Digitalisierung für Unternehmen" keyword), resolved
after the props destructure.

- **Generated pages build their description in `src/lib/metaDescription.ts`,
  never as an inline template literal.** Category, tag, archive and the
  author fallback all interpolate a variable-length name, so their length is
  not knowable from the source — a category called "SEO" and one called
  "Prozessautomatisierung im Mittelstand" differ by 40 characters, and the
  long case ran past what Google renders. The helper is a **two-tier
  sentence**: the rich form when it fits, a shorter COMPLETE sentence when
  the name is long, with `clampToWord` only as the backstop. Truncating the
  rich form instead would leave a dangling clause in the SERP; truncating
  the *name* would misreport what the page lists.
  These descriptions were also far too thin before 2026-08-16 (39–58 chars,
  "Artikel im Journal mit dem Tag „x“."), which is below the length at which
  a description carries information — search engines discard one that thin
  and synthesise their own, so the copy did no work at all.
  `metaDescription.test.ts` asserts ONE budget (80 < n ≤ 160) over every
  generated description at realistic worst-case names, and that the taxonomy
  name always survives — it is the only thing distinguishing one listing page
  from the next.
- **The blog is one of the two INDEXABLE properties, so `siteConfig.description`
  carries both keyword commitments** from the root CLAUDE.md: the exact phrase
  "Digitalisierung für Unternehmen" and the local Schwarzenbek/Hamburg signal.
  The local half was missing entirely until 2026-08-16 — the journal read as a
  generic dev blog with nothing tying it to the business it belongs to.
- **A post's description is its CMS `excerpt`** and an author's is their CMS
  `bio`; both are content, not code. The helper only supplies the fallback for
  an author who has not written a bio.

- **`altUrl` prop (Layout):** `undefined` = auto-derive the hreflang
  alternate by swapping the `/en/` prefix (correct for posts — every
  post exists in both languages via the DeepL build fallback — and
  for name-mirrored twins); `null` = suppress the hreflang links +
  x-default entirely (canonical only); string = explicit URL. The
  listing routes (`tag/`, `kategorie/`↔`en/category/`, `autor/`,
  `page/`) do NOT mirror by prefix, so they must never derive an
  alternate from the path. They now get one from `src/lib/alternates.ts`,
  which **looks the counterpart up in the other language's corpus** and
  returns a path only when that page really exists — `null` otherwise,
  which still renders canonical-only. A German category is usually
  filed under a different English name, so `categoryAlternate` returning
  null is the normal case, not a bug. Never replace these with a prefix
  swap: `/en/tag/webshop` does not exist (English posts are tagged
  `online-shop`), and one dangling alternate invalidates the set on both
  sides.
- **Sitemap** is hand-written in `src/lib/sitemap.ts` plus the two
  endpoints `sitemap-index.xml.ts` / `sitemap-0.xml.ts`.
  `@astrojs/sitemap` was removed: under `output: "server"` it derives
  entries from the routes the build EMITS, and the articles, taxonomy
  and archive pages are not emitted. Deliberately no prefix-derived
  alternates — only article slugs really mirror.
  **`lastmod` is per URL**, from the newest post the URL shows
  (`newestDate`), with the document date as the fallback for an entry
  that has no post behind it. Every entry used to carry today's date,
  which told a crawler the whole site had changed on every fetch. The
  source is `publishedAt`, not `updatedAt`: the content-API's list
  payload has no `updatedAt` (it is set only on the full-post read), so
  an edited article understates its date — the harmless direction.
- **RSS is per-language:** `/rss.xml` (DE) + `/en/rss.xml` (EN); the
  Layout autodiscovery link and the RssInfo explainer both pick the
  feed matching the page language.
- `[slug].astro` emits `BlogPosting` (with author, publisher,
  image, wordCount, inLanguage, datePublished, dateModified) +
  `BreadcrumbList` (Home → category → post).
- Index pages (DE + EN, both page 1 and `/page/[num]`) emit
  `WebSite` + `Blog` graph. The WebSite node has no SearchAction —
  there is no search endpoint; don't add a fake one.
- Organization + Person `@id`s are anchored on `tracht-digital.de`
  (the marketing origin), so this site references them by `@id`
  rather than redefining them.

When updating identity in tds-landingpage-frontend (address/phone/socials),
mirror the change in `src/lib/seo.ts` here so the Organization graph
stays consistent across both domains.

## Don't (additions)

- Don't move the `@fontsource-variable/*` imports from `Layout.astro`
  into a CSS `@import` in `global.css`. `@tailwindcss/postcss` inlines
  CSS `@import`s without rebasing the packages' relative
  `url(./files/*.woff2)` references, so Vite never emits the font
  files — the build ships zero woff2 and every font 404s at runtime
  (shipped broken until 2026-07-07, silent system-font fallback).
  Font faces are JS-style imports in the layout frontmatter.
- Don't import the OG renderer from a runtime React island —
  Satori + Resvg pull in native deps and are build-time only.
- Don't drop the TTFs from `src/og/fonts/`. They're OFL-licensed
  and committed deliberately because @fontsource-variable ships
  woff2 only, which Satori can't read.
- Don't give the Organization or Person a **different** identity here —
  the marketing site is the canonical home, and the `@id` values must
  keep pointing at `tracht-digital.de`. Emitting a *consistent* full
  `organizationSchema()` node on this domain is deliberate and not a
  fork: every `publisher` used to be a bare `@id` reference, so on its
  own the blog's graph named a publisher with no name and no logo —
  the two properties Google's article guidance asks for. The values all
  come from `siteConfig`; keep them in step with the marketing site's
  `seo.ts`.
- ~~Don't delete `src/types/shared-augment.d.ts`.~~ **Stale — the file
  and the whole `src/types/` directory are gone.** `BlogPost.tags`
  ships in tds-shared and the dependency is long since bumped. The one
  field still missing from that type is `metaDescription`, which is
  widened locally as `FullPost` in `src/lib/content-api.ts` rather than
  in tds-shared: only this repo reads it, and a minor there is
  minor-locked by six `0.x` carets.
- Don't write `WithContext<object>` on Schema.org node builders.
  TypeScript treats `object` as too narrow to accept additional
  named property literals (`@type`, `@graph`), and the type-check
  fails with "Object literal may only specify known properties".
  The alias now defaults the generic to `Record<string, unknown>`
  — just write `WithContext` (no explicit type argument).

## Don't

- Don't reintroduce `Disallow: /og/` in `public/robots.txt`. Those are
  the site's own social images — `/og/{lang}/{slug}.png` is the
  `og:image` of every article and the `image` of its `BlogPosting`. The
  rule blocked crawlers from the picture the page told them to fetch;
  `seoContract.test.ts` fails if it comes back.
- Don't pass a raw `excerpt` or a CMS bio straight into
  `description`. Article descriptions go through `postDescription`
  (editor's `metaDescription`, else the excerpt, clamped); author bios
  through `clampToWord`. Only the generated taxonomy descriptions were
  ever measured, so an over-long hand-written one shipped unnoticed.
- Don't build a `<title>` inline. `pageTitle()` in `src/lib/seo.ts`
  owns the `" — Journal"` suffix and the length rule (it drops the
  brand, never the subject). The tab script in `Layout.astro` splits on
  that exact separator.
- Don't call `websiteSchema()` without a language. It used to hard-code
  the German name and description onto every English page.
- ~~Don't fetch posts at runtime. SSG only.~~ **Stale — the opposite is
  true now.** `astro.config.mjs` sets `output: "server"`; every page
  fetches at request time and the file-backed page cache absorbs the
  cost. What still holds is the reason behind the old rule: never do
  per-visitor work on a cached route.
- Don't import `marked` in a React island — it's heavy. Render to
  HTML at build time and pass the resulting string to islands if
  they need it.

## Site key (`TDS_SITE_KEY`)

The credential this site presents to the composed API for its **build-time**
content reads. Issued in the admin portal under *Einstellungen →
Site-Verbindungen*; `src/lib/siteKey.ts` reads it and every fetch in
`src/lib/` carries it.

Optional: unset, the build behaves exactly as before, and the public read routes
stay open unless an admin switched enforcement on.

Four things here were each learned by breaking:

- **`process.env`, never `import.meta.env`.** Astro/Vite inline only `PUBLIC_`
  names there, and this repo declares no `envField` schema, so
  `import.meta.env.TDS_SITE_KEY` would be `undefined` in every build with
  nothing to say so. That is exactly how `TOOLS_REGISTRY_TOKEN` spent its whole
  life. And the obvious "fix" — a `PUBLIC_` prefix — is worse: it inlines the
  credential into the shipped bundle.
- **A `throw` from the fetch helper does NOT fail the build.** Every content
  fetch is wrapped in a fail-soft `try/catch` that warns and returns the baked
  fallback. The first version threw from `assertKeyAccepted`; a real build
  against a 401 stub printed "the build stops here" five times and then
  completed **green**. No source-scanning test could see it.
- **So the guarantee is the `siteKeyGuard()` integration** in
  `astro.config.mjs`, which throws in `astro:build:done` — outside every
  `try/catch`, including one somebody adds later.
- **The rejection list hangs off `globalThis`.** `astro.config.mjs` and the page
  modules are two separate module graphs, so a module-scoped array gives the
  integration its own empty one: the guard reads zero while the pages record
  several. That was the second version and it failed identically — green build,
  message printed, nothing stopped.

Verified as a matrix, because three of the four cells must NOT fail: rejected
key → exit 1; no key against a 401 → exit 0; key set but API unreachable →
exit 0 (an API hiccup must never fail a deploy). `src/lib/siteKey.test.ts` pins
the structural half.

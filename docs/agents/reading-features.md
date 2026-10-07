# Pages and reading features

## Index (`src/pages/index.astro`, `src/pages/en/index.astro`)

Featured-post hero (fixed navy), category sidebar with counters (collapsible), flat card grid and live full-text
search, all in the `BlogIndex` island (posts as props, client-side filtering, `?q=` round-trips). The header's search
field drives it via `tds-blog-search` events; elsewhere Enter navigates to `/?q=…`. Pages 2..N:
`src/pages/page/[num].astro` and the EN twin. `pagination.ts` slices page windows.

## Hero slider (`src/components/islands/HeroSlider.tsx`)

A carousel track rotating up to three sets (Empfohlen / Aktuelles / Populär), all rendered side by side in
`.hero-track`; the component translates the track by `-activeIndex * 100%` plus live drag pixels.

- Pointer drag follows the cursor; past `DRAG_THRESHOLD` (64 px) it snaps to the neighbour, else springs back; the ends
  rubber-band (overscroll ÷ 3); a real drag swallows the trailing click (`suppressClick`). Off-screen slides are
  `inert` + `aria-hidden`.
- **Every slide links** (headline, cover and "Artikel lesen" to the lead article, secondary titles to their own):
  - **Never `setPointerCapture` on `pointerdown`.** Capture retargets the compatibility `click` at the capture element,
    so links stop navigating. Capture is taken in `onPointerMove` once past 6 px.
  - **The stage must `preventDefault()` on `dragstart`**, or a press-and-move on a link starts a native drag and Chrome
    fires `pointercancel`.
  - jsdom fires no `pointercancel`, so `HeroSlider.test.tsx` checks both rules in the source; judge changes in a browser.
- **It does not auto-rotate.** Reduced motion drops the track transition (resolved after hydration).
- **Empfohlen** is scored client-side from the `tds-interests` cookie.

## Cards and covers

`src/components/PostCard.tsx` (also static inside `RelatedArticles.astro`). The six abstract covers live in
**tds-shared** (`Covers.tsx` re-exports them): the variant is a hash of the slug, and the landing page's journal row
draws the same artwork. Change drawings there. A photo cover is used when `coverHint` is an http URL.

## Article page (`src/pages/[slug].astro`, EN twin)

Both are wrappers over `src/components/Article.astro`: drop cap, marginalia (date, reading time, author), related
strip, reading-progress bar, prev/next, and the inline interest-cookie script.

- **`ArticleSidebar.astro`:** fixed collapsible left nav (lg+), a 64 px icon rail when collapsed. **Collapsed by
  default**; only `reader_sidenav` = `"open"` (tds-shared prefs; old key `tds-blog-sidenav`) opens it. The pre-paint
  restore sits in `Layout.astro` as the first child of `#page-shift` (a script beside the `<aside>` ran too early).
- **Sections and TOC** (`src/lib/sections.ts`; `blockSections.ts` for block posts): article HTML is split at h2 into
  collapsible sections with a scrollspy TOC (only with ≥ 2 sections). The TOC is a fixed rail on the right edge
  (`right: 14px`, z-30); the shell reserves `--toc-w`. Expanded, rows rest faint and small and rise on
  `:hover` / `:focus-within`; the in-view row stays legible. Collapsible to a tick rail (`reader_toc`, pre-paint restore);
  collapsed labels show only on hover/focus of a tick. It fades out (`.rail-off`) past the article column.
- **Back control:** one arrow (`.back-rail`) directly left of the heading (`.title-row`), hanging into the margin on lg+.
- **The reading column is window-centred on sidebar pages** and never moves when a rail folds
  (`margin-left: -var(--nav-w)` on lg+, symmetric padding, `margin-inline: auto`).
- **Reading measure:** title, lede and body in `.article-read` (`--read-w: 38rem`); later panels keep `.article-col`
  (48rem).
- **Floating reading tools** (`.reader-tools`): zoom, focus mode, print. lg+: a column left of the text on a sticky
  anchor; below lg: a cluster bottom right above `--tds-bottom-lane` / `--tds-right-lane`. Zoom sets `--reader-zoom`
  on `<html>` (0.9–1.4, `reader_zoom`, pre-paint restore) and scales `.article-zoom` with CSS `zoom`.
- Markdown bodies use `set:html` (admin-authored). If user content ever ships, sanitise.

## Reader focus mode

Article pages pass `focusable` to `Layout` (`html.focus-mode`), restored pre-paint (key `tds-blog-focus`, articles
only). Toggle: the focus button or `f`; `Escape` exits. It hides sidebar, header, footer, TOC, ads and every
`.focus-hide` extra, centring `.article-col`.

## Print / PDF view (`src/pages/[slug]/print.astro`, EN twin)

Wrappers over `src/components/PrintDoc.astro`, rendered `bare` + `noindex`, excluded from the sitemap. Colourless
(`.prose-print`, hard-coded neutrals).

- `PrintControls` (a floating bar; on a phone a sticky bar with back · print · settings): page size A5/A4/A3 (a
  `size-<x>` class plus an injected `@page` rule), font size S/M/L (`--print-fs`), highlighting, and toggles for cover,
  category, summary, date, reading time, author, link, tags (cover off by default). Size, font and toggles persist in
  localStorage.
- **The sheet keeps its true size in mm** and is scaled to the screen with CSS `zoom` (`--print-scale`), never
  `max-width: 100%`. Views: Seite / Breite / 100 %.
- **The preview is measured at true size:** `paginate()` lifts `zoom` while laying out; a heading moves to the next page
  with its block; nothing on the sheet may size by the viewport (`printPaginate.test.ts`). The page number prints from an
  `@page` `@bottom-right` margin box.
- **Highlighting** works by selection on every device ("Markieren", "Markierung entfernen"). Marks are made text node by
  text node, never `extractContents()`; pieces of one selection share `data-mark`. Marker mode is mouse-only.
- Screen gets the hard offsets; paper none.

## Other pages and islands

- **`/aktuelles`** (`aktuelles.astro`, EN twin): curated topics (`listTopics`) as `.topic-card`s, then the newest ~6
  posts (`BlogPostCard`). A missing topics block leaves just the list.
- **"Für dich"** (`islands/ForYou.tsx`): reads the `tds-interests` cookie (topic → weight, written by an inline script on
  article pages from category and tags; 180 days, SameSite=Lax, ≤ 12 topics), fetches `interests-index.json`, scores by
  overlap and recency, renders the top 3 with a transparency note and a reset. Renders nothing without a profile.
- **Newsletter** (`islands/NewsletterSignup.tsx`): posts a message to the contact endpoint (no newsletter backend);
  shows tds-shared's `<Spinner size="sm" />` while sending.
- **Chrome:** `JournalHeader.astro` / `JournalFooter.astro`; nav items from `src/lib/nav.ts` (Journal, Aktuelles, RSS;
  "Kundenportal" only in the footer). Active state is a flat accent underline / left bar.
- **RSS:** `/rss.xml` (DE) and `/en/rss.xml`; `/rss` explains feeds.

# Design

## The `blog` surface

`<html data-surface="blog">` in `Layout.astro` activates tds-shared's `surfaces/blog.css`: every radius 0, no blurred
elevation, the 800 display voice, the display-face eyebrow, `--tds-flat-tint` / `--tds-flat-hover`. `global.css`
imports `base.css` → `primitives.css` → `prose.css` → `app.css` → `surfaces/blog.css`. Fonts: Lato (display), Plus
Jakarta Sans (body), JetBrains Mono.

- **Set a token in the surface layer; never re-declare a shared class in `global.css`.** Removed for good: local
  `--font-*` re-declarations, `.display` / `.display-tight` / `.eyebrow` forks, the `.brand-wordmark` copy,
  `.chip { border-radius: 0 }`, local `--flat-tint` / `--flat-hover`.
- **Decoration is deliberately minimal.** The blog uses none of tds-shared's `.tds-wash`, `.tds-shape*` or
  `.tds-circuit`; it takes `.tds-brandbar` in the footer and `.tds-tone-navy` on the footer. Don't add washes.
- **Long-form typography is `.tds-prose`** from tds-shared's `prose.css`, with `.tds-callout*`, `.tds-block-button`,
  `.tds-video-embed`, `.tds-block-embed`.
- Still local, correctly: `.post-card`, `.post-row`, `.sidenav`, `.toc`, `.btn-flat`, `.btn-back`,
  `.sec-head` / `.sec-body`, `.blog-sidebar` / `.with-sidebar`, `.nav-search`, the hero carousel, the print sheet and
  focus mode.
- **Dark mode:** `themeBootstrapScript` from `tds-shared/astro` via `<script is:inline set:html={…} />` in `<head>`
  (never a template body). Fixed dark surfaces use `--color-surface-navy/-accent/-ink`, elevated ones
  `--color-card`.

## Colour bands, not gaps

Nothing sits on white:

- **The ground is soft:** `body` paints `--color-soft`; the sticky bar mixes soft (a blog-only override on
  `.brand-header`). Not in `surfaces/blog.css`, because the tools site and the shop render the same surface.
- **Every section is a band** (`.jnl-band` = `padding-block`) in one tone: `.jnl-tone-sand`, `-tint`, `-accent`
  (bordeaux), `-navy`, `-ink`. Index: navy hero → tint grid → bordeaux tools promo → sand "Für dich" → ink newsletter →
  navy footer.
- **Blocks take the band's counter-tone** through `--jnl-tile` / `--jnl-tile-hover`. A container that changes
  `--jnl-tile` must re-declare `--jnl-tile-hover` too (a custom property computes where it is declared).
- **Blocks meet at a 1 px seam:** `.jnl-stack` (vertical runs), `.tds-grid-auto.jnl-mosaic` (grids),
  `.jnl-article-end` (the panel stack after an article). The seam is a `gap`, never a line-coloured parent (empty
  `auto-fill` tracks must show the band). Components that can render nothing (`ProductSlot`, `RelatedArticles`,
  `TagList`) take a `class` prop instead of a wrapper.
- **The tokens are measured:** `--color-muted` is 4.26:1 on the tint, so `body` remaps it to `--jnl-muted` (~5.8:1).
  Coral is 4.18:1 on bordeaux, so the accent tone maps accent and eyebrow to white. Secondary text on dark tones is
  white at 0.8. The dark-theme tint takes 20 % primary. White buttons on navy/ink are coral with
  `--color-surface-ink` text.
- **Dark tones never remap `--color-primary`** (slug covers draw with it).
- White stays on purpose for the print sheet and shared floating overlays (`--color-card` at body level).
- `src/__tests__/bands.test.ts` pins it.

## Hard 2D shadows (tds-shared ≥ 0.42)

- A **mosaic** (`.jnl-mosaic`, `.jnl-stack`, `.jnl-article-end`) takes **one** shadow as
  `filter: drop-shadow(...)` on its container (it follows the tiles and ignores empty tracks).
- Single boxes and controls (`.btn-flat`, `.hero-cta`, `.hero-arrow`, `.chip-flat`, `.topic-card`) take the tokens and
  press into them. Dark bands (`.jnl-tone-navy/-ink/-accent`, `.hero-stage`) re-declare black ink.
- Hover and focus lift an interactive element 2 px up-left while its offset grows; a tile leaves the mosaic shadow for
  its own with `z-index: 2`. Print stays flat. The block is the last section of `global.css`.
- Form controls (`.newsletter-input`, the print switches) are pressed **in** with an inset, never lifted by the offset.

## Posts are books

Every post card, list row, "Für dich" tile and the hero cover carries `book book--1…5` (`src/lib/book.ts`): a spine and
a page block whose thickness follows `readingMinutes` (blog-cms ≥ 0.3.0). The page block is the hard shadow, split into
1 px paper/edge lines. Book grids are `.jnl-shelf` (real gaps, no mosaic shadow). Without a length: neutral level 2 and
no label, never an invented page count.

## Fluid layout

- **One shell, one token:** every page container is `.tds-shell`; the blog sets `--tds-shell-max: 120rem` (shared
  default 90rem), plus `--tds-shell-wide` and `--tds-rail`. Not in `surfaces/blog.css` (the tools site shares it).
  1920 and 2560 px render identically by design.
- **The card grid has no breakpoint:** `.tds-grid-auto` (auto-fill, `--tds-grid-min`); `.tds-grid-roomy` (22rem floor);
  `.grid-span-all` for a lead item.
- **The card is a container-query component, and the container is the slot.** `.post-card-slot` declares
  `container-type: inline-size`; `.post-card` responds. An element can never respond to its own `container-type`.
  Above 34rem of slot width the card goes cover-beside-text.
- **Never wrap a `PostCard` in a flex item** (size containment makes `max-content` zero; it collapses invisibly).
- **`container-type` must never land on `body`, `.with-sidebar`, `.article-shell`, `.brand-header` or `.print-shell`**
  (containment makes them containing blocks for fixed descendants).
- **The article shell reserves its rails** (`.with-sidebar` margin, `.article-shell.has-toc` padding); the column
  centres in what's left. No `left` offsets, no `100vw`.
- **Headings are fluid** (`.page-title` = `clamp(2.25rem, 1.75rem + 2.2vw, 4rem)`).
- `src/__tests__/layout.test.ts` pins all of this.

## Header, phone and account

- **The phone is an app** (tds-shared ≥ 0.47): `AppChrome.astro` renders a bottom tab bar (Start · Themen · Suche ·
  [Inhalt on articles] · Mehr), one sheet per tab (`tds-shared/app`, `styles/app-shell.css`). No hamburger, no top bar;
  the header is the page's first line (navy with a light logo over `.hero-stage`, via `body:has(.hero-stage)`) and tucks
  away while reading (`mountAppHeader`). "Themen" lists taxonomy only; sibling sites live under "Mehr".
  `header.test.ts` pins this.
  - **The tab bar owns `--tds-tabbar-lane`**; anything fixed at the bottom must add it.
  - **"Mehr" holds the settings** (theme, language; on articles text size, focus mode, print). Theme, language, text
    size, sidebar and TOC state go through `tds-shared/prefs` (cookie on `.tracht-digital.de` + account sync); focus
    mode stays per device. Pre-paint restores read `window.__tdsPrefs` first, old `tds-blog-*` keys as fallback.
  - **PWA:** prerendered `manifest.webmanifest.ts` and `sw.js.ts`; `/offline` and `/en/offline` list the last 30 kept
    articles. Icons in `public/icons/`.
- **Language switch:** `.tds-lang-toggle` from tds-shared (used in `JournalHeader` and `ArticleSidebar`). Here both
  halves point at the two home pages (the tools site points at the equivalent page; intentional).
- **Account menu:** `AccountMenu` from `tds-shared/components`.
  - **Signed out it renders nothing** (the bar already has a contact CTA).
  - Mounted outside the `hidden lg:flex` cluster; utilities on the wrapper `<div>`, never on `<AccountMenu>`.
  - Signing out reloads the page. `ArticleSidebar` gets no second one.
  - The `blog` install profile publishes `loginUrl`; fallback `https://auth.tracht-digital.de`.
- **`.nav-search` must not declare `display`** in `global.css` (unlayered CSS beats `.hidden` from
  `@layer utilities`); `hidden lg:flex` on the element supplies it.
- **Tools promo** (`ToolsPromo.astro`): the bordeaux band between the grid and "Für dich"; links white and underlined;
  origin from `TOOLS_URL` (`lib/nav.ts`). The footer label is "Werkzeuge" / "Tools" (most tools aren't free).
- Favicon: `public/favicon.png`, the shared logomark.
- A layout script prefixes the tab title with the visible section name.

## No decorative motion

Removed for good: scroll reveal (and the `html.js` flag), the 404's looping animations, the hero's auto-rotation
(WCAG 2.2.2), card hover lift and arrow nudges, the category rail's width transition.

| Kept | Because |
|---|---|
| Colour / border / opacity transitions on hover and focus | Affordance |
| Nav underline (`scaleX`), dropdown caret, section chevron | They encode state |
| Mobile menu slide | Spatial |
| Disclosure `grid-template-rows` | Ties the panel to its control |
| Carousel track transform | Response to a deliberate action; dropped under reduced motion |
| tds-shared's `tds-spin`, `tds-skeleton-pulse`, `tds-toast-in`, `tds-modal-in`, … | Loading or outcome |
| Cross-page fade (`page-transitions.css`) | Replaces the white flash; opacity only |
| Index filter and newsletter confirmation (`transitionUpdate`) | They report a result; native View Transitions, no animation library |

Regression check on the built bundle:
`npm run build && cat dist/_astro/*.css | grep -o "animation:[^;}]*" | sort -u`. Anything not prefixed `tds-` is new
decoration. `npm run type-check` doesn't parse CSS.

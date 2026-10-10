# Content integrations

## Block posts (`bodyFormat = "blocks"`)

A markdown post takes `renderMarkdown` → `splitSections` → `set:html`. A block post carries a JSON `BlogDocument`
(tds-shared) that `resolveLocalizedPost` parses into `localized.blocks`; `Article.astro` renders each section with
`BlockRenderer.astro`.

- `src/lib/renderBlock.ts`: one block → HTML. Text fields are inline markdown (`marked.parseInline`); code blocks reuse
  the shared Shiki `renderMarkdown`. `renderBlocksToHtml` flattens a document (print view).
- `BlockRenderer.astro`: text and structural blocks render into one `.tds-prose` container; **embeds break the flow**:
  `adsense` → a real `<AdSlot>`; `custom` → from the `blogSnippets()` catalog (`preset` renders as its block, `embed`
  injects raw HTML, but `<script>` won't execute under `set:html`, so script-bearing embeds need an allow-listed
  component); `product` → `ProductEmbed.astro`.
- `src/lib/blockSections.ts` groups blocks at level-2 headings for TOC and collapsing.
- Don't import `marked` in a React island; render HTML on the server and pass strings.

## TDShop products (`src/lib/shop-api.ts`)

Two placements read the same public endpoints, fail-soft, memoised per cache generation, rendering **nothing** on failure.

- **Inline:** the `product` block (tds-shared's `BlogBlockSchema`, `integration: "shop"`), rendered by
  `ProductEmbed.astro` outside the prose flow.
- **Inline in markdown:** a paragraph of its own reading `{{produkt:<slug>}}` (or `{{product:…}}`, optional
  `card|inline|list`) is split out by `src/lib/productShortcodes.ts` and rendered by the same `ProductEmbed`. The slug is
  the shop slug **in the article's language** (DE and EN slugs differ). A shortcode inside running text stays prose;
  word count and print view strip embeds. The seeded journal guides (tds-ext-blog-cms `20260728000012`+) use it.
- **Fixed slot:** `ProductSlot.astro` (`blog-article-end`) before `RelatedArticles`, inside `focus-hide`. Its strip
  scrolls sideways; `.jnl-article-end` needs `minmax(0, 1fr)` columns or the strip widens every end panel on phones.

A markdown article's `## Häufige Fragen` / `## Frequently asked questions` section becomes a `FAQPage` node
(`src/lib/articleFaq.ts`): each `###` is a question, built from the rendered HTML so markup and page never differ.

Decisions, not details:

- **No price is rendered here.** Offers pass with `priceCents` and `priceCheckedAt` nulled (a 24-hour price would need
  constant rebuilds).
- **`ProductSlot` is not built on `AdSlot`.** AdSlot is AdSense-specific and consent-gated; a product slot loads and sets
  nothing. Only the labelling is shared.
- **Never rebuild an affiliate URL.** `offer.url` already points at the shop's `/go/{id}`; `attributeOffers()` only
  appends surface and slot.

### If embedded products render blank

These routes are under `/content/shop`. A site key carrying **scopes** passes only the prefixes it lists, so a blog key
scoped to `/content/blog` is rejected and the fail-soft slot renders nothing. Add `/content/shop` to the blog
connection's scopes, or reissue the key without scopes.

## Authors

Every post carries a denormalised `post.author` (name, slug, avatar, bio). `content-api.ts` resolves the avatar to an
absolute URL. The byline renders in `Article.astro` (header and "Über den Autor", linked), `PostCard.tsx`
(`AuthorChip`), `PrintDoc.astro` and the OG card. A post without an author falls back to a neutral, unlinked studio
byline (`fallbackAuthorName`).

**Author pages** `src/pages/autor/[slug].astro` and `src/pages/en/author/[slug].astro`: profile header plus the
`AuthorPostList` island with a sort control (Datum / Aufrufe / Trend = `viewCount / max(1, days since publishedAt)`).
The site sends no view beacon: blog-cms has no view counter (`viewCount` stays empty), and reads are measured by the
consent-gated Besucher-Statistik (`tds-shared/analytics`, panel `/statistik`).
`authorHref(lang, slug)` is in `nav.ts`. Indexable, with a JSON-LD `ProfilePage` + `Person`.

## Cookie banner and AdSense

- `cookieBannerEnabled()` reads the `cookie_banner` landing block; `Layout.astro` renders tds-shared's `CookieNotice`
  (`client:idle`) when enabled. Absent block, demo or API down = off. Dismissal persists per origin
  (`tds-cookie-notice`).
- `adsConfig()` reads the `ads` landing block (`enabled`, `publisherId`, `defaultMode: auto|manual`, slots). Per post,
  `post.adsMode` (`default|off|auto|manual`) overrides it via `effectiveAdsMode()`.
- `adsbygoogle.js` loads **only after ad consent**: when ads are enabled the `CookieNotice` consent variant sets
  `tds-ad-consent`, and a `define:vars` inline gate injects the loader on `granted`. `manual` places `AdSlot.astro` after
  the intro and before the contact CTA; `auto` relies on Auto Ads. The footer shows a "Werbe-Einwilligung ändern" link.
  Off by default; the landing page's privacy policy discloses AdSense.

## Demo / fallback content (`src/lib/demoContent.ts`)

Served when `PUBLIC_DEMO_MODE=true` or the content API is unreachable.

- **It mirrors the launch articles seeded by `tds-ext-blog-cms-pkg`'s `BlogCmsSeedPosts`** (same slugs and titles,
  condensed bodies). Keep slugs and titles in step with the migration.
- **Every seed carries both languages.**
- `demoTopics` links tag pages, so each linked tag must occur in some seed's `tags`; tags are URL segments verbatim
  (lowercase, hyphenated, no spaces or umlauts).
- Demo content ships one author so author pages are exercised.

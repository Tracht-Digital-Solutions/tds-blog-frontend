import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { transitionUpdate } from "@tracht-digital-solutions/tds-shared/motion";
import PostCard, { type CardPost } from "../PostCard";
import HeroSlider from "./HeroSlider";

/**
 * Journal index from the design-system blog template ("Hero + Grid"):
 * featured-post hero on a fixed navy block, category buttons on the
 * left (with post counters, collapsible), flat card grid, live
 * full-text search over title / excerpt / category / tags.
 *
 * Search input lives in the top nav (JournalHeader). It dispatches
 * `tds-blog-search` CustomEvents which this island listens for, and
 * the query round-trips through `?q=` so a refresh keeps the search.
 * Posts arrive as build-time props — no runtime content-api calls.
 */

export interface IndexPost extends CardPost {
  tags?: string | null;
  /** Reads (Besucher-Statistik, else the CMS counter): the "most read" order. */
  viewCount?: number;
}

/** Reading-time bands of the filter bar. A post without a length is in none. */
type LengthBand = "all" | "short" | "medium" | "long";
type SortKey = "new" | "popular";

function inBand(minutes: number | null | undefined, band: LengthBand): boolean {
  if (band === "all") return true;
  if (!minutes) return false;
  if (band === "short") return minutes <= 3;
  if (band === "medium") return minutes > 3 && minutes <= 8;
  return minutes > 8;
}

interface Labels {
  featured: string;
  readArticle: string;
  all: string;
  categories: string;
  expandCats: string;
  collapseCats: string;
  /**
   * Counted nouns as [singular, plural]. German "Treffer" does not inflect
   * and English "result" does, and both languages need the singular for a
   * one-hit filter — "1 Beiträge" and "1 results" are what a hard-coded
   * plural produces, and nothing on the page would have reported it.
   */
  results: readonly [string, string];
  inCategory: readonly [string, string];
  clear: string;
  noResults: string;
  empty: string;
  older: string;
  minRead: string;
  filter: string;
  length: string;
  lengths: Record<LengthBand, string>;
  sort: string;
  sorts: Record<SortKey, string>;
  resetFilters: string;
  closeFilters: string;
  shown: readonly [string, string];
}

/** Pick the singular for exactly one, the plural for everything else. */
function plural(forms: readonly [string, string], n: number): string {
  return n === 1 ? forms[0] : forms[1];
}

const LABELS: Record<"de" | "en", Labels> = {
  de: {
    featured: "Im Fokus",
    readArticle: "Artikel lesen",
    all: "Alle Beiträge",
    categories: "Kategorien",
    expandCats: "Kategorien ausklappen",
    collapseCats: "Kategorien einklappen",
    results: ["Treffer für", "Treffer für"],
    inCategory: ["Beitrag in der Kategorie", "Beiträge in der Kategorie"],
    clear: "Zurücksetzen",
    noResults: "Keine Beiträge gefunden. Versuchen Sie einen anderen Suchbegriff oder Filter.",
    empty: "Noch keine Artikel veröffentlicht.",
    older: "Ältere Artikel",
    minRead: "Min. Lesezeit",
    filter: "Filter",
    length: "Lesezeit",
    lengths: { all: "Alle", short: "Kurz (bis 3 Min.)", medium: "Mittel (4–8 Min.)", long: "Lang (ab 9 Min.)" },
    sort: "Sortierung",
    sorts: { new: "Neueste", popular: "Meistgelesen" },
    resetFilters: "Filter zurücksetzen",
    closeFilters: "Filter schließen",
    shown: ["Beitrag", "Beiträge"],
  },
  en: {
    featured: "Featured",
    readArticle: "Read article",
    all: "All posts",
    categories: "Categories",
    expandCats: "Expand categories",
    collapseCats: "Collapse categories",
    results: ["result for", "results for"],
    inCategory: ["post in category", "posts in category"],
    clear: "Clear",
    noResults: "No posts found. Try a different search term or filter.",
    empty: "No articles published yet.",
    older: "Older articles",
    minRead: "min read",
    filter: "Filter",
    length: "Reading time",
    lengths: { all: "All", short: "Short (up to 3 min)", medium: "Medium (4–8 min)", long: "Long (9+ min)" },
    sort: "Sort",
    sorts: { new: "Newest", popular: "Most read" },
    resetFilters: "Reset filters",
    closeFilters: "Close filters",
    shown: ["post", "posts"],
  },
};

function searchText(post: IndexPost): string {
  return [post.title, post.excerpt, post.category, post.tags ?? ""].join(" ").toLowerCase();
}

function matchesQuery(post: IndexPost, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const text = searchText(post);
  return query.split(/\s+/).every((word) => text.includes(word));
}

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={left ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function CategorySidebar({
  posts,
  cats,
  value,
  onChange,
  collapsed,
  onToggle,
  t,
}: {
  posts: IndexPost[];
  cats: string[];
  value: string;
  onChange: (c: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  t: Labels;
}) {
  const count = (c: string) =>
    c === "all" ? posts.length : posts.filter((p) => p.category === c).length;

  if (collapsed) {
    return (
      <nav className="sidenav" id="blog-cat-rail" aria-label={t.categories}>
        <button
          type="button"
          className="sidenav-toggle"
          onClick={onToggle}
          aria-label={t.expandCats}
          aria-controls="blog-cat-rail"
          aria-expanded="false"
        >
          <Chevron />
        </button>
      </nav>
    );
  }
  return (
    <nav className="sidenav" id="blog-cat-rail" aria-label={t.categories}>
      <div className="sidenav-head">
        <span>{t.categories}</span>
        <button
          type="button"
          className="sidenav-toggle"
          onClick={onToggle}
          aria-label={t.collapseCats}
          aria-controls="blog-cat-rail"
          aria-expanded="true"
        >
          <Chevron left />
        </button>
      </div>
      {/* aria-pressed, because the `on` class is the only other place the
          selected category exists. The mobile chip strip below has carried it
          all along, so the same filter reported its state on a phone and said
          nothing on a desktop — the wider screen is the one with the rail. */}
      {/* One run of tiles with 1px seams; the buttons carry no margin. */}
      <div className="jnl-stack">
        {["all", ...cats].map((c) => (
          <button
            type="button"
            key={c}
            className={`sidenav-item${value === c ? " on" : ""}`}
            aria-pressed={value === c}
            onClick={() => onChange(c)}
          >
            <span>{c === "all" ? t.all : c}</span>
            <span className="cnt">{count(c)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function BlogIndex({
  posts,
  popular = [],
  lang,
  pageSize = 10,
}: {
  posts: IndexPost[];
  popular?: IndexPost[];
  lang: "de" | "en";
  pageSize?: number;
}) {
  const t = LABELS[lang];
  const [cat, setCat] = useState("all");
  const [catsCollapsed, setCatsCollapsed] = useState(false);
  const [q, setQ] = useState("");
  const [band, setBand] = useState<LengthBand>("all");
  const [sort, setSort] = useState<SortKey>("new");
  const [filterOpen, setFilterOpen] = useState(false);
  // The toggle steps aside while the panel is open (tds-shared ≥ 0.57, the
  // same on the Online-Tools and the Digitalmarkt): focus moves into the
  // panel on open and back to the toggle on close, never onto a hidden button.
  const filterToggle = useRef<HTMLButtonElement>(null);
  const filterPanel = useRef<HTMLDivElement>(null);
  const filterMoved = useRef(false);
  useEffect(() => {
    if (!filterMoved.current) return;
    if (filterOpen) filterPanel.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    else filterToggle.current?.focus({ preventScroll: true });
  }, [filterOpen]);
  const openFilter = (open: boolean) => {
    filterMoved.current = true;
    setFilterOpen(open);
  };

  // A deliberate filter change (a category, "clear search") runs as a native
  // View Transition: cards that stay glide to their new slot, the rest fade.
  // Not typing — a transition per keystroke would freeze the page each time.
  // tds-shared's transitionUpdate, not motion: this island is client:load on
  // the index, and an animation runtime there would sit on the first load.
  const pickCat = (next: string) => transitionUpdate(() => flushSync(() => setCat(next)));
  const clearSearch = () => transitionUpdate(() => flushSync(() => setQ("")));
  const pickBand = (next: LengthBand) => transitionUpdate(() => flushSync(() => setBand(next)));
  const pickSort = (next: SortKey) => transitionUpdate(() => flushSync(() => setSort(next)));
  const resetFilters = () =>
    transitionUpdate(() =>
      flushSync(() => {
        setBand("all");
        setSort("new");
      }),
    );
  const activeFilters = (band !== "all" ? 1 : 0) + (sort !== "new" ? 1 : 0);

  // Category list — shared by the desktop sidebar and the mobile/tablet
  // chip strip (the sidebar is lg-only, so small screens need their own).
  const cats = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    [posts],
  );

  // Pick up ?q= on mount and live queries from the nav search.
  useEffect(() => {
    const initial = new URLSearchParams(location.search).get("q");
    if (initial) setQ(initial);
    const onSearch = (e: Event) => setQ((e as CustomEvent<string>).detail ?? "");
    document.addEventListener("tds-blog-search", onSearch);
    document.documentElement.dataset.blogLiveSearch = "true";
    return () => {
      document.removeEventListener("tds-blog-search", onSearch);
      delete document.documentElement.dataset.blogLiveSearch;
    };
  }, []);

  // Keep ?q= in the URL so a refresh preserves the search.
  useEffect(() => {
    const u = new URL(location.href);
    if (q.trim()) u.searchParams.set("q", q.trim());
    else u.searchParams.delete("q");
    history.replaceState(null, "", u);
  }, [q]);

  const searching = q.trim().length > 0;
  // Any filter-bar choice lifts the pagination like a category does: a band
  // or an order over page 1 alone would hide most of the answer.
  const filtering = searching || cat !== "all" || activeFilters > 0;
  const featured = posts[0];

  const matches = useMemo(
    () =>
    {
      const list = posts
        .filter((p) => (cat === "all" ? true : p.category === cat))
        .filter((p) => inBand(p.readingMinutes, band))
        .filter((p) => matchesQuery(p, q));
      // Array.prototype.sort is stable: equal reads keep newest-first.
      if (sort === "popular") list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
      return list;
    },
    [posts, cat, q, band, sort],
  );

  // Unfiltered default view mirrors the static pagination: the hero
  // post plus pageSize-1 grid cards cover page 1, older posts stay
  // behind /page/2. Filtering searches the whole corpus instead.
  const gridPosts = filtering
    ? matches
    : matches.filter((p) => p !== featured).slice(0, pageSize - 1);
  const hasOlder = !filtering && matches.length > pageSize;
  const quoted = lang === "de" ? `„${q.trim()}“` : `“${q.trim()}”`;

  // What the status region announces. Typing in the nav search and pressing a
  // category button both replace the grid in place, and neither moved focus or
  // said anything — a screen-reader user got silence and a changed page. Empty
  // in the unfiltered default so the region says nothing on load; the search
  // case repeats the summary that is already on screen, the category case has
  // no visible counterpart at all.
  const statusMessage = searching
    ? `${matches.length} ${plural(t.results, matches.length)} ${quoted}`
    : cat !== "all"
      ? `${matches.length} ${plural(t.inCategory, matches.length)} ${cat}`
      : activeFilters > 0
        ? `${matches.length} ${plural(t.shown, matches.length)}`
        : "";

  const GridHeading = searching ? "h1" : "h2";

  if (posts.length === 0) {
    return (
      <div className="jnl-band jnl-tone-tint">
        <p className="tds-shell text-[var(--color-muted)] italic">{t.empty}</p>
      </div>
    );
  }

  return (
    <div id="blog-index-island">
      {!searching && featured && (
        <HeroSlider latest={posts} popular={popular} lang={lang} />
      )}

      {/* A tint band flush under the navy hero. Its spacing is the band's own
          padding; the rail stands one shelf gutter beside the books
          (.blog-index-row), and the "older" link hangs on a 1px seam. */}
      <section className="jnl-band jnl-tone-tint">
        <div className="tds-shell blog-index-row lg:flex lg:items-start">
          <div
            // Width changes instantly. Animating `width` reflows the article
            // grid beside it on every frame, so the 320ms transition made the
            // whole listing judder for the sake of a decorative slide.
            //
            // The two widths used to be inline pixels (216 / 30). They are CSS
            // now because the expanded rail is fluid — var(--tds-rail) is a
            // clamp() that grows with the screen, and an inline style cannot be
            // a clamp of the viewport.
            className={`hidden lg:block shrink-0 blog-cat-rail${catsCollapsed ? " is-collapsed" : ""}`}
          >
            <CategorySidebar
              posts={posts}
              cats={cats}
              value={cat}
              onChange={pickCat}
              collapsed={catsCollapsed}
              onToggle={() => setCatsCollapsed((v) => !v)}
              t={t}
            />
          </div>
          <div className="min-w-0 flex-1">
            {/* Mobile + tablet category filter — the sidebar is lg-only, so
                small screens get a horizontally scrollable chip strip. */}
            <div className="lg:hidden pb-6 overflow-x-auto blog-cat-strip">
              <div className="flex gap-2 w-max">
                {["all", ...cats].map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`chip-flat${cat === c ? " on" : ""}`}
                    onClick={() => pickCat(c)}
                    aria-pressed={cat === c}
                  >
                    {c === "all" ? t.all : c}
                  </button>
                ))}
              </div>
            </div>

            <p className="sr-only" role="status">
              {statusMessage}
            </p>

            {searching && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-muted)" }}>
                  {matches.length} {plural(t.results, matches.length)} {quoted}
                </span>
                <button type="button" className="chip-flat" onClick={clearSearch}>
                  {t.clear}
                </button>
              </div>
            )}

            {/* Heading row: the listing's heading on the left, the filter
                toggle (tds-shared .tds-filterbar__toggle, a brand button) on
                the right; its panel opens below the row. Categories stay in
                the rail and the strip above. */}
            <div className="blog-grid-head">
              {/* The page's only <h1> lives in HeroSlider — and the hero is not
                  rendered while a search is running, so the results view shipped
                  with no top-level heading at all. This heading takes the rank
                  over in exactly that state. Nothing moves: no shared rule
                  targets a bare h1/h2, Tailwind's preflight normalises both, and
                  the size is set inline either way. */}
              <GridHeading
                className="display-tight"
                style={{ fontSize: "1.625rem", margin: 0, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}
              >
                <svg
                  className="head-ico"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                {cat === "all" ? t.all : cat}
              </GridHeading>
              <button
                type="button"
                className="btn btn-primary tds-filterbar__toggle"
                data-filter-toggle=""
                ref={filterToggle}
                hidden={filterOpen}
                aria-expanded={filterOpen}
                aria-controls="blog-filter"
                onClick={() => openFilter(true)}
              >
                <svg className="tds-filterbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
                  <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
                </svg>
                <span className="tds-filterbar__label">{t.filter}</span>
                <span className="tds-filterbar__count">{activeFilters > 0 ? activeFilters : ""}</span>
              </button>
            </div>
            <div
              className="tds-filterbar__panel"
              id="blog-filter"
              ref={filterPanel}
              hidden={!filterOpen}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  openFilter(false);
                }
              }}
            >
              <fieldset className="tds-filterbar__group">
                <legend className="tds-filterbar__legend">{t.length}</legend>
                <div className="tds-toolbar">
                  {(["all", "short", "medium", "long"] as const).map((b) => (
                    <button type="button" key={b} className="chip" aria-pressed={band === b} onClick={() => pickBand(b)}>
                      {t.lengths[b]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="tds-filterbar__group">
                <legend className="tds-filterbar__legend">{t.sort}</legend>
                <div className="tds-toolbar">
                  {(["new", "popular"] as const).map((k) => (
                    <button type="button" key={k} className="chip" aria-pressed={sort === k} onClick={() => pickSort(k)}>
                      {t.sorts[k]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <button type="button" className="tds-filterbar__reset" disabled={activeFilters === 0} onClick={resetFilters}>
                {t.resetFilters}
              </button>
              <button
                type="button"
                className="tds-filterbar__close"
                aria-label={t.closeFilters}
                title={t.closeFilters}
                onClick={() => openFilter(false)}
              />
            </div>


            {gridPosts.length === 0 ? (
              <p style={{ padding: "48px 0", color: "var(--color-muted)" }}>
                {filtering ? t.noResults : t.empty}
              </p>
            ) : (
              // Intrinsic grid: no breakpoint at any width. `auto-fill` derives
              // the column count from the space actually left beside the rail,
              // so collapsing the rail adds a column without either component
              // knowing about the other. The old `sm:grid-cols-2` capped the
              // listing at two columns on every screen up to 2560px.
              //
              // No inline `gap` here on purpose: an inline style outranks the
              // unlayered .tds-grid-auto class, so a leftover `style={{gap:20}}`
              // would silently pin the gutter and the token would do nothing.
              // `jnl-mosaic` narrows it to the 1px seam.
              <div className="tds-grid-auto jnl-mosaic jnl-shelf">
                {gridPosts.map((p) => (
                  // The SLOT is the container query container, never the card:
                  // a container styles its descendants, so a card can never
                  // respond to its own container-type.
                  <div
                    className="post-card-slot tds-vt-item"
                    key={p.slug}
                    style={{ "--tds-vt-name": `post-${p.slug}` } as CSSProperties}
                  >
                    <PostCard post={p} lang={lang} />
                  </div>
                ))}
              </div>
            )}

            {hasOlder && (
              // Hangs under the grid on the same 1px seam instead of floating
              // 28px below it.
              <nav style={{ paddingTop: 1, display: "flex", justifyContent: "flex-end" }}>
                <a className="btn-back" href={lang === "de" ? "/page/2" : "/en/page/2"}>
                  {t.older} <span aria-hidden="true">→</span>
                </a>
              </nav>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

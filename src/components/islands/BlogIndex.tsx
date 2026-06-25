import { useEffect, useMemo, useState } from "react";
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
}

interface Labels {
  featured: string;
  readArticle: string;
  all: string;
  categories: string;
  expandCats: string;
  collapseCats: string;
  results: string;
  clear: string;
  noResults: string;
  empty: string;
  older: string;
  minRead: string;
}

const LABELS: Record<"de" | "en", Labels> = {
  de: {
    featured: "Im Fokus",
    readArticle: "Artikel lesen",
    all: "Alle Beiträge",
    categories: "Kategorien",
    expandCats: "Kategorien ausklappen",
    collapseCats: "Kategorien einklappen",
    results: "Treffer für",
    clear: "Zurücksetzen",
    noResults: "Keine Beiträge gefunden. Versuchen Sie einen anderen Suchbegriff.",
    empty: "Noch keine Artikel veröffentlicht.",
    older: "Ältere Artikel",
    minRead: "Min. Lesezeit",
  },
  en: {
    featured: "Featured",
    readArticle: "Read article",
    all: "All posts",
    categories: "Categories",
    expandCats: "Expand categories",
    collapseCats: "Collapse categories",
    results: "results for",
    clear: "Clear",
    noResults: "No posts found. Try a different search term.",
    empty: "No articles published yet.",
    older: "Older articles",
    minRead: "min read",
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
      <nav className="sidenav" aria-label={t.categories}>
        <button
          type="button"
          className="sidenav-toggle"
          onClick={onToggle}
          aria-label={t.expandCats}
          aria-expanded="false"
        >
          <Chevron />
        </button>
      </nav>
    );
  }
  return (
    <nav className="sidenav" aria-label={t.categories}>
      <div className="sidenav-head">
        <span>{t.categories}</span>
        <button
          type="button"
          className="sidenav-toggle"
          onClick={onToggle}
          aria-label={t.collapseCats}
          aria-expanded="true"
        >
          <Chevron left />
        </button>
      </div>
      {["all", ...cats].map((c) => (
        <button
          type="button"
          key={c}
          className={`sidenav-item${value === c ? " on" : ""}`}
          onClick={() => onChange(c)}
        >
          <span>{c === "all" ? t.all : c}</span>
          <span className="cnt">{count(c)}</span>
        </button>
      ))}
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
  const filtering = searching || cat !== "all";
  const featured = posts[0];

  const matches = useMemo(
    () =>
      posts
        .filter((p) => (cat === "all" ? true : p.category === cat))
        .filter((p) => matchesQuery(p, q)),
    [posts, cat, q],
  );

  // Unfiltered default view mirrors the static pagination: the hero
  // post plus pageSize-1 grid cards cover page 1, older posts stay
  // behind /page/2. Filtering searches the whole corpus instead.
  const gridPosts = filtering
    ? matches
    : matches.filter((p) => p !== featured).slice(0, pageSize - 1);
  const hasOlder = !filtering && matches.length > pageSize;
  const quoted = lang === "de" ? `„${q.trim()}“` : `“${q.trim()}”`;

  if (posts.length === 0) {
    return <p className="max-w-5xl mx-auto px-6 py-16 text-[var(--color-muted)] italic">{t.empty}</p>;
  }

  return (
    <div id="blog-index-island">
      {!searching && featured && (
        <HeroSlider latest={posts} popular={popular} lang={lang} />
      )}

      <section
        className="max-w-5xl mx-auto px-6 lg:flex lg:items-start lg:gap-8"
        style={{ paddingTop: 40, paddingBottom: 56 }}
      >
        <div
          className="hidden lg:block shrink-0"
          style={{ width: catsCollapsed ? 30 : 216, transition: "width 320ms ease" }}
        >
          <CategorySidebar
            posts={posts}
            cats={cats}
            value={cat}
            onChange={setCat}
            collapsed={catsCollapsed}
            onToggle={() => setCatsCollapsed((v) => !v)}
            t={t}
          />
        </div>
        <div className="min-w-0 flex-1">
          {/* Mobile + tablet category filter — the sidebar is lg-only, so
              small screens get a horizontally scrollable chip strip. */}
          <div className="lg:hidden -mx-6 px-6 mb-6 overflow-x-auto blog-cat-strip">
            <div className="flex gap-2 w-max">
              {["all", ...cats].map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`chip-flat${cat === c ? " on" : ""}`}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                >
                  {c === "all" ? t.all : c}
                </button>
              ))}
            </div>
          </div>

          {searching && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-muted)" }}>
                {matches.length} {t.results} {quoted}
              </span>
              <button type="button" className="chip-flat" onClick={() => setQ("")}>
                {t.clear}
              </button>
            </div>
          )}

          <h2
            className="display-tight"
            style={{ fontSize: "1.625rem", margin: "0 0 18px" }}
          >
            {cat === "all" ? t.all : cat}
          </h2>

          {gridPosts.length === 0 ? (
            <p style={{ padding: "48px 0", color: "var(--color-muted)" }}>
              {searching ? t.noResults : t.empty}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2" style={{ gap: 20 }}>
              {gridPosts.map((p) => (
                <PostCard key={p.slug} post={p} lang={lang} />
              ))}
            </div>
          )}

          {hasOlder && (
            <nav style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
              <a className="btn-back" href={lang === "de" ? "/page/2" : "/en/page/2"}>
                {t.older} <span aria-hidden="true">→</span>
              </a>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}

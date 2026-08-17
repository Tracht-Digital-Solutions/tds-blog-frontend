import { useMemo, useState } from "react";
import PostCard, { type CardPost } from "../PostCard";

/**
 * Sortable grid of an author's posts. Client island so the sort control is
 * interactive on the otherwise-static author page. Sort keys:
 *   - date   → newest published first
 *   - views  → highest accumulated view_count first
 *   - trend  → views per day since publication (a recency-weighted proxy),
 *              `viewCount / max(1, days since publishedAt)`
 */
export interface AuthorPost extends CardPost {
  viewCount?: number;
  tags?: string | null;
}

type SortKey = "date" | "views" | "trend";

function daysSince(publishedAt: string | null): number {
  if (!publishedAt) return 1;
  const then = new Date(publishedAt).getTime();
  if (Number.isNaN(then)) return 1;
  const days = (Date.now() - then) / 86_400_000;
  return Math.max(1, days);
}

function trendScore(p: AuthorPost): number {
  return (p.viewCount ?? 0) / daysSince(p.publishedAt);
}

export default function AuthorPostList({
  posts,
  lang,
}: {
  posts: AuthorPost[];
  lang: "de" | "en";
}) {
  const [sort, setSort] = useState<SortKey>("date");

  const labels =
    lang === "de"
      ? { sortBy: "Sortieren", date: "Datum", views: "Aufrufe", trend: "Trend" }
      : { sortBy: "Sort by", date: "Date", views: "Views", trend: "Trending" };

  const sorted = useMemo(() => {
    const list = [...posts];
    switch (sort) {
      case "views":
        list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
        break;
      case "trend":
        list.sort((a, b) => trendScore(b) - trendScore(a));
        break;
      case "date":
      default:
        list.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
        break;
    }
    return list;
  }, [posts, sort]);

  const options: { key: SortKey; label: string }[] = [
    { key: "date", label: labels.date },
    { key: "views", label: labels.views },
    { key: "trend", label: labels.trend },
  ];

  return (
    <div>
      <div
        role="group"
        aria-label={labels.sortBy}
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}
      >
        <span className="eyebrow" style={{ color: "var(--color-muted)" }}>
          {labels.sortBy}
        </span>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setSort(o.key)}
            aria-pressed={sort === o.key}
            className="author-sort-btn"
            data-active={sort === o.key ? "" : undefined}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Was a hand-rolled auto-fill grid with an inline 260px floor and a
          20px gap. Same idea, but the shared class takes both from tokens, so
          this list widens with the page like every other grid on the site. */}
      <ul className="tds-grid-auto list-none p-0 m-0">
        {sorted.map((p) => (
          // No `display: flex` here — see the note in RelatedArticles.astro:
          // a flex item under size containment collapses to zero width.
          <li className="post-card-slot" key={p.slug}>
            <PostCard post={p} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";

/**
 * "Für dich" — interest-based recommendations on the journal index.
 *
 * Reads the `tds-interests` cookie (written by the inline script on
 * every article page: topic → weight), fetches the build-time
 * /interests-index.json and ranks posts by how strongly their
 * category + tags overlap with the profile; ties break by recency.
 * Renders nothing when there is no profile or no scoring match, so
 * first-time visitors never see an empty shell.
 *
 * Everything stays in the browser: the cookie is first-party, the
 * index is a static file baked at build time — no runtime call to the
 * content-api, no server-side tracking. The reset action deletes the
 * cookie and hides the section.
 */

interface IndexedPost {
  slug: string;
  lang: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string | null;
  publishedAt: string | null;
}

const COOKIE = "tds-interests";

const LABELS = {
  de: {
    eyebrow: "Für dich",
    heading: "Weil du dafür gelesen hast.",
    note: "Basiert auf den Themen der Artikel, die du hier gelesen hast — gespeichert nur in deinem Browser.",
    reset: "Zurücksetzen",
    read: "Lesen →",
  },
  en: {
    eyebrow: "For you",
    heading: "Because you read about this.",
    note: "Based on the topics of articles you read here — stored only in your browser.",
    reset: "Reset",
    read: "Read →",
  },
} as const;

function readWeights(): Record<string, number> | null {
  const match = document.cookie.match(/(?:^|; )tds-interests=([^;]*)/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : null;
  } catch {
    return null;
  }
}

function topicsOf(post: IndexedPost): string[] {
  return [post.category, ...(post.tags ?? "").split(",")]
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export default function ForYou({ lang, limit = 3 }: { lang: "de" | "en"; limit?: number }) {
  const [picks, setPicks] = useState<IndexedPost[]>([]);
  const t = LABELS[lang];

  useEffect(() => {
    const weights = readWeights();
    if (!weights || Object.keys(weights).length === 0) return;

    fetch("/interests-index.json")
      .then((res) => (res.ok ? (res.json() as Promise<IndexedPost[]>) : null))
      .then((all) => {
        if (!all) return;
        const scored = all
          .filter((p) => p.lang === lang)
          .map((p) => ({
            post: p,
            score: topicsOf(p).reduce((sum, topic) => sum + (weights[topic] ?? 0), 0),
          }))
          .filter((s) => s.score > 0)
          .sort(
            (a, b) =>
              b.score - a.score ||
              (b.post.publishedAt ?? "").localeCompare(a.post.publishedAt ?? ""),
          )
          .slice(0, limit)
          .map((s) => s.post);
        if (scored.length > 0) setPicks(scored);
      })
      .catch(() => {
        /* static index missing — stay invisible */
      });
  }, [lang, limit]);

  const reset = () => {
    document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
    setPicks([]);
  };

  if (picks.length === 0) return null;

  const locale = lang === "de" ? "de-DE" : "en-US";

  return (
    <aside className="mb-14 pb-12 hairline-b" aria-labelledby="for-you-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
        <div>
          <p className="section-num mb-3">{t.eyebrow}</p>
          <h2 id="for-you-heading" className="display-tight text-3xl">
            {t.heading}
          </h2>
        </div>
        <button
          type="button"
          onClick={reset}
          className="link-underline text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
        >
          {t.reset}
        </button>
      </div>

      <ul className="grid md:grid-cols-3 gap-8 md:gap-10">
        {picks.map((p) => (
          <li key={p.slug}>
            {/* Article pages for both languages live at the root route. */}
            <a href={`/${p.slug}`} className="block group">
              <p className="eyebrow mb-2">{p.category}</p>
              <h3 className="display-tight text-xl mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3 mb-3">
                {p.excerpt}
              </p>
              <div className="text-xs text-[var(--color-muted)] flex items-center justify-between gap-3">
                {p.publishedAt && (
                  <time className="tabular" dateTime={p.publishedAt}>
                    {new Date(p.publishedAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </time>
                )}
                <span className="link-underline text-[var(--color-accent)]">{t.read}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <p className="marginalia mt-6">{t.note}</p>
    </aside>
  );
}

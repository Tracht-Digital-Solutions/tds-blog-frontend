import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AuthorChip, formatPostDate, type CardPost } from "../PostCard";
import { PostCover } from "../Covers";

/**
 * Journal hero slider — the navy featured block on the blog index, now
 * a three-set carousel that rotates between:
 *
 *   • Empfohlen — interest-based picks scored from the first-party
 *     `tds-interests` cookie (same logic as the ForYou strip). The tab
 *     only appears once a reading profile exists, so first-time
 *     visitors never see an empty set.
 *   • Aktuelles — the newest posts (baked in at build time).
 *   • Populär  — most-viewed posts from /blog/popular (baked in at
 *     build time; views are tallied by the article-page beacon).
 *
 * Everything is build-time data except the recommendation scoring,
 * which stays in the browser — no runtime content-api call. Auto-
 * rotation pauses on hover/focus and honours prefers-reduced-motion.
 */

export type SliderPost = CardPost & { tags?: string | null };

type SetId = "empfohlen" | "aktuelles" | "populaer";

interface SetMeta {
  id: SetId;
  label: string;
  blurb: string;
}

const LABELS: Record<"de" | "en", { intro: string; sets: Record<SetId, SetMeta>; read: string; more: string }> = {
  de: {
    intro: "Einblicke für den Mittelstand",
    read: "Artikel lesen",
    more: "Mehr aus dieser Auswahl",
    sets: {
      empfohlen: { id: "empfohlen", label: "Empfohlen", blurb: "Für Sie ausgewählt" },
      aktuelles: { id: "aktuelles", label: "Aktuelles", blurb: "Die neuesten Beiträge" },
      populaer: { id: "populaer", label: "Populär", blurb: "Am meisten gelesen" },
    },
  },
  en: {
    intro: "Insights for the Mittelstand",
    read: "Read article",
    more: "More from this set",
    sets: {
      empfohlen: { id: "empfohlen", label: "For you", blurb: "Picked for you" },
      aktuelles: { id: "aktuelles", label: "Latest", blurb: "The newest posts" },
      populaer: { id: "populaer", label: "Popular", blurb: "Most read" },
    },
  },
};

const ROTATE_MS = 12000;
// Drag distance (px) past which a release advances to the prev/next set.
const DRAG_THRESHOLD = 64;

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

function topicsOf(post: SliderPost): string[] {
  return [post.category, ...(post.tags ?? "").split(",")]
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hrefFor(lang: "de" | "en", slug: string): string {
  return `${lang === "en" ? "/en" : ""}/${slug}`;
}

function Slide({ posts, meta, lang, t }: { posts: SliderPost[]; meta: SetMeta; lang: "de" | "en"; t: (typeof LABELS)["de"] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  const secondary = rest.slice(0, 2);

  return (
    <div className="hero-grid grid md:grid-cols-2 gap-8 md:gap-11">
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span className="eyebrow" style={{ color: "var(--color-accent-pink)" }}>
            {meta.label}
          </span>
          <span aria-hidden="true" style={{ width: 4, height: 4, background: "rgba(255,255,255,.4)" }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.6)" }}>{lead.category}</span>
        </div>
        <a href={hrefFor(lang, lead.slug)} style={{ textDecoration: "none", color: "inherit" }}>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", margin: 0, textWrap: "balance" }}>
            {lead.title}
          </h2>
        </a>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(255,255,255,.75)",
            margin: "14px 0 0",
            maxWidth: "54ch",
            textWrap: "pretty",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {lead.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
          <AuthorChip inverse />
          {lead.publishedAt && (
            <span className="tabular" style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>
              {formatPostDate(lead.publishedAt, lang)}
            </span>
          )}
        </div>
        <a
          href={hrefFor(lang, lead.slug)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 22,
            height: 48,
            padding: "0 24px",
            background: "#fff",
            color: "var(--color-surface-navy)",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {t.read} <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="hidden sm:flex" style={{ flexDirection: "column", justifyContent: "center", gap: 16, minHeight: 0 }}>
        <div className="hero-cover" style={{ overflow: "hidden", position: "relative" }}>
          <PostCover slug={lead.slug} coverHint={lead.coverHint} title={lead.title} style={{ position: "absolute", inset: 0 }} />
        </div>
        {secondary.length > 0 && (
          <ul className="list-none p-0 m-0" style={{ display: "grid", gap: 8 }}>
            {secondary.map((p) => (
              <li key={p.slug}>
                <a
                  href={hrefFor(lang, p.slug)}
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "rgba(255,255,255,.78)",
                    textDecoration: "none",
                    fontSize: 13.5,
                    lineHeight: 1.4,
                  }}
                >
                  <span aria-hidden="true" style={{ color: "var(--color-accent-pink)" }}>
                    →
                  </span>
                  <span style={{ textWrap: "balance" }}>{p.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function HeroSlider({
  latest,
  popular,
  lang,
}: {
  latest: SliderPost[];
  popular: SliderPost[];
  lang: "de" | "en";
}) {
  const t = LABELS[lang];
  const [recommended, setRecommended] = useState<SliderPost[]>([]);
  const [active, setActive] = useState<SetId>("aktuelles");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const interacted = useRef(false);

  // Resolve prefers-reduced-motion after hydration (avoids an SSR mismatch);
  // it gates the track slide transition below.
  useEffect(() => setReducedMotion(prefersReducedMotion()), []);

  // Score recommendations from the interest cookie against the baked
  // candidate set — client-only, mirrors ForYou. No content-api call.
  useEffect(() => {
    const weights = readWeights();
    if (!weights || Object.keys(weights).length === 0) return;
    const scored = latest
      .map((post) => ({
        post,
        score: topicsOf(post).reduce((sum, topic) => sum + (weights[topic] ?? 0), 0),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || (b.post.publishedAt ?? "").localeCompare(a.post.publishedAt ?? ""))
      .slice(0, 4)
      .map((s) => s.post);
    if (scored.length > 0) {
      setRecommended(scored);
      // Prefer the personalised set on first load, unless the visitor
      // already picked a tab.
      if (!interacted.current) setActive("empfohlen");
    }
  }, [latest]);

  // The sets that actually have content, in display order.
  const sets: { meta: SetMeta; posts: SliderPost[] }[] = [];
  if (recommended.length > 0) sets.push({ meta: t.sets.empfohlen, posts: recommended });
  if (latest.length > 0) sets.push({ meta: t.sets.aktuelles, posts: latest });
  if (popular.length > 0) sets.push({ meta: t.sets.populaer, posts: popular });

  const order = sets.map((s) => s.meta.id);
  const activeIndex = Math.max(0, order.indexOf(active));

  const go = useCallback(
    (id: SetId) => {
      interacted.current = true;
      setActive(id);
    },
    [],
  );

  const step = useCallback(
    (dir: number) => {
      if (order.length < 2) return;
      const next = order[(activeIndex + dir + order.length) % order.length];
      setActive(next);
    },
    [order, activeIndex],
  );

  // Pointer-drag the slider left/right to flip sets (mouse + touch via the
  // Pointer Events API). The panel follows the cursor live; releasing past
  // DRAG_THRESHOLD advances, otherwise it springs back. A real drag swallows
  // the trailing click so dragging off a link doesn't navigate.
  const drag = useRef({ startX: 0, dx: 0, active: false, moved: false });
  const [dragDX, setDragDX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const suppressClick = useRef(false);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (order.length < 2) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.current = { startX: e.clientX, dx: 0, active: true, moved: false };
      setDragging(true);
      setPaused(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [order.length],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const s = drag.current;
      if (!s.active) return;
      let dx = e.clientX - s.startX;
      // Rubber-band at the ends: the track has no wrap-around slide, so
      // dragging past the first (rightward) or last (leftward) set would
      // expose blank navy. Dampen that overscroll so it springs back.
      const atStart = activeIndex === 0 && dx > 0;
      const atEnd = activeIndex === order.length - 1 && dx < 0;
      if (atStart || atEnd) dx /= 3;
      s.dx = dx;
      if (Math.abs(e.clientX - s.startX) > 6) s.moved = true;
      setDragDX(dx);
    },
    [activeIndex, order.length],
  );

  const endDrag = useCallback(() => {
    const s = drag.current;
    if (!s.active) return;
    s.active = false;
    if (s.moved && Math.abs(s.dx) > DRAG_THRESHOLD && order.length > 1) {
      // drag left → next, drag right → previous — but never step past the
      // ends of the track (the rubber-band above already made that hard).
      const dir = s.dx < 0 ? 1 : -1;
      const target = activeIndex + dir;
      if (target >= 0 && target < order.length) {
        interacted.current = true;
        setActive(order[target]);
      }
    }
    if (s.moved) suppressClick.current = true;
    setDragDX(0);
    setDragging(false);
    setPaused(false);
  }, [order, activeIndex]);

  // Auto-rotation — paused on hover/focus and for reduced-motion users.
  useEffect(() => {
    if (paused || order.length < 2 || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setActive((cur) => {
        const i = order.indexOf(cur);
        return order[(i + 1) % order.length];
      });
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, order.join("|")]);

  if (sets.length === 0) return null;

  const current = sets[activeIndex] ?? sets[0];
  const nav = lang === "de"
    ? { prev: "Vorherige Auswahl", next: "Nächste Auswahl" }
    : { prev: "Previous set", next: "Next set" };

  return (
    <section style={{ background: "var(--color-surface-navy)", color: "#fff" }} aria-roledescription="carousel" aria-label="Journal">
      <div
        className="w-full px-6 sm:px-10 lg:px-16"
        style={{ paddingTop: 40, paddingBottom: 44 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3"
          style={{ marginBottom: 26 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <h1 className="display" style={{ fontSize: 17, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
              Journal
            </h1>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>{current.meta.blurb}</span>
          </div>

          {sets.length > 1 && (
            <div
              role="tablist"
              aria-label={lang === "de" ? "Journal-Auswahl" : "Journal selection"}
              className="flex items-center"
              style={{ gap: 4 }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  step(1);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  step(-1);
                }
              }}
            >
              {sets.map(({ meta }) => {
                const on = meta.id === current.meta.id;
                return (
                  <button
                    key={meta.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(meta.id)}
                    className="cursor-pointer"
                    style={{
                      background: "transparent",
                      border: 0,
                      padding: "6px 10px",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      color: on ? "#fff" : "rgba(255,255,255,.55)",
                      borderBottom: `2px solid ${on ? "var(--color-accent-pink)" : "transparent"}`,
                      transition: "color 160ms ease, border-color 160ms ease",
                    }}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          role="tabpanel"
          aria-live="polite"
          className="hero-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(e) => {
            if (suppressClick.current) {
              e.preventDefault();
              e.stopPropagation();
              suppressClick.current = false;
            }
          }}
        >
          {/* All sets live side-by-side in the track; translating the track
              by -activeIndex*100% (plus the live drag offset) IS the slide —
              so dragging reveals the neighbouring set instead of blank navy.
              Inactive slides are `inert` so their links can't be tabbed to or
              clicked while off-screen. Reduced-motion drops the transition. */}
          <div
            className={`hero-track${dragging ? " is-dragging" : ""}`}
            style={{
              transform: `translateX(calc(${-activeIndex * 100}% + ${dragDX}px))`,
              transition: dragging || reducedMotion ? "none" : "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {sets.map(({ meta, posts }, i) => {
              const on = i === activeIndex;
              return (
                <div key={meta.id} className="hero-slide" aria-hidden={!on} inert={!on}>
                  <Slide posts={posts} meta={meta} lang={lang} t={t} />
                </div>
              );
            })}
          </div>
        </div>

        {sets.length > 1 && (
          <div className="hero-controls" role="group" aria-label={lang === "de" ? "Folien-Navigation" : "Slide navigation"}>
            <button
              type="button"
              className="hero-arrow cursor-pointer"
              aria-label={nav.prev}
              onClick={() => {
                interacted.current = true;
                step(-1);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div className="hero-dots">
              {sets.map(({ meta }) => {
                const on = meta.id === current.meta.id;
                return (
                  <button
                    key={meta.id}
                    type="button"
                    className={`hero-dot cursor-pointer${on ? " on" : ""}`}
                    aria-label={meta.label}
                    aria-current={on ? "true" : undefined}
                    onClick={() => go(meta.id)}
                  />
                );
              })}
            </div>

            <button
              type="button"
              className="hero-arrow cursor-pointer"
              aria-label={nav.next}
              onClick={() => {
                interacted.current = true;
                step(1);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

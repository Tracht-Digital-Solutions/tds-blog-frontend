import { PostCover } from "./Covers";

/**
 * Flat post card from the design-system blog kit: cover block on top,
 * category eyebrow + date row, serif title, clamped excerpt, author
 * chip at the bottom. Angular — the colour block IS the card.
 *
 * Rendered statically (no hydration) inside RelatedArticles and
 * hydrated as part of the BlogIndex island on the index pages.
 */

export interface CardPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  coverHint?: string | null;
}

export function AuthorChip({ inverse }: { inverse?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: inverse ? "rgba(255,255,255,.14)" : "var(--flat-tint)",
          color: inverse ? "#fff" : "var(--color-primary)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        JT
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: inverse ? "rgba(255,255,255,.78)" : "var(--color-ink)",
        }}
      >
        Julian Tracht
      </span>
    </span>
  );
}

export function formatPostDate(publishedAt: string | null, lang: "de" | "en"): string {
  if (!publishedAt) return "";
  return new Date(publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({
  post,
  lang,
  large,
}: {
  post: CardPost;
  lang: "de" | "en";
  large?: boolean;
}) {
  return (
    <a className="post-card" href={`${lang === "en" ? "/en" : ""}/${post.slug}`}>
      <div style={{ aspectRatio: large ? "16 / 8.2" : "16 / 9", position: "relative" }}>
        <PostCover
          slug={post.slug}
          coverHint={post.coverHint}
          title={post.title}
          style={{ position: "absolute", inset: 0, height: "100%" }}
        />
      </div>
      <div
        style={{
          padding: large ? "22px 22px 18px" : "16px 18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
            {post.category}
          </span>
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="tabular"
              style={{ fontSize: 12, color: "var(--color-muted)", whiteSpace: "nowrap" }}
            >
              {formatPostDate(post.publishedAt, lang)}
            </time>
          )}
        </div>
        <h3 className="card-title" style={large ? { fontSize: "1.75rem" } : undefined}>
          {post.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: large ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <AuthorChip />
        </div>
      </div>
    </a>
  );
}

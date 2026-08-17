import { PostCover } from "./Covers";

/**
 * Flat post card from the design-system blog kit: cover block on top,
 * category eyebrow + date row, serif title, clamped excerpt, author
 * chip at the bottom. Angular — the colour block IS the card.
 *
 * Rendered statically (no hydration) inside RelatedArticles and
 * hydrated as part of the BlogIndex island on the index pages.
 */

/** Author display data snapshotted onto a post. */
export interface CardAuthor {
  name: string;
  slug: string;
  avatarUrl: string | null;
}

export interface CardPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  coverHint?: string | null;
  author?: CardAuthor | null;
}

/** Neutral byline for a post whose author is missing (deleted user / legacy). */
export function fallbackAuthorName(lang: "de" | "en"): string {
  return lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial";
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TD"
  );
}

export function AuthorChip({
  inverse,
  name = "Tracht Digital",
  avatarUrl,
}: {
  inverse?: boolean;
  name?: string;
  avatarUrl?: string | null;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          width={28}
          height={28}
          style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
          loading="lazy"
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: inverse ? "rgba(255,255,255,.14)" : "var(--tds-flat-tint)",
            color: inverse ? "#fff" : "var(--color-primary)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {initialsOf(name)}
        </span>
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: inverse ? "rgba(255,255,255,.78)" : "var(--color-ink)",
        }}
      >
        {name}
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
  // Every part of the card is class-driven rather than inline-styled, and that
  // is a hard requirement now, not a tidy-up: .post-card is a container-query
  // container, and an @container rule cannot override an inline style. With
  // the old inline `flexDirection`/`padding`/`aspectRatio` the card could not
  // change shape for a wide track no matter what CSS was written.
  return (
    <a
      className={`post-card${large ? " post-card--large" : ""}`}
      href={`${lang === "en" ? "/en" : ""}/${post.slug}`}
    >
      <div className="post-card__cover">
        <PostCover
          slug={post.slug}
          coverHint={post.coverHint}
          title={post.title}
          style={{ position: "absolute", inset: 0, height: "100%" }}
        />
      </div>
      <div className="post-card__body">
        <div className="post-card__meta">
          <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
            {post.category}
          </span>
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="tabular post-card__date">
              {formatPostDate(post.publishedAt, lang)}
            </time>
          )}
        </div>
        <h3 className="card-title">{post.title}</h3>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <div className="post-card__foot">
          <AuthorChip
            name={post.author?.name ?? fallbackAuthorName(lang)}
            avatarUrl={post.author?.avatarUrl}
          />
        </div>
      </div>
    </a>
  );
}

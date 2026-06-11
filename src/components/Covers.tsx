import type { CSSProperties } from "react";

/**
 * Flat brand-geometry covers from the Tracht design system blog kit.
 * Six variants built from solid colour blocks, hairline circles and
 * the bordeaux accent — no gradients, no radii (except circles).
 *
 * Fixed dark variants use the surface-* tokens so they stay navy/ink
 * in dark mode; the light variants use theme tokens and flip with it.
 */

const abs = (s: CSSProperties): CSSProperties => ({ position: "absolute", ...s });

export function AbstractCover({ variant, style }: { variant: number; style?: CSSProperties }) {
  const v = ((Math.abs(variant) - 1) % 6) + 1;
  const base: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    ...style,
  };

  if (v === 1)
    return (
      <div style={{ ...base, background: "var(--color-surface-navy)" }} aria-hidden="true">
        <div style={abs({ right: "-12%", top: "-30%", width: "70%", aspectRatio: "1", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.35)" })} />
        <div style={abs({ right: "12%", bottom: "14%", width: "13%", aspectRatio: "1", background: "var(--color-surface-accent)" })} />
      </div>
    );
  if (v === 2)
    return (
      <div style={{ ...base, background: "var(--color-soft)" }} aria-hidden="true">
        <div style={abs({ left: "-10%", bottom: "-45%", width: "65%", aspectRatio: "1", borderRadius: "50%", background: "var(--color-surface-navy)" })} />
        <div style={abs({ right: "14%", top: "18%", width: "26%", height: 3, background: "var(--color-accent)" })} />
        <div style={abs({ right: "14%", top: "28%", width: "34%", aspectRatio: "1", borderRadius: "50%", border: "1.5px solid var(--color-primary)", opacity: 0.5 })} />
      </div>
    );
  if (v === 3)
    return (
      <div style={{ ...base, background: "var(--color-surface-ink)" }} aria-hidden="true">
        <div
          style={abs({
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            backgroundPosition: "22px 18px",
          })}
        />
        <div style={abs({ left: "18%", top: "30%", width: "17%", aspectRatio: "1", borderRadius: "50%", background: "var(--color-surface-accent)" })} />
        <div style={abs({ left: "42%", top: "30%", right: "14%", bottom: "32%", border: "1.5px solid rgba(255,255,255,.55)" })} />
      </div>
    );
  if (v === 4)
    return (
      <div style={{ ...base, background: "var(--flat-tint)" }} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={abs({
              left: `${16 + i * 14}%`,
              top: `${34 - i * 8}%`,
              bottom: 0,
              width: "7%",
              background: i === 1 ? "var(--color-primary)" : "var(--color-surface-navy)",
              opacity: i === 1 ? 0.55 : 1,
            })}
          />
        ))}
        <div style={abs({ right: "16%", top: "22%", width: "10%", aspectRatio: "1", borderRadius: "50%", background: "var(--color-surface-accent)" })} />
      </div>
    );
  if (v === 5)
    return (
      <div style={{ ...base, background: "var(--color-surface-navy)" }} aria-hidden="true">
        <div style={abs({ left: "-18%", top: "-18%", width: "52%", aspectRatio: "1", borderRadius: "50%", background: "rgba(0,0,0,.35)" })} />
        <div style={abs({ right: "-8%", bottom: "-40%", width: "56%", aspectRatio: "1", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.3)" })} />
        <div style={abs({ left: "46%", top: "44%", width: "20%", height: 3, background: "var(--color-surface-accent)" })} />
      </div>
    );
  return (
    <div style={{ ...base, background: "var(--color-surface-ink)" }} aria-hidden="true">
      <div style={abs({ left: "14%", top: "24%", width: "30%", aspectRatio: "1", border: "1.5px solid rgba(255,255,255,.4)" })} />
      <div style={abs({ left: "26%", top: "44%", width: "30%", aspectRatio: "1", background: "var(--color-surface-navy)", filter: "brightness(1.8)" })} />
      <div style={abs({ right: "16%", top: "30%", width: "9%", aspectRatio: "1", borderRadius: "50%", background: "var(--color-surface-accent)" })} />
    </div>
  );
}

/** Stable cover variant per post — hash the slug into 1..6. */
export function coverVariant(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return (Math.abs(h) % 6) + 1;
}

/** Photo cover when the post carries an explicit URL, abstract otherwise. */
export function PostCover({
  slug,
  coverHint,
  title,
  style,
}: {
  slug: string;
  coverHint?: string | null;
  title?: string;
  style?: CSSProperties;
}) {
  if (coverHint?.startsWith("http")) {
    return (
      <img
        src={coverHint}
        alt={title ?? ""}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
      />
    );
  }
  return <AbstractCover variant={coverVariant(slug)} style={style} />;
}

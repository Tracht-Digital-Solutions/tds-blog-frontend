/**
 * Build-time OG image renderer.
 *
 * Satori turns a JSX/object tree into SVG; resvg-js rasterises that
 * SVG to PNG. We do both at `getStaticPaths` time so each post's
 * social-preview image ships as a static file under
 * /og/{lang}/{slug}.png — no runtime cost, no third-party service.
 *
 * Editorial template (1200×630 — the LinkedIn / Twitter Card size):
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │                                                            │
 *   │  CATEGORY                                                  │
 *   │                                                            │
 *   │  Title runs across as many lines as it                     │
 *   │  needs, with the last word in the accent colour.           │
 *   │                                                            │
 *   │                                                            │
 *   │  ─── Date · Author          Tracht Journal                 │
 *   └────────────────────────────────────────────────────────────┘
 */
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Resolved from the project root because Astro bundles this file into dist/,
// where `import.meta.url`-based relative paths no longer reach src/og/fonts.
const FONT_DIR = path.join(process.cwd(), "src/og/fonts");
let latoBold: Buffer | null = null;

function loadFonts() {
  if (latoBold === null) {
    latoBold = fs.readFileSync(path.join(FONT_DIR, "Lato-Bold.ttf"));
  }
  return {
    lato: latoBold!,
  };
}

const PAPER = "#fafaf7";
const INK = "#1a1a17";
const PRIMARY = "#050f68";
const ACCENT = "#820933";
const MUTED = "#6b6b66";
const LINE = "#e8e6df";

interface OgOptions {
  title: string;
  category: string;
  publishedAt: string | null;
  lang: "de" | "en";
  /** Byline shown in the footer; falls back to the studio name. */
  author?: string | null;
}

/**
 * Splits the title so the last word can be rendered in burgundy,
 * matching the "accent word" pattern the rest of the site uses.
 * Falls back to plain rendering if the title is a single word.
 */
function splitForAccent(title: string): { head: string; accent: string } {
  const trimmed = title.trim();
  const idx = trimmed.lastIndexOf(" ");
  if (idx < 0) return { head: "", accent: trimmed };
  return { head: trimmed.slice(0, idx), accent: trimmed.slice(idx + 1) };
}

export async function renderOgPng(opts: OgOptions): Promise<Buffer> {
  const { lato } = loadFonts();

  const { head, accent } = splitForAccent(opts.title);
  const locale = opts.lang === "de" ? "de-DE" : "en-US";
  const dateLabel = opts.publishedAt
    ? new Date(opts.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : opts.lang === "de"
      ? "Entwurf"
      : "Draft";

  const wordmark =
    opts.lang === "de" ? "Tracht Digital · Journal" : "Tracht Digital · Journal";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "72px 80px",
          fontFamily: "Lato",
          color: INK,
          position: "relative",
        },
        children: [
          // Decorative top rule + category
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "56px",
                      height: "1px",
                      backgroundColor: MUTED,
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Lato",
                      fontSize: "20px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: MUTED,
                    },
                    children: opts.category,
                  },
                },
              ],
            },
          },
          // Headline — Geist, head in primary, last word accent burgundy
          {
            type: "div",
            props: {
              style: {
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: "78px",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                color: PRIMARY,
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "36px",
              },
              children: [
                head ? {
                  type: "span",
                  props: {
                    children: head,
                  },
                } : null,
                {
                  type: "span",
                  props: {
                    style: {
                      color: ACCENT,
                    },
                    children: accent,
                  },
                },
              ].filter(Boolean),
            },
          },
          // Footer row: hairline + date · author          wordmark
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `1px solid ${LINE}`,
                paddingTop: "32px",
                fontFamily: "Lato",
                fontSize: "22px",
                color: MUTED,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", gap: "16px" },
                    children: [
                      {
                        type: "span",
                        props: { children: dateLabel },
                      },
                      {
                        type: "span",
                        props: {
                          style: { color: LINE },
                          children: "·",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          children:
                            opts.author ??
                            (opts.lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial"),
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Lato",
                      fontWeight: 700,
                      fontSize: "24px",
                      color: INK,
                    },
                    children: wordmark,
                  },
                },
              ],
            },
          },
        ],
      },
    } as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Lato",
          data: lato,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  }).render().asPng();

  return png;
}

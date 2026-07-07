import { useEffect, useState } from "react";

/**
 * Screen-only control panel for the article print view (`/[slug]/print`) —
 * rendered as a floating bar on the right (see `.print-controls` in
 * global.css). It drives three things, all persisted in localStorage:
 *
 *   • Page size — writes an `@page { size … }` rule (so the browser's print /
 *     PDF uses A4/A5/A3) and a `size-<x>` class on `#print-root` so the
 *     on-screen sheet preview matches. A fixed page margin (Seitenabstand)
 *     rides along on `@page` + the sheet padding.
 *   • Meta visibility — each switch flips a `hide-<key>` class on `#print-root`;
 *     the matching CSS hides that meta block on screen and in print.
 *   • Print — `window.print()` (the browser dialog also offers Save-as-PDF).
 *
 * The article body is baked server-side, so this only flips visibility /
 * sizing — no runtime content fetch.
 */

type Key = "cover" | "category" | "date" | "reading" | "author" | "lead" | "tags" | "url";
type Size = "a4" | "a5" | "a3";

const ORDER: Key[] = ["cover", "category", "date", "reading", "author", "lead", "tags", "url"];

// Cover defaults off (it's the colourful brand geometry the print view strips);
// everything textual defaults on.
const DEFAULTS: Record<Key, boolean> = {
  cover: false,
  category: true,
  date: true,
  reading: true,
  author: true,
  lead: true,
  tags: true,
  url: true,
};

const SIZES: Size[] = ["a4", "a5", "a3"];
const PAGE_NAME: Record<Size, string> = { a4: "A4", a5: "A5", a3: "A3" };
const PAGE_MARGIN = "16mm"; // Seitenabstand — mirrored by .print-doc padding.

const LABELS: Record<"de" | "en", { title: string; size: string; print: string; items: Record<Key, string> }> = {
  de: {
    title: "Meta-Infos",
    size: "Seitenformat",
    print: "Drucken / Als PDF",
    items: {
      cover: "Titelbild",
      category: "Kategorie",
      date: "Datum",
      reading: "Lesezeit",
      author: "Autor",
      lead: "Kurzbeschreibung",
      tags: "Themen",
      url: "Link zum Beitrag",
    },
  },
  en: {
    title: "Meta info",
    size: "Page size",
    print: "Print / Save as PDF",
    items: {
      cover: "Cover image",
      category: "Category",
      date: "Date",
      reading: "Reading time",
      author: "Author",
      lead: "Summary",
      tags: "Topics",
      url: "Article link",
    },
  },
};

const META_KEY = "tds-print-meta";
const SIZE_KEY = "tds-print-size";

export default function PrintControls({
  lang = "de",
  hasCover = false,
  hasTags = true,
}: {
  lang?: "de" | "en";
  hasCover?: boolean;
  hasTags?: boolean;
}) {
  const t = LABELS[lang];
  const keys = ORDER.filter((k) => (k !== "cover" || hasCover) && (k !== "tags" || hasTags));
  const [state, setState] = useState<Record<Key, boolean>>(DEFAULTS);
  const [size, setSize] = useState<Size>("a4");

  // Restore persisted choices after hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<Record<Key, boolean>>) }));
    } catch {
      /* storage disabled — start from defaults */
    }
    try {
      const s = localStorage.getItem(SIZE_KEY) as Size | null;
      if (s && SIZES.includes(s)) setSize(s);
    } catch {
      /* storage disabled */
    }
  }, []);

  // Reflect meta visibility onto #print-root (and persist).
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (root) for (const k of ORDER) root.classList.toggle(`hide-${k}`, !state[k]);
    try {
      localStorage.setItem(META_KEY, JSON.stringify(state));
    } catch {
      /* storage disabled */
    }
  }, [state]);

  // Reflect page size onto #print-root (preview) + an injected @page rule
  // (actual print / PDF), and persist.
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (root) for (const s of SIZES) root.classList.toggle(`size-${s}`, s === size);

    let style = document.getElementById("tds-print-page") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "tds-print-page";
      document.head.appendChild(style);
    }
    style.textContent = `@page { size: ${PAGE_NAME[size]}; margin: ${PAGE_MARGIN}; }`;

    try {
      localStorage.setItem(SIZE_KEY, size);
    } catch {
      /* storage disabled */
    }
  }, [size]);

  return (
    <div className="print-controls-inner">
      <div className="print-group">
        <p className="print-controls-title">{t.size}</p>
        <div className="print-sizes" role="group" aria-label={t.size}>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`print-size-btn cursor-pointer${size === s ? " on" : ""}`}
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {PAGE_NAME[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="print-group">
        <p className="print-controls-title">{t.title}</p>
        <ul className="print-switches list-none p-0 m-0">
          {keys.map((k) => (
            <li key={k}>
              <label className="print-switch">
                <input
                  type="checkbox"
                  className="print-switch-input"
                  checked={state[k]}
                  onChange={(e) => setState((s) => ({ ...s, [k]: e.target.checked }))}
                />
                <span className="print-switch-track" aria-hidden="true">
                  <span className="print-switch-thumb" />
                </span>
                <span className="print-switch-label">{t.items[k]}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="btn-flat print-do cursor-pointer" onClick={() => window.print()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v8H6z" />
        </svg>
        <span>{t.print}</span>
      </button>
    </div>
  );
}

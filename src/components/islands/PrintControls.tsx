import { useEffect, useState } from "react";

/**
 * Screen-only control panel for the article print view (`/[slug]/print`) —
 * a floating bar on the right (see `.print-controls` in global.css). All
 * choices persist in localStorage. It drives:
 *
 *   • Page size (A5/A4/A3, small→large) — a `size-<x>` class on `#print-root`
 *     (screen sheet preview) + an injected `@page { size … margin … }` rule
 *     (real print/PDF). A fixed 16mm margin (Seitenabstand) rides along.
 *   • Font size (S/M/L) — an `fs-<x>` class on `#print-root` driving the
 *     `--print-fs` variable the body prose reads.
 *   • Highlighter — a marker mode; while on, releasing a text selection inside
 *     the sheet wraps it in `<mark class="print-mark">`; a Clear button unwraps
 *     all of them. Highlights are in-DOM (print with the page).
 *   • Meta visibility — each switch flips a `hide-<key>` class on `#print-root`.
 *
 * The article body is baked server-side; this only flips visibility / sizing.
 */

type Key = "cover" | "category" | "lead" | "date" | "reading" | "author" | "url" | "tags";
type Size = "a5" | "a4" | "a3";
type Fs = "s" | "m" | "l";

// Meta order follows the document's own top-to-bottom flow.
const ORDER: Key[] = ["cover", "category", "lead", "date", "reading", "author", "url", "tags"];

// Cover defaults off (it's the colourful brand geometry the print view strips);
// everything textual defaults on.
const DEFAULTS: Record<Key, boolean> = {
  cover: false,
  category: true,
  lead: true,
  date: true,
  reading: true,
  author: true,
  url: true,
  tags: true,
};

// Sorted small → large.
const SIZES: Size[] = ["a5", "a4", "a3"];
const PAGE_NAME: Record<Size, string> = { a5: "A5", a4: "A4", a3: "A3" };
const PAGE_MARGIN = "16mm"; // Seitenabstand — mirrored by .print-doc padding.

const FONT_SIZES: Fs[] = ["s", "m", "l"];

const LABELS: Record<
  "de" | "en",
  { size: string; font: string; fonts: Record<Fs, string>; mark: string; clear: string; meta: string; print: string; items: Record<Key, string> }
> = {
  de: {
    size: "Seitenformat",
    font: "Schriftgröße",
    fonts: { s: "Klein", m: "Mittel", l: "Groß" },
    mark: "Markieren",
    clear: "Markierungen löschen",
    meta: "Meta-Infos",
    print: "Drucken / Als PDF",
    items: {
      cover: "Titelbild",
      category: "Kategorie",
      lead: "Kurzbeschreibung",
      date: "Datum",
      reading: "Lesezeit",
      author: "Autor",
      url: "Link zum Beitrag",
      tags: "Themen",
    },
  },
  en: {
    size: "Page size",
    font: "Font size",
    fonts: { s: "Small", m: "Medium", l: "Large" },
    mark: "Highlight",
    clear: "Clear highlights",
    meta: "Meta info",
    print: "Print / Save as PDF",
    items: {
      cover: "Cover image",
      category: "Category",
      lead: "Summary",
      date: "Date",
      reading: "Reading time",
      author: "Author",
      url: "Article link",
      tags: "Topics",
    },
  },
};

const META_KEY = "tds-print-meta";
const SIZE_KEY = "tds-print-size";
const FS_KEY = "tds-print-fs";

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
  const [fs, setFs] = useState<Fs>("m");
  const [marking, setMarking] = useState(false);

  // Restore persisted choices after hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<Record<Key, boolean>>) }));
    } catch {
      /* storage disabled */
    }
    try {
      const s = localStorage.getItem(SIZE_KEY) as Size | null;
      if (s && SIZES.includes(s)) setSize(s);
    } catch {
      /* storage disabled */
    }
    try {
      const f = localStorage.getItem(FS_KEY) as Fs | null;
      if (f && FONT_SIZES.includes(f)) setFs(f);
    } catch {
      /* storage disabled */
    }
  }, []);

  // Meta visibility → #print-root.
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (root) for (const k of ORDER) root.classList.toggle(`hide-${k}`, !state[k]);
    try {
      localStorage.setItem(META_KEY, JSON.stringify(state));
    } catch {
      /* storage disabled */
    }
  }, [state]);

  // Page size → #print-root class (preview) + injected @page (print/PDF).
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

  // Font size → #print-root class (drives --print-fs).
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (root) for (const f of FONT_SIZES) root.classList.toggle(`fs-${f}`, f === fs);
    try {
      localStorage.setItem(FS_KEY, fs);
    } catch {
      /* storage disabled */
    }
  }, [fs]);

  // Marker mode: while on, releasing a selection inside the sheet highlights it.
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (!root) return;
    root.classList.toggle("marking", marking);
    if (!marking) return;

    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) return;
      const mark = document.createElement("mark");
      mark.className = "print-mark";
      try {
        range.surroundContents(mark);
      } catch {
        // Multi-node selection: extract + rewrap (valid enough for highlighting).
        mark.appendChild(range.extractContents());
        range.insertNode(mark);
      }
      sel.removeAllRanges();
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, [marking]);

  const clearMarks = () => {
    const root = document.getElementById("print-root");
    if (!root) return;
    root.querySelectorAll("mark.print-mark").forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });
  };

  return (
    <div className="print-controls-inner">
      <div className="print-group">
        <p className="print-controls-title">{t.size}</p>
        <div className="print-seg" role="group" aria-label={t.size}>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`print-seg-btn cursor-pointer${size === s ? " on" : ""}`}
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {PAGE_NAME[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="print-group">
        <p className="print-controls-title">{t.font}</p>
        <div className="print-seg" role="group" aria-label={t.font}>
          {FONT_SIZES.map((f) => (
            <button
              key={f}
              type="button"
              className={`print-seg-btn cursor-pointer${fs === f ? " on" : ""}`}
              aria-pressed={fs === f}
              onClick={() => setFs(f)}
            >
              {t.fonts[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="print-group">
        <button
          type="button"
          className={`print-action cursor-pointer${marking ? " on" : ""}`}
          aria-pressed={marking}
          onClick={() => setMarking((m) => !m)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          <span>{t.mark}</span>
        </button>
        <button type="button" className="print-clear cursor-pointer" onClick={clearMarks}>
          {t.clear}
        </button>
      </div>

      <div className="print-group">
        <p className="print-controls-title">{t.meta}</p>
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

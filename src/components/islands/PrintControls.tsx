import { useEffect, useRef, useState } from "react";
import { countHighlights, highlightRange, paginate, removeHighlights } from "./printPaginate";

/**
 * Screen-only control panel for the article print view (`/[slug]/print`) —
 * a floating panel on the right of a wide screen, a sticky bar on a phone
 * (see `.print-controls` in global.css). Choices persist in localStorage.
 * It drives:
 *
 *   • Page size (A5/A4/A3) — a `size-<x>` class on `#print-root` (the sheets
 *     of the preview) + an injected `@page` rule (real print/PDF) that also
 *     carries the 16mm margin and the page number, so paper and preview agree.
 *   • Font size (S/M/L) — an `fs-<x>` class driving `--print-fs`.
 *   • View — the whole page, the page width, or 100 %. The sheets keep their
 *     paper size in mm and are scaled to the screen with CSS `zoom`.
 *   • Highlighter — select text and press "Markieren" in the bar that appears
 *     (any device), or switch marker mode on to mark on mouse release. A tap
 *     on a highlight offers to remove it. Highlights are in-DOM and print.
 *   • Meta visibility — each switch flips a `hide-<key>` class on `#print-root`.
 *
 * The article body is baked server-side; this only flips visibility / sizing.
 */

type Key = "cover" | "category" | "lead" | "date" | "reading" | "author" | "url" | "tags";
type Size = "a5" | "a4" | "a3";
type Fs = "s" | "m" | "l";
type Fit = "page" | "width" | "actual";

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
/** Paper size in mm — the sheets are laid out at this true size and then
 *  scaled to the screen, so A5/A4/A3 differ the way the paper does. */
const PAGE_MM: Record<Size, [number, number]> = { a5: [148, 210], a4: [210, 297], a3: [297, 420] };
const MM_TO_PX = 96 / 25.4;
const PAGE_MARGIN = "16mm"; // Seitenabstand — mirrored by .print-page padding.
/** The sheet's hard offset on screen (8px) plus a little air. */
const SHEET_EXTRA = 12;

const FONT_SIZES: Fs[] = ["s", "m", "l"];
const FITS: Fit[] = ["page", "width", "actual"];

const LABELS = {
  de: {
    back: "Zum Beitrag",
    settings: "Einstellungen",
    size: "Seitenformat",
    font: "Schriftgröße",
    fonts: { s: "Klein", m: "Mittel", l: "Groß" } as Record<Fs, string>,
    view: "Ansicht",
    fits: { page: "Seite", width: "Breite", actual: "100 %" } as Record<Fit, string>,
    mark: "Markieren",
    markMode: "Markier-Modus",
    markHint: "Text auswählen, dann „Markieren“ tippen.",
    unmark: "Markierung entfernen",
    clear: "Alle Markierungen löschen",
    meta: "Inhalte",
    print: "Drucken / Als PDF",
    scale: (pct: number) => `Vorschau in ${pct} % der Originalgröße`,
    pages: (n: number) => (n === 1 ? "1 Seite" : `${n} Seiten`),
    pageNo: (n: number, total: number) => `Seite ${n} von ${total}`,
    pageNoCss: `"Seite " counter(page) " von " counter(pages)`,
    items: {
      cover: "Titelbild",
      category: "Kategorie",
      lead: "Kurzbeschreibung",
      date: "Datum",
      reading: "Lesezeit",
      author: "Autor",
      url: "Link zum Beitrag",
      tags: "Themen",
    } as Record<Key, string>,
  },
  en: {
    back: "Back to article",
    settings: "Settings",
    size: "Page size",
    font: "Font size",
    fonts: { s: "Small", m: "Medium", l: "Large" } as Record<Fs, string>,
    view: "View",
    fits: { page: "Page", width: "Width", actual: "100%" } as Record<Fit, string>,
    mark: "Highlight",
    markMode: "Marker mode",
    markHint: "Select text, then tap “Highlight”.",
    unmark: "Remove highlight",
    clear: "Clear all highlights",
    meta: "Contents",
    print: "Print / Save as PDF",
    scale: (pct: number) => `Preview at ${pct}% of actual size`,
    pages: (n: number) => (n === 1 ? "1 page" : `${n} pages`),
    pageNo: (n: number, total: number) => `Page ${n} of ${total}`,
    pageNoCss: `"Page " counter(page) " of " counter(pages)`,
    items: {
      cover: "Cover image",
      category: "Category",
      lead: "Summary",
      date: "Date",
      reading: "Reading time",
      author: "Author",
      url: "Article link",
      tags: "Topics",
    } as Record<Key, string>,
  },
};

const META_KEY = "tds-print-meta";
const SIZE_KEY = "tds-print-size";
const FS_KEY = "tds-print-fs";

const WIDE = "(min-width: 900px)";

/** What the floating selection bar offers right now. */
type SelBar = { kind: "mark" } | { kind: "unmark"; mark: Element } | null;

export default function PrintControls({
  lang = "de",
  backHref,
  hasCover = false,
  hasTags = true,
}: {
  lang?: "de" | "en";
  backHref: string;
  hasCover?: boolean;
  hasTags?: boolean;
}) {
  const t = LABELS[lang];
  const keys = ORDER.filter((k) => (k !== "cover" || hasCover) && (k !== "tags" || hasTags));
  const [state, setState] = useState<Record<Key, boolean>>(DEFAULTS);
  const [size, setSize] = useState<Size>("a4");
  const [fs, setFs] = useState<Fs>("m");
  const [fit, setFit] = useState<Fit>("width");
  const [open, setOpen] = useState(false);
  const [marking, setMarking] = useState(false);
  const [markCount, setMarkCount] = useState(0);
  const [selBar, setSelBar] = useState<SelBar>(null);
  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  /** The last non-empty selection inside the sheet. A tap on the bar's button
   *  can collapse the live selection before the click arrives (iOS does). */
  const rangeRef = useRef<Range | null>(null);

  const root = () => document.getElementById("print-root");
  const countMarks = () => {
    const el = root();
    setMarkCount(el ? countHighlights(el) : 0);
  };

  // Restore persisted choices after hydration; pick the view for this screen.
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
    // A wide screen shows a whole sheet, like a print dialog; a phone shows
    // the page width, where a whole A4 sheet would be unreadably small.
    setFit(window.matchMedia(WIDE).matches ? "page" : "width");
  }, []);

  // Meta visibility → #print-root.
  useEffect(() => {
    const el = root();
    if (el) for (const k of ORDER) el.classList.toggle(`hide-${k}`, !state[k]);
    try {
      localStorage.setItem(META_KEY, JSON.stringify(state));
    } catch {
      /* storage disabled */
    }
  }, [state]);

  // Page size → #print-root class (preview) + injected @page (print/PDF). The
  // page number lives in the paper's bottom margin, where the preview draws it.
  useEffect(() => {
    const el = root();
    if (el) for (const s of SIZES) el.classList.toggle(`size-${s}`, s === size);

    let style = document.getElementById("tds-print-page") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "tds-print-page";
      document.head.appendChild(style);
    }
    style.textContent =
      `@page { size: ${PAGE_NAME[size]}; margin: ${PAGE_MARGIN}; ` +
      `@bottom-right { content: ${t.pageNoCss}; font-family: var(--font-body), sans-serif; ` +
      `font-size: 8.25pt; color: #71717a; vertical-align: middle; } }`;

    try {
      localStorage.setItem(SIZE_KEY, size);
    } catch {
      /* storage disabled */
    }
  }, [size]);

  // Fit the true-size sheets to the screen with CSS `zoom`. Never by clamping
  // the width — that made A5, A4 and A3 look exactly alike on a phone.
  useEffect(() => {
    const el = root();
    const stage = el?.parentElement;
    if (!el || !stage) return;
    const apply = () => {
      const [wMm, hMm] = PAGE_MM[size];
      const pageW = wMm * MM_TO_PX + SHEET_EXTRA;
      const pageH = hMm * MM_TO_PX + SHEET_EXTRA;
      const availW = stage.clientWidth;
      // The phone's sticky bar sits over the top of the stage.
      const bar = barRef.current?.closest(".print-controls");
      const barH = bar && getComputedStyle(bar).position === "sticky" ? bar.getBoundingClientRect().height : 0;
      const availH = window.innerHeight - barH - 48;
      let next = 1;
      if (fit === "width") next = Math.min(1, availW / pageW);
      else if (fit === "page") next = Math.min(1, availW / pageW, availH / pageH);
      next = Math.max(0.2, next);
      el.style.setProperty("--print-scale", String(next));
      setScale(next);
    };
    apply();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(stage);
    window.addEventListener("resize", apply);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [size, fit]);

  // Font size → #print-root class (drives --print-fs).
  useEffect(() => {
    const el = root();
    if (el) for (const f of FONT_SIZES) el.classList.toggle(`fs-${f}`, f === fs);
    try {
      localStorage.setItem(FS_KEY, fs);
    } catch {
      /* storage disabled */
    }
  }, [fs]);

  // Real pages: re-lay the content out whenever paper, type size or the
  // visible meta changes — and once more when the webfonts have arrived,
  // because a fallback font measures differently. Runs after the class
  // effects above (declared later), so it measures the final state.
  useEffect(() => {
    const el = root();
    if (!el) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) setPageCount(paginate(el, t.pageNo));
    };
    run();
    document.fonts?.ready.then(run).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [state, size, fs]);

  // The selection bar: shown while text inside the sheet is selected, or
  // after a tap on an existing highlight. A phone's own selection handles stay
  // usable — nothing is marked until the reader says so.
  useEffect(() => {
    const el = root();
    if (!el) return;
    let timer = 0;
    const read = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (el.contains(range.commonAncestorContainer)) {
          rangeRef.current = range.cloneRange();
          setSelBar({ kind: "mark" });
          return;
        }
      }
      // Collapsed: keep the bar a moment, a tap on its button collapses first.
      setSelBar((b) => (b?.kind === "mark" ? null : b));
    };
    const onChange = () => {
      clearTimeout(timer);
      timer = window.setTimeout(read, 160);
    };
    const onClick = (e: MouseEvent) => {
      const mark = (e.target as Element | null)?.closest?.("mark.print-mark");
      const sel = window.getSelection();
      if (mark && el.contains(mark) && (!sel || sel.isCollapsed)) setSelBar({ kind: "unmark", mark });
      else if (!mark) setSelBar((b) => (b?.kind === "unmark" ? null : b));
    };
    document.addEventListener("selectionchange", onChange);
    el.addEventListener("click", onClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onChange);
      el.removeEventListener("click", onClick);
    };
  }, []);

  // Marker mode (mouse): releasing a selection inside the sheet marks it at once.
  useEffect(() => {
    const el = root();
    if (!el) return;
    el.classList.toggle("marking", marking);
    if (!marking) return;
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) return;
      highlightRange(range, el);
      sel.removeAllRanges();
      rangeRef.current = null;
      setSelBar(null);
      countMarks();
    };
    document.addEventListener("pointerup", onUp);
    return () => document.removeEventListener("pointerup", onUp);
  }, [marking]);

  const markSelection = () => {
    const el = root();
    const range = rangeRef.current;
    if (!el || !range) return;
    highlightRange(range, el);
    window.getSelection()?.removeAllRanges();
    rangeRef.current = null;
    setSelBar(null);
    countMarks();
  };

  const unmark = (mark: Element) => {
    const el = root();
    if (el) removeHighlights(mark, el);
    setSelBar(null);
    countMarks();
  };

  const clearMarks = () => {
    const el = root();
    if (!el) return;
    removeHighlights(el);
    setSelBar(null);
    countMarks();
  };

  // Keep the live selection when the bar's button is pressed.
  const keepSelection = (e: { preventDefault: () => void }) => e.preventDefault();

  const seg = <T extends string>(label: string, options: T[], value: T, set: (v: T) => void, name: (v: T) => string) => (
    <div className="print-group">
      <p className="print-controls-title">{label}</p>
      <div className="print-seg" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`print-seg-btn cursor-pointer${value === o ? " on" : ""}`}
            aria-pressed={value === o}
            onClick={() => set(o)}
          >
            {name(o)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={barRef} className={`print-controls-inner${open ? " is-open" : ""}`}>
      {/* Always in view: the way back, the one action, and (phone) the settings. */}
      <div className="print-bar">
        <a href={backHref} className="print-back-link" aria-label={t.back}>
          <span aria-hidden="true">←</span>
          <span className="print-back-text">{t.back}</span>
        </a>
        <button type="button" className="btn-flat print-do cursor-pointer" onClick={() => window.print()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          <span>{t.print}</span>
        </button>
        <button
          type="button"
          className="print-more cursor-pointer"
          aria-expanded={open}
          aria-controls="print-settings"
          aria-label={t.settings}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="10" cy="12" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
        </button>
      </div>

      <div id="print-settings" className="print-settings">
        {/* Paper and type size side by side — the two choices that change how the page looks. */}
        <div className="print-row">
          {seg(t.size, SIZES, size, setSize, (s) => PAGE_NAME[s])}
          {seg(t.font, FONT_SIZES, fs, setFs, (f) => t.fonts[f])}
        </div>
        {seg(t.view, FITS, fit, setFit, (f) => t.fits[f])}
        <p className="print-scale-note" aria-live="polite">
          {pageCount > 0 ? t.pages(pageCount) : null}
          {pageCount > 0 && scale < 1 ? " · " : null}
          {scale < 1 ? t.scale(Math.round(scale * 100)) : null}
        </p>

        {/* What is on the page: the switches in a grid, in document order. */}
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

        {/* The marker last: a tool for working on the sheet, not a setting. */}
        <div className="print-mark-row">
          <p className="print-mark-hint">{t.markHint}</p>
          <button
            type="button"
            className={`print-action print-mark-mode cursor-pointer${marking ? " on" : ""}`}
            aria-pressed={marking}
            onClick={() => setMarking((m) => !m)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>{t.markMode}</span>
          </button>
          <button type="button" className="print-clear cursor-pointer" onClick={clearMarks} disabled={markCount === 0}>
            {t.clear}
            {markCount > 0 ? ` (${markCount})` : ""}
          </button>
        </div>
      </div>

      {/* Floating bar for the current selection or a tapped highlight. Low on
          the screen, where a phone's own selection menu (above the text) never is. */}
      {selBar && (
        <div className="print-selbar" role="toolbar" aria-label={t.mark}>
          {selBar.kind === "mark" ? (
            <button
              type="button"
              className="print-selbar-btn is-mark cursor-pointer"
              onPointerDown={keepSelection}
              onMouseDown={keepSelection}
              onClick={markSelection}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              {t.mark}
            </button>
          ) : (
            <button type="button" className="print-selbar-btn cursor-pointer" onClick={() => unmark(selBar.mark)}>
              {t.unmark}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

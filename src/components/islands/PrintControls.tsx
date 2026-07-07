import { useEffect, useState } from "react";

/**
 * Screen-only control panel for the article print view (`/[slug]/print`).
 * Each switch toggles a `hide-<key>` class on the server-rendered
 * `#print-root`, and the matching `@media print` / screen CSS in global.css
 * hides that meta element — so the reader curates exactly what lands on the
 * printed page / PDF, then hits "Drucken" (the browser's print dialog, which
 * also offers "Save as PDF"). Choices persist in localStorage.
 *
 * The article body itself is baked server-side; this island only flips
 * visibility, so there is no runtime content fetch.
 */

type Key = "cover" | "category" | "date" | "reading" | "author" | "lead" | "tags" | "url";

const ORDER: Key[] = ["cover", "category", "date", "reading", "author", "lead", "tags", "url"];

// Cover defaults off (it's the colourful brand geometry the print view is
// meant to strip); everything textual defaults on.
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

const LABELS: Record<"de" | "en", { title: string; print: string; items: Record<Key, string> }> = {
  de: {
    title: "Meta-Infos",
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

const STORAGE_KEY = "tds-print-meta";

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

  // Restore persisted choices after hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<Record<Key, boolean>>) }));
    } catch {
      /* storage disabled — start from defaults */
    }
  }, []);

  // Reflect the state onto #print-root (and persist it).
  useEffect(() => {
    const root = document.getElementById("print-root");
    if (root) for (const k of ORDER) root.classList.toggle(`hide-${k}`, !state[k]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage disabled — choices just won't persist */
    }
  }, [state]);

  return (
    <div className="print-controls-inner">
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

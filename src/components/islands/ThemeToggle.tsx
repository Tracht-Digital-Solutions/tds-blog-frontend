import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "tds-theme";

/**
 * Theme toggle — flips `<html data-theme="light|dark">` and persists
 * the choice in localStorage under `tds-theme`. Initial state on
 * mount is read from the document (set synchronously by the no-flash
 * script in Layout.astro <head>) so the button doesn't flash to a
 * default and then correct itself.
 *
 * Icons: shows the *target* state — moon in light mode (tap to go
 * dark), sun in dark mode (tap to go light). Matches the
 * Material/iOS convention.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Safari private mode / disabled storage — soft fail.
    }
  };

  // Render a stable label/icon during SSR + initial paint so the
  // server-rendered button matches the first client paint. Once
  // mounted, the real state takes over.
  const label =
    mounted && theme === "dark" ? "Auf Hell umschalten" : "Auf Dunkel umschalten";

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
    >
      {/* Moon — visible in light mode (tap to enter dark). */}
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={mounted && theme === "dark" ? "hidden" : "block"}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* Sun — visible in dark mode (tap to leave dark). */}
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={mounted && theme === "dark" ? "block" : "hidden"}
      >
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="6.99" y2="6.99" />
        <line x1="17.01" y1="17.01" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="6.99" y2="17.01" />
        <line x1="17.01" y1="6.99" x2="19.07" y2="4.93" />
      </svg>
    </button>
  );
}

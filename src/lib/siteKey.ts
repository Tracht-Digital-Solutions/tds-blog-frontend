/**
 * The site key this build presents to the API.
 *
 * A site key is issued in the admin portal (*Einstellungen →
 * Site-Verbindungen*) and identifies this site to the composed API. It is
 * optional: with no key the build behaves exactly as it always has, and the
 * public read routes stay open unless an admin has switched enforcement on.
 *
 * ### `process.env`, not `import.meta.env`
 *
 * Astro/Vite inline **only** `PUBLIC_`-prefixed variables into
 * `import.meta.env`, and this repo declares no `envField` schema — so
 * `import.meta.env.TDS_SITE_KEY` would be `undefined` in every build, forever,
 * with nothing to say so. That is exactly how `TOOLS_REGISTRY_TOKEN` spent its
 * entire life: the guard that read it was unconditionally true and the sync it
 * guarded never ran once.
 *
 * A `PUBLIC_` name is not the fix. These fetches run at build time in Node, so
 * `process.env` is real here — and a `PUBLIC_` variable would be inlined into
 * the shipped bundle, i.e. the credential would be published.
 *
 * ### A rejected key must break the build — and a `throw` here does NOT do that
 *
 * Every content fetch on this site is deliberately fail-soft: the call sites
 * wrap everything in `try/catch`, warn, and return the baked fallback. That is
 * right for an API hiccup and catastrophic for a wrong key — the site would
 * silently serve stale content and the deploy would report success.
 *
 * The first attempt at this threw from {@link assertKeyAccepted} and was
 * **swallowed by those very catch blocks**: a real build against a stub that
 * answers 401 printed the "the build stops here" message five times and then
 * completed, green. Nothing in a source-scanning test could see it.
 *
 * So the throw is only the diagnostic — it aborts that one fetch and puts the
 * reason in the log. The guarantee is {@link siteKeyRejections}, recorded here
 * and read by the `siteKeyGuard()` Astro integration in `astro.config.mjs`,
 * which fails the build in `astro:build:done`. No `catch` anywhere can reach
 * that, including one somebody adds later.
 */

/** The configured key, or `""`. Read once: the environment does not change mid-build. */
export const SITE_KEY: string = (process.env.TDS_SITE_KEY ?? "").trim();

/** Thrown by {@link assertKeyAccepted}. Named so a call site can re-raise it deliberately. */
export class SiteKeyRejectedError extends Error {
  readonly status: number;

  constructor(status: number, url: string) {
    super(
      `[tds-blog] TDS_SITE_KEY wurde abgelehnt (HTTP ${status}) von ${url}. ` +
        "Der Key ist unbekannt, widerrufen oder gehört zu einer anderen Site. " +
        "Im Admin-Portal unter Einstellungen → Site-Verbindungen einen neuen erzeugen.",
    );
    this.name = "SiteKeyRejectedError";
    this.status = status;
  }
}

/**
 * Every rejection seen during this build. Non-empty means the deploy is wrong.
 *
 * An array rather than a thrown error, because the thrown error is caught by the
 * fail-soft call sites — see the note above.
 *
 * **It hangs off `globalThis`, and that is not laziness.** `astro.config.mjs`
 * and the page modules are loaded into two separate module graphs, so a plain
 * module-scoped `const` gives the integration its *own* empty array: the guard
 * then reads zero rejections while the pages are recording several. That was the
 * second version of this and it failed exactly like the first — build green,
 * message printed, nothing stopped. `globalThis` is shared because the SSG
 * render and the config run in one Node process.
 */
const BUCKET = "__tdsSiteKeyRejections__" as const;

export const siteKeyRejections: string[] = ((globalThis as Record<string, unknown>)[BUCKET] ??=
  []) as string[];

/** Request headers carrying the key, or `undefined` when none is configured. */
export function siteKeyHeaders(): Record<string, string> | undefined {
  return SITE_KEY === "" ? undefined : { "X-TDS-Site-Key": SITE_KEY };
}

/**
 * Record — and raise — a rejected key.
 *
 * Call it before the usual `!res.ok` fall-back so the two cases stay distinct:
 * a 500 or a timeout is still "render the fallbacks", a rejected credential is
 * "this deploy is wrong".
 */
export function assertKeyAccepted(res: Response, url: string | URL): void {
  if (SITE_KEY === "") return;
  if (res.status !== 401 && res.status !== 403) return;

  const where = String(url);
  if (!siteKeyRejections.includes(where)) siteKeyRejections.push(where);
  throw new SiteKeyRejectedError(res.status, where);
}

/**
 * Astro integration: fail the build if the key was rejected anywhere.
 *
 * This is the part that actually stops a bad deploy. `astro:build:done` runs
 * outside every content fetch's `try/catch`, so throwing here cannot be
 * swallowed — not by today's call sites and not by one added later.
 */
export function siteKeyGuard() {
  return {
    name: "tds-site-key-guard",
    hooks: {
      "astro:build:done": () => {
        if (siteKeyRejections.length === 0) return;
        throw new Error(
          `[tds-blog] TDS_SITE_KEY wurde von ${siteKeyRejections.length} Route(n) ` +
            `abgelehnt: ${siteKeyRejections.join(", ")}. Der Build bricht ab, statt still ` +
            "die gebackenen Inhalte auszuliefern — im Admin-Portal unter Einstellungen → " +
            "Site-Verbindungen einen gültigen Key erzeugen (oder TDS_SITE_KEY entfernen).",
        );
      },
    },
  };
}

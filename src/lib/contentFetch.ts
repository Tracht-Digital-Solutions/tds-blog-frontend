import { contentCache } from "./cache";
import { assertKeyAccepted, siteKeyHeaders } from "./siteKey";

/** A reachable API answered, but not with a 2xx. */
export class ContentHttpError extends Error {
  readonly status: number;

  constructor(status: number, url: string | URL) {
    super(`content-api ${new URL(String(url)).pathname} → ${status}`);
    this.name = "ContentHttpError";
    this.status = status;
  }
}

/**
 * One read against the content API: site-key headers, a timeout, the key
 * check, and a THROW on any non-2xx.
 *
 * None of these reads had a timeout. A hanging API held a server render open
 * until the host killed it; the tools site has always cut off at 10s.
 */
export async function readContentJson<T>(url: string | URL, timeoutMs = 10_000): Promise<T> {
  const res = await fetch(url, { headers: siteKeyHeaders(), signal: AbortSignal.timeout(timeoutMs) });
  assertKeyAccepted(res, url);
  if (!res.ok) throw new ContentHttpError(res.status, url);
  return (await res.json()) as T;
}

/**
 * Did the request never get an answer — host down, refused, timed out?
 *
 * Only then may a page fall back to DEMO content. A reachable API answering
 * 5xx, or rejecting the site key, is not an outage of the kind a demo stands
 * in for: demo posts used to be served (and cached) in production whenever the
 * API returned an error.
 */
export function isConnectionFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return true;
  return err.name !== "ContentHttpError" && err.name !== "SiteKeyRejectedError";
}

/**
 * Memoise a SUCCESSFUL read for the render generation; answer `fallback` on a
 * failed one without remembering it.
 *
 * Catching inside the memo pinned the fallback for the whole generation — the
 * memo only evicts a rejection — and a rejected site key was then counted on
 * the first render only, so the middleware stored later fallback pages.
 */
export async function memoisedOr<T>(key: string, load: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await contentCache.get(key, load);
  } catch (err) {
    console.warn(`[tds-blog] ${label} unavailable — using the fallback:`, err);
    return fallback;
  }
}

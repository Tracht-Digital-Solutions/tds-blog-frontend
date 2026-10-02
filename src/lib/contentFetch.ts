import { memoisedOr as sharedMemoisedOr } from "@tracht-digital-solutions/tds-shared/site";

import { contentCache } from "./cache";

/**
 * This site's binding of tds-shared/site: the reader comes from `./siteKey`
 * (it needs the site's key), the memo is this site's generation cache.
 */
export { ContentHttpError, isConnectionFailure } from "@tracht-digital-solutions/tds-shared/site";
export { readContentJson } from "./siteKey";

/** Remembers successes only — see `memoisedOr` in tds-shared/site. */
export function memoisedOr<T>(key: string, load: () => Promise<T>, fallback: T, label: string): Promise<T> {
  return sharedMemoisedOr(contentCache, key, load, fallback, (_message, err) =>
    console.warn(`[tds-blog] ${label} unavailable — using the fallback:`, err),
  );
}

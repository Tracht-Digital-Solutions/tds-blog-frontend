/**
 * The one page-cache instance this site uses.
 *
 * Both halves must share it — the middleware that stores renders and the
 * control endpoint that triggers them read the same store, the same token and
 * the same event map.
 */

import { pageCache, resolveCacheDirs } from "@tracht-digital-solutions/tds-shared/cache";

import { alwaysPaths, cacheEvents, contentCache } from "./cache";
import { connection } from "./connection";

export const siteCache = pageCache({
  ...resolveCacheDirs({ logger: (m) => console.warn(`[tds-blog] ${m}`) }),
  events: cacheEvents,
  alwaysPaths,
  tokenProvider: () => connection.cacheToken(),
  // Without this a rebuild re-renders whatever the process read at boot and
  // reports success.
  onInvalidate: () => contentCache.invalidate(),
  logger: (message) => console.warn(`[tds-blog] ${message}`),
});

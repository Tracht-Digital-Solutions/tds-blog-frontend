import { createContentReader, createSiteKeyGuard } from "@tracht-digital-solutions/tds-shared/site";

import { connection } from "./connection";

/**
 * Request-time protection for paired API reads — tds-shared's guard, bound to
 * this site's connection.
 *
 * The private key is loaded dynamically from the server-side connection file.
 * `connection.ts` retains `TDS_SITE_KEY` only as a one-release host fallback;
 * builds and GitHub workflows no longer receive it.
 *
 * Every public site used to keep a byte-identical copy of the guard (only this
 * label differed). `assertKeyAccepted` counts a 401/403 on `globalThis` before
 * it throws; `src/middleware.ts` refuses to store a render that grew the count.
 */
const guard = createSiteKeyGuard(connection, {
  label: "tds-blog",
  reconnectHint: "Bitte den Blog in seinen CMS-Einstellungen neu verbinden.",
});

export const { currentSiteKey, siteKeyHeaders, assertKeyAccepted } = guard;

/** Key, 10s timeout, key check, throw on non-2xx. See tds-shared/site. */
export const readContentJson = createContentReader(guard);

export { SiteKeyRejectedError, siteKeyRejectionCount } from "@tracht-digital-solutions/tds-shared/site";

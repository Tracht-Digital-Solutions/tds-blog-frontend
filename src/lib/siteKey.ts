import { connection } from "./connection";

/**
 * Request-time protection for paired API reads.
 *
 * The private key is loaded dynamically from the server-side connection file.
 * `connection.ts` retains `TDS_SITE_KEY` only as a one-release host fallback;
 * builds and GitHub workflows no longer receive it.
 */
export function currentSiteKey(): string {
  return connection.siteKey();
}

export class SiteKeyRejectedError extends Error {
  readonly status: number;

  constructor(status: number, url: string) {
    super(
      `[tds-blog] Der gekoppelte API-Zugang wurde abgelehnt (HTTP ${status}) von ${url}. ` +
        "Bitte den Blog in seinen CMS-Einstellungen neu verbinden.",
    );
    this.name = "SiteKeyRejectedError";
    this.status = status;
  }
}

const BUCKET = "__tdsSiteKeyRejections__" as const;
export const siteKeyRejections: string[] = ((globalThis as Record<string, unknown>)[BUCKET] ??=
  []) as string[];

const COUNTER = "__tdsSiteKeyRejectionCount__" as const;
export function siteKeyRejectionCount(): number {
  return ((globalThis as Record<string, unknown>)[COUNTER] as number | undefined) ?? 0;
}

export function siteKeyHeaders(): Record<string, string> | undefined {
  return connection.siteKeyHeaders();
}

export function assertKeyAccepted(res: Response, url: string | URL): void {
  if (currentSiteKey() === "") return;
  if (res.status !== 401 && res.status !== 403) return;

  const where = String(url);
  if (!siteKeyRejections.includes(where)) siteKeyRejections.push(where);
  const store = globalThis as Record<string, unknown>;
  store[COUNTER] = ((store[COUNTER] as number | undefined) ?? 0) + 1;
  throw new SiteKeyRejectedError(res.status, where);
}

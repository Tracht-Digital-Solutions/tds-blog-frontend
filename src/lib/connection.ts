import {
  connectionStatusResponse,
  runtimeConfigResponse,
  siteConnection,
} from "@tracht-digital-solutions/tds-shared/connection";

const DEFAULT_API_BASE = "https://api.tracht-digital.de";

function buildApiBase(): string {
  const content =
    (import.meta.env.CONTENT_API_URL as string | undefined) ?? `${DEFAULT_API_BASE}/content`;
  return content.trim().replace(/\/+$/, "").replace(/\/content$/, "") || DEFAULT_API_BASE;
}

/**
 * Where the account menu sends someone who is not signed in.
 *
 * This was the production URL as a literal, which made every non-production
 * build inconsistent with itself: `CONTENT_API_URL` moved the content reads to
 * the local stack while the account menu still bounced to the live login site
 * — and coming back from there with a session for the wrong API looks like a
 * login that simply did not take.
 */
function buildLoginUrl(): string {
  return (
    ((import.meta.env.PUBLIC_LOGIN_URL as string | undefined) ?? "https://auth.tracht-digital.de")
      .trim()
      .replace(/\/+$/, "") || "https://auth.tracht-digital.de"
  );
}

/** The private, dynamically re-readable connection for this server. */
export const connection = siteConnection({
  profile: "blog",
  fallbackApiBase: buildApiBase,
  fallbackSiteKey: () => process.env.TDS_SITE_KEY ?? "",
  fallbackCacheToken: () => process.env.TDS_CACHE_TOKEN ?? "",
  fallbackRuntime: () => {
    const apiBase = buildApiBase();
    return {
      apiBase,
      loginUrl: buildLoginUrl(),
      contactUrl: `${apiBase}/contact`,
      liveChatFrontend: "blog",
    };
  },
});

export const contentApiBase = (): string => `${connection.apiBase() || DEFAULT_API_BASE}/content`;
export const connectResponse = (request: Request): Promise<Response> => connection.handleConnect(request);
export const connectStatusResponse = (): Response => connectionStatusResponse(connection);
export const publicRuntimeResponse = (): Response => runtimeConfigResponse(connection);

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
      loginUrl: "https://auth.tracht-digital.de",
      contactUrl: `${apiBase}/contact`,
      liveChatFrontend: "blog",
    };
  },
});

export const contentApiBase = (): string => `${connection.apiBase() || DEFAULT_API_BASE}/content`;
export const connectResponse = (request: Request): Promise<Response> => connection.handleConnect(request);
export const connectStatusResponse = (): Response => connectionStatusResponse(connection);
export const publicRuntimeResponse = (): Response => runtimeConfigResponse(connection);

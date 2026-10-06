import type { APIRoute } from "astro";
import { buildServiceWorker, SW_HEADERS } from "@tracht-digital-solutions/tds-shared/pwa";

/**
 * The service worker (tds-shared/pwa). Prerendered, so its version is the
 * BUILD time: a new deploy installs a new worker, a server restart does not.
 *
 * Pages are network-first — online, the reader always gets the current build —
 * and every article read online stays readable offline (the last 30). The
 * control plane, the install wizard, print views and feeds are never cached.
 */
export const prerender = true;

const VERSION = String(Date.now());

export const GET: APIRoute = () =>
  new Response(
    buildServiceWorker({
      version: VERSION,
      offlinePages: { "/": "/offline", "/en/": "/en/offline" },
      exclude: ["/og/", "/rss", "/en/rss", "/sitemap", "/llms.txt", "/interests-index.json", "/tds-runtime.json"],
      maxPages: 30,
    }),
    { headers: SW_HEADERS },
  );

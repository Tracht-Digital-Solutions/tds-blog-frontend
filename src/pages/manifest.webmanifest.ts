import type { APIRoute } from "astro";
import { buildManifest, MANIFEST_HEADERS } from "@tracht-digital-solutions/tds-shared/pwa";

/**
 * The web app manifest: makes the journal installable ("Zum Home-Bildschirm"),
 * opening standalone like an app. Prerendered — it never varies per request.
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      buildManifest({
        name: "Tracht Journal",
        shortName: "Journal",
        description: "Wissen für deinen Betrieb: Digitalisierung, Websites, Werkzeuge.",
        lang: "de",
        themeColor: "#fafaf7",
        backgroundColor: "#fafaf7",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", purpose: "any" },
          { src: "/icons/maskable-512.png", sizes: "512x512", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "Aktuelle Themen", url: "/aktuelles" },
          { name: "English", url: "/en/" },
        ],
        categories: ["business", "education", "news"],
      }),
    ),
    { headers: MANIFEST_HEADERS },
  );

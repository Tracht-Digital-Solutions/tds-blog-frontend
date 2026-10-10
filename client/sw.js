/* tds-shared service worker — generated, do not edit. */
"use strict";
const C = {"version":"1791651439811","offline":{"/":"/offline","/en/":"/en/offline"},"exclude":["/tds/","/install","/api/","/auth","/konto","/account","/profil","/sw.js","/og/","/rss","/en/rss","/sitemap","/llms.txt","/interests-index.json","/tds-runtime.json"],"maxPages":30,"maxAssets":120,"keep":null,"pages":"tds-pages","assets":"tds-assets"};
const SHELL = "tds-shell-" + C.version;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((cache) => cache.addAll(Object.values(C.offline)))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("tds-shell-") && n !== SHELL).map((n) => caches.delete(n)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) {}
    }
    await self.clients.claim();
  })());
});

function excluded(url) {
  return C.exclude.some((p) => url.pathname === p.replace(/\/$/, "") || url.pathname.startsWith(p));
}

function cacheable(response) {
  if (!response || response.status !== 200 || response.type !== "basic") return false;
  const cc = (response.headers.get("Cache-Control") || "").toLowerCase();
  return !cc.includes("no-store") && !cc.includes("private");
}

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function offlineFor(url) {
  let best = "/";
  for (const prefix of Object.keys(C.offline)) {
    if (url.pathname.startsWith(prefix) && prefix.length > best.length) best = prefix;
  }
  return C.offline[best] || C.offline["/"];
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || excluded(url)) return;

  // Fingerprinted build assets: immutable by URL, so cache-first is safe.
  if (url.pathname.startsWith("/_astro/")) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (cacheable(res)) {
        const copy = res.clone();
        caches.open(C.assets).then((c) => c.put(req, copy)).then(() => trim(C.assets, C.maxAssets));
      }
      return res;
    })());
    return;
  }

  // Pages: network first, the cache only when the network fails.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        const res = preload || await fetch(req);
        const keep = !C.keep || C.keep.some((p) => url.pathname.startsWith(p));
        if (keep && cacheable(res) && !url.search) {
          const copy = res.clone();
          event.waitUntil(caches.open(C.pages).then((c) => c.put(url.pathname, copy)).then(() => trim(C.pages, C.maxPages)));
        }
        return res;
      } catch (err) {
        const cached = await caches.match(url.pathname, { cacheName: C.pages });
        if (cached) return cached;
        const fallback = await caches.match(offlineFor(url), { cacheName: SHELL });
        return fallback || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
  }
});

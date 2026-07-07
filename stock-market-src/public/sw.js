// Service worker for the Stock Command Center.
//
// Strategy:
// - hashed assets (assets/index-*.js|css): cache-first — immutable by name
// - data files and pages: network-first, falling back to the last cached
//   copy so the app opens with last-known quotes when offline
// - the manual-refresh endpoint (refresh?t=...) is never cached
//
// Data URLs carry cache-busting queries, so data cache entries are keyed
// with the query stripped and matched the same way.
const STATIC_CACHE = "scc-static-v1";
const DATA_CACHE = "scc-data-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(DATA_CACHE)
      .then((cache) => cache.add("./").catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DATA_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function dataKey(url) {
  const clean = new URL(url);
  clean.search = "";
  return clean.href;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const key = dataKey(request.url);
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DATA_CACHE);
      cache.put(key, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(key);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  // live-refresh endpoint: always straight to the network
  if (path.endsWith("/refresh")) return;
  if (/\/assets\/index-[\w-]+\.(js|css)$/.test(path)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  // pages, data files, standalone scripts, icons: network-first with
  // last-known fallback
  event.respondWith(networkFirst(request));
});

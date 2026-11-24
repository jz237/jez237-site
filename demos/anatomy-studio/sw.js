/**
 * Offline copy of the Anatomy Studio.
 *
 * Whatever a visit loads is kept, so the next visit opens from the device and works with no connection.
 *   - Files requested with a content hash (?v=…: the studio's own code, styles, data and models) never change,
 *     so they are answered from the copy and only fetched once. When a newer hash of the same file is stored,
 *     the older one is dropped.
 *   - Everything else (the page itself, the vendored three.js, fonts) is fetched fresh whenever there is a
 *     connection, and the copy is used only when there is not. Being online therefore always shows the current
 *     studio.
 * Only GET requests inside this folder and the site's shared assets are touched. To retire this worker, publish
 * a version whose activate handler calls caches.delete(CACHE) and registration.unregister().
 */
const CACHE = 'anatomy-studio-1';
const HOME = new URL('./', self.location).pathname;   // /demos/anatomy-studio/
const mine = url => url.origin === self.location.origin && (url.pathname.startsWith(HOME) || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/demos/assets/'));

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('anatomy-studio-') && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
})()));

async function keep(cache, request, response) {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  const url = new URL(request.url);
  if (url.searchParams.has('v')) for (const old of await cache.keys()) { const u = new URL(old.url); if (u.pathname === url.pathname && u.search !== url.search) await cache.delete(old); }
  try { await cache.put(request, response); } catch { /* out of space: the studio still works, it just is not kept */ }
}

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || !mine(url) || request.headers.has('range')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (url.searchParams.has('v')) {
      const hit = await cache.match(request);
      if (hit) return hit;
      const response = await fetch(request);
      event.waitUntil(keep(cache, request, response.clone()));
      return response;
    }
    try {
      const response = await fetch(request);
      event.waitUntil(keep(cache, request, response.clone()));
      return response;
    } catch (error) {
      // offline: the copy, ignoring options such as ?stage= that do not change which file this is
      const hit = await cache.match(request) || await cache.match(request, { ignoreSearch: true });
      if (hit) return hit;
      throw error;
    }
  })());
});

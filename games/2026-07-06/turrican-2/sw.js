/* Turrican II — Redux : service worker
 * Version-keyed cache. The page itself is network-first (deploys land
 * immediately); static assets are cache-first with background fill, so the
 * whole game plays offline once visited.
 */
const CACHE = 'turrican2-v1.20.0';
const CORE = [
  './',
  'manifest.json',
  'assets/data.js?v=1.20.0',
  'assets/engine.js?v=1.20.0',
  'assets/render.js?v=1.20.0',
  'assets/audio.js?v=1.20.0',
  'assets/input.js?v=1.20.0',
  'assets/game.js?v=1.20.0',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isPage = url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isPage) {
    // network-first so new versions propagate; cached copy is the offline fallback
    e.respondWith(
      fetch(e.request).then((r) => {
        const cp = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, cp));
        return r;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // cache-first for js/img/audio; fill the cache as the game is played
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {
        if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); }
        return r;
      }))
    );
  }
});

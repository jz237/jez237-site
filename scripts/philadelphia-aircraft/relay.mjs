import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

export const FEED = 'https://opendata.adsb.fi/api/v3/lat/40.125/lon/-75.25/dist/45';
const FIELDS = ['hex', 'flight', 'r', 't', 'category', 'lon', 'lat', 'alt_baro', 'alt_geom',
  'gs', 'track', 'baro_rate', 'geom_rate', 'seen_pos'];

export function createRelay({ token, fetchFeed = fetch, now = Date.now, onUpdate = () => {} }) {
  if (typeof token !== 'string' || token.length < 32) throw new Error('Relay secret is required');
  let cache, nextFetch = 0, pending;
  const expected = Buffer.from(`Bearer ${token}`);
  async function load() {
    try {
      const response = await fetchFeed(FEED, { redirect: 'error', signal: AbortSignal.timeout(7000),
        headers: { Accept: 'application/json',
          'User-Agent': 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)' } });
      if (!response.ok) {
        const error = new Error('Provider unavailable');
        error.accessRequired = [401, 403].includes(response.status);
        const retry = Number(response.headers.get('Retry-After'));
        error.retryAfter = error.accessRequired ? 3600 : response.status === 429
          ? Math.max(300, Math.min(86400, retry || 300)) : 30;
        await response.body?.cancel(); throw error;
      }
      if (!response.body) throw new Error('Missing response');
      const reader = response.body.getReader(), chunks = []; let length = 0;
      try {
        for (;;) {
          const { value, done } = await reader.read(); if (done) break;
          length += value.byteLength;
          if (length > 1048576) { await reader.cancel(); throw new Error('Response too large'); }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      const doc = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const timestamp = doc.now > 1e12 ? doc.now : doc.now * 1000;
      if (!Array.isArray(doc.ac) || !Number.isFinite(timestamp)
        || timestamp < now() - 120000 || timestamp > now() + 30000) throw new Error('Invalid feed');
      const ac = doc.ac.slice(0, 2000).filter(a => a && typeof a === 'object')
        .map(a => Object.fromEntries(FIELDS.filter(k => Object.hasOwn(a, k)).map(k => [k, a[k]])));
      cache = { status: 200, body: JSON.stringify({ now: doc.now, ac }), retryAfter: 15 };
    } catch (error) {
      const retryAfter = error.retryAfter || 30;
      cache = { status: 503, body: JSON.stringify({ error: 'Aircraft feed unavailable',
        accessRequired: !!error.accessRequired, retryAfter }), retryAfter, accessRequired: !!error.accessRequired };
    }
    nextFetch = now() + cache.retryAfter * 1000;
    onUpdate({ status: cache.status, at: now(), nextFetch });
    return cache;
  }
  return createServer({ requestTimeout: 10000, headersTimeout: 10000, maxHeaderSize: 8192 }, async (req, res) => {
    const supplied = Buffer.from(req.headers.authorization || '');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      res.writeHead(401); res.end(); return;
    }
    res.setHeader('X-Philadelphia-Aircraft-Relay', '1');
    if (req.method === 'GET' && req.url === '/health') { res.writeHead(204); res.end(); return; }
    // Exact route only: no file serving, request forwarding, queries, or arbitrary URLs.
    if (req.method !== 'GET' || req.url !== '/aircraft') { res.writeHead(404); res.end(); return; }
    try {
      if (!cache || now() >= nextFetch) {
        if (!pending) pending = load().finally(() => { pending = null; });
        await pending;
      }
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((nextFetch - now()) / 1000))));
      if (cache.accessRequired) res.setHeader('X-Aircraft-Access-Required', '1');
      res.writeHead(cache.status); res.end(cache.body);
    } catch { res.writeHead(503); res.end('{"error":"Relay unavailable"}'); }
  });
}

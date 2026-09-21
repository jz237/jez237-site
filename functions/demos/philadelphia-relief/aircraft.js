import { compactAircraft } from '../../../demos/philadelphia-relief/src/aircraft-data.js';

// One fixed public region; query strings cannot expand the request or select another host.
const FEED = 'https://api.adsb.lol/v2/point/40.125/-75.25/45';
const headers = { 'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=15' };

async function readBounded(response) {
  if (!response.ok || !response.body) {
    await response.body?.cancel(); throw new Error(`Provider HTTP ${response.status}`);
  }
  const reader = response.body.getReader(), chunks = []; let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 1048576) { await reader.cancel(); throw new Error('Aircraft response too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(size); let offset = 0;
  for (const part of chunks) { all.set(part, offset); offset += part.byteLength; }
  return JSON.parse(new TextDecoder().decode(all));
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response('Method not allowed',
    { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } });
  const url = new URL(context.request.url);
  const key = new Request(`${url.origin}/demos/philadelphia-relief/aircraft?schema=1`);
  const cached = await caches.default.match(key); if (cached) return cached;
  let response;
  try {
    const upstream = await fetch(FEED, { signal: AbortSignal.timeout(9000),
      headers: { Accept: 'application/json',
        'User-Agent': 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)' },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 15, '400-599': 30 } } });
    const data = compactAircraft(await readBounded(upstream));
    response = new Response(JSON.stringify(data), { headers });
  } catch (error) {
    // Fixed diagnostic categories only; never expose response bodies or request metadata.
    const detail = /^Provider HTTP \d{3}$/.test(error.message) ? error.message
      : ['Invalid aircraft feed', 'Outdated aircraft feed', 'Aircraft response too large'].includes(error.message)
        ? error.message : 'Provider connection failed';
    console.warn(JSON.stringify({ event: 'aircraft-feed-unavailable', detail }));
    response = new Response(JSON.stringify({ error: 'Aircraft feed temporarily unavailable' }),
      { status: 503, headers: { ...headers, 'Cache-Control': 'public, max-age=30', 'Retry-After': '30' } });
  }
  context.waitUntil(caches.default.put(key, response.clone()).catch(() => {}));
  return response;
}

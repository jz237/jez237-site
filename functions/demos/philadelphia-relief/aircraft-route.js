import { compactRoute, routeCallsign } from '../../../demos/philadelphia-relief/src/aircraft-route-data.js';

const SOURCE = 'https://vrs-standing-data.adsb.lol/routes/';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' };

async function readSmall(response) {
  if (!response.body) throw new Error('Missing route');
  const reader = response.body.getReader(), parts = []; let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      length += value.length;
      if (length > 32768) { await reader.cancel(); throw new Error('Oversized route'); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response('Method not allowed',
    { status: 405, headers: { Allow: 'GET' } });
  const url = new URL(context.request.url), callsign = routeCallsign(url.searchParams.get('callsign'));
  if (!callsign) return Response.json({ route: null }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const key = new Request(`${url.origin}/demos/philadelphia-relief/aircraft-route?callsign=${callsign}&schema=1`);
  const cached = await caches.default.match(key); if (cached) return cached;
  let route = null, status = 200, ttl = 600;
  try {
    const upstream = await fetch(`${SOURCE}${callsign.slice(0, 2)}/${callsign}.json`, {
      signal: AbortSignal.timeout(6000), redirect: 'manual',
      headers: { Accept: 'application/json',
        'User-Agent': 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)' },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 3600, '404': 600, '500-599': 60 } } });
    if (upstream.ok) {
      route = compactRoute(await readSmall(upstream), callsign);
      if (!route) throw new Error('Invalid route');
      ttl = 3600;
    } else {
      await upstream.body?.cancel();
      if (upstream.status !== 404) throw new Error('Route lookup unavailable');
    }
  } catch { status = 503; ttl = 60; }
  const response = Response.json({ route }, { status,
    headers: { ...headers, 'Cache-Control': `public, max-age=${ttl}` } });
  context.waitUntil(caches.default.put(key, response.clone()).catch(() => {}));
  return response;
}

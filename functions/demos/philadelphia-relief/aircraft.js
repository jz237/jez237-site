import { compactAircraft } from '../../../demos/philadelphia-relief/src/aircraft-data.js';

// One fixed public region; query strings cannot expand the request or select another host.
const FEED = 'https://opendata.adsb.fi/api/v3/lat/40.125/lon/-75.25/dist/45';
const RELAY = 'https://philly-aircraft-relay.jez237.workers.dev/aircraft';
const headers = { 'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=15' };

async function readBounded(response, relayed = false) {
  if (!response.ok || !response.body) {
    const seconds = Number(response.headers.get('Retry-After'));
    const error = new Error(`Provider HTTP ${response.status}`);
    error.accessRequired = relayed ? response.headers.get('X-Aircraft-Access-Required') === '1'
      : response.status === 401 || response.status === 403;
    error.retryAfter = error.accessRequired ? 3600
      : response.status === 429 ? Math.max(300, Math.min(86400, seconds || 300))
        : relayed ? Math.max(30, Math.min(86400, seconds || 30)) : 30;
    await response.body?.cancel(); throw error;
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
  const relayed = !!context.env?.AIRCRAFT_RELAY_KEY;
  const key = new Request(`${url.origin}/demos/philadelphia-relief/aircraft?schema=3&relay=${relayed ? 1 : 0}`);
  const cached = await caches.default.match(key); if (cached) return cached;
  let response;
  try {
    const upstream = await fetch(relayed ? RELAY : FEED, { signal: AbortSignal.timeout(relayed ? 10500 : 9000),
      redirect: 'manual',
      headers: { Accept: 'application/json',
        ...(relayed ? { Authorization: `Bearer ${context.env.AIRCRAFT_RELAY_KEY}` } : {}),
        'User-Agent': 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)' },
      cf: { cacheEverything: true,
        cacheTtlByStatus: { '200-299': 15, '401': 3600, '403': 3600, '429': 300, '500-599': 30 } } });
    const data = compactAircraft(await readBounded(upstream, relayed));
    if (relayed) data.relay = 'home';
    response = new Response(JSON.stringify(data), { headers });
  } catch (error) {
    // Fixed diagnostic categories only; never expose response bodies or request metadata.
    const detail = /^Provider HTTP \d{3}$/.test(error.message) ? error.message
      : ['Invalid aircraft feed', 'Outdated aircraft feed', 'Aircraft response too large'].includes(error.message)
        ? error.message : 'Provider connection failed';
    console.warn(JSON.stringify({ event: 'aircraft-feed-unavailable', detail }));
    const retryAfter = error.retryAfter || 30;
    response = new Response(JSON.stringify({ error: error.accessRequired
      ? 'Aircraft data provider approval required' : 'Aircraft feed temporarily unavailable',
      accessRequired: !!error.accessRequired, relayUnavailable: relayed && !error.accessRequired, retryAfter }),
      { status: 503, headers: { ...headers, 'Cache-Control': `public, max-age=${retryAfter}`,
        'Retry-After': String(retryAfter) } });
  }
  context.waitUntil(caches.default.put(key, response.clone()).catch(() => {}));
  return response;
}

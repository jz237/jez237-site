export const REGION = { west: -75.8, east: -74.7, south: 39.7, north: 40.55 };
export const agent = 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)';
export const inside = (lon, lat) => Number.isFinite(lon) && Number.isFinite(lat)
  && lon >= REGION.west && lon <= REGION.east && lat >= REGION.south && lat <= REGION.north;
export const clean = (s, n = 160) => typeof s === 'string' ? s.trim().slice(0, n) : '';
export const json = (body, ttl = 300, status = 200) => Response.json(body, { status,
  headers: { 'Cache-Control': `public, max-age=${ttl}`, 'X-Content-Type-Options': 'nosniff' } });
export async function bounded(response, max = 1048576) {
  if (!response.ok || !response.body) {
    await response.body?.cancel(); throw new Error('Source unavailable');
  }
  const reader = response.body.getReader(), parts = []; let total = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      total += value.byteLength;
      if (total > max) { await reader.cancel(); throw new Error('Source too large'); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total); let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return bytes;
}
export async function upstream(url, max = 1048576, type = 'json') {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'manual',
    headers: { 'User-Agent': agent, Accept: type === 'json' ? 'application/json' : '*/*' } });
  const bytes = await bounded(response, max);
  if (type === 'bytes') return { bytes, type: response.headers.get('Content-Type') || '' };
  const text = new TextDecoder().decode(bytes); return type === 'json' ? JSON.parse(text) : text;
}
export async function cached(context, path, load) {
  if (context.request.method !== 'GET') return new Response('Method not allowed',
    { status: 405, headers: { Allow: 'GET' } });
  const key = new Request(new URL(path, context.request.url)), hit = await caches.default.match(key);
  if (hit) return hit;
  let response;
  try { response = await load(); }
  catch { response = json({ error: 'Source temporarily unavailable. Try again shortly.' }, 60, 503); }
  context.waitUntil(caches.default.put(key, response.clone()).catch(() => {}));
  return response;
}

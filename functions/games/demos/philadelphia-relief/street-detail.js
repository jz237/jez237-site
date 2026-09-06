/** Bounded, same-origin OSM neighborhood extracts. No arbitrary upstream URLs or queries. */
export function streetCell(params) {
  if (!params.has('lon') || !params.has('lat')) return null;
  const lon = Number(params.get('lon')), lat = Number(params.get('lat'));
  if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -75.8 || lon > -74.7 || lat < 39.7 || lat > 40.55) return null;
  const x = Math.round((lon + 75.8) / 0.004) * 0.004 - 75.8;
  const y = Math.round((lat - 39.7) / 0.003) * 0.003 + 39.7;
  return { key: `${x.toFixed(4)},${y.toFixed(4)}`, lon: x, lat: y,
    bounds: { west: Math.max(-75.8, x - 0.004), east: Math.min(-74.7, x + 0.004),
      south: Math.max(39.7, y - 0.003), north: Math.min(40.55, y + 0.003) } };
}
export function streetQuery(cell) {
  const b = cell.bounds, bbox = [b.south,b.west,b.north,b.east].map(n => n.toFixed(6)).join(',');
  return `[out:json][timeout:20][maxsize:16777216];(way["highway"]["area"!="yes"](${bbox});way["building"]["building"!="no"](${bbox});node["addr:housenumber"](${bbox}););out geom;`;
}
const keys = ['name','highway','oneway','lanes','width','bridge','tunnel','layer','building',
  'height','min_height','building:levels','roof:shape','roof:height','roof:levels','roof:orientation',
  'roof:direction','roof:colour','building:colour','addr:housenumber','addr:street'];
export function compactStreets(raw, cell) {
  if (raw.remark || !Array.isArray(raw.elements) || raw.elements.length > 6000) throw new Error('Incomplete neighborhood extract');
  const elements = raw.elements.map(e => ({ id: e.id, type: e.type,
    ...(e.type === 'node' ? { lon: e.lon, lat: e.lat } : { geometry: (e.geometry || []).slice(0, 1200).map(p => [p.lon,p.lat]) }),
    tags: Object.fromEntries(keys.filter(k => e.tags?.[k]).map(k => [k,String(e.tags[k]).slice(0,160)])),
  }));
  return { ...cell, source: 'OpenStreetMap contributors · ODbL 1.0', elements };
}
async function boundedJson(response) {
  const reader = response.body.getReader(), chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      bytes += value.length;
      if (bytes > 8 * 1024 * 1024) { await reader.cancel(); throw new Error('Neighborhood response too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(bytes); let offset = 0;
  for (const part of chunks) { all.set(part, offset); offset += part.length; }
  return JSON.parse(new TextDecoder().decode(all));
}
export async function onRequest(context) {
  const { request } = context;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const fail = (status, error) => new Response(JSON.stringify({ error }), { status, headers });
  if (request.method !== 'GET') return fail(405, 'Method not allowed');
  const url = new URL(request.url);
  try {
    if (new URL(request.headers.get('origin') || request.headers.get('referer')).origin !== url.origin) return fail(403, 'Forbidden');
  } catch { return fail(403, 'Forbidden'); }
  const cell = streetCell(url.searchParams);
  if (!cell) return fail(400, 'Invalid neighborhood');
  const key = new Request(`${url.origin}${url.pathname}?cell=${cell.key}&v=1`);
  const cached = await caches.default.match(key); if (cached) return cached;
  for (const endpoint of ['https://overpass.private.coffee/api/interpreter',
    'https://overpass-api.de/api/interpreter']) {
    try {
      const upstream = await fetch(endpoint, {
        method: 'POST', body: new URLSearchParams({ data: streetQuery(cell) }),
        headers: { 'User-Agent': 'PhiladelphiaRelief/2.0 (https://jez237.com/games/demos/philadelphia-relief/)' },
        signal: AbortSignal.timeout(25000),
      });
      if (!upstream.ok) {
        console.warn(JSON.stringify({ message: 'Neighborhood provider busy',
          provider: new URL(endpoint).hostname, status: upstream.status }));
        await upstream.body?.cancel();
        continue;
      }
      const doc = compactStreets(await boundedJson(upstream), cell);
      const response = new Response(JSON.stringify(doc), {
        headers: { ...headers, 'Cache-Control': 'public, max-age=604800' },
      });
      context.waitUntil(caches.default.put(key, response.clone()));
      return response;
    } catch (error) {
      console.warn(JSON.stringify({ message: 'Neighborhood provider unavailable',
        provider: new URL(endpoint).hostname, error: error.message }));
    }
  }
  return fail(503, 'Neighborhood detail temporarily unavailable');
}

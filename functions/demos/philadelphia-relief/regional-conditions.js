import { STATIONS } from '../../../demos/philadelphia-relief/src/regional-data.js';

const finite = n => typeof n === 'number' && Number.isFinite(n);
export function compactWeather(doc) {
  const p = doc?.properties;
  if (!p || !Number.isFinite(Date.parse(p.timestamp))) return null;
  const t = p.temperature, w = p.windSpeed;
  const temperatureF = finite(t?.value) && t.unitCode === 'wmoUnit:degC' ? t.value * 1.8 + 32 : null;
  const factors = { 'wmoUnit:km_h-1': 0.621371, 'wmoUnit:m_s-1': 2.236936, 'wmoUnit:kt': 1.150779 };
  const windMph = finite(w?.value) && factors[w.unitCode] ? w.value * factors[w.unitCode] : null;
  return { timestamp: p.timestamp, description: String(p.textDescription || 'Conditions unavailable').slice(0, 160),
    temperatureF, windMph };
}
export function compactWater(doc) {
  if (String(doc?.metadata?.id) !== '8545240') return null;
  const row = doc.data?.at(-1);
  if (!row || typeof row.v !== 'string' || !row.v.trim() || !Number.isFinite(Number(row.v))) return null;
  if (typeof row.t !== 'string' || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(row.t)) return null;
  const timestamp = `${row.t.replace(' ', 'T')}Z`;
  if (!Number.isFinite(Date.parse(timestamp))) return null;
  // NOAA flags: large spread, rate of change, outlier, and outside expected limits.
  if (typeof row.f === 'string' && row.f.split(',').some(flag => flag.trim() === '1')) return null;
  return { timestamp, feet: Number(row.v), datum: 'MLLW', preliminary: row.q !== 'v' };
}
async function boundedJson(response) {
  if (!response.ok || !response.body) { await response.body?.cancel(); throw new Error('Provider unavailable'); }
  const reader = response.body.getReader(); const parts = []; let bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > 262144) { await reader.cancel(); throw new Error('Oversized observation'); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(bytes); let offset = 0;
  for (const part of parts) { all.set(part, offset); offset += part.length; }
  return JSON.parse(new TextDecoder().decode(all));
}
async function observation(url, compact) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'PhiladelphiaRelief/1.0 (https://jez237.com/demos/philadelphia-relief/)',
        Accept: 'application/json' }, cf: { cacheTtl: 300, cacheEverything: true } });
    return compact(await boundedJson(response));
  } catch { return null; }
}
export async function onRequest(context) {
  const { request } = context;
  const headers = { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store' };
  const reply = (body, status = 200, cache = 'no-store') => new Response(JSON.stringify(body),
    { status, headers: { ...headers, 'Cache-Control': cache } });
  if (request.method !== 'GET') return reply({ error: 'Method not allowed' }, 405);
  const url = new URL(request.url);
  const station = STATIONS.find(s => s.id === url.searchParams.get('station'));
  if (!station) return reply({ error: 'Unknown regional station' }, 400);
  const key = new Request(`${url.origin}${url.pathname}?station=${station.id}&v=1`);
  const cached = await caches.default.match(key); if (cached) return cached;
  const waterQuery = new URLSearchParams({ product: 'water_level', date: 'latest', datum: 'MLLW',
    station: '8545240', time_zone: 'gmt', units: 'english', format: 'json', application: 'jez237-philadelphia' });
  const [weather, water] = await Promise.all([
    observation(`https://api.weather.gov/stations/${station.id}/observations/latest`, compactWeather),
    observation(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${waterQuery}`, compactWater),
  ]);
  const response = reply({ station, weather, water, checkedAt: new Date().toISOString() },
    weather || water ? 200 : 503, weather && water ? 'public, max-age=300' : 'public, max-age=30');
  if (weather || water) context.waitUntil(caches.default.put(key, response.clone()));
  return response;
}

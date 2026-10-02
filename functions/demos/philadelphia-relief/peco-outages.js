import { MAP_BOUNDS, tileX, tileY } from '../../../demos/philadelphia-relief/src/map-layer-data.js';

// Public, anonymous Locations layer embedded by PECO's official outage map.
const STATE = 'https://kubra.io/stormcenter/api/v1/stormcenters/39e6d9f3-fdea-4539-848f-b8631945da6f/views/789577bd-d2c6-42b8-af4b-b51ae6f52b6c/currentState?preview=false';
const uuid = '[a-f0-9-]{36}';
const count = n => Number.isInteger(n) && n >= 0 && n <= 10000000 ? n : null;
const plain = value => typeof value === 'string' ? value.trim().slice(0, 240) : '';
const translated = value => plain(value?.['EN-US'] ?? value?.['en-US'] ?? value);
const timestamp = value => typeof value === 'string' && /^20\d\d-/.test(value)
  && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;

export function outageTiles() {
  const r = MAP_BOUNDS, keys = [];
  // Sixteen regional tiles, irrespective of camera movement or outage count.
  for (let x = Math.floor(tileX(r.west, 10)); x <= Math.floor(tileX(r.east, 10)); x++) {
    for (let y = Math.floor(tileY(r.north, 10)); y <= Math.floor(tileY(r.south, 10)); y++) {
      let key = '';
      for (let i = 9; i >= 0; i--) key += String(((x >> i) & 1) + 2 * ((y >> i) & 1));
      keys.push(key);
    }
  }
  return keys;
}

export function outagePaths(state) {
  const data = state?.data;
  if (!new RegExp(`^data/${uuid}$`).test(data?.interval_generation_data)
    || !new RegExp(`^cluster-data/\\{qkh\\}/${uuid}/${uuid}$`).test(data?.cluster_interval_generation_data)) {
    throw new Error('Unexpected PECO publication paths');
  }
  return { summary: `https://kubra.io/${data.interval_generation_data}/public/summary-1/data.json`,
    tile: key => `https://kubra.io/${data.cluster_interval_generation_data.replace('{qkh}',
      key.slice(-3).split('').reverse().join(''))}/public/cluster-1/${key}.json` };
}

// KUBRA's public point geometry uses Google's encoded polyline, lat/lon at 1e5.
export function outagePoint(encoded) {
  if (typeof encoded !== 'string' || encoded.length > 30) return null;
  let offset = 0;
  const next = () => {
    let value = 0, shift = 0, digit;
    do {
      if (offset >= encoded.length || shift > 25) throw new Error('Invalid point');
      digit = encoded.charCodeAt(offset++) - 63;
      if (digit < 0 || digit > 63) throw new Error('Invalid point');
      value |= (digit & 31) << shift; shift += 5;
    } while (digit >= 32);
    return ((value & 1) ? ~(value >> 1) : value >> 1) / 1e5;
  };
  try { const lat = next(), lon = next();
    return offset === encoded.length && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null;
  } catch { return null; }
}

export function compactOutage(row, tile) {
  const point = outagePoint(row?.geom?.p?.[0]), d = row?.desc, r = MAP_BOUNDS;
  if (!point || !d || count(d.n_out) === null || d.n_out < 1) throw new Error('Invalid outage');
  if (point.lon < r.west || point.lon > r.east || point.lat < r.south || point.lat > r.north) return null;
  const masked = count(d.cust_a?.mask), customers = masked ? null : count(d.cust_a?.val);
  return { id: `${tile}:${point.lat}:${point.lon}`, ...point, outages: d.n_out, grouped: d.cluster === true,
    name: `${d.n_out > 1 ? `${d.n_out} outages` : 'Outage'} near ${point.lat.toFixed(3)}, ${point.lon.toFixed(3)}`,
    customers, customersLabel: masked ? `Fewer than ${masked}` : customers === null ? 'Not reported' : String(customers),
    crew: translated(d.crew_status), cause: translated(d.cause), restoration: timestamp(d.etr) };
}

async function json(url, signal, empty404 = false) {
  const response = await fetch(url, { signal, redirect: 'error', headers: { Accept: 'application/json' },
    cf: { cacheTtl: url === STATE ? 120 : 600, cacheEverything: true } });
  if (empty404 && response.status === 404) { await response.body?.cancel(); return { file_data: [] }; }
  if (!response.ok || !response.body) { await response.body?.cancel(); throw new Error('PECO unavailable'); }
  const reader = response.body.getReader(), chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > 524288) { await reader.cancel(); throw new Error('Oversized PECO response'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(bytes); let at = 0;
  for (const chunk of chunks) { buffer.set(chunk, at); at += chunk.length; }
  return JSON.parse(new TextDecoder().decode(buffer));
}

export async function readOutages(signal) {
  const state = await json(STATE, signal), paths = outagePaths(state);
  const summary = (await json(paths.summary, signal))?.summaryFileData;
  const updatedAt = timestamp(summary?.date_generated), totals = summary?.totals?.[0];
  if (!updatedAt || Date.now() - Date.parse(updatedAt) > 86400000
    || Date.parse(updatedAt) > Date.now() + 600000 || count(totals?.total_outages) === null
    || count(totals?.total_cust_a?.val) === null || summary?.page_mode?.pausePublish) {
    throw new Error('PECO publication unavailable or expired');
  }
  const keys = outageTiles(), outages = [];
  // Four concurrent requests at most; fail the snapshot if any tile fails.
  for (let i = 0; i < keys.length; i += 4) {
    const batch = await Promise.all(keys.slice(i, i + 4).map(async key => {
      const doc = await json(paths.tile(key), signal, true);
      if (!Array.isArray(doc?.file_data) || doc.file_data.length > 1500) throw new Error('Invalid outage tile');
      return doc.file_data.map(row => compactOutage(row, key)).filter(Boolean);
    }));
    outages.push(...batch.flat());
    if (outages.length > 1500) throw new Error('Outage map capacity exceeded');
  }
  return { updatedAt, checkedAt: new Date().toISOString(), outages,
    serviceTotals: { outages: totals.total_outages, customers: totals.total_cust_a.val } };
}

export async function onRequest(context) {
  const reply = (doc, status = 200) => new Response(JSON.stringify(doc), { status, headers: {
    'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff',
    'Cache-Control': status === 200 ? 'public, max-age=120' : 'no-store' } });
  if (context.request.method !== 'GET') return reply({ error: 'Method not allowed' }, 405);
  const url = new URL(context.request.url), key = new Request(`${url.origin}${url.pathname}?v=1`);
  const cached = await caches.default.match(key); if (cached) return cached;
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 11000);
  try {
    const response = reply(await readOutages(controller.signal));
    context.waitUntil(caches.default.put(key, response.clone())); return response;
  } catch { return reply({ error: 'PECO outage data temporarily unavailable' }, 503); }
  finally { clearTimeout(timeout); controller.abort(); }
}

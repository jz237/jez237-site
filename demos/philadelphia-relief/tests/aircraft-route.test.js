import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactRoute, routeCallsign, routeFits } from '../src/aircraft-route-data.js';
import { onRequest } from '../../../functions/demos/philadelphia-relief/aircraft-route.js';

const phl = { iata: 'PHL', icao: 'KPHL', name: 'Philadelphia International Airport',
  location: 'Philadelphia', lat: 39.8719, lon: -75.2411 };
const iah = { iata: 'IAH', icao: 'KIAH', name: 'George Bush Intercontinental Houston Airport',
  location: 'Houston', lat: 29.9844, lon: -95.3414 };
const raw = { callsign: 'AAL889', _airports: [phl, iah] };
const plane = { callsign: 'AAL889', lat: 40, lon: -75.2 };

test('listed routes preserve airport order and names without asserting live confirmation', () => {
  const route = compactRoute(raw, 'AAL889');
  assert.deepEqual(route.airports.map(a => a.code), ['PHL', 'IAH']);
  assert.equal(route.airports[1].city, 'Houston'); assert.equal(route.confirmed, false);
  assert.ok(routeFits(route, plane));
  assert.equal(compactRoute(raw, 'AAL890'), null);
  assert.equal(compactRoute({ ...raw, _airports: [phl] }, 'AAL889'), null);
  assert.equal(compactRoute({ ...raw, _airports: [phl, { ...iah, lat: null }] }, 'AAL889'), null);
  for (const value of ['../AAL889', '', 'AAL889.json', 'AAL889&url=evil', '123456789']) {
    assert.equal(routeCallsign(value), null);
  }
});

test('rejects obvious reused-callsign routes far from the actual aircraft', () => {
  const wrong = compactRoute({ ...raw, _airports: [
    { ...phl, iata: 'PHX', lat: 33.4353, lon: -112.0059 },
    { ...iah, iata: 'AUS', lat: 30.1975, lon: -97.662 } ] }, 'AAL889');
  assert.equal(routeFits(wrong, plane), false);
  assert.equal(routeFits(compactRoute(raw, 'AAL889'), { ...plane, callsign: 'AAL900' }), false);
  assert.equal(routeFits(null, plane), false);
});

test('multi-stop itineraries preserve all stops and match any listed leg', () => {
  const bos = { ...phl, iata: 'BOS', name: 'Boston Logan', lat: 42.3656, lon: -71.0096 };
  const route = compactRoute({ ...raw, _airports: [iah, phl, bos] }, 'AAL889');
  assert.deepEqual(route.airports.map(a => a.code), ['IAH', 'PHL', 'BOS']);
  assert.ok(routeFits(route, { ...plane, lat: 41.3, lon: -73 }));
});

test('route endpoint restricts requests, shares cache, and separates missing data from outages', async () => {
  const originalFetch = globalThis.fetch, originalCaches = globalThis.caches;
  const entries = new Map(), pending = []; let calls = 0;
  globalThis.caches = { default: { match: async k => entries.get(k.url)?.clone(),
    put: async (k, r) => { entries.set(k.url, r); } } };
  globalThis.fetch = async url => {
    calls++; assert.equal(url, 'https://vrs-standing-data.adsb.lol/routes/AA/AAL889.json');
    return Response.json(raw);
  };
  const context = (query, method = 'GET') => ({ request: new Request(
    `https://example.com/demos/philadelphia-relief/aircraft-route?${query}`, { method }),
  waitUntil: p => pending.push(p) });
  try {
    assert.equal((await onRequest(context('callsign=..%2Fevil'))).status, 400);
    assert.equal((await onRequest(context('callsign=AAL889', 'POST'))).status, 405);
    assert.equal(calls, 0);
    const first = await onRequest(context('callsign=AAL889&url=https://evil.example'));
    assert.equal((await first.json()).route.airports[0].code, 'PHL');
    assert.equal(first.headers.get('Cache-Control'), 'public, max-age=3600');
    await Promise.all(pending);
    await onRequest(context('callsign=AAL889&cachebuster=123')); assert.equal(calls, 1);
    entries.clear(); globalThis.fetch = async () => new Response('', { status: 404 });
    const unknown = await onRequest(context('callsign=AAL889'));
    assert.equal(unknown.status, 200); assert.deepEqual(await unknown.json(), { route: null });
    assert.equal(unknown.headers.get('Cache-Control'), 'public, max-age=600');
    entries.clear(); globalThis.fetch = async () => new Response('', { status: 429 });
    const unavailable = await onRequest(context('callsign=AAL889'));
    assert.equal(unavailable.status, 503); assert.deepEqual(await unavailable.json(), { route: null });
    assert.equal(unavailable.headers.get('Cache-Control'), 'public, max-age=60');
  } finally { await Promise.all(pending); globalThis.fetch = originalFetch; globalThis.caches = originalCaches; }
});

test('rejects oversized, malformed and mismatched upstream route documents', async () => {
  const originalFetch = globalThis.fetch, originalCaches = globalThis.caches;
  globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
  try {
    for (const body of ['x'.repeat(32769), '<html>unavailable</html>',
      JSON.stringify({ ...raw, callsign: 'AAL900' })]) {
      globalThis.fetch = async () => new Response(body);
      const response = await onRequest({ request: new Request(
        'https://example.com/demos/philadelphia-relief/aircraft-route?callsign=AAL889'), waitUntil: () => {} });
      assert.equal(response.status, 503); assert.deepEqual(await response.json(), { route: null });
    }
  } finally { globalThis.fetch = originalFetch; globalThis.caches = originalCaches; }
});

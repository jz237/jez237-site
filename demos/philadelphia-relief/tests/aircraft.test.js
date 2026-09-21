import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactAircraft, flightPosition, appendFlightSample, flightMatches,
  flightDisplayHeight, ageSeconds } from '../src/aircraft-data.js';
import { onRequest } from '../../../functions/demos/philadelphia-relief/aircraft.js';

const now = 1800000000000;
const aircraft = { hex: 'a12345', flight: ' AAL123 ', r: 'N123AA', t: 'A321', category: 'A3',
  lon: -75.2, lat: 40, alt_baro: 8000, alt_geom: 8250, gs: 230, track: 355, seen_pos: 2 };
const feed = (ac = [aircraft]) => ({ now, ac });
test('regional feed preserves reported units, geometric height and position age', () => {
  const a = compactAircraft(feed(), now).aircraft[0];
  assert.equal(a.callsign, 'AAL123'); assert.equal(a.altitudeFt, 8000);
  assert.equal(a.height, 8250 * .3048); assert.equal(a.observedAt, now - 2000);
  assert.equal(a.altitudeKind, 'barometric'); assert.equal(ageSeconds(a, now), 2);
});
test('reject ground traffic, out-of-region coordinates, missing height, invalid IDs and old reports', () => {
  const bad = [{ lat: 39.6 }, { lon: -74.6 }, { lon: null }, { lat: NaN }, { hex: '<script>' },
    { alt_baro: 'ground' }, { alt_baro: null, alt_geom: null }, { seen_pos: 75 }, { seen_pos: null }];
  for (const patch of bad) assert.equal(compactAircraft(feed([{ ...aircraft, ...patch }]), now).aircraft.length, 0);
  assert.throws(() => compactAircraft({ ...feed(), now: now - 180000 }, now));
  assert.throws(() => compactAircraft({ ...feed(), now: now + 60000 }, now));
  assert.throws(() => compactAircraft({}, now));
});
test('missing fields remain unknown and duplicate aircraft are collapsed', () => {
  const a = compactAircraft(feed([{ ...aircraft, gs: null, track: undefined }, aircraft]), now).aircraft;
  assert.equal(a.length, 1); assert.equal(a[0].speed, null); assert.equal(a[0].track, null);
});
test('interpolation takes the short heading turn and never extrapolates beyond known reports', () => {
  const a = compactAircraft(feed(), now).aircraft[0];
  const b = { ...a, observedAt: a.observedAt + 20000, lon: a.lon + .01, height: a.height + 100, track: 5 };
  const p = flightPosition([a, b], a.observedAt + 10000);
  assert.equal(p.track, 0); assert.equal(p.height, a.height + 50);
  assert.equal(flightPosition([a, b], now + 60000), b);
});
test('trails reject repeated or backward observations and break at jumps or gaps', () => {
  const a = compactAircraft(feed(), now).aircraft[0], samples = [];
  appendFlightSample(samples, a); appendFlightSample(samples, a);
  assert.equal(samples.length, 1);
  appendFlightSample(samples, { ...a, observedAt: a.observedAt - 1 }); assert.equal(samples.length, 1);
  appendFlightSample(samples, { ...a, lon: a.lon + .5, observedAt: a.observedAt + 1000 });
  assert.equal(samples.length, 1);
  appendFlightSample(samples, { ...a, observedAt: a.observedAt + 90000 }); assert.equal(samples.length, 1);
});
test('filters use provider categories; display lift leaves factual altitude untouched', () => {
  const a = compactAircraft(feed(), now).aircraft[0];
  assert.ok(flightMatches(a, 'large')); assert.ok(flightMatches(a, 'low'));
  assert.ok(!flightMatches(a, 'helicopter')); assert.ok(flightMatches({ ...a, category: 'A7' }, 'helicopter'));
  assert.equal(flightDisplayHeight(a, 100, 15), a.height + 1400);
  assert.equal(a.altitudeFt, 8000);
});
test('endpoint caches a fixed region and handles provider failure without returning fabricated flights', async () => {
  const originalFetch = globalThis.fetch, originalCaches = globalThis.caches;
  const cache = new Map(), pending = []; let calls = 0;
  globalThis.caches = { default: { match: async k => cache.get(k.url)?.clone(),
    put: async (k, response) => { cache.set(k.url, response); } } };
  globalThis.fetch = async url => {
    calls++; assert.equal(url, 'https://opendata.adsb.fi/api/v3/lat/40.125/lon/-75.25/dist/45');
    return Response.json({ ...feed(), now: Date.now() });
  };
  const context = suffix => ({ request: new Request(`https://example.com/demos/philadelphia-relief/aircraft${suffix}`),
    waitUntil: p => pending.push(p) });
  try {
    const response = await onRequest(context('?url=https://evil.example'));
    assert.equal(response.status, 200); assert.equal((await response.json()).aircraft.length, 1);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    await Promise.all(pending);
    assert.equal([...cache.values()][0].headers.get('Cache-Control'), 'public, max-age=15');
    const hit = await onRequest(context('?lat=0')); assert.equal(calls, 1);
    assert.equal(hit.headers.get('Cache-Control'), 'no-store');
    cache.clear(); globalThis.fetch = async () => new Response('limited', { status: 429 });
    const failure = await onRequest(context(''));
    assert.equal(failure.status, 503); assert.equal(failure.headers.get('Retry-After'), '300');
    assert.equal((await failure.json()).aircraft, undefined);
    cache.clear(); globalThis.fetch = async () => new Response('denied', { status: 403 });
    const denied = await onRequest(context(''));
    assert.equal(denied.headers.get('Retry-After'), '3600');
    assert.equal(denied.headers.get('Cache-Control'), 'no-store');
    assert.equal((await denied.json()).accessRequired, true);
    await Promise.all(pending);
    assert.equal([...cache.values()][0].headers.get('Cache-Control'), 'public, max-age=3600');
    assert.equal((await onRequest({ request: new Request('https://example.com', { method: 'POST' }) })).status, 405);
  } finally { globalThis.fetch = originalFetch; globalThis.caches = originalCaches; }
});

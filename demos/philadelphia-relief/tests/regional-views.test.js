import test from 'node:test';
import assert from 'node:assert/strict';
import { nearestStation, streetViewUrl, observationTime, CAMERA_SOURCES } from '../src/regional-data.js';
import { compactWeather, compactWater, onRequest }
  from '../../../functions/demos/philadelphia-relief/regional-conditions.js';

test('local links follow the map center, encode coordinates, and reject locations outside this region', () => {
  const url = new URL(streetViewUrl({ lat: 40.1368222, lon: -74.8827262 }));
  assert.equal(url.searchParams.get('viewpoint'), '40.136822,-74.882726');
  assert.equal(url.searchParams.get('map_action'), 'pano');
  assert.equal(url.searchParams.get('api'), '1');
  for (const pose of [{ lat: 0, lon: 0 }, { lat: NaN, lon: -75 }, { lat: 40, lon: Infinity }]) {
    assert.equal(streetViewUrl(pose), null); assert.equal(nearestStation(pose), null);
  }
  assert.equal(nearestStation({ lat: 39.95, lon: -75.16 }).id, 'KPHL');
  assert.equal(nearestStation({ lat: 40.1368, lon: -74.8827 }).id, 'KPNE');
  assert.equal(nearestStation({ lat: 40.276, lon: -74.817 }).id, 'KTTN');
  for (const camera of CAMERA_SOURCES) assert.equal(new URL(camera.url).protocol, 'https:');
});
test('NWS unit conversion preserves missing data instead of inventing zero readings', () => {
  const properties = { timestamp: '2026-09-20T20:30:00Z', textDescription: 'Cloudy',
    temperature: { value: 26, unitCode: 'wmoUnit:degC' },
    windSpeed: { value: 11.124, unitCode: 'wmoUnit:km_h-1' } };
  const result = compactWeather({ properties });
  assert.equal(result.temperatureF, 78.80000000000001);
  assert.ok(Math.abs(result.windMph - 6.912) < .01);
  assert.equal(compactWeather({ properties: { ...properties, temperature: { value: null } } }).temperatureF, null);
  assert.equal(compactWeather({ properties: { ...properties, windSpeed: { value: 5, unitCode: 'unknown' } } })
    .windMph, null);
  assert.equal(compactWeather({}), null);
});
test('NOAA readings retain datum, quality and UTC time, and reject missing or flagged water levels', () => {
  const row = { t: '2026-09-20 20:42', v: '2.972', q: 'p', f: '0,0,0,0' };
  const doc = data => ({ metadata: { id: '8545240' }, data: [data] });
  assert.deepEqual(compactWater(doc(row)), {
    timestamp: '2026-09-20T20:42Z', feet: 2.972, datum: 'MLLW', preliminary: true });
  assert.equal(compactWater(doc({ ...row, v: '' })), null);
  assert.equal(compactWater(doc({ ...row, f: '0,0,1,0' })), null);
  assert.equal(compactWater(doc({ ...row, t: undefined })), null);
  assert.equal(compactWater({ ...doc(row), metadata: { id: 'other' } }), null);
});
test('observation labels distinguish delayed, invalid and future readings', () => {
  const now = Date.parse('2026-09-20T21:00:00Z');
  assert.match(observationTime('2026-09-20T20:42:00Z', now), /18 min ago/);
  assert.match(observationTime('2026-09-20T12:00:00Z', now), /delayed observation/);
  assert.equal(observationTime('invalid', now), 'Observation time unavailable');
  assert.equal(observationTime('2026-09-21T00:00:00Z', now), 'Observation time unavailable');
});
test('conditions endpoint rejects unapproved stations and methods before accessing upstream services', async () => {
  for (const station of ['https://example.com', 'KJFK', '../KPHL', '']) {
    const response = await onRequest({ request: new Request(
      `https://jez237.com/demos/philadelphia-relief/regional-conditions?station=${encodeURIComponent(station)}`) });
    assert.equal(response.status, 400);
  }
  assert.equal((await onRequest({ request: new Request('https://jez237.com/', { method: 'POST' }) })).status, 405);
});
test('conditions endpoint serves partial observations, bounds response size, and caches successful results', async () => {
  const savedFetch = globalThis.fetch, savedCaches = globalThis.caches;
  const entries = new Map(); const tasks = []; let requests = 0;
  globalThis.caches = { default: {
    match: async key => entries.get(key.url)?.clone(),
    put: async (key, response) => { entries.set(key.url, response); },
  } };
  globalThis.fetch = async url => {
    requests++;
    return new Response(url.includes('weather.gov') ? ' '.repeat(262145) : JSON.stringify({
      metadata: { id: '8545240' }, data: [{ t: '2026-09-20 20:42', v: '2.972', f: '0,0,0,0', q: 'p' }],
    }));
  };
  try {
    const context = { request: new Request('https://jez237.com/regional-conditions?station=KPHL'),
      waitUntil: task => tasks.push(task) };
    const response = await onRequest(context), body = await response.json();
    assert.equal(response.status, 200); assert.equal(body.weather, null); assert.equal(body.water.feet, 2.972);
    await Promise.all(tasks);
    assert.equal((await onRequest(context)).status, 200); assert.equal(requests, 2);
  } finally { globalThis.fetch = savedFetch; globalThis.caches = savedCaches; }
});

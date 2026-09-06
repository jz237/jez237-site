import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assess, ASSETS } from '../src/degraded.js';

test('local street asset is substantial, geographic and retains regional roads', () => {
  const data = JSON.parse(readFileSync(new URL('../data/roads.geojson', import.meta.url)));
  const local = data.features.find((f) => f.properties.t === 5);
  assert.equal(local.geometry.type, 'MultiLineString');
  assert.ok(local.geometry.coordinates.length > 9000);
  assert.ok(data.features.some((f) => f.properties.t === 1));
  for (const line of local.geometry.coordinates) {
    assert.ok(line.length >= 2);
    for (const [lon, lat] of line) {
      assert.ok(Number.isFinite(lon) && lon > -75.4 && lon < -74.9);
      assert.ok(Number.isFinite(lat) && lat > 39.7 && lat < 40.2);
    }
  }
});

test('a missing supplemental city texture preserves the base imagery layer', () => {
  const results = Object.fromEntries(ASSETS.map((a) => [a.id, a.id !== 'cityImagery']));
  assert.equal(assess(results).mode, 'full');
  assert.deepEqual(assess(results).disableLayers, []);
});

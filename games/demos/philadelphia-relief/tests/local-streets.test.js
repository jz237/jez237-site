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


import { streetJunctions } from '../src/vectors.js';
test('crosswalks require distinct junction branches, not bends or duplicate geometry', () => {
  const bend = [[0, 0], [1, 0], [1, 1]];
  assert.equal(streetJunctions([bend, bend]).size, 0);
  const junctions = streetJunctions([bend, [[1, 0], [2, 0]]]);
  assert.deepEqual([...junctions], ['1,0']);
});

test('Levittown local streets surround The Hidden Reef', () => {
  const data = JSON.parse(readFileSync(new URL('../data/roads.geojson', import.meta.url)));
  const local = data.features.find((f) => f.properties.district === 'levittown');
  assert.ok(local.geometry.coordinates.length > 100);
  const points = local.geometry.coordinates.flat();
  assert.ok(points.some(([lon, lat]) => Math.hypot(lon + 74.8827262, lat - 40.1368222) < 0.002));
});

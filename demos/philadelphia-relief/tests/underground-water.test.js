import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clipWaterSegment, WATER_AREAS, waterBounds } from '../src/underground-water.js';

test('water paths clip at all four exhibit edges and never join separate source segments', () => {
  const box = {west: 0, east: 10, south: 0, north: 10};
  assert.deepEqual(clipWaterSegment([-5,5],[15,5],box), [[0,5],[10,5]]);
  assert.deepEqual(clipWaterSegment([5,15],[5,-5],box), [[5,10],[5,0]]);
  assert.equal(clipWaterSegment([-5,5],[-1,9],box), null);
  assert.equal(clipWaterSegment([5,11],[10,11],box), null);
  assert.deepEqual(clipWaterSegment([0,0],[0,10],box), [[0,0],[0,10]]);
});

test('public snapshots contain valid geographic records with explicit display scope', () => {
  for (const area of Object.keys(WATER_AREAS)) {
    if (area === 'transit') continue; // Transit overview does not load water snapshots.
    const data = JSON.parse(readFileSync(new URL(`../data/underground/${area}.json`,import.meta.url)));
    assert.match(data.source, /Philadelphia Water Department/);
    assert.equal(data.retrieved, '2026-09-23');
    const box = waterBounds(area);
    assert.ok(box.west < box.east && box.south < box.north);
    if (area === 'city') assert.equal(data.inlets.length, 0);
    else assert.ok(data.inlets.length > 5000);
    for (const point of [...data.inlets,...data.outfalls]) {
      assert.ok(point[0] >= box.west && point[0] <= box.east);
      assert.ok(point[1] >= box.south && point[1] <= box.north);
      assert.equal(point.length, 4); // Source system/type, no invented depth/connection.
    }
    for (const layer of [data.culverts,data.historic]) for (const feature of layer) {
      assert.ok(feature.name);
      for (const path of feature.paths) for (const point of path) {
        assert.ok(Number.isFinite(point[0]) && Number.isFinite(point[1]));
      }
    }
  }
});

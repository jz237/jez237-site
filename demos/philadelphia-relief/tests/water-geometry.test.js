import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../vendor/three.module.min.js';
import { collectRings, triangulateWithHoles } from '../src/vectors.js';

test('baked water triangles cover each polygon and exclude its islands', async () => {
  const doc = JSON.parse(await readFile(new URL('../data/water.geojson', import.meta.url)));
  const area = ring => Math.abs(ring.reduce((sum, a, i) => {
    const b = ring[(i + 1) % ring.length];
    return sum + a[0] * b[1] - a[1] * b[0];
  }, 0)) / 2;
  const local = ring => ring.slice(0, -1).map(([x, y]) => [(x + 75) * 85000, (y - 40) * 111000]);
  const rings = collectRings(doc);
  assert.ok(rings.length > 300);
  for (const [id, entry] of rings.entries()) {
    const outer = local(entry.ring), holes = entry.holes.map(local);
    const points = [...outer, ...holes.flat()];
    const triangles = triangulateWithHoles(THREE.ShapeUtils.triangulateShape, THREE, outer, holes);
    let covered = 0;
    for (let i = 0; i < triangles.length; i += 3) {
      covered += area(triangles.slice(i, i + 3).map(index => points[index]));
    }
    const expected = area(outer) - holes.reduce((sum, ring) => sum + area(ring), 0);
    assert.ok(Math.abs(covered - expected) <= Math.max(.1, expected * .001),
      `water polygon ${id}: triangles cover ${covered} m²; outline encloses ${expected} m²`);
  }
});

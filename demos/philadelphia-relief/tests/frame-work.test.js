import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createUpdateGate, createElevationCache } from '../src/frame-work.js';
import { controlBoxes } from '../src/label-policy.js';
import { createImageryTiles } from '../src/imagery-tiles.js';

test('marker projection follows movement without repeating stationary work', () => {
  const gate = createUpdateGate();
  assert.equal(gate.take('view-a', 0), true);
  for (let t = 16; t < 1000; t += 16) assert.equal(gate.take('view-a', t), false);
  assert.equal(gate.take('view-a', 1000), true, 'age labels still refresh');
  assert.equal(gate.take('view-b', 1010), false, 'coalesce sub-frame input');
  assert.equal(gate.take('view-b', 1033), true, 'moving pins no longer wait 150 ms');
  gate.invalidate();
  assert.equal(gate.take('view-b', 1034), true, 'fresh data and UI changes bypass pacing');
});

test('flight trails reuse elevation until a sample location changes', () => {
  let calls = 0;
  const elevation = createElevationCache((lon, lat) => { calls++; return lon + lat; });
  const samples = Array.from({ length: 64 }, (_, lon) => ({ lon, lat: 40 }));
  for (let frame = 0; frame < 60; frame++) for (const s of samples) {
    assert.equal(elevation(s), s.lon + s.lat);
  }
  assert.equal(calls, 64);
  samples[0].lon++;
  assert.equal(elevation(samples[0]), 41);
  assert.equal(calls, 65);
});

test('overlays share layout reads, but a later task sees changed control bounds', async () => {
  const previous = globalThis.getComputedStyle;
  let reads = 0, left = 5;
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible' });
  const root = { querySelectorAll: () => [{ getBoundingClientRect() {
    reads++; return { left, right: left + 10, top: 5, bottom: 15 };
  } }] };
  try {
    const first = controlBoxes(root);
    assert.equal(controlBoxes(root), first);
    assert.equal(reads, 1);
    await Promise.resolve(); left = 20;
    assert.equal(controlBoxes(root)[0].l, 20);
    assert.equal(reads, 2);
  } finally {
    if (previous) globalThis.getComputedStyle = previous;
    else delete globalThis.getComputedStyle;
  }
});

test('aerial tile culling encloses shader-displaced terrain at every exaggeration', async () => {
  const region = { west: -75.8, east: -74.7, south: 39.7, north: 40.55 };
  const projection = { metersPerDegLon: 85220, metersPerDegLat: 111033 };
  const sceneProjection = { lonToX: lon => (lon + 75.25) * projection.metersPerDegLon,
    latToZ: lat => (40.125 - lat) * projection.metersPerDegLat };
  const terrain = { uniforms: { uExag: { value: 15 }, uReliefOn: { value: 1 } } };
  const tiles = createImageryTiles(THREE, { region, projection, sceneProjection, terrain,
    elevation: { min: -5, max: 377 },
    load: async () => ({ image: { width: 512, height: 512 }, source: 'test' }) });
  try {
    tiles.consider({ lon: -75.16, lat: 39.95, dist: 300, pitch: 0, bearing: 0, fov: 42 },
      true, 1366, 1, 'balanced', 'standard', 768);
    await new Promise(resolve => setImmediate(resolve));
    assert.ok(tiles.group.children.length > 0);
    for (const scale of [0, 1, 15, 80]) {
      terrain.uniforms.uExag.value = scale; tiles.tick(.1);
      for (const mesh of tiles.group.children) {
        assert.equal(mesh.frustumCulled, true);
        const b = mesh.userData.cell.bounds;
        for (const lon of [b.west, b.east]) for (const lat of [b.north, b.south]) {
          for (const h of [-5, 377]) {
            const p = new THREE.Vector3(sceneProjection.lonToX(lon), h * scale + .12,
              sceneProjection.latToZ(lat));
            assert.ok(mesh.geometry.boundingBox.containsPoint(p));
            assert.ok(mesh.geometry.boundingSphere.containsPoint(p));
          }
        }
      }
    }
  } finally { tiles.dispose(); }
});

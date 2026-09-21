import test from 'node:test';
import assert from 'node:assert/strict';
import { frameDelay } from '../src/render-policy.js';
import { clusterPoints } from '../src/map-clusters.js';
import { preferLightweight, districtAssets } from '../src/startup-policy.js';
import { createStore } from '../src/state.js';
import { photoWanted } from '../src/photo-policy.js';
import { encodeState, decodeState } from '../src/urlstate.js';

test('idle pacing yields immediately to movement, loading and recent input', () => {
  const idle = { saving: true, now: 5000, lastInteraction: 0 };
  assert.equal(frameDelay(idle), 500);
  assert.equal(frameDelay({ ...idle, live: true }), 50);
  for (const override of [{ saving: false }, { moving: true }, { loading: true },
    { lastInteraction: 4000 }]) assert.equal(frameDelay({ ...idle, ...override }), 0);
  assert.equal(frameDelay({ ...idle, lastInteraction: 3000 }), 500);
});

test('clusters retain all members, separate kinds, and cross spatial grid edges', () => {
  const points = [
    { key: 'a', type: 'ship', x: 47, y: 47 },
    { key: 'b', type: 'ship', x: 49, y: 49 },
    { key: 'c', type: 'ship', x: 200, y: 200 },
    { key: 'd', type: 'gauge', x: 47, y: 47 },
    { key: 'e', type: 'landmark', x: 47, y: 47 },
    { key: 'f', type: 'landmark', x: 48, y: 48 },
  ];
  const groups = clusterPoints(points);
  assert.equal(groups.length, 5);
  assert.deepEqual(groups[0].members.map(p => p.key), ['a', 'b']);
  assert.equal(groups[0].x, 48);
  assert.equal(groups.flatMap(g => g.members).length, points.length);
  assert.deepEqual(clusterPoints([...points].reverse()), groups);
});

test('separate distant pins and ignore invalid projections without hiding valid ones', () => {
  const points = [
    { key: 'a', type: 'gauge', x: -1, y: 0 },
    { key: 'b', type: 'gauge', x: 47, y: 0 },
    { key: 'c', type: 'gauge', x: NaN, y: 0 },
  ];
  assert.equal(clusterPoints(points).length, 2);
  assert.equal(clusterPoints(points, 56).length, 1);
  assert.deepEqual(clusterPoints([]), []);
});

test('marker grouping works on Chrome versions without Array.toSorted and does not mutate data', () => {
  const original = Array.prototype.toSorted;
  try {
    Array.prototype.toSorted = undefined;
    const points = [{ key: 'b', type: 'gauge', x: 1, y: 1 }, { key: 'a', type: 'gauge', x: 2, y: 2 }];
    assert.equal(clusterPoints(points)[0].key, 'a|b');
    assert.deepEqual(points.map(p => p.key), ['b', 'a']);
    assert.deepEqual(clusterPoints([]), []);
  } finally { Array.prototype.toSorted = original; }
});

test('limited-device defaults respect explicit choices and tolerate missing hardware hints', () => {
  assert.equal(preferLightweight({ cores: 4 }), true);
  assert.equal(preferLightweight({ memory: 4, cores: 16 }), true);
  assert.equal(preferLightweight({ memory: 8, cores: 8 }), false);
  assert.equal(preferLightweight({ memory: 4, saved: 'off' }), false);
  assert.equal(preferLightweight({ memory: 16, cores: 16, saved: 'on' }), true);
  assert.equal(preferLightweight({}), false);
});

test('lighter mode preserves every selected overlay and survives a shared URL', () => {
  const store = createStore(), layers = { ...store.get().layers };
  store.set({ lightweight: 1 });
  assert.deepEqual(store.get().layers, layers);
  assert.equal(photoWanted(store.get(), 1000), false);
  const shared = decodeState(encodeState(store.get()));
  assert.equal(shared.lightweight, 1);
  store.set({ lightweight: 0 });
  assert.equal(photoWanted(store.get(), 1000), true);
});

test('district photographs wait until their geographic area is in view', () => {
  assert.deepEqual(districtAssets({ lon: -75.28, lat: 39.98, dist: 132000 }, true), []);
  assert.deepEqual(districtAssets({ lon: -75.16, lat: 39.95, dist: 6000 }, true), ['cityImagery']);
  assert.deepEqual(districtAssets({ lon: -74.88, lat: 40.14, dist: 6000 }, true), ['reefImagery']);
  assert.deepEqual(districtAssets({ lon: -75.16, lat: 39.95, dist: 6000 }, false), []);
});

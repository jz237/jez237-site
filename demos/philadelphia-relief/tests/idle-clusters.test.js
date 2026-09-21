import test from 'node:test';
import assert from 'node:assert/strict';
import { frameDelay } from '../src/render-policy.js';
import { clusterPoints } from '../src/map-clusters.js';

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

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  damageFromImpulse,
  derbyOrder,
  advanceCheckpoint,
  CHECKPOINTS,
  trackPoint,
  terrainHeight,
} from '../src/rules.ts';
test('resting loads cause no damage; crashes escalate but one impact is survivable', () => {
  assert.equal(damageFromImpulse(500), 0);
  assert.equal(damageFromImpulse(1700), 0);
  assert.ok(damageFromImpulse(7000) > damageFromImpulse(3000));
  assert.equal(damageFromImpulse(100000), 28);
});
test('derby timeout ranks condition first, then inflicted damage, with stable ties', () => {
  const list = [
    { id: 1, health: 50, inflicted: 20 },
    { id: 2, health: 50, inflicted: 80 },
    { id: 0, health: 70, inflicted: 0 },
    { id: 3, health: 0, inflicted: 999 },
  ];
  assert.deepEqual(
    derbyOrder(list).map((c) => c.id),
    [0, 2, 1, 3],
  );
  assert.equal(list[0].id, 1);
});
test('only approaching the next checkpoint counts; shortcuts cannot skip it', () => {
  const p = CHECKPOINTS[5];
  assert.equal(advanceCheckpoint(p.x, p.z, 5, Infinity).passed, true);
  assert.equal(advanceCheckpoint(p.x + 5, p.z, 5, 3).passed, false);
  const other = CHECKPOINTS[12];
  assert.equal(advanceCheckpoint(other.x, other.z, 5, Infinity).passed, false);
});
test('circuit closes and the derby arena is flat', () => {
  const a = trackPoint(0),
    b = trackPoint(1);
  assert.ok(Math.hypot(a.x - b.x, a.z - b.z) < 1e-8);
  assert.equal(terrainHeight(0, 0), 0);
  assert.equal(terrainHeight(29, -29), 0);
  assert.ok(terrainHeight(220, 0) > 20);
});

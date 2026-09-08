import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveArenaCollision, COLLISION_RULES } from '../engine/defense.mjs';
import { FINISHER_CHOREOGRAPHY, sampleFinisher, spaceFinisherPose } from '../engine/finisher-scripts.mjs';

const body = (side, y, extra = {}) => ({ side, x: 600 + side * 10, y, grounded: false, halfWidth: 65, ...extra });
test('airborne fighters at the same height cannot occupy the same body space', () => {
  const pair = resolveArenaCollision(body(0, 450), body(1, 450));
  assert.equal(pair.legalCrossup, false);
  assert.equal(pair.bX - pair.aX, 130);
});
test('a juggled victim remains separated, while a voluntary high jump can cross', () => {
  const grounded = body(0, 600, { grounded: true });
  const airborne = body(1, 600 - COLLISION_RULES.crossupClearance - 10);
  assert.equal(resolveArenaCollision(grounded, airborne).legalCrossup, true);
  const hit = resolveArenaCollision(grounded, { ...airborne, hitstun: true });
  assert.equal(hit.legalCrossup, false);
  assert.equal(hit.bX - hit.aX, 130);
});
test('all cinematic tracks leave room for both bodies without changing their beats or midpoint', () => {
  for (const [id, script] of Object.entries(FINISHER_CHOREOGRAPHY)) {
    let previous;
    for (let t = 0; t <= script.duration; t += 1 / 120) {
      const original = sampleFinisher(script.keys, t);
      const pose = spaceFinisherPose(original);
      assert.ok(pose.vx - pose.ax >= 170 - 1e-8, `${id} ${t}`);
      assert.ok(Math.abs(pose.ax + pose.vx - original.ax - original.vx) < 1e-8);
      for (const key of ['ay', 'vy', 'ar', 'vr', 'af', 'vf', 'a', 'v', 'zoom']) assert.equal(pose[key], original[key]);
      if (previous) assert.ok(Math.abs(pose.ax - previous.ax) < 16 && Math.abs(pose.vx - previous.vx) < 16, `${id}: smooth spacing`);
      previous = pose;
    }
  }
});

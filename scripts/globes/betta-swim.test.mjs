import test from 'node:test';
import assert from 'node:assert/strict';
import { BettaSwim } from './src/fish/bettaSwim.mjs';

const env = { radius: 0.95, sandLevel: -0.55, level: 0.181, iso: 0.5 };
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));

test('free swimming explores all three dimensions, rests and bursts without escaping', () => {
  for (const seed of [237, 42, 901]) {
    const s = new BettaSwim(seed), modes = new Set();
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    let still = 0, turns = 0;
    for (let i = 0; i < 60 * 240; i++) {
      const before = [...s.position], yaw = s.heading;
      s.advance(1 / 60, [0, 0, 0], env);
      modes.add(s.mode);
      assert.ok([...s.position, ...s.velocity, s.heading, s.pitch, s.drive].every(Number.isFinite));
      assert.ok(Math.hypot(...s.position) <= env.radius - 0.34 + 1e-8);
      assert.ok(s.position[1] >= env.sandLevel + 0.22 - 1e-8 && s.position[1] <= env.level - 0.20 + 1e-8);
      assert.ok(Math.hypot(...s.position.map((v, k) => v - before[k])) < 0.004);
      assert.ok(Math.abs(wrap(s.heading - yaw)) < 1.66 / 60);
      if (Math.hypot(...s.velocity) < 0.004) still++;
      if (Math.abs(s.angularVelocity) > 0.5) turns++;
      for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], s.position[k]); max[k] = Math.max(max[k], s.position[k]); }
    }
    assert.ok(max[0] - min[0] > 0.5 && max[2] - min[2] > 0.5 && max[1] - min[1] > 0.14);
    assert.ok(still > 300 && turns > 300);
    assert.deepEqual([...modes].sort(), ['burst', 'cruise', 'glide', 'hover']);
  }
});

test('translation follows the nose and the bend tracks actual turn rate', () => {
  const s = new BettaSwim();
  for (let i = 0; i < 3000; i++) {
    const heading = s.heading;
    s.advance(1 / 60, [0, 0, 0], env);
    if (s.speed > 0.01) {
      const dot = s.velocity[0] * -Math.cos(s.heading) + s.velocity[2] * Math.sin(s.heading);
      assert.ok(dot > 0, 'backwards/sideways swimming');
    }
    assert.ok(Math.abs((s.heading - heading) * 60 - s.angularVelocity) < 1e-9);
  }
});

test('pause preserves pose, and 30/60/120 Hz runs follow the same route', () => {
  const at = hz => {
    const s = new BettaSwim();
    for (let i = 0; i < hz * 30; i++) s.advance(1 / hz, [0, 0, 0], env);
    const snapshot = JSON.stringify(s);
    s.advance(0, [0.5, 0.5, 0.5], env);
    assert.equal(JSON.stringify(s), snapshot);
    return s;
  };
  const reference = at(60);
  for (const hz of [30, 120]) {
    const s = at(hz);
    assert.ok(Math.hypot(...s.position.map((v, k) => v - reference.position[k])) < 0.02);
    assert.ok(Math.abs(wrap(s.heading - reference.heading)) < 0.08);
  }
});

test('strong/reversing water and dry probes stay within the usable water envelope', () => {
  const s = new BettaSwim();
  for (let i = 0; i < 7200; i++) {
    s.advance(1 / 30, [Math.sin(i / 31) * 0.6, Math.cos(i / 79) * 0.6, 0.6], env, i % 240 < 180);
    assert.ok(Math.hypot(...s.position) <= env.radius - 0.34 + 1e-8);
    assert.ok(s.position[1] >= env.sandLevel + 0.22 - 1e-8 && s.position[1] <= env.level - 0.20 + 1e-8);
  }
});

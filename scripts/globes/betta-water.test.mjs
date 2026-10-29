import test from 'node:test';
import assert from 'node:assert/strict';
import { BETTA_PROBES, BETTA_SURFACE_AT, BETTA_SURFACE_COUNT, bettaSurfaceHeights, readBettaWater } from './src/fish/bettaWater.mjs';
import { BettaSwim, BETTA_SCALE } from './src/fish/bettaSwim.mjs';

const env = { radius: 0.95, sandLevel: -0.55, level: 0.246, iso: 0.5, gravity: [0, -24, 0] };
const points = Float32Array.from(BETTA_PROBES.flatMap(p => [...p.map(v => v * BETTA_SCALE), 0]));
function sample(translation, spin = [0, 0, 0]) {
  const probes = new Float32Array(64);
  for (let i = 0; i < 16; i++) {
    const [x, y, z] = points.slice(i * 4, i * 4 + 3);
    probes.set([translation[0] + spin[1] * z - spin[2] * y,
      translation[1] + spin[2] * x - spin[0] * z,
      translation[2] + spin[0] * y - spin[1] * x, 1], i * 4);
  }
  return { probes, sand: new Float32Array(16).fill(-0.55), centroid: [0, -0.17, 0] };
}
const calm = () => readBettaWater(null, points, env);
const hover = () => { const s = new BettaSwim(); s.position = [0, -0.17, 0]; s.mode = 'hover'; s.timer = 100; return s; };

test('uniform current is not attenuated and cannot invent rotational turbulence', () => {
  const w = readBettaWater(sample([0.9, 0.3, -0.5]), points, env);
  assert.ok(Math.abs(w.flow[0] - 0.9) < 1e-6);
  assert.ok(Math.hypot(...w.angular) < 1e-7);
  assert.equal(w.submerged, 1);
  assert.equal(w.airAbove, 0);
});

test('differential probes recover all three rotation axes independently of translation', () => {
  for (const spin of [[1, 0, 0], [0, -1.4, 0], [0, 0, 2], [0.6, -0.4, 0.8]]) {
    const w = readBettaWater(sample([0.7, -0.2, 0.3], spin), points, env);
    assert.ok(Math.hypot(...w.angular.map((v, k) => v - spin[k])) < 1e-6);
  }
});

test('body wetness, air above and actual bed samples are not lost in a mean velocity', () => {
  const s = sample([0.6, 0, 0]);
  for (const i of [0, 1, 2, 6]) s.probes[i * 4 + 3] = 0;
  s.sand[3] = -0.42;
  const w = readBettaWater(s, points, env);
  assert.equal(w.submerged, 0.5); assert.equal(w.airAbove, 1);
  assert.ok(Math.abs(w.sand + 0.42) < 1e-6);
  s.probes.fill(0);
  const dry = readBettaWater(s, points, env);
  assert.equal(dry.submerged, 0); assert.deepEqual(dry.flow, [0, 0, 0]);
  assert.deepEqual(dry.angular, [0, 0, 0]);
});

test('slosh carries the fish with inertia, reverses, and settles without the old tiny drift cap', () => {
  const s = hover(), w = calm();
  for (let i = 0; i < 60; i++) s.advance(1 / 60, [0.8, 0, 0], env, true, w);
  assert.ok(s.drift[0] > 0.25 && s.position[0] > 0.19);
  for (let i = 0; i < 60; i++) s.advance(1 / 60, [-0.8, 0, 0], env, true, w);
  assert.ok(s.drift[0] < -0.24);
  for (let i = 0; i < 240; i++) s.advance(1 / 60, [0, 0, 0], env, true, w);
  assert.ok(Math.hypot(...s.drift) < 0.003);
});

test('vertical turbulence is not clipped to the resting-water band', () => {
  const s = hover(), w = calm();
  for (let i = 0; i < 90; i++) s.advance(1 / 60, [0, 0.8, 0], env, true, w);
  assert.ok(s.position[1] > env.level - 0.2 + 0.10);
});

test('shear tips and rotates the fish; it rights itself afterward', () => {
  const s = hover(), w = calm(); w.angular = [1.8, 0.8, 1.1];
  const yaw = s.heading;
  for (let i = 0; i < 45; i++) s.advance(1 / 60, [0, 0, 0], env, true, w);
  assert.ok(Math.abs(s.heading - yaw) > 0.2);
  assert.ok(Math.abs(s.roll) > 0.18 && Math.abs(s.pitch) > 0.04);
  assert.ok(Math.abs(s.angularVelocity) > 0.4);
  w.angular = [0, 0, 0];
  for (let i = 0; i < 300; i++) s.advance(1 / 60, [0, 0, 0], env, true, w);
  assert.ok(Math.abs(s.roll) < 0.002 && Math.abs(s.pitch) < 0.002);
});

test('air exposure loses buoyancy, and violent reversing flow remains finite and inside glass', () => {
  const s = hover(), w = calm(); w.submerged = 0; w.airAbove = 1;
  s.advance(1 / 60, [0, 0, 0], env, false, w);
  assert.ok(s.drift[1] < -0.3);
  w.submerged = 1; w.airAbove = 0;
  for (let i = 0; i < 7200; i++) {
    w.angular = [Math.sin(i / 20) * 4, Math.cos(i / 70) * 3, Math.sin(i / 35) * 5];
    s.advance(1 / 30, [Math.sin(i / 31) * 2, Math.cos(i / 45), Math.cos(i / 53) * 2], env, true, w);
    assert.ok([...s.position, ...s.velocity, s.heading, s.pitch, s.roll].every(Number.isFinite));
    assert.ok(Math.hypot(...s.position) <= env.radius - 0.29 + 1e-7);
    assert.ok(s.position[1] >= w.sand + 0.07 - 1e-7);
  }
});

test('the surface column recovers the free surface height from the density iso crossing', () => {
  const heights = bettaSurfaceHeights(env.level);
  assert.equal(heights.length, BETTA_SURFACE_COUNT);
  assert.ok(Math.abs(heights[0] - (env.level - 0.056)) < 1e-6 && Math.abs(heights[7] - (env.level + 0.056)) < 1e-6);
  // Smoothed interface: density falls linearly from 1 to 0 over 0.045 centred on `at`.
  const sense = at => {
    const s = sample([0, -0.17, 0]);
    s.probes = new Float32Array(256);
    s.probes.set(sample([0, -0.17, 0]).probes);
    for (let k = 0; k < BETTA_SURFACE_COUNT; k++) s.probes[(BETTA_SURFACE_AT + k) * 4 + 3] = Math.max(0, Math.min(1, 0.5 - (heights[k] - at) / 0.045));
    return s;
  };
  for (const at of [env.level - 0.03, env.level - 0.004, env.level, env.level + 0.02, env.level + 0.04]) {
    const water = readBettaWater(sense(at), points, env);
    assert.ok(Math.abs(water.surface - at) < 5e-4, `${at}: ${water.surface}`);
  }
  // Outside the window (slosh, a tilted globe, or no reading yet) there is no height at all.
  assert.equal(readBettaWater(sense(env.level - 0.2), points, env).surface, null);
  assert.equal(readBettaWater(sense(env.level + 0.2), points, env).surface, null);
  assert.equal(readBettaWater(null, points, env).surface, null);
  assert.equal(readBettaWater(sample([0, -0.17, 0]), points, env).surface, null);
});

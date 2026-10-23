import test from 'node:test';
import assert from 'node:assert/strict';
import { BettaSwim, GULP_LENGTH, MOUTH_DEPTH, bettaMouthHeight, gulpGillCover, gulpMouth } from './src/fish/bettaSwim.mjs';

const env = { radius: 0.95, sandLevel: -0.55, level: 0.181, iso: 0.5 };
const calm = (surface = env.level) => ({ flow: [0, 0, 0], angular: [0, 0, 0], submerged: 1, airAbove: 0, surface, sand: env.sandLevel, centroid: [0, -0.17, 0] });
const upright = { ...env, gravity: [0, -24, 0] };
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
      assert.ok(Math.abs(wrap(s.heading - yaw)) <= 3.01 / 60);
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

function runGulp(seconds, { water = () => calm(), environment = upright, seed = 237 } = {}) {
  const s = new BettaSwim(seed), log = [];
  for (let i = 0; i < seconds * 60; i++) {
    s.advance(1 / 60, [0, 0, 0], environment, true, water(i / 60));
    const mouth = bettaMouthHeight(s.position[1], s.pitch);
    log.push({ t: i / 60, mode: s.mode, mouth, gulp: s.gulp, gill: s.gulpGill, pitch: s.pitch, position: [...s.position] });
  }
  return { s, log };
}

test('the mouth and gill cycle opens, closes and pulses within the gulp', () => {
  assert.equal(gulpMouth(0), 0);
  assert.ok(gulpMouth(0.5) > 1.05 && gulpMouth(0.5) <= 1.1 + 1e-9);
  assert.ok(gulpMouth(GULP_LENGTH) < 1e-6 && gulpGillCover(GULP_LENGTH) < 1e-6);
  assert.ok(gulpGillCover(1.2) > 0.9 && gulpGillCover(0.5) === 0);
});

test('an upright calm globe sends the betta up to gulp air with its lips at the surface, then back down', () => {
  for (const seed of [237, 42, 901]) {
    const { log } = runGulp(240, { seed });
    const modes = new Set(log.map(r => r.mode));
    for (const m of ['rise', 'gulp', 'dive']) assert.ok(modes.has(m), `${seed} never reached ${m}`);
    const first = log.find(r => r.mode === 'rise');
    assert.ok(first.t > 15 && first.t < 45, `first trip at ${first.t}`);
    const trips = log.filter((r, i) => r.mode === 'rise' && log[i - 1]?.mode !== 'rise').length;
    assert.ok(trips >= 2 && trips <= 4, `trips ${trips}`);
    let open = 0, gill = 0;
    for (const r of log) {
      assert.ok(Number.isFinite(r.mouth) && r.position.every(Number.isFinite));
      assert.ok(r.mouth <= env.level + 0.006, `lips broke the surface by ${r.mouth - env.level}`);
      assert.ok(Math.hypot(...r.position) <= env.radius - 0.29 + 1e-8);
      if (r.mode === 'gulp') {
        assert.ok(Math.abs(r.mouth - (env.level - MOUTH_DEPTH)) < 0.012, `hold height ${r.mouth}`);
        assert.ok(r.pitch > 0.7);
        open = Math.max(open, r.gulp); gill = Math.max(gill, r.gill);
      }
    }
    assert.ok(open > 1 && gill > 0.9);
    // After a trip it is swimming below the surface again.
    const after = log.filter(r => r.mode === 'glide' || r.mode === 'cruise');
    assert.ok(after.every(r => r.mouth < env.level - 0.01));
  }
});

test('no measured surface, or a tilted globe, never triggers a trip; a lost surface aborts one', () => {
  for (const [name, options] of [
    ['no surface reading', { water: () => ({ ...calm(), surface: null }) }],
    ['tilted globe', { environment: { ...env, gravity: [-9, -22, 0] } }],
    ['sloshing surface', { water: () => calm(env.level + 0.06) }],
  ]) {
    const { log } = runGulp(240, options);
    assert.ok(log.every(r => !['rise', 'gulp', 'dive'].includes(r.mode)), name);
  }
  const { log } = runGulp(120, { water: t => calm(t < 40 ? env.level : null) });
  const mid = log.filter(r => r.t >= 22 && r.t < 40);
  assert.ok(log.some(r => r.mode === 'gulp'), 'precondition: a trip begins');
  assert.ok(log.filter(r => r.t > 45).every(r => !['rise', 'gulp'].includes(r.mode)));
  assert.ok(mid.length > 0 && log.every(r => Number.isFinite(r.gulp) && r.gulp < 1.11));
});

test('trips do not change the route when the surface is unmeasured', () => {
  const a = runGulp(60, { water: () => ({ ...calm(), surface: null }) }).s, b = new BettaSwim();
  for (let i = 0; i < 3600; i++) b.advance(1 / 60, [0, 0, 0], upright, true, { ...calm(), surface: null });
  assert.deepEqual(a.position, b.position);
});

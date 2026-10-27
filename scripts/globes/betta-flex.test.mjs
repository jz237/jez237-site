import test from 'node:test';
import assert from 'node:assert/strict';
import { BodyMotion } from '../betta-atelier/src/body-motion.js';
import { FinDynamics } from '../betta-atelier/src/fin-dynamics.js';
import { BettaSwim, BETTA_SCALE } from './src/fish/bettaSwim.mjs';

test('relaxed broad fins yield to water at quarter-span and mid-span, not only the fringe', () => {
  for (const kind of [0, 1, 2]) {
    const make = () => new FinDynamics({ kind, side: 0, columns: 17, rows: 13, point(u, v) {
      if (kind) return [-0.65 + u * 1.65, (kind === 1 ? 1 : -1) * (0.28 + v * (0.25 + u * 0.7)), 0];
      const a = (u - 0.5) * 2.7;
      return [0.8 + Math.cos(a) * v, Math.sin(a) * v + (u - 0.5) * 0.12, 0];
    } });
    const calm = make(), moving = make(), body = new BodyMotion();
    const s = { body, time: 0, phase: 0, pectoralPhase: 0, drive: 0, effort: 0, turn: 0, flare: 0,
      heading: 0, velocity: [0, 0, 0], angularVelocity: 0, origin: [0, 0, 0], strength: 0, direction: 'front' };
    for (let i = 0; i < 240; i++) {
      calm.advance(1 / 60, { ...s, externalFlow: [0, 0, 0] });
      moving.advance(1 / 60, { ...s, externalFlow: [0, 0, 1] });
    }
    for (const row of [3, 6]) {
      let deflection = 0, length = 0;
      for (let i = 0; i < moving.columns; i++) {
        const q = (row * moving.columns + i) * 3;
        deflection += moving.position[q + 2] - calm.position[q + 2];
        length += Math.hypot(...[0, 1, 2].map(k => moving.rest[q + k] - moving.roots[i * 3 + k]));
      }
      assert.ok(deflection / length > 0.12, `fin ${kind}, row ${row}: stiff interior (${deflection / length})`);
    }
    assert.equal(moving.metrics().anchorError, 0);
    assert.ok(moving.metrics().maxRayStrain < 0.07);
  }
});

test('head-led flexion can reach a U, preserves arc length, has no neck hinge and releases smoothly', () => {
  const traces = [];
  for (const fps of [30, 60, 120]) for (const sign of [-1, 1]) {
    const b = new BodyMotion(); let peak = 0;
    for (let i = 0; i < fps * 2; i++) {
      b.advanceTurn(1 / fps, sign * 3, 0.18); b.update(0, 0, sign * 3, 0);
      const a = b.turnAngles;
      peak = Math.max(peak, Math.abs(a.at(-1)));
      for (let k = 1; k < a.length; k++) assert.ok(Math.abs(a[k] - a[k - 1]) <= 1.65 * 2.276 / 24 + 1e-8);
      let length = 0;
      for (let k = 4; k < b.data.length; k += 4) length += Math.hypot(b.data[k] - b.data[k - 4], b.data[k + 1] - b.data[k - 3]);
      assert.ok(Math.abs(length - 3.87) < 0.003);
    }
    assert.ok(peak > 2.7 && peak <= 2.95, `not U-shaped: ${peak}`);
    const neck = b.frame(-1.22, []); assert.deepEqual(neck, [-1.22, 0, 1, 0]);
    const snapshot = [...b.turnAngles]; b.advanceTurn(0, 0, 0); assert.deepEqual([...b.turnAngles], snapshot);
    b.advanceTurn(1 / fps, 0, 0.5);
    assert.ok(Math.abs(b.turnAngles.at(-1)) > peak * 0.9, 'tail snapped straight when steering stopped');
    for (let i = 0; i < fps * 4; i++) b.advanceTurn(1 / fps, 0, 0.5);
    assert.ok(Math.max(...b.turnAngles.map(Math.abs)) < 0.01);
    traces.push(peak);
  }
  assert.ok(Math.max(...traces) - Math.min(...traces) < 0.02);
});

test('a real autonomous reversal produces deep flexion; passive water spin does not request muscular bending', () => {
  const env = { radius: 0.95, sandLevel: -0.55, level: 0.181, iso: 0.5 };
  const s = new BettaSwim(), b = new BodyMotion();
  s.position = [0, -0.17, 0]; s.heading = 0; s.target = [0.45, -0.17, 0];
  let peak = 0;
  for (let i = 0; i < 180; i++) {
    s.advance(1 / 60, [0, 0, 0], env);
    b.advanceTurn(1 / 60, s.steerRate, s.speed / BETTA_SCALE);
    peak = Math.max(peak, Math.abs(b.turnAngles.at(-1)));
  }
  // (Going back the way it came it swings round in a tight arc at a real fish's pace, not on the spot
  // at the old fixed rate: the body bends into a deep C, well past a right angle, rather than a
  // full U; a halfmoon's trunk is a stiff one.)
  assert.ok(peak > 1.5, `turn controller cannot reach deep pose: ${peak}`);
  // (Hovering it turns a little of its own accord, as its twin in still water does (its slow coming
  // round to a heading set aside); spun by the water, its body bends just as that twin's: the
  // water's spin asks nothing of its muscles.)
  const spun = new BettaSwim(), still = new BettaSwim();
  for (const f of [spun, still]) { f.mode = 'hover'; f.timer = 100; f.position = [0, -0.17, 0]; f.hoverPivot = 0; }
  const passive = new BodyMotion(), own = new BodyMotion();
  for (let i = 0; i < 60; i++) {
    spun.advance(1 / 60, [0, 0, 0], env, true, { angular: [0, 1, 0], submerged: 1, airAbove: 0, sand: -0.55, centroid: [0, -0.2, 0] });
    still.advance(1 / 60, [0, 0, 0], env, true, { angular: [0, 0, 0], submerged: 1, airAbove: 0, sand: -0.55, centroid: [0, -0.2, 0] });
    passive.advanceTurn(1 / 60, spun.steerRate, 0);
    own.advanceTurn(1 / 60, still.steerRate, 0);
  }
  assert.ok(spun.angularVelocity > 0.7);
  assert.deepEqual([...passive.turnAngles], [...own.turnAngles]);
});

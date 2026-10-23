import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FinDynamics, waterVelocity } from './src/fin-dynamics.js';

const make = (kind = 0, side = 0) => new FinDynamics({
  kind, side, columns: 17, rows: 13,
  point(u, v) {
    const angle = (u - 0.5) * 2.7;
    if (kind === 3) return [-0.8 + v * 0.3, (u - 0.5) * (0.06 + v * 0.35), side * (0.267 + v * 0.19)];
    if (kind === 4) return [-0.9 + v * 0.35, -0.3 - v * 0.9, side * (0.14 + v * 0.05)];
    return [0.8 + Math.cos(angle) * v, Math.sin(angle) * v + (u - 0.5) * 0.12, 0.02 * Math.sin(u * 15) * v * v];
  },
});
const state = (t, strength = 0, direction = 'front') => ({
  time: t, phase: t * 2.8, pectoralPhase: t * 15, drive: 0.1, turn: 0,
  flare: 1, heading: 0, velocity: [0, 0, 0], angularVelocity: 0,
  origin: [0, 0, 0], strength, direction,
});
function run(fin, seconds, strength, direction, fps = 60) {
  for (let i = 1; i <= seconds * fps; i++) fin.advance(1 / fps, state(i / fps, strength, direction));
  return fin;
}
const edgeMean = (f, axis) => {
  let sum = 0;
  for (let i = 0; i < f.columns; i++) sum += f.position[((f.rows - 1) * f.columns + i) * 3 + axis];
  return sum / f.columns;
};

test('zero current is truly still; directional currents reverse without random frame noise', () => {
  assert.deepEqual(waterVelocity(2, 1, 2, 3, 0, 'changing', []), [0, 0, 0]);
  for (const [a, b, axis] of [['left', 'right', 0], ['down', 'up', 1], ['back', 'front', 2]]) {
    assert.ok(waterVelocity(2, 1, 2, 3, 1, a, [])[axis] < 0);
    assert.ok(waterVelocity(2, 1, 2, 3, 1, b, [])[axis] > 0);
  }
});
test('all seven fins remain anchored, finite and bounded under maximum current', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const f = run(make(kind, side), 5, 1, 'changing');
    const m = f.metrics();
    assert.ok(f.position.every(Number.isFinite));
    assert.equal(m.anchorError, 0);
    assert.ok(m.maxDisplacement < 1.5, JSON.stringify(m));
    assert.ok(m.maxRayStrain < 0.15, JSON.stringify(m));
  }
});
test('water pushes each fin to the opposite side when the current reverses', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const front = run(make(kind, side), 5, 0.8, 'front');
    const back = run(make(kind, side), 5, 0.8, 'back');
    assert.ok(edgeMean(front, 2) - edgeMean(back, 2) > 0.06, `fin ${kind}/${side} ignored flow`);
  }
});
test('muscular strokes continue in still water and pause freezes the membrane', () => {
  for (const [kind, side] of [[0, 0], [1, 0], [2, 0], [3, -1], [3, 1], [4, -1], [4, 1]]) {
    const f = run(make(kind, side), 2, 0, 'front');
    const before = f.position.slice();
    for (let i = 1; i <= 24; i++) f.advance(1 / 60, state(2 + i / 60));
    assert.ok(f.position.some((v, i) => Math.abs(v - before[i]) > 0.004), `fin ${kind}/${side} not powered`);
    const frozen = f.position.slice();
    f.advance(0, state(2.4));
    assert.deepEqual(f.position, frozen);
  }
});
test('fixed physics steps keep 30/60/120fps results close', () => {
  const reference = run(make(), 4, 0.7, 'front', 120);
  for (const fps of [30, 60]) {
    const f = run(make(), 4, 0.7, 'front', fps);
    const rms = Math.sqrt(f.position.reduce((sum, p, i) => sum + (p - reference.position[i]) ** 2, 0) / f.position.length);
    assert.ok(rms < 0.035, `${fps}fps RMS drift ${rms}`);
  }
});

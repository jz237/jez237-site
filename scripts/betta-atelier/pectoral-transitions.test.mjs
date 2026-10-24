import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SwimGait } from './src/swim-gait.js';
import { BodyMotion } from './src/body-motion.js';
import { FinDynamics } from './src/fin-dynamics.js';
import { POSES, finGrid, section, SCALE, PECTORAL_ROOTS, PECTORAL_EDGE } from './src/fish.js';

// Drives the real pectoral geometry through chains of swim modes and watches the fin's beat-averaged
// side-view area, the quantity that read as the fins "changing size" at every mode change.
const DT = 1 / 60;
const bodyRadius = (x, y) => {
  const pixelX = x / SCALE + 680;
  if (pixelX < 155 || pixelX > 1010) return 0;
  const [, top, bottom, thick] = section(pixelX);
  const mid = (420 - (top + bottom) / 2) * SCALE, radius = (bottom - top) * 0.5 * SCALE;
  const q = (y - mid) / radius;
  return Math.abs(q) >= 1 ? 0 : Math.sqrt(1 - q * q) * thick * SCALE;
};
function sideArea(fin) {
  const { columns: W, rows: H, position: P, rest: R } = fin;
  let side = 0, rest = 0;
  for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
    const q = [j * W + i, j * W + i + 1, (j + 1) * W + i, (j + 1) * W + i + 1];
    for (const t of [[0, 1, 2], [1, 3, 2]]) {
      const a = q[t[0]] * 3, c = q[t[1]] * 3, d = q[t[2]] * 3;
      const ux = P[c] - P[a], uy = P[c + 1] - P[a + 1], vx = P[d] - P[a], vy = P[d + 1] - P[a + 1];
      side += Math.abs(ux * vy - uy * vx) / 2; // projected area in the x-y plane; z is across the body
      const rux = R[c] - R[a], ruy = R[c + 1] - R[a + 1], rvx = R[d] - R[a], rvy = R[d + 1] - R[a + 1];
      rest += Math.abs(rux * rvy - ruy * rvx) / 2;
    }
  }
  return { side, rest };
}
const MODES = {
  hover: [0.045, 0], surface: [0.045, 0], gulp: [0.06, 0.05], rise: [0.15, 0.1], dive: [0.12, 0.12],
  glide: [0.065, 0.2], startle: [0.22, 0.9], mirror: [0.05, 0.05], lap: [0.1, 0.1], rest: [0.03, 0],
  cruise: [0.2, 0.5], burst: [0.6, 0.9],
};
function trace(sequence) {
  const gait = new SwimGait(), body = new BodyMotion();
  const fin = new FinDynamics({ kind: 3, side: 1, point: (u, v) => { const g = finGrid(PECTORAL_ROOTS, PECTORAL_EDGE, 3, 1, u, v); return [g.x, g.y, g.z]; } });
  const series = [], edges = [];
  let n = 0;
  for (const [mode, seconds] of sequence) {
    const [drive, relative] = MODES[mode];
    for (let i = 0; i < seconds * 60; i++, n++) {
      gait.advance(DT, drive, relative, 0, POSES[mode] ?? {});
      body.advanceTurn(DT, 0, 0.1);
      body.update(gait.phase, gait.effort, 0, gait.breathPhase, 0, 0);
      const { effort, scull, tuck, pectoralEffort, pectoralScull } = gait;
      fin.advance(DT, {
        body, time: n * DT, phase: gait.phase, pectoralPhase: gait.pectoralPhase, scull, tuck, pectoralEffort, pectoralScull,
        drive: effort * 0.55, effort, turn: 0, flare: 0, heading: 0, angularVelocity: 0,
        velocity: [0, 0, 0], origin: [0, 0, 0], strength: 0, direction: 'changing', externalFlow: [0, 0, 0], bodyRadius,
      });
      const { side, rest } = sideArea(fin);
      series.push(side / rest);
    }
    edges.push(n);
  }
  return { series, edges: edges.slice(0, -1) };
}
const boxcar = (series, width) => {
  const half = width >> 1, pre = [0];
  for (const v of series) pre.push(pre[pre.length - 1] + v);
  return series.map((_, i) => { const a = Math.max(0, i - half), b = Math.min(series.length, i + half + 1); return (pre[b] - pre[a]) / (b - a); });
};
// Jump of the beat-averaged fin area across a mode change, as a fraction of the fin's rest area.
function jumps(sequence) {
  const { series, edges } = trace(sequence);
  const smooth = boxcar(series, 48);
  return { series, jumps: edges.map(e => smooth[Math.min(smooth.length - 1, e + 30)] - smooth[Math.max(0, e - 30)]) };
}

test('pectoral fins keep their size across chains of swim-mode changes', () => {
  const chains = [
    [['hover', 7], ['cruise', 6], ['startle', 0.8], ['glide', 5], ['hover', 6], ['burst', 1.2], ['glide', 5], ['cruise', 5]],
    [['cruise', 7], ['startle', 0.8], ['glide', 5], ['startle', 0.8], ['hover', 6], ['rise', 4], ['gulp', 3], ['dive', 4], ['glide', 5]],
    [['hover', 7], ['mirror', 5], ['glide', 4], ['lap', 5], ['rest', 5], ['hover', 5], ['cruise', 5]],
  ];
  for (const chain of chains) {
    const { jumps: j } = jumps(chain);
    const worst = Math.max(...j.map(Math.abs));
    assert.ok(worst < 0.06, `fin area jumps by ${worst.toFixed(3)} of rest area across ${chain.map(c => c[0]).join('>')}`);
  }
});

test('a startle folds and releases the pectorals as a smooth glide, not a pop', () => {
  const { series, edges } = trace([['cruise', 8], ['startle', 0.8], ['glide', 5]]);
  const smooth = boxcar(series, 48);
  const before = smooth[edges[0] - 1], during = Math.min(...smooth.slice(edges[0], edges[0] + 90));
  assert.ok(Math.abs(during - before) < 0.05, `startle moved the beat-averaged fin area ${before.toFixed(3)} -> ${during.toFixed(3)}`);
  // The fin must still beat visibly: a flat fin would hide the size problem rather than fix it.
  const tail = series.slice(-180), swing = Math.max(...tail) - Math.min(...tail);
  assert.ok(swing > 0.03, `the pectoral beat stays visible (${swing.toFixed(3)})`);
});

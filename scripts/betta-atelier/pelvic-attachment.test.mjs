import test from 'node:test';
import assert from 'node:assert/strict';
import { BodyMotion } from './src/body-motion.js';
import { FinDynamics } from './src/fin-dynamics.js';
import { finGrid, section, SCALE, PELVIC_ROOTS, PELVIC_EDGE } from './src/fish.js';

// Vertical distance (world units) from the belly skin to a point beside the midline:
// positive = the point is inside the flank, negative = it floats below the skin.
function belowSkin(x, y, z) {
  const [, top, bottom, thick] = section(x / SCALE + 680);
  const mid = (top + bottom) / 2, half = (bottom - top) / 2;
  const across = Math.min(1, Math.abs(z) / (thick * SCALE));
  const skin = 420 - (mid + half * Math.sqrt(1 - across * across));
  return (y / SCALE - skin) * SCALE;
}

test('pelvic feelers start inside the belly, not floating below it', () => {
  for (const side of [-1, 1]) for (let i = 0; i <= 28; i++) {
    const u = i / 28, { rx, ry, rz } = finGrid(PELVIC_ROOTS, PELVIC_EDGE, 4, side, u, 0);
    const sunk = belowSkin(rx, ry, rz);
    assert.ok(sunk > 0.005 && sunk < 0.03, `side ${side} u ${u.toFixed(2)}: root ${sunk.toFixed(4)} inside the skin`);
  }
});

test('the feelers stay anchored to the bending body under turbulence and spin', () => {
  for (const side of [-1, 1]) {
    const fin = new FinDynamics({ kind: 4, side, point: (u, v) => { const g = finGrid(PELVIC_ROOTS, PELVIC_EDGE, 4, side, u, v); return [g.x, g.y, g.z]; } });
    const body = new BodyMotion();
    let anchor = 0, strain = 0;
    for (let i = 0; i < 360; i++) {
      const t = i / 60, turn = 3 * Math.sin(t * 1.3);
      body.advanceTurn(1 / 60, turn, 0.2); body.update(t * 4, 0.5, turn, 0);
      fin.advance(1 / 60, { body, time: t, phase: t * 4, pectoralPhase: t * 5, drive: 0.2, effort: 0.5, turn, flare: 0,
        heading: t, velocity: [0.3, 0, 0], angularVelocity: 6 * Math.sin(t * 3.1), origin: [0, 0, 0], strength: 0, direction: 'front',
        externalFlow: [1.4 * Math.sin(t * 7), 1.2 * Math.cos(t * 5), 1.6 * Math.sin(t * 9)] });
      const m = fin.metrics();
      anchor = Math.max(anchor, m.anchorError);
      strain = Math.max(strain, m.maxRayStrain);
    }
    assert.ok(anchor < 1e-6, `side ${side}: insertion row drifted ${anchor}`);
    assert.ok(strain < 0.07, `side ${side}: rays stretched ${strain.toFixed(3)}, so a root segment pulled off the body`);
  }
});

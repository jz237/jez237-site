// The betta bowl's lid (src/render/bowl.ts lidReach): the sphere its passes are drawn on is scaled
// to the lid's reach (GlobeView.setBowlLid), so the reach must take in every part of the lid in any
// pose, seated or carried off tipped; and seated, it fits closely (every pixel the sphere covers
// runs the bowl's shader). The lid's distance fields are bowl.ts's WGSL, here in JS.
// Run: node --test bowl-lid.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { BOWL, bowlShape, lidReach } from './src/render/bowl.ts';
import { globeConfig } from './src/config.ts';

const shape = bowlShape(globeConfig);
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

// bowl_box2, bowl_smin, bowl_lidSdf (its vents left out: they only cut the glass away) and
// bowl_lidBlackSdf, of a point at radius r from the lid's axis and height y over its underside.
function box2(px, py, hx, hy, k) {
  const wx = Math.abs(px) - hx + k;
  const wy = Math.abs(py) - hy + k;
  return Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) - k;
}
function smin(a, b, k) {
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return b + (a - b) * h - k * h * (1 - h);
}
function lidGlass(r, y) {
  const th = 0.5 * BOWL.lidThickness;
  const d = Math.hypot(Math.max(r - (BOWL.lidRadius - th), 0), y - th) - th;
  return Math.max(d, r - (shape.rimIn + 0.003));
}
function lidBlack(r, y) {
  const rim = box2(r - 0.5 * (shape.rimIn + BOWL.lidRadius + BOWL.rimProud), y - 0.5 * BOWL.lidThickness, 0.5 * (BOWL.lidRadius + BOWL.rimProud - shape.rimIn), 0.5 * BOWL.lidThickness + BOWL.rimProud, 0.006);
  const knob = box2(r, y - (BOWL.lidThickness + 0.5 * BOWL.knobHeight - 0.002), BOWL.knobRadius, 0.5 * BOWL.knobHeight + 0.002, 0.008);
  const wx = Math.abs(r - shape.collar) - 0.5 * BOWL.collarWall + 0.0015;
  const wy = Math.abs(y + 0.5 * BOWL.collarDepth) - 0.5 * BOWL.collarDepth;
  const collar = Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) - 0.0015;
  const puck = box2(r, y + 0.5 * BOWL.puckDepth - 0.001, BOWL.puckRadius, 0.5 * BOWL.puckDepth + 0.001, 0.003);
  return Math.min(smin(rim, collar, 0.004), knob, puck);
}

// The lid's section (r, y) wherever either field is inside, on a fine grid.
const inside = [];
for (let r = 0; r <= 0.6; r += 0.0005) {
  for (let y = -0.06; y <= 0.1; y += 0.0005) {
    if (lidGlass(r, y) < 0 || lidBlack(r, y) < 0) inside.push([r, y]);
  }
}

// The furthest any of the lid lies from a point that is off from its axis and at height cy (its
// own frame): each (r, y) of its section is a ring round the axis, furthest on the far side.
const furthest = (off, cy) => Math.max(...inside.map(([r, y]) => Math.hypot(off + r, y - cy)));

test('the lid is there to be measured', () => {
  assert.ok(inside.length > 5000, `${inside.length} points inside`);
});

test('its reach takes in all of it, seen from anywhere', () => {
  for (let off = 0; off <= 4; off += 0.25) {
    for (let cy = -4; cy <= 4; cy += 0.25) {
      const c = { x: off * 0.6, y: cy, z: off * 0.8 };
      const reach = lidReach(shape, c);
      const far = furthest(off, cy);
      assert.ok(far <= reach + 1e-9, `from (${off}, ${cy}): ${far} beyond the reach ${reach}`);
    }
  }
});

test('seated, its reach fits it closely (and the loose bound it replaced did not)', () => {
  const seated = { x: 0, y: -shape.seat, z: 0 };
  const reach = lidReach(shape, seated);
  const far = furthest(0, -shape.seat);
  assert.ok(reach - far < 0.005, `reach ${reach}, the lid's furthest ${far}`);
  // (The globe's centre to the lid's middle, plus the lid's own reach from there.)
  const loose = shape.seat + Math.hypot(BOWL.lidRadius + BOWL.rimProud, Math.max(shape.top, BOWL.collarDepth));
  assert.ok(reach < 0.8 * loose, `reach ${reach} against ${loose}`);
});

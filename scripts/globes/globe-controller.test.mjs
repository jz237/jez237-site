// The globe turned about its own axis by two fingers (and by a right-button drag): which way, how
// far, and that a turn is a hold the rest of the app sees (src/interaction/GlobeController.ts).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three/webgpu';
// (The renderer's TypeScript loads through the hooks tools/shader-budget.mjs registers: it has
// parameter properties, which stripping its types alone would not run.)
await import('./tools/shader-budget.mjs');
const { GlobeController } = await import('./src/interaction/GlobeController.ts');

const CFG = { outerRadius: 1, innerRadius: 0.99, pivotDepth: 1, maxTilt: 0.7 };

/** A canvas that keeps its listeners, 400x800 CSS px at the page's corner. */
function fakeCanvas() {
  const on = {};
  return {
    on,
    style: {},
    addEventListener: (type, fn) => { on[type] = fn; },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 800 }),
    setPointerCapture() {},
    releasePointerCapture() {},
    hasPointerCapture: () => false,
  };
}

function setup() {
  const canvas = fakeCanvas();
  const camera = new THREE.PerspectiveCamera(30, 0.5, 0.05, 100);
  const c = new GlobeController(canvas, camera, CFG);
  c.rolling = true;
  c.zoomEnabled = false;
  c.update(1 / 60, 24);
  const centre = c.screenCircle();
  const ev = (type, id, x, y, extra = {}) => canvas.on[type]({ pointerId: id, pointerType: 'touch', clientX: x, clientY: y, button: 0, ctrlKey: false, preventDefault() {}, ...extra });
  const run = (seconds) => { for (let t = 0; t < seconds; t += 1 / 60) c.update(1 / 60, 24); };
  return { c, centre, ev, run };
}

test('two fingers sliding right spin the globe so its front goes right', () => {
  const { c, centre, ev, run } = setup();
  const { x, y, r } = centre;
  ev('pointerdown', 1, x - 40, y);
  ev('pointerdown', 2, x + 40, y);
  assert.equal(c.holding, true);
  assert.equal(c.turning, true);
  for (let k = 1; k <= 10; k++) {
    ev('pointermove', 1, x - 40 + k * r * 0.05, y);
    ev('pointermove', 2, x + 40 + k * r * 0.05, y);
    run(1 / 60);
  }
  run(0.3);
  // (Half the globe's radius across turns it half a radian.)
  assert.ok(Math.abs(c.twist - 0.5) < 0.05, `twist ${c.twist}`);
  assert.ok(Math.abs(c.theta) < 1e-9 && Math.abs(c.lean) < 1e-9, 'no tip, no lean');
  ev('pointerup', 2, x + 40, y);
  assert.equal(c.holding, false);
});

test('a clockwise twist of two fingers turns the front to the left', () => {
  const { c, centre, ev, run } = setup();
  const { x, y } = centre;
  const at = (a) => [[x - 50 * Math.cos(a), y - 50 * Math.sin(a)], [x + 50 * Math.cos(a), y + 50 * Math.sin(a)]];
  let [p, q] = at(0);
  ev('pointerdown', 1, ...p);
  ev('pointerdown', 2, ...q);
  for (let k = 1; k <= 8; k++) {
    [p, q] = at((k * 0.6) / 8);
    ev('pointermove', 1, ...p);
    ev('pointermove', 2, ...q);
    run(1 / 60);
  }
  run(0.3);
  assert.ok(Math.abs(c.twist + 0.6) < 0.05, `twist ${c.twist}`);
});

test('let go, it runs on and slows; it is not settled until it has nearly stopped', () => {
  const { c, centre, ev, run } = setup();
  const { x, y, r } = centre;
  ev('pointerdown', 1, x - 40, y);
  ev('pointerdown', 2, x + 40, y);
  ev('pointermove', 1, x - 40 + r, y);
  ev('pointermove', 2, x + 40 + r, y);
  run(0.05);
  ev('pointerup', 1, x - 40 + r, y);
  ev('pointerup', 2, x + 40 + r, y);
  assert.equal(c.settled, false);
  const at = c.twist;
  run(0.5);
  assert.ok(c.twist > at, 'runs on');
  run(10);
  assert.equal(c.settled, true);
});

test('two fingers do not turn a locked globe (the lid off to feed)', () => {
  const { c, centre, ev, run } = setup();
  const { x, y, r } = centre;
  c.locked = true;
  ev('pointerdown', 1, x - 40, y);
  ev('pointerdown', 2, x + 40, y);
  ev('pointermove', 1, x - 40 + r, y);
  ev('pointermove', 2, x + 40 + r, y);
  run(0.5);
  assert.equal(c.twist, 0);
  assert.equal(c.holding, false);
});

test('a right-button drag across turns it as a Ctrl-drag does', () => {
  const { c, centre, ev, run } = setup();
  const { x, y, r } = centre;
  const mouse = { pointerType: 'mouse', button: 2 };
  ev('pointerdown', 7, x, y, mouse);
  assert.equal(c.turning, true);
  ev('pointermove', 7, x + r * 0.5, y, mouse);
  run(0.4);
  assert.ok(Math.abs(c.twist - 0.5) < 0.05, `twist ${c.twist}`);
  assert.ok(Math.abs(c.theta) < 1e-9, 'no tip');
  ev('pointerup', 7, x + r * 0.5, y, mouse);
  assert.equal(c.holding, false);
});

test('let go after a roll, it comes to rest exactly (not creeping on through ever smaller angles)', () => {
  const { c, centre, ev, run } = setup();
  const { x, y, r } = centre;
  const mouse = { pointerType: 'mouse', button: 0 };
  ev('pointerdown', 3, x, y + r * 0.3, mouse);
  ev('pointermove', 3, x + r * 0.6, y + r * 0.3, mouse);
  run(0.5);
  ev('pointerup', 3, x + r * 0.6, y + r * 0.3, mouse);
  assert.ok(Math.abs(c.theta) > 0.05, 'rolled');
  run(20);
  assert.equal(c.theta, 0);
  assert.equal(c.lean, 0);
  const before = [...c.rotation.elements];
  run(1);
  assert.deepEqual([...c.rotation.elements], before, 'the same to the bit from frame to frame');
});

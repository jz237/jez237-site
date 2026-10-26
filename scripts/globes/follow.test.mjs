// The betta bowl's follow camera (src/app/follow.mjs): its eye where the fish is seen in the middle of
// the picture through the glass and the water, clear of the glass, and gliding there.
import test from 'node:test';
import assert from 'node:assert/strict';
import { eyeFor, FISH_LENGTH, FOLLOW, FollowCamera, followDistance, intoWater } from './src/app/follow.mjs';

const bowl = { outer: 1, inner: 0.975, level: 0.181 };
const el = (9 * Math.PI) / 180;
const view = [0, -Math.sin(el), -Math.cos(el)];
const add = (a, b, k = 1) => a.map((v, i) => v + b[i] * k);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** How far the bent line of sight from eye along view passes from point. */
const miss = (eye, point) => {
  const ray = intoWater(eye, view, bowl);
  const r = add(point, ray.p, -1);
  return Math.hypot(...add(r, ray.dir, -dot(r, ray.dir)));
};

test('a line of sight through the bowl\'s middle goes straight on; one off it is bent', () => {
  const straight = intoWater([0, 0, 3], [0, 0, -1], bowl);
  assert.ok(Math.hypot(straight.dir[0], straight.dir[1], straight.dir[2] + 1) < 1e-9 && Math.hypot(straight.p[0], straight.p[1]) < 1e-9);
  const off = intoWater([0.5, -0.2, 3], [0, 0, -1], bowl);
  assert.ok(off.dir[0] < -0.05, `bent towards the middle: ${off.dir[0].toFixed(3)}`);
  // (Over the water, down through its surface.)
  assert.ok(intoWater([0, 0.5, 3], [0, -0.12, -1].map((v) => v / Math.hypot(0, 0.12, 1)), bowl) !== null);
});

test('the eye stands where the fish is seen in the middle of the picture, all over the bowl, clear of the glass', () => {
  const d = 2.2;
  for (const point of [[0, -0.2, 0], [0.55, -0.3, 0.2], [-0.6, -0.1, -0.3], [0.3, 0.12, 0.5], [-0.2, -0.45, 0.6], [0.8, -0.2, 0.3], [0.4, -0.2, -0.6]]) {
    const eye = eyeFor(point, view, d, bowl);
    assert.ok(miss(eye, point) < 1e-4, `${point}: missed by ${miss(eye, point).toFixed(5)}`);
    assert.ok(Math.hypot(...eye) >= bowl.outer + FOLLOW.clearance - 1e-9, `${point}: in the glass`);
    // (Straight in front of it instead, the fish towards the edge would be well off the middle.)
    if (Math.abs(point[0]) > 0.5) assert.ok(miss(add(point, view, -d), point) > 0.03, `${point}: the glass bends it little`);
  }
  // Far out at the back, where no line of sight from in front reaches (they bend in towards the
  // middle), the nearest one: nearer than straight ahead, and clear of the glass.
  const corner = [0.8, -0.2, -0.3];
  const best = eyeFor(corner, view, d, bowl);
  assert.ok(miss(best, corner) < 0.1 && Math.hypot(...best) >= bowl.outer + FOLLOW.clearance - 1e-9, `the corner: ${miss(best, corner).toFixed(3)}`);
  // Drawn in too near, it stands back along its own line of sight: the fish still in the middle.
  const near = eyeFor([0, -0.2, 0.7], view, 0.4, bowl);
  assert.ok(Math.hypot(...near) >= bowl.outer + FOLLOW.clearance - 1e-9 && miss(near, [0, -0.2, 0.7]) < 1e-4);
});

test('the fish fills its share of the picture\'s shorter side; nearer as the viewer zooms in', () => {
  const fov = (40 * Math.PI) / 180;
  for (const aspect of [0.55, 1, 1.78]) {
    const d = followDistance(fov, aspect);
    const short = aspect < 1 ? 2 * Math.atan(Math.tan(fov / 2) * aspect) : fov;
    assert.ok(Math.abs(FISH_LENGTH / (2 * d * Math.tan(short / 2)) - FOLLOW.fill) < 1e-9);
  }
  assert.ok(followDistance(fov, 1, 0.5) < followDistance(fov, 1));
});

test('the eye glides there without overshooting, and gives the picture back over a second once let go', () => {
  const cam = new FollowCamera();
  cam.set(true, [0, 0.5, 6]);
  assert.equal(cam.share, 1);
  const want = [0.4, -0.2, 2.5];
  let last = Infinity;
  for (let i = 0; i < 240; i++) {
    cam.step(1 / 60, want);
    const left = Math.hypot(...add(want, cam.eye, -1));
    assert.ok(left <= last + 1e-12, 'never further than the frame before');
    last = left;
  }
  assert.ok(last < 0.01, `still ${last.toFixed(3)} off after 4 s`);
  cam.set(false);
  let frames = 0;
  while (cam.weight > 0) {
    cam.step(1 / 60, want);
    frames++;
  }
  assert.ok(Math.abs(frames / 60 - FOLLOW.release) < 0.05, `gave it back in ${(frames / 60).toFixed(2)} s`);
  // Pressed again on the way back, it carries on from where its eye is, wholly its own again.
  const again = new FollowCamera();
  again.set(true, [0, 0.5, 6]);
  for (let i = 0; i < 60; i++) again.step(1 / 60, want);
  again.set(false);
  for (let i = 0; i < 20; i++) again.step(1 / 60, want);
  const was = [...again.eye];
  again.set(true, [9, 9, 9]);
  assert.deepEqual(again.eye, was);
  assert.equal(again.share, 1);
});

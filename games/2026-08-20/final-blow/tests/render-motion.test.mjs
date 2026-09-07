import test from "node:test";
import assert from "node:assert/strict";
import { captureMotion, interpolateMotion, fixedDemoFrame } from "../engine/render-motion.mjs";

test("slow-motion renders travel every display frame without mutating sim state", () => {
  for (const rate of [0.1, 0.25, 0.5, 0.75, 1]) {
    let current = { x: 0, y: 600, walkTime: 0, animTime: 0, attackTime: 0 };
    let previous = captureMotion(current), accumulator = 0;
    const positions = [];
    for (let display = 0; display < 120; display++) {
      accumulator += rate;
      while (accumulator >= 1 - 1e-9) {
        previous = captureMotion(current);
        current = Object.freeze({ ...current, x: current.x + 4, walkTime: current.walkTime + 1 / 60 });
        accumulator -= 1;
      }
      const sample = interpolateMotion(current, previous, accumulator);
      positions.push(sample.x);
      assert.equal(current.x % 4, 0);
    }
    for (let i = 15; i < positions.length; i++) {
      assert.ok(Math.abs(positions[i] - positions[i - 1] - 4 * rate) < 1e-7, `rate ${rate}, frame ${i}`);
    }
  }
});

test("teleports and cinematic poses snap; new attacks do not inherit old timers", () => {
  const old = { x: 100, y: 600, attackTime: 0.8, attacking: { id: "heavy" } };
  const fresh = { x: 104, y: 590, attackTime: 0, attacking: { id: "light" } };
  assert.equal(interpolateMotion(fresh, captureMotion(old), 0.5).attackTime, 0);
  const teleport = { ...fresh, x: 900 };
  assert.equal(interpolateMotion(teleport, captureMotion(old), 0.5), teleport);
  const cinema = { ...fresh, cinematicFrame: 0 };
  assert.equal(interpolateMotion(cinema, captureMotion(old), 0.5), cinema);
});

test("demo view is a fixed wide shot, with space at both arena edges", () => {
  const first = fixedDemoFrame();
  for (let frame = 0; frame < 240; frame++) assert.deepEqual(fixedDemoFrame(), first);
  assert.equal(600 * first.scale + first.y, 560);
  assert.ok((76 - 220) * first.scale + first.x > 0);
  assert.ok((1204 + 220) * first.scale + first.x < 1280);
  assert.ok(200 * first.scale + first.y > 100);
});

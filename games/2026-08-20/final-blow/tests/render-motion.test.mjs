import test from "node:test";
import assert from "node:assert/strict";
import { captureMotion, interpolateMotion, fitFrame } from "../engine/render-motion.mjs";

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

test("camera keeps corner, jump and wide rotated bounds clear of HUD and canvas edges", () => {
  const safe = { left: 24, right: 1256, top: 105, bottom: 615 };
  for (const bounds of [
    { left: -250, right: 1540, top: 130, bottom: 630 },
    { left: 100, right: 1200, top: -380, bottom: 680 },
    { left: -50, right: 700, top: 180, bottom: 950 },
    { left: 300, right: 900, top: 220, bottom: 590 },
  ]) {
    const fit = fitFrame(bounds, safe);
    assert.ok(bounds.left * fit.scale + fit.x >= safe.left - 1e-7);
    assert.ok(bounds.right * fit.scale + fit.x <= safe.right + 1e-7);
    assert.ok(bounds.top * fit.scale + fit.y >= safe.top - 1e-7);
    assert.ok(bounds.bottom * fit.scale + fit.y <= safe.bottom + 1e-7);
  }
});

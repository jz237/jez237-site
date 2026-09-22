import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics, RADIUS, STEP } from "../src/physics.mjs";
import { proofCourse, part, point } from "../src/course.mjs";
await initPhysics();

function fixture() {
  return new Simulation(
    {
      ...proofCourse(),
      parts: [part("flat", 0, 20, 40, 100)],
      starts: [point(0, RADIUS, 0)],
      goal: point(0, 0, 65),
      zones: [],
      enemies: [],
    },
    { untimed: true },
  );
}

test("full turbo clears the conservative observed opening displacement without visible sliding", () => {
  const sim = fixture(),
    body = sim.body(sim.players[0]);
  for (let i = 0; i < 120; i++) sim.step();
  const start = body.translation().z;
  let rolled = 0;
  for (let i = 0; i < 144; i++) {
    const spin = body.angvel().x;
    sim.step([{ x: 0, z: 1, turbo: true }]);
    rolled += (spin + body.angvel().x) * 0.5 * STEP * RADIUS;
  }
  const distance = body.translation().z - start;
  // Original screen-space translation / largest observed sprite width.
  // Screen projection shortens ground movement: this is only a lower bound.
  const observed = Math.hypot(234.5 - 174, 98 - 165.5) / 26;
  assert.ok(distance / (2 * RADIUS) >= observed);
  assert.ok(Math.abs(distance - rolled) / distance < 0.02);
  assert.ok(Math.abs(body.translation().y - RADIUS) < RADIUS * 0.01);
  sim.dispose();
});

test("gentle turbo steering retains the published response and stronger input replays exactly", () => {
  const sim = fixture(),
    body = sim.body(sim.players[0]);
  for (let i = 0; i < 120; i++) sim.step();
  for (let i = 0; i < 144; i++) sim.step([{ x: 0, z: 0.5, turbo: true }]);
  assert.ok(
    Math.abs(body.translation().z / (2 * RADIUS) - 1.8597810918634587) < 1e-6,
  );
  const snapshot = sim.snapshot();
  const input = (i) => ({ x: i < 80 ? 0.6 : -0.6, z: 0.8, turbo: true });
  for (let i = 0; i < 160; i++) sim.step([input(i)]);
  const expected = structuredClone(sim.players);
  sim.restore(snapshot);
  for (let i = 0; i < 160; i++) sim.step([input(i)]);
  assert.deepEqual(sim.players, expected);
  sim.dispose();
});

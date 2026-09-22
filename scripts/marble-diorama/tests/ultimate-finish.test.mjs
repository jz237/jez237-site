import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
import { ultimateCourse } from "../src/ultimate.mjs";
import { worldPoint } from "../src/course-authoring.mjs";
await initPhysics();

test("Ultimate's entry removes successive full spans in the sampled six-second cycle, including after restore", () => {
  const sim = new Simulation(ultimateCourse(), { untimed: true });
  const spans = sim.movers.filter((m) => m.part.id.startsWith("finish-entry-"));
  assert.equal(spans.length, 3);
  const corners = sim.movers.filter((m) => m.part.id.includes("-corner-"));
  assert.equal(
    corners.length,
    4,
    "dark turns must not become permanent waiting pads",
  );
  const nativeSupport = (m) =>
    sim.world.castRay(
      new RAPIER.Ray(
        { x: m.part.x, y: m.part.y + 1, z: m.part.z },
        { x: 0, y: -1, z: 0 },
      ),
      2,
      true,
    );
  const states = [
    [true, false, true],
    [true, true, false],
    [true, true, true],
    [false, true, true],
    [true, false, true],
  ];
  let snapshot;
  for (const [i, time] of [0.75, 2.25, 3.75, 5.25, 6.75].entries()) {
    while (sim.tick < Math.round(time * 120)) sim.step();
    spans.forEach((m, j) => {
      assert.equal(sim.world.getRigidBody(m.handle).isEnabled(), states[i][j]);
      assert.equal(Boolean(nativeSupport(m)), states[i][j]);
    });
    if (i === 0 || i === 2)
      for (const j of i === 0 ? [0, 2] : [1, 3]) {
        assert.equal(
          sim.world.getRigidBody(corners[j].handle).isEnabled(),
          false,
        );
        assert.equal(nativeSupport(corners[j]), null);
      }
    if (i === 1) snapshot = sim.snapshot();
  }
  const expected = structuredClone(sim.players);
  sim.restore(snapshot);
  while (sim.tick < 810) sim.step();
  assert.deepEqual(sim.players, expected);
  sim.dispose();
});

test("the final return has a continuous physical uphill ramp, low-friction ice and a separate gold crossing", () => {
  const c = ultimateCourse();
  const sim = new Simulation(c, { untimed: true });
  sim.step();
  const height = (d) => {
    const hit = sim.world.castRay(
      new RAPIER.Ray(worldPoint(19.2, 10, d), { x: 0, y: -1, z: 0 }),
      8,
      true,
    );
    assert.ok(hit);
    return 10 - hit.timeOfImpact;
  };
  // Source ribbon vertices define both the visible climb and this collision.
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    assert.ok(Math.abs(height(134.6 - 4.8 * u) - (4 + 2 * u)) < RADIUS * 0.01);
  }
  assert.ok(Math.abs(height(127) - 6) < RADIUS * 0.01);
  assert.equal(
    c.parts.find((p) => p.id === "finish-return-ice").material,
    "ice",
  );
  const gold = sim.movers.filter((m) => m.part.id.startsWith("finish-gold-"));
  assert.equal(gold.length, 3);
  // The decorative goal plate must not fill a disappearing return segment.
  while (sim.tick < 630) sim.step();
  const m = gold[0];
  assert.equal(sim.world.getRigidBody(m.handle).isEnabled(), false);
  assert.equal(
    sim.world.castRay(
      new RAPIER.Ray({ x: m.part.x, y: 7, z: m.part.z }, { x: 0, y: -1, z: 0 }),
      2,
      true,
    ),
    null,
  );
  sim.dispose();
});

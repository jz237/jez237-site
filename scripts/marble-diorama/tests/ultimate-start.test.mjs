import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import {
  Simulation,
  DemoController,
  initPhysics,
  RADIUS,
} from "../src/physics.mjs";
import { ultimateCourse } from "../src/ultimate.mjs";
import { worldPoint } from "../src/course-authoring.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
await initPhysics();
const lateral = (p) => (p.x - p.z) * Math.SQRT1_2;
const depth = (p) => (p.x + p.z) * Math.SQRT1_2;
const startParts = () =>
  ultimateCourse().parts.filter((p) => p.id.startsWith("start-"));

test("Ultimate's white approach climbs continuously onto its ledge in the shared render/collision mesh", () => {
  const c = blankCourse();
  c.parts = startParts();
  c.starts = [worldPoint(-8, 16.56, 0)];
  assert.ok(c.parts.every((p) => p.kind !== "pyramid"));
  const sim = new Simulation(c, { untimed: true });
  sim.step();
  const top = (l, d) => {
    const hit = sim.world.castRay(
      new RAPIER.Ray(worldPoint(l, 25, d), { x: 0, y: -1, z: 0 }),
      20,
      true,
    );
    assert.ok(hit, `missing surface at ${l},${d}`);
    return 25 - hit.timeOfImpact;
  };
  for (const d of [6, 7, 8])
    for (let i = 0; i <= 24; i++) {
      const u = i / 24,
        l = -4 + 6 * u,
        expected = 16 + 1.5 * u * u * (3 - 2 * u);
      assert.ok(
        Math.abs(top(l, d) - expected) < RADIUS * 0.01,
        `curve height at ${l},${d}`,
      );
    }
  for (const join of [-4, 2])
    for (const d of [6, 7, 8])
      assert.ok(
        Math.abs(top(join - 0.01, d) - top(join + 0.01, d)) < RADIUS * 0.01,
        "no step at the foot or crest",
      );
  assert.ok(Math.abs(top(5, 12) - 17.5) < 1e-5);
  for (const compiled of sim.compiled.statics) {
    const mesh = surfaceGeometry(compiled);
    const original = new Set();
    for (let i = 0; i < compiled.vertices.length; i += 3)
      original.add(Array.from(compiled.vertices.slice(i, i + 3)).join(","));
    const visible = mesh.getAttribute("position");
    for (let i = 0; i < visible.count; i++)
      assert.ok(
        original.has(
          [visible.getX(i), visible.getY(i), visible.getZ(i)].join(","),
        ),
      );
    mesh.dispose();
  }
  sim.dispose();
});

test("ordinary held turbo climbs the curved ramp and crosses its crest without snagging, including after restore", () => {
  const c = blankCourse();
  c.parts = startParts();
  c.starts = [worldPoint(-5, 16.56, 7)];
  c.goal = worldPoint(30, 17.5, 7);
  const sim = new Simulation(c, { untimed: true });
  const input = [{ x: Math.SQRT1_2, z: -Math.SQRT1_2, turbo: true }];
  while (sim.tick < 1200 && lateral(sim.players[0].current.position) < -1)
    sim.step(input);
  assert.ok(lateral(sim.players[0].current.position) >= -1);
  const saved = sim.snapshot();
  const cross = () => {
    const positions = [];
    for (
      let i = 0;
      i < 600 && lateral(sim.players[0].current.position) < 3;
      i++
    ) {
      sim.step(input);
      positions.push({ ...sim.players[0].current.position });
      assert.equal(sim.players[0].deaths, 0);
    }
    assert.ok(lateral(sim.players[0].current.position) >= 3);
    assert.ok(sim.players[0].current.position.y >= 17.5 + RADIUS - 0.01);
    return { positions, player: structuredClone(sim.players[0]) };
  };
  const first = cross();
  sim.restore(saved);
  assert.deepEqual(cross(), first);
  sim.dispose();
});

test("the original-style approach climbs the white ledge, drops dizzy onto the launcher and reaches either awarded landing", () => {
  for (const right of [false, true]) {
    const c = ultimateCourse();
    if (right) c.route = c.alternateRoutes[0].route;
    const sim = new Simulation(c, { untimed: true }),
      driver = new DemoController();
    let ramp = false,
      ledge = false;
    const events = [];
    while (sim.tick < 2400 && !events.some((e) => e.launcher)) {
      const input = driver.input(sim);
      assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
      events.push(
        ...sim
          .step([input])
          .filter((e) => ["stun", "spring", "landing-bonus"].includes(e.type)),
      );
      const p = sim.players[0].current.position,
        l = lateral(p),
        d = depth(p);
      ramp ||= l > -2 && l < 1 && d > 5 && d < 9 && p.y > 16.7 && p.y < 18.05;
      ledge ||= l > 2 && d > 9 && d < 12.5 && p.y > 18.03 && p.y < 18.08;
    }
    assert.ok(ramp && ledge);
    assert.deepEqual(
      events.map((e) => e.type),
      ["stun", "spring", "landing-bonus"],
    );
    assert.equal(events[2].score, 2000);
    assert.equal(events[2].launcher, `catapult-${right ? "right" : "left"}`);
    assert.equal(sim.players[0].deaths, 0);
    sim.dispose();
  }
});

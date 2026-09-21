import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
import { sillyCourse } from "../src/silly.mjs";
import { worldPoint } from "../src/course-authoring.mjs";
import { transferForce } from "../src/powered-transfer.mjs";
import { traversalPaths } from "../src/traversal-bonuses.mjs";
import { tubeRadiusAt, tubeGeometry } from "../src/surface-geometry.mjs";
import { validateCourse } from "../src/course.mjs";
await initPhysics();
test("the flared upward passage raises a physical marble with no steering and replays mid-transfer", () => {
  const c = sillyCourse();
  c.starts = [worldPoint(0, 4.58, 82)];
  const sim = new Simulation(c, { untimed: true });
  let bonus = 0,
    snap;
  let previous = { ...sim.body(sim.players[0]).translation() };
  for (let i = 0; i < 1000 && !bonus; i++) {
    const events = sim.step();
    const pos = sim.body(sim.players[0]).translation();
    assert.ok(
      Math.hypot(pos.x - previous.x, pos.y - previous.y, pos.z - previous.z) <
        0.15,
      "continuous movement, no transfer teleport",
    );
    previous = { ...pos };
    if (!snap && pos.y > 9) snap = sim.snapshot();
    bonus += events.filter((e) => e.type === "traversal-bonus").length;
  }
  assert.ok(snap);
  assert.equal(bonus, 1);
  assert.equal(sim.players[0].deaths, 0);
  assert.ok(sim.players[0].current.position.y > 12);
  const finishTick = sim.tick,
    expected = structuredClone(sim.players),
    events = structuredClone(sim.events);
  sim.restore(snap);
  while (sim.tick < finishTick) sim.step();
  assert.deepEqual(sim.players, expected);
  assert.deepEqual(sim.events, events);
  sim.dispose();
});
test("airflow is bounded to the actual bore, with narrowing throat and a slower exit", () => {
  const c = sillyCourse(),
    paths = traversalPaths(c),
    p = paths.find((p) => p.flowSpeed);
  const zero = { x: 0, y: 0, z: 0 };
  for (const [i, pos] of p.points.entries()) {
    const f = transferForce(paths, pos, zero, RADIUS);
    assert.ok(f);
    assert.ok(Math.hypot(...Object.values(f.acceleration)) <= 25.000001);
    const outside = { x: pos.x + 4, y: pos.y, z: pos.z + 4 };
    assert.equal(transferForce(paths, outside, zero, RADIUS), null);
  }
  assert.equal(tubeRadiusAt(p, 0, p.length), 1.8);
  assert.equal(tubeRadiusAt(p, p.length / 2, p.length), 0.9);
  const geometry = tubeGeometry(c.parts.find((p) => p.flowSpeed));
  assert.ok([...geometry.vertices].every(Number.isFinite));
  const imported = JSON.parse(JSON.stringify(c));
  validateCourse(imported);
  imported.parts.find((p) => p.flowSpeed).flare.throat = 0.2;
  assert.throws(() => validateCourse(imported), /tube flare/);
});

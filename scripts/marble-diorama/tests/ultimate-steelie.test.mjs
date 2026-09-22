import test from "node:test";
import assert from "node:assert/strict";
import {
  Simulation,
  DemoController,
  initPhysics,
  RADIUS,
} from "../src/physics.mjs";
import { ultimateCourse } from "../src/ultimate.mjs";
import { worldPoint } from "../src/course-authoring.mjs";
await initPhysics();

test("both complete Ultimate routes pass the active ice-exit steelie with bounded controls and no falls", () => {
  for (const right of [false, true]) {
    const c = ultimateCourse();
    if (right) c.route = c.alternateRoutes[0].route;
    const sim = new Simulation(c, { untimed: true });
    const driver = new DemoController();
    const enemy = sim.enemies.find((e) => e.def.id === "ice-exit-steelie");
    assert.ok(enemy);
    let exitVisited = false,
      rightAcidRoom = false,
      outerIce = false,
      rightFinish = false;
    while (sim.tick < 120 * 120 && sim.players[0].status !== "finished") {
      const before = { ...sim.body(sim.players[0]).translation() };
      const input = driver.input(sim);
      assert.deepEqual({ ...sim.body(sim.players[0]).translation() }, before);
      assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
      sim.step([input]);
      const p = sim.players[0].current.position;
      const l = (p.x - p.z) * Math.SQRT1_2,
        d = (p.x + p.z) * Math.SQRT1_2;
      rightAcidRoom ||= l > 11 && d > 79 && d < 87 && p.y > 8;
      outerIce ||= l > 8 && d > 103 && d < 110 && p.y > 4;
      rightFinish ||= l > 12 && d > 127 && d < 135 && p.y > 1;
      if (d > 114 && d < 118 && p.y > 4) {
        exitVisited = true;
        assert.ok(
          sim.world.getRigidBody(enemy.handle).isEnabled() || enemy.defeated,
        );
      }
    }
    assert.equal(sim.players[0].status, "finished");
    assert.equal(sim.players[0].deaths, 0);
    assert.ok(exitVisited);
    if (right) assert.ok(rightAcidRoom && outerIce && rightFinish);
    else
      assert.equal(
        enemy.lastContactPlayer,
        0,
        "the default route encounters the physical guard",
      );
    sim.dispose();
  }
});

test("an edge collision on Ultimate's real exit platform knocks out the steelie for 1000 exactly once", () => {
  const c = ultimateCourse();
  c.starts = [worldPoint(0, 4.56, 116)];
  const sim = new Simulation(c, { untimed: true });
  const e = sim.enemies.find((e) => e.def.id === "ice-exit-steelie");
  // An approaching marble and an enemy near the edge are initial conditions.
  // Native contact and gravity perform the knockout; no defeat flag is injected.
  sim.world
    .getRigidBody(e.handle)
    .setTranslation(worldPoint(2.8, 4.56, 116), true);
  const speed = 8 * Math.SQRT1_2;
  sim.body(sim.players[0]).setLinvel({ x: speed, y: 0, z: -speed }, true);
  sim
    .body(sim.players[0])
    .setAngvel({ x: -speed / RADIUS, y: 0, z: -speed / RADIUS }, true);
  const awards = [];
  for (let i = 0; i < 1200; i++)
    awards.push(
      ...sim
        .step([{ x: Math.SQRT1_2, z: -Math.SQRT1_2, turbo: true }])
        .filter((event) => event.type === "steelie-defeat"),
    );
  assert.deepEqual(awards, [
    {
      type: "steelie-defeat",
      enemy: "ice-exit-steelie",
      player: 0,
      score: 1000,
    },
  ]);
  assert.equal(e.lastContactPlayer, 0);
  assert.equal(e.defeated, true);
  assert.equal(sim.world.getRigidBody(e.handle).isEnabled(), false);
  sim.dispose();
});

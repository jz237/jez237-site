import test from "node:test";
import assert from "node:assert/strict";
import {
  initPhysics,
  Simulation,
  DemoController,
  RADIUS,
} from "../src/physics.mjs";
import { ultimateCourse, worldPoint } from "../src/campaign.mjs";
import { validateCourse } from "../src/course.mjs";
import { updateLaunchBonus } from "../src/launch-bonus.mjs";
import {
  moveWorkshopObject,
  rotateWorkshopObject,
  removeWorkshopObject,
} from "../src/workshop.mjs";
await initPhysics();

function reachLaunch(sim) {
  const driver = new DemoController();
  let events = [];
  while (sim.tick < 1800 && !events.some((e) => e.type === "spring")) {
    events = sim.step([driver.input(sim)]);
    assert.ok(
      events.every((e) => !e.launcher),
      "no landing award at takeoff",
    );
  }
  assert.ok(events.some((e) => e.type === "spring"));
}
function finishFlight(sim) {
  const awards = [];
  for (let i = 0; i < 240; i++)
    awards.push(...sim.step().filter((e) => e.launcher));
  return { awards, player: structuredClone(sim.players[0]) };
}

test("both Ultimate catapults award 2000 on their actual landing, once, and restore midflight", () => {
  for (const right of [false, true]) {
    const c = ultimateCourse();
    if (right) c.route = c.alternateRoutes[0].route;
    const sim = new Simulation(c, { untimed: true });
    reachLaunch(sim);
    for (let i = 0; i < 60; i++) sim.step();
    assert.equal(sim.players[0].launchBonusPending.airborne, true);
    const saved = sim.snapshot();
    const first = finishFlight(sim);
    assert.deepEqual(first.awards, [
      {
        type: "landing-bonus",
        target: `${right ? "right" : "left"}-landing-island`,
        launcher: `catapult-${right ? "right" : "left"}`,
        score: 2000,
        player: 0,
      },
    ]);
    assert.deepEqual(first.player.launchClaims, [
      `catapult-${right ? "right" : "left"}`,
    ]);
    assert.equal(first.player.launchBonusPending, null);
    sim.restore(saved);
    assert.deepEqual(finishFlight(sim), first);
    sim.dispose();
  }
});

test("unassisted drops and failed catapult flights cannot claim the destination award", () => {
  const c = ultimateCourse();
  c.starts = [worldPoint(-3, 15, 32)];
  const drop = new Simulation(c, { untimed: true });
  assert.deepEqual(finishFlight(drop).awards, []);
  drop.dispose();
  const sim = new Simulation(ultimateCourse(), { untimed: true });
  reachLaunch(sim);
  sim.fall(sim.players[0]);
  assert.equal(sim.players[0].launchBonusPending, null);
  sim.respawn(sim.players[0]);
  sim.body(sim.players[0]).setTranslation(worldPoint(-3, 12, 32), true);
  assert.deepEqual(finishFlight(sim).awards, []);
  sim.dispose();
});

test("each player receives their own launcher landing reward through ordinary steering", () => {
  const sim = new Simulation(ultimateCourse(), { players: 2, untimed: true });
  const drivers = sim.players.map(() => new DemoController());
  const awards = [];
  while (sim.tick < 1800 && awards.length < 2)
    awards.push(
      ...sim
        .step(drivers.map((d, i) => d.input(sim, i)))
        .filter((e) => e.launcher),
    );
  assert.equal(awards.length, 2);
  assert.deepEqual(awards.map((e) => e.player).sort(), [0, 1]);
  assert.ok(awards.every((e) => e.score === 2000));
  sim.dispose();
});

test("landing bounds follow the edited destination; overhead, wrong-island and repeated contacts do not pay", () => {
  const c = ultimateCourse();
  moveWorkshopObject(c, "part:left-landing-island", { x: 7, y: 2, z: -3 });
  rotateWorkshopObject(c, "part:left-landing-island", Math.PI / 3);
  validateCourse(c);
  const target = c.parts.find((p) => p.id === "left-landing-island");
  const p = { status: "racing", score: 0 };
  let pos = { x: target.x, y: target.y + RADIUS, z: target.z };
  const sim = { course: c, body: () => ({ translation: () => pos }) };
  const arm = () =>
    (p.launchBonusPending = { part: "catapult-left", airborne: true });
  for (const offset of [
    { x: 0, y: 2, z: 0 },
    { x: 12, y: 0, z: 0 },
  ]) {
    pos = {
      x: target.x + offset.x,
      y: target.y + RADIUS + offset.y,
      z: target.z + offset.z,
    };
    arm();
    assert.equal(updateLaunchBonus(sim, p, { supported: true }, RADIUS), null);
    assert.equal(
      p.launchBonusPending,
      null,
      "missed first landing consumes the flight",
    );
  }
  const localPoint = (x, z) => ({
    x: target.x + x * Math.cos(target.angle) - z * Math.sin(target.angle),
    y: target.y + RADIUS,
    z: target.z + x * Math.sin(target.angle) + z * Math.cos(target.angle),
  });
  pos = localPoint(target.w / 2 + 0.01, 0);
  arm();
  assert.equal(updateLaunchBonus(sim, p, { supported: true }, RADIUS), null);
  pos = localPoint(target.w / 2 - 0.01, target.d / 2 - 0.01);
  arm();
  assert.equal(updateLaunchBonus(sim, p, { supported: false }, RADIUS), null);
  assert.equal(p.score, 0, "crossing above the island is not contact");
  assert.equal(
    updateLaunchBonus(sim, p, { supported: true }, RADIUS).score,
    2000,
  );
  arm();
  assert.equal(updateLaunchBonus(sim, p, { supported: true }, RADIUS), null);
  assert.equal(p.score, 2000);
  removeWorkshopObject(c, "part:left-landing-island");
  validateCourse(c);
  assert.equal(
    c.parts.find((p) => p.id === "catapult-left").launchBonus,
    undefined,
  );
});

test("imported launch awards require a real impulse launcher and static floor destination", () => {
  for (const change of [
    false,
    null,
    {},
    { target: "missing", score: 2000 },
    { target: "left-landing-island", score: -2 },
    { target: "left-landing-island", score: 2.5 },
    { target: "landing-guide-0", score: 2000 },
  ]) {
    const c = ultimateCourse();
    c.parts.find((p) => p.id === "catapult-left").launchBonus = change;
    assert.throws(() => validateCourse(c), /launch bonus|launch bonus needs/i);
  }
  validateCourse(JSON.parse(JSON.stringify(ultimateCourse())));
});

import { CampaignRun } from "../src/rules.mjs";
import {
  moveWorkshopObject,
  rotateWorkshopObject,
  removeWorkshopObject,
} from "../src/workshop.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  initPhysics,
  Simulation,
  DemoController,
  RADIUS,
} from "../src/physics.mjs";
import {
  practiceCourse,
  worldPoint,
  campaignCourses,
} from "../src/campaign.mjs";
import { validateCourse } from "../src/course.mjs";
import { landingTargets } from "../src/landing-targets.mjs";
await initPhysics();

function drop(sim, index, target, height = 2) {
  const p = sim.players[index],
    b = sim.body(p);
  b.setTranslation(
    { x: target.x, y: target.y + RADIUS + height, z: target.z },
    true,
  );
  b.setLinvel({ x: 0, y: 0, z: 0 }, true);
  b.setAngvel({ x: 0, y: 0, z: 0 }, true);
}
function advance(sim, ticks) {
  const awards = [];
  for (let i = 0; i < ticks; i++) {
    sim.step();
    awards.push(...sim.events.filter((e) => e.type === "landing-bonus"));
  }
  return awards;
}

test("each actual Practice shelf awards a supported landing once and preserves the clock", () => {
  const c = practiceCourse();
  for (const target of landingTargets(c)) {
    const s = new Simulation(c, { untimed: true }),
      p = s.players[0];
    drop(s, 0, target);
    const awards = advance(s, 240);
    assert.deepEqual(awards, [
      { type: "landing-bonus", target: target.id, score: 4500, player: 0 },
    ]);
    assert.equal(p.time, 60);
    assert.equal(p.deaths, 0);
    assert.ok(Math.abs(p.current.position.y - target.y - RADIUS) < 0.005);
    drop(s, 0, target);
    assert.deepEqual(advance(s, 240), []);
    s.dispose();
  }
});

test("target rejects rolling starts, overflight, underside and unpainted shelf margin", () => {
  const c = practiceCourse(),
    target = landingTargets(c)[1];
  for (const [offsetX, height, ticks] of [
    [0, 0, 180],
    [0, 5, 20],
    [0, -2, 20],
    [2.35, 2, 180],
  ]) {
    const s = new Simulation(c, { untimed: true });
    const t = {
      ...target,
      x: target.x + offsetX * Math.cos(target.angle),
      z: target.z + offsetX * Math.sin(target.angle),
    };
    drop(s, 0, t, height);
    assert.deepEqual(advance(s, ticks), [], `${offsetX}/${height}`);
    s.dispose();
  }
});

test("landing claims are independent per player and replay across a midair snapshot", () => {
  const c = practiceCourse(),
    target = landingTargets(c)[1];
  const s = new Simulation(c, { players: 2, untimed: true });
  drop(s, 0, target);
  advance(s, 15);
  const snap = s.snapshot();
  const events = advance(s, 180),
    expected = structuredClone(s.players[0]);
  s.restore(snap);
  assert.deepEqual(advance(s, 180), events);
  assert.deepEqual(s.players[0], expected);
  // Remove player one's marble from the landing before testing player two.
  s.body(s.players[0]).setTranslation(worldPoint(-10, 10.55, 14), true);
  drop(s, 1, target);
  assert.equal(advance(s, 180).filter((e) => e.player === 1).length, 1);
  assert.deepEqual(s.players[0].landingClaims, [target.id]);
  assert.deepEqual(s.players[1].landingClaims, [target.id]);
  s.dispose();
});

test("landing target shares its floor transform and rejects invalid imported footprints", () => {
  const c = practiceCourse(),
    mark = c.markings.find(
      (m) => m.kind === "landing-target" && m.part === "left-shelf",
    );
  const floor = c.parts.find((p) => p.id === mark.part);
  moveWorkshopObject(c, "part:left-shelf", {
    x: floor.x + 8,
    y: floor.y,
    z: floor.z - 4,
  });
  rotateWorkshopObject(c, "part:left-shelf", Math.PI / 2 - floor.angle);
  const target = landingTargets(
    validateCourse(JSON.parse(JSON.stringify(c))),
  )[1];
  assert.equal(target.x, floor.x + 2);
  assert.equal(target.z, floor.z);
  assert.equal(target.y, floor.y);
  const s = new Simulation(c, { untimed: true });
  drop(s, 0, target);
  assert.equal(advance(s, 180)[0]?.score, 4500);
  s.dispose();
  mark.depth = 50;
  assert.throws(() => validateCourse(c), /fit its floor/);
  mark.depth = 3.4;
  mark.part = "missing";
  assert.throws(() => validateCourse(c), /Invalid landing target/);
  mark.part = "left-shelf";
  removeWorkshopObject(c, "part:left-shelf");
  assert.equal(landingTargets(validateCourse(c)).length, 2);
});

test("Practice bonus alternate lands and finishes with normal bounded controls and zero falls", () => {
  const c = practiceCourse();
  c.route = c.alternateRoutes.find((r) => r.id === "left-landing-bonus").route;
  const s = new Simulation(c),
    d = new DemoController(),
    awards = [];
  while (s.tick < 7200 && s.players[0].status === "racing") {
    const before = { ...s.body(s.players[0]).translation() },
      input = d.input(s);
    assert.deepEqual({ ...s.body(s.players[0]).translation() }, before);
    assert.ok(Math.hypot(input.x, input.z) <= 1 + 1e-12);
    s.step([input]);
    awards.push(...s.events.filter((e) => e.type === "landing-bonus"));
  }
  assert.equal(s.players[0].status, "finished");
  assert.equal(s.players[0].deaths, 0);
  assert.equal(awards.length, 1);
  assert.equal(awards[0].target, "bonus-left-shelf");
  assert.ok(s.players[0].score >= awards[0].score + 1000);
  s.dispose();
});

test("all six original completion awards are separate from the unused-clock bonus", () => {
  for (const [index, c] of campaignCourses().entries()) {
    for (const untimed of [true, false]) {
      const s = new Simulation(c, { untimed }),
        p = s.players[0];
      const g = c.goal;
      s.body(p).setTranslation({ x: g.x, y: g.y + RADIUS, z: g.z }, true);
      p.progress = 10000; // Exclude unrelated distance scoring from this assertion.
      for (let i = 0; i < 10 && p.status === "racing"; i++) s.step();
      assert.equal(p.status, "finished");
      assert.equal(
        p.score,
        (index + 1) * 1000 + (untimed ? 0 : Math.floor(p.time) * 100),
      );
      s.step();
      assert.equal(
        p.score,
        (index + 1) * 1000 + (untimed ? 0 : Math.floor(p.time) * 100),
      );
      s.dispose();
    }
  }
});

test("Ultimate reference tally includes 6000, the 400 clock award, and the separate ending total", () => {
  const c = campaignCourses().at(-1),
    s = new Simulation(c),
    p = s.players[0];
  const g = c.goal,
    run = new CampaignRun({ players: 1 });
  run.index = 5;
  s.body(p).setTranslation({ x: g.x, y: g.y + RADIUS, z: g.z }, true);
  Object.assign(p, { progress: 10000, score: 52070, time: 4.1, deaths: 3 });
  for (let i = 0; i < 10 && p.status === "racing"; i++) s.step();
  assert.equal(p.status, "finished");
  assert.equal(p.score, 58470);
  assert.equal(run.complete(s), "complete");
  assert.equal(run.players[0].score, 79470);
  s.dispose();
});

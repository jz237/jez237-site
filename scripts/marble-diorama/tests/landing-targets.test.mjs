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
import * as THREE from "three";
import {
  landingTargets,
  landingScore,
  landingAmount,
} from "../src/landing-targets.mjs";
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

test("Practice permits one shelf bonus per player across all three landing regions", () => {
  for (const firstIndex of [0, 1, 2]) {
    const c = practiceCourse(),
      targets = landingTargets(c);
    const sim = new Simulation(c, { players: 2, untimed: true });
    for (const player of [0, 1]) {
      const other = sim.players[1 - player];
      sim.body(other).setTranslation(worldPoint(-10, 10.56, 14), true);
      const order = [firstIndex, (firstIndex + 1) % 3, (firstIndex + 2) % 3];
      for (const [attempt, index] of order.entries()) {
        drop(sim, player, targets[index]);
        const awards = advance(sim, 180).filter((e) => e.player === player);
        assert.equal(awards.length, attempt === 0 ? 1 : 0);
      }
      assert.deepEqual(sim.players[player].landingClaims, [
        targets[firstIndex].id,
      ]);
      assert.deepEqual(sim.players[player].landingClaimGroups, [
        "practice-landing-bonus",
      ]);
    }
    sim.dispose();
  }
});

test("shared shelf eligibility survives respawn and replay; a fresh race resets it", () => {
  const c = practiceCourse(),
    targets = landingTargets(c);
  const sim = new Simulation(c, { untimed: true });
  drop(sim, 0, targets[0]);
  assert.equal(advance(sim, 180).length, 1);
  const claimed = sim.snapshot();
  sim.respawn(sim.players[0]);
  drop(sim, 0, targets[1]);
  assert.deepEqual(advance(sim, 180), []);
  sim.restore(claimed);
  sim.respawn(sim.players[0]);
  drop(sim, 0, targets[2]);
  assert.deepEqual(advance(sim, 180), []);
  sim.dispose();
  const restarted = new Simulation(c, { untimed: true });
  drop(restarted, 0, targets[2]);
  assert.equal(advance(restarted, 180).length, 1);
  restarted.dispose();
});

test("custom landing groups round trip, validate and leave ungrouped shelves independent", () => {
  const c = practiceCourse();
  const marks = c.markings.filter((m) => m.kind === "landing-target");
  for (const mark of marks) delete mark.claimGroup;
  const sim = new Simulation(validateCourse(JSON.parse(JSON.stringify(c))), {
    untimed: true,
  });
  for (const target of landingTargets(c)) {
    drop(sim, 0, target);
    assert.equal(advance(sim, 180).length, 1);
  }
  assert.equal(sim.players[0].landingClaimGroups, undefined);
  sim.dispose();
  marks[0].claimGroup = "shared-shelves";
  assert.equal(
    landingTargets(validateCourse(JSON.parse(JSON.stringify(c))))[0].claimGroup,
    "shared-shelves",
  );
  for (const invalid of [null, 0, [], {}, "", "   ", "x".repeat(65)]) {
    marks[0].claimGroup = invalid;
    assert.throws(() => validateCourse(c), /Invalid landing target/);
  }
});

test("all seven recovered Practice awards come from real shelf landings", () => {
  const amounts = [3000, 3500, 4000, 4500, 5000, 5500, 6000];
  for (const [index, amount] of amounts.entries()) {
    const c = practiceCourse(),
      target = landingTargets(c)[0];
    const sim = new Simulation(c, { untimed: true });
    const t = (index + 0.5) / amounts.length;
    const x = (t - 0.5) * target.w,
      z = (t - 0.5) * target.d;
    drop(sim, 0, {
      ...target,
      x: target.x + x * Math.cos(target.angle) - z * Math.sin(target.angle),
      z: target.z + x * Math.sin(target.angle) + z * Math.cos(target.angle),
    });
    assert.equal(advance(sim, 180)[0]?.score, amount, `band ${index}`);
    assert.equal(sim.players[0].deaths, 0);
    sim.dispose();
  }
});

test("paint coordinates agree with landing scores after moving and rotating a shelf", () => {
  const c = practiceCourse(),
    floor = c.parts.find((p) => p.id === "left-shelf");
  moveWorkshopObject(c, "part:left-shelf", { x: 12, y: 8, z: -5 });
  rotateWorkshopObject(c, "part:left-shelf", 0.7 - floor.angle);
  const target = landingTargets(
    validateCourse(JSON.parse(JSON.stringify(c))),
  )[1];
  // Canvas top is PlaneGeometry +Y, which rotates onto floor-local -Z.
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(target.w, target.d));
  plane.rotation.set(-Math.PI / 2, 0, -target.angle);
  plane.position.set(target.x, target.y + 0.012, target.z);
  plane.updateMatrixWorld();
  const observed = new Set();
  for (let y = 1; y < 256; y += 7)
    for (let x = 1; x < 256; x += 7) {
      const u = x / 256,
        v = y / 256;
      const pos = plane.localToWorld(
        new THREE.Vector3((u - 0.5) * target.w, (0.5 - v) * target.d, 0),
      );
      const painted = landingAmount(target, u, v);
      assert.equal(landingScore(target, pos), painted);
      observed.add(painted);
    }
  assert.deepEqual(
    [...observed].sort((a, b) => a - b),
    [3000, 3500, 4000, 4500, 5000, 5500, 6000],
  );
  plane.geometry.dispose();
  plane.material.dispose();
});

test("banded target imports validate and legacy custom interpolation remains available", () => {
  const c = practiceCourse(),
    mark = c.markings.find((m) => m.kind === "landing-target");
  const saved = [...mark.scoreBands];
  for (const invalid of [
    null,
    {},
    [],
    [0],
    [20001],
    [3000.5],
    Array(33).fill(3000),
  ]) {
    mark.scoreBands = invalid;
    assert.throws(() => validateCourse(c), /Invalid landing target/);
  }
  mark.scoreBands = saved;
  assert.deepEqual(
    landingTargets(validateCourse(JSON.parse(JSON.stringify(c))))[0].scoreBands,
    saved,
  );
  delete mark.scoreBands;
  assert.equal(landingAmount(mark, 0.6, 0.7), 4900);
});

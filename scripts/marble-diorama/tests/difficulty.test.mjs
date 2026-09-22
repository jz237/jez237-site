import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation } from "../src/physics.mjs";
import {
  campaignCourses,
  beginnerCourse,
  intermediateCourse,
} from "../src/campaign.mjs";
import { proofCourse } from "../src/course.mjs";
import { CampaignRun, courseTime, nextCourseTime } from "../src/rules.mjs";
import { Recording, seekRecording } from "../src/storage.mjs";
await initPhysics();

// Independent reference: the original 48-byte allocation block at 0x22f0.
// Includes level 1's 35-unit Aerial allowance, which is greater than level 0.
const reference = Buffer.from(
  "3c4b2d1e19193c46282319143c411e1e14143c371e1914143c321e1414143c281e1414143228191414142d2314141414",
  "hex",
);

test("all six actual courses initialize both players from all eight original difficulty rows", () => {
  for (let level = 0; level < 8; level++) {
    for (const [i, course] of campaignCourses().entries()) {
      const sim = new Simulation(course, { difficulty: level, players: 2 });
      assert.deepEqual(
        sim.players.map((p) => p.time),
        Array(2).fill(reference[level * 6 + i]),
      );
      assert.equal(
        nextCourseTime(course.id, 12.9, level),
        reference[level * 6 + i] + (i < 2 ? 0 : 12),
      );
      sim.dispose();
    }
  }
});

test("hardest campaign combines its own reset and carryover with the contested winner award", () => {
  const run = new CampaignRun({ players: 2, difficulty: 7 });
  run.complete({
    tick: 900,
    players: [800, 900].map((finishTick) => ({
      status: "finished",
      finishTick,
      time: 18.75,
      score: 900,
      deaths: 0,
    })),
  });
  const s = new Simulation(beginnerCourse(), run.options);
  run.prepare(s);
  assert.deepEqual(
    s.players.map((p) => p.time),
    [40, 35],
  );
  run.prepare(s);
  assert.deepEqual(
    s.players.map((p) => p.time),
    [40, 35],
  );
  s.dispose();
});

test("difficulty preserves timer cadence, player motion and physical enemy/machine state", () => {
  const a = new Simulation(intermediateCourse(), { difficulty: 0 });
  const b = new Simulation(intermediateCourse(), { difficulty: 7 });
  const start = [a.players[0].time, b.players[0].time];
  for (let tick = 0; tick < 240; tick++) {
    const inputs = [{ x: 0.2, z: -0.3, turbo: true }];
    a.step(inputs);
    b.step(inputs);
  }
  assert.deepEqual(a.players[0].current, b.players[0].current);
  assert.deepEqual(
    a.enemies.map((e) => e.current),
    b.enemies.map((e) => e.current),
  );
  assert.ok(a.enemies.length > 0 && a.movers.length > 0);
  assert.deepEqual(
    a.movers.map((m) => m.current),
    b.movers.map((m) => m.current),
  );
  assert.ok(
    Math.abs(start[0] - a.players[0].time - (start[1] - b.players[0].time)) <
      1e-9,
  );
  a.dispose();
  b.dispose();
});

test("custom allowances and force zones do not inherit original course tables or speed guesses", () => {
  const c = proofCourse();
  c.category = "custom";
  c.id = "practice";
  c.time = 123;
  c.zones = [{ kind: "magnet", x: 2, y: 4.55, z: 2, radius: 8, strength: 0.6 }];
  const a = new Simulation(c, { difficulty: 0 });
  const b = new Simulation(c, { difficulty: 7 });
  assert.equal(a.players[0].time, 123);
  assert.equal(b.players[0].time, 123);
  for (let tick = 0; tick < 240; tick++) {
    a.step();
    b.step();
  }
  assert.deepEqual(a.players[0], b.players[0]);
  a.dispose();
  b.dispose();
  assert.equal(courseTime("constructor", 7), undefined);
});

test("saved high-difficulty replay restores the initial allowance and exact continuation", () => {
  const sim = new Simulation(beginnerCourse(), { difficulty: 7 });
  const record = new Recording(sim);
  assert.equal(sim.players[0].time, 35);
  for (let tick = 0; tick < 240; tick++) {
    const inputs = [{ x: 0.1, z: -0.4, turbo: true }];
    sim.step(inputs);
    record.capture(sim, inputs);
  }
  const replay = seekRecording(JSON.parse(JSON.stringify(record)), sim.tick);
  assert.deepEqual(replay.players, sim.players);
  replay.dispose();
  sim.dispose();
});

import test from "node:test";
import assert from "node:assert/strict";
import { campaignCourses, nativeCourse } from "../src/native-campaign.mjs";
import { practiceCourse as legacyPractice } from "../src/campaign.mjs";
import { validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { recordKey } from "../src/storage.mjs";
import {
  CAMPAIGN_ORDER,
  courseTime,
  amigaCourseRules,
  CampaignRun,
} from "../src/rules.mjs";
await initPhysics();

test("campaign definitions preserve recovered terrain, actors, rules and independent copies", () => {
  const courses = campaignCourses();
  assert.deepEqual(
    courses.map((c) => c.id),
    CAMPAIGN_ORDER,
  );
  for (const [index, c] of courses.entries()) {
    validateCourse(c);
    assert.equal(c.category, "campaign");
    assert.equal(c.courseNumber, index + 1);
    assert.equal(c.musicCue, c.id);
    assert.equal(c.time, courseTime(c.id));
    assert.deepEqual(c.rules, amigaCourseRules(c.id));
    assert.equal(c.nativeDynamics.rate, c.nativeCamera.rate);
    assert.equal(c.navigation.partId, "source-terrain");
    assert.equal(c.finishFlags.poles.length, 2);
    assert.ok(c.parts[0].cells.length > 500);
    const original = nativeCourse(c.id);
    c.parts[0].cells[0][2] += 2;
    c.sidePalette[0] = "#000000";
    assert.deepEqual(nativeCourse(c.id), original);
  }
  assert.throws(() => nativeCourse("missing"), /Unknown native/);
  assert.notEqual(
    recordKey(nativeCourse("practice"), { players: 1 }),
    recordKey(legacyPractice(), { players: 1 }),
  );
});

for (const id of CAMPAIGN_ORDER) {
  test(`${id} recovered campaign starts both physical players with the original clock`, () => {
    const c = nativeCourse(id);
    const sim = new Simulation(c, { players: 2, difficulty: 7 });
    try {
      for (const p of sim.players) {
        assert.equal(p.time, courseTime(id, 7));
        assert.equal(p.status, "racing");
      }
      // Exercise the integrated actors, terrain sequence, flags and camera.
      // This is a startup check, not proof of a complete course route.
      for (let i = 0; i < 120; i++)
        sim.step([
          { x: 0, z: 0 },
          { x: 0, z: 0 },
        ]);
      for (const p of sim.players) {
        const pos = sim.body(p).translation();
        assert.ok([pos.x, pos.y, pos.z].every(Number.isFinite));
        assert.equal(p.deaths, 0);
        assert.equal(p.status, "racing");
      }
      assert.ok(sim.nativeDynamics.gravity > 20);
    } finally {
      sim.dispose();
    }
  });
}

for (const players of [1, 2])
  for (const difficulty of [0, 7]) {
    test(`native Practice completes timed with ${players} players on difficulty ${difficulty}`, () => {
      const course = nativeCourse("practice");
      const run = new CampaignRun({ players, difficulty });
      const sim = new Simulation(course, { players, difficulty });
      const drivers = sim.players.map(() => new DemoController());
      run.prepare(sim);
      try {
        while (
          sim.tick < 6500 &&
          sim.players.some((p) => p.status === "racing")
        ) {
          const before = sim.players.map((p) => ({
            ...sim.body(p).translation(),
          }));
          const inputs = drivers.map((d, i) => d.input(sim, i));
          inputs.forEach((input, i) => {
            assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
            assert.deepEqual(
              { ...sim.body(sim.players[i]).translation() },
              before[i],
            );
          });
          sim.step(inputs);
        }
        for (const p of sim.players) {
          assert.equal(p.status, "finished");
          assert.equal(p.deaths, 0);
          assert.equal(p.navigation.region, 255);
          assert.ok(p.time > 0);
          assert.ok(p.score >= 1000);
        }
        assert.equal(run.complete(sim), "next");
        assert.equal(run.courseId, "beginner");
        const next = new Simulation(nativeCourse(run.courseId), {
          players,
          difficulty,
        });
        try {
          run.prepare(next);
          next.players.forEach((p, i) => {
            assert.equal(
              p.time,
              courseTime("beginner", difficulty) + run.nextTimeBonuses[i],
            );
            assert.equal(p.score, sim.players[i].score);
          });
        } finally {
          next.dispose();
        }
      } finally {
        sim.dispose();
      }
    });
  }

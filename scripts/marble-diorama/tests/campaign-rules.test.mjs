import test from "node:test";
import assert from "node:assert/strict";
import { CampaignRun } from "../src/rules.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
import { beginnerCourse, intermediateCourse } from "../src/campaign.mjs";

await initPhysics();

const finished = (finishTick, time = 30.75) => ({
  status: "finished",
  finishTick,
  time,
  score: 7000,
  deaths: 0,
});
const timedOut = {
  status: "timeout",
  finishTick: null,
  time: 0,
  score: 1200,
  deaths: 1,
};
const result = (players) => ({ tick: 1000, players });

test("first finisher earns five next-race units, separate from score and Beginner reset", () => {
  const run = new CampaignRun({ players: 2 });
  run.complete(result([finished(900), finished(800, 32.25)]));
  assert.deepEqual(run.nextTimeBonuses, [0, 5]);
  assert.equal(run.results[0].winner, 1);
  assert.deepEqual(
    run.results[0].players.map((p) => p.score),
    [7000, 7000],
  );
  const sim = new Simulation(beginnerCourse(), { players: 2 });
  run.prepare(sim);
  assert.deepEqual(
    sim.players.map((p) => p.time),
    [75, 80],
  );
  // Restarting this race must reapply its starting clock, not accumulate awards.
  run.prepare(sim);
  assert.deepEqual(
    sim.players.map((p) => p.time),
    [75, 80],
  );
  sim.dispose();
  run.complete(result([finished(800, 40.9), finished(900, 38.2)]));
  const next = new Simulation(intermediateCourse(), { players: 2 });
  run.prepare(next);
  assert.deepEqual(
    next.players.map((p) => p.time),
    [90, 83],
  );
  assert.deepEqual(run.results[0].nextTimeBonuses, [0, 5]);
  next.dispose();
});

test("a rival's timeout does not cancel a win, but later uncontested races earn no award", () => {
  const run = new CampaignRun({ players: 2 });
  run.complete(result([finished(800), { ...timedOut }]));
  assert.deepEqual(run.nextTimeBonuses, [5, 0]);
  run.complete(result([finished(800), { ...timedOut }]));
  assert.deepEqual(run.nextTimeBonuses, [0, 0]);
  const sim = new Simulation(intermediateCourse(), { players: 2 });
  run.prepare(sim);
  assert.equal(sim.players[0].time, 75);
  assert.equal(sim.players[1].time, 0);
  assert.equal(sim.body(sim.players[1]).isEnabled(), false);
  sim.dispose();
});

test("same-tick finishes keep the serial player order and award only one marble", () => {
  const run = new CampaignRun({ players: 2 });
  run.complete(result([finished(800), finished(800)]));
  assert.deepEqual(run.nextTimeBonuses, [5, 0]);
});

test("solo, untimed, all-timeout and final races do not generate a next-race award", () => {
  for (const fixture of [
    { options: { players: 1 }, players: [finished(800)] },
    {
      options: { players: 2, untimed: true },
      players: [finished(800), finished(900)],
    },
    { options: { players: 2 }, players: [{ ...timedOut }, { ...timedOut }] },
    {
      options: { players: 2 },
      index: 5,
      players: [finished(800), finished(900)],
    },
  ]) {
    const run = new CampaignRun(fixture.options);
    run.index = fixture.index ?? 0;
    run.complete(result(fixture.players));
    assert.deepEqual(
      run.nextTimeBonuses,
      fixture.players.map(() => 0),
    );
  }
});

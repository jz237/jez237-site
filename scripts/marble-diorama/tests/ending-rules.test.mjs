import test from "node:test";
import assert from "node:assert/strict";
import { CampaignRun, endingBonus, CAMPAIGN_ORDER } from "../src/rules.mjs";

test("original ending arithmetic caps credited time at 99 and losses at 20", () => {
  // Independent boundary examples from the original integer operands,
  // including the cases where the prior uncapped formula mis-scored a run.
  for (const [time, deaths, expected] of [
    [0, 0, 20000],
    [4.99, 3, 21000],
    [98.99, 19, 99000],
    [99, 20, 99000],
    [100, 21, 99000],
    [140.75, 2, 117000],
    [0.5, 21, 0],
    [3.75, 40, 3000],
  ])
    assert.equal(endingBonus(time, deaths), expected, `${time}, ${deaths}`);
});

function campaignResults(options, finalTimeout = false) {
  const run = new CampaignRun({ players: 2, ...options });
  let outcome;
  for (let race = 0; race < CAMPAIGN_ORDER.length; race++) {
    const sim = {
      tick: 1000,
      players: [0, 1].map((i) => ({
        // These are course results: score includes the ordinary finish award,
        // while falls are course-local and must accumulate across all six.
        status: race === 5 && i === 1 && finalTimeout ? "timeout" : "finished",
        finishTick: race === 5 && i === 1 && finalTimeout ? null : 900 + i,
        time: i === 0 ? 140.75 : 3.75,
        score: run.players[i].score + 7000,
        deaths: i === 0 ? 4 : 1,
      })),
    };
    outcome = run.complete(sim);
    if (race < 5) assert.equal(outcome, "next");
  }
  return { run, outcome };
}

test("ending applies capped campaign totals independently without rewriting race results", () => {
  const { run, outcome } = campaignResults({});
  assert.equal(outcome, "complete");
  assert.deepEqual(
    run.players.map((p) => p.deaths),
    [24, 6],
  );
  assert.deepEqual(
    run.players.map((p) => p.score),
    [141000, 59000],
  );
  assert.deepEqual(
    run.results[5].players.map((p) => p.score),
    [42000, 42000],
  );
  assert.deepEqual(
    run.results[5].players.map((p) => p.deaths),
    [4, 1],
  );
  const restored = JSON.parse(
    JSON.stringify({ players: run.players, results: run.results }),
  );
  assert.equal(restored.players[0].score, 141000);
  assert.equal(restored.players[0].deaths, 24);
});

test("untimed finish keeps the capped fall deduction; timed-out rivals earn no ending award", () => {
  const { run } = campaignResults({ untimed: true });
  assert.deepEqual(
    run.players.map((p) => p.score),
    [42000, 56000],
  );
  const timed = campaignResults({}, true);
  assert.equal(timed.outcome, "complete");
  assert.deepEqual(
    timed.run.players.map((p) => p.score),
    [141000, 42000],
  );
  assert.equal(timed.run.players[1].active, false);
});

import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
import { proofCourse, part, point } from "../src/course.mjs";
import { recordKey } from "../src/storage.mjs";
import { DemoController } from "../src/physics.mjs";
import { nativeCourse } from "../src/native-campaign.mjs";
await initPhysics();
test("forgiving handling completes timed native Practice solo and paired", () => {
  for (const players of [1, 2]) {
    const sim = new Simulation(nativeCourse("practice"), {
      players,
      handling: "forgiving",
      difficulty: 0,
    });
    const drivers = sim.players.map(() => new DemoController());
    try {
      while (sim.tick < 6500 && sim.players.some((p) => p.status === "racing"))
        sim.step(drivers.map((driver, i) => driver.input(sim, i)));
      for (const p of sim.players) {
        assert.equal(p.status, "finished");
        assert.equal(p.deaths, 0);
        assert.ok(p.time > 0);
      }
    } finally {
      sim.dispose();
    }
  }
});
function fixture(handling, material = "stone", height = RADIUS) {
  const course = {
    ...proofCourse(),
    parts: [{ ...part("flat", 0, 20, 40, 100), material }],
    starts: [point(0, height, 0)],
    goal: point(0, 0, 65),
    zones: [],
    enemies: [],
  };
  return new Simulation(course, { handling, untimed: true });
}
test("forgiving release and reversal substantially reduce stopping travel without changing forward acceleration", () => {
  for (const reverse of [false, true]) {
    const sims = ["classic", "forgiving"].map((x) => fixture(x));
    try {
      for (const sim of sims)
        for (let i = 0; i < 240; i++) sim.step([{ x: 0, z: 1 }]);
      assert.deepEqual(sims[0].players[0].current, sims[1].players[0].current);
      const start = sims.map((s) => s.body(s.players[0]).translation().z),
        max = [0, 0];
      for (let i = 0; i < 240; i++)
        sims.forEach((s, k) => {
          s.step([{ x: 0, z: reverse ? -1 : 0 }]);
          max[k] = Math.max(
            max[k],
            s.body(s.players[0]).translation().z - start[k],
          );
        });
      assert.ok(max[1] < max[0] * 0.65, JSON.stringify({ reverse, max }));
      console.log(
        JSON.stringify({
          reverse,
          classicTravel: max[0],
          forgivingTravel: max[1],
        }),
      );
    } finally {
      sims.forEach((s) => s.dispose());
    }
  }
});
test("forgiving turns reduce sideways travel and replay restores exactly", () => {
  const sims = ["classic", "forgiving"].map((x) => fixture(x));
  try {
    for (const s of sims) for (let i = 0; i < 240; i++) s.step([{ z: 1 }]);
    const start = sims.map((s) => s.body(s.players[0]).translation().z);
    const saved = sims[1].snapshot();
    for (const s of sims)
      for (let i = 0; i < 180; i++) s.step([{ x: 1, z: 0 }]);
    const travel = sims.map(
      (s, i) => s.body(s.players[0]).translation().z - start[i],
    );
    assert.ok(travel[1] < travel[0] * 0.65, JSON.stringify(travel));
    const expected = structuredClone(sims[1].players);
    sims[1].restore(saved);
    for (let i = 0; i < 180; i++) sims[1].step([{ x: 1, z: 0 }]);
    assert.deepEqual(sims[1].players, expected);
    assert.notEqual(
      recordKey(sims[0].course, sims[0].options),
      recordKey(sims[1].course, sims[1].options),
    );
  } finally {
    sims.forEach((s) => s.dispose());
  }
});
test("forgiving mode preserves ice motion and unsupported flight", () => {
  for (const [material, height] of [
    ["ice", RADIUS],
    ["stone", 30],
  ]) {
    const sims = ["classic", "forgiving"].map((x) =>
      fixture(x, material, height),
    );
    try {
      for (let i = 0; i < 60; i++)
        for (const s of sims) s.step([{ x: i < 30 ? 1 : -1, z: 0.5 }]);
      assert.deepEqual(sims[0].players[0].current, sims[1].players[0].current);
    } finally {
      sims.forEach((s) => s.dispose());
    }
  }
});

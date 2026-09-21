import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation, RADIUS } from "../src/physics.mjs";
import {
  blankCourse,
  moveWorkshopObject,
  rotateWorkshopObject,
} from "../src/workshop.mjs";
import { part, validateCourse } from "../src/course.mjs";
import {
  traversalPaths,
  updateTraversalBonuses,
  tubePosition,
} from "../src/traversal-bonuses.mjs";
await initPhysics();
function arena() {
  const c = blankCourse();
  c.goal = { x: 0, y: 3, z: 30 };
  c.starts = [{ x: 0, y: 3.56, z: -1 }];
  c.parts = [
    part("floor", 0, 4, 8, 14, 3),
    part("pipe", 0, 0, 4, 8, 0, {
      kind: "tube",
      radius: 1.8,
      path: [
        { x: 0, y: 4.8, z: 0 },
        { x: 0, y: 4.8, z: 4 },
        { x: 0, y: 4.8, z: 8 },
      ],
      traversalBonus: 2000,
    }),
  ];
  return c;
}
function follow(paths, points, p = { score: 0 }) {
  const events = [];
  for (const q of points)
    events.push(...updateTraversalBonuses(paths, p, q, RADIUS));
  return { p, events };
}

test("native rolling through a tube pays at its exit once and replays from inside", () => {
  const s = new Simulation(arena(), { untimed: true });
  const input = [{ x: 0, z: 1 }];
  while (s.body(s.players[0]).translation().z < 3 && s.tick < 600)
    s.step(input);
  assert.ok(s.players[0].traversals.pipe);
  assert.equal(s.players[0].traversalClaims, undefined);
  const snap = s.snapshot();
  const run = () => {
    const awards = [];
    for (let i = 0; i < 360; i++)
      awards.push(...s.step(input).filter((e) => e.type === "traversal-bonus"));
    return { awards, p: structuredClone(s.players[0]) };
  };
  const first = run();
  assert.deepEqual(first.awards, [
    { type: "traversal-bonus", part: "pipe", score: 2000, player: 0 },
  ]);
  assert.deepEqual(first.p.traversalClaims, ["pipe"]);
  s.restore(snap);
  assert.deepEqual(run(), first);
  s.dispose();
});

test("tube awards reject walking above, below, outside, reverse entry, and a skipped middle", () => {
  const paths = traversalPaths(arena());
  const line = (x, y, from = -0.2, to = 8.2) =>
    Array.from({ length: 169 }, (_, i) => ({
      x,
      y,
      z: from + ((to - from) * i) / 168,
    }));
  for (const points of [
    line(0, 7.2),
    line(0, 1),
    line(2.3, 4.8),
    line(0, 3.55, 8.2, -0.2),
    [{ x: 0, y: 3.55, z: 0 }, ...line(0, 3.55, 5, 8.2)],
  ]) {
    const result = follow(paths, points);
    assert.deepEqual(result.events, []);
    assert.equal(result.p.score, 0);
  }
  const p = { score: 0 };
  const valid = line(0, 3.55);
  assert.equal(follow(paths, valid, p).events.length, 1);
  assert.deepEqual(follow(paths, valid, p).events, []);
  assert.equal(follow(paths, valid).events.length, 1); // independent player
});

test("leaving a pipe halfway or falling cannot retain a pending completion", () => {
  const c = arena(),
    paths = traversalPaths(c),
    p = { score: 0 };
  const points = Array.from({ length: 61 }, (_, i) => ({
    x: 0,
    y: 3.55,
    z: i * 0.05,
  }));
  follow(paths, points, p);
  assert.ok(p.traversals.pipe);
  follow(paths, [{ x: 4, y: 3.55, z: 3 }], p);
  assert.equal(p.traversals.pipe, undefined);
  assert.deepEqual(follow(paths, paths[0].points.slice(40), p).events, []);
  const sim = new Simulation(c, { untimed: true });
  sim.players[0].traversals = { pipe: { progress: 3 } };
  sim.fall(sim.players[0]);
  assert.deepEqual(sim.players[0].traversals, {});
  sim.dispose();
});

test("moved and rotated pipe awards use the same local path after JSON round trip", () => {
  const c = arena(),
    p = c.parts[1];
  moveWorkshopObject(c, "part:pipe", { x: 20, y: 5, z: -10 });
  rotateWorkshopObject(c, "part:pipe", Math.PI / 2);
  const path = traversalPaths(validateCourse(JSON.parse(JSON.stringify(c))))[0];
  assert.deepEqual(path.points[0], { x: 20, y: 9.8, z: -10 });
  assert.ok(Math.abs(path.points.at(-1).x - 12) < 1e-8);
  for (const point of path.points)
    assert.ok(tubePosition(path, point).distance < 1e-8);
  const result = follow([path], path.points);
  assert.equal(result.events[0]?.score, 2000);
  assert.equal(result.p.score, 2000);
  for (const invalid of [-1, 0, 1.5, Infinity, 20001, "2000"]) {
    p.traversalBonus = invalid;
    assert.throws(() => validateCourse(c), /traversal bonus/);
  }
  p.traversalBonus = 2000;
  p.kind = "floor";
  assert.throws(() => validateCourse(c), /traversal bonus/);
});

test("imported pipe IDs cannot inherit pending traversal state", () => {
  for (const id of ["constructor", "toString", "__proto__"]) {
    const c = arena();
    c.parts[1].id = id;
    const paths = traversalPaths(validateCourse(c));
    assert.deepEqual(follow(paths, paths[0].points.slice(-4)).events, []);
    const result = follow(paths, paths[0].points);
    assert.equal(result.events.length, 1);
    assert.equal(result.events[0].part, id);
    assert.equal(Object.getPrototypeOf(result.p.traversals), Object.prototype);
  }
});

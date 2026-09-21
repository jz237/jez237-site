import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { part } from "../src/course.mjs";
import { beginnerCourse } from "../src/campaign.mjs";
await initPhysics();

function arena(players = 1) {
  const c = blankCourse();
  c.goal.z = 50;
  c.parts = [part("arena", 0, 0, 4, 8)];
  c.starts = [
    { x: -1.05, y: 0.56, z: 0 },
    { x: -1.05, y: 0.56, z: 2 },
  ];
  c.enemies = [
    {
      id: "steelie",
      kind: "steelie",
      x: 0,
      y: 0.56,
      z: 0,
      radius: 0.55,
      roam: 5,
      speed: 1.8,
    },
  ];
  return new Simulation(c, { players, untimed: true });
}

test("Beginner restores both steelies and three independently animated munchers", () => {
  const c = beginnerCourse();
  assert.equal(c.enemies.filter((e) => e.kind === "steelie").length, 2);
  const munchers = c.enemies.filter((e) => e.kind === "muncher");
  assert.equal(munchers.length, 3);
  assert.equal(new Set(munchers.map((e) => e.phase)).size, 3);
});

test("a rolling impact knocks a steelie off, awards 1000 once and never respawns it", () => {
  const sim = arena();
  // Incoming rolling momentum is an initial condition; contact, separation,
  // the fall and the award all run through the native physics world.
  sim.body(sim.players[0]).setTranslation({ x: -1.6, y: 0.56, z: 0 }, true);
  sim.world
    .getRigidBody(sim.enemies[0].handle)
    .setTranslation({ x: 1.2, y: 0.56, z: 0 }, true);
  sim.body(sim.players[0]).setLinvel({ x: 8, y: 0, z: 0 }, true);
  sim.body(sim.players[0]).setAngvel({ x: 0, y: 0, z: -8 / 0.55 }, true);
  const awards = [];
  let contact = false;
  for (let i = 0; i < 1200; i++) {
    sim.step([{ x: 1, z: 0, turbo: true }]);
    contact ||= sim.enemies[0].lastContactPlayer === 0;
    awards.push(...sim.events.filter((e) => e.type === "steelie-defeat"));
  }
  assert.equal(contact, true);
  assert.deepEqual(awards, [
    { type: "steelie-defeat", enemy: "steelie", player: 0, score: 1000 },
  ]);
  assert.equal(sim.enemies[0].defeated, true);
  assert.equal(
    sim.world.getRigidBody(sim.enemies[0].handle).isEnabled(),
    false,
  );
  assert.ok(sim.players[0].score >= 1000);
  sim.dispose();
});

test("uncontacted falling steelies retire without giving a nearby player points", () => {
  const sim = arena();
  const body = sim.world.getRigidBody(sim.enemies[0].handle);
  body.setTranslation({ x: 3, y: 0.56, z: 0 }, true);
  const events = [];
  for (let i = 0; i < 240; i++) events.push(...sim.step());
  assert.equal(sim.enemies[0].defeated, true);
  assert.equal(
    events.some((e) => e.type === "steelie-defeat"),
    false,
  );
  sim.dispose();
});

test("steelie reward follows the last physical contact and survives snapshot restoration", () => {
  const sim = arena(2);
  for (let i = 0; i < 10; i++) sim.step();
  assert.equal(sim.enemies[0].lastContactPlayer, 0);
  const b = sim.world.getRigidBody(sim.enemies[0].handle);
  const q = b.translation();
  sim.body(sim.players[0]).setTranslation({ x: -1, y: 0.56, z: -3 }, true);
  sim
    .body(sim.players[1])
    .setTranslation({ x: q.x - 1.05, y: q.y, z: q.z }, true);
  for (let i = 0; i < 10; i++) sim.step();
  assert.equal(sim.enemies[0].lastContactPlayer, 1);
  b.setTranslation({ x: 4, y: 0.56, z: 0 }, true);
  b.setLinvel({ x: 0, y: 0, z: 0 }, true);
  const snap = sim.snapshot();
  const run = () => {
    const awards = [];
    for (let i = 0; i < 240; i++)
      awards.push(...sim.step().filter((e) => e.type === "steelie-defeat"));
    return {
      awards,
      players: structuredClone(sim.players),
      enemies: structuredClone(sim.enemies),
    };
  };
  const expected = run();
  assert.equal(expected.awards.length, 1);
  assert.equal(expected.awards[0].player, 1);
  sim.restore(snap);
  assert.deepEqual(run(), expected);
  sim.dispose();
});

test("a steelie supported below its starting elevation is not mistaken for a defeat", () => {
  const c = blankCourse();
  c.goal.z = 50;
  c.parts = [part("lower-floor", 0, 0, 8, 8, -6)];
  c.enemies = [
    {
      id: "steelie",
      kind: "steelie",
      x: 0,
      y: 0.56,
      z: 0,
      radius: 0.55,
      roam: 3,
      speed: 1.8,
    },
  ];
  c.starts = [{ x: -3, y: -5.44, z: -3 }];
  const sim = new Simulation(c, { untimed: true });
  const enemy = sim.enemies[0];
  sim.step(); // Populate the native broad phase before placing the descent fixture.
  sim.world
    .getRigidBody(enemy.handle)
    .setTranslation({ x: 0, y: -5.45, z: 0 }, true);
  for (let i = 0; i < 60; i++) sim.step();
  assert.equal(enemy.defeated, undefined);
  assert.ok(enemy.supportedY < -5);
  assert.equal(sim.world.getRigidBody(enemy.handle).isEnabled(), true);
  sim.dispose();
});

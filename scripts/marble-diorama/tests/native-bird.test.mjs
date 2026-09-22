import test from "node:test";
import assert from "node:assert/strict";
import {
  BIRD_LANES,
  BIRD_ANIMATIONS,
  createBirdSequence,
  birdCameraTransition,
  spawnNativeBirds,
  contactNativeBird,
  stepBirdSequence,
  advanceBirdSequence,
} from "../src/native-bird.mjs";

const step = (s, count, height, random = () => 0) => {
  for (let i = 0; i < count; i++) stepBirdSequence(s, height, random);
};

test("original five lanes fill in order, on eighth updates only", () => {
  const s = createBirdSequence();
  birdCameraTransition(s, [28, 27]);
  step(s, 7);
  assert.equal(s.slots.filter((b) => b.loaded).length, 0);
  step(s, 1);
  assert.deepEqual(
    s.slots.filter((b) => b.loaded).map((b) => [b.x, b.z]),
    [
      [460, 508],
      [444, 508],
    ],
  );
  step(s, 8);
  assert.deepEqual(
    s.slots.filter((b) => b.loaded).map((b) => b.lane),
    [0, 1, 2, 3],
  );
  step(s, 8);
  assert.equal(s.slots.filter((b) => b.loaded).length, 5);
  assert.deepEqual(
    s.slots.slice(0, 5).map((b) => b.x),
    BIRD_LANES.map(([x]) => x * 8 + 4),
  );
  assert.ok(s.slots.slice(0, 5).every((b) => b.height === 16344));
});

test("follower allocation waits four cells and respects the ten-slot pool", () => {
  const s = createBirdSequence();
  for (let i = 0; i < 3; i++) spawnNativeBirds(s);
  assert.equal(s.slots.filter((b) => b.loaded).length, 5);
  s.slots[0].z = 480; // Floor row 60: three cells of clearance.
  spawnNativeBirds(s);
  assert.equal(s.slots.filter((b) => b.loaded).length, 5);
  s.slots[0].z = 479.999; // Floor row 59: four cells.
  spawnNativeBirds(s);
  assert.equal(s.slots[5].lane, 0);
  for (const b of s.slots.slice(1, 5)) b.z -= 32;
  for (let i = 0; i < 6; i++) spawnNativeBirds(s);
  assert.equal(s.slots.filter((b) => b.loaded).length, 10);
  for (let lane = 0; lane < 5; lane++)
    assert.equal(s.slots.filter((b) => b.loaded && b.lane === lane).length, 2);
});

test("emergence holds position for 15 updates, then fly speed and cadence alternate", () => {
  const s = createBirdSequence();
  spawnNativeBirds(s);
  const b = s.slots[0];
  step(s, 15);
  assert.deepEqual([b.mode, b.frame, b.z], ["emerge", 1, 508]);
  step(s, 1);
  assert.deepEqual(
    [b.mode, b.z, b.vz, b.divider, b.cooldown],
    ["fly", 506, -2, 4, 1],
  );
  step(s, 8);
  assert.deepEqual([b.z, b.vz, b.divider, b.cooldown], [488, -4, 1, 4]);
  step(s, 8);
  assert.deepEqual([b.z, b.vz, b.divider, b.cooldown], [458, -2, 4, 1]);
});

test("a bird ahead prevents fast flight; cooldown counts complete wing cycles", () => {
  const s = createBirdSequence();
  spawnNativeBirds(s);
  step(s, 16, undefined, () => 1);
  const b = s.slots[0];
  assert.equal(b.cooldown, 2);
  step(s, 8, undefined, () => 1);
  assert.equal(b.cooldown, 1);
  assert.equal(b.vz, -2);
  const ahead = s.slots[1];
  ahead.x = b.x;
  ahead.z = b.z - 20;
  step(s, 8, undefined, () => 1);
  assert.equal(b.vz, -2);
  assert.equal(b.divider, 4);
  assert.equal(b.cooldown, 2);
  ahead.loaded = false;
  step(s, 16, undefined, () => 1);
  assert.equal(b.vz, -4);
  assert.equal(b.cooldown, 5);
});

test("leaving the camera band stops new birds while existing birds continue", () => {
  const s = createBirdSequence();
  birdCameraTransition(s, [28, 27]);
  step(s, 8);
  birdCameraTransition(s, [3, 2]);
  step(s, 80);
  assert.equal(s.spawning, false);
  assert.equal(s.slots.filter((b) => b.loaded).length, 2);
  assert.ok(s.slots[0].z < 508);
  birdCameraTransition(s, [2, 3]);
  assert.equal(s.spawning, true);
  birdCameraTransition(s, [27, 28]);
  assert.equal(s.spawning, false);
});

test("terrain at flight height is clear; higher terrain starts 24-update retirement", () => {
  const s = createBirdSequence();
  spawnNativeBirds(s);
  step(s, 20, () => 16344);
  const b = s.slots[0];
  assert.equal(b.mode, "fly");
  const previousZ = b.z;
  step(s, 1, () => 16344.0001);
  assert.equal(b.animation, "wall");
  const wall = s.events.find((e) => e.slot === 0 && e.type === "bird-wall");
  assert.equal(wall.previousZ, previousZ);
  assert.equal(wall.sourceStopZ, Math.floor(previousZ / 4) * 4);
  assert.equal(b.z, wall.attemptedZ); // Reports intent; does not snap position.
  step(s, 23);
  assert.equal(b.loaded, true);
  assert.equal(b.frame, 23);
  step(s, 1);
  assert.equal(b.loaded, false);
});

test("actual-contact input starts the distinct 16-update hit sequence only once", () => {
  const s = createBirdSequence();
  spawnNativeBirds(s);
  assert.equal(contactNativeBird(s, 0, 0), false);
  step(s, 16);
  assert.equal(contactNativeBird(s, 0, 1), true);
  assert.equal(contactNativeBird(s, 0, 0), false);
  const event = s.events.find((e) => e.type === "bird-hit");
  assert.deepEqual(
    [event.player, event.sound, event.playerAnimation, event.playerCounter],
    [1, 20, 11, 102],
  );
  const z = s.slots[0].z;
  step(s, 15);
  assert.equal(s.slots[0].loaded, true);
  assert.equal(s.slots[0].frame, 3);
  assert.equal(s.slots[0].z, z);
  step(s, 1);
  assert.equal(s.slots[0].loaded, false);
});

test("snapshot continuation and source-clock batching preserve slots, choices and events", () => {
  const a = createBirdSequence(57);
  advanceBirdSequence(a, 4.5, 20, [[28, 27]]);
  const b = structuredClone(a);
  const events = advanceBirdSequence(a, 18, 20);
  const splitEvents = [];
  for (let frame = 271; frame <= 1080; frame++)
    splitEvents.push(...advanceBirdSequence(b, frame / 60, 20));
  assert.deepEqual(splitEvents, events);
  assert.deepEqual({ ...b, events: [] }, { ...a, events: [] });
  assert.ok(a.slots.every((s) => s.loaded && Number.isFinite(s.z)));
});

test("retired slots restart their emergence and retain distinct generations", () => {
  const s = createBirdSequence();
  spawnNativeBirds(s);
  step(s, 16, () => 17000);
  step(s, 24);
  assert.equal(s.slots[0].loaded, false);
  spawnNativeBirds(s);
  assert.deepEqual(
    [s.slots[0].generation, s.slots[0].mode, s.slots[0].frame, s.slots[0].z],
    [2, "emerge", 0, 508],
  );
  assert.throws(() => step(s, 16, undefined, () => 2), /random choice/);
  assert.deepEqual(
    Object.values(BIRD_ANIMATIONS).map((frames) => frames.length),
    [2, 2, 24, 4],
  );
});

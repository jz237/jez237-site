import test from "node:test";
import assert from "node:assert/strict";
import {
  createMiniatureSequence,
  miniatureCameraTransition,
  miniatureBlocked,
  miniatureFleeDirection,
  avoidMiniatureObstacles,
  stepMiniatureSequence,
  contactNativeMiniature,
  MINIATURE_FRAMES,
} from "../src/native-miniature.mjs";
const loaded = () => {
  const s = createMiniatureSequence();
  miniatureCameraTransition(s, [57, 56]);
  return s;
};

test("the recovered room has closed outer rows and known open interior cells", () => {
  assert.equal(miniatureBlocked(712, 720), true);
  assert.equal(miniatureBlocked(720, 728), false);
  assert.equal(miniatureBlocked(711.999, 728), true);
  assert.equal(miniatureBlocked(840, 728), true);
  assert.equal(miniatureBlocked(720, 832), true);
});
test("nine miniatures load in three forms; only a camera exit and reentry reset collection", () => {
  const s = loaded();
  assert.equal(s.slots.filter((x) => x.loaded).length, 9);
  assert.deepEqual(
    s.slots.map((x) => x.form),
    [
      "steelie",
      "steelie",
      "steelie",
      "acid",
      "acid",
      "acid",
      "muncher",
      "muncher",
      "muncher",
    ],
  );
  assert.ok(
    s.slots.every(
      (x) => x.height === 16238 && Number.isFinite(x.x) && Number.isFinite(x.z),
    ),
  );
  contactNativeMiniature(s, 0, 1);
  miniatureCameraTransition(s, [55, 54]);
  assert.equal(s.slots[0].mode, 2);
  miniatureCameraTransition(s, [29, 28]);
  assert.ok(s.slots.every((x) => !x.loaded));
  miniatureCameraTransition(s, [28, 29]);
  assert.ok(
    s.slots.every((x) => x.loaded && x.mode === 0 && x.generation === 2),
  );
});
test("one contact input pays the selected player and leaves a spent form", () => {
  const s = loaded();
  assert.equal(contactNativeMiniature(s, 0, 1), true);
  assert.equal(contactNativeMiniature(s, 0, 0), false);
  assert.deepEqual(
    s.events.map((e) => [e.player, e.score, e.time, e.sound]),
    [[1, 500, 3, 35]],
  );
  const x = s.slots[0].x,
    z = s.slots[0].z;
  for (let i = 0; i < 40; i++) stepMiniatureSequence(s);
  assert.equal(s.slots[0].loaded, true);
  assert.equal(s.slots[0].mode, 2);
  assert.equal(s.slots[0].animation, "steelieSpent");
  assert.deepEqual([s.slots[0].x, s.slots[0].z], [x, z]);
  contactNativeMiniature(s, 3, 0);
  contactNativeMiniature(s, 6, 1);
  assert.deepEqual(
    s.events.map((e) => e.sound),
    [36, 34],
  );
});
test("room alert checks original height, active status and surface, then retains the divider remainder", () => {
  const s = loaded();
  const b = s.slots[0];
  b.walkCounter = 0;
  b.counter = 0;
  stepMiniatureSequence(s, [{ active: true, height: 16238, surface: 0 }]);
  assert.equal(b.mode, 0);
  assert.equal(b.counter, 1);
  stepMiniatureSequence(s, [{ active: false, height: 16238, surface: 1 }]);
  assert.equal(b.counter, 2);
  stepMiniatureSequence(s, [{ active: true, height: 16238, surface: 1 }]);
  assert.equal(b.mode, 1);
  assert.equal(b.counter, 0);
  assert.equal(b.walkCounter, 1);
  stepMiniatureSequence(s, [{ active: true, height: 16239, surface: 1 }]);
  assert.equal(b.mode, 0);
  assert.equal(b.counter, 1);
});
test("flee direction follows signed source quantization and nearest-player tie order", () => {
  const s = { form: "muncher", x: 760, z: 760 };
  assert.equal(
    miniatureFleeDirection(s, [{ present: true, x: 760, z: 761 }]),
    12,
  );
  assert.equal(
    miniatureFleeDirection(s, [{ present: true, x: 760, z: 759 }]),
    8,
  );
  assert.equal(
    miniatureFleeDirection(s, [
      { present: true, x: 742, z: 760 },
      { present: true, x: 778, z: 760 },
    ]),
    0,
  );
  assert.equal(
    miniatureFleeDirection({ ...s, form: "steelie" }, [
      { present: true, x: 742, z: 742 },
    ]),
    2,
  );
  assert.equal(
    miniatureFleeDirection({ ...s, form: "steelie" }, [
      { present: true, x: 778, z: 742 },
    ]),
    6,
  );
});
test("wandering and fleeing preserve the original asymmetric clear-probe behavior", () => {
  const state = createMiniatureSequence();
  const a = {
    slot: 0,
    loaded: true,
    mode: 0,
    form: "steelie",
    x: 722,
    z: 730,
    direction: 0,
    vx: 0,
    vz: 0,
  };
  state.slots = [a];
  avoidMiniatureObstacles(state, a, false);
  assert.deepEqual([a.x, a.z, a.vx, a.vz], [726, 730, 1, 0]);
  const b = { ...a, x: 722, z: 730 };
  state.slots = [b];
  avoidMiniatureObstacles(state, b, true);
  assert.deepEqual([b.x, b.z, b.vx, b.vz], [722, 730, 1, 0]);
});
test("spent actors stop reserving space for an obstacle probe", () => {
  const state = createMiniatureSequence();
  const a = {
    slot: 0,
    loaded: true,
    mode: 0,
    form: "steelie",
    x: 722,
    z: 730,
    direction: 0,
    vx: 0,
    vz: 0,
  };
  state.slots = [a, { ...a, slot: 1, x: 728, mode: 2 }];
  avoidMiniatureObstacles(state, a, true);
  assert.equal(a.direction, 0);
  assert.equal(a.vx, 1);
});
test("snapshot continuation includes random choices, counters, spent objects and all nine actors", () => {
  const s = loaded();
  for (let i = 0; i < 400; i++) stepMiniatureSequence(s);
  contactNativeMiniature(s, 4, 0);
  const copy = structuredClone(s);
  const players = [
    { present: true, active: true, x: 770, z: 770, height: 16238, surface: 1 },
  ];
  for (let i = 0; i < 1000; i++) {
    stepMiniatureSequence(s, players);
    stepMiniatureSequence(copy, players);
  }
  assert.deepEqual(s, copy);
  assert.equal(s.slots[4].mode, 2);
});
test("invalid injected randomness cannot hang a room load", () => {
  const s = createMiniatureSequence();
  assert.throws(
    () => miniatureCameraTransition(s, [57, 56], () => 32),
    /random choice/,
  );
  const stuck = createMiniatureSequence();
  assert.throws(
    () => miniatureCameraTransition(stuck, [57, 56], () => 0),
    /Unable to place/,
  );
  assert.deepEqual(
    [
      MINIATURE_FRAMES.acidX,
      MINIATURE_FRAMES.acidNegX,
      MINIATURE_FRAMES.muncherIdle,
    ],
    [4, 8, 11],
  );
});

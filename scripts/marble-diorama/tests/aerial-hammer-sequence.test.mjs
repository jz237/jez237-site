import test from "node:test";
import assert from "node:assert/strict";
import {
  createAerialHammerSequence,
  stepAerialHammerSequence,
  aerialHammerCollisionRect,
  aerialHammerDrawRect,
  aerialHammerContact,
} from "../src/aerial-hammer-sequence.mjs";

const advance = (s, count) => {
  for (let i = 0; i < count; i++) stepAerialHammerSequence(s);
};
const start = (pattern = 0) => {
  const s = createAerialHammerSequence(pattern);
  stepAerialHammerSequence(s, { load: true });
  stepAerialHammerSequence(s, { enteredRegions: [10] });
  return s;
};

test("four original hammer placements load once and wait for region entry", () => {
  const s = createAerialHammerSequence(0);
  stepAerialHammerSequence(s, { enteredRegions: [10] });
  assert.equal(s.loaded, false);
  stepAerialHammerSequence(s, { load: true });
  assert.deepEqual(
    s.actors.map((a) => [a.x, a.z, a.height]),
    [
      [840, 864, 16228],
      [840, 848, 16228],
      [840, 832, 16228],
      [840, 816, 16228],
    ],
  );
  advance(s, 500);
  assert.ok(
    s.actors.every((a) => a.status === "region" && a.drawnImage === null),
  );
  stepAerialHammerSequence(s, { enteredRegions: [9, 11] });
  assert.ok(s.actors.every((a) => a.status === "region"));
  stepAerialHammerSequence(s, { enteredRegions: [10] });
  advance(s, 4);
  const before = structuredClone(s.actors);
  stepAerialHammerSequence(s, { load: true });
  assert.equal(s.actors[1].frame, before[1].frame);
  assert.equal(s.actors[0].remaining, before[0].remaining - 1);
});

test("four recovered patterns retain their distinct initial stagger and loop waits", () => {
  const expected = [
    [30, 0, 30, 0],
    [0, 30, 60, 0],
    [90, 60, 30, 0],
    [0, 90, 30, 60],
  ];
  for (let pattern = 0; pattern < 4; pattern++) {
    const s = start(pattern),
      begins = Array(4).fill(null);
    for (let t = 0; t <= 90; t++) {
      s.actors.forEach((a, i) => {
        if (a.status === "animate" && begins[i] === null) begins[i] = t;
      });
      stepAerialHammerSequence(s);
    }
    assert.deepEqual(begins, expected[pattern]);
    const period = 32 + (pattern === 0 ? 60 : 90);
    const loop = start(pattern);
    advance(loop, 100);
    const first = loop.actors.map((a) => [
      a.status,
      a.remaining,
      a.frame,
      a.divider,
      a.drawnImage,
    ]);
    advance(loop, period);
    const second = loop.actors.map((a) => [
      a.status,
      a.remaining,
      a.frame,
      a.divider,
      a.drawnImage,
    ]);
    assert.deepEqual(second, first);
  }
});

test("graphics writes lag the collision frame pointer and final wait disables contact", () => {
  const s = start(),
    a = s.actors[1];
  assert.equal(a.drawnImage, null);
  assert.deepEqual(aerialHammerCollisionRect(a), [837, 845, 851, 859]);
  advance(s, 6);
  assert.equal(a.drawnImage, 33);
  assert.deepEqual(aerialHammerDrawRect(a), [0, 0, 8, 8]);
  assert.deepEqual(aerialHammerCollisionRect(a), [835, 845, 851, 859]);
  advance(s, 10);
  assert.equal(a.drawnImage, 37);
  assert.deepEqual(aerialHammerCollisionRect(a), [829, 845, 851, 859]);
  advance(s, 14);
  assert.equal(a.drawnImage, 31);
  // Frame 40 still has the source's three-unit margin before the wait begins.
  assert.deepEqual(aerialHammerCollisionRect(a), [837, 845, 843, 851]);
  advance(s, 2);
  assert.equal(a.drawnImage, 40);
  assert.equal(aerialHammerCollisionRect(a), null);
  advance(s, 59);
  assert.equal(aerialHammerCollisionRect(a), null);
  advance(s, 1);
  assert.equal(a.status, "animate");
  assert.equal(a.drawnImage, 40);
});

test("new entrants block while a marble caught inside an expanding face is struck", () => {
  const s = start(),
    a = s.actors[1];
  const inside = { x: 840, z: 850 },
    outside = { x: 830, z: 850 };
  assert.equal(aerialHammerContact(a, outside, inside), "block");
  assert.equal(aerialHammerContact(a, inside, inside), "strike");
  assert.equal(aerialHammerContact(a, inside, outside), null);
  assert.equal(aerialHammerContact(a, inside, { x: 837, z: 850 }), null);
  assert.equal(aerialHammerContact(a, inside, { x: 851, z: 850 }), "strike");
  assert.equal(aerialHammerContact(a, inside, { x: 840, z: 845 }), null);
  assert.equal(aerialHammerContact(a, inside, { x: 840, z: 859 }), "strike");
  advance(s, 16);
  assert.equal(aerialHammerContact(a, outside, outside), "strike");
  advance(s, 16);
  assert.equal(aerialHammerContact(a, inside, inside), null);
});

test("snapshot continuation and unloading preserve lifecycle independently for all four actors", () => {
  const s = start(3);
  advance(s, 111);
  const restored = structuredClone(s);
  for (let i = 0; i < 900; i++) {
    stepAerialHammerSequence(s);
    stepAerialHammerSequence(restored);
    assert.deepEqual(restored, s);
  }
  stepAerialHammerSequence(s, { unload: true });
  assert.deepEqual(s.actors, []);
  advance(s, 100);
  stepAerialHammerSequence(s, { load: true });
  assert.ok(
    s.actors.every((a) => a.status === "region" && a.drawnImage === null),
  );
  assert.throws(() => createAerialHammerSequence(4));
  assert.throws(() => createAerialHammerSequence(-1));
  assert.throws(() => createAerialHammerSequence(0.5));
});

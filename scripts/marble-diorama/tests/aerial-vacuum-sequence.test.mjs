import test from "node:test";
import assert from "node:assert/strict";
import {
  AERIAL_VACUUMS,
  createAerialVacuumSequence,
  stepAerialVacuumSequence,
  aerialVacuumDeployment,
  aerialVacuumInteraction,
} from "../src/aerial-vacuum-sequence.mjs";

const advance = (s, n, players) => {
  for (let i = 0; i < n; i++) stepAerialVacuumSequence(s, { players });
};
const start = (region = 30) => {
  const s = createAerialVacuumSequence();
  stepAerialVacuumSequence(s, { load: true, enteredRegions: [region] });
  return s;
};
const player = (region, active = true) => ({ region, active });

test("all six source mouths wait for their own regions and complete the recovered deployment", () => {
  assert.deepEqual(
    AERIAL_VACUUMS.map((a) => [a.x / 8, a.z / 8, a.type, a.region]),
    [
      [39, 36, 11, 30],
      [47, 36, 11, 31],
      [50, 47, 13, 32],
      [33, 42, 11, 33],
      [41, 42, 11, 34],
      [44, 53, 13, 35],
    ],
  );
  for (let i = 0; i < 6; i++) {
    const s = start(30 + i),
      a = s.actors[i],
      draw = [];
    assert.ok(
      s.actors.every((v, j) => v.phase === (i === j ? "deploy" : "region")),
    );
    for (let n = 1; n <= 16; n++) {
      advance(s, 1, [player(30 + i)]);
      if (n % 2 === 0) draw.push(a.drawnImage);
    }
    assert.deepEqual(
      draw,
      a.type === 11
        ? [4, 5, 6, 6, 7, 7, 7, 7]
        : [9, 10, 11, 11, 12, 12, 12, 12],
    );
    assert.equal(a.phase, "hold");
    assert.equal(aerialVacuumDeployment(a), 1);
  }
});

test("either active marble in this region or the next keeps a mouth open", () => {
  const s = start(),
    a = s.actors[0];
  advance(s, 16, [player(31), player(0)]);
  assert.equal(a.phase, "hold");
  advance(s, 40, [player(32), player(30)]);
  assert.equal(a.phase, "hold");
  advance(s, 4, [player(32), player(30, false)]);
  assert.equal(a.phase, "retract");
  const draw = [];
  for (let n = 1; n <= 18; n++) {
    advance(s, 1, [player(32)]);
    if (n % 2 === 0) draw.push(a.drawnImage);
  }
  assert.deepEqual(draw, [7, 7, 7, 7, 6, 6, 5, 4, 20]);
  assert.equal(a.phase, "region");
  assert.equal(aerialVacuumDeployment(a), 0);
  advance(s, 100, [player(30)]);
  assert.equal(a.phase, "region");
  stepAerialVacuumSequence(s, { enteredRegions: [30], players: [player(30)] });
  assert.equal(a.phase, "deploy");
});

test("region 4 and capture retirement withdraw visible actors and permanently remove waiting actors", () => {
  const s = start();
  advance(s, 16, [player(30)]);
  stepAerialVacuumSequence(s, { retire: [0], players: [player(30)] });
  assert.equal(s.actors[0].phase, "retract");
  advance(s, 18, [player(30)]);
  assert.equal(s.actors[0].phase, "removed");
  stepAerialVacuumSequence(s, {
    enteredRegions: [30, 31],
    players: [player(31)],
  });
  assert.equal(s.actors[0].phase, "removed");
  assert.equal(s.actors[1].phase, "deploy");
  advance(s, 4, [player(31)]);
  stepAerialVacuumSequence(s, { enteredRegions: [4], players: [player(4)] });
  assert.equal(s.actors[1].phase, "retract");
  assert.ok(s.actors.slice(2).every((a) => a.phase === "removed"));
  advance(s, 18, [player(4)]);
  assert.ok(s.actors.every((a) => a.phase === "removed"));
  stepAerialVacuumSequence(s, { unload: true });
  assert.equal(s.loaded, false);
  stepAerialVacuumSequence(s, { load: true });
  assert.ok(s.actors.every((a) => a.phase === "region"));
});

test("source suction/capture boundaries, signed quantization and opposite orientation agree", () => {
  for (const i of [0, 2]) {
    const a = { ...AERIAL_VACUUMS[i], phase: "hold" },
      swap = a.type === 13;
    // Across/toward deltas are actor minus marble, matching the executable.
    const at = (across, along, height = 16300) => ({
      x: a.x - (swap ? along : across),
      z: a.z - (swap ? across : along),
      height,
    });
    const contact = (across, along) =>
      aerialVacuumInteraction(a, at(across, along), at(across, along));
    assert.equal(contact(0, -15).kind, "capture");
    assert.equal(contact(15, -10).kind, "capture");
    assert.equal(contact(16, -10).kind, "pull");
    assert.equal(contact(0, -9).kind, "pull");
    assert.equal(contact(-13, -20), null);
    assert.equal(contact(28, -20), null);
    assert.equal(contact(0, -33), null);
    assert.equal(contact(0, -32).kind, "pull");
    const force = contact(8, -28);
    assert.deepEqual(
      force,
      swap
        ? { kind: "pull", x: -0.25, z: 0 }
        : { kind: "pull", x: 0, z: -0.25 },
    );
    const diagonal = contact(-8, -28);
    assert.deepEqual(diagonal, {
      kind: "pull",
      x: -0.1817626953125,
      z: -0.1817626953125,
    });
    assert.equal(
      aerialVacuumInteraction(
        { ...a, phase: "deploy" },
        at(8, -28),
        at(8, -28),
      ),
      null,
    );
    assert.equal(
      aerialVacuumInteraction(
        { ...a, phase: "retract" },
        at(8, -28),
        at(8, -28),
      ),
      null,
    );
  }
});

test("source body classifier distinguishes block/crush and permits passage above height 16324", () => {
  for (const i of [0, 2]) {
    const a = { ...AERIAL_VACUUMS[i], phase: "hold" };
    const inside = { x: a.x, z: a.z, height: 16323 },
      outside = { x: a.x + 40, z: a.z + 40, height: 16323 };
    assert.equal(aerialVacuumInteraction(a, outside, inside).kind, "block");
    assert.equal(aerialVacuumInteraction(a, inside, inside).kind, "crush");
    assert.equal(
      aerialVacuumInteraction(a, inside, { ...inside, height: 16324 }),
      null,
    );
  }
});

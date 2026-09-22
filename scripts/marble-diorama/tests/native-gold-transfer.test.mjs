import test from "node:test";
import assert from "node:assert/strict";
import {
  GOLD_TRANSFER,
  nativeGoldTransferIntent,
  nativeGoldHousingIntent,
} from "../src/native-gold-transfer.mjs";

test("Ultimate gold inlet captures only its two by two cell window below the threshold", () => {
  let calls = 0;
  const intent = (p, loaded = true) =>
    nativeGoldTransferIntent(
      { x: 184, z: 256, height: 16351.9, vy: -2, ...p },
      {
        loaded,
        random: () => {
          calls++;
          return 1;
        },
      },
    );
  for (const x of [176, 183.99, 184, 191.99])
    for (const z of [248, 255.99, 256, 263.99])
      assert.equal(intent({ x, z }).phase, "release");
  assert.equal(calls, 16);
  for (const p of [
    { x: 175.99 },
    { x: 192 },
    { z: 247.99 },
    { z: 264 },
    { height: 16352 },
    { height: 16352.99 },
  ])
    assert.equal(intent(p), null);
  assert.equal(intent({}, false), null);
  assert.equal(calls, 16, "rejected encounters do not draw randomness");
  assert.deepEqual(intent({}), {
    phase: "release",
    branch: 0,
    destination: { x: 240, z: 256 },
    velocity: { x: 4, z: 0, y: -2 },
    motionMode: 0,
    contactType: 37,
    contactCooldown: 18,
    playerState: 3,
    stopSound: 12,
    sound: 28,
  });
});

test("gold transfer draws at release and flips an occupied choice once, even if both exits are occupied", () => {
  const player = { id: 0, x: 184, z: 256, height: 16340, vy: 0.25 };
  for (const bit of [0, 1]) {
    const selected = bit ? 0 : 1,
      exit = GOLD_TRANSFER.exits[selected];
    const choose = (actors) =>
      nativeGoldTransferIntent(player, { random: () => bit, actors });
    assert.equal(choose([]).branch, selected);
    assert.equal(choose([{ ...exit, active: true }]).branch, 1 - selected);
    assert.equal(
      choose(GOLD_TRANSFER.exits.map((e) => ({ ...e, active: true }))).branch,
      1 - selected,
    );
    assert.equal(choose([{ ...exit, active: false }]).branch, selected);
    assert.equal(choose([{ ...exit, id: 0, active: true }]).branch, selected);
    assert.equal(
      choose([{ x: exit.x + 7, z: exit.z, active: true }]).branch,
      selected,
      "strict seven-unit boundary is clear",
    );
    assert.equal(
      choose([{ x: exit.x + 6.99, z: exit.z, height: -1000, active: true }])
        .branch,
      1 - selected,
      "integer coordinates; occupancy ignores height",
    );
  }
});

test("both gold outlet housings expose the recovered form and exclusive broad-phase boundaries", () => {
  for (const subtype of [38, 39]) {
    const z = subtype === 38 ? 256 : 320;
    for (const delta of [-24, -23.5, 0, 39.99]) {
      // Integer truncation happens before the broad phase.
      const p = { x: 248 - Math.floor(delta), z };
      assert.deepEqual(nativeGoldHousingIntent(subtype, p), {
        phase: "housing",
        shape: 6,
      });
    }
    assert.equal(nativeGoldHousingIntent(subtype, { x: 248 - 40, z }), null);
    assert.equal(nativeGoldHousingIntent(subtype, { x: 248 + 25, z }), null);
    assert.equal(nativeGoldHousingIntent(subtype, { x: 248, z: z - 40 }), null);
    assert.equal(nativeGoldHousingIntent(subtype, { x: 248, z: z + 25 }), null);
    assert.equal(
      nativeGoldHousingIntent(subtype, { x: 248, z }, { loaded: false }),
      null,
    );
  }
  assert.equal(nativeGoldHousingIntent(37, { x: 248, z: 256 }), null);
});

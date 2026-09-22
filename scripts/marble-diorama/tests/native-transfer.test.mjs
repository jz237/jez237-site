import test from "node:test";
import assert from "node:assert/strict";
import {
  SILLY_TRANSFER,
  nativeTransferIntent,
  chooseNativeTransferOutlet,
  transferOutletOccupied,
} from "../src/native-transfer.mjs";

const player = { id: 0, x: 708, z: 716, height: 16244, vy: -0.375 };
test("native inlet accepts exactly its original 8 by 8 cell", () => {
  for (let x = 703; x <= 712; x++)
    for (let z = 711; z <= 720; z++) {
      const intent = nativeTransferIntent({ ...player, x, z });
      assert.equal(Boolean(intent), x >= 704 && x < 712 && z >= 712 && z < 720);
    }
  assert.ok(nativeTransferIntent({ ...player, x: 711.999, z: 719.999 }));
  assert.equal(nativeTransferIntent(player, { loaded: false }), null);
});
test("native lift preserves the source threshold, kick and velocity increment", () => {
  for (const height of [16243.999, 16244, 16244.999, 16245, 16276.999]) {
    const p = { ...player, height },
      before = structuredClone(p);
    const result = nativeTransferIntent(p, {
      random: () => assert.fail("early RNG"),
    });
    assert.deepEqual(p, before, "intent cannot reposition the actual player");
    assert.equal(result.phase, "lift");
    assert.equal(
      result.sourceHeightNudge,
      Math.floor(height) === 16244 ? 2 : 0,
    );
    assert.deepEqual(result.velocity, { x: 0, z: 0, y: 3 / 16 });
    assert.equal(result.motionMode, 2);
  }
});
test("native release chooses once per handler call and retains vertical velocity", () => {
  for (const bit of [0, 1]) {
    let calls = 0;
    const result = nativeTransferIntent(
      { ...player, height: 16277, vy: 2.25 },
      {
        random: () => {
          calls++;
          return bit;
        },
      },
    );
    assert.equal(calls, 1);
    assert.deepEqual(result, {
      phase: "release",
      branch: bit,
      destination: { x: bit ? 732 : 684, z: 688 },
      velocity: { x: 0, z: -4, y: 2.25 },
      motionMode: 0,
      contactCooldown: 18,
      contactType: 34,
      playerState: 3,
      sound: 37,
    });
  }
});
test("native outlet clearance uses integer octagonal distance and ignores height", () => {
  const exit = SILLY_TRANSFER.exits[0];
  for (let dx = -33; dx <= 33; dx++)
    for (let dz = -33; dz <= 33; dz++) {
      const actor = {
        id: 1,
        active: true,
        x: exit.x + dx,
        z: exit.z + dz,
        height: -999,
      };
      assert.equal(
        transferOutletOccupied(exit, [actor], 0),
        Math.max(Math.abs(dx), Math.abs(dz)) +
          0.375 * Math.min(Math.abs(dx), Math.abs(dz)) <
          7,
      );
    }
  assert.equal(
    transferOutletOccupied(exit, [
      { active: true, x: exit.x + 6.99, z: exit.z },
    ]),
    true,
  );
  assert.equal(
    transferOutletOccupied(exit, [{ active: true, x: exit.x + 7, z: exit.z }]),
    false,
  );
  assert.equal(
    transferOutletOccupied(exit, [{ id: 0, active: true, ...exit }], 0),
    false,
  );
  assert.equal(
    transferOutletOccupied(exit, [{ id: 1, active: false, ...exit }], 0),
    false,
  );
});
test("blocked outlet switches even when both outlets are occupied", () => {
  for (const bit of [0, 1]) {
    const selected = { id: 1, active: true, ...SILLY_TRANSFER.exits[bit] };
    assert.equal(chooseNativeTransferOutlet(bit), bit);
    assert.equal(chooseNativeTransferOutlet(bit, [selected], 0), 1 - bit);
    assert.equal(
      chooseNativeTransferOutlet(
        bit,
        SILLY_TRANSFER.exits.map((v, i) => ({ ...v, id: i + 1, active: true })),
        0,
      ),
      1 - bit,
    );
  }
});

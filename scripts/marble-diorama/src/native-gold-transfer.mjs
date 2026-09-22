import { transferOutletOccupied } from "./native-transfer.mjs";

// Ultimate's gold inlet is source actor 37 (0x1774c), not a catapult.
// This module describes source decisions; destinations must never be assigned
// to active Rapier bodies. A continuous physical passage is still required.
export const GOLD_TRANSFER = Object.freeze({
  inlet: Object.freeze({ x: 23, z: 32, height: 16384 }),
  cameraBand: Object.freeze([0, 12]),
  releaseBelow: 16352,
  exits: Object.freeze([
    Object.freeze({ x: 240, z: 256 }),
    Object.freeze({ x: 240, z: 320 }),
  ]),
  exitVelocity: Object.freeze({ x: 4, z: 0 }),
});
const word = (n) => (Math.floor(n) << 16) >> 16;

export function nativeGoldTransferIntent(
  player,
  { loaded = true, random = () => 0, actors = [] } = {},
) {
  if (!loaded) return null;
  const dx = GOLD_TRANSFER.inlet.x - Math.floor(word(player.x) / 8);
  const dz = GOLD_TRANSFER.inlet.z - Math.floor(word(player.z) / 8);
  if (
    dx < 0 ||
    dx > 1 ||
    dz < 0 ||
    dz > 1 ||
    word(player.height) >= GOLD_TRANSFER.releaseBelow
  )
    return null;
  // Unlike Silly, nonzero RNG chooses the first outlet. Only the initially
  // selected outlet is checked; an occupied result flips once unconditionally.
  let branch = random() ? 0 : 1;
  if (transferOutletOccupied(GOLD_TRANSFER.exits[branch], actors, player.id))
    branch = 1 - branch;
  return {
    phase: "release",
    branch,
    destination: { ...GOLD_TRANSFER.exits[branch] },
    velocity: { ...GOLD_TRANSFER.exitVelocity, y: player.vy },
    motionMode: 0,
    contactType: 37,
    contactCooldown: 18,
    playerState: 3,
    stopSound: 12,
    sound: 28,
  };
}

// Housing 38/39 uses collision form 6. Broad phase only: the source form's
// plane tests decide actual contact, so this must not be used as a solid box.
export function nativeGoldHousingIntent(
  subtype,
  player,
  { loaded = true } = {},
) {
  if (!loaded || (subtype !== 38 && subtype !== 39)) return null;
  const dx = 248 - word(player.x),
    dz = (subtype === 38 ? 256 : 320) - word(player.z);
  return dx >= -24 && dx < 40 && dz >= -24 && dz < 40
    ? { phase: "housing", shape: 6 }
    : null;
}

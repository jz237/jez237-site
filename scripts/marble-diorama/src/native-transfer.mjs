// Silly actor 34, 0x175dc–0x17708. Source-coordinate decisions only: the
// physical adapter must carry the sphere through its visible bore continuously.
export const SILLY_TRANSFER = Object.freeze({
  inletCell: Object.freeze({ x: 88, z: 89 }),
  floorHeight: 16244,
  releaseHeight: 16276,
  liftVelocityStep: 9 / 16,
  exits: Object.freeze([
    Object.freeze({ x: 684, z: 688 }),
    Object.freeze({ x: 732, z: 688 }),
  ]),
  exitVelocity: Object.freeze({ x: 0, z: -4 }),
  exitSound: 37,
  contactCooldown: 18,
});
const word = (n) => (Math.floor(n) << 16) >> 16;

export function validateNativeTransfers(course) {
  const parts = course.parts.filter((p) => p.nativeTransfer !== undefined);
  if (!parts.length) return;
  if (
    parts.length !== 1 ||
    parts[0].nativeTransfer !== true ||
    parts[0].kind !== "tube" ||
    !parts[0].fork ||
    !parts[0].flowSpeed ||
    parts[0].motion ||
    !course.nativeCamera?.reverse ||
    course.nativeDynamics?.rate !== course.nativeCamera.rate
  )
    throw Error(
      "Native Silly transfer needs one powered fork and native dynamics.",
    );
}

// 0x15fc8: active players (except self), then the two creature pools. Height
// is deliberately absent. The original uses this octagonal planar distance,
// not a 3D sphere. Strict inequality: exactly seven source units is clear.
export function transferOutletOccupied(exit, actors, selfId) {
  return actors.some((actor) => {
    if (!actor.active || (selfId !== undefined && actor.id === selfId))
      return false;
    const dx = Math.abs(word(actor.x) - exit.x),
      dz = Math.abs(word(actor.z) - exit.z);
    if (dx >= 32 || dz >= 32) return false;
    return 16 * Math.max(dx, dz) + 6 * Math.min(dx, dz) < 112;
  });
}

// Randomness is requested at release, never at entry. If the selected outlet
// is blocked the original chooses the other without checking it a second time.
export function chooseNativeTransferOutlet(randomBit, actors = [], selfId) {
  let branch = randomBit ? 1 : 0;
  if (transferOutletOccupied(SILLY_TRANSFER.exits[branch], actors, selfId))
    branch = 1 - branch;
  return branch;
}

export function nativeTransferIntent(
  player,
  { loaded = true, random = () => 0, actors = [] } = {},
) {
  if (
    !loaded ||
    Math.floor(word(player.x) / 8) !== SILLY_TRANSFER.inletCell.x ||
    Math.floor(word(player.z) / 8) !== SILLY_TRANSFER.inletCell.z
  )
    return null;
  const height = word(player.height);
  if (height <= SILLY_TRANSFER.releaseHeight)
    return {
      phase: "lift",
      // The source nudges height by two at this exact integer height. Expose
      // it as evidence; never apply it as a 3D body translation.
      sourceHeightNudge: height === SILLY_TRANSFER.floorHeight ? 2 : 0,
      velocity: { x: 0, z: 0, y: player.vy + SILLY_TRANSFER.liftVelocityStep },
      motionMode: 2,
    };
  const branch = chooseNativeTransferOutlet(random(), actors, player.id);
  return {
    phase: "release",
    branch,
    destination: { ...SILLY_TRANSFER.exits[branch] },
    // Original code retains vertical velocity and queries floor at destination.
    velocity: { ...SILLY_TRANSFER.exitVelocity, y: player.vy },
    motionMode: 0,
    contactCooldown: SILLY_TRANSFER.contactCooldown,
    contactType: 34,
    playerState: 3,
    sound: SILLY_TRANSFER.exitSound,
  };
}

import { transferOutletOccupied } from "./native-transfer.mjs";

// Original pipe handlers 0x17192 (18), 0x172e6 (19/20), 0x17464 (32).
// Decisions only. Source destination assignments must never move Rapier bodies.
const configurations = {
  18: {
    x: 64,
    z: 78,
    minimum: 16192,
    housing: 16248,
    release: 16224,
    exit: { x: 524, z: 612 },
    occupied: { x: 516, z: 612 },
    velocity: { x: 4, z: 0 },
  },
  19: {
    x: 81,
    z: 86,
    exit: { x: 668, z: 740 },
    occupied: { x: 668, z: 732 },
    velocity: { x: 0, z: 4 },
  },
  20: {
    x: 87,
    z: 86,
    exit: { x: 668, z: 740 },
    occupied: { x: 668, z: 732 },
    velocity: { x: 0, z: 4 },
  },
  32: {
    x: 78,
    z: 82,
    minimum: 16256,
    housing: 16304,
    release: 16288,
    exit: { x: 620, z: 596 },
    occupied: { x: 620, z: 604 },
    velocity: { x: 0, z: -4 },
  },
};
const word = (value) => (Math.floor(value) << 16) >> 16;

export function nativePipeIntent(
  subtype,
  player,
  { loaded = true, actors = [], isPlayer = true } = {},
) {
  const config = configurations[subtype];
  if (!loaded || !config) return null;
  const x = word(player.x),
    z = word(player.z),
    height = word(player.height);
  const dx = config.x - Math.floor(x / 8),
    dz = config.z - Math.floor(z / 8);
  let contact = null;
  if (subtype === 18 || subtype === 32) {
    if (dx < -2 || dx >= 3 || dz < -1 || dz >= 5 || height <= config.minimum)
      return null;
    if (dx >= 0 && dx < 3 && dz >= 0 && dz < 4)
      contact = { type: subtype, cooldown: 255 };
    if (height >= config.housing)
      return { phase: "housing", shape: 0, contact };
    if (dx < 0) return contact ? { phase: "contact", contact } : null;
    if (height >= config.release)
      return { phase: "hold", velocity: { x: 0, z: 0, y: player.vy }, contact };
    if (subtype === 18 && !isPlayer) return { phase: "destroy", contact };
  } else {
    const localX = config.x * 8 - x,
      localZ = config.z * 8 - z;
    if (localX < -24 || localX >= 32 || localZ < -16 || localZ >= 24)
      return null;
    if (dz !== 0 || dx < 0 || dx >= 3)
      return { phase: "housing", shape: 2, contact: null };
    contact = { type: subtype, cooldown: 18 };
  }
  const occupied = transferOutletOccupied(config.exit, actors, player.id);
  return {
    phase: "release",
    destination: { ...(occupied ? config.occupied : config.exit) },
    velocity: { ...config.velocity, y: player.vy },
    motionMode: subtype === 18 || subtype === 32 ? 0 : player.motionMode,
    contact: {
      type: subtype === 18 ? (contact?.type ?? player.contactType) : subtype,
      cooldown: 18,
    },
    sound: 28,
  };
}

export function validateNativePipes(course) {
  for (const part of course.parts.filter((p) => p.nativePipe !== undefined)) {
    const upper = part.nativePipe === "beginner-upper";
    const lower = part.nativePipe === "beginner-lower";
    const orange = part.nativePipe === "intermediate-orange";
    const gold = part.nativePipe === "ultimate-gold";
    const terrain = course.parts.find(
      (p) => p.id === course.nativeCamera?.partId,
    );
    const exitSpeed = 4 * (terrain?.cellSize / 8) * course.nativeCamera?.rate;
    if (
      (!upper && !lower && !orange && !gold) ||
      part.kind !== "tube" ||
      !part.flowSpeed ||
      part.motion ||
      !course.nativeCamera ||
      course.nativeCamera.reverse ||
      course.nativeDynamics?.rate !== course.nativeCamera.rate ||
      !Number.isFinite(exitSpeed) ||
      Math.abs(part.flowSpeed - exitSpeed) > 1e-8 ||
      Math.abs((part.flowExitSpeed ?? part.flowSpeed) - exitSpeed) > 1e-8 ||
      ((upper || orange) && part.fork) ||
      (lower && !part.fork?.merge) ||
      (gold && (!part.fork || part.fork.merge)) ||
      part.nativeTransfer
    )
      throw Error(
        "Native pipes need a stationary single tube, merging lower tube or branching gold tube and native dynamics.",
      );
  }
}

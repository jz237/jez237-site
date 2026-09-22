import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

export const AERIAL_PADDLE = Object.freeze({
  x: 63 * 8,
  z: 70 * 8,
  height: 16276,
});
const RAISE = [22, 23, 24, 26];
const LOWER = [24, 23, 22, 21, 22];

export function createPaddleSequence() {
  return {
    tick: 0,
    loaded: false,
    phase: "idle",
    counter: 0,
    frame: 0,
    image: 22,
    previousImage: 22,
    player: null,
    launched: false,
  };
}

// Original actor 0x1e4e and contact continuation 0x1e66. Counts are original
// updates, independent of rendering and the configurable wall-clock rate.
export function stepPaddleSequence(s, input = {}) {
  s.tick++;
  s.launched = false;
  s.previousImage = s.image;
  if (input.unload) {
    s.loaded = false;
    s.phase = "idle";
    s.player = null;
    s.image = s.previousImage = 22;
  }
  if (input.load && !s.loaded) {
    s.loaded = true;
    s.phase = "idle";
    s.counter = s.frame = 0;
    s.image = s.previousImage = 22;
  }
  if (!s.loaded) return s;
  if (s.phase === "idle") {
    if (input.player !== undefined && input.player !== null) {
      s.player = input.player;
      s.phase = "delay";
      s.counter = 15;
    }
  } else if (s.phase === "delay") {
    if (--s.counter === 0) {
      s.phase = "raise";
      s.frame = 0;
      s.launched = true;
    }
  } else if (s.phase === "raise") {
    s.image = RAISE[s.frame++];
    if (s.frame === RAISE.length) {
      s.phase = "hold";
      s.counter = 10;
    }
  } else if (s.phase === "hold") {
    if (--s.counter === 0) {
      s.image = 25;
      s.phase = "lower";
      s.frame = 0;
    }
  } else if (s.phase === "lower") {
    s.image = LOWER[s.frame++];
    if (s.frame === LOWER.length) s.phase = "idle";
  }
  return s;
}

// Source launch law. The diorama applies its velocity through a spring impulse
// at the physical cup; it does not teleport to these source coordinates.
export function sourcePaddleLaunch(randomX, randomZ) {
  if (
    !Number.isInteger(randomX) ||
    randomX < 0 ||
    randomX >= 0x2000 ||
    !Number.isInteger(randomZ) ||
    randomZ < 0 ||
    randomZ >= 0xa000
  )
    throw Error("Paddle random samples are outside their original ranges.");
  return {
    position: {
      x: AERIAL_PADDLE.x,
      z: AERIAL_PADDLE.z,
      height: AERIAL_PADDLE.height - 3,
    },
    velocity: {
      x: (randomX - 0x1000) / 65536,
      z: (-0x25000 - randomZ) / 65536,
      up: 10,
    },
    delay: 15,
  };
}

export function validateAerialPaddle(course, finite) {
  const c = course.paddleSequence;
  const parts = course.parts.filter((p) => p.motion?.axis === "native-paddle");
  if (!c) {
    if (parts.length) throw Error("Native paddle needs a sequence.");
    return;
  }
  if (
    !course.nativeCamera ||
    !course.nativeDynamics ||
    course.nativeDynamics.rate !== c.rate ||
    parts.length !== 1 ||
    parts[0].id !== c.part ||
    !finite(c.rate) ||
    c.rate < 1 ||
    c.rate > 120 ||
    !Array.isArray(c.activationBand) ||
    c.activationBand.length !== 2 ||
    !c.activationBand.every(
      (n) => Number.isInteger(n) && n >= -128 && n <= 127,
    ) ||
    c.activationBand[0] > c.activationBand[1] ||
    parts[0].presence
  )
    throw Error("Invalid native paddle sequence.");
}

export function createAerialPaddle(course, seed = 237) {
  return course.paddleSequence
    ? {
        sequence: createPaddleSequence(),
        pendingLoad: false,
        pendingUnload: false,
        pendingPlayer: null,
        randomState: seed >>> 0 || 237,
        samples: [0, 0],
      }
    : null;
}

export function advanceAerialPaddle(course, state, time, camera) {
  if (!state) return null;
  const c = course.paddleSequence;
  for (const t of camera?.transitions ?? []) {
    if (entersCameraBand(t, c.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (leavesCameraBand(t, c.activationBand)) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  let launched = null;
  const clock = time * c.rate;
  while (state.sequence.tick < Math.floor(clock + 1e-9)) {
    stepPaddleSequence(state.sequence, {
      load: state.pendingLoad,
      unload: state.pendingUnload,
      player: state.pendingPlayer,
    });
    state.pendingLoad = state.pendingUnload = false;
    state.pendingPlayer = null;
    if (state.sequence.launched) launched = state.sequence.player;
  }
  return {
    pose: paddlePose(
      course.parts.find((p) => p.id === c.part),
      state.sequence,
      clock - Math.floor(clock + 1e-9),
    ),
    launched,
  };
}

export function queuePaddleContact(state, player) {
  if (
    !state?.sequence.loaded ||
    state.sequence.phase !== "idle" ||
    state.pendingPlayer !== null
  )
    return false;
  state.pendingPlayer = player;
  // Reproducible local variation within the source ranges. The original shared
  // hardware-seeded generator and call order remain a separate parity item.
  const random = (range) => {
    let x = state.randomState;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    state.randomState = x >>> 0;
    return state.randomState % range;
  };
  state.samples = [random(0x2000), random(0xa000)];
  return true;
}

export function paddleLaunchVelocity(course, part, state) {
  const v = sourcePaddleLaunch(...state.samples).velocity;
  const scale = course.nativeCamera.heightScale * course.nativeDynamics.rate;
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  return {
    x: (v.x * cs - v.z * sn) * scale,
    y: v.up * scale,
    z: (v.x * sn + v.z * cs) * scale,
  };
}

export function paddlePose(part, state, fraction = 0) {
  const lift = (image) =>
    ({ 21: 0, 22: 0, 23: 1 / 3, 24: 2 / 3, 25: 1, 26: 1 })[image] ?? 0;
  // Interpolate the recovered graphic levels over one native update. The same
  // continuous transform drives the mesh and the kinematic rigid body.
  const t = Math.max(0, Math.min(1, fraction));
  const amount = state
    ? lift(state.previousImage) * (1 - t) + lift(state.image) * t
    : 0;
  const pitch = -part.motion.amplitude * amount;
  const sn = Math.sin(part.angle ?? 0),
    cs = Math.cos(part.angle ?? 0);
  const along = (part.d / 2) * (Math.cos(pitch) - 1);
  return {
    position: {
      x: part.x - along * sn,
      y: part.y - (part.d / 2) * Math.sin(pitch),
      z: part.z + along * cs,
    },
    rotation: {
      x: cs * Math.sin(pitch / 2),
      y: 0,
      z: sn * Math.sin(pitch / 2),
      w: Math.cos(pitch / 2),
    },
    visible: !!state?.loaded,
  };
}

import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

// Kind 0 / subtype 5 is a finish flag, not a steelie. Its two image pairs
// repeat with divider 5; the second pole waits 8 updates (6 on Ultimate).
export function createFlagSequence(delays) {
  return { tick: 0, loaded: false, delays: [...delays], actors: [] };
}

export function stepFlagSequence(s, input = {}) {
  s.tick++;
  if (input.unload) {
    s.loaded = false;
    s.actors = [];
  }
  if (input.load && !s.loaded) {
    s.loaded = true;
    s.actors = s.delays.map((wait) => ({
      wait,
      divider: 0,
      frame: 0,
      image: null,
      previousImage: null,
    }));
    return s;
  }
  if (!s.loaded) return s;
  for (const a of s.actors) {
    a.previousImage = a.image;
    if (a.wait > 0) {
      a.wait--;
      continue;
    }
    if (++a.divider < 5) continue;
    a.divider = 0;
    a.image = a.frame * 2;
    a.frame = 1 - a.frame;
  }
  return s;
}

export function validateNativeFlags(course, finite) {
  const c = course.finishFlags;
  if (!c) return;
  if (
    !course.nativeCamera ||
    !finite(c.rate) ||
    c.rate !== course.nativeCamera.rate ||
    !Array.isArray(c.activationBand) ||
    c.activationBand.length !== 2 ||
    !c.activationBand.every(
      (n) => Number.isInteger(n) && n >= -128 && n <= 127,
    ) ||
    c.activationBand[0] > c.activationBand[1] ||
    !Array.isArray(c.poles) ||
    c.poles.length !== 2 ||
    c.poles.some(
      (p) =>
        !p ||
        ![p.x, p.y, p.z, p.height, p.width, p.angle ?? 0].every(finite) ||
        p.height <= 0 ||
        p.height > 20 ||
        p.width <= 0 ||
        p.width > 20 ||
        !Number.isInteger(p.delay) ||
        p.delay < 0 ||
        p.delay > 120,
    )
  )
    throw Error("Invalid native finish flags.");
}

export function createNativeFlags(course) {
  return course.finishFlags
    ? {
        sequence: createFlagSequence(
          course.finishFlags.poles.map((p) => p.delay),
        ),
        pendingLoad: false,
        pendingUnload: false,
      }
    : null;
}

export function advanceNativeFlags(course, state, time, camera) {
  if (!state) return;
  for (const transition of camera?.transitions ?? []) {
    if (entersCameraBand(transition, course.finishFlags.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (leavesCameraBand(transition, course.finishFlags.activationBand)) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  const target = Math.floor(time * course.finishFlags.rate + 1e-9);
  while (state.sequence.tick < target) {
    stepFlagSequence(state.sequence, {
      load: state.pendingLoad,
      unload: state.pendingUnload,
    });
    state.pendingLoad = state.pendingUnload = false;
  }
}

export function flagBlend(actor, fraction) {
  if (actor?.image === null || !actor) return null;
  const previous = actor.previousImage ?? actor.image;
  return (previous * (1 - fraction) + actor.image * fraction) / 2;
}

// Original artwork has two large checks in each direction and a drooping,
// changing free edge. This continuous miniature cloth is a 3D interpretation
// of those two poses. It is decorative, like the original non-blocking flags.
export function flagClothPoint(pole, u, v, blend) {
  const wave = Math.sin(u * Math.PI * 1.5 + blend * Math.PI) * u;
  return {
    x: u * pole.width,
    y:
      pole.height * (0.92 - v * 0.52 - u * (0.3 - blend * 0.13)) +
      wave * pole.height * 0.035 * v,
    z: wave * pole.width * 0.19,
  };
}

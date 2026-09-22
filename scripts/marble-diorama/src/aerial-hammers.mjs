import {
  createAerialHammerSequence,
  stepAerialHammerSequence,
} from "./aerial-hammer-sequence.mjs";
import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

export function validateAerialHammers(course, finite) {
  const c = course.hammerSequence;
  const parts = course.parts.filter((p) => p.profile === "hammer");
  if (!c) {
    if (parts.length) throw Error("Hammers need a shared sequence.");
    return;
  }
  if (
    !Array.isArray(c.parts) ||
    c.parts.length !== 4 ||
    new Set(c.parts).size !== 4 ||
    parts.length !== 4 ||
    c.parts.some((id) => !parts.some((p) => p.id === id)) ||
    !finite(c.rate) ||
    c.rate < 1 ||
    c.rate > 120 ||
    !Number.isInteger(c.pattern) ||
    c.pattern < 0 ||
    c.pattern > 3
  )
    throw Error("Invalid Aerial hammer sequence.");
  if (c.trigger) {
    if (
      ![c.trigger.x, c.trigger.y, c.trigger.z, c.trigger.radius].every(
        finite,
      ) ||
      c.trigger.radius <= 0 ||
      c.activationBand
    )
      throw Error("Invalid hammer approach trigger.");
  } else if (
    !course.nativeCamera ||
    !course.navigation ||
    !Array.isArray(c.activationBand) ||
    c.activationBand.length !== 2 ||
    !c.activationBand.every(
      (n) => Number.isInteger(n) && n >= -128 && n <= 127,
    ) ||
    c.activationBand[0] > c.activationBand[1]
  )
    throw Error("Native hammers need a camera loading band and navigation.");
}

export function createAerialHammers(course) {
  if (!course.hammerSequence) return null;
  return {
    sequence: createAerialHammerSequence(course.hammerSequence.pattern),
    regions: [],
    pendingLoad: !!course.hammerSequence.trigger,
    pendingUnload: false,
    pendingEntry: false,
    triggered: false,
  };
}

export function advanceAerialHammers(course, state, players, time, camera) {
  if (!state) return {};
  const c = course.hammerSequence;
  for (const transition of camera?.transitions ?? []) {
    if (c.activationBand && entersCameraBand(transition, c.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (c.activationBand && leavesCameraBand(transition, c.activationBand)) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  players.forEach((p, i) => {
    if (p.active && p.region === 10 && state.regions[i] !== 10)
      state.pendingEntry = true;
    state.regions[i] = p.region;
  });
  if (
    c.trigger &&
    !state.triggered &&
    players.some(
      (p) =>
        p.active &&
        Math.hypot(
          p.position.x - c.trigger.x,
          p.position.y - c.trigger.y,
          p.position.z - c.trigger.z,
        ) <= c.trigger.radius,
    )
  ) {
    state.pendingEntry = true;
    state.triggered = true;
  }
  const target = Math.floor(time * c.rate + 1e-9);
  while (state.sequence.tick < target) {
    stepAerialHammerSequence(state.sequence, {
      load: state.pendingLoad,
      unload: state.pendingUnload,
      enteredRegions: state.pendingEntry ? [10] : [],
    });
    state.pendingLoad = state.pendingUnload = state.pendingEntry = false;
  }
  return Object.fromEntries(
    c.parts.map((id, i) => [
      id,
      state.sequence.loaded ? state.sequence.actors[i] : null,
    ]),
  );
}

// A diorama interpretation of the orange mallet: rounded head and narrow stem.
// The recovered sprite sequence supplies its timing; 3D dimensions and pitch
// remain reconstructed. Both solids, including the empty shoulders, form the
// rendered mesh and moving trimesh collider.
export function hammerGeometry(p) {
  const vertices = [],
    indices = [],
    roles = [];
  const a = p.angle ?? 0,
    cs = Math.cos(a),
    sn = Math.sin(a);
  function solid(x0, x1, z0, z1, height, bevel) {
    const outline = [
      [x0 + bevel, z0],
      [x1 - bevel, z0],
      [x1, z0 + bevel],
      [x1, z1 - bevel],
      [x1 - bevel, z1],
      [x0 + bevel, z1],
      [x0, z1 - bevel],
      [x0, z0 + bevel],
    ];
    const base = vertices.length / 3;
    for (const y of [0, height])
      for (const [x, z] of outline)
        vertices.push(x * cs - z * sn, y, x * sn + z * cs);
    for (let i = 1; i < 7; i++) {
      indices.push(
        base,
        base + i,
        base + i + 1,
        base + 8,
        base + 8 + i + 1,
        base + 8 + i,
      );
      roles.push("side", "top");
    }
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8;
      indices.push(
        base + i,
        base + 8 + j,
        base + j,
        base + i,
        base + 8 + i,
        base + 8 + j,
      );
      roles.push("side", "side");
    }
  }
  solid(
    -p.w * 0.68,
    0,
    -p.d * 0.17,
    p.d * 0.17,
    p.h * 0.55,
    Math.min(p.d * 0.1, p.w * 0.08),
  );
  solid(
    -p.w,
    -p.w * 0.55,
    -p.d / 2,
    p.d / 2,
    p.h,
    Math.min(p.d * 0.15, p.w * 0.1),
  );
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}

export function hammerPose(p, actor) {
  const progression = {
    31: 0.12,
    32: 0.3,
    33: 0.46,
    34: 0.6,
    35: 0.68,
    36: 0.78,
    37: 0.9,
    38: 1,
    39: 0.86,
  };
  const image = actor?.drawnImage;
  const visible = image !== null && progression[image] !== undefined;
  const pitch = (-(1 - (progression[image] ?? 0)) * Math.PI) / 2;
  const a = p.angle ?? 0,
    s = Math.sin(pitch / 2);
  return {
    position: { x: p.x, y: p.y, z: p.z },
    rotation: {
      x: -Math.sin(a) * s,
      y: 0,
      z: Math.cos(a) * s,
      w: Math.cos(pitch / 2),
    },
    visible,
    image: image ?? null,
  };
}

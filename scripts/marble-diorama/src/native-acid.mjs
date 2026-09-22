import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

// Frame collision bounds recovered from the original descriptors. Original
// bitmap art is not included. Source axes use eight units per terrain cell.
export const ACID_FRAMES = Object.freeze({
  x: [
    [-1, -1, 10, 10],
    [-1, -1, 11, 10],
    [-1, -1, 13, 9],
    [0, 0, 15, 8],
    [2, 0, 14, 8],
    [4, -1, 13, 9],
    [6, -1, 11, 9],
  ],
  z: [
    [-1, -1, 10, 10],
    [-1, -1, 10, 11],
    [-1, -1, 9, 13],
    [0, 0, 8, 15],
    [0, 2, 8, 14],
    [-1, 4, 9, 13],
    [-1, 6, 9, 11],
  ],
  negZ: [
    [-1, -1, 10, 10],
    [-1, -1, 10, 10],
    [-1, -2, 9, 11],
    [-1, -2, 9, 11],
    [-1, -3, 9, 12],
    [-1, -4, 9, 13],
    [0, -5, 8, 13],
    [0, -6, 8, 14],
    [0, -7, 8, 15],
    [0, -8, 8, 15],
    [0, -8, 8, 14],
    [-1, -9, 9, 13],
    [-1, -9, 10, 11],
    [-1, -9, 10, 11],
  ],
  negX: [
    [-1, -1, 10, 10],
    [-1, -1, 10, 10],
    [-2, -1, 11, 9],
    [-2, -1, 11, 9],
    [-3, -1, 12, 9],
    [-4, -1, 13, 9],
    [-5, 0, 13, 8],
    [-6, 0, 14, 8],
    [-7, 0, 15, 8],
    [-8, 0, 15, 8],
    [-8, 0, 14, 8],
    [-9, -1, 13, 9],
    [-9, -1, 11, 10],
    [-9, -1, 11, 10],
  ],
});

export function createAcidSequence(seed = 237) {
  return {
    tick: 0,
    randomState: seed >>> 0 || 237,
    slots: Array.from({ length: 5 }, (_, slot) => ({
      slot,
      loaded: false,
      generation: 0,
    })),
  };
}

// The seeded adapter is replayable, but is not the original global RNG stream.
// An injected sample lets independent source traces use identical choices.
function choose(s, random) {
  if (random) {
    const value = random(2);
    if (value !== 0 && value !== 1) throw Error("Invalid acid random choice.");
    return value;
  }
  let x = s.randomState;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  s.randomState = x >>> 0;
  return s.randomState % 2;
}

// 0x1be4c/0x1beba: advance a reached node, then alternate preferred axes.
export function selectAcidDirection(config, s, players = []) {
  const nodes = config.routes[s.route];
  let node = nodes[s.node];
  const column = Math.floor(s.x / 8),
    row = Math.floor(s.z / 8);
  if (column === node[0] && row === node[1]) {
    s.node = node[2];
    node = nodes[s.node];
  }
  const dx = Math.sign(node[0] - column) * 8,
    dz = Math.sign(node[1] - row) * 8;
  const preferX = s.vx === 0;
  s.vx = preferX ? dx : dz ? 0 : dx;
  s.vz = preferX ? (dx ? 0 : dz) : dz;
  s.animation = s.vx > 0 ? "x" : s.vz > 0 ? "z" : s.vz < 0 ? "negZ" : "negX";
  s.frame = s.counter = 0;
  s.divider =
    s.region === 6 && players.some((p) => p.active && p.region === 6) ? 1 : 2;
}

// 0x1b7b0: allocate before unloading. A full pool stops the entry scan, but
// still reaches the unloading pass. Zero-pointer entries are not deduplicated.
export function acidCameraTransition(
  config,
  state,
  transition,
  players = [],
  heightAt = () => 0,
  random,
) {
  loading: for (const entry of config.entries) {
    if (
      entry.direct &&
      state.slots.some((s) => s.loaded && s.route === entry.choices[0][0])
    )
      continue;
    if (!entersCameraBand(transition, entry.activationBand)) continue;
    const routes = entry.choices[entry.direct ? 0 : choose(state, random)];
    for (const route of routes) {
      const s = state.slots.find((s) => !s.loaded);
      if (!s) break loading;
      const n = config.routes[route][0];
      Object.assign(s, {
        loaded: true,
        generation: s.generation + 1,
        route,
        node: 0,
        region: entry.region,
        activationBand: [...entry.activationBand],
        x: n[0] * 8,
        z: n[1] * 8,
        height: heightAt(n[0] * 8, n[1] * 8),
        vx: 0,
        vz: 0,
      });
      selectAcidDirection(config, s, players);
    }
  }
  for (const s of state.slots)
    if (s.loaded && leavesCameraBand(transition, s.activationBand))
      s.loaded = false;
}

// 0x1b670: only animation wrap advances the logical route origin. Physical
// presentation must interpolate the frame bounds, never teleport this origin.
export function stepAcidSequence(config, state, players = []) {
  state.tick++;
  for (const s of state.slots) {
    if (!s.loaded) continue;
    s.counter++;
    if (s.counter < s.divider) continue;
    s.counter = 0;
    if (s.divider > 2) s.divider = 1;
    s.frame++;
    if (s.frame === ACID_FRAMES[s.animation].length) {
      s.x += s.vx;
      s.z += s.vz;
      selectAcidDirection(config, s, players);
    }
  }
}

// Contact retains the current counter. It is a 28-count frame deadline, not
// 28 additional updates and not a change to player physical position.
export function holdAcidOnContact(slot) {
  if (slot?.loaded) slot.divider = 28;
}

export function acidFrameBounds(slot) {
  const [x, z, w, d] = ACID_FRAMES[slot.animation ?? "x"][slot.frame ?? 0];
  return { x: (slot.x ?? 0) + x + w / 2, z: (slot.z ?? 0) + z + d / 2, w, d };
}

export function validateNativeAcids(course) {
  const c = course.acidSequence;
  const zones = (course.zones ?? []).filter(
    (z) => z.nativeAcidSlot !== undefined,
  );
  const fail = () => {
    throw Error("Invalid native acid sequence.");
  };
  if (c === undefined) {
    if (zones.length) fail();
    return;
  }
  if (
    !course.nativeCamera ||
    !c ||
    !c.routes ||
    Array.isArray(c.routes) ||
    !Array.isArray(c.entries) ||
    c.entries.length > 64 ||
    zones.length !== 5
  )
    fail();
  const names = Object.keys(c.routes);
  if (!names.length || names.length > 64) fail();
  for (const nodes of Object.values(c.routes)) {
    if (!Array.isArray(nodes) || !nodes.length || nodes.length > 128) fail();
    for (const n of nodes)
      if (
        !Array.isArray(n) ||
        n.length !== 3 ||
        !n.every(Number.isSafeInteger) ||
        n[0] < -128 ||
        n[0] > 127 ||
        n[1] < -128 ||
        n[1] > 127 ||
        n[2] < 0 ||
        n[2] >= nodes.length
      )
        fail();
  }
  for (const e of c.entries) {
    if (
      !e ||
      typeof e.direct !== "boolean" ||
      !Number.isSafeInteger(e.region) ||
      e.region < 0 ||
      e.region > 255 ||
      !Array.isArray(e.activationBand) ||
      e.activationBand.length !== 2 ||
      !e.activationBand.every(
        (n) => Number.isSafeInteger(n) && n >= -128 && n <= 127,
      ) ||
      e.activationBand[0] > e.activationBand[1] ||
      !Array.isArray(e.choices) ||
      e.choices.length !== (e.direct ? 1 : 2)
    )
      fail();
    for (const choice of e.choices)
      if (
        !Array.isArray(choice) ||
        choice.length !== (e.direct || e.region === 5 ? 1 : 6) ||
        choice.some(
          (key) => typeof key !== "string" || !Object.hasOwn(c.routes, key),
        )
      )
        fail();
  }
  const slots = new Set();
  for (const z of zones) {
    if (
      z.kind !== "acid" ||
      !Number.isInteger(z.nativeAcidSlot) ||
      z.nativeAcidSlot < 0 ||
      z.nativeAcidSlot > 4 ||
      slots.has(z.nativeAcidSlot) ||
      z.motion ||
      z.patrol
    )
      fail();
    slots.add(z.nativeAcidSlot);
  }
}

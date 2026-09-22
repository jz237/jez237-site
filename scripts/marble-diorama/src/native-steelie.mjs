import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

export const STEELIE_PATROL = 0x20;
export const STEELIE_CHASE = 0x21;
export const STEELIE_ROUTE = 0x22;
export const STEELIE_RETURN = 0x23;
const fixed = (v) => Math.floor(v * 65536);
const cell = (v) => Math.floor(v / 8);
const metric = (x, z) => Math.max(x, z) + 3 * Math.floor(Math.min(x, z) / 8);
const eligible = (p, region) =>
  p.active &&
  p.region === region &&
  p.motionState !== 2 &&
  [0, 1, 5].includes(p.animationState);

export function nearestSteelieNode(nodes, position) {
  let best = 0,
    distance = 0x400;
  nodes.forEach((n, i) => {
    const d = metric(
      Math.abs(cell(position.x) - n[0]) * 16,
      Math.abs(cell(position.z) - n[1]) * 16,
    );
    if (d < distance) {
      best = i;
      distance = d;
    }
  });
  return best;
}

export function steelieNeighbor(nodes, node, target) {
  let choice = 0,
    distance = 0x800;
  nodes[node].slice(2).forEach((index, i) => {
    const n = nodes[index];
    const d = metric(
      Math.abs(cell(target.x) - n[0]) * 16,
      Math.abs(cell(target.z) - n[1]) * 16,
    );
    if (d < distance) {
      choice = i;
      distance = d;
    }
  });
  return nodes[node][choice + 2];
}

export function createSteelieState() {
  return {
    tick: 0,
    loaded: false,
    mode: STEELIE_PATROL,
    node: 0,
    target: 0,
    cooldown: -1,
    speed: 7,
    velocity: { x: 0, z: 0 },
    pendingLoad: false,
    pendingUnload: false,
    bump: false,
  };
}

// The steering update is followed by the original five-unit planar limit
// (0x14d28 / 0x14e7e). Keep integer truncation for reference comparisons.
export function steelieVelocityStep(velocity, desired) {
  let x = fixed(velocity.x),
    z = fixed(velocity.z);
  x += Math.floor((fixed(desired.x) - x) / 32);
  z += Math.floor((fixed(desired.z) - z) / 32);
  const magnitude = metric(Math.abs(x), Math.abs(z));
  if (magnitude > 5 * 65536) {
    const ratio = Math.floor((5 * 65536 * 64) / Math.floor(magnitude / 256));
    x = Math.floor((Math.floor(x / 256) * ratio) / 64);
    z = Math.floor((Math.floor(z / 256) * ratio) / 64);
  }
  return { x: x / 65536, z: z / 65536 };
}

const GROUND_DRAG = [
  512, 1024, 1792, 3072, 4096, 8192, 12288, 16384, 20480, 20480, 20480, 20480,
  20480, 20480, 20480, 20480, 20480,
];

// Original neutral-ground resistance (0x14b20, table 0x201a). Coulomb
// contact friction alone does not slow an already rolling rigid sphere.
export function steelieGroundDragStep(velocity, mode = 0) {
  const x = fixed(velocity.x),
    z = fixed(velocity.z);
  const magnitude = metric(Math.abs(x), Math.abs(z));
  const index = Math.floor(magnitude / 32768) & 15;
  const fraction = Math.floor(magnitude / 4096) & 7;
  // Mode 2 (0x14c04) is used by a slinky sliding after a marble hits it.
  const drag =
    (mode === 2 ? 4 : 1) *
    (GROUND_DRAG[index] +
      Math.floor(
        ((GROUND_DRAG[index + 1] - GROUND_DRAG[index]) * fraction) / 8,
      ));
  const denominator = Math.max(256, magnitude);
  const ratio = Math.floor(
    (Math.max(0, denominator - drag) * 64) / Math.floor(denominator / 256),
  );
  return {
    x: Math.floor((Math.floor(x / 256) * ratio) / 64) / 65536,
    z: Math.floor((Math.floor(z / 256) * ratio) / 64) / 65536,
  };
}

function returnToRoute(config, s, position) {
  s.mode = STEELIE_RETURN;
  s.node = nearestSteelieNode(config.nodes, position);
  s.speed = 7;
}

// Source 0x195f4, 0x19cd8–0x1a134 and 0x13122. Coordinates and desired
// velocity are in original world units. Rapier owns actual integration.
export function stepSteelieController(config, s, position, players) {
  if (s.bump) {
    if (s.cooldown === -1) s.cooldown = 150;
    returnToRoute(config, s, position);
    s.bump = false;
  }
  if (
    s.cooldown > 0 &&
    --s.cooldown === 0 &&
    [STEELIE_CHASE, STEELIE_ROUTE].includes(s.mode)
  )
    returnToRoute(config, s, position);
  const n = config.nodes[s.node];
  let reached = cell(position.x) === n[0] && cell(position.z) === n[1];
  if (reached && s.mode === STEELIE_RETURN) s.mode = STEELIE_PATROL;
  if (s.mode === STEELIE_RETURN)
    s.node = nearestSteelieNode(config.nodes, position);
  else {
    const before = s.mode;
    const candidates = players
      .map((p, i) => ({ ...p, index: i }))
      .filter((p) => eligible(p, config.region));
    // Both eligible players are in the same region. The farther-progressed
    // cell sum wins, with player one winning ties (0x19d62).
    let target = candidates[0];
    if (
      candidates.length === 2 &&
      cell(candidates[1].x) + cell(candidates[1].z) >
        cell(target.x) + cell(target.z)
    )
      target = candidates[1];
    if (target) {
      s.target = target.index;
      const d = metric(
        Math.floor(Math.abs(fixed(target.x) - fixed(position.x)) / 4096),
        Math.floor(Math.abs(fixed(target.z) - fixed(position.z)) / 4096),
      );
      if (
        d < 0x280 &&
        (s.cooldown !== 0 || [7, 9].includes(config.region)) &&
        position.motionState === 0
      )
        s.mode = STEELIE_CHASE;
      else s.mode = s.cooldown !== 0 ? STEELIE_ROUTE : STEELIE_PATROL;
    } else s.mode = STEELIE_PATROL;
    if (s.mode !== before) {
      if (before === STEELIE_CHASE) returnToRoute(config, s, position);
      else reached = true;
    }
    if (reached) {
      s.speed =
        s.mode === STEELIE_CHASE ? 12 : s.mode === STEELIE_ROUTE ? 8 : 7;
      if (s.mode === STEELIE_PATROL) s.node = config.nodes[s.node][2];
      else if (s.mode === STEELIE_ROUTE)
        s.node = steelieNeighbor(config.nodes, s.node, players[s.target]);
    }
  }
  const target = players[s.target];
  const node = config.nodes[s.node];
  const destination =
    s.mode === STEELIE_CHASE && target && eligible(target, config.region)
      ? target
      : { x: node[0] * 8 + 4, z: node[1] * 8 + 4 };
  const dx = fixed(destination.x) - fixed(position.x),
    dz = fixed(destination.z) - fixed(position.z);
  const distance = metric(
    Math.floor(Math.abs(dx) / 4096),
    Math.floor(Math.abs(dz) / 4096),
  );
  if (distance < 64) s.speed = 1;
  s.velocity = distance
    ? {
        x:
          Math.floor((Math.trunc(dx / distance) * (s.speed * 256)) / 16) /
          65536,
        z:
          Math.floor((Math.trunc(dz / distance) * (s.speed * 256)) / 16) /
          65536,
      }
    : { x: 0, z: 0 };
  return s;
}

export function advanceSteelieController(
  config,
  state,
  time,
  rate,
  camera,
  position,
  players,
) {
  for (const transition of camera?.transitions ?? []) {
    if (entersCameraBand(transition, config.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (
      leavesCameraBand(transition, config.unloadBand ?? config.activationBand)
    ) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  let spawned = false;
  const target = Math.floor(time * rate + 1e-9);
  while (state.tick < target) {
    state.tick++;
    if (state.pendingUnload) state.loaded = false;
    if (state.pendingLoad && !state.loaded) {
      const tick = state.tick;
      Object.assign(state, createSteelieState(), { tick, loaded: true });
      spawned = true;
    } else if (state.loaded)
      stepSteelieController(config, state, position, players);
    state.pendingLoad = state.pendingUnload = false;
  }
  return spawned;
}

export function validateNativeSteelies(course) {
  const band = (v) =>
    Array.isArray(v) &&
    v.length === 2 &&
    v.every((n) => Number.isInteger(n) && n >= -128 && n <= 127) &&
    v[0] <= v[1];
  for (const e of course.enemies ?? []) {
    if (e.nativeSteelie === undefined) continue;
    const c = e.nativeSteelie;
    if (
      !c ||
      e.kind !== "steelie" ||
      !course.nativeCamera ||
      course.nativeDynamics?.rate !== course.nativeCamera.rate ||
      !course.navigation ||
      course.nativeCamera.partId !== course.navigation.partId ||
      !Number.isInteger(c.region) ||
      c.region < 0 ||
      c.region > 127 ||
      !Array.isArray(c.activationBand) ||
      c.activationBand.length !== 2 ||
      !c.activationBand.every(
        (v) => Number.isInteger(v) && v >= -128 && v <= 127,
      ) ||
      c.activationBand[0] > c.activationBand[1] ||
      (c.unloadBand !== undefined && !band(c.unloadBand)) ||
      !Array.isArray(c.nodes) ||
      !c.nodes.length ||
      c.nodes.length > 127 ||
      c.nodes.some(
        (n) =>
          !Array.isArray(n) ||
          n.length !== 6 ||
          !n.every(Number.isInteger) ||
          n[0] < 0 ||
          n[0] > 127 ||
          n[1] < 0 ||
          n[1] > 127 ||
          n.slice(2).some((v) => v < 0 || v >= c.nodes.length),
      )
    )
      throw Error("Invalid native steelie route.");
  }
}

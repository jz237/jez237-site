import RAPIER from "@dimforge/rapier3d-compat";
import { actorShapes, ellipsoid } from "./actor-shapes.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeSteelieTerrainHeight } from "./native-steelie-physics.mjs";
import {
  MINIATURE_FRAMES,
  miniatureBlocked,
  miniatureCameraTransition,
  stepMiniatureSequence,
  contactNativeMiniature,
} from "./native-miniature.mjs";

// Newly drawn shapes use recovered animation cadence. Geometry is shared with
// contact, including the concave puddle. Spent shapes are visible but harmless.
function rotate([x, y, z], q) {
  const tx = 2 * (q.y * z - q.z * y),
    ty = 2 * (q.z * x - q.x * z),
    tz = 2 * (q.x * y - q.y * x);
  return [
    x + q.w * tx + q.y * tz - q.z * ty,
    y + q.w * ty + q.z * tx - q.x * tz,
    z + q.w * tz + q.x * ty - q.y * tx,
  ];
}
export function nativeMiniatureSolids(def, slot = {}, rotation) {
  const frames = MINIATURE_FRAMES[slot.animation] ?? 1;
  const fraction =
    ((slot.frame ?? 0) + (slot.counter ?? 0) / (slot.mode === 1 ? 1 : 3)) /
    frames;
  const base =
    def.form === "steelie"
      ? [
          ellipsoid(
            "steelie",
            "#7c8b94",
            [0, 0, 0],
            [def.radius, def.radius, def.radius],
          ),
        ]
      : actorShapes(
          { ...def, phase: 0 },
          (slot.mode === 2 ? (def.form === "muncher" ? 0.5 : 0) : fraction) *
            (def.form === "acid" ? 0.64 : 0.6),
        );
  const spent =
    slot.mode === 2
      ? slot.animation === "steelieHit"
        ? Math.min(1, fraction)
        : 1
      : 0;
  return base.map((solid) => {
    const vertices = solid.vertices.slice();
    for (let i = 0; i < vertices.length; i += 3) {
      // A rolled steelie still flattens onto the world floor, regardless of
      // its current rolling orientation. Its body never changes position.
      if (spent && rotation)
        vertices.set(rotate(vertices.slice(i, i + 3), rotation), i);
      vertices[i] *= 1 + spent * 0.6;
      vertices[i + 1] =
        (vertices[i + 1] + def.radius) * (1 - spent * 0.78) - def.radius;
      vertices[i + 2] *= 1 + spent * 0.6;
      if (spent && rotation)
        vertices.set(
          rotate(vertices.slice(i, i + 3), {
            x: -rotation.x,
            y: -rotation.y,
            z: -rotation.z,
            w: rotation.w,
          }),
          i,
        );
    }
    return {
      ...solid,
      vertices,
      dynamic: true,
      metalness: def.form === "steelie" ? 0.8 : 0.06,
    };
  });
}

function shape(solid) {
  return solid.trimesh
    ? new RAPIER.TriMesh(solid.vertices, solid.indices)
    : new RAPIER.ConvexPolyhedron(solid.vertices);
}

function allocate(sim, e, slot, space) {
  const body = sim.world.getRigidBody(e.handle);
  const candidates = [{ x: slot.x, z: slot.z }];
  // Only initial allocation may choose another clear floor position. Active
  // movement below is force-driven; no mask collider or position correction.
  for (let row = 0; row < 16; row++)
    for (let col = 0; col < 16; col++) {
      const x = 716 + col * 8,
        z = 724 + row * 8;
      if (!miniatureBlocked(x, z)) candidates.push({ x, z });
    }
  candidates.sort(
    (a, b) =>
      Math.hypot(a.x - slot.x, a.z - slot.z) -
      Math.hypot(b.x - slot.x, b.z - slot.z),
  );
  const solids = nativeMiniatureSolids(e.def, slot);
  const rotation = { x: 0, y: 0, z: 0, w: 1 };
  let position = null;
  for (const candidate of candidates) {
    const p = space.world(candidate.x, candidate.z, slot.height);
    const floor = nativeSteelieTerrainHeight(sim, p);
    if (floor === null || Math.abs(floor - p.y) > 0.01) continue;
    p.y = floor + e.def.radius + 0.005;
    const occupied = solids.some(
      (s) =>
        sim.world.intersectionWithShape(
          p,
          rotation,
          shape(s),
          undefined,
          undefined,
          undefined,
          body,
          (c) => c.isEnabled() && !c.isSensor(),
        ) !== null,
    );
    if (occupied) continue;
    position = p;
    slot.x = candidate.x;
    slot.z = candidate.z;
    break;
  }
  e.miniatureGeneration = slot.generation;
  e.miniatureUnavailable = !position;
  if (!position) return;
  e.miniatureTarget = { ...position };
  e.miniatureSpeed = 0;
  e.collected = false;
  body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
  body.setTranslation(position, true);
  body.setRotation(rotation, true);
  body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  e.previous = e.current = { position, rotation, solids };
  body.setEnabled(true);
}

export function advanceNativeMiniatures(sim, dt) {
  const state = sim.nativeMiniatures;
  if (!state) return;
  const space = slinkyCoordinates(sim.course),
    rate = space.camera.rate * sim.preset.machineSpeed;
  const actors = sim.enemies.filter(
    (e) => e.def.nativeMiniatureSlot !== undefined,
  );
  for (const transition of sim.nativeCamera.transitions)
    miniatureCameraTransition(state, transition);
  for (const e of actors) {
    const slot = state.slots[e.def.nativeMiniatureSlot];
    if (slot.loaded && e.miniatureGeneration !== slot.generation)
      allocate(sim, e, slot, space);
    e.hidden = !slot.loaded || !!e.miniatureUnavailable;
    sim.world.getRigidBody(e.handle).setEnabled(!e.hidden);
    e.previous = e.current;
  }
  const players = sim.players.map((p) => {
    const pos = sim.body(p).translation(),
      source = space.source(pos, p.radius ?? 0.55);
    const floor = nativeSteelieTerrainHeight(sim, pos);
    const height =
      p.grounded && floor !== null
        ? Math.round(space.source({ ...pos, y: floor }).height * 256) / 256
        : source.height;
    return {
      ...source,
      height,
      region: p.navigation?.region,
      active: p.status === "racing",
      present: p.status !== "waiting",
    };
  });
  while (state.tick < Math.floor(sim.tick * dt * rate + 1e-9)) {
    const before = new Map();
    for (const e of actors) {
      if (e.hidden) continue;
      const s = state.slots[e.def.nativeMiniatureSlot],
        pos = sim.world.getRigidBody(e.handle).translation();
      const actual = space.source(pos, e.def.radius);
      // Feed actual motion back into AI, so a wall cannot leave its logical
      // position running away from the visible body.
      s.x = actual.x;
      s.z = actual.z;
      before.set(e, { x: s.x, z: s.z });
    }
    stepMiniatureSequence(state, players);
    for (const e of actors) {
      if (!before.has(e)) continue;
      const s = state.slots[e.def.nativeMiniatureSlot],
        old = before.get(e);
      const distance = Math.hypot(s.x - old.x, s.z - old.z);
      if (distance > 1e-8 && s.mode !== 2) {
        e.miniatureTarget = space.world(s.x, s.z, s.height);
        const updates =
          (s.mode === 1 ? 1 : 3) *
          (s.form === "steelie" ? 1 : MINIATURE_FRAMES[s.animation]);
        e.miniatureSpeed = (distance * space.unit * rate) / updates;
      }
    }
  }
  for (const e of actors) {
    if (e.hidden) continue;
    const slot = state.slots[e.def.nativeMiniatureSlot],
      body = sim.world.getRigidBody(e.handle);
    const solids = nativeMiniatureSolids(
      e.def,
      {
        ...slot,
        counter:
          slot.counter +
          Math.max(0, Math.min(1, sim.tick * dt * rate - state.tick)),
      },
      body.rotation(),
    );
    e.current = { ...e.current, solids };
    solids.forEach((solid, i) => {
      const collider = sim.world.getCollider(e.colliders[i]);
      collider.setShape(shape(solid));
      collider.setEnabled(slot.mode !== 2);
    });
    if (slot.mode === 2) continue;
    const pos = body.translation(),
      velocity = body.linvel();
    const floor = nativeSteelieTerrainHeight(sim, pos);
    if (floor === null || Math.abs(pos.y - e.def.radius - floor) > 0.06)
      continue;
    const dx = e.miniatureTarget.x - pos.x,
      dz = e.miniatureTarget.z - pos.z;
    const distance = Math.hypot(dx, dz),
      speed = Math.min(e.miniatureSpeed, distance * 12);
    const vx = (dx / Math.max(distance, 1e-8)) * speed,
      vz = (dz / Math.max(distance, 1e-8)) * speed;
    const ex = vx - velocity.x,
      ez = vz - velocity.z;
    // Walking thrust must exceed static friction under the source gravity.
    // The bound limits acceleration; Rapier still resolves every contact.
    const scale = Math.min(1, (30 * dt) / Math.max(Math.hypot(ex, ez), 1e-8));
    body.applyImpulse(
      { x: ex * scale * body.mass(), y: 0, z: ez * scale * body.mass() },
      true,
    );
    if (e.def.form !== "steelie" && distance > 0.005) {
      const heading = Math.atan2(dx, dz),
        old = e.heading ?? heading;
      const turn = Math.atan2(Math.sin(heading - old), Math.cos(heading - old));
      e.heading = old + Math.max(-5 * dt, Math.min(5 * dt, turn));
      body.setRotation(
        { x: 0, y: Math.sin(e.heading / 2), z: 0, w: Math.cos(e.heading / 2) },
        true,
      );
    }
  }
}

export function contactPhysicalMiniature(sim, e, p) {
  const index = sim.players.indexOf(p),
    slot = e.def.nativeMiniatureSlot;
  if (!contactNativeMiniature(sim.nativeMiniatures, slot, index)) return;
  e.collected = true;
  p.score += 500;
  p.time += 3;
  sim.events.push({
    type: "collect",
    enemy: e.def.id,
    player: index,
    score: 500,
    time: 3,
    miniatureForm: e.def.form,
    sound: sim.nativeMiniatures.events.at(-1).sound,
  });
  e.colliders.forEach((h) => sim.world.getCollider(h).setEnabled(false));
  const body = sim.world.getRigidBody(e.handle);
  body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
  body.setNextKinematicTranslation(body.translation());
  body.setNextKinematicRotation(body.rotation());
}

import RAPIER from "@dimforge/rapier3d-compat";
import { sourceCameraPlayer } from "./native-camera.mjs";
import {
  advanceSteelieController,
  steelieVelocityStep,
  steelieGroundDragStep,
} from "./native-steelie.mjs";

const boardTops = new WeakMap();
const meshExtents = new WeakMap();
function highestVertex(vertices) {
  let top = -Infinity;
  for (let i = 1; i < vertices.length; i += 3) top = Math.max(top, vertices[i]);
  return top;
}
function meshExtent(vertices) {
  if (!meshExtents.has(vertices)) {
    let extent = 0;
    for (let i = 0; i < vertices.length; i += 3)
      extent = Math.max(
        extent,
        Math.hypot(vertices[i], vertices[i + 1], vertices[i + 2]),
      );
    meshExtents.set(vertices, extent);
  }
  return meshExtents.get(vertices);
}

// Query the same solids used for drawing and contact, including moving terrain.
// Casting from above finds the playable top even if the sphere has fallen below
// a closed board's underside. Other marbles and obstacle actors are excluded.
export function nativeSteelieTerrainHeight(sim, position) {
  if (!boardTops.has(sim.compiled))
    boardTops.set(
      sim.compiled,
      Math.max(...sim.compiled.statics.map((g) => highestVertex(g.vertices))),
    );
  let top = boardTops.get(sim.compiled);
  const terrainBodies = new Set();
  for (let i = 0; i < sim.movers.length; i++) {
    const m = sim.movers[i];
    if (!["terrain", "terrain-sequence"].includes(m.part.motion.axis)) continue;
    const body = sim.world.getRigidBody(m.handle);
    if (!body.isEnabled()) continue;
    terrainBodies.add(m.handle);
    // The original mesh's bounding sphere encloses any rotation; animated
    // triangles also retain their current vertex coordinates after deformation.
    const mesh = sim.compiled.moving[i];
    const vertices =
      m.current.vertices ??
      mesh.frames?.[m.current.frame]?.vertices ??
      mesh.vertices;
    top = Math.max(top, body.translation().y + meshExtent(vertices));
  }
  if (!Number.isFinite(top)) return null;
  const origin = {
    x: position.x,
    y: Math.max(top, position.y) + 1,
    z: position.z,
  };
  const hit = sim.world.castRay(
    new RAPIER.Ray(origin, { x: 0, y: -1, z: 0 }),
    Infinity,
    false,
    undefined,
    undefined,
    undefined,
    undefined,
    (collider) => {
      const parent = collider.parent();
      return (
        !collider.isSensor() && (!parent || terrainBodies.has(parent.handle))
      );
    },
  );
  return hit ? origin.y - hit.timeOfImpact : null;
}

export function nativeSteelieFallen(sim, e, grounded) {
  const position = sim.world.getRigidBody(e.handle).translation();
  const scale = sim.course.nativeCamera.heightScale;
  const terrainY = nativeSteelieTerrainHeight(sim, position);
  // Original 0x14f96: more than 16 units below the current terrain. Original
  // 0x1555e: more than 128 units below the last supported height over a void.
  // The source height is the sphere's bottom, not its Rapier center.
  return (
    (terrainY !== null &&
      terrainY - (position.y - e.def.radius) > 16 * scale) ||
    (!grounded && e.supportedY - position.y > 128 * scale)
  );
}

export function awardNativeSteelieDefeat(sim, e) {
  // Original 0x19a14 excludes absent (0) and retiring/timed-out (2) players.
  // Falling players remain active; a completed finish animation uses status 3.
  for (const [index, player] of sim.players.entries()) {
    if (!["racing", "falling", "finished"].includes(player.status)) continue;
    player.score += 1000;
    sim.events.push({
      type: "steelie-defeat",
      enemy: e.def.id,
      player: index,
      score: 1000,
    });
  }
}

export function advanceNativeSteelie(sim, e, grounded, dt) {
  const camera = sim.course.nativeCamera;
  const terrain = sim.course.parts.find((p) => p.id === camera.partId);
  const body = sim.world.getRigidBody(e.handle);
  const source = (position, radius) =>
    sourceCameraPlayer(terrain, camera, { position, active: true }, radius);
  const position = {
    ...source(body.translation(), e.def.radius),
    motionState: grounded ? 0 : 2,
  };
  const players = sim.players.map((p) => ({
    ...source(sim.body(p).translation(), p.radius ?? 0.55),
    active: p.status === "racing",
    region: p.navigation?.region,
    // Rapier's supported/falling distinction is the physical equivalent used
    // here; original player animation/capture states remain a separate audit.
    motionState: p.grounded ? 0 : 2,
    animationState: 0,
  }));
  const spawned = advanceSteelieController(
    e.def.nativeSteelie,
    e.nativeSteelie,
    sim.tick * dt * sim.preset.machineSpeed,
    camera.rate,
    sim.nativeCamera,
    position,
    players,
  );
  if (spawned) {
    body.setTranslation({ x: e.def.x, y: e.def.y, z: e.def.z }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    e.defeated = false;
    e.fallenAt = null;
    e.supportedY = e.def.y;
    e.lastContactPlayer = undefined;
    e.steelieTouch = false;
    e.previous = e.current = {
      position: { ...body.translation() },
      rotation: { ...body.rotation() },
    };
  }
  e.hidden = !e.nativeSteelie.loaded || !!e.defeated;
  body.setEnabled(!e.hidden);
  return spawned;
}

export function steerNativeSteelie(sim, e, dt) {
  const b = sim.world.getRigidBody(e.handle);
  const c = sim.course.nativeCamera;
  const part = sim.course.parts.find((p) => p.id === c.partId);
  const rate = c.rate * sim.preset.machineSpeed;
  const scale = (part.cellSize / 8) * rate;
  const v = e.nativeSteelie.velocity;
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  const current = b.linvel();
  const local = {
    x: (current.x * cs + current.z * sn) / scale,
    z: (-current.x * sn + current.z * cs) / scale,
  };
  const next = steelieGroundDragStep(steelieVelocityStep(local, v));
  const change = { x: next.x - local.x, z: next.z - local.z };
  // Source steering adds 1/32 of its velocity error per original update.
  // Apply that response through rolling torque, preserving physical impacts
  // and the rendered sphere's rotation. No position/velocity replacement.
  const gain = 1 - Math.pow(31 / 32, rate * dt);
  const impulse = 1.4 * b.mass() * e.def.radius * gain * 32 * scale;
  b.applyTorqueImpulse(
    {
      x: (change.x * sn + change.z * cs) * impulse,
      y: 0,
      z: -(change.x * cs - change.z * sn) * impulse,
    },
    true,
  );
}

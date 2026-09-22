import RAPIER from "@dimforge/rapier3d-compat";
import { sourceCameraPlayer } from "./native-camera.mjs";
import { nativeSteelieTerrainHeight } from "./native-steelie-physics.mjs";
import { advanceSlinkyController, applySlinkyBump } from "./native-slinky.mjs";
import {
  slinkySolids,
  slinkyWalkAxis,
  slinkyWalkFraction,
  interpolateSlinkySolids,
} from "./slinky-shape.mjs";

export function slinkyCoordinates(course) {
  const camera = course.nativeCamera;
  const part = course.parts.find((p) => p.id === camera.partId);
  const unit = part.cellSize / 8;
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  return {
    camera,
    part,
    unit,
    source(position, radius = 0) {
      return sourceCameraPlayer(
        part,
        camera,
        { position, active: true },
        radius,
      );
    },
    world(x, z, height) {
      const lx = (x / 8 - camera.columnOrigin) * part.cellSize - part.w / 2;
      const lz = (z / 8 - camera.rowOrigin) * part.cellSize - part.d / 2;
      return {
        x: part.x + lx * cs - lz * sn,
        y: part.y + (height - camera.heightOrigin) * camera.heightScale,
        z: part.z + lx * sn + lz * cs,
      };
    },
    velocity(v, rate) {
      return {
        x: (v.x * cs + v.z * sn) / (unit * rate),
        z: (-v.x * sn + v.z * cs) / (unit * rate),
      };
    },
    rotation: {
      x: 0,
      y: -Math.sin((part.angle ?? 0) / 2),
      z: 0,
      w: Math.cos((part.angle ?? 0) / 2),
    },
  };
}

function sourcePose(e, space) {
  const s = e.nativeSlinky;
  const axis = slinkyWalkAxis(s.animation),
    walk = 8 * slinkyWalkFraction(s);
  return {
    position: space.world(s.x + axis.x * walk, s.z + axis.z * walk, s.height),
    rotation: space.rotation,
    solids: slinkySolids(e.def.radius, s, space.unit, space.camera.heightScale),
  };
}

export function initialSlinkyPose(course, e) {
  return sourcePose(e, slinkyCoordinates(course));
}

const lerpPosition = (a, b, t) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
});

export function advanceNativeSlinky(sim, e, dt) {
  const space = slinkyCoordinates(sim.course),
    s = e.nativeSlinky;
  const body = sim.world.getRigidBody(e.handle);
  const rate = space.camera.rate * sim.preset.machineSpeed;
  const sourceTime = sim.tick * dt * rate;
  const supportingFloor = nativeSteelieTerrainHeight(sim, body.translation());
  if (supportingFloor !== null)
    e.slinkyFloorHeight = space.source({
      x: 0,
      y: supportingFloor,
      z: 0,
    }).height;
  if (s.loaded && !e.defeated && !e.slinkyFalling && supportingFloor === null) {
    // A disappeared support or a physical bump over an edge releases the
    // actual body to gravity. Never map the source's void sentinel to a pose.
    e.slinkyFalling = true;
    e.slinkyFallOriginY = body.translation().y;
    e.slinkyIntent = null;
    body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
  }
  const terrainHeight = (x, z) => {
    const height = nativeSteelieTerrainHeight(sim, space.world(x, z, 0));
    if (height === null)
      return x === s.x && z === s.z
        ? (e.slinkyFloorHeight ?? space.source(e.def).height)
        : -32768;
    // Rapier rays have float precision. Quantize both supported players and
    // terrain to the source height grid, so identical floors compare equal.
    return (
      Math.round(space.source({ x: 0, y: height, z: 0 }).height * 256) / 256
    );
  };
  const players = sim.players.map((p) => {
    const position = space.source(sim.body(p).translation(), p.radius ?? 0.55);
    const velocity = space.velocity(sim.body(p).linvel(), rate);
    return {
      ...position,
      vx: velocity.x,
      vz: velocity.z,
      height: p.grounded
        ? terrainHeight(position.x, position.z)
        : position.height,
      active: p.status === "racing",
      region: p.navigation?.region,
      motionState: p.grounded ? 0 : 2,
      animationState: 0,
    };
  });
  const old = { tick: s.tick, mode: s.mode, x: s.x, z: s.z };
  const spawned = advanceSlinkyController(
    e.def.nativeSlinky,
    s,
    sim.tick * dt * sim.preset.machineSpeed,
    space.camera.rate,
    sim.nativeCamera,
    players,
    sim.enemies
      .filter((other) => other !== e && other.nativeSlinky)
      .map((other) => other.nativeSlinky),
    terrainHeight,
  );
  if (spawned) {
    e.defeated = false;
    e.slinkyFalling = false;
    body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }
  if (
    e.slinkyFalling &&
    body.translation().y < e.slinkyFallOriginY - 128 * space.camera.heightScale
  )
    e.defeated = true;
  e.hidden = !s.loaded || !!e.defeated;
  body.setEnabled(!e.hidden);
  if (e.hidden || e.slinkyFalling) return;
  if (spawned) {
    e.slinkyOffset = { x: 0, y: 0, z: 0 };
    e.slinkyFrom = e.slinkyTo = sourcePose(e, space);
    e.previous = e.current = e.slinkyTo;
    e.slinkyIntent = null;
    body.setTranslation(e.current.position, true);
    body.setRotation(space.rotation, true);
  } else if (old.tick !== s.tick) {
    e.slinkyFrom = e.slinkyTo;
    const next = sourcePose(e, space);
    // The source's final -6 height is a squash frame. Express that squash in
    // the articulated body, keeping its supporting surface on the board.
    const floor = nativeSteelieTerrainHeight(sim, next.position);
    if (floor !== null) next.position.y = Math.max(floor, next.position.y);
    if ([5, 6].includes(old.mode) && s.mode === 3) {
      // Original artwork aligns its origin to the cell after an attack. Keep
      // the physical body where it was, then visibly travel back to the route.
      const before = space.world(old.x, old.z, s.height);
      const aligned = space.world(s.x, s.z, s.height);
      e.slinkyOffset.x += before.x - aligned.x;
      e.slinkyOffset.z += before.z - aligned.z;
    } else {
      const offset = e.slinkyOffset;
      const distance = Math.hypot(offset.x, offset.z);
      const fraction = distance ? Math.max(0, 1 - space.unit / distance) : 0;
      offset.x *= fraction;
      offset.z *= fraction;
    }
    next.position.x += e.slinkyOffset.x;
    next.position.z += e.slinkyOffset.z;
    e.slinkyTo = next;
  }
  for (const event of s.events) {
    if (event.type === "capture") e.slinkyIntent = { player: event.player };
    if (["release", "miss", "push"].includes(event.type)) e.slinkyIntent = null;
    // Pushes are supplied by the actual moving shell's Rapier contacts.
  }
  const fraction = Math.max(0, Math.min(1, sourceTime - s.tick));
  const pose = {
    position: lerpPosition(
      e.slinkyFrom.position,
      e.slinkyTo.position,
      fraction,
    ),
    rotation: space.rotation,
    solids: interpolateSlinkySolids(
      e.slinkyFrom.solids,
      e.slinkyTo.solids,
      fraction,
    ),
  };
  e.current = pose;
  body.setNextKinematicTranslation(pose.position);
  body.setNextKinematicRotation(pose.rotation);
  pose.solids.forEach((solid, i) =>
    sim.world
      .getCollider(e.colliders[i])
      .setShape(new RAPIER.TriMesh(solid.vertices, solid.indices)),
  );
}

// Only call for a manifold contact, never the original broad proximity box.
export function contactNativeSlinky(sim, e, p, incomingVelocity) {
  if (e.slinkyFalling) return;
  const index = sim.players.indexOf(p),
    s = e.nativeSlinky;
  if (e.slinkyIntent?.player === index && s.mode === 5) {
    e.slinkyIntent = null;
    const rate = sim.course.nativeCamera.rate * sim.preset.machineSpeed;
    sim.fall(p, {
      cause: "slinky",
      enemy: e.def.id,
      releaseTick: Math.ceil(((s.tick + 30 - s.frame) / rate) * 120 - 1e-8),
    });
    sim.events.push({ type: "slinky-capture", enemy: e.def.id, player: index });
    return;
  }
  const space = slinkyCoordinates(sim.course);
  if (
    !applySlinkyBump(
      s,
      space.velocity(
        incomingVelocity,
        space.camera.rate * sim.preset.machineSpeed,
      ),
      index,
    )
  )
    return;
  const origin = space.source(sim.world.getRigidBody(e.handle).translation());
  s.x = origin.x;
  s.z = origin.z;
  // Continue from the current physical pose after contact, including a bump
  // in the middle of an articulated step. No position reset or player rewind.
  e.slinkyFrom = e.slinkyTo = e.current;
  e.slinkyOffset = { x: 0, y: 0, z: 0 };
  sim.events.push({ type: "slinky-bump", enemy: e.def.id, player: index });
}

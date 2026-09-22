import RAPIER from "@dimforge/rapier3d-compat";
import { actorShapes } from "./actor-shapes.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { interpolateSlinkySolids } from "./slinky-shape.mjs";
import {
  birdCameraTransition,
  stepBirdSequence,
  stopNativeBird,
  contactNativeBird,
} from "./native-bird.mjs";

// Newly drawn closed solids. The recovered two-frame sequence controls wing
// cadence; retirement contracts the same body into falling feather-like pieces.
export function nativeBirdSolids(def, slot) {
  const phase = slot.frame + slot.counter / slot.divider;
  const time = slot.animation === "fly" ? phase / 2 / 3.2 : 0;
  const base = actorShapes({ ...def, phase: 0 }, time);
  let scale = 1,
    scatter = 0;
  if (slot.animation === "emerge") scale = Math.min(1, 0.25 + phase * 0.5);
  if (slot.mode === "retire") {
    const duration = slot.animation === "wall" ? 24 : 4;
    const t = Math.min(1, phase / duration);
    scale = Math.max(0.02, 1 - t);
    scatter = Math.sin(t * Math.PI) * def.radius;
  }
  return base.map((solid, index) => {
    const vertices = solid.vertices.slice();
    for (let j = 0; j < vertices.length; j += 3) {
      vertices[j] = vertices[j] * scale + Math.cos(index * 2.4) * scatter;
      vertices[j + 1] = vertices[j + 1] * scale + scatter * 0.4;
      vertices[j + 2] =
        vertices[j + 2] * scale + Math.sin(index * 2.4) * scatter;
    }
    return { ...solid, vertices, dynamic: true };
  });
}

const mix = (a, b, t) =>
  Object.fromEntries(["x", "y", "z"].map((k) => [k, a[k] + (b[k] - a[k]) * t]));
function pose(e, slot, space) {
  const position = space.world(slot.x, slot.z, slot.height);
  // The source height anchors the bird's bottom. Keep the full flapping body
  // above that anchor; this is an explicit shape origin, shared with collision.
  position.y += e.def.radius * 0.5;
  const angle = Math.PI - (space.part.angle ?? 0);
  return {
    position,
    rotation: { x: 0, y: Math.sin(angle / 2), z: 0, w: Math.cos(angle / 2) },
    solids: nativeBirdSolids(e.def, slot),
  };
}

export function advanceNativeBirds(sim, dt) {
  if (!sim.nativeBirds) return;
  const state = sim.nativeBirds,
    space = slinkyCoordinates(sim.course);
  const birds = sim.enemies.filter((e) => e.def.nativeBirdSlot !== undefined);
  for (const transition of sim.nativeCamera.transitions)
    birdCameraTransition(state, transition);
  const refresh = () => {
    for (const e of birds) {
      const slot = state.slots[e.def.nativeBirdSlot];
      if (!slot.loaded) continue;
      if (e.birdGeneration !== slot.generation) {
        e.birdGeneration = slot.generation;
        e.birdFrom = e.birdTo = pose(e, slot, space);
        e.previous = e.current = e.birdTo;
        e.birdStopped = false;
        const body = sim.world.getRigidBody(e.handle);
        // Initial allocation is the only position reset for a living bird.
        body.setTranslation(e.current.position, true);
        body.setRotation(e.current.rotation, true);
      } else {
        e.birdFrom = e.birdTo;
        e.birdTo = pose(e, slot, space);
        if (e.birdStopped) e.birdTo.position = e.current.position;
      }
    }
  };
  const time = sim.tick * dt * sim.preset.machineSpeed * space.camera.rate;
  while (state.tick < Math.floor(time + 1e-9)) {
    // Physical solid casts below replace the old center-height snap.
    stepBirdSequence(state);
    sim.events.push(...state.events);
    refresh();
  }
  const alpha = Math.max(0, Math.min(1, time - state.tick));
  const terrain = new Set(sim.staticColliderHandles);
  for (const e of birds) {
    const slot = state.slots[e.def.nativeBirdSlot],
      body = sim.world.getRigidBody(e.handle);
    e.previous = e.current;
    e.hidden = !slot.loaded;
    body.setEnabled(!e.hidden);
    if (e.hidden) continue;
    const current = {
      position: mix(e.birdFrom.position, e.birdTo.position, alpha),
      rotation: e.birdTo.rotation,
      solids: interpolateSlinkySolids(
        e.birdFrom.solids,
        e.birdTo.solids,
        alpha,
      ),
    };
    if (e.birdStopped) current.position = e.current.position;
    const before = body.translation(),
      delta = {
        x: current.position.x - before.x,
        y: current.position.y - before.y,
        z: current.position.z - before.z,
      };
    if (slot.mode === "fly" && Math.hypot(delta.x, delta.y, delta.z) > 1e-8) {
      let fraction = 1;
      for (const solid of current.solids) {
        const hit = sim.world.castShape(
          before,
          current.rotation,
          delta,
          new RAPIER.ConvexPolyhedron(solid.vertices),
          0,
          1,
          true,
          undefined,
          undefined,
          undefined,
          body,
          (c) => terrain.has(c.handle),
        );
        if (hit) fraction = Math.min(fraction, hit.time_of_impact);
      }
      if (fraction < 1) {
        current.position = mix(before, current.position, Math.max(0, fraction));
        stopNativeBird(state, slot.slot);
        sim.events.push({ type: "bird-wall", slot: slot.slot });
        e.birdStopped = true;
      }
    }
    e.current = current;
    body.setNextKinematicTranslation(current.position);
    body.setNextKinematicRotation(current.rotation);
    current.solids.forEach((solid, i) => {
      const collider = sim.world.getCollider(e.colliders[i]);
      collider.setShape(new RAPIER.ConvexPolyhedron(solid.vertices));
      collider.setEnabled(slot.mode === "fly");
    });
  }
}

export function contactPhysicalBird(sim, e, p) {
  const index = sim.players.indexOf(p),
    slot = e.def.nativeBirdSlot;
  if (!contactNativeBird(sim.nativeBirds, slot, index)) return;
  e.birdStopped = true;
  e.birdFrom.position = e.birdTo.position = e.current.position;
  e.colliders.forEach((h) => sim.world.getCollider(h).setEnabled(false));
  const rate = sim.course.nativeCamera.rate * sim.preset.machineSpeed;
  const releaseTick = Math.ceil(
    ((sim.nativeBirds.tick + 36) / rate) * 120 - 1e-8,
  );
  sim.fall(p, {
    cause: "bird",
    enemy: e.def.id,
    releaseTick,
    endTick: Math.ceil(((sim.nativeBirds.tick + 60) / rate) * 120 - 1e-8),
  });
  sim.events.push({ type: "bird-hit", player: index, enemy: e.def.id });
}

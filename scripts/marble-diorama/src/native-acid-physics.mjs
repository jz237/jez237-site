import RAPIER from "@dimforge/rapier3d-compat";
import { acidShape } from "./acid.mjs";
import {
  acidFrameBounds,
  acidCameraTransition,
  stepAcidSequence,
  ACID_FRAMES,
} from "./native-acid.mjs";
import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeSteelieTerrainHeight } from "./native-steelie-physics.mjs";

// Remove sub-float interpolation residue at terrain seams (e.g. -8e-16
// instead of zero) in the ray query only. Physical positions stay unchanged.
const terrainHeight = (sim, p) =>
  nativeSteelieTerrainHeight(sim, {
    x: Math.round(p.x * 1e7) / 1e7,
    y: p.y,
    z: Math.round(p.z * 1e7) / 1e7,
  });

// Newly drawn lobed solids use the recovered frame's footprint. Their visible
// triangles are also the contact sensor, including the concave edge notches.
export function nativeAcidShape(slot, unit) {
  const bounds = acidFrameBounds(slot);
  const phase = slot.frame / ACID_FRAMES[slot.animation].length;
  const base = acidShape({ radius: 1 }, phase * 0.64);
  const v = base.vertices.slice();
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < v.length; i += 3) {
    minX = Math.min(minX, v[i]);
    maxX = Math.max(maxX, v[i]);
    minZ = Math.min(minZ, v[i + 2]);
    maxZ = Math.max(maxZ, v[i + 2]);
  }
  for (let i = 0; i < v.length; i += 3) {
    v[i] = ((v[i] - minX) / (maxX - minX) - 0.5) * bounds.w * unit;
    v[i + 2] = ((v[i + 2] - minZ) / (maxZ - minZ) - 0.5) * bounds.d * unit;
  }
  return { vertices: v, indices: base.indices };
}

export function interpolateAcidPose(before, now, t) {
  const vertices = now.geometry.vertices.slice();
  for (let i = 0; i < vertices.length; i++)
    vertices[i] =
      before.geometry.vertices[i] +
      (vertices[i] - before.geometry.vertices[i]) * t;
  return {
    position: Object.fromEntries(
      ["x", "y", "z"].map((k) => [
        k,
        before.position[k] + (now.position[k] - before.position[k]) * t,
      ]),
    ),
    rotation: now.rotation,
    geometry: { vertices, indices: now.geometry.indices },
  };
}

// The source boxes include transparent sprite margins. A 3D puddle cannot
// float those margins over a cliff: trim radial columns to actual support,
// applying the result to both display and contact triangles. The center keeps
// following the recovered route; no player or hazard position is snapped.
export function fitAcidToTerrain(sim, current, angle = 0) {
  const floor = terrainHeight(sim, current.position);
  if (floor === null) return false;
  current.position.y = floor;
  const v = current.geometry.vertices,
    cs = Math.cos(angle),
    sn = Math.sin(angle);
  const supported = (x, z) => {
    const height = terrainHeight(sim, {
      x: current.position.x + x * cs - z * sn,
      y: floor,
      z: current.position.z + x * sn + z * cs,
    });
    return height !== null && Math.abs(height - floor) < 0.01;
  };
  for (let i = 0; i < 40; i++) {
    const outer = (40 + i) * 3,
      x = v[outer],
      z = v[outer + 2];
    if (supported(x, z)) continue;
    let lo = 0,
      hi = 1;
    for (let j = 0; j < 12; j++) {
      const mid = (lo + hi) / 2;
      if (supported(x * mid, z * mid)) lo = mid;
      else hi = mid;
    }
    for (let ring = 0; ring < 4; ring++) {
      const at = (ring * 40 + i) * 3;
      v[at] *= lo;
      v[at + 2] *= lo;
    }
  }
  return true;
}

function pose(sim, slot, space) {
  const bounds = acidFrameBounds(slot),
    position = space.world(bounds.x, bounds.z, slot.height);
  // Sample the actual board rather than retaining a sprite's fixed height over
  // a changed support. Native routes are validated separately against terrain.
  const floor = terrainHeight(sim, position);
  if (floor !== null) position.y = floor;
  return {
    position,
    rotation: space.rotation,
    geometry: nativeAcidShape(slot, space.unit),
  };
}

export function advanceNativeAcids(sim, dt) {
  if (!sim.nativeAcids) return;
  const state = sim.nativeAcids,
    config = sim.course.acidSequence,
    space = slinkyCoordinates(sim.course);
  const pools = sim.acid.filter((a) => a.zone.nativeAcidSlot !== undefined);
  const players = sim.players.map((p) => ({
    active: p.status === "racing",
    region: p.navigation?.region,
  }));
  const heightAt = (x, z) => {
    const p = space.world(x + 4, z + 4, 0),
      floor = terrainHeight(sim, p);
    return floor === null ? 0 : space.source({ ...p, y: floor }).height;
  };
  for (const transition of sim.nativeCamera.transitions)
    acidCameraTransition(config, state, transition, players, heightAt);
  const refresh = (newTick) => {
    for (const a of pools) {
      const slot = state.slots[a.zone.nativeAcidSlot];
      a.hidden = !slot.loaded;
      const collider = sim.world.getCollider(a.handle);
      collider.setEnabled(!a.hidden);
      if (a.hidden) continue;
      if (a.generation !== slot.generation) {
        a.generation = slot.generation;
        a.sourceFrom = a.sourceTo = pose(sim, slot, space);
        a.previous = a.current = a.sourceTo;
      } else if (newTick) {
        a.sourceFrom = a.sourceTo;
        a.sourceTo = pose(sim, slot, space);
      }
    }
  };
  refresh(false);
  const time = sim.tick * dt * sim.preset.machineSpeed * space.camera.rate;
  const target = Math.floor(time + 1e-9);
  while (state.tick < target) {
    stepAcidSequence(config, state, players);
    refresh(true);
  }
  const alpha = Math.max(0, Math.min(1, time - state.tick));
  for (const a of pools) {
    if (a.hidden) continue;
    a.previous = a.current;
    a.current = interpolateAcidPose(a.sourceFrom, a.sourceTo, alpha);
    a.hidden = !fitAcidToTerrain(sim, a.current, space.part.angle ?? 0);
    a.geometry = a.current.geometry;
    const collider = sim.world.getCollider(a.handle);
    collider.setEnabled(!a.hidden);
    collider.setShape(
      RAPIER.ColliderDesc.trimesh(a.geometry.vertices, a.geometry.indices)
        .shape,
    );
    collider.setTranslation(a.current.position);
    collider.setRotation(a.current.rotation);
  }
}

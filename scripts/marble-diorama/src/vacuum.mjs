import { presenceAt } from "./mechanism-time.mjs";

export function vacuumPoseAt(mouth, time) {
  const { deployment } = presenceAt(mouth, time);
  return {
    position: {
      x: mouth.x,
      y: mouth.y - mouth.h * (1 - deployment),
      z: mouth.z,
    },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
  };
}

// A linked vacuum pulls toward its actual moving intake, never an invisible
// fixed point left above the track after its nozzle has withdrawn.
export function vacuumMount(mouth, zone) {
  return {
    position: {
      x: mouth.x,
      y: mouth.y + (zone.intakeHeight ?? mouth.h / 2),
      z: mouth.z,
    },
    direction: {
      x: -Math.cos(mouth.angle ?? 0),
      y: 0,
      z: -Math.sin(mouth.angle ?? 0),
    },
  };
}

export function vacuumAt(zone, time, parts = []) {
  const mouth = zone.mouth ? parts.find((p) => p.id === zone.mouth) : null;
  const state = presenceAt(mouth ?? zone, time);
  const mount = mouth
    ? vacuumMount(mouth, zone)
    : {
        position: { x: zone.x, y: zone.y, z: zone.z },
        direction: zone.direction,
      };
  const position = { ...mount.position };
  if (mouth) position.y += vacuumPoseAt(mouth, time).position.y - mouth.y;
  const active = state.visible && (!mouth || position.y > mouth.y);
  return {
    position,
    direction: mount.direction,
    active,
    strength: active ? state.deployment : 0,
  };
}

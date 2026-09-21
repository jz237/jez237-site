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
export function vacuumAt(zone, time, parts = []) {
  const mouth = zone.mouth ? parts.find((p) => p.id === zone.mouth) : null;
  const state = presenceAt(mouth ?? zone, time);
  const position = { x: zone.x, y: zone.y, z: zone.z };
  if (mouth) {
    const pose = vacuumPoseAt(mouth, time).position;
    position.x += pose.x - mouth.x;
    position.y += pose.y - mouth.y;
    position.z += pose.z - mouth.z;
  }
  const active = state.visible && (!mouth || position.y > mouth.y);
  return { position, active, strength: active ? state.deployment : 0 };
}

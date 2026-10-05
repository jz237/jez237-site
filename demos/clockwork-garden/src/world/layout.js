import * as THREE from 'three';

// World layout (units: centimetres, y up). The hero flower stands at the
// origin in the near bed; the greenhouse path runs along -Z beside it.

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export const L = {
  flower: V(0, 0, 0),
  escapement: V(-15.5, 0.45, 12.5),
  crown: V(-1.35, 0, 1.25),
  skep: V(15.5, 0, -6.5),
  lily: V(-16, 0, -9),
  beetleStem: V(8.5, 0, 9.5),
  glassBlossom: V(-13, 0, -27),
  songbirdTree: V(-30, 0, 16),
  songbirdTreeRot: -2.3,
  pathX: [44, 96],
  house: { x0: -235, x1: 285, z0: 230, z1: -820, wall: 255, ridge: 480 },
};

// direction the root crown faces: toward the escapement
export const CROWN_FACE = Math.atan2(L.escapement.x - L.crown.x, L.escapement.z - L.crown.z);

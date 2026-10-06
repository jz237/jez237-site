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
  // the promenade (promenade.js): a pointed iron arch over the path in every
  // vault bay up to the fountain (the rose arch keeps its own bay, the fountain's
  // is left open, and the two bays beside the great bloom, where the film's last
  // shot looks down the path past its title; past the fountain the great tree stands),
  // its uprights on the curbs; springing at `spring`, apex at `apex`
  arches: { zs: [135, -150, -340, -435], x0: 42, x1: 98, spring: 96, apex: 134 },
  // the great clockwork tree where the path ends, past the fountain (greatTree.js)
  tree: { x: 70, z: -712 },
  // the orb lamps on their tall posts, between the arches
  lampSpots: [[37, -102.5], [37, -197.5], [37, -387.5], [37, -482.5], [103, 87.5], [103, -7.5], [103, -292.5], [103, -482.5]],
};

// the vault's iron columns down the beds (greenhouse.js)
export const COLUMN_XS = [-118, 168];
export function columnSpots() {
  const out = [];
  for (const x of COLUMN_XS) for (let i = 0; i < 8; i++) { const z = 150 - i * 150; if (z >= L.house.z1 + 5) out.push([x, z]); }
  return out;
}
export const COLUMN_BRACKET_Y = 150;

// the promenade's lanterns: one under each arch's apex on a short chain, and
// one on a scroll bracket at either upright, leaning over the path; and one on
// a bracket on every column of the vault, facing the path
// { p: hanging point of the lantern body, top: where its chain is fixed, sc, kind }
export function archLanterns() {
  const A = L.arches, xc = (A.x0 + A.x1) / 2;
  const out = [];
  for (const [x, z] of columnSpots()) {
    const s = Math.sign(xc - x);
    out.push({ p: new THREE.Vector3(x + s * 15, COLUMN_BRACKET_Y - 15, z), top: COLUMN_BRACKET_Y - 0.5, sc: 1.05, kind: 'column' });
  }
  for (const z of A.zs) {
    out.push({ p: new THREE.Vector3(xc, A.apex - 26, z), top: A.apex - 6, sc: 1.2, kind: 'apex' });
    for (const x of [A.x0, A.x1]) {
      const s = Math.sign(xc - x);
      out.push({ p: new THREE.Vector3(x + s * 9.5, 58, z), top: 70.5, sc: 0.85, kind: 'bracket' });
    }
  }
  return out;
}

// direction the root crown faces: toward the escapement
export const CROWN_FACE = Math.atan2(L.escapement.x - L.crown.x, L.escapement.z - L.crown.z);

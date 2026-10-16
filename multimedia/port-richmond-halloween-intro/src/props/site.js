// Site helpers for the props: game kit frames (from sitedata.js), hero locations, ground height.
// Everything here is in the shared Three.js frame of src/world/frame.js.
import * as THREE from 'three';
import { SITE } from './sitedata.js';

// ---- kit pieces -------------------------------------------------------------------------------------------------
// find the placed kit item with mesh name `m` nearest to z (and optionally x sign)
export function findItem(m, z, side = 0) {
  let best = null, bd = 1e9;
  for (const it of SITE.items) {
    if (it.m !== m) continue;
    if (side && Math.sign(it.p[0]) !== side) continue;
    const d = Math.abs(it.p[2] - z);
    if (d < bd) { bd = d; best = it; }
  }
  return best;
}

// kit-local (Blender) point -> Three world.  bx along the facade, by out to the street, bz up.
export function kitPoint(it, bx, by, bz, out = new THREE.Vector3()) {
  return out.set(
    it.p[0] + bx * it.ax[0] + by * it.out[0],
    it.p[1] + bz,
    it.p[2] + bx * it.ax[1] + by * it.out[1],
  );
}
// Object-local convention for things placed on a kit frame (right-handed, Three style):
//   local +Z = kit +by (out of the facade, toward the street), local +Y = up, local +X = kit -bx.
// So a Blender kit point (bx, by, bz) is the object-local point (-bx, bz, by)  (see kitLocal).
export function kitRotY(it) {
  return Math.atan2(it.out[0], it.out[1]); // local +Z -> out
}
export function kitLocal(bx, by, bz, out = new THREE.Vector3()) { return out.set(-bx, bz, by); }
export function kitMatrix(it, m = new THREE.Matrix4()) {
  const x = new THREE.Vector3(-it.ax[0], 0, -it.ax[1]);
  const up = new THREE.Vector3(0, 1, 0);
  const out = new THREE.Vector3(it.out[0], 0, it.out[1]);
  m.makeBasis(x, up, out);
  m.setPosition(it.p[0], it.p[1], it.p[2]);
  return m;
}
// place an Object3D at a kit item with an object-local offset (ox, oy, oz) and extra yaw
export function placeOnKit(obj, it, ox = 0, oy = 0, oz = 0, yaw = 0) {
  const ry = kitRotY(it);
  const c = Math.cos(ry), s = Math.sin(ry);
  obj.position.set(it.p[0] + ox * c + oz * s, it.p[1] + oy, it.p[2] - ox * s + oz * c);
  obj.rotation.set(0, ry + yaw, 0);
  return obj;
}

// ---- hero locations (from the game placements) -------------------------------------------------------------------
export const HERO = {
  door3609: findItem('SM_R_Door_Panel6', 3.629, 1),
  steps3609: findItem('SM_R_Steps_3', 3.629, 1),
  win3609a: findItem('SM_R_WinDH_M', 0.901, 1),
  win3609b: findItem('SM_R_WinDH_M', 2.495, 1),
  door3607: findItem('SM_R_Door_Panel6', 5.129, 1),
  steps3607: findItem('SM_R_Steps_3', 5.129, 1),
  win3607a: findItem('SM_R_WinDH_M', 6.352, 1),   // the scare-one window (TV behind it)
  win3607b: findItem('SM_R_WinDH_M', 7.998, 1),
  door3605: findItem('SM_R_Door_Panel6', 13.448, 1),
  steps3605: findItem('SM_R_Steps_3', 13.448, 1),
  win3605a: findItem('SM_R_WinDH_M', 10.563, 1),
  win3605b: findItem('SM_R_WinDH_M', 12.251, 1),
  door3603: findItem('SM_R_Door_Panel6', 14.949, 1),
  steps3603: findItem('SM_R_Steps_3', 14.949, 1),
  win3603a: findItem('SM_R_WinDH_M', 15.908, 1),
  win3603b: findItem('SM_R_WinDH_M', 17.667, 1),
  door3601: findItem('SM_R_Door_9Lite', 23.705, 1),
  steps3601: findItem('SM_R_Steps_1', 23.705, 1),
  door3611: findItem('SM_R_Door_Transom', -5.256, 1),
  steps3611: findItem('SM_R_Steps_2', -5.256, 1),
  rail3611a: findItem('SM_FXN_Handrail_2_White', -5.796, 1), // Bauder side rail of the 3611 stoop
  rail3611b: findItem('SM_FXN_Handrail_2_White', -4.716, 1),
  win3611a: findItem('SM_R_WinDH_M', -3.998, 1),
  win3611b: findItem('SM_R_WinDH_M', -2.225, 1),
  steps3617: findItem('SM_R_Steps_3', -17.86, 1),
  rail3617: findItem('SM_FXN_Handrail_3', -18.623, 1),
  steps3619: findItem('SM_R_Steps_2', -26.575, 1),
  rail3619: findItem('SM_FXN_Handrail_2', -27.115, 1),
  // NW (even) side
  door3602: findItem('SM_R_Door_Panel6', -4.835, -1),
  steps3602: findItem('SM_R_Steps_3', -4.835, -1),
  rail3602: findItem('SM_FXN_Handrail_3', -4.275, -1),
  win3602up: findItem('SM_R_WinDH_M', -2.685, -1),       // upstairs front window (curtain)
  pic3602: findItem('SM_R_WinPicture3', -2.685, -1),
  door3604: findItem('SM_R_Door_Panel6', -6.325, -1),
  steps3604: findItem('SM_R_Steps_3', -6.325, -1),
  rail3604: findItem('SM_FXN_Handrail_3', -6.864, -1),
  win3604a: findItem('SM_R_WinDH_M', -7.451, -1),
  pot3604: findItem('SM_C_Pot', -7.841, -1),
  door3606: findItem('SM_R_Door_Transom', -15.354, -1),
  steps3606: findItem('SM_R_Steps_2', -15.354, -1),
  rail3606: findItem('SM_FXN_Handrail_2_White', -14.814, -1),
  steps3608: findItem('SM_R_Steps_2', -16.655, -1),
  rail3608: findItem('SM_FXN_Handrail_2', -17.195, -1),
  steps3610: findItem('SM_R_Steps_1', -24.103, -1),
  steps3612: findItem('SM_R_Steps_1', -25.403, -1),
};

// Bauder Graphics (3613-15 Witte) frontage: NOTHING may be placed on or against it (Jez's rule).
export const BAUDER = { x: 5.6, z0: -17.107, z1: -6.175 };
export function inBauderZone(x, z, margin = 0.35) {
  return x > 2.6 && z > BAUDER.z0 - margin && z < BAUDER.z1 + margin;
}

// ---- ground -----------------------------------------------------------------------------------------------------
// Provisional ground model from the game data (stoop bases, gutter litter, parked cars). Replaced at load by a
// height grid sampled from the ported world when src/world provides ground meshes (see setGroundSampler).
const SE_FACADE = [[-30, 0.13], [-26.6, 0.108], [-17.9, 0.061], [-5.3, -0.073], [3.6, -0.158], [5.1, -0.186], [13.4, -0.24], [14.9, -0.232], [23.7, -0.295], [30, -0.33]];
const NW_FACADE = [[-30, 0.2], [-25.4, 0.178], [-16.7, 0.142], [-15.4, 0.205], [-6.3, 0.105], [-4.8, 0.087], [3.7, -0.06], [17.0, -0.17], [25.0, -0.26], [30, -0.3]];
function interp(tab, z) {
  if (z <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) {
    if (z <= tab[i][0]) { const [z0, y0] = tab[i - 1], [z1, y1] = tab[i]; return y0 + ((y1 - y0) * (z - z0)) / (z1 - z0); }
  }
  return tab[tab.length - 1][1];
}
export const CURB = { se: 3.0, nw: -3.0, height: 0.14 };
function modelGround(x, z) {
  const se = interp(SE_FACADE, z), nw = interp(NW_FACADE, z);
  if (x >= CURB.se) return se - 0.045 * (1 - Math.min(1, (x - CURB.se) / 2.5));      // SE sidewalk, falls toward curb
  if (x <= CURB.nw) return nw - 0.045 * (1 - Math.min(1, (CURB.nw - x) / 2.4));      // NW sidewalk
  const gse = se - 0.045 - CURB.height, gnw = nw - 0.045 - CURB.height;              // gutters
  const u = (x - CURB.nw) / (CURB.se - CURB.nw);
  return gnw + (gse - gnw) * u + 0.05 * (1 - Math.pow(2 * u - 1, 2));                // crowned street
}
let sampler = null;
export function setGroundSampler(fn) { sampler = fn; }
export function groundY(x, z) { if (sampler) { const y = sampler(x, z); if (y !== null && y !== undefined && isFinite(y)) return y; } return modelGround(x, z); }
export function modelGroundY(x, z) { return modelGround(x, z); }

// Build a height grid by ray-casting the world's ground (done once at load; ~0.25 m cells over the block).
export function buildWorldGroundSampler(world, { x0 = -7, x1 = 7, z0 = -30, z1 = 27, cell = 0.25, filter } = {}) {
  if (!world || !world.root) return null;
  const meshes = [];
  world.root.updateMatrixWorld(true);
  world.root.traverse((o) => {
    if (!o.isMesh || !o.visible || o.isInstancedMesh || o.isSkinnedMesh) return;
    if (filter && !filter(o)) return;
    o.geometry.computeBoundingBox?.();
    const bb = o.geometry.boundingBox;
    if (!bb) return;
    const box = bb.clone().applyMatrix4(o.matrixWorld);
    if (box.max.x < x0 || box.min.x > x1 || box.max.z < z0 || box.min.z > z1) return;
    if (box.min.y > 1.2 || box.max.y < -1.5) return;                  // only things near ground level
    if (box.max.y - box.min.y > 3.0 && (box.max.x - box.min.x) < 3) return; // skip walls/poles
    meshes.push(o);
  });
  if (!meshes.length) return null;
  const nx = Math.round((x1 - x0) / cell) + 1, nz = Math.round((z1 - z0) / cell) + 1;
  const grid = new Float32Array(nx * nz).fill(NaN);
  const rc = new THREE.Raycaster();
  rc.far = 6;
  const o = new THREE.Vector3(), d = new THREE.Vector3(0, -1, 0);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const x = x0 + i * cell, z = z0 + j * cell;
      o.set(x, 2.5, z);
      rc.set(o, d);
      const hits = rc.intersectObjects(meshes, false);
      // highest hit that looks like ground (face pointing up), below 1.0 m (skip stoop tops etc. above that)
      for (const h of hits) {
        if (!h.face) continue;
        const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
        if (n.y < 0.75) continue;
        if (h.point.y > 1.0) continue;
        grid[i * nz + j] = h.point.y;
        break;
      }
    }
  }
  return {
    nx, nz, grid,
    sample(x, z) {
      const fx = (x - x0) / cell, fz = (z - z0) / cell;
      if (fx < 0 || fz < 0 || fx > nx - 1 || fz > nz - 1) return null;
      const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
      const g = (a, b) => grid[Math.min(nx - 1, a) * nz + Math.min(nz - 1, b)];
      const a = g(i, j), b = g(i + 1, j), c = g(i, j + 1), e = g(i + 1, j + 1);
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(e)) {
        const vals = [a, b, c, e].filter((q) => !isNaN(q));
        return vals.length ? Math.max(...vals) : null;
      }
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + e * u) * v;
    },
  };
}

// ---- world anchor lookup ----------------------------------------------------------------------------------------
// The ENV agent exposes refined anchors from src/world; names are matched case-insensitively against candidates.
export function worldAnchor(world, ...names) {
  const a = world && world.anchors;
  if (!a) return null;
  const keys = Object.keys(a);
  for (const n of names) {
    const k = keys.find((q) => q.toLowerCase() === n.toLowerCase());
    if (k && a[k] && a[k].position) return a[k];
  }
  return null;
}

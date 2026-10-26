// The betta bowl's furnishings as part of its bed (FluidSim.bedSolids): the rocks, the sponge
// filter's weighted base (equipment.mjs), and the driftwood where it meets the sand (its feet), as
// a height map of their tops in the bowl's frame.
// The sand rests on them and flows round them, the water meets them and the fish can rest on
// them. (A height map has nothing under an overhang: higher up, the arch is left out, or the water
// could not pass under it; and so is any low part of it that does not reach down into the sand.)

import { BED_LEVEL, MAT } from './mesh.mjs';

/** How far under a mesh's surface its solid top lies (so the traced mesh always covers it), how
 *  high above the bed the driftwood counts as standing in it, and how near the sand its underside
 *  must come there for it to count; how high the filter's plastic counts (its base). (Its sponge
 *  is left out: the water passes through it, as it does through a sponge, and a column that tall
 *  would raise the bed's top over the open water, under which a phone's march steps over its
 *  samples: marchBand.ts.) */
const SINK = 0.014;
const FOOT = 0.06;
const TOUCH = 0.005;
const BASE = 0.04;

/** The map: n x n columns over [-extent, extent] in x and z, each the highest point of the
 *  meshes' parts standing in the sand over it (less SINK), or `none`. */
export function bakeBedSolids(meshes, n, extent, none) {
  const rock = new Float32Array(n * n).fill(none);
  const woodTop = new Float32Array(n * n).fill(none);
  const woodLow = new Float32Array(n * n).fill(Infinity);
  const cell = (2 * extent) / n;
  const toGrid = (v) => (v + extent) / cell - 0.5;
  // (Each triangle over the columns it covers: f(column, height there).)
  const raster = (P, a, b, c, f) => {
    const ax = toGrid(P[a]), az = toGrid(P[a + 2]);
    const bx = toGrid(P[b]), bz = toGrid(P[b + 2]);
    const cx = toGrid(P[c]), cz = toGrid(P[c + 2]);
    const det = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
    if (Math.abs(det) < 1e-12) {
      // (Seen edge on from above: its corners stand in for it.)
      for (const [gx, gz, y] of [[ax, az, P[a + 1]], [bx, bz, P[b + 1]], [cx, cz, P[c + 1]]]) {
        const i = Math.round(gx), j = Math.round(gz);
        if (i >= 0 && j >= 0 && i < n && j < n) f(i + n * j, y);
      }
      return;
    }
    const i0 = Math.max(0, Math.ceil(Math.min(ax, bx, cx))), i1 = Math.min(n - 1, Math.floor(Math.max(ax, bx, cx)));
    const j0 = Math.max(0, Math.ceil(Math.min(az, bz, cz))), j1 = Math.min(n - 1, Math.floor(Math.max(az, bz, cz)));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const u = ((bz - cz) * (i - cx) + (cx - bx) * (j - cz)) / det;
        const v = ((cz - az) * (i - cx) + (ax - cx) * (j - cz)) / det;
        const w = 1 - u - v;
        if (u < -1e-6 || v < -1e-6 || w < -1e-6) continue;
        f(i + n * j, u * P[a + 1] + v * P[b + 1] + w * P[c + 1]);
      }
    }
  };
  for (const mesh of meshes) {
    const P = mesh.positions;
    const I = mesh.indices;
    for (let t = 0; t < I.length / 3; t++) {
      const m = mesh.materials[t];
      const a = I[t * 3] * 3, b = I[t * 3 + 1] * 3, c = I[t * 3 + 2] * 3;
      if (m === MAT.ROCK || (m === MAT.TUBE && Math.max(P[a + 1], P[b + 1], P[c + 1]) <= BED_LEVEL + BASE)) {
        raster(P, a, b, c, (k, y) => { if (y - SINK > rock[k]) rock[k] = y - SINK; });
      } else if (m === MAT.BARK || m === MAT.WOOD_END) {
        // (Where the wood's underside is, everywhere; its top, only low down.)
        const low = Math.max(P[a + 1], P[b + 1], P[c + 1]) <= BED_LEVEL + FOOT;
        raster(P, a, b, c, (k, y) => {
          if (y < woodLow[k]) woodLow[k] = y;
          if (low && y - SINK > woodTop[k]) woodTop[k] = y - SINK;
        });
      }
    }
  }
  const map = rock;
  for (let k = 0; k < n * n; k++) if (woodLow[k] <= BED_LEVEL + TOUCH && woodTop[k] > map[k]) map[k] = woodTop[k];
  return map;
}

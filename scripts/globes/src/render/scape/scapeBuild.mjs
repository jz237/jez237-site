// The betta bowl's furnishings, ready for the page (main.ts via furnishings.ts): built
// (scene.mjs), packed into their BVH's texture (scapeBVH.mjs) and baked into the bed's solids
// (bedSolids.mjs). Run in a worker (scapeWorker.mjs), or here if no worker can be had.

import { bakeBedSolids } from './bedSolids.mjs';
import { packScape } from './scapeBVH.mjs';
import { buildScape } from './scene.mjs';

/** n, extent, none: the bed's map (FluidSim's BED_SOLIDS_N, its radius, BED_SOLIDS_NONE). */
export function buildFurnishings(n, extent, none) {
  const { meshes, obstacles } = buildScape();
  const packed = packScape(meshes);
  return { data: packed.data, width: packed.width, height: packed.height, map: bakeBedSolids(meshes, n, extent, none), obstacles };
}

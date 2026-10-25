// The betta bowl's furnishings, ready for the page (main.ts via furnishings.ts): built
// (scene.mjs), packed into their BVH's texture (scapeBVH.mjs), baked into the bed's solids
// (bedSolids.mjs), and the plants' motion planned (scapeRefit.mjs: their kernels, their data, and
// what of the BVH to refit as they move). Run in a worker (scapeWorker.mjs), or here if no worker
// can be had.

import { bakeBedSolids } from './bedSolids.mjs';
import { plantMotionWGSL } from './plantMotion.mjs';
import { packScape } from './scapeBVH.mjs';
import { refitBuffers, refitPlan, scapeRefitWGSL } from './scapeRefit.mjs';
import { buildScapePieces } from './scene.mjs';

/** n, extent, none: the bed's map (FluidSim's BED_SOLIDS_N, its radius, BED_SOLIDS_NONE); detail:
 *  how finely the pieces are made (scene.mjs). */
export function buildFurnishings(n, extent, none, detail = 1) {
  return furnishingsOf(buildScapePieces({ detail }), n, extent, none);
}

/** The same from the pieces (buildScapePieces: all of them, in their order), wherever they were
 *  made. */
export function furnishingsOf(pieces, n, extent, none) {
  const meshes = pieces.flatMap((p) => p.meshes);
  // (The plants keep out of the wood and the rocks: their solid parts.)
  const solids = pieces.filter((p) => p.name !== 'plants').flatMap((p) => p.obstacles);
  const packed = packScape(meshes);
  const plan = refitPlan(packed, meshes, undefined, { obstacles: solids });
  return {
    data: packed.data,
    width: packed.width,
    height: packed.height,
    map: bakeBedSolids(meshes, n, extent, none),
    obstacles: pieces.flatMap((p) => p.obstacles),
    motion: {
      wgsl: scapeRefitWGSL(plantMotionWGSL(solids, plan.rest)),
      buffers: refitBuffers(plan),
      moving: plan.moving,
      slotCount: plan.slotCount,
      passes: plan.passes,
      leafCount: plan.leafCount,
      leaves: plan.leaves,
      leafTips: plan.leafTips,
    },
  };
}

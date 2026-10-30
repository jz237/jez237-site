// The betta bowl's furnishings, ready for the page (main.ts via furnishings.ts): built
// (scene.mjs), packed into their BVH's texture (scapeBVH.mjs; with room for the bubble nest's
// rows, which the page writes in: nest.mjs), baked into the bed's solids (bedSolids.mjs), the
// plants' motion planned (scapeRefit.mjs: their kernels, their data, and what of the BVH to refit
// as they move), and where the sponge filter's air comes out (equipment.mjs). Run in a worker
// (scapeWorker.mjs), or here if no worker can be had.

import { bakeBedSolids } from './bedSolids.mjs';
import { NEST_MAX } from './nest.mjs';
import { MOTION_VERTEX_STRIDE, plantMotionWGSL } from './plantMotion.mjs';
import { packScape } from './scapeBVH.mjs';
import { refitBuffers, refitPlan, scapeRefitWGSL } from './scapeRefit.mjs';
import { buildScapePieces } from './scene.mjs';

/** An obstacle's ends' leaf vertices (plants.mjs followLeaves: a mesh's vertex indices and their
 *  weights) as MovingPlants.place takes them: for each end, the vertices at rest (xyz a vertex), their
 *  motion (MOTION_VERTEX_STRIDE floats a vertex, the leaf numbered among all the plants' leaves:
 *  plan.leaves) and the weights. */
function followOf(follow, meshes, plan) {
  const mi = meshes.findIndex((m) => m.name === follow.mesh);
  const first = plan.meshLeaves.find((l) => l.mesh === mi).first;
  const { positions: P, motion } = meshes[mi];
  const end = (list) => {
    const rest = new Float32Array(list.length * 3), mv = new Float32Array(list.length * MOTION_VERTEX_STRIDE);
    list.forEach(([v], i) => {
      rest.set(P.subarray(v * 3, v * 3 + 3), i * 3);
      mv.set(motion.vertex.subarray(v * MOTION_VERTEX_STRIDE, (v + 1) * MOTION_VERTEX_STRIDE), i * MOTION_VERTEX_STRIDE);
      mv[i * MOTION_VERTEX_STRIDE] += first;
    });
    return { rest, mv, k: list.map(([, k]) => k) };
  };
  return { a: end(follow.a), b: end(follow.b) };
}

/** n, extent, none: the bed's map (FluidSim's BED_SOLIDS_N, its radius, BED_SOLIDS_NONE); detail:
 *  how finely the pieces are made (scene.mjs). */
export function buildFurnishings(n, extent, none, detail = 1) {
  return furnishingsOf(buildScapePieces({ detail }), n, extent, none);
}

/** The same from the pieces (buildScapePieces: all of them, in their order), wherever they were
 *  made. */
export function furnishingsOf(pieces, n, extent, none) {
  const meshes = pieces.flatMap((p) => p.meshes);
  // (The plants keep out of the wood, the rocks and the equipment: their solid parts.)
  const solids = pieces.filter((p) => p.name !== 'plants').flatMap((p) => p.obstacles);
  // (Room after the vertices for the nest's rows: nest.mjs withNest.)
  const packed = packScape(meshes, { rows: new Float32Array(4 * NEST_MAX) });
  const plan = refitPlan(packed, meshes, undefined, { obstacles: solids });
  return {
    data: packed.data,
    width: packed.width,
    height: packed.height,
    map: bakeBedSolids(meshes, n, extent, none),
    obstacles: pieces.flatMap((p) => p.obstacles).map((o) => (o.follow ? { ...o, follow: followOf(o.follow, meshes, plan) } : o)),
    bubbles: pieces.find((p) => p.bubbles)?.bubbles ?? null,
    // (Each mesh's name and vertex count, in the order they were packed: what a vertex is part of,
    // for Learn mode's taps, app/learn/pick.mjs.)
    parts: meshes.map((m) => [m.name, m.positions.length / 3]),
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

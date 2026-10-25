// The betta bowl's furnishings together (its page only): the driftwood arch (wood.mjs), the four
// rocks (rocks.mjs) and the two plants (plants.mjs), each built in the bowl's frame (mesh.mjs) and
// laid out round the others, so none passes through another and the fish keeps its open water
// (scape-scene.test.mjs holds them to it). bowlScape.ts builds them once; main.ts packs their
// meshes into the BVH (scapeBVH.mjs) and the bed's solids (bedSolids.mjs), the bowl's shader takes
// their materials, and the fish keeps clear of their obstacles.

import * as wood from './wood.mjs';
import * as rocks from './rocks.mjs';
import * as plants from './plants.mjs';

/** The pieces, in the order their meshes are packed and their materials are joined. */
const PIECES = [
  ['wood', wood],
  ['rocks', rocks],
  ['plants', plants],
];

/** The open water the betta keeps (the bowl's frame): no wood or rock in it, at most a leaf's tip. */
export const SCAPE_WATER = { lo: [-0.35, -0.15, -0.2], hi: [0.35, 0.6, 0.6] };

/** Each piece built on its own (deterministic: the same on every call). detail scales every
 *  piece's tessellation (1; 0.5, for phones: about a quarter of the triangles), each the same
 *  shape in the same place, with the same obstacles, at any detail.
 *  @param {{ detail?: number }} [options]
 *  @returns {(import('./mesh.mjs').ScapePiece & { name: string })[]} */
export function buildScapePieces(options = { detail: 1 }) {
  // (Anything but a finite number, or no options at all, is full detail.)
  const detail = Number.isFinite(options?.detail) ? Math.min(Math.max(options.detail, 0.25), 2) : 1;
  return PIECES.map(([name, piece]) => ({ name, ...piece.build({ detail }) }));
}

/** All the furnishings: every piece's meshes, and the room the fish leaves round each.
 *  @param {{ detail?: number }} [options]
 *  @returns {import('./mesh.mjs').ScapePiece} */
export function buildScape(options = { detail: 1 }) {
  const pieces = buildScapePieces(options);
  return { meshes: pieces.flatMap((p) => p.meshes), obstacles: pieces.flatMap((p) => p.obstacles) };
}

/** The pieces' material functions (WGSL), for scapeMeshWGSL. */
export const SCAPE_PIECE_WGSL = PIECES.map(([, piece]) => piece.WGSL);

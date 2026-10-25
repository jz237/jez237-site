// The betta bowl's furnishings in its shader (bowlScape.ts): their BVH's walk and their materials,
// loaded only on the bowl's page.

import { scapeMeshWGSL } from './scapeBVH.mjs';
import { SCAPE_PIECE_WGSL } from './scene.mjs';

export function scapeShaderWGSL() {
  return scapeMeshWGSL(SCAPE_PIECE_WGSL);
}

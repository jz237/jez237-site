// What the quad lists need to know of every material (render_geom.js,
// QuadLists): from the palette as the engine gives it, eight bytes a
// material. Apart from the renderer so that the sim's worker, which keeps
// lists of its own over the rows it sends, makes the same three tables.
import { PAT } from './render_shaders_surface.js';

// [transparent (1 or 0), emissive strength, drawn by the scene pass's heap
// program (0: no; 1: a rubble kind; 3: foliage, which the pass that lays
// leaves again over the soot draws and nothing else of the heaps)], a
// byte a material each.
export function quadLuts(pal) {
  const trans = new Uint8Array(256), emit = new Uint8Array(256), heap = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    trans[i] = (pal[i * 8 + 7] & 2) ? 1 : 0;
    emit[i] = pal[i * 8 + 5];
    // The rubble kinds and foliage (granular, mottled, matt: the test the
    // surface shader makes).
    const pat = pal[i * 8 + 6];
    // (And leaf alight, the granular ember: it is part of the crown it
    // burns in, and drawn as cubes beside it, it is a board of squares.
    // The heap program's, 1: the pass that lays leaves again tells a leaf
    // by PAT.NOISE alone and never drew it, so burning leaf under soot is
    // char under soot, as it was in the build that was judged.)
    const leafLike = (pal[i * 8 + 7] & 32) !== 0 && pal[i * 8 + 4] > 204;
    heap[i] = pat === PAT.RUBBLE ? 1 : pat === PAT.NOISE && leafLike ? 3 : pat === PAT.EMBER && leafLike ? 1 : 0;
  }
  return [trans, emit, heap];
}

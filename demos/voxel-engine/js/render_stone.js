// The stones of a rubble heap: one tileable texture of cells, each a lump
// with a tone and a lean of its own, a flat broken face with the arris at
// its rim, and the distance to the gap around it. The cells come in sizes:
// a coarse grid of 16 x 16 in which a square holds one stone, two, or four
// (about 520 stones a tile, the largest some three times the smallest
// across), so that one lookup already shows stones of many sizes. The
// surface shader takes it at two scales (chunks, and gravel between them)
// along the mound a heap stands for, and for the sprays of leaf in a crown.
//   r: the stone's tone (one value per stone)
//   g, b: its lean along the texture's two axes (0.5 = flat): the stone's
//         own tilt, and at the rim the fall away from its middle
//   a: how far inside the stone the texel lies (0 in the gap, 1 in the middle)
import { makeTexture } from './render_gl.js';

const N = 256, CELLS = 16;

export function makeStones(gl) {
  let seed = 0x51f15e3d;
  const rnd = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  // Per square of the grid: up to four stones (centre in squares, tone, tilt).
  const count = new Uint8Array(CELLS * CELLS);
  const cx = new Float32Array(CELLS * CELLS * 4), cy = new Float32Array(CELLS * CELLS * 4);
  const tone = new Float32Array(CELLS * CELLS * 4), tx = new Float32Array(CELLS * CELLS * 4), ty = new Float32Array(CELLS * CELLS * 4);
  for (let c = 0; c < CELLS * CELLS; c++) {
    const r = rnd();
    const k = r < 0.45 ? 1 : (r < 0.7 ? 2 : 4);
    count[c] = k;
    for (let j = 0; j < k; j++) {
      const i = c * 4 + j;
      // One stone anywhere in its square; two, one in each half; four, one
      // in each quarter.
      const qx = k === 4 ? (j & 1) * 0.5 : (k === 2 ? j * 0.5 : 0), qy = k === 4 ? (j >> 1) * 0.5 : 0;
      const wx = k === 1 ? 1 : 0.5, wy = k === 4 ? 0.5 : 1;
      cx[i] = qx + wx * (0.15 + 0.7 * rnd());
      cy[i] = qy + wy * (0.15 + 0.7 * rnd());
      tone[i] = rnd();
      tx[i] = rnd() * 2 - 1;
      ty[i] = rnd() * 2 - 1;
    }
  }
  const px = new Uint8Array(N * N * 4);
  const byte = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const u = (x + 0.5) / N * CELLS, v = (y + 0.5) / N * CELLS;
      const iu = Math.floor(u), iv = Math.floor(v);
      let d1 = 1e9, d2 = 1e9, best = 0, bx = 0, by = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const c = ((iu + dx + CELLS) % CELLS) + CELLS * ((iv + dy + CELLS) % CELLS);
          for (let j = 0; j < count[c]; j++) {
            const i = c * 4 + j;
            const ox = iu + dx + cx[i] - u, oy = iv + dy + cy[i] - v;
            const d = Math.hypot(ox, oy);
            if (d < d1) { d2 = d1; d1 = d; best = i; bx = ox; by = oy; } else if (d < d2) d2 = d;
          }
        }
      }
      // Half the difference of the two nearest distances is (nearly) the
      // distance to the border between their stones; a stone's own size is
      // about the sum, so the rim is as wide in a small stone as in a big one.
      const rim = Math.min(1, (d2 - d1) / (0.25 * (d1 + d2) + 0.08));
      const o = (x + y * N) * 4;
      px[o] = byte(tone[best]);
      // (Broken stone: a flat face tilted its own way, the arris only at
      // the rim, where it falls away from the middle: the texel lies at
      // -(bx, by) from it.)
      const dome = 1.6 * Math.max(0, 1 - rim * 2.5) / (d1 + d2 + 0.2);
      px[o + 1] = byte(0.5 + 0.5 * Math.max(-1, Math.min(1, tx[best] * 0.8 - bx * dome)));
      px[o + 2] = byte(0.5 + 0.5 * Math.max(-1, Math.min(1, ty[best] * 0.8 - by * dome)));
      px[o + 3] = byte(rim);
    }
  }
  const t = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.generateMipmap(gl.TEXTURE_2D);
  return t;
}

// The bubble nest the betta keeps against the glass at the waterline (its page only): its bubbles,
// the same on every load. The shader reads them as rows of the furnishings' texture (bowlScape.ts
// traces them): the furnishings' worker leaves room for them there (scapeBuild.mjs), and the page,
// which has made them as it loaded (it counts them: interaction/BowlLife.ts), writes them in
// (furnishings.ts). Made in the worker too, they would hold the furnishings up.

import { stream } from './mesh.mjs';

/** The nest: up to NEST_MAX bubbles (0.7 to 2 mm), in a raft against the glass at the waterline,
 *  NEST_SPAN along the glass and NEST_DEEP out from it, piled two deep in its middle. Its bubbles
 *  in the order the fish builds them (heart first): along the glass, out from it (centre), the
 *  height of its centre over the film, radius. */
export const NEST_MAX = 170;
const NEST_SPAN = 0.22;
const NEST_DEEP = 0.14;

function buildNest() {
  const rand = stream(9013);
  const out = [];
  for (let tries = 0; tries < 40000 && out.length < NEST_MAX; tries++) {
    const u = (rand() * 2 - 1) * NEST_SPAN;
    const v = rand() * NEST_DEEP;
    // Densest against the glass in the middle; thinning out at the raft's edge.
    const edge = (u / NEST_SPAN) ** 2 + (v / NEST_DEEP) ** 2;
    if (edge > 1 || rand() > 1.1 - edge) continue;
    const r = 0.006 + 0.011 * rand() ** 2.2;
    const vc = v + r + 0.002;
    if (out.some(([bu, bv, bh, br]) => bh === 0 && Math.hypot(bu - u, bv - vc) < (br + r) * 0.92)) continue;
    out.push([u, vc, 0, r]);
  }
  // The second layer, on the first in the middle.
  const first = out.length;
  for (let tries = 0; tries < 20000 && out.length < NEST_MAX; tries++) {
    const u = (rand() * 2 - 1) * NEST_SPAN * 0.55;
    const v = rand() * NEST_DEEP * 0.55;
    const r = 0.006 + 0.008 * rand() ** 2;
    const vc = v + r + 0.002;
    const below = out.slice(0, first).filter(([bu, bv, , br]) => Math.hypot(bu - u, bv - vc) < br + r);
    if (below.length < 2) continue;
    if (out.slice(first).some(([bu, bv, , br]) => Math.hypot(bu - u, bv - vc) < (br + r) * 0.92)) continue;
    const h = Math.max(...below.map(([bu, bv, , br]) => Math.sqrt(Math.max(0, (br + r) ** 2 - (bu - u) ** 2 - (bv - vc) ** 2)) - 0.25 * br));
    out.push([u, vc, h, r]);
  }
  // Heart first (the fish builds from the middle out), shuffled a little.
  return out
    .map((b) => ({ b, key: Math.hypot(b[0] / NEST_SPAN, b[1] / NEST_DEEP) + (b[2] > 0 ? 0.35 : 0) + 0.25 * rand() }))
    .sort((x, y) => x.key - y.key)
    .map((x) => x.b);
}

/** @type {[number, number, number, number][] | null} */
let made = null;

/** The nest, made the first time it is asked for (the page asks as it loads: bowlScape.ts).
 *  @returns {[number, number, number, number][]} */
export function nest() {
  made ??= buildNest();
  return made;
}

/** The nest as texel rows (4 floats a bubble, in its order): each number to a millionth of the
 *  glass's radius, as f32. */
export function nestRows() {
  return Float32Array.from(nest().flat(), (x) => Number(x.toFixed(6)));
}

/** The furnishings' texture data (scapeBuild.mjs) with the nest's rows written into the room left
 *  for them (from the texel that texel 3's w names).
 *  @param {Float32Array} data
 *  @returns {Float32Array} */
export function withNest(data) {
  data.set(nestRows(), 4 * data[15]);
  return data;
}

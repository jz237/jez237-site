// The betta bowl's interleave (bowlRender.ts): its bookkeeping, and its resolve worked on the CPU.
//
// On a phone the bowl is traced on a lattice of a quarter of the picture's pixels a frame (2x2: one
// pixel of each 2x2 block, a different one each frame, so each pixel is traced once every four
// frames). A resolve then makes the picture at full size from the last four lattices: a pixel keeps
// its own last sample (exact, at most three frames old) while nothing moved the bowl or the camera,
// unless its ray met the fish or something small that flies on its own; where something in its
// block or those round it has changed since, that sample is held within what this frame's nearest
// samples span, and where most of them have, it is not kept. Else it is filled in from this
// frame's lattice by an edge-adaptive filter (EASU, from AMD's FSR 1, adapted from three's
// examples/jsm/tsl/display/FSR1Node.js, MIT; no sharpening). Still, the picture is in four
// frames exactly a full trace at the picture's size, not an upscale. The resolve itself runs on the
// GPU (bowlResolveWGSL.ts); this is its mirror, which upsample-resolve.test.mjs holds to account,
// and what both share: the hit codes, the phases' order, the change test.

/** What a ray of the bowl's passes ended on: shaders.ts globes_hitIdOf, written in the colour's
 *  alpha as 1 + the code (a ray that met none of the bowl leaves 0). The fish is any ray that met
 *  it (its fins too), and in the bowl's own pass (which leaves the fish out) any that passed near
 *  it: the fish's pass draws those again. SPLASH is what is small and flies on its own: spray, a
 *  bubble, a pellet. (The drops on the glass and the nest stay put, mostly: the change test sees
 *  them when they move. Never kept, wet glass would never be traced at full sharpness.) CROSSED is
 *  added where the ray met the water's surface on the way. */
export const HIT = Object.freeze({ MISS: 0, STUDIO_AIR: 1, STUDIO_WATER: 2, SAND: 3, WOOD: 4, ROCK: 5, PLANT: 6, FISH: 7, LID: 8, SURFACE: 9, SPLASH: 10, CROSSED: 16 });

/** The order a lattice's phases are traced in: the pixel of its block (x, y) each frame traces.
 *  2x2 goes corner to opposite corner, so the pixels two frames apart are diagonal neighbours. */
export const PHASES = Object.freeze({
  1: [[0, 0]],
  2: [[0, 0], [1, 1], [1, 0], [0, 1]],
});

/** A block that has changed counts as changed for this many frames: until each of its pixels has
 *  been traced since (k * k - 1 for a k x k lattice). */
export const changedFrames = (k) => k * k - 1;

/** The change test's thresholds: a block has changed where its new sample's luminance differs from
 *  the one traced four frames before by more than this share of the brighter (or the floor's); or
 *  by more than CHANGE_TAU_HIT where what its ray ended on changed too (an edge moved past). Light
 *  that changes by less than CHANGE_TAU over four frames keeps its samples (the sun's dapple
 *  drifting over the bed and the wood, ~0.3 pixels in four frames: filled in instead, from a lattice
 *  each frame in another place, it crawled); a hit that flips with hardly any change in colour (the
 *  water's line against the glass) is no edge that moved. (Tuned on frames drawn one by one with the
 *  world live, against the full trace of each: 0.6 crawled least and was nearest it, 0.04 crawled
 *  five times as much as the full trace.) */
export const CHANGE_TAU = 0.6;
export const CHANGE_TAU_HIT = 0.04;
export const CHANGE_FLOOR = 0.02;
/** Where at least this many of the nine blocks round a pixel have changed, its own sample is not
 *  kept but filled in (water churning after a roll: kept, the samples of four frames make a comb of
 *  it); where fewer, it is held within what this frame's nearest samples span (a line of the sun's
 *  dapple drifting by). */
export const WIDE_CHANGE = 4;

/** The lattice's size for a picture of w x h at k x k. */
export function latticeSize(w, h, k) {
  return [Math.ceil(w / k), Math.ceil(h / k)];
}

/** The camera's view offset (output pixels, PerspectiveCamera.setViewOffset's x and y) that puts
 *  lattice texel i's centre on output pixel k i + px's (the view being k times the lattice's size).
 *  @param {number} k
 *  @param {readonly number[]} phase the phase's pixel in its block (x, y)
 *  @returns {[number, number]} */
export function viewOffset(k, phase) {
  return [phase[0] + 0.5 - k / 2, phase[1] + 0.5 - k / 2];
}

/** Which phase's samples are still good, frame by frame. A frame that moved the bowl or the camera
 *  (or a reset: a new size, a new mode, a stall, the first frame) keeps nothing traced before it. */
export class Schedule {
  constructor(k) {
    this.k = k;
    this.phases = PHASES[k];
    this.frame = -1;
    this.restSince = 0;
    /** The frame each phase was last traced in. */
    this.tracedAt = this.phases.map(() => -Infinity);
  }

  /** Nothing kept from before the next frame. */
  reset() {
    this.restSince = Infinity;
  }

  /** Moves on to the next frame (still: nothing moved since the last). Returns its phase's index,
   *  and whether that phase's last sample (traced k * k frames ago) is one the change test may
   *  compare the new one with. */
  next(still) {
    this.frame++;
    if (!still || this.restSince === Infinity) this.restSince = this.frame;
    const phase = this.frame % this.phases.length;
    const oldValid = this.tracedAt[phase] >= this.restSince;
    this.tracedAt[phase] = this.frame;
    return { phase, oldValid };
  }

  /** Whether phase i's last sample is still good this frame, and how old it is (frames). */
  valid(i) {
    return this.tracedAt[i] >= this.restSince;
  }

  age(i) {
    return this.frame - this.tracedAt[i];
  }

  /** Index (in phases) of the phase whose pixel in each block is (x, y). */
  indexOf(x, y) {
    return this.phases.findIndex(([px, py]) => px === x && py === y);
  }
}

// ---- the resolve, on the CPU ------------------------------------------------------------------

/** A sample with any part not a number, or infinite, as nought (the GPU tests the bits). */
export function clean(c) {
  return c.map((v) => (Number.isFinite(v) ? v : 0));
}

export function luma(c) {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** The hit code a sample carries (HIT; 0 where its ray met none of the bowl). */
export function idOf(c) {
  return c[3] > 0.5 ? Math.round(c[3]) - 1 : 0;
}

/** What it ended on, whether or not it met the water's surface on the way (HIT less CROSSED). */
export const kindOf = (id) => id & 15;

/** Whether a block has changed: its new sample against its last one (k * k frames before). */
export function changed(now, before, tau = CHANGE_TAU) {
  const a = luma(now);
  const b = luma(before);
  return Math.abs(a - b) > (idOf(now) !== idOf(before) ? CHANGE_TAU_HIT : tau) * Math.max(a, b, CHANGE_FLOOR);
}

/** The 12 taps EASU reads round a point between texel centres (offsets from the texel below and
 *  left of it): b c / e f g h / i j k l / n o. */
export const TAPS = Object.freeze([[0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]]);
const F = 3, G = 4, J = 7, K = 8;

/** FSR 1's luminance for finding edges (red and blue halved), squashed (x / (1 + x)) so a glint far
 *  past white does not stand for every edge round it. */
function edgeLuma(c) {
  const l = 0.5 * c[0] + c[1] + 0.5 * c[2];
  return l / (1 + l);
}

/** EASU at pp (texel-centre units) from taps (TAPS' order, cleaned), of which only those `use`
 *  says are drawn from. Returns the colour, or null where no tap may be used. */
export function easu(pp, taps, use) {
  const fx = Math.floor(pp[0]);
  const fy = Math.floor(pp[1]);
  const f = [pp[0] - fx, pp[1] - fy];
  const L = taps.map(edgeLuma);
  const dir = [0, 0];
  let len = 0;
  const edge = (w, a, b, c, d, e) => {
    const dc = L[d] - L[c];
    const cb = L[c] - L[b];
    const dirX = L[d] - L[b];
    const lenX = Math.max(Math.abs(dc), Math.abs(cb));
    const sx = Math.min(Math.abs(dirX) / Math.max(lenX, 1 / 65536), 1);
    dir[0] += dirX * w;
    len += sx * sx * w;
    const ec = L[e] - L[c];
    const ca = L[c] - L[a];
    const dirY = L[e] - L[a];
    const lenY = Math.max(Math.abs(ec), Math.abs(ca));
    const sy = Math.min(Math.abs(dirY) / Math.max(lenY, 1 / 65536), 1);
    dir[1] += dirY * w;
    len += sy * sy * w;
  };
  // (b c e f g h i j k l n o: 0 1 2 3 4 5 6 7 8 9 10 11.)
  edge((1 - f[0]) * (1 - f[1]), 0, 2, 3, 4, 7);
  edge(f[0] * (1 - f[1]), 1, 3, 4, 5, 8);
  edge((1 - f[0]) * f[1], 3, 6, 7, 8, 10);
  edge(f[0] * f[1], 4, 7, 8, 9, 11);
  const dirSq = dir[0] * dir[0] + dir[1] * dir[1];
  const zero = dirSq < 1 / 32768;
  const r = 1 / Math.sqrt(Math.max(dirSq, 1 / 32768));
  const d = zero ? [1, 0] : [dir[0] * r, dir[1] * r];
  len = (len * 0.5) ** 2;
  const stretch = (d[0] * d[0] + d[1] * d[1]) / Math.max(Math.abs(d[0]), Math.abs(d[1]));
  const len2 = [1 + (stretch - 1) * len, 1 - 0.5 * len];
  const lob = 0.5 + (1 / 4 - 0.04 - 0.5) * len;
  const clp = 1 / lob;
  const acc = [0, 0, 0];
  let wSum = 0;
  let lo = null;
  let hi = null;
  TAPS.forEach(([ox, oy], t) => {
    if (!use[t]) return;
    const x = ox - f[0];
    const y = oy - f[1];
    const vx = x * d[0] + y * d[1];
    const vy = -x * d[1] + y * d[0];
    const sx = vx * len2[0];
    const sy = vy * len2[1];
    const d2 = Math.min(sx * sx + sy * sy, clp);
    const wB = (2 / 5) * d2 - 1;
    const wA = lob * d2 - 1;
    const w = ((25 / 16) * wB * wB - (25 / 16 - 1)) * wA * wA;
    for (let c = 0; c < 3; c++) acc[c] += taps[t][c] * w;
    wSum += w;
    if (t === F || t === G || t === J || t === K) {
      lo = lo ? lo.map((v, c) => Math.min(v, taps[t][c])) : taps[t].slice(0, 3);
      hi = hi ? hi.map((v, c) => Math.max(v, taps[t][c])) : taps[t].slice(0, 3);
    }
  });
  // (Too little weight left among the taps drawn from: the nearest of them, as is.)
  if (wSum < 0.05) {
    const near = nearest(f, use);
    return near < 0 ? null : taps[near].slice(0, 3);
  }
  const out = acc.map((v) => v / wSum);
  // (No ringing: within the four nearest it draws from; or all it draws from, where none of those.)
  if (!lo) {
    TAPS.forEach((_, t) => {
      if (!use[t]) return;
      lo = lo ? lo.map((v, c) => Math.min(v, taps[t][c])) : taps[t].slice(0, 3);
      hi = hi ? hi.map((v, c) => Math.max(v, taps[t][c])) : taps[t].slice(0, 3);
    });
  }
  return out.map((v, c) => Math.min(Math.max(v, lo[c]), hi[c]));
}

/** The bilinear weights of the four nearest taps (f g j k) at fraction f. */
function bilinear(f) {
  return [(1 - f[0]) * (1 - f[1]), f[0] * (1 - f[1]), (1 - f[0]) * f[1], f[0] * f[1]];
}

/** The tap (TAPS index) nearest by bilinear weight among f g j k that `use` allows (the first of
 *  them at a tie), else among them all; -1 if none. */
function nearest(f, use) {
  const w = bilinear(f);
  let best = -1;
  let most = -1;
  [F, G, J, K].forEach((t, i) => {
    if (use[t] && w[i] > most) {
      most = w[i];
      best = t;
    }
  });
  if (best >= 0) return best;
  return TAPS.findIndex((_, t) => use[t]);
}

/** One output pixel (x, y) of the resolve, as the GPU's does it. lattices: the last sample of each
 *  phase, (w, h) arrays of [r, g, b, a] by texel, indexed as schedule.phases; current: this frame's
 *  phase's index; flags: this frame's changed counters by block; k: the lattice's size. fishRung:
 *  the fish is drawn again at full size (its pixels, marked, are no matter). Returns its colour, its
 *  hit code, whether it kept its own sample, and whether the fish's pass must draw it. */
export function resolvePixel({ x, y, k, lattices, current, schedule, flags, fishRung = true, wide = WIDE_CHANGE }) {
  const at = (img, tx, ty) => {
    const row = img[Math.min(Math.max(ty, 0), img.length - 1)];
    return clean(row[Math.min(Math.max(tx, 0), row.length - 1)]);
  };
  const tx = Math.floor(x / k);
  const ty = Math.floor(y / k);
  const mine = schedule.indexOf(x - tx * k, y - ty * k);
  const [cx, cy] = schedule.phases[current];
  // This frame's lattice round the pixel (texel-centre units).
  const pp = [(x - cx) / k, (y - cy) / k];
  const fx = Math.floor(pp[0]);
  const fy = Math.floor(pp[1]);
  const lat = lattices[current];
  const taps = TAPS.map(([ox, oy]) => at(lat, fx + ox, fy + oy));
  const ids = taps.map(idOf);
  // The fish's pass draws it again where the fish is near: this frame's nearest four samples, or
  // any of its block's samples still good.
  const own = schedule.phases.map((_, i) => at(lattices[i], tx, ty));
  const mark = fishRung && ([F, G, J, K].some((t) => kindOf(ids[t]) === HIT.FISH) || own.some((s, i) => schedule.valid(i) && kindOf(idOf(s)) === HIT.FISH));
  const sample = own[mine];
  const id = idOf(sample);
  if (mine === current) return { colour: sample.slice(0, 3), id, kept: true, mark };
  // (How many of its block and those round it have changed.)
  const changedNear = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => {
    const row = flags[Math.min(Math.max(ty + dy, 0), flags.length - 1)];
    return row[Math.min(Math.max(tx + dx, 0), row.length - 1)] > 0 ? 1 : 0;
  })).reduce((a, b) => a + b, 0);
  const keep = schedule.valid(mine) && kindOf(id) !== HIT.FISH && kindOf(id) !== HIT.SPLASH && changedNear < wide;
  if (keep && !changedNear) return { colour: sample.slice(0, 3), id, kept: true, mark };
  if (keep) {
    // Held within what this frame's nearest four span (not the fish's where its pass draws it).
    const near = [F, G, J, K].filter((t) => ids[t] > 0 && !(fishRung && kindOf(ids[t]) === HIT.FISH));
    const colour = near.length ? sample.slice(0, 3).map((v, c) => Math.min(Math.max(v, Math.min(...near.map((t) => taps[t][c]))), Math.max(...near.map((t) => taps[t][c])))) : sample.slice(0, 3);
    return { colour, id, kept: true, mark };
  }
  // Filled in: covered where the nearest four, by their bilinear weights, mostly are; its code the
  // nearest covered one's; drawn from the covered taps (not the fish's, where its pass draws them).
  const f = [pp[0] - fx, pp[1] - fy];
  const w = bilinear(f);
  const covered = [F, G, J, K].reduce((s, t, i) => s + (ids[t] > 0 ? w[i] : 0), 0) >= 0.5;
  if (!covered) return { colour: [0, 0, 0], id: 0, kept: false, mark };
  const fillId = ids[nearest(f, ids.map((v) => v > 0))];
  const use = ids.map((v) => v > 0 && !(fishRung && kindOf(v) === HIT.FISH));
  const colour = easu(pp, taps, use) ?? [0, 0, 0];
  return { colour, id: fillId, kept: false, mark };
}

/** The changed counters for this frame, by block: `now` the lattice just traced, `before` its
 *  phase's last (k * k frames ago), compared where oldValid; the last frame's counters run down. */
export function changedCounters({ now, before, oldValid, last, still, k, tau = CHANGE_TAU }) {
  return now.map((row, ty) => row.map((s, tx) => {
    if (!still) return 0;
    if (oldValid && changed(clean(s), clean(before[ty][tx]), tau)) return changedFrames(k);
    return Math.max((last?.[ty]?.[tx] ?? 0) - 1, 0);
  }));
}

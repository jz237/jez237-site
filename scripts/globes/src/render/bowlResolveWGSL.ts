// The betta bowl's interleave on the GPU (bowlRender.ts): its passes' WGSL. The change test, run on
// the lattice just traced (one texel a block); the resolve, which makes the picture at full size
// from the last lattices; and the composite, which draws that picture into the frame. What it does
// is bowlResolve.mjs's, where it is worked on the CPU and tested (upsample-resolve.test.mjs).

import { changedFrames, CHANGE_FLOOR, CHANGE_TAU_HIT, HIT, PHASES, TAPS } from './bowlResolve.mjs';

/** ?updebug: the resolve's picture painted for what each pixel's ray ended on (id), how old its
 *  sample is (age: kept ones green to yellow by their age, filled ones red), where its block has
 *  changed (changed: red), or where a sample it read was not a number (nan: magenta). */
export type UpDebug = 0 | 'id' | 'age' | 'changed' | 'nan';

const f = (x: number): string => (Number.isInteger(x) ? `${x}.0` : String(x));
const TAP_NAMES = ['B', 'C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'O'];

/** What the passes share. */
const COMMON = /* wgsl */ `
// (A sample with any part not a number, or infinite, as nought: its bits tested, which no compiler
// may take for always false.)
fn bowlUp_clean(c: vec4f) -> vec4f {
  return select(c, vec4f(0.0), (bitcast<vec4u>(c) & vec4u(0x7fffffffu)) >= vec4u(0x7f800000u));
}

fn bowlUp_bad(c: vec4f) -> bool {
  return any((bitcast<vec4u>(c) & vec4u(0x7fffffffu)) >= vec4u(0x7f800000u));
}

// What its ray ended on (bowlResolve.mjs HIT; the alpha is 1 + it, a miss 0).
fn bowlUp_id(c: vec4f) -> u32 {
  return select(0u, u32(round(c.w)) - 1u, c.w > 0.5);
}

fn bowlUp_luma(c: vec4f) -> f32 {
  return dot(c.rgb, vec3f(0.2126, 0.7152, 0.0722));
}

// A block has changed where its new sample's luminance differs from its last one's by more than tau
// of the brighter's, or by more than a little where what its ray ended on changed too
// (bowlResolve.mjs changed).
fn bowlUp_changed(now: vec4f, before: vec4f, tau: f32) -> bool {
  let a = bowlUp_luma(now);
  let b = bowlUp_luma(before);
  return abs(a - b) > select(tau, ${f(CHANGE_TAU_HIT)}, bowlUp_id(now) != bowlUp_id(before)) * max(max(a, b), ${f(CHANGE_FLOOR)});
}
`;

/** The change test: each block's counter (texel x), set to the frames its samples must wait for where
 *  its new sample has changed from its last, else run down by one. now: the lattice just traced;
 *  before: its phase's last; last: the counters a frame ago. up: x 1 where before may be compared
 *  (traced since the bowl last moved), y tau, z 1 while the view is still (else 0 everywhere: nothing
 *  is kept), w the frames. */
export function flagsWGSL(): string {
  return /* wgsl */ `
fn bowlUp_flags(frag: vec2f, now: texture_2d<f32>, before: texture_2d<f32>, last: texture_2d<f32>, up: vec4f) -> vec4f {
  let t = vec2i(floor(frag));
  if (up.z < 0.5) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  var c = max(bowlUp_clean(textureLoad(last, t, 0)).x - 1.0, 0.0);
  if (up.x > 0.5 && bowlUp_changed(bowlUp_clean(textureLoad(now, t, 0)), bowlUp_clean(textureLoad(before, t, 0)), up.y)) { c = up.w; }
  return vec4f(c, 0.0, 0.0, 1.0);
}
${COMMON}`;
}

/** The resolve for a k x k lattice (2: four phases' lattices bound, lat0..lat3 in PHASES' order; at
 *  run time it may also resolve a 1:1 or spatial lattice, bound as latCur, phase.y 1). Each pixel's
 *  colour, and in its alpha: 1 + its hit's code where the bowl covers it (else 0), plus 32 times its
 *  sample's age (4: filled in), 256 where it or a block round it has changed, 1024 where the fish's
 *  pass must draw it again (the depth is 1 there: BowlRender's material).
 *  phase: x this frame's phase's index, y the lattice's k, z 1 where the fish is drawn again at full
 *  size, w how many of a pixel's nine blocks round it must have changed for its own sample to be
 *  filled in instead (bowlResolve.mjs WIDE_CHANGE); valid: whether each phase's samples are still
 *  good; age: theirs (frames); map: a pixel's place in this frame's lattice, pixel * xy + zw
 *  (texel-centre units). */
export function resolveWGSL(k: 2, debug: UpDebug = 0): string {
  const phases = PHASES[k];
  const lats = phases.map((_, i) => `lat${i}: texture_2d<f32>`).join(', ');
  const taps = TAP_NAMES.map((n, i) => `  let t${n} = bowlUp_tap(latCur, q + vec2i(${TAPS[i][0]}, ${TAPS[i][1]}), size);\n  let i${n} = bowlUp_id(t${n});`).join('\n');
  const bad = TAPS.map((_, i) => `bowlUp_bad(textureLoad(latCur, clamp(q + vec2i(${TAPS[i][0]}, ${TAPS[i][1]}), vec2i(0), size - 1), 0))`).join(' || ');
  // (Each of the block's samples, and which is the pixel's own: the phase whose pixel it is.)
  const own = phases.map((_, i) => `    let s${i} = bowlUp_tap(lat${i}, t, size);`).join('\n');
  const mine = phases.map(([x, y], i) => `    if (bx == ${x} && by == ${y}) { mine = ${i}u; own = s${i}; }`).join('\n');
  const fishNear = phases.map((_, i) => `(valid[${i}] > 0.5 && (bowlUp_id(s${i}) & 15u) == ${HIT.FISH}u)`).join(' || ');
  const round = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => `    { let c = bowlUp_clean(textureLoad(flags, clamp(t + vec2i(${dx}, ${dy}), vec2i(0), size - 1), 0)).x; flag = max(flag, c); wide += select(0.0, 1.0, c > 0.5); }`)).join('\n');
  const anyBad = phases.map((_, i) => `bowlUp_bad(textureLoad(lat${i}, clamp(t, vec2i(0), size - 1), 0))`).join(' || ');
  const paint = {
    0: '',
    // (A colour for each code, brighter where the ray met the water's surface on the way.)
    id: `  let hue = f32(id & 15u) * 0.618034;
  col = select(vec3f(0.0), (0.5 + 0.5 * cos(6.2831853 * (vec3f(hue) + vec3f(0.0, 0.33, 0.67)))) * select(0.45, 1.0, (id & 16u) != 0u), covered);`,
    age: `  col = select(vec3f(0.0), select(vec3f(0.9, 0.08, 0.05), mix(vec3f(0.1, 0.8, 0.15), vec3f(0.95, 0.9, 0.1), ageCode / 3.0), ageCode < 3.5), covered);`,
    changed: `  col = select(vec3f(0.0), select(vec3f(0.2) + 0.15 * min(col, vec3f(1.0)), vec3f(0.9, 0.1, 0.05), flag > 0.5), covered);`,
    nan: `  col = select(vec3f(0.15) * min(col, vec3f(1.0)), vec3f(1.0, 0.0, 1.0), sawBad);`,
  }[debug];
  return /* wgsl */ `
fn bowlUp_resolve(frag: vec2f, ${lats}, latCur: texture_2d<f32>, flags: texture_2d<f32>, phase: vec4f, valid: vec4f, age: vec4f, map: vec4f) -> vec4f {
  let p = vec2i(floor(frag));
  let size = vec2i(textureDimensions(latCur));
  let rung = phase.z > 0.5;
  // Where the pixel lies in this frame's lattice, and its 12 taps round it.
  let pp = vec2f(p) * map.xy + map.zw;
  let fp = floor(pp);
  let fr = pp - fp;
  let q = vec2i(fp);
${taps}
  // Its own sample: of the k x k lattice, its phase's (traced in its block, as it is in each phase's
  // frame); of a 1:1 lattice, this frame's.
  var own = tF;
  var inPhase = map.x == 1.0 && map.y == 1.0 && map.z == 0.0 && map.w == 0.0;
  var ownOk = false;
  var ageCode = select(4.0, 0.0, inPhase);
  var flag = 0.0;
  var wide = 0.0;
  var fishNear = false;${debug === 'nan' ? `
  var sawBad = ${bad};` : ''}
  if (phase.y > 1.5) {
    let t = vec2i(p.x / ${k}, p.y / ${k});
    let bx = p.x - t.x * ${k};
    let by = p.y - t.y * ${k};
${own}
    var mine = 0u;
${mine}
    inPhase = mine == u32(phase.x);
    // (Whether its block, or ones round it, have changed: how many of the nine.)
${round}
    let id = bowlUp_id(own);
    // Kept (an exact sample, at most ${changedFrames(k)} frames old): traced since the bowl last moved, not the
    // fish nor anything small that flies, and not where most of what is round it has changed (the
    // water churning: kept, its samples of other frames would make a comb of it).
    ownOk = valid[mine] > 0.5 && (id & 15u) != ${HIT.FISH}u && (id & 15u) != ${HIT.SPLASH}u && wide < phase.w;
    ageCode = select(4.0, age[mine], inPhase || ownOk);
    fishNear = ${fishNear};${debug === 'nan' ? `
    sawBad = sawBad || ${anyBad};` : ''}
  }
  // The fish's pass draws it again where the fish is near: this frame's nearest four samples, or
  // one of its block's still good (the fish's box, a pixel's own rays, in the last four frames; it
  // moves about a pixel a frame).
  let mark = rung && (fishNear || (iF & 15u) == ${HIT.FISH}u || (iG & 15u) == ${HIT.FISH}u || (iJ & 15u) == ${HIT.FISH}u || (iK & 15u) == ${HIT.FISH}u);
  var col = own.rgb;
  var id = bowlUp_id(own);
  var covered = id != 0u;
  if (ownOk && !inPhase && flag > 0.5) {
    // Where something round it changed, it is held within what this frame's nearest four samples
    // span (not those of the fish where its pass draws it), so it cannot lag behind what is there
    // now; nowhere else, where it is as exact as the full trace's.
    var lo = vec3f(1e30);
    var hi = vec3f(-1e30);
${['F', 'G', 'J', 'K'].map((n) => `    if (i${n} != 0u && !(rung && (i${n} & 15u) == ${HIT.FISH}u)) { lo = min(lo, t${n}.rgb); hi = max(hi, t${n}.rgb); }`).join('\n')}
    if (hi.x >= lo.x) { col = clamp(col, lo, hi); }
  }
  if (!(inPhase || ownOk)) {
    // Filled in from this frame's lattice: covered where its four nearest, by their bilinear
    // weights, mostly are; its hit that of the nearest covered one; drawn by EASU from the covered
    // taps (not the fish's where its pass draws them: their colour leaves it out).
    let wF = (1.0 - fr.x) * (1.0 - fr.y);
    let wG = fr.x * (1.0 - fr.y);
    let wJ = (1.0 - fr.x) * fr.y;
    let wK = fr.x * fr.y;
    covered = select(0.0, wF, iF != 0u) + select(0.0, wG, iG != 0u) + select(0.0, wJ, iJ != 0u) + select(0.0, wK, iK != 0u) >= 0.5;
    var best = -1.0;
    var nearC = vec3f(0.0);
    id = 0u;
${['F', 'G', 'J', 'K'].map((n) => `    if (i${n} != 0u && w${n} > best) { best = w${n}; id = i${n}; }`).join('\n')}
${['F', 'G', 'J', 'K'].map((n) => `    let u${n} = i${n} != 0u && !(rung && (i${n} & 15u) == ${HIT.FISH}u);`).join('\n')}
${['B', 'C', 'E', 'H', 'I', 'L', 'N', 'O'].map((n) => `    let u${n} = i${n} != 0u && !(rung && (i${n} & 15u) == ${HIT.FISH}u);`).join('\n')}
    // (The edge, from all twelve.)
    let lB = bowlUp_edgeLuma(tB); let lC = bowlUp_edgeLuma(tC); let lE = bowlUp_edgeLuma(tE); let lF = bowlUp_edgeLuma(tF);
    let lG = bowlUp_edgeLuma(tG); let lH = bowlUp_edgeLuma(tH); let lI = bowlUp_edgeLuma(tI); let lJ = bowlUp_edgeLuma(tJ);
    let lK = bowlUp_edgeLuma(tK); let lL = bowlUp_edgeLuma(tL); let lN = bowlUp_edgeLuma(tN); let lO = bowlUp_edgeLuma(tO);
    var dl = bowlUp_edge(vec3f(0.0), wF, lB, lE, lF, lG, lJ);
    dl = bowlUp_edge(dl, wG, lC, lF, lG, lH, lK);
    dl = bowlUp_edge(dl, wJ, lF, lI, lJ, lK, lN);
    dl = bowlUp_edge(dl, wK, lG, lJ, lK, lL, lO);
    let dirSq = dot(dl.xy, dl.xy);
    let dir = select(dl.xy / sqrt(max(dirSq, 1.0 / 32768.0)), vec2f(1.0, 0.0), dirSq < 1.0 / 32768.0);
    let len = (dl.z * 0.5) * (dl.z * 0.5);
    let stretch = dot(dir, dir) / max(abs(dir.x), abs(dir.y));
    let len2 = vec2f(1.0 + (stretch - 1.0) * len, 1.0 - 0.5 * len);
    let lob = 0.5 + (0.25 - 0.04 - 0.5) * len;
    let clp = 1.0 / lob;
    var acc = vec3f(0.0);
    var wSum = 0.0;
${TAP_NAMES.map((n, i) => `    if (u${n}) { let w = bowlUp_w(vec2f(${f(TAPS[i][0])}, ${f(TAPS[i][1])}) - fr, dir, len2, lob, clp); acc += t${n}.rgb * w; wSum += w; }`).join('\n')}
    // (No ringing: within the nearest four it draws from, or all it draws from where none of them.)
    var lo = vec3f(1e30);
    var hi = vec3f(-1e30);
${['F', 'G', 'J', 'K'].map((n) => `    if (u${n}) { lo = min(lo, t${n}.rgb); hi = max(hi, t${n}.rgb); }`).join('\n')}
    if (!(uF || uG || uJ || uK)) {
${['B', 'C', 'E', 'H', 'I', 'L', 'N', 'O'].map((n) => `      if (u${n}) { lo = min(lo, t${n}.rgb); hi = max(hi, t${n}.rgb); }`).join('\n')}
    }
    // (Too little weight left among them: the nearest, as it is.)
    best = -1.0;
${['F', 'G', 'J', 'K'].map((n) => `    if (u${n} && w${n} > best) { best = w${n}; nearC = t${n}.rgb; }`).join('\n')}
    if (best < 0.0) {
${['B', 'C', 'E', 'H', 'I', 'L', 'N', 'O'].reverse().map((n) => `      if (u${n}) { nearC = t${n}.rgb; }`).join('\n')}
    }
    col = select(nearC, clamp(acc / wSum, lo, hi), wSum >= 0.05);
  }
${paint}
  let code = select(0.0, 1.0 + f32(id), covered) + 32.0 * ageCode + select(0.0, 256.0, flag > 0.5) + select(0.0, 1024.0, mark);
  return vec4f(select(vec3f(0.0), col, covered), code);
}
fn bowlUp_tap(t: texture_2d<f32>, at: vec2i, size: vec2i) -> vec4f {
  return bowlUp_clean(textureLoad(t, clamp(at, vec2i(0), size - 1), 0));
}

// FSR 1's luminance for finding edges, squashed (x / (1 + x)) so that a glint far past white does
// not stand for every edge round it.
fn bowlUp_edgeLuma(c: vec4f) -> f32 {
  let l = 0.5 * c.r + c.g + 0.5 * c.b;
  return l / (1.0 + l);
}

// EASU's edge from one bilinear quadrant (its five taps' luminances), added to dl (direction xy,
// length z) by its weight.
fn bowlUp_edge(dl: vec3f, w: f32, a: f32, b: f32, c: f32, d: f32, e: f32) -> vec3f {
  let dirX = d - b;
  let sx = min(abs(dirX) / max(max(abs(d - c), abs(c - b)), 1.0 / 65536.0), 1.0);
  let dirY = e - a;
  let sy = min(abs(dirY) / max(max(abs(e - c), abs(c - a)), 1.0 / 65536.0), 1.0);
  return dl + vec3f(dirX * w, dirY * w, (sx * sx + sy * sy) * w);
}

// A tap's weight: Lanczos 2, approximated, shaped along the edge.
fn bowlUp_w(off: vec2f, dir: vec2f, len2: vec2f, lob: f32, clp: f32) -> f32 {
  let v = vec2f(off.x * dir.x + off.y * dir.y, -off.x * dir.y + off.y * dir.x) * len2;
  let d2 = min(dot(v, v), clp);
  let wB = 0.4 * d2 - 1.0;
  let wA = lob * d2 - 1.0;
  return (1.5625 * wB * wB - 0.5625) * wA * wA;
}

${COMMON}`;
}

/** The composite: the resolve's picture where the bowl covers it (its code's low five bits), for
 *  the frame. */
export const COMPOSITE_WGSL = /* wgsl */ `
fn bowlUp_composite(frag: vec2f, picture: texture_2d<f32>) -> vec4f {
  let c = textureLoad(picture, vec2i(floor(frag)), 0);
  return vec4f(c.rgb, select(0.0, 1.0, (u32(c.w) & 31u) != 0u));
}
`;

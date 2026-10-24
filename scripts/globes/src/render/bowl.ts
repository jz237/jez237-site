// The betta's globe is a betta bowl: the glass is cut open at the top, a rolled bead of glass
// runs round its mouth, and a loose glass lid rests on the bead (it lifts off and goes back on:
// BowlLid.ts). The globe's shader (shaders.ts, its bowl variant) traces the mouth, where there is
// no glass, and the bead and the lid, solid glass marched as distance fields, refracting and
// reflecting the way the globe's own glass does. The water is held under the mouth (FluidSim's
// mouth; g2p.wgsl).
//
// World units (the glass's outer radius is 1, ~12 cm), in the globe's own frame, its axis up.

import type { GlobeConfig } from '../config';

export const BOWL = {
  /** The plane the glass is cut off at, along the globe's axis: the mouth (~11 cm across). */
  mouth: 0.88,
  /** The rim's bead: a torus round the mouth, its tube's radius (~2 mm), sunk this far under the
   *  cut so it runs into the wall. */
  beadRadius: 0.016,
  beadSink: 0.004,
  /** The lid: a disc of glass (~3.4 mm thick), its edge rounded right over, overhanging the bead
   *  by ~6 mm. */
  lidRadius: 0.53,
  lidThickness: 0.032,
  /** Its knob: a short stem and a rounded cap (~14 mm across), run into the disc. */
  stemRadius: 0.024,
  stemHeight: 0.028,
  knobRadius: 0.06,
  /** Under it, a collar that drops into the mouth (clear of the bead) so it cannot slide off. */
  collarWall: 0.008,
  collarDepth: 0.035,
  collarClearance: 0.008,
  /** Air vents (a betta breathes air at the surface): a ring of round holes through the disc. */
  vents: 8,
  ventRing: 0.3,
  ventRadius: 0.013,
  /** The water stays under this plane (along the axis), just under the collar's foot. */
  waterCeiling: 0.85,
} as const;

export interface BowlShape {
  /** The radius of the bead's ring (midway through the cut wall). */
  bead: number;
  /** The height of the bead's centre, and of its top: where the lid's underside rests. */
  beadY: number;
  seat: number;
  /** The collar's radius (the middle of its wall). */
  collar: number;
  /** The lid's highest point above its underside (the knob's top). */
  top: number;
  /** The lid's reach from its underside's middle (for the geometry the bowl is drawn on). */
  reach: number;
}

export function bowlShape(globe: GlobeConfig): BowlShape {
  const h = BOWL.mouth;
  const outer = Math.sqrt(globe.outerRadius ** 2 - h * h);
  const inner = Math.sqrt(globe.innerRadius ** 2 - h * h);
  const bead = (outer + inner) / 2;
  const beadY = h - BOWL.beadSink;
  const top = BOWL.lidThickness + BOWL.stemHeight + 1.5 * BOWL.knobRadius;
  return {
    bead,
    beadY,
    seat: beadY + BOWL.beadRadius,
    collar: bead - BOWL.beadRadius - BOWL.collarClearance - BOWL.collarWall / 2,
    top,
    reach: Math.hypot(BOWL.lidRadius, Math.max(top, BOWL.collarDepth)),
  };
}

/** The bowl's uniforms, as globes_shade takes them: the lid's pose (the globe's translating frame
 *  to the lid's: its underside's middle at the origin, its axis y) and x: the lid is there. */
export const BOWL_PARAMS = ', bowlLid: mat4x4f, bowlState: vec4f';

const f = (x: number) => x.toFixed(6);

/** The bowl's glass, for the globe's shader (needs globes_bg, globes_fresnel, GLOBES_GLASS_ABS). */
export function bowlWGSL(s: BowlShape): string {
  return /* wgsl */ `
// ---- the betta bowl (src/render/bowl.ts) -----------------------------------------------
const BOWL_MOUTH: f32 = ${f(BOWL.mouth)};
const BOWL_BEAD_R: f32 = ${f(s.bead)};
const BOWL_BEAD_Y: f32 = ${f(s.beadY)};
const BOWL_BEAD_T: f32 = ${f(BOWL.beadRadius)};
const BOWL_LID_R: f32 = ${f(BOWL.lidRadius)};
const BOWL_LID_T: f32 = ${f(BOWL.lidThickness)};
const BOWL_STEM_R: f32 = ${f(BOWL.stemRadius)};
const BOWL_STEM_H: f32 = ${f(BOWL.stemHeight)};
const BOWL_KNOB_R: f32 = ${f(BOWL.knobRadius)};
const BOWL_COLLAR_R: f32 = ${f(s.collar)};
const BOWL_COLLAR_W: f32 = ${f(BOWL.collarWall)};
const BOWL_COLLAR_D: f32 = ${f(BOWL.collarDepth)};
const BOWL_VENTS: f32 = ${f(BOWL.vents)};
const BOWL_VENT_RING: f32 = ${f(BOWL.ventRing)};
const BOWL_VENT_R: f32 = ${f(BOWL.ventRadius)};
const BOWL_LID_TOP: f32 = ${f(s.top)};
const BOWL_IOR: f32 = 1.5;
// A surface is met within this of it (world units); and a step inside the glass, at least.
const BOWL_EPS: f32 = 1.5e-4;

// Set by globes_shade: the globe's turn (its frame to the translating one), the lid's pose (the
// translating frame to the lid's) and whether the lid is there.
var<private> bowlRot: mat3x3f;
var<private> bowlM: mat4x4f;
var<private> bowlLidOn: bool;

// In the open mouth (a point on or in the glass's sphere): above the plane the glass is cut at.
fn bowl_inMouth(p: vec3f) -> bool {
  return dot(p, bowlRot[1]) > BOWL_MOUTH;
}

fn bowl_smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// The rim's bead (the globe's frame).
fn bowl_beadSdf(q: vec3f) -> f32 {
  return length(vec2f(length(q.xz) - BOWL_BEAD_R, q.y - BOWL_BEAD_Y)) - BOWL_BEAD_T;
}

// The lid (its own frame: its underside's middle at the origin).
fn bowl_lidSdf(q: vec3f) -> f32 {
  let r = length(q.xz);
  let th = 0.5 * BOWL_LID_T;
  // The disc, its edge rounded right over.
  var d = length(vec2f(max(r - (BOWL_LID_R - th), 0.0), q.y - th)) - th;
  // Its vents, through it.
  let sector = 6.2831853 / BOWL_VENTS;
  let a = (fract(atan2(q.z, q.x) / sector + 0.5) - 0.5) * sector;
  d = max(d, BOWL_VENT_R - length(vec2f(r * cos(a) - BOWL_VENT_RING, r * sin(a))));
  // The knob: a stem (from inside the disc) and a rounded cap on it, like a mushroom's.
  let sh = 0.5 * (BOWL_STEM_H + th);
  let ws = vec2f(r - BOWL_STEM_R, abs(q.y - (BOWL_LID_T + BOWL_STEM_H - sh)) - sh);
  let stem = min(max(ws.x, ws.y), 0.0) + length(max(ws, vec2f(0.0)));
  let kh = 0.75 * BOWL_KNOB_R;
  let kround = 0.6 * kh;
  let wk = vec2f(r - (BOWL_KNOB_R - kround), abs(q.y - (BOWL_LID_T + BOWL_STEM_H + kh)) - (kh - kround));
  let cap = min(max(wk.x, wk.y), 0.0) + length(max(wk, vec2f(0.0))) - kround;
  d = bowl_smin(d, bowl_smin(stem, cap, 0.01), 0.008);
  // The collar under it, its edges eased.
  let wc = vec2f(abs(r - BOWL_COLLAR_R) - 0.5 * BOWL_COLLAR_W + 0.0015, abs(q.y + 0.5 * BOWL_COLLAR_D) - 0.5 * BOWL_COLLAR_D);
  let collar = min(max(wc.x, wc.y), 0.0) + length(max(wc, vec2f(0.0))) - 0.0015;
  return bowl_smin(d, collar, 0.004);
}

// part 1: the bead (q in the globe's frame); 2: the lid (q in its own).
fn bowl_sdf(part: u32, q: vec3f) -> f32 {
  if (part == 1u) { return bowl_beadSdf(q); }
  return bowl_lidSdf(q);
}

fn bowl_normal(part: u32, q: vec3f) -> vec3f {
  let e = vec2f(1.0, -1.0) * BOWL_EPS;
  return normalize(e.xyy * bowl_sdf(part, q + e.xyy) + e.yyx * bowl_sdf(part, q + e.yyx)
    + e.yxy * bowl_sdf(part, q + e.yxy) + e.xxx * bowl_sdf(part, q + e.xxx));
}

// Where a ray is within the upright cylinder r <= rad, lo <= y <= hi, ahead of its origin:
// (t0, t1), t0 > t1 if nowhere.
fn bowl_span(o: vec3f, d: vec3f, rad: f32, lo: f32, hi: f32) -> vec2f {
  var t0 = 0.0;
  var t1 = 1e9;
  if (abs(d.y) < 1e-7) {
    if (o.y < lo || o.y > hi) { return vec2f(1.0, 0.0); }
  } else {
    let a = (lo - o.y) / d.y;
    let b = (hi - o.y) / d.y;
    t0 = max(t0, min(a, b));
    t1 = min(t1, max(a, b));
  }
  let A = dot(d.xz, d.xz);
  let B = dot(o.xz, d.xz);
  let C = dot(o.xz, o.xz) - rad * rad;
  if (A < 1e-12) {
    if (C > 0.0) { return vec2f(1.0, 0.0); }
  } else {
    let disc = B * B - A * C;
    if (disc < 0.0) { return vec2f(1.0, 0.0); }
    let sq = sqrt(disc);
    t0 = max(t0, (-B - sq) / A);
    t1 = min(t1, (-B + sq) / A);
  }
  return vec2f(t0, t1);
}

// A piece of the bowl's glass met along a ray: where (t, along the ray in the translating frame),
// which (0: none), and the ray in that piece's frame.
struct BowlHit {
  t: f32,
  part: u32,
  o: vec3f,
  d: vec3f,
}

fn bowl_march(part: u32, o: vec3f, d: vec3f, span: vec2f) -> f32 {
  if (span.x > span.y) { return 1e9; }
  var t = span.x;
  for (var i = 0; i < 80; i++) {
    let s = bowl_sdf(part, o + d * t);
    if (s < BOWL_EPS) { return t; }
    t += max(0.9 * s, 0.5 * BOWL_EPS);
    if (t > span.y) { break; }
  }
  return 1e9;
}

// The nearest of the bowl's glass along a ray (o, d in the translating frame; d of unit length).
// A ray that starts inside a piece is in it at t = 0.
fn bowl_hit(o: vec3f, d: vec3f) -> BowlHit {
  var best = BowlHit(1e9, 0u, vec3f(0.0), vec3f(0.0));
  let ob = transpose(bowlRot) * o;
  let db = transpose(bowlRot) * d;
  let pad = 2.0 * BOWL_EPS;
  if (bowl_beadSdf(ob) < 0.0) { return BowlHit(0.0, 1u, ob, db); }
  let tb = bowl_march(1u, ob, db, bowl_span(ob, db, BOWL_BEAD_R + BOWL_BEAD_T + pad, BOWL_BEAD_Y - BOWL_BEAD_T - pad, BOWL_BEAD_Y + BOWL_BEAD_T + pad));
  if (tb < best.t) { best = BowlHit(tb, 1u, ob, db); }
  if (bowlLidOn) {
    let r = mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz);
    let ol = (bowlM * vec4f(o, 1.0)).xyz;
    let dl = r * d;
    if (bowl_lidSdf(ol) < 0.0) { return BowlHit(0.0, 2u, ol, dl); }
    let tl = bowl_march(2u, ol, dl, bowl_span(ol, dl, BOWL_LID_R + pad, -BOWL_COLLAR_D - pad, BOWL_LID_TOP + pad));
    if (tl < best.t) { best = BowlHit(tl, 2u, ol, dl); }
  }
  return best;
}

// A piece's frame back to the translating frame (a direction).
fn bowl_toWorld(part: u32, v: vec3f) -> vec3f {
  if (part == 1u) { return bowlRot * v; }
  return transpose(mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz)) * v;
}

fn bowl_pointToWorld(part: u32, q: vec3f) -> vec3f {
  if (part == 1u) { return bowlRot * q; }
  return transpose(mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz)) * (q - bowlM[3].xyz);
}

// Through the piece a ray has met (h): the light its face reflects to the ray, how much of the
// ray's light comes through it (absorbed on the way, a share reflected at each face), and where
// and which way the ray leaves it (the translating frame). Inside, a ray that meets a face past
// the critical angle is turned back in (the glass's edges carry light round); after a few such
// turns it is let out as it is.
struct BowlPass {
  col: vec3f,
  T: vec3f,
  p: vec3f,
  d: vec3f,
}

fn bowl_through(h: BowlHit, bgTex: texture_2d<f32>, bgSamp: sampler) -> BowlPass {
  let part = h.part;
  var q = h.o + h.d * h.t;
  var d = h.d;
  var col = vec3f(0.0);
  var T = vec3f(1.0);
  let pw = bowl_pointToWorld(part, q);
  if (bowl_sdf(part, q) > -BOWL_EPS) {
    // In through the face it meets.
    let n = bowl_normal(part, q);
    let F = globes_fresnel(clamp(-dot(d, n), 0.0, 1.0), 1.0, BOWL_IOR);
    col = F * globes_bg(bgTex, bgSamp, pw, bowl_toWorld(part, reflect(d, n)));
    T = vec3f(1.0 - F);
    let dIn = refract(d, n, 1.0 / BOWL_IOR);
    if (dot(dIn, dIn) > 0.5) { d = dIn; }
    q -= n * (2.0 * BOWL_EPS);
  }
  var len = 0.0;
  var turns = 0;
  for (var i = 0; i < 128; i++) {
    let s = -bowl_sdf(part, q);
    if (s < BOWL_EPS) {
      // A face, from inside: out through it, or back in.
      let m = bowl_normal(part, q);
      let out = refract(d, -m, BOWL_IOR);
      if (dot(out, out) < 0.5 && turns < 4) {
        d = reflect(d, m);
        q -= m * (2.0 * BOWL_EPS);
        turns++;
        continue;
      }
      var leave = d;
      var Fo = 0.0;
      if (dot(out, out) > 0.5) {
        leave = out;
        Fo = globes_fresnel(clamp(dot(d, m), 0.0, 1.0), BOWL_IOR, 1.0);
      }
      T *= (1.0 - Fo) * exp(-GLOBES_GLASS_ABS * len);
      return BowlPass(col, T, bowl_pointToWorld(part, q + m * (2.0 * BOWL_EPS)), normalize(bowl_toWorld(part, leave)));
    }
    let step = max(s, BOWL_EPS);
    q += d * step;
    len += step;
  }
  // (Still inside after all that, carried along the glass: out as it goes.)
  return BowlPass(col, T * exp(-GLOBES_GLASS_ABS * len), bowl_pointToWorld(part, q), normalize(bowl_toWorld(part, d)));
}
`;
}

// The betta's globe is a betta bowl: the glass is cut open at the top, a rolled bead of glass
// runs round its mouth, and a loose lid rests on the bead (it lifts off and goes back on:
// BowlLid.ts): a clear glass disc in a glossy black rim, a black knob on top and, under its
// middle, the lamp (an LED puck) that lights the bowl. The globe's shader (shaders.ts, its bowl
// variant) traces the mouth, where there is no glass, and the bead and the lid, marched as distance
// fields: the glass refracting and reflecting the way the globe's own glass does, the black parts
// opaque. The water is held under the mouth (FluidSim's mouth; g2p.wgsl).
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
   *  by ~6 mm; its outer ~9 mm held in a black rim that wraps its edge, standing this proud of the
   *  glass above and below. */
  lidRadius: 0.53,
  lidThickness: 0.032,
  rimWidth: 0.075,
  rimProud: 0.004,
  /** Its knob: a black cylinder (~12 mm across, ~6 mm tall), its edges eased. */
  knobRadius: 0.05,
  knobHeight: 0.05,
  /** The lamp under its middle: a puck (~10 mm across, ~1.5 mm deep), its face glowing. */
  puckRadius: 0.042,
  puckDepth: 0.012,
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
  /** Where the glass ends and the rim begins (radius). */
  rimIn: number;
  /** A phone's lighter bowl: its shader leaves out what is costly and hardly seen at that size
   *  (the fish's self-shadow and its shadow on the bed, the furnishings' shadows, the motes and
   *  shafts in the water), follows a ray through the lid's glass for fewer steps and samples the
   *  lamp's haze more sparsely. */
  lite: boolean;
  /** ?debug (bowlDebug): its shader paints what each pixel's ray met that could make a speck
   *  (specks), or where on the way its light stopped being a number (nan): shaders.ts
   *  globesDebugWGSL. 0: neither, the bowl as it is. */
  debug: BowlDebug;
}

/** 0: no debug view; 1: ?debug=specks; 2: ?debug=nan. */
export type BowlDebug = 0 | 1 | 2;

/** The debug view a page's ?debug asks for (BowlShape.debug). */
export function bowlDebug(param: string | null): BowlDebug {
  return param === 'specks' ? 1 : param === 'nan' ? 2 : 0;
}

export function bowlShape(globe: GlobeConfig, lite = false, debug: BowlDebug = 0): BowlShape {
  const h = BOWL.mouth;
  const outer = Math.sqrt(globe.outerRadius ** 2 - h * h);
  const inner = Math.sqrt(globe.innerRadius ** 2 - h * h);
  const bead = (outer + inner) / 2;
  const beadY = h - BOWL.beadSink;
  const top = BOWL.lidThickness + BOWL.knobHeight;
  return {
    bead,
    beadY,
    seat: beadY + BOWL.beadRadius,
    collar: bead - BOWL.beadRadius - BOWL.collarClearance - BOWL.collarWall / 2,
    top,
    rimIn: BOWL.lidRadius - BOWL.rimWidth,
    lite,
    debug,
  };
}

/** How far the lid reaches from a point c (in the lid's own frame: its underside's middle at the
 *  origin, its axis y): to the furthest of it, taken as two upright cylinders round its axis, the
 *  rim's (the glass, the collar and the lamp lie within it) and the knob's. (For the geometry the
 *  bowl is drawn on: seated, ~1.07 from the globe's centre, the rim's outer top edge.) */
export function lidReach(s: BowlShape, c: { x: number; y: number; z: number }): number {
  const off = Math.hypot(c.x, c.z);
  const far = (rad: number, lo: number, hi: number): number => Math.hypot(off + rad, Math.max(hi - c.y, c.y - lo));
  return Math.max(far(BOWL.lidRadius + BOWL.rimProud, -BOWL.collarDepth, BOWL.lidThickness + BOWL.rimProud), far(BOWL.knobRadius, 0, s.top));
}

/** The bowl's uniforms, as globes_shade takes them: the lid's pose (the globe's translating frame
 *  to the lid's: its underside's middle at the origin, its axis y); x: the lid is there, y: its
 *  lamp's brightness (0..1); what floats in it; and its detail (GlobeView uBowlDetail). */
export const BOWL_PARAMS = ', bowlLid: mat4x4f, bowlState: vec4f, bowlLife: mat4x4f, bowlDetail: vec4f';

const f = (x: number) => x.toFixed(6);

/** The bowl's glass, for the globe's shader (needs globes_bg, globes_fresnel, GLOBES_GLASS_ABS,
 *  globesZero). */
export function bowlWGSL(s: BowlShape): string {
  return /* wgsl */ `
// ---- the betta bowl (src/render/bowl.ts) -----------------------------------------------
const BOWL_MOUTH: f32 = ${f(BOWL.mouth)};
const BOWL_BEAD_R: f32 = ${f(s.bead)};
const BOWL_BEAD_Y: f32 = ${f(s.beadY)};
const BOWL_BEAD_T: f32 = ${f(BOWL.beadRadius)};
const BOWL_LID_R: f32 = ${f(BOWL.lidRadius)};
const BOWL_LID_T: f32 = ${f(BOWL.lidThickness)};
const BOWL_RIM_IN: f32 = ${f(s.rimIn)};
const BOWL_RIM_PROUD: f32 = ${f(BOWL.rimProud)};
const BOWL_KNOB_R: f32 = ${f(BOWL.knobRadius)};
const BOWL_KNOB_H: f32 = ${f(BOWL.knobHeight)};
const BOWL_PUCK_R: f32 = ${f(BOWL.puckRadius)};
const BOWL_PUCK_D: f32 = ${f(BOWL.puckDepth)};
// The lamp's face: radiance at full brightness (warm white, HDR), and its light's cone (the cosine
// of its half-angle at the edge, and inside which it is full).
const BOWL_LAMP: vec3f = vec3f(60.0, 52.0, 40.0);
const BOWL_LAMP_COS_OUT: f32 = 0.55;
const BOWL_LAMP_COS_IN: f32 = 0.9;
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
// The lamp (set with the lid): its face's middle and the way it shines (the translating frame),
// and its brightness (0..1).
var<private> bowlLampP: vec3f;
var<private> bowlLampD: vec3f;
var<private> bowlLamp: f32;

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

// A rounded box in a plane (centred, half-size h, its corners rounded by k).
fn bowl_box2(p: vec2f, h: vec2f, k: f32) -> f32 {
  let w = abs(p) - h + vec2f(k);
  return min(max(w.x, w.y), 0.0) + length(max(w, vec2f(0.0))) - k;
}

// The lid's glass (its own frame: its underside's middle at the origin): the disc, its edge
// rounded right over (hidden in the rim), and its vents through it.
fn bowl_lidSdf(q: vec3f) -> f32 {
  let r = length(q.xz);
  let th = 0.5 * BOWL_LID_T;
  var d = length(vec2f(max(r - (BOWL_LID_R - th), 0.0), q.y - th)) - th;
  // (It runs a little way into the rim, so no face of it shows there.)
  d = max(d, r - (BOWL_RIM_IN + 0.003));
  let sector = 6.2831853 / BOWL_VENTS;
  // (atan2 given an angle on the axis too, where a GPU that follows SPIR-V's rules need not.)
  let a = (fract(atan2(q.z, select(q.x, 1e-20, q.x == 0.0 && q.z == 0.0)) / sector + 0.5) - 0.5) * sector;
  return max(d, BOWL_VENT_R - length(vec2f(r * cos(a) - BOWL_VENT_RING, r * sin(a))));
}

// The lid's black parts (its own frame): the rim round the glass's edge, the knob, the collar under
// it and the lamp's puck under its middle.
fn bowl_lidBlackSdf(q: vec3f) -> f32 {
  let r = length(q.xz);
  let rim = bowl_box2(vec2f(r - 0.5 * (BOWL_RIM_IN + BOWL_LID_R + BOWL_RIM_PROUD), q.y - 0.5 * BOWL_LID_T), vec2f(0.5 * (BOWL_LID_R + BOWL_RIM_PROUD - BOWL_RIM_IN), 0.5 * BOWL_LID_T + BOWL_RIM_PROUD), 0.006);
  let knob = bowl_box2(vec2f(r, q.y - (BOWL_LID_T + 0.5 * BOWL_KNOB_H - 0.002)), vec2f(BOWL_KNOB_R, 0.5 * BOWL_KNOB_H + 0.002), 0.008);
  let wc = vec2f(abs(r - BOWL_COLLAR_R) - 0.5 * BOWL_COLLAR_W + 0.0015, abs(q.y + 0.5 * BOWL_COLLAR_D) - 0.5 * BOWL_COLLAR_D);
  let collar = min(max(wc.x, wc.y), 0.0) + length(max(wc, vec2f(0.0))) - 0.0015;
  let puck = bowl_box2(vec2f(r, q.y + 0.5 * BOWL_PUCK_D - 0.001), vec2f(BOWL_PUCK_R, 0.5 * BOWL_PUCK_D + 0.001), 0.003);
  return min(min(bowl_smin(rim, collar, 0.004), knob), puck);
}

// part 1: the bead (q in the globe's frame); 2: the lid's glass, 3: its black parts (q in its own).
fn bowl_sdf(part: u32, q: vec3f) -> f32 {
  if (part == 1u) { return bowl_beadSdf(q); }
  if (part == 3u) { return bowl_lidBlackSdf(q); }
  return bowl_lidSdf(q);
}

// (The field at a tetrahedron's corners round q in turn, e.xyy, e.yyx, e.yxy and e.xxx, from one
// place: see shaders.ts globesZero.)
fn bowl_normal(part: u32, q: vec3f) -> vec3f {
  let e = vec2f(1.0, -1.0) * BOWL_EPS;
  var g = vec3f(0.0);
  for (var k = globesZero; k < 4; k++) {
    let o = select(e.yyy, e.xxx, vec3<bool>((k & 1) == (k >> 1u), k > 1, (k & 1) == 1));
    g += o * bowl_sdf(part, q + o);
  }
  return normalize(g);
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

// Whether a point is within the upright cylinder r <= rad, lo <= y <= hi.
fn bowl_within(q: vec3f, rad: f32, lo: f32, hi: f32) -> bool {
  return dot(q.xz, q.xz) <= rad * rad && q.y >= lo && q.y <= hi;
}

// The nearest of the bowl's glass along a ray (o, d in the translating frame; d of unit length).
// A ray that starts inside a piece is in it at t = 0. (Each piece lies within its cylinder, so a
// ray can start inside it only from there.)
fn bowl_hit(o: vec3f, d: vec3f) -> BowlHit {
  var best = BowlHit(1e9, 0u, vec3f(0.0), vec3f(0.0));
  let ob = transpose(bowlRot) * o;
  let db = transpose(bowlRot) * d;
  let pad = 2.0 * BOWL_EPS;
  let beadR = BOWL_BEAD_R + BOWL_BEAD_T + pad;
  let beadLo = BOWL_BEAD_Y - BOWL_BEAD_T - pad;
  let beadHi = BOWL_BEAD_Y + BOWL_BEAD_T + pad;
  if (bowl_within(ob, beadR, beadLo, beadHi) && bowl_beadSdf(ob) < 0.0) { return BowlHit(0.0, 1u, ob, db); }
  let tb = bowl_march(1u, ob, db, bowl_span(ob, db, beadR, beadLo, beadHi));
  if (tb < best.t) { best = BowlHit(tb, 1u, ob, db); }
  if (bowlLidOn) {
    let r = mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz);
    let ol = (bowlM * vec4f(o, 1.0)).xyz;
    let dl = r * d;
    let lidR = BOWL_LID_R + BOWL_RIM_PROUD + pad;
    let lidLo = -BOWL_COLLAR_D - pad;
    let lidHi = BOWL_LID_TOP + pad;
    if (bowl_within(ol, lidR, lidLo, lidHi)) {
      if (bowl_lidBlackSdf(ol) < 0.0) { return BowlHit(0.0, 3u, ol, dl); }
      if (bowl_lidSdf(ol) < 0.0) { return BowlHit(0.0, 2u, ol, dl); }
    }
    let span = bowl_span(ol, dl, lidR, lidLo, lidHi);
    let tl = bowl_march(2u, ol, dl, span);
    if (tl < best.t) { best = BowlHit(tl, 2u, ol, dl); }
    let tk = bowl_march(3u, ol, dl, span);
    if (tk < best.t) { best = BowlHit(tk, 3u, ol, dl); }
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

// The light a black part of the lid sends back along the ray that met it (h): glossy black
// plastic mirroring the studio, or the lamp's glowing face.
fn bowl_blackShade(h: BowlHit, bgTex: texture_2d<f32>, bgSamp: sampler) -> vec3f {
  let q = h.o + h.d * h.t;
  let nl = bowl_normal(3u, q);
  let r = length(q.xz);
  if (nl.y < -0.7 && r < BOWL_PUCK_R - 0.003 && q.y < -BOWL_PUCK_D + 0.002) {
    // (Its diffuser: brightest in its middle, a dimmer ring round it.)
    return BOWL_LAMP * bowlLamp * (1.0 - 0.4 * smoothstep(0.25 * BOWL_PUCK_R, BOWL_PUCK_R, r)) + vec3f(0.02);
  }
  let n = bowl_toWorld(3u, nl);
  let d = bowl_toWorld(3u, h.d);
  let cosI = clamp(-dot(d, n), 0.0, 1.0);
  let F = 0.045 + 0.955 * pow(1.0 - cosI, 5.0);
  let up = max(dot(n, GLOBES_SUN_DIR), 0.0);
  return F * globes_bg(bgTex, bgSamp, bowl_pointToWorld(3u, q), reflect(d, n)) + vec3f(0.006, 0.0065, 0.008) * (0.4 + 0.6 * up);
}

// The lamp's light at x (the translating frame), along the way it shines: its cone, falling off
// with the square of the distance (irradiance, at full brightness 1 at 0.4 from its face).
fn bowl_lampAt(x: vec3f) -> f32 {
  let v = x - bowlLampP;
  let d2 = max(dot(v, v), 1e-4);
  let c = dot(v, bowlLampD) * inverseSqrt(d2);
  return bowlLamp * smoothstep(BOWL_LAMP_COS_OUT, BOWL_LAMP_COS_IN, c) * 0.16 / d2;
}

// The lamp's light scattered towards the eye along a stretch of ray (p, dir, to tEnd): the haze of
// its cone in the air or the water, streaked like light through a lid's diffuser (sigma: how much
// the medium scatters; T: how much it lets through a unit of path). The rays.
fn bowl_lampAlong(p: vec3f, dir: vec3f, tEnd: f32, sigma: f32, ext: vec3f) -> vec3f {
  if (bowlLamp <= 0.0) { return vec3f(0.0); }
  let n = ${s.lite ? 4 : 10};
  let dt = tEnd / f32(n);
  var s = vec3f(0.0);
  let side = normalize(cross(bowlLampD, select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(bowlLampD.x) > 0.9)));
  let side2 = cross(bowlLampD, side);
  // (Dimmed by the medium on its way back to p: a step's worth more at each sample.)
  var T = exp(-ext * (0.5 * dt));
  let Tstep = exp(-ext * dt);
  for (var i = 0; i < n; i++) {
    let x = p + dir * ((f32(i) + 0.5) * dt);
    let v = x - bowlLampP;
    let ay = dot(v, side2);
    let ax = dot(v, side);
    let a = atan2(ay, select(ax, 1e-20, ax == 0.0 && ay == 0.0));
    let rays = 0.55 + 0.45 * sin(a * 17.0 + 1.7 * sin(a * 5.0)) * sin(a * 29.0 + 0.6);
    s += bowl_lampAt(x) * rays * T;
    T *= Tstep;
  }
  return ${s.debug ? 'dbg_chk(' : ''}vec3f(1.0, 0.88, 0.70) * s * sigma * dt${s.debug ? ', select(DBG_LAMP_WATER, DBG_LAMP_AIR, sigma < 0.3))' : ''};
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
  for (var i = 0; i < ${s.lite ? 64 : 128}; i++) {
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

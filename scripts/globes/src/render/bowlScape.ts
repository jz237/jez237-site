// What lives in the betta bowl besides the fish (its page only): on its bed of sand (FluidSim's),
// the furnishings (a driftwood arch, rocks, two plants, a heater and a sponge filter: scape/,
// triangle meshes in a BVH, fixed to the bowl, they turn with it), an Indian almond leaf floating
// on the water, and the bubble nest the betta keeps against the glass at the waterline
// (interaction/BowlLife.ts moves both, from the water's probes). All of it is traced in the bowl's
// shader (shaders.ts, in globes_trace's segments) on the same refracted rays as the water and the
// fish: the furnishings through their BVH (bound in the kelp's slot, which this globe does not
// use), the leaf as a curved blade met analytically, the nest as thin films.
//
// World units (the glass's outer radius is 1, ~12 cm); the bowl's own frame, its axis up.

import { BED_LEVEL } from './scape/mesh.mjs';
import { nest } from './scape/nest.mjs';

/** The nest's bubbles (scape/nest.mjs), made as the page loads, while the furnishings' worker is
 *  busy: the page counts them, and writes them into the furnishings' texture (furnishings.ts). */
export const NEST = nest();

let meshWGSL: string | null = null;

/** The furnishings' shader code (scape/scapeShader.mjs: their BVH's walk and their materials),
 *  loaded with them on the bowl's page (main.ts: scape/furnishings.ts) before its shader is
 *  built. */
export function setScapeShader(wgsl: string): void {
  meshWGSL = wgsl;
}

/** The bed: the sand's height at rest (FluidSim's sandLevel on this page; scape/mesh.mjs). */
export const BED = { level: BED_LEVEL };

/** The floating Indian almond (catappa) leaf: a small dried one, ~5 cm, brown, its widest part
 *  towards its tip; its length and half-width, how its sides and ends curl up out of the water. */
export const LEAF = { length: 0.42, width: 0.115, cup: 0.012, arch: 0.016 };

const f = (x: number) => x.toFixed(6);

/** The bowl's contents, for the globe's shader (after bowlWGSL; needs globes_bg, globes_fresnel,
 *  globes_noise3, globes_hash3, globes_sunIn, betta_dapple and the sky/sun constants). The ray
 *  functions take points and directions in the translating frame; scapeRot is the bowl's turn. */
export function bowlScapeWGSL(radius: number, lite = false): string {
  if (meshWGSL === null) throw new Error("bowlScape: the furnishings' shader is not loaded (setScapeShader)");
  return /* wgsl */ `
// ---- the betta bowl's contents (src/render/bowlScape.ts) -------------------------------------
const SCAPE_LEAF_L: f32 = ${f(LEAF.length)};
const SCAPE_LEAF_W: f32 = ${f(LEAF.width)};
const SCAPE_LEAF_CUP: f32 = ${f(LEAF.cup)};
const SCAPE_LEAF_ARCH: f32 = ${f(LEAF.arch)};
const SCAPE_NEST_N: u32 = ${NEST.length}u;
const SCAPE_R: f32 = ${f(radius)};

// Set by globes_shade: the bowl's turn, and what moves (BowlLife.ts): columns 0 and 1 the leaf (its
// middle, its heading; the film's slope under it, x: 1 when it is there), 2 and 3 the nest (its
// heart on the glass at the waterline, its bearing; how many bubbles it has).
var<private> scapeRot: mat3x3f;
var<private> scapeLife: mat4x4f;

// ---- helpers ------------------------------------------------------------------------------
fn scape_hash3v(p: vec3f) -> vec3f {
  return vec3f(globes_hash3(p), globes_hash3(p + vec3f(17.13, 3.71, 9.27)), globes_hash3(p + vec3f(41.9, 27.3, 5.83)));
}

// A ray (o, d; d of unit length) against a capsule: the distance to it ahead, or -1.
fn scape_capsule(o: vec3f, d: vec3f, pa: vec3f, pb: vec3f, r: f32) -> f32 {
  let ba = pb - pa;
  let oa = o - pa;
  let baba = dot(ba, ba);
  let bard = dot(ba, d);
  let baoa = dot(ba, oa);
  let rdoa = dot(d, oa);
  let oaoa = dot(oa, oa);
  let a = baba - bard * bard;
  let b = baba * rdoa - baoa * bard;
  let c = baba * oaoa - baoa * baoa - r * r * baba;
  let h = b * b - a * c;
  if (h < 0.0) { return -1.0; }
  let t = (-b - sqrt(h)) / max(a, 1e-12);
  let y = baoa + t * bard;
  if (y > 0.0 && y < baba && t > 0.0) { return t; }
  // (The caps.)
  let oc = select(o - pb, oa, y <= 0.0);
  let b2 = dot(d, oc);
  let c2 = dot(oc, oc) - r * r;
  let h2 = b2 * b2 - c2;
  if (h2 > 0.0) {
    let t2 = -b2 - sqrt(h2);
    if (t2 > 0.0) { return t2; }
  }
  return -1.0;
}

fn scape_capNormal(p: vec3f, pa: vec3f, pb: vec3f) -> vec3f {
  let ba = pb - pa;
  let h = clamp(dot(p - pa, ba) / dot(ba, ba), 0.0, 1.0);
  return normalize(p - pa - ba * h);
}

fn scape_box(o: vec3f, d: vec3f, lo: vec3f, hi: vec3f, tEnd: f32) -> bool {
  let inv = 1.0 / select(d, vec3f(1e-8), abs(d) < vec3f(1e-8));
  let a = (lo - o) * inv;
  let b = (hi - o) * inv;
  let mn = min(a, b);
  let mx = max(a, b);
  return max(max(mn.x, mn.y), max(mn.z, 0.0)) <= min(min(mx.x, mx.y), min(mx.z, tEnd));
}

// A curved blade (its base at the origin, u along it, v across, w off its face): its surface
// w = arch (u / L)^2 + cup (v / W)^2, inside its outline (half-width at s = u / L: shape, 0..1).
// The nearer crossing ahead of a ray in its frame (o, d), before tEnd: (t, u, v), t < 0 if none.
fn scape_bladeCross(o: vec3f, d: vec3f, L: f32, W: f32, arch: f32, cup: f32, tEnd: f32, almond: bool) -> vec3f {
  let ka = arch / (L * L);
  let kc = cup / (W * W);
  // (The almond leaf curls up at both ends: its arch is about its middle.)
  let ou = select(o.x, o.x - 0.5 * L, almond);
  let A = ka * d.x * d.x + kc * d.z * d.z;
  let B = 2.0 * (ka * ou * d.x + kc * o.z * d.z) - d.y;
  let C = ka * ou * ou + kc * o.z * o.z - o.y;
  var t0 = -1.0;
  var t1 = -1.0;
  if (abs(A) < 1e-9) {
    if (abs(B) > 1e-12) { t0 = -C / B; }
  } else {
    let h = B * B - 4.0 * A * C;
    if (h < 0.0) { return vec3f(-1.0, 0.0, 0.0); }
    let sq = sqrt(h);
    let q = -0.5 * (B + select(-sq, sq, B >= 0.0));
    let ta = q / A;
    let tb = select(C / q, ta, abs(q) < 1e-12);
    t0 = min(ta, tb);
    t1 = max(ta, tb);
  }
  for (var k = 0; k < 2; k++) {
    let t = select(t1, t0, k == 0);
    if (t <= 1e-5 || t >= tEnd) { continue; }
    let u = o.x + d.x * t;
    let v = o.z + d.z * t;
    let s = u / L;
    if (s <= 0.0 || s >= 1.0) { continue; }
    if (abs(v) < W * scape_outline(s, almond)) { return vec3f(t, u, v); }
  }
  return vec3f(-1.0, 0.0, 0.0);
}

// A blade's half-width along it (0..1 of the widest): the anubias' ovate leaf, rounded at its
// base and pointed at its tip; the almond leaf's obovate one, widest two thirds of the way out.
fn scape_outline(s: f32, almond: bool) -> f32 {
  if (almond) {
    return 1.72 * pow(s, 0.8) * pow(max(1.0 - s * s * s, 0.0), 0.6);
  }
  if (s < 0.4) { return sqrt(max(1.0 - pow((0.4 - s) / 0.4, 2.0), 0.0)); }
  return pow(max(1.0 - pow((s - 0.4) / 0.6, 1.7), 0.0), 0.75);
}

// ---- what is met ----------------------------------------------------------------------------
struct ScapeHit {
  t: f32,
  // 0: none; 6: the floating leaf; 7: a furnishing (scape/: id its triangle, uv where on it).
  kind: u32,
  id: u32,
  // On the leaf: along it and across it (its own units); the point's normal (translating frame).
  uv: vec2f,
  n: vec3f,
}

// ---- the floating leaf --------------------------------------------------------------------
// Its frame (translating): x along it from its base, y off its top face, z across; and its base.
fn scape_leafFrame() -> mat3x3f {
  let slope = scapeLife[1].yz;
  let n = normalize(vec3f(-slope.x, 1.0, -slope.y));
  let h = vec3f(cos(scapeLife[0].w), 0.0, sin(scapeLife[0].w));
  let along = normalize(h - n * dot(h, n));
  return mat3x3f(along, n, normalize(cross(along, n)));
}

fn scape_leafBase(ax: mat3x3f) -> vec3f {
  return scapeLife[0].xyz - ax[0] * (0.5 * SCAPE_LEAF_L);
}

fn scape_leaf(p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  var hit = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  if (scapeLife[1].x < 0.5) { return hit; }
  // (Its bounding sphere first.)
  let oc = scapeLife[0].xyz - p;
  let tc = dot(oc, dir);
  let rr = 0.5 * SCAPE_LEAF_L + 0.02;
  if (dot(oc, oc) - tc * tc > rr * rr || tc + rr < 0.0 || tc - rr > tEnd) { return hit; }
  let ax = scape_leafFrame();
  let base = scape_leafBase(ax);
  let ol = transpose(ax) * (p - base);
  let dl = transpose(ax) * dir;
  let c = scape_bladeCross(ol, dl, SCAPE_LEAF_L, SCAPE_LEAF_W, SCAPE_LEAF_ARCH, SCAPE_LEAF_CUP, tEnd, true);
  if (c.x > 0.0) {
    let gu = 2.0 * SCAPE_LEAF_ARCH * (c.y - 0.5 * SCAPE_LEAF_L) / (SCAPE_LEAF_L * SCAPE_LEAF_L);
    let gv = 2.0 * SCAPE_LEAF_CUP * c.z / (SCAPE_LEAF_W * SCAPE_LEAF_W);
    hit = ScapeHit(c.x, 6u, 0u, vec2f(c.y / SCAPE_LEAF_L, c.z / SCAPE_LEAF_W), ax * normalize(vec3f(-gu, 1.0, -gv)));
  }
  // Its stalk, a stub at its base.
  let tb = scape_capsule(p, dir, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002, 0.0045);
  if (tb > 0.0 && tb < min(hit.t, tEnd)) {
    hit = ScapeHit(tb, 6u, 1u, vec2f(-0.05, 0.0), scape_capNormal(p + dir * tb, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002));
  }
  return hit;
}

// The leaf's shadow on what lies under it (x, towards the sun L): how much light gets by.
fn scape_leafShadow(x: vec3f, L: vec3f) -> vec3f {
  if (scapeLife[1].x < 0.5) { return vec3f(1.0); }
  let ax = scape_leafFrame();
  let dn = dot(L, ax[1]);
  if (dn < 0.05) { return vec3f(1.0); }
  let t = dot(scapeLife[0].xyz - x, ax[1]) / dn;
  if (t <= 0.0) { return vec3f(1.0); }
  let q = transpose(ax) * (x + L * t - scape_leafBase(ax));
  let s = q.x / SCAPE_LEAF_L;
  let w = SCAPE_LEAF_W * scape_outline(clamp(s, 0.0, 1.0), true);
  // (Softer the further it falls: the sun's disc, and the film's ripples.)
  let soft = 0.006 + 0.05 * t;
  let inside = smoothstep(-soft, soft, w - abs(q.z)) * smoothstep(-soft, soft, min(q.x, SCAPE_LEAF_L - q.x));
  return mix(vec3f(1.0), vec3f(0.10, 0.045, 0.02), inside);
}

// ---- the nest -----------------------------------------------------------------------------
// Its bubbles along a stretch of ray in the air (p, dir, t in [0, tEnd)): their films reflect a
// little of the sky to it, each crossing (rgb), and let the rest through (a, the share). (tex: the
// furnishings' texture, where its bubbles are rows: scape/nest.mjs. Read there rather than from a
// constant array, which the loop's index would make a private copy of in every invocation.)
fn scape_nestAlong(tex: texture_2d<f32>, p: vec3f, dir: vec3f, tEnd: f32, bgTex: texture_2d<f32>, bgSamp: sampler) -> vec4f {
  let count = min(u32(scapeLife[3].x + 0.5), SCAPE_NEST_N);
  if (count == 0u) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  let heart = scapeLife[2].xyz;
  let a = scapeLife[2].w;
  let out = vec3f(cos(a), 0.0, sin(a));
  let along = vec3f(-out.z, 0.0, out.x);
  let lo = heart - vec3f(0.24, 0.02, 0.24);
  let hi = heart + vec3f(0.24, 0.05, 0.24);
  if (!scape_box(p, dir, lo, hi, tEnd)) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  var col = vec3f(0.0);
  var thr = vec3f(1.0);
  let rows = u32(scape_meshTexel(tex, 3u).w);
  for (var k = 0u; k < count; k++) {
    let b = scape_meshTexel(tex, rows + k);
    // (Its heart sits a little in the film: a floating bubble is a little less than half a sphere.)
    let c = heart + along * b.x - out * b.y + vec3f(0.0, b.z - 0.3 * b.w, 0.0);
    let oc = p - c;
    let bq = dot(oc, dir);
    let cq = dot(oc, oc) - b.w * b.w;
    let h = bq * bq - cq;
    if (h <= 0.0) { continue; }
    let sq = sqrt(h);
    for (var e = 0; e < 2; e++) {
      let t = select(-bq + sq, -bq - sq, e == 0);
      if (t <= 0.0 || t >= tEnd) { continue; }
      let x = p + dir * t;
      // (Only its dome above the film.)
      if (x.y < heart.y - 0.001) { continue; }
      let n = normalize(x - c);
      let ci = abs(dot(dir, n));
      let F = globes_fresnel(ci, 1.0, GLOBES_IOR_WATER);
      // Two faces of a thin film, its thickness different bubble to bubble: faint colours.
      let R = 2.0 * F / (1.0 + F);
      let phase = fract(b.x * 37.1 + b.y * 91.7) * 2.0 + 1.6 * sqrt(max(1.0 - ci * ci * 0.56, 0.0));
      let tint = 0.62 + 0.38 * cos(6.2831853 * (phase + vec3f(0.0, 0.33, 0.67)));
      let Rc = R * tint;
      // (A nest's films are thickened with the fish's mucus: each scatters a little of the light
      // falling on it, the sun's and the sky's, so the raft reads white.)
      let sunGlint = GLOBES_SUN_IRR * (0.5 * pow(max(dot(reflect(dir, n), GLOBES_SUN_DIR), 0.0), 300.0) + 0.012);
      col += thr * (Rc * (globes_bg(bgTex, bgSamp, x, reflect(dir, n)) + sunGlint) + vec3f(0.085, 0.09, 0.095));
      thr *= (1.0 - Rc) * 0.88;
    }
  }
  return vec4f(col, (thr.x + thr.y + thr.z) / 3.0);
}

// What falls on the bed from above (x, in the medium inWater says): the furnishings' shadows and
// the floating leaf's (tex: the furnishings' BVH).
fn scape_bedShadow(tex: texture_2d<f32>, x: vec3f, inWater: bool) -> vec3f {
  let towards = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  let rotT = transpose(scapeRot);
  return ${lite ? '' : 'scape_meshShadow(tex, rotT * (x + vec3f(0.0, 0.003, 0.0)), rotT * towards, 3.0) * '}scape_leafShadow(x, towards);
}

// ---- tracing and shading ------------------------------------------------------------------
// The nearest of the furnishings and the floating leaf along a ray (translating frame) before
// tEnd (tex: the furnishings' BVH).
fn scape_trace(tex: texture_2d<f32>, p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  let rotT = transpose(scapeRot);
  let m = scape_meshHit(tex, rotT * p, rotT * dir, tEnd);
  var a = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  if (m.tri != 0xffffffffu) { a = ScapeHit(m.t, 7u, m.tri, m.bary, vec3f(0.0, 1.0, 0.0)); }
  let b = scape_leaf(p, dir, min(a.t, tEnd));
  if (b.kind != 0u && b.t < a.t) { return b; }
  return a;
}

// A furnishing's surface where a ray (dir, translating frame) met it at x: its material, lit by the
// lamp through the water and the film's ripples (in the shadows of all the furnishings and of the
// floating leaf), the blue room's light (shut out of its crevices), a glossy or waxy highlight,
// light let through a leaf from behind, and the light it gives off (the heater's lamp).
fn scape_shadeMesh(tex: texture_2d<f32>, h: ScapeHit, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32, foot: f32) -> vec3f {
  let rotT = transpose(scapeRot);
  let s = scape_meshSurface(tex, ScapeMeshHit(h.t, h.id, h.uv));
  let db = rotT * dir;
  let front = dot(db, s.ng) < 0.0;
  let mat = scape_meshMaterial(s, rotT * x, foot, front);
  // (The shading normal on the side the ray met, by the triangle's own face; where it still leans
  // away, as smooth normals do near an outline, bent back into view rather than turned over.)
  var n = scapeRot * mat.n;
  let ngv = scapeRot * select(-s.ng, s.ng, front);
  if (dot(n, ngv) < 0.0) { n = -n; }
  let away = dot(n, dir);
  if (away > 0.0) { n = normalize(n - dir * (away + 1e-3)); }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  if (inWater) { E = globes_sunIn(lightTex, lightSamp, x + n * 0.01, lit) * betta_dapple(x, lit, lightTex, lightSamp, time); }
  // (Its shadows: from just off the side facing the light, so a leaf lit from behind is not
  // shadowed by itself.)
  let ndl = dot(n, L);
  let off = x + select(-n, n, ndl > 0.0) * 0.0015;
  let S = ${lite ? '' : 'scape_meshShadow(tex, rotT * off, rotT * L, 3.0) * '}scape_leafShadow(off, L);
  let up = n.y * 0.5 + 0.5;
  let ambient = select(vec3f(0.30, 0.31, 0.34), mix(vec3f(0.045, 0.06, 0.075), vec3f(0.15, 0.18, 0.21), up), inWater) * mat.ao;
  let hv = normalize(L - dir);
  let ndh = max(dot(n, hv), 0.0);
  let ndv = clamp(dot(n, -dir), 0.0, 1.0);
  let F = mat.spec + (1.0 - mat.spec) * pow(1.0 - ndv, 5.0);
  let r2 = max(mat.rough * mat.rough, 0.002);
  let shine = max(2.0 / (r2 * r2) - 2.0, 1.0);
  let spec = F * (shine + 8.0) / 25.13274 * pow(ndh, shine) * max(ndl, 0.0);
  let through = mat.trans * max(-ndl, 0.0);
  // The studio's key light (its soft box high on the left in front: studio.ts), come in through
  // the glass: it lights the faces turned to the viewer and draws out their relief (soft, so its
  // shadows are left to the occlusion).
  let K = normalize(vec3f(-0.5, 0.62, 0.62));
  let nk = dot(n, K);
  let key = vec3f(1.15, 1.04, 0.90) * mat.ao;
  let hk = normalize(K - dir);
  let keySpec = F * (shine + 8.0) / 25.13274 * pow(max(dot(n, hk), 0.0), shine) * max(nk, 0.0);
  return mat.albedo * (E * S * max(ndl, 0.0) + key * max(nk, 0.0) + ambient) / 3.14159265 + E * S * (spec + through / 3.14159265) + key * (keySpec + mat.trans * max(-nk, 0.0) * 0.3 / 3.14159265) + F * ambient * 0.25 + mat.glow;
}

// The light a hit sends back along dir (x: the point; inWater: the medium the ray is in; tex: the
// furnishings' BVH).
fn scape_shade(tex: texture_2d<f32>, h: ScapeHit, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32, bgTex: texture_2d<f32>, bgSamp: sampler, foot: f32) -> vec3f {
  if (h.kind == 7u) { return scape_shadeMesh(tex, h, x, dir, inWater, lit, lightTex, lightSamp, time, foot); }
  var n = h.n;
  let back = dot(n, dir) > 0.0;
  if (back) { n = -n; }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  var dapple = 1.0;
  if (inWater) {
    dapple = betta_dapple(x, lit, lightTex, lightSamp, time);
    E = globes_sunIn(lightTex, lightSamp, x + n * 0.01, lit) * dapple;
  }
  let ambient = select(vec3f(0.36, 0.37, 0.40), mix(vec3f(0.10, 0.13, 0.15), vec3f(0.30, 0.38, 0.44), n.y * 0.5 + 0.5), inWater);
  let ndl = dot(n, L);
  let hv = normalize(L - dir);
  let ndh = max(dot(n, hv), 0.0);
  let ndv = clamp(dot(n, -dir), 0.0, 1.0);
  let fres = pow(1.0 - ndv, 5.0);
  let pb = transpose(scapeRot) * x;
  if (h.kind == 6u) {
    // The almond leaf, dried: tan to reddish brown, darker at its edge, its midrib and veins paler;
    // underneath paler still. Lit from behind it glows a deep amber through.
    let s = h.uv.x;
    let v = h.uv.y;
    let q = vec3f(s * 9.0, v * 3.0, 0.0);
    var c = mix(vec3f(0.12, 0.05, 0.02), vec3f(0.2, 0.09, 0.035), globes_noise3(q * 1.3 + vec3f(3.1)));
    c = mix(c, vec3f(0.27, 0.15, 0.065), 0.45 * smoothstep(0.55, 0.85, globes_noise3(q * 0.7 + vec3f(8.0))));
    c *= 0.85 + 0.25 * globes_noise3(vec3f(s * 60.0, v * 22.0, 1.7));
    c *= mix(1.0, 0.62, smoothstep(0.7, 1.0, abs(v) / max(scape_outline(clamp(s, 0.0, 1.0), true), 0.05)));
    let midrib = 1.0 - smoothstep(0.012, 0.035, abs(v));
    let lateral = smoothstep(0.9, 0.99, abs(fract(s * 9.0 - abs(v) * 2.2 + 0.15 * globes_noise3(vec3f(s * 20.0, v * 8.0, 0.0))) * 2.0 - 1.0)) * smoothstep(0.03, 0.12, abs(v)) * (1.0 - smoothstep(0.7, 0.92, abs(v)));
    let vein = max(midrib, 0.35 * lateral) * smoothstep(0.0, 2.0, 0.004 / max(foot, 1e-6));
    c = mix(c, vec3f(0.3, 0.17, 0.075), vein);
    if (h.id == 1u) { c = vec3f(0.20, 0.10, 0.04); }
    if (back) { c = mix(c, vec3f(0.42, 0.27, 0.13), 0.45); }
    let through = c * vec3f(0.9, 0.55, 0.25) * max(-ndl, 0.0) * 0.4;
    let wet = select(0.02, 0.06, inWater || back);
    return (c * (E * max(ndl, 0.0) + ambient) + E * through) / 3.14159265 + E * wet * pow(ndh, 30.0) + fres * 0.04 * ambient;
  }
  return vec3f(0.0);
}
${meshWGSL}
`;
}

// Triangle intersections occur on the same refracted rays as water, sand and
// glass. The BVH is refitted to the animated Atelier geometry every frame.
export const BETTA_PARAMS = ', bettaTex: texture_2d<f32>, bettaAtlas: texture_2d<f32>, bettaSamp: sampler';
export const BETTA_ARGS = ', bettaTex, bettaAtlas, bettaSamp';
export const bettaWGSL = /* wgsl */ `
fn betta_tex(tex: texture_2d<f32>, i: u32) -> vec4f {
  return textureLoad(tex, vec2i(i32(i % 1024u), i32(i / 1024u)), 0);
}
fn betta_box(ro: vec3f, inv: vec3f, lo: vec3f, hi: vec3f, end: f32) -> bool {
  let a = (lo - ro) * inv; let b = (hi - ro) * inv;
  let mn = min(a, b); let mx = max(a, b);
  return max(max(mn.x, mn.y), max(mn.z, 0.0)) <= min(min(mx.x, mx.y), min(mx.z, end));
}
fn betta_inv(rd: vec3f) -> vec3f {
  return 1.0 / select(rd, vec3f(1e-8), abs(rd) < vec3f(1e-8));
}
fn betta_near(tex: texture_2d<f32>, p: vec3f, d: vec3f, end: f32) -> bool {
  if (betta_tex(tex, 0u).w < 0.5) { return false; }
  return betta_box(p, betta_inv(d), betta_tex(tex, 1u).xyz - vec3f(0.003), betta_tex(tex, 2u).xyz + vec3f(0.003), end);
}
struct BettaHit { t: f32, triangle: u32, bary: vec2f };
fn betta_trace(tex: texture_2d<f32>, p: vec3f, rd: vec3f, end: f32) -> BettaHit {
  var hit = BettaHit(end, 0xffffffffu, vec2f(0.0));
  let header = betta_tex(tex, 0u);
  if (header.w < 0.5) { return hit; }
  let inv = betta_inv(rd);
  var node = 0u;
  for (var steps = 0u; steps < u32(header.x); steps++) {
    if (node >= u32(header.x)) { break; }
    let lo = betta_tex(tex, 1u + node * 2u); let hi = betta_tex(tex, 2u + node * 2u);
    if (!betta_box(p, inv, lo.xyz, hi.xyz, hit.t)) { node = u32(lo.w); continue; }
    if (hi.w < 0.5) { node++; continue; }
    let packed = u32(hi.w) - 1u;
    let start = packed / 4u; let count = packed % 4u + 1u;
    for (var j = 0u; j < count; j++) {
      let at = u32(header.y) + (start + j) * 4u;
      let a = betta_tex(tex, at).xyz;
      let e1 = betta_tex(tex, at + 1u).xyz - a; let e2 = betta_tex(tex, at + 2u).xyz - a;
      let h = cross(rd, e2); let det = dot(e1, h);
      if (abs(det) < 1e-10) { continue; }
      let s = p - a; let u = dot(s, h) / det;
      let q = cross(s, e1); let v = dot(rd, q) / det;
      let t = dot(e2, q) / det;
      if (u >= 0.0 && v >= 0.0 && u + v <= 1.0 && t > 0.00001 && t < hit.t) {
        hit = BettaHit(t, at, vec2f(u, v));
      }
    }
    node = u32(lo.w);
  }
  return hit;
}
fn betta_sample(atlas: texture_2d<f32>, smp: sampler, tile: u32, uv: vec2f) -> vec3f {
  let pixel = clamp(vec2f(uv.x, 1.0 - uv.y), vec2f(0.001), vec2f(0.999));
  let coord = (vec2f(f32(tile % 2u), f32(tile / 2u)) + pixel) / vec2f(2.0, 3.0);
  let c = textureSampleLevel(atlas, smp, coord, 0.0).rgb;
  return select(c / 12.92, pow((c + vec3f(0.055)) / 1.055, vec3f(2.4)), c > vec3f(0.04045));
}
fn betta_uv(tex: texture_2d<f32>, hit: BettaHit) -> vec2f {
  let b = betta_tex(tex, hit.triangle + 1u); let c = betta_tex(tex, hit.triangle + 2u);
  let tuv = betta_tex(tex, hit.triangle + 3u);
  return vec2f(b.w, c.w) * (1.0 - hit.bary.x - hit.bary.y) + tuv.xy * hit.bary.x + tuv.zw * hit.bary.y;
}
// (u along the fin's root, v root to fringe) of a membrane hit, from the side table
// of packed 12-bit pairs that follows the triangles.
fn betta_finCoord(tex: texture_2d<f32>, hit: BettaHit) -> vec2f {
  let header = betta_tex(tex, 0u);
  let base = u32(header.y);
  let f = betta_tex(tex, base + u32(header.z) * 4u + (hit.triangle - base) / 4u).xyz;
  let pa = u32(f.x); let pb = u32(f.y); let pc = u32(f.z);
  let a = vec2f(f32(pa >> 12u), f32(pa & 4095u));
  let b = vec2f(f32(pb >> 12u), f32(pb & 4095u));
  let c = vec2f(f32(pc >> 12u), f32(pc & 4095u));
  return (a * (1.0 - hit.bary.x - hit.bary.y) + b * hit.bary.x + c * hit.bary.y) / 4095.0;
}
// Fin rays against the membrane between them: 0 membrane, 1 ray. The pattern is
// faded out once a pixel spans a fraction of the local ray spacing so it never
// shimmers. Spacing is measured from the fin meshes: the caudal runs from about
// 0.0017 at the root to 0.0148 at the fringe, the dorsal/anal pair 0.002-0.0066 to
// 0.0105-0.0158, so a single constant would alias the dense root.
fn betta_rays(f: vec2f, foot: f32, caudal: bool) -> f32 {
  let spacing = select(0.003 + 0.0075 * f.y, 0.0014 + 0.0134 * f.y, caudal);
  let fade1 = 1.0 - smoothstep(0.25, 0.65, foot / spacing);
  let fade2 = 1.0 - smoothstep(0.25, 0.65, foot / (spacing * 0.5));
  let r1 = smoothstep(0.7, 1.0, sin(f.x * 175.929)) * fade1;
  let r2 = smoothstep(0.7, 1.0, sin(f.x * 351.858 + 1.3)) * smoothstep(0.4, 0.85, f.y) * 0.65 * fade2;
  return max(r1, r2);
}
// Sunlight left after one straight path towards L: opaque body and eye block it,
// a fin membrane lets a share of it through, tinted by the fin's own colour.
fn betta_occlusion(tex: texture_2d<f32>, atlas: texture_2d<f32>, smp: sampler, p: vec3f, L: vec3f) -> vec3f {
  var T = vec3f(1.0);
  if (!betta_near(tex, p, L, 4.0)) { return T; }
  var o = p;
  for (var k = 0; k < 4; k++) {
    let h = betta_trace(tex, o, L, 4.0);
    if (h.triangle == 0xffffffffu) { break; }
    let mat = u32(betta_tex(tex, h.triangle).w);
    if (mat == 0u || mat >= 3u) { return vec3f(0.0); }
    let c = betta_sample(atlas, smp, select(0u, 1u, mat == 1u), betta_uv(tex, h));
    T *= mix(vec3f(1.0), c / max(max(c.r, c.g), max(c.b, 0.05)), 0.75) * 0.42;
    o += L * (h.t + 0.0004);
  }
  return T;
}
// The sun's shadow on the bed: a small cone of paths gives a soft edge.
fn betta_shadow(tex: texture_2d<f32>, atlas: texture_2d<f32>, smp: sampler, p: vec3f, L: vec3f) -> vec3f {
  if (!betta_near(tex, p, L, 4.0)) { return vec3f(1.0); }
  let t1 = normalize(cross(L, select(vec3f(0.0, 1.0, 0.0), vec3f(1.0, 0.0, 0.0), abs(L.y) > 0.9)));
  let t2 = cross(L, t1);
  var T = vec3f(0.0);
  for (var k = 0u; k < 4u; k++) {
    let j = vec2f(select(-1.0, 1.0, (k & 1u) == 1u), select(-1.0, 1.0, (k & 2u) == 2u)) * 0.012;
    T += betta_occlusion(tex, atlas, smp, p, normalize(L + t1 * j.x + t2 * j.y));
  }
  return T * 0.25;
}
// One faint wave on the film: its share (xx, xz, zz) of the surface's curvature, scaled by
// how hard it bends the sun (per unit of depth). The beat is a whole number of cycles per
// 1000 s, the length of the clock it is read from, so the pattern never jumps when that wraps.
fn betta_ripple(u: vec2f, t: f32, dir: f32, wavelength: f32, cycles: f32, phase: f32, bend: f32) -> vec3f {
  let c = vec2f(cos(dir), sin(dir));
  let s = sin(6.2831853 * (dot(c, u) / wavelength - cycles * t * 0.001) + phase);
  return -bend * s * vec3f(c.x * c.x, c.x * c.y, c.y * c.y);
}
// The sun on the water below a barely moving film: the film's faint ripples gather it into
// a drifting web of bright lines and dim hollows (each bit of film is a weak lens; the light
// at a point is 1/|det| of how the rays that arrive there were spread by the film above).
// The real caustics (the light volume, the sand's map) come from the simulated surface, which
// is dead flat in this globe until it is tipped, so this is the faint life of the film; it
// gives way to them wherever the volume already holds structure.
fn betta_dapple(x: vec3f, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32) -> f32 {
  let depth = lit.x - x.y;
  if (depth < 0.02) { return 1.0; }
  let f = textureSampleLevel(lightTex, lightSamp, x / (2.0 * GLOBES_R_IN) + vec3f(0.5), 0.0).r;
  let calm = 1.0 - smoothstep(0.08, 0.35, abs(f - 1.0));
  // (The film is a stand-in for a ripple a real one would not have, so the spread is exaggerated
  // for a fish only a third of the way down, and capped for the bed.)
  let d = min(depth * 1.3, 0.55);
  let u = x.xz + GLOBES_SUN_DIR_WATER.xz * (d / max(GLOBES_SUN_DIR_WATER.y, 0.3));
  var m = betta_ripple(u, time, 0.35, 0.075, 326.0, 0.0, 1.2);
  m += betta_ripple(u, time, 1.95, 0.062, 435.0, 1.7, 1.0);
  m += betta_ripple(u, time, 3.60, 0.100, 220.0, 4.1, 1.1);
  m += betta_ripple(u, time, 5.05, 0.050, 545.0, 2.6, 0.8);
  m += betta_ripple(u, time, 2.75, 0.070, 379.0, 5.3, 0.9);
  m += betta_ripple(u, time, 4.30, 0.085, 267.0, 3.3, 0.9);
  m += betta_ripple(u, time, 1.10, 0.056, 486.0, 0.9, 0.7);
  let a = 1.0 + d * m.x; let c = 1.0 + d * m.z; let b = d * m.y;
  let det = a * c - b * b;
  // (Lines of 1/|det|, softened where the rays cross; the gain keeps the mean at one.)
  let focus = 1.0 / ((0.97 + 1.3 * d) * sqrt(det * det + 0.0625));
  return mix(1.0, focus, 0.9 * calm * smoothstep(0.02, 0.14, depth));
}
struct BettaShade { rgb: vec3f, a: f32, tint: vec3f };
fn betta_shade(tex: texture_2d<f32>, atlas: texture_2d<f32>, smp: sampler, hit: BettaHit, rd: vec3f, x: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, foot: f32, time: f32) -> BettaShade {
  let a = betta_tex(tex, hit.triangle); let b = betta_tex(tex, hit.triangle + 1u); let c = betta_tex(tex, hit.triangle + 2u);
  let uv = betta_uv(tex, hit);
  var n = normalize(cross(b.xyz - a.xyz, c.xyz - a.xyz));
  if (dot(n, rd) > 0.0) { n = -n; }
  let mat = u32(a.w);
  var albedo = betta_sample(atlas, smp, select(0u, 1u, mat == 1u), uv);
  var scaleW = 0.0;
  if (mat == 0u || mat == 3u) {
    let pixel = vec2f(uv.x * 1536.0, (1.0 - uv.y) * 1024.0);
    let h = vec2f((pixel.x - 145.0) / 290.0 + 0.017, 1.0 - (pixel.y - 300.0) / 250.0 - 0.034);
    let hm = smoothstep(0.0, 0.13, h.x) * smoothstep(0.0, 0.13, h.y) * (1.0 - smoothstep(0.87, 1.0, h.x)) * (1.0 - smoothstep(0.87, 1.0, h.y));
    albedo = mix(albedo, betta_sample(atlas, smp, 2u, h), hm * 0.97);
    let s = vec2f((pixel.x - 430.0) / 400.0, 1.0 - (pixel.y - 278.0) / 250.0);
    let sx = fract(s.x); let sw = smoothstep(0.0, 0.08, sx) * (1.0 - smoothstep(0.92, 1.0, sx));
    let scales = mix(betta_sample(atlas, smp, 3u, vec2f(fract(s.x + 0.5), s.y)), betta_sample(atlas, smp, 3u, vec2f(sx, s.y)), sw);
    scaleW = smoothstep(400.0, 465.0, pixel.x) * select(0.0, 1.0, mat == 0u);
    albedo = mix(albedo, scales, smoothstep(400.0, 465.0, pixel.x) * 0.98);
    if (mat == 0u) {
      let socket = length((pixel - vec2f(240.0, 400.0)) * 0.0032);
      albedo = mix(albedo, vec3f(0.018, 0.025, 0.027), 1.0 - smoothstep(0.062, 0.082, socket));
    }
  }
  if (mat == 4u) { albedo = vec3f(0.002, 0.004, 0.006); }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  var dapple = 1.0;
  if (inWater) {
    dapple = betta_dapple(x, lit, lightTex, lightSamp, time);
    E = globes_sunIn(lightTex, lightSamp, x + n * 0.012, lit) * dapple;
  }
  let ndl = dot(n, L);
  let ndv = clamp(dot(n, -rd), 0.0, 1.0);
  let fin = mat == 1u || mat == 2u;
  // (The bright lines also light the water around them, a little: they reach the fish's flanks.)
  let ambient = mix(vec3f(0.25, 0.30, 0.36), vec3f(0.55, 0.64, 0.72), n.y * 0.5 + 0.5) * (1.0 + 0.55 * (dapple - 1.0));
  let side = select(1.0, -1.0, ndl < 0.0);
  let sunVis = mix(vec3f(1.0), betta_occlusion(tex, atlas, smp, x + n * side * 0.0006, L), smoothstep(-0.1, 0.3, select(ndl, abs(ndl), fin)) * select(1.0, 0.6, fin));
  let direct = E * sunVis;
  if (fin) {
    // A membrane: lit from the viewer's side it reflects; lit from behind it glows
    // in its own colour, and looking towards the sun the edge scatters forward.
    let fc = betta_finCoord(tex, hit);
    let ray = betta_rays(fc, foot, mat == 1u);
    let front = max(ndl, 0.0); let back = max(-ndl, 0.0);
    let hue = pow(albedo, vec3f(0.8));
    let towardSun = pow(max(dot(rd, L), 0.0), 3.0);
    let glow = hue * direct * (back * 0.62 + towardSun * 0.55 * (0.4 + 0.6 * fc.y)) * (1.0 - 0.55 * ray);
    let body = albedo * (direct * (0.3 + 0.42 * front + 0.2 * back) + ambient);
    let rgb = (body + glow) / 3.14159265;
    var alpha = mix(0.93, 0.66, smoothstep(0.15, 1.0, fc.y));
    alpha = mix(alpha, 0.97, ray);
    alpha = 1.0 - pow(1.0 - alpha, 1.0 / max(ndv, 0.32));
    let hueNorm = albedo / max(max(albedo.r, albedo.g), max(albedo.b, 0.05));
    return BettaShade(rgb, alpha, mix(vec3f(1.0), hueNorm, 0.5));
  }
  let diffuse = max(0.0, (ndl + 0.4) / 1.4);
  // Wet skin: tight sun glint, a broad satin sheen, a Fresnel film of sky at grazing
  // angles, and on the scales a faint thin-film shift of hue with viewing angle.
  let gloss = select(0.035, 0.35, mat >= 3u);
  let hv = normalize(L - rd);
  let spec = pow(max(dot(n, hv), 0.0), 75.0) * gloss;
  let fres = pow(1.0 - ndv, 4.0);
  let sheen = select(0.0, 1.0, mat == 0u) * (pow(max(dot(n, hv), 0.0), 12.0) * 0.045 + fres * 0.14);
  let phase = (1.0 - ndv) * 4.2 + albedo.b * 0.8;
  let irid = 0.5 + 0.5 * cos(6.2831853 * (phase + vec3f(0.0, 0.33, 0.67)));
  albedo = mix(albedo, albedo * (0.6 + 0.8 * irid), 0.38 * scaleW);
  let lightIn = direct * (diffuse + sheen) + ambient + ambient * fres * 0.5 * select(0.0, 1.0, mat != 4u);
  return BettaShade(albedo * lightIn / 3.14159265 + direct * spec, 1.0, vec3f(1.0));
}
`;

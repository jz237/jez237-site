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
fn betta_shade(tex: texture_2d<f32>, atlas: texture_2d<f32>, smp: sampler, hit: BettaHit, rd: vec3f, x: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler) -> vec4f {
  let a = betta_tex(tex, hit.triangle); let b = betta_tex(tex, hit.triangle + 1u); let c = betta_tex(tex, hit.triangle + 2u);
  let tuv = betta_tex(tex, hit.triangle + 3u);
  let uv = vec2f(b.w, c.w) * (1.0 - hit.bary.x - hit.bary.y) + tuv.xy * hit.bary.x + tuv.zw * hit.bary.y;
  var n = normalize(cross(b.xyz - a.xyz, c.xyz - a.xyz));
  if (dot(n, rd) > 0.0) { n = -n; }
  let mat = u32(a.w);
  var albedo = betta_sample(atlas, smp, select(0u, 1u, mat == 1u), uv);
  if (mat == 0u || mat == 3u) {
    let pixel = vec2f(uv.x * 1536.0, (1.0 - uv.y) * 1024.0);
    let h = vec2f((pixel.x - 145.0) / 290.0 + 0.017, 1.0 - (pixel.y - 300.0) / 250.0 - 0.034);
    let hm = smoothstep(0.0, 0.13, h.x) * smoothstep(0.0, 0.13, h.y) * (1.0 - smoothstep(0.87, 1.0, h.x)) * (1.0 - smoothstep(0.87, 1.0, h.y));
    albedo = mix(albedo, betta_sample(atlas, smp, 2u, h), hm * 0.97);
    let s = vec2f((pixel.x - 430.0) / 400.0, 1.0 - (pixel.y - 278.0) / 250.0);
    let sx = fract(s.x); let sw = smoothstep(0.0, 0.08, sx) * (1.0 - smoothstep(0.92, 1.0, sx));
    let scales = mix(betta_sample(atlas, smp, 3u, vec2f(fract(s.x + 0.5), s.y)), betta_sample(atlas, smp, 3u, vec2f(sx, s.y)), sw);
    albedo = mix(albedo, scales, smoothstep(400.0, 465.0, pixel.x) * 0.98);
    if (mat == 0u) {
      let socket = length((pixel - vec2f(240.0, 400.0)) * 0.0032);
      albedo = mix(albedo, vec3f(0.018, 0.025, 0.027), 1.0 - smoothstep(0.062, 0.082, socket));
    }
  }
  if (mat == 4u) { albedo = vec3f(0.002, 0.004, 0.006); }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  if (inWater) { E = globes_sunIn(lightTex, lightSamp, x + n * 0.012, lit); }
  let fin = mat == 1u || mat == 2u;
  let diffuse = select(max(0.0, (dot(n, L) + 0.4) / 1.4), 0.3 + 0.55 * abs(dot(n, L)), fin);
  let ambient = mix(vec3f(0.25, 0.30, 0.36), vec3f(0.55, 0.64, 0.72), n.y * 0.5 + 0.5);
  let gloss = select(0.035, 0.35, mat >= 3u);
  let spec = pow(max(dot(n, normalize(L - rd)), 0.0), 75.0) * gloss;
  return vec4f(albedo * (E * diffuse + ambient) / 3.14159265 + E * spec, select(1.0, 0.9, fin));
}
`;

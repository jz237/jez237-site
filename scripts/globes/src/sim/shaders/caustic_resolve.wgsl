// Turns deposited photon flux into irradiance on the sand surface (flux / surface area over
// the map cell), with a light tent filter and a little temporal smoothing. The caustic map
// covers the same disc as the sand bed, at its own (finer) resolution.

@group(0) @binding(1) var<storage, read> causticAcc: array<u32>;
@group(0) @binding(2) var<storage, read_write> causticPrev: array<vec4f>;
@group(0) @binding(3) var causticOut: texture_storage_2d<rgba16float, write>;
@group(0) @binding(4) var sandTex: texture_2d<f32>;
@group(0) @binding(5) var sandSamp: sampler;

const CAUSTIC_INV: f32 = 1.0 / 268435456.0;

// The light volume is resolved in the same dispatch (light_resolve.wgsl, appended: neither reads
// what the other writes), by the workgroups past the map's.

fn fluxAt(i: i32, j: i32) -> vec3f {
  let n = i32(P.sunColor.w);
  let c = 3u * u32(clamp(i, 0, n - 1) + n * clamp(j, 0, n - 1));
  return vec3f(f32(causticAcc[c]), f32(causticAcc[c + 1u]), f32(causticAcc[c + 2u])) * CAUSTIC_INV;
}

@compute @workgroup_size(256)
fn causticResolve(@builtin(global_invocation_id) gid: vec3u) {
  let n = i32(P.sunColor.w);
  let texels = (u32(n * n) + 255u) / 256u * 256u;
  if (gid.x >= texels) {
    lightResolve(gid.x - texels);
    return;
  }
  let c = gid.x;
  if (c >= u32(n * n)) { return; }
  let i = i32(c) % n;
  let j = i32(c) / n;
  let flux = fluxAt(i, j) * 0.25
           + (fluxAt(i - 1, j) + fluxAt(i + 1, j) + fluxAt(i, j - 1) + fluxAt(i, j + 1)) * 0.125
           + (fluxAt(i - 1, j - 1) + fluxAt(i + 1, j - 1) + fluxAt(i - 1, j + 1) + fluxAt(i + 1, j + 1)) * 0.0625;

  // Sand surface area over this map cell: its footprint over the cosine of the bed's tilt.
  let inv = 1.0 / f32(n);
  let uv = (vec2f(f32(i), f32(j)) + vec2f(0.5)) * inv;
  let xz = (uv * 2.0 - vec2f(1.0)) * P.radius;
  let col = vec3f(xz.x, 0.0, xz.y);
  let ny = sandNormal(vec3f(xz.x, sandTop(col), xz.y)).y;
  let cell = 2.0 * P.radius * inv;
  let irradiance = flux * max(ny, 0.05) / (cell * cell);

  let smoothed = mix(causticPrev[c].rgb, irradiance, 0.6);
  causticPrev[c] = vec4f(smoothed, 1.0);
  textureStore(causticOut, vec2i(i, j), vec4f(smoothed, 1.0));
}

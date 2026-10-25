// Turns the photons' deposits into the light-shaft volume: fluence (light carried through
// each voxel per unit volume; ~1 for unfocused sunlight), with a little temporal smoothing.
// The renderer adds the sun's colour and the water's absorption with depth.

@group(0) @binding(1) var<storage, read> lightAcc: array<u32>;
@group(0) @binding(2) var<storage, read_write> lightPrev: array<f32>;
// (r16float where the device can write that: FluidSim.)
@group(0) @binding(3) var lightOut: texture_storage_3d<rgba16float, write>;

const LIGHT_INV: f32 = 1.0 / 268435456.0;

@compute @workgroup_size(4, 4, 4)
fn lightResolve(@builtin(global_invocation_id) gid: vec3u) {
  let n = u32(P.lightN);
  if (any(gid >= vec3u(n))) { return; }
  let i = gid.x + n * (gid.y + n * gid.z);
  let acc = lightAcc[i];
  let prev = lightPrev[i];
  // (No light here, now or before - the air, outside the glass: its texel holds 0 already.)
  if (acc == 0u && prev == 0.0) { return; }
  let vox = 2.0 * P.radius / f32(n);
  let fluence = f32(acc) * LIGHT_INV / (vox * vox * vox);
  let smoothed = mix(prev, fluence, 0.35);
  lightPrev[i] = smoothed;
  textureStore(lightOut, gid, vec4f(smoothed, 0.0, 0.0, 1.0));
}

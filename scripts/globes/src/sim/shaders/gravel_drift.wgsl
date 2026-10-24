// Gravel, step 2, once a frame after the sand has flowed: the pebbles' pattern carried along with
// the bed's surface. Each column keeps the offset (in the globe's frame, across it: x and z) from
// where its surface's pebbles lie in the bowl at rest to where they have been carried; the
// renderer draws the pebbles at their own place less it (bowlScape.ts scape_gravel). Semi-
// Lagrangian: a column's pebbles are those from upstream by the frame's step (gravel_gather.wgsl),
// their offset grown by that step.

@group(0) @binding(1) var<storage, read> gravelD: array<vec2f>;
@group(0) @binding(2) var<storage, read> gravelSrc: array<vec2f>;
@group(0) @binding(3) var<storage, read_write> gravelDst: array<vec2f>;

fn offsetAt(i: i32, j: i32) -> vec2f {
  let n = i32(P.sandMap.x);
  return gravelSrc[u32(clamp(i, 0, n - 1) + n * clamp(j, 0, n - 1))];
}

// The offset at a horizontal position (bilinear between columns).
fn offsetNear(xz: vec2f) -> vec2f {
  let n = f32(P.sandMap.x);
  let g = (xz / (2.0 * P.radius) + vec2f(0.5)) * n - vec2f(0.5);
  let b = floor(g);
  let f = g - b;
  let i = i32(b.x);
  let j = i32(b.y);
  return mix(mix(offsetAt(i, j), offsetAt(i + 1, j), f.x), mix(offsetAt(i, j + 1), offsetAt(i + 1, j + 1), f.x), f.y);
}

@compute @workgroup_size(16, 16)
fn gravelDrift(@builtin(global_invocation_id) gid: vec3u) {
  let n = i32(P.sandMap.x);
  let i = i32(gid.x);
  let j = i32(gid.y);
  if (i >= n || j >= n) { return; }
  let c = u32(i + n * j);
  let xz = ((vec2f(f32(i), f32(j)) + vec2f(0.5)) * P.sandMap.y * 2.0 - vec2f(1.0)) * P.radius;
  let d = gravelD[c];
  // (The step, in the globe's frame.)
  let d3 = vec3f(d.x, 0.0, d.y);
  gravelDst[c] = offsetNear(xz - d) + vec2f(dot(P.globeX.xyz, d3), dot(P.globeZ.xyz, d3));
}

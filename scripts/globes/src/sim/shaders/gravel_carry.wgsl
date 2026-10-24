// Gravel, as the globe turns (after sandRotate and sandScale): the pebbles' offsets go round with
// the glass as the bed does, each column taking the offset from where its surface came from (the
// offsets are in the globe's frame, so they are carried as they are).

@group(0) @binding(1) var<storage, read> sandT: array<f32>;
@group(0) @binding(2) var<storage, read> rockTop: array<f32>;
@group(0) @binding(3) var<storage, read> gravelSrc: array<vec2f>;
@group(0) @binding(4) var<storage, read_write> gravelDst: array<vec2f>;

fn offsetAt(i: i32, j: i32) -> vec2f {
  let n = i32(P.sandMap.x);
  return gravelSrc[u32(clamp(i, 0, n - 1) + n * clamp(j, 0, n - 1))];
}

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
fn gravelCarry(@builtin(global_invocation_id) gid: vec3u) {
  let n = i32(P.sandMap.x);
  let i = i32(gid.x);
  let j = i32(gid.y);
  if (i >= n || j >= n) { return; }
  let c = u32(i + n * j);
  let xz = ((vec2f(f32(i), f32(j)) + vec2f(0.5)) * P.sandMap.y * 2.0 - vec2f(1.0)) * P.radius;
  let bottom = max(-sqrt(max(P.radius * P.radius - dot(xz, xz), 0.0)), rockTop[c]);
  // bodyX..Z: the rotation from this frame back to the previous one (cf. sandRotate).
  let back = mat3x3f(P.bodyX.xyz, P.bodyY.xyz, P.bodyZ.xyz);
  let q = back * vec3f(xz.x, bottom + sandT[c], xz.y);
  gravelDst[c] = offsetNear(q.xz);
}

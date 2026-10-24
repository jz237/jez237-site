// Gravel: the pebbles' new offsets back into the working buffer (gravel_drift.wgsl,
// gravel_carry.wgsl write the other).

@group(0) @binding(1) var<storage, read> gravelSrc: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> gravelDst: array<vec2f>;

@compute @workgroup_size(16, 16)
fn gravelCopy(@builtin(global_invocation_id) gid: vec3u) {
  let n = u32(P.sandMap.x);
  if (gid.x >= n || gid.y >= n) { return; }
  let c = gid.x + n * gid.y;
  gravelDst[c] = gravelSrc[c];
}

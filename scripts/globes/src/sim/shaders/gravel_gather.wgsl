// Gravel (the betta's bowl: FluidSim.gravel), step 1, each sand substep between sandFlux and
// sandApply: how far the bed's surface layer moved in each column, added up over the frame. The
// sand flow only moves volume between columns; the renderer draws pebbles, big enough to see go,
// so their pattern is carried along with the flow (gravel_drift.wgsl). A column's surface moves
// with the mean of what it sends out and what it takes in, over its active layer.

@group(0) @binding(1) var<storage, read> sandT: array<f32>;
@group(0) @binding(2) var<storage, read> sandOut: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> gravelD: array<vec2f>;

fn columnIdx(i: i32, j: i32) -> u32 {
  return u32(i + i32(P.sandMap.x) * j);
}

@compute @workgroup_size(16, 16)
fn gravelGather(@builtin(global_invocation_id) gid: vec3u) {
  let n = i32(P.sandMap.x);
  let i = i32(gid.x);
  let j = i32(gid.y);
  if (i >= n || j >= n) { return; }
  let c = columnIdx(i, j);
  let cell = 2.0 * P.radius * P.sandMap.y;
  let mobile = min(sandT[c], P.sand.w) * cell * cell;
  if (mobile < 1e-9) { return; }
  var offs = array<vec2f, 8>(
    vec2f(-1.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, -1.0), vec2f(0.0, 1.0),
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(1.0, 1.0));
  let a = sandOut[2u * c];
  let d = sandOut[2u * c + 1u];
  var flux = offs[0] * a.x + offs[1] * a.y + offs[2] * a.z + offs[3] * a.w + offs[4] * d.x + offs[5] * d.y + offs[6] * d.z + offs[7] * d.w;
  // What each neighbour sends this way, moving from it to here (cf. sandApply).
  if (i > 0) { flux += vec2f(1.0, 0.0) * sandOut[2u * columnIdx(i - 1, j)].y; }
  if (i < n - 1) { flux += vec2f(-1.0, 0.0) * sandOut[2u * columnIdx(i + 1, j)].x; }
  if (j > 0) { flux += vec2f(0.0, 1.0) * sandOut[2u * columnIdx(i, j - 1)].w; }
  if (j < n - 1) { flux += vec2f(0.0, -1.0) * sandOut[2u * columnIdx(i, j + 1)].z; }
  if (i > 0 && j > 0) { flux += vec2f(1.0, 1.0) * sandOut[2u * columnIdx(i - 1, j - 1) + 1u].w; }
  if (i < n - 1 && j > 0) { flux += vec2f(-1.0, 1.0) * sandOut[2u * columnIdx(i + 1, j - 1) + 1u].z; }
  if (i > 0 && j < n - 1) { flux += vec2f(1.0, -1.0) * sandOut[2u * columnIdx(i - 1, j + 1) + 1u].y; }
  if (i < n - 1 && j < n - 1) { flux += vec2f(-1.0, -1.0) * sandOut[2u * columnIdx(i + 1, j + 1) + 1u].x; }
  // (Volume moved a column's width, over the volume that moves: the layer's step; half of out and
  // in, at most half a column a substep.)
  var step = 0.5 * flux * cell / mobile;
  let l = length(step);
  if (l > 0.5 * cell) { step *= 0.5 * cell / l; }
  gravelD[c] += step;
}

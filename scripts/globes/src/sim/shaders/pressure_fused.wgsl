// A whole sweep of the red-black Gauss-Seidel (SOR) solve in one dispatch (pressure.wgsl takes two,
// a colour each): the red cells relaxed from the black, then the black from the new red, as there.
// A workgroup takes a tile (16 x PRESSURE_TILE_Y x PRESSURE_TILE_Z cells) and reads it with two
// cells round it, as the sweep found them. It relaxes the red cells of the tile and one round it
// itself (the ones round it are its neighbours' too, worked out the same way there, from the same
// black cells), then the tile's black ones, and writes the tile's cells, both colours, into the
// other buffer of the two (psiOut), which no workgroup of this sweep reads. The sums are taken as
// pressure.wgsl takes them, in the same order, so every cell comes out as it does there.
// Where the solve's dispatches cost more to launch than the work this adds, half as many would
// sweep it in less time; no GPU measured so far is such (FluidSim FUSED_MAX_N), so it runs only
// when asked for, for a phone's bench to time. A tile without water stops at once, as there:
// cell_prep.wgsl holds psiOut at nought off the water too, so the tiles left alone are right in
// both buffers.

@group(0) @binding(1) var<storage, read> cellFaceW: array<vec2u>;
@group(0) @binding(2) var<storage, read> rhs: array<vec2f>;
@group(0) @binding(3) var<storage, read> psiIn: array<f32>;
@group(0) @binding(4) var<storage, read> pressureTiles: array<u32>;
@group(0) @binding(5) var<storage, read_write> psiOut: array<f32>;

const BOX_X: u32 = 20u;
const BOX_Y: u32 = PRESSURE_TILE_Y + 4u;
const BOX_Z: u32 = PRESSURE_TILE_Z + 4u;
const BOX_XY: u32 = BOX_X * BOX_Y;
const BOX: u32 = BOX_XY * BOX_Z;
// (The rows of the tile and one round it: their red cells are half of each row of 18.)
const RED_ROWS: u32 = (BOX_Y - 2u) * (BOX_Z - 2u);
const THREADS: u32 = 8u * PRESSURE_TILE_Y * PRESSURE_TILE_Z;
// The tile and two cells round it (nought outside the grid): the black cells as they were, the red
// ones relaxed in place.
var<workgroup> box: array<f32, BOX>;

// (A thread to each pair of the tile's cells, a red and a black, side by side along x.)
@compute @workgroup_size(8, PRESSURE_TILE_Y, PRESSURE_TILE_Z)
fn pressureFused(@builtin(workgroup_id) wid: vec3u, @builtin(local_invocation_id) lid: vec3u,
                 @builtin(local_invocation_index) li: u32) {
  let tile = wid * vec3u(16u, PRESSURE_TILE_Y, PRESSURE_TILE_Z);
  if (pressureTiles[pressureTile(tile)] == 0u) { return; }
  let n = i32(P.n);
  let o = vec3i(tile) - vec3i(2);
  for (var k = li; k < BOX; k += THREADS) {
    let c = o + vec3i(i32(k % BOX_X), i32((k / BOX_X) % BOX_Y), i32(k / BOX_XY));
    var v = 0.0;
    if (all(c >= vec3i(0)) && all(c < vec3i(n))) { v = psiIn[pressureIdx(c.x, c.y, c.z)]; }
    box[k] = v;
  }
  workgroupBarrier();
  // The red cells ((i + j + k) even), nine to a row.
  for (var k = li; k < 9u * RED_ROWS; k += THREADS) {
    let row = k / 9u;
    let r = o + vec3i(1, 1 + i32(row % (BOX_Y - 2u)), 1 + i32(row / (BOX_Y - 2u)));
    let c = r + vec3i(2 * i32(k % 9u) + ((r.x + r.y + r.z) & 1), 0, 0);
    let b = boxIdx(c - o);
    box[b] = relax(c, b, n);
  }
  workgroupBarrier();
  // Then the tile's black cells; and both into psiOut.
  let row = vec3i(tile + vec3u(0u, lid.y, lid.z));
  let s = row.x + row.y + row.z;
  let red = row + vec3i(2 * i32(lid.x) + (s & 1), 0, 0);
  let black = row + vec3i(2 * i32(lid.x) + ((s + 1) & 1), 0, 0);
  if (all(black < vec3i(n))) { psiOut[pressureIdx(black.x, black.y, black.z)] = relax(black, boxIdx(black - o), n); }
  if (all(red < vec3i(n))) { psiOut[pressureIdx(red.x, red.y, red.z)] = box[boxIdx(red - o)]; }
}

fn boxIdx(b: vec3i) -> u32 {
  return u32(b.x) + BOX_X * (u32(b.y) + BOX_Y * u32(b.z));
}

// Cell c (box texel b) relaxed from its neighbours in the box (pressure.wgsl relax): as it was,
// outside the grid and off the water.
fn relax(c: vec3i, b: u32, n: i32) -> f32 {
  if (any(c < vec3i(0)) || any(c >= vec3i(n))) { return box[b]; }
  let pc = pressureIdx(c.x, c.y, c.z);
  let r = rhs[pc];
  if (r.y == 0.0) { return box[b]; }
  let packed = cellFaceW[pc];
  let wA = unpack4x8unorm(packed.x);
  let wB = unpack4x8unorm(packed.y);
  let sum = wA.x * box[b - 1u] + wA.y * box[b + 1u]
          + wA.z * box[b - BOX_X] + wA.w * box[b + BOX_X]
          + wB.x * box[b - BOX_XY] + wB.y * box[b + BOX_XY];
  let gs = (sum - r.x) * r.y;
  return mix(box[b], gs, P.sor);
}

// Two layers of velocity extrapolation into air and solid faces (on each component's own
// lattice), in one pass and in place: a face without a valid velocity takes the average of its
// valid neighbours', or, with none, the average of what those neighbours take so. (The same as
// two passes of one layer, ping-ponging buffers, without the second set: the faces it writes are
// never the ones it reads, the valid, which keep theirs.)

@group(0) @binding(1) var<storage, read> valid: array<u32>;
@group(0) @binding(2) var<storage, read_write> vel: array<f32>;
// Per workgroup (a tile of faces, as project.wgsl's), whether any face in it is valid.
@group(0) @binding(3) var<storage, read> faceTiles: array<u32>;

// Whether a tile round this workgroup's has a valid face: a face's two layers reach two faces
// each way, no further than the tiles next to its own (8 x 8 x 4 faces).
var<workgroup> wgNear: atomic<u32>;

fn neighbour(p: vec3i, d: u32) -> vec3i {
  var o = vec3i(0);
  o[d / 2u] = select(-1, 1, (d & 1u) == 1u);
  return p + o;
}

@compute @workgroup_size(8, 8, 4)
fn extrapolate(@builtin(global_invocation_id) gid: vec3u, @builtin(workgroup_id) wid: vec3u,
               @builtin(num_workgroups) nwg: vec3u, @builtin(local_invocation_index) li: u32) {
  // (None near, as in most of the air: none of its faces takes a velocity.)
  if (li < 27u) {
    let w = vec3i(wid) + vec3i(i32(li % 3u), i32((li / 3u) % 3u), i32(li / 9u)) - vec3i(1);
    if (all(w >= vec3i(0)) && all(w < vec3i(nwg)) && faceTiles[u32(w.x) + nwg.x * (u32(w.y) + nwg.y * u32(w.z))] != 0u) {
      atomicStore(&wgNear, 1u);
    }
  }
  workgroupBarrier();
  if (atomicLoad(&wgNear) == 0u) { return; }
  let s = P.s;
  if (gid.x >= s || gid.y >= s || gid.z >= 3u * s) { return; }
  let comp = gid.z / s;
  let k = gid.z % s;
  if (farOutside(facePos(comp, gid.x, gid.y, k))) { return; }
  let base = comp * P.faceCount;
  let t = base + gid.x + s * (gid.y + s * k);
  if (valid[t] != 0u) { return; }
  let p = vec3i(i32(gid.x), i32(gid.y), i32(k));
  let si = i32(s);
  // The first layer: the valid neighbours' average.
  var sum = 0.0;
  var cnt = 0.0;
  for (var d = 0u; d < 6u; d++) {
    let q = neighbour(p, d);
    if (all(q >= vec3i(0)) && all(q < vec3i(si))) {
      let tq = base + faceIdx(q.x, q.y, q.z);
      if (valid[tq] != 0u) {
        sum += vel[tq];
        cnt += 1.0;
      }
    }
  }
  if (cnt > 0.0) {
    vel[t] = sum / cnt;
    return;
  }
  // The second: the average of the neighbours' first layers, where they took one (none of them
  // is valid, or this face would have taken theirs; and those far outside the glass take none).
  for (var d = 0u; d < 6u; d++) {
    let q = neighbour(p, d);
    if (all(q >= vec3i(0)) && all(q < vec3i(si)) && !farOutside(facePos(comp, u32(q.x), u32(q.y), u32(q.z)))) {
      var qSum = 0.0;
      var qCnt = 0.0;
      for (var e = 0u; e < 6u; e++) {
        let r = neighbour(q, e);
        if (all(r >= vec3i(0)) && all(r < vec3i(si))) {
          let tr = base + faceIdx(r.x, r.y, r.z);
          if (valid[tr] != 0u) {
            qSum += vel[tr];
            qCnt += 1.0;
          }
        }
      }
      if (qCnt > 0.0) {
        sum += qSum / qCnt;
        cnt += 1.0;
      }
    }
  }
  if (cnt > 0.0) { vel[t] = sum / cnt; }
}

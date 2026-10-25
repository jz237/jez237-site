// Stackless, refittable triangle BVH. Nodes are in preorder; escape links skip
// whole subtrees. Leaves contain up to four consecutive triangles.
// Header: node count / triangle texel offset / triangle count / visible.
// Node: min.xyz + escape index, max.xyz + (leaf start + 1, or 0).
// Triangle: a.xyz + material, b.xyz + uv0.x, c.xyz + uv0.y, uv1.xy + uv2.xy.
// After all triangles comes a side table, one texel per triangle: each xyz holds a
// vertex's fin (u,v) as two 12-bit values packed into one exactly-representable
// float (u * 4096 + v), so the shader can tell fin rays from membrane.
// The tree is split by the surface area heuristic over the positions it is built
// on (binned): a ray meets fewer boxes and triangles than in an even split.
const BINS = 16;
export class TriangleBVH {
  constructor(positions, indices, uv, materials, finUV) {
    this.indices = indices;
    this.order = [];
    this.nodes = [];
    const T = indices.length / 3;
    const centroids = new Float64Array(T * 3), lo = new Float64Array(T * 3), hi = new Float64Array(T * 3);
    for (let t = 0; t < T; t++) for (let k = 0; k < 3; k++) {
      const a = positions[indices[t * 3] * 3 + k], b = positions[indices[t * 3 + 1] * 3 + k], c = positions[indices[t * 3 + 2] * 3 + k];
      centroids[t * 3 + k] = (a + b + c) / 3;
      lo[t * 3 + k] = Math.min(a, b, c); hi[t * 3 + k] = Math.max(a, b, c);
    }
    // Boxes as six floats (lo.xyz, hi.xyz): the bins' along an axis, and a running one.
    const binCount = new Int32Array(BINS), binBox = new Float64Array(BINS * 6), aboveArea = new Float64Array(BINS), aboveCount = new Int32Array(BINS);
    const box = new Float64Array(6);
    const empty = (b, o) => { b[o] = b[o + 1] = b[o + 2] = Infinity; b[o + 3] = b[o + 4] = b[o + 5] = -Infinity; };
    const area = (b, o) => { const x = b[o + 3] - b[o], y = b[o + 4] - b[o + 1], z = b[o + 5] - b[o + 2]; return 2 * (x * y + y * z + z * x); };
    const ids = Int32Array.from({ length: T }, (_, i) => i);
    // Ranges ids[s, e) still to make into subtrees, in preorder (a left half is taken before its
    // right), each with the node waiting for it as its right child (or -1). A range becomes a
    // leaf of up to four, or is split where the two halves' boxes cost least (their areas, each
    // by the leaves of four it would take), the halves in place. (A stack, not recursion:
    // optimised code meeting the work after a call for the first time gave way at every node.)
    const nodes = this.nodes, order = this.order, todo = [0, T, -1];
    while (todo.length) {
      const parent = todo.pop(), e = todo.pop(), s = todo.pop();
      if (parent >= 0) nodes[parent].right = nodes.length;
      const node = { escape: 0, start: -1, count: 0, right: -1 };
      nodes.push(node);
      const n = e - s;
      if (n <= 4) {
        node.start = order.length; node.count = n;
        for (let i = s; i < e; i++) order.push(ids[i]);
        continue;
      }
      let best = Infinity, axis = -1, split = 0, from = 0, scale = 0;
      for (let k = 0; k < 3; k++) {
        let a = Infinity, b = -Infinity;
        for (let i = s; i < e; i++) { const x = centroids[ids[i] * 3 + k]; if (x < a) a = x; if (x > b) b = x; }
        if (!(b - a > 1e-12)) continue;
        const f = BINS / (b - a);
        binCount.fill(0);
        for (let q = 0; q < BINS; q++) empty(binBox, q * 6);
        for (let i = s; i < e; i++) {
          const t = ids[i], q = Math.min(BINS - 1, Math.floor((centroids[t * 3 + k] - a) * f)), o = q * 6;
          binCount[q]++;
          for (let j = 0; j < 3; j++) {
            if (lo[t * 3 + j] < binBox[o + j]) binBox[o + j] = lo[t * 3 + j];
            if (hi[t * 3 + j] > binBox[o + 3 + j]) binBox[o + 3 + j] = hi[t * 3 + j];
          }
        }
        // (The bins above each split, then those below it.)
        for (let pass = 0; pass < 2; pass++) {
          empty(box, 0);
          let count = 0;
          for (let step = 1; step < BINS; step++) {
            const q = pass ? step - 1 : BINS - step, o = q * 6;
            for (let j = 0; j < 3; j++) {
              if (binBox[o + j] < box[j]) box[j] = binBox[o + j];
              if (binBox[o + 3 + j] > box[3 + j]) box[3 + j] = binBox[o + 3 + j];
            }
            count += binCount[q];
            if (!pass) { aboveArea[q] = area(box, 0); aboveCount[q] = count; continue; }
            if (!count || !aboveCount[step]) continue;
            const cost = area(box, 0) * Math.ceil(count / 4) + aboveArea[step] * Math.ceil(aboveCount[step] / 4);
            if (cost < best) { best = cost; axis = k; split = step; from = a; scale = f; }
          }
        }
      }
      let mid = s + (n >> 1);
      if (axis >= 0) {
        let i = s, j = e - 1;
        while (i <= j) {
          if (Math.min(BINS - 1, Math.floor((centroids[ids[i] * 3 + axis] - from) * scale)) < split) i++;
          else { const x = ids[i]; ids[i] = ids[j]; ids[j--] = x; }
        }
        mid = i;
      }
      // The shader reads each leaf count from its packed word without
      // another texture fetch. Counts stay valid for uneven subdivisions.
      todo.push(mid, e, nodes.length - 1, s, mid, -1);
    }
    // A node's escape: the node after its subtree (a leaf's next, an inner node's right child's).
    for (let i = nodes.length - 1; i >= 0; i--) nodes[i].escape = nodes[i].start >= 0 ? i + 1 : nodes[nodes[i].right].escape;
    this.triOffset = 1 + this.nodes.length * 2;
    this.width = 1024;
    this.height = Math.ceil((this.triOffset + this.order.length * 5) / this.width);
    this.data = new Float32Array(this.width * this.height * 4);
    this.data.set([this.nodes.length, this.triOffset, this.order.length, 0]);
    for (let n = 0; n < this.nodes.length; n++) {
      const node = this.nodes[n], o = 4 + n * 8;
      this.data[o + 3] = node.escape;
      this.data[o + 7] = node.start < 0 ? 0 : (node.start * 4 + node.count);
    }
    for (let i = 0; i < this.order.length; i++) {
      const t = this.order[i], o = (this.triOffset + i * 4) * 4;
      const a = indices[t * 3], b = indices[t * 3 + 1], c = indices[t * 3 + 2];
      this.data[o + 3] = materials[t];
      this.data[o + 7] = uv[a * 2]; this.data[o + 11] = uv[a * 2 + 1];
      this.data.set([uv[b * 2], uv[b * 2 + 1], uv[c * 2], uv[c * 2 + 1]], o + 12);
    }
    const pack = i => finUV ? Math.round(finUV[i * 2] * 4095) * 4096 + Math.round(finUV[i * 2 + 1] * 4095) : 0;
    const side = (this.triOffset + this.order.length * 4) * 4;
    for (let i = 0; i < this.order.length; i++) {
      const t = this.order[i];
      for (let v = 0; v < 3; v++) this.data[side + i * 4 + v] = pack(indices[t * 3 + v]);
    }
    // What refit walks, as flat tables: each triangle slot's corners (offsets into the positions),
    // and each node's leaf (first slot, or -1, and how many) and right child.
    this.corners = new Int32Array(this.order.length * 3);
    for (let i = 0; i < this.order.length; i++) for (let v = 0; v < 3; v++) this.corners[i * 3 + v] = indices[this.order[i] * 3 + v] * 3;
    this.starts = Int32Array.from(this.nodes, (node) => node.start);
    this.counts = Int32Array.from(this.nodes, (node) => node.count);
    this.rights = Int32Array.from(this.nodes, (node) => node.right);
    this.refit(positions);
  }
  // Bottom up (a node's children come after it): a leaf's triangles copied in and its box fitted
  // round them as they go, a node's box round its children's.
  refit(positions) {
    const d = this.data, corners = this.corners, starts = this.starts, counts = this.counts, rights = this.rights;
    for (let n = this.nodes.length - 1; n >= 0; n--) {
      const o = 4 + n * 8, start = starts[n];
      if (start >= 0) {
        let lx = Infinity, ly = Infinity, lz = Infinity, hx = -Infinity, hy = -Infinity, hz = -Infinity;
        for (let i = start; i < start + counts[n]; i++) {
          const t = (this.triOffset + i * 4) * 4;
          for (let v = 0; v < 3; v++) {
            const s = corners[i * 3 + v], at = t + v * 4;
            d[at] = positions[s]; d[at + 1] = positions[s + 1]; d[at + 2] = positions[s + 2];
            // (As stored: the box holds the float32 corners the shader reads.)
            const x = d[at], y = d[at + 1], z = d[at + 2];
            lx = Math.min(lx, x); ly = Math.min(ly, y); lz = Math.min(lz, z);
            hx = Math.max(hx, x); hy = Math.max(hy, y); hz = Math.max(hz, z);
          }
        }
        d[o] = lx - 0.000001; d[o + 1] = ly - 0.000001; d[o + 2] = lz - 0.000001;
        d[o + 4] = hx + 0.000001; d[o + 5] = hy + 0.000001; d[o + 6] = hz + 0.000001;
      } else {
        const l = 4 + (n + 1) * 8, r = 4 + rights[n] * 8;
        for (let k = 0; k < 3; k++) {
          d[o + k] = Math.min(d[l + k], d[r + k]) - 0.000001;
          d[o + 4 + k] = Math.max(d[l + 4 + k], d[r + 4 + k]) + 0.000001;
        }
      }
    }
  }
}

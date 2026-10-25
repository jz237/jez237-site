// Stackless, refittable triangle BVH. Nodes are in preorder; escape links skip
// whole subtrees. Leaves contain up to four consecutive triangles.
// Header: node count / triangle texel offset / triangle count / visible.
// Node: min.xyz + escape index, max.xyz + (leaf start + 1, or 0).
// Triangle: a.xyz + material, b.xyz + uv0.x, c.xyz + uv0.y, uv1.xy + uv2.xy.
// After all triangles comes a side table, one texel per triangle: each xyz holds a
// vertex's fin (u,v) as two 12-bit values packed into one exactly-representable
// float (u * 4096 + v), so the shader can tell fin rays from membrane.
export class TriangleBVH {
  constructor(positions, indices, uv, materials, finUV) {
    this.indices = indices;
    this.order = [];
    this.nodes = [];
    const centroids = Array.from({ length: indices.length / 3 }, (_, t) =>
      [0, 1, 2].map(k => (positions[indices[t * 3] * 3 + k] + positions[indices[t * 3 + 1] * 3 + k] + positions[indices[t * 3 + 2] * 3 + k]) / 3));
    const build = ids => {
      const n = this.nodes.length;
      const node = { escape: 0, start: -1, count: 0, right: -1 };
      this.nodes.push(node);
      if (ids.length <= 4) {
        node.start = this.order.length; node.count = ids.length;
        this.order.push(...ids);
      } else {
        const span = [0, 1, 2].map(k => {
          let lo = Infinity, hi = -Infinity;
          for (const i of ids) { lo = Math.min(lo, centroids[i][k]); hi = Math.max(hi, centroids[i][k]); }
          return hi - lo;
        });
        const axis = span.indexOf(Math.max(...span));
        ids.sort((a, b) => centroids[a][axis] - centroids[b][axis]);
        // The shader reads each leaf count from its packed word without
        // another texture fetch. Counts stay valid for uneven subdivisions.
        const mid = Math.floor(ids.length / 2);
        build(ids.slice(0, mid)); node.right = this.nodes.length; build(ids.slice(mid));
      }
      node.escape = this.nodes.length;
      return n;
    };
    build(Array.from({ length: centroids.length }, (_, i) => i));
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

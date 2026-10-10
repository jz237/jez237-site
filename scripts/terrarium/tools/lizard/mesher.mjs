// Sparse surface-nets mesher: evaluates the distance field only in blocks near
// the surface, then projects vertices back onto the exact zero set.

export function meshSDF(sdf, bounds, h, { block = 8, log = () => {} } = {}) {
  const pad = 3 * h;
  const min = bounds.min.map((v) => v - pad);
  const nx = Math.ceil((bounds.max[0] + pad - min[0]) / h) + 1;
  const ny = Math.ceil((bounds.max[1] + pad - min[1]) / h) + 1;
  const nz = Math.ceil((bounds.max[2] + pad - min[2]) / h) + 1;
  const bx = Math.ceil((nx - 1) / block), by = Math.ceil((ny - 1) / block), bz = Math.ceil((nz - 1) / block);
  log(`grid ${nx}x${ny}x${nz} (${((nx * ny * nz) / 1e6).toFixed(1)}M samples), ${bx * by * bz} blocks`);
  const vals = new Float32Array(nx * ny * nz).fill(NaN);
  const idx = (i, j, k) => i + nx * (j + ny * k);
  const halfDiag = (Math.sqrt(3) * block * h) / 2;
  const active = new Uint8Array(bx * by * bz);
  let evals = 0, activeCount = 0;
  for (let k = 0; k < bz; k++) for (let j = 0; j < by; j++) for (let i = 0; i < bx; i++) {
    const cx = min[0] + (i + 0.5) * block * h, cy = min[1] + (j + 0.5) * block * h, cz = min[2] + (k + 0.5) * block * h;
    const d = sdf(cx, cy, cz);
    if (Math.abs(d) > halfDiag * 1.6 + h) continue;
    active[i + bx * (j + by * k)] = 1;
    activeCount++;
    for (let kk = 0; kk <= block; kk++) for (let jj = 0; jj <= block; jj++) for (let ii = 0; ii <= block; ii++) {
      const gi = i * block + ii, gj = j * block + jj, gk = k * block + kk;
      if (gi >= nx || gj >= ny || gk >= nz) continue;
      const id = idx(gi, gj, gk);
      if (!Number.isNaN(vals[id])) continue;
      vals[id] = sdf(min[0] + gi * h, min[1] + gj * h, min[2] + gk * h);
      evals++;
    }
  }
  log(`${activeCount} active blocks, ${(evals / 1e6).toFixed(2)}M evaluations`);

  const cellVertex = new Map();
  const positions = [];
  const corner = new Float64Array(8);
  const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const OFF = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const cellKey = (i, j, k) => i + (nx - 1) * (j + (ny - 1) * k);
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    if (!active[((i / block) | 0) + bx * (((j / block) | 0) + by * ((k / block) | 0))]) continue;
    let mask = 0, ok = true;
    for (let c = 0; c < 8; c++) {
      const v = vals[idx(i + OFF[c][0], j + OFF[c][1], k + OFF[c][2])];
      if (Number.isNaN(v)) { ok = false; break; }
      corner[c] = v;
      if (v < 0) mask |= 1 << c;
    }
    if (!ok || mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of EDGES) {
      const da = corner[a], db = corner[b];
      if ((da < 0) === (db < 0)) continue;
      const t = da / (da - db);
      sx += OFF[a][0] + (OFF[b][0] - OFF[a][0]) * t;
      sy += OFF[a][1] + (OFF[b][1] - OFF[a][1]) * t;
      sz += OFF[a][2] + (OFF[b][2] - OFF[a][2]) * t;
      n++;
    }
    cellVertex.set(cellKey(i, j, k), positions.length / 3);
    positions.push(min[0] + (i + sx / n) * h, min[1] + (j + sy / n) * h, min[2] + (k + sz / n) * h);
  }
  const indices = [];
  const quad = (a, b, c, d, flip) => {
    if (a === undefined || b === undefined || c === undefined || d === undefined) return;
    if (flip) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const v0 = vals[idx(i, j, k)];
    if (Number.isNaN(v0)) continue;
    const inside = v0 < 0;
    // edge along +x shared by cells (i, j-1..j, k-1..k)
    const vx = vals[idx(i + 1, j, k)];
    if (!Number.isNaN(vx) && (vx < 0) !== inside)
      quad(cellVertex.get(cellKey(i, j - 1, k - 1)), cellVertex.get(cellKey(i, j, k - 1)), cellVertex.get(cellKey(i, j, k)), cellVertex.get(cellKey(i, j - 1, k)), !inside);
    const vy = vals[idx(i, j + 1, k)];
    if (!Number.isNaN(vy) && (vy < 0) !== inside)
      quad(cellVertex.get(cellKey(i - 1, j, k - 1)), cellVertex.get(cellKey(i - 1, j, k)), cellVertex.get(cellKey(i, j, k)), cellVertex.get(cellKey(i, j, k - 1)), !inside);
    const vz = vals[idx(i, j, k + 1)];
    if (!Number.isNaN(vz) && (vz < 0) !== inside)
      quad(cellVertex.get(cellKey(i - 1, j - 1, k)), cellVertex.get(cellKey(i, j - 1, k)), cellVertex.get(cellKey(i, j, k)), cellVertex.get(cellKey(i - 1, j, k)), !inside);
  }
  return { positions: new Float32Array(positions), indices: new Uint32Array(indices) };
}

export function gradient(sdf, x, y, z, e = 0.004) {
  const gx = sdf(x + e, y, z) - sdf(x - e, y, z);
  const gy = sdf(x, y + e, z) - sdf(x, y - e, z);
  const gz = sdf(x, y, z + e) - sdf(x, y, z - e);
  const l = Math.hypot(gx, gy, gz) || 1;
  return [gx / l, gy / l, gz / l];
}

export function projectToSurface(sdf, positions, iterations = 3, maxStep = 0.05) {
  for (let v = 0; v < positions.length; v += 3) {
    let x = positions[v], y = positions[v + 1], z = positions[v + 2];
    for (let it = 0; it < iterations; it++) {
      const d = sdf(x, y, z);
      if (Math.abs(d) < 1e-4) break;
      const g = gradient(sdf, x, y, z);
      const step = Math.max(-maxStep, Math.min(maxStep, d));
      x -= g[0] * step; y -= g[1] * step; z -= g[2] * step;
    }
    positions[v] = x; positions[v + 1] = y; positions[v + 2] = z;
  }
}

/** Removes vertices not referenced by indices. */
export function compact(positions, indices) {
  const remap = new Int32Array(positions.length / 3).fill(-1);
  const out = [];
  const idx = new Uint32Array(indices.length);
  let n = 0;
  for (let i = 0; i < indices.length; i++) {
    const v = indices[i];
    if (remap[v] < 0) { remap[v] = n++; out.push(positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]); }
    idx[i] = remap[v];
  }
  return { positions: new Float32Array(out), indices: idx };
}

// Weathering data for the world shaders (EXTERIOR graphics pass 2026-10-16). Baked once at load (a few ms), no
// downloads, deterministic (no Math.random).
//  * height map: the drawn ground height on a 0.5 m grid over the wetness-map bounds (same UV layout as tex/wet.png):
//    walls know how high above the sidewalk they are (splash band), kit pieces get a dirt band, the light volumes
//    their ground plane.
//  * facade map: 4 strips (walls facing +x, -x, +z, -z), each (along, height): R grime streaks below sills / cornices /
//    AC units / vents / lintels, G rain runs (darker, glossier), B rust stains (AC units, vents, lanterns). Envelopes
//    only (17 cm texels); the shaders add the fine streak structure with world-space noise.
import * as THREE from 'three';

export const FACADE = { x0: -64, x1: 64, z0: -104, z1: 72, y0: -1.5, y1: 14.5, W: 1024, ROWS: 128 };

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

// Tileable value noise, one octave per channel: R 8, G 16, B 32, A 64 lattice cells per tile (256^2, mipmapped).
// One fetch replaces up to four procedural noise calls in the world shaders (and the mips anti-alias them).
export function makeNoiseTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  const cells = [8, 16, 32, 64];
  for (let ch = 0; ch < 4; ch++) {
    const n = cells[ch];
    const lat = new Float32Array(n * n);
    for (let i = 0; i < n * n; i++) lat[i] = hash(i * 1.618 + ch * 97.31 + 0.5);
    const step = size / n;
    for (let y = 0; y < size; y++) {
      const fy = y / step, iy = Math.floor(fy), ty = fy - iy, sy = ty * ty * (3 - 2 * ty);
      const r0 = (iy % n) * n, r1 = ((iy + 1) % n) * n;
      for (let x = 0; x < size; x++) {
        const fx = x / step, ix = Math.floor(fx), tx = fx - ix, sx = tx * tx * (3 - 2 * tx);
        const c0 = ix % n, c1 = (ix + 1) % n;
        const a = lat[r0 + c0], b = lat[r0 + c1], c = lat[r1 + c0], d = lat[r1 + c1];
        const top = a + (b - a) * sx, bot = c + (d - c) * sx;
        data[(y * size + x) * 4 + ch] = Math.round((top + (bot - top) * sy) * 255);
      }
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  tex.name = 'pr_noise';
  return tex;
}

// Rain-drop sites for the puddle ripples: a jittered 9 x 9 grid of drops over a 4 m tile; every texel stores its
// nearest drop (Voronoi owner, wrap-around): RG centre (tile units), B phase, A period. Sampled NEAREST, so the shader
// gets the exact owner and computes the ring from the true offset: one fetch per fragment instead of a 3 x 3 search.
export function makeRippleTexture(size = 256, grid = 9) {
  const drops = [];
  for (let j = 0; j < grid; j++) {
    for (let i = 0; i < grid; i++) {
      const k = j * grid + i;
      drops.push({ x: (i + 0.5 + (hash(k * 3.1 + 1.3) - 0.5) * 0.3) / grid, y: (j + 0.5 + (hash(k * 5.7 + 2.9) - 0.5) * 0.3) / grid,
        ph: hash(k * 7.3 + 3.7), per: hash(k * 9.1 + 4.1) });
    }
  }
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size, v = (y + 0.5) / size;
      const ci = Math.floor(u * grid), cj = Math.floor(v * grid);
      let best = 1e9, bd = drops[0];
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const d = drops[((cj + dj + grid) % grid) * grid + ((ci + di + grid) % grid)];
          let dx = u - d.x, dy = v - d.y;
          dx -= Math.round(dx); dy -= Math.round(dy);
          const dd = dx * dx + dy * dy;
          if (dd < best) { best = dd; bd = d; }
        }
      }
      const o = (y * size + x) * 4;
      data[o] = Math.round(bd.x * 255); data[o + 1] = Math.round(bd.y * 255);
      data[o + 2] = Math.round(bd.ph * 255); data[o + 3] = Math.round(bd.per * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  tex.name = 'pr_ripple_sites';
  return tex;
}

export function bakeHeightMap(groundH, bounds, cell = 0.5) {
  const [x0, z0, x1, z1] = bounds;
  const nx = Math.round((x1 - x0) / cell), nz = Math.round((z1 - z0) / cell);
  const data = new Uint16Array(nx * nz);
  // row j = v (0 at z1, like the wetness map: v = 1 - (z - z0) / (z1 - z0)); column i = u
  let last = 0;
  for (let j = 0; j < nz; j++) {
    const z = z1 - (j + 0.5) * cell;
    for (let i = 0; i < nx; i++) {
      const x = x0 + (i + 0.5) * cell;
      let y = groundH.y(x, z, NaN);
      if (Number.isNaN(y)) y = last; else last = y;
      data[j * nx + i] = THREE.DataUtils.toHalfFloat(y);
    }
  }
  const tex = new THREE.DataTexture(data, nx, nz, THREE.RedFormat, THREE.HalfFloatType);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.flipY = false;
  tex.needsUpdate = true;
  tex.name = 'pr_heightmap';
  return tex;
}

// data: witte_world.json; pieceBox(name) -> THREE.Box3 of the piece (local, unscaled) or null
export function bakeFacadeMap(data, pieceBox) {
  const { W, ROWS, x0, x1, z0, z1, y0, y1 } = FACADE;
  const c = document.createElement('canvas');
  c.width = W; c.height = ROWS * 4;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, ROWS * 4);
  g.globalCompositeOperation = 'lighter';
  const rowOf = (strip, y) => strip * ROWS + ((y - y0) / (y1 - y0)) * ROWS;
  const colOf = (strip, a) => (strip < 2 ? ((a - z0) / (z1 - z0)) * W : ((a - x0) / (x1 - x0)) * W);
  // a run from height ytop down by len (m), width w (m) centred on along a; channel 'r' | 'g' | 'b'
  function run(strip, a, ytop, len, w, ch, alpha, curve = 1) {
    if (alpha <= 0.003 || len <= 0.02) return;
    const xa = colOf(strip, a - w / 2), xb = colOf(strip, a + w / 2);
    const rTop = rowOf(strip, ytop), rBot = rowOf(strip, ytop - len);
    const lo = Math.max(strip * ROWS, Math.min(rTop, rBot)), hi = Math.min((strip + 1) * ROWS, Math.max(rTop, rBot));
    if (hi <= lo) return;
    const rgb = ch === 'r' ? '255,0,0' : ch === 'g' ? '0,255,0' : '0,0,255';
    const gr = g.createLinearGradient(0, rTop, 0, rBot);
    gr.addColorStop(0, `rgba(${rgb},${alpha.toFixed(3)})`);
    gr.addColorStop(Math.min(0.95, 0.35 * curve), `rgba(${rgb},${(alpha * 0.7).toFixed(3)})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(Math.min(xa, xb), lo, Math.max(1, Math.abs(xb - xa)), hi - lo);
  }
  const q = new THREE.Quaternion();
  const f = new THREE.Vector3();
  const sizeCache = new Map();
  const sizeOf = (name) => {
    if (sizeCache.has(name)) return sizeCache.get(name);
    const b = pieceBox(name);
    const s = b ? { w: b.max.x - b.min.x, h: b.max.y - b.min.y, y0: b.min.y } : { w: 0.9, h: 1.4, y0: 0 };
    sizeCache.set(name, s);
    return s;
  };
  data.instances.forEach((r, i) => {
    const kind = data.kinds[r[1]];
    const name = data.pieces[r[0]];
    if (!['opening', 'ac', 'cornice', 'downspout', 'sill', 'lintel', 'wall_item', 'rollup_hood', 'canopy', 'awning'].includes(kind)) return;
    q.set(r[5], r[6], r[7], r[8]);
    f.set(0, 0, -1).applyQuaternion(q);
    const strip = Math.abs(f.x) >= Math.abs(f.z) ? (f.x > 0 ? 0 : 1) : (f.z > 0 ? 2 : 3);
    const along = strip < 2 ? r[4] : r[2];
    const base = r[3];
    const sz = sizeOf(name);
    const w = Math.max(0.2, sz.w * Math.abs(r[9] || 1));
    const h = Math.max(0.1, sz.h * Math.abs(r[10] || 1));
    const h1 = hash(i * 1.37 + 0.11), h2 = hash(i * 2.71 + 0.53), h3 = hash(i * 3.97 + 0.29), h4 = hash(i * 5.13 + 0.77);
    const win = kind === 'opening' && /Win|GlassBlock|WallVent/.test(name);
    const vent = /WallVent/.test(name);
    const door = kind === 'opening' && !win;
    if (win || kind === 'sill') {
      const sill = base + (kind === 'sill' ? sz.y0 : 0);
      const L = 0.7 + 2.1 * h1 * h1 + (vent ? 0.6 : 0);
      run(strip, along, sill, L, w * 0.92, 'r', 0.32 + 0.4 * h2, 0.8);
      // water drips off the sill ends: two darker runs
      for (const s of [-1, 1]) {
        const k = hash(i * 7.1 + s * 3.3);
        run(strip, along + s * w * (0.36 + 0.08 * k), sill, L * (0.9 + 0.7 * k), 0.12 + 0.12 * k, 'r', 0.5 + 0.4 * k, 0.6);
        run(strip, along + s * w * (0.38 + 0.06 * k), sill, L * (0.6 + 0.5 * k), 0.1 + 0.08 * k, 'g', 0.3 + 0.4 * h3, 0.5);
      }
      // a few thinner runs across the sill
      const n = 2 + Math.floor(h4 * 3);
      for (let k = 0; k < n; k++) {
        const u = hash(i * 11.3 + k * 1.7) - 0.5;
        run(strip, along + u * w * 0.8, sill, L * (0.5 + hash(i * 13.1 + k)), 0.05 + 0.06 * hash(i + k * 9.1), 'r', 0.25 + 0.3 * hash(i * 3.3 + k), 0.5);
      }
      if (vent) run(strip, along, sill, L * 0.8, w * 0.8, 'b', 0.35 + 0.3 * h3, 0.6);
      // the window head: water past the jambs
      if (win && !vent) for (const s of [-1, 1]) run(strip, along + s * (w * 0.5 + 0.04), base + h + 0.08, h * 0.7 + 0.3 * h2, 0.09, 'r', 0.16 + 0.16 * h3, 0.5);
    } else if (door) {
      const top = base + h + 0.05;
      for (const s of [-1, 1]) run(strip, along + s * (w * 0.5 + 0.05), top, 0.6 + 0.9 * h1, 0.1 + 0.06 * h2, 'r', 0.18 + 0.2 * h3, 0.6);
    } else if (kind === 'ac') {
      run(strip, along, base + 0.05, 1.4 + 1.6 * h1, Math.max(0.35, w * 0.7), 'b', 0.4 + 0.35 * h2, 0.7);
      run(strip, along, base + 0.05, 2.2 + 1.8 * h3, Math.max(0.45, w * 0.9), 'r', 0.3 + 0.3 * h4, 0.7);
      run(strip, along + (h2 - 0.5) * w * 0.5, base, 2.5 + 2.0 * h1, 0.18, 'g', 0.5, 0.5);
    } else if (kind === 'cornice' || kind === 'rollup_hood' || kind === 'canopy' || kind === 'awning') {
      const n = Math.max(2, Math.round(w / 0.3));
      const top = base + (sz.y0 || 0);
      for (let k = 0; k < n; k++) {
        const u = (k + 0.5) / n - 0.5 + (hash(i * 3.1 + k * 0.7) - 0.5) / n;
        const hk = hash(i * 17.7 + k * 1.3);
        run(strip, along + u * w, top, 0.5 + 2.8 * hk * hk, 0.1 + 0.25 * hash(i * 2.3 + k), 'r', 0.15 + 0.3 * hash(i * 9.9 + k), 0.6);
        if (hk > 0.6) run(strip, along + u * w, top, 1.0 + 2.5 * hk, 0.08, 'g', 0.35, 0.5);
      }
    } else if (kind === 'downspout') {
      run(strip, along, base + h, h + 0.3, 0.35, 'g', 0.45, 1.6);
      run(strip, along, base + 0.7, 0.8, 0.7, 'r', 0.45, 0.8);
    } else if (kind === 'lintel') {
      for (const s of [-1, 1]) run(strip, along + s * w * 0.45, base, 0.8 + 1.2 * hash(i + s), 0.08, 'r', 0.2, 0.5);
    } else if (kind === 'wall_item') {
      run(strip, along, base, 0.9 + 1.2 * h1, Math.max(0.15, w * 0.6), 'r', 0.25 + 0.2 * h2, 0.6);
      run(strip, along, base, 0.6 + 0.8 * h3, Math.max(0.1, w * 0.4), 'b', 0.2 + 0.25 * h4, 0.6);
    }
  });
  // porch lanterns (lamp records): rust + soot below the fixture
  for (const l of data.lamps || []) {
    if (l.kind === 'cobra' || !l.base) continue;
    const dx = l.pos[0] - l.base[0], dz = l.pos[2] - l.base[2];
    const strip = Math.abs(dx) >= Math.abs(dz) ? (dx > 0 ? 0 : 1) : (dz > 0 ? 2 : 3);
    const along = strip < 2 ? l.pos[2] : l.pos[0];
    run(strip, along, l.pos[1] - 0.1, 1.1, 0.16, 'b', 0.45, 0.6);
    run(strip, along, l.pos[1] - 0.1, 1.6, 0.3, 'r', 0.3, 0.6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.flipY = false;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  tex.name = 'pr_facade_weather';
  return tex;
}

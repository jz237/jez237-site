// terrain.js — the ground: one analytic height/colour function shared by the
// mesh builder and everything that needs to sit on the ground (props, feet,
// shadows, particles). Heights and walkability come from the same data, so
// what you see is what you collide with.
import * as THREE from 'three';
import { fbm, noise2, pwl, smooth, clamp, lerp, hexColor, mulberry } from './util.js';

export const X_EXTENT = 48;           // metres either side of centre that get ground

export class Terrain {
  constructor(area) {
    this.area = area;
    this.trenches = area.props.filter(p => p.t === 'trench');
    this.pits = area.props.filter(p => p.t === 'mortarpit');
    this.biomeTable = area.biomes;
    // shell craters pock the open ground from the scrub to the fortress
    const r = mulberry(4077);
    this.craters = [];
    for (let p = 80; p < (area.wallP || area.length) - 6; p += 3.2 + r() * 5) {
      if (area.river && p > area.river.p0 - 3 && p < area.river.p1 + 3) continue;
      const hw = this.halfWidth(p), x = (r() * 2 - 1) * (hw + 4);
      if (this.trenches.some(t => Math.abs(t.p - p) < 3)) continue;
      this.craters.push({ x, p: p + r() * 2, r: 1.1 + r() * 1.6 });
    }
    // baked contact shadow: the ground darkens around everything standing on it
    const AO = { crate: [1.0, 0.3], barrel: [0.6, 0.25], jeep: [2.4, 0.4], tent: [2.3, 0.35], hut: [3.2, 0.45], rock: [1.3, 0.35],
      bunker: [3.8, 0.5], tower: [2.0, 0.25], hedgehog: [0.9, 0.2], mortarpit: [2.7, 0.35], campfire: [1.0, 0.3], palm: [1.2, 0.3], bush: [1.4, 0.4] };
    this.occ = [];
    for (const pr of area.props) {
      if (pr.t === 'sandbags' || pr.t === 'log') {
        const pts = pr.pts || [[pr.x - Math.cos(pr.rot || 0) * (pr.len || 2) / 2, pr.p - Math.sin(pr.rot || 0) * (pr.len || 2) / 2], [pr.x + Math.cos(pr.rot || 0) * (pr.len || 2) / 2, pr.p + Math.sin(pr.rot || 0) * (pr.len || 2) / 2]];
        for (let i = 0; i < pts.length - 1; i++) this.occ.push({ seg: [pts[i], pts[i + 1]], r: 0.95, k: 0.38, p: (pts[i][1] + pts[i + 1][1]) / 2 });
      } else if (AO[pr.t]) this.occ.push({ x: pr.x, p: pr.p, r: AO[pr.t][0] * (pr.s || 1), k: AO[pr.t][1] });
    }
    this.craterGrid = new Map();
    for (const c of this.craters) for (let k = Math.floor((c.p - 4) / 8); k <= Math.floor((c.p + 4) / 8); k++) { if (!this.craterGrid.has(k)) this.craterGrid.set(k, []); this.craterGrid.get(k).push(c); }
  }
  craterAt(x, p) {
    // returns [heightDelta, scorch 0..1]
    let dh = 0, sc = 0;
    for (const c of this.craterGrid.get(Math.floor(p / 8)) || []) {
      const d = Math.hypot(x - c.x, p - c.p) / c.r;
      if (d > 1.6) continue;
      dh += d < 1 ? -0.38 * c.r * 0.5 * (1 - d * d) + 0.1 : 0.1 * (1 - smooth(1, 1.6, d)) * 1.0;
      sc = Math.max(sc, 1 - smooth(0.2, 1.25, d));
    }
    return [dh, sc];
  }
  halfWidth(p) { return pwl(this.area.halfWidth, p); }
  roadX(p) { return pwl(this.area.road, p); }

  // 0..1 membership of each biome at p (6 m cross-fades)
  biomeWeights(p) {
    const b = this.biomeTable, w = {};
    for (let i = 0; i < b.length; i++) {
      const start = b[i].p, end = i + 1 < b.length ? b[i + 1].p : 1e9;
      const a = smooth(start - 3, start + 3, p) * (1 - smooth(end - 3, end + 3, p));
      w[b[i].kind] = (w[b[i].kind] || 0) + (i === 0 ? (1 - smooth(end - 3, end + 3, p)) : a);
    }
    return w;
  }

  riverDepth(x, p) {
    const r = this.area.river; if (!r) return 0;
    const wob = noise2(x * 0.12, 3.3) * 0.9;
    const inRiver = smooth(r.p0 - 1.5 + wob, r.p0 + 1.2 + wob, p) * (1 - smooth(r.p1 - 1.2 - wob, r.p1 + 1.5 - wob, p));
    return inRiver;
  }
  pondDepth(x, p) {
    const q = this.area.pond; if (!q) return 0;
    const d = Math.hypot(x - q.x, (p - q.p) * 1.15) + noise2(x * 0.5, p * 0.5) * 0.6;
    return 1 - smooth(q.r - 1.2, q.r + 0.6, d);
  }
  trenchDepth(x, p) {
    let m = 0;
    for (const t of this.trenches) {
      const dp = Math.abs(p - t.p);
      const inX = smooth(t.x0 - 0.3, t.x0 + 0.35, x) * (1 - smooth(t.x1 - 0.35, t.x1 + 0.3, x));
      m = Math.max(m, (1 - smooth(0.62, 0.95, dp)) * inX);
    }
    return m;
  }

  height(x, p) {
    const hw = this.halfWidth(p);
    const e = Math.abs(x) - hw;
    let h = fbm(x * 0.06, p * 0.06, 3) * 0.35 + fbm(x * 0.35, p * 0.35, 2) * 0.05;
    // jungle walls: the ground climbs into a raised bank beyond the corridor
    const bank = smooth(-1, 7, e);
    h += bank * (1.6 + fbm(x * 0.09 + 10, p * 0.09, 3) * 1.2);
    // river channel + pond
    const rd = this.riverDepth(x, p);
    h = lerp(h, -1.7 + fbm(x * 0.2, p * 0.2, 2) * 0.15, rd);
    h = lerp(h, -1.2, this.pondDepth(x, p));
    // trenches: vertical-ish cut
    h = lerp(h, -1.25, this.trenchDepth(x, p));
    // mortar pits: shallow bowl
    for (const q of this.pits) {
      const d = Math.hypot(x - q.x, p - q.p);
      h -= (1 - smooth(1.2, 2.0, d)) * 0.35;
    }
    h += this.craterAt(x, p)[0];
    // road is worn slightly into the ground
    const rx = Math.abs(x - this.roadX(p));
    h -= (1 - smooth(1.2, 2.6, rx)) * 0.06 * (1 - rd);
    // flatten the fortress plaza & wall footing
    const wp = this.area.wallP;
    if (wp) h = lerp(h, 0.02, smooth(wp - 8, wp - 2, p) * (1 - bank * 0.4));
    return h;
  }

  // ground albedo (linear-ish sRGB triplet before texture detail)
  color(x, p, h) {
    const w = this.biomeWeights(p);
    const n1 = fbm(x * 0.11 + 7, p * 0.11, 3), n2 = fbm(x * 0.5, p * 0.5, 2), n3 = noise2(x * 1.7, p * 1.7);
    const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
    const C = (hex) => hexColor(hex);
    let col = [0, 0, 0];
    const add = (c, k) => { col[0] += c[0] * k; col[1] += c[1] * k; col[2] += c[2] * k; };
    // per-biome ground (dirt with patches)
    const grassy = smooth(-0.1, 0.35, n1);
    const pal = {
      lz: mix3(C('#7a5d3b'), C('#5a6a2c'), grassy * 0.8),
      jungle: mix3(C('#5e4a31'), C('#46592a'), smooth(-0.3, 0.2, n1)),
      scrub: mix3(C('#8f744c'), C('#7f7a3e'), grassy * 0.7),
      river: mix3(C('#6a5536'), C('#55632c'), grassy * 0.6),
      desert: mix3(C('#a88a5d'), C('#8d7348'), smooth(-0.2, 0.4, n1)),
      fort: mix3(C('#8e7b5d'), C('#6f6555'), smooth(-0.2, 0.3, n1) * 0.7),
    };
    let tw = 0; for (const k in w) { if (pal[k]) { add(pal[k], w[k]); tw += w[k]; } }
    if (tw > 0) col = col.map(v => v / tw);
    // fine mottling
    const m = 1 + n2 * 0.12 + n3 * 0.05;
    col = col.map(v => v * m);
    // road: paler packed dirt with two darker wheel ruts
    const rdx = x - this.roadX(p);
    const road = (1 - smooth(1.5, 2.9, Math.abs(rdx + noise2(p * 0.3, 1) * 0.4))) * (1 - (w.fort || 0) * 0.5);
    const rut = (1 - smooth(0.12, 0.32, Math.abs(Math.abs(rdx) - 0.95)));
    col = mix3(col, mix3(C('#ad8d61'), C('#7d6343'), rut * 0.75), road * 0.85);
    // jungle floor beyond the corridor: dark leaf litter + moss
    const hw = this.halfWidth(p), e = Math.abs(x) - hw;
    const floor = smooth(-2, 3, e) * (1 - (w.desert || 0) * 0.6) * (1 - (w.fort || 0) * 0.7);
    col = mix3(col, mix3(C('#3a4a22'), C('#4d3d27'), smooth(-0.2, 0.3, n2)), floor * 0.85);
    // wet mud around water, dark soil in trenches and pits
    const wet = Math.max(this.riverDepth(x, p), this.pondDepth(x, p));
    col = mix3(col, C('#4b3d2a'), smooth(0.02, 0.4, wet) * 0.9);
    const cs = this.craterAt(x, p)[1];
    col = mix3(col, mix3(C('#4a3b2b'), C('#2e271f'), cs), cs * 0.75);
    const tr = this.trenchDepth(x, p);
    col = mix3(col, C('#4a3a27'), smooth(0.05, 0.6, tr));
    // contact shadow around props and along the fortress wall
    let ao = 1;
    for (const o of this.occ) {
      if (Math.abs(o.p - p) > 6) continue;
      let d;
      if (o.seg) {
        const [[x0, p0], [x1, p1]] = o.seg, vx = x1 - x0, vp = p1 - p0;
        const t = clamp(((x - x0) * vx + (p - p0) * vp) / (vx * vx + vp * vp || 1), 0, 1);
        d = Math.hypot(x - (x0 + vx * t), p - (p0 + vp * t));
      } else d = Math.hypot(x - o.x, p - o.p);
      if (d < o.r) ao *= 1 - o.k * (1 - smooth(0, o.r, d)) ** 1.5;
    }
    if (this.area.wallP) ao *= 1 - 0.45 * (1 - smooth(0, 2.5, Math.abs(this.area.wallP - p))) * smooth(this.area.wallP - 3, this.area.wallP, p);
    ao *= 1 - 0.25 * (1 - smooth(0, 3, Math.abs(e - 1)));   // under the jungle edge
    return col.map(v => v * ao);
  }

  buildMesh(pMin, pMax) {
    // rows: 0.6 m spacing, tighter near trench lines and river banks so
    // their edges stay crisp
    const rows = [];
    const dense = [];
    for (const t of this.trenches) dense.push([t.p - 1.6, t.p + 1.6]);
    if (this.area.river) dense.push([this.area.river.p0 - 2.5, this.area.river.p0 + 2.5], [this.area.river.p1 - 2.5, this.area.river.p1 + 2.5]);
    for (let p = pMin; p <= pMax;) {
      rows.push(p);
      const inDense = dense.some(([a, b]) => p >= a && p <= b);
      p += inDense ? 0.22 : 0.6;
    }
    const cols = [];
    for (let x = -X_EXTENT; x <= X_EXTENT + 1e-6; x += 0.6) cols.push(x);
    const nx = cols.length, nz = rows.length;
    const pos = new Float32Array(nx * nz * 3), col = new Float32Array(nx * nz * 3), uv = new Float32Array(nx * nz * 2);
    let i = 0;
    for (let r = 0; r < nz; r++) {
      const p = rows[r];
      for (let c = 0; c < nx; c++, i++) {
        const x = cols[c] + (r % 2 ? 0 : 0); const h = this.height(x, p);
        pos[i * 3] = x; pos[i * 3 + 1] = h; pos[i * 3 + 2] = -p;
        const cc = this.color(x, p, h);
        col[i * 3] = cc[0]; col[i * 3 + 1] = cc[1]; col[i * 3 + 2] = cc[2];
        uv[i * 2] = x / 5; uv[i * 2 + 1] = p / 5;
      }
    }
    const idx = new Uint32Array((nx - 1) * (nz - 1) * 6);
    let k = 0;
    for (let r = 0; r < nz - 1; r++) for (let c = 0; c < nx - 1; c++) {
      const a = r * nx + c, b = a + 1, d = a + nx, e = d + 1;
      idx[k++] = a; idx[k++] = b; idx[k++] = d; idx[k++] = b; idx[k++] = e; idx[k++] = d;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals();
    // vertex colours are authored in sRGB; convert once to linear for lighting
    const c3 = new THREE.Color();
    for (let j = 0; j < col.length; j += 3) {
      c3.setRGB(col[j], col[j + 1], col[j + 2], THREE.SRGBColorSpace);
      col[j] = c3.r; col[j + 1] = c3.g; col[j + 2] = c3.b;
    }
    return g;
  }
}

// ground material: vertex colour x detail texture sampled at two scales so the
// tiling never lines up, plus a detail normal map for grazing sunlight
export function groundMaterial(detail) {
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true, map: detail.map, normalMap: detail.normal,
    normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.96, metalness: 0,
  });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `
      #ifdef USE_MAP
        vec4 texA = texture2D( map, vMapUv );
        vec4 texB = texture2D( map, vMapUv * 0.27 + vec2(0.37, 0.61) );
        diffuseColor.rgb *= mix(texA.rgb, texB.rgb, 0.4) * 1.18;
      #endif
    `);
  };
  return m;
}

export function waterMaterial(normalTex) {
  const n = normalTex.clone(); n.needsUpdate = true;
  n.wrapS = n.wrapT = THREE.RepeatWrapping;
  const m = new THREE.MeshStandardMaterial({
    color: 0x3a6356, roughness: 0.06, metalness: 0.0, transparent: true, opacity: 0.82,
    normalMap: n, normalScale: new THREE.Vector2(0.45, 0.45), envMapIntensity: 1.6,
  });
  m.userData.tick = (t) => { n.offset.set(t * 0.012, -t * 0.03); };
  return m;
}

export function clampToCorridor(terrain, x, p, r = 0.4) {
  const hw = terrain.halfWidth(p) - r;
  return clamp(x, -hw, hw);
}

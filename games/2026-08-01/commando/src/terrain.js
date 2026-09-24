// terrain.js — the ground: one analytic height/colour function shared by the
// mesh builder and everything that needs to sit on the ground (props, feet,
// shadows, particles). Heights, water and walkability all come from the same
// data, so what you see is what you collide with.
import * as THREE from 'three';
import { fbm, noise2, pwl, smooth, clamp, lerp, hexColor, mulberry } from './util.js';

export const X_EXTENT = 48;           // metres either side of centre that get ground

const C = (hex) => hexColor(hex);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// ground palette per biome: open ground A/B (mixed by noise) and the floor
// beyond the corridor edge
const PAL = {
  lz: { a: '#7a5d3b', b: '#5a6a2c', k: 0.8, floor: 'jungle' },
  jungle: { a: '#5e4a31', b: '#46592a', k: 1, floor: 'jungle' },
  scrub: { a: '#8f744c', b: '#7f7a3e', k: 0.7, floor: 'jungle' },
  river: { a: '#6a5536', b: '#55632c', k: 0.6, floor: 'jungle' },
  desert: { a: '#a88a5d', b: '#8d7348', k: 1, floor: 'dry' },
  fort: { a: '#8e7b5d', b: '#6f6555', k: 0.7, floor: 'dry' },
  beach: { a: '#b49a6c', b: '#9c8458', k: 0.8, floor: 'jungle' },
  camp: { a: '#6d573b', b: '#5b4a33', k: 0.8, floor: 'jungle' },
  ravine: { a: '#7c6c56', b: '#6a5e4c', k: 0.8, floor: 'rock' },
  swamp: { a: '#4d4631', b: '#3e4a2b', k: 1, floor: 'swamp' },
  motor: { a: '#6e6552', b: '#5a5446', k: 0.8, floor: 'dry' },
};
const FLOOR = {
  jungle: ['#3a4a22', '#4d3d27'], dry: ['#7a6a4c', '#6b5c42'], rock: ['#6f6860', '#4f4a44'], swamp: ['#2e3a24', '#35301f'],
};

export class Terrain {
  constructor(area) {
    this.area = area;
    this.trenches = area.props.filter(p => p.t === 'trench');
    this.pits = area.props.filter(p => p.t === 'mortarpit');
    this.bridges = area.props.filter(p => p.t === 'bridge');
    this.biomeTable = area.biomes;
    this.waters = (area.waters || []).map((w, i) => ({ seed: 3.3 + i * 7.1, wob: 0.9, ...w }));
    this.lands = area.lands || [];
    this.wet = 0;
    // shell craters pock the open ground
    const r = mulberry(4077 + area.id * 13);
    this.craters = [];
    const cr = area.craters;
    if (cr) for (let p = cr.from; p < cr.to; p += 3.2 + r() * 5) {
      const hw = this.halfWidth(p), x = (r() * 2 - 1) * (hw + 4);
      if (this.waterFrac(x, p) > 0.01 || this.waterFrac(x, p - 4) > 0.01 || this.waterFrac(x, p + 4) > 0.01) continue;
      if (this.trenches.some(t => Math.abs(t.p - p) < 3)) continue;
      this.craters.push({ x, p: p + r() * 2, r: 1.1 + r() * 1.6 });
    }
    // baked contact shadow: the ground darkens around everything standing on it
    const AO = { crate: [1.0, 0.3], barrel: [0.6, 0.25], jeep: [2.4, 0.4], tent: [2.3, 0.35], hut: [3.2, 0.45], rock: [1.3, 0.35],
      bunker: [3.8, 0.5], tower: [2.0, 0.25], hedgehog: [0.9, 0.2], mortarpit: [2.7, 0.35], campfire: [1.0, 0.3], palm: [1.2, 0.3], bush: [1.4, 0.4],
      boat: [3.2, 0.4], deadtree: [1.2, 0.3], cage: [2.2, 0.35], barracks: [4.8, 0.45], searchtower: [2.0, 0.25], parkedtruck: [3.4, 0.45],
      fueltank: [2.6, 0.4], lamp: [0.5, 0.2], gatepost: [0.7, 0.3] };
    this.occ = [];
    for (const pr of area.props) {
      if (pr.t === 'sandbags' || pr.t === 'log' || pr.t === 'palisade' || pr.t === 'fence') {
        const pts = pr.pts || [[pr.x - Math.cos(pr.rot || 0) * (pr.len || 2) / 2, pr.p - Math.sin(pr.rot || 0) * (pr.len || 2) / 2], [pr.x + Math.cos(pr.rot || 0) * (pr.len || 2) / 2, pr.p + Math.sin(pr.rot || 0) * (pr.len || 2) / 2]];
        const k = pr.t === 'palisade' ? 0.5 : pr.t === 'fence' ? 0.2 : 0.38;
        for (let i = 0; i < pts.length - 1; i++) this.occ.push({ seg: [pts[i], pts[i + 1]], r: pr.t === 'palisade' ? 1.6 : 0.95, k, p: (pts[i][1] + pts[i + 1][1]) / 2 });
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
  roadX(p) { return this.area.road ? pwl(this.area.road, p) : 0; }
  bankH(p) { return this.area.bank ? pwl(this.area.bank, p) : 1.6; }
  bankSpan(p) { return this.area.bankSpan ? pwl(this.area.bankSpan, p) : 7; }

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

  // ---------------------------------------------------------------- water
  _membership(w, x, p) {
    if (w.t === 'band') {
      const wob = noise2(x * 0.12, w.seed) * w.wob;
      return smooth(w.p0 - 1.5 + wob, w.p0 + 1.2 + wob, p) * (1 - smooth(w.p1 - 1.2 - wob, w.p1 + 1.5 - wob, p));
    }
    const d = Math.hypot((x - w.x) / w.rx, (p - w.p) / w.rp) + noise2(x * 0.5 + w.seed, p * 0.5) * 0.15;
    return 1 - smooth(0.72, 1.1, d);
  }
  // land raised out of the water: causeways and islands
  landAt(x, p) {
    let l = 0;
    for (const L of this.lands) {
      let d, w;
      if (L.t === 'isle') { d = Math.hypot(x - L.x, p - L.p) + noise2(x * 0.6, p * 0.6) * 0.5; w = L.r; }
      else {
        d = 1e9; w = L.w;
        const P = L.pts;
        for (let i = 0; i < P.length - 1; i++) {
          const [x0, p0] = P[i], [x1, p1] = P[i + 1];
          if (p < Math.min(p0, p1) - 4 || p > Math.max(p0, p1) + 4) continue;
          const vx = x1 - x0, vp = p1 - p0, t = clamp(((x - x0) * vx + (p - p0) * vp) / (vx * vx + vp * vp || 1), 0, 1);
          d = Math.min(d, Math.hypot(x - (x0 + vx * t), p - (p0 + vp * t)));
        }
        d += noise2(x * 0.7, p * 0.7) * 0.25;
      }
      l = Math.max(l, 1 - smooth(w - 0.5, w + 0.9, d));
    }
    return l;
  }
  // strongest water at a point: { w (shape), raw (before land), m (after land) }
  waterAt(x, p) {
    let best = null, bm = 0;
    for (const w of this.waters) { const m = this._membership(w, x, p); if (m > bm) { bm = m; best = w; } }
    if (!best) return null;
    const l = this.lands.length ? this.landAt(x, p) : 0;
    return { w: best, raw: bm, m: bm * (1 - l), land: l };
  }
  waterFrac(x, p) { const a = this.waterAt(x, p); return a ? a.m : 0; }
  onBridge(x, p) { for (const b of this.bridges) if (Math.abs(x - b.x) < b.half + 0.15 && p > b.p0 - 0.5 && p < b.p1 + 0.5) return true; return false; }
  // deep water stops you; the swamp only slows you down
  waterBlocks(x, p) {
    const a = this.waterAt(x, p);
    return !!a && a.m > 0.45 && !a.w.wade && !this.onBridge(x, p);
  }
  wading(x, p) { const a = this.waterAt(x, p); return a && a.w.wade && a.m > 0.3 ? a : null; }
  // the height soldiers stand at: waist-deep in wadeable water
  standY(x, p) {
    const h = this.height(x, p), a = this.waterAt(x, p);
    if (a && a.w.wade && a.m > 0.05) return Math.max(h, a.w.level - 0.55);
    return h;
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
    // the walls: the ground climbs into a raised bank (or a cliff) beyond the corridor
    const bh = this.bankH(p), span = this.bankSpan(p);
    const bank = smooth(-1, span, e);
    h += bank * (bh + fbm(x * 0.09 + 10, p * 0.09, 3) * bh * 0.75);
    if (span < 4) h += bank * fbm(x * 0.4, p * 0.4, 2) * 0.6;   // broken rock on cliff tops
    // water carves its bed; causeways and islands rise back out of it
    let rd = 0;
    for (const w of this.waters) {
      const m = this._membership(w, x, p);
      if (m <= 0) continue;
      rd = Math.max(rd, m);
      h = lerp(h, w.bed + fbm(x * 0.2, p * 0.2, 2) * 0.15, m);
    }
    if (rd > 0 && this.lands.length) {
      const l = this.landAt(x, p);
      if (l > 0) {
        const lvl = this.waterAt(x, p).w.level;
        h = lerp(h, lvl + 0.3 + fbm(x * 0.3, p * 0.3, 2) * 0.1, l * rd);
        rd *= 1 - l;
      }
    }
    // trenches: vertical-ish cut
    h = lerp(h, -1.25, this.trenchDepth(x, p));
    // mortar pits: shallow bowl
    for (const q of this.pits) {
      const d = Math.hypot(x - q.x, p - q.p);
      h -= (1 - smooth(1.2, 2.0, d)) * 0.35;
    }
    h += this.craterAt(x, p)[0];
    // road is worn slightly into the ground
    if (this.area.road) {
      const rx = Math.abs(x - this.roadX(p));
      h -= (1 - smooth(1.2, 2.6, rx)) * 0.06 * (1 - rd);
    }
    // flatten the plaza & wall footing in front of the gate
    const wp = this.area.wallP;
    if (wp) h = lerp(h, 0.02, smooth(wp - 8, wp - 2, p) * (1 - bank * 0.4));
    return h;
  }

  // ground albedo (sRGB triplet before texture detail)
  color(x, p, h) {
    const w = this.biomeWeights(p);
    const n1 = fbm(x * 0.11 + 7, p * 0.11, 3), n2 = fbm(x * 0.5, p * 0.5, 2), n3 = noise2(x * 1.7, p * 1.7);
    let col = [0, 0, 0], flo = [0, 0, 0], tw = 0;
    const grassy = smooth(-0.1, 0.35, n1);
    for (const k in w) {
      const P = PAL[k]; if (!P || w[k] <= 0) continue;
      const g = mix3(C(P.a), C(P.b), grassy * P.k), F = FLOOR[P.floor];
      const f = mix3(C(F[0]), C(F[1]), smooth(-0.2, 0.3, n2));
      for (let i = 0; i < 3; i++) { col[i] += g[i] * w[k]; flo[i] += f[i] * w[k]; }
      tw += w[k];
    }
    if (tw > 0) { col = col.map(v => v / tw); flo = flo.map(v => v / tw); }
    // fine mottling
    const m = 1 + n2 * 0.12 + n3 * 0.05;
    col = col.map(v => v * m);
    // road: paler packed dirt with two darker wheel ruts
    if (this.area.road) {
      const rdx = x - this.roadX(p);
      const road = (1 - smooth(1.5, 2.9, Math.abs(rdx + noise2(p * 0.3, 1) * 0.4))) * (1 - (w.fort || 0) * 0.5) * (1 - (w.swamp || 0) * 0.6);
      const rut = (1 - smooth(0.12, 0.32, Math.abs(Math.abs(rdx) - 0.95)));
      col = mix3(col, mix3(C('#ad8d61'), C('#7d6343'), rut * 0.75), road * 0.8);
    }
    // the floor beyond the corridor edge (leaf litter, rock, dry scrub, swamp)
    const hw = this.halfWidth(p), e = Math.abs(x) - hw;
    col = mix3(col, flo, smooth(-2, 3, e) * 0.85);
    // cliff faces read as bare rock
    if (this.bankSpan(p) < 4) {
      const s = Math.abs(this.height(x + 0.4, p) - this.height(x - 0.4, p)) / 0.8;
      col = mix3(col, mix3(C('#7d766c'), C('#5a544c'), smooth(-0.3, 0.4, n2)), smooth(0.6, 1.6, s) * 0.9);
    }
    // wet mud at the water's edge, dark soil in trenches, scorch in craters
    const wa = this.waterAt(x, p);
    if (wa) {
      col = mix3(col, wa.w.murky ? C('#3a3624') : C('#4b3d2a'), smooth(0.02, 0.4, wa.raw) * 0.9);
      if (wa.land > 0) col = mix3(col, mix3(C('#5a4a30'), C('#4a5230'), grassy), wa.land * wa.raw * 0.8);
    }
    const cs = this.craterAt(x, p)[1];
    col = mix3(col, mix3(C('#4a3b2b'), C('#2e271f'), cs), cs * 0.75);
    const tr = this.trenchDepth(x, p);
    col = mix3(col, C('#4a3a27'), smooth(0.05, 0.6, tr));
    // contact shadow around props and along the fortress wall
    let ao = 1;
    for (const o of this.occ) {
      if (Math.abs(o.p - p) > 7) continue;
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
    ao *= 1 - this.wet * 0.2;                                // rain-soaked ground reads darker
    return col.map(v => v * ao);
  }

  buildMesh(pMin, pMax) {
    // rows: 0.6 m spacing, tighter near trench lines, water edges and cliffs
    const rows = [];
    const dense = [];
    for (const t of this.trenches) dense.push([t.p - 1.6, t.p + 1.6]);
    for (const w of this.waters) if (w.t === 'band') dense.push([w.p0 - 2.5, w.p0 + 2.5], [w.p1 - 2.5, w.p1 + 2.5]);
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
        const x = cols[c]; const h = this.height(x, p);
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
// tiling never lines up, plus a detail normal map for grazing light
export function groundMaterial(detail, wet = 0) {
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true, map: detail.map, normalMap: detail.normal,
    normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.96 - wet * 0.36, metalness: 0,
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
  m.customProgramCacheKey = () => 'ground';
  return m;
}

export function waterMaterial(normalTex, color = '#3a6356') {
  const n = normalTex.clone(); n.needsUpdate = true;
  n.wrapS = n.wrapT = THREE.RepeatWrapping;
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color), roughness: 0.06, metalness: 0.0, transparent: true, opacity: 0.84,
    normalMap: n, normalScale: new THREE.Vector2(0.45, 0.45), envMapIntensity: 1.6,
  });
  m.userData.tick = (t) => { n.offset.set(t * 0.012, -t * 0.03); };
  return m;
}

// The living cave: things that answer the digger. Presentation only (Math.random for effects; the sim never sees it).
//  - growth: grass, fungus, reeds, kelp, anemones, roots, vines, moss and glow-worm threads that bend away as the
//    digger pushes through them, spring back with a wobble, sway in the cave's draught and shiver after a blast;
//  - glow: fungus caps, anemones and glow-worm beads brighten as you pass and fade behind you, and a heavy landing
//    or a blast sends a wave of light rippling out through them; crystals light from within in the lamp beam;
//  - breakables: crystal clusters, icicles, salt straws and clay pots that shatter under the pick, in a blast,
//    against the helmet or when you run into them;
//  - kickables: pebbles, chips, shells, tin cans and live coals that the boots send skittering and rolling;
//  - walls: glowing lichen that lights up as you pass and mineral flecks that flash in the lamp beam;
//  - moths drawn to the lamp, ripples where you wade, and grit trickling from the roof after a big landing.
// Fixed light rig untouched. One shader program serves all growth, breakables and kickables (matte and glossy
// differ only in uniforms).
import * as THREE from '../vendor/three.module.min.js';
import { T, SOLID } from './config.js?v=19';

function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ------------------------------------------------------------------ the shared material (bend + glow)
const U = { uT: { value: 0 }, uDraft: { value: 1 } };
function patch(m) {
  m.onBeforeCompile = (s) => {
    s.uniforms.uT = U.uT; s.uniforms.uDraft = U.uDraft;
    s.vertexShader = s.vertexShader.replace('#include <common>', `#include <common>
attribute vec4 aSway; attribute float aEm; uniform float uT; uniform float uDraft; varying float vEm;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        // aSway: xz = bend of the free end (instance-local units), z = glow, w = +1 standing / -1 hanging / 0 rigid
        float tt = clamp(position.y * aSway.w, 0.0, 1.0), k = tt * tt;
        vec3 ip = vec3(0.0);
        #ifdef USE_INSTANCING
          ip = instanceMatrix[3].xyz;
        #endif
        float ph = ip.x * 1.7 + ip.y * 0.9 + ip.z * 2.3;
        vec2 dr = vec2(sin(uT * 0.9 + ph) + 0.5 * sin(uT * 2.3 + ph * 1.7), cos(uT * 0.7 + ph * 1.3)) * 0.04 * uDraft * abs(aSway.w);
        vec2 off = aSway.xy + dr;
        transformed.xz += off * k;
        transformed.y -= aSway.w * 0.5 * dot(off, off) * k;
        vEm = aEm * aSway.z;
      }`);
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
varying float vEm;`).replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      totalEmissiveRadiance += diffuseColor.rgb * vEm;`);
  };
  m.customProgramCacheKey = () => 'gd-living-1';
  return m;
}
let MATS = null;
function mats() {
  if (MATS) return MATS;
  MATS = {
    matte: patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0, side: THREE.DoubleSide })),
    gloss: patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.16, metalness: 0.05, side: THREE.DoubleSide })),
  };
  return MATS;
}

// ------------------------------------------------------------------ geometry kit (vertex colours + glow mask)
const gb = () => ({ p: [], n: [], c: [], e: [], i: [] });
function vtx(g, x, y, z, nx, ny, nz, c, e) { g.p.push(x, y, z); g.n.push(nx, ny, nz); g.c.push(c[0], c[1], c[2]); g.e.push(e); return g.p.length / 3 - 1; }
function finish(g) {
  const G = new THREE.BufferGeometry();
  G.setAttribute('position', new THREE.Float32BufferAttribute(g.p, 3));
  G.setAttribute('normal', new THREE.Float32BufferAttribute(g.n, 3));
  G.setAttribute('color', new THREE.Float32BufferAttribute(g.c, 3));
  G.setAttribute('aEm', new THREE.Float32BufferAttribute(g.e, 1));
  G.setIndex(g.i);
  G.computeBoundingSphere();
  return G;
}
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _n = new THREE.Vector3(), _up = new THREE.Vector3(), _B = new THREE.Vector3(), _T = new THREE.Vector3();
// a tube along a path, radius / colour / glow as functions of t (0..1 along it)
function tube(g, pts, radAt, colAt, emAt, seg = 5) {
  const base = g.p.length / 3, n = pts.length;
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)];
    _T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    _up.set(0, 0, 1); if (Math.abs(_T.z) > 0.9) _up.set(1, 0, 0);
    _n.crossVectors(_T, _up).normalize(); _B.crossVectors(_T, _n);
    const t = k / (n - 1), r = radAt(t), c = colAt(t), e = emAt(t);
    for (let s = 0; s < seg; s++) {
      const an = s / seg * Math.PI * 2, cx = Math.cos(an), sx = Math.sin(an);
      const nx = _n.x * cx + _B.x * sx, ny = _n.y * cx + _B.y * sx, nz = _n.z * cx + _B.z * sx;
      vtx(g, pts[k][0] + nx * r, pts[k][1] + ny * r, pts[k][2] + nz * r, nx, ny, nz, c, e);
    }
  }
  for (let k = 0; k < n - 1; k++) for (let s = 0; s < seg; s++) {
    const a = base + k * seg + s, b = base + k * seg + (s + 1) % seg, c = a + seg, d = b + seg;
    g.i.push(a, b, c, b, d, c);
  }
}
// a flat ribbon along a path, across the direction W (vector per point), width / colour / glow by t
function ribbon(g, pts, Ws, widAt, colAt, emAt) {
  const base = g.p.length / 3, n = pts.length;
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)];
    _T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    const W = Ws[k], t = k / (n - 1), w = widAt(t) / 2, c = colAt(t), e = emAt(t);
    _a.set(W[0], W[1], W[2]); _n.crossVectors(_a, _T).normalize();
    vtx(g, pts[k][0] - W[0] * w, pts[k][1] - W[1] * w, pts[k][2] - W[2] * w, _n.x, _n.y, _n.z, c, e);
    vtx(g, pts[k][0] + W[0] * w, pts[k][1] + W[1] * w, pts[k][2] + W[2] * w, _n.x, _n.y, _n.z, c, e);
  }
  for (let k = 0; k < n - 1; k++) { const L = base + k * 2, R = L + 1, L1 = L + 2, R1 = L + 3; g.i.push(L, R, L1, R, R1, L1); }
}
// append a three.js geometry, transformed; colour / glow per vertex from a function of its local position
const _m3 = new THREE.Matrix3();
function addGeo(g, geom, m, colFn, emFn) {
  const base = g.p.length / 3, P = geom.attributes.position, N = geom.attributes.normal;
  _m3.getNormalMatrix(m);
  for (let k = 0; k < P.count; k++) {
    _a.fromBufferAttribute(P, k); const lx = _a.x, ly = _a.y, lz = _a.z; _a.applyMatrix4(m);
    _b.fromBufferAttribute(N, k).applyMatrix3(_m3).normalize();
    vtx(g, _a.x, _a.y, _a.z, _b.x, _b.y, _b.z, colFn(lx, ly, lz, _a), emFn(lx, ly, lz, _a));
  }
  if (geom.index) for (let k = 0; k < geom.index.count; k++) g.i.push(base + geom.index.getX(k));
  else for (let k = 0; k < P.count; k++) g.i.push(base + k);
  geom.dispose();
}
const facet = (geom) => { const q = geom.toNonIndexed(); geom.dispose(); q.computeVertexNormals(); return q; };
const jitter = (geom, R, amt, sy = 1) => { const p = geom.attributes.position; for (let i = 0; i < p.count; i++) { const k = 1 + (R() - 0.5) * amt; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * sy, p.getZ(i) * k); } geom.computeVertexNormals(); return geom; };
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const M4 = new THREE.Matrix4(), Q4 = new THREE.Quaternion(), E4 = new THREE.Euler(), V4 = new THREE.Vector3(), S4 = new THREE.Vector3();
const mtx = (x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => M4.compose(V4.set(x, y, z), Q4.setFromEuler(E4.set(rx, ry, rz)), S4.set(sx, sy, sz)).clone();

// every shape is built once, normalised: standing ones rise from y = 0 to 1, hanging ones drop from 0 to -1
const BUILD = {
  roots(R) {
    const g = gb();
    for (let s = 0; s < 3; s++) {
      const len = [1, 0.72, 0.5][s], x0 = (R() - 0.5) * 0.12, z0 = (R() - 0.5) * 0.1, ph = R() * 6, pts = [];
      for (let k = 0; k <= 9; k++) { const t = k / 9; pts.push([x0 + Math.sin(t * 5 + ph) * 0.05 * t, -t * len, z0 + Math.cos(t * 4 + ph) * 0.04 * t]); }
      tube(g, pts, (t) => 0.032 * (1 - t * 0.8) * (1 - s * 0.2), (t) => mix3([0.7, 0.6, 0.5], [1, 0.92, 0.82], t), () => 0, 5);
      for (let r = 0; r < 2; r++) {   // rootlets
        const k0 = 3 + Math.floor(R() * 5), p0 = pts[k0], sd = R() < 0.5 ? -1 : 1, lp = [];
        for (let k = 0; k <= 4; k++) { const t = k / 4; lp.push([p0[0] + sd * t * 0.14, p0[1] - t * 0.16 - t * t * 0.1, p0[2] + (R() - 0.5) * 0.04]); }
        tube(g, lp, (t) => 0.01 * (1 - t * 0.8), () => [0.95, 0.85, 0.72], () => 0, 4);
      }
    }
    return finish(g);
  },
  beads(R) {   // glow-worm threads: silk with sticky glowing droplets
    const g = gb();
    for (let s = 0; s < 7; s++) {
      const len = 0.35 + R() * 0.65, x0 = (R() - 0.5) * 0.3, z0 = (R() - 0.5) * 0.2;
      tube(g, [[x0, 0, z0], [x0, -len * 0.5, z0], [x0, -len, z0]], () => 0.004, () => [0.55, 0.6, 0.6], () => 0.15, 3);
      for (let y = 0.06 + R() * 0.05; y < len; y += 0.07 + R() * 0.06) {
        const r = 0.011 + R() * 0.008;
        addGeo(g, new THREE.IcosahedronGeometry(r, 0), mtx(x0, -y, z0, 0, 0, 0, 1, 1.25, 1), () => [1, 1, 1], () => 1);
      }
    }
    return finish(g);
  },
  vine(R) {
    const g = gb();
    for (let s = 0; s < 2; s++) {
      const len = s ? 0.7 : 1, x0 = s ? 0.07 : -0.03, ph = R() * 6, pts = [];
      for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([x0 + Math.sin(t * 6 + ph) * 0.04, -t * len, Math.cos(t * 5 + ph) * 0.03]); }
      tube(g, pts, (t) => 0.012 * (1 - t * 0.6), () => [0.6, 0.75, 0.5], () => 0, 4);
      for (let k = 1; k < 10; k++) {
        const p = pts[k], sd = k % 2 ? 1 : -1, L = 0.07 + R() * 0.04, a = [p[0], p[1], p[2]], b = [p[0] + sd * L * 0.7, p[1] - L * 0.35, p[2] + 0.01], c = [p[0] + sd * L, p[1] - L * 0.8, p[2] + 0.02];
        ribbon(g, [a, b, c], [[0, 0.3, 1], [0, 0.3, 1], [0, 0.3, 1]].map((w) => [sd * 0.5, 0.85, 0.2]), (t) => Math.sin(t * Math.PI) * 0.06 + 0.004, () => [0.85, 1, 0.7], () => 0);
      }
    }
    return finish(g);
  },
  beard(R) {   // hanging moss
    const g = gb();
    for (let s = 0; s < 12; s++) {
      const len = 0.3 + R() * 0.7, x0 = (R() - 0.5) * 0.25, z0 = (R() - 0.5) * 0.15, ph = R() * 6, pts = [], W = [];
      for (let k = 0; k <= 6; k++) { const t = k / 6; pts.push([x0 + Math.sin(t * 4 + ph) * 0.03, -t * len, z0]); W.push([1, 0, 0.3]); }
      ribbon(g, pts, W, (t) => 0.026 * (1 - t * 0.7), (t) => mix3([0.6, 0.62, 0.55], [1, 1, 0.92], t), () => 0);
    }
    return finish(g);
  },
  kelpH(R) {
    const g = gb();
    for (let s = 0; s < 5; s++) {
      const len = 0.45 + R() * 0.55, x0 = (R() - 0.5) * 0.25, ph = R() * 6, pts = [], W = [];
      for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([x0 + Math.sin(t * 7 + ph) * 0.05, -t * len, (R() - 0.5) * 0.02]); W.push([1, 0, Math.sin(t * 5 + ph) * 0.5]); }
      ribbon(g, pts, W, (t) => 0.06 * Math.sin(Math.min(1, t * 1.4 + 0.15) * Math.PI * 0.95) + 0.008, (t) => mix3([0.6, 0.65, 0.55], [1, 0.95, 0.8], t), () => 0);
    }
    return finish(g);
  },
  icicle(R) {
    const g = gb();
    for (let s = 0; s < 3; s++) {
      const L = [1, 0.55, 0.4][s], r = [0.12, 0.07, 0.06][s], x = [0, 0.13, -0.11][s];
      const c = new THREE.ConeGeometry(r, L, 8, 3);
      jitter(c, R, 0.18);
      addGeo(g, c, mtx(x, -L / 2, (R() - 0.5) * 0.06, Math.PI, 0, 0), (lx, ly) => mix3([0.75, 0.82, 0.9], [1, 1, 1], 0.5 - ly / L), (lx, ly) => 0.12 + (0.5 - ly / L) * 0.2);
    }
    return finish(g);
  },
  straw(R) {   // salt straws: thin hollow soda straws
    const g = gb();
    for (let s = 0; s < 5; s++) {
      const L = 0.4 + R() * 0.6, x = (R() - 0.5) * 0.3, z = (R() - 0.5) * 0.12;
      addGeo(g, new THREE.CylinderGeometry(0.022, 0.018, L, 6, 2), mtx(x, -L / 2, z), (lx, ly) => mix3([0.8, 0.78, 0.72], [1, 1, 1], 0.5 - ly / L), () => 0.04);
      addGeo(g, new THREE.SphereGeometry(0.02, 6, 4), mtx(x, -L - 0.005, z, 0, 0, 0, 1, 1.4, 1), () => [0.9, 0.95, 1], () => 0.3);
    }
    return finish(g);
  },
  tuft(R) {   // grass blades curving out from a clump
    const g = gb();
    for (let s = 0; s < 12; s++) {
      const len = 0.5 + R() * 0.5, a = R() * 6.28, bx = Math.cos(a) * R() * 0.07, bz = Math.sin(a) * R() * 0.05, lean = 0.15 + R() * 0.35;
      const dx = Math.cos(a), dz = Math.sin(a), pts = [], W = [];
      for (let k = 0; k <= 4; k++) { const t = k / 4; pts.push([bx + dx * lean * t * t, t * len, bz + dz * lean * t * t * 0.7]); W.push([-dz * 0.6 + 0.4, 0, dx * 0.6 + 0.2]); }
      ribbon(g, pts, W.map((w) => { const l = Math.hypot(w[0], w[2]) || 1; return [w[0] / l, 0, w[2] / l]; }), (t) => 0.032 * (1 - t * 0.92), (t) => mix3([0.45, 0.45, 0.4], [1.05, 1.05, 0.9], t), () => 0);
    }
    return finish(g);
  },
  caps(R) {   // a little family of fungi; the gills and cap glow
    const g = gb();
    const fam = [[0, 0, 1, 0.16], [0.17, 0.06, 0.62, 0.11], [-0.14, -0.05, 0.42, 0.09], [0.07, -0.1, 0.28, 0.07]];
    for (const [x, z, h, r] of fam) {
      const lean = (R() - 0.5) * 0.08, pts = [];
      for (let k = 0; k <= 4; k++) { const t = k / 4; pts.push([x + lean * t * t, t * (h - r * 0.3), z]); }
      tube(g, pts, (t) => r * 0.22 * (1.15 - t * 0.3), () => [0.85, 0.82, 0.78], (t) => 0.1 * t, 6);
      const top = [x + lean, h - r * 0.32, z];
      addGeo(g, new THREE.SphereGeometry(r, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mtx(top[0], top[1], top[2], 0, 0, 0, 1, 0.58, 1), (lx, ly) => mix3([0.75, 0.75, 0.75], [1, 1, 1], ly / r), (lx, ly) => 0.35 + 0.25 * (ly / r));
      addGeo(g, new THREE.CircleGeometry(r * 0.96, 12), mtx(top[0], top[1] + 0.002, top[2], Math.PI / 2, 0, 0), () => [1, 1, 1], () => 1);
      for (let d = 0; d < 5; d++) {   // spots
        const a = R() * 6.28, rr = R() * r * 0.7;
        addGeo(g, new THREE.IcosahedronGeometry(r * 0.12, 0), mtx(top[0] + Math.cos(a) * rr, top[1] + r * 0.58 * Math.sqrt(1 - (rr / r) ** 2) + 0.002, top[2] + Math.sin(a) * rr, 0, 0, 0, 1, 0.35, 1), () => [1.3, 1.3, 1.3], () => 0.9);
      }
    }
    return finish(g);
  },
  reeds(R) {
    const g = gb();
    for (let s = 0; s < 6; s++) {
      const h = 0.6 + R() * 0.4, x = (R() - 0.5) * 0.18, z = (R() - 0.5) * 0.12, lean = (R() - 0.5) * 0.12, pts = [];
      for (let k = 0; k <= 6; k++) { const t = k / 6; pts.push([x + lean * t * t, t * h, z]); }
      tube(g, pts, (t) => 0.009 * (1 - t * 0.5), (t) => mix3([0.55, 0.55, 0.45], [1, 1, 0.85], t), () => 0, 4);
      addGeo(g, new THREE.CylinderGeometry(0.02, 0.016, 0.12, 6), mtx(x + lean, h + 0.04, z), () => [0.7, 0.55, 0.4], () => 0);
    }
    return finish(g);
  },
  kelpS(R) {
    const g = gb();
    for (let s = 0; s < 4; s++) {
      const h = 0.6 + R() * 0.4, x0 = (R() - 0.5) * 0.25, ph = R() * 6, pts = [], W = [];
      for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([x0 + Math.sin(t * 6 + ph) * 0.06 * t, t * h, (R() - 0.5) * 0.02]); W.push([1, 0, Math.sin(t * 4 + ph) * 0.6]); }
      ribbon(g, pts, W.map((w) => { const l = Math.hypot(w[0], w[2]); return [w[0] / l, 0, w[2] / l]; }), (t) => 0.09 * (0.5 + 0.5 * Math.sin(Math.min(1, t * 1.1 + 0.1) * Math.PI)) + 0.01, (t) => mix3([0.5, 0.55, 0.45], [1, 1, 0.8], t), () => 0);
      for (let b = 1; b < 4; b++) {   // gas bladders
        const p = pts[b * 3];
        addGeo(g, new THREE.SphereGeometry(0.022, 6, 4), mtx(p[0], p[1], p[2] + 0.01), () => [1.1, 1.05, 0.7], () => 0.05);
      }
    }
    return finish(g);
  },
  anemone(R) {   // a squat body and a crown of tentacles with glowing tips
    const g = gb();
    addGeo(g, new THREE.CylinderGeometry(0.22, 0.3, 0.32, 12, 2), mtx(0, 0.16, 0), (lx, ly) => mix3([0.5, 0.5, 0.5], [0.85, 0.85, 0.85], ly / 0.32 + 0.5), () => 0.05);
    for (let s = 0; s < 18; s++) {
      const a = s / 18 * 6.28 + R() * 0.2, ring = s % 2 ? 0.17 : 0.1, out = 0.25 + R() * 0.35, h = 0.55 + R() * 0.45, pts = [];
      for (let k = 0; k <= 5; k++) { const t = k / 5; const rr = ring + out * t; pts.push([Math.cos(a) * rr, 0.3 + t * (h - 0.3) - out * t * t * 0.3, Math.sin(a) * rr]); }
      tube(g, pts, (t) => 0.035 * (1 - t * 0.6), (t) => mix3([0.7, 0.7, 0.7], [1.15, 1.15, 1.15], t), (t) => Math.pow(t, 3) * 1.1, 4);
    }
    return finish(g);
  },
  crystal(R) {   // a cluster of six-sided points
    const g = gb();
    const n = 4 + Math.floor(R() * 3);
    for (let s = 0; s < n; s++) {
      const main = s === 0, h = main ? 1 : 0.35 + R() * 0.45, r = (main ? 0.13 : 0.06 + R() * 0.05), tip = r * 1.6;
      const tz = main ? (R() - 0.5) * 0.2 : (R() - 0.5) * 1.1, tx = main ? (R() - 0.5) * 0.2 : (R() - 0.5) * 1.1, ox = main ? 0 : (R() - 0.5) * 0.3, oz = main ? 0 : (R() - 0.5) * 0.18;
      const body = facet(new THREE.CylinderGeometry(r, r * 1.08, h - tip, 6, 1));
      const m = mtx(ox, 0, oz, tx, R() * 6, tz);
      const cb = (lx, ly) => mix3([0.55, 0.55, 0.6], [1, 1, 1], (ly + (h - tip) / 2) / h), eb = (lx, ly) => 0.06 + 0.25 * Math.max(0, (ly + (h - tip) / 2) / h);
      addGeo(g, body, m.clone().multiply(mtx(0, (h - tip) / 2, 0)), cb, eb);
      const cone = facet(new THREE.ConeGeometry(r, tip, 6, 1));
      addGeo(g, cone, m.clone().multiply(mtx(0, h - tip / 2, 0)), () => [1.1, 1.1, 1.15], () => 0.4);
    }
    return finish(g);
  },
  pot(R) {   // an old clay jar with a painted band
    const g = gb();
    const prof = [[0, 0], [0.3, 0], [0.42, 0.12], [0.5, 0.35], [0.46, 0.6], [0.3, 0.8], [0.24, 0.9], [0.3, 0.98], [0.27, 1]].map(([x, y]) => new THREE.Vector2(x, y));
    addGeo(g, new THREE.LatheGeometry(prof, 16), mtx(0, 0, 0), (lx, ly) => (ly > 0.42 && ly < 0.52) || (ly > 0.6 && ly < 0.64) ? [0.32, 0.22, 0.16] : mix3([0.7, 0.68, 0.66], [1, 1, 1], ly), () => 0);
    return finish(g);
  },
  // ---- wall patches (radius 1, facing +z)
  lichen(R) {   // a rosette of glowing lichen discs and specks
    const g = gb();
    for (let s = 0; s < 22; s++) {
      const a = R() * 6.28, rr = Math.pow(R(), 0.7) * 0.85, r = 0.05 + R() * 0.12 * (1 - rr * 0.6);
      addGeo(g, new THREE.CircleGeometry(r, 9), mtx(Math.cos(a) * rr, Math.sin(a) * rr, R() * 0.02), (lx, ly) => { const k = Math.hypot(lx, ly) / r; return mix3([1.1, 1.1, 1.1], [0.55, 0.6, 0.55], k); }, (lx, ly) => 1 - Math.hypot(lx, ly) / r * 0.55);
    }
    for (let s = 0; s < 40; s++) { const a = R() * 6.28, rr = R(); addGeo(g, new THREE.CircleGeometry(0.018 + R() * 0.02, 5), mtx(Math.cos(a) * rr, Math.sin(a) * rr, 0.01), () => [1.2, 1.2, 1.2], () => 1); }
    return finish(g);
  },
  mica(R) {   // glittering flakes of mineral in the rock face, tilted every which way to catch the lamp
    const g = gb();
    for (let s = 0; s < 46; s++) {
      const a = R() * 6.28, rr = Math.pow(R(), 0.6), r = 0.03 + R() * 0.045;
      addGeo(g, new THREE.CircleGeometry(r, 3 + Math.floor(R() * 3)), mtx(Math.cos(a) * rr, Math.sin(a) * rr, R() * 0.015, (R() - 0.5) * 1.1, (R() - 0.5) * 1.1, R() * 6), () => [1, 1, 1], () => 0.6 + R() * 0.4);
    }
    return finish(g);
  },
  // ---- kickables (radius 1, centred)
  pebble(R) { const g = gb(); addGeo(g, jitter(new THREE.IcosahedronGeometry(1, 1), R, 0.35, 0.7), mtx(0, 0, 0), () => [1, 1, 1], () => 0); return finish(g); },
  chip(R) { const g = gb(); addGeo(g, facet(jitter(new THREE.IcosahedronGeometry(1, 0), R, 0.7, 0.6)), mtx(0, 0, 0), () => [1, 1, 1], () => 0.04); return finish(g); },
  shell(R) {
    const g = gb();
    addGeo(g, new THREE.SphereGeometry(1, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), mtx(0, -0.15, 0, 0, 0, 0, 1, 0.45, 0.85), (lx, ly, lz) => { const a = Math.atan2(lz, lx); return Math.sin(a * 9) > 0.2 ? [0.78, 0.72, 0.68] : [1, 1, 1]; }, () => 0);
    return finish(g);
  },
  can(R) {
    const g = gb();
    addGeo(g, new THREE.CylinderGeometry(0.75, 0.75, 1.9, 12, 3, true), mtx(0, 0, 0, Math.PI / 2, 0, 0), (lx, ly) => Math.abs(ly) < 0.3 ? [0.75, 0.25, 0.15] : [0.55, 0.5, 0.45], () => 0);
    addGeo(g, new THREE.CircleGeometry(0.75, 12), mtx(0, 0, 0.95), () => [0.5, 0.48, 0.45], () => 0);
    addGeo(g, new THREE.CircleGeometry(0.75, 12), mtx(0, 0, -0.95, 0, Math.PI, 0), () => [0.5, 0.48, 0.45], () => 0);
    return finish(g);
  },
  coal(R) {
    const g = gb();
    const geo = jitter(new THREE.IcosahedronGeometry(1, 1), R, 0.4, 0.75), hot = new Map();
    const P = geo.attributes.position;
    for (let i = 0; i < P.count; i++) hot.set(i, R());
    let i = 0;
    addGeo(g, geo, mtx(0, 0, 0), () => { const h = hot.get(i) > 0.6; return h ? [1, 0.38, 0.08] : [0.07, 0.055, 0.05]; }, () => { const h = hot.get(i++) > 0.6; return h ? 1 : 0; });
    return finish(g);
  },
};
let PROTO = new Map();
const proto = (name) => { let p = PROTO.get(name); if (!p) { p = BUILD[name](rng(name.length * 977 + name.charCodeAt(0) * 31)); PROTO.set(name, p); } return p; };

// how each shape behaves: dir (+1 standing, -1 hanging, 0 rigid), hang (rigid but from the roof), height range,
// gloss, what breaks it, where it may grow (lane = in the digger's path), glow (base, gain), beam = lights in the lamp
const KIND = {
  roots: { dir: -1, h: [0.8, 2.0], lane: 1 }, beads: { dir: -1, h: [0.6, 1.8], lane: 1, glow: [0.55, 1.8] }, vine: { dir: -1, h: [0.8, 2.0], lane: 1 },
  beard: { dir: -1, h: [0.5, 1.4], lane: 1 }, kelpH: { dir: -1, h: [0.6, 1.5], lane: 1 },
  icicle: { dir: 0, hang: 1, h: [0.35, 1.0], gloss: 1, brk: 'ice', lane: 1, beam: 1, glow: [0.15, 0.8] }, straw: { dir: 0, hang: 1, h: [0.3, 0.75], gloss: 1, brk: 'ice', lane: 1, beam: 1, glow: [0.1, 0.6] },
  tuft: { dir: 1, h: [0.45, 0.95], lane: 0.6 }, caps: { dir: 1, h: [0.3, 0.7], lane: 0.5, glow: [0.12, 1.4] }, reeds: { dir: 1, h: [0.8, 1.6], lane: 0 },
  kelpS: { dir: 1, h: [0.8, 1.8], lane: 1, wet: 1 }, anemone: { dir: 1, h: [0.25, 0.45], lane: 0.38, wet: 1, glow: [0.25, 1.4] },
  crystal: { dir: 0, h: [0.35, 1.0], gloss: 1, brk: 'crystal', lane: 0, beam: 1, glow: [0.1, 1.3], tilt: 0.5 }, pot: { dir: 0, h: [0.45, 0.7], brk: 'pot', lane: 0.7 },
  lichen: { dir: 0, wall: 1, h: [0.35, 0.8], glow: [0.16, 2.2] }, mica: { dir: 0, wall: 1, h: [0.35, 0.8], gloss: 1, beam: 1, glow: [0.04, 2.6] },
};
const KICK = { pebble: { r: [0.05, 0.12] }, chip: { r: [0.04, 0.085], gloss: 1 }, shell: { r: [0.05, 0.085], gloss: 1 }, can: { r: [0.055, 0.06], roll: 1 }, coal: { r: [0.05, 0.09], glow: 1 } };

// what lives in each set: [shape, per-cell density, colours]; wall patches; draught
const LIVE = {
  workings: { hang: [['roots', 0.22, [0x5a4030, 0x6a4a34]]], stand: [['caps', 0.12, [0xe0d4bc, 0xd0c0a0]]], rigid: [['pot', 0.04, [0x8a5636, 0x6e5a48]]], kick: [['pebble', 0.45], ['can', 0.06, [0xffffff]]], wall: [['mica', 0.07, [0xffc860, 0xffe0a0]]] },
  rust: { hang: [['roots', 0.14, [0x4a2a1a]], ['beard', 0.14, [0x6a4a3a]]], stand: [['caps', 0.16, [0xff9a50, 0xe07a40]]], rigid: [], kick: [['pebble', 0.45], ['can', 0.1, [0xffffff]]], wall: [['mica', 0.06, [0xff9a50, 0xffc070]]] },
  patina: { hang: [['beard', 0.25, [0x4a7a6a, 0x3a6a5a]], ['beads', 0.14, [0x60ffc0]]], stand: [['caps', 0.28, [0x60ffc0, 0x48d6b0]], ['tuft', 0.18, [0x3a6a58]]], rigid: [['crystal', 0.06, [0x2fbf8a, 0x48d6b0, 0x2f6fd0]]], kick: [['pebble', 0.35], ['chip', 0.1, [0x3fbf8a]]], wall: [['lichen', 0.07, [0x60ffc0, 0x48d6b0]], ['mica', 0.04, [0x60e0ff]]] },
  garden: { hang: [['beads', 0.55, [0x40fff0, 0x80ffd0]], ['vine', 0.3, [0x3a6a2a, 0x4a7a30]]], stand: [['tuft', 1.1, [0x3a6a30, 0x4a7a3a, 0x2f5a3a]], ['caps', 0.45, [0x40fff0, 0x70e0ff]], ['reeds', 0.2, [0x5a7a3a]]], rigid: [], kick: [['pebble', 0.3]], wall: [['lichen', 0.1, [0x40fff0, 0x80ffd0, 0x60ff90]]] },
  bluecap: { hang: [['beads', 0.6, [0x6a9cff, 0x9ab8ff]], ['beard', 0.25, [0x2a3a6a]]], stand: [['caps', 0.7, [0x6a9cff, 0x4a7aff, 0x9a8aff]], ['tuft', 0.6, [0x2a3a5a, 0x34446a]]], rigid: [], kick: [['pebble', 0.3]], wall: [['lichen', 0.12, [0x6a9cff, 0x9ab8ff, 0xb08aff]]] },
  roots: { hang: [['roots', 0.9, [0x6a4a30, 0x7a5a3a, 0x5a3e28]], ['vine', 0.2, [0x4a6a2a]]], stand: [['tuft', 0.7, [0x4a6a2a, 0x5a7a30]], ['reeds', 0.3, [0x6a7a3a]], ['caps', 0.25, [0xffb040, 0xffd070]]], rigid: [], kick: [['pebble', 0.35]], wall: [['lichen', 0.07, [0xffb040, 0xffd070]]] },
  amethyst: { hang: [], stand: [], rigid: [['crystal', 0.5, [0x9a5cff, 0xd9c8ff, 0xff7ad0, 0x7fd2ff]]], kick: [['pebble', 0.2], ['chip', 0.3, [0x9a5cff, 0xd9c8ff]]], wall: [['mica', 0.1, [0xd9c8ff, 0xff9ae0, 0x9fd8ff]]] },
  frost: { hang: [['icicle', 0.45, [0xcfeeff, 0xffffff]]], stand: [['tuft', 0.3, [0xdff4ff, 0xbfe0ff]]], rigid: [['crystal', 0.3, [0xcfeeff, 0xffffff, 0x9fd8ff]]], kick: [['chip', 0.35, [0xdff4ff]], ['pebble', 0.15]], wall: [['mica', 0.08, [0xdff4ff, 0xffffff]]] },
  rose: { hang: [['beads', 0.25, [0xff8fb0, 0xffb0d0]]], stand: [], rigid: [['crystal', 0.45, [0xff8fb0, 0xffc24a, 0xffd6e0]]], kick: [['chip', 0.3, [0xff8fb0, 0xffd6e0]], ['pebble', 0.2]], wall: [['mica', 0.08, [0xffc0d0, 0xffd890]], ['lichen', 0.03, [0xff8fb0]]] },
  streets: { hang: [['vine', 0.35, [0x3a4a2a, 0x4a5a30]], ['roots', 0.2, [0x4a3a2a]]], stand: [['tuft', 0.35, [0x6a6a40, 0x5a5a3a]], ['reeds', 0.12, [0x7a7a50]]], rigid: [['pot', 0.12, [0x9a5a3a, 0x8a6a4a, 0x6a4a3a]]], kick: [['pebble', 0.3], ['chip', 0.12, [0x9a5a3a]]], wall: [['lichen', 0.05, [0xb0ff90, 0x80e0a0]], ['mica', 0.03, [0xffd070]]] },
  salt: { hang: [['straw', 0.35, [0xf4efe4, 0xe8e0d0]]], stand: [], rigid: [['crystal', 0.15, [0xf8f4ec, 0xf0e8d8]], ['pot', 0.05, [0x8a6a4a]]], kick: [['chip', 0.35, [0xf4efe4]], ['pebble', 0.15]], wall: [['mica', 0.09, [0xffffff, 0xfff4e0]]] },
  tide: { hang: [['kelpH', 0.35, [0x2a4a3a, 0x3a5a2a]]], stand: [['kelpS', 0.5, [0x2a5a3a, 0x3a6a30, 0x4a5a2a]], ['anemone', 0.35, [0x40f0d0, 0xff70c0, 0xffa040]]], rigid: [], kick: [['shell', 0.3, [0xe8d8c0, 0xffc0a0, 0xd0c0b0]], ['pebble', 0.25]], wall: [['lichen', 0.09, [0x40f0d0, 0x60c0ff]]], draft: 2.2 },
  basalt: { hang: [], stand: [], rigid: [['crystal', 0.08, [0x3a1d2a, 0x2a1a1a]]], kick: [['coal', 0.3, [0xffffff]], ['pebble', 0.3]], wall: [['mica', 0.06, [0xff6a20, 0xffa040]]] },
  obsidian: { hang: [], stand: [], rigid: [['crystal', 0.35, [0x3a1d4a, 0x251530, 0x5a1a40]]], kick: [['chip', 0.35, [0x2a1a30, 0x1a1020]], ['pebble', 0.15]], wall: [['mica', 0.08, [0xc080ff, 0xff70c0]]] },
  sulfur: { hang: [], stand: [], rigid: [['crystal', 0.3, [0xffd23a, 0xe8b020]]], kick: [['chip', 0.25, [0xffd23a]], ['pebble', 0.25]], wall: [['mica', 0.07, [0xffe060, 0xd0ff60]]] },
};
// moths come to the lamp in the dry, still levels
const MOTHS = { workings: 3, rust: 3, patina: 2, garden: 2, bluecap: 2, roots: 4, streets: 3, salt: 2, frost: 1, amethyst: 2, rose: 2 };
const SETS = ['workings', 'garden', 'amethyst', 'streets', 'basalt'];

// ------------------------------------------------------------------ build a level's living things
export function buildLiving(M, look, W, K) {
  const { cave, q, fx, solidAt } = K;
  const dens = q.decor;
  const R = rng((M.seed * 73 + M.depth * 29 + M.level * 11 + 3) >>> 0);
  const set = look.set || SETS[M.biome % 5];
  const L = LIVE[set] || LIVE.workings;
  const group = new THREE.Group();
  const MT = mats();
  U.uDraft.value = L.draft || 1;
  const at = (x, y) => (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x];
  const solid = (x, y) => SOLID[at(x, y)] === 1;
  const keep = [[M.start.x, M.start.y]].concat(M.exit ? [[M.exit.x, M.exit.y]] : []).concat((M.camps || []).map((c) => [c.x, c.y]));
  const clear = (x, y, d) => !keep.some(([kx, ky]) => Math.abs(kx - x) < d && Math.abs(ky - y) < d);
  // where the rock really is: back wall / front lip (memoised), and the floor / roof height at a depth
  const memo = new Map();
  const surf = (x, y, back) => { const k = (Math.round(x * 2) * 4096 + Math.round(y * 2)) * 2 + (back ? 1 : 0); let v = memo.get(k); if (v === undefined) { v = cave.surfaceZ(Math.round(x * 2) / 2, Math.round(y * 2) / 2, back); memo.set(k, v); } return v; };
  const march = (x, y0, z, dir) => {   // dir -1: down to the floor, +1: up to the roof
    let a = y0 - dir * 0.6;
    if (cave.density(x, a, z) > 0) return y0;
    for (let k = 0; k < 24; k++) {
      const b = a + dir * 0.06;
      if (cave.density(x, b, z) > 0) { let lo = b, hi = a; for (let j = 0; j < 6; j++) { const m = (lo + hi) / 2; if (cave.density(x, m, z) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
      a = b;
    }
    return y0;
  };
  // the drawn floor under / roof over a footprint of radius r (exact, from the rock mesh; null where there is none)
  const floorY = (x, y0, z, r = 0) => cave.floorUnder ? cave.floorUnder(x, y0 + 0.5, z, r, r, 1.2) : march(x, y0, z, -1);
  const roofY = (x, y0, z, r = 0) => cave.roofOver ? cave.roofOver(x, y0 - 0.5, z, r, r, 1.3) : march(x, y0, z, 1);
  const pick = (a) => a[Math.floor(R() * a.length)];
  const colOf = (list) => { const c = new THREE.Color(pick(list)); const k = 0.82 + R() * 0.36; return c.multiplyScalar(k); };

  // candidate cells: open (air, or water for wet things) with something solid under / over it
  const floors = [], roofs = [], opens = [];
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) {
    const t = at(x, y);
    if (t !== T.AIR && t !== T.WATER) continue;
    opens.push([x, y]);
    if (solid(x, y - 1)) floors.push([x, y, t === T.WATER]);
    if (solid(x, y + 1)) { let H = 0; while (H < 6 && !solid(x, y - H)) H++; roofs.push([x, y, t === T.WATER, H]); }
  }

  // ---- growth, glow and breakables: one instanced mesh per shape
  const items = [], batches = [];
  const addBatch = (name, list) => {
    if (!list.length) return;
    const kd = KIND[name], P = proto(name), n = list.length;
    const geo = new THREE.BufferGeometry();
    for (const a of ['position', 'normal', 'color', 'aEm']) geo.setAttribute(a, P.attributes[a]);
    geo.setIndex(P.index);
    const sw = new Float32Array(n * 4), attr = new THREE.InstancedBufferAttribute(sw, 4); attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aSway', attr);
    const mesh = new THREE.InstancedMesh(geo, kd.gloss ? MT.gloss : MT.matte, n);
    mesh.receiveShadow = true; mesh.castShadow = kd.dir === 0;
    const b = { mesh, attr, sw, dirty: false, mdirty: false };
    list.forEach((it, i) => {
      it.b = b; it.i = i;
      mesh.setMatrixAt(i, mtx(it.x, it.y, it.z, it.rx, it.yaw, it.rz, it.s * it.w, it.s, it.s * it.w));
      mesh.setColorAt(i, it.col);
      sw[i * 4 + 2] = it.base; sw[i * 4 + 3] = kd.dir;
      items.push(it);
    });
    mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    group.add(mesh); batches.push(b);
  };
  const mk = (name, x, y, z, h, cols, anchor) => {
    const kd = KIND[name], gl = kd.glow;
    const it = { name, kd, x, y, z, h, s: h, w: 0.8 + R() * 0.45, yaw: R() * 6.28, rx: 0, rz: 0, col: colOf(cols), anchor,
      ox: 0, oz: 0, vx: 0, vz: 0, base: gl ? gl[0] * (0.7 + R() * 0.6) : 0, gain: gl ? gl[1] : 0, ex: 0, wake: 0, act: false, alive: true };
    if (kd.tilt) { it.rx = (R() - 0.5) * kd.tilt; it.rz = (R() - 0.5) * kd.tilt; }
    if (kd.wall) { it.yaw = 0; it.w = 1; it.rz = R() * 6.28; it.rx = (R() - 0.5) * 0.3; }
    it.mid = kd.wall ? y : kd.dir > 0 || (!kd.hang && kd.dir === 0) ? y + h * 0.5 : y - h * 0.5;
    return it;
  };
  // rows: lane (the digger's path), back (between the lane and the back wall) and front (towards the camera)
  const rowZ = (x, y, row, r) => {
    if (row === 'lane') return (R() - 0.45) * 0.6;
    if (row === 'back') { const w = surf(x, y + 0.5, true); const lo = Math.max(w + 0.25 + r, -1.7), hi = -0.38; return lo < hi ? lo + R() * (hi - lo) : null; }
    const f = surf(x, y + 0.5, false); const lo = 0.42, hi = Math.min(1.45, f - 0.3 - r); return lo < hi ? lo + R() * (hi - lo) : null;
  };
  const byName = new Map();
  const put = (name, it) => { let l = byName.get(name); if (!l) byName.set(name, l = []); l.push(it); };
  const nOf = (d, mul = 1.6) => { const v = d * dens * mul; let n = Math.floor(v); if (R() < v - n) n++; return n; };
  for (const [cx, cy, wet] of floors) {
    for (const [name, d, cols] of L.stand.concat(L.rigid)) {
      const kd = KIND[name];
      if (kd.hang) continue;
      if (wet && !kd.wet) continue;
      for (let k = nOf(d); k > 0; k--) {
        const x = cx + 0.08 + R() * 0.84;
        let row = R() < 0.62 ? 'back' : 'front';
        if (kd.lane && R() < 0.38 && clear(cx, cy, 2.5)) row = 'lane';
        if (name === 'pot' && !clear(cx, cy, 2.5)) continue;
        let h = kd.h[0] + R() * (kd.h[1] - kd.h[0]);
        if (row === 'lane') h = Math.min(h, kd.lane);
        if (row === 'front') h *= 0.75;
        const z = rowZ(x, cy, row, h * 0.3);
        if (z === null) continue;
        const g = floorY(x, cy, z, Math.min(0.2, h * 0.22));
        if (g === null) continue;
        const y = g - (kd.dir === 0 ? 0.04 : 0.025);
        if (y < cy - 0.45 || y > cy + 0.4) continue;
        put(name, mk(name, x, y, z, h, cols, [cx, cy - 1]));
        if (globalThis.__gdAudit) globalThis.__gdAudit.push(['floor', x, y, z, Math.min(0.2, h * 0.22), 'live:' + name]);
      }
    }
  }
  for (const [cx, cy, wet, H] of roofs) {
    for (const [name, d, cols] of L.hang.concat(L.rigid)) {
      const kd = KIND[name];
      if (kd.dir === 0 && !kd.hang) continue;
      for (let k = nOf(d); k > 0; k--) {
        const x = cx + 0.08 + R() * 0.84;
        const rr = R(); let row = rr < 0.45 ? 'back' : rr < 0.65 ? 'front' : 'lane';
        if (row === 'lane' && (!kd.lane || (kd.hang && H < 3))) row = 'back';
        let h = kd.h[0] + R() * (kd.h[1] - kd.h[0]);
        if (row === 'lane') h = Math.min(h, Math.max(0.2, H - (kd.hang ? 1.85 : 1.2)));
        const z = rowZ(x, cy, row, 0.15);
        if (z === null) continue;
        const top = roofY(x, cy + 1, z, 0.06);
        if (top === null || top < cy + 0.55 || top > cy + 1.5) continue;
        const sink = kd.hang ? 0.12 : 0.22;   // set into the roof so the rock's own relief never leaves a gap
        put(name, mk(name, x, top + sink, z, h + sink, cols, [cx, cy + 1]));
        if (globalThis.__gdAudit) globalThis.__gdAudit.push(['roof', x, top + sink, z, 0.06, 'live:' + name]);
      }
    }
  }
  // wall patches: on flat stretches of the back wall, facing the camera
  for (const [name, d, cols] of L.wall || []) {
    const kd = KIND[name];
    for (const [cx, cy] of opens) for (let k = nOf(d, 1); k > 0; k--) {
      const x = cx + R(), y = cy + R(), sc = kd.h[0] + R() * (kd.h[1] - kd.h[0]), e = sc * 0.7;
      const zs = [surf(x, y, true), surf(x - e, y, true), surf(x + e, y, true), surf(x, y - e, true), surf(x, y + e, true)];
      const zmax = Math.max(...zs), zmin = Math.min(...zs);
      if (zmax > -1.0 || zmin < -6.5 || zmax - zmin > 0.3) continue;
      put(name, mk(name, x, y, zmax + 0.04, sc, cols, null));
    }
  }
  for (const [name, list] of byName) addBatch(name, list);

  // ---- kickables: on the floor of the lane. The rock's drawn floor sits a little under the tile tops the sim walks
  // on (FO, measured here); kickables move in tile space and are drawn FO lower
  const fos = [];
  for (let i = 0; i < floors.length && fos.length < 40; i += 3) { const [cx, cy, wet] = floors[i]; if (!wet && solid(cx - 1, cy - 1) && solid(cx + 1, cy - 1)) { const g = floorY(cx + 0.5, cy, 0); if (g !== null) fos.push(g - cy); } }
  fos.sort((a, b) => a - b);
  const FO = fos.length ? fos[fos.length >> 1] : 0;
  const kicks = [], kbatches = [];
  for (const [name, d, cols] of L.kick) {
    const kk = KICK[name], list = [];
    for (const [cx, cy, wet] of floors) {
      if (wet || !clear(cx, cy, 2.2)) continue;
      for (let k = nOf(d, 2.6); k > 0; k--) {
        const x = cx + 0.1 + R() * 0.8, z = (R() - 0.5) * 0.62, r = kk.r[0] + R() * (kk.r[1] - kk.r[0]);
        const y = floorY(x, cy, z, r * 0.6);
        if (y === null || Math.abs(y - cy - FO) > 0.025) continue;
        list.push({ name, x, y: cy + r * 0.62, z, r, vx: 0, vy: 0, vz: 0, rest: true, q: kk.roll ? new THREE.Quaternion().setFromAxisAngle(_B.set(0, 0, 1), R() * 6.28) : new THREE.Quaternion().setFromEuler(E4.set(R() * 6, R() * 6, R() * 6)), col: cols ? colOf(cols) : colOf([look.rubble ? new THREE.Color().fromArray(look.rubble).getHex() : 0x8a8076]), cd: 0, alive: true, roll: kk.roll, glow: kk.glow });
      }
    }
    if (!list.length) continue;
    const P = proto(name), geo = new THREE.BufferGeometry();
    for (const a of ['position', 'normal', 'color', 'aEm']) geo.setAttribute(a, P.attributes[a]);
    geo.setIndex(P.index);
    const sw = new Float32Array(list.length * 4);
    if (kk.glow) for (let i = 0; i < list.length; i++) sw[i * 4 + 2] = 0.8 + Math.random() * 0.5;
    geo.setAttribute('aSway', new THREE.InstancedBufferAttribute(sw, 4));
    const mesh = new THREE.InstancedMesh(geo, kk.gloss ? MT.gloss : MT.matte, list.length);
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const b = { mesh, dirty: false, sw, attr: geo.attributes.aSway };
    list.forEach((k, i) => { k.b = b; k.i = i; mesh.setColorAt(i, k.col); mesh.setMatrixAt(i, M4.compose(V4.set(k.x, k.y + FO, k.z), k.q, S4.set(k.r, k.r, k.r))); kicks.push(k); });
    mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    group.add(mesh); kbatches.push(b);
  }

  // ---- shared effects
  const sfx = (n, o) => { if (K.sfx) K.sfx(n, o); };
  const hide = (b, i) => { b.mesh.setMatrixAt(i, M4.makeScale(0, 0, 0)); b.mesh.instanceMatrix.needsUpdate = true; };
  const shatter = (it, quiet) => {
    if (!it.alive) return;
    it.alive = false; hide(it.b, it.i);
    const c = it.col, x = it.x, y = it.mid, z = it.z;
    if (it.kd.brk === 'pot') {
      fx.debris(x, y, z, { n: 9, speed: 3, size: 0.09 * (it.h / 0.45), vy: 2 });
      fx.dust(x, y - 0.1, z, { n: 4, s0: 0.25, s1: 1.1, life: 1.8, a: 0.35, col: [c.r * 0.8 + 0.2, c.g * 0.7 + 0.2, c.b * 0.6 + 0.2] });
      if (!quiet) sfx('potbreak', { x, y, vol: 0.55 });
    } else {
      const g = [Math.min(1.6, c.r * 1.3 + 0.35), Math.min(1.6, c.g * 1.3 + 0.35), Math.min(1.6, c.b * 1.3 + 0.35)];
      for (let k = 0; k < 9; k++) fx.glint(x + (Math.random() - 0.5) * it.h * 0.8, y + (Math.random() - 0.5) * it.h, z + 0.15, 0.35 + Math.random() * 0.4, g);
      fx.sparks(x, y, z + 0.1, { n: 8, speed: 3, s: 0.07, grav: 7, r: g[0] * 0.8, g: g[1] * 0.8, b: g[2] * 0.8 });
      fx.debris(x, y, z, { n: 4, speed: 2.5, size: 0.06 });
      if (!quiet) sfx('tinkle', { x, y, vol: it.kd.brk === 'ice' ? 0.45 : 0.6, rate: it.kd.brk === 'ice' ? 1.15 : 1 });
    }
  };
  const drop = (it) => {   // its rock is gone: it falls away in a puff
    if (!it.alive) return;
    if (it.kd.brk) { shatter(it, true); return; }
    it.alive = false; hide(it.b, it.i);
    fx.dust(it.x, it.mid, it.z, { n: 2, s0: 0.2, s1: 0.8, life: 1.2, a: 0.3 });
  };
  const kickOne = (k, vx, vy, vz) => { k.vx = vx; k.vy = vy; k.vz = vz; k.rest = false; k.cd = 0.25; k.b.dirty = true; };
  const wave = (x, y, rad, t, speed = 7) => {   // a wave of light and a shiver spreading out
    for (const it of items) {
      if (!it.alive) continue;
      const dx = it.x - x, dy = it.mid - y, d = Math.hypot(dx, dy);
      if (d > rad) continue;
      if (it.gain) it.wake = t + d / speed;
      if (it.kd.dir) { const f = 5 * (1 - d / rad) / (0.6 + d); it.vx += (dx / (d || 1)) * f * it.h; it.vz += (Math.random() - 0.5) * f * it.h; it.act = true; }
    }
  };
  // the roof sheds grit after a heavy landing or a blast
  const trickles = [];
  const trickle = (x, y, n, dur) => {
    let cy = Math.floor(y) + 1, k = 0;
    while (k < 9 && !solidAt(x, cy + 0.5)) { cy++; k++; }
    if (k >= 9) return;
    trickles.push({ x, top: cy - 0.04, floor: y, n, t: dur, dur });
  };
  const rub = look.rubble || [0.5, 0.45, 0.4];

  // moths: lit dust motes that keep to the lamp beam (pool slots are reused, so a moth is only ours while its max is)
  const MOTH = 999999.5, moths = [];
  const nMoth = Math.round((MOTHS[set] || 0) * Math.min(1, dens + 0.2));
  // ------------------------------------------------------------------ every frame
  let time = 0, rustleT = 0, rippleT = 0;
  const lampDir = new THREE.Vector3();
  const update = (t, dt, P, Wd, lamp) => {
    time = t; U.uT.value = t;
    if (!P) return;
    dt = Math.min(dt, 0.05);
    const climb = P.state === 'climb';
    const moving = Math.abs(P.vx);
    // lamp cone for crystals
    let lx = 0, ly = 0, lz = 0, lit = false;
    if (lamp && lamp.intensity > 1) { lx = lamp.position.x; ly = lamp.position.y; lz = lamp.position.z; lampDir.copy(lamp.target.position).sub(lamp.position).normalize(); lit = true; }
    let contact = 0;
    for (const it of items) {
      if (!it.alive) continue;
      const dx = it.x - P.x;
      const near = dx < 7 && dx > -7;
      if (!near && !it.act && !it.wake) continue;
      const kd = it.kd;
      let wrote = false;
      // bending things: pushed by the body, springing back
      if (kd.dir) {
        let tx = 0, tz = 0;
        if (near && !P.dead && !climb) {
          const top = kd.dir > 0 ? it.y + it.h : it.y, bot = kd.dir > 0 ? it.y : it.y - it.h;
          const az = Math.abs(it.z);
          if (bot < P.y + 1.75 && top > P.y + 0.04 && az < 1.0) {
            const r = 0.36 + it.h * 0.1, adx = Math.abs(dx);
            if (adx < r) {
              const k = (1 - adx / r) * (az < 0.42 ? 1 : 1 - (az - 0.42) / 0.58);
              const sx = dx >= 0 ? 1 : -1;
              tx = (sx * 0.75 + P.vx * 0.05) * k * it.h; tz = (it.z >= 0 ? 0.35 : -0.35) * k * it.h;
              contact += k * Math.min(1, moving / 3);
              it.act = true;
              if (it.gain && moving > 1.6 && Math.random() < dt * 4 * k) {   // glowing spores shaken loose
                const c = it.col;
                fx.glintP.add({ x: it.x + (Math.random() - 0.5) * 0.2, y: it.y + (kd.dir > 0 ? it.h * 0.85 : -it.h * 0.6), z: it.z, vx: (Math.random() - 0.5) * 0.5, vy: 0.2 + Math.random() * 0.35, vz: (Math.random() - 0.5) * 0.3,
                  s0: 0.07, s1: 0.02, max: 2.2 + Math.random() * 1.5, a: 0.9, r: c.r * 1.4 + 0.2, g: c.g * 1.4 + 0.2, b: c.b * 1.4 + 0.2, drag: 0.9, grav: -0.04, fade: 0.6 });
              }
            }
          }
        }
        if (it.act) {
          it.vx += (-(it.ox - tx) * 55 - it.vx * 5) * dt; it.vz += (-(it.oz - tz) * 55 - it.vz * 5) * dt;
          it.ox += it.vx * dt; it.oz += it.vz * dt;
          const lim = it.h * 0.9, l = Math.hypot(it.ox, it.oz);
          if (l > lim) { it.ox *= lim / l; it.oz *= lim / l; }
          if (!tx && Math.abs(it.ox) + Math.abs(it.oz) + Math.abs(it.vx) + Math.abs(it.vz) < 0.002) { it.ox = it.oz = it.vx = it.vz = 0; it.act = false; }
          wrote = true;
        }
      }
      // glow: wakes as you pass, a wave from landings and blasts, the lamp for crystals and ice
      if (it.gain) {
        const prev = it.ex;
        if (it.wake && t >= it.wake) { it.ex = Math.max(it.ex, 1.25); it.wake = 0; }
        if (kd.beam) {
          let want = 0;
          if (lit && near) {
            const vx = it.x - lx, vy = it.mid - ly, vz = it.z - lz, d = Math.hypot(vx, vy, vz) || 1;
            const cs = (vx * lampDir.x + vy * lampDir.y + vz * lampDir.z) / d;
            if (cs > 0.8 && d < 13) want = (cs - 0.8) / 0.2 * (1 - d / 13) * 1.4;
            if (want > 0.15 && Math.random() < dt * (kd.wall ? 1.1 : 1.6) * want) {
              const c = it.col;
              fx.glint(it.x + (Math.random() - 0.5) * it.h * (kd.wall ? 1.4 : 0.6), it.mid + (kd.wall ? (Math.random() - 0.5) * it.h * 1.4 : it.h * (kd.hang ? -0.3 : 0.35) * Math.random()), it.z + 0.12, (kd.wall ? 0.14 : 0.22) + Math.random() * (kd.wall ? 0.16 : 0.25), [c.r * 1.2 + 0.5, c.g * 1.2 + 0.5, c.b * 1.2 + 0.5]);
            }
          }
          it.ex += (want - it.ex) * Math.min(1, dt * (want > it.ex ? 5 : 1.2));
        } else if (near && Math.abs(it.mid - (P.y + 0.9)) < 2.6 && Math.abs(dx) < 2.3 && !P.dead) it.ex = Math.min(1, it.ex + dt * 2.6);
        else it.ex = Math.max(0, it.ex - dt * 0.24);
        if (it.ex > 1 && !kd.beam) it.ex = Math.max(1, it.ex - dt * 0.6);
        if (it.ex !== prev) wrote = true;
        if (it.ex > 0.003) it.act = true; else if (!kd.dir) it.act = false;
      }
      // breakables in the digger's way: pots run into, icicles and straws against the helmet
      if (kd.brk && near && !P.dead && Math.abs(dx) < 0.32 + it.h * 0.25 && Math.abs(it.z) < 0.5) {
        if (kd.brk === 'pot' && it.y < P.y + 1.6 && it.y + it.h > P.y && (moving > 1.2 || P.vy < -3)) shatter(it);
        else if (kd.hang && it.y - it.h < P.y + 1.85 && it.y > P.y + 0.5) shatter(it);
      }
      if (wrote && it.alive) {
        const o = it.i * 4, sw = it.b.sw, c = Math.cos(it.yaw), s = Math.sin(it.yaw), hs = it.s * it.w;
        sw[o] = (c * it.ox - s * it.oz) / hs; sw[o + 1] = (s * it.ox + c * it.oz) / hs; sw[o + 2] = it.base + it.ex * it.gain;
        it.b.dirty = true;
      }
    }
    for (const b of batches) if (b.dirty) { b.attr.needsUpdate = true; b.dirty = false; }
    if (contact > 0.25 && moving > 1 && t > rustleT) { rustleT = t + 0.3; sfx('rustle', { x: P.x, y: P.y + 0.8, vol: Math.min(0.5, 0.12 + contact * 0.12), gap: 0.25 }); }

    // kickables
    for (const k of kicks) {
      if (!k.alive) continue;
      const dx = k.x - P.x;
      if (k.rest && (dx > 2.5 || dx < -2.5)) continue;
      k.cd -= dt;
      if (!P.dead && !climb && k.cd <= 0 && Math.abs(k.z) < 0.48 && Math.abs(dx) < 0.26 + k.r && k.y > P.y - 0.25 && k.y < P.y + 0.55 && moving > 0.6 && (Math.sign(P.vx) === Math.sign(dx) || Math.abs(dx) < 0.08)) {
        kickOne(k, P.vx * (1.1 + Math.random() * 0.6), 0.8 + Math.random() * 1.6 + moving * 0.25, (Math.random() - 0.5) * 1.4);
        sfx('pebble', { x: k.x, y: k.y, vol: Math.min(0.55, 0.18 + moving * 0.06), rate: 1.25 - k.r * 2, gap: 0.06 });
      }
      if (k.rest) continue;
      k.vy -= 16 * dt;
      const wet = at(Math.floor(k.x), Math.floor(k.y)) === T.WATER;
      if (wet) { const d = Math.exp(-dt * 4); k.vx *= d; k.vy = k.vy * d + 9 * dt; k.vz *= d; if (!k.wet) { k.wet = true; fx.bubbles(k.x, k.y, k.z, 3); } }
      const nx = k.x + k.vx * dt;
      if (solidAt(nx + Math.sign(k.vx) * k.r, k.y) && Math.abs(k.z) < 1.6) { k.vx *= -0.45; if (Math.abs(k.vx) > 1) sfx('pebble', { x: k.x, y: k.y, vol: 0.12, rate: 1.4, gap: 0.08 }); }
      else k.x = nx;
      k.y += k.vy * dt; k.z += k.vz * dt;
      if (k.z > 0.9 || k.z < -0.9) { k.z = Math.max(-0.9, Math.min(0.9, k.z)); k.vz *= -0.4; }
      let ground = false;
      if (solidAt(k.x, k.y - k.r)) {
        const top = Math.floor(k.y - k.r) + 1;
        if (k.vy < 0) { k.y = top + k.r * 0.62; if (k.vy < -1.6) { k.vy *= -0.32; k.vz *= 0.7; if (k.vy > 0.6) sfx('pebble', { x: k.x, y: k.y, vol: 0.1, rate: 1.5, gap: 0.08 }); } else { k.vy = 0; ground = true; } }
      } else if (solidAt(k.x, k.y + k.r) && k.vy > 0) k.vy = 0;
      if (ground) { const f = Math.exp(-dt * (k.roll ? 0.9 : 2.6)); k.vx *= f; k.vz *= Math.exp(-dt * 4); if (Math.abs(k.vx) < 0.1 && Math.abs(k.vz) < 0.1) { k.vx = k.vz = 0; k.rest = true; } }
      // roll on the ground, tumble in the air
      const ang = (ground ? Math.hypot(k.vx, k.vz) / k.r : 6 + Math.abs(k.vx) * 3) * dt;
      if (ang > 1e-4) { _a.set(k.vz, 0, -k.vx).normalize(); if (!ground) _a.set(0.4, 0.7, -Math.sign(k.vx || 1)).normalize(); Q4.setFromAxisAngle(k.roll ? _B.set(0, 0, -Math.sign(k.vx || 1)) : _a, ang); k.q.premultiply(Q4); }
      k.b.mesh.setMatrixAt(k.i, M4.compose(V4.set(k.x, k.y + FO, k.z), k.q, S4.set(k.r, k.r, k.r)));
      k.b.dirty = true;
    }
    for (const b of kbatches) if (b.dirty) { b.mesh.instanceMatrix.needsUpdate = true; b.dirty = false; }

    // moths in the beam
    if (nMoth && lit && !P.dead) {
      for (let i = moths.length - 1; i >= 0; i--) if (moths[i].q.max !== MOTH || moths[i].q.life <= 0) moths.splice(i, 1);
      if (moths.length < nMoth && Math.random() < dt * 0.8) {
        const ph = Math.random() * 6.28, q = fx.dustP.add({ x: lx + lampDir.x * 4 + (Math.random() - 0.5) * 3, y: ly + 2 + Math.random(), z: lz + (Math.random() - 0.5), vx: 0, vy: 0, vz: 0, s0: 0.06, s1: 0.06, max: MOTH, a: 0.95,
          r: 0.95, g: 0.9, b: 0.78, drag: 0, grav: 0, fade: 0.01 });
        q.life = MOTH * 0.5; moths.push({ q, ph, d: 1.1 + Math.random() * 1.6 });
      }
      for (const m of moths) {
        const q = m.q, ph = m.ph, dd = m.d + Math.sin(t * 0.6 + ph) * 0.5;
        const tx = lx + lampDir.x * dd + Math.sin(t * 2.7 + ph) * 0.35, ty = ly + lampDir.y * dd + Math.cos(t * 2.1 + ph * 1.3) * 0.3 + 0.15, tz = lz + lampDir.z * dd + Math.sin(t * 1.7 + ph) * 0.35;
        q.vx = (tx - q.x) * 2.6 + (Math.random() - 0.5) * 3; q.vy = (ty - q.y) * 2.6 + (Math.random() - 0.5) * 3; q.vz = (tz - q.z) * 2.6 + (Math.random() - 0.5) * 2;
        q.s0 = q.s1 = 0.035 + 0.035 * Math.abs(Math.sin(t * 38 + ph * 7));
      }
    } else for (const m of moths.splice(0)) if (m.q.max === MOTH) m.q.life = 0;
    // ripples where the digger wades (and rings where the boots break the surface)
    if (P.inWater && !P.headUnder && !P.dead) {
      let ty = Math.floor(P.y + 0.6); const tx = Math.floor(P.x);
      for (let k = 0; k < 6 && at(tx, ty + 1) === T.WATER; k++) ty++;
      const top = ty + 0.92;
      rippleT -= dt;
      if (rippleT <= 0) {
        rippleT = moving > 0.8 ? 0.26 : 0.9;
        fx.ring(P.x + (Math.random() - 0.5) * 0.2, top + 0.02, 0.15, 0.55 + moving * 0.12, 0x9fd8ff, false);
        if (moving > 1.6) for (let k = 0; k < 3; k++) fx.dustP.add({ x: P.x - P.face * 0.2, y: top + 0.05, z: (Math.random() - 0.5) * 0.4, vx: -P.vx * 0.2 + (Math.random() - 0.5), vy: 1.5 + Math.random() * 1.5, vz: (Math.random() - 0.5) * 0.6,
          s0: 0.1, s1: 0.3, max: 0.6, a: 0.45, r: 0.75, g: 0.88, b: 0.95, drag: 0.8, grav: 10, fade: 0.5, floor: top - 0.05 });
      }
    }
    // grit from the roof
    for (let i = trickles.length - 1; i >= 0; i--) {
      const r = trickles[i];
      r.t -= dt;
      if (r.t <= 0) { trickles.splice(i, 1); continue; }
      const rate = r.n * (r.t / r.dur) * 14;
      if (Math.random() < dt * rate) {
        fx.dustP.add({ x: r.x + (Math.random() - 0.5) * 1.6, y: r.top, z: (Math.random() - 0.5) * 1.4, vx: 0, vy: -0.4, vz: 0, s0: 0.05, s1: 0.04, max: 1.6, a: 0.95,
          r: rub[0] * 1.3, g: rub[1] * 1.3, b: rub[2] * 1.3, drag: 0.1, grav: 9.8, fade: 0.25, floor: r.floor + 0.02 });
        if (Math.random() < 0.18) fx.dust(r.x + (Math.random() - 0.5) * 1.2, r.top - 0.1, (Math.random() - 0.5) * 1.2, { n: 1, s0: 0.15, s1: 0.8, life: 2, vy: -0.6, up: 0.1, jit: 0.3, a: 0.22, grav: 0.4 });
      }
    }
  };

  // ------------------------------------------------------------------ game events
  const event = (e, Wd) => {
    const P = Wd && Wd.players ? Wd.players[0] : null;
    switch (e.k) {
      case 'break': {   // a tile is gone: whatever grew on it falls, whatever lay on it drops
        const tx = Math.floor(e.x), ty = Math.floor(e.y);
        for (const it of items) if (it.alive && it.anchor && it.anchor[0] === tx && it.anchor[1] === ty) drop(it);
        for (const it of items) if (it.alive && it.kd.brk && Math.hypot(it.x - e.x, it.mid - e.y) < (e.how === 'blast' ? 2.6 : 0.8)) shatter(it, e.how === 'blast');
        for (const k of kicks) if (k.alive && Math.abs(k.x - e.x) < 1.2 && Math.abs(k.y - e.y) < 1.6) { k.rest = false; if (e.how === 'blast') kickOne(k, (k.x - e.x) * 6, 4 + Math.random() * 3, (Math.random() - 0.5) * 2); }
        break;
      }
      case 'blast':
        wave(e.x, e.y, 12, time);
        for (const k of kicks) { if (!k.alive) continue; const dx = k.x - e.x, dy = k.y - e.y, d = Math.hypot(dx, dy); if (d < 4.5) kickOne(k, dx / (d || 1) * (9 - d * 1.6) + (Math.random() - 0.5) * 2, 3 + (4.5 - d) * 1.4, (Math.random() - 0.5) * 3); }
        for (const it of items) if (it.alive && it.kd.brk && Math.hypot(it.x - e.x, it.mid - e.y) < 2.8) shatter(it, true);
        trickle(e.x, e.y, 3, 2.6); trickle(e.x - 2.5, e.y, 1.5, 2); trickle(e.x + 2.5, e.y, 1.5, 2);
        break;
      case 'land':
        if (e.v > 7) { wave(e.x, e.y + 0.5, 6, time, 9); trickle(e.x, e.y, Math.min(2, e.v / 8), 1.4); }
        else if (e.v > 3.5) wave(e.x, e.y + 0.3, 1.6, time, 8);
        if (e.v > 3) for (const k of kicks) if (k.alive && Math.abs(k.x - e.x) < 0.9 && Math.abs(k.y - e.y) < 0.4) kickOne(k, (k.x - e.x) * 3 + (Math.random() - 0.5), 1 + e.v * 0.15, (Math.random() - 0.5) * 1.5);
        break;
      case 'swing': {   // the pick through the air: breaks what it meets, shoves what it brushes
        if (!P) break;
        const ax = e.x + P.face * 0.95, ay = e.y + (e.aim === 1 ? 0.9 : e.aim ? -0.8 : 0);
        for (const it of items) {
          if (!it.alive) continue;
          const d = Math.hypot(it.x - ax, it.mid - ay);
          if (d > 1.3 || Math.abs(it.z) > 0.9) continue;
          if (it.kd.brk && d < 0.85) { shatter(it); continue; }
          if (it.kd.dir) { it.vx += P.face * 6 * it.h; it.act = true; }
          if (it.gain) it.ex = Math.max(it.ex, 1.1);
        }
        for (const k of kicks) if (k.alive && Math.hypot(k.x - ax, k.y - ay) < 0.7 && Math.abs(k.z) < 0.6) kickOne(k, P.face * (4 + Math.random() * 2), 2 + Math.random() * 2, (Math.random() - 0.5));
        break;
      }
      case 'pick': case 'ore': case 'clink':
        for (const it of items) if (it.alive && it.kd.brk && Math.hypot(it.x - e.x, it.mid - e.y) < 0.9) shatter(it);
        wave(e.x, e.y, 1.8, time, 6);
        break;
      case 'slam': case 'bossdie': wave(e.x, e.y, 14, time, 8); trickle(e.x, e.y, 3, 2.5); break;
    }
  };

  const dispose = () => { for (const b of batches.concat(kbatches)) b.mesh.dispose(); };
  const counts = {};
  for (const [n, l] of byName) counts[n] = l.length;
  const info = { set, counts, items: items.length, glow: items.filter((i) => i.gain).length, breakables: items.filter((i) => i.kd.brk).length, kicks: kicks.length,
get kicked() { return kicks.filter((k) => !k.rest || k.vx).length; }, get broken() { return items.filter((i) => !i.alive).length; } };
  return { group, update, event, dispose, info, _items: items, _kicks: kicks };
}

import * as THREE from 'three';
import { Batch, addJewel, frameMatrix, tubeAlong, TAU } from './geo.js';
import { enamelMaterial, GEM_COLORS, rng } from './materials.js';

// Parametric enamel blade (petals and leaves).
// s: 0 at the base hinge to 1 at the tip. t: -1..1 across the blade.
// Local axes: x across, y along the length, z toward the concave face.
export function makeBlade({ L = 7, W = 3.6, cup = 0.5, bend = -0.3, lip = 0.25, base = 0.1, shoulder = 0.7, power = 0.8, taper = 0.12, twist = 0, sweep = 0, s0 = 0, nu = 34, nv = 46 } = {}) {
  const NC = 96;
  const cy = new Float32Array(NC + 1);
  const cz = new Float32Array(NC + 1);
  let y = 0;
  let z = 0;
  for (let i = 1; i <= NC; i++) {
    const s = i / NC;
    const th = typeof bend === 'function' ? bend(s) : bend * Math.pow(s, 1.4);
    y += (Math.cos(th) * L) / NC;
    z += (Math.sin(th) * L) / NC;
    cy[i] = y;
    cz[i] = z;
  }
  const half = (s) => (W / 2) * (base + (1 - base) * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(s, shoulder))), power)) * (1 - taper * s);
  const CL = (s) => {
    const f = Math.min(NC - 1e-6, Math.max(0, s * NC));
    const i = Math.floor(f);
    const k = f - i;
    return [cy[i] * (1 - k) + cy[i + 1] * k, cz[i] * (1 - k) + cz[i + 1] * k];
  };
  const P = (s, t, out = new THREE.Vector3()) => {
    const w = half(s);
    const [py, pz] = CL(s);
    let x = t * w;
    let zz = cup * t * t * w - lip * Math.pow(Math.abs(t), 5) * w * Math.min(1, s * 3);
    if (twist) {
      const a = twist * s;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const nx = x * ca - zz * sa;
      zz = x * sa + zz * ca;
      x = nx;
    }
    x += sweep * s * s * L;
    return out.set(x, py, pz + zz);
  };
  const e = 1e-3;
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const frame = (s, t) => {
    const sa = Math.min(1 - e, Math.max(e, s));
    const ps = P(sa + e, t).sub(P(sa - e, t, tmpA));
    const pt = P(sa, Math.min(1, t + 0.02)).sub(P(sa, Math.max(-1, t - 0.02), tmpB));
    const n = new THREE.Vector3().crossVectors(pt, ps).normalize();
    return { n, ps: ps.normalize(), pos: P(s, t) };
  };
  const pos = [];
  const uv = [];
  const idx = [];
  for (let i = 0; i <= nv; i++) {
    const s = s0 + (1 - s0) * (i / nv);
    for (let j = 0; j <= nu; j++) {
      const t = -1 + (2 * j) / nu;
      const p = P(s, t);
      pos.push(p.x, p.y, p.z);
      uv.push((t + 1) / 2, s);
    }
  }
  for (let i = 0; i < nv; i++)
    for (let j = 0; j < nu; j++) {
      const a = i * (nu + 1) + j;
      const b = a + 1;
      const c = a + nu + 1;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();
  return { geometry, P, frame, half, L, W };
}

// Closed gold rim following the blade outline.
export function rimPoints(blade, inset = 1, n = 70, lift = 0.0, sMin = 0.0, sMax = 1) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const s = sMin + (sMax - sMin) * (i / n);
    const f = blade.frame(s, inset);
    pts.push(f.pos.clone().addScaledVector(f.n, lift));
  }
  for (let i = n - 1; i >= 1; i--) {
    const s = sMin + (sMax - sMin) * (i / n);
    const f = blade.frame(s, -inset);
    pts.push(f.pos.clone().addScaledVector(f.n, lift));
  }
  return pts;
}

export const PETAL_KINDS = ['tealMagenta', 'magentaViolet', 'violetBlue', 'greenBlue', 'crimson', 'tealViolet'];

// One articulated enamel petal. Origin is the hinge; +Y runs to the tip.
export function buildPetal(mats, { kind = 'tealMagenta', seed = 1, L = 7.5, W = 3.8, cup = 0.5, bend = -0.25, lip = 0.3, shoulder = 0.7, gemCount = 3, gemScale = 1, rimRadius = 0.05, fasteners = 2 } = {}) {
  const r = rng(seed * 101 + 7);
  const blade = makeBlade({ L, W, cup, bend, lip, shoulder, base: 0.14, taper: 0.1 });
  const group = new THREE.Group();
  const enamel = new THREE.Mesh(blade.geometry, enamelMaterial(kind, seed));
  enamel.name = 'enamel';
  group.add(enamel);

  const golds = new Batch(false);
  const gems = new Batch(true);

  // rim + inlay
  golds.add(tubeAlong(rimPoints(blade, 1.0, 64, 0.0), rimRadius, { closed: true, seg: 220, radial: 6 }));
  golds.add(tubeAlong(rimPoints(blade, 0.8, 56, 0.01, 0.1, 0.9), rimRadius * 0.42, { closed: true, seg: 180, radial: 4 }));
  const mid = [];
  for (let i = 0; i <= 28; i++) {
    const f = blade.frame(0.04 + (i / 28) * 0.9, 0);
    mid.push(f.pos.clone().addScaledVector(f.n, 0.012));
  }
  golds.add(tubeAlong(mid, rimRadius * 0.4, { radial: 4 }));

  // hinge barrel at the base
  const barrel = new THREE.CylinderGeometry(0.17, 0.17, W * 0.34, 14);
  barrel.rotateZ(Math.PI / 2);
  golds.add(barrel, new THREE.Matrix4().makeTranslation(0, 0, -0.02));
  for (const sx of [-1, 1]) {
    const knuckle = new THREE.CylinderGeometry(0.23, 0.23, 0.2, 14);
    knuckle.rotateZ(Math.PI / 2);
    golds.add(knuckle, new THREE.Matrix4().makeTranslation(sx * W * 0.19, 0, -0.02));
  }

  // jewels: one large at the claw, the rest scattered along the veins
  const palette = [GEM_COLORS.sapphire, GEM_COLORS.ruby, GEM_COLORS.emerald, GEM_COLORS.rose, GEM_COLORS.aqua, GEM_COLORS.amber];
  const spots = [{ s: 0.1, t: 0, r: 0.19 * gemScale }];
  for (let i = 0; i < gemCount; i++) {
    const s = 0.28 + r() * 0.6;
    const side = r() > 0.5 ? 1 : -1;
    spots.push({ s, t: side * (0.55 + r() * 0.3), r: (0.085 + r() * 0.07) * gemScale });
  }
  spots.push({ s: 0.9, t: 0, r: 0.1 * gemScale });
  for (const sp of spots) {
    const f = blade.frame(sp.s, sp.t);
    const m = frameMatrix(f.pos.clone().addScaledVector(f.n, 0.015), f.n, f.ps);
    addJewel(gems, golds, m, sp.r, palette[Math.floor(r() * palette.length)], { prongs: sp.r > 0.15 ? 6 : 0 });
  }
  // jeweled fasteners (small rivets) along the edge
  const rivet = new THREE.CylinderGeometry(0.05, 0.065, 0.1, 8);
  rivet.rotateX(Math.PI / 2);
  for (let i = 0; i < fasteners; i++) {
    const s = 0.2 + (i / Math.max(1, fasteners - 1)) * 0.55;
    for (const sg of [-1, 1]) {
      const f = blade.frame(s, sg * 0.9);
      golds.add(rivet, frameMatrix(f.pos.clone().addScaledVector(f.n, 0.03), f.n, f.ps, 1));
    }
  }

  const goldMesh = golds.build(mats.gold);
  const gemMesh = gems.build(mats.gem);
  if (goldMesh) {
    goldMesh.name = 'gold';
    group.add(goldMesh);
  }
  if (gemMesh) {
    gemMesh.name = 'gems';
    group.add(gemMesh);
  }
  group.userData.blade = blade;
  void TAU;
  return group;
}

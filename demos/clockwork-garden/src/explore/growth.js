import * as THREE from 'three';
import { petalGeometry, taperedTube } from '../geometry/shapes.js';
import { collarGeometry } from '../geometry/parts.js';
import { RNG } from '../core/rng.js';
import { clamp, lerp, smooth, smoother, settle } from '../core/ease.js';
import { groundHeight } from './bounds.js';

// The garden grows over a session. Every pollen deposit in the skep wakes the
// next planting site: copper stalks push up from the glass seedpods (later,
// from beds further out) and unfurl blown-glass blooms with lamp-lit hearts.
// Grown blooms can be pollinated too. All parts are instanced.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const PETALS = 6;
const TINTS = [
  { glass: '#f4efe4', heart: [1.0, 0.62, 0.26] },
  { glass: '#ffd9a8', heart: [1.0, 0.55, 0.18] },
  { glass: '#f6c9cf', heart: [1.0, 0.5, 0.45] },
  { glass: '#cfeee6', heart: [0.55, 0.95, 0.85] },
  { glass: '#ddd2f4', heart: [0.75, 0.6, 1.0] },
];

export const GROWTH_SITES = [
  { c: V(-7.5, 0, 5.5), r: [2.5, 6], n: 5, name: 'by the seedpods near the escapement' },
  { c: V(6, 0, -9), r: [2.5, 6], n: 5, name: 'by the seedpods beside the skep' },
  { c: V(-12, 0, 20), r: [2.5, 6], n: 4, name: 'by the seedpods under the copper tree' },
  { c: V(13, 0, 7), r: [2.5, 6], n: 5, name: 'by the seedpods at the copper reed' },
  { c: V(30, 0, 28), r: [3, 9], n: 6, name: 'at the edge of the path' },
  { c: V(-34, 0, -34), r: [3, 9], n: 6, name: 'behind the glass blossom' },
  { c: V(32, 0, -46), r: [3, 10], n: 6, name: 'beside the path, beyond the skep' },
  { c: V(-58, 0, 64), r: [4, 12], n: 7, name: 'in the bed toward the doors' },
  { c: V(112, 0, -70), r: [4, 12], n: 7, name: 'across the path' },
  { c: V(-80, 0, -150), r: [4, 12], n: 7, name: 'deep in the left bed' },
  { c: V(120, 0, -230), r: [4, 12], n: 7, name: 'by the rose arch' },
  { c: V(20, 0, -470), r: [4, 12], n: 7, name: 'near the fountain' },
];

export class Growth {
  constructor(mat, quality, bounds) {
    this.bounds = bounds;
    this.group = new THREE.Group();
    this.group.name = 'growth';
    const rng = new RNG('growth');
    this.blooms = [];
    this.sites = GROWTH_SITES.map((s) => ({ ...s, grown: false, t0: null, blooms: [] }));
    // canonical stalk (height 1, gentle S-curve)
    const stalkGeo = taperedTube(new THREE.CatmullRomCurve3([V(0, 0, 0), V(0.04, 0.35, 0.02), V(-0.03, 0.7, -0.02), V(0, 1, 0)]), 0.2, 0.11, 24, 6);
    const petalGeo = petalGeometry({ length: 3.6, width: 2.3, cup: 1.3, curl: 0.35, thickness: 0.06, segU: 10, segV: 8, tip: 0.6 }).geometry;
    const heartGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const collarGeo = collarGeometry(0.55, 0.5);
    let cap = 0;
    for (const s of this.sites) cap += s.n;
    this.cap = cap;
    // blown glass without a transmission pass: tinted, glossy, faintly lit from within
    const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.7, specularIntensity: 1, emissive: '#ff9a40', emissiveIntensity: 0.08, sheen: 0.6, sheenColor: new THREE.Color('#fff1dc') });
    this.stalks = new THREE.InstancedMesh(stalkGeo, mat.copper, cap);
    this.petals = new THREE.InstancedMesh(petalGeo, glassMat, cap * PETALS);
    this.hearts = new THREE.InstancedMesh(heartGeo, new THREE.MeshBasicMaterial({ color: '#ffffff' }), cap);
    this.collars = new THREE.InstancedMesh(collarGeo, mat.gold, cap);
    for (const m of [this.stalks, this.petals, this.hearts, this.collars]) {
      m.count = 0;
      m.frustumCulled = false;
      m.castShadow = m !== this.hearts;
      m.receiveShadow = true;
      this.group.add(m);
    }
    this.petals.renderOrder = 3;
    // lay out every bloom up front (deterministic per session)
    let idx = 0;
    for (const s of this.sites) {
      for (let i = 0; i < s.n; i++) {
        let x, z, tries = 0;
        do {
          const a = rng.range(0, TAU), r = rng.range(s.r[0], s.r[1]);
          x = s.c.x + Math.cos(a) * r; z = s.c.z + Math.sin(a) * r;
        } while (tries++ < 12 && (bounds.clearance(V(x, groundHeight(x, z) + 6, z)) < 2.5 || s.blooms.some((b) => Math.hypot(b.base.x - x, b.base.z - z) < 3.2)));
        const base = V(x, groundHeight(x, z) - 0.3, z);
        const h = rng.range(8, 15) + (s.r[1] > 8 ? rng.range(6, 18) : 0);
        const lean = V(rng.range(-0.15, 0.15), 1, rng.range(-0.15, 0.15)).normalize();
        const tint = TINTS[Math.floor(rng.float() * TINTS.length)];
        const b = { idx, base, h, lean, top: base.clone().addScaledVector(lean, h), yaw: rng.range(0, TAU), scale: rng.range(0.8, 1.15), delay: i * 0.35 + rng.range(0, 0.3), tint, ph: rng.range(0, TAU), site: s, k: 0, glow: 0, pollinated: 0 };
        s.blooms.push(b);
        this.blooms.push(b);
        idx++;
        this.petals.setColorAt(b.idx * PETALS, new THREE.Color(tint.glass));
        for (let p = 1; p < PETALS; p++) this.petals.setColorAt(b.idx * PETALS + p, new THREE.Color(tint.glass));
        this.hearts.setColorAt(b.idx, new THREE.Color(0, 0, 0));
      }
    }
    this.m4 = new THREE.Matrix4();
    this.grownCount = 0;
  }

  get nextSite() { return this.sites.find((s) => !s.grown) || null; }

  // wake the next site; returns it (or null when every site has grown)
  sprout(now) {
    const s = this.nextSite;
    if (!s) return null;
    s.grown = true;
    s.t0 = now;
    this.grownCount++;
    return s;
  }

  // restore a previous session's growth instantly
  grow(n) {
    for (let i = 0; i < n; i++) { const s = this.sprout(-100); if (!s) break; }
  }

  update(t, bee) {
    const m4 = this.m4, q = new THREE.Quaternion(), e = new THREE.Euler(), s = V(), p = V(), col = new THREE.Color();
    const up = V(0, 1, 0);
    let n = 0;
    for (const site of this.sites) {
      if (!site.grown) continue;
      for (const b of site.blooms) {
        const age = t - site.t0 - b.delay;
        // stalk shoots up with a spring, then the bloom unfurls ring by ring
        const kS = age <= 0 ? 0 : settle(clamp(age / 2.2), 1.1, 4.5);
        const kB = age <= 1.2 ? 0 : smoother(clamp((age - 1.2) / 1.8)) + (age > 3 ? Math.exp(-(age - 3) * 4) * Math.sin((age - 3) * 16) * 0.05 : 0);
        b.k = kB;
        const sway = Math.sin(t * 0.8 + b.ph) * 0.03;
        const hNow = Math.max(0.001, b.h * kS);
        q.setFromUnitVectors(up, V(b.lean.x + sway, b.lean.y, b.lean.z).normalize());
        m4.compose(b.base, q, s.set(b.scale * 1.6, hNow, b.scale * 1.6));
        this.stalks.setMatrixAt(b.idx, m4);
        const top = b.base.clone().addScaledVector(V(b.lean.x + sway, b.lean.y, b.lean.z).normalize(), hNow);
        b.topNow = top;
        m4.compose(top, q, s.setScalar(b.scale * Math.max(0.001, kS)));
        this.collars.setMatrixAt(b.idx, m4);
        // the heart: glows from the start, brighter when pollinated
        const pulse = 0.85 + 0.15 * Math.sin(t * 2.2 + b.ph);
        const flare = b.flareAt !== undefined ? Math.exp(-(t - b.flareAt) * 1.6) * 3 : 0;
        const g = (smooth(clamp((age - 1.0) / 1.5)) * (1.1 + b.pollinated * 1.4) * pulse + flare) * 1.0;
        const hc = b.tint.heart;
        this.hearts.setColorAt(b.idx, col.setRGB(hc[0] * g, hc[1] * g, hc[2] * g));
        m4.compose(top.clone().add(V(0, 0.6 * b.scale, 0)), q, s.setScalar(b.scale * Math.max(0.001, 0.4 + 0.6 * kB) * 0.85));
        this.hearts.setMatrixAt(b.idx, m4);
        for (let i = 0; i < PETALS; i++) {
          const phi = b.yaw + (i / PETALS) * TAU;
          e.set(lerp(-0.25, 0.75 + (i % 2) * 0.18, kB) + sway, Math.PI / 2 - phi, 0, 'YXZ');
          const pq = new THREE.Quaternion().setFromEuler(e);
          p.set(Math.cos(phi) * 0.55 * b.scale, 0.2, Math.sin(phi) * 0.55 * b.scale).add(top);
          m4.compose(p, pq, s.setScalar(b.scale * Math.max(0.001, 0.25 + 0.75 * kB)));
          this.petals.setMatrixAt(b.idx * PETALS + i, m4);
        }
        n = Math.max(n, b.idx + 1);
        // a grown bloom becomes a landing place
        if (b.landable) {
          b.landable.spot.copy(top).add(V(0, 0.6 * b.scale + 1.6, 0));
          b.landable.enabled = kB > 0.9;
        }
      }
    }
    this.stalks.count = this.collars.count = this.hearts.count = n;
    this.petals.count = n * PETALS;
    for (const m of [this.stalks, this.petals, this.hearts, this.collars]) m.instanceMatrix.needsUpdate = true;
    if (this.hearts.instanceColor) this.hearts.instanceColor.needsUpdate = true;
  }

  // register landables (once the actor/bounds exist)
  registerLandables(bounds) {
    for (const b of this.blooms) {
      b.landable = bounds.addLandable({ kind: 'grown', name: 'a glass bloom', spot: b.top.clone().add(V(0, 2, 0)), radius: 2.5, pollen: 0.3, ref: b, enabled: false });
    }
  }
}

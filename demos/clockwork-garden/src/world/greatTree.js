import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { taperedTube } from '../geometry/shapes.js';
import { gearGeometry } from '../geometry/gears.js';
import { RNG } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, sseg } from '../core/ease.js';
import { L, columnSpots } from './layout.js';
import { archPoint } from './greenhouse.js';
import { swayMesh } from './wind.js';

// The great clockwork tree at the far end of the path, where the promenade
// ends: a trunk of bronze cords twisted together and bound in gold wire,
// buttress roots arching over the soil, limbs that spread under the whole
// width of the vault and fork again and again, brass gears set into the
// trunk and the forks (they turn, slowly, geared to one another in spirit),
// clouds of pink porcelain blossom at every twig (glowing at night) and
// lanterns hung on chains all through the crown (the foliage's lanterns:
// they swing, kindle and light the garden like the rest).
// Everything is grown once from a seed and drawn in a few batches.

const TAU = Math.PI * 2;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const flat = (g) => { for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k); return g.index ? g.toNonIndexed() : g; };

// a five-petalled blossom, slightly cupped (one batch for all of them)
function blossomGeometry() {
  const pos = [];
  const R = 1.35;
  for (let p = 0; p < 5; p++) {
    const a0 = (p / 5) * TAU;
    const pts = [];
    for (let k = 0; k <= 4; k++) {
      const a = a0 + ((k / 4) - 0.5) * 1.15;
      const rr = R * (0.55 + 0.45 * Math.sin((k / 4) * Math.PI));
      pts.push([Math.cos(a) * rr, 0.32 * rr * rr / R, Math.sin(a) * rr]);
    }
    for (let k = 0; k < 4; k++) {
      pos.push(0, 0.08, 0, ...pts[k + 1], ...pts[k]);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const heart = new THREE.OctahedronGeometry(0.32, 0);
  heart.translate(0, 0.2, 0);
  return mergeGeometries([g, flat(heart)]);
}

export class GreatTree {
  constructor(mat, quality) {
    this.group = new THREE.Group();
    this.group.name = 'greatTree';
    const rng = new RNG('greattree');
    const T = L.tree;
    const H = L.house;
    const low = quality.tier === 'low';
    this.base = V(T.x, 0, T.z);
    this.segments = []; // { a, b, r } (colliders, the planting)
    this.clusters = []; // blossom clouds { c, r }
    this.lanternSpots = [];
    const bark = new THREE.MeshStandardMaterial({ color: '#4a3424', metalness: 0.55, roughness: 0.5 });
    const barkParts = [], goldParts = [];

    // ---- the trunk: a core and five cords twisting round it ----------------------
    const TOP = 165;
    const trunkAt = (k, out = V()) => out.set(T.x + Math.sin(k * 2.2) * 4 + k * k * 3, k * TOP - 3, T.z + Math.cos(k * 1.7) * 3 - k * 2);
    const tc = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => trunkAt(i / 8)));
    barkParts.push(taperedTube(tc, 19, 13, 24, 16));
    for (let s = 0; s < 5; s++) {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const k = i / 24;
        const a = (s / 5) * TAU + k * TAU * 0.85;
        const r = 18.5 - k * 5.5 + (k < 0.1 ? (0.1 - k) * 80 : 0);
        pts.push(trunkAt(k).add(V(Math.cos(a) * r, 0, Math.sin(a) * r)));
      }
      barkParts.push(taperedTube(new THREE.CatmullRomCurve3(pts), 6.4, 4.2, 48, 8));
    }
    // gold wire bound round it
    for (let w = 0; w < 2; w++) {
      const pts = [];
      for (let i = 0; i <= 90; i++) {
        const k = 0.04 + (i / 90) * 0.9;
        const a = w * Math.PI + k * TAU * 4.5;
        const r = 22 - k * 6;
        pts.push(trunkAt(k).add(V(Math.cos(a) * r, 0, Math.sin(a) * r)));
      }
      goldParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.7, 5, false));
    }
    for (let i = 0; i < 8; i++) this.segments.push({ a: trunkAt(i / 8), b: trunkAt((i + 1) / 8), r: 21 - i * 0.7 });
    this.trunk = { x: T.x, z: T.z, r: 25 };

    // ---- buttress roots arching over the soil ----------------------------------------
    this.roots = [];
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * TAU + rng.range(-0.2, 0.2);
      const len = rng.range(42, 78);
      const d = V(Math.cos(a), 0, Math.sin(a));
      const pts = [];
      for (let k = 0; k <= 6; k++) {
        const u = k / 6;
        const r = 14 + u * len;
        pts.push(V(T.x + d.x * r + Math.sin(u * 5 + i) * 3, 14 * (1 - u) + Math.sin(u * Math.PI) * 7 - u * 3, T.z + d.z * r + Math.cos(u * 4 + i) * 3));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      barkParts.push(taperedTube(curve, 9.5, 1.4, 20, 8));
      this.roots.push({ pts, r: 7 });
      for (let k = 0; k < 6; k++) this.segments.push({ a: pts[k], b: pts[k + 1], r: Math.max(1.6, 7.5 - k * 1.1) });
    }

    // ---- the crown: limbs forking again and again --------------------------------------
    const D = low ? 4 : 5;
    // (under the vault, inside the house, and clear of the iron columns down the beds)
    const cols = columnSpots().filter(([, cz]) => cz < -540);
    // (toward the fountain only well above its armillary)
    const inside = (p) => p.x > -200 && p.x < 262 && p.z > H.z1 + 25 && p.z < (p.y > 140 ? -470 : -600) && p.y < archPoint(clamp(p.x, H.x0, H.x1), H) - 26 && p.y > 40 && cols.every(([cx, cz]) => Math.hypot(p.x - cx, p.z - cz) > 22);
    const tips = [];
    const branch = (start, dir, len, r, depth) => {
      // bend: a little up and out, a wander; shorten it if it would leave the house
      let end;
      for (let tries = 0; tries < 8; tries++) {
        end = start.clone().addScaledVector(dir, len);
        if (inside(end)) break;
        // turn it back in (toward the crown's middle, and up), and a little shorter
        const toMid = V(25 - end.x, 260 - end.y, T.z - end.z).normalize();
        dir.lerp(toMid, 0.35).normalize();
        len *= 0.88;
      }
      if (!inside(end)) return;
      const mid = start.clone().lerp(end, 0.5).add(V(rng.range(-1, 1) * len * 0.08, len * 0.08, rng.range(-1, 1) * len * 0.08));
      if (!inside(mid) && depth > 0) return;
      const curve = new THREE.QuadraticBezierCurve3(start.clone(), mid, end);
      const r1 = r * 0.72;
      barkParts.push(taperedTube(curve, r, r1, depth < 2 ? 14 : depth < 4 ? 6 : 3, depth < 1 ? 12 : depth < 3 ? 7 : 4));
      if (r > 1.0) for (let k = 0; k < 3; k++) this.segments.push({ a: curve.getPoint(k / 3), b: curve.getPoint((k + 1) / 3), r: r * (1 - k * 0.1) + 0.3 });
      // gold wire round the limbs
      if (depth <= 1) {
        const pts = [];
        const f = curve.computeFrenetFrames(40, false);
        for (let i = 0; i <= 40; i++) {
          const u = i / 40, a = u * TAU * 3 + depth;
          const rr = (r + (r1 - r) * u) * 1.15;
          pts.push(curve.getPointAt(u).addScaledVector(f.normals[i], Math.cos(a) * rr).addScaledVector(f.binormals[i], Math.sin(a) * rr));
        }
        goldParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.45, 4, false));
      }
      // lanterns hang from the sturdier limbs
      if (depth >= 1 && depth <= 3 && rng.chance(depth === 1 ? 0.8 : depth === 2 ? 0.28 : 0.05)) {
        const p = curve.getPoint(rng.range(0.45, 0.85));
        const chain = rng.range(8, 22), sc = rng.range(0.85, 1.15);
        this.lanternSpots.push({ p: V(p.x, p.y - chain - 8.4 * sc, p.z), top: p.y - r * 0.6, sc });
      }
      if (depth >= 2) {
        // blossom clouds along the twigs and at the tips
        this.clusters.push({ c: end.clone(), r: depth >= D ? 10 : 7 + rng.range(0, 3) });
        if (depth >= 3 && rng.chance(0.25)) this.clusters.push({ c: curve.getPoint(0.5), r: 5.5 });
      }
      if (depth >= D) { tips.push(end); return; }
      const n = depth <= 1 ? 3 : depth === 2 ? (rng.chance(0.4) ? 3 : 2) : 2;
      // children spread round the parent, away from the trunk, a little upward
      const out = V(end.x - T.x, 0, end.z - T.z);
      if (out.lengthSq() > 1e-4) out.normalize();
      const side = V().crossVectors(dir, V(0, 1, 0));
      if (side.lengthSq() < 1e-4) side.set(1, 0, 0);
      side.normalize();
      for (let c = 0; c < n; c++) {
        const ang = rng.range(0.42, 0.85);
        const axis = side.clone().applyAxisAngle(dir, (c / n) * TAU + rng.range(-0.5, 0.5));
        const d = dir.clone().applyAxisAngle(axis, ang).addScaledVector(out, 0.25).add(V(0, 0.12, 0)).normalize();
        branch(end.clone(), d, len * rng.range(0.64, 0.76), r1 * 0.86, depth + 1);
      }
    };
    const top = trunkAt(1);
    // (the limbs fan out across the house's width more than along it)
    for (let i = 0; i < 6; i++) {
      let a = (i / 6) * TAU + rng.range(-0.2, 0.2) + 0.3;
      a = Math.atan2(Math.sin(a) * 0.55, Math.cos(a));
      const el = rng.range(0.42, 0.7);
      const d = V(Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el)).normalize();
      branch(top.clone().add(V(0, -8, 0)), d, rng.range(130, 160), 11.5, 0);
    }
    this.tips = tips;

    // ---- gears in the trunk and at the forks ------------------------------------------
    const gearG = gearGeometry({ teeth: 20, module: 0.1, thickness: 0.12, spokes: 5, bevel: false });
    const gearSpots = [];
    for (const [k, a] of [[0.28, 0.4], [0.5, 1.6], [0.72, 0.1], [0.4, 3.6], [0.62, 4.9]]) {
      const c = trunkAt(k);
      const n = V(Math.cos(a), 0, Math.sin(a));
      gearSpots.push({ p: c.addScaledVector(n, 15.6 - k * 3), n, s: rng.range(8, 11.5), w: (gearSpots.length % 2 ? -1 : 1) * rng.range(0.12, 0.2) });
    }
    for (const seg of this.segments.filter((s) => s.r > 5 && s.a.y > 140).slice(0, 8)) {
      const d = V().subVectors(seg.b, seg.a).normalize();
      const n = V().crossVectors(d, V(0, 1, 0)).normalize();
      if (n.lengthSq() < 0.5) continue;
      gearSpots.push({ p: seg.a.clone().addScaledVector(n, seg.r * 0.95), n, s: rng.range(4.5, 6.5), w: (gearSpots.length % 2 ? -1 : 1) * rng.range(0.15, 0.3) });
    }
    this.gearMesh = new THREE.InstancedMesh(gearG, mat.gold, gearSpots.length);
    this.gears = gearSpots.map((g, i) => ({ ...g, i, q: new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), g.n) }));
    this.gearMesh.castShadow = true;

    // ---- merge ------------------------------------------------------------------------------
    const barkMesh = new THREE.Mesh(mergeGeometries(barkParts.map(flat)), bark);
    const goldMesh = new THREE.Mesh(mergeGeometries(goldParts.map(flat)), mat.gold);
    barkMesh.castShadow = barkMesh.receiveShadow = true;
    goldMesh.castShadow = false;
    goldMesh.receiveShadow = true;
    this.group.add(barkMesh, goldMesh, this.gearMesh);
    this.barkMesh = barkMesh;

    // ---- blossom ------------------------------------------------------------------------
    const per = low ? 3 : 5;
    const n = this.clusters.length * per;
    this.blossomMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.42, metalness: 0.05, emissive: new THREE.Color('#ff9fb4'), emissiveIntensity: 0, side: THREE.DoubleSide });
    this.blossoms = new THREE.InstancedMesh(blossomGeometry(), this.blossomMat, n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = V(), e = new THREE.Euler(), col = new THREE.Color();
    const PINKS = ['#f6c4cf', '#f3b0bf', '#fbe0e6', '#f7d2da', '#ffffff', '#efa6b8'];
    let bi = 0;
    for (const c of this.clusters) {
      for (let k = 0; k < per; k++) {
        const u = rng.float() * 2 - 1, a = rng.range(0, TAU), rr = Math.sqrt(1 - u * u);
        const p = V(rr * Math.cos(a), Math.abs(u) * 0.8 + 0.1, rr * Math.sin(a)).multiplyScalar(c.r * rng.range(0.5, 1)).add(c.c);
        q.setFromEuler(e.set(rng.range(-0.9, 0.9), rng.range(0, TAU), rng.range(-0.9, 0.9)));
        m4.compose(p, q, s.setScalar(rng.range(1.5, 2.5)));
        this.blossoms.setMatrixAt(bi, m4);
        this.blossoms.setColorAt(bi, col.set(PINKS[Math.floor(rng.float() * PINKS.length)]));
        bi++;
      }
    }
    this.blossoms.count = bi;
    this.blossoms.castShadow = false;
    this.blossoms.receiveShadow = true;
    swayMesh(this.blossoms, 'rose');
    this.group.add(this.blossoms);
    this.stats = { branches: barkParts.length, clusters: this.clusters.length, blossoms: bi, lanterns: this.lanternSpots.length, gears: gearSpots.length };
    this.update(0, { dawn: 0 });
  }

  update(t, ctx) {
    // the gears turn (slowly); the blossom glows with the evening
    const m4 = this._m4 || (this._m4 = new THREE.Matrix4()), q = this._q || (this._q = new THREE.Quaternion()), one = this._one || (this._one = V(1, 1, 1)), qa = this._qa || (this._qa = new THREE.Quaternion());
    for (const g of this.gears) {
      qa.setFromAxisAngle(g.n, t * g.w);
      q.copy(qa).multiply(g.q);
      m4.compose(g.p, q, one.setScalar(g.s));
      this.gearMesh.setMatrixAt(g.i, m4);
    }
    this.gearMesh.instanceMatrix.needsUpdate = true;
    const glow = this.live ? this.live.blossom() : (1 - ctx.dawn * 0.8) * 0.25 * sseg(t, B.bloomWave[0], B.bloomWave[0] + 4);
    this.blossomMat.emissiveIntensity = glow;
  }
}

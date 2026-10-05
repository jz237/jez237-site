import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { petalGeometry, leafGeometry } from '../geometry/shapes.js';
import { bannerTexture } from '../materials/textures.js';
import { RNG } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, sseg } from '../core/ease.js';
import { L, columnSpots } from './layout.js';
import { swayMesh, zeroSway } from './wind.js';

// The promenade: what makes the path an avenue of light at night.
//   · opal globe bollards on short brass posts along both curbs, lit with
//     the garden (the interactive modes kindle them, night.js lights the
//     garden with them and mirrors them in the wet path);
//   · a pointed iron arch over the path in every vault bay: cluster uprights
//     with gilded bases, bands and capitals, a twin rib laddered with rings,
//     cusps along the inner rib, C-scrolls in the spandrels, a gilded finial,
//     a scroll bracket on each upright; climbing roses on most of them. Their
//     lanterns (one under the apex, one on each bracket) are the foliage's
//     (foliage.js), so they swing, kindle and light the garden like the
//     vault's.
// Everything is instanced: one arch is built and repeated down the path.

const TAU = Math.PI * 2;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const CURB_TOP = 4.5;
const GLOBE_R = 2.5;
const POST_H = 15;

// the arch's geometry in its own plane (x as in the house, z = 0)
export function archShape() {
  const A = L.arches, xc = (A.x0 + A.x1) / 2, hw = (A.x1 - A.x0) / 2;
  const rise = A.apex - A.spring;
  const R = (hw * hw + rise * rise) / (2 * hw); // each half an arc from the far springer's side
  return { xc, hw, R, spring: A.spring, apex: A.apex, x0: A.x0, x1: A.x1 };
}

// a point on the arch's centre line: s in 0..1 from the left springer over the apex to the right
// (inset: toward the arcs' centres, for the inner rib)
export function archPoint2(s, inset = 0, out = V()) {
  const { xc, hw, R, spring } = archShape();
  const left = s <= 0.5;
  const k = left ? s * 2 : (1 - s) * 2; // 0 at the springer, 1 at the apex
  const cx = left ? xc - hw + R : xc + hw - R;
  const r = R - inset;
  const a0 = left ? Math.PI : 0;
  const aApex = Math.acos((xc - cx) / r); // (inner arcs meet on the centre line too)
  const a = a0 + (aApex - a0) * k;
  return out.set(cx + Math.cos(a) * r, spring + Math.sin(a) * r, 0);
}

// height of the arch's underside (the cusps under the inner rib) at x; Infinity outside the span
export function archUnderside(x) {
  const { xc, hw, R, spring } = archShape();
  if (x <= xc - hw || x >= xc + hw) return Infinity;
  const cx = x < xc ? xc - hw + R : xc + hw - R;
  return spring + Math.sqrt(Math.max(0, R * R - (x - cx) * (x - cx))) - 10.5;
}

function tubeAlong(fn, n, r, sides = 6) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), n * 2, r, sides, false);
}

const flat = (g) => { g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; };

export class Promenade {
  constructor(mat, quality) {
    this.group = new THREE.Group();
    this.group.name = 'promenade';
    const rng = new RNG('promenade');
    this.m4 = new THREE.Matrix4();
    this._bollards(mat);
    this._arches(mat, rng, quality);
    this._festoons(mat);
    this._banners(mat);
  }

  // ---- fairy lights: strings of tiny bulbs between the arches -------------------------------
  // from capital to capital along both sides of the path, and apex to apex
  // overhead, each sagging in a catenary; spans that would cross the rose
  // arch or the last shot of the film are left bare
  _festoons(mat) {
    const S = archShape();
    const spans = [[-55, -150], [-340, -435], [-435, -625], [-625, -720]];
    const wires = [], bulbs = [];
    const lines = [];
    for (const [za, zb] of spans) {
      lines.push({ a: V(S.x0, S.spring + 1.5, za), b: V(S.x0, S.spring + 1.5, zb), sag: 11 });
      lines.push({ a: V(S.x1, S.spring + 1.5, za), b: V(S.x1, S.spring + 1.5, zb), sag: 11 });
      lines.push({ a: V(S.xc, S.apex + 1, za), b: V(S.xc, S.apex + 1, zb), sag: 9 });
    }
    const p = V();
    for (const ln of lines) {
      const len = ln.a.distanceTo(ln.b);
      const at = (u, out) => out.lerpVectors(ln.a, ln.b, u).add(V(0, -ln.sag * 4 * u * (1 - u), 0));
      const pts = [];
      for (let i = 0; i <= 16; i++) pts.push(at(i / 16, V()));
      wires.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.12, 3, false));
      const n = Math.max(6, Math.round(len / 4.2));
      for (let i = 1; i < n; i++) bulbs.push({ p: at(i / n, V()).add(V(0, -0.7, 0)), ph: (bulbs.length * 0.618) % 1 });
    }
    const wire = new THREE.Mesh(mergeGeometries(wires.map(flat)), new THREE.MeshStandardMaterial({ color: '#2b2a22', roughness: 0.6, metalness: 0.6 }));
    this.group.add(wire);
    const bulb = new THREE.IcosahedronGeometry(0.62, 0);
    this.bulbMesh = new THREE.InstancedMesh(bulb, new THREE.MeshBasicMaterial({ color: '#ffffff' }), bulbs.length);
    const c0 = new THREE.Color(0.05, 0.03, 0.015);
    bulbs.forEach((b, i) => {
      this.m4.makeTranslation(b.p.x, b.p.y, b.p.z);
      this.bulbMesh.setMatrixAt(i, this.m4);
      this.bulbMesh.setColorAt(i, c0);
    });
    this.bulbs = bulbs;
    this.group.add(this.bulbMesh);
  }

  // ---- banners on the vault's columns, facing the path --------------------------------------
  _banners(mat) {
    const tex = bannerTexture();
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.88, metalness: 0, side: THREE.DoubleSide, alphaTest: 0.5 });
    const W = 24, Hh = 60, top = 128;
    // a gently bellied cloth (a little fuller at the foot), in its own plane z = 0 facing +x
    const g = new THREE.PlaneGeometry(W, Hh, 6, 10);
    const pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i);
      const k = (Hh / 2 - y) / Hh; // 0 top → 1 foot
      pa.setZ(i, Math.sin((x / W + 0.5) * Math.PI) * 1.4 * k + Math.sin(x * 0.4 + y * 0.15) * 0.35 * k);
    }
    g.computeVertexNormals();
    g.rotateY(Math.PI / 2); // facing +x
    g.translate(0, top - Hh / 2, 0);
    const rod = new THREE.CylinderGeometry(0.55, 0.55, W + 5, 8);
    rod.rotateX(Math.PI / 2);
    rod.translate(0.3, top + 0.6, 0);
    const knobs = [];
    for (const s2 of [-1, 1]) { const k = new THREE.SphereGeometry(1.0, 8, 6); k.translate(0.3, top + 0.6, s2 * (W / 2 + 3)); knobs.push(k); }
    const goldG = mergeGeometries([rod, ...knobs].map(flat));
    const spots = columnSpots();
    const cloth = new THREE.InstancedMesh(g, m, spots.length);
    const fit = new THREE.InstancedMesh(goldG, mat.gold, spots.length);
    const xc = (L.pathX[0] + L.pathX[1]) / 2;
    spots.forEach(([x, z], i) => {
      const s2 = Math.sign(xc - x);
      // just in front of the column's face, toward the path
      this.m4.makeRotationY(s2 > 0 ? 0 : Math.PI).setPosition(x + s2 * 5.2, 0, z);
      cloth.setMatrixAt(i, this.m4);
      fit.setMatrixAt(i, this.m4);
    });
    cloth.castShadow = true;
    cloth.receiveShadow = true;
    this.group.add(cloth, fit);
    this.bannerMeshes = [cloth, fit];
  }

  // ---- bollards ----------------------------------------------------------------------
  _bollards(mat) {
    const A = L.arches, H = L.house;
    const xs = [L.pathX[0] - 2, L.pathX[1] + 2]; // on the curbs
    const lamps = L.lampSpots;
    const spots = [];
    for (let z = 204; z > H.z1 + 20; z -= 26) {
      for (const x of xs) {
        if (Math.hypot(x, z) < 62) continue; // the great bloom's patch
        if (A.zs.some((za) => Math.abs(za - z) < 9)) continue; // an arch's upright
        if (Math.abs(z + 250) < 12) continue; // the rose arch
        if (z < -505 && z > -615) continue; // the fountain
        if (lamps.some(([lx, lz]) => Math.abs(lz - z) < 12 && Math.abs(lx - x) < 12)) continue;
        spots.push(V(x, CURB_TOP, z));
      }
    }
    // a short brass post on a flange, a gilded collar under an opal globe, a gilded cap
    const post = new THREE.CylinderGeometry(0.55, 0.8, POST_H, 8, 1);
    post.translate(0, POST_H / 2, 0);
    const flange = new THREE.CylinderGeometry(1.5, 1.75, 1.2, 10);
    flange.translate(0, 0.6, 0);
    const knop = new THREE.SphereGeometry(1.0, 10, 6);
    knop.scale(1, 0.6, 1);
    knop.translate(0, POST_H * 0.55, 0);
    const brass = mergeGeometries([post, flange, knop].map(flat));
    const collar = new THREE.TorusGeometry(1.2, 0.32, 6, 16);
    collar.rotateX(Math.PI / 2);
    collar.translate(0, POST_H + 0.3, 0);
    const cup = new THREE.CylinderGeometry(1.5, 0.9, 1.0, 12, 1, true);
    cup.translate(0, POST_H + 0.4, 0);
    const cap = new THREE.SphereGeometry(1.05, 12, 6, 0, TAU, 0, Math.PI / 2);
    cap.translate(0, POST_H + GLOBE_R * 2 + 0.2, 0);
    const fin = new THREE.SphereGeometry(0.42, 8, 6);
    fin.translate(0, POST_H + GLOBE_R * 2 + 1.5, 0);
    const gold = mergeGeometries([collar, cup, cap, fin].map(flat));
    const globe = new THREE.SphereGeometry(GLOBE_R, 14, 10);
    const n = spots.length;
    const brassMesh = new THREE.InstancedMesh(brass, mat.brassAged, n);
    const goldMesh = new THREE.InstancedMesh(gold, mat.gold, n);
    this.globeMesh = new THREE.InstancedMesh(globe, new THREE.MeshBasicMaterial({ color: '#ffffff' }), n);
    this.bollards = [];
    const col = new THREE.Color();
    spots.forEach((p, i) => {
      this.m4.makeTranslation(p.x, p.y, p.z);
      brassMesh.setMatrixAt(i, this.m4);
      goldMesh.setMatrixAt(i, this.m4);
      const g = V(p.x, p.y + POST_H + GLOBE_R + 0.5, p.z);
      this.m4.makeTranslation(g.x, g.y, g.z);
      this.globeMesh.setMatrixAt(i, this.m4);
      this.globeMesh.setColorAt(i, col.setRGB(0.05, 0.03, 0.01));
      // (the evening reaches the far end of the house last)
      this.bollards.push({ base: p, globe: g, delay: (Math.hypot(p.x, p.z) / 780) * 6.0, ph: (i * 2.399) % TAU });
    });
    brassMesh.castShadow = goldMesh.castShadow = true;
    brassMesh.receiveShadow = goldMesh.receiveShadow = true;
    this.group.add(brassMesh, goldMesh, this.globeMesh);
    this.bollardMeshes = [brassMesh, goldMesh];
    this.globeR = GLOBE_R;
  }

  // ---- arches --------------------------------------------------------------------------
  _arches(mat, rng, quality) {
    const S = archShape();
    const A = L.arches;
    const iron = [], gold = [];
    // the uprights: a cluster column (a shaft and four slender colonnettes)
    for (const x of [S.x0, S.x1]) {
      const h = S.spring - 2 - CURB_TOP;
      const shaft = new THREE.CylinderGeometry(1.45, 1.6, h, 10);
      shaft.translate(x, CURB_TOP + h / 2, 0);
      iron.push(shaft);
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * TAU + Math.PI / 4;
        const c = new THREE.CylinderGeometry(0.42, 0.42, h, 5);
        c.translate(x + Math.cos(a) * 1.55, CURB_TOP + h / 2, Math.sin(a) * 1.55);
        iron.push(c);
      }
      const plinth = new THREE.CylinderGeometry(3.0, 3.3, 3.4, 8);
      plinth.translate(x, CURB_TOP + 1.2, 0);
      iron.push(plinth);
      // gilded base, bands and the capital
      const base = new THREE.CylinderGeometry(2.2, 2.7, 3.0, 12);
      base.translate(x, CURB_TOP + 4.3, 0);
      gold.push(base);
      for (const y of [32, 58]) {
        const band = new THREE.TorusGeometry(2.05, 0.42, 6, 18);
        band.rotateX(Math.PI / 2);
        band.translate(x, y, 0);
        gold.push(band);
      }
      const capital = new THREE.CylinderGeometry(3.1, 1.9, 4.2, 12);
      capital.translate(x, S.spring - 3.6, 0);
      gold.push(capital);
      const abacus = new THREE.BoxGeometry(6.6, 1.1, 6.6);
      abacus.translate(x, S.spring - 1.0, 0);
      iron.push(abacus);
      // the scroll bracket that carries a lantern over the path
      const s = Math.sign(S.xc - x);
      const arm = tubeAlong((u) => V(x + s * (1.5 + u * 8.6), 70.5 + Math.sin(u * Math.PI) * 0.8, 0), 6, 0.55);
      iron.push(arm);
      const scroll = tubeAlong((u) => {
        // from under the arm's end, curling back to the upright
        const a = u * Math.PI * 1.6;
        const r = 6.2 * (1 - u * 0.62);
        return V(x + s * (1.6 + r * (1 - Math.cos(a)) * 0.6 + u * 1.2), 70.5 - Math.sin(a) * r * 0.8 - u * 4, 0);
      }, 14, 0.36);
      iron.push(scroll);
      const hook = new THREE.TorusGeometry(0.8, 0.22, 5, 10);
      hook.translate(x + s * 10.1, 69.7, 0);
      gold.push(hook);
      // a C-scroll "ear" on the outer side of the upright's head, curling in
      // from the capital (outside the arch: the passage stays clear)
      {
        const C = V(x - s * 6.5, S.spring + 7.5, 0);
        const th0 = Math.atan2(-8.5, 6.5);
        iron.push(tubeAlong((u) => {
          const th = th0 - u * TAU * 1.25;
          const r = 10.7 * (1 - u * 0.75);
          return V(C.x + s * Math.cos(th) * r, C.y + Math.sin(th) * r, 0);
        }, 26, 0.45));
      }
    }
    // the twin rib: outer and inner arcs, laddered with rings
    const NR = 34;
    for (const dz of [-1.6, 1.6]) {
      iron.push(tubeAlong((u) => archPoint2(u, 0).setZ(dz), NR, 1.15, 7));
    }
    iron.push(tubeAlong((u) => archPoint2(u, 5.2), NR, 0.7, 6));
    for (let i = 1; i < 18; i++) {
      const u = i / 18;
      const a = archPoint2(u, 0), b = archPoint2(u, 5.2);
      const c = a.clone().lerp(b, 0.5);
      const ring = new THREE.TorusGeometry(2.0, 0.33, 5, 14);
      // the ring stands in the arch's plane
      ring.translate(c.x, c.y, 0);
      (i % 3 === 0 ? gold : iron).push(ring);
    }
    // cusps: small inward scallops hung from the inner rib
    for (let i = 1; i < 8; i++) {
      const u0 = (i - 0.5) / 8, u1 = (i + 0.5) / 8;
      if (Math.abs((u0 + u1) / 2 - 0.5) < 0.04) continue; // (the apex: the lantern's chain)
      iron.push(tubeAlong((u) => {
        const p = archPoint2(u0 + (u1 - u0) * u, 5.2);
        const q = archPoint2(u0 + (u1 - u0) * u, 0);
        const dirIn = p.clone().sub(q).normalize();
        return p.addScaledVector(dirIn, Math.sin(u * Math.PI) * 4.2);
      }, 8, 0.38, 5));
    }
    // the finial on the apex, a boss where the ribs meet
    const apex = archPoint2(0.5, 0);
    const finBall = new THREE.SphereGeometry(1.6, 12, 8); finBall.translate(apex.x, apex.y + 3.2, 0); gold.push(finBall);
    const spike = new THREE.ConeGeometry(0.8, 6.5, 8); spike.translate(apex.x, apex.y + 7.6, 0); gold.push(spike);
    const leaves = new THREE.ConeGeometry(2.4, 2.6, 8); leaves.rotateX(Math.PI); leaves.translate(apex.x, apex.y + 1.4, 0); gold.push(leaves);
    const boss = new THREE.SphereGeometry(1.5, 12, 8); boss.translate(apex.x, apex.y - 4.6, 0); gold.push(boss);
    const ironG = mergeGeometries(iron.map(flat));
    const goldG = mergeGeometries(gold.map(flat));
    const n = A.zs.length;
    const ironM = new THREE.InstancedMesh(ironG, mat.iron, n);
    const goldM = new THREE.InstancedMesh(goldG, mat.gold, n);
    A.zs.forEach((z, i) => {
      this.m4.makeTranslation(0, 0, z);
      ironM.setMatrixAt(i, this.m4);
      goldM.setMatrixAt(i, this.m4);
    });
    for (const m of [ironM, goldM]) { m.castShadow = true; m.receiveShadow = true; this.group.add(m); }
    this.archMeshes = [ironM, goldM];

    // climbing roses: up one upright or both, and along the rib (most arches)
    const roseArches = A.zs.filter((_, i) => i % 4 !== 2);
    const nPer = quality.tier === 'low' ? 14 : 24;
    const bloom = (() => {
      const parts = [];
      const pg = petalGeometry({ length: 2.4, width: 2.6, cup: 0.9, curl: 0.4, thickness: 0.08, segU: 4, segV: 3 }).geometry;
      for (let ring = 0; ring < 2; ring++) {
        const k = ring ? 3 : 5;
        for (let i = 0; i < k; i++) {
          const g = pg.clone();
          g.rotateX(ring ? 0.35 : 0.95);
          g.rotateY((i / k) * TAU + ring * 0.5);
          parts.push(g);
        }
      }
      return mergeGeometries(parts);
    })();
    const leaf = leafGeometry({ length: 4.6, width: 1.9, fold: 0.5, arch: 0.6, segU: 5, segV: 2 }).geometry;
    const roseM = new THREE.InstancedMesh(bloom, new THREE.MeshPhysicalMaterial({ color: '#efb6ad', roughness: 0.4, clearcoat: 1, side: THREE.DoubleSide, sheen: 0.4, sheenColor: new THREE.Color('#ffd8d0') }), roseArches.length * nPer);
    const leafM = new THREE.InstancedMesh(leaf, new THREE.MeshPhysicalMaterial({ color: '#4c6b3a', metalness: 0.65, roughness: 0.45, side: THREE.DoubleSide, clearcoat: 0.3 }), roseArches.length * nPer * 2);
    const vine = [];
    const q = new THREE.Quaternion(), s = V(), e = new THREE.Euler();
    let ri = 0, li = 0;
    roseArches.forEach((z, ai) => {
      // the climb: up an upright (spiralling), then over the rib
      const side = ai % 2 ? -1 : 1;
      const xUp = side > 0 ? S.x0 : S.x1;
      const climb = (u) => {
        // 0..0.5 up the upright, 0.5..1 along the rib toward the apex and a little past
        if (u < 0.5) {
          const k = u / 0.5;
          const a = k * TAU * 2.25;
          return V(xUp + Math.cos(a) * 2.4, CURB_TOP + 3 + k * (S.spring - CURB_TOP - 6), z + Math.sin(a) * 2.4);
        }
        const k = (u - 0.5) / 0.5;
        const p = archPoint2(side > 0 ? k * 0.62 : 1 - k * 0.62, 2.6);
        return p.setZ(z + Math.sin(k * 9) * 2.0);
      };
      vine.push(tubeAlong(climb, 40, 0.32, 4));
      for (let k = 0; k < nPer; k++) {
        const u = clamp(0.28 + 0.72 * Math.pow((k + rng.range(0.1, 0.9)) / nPer, 0.85));
        const p = climb(u).add(V(rng.range(-1.6, 1.6), rng.range(-1.2, 1.2), rng.range(-1.8, 1.8)));
        q.setFromEuler(e.set(rng.range(-1.2, 1.2), rng.range(0, TAU), rng.range(-1.2, 1.2)));
        this.m4.compose(p, q, s.setScalar(rng.range(0.75, 1.25)));
        roseM.setMatrixAt(ri++, this.m4);
        for (let j = 0; j < 2; j++) {
          const pl = climb(clamp(u + rng.range(-0.05, 0.05))).add(V(rng.range(-2.2, 2.2), rng.range(-2, 2), rng.range(-2.2, 2.2)));
          q.setFromEuler(e.set(rng.range(0, TAU), rng.range(0, TAU), 0));
          this.m4.compose(pl, q, s.setScalar(rng.range(0.7, 1.2)));
          leafM.setMatrixAt(li++, this.m4);
        }
      }
    });
    roseM.count = ri;
    leafM.count = li;
    const vineM = new THREE.Mesh(zeroSway(mergeGeometries(vine.map(flat))), new THREE.MeshStandardMaterial({ color: '#3b3a26', roughness: 0.7, metalness: 0.5 }));
    roseM.castShadow = leafM.castShadow = true;
    roseM.receiveShadow = leafM.receiveShadow = vineM.receiveShadow = true;
    swayMesh(roseM, 'rose');
    swayMesh(leafM, 'leaf');
    this.group.add(roseM, leafM, vineM);
    this.roseParts = [roseM, leafM, vineM];
    this.roseArches = roseArches.map((z, ai) => ({ z, x: ai % 2 ? S.x1 : S.x0 }));
  }

  update(t, ctx) {
    // the globes wake with the garden (the film), or as the interactive modes kindle them
    const col = this._c || (this._c = new THREE.Color());
    const wake = sseg(t, B.podsWake[0], B.podsWake[1]);
    const live = this.live;
    this.bollards.forEach((b, i) => {
      let g;
      if (live) g = live.bollard(b, i);
      else {
        const k = clamp((t - B.bloomWave[0] - b.delay) / 0.8);
        g = (1 - ctx.dawn * 0.6) * (0.25 * wake + 1.9 * k) * (0.96 + 0.04 * Math.sin(t * 1.7 + b.ph));
      }
      this.globeMesh.setColorAt(i, col.setRGB(1.0 * g + 0.05, 0.66 * g + 0.035, 0.38 * g + 0.02));
    });
    this.globeMesh.instanceColor.needsUpdate = true;
    // the fairy lights glow with the evening (a slow shimmer along each string)
    const fk = live ? live.bulbs(t) : (1 - ctx.dawn * 0.7) * clamp((t - B.bloomWave[0] - 2.5) / 2.5);
    this.bulbs.forEach((b, i) => {
      const g = 0.04 + fk * (0.9 + 0.35 * Math.sin(t * 1.3 + b.ph * TAU));
      this.bulbMesh.setColorAt(i, col.setRGB(g * 1.0, g * 0.66, g * 0.32));
    });
    this.bulbMesh.instanceColor.needsUpdate = true;
  }
}

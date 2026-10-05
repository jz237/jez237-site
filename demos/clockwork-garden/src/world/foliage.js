import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { leafGeometry, petalGeometry, taperedTube } from '../geometry/shapes.js';
import { RNG } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, lerp } from '../core/ease.js';
import { L } from './layout.js';
import { archPoint } from './greenhouse.js';

// Far-field lushness for the wide shots: leaves up every flower stem, foliage
// masses round the plant bases, a deep backdrop of foliage and potted palms
// along the glass walls, ivy climbing the iron columns and hanging in swags
// under the eaves, pink shrub roses near the path and glass lanterns hung
// from the vault. Everything is instanced with low-poly parts and per-instance
// colour (one material per part), so it adds layers of depth for a handful of
// draw calls; small far pieces do not cast shadows.

const TAU = Math.PI * 2;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

const GREENS = ['#7d8c40', '#5b7d4c', '#3f6a50', '#8e9c4a', '#6b7a36', '#46705a'];
const BRONZE = ['#b0803f', '#a8693a', '#c19a52'];

export class Foliage {
  constructor(mat, quality, flora) {
    this.group = new THREE.Group();
    this.group.name = 'foliage';
    const rng = new RNG('foliage');
    const density = quality.tier === 'low' ? 0.45 : quality.tier === 'med' ? 0.75 : 1;
    const H = L.house;
    this.m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion(), s = V(), e = new THREE.Euler(), col = new THREE.Color();
    const pick = (arr) => arr[Math.floor(rng.float() * arr.length)];
    const tint = (c, j = 0.08) => c.offsetHSL(rng.range(-0.015, 0.015), rng.range(-j, j), rng.range(-j, j));

    const leafMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0.7, roughness: 0.44, clearcoat: 0.3, clearcoatRoughness: 0.3, side: THREE.DoubleSide });
    this.leafMat = leafMat;
    const leaf = leafGeometry({ length: 7, width: 2.6, fold: 0.5, arch: 0.8, segU: 5, segV: 2, thickness: 0.05 }).geometry;
    const smallLeaf = leafGeometry({ length: 5, width: 3.0, fold: 0.35, arch: 0.4, segU: 3, segV: 2, thickness: 0.04 }).geometry; // ivy
    const inBed = (x, z) => Math.hypot(x, z) > 46 && (x < L.pathX[0] - 6 || x > L.pathX[1] + 6);
    const sightline = (x, z) => { // keep the closing camera's view of the hero flower clear (as flora does)
      const bx = 60, bz = 120;
      const tt = clamp((x * bx + z * bz) / (bx * bx + bz * bz));
      return Math.hypot(x - tt * bx, z - tt * bz) < 20 + tt * 10;
    };

    // ---- 1. leaves up every far-field stem (no more "blooms on poles") ------
    const stemLeaves = [];
    for (const f of flora.flowers) {
      const n = 4 + Math.floor(rng.float() * 4);
      const palette = f.ty.name === 'copperbloom' || f.ty.name === 'tulip' ? (rng.chance(0.4) ? BRONZE : GREENS) : GREENS;
      const base = palette[Math.floor(rng.float() * palette.length)];
      for (let k = 0; k < n; k++) {
        const hk = 0.06 + (k / n) * 0.6 + rng.range(-0.03, 0.03);
        q.setFromEuler(e.set(rng.range(0.55, 1.05), f.yaw + k * 2.39996, 0, 'YXZ'));
        s.setScalar(rng.range(1.8, 2.9) * f.scale * (1 - 0.35 * hk));
        this.m4.compose(f.base.clone().lerp(f.top, hk), q, s);
        stemLeaves.push([this.m4.clone(), tint(col.set(base)).clone()]);
      }
    }
    this.group.add(this._instanced(leaf, leafMat, stemLeaves, { cast: false }));

    // ---- 2. foliage masses: round the plant bases and between them ------------
    const fineLeaf = leafGeometry({ length: 7, width: 2.6, fold: 0.5, arch: 0.8, segU: 4, segV: 1, thickness: 0.05 }).geometry;
    const dome = (() => {
      const parts = [];
      const N = 56;
      for (let i = 0; i < N; i++) {
        const g = fineLeaf.clone();
        g.scale(0.62, 0.62, 0.62);
        if (i % 3 === 0) g.scale(1.3, 1.3, 1.3);
        const u = (i + 0.5) / N;
        const el = Math.acos(1 - u) * 0.95;
        const az = i * 2.39996;
        g.rotateX(-0.4 + el * 0.6);
        g.rotateY(az);
        const r = 6 * Math.sin(el + 0.25);
        g.translate(Math.sin(az) * r * 0.5, 6 * Math.cos(el) * 0.75 + 1, Math.cos(az) * r * 0.5);
        parts.push(g);
      }
      return mergeGeometries(parts);
    })();
    this.domeGeo = dome;
    const bushes = [];
    this.bushSpots = [];
    for (const f of flora.flowers) {
      if (!rng.chance(0.5)) continue;
      const x = f.base.x + rng.range(-3, 3), z = f.base.z + rng.range(-3, 3);
      if (!inBed(x, z) || sightline(x, z)) continue;
      const sc = rng.range(1.6, 2.8) * (0.7 + 0.3 * f.scale);
      bushes.push(this._bush(x, z, sc, rng, q, e, s, col, pick));
    }
    for (let i = 0; i < 90 * density; i++) {
      const left = rng.chance(0.6);
      const x = left ? rng.range(H.x0 + 30, L.pathX[0] - 8) : rng.range(L.pathX[1] + 8, H.x1 - 30);
      const z = lerp(H.z0 - 20, H.z1 + 40, Math.pow(rng.float(), 1.1));
      if (!inBed(x, z) || sightline(x, z)) continue;
      bushes.push(this._bush(x, z, rng.range(2.0, 3.6), rng, q, e, s, col, pick));
    }
    // a deep backdrop along the glass walls: tall, elongated masses
    for (const side of [-1, 1]) {
      const xw = side < 0 ? H.x0 + 26 : H.x1 - 26;
      for (let z = H.z0 - 10; z > H.z1 + 20; z -= rng.range(14, 22) / density) {
        const x = xw - side * rng.range(0, 18);
        q.setFromEuler(e.set(0, rng.range(0, TAU), 0));
        const sc = rng.range(3.0, 4.6);
        s.set(sc * rng.range(1.2, 1.7), sc * rng.range(1.1, 1.9), sc * rng.range(1.2, 1.7));
        this.m4.compose(V(x, -1, z), q, s);
        bushes.push([this.m4.clone(), tint(col.set(pick(GREENS)), 0.1).clone()]);
        this.bushSpots.push({ x, z, r: 6 * s.x * 0.5, h: 6 * s.y });
      }
    }
    this.group.add(this._instanced(dome, leafMat, bushes, { cast: true }));

    // ---- 3. pink shrub roses in the masses nearest the path -------------------
    const rose = (() => {
      const parts = [];
      const pg = petalGeometry({ length: 2.4, width: 2.6, cup: 0.9, curl: 0.4, thickness: 0.08, segU: 3, segV: 3 }).geometry;
      for (let ring = 0; ring < 2; ring++) {
        const n = ring ? 5 : 7;
        for (let i = 0; i < n; i++) {
          const g = pg.clone();
          g.rotateX(ring ? 0.4 : 0.9);
          g.rotateY((i / n) * TAU + ring * 0.4);
          parts.push(g);
        }
      }
      return mergeGeometries(parts);
    })();
    const roseMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.15, side: THREE.DoubleSide, sheen: 0.4, sheenColor: new THREE.Color('#ffe0d8') });
    const roses = [];
    const ROSE = ['#e7b3ad', '#f0c7bd', '#d99a9a', '#f3dccc'];
    for (const b of this.bushSpots) {
      const dPath = Math.min(Math.abs(b.x - L.pathX[0]), Math.abs(b.x - L.pathX[1]));
      if (dPath > 70 && !rng.chance(0.15)) continue;
      const n = Math.round((2 + rng.float() * 5) * density);
      for (let k = 0; k < n; k++) {
        const a = rng.range(0, TAU), el = rng.range(0.15, 1.2);
        const p = V(b.x + Math.sin(a) * Math.sin(el) * b.r, b.h * (0.35 + 0.6 * Math.cos(el)), b.z + Math.cos(a) * Math.sin(el) * b.r);
        q.setFromEuler(e.set(rng.range(-0.6, 0.6) + el * 0.6, a, rng.range(-0.4, 0.4), 'YXZ'));
        this.m4.compose(p, q, s.setScalar(rng.range(1.0, 1.7)));
        roses.push([this.m4.clone(), tint(col.set(pick(ROSE)), 0.05).clone()]);
      }
    }
    this.group.add(this._instanced(rose, roseMat, roses, { cast: false }));

    // ---- 4. ivy on the iron: dense garlands on vine stems that climb the
    //      columns, hang in swags under the eaves and creep up the arch ribs
    const ivy = [];
    const vines = [];
    const IVY = ['#5f7f40', '#6f8c46', '#4d6d3c', '#7e9a50', '#58783e'];
    const garland = (curve, { spacing = 2.4, spread = 1.6, sc = [1.2, 1.9], stem = 0.45, tendrils = 0 } = {}) => {
      const len = curve.getLength();
      const n = Math.round((len / spacing) * density);
      for (let k = 0; k < n; k++) {
        const u = (k + rng.float()) / n;
        const p = curve.getPointAt(Math.min(1, u)).add(V(rng.range(-spread, spread), rng.range(-spread, spread), rng.range(-spread, spread)));
        q.setFromEuler(e.set(rng.range(0.6, 2.4), rng.range(0, TAU), rng.range(-0.6, 0.6), 'YXZ'));
        this.m4.compose(p, q, s.setScalar(rng.range(sc[0], sc[1])));
        ivy.push([this.m4.clone(), tint(col.set(pick(IVY)), 0.07).clone()]);
      }
      if (stem) vines.push(new THREE.TubeGeometry(curve, Math.max(8, Math.round(len / 6)), stem, 4, false));
      for (let tdl = 0; tdl < tendrils; tdl++) {
        const p0 = curve.getPointAt(rng.range(0.15, 0.85));
        const L2 = rng.range(14, 42);
        const tc = new THREE.CatmullRomCurve3([p0, p0.clone().add(V(rng.range(-2, 2), -L2 * 0.5, rng.range(-2, 2))), p0.clone().add(V(rng.range(-3, 3), -L2, rng.range(-3, 3)))]);
        garland(tc, { spacing: 2.6, spread: 1.0, sc: [0.9, 1.4], stem: 0.3 });
      }
    };
    const colsX = [-118, 168];
    for (const cx of colsX) {
      for (let i = 0; i < 8; i++) {
        const cz = 150 - i * 150;
        if (cz < H.z1 + 10) continue;
        // two strands spiralling up the shaft
        const top = rng.range(160, 250);
        for (const ph of [0, Math.PI]) {
          const pts = [];
          for (let y = 2; y <= top; y += 6) { const a = ph + y * 0.04; pts.push(V(cx + Math.sin(a) * 4.6, y, cz + Math.cos(a) * 4.6)); }
          garland(new THREE.CatmullRomCurve3(pts), { spacing: 2.2, spread: 1.4 });
        }
        // a swag to the next column along the bed
        const nz = cz - 150;
        if (nz > H.z1 + 10) {
          const y0 = rng.range(160, 200), sag = rng.range(28, 46);
          const pts = [];
          for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(V(cx, y0 - Math.sin(Math.PI * u) * sag, lerp(cz, nz, u))); }
          garland(new THREE.CatmullRomCurve3(pts), { spacing: 2.0, spread: 2.0, tendrils: 3 });
        }
      }
    }
    for (const xw of [H.x0 + 11, H.x1 - 11]) {
      const inward = xw < 0 ? 1 : -1;
      for (let z = H.z0; z > H.z1 + 40; z -= 95) {
        // festoon under the eaves, one per bay
        const y0 = H.wall - 6, sag = rng.range(26, 44);
        const pts = [];
        for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(V(xw + inward * 2, y0 - Math.sin(Math.PI * u) * sag, z - u * 95)); }
        garland(new THREE.CatmullRomCurve3(pts), { spacing: 2.0, spread: 2.0, tendrils: 2 });
        // ivy creeping up most of the arch ribs from the eave
        if (rng.chance(0.75)) {
          const xs = xw < 0 ? H.x0 : H.x1;
          const reach = rng.range(0.12, 0.34) * (H.x1 - H.x0);
          const rib = [];
          for (let k = 0; k <= 12; k++) {
            const x = xs + inward * (k / 12) * reach;
            rib.push(V(x, archPoint(x, H) - 4, z));
          }
          rib.unshift(V(xs + inward * 1, H.wall - 60, z));
          garland(new THREE.CatmullRomCurve3(rib), { spacing: 2.3, spread: 2.2, tendrils: 2 });
        }
      }
    }
    this.group.add(this._instanced(smallLeaf, leafMat, ivy, { cast: false }));
    if (vines.length) {
      const vm = new THREE.Mesh(mergeGeometries(vines.map((g) => { g.deleteAttribute('uv'); return g; })), new THREE.MeshStandardMaterial({ color: '#3b3a26', roughness: 0.7, metalness: 0.5 }));
      vm.receiveShadow = true;
      this.group.add(vm);
    }

    // ---- 5. potted palms along the walls -------------------------------------
    const frond = (() => {
      const parts = [];
      const rachis = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 10, 6), V(0, 14, 16), V(0, 11, 26)]);
      parts.push(taperedTube(rachis, 0.45, 0.1, 10, 4));
      const leaflet = leafGeometry({ length: 7, width: 0.9, fold: 0.6, arch: 0.4, segU: 3, segV: 1, thickness: 0.04 }).geometry;
      for (let i = 2; i < 22; i++) {
        const k = i / 22;
        const p = rachis.getPointAt(k);
        for (const sd of [-1, 1]) {
          const g = leaflet.clone();
          const sc = 0.55 + Math.sin(Math.PI * k) * 0.6;
          g.scale(sc, sc, sc);
          g.rotateZ(-sd * 1.05);
          g.rotateX(0.9 + k * 0.9);
          g.translate(p.x, p.y, p.z);
          parts.push(g);
        }
      }
      return mergeGeometries(parts.map((x) => { x.deleteAttribute('uv'); return x.toNonIndexed(); }));
    })();
    const urnGeo = (() => {
      const pts = [[0, 0], [5, 0], [5.5, 1], [4, 3], [4.2, 4], [7.5, 9], [8.6, 14], [9.2, 15], [8.2, 15.5]].map(([r, y]) => new THREE.Vector2(r, y));
      return new THREE.LatheGeometry(pts, 18);
    })();
    const fronds = [], urns = [];
    const nPalm = Math.round(16 * density);
    for (let i = 0; i < nPalm; i++) {
      const side = i % 2 ? 1 : -1;
      const x = side < 0 ? H.x0 + rng.range(40, 70) : H.x1 - rng.range(40, 70);
      const z = lerp(H.z0 - 40, H.z1 + 80, (Math.floor(i / 2) + rng.range(0.1, 0.9)) / Math.ceil(nPalm / 2));
      const sc = rng.range(1.1, 1.7);
      this.m4.compose(V(x, 0, z), q.identity(), s.setScalar(sc));
      urns.push([this.m4.clone(), col.set(rng.chance(0.5) ? '#b8955a' : '#9c8a76').clone()]);
      (this.palmSpots ??= []).push({ x, z, sc });
      const nf = 9 + Math.floor(rng.float() * 4);
      for (let k = 0; k < nf; k++) {
        q.setFromEuler(e.set(rng.range(-0.25, 0.35), (k / nf) * TAU + rng.range(-0.2, 0.2), rng.range(-0.1, 0.1), 'YXZ'));
        this.m4.compose(V(x, 14 * sc, z), q, s.setScalar(sc * rng.range(1.2, 1.7)));
        fronds.push([this.m4.clone(), tint(col.set(pick(GREENS)), 0.08).clone()]);
      }
    }
    this.group.add(this._instanced(frond, leafMat, fronds, { cast: true }));
    this.group.add(this._instanced(urnGeo, new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0.85, roughness: 0.4 }), urns, { cast: true }));

    // ---- 6. glass lanterns hung from the vault ---------------------------------
    // a hexagonal Victorian lantern: brass cap, finial, ribs and base, a glass
    // body and an amber flame; on a long chain from the iron above
    const lanternFrame = (() => {
      const parts = [];
      const cap = new THREE.ConeGeometry(3.2, 2.6, 6); cap.translate(0, 5.6, 0); parts.push(cap);
      const fin = new THREE.SphereGeometry(0.7, 8, 6); fin.translate(0, 7.3, 0); parts.push(fin);
      const ring = new THREE.TorusGeometry(0.8, 0.18, 5, 12); ring.translate(0, 8.4, 0); parts.push(ring);
      const base = new THREE.CylinderGeometry(2.7, 1.6, 1.2, 6); base.translate(0, -4.2, 0); parts.push(base);
      const drop = new THREE.ConeGeometry(1.0, 2.2, 6); drop.rotateX(Math.PI); drop.translate(0, -5.8, 0); parts.push(drop);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * TAU;
        const rib = new THREE.BoxGeometry(0.35, 8.6, 0.35);
        rib.translate(Math.cos(a) * 2.75, 0.4, Math.sin(a) * 2.75);
        parts.push(rib);
      }
      return mergeGeometries(parts.map((x) => { x.deleteAttribute('uv'); return x.toNonIndexed(); }));
    })();
    const lanternGlass = new THREE.CylinderGeometry(2.6, 2.3, 8.2, 6, 1, true);
    lanternGlass.translate(0, 0.3, 0);
    const flame = new THREE.SphereGeometry(1.5, 10, 8);
    flame.scale(1, 1.5, 1);
    const chain = new THREE.CylinderGeometry(0.22, 0.22, 1, 4);
    chain.translate(0, 0.5, 0);
    const frames = [], glasses = [], chains = [];
    this.lanterns = [];
    const nLan = Math.round(26 * density);
    for (let i = 0; i < nLan; i++) {
      // half over the path, half over the beds; heights layered for depth
      const overPath = i % 2 === 0;
      const x = overPath ? lerp(L.pathX[0] + 6, L.pathX[1] - 6, rng.float()) : (rng.chance(0.5) ? rng.range(H.x0 + 60, L.pathX[0] - 30) : rng.range(L.pathX[1] + 30, H.x1 - 60));
      const z = lerp(H.z0 - 30, H.z1 + 120, (i + rng.range(0, 1)) / nLan);
      if (Math.hypot(x, z) < 70) continue;
      const y = rng.range(105, 205);
      const sc = rng.range(1.3, 1.9);
      const p = V(x, y, z);
      this.m4.compose(p, q.setFromEuler(e.set(0, rng.range(0, TAU), 0)), s.setScalar(sc));
      frames.push([this.m4.clone(), col.set('#d6ad5e').clone()]);
      glasses.push([this.m4.clone(), col.set('#fff3dc').clone()]);
      const top = archPoint(x, H) - 2;
      this.m4.compose(V(x, y + 8.4 * sc, z), q.identity(), s.set(1, Math.max(1, top - (y + 8.4 * sc)), 1));
      chains.push([this.m4.clone(), col.set('#3a3a34').clone()]);
      this.lanterns.push({ p, sc, delay: (Math.hypot(x, z) / 780) * 6.0 + rng.range(0, 0.6), ph: rng.range(0, TAU) });
    }
    this.group.add(this._instanced(lanternFrame, mat.gold.clone(), frames, { cast: false, noColor: true }));
    const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.06, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1, envMapIntensity: 1.3 });
    const gl = this._instanced(lanternGlass, glassMat, glasses, { cast: false });
    gl.renderOrder = 2;
    this.group.add(gl);
    this.group.add(this._instanced(chain, mat.iron, chains, { cast: false, noColor: true }));
    this.flames = new THREE.InstancedMesh(flame, new THREE.MeshBasicMaterial({ color: '#ffffff' }), this.lanterns.length);
    this.lanterns.forEach((l, i) => {
      this.m4.compose(l.p, q.identity(), s.setScalar(l.sc));
      this.flames.setMatrixAt(i, this.m4);
      this.flames.setColorAt(i, col.setRGB(0.05, 0.03, 0.01));
    });
    this.group.add(this.flames);
  }

  _bush(x, z, sc, rng, q, e, s, col, pick) {
    q.setFromEuler(e.set(0, rng.range(0, TAU), 0));
    s.set(sc * rng.range(0.9, 1.3), sc * rng.range(0.8, 1.3), sc * rng.range(0.9, 1.3));
    this.m4.compose(V(x, -1, z), q, s);
    this.bushSpots.push({ x, z, r: 6 * s.x * 0.5, h: 6 * s.y });
    return [this.m4.clone(), col.set(pick(GREENS)).offsetHSL(rng.range(-0.015, 0.015), rng.range(-0.08, 0.08), rng.range(-0.08, 0.08)).clone()];
  }

  _instanced(geo, material, list, { cast = false, noColor = false } = {}) {
    const im = new THREE.InstancedMesh(geo, material, Math.max(1, list.length));
    list.forEach(([m, c], i) => {
      im.setMatrixAt(i, m);
      if (!noColor) im.setColorAt(i, c);
    });
    im.count = list.length;
    im.castShadow = cast;
    im.receiveShadow = true;
    im.computeBoundingSphere();
    return im;
  }

  update(t) {
    // lanterns kindle as the bloom wave passes beneath them, then flicker softly
    const col = new THREE.Color();
    const w0 = B.bloomWave[0];
    this.lanterns.forEach((l, i) => {
      const k = clamp((t - w0 - l.delay) / 0.8);
      const g = this.live ? this.live.lantern(l, i, t) : 0.08 + k * (3.2 + 0.25 * Math.sin(t * 7 + l.ph) + 0.15 * Math.sin(t * 13.3 + l.ph * 2));
      this.flames.setColorAt(i, col.setRGB(g, g * 0.6, g * 0.24));
    });
    this.flames.instanceColor.needsUpdate = true;
  }
}

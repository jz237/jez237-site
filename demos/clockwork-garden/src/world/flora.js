import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { petalGeometry, leafGeometry, taperedTube } from '../geometry/shapes.js';
import { RNG } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, smoother, sseg, lerp } from '../core/ease.js';
import { L } from './layout.js';
import { swayMesh, zeroSway, pivotParts, wholeFlex, bendAngle, washAt, gust } from './wind.js';
import { leafDome } from './dome.js';

// The far-field ecosystem: several hundred simpler mechanical plants built
// from the same parts as the hero pieces, instanced for smooth wide shots.
// They wake in a wave that radiates from the hero flower during the reveal.

const TAU = Math.PI * 2;
// brass stems: [gust bend, sway, sway freq, -] (radians) and the wash gain
const STEM_K = [0.011, 0.006, 1.25, 0];
const STEM_WASH = 0.03;
const ORB_K = [0.016, 0.01, 1.6, 0];

export class Flora {
  constructor(mat, quality) {
    this.group = new THREE.Group();
    this.group.name = 'flora';
    const rng = new RNG('flora');
    const H = L.house;
    const density = quality.tier === 'low' ? 0.5 : quality.tier === 'med' ? 0.75 : 1;
    this.m4 = new THREE.Matrix4();

    // ---- planting positions ----------------------------------------------
    const keepOut = [
      { p: new THREE.Vector3(0, 0, 0), r: 46 },
      { p: L.songbirdTree, r: 22 },
    ];
    const spots = [];
    const grid = new Map();
    const cell = 12;
    const key = (x, z) => `${Math.floor(x / cell)},${Math.floor(z / cell)}`;
    const near = (x, z, gap) => {
      const cx = Math.floor(x / cell), cz = Math.floor(z / cell);
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
        const list = grid.get(`${cx + i},${cz + j}`);
        if (list) for (const o of list) if (Math.hypot(o.x - x, o.z - z) < gap) return true;
      }
      return false;
    };
    const N = Math.round(620 * density);
    let guard = 0;
    while (spots.length < N && guard++ < N * 40) {
      const left = rng.chance(0.6);
      const x = left ? rng.range(H.x0 + 22, L.pathX[0] - 9) : rng.range(L.pathX[1] + 9, H.x1 - 22);
      const zt = Math.pow(rng.float(), 1.15);
      const z = lerp(H.z0 - 25, H.z1 + 50, zt);
      if (keepOut.some((k) => Math.hypot(x - k.p.x, z - k.p.z) < k.r)) continue;
      // keep a sightline from the closing camera position to the hero flower
      { const ax = 0, az = 0, bx = 60, bz = 120; const tt = clamp(((x - ax) * (bx - ax) + (z - az) * (bz - az)) / ((bx - ax) ** 2 + (bz - az) ** 2));
        if (Math.hypot(x - (ax + tt * (bx - ax)), z - (az + tt * (bz - az))) < 20 + tt * 10) continue; }
      const gap = 13 + zt * 8;
      if (near(x, z, gap)) continue;
      const s = { x, z, zt };
      spots.push(s);
      const k = key(x, z);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(s);
    }
    this.spots = spots;

    // ---- flower types ---------------------------------------------------------
    const roseMat = new THREE.MeshPhysicalMaterial({ color: '#e0aaa4', roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide, sheen: 0.5, sheenColor: new THREE.Color('#ffd8d0') });
    const types = [
      { name: 'tulip', petals: 6, len: 10, width: 6.6, cup: 1.4, mat: mat.brass, closed: -0.15, open: 0.62, h: [24, 46], stemMat: mat.brassAged, w: 1.0 },
      { name: 'lily', petals: 6, len: 13, width: 5.2, cup: 1.0, mat: mat.porcelain, closed: -0.2, open: 1.2, h: [30, 66], stemMat: mat.brass, w: 1.0 },
      { name: 'rose', petals: 9, len: 7.5, width: 7.0, cup: 1.5, mat: roseMat, closed: -0.3, open: 0.55, h: [16, 34], stemMat: mat.copperAged, w: 0.9 },
      { name: 'copperbloom', petals: 11, len: 9, width: 3.0, cup: 0.6, mat: mat.copper, closed: -0.1, open: 1.4, h: [14, 30], stemMat: mat.copperAged, w: 0.8 },
    ];
    this.types = types;
    const stemGeo = new THREE.CylinderGeometry(0.32, 0.5, 1, 7, 1);
    stemGeo.translate(0, 0.5, 0);
    const calyxGeo = new THREE.SphereGeometry(1, 12, 8, 0, TAU, Math.PI * 0.45, Math.PI * 0.55);
    for (const ty of types) {
      ty.geo = petalGeometry({ length: ty.len, width: ty.width, cup: ty.cup, curl: 0.45, thickness: 0.12, segU: 8, segV: 7, tip: 0.5 }).geometry;
      ty.list = [];
    }
    this.flowers = [];
    const totalW = types.reduce((a, t) => a + t.w, 0);
    for (const sp of spots) {
      let r = rng.float() * totalW, ty = types[0];
      for (const t of types) { if ((r -= t.w) <= 0) { ty = t; break; } }
      const nearCam = clamp(1 - Math.hypot(sp.x - 40, sp.z - 80) / 160);
      const h = rng.range(ty.h[0], ty.h[1]) * (1.0 - 0.45 * nearCam);
      const lean = new THREE.Vector3(rng.range(-0.12, 0.12), 1, rng.range(-0.12, 0.12)).normalize();
      const scale = rng.range(0.85, 1.3);
      const f = {
        ty,
        base: new THREE.Vector3(sp.x, 0, sp.z),
        top: new THREE.Vector3(sp.x, 0, sp.z).addScaledVector(lean, h),
        dir: lean,
        yaw: rng.range(0, TAU),
        scale,
        // the wave front travels outward from the hero flower
        delay: (Math.hypot(sp.x, sp.z) / 780) * 6.0 + rng.range(-0.3, 0.3),
        sway: rng.range(0, TAU),
      };
      ty.list.push(f);
      this.flowers.push(f);
    }
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    this.inst = [];
    for (const ty of types) {
      const n = ty.list.length;
      const stems = new THREE.InstancedMesh(stemGeo, ty.stemMat, n);
      const petals = new THREE.InstancedMesh(ty.geo, ty.mat, n * ty.petals);
      const calyx = new THREE.InstancedMesh(calyxGeo, mat.gold, n);
      ty.list.forEach((f, i) => {
        const d = f.top.clone().sub(f.base);
        q.setFromUnitVectors(up, d.clone().normalize());
        s.set(f.scale, d.length(), f.scale);
        this.m4.compose(f.base, q, s);
        stems.setMatrixAt(i, this.m4);
        s.setScalar(1.7 * f.scale);
        this.m4.compose(f.top, q, s);
        calyx.setMatrixAt(i, this.m4);
      });
      for (const m of [stems, petals, calyx]) { m.castShadow = true; m.receiveShadow = true; }
      (this.smallCalyx ??= []).push(calyx);
      this.group.add(stems, petals, calyx);
      swayMesh(petals, 'petal', { clone: true });
      this.inst.push({ ty, petals, stems, calyx });
    }

    // ---- leaves: clusters at each plant base, plus large elephant-ear leaves -
    const leaf = leafGeometry({ length: 7, width: 2.6, fold: 0.5, arch: 0.8, segU: 10, segV: 4, thickness: 0.05 }).geometry;
    const leafMats = [
      new THREE.MeshPhysicalMaterial({ color: '#6d7b37', metalness: 0.8, roughness: 0.42, side: THREE.DoubleSide, clearcoat: 0.3 }),
      new THREE.MeshPhysicalMaterial({ color: '#3d6a51', metalness: 0.6, roughness: 0.46, side: THREE.DoubleSide, clearcoat: 0.3 }),
      new THREE.MeshPhysicalMaterial({ color: '#a7763c', metalness: 0.9, roughness: 0.36, side: THREE.DoubleSide }),
      new THREE.MeshPhysicalMaterial({ color: '#2f5446', metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide }),
    ];
    const leafLists = leafMats.map(() => []);
    this.leafMats = leafMats;
    const e = new THREE.Euler();
    for (const f of this.flowers) {
      const n = 4 + Math.floor(rng.float() * 4);
      f.leaves = [];
      for (let k = 0; k < n; k++) {
        const li = Math.floor(rng.float() * leafMats.length);
        const pitch = rng.range(0.5, 1.25), yaw = rng.range(0, TAU);
        q.setFromEuler(e.set(pitch, yaw, 0, 'YXZ'));
        const sc = rng.range(1.6, 3.0) * f.scale;
        s.setScalar(sc);
        const y = rng.range(0, 6);
        this.m4.compose(new THREE.Vector3(f.base.x, y, f.base.z), q, s);
        f.leaves.push({ li, idx: leafLists[li].length, y, pitch, yaw, sc, base: true });
        leafLists[li].push(this.m4.clone());
      }
      // stem leaves partway up
      for (let k = 0; k < 2; k++) {
        const li = Math.floor(rng.float() * 2);
        const hk = rng.range(0.25, 0.6);
        const pitch = rng.range(0.8, 1.2), yaw = rng.range(0, TAU);
        q.setFromEuler(e.set(pitch, yaw, 0, 'YXZ'));
        const sc = rng.range(1.0, 1.7) * f.scale;
        s.setScalar(sc);
        this.m4.compose(f.base.clone().lerp(f.top, hk), q, s);
        f.leaves.push({ li, idx: leafLists[li].length, hk, pitch, yaw, sc });
        leafLists[li].push(this.m4.clone());
      }
    }
    // elephant ears along bed edges near the path and front of house
    for (let i = 0; i < 110 * density; i++) {
      const left = rng.chance(0.55);
      const x = left ? rng.range(L.pathX[0] - 40, L.pathX[0] - 8) : rng.range(L.pathX[1] + 8, L.pathX[1] + 45);
      const z = rng.range(H.z0 - 40, H.z1 + 60);
      if (Math.hypot(x, z) < 48) continue;
      const li = rng.chance(0.5) ? 0 : 3;
      const pitch = rng.range(0.6, 1.1), yaw = rng.range(0, TAU);
      q.setFromEuler(e.set(pitch, yaw, 0, 'YXZ'));
      const sc = rng.range(4.0, 6.5);
      s.setScalar(sc);
      const y = rng.range(0, 3);
      this.m4.compose(new THREE.Vector3(x, y, z), q, s);
      (this.ears ??= []).push({ li, idx: leafLists[li].length, x, y, z, pitch, yaw, sc });
      leafLists[li].push(this.m4.clone());
    }
    this.smallCasters = [];
    this.leafGeo = leaf;
    this.leafMeshes = [];
    leafLists.forEach((list, li) => {
      const im = new THREE.InstancedMesh(leaf, leafMats[li], list.length);
      this.leafMeshes.push(im);
      this.smallCasters.push(im);
      list.forEach((mm, i) => im.setMatrixAt(i, mm));
      im.castShadow = true;
      im.receiveShadow = true;
      swayMesh(im, 'leaf');
      this.group.add(im);
    });

    // ---- ferns: brass fronds of paired leaflets ---------------------------
    const frond = (() => {
      const parts = [];
      const rachis = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 6, 3), new THREE.Vector3(0, 9, 9), new THREE.Vector3(0, 8, 15)]);
      parts.push(zeroSway(taperedTube(rachis, 0.25, 0.06, 10, 4)));
      // low-poly leaflets: the fronds are only ever seen at a distance
      const leaflet = leafGeometry({ length: 3.2, width: 0.9, fold: 0.3, arch: 0.3, segU: 3, segV: 1, thickness: 0.04 }).geometry;
      for (let i = 1; i < 18; i++) {
        const k = i / 18;
        const p = rachis.getPointAt(k);
        const tg = rachis.getTangentAt(k);
        for (const sd of [-1, 1]) {
          const g = leaflet.clone();
          const sc = (1 - k * 0.75);
          g.scale(sc, sc, sc);
          g.rotateZ(-sd * 1.2);
          g.rotateX(Math.atan2(tg.z, tg.y) * 0.8);
          g.translate(p.x, p.y, p.z);
          parts.push(g);
        }
      }
      return wholeFlex(mergeGeometries(parts.map((x) => { x.deleteAttribute('uv'); return x.toNonIndexed(); })), 17, 1.5);
    })();
    const fernCount = Math.round(170 * density);
    const ferns = new THREE.InstancedMesh(frond, new THREE.MeshPhysicalMaterial({ color: '#5f7a3a', metalness: 0.75, roughness: 0.4, side: THREE.DoubleSide }), fernCount * 5);
    this.fernMesh = ferns;
    let fi = 0;
    for (let i = 0; i < fernCount; i++) {
      const sp = spots[Math.floor(rng.float() * spots.length)];
      const cx = sp.x + rng.range(-6, 6), cz = sp.z + rng.range(-6, 6);
      const fronds = [];
      for (let k = 0; k < 5; k++) {
        const yaw = rng.range(0, TAU);
        q.setFromEuler(e.set(0, yaw, 0));
        const sc = rng.range(0.9, 1.6);
        s.setScalar(sc);
        this.m4.compose(new THREE.Vector3(cx, 0, cz), q, s);
        fronds.push({ i: fi, yaw, sc });
        ferns.setMatrixAt(fi++, this.m4);
      }
      (this.fernSpots ??= []).push({ x: cx, z: cz, fronds });
    }
    ferns.count = fi;
    ferns.castShadow = true;
    ferns.receiveShadow = true;
    swayMesh(ferns, 'fern');
    this.group.add(ferns);

    // ---- seed lanterns: glass orbs on stalks that light with the wave --------
    const orbN = Math.round(160 * density);
    this.orbs = [];
    const orbGeo = new THREE.SphereGeometry(1.6, 12, 8);
    const orbStem = new THREE.CylinderGeometry(0.18, 0.25, 1, 5);
    orbStem.translate(0, 0.5, 0);
    this.orbMesh = new THREE.InstancedMesh(orbGeo, new THREE.MeshBasicMaterial({ color: '#ffffff' }), orbN);
    const orbStems = new THREE.InstancedMesh(orbStem, mat.copperAged, orbN);
    this.orbStems = orbStems;
    const col = new THREE.Color();
    for (let i = 0; i < orbN; i++) {
      const sp = spots[Math.floor(rng.float() * spots.length)];
      const p = new THREE.Vector3(sp.x + rng.range(-5, 5), rng.range(10, 30), sp.z + rng.range(-5, 5));
      this.m4.compose(p, q.identity(), s.setScalar(rng.range(0.6, 1.1)));
      this.orbMesh.setMatrixAt(i, this.m4);
      this.m4.compose(new THREE.Vector3(p.x, 0, p.z), q.identity(), s.set(1, p.y, 1));
      orbStems.setMatrixAt(i, this.m4);
      this.orbMesh.setColorAt(i, col.setRGB(0.05, 0.03, 0.01));
      this.orbs.push({ delay: (Math.hypot(p.x, p.z) / 780) * 6.0 + rng.range(0, 0.6), ph: rng.range(0, TAU), base: p.clone(), sc: s.x });
    }
    this.group.add(this.orbMesh, orbStems);

    this.smallCasters.push(...this.smallCalyx);
    this._buildShrubs(mat, rng, density);
    this._buildArch(mat, rng);
    this._buildFountain(mat);
  }

  // mounded shrubs of metal leaves: mid-height mass between the blooms
  _buildShrubs(mat, rng, density) {
    const leaf = leafGeometry({ length: 4.5, width: 1.9, fold: 0.5, arch: 0.6, segU: 6, segV: 3, thickness: 0.05 }).geometry;
    const dome = leafDome(leaf, 46); // denser at the top; relaxed so no leaf cuts another
    const mats = [
      new THREE.MeshPhysicalMaterial({ color: '#6b7a36', metalness: 0.8, roughness: 0.42, side: THREE.DoubleSide, clearcoat: 0.3 }),
      new THREE.MeshPhysicalMaterial({ color: '#3a6650', metalness: 0.55, roughness: 0.48, side: THREE.DoubleSide, clearcoat: 0.3 }),
      new THREE.MeshPhysicalMaterial({ color: '#9b6a38', metalness: 0.9, roughness: 0.36, side: THREE.DoubleSide }),
    ];
    const lists = mats.map(() => []);
    this.shrubMats = mats;
    const q = new THREE.Quaternion(), s = new THREE.Vector3(), e = new THREE.Euler();
    const n = Math.round(170 * density);
    for (let i = 0; i < n; i++) {
      const sp = this.spots[Math.floor(rng.float() * this.spots.length)];
      const x = sp.x + rng.range(-7, 7), z = sp.z + rng.range(-7, 7);
      if (Math.hypot(x, z) < 44) continue;
      if (x > L.pathX[0] - 6 && x < L.pathX[1] + 6) continue;
      const yaw = rng.range(0, TAU);
      q.setFromEuler(e.set(0, yaw, 0));
      const sc = rng.range(0.9, 2.3);
      s.set(sc * rng.range(0.9, 1.3), sc * rng.range(0.7, 1.15), sc * rng.range(0.9, 1.3));
      this.m4.compose(new THREE.Vector3(x, -1, z), q, s);
      const li = Math.floor(rng.float() * mats.length);
      (this.shrubSpots ??= []).push({ x, z, r: 3 * s.x, h: 5.5 * s.y, y0: -1, yaw, sx: s.x, sy: s.y, sz: s.z, li, k: lists[li].length });
      lists[li].push(this.m4.clone());
    }
    this.shrubMeshes = [];
    this.shrubGeo = dome;
    lists.forEach((list, i) => {
      const im = new THREE.InstancedMesh(dome, mats[i], list.length);
      this.shrubMeshes.push(im);
      list.forEach((m, k) => im.setMatrixAt(k, m));
      im.castShadow = true;
      im.receiveShadow = true;
      swayMesh(im, 'dome');
      this.group.add(im);
    });
  }

  // iron rose arch over the path, smothered in porcelain roses
  _buildArch(mat, rng) {
    const z = -250;
    const x0 = L.pathX[0] - 6, x1 = L.pathX[1] + 6;
    const xc = (x0 + x1) / 2, hw = (x1 - x0) / 2;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI;
      const x = xc - Math.cos(a) * hw;
      const y = a < 0.001 || a > Math.PI - 0.001 ? 0 : 0;
      pts.push(new THREE.Vector3(x, 70 + Math.sin(a) * hw * 0.9, z));
    }
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(x0, 0, z), ...pts, new THREE.Vector3(x1, 0, z)], false, 'centripetal', 0.2);
    for (const dz of [-6, 6]) {
      const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 1.3, 6, false), mat.iron);
      m.position.z = dz;
      m.castShadow = true;
      this.group.add(m);
    }
    // roses along the arch (instanced little blooms)
    const bloom = (() => {
      const parts = [];
      const pg = petalGeometry({ length: 2.4, width: 2.6, cup: 0.9, curl: 0.4, thickness: 0.08, segU: 5, segV: 5 }).geometry;
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
    const roses = new THREE.InstancedMesh(bloom, new THREE.MeshPhysicalMaterial({ color: '#e7b3ad', roughness: 0.4, clearcoat: 1, side: THREE.DoubleSide, sheen: 0.4 }), 140);
    const leaves = new THREE.InstancedMesh(leafGeometry({ length: 5, width: 2, fold: 0.5, arch: 0.6, segU: 6, segV: 3 }).geometry, new THREE.MeshPhysicalMaterial({ color: '#4f6d3c', metalness: 0.7, roughness: 0.45, side: THREE.DoubleSide }), 260);
    const q = new THREE.Quaternion(), s = new THREE.Vector3(), e = new THREE.Euler();
    for (let i = 0; i < 140; i++) {
      const p = curve.getPointAt(rng.range(0.03, 0.97)).add(new THREE.Vector3(rng.range(-3, 3), rng.range(-3, 3), rng.range(-8, 8)));
      q.setFromEuler(e.set(rng.range(-1, 1), rng.range(0, TAU), rng.range(-1, 1)));
      this.m4.compose(p, q, s.setScalar(rng.range(0.8, 1.5)));
      roses.setMatrixAt(i, this.m4);
    }
    for (let i = 0; i < 260; i++) {
      const p = curve.getPointAt(rng.range(0.0, 1.0)).add(new THREE.Vector3(rng.range(-4, 4), rng.range(-4, 4), rng.range(-9, 9)));
      q.setFromEuler(e.set(rng.range(0, TAU), rng.range(0, TAU), 0));
      this.m4.compose(p, q, s.setScalar(rng.range(0.8, 1.4)));
      leaves.setMatrixAt(i, this.m4);
    }
    roses.castShadow = leaves.castShadow = true;
    swayMesh(roses, 'rose');
    swayMesh(leaves, 'leaf');
    this.group.add(roses, leaves);
    this.archParts = [roses, leaves];
  }

  // fountain with a slowly turning armillary sphere where the path ends
  _buildFountain(mat) {
    const xc = (L.pathX[0] + L.pathX[1]) / 2;
    const z = -560;
    const g = new THREE.Group();
    g.position.set(xc, 0, z);
    const stone = new THREE.MeshStandardMaterial({ color: '#a39782', roughness: 0.8 });
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(46, 50, 10, 48, 1, true), stone);
    basin.position.y = 5;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(47, 2.4, 8, 64), stone);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 10;
    const water = new THREE.Mesh(new THREE.CircleGeometry(46, 48), new THREE.MeshPhysicalMaterial({ color: '#1d3a38', roughness: 0.05, metalness: 0.1, clearcoat: 1 }));
    water.rotation.x = -Math.PI / 2;
    water.position.y = 7.5;
    const column = new THREE.Mesh(new THREE.CylinderGeometry(4, 7, 60, 16), stone);
    column.position.y = 30;
    g.add(basin, rim, water, column);
    // armillary: three gilded rings on gimbals around a glowing sphere
    const arm = new THREE.Group();
    arm.position.y = 86;
    this.armRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(22 - i * 3, 0.9, 8, 72), mat.gold);
      const holder = new THREE.Group();
      holder.add(ring);
      arm.add(holder);
      this.armRings.push(holder);
    }
    const band = new THREE.Mesh(new THREE.TorusGeometry(24, 1.6, 8, 72), mat.brass);
    band.rotation.x = Math.PI / 2;
    band.rotation.y = 0.4;
    arm.add(band);
    this.armCore = new THREE.Mesh(new THREE.SphereGeometry(6, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffb257' }));
    arm.add(this.armCore);
    g.add(arm);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.group.add(g);
  }

  update(t, ctx) {
    const q = this._q || (this._q = new THREE.Quaternion());
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const ang = this._ang || (this._ang = new THREE.Vector3());
    const wv = this._wv || (this._wv = new THREE.Vector3());
    const d = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), qs = new THREE.Quaternion();
    const wave0 = B.bloomWave[0];
    const live = this.live; // interactive modes: per-flower openness / glow
    for (const { ty, petals, stems, calyx } of this.inst) {
      let idx = 0;
      ty.list.forEach((f, fi) => {
        // heavy brass stems barely move: the head rides a slow lean with the
        // gusts, and a passing bee's wash nudges it aside
        const h = f.top.y - f.base.y;
        bendAngle(f.base.x, f.base.z, t, STEM_K, f.sway, ang);
        washAt(f.top, wv);
        ang.addScaledVector(wv, STEM_WASH);
        const hold = live?.hold ? live.hold(f) : 1;
        f.headOff ??= new THREE.Vector3();
        f.headOff.set(ang.x * h * hold, 0, ang.z * h * hold);
        f.topNow ??= f.top.clone();
        f.topNow.copy(f.top).add(f.headOff);
        d.subVectors(f.topNow, f.base);
        qs.setFromUnitVectors(up, s.copy(d).normalize());
        s.set(f.scale, d.length(), f.scale);
        this.m4.compose(f.base, qs, s);
        stems.setMatrixAt(fi, this.m4);
        s.setScalar(1.7 * f.scale);
        this.m4.compose(f.topNow, qs, s);
        calyx.setMatrixAt(fi, this.m4);
        const k = live ? live.open(f, t) : smoother(clamp((t - wave0 - f.delay) / 1.8));
        const sway = Math.sin(t * 0.9 + f.sway) * 0.02 - (gust(f.base.x, f.base.z, t) - 0.3) * 0.035;
        for (let i = 0; i < ty.petals; i++) {
          const phi = f.yaw + (i / ty.petals) * TAU;
          // (wide open stops just below horizontal: petals never sweep down into the leaves)
          e.set(Math.min(1.75, lerp(ty.closed, ty.open, k) + sway), Math.PI / 2 - phi, 0, 'YXZ');
          q.setFromEuler(e);
          p.set(Math.cos(phi) * 1.2 * f.scale, 0, Math.sin(phi) * 1.2 * f.scale).add(f.topNow);
          s.setScalar(f.scale);
          this.m4.compose(p, q, s);
          petals.setMatrixAt(idx++, this.m4);
        }
      });
      petals.instanceMatrix.needsUpdate = true;
      stems.instanceMatrix.needsUpdate = true;
      calyx.instanceMatrix.needsUpdate = true;
    }
    // seed lanterns nod on their copper stalks
    this.orbs.forEach((o, i) => {
      bendAngle(o.base.x, o.base.z, t, ORB_K, o.ph, ang);
      const h = o.base.y;
      p.set(o.base.x + ang.x * h, o.base.y, o.base.z + ang.z * h);
      o.now ??= new THREE.Vector3();
      o.now.copy(p);
      this.m4.compose(p, q.identity(), s.setScalar(o.sc));
      this.orbMesh.setMatrixAt(i, this.m4);
      d.set(p.x - o.base.x, h, p.z - o.base.z);
      qs.setFromUnitVectors(up, s.copy(d).normalize());
      this.m4.compose(s.set(o.base.x, 0, o.base.z), qs, new THREE.Vector3(1, d.length(), 1));
      this.orbStems.setMatrixAt(i, this.m4);
    });
    this.orbMesh.instanceMatrix.needsUpdate = true;
    this.orbStems.instanceMatrix.needsUpdate = true;
    // seed lanterns light with the wave and keep a gentle pulse
    const col = new THREE.Color();
    this.orbs.forEach((o, i) => {
      const k = clamp((t - wave0 - o.delay) / 0.8);
      const flare = k > 0 ? Math.exp(-(t - wave0 - o.delay) * 1.5) : 0;
      const g = live ? live.orb(o, i, t) : 0.04 + k * (0.9 + 0.15 * Math.sin(t * 2 + o.ph)) + flare * 1.5;
      this.orbMesh.setColorAt(i, col.setRGB(g, g * 0.62, g * 0.27));
    });
    this.orbMesh.instanceColor.needsUpdate = true;
    // armillary rings turn slowly, geared 1 : 3/2 : 9/4
    const a = live ? live.armAngle(t) : t * 0.12;
    this.armRings[0].rotation.set(a, 0, 0.4);
    this.armRings[1].rotation.set(0, a * 1.5, 0.9);
    this.armRings[2].rotation.set(a * 2.25, 0.6, 0);
    const cg = live ? live.armGlow(t) : 0.5 + sseg(t, wave0, wave0 + 4) * 2.0;
    this.armCore.material.color.setRGB(cg, cg * 0.62, cg * 0.28);
  }
}

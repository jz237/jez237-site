import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RNG, noise1 } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, smoother, sseg, lerp } from '../core/ease.js';
import { L } from './layout.js';
import { scanMaps, planarUVs, tileOf } from '../materials/scans.js';

// The garden beds: soil and moss, stone path, and a few hundred simpler
// mechanical plants that bloom in a wave during the reveal. Close-up hero
// pieces live elsewhere; this is the far-field ecosystem, built with
// instancing so the wide shots stay smooth.

const TAU = Math.PI * 2;

// 2D value noise (deterministic: the garden must build the same every time)
function h2(i, j, s) {
  let n = Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
function n2(x, z, s) {
  const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  return lerp(lerp(h2(i, j, s), h2(i + 1, j, s), u), lerp(h2(i, j + 1, s), h2(i + 1, j + 1, s), u), v);
}

export class Garden {
  constructor(mat, quality, tex) {
    this.group = new THREE.Group();
    this.group.name = 'garden';
    this.mat = mat;
    this.rng = new RNG('garden');
    const H = L.house;

    // ---- ground -------------------------------------------------------
    // (with the scans: photographed soil at its true scale, UVs from the
    // world, and the moss and the darker hollows as colour in the vertices)
    const soil = scanMaps('soil', { fallback: tex.bed });
    const scanned = !!soil.map;
    const bedMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: tex.bed, roughness: scanned ? 1 : 0.95, metalness: 0, ...soil, vertexColors: scanned });
    if (!scanned) {
      bedMat.map = tex.bed.clone();
      bedMat.map.repeat.set(10, 22);
      bedMat.map.needsUpdate = true;
    }
    const soilTile = tileOf('soil');
    const mossTint = new THREE.Color(0.62, 0.9, 0.5), dirt = new THREE.Color();
    const groundColour = (geo, ox, oz) => {
      const p = geo.attributes.position;
      const c = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i) + ox, z = p.getZ(i) + oz;
        const m = smoother(clamp((n2(x * 0.018, z * 0.018, 5) * 0.65 + n2(x * 0.07, z * 0.07, 6) * 0.35 - 0.52) / 0.22));
        const b = 0.62 + n2(x * 0.05, z * 0.05, 7) * 0.28;
        dirt.setRGB(b, b, b).lerp(mossTint, m * 0.75);
        c[i * 3] = dirt.r; c[i * 3 + 1] = dirt.g; c[i * 3 + 2] = dirt.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
    };
    const mkBed = (x0, x1, z0, z1, segs) => {
      const w = x1 - x0, d = z0 - z1;
      const geo = new THREE.PlaneGeometry(w, d, Math.round(w / segs), Math.round(d / segs));
      geo.rotateX(-Math.PI / 2);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i) + (x0 + x1) / 2, z = p.getZ(i) + (z0 + z1) / 2;
        const edge = Math.min(Math.abs(x - x0), Math.abs(x - x1), Math.abs(z - z0), Math.abs(z - z1));
        const mound = clamp(edge / 25) * 3.5;
        const y = mound + noise1(x * 0.05, 1) * 1.6 + noise1(z * 0.043, 2) * 1.6 + noise1((x + z) * 0.21, 3) * 0.35;
        // blend down to sit just under the fine hero patch near the origin
        const rh = Math.hypot(x, z);
        const kh = clamp((rh - 42) / 26);
        p.setY(i, (y - 2) * kh + (-0.6) * (1 - kh));
      }
      geo.computeVertexNormals();
      if (scanned) {
        planarUVs(geo, new THREE.Matrix4().makeTranslation((x0 + x1) / 2, 0, (z0 + z1) / 2), soilTile);
        groundColour(geo, (x0 + x1) / 2, (z0 + z1) / 2);
      }
      const m = new THREE.Mesh(geo, bedMat);
      m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2);
      m.receiveShadow = true;
      this.group.add(m);
      return m;
    };
    mkBed(H.x0 + 10, L.pathX[0] - 4, H.z0 - 20, H.z1 + 30, 8);
    mkBed(L.pathX[1] + 4, H.x1 - 10, H.z0 - 20, H.z1 + 30, 8);

    // fine hero patch around the flower: denser moss for macro shots
    // (with the scans: a moss lawn, photographed, at its true scale)
    // (moss is velvet: its photo's sheen read as wet gravel, so only its occlusion is used)
    const mossy = scanMaps('moss', { fallback: tex.bed, rough: false });
    const heroMat = new THREE.MeshStandardMaterial({ map: tex.bed.clone(), roughness: mossy.map ? 1 : 0.95, ...mossy, color: mossy.map ? '#58753f' : '#ffffff' });
    if (!mossy.map) {
      heroMat.map.repeat.set(4, 4);
      heroMat.map.needsUpdate = true;
    }
    const hp = new THREE.PlaneGeometry(110, 110, 110, 110);
    hp.rotateX(-Math.PI / 2);
    const pp = hp.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      const x = pp.getX(i), z = pp.getZ(i);
      const r = Math.hypot(x, z);
      const fade = clamp(1 - (r - 40) / 15);
      pp.setY(i, (noise1(x * 0.35, 7) * 0.25 + noise1(z * 0.31, 8) * 0.25 + noise1((x - z) * 0.9, 9) * 0.08) * fade - 0.05 - (1 - fade) * 1.5);
    }
    hp.computeVertexNormals();
    if (mossy.map) planarUVs(hp, new THREE.Matrix4(), tileOf('moss'));
    const heroPatch = new THREE.Mesh(hp, heroMat);
    heroPatch.receiveShadow = true;
    this.group.add(heroPatch);

    // moss tufts and pebbles near the hero (instanced)
    this._mossAndPebbles(quality, tex);

    // ---- path ------------------------------------------------------------
    // polished dark flagstones that hold a sheen (the interactive modes wet
    // them at night and mirror the lamps in them: explore/wetpath.js)
    // (with the scans: photographed stone; every flag its own piece of it,
    // a shade lighter or darker than its neighbours)
    const stone = scanMaps('path', { fallback: tex.stone });
    const scannedPath = !!stone.map;
    const flagMat = new THREE.MeshPhysicalMaterial({ color: '#7d7465', map: tex.stone, roughness: 0.5, clearcoat: 0.55, clearcoatRoughness: 0.2 });
    const curbMat = new THREE.MeshPhysicalMaterial({ color: '#958a76', map: tex.stone, roughness: 0.62, clearcoat: 0.3, clearcoatRoughness: 0.3 });
    if (scannedPath) {
      flagMat.setValues({ ...stone, color: '#b3a998', roughness: 0.85, vertexColors: true });
      curbMat.setValues({ ...stone, color: '#c4baa6', roughness: 1 });
    }
    this.flagMat = flagMat;
    this.curbMat = curbMat;
    const flags = [];
    const pw = L.pathX[1] - L.pathX[0];
    for (let z = H.z0 - 10; z > H.z1 + 10; z -= 26) {
      let x = L.pathX[0];
      let row = 0;
      while (x < L.pathX[1] - 2) {
        const w = Math.min(L.pathX[1] - x, this.rng.range(14, 24));
        flags.push({ x: x + w / 2, z: z - 13, w: w - 1.4, d: 24.6, r: this.rng.range(-0.015, 0.015), h: this.rng.range(-0.3, 0.3) });
        x += w;
        row++;
      }
    }
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const v = new THREE.Vector3();
    const tile = tileOf('path');
    let fl;
    if (scannedPath) {
      // one mesh: each flag its own box, its UVs from the world (so the
      // photo keeps its scale), offset into a different part of the photo
      const rng = new RNG('flags');
      const parts = flags.map((f) => {
        const g = new THREE.BoxGeometry(f.w, 3, f.d);
        m4.compose(v.set(f.x, -1.2 + f.h, f.z), q.setFromEuler(new THREE.Euler(0, f.r, 0)), s.set(1, 1, 1));
        planarUVs(g, m4, tile, [rng.float(), rng.float()], rng.float() < 0.5);
        g.applyMatrix4(m4);
        const b = rng.range(0.8, 1.12), warm = rng.range(-0.04, 0.04);
        const c = new Float32Array(g.attributes.position.count * 3);
        for (let i = 0; i < c.length; i += 3) { c[i] = b * (1 + warm); c[i + 1] = b; c[i + 2] = b * (1 - warm); }
        g.setAttribute('color', new THREE.BufferAttribute(c, 3));
        return g;
      });
      fl = new THREE.Mesh(mergeGeometries(parts), flagMat);
    } else {
      fl = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), flagMat, flags.length);
      flags.forEach((f, i) => {
        q.setFromEuler(new THREE.Euler(0, f.r, 0));
        s.set(f.w, 3, f.d);
        v.set(f.x, -1.2 + f.h, f.z);
        m4.compose(v, q, s);
        fl.setMatrixAt(i, m4);
      });
    }
    fl.receiveShadow = true;
    this.group.add(fl);
    this.flagMesh = fl;
    this.curbs = [];
    // stone curbs
    for (const x of [L.pathX[0] - 2, L.pathX[1] + 2]) {
      const cg = new THREE.BoxGeometry(5, 7, H.z0 - H.z1 - 40);
      if (scannedPath) planarUVs(cg, new THREE.Matrix4().makeTranslation(x, 1, (H.z0 + H.z1) / 2), tile, [x * 0.013, 0.5]);
      const curb = new THREE.Mesh(cg, curbMat);
      this.curbs.push(curb);
      curb.position.set(x, 1, (H.z0 + H.z1) / 2);
      curb.receiveShadow = true;
      curb.castShadow = true;
      this.group.add(curb);
    }

    // ---- far-field mechanical plants ---------------------------------------
    this._buildOrbLamps();
  }

  _mossAndPebbles(quality, tex) {
    const rng = new RNG('moss');
    const tuft = new THREE.IcosahedronGeometry(1, 2);
    const tp = tuft.attributes.position;
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i);
      const n = 1 + noise1(x * 4 + z * 3, 4) * 0.25;
      tp.setXYZ(i, x * n, Math.max(-0.2, y) * 0.55 * n, z * n);
    }
    tuft.computeVertexNormals();
    const mossScan = scanMaps('moss', { fallback: tex.moss, rough: false });
    const mossMat = new THREE.MeshStandardMaterial({ color: '#3d5a32', roughness: 1, map: tex.moss, ...mossScan });
    if (mossScan.map) mossMat.color.set('#ffffff');
    const count = quality.tier === 'low' ? 260 : 700;
    const moss = new THREE.InstancedMesh(tuft, mossMat, count);
    const pebble = new THREE.IcosahedronGeometry(1, 1);
    const pebbles = new THREE.InstancedMesh(pebble, new THREE.MeshStandardMaterial({ color: '#7d7466', roughness: 0.7, map: tex.stone }), 220);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(rng.float()) * 48;
      const a = rng.range(0, TAU);
      p.set(Math.cos(a) * r, -0.1, Math.sin(a) * r);
      if (Math.hypot(p.x, p.z) < 2.5) p.x += 4;
      const sc = rng.range(0.4, 1.6) * (r < 6 ? 0.6 : 1);
      s.set(sc * rng.range(0.8, 1.6), sc * rng.range(0.6, 1.1), sc * rng.range(0.8, 1.6));
      q.setFromEuler(e.set(0, rng.range(0, TAU), 0));
      m4.compose(p, q, s);
      moss.setMatrixAt(i, m4);
      if (mossScan.map) col.setHSL(0.22 + rng.range(-0.05, 0.06), 0.22 + rng.range(-0.08, 0.08), 0.3 + rng.range(-0.08, 0.08));
      else col.setHSL(0.22 + rng.range(-0.04, 0.05), 0.35 + rng.range(-0.1, 0.1), 0.22 + rng.range(-0.06, 0.08));
      moss.setColorAt(i, col);
    }
    for (let i = 0; i < 220; i++) {
      const r = Math.sqrt(rng.float()) * 45;
      const a = rng.range(0, TAU);
      p.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      const sc = rng.range(0.15, 0.7);
      s.set(sc * rng.range(1, 1.5), sc * 0.6, sc);
      q.setFromEuler(e.set(rng.range(0, 1), rng.range(0, TAU), 0));
      m4.compose(p, q, s);
      pebbles.setMatrixAt(i, m4);
    }
    moss.receiveShadow = true;
    moss.castShadow = true;
    pebbles.receiveShadow = true;
    pebbles.castShadow = true;
    this.group.add(moss, pebbles);
    this.smallCasters = [moss, pebbles];
  }

  _buildOrbLamps() {
    // glass orb lamps on slender brass posts along the path edge (amber cores)
    const mat = this.mat;
    this.lamps = [];
    const postGeo = new THREE.CylinderGeometry(0.5, 0.8, 1, 8);
    postGeo.translate(0, 0.5, 0);
    const orbGeo = new THREE.SphereGeometry(5, 24, 16);
    const coreGeo = new THREE.SphereGeometry(1.6, 12, 8);
    this.lampCoreMat = new THREE.MeshBasicMaterial({ color: '#ffb257' });
    const orbMat = mat.glass;
    // (between the promenade's arches: layout.js)
    for (const [x, z] of L.lampSpots) {
      {
        const h = 62;
        const post = new THREE.Mesh(postGeo, mat.brassAged);
        post.scale.set(1, h, 1);
        post.position.set(x, 0, z);
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(post.position.x, h + 5, post.position.z);
        const core = new THREE.Mesh(coreGeo, this.lampCoreMat.clone());
        core.position.copy(orb.position);
        const cage = new THREE.Mesh(new THREE.TorusGeometry(5.1, 0.25, 6, 32), mat.gold);
        cage.position.copy(orb.position);
        cage.rotation.x = Math.PI / 2;
        this.group.add(post, orb, core, cage);
        post.castShadow = true;
        this.lamps.push(core);
      }
    }
  }

  update(t, ctx) {
    const lampGlow = (1 - ctx.dawn * 0.6) * 2.4 * sseg(t, B.podsWake[0], B.podsWake[1]);
    this.lampCoreMat.color.setRGB(1.0 * lampGlow + 0.05, 0.62 * lampGlow + 0.03, 0.3 * lampGlow + 0.02);
    // each lamp has its own material so the interactive modes can light them one by one
    this.lamps.forEach((core, i) => {
      if (this.live) { const g = this.live.lamp(core, i, t); core.material.color.setRGB(1.0 * g + 0.05, 0.62 * g + 0.03, 0.3 * g + 0.02); }
      else core.material.color.copy(this.lampCoreMat.color);
    });
  }
}

// world.js — builds the static level from the area data: terrain, water,
// vegetation, props, and the collision set that matches them one-to-one.
import * as THREE from 'three';
import { Terrain, groundMaterial, waterMaterial, X_EXTENT } from './terrain.js';
import * as M from './models.js';
import * as TX from './textures.js';
import { mulberry, fbm, noise2, smooth, clamp } from './util.js';

export const WIND = { uTime: { value: 0 } };

function windify(mat, amp) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = WIND.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float wh = max(0.0, transformed.y);
        vec3 wip = vec3(0.0);
        #ifdef USE_INSTANCING
          wip = instanceMatrix[3].xyz;
        #endif
        float wph = uTime * 1.25 + wip.x * 0.31 + wip.z * 0.23;
        float gust = 0.7 + 0.3 * sin(uTime * 0.37 + wip.z * 0.05);
        transformed.x += sin(wph) * ${amp.toFixed(4)} * wh * wh * gust;
        transformed.z += cos(wph * 0.83) * ${(amp * 0.6).toFixed(4)} * wh * wh * gust;`);
    // two-sided foliage: never let a back face flip its normal underground
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
      if (dot(normal, (viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz) < 0.0) normal = -normal;`);
  };
  mat.customProgramCacheKey = () => 'wind' + amp;
  return mat;
}
function foliageMats(map, amp, extra = {}) {
  const mat = windify(new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85, vertexColors: true, ...extra }), amp);
  const depth = windify(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.45, side: THREE.DoubleSide }), amp);
  return { mat, depth };
}

// ------------------------------------------------------------------ collision
const NONE = [];
export class Colliders {
  constructor() { this.list = []; this.grid = new Map(); this.CELL = 6; this._stamp = 0; }
  _cells(p0, p1) { const a = Math.floor(p0 / this.CELL), b = Math.floor(p1 / this.CELL); const out = []; for (let i = a; i <= b; i++) out.push(i); return out; }
  add(c) {
    c.alive = true;
    let pMin, pMax;
    if (c.k === 'c') { pMin = c.p - c.r; pMax = c.p + c.r; }
    else if (c.k === 'b') { const e = Math.hypot(c.hw, c.hp); pMin = c.p - e; pMax = c.p + e; c.cos = Math.cos(c.rot || 0); c.sin = Math.sin(c.rot || 0); }
    else { pMin = Math.min(c.p0, c.p1) - c.r; pMax = Math.max(c.p0, c.p1) + c.r; }
    for (const i of this._cells(pMin, pMax)) { if (!this.grid.has(i)) this.grid.set(i, []); this.grid.get(i).push(c); }
    this.list.push(c);
    return c;
  }
  // every collider in the cells spanning [p - pad, p + pad], each once
  near(p, pad = 0) {
    const a = Math.floor((p - pad) / this.CELL), b = Math.floor((p + pad) / this.CELL);
    if (a === b) return this.grid.get(a) || NONE;
    const out = [], stamp = ++this._stamp;
    for (let i = a; i <= b; i++) for (const c of this.grid.get(i) || NONE) if (c._s !== stamp) { c._s = stamp; out.push(c); }
    return out;
  }
  // signed-ish penetration test: returns push vector for a circle at (x,p,r)
  static push(c, x, p, r) {
    if (c.k === 'c') {
      const dx = x - c.x, dp = p - c.p, d = Math.hypot(dx, dp), m = c.r + r;
      if (d >= m) return null;
      if (d < 1e-5) return [m, 0];
      return [dx / d * (m - d), dp / d * (m - d)];
    }
    if (c.k === 'b') {
      const dx = x - c.x, dp = p - c.p;
      const lx = dx * c.cos + dp * c.sin, lp = -dx * c.sin + dp * c.cos;
      const cx = clamp(lx, -c.hw, c.hw), cp = clamp(lp, -c.hp, c.hp);
      let ox = lx - cx, op = lp - cp, d = Math.hypot(ox, op);
      let px, pp;
      if (d > 1e-5) { if (d >= r) return null; px = ox / d * (r - d); pp = op / d * (r - d); }
      else {
        const ex = c.hw - Math.abs(lx), ep = c.hp - Math.abs(lp);
        if (ex < ep) { px = Math.sign(lx || 1) * (ex + r); pp = 0; } else { px = 0; pp = Math.sign(lp || 1) * (ep + r); }
      }
      return [px * c.cos - pp * c.sin, px * c.sin + pp * c.cos];
    }
    // capsule segment
    const vx = c.x1 - c.x0, vp = c.p1 - c.p0, L2 = vx * vx + vp * vp;
    const t = clamp(((x - c.x0) * vx + (p - c.p0) * vp) / (L2 || 1), 0, 1);
    const qx = c.x0 + vx * t, qp = c.p0 + vp * t;
    const dx = x - qx, dp = p - qp, d = Math.hypot(dx, dp), m = c.r + r;
    if (d >= m) return null;
    if (d < 1e-5) return [0, -m];
    return [dx / d * (m - d), dp / d * (m - d)];
  }
  resolve(x, p, r, who = 'joe') {
    for (let it = 0; it < 3; it++) {
      let moved = false;
      for (const c of this.near(p, r + 3)) {
        if (!c.alive) continue;
        if (who === 'enemy' && c.enemyPass) continue;
        const v = Colliders.push(c, x, p, r);
        if (v) { x += v[0]; p += v[1]; moved = true; }
      }
      if (!moved) break;
    }
    return [x, p];
  }
  blocked(x, p, r, who = 'joe') {
    for (const c of this.near(p, r + 3)) {
      if (!c.alive || (who === 'enemy' && c.enemyPass)) continue;
      if (Colliders.push(c, x, p, r)) return c;
    }
    return null;
  }
  // first bullet-stopping collider along a segment (sampled)
  bulletHit(x0, p0, x1, p1, skip = 0) {
    const L = Math.hypot(x1 - x0, p1 - p0), n = Math.max(1, Math.ceil(L / 0.18));
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      if (t * L < skip) continue;
      const x = x0 + (x1 - x0) * t, p = p0 + (p1 - p0) * t;
      for (const c of this.near(p, 3)) {
        if (!c.alive || !c.bul) continue;
        if (Colliders.push(c, x, p, 0.02)) return { c, x, p, t };
      }
    }
    return null;
  }
  // line of sight; `skip` ignores cover right at the shooter's feet
  los(x0, p0, x1, p1, skip = 0) { return !this.bulletHit(x0, p0, x1, p1, skip); }
}

// ------------------------------------------------------------------ world
export class World {
  constructor(area, scene, quality) {
    this.area = area; this.scene = scene; this.quality = quality;
    this.terrain = new Terrain(area);
    this.col = new Colliders();
    this.root = new THREE.Group(); scene.add(this.root);
    this.dyn = { barrels: [], crates: [], pits: [], towers: [], bunkers: [], fires: [], pows: [], doors: null, flag: null };
    const tex = this.tex = {
      ground: TX.groundDetail(), grass: TX.grassCard(), frond: TX.frondTexture(), leaf: TX.leafTexture(),
      thatch: TX.thatchTexture(), planks: TX.planksTexture(), stone: TX.stoneTexture(), concrete: TX.concreteTexture(),
      burlap: TX.burlapTexture(), helipad: TX.helipadTexture(),
    };
    M.initMaterials(tex);
    this.buildGround();
    this.buildProps();
    this.buildVegetation();
    this.buildBounds();
  }

  h(x, p) { return this.terrain.height(x, p); }

  place(obj, x, p, rot = 0, yOff = 0) {
    obj.position.set(x, this.h(x, p) + yOff, -p);
    obj.rotation.y = rot;
    this.root.add(obj);
    return obj;
  }
  mesh(geo, mat, x, p, rot = 0, s = 1, yOff = 0) {
    const m = new THREE.Mesh(geo, mat);
    m.scale.setScalar(s);
    m.castShadow = true; m.receiveShadow = true;
    return this.place(m, x, p, rot, yOff);
  }

  buildGround() {
    const A = this.area;
    const geo = this.terrain.buildMesh(-40, A.length + 45);
    const ground = this.ground = new THREE.Mesh(geo, groundMaterial(this.tex.ground));
    ground.receiveShadow = true;
    this.root.add(ground);
    // water: river + pond, a flat animated sheet
    this.waterMat = waterMaterial(this.tex.ground.normal);
    if (A.river) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(X_EXTENT * 2, A.river.p1 - A.river.p0 + 6).rotateX(-Math.PI / 2), this.waterMat);
      w.position.set(0, -0.62, -(A.river.p0 + A.river.p1) / 2);
      w.receiveShadow = true;
      this.root.add(w);
      // river blocks walking everywhere except the bridge; bullets fly over
      const hb = A.river.bridgeHalf;
      const pm = (A.river.p0 + A.river.p1) / 2, hp = (A.river.p1 - A.river.p0) / 2 - 0.2;
      this.col.add({ k: 'b', x: -(hb + 0.35 + 30) , p: pm, hw: 30, hp, bul: false, water: true });
      this.col.add({ k: 'b', x: (hb + 0.35 + 30), p: pm, hw: 30, hp, bul: false, water: true });
    }
    if (A.pond) {
      const q = A.pond;
      const w = new THREE.Mesh(new THREE.PlaneGeometry(q.r * 2 + 6, q.r * 2 + 6).rotateX(-Math.PI / 2), this.waterMat);
      w.position.set(q.x, -0.55, -q.p); w.receiveShadow = true;
      this.root.add(w);
      this.col.add({ k: 'c', x: q.x, p: q.p, r: q.r - 0.4, bul: false, water: true });
    }
  }

  buildProps() {
    const A = this.area, col = this.col, tx = this.tex;
    const sandbags = [];   // [x, y, z, rotY, scale, shade]
    const bagRow = (pts, rows = 3) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, p0] = pts[i], [x1, p1] = pts[i + 1];
        const len = Math.hypot(x1 - x0, p1 - p0), ang = Math.atan2(-(p1 - p0), x1 - x0);
        const n = Math.max(1, Math.round(len / 0.56));
        for (let row = 0; row < rows; row++) {
          for (let k = 0; k < n - (row % 2); k++) {
            const t = (k + 0.5 + (row % 2) * 0.5) / n;
            const x = x0 + (x1 - x0) * t, p = p0 + (p1 - p0) * t;
            sandbags.push([x, this.h(x, p) + 0.1 + row * 0.185, -p, -ang + (Math.sin(k * 7.1 + row) * 0.08), 1 - row * 0.03, 0.85 + Math.abs(Math.sin(k * 3.7 + row * 1.3)) * 0.3]);
          }
        }
        col.add({ k: 's', x0, p0, x1, p1, r: 0.3, bul: true, cover: true });
      }
    };
    const ringBags = (x, p, R, gap = 0) => {
      const n = Math.round(Math.PI * 2 * R / 0.56);
      for (let row = 0; row < 2; row++) for (let k = 0; k < n; k++) {
        const a = (k + row * 0.5) / n * Math.PI * 2;
        if (gap && Math.abs(Math.sin(a / 2 - Math.PI / 2)) < gap) continue;
        const bx = x + Math.cos(a) * R, bp = p + Math.sin(a) * R;
        sandbags.push([bx, this.h(bx, bp) + 0.12 + row * 0.185, -bp, -a + Math.PI / 2, 1, 0.85 + Math.abs(Math.sin(k * 2.1)) * 0.3]);
      }
    };

    const geoCache = {};
    const G = (key, fn) => geoCache[key] || (geoCache[key] = fn());
    let rockSeed = 1;
    for (const pr of A.props) {
      switch (pr.t) {
        case 'sandbags': bagRow(pr.pts, pr.rows || 3); break;
        case 'crate': {
          const s = pr.s || 1;
          const m = this.mesh(G('crate', M.crateGeo), M.MAT.vc, pr.x, pr.p, pr.rot || 0, s, pr.y || 0);
          const c = pr.y ? null : col.add({ k: 'b', x: pr.x, p: pr.p, hw: 0.5 * s, hp: 0.5 * s, rot: -(pr.rot || 0), bul: true });
          const rec = { mesh: m, c, x: pr.x, p: pr.p, hp: 3, stacked: !!pr.y };
          if (c) c.ref = { crate: rec };
          this.dyn.crates.push(rec);
          break;
        }
        case 'barrel': {
          const m = this.mesh(G('barrel' + !!pr.red, () => M.barrelGeo(pr.red)), M.MAT.vc, pr.x, pr.p, Math.random() * 3);
          const c = col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.36, bul: true });
          const rec = { mesh: m, c, x: pr.x, p: pr.p, red: !!pr.red, hp: pr.red ? 2 : 6, alive: true };
          c.ref = { barrel: rec };
          this.dyn.barrels.push(rec);
          break;
        }
        case 'jeep': {
          const g = M.jeepGroup(true); this.place(g, pr.x, pr.p, pr.rot || 0);
          g.rotation.z = 0.05;
          col.add({ k: 'b', x: pr.x, p: pr.p, hw: 0.9, hp: 1.75, rot: -(pr.rot || 0), bul: true });
          break;
        }
        case 'tent': {
          const g = M.tentGroup(); this.place(g, pr.x, pr.p, pr.rot || 0);
          col.add({ k: 'b', x: pr.x, p: pr.p, hw: 1.35, hp: 1.75, rot: -(pr.rot || 0), bul: true });
          break;
        }
        case 'hut': {
          const g = M.hutGroup(); this.place(g, pr.x, pr.p, pr.rot || 0);
          col.add({ k: 'b', x: pr.x, p: pr.p, hw: 2.2, hp: 1.8, rot: -(pr.rot || 0), bul: true });
          break;
        }
        case 'rock': {
          const s = pr.s || 1;
          const m = this.mesh(G('rock' + (rockSeed % 3), () => M.rockGeo(rockSeed * 17)), M.MAT.vc, pr.x, pr.p, rockSeed * 1.3, s, -0.1);
          rockSeed++;
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.85 * s, bul: true });
          break;
        }
        case 'palm': {
          const pg = G('palm-prop' + (pr.x > 0 ? 1 : 0), () => M.palmGeo(pr.x > 0 ? 901 : 902));
          if (!this._palmPropMats) this._palmPropMats = foliageMats(tx.frond, 0.0022);
          const t = this.mesh(pg.trunk, M.MAT.vc, pr.x, pr.p, 0, pr.s || 1);
          const f = new THREE.Mesh(pg.fronds, this._palmPropMats.mat); f.customDepthMaterial = this._palmPropMats.depth;
          f.castShadow = true; f.receiveShadow = true; t.add(f);
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.38, bul: true });
          break;
        }
        case 'bush': {
          if (!this._bushPropMats) this._bushPropMats = foliageMats(tx.leaf, 0.025);
          const m = this.mesh(G('bush' + !!pr.dry, () => M.leafyBushGeo(77, pr.dry)), this._bushPropMats.mat, pr.x, pr.p, 0, pr.s || 1);
          m.customDepthMaterial = this._bushPropMats.depth;
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.9 * (pr.s || 1), bul: false });
          break;
        }
        case 'log': {
          const m = this.mesh(M.logGeo(pr.len || 2), M.MAT.vc, pr.x, pr.p, pr.rot || 0, 1, -0.05);
          const dx = Math.cos(pr.rot || 0) * (pr.len || 2) / 2, dp = Math.sin(pr.rot || 0) * (pr.len || 2) / 2;
          col.add({ k: 's', x0: pr.x - dx, p0: pr.p - dp, x1: pr.x + dx, p1: pr.p + dp, r: 0.3, bul: true, cover: true });
          break;
        }
        case 'campfire': {
          const g = M.campfireGroup(); this.place(g, pr.x, pr.p);
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.6, bul: false });
          this.dyn.fires.push({ x: pr.x, p: pr.p, y: this.h(pr.x, pr.p) });
          break;
        }
        case 'helipad': {
          // painted on the ground: the decal mesh follows the terrain
          const s = pr.r * 2.2, geo = new THREE.PlaneGeometry(s, s, 24, 24).rotateX(-Math.PI / 2).rotateY(0.2);
          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) pos.setY(i, this.h(pr.x + pos.getX(i), pr.p - pos.getZ(i)) + 0.035);
          geo.computeVertexNormals();
          const d = new THREE.Mesh(geo, M.MAT.decal);
          d.receiveShadow = true;
          d.position.set(pr.x, 0, -pr.p); this.root.add(d);
          break;
        }
        case 'bridge': {
          const g = M.bridgeGroup(pr.p1 - pr.p0, pr.half);
          g.position.set(pr.x, 0.0, -pr.p0); this.root.add(g);
          // rails keep you on the deck; the deck spans the river gap
          col.add({ k: 'b', x: pr.x - pr.half - 0.2, p: (pr.p0 + pr.p1) / 2, hw: 0.12, hp: (pr.p1 - pr.p0) / 2 - 1.2, bul: false });
          col.add({ k: 'b', x: pr.x + pr.half + 0.2, p: (pr.p0 + pr.p1) / 2, hw: 0.12, hp: (pr.p1 - pr.p0) / 2 - 1.2, bul: false });
          this.bridge = pr;
          break;
        }
        case 'trench': {
          // revetment planks along both walls + sandbag parapet on the north lip
          const len = pr.x1 - pr.x0, xm = (pr.x0 + pr.x1) / 2;
          const wallGeo = new THREE.BoxGeometry(len, 1.1, 0.08);
          wallGeo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 0.5 : len / 2); });
          M.P(wallGeo, '#9b8260');
          for (const side of [-1, 1]) {
            const w = new THREE.Mesh(wallGeo, M.MAT.planks); w.receiveShadow = true;
            w.position.set(xm, -0.68, -(pr.p + side * 0.66)); this.root.add(w);
          }
          const pts = [[pr.x0 + 0.2, pr.p + 1.05], [pr.x1 - 0.2, pr.p + 1.05]];
          bagRow(pts, 2);
          col.list[col.list.length - 1].bul = false;  // low parapet: fire passes over
          col.list[col.list.length - 1].enemyPass = true;
          col.add({ k: 'b', x: xm, p: pr.p, hw: len / 2, hp: 0.72, bul: false, trench: true, enemyPass: true });
          break;
        }
        case 'mortarpit': {
          ringBags(pr.x, pr.p, 1.9);
          const tube = this.mesh(G('mortar', M.mortarGeo), M.MAT.vc, pr.x, pr.p, 0, 1, 0);
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 2.25, bul: true, pit: true });
          this.dyn.pits.push({ x: pr.x, p: pr.p, tube, alive: true });
          break;
        }
        case 'tower': {
          const g = M.towerGroup(); this.place(g, pr.x, pr.p, 0);
          for (const [dx, dp] of [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]]) col.add({ k: 'c', x: pr.x + dx, p: pr.p + dp, r: 0.2, bul: false });
          this.dyn.towers.push({ x: pr.x, p: pr.p, deckY: this.h(pr.x, pr.p) + g.userData.deckY, group: g });
          break;
        }
        case 'bunker': {
          const g = M.bunkerGroup(); this.place(g, pr.x, pr.p, Math.PI + (pr.rot || 0));
          const c = col.add({ k: 'b', x: pr.x, p: pr.p, hw: 2.7, hp: 1.9, bul: true });
          this.dyn.bunkers.push({ x: pr.x, p: pr.p, group: g, c, hp: 2, alive: true });
          break;
        }
        case 'hedgehog': {
          this.mesh(G('hedgehog', M.hedgehogGeo), M.MAT.vcMetal, pr.x, pr.p, pr.x * 0.7, 1);
          col.add({ k: 'c', x: pr.x, p: pr.p, r: 0.75, bul: false });
          break;
        }
        case 'wire': {
          const m = new THREE.Mesh(M.wireGeo(pr.pts.map(([x, p]) => [x, p])), M.MAT.vcMetal);
          m.castShadow = true; this.root.add(m);
          for (let i = 0; i < pr.pts.length - 1; i++) col.add({ k: 's', x0: pr.pts[i][0], p0: pr.pts[i][1], x1: pr.pts[i + 1][0], p1: pr.pts[i + 1][1], r: 0.35, bul: false });
          break;
        }
        case 'fortress': {
          const g = M.fortressGroup(A); g.position.set(0, 0, -pr.p); this.root.add(g);
          this.fortress = g; this.dyn.doors = g.userData.doors; this.dyn.flag = g.userData.flag;
          const gh = A.gateHalf;
          col.add({ k: 'b', x: -(gh + 30), p: pr.p + 1.5, hw: 30 - 0.1, hp: 1.6, bul: true });
          col.add({ k: 'b', x: gh + 30, p: pr.p + 1.5, hw: 30 - 0.1, hp: 1.6, bul: true });
          this.gateCol = col.add({ k: 'b', x: 0, p: pr.p + 0.2, hw: gh, hp: 0.3, bul: true });
          break;
        }
      }
    }
    // POW stakes
    for (const w of A.pows) this.mesh(G('stake', M.stakeGeo), M.MAT.vc, w.x - 0.25, w.p + 0.3, 0);

    // all sandbags in one instanced draw
    const sg = M.sandbagGeo();
    const bags = new THREE.InstancedMesh(sg, M.MAT.sandbag, sandbags.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
    sandbags.forEach(([x, y, z, ry, s, sh], i) => {
      e.set(0, ry, 0); q.setFromEuler(e);
      m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s, s));
      bags.setMatrixAt(i, m4);
      c.setRGB(0.78 * sh, 0.7 * sh, 0.52 * sh); bags.setColorAt(i, c);
    });
    bags.castShadow = true; bags.receiveShadow = true;
    this.root.add(bags);
  }

  // dense jungle walls + scattered interior foliage, chunked for culling
  buildVegetation() {
    const A = this.area, T = this.terrain, r = mulberry(2026);
    const CH = 24, chunks = new Map();
    const push = (kind, x, p, s, rot, y) => {
      const k = Math.floor(p / CH);
      if (!chunks.has(k)) chunks.set(k, {});
      const ch = chunks.get(k); (ch[kind] || (ch[kind] = [])).push([x, y ?? this.h(x, p), -p, rot ?? r() * 6.28, s]);
    };
    const busy = (x, p, pad) => this.col.blocked(x, p, pad, 'veg');
    const nearRoad = (x, p) => Math.abs(x - T.roadX(p)) < 2.6;
    const inWater = (x, p) => T.riverDepth(x, p) > 0.15 || T.pondDepth(x, p) > 0.1;
    const wallP = A.wallP || 1e9;
    const hi = this.quality === 'high';
    for (let p = -38; p < Math.min(A.length + 42, wallP - 1); p += 1.0) {
      const w = T.biomeWeights(p), hw = T.halfWidth(p);
      const lush = (w.lz || 0) * 0.85 + (w.jungle || 0) * 1.0 + (w.river || 0) * 0.7 + (w.scrub || 0) * 0.45 + (w.desert || 0) * 0.12 + (w.fort || 0) * 0.08;
      for (const side of [-1, 1]) {
        // palms: rows receding into the jungle
        if (r() < 0.26 * lush + 0.02) {
          const e = 1.2 + Math.pow(r(), 0.8) * 26, x = side * (hw + e);
          if (Math.abs(x) < X_EXTENT - 1 && !inWater(x, p)) push('palm' + ((r() * 4) | 0), x, p + r(), 0.85 + r() * 0.35);
        }
        // broadleaf & bushes pile up right at the corridor edge
        const nEdge = Math.round((hi ? 3 : 2) * lush + r() * 0.8);
        for (let i = 0; i < nEdge; i++) {
          const e = -0.8 + Math.pow(r(), 1.6) * 22, x = side * (hw + e), pp = p + r();
          if (inWater(x, pp) || Math.abs(x) > X_EXTENT - 0.5) continue;
          const roll = r();
          if (roll < 0.34) push('leaf' + ((r() * 3) | 0), x, pp, 0.8 + r() * 0.8);
          else if (roll < 0.62) push('bush' + ((r() * 3) | 0), x, pp, 0.7 + r() * 0.9);
          else push('fern' + ((r() * 2) | 0), x, pp, 0.8 + r() * 0.6);
        }
        // dry scrub bushes where it's sandy
        if (r() < ((w.desert || 0) + (w.fort || 0) * 0.6 + (w.scrub || 0) * 0.6) * 0.35) {
          const x = side * (hw + r() * 16);
          if (!inWater(x, p)) push('dry', x, p + r(), 0.5 + r() * 0.6);
        }
        // reeds on the river banks
        if ((w.river || 0) > 0.3) for (let i = 0; i < 3; i++) {
          const x = (r() - 0.5) * 2 * (X_EXTENT - 2), rd = T.riverDepth(x, p);
          if (rd > 0.05 && rd < 0.55 && Math.abs(x) > A.river.bridgeHalf + 1) push('grass', x, p + r(), 0.9 + r() * 0.6);
        }
      }
      // grass tufts & small stones inside the corridor
      const nG = Math.round((hi ? 4 : 2) * (0.3 + lush) * (0.5 + 0.5 * smooth(-0.3, 0.3, fbm(p * 0.07, 3, 2))));
      for (let i = 0; i < nG; i++) {
        const x = (r() * 2 - 1) * (hw + 2), pp = p + r();
        if (nearRoad(x, pp) || inWater(x, pp) || busy(x, pp, 0.5) || T.trenchDepth(x, pp) > 0.05) continue;
        const grassy = fbm(x * 0.11 + 7, pp * 0.11, 3);
        if (grassy > -0.15 || r() < 0.2) push('grass', x, pp, 0.7 + r() * 0.7);
      }
      if (r() < 0.35) {
        const x = (r() * 2 - 1) * (hw + 4), pp = p + r();
        if (!inWater(x, pp) && !busy(x, pp, 0.4)) push('pebble' + ((r() * 3) | 0), x, pp, 0.12 + r() * 0.2);
      }
      // fallen leaves: thick under the jungle edge, scattered across the path
      const nL = Math.round((hi ? 9 : 4) * ((w.jungle || 0) + (w.lz || 0) * 0.7 + (w.river || 0) * 0.5 + (w.scrub || 0) * 0.3));
      for (let i = 0; i < nL; i++) {
        const side = r() < 0.5 ? -1 : 1, e = r() < 0.6 ? -3 + r() * 6 : -hw + r() * hw;
        const x = side * (hw + e), pp = p + r();
        if (inWater(x, pp) || T.trenchDepth(x, pp) > 0.05) continue;
        push('litter', x, pp, 0.5 + r() * 0.5);
      }
    }
    // geometry & material per kind
    const tx = this.tex;
    const palmVariants = [11, 23, 37, 51].map(s => M.palmGeo(s));
    const palmF = foliageMats(tx.frond, 0.0022), leafM = foliageMats(tx.leaf, 0.02), fernM = foliageMats(tx.frond, 0.03, { color: 0xb8c890 }), grassM = foliageMats(tx.grass, 0.06);
    const trunkMat = windify(M.MAT.vc.clone(), 0.0016);
    const kinds = {};
    palmVariants.forEach((pv, i) => { kinds['palm' + i] = [[pv.trunk, trunkMat, null], [pv.fronds, palmF.mat, palmF.depth]]; });
    for (let i = 0; i < 3; i++) kinds['leaf' + i] = [[M.broadleafGeo(300 + i), leafM.mat, leafM.depth]];
    const bushM = foliageMats(tx.leaf, 0.025);
    for (let i = 0; i < 3; i++) kinds['bush' + i] = [[M.leafyBushGeo(400 + i), bushM.mat, bushM.depth]];
    for (let i = 0; i < 2; i++) kinds['fern' + i] = [[M.fernGeo(500 + i), fernM.mat, fernM.depth]];
    kinds.dry = [[M.leafyBushGeo(600, true), bushM.mat, bushM.depth]];
    kinds.grass = [[M.grassTuftGeo(), grassM.mat, grassM.depth]];
    const litterGeo = new THREE.PlaneGeometry(0.28, 0.5).rotateX(-Math.PI / 2).translate(0, 0.03, 0);
    M.P(litterGeo, '#ffffff');
    const litterMat = new THREE.MeshStandardMaterial({ map: tx.leaf, alphaTest: 0.5, roughness: 0.95, vertexColors: true, polygonOffset: true, polygonOffsetFactor: -1 });
    kinds.litter = [[litterGeo, litterMat, null]];
    for (let i = 0; i < 3; i++) kinds['pebble' + i] = [[M.rockGeo(700 + i, false), M.MAT.vc, null]];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3(), sc = new THREE.Vector3();
    for (const ch of chunks.values()) {
      for (const [kind, items] of Object.entries(ch)) {
        for (const [geo, mat, depth] of kinds[kind]) {
          const im = new THREE.InstancedMesh(geo, mat, items.length);
          items.forEach(([x, y, z, rot, s], i) => {
            q.setFromAxisAngle(up, rot); v.set(x, y - (kind.startsWith('pebble') ? 0.1 : 0.02), z); sc.set(s, s, s);
            m4.compose(v, q, sc); im.setMatrixAt(i, m4);
          });
          im.computeBoundingSphere();
          const small = kind === 'grass' || kind === 'litter' || kind.startsWith('pebble') || kind.startsWith('fern');
          if (kind === 'litter') {
            const c = new THREE.Color(), rr = mulberry(items.length);
            items.forEach((_, i) => { const k = rr(); c.setRGB(0.75 + k * 0.5, 0.55 + k * 0.25, 0.25 + k * 0.1, THREE.SRGBColorSpace); im.setColorAt(i, c); });
          }
          im.castShadow = !small; im.receiveShadow = true;
          if (kind === 'grass') {
            const c = new THREE.Color();
            items.forEach(([x, y, z], i) => {
              const w = this.terrain.biomeWeights(-z), dry = (w.desert || 0) + (w.fort || 0) * 0.8 + (w.scrub || 0) * 0.5;
              c.setRGB(1 + dry * 0.35, 1 + dry * 0.05, 0.85 - dry * 0.25); im.setColorAt(i, c);
            });
          }
          if (depth) im.customDepthMaterial = depth;
          this.root.add(im);
        }
      }
    }
  }

  // invisible side walls: the corridor edge where the jungle becomes impassable
  buildBounds() {
    this.boundHalf = (p) => this.terrain.halfWidth(p) - 0.45;
  }

  update(t) {
    WIND.uTime.value = t;
    this.waterMat.userData.tick(t);
    if (this.dyn.flag) {
      const f = this.dyn.flag, pos = f.geometry.attributes.position;
      if (!f.userData.base) f.userData.base = pos.array.slice();
      const b = f.userData.base;
      for (let i = 0; i < pos.count; i++) {
        const x = b[i * 3] + 1.1;
        pos.setZ(i, Math.sin(t * 5 + x * 2.5) * 0.12 * x);
      }
      pos.needsUpdate = true; f.geometry.computeVertexNormals();
    }
  }
}

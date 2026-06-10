// Instanced forests, rocks, bushes, deadfall and grass/flowers. Trees live
// in a spatial hash so shells/tanks can interact with them; hit trees swap
// to real falling rigid bodies (capped pool), then fade out.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getHeight, getNormal, forestDensity } from './terrain.js';
import { makeRng } from './noise.js';
import { WORLD_HALF, SCATTER, CG } from './config.js';

// --- tiny non-indexed geometry merger (avoids vendoring utils) ----------
function mergeGeoms(geoms) {
  const nonIndexed = geoms.map(g => (g.index ? g.toNonIndexed() : g));
  let vcount = 0;
  for (const g of nonIndexed) vcount += g.attributes.position.count;
  const posArr = new Float32Array(vcount * 3);
  const norArr = new Float32Array(vcount * 3);
  const colArr = new Float32Array(vcount * 3);
  let off = 0;
  for (const g of nonIndexed) {
    posArr.set(g.attributes.position.array, off * 3);
    norArr.set(g.attributes.normal.array, off * 3);
    colArr.set(g.attributes.color.array, off * 3);
    off += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(norArr, 3));
  out.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  return out;
}

function paint(geo, color, jitter = 0) {
  const c = new THREE.Color(color);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  const rng = makeRng((color ^ 0x5bd1e995) >>> 0);
  for (let i = 0; i < n; i++) {
    const j = 1 + (rng() - 0.5) * jitter;
    arr[i * 3] = c.r * j; arr[i * 3 + 1] = c.g * j; arr[i * 3 + 2] = c.b * j;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

// --- tree geometry variants (origin at ground) ---------------------------
function coniferGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.16, 0.28, 2.2, 6), 0x6e4f30, 0.25);
  trunk.translate(0, 1.1, 0);
  const parts = [trunk];
  let y = 3.0, r = 2.0, h = 3.2;
  for (let i = 0; i < 4; i++) {
    const cone = paint(new THREE.ConeGeometry(r, h, 8), [0x2f6b2e, 0x357730, 0x3d8336, 0x478c3c][i], 0.3);
    cone.translate(0, y, 0);
    parts.push(cone);
    y += h * 0.52; r *= 0.72; h *= 0.8;
  }
  return mergeGeoms(parts); // ~8m tall
}

function oakGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.22, 0.36, 2.9, 6), 0x7a5a38, 0.3);
  trunk.translate(0, 1.45, 0);
  const limb = paint(new THREE.CylinderGeometry(0.1, 0.16, 1.6, 5), 0x6e4f30, 0.2);
  limb.rotateZ(0.7);
  limb.translate(0.8, 3.1, 0.2);
  const parts = [trunk, limb];
  const rng = makeRng(606);
  for (let i = 0; i < 5; i++) {
    const r = 1.15 + rng() * 0.9;
    const blob = paint(new THREE.IcosahedronGeometry(r, 1), i % 2 ? 0x4d8a35 : 0x569441, 0.35);
    blob.scale(1, 0.8, 1);
    blob.translate((rng() - 0.5) * 2.4, 3.9 + rng() * 1.6, (rng() - 0.5) * 2.4);
    parts.push(blob);
  }
  return mergeGeoms(parts); // ~6.8m
}

function birchGeometry() {
  // white banded trunk, airy light canopy
  const trunk = new THREE.CylinderGeometry(0.12, 0.18, 4.2, 6, 6);
  const tp = trunk.attributes.position;
  const tc = new Float32Array(tp.count * 3);
  for (let i = 0; i < tp.count; i++) {
    const band = Math.sin(tp.getY(i) * 5.1) > 0.72 ? 0.22 : 0.88;
    tc[i * 3] = band; tc[i * 3 + 1] = band; tc[i * 3 + 2] = band * 0.94;
  }
  trunk.setAttribute('color', new THREE.BufferAttribute(tc, 3));
  trunk.translate(0, 2.1, 0);
  const parts = [trunk];
  const rng = makeRng(909);
  for (let i = 0; i < 4; i++) {
    const blob = paint(new THREE.IcosahedronGeometry(0.9 + rng() * 0.6, 1), i % 2 ? 0x7fb04a : 0x93bf58, 0.3);
    blob.scale(1, 0.9, 1);
    blob.translate((rng() - 0.5) * 1.7, 4.1 + rng() * 1.5, (rng() - 0.5) * 1.7);
    parts.push(blob);
  }
  return mergeGeoms(parts); // ~6m
}

function deadTreeGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.1, 0.24, 4.6, 5), 0x6b5a48, 0.35);
  trunk.translate(0, 2.3, 0);
  const parts = [trunk];
  const rng = makeRng(303);
  for (let i = 0; i < 3; i++) {
    const br = paint(new THREE.CylinderGeometry(0.04, 0.08, 1.6 + rng(), 4), 0x5d4e3e, 0.3);
    br.rotateZ(0.9 + rng() * 0.6);
    br.rotateY(rng() * Math.PI * 2);
    br.translate(0, 2.6 + rng() * 1.6, 0);
    parts.push(br);
  }
  return mergeGeoms(parts); // ~4.8m
}

const TREE_VARIANTS = [
  { build: coniferGeometry, height: 8.0, radius: 0.34, share: 0.42 },
  { build: oakGeometry, height: 6.8, radius: 0.4, share: 0.28 },
  { build: birchGeometry, height: 6.0, radius: 0.24, share: 0.22 },
  { build: deadTreeGeometry, height: 4.8, radius: 0.26, share: 0.08 },
];

function rockGeometry(seed) {
  const rng = makeRng(seed);
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const m = 0.72 + rng() * 0.55;
    p.setXYZ(i, p.getX(i) * m, p.getY(i) * m * 0.8, p.getZ(i) * m);
  }
  geo.computeVertexNormals();
  return paint(geo, 0x8d8a82, 0.2);
}

function bushGeometry() {
  const rng = makeRng(515);
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const blob = paint(new THREE.IcosahedronGeometry(0.5 + rng() * 0.35, 1), i % 2 ? 0x45712f : 0x55833a, 0.35);
    blob.scale(1, 0.62, 1);
    blob.translate((rng() - 0.5) * 0.8, 0.32 + rng() * 0.15, (rng() - 0.5) * 0.8);
    parts.push(blob);
  }
  return mergeGeoms(parts);
}

function logGeometry() {
  const log = paint(new THREE.CylinderGeometry(0.22, 0.26, 3.2, 7), 0x6b5138, 0.3);
  log.rotateZ(Math.PI / 2);
  log.translate(0, 0.24, 0);
  const stub = paint(new THREE.CylinderGeometry(0.05, 0.07, 0.5, 5), 0x5d4630, 0.2);
  stub.rotateX(-0.5);
  stub.translate(0.6, 0.45, 0.1);
  return mergeGeoms([log, stub]);
}

function stumpGeometry() {
  const s = paint(new THREE.CylinderGeometry(0.3, 0.38, 0.55, 7), 0x77593a, 0.25);
  s.translate(0, 0.27, 0);
  return s;
}

function grassGeometry() {
  // 3 small blades in a tuft, tapered triangles, terrain-matched greens
  const blades = [];
  const rng = makeRng(777);
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(0.07, 0.34, 1, 1);
    const p = g.attributes.position;
    for (let v = 0; v < p.count; v++) {
      if (p.getY(v) > 0) p.setX(v, p.getX(v) * 0.15);
    }
    g.translate(0, 0.17, 0);
    const lean = (rng() - 0.5) * 0.5;
    g.rotateX(lean * 0.5);
    g.rotateY(rng() * Math.PI);
    g.translate((rng() - 0.5) * 0.22, 0, (rng() - 0.5) * 0.22);
    const n = g.attributes.position.count;
    const col = new Float32Array(n * 3);
    for (let v = 0; v < n; v++) {
      const t = g.attributes.position.getY(v) / 0.34;
      col[v * 3] = 0.30 + 0.12 * t;
      col[v * 3 + 1] = 0.44 + 0.14 * t;
      col[v * 3 + 2] = 0.16 + 0.06 * t;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    blades.push(g);
  }
  return mergeGeoms(blades);
}

function flowerGeometry() {
  const stem = paint(new THREE.PlaneGeometry(0.03, 0.26), 0x4a7a30);
  stem.translate(0, 0.13, 0);
  const head = paint(new THREE.PlaneGeometry(0.14, 0.14), 0xffffff);
  head.rotateX(-0.9);
  head.translate(0, 0.3, 0);
  return mergeGeoms([stem, head]);
}

const CELL = 10;
const keyOf = (x, z) => `${Math.floor(x / CELL)}|${Math.floor(z / CELL)}`;

export class Foliage {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.trees = [];
    this.hash = new Map();
    this.falling = [];
    this.fallMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });

    const rng = makeRng(20260610);
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    const nrm = new THREE.Vector3();
    const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });

    // ---- trees ----
    this.treeGeos = TREE_VARIANTS.map(v => v.build());
    this.treeMeshes = [];
    for (let v = 0; v < TREE_VARIANTS.length; v++) {
      const spec = TREE_VARIANTS[v];
      const count = Math.floor(SCATTER.trees * spec.share);
      const mesh = new THREE.InstancedMesh(this.treeGeos[v], treeMat, count);
      mesh.castShadow = true;
      let placed = 0, guard = 0;
      while (placed < count && guard++ < count * 60) {
        const x = (rng() * 2 - 1) * (WORLD_HALF - 12);
        const z = (rng() * 2 - 1) * (WORLD_HALF - 12);
        if (x * x + z * z < 30 * 30) continue;
        const dens = forestDensity(x, z);
        // dead trees prefer sparse areas; the rest clump in forests
        const keep = v === 3 ? (dens < 0.45 && rng() < 0.4) : rng() < dens * dens * 1.35;
        if (!keep) continue;
        getNormal(x, z, nrm);
        if (nrm.y < 0.78) continue;
        const h = getHeight(x, z);
        const s = 0.75 + rng() * 0.85;
        dummy.position.set(x, h - 0.15, z);
        dummy.rotation.set((rng() - 0.5) * 0.07, rng() * Math.PI * 2, (rng() - 0.5) * 0.07);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(placed, dummy.matrix);
        col.setHSL(0.27 + rng() * 0.07, 0.4 + rng() * 0.22, 0.45 + rng() * 0.14);
        mesh.setColorAt(placed, col);
        const rec = {
          variant: v, instanceId: placed, mesh,
          x, z, y: h, scale: s,
          height: spec.height * s,
          radius: spec.radius * s + 0.25,
          alive: true, culled: false,
        };
        this.trees.push(rec);
        const k = keyOf(x, z);
        if (!this.hash.has(k)) this.hash.set(k, []);
        this.hash.get(k).push(rec);
        placed++;
      }
      mesh.count = placed;
      mesh.userData.fullCount = placed;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);
      this.treeMeshes.push(mesh);
    }

    // ---- rocks ----
    this.rockMeshes = [];
    const rockMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0.04 });
    for (let v = 0; v < 3; v++) {
      const n = Math.floor(SCATTER.rocks / 3);
      const mesh = new THREE.InstancedMesh(rockGeometry(99 + v * 13), rockMat, n);
      mesh.castShadow = true;
      for (let i = 0; i < n; i++) {
        const x = (rng() * 2 - 1) * (WORLD_HALF - 10);
        const z = (rng() * 2 - 1) * (WORLD_HALF - 10);
        if (x * x + z * z < 24 * 24) { i--; continue; }
        const s = 0.45 + rng() * rng() * 2.6;
        dummy.position.set(x, getHeight(x, z) + s * 0.12, z);
        dummy.rotation.set(rng() * 0.5, rng() * Math.PI * 2, rng() * 0.5);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const g = 0.5 + rng() * 0.22;
        mesh.setColorAt(i, col.setRGB(g, g * 0.99, g * 0.95));
        if (s > 1.15) {
          const body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(s * 0.82),
            position: new CANNON.Vec3(x, getHeight(x, z) + s * 0.1, z),
            collisionFilterGroup: CG.TERRAIN,
            collisionFilterMask: -1,
          });
          body.userData = { kind: 'rock' };
          world.addBody(body);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);
      this.rockMeshes.push(mesh);
    }

    // ---- bushes (decor, denser at forest edges) ----
    const bushMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    this.bushes = new THREE.InstancedMesh(bushGeometry(), bushMat, SCATTER.bushes);
    this.bushes.castShadow = true;
    {
      let placed = 0, guard = 0;
      while (placed < SCATTER.bushes && guard++ < SCATTER.bushes * 40) {
        const x = (rng() * 2 - 1) * (WORLD_HALF - 12);
        const z = (rng() * 2 - 1) * (WORLD_HALF - 12);
        if (x * x + z * z < 26 * 26) continue;
        const dens = forestDensity(x, z);
        const edge = dens * (1 - dens) * 4; // peaks at the forest fringe
        if (rng() > Math.max(0.12, edge)) continue;
        getNormal(x, z, nrm);
        if (nrm.y < 0.8) continue;
        const s = 0.7 + rng() * 1.0;
        dummy.position.set(x, getHeight(x, z), z);
        dummy.rotation.set(0, rng() * Math.PI * 2, 0);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        this.bushes.setMatrixAt(placed, dummy.matrix);
        col.setHSL(0.26 + rng() * 0.06, 0.42 + rng() * 0.18, 0.4 + rng() * 0.12);
        this.bushes.setColorAt(placed, col);
        placed++;
      }
      this.bushes.count = placed;
      this.bushes.userData.fullCount = placed;
      this.bushes.instanceMatrix.needsUpdate = true;
      if (this.bushes.instanceColor) this.bushes.instanceColor.needsUpdate = true;
      scene.add(this.bushes);
    }

    // ---- deadfall: logs + stumps ----
    const deadMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    for (const [geoFn, count, key] of [[logGeometry, SCATTER.logs, 'logs'], [stumpGeometry, SCATTER.stumps, 'stumps']]) {
      const mesh = new THREE.InstancedMesh(geoFn(), deadMat, count);
      mesh.castShadow = true;
      let placed = 0, guard = 0;
      while (placed < count && guard++ < count * 50) {
        const x = (rng() * 2 - 1) * (WORLD_HALF - 14);
        const z = (rng() * 2 - 1) * (WORLD_HALF - 14);
        if (x * x + z * z < 28 * 28) continue;
        if (rng() > forestDensity(x, z) + 0.15) continue;
        const s = 0.7 + rng() * 0.8;
        dummy.position.set(x, getHeight(x, z), z);
        dummy.rotation.set(0, rng() * Math.PI * 2, 0);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(placed, dummy.matrix);
        placed++;
      }
      mesh.count = placed;
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
      this[key] = mesh;
    }

    // ---- grass + flowers (re-scattered around the camera) ----
    const gMat = new THREE.MeshStandardMaterial({
      vertexColors: true, side: THREE.DoubleSide, roughness: 1,
    });
    this.grass = new THREE.InstancedMesh(grassGeometry(), gMat, SCATTER.grass);
    this.grass.castShadow = false;
    this.grass.receiveShadow = false;
    this.scene.add(this.grass);

    this.flowers = new THREE.InstancedMesh(flowerGeometry(), new THREE.MeshStandardMaterial({
      vertexColors: true, side: THREE.DoubleSide, roughness: 1,
    }), SCATTER.flowers);
    this.flowers.castShadow = false;
    this.scene.add(this.flowers);

    this.grassAnchor = new THREE.Vector2(1e9, 1e9);
    this.grassRng = makeRng(5150);
    this.grassFrac = 1;
  }

  scatterGrass(cx, cz) {
    const dummy = new THREE.Object3D();
    const rng = this.grassRng;
    const R = 58;
    const n = Math.floor(SCATTER.grass * this.grassFrac);
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * R;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      const dens = 1 - forestDensity(x, z) * 0.45;
      const s = (0.65 + rng() * 0.65) * dens;
      dummy.position.set(x, getHeight(x, z), z);
      dummy.rotation.y = rng() * Math.PI;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      this.grass.setMatrixAt(i, dummy.matrix);
    }
    this.grass.count = n;
    this.grass.instanceMatrix.needsUpdate = true;

    // flowers prefer open meadows
    const fn = Math.floor(SCATTER.flowers * this.grassFrac);
    const fcol = new THREE.Color();
    const palette = [0xfff3f3, 0xffd95e, 0xe87fb4, 0xa8c8ff];
    for (let i = 0; i < fn; i++) {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * R;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      const open = 1 - forestDensity(x, z);
      const s = open > 0.55 ? 0.55 + rng() * 0.45 : 0;
      dummy.position.set(x, getHeight(x, z), z);
      dummy.rotation.y = rng() * Math.PI;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      this.flowers.setMatrixAt(i, dummy.matrix);
      fcol.set(palette[(rng() * palette.length) | 0]);
      this.flowers.setColorAt(i, fcol);
    }
    this.flowers.count = fn;
    this.flowers.instanceMatrix.needsUpdate = true;
    if (this.flowers.instanceColor) this.flowers.instanceColor.needsUpdate = true;

    this.grassAnchor.set(cx, cz);
  }

  treesNear(x, z, r) {
    const out = [];
    const c0x = Math.floor((x - r) / CELL), c1x = Math.floor((x + r) / CELL);
    const c0z = Math.floor((z - r) / CELL), c1z = Math.floor((z + r) / CELL);
    for (let cx = c0x; cx <= c1x; cx++) {
      for (let cz = c0z; cz <= c1z; cz++) {
        const arr = this.hash.get(`${cx}|${cz}`);
        if (!arr) continue;
        for (const t of arr) {
          if (!t.alive || t.culled) continue;
          const dx = t.x - x, dz = t.z - z;
          if (dx * dx + dz * dz <= r * r) out.push(t);
        }
      }
    }
    return out;
  }

  // Swap an instanced tree for a real falling rigid body.
  topple(rec, dirX, dirZ, power = 1) {
    if (!rec.alive) return;
    rec.alive = false;
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    rec.mesh.setMatrixAt(rec.instanceId, zero);
    rec.mesh.instanceMatrix.needsUpdate = true;

    if (this.falling.length >= SCATTER.maxFallingTrees) {
      const old = this.falling.shift();
      this.removeFalling(old);
    }
    const h = rec.height;
    const mesh = new THREE.Mesh(this.treeGeos[rec.variant], this.fallMat);
    mesh.scale.setScalar(rec.scale);
    mesh.castShadow = true;
    this.scene.add(mesh);

    const body = new CANNON.Body({
      mass: 90,
      position: new CANNON.Vec3(rec.x, rec.y + h * 0.5, rec.z),
      collisionFilterGroup: CG.DEBRIS,
      collisionFilterMask: CG.TERRAIN | CG.PROP,
      angularDamping: 0.55,
      linearDamping: 0.08,
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(rec.radius * 0.8, h * 0.46, rec.radius * 0.8)));
    body.userData = { kind: 'fallingTree' };
    this.world.addBody(body);

    const len = Math.hypot(dirX, dirZ) || 1;
    const push = 200 * power;
    // impulse near the canopy (COM-relative) so the trunk tips over
    body.applyImpulse(
      new CANNON.Vec3((dirX / len) * push, push * 0.15, (dirZ / len) * push),
      new CANNON.Vec3(0, h * 0.35, 0),
    );

    this.falling.push({ mesh, body, t: 0, life: 7, halfH: h * 0.5 });
  }

  removeFalling(f) {
    this.scene.remove(f.mesh);
    this.world.removeBody(f.body);
  }

  setTreeFraction(frac) {
    for (const mesh of this.treeMeshes) {
      mesh.count = Math.floor(mesh.userData.fullCount * frac);
    }
    for (const t of this.trees) {
      t.culled = t.instanceId >= Math.floor(t.mesh.userData.fullCount * frac);
    }
    if (this.bushes) this.bushes.count = Math.floor(this.bushes.userData.fullCount * frac);
  }

  setGrassFraction(frac) {
    this.grassFrac = frac;
    this.grassAnchor.set(1e9, 1e9); // force re-scatter
  }

  update(dt, camX, camZ) {
    if (this.grassAnchor.distanceTo(new THREE.Vector2(camX, camZ)) > 22) {
      this.scatterGrass(camX, camZ);
    }
    for (let i = this.falling.length - 1; i >= 0; i--) {
      const f = this.falling[i];
      f.t += dt;
      f.mesh.position.copy(f.body.position);
      f.mesh.quaternion.copy(f.body.quaternion);
      f.mesh.translateY(-f.halfH);
      if (f.t > f.life - 1.2) {
        f.mesh.position.y -= (f.t - (f.life - 1.2)) * 2.2;
      }
      if (f.t >= f.life) {
        this.removeFalling(f);
        this.falling.splice(i, 1);
      }
    }
  }
}

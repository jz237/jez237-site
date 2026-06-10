// Instanced forests, rocks and grass. Trees live in a spatial hash so
// shells/tanks can interact with them; hit trees swap to real falling
// rigid bodies (capped pool), then fade out.

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

function paint(geo, color) {
  const c = new THREE.Color(color);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

// --- tree geometry variants (origin at ground) ---------------------------
function coniferGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.16, 0.26, 2.2, 5), 0x6e4f30);
  trunk.translate(0, 1.1, 0);
  const c1 = paint(new THREE.ConeGeometry(1.9, 3.4, 7), 0x2f6b2e);
  c1.translate(0, 3.2, 0);
  const c2 = paint(new THREE.ConeGeometry(1.45, 2.7, 7), 0x357730);
  c2.translate(0, 5.0, 0);
  const c3 = paint(new THREE.ConeGeometry(0.95, 2.0, 6), 0x3d8336);
  c3.translate(0, 6.6, 0);
  return mergeGeoms([trunk, c1, c2, c3]); // ~7.6m tall
}

function broadleafGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.2, 0.32, 2.8, 5), 0x7a5a38);
  trunk.translate(0, 1.4, 0);
  const blob = paint(new THREE.IcosahedronGeometry(2.1, 1), 0x4d8a35);
  blob.scale(1, 0.82, 1);
  blob.translate(0, 4.4, 0);
  const blob2 = paint(new THREE.IcosahedronGeometry(1.3, 1), 0x569441);
  blob2.translate(0.9, 5.3, 0.4);
  return mergeGeoms([trunk, blob, blob2]); // ~6.5m tall
}

function rockGeometry(seed) {
  const rng = makeRng(seed);
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const m = 0.72 + rng() * 0.55;
    p.setXYZ(i, p.getX(i) * m, p.getY(i) * m * 0.8, p.getZ(i) * m);
  }
  geo.computeVertexNormals();
  return paint(geo, 0x8d8a82);
}

function grassGeometry() {
  // 3 small blades in a tuft, tapered triangles, terrain-matched greens
  const blades = [];
  const rng = makeRng(777);
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(0.07, 0.34, 1, 1);
    // taper: pinch the top vertices inwards
    const p = g.attributes.position;
    for (let v = 0; v < p.count; v++) {
      if (p.getY(v) > 0) p.setX(v, p.getX(v) * 0.15);
    }
    g.translate(0, 0.17, 0);
    const lean = (rng() - 0.5) * 0.5;
    g.rotateX(lean * 0.5);
    g.rotateY(rng() * Math.PI);
    g.translate((rng() - 0.5) * 0.22, 0, (rng() - 0.5) * 0.22);
    // low-contrast gradient close to the terrain greens
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

const CELL = 10;
const keyOf = (x, z) => `${Math.floor(x / CELL)}|${Math.floor(z / CELL)}`;

export class Foliage {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.trees = [];          // records
    this.hash = new Map();
    this.falling = [];
    this.fallMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });

    const rng = makeRng(20260610);
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();

    // ---- trees ----
    this.treeGeos = [coniferGeometry(), broadleafGeometry()];
    this.treeMeshes = [];
    const counts = [Math.floor(SCATTER.trees * 0.62), Math.ceil(SCATTER.trees * 0.38)];
    const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    const nrm = new THREE.Vector3();

    for (let v = 0; v < 2; v++) {
      const mesh = new THREE.InstancedMesh(this.treeGeos[v], treeMat, counts[v]);
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      let placed = 0, guard = 0;
      while (placed < counts[v] && guard++ < counts[v] * 60) {
        const x = (rng() * 2 - 1) * (WORLD_HALF - 12);
        const z = (rng() * 2 - 1) * (WORLD_HALF - 12);
        const d2 = x * x + z * z;
        if (d2 < 30 * 30) continue;                     // spawn clearing
        const dens = forestDensity(x, z);
        if (rng() > dens * dens * 1.35) continue;       // forest clumping
        getNormal(x, z, nrm);
        if (nrm.y < 0.78) continue;                     // too steep
        const h = getHeight(x, z);
        const s = 0.75 + rng() * 0.85;
        dummy.position.set(x, h - 0.15, z);
        dummy.rotation.set((rng() - 0.5) * 0.07, rng() * Math.PI * 2, (rng() - 0.5) * 0.07);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(placed, dummy.matrix);
        col.setHSL(0.28 + rng() * 0.06, 0.42 + rng() * 0.2, 0.42 + rng() * 0.14);
        mesh.setColorAt(placed, col);
        const rec = {
          variant: v, instanceId: placed, mesh,
          x, z, y: h, scale: s,
          height: (v === 0 ? 7.6 : 6.5) * s,
          radius: 0.3 * s + 0.25,
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
        // only large rocks get physics
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

    // ---- grass (re-scattered around the camera) ----
    const gMat = new THREE.MeshStandardMaterial({
      vertexColors: true, side: THREE.DoubleSide, roughness: 1,
    });
    this.grass = new THREE.InstancedMesh(grassGeometry(), gMat, SCATTER.grass);
    this.grass.castShadow = false;
    this.grass.receiveShadow = false;
    this.scene.add(this.grass);
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
      // mesh origin is at trunk base; body centre is mid-trunk
      f.mesh.translateY(-f.halfH);
      if (f.t > f.life - 1.2) {
        f.mesh.position.y -= (f.t - (f.life - 1.2)) * 2.2; // sink away
      }
      if (f.t >= f.life) {
        this.removeFalling(f);
        this.falling.splice(i, 1);
      }
    }
  }
}

// Instanced forests, rocks, bushes, deadfall and grass/flowers. Trees live
// in a spatial hash so shells/tanks can interact with them; hit trees swap
// to real falling rigid bodies (capped pool), then fade out.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { installTreeFade, treeLodAttribute, treeBlend } from './tree-lod.js?v=polish2';
import { barkTexture } from './surface-art.js?v=polish2';
import { woodlandMaterial, woodlandParts, undergrowthParts, nearTreeParts, nearLeafMaterial } from './tree-art.js?v=polish2';
import { getHeight, getNormal, forestDensity } from './terrain.js?v=polish2';
import { makeRng } from './noise.js?v=polish2';
import { WORLD_HALF, SCATTER, CG } from './config.js?v=polish2';

// --- tiny non-indexed geometry merger (avoids vendoring utils) ----------
function mergeGeoms(geoms) {
  const nonIndexed = geoms.map(g => (g.index ? g.toNonIndexed() : g));
  let vcount = 0;
  for (const g of nonIndexed) vcount += g.attributes.position.count;
  const posArr = new Float32Array(vcount * 3);
  const norArr = new Float32Array(vcount * 3);
  const colArr = new Float32Array(vcount * 3);
  const uvArr = new Float32Array(vcount * 2);
  let off = 0;
  for (const g of nonIndexed) {
    posArr.set(g.attributes.position.array, off * 3);
    norArr.set(g.attributes.normal.array, off * 3);
    colArr.set(g.attributes.color.array, off * 3);
    if (g.attributes.uv) uvArr.set(g.attributes.uv.array, off * 2);
    off += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(norArr, 3));
  out.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
  // Merger owns the input geometries; retain only the final GPU buffer.
  for (const g of new Set([...geoms, ...nonIndexed])) g.dispose();
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
function coniferGeometry() { return mergeGeoms(woodlandParts(0)); }
function oakGeometry() { return mergeGeoms(woodlandParts(1)); }
function birchGeometry() { return mergeGeoms(woodlandParts(2)); }

function deadTreeGeometry() {
  const parts = [];
  function limb(a, b, base, tip) {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
    const delta = to.clone().sub(from);
    const g = paint(new THREE.CylinderGeometry(tip, base, delta.length(), 5, 1, true), 0x81705c, 0.12);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    g.translate(...from.add(to).multiplyScalar(0.5).toArray());
    parts.push(g);
  }
  limb([0, 0, 0], [0.12, 2.7, 0], 0.24, 0.13);
  limb([0.12, 2.7, 0], [-0.28, 4.8, 0.16], 0.13, 0.025);
  limb([0.07, 2.0, 0], [0.95, 3.12, 0.42], 0.105, 0.035);
  limb([0.95, 3.12, 0.42], [1.04, 3.9, 0.65], 0.035, 0.009);
  limb([0.1, 2.9, 0], [-0.98, 3.58, -0.32], 0.08, 0.016);
  limb([-0.08, 3.65, 0.06], [0.28, 4.13, -0.65], 0.045, 0.01);
  return mergeGeoms(parts);
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
    // Welded positions must get the same displacement on every face.
    // Per-vertex random values tear this non-indexed rock into spikes.
    const m = 0.91 + Math.sin(p.getX(i) * 5.3 + p.getY(i) * 3.7 + p.getZ(i) * 4.1 + seed) * 0.18;
    p.setXYZ(i, p.getX(i) * m, p.getY(i) * m * 0.8, p.getZ(i) * m);
  }
  geo.computeVertexNormals();
  return paint(geo, 0x8d8a82, 0.2);
}

function bushGeometry() { return mergeGeoms(undergrowthParts()); }

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
  // Five fine tapered blades, one triangle each. Lean is baked once;
  // the existing shader supplies wind without any per-blade CPU updates.
  const blades = [], rng = makeRng(777);
  for (let i = 0; i < 5; i++) {
    const h = 0.20 + rng() * 0.16;
    const g = new THREE.BufferGeometry();
    const lean = (rng() - 0.5) * 0.20;
    g.setAttribute('position', new THREE.Float32BufferAttribute([
      -0.026, 0, 0, 0.026, 0, 0, lean, h, 0.055,
    ], 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute([
      0.16, 0.23, 0.07, 0.16, 0.23, 0.07, 0.37, 0.43, 0.20,
    ], 3));
    g.computeVertexNormals();
    g.rotateY(rng() * Math.PI * 2);
    g.translate((rng() - 0.5) * 0.3, 0, (rng() - 0.5) * 0.3);
    blades.push(g);
  }
  return mergeGeoms(blades);
}

// Gentle vertex-shader wind: bend scales with height² so bases stay put.
// Phase comes from the instance's world position, so tufts don't sway in
// lockstep.
// Flatteners: vec4(x, z, radius, strength) — tanks, their fresh track
// paths and blasts press grass down (see Foliage.setFlatteners).
export const FLAT_SLOTS = 24;
function addWind(mat, windU, strength, flat) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uWind = windU;
    sh.uniforms.uFlat = flat;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uWind;\nuniform vec4 uFlat[${FLAT_SLOTS}];`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        float ph = instanceMatrix[3][0] * 0.71 + instanceMatrix[3][2] * 0.53;
        float bend = position.y * position.y * ${strength.toFixed(3)};
        transformed.x += (sin(uWind * 1.7 + ph) + sin(uWind * 2.9 + ph * 1.7) * 0.5) * bend;
        transformed.z += cos(uWind * 1.3 + ph * 1.1) * bend * 0.6;
        vec2 ip = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
        float press = 0.0;
        for (int i = 0; i < ${FLAT_SLOTS}; i++) {
          vec4 f = uFlat[i];
          float k = f.w * (1.0 - smoothstep(f.z * 0.55, f.z, distance(ip, f.xy)));
          press = max(press, k);
        }
        // squash and lay the blades over
        transformed.x += position.y * press * 0.9;
        transformed.y *= 1.0 - 0.82 * press;
      }`);
  };
  mat.customProgramCacheKey = () => 'grass-wind-flat1';
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
    this.windU = { value: 0 };
    this.hash = new Map();
    this.falling = [];
    this.fallMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });

    const rng = makeRng(20260610);
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    const nrm = new THREE.Vector3();
    const treeMat = woodlandMaterial();
    this.treeMaterial = treeMat;
    installTreeFade(treeMat,0,this.windU);

    // ---- trees ----
    this.treeGeos = TREE_VARIANTS.map(v => v.build());
    this.treeMeshes = [];
    for (let v = 0; v < TREE_VARIANTS.length; v++) {
      const spec = TREE_VARIANTS[v];
      const count = Math.floor(SCATTER.trees * spec.share);
      const mesh = new THREE.InstancedMesh(this.treeGeos[v], v === 3 ? this.fallMat : treeMat, count);
      mesh.castShadow = true;
      if(v<3){mesh.customDepthMaterial=treeMat.lodDepth;treeLodAttribute(mesh.geometry,count);}
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
        // wider hue spread, plus occasional golden accents on the leafy trees
        if ((v === 1 || v === 2) && rng() < 0.08) {
          col.setHSL(0.10 + rng() * 0.05, 0.5 + rng() * 0.15, 0.5 + rng() * 0.1);
        } else {
          col.setHSL(0.24 + rng() * 0.11, 0.36 + rng() * 0.26, 0.42 + rng() * 0.17);
        }
        // The atlas already carries leaf colour; use subtle neutral variation.
        // Keep random draws above unchanged so physics/tree placements stay stable.
        if (v !== 3) col.setRGB(0.88 + col.r * 0.22, 0.88 + col.g * 0.16, 0.86 + col.b * 0.16);
        else col.setRGB(0.90, 0.88, 0.84);
        mesh.setColorAt(placed, col);
        const rec = {
          variant: v, instanceId: placed, mesh,
          x, z, y: h, scale: s,
          height: spec.height * s,
          radius: spec.radius * s + 0.25,
          alive: true, culled: false,
          rotation: dummy.quaternion.clone(),
          baseMatrix: dummy.matrix.clone(), nearSlot: -1, lodFrom:0, lodTo:0, lodStart:0,
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

    // Bounded close-detail pool. Far trees retain their six/eight-triangle
    // impostors; selection uses the existing spatial hash at 6 Hz.
    this.nearCap = 28; this.nearRadius = 28; this.nearTimer = 0;
    this.nearSelected = []; this.nearResidents=[]; this.nearDirty = true;
    this.nearWoodMaterial = new THREE.MeshLambertMaterial({ map: barkTexture(), vertexColors: true });
    this.nearGeos = [0,1,2].map(v => {
      const parts=nearTreeParts(v);
      return {wood:mergeGeoms(parts.wood),leaves:mergeGeoms(parts.leaves)};
    });
    const nearLeaf = nearLeafMaterial(false), nearNeedle = nearLeafMaterial(true);
    this.nearLeafMaterials = [nearNeedle,nearLeaf,nearLeaf];
    for(const mat of [nearNeedle,nearLeaf,this.nearWoodMaterial])installTreeFade(mat,1,this.windU);
    this.nearMeshes = this.nearGeos.map((geos,v) => {
      const leaves=new THREE.InstancedMesh(geos.leaves,this.nearLeafMaterials[v],80);
      const wood=new THREE.InstancedMesh(geos.wood,this.nearWoodMaterial,80);
      for(const m of [leaves,wood]) {treeLodAttribute(m.geometry,80);m.customDepthMaterial=m.material.lodDepth;m.count=0;m.frustumCulled=false;m.castShadow=true;scene.add(m);}
      return {leaves,wood};
    });
    this.nearZero = new THREE.Matrix4().makeScale(0,0,0);
    this.nearTint = new THREE.Color();

    // ---- rocks ----
    this.rockMeshes = []; this.rockContacts=[];
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
        this.rockContacts.push({x,z,scale:s});
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
    const bushMat = treeMat;
    this.bushes = new THREE.InstancedMesh(bushGeometry(), bushMat, SCATTER.bushes);
    this.bushes.castShadow = true;
    treeLodAttribute(this.bushes.geometry,SCATTER.bushes);
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
        col.setRGB(0.90 + col.r * 0.15, 0.91 + col.g * 0.12, 0.85 + col.b * 0.15);
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
    this.flat = { value: Array.from({ length: FLAT_SLOTS }, () => new THREE.Vector4(0, 0, 0, 0)) };
    addWind(gMat, this.windU, 0.24, this.flat);
    this.grass = new THREE.InstancedMesh(grassGeometry(), gMat, SCATTER.grass);
    this.grass.castShadow = false;
    this.grass.receiveShadow = false;
    this.scene.add(this.grass);

    const fMat = new THREE.MeshStandardMaterial({
      vertexColors: true, side: THREE.DoubleSide, roughness: 1,
    });
    addWind(fMat, this.windU, 0.4, this.flat);
    this.flowers = new THREE.InstancedMesh(flowerGeometry(), fMat, SCATTER.flowers);
    this.flowers.castShadow = false;
    this.scene.add(this.flowers);

    this.grassAnchor = new THREE.Vector2(1e9, 1e9);
    this.grassRng = makeRng(5150);
    this.grassFrac = 1;
  }

  scatterGrass(cx, cz) {
    const dummy = new THREE.Object3D();
    const rng = this.grassRng;
    const gcol = new THREE.Color();
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
      // colour multiplier over the baked blade gradient: mostly fresh
      // saturated greens matching the terrain, a scattering of dried tufts
      if (rng() < 0.12) gcol.setRGB(1.25 + rng() * 0.2, 1.0 + rng() * 0.12, 0.45 + rng() * 0.12);
      else gcol.setRGB(0.72 + rng() * 0.25, 0.95 + rng() * 0.25, 0.5 + rng() * 0.2);
      this.grass.setColorAt(i, gcol);
    }
    this.grass.count = n;
    this.grass.instanceMatrix.needsUpdate = true;
    if (this.grass.instanceColor) this.grass.instanceColor.needsUpdate = true;

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

  // list of {x, z, r, s}; extra entries are dropped, missing slots cleared
  setFlatteners(list) {
    const v = this.flat.value;
    for (let i = 0; i < FLAT_SLOTS; i++) {
      const f = list[i];
      if (f) v[i].set(f.x, f.z, f.r, f.s); else v[i].set(0, 0, 0, 0);
    }
  }

  setNearDetail(cap, radius) {
    this.nearCap=Math.min(40,Math.max(0,cap));this.nearRadius=radius;this.nearDirty=true;
  }

  updateNearTrees(x,z) {
    const time=this.windU.value, previous=new Set(this.nearSelected);
    const candidates=this.treesNear(x,z,this.nearRadius+3).filter(t=>t.variant<3&&(previous.has(t)||Math.hypot(t.x-x,t.z-z)<this.nearRadius));
    const rank=t=>Math.hypot(t.x-x,t.z-z)-(previous.has(t)?3:0);
    candidates.sort((a,b)=>rank(a)-rank(b));
    this.nearSelected=candidates.slice(0,this.nearCap);
    const desired=new Set(this.nearSelected), all=new Set([...this.nearResidents,...desired]);
    const residents=[];
    for(const t of all) {
      t.nearSlot=-1;
      const progress=treeBlend(t,time);
      const target=t.alive&&!t.culled&&desired.has(t)
        ? 1 : 0;
      if(Math.abs(target-t.lodTo)>.015) {t.lodFrom=progress;t.lodTo=target;t.lodStart=time;}
      const attr=t.mesh.geometry.attributes.aTreeLod;
      attr.setXYZ(t.instanceId,t.lodFrom,t.lodTo,t.lodStart);attr.needsUpdate=true;
      // A fully replaced far tree skips rasterization; restore it before any fade-out.
      if(t.alive)t.mesh.setMatrixAt(t.instanceId,target===1&&progress>.999?this.nearZero:t.baseMatrix);
      t.mesh.instanceMatrix.needsUpdate=true;
      if(t.alive&&(target>.001||progress>.001))residents.push(t);
    }
    // At most forty incoming plus forty outgoing trees; never grow with the forest.
    residents.sort((a,b)=>Number(desired.has(b))-Number(desired.has(a)));
    const overlapCap=this.nearCap*2;
    this.nearResidents=residents.slice(0,overlapCap);
    for(const t of residents.slice(overlapCap)) {
      t.lodFrom=t.lodTo=0;t.mesh.geometry.attributes.aTreeLod.setXYZ(t.instanceId,0,0,time);
      t.mesh.setMatrixAt(t.instanceId,t.baseMatrix);
    }
    const counts=[0,0,0];
    for(const t of this.nearResidents) {
      const slot=counts[t.variant]++, pair=this.nearMeshes[t.variant];t.nearSlot=slot;
      t.mesh.getColorAt(t.instanceId,this.nearTint);
      for(const m of [pair.leaves,pair.wood]) {
        m.setMatrixAt(slot,t.baseMatrix);m.setColorAt(slot,this.nearTint);
        m.geometry.attributes.aTreeLod.setXYZ(slot,t.lodFrom,t.lodTo,t.lodStart);
      }
    }
    this.nearMeshes.forEach((pair,v)=>{
      for(const m of [pair.leaves,pair.wood]) {
        m.count=counts[v];m.instanceMatrix.needsUpdate=true;
        m.geometry.attributes.aTreeLod.needsUpdate=true;
        if(m.instanceColor)m.instanceColor.needsUpdate=true;
      }
    });
    this.nearDirty=false;
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
    const sourceMaterial = rec.variant === 3 ? this.fallMat : this.treeMaterial;
    const material = sourceMaterial.clone();
    material.onBeforeCompile = sourceMaterial.onBeforeCompile;
    material.customProgramCacheKey = sourceMaterial.customProgramCacheKey;
    rec.mesh.getColorAt(rec.instanceId, material.color);
    let mesh;
    if(rec.nearSlot>=0 && rec.variant<3) {
      mesh=new THREE.Group();
      material.dispose();
      const leafSource=this.nearLeafMaterials[rec.variant],leafMat=leafSource.clone();
      leafMat.onBeforeCompile=leafSource.onBeforeCompile;leafMat.customProgramCacheKey=leafSource.customProgramCacheKey;
      rec.mesh.getColorAt(rec.instanceId,leafMat.color);
      const crown=new THREE.Mesh(this.nearGeos[rec.variant].leaves,leafMat);
      const woodMat=this.nearWoodMaterial.clone();woodMat.color.copy(leafMat.color);
      const wood=new THREE.Mesh(this.nearGeos[rec.variant].wood,woodMat);
      crown.castShadow=wood.castShadow=true;mesh.add(crown,wood);
      const pair=this.nearMeshes[rec.variant];
      for(const m of [pair.leaves,pair.wood]){m.setMatrixAt(rec.nearSlot,this.nearZero);m.instanceMatrix.needsUpdate=true;}
      rec.nearSlot=-1;this.nearDirty=true;
    } else mesh = new THREE.Mesh(this.treeGeos[rec.variant], material);
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
    body.quaternion.copy(rec.rotation);
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
    f.mesh.traverse(o=>{if(o.isMesh)o.material.dispose();});
    this.world.removeBody(f.body);
  }

  setTreeFraction(frac) {
    this.nearDirty = true;
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
    this.windU.value += dt;
    this.nearTimer += dt;
    if(this.nearDirty || this.nearTimer >= 0.16) {
      this.nearTimer=0;this.updateNearTrees(camX,camZ);
    }
    if (Math.hypot(this.grassAnchor.x - camX, this.grassAnchor.y - camZ) > 22) {
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

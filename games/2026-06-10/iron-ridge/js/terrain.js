// Procedural heightmap terrain. Visuals: slope/height-blended detail
// textures (canvas-painted grass/dirt/rock) over baked vertex tinting and
// concavity AO. Physics: matching cannon-es Heightfield for contacts, plus
// an exact analytic ray helper (cannon's heightfield rays are unreliable).

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Simplex2, makeRng } from './noise.js';
import { WORLD_SIZE, WORLD_HALF, TERRAIN_SEGS, CG } from './config.js';

const simplex = new Simplex2(90210);
const detail = new Simplex2(417);

// Height function used by visuals, physics, scattering and AI alike.
export function getHeight(x, z) {
  const nx = x / WORLD_SIZE, nz = z / WORLD_SIZE;
  // broad rolling ridges
  let h = simplex.fbm(nx * 2.3, nz * 2.3, 4, 2.1, 0.5) * 11.0;
  // medium hills
  h += simplex.fbm(nx * 5.5 + 31.7, nz * 5.5 - 12.2, 3, 2, 0.5) * 4.0;
  // fine bumps
  h += detail.noise(nx * 26, nz * 26) * 0.55;

  // flatten the central spawn clearing
  const d = Math.sqrt(x * x + z * z);
  const flat = THREE.MathUtils.smoothstep(d, 18, 70);
  h *= 0.15 + 0.85 * flat;

  // raise a bowl rim near the world border so you can't see the edge
  const edge = Math.max(Math.abs(x), Math.abs(z)) / WORLD_HALF;
  if (edge > 0.78) {
    const t = (edge - 0.78) / 0.22;
    h += t * t * 26;
  }
  return h;
}

export function getNormal(x, z, out = new THREE.Vector3()) {
  const e = 1.2;
  const hl = getHeight(x - e, z), hr = getHeight(x + e, z);
  const hd = getHeight(x, z - e), hu = getHeight(x, z + e);
  out.set(hl - hr, 2 * e, hd - hu).normalize();
  return out;
}

// Analytic segment-vs-terrain intersection. cannon-es Ray vs Heightfield
// misses ~8% of casts (known engine bug), so wheel/shell rays merge this
// exact test in. Returns {x, y, z, nx, ny, nz, distance} or null.
const _n = new THREE.Vector3();
export function raycastTerrain(fx, fy, fz, tx, ty, tz) {
  const dx = tx - fx, dy = ty - fy, dz = tz - fz;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len < 1e-6) return null;
  const steps = Math.min(64, Math.max(2, Math.ceil(len / 1.5)));
  let prevT = 0;
  let prevAbove = fy - getHeight(fx, fz) > 0;
  if (!prevAbove) prevAbove = true; // started underground; treat as immediate surface search
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = fx + dx * t, y = fy + dy * t, z = fz + dz * t;
    const above = y - getHeight(x, z) > 0;
    if (prevAbove && !above) {
      // bisect the crossing
      let lo = prevT, hi = t;
      for (let k = 0; k < 8; k++) {
        const mid = (lo + hi) / 2;
        const my = fy + dy * mid;
        if (my - getHeight(fx + dx * mid, fz + dz * mid) > 0) lo = mid;
        else hi = mid;
      }
      const ht = (lo + hi) / 2;
      const hx = fx + dx * ht, hz = fz + dz * ht;
      const hy = getHeight(hx, hz);
      getNormal(hx, hz, _n);
      return { x: hx, y: hy, z: hz, nx: _n.x, ny: _n.y, nz: _n.z, distance: len * ht };
    }
    prevAbove = above;
    prevT = t;
  }
  return null;
}

// Forest density 0..1 — used by foliage scatter and to keep clearings open.
export function forestDensity(x, z) {
  const n = simplex.fbm(x / 190 + 7.3, z / 190 - 3.1, 3, 2, 0.55);
  return THREE.MathUtils.clamp((n + 0.25) * 1.1, 0, 1);
}

// ---------------------------------------------------------------------
// canvas-painted detail textures (procedural, tile seamlessly enough)
function makeDetailTexture(base, speckles, opts = {}) {
  const s = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  const rng = makeRng(opts.seed ?? 1);
  for (const sp of speckles) {
    ctx.fillStyle = sp.color;
    for (let i = 0; i < sp.n; i++) {
      const x = rng() * s, y = rng() * s;
      const w = sp.w[0] + rng() * (sp.w[1] - sp.w[0]);
      const h = sp.h[0] + rng() * (sp.h[1] - sp.h[0]);
      if (sp.blade) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rng() - 0.5) * 0.9);
        ctx.fillRect(-w / 2, -h, w, h);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, rng() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function grassTexture() {
  return makeDetailTexture('#7da558', [
    { color: 'rgba(96,140,62,0.65)', n: 900, w: [1, 2.2], h: [4, 9], blade: true, },
    { color: 'rgba(140,176,90,0.5)', n: 700, w: [1, 2], h: [3, 8], blade: true },
    { color: 'rgba(60,96,44,0.45)', n: 350, w: [1, 1.8], h: [3, 6], blade: true },
    { color: 'rgba(177,196,120,0.35)', n: 240, w: [1, 1.6], h: [2, 5], blade: true },
  ], { seed: 11 });
}

function dirtTexture() {
  return makeDetailTexture('#8a6f4d', [
    { color: 'rgba(116,90,60,0.5)', n: 420, w: [2, 7], h: [1.5, 5] },
    { color: 'rgba(158,130,94,0.45)', n: 320, w: [1.5, 5], h: [1, 4] },
    { color: 'rgba(84,64,42,0.5)', n: 220, w: [1, 3.5], h: [1, 3] },
    { color: 'rgba(60,46,32,0.55)', n: 90, w: [1, 2.2], h: [1, 2.2] },
  ], { seed: 22 });
}

function rockTexture() {
  return makeDetailTexture('#8d8a82', [
    { color: 'rgba(110,106,98,0.55)', n: 260, w: [3, 12], h: [1, 4] },
    { color: 'rgba(158,154,146,0.5)', n: 240, w: [2, 9], h: [1, 3.5] },
    { color: 'rgba(70,68,64,0.5)', n: 150, w: [1, 6], h: [0.8, 2.2] },
  ], { seed: 33 });
}

const COL_TINT_A = new THREE.Color(0xa8c188);   // grass tint variation (multiplies texture)
const COL_TINT_B = new THREE.Color(0xc4d49a);
const COL_DRY = new THREE.Color(0xc9c693);

export function buildTerrain(scene, world) {
  // ---- visual mesh ----
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const splat = new Float32Array(pos.count * 2);  // x: dirt, y: rock
  const c = new THREE.Color();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = getHeight(x, z);
    pos.setY(i, h);

    getNormal(x, z, n);
    const slope = 1 - n.y;
    const tint = detail.noise(x * 0.045, z * 0.045) * 0.5 + 0.5;
    const patch = detail.noise(x * 0.012 + 50, z * 0.012 - 20) * 0.5 + 0.5;

    // splat weights
    let dirt = 0, rock = 0;
    if (patch < 0.34) dirt = Math.min(1, (0.34 - patch) * 4.5);
    dirt = Math.max(dirt, THREE.MathUtils.clamp((slope - 0.10) * 6, 0, 0.55));
    rock = THREE.MathUtils.clamp((slope - 0.17) * 7.5, 0, 1);
    if (h > 15) rock = Math.max(rock, Math.min(1, (h - 15) / 9));
    splat[i * 2] = dirt;
    splat[i * 2 + 1] = rock;

    // tint (multiplies the detail texture)
    c.copy(COL_TINT_A).lerp(COL_TINT_B, tint);
    if (patch > 0.62) c.lerp(COL_DRY, (patch - 0.62) * 1.8);

    // cheap baked AO: valleys/concave spots darken, crests brighten
    const e = 4.5;
    const avg = (getHeight(x - e, z) + getHeight(x + e, z) + getHeight(x, z - e) + getHeight(x, z + e)) / 4;
    const concavity = THREE.MathUtils.clamp((avg - h) * 0.22, -0.16, 0.22);
    const ao = 1 - concavity;
    const m = (0.94 + detail.noise(x * 0.35, z * 0.35) * 0.06) * ao;
    colors[i * 3] = c.r * m;
    colors[i * 3 + 1] = c.g * m;
    colors[i * 3 + 2] = c.b * m;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSplat', new THREE.BufferAttribute(splat, 2));
  geo.computeVertexNormals();

  const gTex = grassTexture(), dTex = dirtTexture(), rTex = rockTexture();
  const REPEAT = WORLD_SIZE / 7; // one tile every ~7m

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0.0,
    map: gTex,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.dirtMap = { value: dTex };
    shader.uniforms.rockMap = { value: rTex };
    shader.uniforms.detailRepeat = { value: REPEAT };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec2 aSplat;
        varying vec2 vSplat;`)
      .replace('#include <uv_vertex>', `#include <uv_vertex>
        vSplat = aSplat;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D dirtMap;
        uniform sampler2D rockMap;
        uniform float detailRepeat;
        varying vec2 vSplat;`)
      .replace('#include <map_fragment>', `
        vec2 dUv = vMapUv * detailRepeat;
        vec4 gCol = texture2D(map, dUv);
        vec4 dCol = texture2D(dirtMap, dUv * 1.31);
        vec4 rCol = texture2D(rockMap, dUv * 0.71);
        vec4 texelColor = mix(mix(gCol, dCol, clamp(vSplat.x, 0.0, 1.0)), rCol, clamp(vSplat.y, 0.0, 1.0));
        diffuseColor *= texelColor;
      `);
  };

  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'terrain';
  scene.add(mesh);

  // ---- physics heightfield (same height function, same resolution) ----
  const N = TERRAIN_SEGS + 1;
  const elementSize = WORLD_SIZE / TERRAIN_SEGS;
  const data = [];
  for (let i = 0; i < N; i++) {
    data.push(new Array(N));
    for (let j = 0; j < N; j++) {
      const x = -WORLD_HALF + i * elementSize;
      const z = WORLD_HALF - j * elementSize;
      data[i][j] = getHeight(x, z);
    }
  }
  const shape = new CANNON.Heightfield(data, { elementSize });
  const body = new CANNON.Body({
    mass: 0,
    collisionFilterGroup: CG.TERRAIN,
    collisionFilterMask: -1,
  });
  body.addShape(shape);
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  body.position.set(-WORLD_HALF, 0, WORLD_HALF);
  body.userData = { kind: 'terrain' };
  world.addBody(body);

  return { mesh, body };
}

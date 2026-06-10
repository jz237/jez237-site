// Procedural heightmap terrain: Three mesh with slope/height vertex colors
// and a matching cannon-es Heightfield for real collisions.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Simplex2 } from './noise.js';
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

const COL_GRASS_A = new THREE.Color(0x6da348);
const COL_GRASS_B = new THREE.Color(0x86b554);
const COL_DRY = new THREE.Color(0x9aa050);
const COL_DIRT = new THREE.Color(0x8a6f4d);
const COL_ROCK = new THREE.Color(0x8d8a82);

export function buildTerrain(scene, world) {
  // ---- visual mesh ----
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = getHeight(x, z);
    pos.setY(i, h);

    getNormal(x, z, n);
    const slope = 1 - n.y; // 0 flat .. ~1 cliff
    const tint = detail.noise(x * 0.045, z * 0.045) * 0.5 + 0.5;
    const patch = detail.noise(x * 0.012 + 50, z * 0.012 - 20) * 0.5 + 0.5;

    c.copy(COL_GRASS_A).lerp(COL_GRASS_B, tint);
    if (patch > 0.62) c.lerp(COL_DRY, (patch - 0.62) * 2.2);
    if (patch < 0.3) c.lerp(COL_DIRT, (0.3 - patch) * 1.6);
    if (slope > 0.16) c.lerp(COL_ROCK, Math.min(1, (slope - 0.16) * 5.5));
    if (h > 16) c.lerp(COL_ROCK, Math.min(1, (h - 16) / 10));
    // micro variation so big faces don't band
    const m = 0.94 + detail.noise(x * 0.35, z * 0.35) * 0.06;
    colors[i * 3] = c.r * m;
    colors[i * 3 + 1] = c.g * m;
    colors[i * 3 + 2] = c.b * m;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0.0,
  });
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

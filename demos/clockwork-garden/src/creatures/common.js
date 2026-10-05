import * as THREE from 'three';
import { wingTexture } from '../materials/textures.js';

// Shared creature parts: membrane wings, jointed legs, and the translucent
// "stroke fan" that suggests motion blur when wings beat faster than the
// frame rate can show.

const wingTexCache = new Map();

// Wing membrane plane. Local frame: hinge at origin, span along +X, chord
// along -Z (leading edge at z=0). Slight camber so it never looks like a card.
export function wingMesh({ span = 2, chord = 0.8, seed = 1, tint = [255, 236, 200], vein = [150, 110, 40], kind = 'bee', iridescent = false, edgeMat = null, shape = 'bee' }) {
  const key = [seed, tint.join(','), vein.join(','), kind].join('|');
  if (!wingTexCache.has(key)) wingTexCache.set(key, wingTexture({ seed, tint, veinColor: vein, cells: kind }));
  const tex = wingTexCache.get(key);
  const sx = 14, sz = 6;
  const geo = new THREE.PlaneGeometry(1, 1, sx, sz);
  const p = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const u = uv.getX(i); // 0 root → 1 tip
    const v = uv.getY(i); // 1 leading edge → 0 trailing
    // wing outline: rounded tip, tapering root
    let w;
    if (shape === 'dragon') w = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, u * 0.98 + 0.02)) ** 0.25 * (1 - Math.pow(u, 6));
    else w = (0.3 + 0.7 * Math.sin(Math.PI * (0.15 + u * 0.85)) ** 0.6) * (1 - Math.pow(u, 8) * 0.6);
    const x = u * span;
    const z = -(1 - v) * chord * w;
    const y = Math.sin(u * Math.PI) * 0.04 * span + (1 - v) * 0.03 * chord;
    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({
    map: tex,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.28,
    metalness: 0.0,
    envMapIntensity: 0.45,
    specularIntensity: 0.5,
    iridescence: iridescent ? 1 : 0.5,
    iridescenceIOR: 1.4,
    iridescenceThicknessRange: [250, 650],
    opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 3;
  const group = new THREE.Group();
  group.add(mesh);
  if (edgeMat) {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      pts.push(new THREE.Vector3(u * span * 0.97, Math.sin(u * Math.PI) * 0.04 * span, 0));
    }
    const edge = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, chord * 0.025, 5, false), edgeMat);
    group.add(edge);
  }
  return group;
}

// Translucent sector showing the sweep of a fast-beating wing.
export function strokeFan(span, angle, color = '#f3e2c0') {
  // sector in the XY plane centred on +X: the up/down sweep of a wing that
  // spans +X and flaps about the body's long (Z) axis
  const geo = new THREE.CircleGeometry(span, 24, -angle / 2, angle);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 4;
  return m;
}

// A jointed leg: chain of segments with spherical joints. Each segment is a
// Group rotated relative to its parent; geometry points along +Y of its joint.
export class Leg {
  constructor({ lengths, radii, mats, jointMat, claw = true }) {
    this.root = new THREE.Group();
    this.joints = [];
    let parent = this.root;
    const n = lengths.length;
    for (let i = 0; i < n; i++) {
      const j = new THREE.Group();
      parent.add(j);
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(radii[i] * 0.8, radii[i], lengths[i], 7), mats[i] ?? mats[0]);
      seg.position.y = lengths[i] / 2;
      seg.castShadow = true;
      j.add(seg);
      const knuckle = new THREE.Mesh(new THREE.SphereGeometry(radii[i] * 1.25, 8, 6), jointMat);
      j.add(knuckle);
      const next = new THREE.Group();
      next.position.y = lengths[i];
      j.add(next);
      this.joints.push(j);
      parent = next;
      if (i === n - 1) this.tip = next;
    }
    if (claw) {
      for (const s of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(radii[n - 1] * 0.5, radii[n - 1] * 3, 5), jointMat);
        c.position.set(s * radii[n - 1] * 0.6, radii[n - 1] * 1.2, 0);
        c.rotation.z = -s * 0.5;
        this.tip.add(c);
      }
    }
  }
  // angles: array of [x, y, z] Euler per joint
  pose(angles) {
    for (let i = 0; i < this.joints.length; i++) {
      const a = angles[i] || [0, 0, 0];
      this.joints[i].rotation.set(a[0], a[1], a[2]);
    }
  }
}

// Instanced metallic bristles ("fuzz") scattered over an ellipsoid region.
export function fuzz({ count, radii, center = new THREE.Vector3(), length = 0.16, radius = 0.012, mat, filter = () => true, seed = 3 }) {
  const geo = new THREE.ConeGeometry(radius, length, 3, 1);
  geo.translate(0, length / 2, 0);
  const im = new THREE.InstancedMesh(geo, mat, count);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  let n = 0;
  let guard = 0;
  while (n < count && guard++ < count * 20) {
    const u = rnd() * 2 - 1;
    const th = rnd() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const dir = new THREE.Vector3(r * Math.cos(th), u, r * Math.sin(th));
    if (!filter(dir)) continue;
    const p = new THREE.Vector3(dir.x * radii.x, dir.y * radii.y, dir.z * radii.z).add(center);
    const nrm = new THREE.Vector3(dir.x / radii.x, dir.y / radii.y, dir.z / radii.z).normalize();
    nrm.add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5)).normalize();
    q.setFromUnitVectors(up, nrm);
    const sc = 0.6 + rnd() * 0.7;
    m4.compose(p, q, new THREE.Vector3(1, sc, 1));
    im.setMatrixAt(n++, m4);
  }
  im.count = n;
  return im;
}

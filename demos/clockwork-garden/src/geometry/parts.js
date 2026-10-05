import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Small reusable mechanical parts: screws, jewels, arbors, collars, rods.

const cache = new Map();
function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

// Domed slotted screw head, axis +Y, sitting on y=0.
export function screwGeometry(r = 0.1) {
  return cached('screw' + r, () => {
    // profile from the dome apex outwards and down to the seating face
    const pts = [];
    for (let i = 8; i >= 0; i--) {
      const a = (i / 8) * Math.PI * 0.5;
      pts.push(new THREE.Vector2(Math.max(0.0005, Math.cos(a) * r), Math.sin(a) * r * 0.55));
    }
    pts.push(new THREE.Vector2(r, -r * 0.08));
    pts.reverse(); // lathe profiles run bottom→top for outward-facing normals
    const head = new THREE.LatheGeometry(pts, 20);
    // slot: two thin boxes forming a cut across the head (rendered dark)
    const slot = new THREE.BoxGeometry(r * 2.05, r * 0.25, r * 0.22);
    slot.translate(0, r * 0.5, 0);
    head.deleteAttribute('uv');
    slot.deleteAttribute('uv');
    const merged = mergeGeometries([head.toNonIndexed(), slot.toNonIndexed()]);
    merged.computeVertexNormals();
    return merged;
  });
}

// Ruby jewel bearing in a gold chaton, axis +Y.
export function jewelGeometries(r = 0.12) {
  return cached('jewel' + r, () => {
    const chaton = new THREE.CylinderGeometry(r * 1.6, r * 1.7, r * 0.5, 24);
    chaton.translate(0, r * 0.25, 0);
    const pts = [
      new THREE.Vector2(r, r * 0.3),
      new THREE.Vector2(r, r * 0.45),
      new THREE.Vector2(r * 0.5, r * 0.6),
      new THREE.Vector2(0.001, r * 0.62),
    ];
    const ruby = new THREE.LatheGeometry(pts, 24);
    return { chaton, ruby };
  });
}

export function cylinderBetween(a, b, radius, radialSegments = 10) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, radialSegments, 1, false);
  geo.translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  geo.applyQuaternion(q);
  geo.translate(a.x, a.y, a.z);
  return geo;
}

// A unit rod mesh (length 1 along +Y) that can be stretched between two
// moving points each frame without rebuilding geometry.
export class Rod {
  constructor(material, radius = 0.05, segments = 8, endCaps = null) {
    const geo = cached('rod' + radius + '_' + segments, () => {
      const g = new THREE.CylinderGeometry(radius, radius, 1, segments, 1);
      g.translate(0, 0.5, 0);
      return g;
    });
    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.castShadow = true;
    this._up = new THREE.Vector3(0, 1, 0);
    this._d = new THREE.Vector3();
    this.caps = [];
    if (endCaps) {
      const capGeo = cached('rodcap' + radius, () => new THREE.SphereGeometry(radius * 1.8, 12, 8));
      for (let i = 0; i < 2; i++) {
        const c = new THREE.Mesh(capGeo, endCaps);
        c.castShadow = true;
        this.caps.push(c);
      }
    }
  }
  addTo(parent) {
    parent.add(this.mesh);
    for (const c of this.caps) parent.add(c);
    return this;
  }
  set(a, b) {
    this._d.subVectors(b, a);
    const len = this._d.length();
    this.mesh.position.copy(a);
    this.mesh.scale.set(1, Math.max(1e-4, len), 1);
    if (len > 1e-6) this.mesh.quaternion.setFromUnitVectors(this._up, this._d.multiplyScalar(1 / len));
    if (this.caps.length) {
      this.caps[0].position.copy(a);
      this.caps[1].position.copy(b);
    }
  }
}

// Collar / ferrule: short ring with a chamfer, axis +Y, centred.
export function collarGeometry(r = 0.3, h = 0.2) {
  return cached('collar' + r + '_' + h, () => {
    const pts = [
      new THREE.Vector2(r * 0.86, -h / 2),
      new THREE.Vector2(r, -h * 0.32),
      new THREE.Vector2(r, h * 0.32),
      new THREE.Vector2(r * 0.86, h / 2),
    ];
    return new THREE.LatheGeometry(pts, 28);
  });
}

// Hinge knuckle: short cylinder along X with a pin cap at each end.
export function knuckleGeometry(r = 0.06, len = 0.3) {
  return cached('knuckle' + r + '_' + len, () => {
    const g = new THREE.CylinderGeometry(r, r, len, 14);
    g.rotateZ(Math.PI / 2);
    const capA = new THREE.SphereGeometry(r * 0.8, 10, 6);
    capA.translate(len / 2, 0, 0);
    const capB = new THREE.SphereGeometry(r * 0.8, 10, 6);
    capB.translate(-len / 2, 0, 0);
    return mergeGeometries([g, capA, capB].map((x) => { x.deleteAttribute('uv'); return x.toNonIndexed(); }));
  });
}

// Spiral hairspring as a flat ribbon (tube) – used in the escapement.
export function spiralPoints(turns, r0, r1, steps = 400, phase = 0) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const a = phase + k * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * k;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  return pts;
}

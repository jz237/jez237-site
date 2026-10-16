// Geometry helpers (built once at load).
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3(1, 1, 1);
const _p = new THREE.Vector3();

export function xform(geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  _e.set(rx, ry, rz);
  _q.setFromEuler(_e);
  _p.set(x, y, z);
  _s.set(sx, sy, sz);
  _m.compose(_p, _q, _s);
  geo.applyMatrix4(_m);
  return geo;
}

// UVs of a box scaled to metres (so tiled textures keep their size)
function metricUV(geo, w, h, d) {
  const uv = geo.attributes.uv, n = geo.attributes.normal;
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i));
    let su, sv;
    if (nx > 0.5) { su = d; sv = h; } else if (ny > 0.5) { su = w; sv = d; } else { su = w; sv = h; }
    uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  }
  return geo;
}

export function box(w, h, d, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, metric = true) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (metric) metricUV(g, w, h, d);
  return xform(g, x, y, z, rx, ry, rz);
}
export function rbox(w, h, d, r, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, seg = 3) {
  const g = new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
  metricUV(g, w, h, d);
  return xform(g, x, y, z, rx, ry, rz);
}
export function cyl(rt, rb, h, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, seg = 16, open = false) {
  return xform(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open), x, y, z, rx, ry, rz);
}
export function sphere(r, x = 0, y = 0, z = 0, ws = 16, hs = 12, sx = 1, sy = 1, sz = 1) {
  return xform(new THREE.SphereGeometry(r, ws, hs), x, y, z, 0, 0, 0, sx, sy, sz);
}
// cylinder from point a to point b
export function rod(a, b, r, seg = 8) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r, r, len, seg, 1, false);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  _m.compose(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1));
  return g.applyMatrix4(_m);
}
export function lathe(pts, seg = 24, x = 0, y = 0, z = 0) {
  return xform(new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), seg), x, y, z);
}
// tube along a curve (CatmullRom through points)
export function tube(points, r, seg = 32, rseg = 6, closed = false) {
  const c = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  return new THREE.TubeGeometry(c, seg, r, rseg, closed);
}

// merge with attribute normalisation (drop uv2/colour mismatches)
export function merge(geos) {
  const list = geos.filter(Boolean).map((g) => {
    const ng = g.index ? g.toNonIndexed() : g;
    for (const k of Object.keys(ng.attributes)) if (!['position', 'normal', 'uv'].includes(k)) ng.deleteAttribute(k);
    if (!ng.attributes.uv) ng.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(ng.attributes.position.count * 2), 2));
    if (!ng.attributes.normal) ng.computeVertexNormals();
    return ng;
  });
  if (!list.length) return new THREE.BufferGeometry();
  const m = mergeGeometries(list, false);
  return m;
}

// A wall plane with rectangular holes, in its local XY (x right, y up), facing +Z. holes: [x0, y0, x1, y1]
export function wallWithHoles(x0, y0, x1, y1, holes = []) {
  const s = new THREE.Shape();
  s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1); s.lineTo(x0, y0);
  for (const [a, b, c, d] of holes) {
    const p = new THREE.Path();
    p.moveTo(a, b); p.lineTo(a, d); p.lineTo(c, d); p.lineTo(c, b); p.lineTo(a, b);
    s.holes.push(p);
  }
  const g = new THREE.ShapeGeometry(s);
  // ShapeGeometry UVs = shape coordinates (metres) -> good for tiling
  return g;
}

// reveal (inner faces) of a rectangular opening through a wall of thickness t (wall plane at z=0 facing +Z, depth to -t)
export function reveal(a, b, c, d, t) {
  return merge([
    box(c - a, 0.001, t, (a + c) / 2, b, -t / 2), box(c - a, 0.001, t, (a + c) / 2, d, -t / 2),
    box(0.001, d - b, t, a, (b + d) / 2, -t / 2), box(0.001, d - b, t, c, (b + d) / 2, -t / 2),
  ]);
}

export { mergeVertices };

// Merge the static meshes under `root` into one mesh per (material, castShadow, receiveShadow, renderOrder), baked
// into root's local space. `keep(mesh)` -> true leaves a mesh (and it is not merged): animated parts, special
// materials, instanced meshes. Returns the number of draw calls saved.
export function mergeStatic(root, keep = () => false, { extra = [] } = {}) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map();
  const victims = [];
  const keepAncestors = new Set();
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o === root) return;
    if (keep(o) || Array.isArray(o.material) || !o.visible) { keepAncestors.add(o); return; }
    // a mesh under a kept (animated) node must not be merged
    let a = o.parent, blocked = false;
    while (a && a !== root) { if (a.userData.noMerge) { blocked = true; break; } a = a.parent; }
    if (blocked) return;
    const key = o.material.uuid + '|' + (o.castShadow ? 1 : 0) + (o.receiveShadow ? 1 : 0) + '|' + o.renderOrder + '|' + o.layers.mask;
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, recv: o.receiveShadow, ro: o.renderOrder, layers: o.layers.mask, list: [] });
    buckets.get(key).list.push(o);
  });
  let saved = 0;
  for (const b of buckets.values()) {
    if (b.list.length < 2) continue;
    const hasColor = b.list.every((m) => m.geometry.attributes.color);
    const extras = extra.filter((k) => b.list.every((m) => m.geometry.attributes[k]));
    const geos = b.list.map((m) => {
      let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k) && !(hasColor && k === 'color') && !extras.includes(k)) g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      if (!g.attributes.normal) g.computeVertexNormals();
      if (hasColor && g.attributes.color.itemSize !== 4) {
        const c = g.attributes.color, n = c.count, a = new Float32Array(n * 4);
        for (let i = 0; i < n; i++) { a[i * 4] = c.getX(i); a[i * 4 + 1] = c.getY(i); a[i * 4 + 2] = c.getZ(i); a[i * 4 + 3] = 1; }
        g.setAttribute('color', new THREE.BufferAttribute(a, 4));
      } else if (hasColor && g.attributes.color.normalized) {
        const c = g.attributes.color, n = c.count, a = new Float32Array(n * 4);
        for (let i = 0; i < n; i++) { a[i * 4] = c.getX(i); a[i * 4 + 1] = c.getY(i); a[i * 4 + 2] = c.getZ(i); a[i * 4 + 3] = c.getW(i); }
        g.setAttribute('color', new THREE.BufferAttribute(a, 4));
      }
      // normalise uv (glTF can deliver normalized/int attributes)
      if (g.attributes.uv.normalized || !(g.attributes.uv.array instanceof Float32Array)) {
        const u = g.attributes.uv, a = new Float32Array(u.count * 2);
        for (let i = 0; i < u.count; i++) { a[i * 2] = u.getX(i); a[i * 2 + 1] = u.getY(i); }
        g.setAttribute('uv', new THREE.BufferAttribute(a, 2));
      }
      for (const k of ['position', 'normal']) {
        const at = g.attributes[k];
        if (at.normalized || !(at.array instanceof Float32Array)) {
          const a = new Float32Array(at.count * 3);
          for (let i = 0; i < at.count; i++) { a[i * 3] = at.getX(i); a[i * 3 + 1] = at.getY(i); a[i * 3 + 2] = at.getZ(i); }
          g.setAttribute(k, new THREE.BufferAttribute(a, 3));
        }
      }
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
      return g;
    });
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, b.mat);
    mesh.castShadow = b.cast; mesh.receiveShadow = b.recv; mesh.renderOrder = b.ro; mesh.layers.mask = b.layers;
    mesh.name = 'merged_' + (b.mat.name || 'mat');
    root.add(mesh);
    for (const m of b.list) victims.push(m);
    saved += b.list.length - 1;
  }
  for (const m of victims) {
    // kept children of a merged mesh (e.g. a reflector glass under a door mesh) survive, re-parented to root
    for (const c of [...m.children]) root.attach(c);
    m.parent && m.parent.remove(m);
  }
  // drop empty groups left behind
  const empties = [];
  root.traverse((o) => { if (!o.isMesh && o !== root && o.children.length === 0 && o.type === 'Group' && !o.userData.noMerge) empties.push(o); });
  for (const e of empties) e.parent && e.parent.remove(e);
  return saved;
}

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const _m = new THREE.Matrix4();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();

// Matrix whose +Z is `normal`, +Y is as close to `up` as possible, origin at `pos`.
export function frameMatrix(pos, normal, up = new THREE.Vector3(0, 1, 0), scale = 1) {
  _z.copy(normal).normalize();
  _y.copy(up);
  if (Math.abs(_y.dot(_z)) > 0.98) _y.set(1, 0, 0);
  _x.crossVectors(_y, _z).normalize();
  _y.crossVectors(_z, _x).normalize();
  const m = new THREE.Matrix4().makeBasis(_x, _y, _z);
  m.scale(new THREE.Vector3(scale, scale, scale));
  m.setPosition(pos);
  return m;
}

export function prepare(geo, withColor = false, color = null) {
  let g = geo.index ? geo.toNonIndexed() : geo.clone();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.normal) g.computeVertexNormals();
  const n = g.attributes.position.count;
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  if (withColor) {
    const arr = new Float32Array(n * 3);
    const c = color || new THREE.Color(1, 1, 1);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  } else if (g.attributes.color) g.deleteAttribute('color');
  return g;
}

// Accumulates geometry (pre-transformed) and merges into one mesh.
export class Batch {
  constructor(colored = false) {
    this.list = [];
    this.colored = colored;
    this.glints = [];
  }
  add(geo, matrix = null, color = null) {
    const g = prepare(geo, this.colored, color);
    if (matrix) g.applyMatrix4(matrix);
    this.list.push(g);
    return this;
  }
  get count() {
    return this.list.length;
  }
  build(material) {
    if (!this.list.length) return null;
    const merged = mergeGeometries(this.list, false);
    this.list.forEach((g) => g.dispose());
    this.list = [];
    const mesh = new THREE.Mesh(merged, material);
    if (this.glints.length) mesh.userData.glints = this.glints;
    return mesh;
  }
}

export function tubeAlong(points, radius, { closed = false, seg = null, radial = 6 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  return new THREE.TubeGeometry(curve, seg || Math.max(8, points.length * 2), radius, radial, closed);
}

// Cabochon jewel with a gold bezel. Z is the outward direction.
const cabochon = new THREE.SphereGeometry(1, 16, 12);
cabochon.scale(1, 1, 0.62);
const bezel = new THREE.TorusGeometry(1.12, 0.26, 8, 20);
bezel.scale(1, 1, 0.8);
const prong = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 6);
prong.rotateX(Math.PI / 2);

const glintTint = (c) => [0.55 + c.r * 0.6, 0.55 + c.g * 0.6, 0.55 + c.b * 0.6].map((v) => Math.min(1.5, v * 1.15));

export function addJewel(gems, golds, matrix, radius, color, { bezelOn = true, prongs = 0, glint = true } = {}) {
  const s = new THREE.Matrix4().makeScale(radius, radius, radius);
  const m = matrix.clone().multiply(s);
  gems.add(cabochon, m, color);
  if (glint) {
    const e = matrix.elements;
    const lift = radius * 0.5;
    gems.glints.push({ pos: [e[12] + e[8] * lift, e[13] + e[9] * lift, e[14] + e[10] * lift], color: glintTint(color), size: radius * 2.3 + 0.05, hot: 1 });
  }
  if (bezelOn) golds.add(bezel, m);
  for (let i = 0; i < prongs; i++) {
    const a = (i / prongs) * Math.PI * 2;
    const pm = matrix.clone().multiply(new THREE.Matrix4().makeTranslation(Math.cos(a) * radius * 1.1, Math.sin(a) * radius * 1.1, 0.05 * radius)).multiply(new THREE.Matrix4().makeScale(radius, radius, radius));
    golds.add(prong, pm);
  }
}

export function disposeTree(o) {
  o.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
  });
}

export const TAU = Math.PI * 2;
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
void _m;

// Part registry: every physical component of the bee is a Part (a THREE.Group node + merged meshes).
// Parts nest (a wing owns its veins, hinge and membrane), explode along their own vectors, mirror, and are
// individually selectable. Geometry is queued per material and merged at finalize() to keep draw calls low.
import * as THREE from 'three';
import { mergeGeometries } from './geo.js';
import { M as MATS } from './materials.js';

/* ------------------------------------------------------------------ small helpers */

const D2R = Math.PI / 180;
const _m = new THREE.Matrix4();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _b = new THREE.Box3();

export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Build a Matrix4 from { p:[x,y,z], r:[degX,degY,degZ], s:number|[x,y,z], q:Quaternion } | Matrix4 | [x,y,z]. */
export function M4(xf) {
  if (!xf) return null;
  if (xf.isMatrix4) return xf;
  if (Array.isArray(xf)) return new THREE.Matrix4().makeTranslation(xf[0], xf[1], xf[2]);
  const p = xf.p ?? [0, 0, 0];
  const q = xf.q ?? (xf.r ? _q.clone().setFromEuler(_e.set(xf.r[0] * D2R, xf.r[1] * D2R, xf.r[2] * D2R, 'XYZ')) : new THREE.Quaternion());
  const s = xf.s == null ? [1, 1, 1] : typeof xf.s === 'number' ? [xf.s, xf.s, xf.s] : xf.s;
  return new THREE.Matrix4().compose(new THREE.Vector3(p[0], p[1], p[2]), q, new THREE.Vector3(s[0], s[1], s[2]));
}

const mirrorQuat = (q) => new THREE.Quaternion(-q.x, -q.y, q.z, q.w);

/** Weld an unindexed geometry into an indexed one (position/normal/uv/color compared by quantised value). */
function weld(geo) {
  if (geo.index) return geo;
  const names = ['position', 'normal', 'uv', 'color'].filter((n) => geo.attributes[n]);
  const scales = { position: 1e4, normal: 400, uv: 1e4, color: 1e3 };
  const n = geo.attributes.position.count;
  let stride = 0;
  for (const nm of names) stride += geo.attributes[nm].itemSize;
  const q = new Int32Array(n * stride);
  let o = 0;
  for (const nm of names) {
    const a = geo.attributes[nm];
    const arr = a.array, sz = a.itemSize, sc = scales[nm];
    for (let i = 0; i < n; i++) for (let k = 0; k < sz; k++) q[i * stride + o + k] = Math.round(arr[i * sz + k] * sc);
    o += sz;
  }
  const cap = 1 << Math.max(4, Math.ceil(Math.log2(n * 1.6 + 8)));
  const mask = cap - 1;
  const table = new Int32Array(cap).fill(-1);
  const remap = new Uint32Array(n);
  const keep = new Uint32Array(n);
  let kept = 0;
  for (let i = 0; i < n; i++) {
    const base = i * stride;
    let h = 2166136261;
    for (let k = 0; k < stride; k++) h = Math.imul(h ^ q[base + k], 16777619);
    h = (h ^ (h >>> 15)) & mask;
    let found = -1;
    while (table[h] !== -1) {
      const j = table[h];
      const ob = keep[j] * stride;
      let same = true;
      for (let k = 0; k < stride; k++) if (q[ob + k] !== q[base + k]) { same = false; break; }
      if (same) { found = j; break; }
      h = (h + 1) & mask;
    }
    if (found === -1) { found = kept; keep[kept++] = i; table[h] = found; }
    remap[i] = found;
  }
  const out = new THREE.BufferGeometry();
  for (const nm of names) {
    const a = geo.attributes[nm];
    const sz = a.itemSize;
    const arr = new Float32Array(kept * sz);
    for (let j = 0; j < kept; j++) { const s = keep[j] * sz; for (let k = 0; k < sz; k++) arr[j * sz + k] = a.array[s + k]; }
    out.setAttribute(nm, new THREE.BufferAttribute(arr, sz));
  }
  out.setIndex(new THREE.BufferAttribute(n > 65535 ? remap : new Uint16Array(remap), 1));
  return out;
}

const indexedCache = new WeakMap();
/** Normalised, indexed copy of a geometry (position + normal + uv [+ color]). Cached per source geometry. */
function indexedFor(geo, wantColor) {
  const key = wantColor ? 1 : 0;
  let slot = indexedCache.get(geo);
  if (slot && slot[key]) return slot[key];
  let g = geo.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  for (const nm of Object.keys(g.attributes)) {
    if (nm === 'position' || nm === 'normal' || nm === 'uv') continue;
    if (nm === 'color' && wantColor) continue;
    g.deleteAttribute(nm);
  }
  if (wantColor && !g.attributes.color) {
    const c = new Float32Array(g.attributes.position.count * 3).fill(1);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  }
  for (const k of ['normal', 'uv', 'color']) {
    const a = g.attributes[k];
    if (a && (a.isInterleavedBufferAttribute || a.normalized)) g.setAttribute(k, new THREE.BufferAttribute(Float32Array.from(a.array), a.itemSize));
  }
  g.clearGroups();
  g = weld(g);
  if (!slot) { slot = []; indexedCache.set(geo, slot); }
  slot[key] = g;
  return g;
}

function flipWinding(g) {
  const ix = g.index.array;
  for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
  g.index.needsUpdate = true;
}

/** Mirror an explode spec across the centre plane: bee-space directions flip z, local ones are kept. */
function mirrorEx(ex) {
  const out = { ...ex, dir: ex.dir ? ex.dir.clone() : null, rot: ex.rot ? ex.rot.clone() : null };
  if (out.dir && ex.space !== 'local') out.dir.z = -out.dir.z;
  return out;
}

const defaultRename = (s) => (typeof s === 'string' ? s.replace(/\bRight\b/g, 'Left').replace(/\bright\b/g, 'left').replace(/\bR\b(?=[ )-]|$)/g, 'L') : s);

/* ------------------------------------------------------------------ Part */

export class Part {
  constructor(bee, localId, parent, o = {}) {
    this.bee = bee;
    this.parent = parent;
    this.localId = localId;
    this.id = parent && parent !== bee.rootPart ? `${parent.id}/${localId}` : localId;
    this.children = [];
    this.index = -1;
    this.name = o.name ?? localId;
    this.group = o.group ?? parent?.group ?? null;
    this.info = o.info ?? '';
    this.specs = o.specs ?? {};
    this.bullets = o.bullets ?? [];
    this.tag = o.tag ?? '';
    this.anchor = o.anchor ? new THREE.Vector3(...o.anchor) : null;
    this.selectable = o.selectable !== false;
    this.node = new THREE.Group();
    this.node.name = this.id;
    this.queue = new Map();        // material -> geometries
    this.direct = [];              // { mesh, opts } added directly
    this.meshes = [];
    this.mirrorOf = null;
    this.ownVisible = true;
    this.ex = { dir: null, dist: 0, delay: 0, span: 1, rot: null, space: 'bee' };
    this.setExplode(o.explode);

    const n = this.node;
    if (o.matrix) o.matrix.decompose(n.position, n.quaternion, n.scale);
    else {
      if (o.pos) n.position.set(o.pos[0], o.pos[1], o.pos[2]);
      if (o.quat) n.quaternion.copy(o.quat);
      else if (o.rot) n.quaternion.setFromEuler(_e.set(o.rot[0] * D2R, o.rot[1] * D2R, o.rot[2] * D2R, 'XYZ'));
      if (o.scale != null) typeof o.scale === 'number' ? n.scale.setScalar(o.scale) : n.scale.set(...o.scale);
    }
    this.restPos = n.position.clone();
    this.restQuat = n.quaternion.clone();
    this.offsetLocal = new THREE.Vector3();
    this.rotExtra = new THREE.Quaternion();
    this.centerLocal = new THREE.Vector3();
    this.radius = 0;
    this.hasBounds = false;
    this.localProgress = 0;
    (parent ?? bee.rootPart)?.node.add(n);
    parent?.children.push(this);
    bee._register(this);
  }

  /** explode: [dx,dy,dz] (length = distance) or { dir, dist, delay, span, rot:[degX,degY,degZ], space:'bee'|'local' } */
  setExplode(e) {
    if (!e) return this;
    const x = this.ex;
    if (Array.isArray(e)) { const v = new THREE.Vector3(...e); x.dist = v.length(); x.dir = x.dist > 0 ? v.divideScalar(x.dist) : null; }
    else {
      if (e.dir) { x.dir = new THREE.Vector3(...e.dir).normalize(); if (e.dist == null && x.dist === 0) x.dist = new THREE.Vector3(...e.dir).length(); }
      if (e.dist != null) x.dist = e.dist;
      if (e.delay != null) x.delay = e.delay;
      if (e.span != null) x.span = e.span;
      if (e.rot !== undefined) x.rot = e.rot ? new THREE.Vector3(...e.rot) : null;
      if (e.space) x.space = e.space;
    }
    return this;
  }

  /** Create a child part. Child ids become `<parent id>/<localId>`. */
  part(localId, o = {}) { return new Part(this.bee, localId, this, o); }

  /** Queue geometry (merged per material at finalize). xf: Matrix4 | [x,y,z] | { p, r:[deg], s, q }. */
  add(geo, mat, xf) {
    if (!geo) return this;
    const base = indexedFor(geo, !!mat.vertexColors);
    const g = base.clone();
    const m = M4(xf);
    if (m) {
      g.applyMatrix4(m);
      if (m.determinant() < 0) flipWinding(g);
    }
    let list = this.queue.get(mat);
    if (!list) this.queue.set(mat, (list = []));
    list.push(g);
    return this;
  }

  /** Add the same geometry at many transforms (screws, rivets, teeth). items: array of xf (see add). */
  addMany(geo, mat, items) { for (const it of items) this.add(geo, mat, it); return this; }

  /** Add a ready-made mesh (fur, InstancedMesh, custom). opts: { layers:[n], cast, receive, pick:false = never drawn in the ID pass }. */
  addMesh(mesh, opts = {}) { this.direct.push({ mesh, opts }); return this; }

  /** GPU-instanced copies of a geometry. items as in geo.instances(). */
  inst(geo, mat, items, opts = {}) {
    const base = indexedFor(geo, !!mat.vertexColors);
    const mesh = new THREE.InstancedMesh(base, mat, items.length);
    const o = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    items.forEach((it, i) => {
      o.position.set(...it.p);
      if (it.n) o.quaternion.setFromUnitVectors(up, _v.set(...it.n).normalize()); else o.quaternion.identity();
      if (it.r) o.rotateY(it.r);
      if (it.sv) o.scale.set(...it.sv); else o.scale.setScalar(it.s ?? 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    return this.addMesh(mesh, opts);
  }

  /** Invisible pick / outline volume drawn only in the ID pass (fur, wisps, thin membranes). geo is cloned. */
  idProxy(geo, xf) {
    const g = geo.clone();
    const m = M4(xf);
    if (m) g.applyMatrix4(m);
    return this.addMesh(new THREE.Mesh(g, MATS.ghost), { layers: [6], cast: false, receive: false });
  }

  get world() { this.node.updateWorldMatrix(true, false); return this.node.matrixWorld; }

  /** World-space bounding sphere centre of this part (own meshes, else descendants). */
  worldCenter(out = new THREE.Vector3()) {
    this.node.updateWorldMatrix(true, false);
    out.copy(this.centerLocal).applyMatrix4(this.node.matrixWorld);
    return out;
  }

  *walk() { yield this; for (const c of this.children) yield* c.walk(); }

  setOwnVisible(v) { this.ownVisible = v; for (const m of this.meshes) m.visible = v; }
}

/* ------------------------------------------------------------------ Bee */

export class Bee {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'apx9';
    this.rootPart = { node: this.root, id: '', children: [], group: null, bee: this, isRoot: true };
    this.parts = [];
    this.byId = new Map();
    this.pendingMirrors = [];
    this.explode = 0;
    this.guides = null;
    this.layout = {};
    this.finalized = false;
    this.guideOpacity = 1;
  }

  _register(p) {
    if (this.byId.has(p.id)) console.warn('duplicate part id', p.id);
    this.byId.set(p.id, p);
    this.parts.push(p);
  }

  get tops() { return this.rootPart.children; }
  get(id) { return this.byId.get(id); }
  /** Top-level part. */
  part(localId, o = {}) { return new Part(this, localId, this.rootPart, o); }

  /**
   * Mirror a part (and everything under it) across the bee's centre plane (z -> -z). The source must already
   * be modelled; descendants are cloned at finalize() so late additions to the source are included.
   * o: { id, name, parent, explode, rename }
   */
  mirror(src, o = {}) {
    const parent = o.parent ?? src.parent ?? this.rootPart;
    const id = o.id ?? src.localId.replace(/-r$/, '-l').replace(/_r$/, '_l').replace(/Right/, 'Left');
    const dst = new Part(this, id, parent === this.rootPart ? null : parent, {
      name: o.name ?? (o.rename ?? defaultRename)(src.name),
      group: o.group ?? src.group, info: o.info ?? (o.rename ?? defaultRename)(src.info), specs: src.specs, bullets: src.bullets,
      pos: [src.restPos.x, src.restPos.y, -src.restPos.z],
    });
    dst.restPos.set(src.restPos.x, src.restPos.y, -src.restPos.z);
    dst.restQuat.copy(mirrorQuat(src.restQuat));
    dst.node.position.copy(dst.restPos);
    dst.node.quaternion.copy(dst.restQuat);
    dst.node.scale.set(src.node.scale.x, src.node.scale.y, -src.node.scale.z);
    dst.mirrorOf = src;
    dst.mirrorRoot = true;
    dst.mirrorRename = o.rename ?? defaultRename;
    dst.ex = mirrorEx(src.ex);
    dst.explicitExplode = o.explode ?? null;
    if (o.explode) dst.setExplode(o.explode);
    this.pendingMirrors.push(dst);
    return dst;
  }

  _cloneChildren(src, dst, rename) {
    for (const c of src.children) {
      const d = new Part(this, c.localId, dst, {
        name: rename(c.name), group: c.group === src.group ? dst.group : c.group, info: rename(c.info), specs: c.specs, bullets: c.bullets, tag: c.tag,
        anchor: c.anchor ? [c.anchor.x, c.anchor.y, c.anchor.z] : null, selectable: c.selectable,
      });
      d.node.position.copy(c.restPos);
      d.node.quaternion.copy(c.restQuat);
      d.node.scale.copy(c.node.scale);
      d.restPos.copy(c.restPos);
      d.restQuat.copy(c.restQuat);
      d.mirrorOf = c;
      d.ex = { ...c.ex, dir: c.ex.dir ? c.ex.dir.clone() : null, rot: c.ex.rot ? c.ex.rot.clone() : null };
      this._cloneChildren(c, d, rename);
    }
  }

  /* ---------------------------------------------------------------- build */

  finalize(layout = {}) {
    if (this.finalized) return this;
    this.layout = layout;
    // 1. structural clones for mirrors (in creation order so mirrors of mirrors resolve)
    for (const d of this.pendingMirrors) this._cloneChildren(d.mirrorOf, d, d.mirrorRename);
    this.pendingMirrors.length = 0;

    // 2. layout overrides (global choreography); mirrored roots follow their source unless they have their own entry
    for (const p of this.parts) {
      const L = layout[p.id];
      if (L) p.setExplode(L);
    }
    for (const p of this.parts) {
      if (!p.mirrorRoot || layout[p.id]) continue;
      p.ex = mirrorEx(p.mirrorOf.ex);
      if (p.explicitExplode) p.setExplode(p.explicitExplode);
    }

    // 3. meshes
    this.parts.forEach((p, i) => (p.index = i));
    for (const p of this.parts) this._buildMeshes(p);
    this.root.updateMatrixWorld(true);

    // 4. bounds, centres, offsets
    for (const p of this.parts) this._measure(p);
    for (const p of this.parts) this._computeOffset(p);
    this._buildGuides();
    this.finalized = true;
    this.setExplode(0, true);
    return this;
  }

  _meshFlags(mesh, mat, opts = {}) {
    const transparent = !!mat?.transparent;
    const cast = opts.cast ?? !(transparent || mat?.userData?.noShadow);
    mesh.castShadow = cast;
    mesh.receiveShadow = opts.receive ?? true;
    if (opts.layers) { mesh.layers.disableAll(); for (const l of opts.layers) mesh.layers.enable(l); }
    else if (transparent) { mesh.layers.disableAll(); mesh.layers.enable(3); }
    mesh.frustumCulled = opts.frustumCulled ?? true;
  }

  _buildMeshes(p) {
    if (p.mirrorOf) {
      // share geometry with the source
      for (const sm of p.mirrorOf.meshes) {
        const m = sm.isInstancedMesh ? sm.clone() : new THREE.Mesh(sm.geometry, sm.material);
        m.castShadow = sm.castShadow; m.receiveShadow = sm.receiveShadow;
        m.layers.mask = sm.layers.mask;
        m.userData.partIndex = p.index + 1;
        m.userData.noPick = sm.userData.noPick;
        if (sm.userData.fur) m.userData.fur = true;
        p.node.add(m);
        p.meshes.push(m);
      }
      return;
    }
    for (const [mat, list] of p.queue) {
      const g = list.length === 1 ? list[0] : mergeGeometries(list, false);
      const mesh = new THREE.Mesh(g, mat);
      mesh.name = `${p.id}#${mat.name || 'mat'}`;
      this._meshFlags(mesh, mat);
      mesh.userData.partIndex = p.index + 1;
      p.node.add(mesh);
      p.meshes.push(mesh);
      if (list.length > 1) for (const x of list) x.dispose();
    }
    p.queue.clear();
    for (const { mesh, opts } of p.direct) {
      this._meshFlags(mesh, mesh.material, opts);
      mesh.userData.partIndex = p.index + 1;
      mesh.userData.noPick = opts.pick === false;
      p.node.add(mesh);
      p.meshes.push(mesh);
    }
    p.direct.length = 0;
  }

  _measure(p) {
    // centre/radius of own meshes in the part's local frame; fall back to the descendants
    const box = new THREE.Box3();
    let any = false;
    const inv = new THREE.Matrix4().copy(p.node.matrixWorld).invert();
    const addMeshBox = (mesh) => {
      const g = mesh.geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      _b.copy(g.boundingBox);
      if (mesh.isInstancedMesh) {
        if (!g.boundingSphere) g.computeBoundingSphere();
        if (mesh.boundingSphere === null) mesh.computeBoundingSphere();
        const s = mesh.boundingSphere;
        _b.setFromCenterAndSize(s.center, new THREE.Vector3(s.radius * 2, s.radius * 2, s.radius * 2));
      }
      _b.applyMatrix4(_m.multiplyMatrices(inv, mesh.matrixWorld));
      box.union(_b);
      any = true;
    };
    for (const m of p.meshes) if (!m.userData.fur) addMeshBox(m);
    if (!any) for (const m of p.meshes) addMeshBox(m);
    if (!any) {
      for (const c of p.children) {
        if (!c.hasBounds) this._measure(c);
        if (c.hasBounds) {
          const ctr = c.centerLocal.clone().applyMatrix4(_m.multiplyMatrices(inv, c.node.matrixWorld));
          box.expandByPoint(ctr);
          any = true;
        }
      }
    }
    if (any) {
      box.getCenter(p.centerLocal);
      p.radius = box.getSize(_v).length() / 2;
      p.hasBounds = true;
    }
    if (p.anchor) p.centerLocal.copy(p.anchor);
  }

  _computeOffset(p) {
    const x = p.ex;
    p.offsetLocal.set(0, 0, 0);
    p.rotExtra.identity();
    if (!x.dir || !x.dist) return;
    if (p.mirrorOf && !p.mirrorRoot) { p.offsetLocal.copy(p.mirrorOf.offsetLocal); p.rotExtra.copy(p.mirrorOf.rotExtra); p.exRot = p.mirrorOf.exRot; return; }
    const dirBee = x.dir.clone();
    if (x.space === 'local' || p.parent === this.rootPart || !p.parent) p.offsetLocal.copy(dirBee).multiplyScalar(x.dist);
    else {
      const inv = new THREE.Matrix4().extractRotation(p.parent.node.matrixWorld).invert();
      p.offsetLocal.copy(dirBee).applyMatrix4(inv).multiplyScalar(x.dist);
    }
    if (p.mirrorRoot) { /* direction was already mirrored in mirror() when copied from the source */ }
    p.exRot = x.rot ? x.rot.clone() : null;
  }

  /** Re-derive offsets after the layout changed at runtime. */
  relayout(layout) {
    this.layout = layout;
    for (const p of this.parts) { const L = layout[p.id]; if (L) p.setExplode(L); }
    this.setExplode(0, true);
    for (const p of this.parts) this._computeOffset(p);
    this.setExplode(this.explode, true);
  }

  /* ---------------------------------------------------------------- explode + guides */

  setExplode(e, force = false) {
    if (!force && e === this.explode) return;
    this.explode = e;
    for (const p of this.parts) {
      const x = p.ex;
      const has = p.offsetLocal.lengthSq() > 0 || p.exRot;
      if (!has) continue;
      let t = clamp01((e - x.delay) / Math.max(x.span, 1e-3));
      t = smoother(t);
      p.localProgress = t;
      const n = p.node;
      n.position.copy(p.restPos).addScaledVector(p.offsetLocal, t);
      if (p.exRot) {
        const r = p.exRot;
        const mirrored = p.mirrorRoot || (p.mirrorOf && p.mirrorOf.exRot && p.mirrorRoot);
        _e.set(r.x * D2R * t, r.y * D2R * t, r.z * D2R * t, 'XYZ');
        _q.setFromEuler(_e);
        if (p.mirrorRoot) { _q.set(-_q.x, -_q.y, _q.z, _q.w); }
        n.quaternion.copy(p.restQuat).multiply(_q);
      }
    }
    this.root.updateMatrixWorld(true);
    this._updateGuides();
  }

  _buildGuides() {
    const list = this.parts.filter((p) => p.hasBounds && p.offsetLocal.lengthSq() > 0.8 * 0.8 && p.selectable);
    this.guideParts = list;
    const pos = new Float32Array(list.length * 6);
    const dist = new Float32Array(list.length * 2);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('lineDistance', new THREE.BufferAttribute(dist, 1));
    const mat = new THREE.LineDashedMaterial({ color: 0x7c8794, dashSize: 0.55, gapSize: 0.45, transparent: true, opacity: 0.0, depthWrite: false });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false;
    lines.renderOrder = 4;
    lines.layers.disableAll();
    lines.layers.enable(4);
    this.guides = lines;
    this.root.add(lines);
    for (const p of list) {
      p.baseLocal = new THREE.Matrix4().compose(p.restPos, p.restQuat, p.node.scale);
    }
  }

  _updateGuides() {
    if (!this.guides) return;
    const list = this.guideParts;
    const pa = this.guides.geometry.attributes.position;
    const arr = pa.array;
    const a = new THREE.Vector3(), b = new THREE.Vector3();
    const e = this.explode;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const par = p.parent?.node ?? this.root;
      a.copy(p.centerLocal).applyMatrix4(p.baseLocal).applyMatrix4(par.matrixWorld);
      b.copy(p.centerLocal).applyMatrix4(p.node.matrixWorld);
      const vis = p.node.visible && p.ownVisible !== false;
      if (!vis) { a.copy(b); }
      arr[i * 6] = a.x; arr[i * 6 + 1] = a.y; arr[i * 6 + 2] = a.z;
      arr[i * 6 + 3] = b.x; arr[i * 6 + 4] = b.y; arr[i * 6 + 5] = b.z;
    }
    pa.needsUpdate = true;
    this.guides.computeLineDistances();
    const o = Math.min(1, Math.max(0, (e - 0.03) / 0.2)) * 0.62 * this.guideOpacity;
    this.guides.material.opacity = o;
    this.guides.visible = o > 0.01;
  }

  /* ---------------------------------------------------------------- queries */

  /** World-space box of one mesh (instanced meshes use their instance bounds). */
  static meshBox(mesh, out) {
    const g = mesh.geometry;
    if (mesh.isInstancedMesh) {
      if (mesh.boundingSphere === null) mesh.computeBoundingSphere();
      const s = mesh.boundingSphere;
      out.setFromCenterAndSize(s.center, _v.set(s.radius * 2, s.radius * 2, s.radius * 2));
    } else {
      if (!g.boundingBox) g.computeBoundingBox();
      out.copy(g.boundingBox);
    }
    return out.applyMatrix4(mesh.matrixWorld);
  }

  /** World box of the visible geometry of the given parts (all parts when omitted); fur and ID proxies are ignored. */
  worldBounds(out = new THREE.Box3(), parts = this.parts) {
    out.makeEmpty();
    for (const p of parts) {
      for (const m of p.meshes) {
        if (!m.visible || m.userData.fur || m.userData.noPick || m.layers.isEnabled(6)) continue;
        out.union(Bee.meshBox(m, _b));
      }
    }
    return out;
  }

  stats() {
    let tris = 0, meshes = 0, verts = 0;
    for (const p of this.parts) for (const m of p.meshes) {
      meshes++;
      const g = m.geometry;
      const t = (g.index ? g.index.count : g.attributes.position.count) / 3;
      tris += t * (m.isInstancedMesh ? m.count : 1);
      verts += g.attributes.position.count;
    }
    return { parts: this.parts.length, meshes, tris: Math.round(tris), verts };
  }

  /** Nested tree for the UI directory. */
  tree() {
    const rec = (p) => ({ part: p, children: p.children.map(rec) });
    return this.tops.map(rec);
  }

  *descendants(p) { yield* p.walk(); }
}

export { MATS };

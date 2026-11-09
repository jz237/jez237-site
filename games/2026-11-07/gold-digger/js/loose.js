// The physical cave (1.8). Presentation only (Math.random; the sim never sees any of it), driven by the sim's events.
//  - dig: every pick blow bites into the drawn rock (Cave.dent: deeper with each blow, fresh pale stone in the bite,
//    chips flying). When the cell gives way its rock tumbles out as chunks that bounce, roll and come to rest as a heap
//    (resting chunks are merged into one growing batch, so heaps cost nothing however much you dig). Blasts crater and
//    scorch the rock round them and bring down stalactites.
//  - knock: the props, stones, stalagmites and drips of decor.js / detail.js are baked (a few draw calls) until something
//    disturbs them - the digger walking into them, the pick, a blast, a heavy landing, or the rock under them going -
//    then they are lifted out of the bake (their baked vertices collapsed) and become rigid bodies that tip, roll,
//    tumble down holes, float or sink, and settle on the DRAWN rock. Fragile things break: crates splinter into planks,
//    urns crack into shards, crystals and salt shatter.
//  - swing: lanterns and chains swing on their hooks when brushed, struck or shaken, their light swinging with them.
// Rigid bodies: point contacts (each body's hull points) against the drawn floor (Cave.vray, memoised until the rock
// changes) and the tile walls, sequential impulses with friction and a little bounce, sleep when still.
import * as THREE from '../vendor/three.module.min.js';
import { T } from './config.js?v=19';
import { BITES } from './cavemesh.js?v=19';

const GRAV = 15;
const H = 1 / 120;                 // physics substep
const MAXLIVE = 140;               // live bodies at most (the oldest resting ones are merged or fade)
// how each kind of prop behaves. mat: sound + breaking; dens: kg/m3 of its box; frag: blows to break (0 never);
// round: rolls (its axis in its own frame); float: in water; only: 'support' = falls only when its rock goes or in a
// blast; big: only its rock going or a blast close by moves it; hang: swings on its hook
const KINDS = {
  crate: { mat: 'wood', dens: 260, frag: 2, float: 1 }, barrel: { mat: 'wood', dens: 170, round: 'y', frag: 3, float: 1 }, sack: { mat: 'soft', dens: 420 },
  planks: { mat: 'wood', dens: 320, float: 1 }, bucket: { mat: 'tin', dens: 110, round: 'y', float: 1 }, shovel: { mat: 'tin', dens: 140 }, ropeCoil: { mat: 'soft', dens: 260, float: 1 },
  gear: { mat: 'tin', dens: 500, round: 'z' }, bones: { mat: 'bone', dens: 260 }, urn: { mat: 'clay', dens: 320, frag: 1, round: 'y' }, block: { mat: 'stone', dens: 1500 },
  drum: { mat: 'stone', dens: 1300, round: 'x' }, shells: { mat: 'bone', dens: 260 }, coal: { mat: 'stone', dens: 900 }, saltCubes: { mat: 'glass', dens: 900, frag: 1 },
  crystal: { mat: 'glass', dens: 900, frag: 1 }, lantern: { mat: 'tin', dens: 180, hang: 1 }, chain: { mat: 'tin', dens: 300, hang: 1 },
  mushroom: { mat: 'soft', dens: 200, only: 'support' }, tallcap: { mat: 'soft', dens: 200, only: 'support' }, minicaps: { mat: 'soft', dens: 200, only: 'support' },
  fern: { mat: 'soft', dens: 100, only: 'support' }, anemone: { mat: 'soft', dens: 200, only: 'support' }, kelp: { mat: 'soft', dens: 100, only: 'support' },
  oreHeap: { mat: 'stone', dens: 1100, only: 'support' }, beamEnd: { mat: 'wood', dens: 400, only: 'support' }, pipeStub: { mat: 'tin', dens: 400, only: 'support' },
  stalactite: { mat: 'stone', dens: 1400, only: 'support', frag: 1 }, strands: { mat: 'soft', dens: 50, only: 'support', poof: 1 }, icicles: { mat: 'glass', dens: 700, only: 'support', frag: 1 },
  timberFrame: { mat: 'timber', dens: 90, big: 1 }, girder: { mat: 'tin', dens: 140, big: 1 }, rail: { mat: 'tin', dens: 200, big: 1 }, cart: { mat: 'tin', dens: 260, big: 1 },
  statue: { mat: 'stone', dens: 1300, big: 1 }, pillarRuin: { mat: 'stone', dens: 1300, big: 1 },
};
const ROCKK = { stone: { mat: 'stone', dens: 1900 }, mite: { mat: 'stone', dens: 1900, frag: 0 }, drip: { mat: 'stone', dens: 1900, only: 'support' } };
const SND = { wood: ['woodknock', 1], timber: ['timber', 1], tin: ['clang', 1], soft: ['woodknock', 0.7], stone: ['pebble', 0.85], clay: ['woodknock', 1.35], glass: ['tinkle', 1.2], bone: ['pebble', 1.35] };

// hull directions: the extreme vertex along each is a contact point (26 for anything, 50 round a rolling axis)
const DIRS = []; for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) if (x || y || z) DIRS.push(new THREE.Vector3(x, y, z).normalize());
const ROUND = {};
for (const ax of ['x', 'y', 'z']) {
  const d = [];
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); for (const e of [-0.75, 0, 0.75]) { const v = ax === 'y' ? [c, e, s] : ax === 'x' ? [e, c, s] : [c, s, e]; d.push(new THREE.Vector3(...v).normalize()); } }
  d.push(new THREE.Vector3(ax === 'x' ? 1 : 0, ax === 'y' ? 1 : 0, ax === 'z' ? 1 : 0), new THREE.Vector3(ax === 'x' ? -1 : 0, ax === 'y' ? -1 : 0, ax === 'z' ? -1 : 0));
  ROUND[ax] = d;
}
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _j = new THREE.Vector3(), _t = new THREE.Vector3(), _vp = new THREE.Vector3();
const _q = new THREE.Quaternion(), _qi = new THREE.Quaternion(), _m = new THREE.Matrix4(), _box = new THREE.Box3(), _e = new THREE.Euler();
const UP = new THREE.Vector3(0, 1, 0);

// extreme points of a set of local vertices along the directions (deduplicated)
function hull(verts, dirs) {
  const out = [];
  for (const d of dirs) {
    let best = -Infinity, bi = -1;
    for (let i = 0; i < verts.length; i += 3) { const s = verts[i] * d.x + verts[i + 1] * d.y + verts[i + 2] * d.z; if (s > best) { best = s; bi = i; } }
    if (bi < 0) continue;
    const p = new THREE.Vector3(verts[bi], verts[bi + 1], verts[bi + 2]);
    if (!out.some((q) => q.distanceToSquared(p) < 0.0004)) out.push(p);
  }
  return out;
}

export function buildLoose(M, look, W, K) {
  const { cave, rockMat, fx, protos } = K;
  const sfx = (n, o) => { if (K.sfx) K.sfx(n, o); };
  const group = new THREE.Group();
  const bodies = [];
  const solid = (x, y) => cave.solid(Math.floor(x), Math.floor(y));
  const tileAt = (x, y) => cave.tile(Math.floor(x), Math.floor(y));

  // ------------------------------------------------------------------ the drawn floor, memoised
  const memo = new Map(); let memoVer = -1;
  const IN = 1e9, NONE = -1e9;
  const ground = (x, y, z) => {
    if (cave.ver !== memoVer || memo.size > 250000) { memo.clear(); memoVer = cave.ver; }
    const ix = Math.round(x * 25), iz = Math.round(z * 25), iy = Math.floor(y * 4 + 2);
    const key = ((ix + 4096) * 2048 + (iz + 1024)) * 8192 + (iy + 4096);
    let v = memo.get(key);
    if (v === undefined) { const h = cave.vray(ix / 25, (iy + 1) / 4, iz / 25, -1, 2.5); v = h > 0 ? cave.hy : h < 0 ? IN : NONE; memo.set(key, v); }
    return v;
  };

  // the back wall behind an open cell (where the rock starts, drawn), memoised on a quarter-metre grid
  const bmemo = new Map(); let bmemoVer = -1;
  const backZ = (x, y) => {
    if (cave.ver !== bmemoVer) { bmemo.clear(); bmemoVer = cave.ver; }
    const ix = Math.round(x * 4), iy = Math.round(y * 4), key = (ix + 8192) * 16384 + (iy + 8192);
    let v = bmemo.get(key);
    if (v === undefined) { v = cave.surfaceZ(ix / 4, iy / 4, true); bmemo.set(key, v); }
    return v;
  };

  // ------------------------------------------------------------------ candidates: everything that can come loose
  const cands = [], byX = new Map();
  const index = (c) => { for (let x = Math.floor(c.x0); x <= Math.floor(c.x1); x++) { let L = byX.get(x); if (!L) byX.set(x, L = []); L.push(c); } };
  const near = (x0, x1, fn) => { const seen = new Set(); for (let x = Math.floor(x0) - 1; x <= Math.floor(x1) + 1; x++) for (const c of byX.get(x) || []) if (!seen.has(c)) { seen.add(c); fn(c); } };
  const supIdx = (x, y) => { const tx = Math.floor(x), ty = Math.floor(y); return cave.solid(tx, ty) ? ty * 4096 + tx : -1; };
  // props baked by decor.js / detail.js
  for (const root of K.props || []) {
    const kind = root.userData.kind;
    let kd = KINDS[kind];
    if (!kd || !root.userData.ranges || !root.userData.ranges.length) continue;
    if (kd.hang && root.userData.lane) kd = { ...kd, hang: 0, round: 'y' };   // a lantern standing on the floor tips over
    root.updateMatrixWorld(true);
    const bb = _box.setFromObject(root);
    if (bb.isEmpty()) continue;
    const sup = new Set(root.userData.sup || []);
    if (!sup.size && root.userData.feet) for (const [mode, x, y] of root.userData.feet) { const k = supIdx(x, mode === 'roof' ? y + 0.06 : y - 0.06); if (k >= 0) sup.add(k); }
    if (!sup.size) {   // not settled: whatever rock it touches below (or, for things in the cut face, the cell it is in)
      const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2;
      if (bb.min.z > 1.4 && cave.solid(Math.floor(cx), Math.floor(cy))) sup.add(supIdx(cx, cy));
      else if (kd.hang) { const k = supIdx(root.position.x, root.position.y + 0.06); if (k >= 0) sup.add(k); }
      else for (const x of [bb.min.x + 0.05, cx, bb.max.x - 0.05]) { const k = supIdx(x, bb.min.y - 0.06); if (k >= 0) sup.add(k); }
    }
    const c = { kd, kind, root, ranges: root.userData.ranges, x0: bb.min.x, x1: bb.max.x, y0: bb.min.y, y1: bb.max.y, z0: bb.min.z, z1: bb.max.z,
      x: (bb.min.x + bb.max.x) / 2, y: (bb.min.y + bb.max.y) / 2, z: (bb.min.z + bb.max.z) / 2, sup, st: 'baked', hits: 0, emit: root.userData.emit || null, lane: !!root.userData.lane };
    cands.push(c); index(c);
  }
  // rock pieces baked into detail.js batches
  for (const b of K.rocks || []) for (const p of b.pieces) {
    const kd = ROCKK[p.kind];
    if (!kd || p.sup < 0) continue;
    const c = { kd, kind: p.kind, rock: p, batch: b, x0: p.x - p.r, x1: p.x + p.r, y0: p.y - p.r, y1: p.y + p.r, z0: p.z - p.r, z1: p.z + p.r, x: p.x, y: p.y, z: p.z,
      sup: new Set([p.sup]), st: 'baked', hits: 0, lane: !!p.lane, r: p.r };
    cands.push(c); index(c);
  }
  // frames carry their lanterns: when a frame falls, its lantern comes with it
  for (const c of cands) if (c.root && c.root.userData.on) { const f = cands.find((d) => d.root === c.root.userData.on); if (f) (f.deps ||= []).push(c); }

  // collapse a baked thing's vertices to a point: it vanishes from the bake
  const collapse = (mesh, s, n) => {
    const a = mesh.geometry.attributes.position, A = a.array, x = A[s * 3], y = A[s * 3 + 1], z = A[s * 3 + 2];
    for (let i = s; i < s + n; i++) { A[i * 3] = x; A[i * 3 + 1] = y; A[i * 3 + 2] = z; }
    a.addUpdateRange(s * 3, n * 3); a.needsUpdate = true;
  };

  // ------------------------------------------------------------------ bodies
  // a body drives a pivot group at its centre of mass; pts are its hull points in the pivot's frame
  const makeBody = (pivot, pts, size, kd, o = {}) => {
    const sx = Math.max(0.04, size.x), sy = Math.max(0.04, size.y), sz = Math.max(0.04, size.z);
    const m = Math.max(0.15, (kd.dens || 500) * sx * sy * sz * 0.55);
    const b = { o: pivot, p: pivot.position, q: pivot.quaternion, v: new THREE.Vector3(), w: new THREE.Vector3(), m, im: 1 / m,
      iI: new THREE.Vector3(12 / (m * (sy * sy + sz * sz)), 12 / (m * (sx * sx + sz * sz)), 12 / (m * (sx * sx + sy * sy))),
      pts, rad: Math.max(...pts.map((p) => p.length()), 0.05), ri: Math.min(sx, sy, sz) * 0.45, kd, mat: kd.mat || 'stone', rest: 0, awake: true, age: 0, sndT: 0, rollT: 0,
      con: [], mu: kd.round ? 0.55 : kd.mat === 'stone' ? 0.75 : 0.65, bounce: kd.mat === 'tin' ? 0.3 : kd.mat === 'stone' ? 0.2 : 0.25, ...o };
    for (let i = 0; i < pts.length; i++) b.con.push({ r: new THREE.Vector3(), n: new THREE.Vector3(), d: 0 });
    group.add(pivot);
    bodies.push(b);
    if (bodies.length > MAXLIVE) retire();
    return b;
  };
  const free = (b) => {
    group.remove(b.o);
    if (b.own) b.o.traverse((m) => { if (m.geometry) m.geometry.dispose(); });
    const i = bodies.indexOf(b); if (i >= 0) bodies.splice(i, 1);
    if (b.c) b.c.st = 'gone';
  };
  // too many: merge the oldest resting rock into the heap, or let the oldest resting thing go
  const retire = () => {
    let best = null;
    for (const b of bodies) if (!b.awake && !b.hang && (!best || b.age > best.age)) best = b;
    if (!best) return;
    if (best.rock && toHeap(best)) return;
    free(best);
  };

  // lift a baked prop out of the bake: a live object and a rigid body (or a pendulum, for lanterns and chains)
  const liftProp = (c, swing) => {
    for (const [mesh, s, n] of c.ranges) collapse(mesh, s, n);
    c.st = 'live';
    const root = c.root;
    root.updateMatrixWorld(true);
    // its vertices in its own frame (for the hull), and its world box
    const verts = [];
    root.traverse((m) => {
      if (!m.isMesh || !m.geometry || !m.geometry.attributes.position) return;
      _m.copy(root.matrixWorld).invert().multiply(m.matrixWorld);
      const P = m.geometry.attributes.position, step = Math.max(1, Math.floor(P.count / 2500));
      for (let i = 0; i < P.count; i += step) { _v.fromBufferAttribute(P, i).applyMatrix4(_m); verts.push(_v.x, _v.y, _v.z); }
    });
    const lp = hull(verts, c.kd.round ? ROUND[c.kd.round] : DIRS);
    if (c.kd.hang && swing !== false) {
      // a pendulum from its hook (its origin)
      const pivot = new THREE.Group(); pivot.position.copy(root.position);
      root.position.set(0, 0, 0); pivot.add(root); group.add(pivot);
      const L = Math.max(0.2, (c.y1 - c.y0) * 0.6);
      const b = { o: pivot, hang: true, c, ax: 0, az: 0, vx: 0, vz: 0, L, emit: c.emit, eo: c.emit ? new THREE.Vector3(c.emit.x - pivot.position.x, c.emit.y - pivot.position.y, c.emit.z - pivot.position.z) : null, awake: true, age: 0, sndT: 0, kd: c.kd, p: pivot.position };
      bodies.push(b); c.body = b;
      return b;
    }
    const cen = new THREE.Vector3((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2, (c.z0 + c.z1) / 2);
    const pivot = new THREE.Group(); pivot.position.copy(cen);
    root.position.sub(cen); pivot.add(root);
    root.updateMatrix();
    const pts = lp.map((p) => p.applyMatrix4(root.matrix));
    const b = makeBody(pivot, pts, new THREE.Vector3(c.x1 - c.x0, c.y1 - c.y0, c.z1 - c.z0), c.kd, { c, emit: c.emit, eo: c.emit ? new THREE.Vector3(c.emit.x - cen.x, c.emit.y - cen.y, c.emit.z - cen.z) : null });
    c.body = b;
    if (c.deps) for (const d of c.deps) loosen(d);
    return b;
  };
  // a swinging lantern whose hook has gone: it drops as a rigid body from where it hangs now
  const dropHang = (b) => {
    const c = b.c, root = c.root;
    b.o.updateMatrixWorld(true);
    root.matrixWorld.decompose(root.position, root.quaternion, root.scale);
    b.o.remove(root); group.remove(b.o);
    const i = bodies.indexOf(b); if (i >= 0) bodies.splice(i, 1);
    root.updateMatrixWorld(true);
    const bb = _box.setFromObject(root);
    Object.assign(c, { x0: bb.min.x, x1: bb.max.x, y0: bb.min.y, y1: bb.max.y, z0: bb.min.z, z1: bb.max.z, st: 'baked', ranges: [] });
    return liftProp(c, false);
  };
  // whatever state it is in, it falls now (its rock or its frame has gone)
  const loosen = (c) => {
    if (c.st === 'gone') return null;
    if (c.kd.poof) {   // hanging growth with its rock gone: it drops away in a puff of grit
      for (const [mesh, s0, n] of c.ranges) collapse(mesh, s0, n);
      c.st = 'gone';
      fx.dust(c.x, c.y1 - 0.2, c.z, { n: 3, s0: 0.2, s1: 0.9, life: 1.6, a: 0.3, vy: -0.6 });
      fx.debris(c.x, c.y1 - 0.1, c.z, { n: 3, speed: 1, size: 0.04 });
      return null;
    }
    if (c.st === 'baked') return c.rock ? liftRock(c) : liftProp(c, false);
    const b = c.body;
    if (b && b.hang) return dropHang(b);
    if (b) { b.awake = true; b.rest = 0; }
    return b;
  };
  // a rock piece out of a detail batch: its vertices copied into its own little mesh (same rock material)
  const liftRock = (c) => {
    const p = c.rock, B = c.batch, g = B.mesh.geometry, s = p.s, n = p.n;
    const pos = g.attributes.position.array.slice(s * 3, (s + n) * 3);
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < n; i++) { cx += pos[i * 3]; cy += pos[i * 3 + 1]; cz += pos[i * 3 + 2]; }
    cx /= n; cy /= n; cz /= n;
    for (let i = 0; i < n; i++) { pos[i * 3] -= cx; pos[i * 3 + 1] -= cy; pos[i * 3 + 2] -= cz; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    for (const [k, sz] of [['normal', 3], ['color', 3], ['aMat', 4], ['aCode', 1]]) geo.setAttribute(k, new THREE.BufferAttribute(g.attributes[k].array.slice(s * sz, (s + n) * sz), sz));
    geo.computeBoundingSphere();
    collapse(B.mesh, s, n);
    c.st = 'live';
    const mesh = new THREE.Mesh(geo, rockMat); mesh.castShadow = p.r > 0.12; mesh.receiveShadow = true;
    const pivot = new THREE.Group(); pivot.position.set(cx, cy, cz); pivot.add(mesh);
    _box.setFromBufferAttribute(geo.attributes.position);
    const size = _box.getSize(new THREE.Vector3());
    const b = makeBody(pivot, hull(pos, DIRS), size, c.kd, { c, rock: true, own: true });
    c.body = b;
    return b;
  };
  // wake a candidate (lifting it out of the bake) or a body; `imp` an impulse [x,y,z] at a point `at` (world) or null
  const wake = (c, imp, at = 0.65) => {
    let b = c.body;
    if (c.st === 'gone') return null;
    if (c.st === 'baked') b = c.rock ? liftRock(c) : liftProp(c);
    if (!b) return null;
    b.awake = true; b.rest = 0;
    if (imp && !b.hang) push(b, imp, at);
    return b;
  };
  // an impulse on a body at a height fraction `at` of it (0 bottom, 1 top) on the side it comes from
  const push = (b, imp, at = 0.65) => {
    _j.set(imp[0], imp[1], imp[2]);
    const r = b.rad;
    _a.set(-Math.sign(imp[0]) * r * 0.5, (at - 0.5) * 2 * r * 0.8, -Math.sign(imp[2]) * r * 0.3);
    b.v.addScaledVector(_j, b.im);
    _b.crossVectors(_a, _j); invI(b, _b, _w);
    if (_w.lengthSq() > 144) _w.setLength(12);   // a light thing hit hard tumbles, it does not become a top
    b.w.add(_w);
    if (b.v.lengthSq() > 100) b.v.setLength(10);
    b.awake = true; b.rest = 0;
  };
  const invI = (b, v, out) => { _qi.copy(b.q).invert(); out.copy(v).applyQuaternion(_qi); out.multiply(b.iI); return out.applyQuaternion(b.q); };
  const effMass = (b, r, n) => { _a.crossVectors(r, n); invI(b, _a, _b); _b.cross(r); return b.im + n.dot(_b); };
  const applyImp = (b, r, j) => { b.v.addScaledVector(j, b.im); _a.crossVectors(r, j); invI(b, _a, _b); b.w.add(_b); };

  // ------------------------------------------------------------------ rubble: chunks of rock out of a dug cell
  const PR = protos();
  const rub = look.rubble || [0.5, 0.45, 0.4];
  const rockCol = (gold) => { const k = 0.75 + Math.random() * 0.4, m = Math.random(); return [(look.rock[0] * (1 - m) + rub[0] * m) * k, (look.rock[1] * (1 - m) + rub[1] * m) * k, (look.rock[2] * (1 - m) + rub[2] * m) * k]; };
  const chunk = (x, y, z, s, vel, o = {}) => {
    const pr = s < 0.08 ? PR.peb[Math.floor(Math.random() * 3)] : PR.lump[Math.floor(Math.random() * 4)];
    const sx = s * (0.8 + Math.random() * 0.5), sy = s * (0.6 + Math.random() * 0.4), sz = s * (0.8 + Math.random() * 0.5);
    const n = pr.pos.length / 3, pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), col = new Float32Array(n * 3), mat = new Float32Array(n * 4), code = new Float32Array(n);
    const c = o.col || rockCol(), gold = o.gold || 0, glow = o.glow || 0;
    for (let i = 0; i < n; i++) {
      pos[i * 3] = pr.pos[i * 3] * sx; pos[i * 3 + 1] = (pr.pos[i * 3 + 1] - (pr.minY + pr.maxY) / 2) * sy; pos[i * 3 + 2] = pr.pos[i * 3 + 2] * sz;
      let nx = pr.nrm[i * 3] / sx, ny = pr.nrm[i * 3 + 1] / sy, nz = pr.nrm[i * 3 + 2] / sz; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      nrm[i * 3] = nx; nrm[i * 3 + 1] = ny; nrm[i * 3 + 2] = nz;
      const sh = 0.5 + 0.5 * Math.min(1, Math.max(0, ny * 0.5 + 0.55));
      col[i * 3] = c[0] * sh * 1.15; col[i * 3 + 1] = c[1] * sh * 1.15; col[i * 3 + 2] = c[2] * sh * 1.15;   // fresh broken stone: a little paler
      mat[i * 4] = gold * (Math.random() < 0.5 ? 1 : 0.3); mat[i * 4 + 1] = look.wet || 0; mat[i * 4 + 2] = glow;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setAttribute('aMat', new THREE.BufferAttribute(mat, 4)); geo.setAttribute('aCode', new THREE.BufferAttribute(code, 1));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, rockMat); mesh.castShadow = s > 0.1; mesh.receiveShadow = true;
    const pivot = new THREE.Group(); pivot.position.set(x, y, z); pivot.add(mesh);
    pivot.quaternion.setFromEuler(_e.set(Math.random() * 6.3, Math.random() * 6.3, Math.random() * 6.3));
    const b = makeBody(pivot, hull(pos, DIRS), new THREE.Vector3(sx * 2, sy * 1.4, sz * 2), ROCKK.stone, { rock: true, own: true, chip: s < 0.08 });
    b.v.set(vel[0], vel[1], vel[2]);
    b.w.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
    return b;
  };

  // the heap: resting rock merged into one growing mesh (rock material, so it looks like the rest of the rock)
  const HEAPV = 60000;
  const heap = (() => {
    const g = new THREE.BufferGeometry();
    for (const [k, sz] of [['position', 3], ['normal', 3], ['color', 3], ['aMat', 4], ['aCode', 1]]) { const a = new THREE.BufferAttribute(new Float32Array(HEAPV * sz), sz); a.setUsage(THREE.DynamicDrawUsage); g.setAttribute(k, a); }
    g.setDrawRange(0, 0);
    const m = new THREE.Mesh(g, rockMat); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.matrixAutoUpdate = false;
    group.add(m);
    return { m, g, n: 0 };
  })();
  const toHeap = (b) => {
    const mesh = b.o.children[0], g = mesh.geometry, n = g.attributes.position.count;
    if (heap.n + n > HEAPV) return false;
    b.o.updateMatrixWorld(true);
    const nm = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld), s = heap.n;
    const P = g.attributes.position, N = g.attributes.normal;
    const HP = heap.g.attributes.position, HN = heap.g.attributes.normal;
    for (let i = 0; i < n; i++) {
      _v.fromBufferAttribute(P, i).applyMatrix4(mesh.matrixWorld); HP.setXYZ(s + i, _v.x, _v.y, _v.z);
      _v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); HN.setXYZ(s + i, _v.x, _v.y, _v.z);
    }
    heap.g.attributes.color.array.set(g.attributes.color.array, s * 3);
    heap.g.attributes.aMat.array.set(g.attributes.aMat.array, s * 4);
    heap.g.attributes.aCode.array.set(g.attributes.aCode.array, s);
    for (const [k, sz] of [['position', 3], ['normal', 3], ['color', 3], ['aMat', 4], ['aCode', 1]]) { const a = heap.g.attributes[k]; a.addUpdateRange(s * sz, n * sz); a.needsUpdate = true; }
    heap.n += n; heap.g.setDrawRange(0, heap.n);
    // the heap is part of the rock now (the float test and the props' feet do not see it, which is fine: it is low)
    free(b);
    return true;
  };

  // ------------------------------------------------------------------ breaking things
  const shards = (b, n, size) => {
    // a few pieces in the thing's own material (planks for a crate, shards for an urn)
    const src = []; b.o.traverse((m) => { if (m.isMesh && m.material && !Array.isArray(m.material) && m.material.vertexColors) src.push(m); });
    const m0 = src[0]; if (!m0) return;
    const C = m0.geometry.attributes.color, cc = C ? [C.getX(0), C.getY(0), C.getZ(0)] : [0.5, 0.4, 0.3];
    for (let k = 0; k < n; k++) {
      const w = size * (0.5 + Math.random() * 0.8), geo = b.mat === 'wood' ? new THREE.BoxGeometry(w * 1.6, 0.03, w * 0.35) : new THREE.BoxGeometry(w * 0.7, w * 0.5, 0.025);
      const cnt = geo.attributes.position.count, col = new Float32Array(cnt * 3);
      const sh = 0.75 + Math.random() * 0.4; for (let i = 0; i < cnt; i++) { col[i * 3] = cc[0] * sh; col[i * 3 + 1] = cc[1] * sh; col[i * 3 + 2] = cc[2] * sh; }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mesh = new THREE.Mesh(geo, m0.material); mesh.castShadow = true; mesh.receiveShadow = true;
      const pivot = new THREE.Group(); pivot.position.set(b.p.x + (Math.random() - 0.5) * size, b.p.y + (Math.random() - 0.3) * size, b.p.z + (Math.random() - 0.5) * size * 0.6);
      pivot.quaternion.setFromEuler(_e.set(Math.random() * 6.3, Math.random() * 6.3, Math.random() * 6.3)); pivot.add(mesh);
      const pos = geo.attributes.position.array;
      const sb = makeBody(pivot, hull(pos, DIRS), new THREE.Vector3(w, 0.05, w * 0.4), { mat: b.mat, dens: 600 }, { own: true, shard: true });
      sb.v.set(b.v.x + (Math.random() - 0.5) * 3, b.v.y + 1 + Math.random() * 2.5, b.v.z + (Math.random() - 0.5) * 2);
      sb.w.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18);
    }
  };
  const smash = (b, quiet) => {
    const x = b.p.x, y = b.p.y, z = b.p.z, r = b.rad;
    if (b.mat === 'glass') {
      const c = b.c && b.c.root ? colourOf(b.o) : [0.9, 0.9, 1];
      for (let k = 0; k < 10; k++) fx.glint(x + (Math.random() - 0.5) * r, y + (Math.random() - 0.5) * r, z + 0.15, 0.3 + Math.random() * 0.35, [Math.min(1.6, c[0] * 1.3 + 0.4), Math.min(1.6, c[1] * 1.3 + 0.4), Math.min(1.6, c[2] * 1.3 + 0.4)]);
      fx.sparks(x, y, z + 0.1, { n: 10, speed: 3, s: 0.07, grav: 7, r: c[0], g: c[1], b: c[2] });
      if (!quiet) sfx('tinkle', { x, y, vol: 0.6 });
    } else if (b.mat === 'stone') {
      fx.debris(x, y, z, { n: 8, speed: 3, size: Math.min(0.14, r * 0.4) });
      for (let k = 0; k < 3; k++) chunk(x + (Math.random() - 0.5) * r, y, z + (Math.random() - 0.5) * r * 0.5, Math.min(0.12, r * 0.35) * (0.6 + Math.random() * 0.5), [b.v.x + (Math.random() - 0.5) * 2, 1 + Math.random() * 2, (Math.random() - 0.5) * 1.5]);
      if (!quiet) sfx('topple', { x, y, vol: 0.5, rate: 1.2 });
    } else {
      shards(b, b.mat === 'wood' ? 5 : 6, Math.min(0.5, r * 0.9));
      fx.dust(x, y, z, { n: 4, s0: 0.25, s1: 1.1, life: 1.8, a: 0.32 });
      if (!quiet) sfx(b.mat === 'wood' ? 'splinter' : 'potbreak', { x, y, vol: 0.65 });
    }
    if (b.emit) { b.emit.int = 0; }
    free(b);
  };
  const colourOf = (o) => { let c = null; o.traverse((m) => { if (!c && m.isMesh && m.geometry.attributes.color) { const C = m.geometry.attributes.color; c = [C.getX(0), C.getY(0), C.getZ(0)]; } }); return c || [0.9, 0.9, 1]; };

  // ------------------------------------------------------------------ the physics step
  const contacts = (b) => {
    let nc = 0;
    for (let i = 0; i < b.pts.length; i++) {
      const c = b.con[nc];
      c.r.copy(b.pts[i]).applyQuaternion(b.q);
      const px = b.p.x + c.r.x, py = b.p.y + c.r.y, pz = b.p.z + c.r.z;
      const g = ground(px, py, pz);
      if (g === IN) {
        // inside rock: out of a solid cell the shortest way, or out of the back wall / front face of an open one
        const tx = Math.floor(px), ty = Math.floor(py);
        if (cave.solid(tx, ty)) {
          let best = 0.6, nx = 0, ny = 0;
          if (!cave.solid(tx, ty + 1) && ty + 1 - py < best) { best = ty + 1 - py; nx = 0; ny = 1; }
          if (!cave.solid(tx - 1, ty) && px - tx < best) { best = px - tx; nx = -1; ny = 0; }
          if (!cave.solid(tx + 1, ty) && tx + 1 - px < best) { best = tx + 1 - px; nx = 1; ny = 0; }
          if (!cave.solid(tx, ty - 1) && py - ty < best) { best = py - ty; nx = 0; ny = -1; }
          if (!nx && !ny) continue;
          c.n.set(nx, ny, 0); c.d = best;
        } else if (Math.abs(pz) < 1.3) {
          if (cave.solid(tx - 1, ty)) c.n.set(1, 0, 0); else if (cave.solid(tx + 1, ty)) c.n.set(-1, 0, 0); else c.n.set(0, 1, 0);
          c.d = 0.02;
        } else if (pz < 0) { const zb = backZ(px, py); c.n.set(0, 0, 1); c.d = Math.min(0.3, Math.max(0.01, zb - pz)); }   // in the back wall
        else { c.n.set(0, 0, -1); c.d = 0.03; }
        nc++;
      } else if (g !== NONE && py < g) {
        c.d = g - py;
        // the floor's slope from its neighbours (flat if they are odd)
        const gx0 = ground(px - 0.08, py, pz), gx1 = ground(px + 0.08, py, pz), gz0 = ground(px, py, pz - 0.08), gz1 = ground(px, py, pz + 0.08);
        if (Math.abs(gx0) < 1e8 && Math.abs(gx1) < 1e8 && Math.abs(gz0) < 1e8 && Math.abs(gz1) < 1e8 && Math.abs(gx1 - gx0) < 0.12 && Math.abs(gz1 - gz0) < 0.12) c.n.set(-(gx1 - gx0) / 0.16, 1, -(gz1 - gz0) / 0.16).normalize();
        else c.n.set(0, 1, 0);
        nc++;
      }
    }
    return nc;
  };
  let sndBudget = 0;
  const impactSound = (b, vn) => {
    if (b.sndT > 0 || sndBudget <= 0 || vn > -1.4) return;
    const s = SND[b.mat] || SND.stone, k = Math.min(1, (-vn - 1.2) / 5) * Math.min(1, 0.35 + b.m / 25);
    if (k < 0.05) return;
    let name = s[0], rate = s[1] * (0.9 + Math.random() * 0.2);
    if (b.mat === 'stone' && b.m > 30) { name = 'topple'; rate = 1; }
    if (b.chip) rate *= 1.3;
    sfx(name, { x: b.p.x, y: b.p.y, vol: Math.min(0.7, 0.12 + k * 0.6), rate, gap: 0.05 });
    b.sndT = 0.14; sndBudget--;
  };
  const stepBody = (b, h) => {
    // water and lava
    const t = tileAt(b.p.x, b.p.y);
    if (t === T.WATER) {
      if (!b.wet) { b.wet = true; fx.splash(b.p.x, b.p.y + 0.3, b.p.z, Math.min(1.2, 0.3 + b.m / 40)); if (b.m > 2) sfx('splash', { x: b.p.x, y: b.p.y, vol: Math.min(0.6, 0.2 + b.m / 60), gap: 0.1 }); }
      let top = Math.floor(b.p.y) + 1; for (let k = 0; k < 8 && tileAt(b.p.x, top + 0.5) === T.WATER; k++) top++;
      if (b.kd.float) b.v.y += (GRAV * 1.6 * Math.min(1, Math.max(0, (top - b.p.y + b.rad * 0.3) / (b.rad + 0.05))) - 0) * h;
      else b.v.y += GRAV * 0.55 * h;
      const d = Math.exp(-3.2 * h); b.v.multiplyScalar(d); b.w.multiplyScalar(Math.exp(-2 * h));
    } else if (t === T.LAVA) {
      if (!b.burn) { b.burn = 1.8; fx.fire(b.p.x, b.p.y, b.p.z, { n: 6, s: 0.8, life: 0.8 }); sfx('burn', { x: b.p.x, y: b.p.y, vol: 0.5, gap: 0.2 }); }
      b.v.multiplyScalar(Math.exp(-6 * h)); b.v.y = Math.max(b.v.y, -0.4); b.v.y += GRAV * 0.9 * h;
    } else b.wet = false;
    b.v.y -= GRAV * h;
    b.p.addScaledVector(b.v, h);
    const q = b.q, wx = b.w.x, wy = b.w.y, wz = b.w.z, hh = 0.5 * h, qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    q.set(qx + hh * (wx * qw + wy * qz - wz * qy), qy + hh * (wy * qw + wz * qx - wx * qz), qz + hh * (wz * qw + wx * qy - wy * qx), qw + hh * (-wx * qx - wy * qy - wz * qz)).normalize();
    const nc = contacts(b);
    if (nc) b.touchT = 0.12; else b.touchT = (b.touchT || 0) - h;
    b.touch = b.touchT > 0;   // (sticky: a resting body is pushed clear of the rock on some substeps)
    if (nc) {
      for (let it = 0; it < 4; it++) for (let k = 0; k < nc; k++) {
        const c = b.con[k];
        _vp.crossVectors(b.w, c.r).add(b.v);
        const vn = _vp.dot(c.n);
        if (vn >= 0) continue;
        if (it === 0) impactSound(b, vn);
        const e = vn < -2.2 ? b.bounce : 0;
        const jn = -(1 + e) * vn / effMass(b, c.r, c.n);
        applyImp(b, c.r, _j.copy(c.n).multiplyScalar(jn));
        _vp.crossVectors(b.w, c.r).add(b.v);
        _t.copy(_vp).addScaledVector(c.n, -_vp.dot(c.n));
        const vt = _t.length();
        if (vt > 1e-5) { _t.multiplyScalar(1 / vt); const jt = Math.min(vt / effMass(b, c.r, _t), b.mu * jn); applyImp(b, c.r, _j.copy(_t).multiplyScalar(-jt)); }
      }
      // out of the rock along the deepest contact
      let dm = 0, km = -1; for (let k = 0; k < nc; k++) if (b.con[k].d > dm) { dm = b.con[k].d; km = k; }
      if (km >= 0 && dm > 0.003) b.p.addScaledVector(b.con[km].n, Math.min(0.2, (dm - 0.002) * 0.85));
      // rolling resistance, and a firmer hand once it is nearly still (no endless rocking on a bumpy floor)
      const slow = b.v.lengthSq() < 0.09 && b.w.lengthSq() < 2.5;
      b.w.multiplyScalar(Math.exp(-(slow ? 7 : b.kd.round ? 1.3 : 2.4) * h));
      b.v.multiplyScalar(Math.exp(-(slow ? 4.5 : b.kd.round ? 0.9 : 0.35) * h));
    }
    if (b.v.lengthSq() > 400) b.v.setLength(20);
    if (b.w.lengthSq() > 900) b.w.setLength(30);
    // keep out of the camera's face and in front of the back wall
    if (b.p.z > 1.6) { b.p.z = 1.6; b.v.z = -Math.abs(b.v.z) * 0.3; }   // (not in front of the digger's lane for good)
    if (b.p.z < -1.2) { const zb = backZ(b.p.x, b.p.y) + b.ri * 0.8; if (b.p.z < zb) { b.p.z = zb; if (b.v.z < 0) b.v.z = -b.v.z * 0.25; } }
  };

  // ------------------------------------------------------------------ bites: where the pick has been at the rock
  // (the rock shader draws cracks spreading from each, per pixel, so they read on a phone's coarser rock too)
  const BU = rockMat.userData.U, bites = [];
  const setBites = () => {
    const lo = BU.uBiteLo.value.set(1e9, 1e9, 1e9), hi = BU.uBiteHi.value.set(-1e9, -1e9, -1e9);
    for (let i = 0; i < BITES; i++) {
      const b = bites[i], u = BU.uBite.value[i];
      if (!b) { u.set(0, -999, 0, 0); continue; }
      u.set(b.x, b.y, b.z, b.w);
      lo.min(_v.set(b.x - 0.9, b.y - 0.9, b.z - 0.9)); hi.max(_v.set(b.x + 0.9, b.y + 0.9, b.z + 0.9));
    }
    if (!bites.length) { lo.set(0, -999, 0); hi.set(0, -999, 0); }
  };
  const bite = (tx, ty, key, x, y, z, w) => {
    let b = bites.find((q) => q.key === key);
    if (b) b.w = Math.max(b.w, w);
    else { bites.push(b = { tx, ty, key, x, y, z, w }); if (bites.length > BITES) bites.shift(); }
    setBites();
  };
  setBites();

  // ------------------------------------------------------------------ craters from blasts (after the rock has opened)
  const pending = [];
  const crater = (x, y) => {
    // march out from the heart in every direction to where the rock starts, and bite there
    for (let k = 0; k < 14; k++) {
      const a = k / 14 * Math.PI * 2 + Math.random() * 0.3, dz = (Math.random() - 0.5) * 0.6;
      const dx = Math.cos(a), dy = Math.sin(a);
      for (let s = 0.3; s < 2.8; s += 0.1) {
        const px = x + dx * s, py = y + dy * s, pz = dz * s;
        if (cave.density(px, py, pz) <= 0) continue;
        const f = 1 - s / 2.8, floor = dy < -0.6 && Math.abs(pz) < 0.7;
        cave.dent(px, py, pz, 0.45 + f * 0.4, (floor ? 0.07 : 0.12 + f * 0.16) * (0.7 + Math.random() * 0.5), { fresh: 0.2, soot: 0.7 * f });
        break;
      }
    }
    cave.dent(x, y, -0.2, 2.6, 0, { fresh: 0, soot: 0.55 });   // the soot round it
  };

  // ------------------------------------------------------------------ events from the sim
  let lastP = null;
  const strikeAt = (P, aim) => [P.x + (aim === 0 ? P.face * 0.85 : P.face * 0.3), P.y + (aim === 1 ? 1.9 : aim === -1 ? -0.1 : 0.85)];
  const knockAround = (x, y, rx, ry, zlo, zhi, fn) => near(x - rx - 1, x + rx + 1, (c) => {
    if (c.st === 'gone') return;
    const b = c.st === 'live' ? c.body : null, cx = b ? b.p.x : c.x, cy = b ? b.p.y : c.y, cz = b ? b.p.z : c.z, r = b ? b.rad || 0.3 : Math.max(c.x1 - c.x0, c.y1 - c.y0) / 2;
    if (Math.abs(cx - x) < rx + r && Math.abs(cy - y) < ry + r && cz > zlo && cz < zhi) fn(c, cx, cy, cz);
  });
  const event = (e, Wd) => {
    const P = Wd && Wd.players ? Wd.players[0] : lastP;
    switch (e.k) {
      case 'pick': case 'ore': case 'clink': case 'miss': {
        if (!P) break;
        const aim = e.aim ?? P.pickAim ?? 0, face = e.dir ?? P.face;
        // the bite: on the face of the cell toward the digger (a scratch on bedrock and boulders)
        if (e.hx !== undefined && e.k !== 'miss') {
          const hard = e.k === 'clink';
          const zz = (Math.random() - 0.5) * 0.35, jx = aim === 0 ? 0 : (Math.random() - 0.5) * 0.16, jy = aim === 0 ? (Math.random() - 0.5) * 0.16 : 0;
          const depth = hard ? 0.018 : 0.06 + (e.f || 0) * 0.05, r = hard ? 0.2 : 0.38 + Math.random() * 0.08;
          cave.dent(e.hx + jx, e.hy + jy, zz, r, depth, { fresh: hard ? 0.9 : 0.75 });
          const tx = Math.floor(e.x), ty = Math.floor(e.y);
          if (hard) bite(tx, ty, 'h' + Math.round(e.hx * 4) + ',' + Math.round(e.hy * 4), e.hx, e.hy, 0, 0.14);
          else {
            bite(tx, ty, tx + ',' + ty + ',' + aim + ',' + face, e.hx, e.hy, 0.05, Math.max(0.2, e.f || 0.2));
            // the cell's cut face toward the camera (what you see of it from the side): it cracks and pits as it gives
            const zf = cave.surfaceZ(tx + 0.5, ty + 0.5, false);
            if (zf > 1.2 && zf < 4.6) {
              const f = Math.max(0.2, e.f || 0.2);
              bite(tx, ty, 'f' + tx + ',' + ty, tx + 0.5, ty + 0.5, zf, f);
              for (let k = 0; k < 2; k++) cave.dent(tx + 0.5 + (Math.random() - 0.5) * 0.7, ty + 0.5 + (Math.random() - 0.5) * 0.7, zf, 0.2 + Math.random() * 0.14, 0.03 + f * 0.05, { fresh: 0.85 });
              // a notch out of the corner where the face he strikes meets the cut face: the edge you see from the side
              if (aim === 0) { const cz = cave.surfaceZ(e.hx + face * 0.2, e.hy, false); if (cz > 1.2 && cz < 4.6) cave.dent(e.hx + face * 0.06, e.hy + (Math.random() - 0.5) * 0.2, cz - 0.05, 0.34 + f * 0.2, 0.07 + f * 0.09, { fresh: 0.9 }); }
              else { const cz = cave.surfaceZ(e.hx, e.hy + (aim === 1 ? 0.2 : -0.2), false); if (cz > 1.2 && cz < 4.6) cave.dent(e.hx, e.hy, cz - 0.05, 0.34 + f * 0.2, 0.07 + f * 0.09, { fresh: 0.9 }); }
              fx.debris(tx + 0.5 + (Math.random() - 0.5) * 0.5, ty + 0.4, zf + 0.1, { n: 2, speed: 1.2, size: 0.045 });
              if (f > 0.5) fx.dust(tx + 0.5, ty + 0.3, zf + 0.2, { n: 1, s0: 0.2, s1: 0.8, life: 1.6, a: 0.25, vy: -0.3 });
            }
          }
          const ox = aim === 0 ? -face * 0.12 : 0, oy = aim === 1 ? -0.1 : aim === -1 ? 0.12 : 0;
          if (!hard) {
            fx.debris(e.hx + ox, e.hy + oy, zz + 0.2, { n: 3, speed: 2.2, size: 0.05 });
            if (Math.random() < 0.55) chunk(e.hx + ox * 1.5, e.hy + oy, zz + 0.15, 0.04 + Math.random() * 0.04, [-face * (0.8 + Math.random() * 1.6) * (aim === 0 ? 1 : 0.3), 1 + Math.random() * 1.8, (Math.random() - 0.3) * 1.4], { gold: e.t === T.VEIN ? 1 : 0 });
            if (e.t === T.ROCK) fx.dust(e.hx + ox, e.hy + oy, zz + 0.2, { n: 2, s0: 0.15, s1: 0.6, life: 1.4, a: 0.3, vy: -0.2 });
          }
        }
        // what the pick head meets: knocked flying, swung, or broken
        const [sx, sy] = strikeAt(P, aim);
        knockAround(sx, sy, 0.5, 0.75, -1.4, 1.2, (c, cx, cy) => {
          if (c.kd.only === 'support' && c.kind !== 'mite' && !c.kd.frag) return;
          if (c.kd.big) return;
          if (c.kd.hang) { const b = wake(c); if (b && b.hang) { b.vx += face * 2.6 / b.L; b.vz -= 1.2 / b.L; sfx('clang', { x: cx, y: cy, vol: 0.4, rate: 1.3, gap: 0.1 }); } return; }
          if (c.kd.frag && ++c.hits >= c.kd.frag) { const b = wake(c); if (b) smash(b); return; }
          const b = wake(c, null);
          if (!b) return;
          if (c.kind === 'mite' && b.m > 3) sfx('topple', { x: cx, y: cy, vol: 0.5 });
          push(b, [face * b.m * (2.6 + Math.random() * 1.6), b.m * (aim === 1 ? -0.5 : 1.4 + Math.random()), -b.m * (0.5 + Math.random() * 0.8)], c.kind === 'mite' ? 0.85 : 0.55);
        });
        break;
      }
      case 'break': {
        const tx = Math.floor(e.x), ty = Math.floor(e.y), key = ty * 4096 + tx;
        cave.dropDents(tx, ty);
        for (let i = bites.length - 1; i >= 0; i--) if (bites[i].tx === tx && bites[i].ty === ty) bites.splice(i, 1);
        setBites();
        // what stood on it, hung from it or was bedded in it comes loose
        near(tx - 4, tx + 5, (c) => { if (c.st !== 'gone' && c.sup.has(key)) { const b = loosen(c); if (b) { b.v.y -= 0.3; if (c.kd.big) push(b, [(Math.random() - 0.5) * b.m, 0, -b.m * 0.8], 0.9); } } });
        for (const b of bodies) if (!b.hang && Math.abs(b.p.x - e.x) < 1.6 && Math.abs(b.p.y - e.y) < 1.8) { b.awake = true; b.rest = 0; }
        // glow-worm threads hanging from it go dark and fall
        if (K.worms) {
          const P3 = K.worms.pts.geometry.attributes.position;
          for (const [k2, s0, n] of K.worms.threads) if (k2 === key) {
            for (let i = s0; i < s0 + n; i++) { if (i % 3 === 0) fx.glint(P3.getX(i), P3.getY(i), P3.getZ(i), 0.25, [0.5, 1, 0.9]); P3.setY(i, -999); }
            P3.needsUpdate = true;
          }
        }
        // its rock tumbles out
        if (e.t !== T.DOOR && e.t !== T.CRUMBLE) {
          const blast = e.how === 'blast', n = blast ? 2 + Math.floor(Math.random() * 2) : e.t === T.SOFT ? 6 : 4 + Math.floor(Math.random() * 3);
          const dir = P ? Math.sign(P.x - e.x) || 1 : 1;
          for (let k = 0; k < n; k++) {
            const s = (e.t === T.SOFT ? 0.09 : 0.08) + Math.random() * (blast ? 0.14 : 0.12);
            const vel = blast ? [(Math.random() - 0.5) * 9, 3 + Math.random() * 5, (Math.random() - 0.5) * 5] : [dir * (0.5 + Math.random() * 2) + (Math.random() - 0.5), 0.5 + Math.random() * 2.2, (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.8)];
            chunk(e.x + (Math.random() - 0.5) * 0.7, e.y + (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 1.6, s, vel, { gold: e.t === T.VEIN ? 1 : 0, glow: look.cracks && Math.random() < 0.2 ? look.cracks * 0.6 : 0 });
          }
          if (!blast) sfx('rubble', { x: e.x, y: e.y, vol: 0.55, delay: 0.18, gap: 0.2 });
        }
        break;
      }
      case 'crumble': {
        const tx = Math.floor(e.x), ty = Math.floor(e.y), key = ty * 4096 + tx;
        near(tx - 4, tx + 5, (c) => { if (c.st !== 'gone' && c.sup.has(key)) loosen(c); });
        break;
      }
      case 'blast': {
        pending.push([e.x, e.y]);
        const R = 4.6, hit = new Set();
        knockAround(e.x, e.y, R, R, -9, 3, (c, cx, cy, cz) => {
          const dx = cx - e.x, dy = cy - e.y, dz = cz, d = Math.hypot(dx, dy, dz * 0.6);
          if (d > R) return;
          if (c.kd.big && d > 2.2) return;
          if (c.kd.only === 'support' && !(c.kind === 'drip' || c.kind === 'stalactite' || c.kind === 'icicles') && d > 1.6) return;
          if ((c.kind === 'drip' || c.kind === 'stalactite' || c.kind === 'icicles') && d > 3.6) return;
          if (c.kind === 'stone' && c.r < 0.05 && d > 2.5) return;   // the smallest pebbles: only close in
          const b = wake(c, null);
          if (!b) return;
          hit.add(b);
          if (b.hang) { b.vx += (dx / (d || 1)) * 6 / b.L; b.vz += 2 / b.L; return; }
          if (c.kd.frag && d < 1.8) { smash(b, true); return; }
          const f = (1 - d / R) * 9 + 1;
          push(b, [dx / (d || 1) * b.m * f, b.m * (2 + f * 0.6), (dz < 0 ? -0.12 : 0.25) * b.m * f], 0.4);
        });
        for (const b of bodies) {
          if (b.hang || hit.has(b)) continue;
          const dx = b.p.x - e.x, d = Math.hypot(dx, b.p.y - e.y) || 1;
          if (d < R) { b.v.x += dx / d * 5 * (1 - d / R); b.v.y += 3.5 * (1 - d / R); b.w.x += (Math.random() - 0.5) * 8; b.w.z += (Math.random() - 0.5) * 8; b.awake = true; b.rest = 0; }
        }
        break;
      }
      case 'land': case 'slam': case 'bossdie': case 'stalhit': {
        const big = e.k === 'slam' || e.k === 'bossdie', v = e.k === 'land' ? e.v || 0 : 10;
        if (v < 6.5) break;
        const R = big ? 6 : 1.6;
        for (const b of bodies) {
          const d = Math.hypot(b.p.x - e.x, b.p.y - e.y);
          if (d > R * 2.5) continue;
          if (b.hang) { b.vx += (Math.random() - 0.5) * 2 / b.L; b.vz += (Math.random() - 0.5) * 1.5 / b.L; continue; }
          if (d < R) { b.v.y += (1 - d / R) * (big ? 3 : 1.5); b.w.x += (Math.random() - 0.5) * 3; b.w.z += (Math.random() - 0.5) * 3; b.awake = true; b.rest = 0; }
        }
        // the shake swings lanterns nearby and hops loose things off the floor
        knockAround(e.x, e.y + 1, big ? 8 : 3.5, big ? 6 : 3, -6, 2.5, (c) => { if (c.kd.hang && c.st === 'baked') { const b = wake(c); if (b) { b.vx += (Math.random() - 0.5) * 1.6 / b.L; b.vz += (Math.random() - 0.5) * 1.2 / b.L; } } });
        if (big) knockAround(e.x, e.y, R, 2, -3, 2, (c, cx, cy) => { if (c.kd.hang || c.kd.big || c.kd.only || c.st !== 'baked' || Math.random() < 0.5) return; const b = wake(c, null); if (b) b.v.y += 1.5 + Math.random() * 1.5; });
        break;
      }
    }
  };

  // ------------------------------------------------------------------ every frame
  const box = { x0: 0, x1: 0, y0: 0, y1: 0 };
  let time = 0;
  const update = (t, dt, P, Wd) => {
    time = t; lastP = P;
    dt = Math.min(dt, 1 / 20);
    sndBudget = 6;
    while (pending.length) { const [x, y] = pending.shift(); crater(x, y); }
    // the digger against loose things: brushing past tips them, running in sends them flying
    if (P && !P.dead && !P.inCage && P.state !== 'climb') {
      box.x0 = P.x - 0.32; box.x1 = P.x + 0.32; box.y0 = P.y - 0.06; box.y1 = P.y + 1.66;   // (from just under the boots: bones lie flat, half sunk)
      const sp = Math.abs(P.vx), dir = Math.sign(P.vx) || P.face || 1;
      near(box.x0 - 0.6, box.x1 + 0.6, (c) => {
        if (c.st === 'gone' || c.kd.only || c.kd.big) return;
        if (c.kd.hang) {   // lanterns and chains: the helmet knocks them swinging (running past, or jumping up into them)
          if (c.st === 'live' && !(c.body && c.body.hang)) return;
          const vs = Math.max(sp, Math.abs(P.vy) * 0.6);
          if (vs < 0.8 || c.y0 > box.y1 + 0.05 || c.y1 < box.y1 - 0.5 || c.x1 < box.x0 || c.x0 > box.x1 || c.z1 < -0.75 || c.z0 > 0.6) return;
          const b = c.st === 'baked' ? wake(c) : c.body;
          if (b && b.hang && !(b.brushT > 0)) { b.brushT = 0.5; b.vx += (sp > 0.8 ? dir : Math.sign(c.x - P.x) || 1) * Math.min(3, vs) * 0.35 / b.L; b.vz -= 0.25 / b.L; sfx('clang', { x: c.x, y: c.y, vol: 0.25, rate: 1.4, gap: 0.2 }); }
          return;
        }
        if (c.st !== 'baked' || (c.rock && c.r < 0.07)) return;
        if (c.x1 < box.x0 || c.x0 > box.x1 || c.y1 < box.y0 || c.y0 > box.y1 || c.z1 < -0.42 || c.z0 > 0.42) return;
        if (sp < 0.4 && P.vy > -3) return;
        const b = wake(c, null);
        if (!b) return;
        const k = b.m * (0.55 + Math.min(4.5, sp) * 0.36);
        push(b, [dir * k, b.m * 0.35, (b.p.z < 0 ? -1 : 1) * k * 0.28], 0.8);
        sfx(SND[b.mat] ? SND[b.mat][0] : 'pebble', { x: b.p.x, y: b.p.y, vol: Math.min(0.5, 0.15 + sp * 0.07), rate: (SND[b.mat] ? SND[b.mat][1] : 1) * (1.05 + Math.random() * 0.1), gap: 0.08 });
      });
      if (sp > 0.3 || P.vy < -2) for (const b of bodies) {   // (standing still he leaves them be)
        if (b.hang || Math.abs(b.p.x - P.x) > b.rad + 0.6 || b.p.y + b.rad < box.y0 || b.p.y - b.rad > box.y1 || Math.abs(b.p.z) > b.rad + 0.42) continue;
        // which of its points are inside the digger
        let n = 0; _a.set(0, 0, 0);
        for (const pt of b.pts) { _v.copy(pt).applyQuaternion(b.q).add(b.p); if (_v.x > box.x0 && _v.x < box.x1 && _v.y > box.y0 && _v.y < box.y1 && Math.abs(_v.z) < 0.4) { n++; _a.add(_v); } }
        if (!n) continue;
        _a.multiplyScalar(1 / n).sub(b.p);
        const side = Math.sign(b.p.x - P.x) || dir, want = (sp > 0.3 && Math.sign(P.vx) === side ? P.vx * 1.15 : side * 0.7);
        _vp.crossVectors(b.w, _a).add(b.v);
        const dvx = want - _vp.x, dvz = (b.p.z < 0 ? -1 : 1) * 0.6 - _vp.z;
        if (Math.sign(dvx) === Math.sign(want) || Math.abs(dvz) > 0.3) {
          _j.set(Math.sign(dvx) === Math.sign(want) ? dvx : 0, 0.15, dvz * 0.6).multiplyScalar(b.m * 0.5 / Math.max(1, n * 0.6));
          applyImp(b, _a, _j); b.awake = true; b.rest = 0;
          if (b.sndT <= 0 && sp > 1.2) { sfx(SND[b.mat] ? SND[b.mat][0] : 'pebble', { x: b.p.x, y: b.p.y, vol: Math.min(0.45, 0.1 + sp * 0.06), rate: (SND[b.mat] ? SND[b.mat][1] : 1) * 1.1, gap: 0.08 }); b.sndT = 0.3; }
        }
      }
    }
    // step what is awake
    const steps = Math.max(1, Math.min(5, Math.ceil(dt / H))), h = dt / steps;
    let nAwake = 0;
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      b.age += dt; b.sndT -= dt;
      if (b.hang) {
        // a pendulum on its hook
        b.brushT = (b.brushT || 0) - dt;
        const g = GRAV / b.L, c = 1.1;
        b.vx += (-g * Math.sin(b.ax) - c * b.vx) * dt; b.vz += (-g * Math.sin(b.az) - c * b.vz) * dt;
        b.ax += b.vx * dt; b.az += b.vz * dt;
        b.ax = Math.max(-1.2, Math.min(1.2, b.ax)); b.az = Math.max(-0.9, Math.min(0.9, b.az));
        b.o.rotation.set(b.az, 0, b.ax);
        if (b.emit && b.eo) { _v.copy(b.eo).applyEuler(b.o.rotation).add(b.p); b.emit.x = _v.x; b.emit.y = _v.y; b.emit.z = _v.z; }
        continue;
      }
      if (!b.awake) continue;
      nAwake++;
      for (let s = 0; s < steps; s++) stepBody(b, h);
      if (b.burn) { b.burn -= dt; if (Math.random() < dt * 8) fx.fire(b.p.x, b.p.y, b.p.z, { n: 1, s: 0.5, life: 0.6 }); if (b.burn <= 0) { free(b); continue; } }
      if (b.emit && b.eo) { _v.copy(b.eo).applyQuaternion(b.q).add(b.p); b.emit.x = _v.x; b.emit.y = _v.y; b.emit.z = _v.z; }
      // a round thing rolling along the floor
      if (b.kd.round && b.touch && b.m > 1 && Math.abs(b.v.x) > 1.1 && b.rollT <= 0) { sfx('roll', { x: b.p.x, y: b.p.y, vol: Math.min(0.5, 0.15 + Math.abs(b.v.x) * 0.07), gap: 0.4 }); b.rollT = 1.2; }
      b.rollT -= dt;
      if (b.p.y < -14) { free(b); continue; }
      // asleep when still
      // still enough, or long awake and slow on the floor (rocking in a hollow, turning on the spot): let it settle
      const calm = b.touch && b.v.lengthSq() < 0.02 && b.w.lengthSq() < 0.12, slow = b.touch && b.age > 3 && b.v.lengthSq() < 0.16 && b.w.lengthSq() < 4;
      b.rest = calm || slow ? b.rest + dt : 0;
      if (b.rest > 0.3) {
        b.awake = false; b.v.set(0, 0, 0); b.w.set(0, 0, 0);
        // resting rubble off the lane is merged into the heap; shards fade out after a while
        if (b.rock && !b.c && Math.abs(b.p.z) > 0.42) toHeap(b);
      }
    }
    // shards linger, then sink away
    for (let i = bodies.length - 1; i >= 0; i--) { const b = bodies[i]; if (b.shard && !b.awake && b.age > 12) { b.p.y -= dt * 0.05; if (b.age > 15) free(b); } }
    // bodies push each other apart (spheres; enough to heap rubble and stop crates passing through barrels)
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (a.hang) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        if (b.hang || (!a.awake && !b.awake)) continue;
        const dx = b.p.x - a.p.x; if (dx > a.ri + b.ri || -dx > a.ri + b.ri) continue;
        const dy = b.p.y - a.p.y, dz = b.p.z - a.p.z, d2 = dx * dx + dy * dy + dz * dz, rr = a.ri + b.ri;
        if (d2 >= rr * rr || d2 < 1e-8) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, nz = dz / d, pen = rr - d;
        const rv = (b.v.x - a.v.x) * nx + (b.v.y - a.v.y) * ny + (b.v.z - a.v.z) * nz;
        const ws = a.im + b.im;
        if (rv < 0) { const j = -1.2 * rv / ws; a.v.x -= nx * j * a.im; a.v.y -= ny * j * a.im; a.v.z -= nz * j * a.im; b.v.x += nx * j * b.im; b.v.y += ny * j * b.im; b.v.z += nz * j * b.im; }
        const ca = a.awake ? a.im / ws : 0, cb = b.awake ? b.im / ws : 0, k = Math.max(0, pen - 0.015) * 0.5 / ((ca + cb) || 1);
        a.p.x -= nx * k * ca; a.p.y -= ny * k * ca; a.p.z -= nz * k * ca; b.p.x += nx * k * cb; b.p.y += ny * k * cb; b.p.z += nz * k * cb;
        // a sleeper is only woken by something that hits it, not by a neighbour settling against it
        const hit = -rv > 1.2;
        if (hit && pen > 0.03) { if (!a.awake && a.im > b.im * 0.3) { a.awake = true; a.rest = 0; } if (!b.awake && b.im > a.im * 0.3) { b.awake = true; b.rest = 0; } }
      }
    }
    info.awake = nAwake;
  };

  const dispose = () => {
    // the props' own clones share their geometry with every other clone: only what we built ourselves is freed
    for (const b of bodies.slice()) { group.remove(b.o); if (b.own) b.o.traverse((m) => { if (m.geometry) m.geometry.dispose(); }); }
    bodies.length = 0;
    heap.g.dispose();
    group.clear();
    bites.length = 0; setBites();
  };
  const info = { cands: cands.length, awake: 0, get live() { return bodies.length; }, get heap() { return heap.n; }, get lifted() { return cands.filter((c) => c.st !== 'baked').length; } };
  return { group, update, event, dispose, info, _bodies: bodies, _cands: cands, _ground: ground };
}

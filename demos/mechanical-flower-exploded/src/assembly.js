import * as THREE from 'three';
import { Rig } from './explode.js';
import { createMaterials, GEM_COLORS, rng } from './materials.js';
import { buildPetal } from './petals.js';
import { buildLeaf } from './leaves.js';
import { gearPart, buildFiligreeRing, buildCore, buildStamenCage, buildSpindle, washerPart } from './mech.js';
import { buildBraid, buildCollar, stemPoint, stemTangent } from './stem.js';
import { ScrewField } from './screws.js';
import { clamp01, lerp, smoother } from './geo.js';
import { POSTER } from './spec.js';
import { CAMERA, RINGS, OUTER_EXPLODED, INNER_EXPLODED, STACK, SIDE_GEARS, DRIVE_GEARS, COLLARS, STEM_LIFT, LEAVES, SCREWS_PX, ANCHOR_PX } from './layout.js';

const D2R = Math.PI / 180;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const Y_UP = V(0, 1, 0);
const eulQ = (q) => new THREE.Euler().setFromQuaternion(q, 'YXZ');
const tangentQ = (y) => new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(Y_UP, stemTangent(y)), 0.35);

export function poseCamera(cam, { target = CAMERA.target, dist = CAMERA.dist, elev = CAMERA.elevDeg, azim = 0 } = {}) {
  const e = elev * D2R;
  const a = azim * D2R;
  cam.position.set(target[0] + dist * Math.cos(e) * Math.sin(a), target[1] + dist * Math.sin(e), target[2] + dist * Math.cos(e) * Math.cos(a));
  cam.up.set(0, 1, 0);
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}

export function makeCamera() {
  const cam = new THREE.PerspectiveCamera(CAMERA.fov, POSTER.w / POSTER.h, 1, 400);
  poseCamera(cam);
  return cam;
}

// Assign each petal to a regular slot on its closed ring so closing keeps the exploded angular order.
function matchPhis(phisDeg) {
  const n = phisDeg.length;
  const order = phisDeg.map((p, i) => ({ p: ((p % 360) + 360) % 360, i })).sort((a, b) => a.p - b.p);
  const step = 360 / n;
  let best = { cost: Infinity, off: 0 };
  for (let off = 0; off < 360; off++) {
    let cost = 0;
    for (let k = 0; k < n; k++) {
      const d = ((order[k].p - (off + k * step) + 540) % 360) - 180;
      cost += d * d;
    }
    if (cost < best.cost) best = { cost, off };
  }
  const out = new Array(n);
  order.forEach((o, k) => (out[o.i] = best.off + k * step));
  return out;
}

// Exploded petals roll about their own length so the enamel face turns toward the viewer, as in the reference sheet.
const EXPLODED_SCALE = 0.82;
const EXPLODED_SCALE_CAP = 0.92;
const EXPLODED_WIDTH = 0.7;
const ASSEMBLED_WIDTH = 1.22;
const FACE_AMOUNT = 0.78;
const FACE_LIMIT = 80 * D2R;
function faceCameraRoll(phi, theta) {
  const cam = V(0, Math.sin(CAMERA.elevDeg * D2R), Math.cos(CAMERA.elevDeg * D2R));
  const qy = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), -phi);
  const qz = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), -theta);
  const base = qy.multiply(qz);
  let best = 0;
  let bd = -Infinity;
  for (let d = -80; d <= 80; d += 2) {
    const q = base.clone().multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), -Math.PI / 2 + d * D2R));
    const dot = V(0, 0, 1).applyQuaternion(q).dot(cam);
    if (dot > bd) {
      bd = dot;
      best = d * D2R;
    }
  }
  return Math.max(-FACE_LIMIT, Math.min(FACE_LIMIT, best)) * FACE_AMOUNT;
}

function withDoubleSide(root, fn) {
  const saved = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!saved.has(m)) saved.set(m, m.side);
      m.side = THREE.DoubleSide;
    }
  });
  try {
    return fn();
  } finally {
    saved.forEach((s, m) => {
      m.side = s;
    });
  }
}

function pixelRay(cam, px, py) {
  const rc = new THREE.Raycaster();
  rc.setFromCamera(new THREE.Vector2((px / POSTER.w) * 2 - 1, 1 - (py / POSTER.h) * 2), cam);
  return rc;
}

function screenBox(cam, obj) {
  const b = new THREE.Box3().setFromObject(obj);
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const p = new THREE.Vector3();
  for (let i = 0; i < 8; i++) {
    p.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(cam);
    const sx = ((p.x + 1) / 2) * POSTER.w;
    const sy = ((1 - p.y) / 2) * POSTER.h;
    x0 = Math.min(x0, sx);
    x1 = Math.max(x1, sx);
    y0 = Math.min(y0, sy);
    y1 = Math.max(y1, sy);
  }
  return { x0, y0, x1, y1, box: b };
}

export function buildAssembly(camera) {
  const mats = createMaterials();
  const root = new THREE.Group();
  const rig = new Rig();
  const rnd = rng(11);
  const gearSpins = [];
  const addSpin = (obj, teeth, dir, phase = 0) => gearSpins.push({ spin: obj.userData.spin, teeth, dir, phase });

  // ---- core + stamen cage (anchored, not exploded) ----
  const core = buildCore(mats, { R: 1.4 });
  core.position.set(0, -0.15, 0);
  root.add(core);
  const cage = buildStamenCage(mats, {});
  root.add(cage);

  // ---- petals ----
  const petals = [];
  const addPetalRing = (entries, ringKey, prefix, seedBase) => {
    const ring = RINGS[ringKey];
    const phiA = matchPhis(entries.map((e) => e.phi));
    entries.forEach((en, i) => {
      const cap = !!en.cap;
      const body = buildPetal(mats, {
        kind: en.kind,
        seed: seedBase + i,
        L: en.L,
        W: en.L * (cap ? 0.82 : 0.72),
        cup: cap ? 0.78 : 0.62,
        bend: cap ? -0.16 : -0.3,
        lip: 0.3,
        shoulder: 0.7,
        gemCount: cap ? 2 : 4,
      });
      const pivot = new THREE.Group();
      const hinge = new THREE.Group();
      pivot.add(hinge);
      hinge.add(body);
      body.rotation.y = -Math.PI / 2;
      root.add(pivot);
      const pa = phiA[i] * D2R;
      const px = en.phi * D2R;
      const rollExp = en.roll + faceCameraRoll(px, en.th * D2R);
      const part = rig.add(pivot, `${prefix}${i}`, {
        a: { p: V(ring.r * Math.cos(pa), ring.y, ring.r * Math.sin(pa)), r: [0, -pa, 0], s: 1 },
        x: { p: V(en.r * Math.cos(px), en.y, en.r * Math.sin(px) + en.zOff), r: [0, -px, 0], s: cap ? EXPLODED_SCALE_CAP : EXPLODED_SCALE },
        delay: 0.02 + rnd() * 0.3,
      });
      petals.push({ part, hinge, body, ring, en, rollExp, st: (rnd() - 0.5) * 0.08, group: ringKey === 'I' ? 'inner' : 'outer' });
    });
  };
  addPetalRing(OUTER_EXPLODED.filter((e) => !e.cap), 'A', 'op', 100);
  addPetalRing(OUTER_EXPLODED.filter((e) => e.cap), 'B', 'oc', 200);
  addPetalRing(INNER_EXPLODED, 'I', 'ip', 300);
  const petalTheta = (p, b, k) => {
    const [w0, w1] = p.ring.win;
    const wb = smoother(clamp01((b - (w0 + p.st)) / Math.max(0.2, w1 - w0 - 0.1)));
    return lerp(lerp(p.ring.closed, p.ring.open, wb), lerp(p.en.closedTh, p.en.th, wb), k);
  };

  // ---- spindle, gear stack, washers ----
  const spindle = buildSpindle(mats, { radius: 0.075 });
  root.add(spindle);
  rig.add(spindle, 'spindle', {
    a: { p: V(0, -2.6, 0), r: [0, 0, 0], s: V(1, 4.2, 1) },
    x: { p: V(0, -1.2, 0), r: [0, 0, 0], s: V(1, 15.0, 1) },
  });
  const stackObjs = [];
  const gemKeys = ['sapphire', 'rose', 'aqua', 'emerald'];
  STACK.forEach((it, i) => {
    const upper = it.y > 0;
    const yA = upper ? -2.35 + (it.y - 1.55) * 0.04 : -3.0 + (it.y + 2.6) * 0.28;
    const sA = upper ? 0.4 : 0.62;
    let obj;
    if (it.type === 'gear') {
      obj = gearPart(mats, { teeth: it.teeth, R: it.R, thickness: it.th, spokes: it.spokes, curved: it.spokes ? 0.3 : 0, gemColor: GEM_COLORS[it.gem], seed: i + 1, axis: 'y' });
      addSpin(obj, it.teeth, i % 2 ? 1 : -1, i);
    } else {
      obj = washerPart(mats, { R: it.R, h: 0.16, gemColor: GEM_COLORS[gemKeys[i % 4]] });
    }
    root.add(obj);
    rig.add(obj, `stack${i}`, {
      a: { p: V(0, yA, 0), r: [0, 0, 0], s: sA },
      x: { p: V(0, it.y, 0), r: [0, 0, 0], s: 1 },
      delay: 0.04 + rnd() * 0.25,
    });
    stackObjs.push(obj);
  });
  const sideObjs = SIDE_GEARS.map((g, i) => {
    const obj = gearPart(mats, { teeth: g.teeth, R: g.R, thickness: 0.12, spokes: 0, gemColor: GEM_COLORS[g.gem], seed: 40 + i, axis: 'y' });
    root.add(obj);
    addSpin(obj, g.teeth, i ? 1 : -1);
    rig.add(obj, `side${i}`, {
      a: { p: V(g.x * 1.1, -0.3, 1.5), r: [0, 0, 0], s: 0.5 },
      x: { p: V(g.x, g.y, 0), r: [0, 0, 0], s: 1 },
      delay: 0.1 + rnd() * 0.2,
    });
    return obj;
  });

  // ---- camera-facing drive gears ----
  const driveObjs = DRIVE_GEARS.map((g, i) => {
    const obj = gearPart(mats, { teeth: g.teeth, R: g.R, thickness: 0.2, spokes: g.spokes, curved: 0.35, gemColor: GEM_COLORS[g.gem], seed: 60 + i, axis: 'z' });
    root.add(obj);
    addSpin(obj, g.teeth, g.dir);
    rig.add(obj, g.id, {
      a: { p: V(g.asm[0], g.asm[1] + 1.4, g.asm[2]), r: [0, 0, 0], s: 0.8 },
      x: { p: V(...g.exp), r: [0, 0, 0], s: 1 },
      delay: 0.05 + rnd() * 0.25,
      bow: 0.8,
    });
    return obj;
  });

  // ---- filigree drive ring ----
  const ringWrap = new THREE.Group();
  const ring = buildFiligreeRing(mats, { R: 4.95, teeth: 66 });
  ringWrap.add(ring);
  root.add(ringWrap);
  rig.add(ringWrap, 'ring', {
    a: { p: V(0, -3.0, 0), r: [0, 0, 0], s: 0.58 },
    x: { p: V(0, -4.3, 0), r: [0, 0, 0], s: 1 },
    delay: 0.1,
  });

  // ---- braided stem + collars ----
  const braid = buildBraid(mats, {});
  root.add(braid);
  rig.add(braid, 'braid', {
    a: { p: V(0, STEM_LIFT, 0), r: [0, 0, 0], s: V(0.72, 1, 0.72) },
    x: { p: V(0, 0, 0), r: [0, 0, 0], s: 1 },
    delay: 0.0,
  });
  const collarObjs = COLLARS.map((c, i) => {
    const obj = buildCollar(mats, { R: c.R, h: c.h, jewels: c.jewels, pins: c.pins, seed: i + 1, serrated: c.serrated });
    braid.add(obj);
    const yA = -8.95 + (c.y + 8.95) * 0.9;
    rig.add(obj, `collar${i}`, {
      a: { p: stemPoint(yA), r: eulQ(tangentQ(yA)), s: V(0.9, 1, 0.9) },
      x: { p: stemPoint(c.y), r: eulQ(tangentQ(c.y)), s: 1 },
      delay: 0.0,
    });
    return obj;
  });

  // ---- leaves ----
  const leafObjs = LEAVES.map((lf) => {
    const qx = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), lf.tiltX);
    const qExp = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), lf.rotZ).multiply(qx);
    const hub = V(...lf.hub);
    const attach = V(...lf.clamp).sub(hub).applyQuaternion(qExp.clone().invert());
    const obj = buildLeaf(mats, { L: lf.L, W: lf.W, kind: lf.kind, seed: lf.seed, attach, bend: lf.bend, sweep: lf.sweep });
    root.add(obj);
    const qAsm = new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), lf.asmRotZ).multiply(qx);
    const c = stemPoint(lf.asmClampY - STEM_LIFT);
    c.y += STEM_LIFT;
    c.x += lf.asmOut * 0.35;
    const leafAsmScale = 0.8;
    const hubA = c.clone().sub(attach.clone().applyQuaternion(qAsm).multiplyScalar(leafAsmScale));
    rig.add(obj, lf.id, {
      a: { p: hubA, r: eulQ(qAsm), s: leafAsmScale },
      x: { p: hub, r: eulQ(qExp), s: 1 },
      delay: 0.15,
    });
    addSpin(obj.userData.gear, 14, 1);
    return obj;
  });

  // ---- per-frame update ----
  const state = { e: 1, b: 1, t: 0 };
  const parentPos = (spec) => spec.owner.localToWorld(spec._p.copy(spec.local));
  let screws = null;
  const update = (e, b, t) => {
    state.e = e;
    state.b = b;
    state.t = t;
    rig.update(e);
    for (const p of petals) {
      p.hinge.rotation.z = -petalTheta(p, b, p.part.k) * D2R;
      p.body.rotation.y = -Math.PI / 2 + p.rollExp * p.part.k;
      if (!p.en.cap) p.body.scale.x = lerp(ASSEMBLED_WIDTH, EXPLODED_WIDTH, p.part.k);
    }
    const lift = 0.85 * (1 - e) * smoother(clamp01(b));
    cage.position.y = -1.1 - 0.9 * (1 - smoother(clamp01(b))) + lift;
    core.position.y = -0.15 + lift;
    const cs = (0.5 + 0.5 * smoother(clamp01(b))) * lerp(0.8, 1, e);
    cage.scale.set(cs, lerp(1.0, 1, e), cs);
    core.rotation.y = t * 0.12;
    mats.core.uniforms.uTime.value = t;
    mats.core.uniforms.uPulse.value = 0.8 + 0.5 * b + 0.15 * Math.sin(t * 2);
    ring.rotation.y = (b * 1.2 + t * 0.06) * (e < 0.5 ? 1 : 1);
    for (const g of gearSpins) g.spin.rotation.z = g.dir * ((b * 5 + t * 0.3) * (16 / g.teeth) + g.phase);
    root.updateMatrixWorld(true);
    if (screws) screws.update(e, t, parentPos);
  };

  // ---- anchors, screws, insets (computed at the poster pose: exploded, full bloom) ----
  update(1, 1, 0);
  const ownerObjs = [
    ...petals.map((p) => p.body),
    ...stackObjs,
    ...sideObjs,
    ...driveObjs,
    ring,
    ...collarObjs,
    ...leafObjs,
    cage,
    core,
    braid,
  ];
  const anchorOn = (owners, px, py) => {
    const rc = pixelRay(camera, px, py);
    let best = null;
    withDoubleSide(root, () => {
      for (const o of owners) {
        const h = rc.intersectObject(o, true)[0];
        if (h && (!best || h.distance < best.hit.distance)) best = { owner: o, hit: h };
      }
    });
    if (best) return { owner: best.owner, point: best.hit.point.clone() };
    let nearest = null;
    for (const o of owners) {
      const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
      const d = rc.ray.distanceToPoint(c);
      if (!nearest || d < nearest.d) nearest = { o, d, c };
    }
    return { owner: nearest.o, point: rc.ray.closestPointToPoint(nearest.c, new THREE.Vector3()) };
  };
  const owners = {
    outerPetals: petals.filter((p) => p.group === 'outer').map((p) => p.body),
    innerPetals: petals.filter((p) => p.group === 'inner').map((p) => p.body),
    stamenCage: [cage],
    filigreeRing: [ring],
    leafPanel: leafObjs,
    driveGears: driveObjs,
    braidedStem: [braid],
    retentionCollar: collarObjs,
    stemSegment: [...collarObjs, braid],
  };
  const anchors = {};
  for (const [id, [px, py]] of Object.entries(ANCHOR_PX)) {
    if (id === 'core') {
      anchors[id] = { owner: core.userData.sphere, local: V(0.85, -0.75, 0.55) };
      continue;
    }
    const hit = anchorOn(owners[id], px, py);
    anchors[id] = { owner: hit.owner, local: hit.owner.worldToLocal(hit.point) };
  }

  const boxes = ownerObjs.map((o) => ({ o, ...screenBox(camera, o) }));
  const specs = SCREWS_PX.map(([px, py, capName], i) => {
    const r = rnd;
    const rc = pixelRay(camera, px, py);
    const zS = 0.3 + r() * 1.3;
    const d = rc.ray.direction;
    const S = rc.ray.origin.clone().addScaledVector(d, (zS - rc.ray.origin.z) / d.z);
    const axis = V((r() - 0.5) * 0.4, 1, (r() - 0.35) * 0.4).normalize();
    const pull = 0.8 + r() * 0.6;
    let owner = null;
    let bestScore = Infinity;
    for (const bx of boxes) {
      const dx = Math.max(bx.x0 - px, 0, px - bx.x1);
      const dy = Math.max(bx.y0 - py, 0, py - bx.y1);
      const score = Math.hypot(dx, dy) + 0.05 * Math.sqrt((bx.x1 - bx.x0) * (bx.y1 - bx.y0));
      if (score < bestScore) {
        bestScore = score;
        owner = bx.o;
      }
    }
    return {
      owner,
      local: owner.worldToLocal(S.clone().addScaledVector(axis, -pull)),
      _p: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      axis,
      pull,
      delay: 0.3 + r() * 0.7,
      size: 0.7,
      cap: capName ? GEM_COLORS[capName] : null,
      index: i,
    };
  });
  screws = new ScrewField(mats, specs);
  root.add(screws.group);
  update(1, 1, 0);

  // ---- inset camera poses ----
  const outer0 = petals.find((p) => p.part.id === 'op0');
  const dgR1 = driveObjs[DRIVE_GEARS.findIndex((g) => g.id === 'dgR1')];
  const insetPose = (name) => {
    if (name === 'core') {
      const t = core.getWorldPosition(new THREE.Vector3());
      return { pos: t.clone().add(V(0, 0.15, 5.0)), target: t, fov: 38, up: Y_UP };
    }
    if (name === 'gear') {
      const t = dgR1.getWorldPosition(new THREE.Vector3());
      return { pos: t.clone().add(V(0, 0, 3.2)), target: t, fov: 40, up: Y_UP };
    }
    const blade = outer0.body.userData.blade;
    const p = outer0.body.localToWorld(blade.P(0.55, 0.55));
    const n = blade.frame(0.55, 0.55).n.transformDirection(outer0.body.matrixWorld);
    return { pos: p.clone().addScaledVector(n, 3.0), target: p, fov: 35, up: Y_UP };
  };

  const topLevel = (o) => {
    while (o.parent && o.parent !== root) o = o.parent;
    return o;
  };
  const insetKeep = (name) => {
    if (name === 'core') return [core];
    if (name === 'gear') return [dgR1];
    return [topLevel(outer0.body)];
  };

  const projectAnchors = (cam) => {
    cam.updateMatrixWorld();
    const out = {};
    const p = new THREE.Vector3();
    for (const [id, a] of Object.entries(anchors)) {
      a.owner.localToWorld(p.copy(a.local)).project(cam);
      const x = (p.x + 1) / 2;
      const y = (1 - p.y) / 2;
      out[id] = { x, y, visible: p.z < 1 && x >= 0 && x <= 1 && y >= 0 && y <= 1 };
    }
    return out;
  };

  return { root, rig, mats, core, cage, petals, screws, anchors, update, state, insetPose, insetKeep, projectAnchors };
}

// Under-car drips (car B, CAR agent). Fixed sources on the underbody (timings.js UNDER_DRIPS, car frame); each one
// swells, detaches, falls (a stretched streak) and splashes (a fading ring on the asphalt / a ripple in the puddle).
// The CUES.dripOnFace drip leaves the underbody straight above the face target and lands on it at exactly that cue.
// All pure functions of t.
//   buildDrips(ctx, { frame, underY, puddle, quality, faceDefault }) ->
//     { group, api, face: { from, to, time }, landings(t, i), setTarget(worldPos), update(t, camera) }
import * as THREE from 'three';
import { CUES } from '../film/cues.js';
import { UNDER_DRIPS, dripFallTime, dripDetachTimes } from './timings.js';

const G = 9.81;

export function buildDrips(ctx, { frame, underY = () => 0.27, faceDefault } = {}) {
  const group = new THREE.Group();
  group.name = 'CarB_drips';
  frame.updateMatrixWorld(true);
  const toWorld = (x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(frame.matrixWorld);
  const inv = new THREE.Matrix4().copy(frame.matrixWorld).invert();
  // sources in the car frame (y snapped to the modelled underbody)
  const src = UNDER_DRIPS.map((s) => { const h = underY(s.x, s.z); return { ...s, y: h === null ? s.y : h }; });
  const ground = src.map((s) => { const w = toWorld(s.x, 0, s.z); return ctx.groundY(w.x, w.z) - frame.matrixWorld.elements[13] + 0; });
  void ground;
  // the face drip
  const face = { time: CUES.dripOnFace, from: new THREE.Vector3(), to: new THREE.Vector3(), local: new THREE.Vector3(), h: 0.1 };
  function setTarget(p) {
    face.to.copy(p);
    const l = p.clone().applyMatrix4(inv);
    const h = underY(l.x, l.z);
    const top = h === null ? l.y + 0.12 : h;
    face.local.set(l.x, top, l.z);
    face.from.copy(toWorld(l.x, top, l.z));
    face.h = Math.max(0.02, face.from.y - p.y);
  }
  setTarget(faceDefault || toWorld(0, 0.12, 0.85));

  // drops: hanging (growing) + falling streaks, instanced; splash rings, instanced
  const N = src.length + 1;
  const dropGeo = new THREE.SphereGeometry(1, 10, 8);
  const dropMat = new THREE.MeshStandardMaterial({ name: 'CarBDrop', color: 0x6f7f88, roughness: 0.05, metalness: 0.0, emissive: 0x1c2630, emissiveIntensity: 1.1, envMap: ctx.envMap, envMapIntensity: 1.6, transparent: true, opacity: 0.7 });
  const drops = new THREE.InstancedMesh(dropGeo, dropMat, N * 2);
  drops.name = 'carB_drops';
  drops.frustumCulled = false;
  group.add(drops);
  const ringGeo = new THREE.RingGeometry(0.6, 1.0, 24).rotateX(-Math.PI / 2);
  // lit, dark, glossy (an unlit ring glowed like glitter in the lead's U3/U4 frames)
  const ringMat = new THREE.MeshStandardMaterial({ name: 'CarBSplash', color: 0x1a1f22, roughness: 0.08, metalness: 0.0, envMap: ctx.envMap, envMapIntensity: 0.8, transparent: true, opacity: 0.22, depthWrite: false });
  const rings = new THREE.InstancedMesh(ringGeo, ringMat, N * 2);
  rings.name = 'carB_splashes';
  rings.frustumCulled = false;
  group.add(rings);

  // the story drip gets its own brighter drop: it must read against the bright slit at 0.7 m
  const storyDrop = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), new THREE.MeshStandardMaterial({ name: 'CarBStoryDrop', color: 0xb8c8d0, roughness: 0.03, metalness: 0.0, emissive: 0x7e8c94, emissiveIntensity: 0.55, envMap: ctx.envMap, envMapIntensity: 3.0, transparent: true, opacity: 0.9 }));
  storyDrop.name = 'carB_storyDrop';
  storyDrop.visible = false;
  group.add(storyDrop);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pp = new THREE.Vector3();
  const lastLand = []; // [{ x, z, t, s }] world, most recent first (filled per update)
  // all (detach, land) pairs of source i around t
  const pairs = (i, t) => {
    const s = src[i];
    const tf = dripFallTime(s.y - 0.0);
    return dripDetachTimes(i, t - 2.0 - tf, t + 4.0).map((td) => ({ td, tl: td + tf, tf }));
  };
  function landingsAt(t) {
    lastLand.length = 0;
    for (let i = 0; i < src.length; i++) for (const e of pairs(i, t)) {
      if (e.tl <= t && t - e.tl < 2.4) { const w = toWorld(src[i].x, 0, src[i].z); lastLand.push({ x: w.x, z: w.z, t: e.tl, s: 0.8 }); }
    }
    const fl = face.time;
    if (fl <= t && t - fl < 2.4) lastLand.push({ x: face.to.x, z: face.to.z, t: fl, s: 1.2 });
    lastLand.sort((a, b) => b.t - a.t);
  }

  function update(t) {
    let di = 0, ri = 0;
    const put = (mesh, idx, p, sx, sy, sz) => { sc.set(sx, sy, sz); q.identity(); m4.compose(p, q, sc); mesh.setMatrixAt(idx, m4); };
    const hang = (x, y, z, k, big = 1) => { // a swelling drop under the source
      const r = (0.0012 + 0.0024 * k) * big;
      pp.set(x, y - r * 0.9, z);
      put(drops, di++, pp, r, r * (1 + 0.5 * k), r);
    };
    const fall = (x, y0, z, age, yGround, big = 1) => {
      const yy = y0 - 0.5 * G * age * age;
      if (yy <= yGround) return false;
      const v = G * age;
      const len = Math.min(0.06, 0.004 + v * 0.016);  // motion streak (1/60 s)
      pp.set(x, yy + len * 0.5, z);
      put(drops, di++, pp, 0.0016 * big, len * 0.5 + 0.002 * big, 0.0016 * big);
      return true;
    };
    const splash = (x, y, z, age) => {
      if (age < 0 || age > 0.45) return;
      const r = 0.006 + 0.09 * Math.sqrt(age / 0.45);
      pp.set(x, y + 0.004, z);
      put(rings, ri++, pp, r, 1, r);
    };
    for (let i = 0; i < src.length; i++) {
      const s = src[i];
      const yG = 0.004; // local ground (car frame y = 0 is the road under the car)
      let hung = false;
      for (const e of pairs(i, t)) {
        if (t < e.td && t > e.td - 1.4 && !hung) { hang(s.x, s.y, s.z, 1 - (e.td - t) / 1.4); hung = true; }
        else if (t >= e.td && t < e.tl + 0.02) fall(s.x, s.y, s.z, t - e.td, yG);
        else if (t >= e.tl) splash(s.x, yG, s.z, t - e.tl);
      }
    }
    // the face drip (car frame)
    {
      const fl = face.time, tf = Math.sqrt(2 * face.h / G), td = fl - tf;
      const L = face.local;
      const yT = L.y - face.h;
      // the story drip: a fatter, brighter drop (it has to read at 0.7 m through the lens' shallow focus)
      storyDrop.visible = false;
      if (t < td && t > td - 1.8) {
        const k = 1 - (td - t) / 1.8, r = 0.002 + 0.0032 * k;
        storyDrop.position.set(L.x, L.y - r * 0.9, L.z); storyDrop.scale.set(r, r * (1 + 0.5 * k), r); storyDrop.visible = true;
      } else if (t >= td && t < fl) {
        const age = t - td, yy = L.y - 0.5 * G * age * age, len = Math.min(0.05, 0.006 + G * age * 0.016);
        storyDrop.position.set(L.x, yy + len * 0.5, L.z); storyDrop.scale.set(0.0028, len * 0.5 + 0.003, 0.0028); storyDrop.visible = true;
      } else if (t >= fl) splash(L.x, yT, L.z, (t - fl) * 1.6);
    }
    drops.count = di; rings.count = ri;
    drops.instanceMatrix.needsUpdate = true; rings.instanceMatrix.needsUpdate = true;
    landingsAt(t);
  }

  const api = {
    sources: src.map((s, i) => ({ point: toWorld(s.x, s.y, s.z), period: s.period, phase: s.phase, index: i })),
    dripTimes(from, to) {
      const out = [];
      for (let i = 0; i < src.length; i++) { const tf = dripFallTime(src[i].y); for (const td of dripDetachTimes(i, from - tf, to - tf)) out.push({ t: td + tf, source: i, land: toWorld(src[i].x, 0, src[i].z) }); }
      out.push({ t: face.time, source: -1, land: face.to.clone() });
      return out.sort((a, b) => a.t - b.t);
    },
    onFace: face,
  };
  return {
    group, api, face,
    landings: (t, i) => lastLand[i] || null,
    setTarget,
    update,
  };
}

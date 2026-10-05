import * as THREE from 'three';
import { clamp, lerp, smooth } from '../core/ease.js';

// Camera path tools: time-keyed Hermite splines (C1-continuous through keys),
// pose blending, and handheld-free "breathing" drift.

export function pose(pos, target, { fov = 35, focus = null, aperture = 0, roll = 0 } = {}) {
  return { pos: pos.clone(), target: target.clone(), fov, focus: focus ?? pos.distanceTo(target), aperture, roll };
}

export function blendPose(a, b, k) {
  return {
    pos: a.pos.clone().lerp(b.pos, k),
    target: a.target.clone().lerp(b.target, k),
    fov: lerp(a.fov, b.fov, k),
    focus: lerp(a.focus, b.focus, k),
    aperture: lerp(a.aperture, b.aperture, k),
    roll: lerp(a.roll || 0, b.roll || 0, k),
  };
}

// Hermite interpolation through time-stamped keys. Works on numbers or
// Vector3. Tangents follow Catmull-Rom, scaled for uneven key spacing; the
// first and last keys have zero velocity so moves ease in and out.
function hermite(keys, t, get) {
  const n = keys.length;
  if (t <= keys[0].t) return get(keys[0]);
  if (t >= keys[n - 1].t) return get(keys[n - 1]);
  let i = 0;
  while (i < n - 2 && t > keys[i + 1].t) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  const dt = k1.t - k0.t;
  const u = (t - k0.t) / dt;
  const isVec = get(k0).isVector3;
  const tangent = (j) => {
    if (j === 0 || j === n - 1) return isVec ? new THREE.Vector3() : 0;
    const a = keys[j - 1], b = keys[j + 1];
    if (isVec) return get(b).clone().sub(get(a)).multiplyScalar(1 / (b.t - a.t));
    return (get(b) - get(a)) / (b.t - a.t);
  };
  const m0 = tangent(i), m1 = tangent(i + 1);
  const u2 = u * u, u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
  if (isVec) {
    return get(k0).clone().multiplyScalar(h00)
      .addScaledVector(m0, h10 * dt)
      .addScaledVector(get(k1), h01)
      .addScaledVector(m1, h11 * dt);
  }
  return get(k0) * h00 + m0 * h10 * dt + get(k1) * h01 + m1 * h11 * dt;
}

// keys: [{ t, pos, target, fov?, focus?, aperture? }]
export function track(keys, t) {
  const pos = hermite(keys, t, (k) => k.pos);
  const target = hermite(keys, t, (k) => k.target);
  const num = (name, def) => hermite(keys, t, (k) => (k[name] ?? def));
  const fov = num('fov', 35);
  const aperture = num('aperture', 0);
  const focus = keys.some((k) => k.focus !== undefined)
    ? hermite(keys, t, (k) => k.focus ?? k.pos.distanceTo(k.target))
    : pos.distanceTo(target);
  return { pos, target, fov, focus, aperture, roll: num('roll', 0) };
}

// Gentle organic drift so locked-off shots still breathe.
export function drift(p, t, amount = 0.02, seed = 0) {
  const s = (f, o) => Math.sin(t * f + seed * 7.1 + o) * 0.6 + Math.sin(t * f * 2.31 + seed * 3.7 + o * 1.7) * 0.4;
  p.pos.x += s(0.37, 0) * amount;
  p.pos.y += s(0.29, 1.3) * amount * 0.7;
  p.pos.z += s(0.33, 2.1) * amount;
  return p;
}

// Apply a pose to a PerspectiveCamera, keeping the horizontal framing stable
// across aspect ratios (portrait screens get a taller view, not a narrower one).
export function applyPose(camera, p, aspect, near = 0.05, far = 9000) {
  camera.position.copy(p.pos);
  camera.up.set(0, 1, 0);
  camera.lookAt(p.target);
  if (p.roll) camera.rotateZ(p.roll);
  const designAspect = 16 / 9;
  let fov = p.fov;
  if (aspect < designAspect) {
    // keep horizontal coverage, but cap the growth so subjects stay large
    const hfov = 2 * Math.atan(Math.tan((fov * Math.PI) / 360) * designAspect);
    const vfovKeep = (2 * Math.atan(Math.tan(hfov / 2) / aspect) * 180) / Math.PI;
    fov = Math.min(vfovKeep, fov * (aspect < 1 ? 1.9 : 1.45));
  }
  camera.fov = fov;
  camera.aspect = aspect;
  camera.near = near;
  camera.far = far;
  camera.updateProjectionMatrix();
  // refresh world/view matrices now: screen-space effects project with them
  // before the renderer would otherwise update them
  camera.updateMatrixWorld(true);
}

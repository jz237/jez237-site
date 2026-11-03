// Trajectory forecasting: runs the simulation's own ball physics forward on a probe.
import { F } from './config.js?v=6';
import { stepBallFree } from './sim.js?v=6';

const PDT = 1 / 90;

// Follow a ball until it crosses the plane z = zPlane (moving toward it). Returns
// { t (seconds from now), x, z, vx, vz, spin, banks, path: [x, z, ...] } or null.
export function predictToPlane(W, b0, zPlane, maxT = 3, wantPath = false, t0 = W.t) {
  const b = { x: b0.x, z: b0.z, vx: b0.vx, vz: b0.vz, spin: b0.spin || 0, r: b0.r || F.ballR, portalT: b0.portalT };
  const dir = Math.sign(zPlane - b.z) || 1;
  const path = wantPath ? [b.x, b.z] : null;
  let banks = 0, t = 0, n = 0;
  const hit = (kind) => { if (kind === 'wall' || kind === 'bump' || kind === 'slider') banks++; };
  while (t < maxT) {
    const pz = b.z;
    stepBallFree(W, b, PDT, t0 + t + PDT, hit);
    t += PDT;
    if ((b.z - zPlane) * dir >= 0 && (pz - zPlane) * dir < 0) {
      // interpolate the crossing
      const f = (zPlane - pz) / (b.z - pz || 1e-6);
      const x = b.x - b.vx * PDT * (1 - f);
      if (path) path.push(x, zPlane);
      return { t: t - PDT * (1 - f), x, z: zPlane, vx: b.vx, vz: b.vz, spin: b.spin, banks, path };
    }
    // wandered back across the midline the wrong way: no crossing coming
    if (b.vz * dir < 0 && (b.z - zPlane) * dir < -F.goalZ * 2) return null;
    if (path && (++n & 3) === 0) path.push(b.x, b.z);
  }
  return null;
}

// Continue a probe from a launch state to a second plane (used for "where does my shot land").
export function shotPath(W, x, z, vx, vz, spin, planes, maxT = 2.6, t0 = W.t) {
  const b = { x, z, vx, vz, spin, r: F.ballR };
  const out = [];
  const path = [x, z];
  let t = 0, n = 0, banks = 0, k = 0;
  const hit = (kind) => { if (kind === 'wall' || kind === 'bump' || kind === 'slider') banks++; };
  const dir = Math.sign(vz) || 1;
  while (t < maxT && k < planes.length) {
    const pz = b.z;
    stepBallFree(W, b, PDT, t0 + t + PDT, hit);
    t += PDT;
    if ((++n & 2) === 0) path.push(b.x, b.z);
    while (k < planes.length && (b.z - planes[k]) * dir >= 0 && (pz - planes[k]) * dir < 0) {
      out.push({ t, x: b.x, banks, vx: b.vx, vz: b.vz });
      k++;
    }
    if (b.vz * dir < 0) break; // bounced back (bumper / slider)
  }
  return { hits: out, path, banks };
}

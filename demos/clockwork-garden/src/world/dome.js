import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { pivotParts } from './wind.js';
import { geometryPart, partsCross } from '../geometry/intersect.js';

// A mound of leaves (the film's foliage masses and shrubs): leaves laid round
// a dome, denser at the top, as before, but relaxed so that no leaf passes
// through another: each leaf is tested (exact triangle crossing) against the
// ones already laid and, if it would cut one, is tilted further out, turned a
// little or made smaller. Computed once for the shared template.
export function leafDome(leaf, N, { size = (i) => 1, radius = 6 } = {}) {
  const base = geometryPart(leaf);
  const parts = [], pivots = [], phases = [], placed = [];
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  const tries = [[0, 0, 1], [0.15, 0, 1], [0, 0.18, 1], [0, -0.18, 1], [0.3, 0, 0.92], [0.15, 0.3, 0.88], [0.45, 0, 0.8], [0.3, -0.3, 0.78], [0.6, 0, 0.7]];
  let relaxed = 0;
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) / N;
    const el = Math.acos(1 - u) * 0.95;
    const az = i * 2.39996;
    const r = radius * Math.sin(el + 0.25);
    const pv = new THREE.Vector3(Math.sin(az) * r * 0.5, radius * Math.cos(el) * 0.75 + 1, Math.cos(az) * r * 0.5);
    let done = null;
    for (let k = 0; k < tries.length && !done; k++) {
      const [tilt, turn, sh] = tries[k];
      // as before: tilt about x, then turn to its azimuth, then out to its place
      e.set(-0.4 + el * 0.6 + tilt, az + turn, 0, 'YXZ');
      q.setFromEuler(e);
      m.compose(pv, q, new THREE.Vector3().setScalar(size(i) * sh));
      const P = new Float32Array(base.P.length), el2 = m.elements;
      for (let j = 0; j < P.length; j += 3) {
        const x = base.P[j], y = base.P[j + 1], z = base.P[j + 2];
        P[j] = el2[0] * x + el2[4] * y + el2[8] * z + el2[12]; P[j + 1] = el2[1] * x + el2[5] * y + el2[9] * z + el2[13]; P[j + 2] = el2[2] * x + el2[6] * y + el2[10] * z + el2[14];
      }
      const box = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9];
      for (let j = 0; j < P.length; j += 3) for (let c = 0; c < 3; c++) { box[c] = Math.min(box[c], P[j + c]); box[c + 3] = Math.max(box[c + 3], P[j + c]); }
      const part = { P, T: base.T, S: base.S, box, pv };
      if (placed.some((o) => partsCross(part, o, o.pv.distanceTo(pv) < 1.2 ? 0.2 : 0))) continue;
      done = { part, matrix: m.clone() };
      if (k) relaxed++;
    }
    if (!done) continue; // no room: this leaf is left out
    placed.push(done.part);
    const g = leaf.clone();
    g.applyMatrix4(done.matrix);
    parts.push(g);
    pivots.push(pv);
    phases.push((i * 0.618) % 1);
  }
  const geo = pivotParts(mergeGeometries(parts), parts, pivots, phases);
  geo.userData.relaxed = relaxed;
  geo.userData.dropped = N - parts.length;
  return geo;
}

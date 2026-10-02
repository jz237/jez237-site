// optics-frame.js - shared eye frame, contour frames and profile sweeps for the optics assembly.
// Local eye frame ("EYE"): origin = centroid of the orbital contour, +Y = eye axis (outward normal of the best-fit
// rim plane), X = in-plane "forward" axis, Z = in-plane axis (so revolve()/cyl() axes line up with the eye axis).
import { THREE, K, V3, eyeContour } from '../kit.js';

export const TAU = Math.PI * 2;
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth01 = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

/** Outward gradient normal of an axis-aligned ellipsoid (centre c, radii r) at p. */
export function ellN(p, c, r, out = V3()) {
  return out.set((p.x - c.x) / (r.x * r.x), (p.y - c.y) / (r.y * r.y), (p.z - c.z) / (r.z * r.z)).normalize();
}

let _eye = null;
/** Eye frame, contour table and phi_c(theta) lookup (right eye, bee space). */
export function eyeFrame() {
  if (_eye) return _eye;
  const E = K.head.eyeR, H = K.head;
  const n = 192;
  const pts = eyeContour(n);
  let nx = 0, ny = 0, nz = 0;
  const c0 = V3();
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    nx += (a.y - b.y) * (a.z + b.z); ny += (a.z - b.z) * (a.x + b.x); nz += (a.x - b.x) * (a.y + b.y);
    c0.add(a);
  }
  c0.multiplyScalar(1 / n);
  const w = V3(nx, ny, nz).normalize();
  if (w.z < 0) w.negate();
  const u = V3(1, 0, 0).addScaledVector(w, -w.x).normalize();
  const v = new THREE.Vector3().crossVectors(w, u);
  const M = new THREE.Matrix4().makeBasis(u, w, v.clone().negate()).setPosition(c0);
  const Minv = M.clone().invert();
  // phi(theta) of the contour on the eye ellipsoid parametrisation  P = c + r * (sin phi cos th, sin phi sin th, cos phi)
  const phiTab = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) phiTab[i] = Math.acos(clamp((pts[i].z - E.c.z) / E.r.z, -1, 1));
  phiTab[n] = phiTab[0];
  const phiC = (th) => {
    let t = th % TAU; if (t < 0) t += TAU;
    const f = (t / TAU) * n, i = Math.floor(f), k = f - i;
    return lerp(phiTab[i], phiTab[Math.min(i + 1, n)], k);
  };
  const toBee = (x, y, z) => V3(x, y, z).applyMatrix4(M);
  const toLocal = (p) => p.clone().applyMatrix4(Minv);
  /** local->bee matrix of a point on the axis at height y with an optional spin about the axis. */
  const at = (y = 0, spin = 0, x = 0, z = 0) => new THREE.Matrix4().multiplyMatrices(M, new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(spin)));
  _eye = { E, H, n, pts, c0, u, v, w, M, Minv, phiC, toBee, toLocal, at, headC: H.c, headR: H.r };
  return _eye;
}

/**
 * Frames along the orbital contour: P (point), T (tangent, CCW seen from outside), n (head-surface normal, made
 * perpendicular to T), O (in-surface direction pointing away from the eye), s (arc length), lean (cot of the angle
 * between the dome wall and the head surface: inner wall offset per mm of height), Ne (eye-ball normal).
 * count+1 frames are returned (the last one duplicates the first so UVs do not wrap).
 */
export function contourFrames(count = 160) {
  const F = eyeFrame();
  const pts = eyeContour(count);
  const fr = [];
  let s = 0;
  for (let i = 0; i < count; i++) {
    const P = pts[i];
    const T = pts[(i + 1) % count].clone().sub(pts[(i - 1 + count) % count]).normalize();
    const Nh = ellN(P, F.H.c, F.H.r);
    const n = Nh.clone().addScaledVector(T, -Nh.dot(T)).normalize();
    let O = new THREE.Vector3().crossVectors(T, n).normalize();
    if (O.dot(P.clone().sub(F.c0)) < 0) O = O.negate();
    const Ne = ellN(P, F.E.c, F.E.r);
    const a = Ne.dot(n), b = Ne.dot(O);
    if (i > 0) s += P.distanceTo(pts[i - 1]);
    fr.push({ P: P.clone(), T, n, O, Ne, s, lean: clamp(b > 1e-3 ? a / b : 0, -0.6, 0.9) });
  }
  // light smoothing of lean around the loop
  for (let pass = 0; pass < 3; pass++) {
    const l = fr.map((f) => f.lean);
    for (let i = 0; i < count; i++) fr[i].lean = (l[(i - 1 + count) % count] + 2 * l[i] + l[(i + 1) % count]) / 4;
  }
  const total = s + pts[count - 1].distanceTo(pts[0]);
  const last = { ...fr[0], s: total };
  fr.push(last);
  fr.total = total;
  return fr;
}

/** Flip the index winding when the geometric normals disagree with the stored vertex normals. */
export function fixWinding(g) {
  const p = g.attributes.position, nr = g.attributes.normal, ix = g.index.array;
  let agree = 0, total = 0;
  const a = V3(), b = V3(), c = V3(), e1 = V3(), e2 = V3(), gn = V3(), vn = V3();
  const step = Math.max(1, Math.floor(ix.length / 3 / 400));
  for (let t = 0; t < ix.length; t += 3 * step) {
    a.fromBufferAttribute(p, ix[t]); b.fromBufferAttribute(p, ix[t + 1]); c.fromBufferAttribute(p, ix[t + 2]);
    e1.subVectors(b, a); e2.subVectors(c, a); gn.crossVectors(e1, e2);
    if (gn.lengthSq() < 1e-14) continue;
    vn.fromBufferAttribute(nr, ix[t]).add(a.fromBufferAttribute(nr, ix[t + 1])).add(c.fromBufferAttribute(nr, ix[t + 2]));
    total++;
    if (gn.dot(vn) > 0) agree++;
  }
  if (total && agree < total / 2) {
    for (let t = 0; t < ix.length; t += 3) { const k = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = k; }
    g.index.needsUpdate = true;
  }
  return g;
}

/**
 * Sweep a 2D profile along contour frames. profFn(frame) -> array of [o, h] (o along O, h along n), traversed so that
 * the outward normal is (dh, -do)/len. Hard edges (angle > crease) get split normals. uvTile = mm per texture tile.
 * closedProfile joins last->first (use for round sections).
 */
export function sweepProfile(frames, profFn, { crease = 42, uvTile = 2, closedProfile = false } = {}) {
  const N = frames.length;
  const first = profFn(frames[0]);
  const m = first.length;
  const nSeg = closedProfile ? m : m - 1;
  const per = nSeg * 2;
  const cr = Math.cos((crease * Math.PI) / 180);
  const pos = new Float32Array(N * per * 3), nor = new Float32Array(N * per * 3), uv = new Float32Array(N * per * 2);
  for (let i = 0; i < N; i++) {
    const f = frames[i];
    const pr = profFn(f);
    const sn = [], arc = [0];
    for (let j = 0; j < nSeg; j++) {
      const A = pr[j], B = pr[(j + 1) % m];
      const dO = B[0] - A[0], dH = B[1] - A[1];
      const l = Math.hypot(dO, dH) || 1e-9;
      sn.push([dH / l, -dO / l]);
      arc.push(arc[j] + l);
    }
    for (let j = 0; j < nSeg; j++) {
      for (let e = 0; e < 2; e++) {
        const k = (j + e) % m;
        let nn = sn[j];
        const nbI = e === 0 ? j - 1 : j + 1;
        const nb = sn[closedProfile ? (nbI + nSeg) % nSeg : nbI];
        if (nb && nb[0] * nn[0] + nb[1] * nn[1] > cr) {
          const x = nn[0] + nb[0], y = nn[1] + nb[1], l = Math.hypot(x, y) || 1;
          nn = [x / l, y / l];
        }
        const o = pr[k][0], h = pr[k][1];
        const vi = i * per + j * 2 + e;
        pos[vi * 3] = f.P.x + f.O.x * o + f.n.x * h;
        pos[vi * 3 + 1] = f.P.y + f.O.y * o + f.n.y * h;
        pos[vi * 3 + 2] = f.P.z + f.O.z * o + f.n.z * h;
        let x = f.O.x * nn[0] + f.n.x * nn[1], y = f.O.y * nn[0] + f.n.y * nn[1], z = f.O.z * nn[0] + f.n.z * nn[1];
        const l = Math.hypot(x, y, z) || 1;
        nor[vi * 3] = x / l; nor[vi * 3 + 1] = y / l; nor[vi * 3 + 2] = z / l;
        uv[vi * 2] = f.s / uvTile; uv[vi * 2 + 1] = (arc[j + e] ?? arc[j]) / uvTile;
      }
    }
  }
  const idx = [];
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < nSeg; j++) {
      const a = i * per + j * 2, b = a + 1, d = (i + 1) * per + j * 2, c = d + 1;
      idx.push(a, c, b, a, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  return fixWinding(g);
}

/** Circle polyline for tube sections: [o, h] points around (o0, h0). Counter-clockwise so normals face outward. */
export function circleSection(o0, h0, r, n = 12, squash = 1) {
  const out = [];
  // traversal with outward normal (dh, -do): counter-clockwise in the (o, h) plane (top runs toward -o)
  for (let i = 0; i < n; i++) {
    const a = Math.PI / 2 + (i / n) * TAU;
    out.push([o0 + Math.cos(a) * r, h0 + Math.sin(a) * r * squash]);
  }
  return out;
}

/** Matrix4 that places a unit-Y-up object at p with up axis n, spinning `spin` rad about it, uniformly scaled by s. */
const _up = new THREE.Vector3(0, 1, 0);
export function placeMat(p, n, spin = 0, s = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(_up, n.clone().normalize());
  if (spin) q.multiply(new THREE.Quaternion().setFromAxisAngle(_up, spin));
  return new THREE.Matrix4().compose(p, q, new THREE.Vector3(s, s, s));
}

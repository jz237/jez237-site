// Bearded-dragon-like agamid sculpted from signed-distance primitives.
// Units: centimetres. The lizard faces +X, +Y is up and +Z is its right side.
// Every primitive carries the skeleton bones it belongs to; skin weights are
// derived from the same soft blend that joins the primitives.
import {
  add, aabbOf, clamp, cross, dot, ellipsoid, inBox, len, lerp3, mix, monotoneChannels, norm,
  roundCone, scale, smax, smin, smoothstep, sphere, sub, torus, valueNoise3,
} from './sdf.mjs';

// x, half width, half height above / below the centreline, centre height, cross-section exponent
const PROFILE = [
  [-15.6, 0.03, 0.03, 0.03, 0.25, 2.0],
  [-14.9, 0.1, 0.09, 0.09, 0.27, 2.0],
  [-12.5, 0.22, 0.18, 0.17, 0.42, 2.05],
  [-9.5, 0.36, 0.28, 0.27, 0.66, 2.1],
  [-6.4, 0.55, 0.4, 0.38, 1.02, 2.15],
  [-3.6, 0.78, 0.52, 0.5, 1.4, 2.2],
  [-1.6, 1.0, 0.64, 0.6, 1.68, 2.25],
  [-0.2, 1.22, 0.76, 0.72, 1.86, 2.3],
  [0.8, 1.55, 0.88, 0.82, 1.95, 2.35],
  [1.8, 2.0, 1.02, 0.95, 2.02, 2.45],
  [3.0, 2.48, 1.15, 1.08, 2.08, 2.55],
  [4.5, 2.68, 1.22, 1.14, 2.12, 2.6],
  [6.0, 2.56, 1.2, 1.13, 2.18, 2.55],
  [7.4, 2.12, 1.08, 1.06, 2.25, 2.45],
  [8.4, 1.66, 0.94, 0.98, 2.34, 2.3],
  [9.05, 1.52, 0.88, 1.0, 2.44, 2.25],
  [9.55, 1.7, 0.92, 1.12, 2.52, 2.3],
  [10.05, 1.8, 0.96, 1.06, 2.6, 2.4],
  [10.6, 1.6, 0.96, 0.86, 2.66, 2.5],
  [11.25, 1.28, 0.88, 0.7, 2.68, 2.6],
  [11.9, 0.98, 0.72, 0.57, 2.66, 2.65],
  [12.45, 0.72, 0.55, 0.45, 2.62, 2.6],
  [12.82, 0.5, 0.4, 0.33, 2.58, 2.4],
  [13.02, 0.16, 0.15, 0.13, 2.56, 2.0],
];
const X_MIN = PROFILE[0][0], X_MAX = PROFILE[PROFILE.length - 1][0];
const profileAt = monotoneChannels(PROFILE, 5);
const P = new Float64Array(5);
export function profile(x) {
  profileAt(x, P);
  return { w: P[0], ht: P[1], hb: P[2], cy: P[3], n: P[4] };
}

export const HINGE_X = 10.3;
const MOUTH_HALF = 0.05;
export function mouthY(x) {
  const { cy } = profile(x);
  const back = smoothstep(13.1, HINGE_X, x);
  // A faint upturn at the corner gives the characteristic agamid "smile".
  const corner = Math.exp(-(((x - (HINGE_X + 0.25)) / 0.3) ** 2)) * 0.05;
  return cy - 0.07 - 0.21 * back + corner;
}

// --- skeleton ---------------------------------------------------------------
export const bones = [];
const boneIndex = new Map();
function addBone(name, origin, axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], parent = null) {
  boneIndex.set(name, bones.length);
  bones.push({ name, origin, axes, parent });
  return bones.length - 1;
}
const SPINE = [
  ['tail10', -15.0], ['tail9', -13.6], ['tail8', -12.1], ['tail7', -10.5], ['tail6', -8.9],
  ['tail5', -7.2], ['tail4', -5.5], ['tail3', -3.8], ['tail2', -2.2], ['tail1', -0.65],
  ['pelvis', 0.9], ['spine1', 3.0], ['spine2', 5.2], ['chest', 7.5], ['neck', 9.1], ['head', 10.35],
];
for (const [name, x] of SPINE) addBone(name, [x, profile(x).cy, 0]);
addBone('jaw', [HINGE_X, mouthY(HINGE_X), 0], undefined, 'head');
addBone('gular', [9.75, profile(9.75).cy - 0.5, 0], undefined, 'neck');
const B = (n) => boneIndex.get(n);

function spineWeights(x, out) {
  if (x <= SPINE[0][1]) { out.push([B(SPINE[0][0]), 1]); return; }
  for (let i = 0; i < SPINE.length - 1; i++) {
    const [n0, x0] = SPINE[i], [n1, x1] = SPINE[i + 1];
    if (x <= x1) {
      const t = smoothstep(0, 1, (x - x0) / (x1 - x0));
      out.push([B(n0), 1 - t], [B(n1), t]);
      return;
    }
  }
  out.push([B('head'), 1]);
}

// --- head features -------------------------------------------------------------
const eyeX = 11.12;
const eyeProfile = profile(eyeX);
export const EYE = {
  radius: 0.235,
  centre: [eyeX, eyeProfile.cy + 0.27, eyeProfile.w - 0.15],
  axis: norm([0.18, 0.3, 1]),
};
const eyeFeatures = [];
for (const s of [1, -1]) {
  const c = [EYE.centre[0], EYE.centre[1], EYE.centre[2] * s];
  const axis = [EYE.axis[0], EYE.axis[1], EYE.axis[2] * s];
  eyeFeatures.push({
    s, c, axis,
    rim: torus(add(c, scale(axis, 0.1)), axis, 0.215, 0.07),
    socket: sphere(c, EYE.radius + 0.018),
    brow: ellipsoid(add(c, [0.0, 0.22, -0.06 * s]), [0.5, 0.13, 0.2], norm([1, 0.12, 0.08 * s]), norm([-0.12, 1, 0.1 * s]), norm(cross(norm([1, 0.12, 0.08 * s]), norm([-0.12, 1, 0.1 * s])))),
    nostrilRim: sphere([12.74, profile(12.74).cy + 0.15, 0.42 * s], 0.085),
    nostril: sphere([12.76, profile(12.74).cy + 0.16, 0.5 * s], 0.048),
    ear: ellipsoid([9.85, profile(9.85).cy - 0.04, (profile(9.85).w + 0.06) * s], [0.15, 0.21, 0.14]),
  });
}

// Lateral body fold that carries the fringe of spines.
const foldParts = [];
for (const s of [1, -1]) {
  const pts = [7.5, 6.3, 5.0, 3.8, 2.6, 1.9].map((x) => {
    const p = profile(x);
    return [x, p.cy - 0.18, (p.w - 0.1) * s];
  });
  for (let i = 0; i < pts.length - 1; i++) foldParts.push(roundCone(pts[i], pts[i + 1], 0.13, 0.13));
}

function loftDistance(x, y, z) {
  const xc = clamp(x, X_MIN, X_MAX);
  const { w, ht, hb, cy, n } = profile(xc);
  const dy = y - cy;
  const h = dy > 0 ? ht : hb;
  const a = Math.abs(z) / w, b = Math.abs(dy) / h;
  const an = Math.pow(a, n), bn = Math.pow(b, n);
  const r = Math.pow(an + bn, 1 / n);
  let d;
  if (r < 1e-6) d = -Math.min(w, h);
  else {
    const k = Math.pow(r, 1 - n);
    const gz = (k * Math.pow(a, n - 1)) / w, gy = (k * Math.pow(b, n - 1)) / h;
    d = Math.max((r - 1) / Math.hypot(gz, gy), -Math.min(w, h));
  }
  // Correct for the profile's slope along the body.
  const e = 0.05;
  const w0 = profile(xc - e).w, w1 = profile(xc + e).w;
  const slope = (w1 - w0) / (2 * e);
  d /= Math.sqrt(1 + slope * slope * 0.6);
  const ex = Math.max(X_MIN - x, x - X_MAX, 0);
  if (ex > 0) d = Math.hypot(ex, Math.max(d, 0));
  return d;
}

function headDistance(x, y, z) {
  let d = loftDistance(x, y, z);
  // Lateral fold.
  if (x > 1.4 && x < 8.0 && Math.abs(z) > 1.2) for (const f of foldParts) if (inBox(f.box, x, y, z, 0.3)) d = smin(d, f.f(x, y, z), 0.12);
  if (x > 8.9) {
    for (const e of eyeFeatures) {
      if (Math.sign(z) !== e.s) continue;
      d = smin(d, e.brow.f(x, y, z), 0.09);
      d = smin(d, e.rim.f(x, y, z), 0.07);
      d = smax(d, -e.socket.f(x, y, z), 0.03);
      d = smin(d, e.nostrilRim.f(x, y, z), 0.05);
      d = smax(d, -e.nostril.f(x, y, z), 0.025);
      d = smax(d, -e.ear.f(x, y, z), 0.05);
    }
    // Mouth: a slit that separates the upper and lower jaws back to the hinge.
    if (x > HINGE_X - 0.2) {
      const m = mouthY(x);
      const cut = Math.max(Math.abs(y - m) - MOUTH_HALF, HINGE_X - x);
      d = smax(d, -cut, 0.025);
    }
  }
  // Subtle irregularity so the silhouette is not mathematically perfect.
  d += valueNoise3(x * 1.7, y * 1.7, z * 1.7) * 0.025;
  return d;
}

function headWeights(x, y, z) {
  const out = [];
  spineWeights(x, out);
  const p = profile(clamp(x, X_MIN, X_MAX));
  const m = mouthY(Math.max(x, HINGE_X - 0.6));
  const jaw = smoothstep(m + 0.03, m - 0.03, y) * smoothstep(9.55, 10.35, x);
  const gular = smoothstep(p.cy - 0.25, p.cy - p.hb * 0.85, y) * smoothstep(8.5, 9.4, x) * (1 - smoothstep(10.4, 11.3, x)) * (1 - smoothstep(0.55, 1.3, Math.abs(z)));
  const keep = (1 - jaw) * (1 - gular);
  const res = out.map(([b, w]) => [b, w * keep]);
  res.push([B('jaw'), jaw * (1 - gular)], [B('gular'), gular]);
  return res;
}

// --- limbs -------------------------------------------------------------------
const rotY = (v, deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  // positive degrees turn +X toward +Z
  return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
};
const mz = (p, s) => [p[0], p[1], p[2] * s];

const LIMB_SPECS = {
  front: {
    root: [7.7, 1.86, 1.6], mid: [7.25, 1.56, 3.5], wrist: [7.75, 0.42, 3.95],
    footYaw: 28, palm: [0.32, 0.1, 0.29], palmOffset: 0.22, rUpper: [0.56, 0.36], rLower: [0.36, 0.23],
    digits: [[-55, 0.42, 0.075], [-22, 0.62, 0.08], [6, 0.8, 0.082], [32, 0.9, 0.08], [72, 0.52, 0.07]],
    upperBlend: 0.32,
  },
  hind: {
    root: [1.15, 1.76, 1.35], mid: [2.1, 1.58, 3.65], wrist: [1.3, 0.44, 4.3],
    footYaw: 58, palm: [0.44, 0.11, 0.32], palmOffset: 0.28, rUpper: [0.74, 0.43], rLower: [0.43, 0.26],
    digits: [[-52, 0.5, 0.078], [-26, 0.76, 0.084], [-4, 1.0, 0.086], [18, 1.38, 0.084], [78, 0.68, 0.078, -0.18]],
    upperBlend: 0.38,
  },
};

export const limbs = [];
const limbParts = [];

function frameFrom(xAxis, upHint) {
  const x = norm(xAxis);
  let zA = cross(x, upHint);
  if (len(zA) < 1e-5) zA = cross(x, [0, 0, 1]);
  const z = norm(zA);
  const y = norm(cross(z, x));
  return [x, y, z];
}

for (const kind of ['front', 'hind']) {
  for (const s of [-1, 1]) {
    const spec = LIMB_SPECS[kind];
    const side = s > 0 ? 'R' : 'L';
    const S = mz(spec.root, s), E = mz(spec.mid, s), W = mz(spec.wrist, s);
    const plane = norm(cross(sub(E, S), sub(W, E)));
    const upper = addBone(`${kind}${side}_upper`, S, frameFrom(sub(E, S), cross(plane, sub(E, S))));
    const lower = addBone(`${kind}${side}_lower`, E, frameFrom(sub(W, E), cross(plane, sub(W, E))));
    const fwd = norm(rotY([1, 0, 0], spec.footYaw * s));
    const palmC = [W[0] + fwd[0] * spec.palmOffset, 0.13, W[2] + fwd[2] * spec.palmOffset];
    const footFrame = frameFrom(fwd, [0, 1, 0]);
    const hand = addBone(`${kind}${side}_hand`, [W[0], 0.13, W[2]], footFrame);
    const digitBones = [];
    const digits = [];
    spec.digits.forEach(([deg, length, r0, back = 0], i) => {
      const dir = norm(rotY(fwd, deg * s));
      const base = add(add(palmC, scale(dir, spec.palm[0] * 0.75)), scale(fwd, back));
      base[1] = 0.12;
      const segs = [0.36, 0.34, 0.3];
      const pts = [base];
      let p = base;
      const lift = [0.05, -0.02, -0.04];
      for (let k = 0; k < 3; k++) {
        p = add(p, add(scale(dir, length * segs[k]), [0, lift[k], 0]));
        pts.push(p);
      }
      pts[3][1] = Math.max(pts[3][1], 0.07);
      const b = addBone(`${kind}${side}_d${i + 1}`, base, frameFrom(dir, [0, 1, 0]));
      digitBones.push(b);
      digits.push({ base, dir, length, tip: pts[3] });
      const radii = [r0, r0 * 0.86, r0 * 0.74, r0 * 0.6];
      for (let k = 0; k < 3; k++) {
        limbParts.push({ ...roundCone(pts[k], pts[k + 1], radii[k], radii[k + 1]), k: 0.035, w: k === 0 ? [[b, 0.75], [hand, 0.25]] : [[b, 1]], tag: 0 });
        // knuckle swelling
        if (k > 0) limbParts.push({ ...sphere(pts[k], radii[k] * 1.12), k: 0.03, w: [[b, 1]], tag: 0 });
      }
      const c1 = add(pts[3], add(scale(dir, 0.085), [0, -0.004, 0]));
      const c2 = add(c1, add(scale(dir, 0.075), [0, -0.045, 0]));
      limbParts.push({ ...roundCone(pts[3], c1, 0.036, 0.022), k: 0.012, w: [[b, 1]], tag: 1 });
      limbParts.push({ ...roundCone(c1, c2, 0.022, 0.006), k: 0.006, w: [[b, 1]], tag: 1 });
    });
    const ax = footFrame;
    limbParts.push({ ...ellipsoid(palmC, spec.palm, ax[0], ax[1], ax[2]), k: 0.08, w: [[hand, 1]], tag: 0 });
    limbParts.push({ ...roundCone(S, E, spec.rUpper[0], spec.rUpper[1]), k: spec.upperBlend, w: [[upper, 1]], tag: 0, joinsBody: true });
    // muscle belly on the upper limb
    const belly = lerp3(S, E, 0.45);
    limbParts.push({ ...ellipsoid(add(belly, [0, 0.06, 0]), [len(sub(E, S)) * 0.36, spec.rUpper[0] * 0.92, spec.rUpper[0] * 0.95], ...frameFrom(sub(E, S), [0, 1, 0])), k: 0.12, w: [[upper, 1]], tag: 0 });
    limbParts.push({ ...roundCone(E, W, spec.rLower[0], spec.rLower[1]), k: 0.1, w: [[lower, 1]], tag: 0 });
    limbParts.push({ ...roundCone(W, palmC, spec.rLower[1], spec.palm[1] * 1.2), k: 0.1, w: [[lower, 0.4], [hand, 0.6]], tag: 0 });
    limbs.push({
      kind, side: s, bones: { upper, lower, hand, digits: digitBones },
      root: S, mid: E, wrist: W, palm: palmC, forward: fwd,
      upperLength: len(sub(E, S)), lowerLength: len(sub(W, E)), plane, digits,
    });
  }
}

// --- assembly ------------------------------------------------------------------
const bodyBox = aabbOf([[X_MIN, 0, 0], [X_MAX, 3.5, 0]], 2.6);
const body = { f: headDistance, box: bodyBox, k: 0, weights: headWeights, tag: 0 };
const parts = [body, ...limbParts.map((p) => ({ ...p, weights: () => p.w }))];
export const bounds = (() => {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const p of parts) for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], p.box.min[i]); max[i] = Math.max(max[i], p.box.max[i]); }
  return { min, max };
})();

export function sdf(x, y, z) {
  let d = body.f(x, y, z);
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    if (!inBox(p.box, x, y, z, p.k + 0.05)) continue;
    d = smin(d, p.f(x, y, z), p.k);
  }
  return d;
}

/** Bone weights + region tags at a surface point. */
export function surfaceInfo(x, y, z) {
  const dist = [];
  let dmin = Infinity;
  for (const p of parts) {
    const d = p === body || inBox(p.box, x, y, z, 0.6) ? p.f(x, y, z) : Infinity;
    dist.push(d);
    if (d < dmin) dmin = d;
  }
  const acc = new Map();
  let claw = 0, total = 0;
  parts.forEach((p, i) => {
    if (!Number.isFinite(dist[i])) return;
    const soft = 0.25 * Math.max(p.k, 0.06) + 0.025;
    const a = Math.exp(-Math.max(0, dist[i] - dmin) / soft);
    if (a < 1e-3) return;
    total += a;
    if (p.tag === 1) claw += a;
    for (const [b, w] of p.weights(x, y, z)) acc.set(b, (acc.get(b) || 0) + a * w);
  });
  const weights = [...acc.entries()].filter(([, w]) => w > 1e-4).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const sum = weights.reduce((s, [, w]) => s + w, 0) || 1;
  // Mouth interior: on the slit faces inside the head.
  let mouth = 0;
  if (x > HINGE_X - 0.1 && x < X_MAX) {
    const pr = profile(x);
    const m = mouthY(x);
    mouth = (1 - smoothstep(MOUTH_HALF + 0.015, MOUTH_HALF + 0.05, Math.abs(y - m))) * (1 - smoothstep(pr.w * 0.7, pr.w * 0.92, Math.abs(z)));
  }
  return { weights: weights.map(([b, w]) => [b, w / sum]), claw: claw / (total || 1), mouth };
}

export const meta = {
  hingeX: HINGE_X,
  mouthAt: (x) => mouthY(x),
  spine: SPINE.map(([name, x]) => ({ name, x, y: profile(x).cy })),
};

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
  [-16.4, 0.03, 0.03, 0.03, 0.22, 2.0],
  [-15.6, 0.1, 0.09, 0.09, 0.26, 2.0],
  [-13.0, 0.22, 0.19, 0.18, 0.4, 2.05],
  [-10.0, 0.37, 0.3, 0.29, 0.62, 2.1],
  [-7.0, 0.56, 0.42, 0.4, 0.95, 2.2],
  [-4.2, 0.82, 0.55, 0.52, 1.32, 2.3],
  [-2.0, 1.12, 0.66, 0.62, 1.62, 2.4],
  [-0.4, 1.45, 0.75, 0.7, 1.82, 2.5],
  // the broad, flat trunk of Pogona: an oval disc in plan
  [0.7, 1.9, 0.86, 0.78, 1.94, 2.6],
  [1.8, 2.45, 0.98, 0.88, 2.02, 2.7],
  [3.0, 2.9, 1.08, 0.95, 2.08, 2.75],
  [4.4, 3.08, 1.14, 0.98, 2.12, 2.8],
  [5.8, 2.95, 1.12, 0.97, 2.17, 2.75],
  [7.1, 2.5, 1.04, 0.98, 2.24, 2.6],
  [8.1, 1.98, 0.98, 1.02, 2.33, 2.45],
  [8.85, 1.55, 0.94, 1.08, 2.42, 2.35],
  // the head, measured from photographs: from the ear to the snout about twice
  // as long as it is deep at the eye, the snout about twice the ear-to-eye
  // distance; a spade in plan, wide at the spiny jowls; a flat crown with sharp
  // canthal edges and a forehead sloping down to a blunt, rounded nose
  [9.4, 1.62, 0.96, 1.2, 2.52, 2.4],
  [9.85, 1.62, 0.87, 1.04, 2.58, 2.5],
  [10.3, 1.5, 0.82, 0.88, 2.62, 2.6],
  [10.75, 1.34, 0.78, 0.75, 2.65, 2.7],
  [11.2, 1.14, 0.71, 0.65, 2.64, 2.75],
  [11.54, 0.97, 0.64, 0.58, 2.61, 2.7],
  [11.88, 0.8, 0.57, 0.5, 2.57, 2.6],
  [12.22, 0.63, 0.46, 0.43, 2.52, 2.5],
  [12.47, 0.49, 0.35, 0.35, 2.47, 2.4],
  [12.6, 0.34, 0.25, 0.26, 2.45, 2.2],
  [12.68, 0.12, 0.11, 0.11, 2.44, 2.0],
];
const X_MIN = PROFILE[0][0], X_MAX = PROFILE[PROFILE.length - 1][0];
const profileAt = monotoneChannels(PROFILE, 5);
const P = new Float64Array(5);
export function profile(x) {
  profileAt(x, P);
  return { w: P[0], ht: P[1], hb: P[2], cy: P[3], n: P[4] };
}

export const HINGE_X = 10.0;
const MOUTH_HALF = 0.02;
export function mouthY(x) {
  const { cy } = profile(x);
  const back = smoothstep(12.7, HINGE_X, x);
  // A faint upturn at the corner gives the characteristic agamid "smile".
  const corner = Math.exp(-(((x - (HINGE_X + 0.3)) / 0.45) ** 2)) * 0.1;
  return cy - 0.04 - 0.24 * back + corner;
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
  ['tail10', -15.5], ['tail9', -14.0], ['tail8', -12.4], ['tail7', -10.8], ['tail6', -9.1],
  ['tail5', -7.4], ['tail4', -5.7], ['tail3', -4.0], ['tail2', -2.3], ['tail1', -0.65],
  ['pelvis', 0.9], ['spine1', 3.0], ['spine2', 5.2], ['chest', 7.5], ['neck', 9.0], ['head', 10.3],
];
for (const [name, x] of SPINE) addBone(name, [x, profile(x).cy, 0]);
addBone('jaw', [HINGE_X, mouthY(HINGE_X), 0], undefined, 'head');
addBone('gular', [9.6, profile(9.6).cy - 0.6, 0], undefined, 'neck');
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
const eyeX = 11.0;
const eyeProfile = profile(eyeX);
export const EYE = {
  radius: 0.295,
  centre: [eyeX, eyeProfile.cy + 0.31, eyeProfile.w - 0.27],
  axis: norm([0.18, 0.3, 1]),
};
export const NOSTRIL = [12.42, profile(12.4).cy + 0.08, profile(12.4).w * 0.96];
const eyeFeatures = [];
for (const s of [1, -1]) {
  const c = [EYE.centre[0], EYE.centre[1], EYE.centre[2] * s];
  const axis = [EYE.axis[0], EYE.axis[1], EYE.axis[2] * s];
  eyeFeatures.push({
    s, c, axis,
    rim: torus(add(c, scale(axis, 0.08)), axis, 0.31, 0.09),
    socket: sphere(c, EYE.radius + 0.018),
    // the supraocular ridge: a low shelf along the canthus that overhangs the eye
    brow: ellipsoid(add(c, [-0.04, 0.22, -0.12 * s]), [0.48, 0.12, 0.22], norm([1, 0.12, 0.08 * s]), norm([-0.12, 1, 0.1 * s]), norm(cross(norm([1, 0.12, 0.08 * s]), norm([-0.12, 1, 0.1 * s])))),
    nostrilRim: sphere([12.4, profile(12.4).cy + 0.08, profile(12.4).w * 0.84 * s], 0.08),
    nostril: sphere([12.42, profile(12.4).cy + 0.08, profile(12.4).w * 1.0 * s], 0.05),
    ear: ellipsoid([9.92, profile(9.92).cy + 0.04, (profile(9.92).w + 0.02) * s], [0.2, 0.27, 0.24]),
    earRim: torus([9.92, profile(9.92).cy + 0.04, (profile(9.92).w - 0.03) * s], [0.15, 0, s], 0.25, 0.05),
    // the spiny jowl pad behind the corner of the mouth
    jowl: ellipsoid([9.6, profile(9.6).cy - 0.2, (profile(9.6).w - 0.38) * s], [0.5, 0.46, 0.4]),
  });
}

// Lips: a low swelling along both edges of the mouth, where the pale labial
// scales sit.
const lipParts = [];
for (const s of [1, -1]) for (const off of [0.065, -0.07]) {
  const pts = [10.15, 10.6, 11.05, 11.45, 11.85, 12.18, 12.44, 12.6].map((x) => [x, mouthY(x) + off, profile(x).w * (x > 12.52 ? 0.9 : 0.955) * s]);
  for (let i = 0; i < pts.length - 1; i++) lipParts.push(roundCone(pts[i], pts[i + 1], 0.07, 0.07 - 0.008 * (i > 4)));
}

// Lateral body fold that carries the fringe of spines.
const foldParts = [];
for (const s of [1, -1]) {
  const pts = [7.6, 6.4, 5.1, 3.9, 2.7, 1.6].map((x) => {
    const p = profile(x);
    return [x, p.cy - 0.2, (p.w - 0.08) * s];
  });
  for (let i = 0; i < pts.length - 1; i++) foldParts.push(roundCone(pts[i], pts[i + 1], 0.16, 0.16));
}

function loftDistance(x, y, z) {
  const xc = clamp(x, X_MIN, X_MAX);
  let { w, ht, hb, cy, n } = profile(xc);
  const dy = y - cy;
  const h = dy > 0 ? ht : hb;
  // the crown and the top of the snout are flat (photographs show a broad, level
  // head, not a dome), edged by the canthal ridges
  if (dy > 0) n += 2.3 * smoothstep(9.5, 10.5, xc) * (1 - smoothstep(11.55, 12.4, xc));
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
  if (x > 1.2 && x < 8.1 && Math.abs(z) > 1.4) for (const f of foldParts) if (inBox(f.box, x, y, z, 0.3)) d = smin(d, f.f(x, y, z), 0.12);
  if (x > 8.8) {
    for (const e of eyeFeatures) {
      if (Math.sign(z) !== e.s) continue;
      d = smin(d, e.brow.f(x, y, z), 0.14);
      d = smin(d, e.rim.f(x, y, z), 0.07);
      d = smax(d, -e.socket.f(x, y, z), 0.03);
      d = smin(d, e.nostrilRim.f(x, y, z), 0.05);
      d = smax(d, -e.nostril.f(x, y, z), 0.025);
      if (x < 10.6) d = smin(d, e.jowl.f(x, y, z), 0.22);
      if (x < 10.4) d = smin(d, e.earRim.f(x, y, z), 0.05);
      d = smax(d, -e.ear.f(x, y, z), 0.04);
    }
    if (x > 10.0) for (const l of lipParts) if (inBox(l.box, x, y, z, 0.1)) d = smin(d, l.f(x, y, z), 0.05);
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
  const jaw = smoothstep(m + 0.03, m - 0.03, y) * smoothstep(9.35, 10.1, x);
  const gular = smoothstep(p.cy - 0.25, p.cy - p.hb * 0.85, y) * smoothstep(8.4, 9.2, x) * (1 - smoothstep(10.2, 11.0, x)) * (1 - smoothstep(0.7, 1.5, Math.abs(z)));
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
    root: [7.6, 1.95, 2.0], mid: [7.15, 1.7, 4.2], wrist: [7.7, 0.48, 4.55],
    footYaw: 28, palm: [0.38, 0.12, 0.34], palmOffset: 0.26, rUpper: [0.72, 0.48], rLower: [0.48, 0.32],
    digits: [[-55, 0.5, 0.09], [-22, 0.72, 0.095], [6, 0.92, 0.097], [32, 1.0, 0.095], [72, 0.6, 0.085]],
    upperBlend: 0.36,
  },
  hind: {
    root: [1.2, 1.8, 1.9], mid: [2.3, 1.62, 4.5], wrist: [1.35, 0.48, 5.05],
    footYaw: 58, palm: [0.5, 0.13, 0.36], palmOffset: 0.32, rUpper: [0.98, 0.56], rLower: [0.56, 0.34],
    digits: [[-52, 0.6, 0.09], [-26, 0.88, 0.096], [-4, 1.15, 0.098], [18, 1.6, 0.096], [78, 0.78, 0.088, -0.18]],
    upperBlend: 0.42,
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
      base[1] = 0.13;
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
      // long, curved, dark claws
      const c1 = add(pts[3], add(scale(dir, 0.15), [0, 0.012, 0]));
      const c2 = add(c1, add(scale(dir, 0.13), [0, -0.035, 0]));
      const c3 = add(c2, add(scale(dir, 0.06), [0, -0.075, 0]));
      limbParts.push({ ...roundCone(pts[3], c1, 0.046, 0.032), k: 0.012, w: [[b, 1]], tag: 1 });
      limbParts.push({ ...roundCone(c1, c2, 0.032, 0.018), k: 0.006, w: [[b, 1]], tag: 1 });
      limbParts.push({ ...roundCone(c2, c3, 0.018, 0.004), k: 0.004, w: [[b, 1]], tag: 1 });
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
const bodyBox = aabbOf([[X_MIN, 0, 0], [X_MAX, 3.6, 0]], 3.3);
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
    // the pink interior shows only inside the mouth, not at the closed lips of the snout tip
    mouth = (1 - smoothstep(MOUTH_HALF + 0.015, MOUTH_HALF + 0.05, Math.abs(y - m))) * (1 - smoothstep(pr.w * 0.7, pr.w * 0.92, Math.abs(z))) * (1 - smoothstep(12.2, 12.5, x));
  }
  return { weights: weights.map(([b, w]) => [b, w / sum]), claw: claw / (total || 1), mouth };
}

export const meta = {
  hingeX: HINGE_X,
  mouthAt: (x) => mouthY(x),
  spine: SPINE.map(([name, x]) => ({ name, x, y: profile(x).cy })),
};

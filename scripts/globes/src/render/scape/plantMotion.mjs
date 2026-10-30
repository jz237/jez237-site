// The betta bowl's plants in motion (its page only): how the leaves of plants.mjs bend and flutter
// in the water, as a closed form for each vertex, so the GPU can move every vertex every frame and
// refit the furnishings' BVH round them (scapeRefit.mjs). The feel is the kelp globe's (slow,
// soft, ripples running out along the blades) and that of the plants in the user's Living
// Aquascape (rotatable-aquascape/lib/PlantCurrent.ts), its numbers carried over (there a unit is
// ~7 cm, here ~12 cm; seconds are seconds).
//
// A leaf is one flexible chain: its petiole (stalk) from its foot in the crown or rhizome, then its
// blade; v runs along it, 0 at the foot to 1 at the blade's tip (vb where the blade begins), u along
// the blade alone (0 at its base, 1 at its tip) and s across it (world units from the midrib).
//   - The stalk bends from its foot: its tip is pushed by D(t) (square to the stalk there: a flap
//     towards the blade's face, a smaller sway to the side, and the water's lean), and a point q
//     along it (0..1) by D q^2 (2 - q), no slope at the foot, its ring turned with the bend there;
//     less, along the stalk, what that push would stretch it by where it curves (its part along the
//     stalk, integrated from the foot: J_P, J_Q), so a curved petiole bends without stretching.
//   - The blade stays on the stalk's tip and turns with it (carried with the tip, and turned about
//     it by the turn D's bend gives the tip, a true rotation), and flutters in its own frame, taken
//     at each point along its midrib (along T, across X, its face N): the aquascape's travelling
//     wave, out along the blade
//     (phase - 1.8 u, with its tip harmonic at 2.7 times the rate), towards its face, and a twist
//     about the midrib, both weighted u^2 (2 - u) (no slope at its base); and a sway in its own
//     plane at half the rate, turning it whole about its base (a blade hardly bends in its own
//     plane); all under the 17 s surge (0.70 .. 1). Its cross-sections turn with its bends and its
//     twist (a point s across and h off the midrib's plane moves as on a rigid section), and as the
//     wave bends the arched midrib its length is kept (the wave's main part is offset along T by
//     its integral over the curvature: Kc, Ks), so a blade neither stretches nor shrinks as it
//     flaps.
//   - The whole plant sways slowly: h^2 up from the leaf's foot (periods of 5.3, 7.7 and 9.4 s, the
//     phase shifted across the bowl so the two plants never move in step), each point turned with
//     the bend at its height (so what stands out from the foot tilts with it rather than shears).
//   - Each leaf's amplitudes: its own phase and rate (but a leaf crowded against another moves in
//     step with it: plants.mjs); the blade's flap min(cap, k / length) of its length (so long
//     blades do not swing wildly); the stalk's a small angle of its length.
// A leaf that would swing into the driftwood, a rock or the glass is calmed as a whole, once, when
// the BVH's refit is planned against the real obstacles (tamedLeaves, from scapeRefit.mjs's
// refitPlan: its amplitudes scaled down together, so it still bends without stretching; the
// meshes' own tables keep the full motion). Then nothing is let into the sand (below FLOOR, where
// the rest pose is above it), and plant_collide pushes a point out of the solid capsules (out to
// the bark: SOLID_SKIN of their solid radius, and a margin) and in from the glass (GLASS_CLEAR):
// the last guard, seldom needed.
// The roots and crowns do not move.
//
// Time never reaches the GPU: every frame the CPU works out each leaf's phases in f64 (leafPhases:
// its wave's, its sway's and its surge's, the angles wrapped to 0 .. 2 pi), and the shader reads
// them. (An f32 time would cost the normals their precision within hours of a page being open.)
//
// The data (plants.mjs puts it on each plant's mesh as mesh.motion = { vertex, leaves }):
//   vertex: MOTION_VERTEX_STRIDE (20) floats a vertex, five vec4s:
//     [leaf, v, u, s]        leaf: which (the mesh's leaves; -1 for what does not move: crown,
//                            rhizome, roots); v along the chain (0..1; vb at the stalk's tip); u
//                            along the blade (0..1; -1 on the stalk); s across it (world units,
//                            along X; 0 on the stalk)
//     [q.xyz, q.w]           the local frame as a unit quaternion: T = q e1 (along the chain: the
//                            stalk's centre line, the midrib), X = q e2 (across), N = q e3 (the
//                            blade's face); on the stalk only T counts
//     [kappa, Kc, Ks, h]     on the blade: the midrib's curvature there (radians a world unit, T
//                            turning towards -N), the integrals of cos(1.8 u) u^2 (2 - u) and
//                            sin(1.8 u) u^2 (2 - u) over its turn from the blade's base (radians),
//                            and how far the vertex lies off the midrib's plane (along N; s is its
//                            offset along X); on the stalk: [o.xyz, 0], the vertex less its ring's
//                            centre
//     [J_P.xyz, 0] [J_Q.xyz, 0]   on the stalk: the integrals from its foot to the vertex's ring
//                            (q) of (T . P) w'(q) T and of (T . Q) w'(q) T, w' = q (4 - 3 q) (its
//                            bend's slope); zeros on the blade
//   leaves: LEAF_STRIDE (40) floats a leaf, ten vec4s:
//     [foot.xyz, vb]         the stalk's foot (fixed); where the blade begins along v
//     [B.xyz, Ls]            the stalk's tip (its centre line's end, under the blade's base: what
//                            the blade turns about); the stalk's length
//     [S.xyz, Lb]            the stalk's direction at its tip (unit); the blade's length
//     [P.xyz, gain]          the stalk's flap direction (unit, square to S: towards the blade's
//                            face); how much of the lean the stalk's tip takes (see below)
//     [phase, rate, flap, stalk]   radians, radians a second, the blade's flap and the stalk tip's
//                            amplitudes (world units)
//     [crown.xyz, height]    the plant's crown and height (the sway's scale)
//     [swayX, swayZ, plantPhase, twist]   the sway's amplitudes at height (world units), the
//                            plant's phase, the blade's twist (radians at its tip)
//     [side, plant, 0, 0]    the blade's sway in its own plane (its tip's, of its flap); which plant
//                            (0 tall, 1 small)
//     [J_P.xyz, 0] [J_Q.xyz, 0]   the stalk's integrals at its tip (q = 1)
// The lean (the integrator's, from the simulated water): a vec4 a leaf, xyz the displacement it
// asks of the leaf's tip (the bowl's frame, low-passed and capped already). The stalk's tip takes
// gain times its part square to the stalk (a petiole does not stretch), but never more than
// LEAN_CAP of the stalk's length, and the blade turns with it: the tip moves by the lean's square
// part (to first order), and every point along the chain by the same weight as the stalk's own
// bending.
//   phases: PHASE_STRIDE (12) floats a leaf, three vec4s, written every frame (leafPhases):
//     [ph, 2.7 ph, 0.81 ph, 2.1 ph]   the wave's phase and its harmonics' (radians, 0 .. 2 pi)
//     [side, waveB, surge, 0]         the blade's sway's phase, the slow wave's (radians), the surge
//     [swayX, swayZ, 0, 0]            the whole plant's sway at its height (world units)

import { BED_LEVEL, GLASS_CLEAR } from './mesh.mjs';

export const MOTION_VERTEX_STRIDE = 20;
export const LEAF_STRIDE = 40;
export const PHASE_STRIDE = 12;
/** The most the lean carries a stalk's tip (square to the stalk), of the stalk's length. Tested
 *  with leans of 0.05 on every leaf at once (plant-motion.test.mjs): the blades' edges change
 *  length by at most 6% (as much as their own flutter does), the stalks' centre lines by 3.4%. */
export const LEAN_CAP = 0.25;
/** A displaced point is kept at least this high above the sand where its rest pose is. */
export const FLOOR = BED_LEVEL + 0.004;
/** How far beyond a solid capsule's radius plant_collide keeps a point (world units), and over how
 *  much its push comes in (softly: no kink where it begins). A point is kept between the radius
 *  less COLLIDE_SOFT and the radius; and between GLASS_CLEAR less 2 COLLIDE_SOFT and GLASS_CLEAR
 *  less COLLIDE_SOFT from the glass. */
export const COLLIDE_MARGIN = 0.002;
export const COLLIDE_SOFT = 0.0015;
/** How far the surface lies beyond an obstacle's solid (of it): the driftwood's solid is its
 *  limbs' core, 0.9 of their radius, under the bark (a rock's solid already holds the rock). */
export const SOLID_SKIN = 1.12;
/** The step of the normal's finite differences (world units). */
const EPS = 1e-3;

/** Each plant's motion: the blade's flap min(cap, k / Lb) of its length Lb; the stalk tip's
 *  amplitude a small angle (radians) of the stalk's length; the rates (radians a second, from
 *  rate[0] to rate[0] + rate[1] leaf to leaf); the blade's sway in its own plane (its tip's, of its
 *  flap) and twist (radians at its tip); the whole plant's sway (world units at its height, x and
 *  z) and height. */
export const PLANT_MOTION = {
  tall: { cap: 0.07, k: 0.022, stalk: 0.03, rate: [1.0, 0.6], side: 0.3, twist: 0.4, sway: [0.022, 0.015], height: 0.6 },
  small: { cap: 0.04, k: 0.009, stalk: 0.025, rate: [1.3, 0.5], side: 0.3, twist: 0.25, sway: [0.013, 0.009], height: 0.35 },
};

const SURGE_RATE = (2 * Math.PI) / 17;
/** The travelling wave along a blade: its harmonics' weights; its main wave number along u. */
const WAVE_A = 1.12, WAVE_B = 0.16, WAVE_C = 0.1;
export const WAVE_K = 1.8;

const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

/**
 * Fills one leaf's row of the table (out at o, LEAF_STRIDE floats). g: { foot, base (the stalk's
 * tip), S, P, Ls, Lb, tip (the blade's tip at rest), dir (the blade's first direction), jP, jQ (the
 * stalk's integrals at its tip), crown, plant ('tall' | 'small'), young (a furled leaf: no twist) }.
 */
export function leafRow(out, o, g) {
  const m = PLANT_MOTION[g.plant];
  const vb = g.Ls / (g.Ls + g.Lb);
  // (The aquascape's phase from where the leaf is, in its units.)
  const k = 12 / 7;
  const phase = (g.base[0] * 13.7 + g.base[1] * 9.3 + g.base[2] * 17.1) * k + g.dir[0] * 4.2;
  const rate = m.rate[0] + m.rate[1] * (0.5 + 0.5 * Math.sin(phase * 1.7));
  const flap = Math.min(m.cap * g.Lb, m.k);
  const stalk = m.stalk * g.Ls;
  // (The lean's gain: the blade turning with the stalk carries its tip by (S . R) / Ls more, and the
  // stalk keeping its length less, by P . J_P and Q . J_Q (their mean).)
  const R = [g.tip[0] - g.base[0], g.tip[1] - g.base[1], g.tip[2] - g.base[2]];
  const Q = [g.S[1] * g.P[2] - g.S[2] * g.P[1], g.S[2] * g.P[0] - g.S[0] * g.P[2], g.S[0] * g.P[1] - g.S[1] * g.P[0]];
  const keep = 0.5 * (g.P[0] * g.jP[0] + g.P[1] * g.jP[1] + g.P[2] * g.jP[2] + Q[0] * g.jQ[0] + Q[1] * g.jQ[1] + Q[2] * g.jQ[2]);
  const gain = clamp(1 / (1 + (g.S[0] * R[0] + g.S[1] * R[1] + g.S[2] * R[2]) / g.Ls - keep), 0.25, 2);
  const plantPhase = 2.2 * g.crown[0] + 1.3 * g.crown[2];
  out.set([
    ...g.foot, vb,
    ...g.base, g.Ls,
    ...g.S, g.Lb,
    ...g.P, gain,
    phase, rate, flap, stalk,
    ...g.crown, m.height,
    m.sway[0], m.sway[1], plantPhase, g.young ? 0 : m.twist,
    m.side, g.plant === 'tall' ? 0 : 1, 0, 0,
    ...g.jP, 0,
    ...g.jQ, 0,
  ], o);
}

/** The unit quaternion (x, y, z, w) of the frame whose columns are T, X, N (orthonormal, right
 *  handed: T x X = N). */
export function frameQuat(T, X, N) {
  const m00 = T[0], m10 = T[1], m20 = T[2], m01 = X[0], m11 = X[1], m21 = X[2], m02 = N[0], m12 = N[1], m22 = N[2];
  const tr = m00 + m11 + m22;
  let x, y, z, w;
  if (tr > 0) {
    const s = 0.5 / Math.sqrt(tr + 1);
    w = 0.25 / s; x = (m21 - m12) * s; y = (m02 - m20) * s; z = (m10 - m01) * s;
  } else if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    w = (m21 - m12) / s; x = 0.25 * s; y = (m01 + m10) / s; z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    w = (m02 - m20) / s; x = (m01 + m10) / s; y = 0.25 * s; z = (m12 + m21) / s;
  } else {
    const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
    w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = 0.25 * s;
  }
  const l = Math.hypot(x, y, z, w);
  return [x / l, y / l, z / l, w / l];
}

// ---- the phases (every frame, on the CPU) ---------------------------------------------------------

const TAU = 2 * Math.PI;
const wrap = (x) => x - TAU * Math.floor(x / TAU);

/** Leaf li's phases at time t into out at o (PHASE_STRIDE floats: see the layout above). */
function phasesOf(L, li, t, out, o) {
  const b = li * LEAF_STRIDE, pp = L[b + 26], phase = L[b + 16], rate = L[b + 17];
  const ph = rate * t + phase + 0.32 * Math.sin(0.43 * t + pp);
  out[o] = wrap(ph);
  out[o + 1] = wrap(2.7 * ph);
  out[o + 2] = wrap(0.81 * ph);
  out[o + 3] = wrap(2.1 * ph);
  out[o + 4] = wrap(0.5 * rate * t + 0.73 * phase);
  out[o + 5] = wrap(0.63 * t + pp);
  out[o + 6] = 0.85 + 0.15 * Math.sin(SURGE_RATE * t + pp);
  out[o + 7] = 0;
  out[o + 8] = L[b + 24] * (0.73 * Math.sin(0.82 * t + pp) + 0.27 * Math.sin(1.19 * t + 1.7 * pp));
  out[o + 9] = L[b + 25] * Math.sin(0.67 * t + pp + 0.8);
  out[o + 10] = 0;
  out[o + 11] = 0;
}

/**
 * Every leaf's phases at time t (seconds, in f64, from any origin: performance.now() / 1000 will
 * do), for plantPhase: PHASE_STRIDE floats a leaf of the table leaves (into out, if given, else a
 * new Float32Array). The integrator writes them every frame; the shader never sees t.
 */
export function leafPhases(leaves, t, out = null) {
  const n = leaves.length / LEAF_STRIDE;
  const o = out ?? new Float32Array(n * PHASE_STRIDE);
  for (let i = 0; i < n; i++) phasesOf(leaves, i, t, o, i * PHASE_STRIDE);
  return o;
}

// ---- the CPU mirror -----------------------------------------------------------------------------
// The same arithmetic as the WGSL below (in f64: the GPU's f32 differs by its rounding).

const sinc = (x) => (x < 1e-4 ? 1 : Math.sin(x) / x);

/** A leaf's motion at time t (seconds, or every leaf's phases: leafPhases's) shared by all its
 *  points: st, a scratch object it fills. */
function leafState(L, b, lean, li, t, st) {
  const q = (st.q ??= new Float64Array(PHASE_STRIDE));
  if (typeof t === 'number') phasesOf(L, li, t, q, 0);
  else for (let k = 0; k < PHASE_STRIDE; k++) q[k] = t[li * PHASE_STRIDE + k];
  const stalk = L[b + 19];
  st.b = b;
  st.ph = q[0];
  st.ph27 = q[1];
  st.ph081 = q[2];
  st.ph21 = q[3];
  st.waveB = q[5];
  st.surge = q[6];
  st.swayX = q[8];
  st.swayZ = q[9];
  const Sx = L[b + 8], Sy = L[b + 9], Sz = L[b + 10];
  const Px = L[b + 12], Py = L[b + 13], Pz = L[b + 14];
  const Qx = Sy * Pz - Sz * Py, Qy = Sz * Px - Sx * Pz, Qz = Sx * Py - Sy * Px;
  const a = stalk * st.surge * Math.sin(st.ph + 0.6);
  const c = stalk * st.surge * 0.45 * Math.sin(q[4] + 0.9);
  let Dx = Px * a + Qx * c, Dy = Py * a + Qy * c, Dz = Pz * a + Qz * c;
  if (lean) {
    const lx = lean[li * 4], ly = lean[li * 4 + 1], lz = lean[li * 4 + 2];
    const along = lx * Sx + ly * Sy + lz * Sz, g = L[b + 15];
    const ex = g * (lx - Sx * along), ey = g * (ly - Sy * along), ez = g * (lz - Sz * along);
    const k = Math.min(1, (LEAN_CAP * L[b + 7]) / Math.max(Math.hypot(ex, ey, ez), 1e-12));
    Dx += ex * k;
    Dy += ey * k;
    Dz += ez * k;
  }
  st.Dx = Dx; st.Dy = Dy; st.Dz = Dz;
  // (D's parts along P and Q, and where the stalk's tip goes, kept its length.)
  const al = Dx * Px + Dy * Py + Dz * Pz, be = Dx * Qx + Dy * Qy + Dz * Qz;
  st.al = al;
  st.be = be;
  st.P = [Px, Py, Pz];
  st.Q = [Qx, Qy, Qz];
  st.tx = Dx - al * L[b + 32] - be * L[b + 36];
  st.ty = Dy - al * L[b + 33] - be * L[b + 37];
  st.tz = Dz - al * L[b + 34] - be * L[b + 38];
  // (The blade's turn: the stalk's tip's, its bend q^2 (2 - q) having slope 1 there, and its own
  // sway in its plane, about P, its tip by side of its flap; as a rotation, wb's length its angle.)
  const iL = 1 / L[b + 7];
  const psi = (L[b + 28] * L[b + 18] * st.surge * Math.sin(q[4] - 0.5)) / L[b + 11];
  st.bx = (Sy * Dz - Sz * Dy) * iL + Px * psi;
  st.by = (Sz * Dx - Sx * Dz) * iL + Py * psi;
  st.bz = (Sx * Dy - Sy * Dx) * iL + Pz * psi;
  st.th2 = st.bx * st.bx + st.by * st.by + st.bz * st.bz;
  const th = Math.sqrt(st.th2), sh = sinc(0.5 * th);
  st.s1 = sinc(th);
  st.s2 = 0.5 * sh * sh;
  return st;
}

/** The displacement of the point p (its chain coordinates v, u, s; its frame T, X, N; on the
 *  blade Kc, Ks, h, on the stalk (stalk: the vertex is on it) its offset from its ring's centre (k0,
 *  k1, k2) and its J_P, J_Q (J, six numbers)) of the leaf whose state is st, into out. */
function pointDisp(L, st, stalk, px, py, pz, v, u, s, T, X, N, k0, k1, k2, J, out) {
  const b = st.b;
  const h = Math.max(py - L[b + 1], 0) / L[b + 23];
  const sw = h * h;
  // (Turned with the bend at its height: dy from the bend's slope, 2 h / height of the sway.)
  const tilt = (2 * h) / L[b + 23];
  let dx = sw * st.swayX, dy = -tilt * ((px - L[b]) * st.swayX + (pz - L[b + 2]) * st.swayZ), dz = sw * st.swayZ;
  if (stalk) {
    // (Its ring turned by the bend's slope there, T towards D, w' / Ls of it.)
    const q = v / L[b + 3], w = q * q * (2 - q), ws = (q * (4 - 3 * q)) / L[b + 7];
    const rx = (T[1] * st.Dz - T[2] * st.Dy) * ws, ry = (T[2] * st.Dx - T[0] * st.Dz) * ws, rz = (T[0] * st.Dy - T[1] * st.Dx) * ws;
    dx += w * st.Dx - st.al * J[0] - st.be * J[3] + ry * k2 - rz * k1;
    dy += w * st.Dy - st.al * J[1] - st.be * J[4] + rz * k0 - rx * k2;
    dz += w * st.Dz - st.al * J[2] - st.be * J[5] + rx * k1 - ry * k0;
  } else {
    const flap = L[b + 18] * st.surge, off = k2;
    const fu = u * u * (2 - u), fu1 = u * (4 - 3 * u);
    const ph = st.ph;
    const a = ph - WAVE_K * u, c = st.waveB - 1.4 * u, e = st.ph27 - 5.5 * u;
    const R = WAVE_A * Math.sin(a) + WAVE_B * Math.sin(c) + WAVE_C * Math.sin(e);
    const R1 = -WAVE_A * WAVE_K * Math.cos(a) - 1.4 * WAVE_B * Math.cos(c) - 5.5 * WAVE_C * Math.cos(e);
    const F = flap * fu * R, F1 = flap * (fu1 * R + fu * R1);
    const G = -flap * WAVE_A * (Math.sin(ph) * k0 - Math.cos(ph) * k1);
    const th = L[b + 27] * u * (0.25 * Math.sin(st.ph081 - 0.6 * u + 1.2) + 0.08 * Math.sin(st.ph21 - 3 * u));
    // (Its flutter f, its sections turned with the bend, along T, and with the twist, about it;
    // then the whole blade, fluttered, turned about the stalk's tip and carried with it.)
    const n = F + s * th, t = G - (off * F1) / L[b + 11], x = -off * th;
    const fx = N[0] * n + T[0] * t + X[0] * x, fy = N[1] * n + T[1] * t + X[1] * x, fz = N[2] * n + T[2] * t + X[2] * x;
    const vx = px - L[b + 4] + fx, vy = py - L[b + 5] + fy, vz = pz - L[b + 6] + fz;
    const wx = st.bx, wy = st.by, wz = st.bz, wv = wx * vx + wy * vy + wz * vz;
    dx += st.tx + fx + st.s1 * (wy * vz - wz * vy) + st.s2 * (wx * wv - st.th2 * vx);
    dy += st.ty + fy + st.s1 * (wz * vx - wx * vz) + st.s2 * (wy * wv - st.th2 * vy);
    dz += st.tz + fz + st.s1 * (wx * vy - wy * vx) + st.s2 * (wz * wv - st.th2 * vz);
  }
  out[0] = dx; out[1] = dy; out[2] = dz;
}

/** The frame (T, X, N) of the quaternion at mv[o + 4 ..]. */
function frameOf(mv, o, T, X, N) {
  const x = mv[o + 4], y = mv[o + 5], z = mv[o + 6], w = mv[o + 7];
  T[0] = 1 - 2 * (y * y + z * z); T[1] = 2 * (x * y + w * z); T[2] = 2 * (x * z - w * y);
  X[0] = 2 * (x * y - w * z); X[1] = 1 - 2 * (x * x + z * z); X[2] = 2 * (y * z + w * x);
  N[0] = 2 * (x * z + w * y); N[1] = 2 * (y * z - w * x); N[2] = 1 - 2 * (x * x + y * y);
}

const ST = {};
const T0 = [0, 0, 0], X0 = [0, 0, 0], N0 = [0, 0, 0], T1 = [0, 0, 0], N1 = [0, 0, 0];
const d0 = [0, 0, 0], d1 = [0, 0, 0], d2 = [0, 0, 0];
const J0 = [0, 0, 0, 0, 0, 0], J1 = [0, 0, 0, 0, 0, 0];
/** (The last leaf state worked out, kept while the calls are for the same leaf, time and lean.) */
const last = { L: null, li: -1, t: NaN, lean: null };
const forget = () => {
  last.L = null;
};

/**
 * Moves one vertex (the fast path of the mirror): rest position P at po, rest normal Nr at no
 * (or null: no normal), motion mv at mo (MOTION_VERTEX_STRIDE floats), the mesh's leaf table L,
 * lean (4 floats a leaf, or null), t: the time (seconds) or every leaf's phases (leafPhases's for
 * L: given those the GPU was given, the mirror differs from it only by the GPU's f32 arithmetic).
 * Writes the displaced position (the floor kept, not collided) to outP at op and the normal to outN
 * at op; returns false for a still vertex (left as it is). It keeps a leaf's state from one call to
 * the next while L, the leaf, t and the lean array are the same: after changing a table, a lean or
 * the phases in place, call forgetMotion.
 */
export function moveVertex(P, po, Nr, no, mv, mo, L, lean, t, outP, op, outN) {
  const li = mv[mo];
  if (!(li >= 0)) return false;
  const b = li * LEAF_STRIDE;
  const st = ST;
  if (last.L !== L || last.li !== li || last.t !== t || last.lean !== lean) {
    leafState(L, b, lean, li, t, st);
    last.L = L; last.li = li; last.t = t; last.lean = lean;
  }
  const px = P[po], py = P[po + 1], pz = P[po + 2];
  const v = mv[mo + 1], u = mv[mo + 2], s = mv[mo + 3];
  const c0 = mv[mo + 8], c1 = mv[mo + 9], c2 = mv[mo + 10];
  const stalk = u < 0;
  frameOf(mv, mo, T0, X0, N0);
  if (stalk) {
    for (let k = 0; k < 3; k++) {
      J0[k] = mv[mo + 12 + k];
      J0[3 + k] = mv[mo + 16 + k];
    }
    pointDisp(L, st, true, px, py, pz, v, u, s, T0, X0, N0, c0, c1, c2, J0, d0);
  } else pointDisp(L, st, false, px, py, pz, v, u, s, T0, X0, N0, c1, c2, mv[mo + 11], null, d0);
  outP[op] = px + d0[0];
  outP[op + 1] = Math.max(py + d0[1], Math.min(py, FLOOR));
  outP[op + 2] = pz + d0[2];
  if (!outN) return true;
  const nx = Nr[no], ny = Nr[no + 1], nz = Nr[no + 2];
  // Two tangents of the rest surface: along the chain, and across (n x it).
  let ax = T0[0], ay = T0[1], az = T0[2];
  let k = ax * nx + ay * ny + az * nz;
  ax -= nx * k; ay -= ny * k; az -= nz * k;
  let al = Math.hypot(ax, ay, az);
  if (al < 1e-4) {
    ax = X0[0]; ay = X0[1]; az = X0[2];
    k = ax * nx + ay * ny + az * nz;
    ax -= nx * k; ay -= ny * k; az -= nz * k;
    al = Math.hypot(ax, ay, az) || 1;
  }
  ax /= al; ay /= al; az /= al;
  const bx = ny * az - nz * ay, by = nz * ax - nx * az, bz = nx * ay - ny * ax;
  for (let j = 0; j < 2; j++) {
    const tx = j ? bx : ax, ty = j ? by : ay, tz = j ? bz : az, d = j ? d2 : d1;
    // (Where the point a step along the tangent lies on the chain, and its frame there.)
    const tt = tx * T0[0] + ty * T0[1] + tz * T0[2], dl = EPS * tt;
    const qx = px + EPS * tx, qy = py + EPS * ty, qz = pz + EPS * tz;
    if (stalk) {
      // (On the stalk: further along it, its J_P and J_Q with it, and round its ring.)
      const q = v / L[b + 3], dq = (q * (4 - 3 * q) * dl) / L[b + 7], P = st.P, Q = st.Q;
      const tp = (T0[0] * P[0] + T0[1] * P[1] + T0[2] * P[2]) * dq, tq = (T0[0] * Q[0] + T0[1] * Q[1] + T0[2] * Q[2]) * dq;
      for (let k = 0; k < 3; k++) {
        J1[k] = J0[k] + T0[k] * tp;
        J1[3 + k] = J0[3 + k] + T0[k] * tq;
      }
      pointDisp(L, st, true, qx, qy, qz, v + (dl * L[b + 3]) / L[b + 7], u, s, T0, X0, N0,
        c0 + EPS * (tx - T0[0] * tt), c1 + EPS * (ty - T0[1] * tt), c2 + EPS * (tz - T0[2] * tt), J1, d);
    } else {
      const dth = c0 * dl, fu = u * u * (2 - u);
      for (let i = 0; i < 3; i++) {
        T1[i] = T0[i] - dth * N0[i];
        N1[i] = N0[i] + dth * T0[i];
      }
      const ds = EPS * (tx * X0[0] + ty * X0[1] + tz * X0[2]), dh = EPS * (tx * N0[0] + ty * N0[1] + tz * N0[2]);
      pointDisp(L, st, false, qx, qy, qz, v, u + dl / L[b + 11], s + ds, T1, X0, N1,
        c1 + Math.cos(WAVE_K * u) * fu * dth, c2 + Math.sin(WAVE_K * u) * fu * dth, mv[mo + 11] + dh, null, d);
    }
  }
  const ux = ax + (d1[0] - d0[0]) / EPS, uy = ay + (d1[1] - d0[1]) / EPS, uz = az + (d1[2] - d0[2]) / EPS;
  const wx = bx + (d2[0] - d0[0]) / EPS, wy = by + (d2[1] - d0[1]) / EPS, wz = bz + (d2[2] - d0[2]) / EPS;
  const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx;
  const cl = Math.hypot(cx, cy, cz);
  if (!(cl > 1e-12)) {
    outN[op] = nx; outN[op + 1] = ny; outN[op + 2] = nz;
    return true;
  }
  const sg = cx * nx + cy * ny + cz * nz < 0 ? -1 / cl : 1 / cl;
  outN[op] = cx * sg; outN[op + 1] = cy * sg; outN[op + 2] = cz * sg;
  return true;
}

export { forget as forgetMotion };

/** One vertex's displaced position (the floor kept, before plantCollide): rest [x, y, z], mv its
 *  MOTION_VERTEX_STRIDE floats, leaves the mesh's table, lean 4 floats a leaf (or null). A still
 *  vertex stays where it is. */
export function displacePlantVertex(rest, mv, leaves, t, lean = null) {
  const out = [rest[0], rest[1], rest[2]];
  forget();
  moveVertex(rest, 0, null, 0, mv, 0, leaves, lean, t, out, 0, null);
  return out;
}

/** Where some moving vertices are at a time (the floor kept, before plantCollide): rest, xyz a
 *  vertex; mv, MOTION_VERTEX_STRIDE floats a vertex (a leaf of `leaves`); t, seconds or the leaves'
 *  phases (leafPhases); lean, 4 floats a leaf (or null). Into out, xyz a vertex. */
export function placeVertices(rest, mv, leaves, t, lean, out) {
  forget();
  for (let i = 0; i < rest.length / 3; i++) moveVertex(rest, i * 3, null, 0, mv, i * MOTION_VERTEX_STRIDE, leaves, lean, t, out, i * 3, null);
  return out;
}

/** One vertex's normal there (unit, on the rest normal n's side). */
export function plantNormal(rest, n, mv, leaves, t, lean = null) {
  const p = [0, 0, 0], out = [n[0], n[1], n[2]];
  forget();
  moveVertex(rest, 0, n, 0, mv, 0, leaves, lean, t, p, 0, out);
  return out;
}

/** The furthest any vertex of leaf li could move (world units; a generous bound, the lean apart):
 *  its stalk's tip and the blade's turn with it, the wave, its twist and the plant's sway. */
export function leafReach(L, li) {
  const b = li * LEAF_STRIDE;
  const D = 1.1 * L[b + 19];
  // (A stalk's point moves by at most 2 D, kept its length; its tip by D and its J's share of it.)
  const j = Math.min(1, Math.hypot(L[b + 32], L[b + 33], L[b + 34]) + Math.hypot(L[b + 36], L[b + 37], L[b + 38]));
  return D * Math.max(2, 1 + j + (1.2 * L[b + 11]) / L[b + 7]) + L[b + 18] * (1.4 + 1.2 + 1.2 * L[b + 28]) + 0.05 * L[b + 27] + 3 * Math.hypot(L[b + 24], L[b + 25]);
}

/** The leaf table's entries tameMotion scales: the blade's flap, the stalk's, the twist, the sway. */
const TAMED = [18, 19, 27, 24, 25];

/**
 * Calms each leaf whose motion, over a minute of it, would carry it further into something than it
 * lies at rest (by more than allow): trespass(x, y, z), how far a point is inside it (negative: how
 * far clear). All the leaf's amplitudes (its flap, its stalk's bend, its twist, its share of the
 * plant's sway) are scaled down together, to minScale at least, so it still bends as before, only
 * less. Changes mesh.motion.leaves in place; returns each leaf's scale.
 */
export function tameMotion(mesh, trespass, { minScale = 0.25, allow = 0 } = {}) {
  const { vertex: mv, leaves: L } = mesh.motion;
  const P = mesh.positions, V = P.length / 3;
  const n = L.length / LEAF_STRIDE;
  const scale = new Array(n).fill(1);
  const near = Array.from({ length: n }, () => []);
  const reach = Array.from({ length: n }, (_, li) => leafReach(L, li));
  for (let v = 0; v < V; v++) {
    const li = mv[v * MOTION_VERTEX_STRIDE];
    if (!(li >= 0)) continue;
    const at = trespass(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]);
    if (at > -reach[li]) near[li].push(v, Math.max(at, 0) + allow);
  }
  const out = [0, 0, 0];
  for (let li = 0; li < n; li++) {
    let pts = near[li];
    if (!pts.length) continue;
    const b = li * LEAF_STRIDE, base = TAMED.map((k) => L[b + k]);
    // (Only what lies within its reach can be met: a trespass may narrow itself to that.)
    const inside = trespass.near ? trespass.near(P, pts, reach[li]) : trespass;
    const set = (s) => TAMED.forEach((k, i) => (L[b + k] = base[i] * s));
    // (Its points' worst over the minute at scale s, every 0.6 s; or, coarser, each's own.)
    const worst = (s, each = null) => {
      set(s);
      forget();
      let w = -Infinity;
      const steps = each ? 40 : 100;
      for (let k = 0; k < steps; k++) {
        const t = k * (60 / steps) + 0.07;
        for (let i = 0; i < pts.length; i += 2) {
          const v = pts[i];
          moveVertex(P, v * 3, null, 0, mv, v * MOTION_VERTEX_STRIDE, L, null, t, out, 0, null);
          const d = inside(out[0], out[1], out[2]) - pts[i + 1];
          if (d > w) w = d;
          if (each && d > each[i >> 1]) each[i >> 1] = d;
        }
      }
      return w;
    };
    const each = new Float64Array(pts.length / 2).fill(-Infinity);
    worst(1, each);
    // (Then only the points that came near: the others only draw further off as it calms.)
    pts = pts.filter((_, i) => each[i >> 1] > -0.012);
    if (!pts.length || worst(1) <= 0) {
      set(1);
      continue;
    }
    let lo = minScale, hi = 1;
    for (let i = 0; i < 5; i++) {
      const mid = 0.5 * (lo + hi);
      if (worst(mid) <= 0) lo = mid;
      else hi = mid;
    }
    set(lo);
    scale[li] = lo;
  }
  forget();
  return scale;
}

/** How deep (world units) a leaf may still swing into the solids before tamedLeaves calms it, and
 *  the least it calms one to: a leaf lying close to the wood or the glass at rest keeps a quarter
 *  of its motion at least. */
export const TAME_ALLOW = 0.003;
export const TAME_MIN = 0.25;

/** A plant mesh's leaf table calmed for its neighbours (obstacles: the driftwood's and the
 *  rocks'; the plants' own are passed over) and the glass (tameMotion): { leaves (a copy), scales,
 *  solids (plantSolids for its moving vertices, or as given: plantMotionWGSL's for all the moving
 *  meshes, refitPlan's) }. */
export function tamedLeaves(mesh, obstacles, { allow = TAME_ALLOW, minScale = TAME_MIN, solids = null } = {}) {
  const { vertex: mv } = mesh.motion, P = mesh.positions;
  if (!solids) {
    const rest = [];
    for (let v = 0; v < P.length / 3; v++) if (mv[v * MOTION_VERTEX_STRIDE] >= 0) rest.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]);
    solids = plantSolids(obstacles, rest);
  }
  const leaves = Float32Array.from(mesh.motion.leaves);
  const scales = tameMotion({ positions: P, motion: { vertex: mv, leaves } }, solidTrespass(solids), { allow, minScale });
  return { leaves, scales, solids };
}

/** How far a point is inside the solid capsules ({a, b, r}: plantSolids) or nearer the glass than
 *  plant_collide lets it come unpushed (negative: how far clear), for tameMotion; its near(P, pts,
 *  reach) the same for points that stay within reach of the vertices pts ([index, any] pairs into
 *  positions P). */
export function solidTrespass(solids) {
  const inside = (x, y, z) => {
    let w = Math.hypot(x, y, z) - (GLASS_CLEAR - 2 * COLLIDE_SOFT);
    for (const c of solids) w = Math.max(w, c.r - segDist(x, y, z, c.a, c.b));
    return w;
  };
  inside.near = (P, pts, reach) => {
    const some = solids.filter((c) => {
      for (let i = 0; i < pts.length; i += 2) {
        const v = pts[i];
        if (segDist(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], c.a, c.b) < c.r + reach + 1e-3) return true;
      }
      return false;
    });
    return some.length === solids.length ? inside : solidTrespass(some);
  };
  return inside;
}

/** The solid capsules plant_collide keeps the leaves out of: each obstacle with solid > 0, its
 *  radius SOLID_SKIN times solid, plus margin. rest (optional: the moving vertices' rest positions, xyz each) keeps
 *  every radius short of the nearest of them (so the rest pose is never pushed), and leaves out a
 *  capsule a rest point lies inside (a plant's own obstacle: scape-scene.test.mjs holds every
 *  other piece's solids clear of the plants). */
export function plantSolids(obstacles, rest = null, margin = COLLIDE_MARGIN) {
  const out = [];
  for (const o of obstacles) {
    if (!(o.solid > 0)) continue;
    let r = o.solid * SOLID_SKIN + margin;
    if (rest) {
      let near = Infinity;
      const lo = [0, 1, 2].map((k) => Math.min(o.a[k], o.b[k]) - r), hi = [0, 1, 2].map((k) => Math.max(o.a[k], o.b[k]) + r);
      for (let i = 0; i < rest.length; i += 3) {
        if (rest[i] < lo[0] || rest[i] > hi[0] || rest[i + 1] < lo[1] || rest[i + 1] > hi[1] || rest[i + 2] < lo[2] || rest[i + 2] > hi[2]) continue;
        near = Math.min(near, segDist(rest[i], rest[i + 1], rest[i + 2], o.a, o.b));
      }
      if (near < o.solid) continue;
      r = Math.min(r, near - 1e-4);
    }
    out.push({ a: [...o.a], b: [...o.b], r: Math.round(r * 1e6) / 1e6 });
  }
  return out;
}

function segDist(x, y, z, a, b) {
  const ex = b[0] - a[0], ey = b[1] - a[1], ez = b[2] - a[2];
  const px = x - a[0], py = y - a[1], pz = z - a[2];
  const l2 = ex * ex + ey * ey + ez * ez;
  const t = l2 > 0 ? clamp((px * ex + py * ey + pz * ez) / l2, 0, 1) : 0;
  return Math.hypot(px - ex * t, py - ey * t, pz - ez * t);
}

/** How far a point x into a solid (or past the glass's line) is pushed back: x^2 / 4 soft at first,
 *  then x less soft (C1). */
const soft = (x) => (x < 2 * COLLIDE_SOFT ? (x * x) / (4 * COLLIDE_SOFT) : x - COLLIDE_SOFT);

/** plant_collide on the CPU: p (xyz at o in P) pushed out of each solid capsule ({a, b, r},
 *  plantSolids) and in from the glass; returns how far it was moved (0 when it was clear). */
export function plantCollide(P, o, solids) {
  const x0 = P[o], y0 = P[o + 1], z0 = P[o + 2];
  let x = x0, y = y0, z = z0;
  for (const c of solids ?? []) {
    const ex = c.b[0] - c.a[0], ey = c.b[1] - c.a[1], ez = c.b[2] - c.a[2];
    const px = x - c.a[0], py = y - c.a[1], pz = z - c.a[2];
    const l2 = ex * ex + ey * ey + ez * ez;
    const t = l2 > 0 ? clamp((px * ex + py * ey + pz * ez) / l2, 0, 1) : 0;
    let qx = px - ex * t, qy = py - ey * t, qz = pz - ez * t;
    const d = Math.hypot(qx, qy, qz);
    if (d >= c.r) continue;
    if (d < 1e-9) { qx = 0; qy = 1; qz = 0; } else { qx /= d; qy /= d; qz /= d; }
    const k = soft(c.r - d);
    x += qx * k; y += qy * k; z += qz * k;
  }
  const l = Math.hypot(x, y, z), e = l - (GLASS_CLEAR - 2 * COLLIDE_SOFT);
  if (e > 0) {
    const k = (l - soft(e)) / l;
    x *= k; y *= k; z *= k;
  }
  P[o] = x; P[o + 1] = y; P[o + 2] = z;
  return Math.hypot(x - x0, y - y0, z - z0);
}

/**
 * A whole mesh moved at time t (the mirror of the integrator's skinning): its positions and normals
 * (new arrays, the still vertices as they were), each moving vertex collided with solids
 * (plantSolids; null: the glass only). lean: 4 floats a leaf of the mesh (or null). stats
 * (optional): the pushes plantCollide made ({ points, pushed, sum, max }).
 */
export function movePlant(mesh, t, { lean = null, solids = null, stats = null } = {}) {
  const P = mesh.positions, Nr = mesh.normals, { vertex: mv, leaves: L } = mesh.motion;
  const outP = Float32Array.from(P), outN = Float32Array.from(Nr);
  const vc = P.length / 3;
  forget();
  for (let v = 0; v < vc; v++) {
    if (!moveVertex(P, v * 3, Nr, v * 3, mv, v * MOTION_VERTEX_STRIDE, L, lean, t, outP, v * 3, outN)) continue;
    const d = plantCollide(outP, v * 3, solids);
    if (stats) {
      stats.points++;
      if (d > 0) {
        stats.pushed++;
        stats.sum += d;
        stats.max = Math.max(stats.max, d);
      }
    }
  }
  return { positions: outP, normals: outN };
}

// ---- the shader -----------------------------------------------------------------------------------
const f = (x) => {
  const s = Number.isInteger(x) ? `${x}.0` : String(x);
  return /e/.test(s) && !/\./.test(s) ? s.replace('e', '.0e') : s;
};
const v3 = (a) => `vec3f(${a.map((x) => f(Math.round(x * 1e6) / 1e6)).join(', ')})`;

/**
 * The plants' motion in WGSL. obstacles: the driftwood's, the rocks' and the equipment's (those with
 * solid > 0 keep out the leaves: see plantSolids); rest: the moving vertices' rest positions, xyz
 * each (refitPlan's plan.rest), which keeps the rest pose clear of them. Defines:
 *   struct PlantMV { a: vec4f, b: vec4f, c: vec4f, d: vec4f, e: vec4f }   a vertex's motion (its
 *                                                        five vec4s)
 *   fn plant_displace(rest: vec3f, mv: PlantMV) -> vec3f   the displaced point (floor kept)
 *   fn plant_normal(rest: vec3f, n: vec3f, mv: PlantMV) -> vec3f   its normal (unit)
 *   struct PlantMoved { p: vec3f, n: vec3f }
 *   fn plant_move(rest: vec3f, n: vec3f, mv: PlantMV) -> PlantMoved   both at once
 *   fn plant_collide(p: vec3f) -> vec3f   p pushed out of the solids and in from the glass
 * They read three storage arrays the caller declares:
 *   plantLeaves: array<vec4f>   the leaf table (LEAF_STRIDE / 4 = 10 vec4s a leaf, all the moving
 *                               meshes' tables in turn: refitPlan's plan.leaves)
 *   plantLean: array<vec4f>     a leaf's lean (xyz; the bowl's frame), written every frame
 *   plantPhase: array<vec4f>    a leaf's phases (PHASE_STRIDE / 4 = 3 vec4s: leafPhases), written
 *                               every frame
 * (mv.a.x holds the leaf's index into all three.) Still vertices (mv.a.x < 0) are not to be passed.
 */
export function plantMotionWGSL(obstacles = [], rest = null) {
  const solids = plantSolids(obstacles, rest);
  const pushes = solids.map((c) => `  q = plant_pushOut(q, ${v3(c.a)}, ${v3(c.b)}, ${f(c.r)});`).join('\n');
  return /* wgsl */ `
// ---- the betta bowl's plants in motion (src/render/scape/plantMotion.mjs) -------------------------
const PLANT_FLOOR: f32 = ${f(FLOOR)};
const PLANT_GLASS: f32 = ${f(GLASS_CLEAR)};
const PLANT_SOFT: f32 = ${f(COLLIDE_SOFT)};
const PLANT_EPS: f32 = ${f(EPS)};
const PLANT_LEAN_CAP: f32 = ${f(LEAN_CAP)};
const PLANT_WAVE_K: f32 = ${f(WAVE_K)};

struct PlantMV {
  a: vec4f,
  b: vec4f,
  c: vec4f,
  d: vec4f,
  e: vec4f,
}

struct PlantMoved {
  p: vec3f,
  n: vec3f,
}

// A leaf's motion this frame, shared by all its points: its table's rows (r0 .. r7, but r3), its
// phases (ph: the wave's and its harmonics'), the surge, the push on the stalk's tip D (its parts
// ab along P and Q) and where the tip goes (Dt), the blade's turn about it (wb, its length the
// angle: the stalk tip's turn and the blade's own sway in its plane; s1, s2 and th2 its rotation's
// terms), the plant's sway (x, z).
struct PlantLeaf {
  r0: vec4f,
  r1: vec4f,
  r2: vec4f,
  r4: vec4f,
  r5: vec4f,
  r6: vec4f,
  r7: vec4f,
  P: vec3f,
  Q: vec3f,
  ph: vec4f,
  surge: f32,
  waveB: f32,
  D: vec3f,
  ab: vec2f,
  Dt: vec3f,
  wb: vec3f,
  s1: f32,
  s2: f32,
  th2: f32,
  sway: vec2f,
}

// sin(x) / x, for x >= 0.
fn plant_sinc(x: f32) -> f32 {
  return select(sin(x) / x, 1.0, x < 1e-4);
}

fn plant_leaf(leaf: u32) -> PlantLeaf {
  let o = leaf * 10u;
  let r0 = plantLeaves[o];
  let r1 = plantLeaves[o + 1u];
  let r2 = plantLeaves[o + 2u];
  let r3 = plantLeaves[o + 3u];
  let r4 = plantLeaves[o + 4u];
  let r5 = plantLeaves[o + 5u];
  let r6 = plantLeaves[o + 6u];
  let r7 = plantLeaves[o + 7u];
  let r8 = plantLeaves[o + 8u];
  let r9 = plantLeaves[o + 9u];
  let q0 = plantPhase[leaf * 3u];
  let q1 = plantPhase[leaf * 3u + 1u];
  let q2 = plantPhase[leaf * 3u + 2u];
  let surge = q1.z;
  let S = r2.xyz;
  let P = r3.xyz;
  let Q = cross(S, P);
  let lean = plantLean[leaf].xyz;
  let e = r3.w * (lean - S * dot(S, lean));
  let D = r4.w * surge * (P * sin(q0.x + 0.6) + Q * (0.45 * sin(q1.x + 0.9))) + e * min(1.0, PLANT_LEAN_CAP * r1.w / max(length(e), 1e-12));
  let ab = vec2f(dot(D, P), dot(D, Q));
  let wb = cross(S, D) / r1.w + P * (r7.x * r4.z * surge * sin(q1.x - 0.5) / r2.w);
  let th2 = dot(wb, wb);
  let th = sqrt(th2);
  let sh = plant_sinc(0.5 * th);
  return PlantLeaf(r0, r1, r2, r4, r5, r6, r7, P, Q, q0, surge, q1.y, D, ab, D - r8.xyz * ab.x - r9.xyz * ab.y, wb, plant_sinc(th), 0.5 * sh * sh, th2, q2.xy);
}

// The displacement of a point p of the leaf (onStalk: its vertex is on the stalk; v, u, s along and
// across it; its frame T, X, N; k: on the blade the wave's integrals and its offset off the
// midrib's plane (Kc, Ks, h), on the stalk the point less its ring's centre; jP, jQ: on the stalk
// its J_P and J_Q).
fn plant_point(L: PlantLeaf, onStalk: bool, p: vec3f, v: f32, u: f32, s: f32, T: vec3f, X: vec3f, N: vec3f, k: vec3f, jP: vec3f, jQ: vec3f) -> vec3f {
  let h = max(p.y - L.r0.y, 0.0) / L.r5.w;
  // (The sway, turned with the bend at its height.)
  let r = p.xz - L.r0.xz;
  var d = vec3f(L.sway.x * (h * h), -2.0 * h / L.r5.w * dot(r, L.sway), L.sway.y * (h * h));
  if (onStalk) {
    // (Its ring turned by the bend's slope there, T towards D.)
    let q = v / L.r0.w;
    let turn = cross(T, L.D) * (q * (4.0 - 3.0 * q) / L.r1.w);
    d += L.D * (q * q * (2.0 - q)) - jP * L.ab.x - jQ * L.ab.y + cross(turn, k);
  } else {
    let flap = L.r4.z * L.surge;
    let fu = u * u * (2.0 - u);
    let fu1 = u * (4.0 - 3.0 * u);
    let ph = L.ph.x;
    let a = ph - PLANT_WAVE_K * u;
    let b = L.waveB - 1.4 * u;
    let c = L.ph.y - 5.5 * u;
    let R = 1.12 * sin(a) + 0.16 * sin(b) + 0.1 * sin(c);
    let R1 = -1.12 * PLANT_WAVE_K * cos(a) - 0.224 * cos(b) - 0.55 * cos(c);
    let F = flap * fu * R;
    let F1 = flap * (fu1 * R + fu * R1);
    let G = -flap * 1.12 * (sin(ph) * k.x - cos(ph) * k.y);
    let th = L.r6.w * u * (0.25 * sin(L.ph.z - 0.6 * u + 1.2) + 0.08 * sin(L.ph.w - 3.0 * u));
    // (Its flutter, its sections turned with the bend, along T, and with the twist, about it; then
    // the whole blade, fluttered, turned about the stalk's tip and carried with it.)
    let fl = N * (F + s * th) + T * (G - k.z * F1 / L.r2.w) - X * (k.z * th);
    let rb = p - L.r1.xyz + fl;
    d += L.Dt + fl + L.s1 * cross(L.wb, rb) + L.s2 * (L.wb * dot(L.wb, rb) - rb * L.th2);
  }
  return d;
}

// The frame (T, X, N) of a unit quaternion.
fn plant_frame(q: vec4f) -> mat3x3f {
  let x = q.x;
  let y = q.y;
  let z = q.z;
  let w = q.w;
  return mat3x3f(
    vec3f(1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + w * z), 2.0 * (x * z - w * y)),
    vec3f(2.0 * (x * y - w * z), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + w * x)),
    vec3f(2.0 * (x * z + w * y), 2.0 * (y * z - w * x), 1.0 - 2.0 * (x * x + y * y)));
}

// The displaced point a step along the rest surface's tangent tg from the vertex (its chain
// coordinates and frame moved with it), less the vertex's own displacement d0.
fn plant_step(L: PlantLeaf, rest: vec3f, mv: PlantMV, F: mat3x3f, tg: vec3f, d0: vec3f) -> vec3f {
  let tt = dot(tg, F[0]);
  let dl = PLANT_EPS * tt;
  let p = rest + tg * PLANT_EPS;
  let v = mv.a.y;
  let u = mv.a.z;
  if (u < 0.0) {
    // (On the stalk: further along it, its J_P and J_Q with it, and round its ring.)
    let q = v / L.r0.w;
    let dq = q * (4.0 - 3.0 * q) * dl / L.r1.w;
    let jP = mv.d.xyz + F[0] * (dot(F[0], L.P) * dq);
    let jQ = mv.e.xyz + F[0] * (dot(F[0], L.Q) * dq);
    return plant_point(L, true, p, v + dl * L.r0.w / L.r1.w, u, 0.0, F[0], F[1], F[2], mv.c.xyz + (tg - F[0] * tt) * PLANT_EPS, jP, jQ) - d0;
  }
  let dth = mv.c.x * dl;
  let fu = u * u * (2.0 - u);
  let T = F[0] - F[2] * dth;
  let N = F[2] + F[0] * dth;
  let k = mv.c.yz + vec2f(cos(PLANT_WAVE_K * u), sin(PLANT_WAVE_K * u)) * (fu * dth);
  return plant_point(L, false, p, v, u + dl / L.r2.w, mv.a.w + PLANT_EPS * dot(tg, F[1]), T, F[1], N, vec3f(k, mv.c.w + PLANT_EPS * dot(tg, F[2])), vec3f(0.0), vec3f(0.0)) - d0;
}

// What plant_point takes as k at the vertex itself.
fn plant_k(mv: PlantMV) -> vec3f {
  return select(mv.c.yzw, mv.c.xyz, mv.a.z < 0.0);
}

fn plant_move(rest: vec3f, n: vec3f, mv: PlantMV) -> PlantMoved {
  let L = plant_leaf(u32(mv.a.x));
  let F = plant_frame(mv.b);
  let d0 = plant_point(L, mv.a.z < 0.0, rest, mv.a.y, mv.a.z, mv.a.w, F[0], F[1], F[2], plant_k(mv), mv.d.xyz, mv.e.xyz);
  var p = rest + d0;
  p.y = max(p.y, min(rest.y, PLANT_FLOOR));
  // The normal: the rest surface's two tangents (along the chain, and across) carried by the
  // displacement's differences.
  var ta = F[0] - n * dot(n, F[0]);
  if (dot(ta, ta) < 1e-8) { ta = F[1] - n * dot(n, F[1]); }
  ta = normalize(ta);
  let tb = cross(n, ta);
  let ua = ta + plant_step(L, rest, mv, F, ta, d0) / PLANT_EPS;
  let ub = tb + plant_step(L, rest, mv, F, tb, d0) / PLANT_EPS;
  let c = cross(ua, ub);
  let cl = length(c);
  var nn = n;
  if (cl > 1e-12) { nn = c * (select(1.0, -1.0, dot(c, n) < 0.0) / cl); }
  return PlantMoved(p, nn);
}

fn plant_displace(rest: vec3f, mv: PlantMV) -> vec3f {
  let L = plant_leaf(u32(mv.a.x));
  let F = plant_frame(mv.b);
  var p = rest + plant_point(L, mv.a.z < 0.0, rest, mv.a.y, mv.a.z, mv.a.w, F[0], F[1], F[2], plant_k(mv), mv.d.xyz, mv.e.xyz);
  p.y = max(p.y, min(rest.y, PLANT_FLOOR));
  return p;
}

fn plant_normal(rest: vec3f, n: vec3f, mv: PlantMV) -> vec3f {
  return plant_move(rest, n, mv).n;
}

// How far a point x into a solid (or past the glass's line) is pushed back: softly at first.
fn plant_soft(x: f32) -> f32 {
  return select(x - PLANT_SOFT, x * x / (4.0 * PLANT_SOFT), x < 2.0 * PLANT_SOFT);
}

// p pushed out of the capsule a .. b (radius r).
fn plant_pushOut(p: vec3f, a: vec3f, b: vec3f, r: f32) -> vec3f {
  let e = b - a;
  let h = clamp(dot(p - a, e) / max(dot(e, e), 1e-12), 0.0, 1.0);
  let q = p - a - e * h;
  let d = length(q);
  if (d >= r) { return p; }
  let dir = select(vec3f(0.0, 1.0, 0.0), q / max(d, 1e-30), d > 1e-9);
  return p + dir * plant_soft(r - d);
}

// p kept out of the driftwood's, the rocks' and the equipment's solids and in from the glass.
fn plant_collide(p: vec3f) -> vec3f {
  var q = p;
${pushes || '  // (No solids given.)'}
  let l = length(q);
  let x = l - (PLANT_GLASS - 2.0 * PLANT_SOFT);
  if (x > 0.0) { q *= (l - plant_soft(x)) / l; }
  return q;
}
`;
}

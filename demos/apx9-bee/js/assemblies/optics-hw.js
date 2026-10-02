// optics-hw.js - lean small hardware for the optics assembly: socket-head cap screws with a real hex recess,
// washers. Only the visible head is modelled (the shank is hidden in the part underneath).
import { THREE, revolve, merge, gear } from '../kit.js';

const TAU = Math.PI * 2;

function build(pos, nor, idx) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((pos.length / 3) * 2), 2));
  g.setIndex(idx);
  return g;
}

/**
 * Socket-head cap screw head: cylinder, chamfered top edge, hex recess. Axis +Y, base at y = 0.
 *  r head radius, h head height, seg is rounded to a multiple of 12 (12 = good, 24 = smooth).
 */
export function capScrew(r = 0.1, h = 0.075, { seg = 12, hex = 0.5, depth = 0.6, chamfer = 0.12 } = {}) {
  const N = Math.max(12, Math.round(seg / 12) * 12);
  const pos = [], nor = [], idx = [];
  const P = (x, y, z, nx, ny, nz) => { pos.push(x, y, z); nor.push(nx, ny, nz); return pos.length / 3 - 1; };
  // add a triangle, flipping the winding if its geometric normal disagrees with the wanted one
  const T = (a, b, c, wx, wy, wz) => {
    const ax = pos[b * 3] - pos[a * 3], ay = pos[b * 3 + 1] - pos[a * 3 + 1], az = pos[b * 3 + 2] - pos[a * 3 + 2];
    const bx = pos[c * 3] - pos[a * 3], by = pos[c * 3 + 1] - pos[a * 3 + 1], bz = pos[c * 3 + 2] - pos[a * 3 + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    if (nx * wx + ny * wy + nz * wz >= 0) idx.push(a, b, c); else idx.push(a, c, b);
  };
  const rc = r * (1 - chamfer * 1.2), yc = h - r * chamfer * 0.9;
  const rh = r * hex, dep = h * depth;
  const cs = (i) => [Math.cos((i / N) * TAU), Math.sin((i / N) * TAU)];
  // outer wall: bottom edge -> chamfer start (smooth normals), then the chamfer band (own normals)
  const A = [], B = [], B2 = [], C = [];
  const ck = Math.hypot(r - rc, h - yc), cnr = (h - yc) / ck, cny = (r - rc) / ck;
  for (let i = 0; i < N; i++) {
    const [c, s] = cs(i);
    A.push(P(r * c, 0, r * s, c, 0, s));
    B.push(P(r * c, yc, r * s, c, 0, s));
    B2.push(P(r * c, yc, r * s, c * cnr, cny, s * cnr));
    C.push(P(rc * c, h, rc * s, c * cnr, cny, s * cnr));
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, [mc, ms] = [Math.cos(((i + 0.5) / N) * TAU), Math.sin(((i + 0.5) / N) * TAU)];
    T(A[i], A[j], B[i], mc, 0, ms); T(A[j], B[j], B[i], mc, 0, ms);
    T(B2[i], B2[j], C[i], mc * cnr, cny, ms * cnr); T(B2[j], C[j], C[i], mc * cnr, cny, ms * cnr);
  }
  // top annulus between the chamfer ring and the hexagon (hex corners sit on every (N/6)-th vertex)
  const step = N / 6;
  const Ct = [], H = [];
  for (let i = 0; i < N; i++) { const [c, s] = cs(i); Ct.push(P(rc * c, h, rc * s, 0, 1, 0)); }
  for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; H.push(P(rh * Math.cos(a), h, rh * Math.sin(a), 0, 1, 0)); }
  for (let k = 0; k < 6; k++) {
    const k1 = (k + 1) % 6;
    for (let t = 0; t < step; t++) {
      const i0 = k * step + t, i1 = (i0 + 1) % N;
      // outer edge (i0,i1) fanned toward the nearer hex corner
      T(Ct[i0], Ct[i1], t < step / 2 ? H[k] : H[k1], 0, 1, 0);
    }
    // the hex edge k->k1 closes the strip with the middle triangle
    T(Ct[k * step + step / 2], H[k1], H[k], 0, 1, 0);
  }
  // hex walls + floor
  const hy = h - dep;
  for (let k = 0; k < 6; k++) {
    const k1 = (k + 1) % 6, a0 = (k / 6) * TAU, a1 = (k1 / 6) * TAU, am = (a0 + a1) / 2;
    const nx = -Math.cos(am), nz = -Math.sin(am);
    const w0 = P(rh * Math.cos(a0), h, rh * Math.sin(a0), nx, 0, nz), w1 = P(rh * Math.cos(a1), h, rh * Math.sin(a1), nx, 0, nz);
    const w2 = P(rh * Math.cos(a1), hy, rh * Math.sin(a1), nx, 0, nz), w3 = P(rh * Math.cos(a0), hy, rh * Math.sin(a0), nx, 0, nz);
    T(w0, w1, w2, nx, 0, nz); T(w0, w2, w3, nx, 0, nz);
  }
  const fc = P(0, hy, 0, 0, 1, 0);
  const F = [];
  for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; F.push(P(rh * Math.cos(a), hy, rh * Math.sin(a), 0, 1, 0)); }
  for (let k = 0; k < 6; k++) T(fc, F[k], F[(k + 1) % 6], 0, 1, 0);
  // underside
  const uc = P(0, 0, 0, 0, -1, 0);
  const U = [];
  for (let i = 0; i < N; i++) { const [c, s] = cs(i); U.push(P(r * c, 0, r * s, 0, -1, 0)); }
  for (let i = 0; i < N; i++) T(uc, U[i], U[(i + 1) % N], 0, -1, 0);
  return build(pos, nor, idx);
}

/** Shallow n-sided cone (a "pore" bump): base ring radius r at y = 0, apex at y = h; n triangles, flat shaded. Axis +Y. */
export function bumpGeo(r = 0.034, h = 0.015, n = 8) {
  const pos = [], nor = [], idx = [];
  const k = Math.hypot(r, h), ny = r / k, nr = h / k;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU, am = (a0 + a1) / 2;
    const b = pos.length / 3;
    pos.push(r * Math.cos(a0), 0, r * Math.sin(a0), r * Math.cos(a1), 0, r * Math.sin(a1), 0, h, 0);
    for (let j = 0; j < 3; j++) nor.push(Math.cos(am) * nr, ny, Math.sin(am) * nr);
    idx.push(b, b + 2, b + 1);
  }
  return build(pos, nor, idx);
}

/** Knurled ring about +Y spanning y0..y0+h: gear teeth (tip radius rOut, root rOut - depth) on a bore of radius rIn. */
export function knurl(rOut, rIn, teeth, y0, h, depth = 0.024, bevel = Math.min(0.012, h * 0.1)) {
  const g = gear({ teeth, rOut, rRoot: rOut - depth, bore: rIn, tip: 0.3, root: 0.44 }, h, bevel);
  g.rotateX(Math.PI / 2);
  g.translate(0, y0 + h / 2, 0);
  return g;
}

/** Flat washer ring about +Y, base at y0. */
export function washer(rIn, rOut, h = 0.03, y0 = 0, seg = 20) {
  return revolve([[rIn, y0], [rOut, y0], [rOut, y0 + h], [rIn, y0 + h], [rIn, y0]], { segments: seg, steps: 1, creaseDeg: 40 });
}

/** Threaded screw shank hanging down from y = 0 to y = -len (axis +Y): chamfered tip and a saw-tooth thread, crisp flanks. */
export function threadedShank(r = 0.06, len = 0.3, { ridges = 4, seg = 10 } = {}) {
  const rr = r * 0.8, p = (len - 0.03) / ridges;
  const prof = [[0, -len], [rr, -len], [r, -len + 0.03]];
  let y = -len + 0.03;
  for (let i = 0; i < ridges; i++) { prof.push([rr, y + p * 0.5], [r, y + p]); y += p; }
  prof.push([r, 0], [0, 0]);
  return revolve(prof, { segments: seg, steps: 1, creaseDeg: 22 });
}

/** Screw with a washer under it (one geometry per site; used for rim and flange hardware). */
export function screwWithWasher(r = 0.11, h = 0.08, { washerR = 1.5, washerH = 0.035, seg = 12 } = {}) {
  const w = washer(r * 0.45, r * washerR, washerH, 0, Math.max(12, seg + 4));
  const s = capScrew(r, h, { seg });
  s.translate(0, washerH * 0.9, 0);
  return merge([w, s]);
}

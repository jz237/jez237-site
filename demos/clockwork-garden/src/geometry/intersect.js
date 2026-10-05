// Exact intersection of triangle parts (leaves, fronds, petals): a part is
// { P: Float32Array of world positions, T: triangle indices, S: per-triangle
// distance along the part from its stalk (0..1), box: [min xyz, max xyz] }.
// Two parts cross when an edge of one passes through a triangle of the other.
// `skip` ignores triangles near both stalks (parts tied on at one point).
export function segTri(P, i, j, Q, a, b, c) {
  const px = P[i * 3], py = P[i * 3 + 1], pz = P[i * 3 + 2];
  const dx = P[j * 3] - px, dy = P[j * 3 + 1] - py, dz = P[j * 3 + 2] - pz;
  const ax = Q[a * 3], ay = Q[a * 3 + 1], az = Q[a * 3 + 2];
  const e1x = Q[b * 3] - ax, e1y = Q[b * 3 + 1] - ay, e1z = Q[b * 3 + 2] - az;
  const e2x = Q[c * 3] - ax, e2y = Q[c * 3 + 1] - ay, e2z = Q[c * 3 + 2] - az;
  const hx = dy * e2z - dz * e2y, hy = dz * e2x - dx * e2z, hz = dx * e2y - dy * e2x;
  const det = e1x * hx + e1y * hy + e1z * hz;
  if (det > -1e-12 && det < 1e-12) return false;
  const inv = 1 / det;
  const sx = px - ax, sy = py - ay, sz = pz - az;
  const u = (sx * hx + sy * hy + sz * hz) * inv;
  if (u < 0 || u > 1) return false;
  const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x;
  const v = (dx * qx + dy * qy + dz * qz) * inv;
  if (v < 0 || u + v > 1) return false;
  const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
  return t > 1e-4 && t < 1 - 1e-4;
}
function triBox(P, T, t, out) {
  const a = T[t * 3] * 3, b = T[t * 3 + 1] * 3, c = T[t * 3 + 2] * 3;
  for (let k = 0; k < 3; k++) {
    out[k] = Math.min(P[a + k], P[b + k], P[c + k]);
    out[k + 3] = Math.max(P[a + k], P[b + k], P[c + k]);
  }
  return out;
}
export const boxHit = (a, b, m = 0) => a[0] <= b[3] + m && a[3] >= b[0] - m && a[1] <= b[4] + m && a[4] >= b[1] - m && a[2] <= b[5] + m && a[5] >= b[2] - m;
const _ba = new Float32Array(6), _bb = new Float32Array(6), _ov = new Float32Array(6);
const _ta = new Int32Array(4096), _tb = new Int32Array(4096);
// do parts A and B cross? (margin: treat boxes this close as touching)
// per-triangle boxes of a part (computed once)
function triBoxes(A) {
  if (A.TB) return A.TB;
  const n = A.T.length / 3, TB = new Float32Array(n * 6), P = A.P, T = A.T;
  for (let t = 0; t < n; t++) {
    const a = T[t * 3] * 3, b = T[t * 3 + 1] * 3, c = T[t * 3 + 2] * 3;
    for (let k = 0; k < 3; k++) {
      const x = P[a + k], y = P[b + k], z = P[c + k];
      TB[t * 6 + k] = x < y ? (x < z ? x : z) : (y < z ? y : z);
      TB[t * 6 + 3 + k] = x > y ? (x > z ? x : z) : (y > z ? y : z);
    }
  }
  return (A.TB = TB);
}
const tbHit = (TB, t, b, m) => TB[t * 6] <= b[3] + m && TB[t * 6 + 3] >= b[0] - m && TB[t * 6 + 1] <= b[4] + m && TB[t * 6 + 4] >= b[1] - m && TB[t * 6 + 2] <= b[5] + m && TB[t * 6 + 5] >= b[2] - m;
const tbtb = (A, x, B, y, m) => A[x * 6] <= B[y * 6 + 3] + m && A[x * 6 + 3] >= B[y * 6] - m && A[x * 6 + 1] <= B[y * 6 + 4] + m && A[x * 6 + 4] >= B[y * 6 + 1] - m && A[x * 6 + 2] <= B[y * 6 + 5] + m && A[x * 6 + 5] >= B[y * 6 + 2] - m;
export function partsCross(A, B, skip = 0) {
  const ov = _ov;
  for (let c = 0; c < 3; c++) { ov[c] = Math.max(A.box[c], B.box[c]); ov[c + 3] = Math.min(A.box[c + 3], B.box[c + 3]); }
  let na = 0, nb = 0;
  const nA = A.T.length / 3, nB = B.T.length / 3;
  const TA = triBoxes(A), TBb = triBoxes(B);
  for (let t = 0; t < nA; t++) if (A.S[t] >= skip && tbHit(TA, t, ov, 0.02)) _ta[na++] = t;
  if (!na) return false;
  for (let t = 0; t < nB; t++) if (B.S[t] >= skip && tbHit(TBb, t, ov, 0.02)) _tb[nb++] = t;
  if (!nb) return false;
  for (let ia = 0; ia < na; ia++) {
    const x = _ta[ia];
    const a0 = A.T[x * 3], a1 = A.T[x * 3 + 1], a2 = A.T[x * 3 + 2];
    for (let ib = 0; ib < nb; ib++) {
      const y = _tb[ib];
      if (!tbtb(TA, x, TBb, y, 0.02)) continue;
      const b0 = B.T[y * 3], b1 = B.T[y * 3 + 1], b2 = B.T[y * 3 + 2];
      if (segTri(A.P, a0, a1, B.P, b0, b1, b2) || segTri(A.P, a1, a2, B.P, b0, b1, b2) || segTri(A.P, a2, a0, B.P, b0, b1, b2)
        || segTri(B.P, b0, b1, A.P, a0, a1, a2) || segTri(B.P, b1, b2, A.P, a0, a1, a2) || segTri(B.P, b2, b0, A.P, a0, a1, a2)) return true;
    }
  }
  return false;
}
export function partBox(P) {
  const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9];
  for (let i = 0; i < P.length; i += 3) for (let c = 0; c < 3; c++) { if (P[i + c] < b[c]) b[c] = P[i + c]; if (P[i + c] > b[c + 3]) b[c + 3] = P[i + c]; }
  return b;
}


// the front-face triangles of a (two-sided) leaf geometry as a part in its own
// coordinates; the back face carries a negative flutter weight (shapes.js)
export function geometryPart(geo) {
  const pos = geo.attributes.position, W = geo.attributes.aSwayW, uv = geo.attributes.uv;
  const idx = geo.index ? geo.index.array : null;
  const n = idx ? idx.length : pos.count;
  const front = (v) => { if (!W) return true; const y = W.getY(v); return !(y < 0 || Object.is(y, -0)); };
  const map = new Map(), P = [], T = [], S = [];
  for (let t = 0; t < n; t += 3) {
    const a = idx ? idx[t] : t, b = idx ? idx[t + 1] : t + 1, c = idx ? idx[t + 2] : t + 2;
    if (!front(a) || !front(b) || !front(c)) continue;
    for (const v of [a, b, c]) {
      if (!map.has(v)) { map.set(v, P.length / 3); P.push(pos.getX(v), pos.getY(v), pos.getZ(v)); }
      T.push(map.get(v));
    }
    S.push(uv ? Math.min(uv.getX(a), uv.getX(b), uv.getX(c)) : 0.5);
  }
  const Pf = new Float32Array(P);
  return { P: Pf, T: new Uint32Array(T), S: new Float32Array(S), box: partBox(Pf) };
}

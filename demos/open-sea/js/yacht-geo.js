// Procedural 11.5 m cruising sloop. Local axes: +x bow, +y up, +z starboard, origin at the waterline amidships.
// Vertex: position(3) normal(3) attr(4: u, v, material, extra)
export const MAT = { HULL: 0, DECK: 1, CABIN: 2, GLASS: 3, TEAK: 4, ALU: 5, SAIL: 6, STEEL: 7, ROPE: 8, KEEL: 9, TRIM: 10 };
export const DIM = { LOA: 11.5, BEAM: 3.8, MAST_X: 1.35, MAST_H: 15.2, BOOM_H: 1.55, BOOM_LEN: 4.7, DECK_H: 1.0 };

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ---- hull functions --------------------------------------------------------------------------
export const sheer = x => (x >= 0 ? 0.98 + 0.0058 * x * x : 0.98 + 0.0016 * x * x);
const keelLine = x => -0.46 * Math.pow(Math.max(0, 1 - Math.pow(x / 6.0, 2)), 0.62) + 0.06 * sstep(3.5, 5.8, x) + 0.08 * sstep(-3, -5.6, x);
export function halfBeam(x) {
  const B = DIM.BEAM / 2, x0 = -0.5;
  if (x >= x0) { const t = clamp((x - x0) / (5.75 - x0), 0, 1); return B * Math.pow(Math.max(0, 1 - Math.pow(t, 2.1)), 0.72); }
  const t = clamp((x0 - x) / (x0 + 5.75), 0, 1);
  return B * (1 - 0.30 * Math.pow(t, 2.3));
}
// waterline half-breadth (used for the contact-foam distance field)
export function waterlineHalfBeam(x, draftRatio = 0.86) {
  return halfBeam(x) * draftRatio * (x > 4.5 ? 0.9 : 1);
}
export function hullPoint(x, v, side = 1) {
  const yb = keelLine(x), hs = sheer(x);
  const b = halfBeam(x);
  const vv = Math.pow(v, 0.82);
  let w = b * Math.pow(Math.sin(vv * Math.PI / 2), 0.55);
  w *= 1 + 0.10 * sstep(3, 5.7, x) * v * v;              // bow flare
  return [x, yb + (hs - yb) * v, side * w];
}

class Builder {
  constructor() { this.v = []; this.i = []; }
  get count() { return this.v.length / 10; }
  push(p, n, a) { this.v.push(p[0], p[1], p[2], n[0], n[1], n[2], a[0], a[1], a[2], a[3]); return this.count - 1; }
  // parametric surface, u in [0,1] (nu segments), v in [0,1] (nv segments); flip reverses winding
  grid(fn, nu, nv, mat, flip = false, extra = 0) {
    const base = this.count;
    const P = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) P.push(fn(i / nu, j / nv));
    const at = (i, j) => P[clamp(j, 0, nv) * (nu + 1) + clamp(i, 0, nu)];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const p = at(i, j), du = sub(at(i + 1, j), at(i - 1, j)), dv = sub(at(i, j + 1), at(i, j - 1));
      let n = norm(cross(du, dv));
      if (flip) n = [-n[0], -n[1], -n[2]];
      this.push(p, n, [i / nu, j / nv, mat, extra]);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = base + j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
      if (flip) this.i.push(a, b, c, b, d, c); else this.i.push(a, c, b, b, c, d);
    }
  }
  // tapered tube along a segment
  tube(p0, p1, r0, r1, mat, seg = 10, capEnds = false, flatten = 1) {
    const d = norm(sub(p1, p0));
    let up = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    const s = norm(cross(d, up)), u = cross(s, d);
    this.grid((a, b) => {
      const ang = a * Math.PI * 2;
      const r = r0 + (r1 - r0) * b;
      const c = Math.cos(ang), sn = Math.sin(ang);
      const q = [p0[0] + (p1[0] - p0[0]) * b, p0[1] + (p1[1] - p0[1]) * b, p0[2] + (p1[2] - p0[2]) * b];
      return [q[0] + r * (c * s[0] * flatten + sn * u[0]), q[1] + r * (c * s[1] * flatten + sn * u[1]), q[2] + r * (c * s[2] * flatten + sn * u[2])];
    }, seg, 1, mat, true);
  }
  box(c, h, mat) { // axis-aligned box, half extents h
    const f = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    for (const n of f) {
      const t1 = Math.abs(n[1]) > 0.5 ? [1, 0, 0] : [0, 1, 0], t2 = cross(n, t1), t1b = cross(t2, n);
      const base = this.count;
      for (const [su, sv] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const p = [c[0] + h[0] * (n[0] + su * Math.abs(t1b[0]) + sv * Math.abs(t2[0])), c[1] + h[1] * (n[1] + su * Math.abs(t1b[1]) + sv * Math.abs(t2[1])), c[2] + h[2] * (n[2] + su * Math.abs(t1b[2]) + sv * Math.abs(t2[2]))];
        this.push(p, n, [(su + 1) / 2, (sv + 1) / 2, mat, 0]);
      }
      this.i.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// Sail definitions (local coordinates, main is defined for the boom pointing aft along -x from the mast)
export const SAILS = {
  main: {
    tack: [DIM.MAST_X + 0.12, DIM.DECK_H + DIM.BOOM_H, 0],
    head: [DIM.MAST_X + 0.10, DIM.DECK_H + DIM.MAST_H - 0.6, 0],
    clew: [DIM.MAST_X - DIM.BOOM_LEN, DIM.DECK_H + DIM.BOOM_H + 0.12, 0],
    roach: 0.55, draft: 0.60,
  },
  jib: {
    tack: [5.05, DIM.DECK_H + 0.55, 0],
    head: [DIM.MAST_X + 0.28, DIM.DECK_H + DIM.MAST_H - 1.9, 0],
    clew: [-0.15, DIM.DECK_H + 1.15, 0],
    roach: 0.18, draft: 0.52,
  },
};

export function buildYacht() {
  const B = new Builder();
  const hullEnd = { verts: 0, idx: 0 };
  // hull (both sides)
  for (const side of [1, -1]) {
    B.grid((u, v) => hullPoint(-5.75 + u * 11.5, v, side), 56, 22, MAT.HULL, side < 0);
  }
  // transom and bow closure via extending a small centre-line strip
  B.grid((u, v) => { const x = -5.75; const p1 = hullPoint(x, v, 1), p2 = hullPoint(x, v, -1); return [x, p1[1], p1[2] + (p2[2] - p1[2]) * u]; }, 12, 10, MAT.HULL, true);
  // deck
  B.grid((u, v) => {
    const x = -5.75 + u * 11.5, b = halfBeam(x) * 0.985;
    const y = (v * 2 - 1) * b;
    return [x, sheer(x) - 0.025 + 0.085 * (1 - Math.pow(y / Math.max(b, 0.05), 2)), y];
  }, 56, 20, MAT.DECK);
  // toe rail (slim strip along the sheer)
  for (const side of [1, -1]) {
    B.grid((u, v) => { const x = -5.7 + u * 11.4, b = halfBeam(x) * (0.985 - v * 0.03); return [x, sheer(x) + 0.03 + 0.05 * (1 - v), side * b]; }, 56, 2, MAT.TEAK, side < 0);
  }
  // coachroof (cabin house)
  const cabin = (u, v) => {
    // u along length -1.9..2.6, v around the section (0 port deck, .25 port top, .75 stbd top, 1 stbd deck)
    const x = -1.9 + u * 4.5;
    const h = 0.34 + 0.20 * sstep(0, 0.85, u) - 0.50 * sstep(0.86, 1, u);
    const w0 = 1.25 - 0.55 * sstep(0.55, 1, u), w1 = w0 * 0.62;
    const a = v * Math.PI;
    // half-ellipse-ish section: base width w0 -> top width w1 with crowned roof
    const t = v * 2 - 1; // -1 port .. 1 starboard
    let y, z;
    if (Math.abs(t) < 0.999) {
      const s = Math.abs(t), k = clamp(s * 1.0, 0, 1);
      z = t * (w1 + (w0 - w1) * Math.pow(k, 4));
      y = Math.max(0, h * (1 - 0.45 * Math.pow(k, 2.2)) + 0.05 * (1 - k * k));
    } else { z = Math.sign(t) * w0; y = 0; }
    return [x, sheer(x) + 0.04 + y, z];
  };
  B.grid((u, v) => cabin(u, v), 32, 20, MAT.CABIN, false);
  // cabin front and rear closures kept implicit (roof slopes to the deck at the front, cockpit bulkhead at the rear)
  B.grid((u, v) => { const p = cabin(0, v); return [p[0], sheer(p[0]) + 0.04 + (p[1] - sheer(p[0]) - 0.04) * (1 - u), p[2]]; }, 4, 20, MAT.CABIN, true);
  // hatch on the foredeck + companionway
  B.box([3.2, 1.28, 0], [0.32, 0.03, 0.42], MAT.CABIN);
  B.box([-1.95, 1.55, 0], [0.04, 0.45, 0.55], MAT.TRIM);
  // cockpit: teak sole, coamings and seats
  B.box([-3.75, 0.62, 0], [1.6, 0.03, 0.88], MAT.TEAK);
  for (const s of [1, -1]) {
    B.box([-3.7, 0.95, s * 1.02], [1.75, 0.16, 0.12], MAT.TEAK);
    B.box([-3.6, 0.78, s * 0.78], [1.3, 0.05, 0.34], MAT.TEAK);
  }
  B.box([-5.35, 0.9, 0], [0.05, 0.25, 0.95], MAT.TRIM);
  // helm pedestal + wheel
  B.tube([-4.25, 0.62, 0], [-4.25, 1.5, 0], 0.06, 0.05, MAT.STEEL, 8);
  {
    const R = 0.42, cx = [-4.25, 1.62, 0];
    B.grid((a, b) => {
      const ang = a * Math.PI * 2, t = b * Math.PI * 2, r = 0.022;
      const rr = R + r * Math.cos(t);
      return [cx[0] - 0.10 + r * Math.sin(t) * 0.2, cx[1] + rr * Math.sin(ang), cx[2] + rr * Math.cos(ang)];
    }, 28, 6, MAT.TRIM, true);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; B.tube([cx[0] - 0.1, cx[1], cx[2]], [cx[0] - 0.1, cx[1] + R * Math.sin(a), cx[2] + R * Math.cos(a)], 0.012, 0.012, MAT.STEEL, 5); }
  }
  // mast, boom, spreaders
  const mx = DIM.MAST_X, dh = DIM.DECK_H;
  B.tube([mx, dh, 0], [mx, dh + DIM.MAST_H, 0], 0.085, 0.045, MAT.ALU, 14, false, 1.25);
  for (const [h, len] of [[5.6, 1.15], [10.3, 0.85]]) for (const s of [1, -1]) B.tube([mx, dh + h, 0], [mx - 0.1, dh + h + 0.08, s * len], 0.018, 0.012, MAT.ALU, 6);
  B.tube([mx + 0.05, dh + DIM.MAST_H - 0.05, 0], [mx + 0.35, dh + DIM.MAST_H + 0.02, 0], 0.03, 0.02, MAT.STEEL, 6);
  // bow roller / pulpit stanchions & pushpit
  for (let k = 0; k < 9; k++) for (const s of [1, -1]) {
    const x = -4.6 + k * 1.1, b = halfBeam(x) * 0.93, y = sheer(x) + 0.09;
    B.tube([x, y, s * b], [x, y + 0.72, s * b], 0.013, 0.013, MAT.STEEL, 5);
  }
  // keel + bulb, rudder
  B.grid((u, v) => {
    const z = -0.36 - v * 1.52;                    // downward
    const chord = 2.2 - 1.15 * v, xr = -0.35 + 0.55 * v;
    const t = u * 2 - 1, half = 0.05 * (1 - 0.5 * v);
    const xx = xr + t * chord / 2;
    const thick = half * Math.sqrt(Math.max(0, 1 - t * t));
    return [xx, z, 0.001 + thick * 1.0];
  }, 12, 10, MAT.KEEL);
  B.grid((u, v) => { const z = -0.36 - v * 1.52; const chord = 2.2 - 1.15 * v, xr = -0.35 + 0.55 * v, t = u * 2 - 1; const half = 0.05 * (1 - 0.5 * v); return [xr + t * chord / 2, z, -0.001 - half * Math.sqrt(Math.max(0, 1 - t * t))]; }, 12, 10, MAT.KEEL, true);
  B.grid((u, v) => { const a = u * Math.PI * 2, b = v * Math.PI; return [0.05 + 0.55 * Math.cos(b), -1.9 + 0.13 * Math.sin(b) * Math.cos(a), 0.13 * Math.sin(b) * Math.sin(a)]; }, 16, 10, MAT.KEEL, true);
  for (const s of [1, -1]) B.grid((u, v) => { const z = 0.10 - v * 1.62; const c = 0.55 - 0.15 * v, xr = -3.95 - 0.12 * v, t = u * 2 - 1; return [xr + t * c / 2, z, s * (0.001 + 0.03 * Math.sqrt(Math.max(0, 1 - t * t)))]; }, 8, 8, MAT.KEEL, s < 0);

  // Sails are separate buffers: their geometry is bent in the vertex shader.
  const mesh = { verts: new Float32Array(B.v), idx: new Uint32Array(B.i) };

  const sailMesh = (S, mat, nu, nv) => {
    const S2 = new Builder();
    // in sail space: y up, x along foot (aft negative), draft in +z (bulge to the side, mirrored by shader)
    const T = S.tack, H = S.head, C = S.clew;
    S2.grid((u, v) => {
      // luff runs tack->head, leech runs clew->head with roach; u across
      const luff = [T[0] + (H[0] - T[0]) * v, T[1] + (H[1] - T[1]) * v];
      const leechBase = [C[0] + (H[0] - C[0]) * v, C[1] + (H[1] - C[1]) * v];
      const bulge = S.roach * Math.sin(Math.PI * Math.pow(v, 0.9)) * (1 - v * 0.2);
      const leech = [leechBase[0] - bulge * Math.sign(H[0] - C[0] || 1) * (S === SAILS.main ? 1 : 0.6), leechBase[1]];
      const x = luff[0] + (leech[0] - luff[0]) * u, y = luff[1] + (leech[1] - luff[1]) * u;
      const dp = S.draft * Math.sin(Math.PI * Math.pow(u, 0.85)) * Math.pow(1 - v, 0.55) * (S === SAILS.main ? 1 : 1.1) * (Math.hypot(leech[0] - luff[0], leech[1] - luff[1]) / 4);
      return [x, y, dp];
    }, nu, nv, mat, false);
    return { verts: new Float32Array(S2.v), idx: new Uint32Array(S2.i) };
  };
  const BB = new Builder();
  BB.tube([DIM.MAST_X + 0.02, DIM.DECK_H + DIM.BOOM_H, 0], [DIM.MAST_X - DIM.BOOM_LEN, DIM.DECK_H + DIM.BOOM_H + 0.10, 0], 0.06, 0.048, MAT.ALU, 10, false, 1);
  // gooseneck and clew fittings
  BB.box([DIM.MAST_X + 0.02, DIM.DECK_H + DIM.BOOM_H, 0], [0.09, 0.07, 0.07], MAT.STEEL);
  BB.box([DIM.MAST_X - DIM.BOOM_LEN, DIM.DECK_H + DIM.BOOM_H + 0.10, 0], [0.06, 0.06, 0.06], MAT.STEEL);
  return { hull: mesh, main: sailMesh(SAILS.main, MAT.SAIL, 36, 44), jib: sailMesh(SAILS.jib, MAT.SAIL, 32, 40),
    boom: { verts: new Float32Array(BB.v), idx: new Uint32Array(BB.i) } };
}

// Rigging lines (local coordinates): [x0,y0,z0,x1,y1,z1,width]
export function buildRigging() {
  const L = [];
  const mx = DIM.MAST_X, dh = DIM.DECK_H, top = dh + DIM.MAST_H;
  const add = (a, b, w) => L.push(...a, ...b, w);
  add([5.25, dh + 0.35, 0], [mx + 0.05, top - 1.8, 0], 0.016);        // forestay
  add([mx + 0.32, top, 0], [-5.55, dh + 0.15, 0], 0.015);            // backstay
  for (const s of [1, -1]) {
    add([mx + 0.02, top - 2.0, 0], [mx + 0.05, dh + 0.1, s * 1.72], 0.014);     // cap shroud
    add([mx, dh + 5.6, s * 1.15], [mx - 0.25, dh + 0.1, s * 1.72], 0.008);      // lower
    add([mx, dh + 10.3, s * 0.85], [mx, dh + 5.6, s * 1.15], 0.006);
    add([mx, dh + 5.6, 0], [mx, dh + 5.6, s * 1.15], 0.006);
    add([mx + 0.02, top - 1.9, 0], [mx, dh + 10.3, s * 0.85], 0.006);
  }
  // lifelines
  for (const s of [1, -1]) for (const h of [0.42, 0.74]) {
    let prev = null;
    for (let x = -4.6; x <= 4.61; x += 0.55) {
      const b = halfBeam(x) * 0.93, p = [x, sheer(x) + 0.09 + h, s * b];
      if (prev) add(prev, p, 0.009);
      prev = p;
    }
  }
  return new Float32Array(L);
}

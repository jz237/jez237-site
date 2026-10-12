// The planting, built for detail: every plant is many small parts, not a few big leaves. A frond is a
// stem carrying pairs of separate leaflets, each its own small tilted card (so fronds have depth and
// catch the light leaflet by leaflet); monkey-puzzle trees are tiers of whorled branches clothed in
// scale-leaved branchlets; ginkgos carry clusters of little fan leaves; vines hang from the tree-fern
// crowns, strung with small leaves; moss tufts the trunk feet. Leaf shapes come from an atlas painted
// once at load; cards use alpha-to-coverage, so edges stay soft and stable rather than shimmering.
import { BufferGeometry, BufferAttribute, CanvasTexture, SRGBColorSpace, Vector3, Color } from 'three';

// heights at scale 1, matching the planting they replace (world units)
export const BASE_H = { fern: 0.106, fernlet: 0.062, redplant: 0.057, horsetail: 0.26, cycad: 0.392, treefern: 0.945, araucaria: 1.0, ginkgo: 0.85 };

// atlas cells (4 x 4 grid)
export const CELL = {
  fernPinna: 0, treePinna: 1, cycadLeaf: 2, strap: 3, horsetail: 4, ginkgo: 5, araucaria: 6, vineLeaf: 7,
  moss: 8, stem: 9, fiddle: 10, fernPinnaB: 11,
};
const GRID = 4;

// ------------------------------------------------------------------ the atlas
export function frondAtlas(size = 2048) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const h = size / GRID; // cell size in px
  const rnd = mulberry(7);
  // cell i: column i % GRID, row from the bottom (uv v up; canvas y down)
  const at = (i) => ({ x: (i % GRID) * h, y: size - (Math.floor(i / GRID) + 1) * h });
  const hex = (s) => s;

  // a leaflet: base at the bottom middle of the cell, tip at the top; lobed edge, midrib, side veins
  const leaflet = (i, { base, tip, vein, lobes = 0, width = 0.22, shape = 1 }) => {
    const { x, y } = at(i);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + 6, L = y0 - y1;
    const grd = g.createLinearGradient(0, y0, 0, y1);
    grd.addColorStop(0, base);
    grd.addColorStop(1, tip);
    g.fillStyle = grd;
    g.beginPath();
    const N = 48;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      // width along the leaflet: rounded at the base, tapering to a point
      let w = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.04)), shape) * width * h * (1 - 0.35 * t);
      if (lobes) w *= 0.78 + 0.22 * Math.abs(Math.sin(t * Math.PI * lobes));
      pts.push([cx + w, y0 - L * t]);
    }
    g.moveTo(cx, y0);
    for (const [px, py] of pts) g.lineTo(px, py);
    for (let k = pts.length - 1; k >= 0; k--) g.lineTo(2 * cx - pts[k][0], pts[k][1]);
    g.closePath();
    g.fill();
    g.strokeStyle = vein;
    g.lineWidth = Math.max(1.5, h * 0.012);
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1 + L * 0.05);
    g.stroke();
    g.lineWidth = Math.max(1, h * 0.005);
    for (let k = 1; k < 9; k++) {
      const t = k / 10, yy = y0 - L * t;
      const w = Math.sin(Math.PI * t) * width * h * 0.75;
      for (const s of [-1, 1]) {
        g.beginPath();
        g.moveTo(cx, yy);
        g.lineTo(cx + s * w, yy - L * 0.06);
        g.stroke();
      }
    }
  };

  leaflet(CELL.fernPinna, { base: '#3f7a26', tip: '#9fca58', vein: 'rgba(210,240,150,0.55)', lobes: 7, width: 0.2 });
  leaflet(CELL.fernPinnaB, { base: '#2f6a2a', tip: '#7fb64a', vein: 'rgba(200,235,150,0.5)', lobes: 9, width: 0.18 });
  leaflet(CELL.treePinna, { base: '#3a6e24', tip: '#8cbc4c', vein: 'rgba(200,230,140,0.5)', lobes: 12, width: 0.12, shape: 0.7 });
  leaflet(CELL.cycadLeaf, { base: '#24481a', tip: '#4f7d2c', vein: 'rgba(150,190,100,0.6)', width: 0.08, shape: 0.5 });
  leaflet(CELL.vineLeaf, { base: '#2d6324', tip: '#6aa043', vein: 'rgba(190,230,140,0.5)', width: 0.34, shape: 0.9 });

  // strap leaf (red bromeliad)
  {
    const { x, y } = at(CELL.strap);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + 6, w = h * 0.12;
    const grd = g.createLinearGradient(0, y0, 0, y1);
    grd.addColorStop(0, '#5a1410');
    grd.addColorStop(0.35, '#b8261c');
    grd.addColorStop(0.8, '#d8432a');
    grd.addColorStop(1, '#e8703c');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(cx - w * 0.6, y0);
    g.bezierCurveTo(cx - w, y0 - h * 0.4, cx - w * 0.6, y1 + h * 0.2, cx, y1);
    g.bezierCurveTo(cx + w * 0.6, y1 + h * 0.2, cx + w, y0 - h * 0.4, cx + w * 0.6, y0);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(255,200,150,0.35)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1 + 16);
    g.stroke();
  }
  // horsetail: jointed stem with whorls of needles
  {
    const { x, y } = at(CELL.horsetail);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + 6, nodes = 10;
    for (let i = 1; i < nodes; i++) {
      const yy = y0 + ((y1 - y0) * i) / nodes, L = h * 0.2 * (1 - i / nodes) + h * 0.05;
      g.strokeStyle = mixHex('#3f6a28', '#86a84a', i / nodes);
      g.lineWidth = 1.6;
      for (let k = -5; k <= 5; k++) {
        if (!k) continue;
        g.beginPath();
        g.moveTo(cx, yy);
        g.lineTo(cx + k * L * 0.18, yy - L * (0.55 + Math.abs(k) * 0.04));
        g.stroke();
      }
    }
    g.strokeStyle = '#4f7a30';
    g.lineWidth = h * 0.03;
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1);
    g.stroke();
    g.fillStyle = '#26381a';
    for (let i = 1; i < nodes; i++) g.fillRect(cx - h * 0.02, y0 + ((y1 - y0) * i) / nodes - 2, h * 0.04, 4);
  }
  // ginkgo fan leaf: notched fan with radiating veins on a short stalk
  {
    const { x, y } = at(CELL.ginkgo);
    const cx = x + h / 2, by = y + h - 6, r = h * 0.44;
    g.strokeStyle = '#5a6a2a';
    g.lineWidth = h * 0.012;
    g.beginPath();
    g.moveTo(cx, by);
    g.lineTo(cx, by - h * 0.35);
    g.stroke();
    const fy = by - h * 0.32;
    const grd = g.createRadialGradient(cx, fy, 0, cx, fy, r);
    grd.addColorStop(0, '#5f8a2a');
    grd.addColorStop(1, '#a9c454');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(cx, fy);
    g.arc(cx, fy, r, -Math.PI * 0.92, -Math.PI * 0.53);
    g.lineTo(cx, fy - r * 0.62); // the notch
    g.arc(cx, fy, r, -Math.PI * 0.47, -Math.PI * 0.08);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(220,240,160,0.35)';
    g.lineWidth = 1;
    for (let k = 0; k <= 18; k++) {
      const a = -Math.PI * 0.92 + (k / 18) * Math.PI * 0.84;
      g.beginPath();
      g.moveTo(cx, fy);
      g.lineTo(cx + Math.cos(a) * r * 0.97, fy + Math.sin(a) * r * 0.97);
      g.stroke();
    }
  }
  // araucaria branchlet: a stem densely shingled with small triangular scale-leaves
  {
    const { x, y } = at(CELL.araucaria);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + 8;
    g.strokeStyle = '#3a4a20';
    g.lineWidth = h * 0.03;
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1);
    g.stroke();
    const n = 34;
    for (let i = 0; i < n; i++) {
      const t = i / n, yy = y0 + (y1 - y0) * t, w = h * (0.13 - 0.06 * t);
      for (const s of [-1, 1]) {
        g.fillStyle = mixHex('#1f4a1c', '#4f7a30', 0.3 + 0.7 * rnd());
        g.beginPath();
        g.moveTo(cx, yy + 6);
        g.lineTo(cx + s * w, yy - w * 0.9);
        g.lineTo(cx + s * w * 0.25, yy - w * 0.25);
        g.closePath();
        g.fill();
      }
      g.fillStyle = mixHex('#2a5a20', '#5f8a3a', rnd());
      g.beginPath();
      g.moveTo(cx - w * 0.2, yy + 4);
      g.lineTo(cx, yy - w * 1.1);
      g.lineTo(cx + w * 0.2, yy + 4);
      g.closePath();
      g.fill();
    }
  }
  // moss tuft: a dome of fine upright strands
  {
    const { x, y } = at(CELL.moss);
    const cx = x + h / 2, by = y + h - 4;
    for (let k = 0; k < 260; k++) {
      const a = (rnd() - 0.5) * 2.4, L = h * (0.25 + rnd() * 0.55) * Math.cos(a * 0.6);
      g.strokeStyle = mixHex('#2e5a1c', '#9bc24a', rnd());
      g.lineWidth = 1 + rnd() * 1.5;
      g.beginPath();
      g.moveTo(cx + a * h * 0.12, by);
      g.quadraticCurveTo(cx + a * h * 0.3, by - L * 0.6, cx + a * h * 0.42, by - L);
      g.stroke();
    }
  }
  // stem strip: a thin rachis, slightly darker edges
  {
    const { x, y } = at(CELL.stem);
    const grd = g.createLinearGradient(x + h * 0.4, 0, x + h * 0.6, 0);
    grd.addColorStop(0, '#4f7a2c');
    grd.addColorStop(0.5, '#a2c25e');
    grd.addColorStop(1, '#4f7a2c');
    g.fillStyle = grd;
    g.fillRect(x + h * 0.4, y + 2, h * 0.2, h - 4);
  }
  // fiddlehead: a young coiled frond
  {
    const { x, y } = at(CELL.fiddle);
    const cx = x + h / 2, by = y + h - 6;
    g.strokeStyle = '#7a8a3a';
    g.lineWidth = h * 0.05;
    g.beginPath();
    g.moveTo(cx, by);
    g.lineTo(cx, by - h * 0.45);
    for (let k = 0; k < 60; k++) {
      const a = k * 0.18, r = h * 0.18 * (1 - k / 70);
      g.lineTo(cx + Math.sin(a) * r, by - h * 0.62 + Math.cos(a) * r * -1 + h * 0.0);
    }
    g.stroke();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function cellUV(i) {
  const s = 1 / GRID, u0 = (i % GRID) * s, v0 = Math.floor(i / GRID) * s, e = 0.004;
  return { u0: u0 + e, u1: u0 + s - e, v0: v0 + e, v1: v0 + s - e };
}

// ------------------------------------------------------------------ geometry
// position, normal, uv, color (rgb: albedo tint for trunks, ambient occlusion for leaves),
// aT (bend share: 0 root .. 1 top), aPh (flutter phase), aTrunk (1 = bark/vertex-coloured)
const UPV = new Vector3(0, 1, 0);

class Builder {
  constructor() {
    this.p = [];
    this.n = [];
    this.uv = [];
    this.c = [];
    this.t = [];
    this.ph = [];
    this.tr = [];
    this.idx = [];
  }

  vert(p, n, u, v, col, t, ph, trunk = 0) {
    this.p.push(p.x, p.y, p.z);
    this.n.push(n.x, n.y, n.z);
    this.uv.push(u, v);
    if (typeof col === 'number') this.c.push(col, col, col);
    else this.c.push(col.r, col.g, col.b);
    this.t.push(t);
    this.ph.push(ph);
    this.tr.push(trunk);
    return this.p.length / 3 - 1;
  }

  // one small leaf card: base at p, pointing along `dir`, its face across `side`
  card(p, dir, side, len, wid, cell, ao, t, ph, tipT = t) {
    const { u0, u1, v0, v1 } = cellUV(cell);
    const n = new Vector3().crossVectors(side, dir).normalize();
    if (n.y < 0) n.negate();
    n.lerp(UPV, 0.3).normalize();
    const hw = wid * 0.5;
    const tip = p.clone().addScaledVector(dir, len);
    const a = this.vert(p.clone().addScaledVector(side, -hw), n, u0, v0, ao, t, ph);
    const b = this.vert(p.clone().addScaledVector(side, hw), n, u1, v0, ao, t, ph);
    const c = this.vert(tip.clone().addScaledVector(side, -hw), n, u0, v1, Math.min(1, ao + 0.25), tipT, ph);
    const d = this.vert(tip.clone().addScaledVector(side, hw), n, u1, v1, Math.min(1, ao + 0.25), tipT, ph);
    this.idx.push(a, b, c, b, d, c);
  }

  // A frond: a curved stem (thin strip) with pairs of leaflets along it, each a separate card angled
  // forward and a little up, longest a third of the way out, small at both ends.
  frond(base, o) {
    const { yaw, rise, droop, length, segs = 7, pairs = 12, pinna = 0.32, pinnaW = 0.3, cell = CELL.fernPinna,
      tBase = 0, tSpan = 1, aoBase = 0.5, ph = 0, rnd = Math.random, roll = 0, spread = 1.05, stemW = 0.014 } = o;
    const dir = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const side0 = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const pts = [], tans = [];
    const pos = base.clone();
    for (let i = 0; i <= segs; i++) {
      const s = i / segs, a = rise - droop * s * s;
      const tan = dir.clone().multiplyScalar(Math.cos(a)).add(new Vector3(0, Math.sin(a), 0)).normalize();
      if (i > 0) pos.addScaledVector(tan, length / segs);
      pts.push(pos.clone());
      tans.push(tan);
    }
    // the stem
    {
      const { u0, u1, v0, v1 } = cellUV(CELL.stem);
      let prev = null;
      for (let i = 0; i <= segs; i++) {
        const s = i / segs;
        const side = side0.clone().multiplyScalar(Math.cos(roll)).add(new Vector3(0, Math.sin(roll), 0));
        const w = length * stemW * (1 - 0.6 * s);
        const nrm = new Vector3().crossVectors(side, tans[i]).normalize();
        if (nrm.y < 0) nrm.negate();
        const t = tBase + tSpan * s, ao = aoBase + (1 - aoBase) * Math.min(1, s * 1.3);
        const a = this.vert(pts[i].clone().addScaledVector(side, -w), nrm, u0, v0 + (v1 - v0) * s, ao, t, ph);
        const b = this.vert(pts[i].clone().addScaledVector(side, w), nrm, u1, v0 + (v1 - v0) * s, ao, t, ph);
        if (prev) this.idx.push(prev[0], prev[1], a, prev[1], b, a);
        prev = [a, b];
      }
    }
    // the leaflets
    const curveAt = (s) => {
      const f = s * segs, i = Math.min(segs - 1, Math.floor(f)), k = f - i;
      return { p: pts[i].clone().lerp(pts[i + 1], k), tan: tans[i].clone().lerp(tans[i + 1], k).normalize() };
    };
    for (let j = 0; j < pairs; j++) {
      const s = 0.08 + (0.9 * (j + 0.5)) / pairs;
      const { p, tan } = curveAt(s);
      const sideH = new Vector3().crossVectors(UPV, tan).normalize();
      if (sideH.lengthSq() < 1e-6) sideH.copy(side0);
      const size = length * pinna * Math.pow(Math.sin(Math.PI * Math.min(1, 0.15 + s * 0.95)), 0.7) * (1.05 - 0.4 * s);
      const t = tBase + tSpan * s, ao = aoBase + (1 - aoBase) * Math.min(1, s * 1.2);
      for (const sg of [-1, 1]) {
        // out to the side, swept towards the tip, lifted a little; alternate slightly along the stem
        const out = sideH.clone().multiplyScalar(sg).multiplyScalar(Math.cos(spread * 0.6)).addScaledVector(tan, Math.sin(spread * 0.6) * 0.9);
        out.y += 0.18 + (rnd() - 0.5) * 0.1;
        out.normalize();
        const across = new Vector3().crossVectors(out, UPV).normalize();
        if (across.lengthSq() < 1e-6) across.copy(tan);
        const pp = p.clone().addScaledVector(tan, sg * size * 0.08);
        this.card(pp, out, across.lerp(UPV, 0.25 * sg).normalize(), size, size * pinnaW, cell, ao, t, ph + sg, t + tSpan * 0.06);
      }
    }
    // the tip leaflet
    const { p: tp, tan: tt } = curveAt(0.98);
    this.card(tp, tt, side0, length * pinna * 0.35, length * pinna * 0.12, cell, 1, tBase + tSpan, ph);
    return pts;
  }

  // a tapered tube (trunk or branch); colour(s, k) gives the vertex colour along / around it
  tube(points, radii, { color, sides = 7, t0 = 0, t1 = 0.6 }) {
    const n = points.length, ring = [];
    for (let i = 0; i < n; i++) {
      const p = points[i];
      const fwd = (i < n - 1 ? points[i + 1].clone().sub(p) : p.clone().sub(points[i - 1])).normalize();
      const a1 = new Vector3().crossVectors(fwd, Math.abs(fwd.y) > 0.9 ? new Vector3(1, 0, 0) : UPV).normalize();
      const a2 = new Vector3().crossVectors(fwd, a1).normalize();
      const t = t0 + (t1 - t0) * (i / (n - 1));
      const row = [];
      for (let k = 0; k <= sides; k++) {
        const a = (k / sides) * Math.PI * 2;
        const nrm = a1.clone().multiplyScalar(Math.cos(a)).addScaledVector(a2, Math.sin(a));
        row.push(this.vert(p.clone().addScaledVector(nrm, radii[i]), nrm, -1, -1, color(i / (n - 1), k / sides), t, 0, 1));
      }
      ring.push(row);
    }
    for (let i = 0; i < n - 1; i++)
      for (let k = 0; k < sides; k++) this.idx.push(ring[i][k], ring[i + 1][k], ring[i][k + 1], ring[i][k + 1], ring[i + 1][k], ring[i + 1][k + 1]);
  }

  // moss tufts around a trunk foot
  moss(center, radius, n, rnd, t = 0) {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, r = radius * (0.8 + rnd() * 0.6);
      const p = new Vector3(center.x + Math.cos(a) * r, center.y + rnd() * radius * 0.6, center.z + Math.sin(a) * r);
      const s = radius * (0.7 + rnd() * 0.6);
      const out = new Vector3(Math.cos(a) * 0.4, 1, Math.sin(a) * 0.4).normalize();
      this.card(p, out, new Vector3(-Math.sin(a), 0, Math.cos(a)), s, s * 1.1, CELL.moss, 0.6, t, rnd() * 6);
    }
  }

  build() {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(this.p), 3));
    g.setAttribute('normal', new BufferAttribute(new Float32Array(this.n), 3));
    g.setAttribute('uv', new BufferAttribute(new Float32Array(this.uv), 2));
    g.setAttribute('color', new BufferAttribute(new Float32Array(this.c), 3));
    g.setAttribute('aT', new BufferAttribute(new Float32Array(this.t), 1));
    g.setAttribute('aPh', new BufferAttribute(new Float32Array(this.ph), 1));
    g.setAttribute('aTrunk', new BufferAttribute(new Float32Array(this.tr), 1));
    g.setIndex(this.idx);
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

// bark that greens to moss towards the foot
const bark = (rnd, dark, light, mossy = 0.6) => {
  const b = new Color(), m = new Color(0.12, 0.22, 0.06);
  return (s, k) => {
    // fibrous: dark vertical fibres around the trunk, faint rings of old frond bases along it
    const fibre = 0.5 + 0.5 * Math.sin(k * 41.0 + Math.sin(s * 9) * 2);
    const ring = 0.5 + 0.5 * Math.sin(s * 70 + k * 3);
    const v = (dark + (light - dark) * (0.2 + 0.35 * fibre + 0.2 * ring)) * (0.8 + rnd() * 0.35) * 0.55;
    b.setRGB(v * 1.2, v * 0.85, v * 0.55);
    const moss = mossy * Math.max(0, 1 - s * 3.2) * (0.6 + 0.4 * Math.sin(k * 6.3 + s * 20));
    return b.clone().lerp(m, Math.max(0, moss));
  };
};

function rosette(rnd, H, { n, len, rise: [r0, r1], droop, pairs, pinna, cell, aoBase = 0.55, segs = 6 }) {
  const b = new Builder();
  const o = new Vector3();
  for (let i = 0; i < n; i++) {
    const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.7;
    const L = H * len * (0.72 + rnd() * 0.5);
    b.frond(o, { yaw, rise: r0 + (r1 - r0) * rnd(), droop: droop * (0.7 + rnd() * 0.6), length: L, segs, pairs, pinna, cell: rnd() < 0.5 ? cell : CELL.fernPinnaB, aoBase, ph: rnd() * 6.28, rnd, roll: (rnd() - 0.5) * 0.4 });
  }
  // a young fiddlehead or two in the middle
  if (H > 0.08)
    for (let i = 0; i < 2; i++) {
      const a = rnd() * 6.28;
      b.card(new Vector3(Math.cos(a) * H * 0.05, 0, Math.sin(a) * H * 0.05), new Vector3(0, 1, 0), new Vector3(Math.cos(a), 0, Math.sin(a)), H * 0.45, H * 0.25, CELL.fiddle, 0.7, 0.4, rnd() * 6);
    }
  return b;
}

export function plantGeometry(kind, variant) {
  const rnd = mulberry(1000 + variant * 97 + kind.length * 13);
  const H = BASE_H[kind];
  switch (kind) {
    case 'fern':
      return rosette(rnd, H, { n: 11 + Math.floor(rnd() * 5), len: 1.35, rise: [0.5, 1.15], droop: 1.2, pairs: 14, pinna: 0.3, cell: CELL.fernPinna }).build();
    case 'fernlet':
      return rosette(rnd, H, { n: 7 + Math.floor(rnd() * 3), len: 1.3, rise: [0.6, 1.2], droop: 1.05, pairs: 9, pinna: 0.32, cell: CELL.fernPinna, segs: 5 }).build();
    case 'redplant': {
      const b = new Builder();
      const n = 11 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.4, rise = 0.75 + rnd() * 0.6, L = H * (1.0 + rnd() * 0.5);
        const dir = new Vector3(Math.sin(yaw) * Math.cos(rise), Math.sin(rise), Math.cos(yaw) * Math.cos(rise));
        b.card(new Vector3(), dir, new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)), L, L * 0.22, CELL.strap, 0.55, 0.0, rnd() * 6, 1.0);
      }
      return b.build();
    }
    case 'horsetail': {
      const b = new Builder();
      const n = 7 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, r = rnd() * H * 0.14;
        const base = new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
        const L = H * (0.6 + rnd() * 0.5), yaw = rnd() * 6.28, tilt = (rnd() - 0.5) * 0.25;
        const up = new Vector3(Math.sin(tilt), 1, Math.cos(tilt) * 0.2).normalize();
        for (const k of [0, 1]) {
          const sd = new Vector3(Math.cos(yaw + k * Math.PI / 2), 0, -Math.sin(yaw + k * Math.PI / 2));
          b.card(base, up, sd, L, L * 0.3, CELL.horsetail, 0.6, 0.0, rnd() * 6, 1.0);
        }
      }
      return b.build();
    }
    case 'cycad': {
      const b = new Builder();
      const th = H * (0.25 + rnd() * 0.15), r = H * 0.13;
      b.tube([0, 0.33, 0.66, 1].map((s) => new Vector3(0, th * s, 0)), [r * 1.15, r, r * 0.95, r * 0.8], { color: bark(rnd, 0.28, 0.6, 0.5), t1: 0.15 });
      b.moss(new Vector3(0, 0, 0), r * 1.3, 6, rnd, 0);
      const top = new Vector3(0, th, 0);
      const n = 13 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.4;
        b.frond(top, { yaw, rise: 0.55 + rnd() * 0.5, droop: 0.45, length: H * (0.7 + rnd() * 0.3), segs: 6, pairs: 18, pinna: 0.22, pinnaW: 0.16, spread: 1.3, cell: CELL.cycadLeaf, tBase: 0.15, tSpan: 0.85, aoBase: 0.45, ph: rnd() * 6.28, rnd });
      }
      return b.build();
    }
    case 'treefern': {
      const b = new Builder();
      const th = H * 0.78, r = H * 0.045;
      const lean = (rnd() - 0.5) * 0.12, pts = [];
      for (let i = 0; i <= 8; i++) {
        const s = i / 8;
        pts.push(new Vector3(Math.sin(lean) * th * s * s, th * s, Math.cos(lean) * th * s * s * 0.3));
      }
      b.tube(pts, pts.map((_, i) => r * (1.55 - i * 0.07)), { color: bark(rnd, 0.2, 0.5, 0.8), t1: 0.75, sides: 12 });
      b.moss(new Vector3(0, 0, 0), r * 1.6, 9, rnd, 0);
      const top = pts[pts.length - 1].clone();
      const n = 15 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.35, young = i % 7 === 0;
        b.frond(top, {
          yaw, rise: young ? 1.15 : 0.35 + rnd() * 0.45, droop: young ? 0.4 : 1.6 + rnd() * 0.5, length: H * (0.52 + rnd() * 0.18) * (young ? 0.6 : 1),
          segs: 8, pairs: 22, pinna: 0.2, pinnaW: 0.2, cell: CELL.treePinna, tBase: 0.75, tSpan: 0.45, aoBase: 0.45, ph: rnd() * 6.28, rnd,
        });
      }
      return b.build();
    }
    case 'araucaria': {
      // monkey puzzle: a straight trunk; tiers of 5-7 branches, upturned at the tips, clothed in branchlets
      const b = new Builder();
      const th = H, r = H * 0.03;
      const pts = [0, 0.25, 0.5, 0.75, 1].map((s) => new Vector3(0, th * s, 0));
      b.tube(pts, [r * 1.6, r * 1.2, r * 1.0, r * 0.75, r * 0.4], { color: bark(rnd, 0.22, 0.55, 0.5), t1: 0.6, sides: 8 });
      b.moss(new Vector3(0, 0, 0), r * 2, 8, rnd, 0);
      const tiers = 7;
      for (let k = 0; k < tiers; k++) {
        const s = 0.35 + (0.62 * k) / (tiers - 1), y = th * s, nb = 5 + Math.floor(rnd() * 3);
        const reach = H * (0.42 - 0.3 * (k / (tiers - 1))) * (0.85 + rnd() * 0.3);
        for (let i = 0; i < nb; i++) {
          const a = (i / nb) * Math.PI * 2 + k * 0.6 + (rnd() - 0.5) * 0.3;
          const d = new Vector3(Math.cos(a), 0, Math.sin(a));
          const bp = [];
          for (let j = 0; j <= 4; j++) {
            const u = j / 4;
            bp.push(new Vector3(d.x * reach * u, y - reach * 0.18 * Math.sin(Math.PI * u * 0.8) + reach * 0.35 * u * u * u, d.z * reach * u));
          }
          b.tube(bp, bp.map((_, j) => r * 0.35 * (1 - j * 0.18)), { color: bark(rnd, 0.25, 0.5, 0), sides: 4, t0: s * 0.6, t1: s * 0.6 + 0.35 });
          // branchlets: two rows of upturned scale-leaved shoots along the branch, plus one at the tip
          for (let j = 1; j <= 7; j++) {
            const u = j / 8, p = bp[Math.min(3, Math.floor(u * 4))].clone().lerp(bp[Math.min(4, Math.floor(u * 4) + 1)], (u * 4) % 1);
            const along = bp[4].clone().sub(bp[0]).normalize();
            for (const sg of [-1, 1]) {
              const side = new Vector3().crossVectors(along, UPV).normalize().multiplyScalar(sg);
              const out = side.clone().multiplyScalar(0.75).addScaledVector(along, 0.45).add(new Vector3(0, 0.35, 0)).normalize();
              const L = reach * (0.42 - 0.18 * u);
              b.card(p, out, new Vector3().crossVectors(out, UPV).normalize(), L, L * 0.38, CELL.araucaria, 0.5, s * 0.6 + 0.35 * u, rnd() * 6, s * 0.6 + 0.35 * u + 0.1);
            }
          }
          const tipDir = bp[4].clone().sub(bp[3]).normalize();
          b.card(bp[4], tipDir, new Vector3().crossVectors(tipDir, UPV).normalize(), reach * 0.35, reach * 0.14, CELL.araucaria, 0.7, s * 0.6 + 0.35, rnd() * 6);
        }
      }
      // the crown tuft
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2, dir = new Vector3(Math.cos(a) * 0.5, 1, Math.sin(a) * 0.5).normalize();
        b.card(new Vector3(0, th * 0.98, 0), dir, new Vector3(-Math.sin(a), 0, Math.cos(a)), H * 0.14, H * 0.05, CELL.araucaria, 0.8, 0.95, rnd() * 6);
      }
      return b.build();
    }
    case 'ginkgo': {
      // ginkgo: a trunk forking into a few ascending limbs, each with short spurs carrying fan-leaf clusters
      const b = new Builder();
      const th = H * 0.45, r = H * 0.035;
      const trunk = [0, 0.5, 1].map((s) => new Vector3(0, th * s, 0));
      b.tube(trunk, [r * 1.5, r * 1.15, r], { color: bark(rnd, 0.3, 0.55, 0.4), t1: 0.35, sides: 8 });
      b.moss(new Vector3(0, 0, 0), r * 2, 6, rnd, 0);
      const limbs = 4 + Math.floor(rnd() * 3);
      for (let i = 0; i < limbs; i++) {
        const a = (i / limbs) * Math.PI * 2 + (rnd() - 0.5) * 0.6, up = 0.9 + rnd() * 0.4, L = H * (0.45 + rnd() * 0.2);
        const d = new Vector3(Math.cos(a) * Math.cos(up), Math.sin(up), Math.sin(a) * Math.cos(up));
        const lp = [0, 0.33, 0.66, 1].map((u) => new Vector3(0, th * 0.9, 0).addScaledVector(d, L * u).add(new Vector3(0, -L * 0.08 * u * u, 0)));
        b.tube(lp, [r * 0.8, r * 0.6, r * 0.42, r * 0.25], { color: bark(rnd, 0.3, 0.55, 0), sides: 5, t0: 0.35, t1: 0.9 });
        for (let j = 0; j < 9; j++) {
          const u = 0.25 + 0.75 * (j / 8), p = lp[0].clone().lerp(lp[3], u);
          const spurA = rnd() * 6.28;
          const centre = p.clone().add(new Vector3(Math.cos(spurA) * H * 0.04, H * 0.02, Math.sin(spurA) * H * 0.04));
          const leaves = 6 + Math.floor(rnd() * 5);
          for (let k = 0; k < leaves; k++) {
            const la = (k / leaves) * Math.PI * 2 + rnd(), tilt = 0.3 + rnd() * 0.7;
            const out = new Vector3(Math.cos(la) * Math.cos(tilt), Math.sin(tilt), Math.sin(la) * Math.cos(tilt));
            const s = H * (0.07 + rnd() * 0.03);
            b.card(centre, out, new Vector3(-Math.sin(la), 0, Math.cos(la)), s, s * 0.95, CELL.ginkgo, 0.55, 0.35 + 0.55 * u, rnd() * 6, 0.45 + 0.55 * u);
          }
        }
      }
      return b.build();
    }
  }
  return null;
}

// Vines hanging from crowns: each a sagging strand dropping from a crown point, with small leaves along
// it. Built in world space; aRoot (the anchor) stands in for the plant's base in the wind bend.
export function vineGeometry(anchors, rnd) {
  const b = new Builder();
  const roots = [];
  for (const A of anchors) {
    const L = A.drop, segs = 10;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      // a festoon: out from the crown, sagging, a lazy wave along it
      pts.push(new Vector3(A.x + A.dx * u * L * 0.6 + Math.sin(u * 7 + A.ph) * L * 0.06, A.y - L * Math.sin(u * Math.PI * 0.55), A.z + A.dz * u * L * 0.6 + Math.cos(u * 6 + A.ph) * L * 0.05));
    }
    const n0 = b.p.length / 3;
    b.tube(pts, pts.map((_, i) => 0.0022 * (1 - (i / segs) * 0.5)), { color: () => new Color(0.16, 0.24, 0.09), sides: 3, t0: 0.6, t1: 1.3 });
    for (let i = 1; i <= segs * 3; i++) {
      const u = i / (segs * 3), p = pts[Math.floor(u * segs * 0.999)].clone().lerp(pts[Math.min(segs, Math.floor(u * segs) + 1)], (u * segs) % 1);
      const a = rnd() * 6.28, out = new Vector3(Math.cos(a), -0.3 + rnd() * 0.4, Math.sin(a)).normalize();
      const s = 0.02 + rnd() * 0.018;
      for (let k = 0; k < 2; k++) {
        const a2 = a + k * 2.4;
        b.card(p, new Vector3(Math.cos(a2), -0.2 + rnd() * 0.4, Math.sin(a2)).normalize(), new Vector3(-Math.sin(a2), 0, Math.cos(a2)), s, s * 0.9, CELL.vineLeaf, 0.6, 0.6 + 0.7 * u, rnd() * 6, 0.7 + 0.7 * u);
      }
    }
    const n1 = b.p.length / 3;
    for (let k = n0; k < n1; k++) roots.push(A.x, A.y, A.z);
  }
  const g = b.build();
  g.setAttribute('aRoot', new BufferAttribute(new Float32Array(roots), 3));
  return g;
}

function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

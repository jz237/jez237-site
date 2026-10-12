// The planting's look, built the way Weatherglass builds its own trees: fronds are textured cards
// (alpha-to-coverage edges, so they stay soft and stable instead of the shimmering saw-tooth outline of
// solid geometry), painted from a frond atlas drawn once at load, and shaded with Weatherglass's light
// and wind. Every plant is a handful of curved strips, so the whole jungle is a few hundred thousand
// triangles instead of millions.
//
// Atlas cells (2 x 2, each frond base at the bottom of its cell):
//   0 fern frond (broad pinnae)   1 tree-fern / cycad frond (long, fine pinnae)
//   2 strap leaf (bromeliad red)  3 horsetail stem (jointed, with whorls of needles)
import { BufferGeometry, BufferAttribute, CanvasTexture, SRGBColorSpace, Vector3 } from 'three';

// heights at scale 1, matching the Blender planting they replace (world units)
export const BASE_H = { fern: 0.106, fernlet: 0.062, redplant: 0.057, horsetail: 0.26, cycad: 0.392, treefern: 0.945 };

// ------------------------------------------------------------------ the atlas
export function frondAtlas(size = 1024) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const h = size / 2;
  const cell = (i) => ({ x: (i % 2) * h, y: i < 2 ? h : 0 }); // cells 0/1 bottom row in uv
  const rnd = mulberry(7);

  // a pinnate frond: rachis up the middle, pairs of leaflets that taper towards both ends
  const pinnate = (ox, oy, { pairs, maxL, width, angle, base, tip, mid, curl = 0 }) => {
    const cx = ox + h / 2, y0 = oy + h - 6, y1 = oy + 10;
    for (let i = 0; i < pairs; i++) {
      const t = (i + 0.5) / pairs;
      const y = y0 + (y1 - y0) * t;
      const L = maxL * h * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.95)), 0.7) * (1 - 0.15 * t);
      for (const s of [-1, 1]) {
        const a = (angle + (rnd() - 0.5) * 0.1) * s;
        const dx = Math.sin(a) * L, dy = -Math.cos(a) * L * 0.55 - L * 0.25;
        const w = L * width;
        const col = mixHex(base, tip, t * 0.8 + rnd() * 0.2);
        g.fillStyle = col;
        g.beginPath();
        g.moveTo(cx, y);
        g.quadraticCurveTo(cx + dx * 0.45 - s * w * 0.1, y + dy * 0.45 - w, cx + dx, y + dy + curl * s);
        g.quadraticCurveTo(cx + dx * 0.55 + s * w * 0.1, y + dy * 0.55 + w * 0.6, cx, y + w * 0.35);
        g.fill();
        // a lighter midrib down each leaflet
        g.strokeStyle = mixHex(col, '#d8f0a0', 0.35);
        g.lineWidth = Math.max(1, w * 0.12);
        g.beginPath();
        g.moveTo(cx, y);
        g.lineTo(cx + dx * 0.85, y + dy * 0.85);
        g.stroke();
      }
    }
    g.strokeStyle = mid;
    g.lineWidth = h * 0.014;
    g.beginPath();
    g.moveTo(cx, y0 + 4);
    g.lineTo(cx, y1);
    g.stroke();
  };

  let o = cell(0);
  pinnate(o.x, o.y, { pairs: 15, maxL: 0.42, width: 0.2, angle: 1.05, base: '#4f8a2e', tip: '#a8cc5c', mid: '#5e7a32' });
  o = cell(1);
  pinnate(o.x, o.y, { pairs: 26, maxL: 0.46, width: 0.11, angle: 1.2, base: '#40782a', tip: '#94c052', mid: '#6a5a32', curl: 6 });
  // strap leaf: long, pointed, red at the heart
  o = cell(2);
  {
    const cx = o.x + h / 2, y0 = o.y + h - 4, y1 = o.y + 8, w = h * 0.11;
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
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1 + 20);
    g.stroke();
  }
  // horsetail: jointed stem with whorls of needles at each node
  o = cell(3);
  {
    const cx = o.x + h / 2, y0 = o.y + h - 4, y1 = o.y + 8;
    const nodes = 9;
    for (let i = 1; i < nodes; i++) {
      const y = y0 + ((y1 - y0) * i) / nodes;
      const L = h * 0.2 * (1 - i / nodes) + h * 0.05;
      g.strokeStyle = mixHex('#3f6a28', '#86a84a', i / nodes);
      g.lineWidth = 2.2;
      for (let k = -4; k <= 4; k++) {
        if (!k) continue;
        g.beginPath();
        g.moveTo(cx, y);
        g.lineTo(cx + k * L * 0.22, y - L * (0.55 + Math.abs(k) * 0.04));
        g.stroke();
      }
    }
    g.strokeStyle = '#4f7a30';
    g.lineWidth = h * 0.03;
    g.beginPath();
    g.moveTo(cx, y0);
    g.lineTo(cx, y1);
    g.stroke();
    for (let i = 1; i < nodes; i++) {
      const y = y0 + ((y1 - y0) * i) / nodes;
      g.fillStyle = '#26381a';
      g.fillRect(cx - h * 0.02, y - 2, h * 0.04, 4);
    }
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// uv rectangle of a cell, inset a little so mips don't bleed between cells
export function cellUV(i) {
  const u0 = (i % 2) * 0.5, v0 = i < 2 ? 0 : 0.5;
  return { u0: u0 + 0.004, u1: u0 + 0.496, v0: v0 + 0.004, v1: v0 + 0.496 };
}

// ------------------------------------------------------------------ geometry
// A builder collects strips and tubes into one geometry with:
//   position, normal, uv, color (ambient occlusion: dark in the heart of the plant),
//   aT (how much of the plant's bend this vertex takes: 0 at the root, 1 at the top/tips),
//   aPh (a per-frond phase for flutter)
class Builder {
  constructor() {
    this.p = [];
    this.n = [];
    this.uv = [];
    this.c = [];
    this.t = [];
    this.ph = [];
    this.idx = [];
  }

  vert(p, n, u, v, ao, t, ph) {
    this.p.push(p.x, p.y, p.z);
    this.n.push(n.x, n.y, n.z);
    this.uv.push(u, v);
    this.c.push(ao, ao, ao);
    this.t.push(t);
    this.ph.push(ph);
    return this.p.length / 3 - 1;
  }

  // a frond card: from `base` heading `yaw`, rising at `rise` and drooping by `droop` towards the tip
  frond(base, { yaw, rise, droop, length, width, cell, segs = 6, roll = 0, tBase = 0, tSpan = 1, aoBase = 0.45, ph = 0 }) {
    const { u0, u1, v0, v1 } = cellUV(cell);
    const dir = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const side = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const pos = base.clone();
    let prev = null;
    for (let i = 0; i <= segs; i++) {
      const s = i / segs;
      const a = rise - droop * s * s;
      const tan = dir.clone().multiplyScalar(Math.cos(a)).add(new Vector3(0, Math.sin(a), 0));
      if (i > 0) pos.addScaledVector(tan, length / segs);
      // the card's face: across the frond, tilted by roll
      const across = side.clone().multiplyScalar(Math.cos(roll)).add(new Vector3(0, Math.sin(roll), 0));
      const nrm = new Vector3().crossVectors(across, tan).normalize();
      if (nrm.y < 0) nrm.negate();
      nrm.lerp(new Vector3(0, 1, 0), 0.35).normalize(); // softer, canopy-like lighting
      const w = width * 0.5;
      const ao = aoBase + (1 - aoBase) * Math.min(1, s * 1.4);
      const t = tBase + tSpan * s;
      const v = v0 + (v1 - v0) * s;
      const a0 = this.vert(pos.clone().addScaledVector(across, -w), nrm, u0, v, ao, t, ph);
      const a1 = this.vert(pos.clone().addScaledVector(across, w), nrm, u1, v, ao, t, ph);
      if (prev) this.idx.push(prev[0], prev[1], a0, prev[1], a1, a0);
      prev = [a0, a1];
    }
  }

  // a tapered tube (trunk), vertex-coloured
  tube(points, radii, { color, sides = 7, tTop = 0.6 }) {
    const n = points.length;
    const ring = [];
    for (let i = 0; i < n; i++) {
      const p = points[i];
      const t = (i / (n - 1)) * tTop;
      const r = radii[i];
      const row = [];
      for (let k = 0; k <= sides; k++) {
        const a = (k / sides) * Math.PI * 2;
        const nrm = new Vector3(Math.cos(a), 0, Math.sin(a));
        const shade = color(i / (n - 1), k / sides);
        row.push(this.vert(p.clone().addScaledVector(nrm, r), nrm, -1, -1, shade, t, 0));
      }
      ring.push(row);
    }
    for (let i = 0; i < n - 1; i++)
      for (let k = 0; k < sides; k++) this.idx.push(ring[i][k], ring[i + 1][k], ring[i][k + 1], ring[i][k + 1], ring[i + 1][k], ring[i + 1][k + 1]);
  }

  build() {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(this.p), 3));
    g.setAttribute('normal', new BufferAttribute(new Float32Array(this.n), 3));
    g.setAttribute('uv', new BufferAttribute(new Float32Array(this.uv), 2));
    g.setAttribute('color', new BufferAttribute(new Float32Array(this.c), 3));
    g.setAttribute('aT', new BufferAttribute(new Float32Array(this.t), 1));
    g.setAttribute('aPh', new BufferAttribute(new Float32Array(this.ph), 1));
    g.setIndex(this.idx);
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

// a rosette of fronds (ferns, fernlets, red strap plants)
function rosette(rnd, H, { n, cell, len, width, rise: [r0, r1], droop, segs = 5, aoBase = 0.62 }) {
  const b = new Builder();
  const o = new Vector3(0, 0, 0);
  for (let i = 0; i < n; i++) {
    const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.7;
    const rise = r0 + (r1 - r0) * rnd();
    const L = H * len * (0.75 + rnd() * 0.45);
    b.frond(o, { yaw, rise, droop: droop * (0.7 + rnd() * 0.6), length: L, width: L * width, cell, segs, roll: (rnd() - 0.5) * 0.6, aoBase, ph: rnd() * 6.28 });
  }
  return b;
}

const trunkColor = (dark, light, rnd) => (s, k) => {
  const ring = 0.5 + 0.5 * Math.sin(s * 60 + k * 3);
  return dark + (light - dark) * (0.35 + 0.4 * ring) * (0.85 + rnd() * 0.3);
};

export function plantGeometry(kind, variant) {
  const rnd = mulberry(1000 + variant * 97 + kind.length * 13);
  const H = BASE_H[kind];
  switch (kind) {
    case 'fern':
      return rosette(rnd, H, { n: 10 + Math.floor(rnd() * 5), cell: 0, len: 1.35, width: 0.5, rise: [0.5, 1.15], droop: 1.25 }).build();
    case 'fernlet':
      return rosette(rnd, H, { n: 6 + Math.floor(rnd() * 3), cell: 0, len: 1.3, width: 0.55, rise: [0.6, 1.2], droop: 1.1, segs: 4 }).build();
    case 'redplant':
      return rosette(rnd, H, { n: 9 + Math.floor(rnd() * 4), cell: 2, len: 1.25, width: 0.22, rise: [0.75, 1.35], droop: 0.9, segs: 4, aoBase: 0.55 }).build();
    case 'horsetail': {
      const b = new Builder();
      const n = 5 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, r = rnd() * H * 0.12;
        const base = new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
        const L = H * (0.6 + rnd() * 0.5), lean = 1.38 + rnd() * 0.15, yaw = rnd() * 6.28;
        // two crossed cards per stem, so it reads from every side
        b.frond(base, { yaw, rise: lean, droop: 0.05, length: L, width: L * 0.32, cell: 3, segs: 5, roll: 1.5, ph: rnd() * 6.28, aoBase: 0.55 });
        b.frond(base, { yaw: yaw + Math.PI / 2, rise: lean, droop: 0.05, length: L, width: L * 0.32, cell: 3, segs: 5, roll: 1.5, ph: rnd() * 6.28, aoBase: 0.55 });
      }
      return b.build();
    }
    case 'cycad': {
      const b = new Builder();
      const th = H * (0.25 + rnd() * 0.15), r = H * 0.13;
      const pts = [0, 0.33, 0.66, 1].map((s) => new Vector3(0, th * s, 0));
      b.tube(pts, [r * 1.15, r, r * 0.95, r * 0.8], { color: trunkColor(0.3, 0.75, rnd), tTop: 0.15 });
      const top = new Vector3(0, th, 0);
      const n = 11 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.4;
        const L = H * (0.7 + rnd() * 0.3);
        b.frond(top, { yaw, rise: 0.55 + rnd() * 0.5, droop: 0.45, length: L, width: L * 0.34, cell: 1, segs: 5, roll: (rnd() - 0.5) * 0.4, tBase: 0.15, tSpan: 0.85, aoBase: 0.55, ph: rnd() * 6.28 });
      }
      return b.build();
    }
    case 'treefern': {
      const b = new Builder();
      const th = H * 0.78, r = H * 0.035;
      const lean = (rnd() - 0.5) * 0.12;
      const pts = [];
      for (let i = 0; i <= 7; i++) {
        const s = i / 7;
        pts.push(new Vector3(Math.sin(lean) * th * s * s, th * s, Math.cos(lean) * th * s * s * 0.3));
      }
      b.tube(pts, pts.map((_, i) => r * (1.5 - i * 0.07)), { color: trunkColor(0.22, 0.55, rnd), tTop: 0.75 });
      const top = pts[pts.length - 1].clone();
      const n = 13 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
        const L = H * (0.52 + rnd() * 0.18);
        const young = i % 6 === 0;
        b.frond(top, {
          yaw, rise: young ? 1.15 : 0.35 + rnd() * 0.45, droop: young ? 0.4 : 1.6 + rnd() * 0.5, length: L * (young ? 0.6 : 1),
          width: L * 0.36, cell: 1, segs: 7, roll: (rnd() - 0.5) * 0.3, tBase: 0.75, tSpan: 0.45, aoBase: 0.55, ph: rnd() * 6.28,
        });
      }
      return b.build();
    }
  }
  return null;
}

function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round((((pa >> s) & 255) * (1 - t)) + (((pb >> s) & 255) * t));
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

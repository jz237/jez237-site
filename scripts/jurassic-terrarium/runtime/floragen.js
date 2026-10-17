// The planting, built for detail: every plant is many small parts, not a few big leaves. A frond is a
// stem carrying pairs of separate leaflets, each its own small tilted card (so fronds have depth and
// catch the light leaflet by leaflet); monkey-puzzle trees are tiers of whorled branches clothed in
// scale-leaved branchlets; ginkgos carry clusters of little fan leaves; vines hang from the tree-fern
// crowns, strung with small leaves; moss tufts the trunk feet. Leaf shapes come from an atlas painted
// once at load; cards use alpha-to-coverage, so edges stay soft and stable rather than shimmering.
import { BufferGeometry, BufferAttribute, CanvasTexture, SRGBColorSpace, Vector3, Color } from 'three';

// heights at scale 1, matching the planting they replace (world units)
export const BASE_H = { fern: 0.106, fernlet: 0.062, redplant: 0.057, horsetail: 0.26, cycad: 0.392, treefern: 0.945, araucaria: 1.0, ginkgo: 0.85, redwood: 1.0 };

// atlas cells (4 x 4 grid)
export const CELL = {
  fernPinna: 0, treePinna: 1, cycadLeaf: 2, strap: 3, horsetail: 4, ginkgo: 5, araucaria: 6, vineLeaf: 7,
  moss: 8, stem: 9, fiddle: 10, fernPinnaB: 11, deadPinna: 12, stub: 13, fibre: 14, sprig: 15,
};
const GRID = 4;

// ------------------------------------------------------------------ the atlas

// The leaves' relief, for a bump map over the same atlas: every leaflet domed (its edges curl down, from a
// blurred copy of its outline) and its veins raised as ridges (the painted veins, against the blade round
// them), so light rakes across the midribs and the pleats between the side veins.
function frondRelief(src, cell) {
  const W = src.width, H = src.height;
  const blur = (px) => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.filter = `blur(${px}px)`;
    g.drawImage(src, 0, 0);
    return g.getImageData(0, 0, W, H).data;
  };
  const S = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  const B1 = blur(Math.max(1, cell * 0.004)), B2 = blur(Math.max(2, cell * 0.03));
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const og = out.getContext('2d');
  const img = og.createImageData(W, H), d = img.data;
  const lum = (A, k) => A[k] * 0.3 + A[k + 1] * 0.55 + A[k + 2] * 0.15;
  for (let k = 0; k < d.length; k += 4) {
    const dome = B2[k + 3] / 255;
    const ridge = (lum(S, k) - lum(B1, k)) / 255; // the veins: lighter than the blade beside them
    const v = Math.max(0, Math.min(1, 0.15 + 0.6 * dome * dome + 2.2 * ridge * (S[k + 3] / 255)));
    d[k] = d[k + 1] = d[k + 2] = v * 255;
    d[k + 3] = 255;
  }
  og.putImageData(img, 0, 0);
  const t = new CanvasTexture(out);
  t.anisotropy = 8;
  return t;
}
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
  leaflet(CELL.deadPinna, { base: '#4a3018', tip: '#8a6232', vein: 'rgba(200,160,100,0.4)', lobes: 12, width: 0.11, shape: 0.7 });
  // frond-base stub: a short, tapering, scaly stalk end, dark and hairy
  {
    const { x, y } = at(CELL.stub);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + h * 0.15;
    const grd = g.createLinearGradient(0, y0, 0, y1);
    grd.addColorStop(0, '#5a3c22');
    grd.addColorStop(1, '#9c7448');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(cx - h * 0.2, y0);
    g.lineTo(cx - h * 0.08, y1);
    g.lineTo(cx + h * 0.08, y1);
    g.lineTo(cx + h * 0.2, y0);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(150,100,50,0.7)';
    g.lineWidth = 1.2;
    for (let k = 0; k < 40; k++) {
      const t = rnd(), yy = y0 + (y1 - y0) * t, w = h * (0.2 - 0.12 * t);
      const s = rnd() < 0.5 ? -1 : 1;
      g.beginPath();
      g.moveTo(cx + s * w * 0.9, yy);
      g.lineTo(cx + s * (w + h * 0.06), yy - h * 0.04);
      g.stroke();
    }
  }
  // root fibres: a dense tangle of thin dark strands, for the flared foot of the trunk
  {
    const { x, y } = at(CELL.fibre);
    for (let k = 0; k < 220; k++) {
      const x0 = x + rnd() * h, w = (rnd() - 0.5) * h * 0.2;
      g.strokeStyle = mixHex('#1e140c', '#5a3e24', rnd());
      g.lineWidth = 1 + rnd() * 2;
      g.beginPath();
      g.moveTo(x0, y + 4);
      g.quadraticCurveTo(x0 + w, y + h * 0.5, x0 + w * 0.4, y + h - 4);
      g.stroke();
    }
  }

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
  // redwood-type spray: a flat, feathery shoot, short needles in two ranks along a main axis and its
  // side shoots, dark blue-green
  {
    const { x, y } = at(CELL.sprig);
    const cx = x + h / 2, y0 = y + h - 4, y1 = y + 6;
    const shoot = (sx, sy, ang, len, nl, w) => {
      g.strokeStyle = '#3a3420';
      g.lineWidth = h * 0.012;
      g.beginPath();
      g.moveTo(sx, sy);
      g.lineTo(sx + Math.sin(ang) * len, sy - Math.cos(ang) * len);
      g.stroke();
      for (let i = 1; i <= nl; i++) {
        const t = i / (nl + 1), px = sx + Math.sin(ang) * len * t, py = sy - Math.cos(ang) * len * t, ww = w * (1 - 0.55 * t);
        for (const s of [-1, 1]) {
          g.strokeStyle = mixHex('#1c3a24', '#4a7446', 0.25 + 0.75 * rnd());
          g.lineWidth = h * 0.011;
          g.beginPath();
          g.moveTo(px, py);
          const a2 = ang + s * 1.25;
          g.lineTo(px + Math.sin(a2) * ww, py - Math.cos(a2) * ww);
          g.stroke();
        }
      }
    };
    shoot(cx, y0, 0, y0 - y1, 30, h * 0.075);
    for (let i = 0; i < 7; i++) {
      const t = 0.12 + i * 0.11, sy = y0 - (y0 - y1) * t, L = h * (0.26 - 0.025 * i);
      for (const s of [-1, 1]) shoot(cx, sy, s * 0.75, L, 12, h * 0.05);
    }
  }
  // Transparent texels keep the colour of their cell's leaves, not black: the mip chain and the
  // distance alpha boost would otherwise pull black into every leaf's fringe (dark edges, black halves)
  {
    const img = g.getImageData(0, 0, size, size), d = img.data;
    for (let cy = 0; cy < GRID; cy++)
      for (let cx = 0; cx < GRID; cx++) {
        let r = 0, gg = 0, b = 0, n = 0;
        const x0 = cx * h, y0 = cy * h;
        for (let y = y0; y < y0 + h; y += 2)
          for (let x = x0; x < x0 + h; x += 2) {
            const k = (y * size + x) * 4;
            if (d[k + 3] > 200) (r += d[k]), (gg += d[k + 1]), (b += d[k + 2]), n++;
          }
        if (!n) continue;
        r /= n;
        gg /= n;
        b /= n;
        for (let y = y0; y < y0 + h; y++)
          for (let x = x0; x < x0 + h; x++) {
            const k = (y * size + x) * 4, a = d[k + 3] / 255;
            if (a > 0.98) continue;
            // blend the texel's own colour (if any) with the cell average by coverage
            d[k] = d[k] * a + r * (1 - a);
            d[k + 1] = d[k + 1] * a + gg * (1 - a);
            d[k + 2] = d[k + 2] * a + b * (1 - a);
          }
      }
    g.putImageData(img, 0, 0);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.premultiplyAlpha = false;
  tex.userData.relief = () => frondRelief(c, h);
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
    const v = (dark + (light - dark) * (0.2 + 0.35 * fibre + 0.2 * ring)) * (0.8 + rnd() * 0.35);
    b.setRGB(v * 1.2, v * 0.85, v * 0.55);
    const moss = mossy * Math.max(0, 1 - s * 3.2) * (0.6 + 0.4 * Math.sin(k * 6.3 + s * 20));
    // these are display (sRGB) colours; vertex colours are linear light
    return b.clone().lerp(m, Math.max(0, moss)).convertSRGBToLinear();
  };
};

function rosette(rnd, H, { n, len, rise: [r0, r1], droop, pairs, pinna, pinnaW = 0.3, cell, aoBase = 0.55, segs = 6, fiddle = true }) {
  const b = new Builder();
  const o = new Vector3();
  for (let i = 0; i < n; i++) {
    const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.7;
    const L = H * len * (0.72 + rnd() * 0.5);
    b.frond(o, { yaw, rise: r0 + (r1 - r0) * rnd(), droop: droop * (0.7 + rnd() * 0.6), length: L, segs, pairs, pinna, pinnaW, cell: rnd() < 0.5 ? cell : CELL.fernPinnaB, aoBase, ph: rnd() * 6.28, rnd, roll: (rnd() - 0.5) * 0.4 });
  }
  // a young fiddlehead or two in the middle
  if (H > 0.08 && fiddle)
    for (let i = 0; i < 2; i++) {
      const a = rnd() * 6.28;
      b.card(new Vector3(Math.cos(a) * H * 0.05, 0, Math.sin(a) * H * 0.05), new Vector3(0, 1, 0), new Vector3(Math.cos(a), 0, Math.sin(a)), H * 0.45, H * 0.25, CELL.fiddle, 0.7, 0.4, rnd() * 6);
    }
  return b;
}

export function plantGeometry(kind, variant, { far = false } = {}) {
  const rnd = mulberry(1000 + variant * 97 + kind.length * 13);
  const H = BASE_H[kind];
  switch (kind) {
    case 'fern':
      // far: the same plant shape, fewer and broader leaflets (stable when small on screen)
      if (far) return rosette(rnd, H, { n: 11 + Math.floor(rnd() * 5), len: 1.35, rise: [0.5, 1.15], droop: 1.2, pairs: 5, pinna: 0.5, pinnaW: 0.55, cell: CELL.fernPinna, segs: 4, fiddle: false }).build();
      return rosette(rnd, H, { n: 11 + Math.floor(rnd() * 5), len: 1.35, rise: [0.5, 1.15], droop: 1.2, pairs: 14, pinna: 0.3, cell: CELL.fernPinna }).build();
    case 'fernlet':
      if (far) return rosette(rnd, H, { n: 7 + Math.floor(rnd() * 3), len: 1.3, rise: [0.6, 1.2], droop: 1.05, pairs: 4, pinna: 0.52, pinnaW: 0.55, cell: CELL.fernPinna, segs: 3, fiddle: false }).build();
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
      // a short, tapering trunk armoured in a spiral of old leaf bases (like a pineapple), a crown of
      // stiff, many-leafleted fronds, and in some a cone in the middle of the crown
      const b = new Builder();
      const th = H * (0.16 + rnd() * 0.12), r = H * 0.075;
      const pts = [0, 0.25, 0.5, 0.75, 1].map((s) => new Vector3(Math.sin(s * 3 + rnd()) * r * 0.08, th * s, 0));
      b.tube(pts, [r * 1.2, r * 1.1, r * 1.0, r * 0.9, r * 0.75], { color: bark(rnd, 0.22, 0.42, 0.4), t1: 0.05, sides: 10 });
      const nb = 64;
      for (let i = 0; i < nb; i++) {
        const s = 0.04 + 0.94 * (i / nb), a = i * 2.39996;
        const rr = r * (1.2 - 0.45 * s);
        const rad = new Vector3(Math.cos(a), 0, Math.sin(a));
        const out = rad.clone().multiplyScalar(0.55).add(new Vector3(0, 0.85, 0)).normalize();
        b.card(new Vector3(rad.x * rr * 0.9, th * s, rad.z * rr * 0.9), out, new Vector3(-Math.sin(a), 0, Math.cos(a)), r * 0.7, r * 0.75, CELL.stub, 0.45, 0.02, 0);
      }
      b.moss(new Vector3(0, 0, 0), r * 1.4, 5, rnd, 0);
      const top = new Vector3(pts[4].x, th, 0);
      // a cone (male or female) in some crowns: a stack of scale rings
      if (rnd() < 0.55) {
        const ch = H * 0.18, cr = r * 0.45;
        const cp = [0, 0.25, 0.5, 0.75, 1].map((s) => new Vector3(top.x, th + ch * s, 0));
        b.tube(cp, [cr * 0.8, cr, cr * 0.95, cr * 0.7, cr * 0.15], {
          color: (s, k) => new Color(0.62 + 0.1 * Math.sin(k * 20 + s * 30), 0.48 + 0.08 * Math.sin(k * 20 + s * 30), 0.2).convertSRGBToLinear(), t0: 0.05, t1: 0.1, sides: 10,
        });
      }
      const n = 13 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.4;
        b.frond(top, { yaw, rise: 0.5 + rnd() * 0.55, droop: 0.45, length: H * (0.7 + rnd() * 0.3), segs: 6, pairs: 18, pinna: 0.22, pinnaW: 0.16, spread: 1.3, cell: CELL.cycadLeaf, tBase: 0.1, tSpan: 0.9, aoBase: 0.45, ph: rnd() * 6.28, rnd });
      }
      return b.build();
    }
    case 'treefern': {
      // A slender, shaggy trunk (it stays straight: only the crown moves): a flared foot of root
      // fibres, a spiral of old frond-base stubs up the trunk, a skirt of dead brown fronds hanging under
      // the crown, and a crown of living fronds, a few young ones unrolling in the middle.
      const b = new Builder();
      const th = H * 0.8, r = H * 0.022;
      const lean = (rnd() - 0.5) * 0.08, pts = [];
      for (let i = 0; i <= 10; i++) {
        const s = i / 10;
        pts.push(new Vector3(Math.sin(lean) * th * s + Math.sin(s * 5 + rnd()) * r * 0.25, th * s, Math.sin(s * 4 + rnd()) * r * 0.25));
      }
      b.tube(pts, pts.map((_, i) => r * (1.25 - i * 0.03) * (i === 0 ? 1.9 : i === 1 ? 1.3 : 1)), { color: bark(rnd, 0.14, 0.32, 0.5), t0: 0, t1: 0.02, sides: 9 });
      // root mantle: fibre cards flaring round the foot
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + rnd() * 0.3;
        const out = new Vector3(Math.cos(a) * 0.55, -0.85, Math.sin(a) * 0.55).normalize();
        b.card(new Vector3(Math.cos(a) * r * 0.9, th * (0.1 + rnd() * 0.06), Math.sin(a) * r * 0.9), out,
          new Vector3(-Math.sin(a), 0, Math.cos(a)), th * 0.12, r * 2.2, CELL.fibre, 0.45, 0, 0);
      }
      b.moss(new Vector3(0, 0, 0), r * 2.2, 7, rnd, 0);
      // frond-base stubs, spiralling up the trunk (golden angle), pointing up and out
      const nStub = 70;
      for (let i = 0; i < nStub; i++) {
        const s = 0.22 + 0.74 * (i / nStub), a = i * 2.39996;
        const c = pts[Math.min(9, Math.floor(s * 10))].clone().lerp(pts[Math.min(10, Math.floor(s * 10) + 1)], (s * 10) % 1);
        const rad = new Vector3(Math.cos(a), 0, Math.sin(a));
        const out = rad.clone().multiplyScalar(0.7).add(new Vector3(0, 0.7, 0)).normalize();
        b.card(c.clone().addScaledVector(rad, r * 0.8), out, new Vector3(-Math.sin(a), 0, Math.cos(a)), r * (2.2 + rnd()), r * 1.4, CELL.stub, 0.5, 0.02, 0);
      }
      const top = pts[pts.length - 1].clone();
      // the skirt: dead fronds hanging down round the top of the trunk
      const nd = 7 + Math.floor(rnd() * 4);
      for (let i = 0; i < nd; i++) {
        const yaw = (i / nd) * Math.PI * 2 + rnd() * 0.5;
        b.frond(top.clone().add(new Vector3(0, -th * 0.03, 0)), {
          yaw, rise: -0.9 - rnd() * 0.4, droop: 0.15, length: H * (0.32 + rnd() * 0.12), segs: 5, pairs: 12, pinna: 0.18, pinnaW: 0.22,
          spread: 0.7, cell: CELL.deadPinna, tBase: 0.55, tSpan: 0.15, aoBase: 0.35, ph: rnd() * 6.28, rnd,
        });
      }
      const n = 15 + Math.floor(rnd() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.35, young = i % 7 === 0;
        b.frond(top, {
          yaw, rise: young ? 1.15 : 0.35 + rnd() * 0.45, droop: young ? 0.4 : 1.6 + rnd() * 0.5, length: H * (0.5 + rnd() * 0.18) * (young ? 0.6 : 1),
          segs: 8, pairs: 22, pinna: 0.2, pinnaW: 0.2, cell: CELL.treePinna, tBase: 0.6, tSpan: 0.6, aoBase: 0.45, ph: rnd() * 6.28, rnd,
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
          // a monkey puzzle's limbs are clad in overlapping scale-leaves right back to the trunk: dark
          // green, not bark
          const clad = new Color(), cladFn = (q, kk) => {
            const v = 0.55 + 0.45 * Math.sin(q * 60 + kk * 7) * Math.sin(q * 23 - kk * 3);
            return clad.setRGB(0.035 + 0.02 * v, 0.07 + 0.04 * v, 0.025 + 0.012 * v);
          };
          b.tube(bp, bp.map((_, j) => r * 0.42 * (1 - j * 0.16)), { color: cladFn, sides: 6, t0: s * 0.6, t1: s * 0.6 + 0.35 });
          // branchlets: two rows of upturned scale-leaved shoots along the branch, plus one at the tip
          for (let j = 1; j <= 11; j++) {
            const u = j / 12, p = bp[Math.min(3, Math.floor(u * 4))].clone().lerp(bp[Math.min(4, Math.floor(u * 4) + 1)], (u * 4) % 1);
            const along = bp[4].clone().sub(bp[0]).normalize();
            for (const sg of [-1, 1]) {
              const side = new Vector3().crossVectors(along, UPV).normalize().multiplyScalar(sg);
              const out = side.clone().multiplyScalar(0.75).addScaledVector(along, 0.45).add(new Vector3(0, 0.35, 0)).normalize();
              const L = reach * (0.42 - 0.18 * u);
              const sd = new Vector3().crossVectors(out, UPV).normalize().lerp(UPV, 0.35).normalize();
              const ph = rnd() * 6, t0 = s * 0.6 + 0.35 * u;
              // two crossed cards per shoot, so it reads as a rope of leaves from any side, never edge-on
              b.card(p, out, sd, L, L * 0.55, CELL.araucaria, 0.5, t0, ph, t0 + 0.1);
              b.card(p, out, new Vector3().crossVectors(out, sd).normalize(), L, L * 0.5, CELL.araucaria, 0.45, t0, ph, t0 + 0.1);
            }
          }
          const tipDir = bp[4].clone().sub(bp[3]).normalize();
          const tside = new Vector3().crossVectors(tipDir, UPV).normalize(), tph = rnd() * 6;
          b.card(bp[4], tipDir, tside, reach * 0.35, reach * 0.16, CELL.araucaria, 0.7, s * 0.6 + 0.35, tph);
          b.card(bp[4], tipDir, new Vector3().crossVectors(tipDir, tside).normalize(), reach * 0.35, reach * 0.16, CELL.araucaria, 0.7, s * 0.6 + 0.35, tph);
        }
      }
      // the crown tuft
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2, dir = new Vector3(Math.cos(a) * 0.5, 1, Math.sin(a) * 0.5).normalize();
        b.card(new Vector3(0, th * 0.98, 0), dir, new Vector3(-Math.sin(a), 0, Math.cos(a)), H * 0.14, H * 0.05, CELL.araucaria, 0.8, 0.95, rnd() * 6);
      }
      return b.build();
    }
    case 'redwood': {
      // a redwood-type conifer of the cypress family (the family is known from the Jurassic): a straight,
      // tapering, red-brown fibrous trunk on a buttressed foot, and a narrow cone of whorled limbs that
      // droop and lift at the tips, each carrying flat feathery sprays
      const b = new Builder();
      const th = H, r = H * 0.024;
      const pts = [0, 0.12, 0.4, 0.7, 1].map((s) => new Vector3(0, th * s, 0));
      const red = new Color(), redFn = (q, kk) => {
        const f = 0.5 + 0.5 * Math.sin(kk * 37 + Math.sin(q * 11) * 2);
        const v = (0.16 + 0.12 * f) * (0.85 + rnd() * 0.3);
        return red.setRGB(v * 1.35, v * 0.72, v * 0.48);
      };
      b.tube(pts, [r * 2.0, r * 1.25, r * 0.95, r * 0.6, r * 0.12], { color: redFn, t1: 0.6, sides: 9 });
      b.moss(new Vector3(0, 0, 0), r * 2.3, 8, rnd, 0);
      const tiers = 15;
      const limb = new Color(), limbFn = () => limb.setRGB(0.08, 0.055, 0.035);
      for (let k = 0; k < tiers; k++) {
        const s = 0.2 + (0.78 * k) / (tiers - 1), y = th * s, nb = 5 + Math.floor(rnd() * 2);
        const reach = H * (0.045 + 0.26 * Math.pow(1 - s, 0.85)) * (0.85 + rnd() * 0.3);
        for (let i = 0; i < nb; i++) {
          const a = (i / nb) * Math.PI * 2 + k * 1.1 + (rnd() - 0.5) * 0.4;
          const d = new Vector3(Math.cos(a), 0, Math.sin(a));
          const bp = [];
          for (let j = 0; j <= 3; j++) {
            const u = j / 3;
            bp.push(new Vector3(d.x * reach * u, y - reach * 0.3 * u + reach * 0.2 * u * u * u, d.z * reach * u));
          }
          const t0 = s * 0.6;
          b.tube(bp, bp.map((_, j) => r * 0.26 * (1 - j * 0.24)), { color: limbFn, sides: 4, t0, t1: t0 + 0.35 });
          const along = bp[3].clone().sub(bp[0]).normalize();
          for (let j = 1; j <= 5; j++) {
            const u = j / 6, f = u * 3, p = bp[Math.floor(f)].clone().lerp(bp[Math.min(3, Math.floor(f) + 1)], f % 1);
            for (const sg of [-1, 1]) {
              const side = new Vector3().crossVectors(along, UPV).normalize().multiplyScalar(sg);
              const out = side.clone().multiplyScalar(0.8).addScaledVector(along, 0.55).add(new Vector3(0, -0.12, 0)).normalize();
              const L = reach * (0.5 - 0.22 * u) + H * 0.02;
              const sd = new Vector3().crossVectors(out, UPV).normalize().lerp(UPV, 0.25).normalize();
              const ph = rnd() * 6, tt = t0 + 0.35 * u;
              b.card(p, out, sd, L, L * 0.75, CELL.sprig, 0.45, tt, ph, tt + 0.1);
              b.card(p, out, new Vector3().crossVectors(out, sd).normalize(), L * 0.9, L * 0.45, CELL.sprig, 0.4, tt, ph, tt + 0.1);
            }
          }
          const tipDir = bp[3].clone().sub(bp[2]).normalize(), tside = new Vector3().crossVectors(tipDir, UPV).normalize();
          b.card(bp[3], tipDir, tside, reach * 0.4 + H * 0.02, reach * 0.3 + H * 0.015, CELL.sprig, 0.65, t0 + 0.35, rnd() * 6);
        }
      }
      // the leader
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2, dir = new Vector3(Math.cos(a) * 0.25, 1, Math.sin(a) * 0.25).normalize();
        b.card(new Vector3(0, th * 0.96, 0), dir, new Vector3(-Math.sin(a), 0, Math.cos(a)), H * 0.08, H * 0.05, CELL.sprig, 0.8, 0.95, rnd() * 6);
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
          const leaves = 9 + Math.floor(rnd() * 6);
          for (let k = 0; k < leaves; k++) {
            const la = (k / leaves) * Math.PI * 2 + rnd(), tilt = 0.3 + rnd() * 0.7;
            const out = new Vector3(Math.cos(la) * Math.cos(tilt), Math.sin(tilt), Math.sin(la) * Math.cos(tilt));
            const s = H * (0.045 + rnd() * 0.02);
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
    b.tube(pts, pts.map((_, i) => 0.0022 * (1 - (i / segs) * 0.5)), { color: () => new Color(0.16, 0.24, 0.09).convertSRGBToLinear(), sides: 3, t0: 0.6, t1: 1.3 });
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

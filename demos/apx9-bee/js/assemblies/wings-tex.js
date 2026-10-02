// wings-tex.js - procedural canvas textures for the smart membrane: colour, alpha, roughness, thin-film thickness,
// emissive (LED strip) and a faint micro-relief normal map. All layers share ONE planform UV mapping
// (u = x / 23.5, v = (y - Y0) / YSPAN) and ONE feature plan, so cracks, traces and patches line up on every map.
// No readable text anywhere (the left wing is a mirror image): the engraved "script" is abstract stroke work.
import { mk, clamp, vnoise, XT } from './wings-shape.js';

export const MEM = { Y0: -8.95, YSPAN: 10.1 };
export const uvOf = (x, y) => [x / XT, (y - MEM.Y0) / MEM.YSPAN];

const gray = (v) => { const c = Math.round(clamp(v) * 255); return `rgb(${c},${c},${c})`; };

/* style table: [map colour, alpha, roughness, emissive colour] (alpha and roughness are scalars 0..1) */
const ST = {
  base:    ['#9db1c3', 0.32, 0.075, '#000000'],
  frost:   ['#66737f', 0.58, 0.40, '#000000'],
  frostHi: ['#a8b6c3', 0.66, 0.52, '#000000'],
  frostLo: ['#46515c', 0.62, 0.34, '#000000'],
  ledBody: ['#15130f', 0.94, 0.30, '#000000'],
  ledRim:  ['#e2b13c', 0.95, 0.22, '#000000'],
  led:     ['#ffd57a', 0.98, 0.25, '#ffb02e'],
  ledDim:  ['#e8b255', 0.97, 0.28, '#7a4a10'],
  crack:   ['#e3b53f', 0.86, 0.26, '#000000'],
  trace:   ['#dcb24c', 0.80, 0.30, '#000000'],
  pad:     ['#f2d680', 0.92, 0.20, '#000000'],
  chip:    ['#101216', 0.93, 0.46, '#000000'],
  grid:    ['#94a1ad', 0.60, 0.46, '#000000'],
  script:  ['#f4f8fb', 0.50, 0.50, '#000000'],
};
const col = (mode, key) => {
  const s = ST[key];
  if (mode === 'map') return s[0];
  if (mode === 'alpha') return gray(s[1]);
  if (mode === 'rough') return gray(s[2]);
  if (mode === 'emis') return s[3];
  return null;
};

/* ------------------------------------------------------------------ small polygon helpers */
function pip(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function polyStats(pts) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    const w = p[0] * q[1] - q[0] * p[1];
    a += w; cx += (p[0] + q[0]) * w; cy += (p[1] + q[1]) * w;
  }
  a /= 2;
  if (Math.abs(a) < 1e-9) return { cx: pts[0][0], cy: pts[0][1], area: 0, ang: 0 };
  cx /= 6 * a; cy /= 6 * a;
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of pts) { const dx = p[0] - cx, dy = p[1] - cy; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }
  return { cx, cy, area: Math.abs(a), ang: 0.5 * Math.atan2(2 * sxy, sxx - syy) };
}
/** Largest rectangle (aspect ar) centred near the centroid whose corners stay inside the polygon. */
function fitRect(pts, st, ar = 0.55, k0 = 1.1) {
  const base = 0.5 * Math.sqrt(st.area);
  let hw = base * k0, hh = hw * ar;
  const ca = Math.cos(st.ang), sa = Math.sin(st.ang);
  for (let it = 0; it < 18; it++) {
    let ok = true;
    for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const lx = sx * hw, ly = sy * hh;
      if (!pip(pts, st.cx + lx * ca - ly * sa, st.cy + lx * sa + ly * ca)) { ok = false; break; }
    }
    if (ok) return { hw, hh };
    hw *= 0.92; hh *= 0.92;
  }
  return { hw, hh };
}

/* ------------------------------------------------------------------ feature plan (deterministic) */
function planOps(net) {
  const R = mk(4242);
  const V = net.verts;
  const ops = [];
  const cells = net.cells.map((c) => {
    const pts = c.ids.map((id) => [V[id].x, V[id].y]);
    return { pts, st: polyStats(pts), rim: c.ids.some((id) => V[id].rim) };
  });
  // per-cell tint variation
  cells.forEach((c) => ops.push({ k: 'cell', pts: c.pts, h: R.range(-1, 1), l: R.range(-1, 1), a: R.range(-1, 1), t: R.range(0.12, 0.88), s: R() < 0.16 ? 1 : 0 }));

  const order = cells.map((c, i) => i).sort((a, b) => cells[b].st.area - cells[a].st.area);
  const interior = order.filter((i) => !cells[i].rim);

  /* frosted "smart" patches: grey squares inside the biggest interior cells; the one nearest the root also carries the LED strip */
  const ledCell = [...interior].sort((a, b) => Math.hypot(cells[a].st.cx - 7.3, cells[a].st.cy + 4.1) - Math.hypot(cells[b].st.cx - 7.3, cells[b].st.cy + 4.1))[0];
  const patchCells = [ledCell, ...interior.filter((i) => i !== ledCell).slice(0, 4)];
  patchCells.forEach((ci, n) => {
    const c = cells[ci];
    const fr = fitRect(c.pts, c.st, n === 0 ? 0.3 : R.range(0.45, 0.8), n === 0 ? 1.15 : 0.82);
    const patch = { k: 'rect', key: 'frost', cx: c.st.cx, cy: c.st.cy, hw: fr.hw, hh: fr.hh, ang: c.st.ang };
    ops.push(patch);
    const ca = Math.cos(c.st.ang), sa = Math.sin(c.st.ang);
    const toW = (lx, ly) => [c.st.cx + lx * ca - ly * sa, c.st.cy + lx * sa + ly * ca];
    // etched film: a faint orthogonal grid, a few grains, a double border and gold registration marks at the corners
    ops.push({ k: 'hatch', key: 'grid', cx: c.st.cx, cy: c.st.cy, hw: fr.hw, hh: fr.hh, ang: c.st.ang, step: 0.11, w: 0.006, a: 0 });
    ops.push({ k: 'hatch', key: 'grid', cx: c.st.cx, cy: c.st.cy, hw: fr.hw, hh: fr.hh, ang: c.st.ang, step: 0.11, w: 0.006, a: Math.PI / 2 });
    const nSp = Math.round(30 + 140 * fr.hw * fr.hh);
    for (let i = 0; i < nSp; i++) {
      const [wx, wy] = toW(R.range(-fr.hw, fr.hw), R.range(-fr.hh, fr.hh));
      ops.push({ k: 'dot', key: R() < 0.6 ? 'frostHi' : 'frostLo', x: wx, y: wy, r: R.range(0.008, 0.02) });
    }
    // embedded circuit: a few dark chips with pin rows, joined by gold Manhattan traces (traces first so chips sit on top)
    const chips = [];
    const nChip = n === 0 ? 2 : 3 + Math.floor(R() * 3);
    for (let q = 0; q < nChip; q++) {
      const hw = R.range(0.07, 0.17) * Math.min(1, fr.hw / 0.5), hh = R.range(0.05, 0.1) * Math.min(1, fr.hh / 0.3);
      const side = n === 0 ? (q === 0 ? -1 : 1) : 0;
      let lx = R.range(-fr.hw + hw + 0.08, fr.hw - hw - 0.08), ly = R.range(-fr.hh + hh + 0.08, fr.hh - hh - 0.08);
      if (n === 0) { ly = side * (fr.hh * 0.9 - hh); lx = R.range(-fr.hw * 0.5, fr.hw * 0.5); }
      if (!(lx === lx) || !(ly === ly)) continue;
      chips.push({ lx, ly, hw, hh });
    }
    for (let q = 0; q + 1 < chips.length; q++) {
      const a = chips[q], b = chips[q + 1];
      ops.push({ k: 'line', key: 'trace', pts: [[a.lx, a.ly], [b.lx, a.ly], [b.lx, b.ly]].map(([x, y]) => toW(x, y)), w: 0.012 });
      if (R() < 0.7) ops.push({ k: 'line', key: 'trace', pts: [[a.lx, a.ly + a.hh * 0.5], [(a.lx + b.lx) / 2, a.ly + a.hh * 0.5], [(a.lx + b.lx) / 2, b.ly - b.hh * 0.5], [b.lx, b.ly - b.hh * 0.5]].map(([x, y]) => toW(x, y)), w: 0.008 });
    }
    for (const ch of chips) {
      const [wx, wy] = toW(ch.lx, ch.ly);
      ops.push({ k: 'rect', key: 'chip', cx: wx, cy: wy, hw: ch.hw, hh: ch.hh, ang: c.st.ang });
      ops.push({ k: 'rectLine', key: 'pad', cx: wx, cy: wy, hw: ch.hw, hh: ch.hh, ang: c.st.ang, w: 0.007 });
      const pins = Math.max(3, Math.round((ch.hw * 2) / 0.045));
      for (let p = 0; p < pins; p++) {
        const px = -ch.hw + (ch.hw * 2 * (p + 0.5)) / pins;
        for (const sg of [-1, 1]) { const [qx, qy] = toW(ch.lx + px, ch.ly + sg * (ch.hh + 0.016)); ops.push({ k: 'dot', key: 'pad', x: qx, y: qy, r: 0.0105 }); }
      }
    }
    ops.push({ k: 'rectLine', key: 'pad', cx: c.st.cx, cy: c.st.cy, hw: fr.hw, hh: fr.hh, ang: c.st.ang, w: 0.016 });
    ops.push({ k: 'rectLine', key: 'frostHi', cx: c.st.cx, cy: c.st.cy, hw: fr.hw - 0.045, hh: fr.hh - 0.045, ang: c.st.ang, w: 0.009 });
    for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const [x0, y0] = toW(sx * (fr.hw - 0.09), sy * (fr.hh - 0.09));
      const [x1, y1] = toW(sx * (fr.hw - 0.09 - 0.12), sy * (fr.hh - 0.09));
      const [x2, y2] = toW(sx * (fr.hw - 0.09), sy * (fr.hh - 0.09 - 0.12));
      ops.push({ k: 'line', key: 'pad', pts: [[x1, y1], [x0, y0], [x2, y2]], w: 0.012 });
    }
    if (n === 0) {
      // LED strip: dark housing, thin gold bezel, a row of amber emitters (a few dimmer ones)
      const L = fr.hw * 0.86, Hh = Math.min(fr.hh * 0.62, 0.34);
      ops.push({ k: 'rect', key: 'ledBody', cx: c.st.cx, cy: c.st.cy, hw: L, hh: Hh, ang: c.st.ang });
      ops.push({ k: 'rectLine', key: 'ledRim', cx: c.st.cx, cy: c.st.cy, hw: L, hh: Hh, ang: c.st.ang, w: 0.03 });
      const cnt = Math.max(8, Math.round((L * 2) / 0.26));
      const pitch = (L * 2 - 0.2) / cnt;
      for (let i = 0; i < cnt; i++) {
        const lx = -L + 0.1 + pitch * (i + 0.5);
        ops.push({ k: 'rect', key: i % 5 === 3 ? 'ledDim' : 'led', cx: c.st.cx + lx * ca, cy: c.st.cy + lx * sa, hw: pitch * 0.36, hh: Hh * 0.62, ang: c.st.ang });
      }
    }
  });

  /* gold crack lines (the self-healing membrane): random walks that start on a cell boundary and wander in. A few cells are
     almost crazed (dense webs), two carry a shatter star (impact point, radial cracks, broken rings) healed with gold. */
  const patchSet = new Set(patchCells);
  const crackFrom = (c, w0) => {
    const e = Math.floor(R() * c.pts.length);
    const p0 = c.pts[e], p1 = c.pts[(e + 1) % c.pts.length];
    const t = R.range(0.15, 0.85);
    let x = p0[0] + (p1[0] - p0[0]) * t, y = p0[1] + (p1[1] - p0[1]) * t;
    let ang = Math.atan2(c.st.cy - y, c.st.cx - x) + R.range(-0.7, 0.7);
    const steps = 4 + Math.floor(R() * 7);
    const line = [[x, y]];
    for (let s2 = 0; s2 < steps; s2++) {
      const l = R.range(0.16, 0.5);
      ang += R.range(-0.65, 0.65);
      const nx = x + Math.cos(ang) * l, ny = y + Math.sin(ang) * l;
      if (!pip(c.pts, nx, ny)) break;
      x = nx; y = ny; line.push([x, y]);
      if (R() < 0.3 && s2 > 0) {
        let bx = x, by = y, ba = ang + (R() < 0.5 ? 1 : -1) * R.range(0.6, 1.1);
        const br = [[bx, by]];
        for (let q = 0; q < 2 + Math.floor(R() * 3); q++) {
          ba += R.range(-0.5, 0.5);
          const mx = bx + Math.cos(ba) * R.range(0.12, 0.34), my = by + Math.sin(ba) * R.range(0.12, 0.34);
          if (!pip(c.pts, mx, my)) break;
          bx = mx; by = my; br.push([bx, by]);
        }
        if (br.length > 1) ops.push({ k: 'line', key: 'crack', pts: br, w: w0 * R.range(0.55, 0.75) });
      }
    }
    if (line.length > 1) ops.push({ k: 'line', key: 'crack', pts: line, w: w0 * R.range(0.9, 1.2) });
  };
  const crackPool = [...cells.keys()].filter((i) => cells[i].st.area > 0.8 && !patchSet.has(i)).sort(() => R() - 0.5);
  crackPool.slice(0, 14).forEach((ci, n) => {
    const cnt = n < 6 ? 5 + Math.floor(R() * 5) : 1 + Math.floor(R() * 3);
    for (let q = 0; q < cnt; q++) crackFrom(cells[ci], n < 6 ? 0.03 : 0.036);
  });
  const starCells = crackPool.slice(14).filter((i) => cells[i].st.area > 1.6).slice(0, 2);
  for (const ci of starCells) {
    const c = cells[ci];
    let px = c.st.cx + R.range(-0.25, 0.25), py = c.st.cy + R.range(-0.2, 0.2);
    if (!pip(c.pts, px, py)) { px = c.st.cx; py = c.st.cy; }
    const nR = 7 + Math.floor(R() * 4), ends = [];
    for (let k = 0; k < nR; k++) {
      let a = (k / nR) * 6.2832 + R.range(-0.25, 0.25), x = px, y = py;
      const line = [[x, y]], L = R.range(0.5, 1.1), nS = 3 + Math.floor(R() * 2);
      const rad = [];
      for (let q = 0; q < nS; q++) {
        a += R.range(-0.2, 0.2);
        const nx = x + Math.cos(a) * (L / nS), ny = y + Math.sin(a) * (L / nS);
        if (!pip(c.pts, nx, ny)) break;
        x = nx; y = ny; line.push([x, y]); rad.push([x, y]);
      }
      ends.push(rad);
      if (line.length > 1) ops.push({ k: 'line', key: 'crack', pts: line, w: R.range(0.022, 0.034) });
    }
    for (let q = 0; q < 2; q++) {
      for (let k = 0; k < nR; k++) {
        const A = ends[k][q], B = ends[(k + 1) % nR][q];
        if (A && B && R() < 0.55) ops.push({ k: 'line', key: 'crack', pts: [A, [(A[0] + B[0]) / 2 + R.range(-0.03, 0.03), (A[1] + B[1]) / 2 + R.range(-0.03, 0.03)], B], w: R.range(0.014, 0.022) });
      }
    }
    ops.push({ k: 'dot', key: 'crack', x: px, y: py, r: 0.05 });
  }

  /* circuit traces: Manhattan routes with 45 degree jogs, pads and tiny chips */
  const traceCells = [...cells.keys()].filter((i) => cells[i].st.area > 1.0).sort(() => R() - 0.5).slice(0, 9);
  for (const ci of traceCells) {
    const c = cells[ci];
    const nTr = 1 + Math.floor(R() * 3);
    for (let n = 0; n < nTr; n++) {
      let x = c.st.cx + R.range(-0.5, 0.5) * Math.sqrt(c.st.area) * 0.6, y = c.st.cy + R.range(-0.5, 0.5) * Math.sqrt(c.st.area) * 0.4;
      if (!pip(c.pts, x, y)) continue;
      let dir = Math.floor(R() * 8);
      const line = [[x, y]];
      const steps = 3 + Math.floor(R() * 5);
      for (let s = 0; s < steps; s++) {
        const l = R.range(0.22, 0.7);
        const a = (dir * Math.PI) / 4;
        const nx = x + Math.cos(a) * l, ny = y + Math.sin(a) * l;
        if (!pip(c.pts, nx, ny)) { dir = (dir + (R() < 0.5 ? 1 : 7)) % 8; continue; }
        x = nx; y = ny; line.push([x, y]);
        if (R() < 0.6) dir = (dir + (R() < 0.5 ? 1 : 7)) % 8;
      }
      if (line.length > 1) {
        ops.push({ k: 'line', key: 'trace', pts: line, w: R.range(0.024, 0.04) });
        const e0 = line[0], e1 = line[line.length - 1];
        ops.push({ k: 'dot', key: 'pad', x: e0[0], y: e0[1], r: R.range(0.05, 0.085) });
        ops.push({ k: 'dot', key: 'pad', x: e1[0], y: e1[1], r: R.range(0.04, 0.07) });
        if (R() < 0.35) ops.push({ k: 'rect', key: 'pad', cx: e1[0], cy: e1[1], hw: R.range(0.12, 0.2), hh: R.range(0.07, 0.12), ang: R.range(0, 3.14) });
      }
    }
  }

  /* engraved script lines: abstract strokes laid along the local cell axis (frosted etching) */
  const scriptCells = interior.slice(0, 7).filter((i) => i !== ledCell);
  for (const ci of scriptCells.slice(0, 5)) {
    const c = cells[ci];
    const ang = c.st.ang + R.range(-0.1, 0.1);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const sz = R.range(0.34, 0.5);
    const words = 1 + Math.floor(R() * 2);
    let ox = -0.5 * Math.sqrt(c.st.area) * 0.5;
    const oy = R.range(-0.25, 0.25) * Math.sqrt(c.st.area) * 0.5;
    for (let w = 0; w < words; w++) {
      const glyphs = 3 + Math.floor(R() * 5);
      for (let gI = 0; gI < glyphs; gI++) {
        const gw = sz * R.range(0.45, 0.85);
        const nS = 2 + Math.floor(R() * 3);
        for (let s = 0; s < nS; s++) {
          const a = [ox + R() * gw, oy + R() * sz], b = [ox + R() * gw, oy + R() * sz];
          const pa = [c.st.cx + a[0] * ca - a[1] * sa, c.st.cy + a[0] * sa + a[1] * ca], pb = [c.st.cx + b[0] * ca - b[1] * sa, c.st.cy + b[0] * sa + b[1] * ca];
          if (pip(c.pts, pa[0], pa[1]) && pip(c.pts, pb[0], pb[1])) ops.push({ k: 'line', key: 'script', pts: [pa, pb], w: R.range(0.018, 0.028) });
        }
        ox += gw * 1.3;
      }
      ox += sz * 0.8;
    }
  }
  return { ops, cells };
}

/* ------------------------------------------------------------------ canvas drawing */
function drawOps(g, mode, ops) {
  const path = (pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
  const rectPath = (o) => {
    const ca = Math.cos(o.ang), sa = Math.sin(o.ang);
    const q = [[-o.hw, -o.hh], [o.hw, -o.hh], [o.hw, o.hh], [-o.hw, o.hh]].map(([x, y]) => [o.cx + x * ca - y * sa, o.cy + x * sa + y * ca]);
    path(q); g.closePath();
  };
  g.lineJoin = 'round'; g.lineCap = 'round';
  for (const o of ops) {
    if (o.k === 'cell') {
      let c;
      if (mode === 'map') c = `hsl(${Math.round(207 + 26 * o.h)}, ${Math.round(26 + 8 * o.l)}%, ${Math.round(58 + 8 * o.l - 16 * o.s)}%)`;
      else if (mode === 'alpha') c = gray(ST.base[1] + 0.07 * o.a + 0.12 * o.s);
      else if (mode === 'rough') c = gray(ST.base[2] + 0.02 * o.a);
      else if (mode === 'irid') c = gray(o.t);
      else continue;
      path(o.pts); g.closePath(); g.fillStyle = c; g.fill();
      continue;
    }
    const c = col(mode, o.key);
    if (c == null) continue;
    if (mode === 'emis' && o.key !== 'led' && o.key !== 'ledDim') continue;
    if (o.k === 'rect') {
      rectPath(o);
      if (o.key === 'frost' && mode === 'map') {
        const ca = Math.cos(o.ang), sa = Math.sin(o.ang);
        const gr = g.createLinearGradient(o.cx - ca * o.hw, o.cy - sa * o.hw, o.cx + ca * o.hw, o.cy + sa * o.hw);
        gr.addColorStop(0, '#4f5b67'); gr.addColorStop(0.55, '#76838f'); gr.addColorStop(1, '#58646f');
        g.fillStyle = gr;
      } else g.fillStyle = c;
      g.fill();
    }
    else if (o.k === 'rectLine') { rectPath(o); g.strokeStyle = c; g.lineWidth = o.w; g.stroke(); }
    else if (o.k === 'hatch') {
      g.save(); rectPath(o); g.clip();
      const ca = Math.cos(o.ang), sa = Math.sin(o.ang), Rr = Math.hypot(o.hw, o.hh);
      const pt = (lx, ly) => [o.cx + lx * ca - ly * sa, o.cy + lx * sa + ly * ca];
      const cA = Math.cos(o.a), sA = Math.sin(o.a);
      g.strokeStyle = c; g.lineWidth = o.w;
      for (let sft = -Rr; sft <= Rr; sft += o.step) {
        const px = -sA * sft, py = cA * sft;
        const p0 = pt(px - cA * Rr, py - sA * Rr), p1 = pt(px + cA * Rr, py + sA * Rr);
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
      }
      g.restore();
    }
    else if (o.k === 'dot') { g.beginPath(); g.arc(o.x, o.y, o.r, 0, 6.2832); g.fillStyle = c; g.fill(); }
    else if (o.k === 'line') { path(o.pts); g.strokeStyle = c; g.lineWidth = o.w; g.stroke(); }
  }
}

/** Soft thin-film thickness variation: broad blobs over the per-cell offsets. */
function drawIrid(g, R) {
  for (let i = 0; i < 70; i++) {
    const x = R.range(2.5, XT), y = R.range(-8.6, 1.0), r = R.range(1.4, 4.2);
    const v = R() < 0.5 ? 255 : 0;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${v},${v},${v},${R.range(0.18, 0.4)})`);
    gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  // long streaks along the span (film flows toward the tip)
  for (let i = 0; i < 26; i++) {
    const y = R.range(-8.4, 0.8), x0 = R.range(3, 16), len = R.range(3, 9);
    const gr = g.createLinearGradient(x0, y, x0 + len, y + R.range(-0.8, 0.8));
    const v = R() < 0.5 ? 255 : 0;
    gr.addColorStop(0, `rgba(${v},${v},${v},0)`);
    gr.addColorStop(0.5, `rgba(${v},${v},${v},${R.range(0.1, 0.24)})`);
    gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.strokeStyle = gr; g.lineWidth = R.range(0.3, 1.1); g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + len, y + R.range(-0.5, 0.5)); g.stroke();
  }
}

/**
 * Build the membrane texture set. T = ctx.T (textures module). Q = quality tier.
 * Returns { map, alpha, rough, irid, emis, normal, W, H }
 */
export function makeMembraneTextures(T, net, Q) {
  const sc = Q.tier === 'high' ? 1 : Q.tier === 'medium' ? 0.75 : 0.5;
  const W = Math.round(2048 * sc), H = Math.round((W * MEM.YSPAN) / XT), PPM = W / XT;
  const { ops } = planOps(net);
  const base = (mode) => (g) => {
    g.setTransform(PPM, 0, 0, -PPM, 0, H + MEM.Y0 * PPM);
    g.fillStyle = mode === 'irid' ? gray(0.5) : col(mode, 'base') || '#000';
    g.fillRect(-1, MEM.Y0 - 1, XT + 2, MEM.YSPAN + 2);
    drawOps(g, mode, ops);
    if (mode === 'irid') drawIrid(g, mk(99));
  };
  const lin = { srgb: false, aniso: 8 };
  const map = T.canvasTex(W, H, base('map'), { srgb: true, aniso: 8 });
  const alpha = T.canvasTex(W, H, base('alpha'), lin);
  const rough = T.canvasTex(W, H, base('rough'), lin);
  const irid = T.canvasTex(W, H, base('irid'), lin);
  const emis = T.canvasTex(W, H, base('emis'), { srgb: true, aniso: 4 });
  for (const t of [map, alpha, rough, irid, emis]) { t.wrapS = t.wrapT = 1001; }   // ClampToEdge
  // micro relief: very low amplitude, two octaves of value noise (the glass is hand-blown, not optically flat)
  const nw = Math.round(640 * sc), nh = Math.round((nw * MEM.YSPAN) / XT);
  const hgt = new Float32Array(nw * nh);
  for (let j = 0; j < nh; j++) for (let i = 0; i < nw; i++) {
    const x = (i / nw) * XT, y = MEM.Y0 + (1 - j / nh) * MEM.YSPAN;
    hgt[j * nw + i] = 0.65 * vnoise(x * 0.7, y * 0.7, 5) + 0.35 * vnoise(x * 2.1, y * 2.1, 9) + 0.9 * vnoise(x * 0.26, y * 1.7, 13);
  }
  const normal = T.heightToNormal(nw, nh, (x, y) => hgt[y * nw + x], 1.6);
  normal.wrapS = normal.wrapT = 1001;
  return { map, alpha, rough, irid, emis, normal, W, H };
}

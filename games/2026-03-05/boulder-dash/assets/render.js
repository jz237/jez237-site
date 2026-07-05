// Emerald Mine II remake — procedural sprite atlas + tile rendering.
// Palette anchored to the original EM2 executable's color tables (see SPEC.md §4).
'use strict';

const PAL = {
  black: '#000000', dirtA: '#883311', dirtB: '#bb5522', dirtC: '#5e230b',
  gray1: '#555555', gray2: '#777777', gray3: '#999999', gray4: '#dddddd',
  emA: '#226622', emB: '#55dd55', emC: '#8dfa8d',
  diA: '#1155ff', diB: '#99bbff', diC: '#ffffff',
  red: '#ff2222', darkred: '#cc0033', orange: '#ff6600', yellow: '#dddd00',
  green: '#00aa00', dgreen: '#007700', tan: '#cc7744', brown: '#884400',
  blue: '#4477ff', pblue: '#99bbff', cap: '#aaaaaa', trous: '#0055bb',
  amoA: '#7a3414', amoB: '#a04a1c', amoC: '#c26a30',
  sandA: '#a98858', sandB: '#c7a878',
};
const KEYCOL = ['#ff3333', '#eecc22', '#33cc44', '#3366ff']; // red yellow green blue
const R = (seed) => { let s = seed >>> 0 || 1; return () => (s = (Math.imul(s, 1103515245) + 12345) >>> 0, (s >>> 9) / 0x7fffff % 1); };

// ─── atlas ───
class Atlas {
  constructor(S) { this.S = S; this.cache = new Map(); }
  get(key, painter) {
    let c = this.cache.get(key);
    if (!c) {
      c = document.createElement('canvas'); c.width = c.height = this.S;
      const ctx = c.getContext('2d');
      painter(ctx, this.S);
      this.cache.set(key, c);
    }
    return c;
  }
}

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// ─── painters (S = tile px) ───
const P = {};

P.dirt = (v) => (ctx, S) => {
  const rnd = R(41 + v * 7);
  ctx.fillStyle = PAL.dirtA; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < S * 2.2; i++) {
    ctx.fillStyle = rnd() < 0.72 ? PAL.dirtB : (rnd() < 0.5 ? PAL.dirtC : PAL.black);
    const s = 1 + rnd() * S / 14;
    ctx.fillRect(rnd() * S, rnd() * S, s, s);
  }
};
P.sand = (v) => (ctx, S) => {
  const rnd = R(97 + v * 5);
  ctx.fillStyle = PAL.sandA; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < S * 2; i++) {
    ctx.fillStyle = rnd() < 0.6 ? PAL.sandB : PAL.dirtC;
    ctx.fillRect(rnd() * S, rnd() * S, 2, 2);
  }
};
P.sand_stone = (v) => (ctx, S) => { P.sand(v)(ctx, S); ctx.globalAlpha = 0.85; P.stone(0)(ctx, S); ctx.globalAlpha = 1; };

P.steel = (v) => (ctx, S) => {
  ctx.fillStyle = PAL.black; ctx.fillRect(0, 0, S, S);
  const h = S / 2;
  for (let py = 0; py < 2; py++) for (let px = 0; px < 2; px++) {
    const x = px * h, y = py * h, m = S / 22;
    ctx.fillStyle = PAL.gray3; ctx.fillRect(x + m / 2, y + m / 2, h - m, h - m);
    ctx.fillStyle = PAL.gray4; ctx.fillRect(x + m / 2, y + m / 2, h - m, m);         // top bevel
    ctx.fillRect(x + m / 2, y + m / 2, m, h - m);                                     // left bevel
    ctx.fillStyle = PAL.gray1; ctx.fillRect(x + m / 2, y + h - m * 1.5, h - m, m);   // bottom
    ctx.fillRect(x + h - m * 1.5, y + m / 2, m, h - m);
  }
};
P.wall = (v) => (ctx, S) => {
  const rnd = R(7 + v * 3);
  ctx.fillStyle = PAL.black; ctx.fillRect(0, 0, S, S);
  const rows = 2, bh = S / rows;
  for (let r0 = 0; r0 < rows; r0++) {
    const off = r0 % 2 ? S / 3 : 0;
    for (let b = -1; b < 2; b++) {
      const x = b * (S / 1.5) + off + S / 30, y = r0 * bh + S / 30;
      const w = S / 1.5 - S / 15, h = bh - S / 15;
      ctx.fillStyle = `rgb(${140 + rnd() * 25},${140 + rnd() * 25},${145 + rnd() * 25})`;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x, y, w, S / 22); ctx.fillRect(x, y, S / 22, h);
      ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x, y + h - S / 22, w, S / 22);
    }
  }
};
P.roundwall = (v) => (ctx, S) => {
  const rnd = R(13 + v * 11);
  ctx.fillStyle = PAL.black; ctx.fillRect(0, 0, S, S);
  for (let r0 = 0; r0 < 3; r0++) for (let cbl = 0; cbl < 3; cbl++) {
    const x = cbl * S / 3 + (r0 % 2 ? S / 6 : 0) - S / 6, y = r0 * S / 3;
    ctx.fillStyle = `rgb(${135 + rnd() * 30},${135 + rnd() * 30},${140 + rnd() * 30})`;
    rr(ctx, x + S / 40, y + S / 40, S / 3 - S / 20, S / 3 - S / 20, S / 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath(); ctx.ellipse(x + S / 8, y + S / 10, S / 12, S / 18, -0.5, 0, 7); ctx.fill();
  }
};
P.letter = (g) => (ctx, S) => {
  P.wall(2)(ctx, S);
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(S * 0.08, S * 0.08, S * 0.84, S * 0.84);
  if (g && !g.startsWith('#')) {
    ctx.fillStyle = PAL.emB; ctx.font = `900 ${S * 0.62}px 'Courier New', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = PAL.dgreen; ctx.shadowBlur = S / 10;
    ctx.fillText(g, S / 2, S * 0.56);
  } else {
    ctx.fillStyle = PAL.gray2; ctx.fillRect(S * 0.2, S * 0.2, S * 0.6, S * 0.6);
    ctx.fillStyle = PAL.gray3; ctx.fillRect(S * 0.28, S * 0.28, S * 0.44, S * 0.44);
  }
};
P.plant = (v) => (ctx, S) => {
  const rnd = R(3 + v);
  for (let i = 0; i < 7; i++) {
    const x = S * (0.15 + rnd() * 0.7), h = S * (0.35 + rnd() * 0.5);
    ctx.strokeStyle = i % 2 ? PAL.green : PAL.dgreen; ctx.lineWidth = S / 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, S); ctx.quadraticCurveTo(x + (rnd() - 0.5) * S / 3, S - h / 2, x + (rnd() - 0.5) * S / 2, S - h);
    ctx.stroke();
  }
};

P.stone = (v) => (ctx, S) => {
  const rnd = R(19 + v * 17);
  const cx = S / 2, cy = S / 2 + S * 0.03, rad = S * 0.46;
  ctx.beginPath();
  for (let a = 0; a <= 15; a++) {
    const th = a / 15 * Math.PI * 2, rj = rad * (0.92 + rnd() * 0.13);
    const px = cx + Math.cos(th) * rj, py = cy + Math.sin(th) * rj * 0.95;
    a ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
  const gr = ctx.createRadialGradient(cx - rad / 3, cy - rad / 2, rad / 5, cx, cy, rad * 1.2);
  gr.addColorStop(0, PAL.gray4); gr.addColorStop(0.35, PAL.gray3); gr.addColorStop(1, PAL.gray1);
  ctx.fillStyle = gr; ctx.fill();
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = rnd() < 0.6 ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.25)';
    const px = cx + (rnd() - 0.5) * rad * 1.5, py = cy + (rnd() - 0.5) * rad * 1.5;
    if ((px - cx) ** 2 + (py - cy) ** 2 < rad * rad * 0.8) ctx.fillRect(px, py, S / 18 + rnd() * S / 20, S / 22 + rnd() * S / 24);
  }
};
P.emerald = (f) => (ctx, S) => {
  const cx = S / 2, cy = S / 2, w = S * 0.42, h = S * 0.47;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h); ctx.lineTo(cx + w, cy - h * 0.35); ctx.lineTo(cx + w, cy + h * 0.35);
  ctx.lineTo(cx, cy + h); ctx.lineTo(cx - w, cy + h * 0.35); ctx.lineTo(cx - w, cy - h * 0.35);
  ctx.closePath();
  ctx.fillStyle = PAL.emA; ctx.fill();
  ctx.fillStyle = PAL.emB;
  ctx.beginPath(); ctx.moveTo(cx, cy - h * 0.75); ctx.lineTo(cx + w * 0.6, cy - h * 0.15); ctx.lineTo(cx, cy + h * 0.35); ctx.lineTo(cx - w * 0.6, cy - h * 0.15); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = S / 40; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = S / 26;
  ctx.beginPath(); ctx.moveTo(cx - w * 0.45, cy - h * 0.55); ctx.lineTo(cx + w * 0.1, cy - h * 0.05); ctx.stroke();
  if (f >= 6) { // sparkle
    const sx = cx + (f === 6 ? -w * 0.3 : w * 0.35), sy = cy - h * (f === 6 ? 0.5 : 0.1);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = S / 30;
    ctx.beginPath(); ctx.moveTo(sx - S / 10, sy); ctx.lineTo(sx + S / 10, sy); ctx.moveTo(sx, sy - S / 10); ctx.lineTo(sx, sy + S / 10); ctx.stroke();
  }
};
P.diamond = (f) => (ctx, S) => {
  const cx = S / 2, cy = S / 2, w = S * 0.4, top = cy - S * 0.32, mid = cy - S * 0.1, bot = cy + S * 0.44;
  ctx.beginPath(); ctx.moveTo(cx - w, mid); ctx.lineTo(cx - w * 0.5, top); ctx.lineTo(cx + w * 0.5, top);
  ctx.lineTo(cx + w, mid); ctx.lineTo(cx, bot); ctx.closePath();
  const gr = ctx.createLinearGradient(0, top, 0, bot);
  gr.addColorStop(0, PAL.diC); gr.addColorStop(0.35, PAL.diB); gr.addColorStop(1, PAL.diA);
  ctx.fillStyle = gr; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,60,.5)'; ctx.lineWidth = S / 40; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = S / 44;
  ctx.beginPath(); ctx.moveTo(cx - w * 0.55, mid); ctx.lineTo(cx, bot); ctx.lineTo(cx + w * 0.55, mid);
  ctx.moveTo(cx - w, mid); ctx.lineTo(cx + w, mid); ctx.stroke();
  if (f >= 6) {
    const sx = cx + (f === 6 ? -w * 0.5 : w * 0.55), sy = top + (f === 6 ? S * 0.05 : S * 0.16);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = S / 28;
    ctx.beginPath(); ctx.moveTo(sx - S / 9, sy); ctx.lineTo(sx + S / 9, sy); ctx.moveTo(sx, sy - S / 9); ctx.lineTo(sx, sy + S / 9); ctx.stroke();
  }
};
P.bomb = () => (ctx, S) => {
  const cx = S / 2, cy = S / 2 + S * 0.04, rad = S * 0.4;
  const gr = ctx.createRadialGradient(cx - rad / 3, cy - rad / 2.4, rad / 6, cx, cy, rad * 1.15);
  gr.addColorStop(0, '#ff7766'); gr.addColorStop(0.4, PAL.red); gr.addColorStop(1, PAL.darkred);
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.beginPath(); ctx.arc(cx - rad * 0.35, cy - rad * 0.45, S / 22, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(cx - rad * 0.15, cy - rad * 0.55, S / 34, 0, 7); ctx.fill();
  ctx.fillStyle = PAL.gray1; ctx.fillRect(cx - S / 16, cy - rad - S / 14, S / 8, S / 10);
};
P.nut = () => (ctx, S) => {
  const cx = S / 2, cy = S / 2 + S * 0.05;
  ctx.fillStyle = '#e8d9b8';
  ctx.beginPath(); ctx.ellipse(cx, cy + S * 0.05, S * 0.3, S * 0.34, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = S / 40; ctx.stroke();
  ctx.fillStyle = PAL.brown;
  ctx.beginPath(); ctx.ellipse(cx, cy - S * 0.16, S * 0.32, S * 0.16, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(cx - S * 0.32, cy - S * 0.2, S * 0.64, S * 0.1);
  ctx.fillStyle = PAL.tan; ctx.fillRect(cx - S / 30, cy - S * 0.34, S / 15, S / 9);
};
P.dynamite_item = () => (ctx, S) => {
  ctx.save(); ctx.translate(S / 2, S / 2); ctx.rotate(-0.15);
  for (let i = -1; i <= 1; i++) {
    ctx.fillStyle = i ? PAL.darkred : PAL.red;
    rr(ctx, i * S / 6 - S / 14, -S * 0.32, S / 7, S * 0.64, S / 28); ctx.fill();
  }
  ctx.strokeStyle = '#eee'; ctx.lineWidth = S / 32;
  ctx.beginPath(); ctx.moveTo(0, -S * 0.32); ctx.quadraticCurveTo(S / 6, -S * 0.46, S / 4, -S * 0.4); ctx.stroke();
  ctx.restore();
};
P.dyn = (stage) => (ctx, S) => {
  P.dynamite_item()(ctx, S);
  const t = stage / 4;
  ctx.fillStyle = PAL.yellow;
  ctx.beginPath(); ctx.arc(S * 0.72, S * 0.12 + t * S * 0.1, S / 14 + (stage % 2) * S / 26, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(S * 0.72, S * 0.12 + t * S * 0.1, S / 30, 0, 7); ctx.fill();
};
P.key = (n) => (ctx, S) => {
  ctx.save(); ctx.translate(S / 2, S / 2); ctx.rotate(0.5);
  ctx.strokeStyle = KEYCOL[n]; ctx.fillStyle = KEYCOL[n]; ctx.lineWidth = S / 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-S / 5, 0, S / 8, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-S / 12, 0); ctx.lineTo(S / 3, 0); ctx.stroke();
  ctx.fillRect(S / 5, 0, S / 14, S / 7); ctx.fillRect(S / 3.2, 0, S / 14, S / 5);
  ctx.restore();
};
P.door = (n, fake) => (ctx, S) => {
  const col = fake ? PAL.gray2 : KEYCOL[n];
  ctx.fillStyle = PAL.black; ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = col; ctx.fillRect(S / 20, S / 20, S - S / 10, S - S / 10);
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(S / 20, S / 20, S - S / 10, S / 14);
  ctx.fillRect(S / 20, S / 20, S / 14, S - S / 10);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(S / 20, S - S / 20 - S / 14, S - S / 10, S / 14);
  ctx.fillStyle = PAL.black;
  ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 10, 0, 7); ctx.fill();
  ctx.fillRect(S / 2 - S / 24, S / 2, S / 12, S / 5);
};
P.exit = (open, f) => (ctx, S) => {
  ctx.fillStyle = PAL.black; ctx.fillRect(0, 0, S, S);
  const glow = open ? 0.55 + 0.45 * Math.sin(f * 2.1) : 0.15;
  ctx.fillStyle = open ? `rgba(68,119,255,${glow})` : '#122';
  ctx.beginPath(); ctx.moveTo(S * 0.12, S); ctx.lineTo(S * 0.12, S * 0.45);
  ctx.arc(S / 2, S * 0.45, S * 0.38, Math.PI, 0); ctx.lineTo(S * 0.88, S); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = open ? PAL.pblue : PAL.gray1; ctx.lineWidth = S / 16; ctx.stroke();
  if (open) {
    ctx.fillStyle = `rgba(220,240,255,${glow * 0.7})`;
    ctx.beginPath(); ctx.moveTo(S * 0.3, S); ctx.lineTo(S * 0.3, S * 0.5);
    ctx.arc(S / 2, S * 0.5, S * 0.2, Math.PI, 0); ctx.lineTo(S * 0.7, S); ctx.closePath(); ctx.fill();
  }
};
P.wonderwall = (active, f) => (ctx, S) => {
  ctx.fillStyle = '#0a1030'; ctx.fillRect(0, 0, S, S);
  for (let r0 = 0; r0 < 2; r0++) for (let b = 0; b < 2; b++) {
    const x = b * S / 2 + (r0 % 2 ? S / 4 : 0) - S / 4, y = r0 * S / 2;
    ctx.fillStyle = '#20308a'; ctx.fillRect(x + S / 30, y + S / 30, S / 2 - S / 15, S / 2 - S / 15);
    ctx.fillStyle = 'rgba(120,160,255,.5)'; ctx.fillRect(x + S / 30, y + S / 30, S / 2 - S / 15, S / 20);
  }
  if (active) {
    const rnd = R(50 + f);
    ctx.fillStyle = '#cfe0ff';
    for (let i = 0; i < 7; i++) {
      const x = rnd() * S, y = ((rnd() * S + f * S / 4) % S);
      ctx.fillRect(x, y, S / 26, S / 9);
    }
  }
};
P.wheel = (f) => (ctx, S) => {
  const cx = S / 2, cy = S / 2;
  ctx.fillStyle = PAL.black; ctx.beginPath(); ctx.arc(cx, cy, S * 0.46, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(f * 0.5);
  ctx.strokeStyle = PAL.yellow; ctx.lineWidth = S / 12;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath(); ctx.arc(0, 0, S * 0.38, -0.25, 0.25); ctx.stroke();
  }
  ctx.strokeStyle = PAL.orange; ctx.lineWidth = S / 14;
  for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(S * 0.3, 0); ctx.stroke(); }
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(0, 0, S / 9, 0, 7); ctx.fill();
  ctx.restore();
};
P.acid = (f) => (ctx, S) => {
  ctx.fillStyle = PAL.orange; ctx.fillRect(0, S * 0.25, S, S * 0.75);
  ctx.fillStyle = '#331100'; ctx.fillRect(0, 0, S, S * 0.25);
  const rnd = R(60);
  ctx.fillStyle = PAL.red;
  for (let i = 0; i < 6; i++) {
    const x = (rnd() * S + f * S / 8 * (i % 2 ? 1 : -1)) % S;
    const y = S * 0.3 + rnd() * S * 0.6;
    ctx.beginPath(); ctx.arc((x + S) % S, y, S / 14 * (0.6 + rnd()), 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#ffaa44';
  const bx = (f * S / 8) % S;
  ctx.beginPath(); ctx.arc(bx, S * 0.28, S / 18, 0, 7); ctx.fill();
};
P.acid_frame = (kind) => (ctx, S) => {
  ctx.fillStyle = '#331100'; ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = PAL.gray1;
  if (kind === 'nw') { ctx.beginPath(); ctx.moveTo(0, S); ctx.lineTo(S, S); ctx.lineTo(S, S * 0.55); ctx.quadraticCurveTo(S * 0.2, S * 0.5, 0, 0); ctx.closePath(); ctx.fill(); }
  if (kind === 'ne') { ctx.beginPath(); ctx.moveTo(S, S); ctx.lineTo(0, S); ctx.lineTo(0, S * 0.55); ctx.quadraticCurveTo(S * 0.8, S * 0.5, S, 0); ctx.closePath(); ctx.fill(); }
  if (kind === 'sw' || kind === 'se' || kind === 's') { ctx.fillRect(0, 0, S, S); ctx.fillStyle = '#442200'; ctx.fillRect(S * 0.1, 0, S * 0.8, S * 0.2); }
};
P.amoeba = (f) => (ctx, S) => {
  const rnd = R(70 + f * 3);
  ctx.fillStyle = PAL.amoA; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 ? PAL.amoB : PAL.amoC;
    const x = rnd() * S, y = rnd() * S, rad = S / 9 + rnd() * S / 7 + Math.sin(f * 1.6 + i) * S / 30;
    ctx.beginPath(); ctx.ellipse(x, y, rad, rad * (0.5 + rnd() * 0.4), rnd() * 3, 0, 7); ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(rnd() * S, rnd() * S, S / 26, 0, 7); ctx.fill(); }
};
P.drip = (falling) => (ctx, S) => {
  ctx.fillStyle = PAL.emB;
  ctx.beginPath();
  ctx.ellipse(S / 2, S * (falling ? 0.55 : 0.4), S * 0.16, S * (falling ? 0.34 : 0.22), 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = PAL.dgreen;
  ctx.beginPath(); ctx.ellipse(S / 2, S * (falling ? 0.62 : 0.46), S * 0.09, S * 0.13, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.beginPath(); ctx.arc(S * 0.44, S * (falling ? 0.4 : 0.3), S / 24, 0, 7); ctx.fill();
};
P.boom = (stage) => (ctx, S) => {
  const cx = S / 2, cy = S / 2;
  const g1 = ctx.createRadialGradient(cx, cy, S / 12, cx, cy, S * 0.52);
  if (stage === 1) { g1.addColorStop(0, '#fff8cc'); g1.addColorStop(0.4, PAL.yellow); g1.addColorStop(0.75, PAL.orange); g1.addColorStop(1, 'rgba(204,0,51,.5)'); }
  else { g1.addColorStop(0, '#ffd090'); g1.addColorStop(0.5, PAL.orange); g1.addColorStop(1, 'rgba(80,10,0,.6)'); }
  ctx.fillStyle = g1;
  const rnd = R(stage * 31);
  ctx.beginPath();
  for (let a = 0; a <= 14; a++) {
    const th = a / 14 * Math.PI * 2, rj = S * (0.36 + rnd() * 0.16);
    a ? ctx.lineTo(cx + Math.cos(th) * rj, cy + Math.sin(th) * rj) : ctx.moveTo(cx + Math.cos(th) * rj, cy);
  }
  ctx.closePath(); ctx.fill();
};
P.splash = (dir) => (ctx, S) => {
  ctx.strokeStyle = PAL.orange; ctx.lineWidth = S / 14; ctx.lineCap = 'round';
  const m = dir === 'e' ? 1 : -1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(S / 2 - m * S / 8, S * 0.85);
    ctx.quadraticCurveTo(S / 2 + m * S * (0.1 + i * 0.12), S * (0.45 - i * 0.1), S / 2 + m * S * (0.05 + i * 0.16), S * (0.3 - i * 0.06));
    ctx.stroke();
  }
  ctx.fillStyle = PAL.yellow;
  ctx.beginPath(); ctx.arc(S / 2 + m * S / 5, S / 4, S / 22, 0, 7); ctx.fill();
};
P.fake_blank = () => () => {}; // invisible wall: renders as nothing

// bug: silver rhombus casing, red spider core; 2 phases
P.bug = (dir, phase) => (ctx, S) => {
  const cx = S / 2, cy = S / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate([0, Math.PI / 2, Math.PI, -Math.PI / 2][dir]);
  const w = phase ? S * 0.34 : S * 0.42;
  const gr = ctx.createLinearGradient(-w, -w, w, w);
  gr.addColorStop(0, PAL.gray4); gr.addColorStop(0.5, PAL.gray3); gr.addColorStop(1, PAL.gray1);
  ctx.fillStyle = gr;
  if (phase) { rr(ctx, -w, -w, w * 2, w * 2, w * 0.7); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(0, -S * 0.44); ctx.lineTo(w, 0); ctx.lineTo(0, S * 0.44); ctx.lineTo(-w, 0); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = S / 30; ctx.stroke();
  ctx.fillStyle = PAL.black; ctx.beginPath(); ctx.arc(0, 0, S / 6, 0, 7); ctx.fill();
  ctx.strokeStyle = PAL.red; ctx.lineWidth = S / 26; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2 + phase * 0.3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * S / 7, Math.sin(a) * S / 7); ctx.stroke();
  }
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(0, 0, S / 18, 0, 7); ctx.fill();
  ctx.restore();
};
// tank: pale blue egg, red legs
P.tank = (dir, phase) => (ctx, S) => {
  const cx = S / 2, cy = S / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate([0, Math.PI / 2, Math.PI, -Math.PI / 2][dir]);
  ctx.strokeStyle = PAL.red; ctx.lineWidth = S / 16; ctx.lineCap = 'round';
  for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 4; i++) {
    const y = -S * 0.28 + i * S * 0.19, sw = phase && i % 2 ? 0.14 : 0.08;
    ctx.beginPath(); ctx.moveTo(s * S * 0.2, y); ctx.lineTo(s * S * (0.3 + sw), y + S * 0.06); ctx.stroke();
  }
  const gr = ctx.createRadialGradient(-S / 10, -S / 8, S / 10, 0, 0, S * 0.42);
  gr.addColorStop(0, '#cfe2ff'); gr.addColorStop(0.5, PAL.pblue); gr.addColorStop(1, PAL.blue);
  ctx.fillStyle = gr;
  ctx.beginPath(); ctx.ellipse(0, 0, S * 0.24, S * 0.4, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,80,.4)'; ctx.lineWidth = S / 40; ctx.stroke();
  const rnd = R(5);
  ctx.fillStyle = 'rgba(30,60,200,.5)';
  for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((rnd() - 0.5) * S * 0.4, (rnd() - 0.5) * S * 0.7, S / 30, 0, 7); ctx.fill(); }
  ctx.fillStyle = PAL.yellow; ctx.beginPath(); ctx.arc(0, S * 0.32, S / 18, 0, 7); ctx.fill();
  ctx.restore();
};
// eater: gray round head with big chomping mouth
P.eater = (dir, phase) => (ctx, S) => {
  const cx = S / 2, cy = S / 2;
  const gr = ctx.createRadialGradient(cx - S / 8, cy - S / 8, S / 10, cx, cy, S * 0.46);
  gr.addColorStop(0, PAL.gray3); gr.addColorStop(1, PAL.gray1);
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, S * 0.44, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = S / 34; ctx.stroke();
  // eyes
  ctx.fillStyle = PAL.black;
  ctx.beginPath(); ctx.arc(cx - S / 7, cy - S / 7, S / 13, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + S / 7, cy - S / 7, S / 13, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - S / 7 + S / 40, cy - S / 7 - S / 40, S / 34, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + S / 7 + S / 40, cy - S / 7 - S / 40, S / 34, 0, 7); ctx.fill();
  // mouth (chomp)
  const mh = phase ? S * 0.26 : S * 0.1;
  ctx.fillStyle = PAL.black;
  ctx.beginPath(); ctx.ellipse(cx, cy + S / 6, S * 0.26, mh, 0, 0, 7); ctx.fill();
  ctx.fillStyle = PAL.red;
  ctx.beginPath(); ctx.ellipse(cx, cy + S / 6 + mh * 0.3, S * 0.18, mh * 0.55, 0, 0, 7); ctx.fill();
  if (phase) {
    ctx.fillStyle = '#fff';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(cx + i * S / 10 - S / 26, cy + S / 6 - mh); ctx.lineTo(cx + i * S / 10, cy + S / 6 - mh + S / 10); ctx.lineTo(cx + i * S / 10 + S / 26, cy + S / 6 - mh); ctx.fill(); }
  }
};
// alien: green biped with antennae
P.alien = (phase) => (ctx, S) => {
  const cx = S / 2;
  ctx.strokeStyle = PAL.green; ctx.lineWidth = S / 18; ctx.lineCap = 'round';
  // antennae
  ctx.beginPath(); ctx.moveTo(cx - S / 10, S * 0.22); ctx.lineTo(cx - S / 5, S * 0.08); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + S / 10, S * 0.22); ctx.lineTo(cx + S / 5, S * 0.08); ctx.stroke();
  ctx.fillStyle = PAL.emB; ctx.beginPath(); ctx.arc(cx - S / 5, S * 0.08, S / 26, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + S / 5, S * 0.08, S / 26, 0, 7); ctx.fill();
  // head
  const gr = ctx.createRadialGradient(cx - S / 12, S * 0.3, S / 14, cx, S * 0.34, S / 4);
  gr.addColorStop(0, PAL.emB); gr.addColorStop(1, PAL.dgreen);
  ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(cx, S * 0.33, S / 4.2, S / 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = PAL.black;
  ctx.beginPath(); ctx.ellipse(cx - S / 11, S * 0.31, S / 22, S / 15, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + S / 11, S * 0.31, S / 22, S / 15, 0, 0, 7); ctx.fill();
  // body
  ctx.fillStyle = PAL.dgreen;
  rr(ctx, cx - S / 6, S * 0.46, S / 3, S * 0.3, S / 12); ctx.fill();
  // legs (walk)
  ctx.strokeStyle = PAL.dgreen; ctx.lineWidth = S / 12;
  const sp = phase ? S / 8 : S / 16;
  ctx.beginPath(); ctx.moveTo(cx - S / 12, S * 0.74); ctx.lineTo(cx - sp, S * 0.94); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + S / 12, S * 0.74); ctx.lineTo(cx + sp, S * 0.94); ctx.stroke();
  // arms
  ctx.lineWidth = S / 16;
  ctx.beginPath(); ctx.moveTo(cx - S / 6, S * 0.52); ctx.lineTo(cx - S / 3.2, S * (phase ? 0.6 : 0.66)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + S / 6, S * 0.52); ctx.lineTo(cx + S / 3.2, S * (phase ? 0.66 : 0.6)); ctx.stroke();
};
// player: miner — cap, tan face, green shirt, blue trousers; p2 red shirt
P.playerSpr = (dirX, walk, p2, digging) => (ctx, S) => {
  const cx = S / 2, m = dirX >= 0 ? 1 : -1;
  ctx.save(); if (m < 0) { ctx.translate(S, 0); ctx.scale(-1, 1); }
  const bob = walk % 2 ? S / 40 : 0;
  // legs
  ctx.strokeStyle = PAL.trous; ctx.lineWidth = S / 8; ctx.lineCap = 'round';
  const lsp = walk % 2 ? S / 9 : S / 22;
  ctx.beginPath(); ctx.moveTo(cx - S / 20, S * 0.72); ctx.lineTo(cx - lsp, S * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + S / 20, S * 0.72); ctx.lineTo(cx + lsp, S * 0.95); ctx.stroke();
  // boots
  ctx.fillStyle = PAL.brown;
  ctx.fillRect(cx - lsp - S / 16, S * 0.92, S / 7, S / 16);
  ctx.fillRect(cx + lsp - S / 16, S * 0.92, S / 7, S / 16);
  // torso
  ctx.fillStyle = p2 ? PAL.darkred : PAL.dgreen;
  rr(ctx, cx - S / 5.5, S * 0.42 + bob, S / 2.75, S * 0.32, S / 16); ctx.fill();
  // arm
  ctx.strokeStyle = p2 ? PAL.red : PAL.green; ctx.lineWidth = S / 11;
  ctx.beginPath(); ctx.moveTo(cx + S / 8, S * 0.48 + bob);
  if (digging) ctx.lineTo(cx + S / 2.6, S * 0.52);
  else ctx.lineTo(cx + S / 6, S * (walk % 2 ? 0.68 : 0.62));
  ctx.stroke();
  // head
  ctx.fillStyle = PAL.tan;
  ctx.beginPath(); ctx.arc(cx + S / 24, S * 0.3 + bob, S / 6.4, 0, 7); ctx.fill();
  ctx.fillStyle = PAL.brown; ctx.fillRect(cx - S / 8, S * 0.3 + bob, S / 16, S / 10); // hair at nape
  // cap
  ctx.fillStyle = PAL.cap;
  ctx.beginPath(); ctx.arc(cx + S / 24, S * 0.27 + bob, S / 5.8, Math.PI, 0); ctx.fill();
  ctx.fillRect(cx + S / 24, S * 0.22 + bob, S / 4.5, S / 18); // brim forward
  ctx.fillStyle = PAL.gray4; ctx.fillRect(cx - S / 9, S * 0.2 + bob, S / 5, S / 24);
  // eye
  ctx.fillStyle = PAL.black; ctx.beginPath(); ctx.arc(cx + S / 9, S * 0.3 + bob, S / 30, 0, 7); ctx.fill();
  ctx.restore();
};

// name -> painter resolver used by the game renderer
function makePainterFor(name, glyph) {
  if (name === 'dirt' || name === 'fake_dirt') return v => P.dirt(v);
  if (name === 'sand') return v => P.sand(v);
  if (name === 'sand_stonein' || name === 'sand_stone' || name === 'sand_stoneout') return () => P.sand_stone(0);
  if (name === 'steel' || name === 'border') return v => P.steel(v);
  if (name === 'wall') return v => P.wall(v);
  if (name === 'roundwall') return v => P.roundwall(v);
  if (name === 'letter') return () => P.letter(glyph);
  if (name === 'plant') return v => P.plant(v);
  if (name.startsWith('stone')) return v => P.stone(v);
  if (name.startsWith('emerald')) return (v, f) => P.emerald(f);
  if (name.startsWith('diamond')) return (v, f) => P.diamond(f);
  if (name.startsWith('bomb')) return () => P.bomb();
  if (name.startsWith('nut')) return () => P.nut();
  if (name === 'dynamite_item') return () => P.dynamite_item();
  if (name.startsWith('dyn')) return () => P.dyn(+name[3] || 1);
  if (name.startsWith('key')) return () => P.key(+name[3] - 1);
  if (name.startsWith('door')) return () => P.door(+name[4] - 1, false);
  if (name.startsWith('fdoor')) return () => P.door(+name[5] - 1, true);
  if (name === 'exit_closed') return () => P.exit(false, 0);
  if (name === 'exit_open') return (v, f) => P.exit(true, f);
  if (name === 'wonderwall') return (v, f, active) => P.wonderwall(active, f);
  if (name === 'wheel') return (v, f, active) => P.wheel(active ? f : 0);
  if (name === 'acid') return (v, f) => P.acid(f);
  if (name === 'acid_nw') return () => P.acid_frame('nw');
  if (name === 'acid_ne') return () => P.acid_frame('ne');
  if (name === 'acid_sw') return () => P.acid_frame('sw');
  if (name === 'acid_se') return () => P.acid_frame('se');
  if (name === 'acid_base') return () => P.acid_frame('s');
  if (name === 'amoeba' || name === 'fake_amoeba') return (v, f) => P.amoeba((v + f) % 4);
  if (name === 'drip') return () => P.drip(false);
  if (name === 'drip_f' || name === 'drip_s') return () => P.drip(true);
  if (name === 'drip_sB') return () => P.fake_blank();
  if (name === 'boom1') return () => P.boom(1);
  if (name === 'boom2' || name === 'chain') return () => P.boom(2);
  if (name === 'splash_e') return () => P.splash('e');
  if (name === 'splash_w') return () => P.splash('w');
  if (name === 'fake_blank' || name === 'blank' || name === 'vanish' || name === 'claimed' || name === 'player') return () => P.fake_blank();
  if (name.startsWith('bug')) { const dir = ['n', 'e', 's', 'w'].indexOf(name.slice(-1)); return (v, f) => P.bug(dir, f % 2); }
  if (name.startsWith('tank')) { const dir = ['n', 'e', 's', 'w'].indexOf(name.slice(-1)); return (v, f) => P.tank(dir, f % 2); }
  if (name.startsWith('eater')) { const dir = ['n', 'e', 's', 'w'].indexOf(name.slice(-1)); return (v, f) => P.eater(dir, f % 2); }
  if (name === 'alien' || name === 'alien_p') return (v, f) => P.alien(f % 2);
  return () => P.fake_blank();
}

if (typeof module !== 'undefined') module.exports = { Atlas, P, PAL, makePainterFor };

/* Steel Duel — rendering, particles, track marks, 1974-mode shader. window.SDArt */
(function () {
  'use strict';

  const THEMES = {
    hd: {
      bg0: '#0a0d13', bg1: '#141b27', grid: 'rgba(120,150,200,0.05)',
      floor0: '#11151d', floor1: '#0c0f16',
      wallFace: '#2a3343', wallTop: '#46526a', wallLo: '#161b25', wallEdge: '#5d6c89',
      p1: '#ffb347', p1d: '#9c5e16', p1g: 'rgba(255,179,71,0.55)',
      p2: '#46d6e8', p2d: '#1c7e8d', p2g: 'rgba(70,214,232,0.55)',
      mine: '#ff4f7b', mineCore: '#ffd23f', shell: '#fff4c2', shellHot: '#fffff0',
      ink: '#eef3ff', inkDim: '#8fa0bd',
    },
    classic: {
      bg0: '#000', bg1: '#000', grid: 'rgba(255,255,255,0.04)',
      floor0: '#050505', floor1: '#000',
      wallFace: '#d0d0d0', wallTop: '#ffffff', wallLo: '#8a8a8a', wallEdge: '#ffffff',
      p1: '#ffffff', p1d: '#cfcfcf', p1g: 'rgba(255,255,255,0.5)',
      p2: '#8d8d8d', p2d: '#5a5a5a', p2g: 'rgba(200,200,200,0.4)',
      mine: '#ffffff', mineCore: '#ffffff', shell: '#ffffff', shellHot: '#ffffff',
      ink: '#ffffff', inkDim: '#bdbdbd',
    },
  };
  function theme(mode) { return THEMES[mode === 'classic' ? 'classic' : 'hd']; }

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---- background / floor ---- */
  function drawFloor(ctx, x0, y0, w, h, mode) {
    const T = theme(mode);
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h);
    g.addColorStop(0, T.floor0); g.addColorStop(1, T.floor1);
    ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = T.grid; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = x0; gx <= x0 + w; gx += 34) { ctx.moveTo(gx, y0); ctx.lineTo(gx, y0 + h); }
    for (let gy = y0; gy <= y0 + h; gy += 34) { ctx.moveTo(x0, gy); ctx.lineTo(x0 + w, gy); }
    ctx.stroke();
  }

  /* ---- walls (beveled armored blocks) ---- */
  function drawWalls(ctx, rects, mode) {
    const T = theme(mode);
    // drop shadows
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    for (const r of rects) ctx.fillRect(r.x + 4, r.y + 5, r.w, r.h);
    for (const r of rects) {
      ctx.fillStyle = T.wallFace; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = T.wallTop; ctx.fillRect(r.x, r.y, r.w, 3);
      ctx.fillRect(r.x, r.y, 3, r.h);
      ctx.fillStyle = T.wallLo; ctx.fillRect(r.x, r.y + r.h - 3, r.w, 3);
      ctx.fillRect(r.x + r.w - 3, r.y, 3, r.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    }
  }

  /* ---- mines (pulsing spiked device) ---- */
  function drawMine(ctx, m, t, mode) {
    const T = theme(mode);
    const pulse = 0.5 + 0.5 * Math.sin(t * 4 + m.ph);
    ctx.save(); ctx.translate(m.x, m.y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = T.mine; ctx.globalAlpha = 0.18 + 0.18 * pulse;
    ctx.beginPath(); ctx.arc(0, 0, 13 + 3 * pulse, 0, 7); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = T.mine; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.rotate(Math.PI / 4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 9); ctx.stroke(); ctx.rotate(Math.PI / 2); }
    ctx.fillStyle = T.mineCore;
    ctx.beginPath(); ctx.arc(0, 0, 3 + pulse, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ---- shells (glowing tracer) ---- */
  function drawShell(ctx, s, mode) {
    const T = theme(mode);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const a = Math.atan2(s.vy, s.vx);
    const tx = s.x - Math.cos(a) * 16, ty = s.y - Math.sin(a) * 16;
    const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0, 'rgba(255,200,80,0)'); grad.addColorStop(1, T.shell);
    ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
    ctx.fillStyle = T.shellHot; ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ---- tank ---- */
  function drawTank(ctx, tk, t, mode) {
    const T = theme(mode), main = tk.id === 0 ? T.p1 : T.p2, dark = tk.id === 0 ? T.p1d : T.p2d, glow = tk.id === 0 ? T.p1g : T.p2g;
    ctx.save(); ctx.translate(tk.x, tk.y); ctx.rotate(tk.heading);
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; rr(ctx, -14, -11, 30, 24, 4); ctx.fill();
    // treads
    const seg = ((tk.dist * 0.5) % 6);
    ctx.fillStyle = '#0d0f14';
    rr(ctx, -13, -12, 26, 5, 2); ctx.fill();
    rr(ctx, -13, 7, 26, 5, 2); ctx.fill();
    ctx.fillStyle = dark;
    for (let i = -13; i < 13; i += 6) {
      ctx.fillRect(i + seg - 6, -12, 2.4, 5);
      ctx.fillRect(i + seg - 6, 7, 2.4, 5);
    }
    // hull
    const g = ctx.createLinearGradient(0, -8, 0, 8);
    g.addColorStop(0, main); g.addColorStop(1, dark);
    ctx.fillStyle = g; rr(ctx, -12, -8, 24, 16, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    // turret
    ctx.fillStyle = main; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2; ctx.stroke();
    // barrel
    ctx.fillStyle = '#1a1d24'; ctx.fillRect(4, -2.4, 16, 4.8);
    ctx.fillStyle = main; ctx.fillRect(16, -2.4, 4, 4.8);
    // muzzle flash
    if (tk.flash > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,230,140,' + tk.flash + ')';
      ctx.beginPath(); ctx.arc(22, 0, 7 * tk.flash + 3, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    // selection glow ring
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = glow; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tk.x, tk.y, 17, 0, 7); ctx.stroke();
    ctx.restore();
  }

  /* ---- track marks (fading) ---- */
  class Tracks {
    constructor() { this.list = []; }
    clear() { this.list.length = 0; }
    add(x, y, a) { this.list.push({ x, y, a, life: 1 }); if (this.list.length > 500) this.list.splice(0, 100); }
    update(dt) { for (const m of this.list) m.life -= dt * 0.12; this.list = this.list.filter(m => m.life > 0); }
    draw(ctx, mode) {
      ctx.save();
      for (const m of this.list) {
        ctx.globalAlpha = m.life * 0.28;
        ctx.fillStyle = '#000';
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
        ctx.fillRect(-2, -10, 3, 4); ctx.fillRect(-2, 6, 3, 4);
        ctx.restore();
      }
      ctx.restore();
    }
  }

  /* ---- particles ---- */
  class Particles {
    constructor() { this.list = []; }
    clear() { this.list.length = 0; }
    _add(p) { this.list.push(p); }
    explosion(x, y, color) {
      for (let i = 0; i < 26; i++) { const a = Math.random() * 7, s = 1 + Math.random() * 5; this._add({ t: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, max: 0.5 + Math.random() * 0.5, c: color }); }
      for (let i = 0; i < 12; i++) { const a = Math.random() * 7, s = 0.5 + Math.random() * 2; this._add({ t: 'debris', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, max: 0.8 + Math.random(), rot: Math.random() * 7, vr: (Math.random() - 0.5) * 0.6, c: color }); }
      for (let i = 0; i < 10; i++) { const a = Math.random() * 7, s = 0.3 + Math.random() * 1.2; this._add({ t: 'smoke', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.4, life: 1, max: 1 + Math.random(), r: 6 + Math.random() * 10 }); }
      this._add({ t: 'ring', x, y, life: 1, max: 0.45, c: color });
    }
    mineBlast(x, y, color) { this.explosion(x, y, color); this._add({ t: 'ring', x, y, life: 1, max: 0.5, c: color }); }
    update(dt) {
      for (const p of this.list) {
        p.life -= dt / p.max;
        p.x += p.vx; p.y += p.vy;
        if (p.t === 'spark' || p.t === 'debris') { p.vx *= 0.92; p.vy *= 0.92; }
        if (p.t === 'debris') p.rot += p.vr;
        if (p.t === 'smoke') { p.vx *= 0.95; p.vy *= 0.95; p.r += 0.6; }
      }
      this.list = this.list.filter(p => p.life > 0);
    }
    draw(ctx, mode) {
      ctx.save();
      for (const p of this.list) {
        const l = Math.max(0, p.life);
        if (p.t === 'spark') {
          ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = l;
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * l + 0.5, 0, 7); ctx.fill();
        } else if (p.t === 'debris') {
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = l;
          ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-2, -2, 4, 4); ctx.restore();
        } else if (p.t === 'smoke') {
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = l * 0.35;
          ctx.fillStyle = '#6a6f7a'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        } else if (p.t === 'ring') {
          ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = l;
          ctx.strokeStyle = p.c; ctx.lineWidth = 3 * l + 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, (1 - l) * 60 + 4, 0, 7); ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  /* ---- 1974-mode overlay (scanlines + vignette) ---- */
  function classicOverlay(ctx, w, h) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    for (let y = 0; y < h; y += 3) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, y, w, 1.5); }
    ctx.globalCompositeOperation = 'source-over';
    const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  window.SDArt = { theme, rr, drawFloor, drawWalls, drawMine, drawShell, drawTank, classicOverlay, Tracks, Particles };
})();

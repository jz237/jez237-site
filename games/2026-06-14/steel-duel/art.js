/* Steel Duel — rendering, particles, track marks, decals, 1974-mode shader. window.SDArt */
(function () {
  'use strict';

  const THEMES = {
    hd: {
      bg0: '#0a0d13', bg1: '#141b27', grid: 'rgba(120,150,200,0.05)',
      floor0: '#11151d', floor1: '#0c0f16',
      wallFace: '#2a3343', wallTop: '#4c596f', wallLo: '#151a24', wallEdge: '#647492',
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
    if (mode === 'classic') {
      ctx.fillStyle = '#000';
      ctx.fillRect(x0, y0, w, h);
      return;
    }
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

  /* ---- per-tile beveled, destructible walls ---- */
  function drawWalls(ctx, M, mode) {
    const T = theme(mode), S = M.solid, HP = M.hp, TILE = M.TILE, H0 = M.HUD_H;
    const solidAt = (c, r) => (r >= 0 && r < M.ROWS && c >= 0 && c < M.COLS && S[r][c]);
    if (mode === 'classic') {
      ctx.fillStyle = '#fff';
      for (let r = 0; r < M.ROWS; r++) for (let c = 0; c < M.COLS; c++) {
        if (S[r][c]) ctx.fillRect(c * TILE, H0 + r * TILE, TILE, TILE);
      }
      return;
    }
    // shadow pass
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    for (let r = 0; r < M.ROWS; r++) for (let c = 0; c < M.COLS; c++) {
      if (!S[r][c]) continue;
      if (!solidAt(c, r + 1) || !solidAt(c + 1, r)) ctx.fillRect(c * TILE + 3, H0 + r * TILE + 4, TILE, TILE);
    }
    for (let r = 0; r < M.ROWS; r++) for (let c = 0; c < M.COLS; c++) {
      if (!S[r][c]) continue;
      const x = c * TILE, y = H0 + r * TILE;
      ctx.fillStyle = T.wallFace; ctx.fillRect(x, y, TILE, TILE);
      if (!solidAt(c, r - 1)) { ctx.fillStyle = T.wallTop; ctx.fillRect(x, y, TILE, 3); }
      if (!solidAt(c - 1, r)) { ctx.fillStyle = T.wallTop; ctx.fillRect(x, y, 3, TILE); }
      if (!solidAt(c, r + 1)) { ctx.fillStyle = T.wallLo; ctx.fillRect(x, y + TILE - 3, TILE, 3); }
      if (!solidAt(c + 1, r)) { ctx.fillStyle = T.wallLo; ctx.fillRect(x + TILE - 3, y, 3, TILE); }
      // damage cracks (interior only; border hp is Infinity)
      const hp = HP[r][c];
      if (isFinite(hp) && hp < M.MAX) {
        const dmg = 1 - hp / M.MAX;
        ctx.strokeStyle = 'rgba(0,0,0,' + (0.35 + 0.4 * dmg) + ')'; ctx.lineWidth = 1.4;
        let seed = ((c * 73856093) ^ (r * 19349663)) >>> 0;
        const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
        const n = Math.round(2 + dmg * 4);
        ctx.beginPath();
        for (let k = 0; k < n; k++) {
          const ex = x + 4 + rnd() * (TILE - 8), ey = y + 4 + rnd() * (TILE - 8);
          ctx.moveTo(x + TILE / 2, y + TILE / 2); ctx.lineTo(ex, ey);
        }
        ctx.stroke();
      }
    }
  }

  /* ---- mines ---- */
  function drawMine(ctx, m, t, mode) {
    const T = theme(mode);
    if (mode === 'classic') {
      ctx.save(); ctx.translate(m.x, m.y);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(-7, -7); ctx.lineTo(7, 7);
      ctx.moveTo(7, -7); ctx.lineTo(-7, 7);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const pulse = 0.5 + 0.5 * Math.sin(t * 4 + m.ph);
    ctx.save(); ctx.translate(m.x, m.y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = T.mine; ctx.globalAlpha = 0.18 + 0.2 * pulse;
    ctx.beginPath(); ctx.arc(0, 0, 13 + 3 * pulse, 0, 7); ctx.fill();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = T.mine; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.rotate(Math.PI / 4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 9); ctx.stroke(); ctx.rotate(Math.PI / 2); }
    ctx.fillStyle = T.mineCore;
    ctx.beginPath(); ctx.arc(0, 0, 3 + pulse, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ---- shells ---- */
  function drawShell(ctx, s, mode) {
    const T = theme(mode);
    if (mode === 'classic') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round(s.x) - 2, Math.round(s.y) - 2, 4, 4);
      return;
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const a = Math.atan2(s.vy, s.vx);
    const tx = s.x - Math.cos(a) * 18, ty = s.y - Math.sin(a) * 18;
    const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0, 'rgba(255,190,70,0)'); grad.addColorStop(1, T.shell);
    ctx.strokeStyle = grad; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
    ctx.fillStyle = T.shellHot; ctx.beginPath(); ctx.arc(s.x, s.y, 3.2, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ---- tank: hull at heading, turret/barrel at turret angle ---- */
  function drawTank(ctx, tk, t, mode) {
    const T = theme(mode), main = tk.id === 0 ? T.p1 : T.p2, dark = tk.id === 0 ? T.p1d : T.p2d, glow = tk.id === 0 ? T.p1g : T.p2g;
    const damage = Math.max(0, 4 - (tk.hp == null ? 4 : tk.hp));
    if (mode === 'classic') {
      ctx.save();
      ctx.translate(Math.round(tk.x), Math.round(tk.y));
      ctx.rotate(tk.heading);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-11, -6, 22, 12);
      ctx.fillRect(-6, -11, 12, 22);
      ctx.fillRect(9, -2, 18, 4);
      if (damage > 0) {
        ctx.fillStyle = '#000';
        const marks = [[-7, -4, 5, 2], [2, 3, 7, 2], [-3, -9, 2, 6]];
        for (let i = 0; i < Math.min(damage, marks.length); i++) {
          const m = marks[i]; ctx.fillRect(m[0], m[1], m[2], m[3]);
        }
      }
      ctx.restore();
      return;
    }
    // glow ring
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = glow; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tk.x, tk.y, 17, 0, 7); ctx.stroke();
    ctx.restore();
    // hull
    ctx.save(); ctx.translate(tk.x, tk.y); ctx.rotate(tk.heading);
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; rr(ctx, -14, -11, 30, 24, 4); ctx.fill();
    const seg = ((tk.dist * 0.5) % 6);
    ctx.fillStyle = '#0d0f14';
    rr(ctx, -13, -12, 26, 5, 2); ctx.fill(); rr(ctx, -13, 7, 26, 5, 2); ctx.fill();
    ctx.fillStyle = dark;
    for (let i = -13; i < 13; i += 6) { ctx.fillRect(i + seg - 6, -12, 2.4, 5); ctx.fillRect(i + seg - 6, 7, 2.4, 5); }
    const g = ctx.createLinearGradient(0, -8, 0, 8);
    g.addColorStop(0, main); g.addColorStop(1, dark);
    ctx.fillStyle = g; rr(ctx, -12, -8, 24, 16, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    // rivets
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    [[-9, -5], [9, -5], [-9, 5], [9, 5]].forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 1.1, 0, 7); ctx.fill(); });
    if (damage > 0) {
      const scars = [[-6, -4, 8, 2, -0.2], [1, 4, 9, 2, 0.18], [-8, 1, 5, 2, 0.45]];
      for (let i = 0; i < Math.min(damage, scars.length); i++) {
        const s = scars[i];
        ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(s[4]);
        ctx.fillStyle = 'rgba(4,5,7,0.78)'; rr(ctx, -s[2] / 2, -s[3] / 2, s[2], s[3], 1); ctx.fill();
        ctx.strokeStyle = 'rgba(255,210,120,0.35)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(-s[2] / 2, 0); ctx.lineTo(s[2] / 2, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath(); ctx.arc(-3, -1, 8 + damage * 1.5, 0, 7); ctx.fill();
    }
    ctx.restore();
    // turret + barrel
    ctx.save(); ctx.translate(tk.x, tk.y); ctx.rotate(tk.turret);
    ctx.fillStyle = '#1a1d24'; ctx.fillRect(4, -2.6, 17, 5.2);
    ctx.fillStyle = main; ctx.fillRect(17, -2.6, 4, 5.2);
    const tg = ctx.createRadialGradient(-2, -2, 1, 0, 0, 9);
    tg.addColorStop(0, main); tg.addColorStop(1, dark);
    ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    if (tk.flash > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,235,150,' + tk.flash + ')';
      ctx.beginPath(); ctx.arc(23, 0, 8 * tk.flash + 3, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  function drawReticle(ctx, x, y, color) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = color; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 16, y); ctx.lineTo(x - 5, y); ctx.moveTo(x + 5, y); ctx.lineTo(x + 16, y);
    ctx.moveTo(x, y - 16); ctx.lineTo(x, y - 5); ctx.moveTo(x, y + 5); ctx.lineTo(x, y + 16);
    ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill();
    ctx.restore();
  }

  /* ---- scorch decals (persist for the match) ---- */
  class Decals {
    constructor() { this.list = []; }
    clear() { this.list.length = 0; }
    add(x, y, r) { this.list.push({ x, y, r }); if (this.list.length > 80) this.list.shift(); }
    draw(ctx) {
      ctx.save();
      for (const d of this.list) {
        const g = ctx.createRadialGradient(d.x, d.y, 1, d.x, d.y, d.r);
        g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
      }
      ctx.restore();
    }
  }

  /* ---- track marks ---- */
  class Tracks {
    constructor() { this.list = []; }
    clear() { this.list.length = 0; }
    add(x, y, a) { this.list.push({ x, y, a, life: 1 }); if (this.list.length > 500) this.list.splice(0, 100); }
    update(dt) { for (const m of this.list) m.life -= dt * 0.12; this.list = this.list.filter(m => m.life > 0); }
    draw(ctx) {
      ctx.save();
      for (const m of this.list) {
        ctx.globalAlpha = m.life * 0.26; ctx.fillStyle = '#000';
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
        ctx.fillRect(-2, -10, 3, 4); ctx.fillRect(-2, 6, 3, 4); ctx.restore();
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
      for (let i = 0; i < 30; i++) { const a = Math.random() * 7, s = 1.5 + Math.random() * 6; this._add({ t: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, max: 0.5 + Math.random() * 0.6, c: color }); }
      for (let i = 0; i < 14; i++) { const a = Math.random() * 7, s = 0.5 + Math.random() * 2.4; this._add({ t: 'debris', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, max: 0.8 + Math.random(), rot: Math.random() * 7, vr: (Math.random() - 0.5) * 0.6, c: color }); }
      for (let i = 0; i < 12; i++) { const a = Math.random() * 7, s = 0.3 + Math.random() * 1.2; this._add({ t: 'smoke', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.4, life: 1, max: 1 + Math.random(), r: 6 + Math.random() * 10 }); }
      this._add({ t: 'ring', x, y, life: 1, max: 0.45, c: color });
    }
    chips(x, y, color) { for (let i = 0; i < 8; i++) { const a = Math.random() * 7, s = 1 + Math.random() * 3; this._add({ t: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, max: 0.3 + Math.random() * 0.3, c: color }); } }
    update(dt) {
      for (const p of this.list) {
        p.life -= dt / p.max; p.x += p.vx; p.y += p.vy;
        if (p.t === 'spark' || p.t === 'debris') { p.vx *= 0.92; p.vy *= 0.92; }
        if (p.t === 'debris') p.rot += p.vr;
        if (p.t === 'smoke') { p.vx *= 0.95; p.vy *= 0.95; p.r += 0.6; }
      }
      this.list = this.list.filter(p => p.life > 0);
    }
    draw(ctx) {
      ctx.save();
      for (const p of this.list) {
        const l = Math.max(0, p.life);
        if (p.t === 'spark') { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = l; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 * l + 0.5, 0, 7); ctx.fill(); }
        else if (p.t === 'debris') { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = l; ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-2, -2, 4, 4); ctx.restore(); }
        else if (p.t === 'smoke') { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = l * 0.34; ctx.fillStyle = '#6a6f7a'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
        else if (p.t === 'ring') { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = l; ctx.strokeStyle = p.c; ctx.lineWidth = 3 * l + 1; ctx.beginPath(); ctx.arc(p.x, p.y, (1 - l) * 64 + 4, 0, 7); ctx.stroke(); }
      }
      ctx.restore();
    }
  }

  /* ---- 1974-mode overlay ---- */
  function classicOverlay(ctx, w, h) {
    ctx.save();
    for (let y = 0; y < h; y += 3) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, y, w, 1.5); }
    const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function classicDigit(ctx, x, y, n, s) {
    const segs = {
      '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
      '5': 'afgcd', '6': 'afgecd', '7': 'abc', '8': 'abcdefg', '9': 'abfgcd',
    }[String(Math.max(0, Math.min(9, n | 0)))] || 'abcdef';
    const t = s, l = s * 5, h = s * 8;
    ctx.fillStyle = '#fff';
    if (segs.includes('a')) ctx.fillRect(x, y, l, t);
    if (segs.includes('g')) ctx.fillRect(x, y + h / 2 - t / 2, l, t);
    if (segs.includes('d')) ctx.fillRect(x, y + h - t, l, t);
    if (segs.includes('f')) ctx.fillRect(x, y, t, h / 2);
    if (segs.includes('b')) ctx.fillRect(x + l - t, y, t, h / 2);
    if (segs.includes('e')) ctx.fillRect(x, y + h / 2, t, h / 2);
    if (segs.includes('c')) ctx.fillRect(x + l - t, y + h / 2, t, h / 2);
  }

  window.SDArt = { theme, rr, drawFloor, drawWalls, drawMine, drawShell, drawTank, drawReticle, classicOverlay, classicDigit, Tracks, Particles, Decals };
})();

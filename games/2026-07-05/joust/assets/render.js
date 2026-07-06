// Joust remake — renderer: blits the ORIGINAL Joust sprite bitmaps (assets/sprites.js, decoded
// from the ROM) over a black sky with rocky platforms + lava. See SPEC.md §13.
'use strict';
(function () {
const DATA = window.JOUST_DATA;
const SPR = window.JOUST_SPRITES || {};
const { WORLD } = DATA;
const WRAP = WORLD.WRAP_SPAN;

// original ROM palette browns/greys for platforms & lava (matches the sprite palette)
const PAL = {
  rockTop: '#9292aa',   // color 13 — grey landing surface
  rockTopLit: '#b6b6cc',
  rockA: '#924900',     // color 8
  rockB: '#b66d55',     // color 10
  rockC: '#492400',     // color 14
  rockEdge: '#ff6d00',  // color 12 (lit rim)
  lavaA: '#ff2400', lavaB: '#ff6d00', lavaC: '#ffdb00', lavaDark: '#7a1200',
  star: '#5a5a70',
};

// enemy recolor maps: remap the buzzard's green body shades to each type's colours
const GREEN_LT = [0, 219, 85], GREEN_DK = [0, 109, 85];
const RECOLOR = {
  bounder: { lt: [255, 60, 40], dk: [176, 20, 12] },
  hunter:  { lt: [206, 206, 224], dk: [110, 110, 132] },
  shadow:  { lt: [70, 150, 255], dk: [28, 56, 176] },
};
function near(a, b) { return Math.abs(a[0] - b[0]) < 24 && Math.abs(a[1] - b[1]) < 24 && Math.abs(a[2] - b[2]) < 24; }
// tint base colours per enemy type (light body, dark shade) — used by luminance remap
const TINT = {
  bounder: [255, 45, 30], hunter: [200, 205, 225], shadow: [64, 150, 255],
};

class Renderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.spr = {}; this.particles = []; this.floats = []; this.crt = false; this.time = 0;
    this.stars = []; this.rng = 0x2545F491;
    for (let i = 0; i < 60; i++) this.stars.push({ x: this._rnd() * WORLD.VIEW_W, y: WORLD.CEIL + this._rnd() * (WORLD.FLOOR - WORLD.CEIL), s: this._rnd() < 0.2 ? 2 : 1 });
    this.buildSprites();
  }
  _rnd() { let x = this.rng; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.rng = x >>> 0; return (this.rng % 100000) / 100000; }

  // decode a sprite's base64 rgba into an offscreen canvas
  mkCanvas(w, h, bytes) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); const img = g.createImageData(w, h);
    img.data.set(bytes); g.putImageData(img, 0, 0); return c;
  }
  b64bytes(d) { const bin = atob(d); const u = new Uint8ClampedArray(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  recolorBytes(bytes, tint) {
    // remap any green-dominant pixel (the buzzard body) to the tint hue, keeping brightness;
    // leaves the rider/beak/legs untouched.
    const out = new Uint8ClampedArray(bytes);
    for (let i = 0; i < out.length; i += 4) {
      if (!out[i + 3]) continue;
      const r = out[i], g = out[i + 1], b = out[i + 2];
      if (g > r + 30 && g > b + 20) {
        const lum = Math.min(1, g / 219);
        out[i] = Math.round(tint[0] * lum); out[i + 1] = Math.round(tint[1] * lum); out[i + 2] = Math.round(tint[2] * lum);
      }
    }
    return out;
  }
  buildSprites() {
    for (const [name, s] of Object.entries(SPR)) {
      const bytes = this.b64bytes(s.d);
      this.spr[name] = this.mkCanvas(s.w, s.h, bytes);
      // enemy-recolored buzzard variants
      if (/^B(RUN|FLY|2)/.test(name)) {
        for (const t of ['bounder', 'hunter', 'shadow'])
          this.spr[t + '_' + name] = this.mkCanvas(s.w, s.h, this.recolorBytes(bytes, TINT[t]));
      }
    }
  }
  get(name) { return this.spr[name]; }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    const sc = Math.min(this.canvas.width / WORLD.VIEW_W, this.canvas.height / WORLD.VIEW_H);
    this.scale = sc; this.ox = (this.canvas.width - WORLD.VIEW_W * sc) / 2; this.oy = (this.canvas.height - WORLD.VIEW_H * sc) / 2;
    this.ctx.imageSmoothingEnabled = false;
  }
  sx(x) { return this.ox + x * this.scale; }
  sy(y) { return this.oy + y * this.scale; }

  burst(kind, x, y, opts) {
    opts = opts || {}; const n = opts.n || 8; const col = opts.col || '#ffdb00';
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, sp = 0.4 + Math.random() * 1.6; this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (opts.up ? 1 : 0), life: opts.life || 30, max: opts.life || 30, col, size: opts.size || 1.5, grav: opts.grav != null ? opts.grav : 0.06 }); }
  }
  float(text, x, y, col) { this.floats.push({ text, x, y, life: 60, col: col || '#fff' }); }
  updateFx() {
    this.time++;
    for (const p of this.particles) { p.x += p.vx; p.y += p.vy; p.vy += p.grav; p.life--; }
    this.particles = this.particles.filter(p => p.life > 0);
    for (const f of this.floats) { f.y -= 0.4; f.life--; }
    this.floats = this.floats.filter(f => f.life > 0);
  }

  // blit sprite `name` with bottom-center anchored at native (nx, ny); wrap-duplicated
  blit(name, nx, ny, ax) {
    const s = this.spr[name]; if (!s) return;
    const sc = this.scale, w = s.width * sc, h = s.height * sc;
    const bx = nx - (ax != null ? ax : s.width / 2), by = ny - s.height;
    for (const off of [0, -WRAP, WRAP]) {
      const scr = this.sx(bx + off);
      if (scr > -w - 2 && scr < this.canvas.width + 2) this.ctx.drawImage(s, Math.round(scr), Math.round(this.sy(by)), Math.round(w), Math.round(h));
    }
  }

  render(snap) {
    const ctx = this.ctx, sc = this.scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.beginPath(); ctx.rect(this.ox, this.oy, WORLD.VIEW_W * sc, WORLD.VIEW_H * sc); ctx.clip();
    ctx.fillStyle = '#000'; ctx.fillRect(this.ox, this.oy, WORLD.VIEW_W * sc, WORLD.VIEW_H * sc);
    // very faint stars (arcade is black; keep subtle)
    ctx.fillStyle = PAL.star;
    for (const st of this.stars) { ctx.globalAlpha = 0.35; ctx.fillRect(this.sx(st.x), this.sy(st.y), st.s * sc * 0.8, st.s * sc * 0.8); }
    ctx.globalAlpha = 1;
    this.drawLava();
    if (snap) { this.drawPlatforms(snap.platforms); this.drawEntities(snap); }
    this.drawParticles();
    ctx.restore();
    if (this.crt) this.drawCRT();
  }

  drawLava() {
    const ctx = this.ctx, sc = this.scale, y = this.sy(WORLD.LAVA_Y);
    const g = ctx.createLinearGradient(0, y, 0, this.sy(WORLD.VIEW_H));
    g.addColorStop(0, PAL.lavaC); g.addColorStop(0.25, PAL.lavaB); g.addColorStop(0.7, PAL.lavaA); g.addColorStop(1, PAL.lavaDark);
    ctx.fillStyle = g; ctx.fillRect(this.ox, y, WORLD.VIEW_W * sc, (WORLD.VIEW_H - WORLD.LAVA_Y) * sc);
    // animated flame sprites along the surface
    const fr = ['FLAME1', 'FLAME2', 'FLAME3'][(this.time >> 3) % 3];
    for (let fx = 8; fx < WORLD.VIEW_W; fx += 46) this.blit(fr, fx + ((this.time >> 2) % 12), WORLD.LAVA_Y + 2, undefined);
    ctx.globalAlpha = 1;
  }

  drawPlatforms(plats) {
    const ctx = this.ctx, sc = this.scale;
    for (const p of plats || []) {
      for (const off of [0, -WRAP, WRAP]) {
        const x1 = this.sx(p.x1 + off), x2 = this.sx(p.x2 + off);
        if (x2 < this.ox - 2 || x1 > this.ox + WORLD.VIEW_W * sc + 2) continue;
        const w = x2 - x1, top = this.sy(p.y);
        const bodyH = (p.y > 200 ? (WORLD.FLOOR - p.y) : 9) * sc;
        // rocky brown body
        const g = ctx.createLinearGradient(0, top, 0, top + bodyH);
        g.addColorStop(0, PAL.rockB); g.addColorStop(0.5, PAL.rockA); g.addColorStop(1, PAL.rockC);
        ctx.fillStyle = g; ctx.fillRect(x1, top + 2.5 * sc, w, bodyH);
        // jagged brown texture
        ctx.fillStyle = PAL.rockC;
        for (let rx = 0; rx < w; rx += 7 * sc) ctx.fillRect(x1 + rx, top + 2.5 * sc + ((rx * 11) % 5) * sc, 2 * sc, (3 + (rx % 3)) * sc);
        ctx.fillStyle = PAL.rockEdge; ctx.globalAlpha = 0.5;
        for (let rx = 4 * sc; rx < w; rx += 11 * sc) ctx.fillRect(x1 + rx, top + 3 * sc, 1.5 * sc, 2 * sc);
        ctx.globalAlpha = 1;
        // grey landing top
        ctx.fillStyle = PAL.rockTop; ctx.fillRect(x1, top, w, 2.5 * sc);
        ctx.fillStyle = PAL.rockTopLit; ctx.fillRect(x1, top, w, 1 * sc);
      }
    }
  }

  birdFrame(prefix, b) {
    const f = b.face > 0 ? 'R' : 'L';
    if (!b.onGround) return prefix + (b.wingDown > 0 ? 'FLY1' : 'FLY3') + f;
    if (b.skid > 0) return prefix + 'RUNS' + f;
    if (b.runTier > 0) return prefix + 'RUN' + (1 + ((this.time >> 2) % 4)) + f;
    return prefix + 'RUN4' + f;
  }

  drawEntities(snap) {
    // trolls (behind)
    for (const t of snap.trolls) { const gi = Math.min(5, 1 + ((this.time >> 2) % 6)); this.blit('GRAB' + gi, t.bird.x, WORLD.FLOOR + 6, undefined); }
    // eggs
    for (const egg of snap.eggs) {
      let nm = 'EGGUP';
      if (egg.state === 'shake' || egg.state === 'hatching') nm = ['EGGB1', 'EGGB2', 'EGGB3'][(this.time >> 2) % 3];
      else if (egg.state === 'walking' || egg.state === 'mounting') nm = (egg.walkFace > 0 ? 'BRUN4R' : 'BRUN4L');
      this.blit(nm, egg.x, egg.y + 1, undefined);
    }
    // enemies (recolored buzzards)
    for (const e of snap.enemies) {
      if (!e.alive) continue;
      if (e.materializing > 0 && ((this.time >> 1) & 1)) continue;
      const base = this.birdFrame('B', e);
      this.blit(e.type + '_' + base, e.x, e.y + 1, undefined);
    }
    // pterodactyls
    for (const pt of snap.pteros) {
      if (!pt.alive) continue;
      const f = pt.face > 0 ? 'R' : 'L';
      const fr = pt.attack > 0 ? 'PT3' : ['PT1', 'PT2', 'PT1'][(this.time >> 2) % 3];
      this.blit(fr + f, pt.x, pt.y + 8, undefined);
    }
    // players (P1 ostrich, P2 stork)
    for (const p of snap.players) {
      if (p.out || !p.alive) continue;
      if (p.materializing > 0 && ((this.time >> 1) & 1)) continue;
      this.blit(this.birdFrame(p.pi === 1 ? 'S' : 'O', p), p.x, p.y + 1, undefined);
    }
  }

  drawParticles() {
    const ctx = this.ctx, sc = this.scale;
    for (const p of this.particles) { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.col; const s = p.size * sc; const x = this.sx(p.x) - s / 2, y = this.sy(p.y) - s / 2; ctx.fillRect(x, y, s, s); }
    ctx.globalAlpha = 1;
  }
  drawFloats(font) {
    const ctx = this.ctx, sc = this.scale;
    for (const f of this.floats) { ctx.globalAlpha = Math.min(1, f.life / 30); font(f.text, this.sx(f.x), this.sy(f.y), Math.round(7 * sc), f.col, 'center'); }
    ctx.globalAlpha = 1;
  }
  drawCRT() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    if (!this._crtC || this._crtC.height !== H) { this._crtC = document.createElement('canvas'); this._crtC.width = 4; this._crtC.height = H; const g = this._crtC.getContext('2d'); for (let y = 0; y < H; y += 3) { g.fillStyle = 'rgba(0,0,0,.30)'; g.fillRect(0, y, 4, 1); } }
    ctx.globalAlpha = 1; ctx.drawImage(this._crtC, 0, 0, W, H);
    const vg = ctx.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, H * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
}

window.JOUST_RENDER = { Renderer, PAL };
})();

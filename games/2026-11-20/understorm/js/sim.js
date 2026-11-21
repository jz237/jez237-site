// UNDERSTORM 2026 — deterministic fixed-step simulation. No rendering, no audio, no DOM.
// Positions are in screen space (0..32 x 0..18); things bolted to the world slide left by the scroll.
import { W, H, DT, SPEEDS, DIFFS, CHARGE, clamp } from './config.js?v=120';
import { FOES, BOSSES } from './foes.js?v=120';

const MAXB = 380;
const segDist = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1e-6;
  const u = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1);
  return Math.hypot(px - ax - dx * u, py - ay - dy * u);
};

export class Sim {
  constructor(stages) { this.stages = stages; this.fx = []; this.tick = 0; }

  newGame(o = {}) {
    this.diff = DIFFS[o.diff || 'normal']; this.sight = !!o.sight; this.god = !!o.god; this.auto = o.auto !== false;
    this.loop = o.loop || 1; this.score = 0; this.lives = this.diff.lives; this.nextLife = 50000;
    this.hits = 0; this.deaths = 0; this.seed = (o.seed || 20261120) >>> 0; this.practice = o.practice || null; this.endless = !!o.endless;
    this.over = false; this.won = false; this.tick = 0; this.maxChain = 0; this.tetherKills = 0;
    this.p = { x: 6, y: 9, alive: true, inv: 0, sp: 1, fireCd: 0, holdT: 0, charge: 0, tier: 0, heat: 0, lock: false, core: 0, lvl: 0,
      motes: 0, seek: false, seekCd: 0, coreCd: 0, beamT: 0, beamX: W, recoil: 0, shield: 0, light: 0, firing: false, vy: 0,
      m: [{ x: 6, y: 10.6 }, { x: 6, y: 7.4 }] };
    this.a = { st: 0, x: 0, y: 0, vx: 0, lat: null, latP: null, lox: 0, loy: 0, cd: 0, zap: 0, free: 0, spin: 0 };
    if (o.loadout) { this.p.core = o.loadout.core || 1; this.p.lvl = o.loadout.lvl || 2; this.p.motes = o.loadout.motes || 0; this.p.seek = !!o.loadout.seek; this.a.st = 1; }
    this.startStage(o.stage || 0, o.cp || 0);
  }

  rnd() { let t = (this.rs += 0x6D2B79F5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }

  startStage(i, cp = 0) {
    this.si = i; this.st = this.stages[i]; this.cp = cp < 0 ? this.st.cps.length - 1 : cp; this.stageScore0 = this.score; this.stageDeaths = 0;
    this.restore(true); this.fx.push({ k: 'stage', i });
  }

  restore(fresh) {
    const st = this.st, p = this.p, a = this.a;
    this.t = st.cps[this.cp] || 0; this.gt = this.t; this.sT = st.scrollAt(this.t); this.scroll = this.sT; this.vs = st.speedAt(this.t);
    this.en = []; this.eb = []; this.ps = []; this.pk = []; this.hz = []; this.arcs = [];
    this.blocks = st.blocks.map((b) => ({ ...b, cx: b.x, cy: b.y })); this.vents = st.vents;
    let ei = st.ev.findIndex((e) => e.t >= this.t - 1e-6); this.evI = ei < 0 ? st.ev.length : ei;
    // a checkpoint restart begins on a clear screen: whatever was already in view is gone, new things scroll in
    const edge = this.cp > 0 ? this.scroll + W + 1 : this.scroll - 1; this.ventMin = this.cp > 0 ? edge : -1e9;
    if (this.cp > 0) for (const b of this.blocks) if (b.x + b.w / 2 < edge + 4) b.dead = true;
    let fi = st.fix.findIndex((f) => f.x >= edge); this.fixI = fi < 0 ? st.fix.length : fi;
    this.boss = null; this.bossDie = 0; this.clearT = 0; this.mode = 'play'; this.deadT = 0;
    this.rs = (this.seed ^ Math.imul(this.si + 1, 7919) ^ Math.imul(this.cp + 1, 104729)) >>> 0;
    const wx = this.scroll + 6, f = st.floorAt(wx), c = st.ceilAt(wx);
    p.x = 6; p.y = clamp((Math.max(f, 0) + Math.min(c, H)) / 2, 2.5, H - 2.5); p.alive = true; p.inv = 130; p.fireCd = 0; p.holdT = 0; p.charge = 0; p.tier = 0;
    p.heat = 0; p.lock = false; p.beamT = 0; p.recoil = 0; p.shield = this.diff.shield; p.light = 0; p.m[0].x = p.m[1].x = p.x; p.m[0].y = p.y + 1.6; p.m[1].y = p.y - 1.6;
    this.flood = st.floodAt(this.t);
    for (const b of this.blocks) if (b.detT !== undefined && b.detT < this.t - 0.05) b.dead = true;
    const blocked = (y) => { if (y - 0.9 < Math.max(f, this.flood === null ? -9 : this.flood) || y + 0.9 > c) return true; for (const b of this.blocks) if (!b.dead && Math.abs(wx - b.x) < b.w / 2 + 1.4 && Math.abs(y - b.y) < b.h / 2 + 0.9 + (b.k === 'pist' ? Math.abs(b.amp) : 0)) return true; return false; };
    for (let d = 0, y0 = p.y; d < 9; d += 0.5) { if (y0 + d < H - 1 && !blocked(y0 + d)) { p.y = y0 + d; break; } if (y0 - d > 1 && !blocked(y0 - d)) { p.y = y0 - d; break; } }
    if (!fresh) { p.core = p.core || 1; p.lvl = 1; p.motes = 0; p.seek = false; a.st = 1; }
    if (a.st) a.st = 1; a.lat = null; a.x = p.x + 1.15; a.y = p.y;
    this.chain = 0; this.chainT = 0; this.windX = 0; this.windY = 0; this.panic = 0;
    this.ab = []; this.flood = st.floodAt(this.t); this.wall = st.pursuitAt(this.t); this.heatMul = st.heatAt(this.t); this.ds = 0; this.bwx = this.bwy = 0;
  }

  // ---------------------------------------------------------------- helpers used by foes
  pl() { return this.p.alive ? this.p : { x: 6, y: 9 }; }
  shoot(x, y, vx, vy, k = 0, g = 0) {
    if (this.eb.length >= MAXB || x < -1 || x > W + 1) return null;
    const b = { x, y, vx, vy, k, g, r: k === 1 ? 0.34 : k === 3 ? 0.15 : 0.2, t: 0 }; this.eb.push(b); return b;
  }
  bspd(s) { return s * this.diff.bs * (this.loop > 1 ? 1.18 : 1); }
  aim(x, y, spd, n = 1, spread = 0.22, k = 0) {
    const t = this.pl(), a0 = Math.atan2(t.y - y, t.x - x); spd = this.bspd(spd);
    for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * spread; this.shoot(x, y, Math.cos(a) * spd, Math.sin(a) * spd, k); }
    this.fx.push({ k: 'eshot', x, y });
  }
  ring(x, y, n, spd, ph = 0, k = 0) { spd = this.bspd(spd); for (let i = 0; i < n; i++) { const a = ph + (i / n) * 6.2832; this.shoot(x, y, Math.cos(a) * spd, Math.sin(a) * spd, k); } this.fx.push({ k: 'eshot', x, y }); }
  cdr(ticks) { return Math.round(ticks * this.diff.fr * (this.loop > 1 ? 0.8 : 1)); }
  floor(sx) { return this.st.floorAt(this.scroll + sx); }
  ceil(sx) { return this.st.ceilAt(this.scroll + sx); }
  solidAt(sx, y, pad = 0) {
    const wx = this.scroll + sx; if (y - pad < this.st.floorAt(wx) || y + pad > this.st.ceilAt(wx)) return true;
    for (const b of this.ab) if (Math.abs(wx - b.cx) < b.w / 2 + pad && Math.abs(y - b.cy) < b.h / 2 + pad) return b;
    return false;
  }
  spawn(type, o = {}) {
    const d = FOES[type]; if (!d) return null;
    const e = { type, x: o.x !== undefined ? o.x : o.side === 'L' ? -1.5 : W + 1.5, y: o.y !== undefined ? o.y : 9, vx: 0, vy: 0, hp: d.hp * this.diff.hp, r: d.r, t: 0,
      dir: o.side === 'L' ? 1 : -1, world: !!d.world, sc: d.sc, flash: 0, o, cd: o.cd !== undefined ? o.cd : 30 + ((this.rnd() * 70) | 0), seen: false, rot: 0 };
    e.max = e.hp; if (d.init) d.init(e, this, o); this.en.push(e); return e;
  }
  spawnBoss(name) {
    const d = BOSSES[name]; const e = { type: 'boss', boss: name, x: W + 6, y: 9, vx: 0, vy: 0, hp: d.hp * this.diff.hp, r: 0, t: 0, dir: -1, sc: d.sc || 20000, flash: 0, parts: [], cd: 60, ph: 0, o: {}, name: d.name, seen: true, rot: 0 };
    e.max = e.hp; e.gateMax = e.max / 20; e.gate = e.gateMax; d.init(e, this); this.en.push(e); this.boss = e; this.fx.push({ k: 'boss', name: d.name }); return e;
  }
  part(e, kind, ox, oy, r, o = {}) { const p = { kind, ox, oy, r, x: e.x + ox, y: e.y + oy, on: true, flash: 0, rot: 0, ...o }; if (p.hp !== undefined) { p.hp *= this.diff.hp; p.max = p.hp; } e.parts.push(p); return p; }
  addScore(n, x, y) { this.score += n; if (this.score >= this.nextLife) { this.nextLife += 80000; this.lives++; this.fx.push({ k: 'life' }); } if (x !== undefined && n >= 500) this.fx.push({ k: 'pts', x, y, n }); }

  hurt(e, dmg, src, part) {
    if (e.dead || e.hidden) return false;
    if (part) {
      if (!part.on) return false;
      if (part.armor) { if (src.k !== 'tether' && src.k !== 'anchor') this.fx.push({ k: 'tink', x: src.x ?? part.x, y: src.y ?? part.y }); return true; }
      if (e.boss && part.weak) { dmg = Math.min(dmg, e.gate); e.gate -= dmg; if (dmg <= 0) return true; }
      if (part.hp !== undefined) {
        if (part.weak) dmg = Math.min(dmg, part.hp + 0.01);
        part.hp -= dmg; part.flash = 4;
        if (part.hp <= 0) { part.on = false; this.fx.push({ k: 'boom', x: part.x, y: part.y, s: part.r * 1.4, big: 1 }); this.addScore(part.sc || 1000, part.x, part.y); if (part.onDie) part.onDie(e, this, part); }
      }
      if (part.weak) { e.hp -= dmg * (e.vul || 1); e.flash = 4; part.flash = 4; }
    } else {
      const d = FOES[e.type];
      if (d.guard && d.guard(e, src, this, dmg)) { if (src.k !== 'tether' && src.k !== 'anchor') this.fx.push({ k: 'tink', x: src.x ?? e.x, y: src.y ?? e.y }); return true; }
      e.hp -= dmg; e.flash = 4;
    }
    if (e.hp <= 0) this.kill(e, src);
    return true;
  }

  kill(e, src) {
    if (e.dead) return; e.dead = true;
    const d = FOES[e.type], melee = src && (src.k === 'tether' || src.k === 'anchor');
    if (melee) { this.chain = Math.min(8, this.chain + 1); this.chainT = 200; this.tetherKills++; if (this.chain > this.maxChain) this.maxChain = this.chain; }
    const mult = melee ? Math.max(1, this.chain) : 1;
    this.addScore((e.sc || 100) * mult, e.x, e.y);
    if (melee && mult > 1) this.fx.push({ k: 'chain', x: e.x, y: e.y, n: mult });
    if (e.boss) { this.bossDie = 170; this.eb.length = 0; this.hz.length = 0; for (const o of this.en) if (o !== e && !o.dead) { o.dead = true; this.fx.push({ k: 'boom', x: o.x, y: o.y, s: o.r }); } this.fx.push({ k: 'bossdie', x: e.x, y: e.y }); return; }
    this.fx.push({ k: 'boom', x: e.x, y: e.y, s: e.r, big: e.r > 1.2 ? 1 : 0, type: e.type });
    if (d && d.onDie) d.onDie(e, this, src);
    if ((this.loop > 1 || this.diff.revenge) && e.x > this.p.x + 5 && !e.noRev) this.aim(e.x, e.y, 6.5, 1);
  }

  drop(x, y, item) { this.pk.push({ x, y, item, t: 0, y0: y }); }

  // ---------------------------------------------------------------- one fixed step
  step(inp) {
    if (this.over || this.won) return;
    if (this.epi) { this.tick++; this.gt += DT; this.t += DT; this.vs = 2.4; this.sT += 2.4 * DT; const o = this.scroll; this.scroll = this.sT; this.ds = this.scroll - o; this.ab = []; const p = this.p, a = this.a; p.x += (12 - p.x) * 0.02; p.y += (9 + Math.sin(this.gt * 0.7) * 1.3 - p.y) * 0.05; p.vy = Math.cos(this.gt * 0.7) * 0.9; p.inv = 0; p.firing = false; p.charge = 0; p.tier = 0; p.light = 0; if (a.st) { a.st = 1; a.x = p.x + 1.15; a.y = p.y; a.spin += 0.1; } for (let i = 0; i < 2; i++) { const m = p.m[i]; m.x += (p.x - 0.2 - m.x) * 0.2; m.y += (p.y + (i ? -1.65 : 1.65) - m.y) * 0.2; } return; }
    this.tick++;
    if (this.mode === 'clear') { if (--this.clearT <= 0) { this.advance(); if (this.over || this.won) return; } }
    const st = this.st, p = this.p, a = this.a;
    if (this.bossDie > 0) {
      this.bossDie--; const b = this.boss;
      if (b && this.bossDie % 7 === 0) this.fx.push({ k: 'boom', x: b.x + (this.rnd() - 0.5) * 7, y: b.y + (this.rnd() - 0.5) * 7, s: 1 + this.rnd() * 1.6, big: 1 });
      if (this.bossDie === 0) { if (b) { this.fx.push({ k: 'bossgone', x: b.x, y: b.y }); this.addScore(b.sc, b.x, b.y); b.gone = true; } this.boss = null; }
    }
    const frozen = !!this.boss;
    if (!frozen && this.mode !== 'clear') this.t += DT;
    this.gt += DT;
    const v = frozen ? 0 : st.speedAt(this.t);
    this.vs += (v - this.vs) * 0.06; this.sT += this.vs * DT;
    const old = this.scroll; this.scroll = this.sT; const ds = this.scroll - old; this.ds = ds;
    while (this.evI < st.ev.length && st.ev[this.evI].t <= this.t) this.event(st.ev[this.evI++]);
    while (this.fixI < st.fix.length && st.fix[this.fixI].x < this.scroll + W + 2.5) { const f = st.fix[this.fixI++]; this.spawn(f.type, { ...f.o, x: f.x - this.scroll }); }
    if (this.cp + 1 < st.cps.length && this.t >= st.cps[this.cp + 1] && p.alive && this.mode === 'play') { this.cp++; this.fx.push({ k: 'cp' }); }
    const w = st.windAt(this.t); this.windX += (w[0] + (this.bwx || 0) - this.windX) * 0.04; this.windY += (w[1] + (this.bwy || 0) - this.windY) * 0.04; this.bwx = this.bwy = 0;
    this.heatMul = st.heatAt(this.t); this.flood = st.floodAt(this.t); this.wall = st.pursuitAt(this.t);

    // blocks: current positions and the on-screen active list
    this.ab = [];
    for (const b of this.blocks) {
      if (b.dead) continue;
      if (b.k === 'pist') { const ph = ((this.gt / b.per + b.ph) % 1 + 1) % 1; const s = ph < 0.12 ? ph / 0.12 : ph < 0.3 ? 1 : ph < 0.75 ? 1 - (ph - 0.3) / 0.45 : 0; if (b.ax === 'x') b.cx = b.x + b.amp * s; else b.cy = b.y + b.amp * s; }
      else if (b.detT !== undefined && this.t >= b.detT) { b.cx += b.vx * DT; b.cy += b.vy * DT; b.vy -= (b.g || 0) * DT; b.rot = (b.rot || 0) + (b.vr || 0) * DT; if (b.cy < -12 || b.cy > 32) b.dead = true; if (!b.det) { b.det = 1; this.fx.push({ k: 'tear', x: b.cx - this.scroll, y: b.cy }); } }
      else if (b.grow) { b.growT = (b.growT || 0) + 1; }
      const sx = b.cx - this.scroll; if (sx > -b.w / 2 - 2 && sx < W + b.w / 2 + 2) this.ab.push(b);
    }

    if (p.alive && this.mode !== 'clear') this.player(inp); else if (!p.alive) { if (--this.deadT <= 0) { if (this.lives < 0) { this.over = true; this.fx.push({ k: 'over' }); return; } this.restore(false); this.fx.push({ k: 'respawn' }); return; } }
    else { p.x += (10 - p.x) * 0.01; p.firing = false; p.charge = 0; p.tier = 0; }
    this.anchor(inp);
    this.shots();
    // enemies
    const en = this.en;
    for (let i = 0; i < en.length; i++) {
      const e = en[i]; if (e.dead) continue;
      e.t++; if (e.flash > 0) e.flash--; if (e.world) e.x -= ds;
      if (e.boss) { e.gate = Math.min(e.gateMax, e.gate + e.gateMax / 60); BOSSES[e.boss].update(e, this); for (const q of e.parts) { q.x = e.x + q.ox; q.y = e.y + q.oy; if (q.flash > 0) q.flash--; } }
      else FOES[e.type].update(e, this);
      if (!e.seen && e.x > -1 && e.x < W + 1) e.seen = true;
      if (!e.boss && (e.x < -9 || e.x > W + 12 || e.y < -9 || e.y > H + 9 || (e.seen && (e.x < -4 || e.x > W + 4.5)) || e.t > 5400)) e.dead = true, e.left = true;
    }
    for (let i = en.length - 1; i >= 0; i--) if (en[i].dead && !(en[i].boss && !en[i].gone)) en.splice(i, 1);
    // enemy bullets
    const eb = this.eb;
    for (let i = eb.length - 1; i >= 0; i--) {
      const b = eb[i]; b.t++; b.vy -= b.g * DT; b.x += b.vx * DT; b.y += b.vy * DT;
      let gone = b.x < -1 || b.x > W + 1 || b.y < -1 || b.y > H + 1 || b.t > 900;
      if (!gone && !b.ghost && this.solidAt(b.x, b.y)) gone = true;
      if (!gone && a.st && Math.hypot(b.x - a.x, b.y - a.y) < 0.85 + b.r) { gone = true; this.fx.push({ k: 'absorb', x: b.x, y: b.y }); }
      if (!gone) for (let m = 0; m < p.motes; m++) if (Math.hypot(b.x - p.m[m].x, b.y - p.m[m].y) < 0.5 + b.r) { gone = true; this.fx.push({ k: 'absorb', x: b.x, y: b.y }); break; }
      if (gone) { eb[i] = eb[eb.length - 1]; eb.pop(); }
    }
    // pickups
    for (let i = this.pk.length - 1; i >= 0; i--) {
      const k = this.pk[i]; k.t++; k.x -= (1.5 * DT + Math.max(0, ds)); k.y = clamp(k.y0 + Math.sin(k.t * 0.06) * 0.5, this.floor(k.x) + 0.8, this.ceil(k.x) - 0.8);
      if (k.y < 1 || k.y > H - 1) k.y = clamp(k.y, 1, H - 1);
      if (p.alive && Math.hypot(k.x - p.x, k.y - p.y) < 1.15) { this.collect(k.item); this.pk.splice(i, 1); } else if (k.x < -2) this.pk.splice(i, 1);
    }
    // hazards
    for (let i = this.hz.length - 1; i >= 0; i--) { const h = this.hz[i]; h.t++; if (h.k === 'v' && h.world) h.x -= ds; if (h.t === h.tele) this.fx.push({ k: 'strike', h }); if (h.t > h.tele + h.dur) this.hz.splice(i, 1); }
    for (let i = this.arcs.length - 1; i >= 0; i--) if (--this.arcs[i].life <= 0) this.arcs.splice(i, 1);
    if (this.chainT > 0 && --this.chainT === 0) this.chain = 0;
    if (p.alive && this.mode === 'play') this.collide();
    if (!this.boss && this.bossDie === 0 && this.t >= st.endT && this.mode === 'play' && p.alive) {
      this.mode = 'clear'; this.clearT = 200; const bonus = 5000 + this.si * 1000 + (this.stageDeaths === 0 ? 10000 : 0);
      this.addScore(bonus); this.fx.push({ k: 'clear', bonus, flawless: this.stageDeaths === 0 }); this.eb.length = 0;
    }
  }

  advance() {
    if (this.practice) { this.over = true; this.fx.push({ k: 'practiceDone' }); return; }
    if (this.si + 1 < this.stages.length) this.startStage(this.si + 1, 0);
    else { this.won = true; this.fx.push({ k: 'ending' }); }
  }
  nextLoop() { this.won = false; this.epi = false; this.loop++; this.startStage(0, 0); }
  epilogue(st) { this.won = false; this.epi = true; this.st = st; this.cp = 0; this.restore(true); this.fx.push({ k: 'stage', i: -1 }); }

  event(e) {
    if (e.k === 'foe') this.spawn(e.type, e.o);
    else if (e.k === 'hbolt') this.hz.push({ k: 'h', y: e.y, half: e.half || 0.8, tele: e.tele || 60, dur: e.dur || 22, t: 0 });
    else if (e.k === 'vbolt') this.hz.push({ k: 'v', x: e.x, half: e.half || 0.8, tele: e.tele || 60, dur: e.dur || 22, t: 0, world: e.world });
    else if (e.k === 'boss') this.spawnBoss(e.name);
    else if (e.k === 'msg') this.fx.push({ k: 'msg', text: e.text, sub: e.sub });
    else if (e.k === 'flash') this.fx.push({ k: 'flash', s: e.s || 1 });
  }
  hbolt(y, tele = 60, dur = 22, half = 0.8) { this.hz.push({ k: 'h', y, half, tele, dur, t: 0 }); }
  vbolt(x, tele = 60, dur = 22, half = 0.8) { this.hz.push({ k: 'v', x, half, tele, dur, t: 0 }); }

  collect(item) {
    const p = this.p, a = this.a; this.addScore(500);
    if (item === 'M') p.motes = Math.min(2, p.motes + 1);
    else if (item === 'S') p.seek = true;
    else { const c = item === 'A' ? 1 : item === 'R' ? 2 : 3; if (!a.st) { a.st = 5; a.x = -2; a.y = p.y; p.lvl = 1; } else p.lvl = Math.min(3, p.lvl + 1); p.core = c; }
    this.fx.push({ k: 'pickup', item, x: p.x, y: p.y });
  }

  // ---------------------------------------------------------------- player
  player(inp) {
    const p = this.p, sp = SPEEDS[p.sp];
    if (inp.spUp) { p.sp = Math.min(3, p.sp + 1); this.fx.push({ k: 'speed', n: p.sp }); }
    if (inp.spDn) { p.sp = Math.max(0, p.sp - 1); this.fx.push({ k: 'speed', n: p.sp }); }
    let mx = clamp(inp.x || 0, -1, 1) * sp * DT, my = clamp(inp.y || 0, -1, 1) * sp * DT; const lim = sp * DT * 1.7;
    mx += clamp(inp.dx || 0, -lim, lim); my += clamp(inp.dy || 0, -lim, lim);
    if (p.recoil > 0) { mx -= p.recoil * DT; p.recoil = Math.max(0, p.recoil - 14 * DT); }
    mx += this.windX * DT; my += this.windY * DT;
    p.vy += (my / DT - p.vy) * 0.25; p.x = clamp(p.x + mx, 0.9, W - 0.9); p.y = clamp(p.y + my, 0.6, H - 0.6);
    if (p.inv > 0) p.inv--;
    // heat and lock
    const hm = this.heatMul; p.heat = Math.max(0, p.heat - (1.25 / hm) * DT); if (p.lock && p.heat <= 0.25) { p.lock = false; this.fx.push({ k: 'unlock' }); }
    if (p.fireCd > 0) p.fireCd--;
    const hold = !!inp.fire && !p.lock;
    let charging = false;
    if (hold) { p.holdT++; if (p.holdT > 11 && p.beamT <= 0) { charging = true; p.charge = Math.min(CHARGE[2] + 0.2, p.charge + DT); const t = p.charge >= CHARGE[2] ? 3 : p.charge >= CHARGE[1] ? 2 : p.charge >= CHARGE[0] ? 1 : 0; if (t !== p.tier) { p.tier = t; this.fx.push({ k: 'tier', n: t }); } } }
    else { if (p.tier > 0 && !p.lock) this.release(); p.holdT = 0; p.charge = 0; p.tier = 0; }
    const want = !p.lock && !charging && p.beamT <= 0 && (this.auto || (inp.fire && p.holdT === 1) || inp.rapid);
    p.firing = want;
    if (want && p.fireCd <= 0) { p.fireCd = 7; this.ps.push({ x: p.x + 0.9, y: p.y, vx: 30, vy: 0, r: 0.22, dmg: 10, k: 0, life: 90 }); this.fx.push({ k: 'shot' }); }
    // beam
    if (p.beamT > 0) { p.beamT--; this.beam(); }
    // seekers
    if (p.seek && want) { if (--p.seekCd <= 0) { p.seekCd = 66; for (const s of [1, -1]) this.ps.push({ x: p.x, y: p.y + s * 0.4, vx: 5, vy: s * 7, r: 0.25, dmg: 22, k: 5, life: 200 }); } }
    // motes
    for (let i = 0; i < 2; i++) { const m = p.m[i], ty = p.y + (i ? -1.65 : 1.65); m.x += (p.x - 0.2 - m.x) * 0.22; m.y += (ty - m.y) * 0.22; }
    p.light += ((p.beamT > 0 ? 1 : p.tier / 3) - p.light) * 0.1;
  }

  release() {
    const p = this.p, hm = this.heatMul, t = p.tier;
    if (t === 1) { this.ps.push({ x: p.x + 1, y: p.y, vx: 32, vy: 0, r: 0.42, dmg: 46, k: 1, life: 90 }); p.heat += 0.08 * hm; }
    else if (t === 2) { this.ps.push({ x: p.x + 1, y: p.y, vx: 30, vy: 0, r: 0.75, dmg: 115, k: 2, life: 90, pierce: true, hit: new Set() }); p.heat += 0.34 * hm; p.recoil = 3; }
    else { p.beamT = 28; p.heat += 0.92 * hm; p.recoil = 9; }
    this.fx.push({ k: 'release', n: t, x: p.x, y: p.y });
    if (p.heat >= 1) { p.heat = Math.min(p.heat, 1.3); p.lock = true; this.fx.push({ k: 'lock' }); }
  }

  beam() {
    const p = this.p, by = p.y, x0 = p.x + 0.8; let xe = W + 1;
    for (let x = x0; x < W + 1; x += 0.4) { const wx = this.scroll + x; if (by < this.st.floorAt(wx) || by > this.st.ceilAt(wx)) { xe = x; break; } }
    for (const b of this.ab) { if (Math.abs(by - b.cy) < b.h / 2 + 0.3) { const bx = b.cx - this.scroll - b.w / 2; if (bx > x0 - b.w && bx < xe) { if (b.hp !== undefined) { this.hitBlock(b, 9); if (!b.dead) xe = Math.max(x0, bx); } else xe = Math.max(x0, bx); } } }
    // nearest armour stops the beam
    for (const e of this.en) { if (e.dead || e.hidden) continue; if (e.parts) { for (const q of e.parts) if (q.on && q.armor && q.x > x0 && q.x - q.r < xe && Math.abs(q.y - by) < q.r + 0.3) xe = q.x - q.r; } else if (FOES[e.type].guard && e.x > x0 && e.x < xe && Math.abs(e.y - by) < e.r + 0.3 && FOES[e.type].guard(e, { k: 'beam', vx: 1 }, this, 0)) xe = e.x - e.r; if (e.segs) for (const s of e.segs) if (s.x > x0 && s.x < xe && Math.abs(s.y - by) < 0.75) xe = s.x - 0.5; }
    const src = { k: 'beam', vx: 1, y: by };
    for (const e of this.en) { if (e.dead) continue; if (e.hidden && e.x > x0 && e.x < xe && Math.abs(e.y - by) < 2.2) e.reveal = true;
      if (e.parts) { for (const q of e.parts) if (q.on && !q.armor && q.x + q.r > x0 && q.x - q.r < xe + 0.3 && Math.abs(q.y - by) < q.r + 0.5) { src.x = q.x; this.hurt(e, 520 * DT, src, q); } if (e.onBeam) e.onBeam(e, this, by, x0, xe); }
      else if (e.x + e.r > x0 && e.x - e.r < xe + 0.3 && Math.abs(e.y - by) < e.r + 0.5) { src.x = e.x; this.hurt(e, 520 * DT, src); } }
    p.beamX = xe;
  }

  hitBlock(b, dmg, sx, sy) {
    if (b.k === 'seed') { if (!b.grown) { b.grown = 1; const n = b.n || 4; for (let i = 1; i <= n; i++) this.blocks.push({ k: 'cry', x: b.x, y: b.y + i * b.g * 1.3, cx: b.x, cy: b.y + i * b.g * 1.3, w: 1.3, h: 1.3, hp: 60, max: 60, grow: 1, growT: -i * 8 }); this.fx.push({ k: 'grow', x: b.cx - this.scroll, y: b.cy }); } return; }
    if (b.hp === undefined) return;
    b.hp -= dmg; b.flash = 3;
    if (b.hp <= 0) { b.dead = true; this.fx.push({ k: 'shatter', x: b.cx - this.scroll, y: b.cy, s: Math.max(b.w, b.h) * 0.6, kind: b.k }); this.addScore(20); if (b.onDie) b.onDie(this, b); }
  }

  // ---------------------------------------------------------------- the Anchor and its tether
  anchor(inp) {
    const a = this.a, p = this.p; if (!a.st) return;
    a.spin += 0.12 + (a.st >= 3 ? 0.2 : 0);
    if (!p.alive) { a.st = a.st <= 2 ? a.st : 4; if (a.st <= 2) { a.x -= 0.02; } return; }
    if (inp.anchor) {
      const push = (inp.x || 0) + (inp.dx || 0) * 8;
      if (a.st === 1 && push < -0.3) { a.st = 2; this.fx.push({ k: 'swap', x: p.x, y: p.y }); }
      else if (a.st === 2 && push > 0.3) { a.st = 1; this.fx.push({ k: 'swap', x: p.x, y: p.y }); }
      else if (a.st <= 2) { a.vx = (a.st === 1 ? 1 : -1) * 30; a.st = 3; a.free = 0; this.fx.push({ k: 'launch', x: a.x, y: a.y }); }
      else if (a.st !== 5) { a.st = 5; a.lat = null; this.fx.push({ k: 'recall' }); }
    }
    const lvl = p.lvl, src = { k: 'anchor' };
    if (a.st === 1) { a.x = p.x + 1.15; a.y = p.y; } else if (a.st === 2) { a.x = p.x - 1.15; a.y = p.y; }
    else if (a.st === 3) { a.free++; a.x += a.vx * DT; if (a.x > W - 1 || a.x < 1 || this.solidAt(a.x + Math.sign(a.vx) * 0.5, a.y)) { a.x = clamp(a.x - a.vx * DT, 1, W - 1); a.st = 4; this.fx.push({ k: 'thunk', x: a.x, y: a.y }); } }
    else if (a.st === 4) { a.free++; a.y += clamp(p.y - a.y, -1.4 * DT, 1.4 * DT); if (this.solidAt(a.x, a.y, 0.3)) { const f = Math.max(this.floor(a.x), 0), c = Math.min(this.ceil(a.x), H); a.y += ((f + c) / 2 - a.y) * 0.08; a.x -= Math.max(0, this.ds); if (a.x < 1) a.st = 5; } if (Math.hypot(a.x - p.x, a.y - p.y) < 1.0 && a.free > 24) this.dock(); }
    else if (a.st === 6) { const e = a.lat; if (!e || e.dead || (a.latP && !a.latP.on)) { a.st = 4; a.lat = null; } else { const t = a.latP || e; a.x = t.x + a.lox; a.y = t.y + a.loy; } a.free++; }
    else if (a.st === 5) { const dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy) || 1; if (d < 1.2) this.dock(); else { a.x += (dx / d) * 26 * DT; a.y += (dy / d) * 26 * DT; } }
    // contact damage, and latching on to anything big when thrown
    const cd = (130 + lvl * 30) * DT;
    for (const e of this.en) {
      if (e.dead || e.hidden) continue;
      if (e.parts) { for (const q of e.parts) if (q.on && Math.hypot(q.x - a.x, q.y - a.y) < q.r + 0.75) { this.hurt(e, cd, src, q); if (a.st === 3) { if (q.armor) { a.st = 4; a.x -= a.vx * DT * 2; } else { a.st = 6; a.lat = e; a.latP = q; a.lox = a.x - q.x; a.loy = a.y - q.y; } this.fx.push({ k: 'thunk', x: a.x, y: a.y }); } } }
      else if (Math.hypot(e.x - a.x, e.y - a.y) < e.r + 0.75) { src.x = a.x; const big = e.hp > 70; this.hurt(e, FOES[e.type].soft ? 0 : cd, src); if (a.st === 3 && big && !e.dead && !FOES[e.type].soft) { a.st = 6; a.lat = e; a.latP = null; a.lox = a.x - e.x; a.loy = a.y - e.y; this.fx.push({ k: 'thunk', x: a.x, y: a.y }); } }
      if (e.segs) for (const s of e.segs) if (a.st === 3 && Math.hypot(s.x - a.x, s.y - a.y) < 1.2) { a.st = 4; a.x -= a.vx * DT * 2; }
    }
    for (const b of this.ab) if (b.hp !== undefined && Math.abs(a.x - (b.cx - this.scroll)) < b.w / 2 + 0.7 && Math.abs(a.y - b.cy) < b.h / 2 + 0.7) this.hitBlock(b, 4);
    // motes also bump
    for (let m = 0; m < p.motes; m++) for (const e of this.en) if (!e.dead && !e.hidden && !e.parts && Math.hypot(e.x - p.m[m].x, e.y - p.m[m].y) < e.r + 0.45) this.hurt(e, 70 * DT, { k: 'mote' });
    const firing = p.firing;
    if (a.st >= 3) {
      // tether: a live cutting line between ship and Anchor
      const ts = { k: 'tether' }, td = (95 + 30 * lvl) * (p.core === 3 ? 1.6 : 1) * DT;
      for (const e of this.en) {
        if (e.dead || e.hidden || FOES[e.type]?.soft) continue;
        if (e.parts) { for (const q of e.parts) if (q.on && !q.armor && segDist(q.x, q.y, p.x, p.y, a.x, a.y) < q.r + 0.3) { ts.x = q.x; ts.y = q.y; this.hurt(e, td, ts, q); } }
        else if (segDist(e.x, e.y, p.x, p.y, a.x, a.y) < e.r + 0.3) { ts.x = e.x; ts.y = e.y; this.hurt(e, td, ts); }
      }
      for (const b of this.ab) if (b.hp !== undefined && segDist(b.cx - this.scroll, b.cy, p.x, p.y, a.x, a.y) < Math.max(b.w, b.h) / 2 + 0.2) this.hitBlock(b, 2.5);
      if (p.core === 1 && --a.zap <= 0) { a.zap = 26 - lvl * 3; let best = null, bd = 3.8; for (const e of this.en) { if (e.dead || e.hidden || e.parts || FOES[e.type].soft) continue; const d = segDist(e.x, e.y, p.x, p.y, a.x, a.y); if (d < bd) { bd = d; best = e; } } if (best) { const mx = (p.x + a.x) / 2, my = (p.y + a.y) / 2; this.arcs.push({ pts: [mx, my, best.x, best.y], life: 7 }); this.hurt(best, 22 + lvl * 6, { k: 'tether', x: best.x, y: best.y }); this.fx.push({ k: 'zap' }); } }
      if (p.core === 2 && --a.zap <= 0) { a.zap = 34 - lvl * 4; const dx = a.x - p.x, dy = a.y - p.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d; for (const u of [0.33, 0.66]) for (const s of [1, -1]) this.ps.push({ x: p.x + dx * u, y: p.y + dy * u, vx: nx * s * 15, vy: ny * s * 15, r: 0.2, dmg: 10 + lvl * 2, k: 3, life: 110, bn: 2 }); }
      // the free Anchor keeps a light gun trained on whatever is nearest
      if (firing && --a.cd <= 0) { a.cd = 17 - lvl * 3; let best = null, bd = 400; for (const e of this.en) { if (e.dead || e.hidden || FOES[e.type]?.soft) continue; const tx = e.parts ? (e.parts.find((q) => q.on && q.weak) || e) : e; const d = (tx.x - a.x) ** 2 + (tx.y - a.y) ** 2; if (d < bd && tx.x > -0.5 && tx.x < W + 0.5) { bd = d; best = tx; } } const an = best ? Math.atan2(best.y - a.y, best.x - a.x) : 0; this.ps.push({ x: a.x, y: a.y, vx: Math.cos(an) * 24, vy: Math.sin(an) * 24, r: 0.2, dmg: 7, k: 6, life: 80 }); }
    } else if (firing && p.core && --p.coreCd <= 0) this.coreFire(a.st === 1 ? 1 : -1);
  }

  dock() { const a = this.a, p = this.p; a.st = a.x >= p.x ? 1 : 2; a.lat = null; this.fx.push({ k: 'dock', x: p.x, y: p.y }); }

  coreFire(dir) {
    const p = this.p, a = this.a, lvl = p.lvl, ox = a.x + dir * 0.7, oy = a.y;
    if (p.core === 1) {
      p.coreCd = 30 - lvl * 4; let cur = { x: ox, y: oy }, pts = [ox, oy]; const used = new Set(); let range = 15, n = 0;
      for (let j = 0; j <= lvl; j++) {
        let best = null, bq = null, bd = range;
        for (const e of this.en) { if (e.dead || e.hidden || used.has(e) || FOES[e.type]?.soft) continue; const tg = e.parts ? e.parts.filter((q) => q.on && !q.armor) : [e]; for (const q of tg) { if (j === 0 && (q.x - ox) * dir < -0.5) continue; if (q.x < -0.5 || q.x > W + 0.5) continue; const d = Math.hypot(q.x - cur.x, q.y - cur.y) - (q.r || 0); if (d < bd) { bd = d; best = e; bq = e.parts ? q : null; } } }
        if (!best) break; used.add(best); const t = bq || best; pts.push(t.x, t.y); this.hurt(best, 24 + lvl * 7, { k: 'core', vx: dir, x: t.x, y: t.y }, bq); cur = { x: t.x, y: t.y }; range = 6.5; n++;
      }
      if (n) { this.arcs.push({ pts, life: 8 }); this.fx.push({ k: 'zap' }); } else this.ps.push({ x: ox, y: oy, vx: dir * 26, vy: 0, r: 0.22, dmg: 9, k: 6, life: 70 });
    } else if (p.core === 2) {
      p.coreCd = 20; const angs = lvl === 1 ? [0.7, -0.7] : lvl === 2 ? [0.7, 0, -0.7] : [0.75, 0.35, -0.35, -0.75];
      for (const an of angs) this.ps.push({ x: ox, y: oy, vx: Math.cos(an) * 17 * dir, vy: Math.sin(an) * 17, r: 0.22, dmg: 11 + lvl * 2, k: 3, life: 170, bn: 2 + lvl });
      this.fx.push({ k: 'rico' });
    } else {
      p.coreCd = 26 - lvl * 2; for (const s of [1, -1]) this.ps.push({ x: ox, y: oy, vx: dir * 3, vy: s * 15, r: 0.26, dmg: 15 + lvl * 5, k: 4, life: 240, dir, cr: 0 });
      if (lvl === 3) this.ps.push({ x: ox, y: oy, vx: dir * 24, vy: 0, r: 0.3, dmg: 20, k: 6, life: 80 });
      this.fx.push({ k: 'burrow' });
    }
  }

  // ---------------------------------------------------------------- player shots
  shots() {
    const ps = this.ps, st = this.st;
    for (let i = ps.length - 1; i >= 0; i--) {
      const s = ps[i]; s.life--; let gone = s.life <= 0;
      if (s.k === 5) { let best = null, bd = 900; for (const e of this.en) { if (e.dead || e.hidden || FOES[e.type]?.soft) continue; const d = (e.x - s.x) ** 2 + (e.y - s.y) ** 2; if (d < bd) { bd = d; best = e; } } if (best) { const dx = best.x - s.x, dy = best.y - s.y, d = Math.hypot(dx, dy) || 1; s.vx += (dx / d) * 60 * DT; s.vy += (dy / d) * 60 * DT; } else s.vx += 30 * DT; const v = Math.hypot(s.vx, s.vy); if (v > 17) { s.vx *= 17 / v; s.vy *= 17 / v; } }
      s.x += s.vx * DT; s.y += s.vy * DT;
      if (s.x < -1 || s.x > W + 1) gone = true;
      if (!gone) {
        const wx = this.scroll + s.x, f = Math.max(st.floorAt(wx), -0.2), c = Math.min(st.ceilAt(wx), H + 0.2);
        if (s.k === 4 && s.cr) { s.y = s.cr > 0 ? c - 0.25 : f + 0.25; if (this.solidAt(s.x + s.dir * 0.4, s.y)) gone = true; }
        else if (s.y < f || s.y > c) {
          if (s.k === 3 && s.bn > 0) { s.bn--; s.vy = -s.vy; s.y = s.y < f ? f + 0.05 : c - 0.05; this.fx.push({ k: 'spark', x: s.x, y: s.y }); }
          else if (s.k === 4) { s.cr = s.y < f ? -1 : 1; s.vy = 0; s.vx = s.dir * 11; s.life = Math.min(s.life, 130); }
          else { gone = true; this.fx.push({ k: 'spark', x: s.x, y: s.y }); }
        }
      }
      if (!gone) for (const b of this.ab) {
        if (Math.abs(this.scroll + s.x - b.cx) < b.w / 2 + s.r * 0.5 && Math.abs(s.y - b.cy) < b.h / 2 + s.r * 0.5) {
          if (b.hp !== undefined || b.k === 'seed') { this.hitBlock(b, s.dmg, s.x, s.y); if (!(s.pierce && b.dead)) gone = true; }
          else if (s.k === 3 && s.bn > 0) { s.bn--; s.vx = -s.vx; s.x += s.vx * DT * 2; }
          else gone = true;
          if (gone) this.fx.push({ k: 'spark', x: s.x, y: s.y }); break;
        }
      }
      if (!gone) {
        const src = { k: s.k === 2 ? 'wave' : s.k >= 3 ? 'core' : 'bolt', vx: s.vx, x: s.x, y: s.y, shot: s };
        for (const e of this.en) {
          if (e.dead) continue;
          if (e.hidden) { if (s.k === 2 && Math.hypot(e.x - s.x, e.y - s.y) < 3) e.reveal = true; continue; }
          if (e.parts) {
            if (s.k === 2 && e.onWave) e.onWave(e, this, s);
            for (const q of e.parts) { if (!q.on || Math.hypot(q.x - s.x, q.y - s.y) > q.r + s.r) continue; if (s.pierce) { if (q.armor) { gone = true; this.fx.push({ k: 'tink', x: s.x, y: s.y }); break; } if (s.hit.has(q)) continue; s.hit.add(q); this.hurt(e, s.dmg, src, q); } else { if (this.hurt(e, s.dmg, src, q)) { gone = true; break; } } }
          } else {
            if (e.segs) for (const g of e.segs) if (Math.hypot(g.x - s.x, g.y - s.y) < 0.6 + s.r) { gone = true; this.fx.push({ k: 'tink', x: s.x, y: s.y }); break; }
            if (!gone && Math.hypot(e.x - s.x, e.y - s.y) < e.r + s.r) { if (s.pierce) { if (!s.hit.has(e)) { s.hit.add(e); if (this.hurt(e, s.dmg, src) && FOES[e.type].guard && !e.dead && e.hp === e.max) gone = true; } } else if (this.hurt(e, s.dmg, src)) gone = true; }
          }
          if (gone) break;
        }
        if (gone && !s.pierce) this.fx.push({ k: 'hit', x: s.x, y: s.y });
      }
      if (gone) { ps[i] = ps[ps.length - 1]; ps.pop(); }
    }
  }

  // ---------------------------------------------------------------- what can kill the ship
  collide() {
    const p = this.p; if (p.inv > 0) return;
    const wx = this.scroll + p.x, st = this.st; let hit = null;
    if (p.y - 0.26 < st.floorAt(wx) || p.y + 0.26 > st.ceilAt(wx)) hit = 'wall';
    if (!hit) for (const b of this.ab) if (Math.abs(wx - b.cx) < b.w / 2 + 0.22 && Math.abs(p.y - b.cy) < b.h / 2 + 0.2 && !(b.grow && b.growT < 0)) { hit = 'wall'; break; }
    if (!hit && this.flood !== null && p.y - 0.3 < this.flood) hit = 'flood';
    if (!hit && this.wall !== null && p.x < this.wall) hit = 'wall';
    if (!hit) for (const h of this.hz) if (h.t >= h.tele && h.t < h.tele + h.dur && (h.k === 'h' ? Math.abs(p.y - h.y) < h.half : Math.abs(p.x - h.x) < h.half)) { hit = 'bolt'; break; }
    if (!hit) for (const v of this.vents) { const sx = v.x - this.scroll; if (sx < -2 || sx > W + 2 || v.x < this.ventMin) continue; const ph = ((this.gt / v.per + v.ph) % 1 + 1) % 1; if (ph < v.duty && Math.abs(p.x - sx) < v.half && p.y > v.y0 && p.y < v.y1) { hit = 'vent'; break; } }
    if (!hit) for (const b of this.eb) if (Math.hypot(b.x - p.x, b.y - p.y) < b.r + 0.13) { hit = 'bullet'; b.t = 9999; break; }
    if (!hit) for (const e of this.en) {
      if (e.dead || e.hidden) continue;
      if (e.parts) { for (const q of e.parts) if (q.on && !q.ghost && Math.hypot(q.x - p.x, q.y - p.y) < q.r * 0.85 + 0.2) { hit = 'foe'; break; } if (e.lines) for (const l of e.lines) if (segDist(p.x, p.y, l[0], l[1], l[2], l[3]) < 0.3) { hit = 'foe'; break; } }
      else if (FOES[e.type].soft) { const d = Math.hypot(e.x - p.x, e.y - p.y), m = e.r * 0.9 + 0.3; if (d < m) { p.x = clamp(p.x + ((p.x - e.x) / (d || 1)) * (m - d) * 0.5, 0.9, W - 0.9); p.y = clamp(p.y + ((p.y - e.y) / (d || 1)) * (m - d) * 0.5, 0.6, H - 0.6); } }
      else if (Math.hypot(e.x - p.x, e.y - p.y) < e.r * 0.8 + 0.2) hit = 'foe';
      if (!hit && e.segs) for (const s of e.segs) if (Math.hypot(s.x - p.x, s.y - p.y) < 0.65) { hit = 'foe'; break; }
      if (hit) break;
    }
    if (hit) this.die(hit);
  }

  die(why) {
    const p = this.p;
    if (this.sight || this.god) { this.hits++; p.inv = 70; this.fx.push({ k: 'hitp', why }); if (why === 'wall' || why === 'flood') this.unstick(); return; }
    if (p.shield > 0) { p.shield--; p.inv = 110; this.fx.push({ k: 'shield' }); if (why === 'wall' || why === 'flood') this.unstick(); return; }
    p.alive = false; this.deadT = 85; this.deaths++; this.stageDeaths++; if (!this.practice && !this.endless) this.lives--; this.chain = 0;
    this.fx.push({ k: 'die', x: p.x, y: p.y, why });
  }
  unstick() { const p = this.p; for (let i = 0; i < 40; i++) { const f = Math.max(this.floor(p.x), this.flood === null ? -9 : this.flood, 0), c = Math.min(this.ceil(p.x), H); if (c - f > 1.4) { p.y = clamp(p.y, f + 0.7, c - 0.7); if (!this.solidAt(p.x, p.y, 0.3)) return; } p.x = Math.max(1, p.x - 0.4); } }
}

// STARLING 2026 — deterministic fixed-step simulation of an original formation shooter.
// Flocks of machine-birds murmurate over a lighthouse, settle into a formation and stoop on you.
// You can call the lighthouse beam onto your column: anything caught in it is dazzled.
export const W = 18, H = 24, DT = 1 / 60;
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = 6.2832, sin = Math.sin, cos = Math.cos;
export const TYPES = {
  finch: { hp: 1, r: 0.45, sc: 50, sp: 9 },
  shrike: { hp: 1, r: 0.5, sc: 80, sp: 11 },
  heron: { hp: 2, r: 0.65, sc: 150, sp: 8 },
  kite: { hp: 3, r: 0.7, sc: 400, sp: 9.5 },
  roost: { hp: 70, r: 2.2, sc: 5000, sp: 2 },
};
const COLS = 8;

export class Sim {
  constructor() { this.fx = []; this.xr = 8.2; } // xr: how far the ship may travel either side of centre; main widens it on wide screens
  newGame(o = {}) {
    this.rs = (o.seed || 1121) >>> 0; this.score = 0; this.lives = 3; this.nextLife = 30000; this.wave = (o.wave || 1) - 1; this.over = false; this.tick = 0; this.god = !!o.god;
    this.p = { x: W / 2, alive: true, inv: 120, cd: 0, twin: 0, beamCd: 0, beamT: 0, beamX: W / 2, dead: 0, vx: 0 };
    this.shots = []; this.foes = []; this.eb = []; this.embers = []; this.chain = 0; this.chainT = 0; this.kills = 0; this.shotsFired = 0; this.hitsLanded = 0; this.fx.length = 0;
    this.nextWave();
  }
  rnd() { let t = (this.rs += 0x6D2B79F5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }

  nextWave() {
    this.wave++; const n = this.wave; this.wt = 0; this.stoopT = 200; this.missed = 0; this.waveKills = 0; this.waveTotal = 0; this.eb.length = 0;
    this.kind = n % 5 === 0 ? 'roost' : n % 5 === 3 ? 'flight' : 'flock';
    this.fx.push({ k: 'wave', n, kind: this.kind });
    const q = this.queue = []; const lvl = Math.min(10, Math.floor((n - 1) / 2));
    if (this.kind === 'flight') { for (let g = 0; g < 5; g++) for (let i = 0; i < 8; i++) q.push({ t: 90 + g * 150 + i * 9, type: g % 2 ? 'shrike' : 'finch', path: g, i, flight: true }); this.waveTotal = 40; this.settleT = 1e9; return; }
    if (this.kind === 'roost') { q.push({ t: 60, type: 'roost' }); this.waveTotal = 1; this.settleT = 1e9; return; }
    // rows from the top: kites, herons, shrikes, two rows of finches
    const rows = [['kite', Math.min(4, 2 + (lvl >> 2))], ['heron', Math.min(8, 4 + (lvl >> 1))], ['shrike', Math.min(8, 6 + (lvl >> 2))], ['finch', 8], ['finch', n > 1 ? 8 : 6]]; if (n >= 4) rows.push(['finch', 8]);
    const list = []; rows.forEach(([type, cnt], r) => { const c0 = Math.floor((COLS - cnt) / 2); for (let c = 0; c < cnt; c++) list.push({ type, c: c0 + c, r }); });
    // they arrive in ribbons from alternating sides
    let t = 70, g = 0; for (let i = 0; i < list.length; i += 8) { const rib = list.slice(i, i + 8); rib.forEach((s, j) => q.push({ t: t + j * 7, type: s.type, c: s.c, r: s.r, path: g % 4, i: j })); t += Math.max(48, 80 - n * 3); g++; }
    this.waveTotal = list.length; this.settleT = t + 170;
  }

  slot(c, r) { const b = 1 + 0.07 * sin(this.wt * 0.015), sway = sin(this.wt * 0.008) * 1.3; return [W / 2 + (c - (COLS - 1) / 2) * 1.75 * b + sway, 21 - r * 1.55 + sin(this.wt * 0.02 + c) * 0.12]; }
  spawn(o) {
    const d = TYPES[o.type], e = { type: o.type, x: -3, y: 16, vx: 0, vy: 0, hp: d.hp + (o.type === 'roost' ? this.wave * 6 : 0), r: d.r, sc: d.sc, st: 'enter', t: 0, c: o.c, r0: o.r, path: o.path || 0, i: o.i || 0, flight: !!o.flight, dz: 0, cd: 60 + ((this.rnd() * 120) | 0), ph: this.rnd() * TAU, a: 0 };
    e.max = e.hp; if (o.type === 'roost') { e.st = 'roost'; e.x = W / 2; e.y = H + 4; } this.foes.push(e); return e;
  }
  // where a ribbon is along its entry or passing-flight path, u in 0..1
  pathAt(p, u, flight) {
    const m = p % 2 ? -1 : 1, cx = W / 2;
    if (flight) { const k = p % 5; if (k === 0) return [cx + m * (11 - 22 * u), 17 + 4 * sin(u * 6.2)]; if (k === 1) return [cx + m * (-11 + 22 * u), 12 + 5 * sin(u * 4.7 + 1)]; if (k === 2) return [cx + 7 * sin(u * 6.28), 26 - 22 * u + 3 * sin(u * 9)]; if (k === 3) return [cx + m * (11 - 22 * u), 20 - 12 * u + 3 * sin(u * 12)]; return [cx + 8 * cos(u * 9.4), 15 + 6 * sin(u * 9.4) + (0.5 - u) * 8]; }
    if (p < 2) return [cx - m * (12 - 15 * u) + m * 2 * sin(u * 5), 9 + 9 * u + 3 * sin(u * 7)];
    return [cx - m * 6 * cos(u * 5.5), 27 - 11 * u + 2.5 * sin(u * 8)];
  }
  shoot(x, y, vx, vy, k = 0) { const m = Math.min(1.7, 1 + this.wave * 0.035); if (this.eb.length < 110) this.eb.push({ x, y, vx: vx * m, vy: vy * m, k }); }
  add(n, x, y) { this.score += n; if (this.score >= this.nextLife) { this.nextLife += 100000; this.lives++; this.fx.push({ k: 'life' }); } if (n >= 300 && x !== undefined) this.fx.push({ k: 'pts', x, y, n }); }

  hurt(e, dmg) {
    e.hp -= dmg; e.hit = 5; this.hitsLanded++; if (e.hp > 0) { this.fx.push({ k: 'hit', x: e.x, y: e.y }); return; }
    e.dead = true; this.kills++; this.waveKills++; this.chain = this.chainT > 0 ? this.chain + 1 : 1; this.chainT = 70;
    let mult = Math.min(5, 1 + Math.floor((this.chain - 1) / 3)); if (e.st === 'stoop' || e.st === 'return') mult *= 2; if (e.dz > 0) mult *= 2;
    this.add(e.sc * mult, e.x, e.y); this.fx.push({ k: 'boom', x: e.x, y: e.y, type: e.type, mult, big: e.type === 'kite' || e.type === 'roost' });
    if (this.kills % 9 === 0 && e.type !== 'roost') this.embers.push({ x: e.x, y: e.y, t: 0 });
    // a kite's escorts lose their nerve when it falls
    if (e.type === 'kite') for (const o of this.foes) if (!o.dead && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 3.2 && o.type !== 'roost') { o.dz = Math.max(o.dz, 150); }
    if (e.type === 'roost') { this.eb.length = 0; for (const o of this.foes) if (!o.dead && o !== e) { o.dead = true; this.fx.push({ k: 'boom', x: o.x, y: o.y, type: o.type, mult: 1 }); } }
  }

  step(inp) {
    if (this.over) return; this.tick++; this.wt++; const p = this.p, t = this.wt;
    while (this.queue.length && this.queue[0].t <= t) this.spawn(this.queue.shift());
    // the lighthouse beam: it sweeps on its own, and you can call a column of it down
    this.sweep = 1.5708 + 0.95 * sin(this.tick * 0.0075); if (p.beamCd > 0) p.beamCd--; if (p.beamT > 0) p.beamT--;
    if (inp.beam && p.alive && p.beamCd <= 0) { p.beamCd = 600; p.beamT = 150; p.beamX = p.x; this.fx.push({ k: 'beam', x: p.x }); }
    // player
    if (p.alive) {
      const tv = clamp(inp.x || 0, -1, 1) * 11.5; p.vx += (tv - p.vx) * 0.35; p.x = clamp(p.x + p.vx * DT + clamp(inp.dx || 0, -0.5, 0.5), W / 2 - this.xr, W / 2 + this.xr); if (p.inv > 0) p.inv--; if (p.cd > 0) p.cd--; if (p.twin > 0) p.twin--;
      if ((inp.fire || inp.auto) && p.cd <= 0 && this.shots.length < (p.twin > 0 ? 6 : 3)) { p.cd = 8; this.shotsFired++; if (p.twin > 0) { this.shots.push({ x: p.x - 0.42, y: 2.9 }, { x: p.x + 0.42, y: 2.9 }); } else this.shots.push({ x: p.x, y: 3 }); this.fx.push({ k: 'shot' }); }
    } else if (--p.dead <= 0) { if (this.lives <= 0) { this.over = true; this.fx.push({ k: 'over' }); return; } p.alive = true; p.inv = 150; p.x = W / 2; p.vx = 0; this.fx.push({ k: 'respawn' }); }
    for (let i = this.shots.length - 1; i >= 0; i--) { const s = this.shots[i]; s.y += 27 * DT; if (s.y > H + 1) { this.shots.splice(i, 1); } }

    // flock centre for the murmuration, and neighbours for the boids
    const F = this.foes, ax = W / 2 + (6.5 + (this.xr - 8.2) * 0.55) * sin(t * 0.011), ay = 16.5 + 3.2 * sin(t * 0.017 + 1); let mvx = 0, mvy = 0, nf = 0;
    for (const e of F) if (e.st === 'flock') { mvx += e.vx; mvy += e.vy; nf++; } if (nf) { mvx /= nf; mvy /= nf; }
    let idle = 0, stooping = 0, alive = 0; for (const e of F) { if (e.dead) continue; alive++; if (e.st === 'idle') idle++; if (e.st === 'stoop') stooping++; }
    const settle = t > this.settleT, thin = this.kind === 'flock' && this.queue.length === 0 && alive <= 5;
    for (const e of F) {
      if (e.dead) continue; e.t++; if (e.hit > 0) e.hit--; const d = TYPES[e.type], slow = e.dz > 0 ? 0.35 : 1; if (e.dz > 0) e.dz--;
      // dazzle: the called column, or the slow sweep from the lamp
      if (p.beamT > 0 && Math.abs(e.x - p.beamX) < 1.7) e.dz = Math.max(e.dz, 110);
      else { const lx = e.x - W / 2, ly = e.y - 1.15, d2 = Math.abs(lx * sin(this.sweep) - ly * cos(this.sweep)); if (d2 < 0.8 && lx * cos(this.sweep) + ly * sin(this.sweep) > 0) e.dz = Math.max(e.dz, 50); }
      if (e.st === 'enter') { const u = (e.t * slow) / (e.flight ? 300 : 150); const q = this.pathAt(e.path, Math.min(1, u), e.flight); e.vx = (q[0] - e.x) / DT * 0.2; e.vy = (q[1] - e.y) / DT * 0.2; e.x += (q[0] - e.x) * 0.2; e.y += (q[1] - e.y) * 0.2;
        if (!e.flight && this.wave >= 3 && e.dz <= 0 && p.alive && e.t === 60 + ((e.i * 13) % 50) && e.i % 3 === 0) { const an = Math.atan2(2 - e.y, p.x - e.x); this.shoot(e.x, e.y, cos(an) * 8, sin(an) * 8); }
        if (u >= 1) { if (e.flight) { e.dead = true; e.gone = true; this.missed++; } else e.st = settle ? 'form' : 'flock'; } }
      else if (e.st === 'flock') { // boids: cohesion to a wandering centre, alignment, separation
        let sx = 0, sy = 0; for (const o of F) { if (o === e || o.dead || o.st !== 'flock') continue; const dx = e.x - o.x, dy = e.y - o.y, dd = dx * dx + dy * dy; if (dd < 2.2 && dd > 0.001) { sx += dx / dd; sy += dy / dd; } }
        const cx = ax - e.x, cy = ay - e.y; e.vx += (cx * 1.6 + (mvx - e.vx) * 0.9 + sx * 5 + cos(e.ph + t * 0.05) * 2.5) * DT; e.vy += (cy * 1.6 + (mvy - e.vy) * 0.9 + sy * 5 + sin(e.ph + t * 0.043) * 2.5) * DT;
        const v = Math.hypot(e.vx, e.vy) || 1, sp = 7.5; e.vx *= sp / v; e.vy *= sp / v; e.x += e.vx * DT * slow; e.y += e.vy * DT * slow; if (settle) e.st = 'form'; }
      else if (e.st === 'form' || e.st === 'idle') { const q = this.slot(e.c, e.r0), dx = q[0] - e.x, dy = q[1] - e.y, dist = Math.hypot(dx, dy);
        if (e.st === 'form') { const sp = Math.min(12, dist * 4 + 2) * slow; e.vx = (dx / (dist || 1)) * sp; e.vy = (dy / (dist || 1)) * sp; e.x += e.vx * DT; e.y += e.vy * DT; if (dist < 0.15) e.st = 'idle'; }
        else { e.x = q[0]; e.y = q[1]; e.vx = 0; e.vy = -1; if (e.type === 'shrike' && e.dz <= 0 && --e.cd <= 0) { e.cd = Math.max(110, 250 - this.wave * 8) + ((this.rnd() * 160) | 0); if (p.alive && this.wave > 1) { const an = Math.atan2(2 - e.y, p.x - e.x + (this.rnd() - 0.5) * 3); this.shoot(e.x, e.y - 0.5, cos(an) * 8.5, sin(an) * 8.5); } } } }
      else if (e.st === 'stoop') { // turn toward a point just ahead of the ship, limited turn rate, then run off the bottom
        const tx = p.x + (e.off || 0), ty = e.y > 7 ? 2 : -6; let da = Math.atan2(ty - e.y, tx - e.x) - e.a; while (da > 3.1416) da -= TAU; while (da < -3.1416) da += TAU; e.a += clamp(da, -2.6 * DT, 2.6 * DT) * (e.t < 30 ? 0.3 : 1);
        const sp = (d.sp + Math.min(4, this.wave * 0.25)) * slow; e.vx = cos(e.a) * sp; e.vy = sin(e.a) * sp; e.x += e.vx * DT; e.y += e.vy * DT;
        if (e.dz <= 0 && p.alive && e.y > 6 && --e.cd <= 0) { if (e.type === 'shrike' || e.type === 'kite') { e.cd = Math.max(26, 50 - this.wave); const an = Math.atan2(2 - e.y, p.x - e.x), n = this.wave >= 14 ? 3 : this.wave >= 7 ? 2 : 1; for (let k = 0; k < n; k++) { const a2 = an + (k - (n - 1) / 2) * 0.22; this.shoot(e.x, e.y, cos(a2) * 9, sin(a2) * 9); } } else if (e.type === 'heron') { e.cd = 22; this.shoot(e.x, e.y - 0.4, 0, -7, 1); } else { e.cd = 999; if (this.wave >= 4) { const an = Math.atan2(2 - e.y, p.x - e.x); this.shoot(e.x, e.y, cos(an) * 8, sin(an) * 8); } } }
        if (e.y < -1.5 || Math.abs(e.x - W / 2) > this.xr + 5) { e.st = 'return'; e.x = clamp(this.slot(e.c, e.r0)[0], 1, W - 1); e.y = H + 2; } }
      else if (e.st === 'return') { e.st = 'form'; }
      else if (e.st === 'roost') { // the Roost: drifts across the top, sheds stoopers and throws fans of shot
        e.y += (19 - e.y) * 0.02; e.x = W / 2 + 6 * sin(e.t * 0.012) * (e.y < 20 ? 1 : 0); e.vx = 0; e.vy = -1;
        if (e.y < 20 && e.dz <= 0 && --e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = Math.max(40, 95 - this.wave * 3); if (e.n % 3 === 0) { const w = this.wave >= 10 ? 3 : 2; for (let i = -w; i <= w; i++) this.shoot(e.x, e.y - 1.6, i * 2.0, -7.5, 1); } else { for (const s of [-1.7, 1.7]) { const an = Math.atan2(2 - e.y, p.x - (e.x + s)); this.shoot(e.x + s, e.y - 1, cos(an) * 8.5, sin(an) * 8.5); } }
          if (e.n % 2 === 0 && alive < 9) { const b = this.spawn({ type: e.n % 4 ? 'finch' : 'shrike', c: 0, r: 0 }); b.x = e.x; b.y = e.y - 1; b.st = 'stoop'; b.a = -1.5708 + (this.rnd() - 0.5); b.temp = true; b.off = (this.rnd() - 0.5) * 4; } } }
      if (e.temp && e.st === 'form') { e.dead = true; e.gone = true; }
    }
    // who stoops next
    if (this.kind === 'flock' && settle && p.alive && --this.stoopT <= 0 && idle > 0) {
      this.stoopT = thin ? 40 : Math.max(38, 130 - this.wave * 8); const cand = F.filter((e) => !e.dead && e.st === 'idle' && e.dz <= 0); const max = thin ? 5 : Math.min(6, 2 + Math.floor(this.wave / 2));
      if (cand.length && stooping < max + 2) { const lead = cand[(this.rnd() * cand.length) | 0]; const grp = [lead]; if (lead.type === 'kite' || this.wave > 2) for (const o of cand) if (o !== lead && grp.length < (lead.type === 'kite' ? 3 : 2) && Math.abs(o.c - lead.c) <= 1 && o.r0 >= lead.r0) grp.push(o);
        grp.forEach((e, i) => { e.st = 'stoop'; e.t = 0; e.a = 1.5708 + (e.x < W / 2 ? 0.9 : -0.9); e.off = (i - (grp.length - 1) / 2) * 1.6; e.cd = 30 + i * 12; }); this.fx.push({ k: 'stoop', x: lead.x, y: lead.y }); } }
    // shots against foes
    for (let i = this.shots.length - 1; i >= 0; i--) { const s = this.shots[i]; for (const e of F) { if (e.dead) continue; if (Math.abs(s.x - e.x) < e.r + 0.12 && Math.abs(s.y - e.y) < e.r + 0.35) { this.hurt(e, 1); this.shots.splice(i, 1); break; } } }
    // enemy shots, embers, and what can hit the ship
    for (let i = this.eb.length - 1; i >= 0; i--) { const b = this.eb[i]; b.x += b.vx * DT; b.y += b.vy * DT; if (b.y < -1 || Math.abs(b.x - W / 2) > this.xr + 3 || b.y > H + 2) { this.eb.splice(i, 1); continue; } if (p.alive && p.inv <= 0 && Math.abs(b.x - p.x) < 0.42 && Math.abs(b.y - 2) < 0.5) { this.eb.splice(i, 1); this.die(); } }
    for (let i = this.embers.length - 1; i >= 0; i--) { const m = this.embers[i]; m.t++; m.y -= 4.2 * DT; m.x += sin(m.t * 0.07) * 0.02; if (p.alive && Math.abs(m.x - p.x) < 1.1 && Math.abs(m.y - 2) < 1) { p.twin = 960; this.add(500, m.x, m.y); this.fx.push({ k: 'ember', x: m.x, y: m.y }); this.embers.splice(i, 1); } else if (m.y < -1) this.embers.splice(i, 1); }
    if (p.alive && p.inv <= 0) for (const e of F) if (!e.dead && Math.abs(e.x - p.x) < e.r + 0.4 && Math.abs(e.y - 2) < e.r + 0.4) { if (e.type !== 'roost') this.hurt(e, 9); this.die(); break; }
    for (let i = F.length - 1; i >= 0; i--) if (F[i].dead) F.splice(i, 1);
    if (this.chainT > 0 && --this.chainT === 0) this.chain = 0;
    // wave over?
    if (this.queue.length === 0 && F.length === 0 && t > 120 && !this.endT) { this.endT = 110; const perfect = this.kind === 'flight' && this.missed === 0; const bonus = this.kind === 'flight' ? (perfect ? 10000 : (40 - this.missed) * 100) : this.kind === 'roost' ? 3000 : 0; if (bonus) this.add(bonus); this.fx.push({ k: 'clear', kind: this.kind, bonus, perfect, hit: 40 - this.missed }); }
    if (this.endT && --this.endT <= 0) { this.endT = 0; if (p.alive) this.nextWave(); else this.endT = 1; }
  }
  die() { const p = this.p; if (this.god) { p.inv = 60; this.fx.push({ k: 'graze' }); return; } p.alive = false; p.dead = 110; p.twin = 0; this.lives--; this.chain = 0; this.fx.push({ k: 'die', x: p.x, y: 2 }); }
}

// Autopilot for the attract demo and the headless test: sit under something worth shooting, step out of the way of fire.
export function bot(S, mem) {
  const p = S.p, inp = { x: 0, fire: true, auto: true, beam: false }; if (!p.alive) return inp;
  let tx = W / 2, best = 1e9; for (const e of S.foes) { if (e.dead) continue; const lead = e.st === 'stoop' ? 0.25 : 0.12, ex = e.x + e.vx * lead * Math.max(0, (e.y - 3) / 27) * 6; const sc = Math.abs(ex - p.x) + (e.st === 'stoop' ? e.y * 0.25 - 4 : e.y * 0.5) + (e.type === 'roost' ? -6 : 0); if (sc < best) { best = sc; tx = ex; } }
  for (const m of S.embers) if (m.y < 9) { tx = m.x; }
  let bx = 0, bs = 1e9; for (const dx of [-1, 0, 1]) { let s = 0; for (const h of [6, 14, 24]) { const px = clamp(p.x + dx * 11.5 * h * DT, W / 2 - S.xr, W / 2 + S.xr); for (const b of S.eb) { const d = Math.hypot(b.x + b.vx * h * DT - px, b.y + b.vy * h * DT - 2); if (d < 0.75) s += 900; else if (d < 1.7) s += (1.7 - d) * 60; } for (const e of S.foes) { if (e.dead || e.st !== 'stoop') continue; const d = Math.hypot(e.x + e.vx * h * DT - px, e.y + e.vy * h * DT - 2); if (d < e.r + 0.7) s += 700; } }
    const ex = clamp(p.x + dx * 11.5 * 0.25, W / 2 - S.xr, W / 2 + S.xr); s += Math.abs(ex - tx) * 4; if (s < bs) { bs = s; bx = dx; } }
  inp.x = bx; let st = 0; for (const e of S.foes) if (!e.dead && (e.st === 'stoop' || e.type === 'roost') && Math.abs(e.x - p.x) < 2.2) st++; if (st >= 2 || (S.kind === 'roost' && st >= 1)) inp.beam = true;
  return inp;
}

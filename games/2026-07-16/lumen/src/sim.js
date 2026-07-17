// The simulation: deterministic fixed-step world — path, waves, enemies,
// towers, projectiles, particles, economy. Rendering reads this state; it
// never writes back.

import { Rng } from './rng.js';
import { ECON, TOWERS, ENEMIES, MAPS, waveComp, depthScale, WORLD_W, WORLD_H, HORIZON_Y, COLORS, STATUS, MIXES } from './content.js';

export const DT = 1 / 60;

// --- spline → arc-length table ------------------------------------------
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
  ];
}

export function buildPath(map, samplesPerSeg = 24) {
  const pts = map.points;
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < samplesPerSeg; j++) out.push(catmullRom(p0, p1, p2, p3, j / samplesPerSeg));
  }
  out.push(pts[pts.length - 1].slice());
  // arc-length table
  const arc = [0];
  for (let i = 1; i < out.length; i++) {
    arc.push(arc[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  }
  const total = arc[arc.length - 1];
  return { pts: out, arc, total };
}

export function pathPos(path, s) {
  // s in world units along path
  const { pts, arc, total } = path;
  const t = Math.min(Math.max(s, 0), total - 0.001);
  let lo = 0, hi = arc.length - 1;
  while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (arc[mid] <= t) lo = mid; else hi = mid; }
  const f = (t - arc[lo]) / Math.max(1e-6, arc[hi] - arc[lo]);
  const x = pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f;
  const y = pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f;
  const dx = pts[hi][0] - pts[lo][0], dy = pts[hi][1] - pts[lo][1];
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, nx: dx / len, ny: dy / len };
}

// --- sim -----------------------------------------------------------------
export class Sim {
  constructor(mapIndex = 0, seed = null) {
    this.map = MAPS[Math.min(mapIndex, MAPS.length - 1)];
    this.rng = new Rng(seed ?? this.map.seed);
    this.path = buildPath(this.map);
    this.time = 0;
    this.gold = ECON.startGold;
    this.lives = ECON.startLives;
    this.wave = 0;               // last completed/current wave number
    this.state = 'prep';         // prep | wave | over | won
    this.prepLeft = ECON.prepTime * 0.6; // shorter first prep
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.arcs = [];              // tesla lightning polylines (short-lived)
    this.beams = [];             // urchin lances (short-lived)
    this.pools = [];             // ground hazards (embers, meltdown)
    this.particles = [];
    this.rings = [];             // ground shockwaves
    this.discovered = new Set(); // mix reactions the player has seen
    this.spawnQueue = [];
    this.nextId = 1;
    this.kills = 0;
    this.goldEarned = 0;
    this.events = [];            // frame events for renderer/audio/ui juice
    this.flora = this.scatterFlora();
    this.heartHitT = 0;
    this.totalInterest = 0;
    this.surgeBonusTotal = 0;
  }

  scatterFlora() {
    const out = [];
    const rng = new Rng(this.map.seed ^ 0x5EED);
    let attempts = 0;
    while (out.length < this.map.floraCount && attempts++ < 800) {
      const x = rng.range(40, WORLD_W - 40);
      const y = rng.range(HORIZON_Y + 60, WORLD_H - 30);
      const d = this.distToPath(x, y);
      if (d > this.map.pathW + 26 && d < this.map.pathW + 420) {
        out.push({ x, y, seed: rng.next(), phase: rng.range(0, 6.28), excite: 0, size: rng.range(26, 52) });
      }
    }
    return out;
  }

  distToPath(x, y) {
    // coarse then fine scan of the sample table
    const { pts } = this.path;
    let best = Infinity;
    for (let i = 0; i < pts.length; i += 6) {
      const dx = pts[i][0] - x, dy = pts[i][1] - y;
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  emit(type, data) { this.events.push({ type, ...data }); }

  // --- wave control -------------------------------------------------------
  startWave(early = false) {
    if (this.state !== 'prep') return false;
    if (early && this.prepLeft > 0.5) {
      const bonus = Math.floor(this.prepLeft * ECON.surgeBonusPerSec);
      this.gold += bonus; this.goldEarned += bonus; this.surgeBonusTotal += bonus;
      this.emit('surgeBonus', { amount: bonus });
    }
    this.wave++;
    this.state = 'wave';
    const comp = waveComp(this.wave);
    this.clearBonus = comp.clearBonus;
    let t = 0.4;
    for (const e of comp.entries) {
      let tt = t + (e.delay || 0);
      for (let i = 0; i < e.count; i++) {
        this.spawnQueue.push({ at: tt, type: e.type, hpMul: e.hpMul });
        tt += e.gap;
      }
    }
    this.waveT = 0;
    this.emit('waveStart', { wave: this.wave });
    return true;
  }

  spawnEnemy(type, hpMul) {
    const def = ENEMIES[type];
    const e = {
      id: this.nextId++,
      type, def,
      s: 0,                                  // distance along path
      hp: def.hp * hpMul, maxHp: def.hp * hpMul,
      speed: def.speed * this.rng.range(0.92, 1.08),
      x: 0, y: 0, vx: 0, vy: 0,
      wobblePhase: this.rng.range(0, 6.28),
      lane: this.rng.range(-0.55, 0.55),      // offset across the path
      phase: this.rng.range(0, 6.28),
      st: { chill: 0, shock: 0, ignite: 0, corrode: 0, corrodeStacks: 0, freeze: 0 },
      mixCool: 0,
      dead: false,
    };
    const p = pathPos(this.path, 0);
    e.x = p.x; e.y = p.y;
    this.enemies.push(e);
    this.emit('spawn', { id: e.id, type });
  }

  // --- towers ---------------------------------------------------------------
  canPlace(x, y) {
    if (y < HORIZON_Y + 40 || y > WORLD_H - 20 || x < 20 || x > WORLD_W - 20) return false;
    if (this.distToPath(x, y) < this.map.pathW + 30) return false;
    for (const t of this.towers) {
      if (Math.hypot(t.x - x, t.y - y) < 78) return false;
    }
    const hx = this.map.heart[0] - x, hy = this.map.heart[1] - y;
    if (Math.hypot(hx, hy) < 120) return false;
    return true;
  }

  place(typeId, x, y) {
    const def = TOWERS[typeId];
    if (!def || this.gold < def.cost || !this.canPlace(x, y)) return null;
    this.gold -= def.cost;
    const t = {
      id: this.nextId++, type: typeId, def,
      x, y, level: 0,
      cool: 0, charge: 0, phase: this.rng.range(0, 6.28), seed: this.rng.next(),
      kills: 0, spent: def.cost,
    };
    this.towers.push(t);
    this.rings.push({ x, y, t: 0, dur: 1.1, color: def.color, max: 260 });
    this.emit('place', { id: t.id, type: typeId, x, y });
    return t;
  }

  upgrade(tower) {
    const lv = tower.def.levels[tower.level + 1];
    if (!lv || this.gold < lv.cost) return false;
    this.gold -= lv.cost;
    tower.level++;
    tower.spent += lv.cost;
    this.rings.push({ x: tower.x, y: tower.y, t: 0, dur: 0.9, color: tower.def.color, max: 200 });
    this.emit('upgrade', { id: tower.id, level: tower.level });
    return true;
  }

  sell(tower) {
    const refund = Math.floor(tower.spent * ECON.sellRefund);
    this.gold += refund;
    this.towers = this.towers.filter(t => t !== tower);
    this.emit('sell', { id: tower.id, refund });
    return refund;
  }

  towerStats(t) {
    const base = t.def, lv = base.levels[t.level];
    const rateMul = 1 + (t.buffRate || 0), dmgMul = 1 + (t.buffDmg || 0);
    return {
      damage: Math.round((lv.damage || 0) * dmgMul),
      range: lv.range, rate: (lv.rate || 0) * rateMul,
      chain: lv.chain || 0,
      buffRate: lv.buffRate || 0, buffDmg: lv.buffDmg || 0,
    };
  }

  // recompute aura buffs — cheap, tower counts are small
  refreshBuffs() {
    for (const t of this.towers) { t.buffRate = 0; t.buffDmg = 0; }
    for (const b of this.towers) {
      if (b.def.attack !== 'aura') continue;
      const st = b.def.levels[b.level];
      const r2 = st.range * st.range;
      for (const t of this.towers) {
        if (t === b || t.def.attack === 'aura') continue;
        const dx = t.x - b.x, dy = t.y - b.y;
        if (dx * dx + dy * dy <= r2) {
          t.buffRate = Math.max(t.buffRate, st.buffRate);
          t.buffDmg = Math.max(t.buffDmg, st.buffDmg);
        }
      }
    }
  }

  // --- status chemistry ------------------------------------------------------
  applyStatus(e, kind) {
    if (!kind || e.hp <= 0) return;
    const st = e.st;
    if (e.mixCool <= 0) {
      for (const key of Object.keys(MIXES)) {
        const mix = MIXES[key];
        const other = mix.a === kind ? mix.b : (mix.b === kind ? mix.a : null);
        if (!other) continue;
        const activeOther = other === 'corrode' ? st.corrodeStacks > 0 : st[other] > 0;
        if (activeOther) { this.triggerMix(e, key, mix); return; }
      }
    }
    if (kind === 'corrode') {
      st.corrode = STATUS.corrode.dur;
      st.corrodeStacks = Math.min(STATUS.corrode.maxStacks, st.corrodeStacks + 1);
    } else {
      st[kind] = Math.max(st[kind], STATUS[kind].dur);
    }
  }

  triggerMix(e, key, mix) {
    e.mixCool = 1.0;
    const st = e.st;
    if (!this.discovered.has(key)) {
      this.discovered.add(key);
      this.emit('discover', { mix: key, name: mix.name, desc: mix.desc });
    }
    this.emit('mix', { mix: key, x: e.x, y: e.y, color: mix.color });
    switch (key) {
      case 'shatter':
        st.chill = 0; st.ignite = 0;
        this.burst(e.x, e.y, mix.color, 20, 90);
        this.rings.push({ x: e.x, y: e.y, t: 0, dur: 0.5, color: mix.color, max: 130 });
        this.damage(e, 55 + e.maxHp * 0.12, null);
        break;
      case 'overload': {
        st.shock = 0; st.corrode = 0; st.corrodeStacks = 0;
        this.rings.push({ x: e.x, y: e.y, t: 0, dur: 0.55, color: mix.color, max: 170 });
        this.burst(e.x, e.y, mix.color, 16, 110);
        const r2 = 95 * 95;
        for (const o of this.enemies) {
          const dx = o.x - e.x, dy = o.y - e.y;
          if (dx * dx + dy * dy <= r2) this.damage(o, 48, null);
        }
        break;
      }
      case 'freezelock':
        st.chill = 0; st.shock = 0; st.freeze = 1.05;
        this.burst(e.x, e.y, mix.color, 10, 40);
        break;
      case 'meltdown':
        st.ignite = 0; st.corrode = 0; st.corrodeStacks = 0;
        this.pools.push({ x: e.x, y: e.y, r: 65, dps: 16, dur: 3.0, t: 0, color: mix.color, type: 'meltdown' });
        this.damage(e, 30, null);
        break;
    }
  }

  // --- step ---------------------------------------------------------------
  step() {
    const dt = DT;
    this.time += dt;
    this.events.length = 0;
    if (this.state === 'over') return;

    if (this.state === 'prep') {
      this.prepLeft -= dt;
      if (this.prepLeft <= 0) this.startWave(false);
    } else if (this.state === 'wave') {
      this.waveT += dt;
      for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
        if (this.spawnQueue[i].at <= this.waveT) {
          const s = this.spawnQueue.splice(i, 1)[0];
          this.spawnEnemy(s.type, s.hpMul);
        }
      }
      if (this.spawnQueue.length === 0 && this.enemies.length === 0) {
        // wave cleared
        const interest = Math.min(ECON.interestCap, Math.floor(this.gold * ECON.interestRate));
        this.gold += this.clearBonus + interest;
        this.goldEarned += this.clearBonus + interest;
        this.totalInterest += interest;
        this.state = 'prep';
        this.prepLeft = ECON.prepTime;
        this.emit('waveClear', { wave: this.wave, bonus: this.clearBonus, interest });
      }
    }

    this.stepEnemies(dt);
    this.stepTowers(dt);
    this.stepProjectiles(dt);
    this.stepFx(dt);
    if (this.heartHitT > 0) this.heartHitT -= dt;
  }

  stepEnemies(dt) {
    const pathW = this.map.pathW;
    for (const e of this.enemies) {
      // status timers
      const st = e.st;
      if (st.chill > 0) st.chill -= dt;
      if (st.shock > 0) st.shock -= dt;
      if (st.freeze > 0) st.freeze -= dt;
      if (st.corrode > 0) { st.corrode -= dt; if (st.corrode <= 0) st.corrodeStacks = 0; }
      if (st.ignite > 0) { st.ignite -= dt; this.damage(e, STATUS.ignite.dps * dt, null, true); if (e.dead) continue; }
      if (e.mixCool > 0) e.mixCool -= dt;
      let slowMul = 1;
      if (st.freeze > 0) slowMul = 0;
      else if (st.shock > 0) slowMul = 0.15;
      else if (st.chill > 0) slowMul = 0.55;
      e.s += e.speed * slowMul * dt * (0.9 + 0.1 * Math.sin(this.time * 3 + e.wobblePhase));
      e.phase += dt * (3 + e.def.wobble * 0.2);
      const p = pathPos(this.path, e.s);
      // lane offset across path + type wobble
      const ox = -p.ny * e.lane * pathW * 0.8;
      const oy = p.nx * e.lane * pathW * 0.8;
      const wob = e.def.hover ? Math.sin(this.time * 2.2 + e.wobblePhase) * 10 : Math.sin(this.time * 5 + e.wobblePhase) * e.def.wobble * 0.3;
      e.x = p.x + ox; e.y = p.y + oy + wob;
      e.dirx = p.nx; e.diry = p.ny;
      if (e.s >= this.path.total - 4) {
        e.dead = true; e.reached = true;
        this.lives -= e.def.damage;
        this.heartHitT = 0.8;
        this.emit('heartHit', { damage: e.def.damage, lives: this.lives });
        this.burst(e.x, e.y, e.def.color, 10, 60);
        if (this.lives <= 0) { this.lives = 0; this.state = 'over'; this.emit('gameOver', { wave: this.wave }); }
      }
      // excite nearby flora
      for (const f of this.flora) {
        const d = Math.abs(f.x - e.x) + Math.abs(f.y - e.y);
        if (d < 160) f.excite = Math.min(1, f.excite + dt * 2.5);
      }
    }
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  stepTowers(dt) {
    this.refreshBuffs();
    for (const t of this.towers) {
      t.phase += dt * 2.2;
      if (t.def.attack === 'aura') { t.charge = 0.5 + 0.5 * Math.sin(this.time * 1.4 + t.phase); continue; }
      const st = this.towerStats(t);
      t.cool -= dt;
      // charge glow ramps as cooldown ends
      t.charge = Math.min(1, Math.max(0, 1 - Math.max(0, t.cool) * st.rate * 1.6));
      if (t.cool > 0) continue;
      // target: furthest along path in range (respect min range for mortars)
      let best = null, bestS = -1;
      const r2 = st.range * st.range;
      const min2 = (t.def.minRange || 0) * (t.def.minRange || 0);
      for (const e of this.enemies) {
        const dx = e.x - t.x, dy = e.y - t.y, d2 = dx * dx + dy * dy;
        if (d2 <= r2 && d2 >= min2 && e.s > bestS && e.hp > 0) { best = e; bestS = e.s; }
      }
      if (!best) continue;
      t.cool = 1 / st.rate;
      t.charge = 0;
      const attack = t.def.attack || 'proj';
      switch (attack) {
        case 'proj': this.fireProjectile(t, st, best); break;
        case 'chain': this.fireChain(t, st, best); break;
        case 'pulse': this.firePulse(t, st); break;
        case 'beam': this.fireBeam(t, st, best); break;
        case 'mortar': this.fireMortar(t, st, best); break;
        case 'spit': this.fireSpit(t, st, best); break;
      }
    }
  }

  fireProjectile(t, st, best) {
    const lead = Math.min(0.5, Math.hypot(best.x - t.x, best.y - t.y) / t.def.projSpeed);
    const aim = pathPos(this.path, best.s + best.speed * lead);
    this.projectiles.push({
      id: this.nextId++, x: t.x, y: t.y - 30, tx: aim.x, ty: aim.y,
      target: best.id, speed: t.def.projSpeed, damage: st.damage,
      splash: t.def.splash, color: t.def.color, from: t.id, t: 0,
    });
    this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y });
  }

  fireChain(t, st, best) {
    const hits = [];
    let src = { x: t.x, y: t.y - 20 };
    let cur = best, dmg = st.damage;
    const seen = new Set();
    for (let c = 0; c < st.chain && cur; c++) {
      hits.push({ from: { ...src }, to: { x: cur.x, y: cur.y }, target: cur });
      this.damage(cur, dmg, t);
      if (!cur.dead) this.applyStatus(cur, t.def.status);
      seen.add(cur.id);
      src = { x: cur.x, y: cur.y };
      dmg *= t.def.chainFall;
      let nxt = null, nd = 200 * 200;
      for (const e of this.enemies) {
        if (seen.has(e.id) || e.hp <= 0) continue;
        const dx = e.x - src.x, dy = e.y - src.y, d = dx * dx + dy * dy;
        if (d < nd) { nd = d; nxt = e; }
      }
      cur = nxt;
    }
    this.arcs.push({ hits, t: 0, dur: 0.3, color: t.def.color, seed: this.rng.next() });
    this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y, chains: hits.length });
  }

  firePulse(t, st) {
    const r2 = st.range * st.range;
    let hitAny = false;
    for (const e of this.enemies) {
      const dx = e.x - t.x, dy = e.y - t.y;
      if (dx * dx + dy * dy > r2 || e.hp <= 0) continue;
      this.damage(e, st.damage, t);
      if (!e.dead) this.applyStatus(e, t.def.status);
      hitAny = true;
    }
    if (hitAny) {
      this.rings.push({ x: t.x, y: t.y, t: 0, dur: 0.7, color: t.def.color, max: st.range * 1.05 });
      this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y });
    } else {
      t.cool = 0.2; // nothing in range — stay primed
    }
  }

  fireBeam(t, st, best) {
    const sx = t.x, sy = t.y - 26;
    const dx = best.x - sx, dy = best.y - sy;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len, ny = dy / len;
    const ex = sx + nx * st.range, ey = sy + ny * st.range;
    const w = t.def.beamWidth;
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      const px = e.x - sx, py = e.y - sy;
      const proj = px * nx + py * ny;
      if (proj < 0 || proj > st.range) continue;
      const perp = Math.abs(px * ny - py * nx);
      if (perp <= w + e.def.size * 0.4) this.damage(e, st.damage, t);
    }
    this.beams.push({ x1: sx, y1: sy, x2: ex, y2: ey, t: 0, dur: 0.18, color: t.def.color });
    this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y, beam: true });
  }

  fireMortar(t, st, best) {
    const lead = Math.hypot(best.x - t.x, best.y - t.y) / t.def.projSpeed;
    const aim = pathPos(this.path, best.s + best.speed * lead * 0.85);
    this.projectiles.push({
      id: this.nextId++, x: t.x, y: t.y - 40, tx: aim.x, ty: aim.y,
      x0: t.x, y0: t.y - 40, speed: t.def.projSpeed, damage: st.damage,
      splash: t.def.splash, color: t.def.color, from: t.id, t: 0,
      arc: true, flight: Math.max(0.5, lead * 0.9), status: t.def.status,
      pool: { dps: t.def.poolDps, dur: t.def.poolDur, r: t.def.poolR },
    });
    this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y });
  }

  fireSpit(t, st, best) {
    this.projectiles.push({
      id: this.nextId++, x: t.x, y: t.y - 18, tx: best.x, ty: best.y,
      target: best.id, speed: t.def.projSpeed, damage: st.damage,
      splash: 0, color: t.def.color, from: t.id, t: 0, status: t.def.status,
    });
    this.emit('fire', { tower: t.id, type: t.type, x: t.x, y: t.y });
  }

  damage(e, amount, tower) {
    if (e.hp <= 0) return;
    if (e.st.corrodeStacks > 0) amount *= 1 + e.st.corrodeStacks * STATUS.corrode.vulnPerStack;
    e.hp -= amount;
    if (e.hp <= 0) {
      e.dead = true;
      this.kills++;
      if (tower) tower.kills++;
      this.gold += e.def.bounty;
      this.goldEarned += e.def.bounty;
      this.emit('kill', { id: e.id, type: e.type, x: e.x, y: e.y, bounty: e.def.bounty });
      // death: burst into dissolving motes that drift and fade
      this.burst(e.x, e.y, e.def.color, 14 + Math.floor(e.def.size * 0.3), e.def.size * 2.2);
    }
  }

  burst(x, y, color, n, spread) {
    for (let i = 0; i < n; i++) {
      const a = this.rng.range(0, 6.28), sp = this.rng.range(10, spread);
      this.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - this.rng.range(8, 30),
        life: this.rng.range(1.2, 2.6), age: 0,
        size: this.rng.range(3, 9), color,
        drift: this.rng.range(-8, 8), kind: 'mote',
        phase: this.rng.range(0, 6.28), seed: this.rng.next(),
      });
    }
  }

  stepProjectiles(dt) {
    for (const pr of this.projectiles) {
      pr.t += dt;
      if (pr.arc) {
        // mortar: parabolic lob to a fixed landing point
        const f = Math.min(1, pr.t / pr.flight);
        pr.x = pr.x0 + (pr.tx - pr.x0) * f;
        const lin = pr.y0 + (pr.ty - pr.y0) * f;
        pr.height = 170 * 4 * f * (1 - f); // visual arc height
        pr.y = lin;
        pr.rot = Math.atan2(pr.ty - pr.y0, pr.tx - pr.x0);
        if (f >= 1) this.detonate(pr);
        continue;
      }
      // home softly toward the (moving) target if alive
      let tx = pr.tx, ty = pr.ty;
      const tgt = this.enemies.find(e => e.id === pr.target);
      if (tgt) { tx = tgt.x; ty = tgt.y; }
      const dx = tx - pr.x, dy = ty - pr.y;
      const d = Math.hypot(dx, dy) || 1;
      pr.x += (dx / d) * pr.speed * dt;
      pr.y += (dy / d) * pr.speed * dt;
      pr.rot = Math.atan2(dy, dx);
      if (d < 18 || pr.t > 3) this.detonate(pr, tgt);
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);
  }

  detonate(pr, directTarget = null) {
    pr.dead = true;
    this.emit('impact', { x: pr.x, y: pr.y, color: pr.color, splash: pr.splash || 0 });
    const tower = this.towers.find(t => t.id === pr.from);
    if (pr.splash > 0) {
      const s2 = pr.splash * pr.splash;
      for (const e of this.enemies) {
        const ex = e.x - pr.x, ey = e.y - pr.y;
        if (ex * ex + ey * ey <= s2) {
          this.damage(e, pr.damage, tower);
          if (!e.dead && pr.status) this.applyStatus(e, pr.status);
        }
      }
      this.rings.push({ x: pr.x, y: pr.y, t: 0, dur: 0.5, color: pr.color, max: pr.splash * 1.9 });
      this.burst(pr.x, pr.y, pr.color, 6, 40);
    } else if (directTarget && directTarget.hp > 0) {
      this.damage(directTarget, pr.damage, tower);
      if (!directTarget.dead && pr.status) this.applyStatus(directTarget, pr.status);
      this.burst(pr.x, pr.y, pr.color, 3, 22);
    }
    if (pr.pool) {
      this.pools.push({ x: pr.tx, y: pr.ty, r: pr.pool.r, dps: pr.pool.dps, dur: pr.pool.dur, t: 0, color: pr.color, type: 'ember' });
    }
  }

  stepFx(dt) {
    for (const p of this.particles) {
      p.age += dt;
      p.x += p.vx * dt + Math.sin(this.time * 1.5 + p.phase) * p.drift * dt;
      p.y += p.vy * dt;
      p.vy -= 12 * dt;  // motes drift upward
      p.vx *= (1 - 0.8 * dt);
    }
    this.particles = this.particles.filter(p => p.age < p.life);
    for (const r of this.rings) r.t += dt;
    this.rings = this.rings.filter(r => r.t < r.dur);
    for (const a of this.arcs) a.t += dt;
    this.arcs = this.arcs.filter(a => a.t < a.dur);
    for (const b of this.beams) b.t += dt;
    this.beams = this.beams.filter(b => b.t < b.dur);
    // ground hazard pools tick damage to creatures standing in them
    for (const p of this.pools) {
      p.t += dt;
      const r2 = p.r * p.r;
      for (const e of this.enemies) {
        const dx = e.x - p.x, dy = e.y - p.y;
        if (dx * dx + dy * dy <= r2) this.damage(e, p.dps * dt, null);
      }
    }
    this.pools = this.pools.filter(p => p.t < p.dur);
    for (const f of this.flora) f.excite = Math.max(0, f.excite - dt * 0.9);
  }

  score() {
    return this.wave * 100 + this.kills + Math.floor(this.goldEarned * 0.1);
  }
}

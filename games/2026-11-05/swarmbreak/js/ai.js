// Autopilot. Every so often it re-reads the arena (as it looked `react` seconds ago, so a human-like
// pilot cannot see a bolt fired a moment ago), scores 16 run directions plus standing still against
// every machine, bolt, arc and boss tell over the next second, adds what it wants (survivors to bring
// in, room to fight, the boss at arm's length), and runs the best one while it aims and fires.
//   profile 'human': ~0.35 s reaction with scatter, sometimes late, aim wobble, the odd bad choice
//   profile 'demo' : quick, accurate, uses PULSE well: the attract mode and the AI playthrough
import { F, ENEMY, HOSTILE } from './config.js?v=10';
import { inHazard } from './sim.js?v=10';

const PROFILES = {
  human: { track: 8, blind: 0.4, slew: 4.2, react: 0.35, jit: 0.1, late: 0.14, lateT: 0.25, aim: 0.075, drift: 0.05, margin: 1.35, look: 0.8, pulseP: 0.5, crowd: 3, panic: 0.03, fireRange: 15, greed: 1 },
  demo: { track: 60, blind: 0, slew: 14, react: 0.1, jit: 0.03, late: 0, lateT: 0, aim: 0.012, drift: 0, margin: 2.0, look: 1.0, pulseP: 1, crowd: 3, panic: 0, fireRange: 17, greed: 1.3 },
};
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;
const SAMPLES = [0.1, 0.22, 0.38, 0.58, 0.85, 1.1];
const DIRS = [];
for (let i = 0; i < 16; i++) DIRS.push([Math.cos((i / 16) * Math.PI * 2), Math.sin((i / 16) * Math.PI * 2)]);
DIRS.push([0, 0]);

// a tiny seeded generator so autopilot runs are repeatable from their seed
function mk(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.rnd = mk(seed * 9301 + 49297);
    this.next = 0;
    this.move = [0, 0];
    this.target = null;
    this.bias = 0;
    this.out = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, pulse: false };
    this.debug = { mode: 'scan', danger: 0, target: null };
    this.pulseHold = 0;
  }
  gauss() { const r = this.rnd; return (r() + r() + r() - 1.5) * 1.15; }

  control(W, p) {
    const out = this.out, P = this.P;
    if (!p.alive) { out.mx = out.mz = 0; out.fire = false; out.pulse = false; return { ...out }; }
    if (W.t >= this.next) {
      let dt = P.react + (this.rnd() - 0.5) * 2 * P.jit;
      if (this.rnd() < P.late) dt += P.lateT;
      this.next = W.t + Math.max(0.05, dt);
      this.plan(W, p);
    }
    // aim follows the chosen target continuously (eyes keep tracking), with the pilot's wobble
    const T = this.target && this.find(W, this.target);
    if (T) {
      const d = hyp(T.x - p.x, T.z - p.z), tt = d / F.shotV;
      const ax = T.x + (T.vx || 0) * tt - p.x, az = T.z + (T.vz || 0) * tt - p.z;
      this.bias += (this.gauss() * P.drift - this.bias * 0.5) * 0.1;
      const want = Math.atan2(az, ax) + this.bias + this.gauss() * P.aim * 0.3;
      // a thumb or a mouse hand can only swing the aim so fast
      if (this.aimA === undefined) this.aimA = want;
      let da = want - this.aimA; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const mx = P.slew / 120;
      this.aimA += da > mx ? mx : da < -mx ? -mx : da;
      out.ax = Math.cos(this.aimA); out.az = Math.sin(this.aimA);
      out.fire = d < P.fireRange && Math.abs(da) < 0.5;
    } else { out.fire = false; out.ax = 0; out.az = 0; }
    out.mx = this.move[0]; out.mz = this.move[1];
    out.pulse = this.pulseHold > 0;
    if (this.pulseHold > 0) this.pulseHold--;
    return { ...out };
  }

  // the target as it is now (or null if gone)
  find(W, t) {
    if (t.kind === 'boss') return W.boss && W.boss.state !== 'dying' ? W.boss : null;
    if (t.kind === 'orb') { const o = W.boss && W.boss.orbs[t.i]; return o && o.hp > 0 ? { x: o.x, z: o.z, vx: 0, vz: 0 } : null; }
    return W.enemies.find((e) => e.id === t.id && e.hp > 0) || null;
  }

  // what the pilot can see: things that have been there for at least its reaction time, drawn
  // where they were that long ago
  perceive(W, p) {
    const lag = this.profile === 'human' ? this.P.react : 0;
    const th = [];
    // a person watches where they aim: things behind them, not right on top of them, are often missed
    const fa = this.aimA ?? 0, blind = this.P.blind, r = this.rnd;
    const missed = (x, z) => {
      if (!blind || !p) return false;
      const dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz);
      if (d < 3) return false;
      let da = Math.atan2(dz, dx) - fa; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      return Math.abs(da) > 1.75 && r() < blind;
    };
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.type === 'dummy' || e.hidden || e.lp === 2) continue;
      if (e.t < lag * 0.6 && e.born <= 0) continue;
      const rad = e.r + (e.born > 0 ? 0 : 0);
      if (missed(e.x, e.z)) continue;
      th.push({ x: e.x - e.vx * lag, z: e.z - e.vz * lag, vx: e.vx, vz: e.vz, r: rad, kind: e.type, e });
    }
    for (const b of W.bolts) {
      const age = 6 - b.life;
      if (age < lag && b.life < 6.9) continue;
      if (missed(b.x, b.z)) continue;
      th.push({ x: b.x - b.vx * lag, z: b.z - b.vz * lag, vx: b.vx, vz: b.vz, r: b.r, kind: 'bolt' });
    }
    // attention is limited: only the nearest few things get tracked
    if (p && th.length > this.P.track) {
      for (const t of th) t.d = Math.hypot(t.x - p.x, t.z - p.z);
      th.sort((a, b) => a.d - b.d);
      th.length = this.P.track;
    }
    return th;
  }

  plan(W, p) {
    const P = this.P, r = this.rnd;
    const th = this.perceive(W, p);
    const sp = F.speed * (1 + 0.09 * (W.up.servos || 0));
    const B = W.boss;
    // spitters that are aiming at us: a bolt will come down that line
    const lines = [];
    for (const e of W.enemies) if (e.type === 'spitter' && e.aimT > 0 && e.aimT < e.aimLock + 0.6) lines.push({ x: e.x, z: e.z, a: e.aimA, t: e.aimT, v: W.R.boltV });
    // live arcs (and arcs about to switch on)
    const arcs = [];
    for (const e of W.enemies) if (e.type === 'pylon' && e.link && e.id < e.link && e.arc) { const o = W.enemies.find((q) => q.id === e.link); if (o) arcs.push([e.x, e.z, o.x, o.z, e.arc === 2 ? 0 : e.arcT]); }
    // survivors worth fetching
    let surv = null, sd = 1e9;
    // survivors and power-ups on the floor are both worth fetching (power-ups a little less)
    for (const s of W.survivors) { const d = hyp(s.x - p.x, s.z - p.z); if (d < sd) { sd = d; surv = s; } }
    if (this.profile === 'human') for (const e of W.enemies) if (e.hidden) { const d = hyp(e.x - p.x, e.z - p.z); if (d < sd) { sd = d; surv = e; } }
    for (const q of W.pickups || []) { const d = hyp(q.x - p.x, q.z - p.z) * 1.25; if (d < sd && q.life > d / 5) { sd = d; surv = q; } }
    let near = 1e9, crowd = 0;
    for (const t of th) if (HOSTILE.has(t.kind)) { const d = hyp(t.x - p.x, t.z - p.z) - t.r; near = Math.min(near, d); if (d < 3.4) crowd++; }

    // the target picked last time (if it is far away and nothing else needs doing, walk toward it)
    const tg = this.target && this.find(W, this.target);
    const hunt = !surv && near > 5 && tg ? tg : null;
    let best = null, bc = 1e9;
    const panic = r() < P.panic;
    for (const [dx, dz] of DIRS) {
      let c = 0;
      for (const tau of SAMPLES) {
        if (tau > P.look + 0.3) break;
        const px = clamp(p.x + dx * sp * tau, -F.AW + F.r, F.AW - F.r), pz = clamp(p.z + dz * sp * tau, -F.AH + F.r, F.AH - F.r);
        const wt = 1 / (1 + tau * 1.4);
        for (const t of th) {
          const ex = t.x + t.vx * tau, ez = t.z + t.vz * tau;
          const d = hyp(ex - px, ez - pz) - t.r - F.r * 0.8;
          const m = t.kind === 'bolt' ? P.margin * 0.55 : t.kind === 'brute' ? P.margin * 1.3 : P.margin;
          if (d < m) c += (m - d) * (m - d) * 14 * wt;
          if (HOSTILE.has(t.kind) && d < 5) c += (5 - d) * 0.12 * wt;
        }
        for (const L of lines) {
          // where the coming bolt will be at tau
          const bt = tau - L.t;
          if (bt < -0.15) continue;
          const bx = L.x + Math.cos(L.a) * L.v * Math.max(0, bt), bz = L.z + Math.sin(L.a) * L.v * Math.max(0, bt);
          const rx = px - L.x, rz = pz - L.z, along = rx * Math.cos(L.a) + rz * Math.sin(L.a), off = Math.abs(-rx * Math.sin(L.a) + rz * Math.cos(L.a));
          if (along > 0 && off < 1.1) c += (1.1 - off) * 6 * wt * (hyp(bx - px, bz - pz) < 3 ? 2 : 1);
        }
        for (const [ax, az, bx, bz, wait] of arcs) {
          if (tau + 0.2 < wait) continue;
          const d = segDist(px, pz, ax, az, bx, bz);
          if (d < 1.2) c += (1.2 - d) * 30 * wt;
        }
        // a leaper's marked landing spot
        for (const e of W.enemies) {
          if (e.type !== 'leaper' || !(e.lp === 1 || e.lp === 2)) continue;
          const liveAt = e.lp === 1 ? e.lpT + 0.6 : e.lpT;
          if (tau + 0.25 < liveAt || tau > liveAt + 0.3) continue;
          const q = hyp(px - e.lx, pz - e.lz);
          if (q < 1.35 + 0.9) c += (2.25 - q) * 18 * wt;
        }
        for (const h of W.hazards) {
          const visible = h.t >= (this.profile === 'human' ? Math.min(P.react, h.T * 0.5) : 0) || h.state === 'live';
          if (!visible) continue;
          if (h.kind === 'lane') {
            const c2 = Math.cos(h.a), s2 = Math.sin(h.a), rx = px - h.x, rz = pz - h.z;
            const along = rx * c2 + rz * s2, off = Math.abs(-rx * s2 + rz * c2);
            if (along > -1 && off < h.w + 1.4) c += (h.w + 1.4 - off) * 12 * wt;
            continue;
          }
          const liveAt = h.state === 'live' ? 0 : h.T - h.t;
          if (tau + 0.25 < liveAt) continue;
          if (h.kind === 'beam') {
            // the whole sweep is dangerous: stay out of its fan, or tuck in behind the boss
            const ra = Math.atan2(pz - h.z, px - h.x), dd = hyp(px - h.x, pz - h.z);
            const a0 = h.state === 'live' ? h.a : h.a0, a1 = h.a0 + h.dir * h.sweep;
            const lo = Math.min(a0, a1) - 0.25, hi = Math.max(a0, a1) + 0.25;
            const inFan = angIn(ra, lo, hi);
            if (inFan && dd < h.len) c += 20 * wt;
          } else if (inHazard(h, px, pz, 0.9)) c += 30 * wt;
        }
        if (B && B.state !== 'dying') {
          const d = hyp(B.x - px, B.z - pz) - B.r;
          const m = B.state === 'act' && B.cur && B.cur.kind === 'charge' ? 4 : 3.2;
          if (d < m) c += (m - d) * (m - d) * 10 * wt;
          for (const o of B.orbs) if (o.hp > 0) { const q = hyp(o.x - px, o.z - pz) - 0.6; if (q < 1.6) c += (1.6 - q) * (1.6 - q) * 10 * wt; }
        }
        // walls and corners are traps
        const wx = F.AW - Math.abs(px), wz = F.AH - Math.abs(pz);
        if (wx < 2.2) c += (2.2 - wx) * 0.9 * wt;
        if (wz < 2.2) c += (2.2 - wz) * 0.9 * wt;
      }
      // what we want: survivors, room, the boss at arm's length, the middle
      const ex = clamp(p.x + dx * sp * 0.6, -F.AW, F.AW), ez = clamp(p.z + dz * sp * 0.6, -F.AH, F.AH);
      if (surv) {
        const g = sd - hyp(surv.x - ex, surv.z - ez);
        c -= g * (near > 3 ? 0.9 : 0.35) * P.greed;
      }
      if (B && B.state !== 'in' && B.state !== 'dying') {
        const want = B.state === 'stun' ? 6 : 8.5, d0 = Math.abs(hyp(B.x - p.x, B.z - p.z) - want), d1 = Math.abs(hyp(B.x - ex, B.z - ez) - want);
        c -= (d0 - d1) * 0.35;
      }
      c += hyp(ex, ez) * 0.02;
      // nothing close and nobody to fetch: go and find the last machines
      if (hunt) { const d0 = hyp(hunt.x - p.x, hunt.z - p.z), d1 = hyp(hunt.x - ex, hunt.z - ez); if (d0 > 9) c -= (d0 - d1) * 0.5; }
      if (dx === 0 && dz === 0) c += surv ? 0.6 : 0.15;
      if (panic) c += r() * 3;
      if (c < bc) { bc = c; best = [dx, dz]; }
    }
    this.move = best || [0, 0];
    // human scatter on the stick
    if (this.profile === 'human' && (this.move[0] || this.move[1])) {
      const a = Math.atan2(this.move[1], this.move[0]) + this.gauss() * 0.12;
      this.move = [Math.cos(a), Math.sin(a)];
    }
    this.pickTarget(W, p, th);
    // PULSE when crowded or about to be hit
    if (p.pulses > 0 && this.pulseHold <= 0) {
      const tight = crowd >= P.crowd || (bc > 9 && near < 1.6);
      if (tight && r() < P.pulseP) this.pulseHold = 2;
    }
    this.debug = { mode: B ? 'boss' : bc > 6 ? 'evade' : surv && sd < 8 ? 'rescue' : this.target ? 'fight' : 'scan', danger: bc, crowd, surv: surv ? sd : null, target: this.target };
  }

  pickTarget(W, p, th) {
    const B = W.boss;
    if (B && B.state !== 'in' && B.state !== 'dying') {
      let best = null, bd = 1e9;
      B.orbs.forEach((o, i) => { if (o.hp > 0) { const d = hyp(o.x - p.x, o.z - p.z); if (d < bd) { bd = d; best = { kind: 'orb', i }; } } });
      // anything small and close comes first
      for (const e of W.enemies) if (e.hp > 0 && HOSTILE.has(e.type) && hyp(e.x - p.x, e.z - p.z) < 4.5) { this.target = { kind: 'e', id: e.id }; return; }
      this.target = best || { kind: 'boss' };
      return;
    }
    let best = null, bs = -1e9;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0.2 || e.hidden || e.lp === 2) continue;
      const d = hyp(e.x - p.x, e.z - p.z);
      let w = { crawler: 1, dart: 1.4, shard: 1.2, spitter: 1.5, splitter: 1.1, hive: 1.2, brute: 0.55, pylon: 0.25, dummy: 1, bulwark: 0.9, leaper: 1.3, mimic: 1.6 }[e.type] || 1;
      if (e.type === 'brute' && (d < 5 || W.survivors.some((s) => hyp(s.x - e.x, s.z - e.z) < 4))) w = 1.4;
      if (e.type === 'spitter' && e.aimT > 0) w *= 1.4;
      const sc = w * 10 / (d + 2) - (this.target && this.target.id === e.id ? -0.4 : 0);
      if (sc > bs) { bs = sc; best = e; }
    }
    this.target = best ? { kind: 'e', id: best.id } : null;
    void th;
  }
}
function segDist(px, pz, ax, az, bx, bz) {
  const vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz || 1;
  const t = clamp(((px - ax) * vx + (pz - az) * vz) / l2, 0, 1);
  return hyp(px - (ax + vx * t), pz - (az + vz * t));
}
function angIn(a, lo, hi) {
  const TAU = Math.PI * 2;
  while (a < lo) a += TAU;
  while (a > lo + TAU) a -= TAU;
  return a <= hi;
}
void ENEMY;

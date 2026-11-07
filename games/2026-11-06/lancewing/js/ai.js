// Autopilot. Every so often it re-reads the arena and tries 20 short futures (5 steering choices x 4 wing
// rhythms: no beats, hold height, climb, beat flat out) for about 1.3 s with the real flight model. Each
// future is scored against what it can see: riders (gain the higher lance, never be under one), telegraphed
// hazards and boss attacks, projectiles, the Stormhunter (only head-on), the sea, and what it wants (ember
// cores before they re-ignite, power-ups, boss weak points from above). It flies the best one until the next look.
//   profile 'human': ~0.35 s reaction with scatter, sometimes late, a thumb that can only swing the stick
//                    so fast, the odd missed beat, sees only nearby threats
//   profile 'demo' : quick and sharp: the attract mode and the AI playthrough
import { F, ENEMY, HUNTER, DROP, BOSSES } from './config.js?v=6';
import { dX, inHazard, lanceBonus, bossBodies, weakPos, ledgeUnder } from './sim.js?v=6';

const PROFILES = {
  human: { react: 0.35, jit: 0.1, late: 0.15, lateT: 0.25, track: 20, maxTrack: 4, steer: 5.5, miss: 0.07, margin: 0.55, fear: 1, greed: 1, beatCD: 0.14, slop: 0.35, panic: 0.06, view: 0.12, rescue: 0.25, rescueMiss: 0.3, rescueLate: 0.4, rescuePlan: 0.06 },
  demo: { react: 0.11, jit: 0.03, late: 0, lateT: 0, track: 60, maxTrack: 14, steer: 16, miss: 0, margin: 0.5, fear: 1.15, greed: 1.2, beatCD: 0.115, slop: 0.05, panic: 0, view: 0, rescue: 0, rescueMiss: 0, rescueLate: 0, rescuePlan: 0 },
};
const MXS = [-1, -0.5, 0, 0.5, 1];
const MODES = ['dive', 'sink', 'hold', 'goal', 'climb', 'rocket'];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mk(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.rnd = mk(seed * 9301 + 49297);
    this.next = 0; this.mx = 0; this.mxT = 0; this.mode = 'hold'; this.goalY = 10; this.cd = 0; this.last = false; this.prev = null; this.lowT = -1; this.lowD = 0;
    this.debug = { mode: 'scan', goal: null, score: 0, why: '' };
    this.out = { mx: 0, flap: false };
  }
  control(W, p) {
    const P = this.P, out = this.out;
    if (this.w !== W) { this.w = W; this.next = 0; this.cd = 0; this.prev = null; this.lowT = -1; }   // a new world: its clock starts again
    if (!p.alive) { out.mx = 0; out.flap = false; this.last = false; return { ...out }; }
    if (W.t >= this.next) {
      let dt = P.react + (this.rnd() - 0.5) * 2 * P.jit;
      if (this.rnd() < P.late) dt += P.lateT;
      this.next = W.t + Math.max(0.05, dt);
      this.plan(W, p);
    }
    // the stick swings toward the planned steer at a limited rate
    const k = P.steer / 120;
    this.mx += clamp(this.mxT - this.mx, -k, k);
    // wing beats by rhythm: one tick down, one up, so every beat is a fresh press
    this.cd -= 1 / 120;
    let beat = false;
    const low = p.on < 0 && p.y < 2.6 && p.vy < 0 && !ledgeUnder(W, p.x, p.y);
    if (!low) this.lowT = -1;
    else if (this.lowT < 0) { this.lowT = W.t; this.lowD = P.rescue + (P.rescueMiss > 0 && this.rnd() < P.rescueMiss ? P.rescueLate : 0); }
    if (!this.last && this.cd <= 0) {
      if (this.mode === 'rocket') beat = true;
      else if (this.mode !== 'dive') beat = p.y < this.goalY && p.vy < 1.2;
      if (low && W.t - this.lowT >= this.lowD) beat = true;   // catch a fall toward the sea (a human only after a reaction time, sometimes late)
      if (beat && this.rnd() < P.miss) { beat = false; this.cd = 0.08; }
      if (beat) this.cd = P.beatCD * (1 + (this.rnd() - 0.5) * P.slop);
    }
    this.last = beat;
    out.mx = Math.abs(this.mx) < 0.04 ? 0 : this.mx;
    out.flap = beat;
    return { mx: Math.round(out.mx * 1000) / 1000, flap: out.flap };
  }

  // ------------------------------------------------------------- what it wants right now
  pickGoal(W, p) {
    const P = this.P, lb = lanceBonus(W, p);
    const B = W.boss;
    if (B && B.st === 'fight') {
      let best = null, bd = 1e9;
      for (const q of B.pts) {
        if (!q.on || q.hp <= 0) continue;
        const [qx, qy] = weakPos(B, q);
        if (qy < 0.6) continue;
        const d = Math.abs(dX(p.x, qx)) + Math.abs(qy - p.y) * 0.4;
        if (d < bd) { bd = d; best = [qx, qy]; }
      }
      if (best) {
        const [qx, qy] = best, adx = Math.abs(dX(p.x, qx));
        const above = p.y + F.lanceH + lb > qy + 0.5;
        return { x: qx, y: adx < 2.4 && above ? qy - 0.4 : qy + 1.6, w: 1.3, why: 'weak point' };
      }
      if (B.key === 'leviathan') return { x: B.x, y: 12, w: 0.5, why: 'wait for the breach' };
      return { x: B.x + 14, y: 13, w: 0.4, why: 'keep clear' };
    }
    const h = W.hunter;
    if (h && h.st === 'hunt' && Math.abs(dX(p.x, h.x)) < 26) return { x: h.x, y: h.y + HUNTER.eyeH - F.lanceH - lb, w: 1.4, why: 'hunter head-on', hunter: 1 };
    // ember cores: the closest to re-igniting first
    let core = null, cs = 1e9;
    for (const c of W.cores) {
      const d = Math.abs(dX(p.x, c.x)) + Math.abs(c.y - p.y) * 0.5;
      if (d > P.track * 1.4) continue;
      const left = c.rush ? 9 : c.T - c.t;
      const s = d - Math.max(0, 4 - left) * 6;
      if (s < cs) { cs = s; core = c; }
    }
    // a rider it can get above
    let vic = null, vs = 1e9;
    for (const r of this.seen(W, p)) {
      const d = Math.abs(dX(p.x, r.x));
      const s = d + Math.max(0, r.y + 1.6 - p.y) * 1.6 + (r.type === 'shieldbearer' ? 3 : 0);
      if (s < vs) { vs = s; vic = r; }
    }
    if (core && (!vic || cs < vs * 0.8 || (core.T - core.t) < 3)) return { x: core.x, y: core.y - 0.6, w: 1.2, why: 'ember core' };
    let pk = null, pd = 12;
    for (const q of W.pickups) { const d = Math.abs(dX(p.x, q.x)) + Math.abs(q.y - p.y) * 0.5; if (d < pd) { pd = d; pk = q; } }
    if (pk && (!vic || pd < vs * 0.6)) return { x: pk.x, y: pk.y - 1, w: 1, why: 'power-up' };
    if (vic) {
      const ad = Math.abs(dX(p.x, vic.x)), lead = clamp(vic.vx * 0.3, -3, 3);
      // a ledge between us: go round its end
      for (const L of W.ledges) {
        if (L.st === 2 || Math.abs(dX(L.x, p.x)) > L.w + 1 || Math.abs(dX(L.x, vic.x)) > L.w + 1) continue;
        const lo = Math.min(p.y, vic.y), hi = Math.max(p.y, vic.y);
        if (L.y - F.ledgeT > lo + 1 && L.y < hi + 0.5) { const e = dX(L.x, p.x); return { x: L.x + Math.sign(e || 1) * (L.w + 2.2), y: vic.y + 1.5, w: 1, why: 'round a ledge', id: vic.id }; }
      }
      const over = vic.type === 'shieldbearer' && vic.face === Math.sign(dX(vic.x, p.x) || 1) ? 1.4 : 0.95;
      return { x: vic.x + lead, y: ad < 3.5 && p.y > vic.y + 0.7 ? vic.y + over * 0.7 : vic.y + over + 0.6, w: 1, why: 'duel ' + vic.type, id: vic.id };
    }
    return { x: p.x + 6 * (p.face || 1), y: 12, w: 0.25, why: 'patrol' };
  }
  // the riders this pilot is paying attention to
  seen(W, p) {
    const P = this.P;
    const list = W.riders.filter((r) => r.alive && Math.abs(dX(p.x, r.x)) < P.track).sort((a, b) => Math.abs(dX(p.x, a.x)) - Math.abs(dX(p.x, b.x)));
    return list.slice(0, P.maxTrack);
  }

  // ------------------------------------------------------------- try the futures
  plan(W, p) {
    const P = this.P, goal = this.pickGoal(W, p), riders = this.seen(W, p);
    const PP = phys(W, p);
    let best = null, bs = -1e18, second = null, ss = -1e18;
    for (const mx of MXS) for (const mode of MODES) {
      const s = this.score(W, p, PP, mx, mode, goal, riders) + (this.prev && this.prev[0] === mx && this.prev[1] === mode ? 6 : 0);
      if (s > bs) { ss = bs; second = best; bs = s; best = [mx, mode]; } else if (s > ss) { ss = s; second = [mx, mode]; }
    }
    if (second && this.rnd() < P.panic && ss > bs - 80) best = second;
    this.prev = best;
    this.mxT = best[0];
    this.mode = best[1];
    this.goalY = modeY(best[1], p, goal);
    this.debug = { mode: best[1], mx: best[0], goal, score: Math.round(bs), why: goal.why };
  }
  score(W, p, PP, mx, mode, goal, riders) {
    const P = this.P, lb = lanceBonus(W, p);
    let x = p.x, y = p.y, vx = p.vx, vy = p.vy, on = p.on >= 0 ? W.ledges[p.on] : null, cd = Math.max(0, p.flapCD);
    const gy = modeY(mode, p, goal);
    const dt = 0.04, N = 33, low = goal.why === 'weak point' && goal.y < 4 ? 1.8 : 3.2;   // skimming the sea to strike a low weak point
    let s = 0, killed = new Set(), lowAt = p.on < 0 && p.y < 2.6 && p.vy < 0 && this.lowT >= 0 ? -(W.t - this.lowT) : -1;
    const B = W.boss, hurtB = B && B.cur && B.cur.hurt;
    const h = W.hunter && W.hunter.st !== 'leave' ? W.hunter : null;
    // homing orbs steer at wherever this future puts us, as they do in the sim
    const orbs = W.shots.filter((q) => q.home).map((q) => ({ x: q.x, y: q.y, vx: q.vx, vy: q.vy, home: q.home, r: q.r, gone: false }));
    // the Leviathan's breach: the marked stretch of sea, then the arc its body sweeps (a pilot watches it come)
    const br = B && B.key === 'leviathan' && B.cur && B.cur.kind === 'breach' && B.cur.t < B.cur.T + B.cur.hurtA ? B.cur : null;
    for (let i = 1; i <= N; i++) {
      const t = i * dt;
      // the flight model, cut down
      let beat = false;
      if (mode !== 'dive' && cd <= 0 && (mode === 'rocket' || (y < gy && vy < 1.2))) beat = true;
      // the sea reflex as this pilot really has it: a human pulls up only a reaction time after dropping below 2.6 m
      if (!on && y < 2.6 && vy < 0) { if (lowAt < 0) lowAt = t; if (cd <= 0 && t - lowAt >= P.rescuePlan - 1e-6) beat = true; } else lowAt = -1;
      if (beat) { vy = vy < 0 ? Math.min(vy * 0.35 + PP.flap, PP.flapMax) : Math.min(vy + PP.flap * 0.8, PP.flapMax); if (mx) vx += Math.sign(mx) * F.flapPush; cd = P.beatCD; on = null; }
      cd -= dt;
      if (on) {
        vx += clamp(mx * PP.run - vx, -F.runAcc * dt, F.runAcc * dt);
        if (Math.abs(dX(on.x, x)) > on.w + 0.2) on = null;
      } else {
        vx += mx * PP.acc * dt; vx -= vx * F.airDrag * dt; vx = clamp(vx, -PP.max, PP.max);
        vy -= F.g * dt; if (vy < -F.fall) vy = -F.fall;
      }
      const oy = y;
      x += vx * dt; y += vy * dt;
      if (!on && vy <= 0) for (const L of W.ledges) { if (L.st === 2 || Math.abs(dX(L.x, x)) > L.w + 0.3) continue; if (oy >= L.y - 0.06 && y < L.y) { y = L.y; vy = 0; on = L; break; } }
      if (on) { y = on.y; vy = 0; }
      if (y + F.hh > F.H) { y = F.H - F.hh; if (vy > 0) vy *= -0.25; }
      const wt = 1 - t * 0.35;   // nearer moments count more
      // the sea
      if (y < 1.0) { s -= 3000; break; }
      if (!on && y < low) s -= (low - y) * 25 * wt;
      // riders
      for (const r of riders) {
        if (killed.has(r.id)) continue;
        const rx = r.x + r.vx * t, ry = r.y + clamp(r.vy * t, -3, 3);
        const ddx = dX(x, rx), ddy = ry - y;
        const reach = F.reach + 0.4;
        if (Math.abs(ddx) < reach && Math.abs(ddy) < 2.3) {
          const d = y + F.lanceH + lb - (ry + F.lanceH);
          const front = r.type === 'shieldbearer' && r.face === -Math.sign(ddx || 1);
          const need = (front ? ENEMY.shieldbearer.margin : F.dead) + P.margin * 0.4;
          if (d > need) { s += 260 * P.greed * wt; killed.add(r.id); }
          else if (d < -F.dead + 0.1 && p.inv < t + 0.1) s -= 900 * P.fear * wt;
          else s -= 60 * wt;
        } else if (Math.abs(ddx) < 5 && ddy > 0 && ddy < 4.5 && p.inv < t) s -= (5 - Math.abs(ddx)) * (4.5 - ddy) * 6 * P.fear * wt;   // somebody above me
      }
      // hazards and boss tells, which are all on the clock
      for (const q of W.haz) {
        if (q.k === 'gust' || q.k === 'drop' || q.k === 'line' || q.k === 'charge') continue;
        const t0 = q.T - q.t, t1 = t0 + q.A;
        if (t < t0 - 0.12 || t > t1 + 0.1) continue;
        if (inHazard(W, q, x, y, 0.35)) s -= 1500 * wt;
      }
      // falling drops: their marker says where
      for (const q of W.haz) if (q.k === 'drop') { const t0 = q.T - q.t + Math.max(0, F.H - 1.6 - y) / 18; if (Math.abs(t - t0) < 0.4 && Math.abs(dX(q.x, x)) < 2.1) s -= 1100 * wt; }
      if (B && B.cur && B.cur.kind === 'dive' && B.cur.t < B.cur.T) {
        // the dive line is marked: stay off it
        const c = B.cur, sx = dX(B.x, x), sy = y + 1 - B.y, l2 = c.dx * c.dx + c.dy * c.dy || 1, u = clamp((sx * c.dx + sy * c.dy) / l2, 0, 1.3);
        if (Math.hypot(sx - c.dx * u, sy - c.dy * u) < 3) s -= 500 * wt;
      }
      if (br) {
        const u = (t - (br.T - br.t)) / br.hurtA;
        if (u > -0.05 && u < 1.05) {
          const q = dX(br.x, x) * br.dir / 20 + 0.5, qh = u * 1.3 + 0.06, qt = u * 1.3 - 0.5;
          if (q > -0.04 && q < 1.04 && q > qt && q < qh) { const ya = -2.5 + 15 * (1 - (2 * q - 1) * (2 * q - 1)); if (Math.abs(y + 1 - ya) < 2.6) s -= 1400 * wt; }
        }
      }
      for (const o of orbs) {
        if (o.gone) continue;
        const dx = dX(o.x, x), dy = y + 1 - o.y, l = Math.hypot(dx, dy) || 1, k = Math.min(1, 1.6 * dt);
        o.vx += (dx / l * o.home - o.vx) * k; o.vy += (dy / l * o.home - o.vy) * k;
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (Math.abs(dX(x, o.x)) < o.r + 1 && Math.abs(o.y - (y + 1)) < o.r + 1.2) { o.gone = true; s += y + F.lanceH + lb > o.y + BOSSES.sovereign.orb.pop + 0.15 ? 40 * wt : -800 * wt; }
      }
      for (const sh of W.shots) {
        if (sh.home) continue;
        const sx = sh.x + sh.vx * t, sy = sh.y + sh.vy * t - (sh.kind === 'blob' || sh.kind === 'ice' ? 4.5 * t * t : 0);
        const ddx = dX(x, sx), ddy = sy - (y + 1);
        if (Math.abs(ddx) < sh.r + 1.1 && Math.abs(ddy) < sh.r + 1.3) {
          if (sh.kind === 'orb' && y + F.lanceH + lb > sy + 0.5) s += 40 * wt; else s -= 800 * wt;
        }
      }
      if (h) {
        const hx = h.x + h.vx * t, hy = h.y + h.vy * t;
        const ddx = dX(x, hx);
        if (Math.abs(ddx) < 2.2 && Math.abs(hy - y) < 2) {
          const face = mx ? Math.sign(mx) : p.face;
          const headOn = face === Math.sign(ddx || 1) && Math.sign(h.vx) === -Math.sign(ddx || 1) && Math.abs(y + F.lanceH + lb - (hy + HUNTER.eyeH)) < HUNTER.eyeTol * 0.8;
          s += headOn ? 400 * wt : (p.inv > t ? 0 : -1200 * wt);
        }
      }
      if (B && B.st === 'fight') {
        let onWeak = false;
        for (const q of B.pts) {
          if (!q.on || q.hp <= 0) continue;
          const [qx, qy] = weakPos(B, q);
          if (qy < 0.3) continue;
          const ddx = dX(x, qx + (B.vx || 0) * t * 0.6);
          if (Math.abs(ddx) < q.r + 1 && y + 1 > qy - q.r - 1.1 && y + 1 < qy + q.r + 1.3) { if (y + F.lanceH + lb > qy + 0.4) { s += 350 * wt; onWeak = true; } else s -= 120 * wt; }
        }
        if (!onWeak) for (const b of bossBodies(B)) {
          const bx = b.x + (B.vx || 0) * t, by = b.y + (B.vy || 0) * t;
          const nx = dX(bx, x) / (b.rx + 1.1), ny = (y + 1 - by) / (b.ry + 1.2);
          if (nx * nx + ny * ny < 1 && ny < 0.6) s -= (hurtB ? 1400 : 90) * wt;
        }
      }
    }
    // where it ends up against what it wants
    const gx = dX(x, goal.x), gyy = goal.y - y;
    s -= (Math.abs(gx) * 6 + Math.abs(gyy) * 7) * goal.w;
    if (Math.abs(gx) < 2 && Math.abs(gyy) < 1.5) s += 40 * goal.w;
    // keep some height in hand: the higher lance wins
    s += Math.min(y, 20) * 1.5;
    if (y > F.H - F.hh - 0.5) s -= 20;
    return s;
  }
}
const modeY = (m, p, goal) => (m === 'hold' ? p.y + 0.2 : m === 'sink' ? p.y - 3 : m === 'goal' ? goal.y + 0.3 : m === 'climb' ? p.y + 4 : m === 'rocket' ? 99 : -99);
function phys(W, p) {
  const w = W.up.wing || 0, sp = p.pw && p.pw.speed ? 1.2 : 1;
  return { acc: F.airAcc * (1 + 0.05 * w) * sp, max: F.airMax * (1 + 0.05 * w) * sp, run: F.runMax * (1 + 0.04 * w) * sp, flap: F.flap * (1 + 0.07 * w) * (p.pw && p.pw.speed ? 1.1 : 1), flapMax: F.flapMax * (1 + 0.03 * w) };
}
void DROP;

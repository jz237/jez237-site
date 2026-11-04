// Autopilot: drives a rover the way a person would. It only reacts to a threat once the game has
// signalled it, after a reaction delay (about 0.35 s for the human-like profile), presses jump with a
// little random timing and is sometimes late. The same code with a sharp profile drives the demo.
import { F } from './config.js?v=2';
import { baseH, groundH, jumpProfile } from './sim.js?v=2';
import { THREATS } from './config.js?v=2';

export const PROFILES = {
  // a first-time player: ~0.35 s reaction, a spread of ~0.09 s on every press, late now and then, sometimes
  // early (impatient), the odd threat missed entirely, holds a little long or short, dodges most bombs
  human: { react: 0.35, reactSD: 0.1, jitter: 0.09, lateP: 0.15, late: [0.15, 0.4], earlyP: 0.05, early: [0.15, 0.35], lapse: 0.02, holdMiss: 0.12, holdSD: 0.08, fireP: 0.8, dodge: 0.6 },
  demo: { react: 0.14, reactSD: 0.03, jitter: 0.012, lateP: 0, late: [0, 0], earlyP: 0, early: [0, 0], lapse: 0, holdMiss: 0, holdSD: 0.01, fireP: 1, dodge: 1 },
};
const HOLDS = [0, 0.1, 0.2, 0.3, 0.45];

function mulberry(seed) {
  let s = seed | 0;
  return () => {
    let t = (s = (s + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.rng = mulberry(seed);
    this.p = typeof profile === 'string' ? PROFILES[profile] : profile;
    this.seen = new Map();     // threat id -> time the driver noticed it
    this.plan = null;          // { xt, hold, err, ids }
    this.holdUntil = 0;
    this.fireHeld = false;
    this.th = 0;
    this.prof = new Map();
    this.debug = { plan: null };
  }
  gauss() { let u = 0; for (let i = 0; i < 4; i++) u += this.rng(); return (u - 2) / 0.5774; }

  // when this driver will have reacted to a signalled threat
  noticed(W, e) {
    if (!e.sig) return false;
    let t = this.seen.get(e.id);
    if (t === undefined) {
      let d = Math.max(0.12, this.p.react + this.gauss() * this.p.reactSD);
      if (this.rng() < this.p.lateP * 0.5) d += this.p.late[0] + this.rng() * (this.p.late[1] - this.p.late[0]);
      t = (e.sigT ?? W.t) + d;
      this.seen.set(e.id, t);
      if (this.seen.size > 400) this.seen.delete(this.seen.keys().next().value);
    }
    return W.t >= t;
  }

  profile(W, hold) {
    const key = hold + ':' + (W.up.springs || 0);
    if (!this.prof.has(key)) this.prof.set(key, jumpProfile(W, 1, hold));
    return this.prof.get(key);
  }

  // obstacles the rover's centre must cross in the air: [x0, x1, height above the ground there]
  obstacles(W, R) {
    const out = [];
    const v = Math.max(1, R.vx);
    for (const c of W.craters) {
      if (!c.kill || c.x + c.r < R.x - 1 || !this.noticed(W, c)) continue;
      const zone = c.r - W.R.land - (W.up.springs || 0) * 0.12;
      if (zone <= 0) continue;
      out.push({ x0: c.x - zone, x1: c.x + zone, h: 0.08, id: c.id, kind: 'crater' });
    }
    for (const r of W.rocks) {
      if (r.dead || r.x + r.hw + F.halfLen < R.x || !this.noticed(W, r)) continue;
      // rolling boulders come towards you: meet them where they will be
      let rx = r.x;
      if (r.vx) { const t = Math.max(0, (r.x - r.hw - (R.x + F.halfLen)) / (v - r.vx)); rx = r.x + r.vx * t; }
      out.push({ x0: rx - r.hw - F.halfLen, x1: rx + r.hw + F.halfLen, h: groundH(W, rx) - baseH(rx, W.k) + r.top - 0.15 + 0.14, id: r.id, kind: r.kind, shoot: r, hp: r.hp });
    }
    for (const m of W.mines) {
      if (m.dead || m.x + 2 < R.x || !this.noticed(W, m)) continue;
      out.push({ x0: m.x - 1.35 - THREATS.mine.r - 0.1, x1: m.x + 1.35 + THREATS.mine.r + 0.1, h: 0.1, id: m.id, kind: 'mine' });
    }
    for (const t of W.tanks) {
      if (t.dead || t.x + 4 < R.x || !this.noticed(W, t)) continue;
      const tm = Math.max(0, (t.x - 1.3 - (R.x + F.halfLen)) / (v - t.vx));
      const tx = t.x + t.vx * tm;
      out.push({ x0: tx - 1.3 - F.halfLen, x1: tx + 1.3 + F.halfLen, h: THREATS.tank.h - 0.15 + 0.14, id: t.id, kind: 'tank', shoot: t, hp: t.hp });
    }
    for (const s of W.shells) {
      if (s.dead || s.x < R.x - 2 || !this.noticed(W, s)) continue;
      const tm = Math.max(0, (s.x - (R.x + F.halfLen)) / (v - s.vx));
      const mx = R.x + v * tm; // where my centre is when it reaches me
      out.push({ x0: mx - 0.4, x1: mx + 2 * F.halfLen + 0.4, h: 1.25, id: s.id, kind: 'shell', shoot: s, hp: 1 });
    }
    out.sort((a, b) => a.x0 - b.x0);
    return out;
  }

  // the earliest feasible take-off for the next cluster of obstacles, with the least hold that clears it
  makePlan(W, R, obs) {
    if (!obs.length) return null;
    const v = Math.max(1, R.vx);
    // cluster: obstacles closer than a jump length belong to the same jump
    const first = obs[0];
    let end = first.x1;
    const group = [first];
    for (let i = 1; i < obs.length; i++) { if (obs[i].x0 < end + 3.2) { group.push(obs[i]); end = Math.max(end, obs[i].x1); } }
    for (const hold of HOLDS) {
      const prof = this.profile(W, hold);
      const D = prof[prof.length - 1][2] * v;
      if (D < end - first.x0 + 0.3) continue;
      let lo = null, hi = null;
      for (let xt = first.x0 - D; xt <= first.x0 + 0.01; xt += 0.2) {
        if (this.clears(W, prof, v, xt, group, obs)) { if (lo === null) lo = xt; hi = xt; } else if (lo !== null) break;
      }
      if (lo !== null && hi >= R.x - 0.3) {
        // aim for the middle of the take-off window (a bit early, like most people)
        const xt = lo + (hi - lo) * 0.45;
        return { xt, hold, win: hi - lo, ids: group.map((g) => g.id), end };
      }
    }
    // nothing fits: best effort, full hold, leave early
    const prof = this.profile(W, 0.45);
    const D = prof[prof.length - 1][2] * v;
    return { xt: Math.max(R.x, end - D + 0.3), hold: 0.45, win: 0, ids: group.map((g) => g.id), end, bad: true };
  }

  clears(W, prof, v, xt, group, all) {
    const g0 = baseH(xt, W.k);
    const D = prof[prof.length - 1][2] * v;
    for (const [, y, t] of prof) {
      const px = xt + v * t;
      const dg = baseH(px, W.k) - g0;
      for (const o of group) if (px >= o.x0 && px <= o.x1 && y - dg < o.h) return false;
    }
    // do not land in (or right before) the next thing
    const land = xt + D;
    for (const o of all) if (land > o.x0 - 0.3 && land < o.x1 + 0.2) return false;
    return true;
  }

  // where the rover's centre will be after t seconds holding throttle th
  predictX(W, R, th, t) {
    const boss = W.boss && W.boss.state !== 'dying';
    const tgt = W.speed * (boss ? 0.92 : 1) * (1 + F.throttle * th);
    let x = R.x, v = R.vx;
    const dt = 0.05;
    for (let s = 0; s < t; s += dt) { v += Math.max(-F.accel * dt, Math.min(F.accel * dt, tgt - v)); x += v * Math.min(dt, t - s); }
    return x;
  }

  control(W, R) {
    const out = { th: 0, jump: false, fire: false };
    if (!R.alive) { this.plan = null; return out; }
    const p = this.p;
    const v = Math.max(1, R.vx);
    const obs = this.obstacles(W, R);
    // re-plan whenever the cluster ahead changes; the timing error belongs to the plan
    const key = obs.length ? obs[0].id : -1;
    if (!this.plan || this.plan.key !== key || this.plan.done) {
      if (!this.plan || !this.plan.pressed || this.plan.done) {
        const pl = this.makePlan(W, R, obs);
        if (pl) {
          let err = this.gauss() * p.jitter;
          const roll = this.rng();
          if (roll < p.lateP) err += p.late[0] + this.rng() * (p.late[1] - p.late[0]);
          else if (roll < p.lateP + p.earlyP) err -= p.early[0] + this.rng() * (p.early[1] - p.early[0]);
          else if (roll < p.lateP + p.earlyP + p.lapse) err += 9; // did not see it at all
          pl.err = err * v; pl.key = key; pl.holdErr = this.gauss() * p.holdSD;
          // misjudging how far it has to go: one notch less hold than needed
          if (pl.hold > 0 && this.rng() < p.holdMiss) pl.holdErr -= 0.12;
        }
        this.plan = pl;
      }
    } else if (!this.plan.pressed) {
      // same cluster: refresh the target with the current speed, keep the personal error
      const pl = this.makePlan(W, R, obs);
      if (pl) { pl.err = this.plan.err; pl.key = key; pl.holdErr = this.plan.holdErr; this.plan = pl; }
    }
    const pl = this.plan;
    this.debug.plan = pl;
    if (pl && !pl.pressed && R.x >= pl.xt + pl.err && !R.air) {
      pl.pressed = true;
      this.holdUntil = W.t + Math.max(0.03, pl.hold + pl.holdErr);
    }
    if (pl && pl.pressed && !R.air && W.t > this.holdUntil + 0.1) pl.done = true;
    out.jump = W.t < this.holdUntil;
    // guns: hold fire while something shootable is ahead or overhead
    let want = false;
    for (const o of obs) if (o.shoot && o.x0 - R.x < 26 && o.x1 > R.x) want = true;
    for (const f of W.flyers) if (!f.dead && this.noticed(W, f) && Math.abs(f.x - R.x - (f.vx - R.vx) * 0.25) < 3.2) want = true;
    for (const d of W.drones) if (!d.dead && this.noticed(W, d) && d.x - R.x < 22) want = true;
    for (const b of W.bombs) if (!b.dead && this.noticed(W, b) && Math.abs(b.x - R.x) < 4 && b.y > R.y + 2) want = true;
    const boss = W.boss;
    if (boss && boss.state === 'fight') {
      if (boss.kind === 'ground') want = true;
      else if (Math.abs(boss.x - R.x) < 4.5) want = true;
    }
    if (want && this.rng() < p.fireP) this.fireHeld = true; else if (!want && this.rng() < 0.08) this.fireHeld = false;
    out.fire = this.fireHeld;
    // dodge bombs that will land on me: try slow / cruise / fast and keep the one with the most room
    if (W.t >= (this.thUntil || 0)) {
      const bombs = W.bombs.filter((b) => !b.dead && this.noticed(W, b) && b.T - b.t > 0.05);
      let th = 0;
      if (bombs.length && this.rng() < p.dodge) {
        let best = -1e9;
        for (const cand of [0, 1, -1]) {
          let worst = 1e9;
          for (const b of bombs) {
            // follow the whole fall: a mortar coming in from ahead can clip the nose on its way down
            const tl = b.T - b.t;
            for (let k = 1; k <= 8; k++) {
              const t = (tl * k) / 8;
              const bx = b.x + b.vx * t, by = b.y + b.vy * t - 0.5 * b.g * t * t;
              const rx = this.predictX(W, R, cand, t);
              const side = Math.abs(bx - rx) - F.halfLen - 0.6, above = by - (R.y + F.height + 0.5);
              worst = Math.min(worst, Math.max(side, above));
            }
          }
          if (worst > best + 0.4) { best = worst; th = cand; }
        }
        this.thUntil = W.t + 0.35;
      }
      this.th = th;
    }
    out.th = Math.abs(this.th) > 0.2 ? Math.sign(this.th) : 0;
    // never brake into a pit just before a jump
    if (pl && !pl.pressed && pl.xt - R.x < v * 1.2) out.th = Math.max(0, out.th);
    return out;
  }
}

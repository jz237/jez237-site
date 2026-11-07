// Autopilot. Every so often (its reaction time, with scatter, sometimes late) it re-reads the web, scores
// every lane it could reach against what is coming (bolts about to reach the rim, lanes about to be
// struck, riders and arc mites, spines in the dive) and what it wants (enemies close to the rim, gaps in a
// boss's armour, pods floating up), then steers to the best lane while it fires.
//   profile 'human': ~0.35 s reaction with scatter, sometimes late, tracks only nearby threats, steers at
//                    keyboard speed, does not always fire, purges a little late. A threat (bolt, lane strike,
//                    a rider's crouch or landing, a mite's crackle) only counts once it has been on screen for
//                    its own reaction time (0.35 s +- 0.1, sometimes 0.28 s later); then it re-plans at once.
//                    Attention is limited: the busier the screen near it, the likelier a threat is noticed
//                    only much later (miss0 + missK per threat in view, missT s late).
//   profile 'demo' : quick and sharp, sees everything: the attract mode and the AI playthrough
import { F, ENEMY } from './config.js?v=8';
import { laneDist, wrapL, laneOf } from './sim.js?v=8';

export const PROFILES = {
  human: { react: 0.35, jit: 0.1, late: 0.15, lateT: 0.28, notice: 1, miss0: 0.1, missK: 0.03, missT: [0.5, 1.3], track: 4, depth: 0.72, fireP: 0.86, purgeP: 0.6, hopP: 0.55, margin: 0.22, wander: 0.18, slip: 0.06 },
  demo: { react: 0.11, jit: 0.03, late: 0, lateT: 0, notice: 0, miss0: 0, missK: 0, missT: [0, 0], track: 99, depth: 1.1, fireP: 1, purgeP: 1, hopP: 1, margin: 0.32, wander: 0, slip: 0 },
};
function mk(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const segAt = (W, B, L) => (((L - Math.floor(B.rot + 0.5)) % W.nl) + W.nl) % W.nl;

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.rnd = mk(seed * 9301 + 49297);
    this.next = 0;
    this.goal = null;
    this.fireOn = true;
    this.out = { mx: 0, dx: 0, fire: false, purge: false, hop: false };
    this.debug = { mode: 'scan', danger: 0, goal: 0 };
    this.purgeAt = -1; this.hopAt = -1;
    this.seenAt = new Map(); this.wake = []; this.pruneT = 0;
  }
  // human reaction: note when each threat first shows; it counts (ok) one reaction time later
  observe(W, p) {
    const P = this.P, t = W.t, S = this.seenAt;
    // attention load: threats in view near the Rimrunner
    let load = W.bolts.length + W.zaps.length;
    for (const e of W.enemies) if (e.hp > 0 && e.d < P.depth && Math.abs(laneDist(W, p.pos, e.lane)) <= P.track) load++;
    const miss = P.miss0 + P.missK * load;
    const see = (k, salient = 1) => {
      if (S.has(k)) return;
      let dt = P.react + (this.rnd() - 0.5) * 2 * P.jit;
      if (this.rnd() < P.late) dt += P.lateT;
      if (this.rnd() < miss * salient) dt += P.missT[0] + (P.missT[1] - P.missT[0]) * this.rnd();
      S.set(k, t + dt); this.wake.push(t + dt);
    };
    for (const b of W.bolts) see('b' + b.id);
    for (const z of W.zaps) see('z' + z.id, 0.4);   // a whole lane lighting up is hard to miss
    for (const e of W.enemies) {
      if (!e.rim) continue;
      if (e.fl && e.type !== 'mite') see('f' + e.id + ':' + Math.round(e.fl.b));
      else if (e.type === 'mite') see('m' + e.id + ':' + Math.round(e.lane * 2) + (e.tell > 0 ? 't' : ''));
      else see('r' + e.id + ':' + Math.round(e.lane));
    }
    // a threat just registered: react now
    if (this.wake.length && this.wake.some((x) => x <= t)) { this.next = Math.min(this.next, t); this.wake = this.wake.filter((x) => x > t); }
    if (t > this.pruneT) { this.pruneT = t + 3; for (const [k, v] of S) if (v < t - 8) S.delete(k); }
  }
  ok(W, k) { return !this.P.notice || (this.seenAt.get(k) ?? Infinity) <= W.t; }
  control(W, p) {
    const out = this.out, P = this.P;
    out.dx = 0; out.purge = false; out.hop = false;
    if (P.notice) this.observe(W, p);
    if (!p.alive) { out.mx = 0; out.fire = false; return { ...out }; }
    if (W.t >= this.next) {
      let dt = P.react + (this.rnd() - 0.5) * 2 * P.jit;
      if (this.rnd() < P.late) dt += P.lateT;
      this.next = W.t + Math.max(0.05, dt);
      this.plan(W, p);
    }
    // steer: one lane at a time like a player tapping or holding a direction
    const g = this.goal ?? p.lane;
    const d = laneDist(W, p.pos, g);
    out.mx = Math.abs(d) > 0.35 ? Math.sign(d) * (Math.abs(d) > 1.5 ? 1 : 0.6) : 0;
    // release between lanes now and then so single taps land cleanly
    if (out.mx && this.lastMx && Math.abs(d) < 1.2 && Math.sign(d) === Math.sign(this.lastMx) && Math.abs(laneDist(W, p.tgt, g)) < 0.5) out.mx = 0;
    this.lastMx = out.mx;
    out.fire = this.fireOn && this.wantFire(W, p);
    if (this.purgeAt >= 0 && W.t >= this.purgeAt) { out.purge = true; this.purgeAt = -1; }
    if (this.hopAt >= 0 && W.t >= this.hopAt) { out.hop = true; this.hopAt = -1; }
    return { ...out };
  }
  wantFire(W, p) {
    const L = p.lane;
    if (W.phase === 'dive') return W.spine[L] < 1;
    if (W.boss && W.boss.state === 'fight') {
      const B = W.boss;
      if (B.eye && B.phase > 1 && !B.eye.open) return W.enemies.some((e) => laneOf(W, e.lane) === L) || W.bolts.some((b) => b.lane === L);
      return true;
    }
    return W.enemies.some((e) => e.hp > 0 && laneOf(W, e.lane) === L && e.d < 1) || W.bolts.some((b) => b.lane === L) || W.spine[L] < 1 || W.enemies.length > 0 && this.rnd() < 0.3;
  }
  // how bad it is to be in lane L about `tt` seconds from now
  danger(W, p, L, tt) {
    const P = this.P, R = W.R;
    let D = 0;
    const seen = (lane, d) => d <= P.depth && Math.abs(laneDist(W, p.pos, lane)) <= P.track;
    for (const b of W.bolts) {
      if (b.lane !== L || !seen(b.lane, b.d) || !this.ok(W, 'b' + b.id)) continue;
      const tb = b.d / b.v;
      // a bolt in my own lane I can shoot down, if there is time
      const shoot = L === p.lane ? 0.5 : 0;
      if (tb < tt + P.margin) D += 8;
      else if (tb < tt + 0.8) D += shoot ? 1 : 3;
    }
    for (const z of W.zaps) {
      if (z.lane !== L || !this.ok(W, 'z' + z.id)) continue;
      const start = -z.t, end = start + z.live;
      if (end > tt - 0.05 && start < tt + 0.9 + P.margin) D += start < tt + P.margin ? 10 : 4;
    }
    for (const e of W.enemies) {
      if (e.hp <= 0 || !seen(e.lane, e.d)) continue;
      const el = laneOf(W, e.lane);
      if (e.rim && !this.ok(W, e.type === 'mite' ? 'm' + e.id + ':' + Math.round(e.lane * 2) + (e.tell > 0 ? 't' : '') : e.fl ? 'f' + e.id + ':' + Math.round(e.fl.b) : 'r' + e.id + ':' + Math.round(e.lane))) continue;
      if (e.type === 'mite' && e.rim) {
        // a mite on one of this lane's borders is about to step in; it can only be shot once it has
        if (Math.abs(Math.abs(laneDist(W, L, e.lane)) - 0.5) < 0.1) D += e.tell > 0 ? 2.5 : 1.2;
        if (el === L && Math.abs(e.lane - Math.round(e.lane)) < 0.1 && e.grabT > R.grab * 0.6) D += 6;
        continue;
      }
      if (e.rim && e.fl && e.type !== 'mite' && laneOf(W, e.fl.b) === L) {
        // a rider crouching (or in mid-hop) to land in this lane grabs as it lands: be elsewhere by then
        const land = Math.max(0, e.tell) + (e.fl.T - e.fl.t);
        D += land < tt + P.margin + 0.1 ? 9 : land < tt + 0.9 ? 3 : 1;
      } else if (e.rim && el === L && !e.fl) {
        // a rider sitting in the lane: fine if I can shoot it at once, bad if it is about to grab
        D += e.grabT > R.grab * 0.55 ? 6 : 0.8 + Math.max(0, e.hp - 1) * 1.2;
      }
      if (e.type === 'shocker' && el === L && e.state === 'hover' && e.st < R.warn * 1.25 + tt + 0.3) D += 2;
    }
    const B = W.boss;
    if (B && B.pull && B.pull.lane === L) D += 4;
    if (W.phase === 'dive' && W.spine[L] < 1) D += 2 + (1 - W.spine[L]) * 6 * (W.diveT / W.diveDur + 0.4);
    return D;
  }
  // how much it wants to be in lane L
  desire(W, p, L) {
    const P = this.P;
    let V = 0;
    if (W.phase === 'dive') return W.spine[L] >= 1 ? 1 : 0;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.d > P.depth + 0.15) continue;
      const el = laneOf(W, e.lane);
      if (el !== L) continue;
      if (e.type === 'mite' && Math.abs(e.lane - Math.round(e.lane)) > ENEMY.mite.hitW) continue;
      V += e.rim ? 3.2 : 1.4 * (1 - e.d) + 0.3;
      if (e.type === 'splitter' && e.d < 0.55) V += 1.2;   // kill it before it splits
    }
    for (const b of W.bolts) if (b.lane === L && L === p.lane) V += 0.6;
    for (const q of W.pods) if (q.lane === L && q.d < 0.5) V += 2.5 * (1 - q.d);
    if (W.spine[L] < 1 && W.spine[L] < 0.5) V += 0.3;
    const B = W.boss;
    if (B && B.state === 'fight') {
      if (B.heads.length && B.heads.some((h) => h.hp > 0)) { if (B.heads.some((h) => h.hp > 0 && h.lane === L)) V += 2.4; }
      else if (B.segs && B.segs.some((x) => x > 0)) { V += B.segs[segAt(W, B, L)] > 0 ? 0.5 : 2.2; const nxt = B.segs[segAt(W, B, wrapL(W, L - 1))]; if (!nxt) V += 0.6; }
      else if (B.eye) { const dd = Math.abs(laneDist(W, L, B.eye.lane)); V += dd <= 1 ? (B.eye.open ? 3 : 1.2) : 0; }
      else V += 1;
    }
    return V;
  }
  plan(W, p) {
    const P = this.P, R = W.R;
    const n = W.nl, span = Math.min(P.track, W.closed ? Math.floor(n / 2) : n);
    let best = p.lane, bs = -1e9, here = 0;
    for (let k = -span; k <= span; k++) {
      const raw = p.lane + k;
      if (!W.closed && (raw < 0 || raw > n - 1)) continue;
      const L = wrapL(W, raw);
      const tt = Math.abs(laneDist(W, p.pos, L)) / F.spin + (k ? 0.08 : 0);
      // passing through a lane that is live on the way is bad too
      let pass = 0;
      for (let j = 1; j < Math.abs(k); j++) { const M = wrapL(W, p.lane + Math.sign(k) * j); pass += Math.min(6, this.danger(W, p, M, (j / F.spin))) * 0.6; }
      const s = this.desire(W, p, L) - this.danger(W, p, L, tt) * 1.6 - pass - Math.abs(k) * 0.22 + (k === 0 ? 0.25 : 0) + (this.goal === L ? 0.2 : 0) + (this.rnd() - 0.5) * P.wander;
      if (k === 0) here = s;
      if (s > bs) { bs = s; best = L; }
    }
    // the odd slip: a human sometimes does not react at all
    if (this.rnd() < P.slip) best = p.lane;
    this.goal = best;
    // a human holds the trigger most of the time, but not always; going after a rider at the rim (or one in
    // the lane already) they do fire
    this.fireOn = this.rnd() < P.fireP || W.enemies.some((e) => e.hp > 0 && e.rim && Math.abs(laneDist(W, e.lane, best)) < 0.6 && Math.abs(laneDist(W, p.pos, e.lane)) <= P.track);
    const dHere = this.danger(W, p, p.lane, 0.1);
    this.debug = { mode: W.boss ? 'boss' : W.phase === 'dive' ? 'dive' : dHere > 4 ? 'evade' : 'hunt', danger: dHere, goal: best };
    // PURGE when the rim is crowded or there is no way out; HOP over a hit that cannot be dodged
    const close = W.enemies.filter((e) => e.hp > 0 && e.d < 0.22 && Math.abs(laneDist(W, p.pos, e.lane)) < 3).length;
    const trapped = dHere >= 8 && bs < -6;
    if ((close >= 3 || trapped) && (p.purges > 0 || p.partials > 0) && this.purgeAt < 0 && W.phase === 'fight' && this.rnd() < P.purgeP) this.purgeAt = W.t + (this.profile === 'human' ? 0.12 + this.rnd() * 0.2 : 0.02);
    else if (trapped && p.hops > 0 && this.hopAt < 0 && this.rnd() < P.hopP) this.hopAt = W.t + 0.02;
    // a boss's crush in the last phase: purge or hop
    if (W.boss && W.boss.key === 'singularity' && W.boss.phase === 3 && W.boss.d < 0.2 && this.purgeAt < 0 && p.purges > 0) this.purgeAt = W.t + 0.05;
    void here; void R;
  }
}

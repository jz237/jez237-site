// AI pilots. Each one forecasts every incoming ball with the real physics, then plans its return:
// it tries a fan of paddle offsets, curve directions and lunges, flies each candidate shot forward,
// and scores it on how far the rival must stretch, what it hits behind them (a gap = core damage),
// power-ups on the way, and its own risk of fluffing an edge hit. Personas set reaction time, aim
// noise, speed and taste (smash, spin, bank shots, trigger-happiness). The plan is public, so the
// demo mode can draw it.
import { F } from './config.js?v=3';
import { returnShot, paddlesOf, cellIndex } from './sim.js?v=3';
import { predictToPlane, shotPath } from './predict.js?v=3';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r()); }

export class AIPilot {
  constructor(W, paddle, persona, diff = { noise: 1, speed: 1, react: 1, fire: 1 }) {
    this.p = paddle;
    this.side = paddle.side;
    const a = persona.ai;
    this.ai = {
      ...a,
      noise: a.noise * diff.noise,
      speed: a.speed * diff.speed,
      react: a.react * diff.react,
      fire: Math.min(1, a.fire * diff.fire),
      smash: a.smash * (diff.smash ?? 1),
      lunge: a.lunge * (diff.smash ?? 1),
    };
    this.name = persona.name;
    this.rand = Math.random;
    this.applyLimits();
    this.thinkT = 0;
    this.plan = null;
    this.err = new Map();
    this.caption = '';
    this.captionT = -9;
    this.idleT = 0;
    this.track = null;      // { ballId, x, eta, path }
    this.releaseX = null;
    this.lastFireT = -9;
  }

  applyLimits() {
    const p = this.p;
    p.maxSpeed = this.ai.speed * (p.boss ? 0.92 : 1);
    p.aiSpeed = p.maxSpeed;
    p.accel = this.ai.accel;
    p.gain = 16;
  }

  say(text, W) { this.caption = text; this.captionT = W.t; }

  contactZ(p) { return p.homeZ - p.side * (p.hd + F.ballR); }

  // How far can a rival paddle travel before time T (seconds)?
  reach(foe, T) {
    const human = !foe.aiSpeed;
    const sp = foe.aiSpeed || 21;
    const react = human ? 0.2 : 0.12;
    return Math.max(0, T - react - (foe.stun > 0 ? foe.stun : 0)) * sp;
  }

  update(W, dt) {
    const p = this.p;
    if (p.input.mode !== 'target') p.input.mode = 'target';
    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = this.ai.react * (0.75 + this.rand() * 0.5);
      this.think(W);
    }
    this.steer(W, dt);
  }

  // ------------------------------------------------------------------ deciding
  think(W) {
    const p = this.p, s = this.side;
    if (W.over) { this.track = null; this.plan = null; return; }
    if (p.caught) { this.planRelease(W); return; }
    const cz = this.contactZ(p);
    let best = null;
    for (const b of W.balls) {
      if (b.caught || b.vz * s <= 0) continue;
      const pr = predictToPlane(W, b, cz, 3, true);
      if (!pr) continue;
      // keep to my zone (the split Monolith shares the court between two paddles)
      if (pr.x < p.xMin - 0.3 || pr.x > p.xMax + 0.3) continue;
      const col = W.cells[s][cellIndex(pr.x)];
      const danger = col.hp <= 0 ? 3 : 1 + (col.max - col.hp) * 0.5;
      const dist = Math.max(0, Math.abs(pr.x - p.x) - p.hw * 0.6);
      const reachable = dist / p.maxSpeed + 0.04 < pr.t;
      const urgency = (danger / (pr.t + 0.25)) * (reachable ? 1 : 0.25) * (b.fire ? 1.5 : 1);
      if (!best || urgency > best.urgency) best = { b, pr, urgency };
    }
    if (!best) { this.track = null; this.plan = null; this.weapons(W, null); return; }
    const { b, pr } = best;
    // aim error: per-ball wobble that tightens as the ball closes in; ghost balls are hard to read
    let e = this.err.get(b.id);
    if (e === undefined) e = gauss(this.rand);
    e = e * 0.7 + gauss(this.rand) * 0.3;
    this.err.set(b.id, e);
    if (this.err.size > 16) this.err.delete(this.err.keys().next().value);
    const ghosted = b.owner === -s && W.fx[-s].ghost > 0;
    const errMag = this.ai.noise * clamp(pr.t / 1.1, 0.1, 1) * (ghosted ? 2.4 : 1) + (ghosted ? 0.5 : 0);
    const cx = pr.x + e * errMag * 0.55;
    this.track = { ballId: b.id, x: cx, trueX: pr.x, eta: pr.t, at: W.t, path: pr.path, vx: pr.vx, vz: pr.vz };
    if (pr.t < 1.5 && (!this.plan || this.plan.ballId !== b.id || pr.t > 0.45)) this.planShot(W, b, cx, pr.t, errMag);
    this.weapons(W, best);
  }

  planShot(W, b, cx, eta, errMag) {
    const p = this.p, s = this.side, ai = this.ai;
    const foes = paddlesOf(W, -s);
    const foeZ = foes.length ? foes[0].homeZ + s * (F.paddleHD + F.ballR) : -s * F.paddleZ;
    const cellPlane = -s * (F.cellZ - F.cellHD - F.ballR);
    const cz = this.contactZ(p);
    const fire = b.fire && b.owner === s || W.fx[s].nova > 0 || W.meter[s].odTime > 0;
    const us = [-0.85, -0.6, -0.35, -0.12, 0.12, 0.35, 0.6, 0.85];
    const spins = ai.spin > 0.3 && eta > 0.3 ? [-1, 0, 1] : [0];
    const lunges = ai.lunge > 0.3 && eta > 0.42 ? [0, 1] : [0];
    const cands = [];
    for (const u of us) {
      const px = cx - u * p.hw;
      if (px < p.xMin + p.hw - 0.05 || px > p.xMax - p.hw + 0.05) continue;
      for (const sd of spins) for (const lg of lunges) {
        const pvx = sd * 9, pvz = lg ? -s * 12 : 0;
        const vp = { side: s, x: px, hw: p.hw, vx: pvx, vz: pvz };
        const r = returnShot(W, vp, cx, b.rally, { pvx, pvz });
        const sp = shotPath(W, cx, cz, r.vx, r.vz, r.spin, [foeZ, cellPlane], 2.8, W.t + eta);
        if (sp.hits.length < 1) continue;
        const h2 = sp.hits[0];
        const x3 = sp.hits[1] ? sp.hits[1].x : h2.x;
        let margin = 9;
        for (const f of foes) {
          const inZone = h2.x > f.xMin - 0.2 && h2.x < f.xMax + 0.2;
          if (!inZone) continue;
          margin = Math.min(margin, Math.abs(h2.x - f.x) - f.hw * 0.85 - this.reach(f, eta + h2.t));
        }
        const pMiss = sigmoid(margin * 2.2);
        const cell = W.cells[-s][cellIndex(x3)];
        let goal = cell.hp <= 0 ? 3 : 0.55 + (cell.max - cell.hp) * 0.45;
        if (fire && cell.hp > 0) goal = 2.4;
        let orb = 0;
        for (const o of W.orbs) {
          for (let i = 0; i < sp.path.length; i += 2) {
            if (Math.abs(sp.path[i] - o.x) < 0.9 && Math.abs(sp.path[i + 1] - o.z) < 0.9) { orb = ai.greed * 0.7; break; }
          }
        }
        const risk = Math.pow(Math.abs(u), 3) * errMag * 0.6 + (lg ? 0.06 : 0) + (sd ? 0.05 : 0);
        const style = (sp.banks > 0 ? ai.bank * 0.18 : 0) + (sd ? ai.spin * 0.14 : 0) + (lg ? ai.smash * 0.3 : 0);
        const value = pMiss * goal + (1 - pMiss) * 0.12 + orb - risk + style;
        cands.push({ u, px, sd, lg, value, x2: h2.x, x3, path: sp.path, banks: sp.banks, pMiss, goal, orb, speed: r.speed, col: cellIndex(x3), gap: cell.hp <= 0 });
      }
    }
    if (!cands.length) { this.plan = { ballId: b.id, u: 0, px: cx, sd: 0, lg: 0, t0: W.t, eta }; return; }
    // softmax pick: low temperature = cold, calculating
    const T = Math.max(0.04, ai.temp);
    const mx = Math.max(...cands.map((c) => c.value));
    let tot = 0;
    for (const c of cands) { c.w = Math.exp((c.value - mx) / T); tot += c.w; }
    let r = this.rand() * tot, pick = cands[0];
    for (const c of cands) { r -= c.w; if (r <= 0) { pick = c; break; } }
    this.plan = { ...pick, ballId: b.id, t0: W.t, eta };
    this.say(this.label(pick), W);
  }

  label(c) {
    const parts = [];
    if (c.lg) parts.push('SMASH');
    if (c.sd) parts.push('CURVE');
    if (c.banks > 0) parts.push('BANK');
    if (c.orb > 0) parts.push('ORB GRAB');
    let tag = parts.length ? parts.join(' + ') : 'DRIVE';
    if (c.gap) tag += ` → GAP ${c.col + 1}`;
    else if (c.pMiss > 0.7) tag += ' → WRONG-FOOT';
    else tag += ` → CELL ${c.col + 1}`;
    return tag;
  }

  planRelease(W) {
    const p = this.p, s = this.side;
    const b = p.caught;
    const foes = paddlesOf(W, -s);
    const foeZ = foes.length ? foes[0].homeZ + s * (F.paddleHD + F.ballR) : -s * F.paddleZ;
    const cellPlane = -s * (F.cellZ - F.cellHD - F.ballR);
    let best = null;
    for (const dx of [-3, -1.5, 0, 1.5, 3]) {
      const px = clamp(p.x + dx, p.xMin + p.hw, p.xMax - p.hw);
      const vp = { side: s, x: px, hw: p.hw, vx: 0, vz: 0 };
      const r = returnShot(W, vp, px + b.catchOff, b.rally, { pvx: 0, pvz: 0, catchRelease: true });
      const sp = shotPath(W, px + b.catchOff, p.z - s * 0.7, r.vx, r.vz, r.spin, [foeZ, cellPlane]);
      if (!sp.hits.length) continue;
      const x2 = sp.hits[0].x, x3 = sp.hits[1] ? sp.hits[1].x : x2;
      let margin = 9;
      for (const f of foes) margin = Math.min(margin, Math.abs(x2 - f.x) - f.hw * 0.85 - this.reach(f, sp.hits[0].t + Math.abs(dx) / p.maxSpeed));
      const cell = W.cells[-s][cellIndex(x3)];
      const v = sigmoid(margin * 2) * (cell.hp <= 0 ? 3 : 1) - Math.abs(dx) * 0.03;
      if (!best || v > best.v) best = { v, px, x3, path: sp.path, col: cellIndex(x3), gap: cell.hp <= 0 };
    }
    this.releaseX = best ? best.px : p.x;
    if (best) {
      this.plan = { ballId: b.id, px: best.px, u: 0, sd: 0, lg: 0, path: best.path, x3: best.x3, t0: W.t, eta: 0, release: true };
      this.say(`MAGNET AIM → ${best.gap ? 'GAP' : 'CELL'} ${best.col + 1}`, W);
    }
  }

  weapons(W, threat) {
    const p = this.p, s = this.side, ai = this.ai, m = W.meter[s];
    if (p.stun > 0 || p.caught || W.over) return;
    // overdrive: when a return is imminent, or to finish a weak core
    if (m.od >= 100 && m.odTime <= 0) {
      const foeCore = W.cores[-s].hp;
      if ((threat && threat.pr.t < 0.8) || foeCore <= 2 || this.rand() < 0.04) {
        if (this.rand() < ai.od + 0.2) { p.input.od = true; this.say('OVERDRIVE!', W); return; }
      }
    }
    const canFire = (m.charges >= 1 || m.odTime > 0) && m.cool <= 0 && W.t - this.lastFireT > 0.2;
    if (!canFire) return;
    const foes = paddlesOf(W, -s);
    const boltT = (Math.abs(p.z) + F.paddleZ) / F.boltSpeed;
    const roll = this.rand();
    // 1) stun shot: my ball is flying at them and the paddle in my line of fire must still move
    for (const b of W.balls) {
      if (b.caught || b.vz * s >= 0 || b.owner !== s) continue;
      const key = b.id * 1000 + b.hits;
      if (this.stunTried === key) continue;
      for (const f of foes) {
        if (Math.abs(f.x - p.x) > f.hw - 0.1 || f.stun > 0 || W.t < f.immuneT) continue;
        const pr = predictToPlane(W, b, f.homeZ + s * (f.hd + F.ballR), 2);
        if (!pr) continue;
        const need = Math.abs(pr.x - f.x) - f.hw * 0.5;
        if (pr.t > boltT - 0.05 && pr.t < boltT + 0.9 && need > 0.2) {
          this.stunTried = key; // one decision per shot
          if (roll < ai.fire * 0.75) return this.fire(W, `STUN SHOT · ${pr.t.toFixed(2)}s`);
        }
      }
    }
    // 2) snipe a power-up sitting in my line of fire
    for (const o of W.orbs) {
      if (W.t - o.born < 0.6) continue;
      if (Math.abs(o.x + o.vx * boltT * 0.5 - p.x) < o.r * 0.75 && roll < ai.greed * 0.8) return this.fire(W, 'SNIPE ORB');
    }
    // 3) chip the enemy shield with spare charges when nothing is coming
    const calm = !threat || threat.pr.t > 1.0;
    if (calm && (m.charges >= F.boltCharges - 0.01 || m.odTime > 0)) {
      const c = W.cells[-s][cellIndex(p.x)];
      const blocked = foes.some((f) => Math.abs(f.x - p.x) < f.hw);
      if (c.hp > 0 && !blocked && roll < ai.fire * 0.6) return this.fire(W, `CHIP CELL ${c.i + 1}`);
      if (blocked && roll < ai.fire * 0.35) return this.fire(W, 'HARASS');
    }
  }

  fire(W, why) {
    this.p.input.fire = true;
    this.lastFireT = W.t;
    this.say(why, W);
  }

  // ------------------------------------------------------------------ moving
  steer(W, dt) {
    const p = this.p, s = this.side, inp = p.input;
    let tx = p.x, tz = p.homeZ;
    if (p.caught) {
      tx = this.releaseX !== null ? this.releaseX : p.x;
      if (Math.abs(p.x - tx) < 0.25 && p.catchT > 0.35 + this.ai.react) inp.fire = true;
    } else if (this.track) {
      const tr = this.track;
      const tc = tr.eta - (W.t - tr.at);
      const plan = this.plan && this.plan.ballId === tr.ballId ? this.plan : null;
      if (plan) {
        tx = plan.px;
        if (plan.sd) tx += tc > 0.13 ? -plan.sd * 0.85 : plan.sd * 1.3;
        if (plan.lg) tz = tc > 0.2 ? p.zBack : p.zFront;
      } else tx = tr.x;
      if (tc < -0.3) this.track = null;
    } else {
      // idle: shadow the play, lean toward my weakest column
      let gx = 0, gw = 0;
      for (const c of W.cells[s]) { const w = c.hp <= 0 ? 2 : c.hp < c.max ? 0.6 : 0; gx += c.x * w; gw += w; }
      const guard = gw ? gx / gw : 0;
      let bx = 0, n = 0;
      for (const b of W.balls) { bx += b.x; n++; }
      tx = (n ? (bx / n) * 0.45 : 0) * 0.6 + guard * 0.4;
      tz = p.homeZ + s * 0.25;
    }
    inp.tx = clamp(tx, p.xMin + p.hw, p.xMax - p.hw);
    inp.tz = tz;
  }
}

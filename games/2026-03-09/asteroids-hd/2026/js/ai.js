// AI pilots. Every few tenths of a second a pilot re-reads the belt: it forecasts every rock, shot and
// hazard against its own path, picks an objective (dodge, duel, shard play, mining, a power-up) and
// writes the plan down. The demo's overlay draws that plan and the captions read it out.
import { F } from './config.js?v=3';
import { dX, dZ, fwd, angleTo, angDiff } from './sim.js?v=3';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.15;
const HEADINGS = 16;

export class AIPilot {
  constructor(W, ship, persona, diff = { aim: 1, react: 1, fire: 1, dodge: 1 }) {
    this.ship = ship;
    this.side = ship.side;
    this.p = persona.ai;
    this.name = persona.name;
    this.d = diff;
    this.t = 0;
    this.next = 0;
    this.plan = { mode: 'scan', aim: null, move: null, threats: [], shard: null, lead: 0 };
    this.noise = 0;
    this.caption = '';
    this.captionT = -9;
    this.mode = '';
    this.fireOk = 0;
    this.dashWant = false;
    this.burst = 4;
    this.hold = 0;
    this.lastShots = 0;
  }

  say(W, text) {
    if (text === this.caption && W.t - this.captionT < 2.5) return;
    this.caption = text;
    this.captionT = W.t;
  }

  // the rival ship or boss part to fight, as {x, z, vx, vz, r, name}
  foe(W) {
    for (const s of W.ships) if (s.side !== this.side && s.alive) return { x: s.x, z: s.z, vx: s.vx, vz: s.vz, r: s.r, ship: s, name: s.name };
    const B = W.boss;
    if (B && this.side === 1) {
      const me = this.ship;
      if (B.phase === 2) return { x: B.x, z: B.z, vx: B.vx, vz: B.vz, r: B.r * 0.8, boss: 'core' };
      let best = null, bd = 1e9;
      for (const e of B.eyes) {
        if (e.hp <= 0) continue;
        const d = Math.hypot(dX(me.x, e.x), dZ(me.z, e.z));
        if (d < bd) { bd = d; best = e; }
      }
      // the eyes turn with the hive: their speed is the hive's plus the spin
      if (best) {
        const w = 0.16, rx = dX(B.x, best.x), rz = dZ(B.z, best.z);
        return { x: best.x, z: best.z, vx: B.vx - rz * w, vz: B.vz + rx * w, r: 1.1, boss: 'eye' };
      }
    }
    return null;
  }

  // when would a shot fired now meet target t? returns {x, z, t} in world space or null
  lead(t) {
    const s = this.ship;
    const px = dX(s.x, t.x), pz = dZ(s.z, t.z);
    const ux = (t.vx || 0) - s.vx * 0.5, uz = (t.vz || 0) - s.vz * 0.5;
    const sp = F.shotSpeed;
    const a = ux * ux + uz * uz - sp * sp, b = 2 * (px * ux + pz * uz), c = px * px + pz * pz;
    let tt;
    if (Math.abs(a) < 1e-6) tt = -c / (b || 1);
    else {
      const disc = b * b - 4 * a * c;
      if (disc < 0) return null;
      const r1 = (-b - Math.sqrt(disc)) / (2 * a), r2 = (-b + Math.sqrt(disc)) / (2 * a);
      tt = Math.min(r1 > 0 ? r1 : 1e9, r2 > 0 ? r2 : 1e9);
    }
    if (!(tt > 0) || tt > 1.2) return null;
    return { dx: px + ux * tt, dz: pz + uz * tt, t: tt };
  }

  // everything that could hurt us in the next `H` seconds if we keep flying like this
  threats(W, H) {
    const s = this.ship, out = [];
    const rockSafe = s.fx.phase > 0 || s.odTime > 0;
    const add = (x, z, vx, vz, r, w, kind) => {
      const px = dX(s.x, x), pz = dZ(s.z, z);
      if (Math.abs(px) > 30 || Math.abs(pz) > 30) return;
      const rvx = vx - s.vx, rvz = vz - s.vz;
      const v2 = rvx * rvx + rvz * rvz;
      const tc = v2 > 1e-6 ? clamp(-(px * rvx + pz * rvz) / v2, 0, H) : 0;
      const cx = px + rvx * tc, cz = pz + rvz * tc;
      const dmin = Math.hypot(cx, cz);
      const rad = r + s.r + 0.9;
      if (dmin < rad) out.push({ px, pz, vx, vz, rvx, rvz, tc, r, w: w * (1.25 - tc / H), kind, x, z });
    };
    if (!rockSafe) {
      for (const r of W.rocks) {
        const shard = r.owner === -this.side && r.ownT > 0;
        add(r.x, r.z, r.vx, r.vz, r.r, shard ? 2.2 : 1, shard ? 'shard' : 'rock');
      }
    }
    for (const b of W.bullets) if (b.side !== this.side) add(b.x, b.z, b.vx, b.vz, 0.25, b.dmg * 1.2, 'shot');
    for (const m of W.mines) if (m.side !== this.side && m.armT < 0.4) add(m.x, m.z, m.vx, m.vz, 2.8, 2, 'mine');
    for (const st of W.strikes) if (st.t < H + 0.3) add(st.x, st.z, 0, 0, st.r, 2.2, 'storm');
    for (const L of W.lanes) {
      // a comet lane: treat the line through our position as dangerous
      const px = dX(L.x, s.x), pz = dZ(L.z, s.z);
      const across = Math.abs(px * L.dz - pz * L.dx);
      if (across < 3.4) out.push({ px: -px + L.dx * 0, pz: -pz, vx: L.dx * 25, vz: L.dz * 25, rvx: L.dx * 25, rvz: L.dz * 25, tc: 0.4, r: 2.4, w: 2, kind: 'comet', x: s.x, z: s.z, lane: L });
    }
    if (W.hole) add(W.hole.x, W.hole.z, 0, 0, 2.8, 2.5, 'hole');
    const B = W.boss;
    if (B && this.side === 1) {
      add(B.x, B.z, B.vx, B.vz, B.r, 1.5, 'boss');
      if (B.beam) {
        const [fx, fz] = fwd(B.beam.ang);
        const px = dX(B.x, s.x), pz = dZ(B.z, s.z);
        const along = px * fx + pz * fz, across = px * fz - pz * fx;
        if (along > 0 && Math.abs(across) < 4.2) out.push({ px: -fz * Math.sign(across) * -1, pz: fx * Math.sign(across) * -1, vx: 0, vz: 0, rvx: -s.vx, rvz: -s.vz, tc: B.beam.state === 'fire' ? 0 : B.beam.t, r: 3, w: 4, kind: 'beam', x: s.x, z: s.z, beam: { fx, fz, across } });
      }
    }
    out.sort((a, b) => b.w - a.w);
    return out.slice(0, 10);
  }

  // how safe is flying with heading h at thrust k for the next H seconds? (bigger is better)
  scoreHeading(h, k, threats, H) {
    const s = this.ship;
    const [fx, fz] = fwd(h);
    const ax = fx * F.thrust * k, az = fz * F.thrust * k;
    let worst = 99;
    for (let i = 1; i <= 6; i++) {
      const t = (i / 6) * H;
      const mx = s.vx * t + 0.5 * ax * t * t, mz = s.vz * t + 0.5 * az * t * t;
      for (const q of threats) {
        let d;
        if (q.beam) {
          const nx = q.beam.across + (mx * q.beam.fz - mz * q.beam.fx);
          d = Math.abs(nx) - q.r - s.r;
        } else if (q.lane) {
          const px = -q.px + mx, pz = -q.pz + mz;
          d = Math.abs(px * q.lane.dz - pz * q.lane.dx) - 3.4;
        } else {
          const ox = q.px + q.vx * t - mx - 0, oz = q.pz + q.vz * t - mz;
          // q.px is relative at t=0 with the obstacle's own velocity; our motion relative to start is (mx, mz)
          d = Math.hypot(ox - s.vx * 0 , oz) - q.r - s.r;
        }
        const v = d / q.w;
        if (v < worst) worst = v;
      }
    }
    return worst;
  }

  plan_(W) {
    const s = this.ship, P = this.p, D = this.d;
    const H = 1.25 * clamp(P.dodge * D.dodge, 0.3, 1.3);
    const th = this.threats(W, H);
    const foe = this.foe(W);
    const plan = { mode: 'scan', aim: null, move: null, threats: th.slice(0, 5), shard: null, lead: 0, target: null };
    this.noise = gauss() * P.aim * D.aim;
    this.dashWant = false;
    // 1. dodge
    const urgent = th.find((q) => q.tc < 0.85 * P.dodge * D.dodge + 0.15);
    if (urgent && Math.random() < 0.55 + 0.45 * P.dodge * D.dodge) {
      let best = s.a, bk = 1, bv = -99;
      for (let i = 0; i < HEADINGS; i++) {
        const h = (i / HEADINGS) * Math.PI * 2 - Math.PI;
        for (const k of [1, 0.4]) {
          const v = this.scoreHeading(h, k, th, Math.min(H, 0.9)) - Math.abs(angDiff(s.a, h)) * 0.08;
          if (v > bv) { bv = v; best = h; bk = k; }
        }
      }
      plan.mode = 'evade';
      plan.heading = best;
      plan.thrust = bk;
      plan.move = { x: s.x + Math.sin(best) * 6, z: s.z - Math.cos(best) * 6 };
      if (urgent.tc < 0.32 && s.dashCD <= 0 && Math.random() < P.dash) this.dashWant = true;
      const n = th.filter((q) => q.tc < 1).length;
      this.say(W, urgent.kind === 'shot' ? 'DODGING INCOMING FIRE' : urgent.kind === 'shard' ? 'DODGING SHARDS' : urgent.kind === 'storm' ? 'CLEARING THE STRIKE ZONE' :
        urgent.kind === 'comet' ? 'OUT OF THE COMET LANE' : urgent.kind === 'beam' ? 'SLIPPING THE BEAM' : urgent.kind === 'hole' ? 'FIGHTING THE PULL' : n > 1 ? `THREADING ${n} ROCKS` : 'EVADING A ROCK');
      this.plan = plan;
      return;
    }
    // 2. power-ups
    let orb = null, od = 1e9;
    for (const o of W.orbs) {
      const d = Math.hypot(dX(s.x, o.x), dZ(s.z, o.z));
      const fd = foe && foe.ship ? Math.hypot(dX(foe.x, o.x), dZ(foe.z, o.z)) : 99;
      const v = d - (fd < d ? 6 : 0) * 0;
      if (v < od) { od = v; orb = o; }
    }
    if (orb && od < 8 + 16 * P.greed && Math.random() < 0.35 + P.greed * 0.6) {
      plan.mode = 'orb';
      plan.target = orb.id;
      plan.move = { x: orb.x, z: orb.z };
      // can we just shoot it? (a shot claims it)
      const L = this.lead({ x: orb.x, z: orb.z, vx: orb.vx, vz: orb.vz });
      if (L && od > 7 && Math.random() < 0.6) { plan.aimRel = L; plan.mode = 'snipe'; this.say(W, `SNIPING THE ${orbName(orb.kind)}`); }
      else this.say(W, `GOING FOR THE ${orbName(orb.kind)}`);
      this.plan = plan;
      return;
    }
    // 3. the duel
    if (foe) {
      const dist = Math.hypot(dX(s.x, foe.x), dZ(s.z, foe.z));
      // shard play: a rock lined up between us and the foe
      if (P.shard > 0.1 && foe.ship && Math.random() < P.shard) {
        let best = null, bv = 0;
        for (const r of W.rocks) {
          if (r.size < 2 || r.kind === 'comet') continue;
          const rx = dX(s.x, r.x), rz = dZ(s.z, r.z), rd = Math.hypot(rx, rz);
          if (rd < r.r + 3 || rd > 22) continue;
          const fx = dX(r.x, foe.x), fz = dZ(r.z, foe.z), fd = Math.hypot(fx, fz);
          if (fd > 16) continue;
          const cos = (rx * fx + rz * fz) / (rd * fd + 1e-6);
          if (cos < 0.86) continue;
          const v = cos * (1.2 - fd / 20) * r.size;
          if (v > bv) { bv = v; best = r; }
        }
        if (best) {
          plan.mode = 'shard';
          plan.target = best.id;
          plan.shard = { rock: best.id, fx: foe.x, fz: foe.z };
          const L = this.lead(best);
          if (L) plan.aimRel = L;
          plan.move = null;
          this.say(W, `SHARD SHOT AT ${foe.name || 'THE RIVAL'}`);
          this.plan = plan;
          return;
        }
      }
      if (Math.random() < P.hunt || foe.boss || W.rocks.length < 3) {
        plan.mode = foe.boss ? 'boss' : 'duel';
        const L = this.lead(foe);
        if (L) { plan.aimRel = L; plan.lead = L.t; }
        // hold the preferred range, circling a little
        const want = foe.boss ? 15 : P.range;
        const bx = dX(foe.x, s.x), bz = dZ(foe.z, s.z), bl = Math.hypot(bx, bz) || 1;
        const orbit = (this.side === 1 ? 1 : -1) * 0.5;
        const ux = bx / bl, uz = bz / bl;
        const ox = ux * Math.cos(orbit) - uz * Math.sin(orbit), oz = ux * Math.sin(orbit) + uz * Math.cos(orbit);
        plan.move = { x: foe.x + ox * want, z: foe.z + oz * want };
        this.say(W, foe.boss === 'eye' ? 'TARGETING AN EYE' : foe.boss === 'core' ? 'HAMMERING THE CORE' :
          L ? `LEADING ${foe.name || 'THE RIVAL'} BY ${L.t.toFixed(2)}s` : dist > 30 ? 'CLOSING IN' : 'LINING UP');
        this.plan = plan;
        return;
      }
    }
    // 4. mining: break the most valuable rock in reach
    let best = null, bv = 0;
    for (const r of W.rocks) {
      const d = Math.hypot(dX(s.x, r.x), dZ(s.z, r.z));
      if (d > 26) continue;
      const v = (r.kind === 'gold' ? 6 : r.kind === 'volatile' ? 0.4 : 1) * (1 + (4 - r.size) * 0.25) / (1 + d / 10);
      if (v > bv) { bv = v; best = r; }
    }
    if (best) {
      plan.mode = 'mine';
      plan.target = best.id;
      const L = this.lead(best);
      if (L) plan.aimRel = L;
      const bx = dX(best.x, s.x), bz = dZ(best.z, s.z), bl = Math.hypot(bx, bz) || 1;
      plan.move = bl > 14 ? { x: best.x + (bx / bl) * 9, z: best.z + (bz / bl) * 9 } : null;
      this.say(W, best.kind === 'gold' ? 'MINING A GOLD ROCK' : best.size === 3 ? 'BREAKING A BIG ONE' : 'CLEARING ROCKS');
    } else {
      plan.mode = 'scan';
      plan.move = foe ? { x: foe.x, z: foe.z } : { x: 0, z: 0 };
      this.say(W, 'READING THE BELT');
    }
    this.plan = plan;
  }

  update(W, dt) {
    const s = this.ship, inp = s.input, P = this.p;
    this.t += dt;
    if (!s.alive) { inp.fire = false; inp.thrust = 0; return; }
    if (this.t >= this.next) {
      this.plan_(W);
      this.next = this.t + P.react * this.d.react * (0.75 + Math.random() * 0.5);
    }
    const plan = this.plan;
    inp.turn = 0;
    inp.fire = false;
    inp.thrust = 0;
    if (this.dashWant) { inp.dash = true; this.dashWant = false; }
    // overdrive when it will count
    if (s.od >= F.odMax && s.odTime <= 0) {
      const foe = this.foe(W);
      if (foe && Math.hypot(dX(s.x, foe.x), dZ(s.z, foe.z)) < 22 && Math.random() < P.od * dt * 3) { inp.od = true; this.say(W, 'OVERDRIVE!'); }
    }
    if (plan.mode === 'evade') {
      inp.aim = plan.heading;
      inp.thrust = Math.abs(angDiff(s.a, plan.heading)) < 1.1 ? plan.thrust : 0.15;
      // shoot whatever we happen to face
      inp.fire = this.lineOfFire(W) && Math.random() < 0.7;
      return;
    }
    // aim: refresh the lead each tick for the current target
    let aimAng = null, tgtR = 1, tgtD = 20;
    const tgt = this.targetObj(W, plan);
    if (tgt) {
      const L = this.lead(tgt);
      if (L) { aimAng = angleTo(L.dx, L.dz) + this.noise * (tgt.ship ? 1 : 0.5); tgtD = Math.hypot(L.dx, L.dz); tgtR = tgt.r || 1; plan.aimRel = L; }
    }
    // movement
    let moveAng = null, moveD = 0;
    if (plan.move) {
      const mx = dX(s.x, plan.move.x), mz = dZ(s.z, plan.move.z);
      moveD = Math.hypot(mx, mz);
      if (moveD > 2.5) moveAng = angleTo(mx, mz);
    }
    const sp = Math.hypot(s.vx, s.vz);
    if (moveAng !== null && (aimAng === null || moveD > 12)) {
      inp.aim = moveAng;
      const ok = Math.abs(angDiff(s.a, moveAng));
      inp.thrust = ok < 0.6 ? (sp > 15 && moveD < 10 ? 0 : 1) : ok > 2.4 && sp > 6 ? -0.5 : 0.1;
    } else if (aimAng !== null) {
      inp.aim = aimAng;
      // drift toward the move point when it happens to be ahead
      if (moveAng !== null) {
        const c = Math.cos(angDiff(aimAng, moveAng));
        inp.thrust = c > 0.4 ? 0.6 * c : c < -0.6 && sp > 8 ? -0.4 : 0;
      } else inp.thrust = sp > 9 ? -0.3 : 0;
    } else {
      inp.aim = s.a + 0.6;
      inp.thrust = 0.2;
    }
    // bursts: a few shots, then a breather (pilots that love the trigger rest less)
    if (s.shots !== this.lastShots) { this.burst -= s.shots - this.lastShots; this.lastShots = s.shots; }
    if (this.burst <= 0) { this.burst = 3 + Math.floor(Math.random() * 3); this.hold = (0.5 + Math.random() * 0.7) * (1.4 - P.fire) / this.d.fire; }
    if (this.hold > 0) { this.hold -= dt; return; }
    // fire discipline: only when lined up (the sniper waits for a clean shot)
    if (aimAng !== null && tgtD < 40) {
      const tol = Math.atan2(tgtR + 0.25, tgtD) * (1.2 - P.aim * 2) + 0.02;
      const off = Math.abs(angDiff(s.a, aimAng));
      if (off < tol && Math.random() < 0.5 + P.fire * 0.5 * this.d.fire) inp.fire = true;
    }
    if (!inp.fire && this.lineOfFire(W) && Math.random() < 0.15 * P.fire) inp.fire = true;
  }

  targetObj(W, plan) {
    if (plan.mode === 'duel' || plan.mode === 'boss' || plan.mode === 'scan') return this.foe(W);
    if (plan.mode === 'snipe' || plan.mode === 'orb') {
      const o = W.orbs.find((q) => q.id === plan.target);
      return o && plan.mode === 'snipe' ? { x: o.x, z: o.z, vx: o.vx, vz: o.vz, r: 0.7 } : null;
    }
    const r = W.rocks.find((q) => q.id === plan.target);
    return r || null;
  }

  // is there a rock (or the foe) straight ahead within shot range?
  lineOfFire(W) {
    const s = this.ship;
    const [fx, fz] = fwd(s.a);
    for (const r of W.rocks) {
      const px = dX(s.x, r.x), pz = dZ(s.z, r.z);
      const along = px * fx + pz * fz;
      if (along < 0 || along > 34) continue;
      if (Math.abs(px * fz - pz * fx) < r.r) return true;
    }
    return false;
  }
}

const ORB_NAMES = { triple: 'TRIPLE SHOT', rapid: 'RAPID FIRE', shield: 'SHIELD', missiles: 'MISSILES', magnet: 'MAGNET', repair: 'REPAIR', nova: 'NOVA BOMB', phase: 'PHASE', chrono: 'CHRONO', drone: 'DRONE', mines: 'MINES', rail: 'RAILGUN', well: 'GRAVITY WELL' };
const orbName = (k) => ORB_NAMES[k] || 'POWER-UP';

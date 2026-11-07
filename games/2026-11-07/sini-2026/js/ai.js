// Autopilot: flies a Prospector from the world state alone, through the same controls a player has.
// It always has ONE goal it can say in a sentence (debug.intent) and one thing it is going for (debug.target),
// so the demo can show what it is doing:
//   MINE     shoot an asteroid for crystals until the rack holds enough charges for the construct
//   COLLECT  scoop a loose crystal                THIEF   shoot a gatherer carrying a crystal (while short of charges)
//   FIGHT    turn and fight a reaver that is on it
//   STALK    rack ready: wait near the construct until it is half built
//   STRIKE   rack ready and the construct half built: launch a charge to wake it early (fewer charges needed)
//   ATTACK   it is awake: circle at charge range and launch charges
//   REARM    out of charges in the fight: mine well away from it
// On top of the goal a safety layer dodges bolts, jinks before a reaver fires, and runs from the construct's
// pull and lunge (debug.dodge says which).
//   'human' — plays like a person: ~0.35 s reaction (scattered, sometimes late, slower when busy or when the threat is
//             off to the side), often misses threats behind it, sometimes dodges the wrong way first, wobbly aim.
//             The difficulty ramp is measured with this one (scripts/sini-2026/ramp_check.mjs).
//   'demo'  — the attract mode: sharp and decisive. It never reads the world's random generator (replays stay exact).
import { F } from './config.js?v=2';
import { wd, isAwake, angDiff, canStrike, strikeHP, coreOpen } from './sim.js?v=2';

const hyp = Math.hypot;
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PROFILES = {
  human: { react: 0.35, jit: 0.12, late: 0.16, lateT: 0.3, blind: 0.4, track: 7, aimErr: 0.07, stickWob: 0.1, dodge: 2.4, bombRange: 52, stock: 2, fear: 24, busy: 0.22, side: 0.2, wrong: 0.16 },
  demo: { react: 0.14, jit: 0.04, late: 0, lateT: 0, blind: 0.05, track: 12, aimErr: 0.025, stickWob: 0.03, dodge: 3.0, bombRange: 60, stock: 1, fear: 22, busy: 0, side: 0, wrong: 0 },
};
// stick strength: under 0.3 the ship only turns; 0.3..1 thrusts from nothing to full
const TURN = 0.2, thr = (k) => 0.3 + 0.7 * Math.max(0, Math.min(1, k));

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.r = mkr(seed * 7919 + 13);
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.seen = new Map();
    this.goal = null; this.goalT = 0; this.wob = 0; this.wobT = 0;
    this.debug = { mode: 'start', intent: '', target: null, dodge: '' };
    this.bombGap = 0; this.lastBomb = false; this.wrongs = new Map(); this.busy = false;
    this.mode = 'mine'; this.modeT = 0;
  }
  // has the pilot noticed thing `id` yet? Busy pilots, and threats off to the side or behind, are noticed later.
  notice(W, id, x, z, me) {
    let t = this.seen.get(id);
    if (t === undefined) {
      const P = this.P;
      const dx = wd(x - me.x), dz = wd(z - me.z);
      const off = Math.abs(angDiff(me.a, Math.atan2(dz, dx)));
      let d = P.react + (this.r() * 2 - 1) * P.jit + (this.r() < P.late ? P.lateT : 0);
      if (this.busy) d += P.busy * this.r();
      if (off > 1.1) d += P.side * this.r();
      if (off > 1.9 && this.r() < P.blind) d += 0.45 + this.r() * 0.5;
      t = W.t + d;
      this.seen.set(id, t);
    }
    return W.t >= t;
  }
  // pick the goal (re-thought a few times a second; a goal sticks for a moment so the ship doesn't dither)
  choose(W, me, ctx) {
    const { C, awake, crystal, foe, thief, need, cd } = ctx;
    const full = me.bombs >= F.maxBombs;
    if (awake) {
      // while its core is shut (or it is still waking) the charges are no use: deal with a reaver that is on us
      if (foe && !coreOpen(C)) return 'fight';
      if (me.bombs > 0) return 'attack';
      if (crystal) return 'collect';
      return 'rearm';
    }
    if (crystal && !full) return 'collect';
    if (foe) return 'fight';
    if (C && canStrike(W) && me.bombs >= strikeHP(W) + 1 + this.P.stock) return 'strike';
    if (thief && me.bombs < need) return 'thief';
    // enough to strike but it is not half built yet: stock spare charges for the fight (interceptions, misses), then wait by it
    if (C && C.st === 'build' && (me.bombs >= Math.min(F.maxBombs, need + 5) || full)) return 'stalk';
    void cd;
    return 'mine';
  }
  control(W, me) {
    const out = { mx: 0, mz: 0, fire: false, bomb: false };
    const D = this.debug;
    if (!me.alive) { D.intent = 'Waiting to warp back in'; D.target = null; D.mode = 'dead'; return out; }
    if (this.seen.size > 600) { for (const [k, v] of this.seen) if (v < W.t - 20) this.seen.delete(k); }
    const P = this.P, C = W.C, dt = 1 / 120;
    const awake = isAwake(C) && C.st !== 'dying';
    const rel = (o) => { const dx = wd(o.x - me.x), dz = wd(o.z - me.z); return [dx, dz, hyp(dx, dz)]; };
    const cdx = C ? wd(C.x - me.x) : 0, cdz = C ? wd(C.z - me.z) : 0, cd = C ? hyp(cdx, cdz) || 1 : 1e9;
    const enemiesNear = W.enemies.filter((e) => e.hp > 0 && e.born <= 0).map((e) => [e, ...rel(e)]).sort((a, b) => a[3] - b[3]).slice(0, P.track);
    const need = (C && C.st === 'build' ? strikeHP(W) + 1 : W.R.kill) + P.stock;   // +1: the charge that wakes it does no damage
    // the nearest loose crystal worth fetching
    let crystal = null, crd = 1e9;
    for (const c of W.crystals) {
      if (c.held || c.life < 0.6) continue;
      const [, , d] = rel(c);
      if (d < (awake ? 30 : 46) && d < crd && (!awake || hyp(wd(c.x - C.x), wd(c.z - C.z)) > P.fear + 8)) { crd = d; crystal = c; }
    }
    let foe = null;
    for (const [e, , , d] of enemiesNear) if (e.type === 'reaver' && d < 26 && (e.role === 'hunt' || d < 14)) { foe = e; break; }
    let thief = null;
    for (const q of W.enemies) if (q.type === 'gath' && q.carry && q.hp > 0 && q.born <= 0) { const d = rel(q)[2]; if (d < 70 && (!thief || d < thief.d)) thief = { e: q, d }; }

    this.modeT -= dt;
    // a goal whose target is gone, or that no longer makes sense, is dropped at once
    const m0 = this.mode;
    const stale = (m0 === 'collect' && !crystal) || (m0 === 'fight' && (!foe || (awake && coreOpen(C) && me.bombs > 0))) || (m0 === 'thief' && !thief) || (m0 === 'attack' && (!awake || me.bombs <= 0))
      || (m0 === 'strike' && !(C && canStrike(W))) || (m0 === 'stalk' && !(C && C.st === 'build')) || ((m0 === 'mine' || m0 === 'rearm') && awake && me.bombs > 0) || (m0 === 'rearm' && !awake);
    if (stale) this.modeT = 0;
    if (this.modeT <= 0) {
      const m = this.choose(W, me, { C, awake, crystal, foe, thief: thief && thief.e, need, cd });
      if (m !== this.mode) { this.mode = m; this.goal = null; }
      this.modeT = this.profile === 'demo' ? 0.3 : 0.4;
    }
    const mode = this.mode;
    this.busy = mode === 'mine' || mode === 'fight' || mode === 'thief' || mode === 'attack' || mode === 'rearm';
    D.mode = mode; D.need = need;

    let sx = 0, sz = 0, faceA = null, fireOK = false;
    const go = (dx, dz, k) => { const l = hyp(dx, dz) || 1; sx = (dx / l) * thr(k); sz = (dz / l) * thr(k); };
    const turnTo = (a) => { sx = Math.cos(a) * TURN; sz = Math.sin(a) * TURN; faceA = a; };

    switch (mode) {
      case 'collect': {
        const [dx, dz, d] = rel(crystal);
        go(dx + crystal.vx * 0.3, dz + crystal.vz * 0.3, d < 6 ? 0.5 : 1);
        D.target = { x: crystal.x, z: crystal.z, r: 1.4, kind: 'crystal' };
        D.intent = awake ? `Grabbing a crystal to re-arm (${me.bombs} charges)` : me.bombs >= need ? `Scooping a crystal for a spare charge (${me.bombs}/${Math.min(F.maxBombs, need + 5)})` : `Scooping a crystal (${me.bombs} of the ${need} charges it wants)`;
        break;
      }
      case 'fight': case 'thief': {
        const e = mode === 'fight' ? foe : thief ? thief.e : null;
        if (!e) { this.modeT = 0; break; }
        const [dx, dz, d] = rel(e);
        const tt = d / F.shotV, a = Math.atan2(dz + e.vz * tt, dx + e.vx * tt);
        const keep = mode === 'fight' ? 12 : 5;
        if (Math.abs(angDiff(me.a, a)) > 0.5 || d < keep) turnTo(a); else go(Math.cos(a), Math.sin(a), d > 20 ? 0.8 : 0.3);
        faceA = a; fireOK = d < 34;
        D.target = { x: e.x, z: e.z, r: e.r + 1, kind: 'enemy' };
        D.intent = mode === 'fight' ? (awake ? 'Core shut: shooting down a reaver until it opens again' : 'A reaver is on it: turning to shoot it down') : `Shooting down a gatherer before it reaches the construct (${me.bombs} of ${need} charges)`;
        break;
      }
      case 'stalk': {
        // wait off the construct's flank, nose on it, until it is half built
        const a = Math.atan2(cdz, cdx), hold = 58;
        if (cd > hold + 10) go(cdx, cdz, 1);
        else if (cd < hold - 12) go(-cdx, -cdz, 0.4);
        else turnTo(a);
        D.target = { x: C.x, z: C.z, r: C.R + 3, kind: 'construct' };
        const half = Math.ceil(C.N / 2);
        D.intent = `Rack ready (${me.bombs}): waiting by the construct until it is half built (${C.pieces}/${half} plates)`;
        break;
      }
      case 'strike': {
        const a = Math.atan2(cdz, cdx);
        if (cd > 48) go(cdx, cdz, 1); else turnTo(a);
        // ONE charge wakes it; more would only bounce off its armour while it wakes
        const flying = W.bombs.some((b) => b.pid === me.id);
        if (!flying && cd < 70 && Math.abs(angDiff(me.a, a)) < 0.45 && this.bombGap <= 0) { out.bomb = !this.lastBomb; this.bombGap = 0.6; }
        D.target = { x: C.x, z: C.z, r: C.R + 3, kind: 'construct' };
        D.intent = `Striking early: one charge wakes the half-built construct, then ${strikeHP(W)} more into its open core bring it down`;
        break;
      }
      case 'attack': {
        // keep it at charge range: in, round it, out again; launch when the nose comes round
        const ideal = Math.max(P.fear + 10, Math.min(P.bombRange - 8, 36));
        const a = Math.atan2(cdz, cdx);
        const radial = cd > ideal + 6 ? 1 : cd < ideal - 6 ? -1 : 0;
        go(Math.cos(a) * radial + Math.cos(a + Math.PI / 2) * 0.85, Math.sin(a) * radial + Math.sin(a + Math.PI / 2) * 0.85, 1);
        // a charge must arrive while the core is still open (the human guesses the time left a little wrong)
        const travel = cd / 30 + 0.25, left = C.cyc === 'open' ? C.cycT + (this.profile === 'demo' ? 0 : (this.r() - 0.5) * 1.2) : -1;
        const open = coreOpen(C) && left > travel;
        if (open && cd < P.bombRange && this.bombGap <= 0 && (Math.abs(angDiff(me.a, a)) < 1.3 || cd < 30)) { out.bomb = !this.lastBomb; this.bombGap = this.profile === 'demo' ? 0.5 : 0.62 + this.r() * 0.3; }
        D.target = { x: C.x, z: C.z, r: C.R + 3, kind: 'construct' };
        D.intent = C.st === 'wake' ? `It is waking and armoured: keeping range until its core opens (${C.hp} to go)`
          : coreOpen(C) ? `Core OPEN: launching charges (${C.hp} to go, ${me.bombs} in the rack)` : `Core shut, charges would bounce off: circling until it opens (${C.cycT.toFixed(1)} s)`;
        break;
      }
      default: { // mine / rearm
        let rock = this.goal && this.goal.kind === 'rock' ? W.rocks.find((q) => q.id === this.goal.id && q.ore > 0) : null;
        if (!rock) {
          let best = null, bs = 1e9;
          for (const q of W.rocks) {
            if (q.ore <= 0) continue;
            const [, , d] = rel(q);
            let s = d - q.ore * 3;
            if (C && (awake || mode === 'rearm')) { const dc = hyp(wd(q.x - C.x), wd(q.z - C.z)); if (dc < P.fear + q.r + 14) s += 400; }
            if (s < bs) { bs = s; best = q; }
          }
          rock = best; this.goal = rock ? { kind: 'rock', id: rock.id } : null;
        }
        if (rock) {
          const [dx, dz, d] = rel(rock);
          const a = Math.atan2(dz, dx), gap = d - rock.r;
          if (gap > 18) go(dx, dz, 1);
          else if (gap > 13) go(dx, dz, 0.15);
          else if (gap < 5) go(-dx, -dz, 0.35);
          else turnTo(a);
          faceA = a; fireOK = gap < 24 && Math.abs(angDiff(me.a, a)) < 0.25;
          const left = Math.max(0, W.R.chip - rock.hits);
          D.target = { x: rock.x, z: rock.z, r: rock.r + 1.5, kind: 'rock' };
          const spare = Math.min(F.maxBombs, need + 5);
          D.intent = mode === 'rearm' ? `Out of charges: mining well away from the construct (${C ? C.hp : 0} still needed)`
            : me.bombs >= need ? `Enough to strike; stocking spare charges for the fight while it builds (${me.bombs}/${spare}) · ${left} more hit${left === 1 ? '' : 's'} for the next crystal`
            : `Mining an asteroid: ${left} more hit${left === 1 ? '' : 's'} knocks a crystal loose (${me.bombs} of ${need} charges)`;
        } else { go(Math.cos(W.t * 0.2), Math.sin(W.t * 0.2), 0.5); D.intent = 'Looking for asteroids with crystals left'; D.target = null; }
      }
    }
    this.bombGap -= dt;
    if (!C || C.st === 'gone') D.intent = W.mode === 'deep' ? 'Construct down: heading on while the next one is started' : 'Construct down: sector clear';
    else if (C.st === 'dying') D.intent = 'Construct breaking up: keeping clear of the blast';

    // ---------------------------------------------------------------- staying alive
    let ex = 0, ez = 0;
    D.dodge = '';
    if (awake) {
      const dl = P.fear + (C.st === 'pull' || C.st === 'tell' ? 14 : 0);
      if (this.notice(W, 'c' + C.st + Math.floor(C.t), C.x, C.z, me) || cd < dl) {
        if (cd < dl + 10) { const k = (dl + 10 - cd) / 10; ex -= (cdx / cd) * k * 3; ez -= (cdz / cd) * k * 3; D.dodge = 'Keeping away from the construct'; }
        if (C.st === 'pull' || C.st === 'tell') { ex -= (cdx / cd) * 2.5; ez -= (cdz / cd) * 2.5; D.dodge = C.st === 'tell' ? 'Tractor pull coming: running before it starts' : 'Flying straight out of the tractor pull'; }
        if (C.st === 'ltell' || C.st === 'lunge') {
          const la = C.st === 'lunge' ? Math.atan2(C.lz, C.lx) : Math.atan2(cdz, cdx) + Math.PI;
          const s = Math.sin(angDiff(la, Math.atan2(-cdz, -cdx))) >= 0 ? 1 : -1;
          ex += Math.cos(la + s * Math.PI / 2) * 3; ez += Math.sin(la + s * Math.PI / 2) * 3; D.dodge = 'Sidestepping out of the lunge lane';
        }
      }
    }
    for (const b of W.bolts) {
      if (b.ab) continue;
      const [dx, dz, d] = rel(b);
      if (d > 34 || !this.notice(W, 'b' + b.id, b.x, b.z, me)) continue;
      const rvx = b.vx - me.vx, rvz = b.vz - me.vz, rv2 = rvx * rvx + rvz * rvz || 1;
      const tc = -(dx * rvx + dz * rvz) / rv2;
      if (tc < 0 || tc > 1.3) continue;
      const mx = dx + rvx * tc, mz = dz + rvz * tc;
      if (hyp(mx, mz) > P.dodge + F.r) continue;
      const bl = hyp(b.vx, b.vz) || 1, px = -b.vz / bl, pz = b.vx / bl;
      let s = (mx * px + mz * pz) > 0 ? -1 : 1;
      let wr = this.wrongs.get(b.id);
      if (wr === undefined) { wr = this.r() < P.wrong; this.wrongs.set(b.id, wr); if (this.wrongs.size > 200) this.wrongs.clear(); }
      if (wr && tc > 0.45) s = -s;
      const w = 3.5 * (1 - tc / 1.3);
      ex += px * s * w; ez += pz * s * w; D.dodge = 'Dodging a bolt';
    }
    for (const [e, dx, dz, d] of enemiesNear) {
      if (e.type !== 'reaver' || e.tell <= 0 || d > 40) continue;
      if (!this.notice(W, 't' + e.id + ':' + Math.floor(e.t * 0.4), e.x, e.z, me)) continue;
      if (e.tell < 0.45) { const px = -dz / d, pz = dx / d, s = ((me.vx * px + me.vz * pz) >= 0) ? 1 : -1; ex += px * s * 1.6; ez += pz * s * 1.6; D.dodge = 'A reaver is about to fire: jinking off its line'; }
    }
    for (const q of W.rocks) {
      const [dx, dz, d] = rel(q);
      const gap = d - q.r - F.r, sp = hyp(me.vx, me.vz);
      if (gap > 9 || sp < 4) continue;
      if ((dx * me.vx + dz * me.vz) / (d * sp) < 0.6) continue;
      ex -= (dx / d) * (1 - gap / 9) * 1.4; ez -= (dz / d) * (1 - gap / 9) * 1.4;
    }

    // ---------------------------------------------------------------- blend into a stick
    const el = hyp(ex, ez);
    if (el > 0.05) { sx += ex; sz += ez; const l = hyp(sx, sz); if (l < 0.35) { sx *= 0.35 / l; sz *= 0.35 / l; } }
    this.wobT -= dt;
    if (this.wobT <= 0) { this.wobT = 0.3 + this.r() * 0.4; this.wob = (this.r() * 2 - 1) * P.aimErr; }
    let l = hyp(sx, sz);
    if (l > 1e-6) {
      const a = Math.atan2(sz, sx) + this.wob;
      l = Math.min(1, l) * (1 - P.stickWob * this.r() * (l > 0.3 ? 1 : 0.2));
      out.mx = Math.cos(a) * l; out.mz = Math.sin(a) * l;
    }
    const ahead = this.lineAhead(W, me);
    out.fire = (fireOK && (mode === 'mine' || mode === 'rearm' || ahead !== 'clear')) || ahead === 'enemy';
    if (faceA !== null && (mode === 'fight' || mode === 'thief') && Math.abs(angDiff(me.a, faceA)) < 0.12) out.fire = true;
    this.lastBomb = out.bomb;
    return out;
  }
  // what the cannons would hit straight ahead
  lineAhead(W, me) {
    const c = Math.cos(me.a), s = Math.sin(me.a);
    let best = 'clear', bd = 36;
    const check = (x, z, r, kind) => {
      const dx = wd(x - me.x), dz = wd(z - me.z);
      const along = dx * c + dz * s;
      if (along < 0 || along > bd) return;
      if (Math.abs(-dx * s + dz * c) < r + 0.4) { bd = along; best = kind; }
    };
    for (const e of W.enemies) if (e.hp > 0) check(e.x, e.z, e.r + 0.3, 'enemy');
    for (const q of W.rocks) check(q.x, q.z, q.r, 'rock');
    return best;
  }
}

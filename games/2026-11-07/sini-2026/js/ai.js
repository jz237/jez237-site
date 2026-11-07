// Autopilot: flies a Prospector from the world state alone, through the same controls a player has.
//   'human' — plays like a person: ~0.35 s reaction (scattered, sometimes late), notices only what is near,
//             often misses threats behind it, a wobbly aim and a stick that is never quite still.
//             The difficulty ramp is measured with this one (scripts/sini-2026/ramp_check.mjs).
//   'demo'  — the attract mode: sharp, plays with intent, stockpiles charges and takes the construct
//             down in style. It never reads the random generator of the world (replays stay exact).
import { F, ENEMY } from './config.js?v=1';
import { wd, isAwake, angDiff } from './sim.js?v=1';

const hyp = Math.hypot;
const TAU = Math.PI * 2;
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PROFILES = {
  human: { react: 0.35, jit: 0.12, late: 0.16, lateT: 0.3, blind: 0.4, track: 7, aimErr: 0.07, stickWob: 0.1, dodge: 2.4, bombRange: 52, stock: 2, fear: 24, busy: 0.22, side: 0.2, wrong: 0.16 },
  demo: { react: 0.14, jit: 0.04, late: 0, lateT: 0, blind: 0.05, track: 12, aimErr: 0.025, stickWob: 0.03, dodge: 3.0, bombRange: 60, stock: 3, fear: 22, busy: 0, side: 0, wrong: 0 },
};

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.r = mkr(seed * 7919 + 13);
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.seen = new Map();      // things noticed: id -> time they will be acted on
    this.goal = null; this.goalT = 0; this.wob = 0; this.wobT = 0;
    this.debug = { mode: 'start' };
    this.bombGap = 0; this.lastT = 0; this.stuckT = 0; this.wrongs = new Map(); this.busy = false;
  }
  // has the pilot noticed thing `id` (that appeared now-ish) yet? Behind the ship it is often missed.
  notice(W, id, x, z, me) {
    let t = this.seen.get(id);
    if (t === undefined) {
      const P = this.P;
      const dx = wd(x - me.x), dz = wd(z - me.z);
      const off = Math.abs(angDiff(me.a, Math.atan2(dz, dx)));
      const behind = off > 1.9;
      let d = P.react + (this.r() * 2 - 1) * P.jit + (this.r() < P.late ? P.lateT : 0);
      // a pilot busy mining or lining up a shot notices threats later, more so off to the side
      if (this.busy) d += P.busy * this.r();
      if (off > 1.1) d += P.side * this.r();
      if (behind && this.r() < P.blind) d += 0.45 + this.r() * 0.5;
      t = W.t + d;
      this.seen.set(id, t);
    }
    return W.t >= t;
  }
  control(W, me) {
    const out = { mx: 0, mz: 0, fire: false, bomb: false };
    if (!me.alive) return out;
    if (this.seen.size > 600) { for (const [k, v] of this.seen) if (v < W.t - 20) this.seen.delete(k); }
    const P = this.P, C = W.C, R = W.R;
    const awake = isAwake(C) && C.st !== 'dying';
    let mvx = 0, mvz = 0, faceA = null, fireOK = false, want = 1;
    const rel = (o) => { const dx = wd(o.x - me.x), dz = wd(o.z - me.z); return [dx, dz, hyp(dx, dz)]; };

    // ---------------------------------------------------------------- what to do
    this.goalT -= 1 / 120;
    const enemiesNear = W.enemies.filter((e) => e.hp > 0 && e.born <= 0).map((e) => [e, ...rel(e)]).sort((a, b) => a[3] - b[3]).slice(0, P.track);
    let mode = 'mine';
    const cdx = C ? wd(C.x - me.x) : 0, cdz = C ? wd(C.z - me.z) : 0, cd = C ? hyp(cdx, cdz) : 1e9;
    const need = awake ? C.hp : (C ? R.kill : 0) + P.stock;
    // free crystals close by
    let crystal = null, crd = 1e9;
    for (const c of W.crystals) {
      if (c.held || c.life < 0.6) continue;
      const [dx, dz, d] = rel(c);
      const lim = awake ? 30 : 46;
      if (d < lim && d < crd && (!awake || hyp(wd(c.x - C.x), wd(c.z - C.z)) > P.fear + 6)) { crd = d; crystal = c; }
    }
    // a hunting reaver close in
    let foe = null;
    for (const [e, , , d] of enemiesNear) if (e.type === 'reaver' && d < 30 && (e.role === 'hunt' || d < 14)) { foe = e; break; }
    // a gatherer carrying a crystal
    let thief = null;
    for (const [e, , , d] of enemiesNear) if (e.type === 'gath' && e.carry && d < 40) { thief = e; break; }

    if (awake) {
      if (me.bombs > 0 && C.st !== 'wake') mode = 'attack';
      else if (crystal) mode = 'collect';
      else if (foe) mode = 'fight';
      else mode = 'mine';
    } else {
      if (crystal && me.bombs < F.maxBombs) mode = 'collect';
      else if (foe) mode = 'fight';
      else if (thief) mode = 'thief';
      else mode = 'mine';
      // the demo shows a charge knocking plates off a half-built construct now and then
      if (this.profile === 'demo' && C && C.st === 'build' && me.bombs > need + 2 && cd < 70 && C.pieces > C.N * 0.6) mode = 'harass';
    }
    this.debug.mode = mode; this.debug.need = need;
    this.busy = mode === 'mine' || mode === 'fight' || mode === 'thief' || mode === 'attack';

    if (mode === 'collect') {
      const [dx, dz] = rel(crystal);
      // aim a little ahead of a drifting crystal
      mvx = dx + crystal.vx * 0.3; mvz = dz + crystal.vz * 0.3; want = 1;
      this.debug.crystal = crd;
    } else if (mode === 'fight' || mode === 'thief') {
      const e = mode === 'fight' ? foe : thief;
      const [dx, dz, d] = rel(e);
      const tt = d / F.shotV;
      faceA = Math.atan2(dz + e.vz * tt, dx + e.vx * tt);
      // close in on a gatherer; keep some room from a reaver
      const keep = mode === 'fight' ? 12 : 4;
      const k = d > keep ? 1 : -0.4;
      mvx = Math.cos(faceA) * k; mvz = Math.sin(faceA) * k;
      want = mode === 'fight' ? 0.75 : 1;
      fireOK = d < 34;
    } else if (mode === 'mine') {
      let rock = this.goal && this.goal.kind === 'rock' ? W.rocks.find((q) => q.id === this.goal.id && q.ore > 0) : null;
      if (!rock || this.goalT <= 0) {
        let best = null, bs = 1e9;
        for (const q of W.rocks) {
          if (q.ore <= 0) continue;
          const [, , d] = rel(q);
          let s = d - q.ore * 3;
          if (awake) { const dc = hyp(wd(q.x - C.x), wd(q.z - C.z)); if (dc < P.fear + q.r + 10) s += 400; }
          if (s < bs) { bs = s; best = q; }
        }
        rock = best; this.goal = rock ? { kind: 'rock', id: rock.id } : null; this.goalT = 2.5;
      }
      if (rock) {
        const [dx, dz, d] = rel(rock);
        const a = Math.atan2(dz, dx), gap = d - rock.r;
        faceA = a;
        if (gap > 16) { mvx = dx; mvz = dz; want = 1; }
        else if (gap > 7) { mvx = dx; mvz = dz; want = 0.35; }
        else { mvx = -dx; mvz = -dz; want = 0.05; }
        fireOK = gap < 26;
      } else { mvx = Math.cos(W.t * 0.2); mvz = Math.sin(W.t * 0.2); want = 0.5; }
    } else if (mode === 'attack' || mode === 'harass') {
      // keep the construct at bomb range: in, then round it, then out again
      const ideal = mode === 'harass' ? 40 : Math.max(P.fear + 10, Math.min(P.bombRange - 8, 36));
      const a = Math.atan2(cdz, cdx);
      const radial = cd > ideal + 6 ? 1 : cd < ideal - 6 ? -1 : 0;
      const tang = 0.85;
      mvx = Math.cos(a) * radial + Math.cos(a + Math.PI / 2) * tang;
      mvz = Math.sin(a) * radial + Math.sin(a + Math.PI / 2) * tang;
      want = 1;
      if (cd < P.bombRange && this.bombGap <= 0 && me.bombs > 0 && (mode === 'attack' || this.r() < 0.02)) {
        // wait for the nose to come round toward it: charges launch forward
        const da = Math.abs(angDiff(me.a, a));
        if (da < 1.3 || mode === 'attack' && cd < 30) { out.bomb = !this.lastBomb; this.bombGap = this.profile === 'demo' ? 0.5 : 0.62 + this.r() * 0.3; }
      }
    }
    this.bombGap -= 1 / 120;

    // ---------------------------------------------------------------- staying alive
    let ex = 0, ez = 0;
    if (awake) {
      // the construct: never let it get close, run from its pull, sidestep a lunge
      const dl = P.fear + (C.st === 'pull' || C.st === 'tell' ? 14 : 0);
      if (this.notice(W, 'c' + C.st + Math.floor(C.t), C.x, C.z, me) || cd < dl) {
        if (cd < dl + 10) { const k = (dl + 10 - cd) / 10; ex -= (cdx / cd) * k * 3; ez -= (cdz / cd) * k * 3; }
        if (C.st === 'pull' || C.st === 'tell') { ex -= (cdx / cd) * 2.5; ez -= (cdz / cd) * 2.5; }
        if (C.st === 'ltell' || C.st === 'lunge') {
          const la = C.st === 'lunge' ? Math.atan2(C.lz, C.lx) : Math.atan2(cdz, cdx) + Math.PI;
          const s = Math.sin(angDiff(la, Math.atan2(-cdz, -cdx))) >= 0 ? 1 : -1;
          ex += Math.cos(la + s * Math.PI / 2) * 3; ez += Math.sin(la + s * Math.PI / 2) * 3;
        }
      }
    }
    // bolts on a collision course (seen after the reaction time)
    for (const b of W.bolts) {
      if (b.ab) continue;
      const [dx, dz, d] = rel(b);
      if (d > 34) continue;
      if (!this.notice(W, 'b' + b.id, b.x, b.z, me)) continue;
      const rvx = b.vx - me.vx, rvz = b.vz - me.vz, rv2 = rvx * rvx + rvz * rvz || 1;
      const tc = -(dx * rvx + dz * rvz) / rv2;
      if (tc < 0 || tc > 1.3) continue;
      const mx = dx + rvx * tc, mz = dz + rvz * tc, miss = hyp(mx, mz);
      if (miss > P.dodge + F.r) continue;
      // move across the bolt's path, away from where it will pass
      const bl = hyp(b.vx, b.vz) || 1, px = -b.vz / bl, pz = b.vx / bl;
      let s = (mx * px + mz * pz) > 0 ? -1 : 1;
      let wr = this.wrongs.get(b.id);
      if (wr === undefined) { wr = this.r() < P.wrong; this.wrongs.set(b.id, wr); if (this.wrongs.size > 200) this.wrongs.clear(); }
      if (wr && tc > 0.45) s = -s;
      const w = 3.5 * (1 - tc / 1.3);
      ex += px * s * w; ez += pz * s * w;
    }
    // a reaver whose emitter is lit and aimed at us: jink before it fires
    for (const [e, dx, dz, d] of enemiesNear) {
      if (e.type !== 'reaver' || e.tell <= 0 || d > 40) continue;
      if (!this.notice(W, 't' + e.id + ':' + Math.floor(e.t * 0.4), e.x, e.z, me)) continue;
      if (e.tell < 0.45) { const px = -dz / d, pz = dx / d, s = ((me.vx * px + me.vz * pz) >= 0) ? 1 : -1; ex += px * s * 1.6; ez += pz * s * 1.6; }
    }
    // rocks dead ahead at speed
    for (const q of W.rocks) {
      const [dx, dz, d] = rel(q);
      const gap = d - q.r - F.r;
      if (gap > 9) continue;
      const sp = hyp(me.vx, me.vz);
      if (sp < 4) continue;
      const toward = (dx * me.vx + dz * me.vz) / (d * sp);
      if (toward < 0.6) continue;
      ex -= (dx / d) * (1 - gap / 9) * 1.4; ez -= (dz / d) * (1 - gap / 9) * 1.4;
    }

    // ---------------------------------------------------------------- blend into a stick
    let sx = mvx, sz = mvz;
    const ml = hyp(sx, sz);
    if (ml > 1e-6) { sx = (sx / ml) * want; sz = (sz / ml) * want; }
    const el = hyp(ex, ez);
    if (el > 0.05) { sx += ex; sz += ez; faceA = null; }
    // to shoot something, the nose has to point at it: turn with a light touch when not escaping
    if (faceA !== null && el <= 0.05) {
      const k = Math.max(0.16, Math.min(1, hyp(sx, sz)));
      sx = Math.cos(faceA) * k; sz = Math.sin(faceA) * k;
      // a pilot who is already close keeps coasting instead of thrusting into it
      if (want < 0.1) { sx *= 0.9; sz *= 0.9; }
    }
    // a stick is never perfectly still
    this.wobT -= 1 / 120;
    if (this.wobT <= 0) { this.wobT = 0.3 + this.r() * 0.4; this.wob = (this.r() * 2 - 1) * P.aimErr; }
    let l = hyp(sx, sz);
    if (l > 1e-6) {
      const a = Math.atan2(sz, sx) + this.wob;
      l = Math.min(1, l) * (1 - P.stickWob * this.r());
      out.mx = Math.cos(a) * l; out.mz = Math.sin(a) * l;
    }
    // fire when the nose is on target (the rock or the machine we were turning toward)
    if (fireOK || mode === 'collect' || mode === 'attack') {
      const ahead = this.lineAhead(W, me);
      out.fire = fireOK ? ahead !== 'clear' || mode === 'mine' : ahead === 'enemy';
    }
    if (mode === 'mine' && fireOK) out.fire = true;
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
      const off = Math.abs(-dx * s + dz * c);
      if (off < r + 0.4) { bd = along; best = kind; }
    };
    for (const e of W.enemies) if (e.hp > 0) check(e.x, e.z, e.r + 0.3, 'enemy');
    for (const q of W.rocks) check(q.x, q.z, q.r, 'rock');
    return best;
  }
}
void ENEMY; void TAU;

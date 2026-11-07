// Autopilot. Every so often it re-reads the room (as it looked `react` seconds ago, so a human-like pilot
// cannot see a bolt fired a moment ago), scores 16 run directions plus standing still against every
// wall, bolt, robot, aim glint, mine, boss tell and the Seeker over the next second, adds where it wants
// to be (a door on the way to the lift, a firing spot, the lift pad) from a walk map of the room, and
// runs the best one while it aims and fires.
//   profile 'human': ~0.35 s reaction with scatter, sometimes late, a limited aim swing, tracks only
//                    the nearest few threats, misses things behind it, the odd poor choice
//   profile 'demo' : quick, accurate, uses EMP and dash well: the attract mode and the AI playthrough
import { F, ROOM, ENEMY, SEEKER, ATTACK, BOSSES, STEP } from './config.js?v=9';
import { wallNear, los, routeSide, inZone, angDiff, nearestWall, atkOf } from './sim.js?v=9';

const PROFILES = {
  human: { react: 0.35, jit: 0.1, late: 0.14, lateT: 0.25, slew: 5.5, aim: 0.05, drift: 0.035, track: 7, blind: 0.35, fireRange: 16, greed: 0.75, leaveAt: 0.7, empP: 0.55, dashP: 0.35, noise: 0.18, margin: 1.0 },
  demo: { react: 0.08, jit: 0.02, late: 0, lateT: 0, slew: 16, aim: 0.01, drift: 0, track: 60, blind: 0, fireRange: 20, greed: 1, leaveAt: 0.78, empP: 1, dashP: 1, noise: 0, margin: 1.25 },
};
const { RW, RH, door: DOOR } = ROOM;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;
const SAMPLES = [0.1, 0.2, 0.4, 0.6, 0.85];
const PDT = 0.05, PATH_N = 20, PX = new Float64Array(PATH_N), PZ = new Float64Array(PATH_N), PW = new Float64Array(PATH_N);
const DIRS = [];
for (let i = 0; i < 16; i++) DIRS.push([Math.cos((i / 16) * Math.PI * 2), Math.sin((i / 16) * Math.PI * 2)]);
DIRS.push([0, 0]);
// distance along a ray to the first wall (walls grown by pad), up to L
function rayHit(walls, x, z, ux, uz, L, pad) {
  let best = L;
  for (const w of walls) {
    const x0 = w[0] - pad, z0 = w[1] - pad, x1 = w[2] + pad, z1 = w[3] + pad;
    let t0 = 0, t1 = best;
    if (Math.abs(ux) < 1e-9) { if (x < x0 || x > x1) continue; } else { let a = (x0 - x) / ux, b = (x1 - x) / ux; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
    if (Math.abs(uz) < 1e-9) { if (z < z0 || z > z1) continue; } else { let a = (z0 - z) / uz, b = (z1 - z) / uz; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
    if (t0 < best) best = t0;
  }
  return best;
}
function mk(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ------------------------------------------------------------------ the walk map of a room
const NC = 0.5, X0 = -RW - 2.5, Z0 = -RH - 2.5, NX = Math.round((2 * RW + 5) / NC), NZ = Math.round((2 * RH + 5) / NC);
const cellOf = (x, z) => { const i = Math.floor((x - X0) / NC), k = Math.floor((z - Z0) / NC); return i < 0 || k < 0 || i >= NX || k >= NZ ? -1 : k * NX + i; };
const cx = (c) => X0 + ((c % NX) + 0.5) * NC, cz = (c) => Z0 + (((c / NX) | 0) + 0.5) * NC;
function buildNav(room) {
  const free = new Uint8Array(NX * NZ), walls = room.walls, d = room.doors, h = DOOR / 2 - 0.55;
  for (let k = 0; k < NZ; k++) for (let i = 0; i < NX; i++) {
    const x = X0 + (i + 0.5) * NC, z = Z0 + (k + 0.5) * NC;
    const inside = Math.abs(x) < RW && Math.abs(z) < RH;
    const corridor = (x > RW - 0.1 && d.e === 1 && Math.abs(z) < h) || (x < -RW + 0.1 && d.w === 1 && Math.abs(z) < h) || (z > RH - 0.1 && d.s === 1 && Math.abs(x) < h) || (z < -RH + 0.1 && d.n === 1 && Math.abs(x) < h);
    if (!inside && !corridor) continue;
    if (wallNear(walls, x, z, F.r + 0.2)) continue;
    free[k * NX + i] = 1;
  }
  return free;
}
// distances (in tenths of a metre, roughly) from the goal cells over free cells
const NB = [[1, 0, 5], [-1, 0, 5], [0, 1, 5], [0, -1, 5], [1, 1, 7], [1, -1, 7], [-1, 1, 7], [-1, -1, 7]];
function field(free, goals) {
  const D = new Int32Array(NX * NZ).fill(1 << 29), B = [];
  const push = (c, d) => { (B[d] || (B[d] = [])).push(c); };
  for (const g of goals) if (g >= 0 && free[g]) { D[g] = 0; push(g, 0); }
  for (let d = 0; d < B.length; d++) {
    const L = B[d]; if (!L) continue;
    for (const c of L) {
      if (D[c] !== d) continue;
      const i = c % NX, k = (c / NX) | 0;
      for (const [di, dk, w] of NB) {
        const i2 = i + di, k2 = k + dk;
        if (i2 < 0 || k2 < 0 || i2 >= NX || k2 >= NZ) continue;
        const c2 = k2 * NX + i2;
        if (!free[c2]) continue;
        if (di && dk && (!free[k * NX + i2] || !free[k2 * NX + i])) continue;
        const nd = d + w;
        if (nd < D[c2]) { D[c2] = nd; push(c2, nd); }
      }
    }
  }
  return D;
}
const fieldAt = (D, x, z) => { const c = cellOf(x, z); return c < 0 ? 1 << 29 : D[c]; };

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.rnd = mk(seed * 9301 + 49297);
    this.next = 0; this.move = [0, 0]; this.target = null; this.bias = 0; this.aimA = undefined;
    this.out = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false };
    this.debug = { mode: 'scan', target: null };
    this.navKey = null; this.free = null; this.fields = new Map(); this.roomKey = null; this.fight = true; this.empHold = 0; this.dashHold = 0;
  }
  gauss() { const r = this.rnd; return (r() + r() + r() - 1.5) * 1.15; }

  control(W, p) {
    const out = this.out, P = this.P;
    out.emp = false; out.dash = false; out.plant = false;
    if (!p.alive || W.phase !== 'play') { out.mx = out.mz = 0; out.fire = false; if (W.phase === 'transit' && p.alive) { out.mx = Math.cos(p.aim); out.mz = Math.sin(p.aim); } return { ...out }; }
    if (W.room.key !== this.roomKey) this.newRoom(W);
    if (W.t >= this.next) {
      let dt = P.react + (this.rnd() - 0.5) * 2 * P.jit;
      if (this.rnd() < P.late) dt += P.lateT;
      this.next = W.t + Math.max(0.05, dt);
      this.plan(W, p);
    }
    // aim follows the chosen target continuously, with the pilot's wobble and a limited swing speed
    const T = this.target && this.find(W, this.target);
    if (T) {
      const d = hyp(T.x - p.x, T.z - p.z), tt = d / F.shotV;
      const ax = T.x + (T.vx || 0) * tt - p.x, az = T.z + (T.vz || 0) * tt - p.z;
      this.bias += (this.gauss() * P.drift - this.bias * 0.5) * 0.1;
      const want = Math.atan2(az, ax) + this.bias + this.gauss() * P.aim * 0.3;
      if (this.aimA === undefined) this.aimA = p.aim;
      let da = want - this.aimA; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const mx = P.slew * STEP;
      this.aimA += da > mx ? mx : da < -mx ? -mx : da;
      out.ax = Math.cos(this.aimA); out.az = Math.sin(this.aimA);
      const clear = this.losOK(W, p, T);
      out.fire = d < P.fireRange && Math.abs(da) < Math.max(0.1, Math.atan((T.r || 0.5) / Math.max(1, d)) + 0.05) && clear;
      if (T.plateBlock && this.profile === 'demo') out.fire = out.fire && !T.plateBlock(Math.atan2(p.z - T.z, p.x - T.x));
    } else { out.fire = false; out.ax = 0; out.az = 0; if (this.aimA === undefined) this.aimA = p.aim; }
    out.mx = this.move[0]; out.mz = this.move[1];
    if (this.empHold > 0) { out.emp = true; this.empHold--; }
    if (this.dashHold > 0) { out.dash = true; this.dashHold--; }
    return { ...out };
  }
  losOK(W, p, T) {
    if (T.kind === 'boss' || T.kind === 'head') return true;
    return los(W.room.walls, p.x, p.z, T.x, T.z, 0.14);
  }
  newRoom(W) {
    this.roomKey = W.room.key;
    this.fields.clear();
    this.free = buildNav(W.room);
    this.fight = this.rnd() < this.P.greed;
    this.target = null;
  }
  fieldFor(key, goals) {
    let D = this.fields.get(key);
    if (!D) { D = field(this.free, goals); this.fields.set(key, D); if (this.fields.size > 24) this.fields.delete(this.fields.keys().next().value); }
    return D;
  }
  exitField(side) {
    const goals = [], h = DOOR / 2 - 0.6;
    for (let k = 0; k < NZ; k++) for (let i = 0; i < NX; i++) {
      const x = X0 + (i + 0.5) * NC, z = Z0 + (k + 0.5) * NC;
      if ((side === 'e' && x > RW + 1 && Math.abs(z) < h) || (side === 'w' && x < -RW - 1 && Math.abs(z) < h) || (side === 's' && z > RH + 1 && Math.abs(x) < h) || (side === 'n' && z < -RH - 1 && Math.abs(x) < h)) goals.push(k * NX + i);
    }
    return this.fieldFor('exit:' + side, goals);
  }
  pointField(x, z, rad = 0.8) {
    const key = `pt:${Math.round(x)},${Math.round(z)},${rad}`;
    if (this.fields.has(key)) return this.fields.get(key);
    const goals = [];
    for (let k = 0; k < NZ; k++) for (let i = 0; i < NX; i++) { const c = k * NX + i; if (this.free[c] && hyp(cx(c) - x, cz(c) - z) < rad) goals.push(c); }
    if (!goals.length) { const c = cellOf(x, z); if (c >= 0) goals.push(c); }
    return this.fieldFor(key, goals);
  }

  // the target as it is now (or null if gone)
  find(W, t) {
    const B = W.boss;
    if (t.kind === 'boss') {
      if (!B || B.state === 'dying') return null;
      const D = BOSSES[B.key];
      const o = { x: B.x, z: B.z, vx: B.vx, vz: B.vz, r: B.r * 0.8, kind: 'boss' };
      if (B.plates > 0) o.plateBlock = (a) => { for (let k = 0; k < B.plates; k++) if (Math.abs(angDiff(a, B.spin + (k / B.plates) * Math.PI * 2 + 0.25)) < (D.plateArc || 0.5) + 0.1) return true; return false; };
      return o;
    }
    if (t.kind === 'head') { const h = B && B.heads[t.i]; return h && h.hp > 0 && B.state !== 'dying' ? { x: h.x, z: h.z, vx: 0, vz: 0, r: 0.6, kind: 'head' } : null; }
    const e = W.robots.find((q) => q.id === t.id && q.hp > 0);
    return e ? { x: e.x, z: e.z, vx: e.vx, vz: e.vz, r: e.r, kind: e.type } : null;
  }

  // what the pilot can see: things that have been there at least its reaction time, drawn where they were then
  perceive(W, p) {
    const human = this.profile === 'human', lag = human ? this.P.react : 0;
    const fa = this.aimA ?? p.aim, blind = this.P.blind, r = this.rnd;
    const missed = (x, z) => {
      if (!blind) return false;
      const dx = x - p.x, dz = z - p.z, d = hyp(dx, dz);
      if (d < 3) return false;
      return Math.abs(angDiff(fa, Math.atan2(dz, dx))) > 1.75 && r() < blind;
    };
    const th = [];
    for (const e of W.robots) {
      if (e.hp <= 0) continue;
      if (missed(e.x, e.z)) continue;
      th.push({ kind: 'robot', e, x: e.x - e.vx * lag, z: e.z - e.vz * lag, vx: e.vx, vz: e.vz, r: e.r, d: hyp(e.x - p.x, e.z - p.z) });
    }
    for (const b of W.bolts) {
      const age = (W.n - (b.n0 || 0)) * STEP;
      if (age < lag) continue;
      if (missed(b.x, b.z)) continue;
      th.push({ kind: 'bolt', x: b.x - b.vx * lag, z: b.z - b.vz * lag, vx: b.vx, vz: b.vz, r: b.r, d: hyp(b.x - p.x, b.z - p.z) });
    }
    th.sort((a, b) => a.d - b.d);
    if (th.length > this.P.track) th.length = this.P.track;
    return th;
  }

  plan(W, p) {
    const P = this.P, r = this.rnd, room = W.room, B = W.boss, S = W.seeker;
    const th = this.perceive(W, p);
    const delay = W.R.seek + 4 * (W.up.jammer || 0);
    const robots = W.robots.filter((e) => e.hp > 0 && e.type !== 'drone');
    // ---- what we want
    let goal = null, mode = 'hold', wantD = 0;
    if (room.liftOn) { goal = this.pointField(0, 0, 0.9); mode = 'lift'; }
    else if (room.boss) mode = 'boss';
    else {
      const late = room.t > delay * P.leaveAt || S || room.seekWarned;
      if (robots.length && this.fight && !late) mode = 'fight';
      else { const s = routeSide(W); if (s) { goal = this.exitField(s); mode = 'exit'; this.debug.side = s; } }
    }
    // ---- who to shoot
    let best = null, bs = 1e9;
    if (B && B.state !== 'dying') {
      const heads = B.heads.filter((h) => h.hp > 0);
      if (heads.length) { for (const h of heads) { const d = hyp(h.x - p.x, h.z - p.z); if (d < bs) { bs = d; best = { kind: 'head', i: h.i }; } } }
      else best = { kind: 'boss' };
    }
    if (!best || (B && W.robots.some((e) => e.hp > 0 && hyp(e.x - p.x, e.z - p.z) < 5))) {
      for (const t of th) {
        if (t.kind !== 'robot' || t.e.boot > 0.6) continue;
        const vis = los(room.walls, p.x, p.z, t.x, t.z, 0.14);
        let s = t.d + (vis ? 0 : 14) - (t.e.aimT > 0 ? 4 : 0) - (t.e.type === 'ripper' || t.e.type === 'drone' ? 3 : 0);
        if (s < bs) { bs = s; best = { kind: 'robot', id: t.e.id, vis, x: t.e.x, z: t.e.z }; }
      }
    }
    this.target = best;
    if (mode === 'fight' && best && best.kind === 'robot') {
      if (!best.vis || hyp(best.x - p.x, best.z - p.z) > 12) { goal = this.pointField(best.x, best.z, 7); mode = 'hunt'; }
    } else if (mode === 'fight' && !best) {
      const s = routeSide(W); if (s) { goal = this.exitField(s); mode = 'exit'; }
    }
    if (mode === 'boss' && B) wantD = BOSSES[B.key].keep ? 8 : 9;
    this.debug.mode = mode;
    // ---- score every direction over the next second
    const sp = F.speed * (p.slow ? 0.55 : 1);
    const walls = room.walls;
    const g0 = goal ? fieldAt(goal, p.x, p.z) : 0;
    let bestD = DIRS[16], bestC = 1e9;
    const lines = [];
    for (const e of W.robots) if (e.hp > 0 && e.aimT > 0 && (this.profile !== 'human' || e.aimTot - e.aimT > P.react * 0.6)) lines.push(e);
    const zones = W.zones;
    const travelT = P.react + P.jit + 0.12;
    for (let di = 0; di < DIRS.length; di++) {
      const [ux, uz] = DIRS[di];
      let c = di === 16 ? 0.4 : 0;
      // the path we would actually run (the suit takes a moment to turn), and the walls along it
      let vx = p.vx, vz = p.vz, x = p.x, z = p.z, hitT = 99;
      const tx = ux * sp, tz = uz * sp, acc = F.accel * PDT;
      for (let k = 0; k < PATH_N; k++) {
        vx += clamp(tx - vx, -acc, acc); vz += clamp(tz - vz, -acc, acc);
        x += vx * PDT; z += vz * PDT;
        PX[k] = x; PZ[k] = z;
        if (hitT > 90) { const nw = nearestWall(walls, x, z); PW[k] = nw.d; if (nw.d < F.r + 0.06) hitT = (k + 1) * PDT; } else PW[k] = 0;
      }
      if (hitT < travelT) c += 1200 + (1 - hitT / travelT) * 800;
      else if (hitT < travelT + 0.45) c += (travelT + 0.45 - hitT) * 300 * P.margin;
      for (let si = 0; si < SAMPLES.length; si++) {
        const t = SAMPLES[si], ki = Math.min(PATH_N - 1, Math.round(t / PDT) - 1), x = PX[ki], z = PZ[ki], wgt = 1 - si * 0.12;
        if ((ki + 1) * PDT >= hitT) break;
        const nd = PW[ki];
        if (nd < F.r + 0.25 * P.margin + 0.15) c += (F.r + 0.25 * P.margin + 0.15 - nd) * 60 * wgt;
        for (const q of th) {
          const qx = q.x + q.vx * (t + (this.profile === 'human' ? P.react : 0)), qz = q.z + q.vz * (t + (this.profile === 'human' ? P.react : 0));
          const d = hyp(qx - x, qz - z);
          if (q.kind === 'bolt') { const rr = q.r + F.r + 0.25 * P.margin; if (d < rr) c += 420 * wgt; else if (d < rr + 0.6) c += (rr + 0.6 - d) * 40 * wgt; }
          else if (q.e.boot <= 0.2) { const rr = q.r + F.r + 0.8; if (d < rr) c += (q.e.type === 'ripper' ? 220 : 140) * wgt * (1 - d / rr + 0.3); }
        }
        // aim glints: a bolt will come down that line
        for (const e of lines) {
          if (e.type === 'mortar') continue;
          const v = W.R.boltV * (ENEMY[e.type].boltK || 1), ta = t - e.aimT;
          const ex = x - e.x, ez = z - e.z, along = ex * Math.cos(e.aimA) + ez * Math.sin(e.aimA), side = Math.abs(-ex * Math.sin(e.aimA) + ez * Math.cos(e.aimA));
          if (along > 0 && side < F.r + 0.5) { const arrive = along / v; c += (Math.abs(arrive - ta) < 0.6 ? 160 : 40) * wgt; }
        }
        for (const m of W.mines) { const mx = m.state === 'fly' ? m.tx : m.x, mz = m.state === 'fly' ? m.tz : m.z; const d = hyp(mx - x, mz - z); if (d < ENEMY.mortar.mineR + 0.6) c += (m.state === 'fuse' ? 400 : 120) * wgt; }
        for (const zn of zones) {
          if (!zn.deadly) { if (zn.style === 'lane' && zn.t < zn.T + zn.D && inZone(zn, x, z, F.r + 0.6)) c += 300 * wgt; else if (zn.style === 'ice' && inZone(zn, x, z, 0)) c += 6; continue; }
          const tz = zn.t + t;
          if (tz > zn.T - 0.35 && tz < zn.T + zn.D + 0.1 && inZone(zn, x, z, F.r + 0.25)) c += 500 * wgt;
          else if (inZone(zn, x, z, F.r + 0.2)) c += 30 * wgt;
        }
        if (S) { const d = hyp(S.x + S.vx * t - x, S.z + S.vz * t - z); if (d < SEEKER.r + F.r + 1.6) c += (SEEKER.r + F.r + 1.6 - d) * 120 * wgt; }
        if (B) {
          const bx = B.x + B.vx * t, bz = B.z + B.vz * t, d = hyp(bx - x, bz - z);
          if (d < B.r + F.r + 1.2) c += (B.r + F.r + 1.2 - d) * 200 * wgt;
          if (wantD) c += Math.abs(d - wantD) * 1.2 * wgt;
          const C = B.cur;
          if (C && C.kind === 'sweep') {
            const A = ATTACK.sweep, at = C.t + t - C.T;
            const beam = at < 0 ? C.a0 : C.a0 + C.sgn * A.arc * Math.min(1, at / A.act);
            const da = Math.abs(angDiff(beam, Math.atan2(z - B.z, x - B.x)));
            // behind a pillar only if the beam is blocked across its whole width at our spot
            const pil = walls.filter((w) => w[4] === 4), dx = x - B.x, dz = z - B.z, dl = hyp(dx, dz) || 1, ox = -dz / dl * (A.w + F.r * 0.7 + 0.12), oz = dx / dl * (A.w + F.r * 0.7 + 0.12);
            const covered = pil.length > 0 && !los(pil, B.x, B.z, x, z, 0) && !los(pil, B.x, B.z, x + ox, z + oz, 0) && !los(pil, B.x, B.z, x - ox, z - oz, 0);
            if (!covered && at > -0.4 && at < A.act + 0.1 && Math.sin(da) * d < A.w + F.r + 0.5 && Math.cos(da) > 0) c += 450 * wgt;
            if (covered && at > -0.6 && at < A.act) c -= 8 * wgt;
            // the beam will sweep the rest of its arc: be outside it (or behind a pillar) when it gets there
            if (!covered && (this.profile !== 'human' || C.t > P.react)) {
              const rel = angDiff(beam, Math.atan2(z - B.z, x - B.x)) * C.sgn, left = angDiff(beam, C.a0 + C.sgn * A.arc) * C.sgn;
              if (rel > -0.1 && rel < left + 0.15) { const arrive = Math.max(0, -at) + rel / (A.arc / A.act); c += (arrive < 0.7 ? 160 : 40) * wgt; }
            }
          }
          // a volley / spray tell (the boss's eye flares): get out of the fan before it fires
          if (C && (C.kind === 'volley' || C.kind === 'spray') && C.t < C.T + 0.5 && (this.profile !== 'human' || C.t > P.react * 0.6)) {
            const A = atkOf(B.key, C.kind), ta = Math.atan2((C.pz ?? p.z) - B.z, (C.px ?? p.x) - B.x);
            const da = Math.abs(angDiff(ta, Math.atan2(z - B.z, x - B.x)));
            if (da < A.fan * 0.5 + 0.15 && C.t + t > C.T - 0.25) c += (C.kind === 'volley' ? 140 : 90) * wgt * (1 - da / (A.fan * 0.5 + 0.15) * 0.5);
          }
          if (C && C.kind === 'charge' && C.t < C.T + 0.2) {
            const dx = x - B.x, dz = z - B.z, al = dx * Math.cos(C.a) + dz * Math.sin(C.a), sd = Math.abs(-dx * Math.sin(C.a) + dz * Math.cos(C.a));
            if (al > -1 && sd < B.r + F.r + 0.8) c += 350 * wgt;
          }
        }
      }
      // where we want to go
      if (goal) {
        const k1 = Math.round(0.38 / PDT) - 1, k2 = Math.round(0.7 / PDT) - 1;
        const x1 = PX[k1], z1 = PZ[k1], x2 = PX[k2], z2 = PZ[k2];
        const g1 = Math.min(fieldAt(goal, x1, z1), fieldAt(goal, x2, z2) + 3);
        c += g1 >= 1 << 28 ? 60 : (g1 - g0) * (mode === 'exit' || mode === 'lift' ? 1.4 : 0.9);
      } else if (mode === 'fight' || mode === 'boss') {
        // drift toward open floor, not into corners
        const k1 = Math.round(0.5 / PDT) - 1, x1 = PX[k1], z1 = PZ[k1];
        c += (Math.abs(x1) / RW + Math.abs(z1) / RH) * 2;
      }
      if (P.noise) c += this.rnd() * P.noise * 30;
      if (c < bestC) { bestC = c; bestD = DIRS[di]; }
    }
    this.move = [bestD[0], bestD[1]];
    this.debug.cost = bestC;
    // ---- emergency tools
    let close = 0;
    for (const q of th) if (q.kind === 'bolt' && q.d < 2.2) { const ap = ((p.x - q.x) * q.vx + (p.z - q.z) * q.vz) > 0; if (ap) close++; }
    const crowd = W.robots.filter((e) => e.hp > 0 && e.boot <= 0 && hyp(e.x - p.x, e.z - p.z) < 4.5).length;
    if (p.emp > 0 && (bestC > 300 && (close >= 2 || crowd >= 2)) && r() < P.empP) this.empHold = 2;
    else if (W.up.dash && p.dashCD <= 0 && bestC > 250 && close >= 1 && bestD !== DIRS[16] && r() < P.dashP) {
      let safe = true;
      for (const k of [0.8, 1.6, 2.4, 3.0]) if (wallNear(walls, p.x + bestD[0] * k, p.z + bestD[1] * k, F.r + 0.25)) safe = false;
      if (safe) this.dashHold = 2;
    }
  }
}
export { buildNav, field, fieldAt, cellOf };

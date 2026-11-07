// The five bosses. Every attack is shown before it can hurt (W.zones with a `warn` time from RAMP.bossWarn),
// and every boss has a moment when it is open to the pick (stuck, stunned or resting) plus a weak point that
// dynamite can reach. Shapes the renderer draws: rect (bands, columns), circle (impact marks), curve (a swoop).
import { BOSSES, PHYS, TOOLS, LOOT } from './config.js?v=11';

const D2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);

export function makeBoss(W, kind) {
  const A = W.M.arena, R = W.ramp;
  const hp = Math.round(R.bossHP * (BOSSES[kind].hp || 1));
  const cx = (A.x0 + A.x1) / 2;
  const B = { kind, hp, maxHp: hp, x: cx, y: A.floorY - 3, face: -1, st: 'sleep', t: 0, phase: 0, awake: false, restT: 2.5, vuln: 0,
    weak: { x: cx, y: A.floorY, r: 1.2 }, hitT: 0, dead: false, deathT: 0, atk: null, ax: 0, ay: 0, lastAtk: '', fist: 0, fists: null, hidden: true };
  if (kind === 'gloomwing') { B.y = A.top - 5; B.hidden = false; }
  if (kind === 'warden') { B.x = A.x1 - 8; B.y = A.floorY; B.hidden = false; }
  if (kind === 'wyrm') { B.x = cx; B.y = 2; }
  if (kind === 'heart') {
    B.x = cx; B.y = A.floorY + 6; B.hidden = false;
    B.fists = [{ x: cx - 9, y: A.floorY + 4, st: 'idle', t: 0, tx: 0 }, { x: cx + 9, y: A.floorY + 4, st: 'idle', t: 0, tx: 0 }];
  }
  // a powder keg on each side, and a flare crate (Gloomwing is beaten with light)
  W.kegs.push({ id: W.uid++, x: A.x0 + 3.5, y: A.floorY + (kind === 'wyrm' ? 0 : 0), t: 0, what: 'dyn' });
  W.kegs.push({ id: W.uid++, x: A.x1 - 3.5, y: A.floorY, t: 0, what: kind === 'gloomwing' ? 'flare' : 'dyn' });
  if (kind === 'gloomwing') W.kegs.push({ id: W.uid++, x: A.x0 + 6.5, y: A.floorY, t: 0, what: 'flare' });
  return B;
}

const zone = (W, z) => { z.t = 0; z.id = W.uid++; W.zones.push(z); return z; };

// returns true when a pick swing connected
export function bossHit(W, B, x, y, how, dmg, api, radius = 0) {
  if (!B || B.dead || B.st === 'sleep') return false;
  const exposed = !B.hidden;
  const w = B.weak;
  const near = D2(x, y, w.x, w.y) < (w.r + (how === 'blast' ? radius * 0.85 : PHYS.pickReach * 0.6)) ** 2;
  let ok = false;
  if (how === 'pick') ok = near && B.vuln > 0;
  else ok = near && exposed;
  // the Molten Heart's core can be blasted from the high ledges
  if (!ok && how === 'blast' && B.kind === 'heart' && D2(x, y, B.x, B.y + 4) < (2 + radius) ** 2) ok = true;
  // dynamite in the pool reaches a hidden Tidewyrm
  if (!ok && how === 'blast' && B.kind === 'wyrm' && B.hidden && Math.abs(x - B.x) < 5 && y < 6) { ok = true; dmg = 2; }
  // the Gloomwing is hurt by a pick as she passes low
  if (!ok && how === 'pick' && B.kind === 'gloomwing' && B.st === 'swoop' && D2(x, y, B.x, B.y) < 2.4 * 2.4) { ok = true; dmg = 1; }
  if (!ok) { if (how === 'pick' && near) api.ev(W, 'clink', { x, y, hard: true }); return false; }
  B.hp -= dmg; B.hitT = 0.25;
  api.ev(W, 'bosshit', { x: w.x, y: w.y, dmg, how });
  api.addScore(W, Math.round(100 * dmg), w.x, w.y);
  const f = B.hp / B.maxHp;
  if (B.phase === 0 && f < 0.6) { B.phase = 1; api.ev(W, 'bossphase', { x: B.x, y: B.y, phase: 1 }); }
  if (B.phase === 1 && f < 0.3) { B.phase = 2; api.ev(W, 'bossphase', { x: B.x, y: B.y, phase: 2 }); }
  if (B.hp <= 0) {
    B.hp = 0; B.dead = true; B.deathT = 0; B.vuln = 0;
    for (const z of W.zones) z.dead = true;
    for (const p of W.proj) p.dead = true;
    for (const b of W.bats) if (b.st !== 'dead') api.killBat(W, b, W.players[0]);
    api.addScore(W, LOOT.boss * (W.depth + 1), B.x, B.y);
    api.ev(W, 'bossdie', { x: w.x, y: w.y, n: W.n, kind: B.kind });
  }
  return true;
}

function pickAttack(W, B, api) {
  const list = BOSSES[B.kind].attacks.filter((a) => a[2] <= B.phase && !(a[0] === B.lastAtk && a[0] !== 'slam' && a[0] !== 'erupt' && a[0] !== 'lunge' && a[0] !== 'swoop'));
  let tot = 0; for (const a of list) tot += a[1];
  let r = api.rnd(W) * tot;
  for (const a of list) { r -= a[1]; if (r <= 0) return a[0]; }
  return list[0][0];
}

export function updateBoss(W, dt, P, api) {
  const B = W.boss, A = W.M.arena, R = W.ramp;
  if (!B) return;
  B.t += dt; B.hitT = Math.max(0, B.hitT - dt);
  if (B.dead) {
    B.deathT += dt;
    if (B.deathT > 4.2 && !W.clear) api.bossCleared(W);
    return;
  }
  if (B.st === 'sleep') {
    if (!P.inCage && W.cage.state !== 'down') {
      B.wakeT = (B.wakeT || 0) + dt;
      if (B.wakeT > 1.2) { B.st = 'intro'; B.t = 0; B.awake = true; api.ev(W, 'bosswake', { x: B.x, y: B.kind === 'wyrm' || B.kind === 'rockjaw' ? A.floorY + 2 : B.y, kind: B.kind }); }
    }
    return;
  }
  if (B.st === 'intro') {
    if (B.kind === 'rockjaw') { B.hidden = false; B.x = A.x1 - 10; B.y = A.floorY + 4 + Math.sin(B.t * 3) * 2; B.face = -1; }
    if (B.kind === 'wyrm') { B.hidden = false; B.x = (A.x0 + A.x1) / 2; B.y = 6 + Math.sin(Math.min(1, B.t / 1.5) * Math.PI) * 4; }
    if (B.t > 3) { B.st = 'idle'; B.t = 0; B.restT = 1.0; if (B.kind === 'rockjaw' || B.kind === 'wyrm') B.hidden = true; }
    return;
  }
  const rate = R.bossRate * (B.phase === 2 ? 1.15 : 1);
  const warn = R.bossWarn;
  B.vuln = Math.max(0, B.vuln - dt);
  const fn = UPDATE[B.kind];
  fn(W, B, P, dt, api, A, rate, warn);
}

// ------------------------------------------------------------------ Rockjaw: a worm that eats tunnels
function rockjaw(W, B, P, dt, api, A, rate, warn) {
  const fy = A.floorY;
  if (B.st === 'idle') {
    B.hidden = true; B.y = fy - 3;
    B.restT -= dt;
    B.x += Math.sign(P.x - B.x) * Math.min(Math.abs(P.x - B.x), 6 * dt);
    if (B.restT <= 0 && !P.dead) {
      const a = pickAttack(W, B, api); B.lastAtk = a; B.t = 0;
      if (a === 'erupt') {
        B.st = 'erupt'; B.ax = Math.max(A.x0 + 3, Math.min(A.x1 - 3, P.x));
        B.dir = P.x < (A.x0 + A.x1) / 2 ? 1 : -1;
        B.ex = Math.max(A.x0 + 3, Math.min(A.x1 - 3, B.ax + B.dir * 8));
        zone(W, { shape: 'rect', x0: B.ax - 1.3, x1: B.ax + 1.3, y0: fy - 0.5, y1: fy + 10, warn, dur: 0.55, dmg: 1, cause: 'Rockjaw', look: 'erupt' });
        zone(W, { shape: 'circle', x: B.ex, y: fy + 0.8, r: 1.7, warn: warn + 1.0, dur: 0.35, dmg: 1, cause: 'Rockjaw', look: 'impact' });
        api.ev(W, 'rumble', { x: B.ax, y: fy });
      } else if (a === 'lunge') {
        // it swims through the rock, surfacing in a chain of humps across the arena: each hole is marked first
        B.st = 'lunge'; B.dir = P.x > (A.x0 + A.x1) / 2 ? 1 : -1;
        const n = 3 + Math.min(1, B.phase), gap = 7.5;
        const start = B.dir > 0 ? A.x0 + 3 : A.x1 - 3;
        B.humps = [];
        for (let i = 0; i < n; i++) {
          const hx = Math.max(A.x0 + 2.5, Math.min(A.x1 - 2.5, start + B.dir * (i * gap + (api.rnd(W) - 0.5) * 2)));
          B.humps.push(hx);
          zone(W, { shape: 'circle', x: hx, y: fy + 0.8, r: 1.6, warn: warn + i * 0.7 / rate, dur: 0.45, dmg: 1, cause: 'Rockjaw', look: 'erupt' });
        }
        B.x = B.humps[0]; B.y = fy - 2;
        api.ev(W, 'rumble', { x: B.x, y: fy + 1 });
      } else {
        B.st = 'rain'; api.ev(W, 'bossroar', { x: B.x, y: fy + 2 });
        const n = 4 + B.phase;
        for (let i = 0; i < n; i++) {
          const x = A.x0 + 2 + api.rnd(W) * (A.x1 - A.x0 - 4);
          zone(W, { shape: 'circle', x, y: fy + 0.8, r: 1.15, warn: warn + i * 0.18, dur: 0.25, dmg: 1, cause: 'a falling rock', look: 'rock' });
        }
      }
    }
  } else if (B.st === 'erupt') {
    const t = B.t - warn;
    if (t < 0) { B.x = B.ax; B.y = fy - 2; B.hidden = true; }
    else if (t < 1.0) {
      B.hidden = false;
      // up out of the floor, over in an arc, and down into the floor at ex
      const f = t / 1.0;
      B.x = B.ax + (B.ex - B.ax) * Math.max(0, (f - 0.25) / 0.75);
      B.y = fy - 1 + Math.sin(Math.min(1, f * 1.15) * Math.PI) * 9.5;
      B.face = B.dir;
      if (t + dt >= 1.0) api.ev(W, 'slam', { x: B.ex, y: fy });
    } else { B.st = 'stuck'; B.t = 0; B.x = B.ex; B.y = fy + 0.9; B.vuln = BOSSES.rockjaw.stun; api.ev(W, 'bossstuck', { x: B.x, y: B.y }); }
  } else if (B.st === 'lunge') {
    const t = B.t - warn, per = 0.7 / rate, n = B.humps.length;
    if (t < 0) { B.hidden = true; B.x = B.humps[0]; B.y = fy - 2; }
    else {
      // hump i: up out of hole i at t = i*per, arcing toward hole i+1
      const i = Math.min(n - 1, Math.floor(t / per)), f = Math.min(1, (t - i * per) / per);
      const x0 = B.humps[i], x1 = B.humps[Math.min(n - 1, i + 1)];
      B.hidden = false; B.face = B.dir;
      B.x = x0 + (x1 - x0) * f; B.y = fy - 1.2 + Math.sin(f * Math.PI) * 4.2;
      if (t >= n * per - per * 0.4) { B.st = 'stuck'; B.t = 0; B.x = B.humps[n - 1]; B.y = fy + 0.9; B.vuln = BOSSES.rockjaw.stun; api.ev(W, 'slam', { x: B.x, y: fy }); api.ev(W, 'bossstuck', { x: B.x, y: B.y }); }
    }
  } else if (B.st === 'rain') {
    if (B.t > warn + 1.2) { B.st = 'idle'; B.restT = 2.0 / rate; }
  } else if (B.st === 'stuck') {
    B.hidden = false;
    if (B.vuln <= 0) { B.st = 'idle'; B.restT = 1.6 / rate; api.ev(W, 'burrow', { x: B.x, y: fy }); }
  }
  B.weak.x = B.x; B.weak.y = B.y; B.weak.r = 1.35;
}

// ------------------------------------------------------------------ Gloomwing: mother of bats
function gloomwing(W, B, P, dt, api, A, rate, warn) {
  const fy = A.floorY, top = A.top, cx = (A.x0 + A.x1) / 2;
  B.hidden = false;
  const home = () => { B.hx = cx + Math.sin(B.flyT * 0.55) * 13; B.hy = top - 5.5 + Math.sin(B.flyT * 1.1) * 1.8; };
  B.flyT = (B.flyT || 0) + dt;
  if (B.st === 'idle' || B.st === 'summon' || B.st === 'shriek') {
    home();
    B.x += (B.hx - B.x) * Math.min(1, dt * 2); B.y += (B.hy - B.y) * Math.min(1, dt * 2);
    B.face = Math.sign(B.hx - B.x) || B.face;
  }
  if (B.st === 'idle') {
    B.restT -= dt;
    if (B.restT <= 0 && !P.dead) {
      const a = pickAttack(W, B, api); B.lastAtk = a; B.t = 0;
      if (a === 'swoop') {
        B.st = 'swoop';
        const tx = Math.max(A.x0 + 3, Math.min(A.x1 - 3, P.x)), ty = fy + 1.0;
        const sx = B.x, sy = B.y, ex = Math.max(A.x0 + 3, Math.min(A.x1 - 3, 2 * tx - sx)), ey = sy;
        // quadratic curve through (tx, ty) at its middle: control point = 2*mid - (start+end)/2
        B.cv = { x0: sx, y0: sy, x1: 2 * tx - (sx + ex) / 2, y1: 2 * ty - (sy + ey) / 2, x2: ex, y2: ey };
        B.z = zone(W, { shape: 'curve', ...B.cv, r: 1.4, warn, dur: 1.5 / rate, dmg: 0, look: 'swoop' });
        api.ev(W, 'screech', { x: B.x, y: B.y });
      } else if (a === 'summon') {
        B.st = 'summon'; api.ev(W, 'screech', { x: B.x, y: B.y });
      } else {
        B.st = 'shriek'; api.ev(W, 'screech', { x: B.x, y: B.y });
        const n = 4 + B.phase;
        for (let i = 0; i < n; i++) zone(W, { shape: 'circle', x: A.x0 + 2 + api.rnd(W) * (A.x1 - A.x0 - 4), y: fy + 0.8, r: 1.1, warn: warn + i * 0.15, dur: 0.25, dmg: 1, cause: 'a falling stalactite', look: 'stal' });
      }
    }
  } else if (B.st === 'swoop') {
    const t = B.t - warn;
    if (t < 0) { B.x += (B.cv.x0 - B.x) * Math.min(1, dt * 6); B.y += (B.cv.y0 - B.y) * Math.min(1, dt * 6); }
    else {
      const f = Math.min(1, t * rate / 1.5), u = 1 - f, c = B.cv;
      const nx = u * u * c.x0 + 2 * u * f * c.x1 + f * f * c.x2, ny = u * u * c.y0 + 2 * u * f * c.y1 + f * f * c.y2;
      B.face = Math.sign(nx - B.x) || B.face; B.x = nx; B.y = ny;
      if (!P.dead && D2(P.x, P.y + 0.8, B.x, B.y) < 1.7 * 1.7) api.hurt(W, P, 1, 'Gloomwing', B.x);
      if (api.litBy(W, B.x, B.y, 4.2)) { B.st = 'fallen'; B.t = 0; B.z.dead = true; api.ev(W, 'bossstun', { x: B.x, y: B.y }); }
      else if (f >= 1) { B.st = 'idle'; B.restT = 1.6 / rate; }
    }
  } else if (B.st === 'summon') {
    if (B.t > 0.9 && !B.did) { B.did = true; for (let i = 0; i < 2 + B.phase; i++) api.spawnBat(W, B.x + (i - 1) * 1.5, B.y - 1); }
    if (B.t > 1.6) { B.st = 'idle'; B.did = false; B.restT = 1.6 / rate; }
  } else if (B.st === 'shriek') {
    if (B.t > warn + 1.0) { B.st = 'idle'; B.restT = 1.8 / rate; }
  } else if (B.st === 'fallen') {
    B.vy = (B.vy || 0) - 20 * dt; B.y = Math.max(fy + 0.9, B.y + B.vy * dt);
    if (B.y <= fy + 0.9 && !B.landed) { B.landed = true; B.vy = 0; B.vuln = BOSSES.gloomwing.stun; api.ev(W, 'slam', { x: B.x, y: fy }); }
    if (B.landed && B.vuln <= 0) { B.st = 'idle'; B.landed = false; B.restT = 1.4 / rate; api.ev(W, 'wings', { x: B.x, y: B.y }); }
  }
  B.weak.x = B.x; B.weak.y = B.y; B.weak.r = 1.7;
}

// ------------------------------------------------------------------ the Prism Warden
function warden(W, B, P, dt, api, A, rate, warn) {
  const fy = A.floorY;
  B.hidden = false; B.y = fy;
  if (B.st === 'idle') {
    const dx = P.x - B.x;
    if (Math.abs(dx) > 4.5) { B.x += Math.sign(dx) * 1.3 * rate * dt; B.face = Math.sign(dx); }
    B.x = Math.max(A.x0 + 2, Math.min(A.x1 - 2, B.x));
    B.restT -= dt;
    if (B.restT <= 0 && !P.dead) {
      const a = pickAttack(W, B, api); B.lastAtk = a; B.t = 0; B.face = Math.sign(dx) || B.face;
      if (a === 'beam') {
        B.st = 'beam'; B.high = api.rnd(W) < 0.4;
        const x0 = B.face > 0 ? B.x + 1 : A.x0, x1 = B.face > 0 ? A.x1 : B.x - 1;
        zone(W, { shape: 'rect', x0, x1, y0: B.high ? fy + 1.85 : fy - 0.2, y1: B.high ? fy + 3.0 : fy + 0.95, warn, dur: 0.5, dmg: B.phase >= 1 ? 2 : 1, cause: 'the Prism Warden', look: 'beam' });
        api.ev(W, 'beamcharge', { x: B.x, y: fy + 2.4 });
      } else if (a === 'slam') {
        B.st = 'slam'; B.sx = Math.max(A.x0 + 2, Math.min(A.x1 - 2, B.x + B.face * 2.6));
        zone(W, { shape: 'circle', x: B.sx, y: fy + 0.6, r: 2.0, warn, dur: 0.3, dmg: B.phase >= 1 ? 2 : 1, cause: 'the Prism Warden', look: 'impact' });
      } else {
        B.st = 'shards'; api.ev(W, 'bossroar', { x: B.x, y: fy + 3 });
        for (let i = 0; i < 4 + B.phase; i++) zone(W, { shape: 'circle', x: A.x0 + 2 + api.rnd(W) * (A.x1 - A.x0 - 4), y: fy + 0.8, r: 1.1, warn: warn + i * 0.16, dur: 0.25, dmg: 1, cause: 'a falling crystal', look: 'shard' });
      }
    }
  } else if (B.st === 'beam') {
    if (B.t >= warn && !B.fired) { B.fired = true; api.ev(W, 'beam', { x: B.x, y: B.high ? fy + 2.4 : fy + 0.4, dir: B.face }); }
    if (B.t > warn + 0.9) { B.st = 'idle'; B.fired = false; B.restT = 1.6 / rate; }
  } else if (B.st === 'slam') {
    if (B.t >= warn && !B.fired) {
      B.fired = true; api.ev(W, 'slam', { x: B.sx, y: fy });
      for (const d of [-1, 1]) zone(W, { shape: 'rect', x0: B.sx - 0.6, x1: B.sx + 0.6, y0: fy - 0.2, y1: fy + 0.75, warn: 0.35, dur: 3.2, vx: d * 6.5 * rate, dmg: 1, cause: 'a shockwave', look: 'wave', pre: true });
    }
    if (B.t > warn + 0.35) { B.st = 'stuck'; B.t = 0; B.fired = false; B.vuln = BOSSES.warden.stun; api.ev(W, 'bossstuck', { x: B.x, y: fy + 2 }); }
  } else if (B.st === 'shards') {
    if (B.t > warn + 1.0) { B.st = 'idle'; B.restT = 1.8 / rate; }
  } else if (B.st === 'stuck') {
    if (B.vuln <= 0) { B.st = 'idle'; B.restT = 1.4 / rate; }
  }
  // the crystal cluster on its back: lower while it kneels after a slam
  B.weak.x = B.x - B.face * 0.7; B.weak.y = fy + (B.st === 'stuck' ? 2.1 : 3.3); B.weak.r = 1.35;
}

// ------------------------------------------------------------------ Tidewyrm
function wyrm(W, B, P, dt, api, A, rate, warn) {
  const pool = { x0: 12.5, x1: 31.5, top: 6 };
  if (B.st === 'idle') {
    B.hidden = true; B.y = 2;
    B.x += Math.sign(P.x - B.x) * Math.min(Math.abs(P.x - B.x), 5 * dt); B.x = Math.max(pool.x0 + 1, Math.min(pool.x1 - 1, B.x));
    B.restT -= dt;
    if (B.restT <= 0 && !P.dead) {
      const a = pickAttack(W, B, api); B.lastAtk = a; B.t = 0;
      if (a === 'lunge') {
        B.st = 'lunge';
        B.tx = P.x; B.ty = P.inWater ? 4 : P.y + 0.8;
        B.sx = Math.max(pool.x0 + 1, Math.min(pool.x1 - 1, P.x + (P.x < (pool.x0 + pool.x1) / 2 ? 4 : -4)));
        zone(W, { shape: 'circle', x: B.tx, y: B.ty, r: 1.6, warn: warn + 0.55, dur: 0.3, dmg: B.phase >= 1 ? 2 : 1, cause: 'Tidewyrm', look: 'impact' });
        api.ev(W, 'ripple', { x: B.sx, y: pool.top, big: true });
      } else if (a === 'spit') {
        B.st = 'spit'; B.sx = (pool.x0 + pool.x1) / 2 + (api.rnd(W) - 0.5) * 8;
        B.shots = [];
        for (let i = 0; i < 3 + B.phase; i++) {
          const tx = Math.max(A.x0 + 2, Math.min(A.x1 - 2, P.x + (i - 1) * 2.6)), ty = landY(W, tx, P);
          B.shots.push([tx, ty]);
          zone(W, { shape: 'circle', x: tx, y: ty + 0.6, r: 1.1, warn: warn + 0.8, dur: 0.3, dmg: 1, cause: 'Tidewyrm', look: 'splash' });
        }
        api.ev(W, 'ripple', { x: B.sx, y: pool.top, big: true });
      } else {
        B.st = 'surge'; const d = P.x < (A.x0 + A.x1) / 2 ? 1 : -1;
        zone(W, { shape: 'rect', x0: d > 0 ? A.x0 - 2 : A.x1 - 1, x1: d > 0 ? A.x0 + 1 : A.x1 + 2, y0: 5.5, y1: 7.6, warn, dur: 6, vx: d * 7.5 * rate, dmg: 1, cause: 'a surge of water', look: 'surge' });
        api.ev(W, 'surge', { x: d > 0 ? A.x0 : A.x1, y: 7 });
      }
    }
  } else if (B.st === 'lunge') {
    const t = B.t - warn;
    if (t < 0) { B.hidden = true; B.x = B.sx; B.y = 2; }
    else if (t < 0.55) { B.hidden = false; const f = t / 0.55; B.x = B.sx + (B.tx - B.sx) * f; B.y = 4 + (B.ty - 4) * f + Math.sin(f * Math.PI) * 3; B.face = Math.sign(B.tx - B.sx) || 1; }
    else { B.st = 'stuck'; B.t = 0; B.x = B.tx; B.y = B.ty; B.vuln = BOSSES.wyrm.stun; api.ev(W, 'slam', { x: B.x, y: B.y - 0.6 }); api.ev(W, 'bossstuck', { x: B.x, y: B.y }); }
  } else if (B.st === 'spit') {
    B.hidden = B.t < warn * 0.5; B.x = B.sx; B.y = Math.min(8.5, 2 + B.t * 8);
    if (B.t >= warn && !B.fired) {
      B.fired = true; api.ev(W, 'spit', { x: B.x, y: B.y });
      for (const [tx, ty] of B.shots) { const T0 = 0.8; W.proj.push({ id: W.uid++, x: B.x, y: B.y, vx: (tx - B.x) / T0, vy: (ty + 0.6 - B.y) / T0 + 0.5 * 20 * T0, r: 0.4, dmg: 1, grav: 20, kind: 'water', cause: 'Tidewyrm' }); }
    }
    if (B.t > warn + 1.4) { B.st = 'idle'; B.fired = false; B.restT = 1.8 / rate; }
  } else if (B.st === 'surge') {
    if (B.t > warn + 4) { B.st = 'idle'; B.restT = 1.6 / rate; }
  } else if (B.st === 'stuck') {
    B.hidden = false;
    if (B.vuln <= 0) { B.st = 'idle'; B.restT = 1.4 / rate; api.ev(W, 'splash', { x: B.x, y: 6, v: 9 }); }
  }
  B.weak.x = B.x; B.weak.y = B.y; B.weak.r = 1.35;
}
// the height a spit lands at x (the ledge or floor under it)
function landY(W, x, P) {
  const M = W.M, cx = Math.floor(x);
  for (let y = Math.min(M.h - 2, Math.floor(P.y + 3)); y > 0; y--) { const t = M.tiles[(y - 1) * M.w + cx]; if (t === 1 || t === 6) return y; if (t === 9) return y; }
  return P.y;
}

// ------------------------------------------------------------------ the Molten Heart
function heart(W, B, P, dt, api, A, rate, warn) {
  const fy = A.floorY, cx = (A.x0 + A.x1) / 2;
  B.hidden = false;
  B.x = cx; B.y = fy + 6 + Math.sin(B.t * 0.8) * 0.3;
  for (const [i, F] of B.fists.entries()) {
    const hx = cx + (i ? 9 : -9), hy = fy + 5 + Math.sin(B.t * 1.3 + i) * 0.4;
    if (F.st === 'idle') { F.x += (hx - F.x) * Math.min(1, dt * 3); F.y += (hy - F.y) * Math.min(1, dt * 3); }
    else if (F.st === 'raise') { F.x += (F.tx - F.x) * Math.min(1, dt * 5); F.y += (fy + 8.5 - F.y) * Math.min(1, dt * 5); if (F.t >= warn + 0.08) { F.st = 'fall'; F.t = 0; } }
    else if (F.st === 'fall') { F.y -= 40 * dt; if (F.y <= fy + 1) { F.y = fy + 1; F.st = 'down'; F.t = 0; api.ev(W, 'slam', { x: F.x, y: fy }); B.vuln = BOSSES.heart.stun; B.fist = i; } }
    else if (F.st === 'down') { if (F.t > BOSSES.heart.stun) F.st = 'idle'; }
    F.t += dt;
  }
  if (B.st === 'idle') {
    B.restT -= dt;
    if (B.restT <= 0 && !P.dead) {
      const a = pickAttack(W, B, api); B.lastAtk = a; B.t = 0;
      if (a === 'slam') {
        B.st = 'slam'; const i = P.x < cx ? 0 : 1, F = B.fists[i];
        F.st = 'raise'; F.t = 0; F.tx = Math.max(A.x0 + 2.5, Math.min(A.x1 - 2.5, P.x));
        zone(W, { shape: 'circle', x: F.tx, y: fy + 0.8, r: 2.0, warn: warn + 0.2, dur: 0.3, dmg: B.phase >= 1 ? 2 : 1, cause: 'the Molten Heart', look: 'impact' });
        api.ev(W, 'bossroar', { x: B.x, y: B.y });
      } else if (a === 'rain') {
        B.st = 'rain'; api.ev(W, 'magma', { x: B.x, y: B.y });
        for (let i = 0; i < 4 + B.phase; i++) zone(W, { shape: 'circle', x: A.x0 + 2 + api.rnd(W) * (A.x1 - A.x0 - 4), y: fy + 0.8, r: 1.15, warn: warn + i * 0.17, dur: 0.25, dmg: 1, cause: 'a magma bomb', look: 'magma' });
      } else {
        B.st = 'wave'; const d = P.x < cx ? 1 : -1;
        zone(W, { shape: 'rect', x0: d > 0 ? A.x0 - 1.5 : A.x1 - 0.5, x1: d > 0 ? A.x0 + 0.5 : A.x1 + 1.5, y0: fy - 0.2, y1: fy + 1.1, warn, dur: 6, vx: d * 8 * rate, dmg: 1, cause: 'a lava wave', look: 'lava' });
        api.ev(W, 'magma', { x: d > 0 ? A.x0 : A.x1, y: fy });
      }
    }
  } else if (B.st === 'slam') {
    if (B.t > warn + 0.5 + BOSSES.heart.stun) { B.st = 'idle'; B.restT = 1.4 / rate; }
  } else if (B.st === 'rain') { if (B.t > warn + 1.2) { B.st = 'idle'; B.restT = 1.8 / rate; } }
  else if (B.st === 'wave') { if (B.t > warn + 4.5) { B.st = 'idle'; B.restT = 1.6 / rate; } }
  // the weak point: the cooling fist while it rests on the floor, otherwise the core (dynamite from the ledges)
  const F = B.fists[B.fist];
  if (B.vuln > 0 && F.st === 'down') { B.weak.x = F.x; B.weak.y = F.y + 0.3; B.weak.r = 1.4; }
  else { B.weak.x = B.x; B.weak.y = B.y + 4; B.weak.r = 1.8; }
}

const UPDATE = { rockjaw, gloomwing, warden, wyrm, heart };

// The battle simulation: pure game state + fixed-step rules. No three.js in here, so the AI can
// run the very same ball physics forward (predict.js) and the renderer only reads state + events.
import { F, ARENAS, POWERUPS, POWERUP_KEYS } from './config.js?v=1';

export const STEP = 1 / 120;      // game tick
const SUB = 2;                    // ball sub-steps per tick (240 Hz collisions)
const CELL_W = (F.hw * 2) / F.cells;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const cellX = (i) => -F.hw + (i + 0.5) * CELL_W;
export const cellIndex = (x) => clamp(Math.floor((x + F.hw) / CELL_W), 0, F.cells - 1);
export const CELL_HALF = CELL_W / 2 - F.cellGap;

function newFx() {
  return { titan: 0, shrink: 0, nova: 0, drone: 0, ghost: 0, magnet: 0, magnetT: 0, barrier: 0, barrierHits: 0, chrono: 0, scope: 0 };
}

function newPaddle(id, side, opts = {}) {
  const homeZ = side * F.paddleZ;
  return {
    id, side, x: 0, z: homeZ, vx: 0, vz: 0, homeZ,
    hwBase: opts.hw || F.paddleHW, hw: opts.hw || F.paddleHW, hd: F.paddleHD, scale: 1,
    xMin: -F.hw, xMax: F.hw,
    zFront: side * F.zoneFront, zBack: side * F.zoneBack,
    maxSpeed: 30, accel: 400, gain: 26,
    stun: 0, immuneT: 0, caught: null, catchT: 0, hitT: -9, flash: 0,
    input: { mode: 'target', tx: 0, tz: homeZ, vx: 0, vz: 0, fire: false, od: false },
    boss: !!opts.boss, part: opts.part || 0,
  };
}

// opts: { arena (index), seed, boss (side of boss or 0), coreHP: {1,-1} }
export function makeWorld(opts = {}) {
  const arena = ARENAS[opts.arena || 0];
  const W = {
    t: 0, arenaIndex: opts.arena || 0, arena, rand: mulberry32(opts.seed || 1),
    balls: [], paddles: [], bolts: [], orbs: [], wells: [], drones: [], events: [],
    cells: { 1: [], '-1': [] }, cores: {}, fx: { 1: newFx(), '-1': newFx() },
    meter: {}, stats: {}, nextId: 1,
    serveTimer: 2.2, serveDir: opts.serveDir || (Math.random() < 0.5 ? 1 : -1), serveCount: 0,
    nextOrb: 5 + Math.random() * 3, over: false, winner: 0, koT: 0,
    hole: arena.hazards.hole ? { ...arena.hazards.hole } : null,
    bumpers: arena.hazards.bumpers ? { ...arena.hazards.bumpers } : null,
    portals: arena.hazards.portals ? { ...arena.hazards.portals } : null,
    sliders: arena.hazards.sliders ? { ...arena.hazards.sliders } : null,
    boss: null, rally: 0, maxRally: 0, slow: 1,
  };
  for (const s of [1, -1]) {
    const cellHP = F.cellHP;
    for (let i = 0; i < F.cells; i++) W.cells[s].push({ side: s, i, hp: cellHP, max: cellHP, x: cellX(i), hitT: -9, buildT: -9 });
    const hp = (opts.coreHP && opts.coreHP[s]) || (opts.boss === s ? F.bossCoreHP : F.coreHP);
    W.cores[s] = { side: s, hp, max: hp, hitT: -9 };
    W.meter[s] = { charges: F.boltCharges, chargeT: 0, cool: 0, od: 0, odTime: 0 };
    W.stats[s] = { hits: 0, smashes: 0, cells: 0, coreHits: 0, bolts: 0, stuns: 0, pickups: 0, curves: 0 };
  }
  W.paddles.push(newPaddle(1, 1));
  if (opts.boss === -1) {
    W.paddles.push(newPaddle(2, -1, { hw: 1.75, boss: true }));
    W.boss = { side: -1, phase: 1, turretT: 2.5, laserT: 9, laser: null };
  } else {
    W.paddles.push(newPaddle(2, -1));
  }
  return W;
}

export const paddlesOf = (W, side) => W.paddles.filter((p) => p.side === side);
const emit = (W, e) => { e.t = W.t; W.events.push(e); };

// ---------------------------------------------------------------- hazards (pure functions of time)
export function bumperPos(W, i, t) {
  const b = W.bumpers;
  const a = b.w * t + (i * Math.PI * 2) / b.n;
  return [Math.cos(a) * b.ring, Math.sin(a) * b.ring * 0.82];
}
export function sliderPos(W, i, t) {
  const s = W.sliders;
  const x = Math.sin(s.w * t + (i ? Math.PI : 0)) * s.amp;
  return [x, i ? -1.35 : 1.35];
}

// ---------------------------------------------------------------- free ball motion (shared with the predictor)
// Moves a ball (or a ball-shaped probe) by dt through walls, curve, gravity and hazards.
// `hit` (optional) receives collision notices: hit(kind, x, z, extra).
export function stepBallFree(W, b, dt, t, hit) {
  const fx = W.fx[b.z >= 0 ? 1 : -1];
  const ts = fx.chrono > 0 ? 0.58 : 1;
  const h = dt * ts;
  const sp0 = Math.hypot(b.vx, b.vz);
  // Magnus curve: rotates the velocity, keeps its length
  if (b.spin) {
    const ang = F.spinK * b.spin * h;
    const c = Math.cos(ang), s = Math.sin(ang);
    const vx = b.vx * c - b.vz * s, vz = b.vx * s + b.vz * c;
    b.vx = vx; b.vz = vz;
    b.spin *= Math.exp(-F.spinDecay * h);
    if (Math.abs(b.spin) < 0.05) b.spin = 0;
  }
  // gravity wells (arena black hole + singularity power-ups)
  let wells = false;
  if (W.hole) wells = pull(b, W.hole.x, W.hole.z, W.hole.m, h) || wells;
  for (const w of W.wells) wells = pull(b, w.x, w.z, w.m * Math.min(1, (t - w.born) * 2, w.life * 1.5), h) || wells;
  if (wells) {
    const sp = Math.hypot(b.vx, b.vz);
    const lim = clamp(sp, 7, F.maxSpeed);
    if (sp > 0) { b.vx *= lim / sp; b.vz *= lim / sp; }
  }
  b.x += b.vx * h;
  b.z += b.vz * h;
  // keep the ball travelling up/down court
  const sp = Math.hypot(b.vx, b.vz) || sp0;
  const minVz = F.minVzFrac * sp;
  if (Math.abs(b.vz) < minVz) {
    const sz = b.vz === 0 ? (b.z > 0 ? -1 : 1) : Math.sign(b.vz);
    b.vz = sz * minVz;
    b.vx = Math.sign(b.vx || 1) * Math.sqrt(Math.max(0, sp * sp - minVz * minVz));
  }
  // side walls (+ warp portals)
  const lim = F.hw - b.r;
  if (b.x > lim || b.x < -lim) {
    const wall = b.x > 0 ? 1 : -1;
    const P = W.portals;
    let warped = false;
    if (P && (b.portalT === undefined || t - b.portalT > 0.3)) {
      // left wall portal at +z links to right wall at -z, and vice versa
      const c = wall * -P.z; // portal centre on this wall
      for (const pc of [c, -c]) {
        if (Math.abs(b.z - pc) < P.len / 2) {
          const ox = -wall * (lim - 0.02), oz = -pc + (b.z - pc);
          if (hit) hit('portal', b.x, b.z, { x2: ox, z2: oz });
          b.x = ox; b.z = oz; b.portalT = t; warped = true;
          break;
        }
      }
    }
    if (!warped) {
      b.x = wall * lim - (b.x - wall * lim);
      b.vx = -wall * Math.abs(b.vx);
      b.spin *= -0.55;
      if (hit) hit('wall', wall * F.hw, b.z, { speed: sp });
    }
  }
  // pinball bumpers
  if (W.bumpers) {
    for (let i = 0; i < W.bumpers.n; i++) {
      const [cx, cz] = bumperPos(W, i, t);
      const dx = b.x - cx, dz = b.z - cz, d = Math.hypot(dx, dz), R = W.bumpers.r + b.r;
      if (d < R && d > 1e-4) {
        const nx = dx / d, nz = dz / d, vn = b.vx * nx + b.vz * nz;
        if (vn < 0) {
          b.vx -= 2 * vn * nx; b.vz -= 2 * vn * nz;
          const k = Math.min(F.maxSpeed, sp * 1.07) / sp;
          b.vx *= k; b.vz *= k;
          b.spin *= 0.5;
          if (hit) hit('bump', cx, cz, { i });
        }
        b.x = cx + nx * R; b.z = cz + nz * R;
      }
    }
  }
  // sliding blocks
  if (W.sliders) {
    const S = W.sliders;
    for (let i = 0; i < 2; i++) {
      const [cx, cz] = sliderPos(W, i, t);
      const qx = clamp(b.x, cx - S.hw, cx + S.hw), qz = clamp(b.z, cz - S.hd, cz + S.hd);
      const dx = b.x - qx, dz = b.z - qz, d2 = dx * dx + dz * dz;
      if (d2 < b.r * b.r) {
        const penX = S.hw + b.r - Math.abs(b.x - cx), penZ = S.hd + b.r - Math.abs(b.z - cz);
        if (penZ < penX) { b.vz = Math.sign(b.z - cz || 1) * Math.abs(b.vz); b.z = cz + Math.sign(b.z - cz || 1) * (S.hd + b.r); }
        else { b.vx = Math.sign(b.x - cx || 1) * Math.abs(b.vx); b.x = cx + Math.sign(b.x - cx || 1) * (S.hw + b.r); }
        if (hit) hit('slider', qx, qz, { i });
      }
    }
  }
}

function pull(b, x, z, m, h) {
  const dx = x - b.x, dz = z - b.z;
  const d2 = dx * dx + dz * dz + 0.7;
  if (d2 > 64) return false;
  const f = (m * h) / (d2 * Math.sqrt(d2));
  b.vx += dx * f; b.vz += dz * f;
  return true;
}

// ---------------------------------------------------------------- the return: how a paddle sends a ball back
// Shared with the AI so its shot plans use the exact same rule.
export function returnShot(W, p, bx, rally, opts = {}) {
  const side = p.side;
  const u = clamp((bx - p.x) / p.hw, -1, 1);
  const ang = Math.sign(u) * Math.pow(Math.abs(u), 1.15) * F.maxAngle;
  const pvx = opts.pvx !== undefined ? opts.pvx : p.vx;
  const pvz = opts.pvz !== undefined ? opts.pvz : p.vz;
  const lunge = Math.max(0, -pvz * side);
  let smash = lunge > 4.5 ? Math.min(13, (lunge - 3) * 1.15) : 0;
  if (opts.catchRelease) smash = Math.max(smash, 7);
  const od = W.meter[side].odTime > 0;
  const speed = Math.min(F.maxSpeed, rally + smash + (od ? 5 : 0));
  let vx = Math.sin(ang) * speed + pvx * 0.16;
  let vz = -side * Math.cos(ang) * speed;
  const k = speed / Math.hypot(vx, vz);
  vx *= k; vz *= k;
  const spin = clamp(-side * pvx * 0.42, -10, 10);
  return { vx, vz, spin, speed, smash, u };
}

// ---------------------------------------------------------------- spawning
export function spawnBall(W, x, z, vx, vz, owner, extra = {}) {
  const b = {
    id: W.nextId++, x, z, vx, vz, r: F.ballR, spin: 0, owner, fire: false, rally: F.serveSpeed,
    born: W.t, caught: null, portalT: undefined, lastHit: 0, hits: 0, ...extra,
  };
  W.balls.push(b);
  return b;
}

function serve(W) {
  const dir = W.serveDir;
  const a = (W.rand() - 0.5) * 0.8;
  const sp = F.serveSpeed;
  spawnBall(W, (W.rand() - 0.5) * 2, 0, Math.sin(a) * sp, dir * Math.cos(a) * sp, 0);
  W.serveCount++;
  emit(W, { k: 'serve', dir });
}

function spawnOrb(W) {
  const fx = W.fx;
  let pool = POWERUP_KEYS.filter((k) => !(k === 'hole' && W.hole));
  // shields both healthy -> repair is useless
  const dmg = [1, -1].some((s) => W.cells[s].some((c) => c.hp < c.max));
  if (!dmg) pool = pool.filter((k) => k !== 'repair');
  let tot = 0;
  for (const k of pool) tot += POWERUPS[k].w;
  let r = W.rand() * tot, kind = pool[0];
  for (const k of pool) { r -= POWERUPS[k].w; if (r <= 0) { kind = k; break; } }
  const o = {
    id: W.nextId++, kind, x: (W.rand() - 0.5) * 10, z: (W.rand() - 0.5) * 7,
    vx: (W.rand() - 0.5) * 1.6, vz: (W.rand() - 0.5) * 1.2, r: 0.62, born: W.t, life: 15,
  };
  W.orbs.push(o);
  emit(W, { k: 'orb', kind, x: o.x, z: o.z, id: o.id });
  void fx;
}

export function fireBolt(W, side, x, z, free = false, from = 'paddle') {
  const m = W.meter[side];
  const od = m.odTime > 0;
  if (!free && !od) {
    if (m.charges < 1 || m.cool > 0) return false;
    m.charges -= 1;
  } else if (!free && m.cool > 0) return false;
  if (!free) m.cool = od ? 0.15 : F.boltCooldown;
  W.bolts.push({ id: W.nextId++, side, x, z: z - side * 0.5, vz: -side * F.boltSpeed, born: W.t, from });
  W.stats[side].bolts++;
  emit(W, { k: 'bolt', side, x, z, from });
  return true;
}

// ---------------------------------------------------------------- power-ups
export function applyPowerup(W, side, kind, src) {
  const fx = W.fx[side], ofx = W.fx[-side];
  W.stats[side].pickups++;
  emit(W, { k: 'pu', side, kind, x: src ? src.x : 0, z: src ? src.z : 0 });
  switch (kind) {
    case 'multi': {
      let b = W.balls.find((q) => q.owner === side && !q.caught) || W.balls.find((q) => !q.caught);
      if (!b) break;
      for (const a of [-0.32, 0.32]) {
        if (W.balls.length >= 5) break;
        const c = Math.cos(a), s = Math.sin(a);
        const nb = spawnBall(W, b.x, b.z, b.vx * c - b.vz * s, b.vx * s + b.vz * c, b.owner, { rally: b.rally, fire: b.fire });
        nb.spin = b.spin;
      }
      emit(W, { k: 'multi', x: b.x, z: b.z });
      break;
    }
    case 'titan': fx.titan = 11; fx.shrink = 0; break;
    case 'shrink': ofx.shrink = 9; ofx.titan = 0; break;
    case 'nova':
      fx.nova = 10;
      for (const b of W.balls) if (b.owner === side) b.fire = true;
      break;
    case 'repair':
      for (const c of W.cells[side]) { if (c.hp < c.max) { c.hp = c.max; c.buildT = W.t; } }
      break;
    case 'drone':
      fx.drone = 13;
      if (!W.drones.some((d) => d.side === side)) W.drones.push({ id: W.nextId++, side, x: 0, z: side * 6.9, fireT: 1.2, born: W.t });
      break;
    case 'hole':
      W.wells.push({ id: W.nextId++, x: (W.rand() - 0.5) * 6, z: -side * (3 + W.rand() * 2.5), m: 46, born: W.t, life: 9, side });
      break;
    case 'ghost': fx.ghost = 9; break;
    case 'magnet': fx.magnet = 3; fx.magnetT = 16; break;
    case 'barrier': fx.barrier = 12; fx.barrierHits = 3; break;
    case 'storm': {
      const alive = W.cells[-side].filter((c) => c.hp > 0);
      for (let n = 0; n < 3 && alive.length; n++) {
        const c = alive.splice(Math.floor(W.rand() * alive.length), 1)[0];
        c.hp = Math.max(0, c.hp - 1); c.hitT = W.t;
        emit(W, { k: 'lightning', side: -side, idx: c.i, x: c.x, z: -side * F.cellZ, hp: c.hp, delay: n * 0.16 });
        if (c.hp <= 0) { W.stats[side].cells++; }
      }
      break;
    }
    case 'chrono': fx.chrono = 10; break;
    case 'scope': fx.scope = 10; break;
  }
}

// ---------------------------------------------------------------- the tick
export function step(W, dt = STEP) {
  W.t += dt;
  const t = W.t;
  updateTimers(W, dt);
  for (const p of W.paddles) movePaddle(W, p, dt);
  handleInputs(W);
  if (W.boss) bossTick(W, dt);

  // serve
  if (!W.over && W.balls.length === 0) {
    W.serveTimer -= dt;
    if (W.serveTimer <= 0) { serve(W); W.serveTimer = 1.5; }
  }

  // caught balls ride their paddle
  for (const b of W.balls) {
    if (!b.caught) continue;
    const p = b.caught;
    b.x = clamp(p.x + b.catchOff, -F.hw + b.r, F.hw - b.r);
    b.z = p.z - p.side * (p.hd + b.r + 0.04);
    b.vx = p.vx; b.vz = p.vz;
    p.catchT += dt;
    if (p.catchT > 1.6) release(W, p);
  }

  const h = dt / SUB;
  for (let s = 0; s < SUB; s++) {
    for (let i = W.balls.length - 1; i >= 0; i--) {
      const b = W.balls[i];
      if (b.caught) continue;
      const pz = b.z;
      stepBallFree(W, b, h, t - dt + h * (s + 1), (kind, x, z, extra) => onFreeHit(W, b, kind, x, z, extra));
      paddleContacts(W, b);
      if (shieldContacts(W, b, pz)) W.balls.splice(i, 1);
    }
  }
  stepBolts(W, dt);
  stepOrbs(W, dt);
  stepDrones(W, dt);
  W.slow = 1;
}

function onFreeHit(W, b, kind, x, z, extra) {
  if (kind === 'wall') { if (W.t - (b.wallT || 0) > 0.05) emit(W, { k: 'wall', x, z, speed: extra.speed, id: b.id }); b.wallT = W.t; b.banks = (b.banks || 0) + 1; }
  else if (kind === 'bump') emit(W, { k: 'bump', x, z, i: extra.i, id: b.id });
  else if (kind === 'portal') emit(W, { k: 'portal', x, z, x2: extra.x2, z2: extra.z2, id: b.id });
  else if (kind === 'slider') { if (W.t - (b.slideT || 0) > 0.08) emit(W, { k: 'slider', x, z, i: extra.i }); b.slideT = W.t; }
}

function updateTimers(W, dt) {
  for (const s of [1, -1]) {
    const fx = W.fx[s], m = W.meter[s];
    for (const k of ['titan', 'shrink', 'nova', 'drone', 'ghost', 'barrier', 'chrono', 'scope', 'magnetT']) {
      if (fx[k] > 0) { fx[k] = Math.max(0, fx[k] - dt); if (fx[k] === 0) { emit(W, { k: 'fxend', side: s, fx: k }); if (k === 'magnetT') fx.magnet = 0; if (k === 'barrier') fx.barrierHits = 0; } }
    }
    if (m.cool > 0) m.cool -= dt;
    if (m.charges < F.boltCharges) {
      m.chargeT += dt;
      if (m.chargeT >= F.boltRecharge) { m.chargeT = 0; m.charges = Math.min(F.boltCharges, m.charges + 1); }
    } else m.chargeT = 0;
    if (m.odTime > 0) { m.odTime -= dt; if (m.odTime <= 0) { m.odTime = 0; emit(W, { k: 'odend', side: s }); } }
  }
  for (let i = W.wells.length - 1; i >= 0; i--) { const w = W.wells[i]; w.life -= dt; if (w.life <= 0) { W.wells.splice(i, 1); emit(W, { k: 'wellend', id: w.id }); } }
}

function movePaddle(W, p, dt) {
  const fx = W.fx[p.side], m = W.meter[p.side];
  const target = (fx.titan > 0 ? 1.6 : 1) * (fx.shrink > 0 ? 0.58 : 1) * (m.odTime > 0 ? 1.28 : 1);
  p.scale += (target - p.scale) * Math.min(1, dt * 7);
  p.hw = p.hwBase * p.scale;
  p.flash = Math.max(0, p.flash - dt * 3);
  if (p.stun > 0) {
    p.stun -= dt;
    p.vx *= 0.8; p.vz *= 0.8;
    p.x += p.vx * dt; p.z += p.vz * dt;
  } else {
    const inp = p.input;
    const maxS = p.maxSpeed * (m.odTime > 0 ? 1.15 : 1);
    let dvx, dvz;
    if (inp.mode === 'vel') { dvx = inp.vx * maxS; dvz = inp.vz * maxS; }
    else { dvx = clamp((inp.tx - p.x) * p.gain, -maxS, maxS); dvz = clamp((inp.tz - p.z) * p.gain, -maxS, maxS); }
    const a = p.accel * dt;
    p.vx += clamp(dvx - p.vx, -a, a);
    p.vz += clamp(dvz - p.vz, -a, a);
    p.x += p.vx * dt; p.z += p.vz * dt;
  }
  const xl = p.xMin + p.hw, xr = p.xMax - p.hw;
  if (p.x < xl) { p.x = xl; if (p.vx < 0) p.vx = 0; }
  if (p.x > xr) { p.x = xr; if (p.vx > 0) p.vx = 0; }
  const z0 = Math.min(p.zFront, p.zBack), z1 = Math.max(p.zFront, p.zBack);
  if (p.z < z0) { p.z = z0; if (p.vz < 0) p.vz = 0; }
  if (p.z > z1) { p.z = z1; if (p.vz > 0) p.vz = 0; }
}

function handleInputs(W) {
  for (const p of W.paddles) {
    const inp = p.input;
    const m = W.meter[p.side];
    if (inp.od) {
      inp.od = false;
      if (m.od >= 100 && m.odTime <= 0 && !W.over) {
        m.od = 0; m.odTime = F.odTime;
        emit(W, { k: 'od', side: p.side });
      }
    }
    if (inp.fire) {
      inp.fire = false;
      if (W.over || p.stun > 0) continue;
      if (p.caught) release(W, p);
      else if (fireBolt(W, p.side, p.x, p.z)) p.flash = 1;
    }
  }
}

function release(W, p) {
  const b = p.caught;
  if (!b) return;
  p.caught = null; b.caught = null;
  const r = returnShot(W, p, b.x, b.rally, { catchRelease: true });
  b.vx = r.vx; b.vz = r.vz; b.spin = r.spin; b.owner = p.side;
  b.z = p.z - p.side * (p.hd + b.r + 0.06);
  emit(W, { k: 'release', side: p.side, x: b.x, z: b.z, speed: r.speed });
  emit(W, { k: 'hit', side: p.side, x: b.x, z: b.z, speed: r.speed, smash: r.smash, u: r.u, spin: r.spin, id: b.id, pid: p.id });
}

function paddleContacts(W, b) {
  for (const p of W.paddles) {
    const s = p.side;
    if ((b.vz - p.vz) * s <= 0) continue;
    const cx = clamp(b.x, p.x - p.hw, p.x + p.hw);
    const cz = clamp(b.z, p.z - p.hd, p.z + p.hd);
    const dx = b.x - cx, dz = b.z - cz;
    if (dx * dx + dz * dz > b.r * b.r) continue;
    const inFront = (b.z - p.z) * s < 0;
    if (!inFront) {
      // clipped the paddle's end: glance off sideways, keep going
      const sx = Math.sign(b.x - p.x) || 1;
      b.vx = sx * Math.max(Math.abs(b.vx), 4.5);
      b.x = p.x + sx * (p.hw + b.r + 0.01);
      emit(W, { k: 'graze', side: s, x: b.x, z: b.z });
      continue;
    }
    const fx = W.fx[s];
    if (fx.magnet > 0 && !p.caught && !p.boss) {
      fx.magnet--; if (fx.magnet <= 0) fx.magnetT = 0;
      p.caught = b; p.catchT = 0; b.caught = p;
      b.catchOff = clamp(b.x - p.x, -p.hw * 0.85, p.hw * 0.85);
      b.owner = s; b.fire = b.fire && b.owner === s;
      W.stats[s].hits++;
      emit(W, { k: 'catch', side: s, x: b.x, z: b.z, id: b.id });
      return;
    }
    const r = returnShot(W, p, b.x, b.rally);
    const enemyFire = b.fire && b.owner === -s;
    b.vx = r.vx; b.vz = r.vz; b.spin = r.spin;
    b.z = p.z - s * (p.hd + b.r + 0.01);
    b.rally = Math.min(F.maxRally, b.rally * 1.035 + 0.12);
    b.owner = s; b.hits++; b.banks = 0;
    b.fire = enemyFire ? false : (b.fire || fx.nova > 0 || W.meter[s].odTime > 0);
    p.hitT = W.t;
    W.rally++; W.maxRally = Math.max(W.maxRally, W.rally);
    const st = W.stats[s];
    st.hits++;
    if (r.smash > 0) st.smashes++;
    if (Math.abs(r.spin) > 3) st.curves++;
    const m = W.meter[s];
    if (m.odTime <= 0) m.od = Math.min(100, m.od + 6 + (r.smash > 0 ? 6 : 0));
    m.chargeT += 0.6; // returns speed up bolt recharge
    emit(W, { k: 'hit', side: s, x: b.x, z: b.z, speed: r.speed, smash: r.smash, u: r.u, spin: r.spin, id: b.id, pid: p.id, doused: enemyFire });
    return;
  }
}

// returns true when the ball is gone (into a core)
function shieldContacts(W, b, prevZ) {
  const s = b.vz > 0 ? 1 : -1;
  const front = s * b.z + b.r, prevFront = s * prevZ + b.r;
  const fx = W.fx[s];
  // barrier
  const barZ = F.cellZ - F.cellHD - 0.55;
  if (fx.barrier > 0 && prevFront < barZ && front >= barZ) {
    b.vz = -b.vz; b.z = s * (barZ - b.r) - s * 0.01;
    b.rally = Math.max(F.serveSpeed, b.rally * 0.92);
    fx.barrierHits--;
    emit(W, { k: 'barrier', side: s, x: b.x, z: b.z, left: fx.barrierHits });
    if (fx.barrierHits <= 0) { fx.barrier = 0; emit(W, { k: 'fxend', side: s, fx: 'barrier' }); }
    return false;
  }
  const cz = F.cellZ - F.cellHD;
  if (prevFront < cz && front >= cz) {
    const c = W.cells[s][cellIndex(b.x)];
    if (c.hp > 0) {
      const attacker = -s;
      if (b.fire && b.owner === attacker) {
        c.hp = 0; c.hitT = W.t;
        b.fire = false;
        W.stats[attacker].cells++;
        bumpOd(W, attacker, 10);
        emit(W, { k: 'cell', side: s, idx: c.i, hp: 0, x: c.x, z: s * F.cellZ, pierce: true, by: b.owner });
        return false;
      }
      c.hp = Math.max(0, c.hp - 1); c.hitT = W.t;
      b.vz = -b.vz; b.z = s * (cz - b.r) - s * 0.01;
      b.spin *= 0.3;
      b.rally = Math.max(F.serveSpeed, b.rally * 0.86);
      const sp = Math.hypot(b.vx, b.vz), k = Math.min(1, b.rally / sp);
      b.vx *= k; b.vz *= k;
      if (c.hp <= 0) { W.stats[attacker].cells++; bumpOd(W, attacker, 10); }
      W.rally = 0;
      emit(W, { k: 'cell', side: s, idx: c.i, hp: c.hp, x: c.x, z: s * F.cellZ, by: b.owner });
      return false;
    }
  }
  if (s * b.z + b.r >= F.goalZ) {
    const core = W.cores[s];
    if (W.over) return true;
    const dmg = b.fire && b.owner === -s ? 2 : 1;
    core.hp = Math.max(0, core.hp - dmg); core.hitT = W.t;
    W.stats[-s].coreHits++;
    bumpOd(W, s, 28); // the hurt side charges faster: comeback fuel
    bumpOd(W, -s, 8);
    W.rally = 0;
    W.serveDir = s;
    W.serveTimer = 1.9;
    emit(W, { k: 'core', side: s, hp: core.hp, x: b.x, z: s * F.goalZ, dmg, by: b.owner, id: b.id, speed: Math.hypot(b.vx, b.vz) });
    if (core.hp <= 0) {
      W.over = true; W.winner = -s; W.koT = W.t;
      emit(W, { k: 'ko', side: s, winner: -s, x: b.x, z: s * F.goalZ });
    } else if (W.boss && s === W.boss.side && W.boss.phase === 1 && core.hp <= core.max / 2) bossPhase2(W);
    return true;
  }
  return false;
}

const bumpOd = (W, s, n) => { const m = W.meter[s]; if (m.odTime <= 0) m.od = Math.min(100, m.od + n); };

function stepBolts(W, dt) {
  for (let i = W.bolts.length - 1; i >= 0; i--) {
    const o = W.bolts[i];
    const pz = o.z;
    o.z += o.vz * dt;
    const s = -o.side; // the side it travels toward
    let dead = false;
    // enemy paddles
    for (const p of W.paddles) {
      if (p.side !== s) continue;
      if (Math.abs(o.x - p.x) < p.hw + 0.16 && (pz - p.z) * s <= p.hd && (o.z - p.z) * s >= -p.hd - 0.2) {
        if (W.meter[s].odTime > 0 || W.t < p.immuneT) emit(W, { k: 'deflect', side: s, x: o.x, z: o.z });
        else {
          p.stun = F.stunTime * (p.boss ? 0.6 : 1) * (o.from === 'turret' ? 0.55 : 1); p.immuneT = W.t + p.stun + 1.6; W.stats[o.side].stuns++;
          if (p.caught) release(W, p);
          bumpOd(W, o.side, 4);
          emit(W, { k: 'stun', side: s, x: o.x, z: p.z, pid: p.id, by: o.side });
        }
        dead = true; break;
      }
    }
    if (!dead) for (const b of W.balls) {
      if (b.caught) continue;
      if (Math.abs(o.x - b.x) < b.r + 0.18 && Math.abs(o.z - b.z) < b.r + 0.5) {
        b.vz += -o.side * 0 + (o.vz > 0 ? 1 : -1) * 6.5;
        b.vx += (b.x - o.x) * 3;
        const sp = Math.hypot(b.vx, b.vz), lim = clamp(sp, 8, F.maxSpeed);
        b.vx *= lim / sp; b.vz *= lim / sp;
        b.owner = o.side;
        emit(W, { k: 'boltball', side: o.side, x: b.x, z: b.z, id: b.id });
        dead = true; break;
      }
    }
    if (!dead) for (let j = W.orbs.length - 1; j >= 0; j--) {
      const q = W.orbs[j];
      if (Math.abs(o.x - q.x) < q.r + 0.12 && Math.abs(o.z - q.z) < q.r + 0.5) {
        W.orbs.splice(j, 1);
        applyPowerup(W, o.side, q.kind, q);
        dead = true; break;
      }
    }
    if (!dead) for (let j = W.bolts.length - 1; j >= 0; j--) {
      const q = W.bolts[j];
      if (q === o || q.side === o.side) continue;
      if (Math.abs(q.x - o.x) < 0.42 && Math.abs(q.z - o.z) < 0.8) {
        emit(W, { k: 'boltbolt', x: (o.x + q.x) / 2, z: (o.z + q.z) / 2 });
        W.bolts.splice(j, 1);
        if (j < i) i--;
        dead = true; break;
      }
    }
    if (!dead) for (let j = W.drones.length - 1; j >= 0; j--) {
      const d = W.drones[j];
      if (d.side === s && Math.abs(o.x - d.x) < 0.55 && Math.abs(o.z - d.z) < 0.6) {
        W.drones.splice(j, 1); W.fx[s].drone = 0;
        emit(W, { k: 'dronekill', side: s, x: d.x, z: d.z });
        dead = true; break;
      }
    }
    if (!dead) {
      const fz = s * o.z;
      const barZ = F.cellZ - F.cellHD - 0.55;
      if (W.fx[s].barrier > 0 && s * pz < barZ && fz >= barZ) {
        emit(W, { k: 'barrier', side: s, x: o.x, z: s * barZ, bolt: true });
        dead = true;
      } else if (s * pz < F.cellZ - F.cellHD && fz >= F.cellZ - F.cellHD) {
        const c = W.cells[s][cellIndex(o.x)];
        if (c.hp > 0) {
          // turret fire only splashes on shields; drones chip them lightly
          const dmg = o.from === 'turret' ? 0 : o.from === 'drone' ? 0.25 : 0.5;
          c.hp = Math.max(0, c.hp - dmg); c.hitT = W.t;
          if (c.hp <= 0) W.stats[o.side].cells++;
          emit(W, { k: 'boltcell', side: s, idx: c.i, hp: c.hp, x: o.x, z: s * F.cellZ });
          dead = true;
        }
      } else if (fz > F.goalZ) {
        emit(W, { k: 'fizzle', side: s, x: o.x, z: o.z });
        dead = true;
      }
    }
    if (dead) W.bolts.splice(i, 1);
  }
}

function stepOrbs(W, dt) {
  if (!W.over && W.t >= W.nextOrb) {
    if (W.orbs.length < 2) spawnOrb(W);
    W.nextOrb = W.t + 6.5 + W.rand() * 5.5;
  }
  for (let i = W.orbs.length - 1; i >= 0; i--) {
    const o = W.orbs[i];
    o.life -= dt;
    o.x += o.vx * dt; o.z += o.vz * dt;
    if (Math.abs(o.x) > 5.6) { o.vx = -o.vx; o.x = Math.sign(o.x) * 5.6; }
    if (Math.abs(o.z) > 4.6) { o.vz = -o.vz; o.z = Math.sign(o.z) * 4.6; }
    if (o.life <= 0) { W.orbs.splice(i, 1); emit(W, { k: 'orbgone', id: o.id, x: o.x, z: o.z }); continue; }
    if (W.t - o.born < 0.6) continue; // materialising
    for (const b of W.balls) {
      if (b.caught) continue;
      const dx = b.x - o.x, dz = b.z - o.z;
      if (dx * dx + dz * dz < (b.r + o.r) ** 2) {
        W.orbs.splice(i, 1);
        if (b.owner) applyPowerup(W, b.owner, o.kind, o);
        else emit(W, { k: 'orbgone', id: o.id, x: o.x, z: o.z, popped: true });
        break;
      }
    }
  }
}

function stepDrones(W, dt) {
  for (let i = W.drones.length - 1; i >= 0; i--) {
    const d = W.drones[i];
    if (W.fx[d.side].drone <= 0) { W.drones.splice(i, 1); emit(W, { k: 'droneend', side: d.side, x: d.x, z: d.z }); continue; }
    // track the rival paddle nearest the middle
    const foes = paddlesOf(W, -d.side);
    const tx = foes.length ? foes[0].x : 0;
    d.x += clamp(tx - d.x, -7 * dt, 7 * dt);
    d.fireT -= dt;
    if (d.fireT <= 0 && !W.over) { d.fireT = 1.05; fireBolt(W, d.side, d.x, d.z, true, 'drone'); }
  }
}

// ---------------------------------------------------------------- the Monolith
function bossTick(W, dt) {
  const B = W.boss;
  if (W.over) { B.laser = null; return; }
  const bossP = paddlesOf(W, B.side);
  B.turretT -= dt;
  if (B.turretT <= 0 && bossP.length) {
    B.turretT = (B.phase === 1 ? 2.6 : 1.9) + W.rand() * 0.8;
    const p = bossP[Math.floor(W.rand() * bossP.length)];
    const end = W.rand() < 0.5 ? -1 : 1;
    if (p.stun <= 0) fireBolt(W, B.side, clamp(p.x + end * (p.hw - 0.3), -F.hw + 0.3, F.hw - 0.3), p.z, true, 'turret');
  }
  B.laserT -= dt;
  const foe = paddlesOf(W, -B.side)[0];
  if (!B.laser && B.laserT <= 0) {
    B.laser = { x: clamp(foe.x + foe.vx * 0.35, -F.hw + 0.5, F.hw - 0.5), charge: 1.45, fire: 0 };
    emit(W, { k: 'lasercharge', x: B.laser.x, side: B.side });
  }
  if (B.laser) {
    const L = B.laser;
    if (L.charge > 0) {
      L.charge -= dt;
      if (L.charge <= 0) {
        L.fire = 0.4;
        const s = -B.side;
        const blocked = Math.abs(foe.x - L.x) < foe.hw + 0.25;
        if (blocked && W.meter[s].odTime <= 0) { foe.stun = 1.3; if (foe.caught) release(W, foe); emit(W, { k: 'laser', x: L.x, hit: 'paddle', side: s, z: foe.z }); }
        else if (blocked) emit(W, { k: 'laser', x: L.x, hit: 'deflect', side: s, z: foe.z });
        else {
          const c = W.cells[s][cellIndex(L.x)];
          if (c.hp > 0) { c.hp = Math.max(0, c.hp - 1); c.hitT = W.t; emit(W, { k: 'laser', x: L.x, hit: 'cell', side: s, idx: c.i, hp: c.hp, z: s * F.cellZ }); }
          else emit(W, { k: 'laser', x: L.x, hit: 'none', side: s, z: s * F.goalZ });
        }
      }
    } else {
      L.fire -= dt;
      if (L.fire <= 0) { B.laser = null; B.laserT = (B.phase === 1 ? 12 : 9) + W.rand() * 3; }
    }
  }
}

function bossPhase2(W) {
  const B = W.boss;
  B.phase = 2;
  const [p] = paddlesOf(W, B.side);
  p.hwBase = 1.2; p.xMin = -F.hw; p.xMax = 2.2; p.zFront = B.side * 7.9; p.zBack = B.side * 8.6; p.homeZ = B.side * 8.2; p.part = 1;
  const q = newPaddle(W.nextId++, B.side, { hw: 1.2, boss: true, part: 2 });
  q.x = p.x + 1.5; q.xMin = -2.2; q.xMax = F.hw; q.zFront = B.side * 9.6; q.zBack = B.side * F.zoneBack; q.homeZ = B.side * 9.85; q.z = q.homeZ;
  q.maxSpeed = p.maxSpeed; q.accel = p.accel; q.gain = p.gain;
  W.paddles.push(q);
  for (const c of W.cells[B.side]) if (c.hp <= 0) { c.hp = 1; c.buildT = W.t; }
  emit(W, { k: 'phase2', side: B.side, pid: q.id });
}

export function drainEvents(W) {
  const e = W.events;
  W.events = [];
  return e;
}

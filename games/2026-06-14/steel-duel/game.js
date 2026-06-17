/* Steel Duel — HD remaster of Atari Tank (1974).
   Deterministic fixed-timestep sim, A* tank AI (skill slider), attract mode, mouse + twin-stick
   controls, destructible walls, render, UI, scores, window.__g hooks + self-tests. */
(function () {
  'use strict';

  /* ===================== constants ===================== */
  const COLS = 28, ROWS = 18, TILE = 34, HUD_H = 64;
  const FIELD_W = COLS * TILE, FIELD_H = ROWS * TILE;
  const LW = FIELD_W, LH = HUD_H + FIELD_H;
  const STEP = 1 / 60;
  const TANK_R = 12;
  const TANK_MAX_HP = 4;
  const ACCEL = 0.18, MAX_FWD = 2.5, MAX_REV = 1.5, FRICTION = 0.86, HULL_TURN = 0.055;
  const TURRET_TURN = 0.16;                         // max turret rad/tick (human aim is instant)
  const SHELL_SPD = 7.0, SHELL_LIFE = 1.7, SHELL_R = 3, MAX_SHELLS = 1, FIRE_CD = 0.4;
  const FREEZE = 1.3, MINE_R = 11;
  const DEFAULT_TIME = 60, FLASH_AT = 20;
  const WALL_MAX = 8;                               // interior wall hit points

  const WALL_DEF = [
    [4, 3, 4, 1], [12, 1, 1, 3], [15, 1, 1, 3], [20, 3, 4, 1],
    [2, 6, 2, 2], [5, 8, 3, 1], [8, 6, 1, 3], [9, 9, 1, 3],
    [19, 6, 1, 4], [20, 8, 3, 1], [24, 6, 2, 2],
    [4, 13, 4, 1], [8, 14, 1, 3], [12, 15, 1, 2], [15, 15, 1, 2],
    [19, 14, 1, 3], [20, 13, 4, 1],
    [2, 15, 1, 2], [3, 16, 4, 1], [21, 16, 4, 1], [24, 15, 1, 2],
    [6, 5, 1, 2], [21, 5, 1, 2], [11, 6, 2, 1], [15, 6, 2, 1],
    [11, 11, 2, 1], [15, 11, 2, 1],
  ];
  const MINE_RECT = { c0: 10, r0: 6, c1: 17, r1: 11 };
  const SPAWNS = [{ c: 2, r: 2, a: 0 }, { c: 25, r: 15, a: Math.PI }];
  const COOP_SPAWNS = [
    { c: 2, r: 2, a: 0, team: 'ally' },
    { c: 2, r: 15, a: 0, team: 'ally' },
    { c: 25, r: 2, a: Math.PI, team: 'enemy' },
    { c: 25, r: 15, a: Math.PI, team: 'enemy' },
  ];
  const ONLINE_WS = window.STEEL_DUEL_WS || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'ws://127.0.0.1:8787/ws'
    : 'wss://steel-duel-online.jez237.workers.dev/ws');

  /* ===================== rng ===================== */
  function mulberry32(a) {
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  let rng = mulberry32(1);

  /* ===================== maze ===================== */
  const solid = [], wallHP = [];
  function isBorder(c, r) { return r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1; }
  function buildMaze() {
    for (let r = 0; r < ROWS; r++) { solid[r] = []; wallHP[r] = []; for (let c = 0; c < COLS; c++) { const b = isBorder(c, r); solid[r][c] = b; wallHP[r][c] = b ? Infinity : 0; } }
    for (const [c, r, w, h] of WALL_DEF) for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) { solid[y][x] = true; wallHP[y][x] = WALL_MAX; }
  }
  function tileCenter(c, r) { return { x: c * TILE + TILE / 2, y: HUD_H + r * TILE + TILE / 2 }; }
  function tileOf(t) { return { c: Math.max(0, Math.min(COLS - 1, Math.floor(t.x / TILE))), r: Math.max(0, Math.min(ROWS - 1, Math.floor((t.y - HUD_H) / TILE))) }; }
  function isSolidAt(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor((y - HUD_H) / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true;
    return solid[r][c];
  }

  /* ===================== state ===================== */
  let state = 'attract';        // attract | playing | paused | over | how | scores
  let mode = 'cpu';             // cpu | duel | coop | watch
  let aiLevel = 45;             // 0..100 difficulty slider
  let watchLevel = [45, 45];    // CPU 1 / CPU 2 watch-mode sliders
  let visualMode = 'hd';
  let muted = false, headless = false, touchActive = false;
  let tanks = [], shells = [], mines = [];
  let tankSkill = [0.45, 0.45, 0.55, 0.62];
  let score = { p1: 0, p2: 0 };
  let timeLeft = DEFAULT_TIME, matchTime = DEFAULT_TIME;
  let freezeT = 0, winner = null, tick = 0, shake = 0;
  let bots = [false, false, true, true];
  let mouseX = LW / 2, mouseY = LH / 2;
  let online = { ws: null, room: '', role: null, id: null, mode: 'duel', status: '', connected: false, lastInput: 0, lastSnapshot: 0, peers: [] };

  let controls = [ctrl(), ctrl(), ctrl(), ctrl()];
  function ctrl() { return { fwd: false, back: false, left: false, right: false, fire: false, driveVec: null, aimVec: null }; }
  function silent() { return headless || state === 'attract'; }

  /* ===================== entities ===================== */
  function spawnFor(id) { return mode === 'coop' ? COOP_SPAWNS[id] : SPAWNS[id]; }
  function makeTank(id) {
    const s = spawnFor(id), p = tileCenter(s.c, s.r);
    const team = s.team || (id === 0 ? 'p1' : 'p2');
    return { id, team, x: p.x, y: p.y, heading: s.a, turret: s.a, speed: 0, vx: 0, vy: 0, dist: 0, cd: 0, flash: 0, hp: TANK_MAX_HP, alive: true, path: null, pathTick: -999 };
  }
  function resetMatch(seed) {
    rng = mulberry32((seed | 0) || 1);
    buildMaze();
    const count = mode === 'coop' ? 4 : 2;
    tanks = Array.from({ length: count }, (_, id) => makeTank(id));
    shells = []; mines = [];
    placeMines();
    score = { p1: 0, p2: 0 };
    timeLeft = matchTime; freezeT = 0; winner = null; tick = 0; shake = 0;
    if (SDArt) { TRACKS.clear(); PARTS.clear(); DECALS.clear(); }
  }
  function copyGrid(g) { return g.map(row => row.slice()); }
  function encodeHPGrid(g) { return g.map(row => row.map(v => v === Infinity ? 'I' : v)); }
  function decodeHPGrid(g) { return g.map(row => row.map(v => v === 'I' ? Infinity : v)); }
  function tankNet(t) {
    return {
      id: t.id, team: t.team, x: t.x, y: t.y, heading: t.heading, turret: t.turret,
      speed: t.speed, vx: t.vx, vy: t.vy, dist: t.dist, cd: t.cd, flash: t.flash,
      hp: t.hp, alive: t.alive, path: null, pathTick: -999,
    };
  }
  function makeSnapshot() {
    return {
      mode, state, score, timeLeft, matchTime, freezeT, winner, tick,
      tanks: tanks.map(tankNet),
      shells: shells.map(s => ({ ...s })),
      mines: mines.map(m => ({ ...m })),
      solid: copyGrid(solid),
      wallHP: encodeHPGrid(wallHP),
    };
  }
  function applySnapshot(s) {
    if (!s || !Array.isArray(s.tanks)) return;
    mode = s.mode || mode; state = s.state || state;
    score = { p1: Number(s.score && s.score.p1) || 0, p2: Number(s.score && s.score.p2) || 0 };
    timeLeft = Number(s.timeLeft) || 0; matchTime = Number(s.matchTime) || DEFAULT_TIME;
    freezeT = Number(s.freezeT) || 0; winner = s.winner || null; tick = Number(s.tick) || tick;
    tanks = s.tanks.map(t => ({ ...t, path: null, pathTick: -999 }));
    shells = Array.isArray(s.shells) ? s.shells.map(sh => ({ ...sh })) : [];
    mines = Array.isArray(s.mines) ? s.mines.map(m => ({ ...m })) : [];
    if (Array.isArray(s.solid)) for (let r = 0; r < ROWS; r++) solid[r] = s.solid[r].slice();
    if (Array.isArray(s.wallHP)) {
      const hp = decodeHPGrid(s.wallHP);
      for (let r = 0; r < ROWS; r++) wallHP[r] = hp[r].slice();
    }
    if (state === 'over') showOverlay('over');
    else if (state === 'playing') hideAllOverlays();
  }
  function placeMines() {
    const cand = [];
    for (let r = MINE_RECT.r0; r <= MINE_RECT.r1; r++) for (let c = MINE_RECT.c0; c <= MINE_RECT.c1; c++) if (!solid[r][c]) cand.push(tileCenter(c, r));
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = cand[i]; cand[i] = cand[j]; cand[j] = t; }
    for (let i = 0; i < Math.min(16, cand.length); i++) mines.push({ x: cand[i].x, y: cand[i].y, ph: rng() * 7 });
  }

  /* ===================== geometry helpers ===================== */
  function wrapAngle(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  function rotToward(cur, target, maxStep) { const d = wrapAngle(target - cur); if (Math.abs(d) <= maxStep) return target; return cur + Math.sign(d) * maxStep; }
  function lineClear(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), n = Math.ceil(d / 8);
    for (let i = 1; i < n; i++) { const t = i / n; if (isSolidAt(x0 + dx * t, y0 + dy * t)) return false; }
    return true;
  }

  /* ===================== A* pathfinding ===================== */
  function aStar(s, g, blocked) {
    if (s.c === g.c && s.r === g.r) return [s];
    const key = (c, r) => r * COLS + c;
    const open = [{ c: s.c, r: s.r, f: 0, g: 0 }], came = {}, gsc = {}; gsc[key(s.c, s.r)] = 0;
    const seen = {}; seen[key(s.c, s.r)] = true;
    const NB = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    let guard = 0;
    while (open.length && guard++ < 4000) {
      let bi = 0; for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
      const cur = open.splice(bi, 1)[0];
      if (cur.c === g.c && cur.r === g.r) {
        const path = []; let k = key(cur.c, cur.r), cc = cur.c, cr = cur.r;
        while (k !== key(s.c, s.r)) { path.push({ c: cc, r: cr }); const p = came[k]; cc = p.c; cr = p.r; k = key(cc, cr); }
        path.push({ c: s.c, r: s.r }); path.reverse(); return path;
      }
      for (const [dc, dr] of NB) {
        const nc = cur.c + dc, nr = cur.r + dr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
        const goalNode = (nc === g.c && nr === g.r);
        if (!goalNode && blocked(nc, nr)) continue;
        const ng = cur.g + 1, nk = key(nc, nr);
        if (gsc[nk] === undefined || ng < gsc[nk]) {
          gsc[nk] = ng; came[nk] = { c: cur.c, r: cur.r };
          const h = Math.abs(nc - g.c) + Math.abs(nr - g.r);
          open.push({ c: nc, r: nr, f: ng + h, g: ng });
        }
      }
    }
    return null;
  }

  /* ===================== AI ===================== */
  function safeDir(me, ang) {
    const opts = [0, 0.4, -0.4, 0.85, -0.85, 1.3, -1.3, 1.9, -1.9];
    for (const off of opts) {
      const a = ang + off, lx = me.x + Math.cos(a) * 30, ly = me.y + Math.sin(a) * 30;
      if (isSolidAt(lx, ly)) continue;
      let mineHit = false; for (const m of mines) if (Math.hypot(m.x - lx, m.y - ly) < MINE_R + TANK_R + 6) { mineHit = true; break; }
      if (!mineHit) return a;
    }
    return ang;
  }
  function nextWaypoint(me, foe) {
    if (!me.path || tick - me.pathTick > 8) {
      const mineSet = {}; for (const m of mines) { const c = Math.floor(m.x / TILE), r = Math.floor((m.y - HUD_H) / TILE); mineSet[r * COLS + c] = true; }
      const blocked = (c, r) => solid[r][c] || mineSet[r * COLS + c];
      me.path = aStar(tileOf(me), tileOf(foe), blocked); me.pathTick = tick;
    }
    const p = me.path; if (!p || p.length < 2) return null;
    let idx = 1; while (idx < p.length - 1) { const c = tileCenter(p[idx].c, p[idx].r); if (Math.hypot(c.x - me.x, c.y - me.y) < 16) idx++; else break; }
    return tileCenter(p[idx].c, p[idx].r);
  }
  function opposing(a, b) { return a && b && a.team !== b.team; }
  function nearestFoe(me) {
    let best = null, bestD = Infinity;
    for (const t of tanks) {
      if (!t || !t.alive || !opposing(me, t)) continue;
      const d = Math.hypot(t.x - me.x, t.y - me.y);
      if (d < bestD) { best = t; bestD = d; }
    }
    return best;
  }
  function aiCommand(i, cmd) {
    const me = tanks[i], foe = nearestFoe(me), skill = tankSkill[i] == null ? 0.5 : tankSkill[i];
    cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = false;
    if (!foe || !me.alive) return;
    const dx = foe.x - me.x, dy = foe.y - me.y, dist = Math.hypot(dx, dy), los = lineClear(me.x, me.y, foe.x, foe.y);
    // ---- aim (lead prediction + skill-scaled error) ----
    const ttime = dist / SHELL_SPD;
    const px = foe.x + foe.vx * ttime * skill, py = foe.y + foe.vy * ttime * skill;
    let aim = Math.atan2(py - me.y, px - me.x) + (1 - skill) * 0.55 * Math.sin(tick * 0.13 + i * 2.3);
    cmd.aim = aim; cmd.turretTurn = TURRET_TURN * (0.3 + 0.7 * skill);
    const onTarget = Math.abs(wrapAngle(me.turret - aim)) < 0.14;
    const cadence = Math.abs(Math.sin(tick * 0.41 + i * 1.7)) < (0.4 + 0.6 * skill);
    cmd.fire = onTarget && los && me.cd <= 0 && freezeT <= 0 && cadence;
    // ---- movement ----
    let driveAngle = null, throttle = 0; const IDEAL_MIN = 110, IDEAL_MAX = 320;
    let dodge = null;
    if (skill > 0.5) {
      for (const s of shells) { if (s.owner === i) continue; const toward = s.vx * (me.x - s.x) + s.vy * (me.y - s.y); const d = Math.hypot(me.x - s.x, me.y - s.y); if (toward > 0 && d < 150) { dodge = Math.atan2(s.vy, s.vx) + Math.PI / 2; break; } }
    }
    if (dodge != null) { driveAngle = dodge; throttle = 1; }
    else if (!los || dist > IDEAL_MAX) { const wp = nextWaypoint(me, foe); driveAngle = wp ? Math.atan2(wp.y - me.y, wp.x - me.x) : Math.atan2(dy, dx); throttle = 1; }
    else if (dist < IDEAL_MIN) { driveAngle = Math.atan2(-dy, -dx); throttle = 1; }
    else if (skill > 0.4) { driveAngle = Math.atan2(dy, dx) + Math.PI / 2 * ((Math.floor(tick / 45 + i) % 2) ? 1 : -1); throttle = 0.75; }
    if (driveAngle != null) {
      driveAngle = safeDir(me, driveAngle);
      const da = wrapAngle(driveAngle - me.heading);
      cmd.turn = Math.max(-1, Math.min(1, da / 0.4));
      cmd.throttle = Math.abs(da) < 1.0 ? throttle : 0;
    }
  }

  /* ===================== human command ===================== */
  function humanCommand(i, cmd) {
    const c = controls[i], me = tanks[i];
    cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = true;
    if (c.driveVec && c.driveVec.active) { const da = wrapAngle(c.driveVec.angle - me.heading); cmd.turn = Math.max(-1, Math.min(1, da / 0.4)); cmd.throttle = c.driveVec.mag * Math.max(0, Math.cos(da)); }
    else { cmd.turn = (c.right ? 1 : 0) - (c.left ? 1 : 0); cmd.throttle = (c.fwd ? 1 : 0) - (c.back ? 1 : 0); }
    if (mode === 'duel' || mode === 'coop') { cmd.aim = null; cmd.fire = c.fire; }      // turret locked to hull (faithful)
    else {                                                            // 1P vs CPU: independent turret
      if (c.aimVec && c.aimVec.active) { cmd.aim = c.aimVec.angle; cmd.fire = true; }
      else if (touchActive) { cmd.aim = null; cmd.fire = c.fire; }
      else { cmd.aim = Math.atan2(mouseY - me.y, mouseX - me.x); cmd.fire = c.fire; }
    }
  }

  /* ===================== sim ===================== */
  function update() {
    tick++;
    if (state !== 'playing' && state !== 'attract') return;
    if (online.connected && online.role !== 'p1' && state === 'playing') return;
    if (freezeT > 0) { freezeT -= STEP; if (freezeT <= 0) reviveTanks(); }
    let moving = 0;
    const cmd = { turn: 0, throttle: 0, aim: null, fire: false, aimInstant: false, turretTurn: TURRET_TURN };
    for (let i = 0; i < tanks.length; i++) {
      const t = tanks[i]; if (!t.alive) continue;
      cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = false; cmd.turretTurn = TURRET_TURN;
      if (bots[i]) aiCommand(i, cmd); else humanCommand(i, cmd);
      applyCommand(t, cmd);
      if (Math.abs(t.speed) > 0.4) { t.dist += Math.abs(t.speed); if (SDArt && tick % 3 === 0) TRACKS.add(t.x, t.y, t.heading); moving += Math.abs(t.speed); }
      if (t.flash > 0) t.flash -= STEP * 6;
      if (t.cd > 0) t.cd -= STEP;
      const inFlight = shells.filter(s => s.owner === i).length;
      if (cmd.fire && t.cd <= 0 && freezeT <= 0 && inFlight < MAX_SHELLS) fire(t);
      for (let m = mines.length - 1; m >= 0; m--) {
        if (Math.hypot(mines[m].x - t.x, mines[m].y - t.y) < MINE_R + TANK_R - 4) {
          const mx = mines[m].x, my = mines[m].y; mines.splice(m, 1);
          if (SDArt) { PARTS.explosion(mx, my, '#ff8a4f'); DECALS.add(mx, my, 26); }
          if (!silent()) SDAudio.mine(); killTank(i); break;
        }
      }
    }
    if (!silent()) SDAudio.engine(Math.min(0.12, moving * 0.02));

    for (let s = shells.length - 1; s >= 0; s--) {
      const sh = shells[s]; sh.x += sh.vx; sh.y += sh.vy; sh.life -= STEP;
      if (sh.life <= 0) { shells.splice(s, 1); continue; }
      if (isSolidAt(sh.x, sh.y)) { damageWall(sh.x, sh.y); shells.splice(s, 1); continue; }
      let hit = false;
      for (let i = 0; i < tanks.length; i++) {
        const t = tanks[i], owner = tanks[sh.owner];
        if (t.alive && i !== sh.owner && opposing(owner, t) && Math.hypot(t.x - sh.x, t.y - sh.y) < TANK_R + SHELL_R) { damageTank(i, sh.owner); hit = true; break; }
      }
      if (hit) shells.splice(s, 1);
    }
    if (shake > 0) shake *= 0.85;

    timeLeft -= STEP;
    if (timeLeft <= 0) { timeLeft = 0; if (state === 'attract') startAttract(); else endMatch(); }
  }

  function applyCommand(t, cmd) {
    t.heading += Math.max(-1, Math.min(1, cmd.turn)) * HULL_TURN;
    const th = Math.max(-1, Math.min(1, cmd.throttle)), target = th * (th >= 0 ? MAX_FWD : MAX_REV);
    t.speed += (target - t.speed) * ACCEL;
    if (Math.abs(target) < 0.01) { t.speed *= FRICTION; if (Math.abs(t.speed) < 0.02) t.speed = 0; }
    moveTank(t);
    t.vx = Math.cos(t.heading) * t.speed; t.vy = Math.sin(t.heading) * t.speed;
    if (cmd.aim == null) t.turret = t.heading;
    else if (cmd.aimInstant) t.turret = cmd.aim;
    else t.turret = rotToward(t.turret, cmd.aim, cmd.turretTurn || TURRET_TURN);
  }
  function moveTank(t) {
    const nx = t.x + Math.cos(t.heading) * t.speed, ny = t.y + Math.sin(t.heading) * t.speed;
    if (!circleHitsWall(nx, t.y)) t.x = nx; else t.speed *= 0.3;
    if (!circleHitsWall(t.x, ny)) t.y = ny; else t.speed *= 0.3;
    for (const o of tanks) {
      if (!o || o.id === t.id || !o.alive) continue;
      const dx = t.x - o.x, dy = t.y - o.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < TANK_R * 2) { const push = (TANK_R * 2 - d) / 2; t.x += dx / d * push; t.y += dy / d * push; }
    }
  }
  function circleHitsWall(x, y) { for (let a = 0; a < 8; a++) { const ang = a / 8 * 7; if (isSolidAt(x + Math.cos(ang) * TANK_R, y + Math.sin(ang) * TANK_R)) return true; } return isSolidAt(x, y); }
  function fire(t) {
    t.cd = FIRE_CD; t.flash = 1;
    const bx = t.x + Math.cos(t.turret) * 21, by = t.y + Math.sin(t.turret) * 21;
    shells.push({ x: bx, y: by, vx: Math.cos(t.turret) * SHELL_SPD, vy: Math.sin(t.turret) * SHELL_SPD, life: SHELL_LIFE, owner: t.id });
    if (!silent()) SDAudio.fire();
  }
  function damageWall(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor((y - HUD_H) / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (SDArt) PARTS.explosion(x, y, '#cfd6e6'); if (!silent()) SDAudio.wall(); shake = Math.max(shake, 2.5);
    if (!isFinite(wallHP[r][c])) return;               // border: indestructible
    wallHP[r][c] -= 1;
    if (wallHP[r][c] <= 0) { solid[r][c] = false; wallHP[r][c] = 0; if (SDArt) { PARTS.chips(x, y, '#8a93a6'); DECALS.add(c * TILE + TILE / 2, HUD_H + r * TILE + TILE / 2, 22); } }
    else if (SDArt) PARTS.chips(x, y, '#8a93a6');
  }
  function tankColor(i) {
    const t = tanks[i];
    if (t && t.team === 'enemy') return '#ff5277';
    if (t && t.team === 'ally' && i === 1) return '#a8f06f';
    return i === 0 ? '#ffb347' : '#46d6e8';
  }
  function damageTank(i, owner) {
    const t = tanks[i]; if (!t.alive) return;
    t.hp = Math.max(0, (t.hp == null ? TANK_MAX_HP : t.hp) - 1);
    t.flash = 1; shake = Math.max(shake, 3);
    if (t.hp <= 0) { killTank(i, owner); return; }
    if (SDArt) { PARTS.chips(t.x, t.y, tankColor(i)); DECALS.add(t.x, t.y, 12); }
    if (!silent()) SDAudio.tankHit();
  }
  function awardDeath(i) {
    if (mode === 'coop') {
      if (tanks[i] && tanks[i].team === 'enemy') score.p1++;
      else score.p2++;
      return;
    }
    if (i === 0) score.p2++; else score.p1++;
  }
  function killTank(i) {
    const t = tanks[i]; if (!t.alive) return; t.alive = false; t.hp = 0;
    if (SDArt) { PARTS.explosion(t.x, t.y, tankColor(i)); DECALS.add(t.x, t.y, 30); }
    if (!silent()) { SDAudio.explosion(); SDAudio.point(); }
    shake = 9; awardDeath(i); freezeT = FREEZE;
  }
  function reviveTanks() {
    for (let i = 0; i < tanks.length; i++) if (!tanks[i].alive) { const s = spawnFor(i), p = tileCenter(s.c, s.r); const t = tanks[i]; t.x = p.x; t.y = p.y; t.heading = s.a; t.turret = s.a; t.speed = 0; t.hp = TANK_MAX_HP; t.alive = true; t.cd = 0.3; t.path = null; }
  }
  function endMatch() { state = 'over'; winner = score.p1 === score.p2 ? 'draw' : (score.p1 > score.p2 ? 'p1' : 'p2'); if (!headless) { SDAudio.roundEnd(); SDAudio.engine(0); maybeOfferScore(); } showOverlay('over'); }

  /* ===================== render ===================== */
  let ctx, canvas, dpr = 1, viewW = LW, viewH = LH, mobileView = false;
  const cam = { x: 0, y: 0, zoom: 1 };
  function hasTouchScreen() { return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches; }
  function clampCam(v, max) { return max <= 0 ? max / 2 : Math.max(0, Math.min(max, v)); }
  function updateCamera() {
    if (!mobileView) { cam.x = 0; cam.y = 0; cam.zoom = 1; return cam; }
    const portrait = viewH >= viewW;
    cam.zoom = portrait ? 1.38 : 1.18;
    const vw = viewW / cam.zoom, vh = viewH / cam.zoom;
    let target = tanks[0];
    if ((state === 'attract' || mode === 'watch') && tanks[0] && tanks[1]) target = { x: (tanks[0].x + tanks[1].x) / 2, y: (tanks[0].y + tanks[1].y) / 2 };
    if (!target) target = { x: LW / 2, y: LH / 2 };
    cam.x = clampCam(target.x - vw * 0.5, LW - vw);
    cam.y = clampCam(target.y - vh * 0.5, LH - vh);
    return cam;
  }
  function screenToWorld(clientX, clientY) {
    if (!canvas) return { x: clientX, y: clientY };
    const r = canvas.getBoundingClientRect();
    const sx = (clientX - r.left) / Math.max(1, r.width) * viewW;
    const sy = (clientY - r.top) / Math.max(1, r.height) * viewH;
    const c = updateCamera();
    return { x: c.x + sx / c.zoom, y: c.y + sy / c.zoom };
  }
  function render() {
    if (!ctx) return;
    document.body.classList.toggle('classic-mode', visualMode === 'classic');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const T = SDArt.theme(visualMode);
    const sx = (Math.random() - 0.5) * shake, sy = (Math.random() - 0.5) * shake;
    const c = updateCamera();
    const bg = ctx.createLinearGradient(0, 0, 0, viewH); bg.addColorStop(0, T.bg1); bg.addColorStop(1, T.bg0);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, viewW, viewH);
    ctx.save();
    if (mobileView) { ctx.scale(c.zoom, c.zoom); ctx.translate(-c.x + sx, -c.y + sy); }
    else ctx.translate(sx, sy);
    SDArt.drawFloor(ctx, 0, HUD_H, FIELD_W, FIELD_H, visualMode);
    if (SDArt && visualMode !== 'classic') DECALS.draw(ctx);
    SDArt.drawWalls(ctx, { solid, hp: wallHP, MAX: WALL_MAX, COLS, ROWS, TILE, HUD_H }, visualMode);
    if (SDArt && visualMode !== 'classic') TRACKS.draw(ctx);
    const tm = tick * STEP;
    for (const m of mines) SDArt.drawMine(ctx, m, tm, visualMode);
    for (const t of tanks) if (t.alive) SDArt.drawTank(ctx, t, tm, visualMode);
    for (const s of shells) SDArt.drawShell(ctx, s, visualMode);
    if (SDArt && visualMode !== 'classic') PARTS.draw(ctx);
    if (visualMode !== 'classic' && state === 'playing' && mode === 'cpu' && !touchActive && tanks[0] && tanks[0].alive) SDArt.drawReticle(ctx, mouseX, mouseY, T.p1);
    ctx.restore();
    drawHUD(T);
    if (visualMode === 'classic') SDArt.classicOverlay(ctx, viewW, viewH);
  }
  function drawHUD(T) {
    const w = viewW, h = mobileView ? 56 : HUD_H;
    if (visualMode === 'classic') {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      const s = mobileView ? 5 : 7;
      const y = mobileView ? 6 : 8;
      SDArt.classicDigit(ctx, mobileView ? 10 : 28, y, score.p1 % 10, s);
      SDArt.classicDigit(ctx, w - (mobileView ? 10 : 28) - s * 5, y, score.p2 % 10, s);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, h - 9, w, 9);
      return;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fillRect(0, 0, w, h);
    ctx.font = 'bold 40px Menlo,Consolas,monospace'; ctx.textBaseline = 'middle';
    ctx.fillStyle = visualMode === 'classic' ? '#fff' : T.p1; ctx.textAlign = 'left'; ctx.fillText(String(score.p1).padStart(2, '0'), mobileView ? 14 : 28, h / 2);
    ctx.fillStyle = visualMode === 'classic' ? '#bdbdbd' : (mode === 'coop' ? '#ff5277' : T.p2); ctx.textAlign = 'right'; ctx.fillText(String(score.p2).padStart(2, '0'), w - (mobileView ? 14 : 28), h / 2);
    drawHealthPips(T, w, h);
    const flash = timeLeft <= FLASH_AT && Math.floor(timeLeft * 2) % 2 === 0;
    ctx.fillStyle = timeLeft <= FLASH_AT ? (flash ? '#ff5277' : '#7a2236') : T.ink;
    ctx.font = 'bold 34px Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.fillText(Math.ceil(timeLeft).toString().padStart(2, '0'), w / 2, h / 2);
    ctx.fillStyle = T.inkDim; ctx.font = '11px Menlo,Consolas,monospace';
    const onlineLabel = online.connected ? 'ONLINE ' + String(online.role || '').toUpperCase() + '  ·  ' : '';
    const modeLabel = state === 'attract' ? 'ATTRACT - CPU vs CPU' : onlineLabel + (mode === 'cpu' ? 'P1  vs  CPU' : (mode === 'watch' ? 'CPU 1  vs  CPU 2' : (mode === 'coop' ? 'CO-OP  vs  ENEMY TANKS' : 'P1  vs  P2')));
    ctx.fillText(modeLabel, w / 2, h - 10);
    if (freezeT > 0 && state === 'playing') { ctx.fillStyle = T.inkDim; ctx.font = 'bold 13px Menlo,Consolas,monospace'; ctx.fillText('- RELOADING -', w / 2, h / 2 + 22); }
  }
  function drawHealthPips(T, w, h) {
    const y = h - 17, size = 6, gap = 4;
    const draw = (x, hp, color, dir) => {
      for (let i = 0; i < TANK_MAX_HP; i++) {
        const on = i < hp, px = x + dir * i * (size + gap);
        ctx.fillStyle = on ? color : 'rgba(255,255,255,.16)';
        ctx.fillRect(px, y, size, size);
      }
    };
    if (mode === 'coop') {
      const left = mobileView ? 14 : 30, right = w - (mobileView ? 14 : 30) - size;
      draw(left, tanks[0] ? tanks[0].hp : TANK_MAX_HP, T.p1, 1);
      draw(left + 52, tanks[1] ? tanks[1].hp : TANK_MAX_HP, '#a8f06f', 1);
      draw(right, tanks[2] ? tanks[2].hp : TANK_MAX_HP, '#ff5277', -1);
      draw(right - 52, tanks[3] ? tanks[3].hp : TANK_MAX_HP, '#ff8a4f', -1);
      return;
    }
    draw(mobileView ? 14 : 30, tanks[0] ? tanks[0].hp : TANK_MAX_HP, T.p1, 1);
    draw(w - (mobileView ? 14 : 30) - size, tanks[1] ? tanks[1].hp : TANK_MAX_HP, T.p2, -1);
  }

  /* ===================== UI ===================== */
  function $(id) { return document.getElementById(id); }
  const OVS = ['ovTitle', 'ovHow', 'ovPause', 'ovOver', 'ovScores'];
  function hideAllOverlays() { OVS.forEach(id => { const e = $(id); if (e) e.classList.add('hidden'); }); }
  function showOverlay(which) {
    if (headless) return;
    hideAllOverlays();
    const map = { title: 'ovTitle', how: 'ovHow', paused: 'ovPause', over: 'ovOver', scores: 'ovScores' };
    if (map[which]) { const e = $(map[which]); if (e) e.classList.remove('hidden'); }
    if (which === 'over') {
      const w = $('overResult'); if (w) w.textContent = winner === 'draw' ? 'DRAW' : (winner === 'p1' ? (mode === 'cpu' ? 'YOU WIN' : (mode === 'watch' ? 'CPU 1 WINS' : (mode === 'coop' ? 'TEAM WINS' : 'PLAYER 1 WINS'))) : (mode === 'cpu' ? 'CPU WINS' : (mode === 'watch' ? 'CPU 2 WINS' : (mode === 'coop' ? 'ENEMY TANKS WIN' : 'PLAYER 2 WINS'))));
      const sc = $('overScore'); if (sc) sc.textContent = score.p1 + ' — ' + score.p2;
    }
  }
  function startAttract() { state = 'attract'; mode = 'cpu'; bots = [true, true]; tankSkill = [0.72, 0.6]; matchTime = DEFAULT_TIME; resetMatch((tick + 7) * 2654435761 >>> 0 || 11); state = 'attract'; }
  function startGame(m, seed) {
    mode = m || mode;
    bots = mode === 'cpu' ? [false, true] : (mode === 'watch' ? [true, true] : (mode === 'coop' ? [false, false, true, true] : [false, false]));
    controls = fresh();
    const sk = aiLevel / 100;
    tankSkill = mode === 'watch' ? [watchLevel[0] / 100, watchLevel[1] / 100] : (mode === 'coop' ? [0, 0, Math.max(0.25, sk), Math.min(1, sk + 0.12)] : [sk, sk]);
    matchTime = DEFAULT_TIME;
    resetMatch(seed == null ? ((Math.random() * 1e9) | 0) : seed);
    state = 'playing'; hideAllOverlays();
    if (!headless) { SDAudio.init(); SDAudio.start(); }
    applyCursor();
  }

  /* ===================== online rooms ===================== */
  function randomRoom() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    const bytes = new Uint8Array(5); crypto.getRandomValues(bytes);
    for (const b of bytes) out += chars[b % chars.length];
    return out;
  }
  function cleanRoom(v) { return String(v || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24) || randomRoom(); }
  function setOnlineStatus(text) {
    online.status = text || '';
    const el = $('onlineStatus'); if (el) el.textContent = online.status;
  }
  function onlineUrl(room) { return ONLINE_WS.replace(/\/+$/, '') + '/' + encodeURIComponent(room); }
  function onlineSend(data) {
    if (!online.ws || online.ws.readyState !== WebSocket.OPEN) return false;
    online.ws.send(JSON.stringify(data)); return true;
  }
  function controlPacket(c) {
    return {
      fwd: !!c.fwd, back: !!c.back, left: !!c.left, right: !!c.right, fire: !!c.fire,
      driveVec: c.driveVec ? { active: !!c.driveVec.active, angle: +c.driveVec.angle || 0, mag: +c.driveVec.mag || 0 } : null,
      aimVec: c.aimVec ? { active: !!c.aimVec.active, angle: +c.aimVec.angle || 0, mag: +c.aimVec.mag || 0 } : null,
    };
  }
  function applyRemoteControl(packet) {
    if (!packet) return;
    controls[1] = { ...ctrl(), ...packet };
  }
  function sendOnlineInput(now) {
    if (!online.connected || online.role !== 'p2' || now - online.lastInput < 45) return;
    online.lastInput = now;
    onlineSend({ type: 'input', control: controlPacket(controls[0]) });
  }
  function sendOnlineSnapshot(now, force) {
    if (!online.connected || online.role !== 'p1' || (state !== 'playing' && !force)) return;
    if (!force && now - online.lastSnapshot < 66) return;
    online.lastSnapshot = now;
    onlineSend({ type: 'snapshot', snapshot: makeSnapshot() });
  }
  function startOnlineHost(m) {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] | 0;
    online.mode = m || online.mode || 'duel';
    startGame(online.mode, seed);
    onlineSend({ type: 'start', mode: online.mode, seed });
    sendOnlineSnapshot(perfNow(), true);
    setOnlineStatus('Room ' + online.room + ' · you are P1 · waiting for P2');
  }
  function disconnectOnline() {
    if (online.ws) {
      try { online.ws.close(1000, 'menu'); } catch {}
    }
    online = { ws: null, room: '', role: null, id: null, mode: online.mode || 'duel', status: '', connected: false, lastInput: 0, lastSnapshot: 0, peers: [] };
    setOnlineStatus('');
  }
  function handleOnlineMessage(data) {
    if (!data || !data.type) return;
    if (data.type === 'welcome') {
      online.connected = true; online.role = data.role; online.id = data.id; online.peers = data.peers || [];
      if (online.role === 'p1') startOnlineHost(online.mode);
      else if (online.role === 'p2') setOnlineStatus('Room ' + online.room + ' · you are P2 · waiting for host');
      else setOnlineStatus('Room ' + online.room + ' · spectating');
      return;
    }
    if (data.type === 'peer') {
      online.peers = data.peers || [];
      if (online.role === 'p1' && state === 'playing') {
        onlineSend({ type: 'start', mode, seed: tick || 1 });
        sendOnlineSnapshot(perfNow(), true);
      }
      return;
    }
    if (data.type === 'start' && online.role !== 'p1') {
      online.mode = data.mode === 'coop' ? 'coop' : 'duel';
      startGame(online.mode, Number(data.seed) || 1);
      setOnlineStatus('Room ' + online.room + ' · you are ' + (online.role === 'p2' ? 'P2' : 'spectating'));
      return;
    }
    if (data.type === 'input' && online.role === 'p1' && data.role === 'p2') applyRemoteControl(data.control);
    if (data.type === 'snapshot' && online.role !== 'p1') applySnapshot(data.snapshot);
    if (data.type === 'error') setOnlineStatus('Online error: ' + data.message);
  }
  function connectOnline() {
    const inp = $('onlineRoom'), sel = $('onlineMode');
    const room = cleanRoom(inp && inp.value);
    if (inp) inp.value = room;
    online.mode = sel && sel.value === 'coop' ? 'coop' : 'duel';
    if (online.ws) disconnectOnline();
    setOnlineStatus('Connecting to room ' + room + '...');
    online.room = room;
    const ws = new WebSocket(onlineUrl(room));
    online.ws = ws;
    ws.addEventListener('open', () => setOnlineStatus('Connected · assigning slot...'));
    ws.addEventListener('message', e => {
      try { handleOnlineMessage(JSON.parse(e.data)); }
      catch { setOnlineStatus('Online error: bad server message'); }
    });
    ws.addEventListener('close', () => {
      const wasRoom = online.room;
      online.connected = false; online.ws = null; online.role = null;
      if (wasRoom) setOnlineStatus('Disconnected from room ' + wasRoom);
    });
    ws.addEventListener('error', () => setOnlineStatus('Online connection failed'));
  }

  /* ===================== scores ===================== */
  const Scores = {
    BASE: 'https://game-scores.jez237.workers.dev/scores/', NS: 'steel-duel', cache: null, last: null,
    async fetch() { try { const r = await fetch(this.BASE + this.NS, { cache: 'no-store' }); const d = await r.json(); this.cache = (Array.isArray(d) ? d : (d.scores || [])).map(s => ({ name: String(s.initials || s.name || '???').slice(0, 3).toUpperCase(), score: s.score | 0 })).sort((a, b) => b.score - a.score).slice(0, 8); } catch (e) { this.cache = 'offline'; } return this.cache; },
    async submit(name, sc) { this.last = { name, score: sc }; try { await fetch(this.BASE + this.NS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials: name, score: sc }) }); this.cache = null; } catch (e) {} },
  };
  function scoreValue() { return Math.max(0, score.p1) * 100 + Math.round(aiLevel); }  // points vs CPU, broken ties by difficulty
  function maybeOfferScore() { if (mode !== 'cpu' || score.p1 <= 0) return; const el = $('overScoreForm'); if (el) el.classList.remove('hidden'); const v = $('overYourScore'); if (v) v.textContent = 'You scored ' + score.p1 + ' vs CPU (' + diffName(aiLevel) + ')'; }
  async function refreshBoard() {
    const box = $('scoreBoard'); if (!box) return; box.innerHTML = '<div class="sb-row">loading…</div>';
    const list = await Scores.fetch();
    if (list === 'offline') { box.innerHTML = '<div class="sb-row">leaderboard offline</div>'; return; }
    if (!list.length) { box.innerHTML = '<div class="sb-row">no scores yet — be the first</div>'; return; }
    box.innerHTML = list.map((s, i) => `<div class="sb-row"><span>${i + 1}. ${s.name}</span><span>${Math.floor(s.score / 100)} <small style="opacity:.5">/${s.score % 100}</small></span></div>`).join('');
  }
  function diffName(v) { return v <= 8 ? 'Stupid' : v <= 30 ? 'Rookie' : v <= 55 ? 'Seasoned' : v <= 80 ? 'Crack Shot' : v < 100 ? 'Lethal' : "Can't Defeat"; }

  /* ===================== loop ===================== */
  let lastT = 0, acc = 0, rafId = 0;
  function frame(t) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - lastT) / 1000) || 0; lastT = t;
    if (state === 'playing' || state === 'attract') { acc += dt; let n = 0; while (acc >= STEP && n < 5) { update(); acc -= STEP; n++; } }
    sendOnlineInput(t);
    sendOnlineSnapshot(t, false);
    if (SDArt) { PARTS.update(dt); TRACKS.update(dt); }
    render();
  }

  /* ===================== input ===================== */
  const keys = {};
  function onKey(e, down) {
    const c = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(c)) e.preventDefault();
    keys[c] = down;
    const c0 = controls[0], c1 = controls[1];
    c0.fwd = !!keys['KeyW']; c0.back = !!keys['KeyS']; c0.left = !!keys['KeyA']; c0.right = !!keys['KeyD'];
    if (mode === 'duel' || mode === 'coop') {
      c0.fire = !!keys['Space'];
      if (!(online.connected && online.role === 'p1')) {
        c1.fwd = !!keys['ArrowUp']; c1.back = !!keys['ArrowDown']; c1.left = !!keys['ArrowLeft']; c1.right = !!keys['ArrowRight']; c1.fire = !!(keys['Enter'] || keys['ShiftRight']);
      }
    }
    else { c0.fire = !!keys['Space']; }
    if (!down) return;
    if (c === 'KeyP' || c === 'Escape') { if (state === 'playing') { state = 'paused'; showOverlay('paused'); } else if (state === 'paused') { state = 'playing'; hideAllOverlays(); } }
    if (c === 'KeyM') { muted = !muted; SDAudio.setMuted(muted); const b = $('btnMute'); if (b) b.textContent = muted ? '🔇' : '🔊'; }
    if (c === 'KeyC') toggleVisual();
  }
  function toggleVisual() { visualMode = visualMode === 'hd' ? 'classic' : 'hd'; const b = $('btnClassic'); if (b) b.textContent = visualMode === 'classic' ? '1974' : 'HD'; }
  function applyCursor() { if (canvas) canvas.style.cursor = (state === 'playing' && mode === 'cpu' && !touchActive) ? 'none' : 'default'; }

  function setupMouse() {
    if (!canvas) return;
    const toLogical = e => { const p = screenToWorld(e.clientX, e.clientY); mouseX = p.x; mouseY = p.y; };
    window.addEventListener('mousemove', toLogical);
    canvas.addEventListener('mousedown', e => { if (e.button === 0) { controls[0].fire = true; toLogical(e); e.preventDefault(); } });
    window.addEventListener('mouseup', e => { if (e.button === 0) controls[0].fire = false; });
  }

  /* ===================== touch (twin-stick) ===================== */
  function setupTouch() {
    const isTouch = hasTouchScreen();
    const wrap = $('touch'); if (!wrap) return;
    if (!isTouch) { wrap.style.display = 'none'; return; }
    touchActive = true; wrap.style.display = 'block'; applyCursor();
    bindStick('stickL', 'driveVec'); bindStick('stickR', 'aimVec');
  }
  function bindStick(id, prop) {
    const base = $(id), knob = $(id + 'k'); if (!base) return;
    const R = 46;
    const move = (cx, cy) => {
      const r = base.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
      let dx = cx - ox, dy = cy - oy, d = Math.hypot(dx, dy); const mag = Math.min(1, d / R);
      const ang = Math.atan2(dy, dx); controls[0][prop] = { active: true, angle: ang, mag };
      if (prop === 'aimVec') controls[0].fire = true;
      if (knob) { const kd = Math.min(d, R); knob.style.transform = `translate(${Math.cos(ang) * kd}px,${Math.sin(ang) * kd}px)`; }
    };
    const end = () => { controls[0][prop] = { active: false, angle: 0, mag: 0 }; if (prop === 'aimVec') controls[0].fire = false; if (knob) knob.style.transform = 'translate(0,0)'; };
    base.addEventListener('touchstart', e => { e.preventDefault(); const t = e.changedTouches[0]; move(t.clientX, t.clientY); }, { passive: false });
    base.addEventListener('touchmove', e => { e.preventDefault(); const t = e.changedTouches[0]; move(t.clientX, t.clientY); }, { passive: false });
    base.addEventListener('touchend', e => { e.preventDefault(); end(); }, { passive: false });
    base.addEventListener('touchcancel', end);
  }

  /* ===================== resize ===================== */
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    mobileView = hasTouchScreen() && !headless;
    document.body.classList.toggle('mobile-play', mobileView);
    if (mobileView) {
      viewW = Math.max(1, window.innerWidth);
      viewH = Math.max(1, window.innerHeight);
      canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
      canvas.style.width = viewW + 'px'; canvas.style.height = viewH + 'px';
    } else {
      viewW = LW; viewH = LH;
      canvas.width = LW * dpr; canvas.height = LH * dpr;
      const scale = Math.min(window.innerWidth / LW, (window.innerHeight - 4) / LH);
      canvas.style.width = (LW * scale) + 'px'; canvas.style.height = (LH * scale) + 'px';
    }
  }

  /* ===================== self-tests ===================== */
  function snapHash() { const r2 = n => Math.round(n * 100) / 100; return JSON.stringify({ s: score, t: tanks.map(t => [r2(t.x), r2(t.y), r2(t.heading), r2(t.turret), t.hp, t.alive]), m: mines.length, sh: shells.length }); }
  function fresh() { return [ctrl(), ctrl(), ctrl(), ctrl()]; }
  function perfNow() { try { return performance.now(); } catch (e) { return 0; } }
  function runTests() {
    const ph = headless, pmode = mode, ps = state, ponline = { ...online }; headless = true;
    const out = [], ok = (n, c, m) => out.push({ name: n, pass: !!c, msg: m || '' });
    mode = 'duel'; bots = [false, false];

    resetMatch(7); state = 'playing'; controls = fresh();
    tanks[0].x = 2 * TILE; tanks[0].y = HUD_H + 2 * TILE; tanks[0].heading = Math.PI;
    let crossed = false; for (let i = 0; i < 120; i++) { controls[0].fwd = true; update(); if (tanks[0].x < TILE) crossed = true; }
    ok('T-F1 walls solid', !crossed);

    resetMatch(7); state = 'playing'; const h0 = tanks[0].heading; controls = fresh(); controls[0].right = true;
    for (let i = 0; i < 10; i++) update(); const rotated = Math.abs(tanks[0].heading - h0) > 0.2;
    resetMatch(7); state = 'playing'; const sx0 = tanks[0].x, sy0 = tanks[0].y; controls = fresh(); controls[0].fwd = true;
    for (let i = 0; i < 20; i++) update(); const adv = Math.hypot(tanks[0].x - sx0, tanks[0].y - sy0) > 4;
    ok('T-F2 steering', rotated && adv);

    resetMatch(7); state = 'playing'; controls = fresh(); const m0 = mines.length;
    tanks[0].x = mines[0].x; tanks[0].y = mines[0].y; update();
    const died = !tanks[0].alive, removed = mines.length === m0 - 1;
    for (let i = 0; i < 120; i++) update();
    ok('T-F3 mines', died && removed && mines.length === m0 - 1);

    resetMatch(7); state = 'playing'; controls = fresh();
    const p4 = tileCenter(4, 2), far = tileCenter(25, 15);
    tanks[0].x = p4.x; tanks[0].y = p4.y; tanks[0].heading = 0; tanks[0].turret = 0; tanks[1].x = far.x; tanks[1].y = far.y;
    fire(tanks[0]); const had = shells.length === 1;
    controls[0].fire = true; update(); const capOk = shells.filter(s => s.owner === 0).length <= MAX_SHELLS;
    let absorbed = false; for (let i = 0; i < 200; i++) { update(); if (shells.length === 0) { absorbed = true; break; } }
    resetMatch(7); state = 'playing'; controls = fresh();
    const pa = tileCenter(4, 2), pb = tileCenter(10, 2);
    tanks[0].x = pa.x; tanks[0].y = pa.y; tanks[0].heading = 0; tanks[0].turret = 0; tanks[1].x = pb.x; tanks[1].y = pb.y; tanks[1].alive = true;
    fire(tanks[0]); let killed = false; for (let i = 0; i < 60; i++) { update(); if (!tanks[1].alive) { killed = true; break; } }
    const tookHit = tanks[1].alive && tanks[1].hp === TANK_MAX_HP - 1 && score.p1 === 0;
    for (let shot = 0; shot < TANK_MAX_HP - 1 && !killed; shot++) {
      tanks[0].cd = 0; fire(tanks[0]);
      for (let i = 0; i < 60; i++) { update(); if (!tanks[1].alive) { killed = true; break; } if (shells.length === 0) break; }
    }
    ok('T-F4 shells', had && capOk && absorbed && tookHit && killed && score.p1 === 1, 'had=' + had + ' cap=' + capOk + ' abs=' + absorbed + ' tookHit=' + tookHit + ' kill=' + killed);

    resetMatch(7); state = 'playing'; controls = fresh();
    killTank(1); const pointOk = score.p1 === 1;
    shells = []; controls[0].fire = true; update(); const noFire = shells.length === 0 && tanks[0].alive;
    for (let i = 0; i < 120; i++) update();
    const pc = tileCenter(SPAWNS[1].c, SPAWNS[1].r), respawnOk = tanks[1].alive && Math.hypot(tanks[1].x - pc.x, tanks[1].y - pc.y) < 2;
    ok('T-F5 kill economy', pointOk && noFire && respawnOk, 'pt=' + pointOk + ' freeze=' + noFire + ' respawn=' + respawnOk);

    resetMatch(7); state = 'playing'; controls = fresh();
    timeLeft = 30; update(); const notEarly = timeLeft > FLASH_AT; timeLeft = 19; update(); const flashSoon = timeLeft <= FLASH_AT && notEarly;
    score.p1 = 3; score.p2 = 1; timeLeft = 0.01; update();
    ok('T-F6 timing', flashSoon && state === 'over' && winner === 'p1');

    const hashRun = () => { tankSkill = [0.7, 0.7]; resetMatch(99); state = 'playing'; bots = [true, true]; for (let i = 0; i < 600; i++) { update(); if (state !== 'playing') break; } return snapHash(); };
    const hA = hashRun(), hB = hashRun(); ok('T-F7 determinism', hA === hB, hA === hB ? '' : 'mismatch');

    // T-WALL: interior wall takes damage then is destroyed
    resetMatch(7); state = 'playing'; bots = [false, false]; controls = fresh();
    const wc = 9, wr = 9; const wp = tileCenter(wc, wr); const hp0 = wallHP[wr][wc];
    const sp = tileCenter(5, wr); tanks[0].x = sp.x; tanks[0].y = sp.y; tanks[0].heading = 0; tanks[0].turret = 0; tanks[1].x = far.x; tanks[1].y = far.y;
    let destroyed = false, damaged = false;
    for (let salvo = 0; salvo < 8 && !destroyed; salvo++) { tanks[0].cd = 0; fire(tanks[0]); for (let i = 0; i < 60; i++) { update(); if (wallHP[wr][wc] < hp0) damaged = true; if (!solid[wr][wc]) destroyed = true; if (shells.length === 0) break; } }
    ok('T-WALL destructible', damaged && destroyed && hp0 === WALL_MAX, 'hp0=' + hp0 + ' dmg=' + damaged + ' destroyed=' + destroyed);

    // T-AI: navigates toward foe around walls and never suicides on a mine
    mode = 'cpu'; tankSkill = [0.0, 0.0]; resetMatch(55); state = 'playing'; bots = [false, true];
    tanks[1].x = tileCenter(25, 15).x; tanks[1].y = tileCenter(25, 15).y; // bot far corner
    tanks[0].x = tileCenter(2, 2).x; tanks[0].y = tileCenter(2, 2).y; tanks[0].alive = true; // dummy human, stays put
    const d0 = Math.hypot(tanks[1].x - tanks[0].x, tanks[1].y - tanks[0].y);
    for (let i = 0; i < 300; i++) update();
    const dEnd = Math.hypot(tanks[1].x - tanks[0].x, tanks[1].y - tanks[0].y);
    ok('T-AI nav (stupid still drives, no mine suicide)', tanks[1].alive && dEnd < d0 - 30, 'alive=' + tanks[1].alive + ' d0=' + Math.round(d0) + ' dEnd=' + Math.round(dEnd));

    const t0 = perfNow(); tankSkill = [0.8, 0.8]; resetMatch(123); state = 'playing'; bots = [true, true]; timeLeft = matchTime;
    let steps = 0, nan = false; while (state === 'playing' && steps < 60 * (matchTime + 2)) { update(); steps++; for (const t of tanks) if (!isFinite(t.x) || !isFinite(t.y)) nan = true; }
    const per = (perfNow() - t0) / Math.max(1, steps);
    ok('T-soak bot match', state === 'over' && !nan, 'state=' + state + ' nan=' + nan);
    ok('T-perf sim<=2.5ms/step', per <= 2.5, per.toFixed(3) + 'ms');

    watchLevel = [15, 85]; startGame('watch'); headless = true;
    ok('T-watch mode', mode === 'watch' && bots[0] && bots[1] && Math.abs(tankSkill[0] - 0.15) < 0.001 && Math.abs(tankSkill[1] - 0.85) < 0.001, 'mode=' + mode + ' bots=' + bots.join(',') + ' skill=' + tankSkill.join(','));

    startGame('coop'); headless = true;
    const coopSpawnOk = mode === 'coop' && tanks.length === 4 && tanks[0].team === 'ally' && tanks[1].team === 'ally' && tanks[2].team === 'enemy' && tanks[3].team === 'enemy' && !bots[0] && !bots[1] && bots[2] && bots[3];
    killTank(2); const coopTeamPoint = score.p1 === 1 && score.p2 === 0;
    killTank(0); const coopEnemyPoint = score.p1 === 1 && score.p2 === 1;
    ok('T-coop mode', coopSpawnOk && coopTeamPoint && coopEnemyPoint, 'spawn=' + coopSpawnOk + ' score=' + score.p1 + '-' + score.p2);

    startGame('coop', 1234); headless = true; tanks[0].x += 5; damageWall(tileCenter(9, 9).x, tileCenter(9, 9).y);
    const snap = makeSnapshot();
    startGame('duel', 9); applySnapshot(snap);
    ok('T-online snapshot', mode === 'coop' && tanks.length === 4 && tanks[0].team === 'ally' && wallHP[9][9] === snap.wallHP[9][9], 'mode=' + mode + ' tanks=' + tanks.length);

    online = ponline;
    headless = ph; mode = pmode; state = ps;
    const pass = out.filter(o => o.pass).length;
    const res = { pass, fail: out.length - pass, total: out.length, details: out }; window.__testResults = res; return res;
  }

  /* ===================== shot scenes ===================== */
  function setupShot(scene) {
    headless = true; if (SDArt) PARTS.clear();
    hideAllOverlays(); if (scene === 'title') { const e = $('ovTitle'); if (e) e.classList.remove('hidden'); }
    mode = scene === 'classic' ? 'duel' : 'cpu'; visualMode = scene === 'classic' ? 'classic' : 'hd';
    tankSkill = [0.75, 0.7];
    resetMatch(scene === 'duel' ? 5 : scene === 'explosion' ? 11 : scene === 'minefield' ? 3 : 7);
    state = scene === 'title' ? 'attract' : 'playing';
    if (scene === 'title') { bots = [true, true]; for (let i = 0; i < 140; i++) update(); }
    else if (scene === 'duel' || scene === 'classic') { bots = [true, true]; for (let i = 0; i < 120; i++) update(); tanks[0].turret = 0.2; tanks[1].turret = Math.PI + 0.2; tanks[0].cd = 0; tanks[1].cd = 0; fire(tanks[0]); fire(tanks[1]); for (let i = 0; i < 6; i++) update(); }
    else if (scene === 'explosion') { bots = [true, true]; for (let i = 0; i < 60; i++) update(); tanks[1].x = tileCenter(8, 4).x; tanks[1].y = tileCenter(8, 4).y; tanks[1].alive = true; tanks[0].x = tileCenter(5, 4).x; tanks[0].y = tileCenter(5, 4).y; killTank(1); }
    else if (scene === 'minefield') { tanks[0].x = tileCenter(11, 8).x; tanks[0].y = tileCenter(11, 8).y; tanks[0].turret = 0.6; tanks[1].x = tileCenter(16, 9).x; tanks[1].y = tileCenter(16, 9).y; tanks[1].turret = Math.PI; for (let i = 0; i < 4; i++) update(); }
    const vf = scene === 'explosion' ? 9 : 2; if (SDArt) for (let i = 0; i < vf; i++) { PARTS.update(STEP); TRACKS.update(STEP); }
    render();
  }

  /* ===================== boot ===================== */
  let TRACKS, PARTS, DECALS;
  function boot() {
    canvas = $('game'); if (!canvas) return; ctx = canvas.getContext('2d');
    TRACKS = new SDArt.Tracks(); PARTS = new SDArt.Particles(); DECALS = new SDArt.Decals();
    window.addEventListener('keydown', e => onKey(e, true)); window.addEventListener('keyup', e => onKey(e, false));
    setupMouse(); setupTouch();
    resize(); window.addEventListener('resize', resize);

    const click = (id, fn) => { const e = $(id); if (e) e.addEventListener('click', () => { SDAudio.ui(); fn(); }); };
    click('btnDuel', () => { disconnectOnline(); startGame('duel'); }); click('btnCoop', () => { disconnectOnline(); startGame('coop'); }); click('btnCpu', () => { disconnectOnline(); startGame('cpu'); }); click('btnWatch', () => { disconnectOnline(); startGame('watch'); });
    click('btnOnline', () => { const p = $('onlinePanel'); if (p) p.classList.toggle('hidden'); });
    click('btnOnlineConnect', connectOnline);
    click('btnHow', () => { state = 'how'; showOverlay('how'); }); click('btnHowBack', () => { startAttract(); showOverlay('title'); });
    click('btnScores', () => { state = 'scores'; showOverlay('scores'); refreshBoard(); }); click('btnScoresBack', () => { startAttract(); showOverlay('title'); });
    click('btnResume', () => { state = 'playing'; hideAllOverlays(); }); click('btnQuit', () => { disconnectOnline(); startAttract(); showOverlay('title'); });
    click('btnAgain', () => (online.connected && online.role === 'p1') ? startOnlineHost(mode) : startGame(mode)); click('btnMenu', () => { disconnectOnline(); startAttract(); showOverlay('title'); });
    const room = $('onlineRoom'); if (room && !room.value) room.value = randomRoom();
    const sl = $('diffSlider'), lab = $('diffLabel');
    if (sl) { sl.value = aiLevel; const upd = () => { aiLevel = +sl.value; if (lab) lab.textContent = diffName(aiLevel) + ' (' + aiLevel + ')'; }; upd(); sl.addEventListener('input', upd); }
    const bindWatch = (idx, sid, lid) => {
      const sl = $(sid), lab = $(lid); if (!sl) return;
      sl.value = watchLevel[idx];
      const upd = () => { watchLevel[idx] = +sl.value; if (lab) lab.textContent = diffName(watchLevel[idx]) + ' (' + watchLevel[idx] + ')'; };
      upd(); sl.addEventListener('input', upd);
    };
    bindWatch(0, 'watchSliderA', 'watchLabelA'); bindWatch(1, 'watchSliderB', 'watchLabelB');
    const mb = $('btnMute'); if (mb) mb.addEventListener('click', () => { muted = !muted; SDAudio.setMuted(muted); mb.textContent = muted ? '🔇' : '🔊'; });
    const cb = $('btnClassic'); if (cb) cb.addEventListener('click', toggleVisual);
    const sub = $('btnSubmit'); if (sub) sub.addEventListener('click', async () => { const inp = $('initials'); const nm = (inp && inp.value || 'YOU').toUpperCase().slice(0, 3) || 'YOU'; await Scores.submit(nm, scoreValue()); const f = $('overScoreForm'); if (f) f.classList.add('hidden'); state = 'scores'; showOverlay('scores'); refreshBoard(); });

    const q = new URLSearchParams(location.search);
    headless = q.has('headless');
    if (q.has('test')) { const r = runTests(); console.log('[Steel Duel] tests ' + r.pass + '/' + r.total, r.details.filter(d => !d.pass)); }
    if (q.has('shot')) { setupShot(q.get('shot')); window.__shotReady = true; }
    else { startAttract(); showOverlay('title'); }
    if (q.has('bots')) { startGame('cpu'); bots = [true, true]; tankSkill = [0.8, 0.8]; }

    if (!headless) { lastT = perfNow(); rafId = requestAnimationFrame(frame); }
    else if (q.has('shot')) render();
  }

  /* ===================== __g hooks ===================== */
  window.__g = {
    get state() { return state; }, set state(s) { state = s; },
    get mode() { return mode; }, set mode(m) { mode = m; },
    get aiLevel() { return aiLevel; }, set aiLevel(v) { aiLevel = v; tankSkill = mode === 'coop' ? [0, 0, Math.max(0.25, v / 100), Math.min(1, v / 100 + 0.12)] : [v / 100, v / 100]; },
    get watchLevel() { return watchLevel.slice(); }, set watchLevel(v) { if (Array.isArray(v)) watchLevel = [Number(v[0]) || 0, Number(v[1]) || 0]; },
    get visualMode() { return visualMode; }, set visualMode(v) { visualMode = v; },
    get score() { return score; }, get timeLeft() { return timeLeft; }, get winner() { return winner; },
    get tanks() { return tanks; }, get shells() { return shells; }, get mines() { return mines; },
    get solid() { return solid; }, get wallHP() { return wallHP; }, get freeze() { return freezeT; },
    reset(seed) { headless = true; resetMatch(seed || 1); state = 'playing'; return true; },
    setSkill(a, b, c, d) { tankSkill = [a, b == null ? a : b, c == null ? a : c, d == null ? (c == null ? a : c) : d]; },
    setBot(p, on) { bots[p] = !!on; }, input(p, a, d) { if (controls[p]) controls[p][a] = !!d; },
    start: startGame, attract: startAttract,
    step(n) { n = n || 1; for (let i = 0; i < n; i++) update(); render(); return true; },
    snap() { render(); return true; }, fire(i) { fire(tanks[i || 0]); }, kill(i) { killTank(i || 0); },
    shot: setupShot, runTests, hash: snapHash, scores: () => Scores,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

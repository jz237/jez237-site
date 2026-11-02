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
  const SHELL_SPD = 7.0, SHELL_MAX_DIST = FIELD_W * 0.5, SHELL_LIFE = SHELL_MAX_DIST * STEP / SHELL_SPD;
  const SHELL_R = 3, MAX_SHELLS = 1, FIRE_CD = 0.4;
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
    { c: 25, r: 13, a: Math.PI, team: 'enemy' },
  ];

  /* ===================== campaign data ===================== */
  // Campaign arenas are sparser/thinner than the duel maze → more open room to maneuver.
  const ARENAS = {
    open:      [[6, 4, 3, 1], [19, 4, 3, 1], [6, 13, 3, 1], [19, 13, 3, 1], [13, 6, 2, 1], [13, 11, 2, 1]],
    pillars:   [[5, 4, 1, 1], [22, 4, 1, 1], [5, 13, 1, 1], [22, 13, 1, 1], [10, 6, 1, 1], [17, 6, 1, 1], [10, 11, 1, 1], [17, 11, 1, 1], [13, 8, 2, 2]],
    corridors: [[8, 2, 1, 6], [19, 10, 1, 6], [8, 12, 1, 4], [19, 2, 1, 4], [13, 8, 2, 2]],
    arena:     [[4, 4, 1, 10], [23, 4, 1, 10], [4, 4, 20, 1], [4, 13, 20, 1], [13, 8, 2, 2]],
    cross:     [[13, 3, 2, 4], [13, 11, 2, 4], [5, 8, 4, 2], [19, 8, 4, 2]],
    flanks:    [[7, 3, 1, 5], [20, 3, 1, 5], [7, 10, 1, 5], [20, 10, 1, 5], [13, 8, 2, 2]],
  };
  // Enemy tank types: each a variant of the tank with its own stats/behavior. Versus is untouched.
  const ENEMY_TYPES = {
    grunt:  { hp: 1, spd: 1.00, skill: 0.45, fireMul: 1.0, dmg: 1, range: [110, 320], color: '#ff5277', score: 10 },
    scout:  { hp: 1, spd: 1.70, skill: 0.30, fireMul: 1.4, dmg: 1, range: [70, 240],  color: '#ff8a4f', score: 15, flank: true },
    brute:  { hp: 4, spd: 0.62, skill: 0.42, fireMul: 0.6, dmg: 2, range: [90, 999],  color: '#c0466a', score: 30, push: true },
    sniper: { hp: 2, spd: 0.85, skill: 0.85, fireMul: 0.5, dmg: 1, range: [260, 999], color: '#d65ce8', score: 25, keepFar: true },
    layer:  { hp: 2, spd: 1.05, skill: 0.28, fireMul: 0.7, dmg: 1, range: [200, 540], color: '#7ad6a0', score: 22, lays: true },
    warden: { hp: 3, spd: 0.80, skill: 0.46, fireMul: 0.9, dmg: 1, range: [120, 300], color: '#6f8cf0', score: 28, frontArmor: true, faceFoe: true },
  };
  const CAMP_LIVES = 3;
  const WARDEN_ARC = 1.05;      // front-armor half-arc (rad); shells inside it deflect
  const CAMP_ALLY_SPAWNS = [{ c: 2, r: 8, a: 0 }, { c: 2, r: 5, a: 0 }, { c: 2, r: 11, a: 0 }, { c: 2, r: 14, a: 0 }];   // all clear of every arena's walls
  // Supply crates (campaign + survival only; Versus stays faithful): dropped by destroyed enemy tanks.
  const PICKUP_LIFE = 14, PICKUP_R = 20, DROP_CHANCE = 0.24, SHIELD_TIME = 6, RAPID_TIME = 8;
  const CAMP_ENEMY_SPAWNS = [
    { c: 25, r: 3, a: Math.PI }, { c: 25, r: 14, a: Math.PI }, { c: 25, r: 8, a: Math.PI },
    { c: 14, r: 2, a: Math.PI / 2 }, { c: 14, r: 15, a: -Math.PI / 2 }, { c: 20, r: 5, a: Math.PI }, { c: 20, r: 12, a: Math.PI },
  ];
  // Level table (engine is generic; bosses & more levels are added in later iterations).
  const LEVELS = [
    { name: 'Boot Camp',     arena: 'open',      mines: 0, waves: [['grunt', 'grunt', 'grunt']] },
    { name: 'Skirmish',      arena: 'pillars',   mines: 0, waves: [['grunt', 'grunt'], ['scout', 'scout', 'grunt']] },
    { name: 'Heavy Metal',   arena: 'corridors', mines: 4, waves: [['grunt', 'brute'], ['brute', 'scout', 'scout']] },
    { name: 'The Bastion',   arena: 'arena',     mines: 0, boss: 'bastion', waves: [['__boss__']] },
    { name: 'Sharpshooters', arena: 'flanks',    mines: 0, waves: [['sniper', 'grunt'], ['sniper', 'sniper', 'scout']] },
    { name: 'Minefield',     arena: 'pillars',   mines: 6, waves: [['layer', 'scout'], ['layer', 'layer', 'grunt']] },
    { name: 'Wardens',       arena: 'corridors', mines: 2, waves: [['warden', 'grunt'], ['warden', 'warden', 'brute']] },
    { name: 'Mauler',        arena: 'arena',     mines: 2, boss: 'mauler', waves: [['__boss__']] },
    { name: 'Onslaught',     arena: 'arena',     mines: 6, waves: [['grunt', 'scout', 'brute'], ['sniper', 'layer', 'scout', 'grunt'], ['brute', 'warden', 'sniper']] },
    { name: 'Gauntlet',      arena: 'cross',     mines: 4, waves: [['scout', 'scout', 'grunt'], ['brute', 'sniper', 'layer'], ['warden', 'brute', 'scout', 'grunt']] },
    { name: 'Last Stand',    arena: 'corridors', mines: 4, waves: [['brute', 'sniper', 'warden'], ['warden', 'warden', 'layer'], ['brute', 'brute', 'sniper', 'sniper']] },
    { name: 'Iron Warlord',  arena: 'arena',     mines: 0, boss: 'warlord', waves: [['__boss__']] },
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
  function buildMazeFrom(def) {
    for (let r = 0; r < ROWS; r++) { solid[r] = []; wallHP[r] = []; for (let c = 0; c < COLS; c++) { const b = isBorder(c, r); solid[r][c] = b; wallHP[r][c] = b ? Infinity : 0; } }
    for (const [c, r, w, h] of def) for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) { if (y > 0 && y < ROWS - 1 && x > 0 && x < COLS - 1) { solid[y][x] = true; wallHP[y][x] = WALL_MAX; } }
  }
  function buildMaze() { buildMazeFrom(WALL_DEF); }
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
  let muted = false, headless = false, touchActive = false, autoFire = true;
  let tanks = [], shells = [], mines = [], pickups = [];
  let shellSeq = 0, pickupSeq = 0, layoutVer = 0;
  let tankSkill = [0.45, 0.45, 0.55, 0.62];
  // Sim → presentation events (effects, audio, announcer). The host forwards them to online clients in snapshots.
  const events = [], netEvents = [];
  function emit(k, o) {
    const e = o || {}; e.k = k;
    events.push(e); if (events.length > 240) events.shift();
    if (online.connected && online.role === 'p1') { netEvents.push(e); if (netEvents.length > 60) netEvents.shift(); }
    return e;
  }
  let score = { p1: 0, p2: 0 };
  let timeLeft = DEFAULT_TIME, matchTime = DEFAULT_TIME;
  let freezeT = 0, winner = null, tick = 0, shake = 0;
  let bots = [false, false, true, true];
  let campaign = null;          // campaign run state (null outside campaign mode)
  let mouseX = LW / 2, mouseY = LH / 2, mouseDown = false, mouseFresh = 0;
  const stick = { active: false, id: null, ox: 0, oy: 0, dx: 0, dy: 0 };
  let online = {
    ws: null, room: '', role: null, id: null, mode: 'duel', name: 'PLAYER',
    names: { p1: 'P1', p2: 'P2' }, ready: { p1: false, p2: false },
    status: '', connected: false, started: false, lastInput: 0, lastSnapshot: 0,
    lastPing: 0, lastPong: 0, ping: null, reconnects: 0, reconnectTimer: 0, manualClose: false,
    peers: [],
  };

  let controls = [ctrl(), ctrl(), ctrl(), ctrl()];
  function ctrl() { return { fwd: false, back: false, left: false, right: false, fire: false, driveVec: null, aimVec: null }; }

  /* ===================== entities ===================== */
  function spawnFor(id) { return mode === 'coop' ? COOP_SPAWNS[id] : SPAWNS[id]; }
  function makeTank(id) {
    const s = spawnFor(id), p = tileCenter(s.c, s.r);
    const team = s.team || (id === 0 ? 'p1' : 'p2');
    return { id, team, x: p.x, y: p.y, heading: s.a, turret: s.a, speed: 0, vx: 0, vy: 0, dist: 0, cd: 0, flash: 0, hp: TANK_MAX_HP, alive: true, path: null, pathTick: -999, invuln: 0, shieldT: 0, rapidT: 0 };
  }
  function resetMatch(seed) {
    rng = mulberry32((seed | 0) || 1);
    buildMaze();
    const count = mode === 'coop' ? 4 : 2;
    tanks = Array.from({ length: count }, (_, id) => makeTank(id));
    shells = []; mines = []; pickups = [];
    placeMines();
    score = { p1: 0, p2: 0 };
    timeLeft = matchTime; freezeT = 0; winner = null; tick = 0; shake = 0;
    layoutVer++;
    if (SDArt && TRACKS) { TRACKS.clear(); PARTS.clear(); DECALS.clear(); }
  }
  function copyGrid(g) { return g.map(row => row.slice()); }
  function encodeHPGrid(g) { return g.map(row => row.map(v => v === Infinity ? 'I' : v)); }
  function decodeHPGrid(g) { return g.map(row => row.map(v => v === 'I' ? Infinity : v)); }
  function tankNet(t) {
    return {
      id: t.id, team: t.team, x: t.x, y: t.y, heading: t.heading, turret: t.turret,
      speed: t.speed, vx: t.vx, vy: t.vy, dist: t.dist, cd: t.cd, flash: t.flash,
      hp: t.hp, alive: t.alive, path: null, pathTick: -999,
      invuln: t.invuln || 0, shieldT: t.shieldT || 0, rapidT: t.rapidT || 0,
    };
  }
  function makeSnapshot() {
    return {
      mode, state, score, timeLeft, matchTime, freezeT, winner, tick,
      names: { ...online.names },
      tanks: tanks.map(tankNet),
      shells: shells.map(s => ({ ...s })),
      mines: mines.map(m => ({ ...m })),
      pickups: pickups.map(p => ({ ...p })),
      solid: copyGrid(solid),
      wallHP: encodeHPGrid(wallHP),
      events: netEvents.splice(0),
    };
  }
  function applySnapshot(s) {
    if (!s || !Array.isArray(s.tanks)) return;
    mode = s.mode || mode; state = s.state || state;
    if (s.names) online.names = { ...online.names, ...s.names };
    score = { p1: Number(s.score && s.score.p1) || 0, p2: Number(s.score && s.score.p2) || 0 };
    timeLeft = Number(s.timeLeft) || 0; matchTime = Number(s.matchTime) || DEFAULT_TIME;
    freezeT = Number(s.freezeT) || 0; winner = s.winner || null; tick = Number(s.tick) || tick;
    if (!headless && online.connected && online.role !== 'p1' && state === 'playing' && tanks.length === s.tanks.length) {
      for (let i = 0; i < s.tanks.length; i++) {
        const cur = tanks[i], next = { ...s.tanks[i], path: null, pathTick: -999 };
        if (!cur) { tanks[i] = next; continue; }
        const keepX = Number(cur.x), keepY = Number(cur.y), keepH = Number(cur.heading), keepT = Number(cur.turret);
        tanks[i] = { ...next, x: keepX, y: keepY, heading: keepH, turret: keepT, net: { x: next.x, y: next.y, heading: next.heading, turret: next.turret } };
      }
    } else {
      tanks = s.tanks.map(t => ({ ...t, path: null, pathTick: -999 }));
    }
    shells = Array.isArray(s.shells) ? s.shells.map(sh => ({ ...sh })) : [];
    mines = Array.isArray(s.mines) ? s.mines.map(m => ({ ...m })) : [];
    pickups = Array.isArray(s.pickups) ? s.pickups.map(p => ({ ...p })) : [];
    if (Array.isArray(s.events) && !headless) for (const e of s.events.slice(0, 60)) if (e && typeof e.k === 'string' && e.k !== 'start') { events.push(e); if (events.length > 240) events.shift(); }   // clients announce their own start
    if (Array.isArray(s.solid)) for (let r = 0; r < ROWS; r++) solid[r] = s.solid[r].slice();
    if (Array.isArray(s.wallHP)) {
      const hp = decodeHPGrid(s.wallHP);
      for (let r = 0; r < ROWS; r++) wallHP[r] = hp[r].slice();
    }
    if (state === 'over') { if (!headless) maybeOfferScore(); showOverlay('over'); }
    else if (state === 'playing') hideAllOverlays();
  }
  function placeMines() {
    const cand = [];
    for (let r = MINE_RECT.r0; r <= MINE_RECT.r1; r++) for (let c = MINE_RECT.c0; c <= MINE_RECT.c1; c++) if (!solid[r][c]) cand.push(tileCenter(c, r));
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = cand[i]; cand[i] = cand[j]; cand[j] = t; }
    for (let i = 0; i < Math.min(16, cand.length); i++) mines.push({ x: cand[i].x, y: cand[i].y, ph: rng() * 7 });
  }

  /* ===================== campaign engine ===================== */
  function playerTank(id, s) {
    const p = tileCenter(s.c, s.r);
    return {
      id, team: 'ally', type: 'player', x: p.x, y: p.y, heading: s.a, turret: s.a, speed: 0, vx: 0, vy: 0, dist: 0, cd: 0, flash: 0,
      hp: TANK_MAX_HP, maxHp: TANK_MAX_HP, alive: true, path: null, pathTick: -999, spdMul: 1, fireCd: FIRE_CD, dmg: 1, invuln: 0, respawnT: null, spawn: s,
      shieldT: 0, rapidT: 0,
    };
  }
  function enemyTank(id, type, s) {
    const d = ENEMY_TYPES[type] || ENEMY_TYPES.grunt, p = tileCenter(s.c, s.r);
    const sk = Math.max(0.05, Math.min(1, d.skill + (campaign ? (campaign.difficulty - 45) / 160 : 0)));
    return {
      id, team: 'enemy', type, x: p.x, y: p.y, heading: s.a, turret: s.a, speed: 0, vx: 0, vy: 0, dist: 0, cd: 0.3 + rng() * 0.5, flash: 0,
      hp: d.hp, maxHp: d.hp, alive: true, path: null, pathTick: -999, spdMul: d.spd, fireCd: FIRE_CD / d.fireMul, dmg: d.dmg, skill: sk,
      range: d.range, flank: !!d.flank, push: !!d.push, keepFar: !!d.keepFar, lays: !!d.lays, frontArmor: !!d.frontArmor, faceFoe: !!d.faceFoe,
      mineCd: 1.6 + rng() * 1.4, minesLeft: 4, enemyColor: d.color, scoreVal: d.score, invuln: 0, shieldT: 0, rapidT: 0,
    };
  }
  function spawnFx(t) { emit('spawn', { id: t.id, x: t.x, y: t.y, team: t.team, color: t.enemyColor || null }); }
  function placeCampaignMines(n) {
    const cand = [];
    for (let r = 4; r < ROWS - 4; r++) for (let c = 8; c < COLS - 8; c++) if (!solid[r][c]) cand.push(tileCenter(c, r));
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = cand[i]; cand[i] = cand[j]; cand[j] = t; }
    for (let i = 0; i < Math.min(n, cand.length); i++) mines.push({ x: cand[i].x, y: cand[i].y, ph: rng() * 7 });
  }
  function dropMine(t) {
    const mx = t.x - Math.cos(t.heading) * 24, my = t.y - Math.sin(t.heading) * 24;   // drop behind so the layer doesn't self-detonate
    if (isSolidAt(mx, my)) return;
    mines.push({ x: mx, y: my, ph: rng() * 7 });
    emit('mineDrop', { x: mx, y: my });
  }
  function startCampaign(levelIdx, players, difficulty, seed) {
    mode = 'campaign';
    if (online && online.ws) disconnectOnline();
    const np = Math.max(1, Math.min(4, players || 1));
    campaign = {
      levelIdx: Math.max(0, Math.min(LEVELS.length - 1, levelIdx | 0)), waveIdx: 0, lives: 2 + np,   // shared pool scales with players
      players: np, difficulty: difficulty == null ? aiLevel : difficulty,
      score: 0, phase: 'fight', timer: 0, banner: '',
    };
    rng = mulberry32((seed | 0) || 1);
    controls = fresh();
    loadCampaignLevel();
    if (!headless) { SDAudio.init(); SDAudio.start(); }
    applyCursor(); updateTouchLayout();
    return true;
  }
  function loadCampaignLevel() {
    const lv = LEVELS[campaign.levelIdx];
    buildMazeFrom(ARENAS[lv.arena] || ARENAS.open);
    shells = []; mines = []; pickups = [];
    if (lv.mines) placeCampaignMines(lv.mines);
    tanks = [];
    for (let i = 0; i < campaign.players; i++) tanks.push(playerTank(i, CAMP_ALLY_SPAWNS[i] || CAMP_ALLY_SPAWNS[0]));
    bots = tanks.map(() => false);
    campaign.waveIdx = 0; campaign.phase = 'fight'; campaign.timer = 0; campaign.banner = lv.name;
    campaign.best = Math.max(campaign.best || 0, campaign.levelIdx);
    layoutVer++;
    spawnCampaignWave();
    score = { p1: campaign.score, p2: 0 }; timeLeft = 9999; matchTime = 9999; freezeT = 0; winner = null; tick = 0; shake = 0;
    state = 'playing';
    if (SDArt && TRACKS) { TRACKS.clear(); PARTS.clear(); DECALS.clear(); }
    if (!headless) { hideAllOverlays(); saveCampaignBest(campaign.levelIdx); }
  }
  function waveScaled(types) {
    const extra = campaign.players > 1 ? Math.round(types.length * 0.35 * (campaign.players - 1)) : 0;
    const out = types.slice();
    for (let i = 0; i < extra; i++) out.push(types[i % types.length]);
    return out;
  }
  function spawnCampaignWave() {
    const lv = LEVELS[campaign.levelIdx];
    const raw = lv.waves[campaign.waveIdx] || [];
    // co-op revive: a teammate who went down with no lives left rejoins at the start of the next wave
    if (tanks.some(t => t.team === 'ally' && t.alive)) for (const t of tanks) if (t.team === 'ally' && !t.alive && t.respawnT == null) respawnAlly(t);
    const boss = raw.indexOf('__boss__') >= 0;
    emit('wave', { lv: campaign.levelIdx, wave: campaign.waveIdx, waves: lv.waves.length, boss: boss ? lv.boss : null, name: lv.name });
    if (boss) {                                                 // boss wave: spawn the level's boss (never scaled by count)
      const id = tanks.length;
      tanks.push(bossTank(id, lv.boss, BOSS_SPAWN));
      bots[id] = false;
      spawnFx(tanks[id]);
      return;
    }
    const types = waveScaled(raw);
    let si = 0;
    for (const type of types) {
      const s = CAMP_ENEMY_SPAWNS[si % CAMP_ENEMY_SPAWNS.length]; si++;
      const id = tanks.length;
      tanks.push(enemyTank(id, type, s));
      bots[id] = true;
      spawnFx(tanks[id]);
    }
  }
  function aliveCount(team) { let n = 0; for (const t of tanks) if (t.team === team && t.alive) n++; return n; }
  function onCampaignKill(t) {
    if (t.team === 'enemy') {
      campaign.score += t.scoreVal || 10; score.p1 = campaign.score;
    } else {
      campaign.lives--;
      t.respawnT = campaign.lives > 0 ? 1.6 : null;
      emit('lifeLost', { id: t.id, lives: campaign.lives });
    }
  }
  function respawnAlly(t) {
    const s = t.spawn || CAMP_ALLY_SPAWNS[0], p = tileCenter(s.c, s.r);
    t.x = p.x; t.y = p.y; t.heading = s.a; t.turret = s.a; t.speed = 0; t.vx = 0; t.vy = 0; t.flash = 0;
    t.hp = t.maxHp; t.alive = true; t.cd = 0.3; t.path = null; t.respawnT = null; t.invuln = 1.2; t.shieldT = 0; t.rapidT = 0;
    spawnFx(t);
  }
  function endCampaign(won) {
    state = 'over'; campaign.phase = won ? 'won' : 'lost';
    winner = won ? 'p1' : 'p2'; score.p1 = campaign.score;
    emit('campEnd', { won });
    if (!headless) { maybeOfferScore(); showOverlay('over'); }
  }
  function campaignTick() {
    if (!campaign || state !== 'playing') return;
    for (const t of tanks) {
      if (t.team === 'ally' && !t.alive && t.respawnT != null) { t.respawnT -= STEP; if (t.respawnT <= 0) respawnAlly(t); }
    }
    const enemies = aliveCount('enemy');
    const pendingRespawn = tanks.some(t => t.team === 'ally' && t.respawnT != null);
    if (aliveCount('ally') === 0 && !pendingRespawn) { endCampaign(false); return; }
    if (campaign.phase === 'fight' && enemies === 0) {
      const lv = LEVELS[campaign.levelIdx];
      if (campaign.waveIdx < lv.waves.length - 1) { campaign.phase = 'clear'; campaign.timer = 1.3; campaign.banner = 'WAVE CLEAR'; emit('waveClear', {}); }
      else if (campaign.levelIdx < LEVELS.length - 1) { campaign.phase = 'levelclear'; campaign.timer = 2.2; campaign.banner = 'LEVEL CLEAR'; emit('levelClear', { lv: campaign.levelIdx, boss: !!lv.boss }); }
      else { endCampaign(true); return; }
    }
    if (campaign.phase === 'clear') { campaign.timer -= STEP; if (campaign.timer <= 0) { campaign.waveIdx++; campaign.phase = 'fight'; campaign.banner = ''; spawnCampaignWave(); } }
    if (campaign.phase === 'levelclear') {
      campaign.timer -= STEP;
      if (campaign.timer <= 0) {
        const cap = 2 + campaign.players + 2, before = campaign.lives;
        campaign.levelIdx++; campaign.lives = Math.min(cap, campaign.lives + 1);
        loadCampaignLevel();
        if (campaign.lives > before) emit('lifeUp', { lives: campaign.lives });
      }
    }
  }

  /* ===================== bosses ===================== */
  const BOSS_SPAWN = { c: 14, r: 6, a: Math.PI / 2 };   // row 6 keeps even the Warlord's 33px body clear of the ring wall
  const BOSS_DEFS = {
    bastion: { hp: 18, spd: 0.00, color: '#ff7043', name: 'THE BASTION',  hitR: 30, stationary: true, score: 200 },
    mauler:  { hp: 16, spd: 1.05, color: '#ef5350', name: 'MAULER',       hitR: 26, frontArmor: true, armorArc: 0.6, score: 320 },
    warlord: { hp: 32, spd: 0.70, color: '#ab47bc', name: 'IRON WARLORD', hitR: 33, score: 600 },
  };
  function bossTank(id, type, s) {
    const d = BOSS_DEFS[type] || BOSS_DEFS.bastion, p = tileCenter(s.c, s.r);
    const hp = Math.round(d.hp * (1 + 0.5 * ((campaign ? campaign.players : 1) - 1)));
    return {
      id, team: 'enemy', type: 'boss', bossType: type, boss: true, bossName: d.name, x: p.x, y: p.y, heading: s.a, turret: s.a,
      speed: 0, vx: 0, vy: 0, dist: 0, cd: 0, flash: 0, hp, maxHp: hp, alive: true, path: null, pathTick: -999,
      spdMul: d.spd, fireCd: FIRE_CD, dmg: 1, skill: 0.7, range: [0, 9999], hitR: d.hitR, frontArmor: !!d.frontArmor, armorArc: d.armorArc || WARDEN_ARC,
      stationary: !!d.stationary, scoreVal: d.score, phase: 1, atkCd: 1.6, invuln: 0, enemyColor: d.color,
    };
  }
  function bossCommand(i, cmd) {
    const t = tanks[i], foe = nearestFoe(t);
    cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = false; cmd.turretTurn = TURRET_TURN * 1.1;
    if (!foe) return;
    const dx = foe.x - t.x, dy = foe.y - t.y, dist = Math.hypot(dx, dy), toFoe = Math.atan2(dy, dx);
    cmd.aim = toFoe;
    if (t.stationary) return;                                   // Bastion holds position
    const da = wrapAngle(toFoe - t.heading);
    if (t.bossType === 'mauler') { cmd.turn = Math.max(-1, Math.min(1, da / 0.5)); cmd.throttle = Math.abs(da) < 1.0 ? 1 : 0.25; }
    else { cmd.turn = Math.max(-1, Math.min(1, da / 0.7)); cmd.throttle = dist > 200 ? 0.5 : (dist < 120 ? -0.4 : 0); }
  }
  function bossFire(t, ang) {
    const bx = t.x + Math.cos(ang) * ((t.hitR || 22) + 4), by = t.y + Math.sin(ang) * ((t.hitR || 22) + 4);
    shells.push({ x: bx, y: by, vx: Math.cos(ang) * SHELL_SPD * 0.85, vy: Math.sin(ang) * SHELL_SPD * 0.85, life: SHELL_LIFE * 1.4, owner: t.id, dmg: 1, sid: ++shellSeq, sx: bx, sy: by });
    emit('fire', { id: t.id, x: bx, y: by, a: ang, big: true });
  }
  function spawnAdds(type, n) {
    for (let k = 0; k < n; k++) { const s = CAMP_ENEMY_SPAWNS[(tanks.length + k) % CAMP_ENEMY_SPAWNS.length]; const id = tanks.length; tanks.push(enemyTank(id, type, s)); bots[id] = true; spawnFx(tanks[id]); }
  }
  function mineRing(t) {
    for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2, mx = t.x + Math.cos(a) * 64, my = t.y + Math.sin(a) * 64; if (!isSolidAt(mx, my) && mines.length < 30) mines.push({ x: mx, y: my, ph: rng() * 7 }); }
  }
  function onBossPhase(t, phase) {
    shake = Math.max(shake, 7);
    emit('phase', { id: t.id, x: t.x, y: t.y, phase, boss: t.bossType });
    if (t.bossType === 'bastion' && phase === 2) spawnAdds('grunt', 2);
    if (t.bossType === 'mauler' && phase === 2) { mineRing(t); spawnAdds('scout', 2); }
    if (t.bossType === 'warlord' && phase === 2) spawnAdds('scout', 3);
  }
  function bossAttack(t) {
    if (mode !== 'campaign') return;
    const ratio = t.hp / t.maxHp, newPhase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    if (newPhase > t.phase) { onBossPhase(t, newPhase); t.phase = newPhase; }
    t.atkCd -= STEP; if (t.atkCd > 0) return;
    const foe = nearestFoe(t); if (!foe) return;
    const aim = Math.atan2(foe.y - t.y, foe.x - t.x);
    if (t.bossType === 'bastion') {
      const muzzle = t.turret;
      if (t.phase === 1) { bossFire(t, muzzle); t.atkCd = 1.8; }
      else if (t.phase === 2) { for (let j = -1; j <= 1; j++) bossFire(t, muzzle + j * 0.16); t.atkCd = 1.35; }
      else { for (let j = -2; j <= 2; j++) bossFire(t, muzzle + j * 0.13); t.atkCd = 1.05; }
    } else if (t.bossType === 'mauler') {
      for (let j = -1; j <= 1; j++) bossFire(t, aim + j * 0.2);
      t.atkCd = 1.9;
    } else {                                                    // warlord
      if (t.phase === 1) { for (let j = 0; j < 4; j++) bossFire(t, aim + j * Math.PI / 2); t.atkCd = 1.7; }
      else if (t.phase === 2) { bossFire(t, aim); bossFire(t, aim + 0.5); bossFire(t, aim - 0.5); t.atkCd = 1.1; }
      else { for (let j = -2; j <= 2; j++) bossFire(t, aim + j * 0.16); t.atkCd = 0.9; }
    }
  }

  /* ===================== geometry helpers ===================== */
  function wrapAngle(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  function rotToward(cur, target, maxStep) { const d = wrapAngle(target - cur); if (Math.abs(d) <= maxStep) return target; return cur + Math.sign(d) * maxStep; }
  function lineClear(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), n = Math.ceil(d / 8);
    for (let i = 1; i < n; i++) { const t = i / n; if (isSolidAt(x0 + dx * t, y0 + dy * t)) return false; }
    return true;
  }
  function clearShot(me, ang) {                            // true if a shell fired along `ang` reaches an enemy before any wall/friendly
    for (let d = TANK_R + 6; d < SHELL_MAX_DIST; d += 9) {
      const x = me.x + Math.cos(ang) * d, y = me.y + Math.sin(ang) * d;
      if (isSolidAt(x, y)) return false;                  // wall blocks the line of fire
      for (const t of tanks) {
        if (!t.alive || t.id === me.id) continue;
        if (Math.hypot(t.x - x, t.y - y) < (t.hitR || TANK_R) + 7) return opposing(me, t);
      }
    }
    return false;
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
    const me = tanks[i], foe = nearestFoe(me), skill = me.skill != null ? me.skill : (tankSkill[i] == null ? 0.5 : tankSkill[i]);
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
    let driveAngle = null, throttle = 0; const _rg = me.range || [110, 320], IDEAL_MIN = _rg[0], IDEAL_MAX = _rg[1];
    let dodge = null;
    if (skill > 0.5) {
      for (const s of shells) { if (s.owner === i) continue; const toward = s.vx * (me.x - s.x) + s.vy * (me.y - s.y); const d = Math.hypot(me.x - s.x, me.y - s.y); if (toward > 0 && d < 150) { dodge = Math.atan2(s.vy, s.vx) + Math.PI / 2; break; } }
    }
    if (dodge != null) { driveAngle = dodge; throttle = 1; }
    else if (!los || dist > IDEAL_MAX) { const wp = nextWaypoint(me, foe); driveAngle = wp ? Math.atan2(wp.y - me.y, wp.x - me.x) : Math.atan2(dy, dx); throttle = 1; }
    else if (dist < IDEAL_MIN) { driveAngle = Math.atan2(-dy, -dx); throttle = 1; }
    else if (skill > 0.4) { driveAngle = Math.atan2(dy, dx) + Math.PI / 2 * ((Math.floor(tick / 45 + i) % 2) ? 1 : -1); throttle = 0.75; }
    if (me.faceFoe && dodge == null && los && dist <= IDEAL_MAX) { driveAngle = Math.atan2(dy, dx); throttle = dist > IDEAL_MIN ? 0.45 : 0; }   // warden keeps its front plate toward the foe
    if (driveAngle != null) {
      driveAngle = safeDir(me, driveAngle);
      const da = wrapAngle(driveAngle - me.heading);
      cmd.turn = Math.max(-1, Math.min(1, da / 0.4));
      cmd.throttle = Math.abs(da) < 1.0 ? throttle : 0;
    }
  }

  /* ===================== human command ===================== */
  function assistedControls(i) {
    return mode === 'campaign' || mode === 'cpu' || (mode === 'coop' && i === 0);
  }

  function humanCommand(i, cmd) {
    const c = controls[i] || (controls[i] = ctrl()), me = tanks[i];
    cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = true; cmd.moveVec = null;
    // Assisted modes use simplified controls: direct movement + assisted aim/auto-fire.
    if (assistedControls(i)) {
      // ---- Subway Siege-style direct movement: floating drag stick, mobile stick, or WASD/arrows as an 8-way vector ----
      let mvx = 0, mvy = 0, mag = 0;
      if (i === 0 && stick.active) {
        const len = Math.hypot(stick.dx, stick.dy);
        mag = Math.min(1, len / 48);
        if (mag > 0.12) { mvx = stick.dx / Math.max(1, len); mvy = stick.dy / Math.max(1, len); }
        else mag = 0;
      }
      else if (c.driveVec && c.driveVec.active) { mvx = Math.cos(c.driveVec.angle); mvy = Math.sin(c.driveVec.angle); mag = c.driveVec.mag; }
      else { mvx = (c.right ? 1 : 0) - (c.left ? 1 : 0); mvy = (c.back ? 1 : 0) - (c.fwd ? 1 : 0); const m = Math.hypot(mvx, mvy); if (m > 0) { mvx /= m; mvy /= m; mag = 1; } }
      cmd.moveVec = { ang: mag > 0.01 ? Math.atan2(mvy, mvx) : me.heading, mag: Math.min(1, mag) };
      // ---- aim + fire: mouse steers aim/searchlight; auto-fire uses line of sight; click/Space/F force-fires ----
      const foe = nearestFoe(me);
      const mouseAim = (i === 0 && !touchActive && (mode === 'coop' || !campaign || campaign.players === 1));   // desktop P1 steers the turret with the mouse
      if (mouseAim) {
        const hasMouseAim = mouseFresh > 0 || mouseDown;
        const ang = hasMouseAim && !touchActive ? Math.atan2(mouseY - me.y, mouseX - me.x) : (foe ? Math.atan2(foe.y - me.y, foe.x - me.x) : me.turret);
        cmd.aim = ang; cmd.aimInstant = hasMouseAim;
        cmd.fire = mouseDown || !!c.fire || (autoFire && clearShot(me, ang));
      } else if (c.aimVec && c.aimVec.active) {            // mobile twin-stick (duel/coop aim pad): manual aim + fire
        cmd.aim = c.aimVec.angle; cmd.aimInstant = true; cmd.fire = true;
      } else if (foe) {                                     // not touching: auto-aim nearest enemy; fire when lined up with a clear shot
        cmd.aim = Math.atan2(foe.y - me.y, foe.x - me.x); cmd.aimInstant = false; cmd.turretTurn = TURRET_TURN;
        const aligned = Math.abs(wrapAngle(me.turret - cmd.aim)) < 0.22;
        cmd.fire = (autoFire && aligned && clearShot(me, cmd.aim)) || !!c.fire || (!autoFire && i === 0 && stick.active);
      } else { cmd.aim = null; cmd.fire = !!c.fire; }
      return;
    }
    // Versus duel and local P2 keep the faithful 1974 tank steering + hull-locked barrel.
    if (c.driveVec && c.driveVec.active) { const da = wrapAngle(c.driveVec.angle - me.heading); cmd.turn = Math.max(-1, Math.min(1, da / 0.4)); cmd.throttle = c.driveVec.mag * Math.max(0, Math.cos(da)); }
    else { cmd.turn = (c.right ? 1 : 0) - (c.left ? 1 : 0); cmd.throttle = (c.fwd ? 1 : 0) - (c.back ? 1 : 0); }
    cmd.aim = null; cmd.fire = c.fire;
  }

  /* ===================== sim ===================== */
  function update() {
    tick++;
    if (mouseFresh > 0) mouseFresh--;
    if (state !== 'playing' && state !== 'attract') return;
    if (online.connected && online.role !== 'p1' && state === 'playing') return;
    if (freezeT > 0) { freezeT -= STEP; if (freezeT <= 0) reviveTanks(); }
    const cmd = { turn: 0, throttle: 0, aim: null, fire: false, aimInstant: false, turretTurn: TURRET_TURN };
    for (let i = 0; i < tanks.length; i++) {
      const t = tanks[i]; if (!t.alive) continue;
      if (t.invuln > 0) t.invuln -= STEP;
      if (t.shieldT > 0) t.shieldT -= STEP;
      if (t.rapidT > 0) t.rapidT -= STEP;
      cmd.turn = 0; cmd.throttle = 0; cmd.aim = null; cmd.fire = false; cmd.aimInstant = false; cmd.turretTurn = TURRET_TURN; cmd.moveVec = null;
      if (t.boss) bossCommand(i, cmd); else if (bots[i]) aiCommand(i, cmd); else humanCommand(i, cmd);
      applyCommand(t, cmd);
      if (t.boss) bossAttack(t);
      if (Math.abs(t.speed) > 0.4) t.dist += Math.abs(t.speed);
      if (t.flash > 0) t.flash -= STEP * 6;
      if (t.cd > 0) t.cd -= STEP;
      let inFlight = 0; for (const s of shells) if (s.owner === i) inFlight++;
      if (cmd.fire && t.cd <= 0 && freezeT <= 0 && inFlight < (t.rapidT > 0 ? 2 : MAX_SHELLS)) fire(t);
      if (t.lays && mode === 'campaign') { t.mineCd -= STEP; if (t.mineCd <= 0 && t.minesLeft > 0 && mines.length < 30) { dropMine(t); t.minesLeft--; t.mineCd = 2.4 + rng() * 1.4; } }
      if (!t.boss) for (let m = mines.length - 1; m >= 0; m--) {
        if (Math.hypot(mines[m].x - t.x, mines[m].y - t.y) < MINE_R + TANK_R - 4) {
          const mx = mines[m].x, my = mines[m].y; mines.splice(m, 1);
          emit('mine', { x: mx, y: my, id: i });
          if (t.shieldT > 0) { t.shieldT = 0; t.invuln = Math.max(t.invuln, 0.5); shake = Math.max(shake, 6); emit('hit', { id: i, x: t.x, y: t.y, hp: t.hp, shielded: true }); break; }   // a supply shield soaks one mine
          killTank(i, -1, 'mine'); break;
        }
      }
      if (pickups.length && t.team === 'ally') collectPickups(t);
    }

    for (let s = shells.length - 1; s >= 0; s--) {
      const sh = shells[s]; sh.x += sh.vx; sh.y += sh.vy; sh.life -= STEP;
      if (sh.life <= 0) { shells.splice(s, 1); emit('shellEnd', { x: sh.x, y: sh.y }); continue; }
      if (isSolidAt(sh.x, sh.y)) { damageWall(sh.x, sh.y); shells.splice(s, 1); continue; }
      let hit = false;
      for (let i = 0; i < tanks.length; i++) {
        const t = tanks[i], owner = tanks[sh.owner];
        if (t.alive && i !== sh.owner && opposing(owner, t) && Math.hypot(t.x - sh.x, t.y - sh.y) < (t.hitR || TANK_R) + SHELL_R) {
          if (t.frontArmor && Math.abs(wrapAngle(Math.atan2(sh.y - t.y, sh.x - t.x) - t.heading)) < (t.armorArc || WARDEN_ARC)) {   // front plate — flank for full damage
            if (t.boss) {                                       // boss armor chips through slowly (never a hard-lock); flanking is far faster
              t.armorChip = (t.armorChip || 0) + 0.4;
              if (t.armorChip >= 1) { t.armorChip -= 1; damageTank(i, sh.owner, 1); hit = true; break; }
            }
            t.flash = Math.max(t.flash, 0.5); shake = Math.max(shake, 1.5);
            emit('deflect', { id: i, x: sh.x, y: sh.y, by: sh.owner, boss: !!t.boss });
            hit = true; break;
          }
          damageTank(i, sh.owner, sh.dmg || 1); hit = true; break;
        }
      }
      if (hit) shells.splice(s, 1);
    }
    if (mode === 'campaign') shellsCollide();
    if (pickups.length) for (let p = pickups.length - 1; p >= 0; p--) { pickups[p].t -= STEP; if (pickups[p].t <= 0) pickups.splice(p, 1); }
    if (shake > 0) shake *= 0.85;

    if (mode === 'campaign') { campaignTick(); return; }

    const before = timeLeft;
    timeLeft -= STEP;
    if (state === 'playing') for (const mark of [20, 10]) if (before > mark && timeLeft <= mark) emit('time', { s: mark });
    if (timeLeft <= 0) { timeLeft = 0; if (state === 'attract') startAttract(); else endMatch(); }
  }
  // Campaign only: opposing shells that meet cancel in a small airburst (lets you shoot down boss salvos).
  function shellsCollide() {
    for (let a = shells.length - 1; a >= 0; a--) {
      const A = shells[a], ta = tanks[A.owner];
      for (let b = a - 1; b >= 0; b--) {
        const B = shells[b];
        if (!opposing(ta, tanks[B.owner]) || Math.abs(A.x - B.x) > 9 || Math.abs(A.y - B.y) > 9 || Math.hypot(A.x - B.x, A.y - B.y) > 8) continue;
        emit('flak', { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 });
        shells.splice(a, 1); shells.splice(b, 1); a--; break;
      }
    }
  }
  function maybeDrop(t) {
    if (!(mode === 'campaign' || mode === 'coop') || t.team !== 'enemy' || isSolidAt(t.x, t.y)) return;
    if (!t.boss && rng() >= DROP_CHANCE) return;
    const r = rng(), kind = t.boss ? 'life' : r < 0.07 ? 'life' : r < 0.42 ? 'repair' : r < 0.72 ? 'shield' : 'rapid';
    const p = { id: ++pickupSeq, kind, x: t.x, y: t.y, t: PICKUP_LIFE };
    pickups.push(p); emit('drop', { x: p.x, y: p.y, kind });
  }
  function collectPickups(t) {
    for (let p = pickups.length - 1; p >= 0; p--) {
      const pk = pickups[p];
      if (Math.hypot(pk.x - t.x, pk.y - t.y) > PICKUP_R) continue;
      pickups.splice(p, 1);
      if (pk.kind === 'repair') t.hp = Math.min(t.maxHp || TANK_MAX_HP, t.hp + 2);
      else if (pk.kind === 'shield') { t.shieldT = SHIELD_TIME; t.invuln = Math.max(t.invuln, SHIELD_TIME); }
      else if (pk.kind === 'rapid') t.rapidT = RAPID_TIME;
      else if (pk.kind === 'life') { if (campaign) campaign.lives = Math.min(9, campaign.lives + 1); else t.hp = t.maxHp || TANK_MAX_HP; }
      emit('pick', { id: t.id, x: pk.x, y: pk.y, kind: pk.kind });
    }
  }

  function applyCommand(t, cmd) {
    if (cmd.moveVec) {                                   // direct (omnidirectional) movement — campaign / vs-CPU human
      const mag = Math.min(1, cmd.moveVec.mag || 0), sp = MAX_FWD * (t.spdMul || 1);
      if (mag > 0.01) { const tx = Math.cos(cmd.moveVec.ang) * sp * mag, ty = Math.sin(cmd.moveVec.ang) * sp * mag; t.vx += (tx - t.vx) * ACCEL; t.vy += (ty - t.vy) * ACCEL; }
      else { t.vx *= FRICTION; t.vy *= FRICTION; if (Math.abs(t.vx) < 0.02) t.vx = 0; if (Math.abs(t.vy) < 0.02) t.vy = 0; }
      moveTankVel(t);
      t.speed = Math.hypot(t.vx, t.vy);
      if (t.speed > 0.12) t.heading = rotToward(t.heading, Math.atan2(t.vy, t.vx), HULL_TURN * 2.6);   // hull eases toward travel direction
      if (cmd.aim == null) t.turret = t.heading;
      else if (cmd.aimInstant) t.turret = cmd.aim;
      else t.turret = rotToward(t.turret, cmd.aim, cmd.turretTurn || TURRET_TURN);
      return;
    }
    t.heading += Math.max(-1, Math.min(1, cmd.turn)) * HULL_TURN;
    const th = Math.max(-1, Math.min(1, cmd.throttle)), target = th * (th >= 0 ? MAX_FWD : MAX_REV) * (t.spdMul || 1);
    t.speed += (target - t.speed) * ACCEL;
    if (Math.abs(target) < 0.01) { t.speed *= FRICTION; if (Math.abs(t.speed) < 0.02) t.speed = 0; }
    moveTank(t);
    t.vx = Math.cos(t.heading) * t.speed; t.vy = Math.sin(t.heading) * t.speed;
    if (cmd.aim == null) t.turret = t.heading;
    else if (cmd.aimInstant) t.turret = cmd.aim;
    else t.turret = rotToward(t.turret, cmd.aim, cmd.turretTurn || TURRET_TURN);
  }
  function bodyR(t) { return t.boss ? (t.hitR || TANK_R) : TANK_R; }    // bosses collide with their full hull, not a 12px dot
  function moveTank(t) {
    const nx = t.x + Math.cos(t.heading) * t.speed, ny = t.y + Math.sin(t.heading) * t.speed, r = bodyR(t);
    if (!circleHitsWall(nx, t.y, r)) t.x = nx; else t.speed *= 0.3;
    if (!circleHitsWall(t.x, ny, r)) t.y = ny; else t.speed *= 0.3;
    pushApart(t);
  }
  function moveTankVel(t) {
    const nx = t.x + t.vx, ny = t.y + t.vy, r = bodyR(t);
    if (!circleHitsWall(nx, t.y, r)) t.x = nx; else t.vx *= 0.2;
    if (!circleHitsWall(t.x, ny, r)) t.y = ny; else t.vy *= 0.2;
    pushApart(t);
  }
  function pushApart(t) {
    if (t.stationary) return;                            // the Bastion can't be shoved around
    const r = bodyR(t);
    for (const o of tanks) {
      if (!o || o.id === t.id || !o.alive) continue;
      const dx = t.x - o.x, dy = t.y - o.y, d = Math.hypot(dx, dy), min = r + bodyR(o);
      if (d > 0 && d < min) {
        const push = (min - d) * (o.stationary || (o.boss && !t.boss) ? 1 : 0.5), nx = t.x + dx / d * push, ny = t.y + dy / d * push;
        if (!circleHitsWall(nx, ny, r)) { t.x = nx; t.y = ny; }               // never shove a tank into a wall
        else if (!circleHitsWall(nx, t.y, r)) t.x = nx;
        else if (!circleHitsWall(t.x, ny, r)) t.y = ny;
      }
    }
  }
  function circleHitsWall(x, y, r) {
    r = r || TANK_R;
    const n = r > 16 ? 16 : 8;
    for (let a = 0; a < n; a++) { const ang = a / n * Math.PI * 2; if (isSolidAt(x + Math.cos(ang) * r, y + Math.sin(ang) * r)) return true; }
    return isSolidAt(x, y);
  }
  function fire(t) {
    t.cd = (t.fireCd || FIRE_CD) * (t.rapidT > 0 ? 0.5 : 1); t.flash = 1;
    const bx = t.x + Math.cos(t.turret) * 21, by = t.y + Math.sin(t.turret) * 21;
    shells.push({ x: bx, y: by, vx: Math.cos(t.turret) * SHELL_SPD, vy: Math.sin(t.turret) * SHELL_SPD, life: SHELL_LIFE, owner: t.id, dmg: t.dmg || 1, sid: ++shellSeq, sx: bx, sy: by });
    emit('fire', { id: t.id, x: bx, y: by, a: t.turret });
  }
  function damageWall(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor((y - HUD_H) / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    shake = Math.max(shake, 2.5);
    if (!isFinite(wallHP[r][c])) { emit('wall', { x, y, c, r, border: true }); return; }   // border: indestructible
    wallHP[r][c] -= 1;
    const broke = wallHP[r][c] <= 0;
    if (broke) { solid[r][c] = false; wallHP[r][c] = 0; }
    emit('wall', { x, y, c, r, hp: wallHP[r][c], broke });
  }
  function tankColor(i) {
    const t = tanks[i];
    if (t && t.team === 'enemy') return t.enemyColor || '#ff5277';
    if (t && t.team === 'ally' && i === 1) return '#a8f06f';
    if (t && t.team === 'ally' && i === 2) return '#6fb7f0';
    if (t && t.team === 'ally' && i === 3) return '#f0d96f';
    return i === 0 ? '#ffb347' : '#46d6e8';
  }
  function damageTank(i, owner, dmg) {
    const t = tanks[i]; if (!t.alive) return;
    if (t.invuln > 0) { if (t.shieldT > 0) emit('deflect', { id: i, x: t.x, y: t.y, by: owner, shield: true }); return; }
    t.hp = Math.max(0, (t.hp == null ? TANK_MAX_HP : t.hp) - (dmg || 1));
    t.flash = 1; shake = Math.max(shake, 3);
    if (t.hp <= 0) { killTank(i, owner, 'shell'); return; }
    emit('hit', { id: i, x: t.x, y: t.y, hp: t.hp, max: t.maxHp || TANK_MAX_HP, by: owner, team: t.team });
  }
  function awardDeath(i) {
    if (mode === 'coop') {
      if (tanks[i] && tanks[i].team === 'enemy') score.p1++;
      else score.p2++;
      return;
    }
    if (i === 0) score.p2++; else score.p1++;
  }
  function killTank(i, by, cause) {
    const t = tanks[i]; if (!t.alive) return; t.alive = false; t.hp = 0;
    emit('kill', { id: i, x: t.x, y: t.y, team: t.team, type: t.type || null, boss: t.boss ? t.bossType : null, by: by == null ? -1 : by, cause: cause || 'shell', color: tankColor(i), val: t.scoreVal || 0 });
    maybeDrop(t);
    if (mode === 'campaign') { shake = Math.max(shake, 6); onCampaignKill(t); return; }
    shake = 9; awardDeath(i); freezeT = FREEZE;
    emit('score', { p1: score.p1, p2: score.p2, victim: i, team: t.team });
  }
  function reviveTanks() {
    for (let i = 0; i < tanks.length; i++) if (!tanks[i].alive) {
      const s = spawnFor(i), p = tileCenter(s.c, s.r), t = tanks[i];
      t.x = p.x; t.y = p.y; t.heading = s.a; t.turret = s.a; t.speed = 0; t.vx = 0; t.vy = 0; t.flash = 0;   // clear leftover momentum
      t.hp = TANK_MAX_HP; t.alive = true; t.cd = 0.3; t.path = null; t.invuln = 0;
      spawnFx(t);
    }
  }
  function endMatch() {
    state = 'over'; winner = score.p1 === score.p2 ? 'draw' : (score.p1 > score.p2 ? 'p1' : 'p2');
    emit('end', { winner, mode, p1: score.p1, p2: score.p2 });
    if (!headless) maybeOfferScore();
    showOverlay('over');
  }

  /* ===================== render ===================== */
  let ctx, canvas, glCanvas = null, dpr = 1, viewW = LW, viewH = LH, mobileView = false;
  let gl3d = false, gl3dVer = -1, frameDt = STEP;
  const cam = { x: 0, y: 0, zoom: 1 };
  function use3d() { return gl3d && visualMode !== 'classic' && !!window.SD3D && SD3D.ready; }
  function hasTouchScreen() { return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches; }
  function clampCam(v, max) { return max <= 0 ? max / 2 : Math.max(0, Math.min(max, v)); }
  function updateCamera() {
    if (!mobileView) {                                    // desktop 2D: fit the whole arena, centred
      cam.zoom = Math.min(viewW / LW, viewH / LH);
      cam.x = clampCam(0, LW - viewW / cam.zoom); cam.y = clampCam(0, LH - viewH / cam.zoom);
      return cam;
    }
    const portrait = viewH >= viewW;
    cam.zoom = portrait ? 0.92 : 0.86;
    const vw = viewW / cam.zoom, vh = viewH / cam.zoom;
    let target = tanks[0];
    if (online.connected && online.role === 'p2' && tanks[1]) target = tanks[1];
    if (((state === 'attract' || mode === 'watch') || (online.connected && online.role === 'spectator')) && tanks[0] && tanks[1]) target = { x: (tanks[0].x + tanks[1].x) / 2, y: (tanks[0].y + tanks[1].y) / 2 };
    if (!target) target = { x: LW / 2, y: LH / 2 };
    cam.x = clampCam(target.x - vw * 0.5, LW - vw);
    cam.y = clampCam(target.y - vh * 0.5, LH - vh);
    return cam;
  }
  function screenToWorld(clientX, clientY) {
    if (!canvas) return { x: clientX, y: clientY };
    const r = canvas.getBoundingClientRect();
    if (use3d()) { const p = SD3D.pick(clientX, clientY, r); if (p) return p; }
    const sx = (clientX - r.left) / Math.max(1, r.width) * viewW;
    const sy = (clientY - r.top) / Math.max(1, r.height) * viewH;
    const c = updateCamera();
    return { x: c.x + sx / c.zoom, y: c.y + sy / c.zoom };
  }
  function toScreen(x, y, h) {                            // world point (+ height in 3D) → overlay pixels
    if (use3d()) return SD3D.toScreen(x, y, h || 0);
    return { x: (x - cam.x) * cam.zoom, y: (y - cam.y) * cam.zoom - (h || 0) * 0.6 * cam.zoom };
  }
  function render(dt) {
    if (!ctx) return;
    document.body.classList.toggle('classic-mode', visualMode === 'classic');
    const three = use3d();
    if (glCanvas) glCanvas.style.visibility = three ? 'visible' : 'hidden';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const T = SDArt.theme(visualMode);
    if (three) {
      if (gl3dVer !== layoutVer) { gl3dVer = layoutVer; SD3D.reset(); }
      SD3D.render(dt == null ? frameDt : dt);
      ctx.clearRect(0, 0, viewW, viewH);
      drawPlayerNames(); drawPopups();
      drawHUD(T); drawBanner(); drawFloatingStick(); drawScreenFlash();
      return;
    }
    const sx = (Math.random() - 0.5) * shake, sy = (Math.random() - 0.5) * shake;
    const c = updateCamera();
    const bg = ctx.createLinearGradient(0, 0, 0, viewH); bg.addColorStop(0, T.bg1); bg.addColorStop(1, T.bg0);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, viewW, viewH);
    ctx.save();
    ctx.scale(c.zoom, c.zoom); ctx.translate(-c.x + sx, -c.y + sy);
    SDArt.drawFloor(ctx, 0, HUD_H, FIELD_W, FIELD_H, visualMode);
    if (SDArt && visualMode !== 'classic') DECALS.draw(ctx);
    SDArt.drawWalls(ctx, { solid, hp: wallHP, MAX: WALL_MAX, COLS, ROWS, TILE, HUD_H }, visualMode);
    if (SDArt && visualMode !== 'classic') TRACKS.draw(ctx);
    const tm = tick * STEP;
    for (const m of mines) SDArt.drawMine(ctx, m, tm, visualMode);
    for (const p of pickups) drawPickup2D(p, tm);
    for (const t of tanks) if (t.alive) { if (t.boss) drawBossEntity(t, tm); else SDArt.drawTank(ctx, t, tm, visualMode); }
    for (const s of shells) SDArt.drawShell(ctx, s, visualMode);
    if (SDArt && visualMode !== 'classic') PARTS.draw(ctx);
    if (visualMode !== 'classic' && state === 'playing' && mouseAimActive() && tanks[0] && tanks[0].alive && mouseFresh > 0) SDArt.drawReticle(ctx, mouseX, mouseY, T.p1);
    ctx.restore();
    drawPlayerNames(); if (visualMode !== 'classic') drawPopups();
    drawHUD(T);
    if (visualMode !== 'classic') drawBanner();
    drawFloatingStick();
    if (visualMode === 'classic') SDArt.classicOverlay(ctx, viewW, viewH);
  }
  const PICK_COL = { repair: '#5dff7a', shield: '#5fd8ff', rapid: '#ffa040', life: '#ff5fa8' };
  function drawPickup2D(p, tm) {
    if (p.t < 3 && Math.sin(tm * 18) < 0) return;
    const col = visualMode === 'classic' ? '#fff' : (PICK_COL[p.kind] || '#fff');
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(tm * 1.5);
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.strokeRect(-8, -8, 16, 16);
    ctx.fillStyle = col; ctx.globalAlpha = 0.3; ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();
    ctx.fillStyle = col; ctx.font = 'bold 10px Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText({ repair: '+', shield: 'S', rapid: 'R', life: '♥' }[p.kind] || '?', p.x, p.y + 0.5);
  }
  /* ---- overlay effects: floating popups, centre banners, screen flashes ---- */
  const popups = []; let banner = null, hurtT = 0;
  function popup(x, y, text, color, big) { popups.push({ x, y, text, color: color || '#fff', t: big ? 1.6 : 1.1, max: big ? 1.6 : 1.1, big: !!big }); if (popups.length > 24) popups.shift(); }
  function showBanner(text, sub, color, dur) { banner = { text, sub: sub || '', color: color || '#eef3ff', t: dur || 2.2, max: dur || 2.2 }; }
  function drawPopups() {
    for (const p of popups) {
      const s = toScreen(p.x, p.y, 26); if (!s || s.behind) continue;
      const k = 1 - p.t / p.max, a = Math.min(1, p.t * 3);
      ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold ' + (p.big ? 18 : 14) + 'px Menlo,Consolas,monospace';
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(p.text, s.x, s.y - k * 34);
      ctx.fillStyle = p.color; ctx.fillText(p.text, s.x, s.y - k * 34);
      ctx.restore();
    }
  }
  function drawBanner() {
    if (!banner) return;
    const k = 1 - banner.t / banner.max, a = Math.min(1, banner.t * 2.5, k * 8), sc = 1 + Math.max(0, 0.25 - k * 2);
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.translate(viewW / 2, viewH * 0.36); ctx.scale(sc, sc);
    const big = mobileView ? 30 : 46;
    ctx.font = '900 ' + big + 'px Menlo,Consolas,monospace';
    ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,.65)'; ctx.strokeText(banner.text, 0, 0);
    ctx.fillStyle = banner.color; ctx.fillText(banner.text, 0, 0);
    if (banner.sub) { ctx.font = 'bold ' + (mobileView ? 13 : 16) + 'px Menlo,Consolas,monospace'; ctx.lineWidth = 4; ctx.strokeText(banner.sub, 0, big * 0.85); ctx.fillStyle = '#c9d4ea'; ctx.fillText(banner.sub, 0, big * 0.85); }
    ctx.restore();
  }
  function drawScreenFlash() {
    const f = Math.max(SD3D.flash || 0, hurtT);
    if (f <= 0.01) return;
    const g = ctx.createRadialGradient(viewW / 2, viewH / 2, Math.min(viewW, viewH) * 0.3, viewW / 2, viewH / 2, Math.max(viewW, viewH) * 0.75);
    g.addColorStop(0, 'rgba(255,40,20,0)'); g.addColorStop(1, 'rgba(255,40,20,' + (0.42 * f).toFixed(3) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, viewW, viewH);
  }

  function drawFloatingStick() {
    if (!stick.active) return;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = 'rgba(255,200,120,.52)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(stick.ox, stick.oy, 48, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,120,.24)';
    ctx.beginPath(); ctx.arc(stick.ox + stick.dx, stick.oy + stick.dy, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,225,170,.82)';
    ctx.beginPath(); ctx.arc(stick.ox + stick.dx, stick.oy + stick.dy, 22, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  function drawBossEntity(t, tm) {
    const r = t.hitR || 26, hit = t.flash > 0, arc = t.armorArc || WARDEN_ARC;
    ctx.save();
    ctx.translate(t.x, t.y);
    // ground shadow
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(3, 5, r + 2, r - 2, 0, 0, Math.PI * 2); ctx.fill();
    // hull
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r);
    g.addColorStop(0, hit ? '#fff' : '#ffd9cf'); g.addColorStop(0.5, t.enemyColor); g.addColorStop(1, '#3a0d10');
    ctx.fillStyle = g; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // segmented armor plating
    ctx.strokeStyle = 'rgba(0,0,0,.30)'; ctx.lineWidth = 2;
    for (let a = 0; a < 8; a++) { const ang = a / 8 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(ang) * (r * 0.45), Math.sin(ang) * (r * 0.45)); ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r); ctx.stroke(); }
    // front-armor highlight (Mauler)
    if (t.frontArmor) { ctx.fillStyle = 'rgba(190,215,255,.5)'; ctx.beginPath(); ctx.arc(0, 0, r, t.heading - arc, t.heading + arc); ctx.arc(0, 0, r - 8, t.heading + arc, t.heading - arc, true); ctx.closePath(); ctx.fill(); }
    // core glow keyed to phase
    ctx.fillStyle = t.phase >= 3 ? 'rgba(255,90,40,.9)' : t.phase >= 2 ? 'rgba(255,170,60,.75)' : 'rgba(255,230,180,.5)';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.28 + (t.phase >= 3 ? 2 : 0), 0, Math.PI * 2); ctx.fill();
    // turret barrel
    ctx.rotate(t.turret); ctx.fillStyle = '#1b1b1f'; ctx.fillRect(0, -5, r + 16, 10);
    ctx.fillStyle = '#2a2a30'; ctx.fillRect(-8, -9, 18, 18);
    ctx.restore();
  }
  function drawPlayerNames() {
    if (!online.connected || visualMode === 'classic') return;
    ctx.save();
    ctx.font = 'bold ' + (use3d() ? 11 : 9) + 'px Menlo,Consolas,monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const t of tanks) {
      if (!t || !t.alive || t.id > 1) continue;
      const role = t.id === 0 ? 'p1' : 'p2';
      const name = String(online.names[role] || role.toUpperCase()).slice(0, 12);
      const s = toScreen(t.x, t.y - (use3d() ? 0 : 24), use3d() ? 34 : 0); if (!s) continue;
      ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3;
      ctx.strokeText(name, s.x, s.y);
      ctx.fillStyle = role === 'p1' ? '#ffb347' : '#a8f06f';
      ctx.fillText(name, s.x, s.y);
    }
    ctx.restore();
  }
  function hudBand(w, h, a) {                              // solid in 2D; a soft fade over the 3D view
    if (use3d()) { const g = ctx.createLinearGradient(0, 0, 0, h + 26); g.addColorStop(0, 'rgba(4,7,12,' + (a + 0.22) + ')'); g.addColorStop(0.7, 'rgba(4,7,12,' + a * 0.7 + ')'); g.addColorStop(1, 'rgba(4,7,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h + 26); }
    else { ctx.fillStyle = 'rgba(0,0,0,' + a + ')'; ctx.fillRect(0, 0, w, h); }
  }
  function drawHUD(T) {
    const w = viewW, h = mobileView ? 56 : HUD_H;
    if (mode === 'campaign' && campaign && visualMode !== 'classic') { drawCampaignHUD(T, w, h); return; }
    if (visualMode === 'classic') {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      const s = mobileView ? 5 : 7;
      const y = mobileView ? 6 : 8;
      SDArt.classicDigit(ctx, mobileView ? 10 : 28, y, score.p1 % 10, s);
      SDArt.classicDigit(ctx, w - (mobileView ? 10 : 28) - s * 5, y, score.p2 % 10, s);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, h - 9, w, 9);
      return;
    }
    hudBand(w, h, 0.48);
    ctx.font = 'bold 40px Menlo,Consolas,monospace'; ctx.textBaseline = 'middle';
    ctx.fillStyle = visualMode === 'classic' ? '#fff' : T.p1; ctx.textAlign = 'left'; ctx.fillText(String(score.p1).padStart(2, '0'), mobileView ? 14 : 28, h / 2);
    ctx.fillStyle = visualMode === 'classic' ? '#bdbdbd' : (mode === 'coop' ? '#ff5277' : T.p2); ctx.textAlign = 'right'; ctx.fillText(String(score.p2).padStart(2, '0'), w - (mobileView ? 14 : 28), h / 2);
    drawHealthPips(T, w, h);
    const flash = timeLeft <= FLASH_AT && Math.floor(timeLeft * 2) % 2 === 0;
    ctx.fillStyle = timeLeft <= FLASH_AT ? (flash ? '#ff5277' : '#7a2236') : T.ink;
    ctx.font = 'bold 34px Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.fillText(Math.ceil(timeLeft).toString().padStart(2, '0'), w / 2, h / 2);
    ctx.fillStyle = T.inkDim; ctx.font = '11px Menlo,Consolas,monospace';
    const onlineLabel = online.connected ? 'ONLINE ' + String(online.role || '').toUpperCase() + '  ·  ' : '';
    const quality = online.connected && !mobileView ? onlineQualityText().toUpperCase() + '  ·  ' : '';
    const modeLabel = state === 'attract' ? 'ATTRACT - CPU vs CPU' : onlineLabel + quality + (mode === 'cpu' ? 'P1  vs  CPU' : (mode === 'watch' ? 'CPU 1  vs  CPU 2' : (mode === 'coop' ? 'CO-OP  vs  ENEMY TANKS' : 'P1  vs  P2')));
    ctx.fillText(modeLabel, w / 2, h - 10);
    if (freezeT > 0 && state === 'playing') { ctx.fillStyle = T.inkDim; ctx.font = 'bold 13px Menlo,Consolas,monospace'; ctx.fillText('- RELOADING -', w / 2, h / 2 + 22); }
  }
  function drawCampaignHUD(T, w, h) {
    hudBand(w, h, 0.52);
    ctx.textBaseline = 'middle';
    const padL = mobileView ? 12 : 22, padR = mobileView ? 12 : 22;
    // left: score + lives
    ctx.fillStyle = T.p1; ctx.font = 'bold ' + (mobileView ? 22 : 30) + 'px Menlo,Consolas,monospace'; ctx.textAlign = 'left';
    ctx.fillText(String(campaign.score).padStart(5, '0'), padL, h / 2 - 8);
    ctx.font = 'bold 11px Menlo,Consolas,monospace'; ctx.fillStyle = T.inkDim; ctx.fillText('LIVES', padL, h / 2 + 13);
    for (let i = 0; i < Math.max(0, campaign.lives); i++) { ctx.fillStyle = '#ff5277'; ctx.fillRect(padL + 44 + i * 13, h / 2 + 8, 9, 9); }
    // center: level + wave / banner
    const lv = LEVELS[campaign.levelIdx];
    ctx.textAlign = 'center'; ctx.fillStyle = T.ink; ctx.font = 'bold ' + (mobileView ? 13 : 16) + 'px Menlo,Consolas,monospace';
    ctx.fillText('LV' + (campaign.levelIdx + 1) + ' · ' + lv.name.toUpperCase(), w / 2, h / 2 - 9);
    ctx.fillStyle = T.inkDim; ctx.font = '12px Menlo,Consolas,monospace';
    const sub = campaign.banner && campaign.phase !== 'fight' ? campaign.banner
      : 'WAVE ' + (campaign.waveIdx + 1) + '/' + lv.waves.length + '  ·  ENEMIES ' + aliveCount('enemy');
    ctx.fillText(sub, w / 2, h / 2 + 11);
    // right: player health pips (all allies)
    const allies = tanks.filter(t => t.team === 'ally');
    let rx = w - padR;
    for (let a = 0; a < allies.length; a++) {
      const t = allies[a];
      for (let i = TANK_MAX_HP - 1; i >= 0; i--) { ctx.fillStyle = i < t.hp && t.alive ? tankColor(t.id) : 'rgba(255,255,255,.16)'; ctx.fillRect(rx - 11, h / 2 - 4, 9, 9); rx -= 12; }
      rx -= 8;
    }
    // boss health bar (top of the field) when a boss is active
    const boss = tanks.find(t => t.boss && t.alive);
    if (boss) {
      const bw = Math.min(w * 0.62, 380), bx = (w - bw) / 2, by = h + 6;
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(bx - 3, by - 3, bw + 6, 14);
      ctx.fillStyle = '#2a0c12'; ctx.fillRect(bx, by, bw, 8);
      ctx.fillStyle = boss.enemyColor; ctx.fillRect(bx, by, bw * Math.max(0, boss.hp / boss.maxHp), 8);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(boss.bossName + '  ·  PHASE ' + boss.phase + '/3', w / 2, by + 19);
    }
    // big mid-field banner during clear / level-clear (2D; the 3D view uses the animated centre banner)
    if ((campaign.phase === 'clear' || campaign.phase === 'levelclear') && !use3d()) {
      ctx.fillStyle = campaign.phase === 'levelclear' ? '#a8f06f' : T.ink;
      ctx.font = 'bold 34px Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(campaign.banner, w / 2, viewH / 2);
    }
    // supply-crate buffs on the local player
    const me = tanks[0];
    if (me && me.alive && (me.shieldT > 0 || me.rapidT > 0)) {
      ctx.font = 'bold 11px Menlo,Consolas,monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      let bx = padL, by = h + 14;
      if (me.shieldT > 0) { ctx.fillStyle = '#5fd8ff'; ctx.fillText('SHIELD ' + Math.ceil(me.shieldT), bx, by); bx += 92; }
      if (me.rapidT > 0) { ctx.fillStyle = '#ffa040'; ctx.fillText('RAPID ' + Math.ceil(me.rapidT), bx, by); }
    }
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
  const OVS = ['ovTitle', 'ovOnline', 'ovHow', 'ovOptions', 'ovPause', 'ovOver', 'ovScores'];
  function hideAllOverlays() { OVS.forEach(id => { const e = $(id); if (e) e.classList.add('hidden'); }); }
  function showOverlay(which) {
    if (headless) return;
    hideAllOverlays();
    const map = { title: 'ovTitle', online: 'ovOnline', how: 'ovHow', options: 'ovOptions', paused: 'ovPause', over: 'ovOver', scores: 'ovScores' };
    if (map[which]) { const e = $(map[which]); if (e) e.classList.remove('hidden'); }
    if (which === 'over') {
      const w = $('overResult'), retry = $('btnRetry');
      if (retry) retry.style.display = 'none';
      if (mode === 'campaign' && campaign) {
        if (w) w.textContent = campaign.phase === 'won' ? 'CAMPAIGN COMPLETE' : 'GAME OVER';
        const sc = $('overScore'); if (sc) sc.textContent = 'SCORE ' + campaign.score + ' · REACHED LV' + (campaign.levelIdx + 1);
        if (retry && campaign.phase !== 'won' && campaign.levelIdx > 0) { retry.style.display = ''; retry.textContent = 'RETRY LEVEL ' + (campaign.levelIdx + 1) + ' (score resets)'; }
      } else {
        if (w) w.textContent = winner === 'draw' ? 'DRAW' : (winner === 'p1' ? (mode === 'cpu' ? 'YOU WIN' : (mode === 'watch' ? 'CPU 1 WINS' : (mode === 'coop' ? 'TEAM WINS' : 'PLAYER 1 WINS'))) : (mode === 'cpu' ? 'CPU WINS' : (mode === 'watch' ? 'CPU 2 WINS' : (mode === 'coop' ? 'ENEMY TANKS WIN' : 'PLAYER 2 WINS'))));
        const sc = $('overScore'); if (sc) sc.textContent = score.p1 + ' — ' + score.p2;
      }
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
    emit('start', { mode });
    if (!headless) { SDAudio.init(); SDAudio.start(); }
    applyCursor(); updateTouchLayout();
  }
  function playAgain() {
    if (mode === 'campaign' && campaign) { startCampaign(0, campaign.players, aiLevel, (Math.random() * 1e9) | 0); return; }   // was restarting a broken 2-tank "campaign"
    if (online.connected && online.role === 'p1') startOnlineHost(mode); else startGame(mode);
  }
  function campaignStartLevel() { const s = $('campStart'); return s ? Math.max(0, parseInt(s.value, 10) || 0) : 0; }
  function loadCampaignBest() { try { return Math.max(0, parseInt(localStorage.getItem('sd_camp_best'), 10) || 0); } catch (e) { return 0; } }
  function saveCampaignBest(idx) { try { if (idx > loadCampaignBest()) localStorage.setItem('sd_camp_best', String(idx)); } catch (e) {} refreshCampStart(); }
  function refreshCampStart() {                          // checkpoints unlock after each boss you reach past
    const s = $('campStart'), wrap = $('campStartRow'); if (!s) return;
    const best = loadCampaignBest(), opts = [[0, 'LEVEL 1 · BOOT CAMP']];
    if (best >= 4) opts.push([4, 'LEVEL 5 · AFTER THE BASTION']);
    if (best >= 8) opts.push([8, 'LEVEL 9 · AFTER THE MAULER']);
    const cur = s.value;
    s.innerHTML = opts.map(([v, l]) => '<option value="' + v + '">' + l + '</option>').join('');
    if (opts.some(o => String(o[0]) === cur)) s.value = cur;
    if (wrap) wrap.style.display = opts.length > 1 ? '' : 'none';
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
  function cleanName(v) { return String(v || 'PLAYER').toUpperCase().replace(/[^A-Z0-9 _-]/g, '').trim().slice(0, 12) || 'PLAYER'; }
  function setOnlineStatus(text) {
    online.status = text || '';
    const el = $('onlineStatus'); if (el) el.textContent = online.status;
  }
  function resetOnlineState(keep) {
    if (online.reconnectTimer) { clearTimeout(online.reconnectTimer); online.reconnectTimer = 0; }
    online = {
      ws: null,
      room: keep && keep.room || '',
      role: null,
      id: null,
      mode: keep && keep.mode || 'duel',
      name: keep && keep.name || 'PLAYER',
      names: { p1: 'P1', p2: 'P2' },
      ready: { p1: false, p2: false },
      status: '',
      connected: false,
      started: false,
      lastInput: 0,
      lastSnapshot: 0,
      lastPing: 0,
      lastPong: 0,
      ping: null,
      reconnects: keep && keep.reconnects || 0,
      reconnectTimer: 0,
      manualClose: false,
      peers: [],
    };
  }
  function onlineQualityText() {
    if (!online.connected) return '';
    const age = online.lastPong ? perfNow() - online.lastPong : 0;
    if (!online.ping) return 'checking link';
    if (age > 9000) return 'link stale';
    return 'ping ' + Math.round(online.ping) + 'ms';
  }
  function updateOnlineMeta() {
    const q = $('onlineQuality');
    if (q) q.textContent = onlineQualityText();
    const copy = $('btnCopyInvite');
    if (copy) copy.disabled = !online.room;
  }
  function onlinePlayer(role) { return online.peers.find(p => p.role === role); }
  function syncPeerNames() {
    for (const peer of online.peers) {
      if ((peer.role === 'p1' || peer.role === 'p2') && peer.name) online.names[peer.role] = cleanName(peer.name);
    }
  }
  function renderOnlineLobby() {
    const lobby = $('onlineLobby'), slots = $('lobbySlots'), label = $('lobbyRoomLabel'), readyBtn = $('btnOnlineReady'), startBtn = $('btnOnlineStart');
    if (!lobby || !slots) return;
    const show = !!online.connected && !online.started;
    lobby.classList.toggle('on', show);
    if (!show) return;
    if (label) label.textContent = online.room || '';
    updateOnlineMeta();
    syncPeerNames();
    const rows = [
      { role: 'p1', title: 'P1' },
      { role: 'p2', title: 'P2' },
    ].map(slot => {
      const peer = onlinePlayer(slot.role);
      const name = peer ? cleanName(peer.name || online.names[slot.role] || slot.title) : 'OPEN';
      const ready = !!online.ready[slot.role];
      return '<div class="slot-row"><div class="slot-role">' + slot.title + '</div><div class="slot-name">' + escapeHtml(name) + '</div><div class="slot-state ' + (ready ? 'ready' : '') + '">' + (peer ? (ready ? 'READY' : 'NOT READY') : 'WAITING') + '</div></div>';
    });
    const spectators = online.peers.filter(p => p.role === 'spectator');
    if (spectators.length) rows.push('<div class="slot-row"><div class="slot-role">WATCH</div><div class="slot-name">' + escapeHtml(spectators.map(p => cleanName(p.name || 'SPECTATOR')).join(', ')) + '</div><div class="slot-state">' + spectators.length + '/2</div></div>');
    slots.innerHTML = rows.join('');
    const playerRole = online.role === 'p1' || online.role === 'p2';
    if (readyBtn) {
      readyBtn.style.display = playerRole ? '' : 'none';
      readyBtn.textContent = online.ready[online.role] ? 'READY ✓' : 'READY';
      readyBtn.classList.toggle('primary', !!online.ready[online.role]);
    }
    const p1 = !!onlinePlayer('p1'), p2 = !!onlinePlayer('p2');
    const canStart = online.role === 'p1' && p1 && p2 && online.ready.p1 && online.ready.p2;
    if (startBtn) {
      startBtn.style.display = online.role === 'p1' ? '' : 'none';
      startBtn.disabled = !canStart;
      startBtn.textContent = canStart ? 'START MATCH' : 'WAITING FOR READY';
    }
  }
  function onlineUrl(room) { return ONLINE_WS.replace(/\/+$/, '') + '/' + encodeURIComponent(room); }
  function onlineHttpBase() { return ONLINE_WS.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:').replace(/\/ws\/?$/, ''); }
  function inviteUrl() {
    const u = new URL(location.href);
    u.searchParams.set('online', online.room || cleanRoom(''));
    u.searchParams.set('mode', online.mode || 'duel');
    u.hash = 'online';
    return u.toString();
  }
  async function copyInvite() {
    if (!online.room) return;
    const url = inviteUrl();
    try {
      await navigator.clipboard.writeText(url);
      setOnlineStatus('Invite link copied for room ' + online.room);
    } catch (e) {
      const inp = $('onlineRoom'); if (inp) { inp.focus(); inp.select(); }
      setOnlineStatus('Invite: ' + url);
    }
  }
  function escapeHtml(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function onlineSend(data) {
    if (!online.ws || online.ws.readyState !== WebSocket.OPEN) return false;
    online.ws.send(JSON.stringify(data)); return true;
  }
  function sendOnlinePing(now) {
    if (!online.connected || now - online.lastPing < 3000) return;
    online.lastPing = now;
    onlineSend({ type: 'ping', sent: now });
  }
  function smoothOnlineView(dt) {
    if (!online.connected || online.role === 'p1' || state !== 'playing') return;
    const k = 1 - Math.pow(0.001, Math.min(0.08, dt) / 0.12);
    for (const t of tanks) {
      if (!t || !t.net) continue;
      t.x += (t.net.x - t.x) * k;
      t.y += (t.net.y - t.y) * k;
      t.heading += wrapAngle(t.net.heading - t.heading) * k;
      t.turret += wrapAngle(t.net.turret - t.turret) * k;
      if (Math.hypot(t.net.x - t.x, t.net.y - t.y) < 0.35) { t.x = t.net.x; t.y = t.net.y; }
    }
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
    if (online.role !== 'p1') return;
    if (!onlinePlayer('p2') || !online.ready.p1 || !online.ready.p2) {
      setOnlineStatus('Waiting for both players to ready up');
      renderOnlineLobby();
      return;
    }
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] | 0;
    online.mode = m || online.mode || 'duel';
    online.names.p1 = online.name;
    online.started = true;
    renderOnlineLobby();
    startGame(online.mode, seed);
    onlineSend({ type: 'hello', name: online.name });
    onlineSend({ type: 'start', mode: online.mode, seed });
    sendOnlineSnapshot(perfNow(), true);
    setOnlineStatus('Room ' + online.room + ' · match started');
  }
  function toggleOnlineReady() {
    if (!online.connected || (online.role !== 'p1' && online.role !== 'p2')) return;
    online.ready[online.role] = !online.ready[online.role];
    onlineSend({ type: 'ready', ready: online.ready[online.role] });
    setOnlineStatus(online.ready[online.role] ? 'Ready in room ' + online.room : 'Not ready in room ' + online.room);
    renderOnlineLobby();
  }
  function disconnectOnline() {
    const keepName = online.name || 'PLAYER';
    const keepMode = online.mode || 'duel';
    online.manualClose = true;
    if (online.reconnectTimer) { clearTimeout(online.reconnectTimer); online.reconnectTimer = 0; }
    if (online.ws) {
      try { online.ws.close(1000, 'menu'); } catch {}
    }
    resetOnlineState({ name: keepName, mode: keepMode });
    setOnlineStatus('');
    renderOnlineLobby();
  }
  function handleOnlineMessage(data) {
    if (!data || !data.type) return;
    if (data.type === 'welcome') {
      online.connected = true; online.role = data.role; online.id = data.id; online.peers = data.peers || [];
      online.started = false; online.ready = { p1: false, p2: false };
      if (online.role === 'p1' || online.role === 'p2') online.names[online.role] = online.name;
      onlineSend({ type: 'hello', name: online.name });
      renderOnlineLobby();
      if (online.role === 'p1') setOnlineStatus('Room ' + online.room + ' · you are P1 · waiting for P2');
      else if (online.role === 'p2') setOnlineStatus('Room ' + online.room + ' · you are P2 · waiting for host');
      else setOnlineStatus('Room ' + online.room + ' · spectating');
      return;
    }
    if (data.type === 'hello' && (data.role === 'p1' || data.role === 'p2' || data.role === 'spectator')) {
      online.names[data.role] = cleanName(data.name);
      const peer = online.peers.find(p => p.id === data.from);
      if (peer) peer.name = cleanName(data.name);
      renderOnlineLobby();
      if (online.role === 'p1') sendOnlineSnapshot(perfNow(), true);
      return;
    }
    if (data.type === 'ready' && (data.role === 'p1' || data.role === 'p2')) {
      online.ready[data.role] = !!data.ready;
      renderOnlineLobby();
      return;
    }
    if (data.type === 'pong') {
      const sent = Number(data.sent) || online.lastPing;
      online.ping = Math.max(1, perfNow() - sent);
      online.lastPong = perfNow();
      updateOnlineMeta();
      return;
    }
    if (data.type === 'peer') {
      online.peers = data.peers || [];
      if (!onlinePlayer('p1')) online.ready.p1 = false;
      if (!onlinePlayer('p2')) online.ready.p2 = false;
      renderOnlineLobby();
      if (online.role === 'p1' && !online.started && online.ready.p1) onlineSend({ type: 'ready', ready: true });
      if (online.role === 'p1' && state === 'playing' && online.started) {
        onlineSend({ type: 'start', mode, seed: tick || 1 });
        sendOnlineSnapshot(perfNow(), true);
      }
      return;
    }
    if (data.type === 'start' && online.role !== 'p1') {
      online.mode = data.mode === 'coop' ? 'coop' : 'duel';
      online.started = true;
      renderOnlineLobby();
      startGame(online.mode, Number(data.seed) || 1);
      setOnlineStatus('Room ' + online.room + ' · you are ' + (online.role === 'p2' ? 'P2' : 'spectating'));
      return;
    }
    if (data.type === 'input' && online.role === 'p1' && data.role === 'p2') applyRemoteControl(data.control);
    if (data.type === 'snapshot' && online.role !== 'p1') applySnapshot(data.snapshot);
    if (data.type === 'error') setOnlineStatus('Online error: ' + data.message);
  }
  function connectOnline(rejoining) {
    const inp = $('onlineRoom'), sel = $('onlineMode'), nameInput = $('onlineName');
    const room = cleanRoom(inp && inp.value);
    if (inp) inp.value = room;
    online.name = cleanName(nameInput && nameInput.value);
    if (nameInput) nameInput.value = online.name;
    online.mode = sel && sel.value === 'coop' ? 'coop' : 'duel';
    if (online.ws && !rejoining) disconnectOnline();
    if (!rejoining) online.reconnects = 0;
    online.manualClose = false;
    setOnlineStatus((rejoining ? 'Reconnecting to ' : 'Connecting to room ') + room + '...');
    online.room = room;
    online.ready = { p1: false, p2: false };
    if (!rejoining) online.started = false;
    online.peers = [];
    renderOnlineLobby();
    const ws = new WebSocket(onlineUrl(room));
    online.ws = ws;
    ws.addEventListener('open', () => { online.reconnects = 0; setOnlineStatus('Connected · assigning slot...'); });
    ws.addEventListener('message', e => {
      try { handleOnlineMessage(JSON.parse(e.data)); }
      catch { setOnlineStatus('Online error: bad server message'); }
    });
    ws.addEventListener('close', () => {
      const wasRoom = online.room, keepMode = online.mode, keepName = online.name, wasManual = online.manualClose;
      const canReconnect = !wasManual && wasRoom && online.reconnects < 3;
      online.connected = false; online.ws = null; online.role = null;
      online.ready = { p1: false, p2: false }; online.peers = [];
      renderOnlineLobby();
      if (canReconnect) {
        online.reconnects++;
        setOnlineStatus('Connection dropped · reconnecting ' + online.reconnects + '/3');
        online.reconnectTimer = setTimeout(() => {
          const inp2 = $('onlineRoom'), sel2 = $('onlineMode'), name2 = $('onlineName');
          if (inp2) inp2.value = wasRoom;
          if (sel2) sel2.value = keepMode;
          if (name2) name2.value = keepName;
          connectOnline(true);
        }, 900 + online.reconnects * 700);
      } else if (wasRoom) {
        setOnlineStatus('Disconnected from room ' + wasRoom);
      }
    });
    ws.addEventListener('error', () => setOnlineStatus('Online connection failed'));
  }
  async function refreshOpenRooms() {
    const box = $('openRooms');
    if (!box) return;
    box.innerHTML = '<div class="room-empty">Checking for waiting players...</div>';
    try {
      const res = await fetch(onlineHttpBase() + '/rooms', { cache: 'no-store' });
      const data = await res.json();
      const rooms = Array.isArray(data.rooms) ? data.rooms : [];
      if (!rooms.length) {
        box.innerHTML = '<div class="room-empty">No open rooms right now</div>';
        return;
      }
      box.innerHTML = rooms.map(room => {
        const code = cleanRoom(room.room);
        const host = cleanName(room.host);
        const roomMode = room.mode === 'coop' ? 'coop' : 'duel';
        const label = roomMode === 'coop' ? 'CO-OP' : 'DUEL';
        const spec = Math.max(0, Number(room.spectators) || 0);
        return '<div class="room-row"><div><div class="room-main">' + escapeHtml(code) + ' · ' + escapeHtml(host) + ' waiting</div><div class="room-meta">' + label + (spec ? ' · ' + spec + ' watching' : '') + '</div></div><button class="room-join" data-room="' + escapeHtml(code) + '" data-mode="' + roomMode + '">JOIN</button></div>';
      }).join('');
      box.querySelectorAll('.room-join').forEach(btn => btn.addEventListener('click', () => {
        const roomInput = $('onlineRoom'), modeInput = $('onlineMode');
        if (roomInput) roomInput.value = btn.dataset.room || '';
        if (modeInput) modeInput.value = btn.dataset.mode === 'coop' ? 'coop' : 'duel';
        connectOnline();
      }));
    } catch (e) {
      box.innerHTML = '<div class="room-empty">Open rooms unavailable</div>';
    }
  }

  /* ===================== scores ===================== */
  const Scores = {
    BASE: 'https://game-scores.jez237.workers.dev/scores/', NS: 'steel-duel', cache: {}, last: null,
    ns() { return mode === 'campaign' ? 'steel-duel-campaign' : 'steel-duel'; },   // campaign ranks on its own board
    async fetch(nsOverride) { const ns = nsOverride || this.ns(); try { const r = await fetch(this.BASE + ns, { cache: 'no-store' }); const d = await r.json(); this.cache[ns] = (Array.isArray(d) ? d : (d.scores || [])).map(s => ({ name: String(s.initials || s.name || '???').slice(0, 3).toUpperCase(), score: s.score | 0 })).sort((a, b) => b.score - a.score).slice(0, 8); } catch (e) { this.cache[ns] = 'offline'; } return this.cache[ns]; },
    async submit(name, sc) { const ns = this.ns(); this.last = { name, score: sc }; try { await fetch(this.BASE + ns, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials: name, score: sc }) }); this.cache[ns] = null; } catch (e) {} },
  };
  function scoreSubject() {
    if (mode === 'campaign' && campaign) return { points: Math.max(0, campaign.score), label: campaign.players > 1 ? 'Co-op' : 'You', mode: 'campaign Lv' + (campaign.levelIdx + 1) };
    if (mode === 'coop') return { points: Math.max(0, score.p1), label: 'Team', mode: 'co-op' };
    if (mode === 'duel') {
      const p2Win = winner === 'p2' || score.p2 > score.p1;
      return { points: Math.max(0, p2Win ? score.p2 : score.p1), label: p2Win ? 'Player 2' : 'Player 1', mode: online.connected ? 'online duel' : 'duel' };
    }
    return { points: Math.max(0, score.p1), label: 'You', mode: 'CPU ' + diffName(aiLevel) };
  }
  function scoreValue() {
    const s = scoreSubject();
    if (mode === 'campaign' && campaign) return s.points * 100 + Math.min(99, (campaign.levelIdx + 1));
    const modeBonus = mode === 'cpu' ? Math.round(aiLevel) : (mode === 'coop' ? 75 : 40);
    return s.points * 100 + modeBonus;
  }
  function maybeOfferScore() {
    const el = $('overScoreForm'); if (el) el.classList.add('hidden');
    if (mode === 'watch' || (online.connected && online.role === 'spectator')) return;
    const s = scoreSubject(); if (s.points <= 0) return;
    if (el) el.classList.remove('hidden');
    const v = $('overYourScore'); if (v) v.textContent = s.label + ' scored ' + s.points + ' in ' + s.mode;
  }
  let boardTab = null;
  async function refreshBoard(tab) {
    const box = $('scoreBoard'); if (!box) return; box.innerHTML = '<div class="sb-row">loading…</div>';
    boardTab = tab || boardTab || (mode === 'campaign' ? 'campaign' : 'versus');
    const camp = boardTab === 'campaign';
    document.querySelectorAll('.sb-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === boardTab));
    const head = `<div class="sb-row" style="opacity:.55;font-size:11px;letter-spacing:1px"><span>${camp ? 'CAMPAIGN' : 'VERSUS'} BOARD</span><span>${camp ? 'score / lvl' : 'pts'}</span></div>`;
    const list = await Scores.fetch(camp ? 'steel-duel-campaign' : 'steel-duel');
    if (list === 'offline') { box.innerHTML = head + '<div class="sb-row">leaderboard offline</div>'; return; }
    if (!list.length) { box.innerHTML = head + '<div class="sb-row">no scores yet — be the first</div>'; return; }
    box.innerHTML = head + list.map((s, i) => `<div class="sb-row"><span>${i + 1}. ${s.name}</span><span>${Math.floor(s.score / 100)} <small style="opacity:.5">/${s.score % 100}</small></span></div>`).join('');
  }
  function diffName(v) { return v <= 8 ? 'Stupid' : v <= 30 ? 'Rookie' : v <= 55 ? 'Seasoned' : v <= 80 ? 'Crack Shot' : v < 100 ? 'Lethal' : "Can't Defeat"; }

  /* ===================== loop ===================== */
  let lastT = 0, acc = 0, rafId = 0, slowMo = 0;
  function frame(t) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - lastT) / 1000) || 0; lastT = t; frameDt = dt;
    const simScale = slowMo > 0 && !online.connected ? 0.3 : 1; slowMo = Math.max(0, slowMo - dt);   // kill-cam slow motion on boss kills
    if (state === 'playing' || state === 'attract') { acc += dt * simScale; let n = 0; while (acc >= STEP && n < 5) { update(); acc -= STEP; n++; } }
    sendOnlineInput(t);
    sendOnlineSnapshot(t, false);
    sendOnlinePing(t);
    smoothOnlineView(dt);
    consumeEvents();
    present(dt);
    if (SDArt) { PARTS.update(dt); TRACKS.update(dt); if (!use3d()) layTracks2D(); }
    render(dt);
  }

  /* ===================== presentation: events → effects, audio, announcer ===================== */
  const pres = { streak: 0, lastKill: -9, flankSaid: false, lastScoreVo: -9, trackDist: {} };
  function consumeEvents() { while (events.length) dispatch(events.shift()); }
  function dispatch(e) {
    if (use3d()) SD3D.event(e); else fx2d(e);
    if (state === 'attract' || headless) return;          // the attract duel is visual only
    sound(e);
  }
  function fx2d(e) {
    if (!PARTS) return;
    switch (e.k) {
      case 'wall': PARTS.explosion(e.x, e.y, '#cfd6e6'); PARTS.chips(e.x, e.y, '#8a93a6'); if (e.broke) DECALS.add(e.c * TILE + TILE / 2, HUD_H + e.r * TILE + TILE / 2, 22); break;
      case 'hit': PARTS.chips(e.x, e.y, tankColor(e.id)); DECALS.add(e.x, e.y, 12); break;
      case 'deflect': PARTS.chips(e.x, e.y, '#cfe0ff'); break;
      case 'kill': PARTS.explosion(e.x, e.y, e.color || '#ff5277'); DECALS.add(e.x, e.y, 30); break;
      case 'mine': PARTS.explosion(e.x, e.y, '#ff8a4f'); DECALS.add(e.x, e.y, 26); break;
      case 'mineDrop': DECALS.add(e.x, e.y, 10); break;
      case 'flak': PARTS.chips(e.x, e.y, '#fff4c2'); break;
      case 'pick': PARTS.chips(e.x, e.y, PICK_COL[e.kind] || '#fff'); break;
    }
  }
  function layTracks2D() {
    for (const t of tanks) {
      if (!t || !t.alive) continue;
      const last = pres.trackDist[t.id];
      if (last == null || t.dist < last) { pres.trackDist[t.id] = t.dist; continue; }
      if (t.dist - last > 7) { TRACKS.add(t.x, t.y, t.heading); pres.trackDist[t.id] = t.dist; }
    }
  }
  function localTankId() { return online.connected && online.role === 'p2' ? 1 : 0; }
  function isMine(id) {                                   // a tank a human on this screen drives
    const t = tanks[id]; if (!t || mode === 'watch') return false;
    if (online.connected) return id === localTankId();
    return !bots[id] && !t.boss && t.team !== 'enemy';
  }
  function panOf(x) { return x == null ? 0 : Math.max(-0.8, Math.min(0.8, (x - FIELD_W / 2) / (FIELD_W / 2) * 0.7)); }
  function nearGain(x, y) {
    const f = focusTank(); if (!f || x == null) return 1;
    return 0.55 + 0.45 * Math.max(0, 1 - Math.hypot(x - f.x, y - f.y) / 700);
  }
  const BOSS_TITLES = { bastion: 'THE BASTION', mauler: 'MAULER', warlord: 'IRON WARLORD' };
  function sound(e) {
    const at = v => ({ pan: panOf(e.x), gain: v * nearGain(e.x, e.y) }), now = perfNow() / 1000;
    switch (e.k) {
      case 'fire': SDAudio.play('cannon', Object.assign(at(e.big ? 0.72 : 0.55), { rate: e.big ? 0.78 : 1 })); break;
      case 'wall': SDAudio.play(e.broke ? 'wallbreak' : 'wall', Object.assign(at(e.broke ? 0.8 : e.border ? 0.35 : 0.45), { minGap: e.broke ? 0 : 0.04, rate: e.border ? 1.25 : 1 })); break;
      case 'hit':
        SDAudio.play('hit', at(0.75));
        if (isMine(e.id)) { hurtT = 0.7; if (navigator.vibrate && touchActive) try { navigator.vibrate(40); } catch (er) {} }
        break;
      case 'deflect':
        SDAudio.play('ricochet', at(0.7));
        if (mode === 'campaign' && !e.shield && !pres.flankSaid && isMine(e.by)) { pres.flankSaid = true; SDAudio.say('flank', 2); popup(e.x, e.y, 'FLANK IT!', '#9fc2ff'); }
        break;
      case 'kill': {
        SDAudio.play('explode', Object.assign(at(e.boss ? 1 : 0.85), { rate: e.boss ? 0.8 : 1 }));
        if (e.boss) { SDAudio.play('explode', { gain: 0.8, rate: 0.62, delay: 0.3 }); SDAudio.say('bossdown', 3); slowMo = 1.4; showBanner(BOSS_TITLES[e.boss] || 'BOSS', 'DESTROYED', '#ffd27a', 2.4); }
        if (isMine(e.id)) hurtT = 1;
        if (e.team === 'enemy' && (mode === 'campaign' || mode === 'coop') && tanks[e.by] && tanks[e.by].team === 'ally') {
          if (e.val) popup(e.x, e.y, '+' + e.val, e.color);
          pres.streak = now - pres.lastKill < 3.2 ? pres.streak + 1 : 1; pres.lastKill = now;
          if (pres.streak === 2) { SDAudio.say('double', 1); showBanner('DOUBLE KILL', '', '#ffd27a', 1.2); }
          else if (pres.streak === 3) { SDAudio.say('triple', 2); showBanner('TRIPLE KILL', '', '#ffb347', 1.4); }
          else if (pres.streak === 5) { SDAudio.say('rampage', 2); showBanner('UNSTOPPABLE', '', '#ff7a4f', 1.6); }
        }
        break;
      }
      case 'mine': SDAudio.play('mine', at(1)); break;
      case 'mineDrop': SDAudio.blip(160); break;
      case 'flak': SDAudio.play('flak', at(0.7)); popup(e.x, e.y, 'FLAK', '#fff4c2'); break;
      case 'phase': SDAudio.play('bosshorn', { gain: 0.7 }); SDAudio.say('phase', 2); showBanner('PHASE ' + e.phase, BOSS_TITLES[e.boss] || '', '#ff7a4f', 1.6); break;
      case 'wave': {
        const lvName = 'LV' + (e.lv + 1) + ' · ' + String(e.name || '').toUpperCase();
        if (e.boss) { SDAudio.play('bosshorn', { gain: 0.85 }); SDAudio.say(e.boss, 3); showBanner(BOSS_TITLES[e.boss] || 'BOSS', lvName, '#ff7a4f', 2.8); }
        else {
          SDAudio.play('klaxon', { gain: 0.4 });
          SDAudio.say(e.wave === 0 ? 'wave1' : (e.wave === e.waves - 1 && e.waves > 2) ? 'wave3' : 'wave2', 2);
          showBanner(e.wave === 0 ? lvName : 'WAVE ' + (e.wave + 1), e.wave === 0 ? 'WAVE 1 / ' + e.waves : (e.wave === e.waves - 1 ? 'FINAL WAVE' : ''), '#eef3ff', 2);
        }
        break;
      }
      case 'waveClear': SDAudio.say('waveclear', 2); showBanner('WAVE CLEAR', '', '#eef3ff', 1.3); break;
      case 'levelClear': SDAudio.say('levelclear', 2); SDAudio.play('pickup', { gain: 0.4 }); showBanner('LEVEL CLEAR', e.boss ? 'CHECKPOINT UNLOCKED' : '', '#a8f06f', 2.2); break;
      case 'lifeLost': SDAudio.say(e.lives === 1 ? 'lastlife' : 'tankdown', 2); break;
      case 'lifeUp': SDAudio.say('extralife', 1); break;
      case 'campEnd': SDAudio.play(e.won ? 'victory' : 'defeat', { gain: 0.8 }); SDAudio.say(e.won ? 'complete' : 'gameover', 3); break;
      case 'end': {
        const w = e.winner, cpu = mode === 'cpu', coop = mode === 'coop';
        const youWon = (cpu && w === 'p1') || (coop && w === 'p1') || (online.connected && ((online.role === 'p1' && w === 'p1') || (online.role === 'p2' && w === 'p2')));
        const lost = (cpu || coop) && w === 'p2';
        SDAudio.play(lost ? 'defeat' : 'victory', { gain: 0.75 });
        SDAudio.say(w === 'draw' ? 'draw' : cpu ? (w === 'p1' ? 'youwin' : 'cpuwins') : coop ? (w === 'p1' ? 'teamwins' : 'gameover') : (youWon ? 'youwin' : w === 'p1' ? 'p1wins' : 'p2wins'), 3);
        break;
      }
      case 'score': {
        if (now - pres.lastScoreVo < 1.6) break; pres.lastScoreVo = now;
        if (mode === 'coop') SDAudio.say(e.team === 'enemy' ? 'teamscores' : 'enemyscores', 1);
        else if (mode === 'cpu') SDAudio.say(e.victim === 1 ? 'teamscores' : 'enemyscores', 1);
        else SDAudio.say(e.victim === 0 ? 'p2scores' : 'p1scores', 1);
        break;
      }
      case 'time': SDAudio.say(e.s === 20 ? '20s' : '10s', 2); SDAudio.blip(e.s === 10 ? 1240 : 920); break;
      case 'start': SDAudio.say('ready', 3); SDAudio.say('fight', 1); break;
      case 'drop': SDAudio.blip(1480); break;
      case 'pick': {
        SDAudio.play(e.kind === 'repair' ? 'repair' : e.kind === 'shield' ? 'shield' : 'pickup', { gain: 0.75 });
        SDAudio.say(e.kind === 'life' ? 'extralife' : e.kind, 1);
        popup(e.x, e.y, { repair: 'REPAIR +2', shield: 'SHIELD', rapid: 'RAPID FIRE', life: mode === 'campaign' ? '+1 LIFE' : 'FULL REPAIR' }[e.kind] || '', PICK_COL[e.kind], true);
        break;
      }
    }
  }
  function present(dt) {
    for (let i = popups.length - 1; i >= 0; i--) { popups[i].t -= dt; if (popups[i].t <= 0) popups.splice(i, 1); }
    if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
    hurtT = Math.max(0, hurtT - dt * 1.6);
    if (!SDAudio.context) return;                        // audio starts on the first tap/click
    const boss = mode === 'campaign' && tanks.some(t => t.boss && t.alive);
    SDAudio.music(state === 'playing' || state === 'paused' ? (boss ? 'boss' : 'battle') : 'menu');
    SDAudio.tick();
    let lvl = 0, mot = 0;
    if (state === 'playing') { const f = focusTank(); if (f && f.alive && isMine(f.id)) { mot = Math.min(1, Math.abs(f.speed) / MAX_FWD); lvl = 0.35 + 0.65 * mot; } }
    SDAudio.engine(lvl, mot);
  }
  function focusTank() {                                  // the tank the camera and the mix centre on
    if (state !== 'playing' && state !== 'paused') return null;
    if (mode === 'watch' || (online.connected && online.role === 'spectator')) return null;
    return tanks[localTankId()] || null;
  }
  function layoutInfo() {
    const col = i => ['#ffb347', '#46d6e8', '#ff5277', '#ff5277'][i];
    if (mode === 'campaign') return { arena: campaign ? LEVELS[campaign.levelIdx].arena : 'open', mineRect: null, spawns: CAMP_ALLY_SPAWNS.slice(0, campaign ? campaign.players : 1).map((s, i) => ({ c: s.c, r: s.r, color: ['#ffb347', '#a8f06f', '#6fb7f0', '#f0d96f'][i] })) };
    if (mode === 'coop') return { arena: 'duel', mineRect: MINE_RECT, spawns: COOP_SPAWNS.map((s, i) => ({ c: s.c, r: s.r, color: i < 2 ? ['#ffb347', '#a8f06f'][i] : '#ff5277' })) };
    return { arena: 'duel', mineRect: MINE_RECT, spawns: SPAWNS.map((s, i) => ({ c: s.c, r: s.r, color: col(i) })) };
  }
  const api3d = {
    consts: () => ({ COLS, ROWS, TILE, HUD_H, FW: FIELD_W, FH: FIELD_H, WALL_MAX, TANK_R }),
    solid: () => solid, wallHP: () => wallHP, mines: () => mines, tanks: () => tanks, shells: () => shells, pickups: () => pickups,
    state: () => state, mobile: () => mobileView, hudH: () => (mobileView ? 56 : HUD_H),
    focus: () => focusTank(),
    reticle: () => (state === 'playing' && mouseAimActive() && tanks[0] && tanks[0].alive && mouseFresh > 0) ? { x: mouseX, y: mouseY, from: tanks[0] } : null,
    layout: layoutInfo,
    onLost: () => { gl3d = false; },
  };
  function init3d() {
    if (gl3d || !glCanvas || !window.SD3D || new URLSearchParams(location.search).has('no3d')) return;
    if (SD3D.init(glCanvas, api3d)) {
      gl3d = true; gl3dVer = -1;
      SD3D.setQuality(gfxQuality); SD3D.setCamMode(camPref);
      resize();
    }
  }

  /* ===================== input ===================== */
  const keys = {};
  function onKey(e, down) {
    const c = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyF'].includes(c)) e.preventDefault();
    keys[c] = down;
    const c0 = controls[0], c1 = controls[1];
    c0.fwd = !!keys['KeyW']; c0.back = !!keys['KeyS']; c0.left = !!keys['KeyA']; c0.right = !!keys['KeyD'];
    c0.fire = !!(keys['Space'] || keys['KeyF']);
    // local two-player keyboard: P2 on arrows + Enter/RShift (duel, survival co-op, and campaign co-op)
    const twoLocal = (mode === 'duel' || mode === 'coop' || (mode === 'campaign' && campaign && campaign.players > 1)) && !(online.connected && online.role === 'p1');
    if (twoLocal) {
      c1.fwd = !!keys['ArrowUp']; c1.back = !!keys['ArrowDown']; c1.left = !!keys['ArrowLeft']; c1.right = !!keys['ArrowRight']; c1.fire = !!(keys['Enter'] || keys['ShiftRight']);
    }
    if (!down || e.repeat) return;
    if (e.target && e.target.closest && e.target.closest('input, select')) return;
    // pausing the host would silently freeze the remote player, so online matches don't pause
    if ((c === 'KeyP' || c === 'Escape') && !online.connected) { if (state === 'playing') { state = 'paused'; showOverlay('paused'); } else if (state === 'paused') { state = 'playing'; hideAllOverlays(); } }
    if (c === 'KeyM') setMuted(!muted);
    if (c === 'KeyC') toggleVisual();
    if (c === 'KeyV') cycleCamera();
  }
  function toggleVisual() { visualMode = visualMode === 'hd' ? 'classic' : 'hd'; syncVisualButton(); }
  function syncVisualButton() { const b = $('btnClassic'); if (b) b.textContent = visualMode === 'classic' ? '1974' : (gl3d ? '3D' : 'HD'); }
  const CAM_MODES = ['auto', 'overview', 'follow'], CAM_LABEL = { auto: 'AUTO', overview: 'WHOLE ARENA', follow: 'FOLLOW TANK' };
  function cycleCamera() { setCamPref(CAM_MODES[(CAM_MODES.indexOf(camPref) + 1) % CAM_MODES.length]); if (use3d() && state === 'playing') popup(tanks[0] ? tanks[0].x : FIELD_W / 2, tanks[0] ? tanks[0].y : HUD_H + FIELD_H / 2, 'CAMERA: ' + CAM_LABEL[camPref], '#cfe0ff'); }
  function mouseAimActive() { return !touchActive && (mode === 'cpu' || mode === 'coop' || (mode === 'campaign' && campaign && campaign.players === 1)); }
  function applyCursor() { if (canvas) canvas.style.cursor = (state === 'playing' && mouseAimActive()) ? 'none' : 'default'; }
  function updateTouchLayout() {                          // assisted modes use floating drag anywhere; duel keeps twin sticks for two local players
    const sticks = mode === 'duel';
    const touchReady = touchActive || hasTouchScreen();
    const assisted = touchReady && !sticks && assistedControls(0);
    const wrap = $('touch'), sl = $('stickL'), sr = $('stickR'), hint = $('touchHint'), ff = $('forceFire');
    if (wrap) wrap.style.display = touchReady ? 'block' : 'none';
    if (sl) sl.style.display = (touchReady && sticks) ? '' : 'none';
    if (sr) sr.style.display = (touchReady && sticks) ? '' : 'none';
    if (hint) hint.style.display = assisted ? 'block' : 'none';
    if (ff) ff.style.display = assisted ? 'block' : 'none';
  }
  function persist(k, v) { try { localStorage.setItem(k, v ? '1' : '0'); } catch (e) {} }
  function setMuted(m) {
    muted = !!m; if (SDAudio) SDAudio.setMuted(muted);
    const b = $('btnMute'); if (b) b.textContent = muted ? '🔇' : '🔊';
    const o = $('optSound'); if (o) o.textContent = muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
    persist('sd_muted', muted);
  }
  function setAutoFire(v) {
    autoFire = !!v;
    const o = $('optAutoFire'); if (o) o.textContent = autoFire ? '🎯 AUTO-FIRE: ON' : '🎯 AUTO-FIRE: OFF';
    persist('sd_autofire', autoFire); updateTouchLayout();
  }
  let musicPref = true, gfxQuality = 'auto', camPref = 'auto';
  const GFX = ['auto', 'high', 'medium', 'low'];
  function setMusicPref(v) {
    musicPref = !!v; if (SDAudio.setMusic) SDAudio.setMusic(musicPref);
    const o = $('optMusic'); if (o) o.textContent = musicPref ? '🎵 MUSIC: ON' : '🎵 MUSIC: OFF';
    persist('sd_music', musicPref);
  }
  function setGfx(q) {
    gfxQuality = GFX.includes(q) ? q : 'auto';
    if (gl3d) SD3D.setQuality(gfxQuality);
    const o = $('optGfx'); if (o) o.textContent = '✨ GRAPHICS: ' + gfxQuality.toUpperCase();
    try { localStorage.setItem('sd_gfx', gfxQuality); } catch (e) {}
  }
  function setCamPref(m) {
    camPref = CAM_MODES.includes(m) ? m : 'auto';
    if (gl3d) SD3D.setCamMode(camPref);
    const o = $('optCam'); if (o) o.textContent = '🎥 CAMERA: ' + CAM_LABEL[camPref];
    try { localStorage.setItem('sd_cam', camPref); } catch (e) {}
  }
  function loadSettings() {
    try {
      const m = localStorage.getItem('sd_muted'); if (m != null) muted = m === '1';
      const a = localStorage.getItem('sd_autofire'); if (a != null) autoFire = a === '1';
      const mu = localStorage.getItem('sd_music'); if (mu != null) musicPref = mu === '1';
      gfxQuality = localStorage.getItem('sd_gfx') || 'auto'; camPref = localStorage.getItem('sd_cam') || 'auto';
    } catch (e) {}
  }

  function screenPoint(clientX, clientY) {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) / Math.max(1, r.width) * viewW,
      y: (clientY - r.top) / Math.max(1, r.height) * viewH,
    };
  }
  function setupPointerControls() {
    if (!canvas) return;
    const uiTarget = e => e.target && e.target.closest && e.target.closest('button, input, select, .ov');
    const aimAt = e => { const p = screenToWorld(e.clientX, e.clientY); mouseX = p.x; mouseY = p.y; if (e.pointerType === 'mouse') mouseFresh = 120; };
    const stickMove = e => {
      const p = screenPoint(e.clientX, e.clientY);
      if (!p) return;
      let dx = p.x - stick.ox, dy = p.y - stick.oy;
      const len = Math.hypot(dx, dy), max = 58;
      if (len > max) {
        const ex = len - max;
        stick.ox += dx / len * ex; stick.oy += dy / len * ex;
        dx = dx / len * max; dy = dy / len * max;
      }
      stick.dx = dx; stick.dy = dy;
    };
    const startStick = e => {
      if (uiTarget(e) || state !== 'playing' || !assistedControls(0)) return;
      aimAt(e);
      // a mouse click only force-fires; starting a drag stick here used to override WASD and stall the tank while firing
      if (e.pointerType === 'mouse') { mouseDown = true; controls[0].fire = true; e.preventDefault(); return; }
      const p = screenPoint(e.clientX, e.clientY); if (!p) return;
      stick.active = true; stick.id = e.pointerId; stick.ox = p.x; stick.oy = p.y; stick.dx = 0; stick.dy = 0;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    };
    const endStick = e => {
      if (e && e.pointerType === 'mouse') { mouseDown = false; controls[0].fire = false; }
      if (e && stick.active && e.pointerId !== stick.id) return;
      stick.active = false; stick.id = null; stick.dx = 0; stick.dy = 0;
    };
    window.addEventListener('pointermove', e => {
      aimAt(e);
      if (!stick.active || e.pointerId !== stick.id) return;
      stickMove(e); e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('pointerdown', startStick, { passive: false });
    window.addEventListener('pointerup', endStick);
    window.addEventListener('pointercancel', endStick);
    window.addEventListener('blur', () => { mouseDown = false; controls[0].fire = false; endStick(); });
  }

  function setupForceFireButton() {
    const b = $('forceFire'); if (!b) return;
    const down = e => {
      if (!assistedControls(0) || state !== 'playing') return;
      controls[0].fire = true;
      document.body.classList.add('force-fire-on');
      e.preventDefault();
    };
    const up = e => {
      controls[0].fire = false;
      document.body.classList.remove('force-fire-on');
      if (e) e.preventDefault();
    };
    b.addEventListener('pointerdown', down, { passive: false });
    window.addEventListener('pointerup', up, { passive: false });
    window.addEventListener('pointercancel', up, { passive: false });
    window.addEventListener('blur', up);
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
    // both layers fill the window: WebGL arena underneath, 2D HUD (or the whole 1974 mode) on top
    viewW = Math.max(1, window.innerWidth);
    viewH = Math.max(1, window.innerHeight);
    canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
    canvas.style.width = viewW + 'px'; canvas.style.height = viewH + 'px';
    if (glCanvas) { glCanvas.style.width = viewW + 'px'; glCanvas.style.height = viewH + 'px'; }
    if (gl3d) SD3D.resize(viewW, viewH, window.devicePixelRatio || 1);
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
    const shellRange = SHELL_SPD * (SHELL_LIFE / STEP);
    ok('T-shell range cap', Math.abs(shellRange - FIELD_W * 0.5) < 0.1, 'range=' + Math.round(shellRange));

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
    mode = 'cpu'; tankSkill = [0.0, 0.0]; resetMatch(55); state = 'playing'; bots = [false, true]; controls = fresh();
    tanks[1].x = tileCenter(25, 15).x; tanks[1].y = tileCenter(25, 15).y; // bot far corner
    tanks[0].x = tileCenter(2, 2).x; tanks[0].y = tileCenter(2, 2).y; tanks[0].alive = true; tanks[0].cd = 1e9; // passive dummy: no input, never auto-fires
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
    const enemySpawn = tileCenter(COOP_SPAWNS[3].c, COOP_SPAWNS[3].r);
    const coopSpawnOk = mode === 'coop' && tanks.length === 4 && tanks[0].team === 'ally' && tanks[1].team === 'ally' && tanks[2].team === 'enemy' && tanks[3].team === 'enemy' && Math.hypot(tanks[3].x - enemySpawn.x, tanks[3].y - enemySpawn.y) < 2 && !bots[0] && !bots[1] && bots[2] && bots[3];
    killTank(2); const coopTeamPoint = score.p1 === 1 && score.p2 === 0;
    killTank(0); const coopEnemyPoint = score.p1 === 1 && score.p2 === 1;
    ok('T-coop mode', coopSpawnOk && coopTeamPoint && coopEnemyPoint, 'spawn=' + coopSpawnOk + ' score=' + score.p1 + '-' + score.p2);

    startGame('coop'); headless = true; controls = fresh(); shells = [];
    const coopStartX = tanks[0].x, coopStartY = tanks[0].y;
    controls[0].driveVec = { active: true, angle: 0, mag: 1 };
    for (let i = 0; i < 45; i++) update();
    const coopAssistedMove = Math.hypot(tanks[0].x - coopStartX, tanks[0].y - coopStartY) > 25;
    ok('T-coop assisted controls', coopAssistedMove, 'move=' + Math.round(Math.hypot(tanks[0].x - coopStartX, tanks[0].y - coopStartY)));

    startGame('coop'); headless = true; controls = fresh(); shells = [];
    tanks[0].cd = 0; controls[0].fire = true; update();
    const coopForceFire = shells.some(s => s.owner === 0);
    ok('T-coop assisted force fire', coopForceFire, 'shells=' + shells.length);

    startGame('coop'); headless = true; controls = fresh(); shells = [];
    const a0 = tanks[0], a1 = tanks[1], en = tanks[2];
    a0.x = tileCenter(3, 2).x; a0.y = tileCenter(3, 2).y; a0.turret = 0; a0.heading = 0;
    a1.x = tileCenter(6, 2).x; a1.y = a0.y; a1.hp = TANK_MAX_HP; a1.alive = true;
    en.x = tileCenter(9, 2).x; en.y = a0.y; en.hp = TANK_MAX_HP; en.alive = true;
    const friendlyBlocksShot = !clearShot(a0, 0);
    a1.y += TILE * 2;
    const enemyClearShot = clearShot(a0, 0);
    a1.x = a0.x + 80; a1.y = a0.y; a1.hp = TANK_MAX_HP; a0.cd = 0; shells = []; fire(a0);
    for (let i = 0; i < 24 && shells.length; i++) update();
    const friendlyUnhurt = a1.alive && a1.hp === TANK_MAX_HP;
    ok('T-coop friendly fire blocked', friendlyBlocksShot && enemyClearShot && friendlyUnhurt, 'blocked=' + friendlyBlocksShot + ' clear=' + enemyClearShot + ' hp=' + a1.hp);

    mode = 'duel'; winner = 'p2'; score = { p1: 2, p2: 5 };
    const duelScoreOk = scoreSubject().points === 5 && scoreValue() === 540;
    mode = 'coop'; score = { p1: 3, p2: 5 };
    const coopScoreOk = scoreSubject().points === 3 && scoreValue() === 375;
    ok('T-multiplayer scores', duelScoreOk && coopScoreOk, 'duel=' + duelScoreOk + ' coop=' + coopScoreOk);

    online.names = { p1: 'JEZ', p2: 'CLAW' };
    startGame('coop', 1234); headless = true; tanks[0].x += 5; damageWall(tileCenter(9, 9).x, tileCenter(9, 9).y);
    const snap = makeSnapshot();
    startGame('duel', 9); applySnapshot(snap);
    ok('T-online snapshot', mode === 'coop' && tanks.length === 4 && tanks[0].team === 'ally' && online.names.p1 === 'JEZ' && wallHP[9][9] === snap.wallHP[9][9], 'mode=' + mode + ' tanks=' + tanks.length);

    // ---- Campaign tests ----
    const pcamp = campaign;

    // T-C6 determinism: same seed + scripted bot run → identical campaign outcome hash
    const campHash = () => { startCampaign(0, 1, 45, 4242); headless = true; bots[0] = true; tankSkill[0] = 0.7; for (let i = 0; i < 400; i++) { update(); if (state !== 'playing') break; } return snapHash() + '|' + campaign.score + '|' + campaign.levelIdx + '|' + campaign.waveIdx; };
    const cA = campHash(), cB = campHash();
    ok('T-C6 campaign determinism', cA === cB, cA === cB ? '' : 'mismatch');

    // T-C1 progression: clearing enemies advances wave/level; losing all lives → game over
    startCampaign(0, 1, 45, 7); headless = true;
    const startLv = campaign.levelIdx, startWave = campaign.waveIdx, e0 = aliveCount('enemy');
    for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; }
    let advanced = false; for (let i = 0; i < 200; i++) { update(); if (campaign.levelIdx > startLv || campaign.waveIdx > startWave) { advanced = true; break; } }
    startCampaign(2, 1, 45, 7); headless = true; const reachedL3 = campaign.levelIdx === 2 && campaign.name !== undefined;
    startCampaign(0, 1, 45, 7); headless = true; campaign.lives = 1;
    let gameOver = false; for (let g = 0; g < 5 && !gameOver; g++) { const a = tanks.find(t => t.team === 'ally' && t.alive); if (a) killTank(tanks.indexOf(a)); for (let i = 0; i < 200; i++) { update(); if (state === 'over') { gameOver = true; break; } } }
    ok('T-C1 progression', e0 > 0 && advanced && gameOver, 'e0=' + e0 + ' adv=' + advanced + ' over=' + gameOver);

    // T-C2 enemy types: distinct stats (scout fast/fragile, brute tanky/slow, sniper long-range)
    const scoutE = enemyTank(99, 'scout', { c: 14, r: 8, a: Math.PI }), bruteE = enemyTank(98, 'brute', { c: 14, r: 8, a: Math.PI });
    ok('T-C2 enemy types', scoutE.spdMul > bruteE.spdMul && bruteE.hp > scoutE.hp && ENEMY_TYPES.sniper.range[0] > ENEMY_TYPES.grunt.range[0] + 100, 'scoutSpd=' + scoutE.spdMul + ' bruteHp=' + bruteE.hp + ' sniperMin=' + ENEMY_TYPES.sniper.range[0]);

    // T-C2 layer: drops mines over time
    startCampaign(0, 1, 45, 21); headless = true;
    for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; }
    const lidx = tanks.length, layerE = enemyTank(lidx, 'layer', { c: 14, r: 8, a: 0 }); layerE.mineCd = 0.05; tanks.push(layerE); bots[lidx] = true; controls[lidx] = ctrl();
    const lm0 = mines.length;
    for (let i = 0; i < 50; i++) update();
    ok('T-C2 layer drops mines', mines.length > lm0, 'm0=' + lm0 + ' now=' + mines.length);

    // T-C2 warden: front plate deflects shells, flank shots damage
    startCampaign(0, 1, 45, 22); headless = true;
    for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; }
    const widx = tanks.length, wardenE = enemyTank(widx, 'warden', { c: 14, r: 8, a: 0 }); wardenE.heading = 0; wardenE.turret = 0; tanks.push(wardenE); bots[widx] = false; controls[widx] = ctrl();
    const whp0 = wardenE.hp;
    shells.push({ x: wardenE.x + TANK_R + 3, y: wardenE.y, vx: -SHELL_SPD, vy: 0, life: SHELL_LIFE, owner: 0, dmg: 1 });
    for (let i = 0; i < 8 && shells.length; i++) update();
    const frontSafe = wardenE.alive && wardenE.hp === whp0;
    shells.push({ x: wardenE.x - TANK_R - 3, y: wardenE.y, vx: SHELL_SPD, vy: 0, life: SHELL_LIFE, owner: 0, dmg: 1 });
    for (let i = 0; i < 8 && shells.length; i++) update();
    ok('T-C2 warden front armor', frontSafe && wardenE.hp < whp0, 'front=' + frontSafe + ' flankHp=' + wardenE.hp + '/' + whp0);

    // T-C4 campaign-arena walls solid: drive a tank into the walls of every arena, never breach the border
    let clipFree = true;
    for (const akey of Object.keys(ARENAS)) {
      mode = 'campaign'; campaign = null; buildMazeFrom(ARENAS[akey]); shells = []; mines = []; state = 'playing';
      for (let dir = 0; dir < 4; dir++) {
        tanks = [playerTank(0, { c: 2, r: 8, a: dir * Math.PI / 2 })]; bots = [false]; controls = fresh(); controls[0].fwd = true;
        for (let i = 0; i < 70; i++) { update(); const t = tanks[0]; if (t.x < 3 || t.x > FIELD_W - 3 || t.y < HUD_H + 3 || t.y > HUD_H + FIELD_H - 3) clipFree = false; }
      }
    }
    ok('T-C4 campaign walls solid', clipFree);

    // T-C3 boss: spawns big, survives hits, transitions phases, defeat advances/wins
    const bossLevelIdx = LEVELS.findIndex(l => l.boss);
    startCampaign(bossLevelIdx, 1, 45, 33); headless = true;
    let bss = tanks.find(t => t.boss);
    const bossSpawned = !!bss && bss.maxHp >= 12 && aliveCount('enemy') === 1;
    bss.hp -= 2; const bossSurvived = bss.alive && bss.hp > 0;
    bss.hp = Math.max(1, Math.floor(bss.maxHp * 0.2)); for (let i = 0; i < 20; i++) update();
    bss = tanks.find(t => t.boss); const bossPhased = !!bss && bss.phase >= 3;
    const lvl0 = campaign.levelIdx;
    for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; }   // defeat boss (+ any adds)
    let bossCleared = false; for (let j = 0; j < 240; j++) { update(); if (campaign.levelIdx > lvl0 || (state === 'over' && campaign.phase === 'won')) { bossCleared = true; break; } }
    ok('T-C3 boss', bossSpawned && bossSurvived && bossPhased && bossCleared, 'spawn=' + bossSpawned + ' surv=' + bossSurvived + ' phase=' + (bss ? bss.phase : '?') + ' cleared=' + bossCleared);

    startCampaign(bossLevelIdx, 1, 45, 34); headless = true;
    bss = tanks.find(t => t.boss && t.bossType === 'bastion');
    shells = []; bss.hp = bss.maxHp; bss.phase = 1; bss.turret = 0.42; bss.atkCd = 0;
    bossAttack(bss);
    const bastionFirst = shells.slice();
    const firstAligned = bastionFirst.length === 1 && Math.abs(wrapAngle(Math.atan2(bastionFirst[0].vy, bastionFirst[0].vx) - bss.turret)) < 0.001;
    shells = []; bss.hp = 1; bss.phase = 3; bss.turret = -0.75; bss.atkCd = 0;
    bossAttack(bss);
    const bastionSpreadAligned = shells.length === 5 && shells.every(s => Math.abs(wrapAngle(Math.atan2(s.vy, s.vx) - bss.turret)) <= 0.27);
    ok('T-C3 bastion cannon alignment', firstAligned && bastionSpreadAligned, 'first=' + bastionFirst.length + ' spread=' + shells.length);

    // T-C5 co-op scaling: more players → more enemies + larger shared life pool; one death ≠ game over; shared score
    startCampaign(0, 1, 45, 5); headless = true; const soloEnemies = aliveCount('enemy');
    startCampaign(0, 3, 45, 5); headless = true; const trioEnemies = aliveCount('enemy'), trioAllies = aliveCount('ally'), trioLives = campaign.lives;
    startCampaign(1, 2, 45, 5); headless = true;
    killTank(0);                                                  // one ally down
    let coopOver = false; for (let i = 0; i < 60; i++) { update(); if (state === 'over') { coopOver = true; break; } }
    const survivesOneDown = !coopOver && aliveCount('ally') >= 1;
    const sc0 = campaign.score, foe = tanks.find(t => t.team === 'enemy' && t.alive); if (foe) killTank(tanks.indexOf(foe));
    const sharedScore = campaign.score > sc0;
    ok('T-C5 co-op scaling', trioEnemies > soloEnemies && trioAllies === 3 && trioLives >= 4 && survivesOneDown && sharedScore,
      'solo=' + soloEnemies + ' trio=' + trioEnemies + ' allies=' + trioAllies + ' lives=' + trioLives + ' survive=' + survivesOneDown + ' shared=' + sharedScore);

    // T-perf+ campaign: heaviest frame (4-player boss level + extra adds, all AI-driven) under sim budget
    startCampaign(LEVELS.findIndex(l => l.boss), 4, 80, 77); headless = true;
    for (let i = 0; i < 4; i++) bots[i] = true;                   // all players AI-driven → max pathfinding load
    spawnAdds('scout', 4); spawnAdds('brute', 2);
    let pnan = false; const tpc = perfNow(); for (let i = 0; i < 400; i++) { update(); for (const t of tanks) if (!isFinite(t.x)) pnan = true; }
    const perCamp = (perfNow() - tpc) / 400;
    ok('T-perf+ campaign sim<=8ms', perCamp <= 8 && !pnan, perCamp.toFixed(3) + 'ms, ' + tanks.length + ' tanks');

    // ---- v30: logic fixes + new features ----
    // T-revive momentum: a respawned vs-CPU tank used to keep sliding with its pre-death velocity
    mode = 'cpu'; resetMatch(8); state = 'playing'; bots = [false, false]; controls = fresh();
    tanks[0].vx = 2.4; tanks[0].vy = 1.1; killTank(0); for (let i = 0; i < 90; i++) update();
    const sp0 = tileCenter(SPAWNS[0].c, SPAWNS[0].r);
    ok('T-revive clears momentum', tanks[0].alive && tanks[0].vx === 0 && tanks[0].vy === 0 && Math.hypot(tanks[0].x - sp0.x, tanks[0].y - sp0.y) < 1, 'vx=' + tanks[0].vx + ' dx=' + Math.round(tanks[0].x - sp0.x));

    // T-boss hull vs walls: bosses collide with their whole body (they used to clip 14-21px into walls)
    startCampaign(LEVELS.findIndex(l => l.boss === 'mauler'), 1, 60, 41); headless = true; bots[0] = true; tankSkill[0] = 0.6;
    const mb = tanks.find(t => t.boss); let bossClip = false;
    for (let i = 0; i < 900 && state === 'playing'; i++) { update(); if (mb.alive && circleHitsWall(mb.x, mb.y, mb.hitR - 2)) bossClip = true; }
    ok('T-boss hull vs walls', !bossClip, 'clip=' + bossClip);

    // T-bastion immovable: tanks can no longer shove the stationary fortress around
    startCampaign(LEVELS.findIndex(l => l.boss === 'bastion'), 1, 45, 42); headless = true; controls = fresh();
    const bas = tanks.find(t => t.boss), bx0 = bas.x, by0 = bas.y;
    tanks[0].x = bas.x - bas.hitR - 4; tanks[0].y = bas.y; controls[0].right = true;
    for (let i = 0; i < 60; i++) update();
    const basGap = Math.hypot(tanks[0].x - bas.x, tanks[0].y - bas.y);
    ok('T-bastion immovable', Math.hypot(bas.x - bx0, bas.y - by0) < 0.01 && basGap >= bas.hitR + TANK_R - 0.5, 'moved=' + Math.hypot(bas.x - bx0, bas.y - by0).toFixed(2) + ' gap=' + basGap.toFixed(1));

    // T-campaign spawns: every ally spawn (and the boss spawn) is open floor in every arena — P4 used to start inside a wall
    let spawnsOk = true;
    for (const k of Object.keys(ARENAS)) {
      buildMazeFrom(ARENAS[k]);
      for (const s of CAMP_ALLY_SPAWNS) { const p = tileCenter(s.c, s.r); if (circleHitsWall(p.x, p.y, TANK_R)) spawnsOk = false; }
      const bp = tileCenter(BOSS_SPAWN.c, BOSS_SPAWN.r); if (k === 'arena' && circleHitsWall(bp.x, bp.y, 33)) spawnsOk = false;
    }
    ok('T-campaign spawns clear', spawnsOk);

    // T-campaign play again: PLAY AGAIN after a campaign used to start a broken 2-tank match that ended instantly
    startCampaign(3, 2, 45, 45); headless = true; campaign.lives = 0; endCampaign(false);
    playAgain(); headless = true;
    ok('T-campaign play again', mode === 'campaign' && state === 'playing' && campaign.levelIdx === 0 && campaign.players === 2 && aliveCount('ally') === 2 && aliveCount('enemy') > 0, 'lv=' + (campaign && campaign.levelIdx) + ' state=' + state);

    // T-co-op revive: a teammate down with no lives left rejoins at the next wave (designed, never implemented)
    startCampaign(1, 2, 45, 46); headless = true; campaign.lives = 1;
    killTank(1); const downOk = !tanks[1].alive && tanks[1].respawnT == null;
    for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; }
    let rejoined = false; for (let i = 0; i < 200; i++) { update(); if (tanks[1].alive) { rejoined = true; break; } }
    ok('T-co-op revive next wave', downOk && rejoined && state === 'playing', 'down=' + downOk + ' rejoined=' + rejoined);

    // T-supply crates: crates apply on contact, enemies drop them, a shield soaks one mine
    startCampaign(0, 1, 45, 43); headless = true; controls = fresh();
    const pl = tanks[0]; pl.hp = 1;
    pickups.push({ id: 91, kind: 'repair', x: pl.x + 6, y: pl.y, t: 5 }, { id: 92, kind: 'shield', x: pl.x, y: pl.y + 6, t: 5 }, { id: 93, kind: 'rapid', x: pl.x, y: pl.y, t: 5 });
    update();
    const gotAll = pl.hp === 3 && pl.shieldT > 5 && pl.rapidT > 7 && pickups.length === 0;
    let dropped = false;
    for (let k = 0; k < 40 && !dropped; k++) { const en = enemyTank(tanks.length, 'grunt', { c: 14, r: 8, a: 0 }); tanks.push(en); bots[en.id] = false; killTank(en.id, 0); dropped = pickups.length > 0; }
    mines.push({ x: pl.x, y: pl.y, ph: 0 }); update();
    const shieldSaved = pl.alive && pl.shieldT === 0;
    ok('T-supply crates', gotAll && dropped && shieldSaved, 'got=' + gotAll + ' drop=' + dropped + ' shield=' + shieldSaved);

    // T-flak: opposing shells that meet mid-air cancel (campaign)
    startCampaign(0, 1, 45, 44); headless = true; events.length = 0;
    const eIdx = tanks.findIndex(t => t.team === 'enemy'); for (const t of tanks) if (t.team === 'enemy') t.alive = false;
    shells = [{ x: 300, y: 300, vx: SHELL_SPD, vy: 0, life: 1, owner: 0, dmg: 1 }, { x: 330, y: 300, vx: -SHELL_SPD, vy: 0, life: 1, owner: eIdx, dmg: 1 }];
    for (let i = 0; i < 3; i++) update();
    ok('T-flak shells collide', shells.length === 0 && events.some(e => e.k === 'flak'), 'shells=' + shells.length);

    // T-events: the sim reports fire/kill events (drives 3D effects, audio and online clients)
    events.length = 0; mode = 'duel'; resetMatch(7); state = 'playing'; controls = fresh(); tanks[0].cd = 0; fire(tanks[0]); killTank(1, 0);
    ok('T-events', events.some(e => e.k === 'fire' && e.id === 0) && events.some(e => e.k === 'kill' && e.id === 1 && e.by === 0) && shells[0].sid > 0);
    events.length = 0; netEvents.length = 0;

    campaign = pcamp;
    online = ponline;
    headless = ph; mode = pmode; state = ps;
    const pass = out.filter(o => o.pass).length;
    const res = { pass, fail: out.length - pass, total: out.length, details: out }; window.__testResults = res; return res;
  }

  /* ===================== shot scenes ===================== */
  function setupShot(scene) {
    headless = true; if (SDArt) PARTS.clear(); if (use3d()) SD3D.snapCamera();
    hideAllOverlays(); if (scene === 'title') { const e = $('ovTitle'); if (e) e.classList.remove('hidden'); }
    if (scene === 'campaign' || scene === 'coop' || scene === 'boss') {
      visualMode = 'hd';
      if (scene === 'boss') { const bi = LEVELS.findIndex(l => l.boss); startCampaign(bi, 1, 60, 5); const b = tanks.find(t => t.boss); if (b) b.hp = Math.round(b.maxHp * 0.55); }
      else startCampaign(scene === 'coop' ? 4 : 2, scene === 'coop' ? 2 : 1, 60, scene === 'coop' ? 8 : 4);
      headless = true;
      for (let i = 0; i < 80; i++) update();
      if (tanks[0] && tanks[0].alive) { tanks[0].turret = scene === 'boss' ? -1.2 : -0.35; tanks[0].cd = 0; fire(tanks[0]); }
      let fired = 0; for (const t of tanks) if (t.team === 'enemy' && t.alive && (t.boss || fired++ < 2)) { if (t.boss) { t.atkCd = 0; bossAttack(t); } else { t.cd = 0; fire(t); } }
      for (let i = 0; i < 5; i++) update();
      consumeEvents(); if (SDArt) for (let i = 0; i < 6; i++) { PARTS.update(STEP); TRACKS.update(STEP); if (use3d()) SD3D.advance(STEP); }
      render(STEP); return;
    }
    mode = scene === 'classic' ? 'duel' : 'cpu'; visualMode = scene === 'classic' ? 'classic' : 'hd';
    tankSkill = [0.75, 0.7];
    resetMatch(scene === 'duel' ? 5 : scene === 'explosion' ? 11 : scene === 'minefield' ? 3 : 7);
    state = scene === 'title' ? 'attract' : 'playing';
    if (scene === 'title') { bots = [true, true]; for (let i = 0; i < 140; i++) update(); }
    else if (scene === 'duel' || scene === 'classic') { bots = [true, true]; for (let i = 0; i < 120; i++) update(); tanks[0].turret = 0.2; tanks[1].turret = Math.PI + 0.2; tanks[0].cd = 0; tanks[1].cd = 0; fire(tanks[0]); fire(tanks[1]); for (let i = 0; i < 6; i++) update(); }
    else if (scene === 'explosion') { bots = [true, true]; for (let i = 0; i < 60; i++) update(); tanks[1].x = tileCenter(8, 4).x; tanks[1].y = tileCenter(8, 4).y; tanks[1].alive = true; tanks[0].x = tileCenter(5, 4).x; tanks[0].y = tileCenter(5, 4).y; killTank(1); }
    else if (scene === 'minefield') { tanks[0].x = tileCenter(11, 8).x; tanks[0].y = tileCenter(11, 8).y; tanks[0].turret = 0.6; tanks[1].x = tileCenter(16, 9).x; tanks[1].y = tileCenter(16, 9).y; tanks[1].turret = Math.PI; for (let i = 0; i < 4; i++) update(); }
    consumeEvents();
    const vf = scene === 'explosion' ? 9 : 2; if (SDArt) for (let i = 0; i < vf; i++) { PARTS.update(STEP); TRACKS.update(STEP); if (use3d()) SD3D.advance(STEP); }
    render(STEP);
  }

  /* ===================== boot ===================== */
  let TRACKS, PARTS, DECALS;
  function boot() {
    canvas = $('game'); if (!canvas) return; ctx = canvas.getContext('2d');
    glCanvas = $('gl');
    TRACKS = new SDArt.Tracks(); PARTS = new SDArt.Particles(); DECALS = new SDArt.Decals();
    window.addEventListener('keydown', e => onKey(e, true)); window.addEventListener('keyup', e => onKey(e, false));
    setupPointerControls(); setupTouch(); setupForceFireButton();
    loadSettings();
    resize(); window.addEventListener('resize', resize);
    init3d(); if (!gl3d) window.addEventListener('sd3d-ready', () => { init3d(); syncVisualButton(); }, { once: true });

    const click = (id, fn) => { const e = $(id); if (e) e.addEventListener('click', () => { SDAudio.ui(); fn(); }); };
    click('btnDuel', () => { disconnectOnline(); startGame('duel'); }); click('btnCoop', () => { disconnectOnline(); startGame('coop'); }); click('btnCpu', () => { disconnectOnline(); startGame('cpu'); }); click('btnWatch', () => { disconnectOnline(); startGame('watch'); });
    click('btnCampaign', () => { disconnectOnline(); startCampaign(campaignStartLevel(), 1, aiLevel, (Math.random() * 1e9) | 0); });
    click('btnCampaign2', () => { disconnectOnline(); startCampaign(campaignStartLevel(), 2, aiLevel, (Math.random() * 1e9) | 0); });
    click('btnRetry', () => { if (campaign) startCampaign(campaign.levelIdx, campaign.players, aiLevel, (Math.random() * 1e9) | 0); });
    click('optMusic', () => setMusicPref(!musicPref));
    click('optGfx', () => setGfx(GFX[(GFX.indexOf(gfxQuality) + 1) % GFX.length]));
    click('optCam', () => setCamPref(CAM_MODES[(CAM_MODES.indexOf(camPref) + 1) % CAM_MODES.length]));
    document.querySelectorAll('.sb-tab').forEach(b => b.addEventListener('click', () => { SDAudio.ui(); refreshBoard(b.dataset.tab); }));
    click('btnOnline', () => { showOverlay('online'); refreshOpenRooms(); const r = $('onlineRoom'); if (r) r.focus(); });
    click('btnOnlineConnect', connectOnline);
    click('btnRoomsRefresh', refreshOpenRooms);
    click('btnCopyInvite', copyInvite);
    click('btnOnlineReady', toggleOnlineReady);
    click('btnOnlineStart', () => startOnlineHost(online.mode));
    click('btnOnlineBack', () => { disconnectOnline(); startAttract(); showOverlay('title'); });
    click('btnHow', () => { state = 'how'; showOverlay('how'); }); click('btnHowBack', () => { startAttract(); showOverlay('title'); });
    click('btnScores', () => { state = 'scores'; showOverlay('scores'); refreshBoard(); }); click('btnScoresBack', () => { startAttract(); showOverlay('title'); });
    click('btnOptions', () => { state = 'options'; showOverlay('options'); }); click('btnOptionsBack', () => { startAttract(); showOverlay('title'); });
    click('optSound', () => setMuted(!muted)); click('optAutoFire', () => setAutoFire(!autoFire));
    click('btnResume', () => { state = 'playing'; hideAllOverlays(); }); click('btnQuit', () => { disconnectOnline(); startAttract(); showOverlay('title'); });
    click('btnAgain', playAgain); click('btnMenu', () => { disconnectOnline(); startAttract(); showOverlay('title'); });
    const room = $('onlineRoom'); if (room && !room.value) room.value = randomRoom();
    const name = $('onlineName'); if (name && !name.value) name.value = online.name;
    const sl = $('diffSlider'), lab = $('diffLabel');
    if (sl) { sl.value = aiLevel; const upd = () => { aiLevel = +sl.value; if (lab) lab.textContent = diffName(aiLevel) + ' (' + aiLevel + ')'; }; upd(); sl.addEventListener('input', upd); }
    const bindWatch = (idx, sid, lid) => {
      const sl = $(sid), lab = $(lid); if (!sl) return;
      sl.value = watchLevel[idx];
      const upd = () => { watchLevel[idx] = +sl.value; if (lab) lab.textContent = diffName(watchLevel[idx]) + ' (' + watchLevel[idx] + ')'; };
      upd(); sl.addEventListener('input', upd);
    };
    bindWatch(0, 'watchSliderA', 'watchLabelA'); bindWatch(1, 'watchSliderB', 'watchLabelB');
    const mb = $('btnMute'); if (mb) mb.addEventListener('click', () => { SDAudio.ui(); setMuted(!muted); });
    const cb = $('btnClassic'); if (cb) cb.addEventListener('click', toggleVisual);
    const camB = $('btnCam'); if (camB) camB.addEventListener('click', () => { SDAudio.ui(); cycleCamera(); });
    const sub = $('btnSubmit'); if (sub) sub.addEventListener('click', async () => { const inp = $('initials'); const nm = (inp && inp.value || 'YOU').toUpperCase().slice(0, 3) || 'YOU'; await Scores.submit(nm, scoreValue()); const f = $('overScoreForm'); if (f) f.classList.add('hidden'); state = 'scores'; showOverlay('scores'); refreshBoard(mode === 'campaign' ? 'campaign' : 'versus'); });
    setMuted(muted); setAutoFire(autoFire); setMusicPref(musicPref); setGfx(gfxQuality); setCamPref(camPref);   // restore + sync persisted options
    refreshCampStart(); syncVisualButton();

    const q = new URLSearchParams(location.search);
    const invitedRoom = q.get('online') || q.get('room');
    if (invitedRoom || location.hash === '#online') {
      const roomInput = $('onlineRoom'), modeInput = $('onlineMode');
      if (roomInput && invitedRoom) roomInput.value = cleanRoom(invitedRoom);
      if (modeInput && q.get('mode')) modeInput.value = q.get('mode') === 'coop' ? 'coop' : 'duel';
      showOverlay('online');
      refreshOpenRooms();
    }
    headless = q.has('headless');
    if (q.has('test')) { const r = runTests(); console.log('[Steel Duel] tests ' + r.pass + '/' + r.total, r.details.filter(d => !d.pass)); }
    if (q.has('shot')) { setupShot(q.get('shot')); window.__shotReady = true; }
    else if (q.has('campaign')) { startCampaign((parseInt(q.get('campaign'), 10) || 1) - 1, parseInt(q.get('players'), 10) || 1, aiLevel, 1); }
    else { startAttract(); if (!(invitedRoom || location.hash === '#online')) showOverlay('title'); }
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
    touch(x, y, down) { stick.active = down !== false; if (stick.active) { stick.ox = x; stick.oy = y; stick.dx = 32; stick.dy = 0; } else { stick.dx = 0; stick.dy = 0; } return true; },
    start: startGame, attract: startAttract,
    step(n) { n = n || 1; for (let i = 0; i < n; i++) { update(); consumeEvents(); present(STEP); if (i < n - 1 && use3d()) SD3D.advance(STEP); } render(STEP); return true; },
    frames(n, dt) { for (let i = 0; i < (n || 1); i++) { consumeEvents(); present(dt || STEP); render(dt || STEP); } return true; },
    snapCam() { if (use3d()) SD3D.snapCamera(); }, get use3d() { return use3d(); }, get pickups() { return pickups; }, get events() { return events; },
    playAgain, setCam: setCamPref, setGfx, banner: showBanner,
    snap() { render(STEP); return true; }, fire(i) { fire(tanks[i || 0]); }, kill(i) { killTank(i || 0); },
    shot: setupShot, runTests, hash: snapHash, scores: () => Scores,
    // ---- campaign hooks ----
    startCampaign(level, players, difficulty, seed) { headless = headless || false; return startCampaign(level || 0, players || 1, difficulty == null ? 45 : difficulty, seed == null ? 1 : seed); },
    get campaign() { return campaign ? { levelIdx: campaign.levelIdx, level: campaign.levelIdx + 1, name: LEVELS[campaign.levelIdx].name, waveIdx: campaign.waveIdx, wave: campaign.waveIdx + 1, waves: LEVELS[campaign.levelIdx].waves.length, lives: campaign.lives, players: campaign.players, phase: campaign.phase, score: campaign.score, enemiesLeft: aliveCount('enemy'), alliesLeft: aliveCount('ally') } : null; },
    get enemies() { return tanks.filter(t => t.team === 'enemy'); },
    get allies() { return tanks.filter(t => t.team === 'ally'); },
    get boss() { return tanks.find(t => t.team === 'enemy' && t.boss) || null; },
    spawnEnemy(type, c, r) { if (!campaign) return null; const id = tanks.length; const t = enemyTank(id, type || 'grunt', { c: c == null ? 20 : c, r: r == null ? 8 : r, a: Math.PI }); tanks.push(t); bots[id] = true; return t; },
    clearEnemies() { for (const t of tanks) if (t.team === 'enemy') { t.alive = false; t.hp = 0; } },
    loseLife() { const a = tanks.find(t => t.team === 'ally' && t.alive); if (a) killTank(tanks.indexOf(a)); },
    levels: () => LEVELS,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* Shard Assault : data.js
 * Constants, palettes, weapon/enemy configs, and deterministic level builders.
 * All content is ORIGINAL homage art/data — no copyrighted ROM assets.
 * UMD: usable in Node (headless tests) and the browser.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---- core geometry / timing --------------------------------------------
  const TILE = 20;            // px per tile (internal buffer)
  const VIEW_W = 640;         // internal render width
  const VIEW_H = 360;         // internal render height
  const FPS = 60;
  const SPEED = 0.8;          // default game speed: each tick simulates 80% of a 60 Hz frame (the whole world runs 20% slower)
  const STEP = 1 / FPS;       // real seconds per simulation tick
  const DT = STEP * SPEED;    // simulated seconds per tick (api.setSpeed changes the live api.SPEED / api.DT)
  const SPEEDS = [0.7, 0.8, 0.9, 1];

  // ---- physics feel (px / s) ---------------------------------------------
  const PHYS = {
    gravity: 1750,
    jumpVel: 560,           // initial upward jump speed
    jumpCut: 0.42,          // velocity retained when jump released early
    maxFall: 760,
    runAccel: 2600,
    runSpeed: 205,
    airAccel: 1800,
    friction: 2400,
    morphSpeed: 300,        // rolling speed while morphed
    coyote: 0.09,           // grace time after leaving ground
    jumpBuffer: 0.10,       // press-early buffer
  };

  // ---- tile ids -----------------------------------------------------------
  const T = { EMPTY: 0, SOLID: 1, SPIKE: 2, PLATFORM: 3, DECO: 4, WATER: 5, CRATE: 6 };
  const SOLID_TILES = new Set([T.SOLID, T.CRATE]);

  // shmup tuning (World 3 — Corridor)
  const SHMUP = {
    accel: 1400, maxSpeed: 240, friction: 1100,
    wallDamage: 10, shipW: 26, shipH: 14,
  };

  // ---- weapons ------------------------------------------------------------
  // Three primary guns like the original: spread (multiple), beam (rotatable
  // lightning), and bounce. Each has upgrade levels collected via power-ups.
  const WEAPONS = {
    spread: {
      id: 'spread', name: 'SCATTER', color: '#ffd23f',
      maxLevel: 3, cooldown: 0.11, speed: 460, damage: 1,
      // fan of bullets per level
      fan: [[0], [-0.14, 0, 0.14], [-0.26, -0.1, 0, 0.1, 0.26]],
    },
    beam: {
      id: 'beam', name: 'ARC LANCE', color: '#6cf3ff',
      maxLevel: 3, cooldown: 0.02, damage: 0.6, length: 240,
      // beam sweeps within +/- range around facing; up/down rotate it
      sweepRange: 1.35,     // radians each way from horizontal
      rotateSpeed: 2.6,     // rad/s while adjusting
      widthByLevel: [6, 10, 15],
    },
    bounce: {
      id: 'bounce', name: 'RICOCHET', color: '#ff7ad9',
      maxLevel: 3, cooldown: 0.16, speed: 360, damage: 1,
      bouncesByLevel: [2, 4, 6],
      countByLevel: [1, 2, 3],
    },
    // homing micro-missiles: launch in a fan, lock on, burst with splash damage
    seeker: {
      id: 'seeker', name: 'SEEKER SWARM', color: '#ff9a3c',
      maxLevel: 3, cooldownByLevel: [0.5, 0.42, 0.36], countByLevel: [1, 2, 3],
      launch: 150, speed: 430, accel: 900, turn: 6.5, life: 2.2,
      damage: 2.2, splash: 1.6, radius: 30,
    },
    // plasma flamethrower: short piercing cone, sets targets alight
    flare: {
      id: 'flare', name: 'SOLAR FLARE', color: '#ff6a2a',
      maxLevel: 3, cooldown: 0.045, speed: 400,
      life: [0.3, 0.36, 0.42], dps: [9, 12, 15], burn: 1.6, burnDps: 1.4,
    },
    // hold to charge, release: a piercing crystal bolt that splits into shards
    prism: {
      id: 'prism', name: 'PRISM CANNON', color: '#d9a8ff',
      maxLevel: 3, cooldown: 0.22, chargeTime: [1.0, 0.8, 0.65],
      tapDamage: 1.3, tapSpeed: 520, speed: 560, damage: [5, 7, 9],
      shardsByLevel: [3, 5, 7], shardDamage: 1.2,
    },
  };
  const WEAPON_ORDER = ['spread', 'beam', 'bounce', 'seeker', 'flare', 'prism'];

  // ---- enemies ------------------------------------------------------------
  // Archetypes carry the behavior; the per-world `roster` maps them to themed
  // skins (SPEC §4) so each world's fauna looks and reads differently.
  const ENEMIES = {
    turret: { hp: 3, w: 20, h: 20, touch: 12, score: 150, fireEvery: 1.6, shotSpeed: 200 },
    walker: { hp: 2, w: 20, h: 22, touch: 14, score: 120, speed: 55 },
    flyer:  { hp: 2, w: 22, h: 16, touch: 12, score: 160, speed: 95, amp: 42, freq: 2.2 },
    hopper: { hp: 3, w: 22, h: 22, touch: 16, score: 200, jump: 430, speed: 70 },
    spawner:{ hp: 8, w: 28, h: 28, touch: 16, score: 400, spawnEvery: 2.4 },
    drifter:{ hp: 1, w: 16, h: 16, touch: 20, score: 180, speed: 42, boom: true },        // homing mine
    eel:    { hp: 2, w: 30, h: 12, touch: 14, score: 170, speed: 120, amp: 26, freq: 3 }, // sine swimmer
    spinner:{ hp: 6, w: 18, h: 18, touch: 18, score: 300, radius: 34, spin: 2.4 },        // orbiting crusher
    egg:    { hp: 2, w: 18, h: 22, touch: 8, score: 90, hatchDist: 90 },                  // hatches a hugger
    hugger: { hp: 1, w: 14, h: 12, touch: 14, score: 80, jump: 330, speed: 130 },         // fast crawler
  };

  // per-world themed rosters: [archetype, skin, weight]
  const ROSTERS = {
    1: [['walker', 'scarab', 3], ['hopper', 'rockmite', 2], ['turret', 'cliffpod', 2], ['flyer', 'wasp', 3], ['drifter', 'windmine', 2]],
    2: [['walker', 'crab', 2], ['eel', 'eel', 3], ['turret', 'polyp', 2], ['flyer', 'sentry', 2], ['drifter', 'bubblemine', 3]],
    3: [['turret', 'walltur', 3], ['flyer', 'interceptor', 4], ['drifter', 'seeker', 3]],
    4: [['turret', 'statue', 3], ['walker', 'beltdrone', 3], ['spinner', 'boltspin', 2], ['flyer', 'arcdrone', 2], ['spawner', 'armhub', 1]],
    5: [['hugger', 'hugger', 3], ['hopper', 'leaper', 2], ['egg', 'eggpod', 3], ['turret', 'acidmaw', 2], ['spawner', 'hivenode', 1]],
  };
  // skins that lob gravity arcs instead of aimed shots
  const LOB_SKINS = new Set(['polyp', 'acidmaw']);

  // ---- bosses (SPEC §4) ----------------------------------------------------
  // Boss template: telegraph -> attack cycle -> vulnerable open window.
  // Guarded body takes BOSS_GUARD weapon damage; open core takes full damage.
  // Phases at 66%/33% HP speed the cycle up (the Sovereign swaps attack sets).
  const BOSS_GUARD = 0.22;
  const BOSSES = {
    warden: { // W1 — rock-armored guardian mech
      name: 'DUNE WARDEN', hp: 240, w: 64, h: 74, touch: 24, score: 5000,
      attacks: [
        { kind: 'shockwave', count: 2, speed: 220 },
        { kind: 'lob', count: 4, speed: 260 },
        { kind: 'volley', count: 5, speed: 210, spread: 0.5 },
      ],
      openEvery: 2, openDur: 2.4, tele: 0.75, hover: 0,
    },
    maw: { // W2 — cavern leviathan
      name: 'ABYSS MAW', hp: 280, w: 72, h: 58, touch: 24, score: 6000,
      attacks: [
        { kind: 'dash', speed: 340 },
        { kind: 'volley', count: 6, speed: 150, spread: 1.1, rise: -140 }, // bubble burst
        { kind: 'lob', count: 3, speed: 240 },
      ],
      openEvery: 2, openDur: 2.2, tele: 0.7, hover: 26,
    },
    gunship: { // W3 — corridor blockade platform (shmup boss)
      name: 'BLOCKADE GUNSHIP', hp: 300, w: 84, h: 66, touch: 20, score: 7000,
      attacks: [
        { kind: 'volley', count: 7, speed: 240, spread: 0.9 },
        { kind: 'barrage', count: 10, speed: 200, dur: 1.4 },
        { kind: 'lob', count: 4, speed: 220 },
      ],
      openEvery: 2, openDur: 2.0, tele: 0.6, hover: 40,
    },
    colossus: { // W4 — assembled walker mecha
      name: 'FORGE COLOSSUS', hp: 290, w: 72, h: 84, touch: 26, score: 8000,
      attacks: [
        { kind: 'dash', speed: 260 },
        { kind: 'volley', count: 6, speed: 230, spread: 0.7 },
        { kind: 'shockwave', count: 3, speed: 260 },
      ],
      openEvery: 2, openDur: 2.2, tele: 0.7, hover: 0,
    },
    queen: { // W5-1 — alien hive area boss
      name: 'HIVE QUEEN', hp: 270, w: 70, h: 70, touch: 26, score: 8000,
      attacks: [
        { kind: 'spawn', minion: 'hugger', count: 2 },
        { kind: 'dash', speed: 380 },
        { kind: 'lob', count: 5, speed: 250 }, // acid arcs
      ],
      openEvery: 2, openDur: 2.4, tele: 0.8, hover: 30,
    },
    machine: { // W5-2 — FINAL BOSS
      name: 'THE SOVEREIGN', hp: 430, w: 86, h: 96, touch: 28, score: 20000,
      phases: [
        { attacks: [
          { kind: 'volley', count: 5, speed: 220, spread: 0.6 },
          { kind: 'shockwave', count: 2, speed: 240 },
        ] },
        { attacks: [
          { kind: 'beam', sweeps: 9, speed: 260 },
          { kind: 'spawn', minion: 'flyer', count: 2 },
          { kind: 'lob', count: 4, speed: 260 },
        ] },
        { attacks: [
          { kind: 'barrage', count: 14, speed: 230, dur: 1.6 },
          { kind: 'dash', speed: 300 },
          { kind: 'shockwave', count: 3, speed: 280 },
        ] },
      ],
      openEvery: 2, openDur: 2.0, tele: 0.65, hover: 12,
    },
  };

  // ---- worlds (theme + palette + generator params) ------------------------
  // Shard Assault: five worlds / 11 stages (2/2/3/2/2) on the crystal world Kethra.
  // World 3 (Rift Run) is an auto-scrolling fighter stage. The 3D renderer
  // (src3d/worlds.mjs) owns each world's look; palettes below feed the 2D fallback.
  const WORLDS = [
    {
      id: 1, name: 'SHATTERED MESA', subtitle: 'KETHRA HIGHLANDS', type: 'platform',
      theme: 'Windswept red-rock highlands studded with living crystal — gusts and waterfalls.',
      palette: {
        sky: ['#0d1a3a', '#2A4C8A', '#4f83bd', '#6FA8DC'],
        far: '#3a4d72', mid: '#5a6d8f', near: '#6b4a2a',
        block: '#8A5A2B', blockTop: '#D9A566', blockEdge: '#4A2F14',
        accent: '#3FAE5A', spike: '#C0C0C0', water: '#2a6f97',
        fog: 'rgba(217,165,102,0.10)',
      },
      gen: { seed: 20260706, cols: 240, floor: 15, roughness: 3, pits: 7, plats: 46 },
      bosses: { 1: 'warden' },
      windX: 170,             // open-sky gusts (SPEC §2.1 contextual modifiers)
    },
    {
      id: 2, name: 'DROWNED VAULTS', type: 'platform',
      theme: 'Flooded crystal vaults lit by bioluminescence; ends on an updraft climb.',
      palette: {
        sky: ['#04141c', '#0E2E3E', '#13455c', '#1B5E7A'],
        far: '#0d2833', mid: '#1a4150', near: '#2C3A45',
        block: '#455A64', blockTop: '#7CF9E6', blockEdge: '#1c2830',
        accent: '#39D0C8', spike: '#B23A48', water: '#1B5E7A',
        fog: 'rgba(57,208,200,0.10)',
      },
      gen: { seed: 22026, cols: 260, floor: 14, roughness: 4, pits: 9, plats: 52 },
      bosses: { 1: 'maw' },
      water: true,            // flooded lower caverns — all-directional swim
      updraftFinale: true,    // 2-2 ends on a vertical wind-climb
    },
    {
      id: 3, name: 'RIFT RUN', subtitle: 'FIGHTER ASSAULT', type: 'shmup',
      theme: 'A full-throttle fighter run through the shattered canyon rift.',
      palette: {
        sky: ['#05060F', '#0a0c1e', '#141838', '#241d4a'],
        far: '#12142a', mid: '#3A3F5C', near: '#5C6486',
        block: '#5C6486', blockTop: '#8892C4', blockEdge: '#20233a',
        accent: '#FFD23F', spike: '#E040FB', water: '#241d4a',
        fog: 'rgba(255,107,53,0.10)',
      },
      gen: { seed: 33033, cols: 300, floor: 17, roughness: 2, pits: 0, plats: 30 },
      bosses: { 2: 'gunship' },
      scrolls: [62, 85, 132],   // auto-scroll px/s per stage: 3-1, 3-2, 3-3 finale
    },
    {
      id: 4, name: 'CINDER FOUNDRY', type: 'platform',
      theme: 'The Sovereign\'s automated foundry — molten channels, sentinels, crushers.',
      palette: {
        sky: ['#0a0a0d', '#1A1A1D', '#252529', '#33333a'],
        far: '#1c1c22', mid: '#3E3E46', near: '#57575F',
        block: '#57575F', blockTop: '#F2C037', blockEdge: '#1a1a1d',
        accent: '#FF4D2E', spike: '#FFB347', water: '#2EC4E0',
        fog: 'rgba(255,77,46,0.10)',
      },
      gen: { seed: 44044, cols: 280, floor: 14, roughness: 5, pits: 10, plats: 58 },
      bosses: { 1: 'colossus' },
    },
    {
      id: 5, name: 'THE HOLLOW SPIRE', type: 'platform',
      theme: 'The Sovereign\'s living crystal citadel — pods, crawlers, the throne of shard.',
      palette: {
        sky: ['#0a0710', '#1B1420', '#2E2233', '#463349'],
        far: '#1b1420', mid: '#2e2233', near: '#463349',
        block: '#463349', blockTop: '#B23A5A', blockEdge: '#170f1a',
        accent: '#8FD14F', spike: '#D9C7B0', water: '#7A2E3B',
        fog: 'rgba(143,209,79,0.10)',
      },
      gen: { seed: 55055, cols: 300, floor: 13, roughness: 4, pits: 11, plats: 60 },
      bosses: { 0: 'queen', 1: 'machine' },
    },
  ];

  // weighted roster pick -> [archetype, skin]
  function pickRoster(rnd, worldId) {
    const list = ROSTERS[worldId] || ROSTERS[1];
    let tot = 0; for (const r of list) tot += r[2];
    let v = rnd() * tot;
    for (const r of list) { v -= r[2]; if (v <= 0) return r; }
    return list[0];
  }

  // ---- deterministic RNG (mulberry32) ------------------------------------
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- corridor builder (World 3 shmup) ------------------------------------
  // An undulating tunnel: solid ceiling + floor profiles, destructible crate
  // barriers, floor/ceiling turrets and interceptors in the flight gap.
  function buildCorridor(world, worldIndex, stageIndex) {
    const g = world.gen;
    const rnd = mulberry32((g.seed + stageIndex * 7919) >>> 0);
    const cols = g.cols, rows = 22;
    const tiles = new Uint8Array(cols * rows);
    const set = (x, y, v) => { if (x >= 0 && x < cols && y >= 0 && y < rows) tiles[y * cols + x] = v; };
    const bossKey = (world.bosses && world.bosses[stageIndex]) || null;
    const ARENA_W = 30;
    const arenaStart = bossKey ? cols - ARENA_W : cols + 999;

    // tunnel profile: later stages weave harder and squeeze tighter
    const gapMin = 9 - stageIndex;           // 9 / 8 / 7 rows of open air
    const gapMax = 12 - stageIndex;
    const top = new Array(cols), bot = new Array(cols);
    let t = 4, gap = gapMax;
    let run = 0;
    for (let x = 0; x < cols; x++) {
      if (run <= 0) {
        run = 5 + Math.floor(rnd() * 7);
        const r = rnd();
        t += (r < 0.38 ? -1 : r < 0.76 ? 1 : 0);
        const r2 = rnd();
        gap += (r2 < 0.33 ? -1 : r2 < 0.66 ? 1 : 0);
        gap = Math.max(gapMin, Math.min(gapMax, gap));
        t = Math.max(2, Math.min(rows - gap - 3, t));
      }
      top[x] = t; bot[x] = t + gap; run--;
    }
    // flat entry + arena
    for (let x = 0; x <= 8; x++) { top[x] = top[8]; bot[x] = bot[8]; }
    if (bossKey) for (let x = arenaStart - 2; x < cols; x++) { top[x] = 3; bot[x] = rows - 3; }

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y <= top[x]; y++) set(x, y, T.SOLID);
      for (let y = bot[x]; y < rows; y++) set(x, y, T.SOLID);
    }

    // destructible crate barriers across the gap (shoot through them)
    const entities = [];
    const nBarriers = 4 + stageIndex * 2;
    for (let b = 0; b < nBarriers; b++) {
      const x = 30 + Math.floor(((b + 0.3 + rnd() * 0.4) / nBarriers) * (Math.min(cols, arenaStart) - 60));
      for (let y = top[x] + 1; y < bot[x]; y++) set(x, y, T.CRATE);
    }

    // enemies: floor + ceiling turrets, interceptors and seeker mines mid-gap
    const enemyCount = 16 + stageIndex * 5;
    for (let e = 0; e < enemyCount; e++) {
      const x = 16 + Math.floor(rnd() * (Math.min(cols, arenaStart - 4) - 26));
      const [type, skin] = pickRoster(rnd, world.id);
      if (type === 'turret') {
        const onFloor = rnd() < 0.6;
        entities.push({ type, skin, tx: x, ty: onFloor ? bot[x] - 1 : top[x] + 1 });
      } else {
        entities.push({ type, skin, tx: x, ty: top[x] + 2 + Math.floor(rnd() * (bot[x] - top[x] - 3)) });
      }
    }
    // gem trails along the flight path + a few floating power-ups
    for (let a = 0; a < 12; a++) {
      const bx2 = 14 + Math.floor(rnd() * (cols - 30));
      const n = 4 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const gx = bx2 + i;
        if (gx >= cols) break;
        const gy = Math.round((top[gx] + bot[gx]) / 2 + Math.sin(i * 0.9) * 1.6);
        if (tiles[gy * cols + gx] === T.EMPTY) entities.push({ type: 'gem', tx: gx, ty: gy });
      }
    }
    const powers = ['pu_weapon', 'pu_energy', 'pu_bomb', 'pu_weapon', 'pu_life'];
    for (let p = 0; p < 5; p++) {
      const x = 30 + Math.floor(rnd() * (Math.min(cols, arenaStart - 6) - 40));
      const y = Math.floor((top[x] + bot[x]) / 2);
      entities.push({ type: powers[p % powers.length], tx: x, ty: y });
    }

    const midY = (x) => Math.floor((top[x] + bot[x]) / 2) * TILE;
    const playerStart = { x: 3 * TILE, y: midY(3) };
    const exitX = cols - 3;
    const exit = { x: exitX * TILE, y: (top[exitX] + 1) * TILE, w: TILE * 2, h: (bot[exitX] - top[exitX] - 1) * TILE };

    let bossSpawn = null;
    if (bossKey) {
      const bCfg = BOSSES[bossKey];
      const bCol = cols - 12;
      bossSpawn = {
        key: bossKey,
        x: bCol * TILE - bCfg.w / 2,
        y: midY(bCol) - bCfg.h / 2,
        wakeX: (arenaStart + 2) * TILE,
        wallCol: arenaStart,
        groundY: (rows - 3) * TILE,
      };
    }

    return {
      world: world.id, worldIndex, stageIndex, name: world.name, type: 'shmup',
      theme: world.theme, palette: world.palette,
      cols, rows, tile: TILE, tiles, platforms: [], entities, playerStart, exit,
      bossSpawn, scroll: (world.scrolls && world.scrolls[stageIndex]) || 70,
      timeLimit: bossKey ? 300 : 200,
    };
  }

  // ---- level builder ------------------------------------------------------
  // Builds a scrolling maze-ish level from generator params. Deterministic.
  function buildLevel(worldIndex, stageIndex) {
    const world = WORLDS[worldIndex % WORLDS.length];
    if (world.type === 'shmup') return buildCorridor(world, worldIndex, stageIndex);
    const g = world.gen;
    const rnd = mulberry32((g.seed + stageIndex * 7919) >>> 0);
    const cols = g.cols;
    const bossKey = (world.bosses && world.bosses[stageIndex]) || null;
    const ARENA_W = 28;                    // boss arena width in tiles
    const arenaStart = bossKey ? cols - ARENA_W : cols + 999;
    const rows = 22;
    const tiles = new Uint8Array(cols * rows);
    const idx = (x, y) => y * cols + x;
    const set = (x, y, v) => { if (x >= 0 && x < cols && y >= 0 && y < rows) tiles[idx(x, y)] = v; };
    const get = (x, y) => (x < 0 || x >= cols || y < 0 || y >= rows) ? T.SOLID : tiles[idx(x, y)];

    // ---- GUARANTEED-TRAVERSABLE terrain --------------------------------
    // Interior platform worlds get a thin ceiling; we always keep >=6 tiles of
    // headroom above the ground so the critical path is walkable + jumpable
    // WITHOUT needing morph (morph is reserved for optional secret routes).
    const ceilH = (world.type === 'platform' && worldIndex >= 1) ? 1 : 0;
    for (let x = 0; x < cols; x++) for (let y = 0; y < ceilH; y++) set(x, y, T.SOLID);

    // Keep ground in the lower third so the upper zone is reserved for
    // floating platforms — they then never pinch the walkable ground path.
    const maxTop = rows - 2;           // lowest ground (always >=1 tile of floor)
    const minTop = Math.max(ceilH + 5, rows - 9); // highest the ground may rise
    const clampTop = (v) => Math.max(minTop, Math.min(maxTop, v));

    // pass 1: ground top as flat runs joined by SINGLE-tile steps only, so every
    // adjacent column differs by <=1 tile — always jumpable, never a cliff.
    const groundTop = new Array(cols);
    let top = clampTop(g.floor);
    let run = 0;
    for (let x = 0; x < cols; x++) {
      if (run <= 0) {
        run = 6 + Math.floor(rnd() * 8);                 // long flat run of 6-13 cols
        const r = rnd();
        top = clampTop(top + (r < 0.35 ? -1 : r < 0.7 ? 1 : 0)); // step at most +-1
      }
      groundTop[x] = top; run--;
    }
    // flat safe zones so spawn + exit are always clean, level ground
    for (let x = 0; x <= 6; x++) groundTop[x] = groundTop[6];
    for (let x = cols - 8; x < cols; x++) groundTop[x] = groundTop[cols - 9];
    // boss stages end in a wide, perfectly flat arena
    if (bossKey) for (let x = arenaStart; x < cols; x++) groundTop[x] = groundTop[arenaStart - 1];

    // pass 2: carve jumpable pits (width 2-3) ONLY where both lips are already
    // level (<=1 tile apart). No height edits -> no manufactured cliffs.
    // Carve pits ONLY inside genuinely flat stretches: require 3 equal-height
    // columns of clean approach + landing on each side, so there are never
    // adjacent tall walls or 1-wide ledges to fall into.
    const isPit = new Array(cols).fill(false);
    let placed = 0, guard = 0;
    while (placed < g.pits && guard++ < g.pits * 30) {
      const w = 2 + Math.floor(rnd() * 2);               // 2..3 tiles
      const sx = 16 + Math.floor(rnd() * (cols - 40));
      const h0 = groundTop[sx - 1];
      let ok = sx > 10 && sx + w < Math.min(cols - 10, arenaStart - 4);
      for (let k = -3; k < w + 3 && ok; k++) {
        const c = sx + k;
        if (c < 0 || c >= cols || isPit[c]) { ok = false; break; }
        if ((k < 0 || k >= w) && groundTop[c] !== h0) ok = false; // lips must be flat & equal
      }
      if (!ok) continue;
      for (let k = 0; k < w; k++) isPit[sx + k] = true;
      placed++;
    }

    // build ground tiles
    for (let x = 0; x < cols; x++) {
      if (isPit[x]) {
        if (world.water) {
          // flooded basin: solid floor, swim across (spikes make it spicy)
          set(x, rows - 1, T.SOLID);
          if (rnd() < 0.4) set(x, rows - 2, T.SPIKE);
        } else if (rnd() < 0.5) set(x, rows - 1, T.SPIKE);
        continue;
      }
      for (let y = groundTop[x]; y < rows; y++) set(x, y, T.SOLID);
    }

    // flooded caverns: open air below the waterline becomes swimmable water
    const waterY = world.water ? 15 : rows + 99;
    if (world.water) {
      for (let x = 0; x < cols; x++)
        for (let y = waterY; y < rows; y++)
          if (get(x, y) === T.EMPTY) set(x, y, T.WATER);
    }

    const surfaceTop = (x) => {
      x = Math.max(0, Math.min(cols - 1, x));
      return isPit[x] ? rows : groundTop[x];
    };

    // floating platforms: 1 tall, kept well above the ground path (never block
    // ground traversal) — they're optional upper routes / gem shelves
    // one-way floating platforms — stored SEPARATELY (not solid tiles). The
    // player lands on top but jumps/moves pass through, so they never bonk a
    // ground jump (which used to drop the player into pits).
    const platforms = [];
    for (let p = 0; p < g.plats; p++) {
      const px = 10 + Math.floor(rnd() * (cols - 20));
      const pw = 2 + Math.floor(rnd() * 4);
      if (px + pw >= arenaStart - 2) continue;           // keep the arena clean
      let gTop = rows;
      for (let w = 0; w < pw; w++) gTop = Math.min(gTop, groundTop[Math.min(cols - 1, px + w)]);
      const hiLimit = ceilH + 2;
      const loLimit = gTop - 3;                          // reachable, above the ground
      if (loLimit <= hiLimit) continue;
      const py = hiLimit + Math.floor(rnd() * (loLimit - hiLimit + 1));
      platforms.push({ x: px, y: py, w: pw });
    }

    // ---- entities ---------------------------------------------------------
    const entities = [];
    const surfaceY = (x) => {
      for (let y = ceilH; y < rows; y++) if (get(x, y) === T.SOLID) return y;
      return rows;
    };
    const addOnSurface = (x, type, skin, lift) => {
      let cx = Math.max(1, Math.min(cols - 2, x)), tries = 0;
      while (isPit[cx] && tries++ < 8) cx = (cx + 1) % cols;
      if (cx >= arenaStart - 2) return;                  // keep the arena clean
      const sy = surfaceY(cx);
      if (sy >= rows) return;
      entities.push({ type, skin, tx: cx, ty: sy - 1 - (lift || 0) });
    };

    // enemies from the world's themed roster (SPEC §4)
    const enemyCount = 14 + worldIndex * 3;
    for (let e = 0; e < enemyCount; e++) {
      const x = 14 + Math.floor(rnd() * (cols - 24));
      const [type, skin] = pickRoster(rnd, world.id);
      if (type === 'eel' && world.water) {
        // eels swim: drop them into the flooded depths, not the sky
        if (x < arenaStart - 2) {
          let ey = -1;
          for (let yy = waterY; yy < rows - 1; yy++)
            if (tiles[yy * cols + x] === T.WATER) { ey = yy; break; }
          if (ey > 0) entities.push({ type, skin, tx: x, ty: ey });
          else entities.push({ type, skin, tx: x, ty: 3 + Math.floor(rnd() * 8) });
        }
      } else if (type === 'flyer' || type === 'drifter' || type === 'eel') {
        if (x < arenaStart - 2) entities.push({ type, skin, tx: x, ty: 3 + Math.floor(rnd() * 8) });
      } else if (type === 'spinner') {
        addOnSurface(x, type, skin, 4);                  // orbits above the ground
      } else {
        addOnSurface(x, type, skin);
      }
    }

    // gems: arcs + clusters
    const gemArcs = 10 + worldIndex * 2;
    for (let a = 0; a < gemArcs; a++) {
      const bx = 8 + Math.floor(rnd() * (cols - 16));
      const by = 4 + Math.floor(rnd() * (rows - 8));
      const n = 3 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const gx = bx + i;
        const gy = by - Math.round(Math.sin((i / (n - 1)) * Math.PI) * 2);
        if (get(gx, gy) === T.EMPTY) entities.push({ type: 'gem', tx: gx, ty: gy });
      }
    }

    // power-ups (weapon / life / energy / bomb / line)
    const powers = ['pu_weapon', 'pu_weapon', 'pu_energy', 'pu_bomb', 'pu_line', 'pu_life'];
    const puCount = 5 + worldIndex;
    for (let p = 0; p < puCount; p++) {
      const x = 16 + Math.floor(rnd() * (cols - 30));
      const kind = powers[Math.floor(rnd() * powers.length)];
      addOnSurface(x, kind);
    }

    // reward reaching platforms with a gem or weapon orb on top
    for (const pl of platforms) {
      if (rnd() < 0.6) {
        const gx = pl.x + Math.floor(pl.w / 2);
        entities.push({ type: rnd() < 0.3 ? 'pu_weapon' : 'gem', tx: gx, ty: pl.y - 1 });
      }
    }
    // the highest platform always guards a 1UP (risk/reward summit)
    if (platforms.length) {
      let hi = platforms[0];
      for (const pl of platforms) if (pl.y < hi.y) hi = pl;
      entities.push({ type: 'pu_life', tx: hi.x + Math.floor(hi.w / 2), ty: hi.y - 1 });
    }

    // W4: some ledges are conveyor belts (industrial hazard flavor)
    if (world.id === 4) {
      for (const pl of platforms) if (rnd() < 0.45) pl.belt = rnd() < 0.5 ? 1 : -1;
    }

    // ---- SECRET VAULTS: crate-plugged shafts down to buried gem chambers ---
    // Shoot the plug open (down-aim works mid-air), drop in, grab the loot.
    // 4 tiles deep total so a standing jump (apex ~4.5 tiles) always escapes;
    // every chamber column must be real ground (never bordering a pit void)
    const vaults = [];
    for (const fx of [0.3, 0.7]) {
      let vx = Math.floor(cols * fx), guard3 = 0;
      const badSpot = (x) => {
        // no pit may touch the chamber OR its solid margin columns — an
        // adjacent pit shaft would tunnel straight into the vault
        for (let k = -2; k <= 3; k++) if (isPit[x + k]) return true;
        if (x + 6 >= arenaStart || groundTop[x] > rows - 6) return true;
        // flat runway across the whole vault: horizontal ground fire then
        // passes a clear tile ABOVE the plug — it only opens to deliberate
        // down-aimed shots (that's what makes it a secret)
        for (let k = -2; k <= 3; k++) if (groundTop[x + k] !== groundTop[x]) return true;
        return false;
      };
      while (guard3++ < 40 && badSpot(vx)) vx++;
      if (guard3 >= 40) continue;
      const gy = groundTop[vx];
      // shaft (2 wide, 2 deep) + chamber (4 wide, 2 tall), floor stays solid
      for (let dy = 0; dy < 2; dy++) { set(vx, gy + dy, T.EMPTY); set(vx + 1, gy + dy, T.EMPTY); }
      for (let dx2 = -1; dx2 < 3; dx2++) for (let dy = 2; dy < 4; dy++) set(vx + dx2, gy + dy, T.EMPTY);
      set(vx, gy, T.CRATE); set(vx + 1, gy, T.CRATE);          // the plug
      const secret = 'v' + vaults.length;
      for (let dx2 = -1; dx2 < 3; dx2++) entities.push({ type: 'gem', tx: vx + dx2, ty: gy + 3, secret });
      entities.push({ type: rnd() < 0.5 ? 'pu_bomb' : 'pu_life', tx: vx + 1, ty: gy + 2, secret });
      vaults.push(vx);
    }

    // W1: waterfalls pour off mesa step-downs (animated decor + splash)
    const decors = [];
    if (world.id === 1) {
      let placed2 = 0;
      for (let x = 20; x < cols - 20 && placed2 < 3; x++) {
        if (groundTop[x] - groundTop[x - 1] >= 1 && !isPit[x] && !isPit[x - 1] && x < arenaStart - 4) {
          // ledge at x-1 is higher ground: pour from its lip down to x's ground
          decors.push({ type: 'waterfall', tx: x, topTy: groundTop[x - 1], botTy: groundTop[x] });
          placed2++; x += 26;
        }
      }
    }
    // W5: egg nest clusters in the dips
    if (world.id === 5) {
      for (let n = 0; n < 2; n++) {
        const nx = 30 + Math.floor(rnd() * (Math.min(cols, arenaStart) - 60));
        for (let i = 0; i < 3; i++) addOnSurface(nx + i * 2, 'egg', 'eggpod');
      }
    }

    // ---- CRAWLSPACES: low burrows only the rolled-up wheel fits through ----
    // A two-tile mound with a one-tile tunnel at ground level: walkers jump
    // over it, the 16 px wheel rolls through the 20 px gap and takes the stash
    // inside. Laid last, on a random stream of its own, so the rest of the
    // stage stays exactly as it was.
    const crawls = [];
    {
      const rc = mulberry32((g.seed * 31 + stageIndex * 104729 + 0x5eed) >>> 0);
      const ckCol = Math.floor(cols * 0.55);
      const upX = world.updraftFinale && stageIndex === 1 ? Math.floor(cols * 0.62) - 8 : cols + 999;
      const fits = (x0, x1) => {
        if (x0 < 14 || x1 > Math.min(cols - 12, arenaStart - 8) || x1 >= upX) return false;
        if (x1 > ckCol - 4 && x0 < ckCol + 4) return false;
        if (vaults.some(v => x1 > v - 8 && x0 < v + 10)) return false;
        const gy = groundTop[x0];
        if (world.water && gy > waterY) return false;               // the tunnel must stay dry: the wheel sinks
        for (let x = x0 - 2; x <= x1 + 2; x++) if (isPit[x]) return false;
        for (let x = x0 - 1; x <= x1 + 1; x++) {                     // flat floor, open air above (the wheel can't climb)
          if (groundTop[x] !== gy) return false;
          for (let y = gy - 5; y < gy; y++) if (get(x, y) !== T.EMPTY) return false;
        }
        for (const pl of platforms) if (pl.x <= x1 + 1 && pl.x + pl.w >= x0 - 1 && pl.y >= gy - 6) return false;
        for (const c of crawls) if (x0 < c.x1 + 24 && x1 > c.x0 - 24) return false;
        return true;
      };
      for (const [fa, fb] of [[0.12, 0.5], [0.5, 0.95]]) {
        const lo = Math.floor(cols * fa), hi = Math.floor(cols * fb);
        let L = 5 + Math.floor(rc() * 4);                           // 5..8 tiles of tunnel, shorter if the ground is choppy
        const s0 = Math.floor(rc() * (hi - lo));
        let x0 = -1;
        for (; L >= 4 && x0 < 0; L--) for (let k = 0; k < hi - lo && x0 < 0; k++) { const x = lo + ((s0 + k) % (hi - lo)); if (fits(x, x + L - 1)) x0 = x; }
        if (x0 < 0) continue;
        L++;
        const x1 = x0 + L - 1, gy = groundTop[x0], secret = 'c' + crawls.length;
        for (let x = x0; x <= x1; x++) set(x, gy - 2, T.SOLID);
        // whatever stood here now stands on the roof; the tunnel holds only the stash
        for (let i = entities.length - 1; i >= 0; i--) {
          const e = entities[i];
          if (e.tx < x0 || e.tx > x1 || (e.ty !== gy - 1 && e.ty !== gy - 2)) continue;
          if (e.type === 'gem' && e.ty === gy - 1) entities.splice(i, 1); else e.ty = gy - 3;
        }
        const mid = x0 + (L >> 1);
        for (let x = x0 + 1; x < x1; x++) entities.push({ type: L >= 7 && x === mid ? (crawls.length ? 'pu_bomb' : 'pu_weapon') : 'gem', tx: x, ty: gy - 1, secret });
        crawls.push({ x0, x1, gy });
      }
    }

    // player start (left) and exit (right)
    const startX = 3;
    const startSurf = surfaceY(startX);
    const playerStart = { x: startX * TILE + 2, y: (startSurf - 2) * TILE };
    const exitX = cols - 4;
    const exitSurf = surfaceY(exitX);
    const exit = { x: exitX * TILE, y: (exitSurf - 3) * TILE, w: TILE * 2, h: TILE * 3 };

    // boss spawn: centered in the arena, standing on the ground
    let bossSpawn = null;
    if (bossKey) {
      const bCfg = BOSSES[bossKey];
      const bCol = cols - 12;
      const bSurf = surfaceY(bCol);
      bossSpawn = {
        key: bossKey,
        x: bCol * TILE - bCfg.w / 2,
        y: bSurf * TILE - bCfg.h,
        wakeX: (arenaStart + 2) * TILE,    // player x that triggers the fight
        wallCol: arenaStart,               // column sealed behind the player
        groundY: bSurf * TILE,
      };
    }

    // mid-stage checkpoint (SPEC §2.6) on clean ground past the halfway mark
    let checkpoint = null;
    {
      let ccol = Math.floor(cols * 0.55);
      let guard2 = 0;
      while ((isPit[ccol] || ccol >= arenaStart - 4) && guard2++ < cols) ccol = (ccol + 1) % cols;
      const csurf = surfaceY(ccol);
      if (csurf < rows) checkpoint = { x: ccol * TILE + 2, y: (csurf - 2) * TILE };
    }

    // 2-2 vertical wind-climb finale: an updraft column before the boss arena
    let updraft = null;
    if (world.updraftFinale && stageIndex === 1) {
      const x0 = Math.floor(cols * 0.62), x1 = Math.min(cols - 2, arenaStart - 2);
      if (x1 > x0 + 8) updraft = { x0: x0 * TILE, x1: x1 * TILE };
    }

    return {
      world: world.id, worldIndex, stageIndex, name: world.name, type: world.type,
      theme: world.theme, palette: world.palette,
      cols, rows, tile: TILE, tiles, platforms, entities, playerStart, exit,
      bossSpawn, windX: world.windX || 0, updraft, hasWater: !!world.water,
      checkpoint, decors, crawls, secrets: vaults.length + crawls.length,
      timeLimit: bossKey ? 420 : 300,
    };
  }

  const STAGES_PER_WORLD = [2, 2, 3, 2, 2]; // faithful blueprint: 5 worlds / 11 stages

  // difficulty scaling (single choke point: damage to player / enemy+boss hp / clock)
  const DIFFICULTY = {
    easy:   { dmg: 0.6, hp: 0.8,  time: 1.25, label: 'EASY' },
    normal: { dmg: 1.0, hp: 1.0,  time: 1.0,  label: 'NORMAL' },
    hard:   { dmg: 1.4, hp: 1.25, time: 0.85, label: 'HARD' },
  };

  // crystals a trooper can reach in each stage (campaign order), counted by
  // demo.js reachable(): the stage results score against these. test.cjs
  // checks them against the live level builders.
  const REACH = [62, 57, 68, 54, 65, 64, 69, 103, 89, 72, 62];

  const api = {
    TILE, VIEW_W, VIEW_H, FPS, SPEED, STEP, DT, PHYS, T, SOLID_TILES, SHMUP,
    WEAPONS, WEAPON_ORDER, ENEMIES, ROSTERS, LOB_SKINS, BOSSES, BOSS_GUARD, WORLDS, STAGES_PER_WORLD, DIFFICULTY,
    DEFAULT_SPEED: SPEED, SPEEDS, REACH,
    mulberry32, buildLevel,
    VERSION: '2.4.0',
  };
  // game speed is a player option: the engine reads api.DT every tick
  api.setSpeed = (v) => { api.SPEED = v; api.DT = STEP * v; };
  return api;
});

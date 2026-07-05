// Emerald Mine II — headless engine. Faithful port of the EM cave logic
// (reference: Rocks'n'Diamonds src/game_em/logic.c + SPEC.md). Deterministic:
// same cave + seed + inputs => same outcome. No DOM. Runs in browser or node.
'use strict';

// ─── Elements ───
const EL_NAMES = [
  'blank', 'splash_e', 'splash_w',
  'dirt', 'steel', 'wall', 'roundwall', 'fake_blank', 'fake_dirt', 'plant', 'letter',
  'stone', 'stone_p', 'stone_f',
  'emerald', 'emerald_p', 'emerald_f',
  'diamond', 'diamond_p', 'diamond_f',
  'bomb', 'bomb_p', 'bomb_f',
  'nut', 'nut_p', 'nut_f',
  'drip', 'drip_f', 'drip_s', 'drip_sB',
  'amoeba', 'fake_amoeba',
  'sand', 'sand_stonein', 'sand_stone', 'sand_stoneout',
  'acid', 'acid_nw', 'acid_ne', 'acid_sw', 'acid_se', 'acid_base',
  'wonderwall', 'wheel',
  'key1', 'key2', 'key3', 'key4',
  'door1', 'door2', 'door3', 'door4',
  'fdoor1', 'fdoor2', 'fdoor3', 'fdoor4',
  'dynamite_item', 'dyn1', 'dyn2', 'dyn3', 'dyn4',
  'exit_closed', 'exit_open',
  'alien', 'alien_p',
  'bug1_n', 'bug1_e', 'bug1_s', 'bug1_w',
  'bug2_n', 'bug2_e', 'bug2_s', 'bug2_w',
  'tank1_n', 'tank1_e', 'tank1_s', 'tank1_w',
  'tank2_n', 'tank2_e', 'tank2_s', 'tank2_w',
  'eater_n', 'eater_e', 'eater_s', 'eater_w',
  'boom1', 'boom2', 'chain', 'vanish',
  'player', 'claimed', 'border',
];
const EL = {};
EL_NAMES.forEach((n, i) => { EL[n] = i; });
const NEL = EL_NAMES.length;

const CW = 64, CH = 32, GW = CW + 2, GH = CH + 2; // padded grid
const IDX = (x, y) => (y + 1) * GW + (x + 1);
const DN = -GW, DS = GW, DE = 1, DW = -1;
const DIRS4 = [DN, DE, DS, DW];           // 0=N 1=E 2=S 3=W
const DX4 = [0, 1, 0, -1], DY4 = [-1, 0, 1, 0];

// ─── Property tables ───
function tab(names) { const t = new Uint8Array(NEL); for (const n of names) t[EL[n]] = 1; return t; }
const IS_BLANK = tab(['blank', 'splash_e', 'splash_w']);
const IS_AMOEBA = tab(['amoeba', 'fake_amoeba']);
const IS_ACID = tab(['acid']);
// what stones/bombs/nuts roll off (when it is the tile BELOW them)
const ROUND_STONE = tab(['roundwall', 'stone', 'stone_p', 'emerald', 'emerald_p',
  'diamond', 'diamond_p', 'bomb', 'bomb_p', 'nut', 'nut_p',
  'key1', 'key2', 'key3', 'key4', 'acid_nw', 'acid_ne']);
// gems additionally roll off flat walls, steel and the wonderwall (EM signature)
const ROUND_GEM = (() => { const t = Uint8Array.from(ROUND_STONE);
  for (const n of ['wall', 'steel', 'wonderwall']) t[EL[n]] = 1; return t; })();
const IS_KILL_ADJ = tab(['bug1_n', 'bug1_e', 'bug1_s', 'bug1_w', 'bug2_n', 'bug2_e', 'bug2_s', 'bug2_w',
  'tank1_n', 'tank1_e', 'tank1_s', 'tank1_w', 'tank2_n', 'tank2_e', 'tank2_s', 'tank2_w']);
const IS_BUG = tab(['bug1_n', 'bug1_e', 'bug1_s', 'bug1_w', 'bug2_n', 'bug2_e', 'bug2_s', 'bug2_w']);
const IS_BOMB = tab(['bomb', 'bomb_p', 'bomb_f']);
// immune to explosions
// in-flight boom1/boom2 cells are NOT immune: the reference re-carves them
// (phase reset + contents overwrite); only chain markers resist (Lboom_one)
const BOOM_IMMUNE = tab(['steel', 'door1', 'door2', 'door3', 'door4',
  'fdoor1', 'fdoor2', 'fdoor3', 'fdoor4',
  'acid', 'acid_nw', 'acid_ne', 'acid_sw', 'acid_se', 'acid_base',
  'plant', 'border', 'chain']);
// what enemies can walk into (player checked separately)
const ENEMY_WALK = tab(['blank', 'splash_e', 'splash_w', 'plant', 'player']);
const FALLERS = {}; // resting -> falling / pause maps
[['stone', 'stone_p', 'stone_f'], ['emerald', 'emerald_p', 'emerald_f'],
 ['diamond', 'diamond_p', 'diamond_f'], ['bomb', 'bomb_p', 'bomb_f'],
 ['nut', 'nut_p', 'nut_f']].forEach(([r, p, f]) => {
  FALLERS[EL[r]] = { rest: EL[r], pause: EL[p], fall: EL[f] };
  FALLERS[EL[p]] = FALLERS[EL[r]]; FALLERS[EL[f]] = FALLERS[EL[r]];
});

// ─── Cave parsing (decrypted 2106-byte V3 file) ───
// Requires EM_RAW_TO_NAME / EM_RAW_GLYPH / EM_V4_CANON / EM_EATER_TO_NAME (assets/em-map.js).
function parseCave(bytes, maps) {
  const { EM_RAW_TO_NAME, EM_RAW_GLYPH, EM_V4_CANON, EM_EATER_TO_NAME } = maps;
  const grid = new Uint8Array(GW * GH).fill(EL.border);
  const glyphs = {};
  let wonderwallActive = false, wheelStartPos = -1;
  const openExitIdx = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const raw = bytes[y * CW + x];
    const canon = EM_V4_CANON[raw];
    const i = IDX(x, y);
    grid[i] = EL[EM_RAW_TO_NAME[raw]];
    if (EM_RAW_GLYPH[raw]) glyphs[i] = EM_RAW_GLYPH[raw];
    if (canon === 36) wonderwallActive = true;                 // pre-activated wonderwall
    if (canon === 40 && wheelStartPos < 0) wheelStartPos = i;  // pre-activated wheel
    if (canon >= 64 && canon <= 66) openExitIdx.push(i);
  }
  // fixups (convert.c cleanup): acid surface above every base. All wheel tiles stay
  // functional (pressing any re-arms/retargets); only the FIRST pre-active (code 40)
  // wheel starts armed — the reference demotes extra code-40s to inactive wheels,
  // which is what leaving them as EL.wheel gives us.
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const i = IDX(x, y);
    if (grid[i] === EL.acid_base && grid[i + DN] !== EL.border) grid[i + DN] = EL.acid;
  }
  const be16 = o => (bytes[o] << 8) | bytes[o + 1];
  const eaterArrays = [];
  for (let a = 0; a < 4; a++) {
    const arr = [];
    for (let k = 0; k < 9; k++) {
      const raw = bytes[2048 + a * 9 + k];
      arr.push(EL[EM_EATER_TO_NAME[raw < 28 ? raw : 0]]);
    }
    eaterArrays.push(arr);
  }
  const p1v = be16(2096), p2v = be16(2098);
  const cave = {
    grid, glyphs, eaterArrays,
    scores: { emerald: bytes[2084], diamond: bytes[2085], alien: bytes[2086], tank: bytes[2087],
      bug: bytes[2088], eater: bytes[2089], nut: bytes[2090], dynamite: bytes[2091],
      key: bytes[2092], exitBonus: bytes[2093] },
    timeSeconds: bytes[2094] * 10,
    gemsNeeded: bytes[2095],
    p1: { x: p1v & 63, y: (p1v >> 6) & 31 },
    p2: { x: p2v & 63, y: (p2v >> 6) & 31 },
    amoebaTime: be16(2100),
    wonderwallTime: wonderwallActive ? 9999 : Math.min(be16(2102), 9999),
    wonderwallActive,
    wheelTime: Math.min(be16(2104), 9999),
    wheelStartPos,
  };
  // player start cells forced blank
  grid[IDX(cave.p1.x, cave.p1.y)] = EL.blank;
  grid[IDX(cave.p2.x, cave.p2.y)] = EL.blank;
  return cave;
}

// ─── Engine ───
class EMEngine {
  constructor(cave, opts = {}) {
    this.cave = cave;
    this.nPlayers = opts.players || 1;
    this.seed = (opts.seed >>> 0) || 1684108901;
    this.grid = Uint8Array.from(cave.grid);
    this.aux = new Uint8Array(GW * GH);        // sand-phase counters
    this.boomC = new Uint8Array(GW * GH);      // explosion result contents
    this.chainT = new Uint8Array(GW * GH);     // 1=bomb 2=bug chain pending
    this.glyphs = cave.glyphs;
    this.eaterPos = 0;
    this.score = 0;
    this.gemsNeeded = cave.gemsNeeded;
    this.timed = cave.timeSeconds > 0;
    this.timeLeft = cave.timeSeconds;
    this.timeElapsed = 0;
    this.tick = 0;
    this.killedOutOfTime = false;
    this.wonderwallTime = cave.wonderwallTime;
    this.wonderwallActive = cave.wonderwallActive;
    this.wheelCnt = cave.wheelStartPos >= 0 ? cave.wheelTime : 0;
    this.wheelPos = cave.wheelStartPos;
    this.pendingBooms = [];
    this.sounds = [];   // per tick: {s, i}
    this.moves = [];    // per tick: {f, t, el} for interpolation
    this.status = 'playing';
    this.bonus = 0;
    this.players = [];
    for (let p = 0; p < this.nPlayers; p++) {
      const st = p === 0 ? cave.p1 : cave.p2;
      this.players.push({
        x: st.x, y: st.y, idx: IDX(st.x, st.y), alive: true, home: false,
        keys: 0, dynamite: 0, dynCnt: 0, lastH: true, face: 1, pushing: false, acting: false,
      });
      this.grid[IDX(st.x, st.y)] = EL.player;
    }
    this.home = this.nPlayers;
  }

  rnd(x) { this.seed = (Math.imul(this.seed, 12421) + 1) >>> 0; return (x * (this.seed & 0xffff)) >>> 16; }
  snd(s, i) { this.sounds.push({ s, i }); }
  // blow up all players (hold-ESC restart / suicide). Takes effect next step().
  abort() { this.killedOutOfTime = true; }

  // ── main tick ──
  step(in1, in2) {
    const g = this.grid;
    this.sounds = []; this.moves = []; this.pendingBooms = [];
    this.fresh = new Set();  // cells written by the players phase: object scan must skip them this tick
    for (let k = 0; k < 8; k++) this.seed = (Math.imul(this.seed, 129) + 1) >>> 0;
    this.tick++;

    this.playersPhase([in1 || {}, in2 || {}]);
    this.objectScan();
    this.globalsPhase();

    // terminal states
    if (this.home === 0 && this.status === 'playing') {
      this.status = 'solved';
      if (this.timed) { this.bonus = Math.round(this.cave.scores.exitBonus * this.timeLeft / 10); this.score += this.bonus; }
    } else if (this.status === 'playing') {
      let terminal = true, anyHome = false;
      for (const p of this.players) { if (p.alive && !p.home) terminal = false; if (p.home) anyHome = true; }
      if (terminal) this.status = 'dead';
    }
    if (this.score > 9999) this.score = 9999;
    return this.status;
  }

  // ── players ──
  playersPhase(inputs) {
    const g = this.grid;
    // 1. death checks against pre-move state
    const killed = [];
    for (const p of this.players) {
      if (!p.alive || p.home) continue;
      const c = g[p.idx];
      let die = this.killedOutOfTime;
      if (!die && !(c === EL.player || IS_BLANK[c] || (c >= EL.dyn1 && c <= EL.dyn4))) die = true;
      if (!die) for (const d of DIRS4) if (IS_KILL_ADJ[g[p.idx + d]]) { die = true; break; }
      if (die) killed.push(p);
    }
    // 2. execute kills (killer bugs/tanks explode even for acid deaths; acid suppresses
    //    only the 1x1 pop — kill_player, logic.c:555-576)
    for (const p of killed) {
      p.alive = false;
      const c = g[p.idx];
      for (const d of DIRS4) {
        const n = p.idx + d, e = g[n];
        if (IS_KILL_ADJ[e]) {
          this.trigger(n, IS_BUG[e] ? this.bugContents(n) : null); // killer explodes 3x3
          g[n] = EL.vanish;
        }
      }
      if (IS_ACID[c]) { this.snd('die', p.idx); continue; }
      if (c === EL.exit_open) { this.snd('exit', p.idx); continue; }
      g[p.idx] = EL.boom1; this.boomC[p.idx] = EL.blank;  // 1x1 pop; same-tick scan advances it
      this.snd('die', p.idx);
    }
    // 3. actions in reference order (start_check_nr: bit7 set & bit8 clear -> reversed; no RNG draw)
    const order = this.players.map((_, i) => i);
    if (order.length > 1 && (this.seed & 128) && !(this.seed & 256)) order.reverse();
    this.vacated = [];
    for (const pi of order) {
      const p = this.players[pi];
      p.pushing = false; p.acting = false;
      if (!p.alive || p.home) continue;
      const inp = inputs[pi] || {};
      const dx = inp.dx | 0, dy = inp.dy | 0, fire = !!inp.fire;
      if (!dx && !dy) {
        if (fire && p.dynamite > 0) {
          p.dynCnt++;
          if (p.dynCnt >= 5) { p.dynCnt = 0; p.dynamite--; g[p.idx] = EL.dyn1; this.snd('dynamite', p.idx); }
        } else { p.dynCnt = 0; }
        this.seed = (this.seed + 7) >>> 0;    // idle churn happens on every no-direction tick
        continue;
      }
      p.dynCnt = 0;
      if (fire && dx && dy) continue;         // snap with diagonal input does nothing (logic.c:594)
      // zigzag axis order
      const tries = [];
      if (dx && dy) { if (p.lastH) { tries.push([0, dy]); tries.push([dx, 0]); } else { tries.push([dx, 0]); tries.push([0, dy]); } }
      else tries.push([dx, dy]);
      for (const [tx, ty] of tries) {
        if (fire) { if (this.trySnap(p, tx, ty)) break; }
        else {
          const oldIdx = p.idx;
          if (this.tryMove(p, tx, ty)) { if (p.idx !== oldIdx) p.lastH = !!tx; break; }
        }
      }
      if (dx) p.face = dx > 0 ? 1 : -1;
    }
    // vacated origins blank only after ALL players acted (blocks same-tick followers)
    for (const i of this.vacated) if (g[i] === EL.player) g[i] = EL.blank;
  }

  tryMove(p, dx, dy) {
    const g = this.grid;
    const d = dx ? (dx > 0 ? DE : DW) : (dy > 0 ? DS : DN);
    const t = p.idx + d, e = g[t];
    const moveTo = (idx) => {
      this.vacated.push(p.idx);
      this.moves.push({ f: p.idx, t: idx, el: EL.player, pl: p });
      p.idx = idx; p.x = (idx % GW) - 1; p.y = ((idx / GW) | 0) - 1;
      if (g[idx] !== EL.plant && !IS_KILL_ADJ[g[idx]] && !IS_ACID[g[idx]] && g[idx] !== EL.boom1 && g[idx] !== EL.boom2) g[idx] = EL.player;
      p.acting = true;
      return true;
    };
    if (IS_BLANK[e]) { this.snd('space', t); return moveTo(t); }
    switch (e) {
      case EL.dirt: this.snd('dirt', t); return moveTo(t);
      case EL.emerald: case EL.emerald_p:
        this.score += this.cave.scores.emerald; this.gemsNeeded = Math.max(0, this.gemsNeeded - 1);
        this.snd('collect', t); return moveTo(t);
      case EL.diamond: case EL.diamond_p:
        this.score += this.cave.scores.diamond; this.gemsNeeded = Math.max(0, this.gemsNeeded - 3);
        this.snd('collect', t); return moveTo(t);
      case EL.dynamite_item:
        this.score += this.cave.scores.dynamite; p.dynamite++; this.snd('collect', t); return moveTo(t);
      case EL.key1: case EL.key2: case EL.key3: case EL.key4:
        this.score += this.cave.scores.key; p.keys |= 1 << (e - EL.key1); this.snd('collect', t); return moveTo(t);
      case EL.door1: case EL.door2: case EL.door3: case EL.door4:
      case EL.fdoor1: case EL.fdoor2: case EL.fdoor3: case EL.fdoor4: {
        const kn = e >= EL.fdoor1 ? e - EL.fdoor1 : e - EL.door1;
        const beyond = t + d;
        if ((p.keys & (1 << kn)) && IS_BLANK[this.grid[beyond]]) { this.snd('door', t); return moveTo(beyond); }
        return false;
      }
      case EL.acid:
        // walk in alive; next tick's death check kills (no explosion) — logic.c:624-661
        this.splash(t); this.snd('acid', t); return moveTo(t);
      case EL.exit_open: {
        this.vacated.push(p.idx);
        p.home = true; this.home--;
        g[t] = EL.boom1; this.boomC[t] = EL.blank;   // used exit is consumed (teamwork rule)
        this.snd('exit', t); return true;
      }
      case EL.plant: return moveTo(t);   // suicide move
      case EL.wheel:
        // pressed, but not a move — the other zigzag axis may still be tried (digfield FALSE)
        this.wheelCnt = this.cave.wheelTime; this.wheelPos = t; this.snd('press', t); p.acting = true; return false;
      case EL.stone: case EL.bomb: case EL.nut: {
        if (!dx) return false; // horizontal push only
        const beyond = t + d, be = this.grid[beyond];
        p.pushing = true;
        const prob = e === EL.stone ? 16 : e === EL.nut ? 13 : 10;
        if (this.rnd(32) >= prob) { p.acting = true; return false; } // push failed: anim only, other axis may be tried
        if (IS_BLANK[be]) {
          this.grid[beyond] = FALLERS[e].pause; this.fresh.add(beyond);
          this.moves.push({ f: t, t: beyond, el: e });
          this.snd('roll', t); return moveTo(t);
        }
        if (IS_ACID[be]) { this.splash(beyond); this.snd('acid', beyond); return moveTo(t); }
        return false;
      }
      default:
        if (IS_KILL_ADJ[e] || e === EL.boom1) return moveTo(t); // suicide move (boom2 blocks, per reference)
        return false;
    }
  }

  trySnap(p, dx, dy) {
    const d = dx ? (dx > 0 ? DE : DW) : (dy > 0 ? DS : DN);
    const t = p.idx + d, e = this.grid[t];
    switch (e) {
      case EL.dirt: this.snd('dirt', t); break;
      case EL.emerald: case EL.emerald_p:
        this.score += this.cave.scores.emerald; this.gemsNeeded = Math.max(0, this.gemsNeeded - 1); this.snd('collect', t); break;
      case EL.diamond: case EL.diamond_p:
        this.score += this.cave.scores.diamond; this.gemsNeeded = Math.max(0, this.gemsNeeded - 3); this.snd('collect', t); break;
      case EL.dynamite_item: this.score += this.cave.scores.dynamite; p.dynamite++; this.snd('collect', t); break;
      case EL.key1: case EL.key2: case EL.key3: case EL.key4:
        this.score += this.cave.scores.key; p.keys |= 1 << (e - EL.key1); this.snd('collect', t); break;
      default: return true; // fire+dir never moves; action consumed
    }
    this.grid[t] = EL.vanish;   // clears at end of tick: objects above start falling next tick
    p.acting = true; p.face = dx ? (dx > 0 ? 1 : -1) : p.face;
    return true;
  }

  // ── object scan (top-down, left-right; claims into grid, results into next) ──
  objectScan() {
    const g = this.grid;
    const nx = Uint8Array.from(g);
    this.nx = nx;
    this.scanScore = 0;   // kill scores banked only if a player survives the tick
    for (let y = 0; y < CH; y++) {
      const row = (y + 1) * GW;
      for (let x = 0; x < CW; x++) {
        const i = row + x + 1;
        if (this.fresh.has(i)) continue;
        const e = g[i];
        switch (e) {
          case EL.splash_e: case EL.splash_w: case EL.vanish: nx[i] = EL.blank; break;
          case EL.stone: case EL.emerald: case EL.diamond: case EL.bomb: case EL.nut:
            this.doRest(i, e); break;
          case EL.stone_p: case EL.emerald_p: case EL.diamond_p: case EL.bomb_p: case EL.nut_p:
            this.doPause(i, e); break;
          case EL.stone_f: this.doStoneFall(i); break;
          case EL.emerald_f: this.doGemFall(i, EL.emerald, EL.diamond); break;
          case EL.diamond_f: this.doGemFall(i, EL.diamond, EL.stone); break;
          case EL.bomb_f: this.doBombFall(i); break;
          case EL.nut_f: this.doNutFall(i); break;
          case EL.drip: nx[i] = EL.drip_f; break;
          case EL.drip_f: this.doDripFall(i); break;
          case EL.drip_s: nx[i] = EL.drip_f; break;    // Ldrip_stretch
          case EL.drip_sB: nx[i] = EL.blank; break;    // Ldrip_stretchB
          case EL.sand_stonein:
            if (++this.aux[i] >= 4) { nx[i] = EL.sand_stone; this.aux[i] = 0; } break;
          case EL.sand_stone: this.doSandStone(i); break;
          case EL.sand_stoneout: this.doSandOut(i); break;
          case EL.dyn1: nx[i] = EL.dyn2; this.snd('tick', i); break;
          case EL.dyn2: nx[i] = EL.dyn3; this.snd('tick', i); break;
          case EL.dyn3: nx[i] = EL.dyn4; this.snd('tick', i); break;
          case EL.dyn4: nx[i] = EL.vanish; this.trigger(i, null); break;
          case EL.boom1: nx[i] = EL.boom2; this.snd('boom', i); break;
          case EL.boom2: nx[i] = this.boomC[i]; this.boomC[i] = 0; break;
          case EL.exit_closed: if (this.gemsNeeded === 0) { nx[i] = EL.exit_open; this.snd('exit_open', i); } break;
          case EL.wonderwall: if (this.wonderwallActive && this.wonderwallTime > 0) this.snd('wonder', i); break;
          case EL.wheel: if (this.wheelCnt > 0 && i === this.wheelPos) this.snd('wheel', i); break;
          case EL.alien: this.doAlien(i); break;
          case EL.alien_p: nx[i] = EL.alien; break;
          default:
            if (e >= EL.bug1_n && e <= EL.bug2_w) this.doBugTank(i, e, true);
            else if (e >= EL.tank1_n && e <= EL.tank2_w) this.doBugTank(i, e, false);
            else if (e >= EL.eater_n && e <= EL.eater_w) this.doEater(i, e);
            break;
        }
      }
    }
    if (this.players.some(p => p.alive)) this.score += this.scanScore;
    this.grid = nx;
  }

  // move helper inside scan: claims src+dst in current grid, writes result in next
  scanMove(i, t, resultEl, visEl) {
    const g = this.grid, nx = this.nx;
    g[i] = EL.claimed; nx[i] = EL.blank;
    g[t] = EL.claimed; nx[t] = resultEl;
    this.moves.push({ f: i, t, el: visEl !== undefined ? visEl : resultEl });
  }
  // splash droplets appear above-left/right of the acid surface cell `acidIdx`
  splash(acidIdx) {
    const g = this.grid, nx = this.nx || g;
    const put = (j, el) => { if (g[j] === EL.blank) { g[j] = el; if (nx !== g && nx[j] === EL.blank) nx[j] = el; } };
    put(acidIdx + DN + DE, EL.splash_e); put(acidIdx + DN + DW, EL.splash_w);
  }
  bugContents(center) {
    const c = new Array(9).fill(EL.emerald); c[4] = EL.diamond; return c;
  }
  trigger(i, contents) { this.pendingBooms.push({ i, c: contents }); }

  doRest(i, e) {
    const g = this.grid, nx = this.nx, F = FALLERS[e];
    const below = g[i + DS];
    // only stones fall through plants from rest (Lstone); gems/bombs/nuts sit
    if (IS_BLANK[below] || (below === EL.plant && e === EL.stone)) { this.scanMove(i, i + DS, F.fall, e); return; }
    if (IS_ACID[below]) { g[i] = EL.claimed; nx[i] = EL.blank; this.splash(i + DS); this.snd('acid', i); return; }
    if (e === EL.stone && below === EL.sand) {  // resting stones sink into sand (Lstone Xsand, silent)
      g[i] = EL.claimed; nx[i] = EL.blank; nx[i + DS] = EL.sand_stonein; this.aux[i + DS] = 1; return;
    }
    const round = (e === EL.emerald || e === EL.diamond) ? ROUND_GEM : ROUND_STONE;
    if (round[below]) {
      const first = this.rnd(2) ? DE : DW;
      for (const sd of [first, -first]) {
        const side = i + sd, diag = side + DS;
        if (IS_BLANK[g[side]] && (IS_BLANK[g[diag]] || IS_ACID[g[diag]])) {
          this.scanMove(i, side, F.pause, e); return;
        }
      }
    }
  }
  doPause(i, e) {
    const g = this.grid, nx = this.nx, F = FALLERS[e];
    const below = g[i + DS];
    if (IS_BLANK[below]) { this.scanMove(i, i + DS, F.fall, F.rest); return; }
    if (IS_ACID[below]) { g[i] = EL.claimed; nx[i] = EL.blank; this.splash(i + DS); this.snd('acid', i); return; }
    g[i] = F.rest; nx[i] = F.rest;   // same-tick cave write: later-scanned handlers see it settled
  }
  fallCommon(i, e) { // shared: keep falling / acid / player-entry. returns handled?
    const g = this.grid, below = g[i + DS];
    if (IS_BLANK[below]) { this.scanMove(i, i + DS, e, e); return true; }
    if (below === EL.player) { this.scanMove(i, i + DS, e, e); return true; } // kills via cell occupancy
    if (IS_ACID[below]) { g[i] = EL.claimed; this.nx[i] = EL.blank; this.splash(i + DS); this.snd('acid', i); return true; }
    return false;
  }
  doStoneFall(i) {
    if (this.fallCommon(i, EL.stone_f)) return;
    const g = this.grid, nx = this.nx, b = i + DS, below = g[b];
    const S = this.cave.scores;
    if (below >= EL.eater_n && below <= EL.eater_w) {
      this.scanScore += S.eater; nx[i] = EL.blank;
      this.trigger(b, this.cave.eaterArrays[this.eaterPos]); this.eaterPos = (this.eaterPos + 1) & 3;
      g[b] = EL.vanish; return;
    }
    if (below === EL.alien || below === EL.alien_p) { this.scanScore += S.alien; nx[i] = EL.stone; this.trigger(b, null); g[b] = EL.vanish; return; }
    if (IS_BUG[below]) { this.scanScore += S.bug; nx[i] = EL.stone; this.trigger(b, this.bugContents(b)); g[b] = EL.vanish; return; }
    if (below >= EL.tank1_n && below <= EL.tank2_w) { this.scanScore += S.tank; nx[i] = EL.stone; this.trigger(b, null); g[b] = EL.vanish; return; }
    if (IS_BOMB[below]) { nx[i] = EL.stone; this.trigger(b, null); g[b] = EL.vanish; return; }
    if (below === EL.nut || below === EL.nut_p) { nx[i] = EL.stone; nx[b] = EL.emerald; this.scanScore += S.nut; this.snd('crack', b); return; }
    if (below === EL.diamond || below === EL.diamond_p) {
      const under = g[b + DS];
      const isFalling = under === EL.stone_f || under === EL.emerald_f || under === EL.diamond_f ||
        under === EL.bomb_f || under === EL.nut_f;
      const unsupported = IS_BLANK[under] || under === EL.player || IS_ACID[under] ||
        under === EL.plant || under === EL.acid_base || isFalling || IS_KILL_ADJ[under];
      if (!unsupported) { this.scanMove(i, b, EL.stone_p, EL.stone); this.snd('squash', b); return; }
      nx[i] = EL.stone; this.snd('stone', i); return;
    }
    if (below === EL.wonderwall) { this.doWonderfall(i, b, EL.emerald_f); return; }
    // falling stone LANDS on sand (Lstone_fall default); the rest handler sinks it next tick
    nx[i] = EL.stone; this.snd('stone', i);
  }
  doGemFall(i, gem, into) {
    if (this.fallCommon(i, gem === EL.emerald ? EL.emerald_f : EL.diamond_f)) return;
    const b = i + DS, below = this.grid[b];
    if (below === EL.wonderwall) { this.doWonderfall(i, b, into === EL.diamond ? EL.diamond_f : (into === EL.stone ? EL.stone_f : EL.emerald_f)); return; }
    this.nx[i] = gem; this.snd('diamond', i);
  }
  doWonderfall(i, wallIdx, outFallEl) {
    const nx = this.nx, g = this.grid;
    if (this.wonderwallTime > 0) {
      this.wonderwallActive = true;
      nx[i] = EL.blank;
      const out = wallIdx + DS;
      if (IS_BLANK[g[out]] && IS_BLANK[nx[out]]) { nx[out] = outFallEl; g[out] = EL.claimed; }
      this.snd('squash', wallIdx);
    } else { // expired wall: just land
      const e = outFallEl === EL.emerald_f ? EL.stone : outFallEl === EL.diamond_f ? EL.emerald : EL.diamond;
      nx[i] = e === EL.stone ? EL.stone : e; this.snd('stone', i);
    }
  }
  doBombFall(i) {
    const g = this.grid, b = i + DS, below = g[b];
    if (IS_BLANK[below]) { this.scanMove(i, b, EL.bomb_f, EL.bomb_f); return; }
    if (IS_ACID[below]) { g[i] = EL.claimed; this.nx[i] = EL.blank; this.splash(i + DS); this.snd('acid', i); return; }
    this.nx[i] = EL.vanish; this.trigger(i, null); // explodes on ANY landing (incl. player below: blast kills)
  }
  doNutFall(i) {
    if (this.fallCommon(i, EL.nut_f)) return;
    this.nx[i] = EL.nut; this.snd('nut', i);
  }
  doDripFall(i) {
    // falls at half speed via 2-tick stretch states (Ldrip_stretch/B)
    const g = this.grid, b = i + DS, below = g[b];
    if (IS_BLANK[below] || below === EL.player || below === EL.plant) {
      g[i] = EL.claimed; this.nx[i] = EL.drip_sB;
      g[b] = EL.claimed; this.nx[b] = EL.drip_s;
      this.moves.push({ f: i, t: b, el: EL.drip_f });
      return;
    }
    if (IS_ACID[below]) { g[i] = EL.claimed; this.nx[i] = EL.drip_sB; this.splash(i + DS); this.snd('acid', i); return; }
    this.nx[i] = EL.amoeba; this.snd('drip', i);
  }
  doSandStone(i) {
    const g = this.grid, nx = this.nx, b = i + DS;
    if (g[b] === EL.sand) { nx[b] = EL.sand_stonein; this.aux[b] = 1; nx[i] = EL.sand; return; }
    if (IS_ACID[g[b]]) { nx[i] = EL.sand; this.splash(b); this.snd('acid', i); return; }
    if (IS_BLANK[g[b]]) { nx[i] = EL.sand; g[b] = EL.claimed; nx[b] = EL.sand_stoneout; return; }
  }
  doSandOut(i) { this.nx[i] = EL.stone_f; }   // emerges in the outlet cell, resumes falling next tick

  // bug (right-hand) / tank (left-hand); e encodes family+phase+dir
  doBugTank(i, e, isBug) {
    const g = this.grid, nx = this.nx;
    const base = isBug ? (e >= EL.bug2_n ? EL.bug2_n : EL.bug1_n) : (e >= EL.tank2_n ? EL.tank2_n : EL.tank1_n);
    const phase2 = isBug ? e >= EL.bug2_n : e >= EL.tank2_n;
    const dir = e - base;
    // amoeba adjacency -> explode
    for (const d of DIRS4) if (IS_AMOEBA[g[i + d]]) {
      nx[i] = EL.vanish; this.trigger(i, isBug ? this.bugContents(i) : null); return;
    }
    const fam1 = isBug ? EL.bug1_n : EL.tank1_n, fam2 = isBug ? EL.bug2_n : EL.tank2_n;
    const sndName = isBug ? 'bug' : 'tank';
    const turnPref = isBug ? 1 : 3; // bug checks right (+1), tank checks left (+3 == -1 mod 4)
    if (!phase2) {
      const td = (dir + turnPref) & 3;
      const tcell = g[i + DIRS4[td]];
      if (ENEMY_WALK[tcell] || IS_ACID[tcell]) { nx[i] = fam2 + td; this.snd(sndName, i); return; } // turn toward free side
    }
    // forward or turn away
    const f = i + DIRS4[dir], fe = g[f];
    if (ENEMY_WALK[fe]) { this.scanMove(i, f, fam1 + dir, e); this.snd(sndName, i); return; }
    if (IS_ACID[fe]) { g[i] = EL.claimed; nx[i] = EL.blank; this.splash(f); this.snd('acid', i); return; }
    const away = (dir + (isBug ? 3 : 1)) & 3;
    nx[i] = fam2 + away; this.snd(sndName, i);
  }

  doAlien(i) {
    const g = this.grid, nx = this.nx;
    let tx, ty;
    if (this.wheelCnt > 0 && this.wheelPos >= 0) { tx = (this.wheelPos % GW) - 1; ty = ((this.wheelPos / GW) | 0) - 1; }
    else {
      let best = null, bd = 1e9;
      for (const p of this.players) if (p.alive && !p.home) {
        const d = Math.abs(p.x - ((i % GW) - 1)) + Math.abs(p.y - (((i / GW) | 0) - 1));
        if (d < bd) { bd = d; best = p; }
      }
      if (!best) return;
      tx = best.x; ty = best.y;
    }
    const x = (i % GW) - 1, y = ((i / GW) | 0) - 1;
    let dxs = 0, dys = 0;
    const vertical = (x !== tx) ? this.rnd(4) === 0 : this.rnd(4) !== 0;
    if (vertical) dys = ty > y ? 1 : ty < y ? -1 : 0; else dxs = tx > x ? 1 : tx < x ? -1 : 0;
    if (!dxs && !dys) return;
    const t = i + (dxs ? (dxs > 0 ? DE : DW) : (dys > 0 ? DS : DN));
    const te = g[t];
    if (ENEMY_WALK[te]) { this.scanMove(i, t, EL.alien_p, EL.alien); this.snd('alien', i); return; }
    if (IS_ACID[te]) { g[i] = EL.claimed; nx[i] = EL.blank; this.splash(t); this.snd('acid', i); return; }
  }

  doEater(i, e) {
    const g = this.grid, nx = this.nx;
    const dir = e - EL.eater_n;
    // eat one adjacent diamond: clockwise from right of facing, facing last
    for (const off of [1, 2, 3, 0]) {
      const d = (dir + off) & 3, n = i + DIRS4[d];
      if (g[n] === EL.diamond) { g[n] = EL.claimed; nx[n] = EL.blank; this.snd('eater', i); return; }
    }
    const f = i + DIRS4[dir], fe = g[f];
    if (ENEMY_WALK[fe]) { this.scanMove(i, f, e, e); this.snd('eater', i); return; }
    if (IS_ACID[fe]) { g[i] = EL.claimed; nx[i] = EL.blank; this.splash(f); this.snd('acid', i); return; }
    // blocked: E/W-facing turn N or S; N/S-facing turn E or W (logic.c Leater_*)
    const nd = (dir & 1) ? (this.rnd(2) ? 0 : 2) : (this.rnd(2) ? 1 : 3);
    nx[i] = EL.eater_n + nd; this.snd('eater', i);
  }

  // ── globals ──
  globalsPhase() {
    const g = this.grid;
    // 1. amoeba growth (before explosion propagation, matching logic_globals order)
    const at = this.cave.amoebaTime;
    if (at > 0) {
      const n = Math.min(at * 8 + 4, 999);
      for (let k = 0; k < n; k++) {
        const x = this.rnd(CW), y = this.rnd(CH), i = IDX(x, y);
        const e = g[i];
        if ((IS_BLANK[e] || e === EL.plant || e === EL.dirt || e === EL.sand) &&
            (IS_AMOEBA[g[i + DN]] || IS_AMOEBA[g[i + DE]] || IS_AMOEBA[g[i + DS]] || IS_AMOEBA[g[i + DW]]))
          g[i] = EL.drip;
      }
    }
    // 2. chains ignite (1-tick delayed; contents were registered at catch time)
    const chains = [];
    for (let i = 0; i < g.length; i++) if (g[i] === EL.chain) chains.push(i);
    for (const i of chains) { this.chainT[i] = 0; this.carve(i); }
    // 3. carve this tick's explosions (register contents, then phase-carve)
    for (const bm of this.pendingBooms) { this.registerContents(bm.i, bm.c); this.carve(bm.i); }
    this.pendingBooms = [];
    // 4. timers
    if (this.wheelCnt > 0) this.wheelCnt--;
    if (this.wonderwallActive && this.wonderwallTime > 0) this.wonderwallTime--;
    // 5. time
    const secNow = Math.floor(this.tick * 8 / 50), secPrev = Math.floor((this.tick - 1) * 8 / 50);
    if (secNow !== secPrev) {
      this.timeElapsed++;
      if (this.timed) {
        this.timeLeft--;
        // original warns once per second during the FINAL 10 seconds only (bin_EM2 $4f6e:
        // cmpi.w #$b,$3ae / bcc skip — never at 100/90/... like later engine lineages)
        if (this.timeLeft >= 0 && this.timeLeft <= 9) this.snd('time', this.players[0].idx);
        if (this.timeLeft <= 0) { this.timeLeft = 0; this.killedOutOfTime = true; }
      }
    }
  }

  // contents registration (ref Lboom_generic: full 3x3, unconditional)
  registerContents(center, contents) {
    let k = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++, k++)
      this.boomC[center + dy * GW + dx] = contents ? contents[k] : EL.blank;
  }
  // phase carve (ref Lboom_nine/Lboom_one) — never touches boomC of non-caught cells;
  // the CENTER is never immune to its own boom (logic.c:7831), which is what lets
  // chain cells resolve instead of wedging forever.
  carve(center) {
    const g = this.grid;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const i = center + dy * GW + dx, e = g[i];
      if (i !== center && BOOM_IMMUNE[e]) continue;
      if (i !== center && IS_BOMB[e]) { g[i] = EL.chain; this.chainT[i] = 1; this.registerContents(i, null); continue; }
      if (i !== center && IS_BUG[e]) { g[i] = EL.chain; this.chainT[i] = 2; this.registerContents(i, this.bugContents(i)); continue; }
      g[i] = EL.boom1;
    }
  }
}

// exports (browser: globals; node: module)
if (typeof module !== 'undefined') {
  module.exports = { EMEngine, parseCave, EL, EL_NAMES, IDX, CW, CH, GW, GH };
}

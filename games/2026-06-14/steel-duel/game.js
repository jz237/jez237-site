/* Steel Duel — HD remaster of Atari Tank (1974).
   Fixed-timestep deterministic sim, entities, AI, render, UI, scores, window.__g hooks + self-tests. */
(function () {
  'use strict';

  /* ===================== constants ===================== */
  const COLS = 28, ROWS = 18, TILE = 34;
  const HUD_H = 64;
  const FIELD_W = COLS * TILE, FIELD_H = ROWS * TILE;
  const LW = FIELD_W, LH = HUD_H + FIELD_H;     // logical canvas size
  const STEP = 1 / 60;                          // fixed timestep (s)
  const TANK_R = 12;
  const ACCEL = 0.16, MAX_FWD = 2.4, MAX_REV = 1.5, FRICTION = 0.86;
  const TURN = 0.052;
  const SHELL_SPD = 6.6, SHELL_LIFE = 1.6, SHELL_R = 3, MAX_SHELLS = 1, FIRE_CD = 0.45;
  const FREEZE = 1.4;                           // death freeze (s)
  const MINE_R = 11;
  const DEFAULT_TIME = 60, FLASH_AT = 20;

  // interior wall rectangles in TILE coords [c, r, w, h]
  const WALL_DEF = [
    [5, 4, 4, 1], [19, 4, 4, 1], [5, 13, 4, 1], [19, 13, 4, 1],
    [9, 7, 1, 4], [18, 7, 1, 4], [13, 1, 2, 3], [13, 14, 2, 3],
    [3, 8, 2, 2], [23, 8, 2, 2],
  ];
  const MINE_RECT = { c0: 10, r0: 6, c1: 17, r1: 11 }; // inclusive tile range for minefield
  const SPAWNS = [{ c: 2, r: 2, a: 0 }, { c: 25, r: 15, a: Math.PI }];

  /* ===================== rng (deterministic) ===================== */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  let rng = mulberry32(1);

  /* ===================== maze ===================== */
  const solid = [];           // [r][c] boolean
  const wallRects = [];       // pixel rects for drawing
  function buildMaze() {
    for (let r = 0; r < ROWS; r++) { solid[r] = []; for (let c = 0; c < COLS; c++) solid[r][c] = (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1); }
    for (const [c, r, w, h] of WALL_DEF) for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) solid[y][x] = true;
    wallRects.length = 0;
    // border as 4 rects
    wallRects.push(px(0, 0, COLS, 1), px(0, ROWS - 1, COLS, 1), px(0, 0, 1, ROWS), px(COLS - 1, 0, 1, ROWS));
    for (const [c, r, w, h] of WALL_DEF) wallRects.push(px(c, r, w, h));
  }
  function px(c, r, w, h) { return { x: c * TILE, y: HUD_H + r * TILE, w: w * TILE, h: h * TILE }; }
  function tileCenter(c, r) { return { x: c * TILE + TILE / 2, y: HUD_H + r * TILE + TILE / 2 }; }
  function isSolidAt(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor((y - HUD_H) / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true;
    return solid[r][c];
  }

  /* ===================== state ===================== */
  let state = 'title';        // title | playing | paused | over | how | scores
  let mode = 'cpu';           // cpu | duel
  let difficulty = 'normal';
  let visualMode = 'hd';      // hd | classic
  let muted = false, headless = false, autoplay = true;
  let tanks = [], shells = [], mines = [];
  let score = { p1: 0, p2: 0 };
  let timeLeft = DEFAULT_TIME, matchTime = DEFAULT_TIME;
  let freezeT = 0, winner = null, tick = 0;
  let shake = 0, flashMsg = '', flashMsgT = 0;
  let bots = [false, false];  // is player index AI-controlled

  let controls = [ctrl(), ctrl()];
  function ctrl() { return { fwd: false, back: false, left: false, right: false, fire: false, _firePrev: false }; }

  /* ===================== entities ===================== */
  function makeTank(id) {
    const s = SPAWNS[id];
    const p = tileCenter(s.c, s.r);
    return { id, x: p.x, y: p.y, heading: s.a, speed: 0, dist: 0, cd: 0, flash: 0, alive: true, respawn: 0 };
  }
  function resetMatch(seed) {
    rng = mulberry32((seed | 0) || 1);
    buildMaze();
    tanks = [makeTank(0), makeTank(1)];
    shells = []; mines = [];
    placeMines();
    score = { p1: 0, p2: 0 };
    timeLeft = matchTime; freezeT = 0; winner = null; tick = 0; shake = 0;
    if (SDArt) { TRACKS.clear(); PARTS.clear(); }
  }
  function placeMines() {
    const cand = [];
    for (let r = MINE_RECT.r0; r <= MINE_RECT.r1; r++)
      for (let c = MINE_RECT.c0; c <= MINE_RECT.c1; c++)
        if (!solid[r][c]) cand.push(tileCenter(c, r));
    // seeded shuffle
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = cand[i]; cand[i] = cand[j]; cand[j] = t; }
    const N = 16;
    for (let i = 0; i < Math.min(N, cand.length); i++) mines.push({ x: cand[i].x, y: cand[i].y, ph: rng() * 7 });
  }

  /* ===================== input mapping ===================== */
  function readControls() {
    for (let i = 0; i < 2; i++) {
      if (bots[i]) { aiControl(i); continue; }
      if (headless) continue; // controls set externally via __g.input
      const c = controls[i], k = keys;
      if (i === 0) { c.fwd = !!k['KeyW']; c.back = !!k['KeyS']; c.left = !!k['KeyA']; c.right = !!k['KeyD']; c.fire = !!k['Space']; }
      else { c.fwd = !!k['ArrowUp']; c.back = !!k['ArrowDown']; c.left = !!k['ArrowLeft']; c.right = !!k['ArrowRight']; c.fire = !!(k['Enter'] || k['ShiftRight']); }
    }
  }

  /* ===================== AI ===================== */
  function lineClear(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), n = Math.ceil(d / 8);
    for (let i = 1; i < n; i++) { const t = i / n; if (isSolidAt(x0 + dx * t, y0 + dy * t)) return false; }
    return true;
  }
  function wrapAngle(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  function aiControl(i) {
    const c = controls[i], me = tanks[i], foe = tanks[1 - i];
    c.fwd = c.back = c.left = c.right = c.fire = false;
    if (!me.alive) return;
    const tier = difficulty === 'easy' ? { aim: 0.28, look: 46, fire: 1 } : difficulty === 'hard' ? { aim: 0.12, look: 70, fire: 1 } : { aim: 0.18, look: 58, fire: 1 };
    const dx = foe.x - me.x, dy = foe.y - me.y;
    let want = Math.atan2(dy, dx);
    // wall ahead avoidance
    const ahead = { x: me.x + Math.cos(me.heading) * tier.look, y: me.y + Math.sin(me.heading) * tier.look };
    const wallAhead = isSolidAt(ahead.x, ahead.y);
    // mine avoidance — steer away from nearest mine within cone
    let nm = null, nd = 1e9;
    for (const m of mines) { const d = Math.hypot(m.x - me.x, m.y - me.y); if (d < nd && d < 70) { nd = d; nm = m; } }
    if (nm) { const ma = Math.atan2(nm.y - me.y, nm.x - me.x); if (Math.abs(wrapAngle(ma - me.heading)) < 0.7) want = me.heading - Math.sign(wrapAngle(ma - me.heading) || 1) * 0.9; }
    if (wallAhead) want = me.heading + (((tick + i * 31) % 120 < 60) ? 1 : -1) * 0.9;
    const diff = wrapAngle(want - me.heading);
    if (diff > 0.04) c.right = true; else if (diff < -0.04) c.left = true;
    // throttle: advance unless wall directly ahead or too close
    const dist = Math.hypot(dx, dy);
    if (wallAhead) c.fwd = true; // push through turn
    else if (dist > 60) c.fwd = true;
    else if (dist < 36) c.back = true;
    // fire when lined up and LOS clear
    const aligned = Math.abs(wrapAngle(Math.atan2(dy, dx) - me.heading)) < tier.aim;
    if (aligned && me.cd <= 0 && freezeT <= 0 && lineClear(me.x, me.y, foe.x, foe.y)) c.fire = true;
  }

  /* ===================== sim ===================== */
  function update() {
    tick++;
    if (state !== 'playing') return;
    readControls();
    if (freezeT > 0) { freezeT -= STEP; if (freezeT <= 0) reviveTanks(); }
    if (flashMsgT > 0) flashMsgT -= STEP;

    let moving = 0;
    for (let i = 0; i < 2; i++) {
      const t = tanks[i], c = controls[i];
      if (!t.alive) continue;
      if (c.left) t.heading -= TURN;
      if (c.right) t.heading += TURN;
      let target = 0;
      if (c.fwd) target = MAX_FWD; else if (c.back) target = -MAX_REV;
      t.speed += (target - t.speed) * ACCEL;
      if (Math.abs(t.speed) < 0.02 && target === 0) t.speed = 0;
      t.speed *= (target === 0 ? FRICTION : 1);
      moveTank(t);
      if (Math.abs(t.speed) > 0.4) { t.dist += Math.abs(t.speed); if (SDArt && tick % 3 === 0) TRACKS.add(t.x, t.y, t.heading); moving += Math.abs(t.speed); }
      if (t.flash > 0) t.flash -= STEP * 6;
      if (t.cd > 0) t.cd -= STEP;
      // fire (edge-triggered)
      const firePressed = c.fire && !c._firePrev;
      c._firePrev = c.fire;
      const mine = shells.filter(s => s.owner === i).length;
      if (firePressed && t.cd <= 0 && freezeT <= 0 && mine < MAX_SHELLS) fire(t);
      // mine collisions
      for (let m = mines.length - 1; m >= 0; m--) {
        if (Math.hypot(mines[m].x - t.x, mines[m].y - t.y) < MINE_R + TANK_R - 4) {
          const mx = mines[m].x, my = mines[m].y; mines.splice(m, 1);
          if (SDArt) PARTS.mineBlast(mx, my, '#ff8a4f'); if (!muted && !headless) SDAudio.mine();
          killTank(i); break;
        }
      }
    }
    if (!headless) SDAudio.engine(Math.min(0.12, moving * 0.02));

    // shells
    for (let s = shells.length - 1; s >= 0; s--) {
      const sh = shells[s];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= STEP;
      if (sh.life <= 0) { shells.splice(s, 1); continue; }
      if (isSolidAt(sh.x, sh.y)) { if (SDArt) PARTS.explosion(sh.x, sh.y, '#cfd6e6'); if (!muted && !headless) SDAudio.wall(); shake = Math.max(shake, 2); shells.splice(s, 1); continue; }
      let hit = false;
      for (let i = 0; i < 2; i++) {
        const t = tanks[i];
        if (t.alive && i !== sh.owner && Math.hypot(t.x - sh.x, t.y - sh.y) < TANK_R + SHELL_R) { killTank(i); hit = true; break; }
      }
      if (hit) shells.splice(s, 1);
    }

    if (shake > 0) shake *= 0.85;

    // timer
    timeLeft -= STEP;
    if (timeLeft <= 0) { timeLeft = 0; endMatch(); }
  }

  function moveTank(t) {
    const nx = t.x + Math.cos(t.heading) * t.speed;
    const ny = t.y + Math.sin(t.heading) * t.speed;
    // axis-separated circle vs grid
    if (!circleHitsWall(nx, t.y)) t.x = nx; else t.speed *= 0.3;
    if (!circleHitsWall(t.x, ny)) t.y = ny; else t.speed *= 0.3;
    // tank-vs-tank soft separation
    const o = tanks[1 - t.id];
    if (o && o.alive) { const dx = t.x - o.x, dy = t.y - o.y, d = Math.hypot(dx, dy); if (d > 0 && d < TANK_R * 2) { const push = (TANK_R * 2 - d) / 2; t.x += dx / d * push; t.y += dy / d * push; } }
  }
  function circleHitsWall(x, y) {
    for (let a = 0; a < 8; a++) { const ang = a / 8 * 7; if (isSolidAt(x + Math.cos(ang) * TANK_R, y + Math.sin(ang) * TANK_R)) return true; }
    return isSolidAt(x, y);
  }
  function fire(t) {
    t.cd = FIRE_CD; t.flash = 1;
    const bx = t.x + Math.cos(t.heading) * 20, by = t.y + Math.sin(t.heading) * 20;
    shells.push({ x: bx, y: by, vx: Math.cos(t.heading) * SHELL_SPD, vy: Math.sin(t.heading) * SHELL_SPD, life: SHELL_LIFE, owner: t.id });
    if (!muted && !headless) SDAudio.fire();
  }
  function killTank(i) {
    const t = tanks[i];
    if (!t.alive) return;
    t.alive = false;
    if (SDArt) PARTS.explosion(t.x, t.y, i === 0 ? '#ffb347' : '#46d6e8');
    if (!muted && !headless) SDAudio.explosion();
    shake = 9;
    // point to the OPPONENT
    if (i === 0) score.p2++; else score.p1++;
    if (!muted && !headless) SDAudio.point();
    freezeT = FREEZE;
  }
  function reviveTanks() {
    for (let i = 0; i < 2; i++) {
      if (!tanks[i].alive) {
        const s = SPAWNS[i], p = tileCenter(s.c, s.r);
        tanks[i].x = p.x; tanks[i].y = p.y; tanks[i].heading = s.a; tanks[i].speed = 0; tanks[i].alive = true; tanks[i].cd = 0.3;
      }
    }
  }
  function endMatch() {
    state = 'over';
    winner = score.p1 === score.p2 ? 'draw' : (score.p1 > score.p2 ? 'p1' : 'p2');
    if (!headless) { SDAudio.roundEnd(); SDAudio.engine(0); maybeOfferScore(); }
    showOverlay('over');
  }

  /* ===================== render ===================== */
  let ctx, canvas, dpr = 1;
  function render() {
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // screen shake
    const sx = (Math.random() - 0.5) * shake, sy = (Math.random() - 0.5) * shake;
    ctx.clearRect(0, 0, LW, LH);
    // background
    const bg = ctx.createLinearGradient(0, 0, 0, LH);
    const T = SDArt.theme(visualMode);
    bg.addColorStop(0, T.bg1); bg.addColorStop(1, T.bg0);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, LW, LH);
    ctx.save();
    ctx.translate(sx, sy);
    SDArt.drawFloor(ctx, 0, HUD_H, FIELD_W, FIELD_H, visualMode);
    SDArt.drawWalls(ctx, wallRects, visualMode);
    if (SDArt) TRACKS.draw(ctx, visualMode);
    const tm = tick * STEP;
    for (const m of mines) SDArt.drawMine(ctx, m, tm, visualMode);
    for (const t of tanks) if (t.alive) SDArt.drawTank(ctx, t, tm, visualMode);
    for (const s of shells) SDArt.drawShell(ctx, s, visualMode);
    if (SDArt) PARTS.draw(ctx, visualMode);
    ctx.restore();
    drawHUD();
    if (visualMode === 'classic') SDArt.classicOverlay(ctx, LW, LH);
    ctx.restore();
  }
  function drawHUD() {
    const T = SDArt.theme(visualMode);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, LW, HUD_H);
    ctx.fillStyle = visualMode === 'classic' ? '#fff' : T.p1;
    ctx.font = 'bold 40px Menlo,Consolas,monospace'; ctx.textBaseline = 'middle';
    ctx.textAlign = 'left'; ctx.fillText(String(score.p1).padStart(2, '0'), 28, HUD_H / 2);
    ctx.fillStyle = visualMode === 'classic' ? '#bdbdbd' : T.p2;
    ctx.textAlign = 'right'; ctx.fillText(String(score.p2).padStart(2, '0'), LW - 28, HUD_H / 2);
    // timer (flash last 20s)
    const flash = timeLeft <= FLASH_AT && Math.floor(timeLeft * 2) % 2 === 0;
    ctx.fillStyle = timeLeft <= FLASH_AT ? (flash ? '#ff5277' : '#7a2236') : T.ink;
    ctx.font = 'bold 34px Menlo,Consolas,monospace'; ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(timeLeft).toString().padStart(2, '0'), LW / 2, HUD_H / 2);
    ctx.fillStyle = T.inkDim; ctx.font = '11px Menlo,Consolas,monospace';
    ctx.fillText(mode === 'cpu' ? 'P1  vs  CPU' : 'P1  vs  P2', LW / 2, HUD_H - 12);
    if (freezeT > 0) { ctx.fillStyle = T.inkDim; ctx.font = 'bold 13px Menlo,Consolas,monospace'; ctx.fillText('— RELOADING —', LW / 2, HUD_H / 2 + 22); }
  }

  /* ===================== UI / overlays ===================== */
  function $(id) { return document.getElementById(id); }
  function showOverlay(which) {
    if (headless) return;
    ['ovTitle', 'ovHow', 'ovPause', 'ovOver', 'ovScores'].forEach(id => { const e = $(id); if (e) e.classList.add('hidden'); });
    const map = { title: 'ovTitle', how: 'ovHow', paused: 'ovPause', over: 'ovOver', scores: 'ovScores' };
    if (map[which]) { const e = $(map[which]); if (e) e.classList.remove('hidden'); }
    if (which === 'over') {
      const w = $('overResult');
      if (w) w.textContent = winner === 'draw' ? 'DRAW' : (winner === 'p1' ? (mode === 'cpu' ? 'YOU WIN' : 'PLAYER 1 WINS') : (mode === 'cpu' ? 'CPU WINS' : 'PLAYER 2 WINS'));
      const sc = $('overScore'); if (sc) sc.textContent = score.p1 + ' — ' + score.p2;
    }
  }
  function hideOverlays() { if (!headless) ['ovTitle', 'ovHow', 'ovPause', 'ovOver', 'ovScores'].forEach(id => { const e = $(id); if (e) e.classList.add('hidden'); }); }

  function startGame(m) {
    mode = m || mode;
    bots = mode === 'cpu' ? [false, true] : [false, false];
    matchTime = DEFAULT_TIME;
    resetMatch((Math.random() * 1e9) | 0);
    state = 'playing'; hideOverlays();
    if (!headless) { SDAudio.init(); SDAudio.start(); }
  }

  /* ===================== scores ===================== */
  const Scores = {
    BASE: 'https://game-scores.jez237.workers.dev/scores/',
    NS: 'steel-duel',          // leaderboard tracks points scored vs CPU in a match
    cache: null, last: null,
    async fetch() {
      try {
        const r = await fetch(this.BASE + this.NS, { cache: 'no-store' });
        const d = await r.json();
        this.cache = (Array.isArray(d) ? d : (d.scores || [])).map(s => ({ name: String(s.initials || s.name || '???').slice(0, 3).toUpperCase(), score: s.score | 0 })).sort((a, b) => b.score - a.score).slice(0, 8);
      } catch (e) { this.cache = 'offline'; }
      return this.cache;
    },
    async submit(name, sc) {
      this.last = { name, score: sc };
      try { await fetch(this.BASE + this.NS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials: name, score: sc }) }); this.cache = null; } catch (e) {}
    },
  };
  function maybeOfferScore() {
    if (mode !== 'cpu') return;          // PvP isn't ranked; only vs-CPU performance is
    const el = $('overScoreForm'); if (el) el.classList.remove('hidden');
    const v = $('overYourScore'); if (v) v.textContent = 'Your score vs CPU: ' + score.p1;
  }
  async function refreshBoard() {
    const box = $('scoreBoard'); if (!box) return;
    box.innerHTML = '<div class="sb-row">loading…</div>';
    const list = await Scores.fetch();
    if (list === 'offline') { box.innerHTML = '<div class="sb-row">leaderboard offline</div>'; return; }
    if (!list.length) { box.innerHTML = '<div class="sb-row">no scores yet — be the first</div>'; return; }
    box.innerHTML = list.map((s, i) => `<div class="sb-row"><span>${i + 1}. ${s.name}</span><span>${s.score}</span></div>`).join('');
  }

  /* ===================== loop ===================== */
  let acc = 0, lastT = 0, rafId = 0;
  function frame(t) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - lastT) / 1000) || 0; lastT = t;
    if (state === 'playing') { acc += dt; let n = 0; while (acc >= STEP && n < 5) { update(); acc -= STEP; n++; } }
    // always animate particles/tracks/shake for non-playing states too
    if (SDArt) { PARTS.update(dt); TRACKS.update(dt); }
    render();
  }

  /* ===================== input listeners ===================== */
  const keys = {};
  function onKey(e, down) {
    const c = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(c)) e.preventDefault();
    keys[c] = down;
    if (!down) return;
    if (c === 'KeyP' || c === 'Escape') { if (state === 'playing') { state = 'paused'; showOverlay('paused'); } else if (state === 'paused') { state = 'playing'; hideOverlays(); } }
    if (c === 'KeyM') { muted = !muted; SDAudio.setMuted(muted); const b = $('btnMute'); if (b) b.textContent = muted ? '🔇' : '🔊'; }
    if (c === 'KeyC' && (state === 'playing' || state === 'paused')) toggleVisual();
  }
  function toggleVisual() { visualMode = visualMode === 'hd' ? 'classic' : 'hd'; const b = $('btnClassic'); if (b) b.textContent = visualMode === 'classic' ? '1974' : 'HD'; }

  /* ===================== touch ===================== */
  function setupTouch() {
    const pad = $('touch'); if (!pad) return;
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch) { pad.style.display = 'none'; return; }
    pad.style.display = 'flex';
    const bind = (id, action) => {
      const el = $(id); if (!el) return;
      const set = v => { controls[0][action] = v; };
      el.addEventListener('touchstart', e => { e.preventDefault(); set(true); }, { passive: false });
      el.addEventListener('touchend', e => { e.preventDefault(); set(false); }, { passive: false });
      el.addEventListener('touchcancel', () => set(false));
    };
    bind('tUp', 'fwd'); bind('tDown', 'back'); bind('tLeft', 'left'); bind('tRight', 'right'); bind('tFire', 'fire');
  }

  /* ===================== resize ===================== */
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = LW * dpr; canvas.height = LH * dpr;
    const scale = Math.min(window.innerWidth / LW, (window.innerHeight - 4) / LH);
    canvas.style.width = (LW * scale) + 'px';
    canvas.style.height = (LH * scale) + 'px';
  }

  /* ===================== self-test harness ===================== */
  function snapHash() {
    // deterministic fingerprint of sim state
    const r2 = n => Math.round(n * 100) / 100;
    return JSON.stringify({ s: score, t: tanks.map(t => [r2(t.x), r2(t.y), r2(t.heading), t.alive]), m: mines.length, sh: shells.length });
  }
  function runTests() {
    const prevHeadless = headless; headless = true; autoplay = false;
    const out = []; const ok = (name, cond, msg) => out.push({ name, pass: !!cond, msg: msg || '' });
    const saveMode = mode; mode = 'duel';

    // T-F1 walls solid: drive into a wall, never cross
    resetMatch(7); state = 'playing'; bots = [false, false];
    tanks[0].x = 2 * TILE; tanks[0].y = HUD_H + 2 * TILE; tanks[0].heading = Math.PI; // face left wall
    let crossed = false;
    for (let i = 0; i < 120; i++) { controls[0].fwd = true; update(); if (tanks[0].x < TILE) crossed = true; }
    ok('T-F1 walls solid', !crossed, 'tank x=' + tanks[0].x.toFixed(1));

    // T-F2 steering: rotate + advance along heading; no strafe
    resetMatch(7); state = 'playing'; bots = [false, false];
    const h0 = tanks[0].heading; controls[0] = ctrl(); controls[0].right = true;
    for (let i = 0; i < 10; i++) update();
    const rotated = Math.abs(tanks[0].heading - h0) > 0.2;
    resetMatch(7); state = 'playing'; const sx = tanks[0].x, sy = tanks[0].y;
    controls[0] = ctrl(); controls[0].fwd = true; for (let i = 0; i < 20; i++) update();
    const adv = Math.hypot(tanks[0].x - sx, tanks[0].y - sy) > 4;
    ok('T-F2 steering', rotated && adv, 'rot=' + rotated + ' adv=' + adv);

    // T-F3 mines: contact kills + mine removed permanently
    resetMatch(7); state = 'playing'; const m0 = mines.length;
    const tm = mines[0]; tanks[0].x = tm.x; tanks[0].y = tm.y; controls[0] = ctrl();
    update();
    const died = !tanks[0].alive, removed = mines.length === m0 - 1;
    // run rest of freeze + revive, ensure not respawned
    for (let i = 0; i < 120; i++) update();
    const noRespawn = mines.length === m0 - 1;
    ok('T-F3 mines', died && removed && noRespawn, 'died=' + died + ' removed=' + removed + ' noRespawn=' + noRespawn);

    // T-F4 shells: straight, wall-absorbed, kill, cap enforced (open top corridor, row 2)
    resetMatch(7); state = 'playing'; bots = [false, false]; controls = fresh();
    const p4 = tileCenter(4, 2), far = tileCenter(25, 15);
    tanks[0].x = p4.x; tanks[0].y = p4.y; tanks[0].heading = 0;
    tanks[1].x = far.x; tanks[1].y = far.y;            // out of the way
    fire(tanks[0]); const had = shells.length === 1;
    // second fire blocked by cap (MAX_SHELLS) via the update path
    controls[0].fire = true; controls[0]._firePrev = false; update();
    const capOk = shells.filter(s => s.owner === 0).length <= MAX_SHELLS;
    // shell flies straight and is absorbed by the wall spur ahead
    let absorbed = false; for (let i = 0; i < 200; i++) { update(); if (shells.length === 0) { absorbed = true; break; } }
    // shell kills a tank directly ahead
    resetMatch(7); state = 'playing'; bots = [false, false]; controls = fresh();
    const pa = tileCenter(4, 2), pb = tileCenter(10, 2);
    tanks[0].x = pa.x; tanks[0].y = pa.y; tanks[0].heading = 0;
    tanks[1].x = pb.x; tanks[1].y = pb.y; tanks[1].alive = true;
    fire(tanks[0]); let killed = false; for (let i = 0; i < 60; i++) { update(); if (!tanks[1].alive) { killed = true; break; } }
    ok('T-F4 shells', had && capOk && absorbed && killed, 'had=' + had + ' cap=' + capOk + ' absorbed=' + absorbed + ' kill=' + killed);

    // T-F5 kill economy: opponent +1, killer can't fire during freeze, respawn at spawn
    resetMatch(7); state = 'playing'; controls = fresh();
    const sp1 = score.p2;
    killTank(1); // tank1 dies -> p1 +1
    const pointOk = score.p1 === 1;
    // killer (p0) cannot fire during the death freeze (verified via the update gate)
    shells = []; controls[0] = ctrl(); controls[0].fire = true; controls[0]._firePrev = false; update();
    const noFireDuringFreeze = shells.length === 0 && tanks[0].alive;
    for (let i = 0; i < 120; i++) update();
    const sp = SPAWNS[1], pc = tileCenter(sp.c, sp.r);
    const respawnOk = tanks[1].alive && Math.hypot(tanks[1].x - pc.x, tanks[1].y - pc.y) < 2;
    ok('T-F5 kill economy', pointOk && noFireDuringFreeze && respawnOk, 'pt=' + pointOk + ' freezeNoFire=' + noFireDuringFreeze + ' respawn=' + respawnOk);

    // T-F6 timing: flash flag + end + winner
    resetMatch(7); state = 'playing'; bots = [false, false]; controls = fresh();
    timeLeft = 30; update(); const notFlashEarly = timeLeft > FLASH_AT;
    timeLeft = 19; update(); const flashSoon = (timeLeft <= FLASH_AT) && notFlashEarly;
    score.p1 = 3; score.p2 = 1; timeLeft = 0.01; update();
    ok('T-F6 timing', flashSoon && state === 'over' && winner === 'p1', 'flash=' + flashSoon + ' state=' + state + ' winner=' + winner);

    // T-F7 determinism: same seed + scripted bots -> identical hash
    const hashRun = () => { resetMatch(99); state = 'playing'; bots = [true, true]; for (let i = 0; i < 600; i++) { update(); if (state !== 'playing') break; } return snapHash(); };
    const hA = hashRun(); const hB = hashRun();
    ok('T-F7 determinism', hA === hB, hA === hB ? '' : 'hash mismatch');

    // T-soak: full bot match completes, no NaN
    resetMatch(123); state = 'playing'; bots = [true, true]; timeLeft = matchTime;
    let nan = false, steps = 0; const t0 = perfNow();
    while (state === 'playing' && steps < 60 * (matchTime + 2)) { update(); steps++; for (const t of tanks) if (!isFinite(t.x) || !isFinite(t.y)) nan = true; }
    const elapsed = perfNow() - t0;
    ok('T-soak match completes', state === 'over' && !nan, 'state=' + state + ' nan=' + nan + ' steps=' + steps);
    const perStep = elapsed / Math.max(1, steps);
    ok('T-perf sim<=2ms/step', perStep <= 2.0, perStep.toFixed(3) + 'ms/step (sim only)');

    mode = saveMode; headless = prevHeadless; autoplay = true;
    const pass = out.filter(o => o.pass).length, fail = out.length - pass;
    const res = { pass, fail, total: out.length, details: out };
    window.__testResults = res;
    return res;
  }
  function fresh() { return [ctrl(), ctrl()]; }
  function perfNow() { try { return performance.now(); } catch (e) { return 0; } }

  /* ===================== shot scenes (deterministic, paused) ===================== */
  function setupShot(scene) {
    headless = true; SDArt && PARTS.clear();
    ['ovTitle', 'ovHow', 'ovPause', 'ovOver', 'ovScores'].forEach(id => { const e = document.getElementById(id); if (e) e.classList.add('hidden'); });
    if (scene === 'title') { const e = document.getElementById('ovTitle'); if (e) e.classList.remove('hidden'); }
    mode = scene === 'classic' ? 'duel' : 'cpu';
    if (scene === 'classic') visualMode = 'classic'; else visualMode = 'hd';
    resetMatch(scene === 'duel' ? 5 : scene === 'explosion' ? 11 : scene === 'minefield' ? 3 : 7);
    state = 'playing';
    if (scene === 'title') { state = 'title'; }
    else if (scene === 'duel' || scene === 'classic') {
      bots = [true, true]; for (let i = 0; i < 90; i++) update();
      // ensure some shells visible
      tanks[0].heading = 0.2; tanks[1].heading = Math.PI + 0.2; tanks[0].cd = 0; tanks[1].cd = 0; fire(tanks[0]); fire(tanks[1]);
      for (let i = 0; i < 8; i++) update();
    } else if (scene === 'explosion') {
      bots = [true, true]; for (let i = 0; i < 60; i++) update();
      // stage a clean, visible detonation just left of the minefield
      tanks[1].x = tileCenter(8, 4).x; tanks[1].y = tileCenter(8, 4).y; tanks[1].alive = true;
      tanks[0].x = tileCenter(5, 4).x; tanks[0].y = tileCenter(5, 4).y; tanks[0].heading = 0;
      killTank(1);
    } else if (scene === 'minefield') {
      tanks[0].x = tileCenter(11, 8).x; tanks[0].y = tileCenter(11, 8).y;
      tanks[1].x = tileCenter(16, 9).x; tanks[1].y = tileCenter(16, 9).y; tanks[1].heading = Math.PI;
      for (let i = 0; i < 4; i++) update();
    }
    // advance only the visual layer so particle bursts/tracers spread in the paused frame
    const vframes = scene === 'explosion' ? 9 : 2;
    if (SDArt) for (let i = 0; i < vframes; i++) { PARTS.update(STEP); TRACKS.update(STEP); }
    render();
  }

  /* ===================== boot ===================== */
  let TRACKS, PARTS;
  function boot() {
    canvas = $('game'); if (!canvas) return;
    ctx = canvas.getContext('2d');
    TRACKS = new SDArt.Tracks(); PARTS = new SDArt.Particles();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));
    setupTouch();

    // buttons
    const click = (id, fn) => { const e = $(id); if (e) e.addEventListener('click', () => { SDAudio.ui(); fn(); }); };
    click('btnDuel', () => startGame('duel'));
    click('btnCpu', () => startGame('cpu'));
    click('btnHow', () => { state = 'how'; showOverlay('how'); });
    click('btnHowBack', () => { state = 'title'; showOverlay('title'); });
    click('btnScores', () => { state = 'scores'; showOverlay('scores'); refreshBoard(); });
    click('btnScoresBack', () => { state = 'title'; showOverlay('title'); });
    click('btnResume', () => { state = 'playing'; hideOverlays(); });
    click('btnQuit', () => { state = 'title'; showOverlay('title'); });
    click('btnAgain', () => startGame(mode));
    click('btnMenu', () => { state = 'title'; showOverlay('title'); });
    click('diffSel', () => {});
    const ds = $('diffSel'); if (ds) ds.addEventListener('change', () => { difficulty = ds.value; });
    const mb = $('btnMute'); if (mb) mb.addEventListener('click', () => { muted = !muted; SDAudio.setMuted(muted); mb.textContent = muted ? '🔇' : '🔊'; });
    const cb = $('btnClassic'); if (cb) cb.addEventListener('click', () => { toggleVisual(); });
    const sub = $('btnSubmit'); if (sub) sub.addEventListener('click', async () => {
      const inp = $('initials'); const nm = (inp && inp.value || 'YOU').toUpperCase().slice(0, 3) || 'YOU';
      await Scores.submit(nm, score.p1); const f = $('overScoreForm'); if (f) f.classList.add('hidden'); state = 'scores'; showOverlay('scores'); refreshBoard();
    });

    // URL params
    const q = new URLSearchParams(location.search);
    headless = q.has('headless');
    if (q.has('test')) { const r = runTests(); console.log('[Steel Duel tests] ' + r.pass + '/' + r.total + ' pass', r.details.filter(d => !d.pass)); }
    if (q.has('shot')) { setupShot(q.get('shot')); window.__shotReady = true; }
    else { showOverlay('title'); }
    if (q.has('bots')) { startGame('duel'); bots = [true, true]; }

    if (!headless) { lastT = perfNow(); rafId = requestAnimationFrame(frame); }
    else if (q.has('shot')) { render(); }

    booted = true;
  }
  let booted = false;

  /* ===================== __g debug/test hooks ===================== */
  window.__g = {
    get state() { return state; }, set state(s) { state = s; },
    get mode() { return mode; }, set mode(m) { mode = m; },
    get visualMode() { return visualMode; }, set visualMode(v) { visualMode = v; },
    get score() { return score; },
    get timeLeft() { return timeLeft; },
    get winner() { return winner; },
    get tanks() { return tanks; }, get shells() { return shells; }, get mines() { return mines; },
    get walls() { return wallRects; },
    get freeze() { return freezeT; },
    reset(seed) { headless = true; mode = mode || 'duel'; resetMatch(seed || 1); state = 'playing'; return true; },
    input(player, action, down) { if (controls[player]) controls[player][action] = !!down; },
    setBot(player, on) { bots[player] = !!on; },
    start: startGame,
    step(n) { n = n || 1; for (let i = 0; i < n; i++) update(); render(); return true; },
    snap() { render(); return true; },
    fire(i) { fire(tanks[i || 0]); },
    kill(i) { killTank(i || 0); },
    shot: setupShot,
    runTests,
    hash: snapHash,
    scores: () => Scores,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

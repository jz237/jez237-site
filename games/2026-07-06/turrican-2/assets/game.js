/* Shard Assault : game.js
 * Main loop, state machine, stage progression, menus, touch, QA hooks.
 */
(function () {
  'use strict';
  const D = window.TData, E = window.TEngine, R = window.TRender, A = window.TAudio, I = window.TInput;

  const display = document.getElementById('game');
  const DW = 960, DH = 540;
  // DPR-aware backing store: everything draws in 960x540 logical units
  const DPR = Math.min(4, Math.max(2, (window.innerWidth / DW) * (window.devicePixelRatio || 1)));
  display.width = DW * DPR; display.height = DH * DPR;
  const dx = display.getContext('2d');
  dx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const renderer = R.createRenderer(display);
  const audio = A.createAudio();
  const input = I.createInput(window);

  // painted title key-art (async; procedural scene is the fallback until ready)
  const titleImg = new Image();
  let titleReady = false;
  titleImg.onload = () => { titleReady = true; };
  if (!renderer.renderTitle) titleImg.src = 'assets/img/crystalline-canyon.png';

  const STAGES_PER_WORLD = D.STAGES_PER_WORLD; // faithful blueprint: 5 worlds / 11 stages
  const PLAN = [];
  for (let w = 0; w < STAGES_PER_WORLD.length; w++)
    for (let s = 0; s < STAGES_PER_WORLD[w]; s++) PLAN.push({ world: w, stage: s });

  let qaHold = false;
  let mode = 'title';        // title | worlds | scores | options | intro | playing | paused | stageclear | gameover | entername | win
  let state = null;          // engine state
  let planIdx = 0;
  let carry = null;
  let acc = 0, last = 0;
  let uiT = 0, frameDt = 0, lastPaused = false, titleVoiced = false;
  const uiSound = (n) => (audio.ui ? audio.ui(n) : audio.play(n === 'move' ? 'gem' : n === 'adjust' ? 'shoot' : 'power'));
  const toTitleAudio = () => { if (audio.stopScene) audio.stopScene(); audio.startMusic('title'); };
  let stageClearT = 0;
  let voiceToast = null;     // { text, t }
  audio.onVoiceToast((text) => { voiceToast = { text, t: 2.6 }; });

  // ---- settings (persisted) ------------------------------------------------
  const SETTINGS_KEY = 'turrican2_hd_settings_v2';
  const settings = Object.assign(
    { master: 1, music: 1, sfx: 1, voice: 1, crt: false, difficulty: 'normal', speed: D.DEFAULT_SPEED },
    (() => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; } })());
  if (!D.SPEEDS.includes(settings.speed)) settings.speed = D.DEFAULT_SPEED;
  const pctLabel = (v) => Math.round(v * 100) + '%';
  function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {} }
  function applySettings() {
    audio.setLevels(settings.master * settings.music, settings.master * settings.sfx);
    audio.setVoiceLevel(settings.master * settings.voice);
    renderer.setCRT(!!settings.crt);
  }
  let menuIdx = 0, optIdx = 0, pauseIdx = 0, worldIdx = 0;
  let introT = 0;            // stage intro card timer
  let continues = 3;
  let newBest = false;
  let stageCarry = null;     // snapshot at stage entry (for RESTART STAGE)
  let stageTime = 0;         // real seconds spent playing this stage
  let results = null;        // the stage just cleared: crystals, secrets, time, medal

  // ---- campaign progress (persisted): worlds opened, best medal per stage --
  const PROGRESS_KEY = 'shard.progress.v1';
  const progress = Object.assign({ world: 0, medals: {} },
    (() => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch (e) { return {}; } })());
  function saveProgress() { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {} }
  const firstStageOf = (w) => PLAN.findIndex(p => p.world === w);
  // a run started further in gets the kit a trooper would carry by then
  const LOADOUT = [
    { spread: 1, beam: 0, bounce: 0 }, { spread: 2, beam: 1, bounce: 0 }, { spread: 2, beam: 1, bounce: 1 },
    { spread: 2, beam: 2, bounce: 1 }, { spread: 3, beam: 2, bounce: 2 },
  ];
  const MEDALS = [null, { name: 'BRONZE', color: '#e0955a' }, { name: 'SILVER', color: '#d9e4f2' }, { name: 'GOLD', color: '#ffd23f' }];
  // where this run began: only full runs from World 1 post to the world board
  let run = { from: 0, takeover: false };
  const postsWorld = () => run.from === 0 && !run.takeover;

  // ---- attract mode (the autopilot demo) -----------------------------------
  // Boots to the title; if nobody touches anything, the demo pilot plays the
  // whole campaign, then hands the title back and waits to do it again. Fire,
  // jump or start takes over the run from that exact spot; any other input
  // drops the player back to the menu.
  const ATTRACT_IDLE = 4;   // seconds of quiet on the title before the demo runs
  const DEMO_DIFF = 'normal';
  let isDemo = false, pilot = null, demoAbort = false, idleT = 0, demoRetry = 0, winT = 0;
  const canDemo = () => !!(window.TDemo && window.TDemo.createPilot);
  const grabbed = (i) => i.startPressed || i.firePressed || i.jumpPressed || i.pausePressed ||
    i.leftPressed || i.rightPressed || i.upPressed || i.downPressed ||
    i.morphPressed || i.switchPressed || i.bombPressed || i.linePressed;
  // Keyboard players can leave attract mode; touch viewers use the Take over / Play button.
  const TAKE_KEYS = new Set([...input.MAP.fire, ...input.MAP.jump, ...input.MAP.start]);
  window.addEventListener('keydown', (e) => { if (isDemo && !TAKE_KEYS.has(e.code)) demoAbort = true; });
  const canTakeOver = () => isDemo && (mode === 'playing' || mode === 'intro') && !!state;

  function startDemo() {
    qaHold = false;
    if (!canDemo()) return;
    isDemo = true; demoAbort = false; demoRetry = 0; winT = 0;
    document.body.dataset.demo = 'true';
    D.setSpeed(D.DEFAULT_SPEED);   // the pilot's jump tables are tuned at the default speed
    pilot = window.TDemo.createPilot();
    audio.rollVoice();
    planIdx = 0; continues = 0; newBest = false;
    carry = { lives: 3, score: 0, gems: 0, weapons: { spread: 2, beam: 2, bounce: 2 },
      weapon: 'spread', bombs: 3, lines: 3 };
    loadStage();
  }
  function endDemo() {
    isDemo = false; pilot = null; demoAbort = false; idleT = 0;
    document.body.dataset.demo = 'false';
    mode = 'title'; menuIdx = 0;
    toTitleAudio();
  }
  // a viewer grabs the controls mid-demo: the run carries on as theirs
  function takeOver() {
    isDemo = false; pilot = null; demoAbort = false; idleT = 0;
    document.body.dataset.demo = 'false';
    run = { from: PLAN[planIdx].world, takeover: true };
    continues = 3; newBest = false;
    D.setSpeed(settings.speed);
    audio.resume(); uiSound('start');
    voiceToast = { text: 'You have control', t: 2.4 };
  }
  // the pilot ran out of lives: re-arm quietly and keep the show on the road
  function demoWiped() {
    if (++demoRetry > 2) { demoRetry = 0; planIdx++; }
    if (planIdx >= PLAN.length) { endDemo(); return; }
    const base = stageCarry ? JSON.parse(JSON.stringify(stageCarry)) : {};
    carry = Object.assign(base, { lives: 3, energy: 100 });
    loadStage();
  }

  // ---- high scores: this device's top 5 + the world top 10 ---------------
  const HISCORE_KEY = 'turrican2_hiscores_v1';
  const LB_URL = 'https://game-scores.jez237.workers.dev/scores/shard-assault-v1';
  const NAME_KEY = 'turrican2_initials_v1';
  const NAME_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let globalScores = null, globalFetchedAt = -1e9;
  let pendingScore = null;          // the run that just ended, waiting on initials
  let nameBuf = ['A', 'A', 'A'], nameIdx = 0, nameTyped = false;
  let scoresHi = null;              // the row to highlight on the scores screen
  function loadScores() {
    try { return JSON.parse(localStorage.getItem(HISCORE_KEY)) || []; } catch (e) { return []; }
  }
  function cleanInitials(raw) {
    return String(raw || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
  }
  const cleanStage = (v) => (/^[0-9A-Z-]{1,6}$/.test(String(v)) ? String(v) : '');
  async function fetchGlobalScores(force) {
    if (!force && performance.now() - globalFetchedAt < 30000) return;
    globalFetchedAt = performance.now();
    try {
      const res = await fetch(LB_URL, AbortSignal.timeout ? { signal: AbortSignal.timeout(5000) } : {});
      if (!res.ok) return;
      const rows = await res.json();
      if (Array.isArray(rows)) globalScores = rows.filter(r => r && Number.isFinite(r.score)).slice(0, 10);
    } catch (e) {}
  }
  async function submitGlobalScore(initials, e) {
    try {
      await fetch(LB_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials, score: e.score, stage: e.stage, diff: e.diff, speed: Math.round(e.speed * 100) }),
      });
    } catch (err) {}
    fetchGlobalScores(true);
  }
  const beatsBest = (score) => score > 0 && score > ((loadScores()[0] || {}).score || 0);
  const makesWorldBoard = (score) => !globalScores || globalScores.length < 10 || score > globalScores[9].score;
  // the run is over: initials for the world board, else straight to the device list
  function endRun(label) {
    const score = state ? state.player.score : 0;
    pendingScore = { score, stage: label, diff: settings.difficulty, speed: D.SPEED, from: run.from, takeover: run.takeover };
    if (score > 0 && postsWorld() && makesWorldBoard(score)) {
      nameBuf = cleanInitials(localStorage.getItem(NAME_KEY) || 'AAA').padEnd(3, 'A').split('');
      nameIdx = 0; mode = 'entername'; uiSound('select');
      return;
    }
    recordScore(null);
  }
  function recordScore(initials) {
    const e = pendingScore; pendingScore = null; scoresHi = null;
    if (e && e.score > 0) {
      const row = { score: e.score, stage: e.stage, diff: e.diff, speed: e.speed, from: e.from, name: initials || '', t: Date.now() };
      const scores = loadScores();
      scores.push(row);
      scores.sort((a, b) => b.score - a.score);
      try { localStorage.setItem(HISCORE_KEY, JSON.stringify(scores.slice(0, 5))); } catch (err) {}
      if (initials) {
        try { localStorage.setItem(NAME_KEY, initials); } catch (err) {}
        submitGlobalScore(initials, e);
        scoresHi = { score: e.score, initials };
      }
    }
    if (scoresHi) mode = 'scores';
    else { mode = 'title'; toTitleAudio(); }
  }
  function stageLabel() {
    const p = PLAN[Math.min(planIdx, PLAN.length - 1)];
    return (p.world + 1) + '-' + (p.stage + 1);
  }

  function drawVoiceToast(dt) {
    if (!voiceToast) return;
    voiceToast.t -= dt;
    if (voiceToast.t <= 0) { voiceToast = null; return; }
    const a = Math.min(1, voiceToast.t / 0.4);
    dx.save();
    dx.globalAlpha = a * 0.92;
    dx.font = 'bold 15px "Trebuchet MS", system-ui, sans-serif';
    dx.textAlign = 'left'; dx.textBaseline = 'middle';
    const txt = '📡 ' + voiceToast.text;
    const wpx = dx.measureText(txt).width + 24;
    dx.fillStyle = 'rgba(6,8,22,0.75)';
    dx.fillRect(14, DH - 52, wpx, 30);
    dx.strokeStyle = 'rgba(108,243,255,0.5)'; dx.lineWidth = 1;
    dx.strokeRect(14.5, DH - 51.5, wpx - 1, 29);
    dx.fillStyle = '#bfefff';
    dx.fillText(txt, 26, DH - 37);
    dx.restore();
  }

  function newRun(world) {
    world = world || 0;
    qaHold = false;
    uiSound('start');
    audio.rollVoice();   // a different announcer voice every game
    D.setSpeed(settings.speed);
    planIdx = firstStageOf(world);
    run = { from: world, takeover: false };
    continues = 3;
    newBest = false;
    carry = { lives: 3, score: 0, gems: 0, weapons: Object.assign({}, LOADOUT[world]), weapon: 'spread', bombs: 2, lines: 3 };
    loadStage();
    audio.playVoice('start', true);
  }
  function loadStage() {
    const p = PLAN[planIdx];
    const level = D.buildLevel(p.world, p.stage);
    if (carry) carry.energy = 100;
    stageCarry = JSON.parse(JSON.stringify(carry));
    stageTime = 0;
    state = E.createGame(level, carry, { difficulty: isDemo ? DEMO_DIFF : settings.difficulty });
    if (isDemo && pilot) pilot.reset(state);   // the pilot maps the stage during the load pause
    renderer.setLevel(level);
    audio.startMusic(level.world);
    if (audio.setScene) audio.setScene(level.world, level.type);
    if (p.stage === 0 && planIdx > 0) audio.playVoice('world' + level.world, true);
    if (level.type === 'shmup' && p.stage === 0) setTimeout(() => { if (state && state.level === level) audio.playVoice('shmup'); }, 2300);
    mode = 'intro'; introT = 2.0;
    window.__tState = state;
  }
  function useContinue() {
    continues--;
    const pl = state.player;
    carry = { lives: 3, score: pl.score, gems: pl.gems, weapons: pl.weapons,
      weapon: pl.weapon, bombs: 2, lines: 3, energy: 100 };
    loadStage();
  }
  // crystals against what the stage lets a trooper reach, secrets opened, time
  function stageResults() {
    const st = state.stats, lvl = state.level;
    const total = D.REACH[planIdx] || lvl.entities.filter(e => e.type === 'gem').length;
    const gems = Math.min(st.gems, total), pct = total ? gems / total : 1;
    const medal = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.45 ? 1 : 0;
    const r = { gems, total, pct, medal, secrets: Object.keys(st.found).length, secretsTotal: lvl.secrets || 0,
      time: stageTime, deaths: st.deaths, best: false };
    if (!isDemo && medal > (progress.medals[planIdx] || 0)) { progress.medals[planIdx] = medal; r.best = true; }
    return r;
  }
  function nextStage() {
    // carry stats forward
    const p = state.player;
    results = stageResults();
    carry = { lives: p.lives, score: p.score, gems: p.gems, weapons: p.weapons,
      weapon: p.weapon, bombs: p.bombs, lines: p.lines, energy: 100 };
    planIdx++;
    demoRetry = 0;
    if (!isDemo && planIdx < PLAN.length) progress.world = Math.max(progress.world, PLAN[planIdx].world);   // reaching a world opens it
    if (!isDemo) saveProgress();
    if (planIdx >= PLAN.length) {
      mode = 'win'; winT = 0; audio.stopMusic(); audio.play('victory'); audio.playVoice('victory', true);
      newBest = isDemo ? false : beatsBest(p.score);   // the demo doesn't get a high score
      return;
    }
    mode = 'stageclear'; stageClearT = STAGECLEAR_T; audio.play('complete'); audio.playVoice('clear');
  }
  const STAGECLEAR_T = 4.4;

  // ---- main loop ----------------------------------------------------------
  let lastInp = null;   // last merged input frame (keyboard+touch+pad) — QA hook
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!last) last = ts;
    let dt = (ts - last) / 1000; last = ts; if (dt > 0.1) dt = 0.1;
    uiT += dt; frameDt = dt;
    if (audio.setPaused && (mode === 'paused') !== lastPaused) { lastPaused = mode === 'paused'; audio.setPaused(lastPaused); }

    const inp = input.frame();
    lastInp = inp;
    perfWatch(dt);
    // global keys
    if (inp.mutePressed) audio.toggleMute();

    // the demo yields the moment a human touches anything: fire, jump or start takes the run over
    if (isDemo && canTakeOver() && !demoAbort && (inp.firePressed || inp.jumpPressed || inp.startPressed)) takeOver();
    else if (isDemo && (demoAbort || grabbed(inp))) { endDemo(); drawTitle(); return; }

    if (mode === 'title') {
      const N = MENU.length;
      if (inp.upPressed) { menuIdx = (menuIdx + N - 1) % N; uiSound('move'); }
      if (inp.downPressed) { menuIdx = (menuIdx + 1) % N; uiSound('move'); }
      if (inp.startPressed || inp.firePressed) {
        audio.resume();
        const pick = MENU[menuIdx];
        if (pick === 'START MISSION') newRun(0);
        else if (pick === 'SELECT WORLD') { mode = 'worlds'; worldIdx = Math.min(progress.world, 4); }
        else if (pick === 'WATCH DEMO') startDemo();
        else if (pick === 'HIGH SCORES') { mode = 'scores'; scoresHi = null; fetchGlobalScores(true); }
        else { mode = 'options'; optIdx = 0; }
        uiSound('select');
        idleT = 0;
      } else if (grabbed(inp)) {
        idleT = 0;                                   // somebody's there — hold the attract off
      } else {
        idleT += dt;
        if (idleT > ATTRACT_IDLE && canDemo()) startDemo();
      }
      if (mode === 'title') drawTitle();
      return;
    }
    if (mode === 'worlds') {
      const N = D.WORLDS.length + 1;   // five worlds + back
      if (inp.upPressed) { worldIdx = (worldIdx + N - 1) % N; uiSound('move'); }
      if (inp.downPressed) { worldIdx = (worldIdx + 1) % N; uiSound('move'); }
      if (inp.pausePressed || ((inp.startPressed || inp.firePressed) && worldIdx === N - 1)) { mode = 'title'; uiSound('back'); }
      else if (inp.startPressed || inp.firePressed) {
        if (worldIdx <= progress.world) { audio.resume(); newRun(worldIdx); }
        else uiSound('back');
      }
      if (mode === 'worlds') drawWorlds();
      return;
    }
    if (mode === 'scores') {
      fetchGlobalScores();
      if (inp.pausePressed || inp.startPressed || inp.firePressed) { mode = 'title'; uiSound('back'); if (scoresHi) toTitleAudio(); scoresHi = null; }
      if (mode === 'scores') drawScores();
      return;
    }
    if (mode === 'entername') {
      if (nameTyped) nameTyped = false;          // a typed letter this frame: its key may double as a game key
      else {
        const k = NAME_CHARS.indexOf(nameBuf[nameIdx]);
        if (inp.upPressed) { nameBuf[nameIdx] = NAME_CHARS[(k + 1) % NAME_CHARS.length]; uiSound('move'); }
        if (inp.downPressed) { nameBuf[nameIdx] = NAME_CHARS[(k + NAME_CHARS.length - 1) % NAME_CHARS.length]; uiSound('move'); }
        if (inp.leftPressed) { nameIdx = Math.max(0, nameIdx - 1); uiSound('move'); }
        if (inp.rightPressed) { nameIdx = Math.min(2, nameIdx + 1); uiSound('move'); }
        if (inp.startPressed || (inp.firePressed && nameIdx === 2)) { uiSound('select'); recordScore(nameBuf.join('')); }
        else if (inp.firePressed) { nameIdx++; uiSound('adjust'); }
        else if (inp.pausePressed) { uiSound('back'); recordScore(null); }
      }
      if (mode === 'entername') { renderer.render(state, 0); drawEnterName(); }
      return;
    }
    if (mode === 'options') {
      const ROWS = 8; // master, music, sfx, voice, difficulty, speed, crt, back
      if (inp.upPressed) { optIdx = (optIdx + ROWS - 1) % ROWS; uiSound('move'); }
      if (inp.downPressed) { optIdx = (optIdx + 1) % ROWS; uiSound('move'); }
      const adj = (inp.leftPressed ? -1 : 0) + (inp.rightPressed ? 1 : 0);
      const clamp01 = (v) => Math.max(0, Math.min(1, Math.round(v * 10) / 10));
      if (adj !== 0) {
        if (optIdx === 0) settings.master = clamp01(settings.master + adj * 0.1);
        else if (optIdx === 1) settings.music = clamp01(settings.music + adj * 0.1);
        else if (optIdx === 2) settings.sfx = clamp01(settings.sfx + adj * 0.1);
        else if (optIdx === 3) settings.voice = clamp01(settings.voice + adj * 0.1);
        else if (optIdx === 4) {
          const order = ['easy', 'normal', 'hard'];
          const i = order.indexOf(settings.difficulty);
          settings.difficulty = order[(i + adj + 3) % 3];
        } else if (optIdx === 5) {
          const i = D.SPEEDS.indexOf(settings.speed), n = D.SPEEDS.length;
          settings.speed = D.SPEEDS[Math.max(0, Math.min(n - 1, i + adj))];
        } else if (optIdx === 6) settings.crt = !settings.crt;
        applySettings(); saveSettings(); uiSound('adjust');
      }
      if (inp.startPressed || inp.firePressed) {
        if (optIdx === 6) { settings.crt = !settings.crt; applySettings(); saveSettings(); uiSound('adjust'); }
        else if (optIdx === 7) { mode = 'title'; uiSound('select'); }
      }
      if (inp.pausePressed) { mode = 'title'; uiSound('back'); }
      drawOptions();
      return;
    }
    if (mode === 'gameover') {
      if (inp.startPressed && continues > 0) { audio.resume(); useContinue(); return; }
      if (inp.pausePressed || (inp.startPressed && continues <= 0)) { endRun(stageLabel()); return; }
      renderer.render(state, 0);
      drawGameOver();
      drawVoiceToast(dt);
      return;
    }
    if (mode === 'win') {
      if (isDemo) { winT += dt; if (winT > 9) { endDemo(); drawTitle(); return; } }
      else if (inp.startPressed) { endRun('CLEAR'); return; }
      renderer.render(state, 0);
      drawWin();
      drawVoiceToast(dt);
      if (isDemo) drawDemoTag();
      return;
    }
    if (mode === 'intro') {
      introT -= dt;
      renderer.render(state, dt * D.SPEED); if (audio.update) audio.update(state, dt);
      drawIntroCard();
      if (introT <= 0 || (!isDemo && inp.startPressed)) mode = 'playing';
      drawVoiceToast(dt);
      if (isDemo) drawDemoTag();
      return;
    }
    if (mode === 'stageclear') {
      stageClearT -= dt;
      renderer.render(state, dt * D.SPEED); if (audio.update) audio.update(state, dt);
      drawStageClear();
      if (stageClearT <= 0 || (!isDemo && stageClearT < STAGECLEAR_T - 0.8 && (inp.startPressed || inp.firePressed))) loadStage();
      if (isDemo) drawDemoTag();
      return;
    }
    if (mode === 'paused') {
      const N = 3;
      if (inp.upPressed) { pauseIdx = (pauseIdx + N - 1) % N; uiSound('move'); }
      if (inp.downPressed) { pauseIdx = (pauseIdx + 1) % N; uiSound('move'); }
      if (inp.pausePressed) { mode = 'playing'; }
      else if (inp.startPressed || inp.firePressed) {
        if (pauseIdx === 0) mode = 'playing';
        else if (pauseIdx === 1) { carry = stageCarry; loadStage(); }
        else { mode = 'title'; toTitleAudio(); }
        uiSound('select');
      }
      renderer.render(state, 0);
      drawPaused();
      return;
    }

    // playing
    if(qaHold){renderer.render(state,dt*D.SPEED);return;}
    if (inp.pausePressed) { mode = 'paused'; pauseIdx = 0; return; }
    window.__tBeamAim = (state.player.weapon === 'beam' && inp.fire);

    acc += dt;
    let steps = 0;
    const visualEvents=[];
    while (acc >= D.STEP && steps < 5) {
      // the autopilot writes a fresh input frame per tick, exactly like a pad
      const tick = isDemo && pilot ? pilot.frame(state) : inp;
      E.step(state, tick, D.VIEW_W, D.VIEW_H);
      stageTime += D.STEP;
      visualEvents.push(...state.events.filter(e=>!["sfx","voice","music"].includes(e.type)));
      acc -= D.STEP; steps++;
      // consume sfx / music events
      for (const ev of state.events) {
        if (ev.type === 'sfx') {
          audio.play(ev.name, ev.x, ev.y);
          if (ev.name === 'line' && Math.random() < 0.5) audio.playVoice('shockwall');
          if (ev.name === 'explode' || ev.name === 'bossdie' || ev.name === 'bomb' || ev.name === 'phase') {
            audio.duck(0.35, 0.3);
          }
          if (ev.name === 'hit') input.rumble(0.55, 120);
          else if (ev.name === 'die') input.rumble(1, 320);
          else if (ev.name === 'bossdie') input.rumble(1, 500);
          else if (ev.name === 'stomp' || ev.name === 'bomb') input.rumble(0.4, 110);
        } else if (ev.type === 'music') {
          audio.startMusic(ev.name === 'boss' ? 'boss' : state.level.world);
        } else if (ev.type === 'voice') {
          const b = state.boss, w = state.player.weapon;
          if (ev.name === 'bosswarn' && b) {
            audio.playVoice('bosswarn-' + b.key, true);
            if (audio.bossRoar) audio.bossRoar(b.key, b.x + b.w / 2, b.y + b.h / 2);
          } else if (ev.name === 'weapon' && Math.random() < 0.6) {
            audio.playVoice('weapon-' + ({ spread: 'scatter', beam: 'lance', bounce: 'ricochet' }[w] || 'scatter'), !!ev.pr);
          } else audio.playVoice(ev.name, !!ev.pr);
        }
      }
      // one-shot edges must not replay into catch-up steps (double bomb bug)
      if (!isDemo) {
        inp.jumpPressed = inp.firePressed = inp.morphPressed = inp.switchPressed = false;
        inp.bombPressed = inp.linePressed = inp.jumpReleased = false;
      }
      if (state.won) { nextStage(); break; }
      if (state.gameOver) {
        if (isDemo) { demoWiped(); break; }
        mode = 'gameover'; audio.stopMusic(); if (audio.stopScene) audio.stopScene(); audio.play('gameover'); audio.playVoice('gameover', true);
        newBest = beatsBest(state.player.score);
        break;
      }
    }
    // effects and animation run on game time too, so the whole world moves at D.SPEED
    if (mode === 'playing') { state.events=visualEvents; renderer.render(state, dt * D.SPEED); if (audio.update) audio.update(state, dt); }
    drawVoiceToast(dt);
    if (isDemo && mode === 'playing') drawDemoTag();
  }

  // ---- menu / overlay drawing --------------------------------------------
  function centerText(txt, x, y, size, color, weight) {
    dx.fillStyle = color; dx.textAlign = 'center'; dx.textBaseline = 'middle';
    dx.font = `${weight || 'bold'} ${size}px "Trebuchet MS", system-ui, sans-serif`;
    dx.fillText(txt, x, y);
  }
  function bgPanel() {
    const g = dx.createLinearGradient(0, 0, 0, DH);
    g.addColorStop(0, '#0a0620'); g.addColorStop(0.5, '#1b0f3a'); g.addColorStop(1, '#050310');
    dx.fillStyle = g; dx.fillRect(0, 0, DW, DH);
  }
  function drawTitle() {
    fetchGlobalScores();
    if (renderer.renderTitle) {
      renderer.renderTitle(frameDt);
      const vg = dx.createLinearGradient(0, 0, 0, DH);
      vg.addColorStop(0, 'rgba(2,5,12,0.62)'); vg.addColorStop(0.36, 'rgba(2,5,12,0.06)');
      vg.addColorStop(0.6, 'rgba(2,5,12,0.18)'); vg.addColorStop(1, 'rgba(2,5,12,0.86)');
      dx.fillStyle = vg; dx.fillRect(0, 0, DW, DH);
    } else {
    bgPanel();
    dx.save();
    if (titleReady) {
      // painted hero key-art with a slow cinematic ken-burns drift
      const kz = 1.07 + Math.sin(uiT * 0.2) * 0.015;
      const kw = DW * kz, kh = DH * kz;
      const kx = -(kw - DW) / 2 + Math.sin(uiT * 0.15) * 12;
      const ky = -(kh - DH) / 2 + Math.cos(uiT * 0.12) * 8;
      dx.drawImage(titleImg, kx, ky, kw, kh);
      // legibility vignette: darken top (logo) + bottom (menu)
      const vg = dx.createLinearGradient(0, 0, 0, DH);
      vg.addColorStop(0, 'rgba(5,3,15,0.58)'); vg.addColorStop(0.38, 'rgba(5,3,15,0.10)');
      vg.addColorStop(0.66, 'rgba(5,3,15,0.30)'); vg.addColorStop(1, 'rgba(5,3,15,0.85)');
      dx.fillStyle = vg; dx.fillRect(0, 0, DW, DH);
      // rising embers for life
      for (let i = 0; i < 34; i++) {
        const ex = ((i * 137 + uiT * (9 + (i % 4) * 6)) % (DW + 20)) - 10;
        const ey = DH - ((i * 91 + uiT * (22 + (i % 3) * 12)) % (DH + 40));
        dx.globalAlpha = 0.12 + (i % 3) * 0.1;
        dx.fillStyle = i % 2 ? '#ff8a3b' : '#ffd23f';
        dx.fillRect(ex, ey, 2, 2);
      }
      // rare lightning flash (matches the storm sky)
      const lt = uiT % 6.3;
      if (lt < 0.16) { dx.globalAlpha = (0.16 - lt) * 1.4; dx.fillStyle = '#dfe8ff'; dx.fillRect(0, 0, DW, DH); }
      dx.globalAlpha = 1;
    } else {
      // procedural fallback: starfield + drifting mesas + searchlight sweep
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 179 + uiT * (6 + (i % 5) * 4)) % (DW + 20)) - 10;
        const sy = (i * 97) % (DH * 0.7);
        dx.globalAlpha = 0.25 + (i % 4) * 0.12;
        dx.fillStyle = '#cfe0ff';
        dx.fillRect(DW - sx, sy, 1.6, 1.6);
      }
      const mesa = (scroll, baseY, amp, color, alpha) => {
        dx.globalAlpha = alpha; dx.fillStyle = color;
        dx.beginPath(); dx.moveTo(-2, DH);
        for (let x = -8; x <= DW + 8; x += 8) {
          const wc = x + scroll;
          const n = Math.sin(wc * 0.004) + Math.sin(wc * 0.0017) * 0.7;
          dx.lineTo(x, baseY - (Math.round(n * 1.6) / 1.6) * amp);
        }
        dx.lineTo(DW + 2, DH); dx.closePath(); dx.fill();
      };
      mesa(uiT * 6, DH * 0.86, 46, '#131033', 0.9);
      mesa(uiT * 14, DH * 0.95, 56, '#1b1440', 0.95);
      const beamA = Math.sin(uiT * 0.35) * 0.9;
      const bx0 = DW * 0.5 + Math.sin(uiT * 0.35) * DW * 0.3;
      const grad = dx.createLinearGradient(bx0, DH, bx0 + beamA * 200, 0);
      grad.addColorStop(0, 'rgba(108,243,255,0.06)'); grad.addColorStop(1, 'rgba(108,243,255,0)');
      dx.fillStyle = grad;
      dx.beginPath(); dx.moveTo(bx0 - 30, DH); dx.lineTo(bx0 + beamA * 200 - 90, 0);
      dx.lineTo(bx0 + beamA * 200 + 90, 0); dx.lineTo(bx0 + 30, DH); dx.closePath(); dx.fill();
    }
    dx.restore();
    // animated scanline grid
    dx.strokeStyle = 'rgba(120,90,255,0.10)'; dx.lineWidth = 1;
    for (let y = (uiT * 40) % 40; y < DH; y += 40) { dx.beginPath(); dx.moveTo(0, y); dx.lineTo(DW, y); dx.stroke(); }
    }
    drawLogo(DW / 2, DH / 2 - 98);
    // menu
    const items = MENU;
    for (let i = 0; i < items.length; i++) {
      const sel = i === menuIdx;
      const y = DH / 2 + 26 + i * 27;
      if (sel) {
        dx.save(); dx.shadowColor = '#ffd23f'; dx.shadowBlur = 10;
        centerText('▶ ' + items[i] + ' ◀', DW / 2, y, 22, '#ffd23f', '900'); dx.restore();
      } else {
        centerText(items[i], DW / 2, y, 20, 'rgba(200,210,255,0.75)', 'bold');
      }
    }
    centerText('DIFFICULTY ' + D.DIFFICULTY[settings.difficulty].label + '  ·  SPEED ' + pctLabel(settings.speed), DW / 2, DH / 2 + 166, 13, 'rgba(255,210,63,0.7)', 'bold');
    const best = loadScores()[0];
    if (best) centerText('HI-SCORE  ' + String(best.score).padStart(7, '0') + '  (' + cleanStage(best.stage) + ')', DW / 2, 40, 15, 'rgba(139,233,255,0.8)', 'bold');
    const top = globalScores && globalScores[0];
    if (top) centerText('WORLD BEST  ' + String(top.score).padStart(7, '0') + '  ' + cleanInitials(top.initials), DW / 2, 62, 13, 'rgba(255,210,63,0.75)', 'bold');
    centerText('MOVE ←→ · JUMP SPACE · FIRE J/X · AIM ↑↓ · ROLL SHIFT · SWITCH Q · CRYO C · SHOCKWALL V · PAUSE P', DW / 2, DH / 2 + 188, 12, 'rgba(200,210,255,0.65)', 'normal');
    centerText('v' + D.VERSION, DW - 40, DH - 20, 12, 'rgba(255,255,255,0.4)', 'normal');
  }
  // crystalline SHARD ASSAULT logo with a travelling glint
  function drawLogo(cx, cy) {
    dx.save();
    dx.textAlign = 'center'; dx.textBaseline = 'middle';
    dx.font = '900 84px "Rajdhani", "Trebuchet MS", system-ui, sans-serif';
    if ('letterSpacing' in dx) dx.letterSpacing = '6px';
    const w = dx.measureText('SHARD ASSAULT').width;
    const g = dx.createLinearGradient(cx - w / 2, cy - 40, cx + w / 2, cy + 40);
    g.addColorStop(0, '#9ff3ff'); g.addColorStop(0.45, '#ffffff'); g.addColorStop(0.55, '#7fd8ff'); g.addColorStop(1, '#3f7cff');
    dx.shadowColor = 'rgba(80,220,255,0.85)'; dx.shadowBlur = 26 + Math.sin(uiT * 1.7) * 8;
    dx.fillStyle = g; dx.fillText('SHARD ASSAULT', cx, cy);
    dx.shadowBlur = 0; dx.lineWidth = 1.5; dx.strokeStyle = 'rgba(10,30,60,0.9)'; dx.strokeText('SHARD ASSAULT', cx, cy);
    const gx = cx - w / 2 + ((uiT * 260) % (w + 400)) - 200;
    dx.globalCompositeOperation = 'source-atop';
    const sg = dx.createLinearGradient(gx - 60, 0, gx + 60, 0);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.85)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    dx.fillStyle = sg; dx.fillRect(gx - 60, cy - 50, 120, 100);
    dx.globalCompositeOperation = 'source-over';
    if ('letterSpacing' in dx) dx.letterSpacing = '0px';
    dx.fillStyle = 'rgba(120,230,255,0.75)'; dx.fillRect(cx - w / 2, cy + 50, w, 1.5);
    dx.font = '600 15px "Rajdhani", "Trebuchet MS", system-ui, sans-serif';
    if ('letterSpacing' in dx) dx.letterSpacing = '5px';
    dx.fillStyle = 'rgba(205,235,255,0.82)'; dx.fillText('FIVE WORLDS  ·  ONE TROOPER  ·  BREAK THE SOVEREIGN', cx, cy + 68);
    if ('letterSpacing' in dx) dx.letterSpacing = '0px';
    dx.restore();
  }
  const MENU = ['START MISSION', 'SELECT WORLD', 'WATCH DEMO', 'HIGH SCORES', 'OPTIONS'];
  // attract-mode badge: below the HUD strip, above the boss bar's turf
  function drawDemoTag() {
    dx.save();dx.font='600 11px system-ui';dx.textAlign='center';dx.fillStyle='#8bdfe5';
    dx.fillText(canTakeOver() ? 'DEMO  ·  PRESS FIRE TO TAKE OVER  ·  ESC FOR MENU' : 'DEMO',DW/2,69);dx.restore();
  }

  // ---- world select ------------------------------------------------------
  function medalPip(x, y, m, r) {
    dx.beginPath(); dx.arc(x, y, r, 0, 7);
    if (m) { dx.fillStyle = MEDALS[m].color; dx.fill(); }
    else { dx.strokeStyle = 'rgba(160,180,220,0.45)'; dx.lineWidth = 1.5; dx.stroke(); }
  }
  function drawWorlds() {
    if (renderer.renderTitle) { renderer.renderTitle(frameDt); overlayDim(); } else bgPanel();
    dx.save(); dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 12;
    centerText('SELECT WORLD', DW / 2, 70, 40, '#6cf3ff', '900'); dx.restore();
    for (let w = 0; w <= D.WORLDS.length; w++) {
      const y = 140 + w * 50, sel = w === worldIdx;
      if (sel) { dx.fillStyle = 'rgba(255,210,63,0.10)'; dx.fillRect(DW / 2 - 300, y - 21, 600, 42); }
      dx.textBaseline = 'middle';
      if (w === D.WORLDS.length) {
        dx.textAlign = 'left'; dx.font = (sel ? '900 20px' : 'bold 18px') + ' "Trebuchet MS", system-ui, sans-serif';
        dx.fillStyle = sel ? '#ffd23f' : 'rgba(200,210,255,0.8)'; dx.fillText((sel ? '▶ ' : '  ') + 'BACK', DW / 2 - 280, y);
        continue;
      }
      const open = w <= progress.world, wd = D.WORLDS[w];
      dx.textAlign = 'left';
      dx.font = (sel ? '900 20px' : 'bold 18px') + ' "Trebuchet MS", system-ui, sans-serif';
      dx.fillStyle = !open ? 'rgba(150,160,190,0.45)' : sel ? '#ffd23f' : 'rgba(200,210,255,0.85)';
      dx.fillText((sel ? '▶ ' : '  ') + (w + 1) + '   ' + wd.name, DW / 2 - 280, y);
      dx.textAlign = 'right';
      if (!open) { dx.font = 'bold 14px "Trebuchet MS", system-ui, sans-serif'; dx.fillStyle = 'rgba(150,160,190,0.55)'; dx.fillText('LOCKED', DW / 2 + 280, y); continue; }
      const first = firstStageOf(w), n = D.STAGES_PER_WORLD[w];
      for (let k = 0; k < n; k++) medalPip(DW / 2 + 280 - (n - 1 - k) * 22 - 8, y, progress.medals[first + k] || 0, 7);
    }
    const sel = Math.min(worldIdx, D.WORLDS.length - 1);
    const note = worldIdx === D.WORLDS.length ? '' : worldIdx > progress.world ? 'Reach this world in a run to open it.'
      : worldIdx === 0 ? 'A full run from World 1 posts to the world score board.'
      : 'Starts with the gear a trooper carries by World ' + (sel + 1) + '. Scores stay on this device.';
    centerText(note, DW / 2, DH - 72, 14, 'rgba(255,210,63,0.75)', 'normal');
    centerText('↑↓ select · ENTER start · ESC back', DW / 2, DH - 44, 14, 'rgba(200,210,255,0.6)', 'normal');
  }

  // ---- high score tables -------------------------------------------------
  function drawScores() {
    if (renderer.renderTitle) { renderer.renderTitle(frameDt); overlayDim(); } else bgPanel();
    dx.save(); dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 12;
    centerText('HIGH SCORES', DW / 2, 62, 40, '#6cf3ff', '900'); dx.restore();
    const tag = (r) => ((D.DIFFICULTY[r.diff] || D.DIFFICULTY.normal).label[0]) + ' ' + (Number.isFinite(+r.speed) ? (r.speed > 2 ? Math.round(r.speed) : Math.round(r.speed * 100)) + '%' : '');
    const col = (x, title, rows, n, fmt, hi) => {
      dx.textBaseline = 'middle'; dx.textAlign = 'left';
      dx.font = '900 16px "Trebuchet MS", system-ui, sans-serif'; dx.fillStyle = '#ffd23f'; dx.fillText(title, x, 116);
      dx.font = 'bold 15px monospace';
      for (let i = 0; i < n; i++) {
        const r = rows && rows[i], y = 146 + i * 27;
        dx.fillStyle = r && hi(r) ? '#8bf7a0' : r ? 'rgba(220,230,255,0.88)' : 'rgba(160,180,220,0.35)';
        dx.fillText(String(i + 1).padStart(2, ' ') + '. ' + (r ? fmt(r) : '---'), x, y);
      }
    };
    col(DW / 2 - 400, 'WORLD TOP 10', globalScores, 10, (r) => cleanInitials(r.initials).padEnd(3, ' ') + '  ' + String(r.score).padStart(7, '0') + '  ' + cleanStage(r.stage).padEnd(5, ' ') + ' ' + tag(r),
      (r) => scoresHi && r.score === scoresHi.score && cleanInitials(r.initials) === scoresHi.initials);
    col(DW / 2 + 40, 'THIS DEVICE', loadScores(), 5, (r) => String(r.score).padStart(7, '0') + '  ' + cleanStage(r.stage).padEnd(5, ' ') + ' ' + tag(r) + (r.from ? '  W' + (r.from + 1) : ''),
      (r) => scoresHi && r.score === scoresHi.score);
    if (!globalScores) centerText('connecting to the world board…', DW / 2 - 240, 146 + 10 * 27, 12, 'rgba(200,210,255,0.5)', 'normal');
    centerText('World scores come from full runs started at World 1  ·  E/N/H = difficulty, % = game speed', DW / 2, DH - 64, 12, 'rgba(255,210,63,0.7)', 'normal');
    centerText('ENTER or ESC to return', DW / 2, DH - 40, 14, 'rgba(200,210,255,0.6)', 'normal');
  }

  // ---- initials for the world board --------------------------------------
  window.addEventListener('keydown', (e) => {
    if (mode !== 'entername' || e.repeat || !/^Key[A-Z]$|^Digit[0-9]$/.test(e.code)) return;
    nameBuf[nameIdx] = e.code.slice(-1); nameIdx = Math.min(2, nameIdx + 1); nameTyped = true; uiSound('adjust');
  });
  function drawEnterName() {
    overlayDim();
    dx.save(); dx.shadowColor = '#ffd23f'; dx.shadowBlur = 14;
    centerText('WORLD TOP 10!', DW / 2, DH / 2 - 120, 40, '#ffd23f', '900'); dx.restore();
    centerText('SCORE ' + String(pendingScore ? pendingScore.score : 0).padStart(7, '0'), DW / 2, DH / 2 - 76, 22, '#fff', 'bold');
    centerText('ENTER YOUR INITIALS', DW / 2, DH / 2 - 40, 15, 'rgba(200,210,255,0.8)', 'bold');
    for (let i = 0; i < 3; i++) {
      const x = DW / 2 + (i - 1) * 70, y = DH / 2 + 20, sel = i === nameIdx;
      dx.fillStyle = sel ? 'rgba(255,210,63,0.16)' : 'rgba(10,14,30,0.6)'; dx.fillRect(x - 26, y - 32, 52, 64);
      dx.strokeStyle = sel ? '#ffd23f' : 'rgba(140,170,220,0.5)'; dx.lineWidth = 2; dx.strokeRect(x - 26, y - 32, 52, 64);
      centerText(nameBuf[i], x, y + 2, 40, sel ? '#ffd23f' : '#e6f0ff', '900');
      if (sel && Math.floor(uiT * 3) % 2 === 0) { centerText('▲', x, y - 46, 14, '#ffd23f', 'bold'); centerText('▼', x, y + 48, 14, '#ffd23f', 'bold'); }
    }
    centerText('type letters or use ↑↓ ←→ · ENTER save · ESC skip', DW / 2, DH / 2 + 104, 14, 'rgba(200,210,255,0.65)', 'normal');
  }

  function drawOptions() {
    if (renderer.renderTitle) { renderer.renderTitle(frameDt); overlayDim(); } else bgPanel();
    dx.save(); dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 12;
    centerText('OPTIONS', DW / 2, 86, 44, '#6cf3ff', '900'); dx.restore();
    const bar = (v) => '█'.repeat(Math.round(v * 10)) + '░'.repeat(10 - Math.round(v * 10));
    const rows = [
      ['MASTER VOLUME', bar(settings.master)],
      ['MUSIC', bar(settings.music)],
      ['SOUND FX', bar(settings.sfx)],
      ['VOICE', bar(settings.voice)],
      ['DIFFICULTY', '◀ ' + D.DIFFICULTY[settings.difficulty].label + ' ▶'],
      ['GAME SPEED', '◀ ' + pctLabel(settings.speed) + ' ▶'],
      ['CRT SCANLINES', settings.crt ? 'ON' : 'OFF'],
      ['BACK', ''],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 148 + i * 41;
      const sel = i === optIdx;
      dx.textAlign = 'left'; dx.textBaseline = 'middle';
      dx.font = (sel ? '900 20px' : 'bold 18px') + ' "Trebuchet MS", system-ui, sans-serif';
      dx.fillStyle = sel ? '#ffd23f' : 'rgba(200,210,255,0.8)';
      dx.fillText((sel ? '▶ ' : '  ') + rows[i][0], DW / 2 - 240, y);
      dx.textAlign = 'right';
      dx.font = 'bold 18px monospace';
      dx.fillStyle = sel ? '#8be9ff' : 'rgba(160,180,220,0.7)';
      dx.fillText(rows[i][1], DW / 2 + 240, y);
    }
    if (optIdx === 5) centerText('How fast the whole world runs: 100% is full speed, 70% gives the most time to react', DW / 2, DH - 70, 13, 'rgba(255,210,63,0.7)', 'normal');
    centerText('↑↓ select · ←→ adjust · ENTER confirm · ESC back', DW / 2, DH - 44, 14, 'rgba(200,210,255,0.6)', 'normal');
  }
  function overlayDim() { dx.fillStyle = 'rgba(4,4,16,0.6)'; dx.fillRect(0, 0, DW, DH); }
  function drawPaused() {
    overlayDim();
    centerText('PAUSED', DW / 2, DH / 2 - 76, 48, '#ffd23f', '900');
    const items = ['RESUME', 'RESTART STAGE', 'QUIT TO TITLE'];
    for (let i = 0; i < items.length; i++) {
      const sel = i === pauseIdx;
      const y = DH / 2 - 8 + i * 38;
      if (sel) centerText('▶ ' + items[i] + ' ◀', DW / 2, y, 21, '#ffd23f', '900');
      else centerText(items[i], DW / 2, y, 19, 'rgba(200,210,255,0.75)', 'bold');
    }
    centerText('↑↓ select · ENTER confirm · P resume', DW / 2, DH / 2 + 118, 13, '#cfe0ff', 'normal');
  }
  const fmtTime = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
  function drawStageClear() {
    overlayDim();
    const r = results, t = STAGECLEAR_T - stageClearT;
    centerText('STAGE CLEAR', DW / 2, 96, 46, '#54e36b', '900');
    if (r) {
      const rows = [
        ['CRYSTALS', r.gems + ' / ' + r.total + '    ' + Math.round(r.pct * 100) + '%'],
        ['SECRETS', r.secretsTotal ? r.secrets + ' / ' + r.secretsTotal : '—'],
        ['TIME', fmtTime(r.time)],
        ['DEATHS', String(r.deaths)],
      ];
      dx.textBaseline = 'middle';
      rows.forEach((row, i) => {
        if (t < 0.2 + i * 0.2) return;
        const y = 162 + i * 34;
        dx.textAlign = 'left'; dx.font = 'bold 18px "Trebuchet MS", system-ui, sans-serif'; dx.fillStyle = 'rgba(200,210,255,0.8)';
        dx.fillText(row[0], DW / 2 - 170, y);
        dx.textAlign = 'right'; dx.font = 'bold 19px monospace'; dx.fillStyle = '#ffffff';
        dx.fillText(row[1], DW / 2 + 170, y);
      });
      if (t > 1.1) {
        const m = MEDALS[r.medal], y = 334, pop = Math.min(1, (t - 1.1) / 0.18);
        dx.save(); dx.translate(DW / 2 - 70, y); dx.scale(pop, pop);
        if (m) {
          const g = dx.createRadialGradient(-6, -8, 2, 0, 0, 26);
          g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, m.color); g.addColorStop(1, 'rgba(40,30,10,0.9)');
          dx.shadowColor = m.color; dx.shadowBlur = 18; dx.fillStyle = g;
          dx.beginPath(); dx.arc(0, 0, 24, 0, 7); dx.fill();
        } else medalPip(0, 0, 0, 22);
        dx.restore();
        dx.textAlign = 'left'; dx.textBaseline = 'middle';
        dx.font = '900 26px "Trebuchet MS", system-ui, sans-serif'; dx.fillStyle = m ? m.color : 'rgba(200,210,255,0.6)';
        dx.fillText(m ? m.name : 'NO MEDAL', DW / 2 - 34, y - (r.best ? 8 : 0));
        if (r.best) { dx.font = 'bold 13px "Trebuchet MS", system-ui, sans-serif'; dx.fillStyle = '#8bf7a0'; dx.fillText('NEW BEST FOR THIS STAGE', DW / 2 - 34, y + 16); }
      }
      centerText('GOLD 90%  ·  SILVER 70%  ·  BRONZE 45% of the crystals', DW / 2, 384, 12, 'rgba(200,210,255,0.55)', 'normal');
    }
    centerText('SCORE ' + state.player.score, DW / 2, 422, 20, '#fff', 'bold');
    if (!isDemo && t > 0.8) centerText('ENTER to continue', DW / 2, 456, 13, 'rgba(200,210,255,0.6)', 'normal');
  }
  function drawGameOver() {
    overlayDim(); dx.save(); dx.shadowColor = '#ff3b6b'; dx.shadowBlur = 14;
    centerText('GAME OVER', DW / 2, DH / 2 - 46, 56, '#ff5d7a', '900'); dx.restore();
    centerText('SCORE ' + (state ? state.player.score : 0), DW / 2, DH / 2 + 8, 22, '#fff', 'bold');
    if (newBest) centerText('★ NEW HIGH SCORE ★', DW / 2, DH / 2 + 38, 18, '#ffd23f', '900');
    if (continues > 0) {
      if (Math.floor(uiT * 2) % 2 === 0)
        centerText('CONTINUE? ' + continues + ' LEFT — press ENTER', DW / 2, DH / 2 + 74, 20, '#54e36b', 'bold');
      centerText('ESC for title', DW / 2, DH / 2 + 104, 14, '#cfe0ff', 'normal');
    } else {
      centerText('press ENTER to return to title', DW / 2, DH / 2 + 74, 15, '#cfe0ff', 'normal');
    }
  }
  function drawWin() {
    overlayDim(); dx.save(); dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 18;
    centerText('THE SOVEREIGN IS SHATTERED', DW / 2, DH / 2 - 60, 40, '#bff6ff', '900'); dx.restore();
    centerText('Kethra is free.', DW / 2, DH / 2 - 18, 18, '#cfe0ff', 'normal');
    centerText('FINAL SCORE ' + (state ? state.player.score : 0), DW / 2, DH / 2 + 22, 26, '#6cf3ff', 'bold');
    if (newBest) centerText('★ NEW HIGH SCORE ★', DW / 2, DH / 2 + 56, 18, '#ffd23f', '900');
    centerText('press ENTER for the title', DW / 2, DH / 2 + 92, 15, '#cfe0ff', 'normal');
  }
  function drawIntroCard() {
    const p = PLAN[planIdx];
    const a = Math.min(1, introT / 0.35, (2.0 - introT) / 0.3);
    dx.save();
    dx.globalAlpha = Math.max(0, Math.min(1, a));
    dx.fillStyle = 'rgba(3,4,14,0.72)'; dx.fillRect(0, DH / 2 - 84, DW, 168);
    dx.fillStyle = 'rgba(108,243,255,0.5)';
    dx.fillRect(0, DH / 2 - 84, DW, 2); dx.fillRect(0, DH / 2 + 82, DW, 2);
    dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 14;
    centerText('WORLD ' + (p.world + 1) + '-' + (p.stage + 1), DW / 2, DH / 2 - 34, 40, '#ffffff', '900');
    dx.shadowBlur = 8;
    centerText(state.level.name, DW / 2, DH / 2 + 14, 26, '#ffd23f', '900');
    dx.shadowBlur = 0;
    centerText(state.level.type === 'shmup' ? '— ON-RAILS ASSAULT —' : state.level.theme, DW / 2, DH / 2 + 52, 13, 'rgba(200,210,255,0.75)', 'normal');
    // campaign progress: one pip per stage
    const dotW = 16;
    const x0 = DW / 2 - (PLAN.length - 1) * dotW / 2;
    for (let i = 0; i < PLAN.length; i++) {
      dx.beginPath();
      dx.arc(x0 + i * dotW, DH / 2 + 72, i === planIdx ? 4.5 : 3, 0, 7);
      dx.fillStyle = i < planIdx ? '#54e36b' : i === planIdx ? '#ffd23f' : 'rgba(160,180,220,0.35)';
      dx.fill();
    }
    dx.restore();
  }

  // ---- touch controls -----------------------------------------------------
  function wireTouch() {
    const bind = (id, action) => {
      const el = document.getElementById(id); if (!el) return;
      const on = (e) => { e.preventDefault(); input.setTouch(action, true); el.classList.add('down'); };
      const off = (e) => { e.preventDefault(); input.setTouch(action, false); el.classList.remove('down'); };
      el.addEventListener('touchstart', on, { passive: false });
      el.addEventListener('touchend', off, { passive: false });
      el.addEventListener('touchcancel', off, { passive: false });
      el.addEventListener('mousedown', on); el.addEventListener('mouseup', off); el.addEventListener('mouseleave', off);
    };
    bind('t-jump', 'jump'); bind('t-fire', 'fire'); bind('t-morph', 'morph'); bind('t-switch', 'switch');
    bind('t-bomb', 'bomb'); bind('t-pause', 'pause');
    wireJoystick();   // left-hand movement is an analog on-screen stick
    // show touch UI on touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      const tc = document.getElementById('touch'); if (tc) tc.style.display = 'flex';
      // fullscreen + landscape lock (Android requires fullscreen before lock)
      const fs = document.getElementById('fsbtn');
      if (fs) {
        fs.style.display = 'block';
        fs.addEventListener('click', async () => {
          try {
            if (!document.fullscreenElement) {
              await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
              if (screen.orientation && screen.orientation.lock)
                await screen.orientation.lock('landscape').catch(() => {});
              fs.textContent = '🗗';
            } else {
              await document.exitFullscreen();
              fs.textContent = '⛶';
            }
          } catch (e) {}
        });
      }
      // tapping the playfield acts as START/confirm on menu screens
      display.addEventListener('pointerdown', () => {
        if (isDemo) return;
        if (mode === 'title' || mode === 'gameover' || mode === 'win' || mode === 'intro' || mode === 'stageclear' ||
            mode === 'worlds' || mode === 'scores' || mode === 'entername') {
          input.setTouch('start', true);
          setTimeout(() => input.setTouch('start', false), 60);
        }
      });
      // block long-press menus / double-tap zoom inside the stage
      document.getElementById('stage').addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }
  // analog virtual joystick for movement — multi-touch aware (own touch id, so
  // the right-hand action buttons work simultaneously), 8-way with a deadzone.
  function wireJoystick() {
    const base = document.getElementById('joystick');
    const knob = document.getElementById('joyknob');
    if (!base || !knob) return;
    const R = 40;        // max knob travel in px
    const DEAD = 0.28;   // deadzone (fraction of R) before any direction registers
    const T = 0.38;      // per-axis activation threshold -> gives smooth 8-way
    let touchId = null, mouseOn = false;
    const setDirs = (l, r, u, d) => {
      input.setTouch('left', l); input.setTouch('right', r);
      input.setTouch('up', u); input.setTouch('down', d);
    };
    function reset() {
      touchId = null; mouseOn = false; base.classList.remove('active');
      knob.style.transform = 'translate(0px,0px)';
      setDirs(false, false, false, false);
    }
    function update(cx, cy) {
      const rect = base.getBoundingClientRect();
      const bx = rect.left + rect.width / 2, by = rect.top + rect.height / 2;
      const dx = cx - bx, dy = cy - by;
      const len = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(len, R);
      knob.style.transform = `translate(${(dx / len) * clamped}px,${(dy / len) * clamped}px)`;
      if (clamped / R < DEAD) { setDirs(false, false, false, false); return; }
      const nx = dx / len, ny = dy / len;
      setDirs(nx < -T, nx > T, ny < -T, ny > T);
    }
    base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (touchId !== null) return;
      const t = e.changedTouches[0]; touchId = t.identifier;
      base.classList.add('active'); update(t.clientX, t.clientY);
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if (touchId === null) return;
      for (const t of e.changedTouches) if (t.identifier === touchId) { e.preventDefault(); update(t.clientX, t.clientY); return; }
    }, { passive: false });
    const end = (e) => {
      if (touchId === null) return;
      for (const t of e.changedTouches) if (t.identifier === touchId) { reset(); return; }
    };
    window.addEventListener('touchend', end); window.addEventListener('touchcancel', end);
    // mouse fallback for desktop testing
    base.addEventListener('mousedown', (e) => { e.preventDefault(); mouseOn = true; base.classList.add('active'); update(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => { if (mouseOn) update(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { if (mouseOn) reset(); });
  }
  wireTouch();

  // controller feedback: flash a hint when a gamepad connects
  window.addEventListener('gamepadconnected', () => {
    const h = document.getElementById('hint'); if (!h) return;
    h.textContent = '🎮 Controller connected'; h.style.opacity = '1';
    setTimeout(() => { h.style.transition = 'opacity .6s'; h.style.opacity = '0'; }, 2600);
  });

  // auto-pause when the window loses focus (keys are also released by input.js)
  window.addEventListener('blur', () => { if (mode === 'playing') mode = 'paused'; });
  // hidden tabs throttle timers to 1s > the music lookahead — silence cleanly
  // instead of bursting stacked notes, and resume on return
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { audio.stopMusic(); }
    else if (!audio.muted && (mode === 'playing' || mode === 'paused' || mode === 'intro')) {
      audio.startMusic(state && state.boss && state.boss.awake && state.boss.alive ? 'boss' : (state ? state.level.world : 'title'));
    } else if (!audio.muted && mode === 'title') toTitleAudio();
  });

  // unlock WebAudio inside a real user gesture (iOS/Safari requirement)
  const unlockAudio = () => {
    audio.resume();
    if (mode === 'title') { toTitleAudio(); if (!titleVoiced) { titleVoiced = true; if (audio.ui) audio.ui('title'); setTimeout(() => { if (mode === 'title') audio.playVoice('title', true); }, 500); } }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // ---- QA hooks (headless testing) ---------------------------------------
  window.__shard = window.__turrican = {
    get mode() { return mode; },
    get state() { return state; },
    start(world) { if(isDemo)endDemo(); audio.resume(); newRun(world || 0); },
    get run() { return Object.assign({ posts: postsWorld(), speed: D.SPEED }, run); },
    get results() { return results; },
    progress, settings,
    setQuality(scale) { renderer.setResolution(scale); },
    get tactics() { return pilot ? pilot.stats.intent : ''; },
    get graphics() { return window.__modernGraphics?.stats || {backend:'HD compatibility'}; },
    goToStage(i) { planIdx = i; loadStage(); },
    clearStage() { if (state) state.won = true; },
    step(n, inp) { for (let k = 0; k < (n || 1); k++) E.step(state, inp || {}, D.VIEW_W, D.VIEW_H); return snap(); },
    snapshot: snap, plan: PLAN, D,
    setInput(o) { window.__forceInput = o; },
    get lastInput() { return lastInp; },        // merged keyboard+touch+joystick+pad
    padConnected() { return input.padConnected(); },
    voice: { roll() { audio.rollVoice(); return audio.getVoiceSet(); },
             set() { return audio.getVoiceSet(); },
             say(n) { audio.resume(); audio.playVoice(n, true); } },
    demo: { start: startDemo, stop: endDemo, get on() { return isDemo; }, takeOver() { if (canTakeOver()) takeOver(); },
            get canTakeOver() { return canTakeOver(); }, get idle() { return idleT; }, get stage() { return planIdx; } },
  };
  function snap() {
    if (!state) return { mode };
    const p = state.player;
    return { mode, world: state.level.world, stage: PLAN[planIdx] ? PLAN[planIdx].stage : -1,
      x: p.x, y: p.y, vx: p.vx, vy: p.vy, onGround: p.onGround, energy: p.energy, lives: p.lives,
      score: p.score, gems: p.gems, weapon: p.weapon, weaponLevel: p.weapons[p.weapon],
      morph: p.morph, enemies: state.enemies.filter(e => e.alive).length, won: state.won, gameOver: state.gameOver,
      boss: state.boss ? { key: state.boss.key, hp: Math.round(state.boss.hp), awake: state.boss.awake,
        open: state.boss.open, phase: state.boss.phase, alive: state.boss.alive } : null };
  }

  // installable PWA: offline cache + home-screen app (Android)


  // adaptive quality: sustained slow frames -> drop DPR + heavy FX (one-way)
  let perfEma = 16, perfSlowT = 0, perfDropped = false;
  function perfWatch(dt) {
    if (mode !== 'playing' || perfDropped) return;
    perfEma = perfEma * 0.95 + dt * 1000 * 0.05;
    perfSlowT = perfEma > 24 ? perfSlowT + dt : 0;
    if (perfSlowT > 3) {
      perfDropped = true;
      display.width = DW; display.height = DH;               // DPR 1
      dx.setTransform(1, 0, 0, 1, 0, 0);
      renderer.setFX(false); renderer.setResolution(2);
      console.log('[Shard Assault] slow device: dropped to performance mode');
    }
  }

  if(['localhost','127.0.0.1','::1'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa')){
    const poses=['normal','run','jump','crouch','beam','bounce','morph','freeze','boss'];
    const preview=(i,pose)=>{
      if(!Number.isInteger(i)||i<0||i>=PLAN.length||!poses.includes(pose))throw Error('Invalid scene');
      isDemo=false;qaHold=true;planIdx=i;carry={lives:3,weapons:{spread:3,beam:3,bounce:3},weapon:'spread',bombs:3,lines:3};loadStage();mode='playing';
      const p=state.player;for(let k=0;k<40;k++)E.step(state,{},D.VIEW_W,D.VIEW_H);
      if(pose==='boss'&&state.boss){const b=state.boss;b.awake=true;b.open=true;p.x=b.x-145;p.y=b.y+b.h-p.h;state.cam.x=Math.max(0,b.x-350);state.cam.y=Math.max(0,b.y+b.h-300);}
      if(pose==='run')p.vx=205;
      if(pose==='jump'){p.y-=50;p.vy=-260;p.onGround=false;}
      if(pose==='crouch'){p.crouch=true;p.h=22;p.y+=8;}
      if(pose==='morph'){p.morph=true;p.h=16;p.w=16;p.y+=14;p.vx=210;state.mines.push({x:p.x-25,y:p.y+14,life:3});}
      if(pose==='beam'){p.weapon='beam';p.beamActive=true;p.beamAngle=-.2;p.beam={ox:p.x+17,oy:p.y+11,dx:Math.cos(-.2),dy:Math.sin(-.2),len:240};}
      if(pose==='bounce'){p.weapon='bounce';p.cooldown=.12;for(let k=0;k<5;k++)state.pshots.push({x:p.x+40+k*35,y:p.y+10+Math.sin(k)*15,vx:200,vy:k%2?70:-70,kind:'bounce',bounces:4,life:2});}
      if(pose==='freeze'){state.freeze=4;state.events.push({type:'flash',x:p.x,y:p.y},{type:'explosion',x:p.x+70,y:p.y});}
      renderer.render(state,.016);return {snapshot:snap(),graphics:window.__modernGraphics?.stats};
    };
    const panel=document.createElement('div');panel.id='qa-panel';panel.style.cssText='position:fixed;left:10px;top:45px;z-index:80;display:flex;gap:3px;font:10px system-ui';
    const selector=document.createElement('select');PLAN.forEach((x,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(x.world+1)+'.'+(x.stage+1);selector.append(o);});panel.append(selector);
    poses.forEach(pose=>{const b=document.createElement('button');b.textContent=pose;b.onclick=()=>preview(+selector.value,pose);panel.append(b);});document.body.append(panel);
    const context=document.modelContext;if(context?.registerTool){
      context.registerTool({name:'preview_scene',description:'Local graphics test: select a stage and animation or effect, using the visible test controls.',inputSchema:{type:'object',properties:{stage:{type:'integer',minimum:0,maximum:10},pose:{type:'string',enum:poses}},required:['stage','pose'],additionalProperties:false},execute:({stage,pose})=>preview(stage,pose)});
      context.registerTool({name:'inspect_scene',description:'Inspect local 3D rendering and animation diagnostics.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({graphics:window.__modernGraphics?.stats,state:snap(),hero:{legs:window.__modernGraphics?.hero.legs.map(l=>({hip:l.hip.rotation.z,knee:l.knee.rotation.z})),arm:window.__modernGraphics?.hero.arm.rotation.z,ball:window.__modernGraphics?.hero.ball.visible},meshes:window.__modernGraphics?.scene.children.length})});
    }
  }
  applySettings();
  requestAnimationFrame(loop);
  console.log('[Shard Assault] v' + D.VERSION + ' booted');
})();

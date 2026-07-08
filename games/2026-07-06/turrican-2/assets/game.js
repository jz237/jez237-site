/* Turrican II — Redux : game.js
 * Main loop, state machine, stage progression, menus, touch, QA hooks.
 */
(function () {
  'use strict';
  const D = window.TData, E = window.TEngine, R = window.TRender, A = window.TAudio, I = window.TInput;

  const display = document.getElementById('game');
  const DW = 960, DH = 540;
  // DPR-aware backing store: everything draws in 960x540 logical units
  const DPR = Math.min(2, window.devicePixelRatio || 1);
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
  titleImg.src = 'assets/img/title-bg.jpg?v=' + D.VERSION;

  const STAGES_PER_WORLD = D.STAGES_PER_WORLD; // faithful blueprint: 5 worlds / 11 stages
  const PLAN = [];
  for (let w = 0; w < STAGES_PER_WORLD.length; w++)
    for (let s = 0; s < STAGES_PER_WORLD[w]; s++) PLAN.push({ world: w, stage: s });

  let mode = 'title';        // title | playing | paused | stageclear | gameover | win
  let state = null;          // engine state
  let planIdx = 0;
  let carry = null;
  let acc = 0, last = 0;
  let uiT = 0;
  let stageClearT = 0;
  let voiceToast = null;     // { text, t }
  audio.onVoiceToast((text) => { voiceToast = { text, t: 2.6 }; });

  // ---- settings (persisted) ------------------------------------------------
  const SETTINGS_KEY = 'turrican2_settings_v1';
  const settings = Object.assign(
    { master: 1, music: 1, sfx: 1, voice: 1, crt: true, difficulty: 'normal' },
    (() => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; } })());
  function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {} }
  function applySettings() {
    audio.setLevels(settings.master * settings.music, settings.master * settings.sfx);
    audio.setVoiceLevel(settings.master * settings.voice);
    renderer.setCRT(!!settings.crt);
  }
  let menuIdx = 0, optIdx = 0, pauseIdx = 0;
  let introT = 0;            // stage intro card timer
  let continues = 3;
  let newBest = false;
  let stageCarry = null;     // snapshot at stage entry (for RESTART STAGE)

  // ---- high scores (local top 5) -------------------------------------------
  const HISCORE_KEY = 'turrican2_hiscores_v1';
  function loadScores() {
    try { return JSON.parse(localStorage.getItem(HISCORE_KEY)) || []; } catch (e) { return []; }
  }
  function pushScore(score, stageLabel) {
    if (!score) return false;
    const scores = loadScores();
    scores.push({ score, stage: stageLabel, diff: settings.difficulty });
    scores.sort((a, b) => b.score - a.score);
    const top = scores.slice(0, 5);
    try { localStorage.setItem(HISCORE_KEY, JSON.stringify(top)); } catch (e) {}
    return top[0] && top[0].score === score;
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

  function newRun() {
    planIdx = 0;
    continues = 3;
    newBest = false;
    carry = { lives: 3, score: 0, gems: 0, weapons: { spread: 1, beam: 0, bounce: 0 }, weapon: 'spread', bombs: 2, lines: 3 };
    loadStage();
    audio.playVoice('start', true);
  }
  function loadStage() {
    const p = PLAN[planIdx];
    const level = D.buildLevel(p.world, p.stage);
    if (carry) carry.energy = 100;
    stageCarry = JSON.parse(JSON.stringify(carry));
    state = E.createGame(level, carry, { difficulty: settings.difficulty });
    renderer.setLevel(level);
    audio.startMusic(level.world);
    if (level.type === 'shmup' && p.stage === 0) audio.playVoice('shmup', true);
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
  function nextStage() {
    // carry stats forward
    const p = state.player;
    carry = { lives: p.lives, score: p.score, gems: p.gems, weapons: p.weapons,
      weapon: p.weapon, bombs: p.bombs, lines: p.lines, energy: 100 };
    planIdx++;
    if (planIdx >= PLAN.length) {
      mode = 'win'; audio.stopMusic(); audio.play('victory'); audio.playVoice('victory', true);
      newBest = pushScore(p.score, 'CLEAR');
      return;
    }
    mode = 'stageclear'; stageClearT = 2.2; audio.play('complete'); audio.playVoice('clear');
  }

  // ---- main loop ----------------------------------------------------------
  let lastInp = null;   // last merged input frame (keyboard+touch+pad) — QA hook
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!last) last = ts;
    let dt = (ts - last) / 1000; last = ts; if (dt > 0.1) dt = 0.1;
    uiT += dt;

    const inp = input.frame();
    lastInp = inp;
    perfWatch(dt);
    // global keys
    if (inp.mutePressed) audio.toggleMute();

    if (mode === 'title') {
      if (inp.upPressed) { menuIdx = (menuIdx + 1) % 2; audio.play('gem'); }
      if (inp.downPressed) { menuIdx = (menuIdx + 1) % 2; audio.play('gem'); }
      if (inp.startPressed || inp.firePressed) {
        audio.resume();
        if (menuIdx === 0) newRun();
        else { mode = 'options'; optIdx = 0; }
        audio.play('power');
      }
      drawTitle();
      return;
    }
    if (mode === 'options') {
      const ROWS = 7; // master, music, sfx, voice, difficulty, crt, back
      if (inp.upPressed) { optIdx = (optIdx + ROWS - 1) % ROWS; audio.play('gem'); }
      if (inp.downPressed) { optIdx = (optIdx + 1) % ROWS; audio.play('gem'); }
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
        } else if (optIdx === 5) settings.crt = !settings.crt;
        applySettings(); saveSettings(); audio.play('shoot');
      }
      if (inp.startPressed || inp.firePressed) {
        if (optIdx === 5) { settings.crt = !settings.crt; applySettings(); saveSettings(); audio.play('shoot'); }
        else if (optIdx === 6) { mode = 'title'; audio.play('power'); }
      }
      if (inp.pausePressed) mode = 'title';
      drawOptions();
      return;
    }
    if (mode === 'gameover') {
      if (inp.startPressed && continues > 0) { audio.resume(); useContinue(); return; }
      if (inp.pausePressed || (inp.startPressed && continues <= 0)) { mode = 'title'; audio.startMusic('title'); }
      renderer.render(state, 0);
      drawGameOver();
      drawVoiceToast(dt);
      return;
    }
    if (mode === 'win') {
      if (inp.startPressed) { mode = 'title'; audio.startMusic('title'); }
      renderer.render(state, 0);
      drawWin();
      drawVoiceToast(dt);
      return;
    }
    if (mode === 'intro') {
      introT -= dt;
      renderer.render(state, dt);
      drawIntroCard();
      if (introT <= 0 || inp.startPressed) mode = 'playing';
      drawVoiceToast(dt);
      return;
    }
    if (mode === 'stageclear') {
      stageClearT -= dt;
      renderer.render(state, dt);
      drawStageClear();
      if (stageClearT <= 0) loadStage();
      return;
    }
    if (mode === 'paused') {
      const N = 3;
      if (inp.upPressed) { pauseIdx = (pauseIdx + N - 1) % N; audio.play('gem'); }
      if (inp.downPressed) { pauseIdx = (pauseIdx + 1) % N; audio.play('gem'); }
      if (inp.pausePressed) { mode = 'playing'; }
      else if (inp.startPressed || inp.firePressed) {
        if (pauseIdx === 0) mode = 'playing';
        else if (pauseIdx === 1) { carry = stageCarry; loadStage(); }
        else { mode = 'title'; audio.startMusic('title'); }
        audio.play('power');
      }
      renderer.render(state, 0);
      drawPaused();
      return;
    }

    // playing
    if (inp.pausePressed) { mode = 'paused'; pauseIdx = 0; return; }
    window.__tBeamAim = (state.player.weapon === 'beam' && inp.fire);

    acc += dt;
    let steps = 0;
    while (acc >= D.DT && steps < 5) {
      E.step(state, inp, D.VIEW_W, D.VIEW_H);
      acc -= D.DT; steps++;
      // consume sfx / music events
      for (const ev of state.events) {
        if (ev.type === 'sfx') {
          audio.play(ev.name);
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
          audio.playVoice(ev.name, !!ev.pr);
        }
      }
      // one-shot edges must not replay into catch-up steps (double bomb bug)
      inp.jumpPressed = inp.firePressed = inp.morphPressed = inp.switchPressed = false;
      inp.bombPressed = inp.linePressed = inp.jumpReleased = false;
      if (state.won) { nextStage(); break; }
      if (state.gameOver) {
        mode = 'gameover'; audio.stopMusic(); audio.play('gameover'); audio.playVoice('gameover', true);
        newBest = pushScore(state.player.score, stageLabel());
        break;
      }
    }
    if (mode === 'playing') renderer.render(state, dt);
    drawVoiceToast(dt);
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
    // title
    dx.save();
    const glow = 12 + Math.sin(uiT * 2) * 6;
    dx.shadowColor = '#ff5d3b'; dx.shadowBlur = glow;
    centerText('TURRICAN II', DW / 2, DH / 2 - 96, 74, '#ffd23f', '900');
    dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 8;
    centerText('THE FINAL FIGHT', DW / 2, DH / 2 - 44, 30, '#6cf3ff', 'bold');
    dx.restore();
    centerText('— enhanced browser tribute —', DW / 2, DH / 2 - 10, 14, 'rgba(200,210,255,0.6)', 'normal');
    // menu
    const items = ['START MISSION', 'OPTIONS'];
    for (let i = 0; i < items.length; i++) {
      const sel = i === menuIdx;
      const y = DH / 2 + 46 + i * 34;
      if (sel) {
        dx.save(); dx.shadowColor = '#ffd23f'; dx.shadowBlur = 10;
        centerText('▶ ' + items[i] + ' ◀', DW / 2, y, 22, '#ffd23f', '900'); dx.restore();
      } else {
        centerText(items[i], DW / 2, y, 20, 'rgba(200,210,255,0.75)', 'bold');
      }
    }
    centerText('DIFFICULTY: ' + D.DIFFICULTY[settings.difficulty].label, DW / 2, DH / 2 + 122, 13, 'rgba(255,210,63,0.7)', 'bold');
    const best = loadScores()[0];
    if (best) centerText('HI-SCORE  ' + String(best.score).padStart(7, '0') + '  (' + best.stage + ')', DW / 2, 40, 15, 'rgba(139,233,255,0.8)', 'bold');
    centerText('MOVE ←→ · JUMP SPACE · FIRE J/X · AIM ↑↓ · MORPH SHIFT · SWITCH Q · FREEZE C · PAUSE P', DW / 2, DH / 2 + 150, 12, 'rgba(200,210,255,0.65)', 'normal');
    centerText('v' + D.VERSION, DW - 40, DH - 20, 12, 'rgba(255,255,255,0.4)', 'normal');
  }
  function drawOptions() {
    bgPanel();
    dx.save(); dx.shadowColor = '#6cf3ff'; dx.shadowBlur = 12;
    centerText('OPTIONS', DW / 2, 86, 44, '#6cf3ff', '900'); dx.restore();
    const bar = (v) => '█'.repeat(Math.round(v * 10)) + '░'.repeat(10 - Math.round(v * 10));
    const rows = [
      ['MASTER VOLUME', bar(settings.master)],
      ['MUSIC', bar(settings.music)],
      ['SOUND FX', bar(settings.sfx)],
      ['VOICE', bar(settings.voice)],
      ['DIFFICULTY', '◀ ' + D.DIFFICULTY[settings.difficulty].label + ' ▶'],
      ['CRT SCANLINES', settings.crt ? 'ON' : 'OFF'],
      ['BACK', ''],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 160 + i * 44;
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
  function drawStageClear() {
    overlayDim();
    const p = PLAN[planIdx];
    centerText('STAGE CLEAR', DW / 2, DH / 2 - 30, 46, '#54e36b', '900');
    centerText('SCORE ' + state.player.score, DW / 2, DH / 2 + 20, 20, '#fff', 'bold');
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
    bgPanel(); dx.save(); dx.shadowColor = '#ffd23f'; dx.shadowBlur = 18;
    centerText('THE MACHINE IS DESTROYED', DW / 2, DH / 2 - 60, 40, '#ffd23f', '900'); dx.restore();
    centerText('Landorin is free.', DW / 2, DH / 2 - 18, 18, '#cfe0ff', 'normal');
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
        if (mode === 'title' || mode === 'gameover' || mode === 'win' || mode === 'intro' || mode === 'stageclear') {
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
    } else if (!audio.muted && mode === 'title') audio.startMusic('title');
  });

  // unlock WebAudio inside a real user gesture (iOS/Safari requirement)
  const unlockAudio = () => {
    audio.resume();
    if (mode === 'title') audio.startMusic('title');
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // ---- QA hooks (headless testing) ---------------------------------------
  window.__turrican = {
    get mode() { return mode; },
    get state() { return state; },
    start() { audio.resume(); newRun(); },
    goToStage(i) { planIdx = i; loadStage(); },
    step(n, inp) { for (let k = 0; k < (n || 1); k++) E.step(state, inp || {}, D.VIEW_W, D.VIEW_H); return snap(); },
    snapshot: snap, plan: PLAN, D,
    setInput(o) { window.__forceInput = o; },
    get lastInput() { return lastInp; },        // merged keyboard+touch+joystick+pad
    padConnected() { return input.padConnected(); },
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
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

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
      renderer.setFX(false);
      console.log('[Turrican II] slow device: dropped to performance mode');
    }
  }

  applySettings();
  requestAnimationFrame(loop);
  console.log('[Turrican II Redux] v' + D.VERSION + ' booted');
})();

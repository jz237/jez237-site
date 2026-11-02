// DOM screens, HUD, menus (mouse / keyboard / gamepad), popups.
import * as THREE from 'three';
import { settings, saveSettings, progress, isTouch } from './util.js';
import { ACTIONS, keyName } from './input.js';
import { LEVEL_INFO } from './levels.js';
import { QUALITY_NAMES } from './render.js';
import { fmtTime, scoreToTime, MEDAL_ICON, STAR_ICON, STAR_TIP } from './records.js';
import { roomCode, cleanName, cleanRoom } from './coop.js';

const $ = id => document.getElementById(id);
const V = new THREE.Vector3();

export class UI {
  constructor(game) {
    this.g = game; this.screen = null; this.stack = []; this.focus = 0; this.popups = [];
    this.hud = $('hud'); this.toastEl = $('h-toast'); this.capEl = $('h-caption'); this.promptEl = $('h-prompt');
    document.querySelectorAll('.screen button[data-act]').forEach(b => {
      b.addEventListener('click', () => { this.g.audio.unlock(); this.g.audio.play('ui_confirm', { vol: .6 }); this.onAct(b.dataset.act, b); });
      b.addEventListener('mouseenter', () => { const list = this.buttons(); const i = list.indexOf(b); if (i >= 0) this.setFocus(i, false); });
    });
    $('btn-mute').addEventListener('click', () => { settings.muted = !settings.muted; saveSettings(); this.g.audio.unlock(); this.g.audio.applyVolumes(); this.syncMute(); });
    this.syncMute();
    this.capTimer = 0; this.lastHud = {};
    this.buildSettings();
  }
  syncMute() { $('btn-mute').textContent = settings.muted ? '🔇' : '🔊'; }
  show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('show', s.id === id));
    this.screen = id; this.focus = 0;
    if (id) { this.setFocus(0, false); }
    $('touch').hidden = !(isTouch && id === null && this.g.state === 'play' && !this.g.demo);
  }
  push(id) { this.stack.push(this.screen); this.show(id); }
  pop() { const s = this.stack.pop(); this.show(s ?? null); return s; }
  buttons() { const s = this.screen && $(this.screen); return s ? [...s.querySelectorAll('button:not([hidden]):not([disabled])')].filter(b => !b.closest('[hidden]')) : []; }
  setFocus(i, sound = true) {
    const list = this.buttons(); if (!list.length) return;
    this.focus = (i + list.length) % list.length;
    list.forEach((b, k) => b.classList.toggle('focus', k === this.focus));
    if (sound) this.g.audio.play('ui_click', { vol: .5 });
  }
  // gamepad / keyboard menu navigation
  nav(inp) {
    if (!this.screen || this.screen === 'loading') return;
    if (this.screen === 'over' && this.entryActive) { this.entryNav(inp); return; }
    if (this.screen === 'intro') { if (inp.menuOk || inp.jump || inp.act) this.g.beginPlay(); return; }
    if (this.g.input.capture) return; // waiting for a key to bind
    const list = this.buttons(); if (!list.length) return;
    const grid = this.screen === 'select';
    if (this.screen === 'scores' && (inp.menuNav === 'left' || inp.menuNav === 'right')) { this.board = (this.board + (inp.menuNav === 'left' ? -1 : 1) + LEVEL_INFO.length + 1) % (LEVEL_INFO.length + 1); this.loadScores(); return; }
    if (inp.menuNav === 'down' || (grid && inp.menuNav === 'right')) this.setFocus(this.focus + 1);
    if (inp.menuNav === 'up' || (grid && inp.menuNav === 'left')) this.setFocus(this.focus - 1);
    if (this.screen === 'settings' && (inp.menuNav === 'left' || inp.menuNav === 'right')) { const b = list[this.focus]; if (b && b.dataset.set) this.cycleSetting(b, inp.menuNav === 'left' ? -1 : 1); }
    if (inp.menuOk) { const b = list[this.focus]; if (b) b.click(); }
    else if (inp.menuBack && this.screen !== 'title') this.back();
  }
  back() {
    if (this.screen === 'pause') return this.onAct('resume');
    if (this.stack.length) { this.g.audio.play('ui_click', { vol: .5 }); this.pop(); }
  }
  onAct(act, btn) {
    const g = this.g;
    switch (act) {
      case 'start': g.startGame(0); break;
      case 'demo': g.startDemo(false); break;
      case 'select': this.buildSelect(); this.push('select'); break;
      case 'scores': this.board = 0; this.push('scores'); this.loadScores(); break;
      case 'boardPrev': case 'boardNext': this.board = (this.board + (act === 'boardPrev' ? -1 : 1) + LEVEL_INFO.length + 1) % (LEVEL_INFO.length + 1); this.loadScores(); break;
      case 'postTime': this.postTime(); break;
      case 'coop': this.coopOpen(); break;
      case 'coopHost': { const code = roomCode(); $('cp-room').value = code; g.net.connect('host', code, this.coopName()); this.coopRefresh(); break; }
      case 'coopJoin': { const code = cleanRoom($('cp-room').value); if (code.length < 5) { this.coopStatus('Type the 5-letter room code your partner sees, then press JOIN.'); $('cp-room').focus(); break; } g.net.connect('guest', code, this.coopName()); this.coopRefresh(); break; }
      case 'coopShift': this.coopShiftI = ((this.coopShiftI || 0) + 1) % Math.max(1, progress.unlocked); this.coopRefresh(); break;
      case 'coopStart': g.startCoopGame(this.coopShiftI || 0); break;
      case 'coopLeave': g.net.leave(); if (g.partner) { g.partner.dispose(); g.partner = null; } this.coopRefresh(); break;
      case 'help': this.push('help'); break;
      case 'settings': this.push('settings'); break;
      case 'back': this.pop(); break;
      case 'resume': g.resume(); break;
      case 'restart': g.restartLevel(); break;
      case 'quit': g.toTitle(); break;
      case 'next': g.nextLevel(); break;
      case 'retry': g.continueGame(); break;
      case 'title': g.toTitle(); break;
      case 'submit': this.submitEntry(); break;
      case 'shift': g.startGame(+btn.dataset.level); break;
      case 'set': this.cycleSetting(btn, 1); break;
      case 'bind': this.captureKey(btn); break;
      case 'ctlReset': settings.keys = {}; saveSettings(); g.input.rebind(); this.buildControls(); break;
    }
  }
  buildSelect() {
    const el = $('shift-list'); el.innerHTML = '';
    LEVEL_INFO.forEach((L, i) => {
      const b = document.createElement('button'); b.dataset.act = 'shift'; b.dataset.level = i;
      const r = this.g.records.get(L.id);
      const rec = r.medal < 0 ? '<em class="rec">Not finished yet</em>' : `<em class="rec"><b>${MEDAL_ICON[r.medal]}</b> ${fmtTime(r.best)} ${r.starsEver.map((s, k) => `<span class="star${s ? ' on' : ''}" title="${STAR_TIP[k]}">${STAR_ICON[k]}</span>`).join('')}</em>`;
      b.innerHTML = `<small>SHIFT ${i + 1} · ${L.time}</small><span>${L.name}</span><em>${L.desc}</em>${rec}<em class="par">Par ${fmtTime(L.par)}</em>`;
      if (i + 1 > progress.unlocked) { b.disabled = true; b.innerHTML += '<em>🔒 Reach this shift to unlock</em>'; }
      b.addEventListener('click', () => { this.g.audio.unlock(); this.onAct('shift', b); });
      b.addEventListener('mouseenter', () => { const list = this.buttons(); const k = list.indexOf(b); if (k >= 0) this.setFocus(k, false); });
      el.appendChild(b);
    });
  }
  buildSettings() {
    const rows = [
      ['quality', 'Graphics', () => settings.quality === 'auto' ? 'AUTO (' + QUALITY_NAMES[this.g.renderer ? this.g.renderer.q : 2] + ')' : QUALITY_NAMES[+settings.quality]],
      ['music', 'Music volume', () => Math.round(settings.music * 100) + '%'],
      ['sfx', 'Effects volume', () => Math.round(settings.sfx * 100) + '%'],
      ['narration', 'Voice & narration', () => settings.narration ? 'ON' : 'OFF'],
      ['voice', 'Voice volume', () => Math.round(settings.voice * 100) + '%'],
      ['camSens', 'Camera sensitivity', () => settings.camSens.toFixed(1) + '×'],
      ['invertY', 'Invert camera Y', () => settings.invertY ? 'ON' : 'OFF'],
      ['shake', 'Screen shake', () => settings.shake ? 'ON' : 'OFF'],
      ['captions', 'Voice captions', () => settings.captions ? 'ON' : 'OFF'],
      ['hud', 'HUD size', () => Math.round(settings.hud * 100) + '%'],
      ['fps', 'Show FPS', () => settings.fps ? 'ON' : 'OFF'],
      ['ghost', 'Best-run ghost', () => settings.ghost ? 'ON' : 'OFF'],
      ['assistSpeed', 'Assist: enemy speed', () => Math.round(settings.assistSpeed * 100) + '%'],
      ['assistTime', 'Assist: shift clock', () => settings.assistTime > 1 ? '+' + Math.round((settings.assistTime - 1) * 100) + '%' : 'NORMAL'],
      ['assistLives', 'Assist: unlimited hard hats', () => settings.assistLives ? 'ON' : 'OFF'],
      ['controls', 'Keyboard controls', () => 'CHANGE…'],
    ];
    const el = $('set-list'); el.innerHTML = '';
    this.setRows = rows;
    for (const [k, label, val] of rows) {
      const row = document.createElement('div'); row.className = 'row';
      const l = document.createElement('label'); l.textContent = label;
      const b = document.createElement('button'); b.dataset.act = 'set'; b.dataset.set = k; b.textContent = val();
      b.addEventListener('click', () => { this.g.audio.unlock(); this.cycleSetting(b, 1); });
      b.addEventListener('mouseenter', () => { const list = this.buttons(); const i = list.indexOf(b); if (i >= 0) this.setFocus(i, false); });
      row.append(l, b); el.appendChild(row);
    }
    this.applyHud();
  }
  cycleSetting(btn, dir) {
    const k = btn.dataset.set, g = this.g;
    const vol = v => ((Math.round(v * 10) + dir + 11) % 11) / 10;
    if (k === 'quality') {
      const opts = ['auto', 0, 1, 2, 3], i = opts.findIndex(o => String(o) === String(settings.quality));
      settings.quality = opts[(i + dir + opts.length) % opts.length];
      if (settings.quality === 'auto') g.renderer.setQuality(isTouch ? 1 : 3, true); else g.renderer.setQuality(+settings.quality, false);
    } else if (k === 'music' || k === 'sfx' || k === 'voice') { settings[k] = vol(settings[k]); g.audio.applyVolumes(); g.audio.play('ui_click'); }
    else if (k === 'camSens') { const o = [.5, .7, 1, 1.3, 1.6, 2], i = o.indexOf(settings.camSens); settings.camSens = o[((i < 0 ? 2 : i) + dir + o.length) % o.length]; }
    else if (k === 'hud') { const o = [.8, .9, 1, 1.15, 1.3], i = o.indexOf(settings.hud); settings.hud = o[((i < 0 ? 2 : i) + dir + o.length) % o.length]; this.applyHud(); }
    else if (k === 'assistSpeed') { const o = [1, .85, .7, .55], i = o.indexOf(settings.assistSpeed); settings.assistSpeed = o[((i < 0 ? 0 : i) + dir + o.length) % o.length]; }
    else if (k === 'assistTime') { const o = [1, 1.25, 1.5, 2], i = o.indexOf(settings.assistTime); settings.assistTime = o[((i < 0 ? 0 : i) + dir + o.length) % o.length]; }
    else if (k === 'controls') { this.buildControls(); this.push('controls'); return; }
    else { settings[k] = !settings[k]; if (k === 'narration') { if (!settings.narration) g.audio.stopSpeech(); g.audio.play('ui_click'); } }
    saveSettings();
    const row = this.setRows.find(r => r[0] === k); btn.textContent = row[2]();
    $('h-fps').hidden = !settings.fps;
  }
  applyHud() { document.documentElement.style.setProperty('--hud-scale', settings.hud); $('h-fps').hidden = !settings.fps; }
  // ---- keyboard remapping
  buildControls() {
    const el = $('ctl-list'), B = this.g.input.bind; el.innerHTML = '';
    for (const [id, label] of ACTIONS) {
      const row = document.createElement('div'); row.className = 'row';
      const l = document.createElement('label'); l.textContent = label;
      const b = document.createElement('button'); b.dataset.act = 'bind'; b.dataset.bind = id;
      b.textContent = keyName(B[id][0]) + (B[id][1] ? '  ·  ' + keyName(B[id][1]) : '');
      b.addEventListener('click', () => { this.g.audio.unlock(); this.captureKey(b); });
      b.addEventListener('mouseenter', () => { const list = this.buttons(); const i = list.indexOf(b); if (i >= 0) this.setFocus(i, false); });
      row.append(l, b); el.appendChild(row);
    }
    if (this.screen === 'controls') this.setFocus(this.focus, false);
  }
  captureKey(btn) {
    const id = btn.dataset.bind, inp = this.g.input;
    btn.textContent = 'PRESS A KEY…  (ESC cancels)'; btn.classList.add('capture');
    setTimeout(() => {
      inp.capture = code => {
        if (code !== 'Escape') { settings.keys = Object.assign({}, settings.keys, { [id]: code }); saveSettings(); inp.rebind(); this.g.audio.play('ui_confirm', { vol: .6 }); }
        const f = this.focus; this.buildControls(); this.setFocus(f, false);
      };
    }, 0);
  }
  // ---- HUD
  showHud(on) { this.hud.hidden = !on; $('touch').hidden = !(isTouch && on && !this.g.demo); }
  demo(on) { $('demo-banner').hidden = !on; $('h-bot').hidden = !on; $('demo-banner').querySelector('small').textContent = isTouch ? 'Tap STOP to play' : 'Press any key to play'; this.lastBot = null; }
  botStatus(t) { if (t !== this.lastBot) { this.lastBot = t; $('h-bot').textContent = '🤖 ' + t; } }
  updateHud(s) {
    const L = this.lastHud;
    if (L.score !== s.score) { $('h-score').textContent = s.score.toLocaleString(); L.score = s.score; }
    if (L.hi !== s.hi) { $('h-hi').textContent = s.hi.toLocaleString(); L.hi = s.hi; }
    const tsec = Math.max(0, Math.ceil(s.time));
    if (L.t !== tsec) { $('h-time-n').textContent = Math.floor(tsec / 60) + ':' + String(tsec % 60).padStart(2, '0'); L.t = tsec; }
    const tb = $('h-time'); tb.style.width = (Math.max(0, s.time / s.timeMax) * 100).toFixed(1) + '%'; tb.classList.toggle('low', s.time < 30);
    if (L.shift !== s.shift) { $('h-shift').textContent = s.shift; L.shift = s.shift; }
    if (L.round !== s.round) { $('h-round').textContent = 'ROUND ' + s.round; L.round = s.round; }
    const rk = s.run == null ? '' : fmtTime(Math.floor(s.run * 10) / 10).slice(0, -1) + (s.best != null ? '  ·  BEST ' + fmtTime(s.best) : '');
    if (L.rk !== rk) { $('h-best').textContent = rk; L.rk = rk; }
    const lk = s.lives + (s.shield ? 'g' : '');
    if (L.lives !== lk) { $('h-lives').innerHTML = (s.shield ? '<i class="gold" title="Gold hat"></i>' : '') + '<i></i>'.repeat(Math.max(0, s.lives)); L.lives = lk; }
    const ok = s.objKey; if (L.obj !== ok) { $('h-obj').innerHTML = s.objHtml; L.obj = ok; }
    const pk = s.powers.join('|'); if (L.pw !== pk) { $('h-powers').innerHTML = s.powers.map(p => `<span>${p}</span>`).join(''); L.pw = pk; }
  }
  prompt(text) {
    if (this.lastPrompt === text) return; this.lastPrompt = text;
    if (text) this.promptEl.textContent = text;
    this.promptEl.classList.toggle('show', !!text);
  }
  toast(text) { const t = this.toastEl; t.textContent = text; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); }
  caption(text) { if (!settings.captions) return; this.capEl.textContent = text; this.capEl.classList.add('show'); this.capTimer = Math.max(2.4, text.length * .06); }
  popup(text, pos, color = '#fff6e2') {
    const el = document.createElement('div'); el.textContent = text;
    el.style.cssText = `position:fixed;left:0;top:0;font:20px Bungee,Impact,sans-serif;color:${color};text-shadow:0 2px 0 #000,0 0 10px rgba(0,0,0,.6);pointer-events:none;z-index:7;white-space:nowrap;will-change:transform`;
    document.body.appendChild(el); this.popups.push({ el, pos: pos.clone(), t: 0 });
  }
  update(dt, camera) {
    if (this.capTimer > 0) { this.capTimer -= dt; if (this.capTimer <= 0) this.capEl.classList.remove('show'); }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i]; p.t += dt;
      V.copy(p.pos); V.y += 1.6 + p.t * 1.2; V.project(camera);
      const x = (V.x * .5 + .5) * innerWidth, y = (-V.y * .5 + .5) * innerHeight;
      p.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${1 + Math.max(0, .3 - p.t)})`;
      p.el.style.opacity = String(Math.max(0, 1 - Math.max(0, p.t - .7) / .5));
      if (p.t > 1.2 || V.z > 1) { p.el.remove(); this.popups.splice(i, 1); }
    }
  }
  clearPopups() { for (const p of this.popups) p.el.remove(); this.popups.length = 0; }
  // ---- intro / clear / over
  intro(level, round) {
    $('i-time').textContent = level.time; $('i-name').textContent = level.name;
    $('i-shift').textContent = `SHIFT ${level.index + 1} · ROUND ${round}`; $('i-brief').textContent = level.brief;
    $('i-go').innerHTML = this.g.coopGuest ? 'Co-op: waiting for the host to start…' : isTouch ? 'Tap to start' : 'Press <kbd>Space</kbd> / <kbd>A</kbd> or click to start';
    this.show('intro');
    $('intro').onclick = () => this.g.beginPlay();
  }
  tally(rows, title) {
    $('c-title').textContent = title;
    const el = $('c-tally'); el.innerHTML = '';
    rows.forEach(([l, v, cls], i) => { const d = document.createElement('div'); if (cls) d.className = cls; d.style.animationDelay = (i * .25) + 's'; d.innerHTML = `<span>${l}</span><b>${v}</b>`; el.appendChild(d); });
    this.show('clear');
  }
  // shift-time board entry on the tally screen (R null hides it)
  recordEntry(R) {
    const box = $('c-record'); box.hidden = !R;
    if (!R) return;
    const inp = $('c-ini'); inp.value = (progress.initials || 'MAC').slice(0, 3); inp.hidden = false;
    box.querySelector('p').innerHTML = `Top-10 time for this shift: <b>${fmtTime(R.secs)}</b>. Post it as`;
    box.querySelector('button').hidden = false;
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); this.postTime(); } };
    inp.oninput = () => { inp.value = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3); };
    const list = this.buttons(), next = list.findIndex(x => x.dataset.act === 'next'); this.setFocus(next < 0 ? 0 : next, false); // NEXT SHIFT keeps the focus
  }
  async postTime() {
    const ini = ($('c-ini').value || 'MAC').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, 'A').slice(0, 3);
    $('c-record').querySelector('p').textContent = 'Posting…';
    await this.g.postShiftTime(ini);
    $('c-record').querySelector('p').textContent = `Posted as ${ini}! See it under Leaderboard → shift times.`;
    $('c-record').querySelector('button').hidden = true; $('c-ini').hidden = true;
    this.setFocus(0, false);
  }
  // ---- online co-op lobby
  coopName() { const n = cleanName($('cp-name').value) || progress.initials || 'MAC'; progress.coopName = n; try { localStorage.setItem('hhm3d-progress-v1', JSON.stringify(progress)); } catch {} return n; }
  coopOpen() {
    $('cp-name').value = progress.coopName || progress.initials || 'MAC';
    if (this.screen !== 'coop') { if (this.screen === 'title') this.push('coop'); else { this.stack = ['title']; this.show('coop'); } }
    this.coopRefresh();
  }
  coopStatus(t) { $('cp-status').textContent = t; this.coopRefresh(); }
  coopRefresh() {
    const n = this.g.net, on = !!n.ws, linked = n.linked, host = n.role === 'host', el = $('coop');
    el.querySelector('[data-act=coopHost]').hidden = on; el.querySelector('[data-act=coopJoin]').hidden = on;
    el.querySelector('[data-act=coopLeave]').hidden = !on;
    const sb = el.querySelector('[data-act=coopShift]'), st = el.querySelector('[data-act=coopStart]');
    sb.hidden = st.hidden = !(linked && host);
    const i = Math.min(this.coopShiftI || 0, Math.max(0, progress.unlocked - 1)); this.coopShiftI = i;
    sb.textContent = `SHIFT: ${i + 1} · ${LEVEL_INFO[i].name}`;
    $('cp-room').readOnly = on;
    if (this.screen === 'coop') this.setFocus(Math.min(this.focus, this.buttons().length - 1), false);
  }
  coopWaiting(on) { $('c-wait').hidden = !on; $('clear').querySelector('[data-act=next]').hidden = on; }
  coopPause(on) { $('p-coop').hidden = !on; }
  gameOver(score, qualifies, continued) {
    $('o-score').textContent = score.toLocaleString();
    this.entryActive = qualifies && !continued; $('o-entry').hidden = !this.entryActive;
    $('o-menu').querySelector('[data-act=submit]').hidden = !this.entryActive;
    if (this.entryActive) { this.initials = (progress.initials || 'MAC').padEnd(3, 'A').slice(0, 3).split(''); this.ipos = 0; this.drawInitials(); this.bindEntryInput(); }
    this.show('over');
  }
  drawInitials() { const s = $('o-initials').children; for (let i = 0; i < 3; i++) { s[i].textContent = this.initials[i]; s[i].classList.toggle('on', i === this.ipos); } }
  bindEntryInput() {
    const inp = $('o-input'); inp.value = '';
    if (isTouch) { $('o-initials').onclick = () => inp.focus(); }
    inp.oninput = () => { const v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); for (let i = 0; i < 3; i++) if (v[i]) this.initials[i] = v[i]; this.ipos = Math.min(2, v.length); this.drawInitials(); };
    this.keyHandler = e => {
      if (!this.entryActive || this.screen !== 'over') return;
      if (/^[a-zA-Z0-9]$/.test(e.key) && e.target.tagName !== 'INPUT') { this.initials[this.ipos] = e.key.toUpperCase(); this.ipos = Math.min(2, this.ipos + 1); this.drawInitials(); }
      if (e.key === 'Backspace') { this.ipos = Math.max(0, this.ipos - 1); this.drawInitials(); }
    };
    addEventListener('keydown', this.keyHandler);
  }
  entryNav(inp) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nv = inp.menuNavArrows; // arrows / d-pad only: letter keys type initials
    if (nv === 'up' || nv === 'down') { const c = A.indexOf(this.initials[this.ipos]); this.initials[this.ipos] = A[(c + (nv === 'up' ? 1 : -1) + A.length) % A.length]; this.drawInitials(); this.g.audio.play('ui_click', { vol: .4 }); }
    if (nv === 'left') { this.ipos = Math.max(0, this.ipos - 1); this.drawInitials(); }
    if (nv === 'right') { this.ipos = Math.min(2, this.ipos + 1); this.drawInitials(); }
    if (inp.menuOk && !inp.jump) this.submitEntry();
    else if (inp.jump && this.g.input.usingPad) this.submitEntry();
  }
  async submitEntry() {
    if (!this.entryActive) return;
    this.entryActive = false; removeEventListener('keydown', this.keyHandler);
    const ini = this.initials.join(''); progress.initials = ini;
    await this.g.scores.submit(ini, this.g.score, this.g.scoreExtra());
    this.g.audio.play('ui_confirm');
    this.stack = ['title']; this.show('scores'); this.loadScores(ini);
  }
  async loadScores(mine) {
    const bi = this.board || 0, info = bi ? LEVEL_INFO[bi - 1] : null, ticket = this.boardTicket = (this.boardTicket || 0) + 1;
    $('s-title').textContent = info ? `SHIFT ${bi} · ${info.name}` : 'HIGH SCORES';
    $('s-src').textContent = 'Loading…'; $('s-list').innerHTML = '';
    const { rows, global } = await (info ? this.g.shiftBoard(info.id) : this.g.scores).fetch();
    if (ticket !== this.boardTicket) return;
    $('s-src').textContent = (info ? 'Fastest shift times · ' : '') + (global ? 'Global leaderboard' : 'Offline — showing this device') + '  ·  ◀ ▶ switch board';
    const fmt = r => info ? fmtTime(scoreToTime(r.score)) : r.score.toLocaleString();
    if (info) rows.splice(0, rows.length, ...rows.filter(r => scoreToTime(r.score) >= 25));
    $('s-list').innerHTML = rows.length ? rows.map(r => `<li class="${mine && r.name === mine && r.score === this.g.score ? 'me' : ''}"><b>${r.name}</b><span>${fmt(r)}</span><i>${info ? (r.extra || '').split(' · ')[0] : r.extra || ''}</i></li>`).join('') : '<li class="empty"><span>No times yet — be the first!</span></li>';
  }
  loading(f, text) { $('load-bar').style.width = (f * 100).toFixed(0) + '%'; if (text) $('load-text').textContent = text; }
}

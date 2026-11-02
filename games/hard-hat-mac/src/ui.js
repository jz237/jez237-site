// DOM screens, HUD, menus (mouse / keyboard / gamepad), popups.
import * as THREE from 'three';
import { settings, saveSettings, progress, isTouch } from './util.js';
import { LEVEL_INFO } from './levels.js';
import { QUALITY_NAMES } from './render.js';

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
    $('touch').hidden = !(isTouch && id === null && this.g.state === 'play');
  }
  push(id) { this.stack.push(this.screen); this.show(id); }
  pop() { const s = this.stack.pop(); this.show(s ?? null); return s; }
  buttons() { const s = this.screen && $(this.screen); return s ? [...s.querySelectorAll('button:not([hidden]):not([disabled])')] : []; }
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
    const list = this.buttons(); if (!list.length) return;
    const grid = this.screen === 'select';
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
      case 'select': this.buildSelect(); this.push('select'); break;
      case 'scores': this.push('scores'); this.loadScores(); break;
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
    }
  }
  buildSelect() {
    const el = $('shift-list'); el.innerHTML = '';
    LEVEL_INFO.forEach((L, i) => {
      const b = document.createElement('button'); b.dataset.act = 'shift'; b.dataset.level = i;
      b.innerHTML = `<small>SHIFT ${i + 1} · ${L.time}</small><span>${L.name}</span><em>${L.desc}</em>`;
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
      ['voice', 'Voice volume', () => Math.round(settings.voice * 100) + '%'],
      ['camSens', 'Camera sensitivity', () => settings.camSens.toFixed(1) + '×'],
      ['invertY', 'Invert camera Y', () => settings.invertY ? 'ON' : 'OFF'],
      ['shake', 'Screen shake', () => settings.shake ? 'ON' : 'OFF'],
      ['captions', 'Voice captions', () => settings.captions ? 'ON' : 'OFF'],
      ['hud', 'HUD size', () => Math.round(settings.hud * 100) + '%'],
      ['fps', 'Show FPS', () => settings.fps ? 'ON' : 'OFF'],
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
    else settings[k] = !settings[k];
    saveSettings();
    const row = this.setRows.find(r => r[0] === k); btn.textContent = row[2]();
    $('h-fps').hidden = !settings.fps;
  }
  applyHud() { document.documentElement.style.setProperty('--hud-scale', settings.hud); $('h-fps').hidden = !settings.fps; }
  // ---- HUD
  showHud(on) { this.hud.hidden = !on; $('touch').hidden = !(isTouch && on); }
  updateHud(s) {
    const L = this.lastHud;
    if (L.score !== s.score) { $('h-score').textContent = s.score.toLocaleString(); L.score = s.score; }
    if (L.hi !== s.hi) { $('h-hi').textContent = s.hi.toLocaleString(); L.hi = s.hi; }
    const tsec = Math.max(0, Math.ceil(s.time));
    if (L.t !== tsec) { $('h-time-n').textContent = Math.floor(tsec / 60) + ':' + String(tsec % 60).padStart(2, '0'); L.t = tsec; }
    const tb = $('h-time'); tb.style.width = (Math.max(0, s.time / s.timeMax) * 100).toFixed(1) + '%'; tb.classList.toggle('low', s.time < 30);
    if (L.shift !== s.shift) { $('h-shift').textContent = s.shift; L.shift = s.shift; }
    if (L.round !== s.round) { $('h-round').textContent = 'ROUND ' + s.round; L.round = s.round; }
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
    $('i-go').innerHTML = isTouch ? 'Tap to start' : 'Press <kbd>Space</kbd> / <kbd>A</kbd> or click to start';
    this.show('intro');
    $('intro').onclick = () => this.g.beginPlay();
  }
  tally(rows, title) {
    $('c-title').textContent = title;
    const el = $('c-tally'); el.innerHTML = '';
    rows.forEach(([l, v, cls], i) => { const d = document.createElement('div'); if (cls) d.className = cls; d.style.animationDelay = (i * .25) + 's'; d.innerHTML = `<span>${l}</span><b>${v}</b>`; el.appendChild(d); });
    this.show('clear');
  }
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
    $('s-src').textContent = 'Loading…'; $('s-list').innerHTML = '';
    const { rows, global } = await this.g.scores.fetch();
    $('s-src').textContent = global ? 'Global leaderboard' : 'Offline — showing scores from this device';
    $('s-list').innerHTML = rows.length ? rows.map(r => `<li class="${mine && r.name === mine && r.score === this.g.score ? 'me' : ''}"><b>${r.name}</b><span>${r.score.toLocaleString()}</span><i>${r.extra || ''}</i></li>`).join('') : '<li><span>No scores yet — be the first!</span></li>';
  }
  loading(f, text) { $('load-bar').style.width = (f * 100).toFixed(0) + '%'; if (text) $('load-text').textContent = text; }
}

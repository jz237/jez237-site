// Hard Hat Mac: Skyline — game orchestration.
import * as THREE from 'three';
import { Renderer } from './render.js';
import { buildMaterials, CUT } from './textures.js';
import { Environment } from './env.js';
import { FX } from './fx.js';
import { AudioEngine } from './audio.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { Player } from './player.js';
import { Enemy } from './enemies.js';
import { buildLevel } from './level.js';
import { Bot } from './bot.js';
import { LEVEL_INFO } from './levels.js';
import { settings, saveSettings, progress, saveProgress, clamp, damp, angleDamp, wrapAngle, rr, isTouch } from './util.js';

const SCORE_API = 'https://game-scores.jez237.workers.dev/scores/hard-hat-mac-skyline-v1';
const LOCAL_KEY = 'hhm3d-scores-v1';
const STEP = 1 / 120;
const V = new THREE.Vector3(), V2 = new THREE.Vector3();

class Scores {
  local() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; } }
  saveLocal(name, score, extra) {
    const rows = this.local(); rows.push({ name, score, extra }); rows.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 10))); } catch {}
  }
  async fetch() {
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 7000);
      const r = await fetch(SCORE_API, { signal: ctl.signal }); clearTimeout(tm);
      if (!r.ok) throw 0;
      const data = await r.json();
      const rows = (Array.isArray(data) ? data : data.scores || []).map(x => ({ name: String(x.initials || x.name || '???').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3), score: Number(x.score), extra: String(x.extra || '').slice(0, 24) }))
        .filter(x => Number.isSafeInteger(x.score) && x.score > 0 && x.score < 1e8).sort((a, b) => b.score - a.score).slice(0, 10);
      this.cache = rows; return { rows, global: true };
    } catch { return { rows: this.local(), global: false }; }
  }
  async qualifies(score) {
    if (score <= 0) return false;
    const { rows } = await this.fetch(); return rows.length < 10 || score > rows[rows.length - 1].score;
  }
  async submit(initials, score, extra) {
    this.saveLocal(initials, score, extra);
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 7000);
      await fetch(SCORE_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials, score, extra }), signal: ctl.signal });
      clearTimeout(tm);
    } catch {}
  }
}

class CamRig {
  constructor(camera) { this.c = camera; this.yaw = 0; this.yawT = 0; this.pitch = .62; this.dist = 12; this.distT = 12; this.target = new THREE.Vector3(); this.shakeA = 0; this.mode = 'follow'; this.orbit = { c: new THREE.Vector3(), d: 34, p: .38, s: .12 }; }
  snap(p, yaw) { this.yaw = this.yawT = yaw; this.target.set(p.body.x, p.body.y + 1.25, p.body.z); }
  update(dt, game, inp) {
    const p = game.player, b = p.body;
    if (this.mode === 'follow') {
      this.yawT += inp.camX; this.pitch = clamp(this.pitch + inp.camY, .16, 1.2);
      if (inp.rotL) this.yawT += Math.PI / 4; if (inp.rotR) this.yawT -= Math.PI / 4;
      if (inp.recenter) this.yawT = this.yaw + wrapAngle(p.yaw + Math.PI - this.yaw);
      if (game.demo && performance.now() - (game.input.lookT || 0) > 2500) {
        // demo camera: settle behind Mac's direction of travel, face the ladder while climbing
        let want = null;
        if (p.state === 'climb' && p.ladder) want = Math.atan2(p.ladder.fx, p.ladder.fz) + .35;
        else if (game.bot && Math.hypot(game.bot.sx, game.bot.sz) > .5 && Math.hypot(b.vx, b.vz) > 1.5) want = Math.atan2(-game.bot.sx, -game.bot.sz) + .3;
        if (want !== null) this.yawT += wrapAngle(want - this.yawT) * (1 - Math.exp(-.6 * dt));
      }
      if (game.level && game.level.indoor) this.yawT = clamp(this.yawT, -1.2, 1.2);
      this.yaw = damp(this.yaw, this.yawT, 12, dt);
      this.distT = clamp(this.distT + (inp.zoomStep || 0) * 1.3, 6, 22); this.dist = damp(this.dist, this.distT, 8, dt);
      const tx = b.x + b.vx * .28, ty = b.y + 1.25, tz = b.z + b.vz * .28;
      const kxz = p.dead ? 2 : 7, ky = p.state === 'climb' ? 8 : b.onGround ? 5 : 2.6;
      this.target.x = damp(this.target.x, tx, kxz, dt); this.target.z = damp(this.target.z, tz, kxz, dt);
      if (!(p.dead && p.deathMode === 'gone')) this.target.y = damp(this.target.y, ty, ky, dt);
    } else {
      const o = this.orbit; this.yaw += dt * o.s; this.pitch = damp(this.pitch, o.p, 2, dt); this.dist = damp(this.dist, o.d, 2, dt);
      this.target.lerp(o.c, 1 - Math.exp(-2 * dt));
    }
    const cp = Math.cos(this.pitch);
    const pos = V.set(this.target.x + Math.sin(this.yaw) * cp * this.dist, this.target.y + Math.sin(this.pitch) * this.dist, this.target.z + Math.cos(this.yaw) * cp * this.dist);
    if (this.shakeA > 0) { this.shakeA = Math.max(0, this.shakeA - dt * 1.6); const s = this.shakeA * this.shakeA * .5; pos.x += rr(-s, s); pos.y += rr(-s, s); pos.z += rr(-s, s); }
    this.c.position.copy(pos); this.c.lookAt(this.target);
  }
}

class Game {
  constructor() {
    this.state = 'boot'; this.time = 0; this.score = 0; this.lives = 3; this.round = 1; this.levelIndex = 0;
    this.wind = new THREE.Vector3(); this.frozen = false; this.freezeT = 0; this.diff = { speed: 1, hazard: 1 };
    this.enemies = []; this.cheer = false; this.continued = false; this.timeScale = 1; this.kos = 0; this.hitStop = 0;
  }
  async boot() {
    const canvas = document.getElementById('gl');
    this.audio = new AudioEngine(); this.ui = new UI(this); this.input = new Input(canvas); this.scores = new Scores();
    this.ui.loading(.04, 'Pouring the foundations…');
    this.renderer = new Renderer(canvas);
    const q = this.renderer.q;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 2200);
    this.renderer.setup(this.scene, this.camera);
    this.renderer.onResize = (w, h) => this.fx.setScale(h * this.renderer.dpr, this.camera.fov);
    this.renderer.onQuality = (nq) => this.onQuality(nq);
    await tick();
    this.ui.loading(.1, 'Painting the steel…');
    this.M = buildMaterials(this.renderer.r, q);
    for (const v of Object.values(this.M)) if (v && v.isMaterial) v.userData.shared = true;
    this.M.facades.forEach(f => f.userData.shared = true);
    await tick();
    this.env = new Environment(this.renderer.r, this.scene, q);
    this.fx = new FX(this.scene, q); this.fx.setScale(innerHeight * this.renderer.dpr, this.camera.fov);
    this.player = new Player(this); this.scene.add(this.player.root, this.player.marker);
    this.cam = new CamRig(this.camera);
    this.audio.captionFn = t => this.ui.caption(t);
    this.ui.loading(.2, 'Recording the crew…');
    await this.audio.load(f => this.ui.loading(.2 + f * .55, 'Recording the crew…'));
    this.ui.loading(.8, 'Raising the frame…');
    await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]);
    this.loadLevel(0, true);
    this.ui.loading(1, 'Ready!');
    await tick();
    this.toTitle(true);
    const unlock = () => {
      this.audio.unlock();
      if (this.state === 'title' && !this.titleVoiced) { this.titleVoiced = true; this.audio.playMusic('mus_title'); setTimeout(() => this.audio.voice('an_title', .9), 600); }
    };
    addEventListener('pointerdown', unlock); addEventListener('keydown', unlock); addEventListener('touchstart', unlock);
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.state === 'play') this.pause(); });
    this.last = performance.now(); this.lastInput = this.last;
    addEventListener('pointermove', () => { this.lastInput = performance.now(); }, { passive: true });
    requestAnimationFrame(t => this.frame(t));
    const qs = new URLSearchParams(location.search);
    if (qs.has('demo')) this.startDemo(false);
    this.noAttract = qs.has('noattract') || navigator.webdriver;
  }
  onQuality(q) {
    const s = q >= 3 ? 4096 : q >= 2 ? 2048 : 1024, sh = this.env.sun.shadow;
    if (sh.mapSize.x !== s) { sh.mapSize.set(s, s); if (sh.map) { sh.map.dispose(); sh.map = null; } }
    this.fx.setScale(innerHeight * this.renderer.dpr, this.camera.fov);
  }
  // ---------------- levels ----------------
  loadLevel(i, attract = false) {
    if (this.level) {
      this.scene.remove(this.level.group); this.level.dispose(); this.audio.stopMotors();
      for (const e of this.enemies) this.scene.remove(e.root);
    }
    this.levelIndex = i;
    this.level = buildLevel(i, this.M, this.renderer.q);
    this.scene.add(this.level.group);
    this.world = this.level.world; this.objects = this.level.objects;
    this.env.apply(this.level.sky, this.level); this.env.buildCity(this.level, this.M);
    this.diff = { speed: Math.min(1.5, 1 + (this.round - 1) * .12), hazard: Math.min(1.6, 1 + (this.round - 1) * .15) };
    this.enemies = attract ? [] : this.level.enemyDefs.filter(d => (d.minRound || 1) <= this.round).map(d => new Enemy(d, this));
    for (const e of this.enemies) this.scene.add(e.root);
    this.player.shield = false; this.player.koT = 0; this.player.reset(this.level.spawn);
    this.cam.snap(this.player, this.level.camYaw);
    this.timeMax = Math.round(this.level.timeLimit * Math.max(.65, 1 - (this.round - 1) * .08)); this.timeLeft = this.timeMax;
    this.deaths = 0; this.kos = 0; this.hitStop = 0; this.hurried = false; this.frozen = false; this.freezeT = 0; this.wind.set(0, 0, 0); this.cheer = false; this.topBeam = null; this.finale = null;
    this.scoreAtStart = this.score; this.fx.clear(); this.ui.clearPopups();
    this.audio.ambience(this.level.amb);
    this.prewarm();
  }
  prewarm() {
    const r = this.renderer.r;
    try { r.setRenderTarget(this.renderer.composer.renderTarget1); r.compile(this.scene, this.camera); } catch {}
    r.setRenderTarget(null);
  }
  startGame(i) {
    this.score = 0; this.lives = 3; this.round = 1; this.continued = false; this.nextLife = 25000;
    this.player.grabFilter = undefined;
    this.audio.unlock(); this.loadLevel(i); this.intro();
  }
  intro() {
    this.state = 'intro'; this.ui.showHud(false); this.ui.intro(this.level, this.round); this.ui.stack = [];
    const L = this.level, [x0, z0, x1, z1] = L.bounds;
    this.cam.mode = 'orbit'; this.cam.orbit.c.set((x0 + x1) / 4, L.high ? 6 : 7, (z0 + z1) / 4); this.cam.orbit.d = L.index === 2 ? 30 : 32; this.cam.orbit.p = .42; this.cam.orbit.s = .1;
    this.cam.yaw = L.camYaw - .9;
    this.audio.playMusic(L.music); this.introT = 0;
    const line = this.demo && L.index === 0 ? 'fm_demo' : L.voice;
    clearTimeout(this.voiceT); this.voiceT = setTimeout(() => { if (this.state === 'intro') this.audio.voice(line, 1); }, 700);
  }
  beginPlay() {
    if (this.state !== 'intro') return;
    this.state = 'play'; this.ui.show(null); this.ui.showHud(true); this.cam.mode = 'follow'; this.cam.snap(this.player, this.level.camYaw); this.cam.pitch = .62;
    this.audio.voice('an_go', .8); this.audio.play('timeup', { vol: .35 });
    this.player.invuln = 2;
    if (this.bot) this.bot.reset();
    this.canvasFocus();
  }
  canvasFocus() { try { document.getElementById('gl').focus({ preventScroll: true }); } catch {} }
  nextLevel() {
    let i = this.levelIndex + 1;
    if (i >= 4) { i = 0; this.round++; setTimeout(() => this.audio.voice('fm_round'), 1500); }
    if (!this.demo) { progress.unlocked = Math.max(progress.unlocked, Math.min(4, i + 1)); saveProgress(); }
    this.loadLevel(i); this.intro();
  }
  restartLevel() { this.score = this.scoreAtStart; this.loadLevel(this.levelIndex); this.intro(); }
  continueGame() { this.score = 0; this.lives = 3; this.continued = true; this.nextLife = 25000; this.loadLevel(this.levelIndex); this.intro(); }
  toTitle(first = false) {
    this.state = 'title'; this.ui.showHud(false); this.ui.stack = []; this.ui.show('title');
    if (!first) { this.round = 1; this.loadLevel(0, true); }
    this.lastInput = performance.now();
    this.cam.mode = 'orbit'; this.cam.orbit.c.set(0, 9, 0); this.cam.orbit.d = 38; this.cam.orbit.p = .3; this.cam.orbit.s = .05; this.cam.target.set(0, 9, 0); this.cam.yaw = -.5; this.cam.pitch = .3; this.cam.dist = 38;
    this.player.reset({ x: -2, y: 0, z: 9.5, yaw: .3 });
    if (this.titleVoiced) this.audio.playMusic('mus_title');
  }
  // ---------------- demo playthrough ----------------
  startDemo(attract = false) {
    this.demo = true; this.demoAttract = attract; this.bot = new Bot(this);
    this.score = 0; this.lives = 3; this.round = 1; this.continued = true; this.nextLife = 25000;
    this.audio.unlock(); this.ui.demo(true);
    this.loadLevel(0); this.intro();
  }
  stopDemo() {
    if (!this.demo) return;
    this.demo = false; this.bot = null; this.player.grabFilter = undefined; this.ui.demo(false); this.toast(''); this.toTitle();
  }
  pause() { if (this.state !== 'play') return; this.state = 'pause'; this.ui.show('pause'); this.ui.stack = []; this.audio.applyVolumes(); }
  resume() { if (this.state !== 'pause') return; this.state = 'play'; this.ui.stack = []; this.ui.show(null); this.canvasFocus(); }
  // ---------------- gameplay callbacks ----------------
  shake(a, pos) { if (!settings.shake) return; let k = 1; if (pos) k = clamp(1 - this.player.pos.distanceTo(pos) / 14, 0, 1); this.cam.shakeA = Math.max(this.cam.shakeA, a * k); if (k > .3) this.input.rumble(a, 140); }
  toast(t) { this.ui.toast(t); }
  caption(t) { this.ui.caption(t); }
  addScore(n, pos, isCombo) {
    this.score += n;
    if (pos) this.ui.popup('+' + n, pos, isCombo ? '#ffc21a' : '#fff6e2');
    if (this.score >= this.nextLife) { this.nextLife += 25000; this.lives++; this.audio.play('extra_life'); this.toast('EXTRA HARD HAT!'); }
    if (this.score > progress.hi && !this.demo) { progress.hi = this.score; }
  }
  killPlayer(reason) {
    const p = this.player; if (p.dead || this.state !== 'play') return;
    const mode = { fall: 'fall', void: 'void', squash: 'squash', molten: 'molten' }[reason] || 'knock';
    p.die(mode); this.deaths++;
    this.toast({ fall: 'SPLAT!', void: 'WHOOPS!', squash: 'SQUASHED!', molten: 'TOO HOT!', zap: 'ZAPPED!', bolt: 'BONK!', inspector: 'CITATION!', vandal: 'MUGGED!', dog: 'CHOMP!', pipe: 'ROLLED!', wreck: 'WRECKED!', time: "TIME'S UP!" }[reason] || 'OUCH!');
    this.input.rumble(.9, 300);
  }
  hitPlayer(reason, o = {}) {
    const p = this.player; if (p.dead || p.invuln > 0 || this.state !== 'play') return;
    if (p.shield) {
      p.shield = false; p.invuln = 1.8; this.toast('GOLD HAT SAVED YOU!'); this.audio.play('hardhat', { vol: 1 });
      if (o.push) { p.body.vx = o.push.x * .5; p.body.vz = o.push.z * .5; p.body.vy = 5; p.body.onGround = false; }
      return;
    }
    this.killPlayer(reason);
  }
  // Hammer swing or stomp knocked an enemy out.
  knockOut(e, dx, dz, how) {
    const hammer = how === 'hammer', fresh = e.knockOut(dx, dz, hammer ? 7.5 : 3);
    if (!fresh) return;
    const p = this.player;
    p.koChain = (p.koT > 0 ? p.koChain || 0 : 0) + 1; p.koT = 3; this.kos++;
    const pos = V.copy(e.root.position).setY(e.body.y + e.body.h * .8).clone();
    this.addScore((hammer ? 400 : 250) * p.koChain, pos, true);
    this.audio.play(hammer ? 'bonk' : 'stomp', { pos, vol: 1 });
    if (hammer) { this.audio.play('ko_bell', { vol: .5 }); this.hitStop = .07; this.shake(.22, pos); this.input.rumble(.6, 120); }
    this.audio.voice(e.kind === 'vandal' ? 'vd_ow' : e.kind === 'inspector' ? 'in_ow' : 'dog_whine', .85, pos);
    if (hammer && Math.random() < .45) setTimeout(() => this.audio.voice(Math.random() < .5 ? 'mac_take' : 'mac_lights', .8), 450);
    this.fx.sparks(pos, 18, 0xffe14a);
    this.toast(p.koChain > 1 ? `KNOCKOUT ×${p.koChain}!` : 'KNOCKOUT!');
  }
  socketRiveted(s) {
    s.state = 'riveted';
    for (const dot of s.rivetDots) dot.visible = false;
    this.addScore(500, s.center); this.audio.play('rivet_done', { vol: 1, rate: .8 });
    if (Math.random() < .6) this.audio.voice(Math.random() < .5 ? 'mac_yeah' : 'mac_gotit', .8);
    if (s.final) { this.topOut(s); return; }
    this.toast('RIVETED!');
    const regular = this.objects.sockets.filter(x => !x.final);
    if (this.level.objectiveType === 'topout' && regular.every(x => x.state === 'riveted') && !this.topBeam) {
      this.topBeam = this.objects.spawnTopBeam(); this.toast('TOPPING-OUT BEAM!'); this.caption('The crane is lowering the topping-out beam onto the roof!');
      this.audio.play('crane_loop', { vol: .6 });
    }
    this.checkComplete();
  }
  collect(o) {
    const p = this.player;
    switch (o.type) {
      case 'lunch': this.addScore(500, o.pos, true); this.audio.play('lunchbox', { vol: 1 }); this.toast('LUNCHBOX!'); if (Math.random() < .4) this.audio.voice('mac_gotit', .8); break;
      case 'coffee': p.coffee = 9; this.addScore(100, o.pos); this.audio.play('coffee', { vol: 1 }); this.toast('COFFEE RUSH!'); break;
      case 'hardhat': p.shield = true; this.addScore(100, o.pos); this.audio.play('hardhat', { vol: 1 }); this.toast('GOLD HARD HAT!'); break;
      case 'stopwatch': this.frozen = true; this.freezeT = 7; this.addScore(100, o.pos); this.audio.play('magnet', { vol: .8, rate: 1.4 }); this.toast('TIME OUT!'); break;
      case 'cash': this.addScore(1000, o.pos, true); this.audio.play('lunchbox', { vol: 1, rate: 1.3 }); this.toast('PAYDAY!'); break;
    }
    this.checkComplete();
  }
  checkComplete() {
    if (this.state !== 'play') return;
    const o = this.objects;
    if (this.level.objectiveType === 'topout') return; // handled by topOut()
    if (o.progress() >= o.total) this.levelClear(false);
  }
  topOut(s) {
    const g = s.girder; if (g && g.mesh.userData.flag) this.finaleFlag = g.mesh.userData.flag;
    this.audio.play('flag', { vol: 1 }); this.levelClear(true);
  }
  levelClear(final) {
    this.state = 'clear'; this.clearT = 0; this.finale = final;
    const p = this.player; p.invuln = 99; p.state = 'normal';
    if (p.carry) { this.objects.sendHome(p.carry); p.carry = null; }
    this.cheer = true; this.audio.sting('mus_clear');
    this.audio.play('cheer', { vol: .8 }); this.fx.confetti(V.copy(p.pos).setY(p.body.y + 2), 140);
    setTimeout(() => this.audio.voice(final ? 'fm_topped' : Math.random() < .5 ? 'fm_clear1' : 'fm_clear2', 1), 900);
    this.toast(final ? 'TOPPED OUT!' : 'SHIFT COMPLETE!');
    this.cam.mode = 'orbit'; this.cam.orbit.c.copy(p.pos).setY(p.body.y + 1.5); this.cam.orbit.d = final ? 22 : 10; this.cam.orbit.p = final ? .25 : .32; this.cam.orbit.s = .35;
  }
  showTally() {
    const secs = Math.max(0, Math.floor(this.timeLeft)), tb = secs * 10 * this.round, nd = this.deaths === 0 ? 2000 * this.round : 0, fin = this.finale ? 5000 * this.round : 0;
    this.addScore(tb + nd + fin);
    const rows = [['Shift score', (this.score - this.scoreAtStart - tb - nd - fin).toLocaleString()], [`Time bonus (${secs}s)`, tb.toLocaleString()], ['No-injury bonus', nd ? nd.toLocaleString() : '—']];
    if (this.kos) rows.splice(1, 0, ['Knockouts', '×' + this.kos]);
    if (fin) rows.push(['Topping-out bonus', fin.toLocaleString()]);
    rows.push(['Total score', this.score.toLocaleString(), 'total']);
    if (!this.demo) { progress.unlocked = Math.max(progress.unlocked, Math.min(4, this.levelIndex + 2)); saveProgress(); }
    this.state = 'tally'; this.ui.showHud(false); this.tallyT = 0;
    this.ui.tally(rows, this.finale ? 'TOWER TOPPED OUT!' : 'SHIFT COMPLETE');
    const nb = document.querySelector('#clear [data-act=next]'); nb.textContent = this.levelIndex === 3 ? 'START ROUND ' + (this.round + 1) : 'NEXT SHIFT';
    this.ui.setFocus(0, false);
  }
  async playerDeadDone() {
    if (!this.demo) this.lives--;
    if (this.lives < 0) return this.gameOver();
    const p = this.player, keepShield = false;
    p.reset(this.level.spawn); p.shield = keepShield;
    for (const e of this.enemies) e.reset();
    this.level.clearTransient(); this.frozen = false; this.freezeT = 0;
    if (this.timeLeft <= 0) this.timeLeft = Math.round(this.timeMax * .6);
    this.cam.yawT = this.cam.yaw;
  }
  async gameOver() {
    this.state = 'over'; this.ui.showHud(false);
    this.audio.sting('mus_gameover'); setTimeout(() => this.audio.voice('fm_gameover', 1), 1200);
    saveProgress();
    const q = !this.continued && await this.scores.qualifies(this.score);
    if (q) setTimeout(() => this.audio.voice('an_record', 1), 3800);
    this.ui.gameOver(this.score, q, this.continued);
    this.cam.mode = 'orbit'; this.cam.orbit.c.copy(this.player.pos); this.cam.orbit.d = 14; this.cam.orbit.s = .1;
  }
  scoreExtra() { return `R${this.round} S${this.levelIndex + 1}`; }
  // ---------------- per-frame ----------------
  frame(now) {
    requestAnimationFrame(t => this.frame(t));
    let dt = Math.min(.1, (now - this.last) / 1000); this.last = now;
    if (!(dt > 0)) dt = 1 / 60;
    this.input.poll(dt);
    const inp = this.input;
    if (inp.keyEdge || inp.camX || inp.camY) this.lastInput = now;
    if (this.demo && inp.keyEdge) { this.stopDemo(); inp.menuOk = inp.menuBack = inp.pause = false; inp.menuNav = null; }
    if (this.demo) {
      if (this.state === 'intro' && (this.introT += dt) > 3.6) this.beginPlay();
      if (this.state === 'tally' && (this.tallyT += dt) > 4.5) { if (this.levelIndex === 3) { this.stopDemo(); this.toast('DEMO COMPLETE'); } else this.nextLevel(); }
    } else if (this.state === 'title' && this.ui.screen === 'title' && now - (this.lastInput || now) > 45000 && !this.noAttract) this.startDemo(true);
    if (inp.pause && (this.state === 'play' || this.state === 'pause')) { this.state === 'play' ? this.pause() : this.resume(); inp.menuBack = false; inp.menuOk = false; }
    if (this.state !== 'play' && !this.demo) this.ui.nav(inp);
    if (this.state === 'play') {
      if (this.demo) {
        const bi = this.bot.update(dt * this.timeScale);
        bi.camX = inp.camX; bi.camY = inp.camY; bi.zoomStep = inp.zoomStep;
        this.playFrame(dt, bi); this.ui.botStatus(this.bot.status);
      } else this.playFrame(dt, inp);
    }
    else if (this.state === 'clear') {
      this.clearT += dt; this.simVisual(dt);
      if (this.demo) this.ui.botStatus(this.finale ? 'Topped out! Time for fireworks' : 'Shift complete!');
      if (this.finale) {
        if (Math.random() < dt * 3.5) { const c = [0xffc21a, 0xff4a3a, 0x3ac8ff, 0x6ee06e, 0xff7ad8][Math.floor(Math.random() * 5)]; this.fx.firework(V.set(rr(-30, 30), rr(22, 40), rr(-30, 10)), c); this.audio.play('firework', { vol: .6, rate: rr(.9, 1.1) }); }
        if (this.finaleFlag) this.finaleFlag.rotation.y = Math.sin(this.clearT * 6) * .25;
      }
      if (this.clearT > (this.finale ? 7 : 3.4)) this.showTally();
    } else if (this.state === 'title' || this.state === 'intro' || this.state === 'tally' || this.state === 'over') this.simVisual(dt);
    this.cam.update(dt, this, this.state === 'play' ? inp : { camX: 0, camY: 0 });
    if (this.demo && this.state === 'play') this.cam.distT = Math.min(this.cam.distT, 11);
    // keep the title backdrop clear of the menu column
    const w = innerWidth, h = innerHeight;
    if (this.state === 'title' && w > h) this.camera.setViewOffset(w, h, -w * .17, 0, w, h); else if (this.camera.view && this.camera.view.enabled) this.camera.clearViewOffset();
    this.audio.setListener(this.state === 'play' ? this.player.pos.clone().setY(this.player.body.y + 1) : this.camera.position, V2.set(1, 0, 0).applyQuaternion(this.camera.quaternion));
    this.audio.update();
    // cutaway follows Mac during play only
    CUT.uCutOn.value = this.state === 'play' || this.state === 'clear' ? 1 : 0;
    CUT.uCutPlayer.value.set(this.player.body.x, this.player.body.y, this.player.body.z); CUT.uCutCam.value.copy(this.camera.position);
    this.env.update(dt, this.camera.position);
    this.fx.update(dt);
    this.ui.update(dt, this.camera);
    this.renderer.track(dt, this.state === 'play');
    this.renderer.render();
    if (settings.fps) { this.fpsN = (this.fpsN || 0) + 1; this.fpsT = (this.fpsT || 0) + dt; if (this.fpsT > .5) { document.getElementById('h-fps').textContent = Math.round(this.fpsN / this.fpsT) + ' fps · ' + ['LOW', 'MED', 'HIGH', 'ULTRA'][this.renderer.q]; this.fpsN = 0; this.fpsT = 0; } }
  }
  simVisual(dt) {
    this.time += dt;
    this.world.clearDeltas();
    if (this.level) this.level.update(dt, this);
    this.objects.update(dt, this);
    this.player.animate(dt);
    for (const e of this.enemies) e.animate(dt);
  }
  playFrame(dt, inp) {
    const p = this.player;
    this.actions(inp);
    p.koT = Math.max(0, (p.koT || 0) - dt);
    if (this.hitStop > 0) { this.hitStop -= dt; dt *= .08; } // brief freeze-frame on a hammer knockout
    this.acc = Math.min((this.acc || 0) + dt * this.timeScale, STEP * 10 * this.timeScale);
    let first = true;
    while (this.acc >= STEP) {
      this.acc -= STEP; this.time += STEP;
      this.world.clearDeltas();
      this.level.update(STEP, this);
      const stepInp = first ? inp : Object.assign({}, inp, { jump: false, act: false });
      p.update(STEP, stepInp); first = false;
      for (const e of this.enemies) e.update(STEP);
      if (this.state !== 'play') break;
    }
    this.objects.update(dt, this);
    p.animate(dt); for (const e of this.enemies) e.animate(dt);
    if (p.body.onGround) p.combo = 0;
    // timers
    if (this.frozen) { this.freezeT -= dt; if (this.freezeT <= 0) this.frozen = false; }
    if (!p.dead) {
      const before = Math.ceil(this.timeLeft); this.timeLeft -= dt; const now = Math.ceil(this.timeLeft);
      if (now !== before && now <= 10 && now > 0) this.audio.play('tick', { vol: .5, rate: now <= 3 ? 1.3 : 1 });
      if (this.timeLeft < 30 && !this.hurried) { this.hurried = true; this.audio.voice('fm_hurry', 1); }
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.audio.play('timeup', { vol: 1 }); this.killPlayer('time'); }
    }
    if (p.dead && p.deadT <= 0 && !this.deadHandled) { this.deadHandled = true; this.playerDeadDone().then(() => { this.deadHandled = false; }); }
    // prompt + HUD
    this.ui.prompt(this.promptText());
    this.ui.updateHud(this.hudState());
  }
  actions(inp) {
    const p = this.player, o = this.objects;
    if (p.dead || this.state !== 'play') return;
    if (inp.attack) p.swing();
    if (inp.act) {
      if (p.carry) {
        const t = o.placeTarget(p, p.carry);
        if (t && p.carry.kind === 'crate') { const c = p.carry; p.carry = null; o.deliver(c, this); o.delivered++; this.addScore(1000, V.set(t.x, t.y + 1.5, t.z), true); this.audio.play('crate_drop', { vol: 1 }); setTimeout(() => this.audio.play('hopper', { vol: 1 }), 500); this.toast('CRATE LOADED!'); this.checkComplete(); }
        else if (t) { const c = p.carry; p.carry = null; o.place(c, t, this); this.addScore(300, t.center); this.audio.play('pickup', { vol: .8, rate: 1.1 }); }
        else if (p.state === 'normal') { const c = p.carry; p.carry = null; o.drop(c, p, this); this.audio.play('pickup', { vol: .5, rate: .8 }); }
      } else if (p.state === 'normal' && p.body.onGround) {
        const c = o.nearCarry(p);
        if (c) { o.pickUp(c); p.attachCarry(c); this.audio.play('pickup', { vol: .9 }); if (Math.random() < .35) this.audio.voice('mac_heave', .7); }
      }
    }
    if (inp.actHeld && !p.carry && p.state === 'normal' && p.body.onGround) {
      const s = o.rivetTarget(p); if (s && s.anim >= 1) p.startRivet(s);
    }
  }
  key() { return this.input.usingTouch ? 'ACT' : this.input.usingPad ? 'X' : 'E'; }
  bonkKey() { return this.input.usingTouch ? 'BONK' : this.input.usingPad ? 'Y' : 'F'; }
  promptText() {
    const p = this.player, o = this.objects, k = this.key();
    if (p.dead) return '';
    if (p.state === 'rivet') return 'RIVETING… keep holding ' + k;
    if (p.carry) {
      const t = o.placeTarget(p, p.carry);
      if (t) return p.carry.kind === 'crate' ? `${k} — LOAD THE HOPPER` : p.carry.kind === 'topbeam' ? `${k} — SET THE TOPPING-OUT BEAM` : `${k} — DROP INTO THE GAP`;
      return p.state === 'climb' ? '' : `${k} — PUT DOWN`;
    }
    if (p.state === 'climb') return '';
    const c = o.nearCarry(p); if (c && p.body.onGround) return `${k} — PICK UP ${c.kind === 'crate' ? 'CRATE' : c.kind === 'topbeam' ? 'TOPPING-OUT BEAM' : 'GIRDER'}`;
    const s = o.rivetTarget(p); if (s && s.anim >= 1 && p.body.onGround) return `HOLD ${k} — RIVET IT (${s.rivets}/4)`;
    const b = p.body;
    if (this.enemies.some(e => e.ko <= 0 && Math.hypot(e.body.x - b.x, e.body.z - b.z) < 3 && Math.abs(e.body.y - b.y) < 1.4)) return `${this.bonkKey()} — BONK!`;
    return '';
  }
  hudState() {
    const o = this.objects, p = this.player, T = this.level.objectiveType;
    let label = '', pips = '';
    if (T === 'girders' || T === 'topout') {
      label = T === 'girders' ? 'GIRDERS SET & RIVETED' : 'BEAMS · THEN THE TOPPING-OUT BEAM';
      pips = o.sockets.map(s => `<i class="${s.state === 'riveted' ? 'on' : s.state === 'placed' ? 'half' : ''}"${s.final ? ' style="border-radius:50%"' : ''}></i>`).join('');
    } else if (T === 'collect') { label = 'LUNCHBOXES'; pips = o.pickups.filter(x => x.type === 'lunch').map(x => `<i class="${x.taken ? 'on' : ''}"></i>`).join(''); }
    else { label = 'CRATES IN THE HOPPER'; pips = o.carry.map((c, i) => `<i class="${i < o.delivered ? 'on' : ''}"></i>`).join(''); }
    const objHtml = `<small>${label}</small><div class="pips">${pips}</div>`;
    const powers = [];
    if (p.coffee > 0) powers.push('☕ ' + Math.ceil(p.coffee) + 's');
    if (this.frozen) powers.push('⏱ ' + Math.ceil(this.freezeT) + 's');
    if (p.shield) powers.push('⛑ GOLD HAT');
    return { score: this.score, hi: Math.max(progress.hi, this.score), time: this.timeLeft, timeMax: this.timeMax, shift: `SHIFT ${this.levelIndex + 1} · ${this.level.name}`, round: this.round, lives: this.lives, shield: p.shield, objHtml, objKey: objHtml, powers };
  }
}

function tick() { return new Promise(r => setTimeout(r, 0)); }

const game = new Game();
window.__hhm = {
  game,
  state: () => ({ state: game.state, level: game.levelIndex, round: game.round, score: game.score, lives: game.lives, time: game.timeLeft, player: { ...game.player.body, state: game.player.state, dead: game.player.dead, carry: game.player.carry && game.player.carry.kind }, progress: game.objects && game.objects.progress(), total: game.objects && game.objects.total, q: game.renderer && game.renderer.q }),
  warp: (x, y, z) => { const b = game.player.body; Object.assign(b, { x, y, z, vx: 0, vy: 0, vz: 0 }); game.player.airMax = y; game.player.state = 'normal'; game.player.ladder = null; game.cam.snap(game.player, game.cam.yaw); },
  start: (i = 0) => { game.startGame(i); game.beginPlay(); },
  god: (on = true) => { game.player.invuln = on ? 1e9 : 0; },
  nav: () => game.level.nav.nodes.length,
  demo: (attract = false) => game.startDemo(attract),
  speed: (n = 1) => { game.timeScale = n; },
  bot: () => game.bot && { status: game.bot.status, goal: game.bot.goal && game.bot.goal.key, ride: !!game.bot.ride },
};
game.boot().catch(e => { console.error(e); const el = document.getElementById('err'); el.hidden = false; el.textContent = 'Failed to start: ' + e.message; });

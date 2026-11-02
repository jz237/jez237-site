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
import { Coop, Partner, poseOf } from './coop.js';
import { Records, GhostRecorder, Ghost, fmtTime, timeToScore, SCORE_BASE, MEDAL_ICON, MEDAL_NAME, STAR_ICON, STAR_TIP } from './records.js';
import { settings, saveSettings, progress, saveProgress, clamp, damp, angleDamp, wrapAngle, rr, isTouch, assistOn, smooth, lerp } from './util.js';

const SCORE_API = 'https://game-scores.jez237.workers.dev/scores/hard-hat-mac-skyline-v1';
const LOCAL_KEY = 'hhm3d-scores-v1';
const STEP = 1 / 120;
const NO_INPUT = { mx: 0, my: 0, jump: false, jumpHeld: false, act: false, actHeld: false, attack: false, camX: 0, camY: 0, zoomStep: 0 };
const V = new THREE.Vector3(), V2 = new THREE.Vector3(), V3 = new THREE.Vector3(), V4 = new THREE.Vector3();

class Scores {
  constructor(api = SCORE_API, localKey = LOCAL_KEY) { this.api = api; this.key = localKey; }
  local() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } }
  saveLocal(name, score, extra) {
    const rows = this.local(); rows.push({ name, score, extra }); rows.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(this.key, JSON.stringify(rows.slice(0, 10))); } catch {}
  }
  async fetch() {
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 7000);
      const r = await fetch(this.api, { signal: ctl.signal }); clearTimeout(tm);
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
      await fetch(this.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials, score, extra }), signal: ctl.signal });
      clearTimeout(tm);
    } catch {}
  }
}

class CamRig {
  constructor(camera) { this.c = camera; this.yaw = 0; this.yawT = 0; this.pitch = .62; this.dist = 12; this.distT = 12; this.target = new THREE.Vector3(); this.shakeA = 0; this.mode = 'follow'; this.orbit = { c: new THREE.Vector3(), d: 34, p: .38, s: .12 }; this.shot = null; this.nextShot = 16; }
  snap(p, yaw) { this.yaw = this.yawT = yaw; this.target.set(p.body.x, p.body.y + 1.25, p.body.z); }
  // end-of-shift flyover around the finished frame; lm = a new skyline building to swing over to
  startFly(c, r, lm, onLm) { this.mode = 'fly'; this.fly = { c: c.clone(), r, lm: lm ? lm.clone() : null, onLm, t: 0, yaw0: this.yaw, from: this.c.position.clone(), look: this.target.clone() }; }
  // demo director: a short cinematic shot that blends in and out of the follow camera
  cue(type, o = {}) { if (this.shot && this.shot.type === type) return; this.shot = Object.assign({ type, t: 0, dur: 4 }, o); }
  direct(dt, game) {
    const p = game.player, b = p.body, bot = game.bot;
    if (!game.demo || game.state !== 'play' || p.dead) { this.shot = null; return; }
    const S = this.shot;
    if (S) { S.t += dt; if (S.t > S.dur || (S.until && !S.until())) this.shot = null; return; }
    if (bot && bot.ride && bot.ride.phase === 'ride') { const m = bot.ride.link.ride.mover; this.cue('ride', { dur: 14, m, a0: Math.atan2(this.c.position.x - m.plate.position.x, this.c.position.z - m.plate.position.z), until: () => game.bot && game.bot.ride && game.bot.ride.phase !== 'alight' }); return; }
    if (p.state === 'climb' && p.ladder && p.ladder.y1 - p.ladder.y0 >= 5) { this.cue('ladder', { dur: 6, L: p.ladder, until: () => p.state === 'climb' }); return; }
    this.nextShot -= dt;
    if (this.nextShot <= 0 && p.state === 'normal' && b.onGround && Math.hypot(b.vx, b.vz) > 2) {
      this.nextShot = rr(16, 24);
      const vl = Math.hypot(b.vx, b.vz), side = Math.random() < .5 ? 1 : -1;
      this.cue('dolly', { dur: 4.2, ox: -b.vz / vl * side * 5.2 + b.vx / vl * 2.6, oz: b.vx / vl * side * 5.2 + b.vz / vl * 2.6 });
    }
  }
  shotPose(game, pos, look) {
    const S = this.shot, p = game.player, b = p.body, t = S.t;
    look.set(b.x, b.y + 1.1, b.z);
    if (S.type === 'ko') { const e = S.e.body, a = S.a0 + t * .7; look.set((b.x + e.x) / 2, (b.y + e.y) / 2 + .9, (b.z + e.z) / 2); pos.set(look.x + Math.sin(a) * 3.8, look.y + .5, look.z + Math.cos(a) * 3.8); }
    else if (S.type === 'ride') { const q = S.m.plate.position, a = S.a0 + t * .12; look.set(q.x, q.y + 1.2, q.z); pos.set(q.x + Math.sin(a) * 15, q.y + 4.5, q.z + Math.cos(a) * 15); }
    else if (S.type === 'ladder') { const L = S.L, px = -L.fz, pz = L.fx; pos.set(L.x + L.fx * 5 + px * 3, b.y + 1.4, L.z + L.fz * 5 + pz * 3); }
    else { const a = t * .08, ca = Math.cos(a), sa = Math.sin(a); pos.set(b.x + S.ox * ca - S.oz * sa, b.y + (game.level.indoor ? 3.2 : 1.5), b.z + S.ox * sa + S.oz * ca); }
  }
  update(dt, game, inp) {
    const p = game.player, b = p.body;
    if (this.mode === 'fly') {
      const F = this.fly; F.t += dt;
      const a = F.yaw0 + F.t * .3, el = lerp(.52, .3, clamp(F.t / 5, 0, 1)), d = F.r * lerp(.8, 1.15, clamp(F.t / 6, 0, 1));
      const orbit = V3.set(F.c.x + Math.sin(a) * Math.cos(el) * d, F.c.y + Math.sin(el) * d, F.c.z + Math.cos(a) * Math.cos(el) * d);
      const k = smooth(clamp(F.t / 1.4, 0, 1)), pos = V.lerpVectors(F.from, orbit, k), look = V4.lerpVectors(F.look, F.c, k);
      if (F.lm && F.t > 3.2) { // over to the skyline: rise above the site and look at the new building
        if (!F.lmSaid) { F.lmSaid = true; F.onLm && F.onLm(); F.lmFrom = pos.clone(); }
        const w = smooth(clamp((F.t - 3.2) / 2, 0, 1)), hi = V2.set(F.c.x - F.lm.x * .05, F.c.y + F.r * .7, F.c.z - F.lm.z * .05 + F.r * .3);
        pos.lerpVectors(F.lmFrom, hi, w); look.lerp(F.lm, w);
      }
      this.c.position.copy(pos); this.c.lookAt(look); this.target.copy(look);
      return;
    }
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
    const look = V2.copy(this.target);
    if (this.mode === 'follow') { this.direct(dt, game); if (this.shot) { const S = this.shot, w = smooth(clamp(Math.min(S.t / .45, (S.dur - S.t) / .45, 1), 0, 1)), sp = V3, sl = V4; this.shotPose(game, sp, sl); pos.lerp(sp, w); look.lerp(sl, w); } }
    if (this.shakeA > 0) { this.shakeA = Math.max(0, this.shakeA - dt * 1.6); const s = this.shakeA * this.shakeA * .5; pos.x += rr(-s, s); pos.y += rr(-s, s); pos.z += rr(-s, s); }
    this.c.position.copy(pos); this.c.lookAt(look);
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
    this.audio = new AudioEngine(); this.input = new Input(canvas); this.ui = new UI(this); this.scores = new Scores(); this.records = new Records(); this.boards = {};
    this.net = new Coop(this); this.net.onStatus = t => this.ui.coopStatus(t);
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
    this.ghost = new Ghost(this.scene);
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
    this.env.apply(this.level.sky, this.level); this.env.buildCity(this.level, this.M, progress.built);
    this.diff = { speed: Math.min(1.5, 1 + (this.round - 1) * .12) * (this.demo ? 1 : settings.assistSpeed), hazard: Math.min(1.6, 1 + (this.round - 1) * .15) };
    this.enemies = attract ? [] : this.level.enemyDefs.filter(d => (d.minRound || 1) <= this.round).map(d => new Enemy(d, this));
    for (const e of this.enemies) this.scene.add(e.root);
    this.player.shield = false; this.player.koT = 0; this.player.reset(this.level.spawn);
    this.cam.snap(this.player, this.level.camYaw);
    this.timeMax = Math.round(this.level.timeLimit * Math.max(.65, 1 - (this.round - 1) * .08) * (this.demo ? 1 : settings.assistTime)); this.timeLeft = this.timeMax;
    this.deaths = 0; this.kos = 0; this.hitStop = 0; this.slowT = 0; this.fxScale = 1; this.cam.shot = null; this.checkpoint = null; this.hurried = false; this.frozen = false; this.freezeT = 0; this.wind.set(0, 0, 0); this.cheer = false; this.topBeam = null; this.finale = null;
    this.scoreAtStart = this.score; this.fx.clear(); this.ui.clearPopups();
    this.ghost.hide(); this.runT = 0; this.rec = null; this.lastRun = null;
    this.audio.ambience(this.level.amb);
    this.prewarm();
  }
  prewarm() {
    const r = this.renderer.r;
    try { r.setRenderTarget(this.renderer.composer.renderTarget1); r.compile(this.scene, this.camera); } catch {}
    r.setRenderTarget(null);
  }
  startGame(i) {
    this.score = 0; this.lives = 3; this.round = 1; this.continued = false; this.nextLife = 25000; this.assisted = assistOn();
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
    if (this.coopHost) this.net.send('wv', { k: 'load', i: this.levelIndex, r: this.round, sc: this.score, lv: this.lives });
  }
  beginPlay() {
    if (this.state !== 'intro' || (this.coopGuest && !this.netGo)) return; // the co-op guest starts when the host does
    this.state = 'play'; this.ui.show(null); this.ui.showHud(true); this.cam.mode = 'follow'; this.cam.snap(this.player, this.level.camYaw); this.cam.pitch = .62;
    this.audio.voice('an_go', .8); this.audio.play('timeup', { vol: .35 });
    this.player.invuln = 2;
    if (this.bot) this.bot.reset();
    // time trial: record this run's ghost and race the best one
    const id = this.shiftId(); this.runT = 0; this.shiftAssisted = assistOn();
    this.rec = this.demo || this.wasCoop ? null : new GhostRecorder();
    this.ghost.load(settings.ghost && !this.demo && !this.wasCoop ? this.records.get(id).ghost : null);
    if (this.coopHost) this.net.send('wv', { k: 'go' });
    this.canvasFocus();
  }
  shiftId() { return LEVEL_INFO[this.levelIndex].id; }
  shiftBoard(id) { return this.boards[id] || (this.boards[id] = new Scores(SCORE_BASE + `hard-hat-mac-skyline-${id}-times-v1`, 'hhm3d-times-' + id)); }
  canvasFocus() { try { document.getElementById('gl').focus({ preventScroll: true }); } catch {} }
  nextLevel() {
    let i = this.levelIndex + 1;
    if (i >= LEVEL_INFO.length) { i = 0; this.round++; setTimeout(() => this.audio.voice('fm_round'), 1500); }
    if (!this.demo) { progress.unlocked = Math.max(progress.unlocked, Math.min(LEVEL_INFO.length, i + 1)); saveProgress(); }
    this.loadLevel(i); this.intro();
  }
  restartLevel() { this.score = this.scoreAtStart; this.loadLevel(this.levelIndex); this.intro(); }
  continueGame() { this.score = 0; this.lives = 3; this.continued = true; this.assisted = assistOn(); this.nextLife = 25000; this.loadLevel(this.levelIndex); this.intro(); }
  toTitle(first = false) {
    if (this.coop || this.wasCoop) { if (this.coopHost) this.net.send('down', { k: 'quit' }); this.coop = false; this.wasCoop = false; this.net.leave(true); this.ui.coopStatus('Not connected.'); }
    if (this.partner) { this.partner.dispose(); this.partner = null; }
    this.state = 'title'; this.ui.showHud(false); this.ui.stack = []; this.ui.show('title');
    if (!first) { this.round = 1; this.loadLevel(0, true); }
    this.lastInput = performance.now();
    this.cam.mode = 'orbit'; this.cam.orbit.c.set(0, 9, 0); this.cam.orbit.d = 38; this.cam.orbit.p = .3; this.cam.orbit.s = .05; this.cam.target.set(0, 9, 0); this.cam.yaw = -.5; this.cam.pitch = .3; this.cam.dist = 38;
    this.player.reset({ x: -2, y: 0, z: 9.5, yaw: .3 });
    if (this.titleVoiced) this.audio.playMusic('mus_title');
  }
  // ---------------- online co-op ----------------
  get coopHost() { return !!this.coop && this.net.role === 'host'; }
  get coopGuest() { return !!this.coop && this.net.role === 'guest'; }
  startCoopGame(i) {
    if (!this.net.linked || this.net.role !== 'host') return;
    this.coop = true; this.wasCoop = true; this.demo = false; this.bot = null;
    this.score = 0; this.lives = 5; this.round = 1; this.continued = true; this.nextLife = 25000; this.assisted = assistOn();
    this.player.grabFilter = undefined; this.audio.unlock(); this.loadLevel(i); this.intro();
  }
  coopPartnerJoined(name) {
    if (this.partner) this.partner.dispose();
    this.partner = new Partner(this, name);
    this.audio.play('coop_join', { vol: .9 }); this.ui.coopRefresh();
    if (this.ui.screen === 'coop') setTimeout(() => this.audio.voice('fm_coop', 1), 500);
  }
  coopPartnerLeft(msg) {
    const name = this.partner ? this.partner.name : 'Your partner';
    for (const c of this.objects.carry) if (c.holder === 'g') { c.holder = null; this.objects.sendHome(c); }
    if (this.partner) { this.partner.dispose(); this.partner = null; }
    this.ui.coopRefresh();
    if (!this.coop) return;
    if (this.net.role === 'guest' || this.coopRole === 'guest') return this.coopEnd(msg || 'Lost the connection to the host.');
    this.coop = false; this.toast(`${name.toUpperCase()} LEFT`); this.caption(`${name} left. The shift carries on solo.`);
  }
  coopEnd(msg) {
    this.coop = false; this.wasCoop = false; this.coopRole = null; this.net.leave(true);
    this.toTitle(); this.ui.coopOpen(); this.ui.coopStatus(msg);
  }
  netAct(a, data = {}) { if (this.coopGuest) this.net.send('ck', Object.assign({ a }, data)); }
  netRivet(s) { if (this.coopGuest) { s.netLock = performance.now() + 900; this.netAct(s.demo ? 'unbolt' : 'rivet', { si: this.objects.sockets.indexOf(s), n: s.rivets }); } }
  partnerHit(kind, px, pz) { this.net.send('hit', { r: kind, px: Math.round(px * 10) / 10, pz: Math.round(pz * 10) / 10 }); if (kind === 'inspector') this.audio.voice('in_cite', .8, this.partner && this.partner.root.position); }
  // enemies chase whichever Mac is closer (co-op host)
  targetFor(b) {
    const P = this.partner, p = this.player;
    if (!P || !this.coopHost || P.dead || !P.root.visible) return p;
    if (p.dead) return P;
    const d = q => Math.hypot(q.body.x - b.x, q.body.z - b.z) + Math.abs(q.body.y - b.y) * 2;
    return d(P) < d(p) ? P : p;
  }
  coopMessage(d) {
    const now = performance.now();
    if (this.net.role === 'host') {
      if (d.type === 'pg' && d.k === 'p' && this.partner && Array.isArray(d.p)) this.partner.push(d.p, now);
      else if (d.type === 'ck' && this.coop && this.state === 'play') this.hostAct(d);
      else if (d.type === 'ek' && this.coop && this.state === 'play') { const e = this.enemies[d.i]; if (e) { if (d.how === 'shove') this.shoved(e, d.dx, d.dz); else this.knockOut(e, d.dx, d.dz, d.how === 'stomp' ? 'stomp' : 'hammer'); } }
      return;
    }
    switch (d.type) {
      case 'es': if (this.coop && (this.state === 'play' || this.state === 'pause')) this.net.apply(d, now); break;
      case 'wv':
        if (d.k === 'load') { this.coop = true; this.wasCoop = true; this.coopRole = 'guest'; this.demo = false; this.bot = null; this.continued = true; this.round = d.r; this.loadLevel(d.i); this.score = d.sc; this.lives = d.lv; this.intro(); }
        else if (d.k === 'go' && this.coop) { this.netGo = true; this.beginPlay(); this.netGo = false; }
        break;
      case 'wc':
        if (!this.coop) break;
        if (d.k === 'clear') { if (this.state === 'play' || this.state === 'pause') this.levelClear(!!d.f); }
        else if (d.k === 'tally') { this.state = 'tally'; this.ui.showHud(false); this.ui.tally(d.rows || [], d.title || 'SHIFT COMPLETE'); this.ui.coopWaiting(true); }
        break;
      case 'down':
        if (d.k === 'over') { this.score = d.sc || this.score; this.state = 'over'; this.ui.showHud(false); this.audio.sting('mus_gameover'); this.ui.gameOver(this.score, false, true); this.cam.mode = 'orbit'; this.cam.orbit.c.copy(this.player.pos); this.cam.orbit.d = 14; this.cam.orbit.s = .1; }
        else this.coopEnd(`${this.net.partnerName} ended the co-op game.`);
        break;
      case 'hit': if (this.coop && this.state === 'play') { if (d.r === 'time') this.killPlayer('time'); else this.hitPlayer(d.r, { push: new THREE.Vector3(d.px || 0, 6, d.pz || 0) }); } break;
      case 'cv': if (d.e === 'deny') { const c = this.objects.carry[d.ci]; if (c && this.player.carry === c) { this.player.carry = null; this.net.detach(c); } } break;
    }
  }
  // host: apply what the guest did
  hostAct(d) {
    const o = this.objects, c = d.ci >= 0 ? o.carry[d.ci] : null;
    const free = q => { if (q && q.holder === 'g') { q.holder = null; if (this.partner && this.partner.held === q) this.partner.held = null; } };
    switch (d.a) {
      case 'pick': if (c && c.state === 'rest') { o.pickUp(c); c.holder = 'g'; if (this.partner) this.partner.attach(c); } else if (c) this.net.send('cv', { e: 'deny', ci: d.ci }); break;
      case 'drop': if (c) { free(c); o.group.attach(c.mesh); c.mesh.scale.setScalar(1); c.pos.set(d.x, d.y, d.z); c.axis = d.ax ? 'z' : 'x'; c.mesh.position.copy(c.pos); c.mesh.rotation.set(0, d.ax ? Math.PI / 2 : 0, 0); c.state = 'falling'; c.vy = 0; } break;
      case 'home': if (c) { free(c); o.sendHome(c); } break;
      case 'place': { const s = o.sockets[d.si]; if (c && s && s.state === 'empty') { free(c); o.place(c, s, this); this.addScore(300, s.center); } break; }
      case 'deliver': if (c && c.state === 'carried') { free(c); const t = c.kind === 'girder' && o.bin ? o.bin : o.hopper; if (t) { o.deliver(c, this, t); o.delivered++; this.addScore(1000, V.set(t.x, t.y + 1.5, t.z).clone(), true); this.checkComplete(); } } break;
      case 'rivet': { const s = o.sockets[d.si]; if (s && s.state === 'placed') { s.rivets = Math.max(s.rivets, d.n | 0); s.rivetDots.forEach((dot, j) => { if (j < s.rivets) { dot.material.color.setHex(0x3a3a3a); dot.scale.setScalar(.8); } }); if (s.rivets >= 4) this.socketRiveted(s); } break; }
      case 'unbolt': { const s = o.sockets[d.si]; if (s && s.demo && s.state === 'riveted') { s.rivets = Math.min(s.rivets, d.n | 0); s.rivetDots.forEach((dot, j) => { dot.visible = j < s.rivets; }); if (s.rivets <= 0) this.socketUnbolted(s); } break; }
      case 'station': { const st = o.stations[d.si]; if (st && !st.on) { st.prog = Math.max(st.prog, +d.p || 0); if (d.on) this.stationOn(st); } break; }
      case 'collect': { const pk = o.pickups[d.pi]; if (pk && !pk.taken) { pk.taken = true; o.group.remove(pk.mesh, pk.halo); if (pk.beacon) o.group.remove(pk.beacon); this.collect(pk, true); } break; }
      case 'cp': { const cp = o.checkpoints[d.i]; if (cp && !cp.active) { o.activate(cp); this.reachCheckpoint(cp); } break; }
      case 'dead': this.deaths++; if (!settings.assistLives) this.lives--; if (this.lives < 0) this.gameOver(); break;
    }
  }
  // guest: stomp the (host-driven) enemies locally and tell the host
  guestStomp() {
    const p = this.player, pb = p.body; if (p.dead || pb.vy >= -1) return;
    for (const e of this.enemies) {
      if (e.ko > 0 || !e.K.stomp) continue;
      const b = e.body, dx = pb.x - b.x, dz = pb.z - b.z, d = Math.hypot(dx, dz), dy = pb.y - b.y;
      if (d < b.r + pb.r + .08 && dy > b.h * .55 && dy < b.h + .3) { pb.vy = 11; p.airMax = pb.y; this.knockOut(e, -dx / (d || 1), -dz / (d || 1), 'stomp'); }
    }
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
  pause() { if (this.state !== 'play') return; this.state = 'pause'; this.ui.coopPause(!!this.coop); this.ui.show('pause'); this.ui.stack = []; this.audio.applyVolumes(); }
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
    const mode = { fall: 'fall', void: 'void', squash: 'squash', molten: 'molten', drown: 'drown', splash: 'splash' }[reason] || 'knock';
    if (this.coopGuest && p.carry) this.netAct('home', { ci: this.objects.carry.indexOf(p.carry) });
    p.die(mode); this.deaths++;
    this.toast({ fall: 'SPLAT!', void: 'WHOOPS!', squash: 'SQUASHED!', molten: 'TOO HOT!', zap: 'ZAPPED!', bolt: 'BONK!', inspector: 'CITATION!', vandal: 'MUGGED!', dog: 'CHOMP!', pipe: 'ROLLED!', wreck: 'WRECKED!', time: "TIME'S UP!", drown: 'GLUG GLUG!', splash: 'SPLASH!', gull: 'PECKED!', debris: 'CONKED!', rock: 'ROCKED!' }[reason] || 'OUCH!');
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
    if (this.coopGuest) { e.netLock = performance.now() + 700; this.net.send('ek', { i: this.enemies.indexOf(e), dx, dz, how }); }
    const p = this.player;
    p.koChain = (p.koT > 0 ? p.koChain || 0 : 0) + 1; p.koT = 3; this.kos++;
    const pos = V.copy(e.root.position).setY(e.body.y + e.body.h * .8).clone();
    this.addScore((hammer ? 400 : 250) * p.koChain, pos, true);
    this.audio.play(hammer ? 'bonk' : 'stomp', { pos, vol: 1 });
    if (hammer) { this.audio.play('ko_bell', { vol: .5 }); this.hitStop = .07; this.shake(.22, pos); this.input.rumble(.6, 120); }
    if (hammer && this.demo && this.cam.mode === 'follow' && (this.time - (this.lastKoShot || -99) > 9 || p.koChain > 1)) { // demo director: slow-mo replay angle
      this.lastKoShot = this.time; this.slowT = .9; this.cam.cue('ko', { dur: 1.7, e, a0: p.yaw + Math.PI * .6 });
    }
    this.audio.voice(e.kind === 'vandal' ? 'vd_ow' : e.kind === 'inspector' ? 'in_ow' : 'dog_whine', .85, pos);
    if (hammer && Math.random() < .45) setTimeout(() => this.audio.voice(Math.random() < .5 ? 'mac_take' : 'mac_lights', .8), 450);
    this.fx.sparks(pos, 18, 0xffe14a);
    this.toast(p.koChain > 1 ? `KNOCKOUT ×${p.koChain}!` : 'KNOCKOUT!');
  }
  // Shoulder shove while carrying: pushes trouble out of the way without dropping the load.
  shoved(e, dx, dz) {
    if (!e.shove(dx, dz)) return;
    if (this.coopGuest) { e.netLock = performance.now() + 700; this.net.send('ek', { i: this.enemies.indexOf(e), dx, dz, how: 'shove' }); }
    const pos = V.copy(e.root.position).setY(e.body.y + e.body.h * .8).clone();
    this.addScore(50, pos);
    this.audio.play('shove', { pos, vol: 1 }); this.shake(.12, pos); this.input.rumble(.4, 90);
    this.toast('SHOVED!');
  }
  reachCheckpoint(cp) {
    this.checkpoint = cp;
    this.netAct('cp', { i: this.objects.checkpoints.indexOf(cp) });
    this.toast('CHECKPOINT!'); this.audio.play('ding', { vol: .7, rate: 1.15 }); this.audio.play('ui_confirm', { vol: .5 });
    this.fx.sparks(V.copy(cp.pos).setY(cp.pos.y + 1.5), 16, 0x6ee06e);
  }
  socketRiveted(s) {
    s.state = 'riveted';
    for (const dot of s.rivetDots) dot.visible = false;
    this.addScore(500, s.center); this.audio.play('rivet_done', { vol: 1, rate: .8 });
    if (Math.random() < .6) this.audio.voice(Math.random() < .5 ? 'mac_yeah' : 'mac_gotit', .8);
    if (s.final) { this.topOut(s); return; }
    this.toast('RIVETED!');
    const regular = this.objects.sockets.filter(x => !x.final);
    if (this.level.objectiveType === 'topout' && regular.every(x => x.state === 'riveted') && !this.topBeam && !this.coopGuest) {
      this.topBeam = this.objects.spawnTopBeam(); this.toast('TOPPING-OUT BEAM!'); this.caption('The crane is lowering the topping-out beam onto the roof!');
      this.audio.play('crane_loop', { vol: .6 });
    }
    this.checkComplete();
  }
  stationOn(s) {
    if (this.coopGuest) { s.netLock = performance.now() + 900; this.netAct('station', { si: this.objects.stations.indexOf(s), p: s.prog, on: 1 }); }
    this.objects.stationOn(s);
    const valve = s.kind === 'valve', n = this.objects.progress();
    this.addScore(750, V.copy(s.dev).setY(s.dev.y + 1.5).clone(), true);
    this.audio.play(valve ? 'pump_on' : 'switch_on', { pos: s.dev, vol: 1 });
    this.fx.sparks(V.copy(s.dev).setY(s.dev.y + (valve ? 1 : 3.3)), 18, valve ? 0x7ac8ff : 0xff6a4a);
    this.toast(valve ? `PUMP ${n} RUNNING!` : `BEACON ${n} LIT!`);
    if (Math.random() < .5) this.audio.voice('mac_gotit', .8);
    this.checkComplete();
  }
  socketUnbolted(s) {
    this.objects.unbolt(s);
    this.addScore(300, s.center); this.audio.play('place', { pos: s.center, vol: .9, rate: .8 });
    this.toast('BEAM UNBOLTED!'); this.caption('Haul the old beam to the scrap bin.');
  }
  collect(o, byPartner = false) {
    const p = byPartner ? { } : this.player; // the partner's power-ups apply in the partner's game
    if (!byPartner) this.netAct('collect', { pi: this.objects.pickups.indexOf(o) });
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
    if (this.state !== 'play' || this.coopGuest) return; // co-op: the host decides when the shift is done
    const o = this.objects;
    if (this.level.objectiveType === 'topout') return; // handled by topOut()
    if (o.progress() >= o.total) this.levelClear(false);
  }
  topOut(s) {
    if (this.coopGuest) return;
    const g = s.girder; if (g && g.mesh.userData.flag) this.finaleFlag = g.mesh.userData.flag;
    this.audio.play('flag', { vol: 1 }); this.levelClear(true);
  }
  levelClear(final) {
    const info = LEVEL_INFO[this.levelIndex];
    this.lastRun = { id: info.id, secs: this.runT };
    if (!this.demo && !this.wasCoop && !this.shiftAssisted) {
      const bonus = this.objects.pickups.filter(o => o.type !== 'lunch').every(o => o.taken);
      this.lastRun.rec = this.records.finish(info.id, info.par, { secs: this.runT, deaths: this.deaths, bonus, ghost: this.rec && this.rec.encode() });
    }
    this.newBuilding = null;
    if (!this.demo && !progress.built.includes(info.id)) { progress.built.push(info.id); saveProgress(); this.newBuilding = info.id; }
    this.ghost.hide(); this.rec = null;
    if (this.coopHost) this.net.send('wc', { k: 'clear', f: final ? 1 : 0 });
    this.state = 'clear'; this.clearT = 0; this.finale = final;
    const p = this.player; p.invuln = 99; p.state = 'normal';
    if (p.carry) { this.objects.sendHome(p.carry); p.carry = null; }
    this.cheer = true; this.audio.sting('mus_clear');
    this.audio.play('cheer', { vol: .8 }); this.fx.confetti(V.copy(p.pos).setY(p.body.y + 2), 140);
    setTimeout(() => this.audio.voice(final ? 'fm_topped' : Math.random() < .5 ? 'fm_clear1' : 'fm_clear2', 1), 900);
    this.toast(final ? 'TOPPED OUT!' : 'SHIFT COMPLETE!');
    const L = this.level, [x0, z0, x1, z1] = L.bounds, lm = this.newBuilding && this.env.city.addLandmark(this.newBuilding, true);
    const c = V2.set((x0 + x1) / 4, L.index === 3 ? -2 : L.high ? 7 : 8, (z0 + z1) / 4), r = clamp(Math.max(x1 - x0, z1 - z0) * .36, 18, 30) * (final ? 1.15 : 1);
    this.cam.shot = null;
    this.cam.startFly(c, r, lm ? lm.top : null, () => { this.toast('NEW ON THE SKYLINE!'); this.caption(`Mac & Sons' ${LEVEL_INFO[this.levelIndex].name.toLowerCase()} job is now part of the city skyline.`); this.audio.play('skyline', { vol: 1 }); });
  }
  showTally() {
    const secs = Math.max(0, Math.floor(this.timeLeft)), tb = secs * 10 * this.round, nd = this.deaths === 0 ? 2000 * this.round : 0, fin = this.finale ? 5000 * this.round : 0;
    this.addScore(tb + nd + fin);
    const rows = [['Shift score', (this.score - this.scoreAtStart - tb - nd - fin).toLocaleString()], [`Time bonus (${secs}s)`, tb.toLocaleString()], ['No-injury bonus', nd ? nd.toLocaleString() : '—']];
    if (this.kos) rows.splice(1, 0, ['Knockouts', '×' + this.kos]);
    const R = this.lastRun, rec = R && R.rec;
    if (R) rows.unshift(['Shift time', fmtTime(R.secs) + (rec ? (rec.newBest ? (rec.prevBest != null ? ' · NEW BEST!' : '') : ` · best ${fmtTime(this.records.get(R.id).best)}`) : '')]);
    if (rec) {
      rows.push(['Medal', `${MEDAL_ICON[rec.medal]} ${MEDAL_NAME[rec.medal]} ` + rec.stars.map((s, i) => `<span class="star${s ? ' on' : ''}" title="${STAR_TIP[i]}">${STAR_ICON[i]}</span>`).join(''), 'medal']);
      if (rec.newMedal && rec.medal > 0) setTimeout(() => this.audio.play('medal', { vol: .9 }), 1400);
      if (rec.newBest && rec.prevBest != null) setTimeout(() => this.audio.voice('an_newbest', 1), 2200);
    }
    if (fin) rows.push(['Topping-out bonus', fin.toLocaleString()]);
    rows.push(['Total score', this.score.toLocaleString(), 'total']);
    if (!this.demo) { progress.unlocked = Math.max(progress.unlocked, Math.min(LEVEL_INFO.length, this.levelIndex + 2)); saveProgress(); }
    this.state = 'tally'; this.ui.showHud(false); this.tallyT = 0;
    this.ui.tally(rows, this.finale ? 'TOWER TOPPED OUT!' : 'SHIFT COMPLETE');
    this.ui.recordEntry(null); this.ui.coopWaiting(false);
    if (this.coopHost) this.net.send('wc', { k: 'tally', rows: rows.map(r => [r[0], String(r[1]), r[2]]), title: this.finale ? 'TOWER TOPPED OUT!' : 'SHIFT COMPLETE' });
    if (rec) this.checkShiftRecord(R);
    const nb = document.querySelector('#clear [data-act=next]'); nb.textContent = this.levelIndex === LEVEL_INFO.length - 1 ? 'START ROUND ' + (this.round + 1) : 'NEXT SHIFT';
    this.ui.setFocus(0, false);
  }
  // top-10 shift time on the global board: offer to post it
  async checkShiftRecord(R) {
    const ok = await this.shiftBoard(R.id).qualifies(timeToScore(R.secs));
    if (ok && this.state === 'tally' && this.lastRun === R) this.ui.recordEntry(R);
  }
  async postShiftTime(initials) {
    const R = this.lastRun; if (!R || R.posted) return; R.posted = true;
    progress.initials = initials; saveProgress();
    await this.shiftBoard(R.id).submit(initials, timeToScore(R.secs), `R${this.round} · ${fmtTime(R.secs)}`);
  }
  async playerDeadDone() {
    if (this.coopGuest) this.netAct('dead'); // the host keeps the shared hard-hat count
    else { if (!this.demo && !settings.assistLives) this.lives--; if (this.lives < 0) return this.gameOver(); }
    const p = this.player, cp = this.checkpoint;
    p.reset(cp ? { x: cp.pos.x, y: cp.pos.y + .05, z: cp.pos.z, yaw: cp.yaw } : this.level.spawn); p.shield = false;
    if (cp) this.cam.snap(p, this.cam.yaw);
    if (!this.coop) for (const e of this.enemies) e.reset();
    this.level.clearTransient(); this.frozen = false; this.freezeT = 0;
    if (this.timeLeft <= 0) this.timeLeft = Math.round(this.timeMax * .6);
    this.cam.yawT = this.cam.yaw;
  }
  async gameOver() {
    if (this.coopHost) this.net.send('down', { k: 'over', sc: this.score });
    this.state = 'over'; this.ui.showHud(false);
    this.audio.sting('mus_gameover'); setTimeout(() => this.audio.voice('fm_gameover', 1), 1200);
    saveProgress();
    const q = !this.continued && !this.assisted && await this.scores.qualifies(this.score);
    if (q) setTimeout(() => this.audio.voice('an_record', 1), 3800);
    this.ui.gameOver(this.score, q, this.continued || this.assisted);
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
      if (this.state === 'tally' && (this.tallyT += dt) > 4.5) { if (this.levelIndex === LEVEL_INFO.length - 1) { this.stopDemo(); this.toast('DEMO COMPLETE'); } else this.nextLevel(); }
    } else if (this.state === 'title' && this.ui.screen === 'title' && now - (this.lastInput || now) > 45000 && !this.noAttract) this.startDemo(true);
    if (inp.pause && (this.state === 'play' || this.state === 'pause')) { this.state === 'play' ? this.pause() : this.resume(); inp.menuBack = false; inp.menuOk = false; }
    if (this.state !== 'play' && !this.demo) this.ui.nav(inp);
    if (this.partner) this.partner.update(dt, performance.now());
    if (this.coop && this.state === 'pause') this.playFrame(dt, NO_INPUT); // co-op never stops the clock
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
      if (this.clearT > (this.finale ? 7.5 : this.newBuilding ? 7 : 4.6) && !this.coopGuest) this.showTally();
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
    this.env.update(dt, this.camera.position, this.state === 'play' ? this.wind.x : 0);
    this.fx.update(dt * (this.state === 'play' ? this.fxScale ?? 1 : 1));
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
    if (!this.demo && assistOn()) this.assisted = true; // assists switched on mid-run keep this run off the boards
    this.actions(inp);
    p.koT = Math.max(0, (p.koT || 0) - dt);
    if (this.hitStop > 0) { this.hitStop -= dt; dt *= .08; } // brief freeze-frame on a hammer knockout
    else if (this.slowT > 0) { this.slowT -= dt; dt *= .35; } // demo knockout slow motion
    this.fxScale = this.hitStop > 0 ? .1 : this.slowT > 0 ? .35 : 1;
    this.acc = Math.min((this.acc || 0) + dt * this.timeScale, STEP * 10 * this.timeScale);
    if (!this.demo && assistOn()) this.shiftAssisted = true;
    let first = true;
    while (this.acc >= STEP) {
      this.acc -= STEP; this.time += STEP;
      this.world.clearDeltas();
      this.level.update(STEP, this);
      const stepInp = first ? inp : Object.assign({}, inp, { jump: false, act: false });
      p.update(STEP, stepInp); first = false;
      if (!this.coopGuest) for (const e of this.enemies) e.update(STEP);
      if (this.state !== 'play') break;
    }
    if (this.coopGuest) { this.net.enemies(dt, performance.now()); this.guestStomp(); }
    if (this.coop) { // network: host streams the world, guest streams its Mac
      this.netT = (this.netT || 0) - dt;
      if (this.netT <= 0) { this.netT = this.coopHost ? 1 / 12 : 1 / 15; if (this.coopHost) this.net.send('es', this.net.snapshot()); else this.net.send('pg', { k: 'p', p: poseOf(p) }); }
    }
    this.objects.update(dt, this);
    p.animate(dt); for (const e of this.enemies) e.animate(dt);
    if (p.body.onGround) p.combo = 0;
    if (this.state === 'play') { const st = dt * this.timeScale; this.runT += st; if (this.rec) this.rec.add(st, p); this.ghost.update(this.runT, st); }
    // timers
    if (this.frozen) { this.freezeT -= dt; if (this.freezeT <= 0) this.frozen = false; }
    if (!p.dead) {
      const before = Math.ceil(this.timeLeft); this.timeLeft -= dt; const now = Math.ceil(this.timeLeft);
      if (now !== before && now <= 10 && now > 0) this.audio.play('tick', { vol: .5, rate: now <= 3 ? 1.3 : 1 });
      if (this.timeLeft < 30 && !this.hurried) { this.hurried = true; this.audio.voice('fm_hurry', 1); }
      if (this.timeLeft <= 0 && this.coopGuest) this.timeLeft = 0; // the host calls time
      else if (this.timeLeft <= 0) { this.timeLeft = 0; this.audio.play('timeup', { vol: 1 }); this.killPlayer('time'); if (this.coopHost) this.net.send('hit', { r: 'time' }); }
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
        const ci = o.carry.indexOf(p.carry), lock = performance.now() + 900; p.carry.netLock = lock;
        if (t && p.carry.kind === 'crate') { const c = p.carry; p.carry = null; this.netAct('deliver', { ci }); o.deliver(c, this); o.delivered++; this.addScore(1000, V.set(t.x, t.y + 1.5, t.z), true); this.audio.play('crate_drop', { vol: 1 }); setTimeout(() => this.audio.play('hopper', { vol: 1 }), 500); this.toast('CRATE LOADED!'); this.checkComplete(); }
        else if (t && t.bin) { const c = p.carry; p.carry = null; this.netAct('deliver', { ci }); o.deliver(c, this, t); o.delivered++; this.addScore(1000, V.set(t.x, t.y + 1.5, t.z), true); this.toast('SCRAPPED!'); this.checkComplete(); }
        else if (t) { const c = p.carry; p.carry = null; t.netLock = lock; this.netAct('place', { ci, si: o.sockets.indexOf(t) }); o.place(c, t, this); this.addScore(300, t.center); this.audio.play('pickup', { vol: .8, rate: 1.1 }); }
        else if (p.state === 'normal') { const c = p.carry; p.carry = null; o.drop(c, p, this); this.netAct('drop', { ci, x: c.pos.x, y: c.pos.y, z: c.pos.z, ax: c.axis === 'z' ? 1 : 0 }); this.audio.play('pickup', { vol: .5, rate: .8 }); }
      } else if (p.state === 'normal' && p.body.onGround) {
        const c = o.nearCarry(p);
        if (c) { c.netLock = performance.now() + 900; this.netAct('pick', { ci: o.carry.indexOf(c) }); o.pickUp(c); p.attachCarry(c); this.audio.play('pickup', { vol: .9 }); if (Math.random() < .35) this.audio.voice('mac_heave', .7); }
      }
    }
    if (inp.actHeld && !p.carry && p.state === 'normal' && p.body.onGround) {
      const st = o.stationTarget(p);
      if (st) p.startCrank(st);
      else { const s = o.rivetTarget(p); if (s && s.anim >= 1) p.startRivet(s); }
    }
  }
  key() { return this.input.usingTouch ? 'ACT' : this.input.usingPad ? 'X' : 'E'; }
  bonkKey() { return this.input.usingTouch ? 'BONK' : this.input.usingPad ? 'Y' : 'F'; }
  promptText() {
    const p = this.player, o = this.objects, k = this.key();
    if (p.dead) return '';
    if (p.state === 'rivet') return (p.rivetSock && p.rivetSock.demo ? 'UNBOLTING… keep holding ' : 'RIVETING… keep holding ') + k;
    if (p.state === 'crank') { const s = p.crankSt; return s ? `${s.kind === 'valve' ? 'OPENING THE VALVE' : 'SWITCHING IT ON'}… ${Math.floor(s.prog / s.need * 100)}%` : ''; }
    if (p.carry) {
      const t = o.placeTarget(p, p.carry);
      if (t) return t.bin ? `${k} — INTO THE SCRAP BIN` : p.carry.kind === 'crate' ? `${k} — LOAD THE HOPPER` : p.carry.kind === 'topbeam' ? `${k} — SET THE TOPPING-OUT BEAM` : `${k} — DROP INTO THE GAP`;
      if (p.state === 'climb') return '';
      if (this.enemyNear(2.6)) return `${this.bonkKey()} — SHOVE!`;
      return `${k} — PUT DOWN`;
    }
    if (p.state === 'climb') return '';
    const c = o.nearCarry(p); if (c && p.body.onGround) return `${k} — PICK UP ${c.kind === 'crate' ? 'CRATE' : c.kind === 'topbeam' ? 'TOPPING-OUT BEAM' : 'GIRDER'}`;
    const st = o.stationTarget(p); if (st && p.body.onGround) return `HOLD ${k} — ${st.kind === 'valve' ? 'OPEN THE PUMP VALVE' : 'SWITCH ON THE BEACON'}${st.prog > 0 ? ` (${Math.floor(st.prog / st.need * 100)}%)` : ''}`;
    const s = o.rivetTarget(p); if (s && s.anim >= 1 && p.body.onGround) return s.demo ? `HOLD ${k} — UNBOLT THE OLD BEAM (${4 - s.rivets}/4)` : `HOLD ${k} — RIVET IT (${s.rivets}/4)`;
    const b = p.body;
    if (this.enemyNear(3)) return `${this.bonkKey()} — BONK!`;
    return '';
  }
  enemyNear(r) { const b = this.player.body; return this.enemies.some(e => e.ko <= 0 && Math.hypot(e.body.x - b.x, e.body.z - b.z) < r && Math.abs(e.body.y - b.y) < 1.4); }
  hudState() {
    const o = this.objects, p = this.player, T = this.level.objectiveType;
    let label = '', pips = '';
    if (T === 'girders' || T === 'topout') {
      label = T === 'girders' ? 'GIRDERS SET & RIVETED' : 'BEAMS · THEN THE TOPPING-OUT BEAM';
      pips = o.sockets.map(s => `<i class="${s.state === 'riveted' ? 'on' : s.state === 'placed' ? 'half' : ''}"${s.final ? ' style="border-radius:50%"' : ''}></i>`).join('');
    } else if (T === 'collect') { label = 'LUNCHBOXES'; pips = o.pickups.filter(x => x.type === 'lunch').map(x => `<i class="${x.taken ? 'on' : ''}"></i>`).join(''); }
    else if (T === 'pumps' || T === 'beacons') {
      label = T === 'pumps' ? 'PUMPS RUNNING' : 'BEACONS LIT'; pips = o.stations.map(s => `<i class="${s.on ? 'on' : s.prog > 0 ? 'half' : ''}"></i>`).join('');
      if (this.level.flood) { const f = this.level.flood, lv = f.level; label += lv > -7.9 ? ` · WATER ${f.rising > .001 ? 'RISING' : 'HOLDING'}` : ''; }
    }
    else if (T === 'scrap') { label = 'OLD BEAMS SCRAPPED'; const loose = o.sockets.filter(s => s.state === 'removed').length; pips = o.sockets.map((s, i) => `<i class="${i < o.delivered ? 'on' : i < loose ? 'half' : ''}"></i>`).join(''); }
    else { label = 'CRATES IN THE HOPPER'; pips = o.carry.map((c, i) => `<i class="${i < o.delivered ? 'on' : ''}"></i>`).join(''); }
    const objHtml = `<small>${label}</small><div class="pips">${pips}</div>`;
    const powers = [];
    if (p.coffee > 0) powers.push('☕ ' + Math.ceil(p.coffee) + 's');
    if (this.frozen) powers.push('⏱ ' + Math.ceil(this.freezeT) + 's');
    if (p.shield) powers.push('⛑ GOLD HAT');
    if (this.assisted && !this.demo) powers.push('🛟 ASSIST');
    const best = this.demo || this.wasCoop ? null : this.records.get(this.shiftId()).best;
    if (this.coop && this.partner) powers.push('🤝 ' + this.partner.name);
    return { run: this.demo || this.wasCoop ? null : this.runT, best, score: this.score, hi: Math.max(progress.hi, this.score), time: this.timeLeft, timeMax: this.timeMax, shift: `SHIFT ${this.levelIndex + 1} · ${this.level.name}`, round: this.round, lives: this.lives, shield: p.shield, objHtml, objKey: objHtml, powers };
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

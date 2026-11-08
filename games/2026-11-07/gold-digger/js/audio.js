// Audio: effects are positioned in 3D (Web Audio panners with the listener on the camera) so pick strikes,
// blasts, bats and geysers sit where they happen; footsteps and climbing are quiet low one-shots. Ambient beds
// (each depth's cave air, a burning flare) follow the action. Voices duck the music and only one plays at a time;
// the old prospector speaks RARELY (key moments only) and can be switched off. Music loops with a crossfade.
// All effects, music and voice lines are ElevenLabs renders (scripts/gold-digger/gen_audio.py + process_audio.py).
const SFX = ['step', 'land', 'jump', 'climb', 'hurt', 'death', 'splash', 'swim', 'swing', 'pick', 'rockbreak', 'ore', 'hitflesh', 'gold', 'gem', 'bigloot',
  'oil', 'heart', 'life', 'key', 'door', 'relic', 'fossil', 'chest', 'throw', 'fuse', 'boom', 'boomfar', 'debris', 'flare', 'flareloop', 'lamp', 'crack', 'stalfall',
  'crumble', 'rumble', 'geyserwarn', 'geyser', 'burn', 'lift', 'liftstop', 'cart', 'cartstop', 'bat', 'batdie', 'shade', 'shadefade', 'crawler', 'crawldie', 'eel', 'growl',
  'bossroar', 'bosshit', 'bossdie', 'slam', 'burrow', 'wings', 'screech', 'beam', 'shatter', 'surge', 'magma', 'checkpoint', 'discover', 'journal', 'upgrade', 'medal',
  'uimove', 'uiok', 'uiback', 'rewind', 'slowmo', 'warn', 'amb1', 'amb2', 'amb3', 'amb4', 'amb5', 'waterfall'];
const VOICE = ['begin', 'd2', 'd3', 'd4', 'd5', 'deep', 'boss', 'bossdown', 'wonder', 'relic', 'lowoil', 'lastlife', 'gameover', 'newrecord', 'champion'];
export const MUSIC = new Set(['title', 'd1', 'd2', 'd3', 'd4', 'd5', 'deep', 'boss', 'clear', 'over', 'discover']);
const V = '?v=16';

export class Audio {
  constructor(base) {
    this.base = base;
    this.ctx = null;
    this.buf = new Map();
    this.vol = { master: 0.9, music: 0.5, sfx: 0.9, voice: 1 };
    this.music = null; this.musicName = null;
    this.speaking = 0; this.voiceQ = []; this.lastPlay = new Map();
    this.rate = 1; this.loading = null; this.loops = new Map(); this.beds = new Map();
  }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -12; this.comp.ratio.value = 4; this.comp.attack.value = 0.004; this.comp.release.value = 0.22;
    this.master.connect(this.comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicFilter = ctx.createBiquadFilter(); this.musicFilter.type = 'lowpass'; this.musicFilter.frequency.value = 20000;
    this.duck = ctx.createGain();
    this.musicBus.connect(this.musicFilter).connect(this.duck).connect(this.master);
    this.sfxBus = ctx.createGain(); this.sfxBus.connect(this.master);
    this.voiceBus = ctx.createGain(); this.voiceBus.connect(this.master);
    this.applyVolumes();
    this.loading = this.loadAll();
  }
  applyVolumes() {
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master; this.musicBus.gain.value = this.vol.music;
    this.sfxBus.gain.value = this.vol.sfx; this.voiceBus.gain.value = this.vol.voice;
  }
  async load(name, url) {
    if (this.buf.has(name)) return this.buf.get(name);
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const b = await this.ctx.decodeAudioData(await r.arrayBuffer());
      this.buf.set(name, b);
      return b;
    } catch { return null; }
  }
  async loadAll() {
    const jobs = [];
    for (const n of SFX) jobs.push([n, `${this.base}audio/${n}.mp3${V}`]);
    for (const n of VOICE) jobs.push(['v_' + n, `${this.base}voice/v_${n}.mp3${V}`]);
    let i = 0;
    const worker = async () => { while (i < jobs.length) { const j = jobs[i++]; await this.load(j[0], j[1]); } };
    await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  }

  // the listener rides on the camera
  setListener(cam) {
    if (!this.ctx) return;
    const L = this.ctx.listener, p = cam.position, t = this.ctx.currentTime;
    const f = _f.set(0, 0, -1).applyQuaternion(cam.quaternion), u = _u.set(0, 1, 0).applyQuaternion(cam.quaternion);
    if (L.positionX) {
      L.positionX.setTargetAtTime(p.x, t, 0.03); L.positionY.setTargetAtTime(p.y, t, 0.03); L.positionZ.setTargetAtTime(p.z, t, 0.03);
      L.forwardX.value = f.x; L.forwardY.value = f.y; L.forwardZ.value = f.z; L.upX.value = u.x; L.upY.value = u.y; L.upZ.value = u.z;
    } else { L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z); }
  }
  panner(x, y, z) {
    const p = this.ctx.createPanner();
    p.panningModel = 'equalpower'; p.distanceModel = 'inverse'; p.refDistance = 16; p.rolloffFactor = 0.9; p.maxDistance = 400;
    if (p.positionX) { p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z || 0; } else p.setPosition(x, y, z || 0);
    return p;
  }

  // o: { x, y, z } position, vol, rate, vary, gap, loop, bus
  play(name, o = {}) {
    if (!this.ctx) return null;
    const b = this.buf.get(name);
    if (!b) return null;
    const now = this.ctx.currentTime;
    const gap = o.gap ?? 0.03, last = this.lastPlay.get(name) || 0;
    if (now - last < gap) return null;
    this.lastPlay.set(name, now);
    const src = this.ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = (o.rate ?? 1) * (1 + (Math.random() - 0.5) * (o.vary ?? 0.08)) * (o.noSlow ? 1 : this.rate);
    const g = this.ctx.createGain();
    g.gain.value = o.vol ?? 1;
    let node = src.connect(g);
    let pan = null;
    if (o.x !== undefined) { pan = this.panner(o.x, o.y ?? 1, o.z ?? 0); node = node.connect(pan); }
    node.connect(o.bus === 'voice' ? this.voiceBus : this.sfxBus);
    if (o.loop) src.loop = true;
    src.start(now + (o.delay || 0));
    return { src, gain: g, pan };
  }
  // a positioned loop that can be moved and re-pitched every frame
  loop(key, name, vol = 0.4) {
    if (!this.ctx) return null;
    let h = this.loops.get(key);
    if (h) return h;
    h = this.play(name, { loop: true, vol: 0, vary: 0, gap: 0, x: 0, y: 0, z: 0 });
    if (!h) return null;
    h.base = vol;
    this.loops.set(key, h);
    return h;
  }
  setLoop(key, x, y, z, vol, rate) {
    const h = this.loops.get(key);
    if (!h) return;
    const t = this.ctx.currentTime;
    h.gain.gain.setTargetAtTime(vol * h.base, t, 0.08);
    if (rate) h.src.playbackRate.setTargetAtTime(rate * this.rate, t, 0.1);
    if (h.pan.positionX) { h.pan.positionX.setTargetAtTime(x, t, 0.03); h.pan.positionY.setTargetAtTime(y, t, 0.03); h.pan.positionZ.setTargetAtTime(z, t, 0.03); }
  }
  // a non-positional ambient bed (wind, surf, dive rush) whose level is driven every frame
  bed(key, name) {
    if (!this.ctx) return null;
    let h = this.beds.get(key);
    if (h) return h;
    const b = this.buf.get(name);
    if (!b) return null;
    const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true;
    src.loopStart = 0; src.loopEnd = b.duration;
    const g = this.ctx.createGain(); g.gain.value = 0;
    src.connect(g).connect(this.sfxBus);
    src.start(this.ctx.currentTime, Math.random() * b.duration);
    h = { src, gain: g };
    this.beds.set(key, h);
    return h;
  }
  setBed(key, name, vol, rate = 1) {
    const h = this.bed(key, name);
    if (!h) return;
    const t = this.ctx.currentTime;
    h.gain.gain.setTargetAtTime(vol, t, 0.25);
    h.src.playbackRate.setTargetAtTime(rate * this.rate, t, 0.3);
  }
  stopLoops() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const h of this.loops.values()) { h.gain.gain.setTargetAtTime(0, t, 0.1); h.src.stop(t + 0.5); }
    this.loops.clear();
  }

  // narration: one line at a time, music ducks underneath
  say(name, o = {}) {
    if (!this.ctx || !this.buf.has(name)) return false;
    const now = this.ctx.currentTime;
    if (this.speaking > now + 0.1) { if (o.priority) this.voiceQ = [{ name, o }]; return false; }
    const b = this.buf.get(name), start = now + (o.delay || 0);
    this.line = this.play(name, { bus: 'voice', vary: 0, noSlow: true, vol: o.vol ?? 1, gap: 0, delay: o.delay });
    this.speaking = start + b.duration;
    const d = this.duck.gain;
    d.cancelScheduledValues(now);
    d.setTargetAtTime(0.42, start, 0.05);
    d.setTargetAtTime(1, this.speaking + 0.1, 0.25);
    clearTimeout(this.qTimer);
    this.qTimer = setTimeout(() => { const n = this.voiceQ.shift(); if (n) this.say(n.name, n.o); }, (this.speaking - now) * 1000 + 120);
    return true;
  }
  hush() {
    this.voiceQ = []; clearTimeout(this.qTimer);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try { if (this.line) this.line.src.stop(); } catch { /* ended */ }
    this.line = null; this.speaking = 0;
    this.duck.gain.cancelScheduledValues(now); this.duck.gain.setTargetAtTime(1, now, 0.2);
  }

  async playMusic(name, fade = 1.5) {
    if (!this.ctx || this.musicName === name || !MUSIC.has(name)) return;
    this.musicName = name;
    const b = await this.load('music_' + name, `${this.base}music/${name}.mp3${V}`);
    if (!b || this.musicName !== name) return;
    this.stopMusic(fade);
    const m = { name, b, voices: [], stop: false };
    this.music = m;
    const XF = 3;
    const schedule = (when) => {
      if (m.stop) return;
      const src = this.ctx.createBufferSource();
      src.buffer = b; src.playbackRate.value = this.rate;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(1, when + (m.voices.length ? XF : fade));
      src.connect(g).connect(this.musicBus);
      src.start(when);
      const dur = b.duration / this.rate;
      g.gain.setValueAtTime(1, when + dur - XF);
      g.gain.linearRampToValueAtTime(0, when + dur);
      src.stop(when + dur + 0.1);
      m.voices.push({ src, g });
      if (m.voices.length > 3) m.voices.shift();
      m.timer = setTimeout(() => schedule(when + dur - XF), Math.max(0, (when + dur - XF - this.ctx.currentTime - 1) * 1000));
    };
    schedule(this.ctx.currentTime + 0.05);
  }
  stopMusic(fade = 1) {
    const m = this.music;
    if (!m) return;
    m.stop = true; clearTimeout(m.timer);
    const now = this.ctx.currentTime;
    for (const v of m.voices) {
      try { v.g.gain.cancelScheduledValues(now); v.g.gain.setValueAtTime(v.g.gain.value, now); v.g.gain.linearRampToValueAtTime(0, now + fade); v.src.stop(now + fade + 0.05); } catch { /* stopped */ }
    }
    this.music = null;
    if (!fade) this.musicName = null;
  }
  sting(name) {
    if (!this.ctx || !MUSIC.has(name)) return;
    this.musicName = null;
    this.stopMusic(0.6);
    this.load('music_' + name, `${this.base}music/${name}.mp3${V}`).then((b) => {
      if (!b) return;
      const src = this.ctx.createBufferSource(); src.buffer = b;
      src.connect(this.musicBus); src.start();
    });
  }
  // a short sting over the music (the music ducks under it)
  overlay(name, vol = 0.9) {
    if (!this.ctx || !MUSIC.has(name)) return;
    this.load('music_' + name, `${this.base}music/${name}.mp3${V}`).then((b) => {
      if (!b) return;
      const src = this.ctx.createBufferSource(); src.buffer = b;
      const g = this.ctx.createGain(); g.gain.value = vol;
      src.connect(g).connect(this.voiceBus); src.start();
      const now = this.ctx.currentTime, d = this.duck.gain;
      d.cancelScheduledValues(now); d.setTargetAtTime(0.35, now, 0.08); d.setTargetAtTime(1, now + b.duration * 0.8, 0.5);
    });
  }
  setRate(r) {
    if (!this.ctx || Math.abs(r - this.rate) < 0.01) return;
    this.rate = r;
    const now = this.ctx.currentTime;
    if (this.music) for (const v of this.music.voices) v.src.playbackRate.setTargetAtTime(r, now, 0.12);
    this.musicFilter.frequency.setTargetAtTime(r < 0.9 ? 900 + r * 3000 : 20000, now, 0.1);
  }
  muffle(on) { if (this.ctx) this.musicFilter.frequency.setTargetAtTime(on ? 700 : 20000, this.ctx.currentTime, 0.15); }
}
const _f = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }, applyQuaternion(q) { const { x, y, z } = this, qx = q.x, qy = q.y, qz = q.z, qw = q.w; const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z; this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy; this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz; this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx; return this; } };
const _u = { ..._f };
_u.set = _f.set; _u.applyQuaternion = _f.applyQuaternion;

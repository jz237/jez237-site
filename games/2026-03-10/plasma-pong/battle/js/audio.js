// Audio: every sound is an ElevenLabs render (music, effects, announcer, pilot voices).
// Effects are panned by court position; voices duck the music; music loops with a crossfade
// and slows like tape during slow motion.
const SFX = ['hit1', 'hit2', 'hit3', 'wall1', 'wall2', 'smash', 'serve', 'fire1', 'fire2', 'stun', 'boltcell', 'crack', 'shatter',
  'corehit', 'coreboom', 'cheer', 'ooh', 'puspawn', 'pucollect', 'multi', 'titan', 'shrink', 'nova', 'repair', 'drone', 'singularity',
  'ghost', 'magnet', 'barrier', 'storm', 'chrono', 'scope', 'overdrive', 'bumper', 'portal', 'beep', 'go', 'uimove', 'uiok', 'uiback',
  'whoosh', 'slowmo', 'alarm', 'bosslaser', 'ko', 'arc', 'bhhum', 'rewind'];
const ANN = ['title', 'battle', 'round1', 'round2', 'round3', 'round4', 'final', 'fight', 'ready', 'breach', 'critical', 'shielddown',
  'destroyed', 'ko', 'victory', 'defeat', 'p1wins', 'p2wins', 'perfect', 'smash', 'supersmash', 'multi', 'titan', 'shrink', 'nova',
  'repair', 'drone', 'singularity', 'ghost', 'magnet', 'barrier', 'storm', 'chrono', 'scope', 'overdrive', 'stunned', 'boss',
  'challenger', 'demo', 'continue', 'gameover', 'comeback', 'matchpoint', 'rally', 'trickshot', 'denied', 'champion', 'three', 'two', 'one',
  'replay', 'unlocked', 'pilot', 'online', 'found', 'lost'];
const PILOT_LINES = { volt: 6, nyx: 6, krank: 6, seraph: 6, monolith: 7 };
const LINES = ['intro', 'score', 'hurt', 'lose', 'win', 'taunt', 'phase2'];
const V = '?v=1';

export class Audio {
  constructor(base) {
    this.base = base;
    this.ctx = null;
    this.buf = new Map();
    this.vol = { master: 0.9, music: 0.55, sfx: 0.9, voice: 1 };
    this.music = null;
    this.musicName = null;
    this.speaking = 0;
    this.voiceQ = [];
    this.lastPlay = new Map();
    this.rate = 1;
    this.loading = null;
  }

  // must run inside a user gesture
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -10; this.comp.ratio.value = 4; this.comp.attack.value = 0.004; this.comp.release.value = 0.2;
    this.master.connect(this.comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicFilter = ctx.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = 20000;
    this.duck = ctx.createGain();
    this.musicBus.connect(this.musicFilter).connect(this.duck).connect(this.master);
    this.sfxBus = ctx.createGain();
    this.sfxBus.connect(this.master);
    this.voiceBus = ctx.createGain();
    this.voiceBus.connect(this.master);
    this.applyVolumes();
    this.loading = this.loadAll();
  }

  applyVolumes() {
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master;
    this.musicBus.gain.value = this.vol.music;
    this.sfxBus.gain.value = this.vol.sfx;
    this.voiceBus.gain.value = this.vol.voice;
  }

  async load(name, url) {
    if (this.buf.has(name)) return this.buf.get(name);
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const ab = await r.arrayBuffer();
      const b = await this.ctx.decodeAudioData(ab);
      this.buf.set(name, b);
      return b;
    } catch { return null; }
  }

  async loadAll() {
    const jobs = [];
    for (const n of SFX) jobs.push([n, `${this.base}audio/${n}.mp3${V}`]);
    for (const n of ANN) jobs.push(['ann_' + n, `${this.base}voice/ann_${n}.mp3${V}`]);
    for (const [p, count] of Object.entries(PILOT_LINES)) for (const l of LINES.slice(0, count)) jobs.push([`${p}_${l}`, `${this.base}voice/${p}_${l}.mp3${V}`]);
    // a few at a time so the first sounds are ready quickly
    let i = 0;
    const worker = async () => { while (i < jobs.length) { const j = jobs[i++]; await this.load(j[0], j[1]); } };
    await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  }

  // x in court units (-7..7) pans, z (far side) attenuates slightly
  play(name, o = {}) {
    if (!this.ctx) return null;
    const b = this.buf.get(name);
    if (!b) return null;
    const now = this.ctx.currentTime;
    const gap = o.gap ?? 0.03;
    const last = this.lastPlay.get(name) || 0;
    if (now - last < gap) return null;
    this.lastPlay.set(name, now);
    const src = this.ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = (o.rate ?? 1) * (1 + (Math.random() - 0.5) * (o.vary ?? 0.06)) * (o.noSlow ? 1 : this.rate);
    const g = this.ctx.createGain();
    let vol = o.vol ?? 1;
    if (o.z !== undefined) vol *= 0.75 + 0.25 * Math.min(1, Math.max(0, (o.z + 12) / 24));
    g.gain.value = vol;
    let node = src.connect(g);
    if (o.x !== undefined && this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-0.85, Math.min(0.85, o.x / 8.5));
      node = node.connect(p);
    }
    node.connect(o.bus === 'voice' ? this.voiceBus : this.sfxBus);
    src.start(now + (o.delay || 0));
    if (o.loop) src.loop = true;
    return { src, gain: g };
  }

  // Announcer / pilot lines: one at a time, music ducks underneath.
  say(name, o = {}) {
    if (!this.ctx || !this.buf.has(name)) return;
    const now = this.ctx.currentTime;
    if (this.speaking > now + 0.1) {
      if (o.priority) { this.voiceQ = [{ name, o }]; }
      else if (o.queue && this.voiceQ.length < 2) this.voiceQ.push({ name, o });
      return;
    }
    const b = this.buf.get(name);
    const start = now + (o.delay || 0);
    this.play(name, { bus: 'voice', vary: 0, noSlow: true, vol: o.vol ?? 1, gap: 0, delay: o.delay });
    this.speaking = start + b.duration;
    const d = this.duck.gain;
    d.cancelScheduledValues(now);
    d.setTargetAtTime(0.45, start, 0.05);
    d.setTargetAtTime(1, this.speaking + 0.1, 0.25);
    clearTimeout(this.qTimer);
    this.qTimer = setTimeout(() => {
      const n = this.voiceQ.shift();
      if (n) this.say(n.name, n.o);
    }, (this.speaking - now) * 1000 + 120);
  }

  async playMusic(name, fade = 1.5) {
    if (!this.ctx) return;
    if (this.musicName === name) return;
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
      src.buffer = b;
      src.playbackRate.value = this.rate;
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
    m.stop = true;
    clearTimeout(m.timer);
    const now = this.ctx.currentTime;
    for (const v of m.voices) {
      try {
        v.g.gain.cancelScheduledValues(now);
        v.g.gain.setValueAtTime(v.g.gain.value, now);
        v.g.gain.linearRampToValueAtTime(0, now + fade);
        v.src.stop(now + fade + 0.05);
      } catch { /* already stopped */ }
    }
    this.music = null;
    if (!fade) this.musicName = null;
  }

  sting(name) {
    if (!this.ctx) return;
    this.musicName = null;
    this.stopMusic(0.6);
    this.load('music_' + name, `${this.base}music/${name}.mp3${V}`).then((b) => {
      if (!b) return;
      const src = this.ctx.createBufferSource();
      src.buffer = b;
      const g = this.ctx.createGain();
      g.gain.value = 1;
      src.connect(g).connect(this.musicBus);
      src.start();
    });
  }

  // slow motion: music + effects play slower and darker
  setRate(r) {
    if (!this.ctx) return;
    if (Math.abs(r - this.rate) < 0.01) return;
    this.rate = r;
    const now = this.ctx.currentTime;
    if (this.music) for (const v of this.music.voices) v.src.playbackRate.setTargetAtTime(r, now, 0.12);
    this.musicFilter.frequency.setTargetAtTime(r < 0.9 ? 900 + r * 3000 : 20000, now, 0.1);
  }

  muffle(on) {
    if (!this.ctx) return;
    this.musicFilter.frequency.setTargetAtTime(on ? 700 : 20000, this.ctx.currentTime, 0.15);
  }

  loop(name, vol = 0.4) {
    const h = this.play(name, { loop: true, vol, vary: 0, gap: 0 });
    return h;
  }
  stopLoop(h, fade = 0.5) {
    if (!h || !this.ctx) return;
    const now = this.ctx.currentTime;
    h.gain.gain.setTargetAtTime(0, now, fade / 3);
    h.src.stop(now + fade);
  }
}

// Game audio (Web Audio API). Cannon shots and shell explosions use real
// recorded samples (assets/audio/*.mp3, randomized + pitch-jittered);
// everything else — engine rumble, wind, clicks, whistles — is synthesized.
// The synth versions remain as fallback until the samples finish decoding.

import { MUTE_KEY } from './config.js?v=5';
import { settings, setSetting } from './settings.js?v=5';

const SAMPLES = {
  fire: ['shot-01', 'shot-02', 'shot-03', 'shot-04', 'shot-05'],
  explosion: ['explosion-01', 'explosion-02', 'explosion-03', 'explosion-04', 'explosion-05'],
  waveAlert: ['wave-alert'],
};

const MUSIC_TRACKS = {
  menu: './assets/audio/music-menu.mp3',
  battle: './assets/audio/music-battle.mp3',
};
const MUSIC_BASE = 0.62; // headroom under the combat SFX

// commander voice lines (ElevenLabs), played through a radio bandpass
const VO_LINES = ['deploy', 'armor', 'strike-ready', 'strike-in', 'critical',
  'wave-clear', 'convoy', 'repaired', 'boss', 'streak'];

export class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem(MUTE_KEY) === '1';
    this.engineNodes = null;
    this.windNodes = null;
    this.buffers = { fire: [], explosion: [], waveAlert: [] };
    this.musicBuffers = {};
    this.musicLoading = {};
    this.musicNodes = null;   // { src, gain, track }
    this.musicWant = null;    // requested before the ctx exists
    this.voBuffers = {};
    this.voBusyUntil = 0;
  }

  ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.sfxGainValue();
      this.master.connect(this.ctx.destination);
      this.startWind();
      this.loadSamples();
      this.loadVoices();
      if (this.musicWant) this.startMusic(this.musicWant);
    } catch { return false; }
    return true;
  }

  sfxGainValue() { return this.muted ? 0 : 0.8 * settings.sfxVol; }
  musicGainValue() { return (this.muted || !settings.musicOn) ? 0 : MUSIC_BASE * settings.musicVol; }

  // -------- background music (looping buffers, gentle crossfade) --------
  async loadMusic(track) {
    if (this.musicBuffers[track] || this.musicLoading[track]) return this.musicLoading[track];
    this.musicLoading[track] = fetch(MUSIC_TRACKS[track])
      .then(r => r.arrayBuffer())
      .then(buf => this.ctx.decodeAudioData(buf))
      .then(decoded => { this.musicBuffers[track] = decoded; return decoded; })
      .catch(() => { delete this.musicLoading[track]; return null; }); // flaky network: retry later
    return this.musicLoading[track];
  }

  async startMusic(track) {
    this.musicWant = track;
    if (!this.ctx) return; // starts on ensure() (first user gesture)
    if (this.musicNodes?.track === track) return;
    const buf = await this.loadMusic(track);
    if (!buf || this.musicWant !== track || this.musicNodes?.track === track) return;
    const t = this.ctx.currentTime;
    if (this.musicNodes) {
      const old = this.musicNodes;
      old.gain.gain.setTargetAtTime(0, t, 0.5);
      setTimeout(() => { try { old.src.stop(); } catch {} }, 2200);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.setTargetAtTime(this.musicGainValue(), t, 1.2);
    src.connect(gain).connect(this.ctx.destination);
    src.start(t);
    this.musicNodes = { src, gain, track };
  }

  syncMusicGain() {
    if (this.musicNodes && this.ctx) {
      this.musicNodes.gain.gain.setTargetAtTime(this.musicGainValue(), this.ctx.currentTime, 0.15);
    }
  }

  setMusicOn(on) {
    setSetting('musicOn', !!on);
    this.syncMusicGain();
  }

  setMusicVolume(v) {
    setSetting('musicVol', v);
    this.syncMusicGain();
  }

  setSfxVolume(v) {
    setSetting('sfxVol', v);
    if (this.master) this.master.gain.value = this.sfxGainValue();
  }

  // -------- commander voice callouts (radio-filtered) --------
  loadVoices() {
    for (const name of VO_LINES) {
      fetch(`./assets/audio/vo-${name}.mp3`)
        .then(r => r.arrayBuffer())
        .then(buf => this.ctx.decodeAudioData(buf))
        .then(decoded => { this.voBuffers[name] = decoded; })
        .catch(() => {});
    }
  }

  vo(name, priority = false) {
    if (!this.ctx || !(settings.voiceOn ?? true)) return;
    const buf = this.voBuffers[name];
    if (!buf) return;
    const now = this.ctx.currentTime;
    if (!priority && now < this.voBusyUntil) return; // don't talk over yourself
    this.voBusyUntil = now + buf.duration + 0.6;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    // radio squawk: bandpass + a touch of drive
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1500;
    bp.Q.value = 0.55;
    const shaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(64);
    for (let i = 0; i < 64; i++) {
      const x = (i / 63) * 2 - 1;
      curve[i] = Math.tanh(x * 2.2);
    }
    shaper.curve = curve;
    const g = this.ctx.createGain();
    g.gain.value = 0.9;
    src.connect(bp).connect(shaper).connect(g).connect(this.master);
    src.start(now);
  }

  // rapid coax MG report — short filtered noise snap per round
  mgShot() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer(0.05);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900 + Math.random() * 500;
    f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    n.connect(f).connect(g).connect(this.master);
    n.start(t);
  }

  loadSamples() {
    for (const [set, names] of Object.entries(SAMPLES)) {
      for (const name of names) {
        fetch(`./assets/audio/${name}.mp3`)
          .then(r => r.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => this.buffers[set].push(decoded))
          .catch(() => {}); // synth fallback covers missing/failed samples
      }
    }
  }

  // returns false when the sample set isn't ready (caller falls back to synth)
  playSample(set, vol = 1, rateJitter = 0.14, maxDuration = 0) {
    const list = this.buffers[set];
    if (!this.ctx || !list || list.length === 0) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = list[(Math.random() * list.length) | 0];
    src.playbackRate.value = 1 - rateJitter / 2 + Math.random() * rateJitter;
    const g = this.ctx.createGain();
    g.gain.value = Math.min(1.4, vol);
    src.connect(g).connect(this.master);
    const t = this.ctx.currentTime;
    src.start(t);
    if (maxDuration > 0) {
      try { src.stop(t + Math.min(maxDuration, src.buffer.duration)); } catch {}
    }
    return true;
  }

  resume() {
    // iOS can leave the context 'interrupted' after backgrounding
    if (this.ctx && this.ctx.state !== 'running') this.ctx.resume();
    // music that failed to load (or never got a chance) tries again here
    if (this.ctx && this.musicWant && !this.musicNodes) this.startMusic(this.musicWant);
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem(MUTE_KEY, m ? '1' : '0');
    if (this.master) this.master.gain.value = this.sfxGainValue();
    this.syncMusicGain();
  }

  noiseBuffer(seconds = 1) {
    const len = this.ctx.sampleRate * seconds;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  startWind() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(2);
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.value = 0.045;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.13;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 130;
    lfo.connect(lfoG).connect(filt.frequency);
    src.connect(filt).connect(g).connect(this.master);
    src.start(); lfo.start();
    this.windNodes = { g };
  }

  startEngine() {
    if (!this.ctx || this.engineNodes) return;
    const ctx = this.ctx;
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 42;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 85;
    const o3 = ctx.createOscillator(); o3.type = 'square'; o3.frequency.value = 21;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 220; filt.Q.value = 1.2;
    const g = ctx.createGain(); g.gain.value = 0.0;
    const g3 = ctx.createGain(); g3.gain.value = 0.3;
    o1.connect(filt); o2.connect(filt); o3.connect(g3).connect(filt);
    filt.connect(g).connect(this.master);
    o1.start(); o2.start(); o3.start();
    this.engineNodes = { o1, o2, o3, filt, g };
  }

  stopEngine() {
    if (!this.engineNodes) return;
    const { o1, o2, o3, g } = this.engineNodes;
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
    setTimeout(() => { try { o1.stop(); o2.stop(); o3.stop(); } catch {} }, 350);
    this.engineNodes = null;
  }

  engine(throttle, speed) {
    if (!this.engineNodes) return;
    const t = this.ctx.currentTime;
    const load = Math.min(1, Math.abs(throttle) * 0.7 + Math.abs(speed) / 14 * 0.5);
    const { o1, o2, o3, filt, g } = this.engineNodes;
    o1.frequency.setTargetAtTime(42 + load * 38, t, 0.12);
    o2.frequency.setTargetAtTime(85 + load * 70, t, 0.12);
    o3.frequency.setTargetAtTime(21 + load * 18, t, 0.12);
    filt.frequency.setTargetAtTime(220 + load * 480, t, 0.15);
    g.gain.setTargetAtTime(0.05 + load * 0.075, t, 0.1);
  }

  blast({ freq = 60, dur = 0.5, vol = 0.9, noiseVol = 0.7, noiseFreq = 900 }) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    // sub thump
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 2.2, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + dur);
    const og = ctx.createGain();
    og.gain.setValueAtTime(vol, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(og).connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
    // crack
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer(dur);
    const nf = ctx.createBiquadFilter();
    nf.type = 'lowpass';
    nf.frequency.setValueAtTime(noiseFreq * 4, t);
    nf.frequency.exponentialRampToValueAtTime(noiseFreq * 0.4, t + dur);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(noiseVol, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + dur);
    n.connect(nf).connect(ng).connect(this.master);
    n.start(t);
  }

  fire(vol = 1) {
    if (this.playSample('fire', vol)) return;
    this.blast({ freq: 55, dur: 0.42, vol: 0.85 * vol, noiseVol: 0.8 * vol, noiseFreq: 1100 });
  }

  explosion(big = 1) {
    const vol = Math.min(1.35, 0.45 + big * 0.55);
    if (this.playSample('explosion', vol)) {
      // keep the synth sub-thump under the sample for body on big blasts
      if (big > 1.2) this.blast({ freq: 38, dur: 0.5, vol: 0.4, noiseVol: 0, noiseFreq: 400 });
      return;
    }
    this.blast({ freq: 42, dur: 0.7 * big + 0.3, vol: 1.0, noiseVol: 0.75, noiseFreq: 600 });
  }
  hitTink() { this.blast({ freq: 220, dur: 0.12, vol: 0.25, noiseVol: 0.3, noiseFreq: 2400 }); }
  damaged() { this.blast({ freq: 90, dur: 0.3, vol: 0.5, noiseVol: 0.5, noiseFreq: 500 }); }
  whiz() { this.blast({ freq: 600, dur: 0.18, vol: 0.06, noiseVol: 0.3, noiseFreq: 3200 }); }

  // descending artillery whistle
  whistle() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1850, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 1.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + 1.7);
  }

  click() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = 1400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + 0.08);
  }

  reloadDone() {
    if (!this.ctx) return;
    this.click();
    setTimeout(() => this.click(), 90);
  }

  waveAlert() {
    if (!this.ctx) return;
    if (this.playSample('waveAlert', 0.9, 0, 2.75)) return;
    setTimeout(() => this.playSample('waveAlert', 0.9, 0, 2.75), 180);
  }
}

// Synthesized audio (Web Audio API, no files): engine rumble that follows
// throttle, cannon boom, reload clicks, explosions, hits, ambient wind.

import { MUTE_KEY } from './config.js';

export class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem(MUTE_KEY) === '1';
    this.engineNodes = null;
    this.windNodes = null;
  }

  ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.8;
      this.master.connect(this.ctx.destination);
      this.startWind();
    } catch { return false; }
    return true;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem(MUTE_KEY, m ? '1' : '0');
    if (this.master) this.master.gain.value = m ? 0 : 0.8;
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

  fire() { this.blast({ freq: 55, dur: 0.42, vol: 0.85, noiseVol: 0.8, noiseFreq: 1100 }); }
  explosion(big = 1) { this.blast({ freq: 42, dur: 0.7 * big + 0.3, vol: 1.0, noiseVol: 0.75, noiseFreq: 600 }); }
  hitTink() { this.blast({ freq: 220, dur: 0.12, vol: 0.25, noiseVol: 0.3, noiseFreq: 2400 }); }
  damaged() { this.blast({ freq: 90, dur: 0.3, vol: 0.5, noiseVol: 0.5, noiseFreq: 500 }); }

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
}

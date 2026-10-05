import { RNG } from '../core/rng.js';

// Live, synthesised sound for the interactive modes (the film keeps its
// pre-rendered score). Nothing plays until the viewer turns sound on.
//   wing buzz that follows wingbeat and speed · pollen-drum whirr ·
//   music-box bells (FM, as in the score) · escapement ticks by distance ·
//   ratchet and root swell when the garden is wound · a soft pad whose
//   chord follows the time of day · songbird chirps.

const N = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class LiveAudio {
  constructor() {
    this.enabled = false;
    this.ctx = null;
  }

  async enable() {
    if (!this.ctx) this._build();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.enabled = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0.9, t, 0.25);
    return true;
  }

  disable() {
    this.enabled = false;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0, t, 0.08);
  }

  async toggle() {
    if (this.enabled) { this.disable(); return false; }
    return this.enable();
  }

  _build() {
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const rng = new RNG('live-audio');
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    this.master.connect(comp).connect(ctx.destination);
    // glasshouse reverb from decaying noise
    const len = Math.floor(ctx.sampleRate * 2.6);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) { const k = i / len; d[i] = (rng.float() * 2 - 1) * Math.pow(1 - k, 3) * (1 - Math.exp(-i / 250)); }
    }
    this.verb = ctx.createConvolver();
    this.verb.buffer = ir;
    const vg = ctx.createGain();
    vg.gain.value = 0.35;
    this.verb.connect(vg).connect(this.master);
    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    { const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rng.float() * 2 - 1; }

    // wing buzz: sawtooth + square octave through a lowpass, with vibrato
    const bz = (this.buzzNodes = {});
    bz.o1 = ctx.createOscillator(); bz.o1.type = 'sawtooth'; bz.o1.frequency.value = 180;
    bz.o2 = ctx.createOscillator(); bz.o2.type = 'square'; bz.o2.frequency.value = 361;
    bz.lfo = ctx.createOscillator(); bz.lfo.frequency.value = 7;
    bz.lfoG = ctx.createGain(); bz.lfoG.gain.value = 4;
    bz.lfo.connect(bz.lfoG); bz.lfoG.connect(bz.o1.frequency); bz.lfoG.connect(bz.o2.frequency);
    bz.g2 = ctx.createGain(); bz.g2.gain.value = 0.25;
    bz.f = ctx.createBiquadFilter(); bz.f.type = 'lowpass'; bz.f.frequency.value = 900; bz.f.Q.value = 3;
    bz.g = ctx.createGain(); bz.g.gain.value = 0;
    bz.o1.connect(bz.f); bz.o2.connect(bz.g2).connect(bz.f); bz.f.connect(bz.g);
    this._out(bz.g, 0.12, 0);
    bz.o1.start(); bz.o2.start(); bz.lfo.start();
    // pollen drum whirr
    const wh = (this.whirr = {});
    wh.src = ctx.createBufferSource(); wh.src.buffer = this.noiseBuf; wh.src.loop = true;
    wh.f = ctx.createBiquadFilter(); wh.f.type = 'bandpass'; wh.f.frequency.value = 2600; wh.f.Q.value = 6;
    wh.g = ctx.createGain(); wh.g.gain.value = 0;
    wh.src.connect(wh.f).connect(wh.g);
    this._out(wh.g, 0.3, 0);
    wh.src.start();
    // pad
    this.pad = [];
    for (let i = 0; i < 4; i++) {
      const o = ctx.createOscillator(); o.type = 'triangle';
      const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.detune.value = 7;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1100;
      const g = ctx.createGain(); g.gain.value = 0;
      o.connect(f); o2.connect(f); f.connect(g);
      this._out(g, 0.6, (i - 1.5) * 0.3);
      o.start(); o2.start();
      this.pad.push({ o, o2, g });
    }
    this._padChord = null;
    // garden air
    const air = ctx.createBufferSource(); air.buffer = this.noiseBuf; air.loop = true;
    const af = ctx.createBiquadFilter(); af.type = 'bandpass'; af.frequency.value = 5200; af.Q.value = 1.8;
    this.airG = ctx.createGain(); this.airG.gain.value = 0.004;
    air.connect(af).connect(this.airG);
    this._out(this.airG, 0.6, 0);
    air.start();
  }

  _out(node, wet = 0.3, pan = 0) {
    const p = this.ctx.createStereoPanner();
    p.pan.value = pan;
    node.connect(p);
    p.connect(this.master);
    const s = this.ctx.createGain();
    s.gain.value = wet;
    p.connect(s).connect(this.verb);
    return p;
  }

  // per frame: wings and drum
  frame({ flap = 0, speed = 0, boost = 0, collect = 0, near = 1, tod = 0.8 }) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const bz = this.buzzNodes;
    const f0 = 165 + Math.min(speed, 70) * 1.5 + boost * 35;
    bz.o1.frequency.setTargetAtTime(f0, t, 0.05);
    bz.o2.frequency.setTargetAtTime(f0 * 2.005, t, 0.05);
    bz.f.frequency.setTargetAtTime(700 + speed * 22 + boost * 600, t, 0.05);
    bz.g.gain.setTargetAtTime(flap * (0.035 + Math.min(speed, 60) * 0.0006 + boost * 0.012) * near, t, 0.06);
    this.whirr.g.gain.setTargetAtTime(collect * 0.03 * near, t, 0.08);
    // pad chord drifts with the hour: midnight minor colour → golden major
    const chord = tod < 0.35 ? [38, 45, 53, 60] : tod < 0.7 ? [38, 45, 54, 61] : [38, 50, 57, 66];
    const key = chord.join();
    if (key !== this._padChord) {
      this._padChord = key;
      this.pad.forEach((v, i) => { v.o.frequency.setTargetAtTime(N(chord[i]), t, 1.2); v.o2.frequency.setTargetAtTime(N(chord[i]), t, 1.2); v.g.gain.setTargetAtTime(0.012, t, 2.5); });
    }
    this.airG.gain.setTargetAtTime(0.002 + tod * 0.004, t, 1);
  }

  bell(m, gain = 0.05, pan = 0, when = 0) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime + when;
    const car = ctx.createOscillator(); car.frequency.value = N(m);
    const mod = ctx.createOscillator(); mod.frequency.value = N(m) * 3.5;
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(N(m) * 2.2, t);
    mg.gain.setTargetAtTime(0, t, 0.25);
    mod.connect(mg).connect(car.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.004);
    g.gain.setTargetAtTime(0, t + 0.004, 0.7);
    car.connect(g);
    this._out(g, 0.5, pan);
    car.start(t); mod.start(t);
    car.stop(t + 4); mod.stop(t + 4);
  }

  chord(notes, gain = 0.035, spread = 0.06) {
    notes.forEach((m, i) => this.bell(m, gain, (i / Math.max(1, notes.length - 1) - 0.5) * 0.6, i * spread));
  }

  _noise(t, dur, { freq = 3000, q = 6, gain = 0.2, decay = 0.006, type = 'bandpass', pan = 0, wet = 0.2 } = {}) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.001);
    g.gain.setTargetAtTime(0, t + 0.001, decay);
    src.connect(f).connect(g);
    this._out(g, wet, pan);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + decay * 8);
  }

  tick(tock, gain = 0.3, pan = -0.1) {
    if (!this.enabled || !this.ctx || gain < 0.005) return;
    const t = this.ctx.currentTime;
    this._noise(t, 0.012, { freq: tock ? 2400 : 3400, gain: gain * 0.5, pan });
    this._noise(t + 0.024, 0.006, { freq: 5200, q: 10, gain: gain * 0.15, decay: 0.004, pan });
  }

  ratchet(n = 14, gain = 0.25) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime;
    for (let i = 0; i < n; i++) this._noise(t0 + i * 0.055 * (1 - i / (n * 2.2)), 0.008, { freq: 2900 + (i % 3) * 180, q: 7, gain, decay: 0.005 });
  }

  swell(f0 = 110, f1 = 440, dur = 1.8, gain = 0.06) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + dur * 0.3);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
    o.connect(g);
    this._out(g, 0.5, 0);
    o.start(t); o.stop(t + dur + 0.5);
  }

  chirp(pan = 0, gain = 0.02) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    let t = ctx.currentTime;
    const n = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator();
      const f0 = 2600 + Math.random() * 1600;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f0 * (1.2 + Math.random() * 0.4), t + 0.08);
      o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.015);
      g.gain.linearRampToValueAtTime(0, t + 0.16);
      o.connect(g);
      this._out(g, 0.6, pan);
      o.start(t); o.stop(t + 0.2);
      t += 0.12 + Math.random() * 0.1;
    }
  }

  // a soft shutter for photo mode
  shutter() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    this._noise(t, 0.02, { freq: 1800, q: 2, gain: 0.12, decay: 0.01 });
    this._noise(t + 0.07, 0.02, { freq: 1400, q: 2, gain: 0.08, decay: 0.012 });
  }
}

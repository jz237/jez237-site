import { B, DURATION, tickState } from '../direction/beats.js';
import { RNG } from '../core/rng.js';

// Procedural sound for The Clockwork Garden. Everything is synthesised (no
// samples), rendered once into an AudioBuffer with an OfflineAudioContext the
// first time the viewer turns sound on, then played in sync with the film.
//
// Layers: escapement ticks · the travelling pulse · ratchet release and gear
// whirr · petal hinges · wing hum (bee, hummingbird) · a music-box melody
// over a slow D-major pad that swells for the reveal and resolves on the title.

const SR = 44100;

// D-major palette (Hz)
const N = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

export async function renderScore() {
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * DURATION), SR);
  const rng = new RNG('score');
  const master = ctx.createGain();
  master.gain.value = 2.0;
  // gentle glue: a soft compressor on the master
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 2.5;
  comp.attack.value = 0.02;
  comp.release.value = 0.3;
  master.connect(comp).connect(ctx.destination);

  // shared reverb: a synthetic decaying-noise impulse (greenhouse glass)
  const verb = ctx.createConvolver();
  const irLen = Math.floor(SR * 3.2);
  const ir = ctx.createBuffer(2, irLen, SR);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < irLen; i++) {
      const k = i / irLen;
      d[i] = (rng.float() * 2 - 1) * Math.pow(1 - k, 3.2) * (1 - Math.exp(-i / 300));
    }
  }
  verb.buffer = ir;
  const verbGain = ctx.createGain();
  verbGain.gain.value = 0.32;
  verb.connect(verbGain).connect(master);
  const bus = (wet = 0.3, pan = 0) => {
    const g = ctx.createGain();
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    g.connect(p);
    p.connect(master);
    const s = ctx.createGain();
    s.gain.value = wet;
    p.connect(s).connect(verb);
    return g;
  };
  const noiseBuf = ctx.createBuffer(1, SR * 2, SR);
  { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rng.float() * 2 - 1; }
  const noise = (t, dur, out, { type = 'bandpass', freq = 3000, q = 8, gain = 0.3, attack = 0.001, decay = null, freqEnd = null } = {}) => {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    if (decay) g.gain.setTargetAtTime(0, t + attack, decay);
    else g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(f).connect(g).connect(out);
    src.start(t, rng.float() * 1.5);
    src.stop(t + dur + (decay ? decay * 6 : 0.05));
  };
  const tone = (t, freq, dur, out, { type = 'sine', gain = 0.2, attack = 0.005, decay = 0.2, detune = 0 } = {}) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.setTargetAtTime(0, t + attack, decay);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + attack + decay * 7 + 0.05);
  };

  // ---- escapement ticks ---------------------------------------------------
  const tickBus = bus(0.18, -0.15);
  const tickLevel = (t) => {
    if (t < 9) return 1;
    if (t < 14) return 1 - (t - 9) / 5 * 0.75;
    if (t < 50) return 0.22;
    return 0.22 + Math.min(1, (t - 50) / 4) * 0.35;
  };
  for (let t = B.balanceStart + B.balancePeriod * 0.5; t < DURATION - 0.6; t += B.balancePeriod / 2) {
    const ts = tickState(t + 0.0001);
    const tock = ts.count % 2 === 0;
    const lv = tickLevel(t) * 0.55;
    noise(t, 0.012, tickBus, { freq: tock ? 2400 : 3400, q: 6, gain: lv * 0.9, decay: 0.006 });
    tone(t, tock ? 3150 : 4180, 0.05, tickBus, { gain: lv * 0.12, decay: 0.018 });
    tone(t, tock ? 5230 : 6620, 0.05, tickBus, { gain: lv * 0.06, decay: 0.012 });
    // the escape wheel's little recoil
    noise(t + 0.024, 0.006, tickBus, { freq: 5200, q: 10, gain: lv * 0.25, decay: 0.004 });
  }

  // ---- the pulse: a warm swell travelling along the root -------------------
  const pulseBus = bus(0.4, 0);
  {
    const t0 = B.pulseLaunch, t1 = B.pulseArrive;
    noise(t0 - 0.2, t1 - t0 + 0.4, pulseBus, { type: 'bandpass', freq: 220, freqEnd: 1100, q: 3.5, gain: 0.22, attack: 0.5 });
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(N(50), t0);
    o.frequency.exponentialRampToValueAtTime(N(57), t1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.09, t0 + 0.6);
    g.gain.linearRampToValueAtTime(0.12, t1 - 0.1);
    g.gain.linearRampToValueAtTime(0, t1 + 0.6);
    o.connect(g).connect(pulseBus);
    o.start(t0);
    o.stop(t1 + 0.8);
    // launch spark
    tone(t0, N(86), 0.3, pulseBus, { gain: 0.08, decay: 0.25 });
  }

  // ---- ratchet release, gear whirr, the climb up the stem --------------------
  const gearBus = bus(0.25, 0.1);
  {
    const t0 = B.pulseArrive;
    noise(t0, 0.08, gearBus, { type: 'lowpass', freq: 400, q: 1, gain: 0.5, decay: 0.05 }); // clunk
    tone(t0, N(38), 0.5, gearBus, { gain: 0.25, decay: 0.18 });
    let t = t0 + 0.08;
    let rate = 18;
    while (t < B.hubSpin[1] + 1.2) {
      noise(t, 0.008, gearBus, { freq: 2900 + rng.range(-200, 200), q: 7, gain: 0.22, decay: 0.004 });
      t += 1 / rate;
      rate = Math.min(34, rate * 1.03);
    }
    // whirr: filtered noise + a rising, grainy tone
    noise(B.hubSpin[0], 5.5, gearBus, { type: 'bandpass', freq: 180, freqEnd: 520, q: 3, gain: 0.12, attack: 1.2 });
    const climb = ctx.createOscillator();
    climb.type = 'sine';
    climb.frequency.setValueAtTime(N(62), B.stemClimb[0]);
    climb.frequency.exponentialRampToValueAtTime(N(74), B.stemClimb[1]);
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0, B.stemClimb[0]);
    cg.gain.linearRampToValueAtTime(0.05, B.stemClimb[0] + 1);
    cg.gain.linearRampToValueAtTime(0, B.stemClimb[1] + 0.4);
    climb.connect(cg).connect(pulseBus);
    climb.start(B.stemClimb[0]);
    climb.stop(B.stemClimb[1] + 0.5);
    // seedpods waking: tiny glassy pings
    for (let i = 0; i < 14; i++) {
      const tt = rng.range(B.podsWake[0] + 1, B.podsWake[1]);
      tone(tt, N(rng.pick([86, 88, 90, 93, 95])), 0.3, bus(0.6, rng.range(-0.7, 0.7)), { gain: 0.025, decay: 0.3 });
    }
  }

  // ---- petal hinges as the rings open ------------------------------------
  const petalBus = bus(0.35, 0);
  for (const [ring, count, base] of [['outer', 8, 74], ['middle', 8, 79], ['inner', 6, 83]]) {
    const [a, b] = B[ring];
    for (let i = 0; i < count; i++) {
      const tt = a + (b - a) * (0.15 + 0.6 * (i / count)) + rng.range(-0.05, 0.05);
      noise(tt, 0.01, petalBus, { freq: 4200, q: 9, gain: 0.08, decay: 0.006 });
      tone(tt, N(base + rng.pick([0, 2, 4, 7])), 0.2, petalBus, { gain: 0.03, decay: 0.12 });
    }
    // end-of-travel settle
    noise(b, 0.05, petalBus, { type: 'lowpass', freq: 900, q: 1, gain: 0.08, decay: 0.03 });
  }

  // ---- wing hum -------------------------------------------------------------
  const wingBus = bus(0.2, 0.2);
  const buzz = (t0, t1, f0, gain, vib = 7) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0, t0);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = vib;
    const lg = ctx.createGain();
    lg.gain.value = f0 * 0.03;
    lfo.connect(lg).connect(o.frequency);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = f0 * 5;
    f.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.25);
    g.gain.setValueAtTime(gain, t1 - 0.25);
    g.gain.linearRampToValueAtTime(0, t1);
    o.connect(f).connect(g).connect(wingBus);
    o.start(t0); lfo.start(t0);
    o.stop(t1 + 0.05); lfo.stop(t1 + 0.05);
  };
  buzz(B.beeEmerge + 1.1, B.beeTakeoff, 150, 0.025); // warming up on the board
  buzz(B.beeTakeoff, B.beeLand + 0.35, 205, 0.06); // flight to the bloom
  buzz(B.beeLeave, B.beeLeave + 2.4, 210, 0.045);
  buzz(B.hummingbird[0] - 0.6, B.hummingbird[1] + 0.3, 78, 0.05, 11); // hummingbird
  buzz(B.rise[0], B.rise[1], 190, 0.025, 5);
  // pollen collected: a small rising sparkle; the flower answers with a chord
  for (let i = 0; i < 6; i++) tone(B.pollen[0] + i * 0.3, N(81 + [0, 2, 4, 7, 9, 12][i]), 0.4, petalBus, { gain: 0.03, decay: 0.3 });
  for (const m of [62, 66, 69, 73, 76]) tone(B.flowerRespond, N(m), 3, bus(0.5, 0), { gain: 0.035, attack: 0.05, decay: 1.4 });

  // ---- music ------------------------------------------------------------
  const padBus = bus(0.55, 0);
  const pad = (t0, t1, notes, gain) => {
    for (const m of notes) {
      for (const det of [-6, 5]) {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = N(m);
        o.detune.value = det;
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 1400;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + Math.min(2.5, (t1 - t0) * 0.4));
        g.gain.setValueAtTime(gain, Math.max(t0 + 0.1, t1 - 1.8));
        g.gain.linearRampToValueAtTime(0, t1 + 0.8);
        o.connect(f).connect(g).connect(padBus);
        o.start(t0);
        o.stop(t1 + 1);
      }
    }
  };
  // a low drone under the heartbeat
  pad(2.0, 13.5, [38, 45], 0.03);
  // chords: Dmaj9 → Bm7 → Gmaj7 → A(sus) → Dmaj9 …
  const chords = [
    [13.6, 19.6, [50, 57, 61, 64, 66], 0.016],
    [19.6, 25.6, [47, 54, 57, 62, 66], 0.016],
    [25.6, 31.6, [43, 50, 54, 59, 62], 0.016],
    [31.6, 36.6, [45, 52, 57, 59, 64], 0.016],
    [36.6, 41.0, [50, 57, 61, 64, 69], 0.017],
    [41.0, 45.0, [47, 54, 59, 62, 66, 71], 0.02],
    [45.0, 49.4, [43, 50, 55, 59, 62, 67, 74], 0.022],
    [49.4, 51.6, [45, 52, 57, 61, 64, 69, 76], 0.022],
    [51.6, 58.0, [38, 50, 57, 61, 64, 66, 73], 0.022],
  ];
  for (const [a, b, n, g] of chords) pad(a, b, n, g);
  // music box: FM bell tones, a slow pentatonic melody
  const bellBus = bus(0.5, 0.15);
  const bell = (t, m, g = 0.05) => {
    const car = ctx.createOscillator();
    car.frequency.value = N(m);
    const mod = ctx.createOscillator();
    mod.frequency.value = N(m) * 3.5;
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(N(m) * 2.2, t);
    mg.gain.setTargetAtTime(0, t, 0.25);
    mod.connect(mg).connect(car.frequency);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(g, t + 0.004);
    g2.gain.setTargetAtTime(0, t + 0.004, 0.7);
    car.connect(g2).connect(bellBus);
    car.start(t); mod.start(t);
    car.stop(t + 4); mod.stop(t + 4);
  };
  const melody = [
    // [time offset, midi]
    [0, 78], [0.75, 81], [1.5, 83], [2.25, 81], [3.0, 78], [4.5, 76], [5.25, 78], [6.0, 81],
    [7.5, 83], [8.25, 86], [9.0, 83], [10.5, 81], [11.25, 78], [12.0, 76], [13.5, 74], [15, 76],
    [16.5, 78], [17.25, 81], [18.0, 83], [19.5, 85], [20.25, 83], [21.0, 81], [22.5, 78], [24.0, 81],
  ];
  for (const [dt, m] of melody) bell(14.2 + dt, m, 0.045);
  // reveal: cascading bells and a rising arpeggio
  for (let i = 0; i < 28; i++) {
    const t = 41.0 + i * 0.32;
    bell(t, [74, 78, 81, 83, 86, 88, 90, 93][i % 8] + (i > 15 ? 0 : 0), 0.03 + (i / 28) * 0.025);
  }
  // title: the final resolution and one last tick of the heart
  for (const [dt, m] of [[0, 74], [0.4, 78], [0.8, 81], [1.2, 85], [2.0, 86]]) bell(51.6 + dt, m, 0.055);
  // garden air: a soft high shimmer that grows with the dawn
  noise(12, 46, bus(0.6, 0), { type: 'bandpass', freq: 5200, q: 2.2, gain: 0.006, attack: 14 });
  // distant birdsong in the reveal
  for (let i = 0; i < 9; i++) {
    const t = rng.range(42, 55);
    const o = ctx.createOscillator();
    const f0 = rng.range(2600, 4200);
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f0 * rng.range(1.2, 1.6), t + 0.09);
    o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.012, t + 0.02);
    g.gain.linearRampToValueAtTime(0, t + 0.17);
    o.connect(g).connect(bus(0.7, rng.range(-0.8, 0.8)));
    o.start(t);
    o.stop(t + 0.2);
  }
  // master fade at the very end
  master.gain.setValueAtTime(2.0, B.fadeOut[0]);
  master.gain.linearRampToValueAtTime(0, B.fadeOut[1]);

  return ctx.startRendering();
}

// Live playback wrapper. Sound starts only after a user gesture.
export class Score {
  constructor() {
    this.enabled = false;
    this.buffer = null;
    this.ctx = null;
    this.src = null;
  }
  async ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (!this.buffer) this.buffer = await renderScore();
  }
  async toggle(t, playing) {
    this.enabled = !this.enabled;
    if (this.enabled) {
      await this.ensure();
      if (playing) this.play(t);
    } else this.pause();
    return this.enabled;
  }
  play(t) {
    if (!this.enabled || !this.buffer || !this.ctx) return;
    this.pause();
    const s = this.ctx.createBufferSource();
    s.buffer = this.buffer;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.08);
    s.connect(g).connect(this.ctx.destination);
    s.start(0, Math.max(0, Math.min(t, DURATION - 0.01)));
    this.src = s;
  }
  pause() {
    if (this.src) {
      try { this.src.stop(); } catch (e) { /* already stopped */ }
      this.src.disconnect();
      this.src = null;
    }
  }
}

// Encode an AudioBuffer as 16-bit PCM WAV (used to mux sound into captures).
export function bufferToWav(buf) {
  const ch = buf.numberOfChannels, len = buf.length, rate = buf.sampleRate;
  const out = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const w = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); out.setUint32(4, 36 + len * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, ch, true);
  out.setUint32(24, rate, true); out.setUint32(28, rate * ch * 2, true); out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true);
  w(36, 'data'); out.setUint32(40, len * ch * 2, true);
  const data = [];
  for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, data[c][i])); out.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Blob([out.buffer], { type: 'audio/wav' });
}

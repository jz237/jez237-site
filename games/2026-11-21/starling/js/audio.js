// STARLING 2026 — all sound is synthesised: a slow pad, a pulse that quickens as the flock thins, and effects.
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const CHORDS = [[52, 59, 64, 67], [48, 55, 60, 64], [50, 57, 62, 66], [47, 54, 59, 62]]; // E minor, C, D, B minor

export class Sound {
  constructor() { this.ctx = null; this.on = true; this.last = {}; this.padT = 0; this.pulseT = 0; this.bar = 0; }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended' && this.on) this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const c = this.ctx = new AC();
    this.out = c.createDynamicsCompressor(); this.out.threshold.value = -14; this.out.connect(c.destination); this.mus = c.createGain(); this.mus.gain.value = 0.5; this.fx = c.createGain(); this.fx.gain.value = 0.6; this.mus.connect(this.out); this.fx.connect(this.out);
    this.dly = c.createDelay(1); this.dly.delayTime.value = 0.33; const fb = c.createGain(); fb.gain.value = 0.35; this.dly.connect(fb); fb.connect(this.dly); this.dly.connect(this.mus);
    const n = c.sampleRate, b = c.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.noise = b;
  }
  setOn(on) { this.on = on; if (this.ctx) on ? this.ctx.resume() : this.ctx.suspend(); }
  tone(type, f, t, dur, vol, dest, o = {}) { const c = this.ctx, os = c.createOscillator(), g = c.createGain(); os.type = type; os.frequency.setValueAtTime(f, t); if (o.to) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + dur); if (o.det) os.detune.value = o.det; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (o.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); let node = os;
    if (o.lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; os.connect(fl); node = fl; } node.connect(g); g.connect(dest); if (o.send) { const s = c.createGain(); s.gain.value = o.send; g.connect(s); s.connect(this.dly); } os.start(t); os.stop(t + dur + 0.05); }
  hiss(t, dur, vol, dest, f = 3000, to) { const c = this.ctx, s = c.createBufferSource(), g = c.createGain(), fl = c.createBiquadFilter(); s.buffer = this.noise; s.loop = true; fl.type = 'lowpass'; fl.frequency.setValueAtTime(f, t); if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05); }
  // urgency 0..1: how thin the flock is. The pulse speeds up with it.
  tick(dt, urgency, playing) {
    const c = this.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime;
    if ((this.padT -= dt) <= 0) { this.padT = 4.2; const ch = CHORDS[this.bar++ % 4]; for (const m of ch) { this.tone('sawtooth', mtof(m), t, 4.6, 0.035, this.mus, { a: 1.2, lp: 700, det: -6 }); this.tone('sawtooth', mtof(m + 12), t, 4.6, 0.016, this.mus, { a: 1.6, lp: 1100, det: 7 }); } this.root = ch[0]; }
    if (playing && (this.pulseT -= dt) <= 0) { this.pulseT = 0.62 - urgency * 0.4; this.beat = (this.beat || 0) + 1; this.tone('sine', mtof((this.root || 52) - 12), t, 0.16, 0.2, this.mus, { to: mtof((this.root || 52) - 19) }); if (this.beat % 2 === 0) this.tone('triangle', mtof((this.root || 52) + 12 + [0, 7, 3, 10][(this.beat >> 1) % 4]), t, 0.2, 0.05, this.mus, { send: 0.5 }); }
  }
  sfx(name, v = 1) {
    const c = this.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime, F = this.fx, min = { shot: 0.05, hit: 0.04, boom: 0.04 }[name] || 0; if (min && t - (this.last[name] || 0) < min) return; this.last[name] = t;
    switch (name) {
      case 'shot': this.tone('square', 1100, t, 0.07, 0.05, F, { to: 500, lp: 3500 }); break;
      case 'hit': this.tone('square', 1500, t, 0.03, 0.04, F, { to: 900 }); break;
      case 'boom': this.hiss(t, 0.22, 0.22 * v, F, 2800, 300); this.tone('triangle', 700 * v, t, 0.12, 0.1, F, { to: 180, send: 0.3 }); break;
      case 'bigboom': this.hiss(t, 1.2, 0.5, F, 3200, 80); this.tone('sine', 90, t, 1, 0.6, F, { to: 26 }); break;
      case 'die': this.tone('sawtooth', 520, t, 0.9, 0.3, F, { to: 40, lp: 2500 }); this.hiss(t, 0.9, 0.35, F, 4000, 120); break;
      case 'ember': [0, 4, 7, 12].forEach((s, i) => this.tone('triangle', mtof(76 + s), t + i * 0.05, 0.18, 0.12, F, { send: 0.4 })); break;
      case 'beam': this.tone('sawtooth', 110, t, 1.6, 0.16, F, { to: 440, lp: 1800 }); this.tone('sine', 880, t, 1.4, 0.07, F, { to: 1320, send: 0.5 }); break;
      case 'stoop': this.tone('sine', 1400, t, 0.35, 0.05, F, { to: 420 }); break;
      case 'wave': [0, 7, 12].forEach((s, i) => this.tone('triangle', mtof(64 + s), t + i * 0.09, 0.35, 0.1, F, { send: 0.5 })); break;
      case 'clear': [0, 4, 7, 12, 16].forEach((s, i) => this.tone('triangle', mtof(64 + s), t + i * 0.1, 0.5, 0.12, F, { send: 0.6 })); break;
      case 'life': [0, 5, 12].forEach((s, i) => this.tone('sine', mtof(81 + s), t + i * 0.08, 0.25, 0.12, F)); break;
      case 'ui': this.tone('sine', 660, t, 0.06, 0.08, F); break;
    }
  }
  event(f) { switch (f.k) { case 'shot': this.sfx('shot'); break; case 'hit': this.sfx('hit'); break; case 'boom': this.sfx(f.type === 'roost' ? 'bigboom' : 'boom', f.type === 'kite' ? 0.7 : f.type === 'heron' ? 0.85 : 1); break; case 'die': case 'ember': case 'beam': case 'stoop': case 'wave': case 'clear': case 'life': this.sfx(f.k); break; } }
}

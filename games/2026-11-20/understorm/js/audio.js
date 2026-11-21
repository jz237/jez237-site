// UNDERSTORM 2026 — everything you hear is synthesised here with WebAudio: an adaptive score
// (a theme per act, a variation per stage, generated from a seed) and all effects. No samples.
const SCALE = [0, 2, 3, 5, 7, 8, 10]; // natural minor
const ACTS = [null,
  { root: 50, prog: [0, 5, 2, 6], bpm: 104 },   // I   D minor: i VI III VII
  { root: 42, prog: [0, 3, 5, 4], bpm: 96 },    // II  F# minor: i iv VI V
  { root: 45, prog: [0, 6, 5, 4], bpm: 128 },   // III A minor: i VII VI V
];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const deg = (root, d) => root + 12 * Math.floor(d / 7) + SCALE[((d % 7) + 7) % 7];

export class Sound {
  constructor() { this.ctx = null; this.mv = 0.55; this.sv = 0.8; this.pos = -1; this.song = null; this.last = {}; this.inten = 1; this.chg = 0; }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const c = this.ctx = new AC();
    this.out = c.createDynamicsCompressor(); this.out.threshold.value = -14; this.out.ratio.value = 5; this.out.connect(c.destination);
    this.mus = c.createGain(); this.fx = c.createGain(); this.mus.connect(this.out); this.fx.connect(this.out); this.setVol(this.mv, this.sv);
    this.dly = c.createDelay(1); this.dly.delayTime.value = 0.29; const fb = c.createGain(); fb.gain.value = 0.34; const lp = c.createBiquadFilter(); lp.frequency.value = 2400; this.dly.connect(lp); lp.connect(fb); fb.connect(this.dly); lp.connect(this.mus);
    const n = c.sampleRate, b = c.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.noise = b;
    // charge whine: one oscillator that follows the Lance
    this.co = c.createOscillator(); this.co.type = 'sawtooth'; this.cg = c.createGain(); this.cg.gain.value = 0; const cf = c.createBiquadFilter(); cf.type = 'bandpass'; cf.Q.value = 6; this.cf = cf; this.co.connect(cf); cf.connect(this.cg); this.cg.connect(this.fx); this.co.start();
  }
  setVol(m, s) { this.mv = m; this.sv = s; if (this.ctx) { this.mus.gain.value = m * 0.5; this.fx.gain.value = s * 0.7; } }
  suspend(on) { if (this.ctx) on ? this.ctx.suspend() : this.ctx.resume(); }

  // ---------------------------------------------------------------- voices
  tone(type, f, t, dur, vol, dest, o = {}) { const c = this.ctx, os = c.createOscillator(), g = c.createGain(); os.type = type; os.frequency.setValueAtTime(f, t); if (o.to) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + dur); if (o.det) os.detune.value = o.det;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (o.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); let node = os;
    if (o.lp) { const f2 = c.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.setValueAtTime(o.lp, t); if (o.lpTo) f2.frequency.exponentialRampToValueAtTime(o.lpTo, t + dur); f2.Q.value = o.q || 1; os.connect(f2); node = f2; }
    node.connect(g); g.connect(dest); if (o.send) { const s = c.createGain(); s.gain.value = o.send; g.connect(s); s.connect(this.dly); } os.start(t); os.stop(t + dur + 0.05); }
  hiss(t, dur, vol, dest, type = 'highpass', f = 6000, o = {}) { const c = this.ctx, s = c.createBufferSource(), g = c.createGain(), fl = c.createBiquadFilter(); s.buffer = this.noise; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f, t); if (o.to) fl.frequency.exponentialRampToValueAtTime(o.to, t + dur); fl.Q.value = o.q || 0.8;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05); }

  // ---------------------------------------------------------------- score
  music(stage, act, bpm, mode = 'stage') {
    const A = ACTS[act] || ACTS[1]; let seed = (stage + 1) * 7919 + (mode === 'boss' ? 13 : 0); const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const shift = [0, -2, 3, 0][stage % 4]; const song = { root: A.root + shift, prog: A.prog, bpm: bpm || A.bpm, mode, lead: [], arp: [], bassPat: (stage % 3) };
    if (mode === 'boss') song.bpm = Math.round(song.bpm * 1.1);
    // a 4-bar phrase A, a variant A', a contrasting B, then A again: chord tones on the strong beats
    const phrase = (variant) => { const out = []; let cur = 4 + ((R() * 3) | 0); for (let bar = 0; bar < 4; bar++) { const ch = A.prog[bar], tones = [ch, ch + 2, ch + 4, ch + 7]; const rhy = [[0, 6, 8, 12], [0, 4, 8, 10, 12], [0, 3, 6, 8, 14], [0, 8, 12, 14]][(R() * 4) | 0];
      for (let s = 0; s < 16; s++) { if (!rhy.includes(s)) { out.push(null); continue; } if (s % 8 === 0) { let best = tones[0], bd = 99; for (const tn of tones) for (const o of [0, 7]) { const d = Math.abs(tn + o - cur - (variant ? 1 : 0)); if (d < bd) { bd = d; best = tn + o; } } cur = best; } else cur += [-2, -1, 1, 1, 2][(R() * 5) | 0]; cur = Math.max(2, Math.min(13, cur)); out.push(cur); } } return out; };
    const a = phrase(0), a2 = a.map((v, i) => (i >= 48 && v !== null ? v + (i % 3 ? 1 : 2) : v)), b = phrase(1); song.lead = [...a, ...a2, ...b, ...a];
    const ap = [[0, 2, 4, 7, 4, 2, 4, 7], [0, 4, 7, 4, 9, 7, 4, 2], [7, 4, 2, 0, 2, 4, 7, 9]][(R() * 3) | 0]; song.arp = ap;
    this.song = song; this.pos = -1; this.sl = 60 / song.bpm / 4;
  }
  stopMusic() { this.song = null; }
  tick(T, inten, charge) {
    const c = this.ctx; if (!c) return; const now = c.currentTime;
    // charge whine
    this.cg.gain.setTargetAtTime(charge > 0.05 ? 0.05 + charge * 0.05 : 0, now, 0.03); this.co.frequency.setTargetAtTime(110 + charge * 330, now, 0.05); this.cf.frequency.setTargetAtTime(500 + charge * 2600, now, 0.05);
    const s = this.song; if (!s) return; const sl = this.sl; this.inten = inten; this.chg = charge;
    if (this.pos * sl > T + 0.6 || this.pos * sl < T - 1.5) this.pos = Math.floor(T / sl) - 1;
    while ((this.pos + 1) * sl < T + 0.14) { this.pos++; const when = now + (this.pos * sl - T); if (when > now - 0.02) this.step(this.pos, Math.max(when, now)); }
  }
  step(n, t) {
    const s = this.song, M = this.mus, st = n % 16, bar = Math.floor(n / 16), ch = s.prog[bar % 4], root = s.root, I = this.inten, boss = s.mode === 'boss', sl = this.sl;
    if (st === 0) for (const d of [0, 2, 4]) { const f = mtof(deg(root + 12, ch + d)); this.tone('sawtooth', f, t, sl * 16.5, 0.045, M, { a: 0.5, lp: 700 + I * 260, det: -7 }); this.tone('sawtooth', f, t, sl * 16.5, 0.045, M, { a: 0.5, lp: 700 + I * 260, det: 8 }); }
    const bp = boss ? [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1] : [[1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0]][s.bassPat];
    if (bp[st]) this.tone('sawtooth', mtof(deg(root - 12, ch) + (boss && st % 4 === 2 ? 12 : 0)), t, sl * 1.8, 0.2, M, { lp: 900, lpTo: 160, q: 3 });
    if (I >= 1) { if (st % 2 === 0 || boss) this.hiss(t, 0.035, st % 4 === 2 ? 0.07 : 0.035, M); const d = s.arp[(n >> 1) % 8]; if (st % 2 === 0) this.tone('triangle', mtof(deg(root + 24, ch + d)), t, sl * 1.6, 0.06, M, { send: 0.5 }); }
    if (I >= 2 || boss) { if (st % 8 === 0 || (boss && st % 8 === 6) || (st === 10 && bar % 2)) { this.tone('sine', 150, t, 0.22, 0.5, M, { to: 42 }); } if (st % 8 === 4) { this.hiss(t, 0.16, 0.2, M, 'bandpass', 1800); this.tone('triangle', 190, t, 0.09, 0.14, M, { to: 110 }); } }
    if (I >= 3 || (boss && I >= 2)) { const v = s.lead[n % 256]; if (v !== null && v !== undefined) { const f = mtof(deg(root + 12, v)); this.tone('square', f, t, sl * 3.2, 0.055, M, { lp: 2400, send: 0.45, a: 0.012 }); this.tone('sawtooth', f, t, sl * 3.2, 0.04, M, { lp: 2000, det: 9, a: 0.012 }); } }
    if (this.chg > 0.3 && st % 2 === 1) this.tone('sine', mtof(deg(root + 36, ch + s.arp[n % 8])), t, sl * 1.2, 0.03 * this.chg, M, { send: 0.6 });
  }

  // ---------------------------------------------------------------- effects
  sfx(name, v = 1) {
    const c = this.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime, F = this.fx, min = { shot: 0.05, hit: 0.04, tink: 0.05, absorb: 0.06, spark: 0.08, boom: 0.05, eshot: 0.08, zap: 0.08, rico: 0.1, burrow: 0.1 }[name] || 0;
    if (min && t - (this.last[name] || 0) < min) return; this.last[name] = t;
    switch (name) {
      case 'shot': this.tone('square', 920, t, 0.06, 0.05 * v, F, { to: 420, lp: 3000 }); break;
      case 'tier1': this.tone('sine', 660, t, 0.12, 0.12, F); break; case 'tier2': this.tone('sine', 880, t, 0.14, 0.14, F); this.tone('sine', 1320, t + 0.05, 0.12, 0.08, F); break;
      case 'tier3': for (let i = 0; i < 3; i++) this.tone('sine', 990 * (1 + i * 0.5), t + i * 0.04, 0.2, 0.14, F); break;
      case 'rel1': this.tone('sawtooth', 700, t, 0.16, 0.16, F, { to: 180, lp: 3000 }); break;
      case 'rel2': this.tone('sawtooth', 520, t, 0.3, 0.22, F, { to: 90, lp: 4000, lpTo: 400 }); this.hiss(t, 0.25, 0.14, F, 'bandpass', 2400, { to: 500 }); break;
      case 'rel3': this.tone('sawtooth', 300, t, 0.7, 0.3, F, { to: 60, lp: 6000, lpTo: 300 }); this.tone('square', 1500, t, 0.5, 0.1, F, { to: 300 }); this.hiss(t, 0.7, 0.3, F, 'lowpass', 7000, { to: 300 }); this.tone('sine', 70, t, 0.6, 0.5, F, { to: 30 }); break;
      case 'boom': this.hiss(t, 0.3 * v + 0.12, 0.28 * Math.min(1.6, v), F, 'lowpass', 2600, { to: 200 }); this.tone('sine', 120, t, 0.24, 0.3 * Math.min(1.5, v), F, { to: 38 }); break;
      case 'bigboom': this.hiss(t, 1.1, 0.5, F, 'lowpass', 3000, { to: 90 }); this.tone('sine', 90, t, 0.9, 0.7, F, { to: 26 }); this.tone('sawtooth', 60, t, 0.6, 0.25, F, { to: 30, lp: 300 }); break;
      case 'hit': this.tone('square', 1500, t, 0.03, 0.035, F, { to: 900 }); break; case 'tink': this.tone('triangle', 3200, t, 0.05, 0.05, F, { to: 2600 }); break;
      case 'absorb': this.tone('sine', 520, t, 0.09, 0.07, F, { to: 900 }); break; case 'eshot': this.tone('triangle', 300, t, 0.1, 0.04, F, { to: 170 }); break;
      case 'pickup': [0, 4, 7, 12].forEach((s, i) => this.tone('triangle', mtof(74 + s), t + i * 0.06, 0.18, 0.13, F, { send: 0.4 })); break;
      case 'launch': this.hiss(t, 0.22, 0.14, F, 'bandpass', 600, { to: 3200, q: 2 }); this.tone('sine', 220, t, 0.2, 0.14, F, { to: 660 }); break;
      case 'recall': this.tone('sine', 660, t, 0.2, 0.1, F, { to: 220 }); break; case 'dock': this.tone('square', 180, t, 0.08, 0.14, F, { lp: 900 }); this.tone('sine', 880, t + 0.03, 0.1, 0.07, F); break;
      case 'thunk': this.tone('sine', 140, t, 0.12, 0.25, F, { to: 60 }); this.hiss(t, 0.06, 0.1, F, 'bandpass', 1400); break;
      case 'zap': this.hiss(t, 0.08, 0.1, F, 'bandpass', 4200, { q: 3 }); this.tone('sawtooth', 1800, t, 0.07, 0.04, F, { to: 500 }); break;
      case 'rico': this.tone('triangle', 1300, t, 0.07, 0.05, F, { to: 2200 }); break; case 'burrow': this.tone('square', 240, t, 0.09, 0.05, F, { to: 120, lp: 800 }); break;
      case 'strike': this.hiss(t, 0.5, 0.42, F, 'highpass', 1200, { to: 300 }); this.tone('sawtooth', 90, t, 0.6, 0.3, F, { to: 30, lp: 500 }); break;
      case 'thunder': this.hiss(t, 2.2, 0.12 * v, F, 'lowpass', 420, { to: 60 }); break;
      case 'tele': this.tone('square', 1400, t, 0.05, 0.03, F); break;
      case 'die': this.tone('sawtooth', 500, t, 0.9, 0.3, F, { to: 40, lp: 3000, lpTo: 200 }); this.hiss(t, 0.9, 0.4, F, 'lowpass', 4000, { to: 120 }); break;
      case 'hurt': this.tone('square', 200, t, 0.2, 0.22, F, { to: 80, lp: 1200 }); break;
      case 'cp': [0, 7, 12].forEach((s, i) => this.tone('triangle', mtof(69 + s), t + i * 0.09, 0.4, 0.13, F, { send: 0.6 })); break;
      case 'clear': [0, 4, 7, 12, 16].forEach((s, i) => { this.tone('triangle', mtof(62 + s), t + i * 0.13, 0.6, 0.15, F, { send: 0.6 }); this.tone('square', mtof(50 + s), t + i * 0.13, 0.5, 0.05, F, { lp: 1500 }); }); break;
      case 'warn': for (let i = 0; i < 4; i++) this.tone('square', i % 2 ? 330 : 440, t + i * 0.22, 0.2, 0.12, F, { lp: 1800 }); break;
      case 'lock': this.tone('square', 110, t, 0.3, 0.2, F, { lp: 700 }); break; case 'unlock': this.tone('sine', 990, t, 0.08, 0.08, F); break;
      case 'life': [0, 5, 12].forEach((s, i) => this.tone('sine', mtof(81 + s), t + i * 0.08, 0.25, 0.12, F)); break;
      case 'grow': this.tone('triangle', 500, t, 0.25, 0.08, F, { to: 1500, send: 0.4 }); break;
      case 'shatter': this.hiss(t, 0.16, 0.14, F, 'highpass', 5000); this.tone('triangle', 2400, t, 0.1, 0.06, F, { to: 3800 }); break;
      case 'clank': this.tone('square', 90, t, 0.14, 0.22, F, { lp: 600 }); this.hiss(t, 0.1, 0.14, F, 'bandpass', 2400, { q: 4 }); break;
      case 'growl': this.tone('sawtooth', 70, t, 0.7, 0.3, F, { to: 45, lp: 400, lpTo: 150 }); break;
      case 'chain': this.tone('sine', 700 + v * 110, t, 0.12, 0.12, F, { send: 0.4 }); break;
      case 'speed': this.tone('sine', 400 + v * 150, t, 0.07, 0.08, F); break;
      case 'ui': this.tone('sine', 660, t, 0.05, 0.08, F); break; case 'ok': this.tone('sine', 660, t, 0.07, 0.1, F); this.tone('sine', 990, t + 0.06, 0.1, 0.1, F); break;
      case 'panic': this.tone('sawtooth', 160, t, 0.8, 0.2, F, { to: 420, lp: 900 }); break;
    }
  }
  event(f) {
    switch (f.k) {
      case 'shot': this.sfx('shot'); break; case 'tier': if (f.n) this.sfx('tier' + f.n); break; case 'release': this.sfx('rel' + f.n); break;
      case 'boom': this.sfx(f.big ? 'boom' : 'boom', f.big ? 1.4 : 0.6); break; case 'bossdie': case 'bossgone': case 'phase': this.sfx('bigboom'); break;
      case 'hit': case 'tink': case 'absorb': case 'eshot': case 'pickup': case 'launch': case 'recall': case 'dock': case 'thunk': case 'zap': case 'rico': case 'burrow': case 'strike': case 'die': case 'cp': case 'clear': case 'lock': case 'unlock': case 'life': case 'grow': case 'shatter': case 'clank': case 'growl': case 'panic': this.sfx(f.k); break;
      case 'hitp': case 'shield': this.sfx('hurt'); break; case 'boss': this.sfx('warn'); break; case 'chain': this.sfx('chain', f.n); break; case 'speed': this.sfx('speed', f.n); break;
      case 'tear': case 'wake': case 'cast': this.sfx('clank'); break; case 'swap': this.sfx('dock'); break; case 'reveal': case 'blink': this.sfx('growl'); break; case 'flash': this.sfx('thunder', 1.5); break;
    }
  }
}

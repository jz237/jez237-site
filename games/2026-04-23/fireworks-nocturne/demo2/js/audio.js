// Sound that behaves like the real thing: each launch, break and crackle is
// placed where it happened and reaches you at the speed of sound (about
// 2.6 s from the terrace), duller with distance, panned to its direction and
// rolled around the city by a synthetic echo. The crowd near you reacts to the
// light, so their "ooh" comes before the boom does.

const FILES = {
  launch: ['launch_1', 'launch_2', 'launch_3'],
  rise: ['rise_1'],
  whistle: ['whistle_1', 'whistle_2'],
  big: ['boom_big_2', 'boom_big_3', 'boom_big_4', 'boom_big_5'],
  med: ['boom_med_3', 'boom_big_1', 'boom_med_5'],
  salute: ['salute_1', 'salute_2'],
  crackle: ['crackle_1', 'crackle_2'],
  sizzle: ['sizzle_1'],
  thunder: ['thunder_tail'],
  ooh: ['crowd_ooh_1', 'crowd_ooh_2'],
  wow: ['crowd_wow_1'],
  cheer: ['crowd_cheer_1'],
  amb: ['amb_harbor'],
  falls: ['waterfall_loop'],
  launchBig: ['launch_big_1'],
  launchSmall: ['launch_small_1'],
  riseSilver: ['rise_silver_1'],
  riseGlitter: ['rise_glitter_1'],
  double: ['boom_double_1'],
  pattern: ['boom_pattern_1'],
  strobe: ['strobe_1'],
  glitter: ['glitter_1'],
  brocade: ['brocade_1'],
  comet: ['comet_1'],
  spider: ['spider_1'],
  crossette: ['crossette_1'],
  mine: ['mine_1'],
  volley: ['fan_volley_1'],
  leaves: ['leaves_1'],
};

// What each shell sounds like: the break ('big'/'med' by size, a softer
// 'pattern' pop, 'double' boom-and-crackle, 'spider' hiss), plus a layer
// that starts as the stars ignite (delay s, gain).
const VOICES = {
  chrysanthemum: { brk: 'double', chance: 0.6 },
  dahlia: { brk: 'double', chance: 0.4 },
  willow: { layer: ['brocade', 0.5, 0.55] },
  kamuro: { layer: ['brocade', 0.45, 0.7] },
  diadem: { layer: ['brocade', 0.45, 0.65] },
  brocade: { layer: ['brocade', 0.35, 0.7] },
  horsetail: { layer: ['brocade', 0.4, 0.5] },
  glitter: { layer: ['glitter', 0.5, 0.75] },
  glittertips: { layer: ['glitter', 1.2, 0.6] },
  snowfall: { brk: 'pattern', layer: ['glitter', 0.6, 0.6] },
  leaves: { brk: 'pattern', layer: ['leaves', 0.5, 0.7] },
  strobe: { layer: ['strobe', 0.35, 0.75] },
  palm: { layer: ['comet', 0.05, 0.75] },
  spider: { brk: 'spider' },
  crossette: { layer: ['crossette', 0.6, 0.8] },
  heart: { brk: 'pattern' }, smiley: { brk: 'pattern' }, starshape: { brk: 'pattern' }, butterfly: { brk: 'pattern' },
  flower: { brk: 'pattern' }, spiral: { brk: 'pattern' }, clover: { brk: 'pattern' }, crescent: { brk: 'pattern' },
  rings: { brk: 'pattern' }, cube: { brk: 'pattern' },
};
const C = 343;

export class AudioEngine {
  constructor(base) {
    this.base = base;
    this.ctx = null;
    this.buf = {};
    this.enabled = true;
    this.ready = false;
    this.listener = { pos: [0, 0, 0], right: [1, 0, 0] };
    this.showNow = 0;
    this.scale = 1;
    this.muteUntil = 0;
  }

  async init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC({ latencyHint: 'interactive' });
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? 0.9 : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.25;
    this.master.connect(comp).connect(ctx.destination);
    this.dry = ctx.createGain();
    this.dry.connect(this.master);
    this.verb = ctx.createConvolver();
    this.verb.buffer = this.makeIR();
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.85;
    this.verb.connect(this.wet).connect(this.master);
    this.crackBuf = this.makeCrack();
    const names = [...new Set(Object.values(FILES).flat())];
    await Promise.all(names.map(async (n) => {
      try {
        const res = await fetch(`${this.base}${n}.mp3`);
        if (!res.ok) return;
        const ab = await res.arrayBuffer();
        this.buf[n] = await new Promise((ok, bad) => ctx.decodeAudioData(ab, ok, bad));
      } catch (e) { /* a missing clip just stays silent */ }
    }));
    this.ready = true;
    this.startAmbience();
  }

  unlock() {
    if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
  }
  get running() { return !!this.ctx && this.ctx.state === 'running'; }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.05);
    if (on) this.unlock();
  }

  // Called every frame with the show clock and the camera.
  frame(showNow, scale, camPos, right) {
    this.showNow = showNow;
    this.scale = scale;
    this.listener.pos = camPos;
    this.listener.right = right;
  }

  // Context time at which a sound born at show time t, distance d, arrives.
  when(t, d) {
    const s = Math.max(this.scale, 0.05);
    return this.ctx.currentTime + (t - this.showNow) / s + d / C / s;
  }

  makeIR() {
    const ctx = this.ctx, sr = ctx.sampleRate, len = Math.floor(sr * 4.2);
    const ir = ctx.createBuffer(2, len, sr);
    // slapbacks off the far skyline and the bridge, then a long rolling tail
    const taps = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 26; i++) taps.push({ t: 0.18 + rnd() * 2.4, g: 0.55 * Math.exp(-i * 0.09) * (0.4 + rnd() * 0.6), w: 0.004 + rnd() * 0.02 });
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const n = rnd() * 2 - 1;
        lp += (n - lp) * (0.08 + 0.3 * Math.exp(-t / 0.5));
        d[i] = lp * 0.22 * Math.exp(-t / 1.15) * Math.min(1, t / 0.12);
      }
      for (const k of taps) {
        const st = Math.floor((k.t + (ch ? 0.011 : 0) * rnd()) * sr), wn = Math.floor(k.w * sr);
        for (let j = 0; j < wn && st + j < len; j++) d[st + j] += (rnd() * 2 - 1) * k.g * Math.exp(-j / (wn * 0.3)) * (ch ? 0.9 + 0.2 * rnd() : 1);
      }
    }
    return ir;
  }

  makeCrack() {
    const sr = this.ctx.sampleRate, len = Math.floor(sr * 0.05);
    const b = this.ctx.createBuffer(1, len, sr);
    const d = b.getChannelData(0);
    let s = 3;
    for (let i = 0; i < len; i++) {
      s = (s * 16807) % 2147483647;
      const n = s / 1073741823.5 - 1;
      d[i] = n * Math.exp(-i / (sr * 0.0035)) + Math.sin(i / sr * 2 * Math.PI * 1800) * 0.4 * Math.exp(-i / (sr * 0.002));
    }
    return b;
  }

  // One positioned sound from a buffer.
  play(buffer, t, pos, { gain = 1, rate = 1, near = false, offset = 0 } = {}) {
    if (!this.ready || !buffer || !this.enabled || !this.running) return;
    const ctx = this.ctx;
    const L = this.listener.pos;
    const dx = pos[0] - L[0], dy = pos[1] - L[1], dz = pos[2] - L[2];
    const d = near ? 0 : Math.hypot(dx, dy, dz);
    const at = this.when(t, d);
    if (at < ctx.currentTime - 0.25) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = rate * (this.scale < 0.9 ? 0.78 : 1);
    const g = ctx.createGain();
    const att = near ? 1 : Math.min(2.5, 380 / Math.max(d, 40));
    g.gain.value = gain * att;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = near ? 20000 : Math.max(1400, 17000 * Math.exp(-d / 1100));
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    let node = src.connect(g).connect(lp);
    if (pan) {
      const R = this.listener.right;
      const l = Math.max(1, Math.hypot(dx, dz));
      pan.pan.value = near ? 0 : Math.max(-0.9, Math.min(0.9, (dx * R[0] + dz * R[2]) / l));
      node = node.connect(pan);
    }
    node.connect(this.dry);
    if (!near) {
      const s = ctx.createGain();
      s.gain.value = Math.min(0.9, 0.3 + d / 2400);
      node.connect(s).connect(this.verb);
    }
    src.start(Math.max(at, ctx.currentTime), offset);
  }

  pick(kind) {
    const list = FILES[kind].map(n => this.buf[n]).filter(Boolean);
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }

  event(kind, t, pos, o = {}) {
    if (t < this.muteUntil) return;
    const size = o.size || 6;
    const v = (lo, hi) => lo + Math.random() * (hi - lo);
    switch (kind) {
      case 'launch': {
        const k = size >= 10 && this.buf.launch_big_1 ? 'launchBig' : size <= 3 && this.buf.launch_small_1 ? 'launchSmall' : 'launch';
        this.play(this.pick(k), t, pos, { gain: 0.75 * Math.pow(size / 6, 0.6) * (o.gain ?? 1), rate: (o.rate ?? 1) * v(0.9, 1.08) * (k === 'launch' ? Math.pow(6 / size, 0.18) : k === 'launchBig' ? 0.84 : 1) });
        break;
      }
      case 'rise': {
        const k = o.kind === 'silver' ? 'riseSilver' : o.kind === 'glitter' ? 'riseGlitter' : 'rise';
        this.play(this.pick(k) || this.pick('rise'), t, pos, { gain: (k === 'rise' ? 0.22 : 0.3) * (o.gain ?? 1), rate: v(0.88, 1.12) });
        break;
      }
      case 'volley':
        this.play(this.pick('volley') || this.pick('launch'), t, pos, { gain: 0.6 * (o.gain ?? 1), rate: v(0.92, 1.08) });
        break;
      case 'mine':
        this.play(this.pick('mine') || this.pick('med'), t, pos, { gain: 0.8 * (o.gain ?? 1), rate: v(0.92, 1.06) });
        break;
      case 'whistle':
        this.play(this.pick('whistle'), t, [pos[0], pos[1] + 80, pos[2]], { gain: 0.32, rate: v(0.9, 1.12) });
        break;
      case 'boom': {
        const big = size >= 7.5;
        const voice = VOICES[o.type] || {};
        let k = big ? 'big' : 'med';
        if (voice.brk && this.pick(voice.brk) && Math.random() < (voice.chance ?? 1)) k = voice.brk;
        const soft = k === 'pattern' ? 0.7 : 1;
        const gain = Math.pow(size / 6, 0.85) * (big ? 1.05 : 0.95) * soft * (o.gain ?? 1);
        this.play(this.pick(k), t, pos, { gain, rate: v(0.92, 1.06) * (size < 4 ? 1.25 : 1) * Math.pow(6 / size, 0.12) });
        if (big && k !== 'pattern') this.play(this.pick('thunder'), t + 0.12, pos, { gain: gain * 0.45, rate: v(0.85, 1.0) });
        if (voice.layer && this.pick(voice.layer[0])) {
          const [lk, dl, lg] = voice.layer;
          this.play(this.pick(lk), t + dl, pos, { gain: lg * Math.pow(size / 6, 0.5), rate: v(0.9, 1.1) });
        }
        break;
      }
      case 'salute':
        this.play(this.pick('salute'), t, pos, { gain: 1.35, rate: v(0.92, 1.05) });
        this.play(this.pick('thunder'), t + 0.08, pos, { gain: 0.4, rate: v(0.95, 1.1) });
        break;
      case 'sizzle':
        this.play(this.pick('sizzle'), t, pos, { gain: 0.4 * Math.pow(size / 6, 0.5), rate: v(0.85, 1.1) });
        break;
    }
  }

  // Crackle: a bed from the recording plus a synthetic crack for each pop.
  pops(list, center, size) {
    if (!list.length) return;
    const t0 = Math.min(...list.map(p => p.t));
    this.play(this.pick('crackle'), t0 - 0.05, center, { gain: 0.55 * Math.pow(size / 6, 0.5), rate: 0.95 + Math.random() * 0.1 });
    for (const p of list.slice(0, 60)) this.play(this.crackBuf, p.t, p.pos, { gain: 0.35 * p.loud, rate: 0.7 + Math.random() * 0.8 });
  }

  crowd(kind, t, gain = 1) {
    this.play(this.pick(kind), t, this.listener.pos, { gain: 0.42 * gain, rate: 0.95 + Math.random() * 0.1, near: true });
  }

  waterfall(t0, t1, pos) {
    if (!this.ready || !this.running || !this.buf.waterfall_loop) return;
    const ctx = this.ctx;
    const L = this.listener.pos;
    const d = Math.hypot(pos[0] - L[0], pos[1] - L[1], pos[2] - L[2]);
    const a = this.when(t0, d), b = this.when(t1, d);
    const src = ctx.createBufferSource();
    src.buffer = this.buf.waterfall_loop;
    src.loop = true;
    const g = ctx.createGain();
    const peak = 0.55 * Math.min(1.5, 600 / d);
    g.gain.setValueAtTime(0, Math.max(ctx.currentTime, a));
    g.gain.linearRampToValueAtTime(peak, a + 2);
    g.gain.setValueAtTime(peak, Math.max(a + 2, b - 2));
    g.gain.linearRampToValueAtTime(0, b + 1);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.max(1500, 17000 * Math.exp(-d / 1100));
    const pan = ctx.createStereoPanner();
    const R = this.listener.right;
    pan.pan.value = Math.max(-0.9, Math.min(0.9, ((pos[0] - L[0]) * R[0] + (pos[2] - L[2]) * R[2]) / Math.max(1, Math.hypot(pos[0] - L[0], pos[2] - L[2]))));
    src.connect(g).connect(lp).connect(pan).connect(this.dry);
    src.start(Math.max(ctx.currentTime, a));
    src.stop(b + 1.5);
  }

  startAmbience() {
    const b = this.buf.amb_harbor;
    if (!b || this.ambSrc) return;
    const src = this.ambSrc = this.ctx.createBufferSource();
    src.buffer = b;
    src.loop = true;
    const g = this.ctx.createGain();
    g.gain.value = 0.3;
    src.connect(g).connect(this.dry);
    src.start();
  }
}

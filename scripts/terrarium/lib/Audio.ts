/**
 * The cloud sounds are Weatherglass's own synth voices, ported note for note
 * from its sound bank (demos/weatherglass): the same envelopes, filters and
 * pitches, played through the same kind of noise and small reverb.
 */
type WgSource = {s: AudioScheduledSourceNode; t: number; offset: number};

/** One playing sound: its nodes, sources and output (a port of Weatherglass's voice). */
class WgVoice {
  readonly out: GainNode;
  readonly nodes: AudioNode[] = [];
  readonly srcs: WgSource[] = [];
  private live = 0;
  disposed = false;
  constructor(readonly ac: AudioContext, readonly name: string, dest: AudioNode, readonly verb: AudioNode | null, readonly t0: number) {
    this.out = ac.createGain();
    this.nodes.push(this.out);
    this.out.connect(dest);
  }
  gain(v = 0) {const g = this.ac.createGain(); g.gain.value = v; this.nodes.push(g); return g;}
  filter(type: BiquadFilterType, freq: number, q = 0.707) {const f = this.ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; this.nodes.push(f); return f;}
  osc(type: OscillatorType, freq: number, t = this.t0) {const o = this.ac.createOscillator(); o.type = type; o.frequency.value = freq; this.nodes.push(o); this.srcs.push({s: o, t, offset: -1}); return o;}
  noise(buffer: AudioBuffer, t = this.t0, rate = 1) {
    const b = this.ac.createBufferSource();
    b.buffer = buffer; b.loop = true; b.playbackRate.value = rate;
    this.nodes.push(b); this.srcs.push({s: b, t, offset: Math.random() * buffer.duration * 0.9});
    return b;
  }
  sample(buffer: AudioBuffer, t = this.t0, rate = 1) {
    const b = this.ac.createBufferSource();
    b.buffer = buffer; b.playbackRate.value = rate;
    this.nodes.push(b); this.srcs.push({s: b, t, offset: 0});
    return b;
  }
  chain(...n: AudioNode[]) {for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1];}
  send(amount: number) {if (!this.verb || !(amount > 0)) return; const g = this.gain(amount); this.out.connect(g); g.connect(this.verb);}
  start(end: number) {
    this.live = this.srcs.length;
    if (!this.live) {this.dispose(); return;}
    const done = () => {if (--this.live <= 0) this.dispose();};
    for (const {s, t, offset} of this.srcs) {
      s.onended = done;
      if (offset >= 0) (s as AudioBufferSourceNode).start(t, offset); else s.start(t);
      s.stop(Math.max(end, t + 0.02));
    }
  }
  kill(t: number) {
    try {const g = this.out.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + 0.04);} catch { /* already stopped */ }
    for (const {s} of this.srcs) try {s.stop(t + 0.05);} catch { /* not started */ }
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const {s} of this.srcs) s.onended = null;
    for (const n of this.nodes) try {n.disconnect();} catch { /* gone */ }
  }
}

// Weatherglass's envelope helpers: attack to a peak then an exponential tail;
// an exponential glide; a pitched blip; a filtered noise burst.
function os(p: AudioParam, t: number, attack: number, peak: number, tau: number) {
  p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + attack); p.setTargetAtTime(0, t + attack, tau);
  return t + attack + tau * 7;
}
function cn(p: AudioParam, t: number, from: number, to: number, dur: number) {
  p.setValueAtTime(Math.max(1, from), t); p.exponentialRampToValueAtTime(Math.max(1, to), t + Math.max(0.001, dur));
}
function ml(r: WgVoice, out: AudioNode, t: number, freq: number, ratio: number, peak: number, tau: number, glide = 0.035) {
  const o = r.osc('sine', freq, t), g = r.gain(0);
  cn(o.frequency, t, freq, freq * ratio, glide);
  o.connect(g); g.connect(out);
  return os(g.gain, t, 0.002, peak, tau);
}
function us(r: WgVoice, out: AudioNode, t: number, buffer: AudioBuffer, type: BiquadFilterType, freq: number, q: number, attack: number, peak: number, tau: number) {
  const n = r.noise(buffer, t), f = r.filter(type, freq, q), g = r.gain(0);
  r.chain(n, f, g, out);
  os(g.gain, t, attack, peak, tau);
  return f;
}

interface WgNoise {white: AudioBuffer; pink: AudioBuffer; brown: AudioBuffer; crackle: AudioBuffer[]}
type WgOpts = {pitch: number; strength: number; rand: () => number};
const WG_BANK: Record<string, (r: WgVoice, t: number, e: WgOpts, n: WgNoise) => number> = {
  grab(r, t, e, N) {
    const s = e.pitch;
    const n = us(r, r.out, t, N.pink, 'bandpass', 2400 * s, 0.9, 0.006, 0.7, 0.04);
    n.frequency.setValueAtTime(2800 * s, t); n.frequency.exponentialRampToValueAtTime(900 * s, t + 0.15);
    const o = 420 * s, a = r.osc('sine', o * 1.5, t);
    cn(a.frequency, t, o * 1.5, o, 0.05);
    const l = r.gain(0);
    r.chain(a, l, r.out); os(l.gain, t, 0.004, 0.42, 0.07);
    const c = r.osc('triangle', o * 3.01, t), h = r.gain(0);
    r.chain(c, h, r.out); os(h.gain, t, 0.003, 0.1, 0.03);
    r.send(0.25);
    return t + 0.7;
  },
  release(r, t, e, N) {
    const s = e.pitch, n = r.noise(N.pink, t), o = r.filter('bandpass', 1200 * s, 0.8), a = r.filter('lowpass', 3200 * s, 0.6), l = r.gain(0);
    r.chain(n, o, a, l, r.out);
    cn(o.frequency, t, 1300 * s, 320 * s, 0.42);
    os(l.gain, t, 0.035, 0.75, 0.11);
    us(r, r.out, t, N.brown, 'lowpass', 420 * s, 0.7, 0.02, 0.35, 0.09);
    r.send(0.15);
    return t + 1;
  },
  squish(r, t, e, N) {
    const s = e.pitch, n = r.noise(N.pink, t), o = r.filter('bandpass', 400 * s, 4.5), a = r.filter('lowpass', 2600 * s, 0.7), l = r.gain(0);
    r.chain(n, o, a, l, r.out);
    o.frequency.setValueAtTime(240 * s, t); o.frequency.exponentialRampToValueAtTime(1050 * s, t + 0.09); o.frequency.exponentialRampToValueAtTime(480 * s, t + 0.28);
    os(l.gain, t, 0.022, 1.5, 0.085);
    const c = 2 + Math.floor(e.rand() * 3);
    for (let h = 0; h < c; h++) ml(r, r.out, t + 0.015 + e.rand() * 0.17, (240 + e.rand() * 260) * s, 2.1, 0.17 * (1 - h * 0.15), 0.018, 0.04);
    r.send(0.12);
    return t + 0.75;
  },
  merge(r, t, e, N) {
    const s = e.pitch, n = r.osc('sine', 95 * s, t);
    cn(n.frequency, t, 95 * s, 42 * s, 0.38);
    const o = r.gain(0);
    r.chain(n, o, r.out); os(o.gain, t, 0.018, 0.5, 0.22);
    const a = r.osc('sine', 190 * s, t);
    cn(a.frequency, t, 190 * s, 96 * s, 0.25);
    const l = r.gain(0);
    r.chain(a, l, r.out); os(l.gain, t, 0.012, 0.22, 0.08);
    us(r, r.out, t, N.brown, 'lowpass', 280 * s, 0.9, 0.03, 0.65, 0.2);
    us(r, r.out, t, N.pink, 'bandpass', 650 * s, 0.7, 0.05, 0.16, 0.14);
    r.send(0.3);
    return t + 1.9;
  },
  zap(r, t, e, N) {
    const s = e.pitch, k = Math.min(1.5, Math.max(0.2, e.strength));
    const o = r.sample(N.crackle[Math.floor(e.rand() * 3)], t, (0.75 + e.rand() * 0.5) * s), a = r.filter('highpass', 1300, 0.7), l = r.filter('peaking', 3800 * s, 1.2);
    l.gain.value = 5;
    const c = r.gain(0);
    r.chain(o, a, l, c, r.out);
    const h = 0.06 + 0.12 * k * e.rand();
    c.gain.setValueAtTime(0, t); c.gain.linearRampToValueAtTime(0.55, t + 0.003); c.gain.setTargetAtTime(0, t + h, 0.04);
    const f = r.osc('sawtooth', (95 + e.rand() * 40) * s, t), u = r.filter('bandpass', 1900 * s, 2.5), d = r.gain(0);
    r.chain(f, u, d, r.out); os(d.gain, t, 0.004, 0.06, 0.035);
    r.send(0.15);
    return t + h + 0.35;
  },
  pop(r, t, e, N) {
    const s = e.pitch;
    ml(r, r.out, t, 290 * s, 2.6, 0.62, 0.03, 0.045);
    us(r, r.out, t, N.pink, 'lowpass', 1300 * s, 0.7, 0.004, 0.3, 0.028);
    r.send(0.2);
    return t + 0.4;
  },
};
/** How many of each may sound at once (the oldest is cut). */
const WG_MAX: Record<string, number> = {grab: 3, release: 3, squish: 4, merge: 3, zap: 4, pop: 6};

/** Weatherglass's noise: looping stereo buffers at a fixed loudness, with the seam crossfaded. */
function wgNoise(ac: AudioContext, seconds: number, kind: 'white' | 'pink' | 'brown') {
  const sr = ac.sampleRate, n = Math.floor(seconds * sr), x = Math.floor(0.06 * sr);
  const b = ac.createBuffer(2, n, sr), d = new Float32Array(n + x);
  for (let ch = 0; ch < 2; ch++) {
    if (kind === 'white') for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    else if (kind === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926;
      }
    } else {let a = 0; for (let i = 0; i < d.length; i++) {a = (a + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = a;}}
    let mean = 0;
    for (let i = 0; i < d.length; i++) mean += d[i];
    mean /= d.length;
    let pow = 0;
    for (let i = 0; i < d.length; i++) {d[i] -= mean; pow += d[i] * d[i];}
    const k = 0.25 / Math.sqrt(pow / d.length || 1);
    const c = b.getChannelData(ch);
    for (let i = 0; i < n; i++) c[i] = d[i] * k;
    for (let i = 0; i < x; i++) {const u = i / x; c[i] = d[i] * k * Math.sqrt(u) + d[n + i] * k * Math.sqrt(1 - u);}
  }
  return b;
}
/** The static of a charged cloud: sparse random crackles. */
function wgCrackle(ac: AudioContext, seconds = 0.6) {
  const sr = ac.sampleRate, n = Math.floor(seconds * sr), b = ac.createBuffer(1, n, sr), o = b.getChannelData(0);
  const decay = Math.exp(-1 / (35e-5 * sr));
  let env = 0, rate = 0, peak = 1e-6;
  for (let i = 0; i < n; i++) {
    if (i % 256 === 0) rate = Math.pow(Math.random(), 3) * 1100 / sr;
    if (Math.random() < rate) env = Math.max(env, 0.15 + 0.85 * Math.random() * Math.random());
    env *= decay;
    o[i] = env * (Math.random() * 2 - 1);
    peak = Math.max(peak, Math.abs(o[i]));
  }
  for (let i = 0; i < n; i++) o[i] *= 0.9 / peak;
  return b;
}
/** Its small room: a short, dense decay with a few early reflections. */
function wgImpulse(ac: AudioContext, seconds = 1.4) {
  const sr = ac.sampleRate, n = Math.floor(sr * seconds), b = ac.createBuffer(2, n, sr), pre = Math.floor(0.008 * sr), T = seconds * 0.7;
  for (let ch = 0; ch < 2; ch++) {
    const c = b.getChannelData(ch);
    let h = 0;
    for (let i = pre; i < n; i++) {
      const d = (i - pre) / sr, env = Math.exp(-6.9 * d / T), smooth = 0.12 + 0.75 * Math.exp(-d * 4);
      h += smooth * (Math.random() * 2 - 1 - h);
      c[i] = h * env;
    }
    for (let k = 0; k < 10; k++) {const i = pre + Math.floor(Math.random() * 0.045 * sr); if (i < n) c[i] += (Math.random() * 2 - 1) * 0.5 * (1 - k / 10);}
    const f = Math.floor(0.1 * sr);
    for (let i = n - f; i < n; i++) c[i] *= (n - i) / f;
  }
  return b;
}

/**
 * Procedural sound for the case: the cascade, rain on leaves and glass,
 * crickets, wind and a few drips. Starts only after a user gesture.
 */
export class TerrariumAudio {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private fall!: GainNode;
  private rain!: GainNode;
  private wind!: GainNode;
  private windFilter!: BiquadFilterNode;
  private night!: GainNode;
  private stroke!: GainNode;
  private strokeBP!: BiquadFilterNode;
  private strokePan!: StereoPannerNode;
  private strokeIdle = 1;
  private white!: AudioBuffer;
  private brown!: AudioBuffer;
  private pink!: AudioBuffer;
  private wg: WgNoise | null = null;
  private sfx!: GainNode;
  private verb: GainNode | null = null;
  private voices: WgVoice[] = [];
  muted = false;
  private nextDrip = 0;
  private nextChirp = 0;
  private nextTick = 0;

  get running() {return !!this.ctx && this.ctx.state === 'running';}

  constructor() {
    // Fall silent while the page is hidden.
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) void this.ctx.suspend();
      else void this.ctx.resume();
    });
  }

  start() {
    if (this.ctx) {void this.ctx.resume(); return;}
    const AC = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.7;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(ctx.destination);
    const noise = (seconds: number, brown: boolean) => {
      const b = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < d.length; i++) {
          const w = Math.random() * 2 - 1;
          if (brown) {last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5;} else d[i] = w;
        }
      }
      const src = ctx.createBufferSource();
      src.buffer = b;
      src.loop = true;
      src.start();
      return src;
    };
    // cascade: brown noise, band-passed, with a slow shimmer
    this.fall = ctx.createGain();
    this.fall.gain.value = 0.22;
    const fallSrc = noise(4, true);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 180;
    fallSrc.connect(bp).connect(hp).connect(this.fall).connect(this.master);
    const fallHiss = noise(3, false);
    const hiss = ctx.createBiquadFilter();
    hiss.type = 'bandpass'; hiss.frequency.value = 3200; hiss.Q.value = 0.8;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.02;
    fallHiss.connect(hiss).connect(hissGain).connect(this.fall);
    // rain
    this.rain = ctx.createGain();
    this.rain.gain.value = 0;
    const rainSrc = noise(3, false);
    const rf = ctx.createBiquadFilter();
    rf.type = 'highpass'; rf.frequency.value = 1400;
    rainSrc.connect(rf).connect(this.rain).connect(this.master);
    // wind
    this.wind = ctx.createGain();
    this.wind.gain.value = 0;
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass'; this.windFilter.frequency.value = 500; this.windFilter.Q.value = 3;
    noise(4, true).connect(this.windFilter).connect(this.wind).connect(this.master);
    this.night = ctx.createGain();
    this.night.gain.value = 0.0;
    this.night.connect(this.master);
    // one-shot noise buffers
    const buf = (seconds: number, kind: 'white' | 'brown' | 'pink') => {
      const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
      const d = b.getChannelData(0);
      let last = 0, b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === 'white') d[i] = w;
        else if (kind === 'brown') {last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5;}
        else {b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;}
      }
      return b;
    };
    this.white = buf(2, 'white');
    this.brown = buf(8, 'brown');
    this.pink = buf(4, 'pink');
    // the wind tool's whoosh follows the stroke
    this.stroke = ctx.createGain();
    this.stroke.gain.value = 0;
    this.strokeBP = ctx.createBiquadFilter();
    this.strokeBP.type = 'bandpass'; this.strokeBP.frequency.value = 450; this.strokeBP.Q.value = 1;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600;
    this.strokePan = ctx.createStereoPanner();
    const src = ctx.createBufferSource();
    src.buffer = this.pink; src.loop = true; src.start();
    src.connect(this.strokeBP).connect(lp).connect(this.stroke).connect(this.strokePan).connect(this.master);
    // the Weatherglass voices: their own noise, a bus and the small reverb
    this.wg = {white: wgNoise(ctx, 2, 'white'), pink: wgNoise(ctx, 4, 'pink'), brown: wgNoise(ctx, 4, 'brown'), crackle: [0, 1, 2].map(() => wgCrackle(ctx))};
    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.9;
    this.sfx.connect(this.master);
    const conv = ctx.createConvolver();
    conv.buffer = wgImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    this.verb = ctx.createGain();
    this.verb.connect(conv).connect(wet).connect(this.master);
  }

  /** Plays one of Weatherglass's voices (volume 0..2, pitch 0.25..4, as there). */
  private wgPlay(name: keyof typeof WG_BANK, opts: {volume?: number; pitch?: number; strength?: number} = {}) {
    const ctx = this.ctx, N = this.wg;
    if (!ctx || ctx.state !== 'running' || !N) return;
    const volume = Math.min(2, Math.max(0, opts.volume ?? 1));
    if (volume <= 0.001) return;
    const t = ctx.currentTime + 0.006;
    this.voices = this.voices.filter((v) => !v.disposed);
    const same = this.voices.filter((v) => v.name === name);
    if (same.length >= (WG_MAX[name] ?? 6)) same[0].kill(t);
    if (this.voices.length >= 24) this.voices[0].kill(t);
    const v = new WgVoice(ctx, name, this.sfx, this.verb, t);
    v.out.gain.value = volume;
    try {
      v.start(WG_BANK[name](v, t, {pitch: Math.min(4, Math.max(0.25, opts.pitch ?? 1)), strength: Math.min(2, Math.max(0, opts.strength ?? 1)), rand: Math.random}, N));
      this.voices.push(v);
    } catch (e) {
      v.dispose();
      console.warn('[audio]', name, e);
    }
  }

  /** A one-shot through a filter chain with an envelope. */
  private shot(buffer: AudioBuffer, opts: {gain: number; attack?: number; decay: number; type?: BiquadFilterType; freq?: number; freqTo?: number; q?: number; rate?: number; delay?: number; pan?: number; hp?: number}) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = opts.rate ?? 1;
    const f = ctx.createBiquadFilter();
    f.type = opts.type ?? 'lowpass';
    f.frequency.setValueAtTime(opts.freq ?? 2000, t0);
    if (opts.freqTo) f.frequency.exponentialRampToValueAtTime(opts.freqTo, t0 + opts.decay);
    f.Q.value = opts.q ?? 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(opts.gain, t0 + (opts.attack ?? 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (opts.attack ?? 0.005) + opts.decay);
    const pan = ctx.createStereoPanner();
    pan.pan.value = opts.pan ?? 0;
    let node: AudioNode = src.connect(f);
    if (opts.hp) {const h = ctx.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = opts.hp; node = node.connect(h);}
    node.connect(g).connect(pan).connect(this.master);
    src.start(t0, Math.random() * Math.max(0, buffer.duration - opts.decay - 0.1));
    src.stop(t0 + (opts.attack ?? 0.005) + opts.decay + 0.05);
  }

  /** Lightning: an immediate crack, and thunder rolling in after `delay` seconds. */
  thunder(strength: number, delay: number, pan: number) {
    if (!this.ctx) return;
    this.shot(this.white, {gain: 0.55 * strength, attack: 0.0008, decay: 0.03, type: 'highpass', freq: 250, pan});
    this.shot(this.white, {gain: 0.3 * strength, attack: 0.002, decay: 0.12, type: 'highpass', freq: 900, pan, rate: 0.7});
    this.shot(this.brown, {gain: 0.5 * strength, attack: 0.004, decay: 0.5, type: 'lowpass', freq: 1400, freqTo: 220, pan});
    // the rumble: several bumps of low noise
    const dur = 3.4 + 3.5 * strength + 1.5 * Math.random();
    const bumps = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < bumps; i++) {
      const at = delay + Math.pow(i / bumps, 1.4) * dur * 0.6 + Math.random() * 0.2;
      const g = 0.6 * strength * Math.exp(-2.6 * (at - delay) / dur) * (0.6 + 0.4 * Math.random());
      this.shot(this.brown, {gain: g, attack: 0.08 + Math.random() * 0.25, decay: dur * (0.35 + Math.random() * 0.3), type: 'lowpass', freq: 500 + 700 * strength, freqTo: 130, pan: pan * 0.5, delay: at});
      this.shot(this.pink, {gain: g * 0.35, attack: 0.1, decay: dur * 0.3, type: 'bandpass', freq: 260, freqTo: 90, q: 0.8, pan: pan * 0.4, delay: at});
    }
  }

  // The clouds, with the volumes and pitches Weatherglass gives them (bigger
  // clouds sound lower). Speeds are in Weatherglass's units: its case is ten
  // times this one's size.
  squish(amount: number) {this.wgPlay('squish', {volume: 0.25 + 0.5 * amount, pitch: 1.15 - 0.4 * amount});}
  grab(size: number) {this.wgPlay('grab', {volume: 0.55, pitch: clamp(1.3 - size * 0.25, 0.7, 1.3)});}
  release(size: number, speed: number, squeeze: number) {this.wgPlay('release', {volume: clamp(0.3 + speed * 10 * 0.08 + squeeze * 0.3, 0, 1), pitch: clamp(1.2 - size * 0.2, 0.7, 1.3)});}
  merge(size: number) {this.wgPlay('merge', {volume: 0.7, pitch: clamp(1.25 - size * 0.2, 0.7, 1.2)});}
  /** A cloud evaporating under a right-click: a soft, rising hiss. */
  shrink(amount: number) {this.shot(this.pink, {gain: 0.04 + 0.12 * amount, attack: 0.03, decay: 0.35, type: 'bandpass', freq: 600, freqTo: 2400, q: 1.1});}
  /** Jaws crunching through a cricket's shell: a couple of brittle clicks. */
  crunch(strength: number, pan: number) {
    for (let i = 0; i < 2 + Math.round(Math.random()); i++) this.shot(this.white, {gain: (0.05 + 0.07 * strength) * (1 - i * 0.25), attack: 0.002, decay: 0.035 + Math.random() * 0.03, type: 'bandpass', freq: 2200 + Math.random() * 2600, q: 1.6, delay: i * (0.025 + Math.random() * 0.03), pan});
  }
  /** A cloud condensing (`big`) or a puff added to it as it grows. */
  pop(big = true) {this.wgPlay('pop', big ? {volume: 0.5, pitch: 1 + Math.random() * 0.2} : {volume: 0.18, pitch: 1.2 + Math.random() * 0.3});}
  /** Static crackling in a charged cloud that is being held. */
  zap(charge: number) {this.wgPlay('zap', {volume: 0.12 + 0.35 * charge, pitch: 0.8 + Math.random() * 0.6});}
  splash(strength: number, pan: number) {
    this.shot(this.white, {gain: 0.06 + 0.1 * strength, attack: 0.003, decay: 0.18, type: 'bandpass', freq: 1800, freqTo: 700, q: 0.9, pan});
    for (let i = 0; i < 3; i++) {
      const ctx = this.ctx;
      if (!ctx) return;
      setTimeout(() => this.ping(1100 + Math.random() * 1400, 0.02 * strength, 0.06, this.master), 60 + Math.random() * 260);
    }
  }
  /** A squeeze of the misting bottle: a short, bright hiss with the pump's click. */
  mist() {
    this.shot(this.white, {gain: 0.012, attack: 0.001, decay: 0.02, type: 'bandpass', freq: 1500, q: 2});
    this.shot(this.white, {gain: 0.07, attack: 0.012, decay: 0.32, type: 'highpass', freq: 3800, freqTo: 5200, delay: 0.01});
  }
  /** The fire-bellied toad's call: a soft, low "oop", the throat sac humming. */
  toadCall(pan: number) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime + 0.01, f0 = 420 + Math.random() * 40;
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain(), lp = ctx.createBiquadFilter(), p = ctx.createStereoPanner();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.setValueAtTime(f0 * 0.92, t); o.frequency.linearRampToValueAtTime(f0, t + 0.04); o.frequency.linearRampToValueAtTime(f0 * 0.95, t + 0.16);
    o2.frequency.setValueAtTime(f0 * 2, t); o2.frequency.linearRampToValueAtTime(f0 * 1.9, t + 0.16);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.03); g.gain.setTargetAtTime(0, t + 0.11, 0.035);
    g2.gain.value = 0.12;
    lp.type = 'lowpass'; lp.frequency.value = 1400;
    p.pan.value = pan;
    o.connect(g); o2.connect(g2).connect(g);
    g.connect(lp).connect(p).connect(this.master);
    o.start(t); o2.start(t); o.stop(t + 0.4); o2.stop(t + 0.4);
  }
  fogWhoosh() {this.shot(this.pink, {gain: 0.06, attack: 0.08, decay: 0.6, type: 'bandpass', freq: 500, freqTo: 250, q: 0.8});}

  /** The wind tool: s = stroke strength 0..1, pan -1..1. */
  windStroke(s: number, pan: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.strokeIdle = 0;
    this.stroke.gain.setTargetAtTime(0.06 + 0.6 * Math.pow(s, 0.85), t, 0.05);
    this.strokeBP.frequency.setTargetAtTime(320 + 1500 * s, t, 0.05);
    this.strokeBP.Q.setTargetAtTime(0.8 + 0.8 * s, t, 0.05);
    this.strokePan.pan.setTargetAtTime(pan, t, 0.05);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.7, this.ctx.currentTime, 0.1);
  }

  private ping(freq: number, gain: number, decay: number, dest: AudioNode) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + decay);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);
    o.connect(g).connect(dest);
    o.start();
    o.stop(ctx.currentTime + decay + 0.05);
  }

  private chirp(dest: AudioNode, gain: number) {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 4400 + Math.random() * 300;
    const g = ctx.createGain();
    g.gain.value = 0;
    for (let k = 0; k < 3; k++) {
      const t = t0 + k * 0.045;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.008);
      g.gain.linearRampToValueAtTime(0, t + 0.03);
    }
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    o.connect(g).connect(pan).connect(dest);
    o.start(t0);
    o.stop(t0 + 0.2);
  }

  update(dt: number, s: {rain: number; wind: number; crickets: number; night: number; flow: number}) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    this.strokeIdle += dt;
    if (this.strokeIdle > 0.12) this.stroke.gain.setTargetAtTime(0, t, 0.18);
    this.fall.gain.setTargetAtTime(0.22 * s.flow, t, 0.3);
    this.rain.gain.setTargetAtTime(Math.min(0.2, s.rain * 0.09), t, 0.2);
    this.wind.gain.setTargetAtTime(Math.min(0.3, s.wind * 0.6), t, 0.2);
    this.windFilter.frequency.setTargetAtTime(300 + s.wind * 1500, t, 0.2);
    if (t > this.nextDrip) {
      this.nextDrip = t + 0.6 + Math.random() * 2.5;
      this.ping(1400 + Math.random() * 1600, 0.025, 0.08, this.master);
    }
    if (s.rain > 0.05 && t > this.nextTick) {
      this.nextTick = t + 0.02 + Math.random() * 0.12 / (0.2 + s.rain);
      this.ping(2600 + Math.random() * 2400, 0.01 + Math.random() * 0.02, 0.03, this.master);
    }
    const crickets = s.crickets + s.night * 1.5;
    if (crickets > 0.1 && t > this.nextChirp) {
      this.nextChirp = t + (0.5 + Math.random() * 1.2) / Math.min(3, crickets);
      this.chirp(this.master, 0.025 + 0.02 * Math.min(1, crickets / 2));
    }
  }
}

function clamp(x: number, lo: number, hi: number) {return Math.max(lo, Math.min(hi, x));}

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

  squish(amount: number) {this.shot(this.pink, {gain: 0.05 + 0.08 * amount, attack: 0.02, decay: 0.28, type: 'bandpass', freq: 900 - 300 * amount, freqTo: 380, q: 1.4, rate: 1.15 - 0.4 * amount});}
  grab() {this.shot(this.pink, {gain: 0.05, attack: 0.01, decay: 0.16, type: 'bandpass', freq: 1300, freqTo: 600, q: 1.2});}
  release(speed: number) {this.shot(this.pink, {gain: Math.min(0.12, 0.03 + speed * 0.3), attack: 0.02, decay: 0.3, type: 'bandpass', freq: 700, freqTo: 1500, q: 1});}
  merge() {this.shot(this.brown, {gain: 0.2, attack: 0.04, decay: 0.7, type: 'lowpass', freq: 600, freqTo: 180});}
  pop() {this.shot(this.pink, {gain: 0.06, attack: 0.01, decay: 0.12, type: 'bandpass', freq: 1800, freqTo: 900, q: 2});}
  zap(pan: number) {this.shot(this.white, {gain: 0.05 + Math.random() * 0.04, attack: 0.001, decay: 0.05 + Math.random() * 0.05, type: 'bandpass', freq: 3000 + Math.random() * 3000, q: 3, pan});}
  splash(strength: number, pan: number) {
    this.shot(this.white, {gain: 0.06 + 0.1 * strength, attack: 0.003, decay: 0.18, type: 'bandpass', freq: 1800, freqTo: 700, q: 0.9, pan});
    for (let i = 0; i < 3; i++) {
      const ctx = this.ctx;
      if (!ctx) return;
      setTimeout(() => this.ping(1100 + Math.random() * 1400, 0.02 * strength, 0.06, this.master), 60 + Math.random() * 260);
    }
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

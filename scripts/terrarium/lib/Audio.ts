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
    void dt;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    this.fall.gain.setTargetAtTime(0.22 * s.flow, t, 0.3);
    this.rain.gain.setTargetAtTime(Math.min(0.12, s.rain * 0.08), t, 0.2);
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

// Synthesised dinosaur sounds, played through Weatherglass's own audio engine (its sfx bus and reverb),
// so the sound button, volume and the tab-hidden pause all apply. Nothing is sampled: each call is built
// from oscillators, filtered noise and envelopes, then placed by distance and screen position.
//
// Sounds are guesses informed by living archosaurs: crocodilians and birds make closed-mouth booms,
// hisses and grunts, so the T. rex's roar is a low, rasping growl rather than a film scream.
import { Vector3 } from 'three';

const tmp = new Vector3();

export class Voices {
  constructor(ctx) {
    this.ctx = ctx;
    this.noiseBuf = null;
  }

  get engine() {
    const a = this.ctx.audio;
    if (!a || !a.engine || a.muted || !a.running) return null;
    return a.engine;
  }

  noise(ac) {
    if (this.noiseBuf) return this.noiseBuf;
    const n = ac.sampleRate * 2;
    const b = ac.createBuffer(1, n, ac.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (this.noiseBuf = b);
  }

  // distance gain and stereo pan for a point in the case
  place(pos) {
    const cam = this.ctx.camera;
    const dist = cam.position.distanceTo(pos);
    tmp.copy(pos).project(cam);
    return { gain: Math.min(1, 6 / (dist + 2)), pan: Math.max(-0.9, Math.min(0.9, tmp.x * 0.8)), dist };
  }

  out(e, at, gain, pan, verb = 0.25) {
    const ac = e.ac;
    const g = ac.createGain();
    g.gain.value = gain;
    const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (p) {
      p.pan.value = pan;
      g.connect(p).connect(e.sfx);
    } else g.connect(e.sfx);
    if (e.verbIn && verb > 0) {
      const s = ac.createGain();
      s.gain.value = verb;
      g.connect(s).connect(e.verbIn);
    }
    return g;
  }

  osc(ac, type, f, t0, t1) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    o.start(t0);
    o.stop(t1);
    return o;
  }

  noiseSrc(ac, t0, t1) {
    const s = ac.createBufferSource();
    s.buffer = this.noise(ac);
    s.loop = true;
    s.start(t0, Math.random());
    s.stop(t1);
    return s;
  }

  env(ac, t0, a, hold, r, peak = 1) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    g.gain.setValueAtTime(peak, t0 + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + hold + r);
    return g;
  }

  bp(ac, f, q) {
    const b = ac.createBiquadFilter();
    b.type = 'bandpass';
    b.frequency.value = f;
    b.Q.value = q;
    return b;
  }

  lp(ac, f, q = 0.7) {
    const b = ac.createBiquadFilter();
    b.type = 'lowpass';
    b.frequency.value = f;
    b.Q.value = q;
    return b;
  }

  // a growl: a buzzing low source through two vocal-tract formants, with breath noise
  growl(e, out, t0, dur, f0, f1, { formants = [380, 950], rasp = 0.5, vib = 5.5, level = 1 } = {}) {
    const ac = e.ac;
    const t1 = t0 + dur + 0.1;
    const src = this.osc(ac, 'sawtooth', f0, t0, t1);
    src.frequency.linearRampToValueAtTime(f0 * 1.25, t0 + dur * 0.35);
    src.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const lfo = this.osc(ac, 'sine', vib, t0, t1);
    const lg = ac.createGain();
    lg.gain.value = f0 * 0.04;
    lfo.connect(lg).connect(src.frequency);
    const shaper = ac.createWaveShaper();
    const k = 18;
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    shaper.curve = curve;
    const env = this.env(ac, t0, dur * 0.18, dur * 0.5, dur * 0.4, 0.5 * level);
    src.connect(shaper);
    for (const f of formants) shaper.connect(this.bp(ac, f, 2.2)).connect(env);
    shaper.connect(this.lp(ac, 220)).connect(env);
    const n = this.noiseSrc(ac, t0, t1);
    const ne = this.env(ac, t0, dur * 0.25, dur * 0.45, dur * 0.35, 0.25 * rasp * level);
    n.connect(this.bp(ac, 1300, 0.8)).connect(ne).connect(out);
    env.connect(out);
  }

  thump(e, out, t0, f = 55, level = 1, len = 0.35) {
    const ac = e.ac;
    const o = this.osc(ac, 'sine', f, t0, t0 + len + 0.05);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t0 + len);
    const g = this.env(ac, t0, 0.008, 0.02, len, 0.8 * level);
    o.connect(g).connect(out);
    const n = this.noiseSrc(ac, t0, t0 + 0.2);
    const ng = this.env(ac, t0, 0.005, 0.01, 0.12, 0.25 * level);
    n.connect(this.lp(ac, 300)).connect(ng).connect(out);
  }

  snort(e, out, t0, n = 2, level = 1) {
    const ac = e.ac;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.28 + Math.random() * 0.05;
      const s = this.noiseSrc(ac, t, t + 0.35);
      const g = this.env(ac, t, 0.02, 0.05, 0.2, 0.5 * level);
      s.connect(this.bp(ac, 650 + Math.random() * 300, 1.2)).connect(g).connect(out);
    }
  }

  // ------------------------------------------------------------------ public
  play(kind, pos, size = 1) {
    const e = this.engine;
    if (!e) return;
    const ac = e.ac;
    const { gain, pan } = this.place(pos);
    const t0 = ac.currentTime + 0.03;
    const out = this.out(e, t0, gain, pan, kind === 'step' ? 0.08 : 0.3);
    switch (kind) {
      case 'roar': // T. rex: a long, rasping open-mouthed growl over a sub-bass boom
        this.growl(e, out, t0 + 0.35, 2.2, 62, 44, { formants: [330, 820], rasp: 0.9, level: 1.1 });
        this.thump(e, out, t0 + 0.35, 38, 0.8, 1.6);
        break;
      case 'boom': // closed-mouth boom (T. rex, idle)
        this.thump(e, out, t0, 42, 0.7, 1.8);
        this.growl(e, out, t0, 1.6, 48, 40, { formants: [180, 420], rasp: 0.15, vib: 3, level: 0.5 });
        break;
      case 'sniff':
        this.snort(e, out, t0 + 0.6, 4, 1.5);
        break;
      case 'grunt': // ceratopsian / stegosaur
        this.growl(e, out, t0, 0.55, 95 / size, 80 / size, { formants: [420, 1100], rasp: 0.5, vib: 9, level: 0.6 });
        this.snort(e, out, t0 + 0.45, 1, 0.5);
        break;
      case 'bellow': // threat display
        this.growl(e, out, t0, 1.3, 80, 62, { formants: [360, 900], rasp: 0.7, level: 0.9 });
        this.snort(e, out, t0 + 1.2, 2, 0.6);
        break;
      case 'rumble': // sauropod: deep rumble with a nasal honk
        this.thump(e, out, t0, 36, 0.8, 2.4);
        this.growl(e, out, t0 + 0.3, 1.8, 58, 46, { formants: [240, 560], rasp: 0.2, vib: 2.5, level: 0.7 });
        break;
      case 'hiss':
        {
          const s = this.noiseSrc(ac, t0, t0 + 1.2);
          const g = this.env(ac, t0, 0.08, 0.5, 0.5, 0.35);
          s.connect(this.bp(ac, 2600, 0.6)).connect(g).connect(out);
        }
        break;
      case 'croak': // pterosaur call: short, raspy, falling
        for (let i = 0; i < 2; i++)
          this.growl(e, out, t0 + i * 0.32, 0.26, 420, 300, { formants: [900, 2100], rasp: 0.9, vib: 25, level: 0.9 });
        break;
      case 'step':
        this.thump(e, out, t0, 48 / Math.sqrt(size), Math.min(1, 0.25 * size), 0.3);
        break;
    }
  }
}

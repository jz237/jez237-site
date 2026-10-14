// Synthesised dinosaur sounds, played through Weatherglass's own audio engine (its sfx bus and reverb),
// so the sound button, volume and the tab-hidden pause all apply. Nothing is sampled: each call is built
// from oscillators, filtered noise and envelopes, then placed by distance and screen position.
//
// Sounds are guesses informed by living archosaurs: crocodilians and birds make closed-mouth booms,
// hisses and grunts, so the T. rex's roar is a low, rasping growl rather than a film scream.
import { Vector3 } from 'three';

const tmp = new Vector3();

// Every call has several variants (pitch, length, vowel colour, number of syllables), picked at random
// and never the same one twice in a row for that call, so no sound repeats identically.
const VARIANTS = 5;

export class Voices {
  constructor(ctx) {
    this.ctx = ctx;
    this.noiseBuf = null;
    this.last = {};
  }

  // a variant for this call: pitch p, length d, formant shift f, syllables n, roughness r
  vary(kind) {
    let i;
    do i = Math.floor(Math.random() * VARIANTS);
    while (i === this.last[kind] && VARIANTS > 1);
    this.last[kind] = i;
    const u = i / (VARIANTS - 1); // 0..1 across the variants, plus a little random spread
    const j = () => (Math.random() - 0.5) * 0.08;
    return { i, p: 0.86 + 0.28 * u + j(), d: 1.15 - 0.3 * u + j(), f: 0.9 + 0.2 * ((i * 3) % VARIANTS) / (VARIANTS - 1) + j(), n: 1 + (i % 3), r: 0.7 + 0.6 * ((i * 2) % VARIANTS) / (VARIANTS - 1) };
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
  play(kind, pos, size = 1, surface = 'ground') {
    const e = this.engine;
    if (!e) return;
    const ac = e.ac;
    const { gain, pan } = this.place(pos);
    const t0 = ac.currentTime + 0.03;
    const out = this.out(e, t0, gain, pan, kind === 'step' ? 0.08 : 0.3);
    const V = this.vary(kind);
    switch (kind) {
      case 'roar': // T. rex: a long, rasping open-mouthed growl over a sub-bass boom (5 variants)
        this.growl(e, out, t0 + 0.35, 2.2 * V.d, 62 * V.p, 44 * V.p, { formants: [330 * V.f, 820 * V.f], rasp: 0.9 * V.r, level: 1.1 });
        this.thump(e, out, t0 + 0.35, 38 * V.p, 0.8, 1.6 * V.d);
        if (V.n === 3) this.growl(e, out, t0 + 0.35 + 2.2 * V.d, 0.7, 50 * V.p, 40 * V.p, { formants: [300, 700], rasp: 0.6, level: 0.6 }); // a trailing huff
        break;
      case 'boom': // closed-mouth boom (T. rex, idle)
        this.thump(e, out, t0, 42 * V.p, 0.7, 1.8 * V.d);
        this.growl(e, out, t0, 1.6 * V.d, 48 * V.p, 40 * V.p, { formants: [180 * V.f, 420 * V.f], rasp: 0.15, vib: 3, level: 0.5 });
        break;
      case 'stalk': // T. rex hunting: a low, close growl with breath
        this.growl(e, out, t0, 1.3 * V.d, 40 * V.p, 36 * V.p, { formants: [210 * V.f, 520 * V.f], rasp: 0.55 * V.r, vib: 4, level: 0.55 });
        this.snort(e, out, t0 + 1.0 * V.d, 1, 0.45);
        break;
      case 'snore': // a sleeping animal's slow breath: an in-breath hiss and a low out-breath
        {
          const s = this.noiseSrc(ac, t0, t0 + 2.4);
          const g = this.env(ac, t0, 0.7 * V.d, 0.2, 0.6, 0.12 * Math.min(1.5, size * 0.4));
          s.connect(this.bp(ac, 420 * V.f, 1.5)).connect(g).connect(out);
          this.growl(e, out, t0 + 1.1 * V.d, 0.9 * V.d, 34 * V.p / Math.sqrt(size), 30 * V.p / Math.sqrt(size), { formants: [160, 380], rasp: 0.1, vib: 2, level: 0.18 });
        }
        break;
      case 'contact': // herd contact call: a soft, nasal honk (ceratopsians, stegosaurs)
      case 'answer':
        for (let k = 0; k < (kind === 'answer' ? 1 + (V.n % 2) : V.n); k++)
          this.growl(e, out, t0 + k * 0.42, 0.32 * V.d, (kind === 'answer' ? 118 : 104) * V.p / size, (kind === 'answer' ? 92 : 86) * V.p / size, { formants: [520 * V.f, 1250 * V.f], rasp: 0.2, vib: 7, level: 0.42 });
        break;
      case 'peep': // a hatchling: high, falling chirps
        for (let k = 0; k < V.n + 1; k++) {
          const t = t0 + k * (0.13 + Math.random() * 0.06);
          const o = this.osc(ac, 'triangle', 900 * V.p, t, t + 0.16);
          o.frequency.exponentialRampToValueAtTime(560 * V.p, t + 0.13);
          const g = this.env(ac, t, 0.01, 0.03, 0.09, 0.22);
          o.connect(this.bp(ac, 1500 * V.f, 1.2)).connect(g).connect(out);
        }
        break;
      case 'purr': // a sauropod content while browsing: a long, very low rumble you feel more than hear
        this.thump(e, out, t0, 30 * V.p, 0.45, 2.2 * V.d);
        this.growl(e, out, t0 + 0.2, 1.8 * V.d, 40 * V.p, 34 * V.p, { formants: [200 * V.f, 470 * V.f], rasp: 0.1, vib: 2, level: 0.35 });
        break;
      case 'sniff':
        this.snort(e, out, t0 + 0.6, 4, 1.5);
        break;
      case 'grunt': // ceratopsian / stegosaur
        this.growl(e, out, t0, 0.55 * V.d, (95 * V.p) / size, (80 * V.p) / size, { formants: [420 * V.f, 1100 * V.f], rasp: 0.5 * V.r, vib: 9, level: 0.6 });
        this.snort(e, out, t0 + 0.45, 1, 0.5);
        break;
      case 'bellow': // threat display
        this.growl(e, out, t0, 1.3 * V.d, 80 * V.p, 62 * V.p, { formants: [360 * V.f, 900 * V.f], rasp: 0.7 * V.r, level: 0.9 });
        this.snort(e, out, t0 + 1.2, 2, 0.6);
        break;
      case 'rumble': // sauropod: deep rumble with a nasal honk
        this.thump(e, out, t0, 36 * V.p, 0.8, 2.4 * V.d);
        this.growl(e, out, t0 + 0.3, 1.8 * V.d, 58 * V.p, 46 * V.p, { formants: [240 * V.f, 560 * V.f], rasp: 0.2, vib: 2.5, level: 0.7 });
        break;
      case 'hiss':
        {
          const s = this.noiseSrc(ac, t0, t0 + 1.2);
          const g = this.env(ac, t0, 0.08, 0.5, 0.5, 0.35);
          s.connect(this.bp(ac, 2600, 0.6)).connect(g).connect(out);
        }
        break;
      case 'croak': // pterosaur call: short, raspy, falling
        for (let i = 0; i < 1 + V.n % 3; i++)
          this.growl(e, out, t0 + i * 0.3 * V.d, 0.26 * V.d, 420 * V.p, 300 * V.p, { formants: [900 * V.f, 2100 * V.f], rasp: 0.9 * V.r, vib: 25, level: 0.9 });
        break;
      case 'splash': // a pterosaur's beak hitting the water: a slap, a spray and a low plop
        {
          const s = this.noiseSrc(ac, t0, t0 + 0.5);
          const g = this.env(ac, t0, 0.004, 0.03, 0.3, 0.8);
          s.connect(this.bp(ac, 1500, 0.8)).connect(g).connect(out);
          const o = this.osc(ac, 'sine', 320, t0, t0 + 0.25);
          o.frequency.exponentialRampToValueAtTime(110, t0 + 0.2);
          const og = this.env(ac, t0, 0.005, 0.02, 0.15, 0.5);
          o.connect(og).connect(out);
        }
        break;
      case 'crop': // a sauropod stripping fronds: a few dry tears and crackles
        for (let i = 0; i < 3; i++) {
          const t = t0 + i * (0.08 + Math.random() * 0.06);
          const s = this.noiseSrc(ac, t, t + 0.12);
          const g = this.env(ac, t, 0.003, 0.02, 0.07, 0.35);
          s.connect(this.bp(ac, 2400 + Math.random() * 1500, 1.2)).connect(g).connect(out);
        }
        break;
      case 'step': // a footfall, by what it lands on; big animals deeper and heavier on all of them
        {
          const lv = Math.min(1, 0.25 * size), deep = 1 / Math.sqrt(size);
          const burst = (t, len, f, q, lvl, attack = 0.004) => {
            const s = this.noiseSrc(ac, t, t + len + 0.05);
            const g = this.env(ac, t, attack, len * 0.25, len * 0.75, lvl);
            s.connect(this.bp(ac, f, q)).connect(g).connect(out);
          };
          if (surface === 'water') {
            // a slap and spray, and a low plop as the foot goes in
            burst(t0, 0.28 * V.d, 1300 * V.f, 0.8, 0.7 * lv + 0.08);
            const o = this.osc(ac, 'sine', 260 * deep * V.p, t0 + 0.02, t0 + 0.3);
            o.frequency.exponentialRampToValueAtTime(90 * deep, t0 + 0.24);
            o.connect(this.env(ac, t0 + 0.02, 0.006, 0.03, 0.18, 0.5 * lv + 0.05)).connect(out);
            this.thump(e, out, t0, 40 * deep, lv * 0.5, 0.25);
          } else if (surface === 'mud') {
            // a soft, sucking squelch: a low wet thud, then the foot pulling free
            this.thump(e, out, t0, 42 * deep, lv * 0.8, 0.3);
            burst(t0 + 0.02, 0.18, 520 * V.f, 1.5, 0.45 * lv + 0.05, 0.03);
            const o = this.osc(ac, 'sine', 180 * V.p, t0 + 0.2, t0 + 0.36);
            o.frequency.exponentialRampToValueAtTime(320 * V.p, t0 + 0.3);
            o.connect(this.env(ac, t0 + 0.2, 0.01, 0.02, 0.08, 0.25 * lv + 0.03)).connect(out);
          } else if (surface === 'gravel') {
            // stones shifting: a scatter of short, bright ticks over the thud
            this.thump(e, out, t0, 50 * deep, lv * 0.7, 0.22);
            for (let k = 0; k < 5 + V.n * 2; k++) burst(t0 + Math.random() * 0.09, 0.025, 2800 + Math.random() * 2600, 2.5, (0.22 + Math.random() * 0.2) * (lv + 0.1));
          } else if (surface === 'snow') {
            // packed snow: a muffled, squeaky crunch and hardly any thud
            this.thump(e, out, t0, 46 * deep, lv * 0.35, 0.2);
            burst(t0, 0.16 * V.d, 1800 * V.f, 1.1, 0.4 * lv + 0.06, 0.03);
            burst(t0 + 0.05, 0.06, 4200, 3, 0.15 * lv + 0.03);
          } else {
            // ordinary ground: the thud, and the planting brushed aside
            this.thump(e, out, t0, 48 * deep, lv, 0.3);
            burst(t0, 0.12, 2600 * V.f, 0.9, 0.1 * lv + 0.02);
          }
        }
        break;
    }
  }
}

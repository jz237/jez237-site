// Chip: a small live WebAudio synth for crunchy early-arcade flavoured effects of SKYHOLD's own design (square /
// triangle oscillators, stepped "decimated" noise, fast stepped pitch sweeps, short envelopes). No samples and none
// of any classic game's sounds: every effect here is designed for this game.
//
//   const chip = new Chip(ctx, dest);          // ctx may be null: then every call is a silent no-op
//   chip.play(name, { vol = 1, pan = 0, rate = 1 } = {});   // returns true when the sound was started
//
// Names: beam pop boom bigboom warp grab catch land lost nova blink death life tell mine swarm alarm
// (Chip.NAMES). rate scales pitch up and length down together (rate 1.2 = 20 % higher and shorter).
// Cheap per call: a handful of nodes per sound, the noise buffers are made once (lazily on the first play) and reused.
// Safe at 30 calls a second: each name has a minimum gap and a cap on overlapping copies, and there is a global
// voice cap; calls over a limit are dropped (play returns false). It never throws.

const MAXV = 40;                      // global cap on overlapping chip sounds
// name: [max overlapping copies, minimum gap between starts (s)]
const LIMIT = {
  beam: [4, 0.025], pop: [6, 0.02], boom: [4, 0.04], bigboom: [2, 0.08], warp: [4, 0.03], grab: [3, 0.05],
  catch: [2, 0.05], land: [2, 0.06], lost: [2, 0.1], nova: [1, 0.3], blink: [2, 0.06], death: [1, 0.3],
  life: [1, 0.2], tell: [4, 0.04], mine: [4, 0.04], swarm: [3, 0.08], alarm: [1, 0.25],
};
// per-sound level (the tonal sounds are lifted so they sit near the noise bursts; peaks stay -8 to -19 dBFS at vol 1)
const LEVEL = {
  beam: 1, pop: 1, boom: 1, bigboom: 1, warp: 1.6, grab: 1.7, catch: 1.6, land: 1.35, lost: 1.45, nova: 1, blink: 1.6,
  death: 1, life: 1.45, tell: 1.6, mine: 1.25, swarm: 1.7, alarm: 1.35,
};
const EPS = 0.0008;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);

export class Chip {
  constructor(ctx, dest) {
    this.ctx = ctx || null;
    this.dest = dest || (ctx ? ctx.destination : null);
    this.bus = null; this.nb = null; this.r = 1;
    this.ends = {}; this.last = {};
    this.all = new Float64Array(MAXV); this.allI = 0;
  }

  _init() {
    const c = this.ctx;
    this.bus = c.createGain();
    this.bus.gain.value = 0.6;
    const lp = c.createBiquadFilter();  // one gentle shared top cut, no resonance
    lp.type = 'lowpass'; lp.frequency.value = 9000; lp.Q.value = -3;
    // safety: a stateless soft clipper (no latency, no warm-up). Linear up to 0.6 (-4.4 dBFS), where no single sound
    // reaches; a pile-up of many sounds at once bends smoothly toward 0.89 (-1 dBFS) instead of clipping.
    const pre = c.createGain(), sh = c.createWaveShaper(), N = 1024;
    pre.gain.value = 0.5;  // the curve covers inputs -2..2
    const curve = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * 4 - 2, a = Math.abs(x);
      curve[i] = Math.sign(x) * (a <= 0.6 ? a : 0.6 + 0.29 * Math.tanh((a - 0.6) / 0.29));
    }
    sh.curve = curve; sh.oversample = 'none';
    this.bus.connect(lp); lp.connect(pre); pre.connect(sh); sh.connect(this.dest);
    // Stepped noise: random values held for `hold` samples (sample-and-hold "decimation"); playbackRate then sweeps
    // the step rate, which is what makes it crunchy. 'metal' is a short repeating pattern (a buzzy, pitched noise).
    const sr = c.sampleRate, n = Math.floor(sr * 1.0);
    this.nb = {};
    let seed = 0x2f6b1;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x3fffffff - 1; };
    for (const [k, hold] of [['n1', 1], ['n3', 3], ['n8', 8], ['n24', 24]]) {
      const b = c.createBuffer(1, n, sr), d = b.getChannelData(0);
      let v = 0;
      for (let i = 0; i < n; i++) { if (i % hold === 0) v = rnd(); d[i] = v * 0.9; }
      this.nb[k] = b;
    }
    { // 'metal': a 31-step pattern repeated (period 31 * 6 samples, ~237 Hz buzz at 44.1 kHz)
      const pat = [], hold = 6, P = 31 * hold, reps = Math.floor(n / P);
      for (let i = 0; i < 31; i++) pat.push(rnd() > 0 ? 0.8 : -0.8);
      const b = c.createBuffer(1, P * reps, sr), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = pat[Math.floor((i % P) / hold)];
      this.nb.metal = b;
    }
  }

  play(name, opts) {
    const c = this.ctx;
    if (!c || !this.dest) return false;
    const fn = SOUNDS[name];
    if (!fn) return false;
    try {
      if (c.state === 'closed') return false;
      if (!this.bus) this._init();
      const o = opts || {};
      const vol = clamp(num(o.vol, 1), 0, 2), pan = clamp(num(o.pan, 0), -1, 1), rate = clamp(num(o.rate, 1), 0.25, 4);
      if (vol <= 0) return false;
      const now = c.currentTime;
      const [cap, gap] = LIMIT[name];
      if (now - (this.last[name] ?? -1) < gap / rate) return false;
      let e = this.ends[name];
      if (!e) e = this.ends[name] = new Float64Array(cap);
      let slot = -1;
      for (let i = 0; i < cap; i++) if (e[i] <= now) { slot = i; break; }
      if (slot < 0) return false;
      if (this.all[this.allI] > now) return false;     // the oldest global slot is still sounding: at the cap
      const out = c.createGain();
      out.gain.value = vol * LEVEL[name];
      if (pan && c.createStereoPanner) {
        const p = c.createStereoPanner(); p.pan.value = pan;
        out.connect(p); p.connect(this.bus);
      } else out.connect(this.bus);
      this.r = rate;
      const t = now + 0.004;
      const len = fn(this, out, t) / rate;
      e[slot] = t + len; this.last[name] = now;
      this.all[this.allI] = t + len; this.allI = (this.allI + 1) % MAXV;
      return true;
    } catch (err) {
      return false;
    }
  }
}
Chip.NAMES = Object.freeze(Object.keys(LIMIT));

// ------------------------------------------------------------------------------------------------ building blocks
// All times are in seconds relative to the sound's start and are divided by ch.r; all frequencies are multiplied.
function env(g, t, a, peak, hold, d) {
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  if (hold > 0) g.gain.setValueAtTime(peak, t + a + hold);
  g.gain.exponentialRampToValueAtTime(EPS, t + a + hold + d);
  g.gain.setValueAtTime(0, t + a + hold + d + 0.005);
}
function lowpass(c, f, dest) {
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = f; lp.Q.value = -3;
  lp.connect(dest);
  return lp;
}

// one oscillator with a pitch sweep (exponential, linear, or `steps` hard steps for the crunchy stair-step sound)
function tone(ch, out, t0, p) {
  const c = ch.ctx, r = ch.r, t = t0 + (p.at || 0) / r, d = p.d / r, a = (p.a ?? 0.003) / r, h = (p.h || 0) / r;
  const o = c.createOscillator(), g = c.createGain();
  o.type = p.type || 'square';
  const f0 = p.f0 * r, f1 = (p.f1 ?? p.f0) * r, end = a + h + d;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) {
    if (p.steps) {
      for (let i = 1; i <= p.steps; i++) o.frequency.setValueAtTime(f0 * Math.pow(f1 / f0, i / p.steps), t + end * i / (p.steps + 1));
    } else if (p.lin) o.frequency.linearRampToValueAtTime(f1, t + end);
    else o.frequency.exponentialRampToValueAtTime(f1, t + end);
  }
  if (p.vib) lfo(c, o.frequency, p.vib[0] * r, p.vib[1] * r, t, end, p.vib[2]);
  env(g, t, a, p.g, h, d);
  o.connect(g);
  g.connect(p.lp ? lowpass(c, p.lp * Math.min(r, 1.5), out) : out);
  if (p.trem) lfo(c, g.gain, p.trem[0] * r, p.g * p.trem[1], t, end, 'triangle');
  o.start(t); o.stop(t + end + 0.02);
}

// one oscillator stepping through a list of notes (one note every `step` s), one envelope over the whole run
function notes(ch, out, t0, p) {
  const c = ch.ctx, r = ch.r, t = t0 + (p.at || 0) / r, st = p.step / r, n = p.f.length;
  const o = c.createOscillator(), g = c.createGain();
  o.type = p.type || 'square';
  for (let i = 0; i < n; i++) o.frequency.setValueAtTime(p.f[i] * r, t + i * st);
  const total = n * st + (p.tail || 0.12) / r, a = 0.003 / r;
  if (p.gate) { // short envelope per note (separate blips)
    g.gain.setValueAtTime(0, t);
    for (let i = 0; i < n; i++) {
      const ti = t + i * st;
      g.gain.setValueAtTime(0, ti); g.gain.linearRampToValueAtTime(p.g, ti + a);
      g.gain.exponentialRampToValueAtTime(EPS, ti + st * p.gate);
      g.gain.setValueAtTime(0, ti + st * p.gate + 0.002);
    }
  } else env(g, t, a, p.g, n * st * 0.6, total - n * st * 0.6);
  o.connect(g);
  g.connect(p.lp ? lowpass(c, p.lp, out) : out);
  o.start(t); o.stop(t + total + 0.03);
}

// looped stepped-noise buffer; playbackRate r0 -> r1 sweeps its step rate, optional lowpass sweep lp0 -> lp1
function noise(ch, out, t0, p) {
  const c = ch.ctx, r = ch.r, t = t0 + (p.at || 0) / r, d = p.d / r, a = (p.a ?? 0.002) / r, h = (p.h || 0) / r;
  const s = c.createBufferSource(), g = c.createGain();
  s.buffer = ch.nb[p.buf || 'n3']; s.loop = true;
  const r0 = p.r0 * r, r1 = (p.r1 ?? p.r0) * r, end = a + h + d;
  s.playbackRate.setValueAtTime(r0, t);
  if (r1 !== r0) s.playbackRate.exponentialRampToValueAtTime(r1, t + end);
  env(g, t, a, p.g, h, d);
  let head = g;
  if (p.lp0) {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = -3;
    lp.frequency.setValueAtTime(p.lp0, t);
    if (p.lp1) lp.frequency.exponentialRampToValueAtTime(p.lp1, t + end);
    g.connect(lp); head = lp;
  }
  if (p.hp) {
    const hp = c.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = p.hp; hp.Q.value = -3;
    head.connect(hp); head = hp;
  }
  head.connect(out);
  s.connect(g);
  s.start(t, ((t0 * 7.31) % 0.8));  // a varying offset into the buffer so repeats differ
  s.stop(t + end + 0.02);
}

function lfo(c, param, f, depth, t, d, type) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'square'; o.frequency.value = f; g.gain.value = depth;
  o.connect(g); g.connect(param);
  o.start(t); o.stop(t + d + 0.02);
}

// ------------------------------------------------------------------------------------------------ the sounds
// Each returns its length in seconds at rate 1. Layer gains are kept small: a single sound peaks well under 0 dBFS.
const SOUNDS = {
  // player beam cannon: a soft stair-stepped downward zap over a round triangle body and a tiny grit tick
  beam(ch, out, t) {
    tone(ch, out, t, { type: 'square', f0: 1180, f1: 400, d: 0.07, a: 0.002, g: 0.075, steps: 5, lp: 2600 });
    tone(ch, out, t, { type: 'triangle', f0: 590, f1: 190, d: 0.085, a: 0.002, g: 0.16 });
    noise(ch, out, t, { buf: 'n3', r0: 0.7, r1: 0.3, d: 0.03, g: 0.04, lp0: 2800, lp1: 1200 });
    return 0.1;
  },
  // small machine destroyed: a crunchy noise burst with a falling stepped blip
  pop(ch, out, t) {
    noise(ch, out, t, { buf: 'n3', r0: 0.9, r1: 0.22, d: 0.2, g: 0.3, lp0: 3600, lp1: 700 });
    tone(ch, out, t, { type: 'square', f0: 260, f1: 70, d: 0.075, g: 0.09, steps: 4, lp: 1500 });
    return 0.22;
  },
  boom(ch, out, t) {
    noise(ch, out, t, { buf: 'n8', r0: 0.8, r1: 0.18, d: 0.62, a: 0.004, g: 0.42, lp0: 2200, lp1: 240 });
    tone(ch, out, t, { type: 'triangle', f0: 110, f1: 38, d: 0.34, g: 0.3 });
    noise(ch, out, t, { buf: 'n3', r0: 0.5, r1: 0.2, d: 0.24, g: 0.07, lp0: 2500, lp1: 900 });
    return 0.68;
  },
  bigboom(ch, out, t) {
    noise(ch, out, t, { buf: 'n8', r0: 0.7, r1: 0.12, d: 1.6, h: 0.08, a: 0.004, g: 0.38, lp0: 2000, lp1: 150 });
    tone(ch, out, t, { type: 'triangle', f0: 92, f1: 30, d: 0.9, g: 0.3 });
    noise(ch, out, t, { at: 0.13, buf: 'n3', r0: 0.6, r1: 0.15, d: 0.9, a: 0.01, g: 0.13, lp0: 1800, lp1: 300 });
    tone(ch, out, t, { at: 0.04, type: 'square', f0: 180, f1: 40, d: 0.6, g: 0.045, steps: 8, lp: 900 });
    return 1.75;
  },
  // an alien machine materialising: a climbing note ladder over a rising triangle sweep and a hiss swell
  warp(ch, out, t) {
    notes(ch, out, t, { type: 'square', f: [196, 262, 311, 392, 466, 587, 698], step: 0.042, g: 0.07, lp: 3000, tail: 0.06 });
    tone(ch, out, t, { type: 'triangle', f0: 150, f1: 1150, d: 0.3, a: 0.02, g: 0.1 });
    noise(ch, out, t, { buf: 'n1', r0: 0.3, r1: 1, d: 0.26, a: 0.12, g: 0.025, lp0: 1500, lp1: 4000 });
    return 0.36;
  },
  // tractor beam locking on: a warbling fall, then a low magnetic clunk
  grab(ch, out, t) {
    tone(ch, out, t, { type: 'triangle', f0: 1100, f1: 240, d: 0.3, a: 0.01, g: 0.13, vib: [28, 70, 'square'] });
    tone(ch, out, t, { at: 0.29, type: 'square', f0: 96, f1: 58, d: 0.08, g: 0.13, lp: 900 });
    noise(ch, out, t, { at: 0.29, buf: 'n8', r0: 0.5, r1: 0.2, d: 0.06, g: 0.08, lp0: 1200 });
    return 0.4;
  },
  // gunship catches a settler: clamp blip + a soft two-partial chime
  catch(ch, out, t) {
    tone(ch, out, t, { type: 'square', f0: 180, f1: 90, d: 0.05, g: 0.12, lp: 1200 });
    tone(ch, out, t, { at: 0.05, type: 'triangle', f0: 1318, d: 0.28, g: 0.11 });
    tone(ch, out, t, { at: 0.05, type: 'triangle', f0: 1976, d: 0.18, g: 0.04 });
    return 0.35;
  },
  // settler set down safely: a warm rising three-note chime
  land(ch, out, t) {
    notes(ch, out, t, { type: 'triangle', f: [523, 784, 1047], step: 0.09, g: 0.15, tail: 0.25 });
    notes(ch, out, t, { type: 'square', f: [523, 784, 1047], step: 0.09, g: 0.035, lp: 1800, tail: 0.2 });
    return 0.53;
  },
  // settler lost: three soft falling notes sliding down at the end
  lost(ch, out, t) {
    notes(ch, out, t, { type: 'triangle', f: [784, 659, 523], step: 0.16, g: 0.12, tail: 0.04 });
    notes(ch, out, t, { type: 'square', f: [784, 659, 523], step: 0.16, g: 0.03, lp: 1400, tail: 0.04 });
    tone(ch, out, t, { at: 0.5, type: 'triangle', f0: 523, f1: 370, d: 0.32, a: 0.01, g: 0.11 });
    return 0.84;
  },
  // smart bomb: deep thump, an expanding rising ring of crunch, a long falling wash and a tumbling arpeggio
  nova(ch, out, t) {
    tone(ch, out, t, { type: 'triangle', f0: 72, f1: 28, d: 1.1, g: 0.32 });
    noise(ch, out, t, { buf: 'n3', r0: 0.25, r1: 1.3, d: 0.45, a: 0.02, g: 0.17, lp0: 700, lp1: 5000 });
    noise(ch, out, t, { at: 0.32, buf: 'n8', r0: 1, r1: 0.14, d: 1.4, a: 0.01, g: 0.28, lp0: 4000, lp1: 200 });
    notes(ch, out, t, { at: 0.05, type: 'square', f: [1568, 1319, 1047, 880, 698, 587, 466, 392, 311], step: 0.05, g: 0.045, lp: 3000, tail: 0.15 });
    return 1.8;
  },
  // gunship jumps away: a fast stair-stepped climb and a short hiss
  blink(ch, out, t) {
    tone(ch, out, t, { type: 'square', f0: 260, f1: 2400, d: 0.15, g: 0.075, steps: 10, lp: 3500 });
    tone(ch, out, t, { type: 'triangle', f0: 400, f1: 2800, d: 0.14, g: 0.08 });
    noise(ch, out, t, { at: 0.11, buf: 'n1', r0: 1, r1: 0.3, d: 0.1, g: 0.03, lp0: 3000 });
    return 0.26;
  },
  // player gunship destroyed: a buzzy metal crunch, a long stepped dive and a deep rumbling wash
  death(ch, out, t) {
    noise(ch, out, t, { buf: 'metal', r0: 1, r1: 0.35, d: 0.35, g: 0.11, lp0: 3000, lp1: 900 });
    noise(ch, out, t, { buf: 'n8', r0: 0.8, r1: 0.1, d: 1.8, h: 0.1, a: 0.004, g: 0.38, lp0: 2500, lp1: 140 });
    tone(ch, out, t, { type: 'square', f0: 900, f1: 55, d: 1.25, g: 0.06, steps: 16, lp: 1600 });
    tone(ch, out, t, { type: 'triangle', f0: 120, f1: 30, d: 0.8, g: 0.28 });
    return 1.95;
  },
  // extra ship: a bright climbing arpeggio with a bounce at the top
  life(ch, out, t) {
    notes(ch, out, t, { type: 'square', f: [523, 659, 784, 1047, 784, 1047, 1319], step: 0.065, g: 0.06, lp: 3200, gate: 0.85, tail: 0.1 });
    notes(ch, out, t, { type: 'triangle', f: [523, 659, 784, 1047, 784, 1047, 1319], step: 0.065, g: 0.1, gate: 0.9, tail: 0.1 });
    return 0.56;
  },
  // enemy weapon charging: a short rising whine with a flutter (the warning before a shot)
  tell(ch, out, t) {
    tone(ch, out, t, { type: 'square', f0: 220, f1: 1300, d: 0.42, a: 0.03, g: 0.06, lin: true, lp: 2400, trem: [22, 0.5] });
    tone(ch, out, t, { type: 'triangle', f0: 110, f1: 650, d: 0.42, a: 0.03, g: 0.08, lin: true });
    return 0.48;
  },
  // mine dropped and arming: a low clunk then two short blips
  mine(ch, out, t) {
    tone(ch, out, t, { type: 'triangle', f0: 160, f1: 55, d: 0.07, g: 0.2 });
    notes(ch, out, t, { at: 0.12, type: 'square', f: [988, 988], step: 0.12, g: 0.06, lp: 2500, gate: 0.4, tail: 0.02 });
    return 0.38;
  },
  // a pack of tiny darts buzzing past: three detuned buzzes, chopped, falling in pitch as they pass
  swarm(ch, out, t) {
    const c = ch.ctx, r = ch.r, d = 0.7 / r;
    const am = c.createGain();
    am.gain.value = 0.5;
    lfo(c, am.gain, 37 * r, 0.5, t, d, 'square');
    am.connect(lowpass(c, 1800, out));
    for (const f of [118, 131, 149]) tone(ch, am, t, { type: 'square', f0: f * 1.25, f1: f * 0.8, d: 0.62, a: 0.08, g: 0.05 });
    return 0.72;
  },
  // colony alarm: a short two-cycle up-down siren
  alarm(ch, out, t) {
    const c = ch.ctx, r = ch.r;
    for (const [type, g, lp] of [['triangle', 0.12, 0], ['square', 0.035, 2000]]) {
      const o = c.createOscillator(), gn = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(520 * r, t);
      for (let i = 0; i < 2; i++) {
        o.frequency.linearRampToValueAtTime(820 * r, t + (i * 0.36 + 0.18) / r);
        o.frequency.linearRampToValueAtTime(520 * r, t + (i * 0.36 + 0.36) / r);
      }
      env(gn, t, 0.01 / r, g, 0.6 / r, 0.12 / r);
      o.connect(gn); gn.connect(lp ? lowpass(c, lp, out) : out);
      o.start(t); o.stop(t + 0.76 / r);
    }
    return 0.76;
  },
};

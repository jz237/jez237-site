// The sound bank: every sound in the game as a recipe over audio_dsp.js.
//
// Recipes are physically motivated rather than sampled: a struck object is a
// set of damped modes excited by a short contact burst, rubble is a cloud of
// small collisions, a groan is stick-slip friction driving resonances. The
// bank is rendered once (in a worker) into a few seconds of buffers; at run
// time the mixer only starts buffers with randomised pitch, filter and gain.
import {
  srand, rnd, rr, rlog, nz, white, pink, brown, lp1, hp1, bq, svf, shape, decay,
  burst, mix, ring, modal, grains, sweep, pulses, sat, finish, loopable, bandGain,
  rngState, rngRestore,
} from './audio_dsp.js';

// Two render rates. Anything with nothing to say above 10 kHz (rumbles,
// bodies, beds, masonry, timber, footsteps) is rendered at the lower one:
// half the samples is half the memory and render time. Glass, metal and
// sharp cracks keep the full rate.
export const HI = 48000;
export const LO = 24000;
// The wind bed alone goes lower still.
const WIND = 16000;

const defs = [];
let bufferCount = 0;
/** Sound name -> sound id. */
export const SND = {};

// tau: rough loudness decay time (s); the mixer uses it to decide which
// playing voice is the quietest when it has to steal one.
// gen(variant) returns the samples (or [left, right]). The few long recipes
// are generators that yield between stages of a few milliseconds each, so a
// main-thread render (no worker) can be spread over many short tasks.
function def(name, variants, sr, tau, gen) {
  SND[name] = defs.length;
  defs.push({ name, variants, sr, tau, gen, base: bufferCount });
  bufferCount += variants;
}

const buf = (sr, sec) => new Float32Array(Math.floor(sr * sec));
const TAU = 2 * Math.PI;

// ---------------------------------------------------------------- impacts --

// Masonry is heavily damped: a low thud from the mass, a short "tock" from
// the surface, and a little grit. No mode rings longer than ~60 ms.
def('imp_stone', 4, LO, 0.07, (v) => {
  const sr = LO, o = buf(sr, 0.36);
  const e = burst(sr, 0.03, rr(0.0025, 0.004), 4500);
  modal(o, e, sr, [
    rr(66, 92), rr(0.045, 0.06), 0.4,
    rr(128, 176), rr(0.028, 0.04), 0.45,
    rr(236, 320), rr(0.016, 0.024), 0.6,
    rr(540, 800), rr(0.007, 0.012), 1.5,
    rr(1100, 1650), rr(0.004, 0.007), 1.5,
    rr(2100, 3100), rr(0.0025, 0.004), 1.0,
  ]);
  grains(o, sr, 7 + v, 0.004, 0.07, 1.5, 1400, 4500, 0.003, 0.010, 0.16);
  return finish(o, sr);
});

// Timber: free-bar mode ratios (1 : 2.76 : 5.40) blurred by knots and grain,
// all under ~1 kHz, decaying in a few tens of milliseconds. Warm and short.
def('imp_wood', 4, LO, 0.06, (v) => {
  const sr = LO, o = buf(sr, 0.34);
  const e = burst(sr, 0.02, rr(0.003, 0.005), 2800);
  const f0 = [176, 208, 242, 290][v] * rr(0.96, 1.04);
  const ratio = [1, rr(1.85, 2.1), 2.76, rr(3.6, 4.1), 5.2];
  const amp = [1, 0.7, 0.6, 0.38, 0.22];
  for (let k = 0; k < 5; k++) {
    ring(o, e, sr, f0 * ratio[k], rr(0.05, 0.07) / Math.pow(ratio[k], 0.8), amp[k]);
  }
  // The hard first contact before the body speaks.
  const tick = bq(burst(sr, 0.006, 0.0012), sr, 'bp', rr(2200, 3400), 1.2);
  mix(o, tick, 0, 0.9);
  return finish(o, sr);
});

// Steel: barely damped, so a dozen inharmonic partials (plate/beam ratios)
// ring for a second. Split pairs beat against each other, which is what makes
// struck metal shimmer instead of sounding like a chord.
def('imp_metal', 4, HI, 0.45, (v) => {
  const sr = HI, o = buf(sr, 1.7);
  const e = burst(sr, 0.012, 0.0012);
  const f0 = [392, 466, 554, 330][v] * rr(0.97, 1.03);
  const ratios = [1, 1.506, 2.08, 2.756, 3.42, 4.31, 5.404, 6.27, 7.61, 8.933, 10.6, 12.4];
  for (const q of ratios) {
    const f = f0 * q * rr(0.985, 1.015);
    if (f > 11000) continue;
    const tau = 0.9 * rr(0.75, 1.25) * Math.pow(q, -0.55);
    const a = rr(0.5, 1) * (q < 2 ? 0.7 : 1) * Math.pow(q, -0.25);
    ring(o, e, sr, f, tau, a);
    if (rnd() < 0.5) ring(o, e, sr, f * rr(1.003, 1.012), tau * rr(0.7, 1), a * 0.6);
  }
  const clank = bq(burst(sr, 0.02, 0.004), sr, 'bp', rr(2500, 4000), 0.9);
  mix(o, clank, 0, 1.6);
  return finish(o, sr);
});

// Copper pipe and sheet: a softer metal. Tube modes, lower Q, duller strike.
def('imp_copper', 2, HI, 0.2, (v) => {
  const sr = HI, o = buf(sr, 0.85);
  const e = burst(sr, 0.015, 0.002, 6000);
  const f0 = [587, 698][v] * rr(0.97, 1.03);
  for (const q of [1, 2.757, 5.404, 8.933, 13.34]) {
    const f = f0 * q * rr(0.99, 1.01);
    if (f > 10000) continue;
    ring(o, e, sr, f, 0.4 * rr(0.8, 1.2) * Math.pow(q, -0.7), rr(0.6, 1) * Math.pow(q, -0.3));
  }
  ring(o, e, sr, f0 * 0.5, 0.03, 0.5);
  return finish(o, sr);
});

// A pane struck but not broken: a hard click and a few stiff high modes.
def('imp_glass', 3, HI, 0.04, () => {
  const sr = HI, o = buf(sr, 0.28);
  const e = burst(sr, 0.005, 0.0006);
  for (let k = 0; k < 6; k++) {
    const f = rlog(1700, 9000);
    ring(o, e, sr, f, rr(0.02, 0.06) * Math.pow(2000 / f, 0.3), rr(0.4, 1));
  }
  ring(o, e, sr, rr(380, 520), 0.012, 0.5);
  mix(o, e, 0, 0.5);
  return finish(o, sr);
});

// Soil and turf absorb the hit: a dead low thump with no ring at all.
def('imp_soft', 3, LO, 0.06, () => {
  const sr = LO, o = buf(sr, 0.32);
  const body = bq(burst(sr, 0.2, rr(0.022, 0.03)), sr, 'lp', rr(400, 540), 0.7);
  mix(o, body, 0, 3);
  ring(o, burst(sr, 0.02, 0.006, 900), sr, rr(60, 85), rr(0.035, 0.045), 0.09);
  const scuff = bq(burst(sr, 0.1, 0.02), sr, 'bp', rr(1200, 2500), 0.8);
  mix(o, scuff, 0.004 * sr, 0.4);
  return finish(o, sr);
});

// Foliage: no thump, just many tiny collisions swelling and dying away.
def('imp_leaf', 3, HI, 0.12, () => {
  const sr = HI, o = buf(sr, 0.42);
  grains(o, sr, 18 + Math.floor(rr(0, 8)), 0.01, 0.3, 1.0, 2500, 7500, 0.006, 0.018, 0.12, 0.5, 0.9);
  const wash = bq(white(Math.floor(sr * 0.36)), sr, 'bp', rr(3000, 4200), 0.7);
  shape(wash, sr, (t) => Math.min(1, t / 0.04) * Math.exp(-t / 0.11));
  mix(o, wash, 0, 0.35);
  return finish(o, sr);
});

// Plaster and drywall: a hollow panel knock under a dry, splitting crack.
def('imp_plaster', 3, LO, 0.03, () => {
  const sr = LO, o = buf(sr, 0.22);
  const e = burst(sr, 0.008, 0.001, 7000);
  modal(o, e, sr, [
    rr(260, 420), rr(0.014, 0.02), 0.8,
    rr(640, 900), rr(0.008, 0.012), 0.6,
    rr(1500, 2300), rr(0.004, 0.006), 0.45,
  ]);
  for (let k = 0, t = 0; k < 3; k++) {
    const c = bq(burst(sr, 0.004, 0.0005), sr, 'bp', rlog(2000, 5200), 1.0);
    mix(o, c, t * sr, 2.2 * (1 - k * 0.25));
    t += rr(0.002, 0.007);
  }
  return finish(o, sr);
});

// ----------------------------------------------------------------- breaks --

// Masonry coming apart: one crack, a low thump, then a cloud of fragments
// knocking against each other, thinning out as they settle, over dust hiss.
def('brk_stone', 4, LO, 0.22, (v) => {
  const sr = LO, o = buf(sr, 0.8);
  mix(o, hp1(burst(sr, 0.02, 0.002), sr, 800), 0, 1.2);
  ring(o, burst(sr, 0.02, 0.004, 2000), sr, rr(75, 115), 0.045, 0.35);
  grains(o, sr, 44 + v * 5, 0.005, 0.62, 1.8, 500, 3600, 0.004, 0.018, 0.7);
  grains(o, sr, 10, 0.02, 0.5, 1.4, 140, 420, 0.015, 0.03, 0.3, 0.5, 1.0);
  const hiss = hp1(white(Math.floor(sr * 0.5)), sr, 3000);
  shape(hiss, sr, (t) => Math.exp(-t / 0.16));
  mix(o, hiss, 0, 0.12);
  return finish(o, sr);
});

// Timber failing: a loud snap, then fibres letting go one after another at
// irregular intervals, over a rough tearing noise.
def('brk_wood', 4, HI, 0.13, () => {
  const sr = HI, o = buf(sr, 0.52);
  const snap = (at, gain, f0) => {
    const e = burst(sr, 0.004, 0.0007);
    modal(o, e, sr, [f0, 0.02, 1, f0 * rr(2.1, 2.8), 0.011, 0.7, f0 * rr(4.2, 5.4), 0.005, 0.45], at * sr, gain);
    mix(o, e, at * sr, gain * 0.7);
  };
  snap(0, 1, rr(420, 600));
  const count = 9 + Math.floor(rr(0, 6));
  for (let k = 0, t = 0.012; k < count; k++) {
    // Exponential gaps: bunched crackle with the odd straggler.
    t += -Math.log(1 - rnd() * 0.98) * 0.022;
    if (t > 0.42) break;
    snap(t, rr(0.2, 0.7) * (1 - t * 1.6), rlog(700, 2400));
  }
  const tear = bq(white(Math.floor(sr * 0.22)), sr, 'bp', rr(1500, 2200), 1.0);
  let spike = 0;
  for (let i = 0; i < tear.length; i++) {
    if (rnd() < 0.004) spike = 1;
    spike *= 0.994;
    tear[i] *= spike * Math.exp(-i / (0.09 * sr));
  }
  mix(o, tear, 0.003 * sr, 0.45);
  return finish(o, sr);
});

// Metal being torn: stick-slip chatter sweeping across a few high-Q modes (a
// shriek), ending in a clang as the piece lets go.
def('brk_metal', 3, HI, 0.3, (v) => {
  const sr = HI, o = buf(sr, 1.05);
  const span = rr(0.26, 0.36);
  const r0 = rr(80, 110), r1 = rr(210, 280);
  const exc = pulses(Math.floor(sr * span), sr, (t) => r0 + (r1 - r0) * Math.sin(Math.PI * t / span), 0.12,
    (t) => Math.sin(Math.PI * Math.min(1, t / span)));
  for (let k = 0; k < 4; k++) ring(o, exc, sr, rlog(900, 3800), rr(0.03, 0.08), rr(0.5, 1) * 0.5);
  const e = burst(sr, 0.01, 0.0012);
  const f0 = [440, 523, 370][v] * rr(0.97, 1.03);
  for (const q of [1, 1.506, 2.756, 3.42, 5.404, 7.61, 8.933]) {
    ring(o, e, sr, f0 * q * rr(0.985, 1.015), 0.5 * rr(0.7, 1.2) * Math.pow(q, -0.5), rr(0.5, 1) * Math.pow(q, -0.25), span * 0.8 * sr);
  }
  return finish(o, sr);
});

// One shard landing: a pair of stiff, very high, fast-dying partials.
function shard(o, sr, at, gain) {
  const f = rlog(3000, 11000);
  const e = burst(sr, 0.002, 0.0003);
  ring(o, e, sr, f, rr(0.01, 0.045) * Math.pow(4000 / f, 0.4), gain, at * sr);
  ring(o, e, sr, f * rr(1.4, 2.6), rr(0.006, 0.02), gain * 0.5, at * sr);
}

// A pane shattering: the crash itself and a first dense wave of shards.
def('brk_glass', 3, HI, 0.2, () => {
  const sr = HI, o = buf(sr, 0.85);
  mix(o, burst(sr, 0.02, 0.0015), 0, 1.0);
  const wash = hp1(white(Math.floor(sr * 0.3)), sr, 3000);
  shape(wash, sr, (t) => Math.exp(-t / 0.05));
  mix(o, wash, 0, 0.35);
  const n = 32 + Math.floor(rr(0, 14));
  for (let k = 0; k < n; k++) {
    const u = rnd();
    shard(o, sr, 0.004 + 0.6 * u * u, rr(0.25, 1) * (1 - 0.6 * u) * 0.5);
  }
  return finish(o, sr);
});

// The shower that follows: shards raining onto the ground over ~0.6 s.
def('tinkle', 4, HI, 0.3, () => {
  const sr = HI, o = buf(sr, 0.78);
  const n = 14 + Math.floor(rr(0, 9));
  for (let k = 0; k < n; k++) shard(o, sr, 0.62 * Math.pow(rnd(), 1.4), rr(0.25, 1));
  return finish(o, sr);
});

def('ping', 3, HI, 0.04, () => {
  const sr = HI, o = buf(sr, 0.2);
  shard(o, sr, 0, 1);
  shard(o, sr, rr(0.01, 0.05), 0.4);
  return finish(o, sr);
});

// Earth thrown up: a soft thump and clods pattering down.
def('brk_soft', 3, LO, 0.15, () => {
  const sr = LO, o = buf(sr, 0.48);
  const body = bq(burst(sr, 0.2, 0.035), sr, 'lp', rr(300, 420), 0.7);
  mix(o, body, 0, 2.0);
  grains(o, sr, 26, 0.01, 0.36, 1.3, 250, 1600, 0.008, 0.025, 0.4, 0.6, 1.0);
  return finish(o, sr);
});

// Plaster crumbling: a run of dry cracks, fine debris, chalk dust.
def('brk_plaster', 3, LO, 0.12, () => {
  const sr = LO, o = buf(sr, 0.48);
  const n = 4 + Math.floor(rr(0, 4));
  for (let k = 0, t = 0; k < n; k++) {
    const c = bq(burst(sr, 0.004, 0.0006), sr, 'bp', rlog(1800, 5200), 1.0);
    mix(o, c, t * sr, 2.2 * (1 - k / n * 0.6));
    t += rr(0.004, 0.016);
  }
  ring(o, burst(sr, 0.01, 0.002, 3000), sr, rr(240, 380), 0.016, 0.25);
  grains(o, sr, 26, 0.01, 0.32, 1.6, 1200, 5200, 0.003, 0.010, 0.5);
  const hiss = hp1(white(Math.floor(sr * 0.35)), sr, 4000);
  shape(hiss, sr, (t) => Math.exp(-t / 0.1));
  mix(o, hiss, 0, 0.12);
  return finish(o, sr);
});

// ------------------------------------------------------------- explosions --

// The pressure wave as felt: a sine dropping 90 -> 30 Hz. Saturation adds
// odd harmonics so the thump still reads on speakers with no sub-bass.
def('exp_sub', 2, LO, 0.3, (v) => {
  const sr = LO, n = Math.floor(sr * 1.3);
  const o = sweep(n, sr, v ? 110 : 90, v ? 36 : 30, 0.09);
  shape(o, sr, (t) => Math.min(1, t / 0.004) * Math.exp(-t / 0.32));
  sat(o, 2.2);
  return finish(o, sr, 0.9, 0.05);
});

// The shock front: a full-band crack, a few milliseconds of energy and a
// short dense tail, driven into saturation like an overloaded ear.
def('exp_crack', 3, HI, 0.06, () => {
  const sr = HI, o = white(Math.floor(sr * 0.45));
  shape(o, sr, (t) => Math.min(1, t / 0.0003) * (0.7 * Math.exp(-t / 0.012) + 0.3 * Math.exp(-t / 0.09)));
  hp1(o, sr, 150);
  bq(o, sr, 'lp', 5200, 0.7);
  sat(o, 2.0);
  return finish(o, sr);
});

// The fireball: broadband roar that darkens as it expands, with slow
// turbulent swells, fading over a couple of seconds.
def('exp_body', 3, LO, 0.7, function* () {
  const sr = LO, n = Math.floor(sr * 2.8);
  const o = brown(n, sr);
  mix(o, pink(n), 0, 1.6);
  hp1(o, sr, 45);
  yield;
  svf(o, sr, 0, (t) => 220 + 2600 * Math.exp(-t / 0.5), 0.7);
  yield;
  const f1 = rr(6, 9), f2 = rr(11, 14), p1 = rr(0, TAU), p2 = rr(0, TAU);
  shape(o, sr, (t) => Math.min(1, t / 0.015) * (0.7 * Math.exp(-t / 0.35) + 0.3 * Math.exp(-t / 1.1))
    * (1 + 0.22 * Math.sin(TAU * f1 * t + p1) + 0.13 * Math.sin(TAU * f2 * t + p2)));
  sat(o, 1.5);
  return finish(o, sr, 0.9, 0.2);
});

// What is left of a blast after a few hundred metres of air: a slow, rolling
// boom with nothing above ~160 Hz.
def('exp_far', 2, LO, 1.1, function* () {
  const sr = LO, n = Math.floor(sr * 3.6);
  const o = pink(n);
  bq(o, sr, 'lp', 160, 0.7);
  bq(o, sr, 'lp', 160, 0.7);
  bq(o, sr, 'hp', 38, 0.7);
  yield;
  const f1 = rr(3, 5), f2 = rr(5.5, 7.5), p1 = rr(0, TAU);
  shape(o, sr, (t) => Math.min(1, t / 0.06) * Math.exp(-t / 1.2) * (1 + 0.3 * Math.sin(TAU * f1 * t + p1) + 0.2 * Math.sin(TAU * f2 * t)));
  return finish(o, sr, 0.9, 0.3);
});

// Ejecta coming back down: nothing for a quarter second, then a patter of
// fragments that peaks and thins out, with a few heavier chunks.
def('exp_debris', 3, LO, 0.9, () => {
  const sr = LO, o = buf(sr, 2.3);
  for (let k = 0; k < 60; k++) {
    const u = Math.pow(rnd(), 1.6);
    const tau = rlog(0.005, 0.025);
    const g = bq(burst(sr, tau * 5, tau), sr, 'bp', rlog(300, 3600), 1.3);
    const a = rnd();
    mix(o, g, (0.25 + 1.9 * u) * sr, (0.2 + 0.8 * a * a) * (1 - 0.7 * u) * 2);
  }
  for (let k = 0; k < 8; k++) {
    ring(o, burst(sr, 0.02, 0.004, 1500), sr, rr(80, 170), rr(0.025, 0.04), rr(0.12, 0.3), (0.3 + 1.3 * rnd()) * sr);
  }
  return finish(o, sr);
});

// Temporary threshold shift: the whine in your ears after a blast too close.
def('ear_ring', 1, LO, 0.9, () => {
  const sr = LO, n = Math.floor(sr * 2.6), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    o[i] = (Math.sin(TAU * 5230 * t) + 0.6 * Math.sin(TAU * 7310 * t) + 0.3 * Math.sin(TAU * 6190 * t))
      * Math.min(1, t / 0.15) * Math.exp(-t / 0.9);
  }
  return finish(o, sr, 0.9, 0.3);
});

// -------------------------------------------------------------- structure --

// Timber under load: stick-slip in a joint, a slow irregular ratchet whose
// rate drifts, driving a few damped formants. The classic door creak.
def('creak_wood', 3, LO, 0.5, () => {
  const sr = LO, len = rr(0.8, 1.05), n = Math.floor(sr * len), o = new Float32Array(n);
  const base = rr(34, 68), wob = rr(0.9, 1.8), ph = rr(0, TAU), glide = rr(-0.4, 0.5);
  const exc = pulses(n, sr, (t) => base * (1 + 0.45 * Math.sin(TAU * wob * t + ph) + glide * t / len), 0.08,
    (t) => Math.min(1, t / 0.06) * Math.min(1, (len - t) / 0.15));
  modal(o, exc, sr, [
    rr(420, 620), rr(0.005, 0.009), 1.0,
    rr(900, 1300), rr(0.004, 0.007), 0.8,
    rr(1700, 2300), rr(0.003, 0.005), 0.55,
    rr(2900, 3500), 0.003, 0.3,
  ]);
  return finish(o, sr, 0.9, 0.05);
});

// Steel under load: the same friction, but the member sings. Slip rate
// wanders across high-Q modes, so partials swell and fade into a howl.
def('creak_metal', 3, LO, 0.7, () => {
  const sr = LO, len = rr(1.3, 1.6), n = Math.floor(sr * len), o = new Float32Array(n);
  const base = rr(55, 95), wob = rr(0.5, 1.6), ph = rr(0, TAU), rise = rr(0.2, 0.9);
  const exc = pulses(n, sr, (t) => base * (1 + 0.3 * Math.sin(TAU * wob * t + ph) + rise * t / len), 0.03,
    (t) => Math.min(1, t / 0.12) * Math.min(1, (len - t) / 0.3));
  for (let k = 0; k < 6; k++) {
    ring(o, exc, sr, rlog(180, 2800), rr(0.05, 0.15), rr(0.4, 1));
  }
  return finish(o, sr, 0.9, 0.08);
});

// Concrete under load has no voice of its own: it grinds. Low band-passed
// noise whose pitch wobbles, with aggregate ticking as micro-cracks open.
def('creak_stone', 3, LO, 0.6, () => {
  const sr = LO, len = rr(1.0, 1.3), n = Math.floor(sr * len);
  const o = brown(n, sr);
  const c = rr(150, 240), w1 = rr(1.2, 2.6), w2 = rr(4, 7), p1 = rr(0, TAU);
  svf(o, sr, 1, (t) => c * (1 + 0.35 * Math.sin(TAU * w1 * t + p1) + 0.12 * Math.sin(TAU * w2 * t)), 3);
  let am = 0;
  for (let i = 0; i < n; i++) {
    // Grinding is bursty: a random, slowly varying gate.
    am += (rnd() < 0.002 ? rr(0.3, 1) - am : 0) + (0.55 - am) * 0.0006;
    const t = i / sr;
    o[i] *= am * Math.min(1, t / 0.1) * Math.min(1, (len - t) / 0.3) * 6;
  }
  grains(o, sr, 7, 0.1, len - 0.3, 1.0, 900, 3200, 0.002, 0.006, 0.05, 0.2);
  return finish(o, sr, 0.9, 0.1);
});

// A bond letting go in masonry: one sharp crack with a little body.
def('crack_stone', 3, HI, 0.04, () => {
  const sr = HI, o = buf(sr, 0.3);
  mix(o, hp1(burst(sr, 0.012, 0.0008), sr, 600), 0, 1.4);
  const e = burst(sr, 0.01, 0.002, 3000);
  ring(o, e, sr, rr(110, 160), 0.022, 0.25);
  ring(o, e, sr, rr(900, 1500), 0.004, 1.2);
  grains(o, sr, 5, 0.008, 0.08, 1.5, 1200, 4000, 0.002, 0.006, 0.2);
  return finish(o, sr);
});

def('crack_wood', 3, HI, 0.04, () => {
  const sr = HI, o = buf(sr, 0.3);
  const snap = (at, gain) => {
    const e = burst(sr, 0.004, 0.0005);
    modal(o, e, sr, [rr(500, 700), 0.015, 1, rr(1100, 1600), 0.008, 0.8, rr(2400, 3300), 0.004, 0.5], at * sr, gain);
    mix(o, e, at * sr, gain * 0.9);
  };
  snap(0, 1);
  snap(rr(0.015, 0.04), 0.4);
  return finish(o, sr);
});

// A weld or bolt shearing: a snap and a high ring.
def('crack_metal', 2, HI, 0.12, () => {
  const sr = HI, o = buf(sr, 0.55);
  const e = burst(sr, 0.004, 0.0004);
  mix(o, e, 0, 1.2);
  for (let k = 0; k < 4; k++) ring(o, e, sr, rlog(1200, 6200), rr(0.1, 0.3), rr(0.4, 0.9));
  ring(o, e, sr, rr(240, 380), 0.03, 0.6);
  return finish(o, sr);
});

// A chunk tearing free: cracks that speed up as the rip runs, then stop,
// over the low grumble of the faces dragging apart.
def('tear', 3, LO, 0.25, () => {
  const sr = LO, o = buf(sr, 0.85);
  const count = 11 + Math.floor(rr(0, 6));
  let t = 0, gap = rr(0.05, 0.07);
  for (let k = 0; k < count && t < 0.6; k++) {
    const e = burst(sr, 0.006, rr(0.0006, 0.0015));
    const f = rlog(300, 2600);
    ring(o, e, sr, f, rr(0.004, 0.012), 0.8, t * sr);
    ring(o, e, sr, rr(90, 160), 0.02, 0.5, t * sr);
    mix(o, hp1(e, sr, 500), t * sr, rr(0.5, 1));
    t += gap * rr(0.6, 1.4);
    gap = Math.max(0.012, gap * 0.82);
  }
  const rip = bq(brown(Math.floor(sr * 0.7), sr), sr, 'bp', rr(260, 560), 0.8);
  shape(rip, sr, (s) => Math.sin(Math.PI * Math.min(1, s / 0.7)) ** 2);
  mix(o, rip, 0, 5);
  return finish(o, sr, 0.9, 0.05);
});

// Mass meeting ground: a dropping sub thud, low rumble, settling grit. Used
// under heavy impacts and detaching chunks.
def('rumble_hit', 3, LO, 0.4, () => {
  const sr = LO, n = Math.floor(sr * 1.5);
  const o = sweep(n, sr, rr(78, 92), rr(42, 50), 0.16);
  shape(o, sr, (t) => Math.min(1, t / 0.003) * Math.exp(-t / 0.22));
  sat(o, 2.0);
  const r = bq(pink(n), sr, 'lp', 190, 0.7);
  bq(r, sr, 'hp', 40, 0.7);
  shape(r, sr, (t) => Math.min(1, t / 0.01) * Math.exp(-t / 0.45));
  mix(o, r, 0, 2.5);
  grains(o, sr, 12, 0.03, 0.9, 1.4, 150, 900, 0.01, 0.03, 0.06, 0.6, 1.0);
  return finish(o, sr, 0.9, 0.1);
});

// ----------------------------------------------------------------- player --

def('step_hard', 4, LO, 0.03, () => {
  const sr = LO, o = buf(sr, 0.17);
  const e = burst(sr, 0.01, 0.002, 3000);
  modal(o, e, sr, [rr(130, 180), 0.018, 0.6, rr(700, 1100), 0.005, 0.5, rr(1900, 2600), 0.003, 0.25]);
  const scuff = bq(white(Math.floor(sr * 0.1)), sr, 'bp', rr(2500, 4500), 0.8);
  shape(scuff, sr, (t) => Math.min(1, t / 0.01) * Math.exp(-t / 0.03));
  mix(o, scuff, rr(0.012, 0.022) * sr, 0.25);
  return finish(o, sr);
});

def('step_wood', 3, LO, 0.04, () => {
  const sr = LO, o = buf(sr, 0.22);
  const e = burst(sr, 0.012, 0.003, 2200);
  modal(o, e, sr, [rr(110, 150), 0.035, 0.9, rr(280, 380), 0.02, 0.6, rr(620, 800), 0.01, 0.3]);
  mix(o, bq(burst(sr, 0.005, 0.001), sr, 'bp', rr(1800, 2600), 1.0), 0, 0.5);
  return finish(o, sr);
});

def('step_metal', 3, LO, 0.06, () => {
  const sr = LO, o = buf(sr, 0.32);
  const e = burst(sr, 0.008, 0.0015, 5000);
  for (let k = 0; k < 5; k++) ring(o, e, sr, rlog(300, 2800), rr(0.03, 0.07), rr(0.3, 0.8));
  ring(o, e, sr, rr(110, 140), 0.025, 0.9);
  return finish(o, sr);
});

def('step_soft', 4, LO, 0.05, () => {
  const sr = LO, o = buf(sr, 0.24);
  const body = bq(burst(sr, 0.15, 0.03), sr, 'lp', rr(260, 340), 0.7);
  mix(o, body, 0, 2);
  grains(o, sr, 10, 0.004, 0.09, 1.0, 1500, 5000, 0.004, 0.010, 0.07, 0.4, 0.9);
  return finish(o, sr);
});

def('step_gravel', 3, LO, 0.05, () => {
  const sr = LO, o = buf(sr, 0.26);
  grains(o, sr, 22, 0.002, 0.11, 1.0, 1000, 6000, 0.002, 0.007, 0.12, 0.4);
  const body = bq(burst(sr, 0.1, 0.02), sr, 'lp', 300, 0.7);
  mix(o, body, 0, 0.9);
  return finish(o, sr);
});

// ------------------------------------------------------------------ tools --

// Air displaced by a swing: band-passed noise whose centre rises and falls.
def('whoosh', 2, LO, 0.1, () => {
  const sr = LO, len = 0.26, o = white(Math.floor(sr * len));
  const top = rr(2000, 2800);
  svf(o, sr, 1, (t) => 500 + (top - 500) * Math.sin(Math.PI * t / len) ** 2, 1.2);
  shape(o, sr, (t) => Math.sin(Math.PI * Math.pow(t / len, 0.8)) ** 2);
  return finish(o, sr);
});

// The hammer itself: handle thunk and the head's short metallic tick.
def('hammer_hit', 2, LO, 0.03, () => {
  const sr = LO, o = buf(sr, 0.2);
  const e = burst(sr, 0.008, 0.0015, 5000);
  modal(o, e, sr, [rr(200, 300), 0.02, 1, rr(1800, 2600), 0.012, 0.5, rr(3400, 4600), 0.006, 0.3]);
  mix(o, e, 0, 0.6);
  return finish(o, sr);
});

// Gunshots: muzzle crack, a mid body, a chest thump and a short noise tail.
function* gun(sr, len, crackTau, bodyLp, bodyTau, bodyGain, f0, f1, thumpTau, tailTau, drive) {
  const n = Math.floor(sr * len);
  const o = white(n);
  shape(o, sr, (t) => Math.min(1, t / 0.0002) * Math.exp(-t / crackTau));
  const body = bq(white(n), sr, 'lp', bodyLp, 0.8);
  hp1(body, sr, 200);
  shape(body, sr, (t) => Math.exp(-t / bodyTau));
  mix(o, body, 0, bodyGain);
  yield;
  const th = sweep(n, sr, f0, f1, thumpTau * 0.6);
  shape(th, sr, (t) => Math.exp(-t / thumpTau));
  mix(o, th, 0, 0.3);
  const tail = bq(white(n), sr, 'lp', 1200, 0.7);
  shape(tail, sr, (t) => Math.exp(-t / tailTau));
  mix(o, tail, 0, 0.3);
  sat(o, drive);
  return finish(o, sr, 0.9, 0.05);
}
def('rifle', 3, HI, 0.06, () => gun(HI, 0.55, rr(0.003, 0.005), rr(3400, 4400), 0.05, 0.6, rr(150, 175), 55, 0.06, 0.18, 3));
def('shotgun', 2, HI, 0.12, () => gun(HI, 0.8, rr(0.006, 0.008), rr(2100, 2700), 0.11, 0.9, rr(115, 130), 40, 0.12, 0.3, 3));

// Rocket leaving the tube: ignition pop, a rising hiss that falls away as it
// goes, and fluttering low thrust.
def('rocket', 2, LO, 0.4, function* () {
  const sr = LO, n = Math.floor(sr * 1.1);
  const o = white(n);
  const top = rr(1600, 2100);
  svf(o, sr, 1, (t) => (t < 0.25 ? 300 + (top - 300) * (t / 0.25) : 700 + (top - 700) * Math.exp(-(t - 0.25) / 0.3)), 0.9);
  shape(o, sr, (t) => Math.min(1, t / 0.03) * Math.exp(-Math.max(0, t - 0.2) / 0.4));
  yield;
  const thrust = bq(brown(n, sr), sr, 'lp', 220, 0.7);
  const fl = rr(30, 50);
  shape(thrust, sr, (t) => Math.min(1, t / 0.02) * Math.exp(-t / 0.5) * (0.7 + 0.3 * Math.sin(TAU * fl * t)));
  mix(o, thrust, 0, 0.8);
  const pop = burst(sr, 0.03, 0.004);
  mix(o, pop, 0, 0.5);
  return finish(o, sr, 0.9, 0.1);
});

// Charge armed: two rising tones, slightly buzzy like a piezo.
def('beep', 1, HI, 0.08, () => {
  const sr = HI, o = buf(sr, 0.24);
  const tone = (at, len, f) => {
    for (let i = 0, m = Math.floor(len * sr); i < m; i++) {
      const t = i / sr, edge = Math.min(1, t / 0.004, (len - t) / 0.004);
      o[Math.floor(at * sr) + i] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 3 * f * t)) * edge;
    }
  };
  tone(0.005, 0.07, 1760);
  tone(0.105, 0.09, 2349);
  mix(o, bq(burst(sr, 0.004, 0.0008), sr, 'bp', 3000, 1), 0, 2);
  return finish(o, sr);
});

// Gravity gun: an FM hum whose pitch slides up (grab) or down (throw).
def('grav', 2, LO, 0.12, (v) => {
  const sr = LO, n = Math.floor(sr * 0.42), o = new Float32Array(n);
  const fa = v ? 240 : 90, fb = v ? 90 : 240;
  let ph = 0, pm = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr, f = fb + (fa - fb) * Math.exp(-t / 0.08);
    ph += TAU * f / sr;
    pm += TAU * f * 2.01 / sr;
    o[i] = Math.sin(ph + 2.5 * Math.exp(-t / 0.1) * Math.sin(pm)) * (0.75 + 0.25 * Math.sin(TAU * 28 * t))
      * Math.min(1, t / 0.01) * Math.exp(-t / 0.12);
  }
  const air = bq(white(n), sr, 'bp', 2000, 1.5);
  shape(air, sr, (t) => Math.min(1, t / 0.02) * Math.exp(-t / 0.08));
  mix(o, air, 0, 0.12);
  return finish(o, sr);
});

def('cannon', 2, LO, 0.2, function* () {
  const sr = LO, n = Math.floor(sr * 1.1);
  const o = sweep(n, sr, rr(95, 110), 34, 0.09);
  shape(o, sr, (t) => Math.min(1, t / 0.002) * Math.exp(-t / 0.22));
  const crack = lp1(white(n), sr, 3500);
  shape(crack, sr, (t) => Math.exp(-t / 0.009));
  mix(o, crack, 0, 1.2);
  yield;
  const body = bq(white(n), sr, 'lp', 900, 0.8);
  shape(body, sr, (t) => Math.exp(-t / 0.16));
  mix(o, body, 0, 2.2);
  sat(o, 2.5);
  return finish(o, sr, 0.9, 0.08);
});

// Spawner: a soft rising blip.
def('pop', 2, LO, 0.04, () => {
  const sr = LO, n = Math.floor(sr * 0.15), o = new Float32Array(n);
  const f0 = rr(280, 340), f1 = rr(820, 980);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    ph += TAU * (f0 + (f1 - f0) * Math.min(1, t / 0.06)) / sr;
    o[i] = Math.sin(ph) * Math.min(1, t / 0.003) * Math.exp(-t / 0.035);
  }
  return finish(o, sr);
});

// Fire catching: a soft whoomp of displaced air, then the first crackles.
def('ignite', 2, LO, 0.3, () => {
  const sr = LO, n = Math.floor(sr * 0.95);
  const o = pink(n);
  svf(o, sr, 0, (t) => 300 + 1200 * Math.sin(Math.PI * Math.min(1, t / 0.5)), 0.8);
  shape(o, sr, (t) => Math.min(1, t / 0.08) * Math.exp(-Math.max(0, t - 0.08) / 0.3));
  for (let k = 0; k < 20; k++) {
    const c = hp1(burst(sr, 0.003, 0.0006), sr, 2000);
    mix(o, c, (0.15 + 0.7 * rnd()) * sr, rr(0.05, 0.25));
  }
  return finish(o, sr, 0.9, 0.05);
});

// --------------------------------------------------------------- ambience --

def('loop_brown', 1, LO, 1, () => {
  const sr = LO;
  return finish(loopable(brown(Math.floor(sr * 3.4), sr), sr, 0.4), sr, 0.9, 0);
});

def('loop_pink', 1, LO, 1, () => {
  const sr = LO;
  return finish(loopable(pink(Math.floor(sr * 2.9)), sr, 0.4), sr, 0.9, 0);
});

// Something burning: a low fluttering roar, and over it the snaps of wood
// and sap, sharp clicks at random moments, mostly small, the odd loud one.
def('loop_fire', 1, LO, 1, function* () {
  const sr = LO, len = 5.3, xf = 0.4;
  const n = Math.floor(sr * (len + xf));
  const o = bq(brown(n, sr), sr, 'lp', 650, 0.7);
  yield;
  const hiss = bq(white(n), sr, 'bp', 2800, 0.5);
  yield;
  // The flames lick: a level that wanders, a new target a few times a second.
  let am = 1, target = 1;
  for (let i = 0; i < n; i++) {
    if ((i & 4095) === 0) target = rr(0.45, 1.3);
    am += (target - am) * 0.0006;
    o[i] = (o[i] * 0.45 + hiss[i] * 0.06) * am;
  }
  yield;
  for (let t = 0, k = 0; ; k++) {
    // Exponential gaps, about 24 snaps a second.
    t += -Math.log(1 - rnd() * 0.999) / 24;
    if (t >= len + xf) break;
    if (k % 48 === 47) yield;
    const big = rnd();
    const snap = bq(burst(sr, 0.006, rlog(0.0004, 0.0016)), sr, 'bp', rlog(1200, 6500), 1.2);
    mix(o, snap, t * sr, 0.3 + 2.2 * big * big * big);
  }
  yield;
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// Wind: a long stereo loop with the gusting baked in, so at run time it is
// one looping source and no modulators. Pink noise through a band-pass whose
// centre and level drift under sines with whole numbers of cycles per loop
// (seamless), mutually prime so the pattern does not read as periodic. The
// two channels share part of their noise: wide, but not two separate winds.
// Nothing above ~2.5 kHz, hence the low rate.
def('loop_wind', 1, WIND, 1, function* () {
  const sr = WIND, len = 16, xf = 0.5;
  const n = Math.floor(sr * (len + xf));
  const common = pink(n);
  yield;
  const w = TAU / len;
  const out = [];
  for (let ch = 0; ch < 2; ch++) {
    const x = pink(n);
    yield;
    for (let i = 0; i < n; i++) x[i] = 0.8 * x[i] + 0.6 * common[i];
    yield;
    const p1 = rr(0, TAU), p2 = rr(0, TAU), p3 = rr(0, TAU);
    svf(x, sr, 1, (t) => 420 + 130 * Math.sin(w * t + p1) + 90 * Math.sin(3 * w * t + p2) + 50 * Math.sin(7 * w * t + p3), 0.45);
    yield;
    lp1(x, sr, 2500);
    yield;
    // Gusts are slower than a cycle a second: the envelope is worked out
    // every 64 samples and interpolated.
    const g1 = rr(0, TAU), g2 = rr(0, TAU);
    const gust = (i) => 1 + 0.35 * Math.sin(2 * w * i / sr + g1) + 0.22 * Math.sin(5 * w * i / sr + g2);
    for (let i = 0; i < n; i += 64) {
      const a = gust(i), step = (gust(i + 64) - a) / 64;
      const end = Math.min(n, i + 64);
      for (let j = i; j < end; j++) x[j] *= a + step * (j - i);
    }
    yield;
    out.push(loopable(x, sr, xf));
    yield;
  }
  // One gain for both channels, or the stereo image would tilt.
  // (In a function of its own, as every long loop of a recipe in steps
  // should be: a loop in the body of a generator runs in the interpreter to
  // its end the one time a page runs it, and this one took 40 to 100 ms.)
  const level = () => {
    let pk = 0;
    for (const x of out) for (let i = 0; i < x.length; i++) pk = Math.max(pk, Math.abs(x[i]));
    for (const x of out) for (let i = 0; i < x.length; i++) x[i] *= 0.9 / pk;
  };
  level();
  return out;
});

// Distant small birds: short whistled notes with pitch slides. Five phrases.
def('bird', 5, HI, 0.3, (v) => {
  const sr = HI, o = buf(sr, 0.95);
  const note = (at, len, fa, fb, vib = 0) => {
    let ph = 0;
    for (let i = 0, m = Math.floor(len * sr); i < m; i++) {
      const u = i / m;
      const f = fa + (fb - fa) * u + vib * Math.sin(TAU * 28 * u * len);
      ph += TAU * f / sr;
      o[Math.floor(at * sr) + i] += (Math.sin(ph) + 0.15 * Math.sin(2 * ph)) * Math.sin(Math.PI * u) ** 2;
    }
  };
  const k = rr(0.9, 1.12);
  if (v === 0) for (let i = 0; i < 3; i++) note(i * 0.15, 0.085, 4200 * k, 3200 * k);
  else if (v === 1) for (let i = 0; i < 8; i++) note(i * 0.05, 0.035, (i & 1 ? 4400 : 5200) * k, (i & 1 ? 4300 : 5000) * k);
  else if (v === 2) { note(0, 0.22, 3900 * k, 3850 * k, 40); note(0.3, 0.28, 3300 * k, 3250 * k, 40); }
  else if (v === 3) for (let i = 0; i < 2; i++) note(i * 0.26, 0.16, 2800 * k, 4600 * k);
  else for (let i = 0, t = 0; i < 6; i++) { note(t, 0.045, rr(3600, 5600), rr(3600, 5600)); t += rr(0.06, 0.13); }
  return finish(o, sr);
});

// ----------------------------------------------------------------- reverb --

// Impulse responses for the ConvolverNode, as [left, right]: the space
// without the direct sound. Discrete early echoes, then exponentially
// decaying noise whose top end dies first (air and soft surfaces eat the
// highs). Nothing below ~150 Hz: reverberant bass is mud.
//
// Scaled to unit gain for mid-band noise (300 Hz - 2 kHz), which is where
// impacts live. A send of s therefore puts s^2 of a sound's energy into the
// space: 0.2 is a reverberant-to-direct ratio of -14 dB.
function* impulse(sr, len, t60lo, t60hi, split, top, pre, early, echoes) {
  const n = Math.floor(sr * len);
  const energy = (x) => { let e = 0; for (let i = 0; i < x.length; i++) e += x[i] * x[i]; return e; };
  const out = [];
  let power = 0;
  for (let ch = 0; ch < 2; ch++) {
    const src = bq(white(n), sr, 'hp', 150, 0.7);
    yield;
    const lo = bq(src.slice(), sr, 'lp', split, 0.7);
    const hi = bq(bq(src, sr, 'hp', split, 0.7), sr, 'lp', top, 0.7);
    yield;
    const klo = Math.log(1000) / t60lo, khi = Math.log(1000) / t60hi;
    const x = new Float32Array(n);
    const np = Math.floor(pre * sr);
    // (A function of its own: see loop_wind's last step.)
    const late = () => {
      for (let i = np; i < n; i++) {
        const t = (i - np) / sr;
        // The late field builds up over the first 30 ms, it does not start full.
        const build = Math.min(1, t / 0.03);
        x[i] = (lo[i] * Math.exp(-klo * t) + hi[i] * Math.exp(-khi * t)) * build;
      }
    };
    late();
    yield;
    const taps = new Float32Array(n);
    for (const [time, gain, bias] of echoes) {
      // A reflection off a facade: a short band-limited tap, louder on the
      // side it comes from.
      const tap = bq(bq(burst(sr, 0.006, 0.0008), sr, 'lp', top, 0.7), sr, 'hp', 200, 0.7);
      mix(taps, tap, (time * rr(0.96, 1.04)) * sr, gain * (ch === 0 ? 1 - bias : 1 + bias));
    }
    yield;
    // `early` is the share of the energy that arrives as discrete echoes.
    mix(x, taps, 0, Math.sqrt(early / (1 - early) * energy(x) / energy(taps)));
    const nf = Math.floor(sr * 0.05);
    for (let i = 0; i < nf; i++) x[n - 1 - i] *= i / nf;
    yield;
    const g = bandGain(x, sr, 300, 2000);
    power += g * g / 2;
    out.push(x);
    yield;
  }
  const k = 1 / Math.sqrt(power);
  const scale = () => { for (const x of out) for (let i = 0; i < n; i++) x[i] *= k; };
  scale();
  return out;
}

// Open street between buildings: slapback from facades 10-60 m away, then a
// tail of about 1.3 s that goes dark quickly.
def('ir_outdoor', 1, HI, 1, () => impulse(HI, 1.25, 1.35, 0.6, 900, 4000, 0.012, 0.35,
  [[0.058, 0.5, 0.35], [0.097, 0.42, -0.4], [0.163, 0.3, 0.25], [0.241, 0.2, -0.3], [0.37, 0.1, 0.1]]));

// A room: dense early reflections, short bright tail.
def('ir_indoor', 1, HI, 1, () => impulse(HI, 0.5, 0.42, 0.3, 1500, 7000, 0.003, 0.5,
  [[0.007, 0.6, 0.3], [0.011, 0.5, -0.3], [0.017, 0.45, 0.2], [0.023, 0.35, -0.2], [0.031, 0.25, 0.1]]));

// Everything from here on came after the first bank. It is defined after
// it, not among it: a sound's samples are seeded by its place in this file,
// and a recording made before must render to the same samples after.
//
// How many sounds the first bank had: the time those take to render is the
// measure of a machine's speed (audio.js: SLOW_BANK_MS), which must not
// move every time a sound is added.
const firstBank = defs.length;

// --------------------------------------------------------------- ordnance --

// A bomb on its way down, as it is heard on the ground it is aimed at: a
// whistle whose pitch falls, slowly at first and then faster, and whose
// level climbs all the way (it is coming closer), with the air it tears
// through hissing in a band around the tone. It does not die away: it is
// cut off, by the blast. The director plays it so that its last sample
// lands when the blast is heard, so the length matters and is fixed.
function* whistle(sr, len) {
  const n = Math.floor(sr * len), o = new Float32Array(n);
  const f0 = rr(2500, 2900), f1 = rr(640, 760);
  const fAt = (t) => f0 * Math.pow(f1 / f0, Math.pow(t / len, 1.7));
  // Fins never fly quite true: a slow wander in pitch, a flutter in level.
  const wob = rr(5, 8), wp = rr(0, TAU), flut = rr(38, 55);
  // (In stretches of a quarter second, so that no stage is long: see
  // renderSteps. The pitch moves slowly enough to be worked out every 32
  // samples and held.)
  let ph = 0, w = 0;
  const chunk = sr >> 2;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    if ((i & 31) === 0) w = TAU * fAt(t) * (1 + 0.006 * Math.sin(TAU * wob * t + wp)) / sr;
    ph += w;
    o[i] = (Math.sin(ph) + 0.22 * Math.sin(2 * ph + 0.5) + 0.08 * Math.sin(3 * ph)) * (1 + 0.12 * Math.sin(TAU * flut * t));
    if (i % chunk === chunk - 1) yield;
  }
  const air = white(n);
  yield;
  svf(air, sr, 1, (t) => 1.6 * fAt(t), 2.5);
  mix(o, air, 0, 0.5);
  yield;
  for (let i = 0; i < n; i++) {
    const t = i / sr, u = t / len;
    o[i] *= Math.min(1, t / 0.12) * (0.1 + 0.9 * u * u) * Math.min(1, (len - t) / 0.008);
  }
  return finish(o, sr, 0.9, 0.004);
}
// (tau: it gets louder, not quieter; a long one keeps the mixer from
// counting it among the quiet voices and taking it for something else.)
def('whistle', 3, LO, 4, () => whistle(LO, 2.4));
// The same for a bomb that is nearly there.
def('whistle_short', 2, LO, 4, () => whistle(LO, 1.15));

// Satchel thrown: the pack swung on its strap (a heavier, lower rush of air
// than a hammer's), the canvas flapping as it leaves the hand, buckles, and
// the fuse: the igniter's snap and a spitting hiss that goes away with it.
def('satchel_throw', 3, LO, 0.15, () => {
  const sr = LO, len = 0.8, n = Math.floor(sr * len);
  const o = white(n);
  const top = rr(700, 950), swing = 0.34;
  svf(o, sr, 1, (t) => 220 + (top - 220) * Math.sin(Math.PI * Math.min(1, t / swing)) ** 2, 1.0);
  shape(o, sr, (t) => (t < swing ? Math.sin(Math.PI * Math.pow(t / swing, 0.7)) ** 2 : 0));
  const flap = bq(burst(sr, 0.05, 0.012), sr, 'lp', rr(500, 700), 0.8);
  mix(o, flap, 0.19 * sr, 1.6);
  for (let k = 0; k < 3; k++) {
    ring(o, burst(sr, 0.003, 0.0006), sr, rlog(2600, 5200), rr(0.008, 0.02), rr(0.15, 0.35), (0.12 + 0.2 * rnd()) * sr);
  }
  mix(o, hp1(burst(sr, 0.004, 0.0007), sr, 2500), 0.03 * sr, 0.7);
  const fizz = hp1(white(n), sr, 3500);
  let am = 0;
  for (let i = 0; i < n; i++) {
    if (rnd() < 0.01) am = rr(0.3, 1);
    am *= 0.9985;
    const t = i / sr;
    fizz[i] *= t < 0.04 ? 0 : am * Math.exp(-(t - 0.04) / 0.28);
  }
  mix(o, fizz, 0, 0.35);
  return finish(o, sr);
});

// Breaching charge set: the frame slapped flat against the wall, two catches
// snapping shut, and three even pips as it arms: lower and drier than the
// cutting charge's two rising tones, so the two can be told apart unseen.
def('breach_set', 2, HI, 0.06, () => {
  const sr = HI, o = buf(sr, 0.62);
  const e = burst(sr, 0.012, 0.003, 2500);
  modal(o, e, sr, [rr(95, 130), 0.04, 0.9, rr(240, 330), 0.022, 0.7, rr(620, 820), 0.01, 0.4]);
  for (const at of [0, rr(0.05, 0.075)]) {
    const c = burst(sr, 0.003, 0.0005);
    ring(o, c, sr, rlog(2800, 4800), rr(0.006, 0.012), 0.9, at * sr);
    mix(o, hp1(c, sr, 1500), at * sr, 0.6);
  }
  const pip = (at, len, f) => {
    for (let i = 0, m = Math.floor(len * sr); i < m; i++) {
      const t = i / sr, edge = Math.min(1, t / 0.003, (len - t) / 0.003);
      o[Math.floor(at * sr) + i] += 0.5 * (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2 * f * t)) * edge;
    }
  };
  for (let k = 0; k < 3; k++) pip(0.16 + 0.09 * k, 0.045, 1320);
  return finish(o, sr);
});

// Air strike called: the handset. A key click, two tones going up (heard and
// understood), the carrier's hiss under them and the burst of noise as the
// key is let go, all through a speaker the size of a coin.
def('radio', 2, LO, 0.1, () => {
  const sr = LO, len = 0.5, n = Math.floor(sr * len), o = new Float32Array(n);
  mix(o, burst(sr, 0.004, 0.0008), 0, 0.8);
  const tone = (at, dur, f) => {
    for (let i = 0, m = Math.floor(dur * sr); i < m; i++) {
      const t = i / sr, edge = Math.min(1, t / 0.004, (dur - t) / 0.004);
      o[Math.floor(at * sr) + i] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 3 * f * t)) * edge;
    }
  };
  const k = rr(0.97, 1.03);
  tone(0.03, 0.09, 980 * k);
  tone(0.14, 0.12, 1310 * k);
  const hiss = white(n);
  shape(hiss, sr, (t) => (t < 0.3 ? 0.12 : t < 0.42 ? 0.6 - 1.5 * (t - 0.3) : 0));
  mix(o, hiss, 0, 1);
  bq(o, sr, 'hp', 420, 0.8);
  bq(o, sr, 'lp', 2900, 0.9);
  sat(o, 2);
  return finish(o, sr);
});

// The marker a strike is called on: a flare catching with a pop and then
// burning fiercely, a spitting hiss over a little low roar, for as long as
// the bombs take to come.
def('flare', 2, LO, 2, function* () {
  const sr = LO, len = 2.7, n = Math.floor(sr * len);
  const o = white(n);
  bq(o, sr, 'bp', rr(3800, 4600), 0.6);
  hp1(o, sr, 1200);
  yield;
  const env = (t) => Math.min(1, t / 0.05) * Math.min(1, (len - t) / 0.5);
  let am = 1, target = 1;
  for (let i = 0; i < n; i++) {
    if ((i & 255) === 0) target = rr(0.35, 1.25);
    am += (target - am) * 0.01;
    o[i] *= am * env(i / sr);
  }
  yield;
  const low = bq(brown(n, sr), sr, 'lp', 500, 0.7);
  shape(low, sr, env);
  mix(o, low, 0, 0.5);
  mix(o, burst(sr, 0.03, 0.006, 3000), 0, 2.5);
  return finish(o, sr, 0.9, 0.05);
});

// What a blast too close leaves in the ears: a few high tones that do not
// belong together, two of them a few hertz apart so the whine swims. One
// second, every partial a whole number of cycles: it loops without a seam,
// for as long as the engine says the ears ring (`ev::CONCUSSION`).
def('loop_ring', 1, LO, 1, () => {
  const sr = LO, n = sr, o = new Float32Array(n);
  const parts = [5233, 1, 5236, 0.5, 7311, 0.55, 6187, 0.3, 3951, 0.2];
  for (let k = 0; k < parts.length; k += 2) {
    const w = TAU * parts[k] / sr, a = parts[k + 1], p0 = rr(0, TAU);
    for (let i = 0; i < n; i++) o[i] += a * Math.sin(w * i + p0);
  }
  return finish(o, sr, 0.9, 0);
});

// ------------------------------------------------------------------ score --
// The game speaking (Mayhem's `ev::SCORE`): small dry sounds in the head,
// not in the street. One voice for all of them, a struck bar (the partials
// of a free bar, 1 : 2.76 : 5.4, the upper ones dying fast), so that they
// read as one instrument and as nothing the world could have made.

function bar(o, sr, at, f, tau, amp) {
  const e = burst(sr, 0.004, 0.0009, 6000);
  ring(o, e, sr, f, tau, amp, at * sr);
  ring(o, e, sr, f * 2.76, tau * 0.35, amp * 0.35, at * sr);
  ring(o, e, sr, f * 5.4, tau * 0.15, amp * 0.15, at * sr);
}

// A link in the chain. Played higher with every step of the multiplier.
def('score_link', 1, HI, 0.08, () => {
  const sr = HI, o = buf(sr, 0.4);
  bar(o, sr, 0, 880, 0.08, 1);
  return finish(o, sr);
});

// A structure is going: two notes a fifth apart, the low one first.
def('score_going', 1, LO, 0.15, () => {
  const sr = LO, o = buf(sr, 0.7);
  bar(o, sr, 0, 392, 0.14, 1);
  bar(o, sr, 0.09, 587.3, 0.2, 0.9);
  return finish(o, sr);
});

// A structure is down: a low knock and a major chord run up from it.
def('score_down', 1, LO, 0.3, () => {
  const sr = LO, o = buf(sr, 1.2);
  ring(o, burst(sr, 0.02, 0.006, 1200), sr, 98, 0.09, 1.2);
  const notes = [523.3, 659.3, 784, 1046.5];
  for (let k = 0; k < notes.length; k++) bar(o, sr, 0.02 + 0.055 * k, notes[k], 0.22 + 0.05 * k, 0.8);
  return finish(o, sr);
});

// The clock in its last seconds: a dry tick (the bar, damped), and for the
// last three a higher one struck twice.
def('clock_tick', 2, HI, 0.03, (v) => {
  const sr = HI, o = buf(sr, 0.2);
  bar(o, sr, 0, v ? 1568 : 1046.5, 0.025, 1);
  if (v) bar(o, sr, 0.07, 1568, 0.025, 0.8);
  return finish(o, sr);
});

// Time is up: a horn, two reeds a little apart so it beats, cut off square.
def('score_time', 1, LO, 0.4, () => {
  const sr = LO, len = 0.7, n = Math.floor(sr * len), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let v = 0;
    // Odd harmonics, falling off: a reed.
    for (let h = 1; h <= 9; h += 2) v += (Math.sin(TAU * 196 * h * t) + Math.sin(TAU * 197.5 * h * t)) / h;
    o[i] = v * Math.min(1, t / 0.015) * Math.min(1, (len - t) / 0.03);
  }
  bq(o, sr, 'lp', 2400, 0.7);
  return finish(o, sr);
});

// The score is final, by medal: none (two notes falling), bronze, silver,
// gold (two, three, four notes rising, the last one held; gold shimmers).
def('score_final', 4, LO, 0.5, (v) => {
  const sr = LO, o = buf(sr, 2.0);
  const up = [523.3, 659.3, 784, 1046.5];
  if (v === 0) {
    bar(o, sr, 0, 440, 0.18, 1);
    bar(o, sr, 0.16, 370, 0.3, 1);
  } else {
    const n = v + 1;
    for (let k = 0; k < n; k++) bar(o, sr, 0.11 * k, up[k], k === n - 1 ? 0.5 : 0.16, 1);
    if (v === 3) for (let k = 0; k < 6; k++) bar(o, sr, 0.36 + 0.05 * k, up[k % 4] * 2, 0.12, 0.25);
  }
  return finish(o, sr);
});

// A strike earned: the handset again, three pips going up.
def('score_strike', 1, LO, 0.1, () => {
  const sr = LO, len = 0.5, n = Math.floor(sr * len), o = new Float32Array(n);
  mix(o, burst(sr, 0.004, 0.0008), 0, 0.8);
  [880, 1108.7, 1318.5].forEach((f, k) => {
    for (let i = 0, m = Math.floor(0.06 * sr); i < m; i++) {
      const t = i / sr, edge = Math.min(1, t / 0.004, (0.06 - t) / 0.004);
      o[Math.floor((0.03 + 0.085 * k) * sr) + i] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 3 * f * t)) * edge;
    }
  });
  const hiss = white(n);
  shape(hiss, sr, (t) => (t < 0.3 ? 0.12 : t < 0.42 ? 0.6 - 1.5 * (t - 0.3) : 0));
  mix(o, hiss, 0, 1);
  bq(o, sr, 'hp', 420, 0.8);
  bq(o, sr, 'lp', 2900, 0.9);
  sat(o, 2);
  return finish(o, sr);
});

// -------------------------------------------------------------- mechanics --

// A joint letting go (`ev::JOINT_BREAK`): a hinge or a weld (a pin sheared:
// a crack of metal and the freed part ringing) ...
def('joint_snap', 3, HI, 0.15, () => {
  const sr = HI, o = buf(sr, 0.7);
  const e = burst(sr, 0.005, 0.0006);
  mix(o, e, 0, 1.3);
  ring(o, e, sr, rr(150, 230), 0.035, 0.9);
  const f0 = rr(520, 780);
  for (const q of [1, 2.756, 5.404, 8.933]) ring(o, e, sr, f0 * q * rr(0.98, 1.02), 0.28 * Math.pow(q, -0.6), rr(0.4, 0.8));
  // The pin rattling out.
  for (let k = 0; k < 3; k++) ring(o, burst(sr, 0.002, 0.0004), sr, rlog(2500, 6000), rr(0.01, 0.03), rr(0.15, 0.3), (0.05 + 0.25 * rnd()) * sr);
  return finish(o, sr);
});

// ... or a rope: a taut line parting is a whip-crack and a short twang that
// drops as the tension goes out of it.
def('rope_snap', 2, HI, 0.1, () => {
  const sr = HI, n = Math.floor(sr * 0.5), o = new Float32Array(n);
  mix(o, hp1(burst(sr, 0.006, 0.0008), sr, 1500), 0, 1.4);
  const twang = sweep(n, sr, rr(190, 260), rr(70, 95), 0.07);
  shape(twang, sr, (t) => Math.min(1, t / 0.002) * Math.exp(-t / 0.09) * (1 + 0.4 * Math.sin(TAU * 31 * t)));
  mix(o, twang, 0.004 * sr, 0.7);
  const lash = bq(white(n), sr, 'bp', rr(1800, 2600), 1.5);
  shape(lash, sr, (t) => Math.sin(Math.PI * Math.min(1, t / 0.12)) ** 2 * Math.exp(-t / 0.05));
  mix(o, lash, 0.01 * sr, 0.5);
  return finish(o, sr);
});

// --------------------------------------------------------------- vehicles --

// An engine running steadily, as a loop: `firing` combustions a second,
// `cyl` cylinders that are not quite alike (so the pattern repeats every
// `cyl` firings: the half-order roughness that makes an engine an engine
// and not a tone), each firing a pulse into the exhaust's resonances (`res`:
// [Hz, decay s, amplitude, ...]) and a burst of combustion noise in the band
// `knock` ([Hz, Q, level, decay s]). The loop holds a whole number of
// patterns and is the steady state (the second of two passes), so it has
// no seam; the mixer plays it faster or slower to follow the revs.
function* engine(sr, firing, cyl, patterns, res, knock) {
  const n = Math.round(sr / firing * cyl * patterns);
  const fires = cyl * patterns;
  const amp = [], late = [];
  for (let c = 0; c < cyl; c++) { amp.push(c ? rr(0.7, 1.05) : 1); late.push(c ? rr(-0.04, 0.04) : 0); }
  const at = (k) => Math.round((((k % fires) + late[k % cyl]) / fires) * n + n) % n;
  const exc = new Float32Array(2 * n), gate = new Float32Array(n);
  const tauN = Math.max(8, knock[3] * sr);
  for (let k = 0; k < fires; k++) {
    // (No two turns of an engine are alike either.)
    const a = amp[k % cyl] * rr(0.92, 1.08), i = at(k);
    for (let pass = 0; pass < 2; pass++) {
      const o = pass * n + i;
      exc[o] += 0.5 * a; exc[(o + 1) % (2 * n)] += a; exc[(o + 2) % (2 * n)] += 0.5 * a;
    }
    for (let j = 0; j < 6 * tauN; j++) gate[(i + j) % n] += a * Math.exp(-j / tauN);
  }
  yield;
  const o = new Float32Array(2 * n);
  for (let r = 0; r + 2 < res.length; r += 3) ring(o, exc, sr, res[r], res[r + 1], res[r + 2]);
  yield;
  // The noise is not periodic: it is crossfaded into itself (its gate is).
  const xf = 0.1, nx = Math.floor(xf * sr);
  const hiss = bq(white(n + nx), sr, 'bp', knock[0], knock[1]);
  for (let i = 0; i < n + nx; i++) hiss[i] *= gate[i % n];
  const loop = loopable(hiss, sr, xf);
  let pk = 0;
  for (let i = 0; i < n; i++) { const v = Math.abs(o[n + i]); if (v > pk) pk = v; }
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = o[n + i] / pk + knock[2] * loop[i];
  // (Pulses of one sign leave a standing offset, a seventh of full scale
  // in the fast loops: headroom spent on nothing. It is taken out, after
  // the level is set: the engine is as loud as it was.)
  const y = finish(x, sr, 0.9, 0);
  let mean = 0;
  for (let i = 0; i < y.length; i++) mean += y[i];
  mean /= y.length;
  for (let i = 0; i < y.length; i++) y[i] -= mean;
  return y;
}

// A petrol four at 1000 turns a minute (33.3 firings a second) and at 3600
// (120): the car. The exhaust's resonances stay where they are; at speed
// the upper ones and the intake's roar take over.
def('eng_petrol_lo', 1, LO, 1, () => engine(LO, 100 / 3, 4, 8,
  [62, 0.03, 1, 118, 0.022, 0.8, 245, 0.012, 0.5, 510, 0.006, 0.25], [900, 0.8, 0.12, 0.006]));
def('eng_petrol_hi', 1, LO, 1, () => engine(LO, 120, 4, 30,
  [95, 0.012, 0.6, 240, 0.008, 0.9, 480, 0.005, 0.8, 900, 0.003, 0.5], [1800, 0.7, 0.3, 0.003]));
// A diesel six at 700 (35 a second) and at 2200 (110): the trucks and the
// bulldozer. Lower, and every firing knocks.
def('eng_diesel_lo', 1, LO, 1, () => engine(LO, 35, 6, 6,
  [48, 0.04, 1, 96, 0.03, 0.9, 190, 0.015, 0.6, 380, 0.007, 0.3], [2200, 1.2, 0.45, 0.0025]));
def('eng_diesel_hi', 1, LO, 1, () => engine(LO, 110, 6, 18,
  [80, 0.014, 0.8, 160, 0.01, 1, 330, 0.006, 0.8, 700, 0.003, 0.4], [2600, 1.0, 0.5, 0.0015]));

// The starter: the motor turning the engine over three times (its whine
// sagging at each compression), then the engine catching.
def('eng_start', 2, LO, 0.3, () => {
  const sr = LO, len = 0.95, n = Math.floor(sr * len), o = new Float32Array(n);
  const cranks = 3, each = rr(0.2, 0.23), whine = rr(360, 430);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr, u = (t / each) % 1;
    if (t >= cranks * each) break;
    // Slower against the compression, quicker past it.
    const speed = 0.72 + 0.28 * Math.sin(Math.PI * u);
    ph += TAU * whine * speed / sr;
    o[i] = (Math.sin(ph) + 0.4 * Math.sin(2 * ph) + 0.2 * Math.sin(3.01 * ph)) * (0.55 + 0.45 * speed) * Math.min(1, t / 0.02);
  }
  for (let k = 0; k < cranks; k++) ring(o, burst(sr, 0.02, 0.005, 1500), sr, rr(70, 95), 0.04, 0.8, (k + 0.5) * each * sr);
  // It catches: a few firings, quickening.
  for (let k = 0, t = cranks * each; k < 9 && t < len - 0.05; k++) {
    ring(o, burst(sr, 0.01, 0.003, 2500), sr, rr(60, 120), 0.03, 1.2 * (1 - k * 0.06), t * sr);
    ring(o, burst(sr, 0.006, 0.0015), sr, rr(220, 500), 0.01, 0.7, t * sr);
    t += 0.05 * Math.pow(0.86, k);
  }
  return finish(o, sr, 0.9, 0.03);
});

// Tyres sliding: rubber chattering against the road in a narrow band that
// wanders (a squeal is never one note), over a rough hiss. A loop.
def('loop_skid', 1, LO, 1, function* () {
  const sr = LO, len = 1.6, xf = 0.2, n = Math.floor(sr * (len + xf));
  const w = TAU / len;
  const o = new Float32Array(n);
  for (const [f, q, a] of [[980, 14, 1], [1460, 16, 0.6], [2150, 12, 0.35]]) {
    const p1 = rr(0, TAU), p2 = rr(0, TAU);
    const part = white(n);
    // (Whole cycles in a loop, so the wander itself has no seam.)
    svf(part, sr, 1, (t) => f * (1 + 0.035 * Math.sin(2 * w * t + p1) + 0.02 * Math.sin(5 * w * t + p2)), q);
    mix(o, part, 0, a);
    yield;
  }
  const hiss = bq(white(n), sr, 'bp', 3200, 0.6);
  mix(o, hiss, 0, 0.05);
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// Sheet metal giving way: a body panel folding as the vehicle goes into or
// through something. A dull thump, then creases snapping one after another.
def('veh_crunch', 3, LO, 0.15, () => {
  const sr = LO, o = buf(sr, 0.7);
  ring(o, burst(sr, 0.03, 0.008, 1500), sr, rr(70, 100), 0.05, 1);
  const count = 7 + Math.floor(rr(0, 5));
  for (let k = 0, t = 0.004; k < count && t < 0.45; k++) {
    const e = burst(sr, 0.012, rr(0.002, 0.005));
    ring(o, e, sr, rlog(260, 900), rr(0.012, 0.03), rr(0.4, 0.9) * (1 - t), t * sr);
    ring(o, e, sr, rlog(1300, 3600), rr(0.006, 0.015), rr(0.3, 0.7) * (1 - t), t * sr);
    mix(o, bq(e.slice(), sr, 'bp', rlog(700, 2400), 0.9), t * sr, 0.5 * (1 - t));
    t += -Math.log(1 - rnd() * 0.98) * 0.045;
  }
  return finish(o, sr);
});

// ------------------------------------------------------------------- flame --

// The flamethrower's jet: fuel under pressure hissing out of the nozzle and
// burning as it goes, a roar that flutters as flames do. A loop.
def('loop_jet', 1, LO, 1, function* () {
  const sr = LO, len = 2.2, xf = 0.3, n = Math.floor(sr * (len + xf));
  const roar = bq(pink(n), sr, 'lp', 1100, 0.7);
  bq(roar, sr, 'hp', 70, 0.7);
  yield;
  let am = 1, target = 1;
  for (let i = 0; i < n; i++) {
    if ((i & 511) === 0) target = rr(0.55, 1.3);
    am += (target - am) * 0.004;
    roar[i] *= am;
  }
  const hiss = bq(white(n), sr, 'bp', 3600, 0.5);
  yield;
  for (let i = 0; i < n; i++) roar[i] = roar[i] * 2.2 + hiss[i] * 0.16;
  return finish(loopable(roar, sr, xf), sr, 0.9, 0);
});

// ---------------------------------------------------------- vehicles, more --

// Tyres sliding on what lies loose (dirt, gravel, rubble): no squeal, the
// ground itself thrown about. Stones of all sizes over a rush of grit. A loop.
def('loop_scrabble', 1, LO, 1, function* () {
  const sr = LO, len = 1.8, xf = 0.25, n = Math.floor(sr * (len + xf));
  const o = new Float32Array(n);
  grains(o, sr, 260, 0, len + xf - 0.04, 1, 500, 4200, 0.0015, 0.007, 0.5, 0);
  yield;
  grains(o, sr, 260, 0, len + xf - 0.04, 1, 500, 4200, 0.0015, 0.007, 0.5, 0);
  yield;
  mix(o, bq(pink(n), sr, 'bp', 1400, 0.5), 0, 0.6);
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// A blade or a bumper leaning on a wall with the engine pulling: masonry
// ground against steel. A low grumble that swells and slackens, grit
// breaking off it, and the steel itself groaning in two narrow bands that
// wander. A loop; played lower the more there is in the way.
def('loop_grind', 1, LO, 1, function* () {
  const sr = LO, len = 2.4, xf = 0.3, n = Math.floor(sr * (len + xf));
  const w = TAU / len;
  const o = bq(brown(n, sr), sr, 'lp', 260, 0.7);
  bq(o, sr, 'hp', 45, 0.7);
  // (Whole cycles in the loop: the swell has no seam.)
  const p1 = rr(0, TAU), p2 = rr(0, TAU);
  for (let i = 0; i < n; i++) { const t = i / sr; o[i] *= 2.6 * (1 + 0.35 * Math.sin(3 * w * t + p1) + 0.25 * Math.sin(7 * w * t + p2)); }
  yield;
  grains(o, sr, 300, 0, len + xf - 0.06, 1, 300, 2600, 0.003, 0.016, 0.6, 0);
  yield;
  for (const [f, q, a] of [[212, 22, 0.5], [347, 26, 0.3]]) {
    const q1 = rr(0, TAU), q2 = rr(0, TAU);
    const part = white(n);
    svf(part, sr, 1, (t) => f * (1 + 0.05 * Math.sin(2 * w * t + q1) + 0.03 * Math.sin(5 * w * t + q2)), q);
    for (let i = 0; i < n; i++) part[i] *= 0.6 + 0.4 * Math.sin(4 * w * (i / sr) + q2);
    mix(o, part, 0, a);
    yield;
  }
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// A horn held down: two notes a little out of tune with any scale, each a
// reed's buzz (every harmonic there, the upper ones falling away). `notes`
// are whole numbers of Hz and the loop is a second long, so it has no seam.
function* horn(sr, notes, fall, top) {
  const n = sr, x = new Float32Array(n);
  for (const f of notes) {
    const ph = rr(0, TAU);
    for (let h = 1; h * f < top; h++) {
      const a = Math.pow(h, -fall), w = TAU * h * f / sr, p = ph * h + rr(0, 0.6);
      for (let i = 0; i < n; i++) x[i] += a * Math.sin(w * i + p);
      if (h % 5 === 0) yield;
    }
    yield;
  }
  return finish(x, sr, 0.9, 0);
}
// A car's: a major third, bright.
def('horn_car', 1, LO, 1, function* () { return yield* horn(LO, [420, 525], 0.9, 6000); });
// A lorry's and a bulldozer's: lower, closer together, harsher.
def('horn_truck', 1, LO, 1, function* () { return yield* horn(LO, [277, 330], 0.6, 5000); });

// (Added last: a sound's samples are seeded by its place in this file, and
// nothing before it is to change.)
// The game says no (a button that did nothing, a neighbour paying for it):
// two dull low knocks, the second lower. Not a buzzer: wood, not a circuit.
def('score_no', 1, LO, 0.1, () => {
  const sr = LO, o = buf(sr, 0.32);
  for (const [at, f] of [[0, 196], [0.11, 165]]) {
    ring(o, burst(sr, 0.012, 0.003, 1800), sr, f, 0.045, 1, at * sr);
    ring(o, burst(sr, 0.008, 0.002, 2500), sr, f * 2.76, 0.02, 0.35, at * sr);
  }
  return finish(o, sr);
});

// A structure that is going: a frame taking load it cannot hold, letting go
// connection by connection. A deep moan in runs (stick and slip, every slip
// ringing the frame) over masonry grinding on itself. A loop; the director
// plays it lower the bigger the frame, louder the more of it is letting go.
def('loop_groan', 1, LO, 1, function* () {
  const sr = LO, len = 3.2, xf = 0.4, n = Math.floor(sr * (len + xf));
  const w = TAU / len;
  const exc = pulses(n, sr, (t) => 22 + 8 * Math.sin(3 * w * t) + 5 * Math.sin(7 * w * t + 1), 0.5,
    (t) => Math.max(0, 0.55 + 0.45 * Math.sin(2 * w * t + 0.7) + 0.3 * Math.sin(5 * w * t)));
  const o = new Float32Array(n);
  for (const [f, tau, a] of [[62, 0.09, 1], [97, 0.07, 0.8], [146, 0.05, 0.6], [233, 0.04, 0.35], [391, 0.03, 0.2]]) ring(o, exc, sr, f * rr(0.96, 1.04), tau, a);
  yield;
  const grit = bq(brown(n, sr), sr, 'bp', 320, 0.8);
  let pk = 0;
  for (let i = 0; i < n; i++) { const v = Math.abs(o[i]); if (v > pk) pk = v; }
  for (let i = 0; i < n; i++) o[i] = o[i] / (pk || 1) + grit[i] * 2.5 * (0.6 + 0.4 * Math.sin(4 * w * (i / sr) + 2));
  yield;
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// After a fall: what was thrown up comes down and what is left finds its
// place. Stones ticking and sliding, fewer and fewer, a few bigger pieces
// rolling to rest, in a hiss of dust that thins away.
def('settle', 3, LO, 1.5, function* () {
  const sr = LO, len = rr(4.6, 5.6), n = Math.floor(sr * len);
  const o = new Float32Array(n);
  grains(o, sr, 90, 0, len - 0.4, 2.2, 400, 3800, 0.002, 0.012, 0.5, 0.7);
  yield;
  grains(o, sr, 14, 0.1, len - 1.5, 1.6, 120, 500, 0.02, 0.06, 0.5, 0.5);
  yield;
  const dust = bq(pink(n), sr, 'hp', 2500, 0.7);
  for (let i = 0; i < n; i++) { const t = i / sr; o[i] += dust[i] * 0.25 * Math.exp(-t / 1.6) * Math.min(1, t / 0.2); }
  return finish(o, sr, 0.9, 0.3);
});

// Something goes into water: the slap of the surface, the hole it leaves
// closing with a note that rises as it fills, the spray thrown up, and the
// drops coming down again. Played slower for what is heavier.
def('splash', 3, LO, 0.35, function* () {
  const sr = LO, o = buf(sr, 1.5);
  mix(o, bq(burst(sr, 0.05, 0.012), sr, 'bp', rr(900, 1500), 0.6), 0, 1.2);
  const n1 = Math.floor(sr * 0.24), plunk = new Float32Array(n1);
  const f0 = rr(170, 250), f1 = f0 * rr(2.2, 3);
  let ph = 0;
  for (let i = 0; i < n1; i++) {
    const t = i / n1;
    ph += TAU * (f0 + (f1 - f0) * t * t) / sr;
    plunk[i] = Math.sin(ph) * Math.exp(-t * 3.5) * Math.min(1, i / (sr * 0.004));
  }
  mix(o, plunk, 0.03 * sr, 1);
  yield;
  const spray = bq(white(Math.floor(sr * 0.9)), sr, 'bp', rr(2600, 3800), 0.5);
  shape(spray, sr, (t) => Math.min(1, t / 0.02) * Math.exp(-t / 0.22));
  mix(o, spray, 0.01 * sr, 0.55);
  grains(o, sr, 46, 0.22, 1.1, 0.8, 1500, 7000, 0.0015, 0.006, 0.2, 0.6);
  return finish(o, sr);
});

// Water on the move: a flood finding its way, a tank emptying. A rush, and
// in it the gurgle of air taken down (narrow bands that wander and come
// and go). A loop; louder, faster and brighter the more water moves.
def('loop_water', 1, LO, 1, function* () {
  const sr = LO, len = 3, xf = 0.4, n = Math.floor(sr * (len + xf));
  const w = TAU / len;
  const o = bq(pink(n), sr, 'bp', 1100, 0.35);
  for (let i = 0; i < n; i++) o[i] *= 1.6;
  yield;
  for (const [f, q, a] of [[430, 9, 0.5], [770, 10, 0.42], [1500, 8, 0.3]]) {
    const p1 = rr(0, TAU), p2 = rr(0, TAU);
    const part = white(n);
    svf(part, sr, 1, (t) => f * (1 + 0.25 * Math.sin(3 * w * t + p1) + 0.15 * Math.sin(8 * w * t + p2)), q);
    for (let i = 0; i < n; i++) { const t = i / sr; part[i] *= Math.max(0, 0.5 + 0.5 * Math.sin(5 * w * t + p2) + 0.4 * Math.sin(11 * w * t + p1)); }
    mix(o, part, 0, a);
    yield;
  }
  mix(o, bq(white(n), sr, 'hp', 3000, 0.7), 0, 0.12);
  return finish(loopable(o, sr, xf), sr, 0.9, 0);
});

// A city that is not the street you stand in: the traffic of the avenues a
// few blocks off, heard over the roofs as one low roar that swells and
// eases, the air of a million people under it, and somewhere a building's
// plant humming. Nothing in it moves past: nothing in the scene does. A
// loop of twelve seconds (every swell and hum a whole number of cycles).
def('loop_city', 1, LO, 1, function* () {
  const sr = LO, len = 12, xf = 0.6, n = Math.floor(sr * (len + xf));
  const w = TAU / len;
  const o = brown(n, sr);
  yield;
  bq(o, sr, 'lp', 240, 0.7);
  bq(o, sr, 'hp', 35, 0.7);
  yield;
  // (The swells are slow: worked out every 32 samples and drawn straight
  // between, which is a third of the work of the sound.)
  const p1 = rr(0, TAU), p2 = rr(0, TAU);
  const swell = (t) => 3 * (1 + 0.22 * Math.sin(w * t + p1) + 0.16 * Math.sin(3 * w * t + p2) + 0.1 * Math.sin(7 * w * t));
  const breath = (t) => 0.36 * (1 + 0.25 * Math.sin(2 * w * t + p2));
  for (let i = 0, e0 = swell(0); i < n; i += 32) {
    const e1 = swell((i + 32) / sr), m = i + 32 < n ? i + 32 : n;
    for (let j = i; j < m; j++) o[j] *= e0 + (e1 - e0) * (j - i) * (1 / 32);
    e0 = e1;
  }
  yield;
  const air = pink(n);
  yield;
  bq(air, sr, 'bp', 650, 0.4);
  for (let i = 0, e0 = breath(0); i < n; i += 32) {
    const e1 = breath((i + 32) / sr), m = i + 32 < n ? i + 32 : n;
    for (let j = i; j < m; j++) o[j] += air[j] * (e0 + (e1 - e0) * (j - i) * (1 / 32));
    e0 = e1;
  }
  yield;
  // (Plant on a roof: a hum and its octave, very low in the mix. One cycle
  // of it is a whole number of samples.)
  const cycle = Math.round(sr / 120), hum = new Float32Array(cycle);
  for (let i = 0; i < cycle; i++) hum[i] = 0.012 * Math.sin(TAU * i / cycle) + 0.007 * Math.sin(2 * TAU * i / cycle + 1);
  for (let i = 0; i < n; i++) o[i] += hum[i % cycle];
  yield;
  return finish(loopable(o, sr, xf), sr, 0.72, 0);
});

// A horn a few blocks off: what is left of it after the distance and the
// walls, and its echo off the fronts across the way. One long, one short,
// one twice.
// (One partial of one note: a function of its own, called eight times a
// blast, so that it is compiled after the first; written out in the
// recipe the same loop ran three times as long the one time a page runs
// it.)
function partial(dry, sr, at, dur, a, wv, ph) {
  for (let i = 0, m = Math.floor(dur * sr), i0 = Math.floor(at * sr); i < m; i++) {
    const t = i / sr, env = Math.min(1, t / 0.03) * Math.min(1, (dur - t) / 0.08);
    dry[i0 + i] += a * env * Math.sin(wv * i + ph);
  }
}
def('far_horn', 3, LO, 0.6, (v) => {
  const sr = LO, o = buf(sr, 2.2);
  const notes = v === 1 ? [311, 370] : [392, 494];
  const blasts = v === 0 ? [[0, 0.8]] : v === 1 ? [[0, 0.3]] : [[0, 0.22], [0.36, 0.3]];
  const dry = buf(sr, 1.2);
  for (const [at, dur] of blasts) {
    for (const f of notes) {
      const ph = rr(0, TAU), f1 = f * rr(0.985, 1.0);
      for (let h = 1; h <= 4; h++) partial(dry, sr, at, dur, Math.pow(h, -2.2), TAU * h * f1 / sr, ph * h);
    }
  }
  lp1(dry, sr, 900);
  mix(o, dry, 0, 1);
  mix(o, dry, 0.21 * sr, 0.38);
  mix(o, dry, 0.47 * sr, 0.2);
  mix(o, dry, 0.83 * sr, 0.09);
  return finish(o, sr, 0.9, 0.2);
});

// Sheet metal struck: a panel, not a bar. The boom of the panel itself, a
// few high modes that are gone in a tenth of a second, and the rattle of
// it against what it is fixed to.
def('imp_sheet', 3, HI, 0.12, () => {
  const sr = HI, o = buf(sr, 0.45);
  const e = burst(sr, 0.004, 0.0012);
  ring(o, burst(sr, 0.02, 0.006, 900), sr, rr(110, 170), 0.045, 0.35);
  for (let k = 0; k < 7; k++) ring(o, e, sr, rlog(600, 4600), rr(0.02, 0.07), rr(0.6, 1.2));
  for (let k = 0, t = 0.012; k < 5; k++) {
    mix(o, bq(burst(sr, 0.006, 0.002), sr, 'bp', rlog(1500, 5000), 1.2), t * sr, 0.7 * Math.pow(0.7, k));
    t += rr(0.011, 0.03);
  }
  return finish(o, sr);
});

// A rock out of the sky (the sandbox's meteor). Not a whistle, which is a
// bomb's fins: air torn by something big and burning. A roar that grows
// and falls in pitch as it comes down, a howl under it, embers letting go.
// As long as the short whistle and played as one is: its last sample lands
// where the impact is heard.
function* meteor(sr, len) {
  const n = Math.floor(sr * len);
  const roar = pink(n);
  yield;
  const f0 = rr(1500, 1900), f1 = rr(380, 460);
  svf(roar, sr, 1, (t) => f0 * Math.pow(f1 / f0, t / len), 0.7);
  yield;
  const low = bq(brown(n, sr), sr, 'lp', 220, 0.7);
  yield;
  const o = new Float32Array(n);
  const h0 = rr(300, 340), h1 = rr(130, 150), flut = rr(17, 23);
  // (Long loops in functions of their own: see loop_wind's last step.)
  const body = () => {
    let ph = 0, w = 0;
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      if ((i & 31) === 0) w = TAU * h0 * Math.pow(h1 / h0, t / len) / sr;
      ph += w;
      o[i] = (2.2 * roar[i] + 0.45 * low[i] + 0.3 * Math.sin(ph) + 0.12 * Math.sin(2 * ph + 1)) * (1 + 0.25 * Math.sin(TAU * flut * t));
    }
  };
  body();
  yield;
  // Embers: more of them the nearer it is.
  for (let t = 0; ;) {
    t += -Math.log(1 - rnd() * 0.999) / 40;
    if (t >= len - 0.02) break;
    if (rnd() > t / len) continue;
    const snap = bq(burst(sr, 0.004, rlog(0.0003, 0.0012)), sr, 'bp', rlog(1800, 6000), 1.2);
    mix(o, snap, t * sr, rr(0.15, 0.5));
  }
  yield;
  const swell = () => {
    for (let i = 0; i < n; i++) {
      const t = i / sr, u = t / len;
      o[i] *= Math.min(1, t / 0.08) * (0.06 + 0.94 * u * u) * Math.min(1, (len - t) / 0.008);
    }
  };
  swell();
  return finish(o, sr, 0.9, 0.004);
}
def('meteor', 2, LO, 4, () => meteor(LO, 1.15));

// A vehicle wrecked under its driver: the engine does not stop, it dies. A
// bang as something in it lets go, the last firings further and further
// apart and some of them missed, a part dropping onto the road, and what
// was in the radiator going up as steam.
def('eng_die', 2, LO, 0.5, function* () {
  const sr = LO, len = 2.1, o = buf(sr, len);
  // The bang: a knock with a body under it.
  ring(o, burst(sr, 0.012, 0.003, 3000), sr, rr(130, 170), 0.05, 2.2);
  ring(o, burst(sr, 0.006, 0.0015), sr, rr(700, 1100), 0.012, 1.0);
  mix(o, burst(sr, 0.05, 0.008, 5000), 0, 0.9);
  yield;
  // The last firings, running down.
  for (let k = 0, t = 0.07; k < 14 && t < 1.05; k++) {
    const a = 1.1 * Math.pow(0.86, k) * (rnd() < 0.22 ? 0.15 : 1);
    ring(o, burst(sr, 0.01, 0.003, 2500), sr, rr(55, 110), 0.035, a, t * sr);
    ring(o, burst(sr, 0.006, 0.0015), sr, rr(220, 480), 0.01, 0.6 * a, t * sr);
    t += 0.045 * Math.pow(1.2, k) * rr(0.85, 1.2);
  }
  yield;
  // Something drops off: struck sheet, short.
  const at = rr(0.42, 0.6), e = burst(sr, 0.01, 0.0015);
  for (const q of [1, 1.51, 2.76, 4.3]) ring(o, e, sr, rr(480, 620) * q, 0.07 * Math.pow(q, -0.5), 0.5 * Math.pow(q, -0.3), at * sr);
  yield;
  // Steam: it comes up as the engine goes down, and thins out.
  const hiss = bq(white(Math.floor(sr * (len - 0.2))), sr, 'bp', rr(5200, 6800), 0.8);
  const steam = () => {
    for (let i = 0; i < hiss.length; i++) {
      const t = i / sr;
      hiss[i] *= Math.min(1, t / 0.35) * Math.exp(-t / 0.7) * (1 + 0.3 * Math.sin(TAU * 9 * t));
    }
  };
  steam();
  mix(o, hiss, 0.2 * sr, 1.5);
  return finish(o, sr, 0.9, 0.05);
});

// The flamethrower's tank run dry with the trigger held: the jet does not
// stop as when it is let go, it starves. Three puffs of it, each smaller,
// a hollow pop in the nozzle with each, gas with no flame to it hissing
// out, and the valve.
def('jet_dry', 2, LO, 0.2, () => {
  const sr = LO, o = buf(sr, 0.8);
  let t = 0;
  for (let k = 0; k < 3; k++) {
    const a = [1, 0.75, 0.5][k];
    const puff = bq(bq(burst(sr, rr(0.07, 0.1), rr(0.018, 0.028)), sr, 'lp', 1300, 0.7), sr, 'hp', 90, 0.7);
    mix(o, puff, t * sr, 2.4 * a);
    ring(o, burst(sr, 0.008, 0.002, 2000), sr, rr(170, 250), 0.02, 0.9 * a, t * sr);
    t += rr(0.11, 0.15) * (1 + 0.25 * k);
  }
  const gas = bq(burst(sr, 0.4, 0.12), sr, 'hp', 3500, 0.7);
  mix(o, gas, t * sr, 0.25);
  ring(o, burst(sr, 0.004, 0.001), sr, rr(2000, 2600), 0.008, 0.5, (t + rr(0.12, 0.2)) * sr);
  return finish(o, sr, 0.9, 0.02);
});

// -------------------------------------------------------------------- api --

/** Metadata for every sound: { name, variants, sr, tau, base }. `base` is the
 *  index of variant 0 in the flat buffer list. */
export const SOUNDS = defs.map(({ name, variants, sr, tau, base }) => ({ name, variants, sr, tau, base }));
export const BUFFER_COUNT = bufferCount;
export const FIRST_BANK = firstBank;

/**
 * Render one sound a stage at a time: a generator that yields after every
 * variant (and between the stages of the long recipes) and returns the
 * variants, each an array of channels. Each step is a few milliseconds of
 * work at most. The random generator's state is carried across the yields,
 * so the result is the same bits however the steps are interleaved with
 * other renders.
 */
export function* renderSteps(id) {
  const d = defs[id];
  const out = [];
  for (let v = 0; v < d.variants; v++) {
    srand(id * 131 + v * 17 + 1);
    let r = d.gen(v);
    if (typeof r.next === 'function') {
      for (let s = r.next(); ; s = r.next()) {
        if (s.done) { r = s.value; break; }
        const seed = rngState();
        yield;
        rngRestore(seed);
      }
    }
    out.push(Array.isArray(r) ? r : [r]);
    if (v + 1 < d.variants) {
      const seed = rngState();
      yield;
      rngRestore(seed);
    }
  }
  return out;
}

/** Render every variant of one sound. Each entry is an array of channels. */
export function renderSound(id) {
  const steps = renderSteps(id);
  for (;;) {
    const s = steps.next();
    if (s.done) return s.value;
  }
}

// Render order: what a player can cause first comes first (the ground and
// walls, blasts, steps, then the tools), so a quick first click is not
// silent while the rest is still being rendered. The spaces and the beds of
// the world follow; nobody misses a bird for half a second.
export const RENDER_ORDER = (() => {
  const first = [
    'imp_stone', 'brk_stone', 'exp_crack', 'exp_sub', 'exp_body', 'step_hard', 'rumble_hit',
    'rifle', 'shotgun', 'cannon', 'rocket', 'whoosh', 'hammer_hit', 'beep', 'grav', 'pop',
    'satchel_throw', 'breach_set', 'radio', 'flare', 'whistle', 'whistle_short',
    'loop_brown', 'loop_pink', 'ir_outdoor',
  ];
  const last = ['ir_indoor', 'ear_ring', 'loop_ring', 'loop_fire', 'loop_jet', 'loop_skid', 'loop_wind', 'bird'];
  const order = first.map((n) => SND[n]);
  for (let i = 0; i < defs.length; i++) if (!order.includes(i) && !last.includes(defs[i].name)) order.push(i);
  for (const n of last) order.push(SND[n]);
  return order;
})();

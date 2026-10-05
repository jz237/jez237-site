// Procedural soundscape for the Point Lookout scene (Web Audio API, no audio files, no music).
//
// Layers (native Web Audio nodes only, no AudioWorklet). Every looped noise bed has its static
// filters, stereo coherence and stereo position baked into its buffer at load time, so the live
// graph is mostly sources + gains:
//   surf     continuous surf roar: low-passed pink + brown beds and a mid "sizzle", breathing with
//            the far breakers (ocean events too weak for their own voice)
//   breakers individual crashes: one noise voice per event crossfaded through shared
//            bright/mid/dark filter banks (the bright band dies first = low-pass sweep), two-stage
//            envelope (impact + turbulent roar) with jittered sub-impacts, a low thump and the
//            bubbly drain of the rock-platform surges, foam fizz. Beach breakers come from
//            ctx.modules.ocean.breakerEvents(t0, t1); the rock platform / wash-rock surges are
//            derived from the same surf phase the ocean shader uses (coast.js SURF + tau LUT), so
//            every crash is heard when (plus d/343 s after) its white water appears on screen
//   wind     broadband hiss following ctx.wind.gustAt(t) at the microphone, with a small left->right
//            gust sweep, turbulence flicker and high air hiss
//   buffet   rare, light phone-microphone buffeting in the strongest gusts only (windshield field
//            recording, analysis/audio.md)
//   trees    she-oak sigh (aeolian band moving 2.1 -> 3.4 kHz with the gust) and needle crackle for
//            crowns B and C right-front, foliage-clump flutter at the left frame edge; each source
//            uses the gust delayed by its own position (gusts advect at GUST_ADVECTION m/s)
//   ambience sparse darkened early reflections alternating L/R (a ConvolverNode with a generated
//            RT60 ~1.4 s outdoor IR is available as ?reverb=conv but costs ~5 % of a core in Chrome)
//
// Everything is a pure function of the visual time t (hashed/ocean-phase events, gustAt), so
// picture and sound stay in sync and the soundscape never repeats recognisably.
//
// API: create(ctx) -> { start(), update(t, dt), suspend(), resume(), setVolume(v), context }
// Also exported for offline tests: buildSoundscape(ac, opts), loadSurfModel(), rockEvents(),
// fallbackBreakerEvents(t0, t1, surf), makeSampleData(tier), makeSampleDataAsync(tier), LEVELS.
import { mulberry32, hash2, noise1 } from '../core/rng.js';
import { WIND_DIR, GUST_ADVECTION } from '../core/wind.js';
import { BEACH_WATERLINE, PLATFORM_OUTLINE, polylineSigned, polygonSDF } from '../world/layout.js';

// ------------------------------------------------------------------------------------------------
// Mix (linear gains per bus). Tuned with the offline renderer (see report).
export const LEVELS = {
  master: 0.55,
  surf: 0.26,
  breakers: 0.75,
  wind: 0.4,
  buffet: 0.15,
  trees: 0.15,
  reverb: 0.35,
};

const CAM = [0, 35, 0];
const SOUND_SPEED = 343;

// ------------------------------------------------------------------------------------------------
// Sample data (plain Float32Arrays). Generated once in create(), wrapped in AudioBuffers.
function fadeLoop(x, n, f) {
  // x has n + f samples; crossfade the tail into the head (equal power, uncorrelated noise)
  // so the loop point is seamless.
  const out = new Float32Array(n);
  out.set(x.subarray(0, n));
  for (let i = 0; i < f; i++) {
    const w = (i / f) * Math.PI * 0.5;
    out[i] = x[i] * Math.sin(w) + x[n + i] * Math.cos(w);
  }
  return out;
}

function normalise(ch, rms) {
  let s = 0, len = 0;
  for (const c of ch) { for (let i = 0; i < c.length; i++) s += c[i] * c[i]; len += c.length; }
  const k = rms / Math.sqrt(s / len + 1e-20);
  for (const c of ch) for (let i = 0; i < c.length; i++) c[i] *= k;
  return ch;
}

function noiseChannel(kind, n, rate, rand) {
  const f = Math.floor(rate * 0.25);
  const x = new Float32Array(n + f);
  if (kind === 'white') {
    for (let i = 0; i < x.length; i++) x[i] = rand() * 2 - 1;
  } else if (kind === 'pink') {
    // Paul Kellet's refined pink filter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < x.length; i++) {
      const w = rand() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      x[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
      b6 = w * 0.115926;
    }
  } else if (kind === 'brown') {
    // leaky integrator (~6 dB/oct) with a gentle DC blocker
    let y = 0, hp = 0, prev = 0;
    const leak = Math.exp(-2 * Math.PI * 12 / rate);
    const r = Math.exp(-2 * Math.PI * 18 / rate);
    for (let i = 0; i < x.length; i++) {
      y = leak * y + (rand() * 2 - 1) * 0.1;
      hp = r * (hp + y - prev); prev = y;
      x[i] = hp;
    }
  } else if (kind === 'crackle') {
    // sparse needle/leaf ticks: short decaying noise grains with a heavy-tailed amplitude
    const rateHz = 900;
    let t = 0;
    while (true) {
      t += -Math.log(1 - rand()) / rateHz * rate;
      const i0 = Math.floor(t);
      if (i0 >= x.length) break;
      const amp = Math.pow(rand(), 3.2) * (rand() < 0.5 ? -1 : 1);
      const len = Math.floor(rate * (0.0004 + rand() * 0.0025));
      const dec = 1 / (len * 0.35);
      for (let k = 0; k < len && i0 + k < x.length; k++) x[i0 + k] += amp * Math.exp(-k * dec) * (rand() * 2 - 1);
    }
  } else if (kind === 'bubbles') {
    // Minnaert bubbles of draining white water: decaying sines 400-2500 Hz with a short upward
    // glide, 40-80 grains/s, under a little filtered wash
    const rateHz = 60;
    let t = 0;
    while (true) {
      t += -Math.log(1 - rand()) / rateHz * rate;
      const i0 = Math.floor(t);
      if (i0 >= x.length) break;
      const f0 = 400 * Math.exp(rand() * Math.log(6.25) * (0.35 + 0.65 * rand()));
      const glide = 0.1 + 0.2 * rand(), tg = 0.02 + 0.04 * rand();
      const tau = (0.004 + 0.012 * rand()) * Math.sqrt(900 / f0);
      const amp = (0.3 + 0.7 * Math.pow(rand(), 2)) * Math.sqrt(900 / f0);
      const len = Math.min(Math.floor(tau * 6 * rate), x.length - i0);
      let ph = rand() * 6.283;
      for (let k = 0; k < len; k++) {
        const tt = k / rate;
        const fr = f0 * (1 + glide * Math.min(1, tt / tg));
        ph += (2 * Math.PI * fr) / rate;
        x[i0 + k] += amp * Math.exp(-tt / tau) * Math.sin(ph) * Math.min(1, k / 12);
      }
    }
    let lp = 0;
    for (let i = 0; i < x.length; i++) { lp += 0.25 * ((rand() * 2 - 1) - lp); x[i] += 0.06 * lp; }
  }
  return fadeLoop(x, n, f);
}

function modChannel(kind, seconds, rate, rand) {
  // control-rate modulation signals (played as AudioBuffers into AudioParams)
  const n = Math.floor(seconds * rate);
  const x = new Float32Array(n);
  const seed = Math.floor(rand() * 1e6);
  const period = seconds; // make the smooth noise periodic over the buffer length
  const pn = (tt, freq, s) => {
    // periodic 1D noise: wrap the lattice
    const cells = Math.max(1, Math.round(period * freq));
    const u = (tt / period) * cells;
    const i = Math.floor(u), fr = u - i;
    const a = hash2(((i % cells) + cells) % cells, s) * 2 - 1;
    const b = hash2((((i + 1) % cells) + cells) % cells, s) * 2 - 1;
    const e = fr * fr * (3 - 2 * fr);
    return a + (b - a) * e;
  };
  for (let i = 0; i < n; i++) {
    const tt = i / rate;
    if (kind === 'buffet') {
      // bursty 3..16 Hz rumble envelope: rectified, sharpened noise with intermittent bursts
      const burst = Math.max(0, pn(tt, 1.3, seed) * 0.8 + 0.35);
      const flap = pn(tt, 7.0, seed + 1) * 0.6 + pn(tt, 15.0, seed + 2) * 0.4;
      const v = Math.max(0, 0.25 + flap) * burst;
      x[i] = Math.pow(v, 1.5) * 1.6;
    } else {
      // flutter: smooth 4..22 Hz amplitude wobble around 1
      const v = pn(tt, 4.3, seed) * 0.45 + pn(tt, 11.0, seed + 5) * 0.35 + pn(tt, 22.0, seed + 9) * 0.2;
      x[i] = 1 + 0.7 * v;
    }
  }
  return x;
}

// RBJ biquad coefficients (normalised, linear Q) for baking static filters into the looped beds.
function rbj(type, f, q, gainDb, rate) {
  const A = Math.pow(10, gainDb / 40), w0 = (2 * Math.PI * Math.min(f, rate * 0.45)) / rate;
  const cw = Math.cos(w0), sw = Math.sin(w0), al = sw / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lowpass') { b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = b0; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; }
  else if (type === 'highpass') { b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = b0; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; }
  else if (type === 'bandpass') { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; }
  else if (type === 'peaking') { b0 = 1 + al * A; b1 = -2 * cw; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cw; a2 = 1 - al / A; }
  else {
    const sq = 2 * Math.sqrt(A) * (sw / 2) * Math.SQRT2; // shelf slope S = 1
    if (type === 'lowshelf') {
      b0 = A * ((A + 1) - (A - 1) * cw + sq); b1 = 2 * A * ((A - 1) - (A + 1) * cw); b2 = A * ((A + 1) - (A - 1) * cw - sq);
      a0 = (A + 1) + (A - 1) * cw + sq; a1 = -2 * ((A - 1) + (A + 1) * cw); a2 = (A + 1) + (A - 1) * cw - sq;
    } else {
      b0 = A * ((A + 1) + (A - 1) * cw + sq); b1 = -2 * A * ((A - 1) + (A + 1) * cw); b2 = A * ((A + 1) + (A - 1) * cw - sq);
      a0 = (A + 1) - (A - 1) * cw + sq; a1 = 2 * ((A - 1) - (A + 1) * cw); a2 = (A + 1) - (A - 1) * cw - sq;
    }
  }
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}

// Filter a looped channel in place. Two passes: the second starts with the state the first ended
// with, so the output is exactly periodic and the loop point stays seamless.
function filterLoop(x, coefs) {
  for (const [b0, b1, b2, a1, a2] of coefs) {
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    const out = new Float32Array(x.length);
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < x.length; i++) {
        const v = x[i];
        const y = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1; x1 = v; y2 = y1; y1 = y;
        if (pass) out[i] = y;
      }
    }
    x.set(out);
  }
  return x;
}

export function makeSampleData(tier = 'high') {
  const plan = sampleDataPlan(tier);
  const out = {};
  for (const [k, fn] of plan) out[k] = fn();
  return out;
}

export async function makeSampleDataAsync(tier = 'high', onProgress = () => {}) {
  const plan = sampleDataPlan(tier);
  const out = {};
  for (let i = 0; i < plan.length; i++) {
    out[plan[i][0]] = plan[i][1]();
    onProgress((i + 1) / plan.length);
    // yield to the page between buffers (MessageChannel: not throttled in background tabs)
    await new Promise((r) => {
      if (typeof MessageChannel === 'function') { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); } else setTimeout(r, 0);
    });
  }
  return out;
}

function sampleDataPlan(tier) {
  const s = tier === 'high' ? 1 : tier === 'medium' ? 0.6 : 0.4;
  const rand = mulberry32(0x5eaf0a11);
  // Stereo noise with inter-channel coherence rho: L = sqrt(rho) c + sqrt(1-rho) n1, R likewise
  // (a real two-mic recording is fairly coherent at low frequencies; point sources then image).
  const mk = (kind, sec, rate, rms, rho = 0) => {
    const n = Math.floor(sec * s * rate);
    const a = noiseChannel(kind, n, rate, rand), b = noiseChannel(kind, n, rate, rand);
    if (rho > 0) {
      // mid/side mix of two independent noises: corr(L, R) = (km^2 - ks^2) / (km^2 + ks^2) = rho
      const km = Math.sqrt((1 + rho) / 2), ks = Math.sqrt((1 - rho) / 2);
      for (let i = 0; i < n; i++) { const m = a[i], sd = b[i]; a[i] = km * m + ks * sd; b[i] = km * m - ks * sd; }
    }
    return { rate, channels: normalise([a, b], rms) };
  };
  const mono = (kind, sec, rate, rms, filters = []) => {
    const x = noiseChannel(kind, Math.floor(sec * s * rate), rate, rand);
    filterLoop(x, filters.map(([type, f, q = Math.SQRT1_2, g = 0]) => rbj(type, f, q, g, rate)));
    return { rate, channels: normalise([x], rms) };
  };
  // Looped stereo bed with its (static) filter chain, coherence and equal-power pan baked in: the
  // runtime graph then only needs a source and a gain per layer.
  const bed = (kind, sec, rate, filters, pan = 0, rho = 0) => {
    const d = mk(kind, sec, rate, 0.25, rho);
    const coefs = filters.map(([type, f, q = Math.SQRT1_2, g = 0]) => rbj(type, f, q, g, rate));
    d.channels.forEach((c) => filterLoop(c, coefs));
    if (pan) {
      const a = ((pan + 1) * Math.PI) / 4;
      const k = [Math.cos(a) * Math.SQRT2, Math.sin(a) * Math.SQRT2];
      d.channels.forEach((c, j) => { for (let i = 0; i < c.length; i++) c[i] *= k[j]; });
    }
    return d;
  };
  return [
    // one-shot material for the breakers: mono (near, truly panned) and mostly coherent stereo (far)
    ['pinkM', () => mono('pink', 17.3, 32000, 0.25)],
    ['pink', () => mk('pink', 19.3, 32000, 0.25, 0.7)],
    ['brown', () => mono('brown', 13.1, 16000, 0.25)],
    ['drain', () => mono('bubbles', 4.3, 32000, 0.25, [['highpass', 300], ['lowpass', 3500]])],
    // surf roar beds
    ['surfA', () => bed('pink', 19.3, 16000, [['lowpass', 1100], ['lowpass', 2000], ['peaking', 220, 0.8, 3]], -0.3, 0.6)],
    ['surfDeep', () => bed('brown', 23.1, 8000, [['lowpass', 420], ['highpass', 35]], -0.15, 0.85)],
    ['sizzle', () => bed('pink', 17.1, 24000, [['bandpass', 1600, 0.45], ['lowpass', 5200]], 0.05, 0.45)],
    // wind
    ['windLo', () => bed('pink', 15.3, 16000, [['highpass', 150], ['bandpass', 560, 0.6], ['highshelf', 3500, 0, -5]], 0, 0.4)],
    ['windHi', () => bed('pink', 16.7, 24000, [['bandpass', 1700, 0.6], ['highshelf', 3500, 0, -5]], 0, 0.25)],
    ['air', () => bed('white', 13.7, 32000, [['highpass', 4200], ['lowpass', 11000]], 0, 0.15)],
    ['buffetBed', () => bed('brown', 21.9, 8000, [['lowpass', 170], ['lowpass', 320], ['highpass', 45]], 0, 0.3)],
    // trees: she-oak aeolian sigh at the low / high end of its gust-dependent band, needle crackle
    ['sighLo', () => bed('white', 13.1, 32000, [['bandpass', 2100, 1.2], ['bandpass', 2100, 1.2], ['highshelf', 5000, 0, 3]], 0, 0.2)],
    ['sighHi', () => bed('white', 11.3, 32000, [['bandpass', 3400, 1.2], ['bandpass', 3400, 1.2], ['highshelf', 7000, 0, 3]], 0, 0.2)],
    ['crackleR', () => bed('crackle', 11.9, 32000, [['highpass', 2200], ['lowpass', 9000]], 0.5, 0.1)],
    ['crackleL', () => bed('crackle', 10.3, 32000, [['bandpass', 3200, 0.55], ['lowshelf', 800, 0, -8]], -0.75, 0.1)],
    ['buffetMod', () => ({ rate: 3000, channels: [modChannel('buffet', 31.7, 3000, rand)] })],
    ['flutterMod', () => ({ rate: 3000, channels: [modChannel('flutter', 23.3, 3000, rand), modChannel('flutter', 23.3, 3000, rand)] })],
    ['irSeconds', () => 1.0], // IR ('conv' ambience) is generated at the context rate
  ];
}

function makeIR(seconds, rate, rand) {
  // Open-air tail (analysis/audio.md §3): 25 ms pre-delay, RT60 ~1.4 s, per-channel one-pole
  // low-pass gliding 5 kHz -> 700 Hz, three weak early reflections (cliff, platform). Decorrelated L/R.
  const n = Math.floor(seconds * rate);
  const pre = Math.floor(0.025 * rate);
  const chs = [];
  for (let c = 0; c < 2; c++) {
    const x = new Float32Array(n);
    let lp = 0;
    for (let i = pre; i < n; i++) {
      const tt = (i - pre) / rate;
      const a = Math.min(1, tt / 0.01) * Math.exp(-tt / 0.2) * Math.min(1, (n - i) / (0.1 * rate));
      const fc = 700 + 4300 * Math.exp(-tt / 0.35);
      const k = 1 - Math.exp((-2 * Math.PI * fc) / rate);
      lp += k * ((rand() * 2 - 1) - lp);
      x[i] = lp * a;
    }
    for (let j = 0; j < 3; j++) {
      const i = Math.floor((0.04 + rand() * 0.08) * rate);
      x[i] += (0.15 + rand() * 0.15) * (rand() < 0.5 ? -1 : 1) * 0.1;
    }
    chs.push(x);
  }
  return { rate, channels: normalise(chs, 1 / Math.sqrt(n)) }; // unit energy per channel
}

function toBuffer(ac, data) {
  if (data.__buffer) return data.__buffer;
  const make = (chs, rate) => {
    const b = ac ? ac.createBuffer(chs.length, chs[0].length, rate)
      : new AudioBuffer({ numberOfChannels: chs.length, length: chs[0].length, sampleRate: rate });
    chs.forEach((c, i) => b.copyToChannel(c, i));
    return b;
  };
  try {
    return make(data.channels, data.rate);
  } catch (e) {
    if (!ac) throw e;
    // some engines only accept 22.05-96 kHz buffers: resample (linear) to the context rate
    const r = ac.sampleRate, k = data.rate / r;
    const chs = data.channels.map((c) => {
      const n = Math.floor(c.length / k), o = new Float32Array(n);
      for (let i = 0; i < n; i++) { const x = i * k, j = Math.floor(x), f = x - j; o[i] = c[j] + ((c[(j + 1) % c.length]) - c[j]) * f; }
      return o;
    });
    return make(chs, r);
  }
}

// ------------------------------------------------------------------------------------------------
// Surf phase model shared with the ocean shader (coast.js SURF + tau LUT, crestStrength of ocean.js)

// crestStrength: the ocean module's export, else surf.glsl.js's JS mirror of the GLSL (same bit-exact
// integer hash), so the sound of the breakers matches the visible crests.

// Loads the surf travel-time model; returns null (-> fixed fallback phases) if it is unavailable.
export async function loadSurfModel(ocean = null) {
  try {
    const coast = await import('../ocean/coast.js');
    const lut = coast.buildTauLUT();
    try { lut.tex?.dispose?.(); } catch (e) { /* ignore */ }
    const crest = typeof ocean?.crestStrength === 'function' ? ocean.crestStrength : (await import('../ocean/surf.glsl.js')).crestStrength;
    return { T: coast.SURF.T, p: coast.SURF.p, tauAt: lut.tauAt, crest };
  } catch (e) {
    return null;
  }
}

// White water surging on the rock platform ahead and on the wash rocks at the cliff foot. Times
// and sizes follow the ocean shader's rock surge: surge = exp(-age/2.2) * (0.35 + 0.8 * A0) with
// age = 0 when the swell crest (psi = (t + tau(dB) - p z) / T integer) reaches the point.
const ROCK_SRC = [
  // x, z, weight, heavy (thump + drain), fallback phase (t mod 10 without the surf model)
  [30, -137, 0.62, true, 8.10], // platform front face (the big white splashes in frame)
  [-6, -148, 0.5, true, 9.44], // platform west face
  [-10.6, -149, 0.3, false, 8.58], // dark rock left of the platform
  [96, -139, 0.22, false, 9.91], // sheltered east end, close to the beach
  [-20, -60, 0.22, false, 8.86], // wash rocks at the cliff foot (hidden by the headland: quiet)
];
let rockGeo = null;
export function rockEvents(t0, t1, surf) {
  if (!rockGeo) rockGeo = ROCK_SRC.map(([x, z]) => { const dB = Math.abs(polylineSigned(x, z, BEACH_WATERLINE)); return { dB, s: z + 0.35 * dB }; });
  const out = [];
  ROCK_SRC.forEach(([x, z, w, heavy, ph], j) => {
    const T = surf ? surf.T : 10;
    const base = surf ? -surf.tauAt(rockGeo[j].dB) + surf.p * z : ph;
    for (let k = Math.floor((t0 - base) / T); k * T + base < t1; k++) {
      const t = k * T + base;
      if (t < t0) continue;
      const A0 = surf ? surf.crest(k, rockGeo[j].s) : 0.2 + 0.8 * hash2(k, 211 + j);
      out.push({ t, x, z, size: w * (0.35 + 0.8 * A0), kind: j < 4 ? 'platform' : 'rock', heavy });
    }
  });
  return out;
}

// Smooth, non-periodic sea-state envelope (fallback schedule only): 10 s swell whose amplitude
// wanders with noise (no fixed set period), plus incommensurate noise for the wind sea.
export function swellEnv(t) {
  const a = 0.5 + 0.5 * Math.cos((2 * Math.PI * t) / 10 + 0.4 * noise1(t * 0.03, 3));
  const grp = 0.6 + 0.4 * noise1(t / 80, 5);
  const b = 0.5 + 0.5 * noise1(t / 3.1, 8);
  return Math.max(0, Math.min(1, 0.6 * a * grp + 0.25 * b + 0.15));
}

const BEACH = BEACH_WATERLINE;
function beachX(z) {
  for (let i = 0; i < BEACH.length - 1; i++) {
    const [x0, z0] = BEACH[i], [x1, z1] = BEACH[i + 1];
    if (z <= z0 && z >= z1) return x0 + (x1 - x0) * (z - z0) / (z1 - z0);
  }
  return BEACH[BEACH.length - 1][0];
}

// Fallback breaker schedule (used when the ocean module does not provide breakerEvents).
// Returns [{ t, x, z, size, kind }] with t in [t0, t1).
export function fallbackBreakerEvents(t0, t1, surf = null) {
  const out = [];
  const SL = 0.5;
  for (let k = Math.floor(t0 / SL); k * SL < t1; k++) {
    const h = hash2(k, 101);
    const env = swellEnv(k * SL);
    if (h > 0.16 + 0.32 * env) continue;
    const t = (k + hash2(k, 102)) * SL;
    if (t < t0 || t >= t1) continue;
    const z = -260 - 1500 * Math.pow(hash2(k, 103), 1.6);
    const line = hash2(k, 104);
    const off = line < 0.45 ? 210 : line < 0.75 ? 160 : 100;
    const x = beachX(z) - off + (hash2(k, 105) - 0.5) * 40;
    const size = (0.45 + 0.55 * hash2(k, 106)) * (off > 180 ? 1 : 0.7) * (0.6 + 0.6 * env);
    out.push({ t, x, z, size, kind: 'surf' });
  }
  out.push(...rockEvents(t0, t1, surf));
  out.sort((a, b) => a.t - b.t);
  return out;
}

// ------------------------------------------------------------------------------------------------
// Graph

function softClipCurve(n = 1024, drive = 1.6) {
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = Math.tanh(x * drive) / Math.tanh(drive);
  }
  return c;
}

// Two-stage crash envelope value at time u after onset: power-law rise, fast impact decay down
// to a turbulent roar plateau that decays slowly.
function crashShape(u, rise, tau1, tau2, b) {
  if (u <= 0) return 0;
  if (u < rise) return Math.pow(u / rise, 1.5);
  const v = u - rise;
  return (1 - b) * Math.exp(-v / tau1) + b * Math.exp(-v / tau2);
}

export function buildSoundscape(ac, opts = {}) {
  const { gustAt, data, output = ac.destination, tier = 'high', breakerSource = null, surf = null } = opts;
  const solo = opts.solo || null;
  const buf = {};
  for (const k of Object.keys(data)) if (data[k] && (data[k].channels || data[k].__buffer)) buf[k] = toBuffer(ac, data[k]);

  const nodes = [];
  const reg = (n) => (nodes.push(n), n);
  const gain = (v) => { const g = reg(ac.createGain()); g.gain.value = v; return g; };
  // q is always a linear Q; Web Audio lowpass/highpass take their resonance in dB
  const biquad = (type, f, q = Math.SQRT1_2, g = 0) => {
    const b = reg(ac.createBiquadFilter());
    b.type = type; b.frequency.value = f; b.gain.value = g;
    b.Q.value = type === 'lowpass' || type === 'highpass' ? 20 * Math.log10(q) : q;
    return b;
  };
  const panner = (p) => {
    const n = ac.createStereoPanner ? ac.createStereoPanner() : ac.createGain();
    if (n.pan) n.pan.value = Math.max(-1, Math.min(1, p));
    return n;
  };
  const autos = []; // automated params: { param, fn(t) -> value }
  const auto = (param, fn) => autos.push({ param, fn, started: false });
  let driftSeed = 500;
  const loopSrc = (b, rate = 1, offsetFrac = 0, drift = true) => {
    const s = reg(ac.createBufferSource());
    s.buffer = b; s.loop = true; s.playbackRate.value = rate;
    s.__offset = offsetFrac * b.duration;
    if (drift) {
      // slow +-4 % rate wander (k-rate param, cheap): loops of the noise beds never realign
      const seed = driftSeed++;
      auto(s.playbackRate, (t) => rate * (1 + 0.04 * noise1(t * 0.043, seed)));
    }
    return s;
  };
  const chain = (...ns) => { for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); return ns[ns.length - 1]; };

  // ---- master -----------------------------------------------------------------------------------
  const master = gain(0);
  const comp = reg(ac.createDynamicsCompressor());
  comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.015; comp.release.value = 0.3;
  const sum = gain(1);
  chain(sum, biquad('highpass', 50), comp, master, output);

  const bus = {};
  for (const k of ['surf', 'breakers', 'wind', 'buffet', 'trees']) {
    bus[k] = gain(solo ? (solo.includes(k) ? LEVELS[k] : 0) : LEVELS[k]);
    bus[k].connect(sum);
  }
  const build = (k) => !opts.build || opts.build.includes(k); // (tests) build only some layers
  // Ambience: a ConvolverNode costs ~5 % of a core in Chrome whatever the IR length, so by default
  // the open-air space is a few sparse, darkened early reflections (cliff, platform, sea surface)
  // alternating L/R; 'conv' (tests, ?reverb=conv) uses the generated IR instead.
  let revSend = null;
  const revMode = opts.reverb || 'taps';
  if (tier !== 'low' && build('reverb') && revMode !== 'off') {
    revSend = gain(LEVELS.reverb);
    if (revMode === 'conv') {
      const conv = reg(ac.createConvolver());
      conv.normalize = false;
      conv.buffer = toBuffer(ac, makeIR(data.irSeconds || 1.0, ac.sampleRate, mulberry32(0x1e5)));
      chain(revSend, conv, biquad('highpass', 100), biquad('lowpass', 3000), sum);
    } else {
      const pre = chain(revSend, biquad('highpass', 100), biquad('lowpass', 2600));
      const merge = reg(ac.createChannelMerger(2));
      merge.connect(sum);
      const taps = tier === 'high' ? [[0.043, 0.55, 0], [0.067, 0.5, 1], [0.109, 0.38, 0], [0.151, 0.3, 1]] : [[0.047, 0.6, 0], [0.071, 0.55, 1]];
      for (const [dt, g, c] of taps) {
        const dl = reg(ac.createDelay(0.5));
        dl.delayTime.value = dt;
        chain(pre, dl, gain(g)).connect(merge, 0, c);
      }
    }
    for (const [k, v] of [['surf', 0.2], ['breakers', 0.25], ['trees', 0.08]]) { const r = gain(v); bus[k].connect(r); r.connect(revSend); }
  }

  const sources = [];
  // Far breakers (too weak for their own voices) make the continuous roar breathe instead.
  const recent = []; // { t (arrival), w }
  const farEnv = (t) => {
    let s = 0;
    for (const e of recent) {
      const u = t - e.t;
      if (u > 0) s += e.w * (u < 1.4 ? u / 1.4 : Math.exp(-(u - 1.4) / 3.2));
    }
    return 1 - Math.exp(-0.45 * s);
  };

  // ---- surf roar bed -----------------------------------------------------------------------------
  if (build('surf')) {
    const s1 = loopSrc(buf.surfA, 1, 0.1);
    const g1 = gain(0);
    chain(s1, g1, bus.surf);
    auto(g1.gain, (t) => 0.5 + 0.7 * farEnv(t) + 0.06 * noise1(t / 3.1, 81));
    const s2 = loopSrc(buf.surfDeep, 1, 0.3);
    const g2 = gain(0);
    chain(s2, g2, bus.surf);
    auto(g2.gain, (t) => 0.7 * (0.55 + 0.55 * farEnv(t - 0.7) + 0.05 * noise1(t / 4.7, 82)));
    sources.push(s1, s2);
    if (tier !== 'low') {
      // mid "sizzle" of the wide surf zone ahead (distant foam)
      const s3 = loopSrc(buf.sizzle, 1, 0.6);
      const g3 = gain(0);
      chain(s3, g3, bus.surf);
      auto(g3.gain, (t) => 0.33 + 0.4 * farEnv(t - 1.5));
      sources.push(s3);
    }
  }

  // ---- wind -----------------------------------------------------------------------------------------
  // gust at a point: gusts advect downwind at GUST_ADVECTION m/s (same as the vegetation shaders)
  const gAt = (x, z) => { const d = (WIND_DIR[0] * x + WIND_DIR[1] * z) / GUST_ADVECTION; return (t) => gustAt(t - d); };
  const gMic = gAt(0, 0);
  if (build('wind')) {
    // brightness follows the gust by crossfading two band-limited beds (no filter automation);
    // each channel hears the gust of a point 5 m to its side, so gusts sweep sea (left) -> right
    // (high tier only; medium/low use one gain per bed)
    const sweep = tier === 'high';
    const gL = gAt(-5, 0), gR = gAt(5, 0);
    const merge = sweep ? reg(ac.createChannelMerger(2)) : null;
    if (merge) merge.connect(bus.wind);
    const turb = (t, q, sd) => 1 + (0.12 + 0.25 * q) * (0.65 * noise1(t * 1.7, sd) + 0.35 * noise1(t * 4.1, sd + 1));
    const lvl = (q) => 0.3 + 1.1 * Math.pow(q, 1.4);
    for (const [b, off, bright] of [[buf.windLo, 0.45, false], [buf.windHi, 0.15, true]]) {
      const s = loopSrc(b, 1, off);
      const split = sweep ? reg(ac.createChannelSplitter(2)) : null;
      if (split) s.connect(split);
      (sweep ? [gL, gR] : [gMic]).forEach((g, c) => {
        const gg = gain(0);
        if (sweep) { split.connect(gg, c); gg.connect(merge, 0, c); } else chain(s, gg, bus.wind);
        auto(gg.gain, (t) => { const q = g(t); return lvl(q) * (bright ? 0.15 + 0.75 * q : 1.0 - 0.55 * q) * turb(t + (bright ? 0.13 : 0), q, 71 + c * 7); });
      });
      sources.push(s);
    }
    // air hiss (very high, gust-dependent)
    const sw = loopSrc(buf.air, 1.0, 0.2);
    const gw = gain(0);
    chain(sw, gw, bus.wind);
    auto(gw.gain, (t) => 0.03 + 0.09 * Math.pow(gMic(t), 2));
    sources.push(sw);
    if (tier !== 'low') {
      // residual low-frequency wind rumble on a windshielded mic (~ gust^2, analysis/audio.md §3)
      const sr = loopSrc(buf.buffetBed, 1.0, 0.25);
      const gr = gain(0);
      chain(sr, gr, bus.wind);
      auto(gr.gain, (t) => 0.22 * Math.pow(0.45 + 1.1 * gMic(t), 2) * (1 + 0.25 * noise1(t * 2.3, 91)));
      sources.push(sr);
    }
  }

  // ---- phone-mic buffeting: only in the strongest gusts, reads as light mic overload -------------
  if (build('buffet') && tier !== 'low') {
    const s = loopSrc(buf.buffetBed, 1.0, 0.7);
    const vca = gain(0);
    const mod = loopSrc(buf.buffetMod, 1.0, 0.0, false);
    const depth = gain(0);
    chain(mod, depth, vca.gain);
    const shaper = reg(ac.createWaveShaper());
    shaper.curve = softClipCurve(1024, 3);
    chain(s, vca, shaper, biquad('peaking', 350, 0.8, 4), biquad('lowpass', 900), bus.buffet);
    auto(depth.gain, (t) => 3 * Math.pow(Math.max(0, (gMic(t) - 0.65) / 0.35), 1.5));
    auto(mod.playbackRate, (t) => 0.75 + 0.6 * gMic(t)); // faster flapping in stronger gusts
    sources.push(s, mod);
  }

  // ---- trees: she-oak crowns B, C (right-front), foliage clump E (left frame edge) ----------------
  if (build('trees')) {
    const G = (q) => 0.45 + 1.1 * q; // gust multiplier (gustMulAt)
    const crowns = [
      // gust fn, pan, amplitude, flutter rate, bed offsets
      [gAt(5.5, -19.8), 0.35, 1.0, 1.0, 0.55, 0.2],
      [gAt(11.3, -20.5), 0.7, 0.75, 1.23, 0.1, 0.7],
    ];
    if (tier === 'low') crowns.length = 1;
    for (const [g, pan, amp, fr, o1, o2] of crowns) {
      const sLo = loopSrc(buf.sighLo, 1, o1), sHi = loopSrc(buf.sighHi, 1, o2);
      const gl = gain(0), gh = gain(0), vca = gain(0), pn = reg(panner(pan));
      const fl = loopSrc(buf.flutterMod, fr, o1, false), depth = gain(0);
      chain(fl, depth, vca.gain);
      chain(sLo, gl, vca); chain(sHi, gh, vca); chain(vca, pn, bus.trees);
      // aeolian band 2.1 -> 3.4 kHz as the gust rises (crossfade), level ~ gust^3
      const x = (t) => Math.max(0, Math.min(1, (g(t) - 0.2) / 0.6));
      auto(gl.gain, (t) => Math.cos(x(t) * Math.PI * 0.5));
      auto(gh.gain, (t) => Math.sin(x(t) * Math.PI * 0.5));
      auto(depth.gain, (t) => amp * (0.05 + 0.55 * Math.pow(G(g(t)), 3)));
      auto(fl.playbackRate, (t) => fr * (0.7 + 0.8 * g(t)));
      sources.push(sLo, sHi, fl);
    }
    const gB = crowns[0][0];
    const c = loopSrc(buf.crackleR, 1.0, 0.2, false);
    const gc = gain(0);
    chain(c, gc, bus.trees);
    auto(gc.gain, (t) => { const q = gB(t); return 0.1 + 1.2 * Math.pow(q, 2); });
    auto(c.playbackRate, (t) => 0.8 + 0.5 * gB(t));
    sources.push(c);

    // left foliage clump close to the phone: drier crackle with fast flutter
    if (tier !== 'low') {
      const gE = gAt(-2.1, -3.3);
      const c2 = loopSrc(buf.crackleL, 1.0, 0.65);
      const v2 = gain(0);
      const fl2 = loopSrc(buf.flutterMod, 1.37, 0.5, false);
      const d2 = gain(0);
      chain(fl2, d2, v2.gain);
      chain(c2, v2, bus.trees);
      auto(d2.gain, (t) => { const q = gE(t); return 0.08 + 1.3 * Math.pow(q, 2.2); });
      sources.push(c2, fl2);
    }
  }

  // ---- one-shot events ---------------------------------------------------------------------------------
  const maxFar = tier === 'high' ? 8 : tier === 'medium' ? 6 : 4;
  const FAR_MIN = 0.08; // weaker far events only feed farEnv
  const farVoices = []; // { lvl, envs, src, end }
  let nearCount = 0;

  function oneShot(b, at, dur, offsetSec, rate = 1) {
    const s = ac.createBufferSource();
    s.buffer = b; s.loop = true; s.playbackRate.value = rate;
    s.start(at, offsetSec % b.duration);
    s.stop(at + dur);
    return s;
  }

  // Shared filter banks: per-event nodes are only sources, panners and gain envelopes, so a crash
  // "sweep" (bright -> dark) is a crossfade between fixed low-passes, never an automated biquad.
  const bank = {};
  {
    const mk = (...fs) => { const inp = fs[0]; chain(...fs, bus.breakers); return inp; };
    bank.bright = mk(biquad('lowpass', 4200), biquad('highpass', 220));
    bank.mid = mk(biquad('lowpass', 1300), biquad('highpass', 110));
    bank.dark = mk(biquad('lowpass', 420), biquad('highpass', 50)); // also carries the thumps
    bank.fizz = mk(biquad('highpass', 2400), biquad('lowpass', 7000));
    bank.direct = bus.breakers; // pre-filtered buffers (drain)
  }

  // Envelope as a value curve sampled at ~30-40 points/s (fine enough for a 0.12 s rise).
  // main: two-stage crash shape; subs: [{dt, a}] sub-impacts; turbulence: 3-10 Hz roughness.
  function envCurve(o) {
    const pps = o.pps || 30;
    const n = Math.max(8, Math.min(500, Math.ceil(o.dur * pps)));
    const c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * o.dur;
      const u = t - (o.delay || 0);
      let v = crashShape(u, o.rise, o.tau1, o.tau2, o.b);
      if (o.subs) for (const s of o.subs) v += s.a * crashShape(u - s.dt, s.rise, o.tau1 * 0.7, o.tau2 * 0.6, o.b * 0.6);
      if (o.turb) v *= 1 + o.turb * Math.min(1, Math.max(0, u) / (o.rise + 0.2)) * (0.6 * noise1(t * 4.3, o.seed) + 0.4 * noise1(t * 9.7, o.seed + 1));
      v *= Math.min(1, (o.dur - t) / (0.15 * o.dur));
      c[i] = Math.max(0, v * o.peak);
    }
    return c;
  }
  function envTo(dest, src, at, dur, curve) {
    const g = ac.createGain();
    g.gain.value = 0;
    g.gain.setValueCurveAtTime(curve, at, dur);
    src.connect(g);
    g.connect(dest);
    return g;
  }

  function breakerGeom(ev) {
    const dx = (ev.x ?? -60) - CAM[0], dz = (ev.z ?? -400) - CAM[2];
    const dh = Math.hypot(dx, dz);
    const d = Math.hypot(dh, CAM[1]);
    const size = Math.max(0.05, ev.size ?? ev.strength ?? ev.amp ?? ev.intensity ?? 0.7);
    // level: ~1/d with extra air/ground absorption, relative to 100 m
    const lvl = size * Math.pow(100 / Math.max(d, 45), 0.95) * Math.exp(-d / 2500);
    return { dx, dh, d, size, lvl };
  }

  function playBreaker(at, ev, rnd, geo) {
    const { dx, dh, d, size, lvl } = geo;
    const rockish = ev.kind === 'rock' || ev.kind === 'platform';
    const near = rockish || d < 220;
    if (!near) {
      if (lvl < FAR_MIN) return;
      // voice cap: steal the quietest far voice if the new one is clearly louder
      const now = ac.currentTime;
      for (let i = farVoices.length - 1; i >= 0; i--) if (farVoices[i].end < now) farVoices.splice(i, 1);
      if (farVoices.length >= maxFar) {
        let qi = 0;
        for (let i = 1; i < farVoices.length; i++) if (farVoices[i].lvl < farVoices[qi].lvl) qi = i;
        const q = farVoices[qi];
        if (lvl < 1.3 * q.lvl || !q.envs[0].gain.cancelAndHoldAtTime) return;
        const t0 = Math.max(now + 0.02, at - 0.3);
        for (const g of q.envs) { try { g.gain.cancelAndHoldAtTime(t0); g.gain.setTargetAtTime(0, t0, 0.12); } catch (e) { /* ignore */ } }
        try { q.src.stop(t0 + 0.6); } catch (e) { /* ignore */ }
        farVoices.splice(qi, 1);
      }
    }
    const pan = Math.max(-0.9, Math.min(0.9, (dx / Math.max(dh, 1)) * 0.85));
    const bright = Math.exp(-d / 280) * (0.6 + 0.5 * size); // share of the bright band (air absorption)
    // impact rise, impact decay (tau1) down to a turbulent roar (b) that decays with tau2
    const rise = near ? 0.12 + 0.13 * rnd() : 0.4 + 0.5 * rnd() + d / 2500;
    const tau1 = 0.4 + 0.2 * rnd();
    const tau2 = (near ? 2.0 + 1.2 * rnd() : 2.2 + 1.0 * rnd() + d / 900) * (0.8 + 0.3 * size); // rock foam decays with ~2.2 s
    const b = 0.35 + 0.15 * rnd();
    const dur = rise + tau2 * (near ? 2.4 : 2.0) + 0.3;
    const subs = [];
    const nSub = near ? 1 + Math.floor(rnd() * 3) : Math.floor(rnd() * 3);
    for (let i = 0; i < nSub; i++) {
      subs.push({ dt: rise + (near ? 0.15 + 0.55 * rnd() : 0.3 + 0.9 * rnd()), a: Math.pow(10, -(3 + 5 * rnd()) / 20), rise: near ? 0.05 + 0.08 * rnd() : 0.2 + 0.3 * rnd() });
    }
    const seed = Math.floor(rnd() * 1e6);
    const pps = near ? 40 : 25;

    const pp = panner(pan);
    const mono = near || d < 300;
    const s = oneShot(mono ? buf.pinkM : buf.pink, at, dur, rnd() * 17, 0.9 + 0.2 * rnd());
    s.connect(pp);
    const nodes = [s, pp];
    const envs = [];
    const env = (dest, src, a0, d0, curve) => { const g = envTo(dest, src, a0, d0, curve); nodes.push(g); envs.push(g); return g; };
    const base = { dur, rise, tau1, tau2, b, subs, pps };
    // the sweep: the bright band dies first, the dark rumble lasts longest
    if (bright > 0.2) env(bank.bright, pp, at, dur, envCurve({ ...base, tau1: tau1 * 0.7, tau2: tau2 * 0.45, b: b * 0.8, turb: 0.45, seed, peak: lvl * bright * 2.4 }));
    env(bank.mid, pp, at, dur, envCurve({ ...base, tau2: tau2 * 0.8, turb: 0.35, seed: seed + 3, peak: lvl * (0.9 + 0.5 * (1 - bright)) }));
    env(bank.dark, pp, at, dur, envCurve({ ...base, rise: rise * 1.3 + 0.05, tau1: tau1 * 1.3, b: Math.min(0.7, b + 0.1), turb: 0.25, seed: seed + 5, peak: lvl * 0.75 }));
    // foam fizz / wash: hiss swelling after the crash and retreating slowly
    if (d < 480) {
      const fz = lvl * (near ? 0.55 : 0.4) * (d < 400 ? 1 : 0.7);
      env(bank.fizz, pp, at, dur, envCurve({ dur, rise: 0.8 + 0.5 * rnd(), tau1: 1.5, tau2: tau2 * 0.6, b: 0.5, delay: rise * 0.8, turb: 0.3, seed: seed + 7, peak: fz, pps: 20 }));
    }

    if (near && (!rockish || ev.heavy || d < 120)) {
      // low thump of the impact
      const tdur = 1.6;
      const sb = oneShot(buf.brown, at, tdur, rnd() * 12, 1);
      const pb = panner(pan * 0.8);
      sb.connect(pb);
      env(bank.dark, pb, at, tdur, envCurve({ dur: tdur, rise: 0.08, tau1: 0.35, tau2: 0.35, b: 0, subs: subs.slice(0, 1), pps: 50, peak: lvl * 1.3 }));
      nodes.push(sb, pb);
    }
    if (rockish && ev.heavy && tier !== 'low') {
      // bubbly drain cascading off the rocks after the surge
      const dl = 0.8 + 0.7 * rnd(), dd = 1.5 + 1.0 * rnd();
      const sd = oneShot(buf.drain, at + dl, dd + 0.3, rnd() * 4, 0.9 + 0.2 * rnd());
      const pd = panner(pan);
      sd.connect(pd);
      env(bank.direct, pd, at + dl, dd + 0.3, envCurve({ dur: dd + 0.3, rise: 0.35, tau1: dd * 0.5, tau2: dd * 0.5, b: 0, turb: 0.5, seed: seed + 9, pps: 30, peak: lvl * 0.3 * Math.min(1, size + 0.3) }));
      nodes.push(sd, pd);
    }

    if (near) nearCount++;
    else farVoices.push({ lvl, envs, src: s, end: at + dur });
    s.onended = () => {
      if (near) nearCount--;
      for (const n of nodes) { try { n.disconnect(); } catch (e) { /* ignore */ } }
    };
  }

  // ---- scheduling ----------------------------------------------------------------------------------------
  const CTL = 0.05;
  let ctlUntil = null; // visual time up to which param ramps are scheduled
  let evUntil = null; // visual time up to which event *arrivals* are scheduled
  const MAX_DELAY = 5.0; // s, sound travel time of the farthest ocean events (~1.7 km)

  function scheduleControls(t0, t1, toAudio, now) {
    if (ctlUntil != null && ctlUntil < t0 - 2 * CTL) ctlUntil = Math.floor(t0 / CTL) * CTL - CTL; // after a hitch
    let tc = ctlUntil == null ? Math.ceil(t0 / CTL) * CTL : ctlUntil + CTL;
    for (; tc <= t1 + 1e-9; tc += CTL) {
      const at = Math.max(now, toAudio(tc));
      for (const a of autos) {
        const v = a.fn(tc);
        if (!a.started) { a.param.setValueAtTime(v, at); a.started = true; }
        else a.param.linearRampToValueAtTime(v, at);
      }
      ctlUntil = tc;
    }
  }

  function eventsIn(t0, t1) {
    let evs = null;
    if (breakerSource) {
      try {
        const r = breakerSource(t0, t1);
        if (Array.isArray(r)) {
          evs = r.map((e) => ({ ...e, t: e.t ?? e.time }))
            .filter((e) => Number.isFinite(e.t) && e.t >= t0 && e.t < t1)
            // the platform is voiced by rockEvents(); drop ocean events hugging it (hidden behind it)
            .filter((e) => !(e.kind === 'inner' && polygonSDF(e.x, e.z, PLATFORM_OUTLINE) < 10));
          evs.push(...rockEvents(t0, t1, surf));
        }
      } catch (e) { evs = null; }
    }
    if (!evs) evs = fallbackBreakerEvents(t0, t1, surf);
    return evs;
  }

  function scheduleEvents(t0, t1, toAudio, now) {
    const a = evUntil == null ? t0 : Math.max(evUntil, t0 - 1);
    if (t1 - a < 0.1) return; // batch: query the event sources at most ~10x per second
    while (recent.length && (recent[0].t < t0 - 20 || recent.length > 300)) recent.shift();
    const list = [];
    for (const ev of eventsIn(a - MAX_DELAY, t1)) {
      const geo = breakerGeom(ev);
      const ta = ev.t + geo.d / SOUND_SPEED; // sound arrives d/343 s after the white water appears
      if (ta < a || ta >= t1) continue;
      list.push({ ev, geo, ta });
    }
    list.sort((p, q) => p.ta - q.ta);
    for (const { ev, geo, ta } of list) {
      if (geo.d > 320) recent.push({ t: ta, w: Math.min(geo.lvl, 0.12) / 0.05 });
      const at = toAudio(ta);
      if (at < now - 0.05) continue;
      const rnd = mulberry32((Math.floor(ev.t * 1000) * 31 + Math.floor((ev.x || 0) * 7) + Math.floor((ev.z || 0) * 13)) >>> 0);
      if (!solo || solo.includes('breakers')) playBreaker(Math.max(at, now), ev, rnd, geo);
    }
    evUntil = t1;
  }

  function resetAutomation() {
    for (const a of autos) {
      try { a.param.cancelScheduledValues(0); } catch (e) { /* ignore */ }
      a.started = false;
    }
    ctlUntil = null; evUntil = null;
  }

  function startSources(at) {
    for (const s of sources) s.start(at, s.__offset || 0);
  }

  return {
    master, bus, sources, scheduleControls, scheduleEvents, resetAutomation, startSources, nodes,
    activeCount: () => farVoices.length + nearCount,
  };
}

// ------------------------------------------------------------------------------------------------
export default async function create(ctx) {
  const tier = ctx.quality?.tier || 'high';
  ctx.progress?.(0.1, 'Sound');
  const data = await makeSampleDataAsync(tier, (f) => ctx.progress?.(0.1 + 0.8 * f, 'Sound'));
  // wrap the sample data in context-free AudioBuffers now, so start() (after the click) is quick
  try {
    if (typeof AudioBuffer === 'function') {
      for (const k of Object.keys(data)) {
        if (data[k] && data[k].channels) { data[k].__buffer = toBuffer(null, data[k]); data[k].channels = null; } // free the JS copy
      }
    }
  } catch (e) { /* older browsers: buffers are created on start() */ }
  const surf = await loadSurfModel(ctx.modules?.ocean);
  ctx.progress?.(1, 'Sound');

  let ac = null, sc = null;
  let offset = 0; // audioTime - visualTime
  let synced = false;
  let running = false;
  let volume = LEVELS.master;
  let retryArmed = false;
  const LEAD_CTL = 0.25, LEAD_EV = 0.6;

  const breakerSource = () => {
    const oc = ctx.modules?.ocean;
    return oc && typeof oc.breakerEvents === 'function' ? (a, b) => oc.breakerEvents(a, b) : null;
  };

  function fadeIn(tc) {
    const now = ac.currentTime;
    sc.master.gain.cancelScheduledValues(0);
    sc.master.gain.setValueAtTime(0, now);
    sc.master.gain.setTargetAtTime(volume, now + 0.05, tc);
  }

  // Resolves within ~300 ms even if the browser leaves resume() pending (autoplay refusal).
  async function tryResume() {
    let p;
    try { p = ac.resume(); } catch (e) { return; }
    await Promise.race([Promise.resolve(p).catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
  }

  function armRetry() {
    if (retryArmed) return;
    retryArmed = true;
    const evs = ['pointerup', 'touchend', 'click', 'keydown'];
    const disarm = () => { evs.forEach((e) => window.removeEventListener(e, retry, true)); retryArmed = false; };
    const retry = () => {
      if (!ac) return;
      if (ac.state === 'running') { disarm(); return; }
      if (!running) return;
      try { ac.resume().then(() => { if (running) { synced = false; fadeIn(1.0); } }).catch(() => {}); } catch (e) { /* ignore */ }
    };
    evs.forEach((e) => window.addEventListener(e, retry, true));
    const onState = () => { if (ac.state === 'running') { if (retryArmed) disarm(); ac.removeEventListener?.('statechange', onState); } };
    ac.addEventListener?.('statechange', onState);
  }

  async function start() {
    if (ac) return resume();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    // iOS: play through the ring/silent switch (Safari 16.4+)
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* ignore */ }
    try {
      ac = new AC({ latencyHint: 'playback' });
    } catch (e) {
      ac = new AC();
    }
    sc = buildSoundscape(ac, { gustAt: ctx.wind.gustAt, data, tier, breakerSource: breakerSource(), surf, reverb: { 0: 'off', conv: 'conv' }[ctx.params?.get?.('reverb')] || 'taps' });
    sc.startSources(ac.currentTime + 0.02);
    running = true;
    synced = false;
    fadeIn(1.0); // ~3 s fade-in
    if (ac.state !== 'running') armRetry(); // armed before awaiting: some browsers need another gesture
    await tryResume();
    if (ac.state === 'running') fadeIn(1.0);
  }

  function update(t) {
    if (!ac || !sc || !running || ac.state !== 'running') return;
    const now = ac.currentTime;
    // audio reaches the ear (output latency) a little later than a frame reaches the eye (~25 ms)
    const lat = Math.min(0.3, Math.max(0, (ac.outputLatency || ac.baseLatency || 0.02) - 0.025));
    const measured = now - t - lat;
    if (!synced || Math.abs(measured - offset) > 0.25) {
      if (synced) sc.resetAutomation(now);
      offset = measured;
      synced = true;
    } else {
      offset += (measured - offset) * 0.02;
    }
    const toAudio = (tv) => tv + offset;
    sc.scheduleControls(t, t + LEAD_CTL, toAudio, now);
    sc.scheduleEvents(t, t + LEAD_EV, toAudio, now);
  }

  function suspend() {
    if (!ac || !running) return;
    running = false;
    const now = ac.currentTime;
    sc.master.gain.cancelScheduledValues(0);
    sc.master.gain.setValueAtTime(sc.master.gain.value, now);
    sc.master.gain.setTargetAtTime(0, now, 0.05);
    setTimeout(() => { if (!running && ac) ac.suspend().catch(() => {}); }, 250);
  }

  async function resume() {
    if (!ac) return;
    running = true;
    if (ac.state !== 'running') armRetry();
    await tryResume();
    if (!running) return; // suspended again meanwhile
    sc.resetAutomation(ac.currentTime);
    fadeIn(0.3);
    synced = false;
    if (ac.state !== 'running') armRetry();
  }

  function setVolume(v) {
    volume = Math.max(0, v);
    if (ac && sc && running) {
      const now = ac.currentTime;
      sc.master.gain.cancelScheduledValues(0);
      sc.master.gain.setValueAtTime(sc.master.gain.value, now);
      sc.master.gain.setTargetAtTime(volume, now, 0.2);
    }
  }

  return {
    start, update, suspend, resume, setVolume,
    get context() { return ac; },
  };
}

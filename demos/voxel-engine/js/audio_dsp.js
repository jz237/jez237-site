// Offline DSP building blocks for the procedural sound bank. Plain
// Float32Array math with no Web Audio dependency, so the same code runs in a
// worker (the game), on the main thread (fallback) and under Node (analysis).
//
// Everything is deterministic: the bank seeds this generator per sound and
// variant, so the rendered buffers are bit-identical on every machine.

let rs = 1;
export function srand(s) {
  rs = (Math.imul(s | 0, 0x9e3779b1) ^ 0x85ebca6b) | 0;
  if (rs === 0) rs = 1;
  // xorshift needs a few rounds before nearby seeds decorrelate.
  for (let i = 0; i < 4; i++) rnd();
}
export function rnd() {
  rs ^= rs << 13; rs ^= rs >>> 17; rs ^= rs << 5;
  return (rs >>> 0) * 2.3283064365386963e-10;
}
// The generator's state, for a render that is suspended part-way (see
// renderSteps in the bank) and must not care what ran in between.
export const rngState = () => rs;
export function rngRestore(s) { rs = s; }
export const rr = (a, b) => a + (b - a) * rnd();
// Log-uniform: frequencies and time constants are perceived on a ratio scale.
export const rlog = (a, b) => a * Math.pow(b / a, rnd());
export const nz = () => rnd() * 2 - 1;

export function white(n) {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = nz();
  return x;
}

// Pink noise (-3 dB/oct), Paul Kellet's economy filter.
export function pink(n) {
  const x = new Float32Array(n);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) {
    const w = nz();
    b0 = 0.99765 * b0 + w * 0.0990460;
    b1 = 0.96300 * b1 + w * 0.2965164;
    b2 = 0.57000 * b2 + w * 1.0526913;
    x[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25;
  }
  return x;
}

// Brown noise (-6 dB/oct) above ~30 Hz. Below that it is rolled off:
// infrasonic content is inaudible and only eats limiter headroom.
export function brown(n, sr) {
  const x = new Float32Array(n);
  const leak = 1 - 2 * Math.PI * 25 / sr;
  const g = 0.06 * Math.sqrt(48000 / sr);
  let y = 0, dc = 0;
  const a = 1 - Math.exp(-2 * Math.PI * 30 / sr);
  for (let i = 0; i < n; i++) {
    y = y * leak + nz() * g;
    dc += a * (y - dc);
    x[i] = y - dc;
  }
  return x;
}

export function lp1(x, sr, fc) {
  const a = 1 - Math.exp(-2 * Math.PI * fc / sr);
  let y = 0;
  for (let i = 0; i < x.length; i++) { y += a * (x[i] - y); x[i] = y; }
  return x;
}

export function hp1(x, sr, fc) {
  const a = 1 - Math.exp(-2 * Math.PI * fc / sr);
  let y = 0;
  for (let i = 0; i < x.length; i++) { y += a * (x[i] - y); x[i] -= y; }
  return x;
}

// RBJ biquad, in place. type: 'lp' | 'hp' | 'bp' (bp has 0 dB peak gain).
export function bq(x, sr, type, fc, q) {
  const w = 2 * Math.PI * Math.min(fc, sr * 0.45) / sr;
  const cs = Math.cos(w), al = Math.sin(w) / (2 * q);
  let b0, b1, b2;
  if (type === 'lp') { b1 = 1 - cs; b0 = b2 = b1 / 2; }
  else if (type === 'hp') { b1 = -(1 + cs); b0 = b2 = (1 + cs) / 2; }
  else { b0 = al; b1 = 0; b2 = -al; }
  const a0 = 1 + al, a1 = -2 * cs / a0, a2 = (1 - al) / a0;
  b0 /= a0; b1 /= a0; b2 /= a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i];
    const y = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = y;
    x[i] = y;
  }
  return x;
}

// State-variable filter with a moving cutoff (stable at any cutoff, unlike a
// swept biquad). mode: 0 low-pass, 1 band-pass, 2 high-pass. fcAt(seconds) is
// sampled at control rate.
export function svf(x, sr, mode, fcAt, q) {
  const k = 1 / q;
  let ic1 = 0, ic2 = 0, a1 = 0, a2 = 0, a3 = 0;
  for (let i = 0; i < x.length; i++) {
    if ((i & 31) === 0) {
      const g = Math.tan(Math.PI * Math.min(Math.max(fcAt(i / sr), 10), sr * 0.45) / sr);
      a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2;
    }
    const v0 = x[i];
    const v3 = v0 - ic2;
    const v1 = a1 * ic1 + a2 * v3;
    const v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1;
    ic2 = 2 * v2 - ic2;
    x[i] = mode === 0 ? v2 : mode === 1 ? v1 : v0 - k * v1 - v2;
  }
  return x;
}

// Multiply by fn(seconds).
export function shape(x, sr, fn) {
  for (let i = 0; i < x.length; i++) x[i] *= fn(i / sr);
  return x;
}

// Exponential decay with a short raised-cosine attack (seconds).
export function decay(x, sr, tau, attack = 0) {
  const k = Math.exp(-1 / (tau * sr));
  const na = Math.max(0, Math.floor(attack * sr));
  let e = 1;
  for (let i = 0; i < x.length; i++) {
    x[i] *= i < na ? e * (0.5 - 0.5 * Math.cos(Math.PI * i / na)) : e;
    if (i >= na) e *= k;
  }
  return x;
}

// A decaying noise burst: the excitation of a struck object. `lp` models the
// contact time: softer / slower hits put less energy into the high modes.
export function burst(sr, len, tau, lp = 0) {
  const x = white(Math.max(8, Math.floor(len * sr)));
  if (lp > 0) { lp1(x, sr, lp); lp1(x, sr, lp); }
  return decay(x, sr, tau);
}

export function mix(dst, src, at = 0, gain = 1) {
  const o = Math.max(0, Math.floor(at));
  const n = Math.min(src.length, dst.length - o);
  for (let i = 0; i < n; i++) dst[o + i] += src[i] * gain;
  return dst;
}

// One mode of a struck body: a two-pole resonator driven by `exc`, added into
// `out` starting at sample `at`. Scaled so a unit impulse rings at ~amp.
export function ring(out, exc, sr, f, tau, amp, at = 0) {
  const w = 2 * Math.PI * f / sr;
  if (!(w > 0) || w > 2.8) return;
  const r = Math.exp(-1 / (tau * sr));
  const a1 = 2 * r * Math.cos(w), a2 = -r * r, g = amp * Math.sin(w);
  let y1 = 0, y2 = 0;
  const o = Math.max(0, Math.floor(at)), m = exc.length;
  // Stop once the tail is 100 dB down: long buffers of short modes are common.
  const n = Math.min(out.length - o, m + Math.ceil(11.5 * tau * sr));
  for (let i = 0; i < n; i++) {
    const y = (i < m ? exc[i] * g : 0) + a1 * y1 + a2 * y2;
    y2 = y1; y1 = y;
    out[o + i] += y;
  }
}

// Sum of modes. `modes` is a flat [f, tau, amp, ...] list.
export function modal(out, exc, sr, modes, at = 0, gain = 1) {
  for (let i = 0; i + 2 < modes.length; i += 3) ring(out, exc, sr, modes[i], modes[i + 1], modes[i + 2] * gain, at);
  return out;
}

// Scatter band-passed noise grains: grit, crumble, patter, rustle. Times are
// t0 + span * u^skew (skew > 1 front-loads the cloud); later grains are
// quieter by `fall` (0..1).
export function grains(out, sr, count, t0, span, skew, fLo, fHi, tauLo, tauHi, gain, fall = 0.6, q = 1.4) {
  for (let k = 0; k < count; k++) {
    const u = Math.pow(rnd(), skew);
    const tau = rlog(tauLo, tauHi);
    const g = burst(sr, tau * 5, tau);
    // A ramped onset: grains are small collisions, not digital clicks.
    const na = Math.min(g.length, Math.max(2, Math.floor(sr * 0.0004)));
    for (let i = 0; i < na; i++) g[i] *= i / na;
    bq(g, sr, 'bp', rlog(fLo, fHi), q);
    const a = rnd();
    mix(out, g, (t0 + span * u) * sr, gain * (0.25 + 0.75 * a * a) * (1 - fall * u) * 3);
  }
  return out;
}

// Sine whose pitch falls (or rises) exponentially from f0 to f1.
export function sweep(n, sr, f0, f1, tauF) {
  const x = new Float32Array(n);
  let ph = 0;
  const k = Math.exp(-1 / (tauF * sr));
  let d = f0 - f1;
  for (let i = 0; i < n; i++) {
    x[i] = Math.sin(ph);
    ph += 2 * Math.PI * (f1 + d) / sr;
    d *= k;
  }
  return x;
}

// Stick-slip excitation: an irregular pulse train. rateAt(seconds) is the
// slip rate in Hz; each period is jittered so it never sounds like a tone
// generator. Pulses are short raised bumps (band-limited enough).
export function pulses(n, sr, rateAt, jitter, ampAt) {
  const x = new Float32Array(n);
  let t = 0;
  while (true) {
    const rate = Math.max(1, rateAt(t / sr));
    t += (sr / rate) * (1 + jitter * nz());
    const i = Math.floor(t);
    if (i + 3 >= n) break;
    const a = (ampAt ? ampAt(i / sr) : 1) * rr(0.6, 1);
    x[i] += a * 0.5; x[i + 1] += a; x[i + 2] += a * 0.5;
  }
  return x;
}

export function sat(x, drive) {
  const k = 1 / Math.tanh(drive);
  for (let i = 0; i < x.length; i++) x[i] = Math.tanh(x[i] * drive) * k;
  return x;
}

export function peak(x) {
  let p = 0;
  for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > p) p = a; }
  return p;
}

// Trim trailing near-silence, fade the tail to exactly zero (a buffer that
// ends mid-swing clicks), and normalise the peak.
export function finish(x, sr, level = 0.9, fade = 0.012) {
  const p = peak(x);
  if (!(p > 0)) return x;
  let end = x.length;
  const floor = p * 0.0015;
  while (end > 64 && Math.abs(x[end - 1]) < floor) end--;
  end = Math.min(x.length, end + Math.floor(sr * 0.004));
  const y = end < x.length ? x.slice(0, end) : x;
  const nf = Math.min(y.length, Math.floor(fade * sr));
  for (let i = 0; i < nf; i++) y[y.length - 1 - i] *= i / nf;
  const g = level / p;
  for (let i = 0; i < y.length; i++) y[i] *= g;
  return y;
}

// RMS gain a filter with impulse response `h` applies to noise that is flat
// between f0 and f1 Hz (the square root of its mean power response there).
export function bandGain(h, sr, f0, f1) {
  let n = 1;
  while (n < h.length) n <<= 1;
  const re = new Float64Array(n), im = new Float64Array(n);
  for (let i = 0; i < h.length; i++) re[i] = h[i];
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { const t = re[i]; re[i] = re[j]; re[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi;
        re[a] += xr; im[a] += xi;
        const t = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = t;
      }
    }
  }
  const lo = Math.max(1, Math.round(f0 * n / sr)), hi = Math.min(n / 2, Math.round(f1 * n / sr));
  let s = 0;
  for (let k = lo; k < hi; k++) s += re[k] * re[k] + im[k] * im[k];
  return Math.sqrt(s / (hi - lo));
}

// Make a noise bed loop seamlessly: equal-power crossfade of the overhang
// into the start.
export function loopable(x, sr, xfade = 0.25) {
  const nx = Math.floor(xfade * sr);
  const n = x.length - nx;
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) y[i] = x[i];
  for (let i = 0; i < nx; i++) {
    const t = i / nx;
    y[i] = x[i] * Math.sin(t * Math.PI / 2) + x[n + i] * Math.cos(t * Math.PI / 2);
  }
  return y;
}

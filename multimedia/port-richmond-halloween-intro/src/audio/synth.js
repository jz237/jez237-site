// Runtime-generated buffers: seeded noise, TV static, and synthesized reverb impulse responses.
// Everything is deterministic (seeded), so the realtime and offline renders are identical.

import { makeRng } from './rng.js';

const cache = new WeakMap(); // ctx -> { key: AudioBuffer }

function cached(ctx, key, make) {
  let m = cache.get(ctx);
  if (!m) { m = {}; cache.set(ctx, m); }
  if (!m[key]) m[key] = make();
  return m[key];
}

// one-pole low-pass in place
function onePoleLP(d, sr, fc) {
  const a = Math.exp(-2 * Math.PI * fc / sr);
  let y = 0;
  for (let i = 0; i < d.length; i++) { y = (1 - a) * d[i] + a * y; d[i] = y; }
}
function onePoleHP(d, sr, fc) {
  const a = Math.exp(-2 * Math.PI * fc / sr);
  let y = 0;
  let xp = 0;
  for (let i = 0; i < d.length; i++) { const x = d[i]; y = a * (y + x - xp); xp = x; d[i] = y; }
}

export function noiseBuffer(ctx, kind = 'white', seconds = 4, seed = 'noise') {
  return cached(ctx, `noise:${kind}:${seconds}:${seed}`, () => {
    const sr = ctx.sampleRate;
    const n = Math.floor(sr * seconds);
    const b = ctx.createBuffer(1, n, sr);
    const d = b.getChannelData(0);
    const r = makeRng(seed);
    if (kind === 'white') {
      for (let i = 0; i < n; i++) d[i] = r.next() * 2 - 1;
    } else {
      // pink (Paul Kellet)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < n; i++) {
        const w = r.next() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
    // crossfade the ends so the buffer loops without a click
    const k = Math.floor(sr * 0.05);
    for (let i = 0; i < k; i++) {
      const w = i / k;
      d[i] = d[i] * w + d[n - k + i] * (1 - w);
    }
    return b;
  });
}

// Analog-style TV static with crackle and level flutter, 3 s loop.
export function staticBuffer(ctx) {
  return cached(ctx, 'static', () => {
    const sr = ctx.sampleRate;
    const n = sr * 3;
    const b = ctx.createBuffer(1, n, sr);
    const d = b.getChannelData(0);
    const r = makeRng('tv-static');
    let flutter = 1;
    for (let i = 0; i < n; i++) {
      if (i % 480 === 0) flutter = 0.75 + 0.25 * r.next();
      d[i] = (r.next() * 2 - 1) * flutter;
      if (r.next() < 0.0009) d[i] += (r.next() < 0.5 ? -1 : 1) * (1.5 + 2 * r.next()); // crackle
    }
    onePoleHP(d, sr, 140);
    let pk = 0;
    for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(d[i]));
    for (let i = 0; i < n; i++) d[i] /= pk;
    const k = Math.floor(sr * 0.04);
    for (let i = 0; i < k; i++) { const w = i / k; d[i] = d[i] * w + d[n - k + i] * (1 - w); }
    return b;
  });
}

// Synthesized stereo impulse responses.
//   street: narrow rowhouse street, facades ~10.4 m apart: early lateral reflections + flutter, short open tail
//   room:   small furnished front room (3609)
//   tail:   long dark decay used to bridge the cut to black and for far echoes off the terminal wall
export function impulseResponse(ctx, kind) {
  return cached(ctx, `ir:${kind}`, () => {
    const sr = ctx.sampleRate;
    const P = {
      street: { dur: 1.6, rt60: 1.05, pre: 0.006, lp0: 9000, lp1: 2500, hp: 120, seed: 'ir-street', diffuse: 0.55,
        early: [[0.011, 0.55, -0.7], [0.029, 0.5, 0.75], [0.046, 0.33, -0.6], [0.061, 0.3, 0.55], [0.088, 0.22, -0.5],
          [0.091, 0.2, 0.45], [0.121, 0.15, -0.4], [0.152, 0.11, 0.35], [0.183, 0.08, -0.3], [0.214, 0.06, 0.25]] },
      room: { dur: 0.9, rt60: 0.42, pre: 0.002, lp0: 7000, lp1: 1800, hp: 90, seed: 'ir-room', diffuse: 1.0,
        early: [[0.0035, 0.5, 0.4], [0.0062, 0.45, -0.5], [0.0091, 0.38, 0.2], [0.012, 0.35, -0.3], [0.0155, 0.3, 0.6],
          [0.019, 0.25, -0.6], [0.024, 0.2, 0.1]] },
      tail: { dur: 4.2, rt60: 3.3, pre: 0.02, lp0: 3800, lp1: 900, hp: 70, seed: 'ir-tail', diffuse: 1.0, bloom: 0.09,
        early: [[0.031, 0.2, -0.5], [0.047, 0.18, 0.5], [0.083, 0.15, -0.2]] },
    }[kind];
    const n = Math.floor(P.dur * sr);
    const b = ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      const r = makeRng(P.seed + c);
      const decay = 6.91 / P.rt60;
      const pre = Math.floor(P.pre * sr);
      for (let i = pre; i < n; i++) {
        const t = (i - pre) / sr;
        let e = Math.exp(-decay * t);
        if (P.bloom) e *= 1 - Math.exp(-t / P.bloom);
        d[i] = (r.next() * 2 - 1) * e * P.diffuse;
      }
      // progressively darker tail: blend of two low-passed copies
      const dark = Float32Array.from(d);
      onePoleLP(d, sr, P.lp0);
      onePoleLP(dark, sr, P.lp1);
      onePoleLP(dark, sr, P.lp1);
      for (let i = 0; i < n; i++) {
        const w = Math.min(1, i / (n * 0.6));
        d[i] = d[i] * (1 - w) + dark[i] * w;
      }
      for (const [t, g, pan] of P.early) {
        const i = Math.floor(t * sr);
        const side = c === 0 ? (1 - pan) / 2 : (1 + pan) / 2;
        if (i < n) {
          d[i] += g * side * 1.6;
          if (i + 1 < n) d[i + 1] += g * side * 0.6;
        }
      }
      onePoleHP(d, sr, P.hp);
    }
    // normalise energy (unit-ish loudness for a send)
    let e2 = 0;
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) e2 += d[i] * d[i]; }
    const g = 1 / Math.sqrt(e2 / 2);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] *= g * 0.5; }
    return b;
  });
}

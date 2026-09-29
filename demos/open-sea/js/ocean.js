// GPU FFT ocean (Tessendorf) with JONSWAP wind sea + swell, five spectral cascades,
// choppy displacement, LEAN second moments for roughness, Lagrangian persistent foam.
import { gl, caps, Program, FS_VERT, tex2D, texArray, makeFBO, bindFBO, drawFS, generateMips, AsyncReadback } from './gl.js';
import { mulberry32, gaussian, clamp, lerp, smoothstep } from './math.js';

export const G = 9.81;
const TLOOP = 400;

// ---- sea state table: Douglas-like 0..9 -> significant height, 10 m wind ---------------
const TABLE = [
  { hs: 0.010, U: 0.3 }, { hs: 0.07, U: 1.4 }, { hs: 0.35, U: 3.3 }, { hs: 0.9, U: 5.4 },
  { hs: 1.9, U: 8.0 }, { hs: 3.1, U: 11.0 }, { hs: 4.8, U: 14.5 }, { hs: 7.0, U: 18.5 },
  { hs: 10.0, U: 23 }, { hs: 14.0, U: 29 },
];
export function seaParams(s) {
  s = clamp(s, 0, 9);
  const i = Math.min(8, Math.floor(s)), f = s - i;
  const a = TABLE[i], b = TABLE[i + 1];
  // Interpolate height geometrically so each step feels evenly spaced.
  const hs = Math.exp(lerp(Math.log(a.hs), Math.log(b.hs), f));
  const U = lerp(a.U, b.U, f);
  const tp = Math.max(0.7, 3.85 * Math.sqrt(hs));
  const swellHs = s < 3 ? lerp(0.05, 0.16, s / 3) : 0.3 * hs;
  const swellTp = clamp(Math.max(tp * 1.5, 9), 9, 17);
  return {
    s, hs, U, tp,
    gamma: lerp(3.3, 2.0, s / 9),
    spread: 2 + 13 * smoothstep(0, 4, s),
    swellHs, swellTp, swellGamma: 6, swellSpread: 40,
    swellOffset: 0.6,
    chop: lerp(0.55, 1.05, smoothstep(1.5, 8, s)),
  };
}

// JONSWAP scale A so that integral S(w) dw = (Hs/4)^2
function jonswapScale(hs, tp, gamma) {
  const wp = 2 * Math.PI / tp;
  let m = 0;
  const n = 4000, w0 = wp * 0.2, w1 = wp * 40;
  const lr = Math.log(w1 / w0);
  for (let i = 0; i < n; i++) {
    const w = w0 * Math.exp(lr * (i + 0.5) / n), dw = w * lr / n;
    const sigma = w <= wp ? 0.07 : 0.09;
    const r = Math.exp(-((w - wp) ** 2) / (2 * sigma * sigma * wp * wp));
    m += Math.pow(w, -5) * Math.exp(-1.25 * Math.pow(wp / w, 4)) * Math.pow(gamma, r) * dw;
  }
  const target = (hs / 4) ** 2;
  return { A: target / m, wp };
}

// Mean-square slope carried by a wavenumber band of the (wind sea + swell) spectrum.
export function bandMss(p, kLo, kHi) {
  let mss = 0;
  const parts = [
    { ...jonswapScale(p.hs, p.tp, p.gamma), gam: p.gamma },
    { ...jonswapScale(p.swellHs, p.swellTp, p.swellGamma), gam: p.swellGamma },
  ];
  const n = 2400, k0 = Math.max(kLo, 1e-4), lr = Math.log(kHi / k0);
  if (!(kHi > k0)) return 0;
  for (let i = 0; i < n; i++) {
    const k = k0 * Math.exp(lr * (i + 0.5) / n), dk = k * lr / n;
    const w = Math.sqrt(G * k), dwdk = G / (2 * w);
    for (const P of parts) {
      const sigma = w <= P.wp ? 0.07 : 0.09;
      const r = Math.exp(-((w - P.wp) ** 2) / (2 * sigma * sigma * P.wp * P.wp));
      const S = P.A * Math.pow(w, -5) * Math.exp(-1.25 * Math.pow(P.wp / w, 4)) * Math.pow(P.gam, r);
      mss += S * dwdk * k * k * dk;
    }
  }
  return mss;
}
export const resolvedMss = (p, kMax) => bandMss(p, 2e-3, kMax);

// inverse normal CDF (Acklam-style rational approximation, adequate for foam thresholds)
function probit(pv) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  pv = Math.min(1 - 1e-9, Math.max(1e-9, pv));
  if (pv < 0.02425) { const q = Math.sqrt(-2 * Math.log(pv)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (pv > 1 - 0.02425) { const q = Math.sqrt(-2 * Math.log(1 - pv)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = pv - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
// Whitecap fraction of the surface for a 10 m wind (Monahan-like, nudged up for visual readability)
export const whitecapFraction = U => Math.min(0.5, 9e-6 * Math.pow(Math.max(U, 0), 3.4));

const COMMON = `
const float PI = 3.14159265359;
const float TAU = 6.28318530718;
const float G = 9.81;
const float KM = 370.0;
float omega(float k) { return sqrt(G * k * (1.0 + k * k / (KM * KM))); }
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 packC(vec2 a, vec2 b) { return vec2(a.x - b.y, a.y + b.x); } // a + i b
`;

const SPECTRUM_FS = `
${COMMON}
in vec2 vUv;
uniform sampler2DArray uNoise;
uniform int uLayer, uN;
uniform float uL, uKLo, uKHi;
uniform vec4 uWind, uSwell; // A, wp, gamma, spread
uniform vec2 uDir;
out vec4 o;
float jonswap(float w, float A, float wp, float gam) {
  float sigma = w <= wp ? 0.07 : 0.09;
  float r = exp(-(w - wp) * (w - wp) / (2.0 * sigma * sigma * wp * wp));
  return A * pow(w, -5.0) * exp(-1.25 * pow(wp / w, 4.0)) * pow(gam, r);
}
float spreadD(vec2 kn, float ang, float w, float wp, float sp) {
  // cos^(2s)(theta/2) written as ((1+cos theta)/2)^s: no atan branch cut, exactly symmetric.
  float cosT = dot(kn, vec2(cos(ang), sin(ang)));
  float mu = w > wp ? -1.6 : 5.0;
  float s = clamp(sp * pow(w / wp, mu), 0.4, 300.0);
  return sqrt(s + 0.25) / (2.0 * sqrt(PI)) * pow(max(0.5 * (1.0 + cosT), 0.0), s);
}
vec2 h0(vec2 k, vec2 xi) {
  float kl = length(k);
  if (kl < uKLo || kl >= uKHi || kl < 1e-6) return vec2(0.0);
  float w = omega(kl);
  float dwdk = (G / (2.0 * w)) * (1.0 + 3.0 * kl * kl / (KM * KM));
  vec2 kn = k / kl;
  float S = jonswap(w, uWind.x, uWind.y, uWind.z) * spreadD(kn, uDir.x, w, uWind.y, uWind.w)
          + jonswap(w, uSwell.x, uSwell.y, uSwell.z) * spreadD(kn, uDir.y, w, uSwell.y, uSwell.w);
  float Sk = S * dwdk / kl;
  return xi * (0.5 * sqrt(Sk) * (TAU / uL));
}
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  ivec2 m = ivec2(p.x < uN / 2 ? p.x : p.x - uN, p.y < uN / 2 ? p.y : p.y - uN);
  vec2 k = vec2(m) * (TAU / uL);
  ivec2 pm = ivec2((uN - p.x) % uN, (uN - p.y) % uN);
  vec2 xi1 = texelFetch(uNoise, ivec3(p, uLayer), 0).xy;
  vec2 xi2 = texelFetch(uNoise, ivec3(pm, uLayer), 0).xy;
  o = vec4(h0(k, xi1), h0(-k, xi2));
}`;

const EVOLVE_FS = `
${COMMON}
in vec2 vUv;
uniform sampler2DArray uH0;
uniform int uLayer, uN, uTest;
uniform float uL, uTimeFrac;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  ivec2 m = ivec2(p.x < uN / 2 ? p.x : p.x - uN, p.y < uN / 2 ? p.y : p.y - uN);
  vec2 k = vec2(m) * (TAU / uL);
  float kl = length(k);
  if (kl < 1e-6) { o0 = vec4(0.0); o1 = vec4(0.0); return; }
  vec4 h0 = texelFetch(uH0, ivec3(p, uLayer), 0);
  float w0 = TAU / ${TLOOP.toFixed(1)};
  float n = floor(omega(kl) / w0 + 0.5);
  float ph = TAU * fract(n * uTimeFrac);
  vec2 e = vec2(cos(ph), sin(ph));
  // h(k,t) = h0(k) e^{-i w t} + conj(h0(-k)) e^{+i w t}: waves travel toward +k
  vec2 h = cmul(h0.xy, vec2(e.x, -e.y)) + cmul(vec2(h0.z, -h0.w), e);
  vec2 kn = k / kl;
  vec2 mi = vec2(h.y, -h.x);   // -i h
  vec2 ih = vec2(-h.y, h.x);   //  i h
  vec2 Dx = kn.x * mi, Dz = kn.y * mi;
  if (uTest == 1) { Dx = vec2(0.0); }
  vec2 Sx = k.x * ih, Sz = k.y * ih;
  vec2 Dxx = (k.x * k.x / kl) * h, Dzz = (k.y * k.y / kl) * h, Dxz = (k.x * k.y / kl) * h;
  o0 = vec4(packC(h, Dx), packC(Dz, Sx));
  o1 = vec4(packC(Sz, Dxx), packC(Dzz, Dxz));
}`;

const FFT_FS = `
${COMMON}
in vec2 vUv;
uniform sampler2D uIn0, uIn1;
uniform int uStage, uDir, uBits;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
int bitrev(int x, int bits) { int r = 0; for (int i = 0; i < 12; i++) { if (i >= bits) break; r = (r << 1) | ((x >> i) & 1); } return r; }
vec4 cm2(vec4 a, vec2 w) { return vec4(a.x * w.x - a.y * w.y, a.x * w.y + a.y * w.x, a.z * w.x - a.w * w.y, a.z * w.y + a.w * w.x); }
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  int x = uDir == 0 ? p.x : p.y;
  int hf = 1 << uStage;
  int size = hf << 1;
  int r = x & (size - 1);
  bool top = r < hf;
  int j = top ? r : r - hf;
  int i0 = (x - r) + j;
  int i1 = i0 + hf;
  if (uStage == 0) { i0 = bitrev(i0, uBits); i1 = bitrev(i1, uBits); }
  ivec2 c0 = uDir == 0 ? ivec2(i0, p.y) : ivec2(p.x, i0);
  ivec2 c1 = uDir == 0 ? ivec2(i1, p.y) : ivec2(p.x, i1);
  float ang = TAU * float(j) / float(size);
  vec2 w = vec2(cos(ang), sin(ang));
  vec4 a0 = texelFetch(uIn0, c0, 0), b0 = cm2(texelFetch(uIn0, c1, 0), w);
  vec4 a1 = texelFetch(uIn1, c0, 0), b1 = cm2(texelFetch(uIn1, c1, 0), w);
  o0 = top ? a0 + b0 : a0 - b0;
  o1 = top ? a1 + b1 : a1 - b1;
}`;

const ASSEMBLE_FS = `
${COMMON}
in vec2 vUv;
uniform sampler2D uIn0, uIn1;
uniform sampler2DArray uFoamPrev;
uniform int uLayer;
uniform float uChop;
uniform vec4 uFoamP; // jHi, jLo, decay, gain
layout(location = 0) out vec4 oDisp;
layout(location = 1) out vec4 oSlope;
layout(location = 2) out vec4 oFoam;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 a = texelFetch(uIn0, p, 0), b = texelFetch(uIn1, p, 0);
  float h = a.x, Dx = a.y, Dz = a.z, sx = a.w, sz = b.x, dxx = b.y, dzz = b.z, dxz = b.w;
  float jxx = 1.0 - uChop * dxx, jzz = 1.0 - uChop * dzz, jxz = -uChop * dxz;
  float J = jxx * jzz - jxz * jxz;
  oDisp = vec4(-uChop * Dx, h, -uChop * Dz, J - 1.0);
  oSlope = vec4(sx, sz, sx * sx, sz * sz);
  float src = 1.0 - smoothstep(uFoamP.y, uFoamP.x, J);
  float prev = texelFetch(uFoamPrev, ivec3(p, uLayer), 0).x;
  oFoam = vec4(max(prev * uFoamP.z, src * uFoamP.w), src * uFoamP.w, 0.0, 1.0);
}`;

export const CASCADE_DEFS = [
  { L: 2400, rot: 0.0, foam: false },
  { L: 500, rot: 0.47, foam: true },
  { L: 105, rot: -0.33, foam: true },
  { L: 22, rot: 0.89, foam: true },
  { L: 4.7, rot: 0.21, foam: false },
];

export class OceanSim {
  constructor({ N = 256, cascades = 5, seed = 20260929 } = {}) {
    this.N = N;
    this.bits = Math.log2(N);
    this.defs = CASCADE_DEFS.slice(0, cascades);
    this.count = this.defs.length;
    const idxHi = 0.1875 * N;
    this.defs.forEach((d, i) => {
      d.kHi = idxHi * 2 * Math.PI / d.L;
      d.kLo = i === 0 ? 0 : this.defs[i - 1].kHi;
    });
    this.kMax = this.defs[this.count - 1].kHi;
    this.time = 0;
    this.target = seaParams(4);
    this.cur = { ...this.target };
    this.windDir = 0.55;
    this.dirty = true;
    this.foamTau = 9;
    this.foamRes = N;

    // programs
    this.progSpec = new Program('ocean.spectrum', FS_VERT, SPECTRUM_FS);
    this.progEvolve = new Program('ocean.evolve', FS_VERT, EVOLVE_FS);
    this.progFFT = new Program('ocean.fft', FS_VERT, FFT_FS);
    this.progAsm = new Program('ocean.assemble', FS_VERT, ASSEMBLE_FS);

    // noise (independent Gaussian pair per mode per cascade)
    const rng = mulberry32(seed);
    const noise = new Float32Array(N * N * 2 * this.count);
    for (let i = 0; i < noise.length; i++) noise[i] = gaussian(rng);
    this.noise = texArray(N, N, this.count, { fmt: 'rg32f', filter: 'nearest', wrap: 'repeat' });
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.noise.tex);
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 0, N, N, this.count, gl.RG, gl.FLOAT, noise);
    this.h0 = texArray(N, N, this.count, { fmt: 'rgba32f', filter: 'nearest', wrap: 'repeat' });
    this.h0Fbos = this.defs.map((_, i) => makeFBO([{ tex: this.h0, layer: i }]));

    // FFT working set: two ping-pong pairs of RGBA32F
    const mk = () => tex2D(N, N, { fmt: 'rgba32f', filter: 'nearest', wrap: 'clamp' });
    this.A = [mk(), mk()]; this.B = [mk(), mk()];
    this.fboA = makeFBO(this.A); this.fboB = makeFBO(this.B);

    // outputs
    const mips = { mips: true, filter: 'linear', wrap: 'repeat', aniso: 8 };
    this.disp = texArray(N, N, this.count, { fmt: 'rgba16f', ...mips, aniso: 1 });
    this.slope = texArray(N, N, this.count, { fmt: 'rgba16f', ...mips });
    this.foam = [0, 1].map(() => texArray(N, N, this.count, { fmt: 'rgba16f', ...mips }));
    this.foamIdx = 0;
    this.asmFbos = [0, 1].map(par => this.defs.map((_, i) => makeFBO([
      { tex: this.disp, layer: i }, { tex: this.slope, layer: i }, { tex: this.foam[par], layer: i },
    ])));
    // clear foam
    for (const par of [0, 1]) for (let i = 0; i < this.count; i++) {
      const f = makeFBO([{ tex: this.foam[par], layer: i }]);
      bindFBO(f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    }
    this.mss = 0;
    // foam servo: mean foam per cascade is read back from the top mip level and steered towards the target whitecap cover
    this.topLevel = this.bits;
    this.topFbos = [0, 1].map(par => this.defs.map((_, i) => makeFBO([{ tex: this.foam[par], layer: i, level: this.topLevel }])));
    this.readers = this.defs.map(() => new AsyncReadback(4));
    this.foamDz = this.defs.map(() => 0);
    this.foamMean = this.defs.map(() => 0);
    this.updates = 0;
    this._calI = 0;
  }

  setSea(s, windDir) {
    this.target = seaParams(s);
    if (windDir !== undefined) this.windDir = windDir;
  }

  // Ease current parameters towards the target so the sea builds and eases rather than jumps.
  _ease(dt) {
    const t = this.target, c = this.cur;
    let changed = false;
    const k = 1 - Math.exp(-dt / 2.5);
    for (const key of ['s', 'hs', 'U', 'tp', 'gamma', 'spread', 'swellHs', 'swellTp', 'swellGamma', 'swellSpread', 'swellOffset', 'chop']) {
      const nv = Math.abs(t[key] - c[key]) < 1e-5 ? t[key] : c[key] + (t[key] - c[key]) * k;
      if (nv !== c[key]) changed = true;
      c[key] = nv;
    }
    if (this._lastWind !== this.windDir) { this._lastWind = this.windDir; changed = true; }
    if (changed || this.dirty) { this.dirty = false; this._regen(); }
  }

  _regen() {
    const c = this.cur, N = this.N;
    const wind = jonswapScale(c.hs, c.tp, c.gamma);
    const swell = jonswapScale(c.swellHs, c.swellTp, c.swellGamma);
    const p = this.progSpec.use();
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    p.t('uNoise', 0, this.noise).i('uN', N);
    this.defs.forEach((d, i) => {
      bindFBO(this.h0Fbos[i]);
      p.i('uLayer', i).f('uL', d.L).f('uKLo', d.kLo).f('uKHi', d.kHi)
        .v4('uWind', wind.A, wind.wp, c.gamma, c.spread)
        .v4('uSwell', swell.A, swell.wp, c.swellGamma, c.swellSpread)
        .v2('uDir', this.windDir - d.rot, this.windDir + c.swellOffset - d.rot);
      drawFS();
    });
    this.mss = resolvedMss(c, this.kMax);
    // per-cascade foam thresholds from linear theory: compression J-1 ~ N(0, chop*sqrt(mss_band))
    const W = whitecapFraction(c.U);
    const weights = [0, 0.5, 0.36, 0.14, 0];
    this.foamSig = this.defs.map(d => Math.sqrt(bandMss(c, d.kLo, d.kHi)) * c.chop);
    this.foamTarget = this.defs.map((d, i) => (d.foam && W > 2e-4 ? Math.min(0.6, 1.1 * W * (weights[i] || 0)) : 0));
    this._foamCfg();
  }

  _foamCfg() {
    this.foamCfg = this.defs.map((d, i) => {
      const t = this.foamTarget[i];
      if (t <= 0) return { on: 0, jHi: 0, jLo: 0 };
      const sig = this.foamSig[i];
      const z = probit(1 - Math.min(0.45, t * 0.4)) + this.foamDz[i];
      const j0 = 1 - sig * z;
      return { on: 1, jHi: j0 + 0.30 * sig, jLo: j0 - 0.45 * sig };
    });
  }

  // Steer each cascade's breaking threshold so its mean foam matches the target whitecap fraction.
  _servo() {
    if (this.freezeServo) return;
    let changed = false;
    this.readers.forEach((r, i) => {
      if (r.poll()) {
        const m = r.data[1];           // G = fraction of the surface currently breaking
        this.foamMean[i] = m;
        if (this.servoLog) this.servoLog.push([this.updates, i, m, this.foamTarget[i], this.foamDz[i]]);
        const t = -Math.log(1 - Math.min(0.9, this.foamTarget[i])) / [14, 14, 22, 90, 14][i];   // mean foam -> breaking fraction
        if (this.foamTarget[i] > 0) {
          const err = Math.log((Math.max(m, 1e-6)) / t);
          this.foamDz[i] = Math.min(4, Math.max(-2.5, this.foamDz[i] + Math.max(-0.7, Math.min(0.7, 0.45 * err))));
          changed = true;
        }
      }
    });
    if (changed) this._foamCfg();
    if (this.updates % 3 === 0) {
      for (let k = 0; k < this.count; k++) {
        const i = (this._calI + k) % this.count;
        if (this.foamTarget[i] > 0 && !this.readers[i].busy) { this.readers[i].request(this.topFbos[this.foamIdx][i], 0, 0, 1, 1); this._calI = i + 1; break; }
      }
    }
  }

  // Advance the simulation state (analytic in time so any dt is safe).
  update(dt) {
    this.time += dt;
    this._ease(dt);
    const N = this.N, c = this.cur;
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const tf = ((this.time % TLOOP) + TLOOP) % TLOOP / TLOOP;
    const prevFoam = this.foam[this.foamIdx], nextIdx = 1 - this.foamIdx;
    const decay = Math.exp(-dt / this.foamTau);
    this.defs.forEach((d, i) => {
      this.progEvolve.use().t('uH0', 0, this.h0).i('uLayer', i).i('uN', N).f('uL', d.L).f('uTimeFrac', tf).i('uTest', this._test || 0);
      bindFBO(this.fboA); drawFS();
      let src = this.fboA, dst = this.fboB, sa = this.A, sb = this.B;
      const f = this.progFFT.use().i('uBits', this.bits);
      for (let dir = 0; dir < 2; dir++) for (let st = 0; st < this.bits; st++) {
        f.t('uIn0', 0, sa[0]).t('uIn1', 1, sa[1]).i('uStage', st).i('uDir', dir);
        bindFBO(dst); drawFS();
        [src, dst] = [dst, src]; [sa, sb] = [sb, sa];
      }
      // after an even number of passes the result lives in A
      const fc = this.foamCfg ? this.foamCfg[i] : { on: 0, jHi: 0, jLo: 0 };
      this.progAsm.use().t('uIn0', 0, sa[0]).t('uIn1', 1, sa[1]).t('uFoamPrev', 2, prevFoam)
        .i('uLayer', i).f('uChop', c.chop)
        .v4('uFoamP', fc.jHi, fc.jLo, decay, fc.on);
      bindFBO(this.asmFbos[nextIdx][i]); drawFS();
    });
    this.foamIdx = nextIdx;
    generateMips(this.disp); generateMips(this.slope); generateMips(this.foam[this.foamIdx]);
    this.updates++;
    this._servo();
  }

  get foamTex() { return this.foam[this.foamIdx]; }

  // GLSL-side cascade constants
  cascadeUniforms(originX, originZ) {
    const scale = new Float32Array(this.count * 4); // 1/L, rot cos, rot sin, L
    const off = new Float32Array(this.count * 2);
    this.defs.forEach((d, i) => {
      const cs = Math.cos(d.rot), sn = Math.sin(d.rot);
      scale.set([1 / d.L, cs, sn, d.L], i * 4);
      // uv offset of the origin in double precision, wrapped to [0,1)
      const u = (cs * originX + sn * originZ) / d.L, v = (-sn * originX + cs * originZ) / d.L;
      off[i * 2] = u - Math.floor(u); off[i * 2 + 1] = v - Math.floor(v);
    });
    return { scale, off };
  }
}

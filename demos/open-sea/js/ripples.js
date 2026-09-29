// Splash ripples: a damped 2D wave equation on a toroidal height field, advanced with a FIXED time step.
//
// Why it is built this way (the "blows up when frame times are uneven" failure):
//  * The integrator only ever uses dt = STEP (1/120 s). Frame time decides how many steps run, never their size,
//    so the Courant number c*dt/dx stays constant (~0.13, limit 0.71).
//  * At most MAX_STEPS run per frame; excess wall time is dropped (the ripples slow down instead of exploding
//    after a hitch / background tab).
//  * Rain drops are spawned per step from a hash of (texel, step index) with a fixed probability, so their number
//    and amplitude do not depend on the frame rate either. Nothing is injected in proportion to dt.
//  * The update is bounded: velocity damping, a Laplacian-mixing term that removes texel-scale noise, and a
//    smooth tanh limit on the height so even a bad state cannot grow without bound.
import { gl, caps, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS } from './gl.js';
import './glsl.js';

export const RIPPLE_STEP = 1 / 120;
export const RIPPLE_SIZE = 32;      // metres per (toroidal) tile

const STEP_FS = `
#include <common>
in vec2 vUv;
uniform sampler2D uState;      // rg = height (m), velocity (m/s)
uniform float uN, uDt, uDx, uC2, uDamp, uHMax, uMix;
uniform float uRainP;          // probability of a drop per texel per step
uniform float uAmp;            // drop amplitude (m)
uniform int uStepIdx;
uniform vec4 uSrc[4];          // moving disturbances: x, z (tile metres), radius (m), strength (m/s per step)
uniform vec2 uSrcCount;
uniform float uMaxStep;        // debug: force a bad state
out vec4 o;
vec2 S(ivec2 p) { return texelFetch(uState, ivec2((p.x + int(uN)) % int(uN), (p.y + int(uN)) % int(uN)), 0).rg; }
float dropAt(ivec2 c) {
  float h = hash21(vec2(c) + float(uStepIdx) * 0.7311);
  if (h > uRainP) return 0.0;
  float a = 0.55 + 0.9 * hash21(vec2(c).yx * 1.37 + float(uStepIdx) * 0.157);
  return a * a;
}
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec2 s = S(p);
  float lap = (S(p + ivec2(1, 0)).x + S(p - ivec2(1, 0)).x + S(p + ivec2(0, 1)).x + S(p - ivec2(0, 1)).x - 4.0 * s.x) / (uDx * uDx);
  float v = (s.y + uC2 * uDt * lap) * uDamp;
  float h = s.x + uDt * v;
  // smooth the texel-scale noise a little each step
  float avg = (S(p + ivec2(1, 0)).x + S(p - ivec2(1, 0)).x + S(p + ivec2(0, 1)).x + S(p - ivec2(0, 1)).x) * 0.25;
  h = mix(h, avg, uMix);
  // rain: each nearby texel may hold a drop this step; the impulse is spread over a small footprint
  if (uRainP > 0.0) {
    float add = 0.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      float d = dropAt(p + ivec2(x, y));
      if (d > 0.0) add += d * exp(-float(x * x + y * y) * 0.85);
    }
    h -= add * uAmp;                      // a drop first pushes the surface down, then it rebounds as a ring
    v += add * uAmp * 30.0;
  }
  // hull / bow disturbances
  vec2 wp = (vec2(p) + 0.5) * uDx;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uSrcCount.x) break;
    vec2 d = wp - uSrc[i].xy; d -= ${RIPPLE_SIZE}.0 * floor(d / ${RIPPLE_SIZE}.0 + 0.5);
    float r2 = dot(d, d) / (uSrc[i].z * uSrc[i].z);
    if (r2 < 9.0) v += uSrc[i].w * exp(-r2);
  }
  h = uHMax * tanh(h / uHMax);
  v = clamp(v, -3.0, 3.0);
  o = vec4(h, v, 0.0, 1.0);
}`;

export class Ripples {
  constructor(res = 1024) {
    this.N = res;
    const filt = caps.floatLinear ? 'linear' : 'nearest';
    this.a = tex2D(res, res, { fmt: 'rg32f', filter: filt, wrap: 'repeat' });
    this.b = tex2D(res, res, { fmt: 'rg32f', filter: filt, wrap: 'repeat' });
    this.fa = makeFBO([this.a]); this.fb = makeFBO([this.b]);
    for (const f of [this.fa, this.fb]) { bindFBO(f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    this.cur = this.a; this.curF = this.fa; this.oth = this.b; this.othF = this.fb;
    this.prog = new Program('ripples.step', FS_VERT, STEP_FS);
    this.acc = 0;
    this.stepIdx = 0;
    this.c = 0.42;                 // m/s, capillary-gravity minimum phase speed region
    this.rain = 0;
    this.sources = [];
    this.maxSteps = 5;
    this.stats = { steps: 0, dropped: 0 };
  }

  // advance by wall-clock dt using fixed steps; returns steps taken
  update(dt) {
    if (!(dt > 0)) return 0;
    this.acc += Math.min(dt, 0.25);
    let n = Math.floor(this.acc / RIPPLE_STEP);
    if (n > this.maxSteps) { this.stats.dropped += n - this.maxSteps; n = this.maxSteps; this.acc = 0; }   // time dilation instead of catching up
    else this.acc -= n * RIPPLE_STEP;
    if (n > 0) this._run(n);
    return n;
  }

  _run(n) {
    const dx = RIPPLE_SIZE / this.N;
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p = this.prog.use();
    const src = new Float32Array(16);
    this.sources.slice(0, 4).forEach((s, i) => src.set(s, i * 4));
    // drops per second across the tile at full rain
    const perSec = 16000 * this.rain * this.rain;
    const prob = perSec * RIPPLE_STEP / (this.N * this.N);
    p.f('uN', this.N).f('uDt', RIPPLE_STEP).f('uDx', dx).f('uC2', this.c * this.c).f('uDamp', Math.exp(-2.4 * RIPPLE_STEP))
      .f('uHMax', 0.02).f('uMix', 0.035).f('uRainP', prob).f('uAmp', 0.0011 * (0.6 + 0.6 * this.rain)).v4v('uSrc', src)
      .v2('uSrcCount', Math.min(4, this.sources.length), 0);
    for (let i = 0; i < n; i++) {
      p.t('uState', 0, this.cur).i('uStepIdx', this.stepIdx++ & 0xffff);
      bindFBO(this.othF); drawFS();
      [this.cur, this.oth] = [this.oth, this.cur]; [this.curF, this.othF] = [this.othF, this.curF];
      this.stats.steps++;
    }
  }
}

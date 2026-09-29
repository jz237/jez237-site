// Yacht wake: analytic Kelvin wave pattern (used by the water shaders) and a persistent foam trail map.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS, defineChunk } from './gl.js';
import './glsl.js';

export const TRAIL_SIZE = 128;   // metres covered by the (toroidal) trail map
export const TRAIL_RES = 1024;

defineChunk('wake', `
uniform vec4 uWakeA;   // yacht position relative to camera (x, z), heading (cos, sin)
uniform vec4 uWakeB;   // speed, wave height scale, on, unused
const int NW = 36;
// Kelvin ship-wave pattern: stationary plane waves at angles +-theta with k = g / (V^2 cos^2 theta).
// Returns (height, d/dx, d/dz) in world axes. 'terms' trims the sum for the vertex stage.
vec3 kelvinWake(vec2 pw, int terms) {
  if (uWakeB.z < 0.5) return vec3(0.0);
  vec2 d = pw - uWakeA.xy;
  vec2 fwd = uWakeA.zw, rgt = vec2(-fwd.y, fwd.x);
  float bx = dot(d, fwd), bz = dot(d, rgt);
  float V = max(uWakeB.x, 0.4);
  if (bx > 14.0 || bx < -300.0 || abs(bz) > 40.0 + 0.62 * (-bx)) return vec3(0.0);
  float r = length(vec2(bx, bz));
  float env = smoothstep(11.0, -4.0, bx) / sqrt(1.0 + r / 20.0) * smoothstep(300.0, 200.0, -bx);
  float h = 0.0, hx = 0.0, hz = 0.0, ws = 0.0;
  for (int j = 0; j < NW; j++) {
    if (j >= terms) break;
    float t = (float(j) + 0.5) / float(terms) * 2.0 - 1.0;
    float th = t * 1.36;
    float c = cos(th), s = sin(th);
    float k = 9.81 / (V * V * c * c);
    float A = exp(-pow(k * 0.85, 2.0) * 0.35) * c;
    float ph = k * (bx * c + bz * s);
    float cs = cos(ph), sn = sin(ph);
    h += A * cs; hx -= A * k * c * sn; hz -= A * k * s * sn; ws += A;
  }
  float sc = env * uWakeB.y / max(ws, 1e-3);
  vec2 g = (hx * fwd + hz * rgt) * sc;
  return vec3(h * sc, g);
}
float hullW(float x) {
  float B = 1.9 * 0.84, x0 = -0.5;
  if (x >= x0) { float t = clamp((x - x0) / 6.25, 0.0, 1.0); return B * pow(max(0.0, 1.0 - pow(t, 2.1)), 0.72) * 0.94; }
  float t = clamp((x0 - x) / 5.25, 0.0, 1.0);
  return B * (1.0 - 0.30 * pow(t, 2.3));
}
// distance to the hull waterline outline in the boat frame (x forward, z starboard)
float hullDist(vec2 b) {
  float dx = abs(b.x + 0.0) - 5.7;
  float dz = abs(b.y) - hullW(b.x);
  return length(max(vec2(dx, dz), 0.0)) + min(max(dx, dz), 0.0);
}
`);

const TRAIL_FS = `
#include <common>
#include <wake>
in vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uCur, uPrevPos, uFwd;     // positions modulo the map size, unit heading
uniform float uDecay, uAdd, uSize, uTime, uSpeedK, uDiff;
out vec4 o;
float segDist(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0); return length(pa - ba * h); }
void main() {
  vec2 q = vUv * uSize;
  vec2 dq = q - uCur; dq -= uSize * floor(dq / uSize + 0.5);
  vec2 dpv = uPrevPos - uCur; dpv -= uSize * floor(dpv / uSize + 0.5);
  vec2 rgt = vec2(-uFwd.y, uFwd.x);
  vec2 b = vec2(dot(dq, uFwd), dot(dq, rgt));
  vec2 tx = vec2(1.0 / ${TRAIL_RES}.0);
  float c0 = texture(uPrev, vUv).r;
  float nb = (texture(uPrev, vUv + vec2(tx.x, 0.0) * 1.6).r + texture(uPrev, vUv - vec2(tx.x, 0.0) * 1.6).r
            + texture(uPrev, vUv + vec2(0.0, tx.y) * 1.6).r + texture(uPrev, vUv - vec2(0.0, tx.y) * 1.6).r) * 0.25;
  float prevVal = mix(c0, nb, uDiff);              // slow lateral spreading: the wake widens and thins as it ages
  float stamp = 0.0;
  if (uSpeedK > 0.0) {
    // foam along the hull sides, strongest at the bow
    float hd = hullDist(b);
    float ring = smoothstep(0.55, 0.05, abs(hd - 0.10)) * (0.30 + 0.70 * smoothstep(-2.0, 5.0, b.x));
    // turbulent wake swept behind the stern
    vec2 sA = dpv - uFwd * 4.7, sB = -uFwd * 4.7;
    float ds = segDist(dq, sA, sB);
    float sw = smoothstep(0.85, 0.12, ds);
    float bowSplash = smoothstep(1.6, 0.0, length(b - vec2(5.4, 0.0))) * 1.3;
    float n = 0.35 + 1.1 * vnoise(q * 2.3 + uTime * 0.5) * (0.5 + 0.8 * vnoise(q * 0.7 - uTime * 0.2));
    stamp = (ring * 0.75 + sw * 0.95 + bowSplash) * n * uSpeedK;
  }
  o = vec4(clamp(prevVal * uDecay + stamp * uAdd, 0.0, 1.3), 0.0, 0.0, 1.0);
}`;

export class Trail {
  constructor() {
    this.a = tex2D(TRAIL_RES, TRAIL_RES, { fmt: 'r16f', filter: 'linear', wrap: 'repeat' });
    this.b = tex2D(TRAIL_RES, TRAIL_RES, { fmt: 'r16f', filter: 'linear', wrap: 'repeat' });
    this.fa = makeFBO([this.a]); this.fb = makeFBO([this.b]);
    this.prog = new Program('wake.trail', FS_VERT, TRAIL_FS);
    for (const f of [this.fa, this.fb]) { bindFBO(f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    this.cur = this.a; this.curF = this.fa; this.other = this.b; this.otherF = this.fb;
    this.prev = null;
    this.acc = 0;
  }
  // called with a fixed-ish step; the map only needs ~30 Hz
  update(dt, yacht, time, U = 0) {
    const S = TRAIL_SIZE, m = v => v - Math.floor(v / S) * S;
    const cur = [m(yacht.x), m(yacht.z)];
    const prev = this.prev || cur;
    const speedK = Math.min(1, Math.max(0, (yacht.speed - 0.7) / 2.2));
    const fwd = [Math.cos(yacht.psi), Math.sin(yacht.psi)];
    bindFBO(this.otherF); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this.prog.use().t('uPrev', 0, this.cur).v2('uCur', cur[0], cur[1]).v2('uPrevPos', prev[0], prev[1]).v2('uFwd', fwd[0], fwd[1])
      .f('uDecay', Math.exp(-dt / (6.5 / (1 + 0.9 * Math.min(1, Math.max(0, (U - 3) / 15)))))).f('uAdd', Math.min(dt, 0.1) * 3.2).f('uDiff', 1 - Math.exp(-dt * 1.4)).f('uSize', S).f('uTime', time).f('uSpeedK', speedK)
      .v4('uWakeA', 0, 0, 1, 0).v4('uWakeB', 0, 0, 0, 0);
    drawFS();
    [this.cur, this.other] = [this.other, this.cur]; [this.curF, this.otherF] = [this.otherF, this.curF];
    this.prev = cur;
  }
}

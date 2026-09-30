// Yacht wake: analytic Kelvin wave pattern (used by the water shaders) and a persistent foam trail map.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS, defineChunk } from './gl.js';
import './glsl.js';

export const TRAIL_SIZE = 256;   // metres covered by the (toroidal) trail map
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
  if (bx > 32.0 || bx < -300.0 || abs(bz) > 40.0 + 0.62 * (-bx)) return vec3(0.0);
  float r = length(vec2(bx, bz));
  float env = smoothstep(26.0, -18.0, bx) / sqrt(1.0 + r / 20.0) * smoothstep(300.0, 200.0, -bx);
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
`);

const TRAIL_FS = `
#include <common>
#include <wake>
#include <whirlpool>
in vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uCur, uStern, uPrevStern; // positions modulo the map, actual projected stern
uniform float uDecay, uAdd, uSize, uTime, uSpeedK, uDiff,uDt;
out vec4 o;
float segDist(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0); return length(pa - ba * h); }
void main() {
  vec2 q = vUv * uSize;
  vec2 dq = q - uCur; dq -= uSize * floor(dq / uSize + 0.5);
  vec2 sA = uPrevStern - uCur; sA -= uSize * floor(sA / uSize + 0.5);
  vec2 sB = uStern - uCur; sB -= uSize * floor(sB / uSize + 0.5);
  vec2 tx = vec2(1.0 / ${TRAIL_RES}.0);
  vec2 advected=fract(vUv-whirlFlow(dq)*uDt/uSize);
  float c0 = texture(uPrev, advected).r;
  float nb = (texture(uPrev, advected + vec2(tx.x, 0.0) * 1.6).r + texture(uPrev, advected - vec2(tx.x, 0.0) * 1.6).r
            + texture(uPrev, advected + vec2(0.0, tx.y) * 1.6).r + texture(uPrev, advected - vec2(0.0, tx.y) * 1.6).r) * 0.25;
  float prevVal = mix(c0, nb, uDiff);              // slow lateral spreading: the wake widens and thins as it ages
  float stamp = 0.0;
  if (uSpeedK > 0.0) {
    // Side contact is shaded at the actual 3D hull/water intersection. Only
    // the stern leaves persistent foam here; a flat ring cannot
    // follow a heeling hull and floats away from its moving waterline.
    // turbulent wake swept behind the stern
    float ds = segDist(dq, sA, sB);
    float sw = smoothstep(2.5,.35,ds);
    float n = 0.35 + 1.1 * vnoise(q * 2.3 + uTime * 0.5) * (0.5 + 0.8 * vnoise(q * 0.7 - uTime * 0.2));
    stamp = sw * 0.75 * n * uSpeedK;
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
  update(dt, yacht, time, U = 0,whirlpool) {
    const S = TRAIL_SIZE, m = v => v - Math.floor(v / S) * S;
    const cur = [m(yacht.x), m(yacht.z)];
    const sternPoint=yacht.toWorld([-22.2,0,0]),stern=[m(sternPoint[0]),m(sternPoint[2])],prev=this.prev||stern;
    const speedK = Math.min(1, Math.max(0, (yacht.speed - 0.7) / 2.2));
    bindFBO(this.otherF); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p=this.prog.use().t('uPrev', 0, this.cur).v2('uCur', cur[0], cur[1]).v2('uStern',stern[0],stern[1]).v2('uPrevStern',prev[0],prev[1])
      .f('uDecay', Math.exp(-dt / (6.5 / (1 + 0.9 * Math.min(1, Math.max(0, (U - 3) / 15)))))).f('uAdd', Math.min(dt, 0.1) * 1.7).f('uDiff', 1 - Math.exp(-dt)).f('uSize', S).f('uTime', time).f('uSpeedK', speedK)
      .v4('uWakeA', 0, 0, 1, 0).v4('uWakeB', 0, 0, 0, 0).f('uDt',Math.min(dt,.1));
    whirlpool.bind(p,{x:yacht.x,z:yacht.z});
    drawFS();
    [this.cur, this.other] = [this.other, this.cur]; [this.curF, this.otherF] = [this.otherF, this.curF];
    this.prev = stern;
  }
}

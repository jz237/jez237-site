// Samples the ocean surface at a handful of world points on the GPU and reads the results back asynchronously.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS, AsyncReadback } from './gl.js';

// The original sixteen slots retain their meaning (boat/camera/whales/spray).
// Larger hulls append a distributed waterplane grid after those slots.
const MAXP = 32;
const PROBE_FS = `
#include <whirlpool>
in vec2 vUv;
uniform sampler2DArray uDisp;
uniform int uCascades, uCount;
uniform vec4 uCasc[5];
uniform vec2 uUV[${MAXP * 5}];
uniform vec2 uPoints[${MAXP}];
out vec4 o;
vec2 toWorld(vec2 v, int i) { vec4 c = uCasc[i]; return vec2(c.y * v.x - c.z * v.y, c.z * v.x + c.y * v.y); }
vec3 eval(int p, vec2 g) {          // displacement (xz) and height at lagrangian offset g
  vec3 D = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    vec4 c = uCasc[i];
    vec2 uv = uUV[p * 5 + i] + vec2(c.y * g.x + c.z * g.y, -c.z * g.x + c.y * g.y) * c.x;
    vec4 d = textureLod(uDisp, vec3(uv, float(i)), 0.0);
    vec2 dw = toWorld(d.xz, i);
    D += vec3(dw.x, d.y, dw.y);
  }
  return D;
}
void main() {
  int p = int(gl_FragCoord.x);
  if (p >= uCount) { o = vec4(0.0); return; }
  vec2 g = vec2(0.0);
  for (int it = 0; it < 4; it++) g = -eval(p, g).xz;     // find the water particle that ends up under the point
  float e = 0.6;
  float h = eval(p, g).y+whirlSurface(uPoints[p]).x;
  float hx = eval(p, g + vec2(e, 0.0)).y+whirlSurface(uPoints[p]+vec2(e,0.0)).x;
  float hz = eval(p, g + vec2(0.0, e)).y+whirlSurface(uPoints[p]+vec2(0.0,e)).x;
  o = vec4(h, (hx - h) / e, (hz - h) / e, 1.0);
}`;

export class WaveProbe {
  constructor() {
    this.prog = new Program('probe', FS_VERT, PROBE_FS);
    this.tex = tex2D(MAXP, 1, { fmt: 'rgba32f', filter: 'nearest' });
    this.fbo = makeFBO([this.tex]);
    this.reader = new AsyncReadback(MAXP * 4);
    this.result = new Float32Array(MAXP * 4);
    this.points = [];
    this.fresh = false;
  }
  request(sim, points,whirlpool) {
    if(points.length>MAXP)throw new Error('Wave probe budget exceeded');
    if (this.reader.busy) return false;
    this.points = points;
    this.vortexHeights=points.map(([x,z])=>whirlpool.sample(x,z).height);
    const uv = new Float32Array(MAXP * 5 * 2);
    points.forEach((p, k) => {
      const { off } = sim.cascadeUniforms(p[0], p[1]);
      for (let i = 0; i < sim.count; i++) { uv[(k * 5 + i) * 2] = off[i * 2]; uv[(k * 5 + i) * 2 + 1] = off[i * 2 + 1]; }
    });
    const { scale } = sim.cascadeUniforms(0, 0);
    bindFBO(this.fbo);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p=this.prog.use().t('uDisp', 0, sim.disp).i('uCascades', sim.count).i('uCount', points.length).v4v('uCasc', scale).v2v('uUV', uv).v2v('uPoints',new Float32Array(points.flat()));
    whirlpool.bind(p,{x:0,z:0});
    drawFS();
    this.reader.request(this.fbo, 0, 0, MAXP, 1);
    return true;
  }
  poll() {
    if (this.reader.poll()) { this.result.set(this.reader.data); this.fresh = true; return true; }
    return false;
  }
  // [height, dh/dx, dh/dz] for probe k
  get(k) { const r = this.result; return [r[k * 4], r[k * 4 + 1], r[k * 4 + 2]]; }
}

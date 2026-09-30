// Fish schools (instanced procedural fish with a swimming-wave vertex shader) and drifting marine snow.
import { gl, Program } from './gl.js';
import { mulberry32, clamp } from './math.js';
import { bindLighting } from './lighting.js';
import './glsl.js';
import './fx.js';

// ---- mesh: unit-length fish, nose at +x, tail at -x, y up, z to the side ---------------------------------------
function buildFishMesh() {
  const V = [], I = [];
  const NS = 14, NR = 10;
  const prof = t => { // t: 0 tail base .. 1 nose  -> [halfHeight, halfWidth]
    const body = Math.pow(Math.sin(Math.min(1, t * 1.05) * Math.PI * 0.94 + 0.10), 0.75);
    return [0.135 * body * (0.35 + 0.65 * Math.min(1, t * 2.2)), 0.085 * body];
  };
  for (let i = 0; i <= NS; i++) {
    const t = i / NS, x = -0.34 + t * 0.84;
    const [hh, hw] = prof(t);
    for (let j = 0; j <= NR; j++) {
      const a = j / NR * Math.PI * 2;
      const y = Math.sin(a) * hh - 0.0, z = Math.cos(a) * hw;
      // normal of an ellipse in the section plane
      const n = [0, Math.sin(a) / Math.max(hh, 1e-3), Math.cos(a) / Math.max(hw, 1e-3)];
      const l = Math.hypot(n[1], n[2]) || 1;
      V.push(x, y, z, 0.15 * (i / NS) , n[1] / l, n[2] / l, t, j / NR);   // pos, dummy, normal.yz, u, v
    }
  }
  const stride = 8;
  const idx = [];
  for (let i = 0; i < NS; i++) for (let j = 0; j < NR; j++) {
    const a = i * (NR + 1) + j, b = a + 1, c = a + NR + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const addTri = (a, b, c, n, u = 0.5) => {
    const base = V.length / stride;
    for (const p of [a, b, c]) V.push(p[0], p[1], p[2], 1, n[1], n[2], u, 0.5);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 1);
  };
  // tail fin (forked), dorsal fin, pectoral fins
  addTri([-0.30, 0.0, 0.0], [-0.52, 0.16, 0.0], [-0.44, 0.0, 0.0], [0, 0, 1], 0.0);
  addTri([-0.30, 0.0, 0.0], [-0.44, 0.0, 0.0], [-0.52, -0.16, 0.0], [0, 0, 1], 0.0);
  addTri([0.02, 0.115, 0.0], [-0.14, 0.115, 0.0], [-0.10, 0.20, 0.0], [0, 0, 1], 0.3);
  addTri([0.20, -0.09, 0.02], [0.08, -0.09, 0.02], [0.08, -0.15, 0.10], [0, 0.3, 1], 0.6);
  addTri([0.20, -0.09, -0.02], [0.08, -0.09, -0.02], [0.08, -0.15, -0.10], [0, 0.3, -1], 0.6);
  return { verts: new Float32Array(V), idx: new Uint16Array(idx), stride };
}

const FISH_VS = `
layout(location = 0) in vec4 aPos;       // xyz local, w unused
layout(location = 1) in vec4 aNU;        // normal.y, normal.z (as flags), u, v  (x = fin flag)
layout(location = 2) in vec4 iPosScale;  // world pos (camera relative) xyz, scale
layout(location = 3) in vec4 iDirPhase;  // forward xyz, phase
layout(location = 4) in vec4 iColor;     // species, tint, speed, unused
uniform mat4 uVP;
uniform float uTime;
out vec3 vN;
out vec3 vRel;
out vec4 vLocal;
out vec4 vCol;
void main() {
  vec3 f = normalize(iDirPhase.xyz);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 r = normalize(cross(f, up));
  vec3 u = cross(r, f);
  vec3 p = aPos.xyz;
  float body = clamp(0.5 - p.x, 0.0, 1.2);
  float wag = 0.10 * body * body * sin(uTime * (4.0 + iColor.z * 6.0) + iDirPhase.w - p.x * 7.0);
  p.z += wag;
  // slight bend of the whole body in the direction of the tail beat
  vec3 nrm = vec3(0.0, aNU.x, aNU.y);
  vec3 wp = iPosScale.xyz + (f * p.x + u * p.y + r * p.z) * iPosScale.w;
  vN = mat3(f, u, r) * nrm;
  vRel = wp;
  vLocal = vec4(aPos.xyz, aNU.z);
  vCol = iColor;
  gl_Position = uVP * vec4(wp, 1.0);
}`;
const FISH_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <underwater>
in vec3 vN;
in vec3 vRel;
in vec4 vLocal;
in vec4 vCol;
layout(location = 0) out vec4 o;
void main() {
  vec3 sunW, beam, Ed0;
  underwaterLight(sunW, beam, Ed0);
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vRel);
  float yl = vLocal.y;
  float sp = vCol.x;
  vec3 back, belly;
  if (sp < 0.5) { back = vec3(0.10, 0.20, 0.30); belly = vec3(0.82, 0.86, 0.86); }        // sardine: blue-green back, silver flanks
  else if (sp < 1.5) { back = vec3(0.16, 0.22, 0.17); belly = vec3(0.78, 0.78, 0.66); }  // jack: olive back, pale belly
  else { back = vec3(0.05, 0.10, 0.20); belly = vec3(0.70, 0.72, 0.74); }                // tuna: deep blue back
  float g = smoothstep(-0.10, 0.09, yl);
  vec3 alb = mix(belly, back, g);
  alb *= 0.9 + 0.2 * vCol.y;
  // lateral line stripe and eye
  alb = mix(alb, vec3(0.9, 0.75, 0.3), smoothstep(0.012, 0.0, abs(yl - 0.01)) * step(sp, 1.5) * step(sp, 0.5 + 1.0) * 0.25);
  float eye = smoothstep(0.03, 0.02, length(vLocal.xy - vec2(0.36, 0.035))) * step(0.0, N.z * 0.0 + 1.0);
  alb = mix(alb, vec3(0.01), eye * 0.8);
  // fins are darker
  if (vLocal.w < 0.05) alb = mix(alb, vec3(0.05, 0.08, 0.10), 0.7);
  vec3 dl = Ed0 / PI * (0.55 + 0.45 * clamp(N.y, -1.0, 1.0)) + beam * max(dot(N, -sunW), 0.0) * 0.5 / PI;
  float fres = pow(1.0 - abs(dot(N, V)), 3.0);
  vec3 col = alb * dl + Ed0 * fres * 0.35 * (0.3 + 0.7 * (1.0 - g));   // silver sheen
  o = vec4(col, 1.0);
}`;

const SNOW_VS = `
#include <common>
uniform mat4 uVP;
uniform vec3 uCamAbs;
uniform float uTime, uSize, uCount;
out float vA;
out vec3 vRel;
void main() {
  float fi = float(gl_VertexID);
  vec3 h = hash33(vec3(fi, 3.7, fi * 0.31));
  vec3 p = (h * 2.0 - 1.0) * vec3(28.0, 16.0, 28.0);
  p += vec3(sin(uTime * 0.11 + fi), sin(uTime * 0.07 + fi * 1.3) * 0.6 - uTime * 0.03, cos(uTime * 0.09 + fi * 0.7)) * 0.6;
  vec3 rel = mod(p - vec3(uCamAbs.x, 0.0, uCamAbs.z) + vec3(28.0, 0.0, 28.0), vec3(56.0, 32.0, 56.0)) - vec3(28.0, 16.0, 28.0);
  rel.y = mod(p.y - uCamAbs.y + 16.0, 32.0) - 16.0;
  vec4 c = uVP * vec4(rel, 1.0);
  gl_Position = c;
  gl_PointSize = clamp(uSize / max(c.w, 0.3), 1.0, 4.0);
  vA = step(fi, uCount) * (0.25 + 0.75 * h.y) * smoothstep(1.0, 3.0, length(rel));
  vRel = rel;
}`;
const SNOW_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <underwater>
in float vA;
in vec3 vRel;
layout(location = 0) out vec4 o;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.15, length(d)) * vA;
  if (a < 0.01) discard;
  vec3 sunW, beam, Ed0;
  underwaterLight(sunW, beam, Ed0);
  float dist = length(vRel);
  float zc = max(uCamAbs.y * -1.0, 0.0);
  vec3 lit = (Ed0 * 0.06 + beam * 0.35) * exp(-KD * (zc + vRel.y * -1.0 * 0.0));
  vec3 col = lit * exp(-CATT * dist);
  o = vec4(col * 1.6, a * 0.9);
}`;

export class Fish {
  constructor() {
    const m = buildFishMesh();
    this.prog = new Program('fish', FISH_VS, FISH_FS);
    this.vao = gl.createVertexArray(); gl.bindVertexArray(this.vao);
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, m.verts, gl.STATIC_DRAW);
    // per-vertex: 8 floats = pos(3) dummy(1) | flag,ny,nz? -> we packed [x,y,z,dummy, ny, nz, u, v]
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
    this.ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW);
    this.nIdx = m.idx.length;
    this.max = 420;
    this.inst = new Float32Array(this.max * 12);
    this.ib2 = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.ib2); gl.bufferData(gl.ARRAY_BUFFER, this.inst.byteLength, gl.DYNAMIC_DRAW);
    for (const [loc, off] of [[2, 0], [3, 16], [4, 32]]) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 48, off); gl.vertexAttribDivisor(loc, 1); }
    gl.bindVertexArray(null);

    const rng = mulberry32(777);
    this.fish = [];
    const mk = (n, species, len, gen) => { for (let i = 0; i < n; i++) this.fish.push({ sp: species, len: len * (0.85 + 0.3 * rng()), seed: rng() * 1000, r: rng(), r2: rng(), r3: rng(), gen }); };
    mk(260, 0, 0.21, 'ball'); mk(46, 1, 0.55, 'ring'); mk(6, 2, 1.4, 'roam');
    this.snow = new Program('snow', SNOW_VS, SNOW_FS);
    this.nFish = this.fish.length;
  }

  // position of fish i at time t (yacht-relative centre, world axes)
  _pos(f, t, c) {
    const s = f.seed;
    if (f.gen === 'ball') {
      // tight rotating bait ball around a slowly wandering centre
      const cx = c[0] + 4.5 * Math.sin(t * 0.05) - 1.0, cz = c[2] + 3.5 * Math.cos(t * 0.043 + 1.0) - 3.0, cy = -5.2 + 1.0 * Math.sin(t * 0.09);
      const rad = 0.6 + 1.9 * Math.pow(f.r, 0.6) * (1 + 0.15 * Math.sin(t * 0.7 + s));
      const th = t * (0.55 + 0.35 * f.r2) + f.r3 * 6.283, ph = f.r2 * 3.1416 + 0.4 * Math.sin(t * 0.3 + s);
      return [cx + rad * Math.sin(ph) * Math.cos(th), cy + rad * 0.75 * Math.cos(ph), cz + rad * Math.sin(ph) * Math.sin(th)];
    }
    if (f.gen === 'ring') {
      const th = t * (0.22 + 0.04 * f.r2) + f.r3 * 6.283, rad = 9 + 3.5 * f.r + 1.2 * Math.sin(t * 0.3 + s);
      return [c[0] + rad * Math.cos(th), -4.2 - 3.5 * f.r2 + 0.5 * Math.sin(t * 0.5 + s), c[2] + rad * Math.sin(th)];
    }
    const th = t * 0.09 * (1 + f.r) + s, rad = 16 + 9 * f.r2;
    return [c[0] + rad * Math.cos(th) * 1.2, -9 - 6 * f.r + 1.5 * Math.sin(t * 0.2 + s), c[2] + rad * Math.sin(th * 1.3)];
  }

  update(t, center) {
    const c = center;
    let n = 0;
    for (const f of this.fish) {
      const p = this._pos(f, t, c), q = this._pos(f, t + 0.06, c);
      const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], dl = Math.hypot(d[0], d[1], d[2]) || 1;
      const o = n * 12;
      this.inst[o] = p[0]; this.inst[o + 1] = p[1]; this.inst[o + 2] = p[2]; this.inst[o + 3] = f.len;
      this.inst[o + 4] = d[0] / dl; this.inst[o + 5] = d[1] / dl; this.inst[o + 6] = d[2] / dl; this.inst[o + 7] = f.seed;
      this.inst[o + 8] = f.sp; this.inst[o + 9] = f.r; this.inst[o + 10] = dl / 0.06 / (f.len * 3.0) * 0.4; this.inst[o + 11] = 0;
      n++;
    }
    this.n = n;
  }

  draw(ctx, VP, camAbs) {
    const cam = ctx.cam;
    // instance positions are absolute: make them camera relative
    const rel = new Float32Array(this.n * 12);
    for (let i = 0; i < this.n; i++) {
      const o = i * 12;
      rel.set(this.inst.subarray(o, o + 12), o);
      rel[o] -= cam.x; rel[o + 1] -= cam.y; rel[o + 2] -= cam.z;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ib2);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, rel);
    const p = this.prog.use();
    bindLighting(p, ctx);
    p.m4('uVP', VP).f('uTime', ctx.time).f('uUseSun', ctx.useSun ? 1 : 0);
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
    gl.bindVertexArray(this.vao);
    gl.drawElementsInstanced(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0, this.n);
  }

  drawSnow(ctx, VP, camAbs, intensity) {
    if (intensity <= 0) return;
    const p = this.snow.use();
    bindLighting(p, ctx);
    p.m4('uVP', VP).v3('uCamAbs', ctx.cam.x, ctx.cam.y, ctx.cam.z).f('uTime', ctx.time).f('uSize', 26).f('uCount', 2600 * intensity).f('uUseSun', ctx.useSun ? 1 : 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.enable(gl.DEPTH_TEST); gl.depthMask(false);
    gl.bindVertexArray(gl.emptyVAO || (gl.emptyVAO = gl.createVertexArray()));
    gl.drawArrays(gl.POINTS, 0, 2600);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
}

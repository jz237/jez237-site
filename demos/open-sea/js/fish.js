// Fish schools (instanced procedural fish with a swimming-wave vertex shader) and drifting marine snow.
import { gl, Program } from './gl.js';
import { mulberry32, clamp } from './math.js';
import { FishBehavior } from './fish-behavior.js';
import { bindLighting } from './lighting.js';
import './glsl.js';
import './fx.js';

// ---- mesh: unit-length fish, nose at +x, tail at -x, y up, z to the side ---------------------------------------
function buildFishMesh() {
  const V = [], I = [];
  const NS = 24, NR = 14;
  const prof = t => { // t: 0 tail base .. 1 nose  -> [halfHeight, halfWidth]
    const body = Math.pow(Math.max(.008, Math.sin(t * Math.PI)), 0.85);
    return [0.135 * body * (0.35 + 0.65 * Math.min(1, t * 2.2)), 0.085 * body];
  };
  for (let i = 0; i <= NS; i++) {
    const t = i / NS, x = -0.34 + t * 0.84;
    const [hh, hw] = prof(t);
    for (let j = 0; j <= NR; j++) {
      const a = j / NR * Math.PI * 2;
      const y = Math.sin(a) * hh - 0.0, z = Math.cos(a) * hw;
      // normal of an ellipse in the section plane
      const before=prof(Math.max(0,t-.005)),after=prof(Math.min(1,t+.005));
      const dh=(after[0]-before[0])/.0084,dw=(after[1]-before[1])/.0084;
      const n = [-(Math.sin(a)**2*dh/Math.max(hh,.003)+Math.cos(a)**2*dw/Math.max(hw,.003)), Math.sin(a)/Math.max(hh,.003), Math.cos(a)/Math.max(hw,.003)];
      const l = Math.hypot(...n) || 1;
      V.push(x, y, z, n[0]/l, n[1]/l, n[2]/l, t, 0);
    }
  }
  const stride = 8;
  const idx = [];
  for (let i = 0; i < NS; i++) for (let j = 0; j < NR; j++) {
    const a = i * (NR + 1) + j, b = a + 1, c = a + NR + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const addTri = (a, b, c, n, u = 0.5, kind = 1) => {
    const base = V.length / stride;
    for (const p of [a, b, c]) V.push(p[0], p[1], p[2], n[0], n[1], n[2], u, kind);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 1);
  };
  // tail fin (forked), dorsal fin, pectoral fins
  addTri([-0.30, 0.0, 0.0], [-0.52, 0.16, 0.0], [-0.44, 0.0, 0.0], [0, 0, 1], 0.0);
  addTri([-0.30, 0.0, 0.0], [-0.44, 0.0, 0.0], [-0.52, -0.16, 0.0], [0, 0, 1], 0.0);
  addTri([0.02, 0.115, 0.0], [-0.14, 0.115, 0.0], [-0.10, 0.20, 0.0], [0, 0, 1], 0.3, 2);
  addTri([0.20, -0.09, 0.02], [0.08, -0.09, 0.02], [0.08, -0.15, 0.14], [0, 0.3, 1], 0.6, 3);
  addTri([0.20, -0.09, -0.02], [0.08, -0.09, -0.02], [0.08, -0.15, -0.14], [0, 0.3, -1], 0.6, 3);
  return { verts: new Float32Array(V), idx: new Uint16Array(idx), stride };
}

const FISH_VS = `
layout(location = 0) in vec4 aPos;       // xyz local, normal.x
layout(location = 1) in vec4 aNU;        // normal.y, normal.z, longitudinal u, fin kind
layout(location = 2) in vec4 iPosScale;  // world pos (camera relative) xyz, scale
layout(location = 3) in vec4 iDirPhase;  // forward xyz, phase
layout(location = 4) in vec4 iColor;     // species, tint, speed, independent fin phase
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
  float body = clamp((0.28 - p.x) / 0.8, 0.0, 1.2);
  float phase = iDirPhase.w - p.x * 9.0;
  float amplitude = 0.07 + 0.055 * clamp(iColor.z, 0.0, 1.5);
  float wag = amplitude * body * body * sin(phase);
  p.z += wag;
  // Pectoral and dorsal fins have their own varying oscillators.
  float fin = aNU.w;
  if (fin > 2.5) {
    float reach = clamp((abs(aPos.z) - 0.025) / 0.115, 0.0, 1.0);
    p.y += reach * 0.045 * sin(iColor.w + sign(aPos.z) * 0.7);
    p.x += reach * 0.015 * cos(iColor.w);
  } else if (fin > 1.5) p.z += max(aPos.y - .11, 0.0) * .2 * sin(iColor.w * .7);
  else if (fin > .5) p.z += abs(aPos.y) * .10 * sin(iColor.w * 1.1);
  vec3 nrm = vec3(aPos.w, aNU.x, aNU.y);
  float derivative = amplitude * (-2.5 * body * sin(phase) - 9.0 * body * body * cos(phase));
  nrm.x -= derivative * nrm.z;
  vec3 wp = iPosScale.xyz + (f * p.x + u * p.y + r * p.z) * iPosScale.w;
  vN = mat3(f, u, r) * nrm;
  vRel = wp;
  vLocal = vec4(aPos.xyz, fin);
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
  // Small scale variation only appears when a scale occupies several pixels.
  float scaleFootprint = max(length(dFdx(vLocal.xy)), length(dFdy(vLocal.xy))) * 180.0;
  float scales = sin(vLocal.x * 180.0 + sin(vLocal.y * 210.0) * 0.6);
  alb *= 1.0 + scales * 0.035 * (1.0 - smoothstep(0.2, 0.9, scaleFootprint));
  float eyeGlint = smoothstep(0.009, 0.003, length(vLocal.xy - vec2(0.362, 0.043))) * eye;
  alb = mix(alb, vec3(0.48), eyeGlint * 0.65);
  // fins are darker
  if (vLocal.w > 0.5) alb = mix(alb, vec3(0.14, 0.18, 0.20), 0.58);
  vec3 dl = Ed0 / PI * (0.55 + 0.45 * clamp(N.y, -1.0, 1.0)) + beam * max(dot(N, -sunW), 0.0) * 0.5 / PI;
  float fres = pow(1.0 - abs(dot(N, V)), 5.0);
  vec3 H = normalize(V - sunW);
  float specular = pow(max(dot(N, H), 0.0), 64.0);
  vec3 col = alb * dl + Ed0 * fres * 0.08 * (0.3 + 0.7 * (1.0 - g)) + beam * specular * 0.16;   // silver sheen
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
    // Per-vertex: xyz, normal.x, normal.y, normal.z, longitudinal u, fin kind.
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
    const mk = (n, species, len) => { for (let i = 0; i < n; i++) this.fish.push({ sp: species, len: len * (0.85 + 0.3 * rng()), seed: rng() * 1000, r: rng(), r2: rng(), r3: rng() }); };
    mk(260, 0, 0.21); mk(46, 1, 0.55); mk(6, 2, 1.4);
    this.behavior = new FishBehavior(this.fish);
    this.snow = new Program('snow', SNOW_VS, SNOW_FS);
    this.nFish = this.fish.length;
  }

  update(t, center, recenter = false) {
    this.behavior.update(t, center, recenter);
    let n = 0;
    for (const f of this.fish) {
      const p = f.p, d = f.heading;
      const o = n * 12;
      this.inst[o] = p[0]; this.inst[o + 1] = p[1]; this.inst[o + 2] = p[2]; this.inst[o + 3] = f.len;
      this.inst[o + 4] = d[0]; this.inst[o + 5] = d[1]; this.inst[o + 6] = d[2]; this.inst[o + 7] = f.phase;
      this.inst[o + 8] = f.sp; this.inst[o + 9] = f.r; this.inst[o + 10] = f.speed / Math.max(f.len * 4.0, .2); this.inst[o + 11] = f.finPhase;
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
    p.m4('uVP', VP).v3('uCamAbs', ctx.cam.x, ctx.cam.y, ctx.cam.z).f('uTime', ctx.time).f('uSize', 12).f('uCount', 900 * intensity).f('uUseSun', ctx.useSun ? 1 : 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.enable(gl.DEPTH_TEST); gl.depthMask(false);
    gl.bindVertexArray(gl.emptyVAO || (gl.emptyVAO = gl.createVertexArray()));
    gl.drawArrays(gl.POINTS, 0, 2600);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
}

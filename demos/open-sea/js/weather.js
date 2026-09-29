// Rain streaks and lightning (bolts, flash timing), plus the fullscreen scene composite (rain veil, underwater medium).
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS } from './gl.js';
import { mulberry32, clamp } from './math.js';
import { bindLighting } from './lighting.js';
import './glsl.js';

// ---------------------------------------------------------------------------------------------------------------
// Rain streaks
const RAIN_VS = `
#include <common>
uniform mat4 uVP;
uniform vec3 uCamAbs;      // absolute camera position
uniform vec3 uWindV;       // drop velocity (horizontal drift + fall)
uniform float uTime, uRadius, uHeight, uShutter, uIntensity, uCount;
uniform vec2 uViewport;
out float vAlpha;
out vec3 vRel;
void main() {
  int id = gl_VertexID;
  float t = float(id >> 1);          // head / tail
  float side = float((id & 1) * 2 - 1);
  float fi = float(gl_InstanceID);
  if (fi >= uCount) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; vRel = vec3(0.0); return; }
  vec3 h = hash33(vec3(fi, fi * 0.37, 11.0));
  vec3 vel = uWindV;                                    // includes the fall (negative y)
  vec3 p0 = vec3((h.x * 2.0 - 1.0) * uRadius, h.y * uHeight, (h.z * 2.0 - 1.0) * uRadius);
  // world-anchored drops that wrap around the camera
  vec3 pos = p0 + vel * (uTime + h.x * 7.0);
  vec3 rel;
  rel.xz = mod(pos.xz - uCamAbs.xz + uRadius, 2.0 * uRadius) - uRadius;
  rel.y = mod(pos.y, uHeight) - uCamAbs.y * 0.0 - uHeight * 0.35 ;
  rel.y -= 0.0;
  // heights above the camera: keep the column centred on the camera, extending above and below
  rel.y = mod(pos.y - uCamAbs.y + uHeight * 0.4, uHeight) - uHeight * 0.4;
  vec3 tail = rel - vel * uShutter;
  vec3 pr = mix(rel, tail, t);
  vec4 c = uVP * vec4(pr, 1.0);
  vec4 ca = uVP * vec4(rel, 1.0), cb = uVP * vec4(tail, 1.0);
  if (ca.w < 0.1 || cb.w < 0.1 || uIntensity <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; vRel = vec3(0.0); return; }
  vec2 d = (cb.xy / cb.w - ca.xy / ca.w) * uViewport;
  vec2 dir = length(d) > 1e-3 ? normalize(d) : vec2(0.0, 1.0);
  vec2 perp = vec2(-dir.y, dir.x);
  float w = 1.35;
  c.xy += perp * side * w * 0.5 / uViewport * c.w * 2.0;
  float dist = length(rel);
  vAlpha = uIntensity * 0.75 * (0.5 + h.y * 0.5) * (1.0 - t * 0.9) / (1.0 + dist / 16.0) * smoothstep(0.3, 1.5, dist);
  vRel = rel;
  gl_Position = c;
}`;
const RAIN_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in float vAlpha;
in vec3 vRel;
layout(location = 0) out vec4 o;
void main() {
  if (vAlpha <= 0.001) discard;
  vec3 dir = normalize(vRel);
  // drops refract and reflect the surroundings: a blend of sky brightness and direct light
  vec3 col = envRadiance(normalize(vec3(dir.x, 0.35, dir.z)), 3.0) * 1.4 + lightSun() * 0.06 * cloudShadowAt(vRel.xz) + lightSky() * 0.05 / PI;
  col += lightMoon() * 0.05;
  o = vec4(col, vAlpha);
}`;

export class Rain {
  constructor() {
    this.prog = new Program('rain', RAIN_VS, RAIN_FS);
    this.count = 14000;
  }
  draw(ctx, VP, intensity, windVel) {
    if (intensity <= 0.01) return;
    const p = this.prog.use();
    bindLighting(p, ctx);
    const cam = ctx.cam;
    p.m4('uVP', VP).v3('uCamAbs', cam.x, cam.y, cam.z).v3('uWindV', windVel[0], -9.0 - 0.0, windVel[1])
      .f('uTime', ctx.time).f('uRadius', 26).f('uHeight', 34).f('uShutter', 0.028).f('uIntensity', intensity)
      .f('uCount', Math.floor(this.count * (0.25 + 0.75 * intensity))).v2('uViewport', ctx.w, ctx.h);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(false);
    gl.bindVertexArray(gl.emptyVAO || (gl.emptyVAO = gl.createVertexArray()));
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.count);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Lightning
const BOLT_VS = `
layout(location = 0) in vec3 aA;
layout(location = 1) in vec3 aB;
layout(location = 2) in float aW;
uniform mat4 uVP;
uniform vec2 uViewport;
uniform float uMirror, uCamY;
out float vAlpha;
void main() {
  int id = gl_VertexID;
  float t = float(id >> 1);
  float side = float((id & 1) * 2 - 1);
  vec3 a = aA, b = aB;
  if (uMirror > 0.5) { a.y = -a.y - 2.0 * uCamY; b.y = -b.y - 2.0 * uCamY; }
  vec4 ca = uVP * vec4(a, 1.0), cb = uVP * vec4(b, 1.0);
  if (ca.w < 0.1 || cb.w < 0.1) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; return; }
  vec2 d = (cb.xy / cb.w - ca.xy / ca.w) * uViewport;
  vec2 dir = length(d) > 1e-4 ? normalize(d) : vec2(0.0, 1.0);
  vec2 perp = vec2(-dir.y, dir.x);
  vec4 c = mix(ca, cb, t);
  float wpx = aW * uViewport.y * 0.5 / max(c.w, 0.1) * 1.4;
  float px = max(wpx, 2.2);
  c.xy += perp * side * px * 0.5 / uViewport * c.w * 2.0;
  vAlpha = clamp(wpx / px, 0.12, 1.0);
  gl_Position = c;
}`;
const BOLT_FS = `
in float vAlpha;
uniform vec3 uColor;
layout(location = 0) out vec4 o;
void main() { o = vec4(uColor * vAlpha, 1.0); }`;

export class Lightning {
  constructor() {
    this.prog = new Program('bolt', BOLT_VS, BOLT_FS);
    this.rng = mulberry32(90210);
    this.vao = gl.createVertexArray(); gl.bindVertexArray(this.vao);
    this.vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.vb); gl.bufferData(gl.ARRAY_BUFFER, 4096 * 7 * 4, gl.DYNAMIC_DRAW);
    for (const [loc, size, off] of [[0, 3, 0], [1, 3, 12], [2, 1, 24]]) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 28, off); gl.vertexAttribDivisor(loc, 1); }
    gl.bindVertexArray(null);
    this.nSeg = 0;
    this.nextIn = 4;
    this.t = 0;
    this.strokes = [];       // {t, k}
    this.strike = null;      // {pos:[x,y,z] absolute, ...}
    this.flash = 0;          // instantaneous flash level 0..1
    this.ambient = 0;
    this.glow = [0, 0, 0];
  }

  _bolt(cam, camYaw) {
    const r = this.rng;
    const az = camYaw + (r() * 2 - 1) * 1.15;
    const dist = 1400 + Math.pow(r(), 1.5) * 6500;
    const top = 1350 + r() * 350;
    const x0 = cam.x + Math.sin(az) * dist, z0 = cam.z - Math.cos(az) * dist;
    const segs = [];
    const jag = (a, b, disp, depth, w) => {
      if (depth === 0) { segs.push(a[0], a[1], a[2], b[0], b[1], b[2], w); return; }
      const m = [(a[0] + b[0]) / 2 + (r() - 0.5) * disp, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 + (r() - 0.5) * disp];
      jag(a, m, disp * 0.56, depth - 1, w); jag(m, b, disp * 0.56, depth - 1, w);
    };
    const start = [x0, top, z0], end = [x0 + (r() - 0.5) * 500, 0, z0 + (r() - 0.5) * 500];
    // main channel in a few jagged pieces so that branches can leave from it
    const pts = [start];
    const n = 7;
    for (let i = 1; i < n; i++) {
      const f = i / n;
      pts.push([start[0] + (end[0] - start[0]) * f + (r() - 0.5) * 260, top * (1 - f), start[2] + (end[2] - start[2]) * f + (r() - 0.5) * 260]);
    }
    pts.push(end);
    for (let i = 0; i < pts.length - 1; i++) jag(pts[i], pts[i + 1], 170, 4, 5.5);
    // branches
    const nb = 2 + Math.floor(r() * 4);
    for (let b = 0; b < nb; b++) {
      const i = 1 + Math.floor(r() * (pts.length - 3));
      const s = pts[i], ang = r() * Math.PI * 2, len = 250 + r() * 700;
      const e = [s[0] + Math.cos(ang) * len * 0.8, Math.max(60, s[1] - len * (0.5 + r() * 0.7)), s[2] + Math.sin(ang) * len * 0.8];
      jag(s, e, 120, 4, 2.4);
      if (r() < 0.5) { const m = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2, (s[2] + e[2]) / 2]; jag(m, [m[0] + (r() - 0.5) * 500, Math.max(0, m[1] - 350), m[2] + (r() - 0.5) * 500], 90, 3, 1.4); }
    }
    this.segs = new Float32Array(segs);
    this.nSeg = Math.min(4096, segs.length / 7);
    this.strike = { pos: [x0, top * 0.7, z0], az, dist };
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.segs.subarray(0, this.nSeg * 7));
    // return strokes
    const ks = 2 + Math.floor(r() * 3);
    this.strokes = [];
    let tt = 0;
    for (let i = 0; i < ks; i++) { this.strokes.push({ t: tt, k: i === 0 ? 1 : 0.4 + r() * 0.6 }); tt += 0.05 + r() * 0.14; }
    this.t = 0;
    this.active = true;
  }

  // level: 0..1 lightning activity. dt in seconds.
  update(dt, level, cam, camYaw) {
    if (level <= 0.01) { this.flash = 0; this.active = false; this.nextIn = Math.max(this.nextIn, 3); return; }
    if (!this.active) {
      this.nextIn -= dt;
      this.flash = 0;
      if (this.nextIn <= 0) { this._bolt(cam, camYaw); this.nextIn = (2.5 + this.rng() * 9) / (0.4 + level); }
      return;
    }
    this.t += dt;
    let f = 0;
    for (const s of this.strokes) {
      const x = this.t - s.t;
      if (x >= 0) f += s.k * Math.exp(-x / 0.055) * Math.min(1, x / 0.006 + 0.05);
    }
    // flicker between strokes (continuing current)
    f += 0.12 * Math.max(0, 1 - this.t / 0.5) * (0.6 + 0.4 * Math.sin(this.t * 137));
    this.flash = Math.min(1.4, f);
    if (this.t > 0.9 && this.flash < 0.01) { this.active = false; this.flash = 0; }
  }

  // Pre-exposed brightness of the bolt and the flash light; pre = scene pre-exposure
  cloudFlash(cam, pre) {
    if (!this.active || !this.strike || this.flash < 0.02) return [0, 0, 0, 0];
    const p = this.strike.pos;
    return [p[0] - cam.x, p[1] - cam.y, p[2] - cam.z, this.flash * (3 + 300 * clamp(Math.log10(Math.max(pre, 1)) / 3, 0, 1))];
  }

  draw(ctx, VP, pre) {
    if (!this.active || this.flash < 0.02) return;
    const p = this.prog.use();
    const I = Math.min(30000, 7000 * this.flash * Math.min(pre, 20));
    // shift the bolt into camera-relative space via the uniform-free path: segments are stored absolute, so build rel buffer
    const cam = ctx.cam;
    const rel = new Float32Array(this.nSeg * 7);
    for (let i = 0; i < this.nSeg; i++) {
      rel[i * 7] = this.segs[i * 7] - cam.x; rel[i * 7 + 1] = this.segs[i * 7 + 1] - cam.y; rel[i * 7 + 2] = this.segs[i * 7 + 2] - cam.z;
      rel[i * 7 + 3] = this.segs[i * 7 + 3] - cam.x; rel[i * 7 + 4] = this.segs[i * 7 + 4] - cam.y; rel[i * 7 + 5] = this.segs[i * 7 + 5] - cam.z;
      rel[i * 7 + 6] = this.segs[i * 7 + 6];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, rel);
    p.m4('uVP', VP).v2('uViewport', ctx.w, ctx.h).v3('uColor', I * 0.78, I * 0.88, I);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.disable(gl.DEPTH_TEST);
    gl.bindVertexArray(this.vao);
    p.f('uMirror', 0).f('uCamY', cam.y); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.nSeg);
    // faint mirror image on the sea
    p.f('uMirror', 1).f('uCamY', cam.y).v3('uColor', I * 0.05, I * 0.06, I * 0.08); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.nSeg);
    gl.disable(gl.BLEND);
  }
}

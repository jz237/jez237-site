// Thin WebGL2 layer: programs with #include, float textures, arrays, 3D, FBOs.
export let gl = null;
export const caps = {};
const chunks = Object.create(null);

export function defineChunk(name, src) { chunks[name] = src; }

function resolveIncludes(src, seen = new Set()) {
  return src.replace(/^\s*#include\s+<([\w.-]+)>\s*$/gm, (_, name) => {
    if (!(name in chunks)) throw new Error(`Unknown shader chunk <${name}>`);
    if (seen.has(name)) return '';
    seen.add(name);
    return resolveIncludes(chunks[name], seen);
  });
}

export function initGL(canvas, { preserve = false } = {}) {
  gl = canvas.getContext('webgl2', {
    antialias: false, alpha: false, depth: false, stencil: false,
    powerPreference: 'high-performance', preserveDrawingBuffer: preserve,
  });
  if (!gl) throw new Error('WebGL 2 is not available in this browser.');
  caps.floatRender = !!gl.getExtension('EXT_color_buffer_float');
  caps.floatLinear = !!gl.getExtension('OES_texture_float_linear');
  caps.halfRender = !!gl.getExtension('EXT_color_buffer_half_float');
  caps.aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  caps.maxAniso = caps.aniso ? gl.getParameter(caps.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  caps.renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unknown';
  caps.software = /swiftshader|llvmpipe|software|softpipe/i.test(caps.renderer);
  caps.maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (!caps.floatRender) throw new Error('This demo needs float render targets (EXT_color_buffer_float).');
  // Empty VAO used for attribute-less fullscreen triangles.
  caps.emptyVAO = gl.createVertexArray();
  return gl;
}

const HEADER = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp sampler2DArray;
`;

function numbered(src, log) {
  const lines = src.split('\n');
  const hit = new Set();
  for (const m of log.matchAll(/ERROR:\s*\d+:(\d+)/g)) hit.add(+m[1]);
  const out = [];
  for (const n of hit) for (let i = Math.max(1, n - 2); i <= Math.min(lines.length, n + 1); i++) out.push(`${i}: ${lines[i - 1]}`);
  return out.join('\n');
}

function compile(type, src, name) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    throw new Error(`Shader ${name} (${type === gl.VERTEX_SHADER ? 'vs' : 'fs'}) failed:\n${log}\n${numbered(src, log)}`);
  }
  return sh;
}

export class Program {
  constructor(name, vs, fs, defines = '') {
    this.name = name;
    const d = defines ? defines.split('|').map(s => `#define ${s}\n`).join('') : '';
    const v = HEADER + d + resolveIncludes(vs);
    const f = HEADER + d + resolveIncludes(fs);
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, v, name));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, f, name));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Program ${name} link failed: ${gl.getProgramInfoLog(p)}`);
    this.p = p;
    this.locs = new Map();
  }
  use() { gl.useProgram(this.p); return this; }
  loc(n) {
    let l = this.locs.get(n);
    if (l === undefined) { l = gl.getUniformLocation(this.p, n); this.locs.set(n, l); }
    return l;
  }
  f(n, v) { gl.uniform1f(this.loc(n), v); return this; }
  i(n, v) { gl.uniform1i(this.loc(n), v); return this; }
  v2(n, a, b) { gl.uniform2f(this.loc(n), a, b); return this; }
  v3(n, a, b, c) { if (Array.isArray(a) || ArrayBuffer.isView(a)) gl.uniform3f(this.loc(n), a[0], a[1], a[2]); else gl.uniform3f(this.loc(n), a, b, c); return this; }
  v4(n, a, b, c, d) { if (Array.isArray(a) || ArrayBuffer.isView(a)) gl.uniform4f(this.loc(n), a[0], a[1], a[2], a[3]); else gl.uniform4f(this.loc(n), a, b, c, d); return this; }
  fv(n, arr) { gl.uniform1fv(this.loc(n), arr); return this; }
  v2v(n, arr) { gl.uniform2fv(this.loc(n), arr); return this; }
  v3v(n, arr) { gl.uniform3fv(this.loc(n), arr); return this; }
  v4v(n, arr) { gl.uniform4fv(this.loc(n), arr); return this; }
  m4(n, m) { gl.uniformMatrix4fv(this.loc(n), false, m instanceof Float32Array ? m : Float32Array.from(m)); return this; }
  m3(n, m) { gl.uniformMatrix3fv(this.loc(n), false, m); return this; }
  // Bind a texture to a unit and point the sampler uniform at it.
  t(n, unit, tex, target) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(target || tex.target || gl.TEXTURE_2D, tex.tex || tex);
    gl.uniform1i(this.loc(n), unit);
    return this;
  }
}

const FMT = () => ({
  rgba16f: [gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT],
  rgba32f: [gl.RGBA32F, gl.RGBA, gl.FLOAT],
  rg16f: [gl.RG16F, gl.RG, gl.HALF_FLOAT],
  rg32f: [gl.RG32F, gl.RG, gl.FLOAT],
  r16f: [gl.R16F, gl.RED, gl.HALF_FLOAT],
  r32f: [gl.R32F, gl.RED, gl.FLOAT],
  rgba8: [gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE],
  r8: [gl.R8, gl.RED, gl.UNSIGNED_BYTE],
  rg8: [gl.RG8, gl.RG, gl.UNSIGNED_BYTE],
  depth32f: [gl.DEPTH_COMPONENT32F, gl.DEPTH_COMPONENT, gl.FLOAT],
});

const FILT = () => ({ linear: gl.LINEAR, nearest: gl.NEAREST });
const WRAP = () => ({ clamp: gl.CLAMP_TO_EDGE, repeat: gl.REPEAT, mirror: gl.MIRRORED_REPEAT });

function setParams(target, { filter = 'linear', wrap = 'clamp', wrapS, wrapT, mips = false, aniso = 0 }) {
  const f = FILT()[filter], w = WRAP()[wrap];
  const ws = WRAP()[wrapS] || w, wt = WRAP()[wrapT] || w;
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mips ? (filter === 'nearest' ? gl.NEAREST_MIPMAP_NEAREST : gl.LINEAR_MIPMAP_LINEAR) : f);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, ws);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, wt);
  if (aniso > 1 && caps.aniso) gl.texParameterf(target, caps.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(aniso, caps.maxAniso));
}

const mipCount = (w, h) => 1 + Math.floor(Math.log2(Math.max(w, h)));

export function tex2D(w, h, o = {}) {
  const [ifmt, fmt, type] = FMT()[o.fmt || 'rgba16f'];
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, o.mips ? mipCount(w, h) : 1, ifmt, w, h);
  setParams(gl.TEXTURE_2D, o);
  if (o.data) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, fmt, o.dataType || type, o.data);
  if (o.mips && o.data) gl.generateMipmap(gl.TEXTURE_2D);
  return { tex, w, h, target: gl.TEXTURE_2D, fmt: o.fmt || 'rgba16f' };
}

export function texArray(w, h, layers, o = {}) {
  const [ifmt] = FMT()[o.fmt || 'rgba16f'];
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, o.mips ? mipCount(w, h) : 1, ifmt, w, h, layers);
  setParams(gl.TEXTURE_2D_ARRAY, o);
  return { tex, w, h, layers, target: gl.TEXTURE_2D_ARRAY, fmt: o.fmt || 'rgba16f' };
}

export function tex3D(w, h, d, o = {}) {
  const [ifmt, fmt, type] = FMT()[o.fmt || 'rgba8'];
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, tex);
  gl.texStorage3D(gl.TEXTURE_3D, 1, ifmt, w, h, d);
  const f = FILT()[o.filter || 'linear'], wr = WRAP()[o.wrap || 'repeat'];
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, f);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, wr);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, wr);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, wr);
  if (o.data) gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, w, h, d, fmt, type, o.data);
  return { tex, w, h, d, target: gl.TEXTURE_3D, fmt: o.fmt || 'rgba8' };
}

export function depthTex(w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, w, h);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { tex, w, h, target: gl.TEXTURE_2D, fmt: 'depth32f' };
}

export function generateMips(t) {
  gl.bindTexture(t.target, t.tex);
  gl.generateMipmap(t.target);
}

export function setAniso(t, level) {
  if (!caps.aniso) return;
  gl.bindTexture(t.target, t.tex);
  gl.texParameterf(t.target, caps.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(level, caps.maxAniso));
}

// colors: [{tex, layer?, level?}|tex], depth: tex|null
export function makeFBO(colors, depth = null) {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  const bufs = [];
  colors.forEach((c, i) => {
    const t = c.tex && c.tex.tex ? c.tex : c;
    const a = gl.COLOR_ATTACHMENT0 + i;
    if (t.target === gl.TEXTURE_2D_ARRAY || t.target === gl.TEXTURE_3D || c.layer !== undefined) {
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, a, t.tex, c.level || 0, c.layer || 0);
    } else {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, a, gl.TEXTURE_2D, t.tex, c.level || 0);
    }
    bufs.push(a);
  });
  if (depth) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth.tex, 0);
  gl.drawBuffers(bufs);
  const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`Framebuffer incomplete: 0x${st.toString(16)}`);
  const first = colors[0].tex && colors[0].tex.tex ? colors[0].tex : colors[0];
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fbo, w: first.w, h: first.h, n: colors.length, depth };
}

export function bindFBO(f, w, h) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, f ? f.fbo : null);
  if (f) gl.viewport(0, 0, f.w, f.h); else gl.viewport(0, 0, w, h);
}

export function drawFS() {
  gl.bindVertexArray(caps.emptyVAO);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

export const FS_VERT = `
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export function readF32(f, x, y, w, h, ch = 4) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
  const out = new Float32Array(w * h * 4);
  gl.readPixels(x, y, w, h, gl.RGBA, gl.FLOAT, out);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return out;
}

export function checkError(label) {
  const e = gl.getError();
  if (e !== gl.NO_ERROR) console.error(`GL error 0x${e.toString(16)} at ${label}`);
  return e;
}

// Non-blocking GPU->CPU readback through a pixel-pack buffer + fence. Results arrive a few frames later.
export class AsyncReadback {
  constructor(floats) {
    this.n = floats;
    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.buf);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, floats * 4, gl.STREAM_READ);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.sync = null;
    this.data = new Float32Array(floats);
    this.busy = false;
  }
  request(fbo, x, y, w, h) {
    if (this.busy) return false;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.fbo);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.buf);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.FLOAT, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    this.sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    this.busy = true;
    return true;
  }
  poll() {
    if (!this.busy) return false;
    const st = gl.clientWaitSync(this.sync, 0, 0);
    if (st === gl.TIMEOUT_EXPIRED) return false;
    gl.deleteSync(this.sync); this.sync = null;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.buf);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.data);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.busy = false;
    return true;
  }
}

// Small GL layer for the renderer: shader/program construction with readable
// errors, texture and render-target helpers, and a state cache so the frame
// issues no redundant binds or state changes.

// Every sampler in every shader has a fixed texture unit, so sampler uniforms
// are assigned once at link time and never touched per frame.
export const UNIT = {
  uQuads: 0, uXf: 1, uPalette: 2, uOcc: 3, uShadow: 4, uSkyVis: 5, uNoise: 6,
  uDepth: 7, uTex: 8, uTex2: 9, uTex3: 10, uTex4: 11, uSvA: 12, uSvB: 13, uLightOcc: 14,
  uSolid0: 15, uDyn: 16, uSoft: 17, uXfPrev: 18, uPalPack: 19,
  // (20 is the fine quad texture's: UNIT_FINE in render_detail.js; 22 the
  // soot volume's: UNIT_SCORCH in render_scorch.js.)
  uStone: 21, uWet: 23,
  // The far field's shadow map (render_far.js): its own unit, so that the
  // world's programs can read it during the scene pass whatever the water
  // and the post passes do with the general ones.
  uFarShadow: 24,
};

// Samplers default to lowp, which on mobile GPUs really is low precision and
// would wreck HDR colour, depth and float data lookups: everything is highp.
const HEADER = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;
precision highp sampler3D;
precision highp usampler3D;
precision highp sampler2DShadow;
`;

function shaderError(gl, s, src, type, label) {
  const log = gl.getShaderInfoLog(s) || '';
  // Show the offending lines rather than the whole source.
  const lines = src.split('\n');
  const bad = new Set();
  for (const m of log.matchAll(/\d+:(\d+)/g)) bad.add(Number(m[1]));
  let ctx = '';
  for (const n of [...bad].sort((a, b) => a - b).slice(0, 8)) {
    for (let i = Math.max(1, n - 1); i <= Math.min(lines.length, n + 1); i++) ctx += `${i}: ${lines[i - 1]}\n`;
    ctx += '\n';
  }
  return new Error(`shader "${label}" (${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}) failed to compile:\n${log}\n${ctx}`);
}

// A program goes through three stages so that a quality tier can be prepared
// without stalling a frame: described (no GL work), started (compile and
// link issued, nothing waited for) and finished (status checked, uniforms
// located). `defines` is a block of #define lines shared by both stages.
// `init(gl, u)` runs once when the program is finished, with it in use.
export function describeProgram(vsSrc, fsSrc, defines = '', label = 'shader', init = null) {
  return { p: null, u: null, vs: null, fs: null, vsSrc: HEADER + defines + vsSrc, fsSrc: HEADER + defines + fsSrc, label, init, started: -1 };
}

// `now` is remembered so callers without the parallel-compile extension can
// give the driver some time before they ask for the result.
export function startProgram(gl, prog, now = 0) {
  if (prog.p) return;
  const make = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  prog.vs = make(gl.VERTEX_SHADER, prog.vsSrc);
  prog.fs = make(gl.FRAGMENT_SHADER, prog.fsSrc);
  prog.p = gl.createProgram();
  gl.attachShader(prog.p, prog.vs);
  gl.attachShader(prog.p, prog.fs);
  gl.linkProgram(prog.p);
  prog.started = now;
}

// Blocks until the driver is done if it is not already. Throws a readable
// error naming the shader and showing the offending lines.
export function finishProgram(gl, prog) {
  if (prog.u) return prog;
  startProgram(gl, prog);
  const p = prog.p;
  if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) {
    for (const [s, src, type] of [[prog.vs, prog.vsSrc, gl.VERTEX_SHADER], [prog.fs, prog.fsSrc, gl.FRAGMENT_SHADER]]) {
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw shaderError(gl, s, src, type, prog.label);
    }
    throw new Error(`shader "${prog.label}" failed to link: ${gl.getProgramInfoLog(p)}`);
  }
  gl.deleteShader(prog.vs);
  gl.deleteShader(prog.fs);
  prog.vs = prog.fs = null;
  const u = {};
  gl.useProgram(p);
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) || 0;
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    const loc = gl.getUniformLocation(p, info.name);
    if (!loc) continue; // members of the Frame block have no location
    u[name] = loc;
    if (name in UNIT) gl.uniform1i(loc, UNIT[name]);
  }
  const block = gl.getUniformBlockIndex(p, 'Frame');
  if (block !== gl.INVALID_INDEX) gl.uniformBlockBinding(p, block, 0);
  prog.u = u;
  if (prog.init) prog.init(gl, u);
  return prog;
}

// Builds a program and waits for it. Returns { p, u } with `u` mapping
// uniform names to locations. The current program binding is left changed.
export function makeProgram(gl, vsSrc, fsSrc, defines = '', label = 'shader') {
  return finishProgram(gl, describeProgram(vsSrc, fsSrc, defines, label));
}

export function makeTexture(gl, target, filter, wrap) {
  const t = gl.createTexture();
  gl.bindTexture(target, t);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filter === gl.NEAREST ? gl.NEAREST : gl.LINEAR);
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrap);
  if (target === gl.TEXTURE_3D) gl.texParameteri(target, gl.TEXTURE_WRAP_R, wrap);
  return t;
}

// A colour (and optionally depth) render target. `depth` is either a GL
// internal format for a new depth texture or an existing depth texture.
// Completeness is only queried when `check` is set: the query is a blocking
// round trip to the GPU process, which a resize of a dozen targets cannot
// afford, and it depends on the formats alone, so once per format is enough.
export function makeTarget(gl, w, h, format, filter, depth = 0, check = false) {
  const t = { w, h, fbo: gl.createFramebuffer(), tex: null, depth: null, ownsDepth: false };
  gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
  if (format) {
    t.tex = makeTexture(gl, gl.TEXTURE_2D, filter, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, format, w, h);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
  } else {
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
  }
  if (depth) {
    if (typeof depth === 'number') {
      t.depth = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
      gl.texStorage2D(gl.TEXTURE_2D, 1, depth, w, h);
      t.ownsDepth = true;
    } else {
      t.depth = depth;
    }
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, t.depth, 0);
  }
  t.complete = !check || gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE || gl.isContextLost();
  return t;
}

export function freeTarget(gl, t) {
  if (!t) return;
  gl.deleteFramebuffer(t.fbo);
  if (t.tex) gl.deleteTexture(t.tex);
  if (t.depth && t.ownsDepth) gl.deleteTexture(t.depth);
}

export const BLEND = { OFF: 0, PREMUL: 1, ADD: 2, MULTIPLY: 3, MIN: 4 };
export const CULL = { OFF: 0, BACK: 1, FRONT: 2 };

// Tracks GL state so repeated requests for the current state cost nothing.
export class GLState {
  constructor(gl) {
    this.gl = gl;
    this.units = new Array(20).fill(null);
    this.calls = 0;
    this.reset();
  }

  // Forget everything (fresh or restored context).
  reset() {
    this.prog = null;
    this.target = undefined;
    this.vp = [-1, -1, -1, -1];
    this.unit = -1;
    this.units.fill(null);
    this.depthTest = -1;
    this.depthWrite = -1;
    this.depthFunc = -1;
    this.blendMode = -1;
    this.cullMode = -1;
    this.vaoObj = undefined;
    this.scissorOn = -1;
    this.offsetOn = -1;
  }

  program(p) {
    if (!p.u) {
      // First use of a program that was only described or started.
      finishProgram(this.gl, p);
      this.prog = null;
    }
    if (this.prog !== p) { this.gl.useProgram(p.p); this.prog = p; }
    return p.u;
  }

  tex(unit, target, tex) {
    if (this.units[unit] === tex) return;
    const gl = this.gl;
    if (this.unit !== unit) { gl.activeTexture(gl.TEXTURE0 + unit); this.unit = unit; }
    gl.bindTexture(target, tex);
    this.units[unit] = tex;
  }

  // Bind for an upload: makes `unit` active and remembers the binding.
  texForUpload(unit, target, tex) {
    const gl = this.gl;
    if (this.unit !== unit) { gl.activeTexture(gl.TEXTURE0 + unit); this.unit = unit; }
    if (this.units[unit] !== tex) { gl.bindTexture(target, tex); this.units[unit] = tex; }
  }

  // `t` is a makeTarget() object, or null for the canvas (pass its size).
  fbo(t, w = 0, h = 0) {
    const gl = this.gl;
    // While the VR mode draws an eye, its part of the headset's framebuffer
    // stands in for the canvas (xr_render.js sets `screen`).
    if (!t && this.screen) return this.screen.bind(this);
    if (this.target !== t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null); this.target = t; }
    if (t) this.viewport(0, 0, t.w, t.h); else this.viewport(0, 0, w, h);
  }

  viewport(x, y, w, h) {
    const v = this.vp;
    if (v[0] !== x || v[1] !== y || v[2] !== w || v[3] !== h) {
      this.gl.viewport(x, y, w, h);
      v[0] = x; v[1] = y; v[2] = w; v[3] = h;
    }
  }

  depth(test, write, func) {
    const gl = this.gl;
    if (this.depthTest !== test) { if (test) gl.enable(gl.DEPTH_TEST); else gl.disable(gl.DEPTH_TEST); this.depthTest = test; }
    if (this.depthWrite !== write) { gl.depthMask(write); this.depthWrite = write; }
    if (test && this.depthFunc !== func) { gl.depthFunc(func); this.depthFunc = func; }
  }

  blend(mode) {
    if (this.blendMode === mode) return;
    const gl = this.gl;
    // Every mode but MIN adds; the equation is put back on the way out of it.
    if (this.blendMode === BLEND.MIN) gl.blendEquation(gl.FUNC_ADD);
    if (mode === BLEND.OFF) gl.disable(gl.BLEND);
    else {
      if (this.blendMode <= 0) gl.enable(gl.BLEND);
      if (mode === BLEND.PREMUL) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      else if (mode === BLEND.ADD) gl.blendFunc(gl.ONE, gl.ONE);
      else if (mode === BLEND.MIN) gl.blendEquation(gl.MIN);
      else gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
    }
    this.blendMode = mode;
  }

  cull(mode) {
    if (this.cullMode === mode) return;
    const gl = this.gl;
    if (mode === CULL.OFF) gl.disable(gl.CULL_FACE);
    else {
      if (this.cullMode <= 0) gl.enable(gl.CULL_FACE);
      gl.cullFace(mode === CULL.BACK ? gl.BACK : gl.FRONT);
    }
    this.cullMode = mode;
  }

  vao(v) {
    if (this.vaoObj !== v) { this.gl.bindVertexArray(v); this.vaoObj = v; }
  }

  scissor(on, x = 0, y = 0, w = 0, h = 0) {
    const gl = this.gl;
    if (this.scissorOn !== on) { if (on) gl.enable(gl.SCISSOR_TEST); else gl.disable(gl.SCISSOR_TEST); this.scissorOn = on; }
    if (on) gl.scissor(x, y, w, h);
  }

  polygonOffset(on, factor = 0, units = 0) {
    const gl = this.gl;
    if (this.offsetOn !== on) { if (on) gl.enable(gl.POLYGON_OFFSET_FILL); else gl.disable(gl.POLYGON_OFFSET_FILL); this.offsetOn = on; }
    if (on) gl.polygonOffset(factor, units);
  }
}

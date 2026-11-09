// Render targets and the post chain: scene HDR target, bloom pyramid, final
// composite (exposure, tonemap, grade, dither) and the FXAA / upscale pass.
import { describeProgram, makeTarget, makeTexture, freeTarget, BLEND, CULL, UNIT } from './render_gl.js';
import { MAIN_VS, MOTION_FS } from './shaders.js';
import { SET } from './render_geom.js';
import { XF_STRIDE } from './engine.js';
import { FULLSCREEN_VS } from './render_shaders_fx.js';
import { BLOOM_DOWN_FS, BLOOM_UP_FS, COMPOSITE_FS, FXAA_FS, SSAO_FS, SSAO_BLUR_FS, SSAO_APPLY_FS, SHAFT_FS, BLUR5_FS, EXPOSURE_FS, TAA_FS } from './render_shaders_post.js';

const MAX_BLOOM = 6;

export class Post {
  // caps: { float: EXT_color_buffer_float, half: EXT_color_buffer_half_float }
  constructor(gl, state, caps) {
    this.gl = gl;
    this.state = state;
    this.caps = caps;
    this.q = null;
    this.w = 0;
    this.h = 0;
    this.scene = null;       // HDR colour + depth
    this.sceneColor = null;  // same colour, no depth: lets passes sample scene depth
    this.ldr = null;
    this.bloom = [];
    this.progs = new Map();
    this.sceneFormat = 0;
    this.verified = 0;       // scene format whose framebuffer completeness was checked
    this.encode = false;     // true on the 8-bit fallback
    this.hasAlpha = true;
    this.drawCalls = 0;
    this.ao = this.aoBlur = this.shaft = this.shaftTmp = this.expo = this.history = null;
    this.velocity = null;     // body motion for the temporal resolve (colour) over the scene's depth
    this.motion = false;      // the velocity target holds this frame's motion
    this.expoValid = false;
    this.historyValid = false;
    this.allowTaa = true;     // cleared by the renderer where TAA must not run
    this.adapt = 1;           // exposure blend factor for this frame
    this.baseExposure = 1;    // the atmosphere's exposure for open sky
    this.exposureKey = 0.27;  // target scene luminance * exposure
    this.exposureLow = 0.8;   // how far below the open-sky exposure the eye may go
    this.exposureReach = 0.5; // share of the way it adapts to what it sees (0 = not at all)
    this.exposureHot = 1.7;   // brightest the lit part of a view may come out (scene value times exposure)
    this.adaptOpen = 1;       // exposure blend factor when the view got darker
    this.grade = [0, 0];      // golden-hour weight and night, for the grade
  }

  // Shader variants are described once and kept for tier switches; they are
  // compiled when a tier is prepared or first used.
  prog(name, fs, defines) {
    const key = name + '|' + defines;
    let p = this.progs.get(key);
    if (!p) {
      p = describeProgram(FULLSCREEN_VS, fs, defines, name);
      this.progs.set(key, p);
    }
    return p;
  }

  // What a tier gets on this GPU: scene format and the features that depend
  // on float targets.
  derive(q) {
    const gl = this.gl;
    // Alpha (the ambient share) is only needed when screen-space AO runs;
    // otherwise the packed 32-bit float format halves the bandwidth.
    let format, encode = false, alpha = true;
    if (this.caps.float && !q.ssao) { format = gl.R11F_G11F_B10F; alpha = false; }
    else if (this.caps.float || this.caps.half) format = gl.RGBA16F;
    else { format = gl.RGBA8; encode = true; }
    return {
      format, encode, alpha,
      autoExpo: !!(q.autoExposure && (this.caps.float || this.caps.half)),
      taa: !!(q.taa && this.allowTaa),
    };
  }

  // Every post program a tier uses (described, not yet compiled).
  programs(q) {
    const v = this.derive(q), d = v.encode ? '#define HDR_ENCODE\n' : '', P = {};
    if (q.bloom) {
      const cheap = q.bloomCheap ? '#define BLOOM_CHEAP\n' : '';
      P.bloomFirst = this.prog('bloom down 0', BLOOM_DOWN_FS, d + cheap + '#define KARIS\n');
      P.bloomDown = this.prog('bloom down', BLOOM_DOWN_FS, d + cheap);
      P.bloomUp = this.prog('bloom up', BLOOM_UP_FS, d);
    }
    // Without a bloom pyramid to meter, the scene itself is sampled.
    // The sun's glare, on the tiers that have a bloom: the exposure pass
    // counts how much of the disc is seen, the composite adds the light.
    const glare = v.autoExpo && q.bloom ? '#define SUN_GLARE\n' : '';
    if (v.autoExpo) P.exposure = this.prog('exposure', EXPOSURE_FS, d + glare + (q.bloom ? '' : '#define METER_SCENE\n'));
    let c = d + glare;
    if (q.bloom) c += '#define BLOOM\n';
    if (q.shafts) c += '#define SHAFTS\n';
    if (v.autoExpo) c += '#define AUTO_EXPOSURE\n';
    // No pass after the composite to anti-alias in: do it in the composite.
    if (q.edgeAA && !(q.fxaa || q.sharpen || v.taa)) c += '#define EDGE_AA\n';
    P.composite = this.prog('composite', COMPOSITE_FS, c);
    // Temporal AA replaces FXAA; the final pass then only sharpens.
    if (v.taa) P.taa = this.prog('taa', TAA_FS, d);
    if (q.fxaa || q.sharpen || v.taa) P.fxaa = this.prog('fxaa', FXAA_FS, v.taa ? '#define SHARPEN\n' : (q.fxaa ? '#define FXAA\n' : ''));
    if (q.ssao) {
      P.ssao = this.prog('ssao', SSAO_FS, `#define SSAO_TAPS ${q.ssao}\n` + (v.alpha ? '#define AO_SHARE\n' : ''));
      P.ssaoBlur = this.prog('ssao blur', SSAO_BLUR_FS, '');
      P.ssaoApply = this.prog('ssao apply', SSAO_APPLY_FS, q.ssaoBilateral ? '#define AO_BILATERAL\n' : '');
    }
    if (q.shafts) {
      P.shafts = this.prog('shafts', SHAFT_FS, `#define SHAFT_STEPS ${q.shafts}\n`);
      P.blur5 = this.prog('blur5', BLUR5_FS, '');
    }
    return P;
  }

  // q: quality settings (see render_quality.js).
  configure(q) {
    const v = this.derive(q);
    this.q = q;
    this.sceneFormat = v.format;
    this.encode = v.encode;
    this.hasAlpha = v.alpha;
    this.bloomFormat = this.caps.float ? this.gl.R11F_G11F_B10F : (this.caps.half ? this.gl.RGBA16F : this.gl.RGBA8);
    this.autoExpo = v.autoExpo;
    this.taa = v.taa;
    this.w = 0; // a tier change can alter which targets exist and their formats
    this.P = this.programs(q);
  }

  free() {
    const gl = this.gl;
    freeTarget(gl, this.scene);
    if (this.sceneColor) gl.deleteFramebuffer(this.sceneColor.fbo);
    freeTarget(gl, this.ldr);
    for (const b of this.bloom) freeTarget(gl, b);
    this.bloom.length = 0;
    this.scene = this.sceneColor = this.ldr = null;
    this.freeExtra();
  }

  // Scene target size (w, h). Reallocates only when something changed.
  resize(w, h) {
    if (w === this.w && h === this.h) return;
    const gl = this.gl, st = this.state, q = this.q;
    this.free();
    this.w = w;
    this.h = h;
    st.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
    const verify = this.verified !== this.sceneFormat;
    this.scene = makeTarget(gl, w, h, this.sceneFormat, gl.LINEAR, gl.DEPTH_COMPONENT24, verify);
    if (!this.scene.complete) throw new Error('HDR render target is not supported on this GPU');
    this.verified = this.sceneFormat;
    this.sceneColor = { fbo: gl.createFramebuffer(), w, h };
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneColor.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.scene.tex, 0);
    if (q.fxaa || q.sharpen || this.taa) this.ldr = makeTarget(gl, w, h, gl.RGBA8, gl.LINEAR);
    let bw = w, bh = h;
    // The 8-bit fallback cannot accumulate levels additively (its values are
    // square-root encoded), so it settles for one blurred level.
    const levels = this.encode ? Math.min(q.bloom, 3) : Math.min(q.bloom, MAX_BLOOM);
    for (let i = 0; i < levels; i++) {
      bw = Math.max(2, bw >> 1);
      bh = Math.max(2, bh >> 1);
      this.bloom.push(makeTarget(gl, bw, bh, this.bloomFormat, gl.LINEAR));
      if (bw <= 4 || bh <= 4) break;
    }
    this.allocExtra(w, h);
    st.units[st.unit] = null;
    st.target = undefined;
  }

  allocExtra(w, h) {
    const gl = this.gl, q = this.q;
    if (q.ssao) {
      this.ao = makeTarget(gl, w >> 1, h >> 1, gl.RGBA8, gl.NEAREST);
      this.aoBlur = makeTarget(gl, w >> 1, h >> 1, gl.RGBA8, gl.LINEAR);
    }
    if (q.shafts) {
      const sw = Math.max(2, w >> 2), sh = Math.max(2, h >> 2);
      this.shaft = makeTarget(gl, sw, sh, gl.R8, gl.LINEAR);
      this.shaftTmp = makeTarget(gl, sw, sh, gl.R8, gl.LINEAR);
    }
    // Eye adaptation needs a light meter (the last level of the bloom
    // pyramid, or the scene itself on a tier without one) and a float texel
    // to accumulate in. The texel does not depend on the target size, so
    // the adapted exposure survives a resize.
    if (this.autoExpo && !this.expo) {
      this.expo = [makeTarget(gl, 1, 1, gl.RGBA16F, gl.NEAREST), makeTarget(gl, 1, 1, gl.RGBA16F, gl.NEAREST)];
      this.expoValid = false;
    } else if (!this.autoExpo && this.expo) {
      freeTarget(gl, this.expo[0]);
      freeTarget(gl, this.expo[1]);
      this.expo = null;
    }
    if (this.taa) {
      const fmt = this.encode ? gl.RGBA8 : gl.RGBA16F;
      this.history = [makeTarget(gl, w, h, fmt, gl.LINEAR), makeTarget(gl, w, h, fmt, gl.LINEAR)];
      this.historyValid = false;
      // Motion of body pixels, depth-tested against the scene it belongs to.
      if (this.caps.float || this.caps.half) this.velocity = makeTarget(gl, w, h, this.caps.float ? gl.RG16F : gl.RGBA16F, gl.NEAREST, this.scene.depth);
    }
  }

  // Temporal resolve of the finished scene. jx, jy: this frame's jitter in
  // uv. Returns the texture the rest of the chain should read.
  // still: number of consecutive frames in which nothing moved (0 = moving).
  // While still, history needs no clamp and the blend becomes a running
  // average, so the image converges to a true multi-sample resolve.
  runTAA(jx, jy, reset, still) {
    if (!this.history) return this.scene.tex;
    const gl = this.gl, st = this.state;
    const prev = this.history[0], next = this.history[1];
    this.begin();
    st.fbo(next);
    const u = st.program(this.P.taa);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.scene.tex);
    st.tex(UNIT.uTex2, gl.TEXTURE_2D, prev.tex);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, this.scene.depth);
    const n = Math.min(still + 8, 48);
    const w = still ? n / (n + 1) : 0.9;
    gl.uniform4f(u.uTaa, jx, jy, this.historyValid && !reset ? w : 0, still ? 0 : 1);
    gl.uniform4f(u.uTaaMotion, this.motion ? 1 : 0, 0, 0, 0);
    if (this.motion) st.tex(UNIT.uTex3, gl.TEXTURE_2D, this.velocity.tex);
    this.draw();
    this.history[0] = next;
    this.history[1] = prev;
    this.historyValid = true;
    return next.tex;
  }

  freeExtra() {
    const gl = this.gl;
    freeTarget(gl, this.ao);
    freeTarget(gl, this.aoBlur);
    freeTarget(gl, this.shaft);
    freeTarget(gl, this.shaftTmp);
    if (this.history) { freeTarget(gl, this.history[0]); freeTarget(gl, this.history[1]); }
    freeTarget(gl, this.velocity);
    this.ao = this.aoBlur = this.shaft = this.shaftTmp = this.history = this.velocity = null;
    this.motion = false;
  }

  // Screen-space AO over the opaque scene (call before glass and soft
  // particles are drawn). Multiplies straight into the scene colour.
  runSSAO() {
    if (!this.ao) return;
    const gl = this.gl, st = this.state, q = this.q;
    this.begin();
    st.fbo(this.ao);
    st.program(this.P.ssao);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, this.scene.depth);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.scene.tex);
    this.draw();
    st.fbo(this.aoBlur);
    st.program(this.P.ssaoBlur);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.ao.tex);
    this.draw();
    st.fbo(this.sceneColor);
    st.blend(BLEND.MULTIPLY);
    st.program(this.P.ssaoApply);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.aoBlur.tex);
    this.draw();
    st.blend(BLEND.OFF);
  }

  // Sun shafts into a quarter-res buffer; returns its texture (or null).
  runShafts(shadowTex) {
    if (!this.shaft) return null;
    const gl = this.gl, st = this.state, q = this.q;
    this.begin();
    st.fbo(this.shaft);
    st.program(this.P.shafts);
    st.tex(UNIT.uShadow, gl.TEXTURE_2D, shadowTex);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, this.scene.depth);
    this.draw();
    const u = st.program(this.P.blur5);
    st.fbo(this.shaftTmp);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.shaft.tex);
    gl.uniform4f(u.uTexel, 1.2 / this.shaft.w, 0, 0, 0);
    this.draw();
    st.fbo(this.shaft);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.shaftTmp.tex);
    gl.uniform4f(u.uTexel, 0, 1.2 / this.shaft.h, 0, 0);
    this.draw();
    return this.shaft.tex;
  }

  // Common state for fullscreen passes.
  begin() {
    const gl = this.gl, st = this.state;
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.blend(BLEND.OFF);
    st.scissor(false);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    this.drawCalls++;
  }

  // Bloom pyramid from `src` (the HDR scene texture). Leaves the result in
  // bloom[0].
  runBloom(src) {
    const gl = this.gl, st = this.state, b = this.bloom, q = this.q;
    if (!b.length) return null;
    const first = this.P.bloomFirst, down = this.P.bloomDown, up = this.P.bloomUp;
    let tex = src;
    for (let i = 0; i < b.length; i++) {
      st.fbo(b[i]);
      st.program(i === 0 ? first : down);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, tex);
      this.draw();
      tex = b[i].tex;
    }
    if (this.encode) return b[b.length - 1];
    // Walk back up, adding each blurred level onto the one above it.
    st.blend(BLEND.ADD);
    st.program(up);
    for (let i = b.length - 1; i > 0; i--) {
      st.fbo(b[i - 1]);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, b[i].tex);
      this.draw();
    }
    st.blend(BLEND.OFF);
    return b[0];
  }

  // Diagnostic: show one of the intermediate buffers ('ao', 'shafts',
  // 'bloom') full screen instead of the final image.
  showBuffer(name, cw, ch) {
    const gl = this.gl, st = this.state;
    const t = name === 'ao' ? this.aoBlur : name === 'shafts' ? this.shaft : name === 'bloom' ? this.bloom[0] : null;
    if (!t) return;
    this.begin();
    st.fbo(null, cw, ch);
    st.program(this.prog('show', FXAA_FS, name === 'bloom' ? '' : '#define SHOW_R\n'));
    st.tex(UNIT.uTex, gl.TEXTURE_2D, t.tex);
    this.draw();
  }

  // Resolve `src` (HDR scene colour) to the canvas of size cw x ch.
  finish(src, cw, ch, shaftTex) {
    const gl = this.gl, st = this.state, q = this.q;
    this.begin();
    const bloomOut = this.runBloom(src);
    const hasBloom = this.bloom.length > 0;
    if (this.expo) {
      // Meter the smallest bloom level and ease the exposure toward it.
      const prev = this.expo[0], next = this.expo[1];
      st.fbo(next);
      const ue = st.program(this.P.exposure);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, hasBloom ? this.bloom[this.bloom.length - 1].tex : src);
      st.tex(UNIT.uTex2, gl.TEXTURE_2D, prev.tex);
      st.tex(UNIT.uTex3, gl.TEXTURE_2D, src);
      const e0 = this.baseExposure;
      gl.uniform4f(ue.uAdapt, this.expoValid ? this.adapt : 1, e0, this.exposureReach, this.exposureKey);
      gl.uniform4f(ue.uRange, this.exposureLow, 2, this.expoValid ? this.adaptOpen : 1, this.exposureHot);
      this.draw();
      this.expo[0] = next;
      this.expo[1] = prev;
      this.expoValid = true;
    }
    const comp = this.P.composite;
    const two = !!this.ldr;
    if (two) st.fbo(this.ldr); else st.fbo(null, cw, ch);
    const u = st.program(comp);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, src);
    if (hasBloom) st.tex(UNIT.uTex2, gl.TEXTURE_2D, bloomOut.tex);
    if (shaftTex) st.tex(UNIT.uTex3, gl.TEXTURE_2D, shaftTex);
    if (this.expo) st.tex(UNIT.uTex4, gl.TEXTURE_2D, this.expo[0].tex);
    // Cool and warm ends, saturation, contrast and vignette for the hour.
    const dusk = this.grade[0], night = this.grade[1];
    gl.uniform4f(u.uGradeCool, hour(0.96, 0.93, 0.9, dusk, night), hour(1.0, 0.98, 0.98, dusk, night), hour(1.06, 1.1, 1.12, dusk, night), 1.08 + 0.07 * dusk);
    gl.uniform4f(u.uGradeWarm, hour(1.04, 1.07, 1.03, dusk, night), 1.0, hour(0.95, 0.9, 0.96, dusk, night), 0.3 * night);
    gl.uniform4f(u.uGradeK, 0.18 + 0.06 * dusk - 0.08 * night, q.vignette * (1 + 0.5 * night), 0, 0);
    gl.uniform4f(u.uPost, q.bloomMix, this.encode ? 1 : 1 / Math.max(1, this.bloom.length), q.vignette, shaftTex ? q.shaftStrength : 0);
    this.draw();
    if (two) {
      st.fbo(null, cw, ch);
      const uf = st.program(this.P.fxaa);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, this.ldr.tex);
      if (this.taa) st.tex(UNIT.uTex2, gl.TEXTURE_2D, src);
      // Sharpen harder the more the image is being upscaled.
      const up = cw / this.w;
      const base = this.taa ? 0.3 : 0.12;
      const sharpen = up > 1.02 ? Math.min(0.9, 0.35 + (up - 1) * 0.9) : base;
      if (uf.uTexel && this.P.fxaa.sharpen !== sharpen) {
        gl.uniform4f(uf.uTexel, 0, 0, sharpen, 0);
        this.P.fxaa.sharpen = sharpen;
      }
      this.draw();
    }
  }
}

// A grade constant for the hour: its value by day, at golden hour and at night.
function hour(day, golden, night, dusk, dark) {
  const v = day + (golden - day) * dusk;
  return v + (night - v) * dark;
}

const XF_W = 1024, XF_H = 32;

// Per-pixel motion of bodies for the temporal resolve. Nothing in the engine
// says how a body moved; the renderer's mirror of the transform texture
// (Sync.xfPrev: the transforms as last uploaded, i.e. this frame's) does,
// against a copy of it kept from the frame before. On a frame in which a
// body moved, that copy goes to a second transform texture and the body
// quads are drawn once more into a velocity target, each vertex placed by
// both transforms. Costs nothing on frames in which no body moved.
export class BodyMotion {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    // Both made when temporal AA first runs: a megabyte the other tiers do not need.
    this.tex = null;
    this.last = null;                               // transforms of the previous frame
    this.valid = false;                             // `last` is the frame before this one
    this.rows = 0;                                  // rows of it that hold bodies
    this.count = 0;                                 // transforms in the table when it was copied
    this.program = describeProgram(MAIN_VS, MOTION_FS, '#define MOTION_PASS\n', 'body motion', (g, u) => {
      if (u.uTransMask) g.uniform1uiv(u.uTransMask, this.transMask);
    });
    this.transMask = null;
  }

  reset() {
    this.valid = false;
  }

  // Draws this frame's body motion into post.velocity (the scene's depth
  // must be complete) and leaves post.motion saying whether there is any.
  // sync: the buffer mirror, updated for this frame; bodies: transforms in
  // the table; lists: the quad draw lists. Returns the draws issued.
  render(post, sync, bodies, lists, fine = null) {
    const gl = this.gl, st = this.state;
    bodies = Math.min(bodies, XF_H * 256);
    const rows = (bodies + 255) >> 8;
    const moved = sync.bodiesMoved > 0 && rows > 0;
    post.motion = false;
    let draws = 0;
    // No velocity target: temporal AA is off, and what is kept of the last
    // frame goes stale.
    if (!post.velocity) {
      this.valid = false;
      return 0;
    }
    if (!this.last) {
      this.last = new Float32Array(XF_W * XF_H * 4);
      this._mirror = null;
      this.tex = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, XF_W, XF_H);
      st.units[st.unit] = null;
    }
    // (A view of the rows in use, kept until their number changes: not one
    // made per frame.)
    const span = Math.max(rows, this.rows) * XF_W * 4;
    if (!this._mirror || this._mirror.buffer !== sync.xfPrev.buffer || this._mirror.length !== span) this._mirror = new Float32Array(sync.xfPrev.buffer, sync.xfPrev.byteOffset, span);
    if (!this.valid) {
      // The first frame back: nothing to compare with yet.
      this.last.set(this._mirror);
      this.last.fill(0, bodies * XF_STRIDE, span);
      this.rows = rows;
      this.count = bodies;
      this.valid = true;
      return 0;
    }
    // (Bodies' quads drawn at 2.5 cm are in the fine stream: a piece
    // that is all breaks has no others. render_detail.js.)
    const fineSegs = moved && fine ? fine.listMotion() : 0;
    if (moved && (lists.quads(SET.BODIES) > 0 || fineSegs > 0)) {
      const up = Math.max(rows, this.rows);
      st.texForUpload(UNIT.uXfPrev, gl.TEXTURE_2D, this.tex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, XF_W, up, gl.RGBA, gl.FLOAT, this.last, 0);
      st.fbo(post.velocity);
      st.depth(true, false, gl.LEQUAL);
      st.blend(BLEND.OFF);
      st.cull(CULL.BACK);
      st.scissor(false);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      st.program(this.program);
      lists.draw(SET.BODIES);
      if (fineSegs > 0) fine.drawMotion();
      post.motion = true;
      draws = 1;
    }
    // Keep this frame's transforms for the next one. While nothing moves the
    // copy stays as it is: it already equals the mirror.
    if (moved || bodies !== this.count) {
      this.last.set(this._mirror);
      // Slots past the table's end hold nothing, whatever was once there.
      this.last.fill(0, bodies * XF_STRIDE, span);
      this.rows = rows;
      this.count = bodies;
    }
    return draws;
  }
}

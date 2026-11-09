// The frame ledger: what one frame cost outside the simulation step, counted.
// Main-thread time by phase, and everything asked of the GPU as exact counts
// (draw calls, triangles, bytes uploaded, targets drawn to, full-screen
// pixels, state changes, blocking calls, programs linked), per frame and by
// render pass, kept for the last HISTORY frames. window.__vx.frame is this
// object; the F3 panel shows its summary and tools/perf/frame_trace.mjs
// writes it out for whole collapses.
//
// Nothing here is a GPU time. The counts are what a GPU is asked to do; the
// times are the main thread's.
//
// Cost, measured on the dev box: 13 us to close a frame, 0.05 us per GL
// call for the count (0.15 us for a draw), so about 40 us of a frame with
// 400 GL calls; no allocation. The phases are a dozen clock reads. The
// counts come from wrappers on the GL context's entry points; ?ledger=0
// leaves the context alone.

import { OUT, PROF } from './engine.js';

const HISTORY = 600;

// Render passes, in frame order (renderer.js sets `cursor.pass` as it goes;
// GL calls made outside any of them are booked on NONE).
export const PASS = {
  NONE: 0, SETUP: 1, SYNC: 2, FRAME: 3, VOLUMES: 4, PARTICLE_UPLOAD: 5, CONTACT: 6, SOFT_SHADOW: 7, SHADOW: 8,
  OPAQUE: 9, CUBES: 10, MOTION: 11, SKY: 12, SSAO: 13, GLASS: 14, GAS: 15, SHAFTS: 16, TAA: 17, POST: 18,
  // The far field (render_far.js): its one draw a frame, and its shadow map on the frames that redraw it.
  FAR: 19,
  // The water (render_water.js): over everything solid, and what of it is in the air. (It was booked with the glass.)
  WATER: 20, LEN: 21,
};
export const PASS_NAMES = ['none', 'setup', 'sync', 'frame', 'volumes', 'particleUpload', 'contact', 'softShadow', 'shadow',
  'opaque', 'cubes', 'motion', 'sky', 'ssao', 'glass', 'gas', 'shafts', 'taa', 'post', 'far', 'water'];
// What is kept per pass.
const PM = { CALLS: 0, DRAWS: 1, SUBDRAWS: 2, TRIS: 3, FS_PX: 4, BYTES: 5, LEN: 6 };
const PM_NAMES = ['calls', 'draws', 'subDraws', 'tris', 'fsPx', 'bytes'];
// The renderer writes the pass it is in here.
export const cursor = { pass: 0 };

// One frame's record: a row of numbers. Times in ms, sizes in bytes.
const NAMES = [
  't', 'interval',
  // Main thread by phase, each its own time only (a step run from inside
  // `advance` is the step's). `update`: the game shell; `advance`: the sim
  // being told how much time has passed, less the steps it then runs here;
  // `step`: the engine's steps on this thread; `prepare`: prepare_render
  // on this thread, or taking the frame a worker sent. `main` runs from the
  // frame's first call to the end of its last; `outside` is that less the
  // steps; `other` what lies between the phases. `mesh`: what the engine
  // says of `prepare` went on meshing.
  'update', 'advance', 'step', 'prepare', 'render', 'audio', 'hud', 'main', 'outside', 'other', 'steps', 'renders', 'mesh',
  // render() by stage (PART in renderer.js); `rSetup` is what precedes them.
  'rSync', 'rFrame', 'rVolumes', 'rParticles', 'rShadows', 'rScene', 'rEffects', 'rPost', 'rSetup',
  // Asked of the GPU, whole frame.
  'glCalls', 'draws', 'subDraws', 'tris', 'instances', 'clears', 'targets', 'fsPasses', 'fsPx',
  'programs', 'texBinds', 'uniforms', 'state', 'blocking', 'links', 'allocs', 'copies',
  'uploads', 'bufBytes', 'texBytes', 'upBytes', 'glMs',
  // The picture: canvas and scene target in pixels, render scale, tier
  // (index into TIER_NAMES).
  'canvasPx', 'scenePx', 'sceneW', 'sceneH', 'scale', 'tier',
  // Particles: instances, how many are cubes, how many were sent, the gas
  // sprites' summed screen area in screens of the scene target (the
  // renderer's estimate), the gas layer's step and the pixels that makes;
  // the summed area of what is drawn of flames at the scene's own size,
  // in screens of the scene target (`particles.flameFill`, where a tier
  // draws them so; 0 where none does).
  'particles', 'cubes', 'sprites', 'pSent', 'gasFill', 'gasStep', 'gasPx', 'flameFill',
  // Geometry and what moved. `quadRows`: rows of the quad buffer as the
  // engine has allocated it, `quadTop`: rows that have held quads;
  // `bodyQuads`: the quads that belong to bodies.
  'quads', 'quadsDrawn', 'bodyQuads', 'quadRows', 'quadTop', 'bodies', 'awake', 'bodiesMoved', 'dirtyChunks', 'quadBytes', 'shadowCascades', 'shadowRefreshes',
  // Volumes brought up to date: point-light maps marched, sky-visibility layers swept.
  'lightBakes', 'skyLayers',
  // JS heap in use (where the browser says, looked at every sixteenth
  // frame) and how far it fell between two looks: a collection ran.
  'heap', 'gcFreed',
  // With the sim in a worker: whether this frame drew a packet it had not
  // drawn before (`fresh`), and what the worker says that packet cost it:
  // its steps, its prepare_render, the copy into the packet (ms), the
  // packet's size, the steps it held.
  'fresh', 'wStep', 'wPrepare', 'wCopy', 'wBytes', 'wSteps',
];
const BASE = NAMES.length;
for (const p of PASS_NAMES) for (const m of PM_NAMES) NAMES.push(`${p}.${m}`);
export const FIELDS = NAMES;
export const F = Object.fromEntries(NAMES.map((n, i) => [n, i]));
export const TIER_NAMES = ['low', 'medium', 'high', 'ultra', 'capture'];
const N = NAMES.length;

// GL entry points by what they cost a driver. Anything not named is a plain call.
const STATE = new Set(['enable', 'disable', 'blendFunc', 'blendFuncSeparate', 'blendEquation', 'blendEquationSeparate', 'depthFunc', 'depthMask',
  'cullFace', 'frontFace', 'colorMask', 'viewport', 'scissor', 'polygonOffset', 'pixelStorei', 'clearColor', 'clearDepth', 'activeTexture',
  'bindVertexArray', 'bindBuffer', 'bindBufferBase', 'bindBufferRange', 'drawBuffers', 'readBuffer', 'bindFramebuffer', 'bindSampler', 'stencilFunc', 'stencilOp', 'stencilMask']);
// Calls that wait for an answer from the GPU process.
const BLOCKING = new Set(['getParameter', 'getError', 'getProgramParameter', 'getShaderParameter', 'getUniformLocation', 'getActiveUniform', 'getQueryParameter',
  'getSyncParameter', 'getFramebufferAttachmentParameter', 'getShaderInfoLog', 'getProgramInfoLog', 'getUniformBlockIndex', 'getActiveUniformBlockParameter',
  'getBufferSubData', 'getTexParameter', 'getUniform', 'getIndexedParameter', 'getInternalformatParameter', 'checkFramebufferStatus', 'readPixels', 'clientWaitSync', 'finish']);
const ALLOC = new Set(['texStorage2D', 'texStorage3D', 'renderbufferStorage', 'renderbufferStorageMultisample']);
const COPY = new Set(['blitFramebuffer', 'copyTexSubImage2D', 'copyTexSubImage3D', 'copyTexImage2D', 'copyBufferSubData', 'generateMipmap']);

// The calls that make a GPU work on pixels: what `only` (below) keeps from
// the driver in every pass but one.
const WORK = new Set(['drawArrays', 'drawElements', 'drawRangeElements', 'drawArraysInstanced', 'drawElementsInstanced', 'multiDrawElementsWEBGL', 'multiDrawArraysWEBGL',
  'clear', 'clearBufferfv', 'clearBufferiv', 'clearBufferuiv', 'clearBufferfi', 'blitFramebuffer', 'generateMipmap', 'copyTexSubImage2D', 'copyTexSubImage3D', 'copyTexImage2D']);
// Answers of the calls that return something, for a dry run (`dry` below).
const DRY = {
  checkFramebufferStatus: (gl) => gl.FRAMEBUFFER_COMPLETE, clientWaitSync: (gl) => gl.CONDITION_SATISFIED, getProgramParameter: () => true,
  getShaderParameter: () => true, getUniformBlockIndex: (gl) => gl.INVALID_INDEX, isContextLost: () => false, getError: () => 0,
  getParameter: () => 0, getQueryParameter: () => 0, getActiveUniform: () => null,
};

// Bytes of one texel as uploaded, from the format and type of the call.
function texelBytes(gl, format, type) {
  const comps = format === gl.RGBA || format === gl.RGBA_INTEGER ? 4 : format === gl.RGB || format === gl.RGB_INTEGER ? 3
    : format === gl.RG || format === gl.RG_INTEGER ? 2 : 1;
  const size = type === gl.UNSIGNED_BYTE || type === gl.BYTE ? 1 : type === gl.HALF_FLOAT || type === gl.UNSIGNED_SHORT || type === gl.SHORT ? 2 : 4;
  return comps * size;
}

// Counts every call on `gl` into `cur` (the frame being recorded). `led`
// carries the switches the wrappers read, both for the tools only: `timeGL`
// (also add up the time spent inside GL calls: two clock reads a call) and
// `dry` (count the call and do not make it: the renderer runs as it would,
// nothing is drawn, and what is timed is the page's own work). And `only`
// (a pass, or -1): the draws, clears and copies of every other pass are
// counted and not made, so that what the rasteriser spends on a frame is
// that pass's (tools/perf/pass_cost.mjs).
function instrument(gl, cur, led) {
  const now = () => performance.now();
  // The viewport and scissor in force, for the pixels a full-screen draw shades.
  let vpArea = 0, scArea = 0, scOn = false, fbFresh = false;
  const book = (m, v) => { cur[BASE + cursor.pass * PM.LEN + m] += v; };
  const tris = (mode, count) => (mode === 4 ? count / 3 : mode === 5 || mode === 6 ? Math.max(count - 2, 0) : 0);
  // A draw of `t` triangles in `n` sub-draws (a multi-draw is one call).
  const drew = (t, n, instances) => {
    cur[F.draws]++; cur[F.subDraws] += n; cur[F.tris] += t; cur[F.instances] += instances;
    if (fbFresh) { fbFresh = false; cur[F.targets]++; }
    const o = BASE + cursor.pass * PM.LEN;
    cur[o + PM.DRAWS]++; cur[o + PM.SUBDRAWS] += n; cur[o + PM.TRIS] += t;
  };
  const sent = (field, bytes) => {
    cur[F.uploads]++; cur[field] += bytes; cur[F.upBytes] += bytes;
    book(PM.BYTES, bytes);
  };
  const special = {
    drawArrays(mode, first, count) {
      drew(tris(mode, count), 1, 0);
      if (mode === 4 && count === 3) {
        const px = scOn ? Math.min(vpArea, scArea) : vpArea;
        cur[F.fsPasses]++; cur[F.fsPx] += px;
        book(PM.FS_PX, px);
      }
    },
    drawElements(mode, count) { drew(tris(mode, count), 1, 0); },
    drawRangeElements(mode, start, end, count) { drew(tris(mode, count), 1, 0); },
    drawArraysInstanced(mode, first, count, n) { drew(tris(mode, count) * n, 1, n); },
    drawElementsInstanced(mode, count, type, offset, n) { drew(tris(mode, count) * n, 1, n); },
    clear() { cur[F.clears]++; if (fbFresh) { fbFresh = false; cur[F.targets]++; } },
    bindFramebuffer() { fbFresh = true; },
    viewport(x, y, w, h) { vpArea = w * h; },
    scissor(x, y, w, h) { scArea = w * h; },
    enable(cap) { if (cap === gl.SCISSOR_TEST) scOn = true; },
    disable(cap) { if (cap === gl.SCISSOR_TEST) scOn = false; },
    useProgram() { cur[F.programs]++; },
    bindTexture() { cur[F.texBinds]++; },
    linkProgram() { cur[F.links]++; },
    texSubImage2D(target, level, x, y, w, h, format, type) { sent(F.texBytes, w * h * texelBytes(gl, format, type)); },
    texSubImage3D(target, level, x, y, z, w, h, d, format, type) { sent(F.texBytes, w * h * d * texelBytes(gl, format, type)); },
    texImage2D(target, level, internal, w, h, border, format, type, data) {
      cur[F.allocs]++;
      if (data && typeof w === 'number') sent(F.texBytes, w * h * texelBytes(gl, format, type));
    },
    texImage3D(target, level, internal, w, h, d, border, format, type, data) {
      cur[F.allocs]++;
      if (data) sent(F.texBytes, w * h * d * texelBytes(gl, format, type));
    },
    bufferSubData(target, at, src, srcOffset, length) {
      sent(F.bufBytes, length ? length * (src.BYTES_PER_ELEMENT || 1) : src.byteLength - (srcOffset || 0) * (src.BYTES_PER_ELEMENT || 1));
    },
    bufferData(target, src, usage, srcOffset, length) {
      cur[F.allocs]++;
      if (typeof src !== 'number' && src) sent(F.bufBytes, length ? length * (src.BYTES_PER_ELEMENT || 1) : src.byteLength);
    },
  };
  const wrap = (obj, k, before, field) => {
    const f = obj[k];
    if (typeof f !== 'function') return f;
    // What the call answers while `led.dry` keeps it from the driver: enough
    // for the renderer to carry on as if it had been made.
    const dry = k in DRY ? DRY[k](gl) : (k.startsWith('create') || k === 'fenceSync' || k === 'getUniformLocation' ? {} : undefined);
    const work = WORK.has(k);
    obj[k] = function () {
      cur[F.glCalls]++;
      cur[BASE + cursor.pass * PM.LEN]++;
      if (field >= 0) cur[field]++;
      if (before) before.apply(null, arguments);
      if (led.dry) return dry;
      if (work && led.only >= 0 && led.only !== cursor.pass) return undefined;
      if (!led.timeGL) return f.apply(obj, arguments);
      const t = now(), r = f.apply(obj, arguments);
      cur[F.glMs] += now() - t;
      return r;
    };
    return f;
  };
  const real = new Map();
  for (const k in gl) {
    if (typeof gl[k] !== 'function') continue;
    const field = STATE.has(k) ? F.state : BLOCKING.has(k) ? F.blocking : ALLOC.has(k) || /^(create|delete)[A-Z]/.test(k) ? F.allocs
      : COPY.has(k) ? F.copies : k.startsWith('uniform') ? F.uniforms : -1;
    real.set(k, wrap(gl, k, special[k] || null, field));
  }
  // Multi-draw lives on an extension object: one call, many sub-draws.
  const multi = (ext) => {
    if (!ext || ext.__ledger) return ext;
    ext.__ledger = true;
    wrap(ext, 'multiDrawElementsWEBGL', (mode, counts, at, type, offsets, offsetsAt, n) => {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += counts[at + i];
      drew(tris(mode, sum), n, 0);
    }, -1);
    wrap(ext, 'multiDrawArraysWEBGL', (mode, firsts, firstsAt, counts, at, n) => {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += counts[at + i];
      drew(tris(mode, sum), n, 0);
    }, -1);
    return ext;
  };
  // (An extension object is the same one every time it is asked for, and a
  // new one after the context was restored.)
  const getExtension = real.get('getExtension');
  multi(getExtension.call(gl, 'WEBGL_multi_draw'));
  gl.getExtension = function (name) {
    const ext = getExtension.call(gl, name);
    return name === 'WEBGL_multi_draw' ? multi(ext) : ext;
  };
  // The viewport as it stands (set before the wrappers were there).
  const vp = real.get('getParameter').call(gl, gl.VIEWPORT);
  if (vp) vpArea = vp[2] * vp[3];
}

// ctx: main.js's context ({ sim, renderer, game, audio, harness, params }).
// The phases are timed by standing in for the calls the frame loop makes on
// those objects, so the loop itself needs no marks and whatever paces it
// (the window, a VR session, the harness) is measured alike.
export function createLedger(ctx) {
  const { sim, renderer, game, audio } = ctx;
  // The engine itself where the sim runs on this thread (sim_local.js); with
  // the sim in a worker there is no step here to time.
  const engine = sim && !sim.remote ? sim.engine : null;
  const cur = new Float64Array(N);
  const ring = new Float64Array(N * HISTORY);
  const led = { timeGL: false, dry: false, only: -1 };
  const now = () => performance.now();
  let head = 0, filled = 0, total = 0;
  let t0 = 0, lastEnd = 0, open = false, drew = false, heapBefore = 0, sweptBefore = 0;
  let seqBefore = -1;
  // Time spent in phases called from inside the one being timed.
  let inner = 0;
  const counting = !(ctx.params && ctx.params.get('ledger') === '0') && !!renderer.gl;
  if (counting) instrument(renderer.gl, cur, led);

  const heap = () => (performance.memory ? performance.memory.usedJSHeapSize : 0);

  // Closes the frame being recorded: `t` is when the next one began.
  function commit(t) {
    if (!open) return;
    open = false;
    cur[F.t] = t0;
    cur[F.interval] = t - t0;
    const main = lastEnd - t0;
    cur[F.main] = main;
    cur[F.outside] = main - cur[F.step];
    cur[F.other] = Math.max(0, main - cur[F.update] - cur[F.advance] - cur[F.step] - cur[F.prepare] - cur[F.render] - cur[F.audio] - cur[F.hud]);
    const st = renderer.stats || {}, post = renderer.post, pp = renderer.particles, sync = renderer.sync;
    const c = renderer.canvas;
    cur[F.canvasPx] = c ? c.width * c.height : 0;
    cur[F.sceneW] = st.width || 0;
    cur[F.sceneH] = st.height || 0;
    cur[F.scenePx] = cur[F.sceneW] * cur[F.sceneH];
    cur[F.scale] = st.scale || 0;
    cur[F.tier] = TIER_NAMES.indexOf(st.tier);
    if (pp && pp.sets) {
      cur[F.particles] = pp.count;
      cur[F.cubes] = pp.sets[0].count;
      cur[F.sprites] = pp.sets[1].count;
      cur[F.pSent] = pp.uploaded;
      cur[F.gasFill] = pp.fill;
      cur[F.gasStep] = pp.step;
      cur[F.gasPx] = pp.gas && post ? pp.fill * post.w * post.h / (pp.step * pp.step) : 0;
      cur[F.flameFill] = pp.flameFill || 0;
    }
    const out = ctx.lastOut, O = OUT;
    if (out) {
      cur[F.quads] = out[O.STAT_QUADS];
      cur[F.quadRows] = out[O.QUAD_ROWS];
      cur[F.bodies] = out[O.STAT_BODIES];
      cur[F.awake] = out[O.STAT_AWAKE];
      cur[F.dirtyChunks] = out[O.STAT_DIRTY_CHUNKS];
      const fr = sim && sim.frame;
      if (fr && fr.f32) cur[F.mesh] = fr.f32[(out[O.PROF_PTR] >> 2) + PROF.REMESH] || 0;
    }
    const fr = sim && sim.frame;
    if (fr && sim.remote && fr.seq !== seqBefore) {
      seqBefore = fr.seq;
      cur[F.fresh] = 1;
      cur[F.wStep] = fr.stepMs || 0;
      cur[F.wPrepare] = fr.prepareMs || 0;
      cur[F.wCopy] = fr.copyMs || 0;
      cur[F.wBytes] = fr.bytes || 0;
      cur[F.wSteps] = fr.paced || 0;
    }
    if (renderer.lights) cur[F.lightBakes] = renderer.lights.baked;
    if (renderer.skyvis) {
      cur[F.skyLayers] = Math.max(0, renderer.skyvis.swept - sweptBefore);
      sweptBefore = renderer.skyvis.swept;
    }
    cur[F.quadsDrawn] = st.quads || 0;
    cur[F.shadowCascades] = st.shadowCascades || 0;
    cur[F.shadowRefreshes] = st.shadowRefreshes || 0;
    if (sync) {
      cur[F.bodiesMoved] = sync.bodiesMoved;
      cur[F.quadBytes] = sync.quadBytes;
      cur[F.bodyQuads] = sync.lists.bodyQuads;
      cur[F.quadTop] = sync.lists.top;
    }
    // (Asking the browser for its heap costs 7 us: every sixteenth frame.)
    if ((total & 15) === 0) {
      const h = heap();
      cur[F.gcFreed] = h < heapBefore ? heapBefore - h : 0;
      heapBefore = h;
    }
    cur[F.heap] = heapBefore;
    ring.set(cur, head * N);
    head = (head + 1) % HISTORY;
    if (filled < HISTORY) filled++;
    total++;
    cur.fill(0);
    drew = false;
  }

  function begin(t) {
    // The harness steps many times between two pictures: its frame runs
    // from the first step after a picture to the next picture.
    if (open && (!ctx.harness || drew)) commit(t);
    if (!open) { open = true; t0 = t; lastEnd = t; }
  }

  // Stands in for obj[name], adding its own time to `field`: what phases
  // called from inside it took is theirs.
  function phase(obj, name, field, after) {
    const f = obj && obj[name];
    if (typeof f !== 'function') return;
    obj[name] = function () {
      const t = now(), outer = inner;
      if (field === F.update || !open) begin(t);
      inner = 0;
      try {
        return f.apply(this, arguments);
      } finally {
        const e = now(), took = e - t;
        cur[field] += took - inner;
        inner = outer + took;
        lastEnd = e;
        if (after) after(took);
      }
    };
  }
  phase(game, 'update', F.update);
  phase(sim, 'advance', F.advance);
  phase(engine, 'step', F.step, () => { cur[F.steps]++; });
  // (On this thread, prepare_render; from a worker, taking the frame it sent.)
  phase(sim, 'prepare', F.prepare);
  phase(game, 'hud', F.hud);
  phase(audio, 'update', F.audio);
  phase(renderer, 'render', F.render, (ms) => {
    cursor.pass = PASS.NONE;
    drew = true;
    cur[F.renders]++;
    const p = renderer.parts;
    let sum = 0;
    for (let i = 0; i < 8; i++) { cur[F.rSync + i] += p[i]; sum += p[i]; }
    cur[F.rSetup] += Math.max(0, ms - sum);
  });

  const row = (i) => ring.subarray(i * N, i * N + N);
  const asObject = (r) => { const o = {}; for (let i = 0; i < N; i++) o[NAMES[i]] = r[i]; return o; };
  // Ring index of the k-th newest frame (0 = the last one closed).
  const nth = (k) => (head - 1 - k + HISTORY * 2) % HISTORY;

  return {
    FIELDS: NAMES, F, PASS, PASS_NAMES, TIER_NAMES, HISTORY,
    counting,
    get frames() { return total; },
    get held() { return filled; },
    // Time inside GL calls is added up as well while this is set (tools).
    get timeGL() { return led.timeGL; },
    set timeGL(v) { led.timeGL = !!v; },
    // A dry run (tools): GL calls are counted and not made. The counts are
    // those of a real frame; the times are the main thread's own, without
    // the waits a software rasteriser puts into GL calls. One way only: the
    // context no longer holds what the renderer thinks it does.
    get dry() { return led.dry; },
    set dry(v) { led.dry = led.dry || !!v; },
    // (A pass of PASS, or -1 for all of them: see `instrument`.)
    get only() { return led.only; },
    set only(v) { led.only = v | 0; },
    // Close the frame in progress now (the harness, after its draw).
    commit() { commit(now()); },
    // The last closed frame: its row of numbers (a view: copy to keep), or by name.
    raw(k = 0) { return k < filled ? row(nth(k)) : null; },
    // The last closed frame copied into dst at `at` (a tool's own table: no garbage).
    copyLast(dst, at) { if (filled) dst.set(row(nth(0)), at); },
    get last() { return filled ? asObject(row(nth(0))) : null; },
    // Mean and worst of every field over the frames held, and for `by` (a
    // field name) the whole frame in which it was worst.
    summary(by = 'outside') {
      const mean = new Float64Array(N), worst = new Float64Array(N);
      let at = -1, top = -Infinity;
      const b = F[by];
      for (let k = 0; k < filled; k++) {
        const r = row(k);
        for (let i = 0; i < N; i++) { mean[i] += r[i]; if (r[i] > worst[i]) worst[i] = r[i]; }
        if (b !== undefined && r[b] > top) { top = r[b]; at = k; }
      }
      for (let i = 0; i < N; i++) mean[i] /= filled || 1;
      return { frames: filled, mean: asObject(mean), worst: asObject(worst), worstFrame: at >= 0 ? asObject(row(at)) : null };
    },
    // The same without building objects (the F3 panel, five times a second).
    stats(mean, worst) {
      mean.fill(0); worst.fill(0);
      for (let k = 0; k < filled; k++) {
        const r = row(k);
        for (let i = 0; i < N; i++) { mean[i] += r[i]; if (r[i] > worst[i]) worst[i] = r[i]; }
      }
      for (let i = 0; i < N; i++) mean[i] /= filled || 1;
      return filled;
    },
    // Every frame held, oldest first, as rows (copies).
    trace() {
      const rows = [];
      for (let k = filled - 1; k >= 0; k--) rows.push(Array.from(row(nth(k))));
      return rows;
    },
    reset() { head = filled = 0; open = false; cur.fill(0); },
  };
}

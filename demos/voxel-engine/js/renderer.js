// WebGL2 renderer. Vertex-pulled voxel geometry drawn through culled index
// lists, cascaded sun shadows cached in a static and a body layer, volume AO
// + sky visibility, occluded point lights, an HDR scene target and a post
// chain; every feature is switched by quality tier (render_quality.js),
// and tier and resolution adapt to the GPU unless pinned.
//
// Interface used by main.js, the game and the harness:
//   new Renderer(canvas, sim), render(out), cam {pos, yaw, pitch}, fov,
//   sunDir, renderScale, setQuality(tier), setSun(azimuth, elevation),
//   timeOfDay, haze, ground, lampLights, stats.
import { OUT, VOXEL, LIGHT_STRIDE } from './engine.js';
import { MAIN_VS, MAIN_FS, HEAP_DEPTH_FS, GLASS_FS, SHADOW_VS, SHADOW_FS } from './shaders.js';
import { SKY_VS, SKY_FS } from './render_shaders_fx.js';
import { describeProgram, startProgram, finishProgram, GLState, BLEND, CULL, UNIT, makeTexture } from './render_gl.js';
import { Frame, F, MAX_LIGHTS } from './render_frame.js';
import { Shadows } from './render_shadow.js';
import { LightField, Lamps } from './render_lights.js';
import { SET } from './render_geom.js';
import { SkyVis } from './render_skyvis.js';
import { Sync } from './render_sync.js';
import { Post, BodyMotion } from './render_post.js';
import { ParticlePass, SoftShadow } from './render_particles.js';
import { Scorch } from './render_scorch.js';
import { ContactMap, CONTACT_RANGE, CONTACT_RISE } from './render_contact.js';
import { FineDetail } from './render_detail.js';
import { WaterPass } from './render_water.js';
import { FarField, FAR_VS, FAR_FS } from './render_far.js';
import { makeStones } from './render_stone.js';
import { TIERS, TIER_ORDER, AutoScale, DepthTrial, scaleRange, GEOMETRY_BUDGET, GPU_FRESH } from './render_quality.js';
import { PASS, cursor } from './frame_ledger.js';

// Stages of a frame, for the per-stage JS times in Renderer.parts.
export const PART = { SYNC: 0, FRAME: 1, VOLUMES: 2, PARTICLES: 3, SHADOWS: 4, SCENE: 5, EFFECTS: 6, POST: 7, LEN: 8 };
const HALTON2 = [0.5, 0.25, 0.75, 0.125, 0.625, 0.375, 0.875, 0.0625];
const HALTON3 = [0.3333, 0.6667, 0.1111, 0.4444, 0.7778, 0.2222, 0.5556, 0.8889];
// How long nothing may have moved before the picture is taken to stand (ms).
const STILL_MS = 100;
// Lights of the page's own that one picture takes (Renderer.flash).
const FLASHES = 4;

export class Renderer {
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.sim = sim;
    const params = new URLSearchParams(location.search);
    this.harness = params.has('harness');
    // The harness draws single frames of a paused world, so it shows every
    // frame fully settled: no deferred shadow or sky-light refreshes and no
    // temporal accumulation. ?live=1 keeps those paths as they are in play,
    // for captures and checks that are about them.
    this.live = !this.harness || params.get('live') === '1';
    const gl = canvas.getContext('webgl2', {
      antialias: false, alpha: false, depth: false, stencil: false,
      powerPreference: 'high-performance', preserveDrawingBuffer: this.harness,
    });
    if (!gl) throw new Error('WebGL2 is not available in this browser or on this GPU.');
    this.gl = gl;
    this.fov = 75;
    this.cam = { pos: [0, 0, 0], yaw: 0, pitch: 0 };
    this.sunDir = [0.45, 0.72, 0.35];
    this.haze = 1;
    // Terrain drawn beyond the edge of the voxel world: height in metres and
    // sRGB colour. Defaults match the scenes' grass at ground level.
    this.ground = { height: 1.2, color: [84, 132, 52] };
    this.debugView = params.get('debug') || '';
    // A street after rain (?wetstreet=<metres>): every surface up to that
    // height is quite wet without water having stood on it, and the film
    // on it gives back the lamps and signs (shaders.js, WET_STREET). 0: as
    // it is, wet only where water lies or has lain. Read once, at start.
    this.wetStreet = Math.max(0, +params.get('wetstreet') || 0);
    // Lay down opaque depth first so the surface shader runs once per pixel.
    // Whether the extra vertex pass pays for itself depends on the GPU and
    // has not been measured on real hardware, so it is opt-in (?prepass=1).
    this.depthPrepass = params.get('prepass') === '1';
    // The opaque lists' depth first, a hair behind where it lies, and then
    // the opaque pass as it is: a GPU that tests depth before it shades is
    // not asked to shade a wall that a nearer wall will cover. The picture
    // is the same to the pixel whatever the hair is: the pass that decides
    // every pixel is the one that always did (LESS, depth written), and
    // what the depth laid first turns away lies behind a face that the
    // pass will draw. (So of a heap, whose corners the surface shader
    // cuts away, depth is laid only where it certainly keeps the pixel:
    // `depthHeap`.) What it costs is the lists' triangles once
    // more; whether that pays is the GPU's to say, so the page asks the
    // GPU it runs on (`depthTrial`, below: render_quality.js, DepthTrial);
    // ?depthfirst=1 or 0 says it for it (tools/perf/overdraw.mjs counts
    // what it saves).
    this.depthFirst = params.get('depthfirst') === '1';
    this.tiesLast = false;
    this._capsOverride = params.get('caps');
    // Temporal AA needs several frames to converge, which a one-frame
    // capture never gives it: the harness keeps FXAA unless asked (?taa=1).
    this._allowTaa = params.get('taa') !== '0' && (this.live || params.get('taa') === '1');
    this.stats = { tier: '', scale: 1, thrift: 0, triangles: 0, subDraws: 0, drawCalls: 0, quads: 0, cpuMs: 0, gpuMs: -1, shadowCascades: 0, shadowRefreshes: 0, shadowCacheHit: 0, width: 0, height: 0 };
    // JS milliseconds of the last frame by stage (PART in this file).
    this.parts = new Float64Array(PART.LEN);
    this.frame = new Frame();
    // Emissive world voxels (street lamps, ceiling lights) act as point
    // lights once the sun is low; set to false if the engine supplies its own.
    this.lampLights = true;
    this.lamps = new Lamps();
    this._lightBuf = new Float32Array(MAX_LIGHTS * LIGHT_STRIDE);
    // Lights of the page's own (flash()): those asked for since the last
    // picture, those of the picture being drawn, and the list they are put
    // into with the engine's.
    this._flashes = new Float32Array(FLASHES * LIGHT_STRIDE);
    this._flashN = 0;
    this._flashNow = new Float32Array(FLASHES * LIGHT_STRIDE);
    this._flashNowN = 0;
    this._flashBuf = new Float32Array(MAX_LIGHTS * LIGHT_STRIDE);
    this.auto = new AutoScale();
    this._sun = [0, 0, 0];
    this._planes = new Float32Array(20);
    this._camVox = [0, 0, 0];
    this._sunSeen = [NaN, NaN, NaN];
    this._hazeSeen = NaN;
    this._scale = 1;
    this._userScale = false;
    this._scaleCap = 1;
    this._pinScale = params.has('scale');
    this._lost = false;
    this._frameNo = 0;
    const want = params.get('quality');
    this._tier = TIERS[want] ? want : 'medium';
    // Adapt only when nobody pinned the quality (or ?adapt=1 asks for it),
    // and never in the harness, whose software rasteriser says nothing about
    // a real GPU.
    const adapt = params.get('adapt');
    this.autoQuality = !this.harness && (adapt === '1' || (!want && adapt !== '0'));
    // Whether the depth is laid first is tried where the scaler runs and
    // nobody has said: never in the harness or on a page whose quality is
    // given, where a frame's counts are held to what they were.
    this.depthTrial = this.autoQuality && !params.has('depthfirst') ? new DepthTrial() : null;
    this._depthKey = [NaN, '', NaN];
    // ('' until a trial has ended, then 'first' or 'last': the readout's word.)
    this.stats.depth = this.depthFirst ? 'first' : '';
    this._startTier = this._tier;
    this._tierPinned = false;
    this._pickScale = false;
    // Where the GPU frame time comes from: the timer-query extension, else a
    // fence polled off the frame loop (?gputime=fence|none forces a fallback).
    this._gpuSource = params.get('gputime') || '';
    // ?selfindex=1: the quad lists are kept the way they are from a worker
    // (render_sync.js, useIndex), on this thread: for the checks.
    this._selfIndex = params.get('selfindex') === '1';
    this._fence = null;
    this._fenceAt = 0;
    this._fenceSeen = 0;
    this._interval = 1000 / 60; // smoothed frame interval, ms
    this._pollFence = () => this._checkFence(true);
    // When the frame being drawn began, as requestAnimationFrame stamps it
    // (frameBegan, called by the page's loop): it tells render() how long
    // the main thread had already worked on the frame (the game, a
    // simulation on this thread) when rendering began. (The renderer used
    // to ask for an animation frame of its own every frame to learn it:
    // one more call into the browser a frame, 50 us of this thread where
    // that was measured.)
    this._rafTs = 0;
    // The canvas's size on the page, read when it may have changed and not
    // every frame: asking for it makes the browser lay the page out there
    // and then, in the middle of the frame, for whatever the shell has
    // written since (the HUD, a card shown or hidden), and again at the
    // frame's end for what it writes after. (The harness's pages are drawn
    // by hand right after a tool sized them: they ask every time.)
    this._size = [0, 0, 0];
    this._sizeSeen = null;
    // Whether the passes with one-time work have done it (idle).
    this._warmedUp = false;
    this._sizeStale = true;
    // Frames, and their time, since a body last moved.
    this._still = 0;
    this._stillMs = 0;
    const stale = () => { this._sizeStale = true; };
    if (!this.harness && typeof ResizeObserver === 'function') {
      this._sizeSeen = new ResizeObserver(stale);
      // (In device pixels where the browser can: a window dragged to a
      // screen of another density changes those and nothing else.)
      try { this._sizeSeen.observe(canvas, { box: 'device-pixel-content-box' }); } catch (e) { this._sizeSeen.observe(canvas); }
      // (A resize is told before the frame that follows it is drawn; the
      // observer only after.)
      window.addEventListener('resize', stale);
    }
    this._onBodyMoved = (id, ox, oy, oz, x, y, z, r, far) => {
      this.shadows.bodyMoved(id, ox, oy, oz, x, y, z, r, far);
      this.contact.bodyMoved(id, ox, oy, oz, x, y, z, r, far);
    };
    // An edited box of the density volume (texel coordinates, max exclusive).
    this._onOccDirty = (x0, y0, z0, x1, y1, z1) => {
      const m = 2 * VOXEL;
      this.skyvis.dirty(y1);
      this.lights.worldChanged(x0 * m, y0 * m, z0 * m, x1 * m, y1 * m, z1 * m);
    };
    this._lastCam = [0, 0, 0];
    this._stillFrames = 0;
    this._lastTime = 0;
    // The step last drawn, and for how many draws and milliseconds it has been drawn again (the exposure, _render).
    this._expoStep = -1; this._expoDraws = 0; this._expoMs = 0;
    // Frames drawn since the GPU's time (stats.gpuMs) was last told.
    this._gpuAge = 0;
    this._failed = false;
    // What was solid when the scene was built. The surface shader tells
    // fracture faces and rubble from the original surfaces by it; kept here
    // so a restored context gets the same record back.
    this.pristine = sim.solidBits();
    this._initGL();
    canvas.addEventListener('webglcontextlost', (e) => {
      // Tell the browser we will rebuild, then idle until it hands the context back.
      e.preventDefault();
      this._lost = true;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this._lost = false;
      try {
        this._initGL();
      } catch (e) {
        this._fail(e);
      }
    });
  }

  // (Re)creates every GL object; also the context-restore path.
  _initGL() {
    const gl = this.gl;
    this.caps = {
      float: !!gl.getExtension('EXT_color_buffer_float'),
      half: !!gl.getExtension('EXT_color_buffer_half_float'),
      timer: gl.getExtension('EXT_disjoint_timer_query_webgl2'),
      parallel: gl.getExtension('KHR_parallel_shader_compile'),
      aniso: gl.getExtension('EXT_texture_filter_anisotropic'),
      maxAniso: 1,
    };
    // (Asked once: the answer is a round trip to the GPU process.)
    if (this.caps.aniso) this.caps.maxAniso = gl.getParameter(this.caps.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
    // ?caps=half or ?caps=none pretends extensions are missing, to exercise
    // the fallback paths on a machine that has them.
    if (this._capsOverride === 'half') this.caps.float = false;
    if (this._capsOverride === 'none') this.caps.float = this.caps.half = false;
    if (this._gpuSource === 'fence' || this._gpuSource === 'none') this.caps.timer = null;
    else this._gpuSource = this.caps.timer ? 'timer' : 'fence';
    this._fence = null;
    this.state = new GLState(gl);
    this.vao = gl.createVertexArray();
    this.ubo = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
    gl.bufferData(gl.UNIFORM_BUFFER, this.frame.data.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.ubo);
    this.sync = new Sync(gl, this.state, this.sim, this.pristine);
    if (this._selfIndex) this.sync.useIndex();
    this.shadows = new Shadows(gl, this.state);
    this.shadows.fine = this.fineDetail = new FineDetail(gl, this.state);
    this.skyvis = new SkyVis(gl, this.state);
    this.lights = new LightField(gl, this.state);
    this.post = new Post(gl, this.state, this.caps);
    this.post.allowTaa = this._allowTaa;
    this.particles = new ParticlePass(gl, this.state);
    this.water = new WaterPass(gl, this.state, this.caps.float || this.caps.half);
    this.contact = new ContactMap(gl, this.state, this.sync.transMask, this.caps.float || this.caps.half);
    for (const p of this.contact.programs) finishProgram(gl, p);
    this.motion = new BodyMotion(gl, this.state);
    this.motion.transMask = this.sync.transMask;
    finishProgram(gl, this.motion.program);
    this.soft = new SoftShadow(gl, this.state, this.caps.float || this.caps.half);
    // The stones of a heap (render_stone.js), for the surface shader.
    this.state.texForUpload(UNIT.uStone, gl.TEXTURE_2D, null);
    this.stones = makeStones(gl);
    // Where water lies or has lain (the water pass keeps it, `water.wet`):
    // until it has one, a texture that says nowhere.
    this.dry = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    // (Left unclaimed: whatever is made next may bind on this unit, which
    // stays the active one, and the scene pass then binds the stones again.)
    this.state.units[UNIT.uStone] = null;
    for (const p of this.soft.programs) finishProgram(gl, p);
    this.scorch = new Scorch(gl, this.state);
    this.far = new FarField(gl, this.state);
    // (Its casters go into the near shadows' cascades with the world.)
    this.shadows.far = this.far;
    if (this._farBlock) this.far.set(this._farBlock);
    this.programs = new Map();
    this._warm = null;
    this._query = null;
    this._pending = [];
    this._pendingSpan = [];
    this._pendingFirst = [];
    this._pool = [];
    this._frameNo = 0;
    this.stats.gpuMs = -1;
    this._sunSeen[0] = NaN;
    // (Re)building is not a choice of tier: whoever holds the tier keeps it.
    const pinned = this._tierPinned;
    this.setQuality(this._tier);
    this._tierPinned = pinned;
  }

  // A frame has come in from a sim on another thread (called by it for
  // every packet, in order, whether or not a picture is drawn of it): what
  // the packet says its rows changed in the draw lists is taken now
  // (render_sync.js, taken).
  taken(frame) {
    if (this._lost || this._failed) return;
    this.sync.taken(frame);
  }

  // A light of the page's own for the next picture drawn, and that one
  // only (both eyes of it): where x, y, z in metres, how far it reaches,
  // its colour in the engine's units (a rifle's muzzle: 4 m and 9, 6.5,
  // 3). For what the page knows a frame before the world can say it: the
  // muzzle flash in the frame after the press, the engine's own flash
  // being in the packet that follows. It goes into the frame's list of
  // lights with the engine's, ahead of the lamps, so everything lit by
  // those is lit by it (an extra pass would light the wall and not the
  // smoke). Up to FLASHES between two pictures; when the engine's list is
  // full its least lights give way for that picture.
  flash(x, y, z, radius, r, g, b) {
    if (this._flashN >= FLASHES || !(radius > 0) || !Number.isFinite(x + y + z + r + g + b)) return;
    const o = this._flashN++ * LIGHT_STRIDE, f = this._flashes;
    f[o] = x; f[o + 1] = y; f[o + 2] = z; f[o + 3] = radius;
    f[o + 4] = r; f[o + 5] = g; f[o + 6] = b; f[o + 7] = 0;
  }

  // The frame the page's loop is beginning started at `ts` (the time its
  // animation-frame callback was given).
  frameBegan(ts) { this._rafTs = ts; }

  // A frame in which nothing is drawn (the start card, a menu, a pause: the
  // page's loop calls this instead of render()). The time to make ready
  // what play may need at a bad moment: the programs of the next tier down,
  // one at a time (_prepare); and what
  // a pass makes once, in the first frame that needs it, if it has a
  // `warmUp()` (a few milliseconds a call at most; false while more is
  // left; asked again after a restart, a change of tier, a new context).
  idle() {
    if (this._lost || this._failed) return;
    if (!this._warmedUp) this._warmedUp = !this.water.warmUp || this.water.warmUp() !== false;
    // (The scaler is told when the next picture is drawn: _render.)
    this._rested = true;
    if (!this.autoQuality || this._tierPinned || this._userScale) return;
    const ti = TIER_ORDER.indexOf(this._tier);
    if (ti > 0) this._prepare(TIER_ORDER[ti - 1]);
  }

  // The land beyond the box (render_far.js): a block as `engine.far()`
  // returns it, or null for none. Kept, so a restored context draws it again.
  setFar(block) {
    // (Boxes, or a terrain: anything to draw.)
    this._farBlock = block && (block[0] > 0 || block[8] > 1) ? block : null;
    if (!this._lost && !this._failed) {
      this.far.set(this._farBlock);
      // (The cascades' world layers hold the far field's casters: drawn again.)
      this.shadows.invalidate();
    }
  }

  // The engine was re-initialised (a restart): take the new scene's record
  // and mirror every engine buffer again from scratch.
  reset() {
    if (this._lost || this._failed) return;
    this._depthAgain();
    this.pristine = this.sim.solidBits();
    this.sync.reset(this.pristine);
    this.shadows.invalidate();
    this.shadows.forget();
    this.contact.forget();
    this.shadows.hadBodies = false;
    this.post.historyValid = false;
    this.motion.reset();
    this.scorch.reset();
    this.particles.restRev = -1;
    this.fineDetail.reset();
    this.water.reset();
    this._warmedUp = false;
    this._frameNo = 0;
    this._flashN = this._flashNowN = 0;
  }

  get renderScale() { return this._scale; }
  // What a write means depends on who asks. With ?scale= in the URL
  // (benchmarks, the harness) or a value above 1 (supersampling) the scale is
  // pinned and the auto-scaler stops adjusting. Otherwise it is the game's
  // render-scale setting: a ceiling under which the tier's own scale and the
  // auto-scaler still work, and 1 is no ceiling at all, so a player who has
  // touched nothing gets the adaptive default.
  set renderScale(v) {
    v = Math.max(0.25, Math.min(2, Number(v) || 1));
    if (this._pinScale || v > 1) {
      this._scale = v;
      this._userScale = true;
      return;
    }
    // The settings code writes its value again whenever any setting
    // changes: the same ceiling as before must not disturb the scale the
    // auto-scaler has arrived at.
    if (!this._userScale && v === this._scaleCap) return;
    this._userScale = false;
    this._scaleCap = v;
    this.auto.maxScale = v;
    // A lower ceiling takes effect at once; up to a higher one the
    // auto-scaler climbs when it finds the room (without it, the scale is
    // the tier's own under the ceiling).
    this._scale = this.autoQuality ? Math.min(this._scale, v) : Math.min(this.q ? this.q.scale : 1, v);
  }

  get quality() { return this._tier; }

  // Everything a tier draws with: its settings and its programs (described
  // only; they compile when the tier is prepared or switched to).
  _tierSet(tier) {
    const q = TIERS[tier], v = this.post.derive(q);
    let d = `#define CASCADES ${q.camCascades.length + 1}\n#define SHADOW_TAPS ${q.shadowTaps}\n#define SHADOW_MAX_R ${q.shadowMaxR}\n#define AO_TAPS ${q.aoTaps}\n#define POINT_LIGHTS\n#define CONTACT_RANGE ${CONTACT_RANGE.toFixed(1)}\n#define CONTACT_RISE ${CONTACT_RISE.toFixed(2)}\n`;
    // (Parts of the surface shading a tier goes without: `surfaceOff` in
    // its table; `?nosurf=A,B` adds to it, for measuring what each costs.)
    const off = new Set([...(q.surfaceOff || []), ...((typeof location !== 'undefined' && new URLSearchParams(location.search).get('nosurf')) || '').split(',').filter(Boolean)]);
    for (const k of off) d += `#define NO_${k}\n`;
    if (q.lightOcc) d += '#define LIGHT_OCC\n';
    // (The detail noise is filtered anisotropically on some tiers: the
    // surface patterns' lookups take another form where it is not.)
    if (!(q.aniso > 1)) d += '#define NOISE_ISO\n';
    if (q.shadowBlend) d += '#define SHADOW_BLEND\n';
    if (q.bevel && !off.has('BEVEL')) d += '#define BEVEL\n';
    if (q.specular) d += '#define SPECULAR\n';
    if (q.detail) d += '#define DETAIL\n';
    // (Wetness is drawn from the water pass's mask, `water.wet`: both sides key on this.)
    if (q.wet && !off.has('WET')) d += '#define WET_MASK\n';
    // (A street wet all over, up to its line in metres, which gives back
    // its lamps: one lobe a light in reach, where a film lies.)
    if (q.wet && !off.has('WET') && this.wetStreet > 0) d += `#define WET_STREET ${this.wetStreet.toFixed(2)}\n`;
    // (The surface shader cuts a heap's corners out; the depth pre-pass has no such cut.)
    if (this.depthPrepass) d += '#define NO_CUT\n';
    const soft = this.soft.ok && !!q.softShadow;
    if (soft) d += '#define SOFT_SHADOW\n';
    const enc = v.encode ? '#define HDR_ENCODE\n' : (v.alpha ? '' : '#define HDR_DITHER\n');
    d += enc;
    const set = {
      q,
      // (The plain program never draws a quad of rubble or foliage: the
      // lists give every one of those to the heap program, whether its
      // segment is drawn in two parts or whole, and a check holds that at
      // every look, tools/perf/quad_delta_check.mjs. So what the shading
      // keeps for those materials is left out of it.)
      opaque: this._program('opaque', MAIN_VS, MAIN_FS, d + '#define NO_HEAP_MATERIALS\n'),
      // The segments that hold rubble or foliage (QuadLists.drawHeap): the
      // same shader with the heap's mound, stones and leaves compiled in,
      // so that no other pixel carries that code or its discard.
      opaqueHeap: this._program('opaque heap', MAIN_VS, MAIN_FS, d + (off.has('MOUND') ? '' : '#define HEAP\n')),
      // The heap program for foliage alone (every other quad is taken out
      // in the vertex stage): laid again over the soot, which is not for
      // leaves.
      leafOnly: this._program('leaf only', MAIN_VS, MAIN_FS, d + (off.has('MOUND') ? '' : '#define HEAP\n') + '#define LEAF_ONLY\n'),
      // (The lowest tier's glass spends its one noise tap on the clouds it mirrors, not on grime.)
      glass: this._program('glass', MAIN_VS, GLASS_FS, d + '#define NO_GROW\n#define GLASS_PASS\n' + (q.detail ? '' : '#define PATTERN_LEAN\n')),
      shadow: this._program('shadow', SHADOW_VS, SHADOW_FS, ''),
      shadowBodies: this._program('shadow bodies', SHADOW_VS, SHADOW_FS, '#define BODIES_PASS\n'),
      // (With the tier's defines: where a quad lies is the vertex shader's
      // with them, to the bit.)
      depth: this._program('depth', MAIN_VS, 'void main() {}\n', d),
      // The heap list's depth for the same (depthFirst). Where the heap
      // program cuts nothing away (the lowest tier; ?nosurf=MOUND) it is
      // the plain one's; where it does, depth only where the mound
      // certainly keeps the pixel, and no foliage (HEAP_DEPTH_FS).
      depthHeap: q.detail && !off.has('MOUND') ? this._program('depth heap', MAIN_VS, HEAP_DEPTH_FS, d + '#define HEAP_DEPTH\n') : null,
      sky: this._program('sky', SKY_VS, SKY_FS, (q.clouds ? '#define CLOUDS\n' : '') + enc),
      post: this.post.programs(q),
      scorch: Scorch.program((name, vs, fs, def) => this._program(name, vs, fs, def), v.encode),
      pressed: Scorch.pressedProgram((name, vs, fs, def) => this._program(name, vs, fs, def), v.encode),
      particles: this.particles.programs({ cascades: q.camCascades.length + 1, gasRes: q.gasRes, gasFill: q.gasFill, gasCoarsest: q.gasCoarsest, puffs: q.softParticles, encode: v.encode, lightOcc: q.lightOcc, soft, detail: q.detail, flames: q.flames }),
      water: this.water.programs({ cascades: q.camCascades.length + 1, enc, water: q.water, wet: q.wet }),
    };
    // (With the tier's defines: its plain faces carry the surface patterns.)
    set.far = this._program('far', FAR_VS, FAR_FS, d);
    set.fine = this.fineDetail.programs((name, vs, fs, def) => this._program(name, vs, fs, def), d + '#define HEAP\n');
    set.all = [set.opaque, set.opaqueHeap, set.leafOnly, set.glass, set.shadow, set.shadowBodies, set.sky, set.far, set.scorch, set.pressed, ...set.fine.all, ...set.particles.all, ...Object.values(set.post)];
    set.all.push(...set.water.all);
    // (Made ready with the rest where it may be tried: its first use is
    // then no standstill.)
    if (this.depthPrepass || this.depthFirst || this.depthTrial) set.all.push(set.depth);
    if (set.depthHeap && (this.depthFirst || this.depthTrial)) set.all.push(set.depthHeap);
    return set;
  }

  // keepScale: leave the render scale as it is (the auto-scaler's tier moves).
  // Called from outside, a tier other than the one the renderer started on
  // is the player's choice and stays: the auto-scaler then only adapts the
  // resolution. 'auto', or the starting tier, hands the tier back to it.
  setQuality(tier, keepScale = false) {
    if (tier === 'auto') tier = this._startTier;
    if (!TIERS[tier]) return;
    if (!keepScale) this._tierPinned = tier !== this._startTier;
    const set = this._tierSet(tier);
    this._tier = tier;
    const q = this.q = set.q;
    if (!this._userScale && !keepScale) {
      this._scale = Math.min(q.scale, this._scaleCap);
      // When adapting, the first resize picks the start from the canvas size.
      this._pickScale = this.autoQuality;
    }
    this.shadows.configure(q.shadowRes, q.camCascades, q.kernel, q.shadowInterval);
    this.shadows.slackTexels = q.shadowSlack || 0;
    this.contact.slack = q.contactSlack || 0;
    if (this.contact.shift !== (q.contactShift !== false)) {
      this.contact.shift = q.contactShift !== false;
      this.contact.layerValid = false;
      this.contact.filled = false;
    }
    this.skyvis.layersPerFrame = q.skyLayers || 4;
    // Paced like play (shadow rate limits, the sky-visibility budget) when
    // live, or when the tier is the one for recording frame after frame.
    this.paced = this.live || !!q.paced;
    this.shadows.rateLimit = this.paced;
    this.post.configure(q);
    this.pOpaque = set.opaque;
    this.pOpaqueHeap = set.opaqueHeap;
    this.pLeafOnly = set.leafOnly;
    this.pGlass = set.glass;
    this.pScorch = set.scorch;
    this.pPressed = set.pressed;
    this.pShadow = set.shadow;
    this.pShadowBodies = set.shadowBodies;
    this.pDepth = set.depth;
    this.pDepthHeap = set.depthHeap || set.depth;
    this._depthAgain();
    this.pSky = set.sky;
    this.far.program = set.far;
    this.particles.configure(set.particles);
    this.fineDetail.configure(set.fine, q, this.sim);
    this.water.configure(set.water);
    this._warmedUp = false;
    this.lights.occlude = q.lightOcc;
    this.lights.bakeBudget = q.lightBakes || 8;
    this.soft.enabled = !!q.softShadow;
    // Surface detail is all drawn from one noise texture: how far it holds
    // on ground seen at a low angle is that texture's anisotropy.
    if (this.caps.aniso) {
      const gl = this.gl, ext = this.caps.aniso;
      this.state.texForUpload(UNIT.uNoise, gl.TEXTURE_2D, this.sync.noiseTex);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.max(1, Math.min(q.aniso || 1, this.caps.maxAniso)));
    }
    this.lamps.max = q.lamps;
    // (The tier's own rates: what the governor has taken off them is taken off again.)
    this._thrift = -1;
    this._applyThrift(this.auto.thrift);
    // Whatever is not compiled yet is compiled now, so a shader error
    // surfaces here and not in the middle of a frame.
    for (const p of set.all) finishProgram(this.gl, p);
    this.state.prog = null;
    this.stats.tier = tier;
    this._sunSeen[0] = NaN; // atmosphere constants depend on the tier
    if (!keepScale) this.auto.reset();
  }

  // The governor's cheap savings (render_quality.js, THRIFT_MAX): level 1
  // halves the gas layer's budget and the rates at which sky visibility
  // and light maps are brought up to date, 2 also draws the contact map
  // every other frame, 3 also the shadows of moving bodies.
  _applyThrift(level) {
    if (level === this._thrift) return;
    this._thrift = level;
    const q = this.q, half = level >= 1 ? 1 : 0;
    this.particles.thin = half ? 0.5 : 1;
    this.skyvis.layersPerFrame = Math.max(1, (q.skyLayers || 4) >> half);
    this.lights.bakeBudget = Math.max(2, (q.lightBakes || 8) >> half);
    this.contact.cadence = level >= 2 ? 2 : 1;
    this.shadows.cadence = level >= 3 ? 2 : 1;
    this.stats.thrift = level;
  }

  _program(name, vs, fs, defines) {
    const key = name + '|' + defines;
    let p = this.programs.get(key);
    if (!p) {
      p = describeProgram(vs, fs, defines, name, (gl, u) => {
        if (u.uTransMask) gl.uniform1uiv(u.uTransMask, this.sync.transMask);
      });
      this.programs.set(key, p);
    }
    return p;
  }

  // Gets a tier's programs compiled ahead of a switch without stalling a
  // frame. Call every frame until it returns true.
  // gently: in play with nothing pressing (see _render): one program every
  // third of a second, so that a GPU process that compiles on its own main
  // thread holds a frame up by one program at a time and not by sixteen.
  // flood: the tier is wanted now (two programs a call go to the compiler
  // and are taken when all are done). Otherwise one at a time: a program
  // goes to the compiler only when the one before it has come back, and
  // no sooner than `apart` ms after that one went. A GPU process that
  // compiles on its main thread stands still for every program it has
  // been handed, one after another: eight handed over behind the start
  // card stood between a player who then pressed Play and the first
  // picture for two seconds. With one out at a time, whoever comes next
  // waits for one compile at most.
  _prepare(tier, flood = false, apart = 0) {
    let w = this._warm;
    if (!w || w.tier !== tier) w = this._warm = { tier, all: this._tierSet(tier).all, next: 0, done: false, begun: -1000 };
    if (w.done) return true;
    const gl = this.gl, ext = this.caps.parallel, now = performance.now();
    if (!flood) {
      // The one that is out, if any: has it come back? (Asked ten times a
      // second at most: the question itself waits for the GPU process.)
      let out = null, next = null;
      for (const p of w.all) {
        if (p.u) continue;
        if (p.p) { out = p; break; }
        if (!next) next = p;
      }
      if (out) {
        if (now - (w.asked || 0) < 100) return false;
        w.asked = now;
        if (ext ? !gl.getProgramParameter(out.p, ext.COMPLETION_STATUS_KHR) : now - out.started < 400) return false;
        finishProgram(gl, out);
        this.state.prog = null;
        return false;
      }
      if (!next) {
        w.done = true;
        return true;
      }
      if (now - w.begun < apart) return false;
      startProgram(gl, next, now);
      w.begun = now;
      return false;
    }
    // Two a frame at most: handing a program's source over is a
    // millisecond or two of this thread each, and without the
    // parallel-compile extension a compile occupies the GPU process's main
    // thread as well.
    const most = 2;
    for (let n = 0; w.next < w.all.length && n < most; w.next++) {
      if (w.all[w.next].p) continue;
      startProgram(gl, w.all[w.next], now);
      w.begun = now;
      n++;
    }
    if (w.next < w.all.length) return false;
    // Asking whether a program is done is not free everywhere: where the
    // browser has to ask the GPU process, the question waits for whatever
    // that process is doing (measured: 20 to 80 ms a question while it
    // compiled, every frame for two seconds). Ten times a second is enough.
    if (now - (w.asked || 0) < 100) return false;
    w.asked = now;
    let finished = 0;
    for (const p of w.all) {
      if (p.u) continue;
      // Asking for the link status blocks until the driver is done, so wait
      // until it says so (or, without the extension, has had time).
      if (ext ? !gl.getProgramParameter(p.p, ext.COMPLETION_STATUS_KHR) : performance.now() - p.started < 400) return false;
      // Collecting a finished program's uniforms is still a round trip to
      // the GPU process: one a frame, not fourteen at the switch.
      if (++finished > 1) return false;
      finishProgram(gl, p);
      this.state.prog = null;
    }
    w.done = true;
    return true;
  }

  // Sun position as a look direction: azimuth like camera yaw (0 = toward -Z,
  // positive turns left), elevation above the horizon, both in radians.
  setSun(azimuth, elevation) {
    const c = Math.cos(elevation);
    this.sunDir[0] = -Math.sin(azimuth) * c;
    this.sunDir[1] = Math.sin(elevation);
    this.sunDir[2] = -Math.cos(azimuth) * c;
  }

  // Local solar time in hours for a mid-latitude spring day (sunrise near 6,
  // sunset near 18.5); undefined until set. +X is east, -Z is north.
  get timeOfDay() { return this._timeOfDay; }
  set timeOfDay(hours) {
    this._timeOfDay = hours;
    const h = (hours - 12) / 12 * Math.PI, lat = 0.73, dec = 0.21;
    const north = Math.cos(lat) * Math.sin(dec) - Math.sin(lat) * Math.cos(dec) * Math.cos(h);
    this.sunDir[0] = -Math.cos(dec) * Math.sin(h);
    this.sunDir[1] = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(h);
    this.sunDir[2] = -north;
  }

  // The scene or the tier is another: whether the depth is laid first is
  // asked again, and until it is answered it is not.
  _depthAgain() {
    if (!this.depthTrial) return;
    this.depthTrial.reset();
    this.depthFirst = false;
    this.stats.depth = '';
  }

  // GPU frame time through EXT_disjoint_timer_query_webgl2, when present.
  // One query at a time; results arrive a few frames late.
  _beginTimer() {
    const ext = this.caps.timer;
    if (!ext || this._query || this._pending.length >= 3) return;
    const q = this._pool.pop() || this.gl.createQuery();
    this.gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
    this._query = q;
    this._queryAt = performance.now();
    this._queryFirst = this.depthFirst;
  }

  _endTimer() {
    if (!this._query) return;
    this.gl.endQuery(this.caps.timer.TIME_ELAPSED_EXT);
    this._pending.push(this._query);
    // How long this thread took from the query's first command to its
    // last: the time the query reports is no shorter where the commands
    // went to the GPU's process as they were issued (render_quality.js).
    this._pendingSpan.push(performance.now() - this._queryAt);
    this._pendingFirst.push(this._queryFirst);
    this._query = null;
  }

  _pollTimer() {
    const ext = this.caps.timer, gl = this.gl;
    if (!ext || !this._pending.length) return;
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    while (this._pending.length) {
      const q = this._pending[0];
      if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
      const span = this._pendingSpan.shift(), first = this._pendingFirst.shift();
      if (!disjoint) {
        this.stats.gpuMs = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6;
        this._gpuAge = 0;
        this.stats.gpuSpanMs = span;
        // (Read here and nowhere kept: DepthTrial says why.)
        if (this.depthTrial) this.depthTrial.sample(this.stats.gpuMs, first, false);
      }
      this._pending.shift();
      this._pool.push(q);
    }
  }

  // GPU frame time without the timer extension: how long after its commands
  // were submitted a frame finished, found by polling a sync object between
  // frames. Coarser than a timer query (timers tick every 1-4 ms) but enough
  // to tell a 5 ms frame from a 20 ms one, which interval statistics cannot.
  _startFence() {
    const gl = this.gl;
    if (this._fence || this._gpuSource !== 'fence') return;
    this._fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    this._fenceFirst = this.depthFirst;
    gl.flush();
    this._fenceAt = this._fenceSeen = performance.now();
    setTimeout(this._pollFence, 0);
  }

  // again: keep polling from timers until the fence signals.
  _checkFence(again) {
    if (!this._fence || this._lost) return;
    const gl = this.gl, now = performance.now();
    const status = gl.clientWaitSync(this._fence, 0, 0);
    if (status === gl.TIMEOUT_EXPIRED) {
      this._fenceSeen = now;
      if (again) setTimeout(this._pollFence, 1);
      return;
    }
    // It signalled somewhere between the last look and this one. A long gap
    // means the timers were starved (hidden tab, busy main thread) and the
    // sample says nothing.
    if (status !== gl.WAIT_FAILED && now - this._fenceSeen < 40) {
      // When the GPU is the bottleneck, frames queue up behind each other
      // and the latency is several frames long; the GPU's time per frame is
      // then the frame interval itself.
      this.stats.gpuMs = Math.max(0.1, Math.min((now + this._fenceSeen) * 0.5 - this._fenceAt, this._interval));
      this._gpuAge = 0;
      if (this.depthTrial) this.depthTrial.sample(this.stats.gpuMs, this._fenceFirst, true);
    }
    gl.deleteSync(this._fence);
    this._fence = null;
  }

  // A renderer failure after start-up (a shader that will not compile on
  // this driver, a lost extension) must be visible, not a silent black canvas.
  _fail(e) {
    this._failed = true;
    console.error(e);
    const el = document.createElement('pre');
    el.textContent = 'Renderer error\n\n' + String((e && e.message) || e);
    el.style.cssText = 'position:fixed;left:0;top:0;right:0;max-height:70%;overflow:auto;margin:0;padding:12px;background:#2a0b0b;color:#ffd9d9;font:12px/1.4 ui-monospace,monospace;z-index:1000;white-space:pre-wrap';
    document.body.appendChild(el);
  }

  render(out) {
    if (this._lost || this._failed) return;
    try {
      // (No frame to mirror from yet: the picture stays until there is.)
      const frame = this.sync.source();
      if (frame) this._render(out, frame);
    } catch (e) {
      this._fail(e);
    }
  }

  // Match the drawing buffer to the canvas's displayed size.
  _fitCanvas() {
    const c = this.canvas, size = this._size;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this._sizeStale || !this._sizeSeen || dpr !== size[2]) {
      size[0] = c.clientWidth;
      size[1] = c.clientHeight;
      size[2] = dpr;
      this._sizeStale = false;
    }
    const w = Math.max(2, Math.round(size[0] * dpr));
    const h = Math.max(2, Math.round(size[1] * dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    if (this.autoQuality && !this._userScale) {
      // Limits and starting point follow the pixel count, not the canvas:
      // a 4K canvas starts, and can go, as low in pixels as a 720p one.
      const range = scaleRange(this._tier, w * h);
      this.auto.minScale = range[0];
      if (this._pickScale) this._scale = Math.min(range[1], this._scaleCap);
      this._scale = Math.max(Math.min(range[0], this._scaleCap), this._scale);
    }
    this._pickScale = false;
  }

  _resizeTargets() {
    // (A VR eye is as large as its viewport, whatever the canvas is.)
    const c = this.frame.eye || this.canvas;
    // Scene dimensions stay even so half-resolution passes line up.
    const sw = Math.max(2, Math.round(c.width * this._scale * 0.5) * 2);
    const sh = Math.max(2, Math.round(c.height * this._scale * 0.5) * 2);
    this.post.resize(sw, sh);
  }

  _render(out, frame) {
    const t0 = performance.now();
    // (The frame ledger books every GL call on the pass named here.)
    cursor.pass = PASS.SETUP;
    const gl = this.gl, st = this.state, fr = this.frame, d = fr.data;
    // The second eye of a VR frame is drawn from what the first left: what
    // is brought up to date once a frame, or spread over several, is not
    // touched again for it (and both eyes are lit by the same state).
    const again = fr.eye !== null && fr.eye.again;
    // The harness steps time itself: one draw is one 60 Hz frame.
    const dt = this.harness ? 1000 / 60 : (this._lastTime ? t0 - this._lastTime : 0);
    this._lastTime = t0;
    this._pollTimer();
    if (dt > 0 && dt < 250) this._interval += (dt - this._interval) * 0.2;
    // A fence still pending from the previous frame: look now, and if the GPU
    // has not finished that frame yet, it has at least been this long.
    if (this._fence) {
      this._checkFence(false);
      if (this._fence) { this.stats.gpuMs = Math.max(this.stats.gpuMs, Math.min(t0 - this._fenceAt, this._interval)); this._gpuAge = 0; }
    }
    this._fitCanvas();
    const rested = this._rested;
    this._rested = false;
    if (this.autoQuality && !this._userScale) {
      const a = this.auto, ti = TIER_ORDER.indexOf(this._tier);
      // What the page's own thread is known to have spent of the time
      // since the last frame was begun: this frame before rendering (the
      // game, a simulation on this thread, taking a worker's packet) and
      // the rendering of the last one. A frame that is late for that is
      // not late for the GPU. Unknown when the frame-start timestamp is
      // not this frame's.
      let busy = this._rafTs > 0 ? t0 - this._rafTs : -1;
      if (busy < 0 || busy > dt) busy = -1;
      else busy = Math.min(dt, busy + this.stats.cpuMs);
      // Without a GPU time there is no evidence of headroom, so the tier
      // never goes above the one it started on; with one, up to high.
      // (A time that is news: one that nothing has renewed is none.)
      const top = Math.max(TIER_ORDER.indexOf(this._startTier), this.stats.gpuMs >= 0 && !rested && this._gpuAge <= GPU_FRESH ? TIER_ORDER.indexOf('high') : 0);
      // A tier that is not on the ladder (capture) has no neighbours to move to.
      // After frames that drew nothing, the time since the last picture
      // is not a frame's: the scaler starts counting again.
      // (And the GPU's time from before them is not this picture's: it
      // counts again when a frame drawn after them has renewed it.)
      if (rested) { a.rested(); this._gpuAge = Infinity; }
      a.update(rested ? 0 : dt, this.stats.gpuMs, busy, this._scale, ti > 0 && !this._tierPinned, ti >= 0 && ti < top && !this._tierPinned, this.stats.triangles / GEOMETRY_BUDGET,
        this._gpuSource === 'timer' ? this.stats.gpuSpanMs || 0 : 0, this._gpuAge);
      this._applyThrift(a.thrift);
      if (a.tierStep) {
        const next = TIER_ORDER[ti + a.tierStep];
        // (No such tier, or the player has set the tier by hand since the
        // scaler asked: nobody moves it then, in either direction.)
        if (!next || this._tierPinned) {
          a.tierChanged(0);
        } else if (this._prepare(next, a.tierStep < 0 && a.far)) {
          // Its programs are compiled: the switch itself is cheap. (All
          // of them handed to the compiler at once only on the way down
          // with the frame far over; a step up, or a step down that can
          // wait a second, takes them one at a time: the eleven of the
          // tier above, handed over together, were a standstill of a
          // quarter of a second just before the picture got better.)
          const dir = a.tierStep;
          this.setQuality(next, true);
          a.tierChanged(dir);
          a.scale = this._scale;
        }
      } else if (ti > 0 && !this._tierPinned && this._frameNo > 30 && (this._stillFrames > 10 || a.thrift > 0 || a.trial !== 0)) {
        // Have the next tier down ready for the moment it is needed. It is
        // made ready behind the start card (idle(), below); here only what
        // is still missing: one program at a time, a third of a second
        // apart, while nothing in the picture moves (a player who clicked
        // straight through the card stands still for a moment) and from
        // the first thing the scaler gives up, which is seconds before it
        // comes to the tier; two a frame only when the frame is far over,
        // where the tier is wanted now and a compile cannot make things
        // worse. (A
        // GPU process that compiles on its main thread stands still for
        // each one: two a frame for as long as the scaler was trying
        // something made every frame of those seconds a slow one, which
        // the timer then read as a GPU far over its time, and the tier
        // went for it. One every third of a second is one slow frame in
        // twenty, which the middle of five times does not see.)
        this._prepare(TIER_ORDER[ti - 1], a.far, 330);
      }
      this._scale = a.scale;
    }
    // Whether this frame lays the plain list's depth first is the trial's
    // to say (render_quality.js, DepthTrial), once a frame: both eyes of a
    // VR frame alike.
    // (Not in a headset: there a late frame is felt, the trial's second
    // may be the dearer one, the VR rig's own ladder counts late frames,
    // and the scaler's period is not the headset's. Off, and asked again
    // when the session is over.)
    if (this.depthTrial && fr.eye !== null) {
      if (this.depthFirst || this.depthTrial.block >= 0 || this.depthTrial.verdict !== '') this._depthAgain();
    } else if (this.depthTrial && !again) {
      const a = this.auto, k = this._depthKey;
      const steady = !rested && k[0] === this._scale && k[1] === this._tier && k[2] === a.thrift && a.trial === 0 && !a.tierStep;
      k[0] = this._scale; k[1] = this._tier; k[2] = a.thrift;
      // A trial starts on a GPU time that is news; and where the time is
      // only the fence's estimate, only while frames are being missed for
      // the GPU (there the estimate is the frame's interval, and exact).
      const timed = this.stats.gpuMs >= 0 && this._gpuAge <= GPU_FRESH;
      this.depthFirst = this.depthTrial.frame(steady, timed && (this._gpuSource === 'timer' || this.stats.gpuMs > a.period * 1.15));
      this.stats.depth = this.depthTrial.verdict;
    }
    this._resizeTargets();
    this.particles.resize(this.post.w, this.post.h);
    const q = this.q;
    this._beginTimer();
    const post = this.post;
    post.drawCalls = 0;
    let draws = 0, stt_fine = 0;

    let mark = performance.now();
    const parts = this.parts;
    const lap = (i) => { const t = performance.now(); parts[i] = t - mark; mark = t; };
    cursor.pass = PASS.SYNC;
    this.sync.update(frame, out, this._onBodyMoved, this._onOccDirty);
    lap(PART.SYNC);
    cursor.pass = PASS.FRAME;
    const lists = this.sync.lists;
    if (lists.worldChanged) {
      // (Box by box: changes far apart stay apart.)
      const n = lists.changedBoxN;
      for (let i = 0; i < n; i++) this.shadows.worldChanged(lists.changedBoxes, i * 6);
      if (n === 0) this.shadows.worldChanged(lists.changedBox);
    }
    // (Bodies whose quads changed were reported one by one, as those that moved.)
    this.fineDetail.sync(out, frame);
    if (this.fineDetail.changed) this.shadows.worldChanged(this.fineDetail.changedBox());
    if (this.fineDetail.changedBodies) this.shadows.bodiesChanged();
    // Nothing has moved for a tenth of a second (a pause, the last piece
    // asleep): the picture is going to stand, and the bodies the lowest
    // tier's slack has let lie a fraction of a texel from their shade are
    // drawn where they are, once.
    if (!again) {
      if (this.sync.bodiesMoved > 0) { this._still = 0; this._stillMs = 0; }
      else {
        this._stillMs += dt;
        if (++this._still >= 2 && this._stillMs >= STILL_MS) {
          this.shadows.settle(lists, this.sync.bodies);
          this.contact.settle(lists, this.sync.bodies);
        }
      }
    }

    // Sun and atmosphere, recomputed only when the sun moved.
    const s = this._sun, sd = this.sunDir;
    const sl = Math.hypot(sd[0], sd[1], sd[2]) || 1;
    s[0] = sd[0] / sl; s[1] = sd[1] / sl; s[2] = sd[2] / sl;
    const sunMoved = s[0] !== this._sunSeen[0] || s[1] !== this._sunSeen[1] || s[2] !== this._sunSeen[2] || this.haze !== this._hazeSeen;
    if (sunMoved) {
      this._sunSeen[0] = s[0]; this._sunSeen[1] = s[1]; this._sunSeen[2] = s[2];
      this._hazeSeen = this.haze;
      fr.setAtmosphere(s, this.haze, q.shafts ? 0.5 : 0);
    }
    // Without a float target nothing adapts the exposure: at night it is
    // then set for the lamps, not for moonlight, or every lit pavement
    // burns out.
    fr.exposureScale = post.autoExpo ? 1 : 1 - 0.6 * fr.night;
    // Sub-pixel jitter (Halton 2,3 over eight frames) when temporal AA is on.
    let jx = 0, jy = 0;
    if (post.taa) {
      const i = this._frameNo & 7;
      jx = (HALTON2[i] - 0.5) / post.w;
      jy = (HALTON3[i] - 0.5) / post.h;
      fr.frame = i;
    } else {
      fr.frame = 0;
    }
    // A projection offset of -2j in NDC moves the image by +j in uv.
    fr.setCamera(this.cam, this.fov, post.w / post.h, -2 * jx, -2 * jy, out[OUT.STAT_FRAME] / 60);
    fr.frustumPlanes(this._planes, 1, post.w, post.h);
    if (lists.lampsChanged) {
      this.lamps.rebuild(lists.lamps, this.sync.emission);
      lists.lampsChanged = false;
    }
    let lightSrc = frame.f32, lightPtr = out[OUT.LIGHTS_PTR] >> 2, lightCount = out[OUT.LIGHT_COUNT];
    let engineLights = Math.min(lightCount, MAX_LIGHTS);
    // The page's own lights of this picture (flash()), first in the list.
    if (!again) {
      this._flashNowN = this._flashN;
      this._flashN = 0;
      if (this._flashNowN > 0) this._flashNow.set(this._flashes);
    }
    if (this._flashNowN > 0) {
      const own = this._flashNowN * LIGHT_STRIDE, kept = Math.min(engineLights, MAX_LIGHTS - this._flashNowN) * LIGHT_STRIDE, buf = this._flashBuf;
      for (let i = 0; i < own; i++) buf[i] = this._flashNow[i];
      for (let i = 0; i < kept; i++) buf[own + i] = lightSrc[lightPtr + i];
      lightSrc = buf;
      lightPtr = 0;
      lightCount = engineLights = (own + kept) / LIGHT_STRIDE;
    }
    const lampGain = this.lampLights && this.lamps.count ? this.lamps.gain(s[1]) : 0;
    if (lampGain > 0) {
      lightCount = this.lamps.merge(this._lightBuf, lightSrc, lightPtr, lightCount, this.cam.pos, this._planes, lampGain);
      lightSrc = this._lightBuf;
      lightPtr = 0;
    }
    this.lights.update(fr, lightSrc, lightPtr, lightCount, engineLights, this._planes, frame.occ, frame.occAt, this.sync.occDims);
    const wx = out[OUT.WORLD_SX] * VOXEL, wy = out[OUT.WORLD_SY] * VOXEL, wz = out[OUT.WORLD_SZ] * VOXEL;
    // Shadows follow the direct light: the sun, or the moon after dusk. In
    // the minutes between the two nothing casts and they are off.
    const sunUp = fr.lit;
    d[F.SUN_DIR + 3] = sunUp ? 1 : 0;
    if (sunUp) this.shadows.update(fr, this.cam.pos, fr.light, wx, wy, wz);
    if (!again) this.scorch.poll(this.sim, wx, wy, wz, this.paced);
    const od = this.sync.occDims;
    fr.set3(F.OCC_INV, 1 / (od[0] * 2 * VOXEL), 1 / (od[2] * 2 * VOXEL), 1 / (od[1] * 2 * VOXEL), 0);
    fr.set3(F.SKYVIS_INV, 1 / (od[0] * 2 * VOXEL), 1 / (od[2] * 2 * VOXEL), 1 / (od[1] * 2 * VOXEL), 0);
    fr.set3(F.SCREEN, 1 / post.w, 1 / post.h, post.w, post.h);
    // Contact map: anything that moves, redrawn when any of it did.
    const cubes = out[OUT.PARTICLE_DEBRIS], atRest = out[OUT.PARTICLE_RESTING];
    // (While things fall, their dust is thin: ParticlePass.veil. Worked out
    // once a frame; the second eye is given what the first was.)
    if (!again) this.particles.veil(out[OUT.STAT_AWAKE], cubes - atRest);
    d[F.SKYVIS_INV + 3] = this.particles.shown;
    const anyDyn = lists.quads(SET.BODIES) > 0 || cubes > 0;
    // (A sim frame drawn a second time: nothing in it has moved since.)
    const drawnBefore = frame.seq === this.particles.sent;
    // (The last piece in flight may go without coming to rest: banked or
    // expired. Then nothing moves and the resting block is as it was, and
    // only the count says that a shadow has to be taken away.)
    const debrisChanged = !drawnBefore && (cubes > atRest || cubes !== this.particles.sets[0].count || atRest !== this.particles.restCount || out[OUT.PARTICLE_REST_REV] !== this.particles.restRev);
    // (Bodies move in a frame drawn from a packet drawn before, when they
    // are on their way between two packets' places: sim_tween.js.)
    const dynChanged = !again && ((!drawnBefore && (lists.bodiesChanged || debrisChanged)) || this.sync.bodiesMoved > 0);
    this.contact.update(fr, this.cam.pos, anyDyn, dynChanged);
    if (!again) this.soft.update(fr, this.cam.pos, fr.light, sunUp, cubes, debrisChanged);
    const gc = this.ground.color;
    fr.set3(F.GROUND, Math.pow(gc[0] / 255, 2.2), Math.pow(gc[1] / 255, 2.2), Math.pow(gc[2] / 255, 2.2), this.ground.height);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, d, 0, fr.usedLength());
    lap(PART.FRAME);

    // Sky visibility: everything on the first frame, then a few layers a frame.
    cursor.pass = PASS.VOLUMES;
    this.skyvis.ensure(od[0], od[1], od[2]);
    if (this.skyvis.busy && !again) draws += this.skyvis.update(this.sync.occTex, this._frameNo === 0 || !this.paced ? 0 : undefined);

    if (this.lights.count > 0 && !again) {
      st.vao(this.vao);
      draws += this.lights.bake(this.sync.occTex);
    }

    lap(PART.VOLUMES);
    cursor.pass = PASS.PARTICLE_UPLOAD;
    if (!again) this.particles.upload(frame.u32, frame.f32, out[OUT.PARTICLES_PTR] >> 2, out[OUT.PARTICLE_COUNT],
      out[OUT.PARTICLE_DEBRIS], out[OUT.PARTICLE_RESTING], out[OUT.PARTICLE_REST_REV], d, frame.seq);
    if (!again) this.soft.setDust(this.particles.dusty);
    this.water.update(frame, out, fr, this.cam.pos, again);
    lap(PART.PARTICLES);
    cursor.pass = PASS.CONTACT;
    st.tex(UNIT.uQuads, gl.TEXTURE_2D, this.sync.quadTex);
    st.tex(UNIT.uXf, gl.TEXTURE_2D, this.sync.xfTex);
    st.tex(UNIT.uPalette, gl.TEXTURE_2D, this.sync.paletteTex);
    st.tex(UNIT.uPalPack, gl.TEXTURE_2D, this.sync.palettePacked);
    draws += this.contact.render(lists, this.particles.sets[0], this.sync.bodies);
    cursor.pass = PASS.SOFT_SHADOW;
    if (!again) draws += this.soft.render(this.particles, this.vao);
    cursor.pass = PASS.SHADOW;
    let cascades = 0;
    if (sunUp && !again) {
      cascades = this.shadows.render(this.pShadow, this.pShadowBodies, lists, this._frameNo, this.sync.bodies);
      draws += cascades + this.shadows.refreshed;
    }
    cursor.pass = PASS.FAR;
    if (!again) draws += this.far.updateShadow(this._tier, fr.light, sunUp, this._frameNo, this.paced && sunMoved, cascades > 0);
    lap(PART.SHADOWS);

    // Scene: opaque voxels, sky behind them, then glass.
    cursor.pass = PASS.OPAQUE;
    st.fbo(post.scene);
    // (`tiesLast`, for a check: where two opaque faces have the same depth
    // to the bit, the one drawn last has the pixel and not the one drawn
    // first. The pixels that change with it are the pixels whose colour
    // hangs on the order of the slots, which is each page's own.)
    st.depth(true, true, this.tiesLast ? gl.LEQUAL : gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    st.scissor(false);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    st.tex(UNIT.uPalette, gl.TEXTURE_2D, this.sync.paletteTex);
    st.tex(UNIT.uOcc, gl.TEXTURE_3D, this.sync.occTex);
    st.tex(UNIT.uLightOcc, gl.TEXTURE_2D, this.lights.tex);
    st.tex(UNIT.uShadow, gl.TEXTURE_2D, this.shadows.tex);
    st.tex(UNIT.uSkyVis, gl.TEXTURE_3D, this.skyvis.texture);
    st.tex(UNIT.uNoise, gl.TEXTURE_2D, this.sync.noiseTex);
    st.tex(UNIT.uStone, gl.TEXTURE_2D, this.stones);
    st.tex(UNIT.uWet, gl.TEXTURE_2D, this.water.wet || this.dry);
    st.tex(UNIT.uSolid0, gl.TEXTURE_3D, this.sync.solidTex);
    st.tex(UNIT.uDyn, gl.TEXTURE_2D, this.contact.tex);
    st.tex(UNIT.uSoft, gl.TEXTURE_2D, this.soft.tex);
    fr.frustumPlanes(this._planes, VOXEL, post.w, post.h);
    const cv = this._camVox;
    // In VR `cam.pos` is the head, shared by both eyes so that nothing
    // cached around the camera is redone per eye; faces are culled by the eye.
    const ep = fr.eye ? fr.eye.pos : this.cam.pos;
    cv[0] = ep[0] / VOXEL; cv[1] = ep[1] / VOXEL; cv[2] = ep[2] / VOXEL;
    let visible;
    if (this.depthPrepass) {
      gl.colorMask(false, false, false, false);
      st.program(this.pDepth);
      visible = lists.drawVisible(this._planes, cv);
      const heaps = lists.drawHeap();
      gl.colorMask(true, true, true, true);
      st.depth(true, false, gl.EQUAL);
      st.program(this.pOpaque);
      lists.redrawVisible();
      draws += this.fineDetail.drawScene(true, this._planes);
      if (heaps) {
        st.program(this.pOpaqueHeap);
        lists.drawHeap();
      }
      if (this.scorch.any) {
        draws += this.scorch.draw(post, this.pScorch, this.sync.noiseTex, this.sync.solidTex, this.sync.occTex, this.skyvis.texture);
        st.fbo(post.scene);
        st.depth(true, false, gl.EQUAL);
        if (heaps) {
          st.program(this.pLeafOnly);
          lists.drawHeap();
          draws++;
        }
      }
      if (visible) draws += heaps ? 4 : 2;
    } else {
      if (this.depthFirst) {
        gl.colorMask(false, false, false, false);
        // (The hair: four of the depth buffer's own steps and a hundredth
        // of the face's slope. The same triangle from the same vertex
        // shader rasterises to the same depths in both passes (`invariant
        // gl_Position`: the passes at EQUAL further down stand on the
        // same), so one step behind would do; the rest is for a GPU whose
        // two programs round a corner a last bit apart: three steps of
        // depth, and a corner snapped to the rasteriser's grid one step
        // (a 256th of a pixel) to the side. A hair of the whole slope
        // (1, 2) let through what lay a pixel's worth behind every face
        // seen at a slant: 1.16 fragments a pixel in the town's wide view,
        // against 1.04.)
        st.polygonOffset(true, 0.01, 4);
        st.program(this.pDepth);
        visible = lists.drawVisible(this._planes, cv);
        if (lists.hn) {
          st.program(this.pDepthHeap);
          lists.drawHeap();
          draws++;
        }
        st.polygonOffset(false);
        gl.colorMask(true, true, true, true);
        st.program(this.pOpaque);
        lists.redrawVisible();
        if (visible) draws++;
      } else {
        st.program(this.pOpaque);
        visible = lists.drawVisible(this._planes, cv);
      }
      if (visible) draws++;
      draws += this.fineDetail.drawScene(false, this._planes);
      // Heaps and foliage, with the program that knows them: of each
      // segment that holds any, the range its heap quads lie in (the plain
      // program has drawn the rest of it: QuadLists._spans).
      if (lists.hn) {
        st.program(this.pOpaqueHeap);
        lists.drawHeap();
        draws++;
      }
      // What blasts have blackened, laid over what stood when they went off:
      // the world, its bodies and the fine faces of its breaks (nearly all
      // of them the blast's own: left out, they were clean squares in the
      // blackest part of the mark), and the segments drawn with the heaps
      // (laid before them, the soot stopped along a segment's edge on a
      // wall that ran on). The mark itself refuses what was not there as
      // built, so a heap lying where air was takes none; debris, drawn
      // after this, takes none. (In the ledger it counts with the opaque
      // pass.)
      if (this.scorch.any) {
        draws += this.scorch.draw(post, this.pScorch, this.sync.noiseTex, this.sync.solidTex, this.sync.occTex, this.skyvis.texture);
        st.fbo(post.scene);
        // Soot is not for leaves: a crown and a hedge are laid again,
        // clean, on their own pixels (the surfaces' LEAF_ONLY: the same
        // positions to the bit, so the depth test at EQUAL holds). A
        // scorched tree is the fire's char, in the voxels themselves.
        // (Of the heap list, the segments that hold foliage: the others'
        // quads the program takes out, every one.)
        if (lists.ln) {
          st.depth(true, false, gl.EQUAL);
          st.program(this.pLeafOnly);
          lists.drawLeaves();
          draws++;
        }
        st.depth(true, true, this.tiesLast ? gl.LEQUAL : gl.LESS);
      }
    }
    stt_fine = this.fineDetail.quads;
    cursor.pass = PASS.FAR;
    draws += this.far.draw(this._tier);
    // Where heavy things came down, on the far field's ground as well.
    if (this.scorch.pressed) {
      draws += this.scorch.drawPressed(post, this.pPressed, this.sync.noiseTex, this.sync.solidTex, this.sync.occTex);
      st.fbo(post.scene);
    }
    lap(PART.SCENE);
    cursor.pass = PASS.CUBES;
    draws += this.particles.drawCubes();
    // Temporal AA: where the bodies' pixels were a frame ago.
    cursor.pass = PASS.MOTION;
    const moving = this.motion.render(post, this.sync, out[OUT.XF_COUNT], lists, this.fineDetail);
    if (moving) {
      draws += moving;
      st.fbo(post.scene);
    }
    cursor.pass = PASS.SKY;
    st.vao(this.vao);
    st.depth(true, false, gl.LEQUAL);
    st.cull(CULL.OFF);
    st.program(this.pSky);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    draws++;
    if (q.ssao) {
      cursor.pass = PASS.SSAO;
      post.runSSAO();
      st.fbo(post.scene);
      st.depth(true, false, gl.LEQUAL);
    }
    cursor.pass = PASS.GLASS;
    if (lists.quads(SET.GLASS) > 0) {
      st.cull(CULL.BACK);
      st.blend(BLEND.PREMUL);
      st.program(this.pGlass);
      lists.drawGlass(this._planes);
      st.vao(this.vao);
      draws++;
    }

    // Water over everything solid and under the dust and smoke.
    cursor.pass = PASS.WATER;
    draws += this.water.draw(post, this.vao, this.paced && !fr.eye);

    cursor.pass = PASS.GAS;
    if (this.particles.sets[1].count > 0) {
      draws += this.particles.drawSoft(post, this.vao);
      st.vao(this.vao);
      // (Water in the air is in the dust, not behind it: render_water.js.)
      cursor.pass = PASS.WATER;
      draws += this.water.drawOver(post, this.vao);
    }

    lap(PART.EFFECTS);
    cursor.pass = PASS.SHAFTS;
    const shaftTex = sunUp && q.shafts ? post.runShafts(this.shadows.tex) : null;
    post.baseExposure = fr.exposure;
    // The eye aims lower at night: a street without lamps should adapt to
    // dim, not to an overcast afternoon.
    post.exposureKey = 0.27 * (1 - 0.6 * fr.night);
    // By day the open sky sets the exposure and shade stays shade. At night
    // that exposure is the one for moonlight: under a street lamp the eye
    // closes much further than it ever does between sun and shade.
    post.exposureLow = 0.8 - 0.7 * fr.night;
    post.exposureReach = 0.5 + 0.3 * fr.night;
    // By day a sunlit white wall may sit near the top of the curve; a pool
    // of lamplight in the dark may not, or it reads as burnt out.
    post.exposureHot = 1.7 - 1.0 * fr.night;
    post.grade[0] = fr.golden;
    post.grade[1] = fr.night;
    // Eyes adapt instantly across a teleport.
    const cp = this.cam.pos, lp = this._lastCam;
    const jump = Math.abs(cp[0] - lp[0]) + Math.abs(cp[1] - lp[1]) + Math.abs(cp[2] - lp[2]) > 4;
    lp[0] = cp[0]; lp[1] = cp[1]; lp[2] = cp[2];
    // The eye closes slowly: over a second and more, so the half second of
    // a blast's flash barely moves it and the frame does not pump dark
    // afterwards. It opens again faster than it closed.
    // Over a world that stands (the game in its menu, a tool's picture:
    // the same step drawn again for a quarter of a second and four draws)
    // the eye is put where the meter says, every draw: what is drawn of a
    // stopped world does not depend on what this renderer saw before.
    // Eased there as in play it never arrives: the exposure is kept in a
    // half float, and a step of `adapt` times what is left rounds back to
    // where it was once that is under half a unit in the last place, so
    // two pages shown one stopped world stood up to a hundredth apart
    // (every pixel a shade apart) and, eased faster, still one unit apart
    // (one level in an eighth of the pixels, the same page always the
    // brighter). What the meter aims at depends a little on where the
    // exposure is (its caps on bright taps), rising with it and far more
    // slowly, so setting it outright comes to rest in two or three draws
    // and at the same value from either side.
    if (!again) {
      const step = out[OUT.STAT_FRAME];
      if (step !== this._expoStep) { this._expoStep = step; this._expoDraws = 0; this._expoMs = 0; }
      else { this._expoDraws++; this._expoMs += dt; }
    }
    const stands = this._expoDraws >= 4 && this._expoMs >= 250;
    // (A headset's second eye is shown at the exposure the first left: eased
    // again by the time the first eye took to draw, the two eyes differed
    // by that, and at a blast's flash by enough for the edge filter to
    // choose differently at an edge here and there.)
    post.adapt = again ? 0 : jump || stands || this._frameNo < 2 ? 1 : 1 - Math.exp(-dt / 1300);
    post.adaptOpen = again ? 0 : jump || stands || this._frameNo < 2 ? 1 : 1 - Math.exp(-dt / 600);
    // "Still" for temporal AA: neither the view nor anything in it changed.
    const still = !fr.cameraMoved && !sunMoved && !this.sync.geometryChanged && this.sync.bodiesMoved === 0
      && this.particles.count === 0 && !this.lights.changed && !this.skyvis.busy && !this.water.animating;
    this._stillFrames = still ? this._stillFrames + 1 : 0;
    cursor.pass = PASS.TAA;
    const color = post.taa ? post.runTAA(jx, jy, jump, this._stillFrames) : post.scene.tex;
    cursor.pass = PASS.POST;
    const screen = fr.eye || this.canvas;
    post.finish(color, screen.width, screen.height, shaftTex);
    if (this.debugView) post.showBuffer(this.debugView, this.canvas.width, this.canvas.height);
    this._endTimer();
    this._startFence();

    const stt = this.stats;
    stt.scale = this._scale;
    stt.drawCalls = draws + post.drawCalls;
    stt.quads = visible;
    // Triangles and sub-draws of the quad lists in every pass of this
    // frame (six triangles a debris cube on top).
    const ql = this.sync.lists;
    stt.triangles = ql.indices / 3 + this.particles.sets[0].count * 6;
    stt.subDraws = ql.spans;
    ql.indices = ql.spans = 0;
    stt.fineQuads = stt_fine;
    stt.farQuads = this.far.drawn;
    stt.shadowCascades = cascades;
    stt.shadowRefreshes = sunUp ? this.shadows.refreshed : 0;
    stt.shadowCacheHit = this.shadows.totalPossible ? 1 - this.shadows.totalRendered / this.shadows.totalPossible : 0;
    stt.width = post.w;
    stt.height = post.h;
    lap(PART.POST);
    stt.cpuMs = performance.now() - t0;
    cursor.pass = PASS.NONE;
    if (!again) { this._frameNo++; this._gpuAge++; }
  }
}

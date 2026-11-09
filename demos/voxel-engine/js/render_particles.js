// Particles: the engine's instance list in two buffers. Debris cubes are
// opaque, depth-written and lit like the world; resting ones are uploaded
// only when the engine says that block changed. Dust, smoke, fire and sparks
// are soft sprites, premultiplied (emissive ones write zero alpha, which
// makes the same blend state additive), in the far-to-near order the engine
// hands them over in.
//
// Gas is what costs fill rate: thousands of large overlapping sprites, and
// with the camera inside a cloud each of the near ones covers the screen
// (blasts along a street measured 79 screens of overdraw). So gas is drawn
// into a layer of reduced resolution and brought back with a depth-aware
// upsample. The tier sets the finest the layer gets (the scene's own
// resolution on high, half on medium, a quarter on low); every frame the
// overdraw is estimated from the instances and the layer made coarser, up
// to an eighth (a sixteenth on low), until the gas costs no more than a
// few screens of pixels.
// Dense dust is where nobody can see the difference. Sparks, thin and
// bright, stay at full resolution.
import { P_STRIDE, P_SPRITE_STRIDE } from './engine.js';
import { describeProgram, makeTarget, makeTexture, freeTarget, BLEND, CULL, UNIT } from './render_gl.js';
import { FULLSCREEN_VS } from './render_shaders_fx.js';
import { F } from './render_frame.js';
import { flameQuad, FLAME_BY_DAY_FROM, CUBE_VS, CUBE_FS, SOFT_VS, SOFT_FS, GAS_UP_FS, SOFT_DEBRIS_VS, SOFT_DEBRIS_FS, SOFT_GAS_VS, SOFT_GAS_FS, SOFT_MERGE_FS } from './render_shaders_particles.js';

const STRIDE_BYTES = P_STRIDE * 4, SPRITE_BYTES = P_SPRITE_STRIDE * 4;
const KIND_SPARK = 3;
const KIND_FIRE = 4;
// The size (m) under which an unmarked fire puff is a flame (FLAME_SMALL
// times 1.8 in the sprites' shader, and a hair over).
const FLAME_FULL_SIZE = 0.9001;
const DUST_CLEAR = 1.4; // metres; as in SOFT_VS
const VEIL = 0.4;       // share of its opacity a cloud near the eye keeps while things fall through it

export class ParticlePass {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    // Two instance buffers, so each draw runs only over the instances it
    // actually renders: [0] debris cubes, [1] soft sprites. Their rows
    // differ (engine/src/particles.rs): a cube's is twelve words, a
    // sprite's eight, with no rotation in it.
    // (And a third, [2]: the sparks among the sprites, their rows copied
    // out, for the pass that draws sparks and nothing else: `sparks`.)
    // (And a fourth, [3]: the small flames among them, likewise: `flames`.)
    this.sets = [0, 1, 1, 1].map((sprites) => {
      const set = { vao: gl.createVertexArray(), buf: gl.createBuffer(), cap: 0, count: 0, words: sprites ? P_SPRITE_STRIDE : P_STRIDE };
      gl.bindVertexArray(set.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, set.buf);
      for (let i = 0; i < 4; i++) gl.enableVertexAttribArray(i);
      if (!sprites) {
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, STRIDE_BYTES, 0);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, STRIDE_BYTES, 16);
        gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, STRIDE_BYTES, 32);
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, STRIDE_BYTES, 36);
      } else {
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, SPRITE_BYTES, 0);
        // A spark's streak vector and its opacity, four signed 16-bit
        // numbers (in a gas sprite's row these bytes are its opacity as a
        // float, which location 3 reads).
        gl.vertexAttribPointer(1, 4, gl.SHORT, true, SPRITE_BYTES, 20);
        // Colour, and the kind in the fourth byte.
        gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, SPRITE_BYTES, 16);
        // Unused, opacity (gas), glow.
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, SPRITE_BYTES, 20);
      }
      for (let i = 0; i < 4; i++) gl.vertexAttribDivisor(i, 1);
      return set;
    });
    gl.bindVertexArray(null);
    state.vaoObj = undefined;
    // The sparks among a frame's sprites, in the list's order, in a buffer
    // of their own: the pass that draws the sparks ran its vertex stage
    // over every sprite to throw all but the sparks away (16,000 puffs
    // for 50 sparks while a street comes down: as many triangles again
    // as the gas itself, and half the software rasteriser's time for the
    // gas). Off: the sparks' pass runs over the whole list, as it did
    // (for a comparison).
    // The small flames among them, in the list's order, the same way: the
    // tiers that draw flames at the scene's own size (`P.flames`) draw
    // these rows and nothing else.
    this.flames = this.sets.pop();
    this.flamesOn = false;
    this._flamesWanted = false;
    this._flameRows = new Uint32Array(256 * P_SPRITE_STRIDE);
    this.sparks = this.sets.pop();
    this.sparksApart = true;
    this._sparkRows = new Uint32Array(64 * P_SPRITE_STRIDE);
    this.count = 0;
    this.gas = false;        // any sprite this frame that is not a spark
    this.dusty = false;      // any dust or smoke among them (what casts a shadow)
    this.fill = 0;           // screens of pixels the gas covers at scene resolution
    this.flameFill = 0;      // screens of pixels the flames' quads cover at the scene's own size (0 where the tier has no flames' pass)
    this._flameF32 = null;
    this.thin = 1;           // share of the tier's gas budget in use (the governor lowers it)
    this.step = 1;           // scene pixels per pixel of the gas layer this frame
    this.restRev = -1;       // revision of the resting block in the cube buffer
    this.restCount = 0;
    this.uploaded = 0;       // instances sent this frame
    this.sent = -1;          // number of the sim frame the buffers hold
    this.cache = new Map();
    this.P = null;
    this.layer = null;       // reduced-resolution gas target
    this.mark = null;        // its second attachment
    this.falling = 0;        // 0..1: how much is coming down just now (veil())
    this.shown = 1;          // the share of their opacity dust and smoke are drawn at this frame
    this.src = null;         // this frame's instances (engine memory, as floats and as words) and where the sprites begin
    this.srcU = null;
    this.srcAt = 0;
    this.w = 0;
    this.h = 0;
    this._warm();
  }

  // The overdraw estimate first runs in the frame of the first explosion,
  // over thousands of instances: have the browser optimise it beforehand,
  // on made-up sprites in front of a made-up camera.
  _warm() {
    const n = 1024, f = new Float32Array(n * P_SPRITE_STRIDE), u = new Uint32Array(f.buffer), d = new Float32Array(F.LEN);
    for (let i = 0; i < n; i++) {
      const o = i * P_SPRITE_STRIDE;
      f[o] = (i % 37) - 18; f[o + 1] = (i % 11) - 5; f[o + 2] = -(i % 53) + 6; f[o + 3] = 0.3 + (i % 7) * 0.4;
      u[o + 4] = (i % 9 === 0 ? KIND_SPARK : 1 + (i % 2)) << 24;
    }
    d[F.CAM_FWD + 2] = -1; d[F.CAM_RIGHT] = 1; d[F.CAM_UP + 1] = 1; d[F.PROJ + 2] = 1.2; d[F.PROJ + 3] = 0.7;
    for (let k = 0; k < 300; k++) this._fill(u, f, 0, n, d);
  }

  // The share of their opacity that dust and smoke NEAR THE EYE are drawn
  // at this frame. A fall has to be seen: while bodies are awake and debris
  // is in the air, the cloud between a player and the thing opening in
  // front of them is thin, a veil it shows through; the sprites' shader
  // lets go of the veil with distance (VEIL_NEAR to VEIL_FAR there), so the
  // cloud a tower raises across the street is the whole cloud. awake:
  // bodies awake; flying: debris cubes not at rest
  // (s). Thin at once when something starts to come down, thick again as
  // the last of it comes to rest.
  veil(awake, flying) {
    // The frame's own numbers and nothing kept from earlier frames: two
    // renderers shown one world draw one veil whatever each drew before.
    // (It was eased over a second and a half, and for an hour it counted
    // seconds since things began to move: a renderer that had watched a
    // fall then drew other smoke over a stopped world than one that began
    // there.)
    this.falling = Math.min(Math.max((awake + flying / 40 - 2) / 10, 0), 1);
    return this.shown = 1 - (1 - VEIL) * this.falling;
  }

  // The programs for a tier (described, not yet compiled). o: cascades
  // (shadow cascade count), gasRes (the finest gas layer: 1 = sprites
  // straight into the scene, 2 or 4 = a layer that many times smaller),
  // gasFill (screens of gas pixels a frame may cost before the layer gets
  // coarser), gasCoarsest (how many times smaller than the scene the layer
  // may get, 8 where the tier does not say), puffs (noise-shaped sprites), encode (8-bit scene target),
  // lightOcc (point lights are tested against their occlusion maps), soft
  // (the soft shadow map is there to be read), detail (debris gets the
  // patterns' noise taps and its corners chipped), flames (small flames
  // are drawn at the scene's own size, in a pass of their own: true, or
  // 'day' for by day only).
  programs(o) {
    let d = `#define CASCADES ${o.cascades}\n#define SHADOW_TAPS 1\n#define SHADOW_MAX_R 1\n`;
    if (o.lightOcc) d += '#define LIGHT_OCC\n';
    if (o.encode) d += '#define HDR_ENCODE\n';
    if (o.soft) d += '#define SOFT_SHADOW\n';
    // Variants are kept so switching tiers back and forth compiles nothing new.
    const get = (name, vs, fs, defs, init = null) => {
      const key = name + '|' + defs;
      if (!this.cache.has(key)) this.cache.set(key, describeProgram(vs, fs, defs, name, init));
      return this.cache.get(key);
    };
    const soft = d + '#define SOFT\n' + (o.puffs ? '#define PUFFS\n' : '');
    // (uSoft in the sprites' vertex stage: bound by the renderer before the scene.)
    const full = (g, u) => g.uniform1i(u.uStep, 1);
    const P = { cubes: get('debris', CUBE_VS, CUBE_FS, d + (o.detail ? '#define DETAIL\n#define DEBRIS_INSIDE\n#define DEBRIS_CHIPS\n#define DEBRIS_PLANES 8\n#define DEBRIS_CUT 0.05\n#define DEBRIS_DETAIL_PX 9.0\n' : '#define PATTERN_LEAN\n#define DEBRIS_CHIPS\n#define DEBRIS_PLANES 4\n#define DEBRIS_CUT 0.16\n#define DEBRIS_DETAIL_PX 16.0\n')), gasRes: o.gasRes, gasFill: o.gasFill, gasCoarsest: o.gasCoarsest || 8, encode: o.encode };
    // Small flames at the scene's own size, where the tier's table says so.
    const flames = o.flames ? '#define FLAME_FULL\n' + (o.flames === 'day' ? '#define FLAME_BY_DAY\n' : '') : '';
    P.gas = get('gas', SOFT_VS, SOFT_FS, soft + flames + '#define NO_SPARKS\n#define GAS_MARK\n');
    // (A tier whose sprites have no noise gives it to its flames: without
    // it a flame is a teardrop.)
    P.flames = o.flames ? get('flames', SOFT_VS, SOFT_FS, soft + (o.puffs ? '' : '#define PUFFS\n') + flames + '#define ONLY_FLAMES\n', full) : null;
    P.sparks = get('sparks', SOFT_VS, SOFT_FS, soft + '#define ONLY_SPARKS\n', full);
    P.up = get('gas upsample', FULLSCREEN_VS, GAS_UP_FS, o.encode ? '#define HDR_ENCODE\n' : '');
    P.flamesByDay = o.flames === 'day';
    P.all = [P.cubes, P.gas, P.sparks, P.up];
    if (P.flames) P.all.push(P.flames);
    if (o.gasRes === 1) {
      // Everything in one sorted pass while the gas is thin.
      P.soft = get('soft particles', SOFT_VS, SOFT_FS, soft + flames, full);
      P.all.push(P.soft);
    }
    return P;
  }

  // P: what programs() returned for the tier being switched to.
  configure(P) {
    this.P = P;
    // (The flames' rows are kept only for a tier that draws them: a list
    // sent before the switch is sent again.)
    if (this.flamesOn !== !!P.flames) { this.flamesOn = !!P.flames; this.sent = -1; }
    this.w = 0; // the layer's size and format follow the tier
  }

  // Scene target size. Reallocates the gas layer only when something changed.
  resize(w, h) {
    if (w === this.w && h === this.h) return;
    const gl = this.gl, st = this.state, P = this.P;
    this.w = w;
    this.h = h;
    freeTarget(gl, this.layer);
    // Sized for the finest step it is used at; coarser steps draw into a
    // corner of it.
    const finest = Math.max(P.gasRes, 2);
    st.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
    if (this.mark) gl.deleteTexture(this.mark);
    this.layer = makeTarget(gl, Math.ceil(w / finest), Math.ceil(h / finest), P.encode ? gl.RGBA8 : gl.RGBA16F, gl.NEAREST);
    // Its second attachment: the share of the cover that is smoke the
    // engine marks (SOFT_FS oMark; read once a pixel by the upsample).
    this.mark = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, this.layer.w, this.layer.h);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.mark, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    st.units[st.unit] = null;
    st.target = undefined;
  }

  // Screens of pixels the gas sprites cover at scene resolution, from every
  // eighth instance (it only steers how coarse the gas layer is).
  // u32/f32/first/count: the sprite instances; d: the frame block (camera
  // basis and projection).
  _fill(u32, f32, first, count, d) {
    const cx = d[F.CAM_POS], cy = d[F.CAM_POS + 1], cz = d[F.CAM_POS + 2];
    const fx = d[F.CAM_FWD], fy = d[F.CAM_FWD + 1], fz = d[F.CAM_FWD + 2];
    const rx = d[F.CAM_RIGHT], rz = d[F.CAM_RIGHT + 2];
    const ux = d[F.CAM_UP], uy = d[F.CAM_UP + 1], uz = d[F.CAM_UP + 2];
    const tx = d[F.PROJ + 2], ty = d[F.PROJ + 3];
    let area = 0;
    for (let i = first, end = first + count * P_SPRITE_STRIDE; i < end; i += 8 * P_SPRITE_STRIDE) {
      const kind = u32[i + 4] >>> 24;
      if (kind === KIND_SPARK) continue;
      const dx = f32[i] - cx, dy = f32[i + 1] - cy, dz = f32[i + 2] - cz, r = f32[i + 3] * 0.5;
      const z = dx * fx + dy * fy + dz * fz;
      // Behind the camera, or inside the fade next to it.
      if (z < 0.1 + r * 0.2) continue;
      // Dust and smoke right around the eye are not drawn (DUST_CLEAR).
      if (kind <= 2 && dx * dx + dy * dy + dz * dz < DUST_CLEAR * DUST_CLEAR) continue;
      const x = Math.abs(dx * rx + dz * rz), y = Math.abs(dx * ux + dy * uy + dz * uz);
      if (x - r > z * tx || y - r > z * ty) continue;
      // Its disc in units of the screen's half height and half width, no
      // larger than the screen.
      const w = Math.min(r / (z * tx), 1), h = Math.min(r / (z * ty), 1);
      area += w * h;
    }
    // pi r^2 of a disc against the 2 x 2 of the screen, times the stride.
    return area * (Math.PI / 4) * 8;
  }

  // Screens of pixels the flames' quads cover at the scene's own size, as
  // the vertex stage cuts them (flameQuad), from every eighth row of the
  // flames' set (as the gas's fill is): what the flames' pass costs, for
  // the ledger. (From every row it was 0.04 ms of a frame's millisecond
  // of script with a house alight.) d: the frame block.
  _flameFill(d) {
    const n = this.flames.count;
    if (n === 0) return 0;
    if (!this._flameF32 || this._flameF32.buffer !== this._flameRows.buffer) this._flameF32 = new Float32Array(this._flameRows.buffer);
    const f = this._flameF32;
    const cx = d[F.CAM_POS], cy = d[F.CAM_POS + 1], cz = d[F.CAM_POS + 2];
    const fx = d[F.CAM_FWD], fy = d[F.CAM_FWD + 1], fz = d[F.CAM_FWD + 2];
    const rx = d[F.CAM_RIGHT], rz = d[F.CAM_RIGHT + 2];
    const ux = d[F.CAM_UP], uy = d[F.CAM_UP + 1], uz = d[F.CAM_UP + 2];
    const tx = d[F.PROJ + 2], ty = d[F.PROJ + 3];
    const day = Math.min((d[F.AMB_SKY] * 0.2126 + d[F.AMB_SKY + 1] * 0.7152 + d[F.AMB_SKY + 2] * 0.0722) * 2, 1);
    let area = 0;
    for (let i = 0, end = n * P_SPRITE_STRIDE; i < end; i += 8 * P_SPRITE_STRIDE) {
      const dx = f[i] - cx, dy = f[i + 1] - cy, dz = f[i + 2] - cz, r = f[i + 3] * 0.5;
      const z = dx * fx + dy * fy + dz * fz;
      if (z < 0.1) continue;
      // (A flame stands up to 1.6 times its width, on its foot.)
      if (Math.abs(dx * rx + dz * rz) - r > z * tx || Math.abs(dx * ux + dy * uy + dz * uz) - r * 2 > z * ty) continue;
      area += Math.min(r / (z * tx), 1) * Math.min(r / (z * ty), 1) * flameQuad(f[i + 3], f[i + 6], day);
    }
    return area * 8;
  }


  _send(set, src, at, first, instances) {
    const gl = this.gl;
    if (instances <= 0) return;
    gl.bufferSubData(gl.ARRAY_BUFFER, first * set.words * 4, src, at, instances * set.words);
    this.uploaded += instances;
  }

  // Makes room for `instances`; true when the buffer was reallocated (and so
  // holds nothing).
  _reserve(set, instances) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, set.buf);
    if (instances <= set.cap) return false;
    set.cap = Math.max(1024, instances * 2);
    gl.bufferData(gl.ARRAY_BUFFER, set.cap * set.words * 4, gl.DYNAMIC_DRAW);
    return true;
  }

  // Upload this frame's instances. u32/f32 are engine memory (the colour
  // field is raw bytes, which a float copy could corrupt), ptr the list's
  // word offset. The list holds `debris` cubes first, the first `resting` of
  // them unchanged since the engine last bumped `restRev`; sprites follow,
  // in their shorter rows.
  // frame: the frame block's floats, camera already set. seq: the number of
  // the sim frame the list belongs to; a frame drawn before (the sim is
  // slower than the display, or stands still) is in the buffers already and
  // nothing of it is sent again.
  upload(u32, f32, ptr, count, debris, resting, restRev, frame, seq = -1) {
    const cubes = this.sets[0], soft = this.sets[1];
    // Whether the flames' rows are wanted this frame: where the tier draws
    // its flames' pass, and by day where it draws it by day only (the
    // sprites' vertex stage makes the same test). A list sent before the
    // answer changed is sent again.
    const flamesOn = this.flamesOn && (!this.P.flamesByDay || frame[F.AMB_SKY] * 0.2126 + frame[F.AMB_SKY + 1] * 0.7152 + frame[F.AMB_SKY + 2] * 0.0722 > FLAME_BY_DAY_FROM);
    if (flamesOn !== this._flamesWanted) { this._flamesWanted = flamesOn; this.sent = -1; }
    const held = seq >= 0 && seq === this.sent;
    this.sent = seq;
    this.count = count;
    this.uploaded = 0;
    debris = Math.min(debris, count);
    // (Where the frame's instances are, for the soft shadow map's bounds.)
    this.src = f32;
    this.srcU = u32;
    const sprites = this.srcAt = ptr + debris * P_STRIDE;
    resting = Math.min(resting, debris);
    cubes.count = debris;
    soft.count = count - debris;
    if (debris > 0 && !held) {
      const fresh = this._reserve(cubes, debris);
      if (fresh || restRev !== this.restRev || resting !== this.restCount) {
        this._send(cubes, u32, ptr, 0, resting);
        this.restRev = restRev;
        this.restCount = resting;
      }
      this._send(cubes, u32, ptr + resting * P_STRIDE, resting, debris - resting);
    }
    this.gas = false;
    this.dusty = false;
    if (soft.count === 0) this.sparks.count = this.flames.count = 0;
    if (soft.count > 0) {
      if (!held) {
        this._reserve(soft, soft.count);
        this._send(soft, u32, sprites, 0, soft.count);
        // The sparks' rows, copied out in the list's order; and, in the
        // same walk, the small flames' rows where a tier draws them: fire
        // the engine has not marked, under FLAME_FULL_SIZE across (the
        // sprites' vertex stage makes the same test, a hair tighter; a
        // row here that it throws out is drawn by the gas pass, never by
        // both and never by neither).
        let rows = this._sparkRows, n = 0, lit = this._flameRows, m = 0;
        for (let i = 0, o = sprites; i < soft.count; i++, o += P_SPRITE_STRIDE) {
          const kind = u32[o + 4] >>> 24;
          if (kind === KIND_SPARK) {
            if ((n + 1) * P_SPRITE_STRIDE > rows.length) { const more = new Uint32Array(rows.length * 2); more.set(rows); rows = this._sparkRows = more; }
            for (let k = 0; k < P_SPRITE_STRIDE; k++) rows[n * P_SPRITE_STRIDE + k] = u32[o + k];
            n++;
          } else if (flamesOn && kind === KIND_FIRE && f32[o + 5] < 0.5 && f32[o + 3] < FLAME_FULL_SIZE) {
            if ((m + 1) * P_SPRITE_STRIDE > lit.length) { const more = new Uint32Array(lit.length * 2); more.set(lit); lit = this._flameRows = more; }
            for (let k = 0; k < P_SPRITE_STRIDE; k++) lit[m * P_SPRITE_STRIDE + k] = u32[o + k];
            m++;
          }
        }
        this.sparks.count = n;
        if (n > 0) {
          this._reserve(this.sparks, n);
          this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, rows, 0, n * P_SPRITE_STRIDE);
        }
        this.flames.count = m;
        if (m > 0) {
          this._reserve(this.flames, m);
          this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, lit, 0, m * P_SPRITE_STRIDE);
        }
      }
      // Gas, if there is any, is found at once; a list of sparks alone is short.
      // (The kind is the fourth byte of a sprite's colour.)
      for (let i = 0; i < soft.count; i++) {
        if (u32[sprites + i * P_SPRITE_STRIDE + 4] >>> 24 !== KIND_SPARK) { this.gas = true; break; }
      }
      // Dust and smoke (kinds 1 and 2), likewise found at once where there
      // is any; a list of fire and sparks alone is short.
      this.dusty = false;
      if (this.gas) {
        for (let i = 0; i < soft.count; i++) {
          const k = u32[sprites + i * P_SPRITE_STRIDE + 4] >>> 24;
          if (k === 1 || k === 2) { this.dusty = true; break; }
        }
      }
    }
    // How coarse the gas layer has to be this frame: the finest step whose
    // budget this frame's gas fits, from this frame's gas alone. (It kept
    // the step of the frame before and went finer only with room to
    // spare, so as not to flip back and forth: two pages shown one stopped
    // world then drew its cloud at 4 and at 8, each by where it had come
    // from.)
    const P = this.P;
    this.fill = this.gas ? this._fill(u32, f32, sprites, soft.count, frame) : 0;
    this.flameFill = this._flameFill(frame);
    const most = P.gasCoarsest;
    let step = P.gasRes;
    const budget = P.gasFill * this.thin;
    while (step < most && this.fill > budget * step * step) step *= 2;
    this.step = step;
  }

  // Opaque debris, into the scene target with depth.
  drawCubes() {
    const set = this.sets[0];
    if (set.count === 0) return 0;
    const gl = this.gl, st = this.state;
    st.depth(true, true, gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    st.vao(set.vao);
    st.program(this.P.cubes);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 18, set.count);
    return 1;
  }

  // Soft sprites over the finished opaque scene. post: the Post chain (its
  // colour-only view of the scene target is drawn to while the scene depth
  // is sampled); plain: an attribute-less vertex array for the upsample.
  // Returns the draws issued.
  drawSoft(post, plain) {
    const set = this.sets[1];
    if (set.count === 0) return 0;
    const gl = this.gl, st = this.state, P = this.P;
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
    st.blend(BLEND.PREMUL);
    const step = this.step;
    if (step === 1) {
      st.fbo(post.sceneColor);
      st.vao(set.vao);
      st.program(P.soft);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, set.count);
      return 1;
    }
    let draws = 0;
    const lw = Math.ceil(post.w / step), lh = Math.ceil(post.h / step);
    if (this.gas) {
      st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
      st.tex(UNIT.uTex2, gl.TEXTURE_2D, null);
      st.fbo(this.layer);
      st.viewport(0, 0, lw, lh);
      st.scissor(true, 0, 0, lw, lh);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      st.scissor(false);
      st.vao(set.vao);
      gl.uniform1i(st.program(P.gas).uStep, step);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, set.count);
      draws++;
    }
    // Sparks go in before the gas layer is laid over them, so smoke hides
    // the ones inside it. (From their own rows, where there are any: the
    // same sparks in the same order as the whole list would give.)
    st.fbo(post.sceneColor);
    if (!this.sparksApart) {
      st.vao(set.vao);
      st.program(P.sparks);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, set.count);
      draws++;
    } else if (this.sparks.count > 0) {
      st.vao(this.sparks.vao);
      st.program(P.sparks);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.sparks.count);
      draws++;
    }
    if (this.gas) {
      st.vao(plain);
      gl.uniform4i(st.program(P.up).uLayer, step, lw, lh, 0);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, this.layer.tex);
      st.tex(UNIT.uTex2, gl.TEXTURE_2D, this.mark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      draws++;
    }
    // Small flames, at the scene's own size and over the gas (in the
    // layer they were all but undimmed by it as well), from their own
    // rows.
    if (P.flames && this.flames.count > 0) {
      st.vao(this.flames.vao);
      st.program(P.flames);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.flames.count);
      draws++;
    }
    return draws;
  }
}

const SOFT_RES = 512;
const SOFT_TEXEL = 0.08;                  // metres per texel
const SOFT_SIZE = SOFT_RES * SOFT_TEXEL;  // 41 m square, centred on the camera
const SOFT_DEPTH = 64;                    // metres along the light the depths span
const SOFT_GAS_RES = 128;                 // dust is drawn at a quarter of that

// Sun shadows of what the shadow atlas does not hold: debris cubes and the
// dust and smoke of a collapse (the layout of the map is described with its
// shaders). One instanced draw of each from the sun, on frames that have
// any, and one tap in the surface shader. It needs a half-float target:
// depth over 64 m does not fit in eight bits.
//
// What a frame pays for it: debris, when a piece moved, appeared or went (or
// the camera crossed a texel): the map's two debris channels cleared and one
// small quad per piece. Dust, every second frame while there is any: its
// sprites into a 128 x 128 target, and that target laid into the map's
// other two channels over the rectangle the cloud covers, no further.
export class SoftShadow {
  constructor(gl, state, float16) {
    this.gl = gl;
    this.state = state;
    this.ok = !!float16;
    this.enabled = true;   // the tier wants it
    this.live = false;     // surfaces read the map this frame
    this.cubes = false;
    this.gas = false;
    this.dirty = false;    // the debris in the map must be redrawn this frame
    this.dustDirty = false; // and so must the dust, whatever the frame
    this.work = { debris: 0, dust: 0, mergePx: 0 }; // what the last render() did: draws of each, texels merged
    this._phase = false;
    this._rect = new Int32Array(4);  // the map texels that hold dust (x0, y0, x1, y1)
    this._next = new Int32Array(4);
    this._placed = new Float32Array(12);
    this._hadCubes = false;
    this._hadGas = false;
    this.programs = [];
    this.map = this.dust = null;
    if (!this.ok) return;
    state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
    this.map = makeTarget(gl, SOFT_RES, SOFT_RES, gl.RGBA16F, gl.LINEAR);
    this.dust = makeTarget(gl, SOFT_GAS_RES, SOFT_GAS_RES, gl.RG16F, gl.LINEAR);
    state.units[state.unit] = null;
    state.target = undefined;
    this.pDebris = describeProgram(SOFT_DEBRIS_VS, SOFT_DEBRIS_FS, '', 'soft shadow debris');
    this.pGas = describeProgram(SOFT_GAS_VS, SOFT_GAS_FS, '', 'soft shadow dust');
    this.pMerge = describeProgram(FULLSCREEN_VS, SOFT_MERGE_FS, '', 'soft shadow merge');
    this.programs = [this.pDebris, this.pGas, this.pMerge];
  }

  get tex() { return this.map ? this.map.tex : null; }

  // Places the map for this frame and writes the placement into the frame
  // block. cam: camera position; light: unit vector toward the sun or moon;
  // lit: it casts; cubes: debris instances this frame; changed: one of them
  // moved, appeared or went since the last frame. Whether there is dust is
  // only known once the frame's instances are uploaded (setDust()); until
  // then last frame's answer stands, and the frame block has gone to the
  // GPU by then, so a cloud's shadow appears a frame after its first puff.
  update(frame, cam, light, lit, cubes, changed) {
    const d = frame.data, o = F.SOFT;
    this.cubes = cubes > 0;
    const was = this.live;
    this.live = this.ok && this.enabled && lit && (this.cubes || this.gas);
    if (!this.live) {
      for (let i = 0; i < 12; i++) d[o + i] = 0;
      return;
    }
    const lx = light[0], ly = light[1], lz = light[2];
    // Light-space axes: right and up across the map, the light itself in depth.
    let rx = lz, ry = 0, rz = -lx;
    let rl = Math.hypot(rx, rz);
    if (rl < 1e-3) { rx = 1; rz = 0; rl = 1; }
    rx /= rl; rz /= rl;
    const ux = ly * rz - lz * ry, uy = lz * rx - lx * rz, uz = lx * ry - ly * rx;
    // Snapped to whole texels so shadows do not crawl as the camera moves.
    const ou = Math.round((rx * cam[0] + ry * cam[1] + rz * cam[2] - SOFT_SIZE * 0.5) / SOFT_TEXEL) * SOFT_TEXEL;
    const ov = Math.round((ux * cam[0] + uy * cam[1] + uz * cam[2] - SOFT_SIZE * 0.5) / SOFT_TEXEL) * SOFT_TEXEL;
    const top = lx * cam[0] + ly * cam[1] + lz * cam[2] + SOFT_DEPTH * 0.5;
    const k = 1 / SOFT_SIZE, kd = 1 / SOFT_DEPTH;
    d[o] = rx * k; d[o + 1] = ry * k; d[o + 2] = rz * k; d[o + 3] = -ou * k;
    d[o + 4] = ux * k; d[o + 5] = uy * k; d[o + 6] = uz * k; d[o + 7] = -ov * k;
    // Depth follows the camera in whole metres: the map then stays as it
    // is while the camera moves within a texel and nothing else changes.
    const topSnapped = Math.round(top);
    d[o + 8] = -lx * kd; d[o + 9] = -ly * kd; d[o + 10] = -lz * kd; d[o + 11] = topSnapped * kd;
    // Resting debris under a still camera: the map already holds it. (Dust
    // drifts every frame.)
    let moved = false;
    const p = this._placed;
    for (let i = 0; i < 12; i++) {
      if (p[i] !== d[o + i]) { moved = true; p[i] = d[o + i]; }
    }
    this.dirty = !was || moved || changed || this.cubes !== this._hadCubes;
    // The dust that was there last frame has gone, or the map is new: not a
    // frame to leave its channels as they are.
    this.dustDirty = !was || (this._hadGas && !this.gas);
    this._hadCubes = this.cubes;
    this._hadGas = this.gas;
  }

  // Whether this frame's sprites hold dust or smoke (from the particle
  // pass, after its upload).
  setDust(any) {
    if (any && !this.gas) this.dustDirty = true;
    this.gas = any;
  }

  // The map texels this frame's dust and smoke cover, into r (x0, y0, x1,
  // y1; empty when x1 <= x0), from every eighth sprite and a margin for
  // the ones between. pass: the particle pass, uploaded.
  _dustRect(pass, r) {
    const f = pass.src, words = pass.srcU, p = this._placed, n = pass.sets[1].count;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, big = 0;
    for (let i = pass.srcAt, end = i + n * P_SPRITE_STRIDE; i < end; i += 8 * P_SPRITE_STRIDE) {
      const kind = words[i + 4] >>> 24;
      if (kind < 1 || kind > 2 || f[i + 7] > 0) continue;
      const x = f[i], y = f[i + 1], z = f[i + 2], size = f[i + 3];
      const u = p[0] * x + p[1] * y + p[2] * z + p[3], v = p[4] * x + p[5] * y + p[6] * z + p[7];
      if (u < x0) x0 = u;
      if (u > x1) x1 = u;
      if (v < y0) y0 = v;
      if (v > y1) y1 = v;
      if (size > big) big = size;
    }
    // Half the largest puff, two and a half metres for the puffs not looked
    // at and for the fade at the rectangle's edge (16 texels of the map),
    // and the width of the coarse target's filter.
    const m = (big * 0.5 + 2.5) / SOFT_SIZE + 1.5 / SOFT_GAS_RES;
    r[0] = Math.max(Math.floor((x0 - m) * SOFT_RES), 0);
    r[1] = Math.max(Math.floor((y0 - m) * SOFT_RES), 0);
    r[2] = Math.min(Math.ceil((x1 + m) * SOFT_RES), SOFT_RES);
    r[3] = Math.min(Math.ceil((y1 + m) * SOFT_RES), SOFT_RES);
  }

  // Draws what of the map is due. pass: the particle pass, its instances
  // uploaded for this frame; plain: an attribute-less vertex array. Returns
  // the draws issued.
  render(pass, plain) {
    const work = this.work;
    work.debris = work.dust = work.mergePx = 0;
    if (!this.live) return 0;
    // Dust drifts: its shadow is redrawn every second frame, and a soft
    // shadow a frame old is not seen to be.
    this._phase = !this._phase;
    const dust = this.dustDirty || (this.gas && this._phase);
    if (!this.dirty && !dust) return 0;
    const gl = this.gl, st = this.state, sets = pass.sets;
    let draws = 0;
    st.tex(UNIT.uSoft, gl.TEXTURE_2D, null);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    if (dust && this.gas) {
      st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
      st.fbo(this.dust);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      st.blend(BLEND.ADD);
      st.vao(sets[1].vao);
      st.program(this.pGas);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, sets[1].count);
      draws++;
      work.dust = 1;
    }
    st.fbo(this.map);
    st.blend(BLEND.OFF);
    if (this.dirty) {
      // Debris: red and green. The piece nearest the light wins, and so
      // does the least margin.
      gl.colorMask(true, true, false, false);
      gl.clearColor(1, 1, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (this.cubes) {
        st.blend(BLEND.MIN);
        st.vao(sets[0].vao);
        st.program(this.pDebris);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, sets[0].count);
        draws++;
        work.debris = 1;
        st.blend(BLEND.OFF);
      }
    }
    if (dust) {
      // Dust: blue and alpha, over the texels the cloud covered and covers.
      const was = this._rect, now = this._next;
      if (this.gas) this._dustRect(pass, now); else now.fill(0);
      gl.colorMask(false, false, true, true);
      gl.clearColor(0, 0, 0, 0);
      if (this.dustDirty) {
        gl.clear(gl.COLOR_BUFFER_BIT);
      } else if (was[2] > was[0] && was[3] > was[1]) {
        st.scissor(true, was[0], was[1], was[2] - was[0], was[3] - was[1]);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      if (now[2] > now[0] && now[3] > now[1]) {
        st.scissor(true, now[0], now[1], now[2] - now[0], now[3] - now[1]);
        st.vao(plain);
        gl.uniform4f(st.program(this.pMerge).uRect, now[0], now[1], now[2], now[3]);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, this.dust.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        draws++;
        work.mergePx = (now[2] - now[0]) * (now[3] - now[1]);
      }
      st.scissor(false);
      was.set(now);
      this.dustDirty = false;
    }
    gl.colorMask(true, true, true, true);
    return draws;
  }
}

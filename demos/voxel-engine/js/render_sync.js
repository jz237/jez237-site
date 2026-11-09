// Mirrors the sim's buffers into GPU textures, uploading only what changed:
// quad rows the frame's runs name, transform rows whose bodies moved, and
// the edited boxes of the AO density volume.
import { OUT, QUAD_TEX_W, XF_STRIDE } from './engine.js';
import { makeTexture, UNIT } from './render_gl.js';
import { QuadLists } from './render_geom.js';
import { quadLuts } from './quad_luts.js';

const XF_TEX_W = 1024; // 256 bodies per row, 4 texels each
const XF_ROWS = 32;

export class Sync {
  // pristine: the world's solid mask as the scene was built (sim.solidBits).
  constructor(gl, state, sim, pristine) {
    this.gl = gl;
    this.state = state;
    this.sim = sim;
    this.solidTex = null;
    this._uploadSolid(pristine);
    this.quadTex = null;
    this.quadRows = 0;
    // A framebuffer to read the quad texture through when it has to grow,
    // if this GPU lets an RG32UI texture be read that way (asked once,
    // here: the answer is a round trip to the GPU process).
    this.quadCopy = gl.createFramebuffer();
    const probe = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32UI, 4, 4);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.quadCopy);
    gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, probe, 0);
    if (gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) this.quadCopy = null;
    gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    gl.deleteTexture(probe);
    this.xfTex = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, XF_TEX_W, XF_ROWS);
    // Last uploaded transforms, to detect which bodies moved.
    this.xfPrev = new Float32Array(XF_TEX_W * XF_ROWS * 4);
    this.xfPrev16 = new Uint16Array(this.xfPrev.buffer);
    this._u16 = null;
    this.occTex = null;
    this.occDims = [0, 0, 0];
    this.geometryChanged = false;
    this.bodiesMoved = 0;
    this.bodies = 0;                   // transforms known this frame (XF_COUNT)
    this._movedAt = new Uint32Array(XF_TEX_W * XF_ROWS / 4);
    this._frame = 1;

    // Palette: row 0 = sRGB colour + variation, row 1 = roughness, emissive,
    // pattern, flags. Also a bitmask of transparent materials for the vertex
    // stage, which decides pass ownership without a texture fetch.
    const pal = sim.palette();
    const px = new Uint8Array(256 * 2 * 4);
    this.transMask = new Uint32Array(8);
    for (let i = 0; i < 256; i++) {
      px.set(pal.subarray(i * 8, i * 8 + 4), i * 4);
      px.set(pal.subarray(i * 8 + 4, i * 8 + 8), (256 + i) * 4);
      if (pal[i * 8 + 7] & 2) this.transMask[i >> 5] |= 1 << (i & 31);
    }
    this.paletteTex = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
    // The same eight bytes per material in one texel, for the quad vertex
    // stage: one fetch per vertex there and none per pixel.
    const packed = new Uint32Array(256 * 2);
    for (let i = 0; i < 256; i++) {
      packed[i * 2] = pal[i * 8] | pal[i * 8 + 1] << 8 | pal[i * 8 + 2] << 16 | pal[i * 8 + 3] << 24;
      packed[i * 2 + 1] = pal[i * 8 + 4] | pal[i * 8 + 5] << 8 | pal[i * 8 + 6] << 16 | pal[i * 8 + 7] << 24;
    }
    this.palettePacked = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32UI, 256, 1, 0, gl.RG_INTEGER, gl.UNSIGNED_INT, packed);
    this.noiseTex = makeNoise(gl);

    const [transLut, emitLut, heapLut] = quadLuts(pal);
    this.lists = new QuadLists(gl, state, transLut, emitLut, heapLut);
    // Lists that only keep the books (no context): what the sim's worker
    // runs over the rows it sends, so that the page need not read a quad
    // (QuadLists.writeDelta / apply). Made here only to try that path on
    // the page's own thread (`useIndex`, ?selfindex=1): the lists then take
    // every frame through a delta, as they do from a worker.
    this._luts = [transLut, emitLut, heapLut];
    this.index = null;
    this._delta = new Uint32Array(4096);
    // Deltas taken since the last update() (taken(): as packets come in,
    // before any draw), and the spans of the quad texture they changed:
    // row, first slot, slots, three values each, uploaded by update().
    this._taken = 0;
    // Rows of the texture that hold what a full frame's delta did not name
    // (one past the highest): the rows the lists had when it emptied them.
    this._stale = 0;
    this._hooked = false;
    this._ahead = null;
    this._spans = new Int32Array(3 * 256);
    this._spanN = 0;
    this._noteSpan = (row, slot, slots) => {
      const n = this._spanN;
      if (n * 3 === this._spans.length) {
        const more = new Int32Array(n * 6);
        more.set(this._spans);
        this._spans = more;
      }
      this._spans[n * 3] = row; this._spans[n * 3 + 1] = slot; this._spans[n * 3 + 2] = slots;
      this._spanN = n + 1;
    };
    // (The lists cull body quads by where their bodies are: the transforms
    // as the texture holds them, which this record is after every update.)
    this.lists.xf = this.xfPrev;
    this.quadBytes = 0; // bytes of quad data uploaded by the last update()
    // (Out of the lists' mirror, which by then holds the row as the frame
    // has it: a frame only has the rows of its runs, wherever it keeps them.)
    this._uploadSpan = (row, slot, slots) => {
      this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, slot, row, slots, 1, this.gl.RG_INTEGER, this.gl.UNSIGNED_INT, this.lists.mirror, (row * QUAD_TEX_W + slot) * 2);
      this.quadBytes += slots * 8;
    };
    // Linear colour times emissive strength per material, for lamp lights.
    this.emission = new Float32Array(256 * 3);
    for (let i = 0; i < 256; i++) {
      for (let c = 0; c < 3; c++) this.emission[i * 3 + c] = Math.pow(pal[i * 8 + c] / 255, 2.2) * pal[i * 8 + 5] / 255;
    }
    state.reset();
  }

  // The solid mask as a texture, GL axes (x byte, z, y), for the surface shader.
  _uploadSolid(pristine) {
    const gl = this.gl;
    if (this.solidTex) gl.deleteTexture(this.solidTex);
    this.state.texForUpload(UNIT.uSolid0, gl.TEXTURE_3D, null);
    this.solidTex = makeTexture(gl, gl.TEXTURE_3D, gl.NEAREST, gl.CLAMP_TO_EDGE);
    this.state.units[UNIT.uSolid0] = this.solidTex;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8UI, (pristine.sx + 7) >> 3, pristine.sz, pristine.sy, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, pristine.bits);
  }

  // The engine holds a new world: forget what was mirrored of the old one.
  // From now on the lists are kept through deltas made on this thread.
  useIndex() {
    if (!this.index) this.index = new QuadLists(null, null, ...this._luts);
  }

  // A frame has come in whose packet says what its rows changed in the
  // lists (frame.indexWords words at frame.indexAt of frame.u32: the sim's
  // worker made them, QuadLists.writeDelta): the lists take it now, and
  // the texture gets the changed spans at the next update(). To be called
  // for every such frame in the order they come, drawn or not (Renderer.
  // taken): a delta says what changed since the one before it. A full
  // frame's delta is made from nothing (the worker's lists were emptied
  // for it), and so these are emptied for it too.
  taken(frame) {
    if (!(frame.indexWords > 0)) return;
    this._hooked = true;
    this._applyDelta(frame.u32, frame.indexAt, frame, frame.full);
  }

  // For a tool whose sim runs on the page's thread and which wants the
  // renderer as a played page has it, where the sim's worker has read the
  // quad rows: the frame's delta is made here and taken, as taken() takes
  // a packet's. Call it with each frame the sim prepares, before it is
  // drawn; what it costs is the worker's on a played page, not render()'s.
  ahead(frame) {
    if (!this._ahead) this._ahead = new QuadLists(null, null, ...this._luts);
    const idx = this._ahead;
    idx.update(frame, frame.out[OUT.QUAD_ROWS], null);
    const n = idx.deltaWords();
    if (n > this._delta.length) this._delta = new Uint32Array(n * 2);
    idx.writeDelta(this._delta, 0);
    this._hooked = true;
    this._applyDelta(this._delta, 0, frame, false);
  }

  _applyDelta(d, at, frame, full) {
    if (full) {
      // (What the texture holds of the rows so far is not in this delta:
      // update() sends it every one of them again.)
      if (this.quadTex) this._stale = Math.max(this._stale, this.lists.top);
      this.lists.reset();
      this._spanN = 0;
    }
    this.lists.apply(d, at, frame, this._noteSpan, null, this._taken > 0);
    this._taken++;
  }

  reset(pristine) {
    const gl = this.gl;
    this._uploadSolid(pristine);
    if (this.quadTex) gl.deleteTexture(this.quadTex);
    if (this.occTex) gl.deleteTexture(this.occTex);
    this.quadTex = this.occTex = null;
    this.quadRows = 0;
    this.xfPrev.fill(0);
    this.lists.reset();
    if (this.index) this.index.reset();
    if (this._ahead) this._ahead.reset();
    this._taken = this._spanN = this._stale = 0;
    // (A delta taken as its packet came, taken(), went with the lists just
    // emptied: the frame at hand is read again at its draw, as by a
    // renderer that has been told nothing yet.)
    this._hooked = false;
    this.state.reset();
  }

  // The frame to mirror from, or null while the sim still owes the full one
  // that a mirror starting from nothing needs (the first frame, a reset, a
  // new GL context): every quad row then, not only what changed last.
  source() {
    const frame = this.sim.frame;
    return this.quadTex || frame.full ? frame : this.sim.resync();
  }

  // frame: what source() returned; out: its out block.
  // onBodyMoved(id, oldX, oldY, oldZ, x, y, z, radius, far) is called once
  // for each body whose transform or whose quads changed: the centres of
  // the sphere that held it before and of the one that holds it now, the
  // larger of their radii, and a bound on how far any point of it has
  // moved (metres; Infinity when its quads changed or it was nowhere
  // before, in which case oldX is NaN; a body that is gone is reported
  // where it last was);
  // onOccDirty(x0, y0, z0, x1, y1, z1) for each edited density box (texels,
  // max exclusive).
  update(frame, out, onBodyMoved, onOccDirty) {
    const gl = this.gl, st = this.state;
    const u32 = frame.u32, f32 = frame.f32;

    // Quads: mirror dirty texture rows, then refresh the draw lists over them.
    const rows = out[OUT.QUAD_ROWS];
    const first = !this.quadTex;
    this.quadBytes = 0;
    const realloc = rows > this.quadRows || first;
    // Rows of the old texture that hold anything, when it can be carried
    // over on the GPU.
    const kept = realloc && !first && this.quadCopy ? Math.min(this.lists.top, this.quadRows) : -1;
    if (realloc) {
      // Texture storage is immutable: allocate with room for the rows that
      // destruction will add. A collapse outgrows that all the same, and
      // then the rows in use are copied across on the GPU (a new texture
      // reads zero, as unused rows do) and only what changed this frame is
      // uploaded: sent again in full they were 3 to 5 MB in that frame.
      const old = this.quadTex;
      st.texForUpload(UNIT.uQuads, gl.TEXTURE_2D, null);
      this.quadTex = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
      st.units[UNIT.uQuads] = this.quadTex;
      this.quadRows = Math.max(rows * 2 + 32, 64);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32UI, QUAD_TEX_W, this.quadRows);
      if (kept > 0) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.quadCopy);
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, old, 0);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, QUAD_TEX_W, kept);
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        st.target = undefined;
      }
      if (old) gl.deleteTexture(old);
    } else if (frame.runs > 0 || this._spanN > 0) {
      st.texForUpload(UNIT.uQuads, gl.TEXTURE_2D, this.quadTex);
    }
    // The lists find the slots that really changed in each dirty row; only
    // those go to the texture.
    const upload = realloc && kept < 0 ? null : this._uploadSpan;
    if (this.index && frame.runs > 0) {
      // (The same path on this thread: the delta made here, taken at once.)
      this.index.update(frame, rows, null);
      const n = this.index.deltaWords();
      if (n > this._delta.length) this._delta = new Uint32Array(n * 2);
      this.index.writeDelta(this._delta, 0);
      this._applyDelta(this._delta, 0, frame, false);
    } else if (frame.indexWords > 0 && !this._hooked && frame.runs > 0) {
      // The worker has read the rows, and nobody has told the lists as the
      // frames came in: this frame's account of what changed, now. (Right
      // only where every frame that comes is drawn.)
      this._applyDelta(frame.u32, frame.indexAt, frame, frame.full);
    }
    if (this.index || this._hooked || frame.indexWords > 0) {
      // The lists have been kept from deltas: what those changed goes to
      // the texture, out of the lists' mirror.
      if (this._taken === 0) this.lists.still();
      if (upload && this._stale === 0) for (let i = 0, sp = this._spans; i < this._spanN * 3; i += 3) upload(sp[i], sp[i + 1], sp[i + 2]);
      this._taken = this._spanN = 0;
    } else {
      this.lists.update(frame, rows, upload);
    }
    // A new texture that could not be filled from the old one (the first
    // frame, a reset, a GPU that will not read the format back) takes every
    // row, from the lists' mirror: the frame need not hold the rows that
    // did not change. And so does a texture that was kept while a full
    // frame's delta was taken, every row that held anything before it: such
    // a delta is made from nothing and names what holds something now, and
    // a segment emptied since the picture before is in no span of it (its
    // quads stayed in the texture, to be drawn wherever a list bridged over
    // them). Nothing in play asks for a full frame over a kept texture;
    // whoever does pays for the rows once.
    const whole = realloc && kept < 0 ? rows : this._stale > 0 ? Math.min(Math.max(this._stale, rows), this.quadRows) : 0;
    if (whole > 0) {
      st.texForUpload(UNIT.uQuads, gl.TEXTURE_2D, this.quadTex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, QUAD_TEX_W, whole, gl.RG_INTEGER, gl.UNSIGNED_INT, this.lists.mirror, 0);
      if (this._stale > 0) this.quadBytes += whole * QUAD_TEX_W * 8;
    }
    this._stale = 0;
    // Once the scene is in: get the row sync and the lists optimised for
    // what destruction will throw at them. (Also where the lists are kept
    // from deltas and never read a row themselves: they build every list;
    // a third of the passes, for the lists alone.)
    if (first && frame.runs > 0) this.lists.warm(u32, frame.runWords(0), this.index || this._hooked || frame.indexWords > 0 ? 80 : 240);
    this.geometryChanged = this.lists.worldChanged || this.lists.bodiesChanged;

    // Body transforms: find the span of bodies that moved, upload those rows.
    const bodies = Math.min(out[OUT.XF_COUNT], XF_ROWS * 256);
    const xp = out[OUT.XF_PTR] >> 2;
    const prev = this.xfPrev, prev16 = this.xfPrev16, L = this.lists, sp = L.sphere;
    // Compared as 16-bit halves: small integers cost the browser nothing to
    // read, where every float read is an allocation until the loop has been
    // optimised, which a loop that only gets long during destruction is not.
    if (!this._u16 || this._u16.buffer !== f32.buffer) this._u16 = new Uint16Array(f32.buffer);
    const u16 = this._u16;
    let lo = -1, hi = -1, moved = 0;
    for (let id = 1; id < bodies; id++) {
      const s = xp + id * XF_STRIDE, o = id * XF_STRIDE;
      let same = true;
      for (let k = 0, a = s * 2, b = o * 2; k < 24; k++) {
        if (u16[a + k] !== prev16[b + k]) { same = false; break; }
      }
      if (same) continue;
      // Where the body was and where it is now, as the spheres the lists
      // keep. A slot that never held a transform has no "was".
      const had = !(prev[o + 3] === 0 && prev[o] === 0), k4 = id * 4;
      const wasX = had ? sp[k4] : NaN, wasY = sp[k4 + 1], wasZ = sp[k4 + 2], wasR = sp[k4 + 3];
      // How far it turned: the angle is about twice the change of the
      // quaternion (taken with the sign that makes it small).
      const d0 = f32[s] - prev[o], d1 = f32[s + 1] - prev[o + 1], d2 = f32[s + 2] - prev[o + 2], d3 = f32[s + 3] - prev[o + 3];
      const e0 = f32[s] + prev[o], e1 = f32[s + 1] + prev[o + 1], e2 = f32[s + 2] + prev[o + 2], e3 = f32[s + 3] + prev[o + 3];
      const turn = 2 * Math.sqrt(Math.min(d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3, e0 * e0 + e1 * e1 + e2 * e2 + e3 * e3));
      for (let k = 0; k < 12; k++) prev[o + k] = f32[s + k];
      L.place(id);
      const r = Math.max(wasR, sp[k4 + 3]);
      // (Its quads changed as well: it is not the same shape that moved.)
      const far = had && L._touchedAt[id] !== L._update ? Math.hypot(sp[k4] - wasX, sp[k4 + 1] - wasY, sp[k4 + 2] - wasZ) + turn * r : Infinity;
      onBodyMoved(id, wasX, wasY, wasZ, sp[k4], sp[k4 + 1], sp[k4 + 2], r, far);
      this._movedAt[id] = this._frame;
      if (lo < 0) lo = id;
      hi = id;
      moved++;
    }
    this.bodiesMoved = moved;
    this.bodies = bodies;
    // Bodies whose quads changed where they stand (cut, remeshed, gone):
    // they may reach further now.
    for (let i = 0; i < L.touchedCount; i++) {
      const id = L.touched[i], k4 = id * 4;
      if (this._movedAt[id] === this._frame) continue;
      const wasX = sp[k4], wasY = sp[k4 + 1], wasZ = sp[k4 + 2], wasR = sp[k4 + 3];
      L.place(id);
      onBodyMoved(id, wasR > 0 ? wasX : NaN, wasY, wasZ, sp[k4], sp[k4 + 1], sp[k4 + 2], Math.max(wasR, sp[k4 + 3]), Infinity);
    }
    this._frame++;
    if (hi >= 0) {
      const r0 = lo >> 8, r1 = hi >> 8;
      st.texForUpload(UNIT.uXf, gl.TEXTURE_2D, this.xfTex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, r0, XF_TEX_W, r1 - r0 + 1, gl.RGBA, gl.FLOAT, f32, xp + r0 * XF_TEX_W * 4);
    }

    // AO density volume. Engine layout is x + sx * (z + sz * y), so GL width
    // = x, height = z, depth = y.
    const ox = out[OUT.OCC_SX], oy = out[OUT.OCC_SY], oz = out[OUT.OCC_SZ];
    const occ = frame.occ, occPtr = frame.occAt;
    let boxes = out[OUT.OCC_DIRTY_LEN];
    const bp = out[OUT.OCC_DIRTY_PTR] >> 2;
    if (!this.occTex || ox !== this.occDims[0] || oy !== this.occDims[1] || oz !== this.occDims[2]) {
      if (this.occTex) gl.deleteTexture(this.occTex);
      st.texForUpload(UNIT.uOcc, gl.TEXTURE_3D, null);
      this.occTex = makeTexture(gl, gl.TEXTURE_3D, gl.LINEAR, gl.CLAMP_TO_EDGE);
      st.units[UNIT.uOcc] = this.occTex;
      gl.texStorage3D(gl.TEXTURE_3D, 1, gl.R8, ox, oz, oy);
      this.occDims = [ox, oy, oz];
      gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, ox, oz, oy, gl.RED, gl.UNSIGNED_BYTE, occ, occPtr);
      onOccDirty(0, 0, 0, ox, oy, oz);
      boxes = 0;
    }
    if (boxes > 0) {
      st.texForUpload(UNIT.uOcc, gl.TEXTURE_3D, this.occTex);
      gl.pixelStorei(gl.UNPACK_ROW_LENGTH, ox);
      gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, oz);
      for (let i = 0; i < boxes; i++) {
        const x0 = u32[bp + i * 6], y0 = u32[bp + i * 6 + 1], z0 = u32[bp + i * 6 + 2];
        const x1 = u32[bp + i * 6 + 3], y1 = u32[bp + i * 6 + 4], z1 = u32[bp + i * 6 + 5];
        if (x1 <= x0 || y1 <= y0 || z1 <= z0) continue;
        // Many edits in one place report the same texels again and again.
        let covered = false;
        for (let j = 0; j < i && !covered; j++) {
          const q = bp + j * 6;
          covered = u32[q] <= x0 && u32[q + 1] <= y0 && u32[q + 2] <= z0 && u32[q + 3] >= x1 && u32[q + 4] >= y1 && u32[q + 5] >= z1;
        }
        if (covered) continue;
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, x0);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS, z0);
        gl.texSubImage3D(gl.TEXTURE_3D, 0, x0, z0, y0, x1 - x0, z1 - z0, y1 - y0, gl.RED, gl.UNSIGNED_BYTE, occ, occPtr + y0 * ox * oz);
        onOccDirty(x0, y0, z0, x1, y1, z1);
      }
      gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
      gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
      gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
      gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    }
  }
}

// Tiling 128^2 noise: r and g are smooth multi-octave value noise (blotches,
// grain, clouds), b and a are white noise (speckle). Mipmapped so detail
// built from it fades instead of aliasing.
function makeNoise(gl) {
  const N = 128;
  const px = new Uint8Array(N * N * 4);
  let seed = 0x9e3779b9;
  const rnd = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  for (let ch = 0; ch < 2; ch++) {
    const acc = new Float32Array(N * N);
    let amp = 1, total = 0;
    for (let cells = 4; cells <= 64; cells *= 2) {
      const lat = new Float32Array(cells * cells);
      for (let i = 0; i < lat.length; i++) lat[i] = rnd();
      const step = N / cells;
      for (let y = 0; y < N; y++) {
        const fy = y / step, y0 = Math.floor(fy), ty = fy - y0, sy = ty * ty * (3 - 2 * ty);
        for (let x = 0; x < N; x++) {
          const fx = x / step, x0 = Math.floor(fx), tx = fx - x0, sx = tx * tx * (3 - 2 * tx);
          const a = lat[x0 % cells + cells * (y0 % cells)], b = lat[(x0 + 1) % cells + cells * (y0 % cells)];
          const c = lat[x0 % cells + cells * ((y0 + 1) % cells)], d = lat[(x0 + 1) % cells + cells * ((y0 + 1) % cells)];
          acc[x + y * N] += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
        }
      }
      total += amp;
      amp *= 0.55;
    }
    // Stretch contrast so the noise spans most of [0, 1].
    for (let i = 0; i < N * N; i++) {
      const v = (acc[i] / total - 0.5) * 2.4 + 0.5;
      px[i * 4 + ch] = Math.max(0, Math.min(255, Math.round(v * 255)));
    }
  }
  for (let i = 0; i < N * N; i++) {
    px[i * 4 + 2] = Math.floor(rnd() * 256);
    px[i * 4 + 3] = Math.floor(rnd() * 256);
  }
  const t = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.generateMipmap(gl.TEXTURE_2D);
  return t;
}

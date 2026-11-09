// What a blast leaves on what is still standing: soot. The engine keeps a
// short list of marks (Engine.scorchMarks: where each blast was and how far
// its burn reaches); nothing of it is in the voxels. Here the marks are
// written into a coarse volume of the world, once each, and stay there for
// the session; the volume is laid as a decal over the world, its bodies and
// the fine faces of its breaks as soon as they are drawn: a box around each
// part of the world that holds any soot, and under it every pixel whose
// surface lies inside the box is darkened by what the volume says there,
// with a ragged edge from the noise texture, if it lies where the scene
// was solid when it was built: a piece that has come to rest on a burnt
// spot since is clean. What is drawn afterwards takes none either: the
// heaps (laid since), debris, glass, dust and fire.
//
// What it costs: nothing until something has blown up, then one draw; per
// pixel under a box, the scene depth once for each box over it, and in the
// box the surface is in one lookup of the volume and, where there is soot,
// one of the as-built mask, one of the density volume, one of the noise
// and, where the soot shows, one of the sky-visibility volume.
import { BLEND, CULL, UNIT, makeTexture } from './render_gl.js';
import { SCORCH_VS, SCORCH_FS } from './render_shaders_scorch.js';

// The volume's texture unit (20 is the fine quads', 21 the stone texture's).
const UNIT_SCORCH = 22;
const TILE = 16;        // cells along x and z of one box
const POLL_FRAMES = 12; // frames between questions to the sim
const MAX_CELLS = 4e6;
// Cells of the volume looked at in one frame of play while marks are being
// written. The loop that writes them is first run in the frame of the
// first explosion, unoptimised, at some 400 ns a cell (four milliseconds
// of that frame when it took a dozen marks at once); once the browser has
// optimised it, at 20. So very little in the first frames it ever runs,
// little until it is optimised, then more: a rocket's mark is in within a
// frame or two, the largest blast's is there half a second on, behind
// its fire.
const CELLS_FIRST = 300, CELLS_COLD = 1000, CELLS_WARM = 6000, COLD_AFTER = 3000, WARM_AFTER = 40000;

// The engine's reach is one blast radius past the crater, and what stood
// that close has mostly come down with it: the soot on what is left to see
// goes a little further, thinning, to this many reaches. (It was 1.4, and
// three rockets blackened a forecourt.)
const TAIL = 1.15;
// Marks of pressed earth drawn at once (the newest in the engine's list),
// and how far above and below the contact one reaches (m).
const PRESSED = 16, PRESSED_DEEP = 0.6;

// How much soot a blast leaves at d (distance over the engine's reach): all
// of it out to half the reach, none at TAIL reaches.
function profile(d) {
  const t = Math.min(Math.max((TAIL - d) / (TAIL - 0.5), 0), 1);
  return t * t * (3 - 2 * t);
}

export class Scorch {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.any = false;       // there is soot to draw
    // Where heavy things came down: rows of the engine's list with a
    // negative reach (pressed earth of that radius). Not written into the
    // volume and not kept: the ones in the list now are the ones drawn, so
    // a renderer that begins late draws what one that saw the landing does.
    this.pressed = 0;
    this.tex = null;
    this.cell = 0.5;        // metres
    this.dims = [0, 0, 0];  // cells
    this.cells = null;      // the volume, as uploaded
    this.seen = 0;          // the engine's count of marks made, as last taken
    this.marks = 0;         // marks written
    this.boxes = 0;
    this._tiles = null;     // per tile: lowest and highest cell with soot (y)
    this._queue = [];       // marks not yet all written: x, y, z, reach, how many z layers are in
    this._world = 0;        // answers from a world before this one are dropped
    this._asking = false;
    this._deaf = false;     // the sim has no marks to give (an older engine)
    this._written = 0;      // cells looked at since the page loaded
    this.size = [0, 0, 0];  // the world, metres
    this._since = POLL_FRAMES;
    this.vao = gl.createVertexArray();
    this.buf = gl.createBuffer();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    for (let i = 0; i < 2; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, 3, gl.FLOAT, false, 24, i * 12);
      gl.vertexAttribDivisor(i, 1);
    }
    this.pressVao = gl.createVertexArray();
    this.pressBuf = gl.createBuffer();
    gl.bindVertexArray(this.pressVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pressBuf);
    for (let i = 0; i < 2; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, 3, gl.FLOAT, false, 24, i * 12);
      gl.vertexAttribDivisor(i, 1);
    }
    gl.bufferData(gl.ARRAY_BUFFER, PRESSED * 24, gl.DYNAMIC_DRAW);
    this._press = new Float32Array(PRESSED * 6);
    gl.bindVertexArray(null);
    state.vaoObj = undefined;
  }

  static program(describe, encode) {
    return describe('scorch', SCORCH_VS, SCORCH_FS, encode ? '#define HDR_ENCODE\n' : '');
  }

  // The same program for marks of pressed earth.
  static pressedProgram(describe, encode) {
    return describe('pressed', SCORCH_VS, SCORCH_FS, '#define PRESSED\n' + (encode ? '#define HDR_ENCODE\n' : ''));
  }

  // A new world: nothing has burnt in it.
  reset() {
    this._world++;
    this.any = false;
    this.pressed = 0;
    this.seen = 0;
    this.marks = 0;
    this.boxes = 0;
    this._queue.length = 0;
    if (this.cells) this.cells.fill(0);
    if (this._tiles) this._tiles.fill(-1);
    // The texture still holds the old world's soot: given new, empty storage
    // here (no bytes go up), not cleared by an upload in the frame of the
    // next world's first blast.
    if (this.tex) this._blankTexture();
    this._since = POLL_FRAMES;
  }

  // Once a frame. sim: the simulation (sim_local.js); wx, wy, wz: the world
  // in metres; paced: frames follow one another as in play. Asks for the
  // marks a few times a second and takes the answer when it comes.
  poll(sim, wx, wy, wz, paced) {
    const size = this.size;
    size[0] = wx; size[1] = wy; size[2] = wz;
    // The volume is made in the first frame of a world, not in the frame
    // of its first explosion.
    if (!this.tex && wx > 0) this._ensure(size);
    // (A tool that draws a frame now and then is asked for every one of them.)
    if (!this._deaf && !this._asking && (++this._since >= POLL_FRAMES || !paced)) {
      this._since = 0;
      if (sim.scorchMarks) {
        // Where the engine is on this thread the answer is there at once,
        // also for a tool that steps and draws without ever yielding.
        const m = sim.scorchMarks();
        if (m) this.take(m, size); else this._deaf = true;
      } else {
        this._asking = true;
        const world = this._world;
        sim.ask('scorchMarks').then((m) => {
          this._asking = false;
          if (world === this._world && m) this.take(m, size);
        }, () => { this._asking = false; this._deaf = true; });
      }
    }
    // In play a mark is written a part a frame; a tool gets all of it now.
    if (this._queue.length) this._work(!paced ? Infinity : this._written < COLD_AFTER ? CELLS_FIRST : this._written < WARM_AFTER ? CELLS_COLD : CELLS_WARM);
  }

  // m: [count, marks made so far, then x, y, z, reach (m) of each, oldest
  // first]. Writes the ones not seen before. A negative reach is a mark
  // of pressed earth of that radius: the newest of those in the list are
  // drawn as they are, none is written.
  take(m, size = this.size) {
    const count = m[0] | 0, total = m[1] | 0;
    if (total !== this.seen) {
      const b = this._press;
      let n = 0;
      for (let i = count - 1; i >= 0 && n < PRESSED; i--) {
        const r = -m[5 + i * 4];
        if (!(r > 0)) continue;
        const x = m[2 + i * 4], y = m[3 + i * 4], z = m[4 + i * 4], o = n++ * 6;
        b[o] = x - r; b[o + 1] = y - PRESSED_DEEP; b[o + 2] = z - r;
        b[o + 3] = x + r; b[o + 4] = y + PRESSED_DEEP; b[o + 5] = z + r;
      }
      this.pressed = n;
      if (n > 0) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pressBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, b, 0, n * 6);
      }
    }
    if (total === this.seen || count <= 0) { this.seen = total; return; }
    // (A count that went backwards is another world's: reset() comes first
    // in a restart, but a replay may begin without one.)
    if (total < this.seen) this.reset();
    const fresh = Math.min(total - this.seen, count);
    this.seen = total;
    this._ensure(size);
    for (let i = count - fresh; i < count; i++) if (m[5 + i * 4] > 0) this._queue.push([m[2 + i * 4], m[3 + i * 4], m[4 + i * 4], m[5 + i * 4], 0]);
  }

  // Writes queued marks into the volume, oldest first, until `budget` cells
  // have been looked at.
  _work(budget) {
    const q = this._queue;
    while (q.length && budget > 0) {
      budget -= this._write(q[0], budget);
      if (q[0][4] === Infinity) { q.shift(); this.marks++; }
    }
    this._boxes();
  }

  _ensure(size) {
    const gl = this.gl, st = this.state;
    let cell = 0.5;
    while ((size[0] / cell) * (size[1] / cell) * (size[2] / cell) > MAX_CELLS) cell *= 2;
    const d = [0, 1, 2].map((a) => Math.max(1, Math.ceil(size[a] / cell)));
    if (this.tex && cell === this.cell && d[0] === this.dims[0] && d[1] === this.dims[1] && d[2] === this.dims[2]) return;
    if (this.tex) gl.deleteTexture(this.tex);
    this.cell = cell;
    this.dims = d;
    this.cells = new Uint8Array(d[0] * d[1] * d[2]);
    this._tx = Math.ceil(d[0] / TILE);
    this._tz = Math.ceil(d[2] / TILE);
    this._tiles = new Int16Array(this._tx * this._tz * 2).fill(-1);
    st.texForUpload(UNIT_SCORCH, gl.TEXTURE_3D, null);
    this.tex = makeTexture(gl, gl.TEXTURE_3D, gl.LINEAR, gl.CLAMP_TO_EDGE);
    st.units[UNIT_SCORCH] = this.tex;
    this._blankTexture();
  }

  // Storage of the volume's size with nothing in it (the browser clears it;
  // no array is uploaded).
  _blankTexture() {
    const gl = this.gl, d = this.dims;
    this.state.texForUpload(UNIT_SCORCH, gl.TEXTURE_3D, this.tex);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, d[0], d[1], d[2], 0, gl.RED, gl.UNSIGNED_BYTE, null);
  }

  // One blast's soot. Where blasts overlap the volume keeps the most any
  // one of them left there, not their sum: twenty rockets into one spot
  // leave it as black as the nearest of them did, not twenty times as black.
  // q: a queued mark. Its layers of z are written from the blast's own
  // outward, both ways in turn, until `budget` cells are spent; q[4] counts
  // the layers done (Infinity when the mark is all in, and only then does
  // it go to the texture). Returns the cells looked at.
  _write(q, budget) {
    const x = q[0], y = q[1], z = q[2], reach = q[3];
    const c = this.cell, nx = this.dims[0], ny = this.dims[1], nz = this.dims[2], cells = this.cells, tiles = this._tiles, tx = this._tx, far = reach * TAIL;
    const x0 = Math.min(Math.max(Math.floor((x - far) / c), 0), nx), x1 = Math.min(Math.max(Math.ceil((x + far) / c), 0), nx);
    const y0 = Math.min(Math.max(Math.floor((y - far) / c), 0), ny), y1 = Math.min(Math.max(Math.ceil((y + far) / c), 0), ny);
    const z0 = Math.min(Math.max(Math.floor((z - far) / c), 0), nz), z1 = Math.min(Math.max(Math.ceil((z + far) / c), 0), nz);
    if (!(reach > 0) || x0 >= x1 || y0 >= y1 || z0 >= z1) { q[4] = Infinity; return 1; }
    const mid = Math.min(Math.max(Math.floor(z / c), z0), z1 - 1), layers = 2 * Math.max(mid - z0, z1 - 1 - mid) + 1;
    let n = q[4], used = 0;
    for (; n < layers && used < budget; n++) {
      const k = mid + ((n & 1) ? (n + 1) >> 1 : -(n >> 1));
      if (k < z0 || k >= z1) continue;
      const dz = (k + 0.5) * c - z;
      for (let j = y0; j < y1; j++) {
        const dy = (j + 0.5) * c - y;
        // The part of this row inside the sphere.
        const r2 = far * far - dy * dy - dz * dz;
        if (r2 <= 0) continue;
        const half = Math.sqrt(r2);
        const i0 = Math.max(Math.floor((x - half) / c), x0), i1 = Math.min(Math.ceil((x + half) / c), x1);
        used += i1 - i0;
        for (let i = i0; i < i1; i++) {
          const dx = (i + 0.5) * c - x;
          const s = profile(Math.sqrt(dx * dx + dy * dy + dz * dz) / reach);
          if (s <= 0) continue;
          const at = i + nx * (j + ny * k), v = cells[at];
          const w = Math.round(s * 255);
          if (w > v) cells[at] = w;
          const t = (((i / TILE) | 0) + tx * ((k / TILE) | 0)) * 2;
          if (tiles[t] < 0 || j < tiles[t]) tiles[t] = j;
          if (j > tiles[t + 1]) tiles[t + 1] = j;
        }
      }
    }
    // Shown when it is all there, not layer by layer: a mark half written
    // is a slab of soot with a ruler's edge, and at a few frames a second
    // it stood there to be looked at.
    if (n >= layers) this._upload(x0, y0, z0, x1, y1, z1);
    q[4] = n >= layers ? Infinity : n;
    this._written += used;
    return Math.max(used, 1);
  }

  // A box of the volume to the texture, read where it lies in the array
  // (no copy is made of it here).
  _upload(x0, y0, z0, x1, y1, z1) {
    const gl = this.gl, st = this.state, [nx, ny] = this.dims;
    st.texForUpload(UNIT_SCORCH, gl.TEXTURE_3D, this.tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, nx);
    gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, ny);
    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, x0);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, y0);
    gl.pixelStorei(gl.UNPACK_SKIP_IMAGES, z0);
    gl.texSubImage3D(gl.TEXTURE_3D, 0, x0, y0, z0, x1 - x0, y1 - y0, z1 - z0, gl.RED, gl.UNSIGNED_BYTE, this.cells);
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
    gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_IMAGES, 0);
  }

  // The boxes to draw: one for each tile with soot in it, as low and as
  // high as its soot (a cell's value reaches half a cell past it).
  _boxes() {
    const gl = this.gl, c = this.cell, tiles = this._tiles, [nx, , nz] = this.dims;
    const out = [];
    for (let tz = 0; tz < this._tz; tz++) for (let tx = 0; tx < this._tx; tx++) {
      const t = (tx + this._tx * tz) * 2;
      if (tiles[t] < 0) continue;
      out.push(tx * TILE * c, (tiles[t] - 0.5) * c, tz * TILE * c,
        Math.min((tx + 1) * TILE, nx) * c, (tiles[t + 1] + 1.5) * c, Math.min((tz + 1) * TILE, nz) * c);
    }
    this.boxes = out.length / 6;
    this.any = this.boxes > 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.STATIC_DRAW);
  }

  // Over the world and its bodies, before the heaps. post: the Post chain (its
  // colour-only view of the scene is drawn to while the depth is read);
  // prog: the tier's program; noise: the noise texture; solid: the as-built
  // mask (Sync.solidTex); occ: the density volume (Sync.occTex); sky: the
  // sky-visibility volume (SkyVis.texture). The caller puts the scene target
  // and its depth state back. Returns the draws issued.
  draw(post, prog, noise, solid, occ, sky) {
    if (!this.any) return 0;
    const gl = this.gl, st = this.state;
    st.fbo(post.sceneColor);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.FRONT);
    st.blend(BLEND.MULTIPLY);
    st.scissor(false);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
    st.tex(UNIT.uNoise, gl.TEXTURE_2D, noise);
    st.tex(UNIT_SCORCH, gl.TEXTURE_3D, this.tex);
    st.tex(UNIT.uSolid0, gl.TEXTURE_3D, solid);
    st.tex(UNIT.uOcc, gl.TEXTURE_3D, occ);
    st.tex(UNIT.uSkyVis, gl.TEXTURE_3D, sky);
    st.vao(this.vao);
    const u = st.program(prog);
    gl.uniform1i(u.uScorch, UNIT_SCORCH);
    gl.uniform3f(u.uScorchInv, 1 / (this.dims[0] * this.cell), 1 / (this.dims[1] * this.cell), 1 / (this.dims[2] * this.cell));
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, this.boxes);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    return 1;
  }

  // The marks of pressed earth, over everything solid that was there as
  // built: after the far field too, whose ground lies beyond the world's
  // box (a crane's head comes down out there). prog: the tier's program
  // for them; the rest as for draw(). Returns the draws issued.
  drawPressed(post, prog, noise, solid, occ) {
    if (!this.pressed) return 0;
    const gl = this.gl, st = this.state;
    st.fbo(post.sceneColor);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.FRONT);
    st.blend(BLEND.MULTIPLY);
    st.scissor(false);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
    st.tex(UNIT.uNoise, gl.TEXTURE_2D, noise);
    st.tex(UNIT.uSolid0, gl.TEXTURE_3D, solid);
    st.tex(UNIT.uOcc, gl.TEXTURE_3D, occ);
    st.vao(this.pressVao);
    st.program(prog);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, this.pressed);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    return 1;
  }
}

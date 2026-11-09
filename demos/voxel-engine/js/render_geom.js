// Draw lists over the quad texture. The engine's quad buffer is full of holes
// (freed slots, slack at the end of every slot) and each pass wants a
// different subset of what is live: the scene draws opaque quads and glass
// separately, the cached shadow layer wants only the static world, the
// per-frame shadow update and the contact map only the dynamic bodies.
//
// Quads are drawn where they lie. One static index buffer holds six indices
// for every slot of the texture, and every texture row is cut into SEGS
// fixed segments of SEG slots. A segment knows what kinds of quad it holds
// and the bounds of its world quads; a pass is one multi-draw over the
// segments it wants, and its vertex stage drops the quads of other kinds
// that share them (render passes say which with a define, see shaders.js).
//
// Keeping this up to date costs in proportion to what changed, not to how
// many rows the engine flagged: a mirror of the quad words tells which
// segments of a dirty row really differ, and only those are read again and
// re-uploaded. During a demolition that is a few hundred quads a frame out
// of rows holding tens of thousands.
//
// The engine allocates quad slots chunk by chunk and meshes a chunk one face
// direction after the other, so a segment is mostly one direction of one
// chunk: the scene pass skips segments outside the view frustum or facing
// away from the camera (half of the world, from any viewpoint); a shadow
// refresh draws only segments that can face the sun and land in the
// rectangle being redrawn. Segments of body quads are culled the same way in
// the body's own frame (most hold the quads of one body): the scene pass
// leaves out those off screen or turned away, the passes that look along
// one direction (the sun's, straight up for the contact map) those with no
// face toward it or outside the rectangle being drawn.
import { QUAD_TEX_W, VOXEL } from './engine.js';

const SEG_SHIFT = 7;
const SEG = 1 << SEG_SHIFT;
const SEGS = QUAD_TEX_W / SEG;
const ROW_WORDS = QUAD_TEX_W * 2;
const MAX_BODIES = 8192;
// A delta (QuadLists.writeDelta): its header's words, and the words of a
// changed segment's record.
export const DELTA = { WORDS: 0, ROWS: 1, FLAGS: 2, BOX: 3, N_ROWS: 9, N_SEGS: 10, N_TOUCHED: 11, N_REACHED: 12, WORLD_QUADS: 13, BODY_QUADS: 14, SEGMENTS_READ: 15, SLOTS_CHANGED: 16, N_BOXES: 17, LEN: 18 };
const DELTA_SEG = 13;
// Slots in a group, and groups in a segment. Of a segment's groups its
// record says, for each of the six directions a face can look, which hold
// an opaque world quad that looks that way (`dirs`).
const GROUP = 8, GROUPS = SEG / GROUP, ALL_GROUPS = (1 << GROUPS) - 1;
// The slots an instance of the scene's lists draws when they are taken by
// direction (QuadLists.drawVisible, drawHeap): their runs are short more
// often, and an instance costs its full count of quads in vertices.
// (8: a twelfth fewer triangles again and twice the run words.)
const DIR_PER = 16;
// A draw list goes to the GPU as runs of up to RUN consecutive quad slots,
// one instance each (QuadLists._submit): the first slot in the low RUN_AT
// bits of a word, the number of slots less one above them.
export const RUN = 32;
export const RUN_AT = 26;
// The slots an instance of the glass list draws (QuadLists.drawGlass): a
// run of glass quads is one quad long more often than not.
const GLASS_PER = 1;

// Kinds of quad a segment can hold, as bits of its mask: bits 0..5 are world
// opaque quads by face direction.
const M_WORLD = 0x3f, M_BODY = 0x40, M_BODY_GLASS = 0x80, M_WORLD_GLASS = 0x100, M_LAMP = 0x200;
// A segment with a quad of a heap material (rubble, foliage): the scene
// pass draws it with the heap program (drawHeap), every other pass as usual.
const M_HEAP = 0x400;
// ... and one with a world quad of foliage among those: the pass that lays
// leaves again over the soot draws these segments and no other (drawLeaves).
const M_LEAF = 0x800;
// What of its segments a list of spans takes (QuadLists._spans).
const PART_WHOLE = 0, PART_PLAIN = 1, PART_HEAP = 2, PART_GLASS = 3;
const M_GLASS = M_BODY_GLASS | M_WORLD_GLASS, M_BODIES = M_BODY | M_BODY_GLASS;
// Per-segment record: first and last live slot, then counts of world opaque,
// glass and body quads.
// (S_H0, S_H1: the slots from the first heap quad to the last, where no
// other quad lies between them; a segment whose heap quads do not lie
// together has its first and last quad there, and is marked in `apart`;
// one with none has nothing there, and its mask no M_HEAP. The engine
// writes a mesh's heap quads last, so that the plain program draws the
// rest of such a segment: QuadStore::write.)
const S_FIRST = 0, S_LAST = 1, S_WORLD = 2, S_GLASS = 3, S_BODY = 4, S_H0 = 5, S_H1 = 6, S_LEN = 7;

// A segment's body: none, or the one body all its body quads belong to, or
// MIXED (several bodies, or world quads beside them), which no test culls.
const MIXED = 0xffff;
// Where the world changed in an update, as boxes: at most this many, and a
// change within this many voxels (summed over the axes) of a box joins it.
const BOXES = 32, BOX_NEAR = 16;
// Floats per body in the transform table (XF_STRIDE): rotation, then origin
// and scale.
const XF = 16;

// Subsets with a prebuilt draw list. Opaque scene geometry and the static
// shadow casters are culled per call instead (drawVisible, drawWorldIn).
export const SET = { GLASS: 0, BODIES: 1 };

export class QuadLists {
  // transLut: one byte per material, 1 = transparent. emitLut: one byte per
  // material, its emissive strength. heapLut: one byte per material, not 0
  // = drawn by the heap program in the scene pass, bit 1 = foliage.
  constructor(gl, state, transLut, emitLut, heapLut = new Uint8Array(256)) {
    this.gl = gl;
    this.state = state;
    this.lut = transLut;
    this.heap = heapLut;
    this.emit = emitLut;
    // Emissive world quads per row, five floats each (centre x, y, z in
    // voxels, area in voxel faces, material): what the renderer turns into
    // lamp lights. Bodies are left out: a lamp that has broken off goes dark.
    this.lamps = new Map();
    this.lampsChanged = false;
    this._lamp = new Float32Array(QUAD_TEX_W * 5);
    // (Without a context the lists keep the books and draw nothing: that
    // is how the sim's worker runs them, see writeDelta.)
    if (gl) {
      this.vao = gl.createVertexArray();
      // The indices of one run, the same for every run there is: two
      // triangles over the four vertices of each of its RUN slots. (A buffer
      // of indices for every slot of the quad texture, 24 bytes a slot, is
      // what this replaces: 15 to 22 MB of it in a collapse, and a draw call
      // inside the driver for every span of every list.)
      const idx = new Uint16Array(RUN * 6);
      for (let k = 0, v = 0; k < RUN; k++, v += 4) {
        idx[k * 6] = v; idx[k * 6 + 1] = v + 1; idx[k * 6 + 2] = v + 2;
        idx[k * 6 + 3] = v + 2; idx[k * 6 + 4] = v + 1; idx[k * 6 + 5] = v + 3;
      }
      this.buf = gl.createBuffer();
      gl.bindVertexArray(this.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      // The runs of the lists submitted this frame, one after another; when
      // the buffer is full it is given new storage and filled from the start
      // (what the GPU has yet to draw keeps the old).
      this.runBuf = gl.createBuffer();
      this.runCap = 65536;
      this.runAt = 0;
      this.runAge = 0;                   // times the buffer was given new storage
      this._runs = new Uint32Array(this.runCap);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.runBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.runCap * 4, gl.STREAM_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, 0);
      gl.vertexAttribDivisor(0, 1);
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      state.vaoObj = undefined;
    }
    // Where the runs of the scene's list lie in the buffer, for the pass
    // that draws the same list again (depth first, then colour).
    this._seen = { at: 0, n: 0, age: -1 };
    this._seenHeap = { at: 0, n: 0, age: -1 };
    this._seenLeaf = { at: 0, n: 0, age: -1 };
    // What a list is made of has changed this often: a segment's quads, a
    // body's place. A list made at one count stands until the next.
    this.changed = 0;
    // The scene's list is kept from one frame to the next while nothing it
    // is made of changes (the frustum, the eye, `changed`, the switches):
    // a page at rest does not cut it again. `_viewStale`: the spans in
    // tc/to are no longer the scene's (another list was built there).
    // Off: listed every frame, as it was (for a comparison).
    this.keep = true;
    // The slots an instance draws of a list cut by direction: the scene's
    // lists, and the sun's casters. (To be set for a count: an instance
    // draws that many quads however short its run, so shorter is fewer
    // triangles and more run words.)
    this.viewPer = DIR_PER;
    this.casterPer = DIR_PER;
    this._viewFor = new Float64Array(26).fill(NaN);
    this._viewQuads = 0;
    this._viewStale = true;
    this._listed = 0;
    this._seenOf = -1;
    // The glass quads as runs of one, a segment after another, made when
    // `changed` moves; a frame copies the segments in view (drawGlass).
    this._glass = { at: 0, n: 0, age: -1, made: -1, all: new Uint32Array(0), from: new Uint32Array(1), words: new Uint32Array(0), k: 0, quads: 0, seenFor: new Float64Array(21).fill(NaN) };
    this.capRows = 0;
    this.top = 0;                      // one past the highest row that has held quads
    this.rows = 0;
    this.mirror = new Uint32Array(0);  // the quad words as last read
    this.mask = new Uint16Array(0);    // per segment: kinds of quad in it
    this.seg = new Uint16Array(0);     // per segment: S_LEN values
    // Per segment: 1 where its heap quads do not lie together (another
    // quad lies between two of them). Two meshes that share a segment make
    // one, and which two share is the order the meshes were made in. The
    // lists' own, read out of the mirror: the delta's words do not say it.
    this.apart = new Uint8Array(0);
    // The parts of one such segment a list takes: first and last slot of each.
    this._parts = new Int16Array(SEG + 2);
    // Per segment and direction a face can look (six of them): the groups
    // of GROUP slots that hold an opaque world quad that looks that way, a
    // bit a group. A segment holds faces of all six directions more often
    // than not, so "can any face of it look at the eye" is nearly always
    // yes; of its groups, most hold one or two directions. The scene's
    // lists hand over the groups with a direction that can face the eye
    // (`_spans`), and no longer the segment whole: three quads in five of
    // a town's opaque pass were handed to the GPU to be culled there.
    this.dirs = new Uint16Array(0);
    // Off: a segment that may hold a face toward the eye is handed over
    // whole, as it was (for a comparison of the two pictures).
    this.byDir = true;
    // For each segment picked for the scene's lists, the directions that
    // can face the eye by its box (0x40: not to be told by direction: a
    // segment with a body's quads).
    this._can = new Uint8Array(0);
    this._canHeap = new Uint8Array(0);
    this._canLeaf = new Uint8Array(0);
    // Per segment: which of its slots hold a glass quad, a bit a slot
    // (SEG / 32 words). Panes lie scattered through the rows: a pane or
    // two among a hundred other quads. The lists' own, read out of the
    // mirror when a segment changes.
    this.glassBits = new Uint32Array(0);
    // The glass pass draws the glass quads and no other slot, a quad an
    // instance. Off: each segment that holds glass from its first quad to
    // its last in runs of RUN, the vertex stage throwing the rest away, as
    // it was (for a comparison of the two pictures).
    this.glassExact = true;
    this.segBox = new Uint16Array(0);  // per segment: bounds of its world quads (voxels, max exclusive)
    this.box = new Uint16Array(0);     // per row: the same over the whole row
    this.rowMask = new Uint16Array(0); // per row: the kinds of quad in any of its segments
    // The segments that hold body quads, and those that hold glass, in the
    // order of the buffer: what the lists of bodies and of glass go
    // through instead of every segment there is.
    this.bodySegs = new Uint32Array(0);
    this.bodySegN = 0;
    this.glassSegs = new Uint32Array(0);
    this.glassSegN = 0;
    // Body quads move with their body, so a segment of them is culled in the
    // body's own frame: which body it belongs to, the bounds of its quads in
    // that body's voxels (max exclusive) and the face directions among them.
    this.segBody = new Uint16Array(0);
    this.bodyBox = new Uint16Array(0);
    this.bodyFace = new Uint8Array(0);
    // This frame's body transforms, XF floats each (render_sync.js: its
    // record of what the transform texture holds), and whether body segments
    // are culled at all. Off: every one is drawn. That is how it stands
    // until the tests are made per body instead of per segment: per
    // segment they took 6% of the keep's triangles (rubble is meshed in
    // small pieces with every direction in every segment, so the facing
    // test has nothing to take) for a millisecond of list building.
    this.xf = null;
    this.cullBodies = false;
    this.bodySegments = 0;             // body segments the last culled list looked at
    this.bodyCulled = 0;               // ... and left out
    // Bodies whose quads changed in the last update(): some came, went or
    // changed, or a segment of theirs took in or lost another body's. Each
    // id once, in `touched[0 .. touchedCount)`.
    this.touched = new Uint16Array(MAX_BODIES);
    this.touchedCount = 0;
    this._touchedAt = new Uint32Array(MAX_BODIES);
    this._update = 1;
    this._flag = new Uint8Array(MAX_BODIES);  // per body: drawn by the list being built
    // Two spans of a culled list with no more than this many slots between
    // them are submitted as one: the slots in between are empty, or quads
    // the pass's vertex stage drops or the GPU culls, and a sub-draw costs
    // the driver more than a few hundred of those. 0: only spans that touch.
    this.bridge = 0;
    // Indices and spans submitted by every list since the renderer last
    // set them to 0 (three indices a triangle; a span is a sub-draw).
    this.indices = 0;
    this.spans = 0;
    this._keepOut = 0;   // kinds a bridged gap of that list may not hold
    // Where each body is: a sphere in the world (centre x, y, z and radius,
    // metres) that holds all its quads. Kept by render_sync.js, which calls
    // place() for a body whenever its transform or its quads changed.
    this.sphere = new Float32Array(MAX_BODIES * 4);
    // The viewer in each body's voxel frame, worked out once per list.
    this._local = new Float32Array(MAX_BODIES * 3);
    this._localAt = new Uint32Array(MAX_BODIES);
    this._stamp = 0;
    this._norm = new Float32Array(5);  // lengths of the frustum planes' normals
    this.sets = [0, 1].map(() => ({ counts: new Int32Array(0), offsets: new Int32Array(0), n: 0, quads: 0 }));
    // Draw list of the culled pass being issued.
    this.tc = new Int32Array(0);
    this.to = new Int32Array(0);
    this.tn = 0;
    this.tq = 0;
    // The visible segments that go to the heap program.
    this.hc = new Int32Array(0);
    this.ho = new Int32Array(0);
    // ... and of those, the segments that hold foliage (drawLeaves).
    this.lc = new Int32Array(0);
    this.lo = new Int32Array(0);
    this.ln = 0;
    // The segments a list wants, in the order it wants them, before they
    // are made into spans (_spans); those for the heap program apart.
    this._pick = new Int32Array(0);
    this._pickHeap = new Int32Array(0);
    this._pickLeaf = new Int32Array(0);
    // A segment that holds heap quads is drawn in two parts: its heap range
    // by the heap program, the rest by the plain one. Off: all of it by the
    // heap program, as before the engine wrote heap quads last (for a
    // comparison of the two pictures).
    this.split = true;
    // A segment whose heap quads do not lie together is drawn quad by quad:
    // each run of heap quads by the heap program, each run of the others
    // by the plain one. Off: from its first quad to its last by the heap
    // program, as it was (for a comparison of the two pictures).
    this.exact = true;
    this.hn = 0;
    this.worldQuads = 0;
    this.bodyQuads = 0;
    // Rows nearest the camera first, so that on a GPU with early depth
    // rejection the front of the scene is shaded before what it hides.
    this.order = new Uint16Array(0);
    this.orderKey = new Float32Array(0);
    this.orderCam = [NaN, NaN, NaN];
    this.orderRows = 0;
    // Largest local coordinate (voxels) any quad of a body reaches, per axis:
    // a bound on how far the body extends from its grid corner. `ext` is what
    // callers read; `next` is rebuilt a row per frame and swapped in, so
    // bounds left behind by a recycled body id do not linger.
    this.ext = new Uint16Array(MAX_BODIES * 3);
    this.next = new Uint16Array(MAX_BODIES * 3);
    this.roll = 0;
    // What the last update() found.
    this.worldChanged = false;
    this.bodiesChanged = false;
    this.changedBox = new Int32Array(6); // voxels, valid when worldChanged
    // The same as up to BOXES boxes that together hold every change:
    // changes far apart (rubble landing here, a wall breaking there) are
    // one box that takes in half a town, and whoever redraws "where the
    // world changed" redraws all of that.
    this.changedBoxes = new Int32Array(BOXES * 6);
    this.changedBoxN = 0;
    this.segmentsRead = 0;               // segments read again by the last update()
    this.slotsChanged = 0;               // ... and the slots in them that held something else
    // What the last update() changed, for writeDelta: the rows (row, then
    // first changed segment | one past the last << 8 | lamps to collect
    // << 16), the segments, and for each run of a body's changed quads how
    // far they reach (body, x, y, z).
    this._rowsChanged = new Uint32Array(0);
    this._segsChanged = new Uint32Array(0);
    this._reached = new Uint32Array(1024);
    this._nRows = this._nSegs = this._nReached = 0;
    this._q = new Int32Array(8);         // scratch: one decoded quad
  }

  _reserve(rows) {
    if (rows <= this.capRows) return;
    // Room for the rows destruction will add, so the tables are not
    // rebuilt in the middle of a collapse: four times the rows a world
    // starts with (made behind the start card, where the time is free: a
    // street's fall takes the engine's rows from 140 to 473, a tower's from
    // 41 to 210, and room for twice the first rows was outgrown in the
    // middle of both: 6 ms of one frame to make 10 MB and copy 5), and
    // twice what is needed whenever that too is outgrown.
    this._fit(Math.max(this.capRows === 0 ? rows * 4 + 64 : rows * 2 + 32, 64));
  }

  // The tables made anew with room for `cap` rows (no fewer than are in
  // use), what they hold of those rows kept. (By itself: a check makes
  // them exactly full with it, so that the next row a destruction adds
  // takes the growing path in the middle of it.)
  _fit(cap) {
    cap = Math.max(cap, this.rows, 1);
    const grow = (a, len) => { const b = new a.constructor(len); b.set(a.length > len ? a.subarray(0, len) : a); return b; };
    this.mirror = grow(this.mirror, cap * ROW_WORDS);
    this.mask = grow(this.mask, cap * SEGS);
    this.seg = grow(this.seg, cap * SEGS * S_LEN);
    this.apart = grow(this.apart, cap * SEGS);
    this.glassBits = grow(this.glassBits, cap * SEGS * (SEG >> 5));
    this.dirs = grow(this.dirs, cap * SEGS * 6);
    this._can = new Uint8Array(cap * SEGS);
    this._canHeap = new Uint8Array(cap * SEGS);
    this._canLeaf = new Uint8Array(cap * SEGS);
    this.segBox = grow(this.segBox, cap * SEGS * 6);
    this.box = grow(this.box, cap * 6);
    this.rowMask = grow(this.rowMask, cap);
    this._rowsChanged = grow(this._rowsChanged, cap * 2);
    this._segsChanged = grow(this._segsChanged, cap * SEGS);
    this.bodySegs = grow(this.bodySegs, cap * SEGS);
    this.glassSegs = grow(this.glassSegs, cap * SEGS);
    this.segBody = grow(this.segBody, cap * SEGS);
    this.bodyBox = grow(this.bodyBox, cap * SEGS * 6);
    this.bodyFace = grow(this.bodyFace, cap * SEGS);
    this.order = new Uint16Array(cap);
    this.orderKey = new Float32Array(cap);
    this.orderRows = 0;
    // (The draw lists are kept too: they are made again whenever a row
    // changes, as after the rows that outgrew the tables, but a fit by
    // itself changes none.)
    for (const s of this.sets) {
      s.counts = grow(s.counts, cap * SEGS);
      s.offsets = grow(s.offsets, cap * SEGS);
    }
    this.tc = grow(this.tc, cap * SEGS);
    this.to = grow(this.to, cap * SEGS);
    this.hc = grow(this.hc, cap * SEGS);
    this.ho = grow(this.ho, cap * SEGS);
    this._pick = new Int32Array(cap * SEGS);
    this._pickHeap = new Int32Array(cap * SEGS);
    this._pickLeaf = new Int32Array(cap * SEGS);
    this.capRows = cap;
  }

  // Forget every row (the engine was re-initialised).
  reset() {
    this.changed++;
    this.rows = 0;
    this.top = 0;
    this.mirror.fill(0);
    this.mask.fill(0);
    this.seg.fill(0);
    this.apart.fill(0);
    this.glassBits.fill(0);
    this.dirs.fill(0);
    this.segBox.fill(0);
    this.box.fill(0);
    this.rowMask.fill(0);
    this.bodySegN = this.glassSegN = 0;
    this.segBody.fill(0);
    this.bodyBox.fill(0);
    this.bodyFace.fill(0);
    this.ext.fill(0);
    this.next.fill(0);
    this.sphere.fill(0);
    this.roll = 0;
    this.bodyQuads = this.worldQuads = 0;
    this.orderRows = 0;
    this.lampsChanged = this.lamps.size > 0;
    this.lamps.clear();
    for (const s of this.sets) { s.n = 0; s.quads = 0; }
  }

  // Bound (voxels) on the distance from a body's grid corner to any of its quads.
  bodyExtent(id) {
    const e = this.ext, o = id * 3;
    return Math.hypot(e[o], e[o + 1], e[o + 2]);
  }

  // Body `id` has a new transform, or new quads: its sphere again. (Around
  // the middle of the box from its grid corner to the furthest its quads
  // reach, with 10 cm to spare.)
  place(id) {
    this.changed++;
    const f = this.xf, o = id * XF, e = this.ext, s = this.sphere, k = id * 4;
    const qx = f[o], qy = f[o + 1], qz = f[o + 2], qw = f[o + 3], sc = f[o + 7];
    const ax = e[id * 3] * 0.5 * sc, ay = e[id * 3 + 1] * 0.5 * sc, az = e[id * 3 + 2] * 0.5 * sc;
    const tx = 2 * (qy * az - qz * ay), ty = 2 * (qz * ax - qx * az), tz = 2 * (qx * ay - qy * ax);
    s[k] = f[o + 4] + ax + qw * tx + (qy * tz - qz * ty);
    s[k + 1] = f[o + 5] + ay + qw * ty + (qz * tx - qx * tz);
    s[k + 2] = f[o + 6] + az + qw * tz + (qx * ty - qy * tx);
    s[k + 3] = Math.hypot(ax, ay, az) + 0.1;
  }

  // Body `body`'s quads changed in this update().
  _touch(body) {
    if (this._touchedAt[body] === this._update) return;
    this._touchedAt[body] = this._update;
    this.touched[this.touchedCount++] = body;
  }

  _extent(table, body, x, y, z) {
    const o = body * 3;
    if (x > table[o]) table[o] = x;
    if (y > table[o + 1]) table[o + 1] = y;
    if (z > table[o + 2]) table[o + 2] = z;
  }

  // Decodes a quad's two words into this._q: min corner x, y, z, max corner
  // (exclusive) x, y, z, face, body. Returns its material (0 = empty slot).
  _decode(lo, hi) {
    const mat = (hi >>> 11) & 255;
    if (mat === 0) return 0;
    const q = this._q;
    const face = (lo >>> 30) | ((hi & 1) << 2), d = face >> 1;
    const w = ((hi >>> 1) & 31) + 1, h = ((hi >>> 6) & 31) + 1;
    const x = lo & 1023, y = (lo >>> 10) & 1023, z = (lo >>> 20) & 1023;
    q[0] = x; q[1] = y; q[2] = z;
    // w runs along axis (d + 1) % 3, h along (d + 2) % 3.
    q[3] = x + (d === 0 ? 1 : d === 1 ? h : w);
    q[4] = y + (d === 1 ? 1 : d === 2 ? h : w);
    q[5] = z + (d === 2 ? 1 : d === 0 ? h : w);
    q[6] = face;
    q[7] = hi >>> 19;
    return mat;
  }

  // The world changed inside this box (quads that were there or are there
  // now; once for a changed segment). It goes into the one box around
  // everything, and into the nearest of the several: the one that grows
  // least for it, or a box of its own when none is near and there is room.
  _noteWorld(x0, y0, z0, x1, y1, z1) {
    const cb = this.changedBox;
    this.worldChanged = true;
    cb[0] = Math.min(cb[0], x0);
    cb[1] = Math.min(cb[1], y0);
    cb[2] = Math.min(cb[2], z0);
    cb[3] = Math.max(cb[3], x1);
    cb[4] = Math.max(cb[4], y1);
    cb[5] = Math.max(cb[5], z1);
    const bs = this.changedBoxes, n = this.changedBoxN;
    let best = -1, least = Infinity;
    for (let o = 0, i = 0; i < n; i++, o += 6) {
      const grow = Math.max(bs[o + 3], x1) - Math.min(bs[o], x0) + Math.max(bs[o + 4], y1) - Math.min(bs[o + 1], y0) + Math.max(bs[o + 5], z1) - Math.min(bs[o + 2], z0)
        - (bs[o + 3] - bs[o]) - (bs[o + 4] - bs[o + 1]) - (bs[o + 5] - bs[o + 2]);
      if (grow < least) { least = grow; best = i; }
    }
    if (best < 0 || (least > BOX_NEAR && n < BOXES)) {
      const o = n * 6;
      bs[o] = x0; bs[o + 1] = y0; bs[o + 2] = z0; bs[o + 3] = x1; bs[o + 4] = y1; bs[o + 5] = z1;
      this.changedBoxN = n + 1;
    } else {
      const o = best * 6;
      bs[o] = Math.min(bs[o], x0); bs[o + 1] = Math.min(bs[o + 1], y0); bs[o + 2] = Math.min(bs[o + 2], z0);
      bs[o + 3] = Math.max(bs[o + 3], x1); bs[o + 4] = Math.max(bs[o + 4], y1); bs[o + 5] = Math.max(bs[o + 5], z1);
    }
  }

  // Nothing has changed yet: the box starts inside out.
  _clearChanges() {
    const cb = this.changedBox;
    this.worldChanged = this.bodiesChanged = false;
    cb[0] = cb[1] = cb[2] = 1024;
    cb[3] = cb[4] = cb[5] = 0;
    this.changedBoxN = 0;
  }

  // Segment s of row r differs from the mirror: take the engine's words at
  // u32[p ..] (the segment's first), note what changed, and rebuild what is
  // known about the segment: the kinds it holds, where its world quads are,
  // how many of each kind. One pass, one decode per live quad.
  _syncSegment(u32, p, r, s) {
    const m = this.mirror, lut = this.lut, emit = this.emit, heap = this.heap;
    const at = r * SEGS + s, mp = r * ROW_WORDS + s * SEG * 2;
    let mask = 0, first = -1, last = 0, nw = 0, ng = 0, nb = 0;
    let x0 = 1024, y0 = 1024, z0 = 1024, x1 = 0, y1 = 0, z1 = 0;
    // The body quads: whose they are (-1: nobody's yet), their bounds and
    // directions in the body's frame.
    let who = -1, faces = 0, bx0 = 1024, by0 = 1024, bz0 = 1024, bx1 = 0, by1 = 0, bz1 = 0;
    // What changed, kept here and written once at the end (a call and six
    // writes to the lists' own box for every changed quad was a third of
    // this function, and in a collapse four quads in five it reads have
    // changed): the box of the world quads that came or went, the body
    // touched last (most changed quads in a row are one body's), and the
    // extent of that body's changed quads.
    let cx0 = 1024, cy0 = 1024, cz0 = 1024, cx1 = 0, cy1 = 0, cz1 = 0, changes = 0;
    let told = 0, eb = 0, ex = 0, ey = 0, ez = 0;
    // The heap quads' first and last slot; the last plain quad seen, and
    // whether one came after a heap quad and before a later one.
    let h0 = SEG, h1 = 0, plainAt = -1, apart = false;
    // Which slots hold glass (see `glassBits`).
    let gb0 = 0, gb1 = 0, gb2 = 0, gb3 = 0;
    // The groups that hold an opaque world quad of each direction.
    let d0 = 0, d1 = 0, d2 = 0, d3 = 0, d4 = 0, d5 = 0;
    for (let i = 0; i < SEG; i++) {
      const lo = u32[p + i * 2], hi = u32[p + i * 2 + 1];
      const olo = m[mp + i * 2], ohi = m[mp + i * 2 + 1];
      const changed = lo !== olo || hi !== ohi;
      if (changed) {
        changes++;
        m[mp + i * 2] = lo;
        m[mp + i * 2 + 1] = hi;
        // What used to be in the slot.
        if (((ohi >>> 11) & 255) !== 0) {
          const ob = ohi >>> 19;
          if (ob !== 0) {
            this.bodiesChanged = true;
            if (ob !== told) { this._touch(ob); told = ob; }
          } else {
            const of = (olo >>> 30) | ((ohi & 1) << 2), od = of >> 1;
            const ow = ((ohi >>> 1) & 31) + 1, oh = ((ohi >>> 6) & 31) + 1;
            const ox = olo & 1023, oy = (olo >>> 10) & 1023, oz = (olo >>> 20) & 1023;
            const oex = ox + (od === 0 ? 1 : od === 1 ? oh : ow), oey = oy + (od === 1 ? 1 : od === 2 ? oh : ow), oez = oz + (od === 2 ? 1 : od === 0 ? oh : ow);
            if (ox < cx0) cx0 = ox;
            if (oy < cy0) cy0 = oy;
            if (oz < cz0) cz0 = oz;
            if (oex > cx1) cx1 = oex;
            if (oey > cy1) cy1 = oey;
            if (oez > cz1) cz1 = oez;
          }
        }
      }
      const mat = (hi >>> 11) & 255;
      if (mat === 0) continue;
      if (first < 0) first = i;
      last = i;
      if (lut[mat]) {
        const bit = 1 << (i & 31);
        if (i < 32) gb0 |= bit; else if (i < 64) gb1 |= bit; else if (i < 96) gb2 |= bit; else gb3 |= bit;
      }
      if (heap[mat]) {
        mask |= M_HEAP;
        if (h0 === SEG) h0 = i;
        else if (plainAt > h0) apart = true;
        h1 = i;
      } else plainAt = i;
      const face = (lo >>> 30) | ((hi & 1) << 2), d = face >> 1;
      const w = ((hi >>> 1) & 31) + 1, h = ((hi >>> 6) & 31) + 1;
      // w runs along axis (d + 1) % 3, h along (d + 2) % 3.
      const x = lo & 1023, y = (lo >>> 10) & 1023, z = (lo >>> 20) & 1023;
      const ex1 = x + (d === 0 ? 1 : d === 1 ? h : w), ey1 = y + (d === 1 ? 1 : d === 2 ? h : w), ez1 = z + (d === 2 ? 1 : d === 0 ? h : w);
      const body = hi >>> 19;
      if (body === 0) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (z < z0) z0 = z;
        if (ex1 > x1) x1 = ex1;
        if (ey1 > y1) y1 = ey1;
        if (ez1 > z1) z1 = ez1;
        if (lut[mat]) { mask |= M_WORLD_GLASS; ng++; } else {
          mask |= 1 << face;
          const g = 1 << (i >> 3);
          if (face === 0) d0 |= g; else if (face === 1) d1 |= g; else if (face === 2) d2 |= g; else if (face === 3) d3 |= g; else if (face === 4) d4 |= g; else d5 |= g;
        }
        if (emit[mat]) mask |= M_LAMP;
        if (heap[mat] & 2) mask |= M_LEAF;
        nw++;
        if (changed) {
          if (x < cx0) cx0 = x;
          if (y < cy0) cy0 = y;
          if (z < cz0) cz0 = z;
          if (ex1 > cx1) cx1 = ex1;
          if (ey1 > cy1) cy1 = ey1;
          if (ez1 > cz1) cz1 = ez1;
        }
      } else {
        if (lut[mat]) { mask |= M_BODY_GLASS; ng++; } else mask |= M_BODY;
        nb++;
        who = who < 0 || who === body ? body : MIXED;
        faces |= 1 << face;
        if (x < bx0) bx0 = x;
        if (y < by0) by0 = y;
        if (z < bz0) bz0 = z;
        if (ex1 > bx1) bx1 = ex1;
        if (ey1 > by1) by1 = ey1;
        if (ez1 > bz1) bz1 = ez1;
        if (changed) {
          this.bodiesChanged = true;
          if (body !== told) { this._touch(body); told = body; }
          if (body !== eb) {
            if (eb !== 0) this._extend(eb, ex, ey, ez);
            eb = body; ex = ey = ez = 0;
          }
          if (ex1 > ex) ex = ex1;
          if (ey1 > ey) ey = ey1;
          if (ez1 > ez) ez = ez1;
        }
      }
    }
    this.slotsChanged += changes;
    if (eb !== 0) this._extend(eb, ex, ey, ez);
    if (cx1 > cx0) this._noteWorld(cx0, cy0, cz0, cx1, cy1, cz1);
    const sg = this.seg, o = at * S_LEN, b = at * 6, sb = this.segBox;
    this.worldQuads += nw - sg[o + S_WORLD];
    this.bodyQuads += nb - sg[o + S_BODY];
    sg[o + S_FIRST] = first < 0 ? 0 : first;
    sg[o + S_LAST] = last;
    sg[o + S_WORLD] = nw;
    sg[o + S_GLASS] = ng;
    sg[o + S_BODY] = nb;
    sg[o + S_H0] = h0 === SEG ? 0 : apart ? sg[o + S_FIRST] : h0;
    sg[o + S_H1] = h0 === SEG ? 0 : apart ? last : h1;
    this.apart[at] = apart ? 1 : 0;
    const gb = this.glassBits, go = at * (SEG >> 5);
    gb[go] = gb0; gb[go + 1] = gb1; gb[go + 2] = gb2; gb[go + 3] = gb3;
    const dr = this.dirs, dq = at * 6;
    dr[dq] = d0; dr[dq + 1] = d1; dr[dq + 2] = d2; dr[dq + 3] = d3; dr[dq + 4] = d4; dr[dq + 5] = d5;
    this.mask[at] = mask;
    sb[b] = x0; sb[b + 1] = y0; sb[b + 2] = z0; sb[b + 3] = x1; sb[b + 4] = y1; sb[b + 5] = z1;
    const bb = this.bodyBox, was = this.segBody[at], now = nb === 0 ? 0 : nw > 0 ? MIXED : who;
    // A segment that passes from one body to another, or between one body
    // and several, changes which draw list the quads in it belong to.
    if (was !== now) {
      if (was !== 0 && was !== MIXED) this._touch(was);
      if (now !== 0 && now !== MIXED) this._touch(now);
    }
    this.segBody[at] = now;
    this.bodyFace[at] = faces;
    bb[b] = bx0; bb[b + 1] = by0; bb[b + 2] = bz0; bb[b + 3] = bx1; bb[b + 4] = by1; bb[b + 5] = bz1;
  }

  // Body `body` has a changed quad reaching to (x, y, z) in its own voxels.
  _extend(body, x, y, z) {
    if (this._nReached * 4 + 4 > this._reached.length) { const b = new Uint32Array(this._reached.length * 2); b.set(this._reached); this._reached = b; }
    const at = this._nReached++ * 4;
    this._reached[at] = body; this._reached[at + 1] = x; this._reached[at + 2] = y; this._reached[at + 3] = z;
    this._reach(body, x, y, z);
  }

  _reach(body, x, y, z) {
    const ext = this.ext, next = this.next, o = body * 3;
    if (x > ext[o]) ext[o] = x;
    if (y > ext[o + 1]) ext[o + 1] = y;
    if (z > ext[o + 2]) ext[o + 2] = z;
    if (x > next[o]) next[o] = x;
    if (y > next[o + 1]) next[o + 1] = y;
    if (z > next[o + 2]) next[o + 2] = z;
  }

  // The emissive world quads of row r, for the lamp lights.
  _collectLamps(r) {
    const m = this.mirror, emit = this.emit, q = this._q, lamp = this._lamp;
    let n = 0;
    for (let s = 0; s < SEGS; s++) {
      if (!(this.mask[r * SEGS + s] & M_LAMP)) continue;
      const p = r * ROW_WORDS + s * SEG * 2;
      for (let i = 0; i < SEG; i++) {
        const mat = this._decode(m[p + i * 2], m[p + i * 2 + 1]);
        if (mat === 0 || q[7] !== 0 || !emit[mat]) continue;
        lamp[n] = (q[0] + q[3]) * 0.5; lamp[n + 1] = (q[1] + q[4]) * 0.5; lamp[n + 2] = (q[2] + q[5]) * 0.5;
        // One of the three extents is the face's thickness of one voxel.
        lamp[n + 3] = (q[3] - q[0]) * (q[4] - q[1]) * (q[5] - q[2]);
        lamp[n + 4] = mat;
        n += 5;
      }
    }
    // The same lamps as before (the row changed elsewhere, or its quads
    // only moved up a slot): nothing to tell. Every row with a lamp in it
    // that was touched used to have the whole scene's lamps gathered
    // again: on a street of shop signs, most frames of a collapse.
    const old = this.lamps.get(r);
    let same = old ? old.length === n : n === 0;
    for (let i = 0; same && i < n; i++) same = old[i] === lamp[i];
    if (same) return;
    if (n > 0) this.lamps.set(r, lamp.slice(0, n)); else this.lamps.delete(r);
    this.lampsChanged = true;
  }

  // Brings row r in line with the engine's words at u32[p ..]. Only segments
  // that differ from the mirror are looked at. Returns false when nothing
  // changed; otherwise the changed slots are [this._lo, this._hi).
  _syncRow(u32, p, r) {
    const m = this.mirror, mp = r * ROW_WORDS, mask = this.mask;
    let lo = -1, hi = -1, lamps = false;
    for (let s = 0; s < SEGS; s++) {
      const a = s * SEG * 2;
      let i = 0;
      while (i < SEG * 2 && u32[p + a + i] === m[mp + a + i]) i++;
      if (i === SEG * 2) continue;
      const before = mask[r * SEGS + s];
      this._syncSegment(u32, p + a, r, s);
      this._segsChanged[this._nSegs++] = r * SEGS + s;
      if ((before | mask[r * SEGS + s]) & M_LAMP) lamps = true;
      if (lo < 0) lo = s;
      hi = s;
      this.segmentsRead++;
    }
    if (lo < 0) return false;
    // The row's bounds, for the front-to-back order.
    const box = this.box, b = r * 6, sb = this.segBox;
    box[b] = box[b + 1] = box[b + 2] = 1024;
    box[b + 3] = box[b + 4] = box[b + 5] = 0;
    let kinds = 0;
    for (let s = 0, k = r * SEGS * 6; s < SEGS; s++, k += 6) {
      kinds |= mask[r * SEGS + s];
      if (!(mask[r * SEGS + s] & (M_WORLD | M_WORLD_GLASS))) continue;
      for (let c = 0; c < 3; c++) {
        if (sb[k + c] < box[b + c]) box[b + c] = sb[k + c];
        if (sb[k + c + 3] > box[b + c + 3]) box[b + c + 3] = sb[k + c + 3];
      }
    }
    this.rowMask[r] = kinds;
    if (lamps) this._collectLamps(r);
    this._rowsChanged[this._nRows * 2] = r;
    this._rowsChanged[this._nRows++ * 2 + 1] = lo | (hi + 1) << 8 | (lamps ? 1 << 16 : 0);
    this._lo = lo * SEG;
    this._hi = (hi + 1) * SEG;
    return true;
  }

  // The live span of segment `at` joins a prebuilt list.
  _push(s, at, live) {
    const sg = this.seg, o = at * S_LEN;
    const off = (at * SEG + sg[o + S_FIRST]) * 24, count = (sg[o + S_LAST] - sg[o + S_FIRST] + 1) * 6;
    if (s.n > 0 && s.offsets[s.n - 1] + s.counts[s.n - 1] * 4 === off) s.counts[s.n - 1] += count;
    else { s.offsets[s.n] = off; s.counts[s.n++] = count; }
    s.quads += live;
  }

  _rebuildSets() {
    this.changed++;
    const mask = this.mask, sg = this.seg, glass = this.sets[SET.GLASS], bodies = this.sets[SET.BODIES];
    const bs = this.bodySegs, gs = this.glassSegs;
    let nb = 0, ng = 0;
    glass.n = glass.quads = bodies.n = bodies.quads = 0;
    for (let at = 0, n = this.rows * SEGS; at < n; at++) {
      const k = mask[at];
      if (k & M_GLASS) { this._push(glass, at, sg[at * S_LEN + S_GLASS]); gs[ng++] = at; }
      if (k & M_BODIES) { this._push(bodies, at, sg[at * S_LEN + S_BODY]); bs[nb++] = at; }
    }
    this.bodySegN = nb;
    this.glassSegN = ng;
  }

  // Advance the background rebuild of the body bounds by one row with bodies.
  _rollExtents() {
    const m = this.mirror, q = this._q;
    for (let k = 0; k < 16 && this.roll < this.rows; k++) {
      const r = this.roll++;
      let found = false;
      for (let s = 0; s < SEGS; s++) {
        if (!(this.mask[r * SEGS + s] & M_BODIES)) continue;
        found = true;
        const p = r * ROW_WORDS + s * SEG * 2;
        for (let i = 0; i < SEG; i++) {
          if (this._decode(m[p + i * 2], m[p + i * 2 + 1]) !== 0 && q[7] !== 0) this._extent(this.next, q[7], q[3], q[4], q[5]);
        }
      }
      if (found) break;
    }
    if (this.roll >= this.rows) {
      this.ext.set(this.next);
      this.next.fill(0);
      this.roll = 0;
    }
  }

  // frame: the sim's frame, whose quad runs name the rows to look at (every
  // row when it is a full one) and where their words are. upload(row, slot,
  // slots), when given, is called for each span of slots that changed and
  // must reach the quad texture.
  update(frame, rows, upload) {
    this._reserve(rows);
    this.rows = rows;
    this._clearChanges();
    this.segmentsRead = 0;
    this.slotsChanged = 0;
    this._nRows = this._nSegs = this._nReached = 0;
    this._update++;
    this.touchedCount = 0;
    let any = false;
    const u32 = frame.u32;
    for (let i = 0, n = frame.runs; i < n; i++) {
      const start = frame.runStart(i), end = Math.min(start + frame.runRows(i), rows), p = frame.runWords(i);
      for (let r = start; r < end; r++) {
        if (!this._syncRow(u32, p + (r - start) * ROW_WORDS, r)) continue;
        any = true;
        if (r >= this.top) this.top = r + 1;
        if (upload) upload(r, this._lo, this._hi - this._lo);
      }
    }
    if (any) {
      this._rebuildSets();
      this.orderCam[0] = NaN; // row bounds changed
    }
    if (this.bodyQuads > 0 || this.roll > 0) this._rollExtents();
  }

  // What the last update() changed, as 32-bit words: everything another
  // QuadLists needs to hold the same books without reading a quad (apply).
  // The sim's worker keeps lists of its own, with no context, over the rows
  // it sends anyway, and sends this with them: the comparing and decoding
  // of every changed segment (0.4 ms a frame of a collapse, 7 to 10 ms in
  // the frame a storey breaks up) is then the worker's, and the page copies.
  //   DELTA.LEN words of header; two words a changed row; DELTA_SEG words
  //   a changed segment; a word a body touched; two a reach.
  deltaWords() { return DELTA.LEN + this._nRows * 2 + this._nSegs * DELTA_SEG + this.touchedCount + this._nReached * 2 + this.changedBoxN * 6; }

  writeDelta(d, at) {
    const cb = this.changedBox, sg = this.seg, sb = this.segBox, bb = this.bodyBox;
    d[at + DELTA.ROWS] = this.rows;
    d[at + DELTA.FLAGS] = (this.worldChanged ? 1 : 0) | (this.bodiesChanged ? 2 : 0);
    for (let c = 0; c < 6; c++) d[at + DELTA.BOX + c] = cb[c];
    d[at + DELTA.N_ROWS] = this._nRows;
    d[at + DELTA.N_SEGS] = this._nSegs;
    d[at + DELTA.N_TOUCHED] = this.touchedCount;
    d[at + DELTA.N_REACHED] = this._nReached;
    d[at + DELTA.WORLD_QUADS] = this.worldQuads;
    d[at + DELTA.BODY_QUADS] = this.bodyQuads;
    d[at + DELTA.SEGMENTS_READ] = this.segmentsRead;
    d[at + DELTA.SLOTS_CHANGED] = this.slotsChanged;
    d[at + DELTA.N_BOXES] = this.changedBoxN;
    let w = at + DELTA.LEN;
    for (let i = 0; i < this._nRows * 2; i++) d[w++] = this._rowsChanged[i];
    for (let i = 0; i < this._nSegs; i++) {
      const s = this._segsChanged[i], o = s * S_LEN, b = s * 6;
      d[w] = s;
      d[w + 1] = this.mask[s] | sg[o + S_FIRST] << 16 | sg[o + S_LAST] << 24;
      d[w + 2] = sg[o + S_WORLD] | sg[o + S_GLASS] << 8 | sg[o + S_BODY] << 16 | this.bodyFace[s] << 24;
      d[w + 3] = this.segBody[s] | sg[o + S_H0] << 16 | sg[o + S_H1] << 24;
      d[w + 10] = (this.dirs[s * 6] | this.dirs[s * 6 + 1] << 16) >>> 0;
      d[w + 11] = (this.dirs[s * 6 + 2] | this.dirs[s * 6 + 3] << 16) >>> 0;
      d[w + 12] = (this.dirs[s * 6 + 4] | this.dirs[s * 6 + 5] << 16) >>> 0;
      d[w + 4] = sb[b] | sb[b + 1] << 16; d[w + 5] = sb[b + 2] | sb[b + 3] << 16; d[w + 6] = sb[b + 4] | sb[b + 5] << 16;
      d[w + 7] = bb[b] | bb[b + 1] << 16; d[w + 8] = bb[b + 2] | bb[b + 3] << 16; d[w + 9] = bb[b + 4] | bb[b + 5] << 16;
      w += DELTA_SEG;
    }
    for (let i = 0; i < this.touchedCount; i++) d[w++] = this.touched[i];
    for (let i = 0; i < this._nReached; i++) {
      const r = this._reached;
      d[w++] = r[i * 4] | r[i * 4 + 1] << 16;
      d[w++] = r[i * 4 + 2] | r[i * 4 + 3] << 16;
    }
    for (let i = 0; i < this.changedBoxN * 6; i++) d[w++] = this.changedBoxes[i];
    d[at + DELTA.WORDS] = w - at;
    return w - at;
  }

  // Nothing has come since the lists were last looked at: what update()
  // leaves when a frame has no rows (for lists that are kept by apply()).
  still() {
    this._clearChanges();
    this._update++;
    this.touchedCount = 0;
    this.segmentsRead = this.slotsChanged = 0;
    this._nRows = this._nSegs = this._nReached = 0;
  }

  // The other end: takes a delta (at d[at ..]) in place of update(). frame
  // holds the rows the delta names, as update()'s does (the rows of its
  // runs; newer words than the delta's are as good: a later delta then
  // says what they mean): the changed spans are copied from them into the
  // mirror (`mirror`: another's to share instead, which already holds
  // them) and upload(row, slot, slots) is called for each, as in update().
  // more: this is not the first delta since the lists were last looked
  // at (several packets came between two pictures): what changed is added
  // to what the deltas before it said, not put in its place.
  apply(d, at, frame, upload, mirror = null, more = false) {
    const rows = d[at + DELTA.ROWS];
    this._reserve(rows);
    if (mirror) this.mirror = mirror;
    this.rows = rows;
    const flags = d[at + DELTA.FLAGS], cb = this.changedBox;
    if (!more) {
      this._clearChanges();
      this._update++;
      this.touchedCount = 0;
      this.segmentsRead = this.slotsChanged = 0;
    }
    this._nRows = this._nSegs = this._nReached = 0;
    const nRows = d[at + DELTA.N_ROWS], nSegs = d[at + DELTA.N_SEGS], nTouched = d[at + DELTA.N_TOUCHED], nReached = d[at + DELTA.N_REACHED], nBoxes = d[at + DELTA.N_BOXES];
    if (flags & 1) {
      this.worldChanged = true;
      // (Signed: the words hold a box in voxels.)
      for (let c = 0; c < 3; c++) {
        cb[c] = Math.min(cb[c], d[at + DELTA.BOX + c] | 0);
        cb[c + 3] = Math.max(cb[c + 3], d[at + DELTA.BOX + c + 3] | 0);
      }
      // The boxes the changes were in, each put where it is nearest among
      // what the deltas before this one said.
      const w = at + DELTA.LEN + nRows * 2 + nSegs * DELTA_SEG + nTouched + nReached * 2;
      for (let i = 0; i < nBoxes; i++) this._noteWorld(d[w + i * 6] | 0, d[w + i * 6 + 1] | 0, d[w + i * 6 + 2] | 0, d[w + i * 6 + 3] | 0, d[w + i * 6 + 4] | 0, d[w + i * 6 + 5] | 0);
    }
    if (flags & 2) this.bodiesChanged = true;
    this.worldQuads = d[at + DELTA.WORLD_QUADS];
    this.bodyQuads = d[at + DELTA.BODY_QUADS];
    this.segmentsRead += d[at + DELTA.SEGMENTS_READ];
    this.slotsChanged += d[at + DELTA.SLOTS_CHANGED];
    const rowAt = at + DELTA.LEN, segAt = rowAt + nRows * 2, touchedAt = segAt + nSegs * DELTA_SEG, reachedAt = touchedAt + nTouched;
    // The segments' books.
    const mask = this.mask, sg = this.seg, sb = this.segBox, bb = this.bodyBox;
    for (let i = 0, w = segAt; i < nSegs; i++, w += DELTA_SEG) {
      const s = d[w], o = s * S_LEN, b = s * 6, a1 = d[w + 1], a2 = d[w + 2];
      mask[s] = a1 & 0xffff;
      sg[o + S_FIRST] = (a1 >>> 16) & 255; sg[o + S_LAST] = a1 >>> 24;
      sg[o + S_WORLD] = a2 & 255; sg[o + S_GLASS] = (a2 >>> 8) & 255; sg[o + S_BODY] = (a2 >>> 16) & 255;
      this.bodyFace[s] = a2 >>> 24;
      this.segBody[s] = d[w + 3] & 0xffff;
      sg[o + S_H0] = (d[w + 3] >>> 16) & 255; sg[o + S_H1] = d[w + 3] >>> 24;
      const dr = this.dirs, dq = s * 6;
      dr[dq] = d[w + 10]; dr[dq + 1] = d[w + 10] >>> 16; dr[dq + 2] = d[w + 11]; dr[dq + 3] = d[w + 11] >>> 16; dr[dq + 4] = d[w + 12]; dr[dq + 5] = d[w + 12] >>> 16;
      sb[b] = d[w + 4] & 0xffff; sb[b + 1] = d[w + 4] >>> 16; sb[b + 2] = d[w + 5] & 0xffff; sb[b + 3] = d[w + 5] >>> 16; sb[b + 4] = d[w + 6] & 0xffff; sb[b + 5] = d[w + 6] >>> 16;
      bb[b] = d[w + 7] & 0xffff; bb[b + 1] = d[w + 7] >>> 16; bb[b + 2] = d[w + 8] & 0xffff; bb[b + 3] = d[w + 8] >>> 16; bb[b + 4] = d[w + 9] & 0xffff; bb[b + 5] = d[w + 9] >>> 16;
    }
    // The rows: their changed slots into the mirror and up to the texture,
    // their bounds and kinds, their lamps. (The delta names its rows in the
    // order the frame's runs hold them.)
    const u32 = frame.u32, m = this.mirror, box = this.box, runs = frame.runs;
    // (The run that holds a row: looked for from where the last one was
    // found, since the delta and the frame both go up through the rows.)
    let run = 0;
    for (let i = 0; i < nRows; i++) {
      const r = d[rowAt + i * 2], a = d[rowAt + i * 2 + 1], lo = (a & 255) * SEG, hi = ((a >>> 8) & 255) * SEG;
      if (!mirror) {
        let tries = 0;
        while (tries < runs && !(r >= frame.runStart(run) && r < frame.runStart(run) + frame.runRows(run))) { run = (run + 1) % runs; tries++; }
        if (tries >= runs) throw new Error(`quad delta: row ${r} is in none of the frame's ${runs} runs`);
        const p = frame.runWords(run) + (r - frame.runStart(run)) * ROW_WORDS;
        m.set(u32.subarray(p + lo * 2, p + hi * 2), r * ROW_WORDS + lo * 2);
      }
      if (r >= this.top) this.top = r + 1;
      if (upload) upload(r, lo, hi - lo);
      const b = r * 6;
      box[b] = box[b + 1] = box[b + 2] = 1024;
      box[b + 3] = box[b + 4] = box[b + 5] = 0;
      let kinds = 0;
      for (let s = 0, k = r * SEGS * 6; s < SEGS; s++, k += 6) {
        kinds |= mask[r * SEGS + s];
        if (!(mask[r * SEGS + s] & (M_WORLD | M_WORLD_GLASS))) continue;
        for (let c = 0; c < 3; c++) {
          if (sb[k + c] < box[b + c]) box[b + c] = sb[k + c];
          if (sb[k + c + 3] > box[b + c + 3]) box[b + c + 3] = sb[k + c + 3];
        }
      }
      this.rowMask[r] = kinds;
      if (a & (1 << 16)) this._collectLamps(r);
    }
    // What the lists keep of a changed segment beside its record, read
    // out of its words (in the mirror by now). Whether its heap quads lie
    // apart: a heap range from the first quad to the last says so, or
    // that every quad is a heap's, and the words say which. And which of
    // its slots hold glass.
    const heap = this.heap, lut = this.lut, apart = this.apart, gb = this.glassBits;
    for (let i = 0, w = segAt; i < nSegs; i++, w += DELTA_SEG) {
      const s = d[w], o = s * S_LEN, k = mask[s], go = s * (SEG >> 5);
      const heaps = (k & M_HEAP) !== 0 && sg[o + S_H0] === sg[o + S_FIRST] && sg[o + S_H1] === sg[o + S_LAST];
      let other = 0;
      gb[go] = gb[go + 1] = gb[go + 2] = gb[go + 3] = 0;
      if (heaps || (k & M_GLASS)) {
        for (let j = sg[o + S_FIRST], e = sg[o + S_LAST], q = s * SEG * 2 + 1 + j * 2; j <= e; j++, q += 2) {
          const mat = (m[q] >>> 11) & 255;
          if (mat === 0) continue;
          if (!heap[mat]) other = 1;
          if (lut[mat]) gb[go + (j >> 5)] |= 1 << (j & 31);
        }
      }
      apart[s] = heaps ? other : 0;
    }
    for (let i = 0; i < nTouched; i++) this._touch(d[touchedAt + i]);
    for (let i = 0, w = reachedAt; i < nReached; i++, w += 2) this._reach(d[w] & 0xffff, d[w] >>> 16, d[w + 1] & 0xffff, d[w + 1] >>> 16);
    if (nRows > 0) {
      this._rebuildSets();
      this.orderCam[0] = NaN; // row bounds changed
    }
    if (this.bodyQuads > 0 || this.roll > 0) this._rollExtents();
  }

  // Runs the row sync over made-up rows holding every kind of quad, so the
  // browser has optimised it for all of them before the first explosion
  // fills the buffer with body quads. Without this the first frames of the
  // first blast each spend several milliseconds here. Leaves no trace.
  // u32/base: the words of every row, as a full frame has them.
  warm(u32, base, passes = 240) {
    const glass = this.lut.indexOf(1), lit = this.emit.findIndex((v) => v > 0);
    const r = this.rows, body = MAX_BODIES - 1;
    this._reserve(r + 1);
    const pack = (x, y, z, face, w, h, mat, b) => [(x | y << 10 | z << 20 | (face & 3) << 30) >>> 0, ((face >> 2) | (w - 1) << 1 | (h - 1) << 6 | mat << 11 | b << 19) >>> 0];
    // Three versions of the row. From one to the next a third of the slots
    // change (to another quad, to empty, from empty) and the rest stay, so
    // every pass takes every path: the browser only learns from what runs
    // before it has optimised, and prunes what it has not seen.
    const rowsOf = [0, 1, 2].map((v) => {
      const u = new Uint32Array(ROW_WORDS);
      for (let i = 0; i < QUAD_TEX_W; i++) {
        const k = (i * 7 + (i % 3 === 0 ? v * 5 : 0)) % 23;
        if (k === 0) continue; // an empty slot
        // Glass and emitters among the world's quads and among the body's.
        const mat = k % 5 === 1 && glass > 0 ? glass : k % 7 === 2 && lit > 0 ? lit : 1 + (i % 9);
        const q = pack((i * 5 + v) % 900, (i * 3) % 500, (i * 11) % 900, i % 6, 1 + (i % 7), 1 + (i % 5), mat, k > 12 ? body : 0);
        u[i * 2] = q[0];
        u[i * 2 + 1] = q[1];
      }
      return u;
    });
    const keep = [this.worldChanged, this.bodiesChanged, this.lampsChanged, this.segmentsRead], touched = this.touchedCount;
    const box = Array.from(this.changedBox), boxes = Array.from(this.changedBoxes), boxN = this.changedBoxN;
    this.rows = r + 1;
    // A frustum that takes in everything, a camera in the middle of it, a
    // sun at an angle: the list builders see every kind of segment too.
    const planes = new Float32Array(20), cam = [300, 200, 300], sun = new Float32Array([0.8, 0, -0.6, 0.3, 0.8, 0.4, 0.5, 0.6, 0.6]);
    for (let i = 0; i < 5; i++) planes[i * 4 + 3] = 1;
    // (Two tiles of four, corner to corner: a grid's sums.)
    const tiles = new Uint16Array([0, 0, 0, 0, 1, 1, 0, 1, 2]), mark = new Uint8Array(MAX_BODIES);
    mark[body] = 1;
    for (let i = 0; i < passes; i++) {
      // As update() starts every frame.
      this._clearChanges();
      // Every eighth pass reads a real row, out of the frame.
      if ((i & 7) === 7 && r > 0) this._syncRow(u32, base + (i % r) * ROW_WORDS, r);
      else this._syncRow(rowsOf[i % 3], 0, r);
      this._rebuildSets();
      this._listVisible(planes, cam);
      this._listWorldIn(sun, -1e4, -1e4, 1e4, 1e4);
      // (Every list a collapse builds: the first one of its kind in play
      // ran unoptimised, 2 to 3 ms for one list in the frame of the first
      // blast. One pass in four is enough for these: each goes through
      // every segment, or every body, by itself.)
      if ((i & 3) === 1) {
        this._listWorldInTiles(sun, tiles, 2, 2, -1e4, -1e4, 1e4);
        this._listBodies((i >> 2) & 1, mark, MAX_BODIES, sun, -1e4, -1e4, 1e4, 1e4);
        this._listBodiesToward(0.5, 0.6, 0.6, 0.1, sun, -1e4, -1e4, 1e4, 1e4);
        this._listGlass(planes);
      }
      if (this.bodyQuads > 0) this._rollExtents();
    }
    this.rows = r;
    this.roll = 0;
    this.orderCam[0] = NaN;
    this.orderRows = 0;
    // Back to an empty row.
    this._syncRow(new Uint32Array(ROW_WORDS), 0, r);
    this._rebuildSets();
    this.lamps.delete(r);
    this.ext.fill(0, body * 3, body * 3 + 3);
    this.next.fill(0, body * 3, body * 3 + 3);
    [this.worldChanged, this.bodiesChanged, this.lampsChanged, this.segmentsRead] = keep;
    // (The made-up body is nobody's: it leaves the list of this update's.)
    this.touchedCount = touched;
    this._touchedAt[body] = 0;
    this.segBody.fill(0, r * SEGS, (r + 1) * SEGS);
    this.changedBox.set(box);
    this.changedBoxes.set(boxes);
    this.changedBoxN = boxN;
  }

  // The segments picked for a list (`n` of them in `pick`, in the order the
  // list is drawn) as spans in `counts` and `offsets`: a segment's used
  // slots, as indices and as a byte offset into an index buffer with 24
  // bytes a slot. Spans that touch in the buffer merge into one, and so do
  // spans with no more than `bridge` bytes of that buffer between them
  // (see `bridge`) where what lies between may be drawn. Adds the opaque
  // quads of the segments to `tq`; returns the number of spans.
  // (One loop over an array for every list: a call a segment into a
  // method that kept its count in the object cost as much as the test
  // that picked the segment.)
  // part: PART_WHOLE the segments' quads from first to last; PART_HEAP of
  // each (a segment with heap quads) the range they lie in; PART_PLAIN the
  // segments' quads outside that range, before it and after (a segment
  // with no heap quad: all of it). Of a segment whose heap quads do not
  // lie together (`apart`), PART_HEAP is each run of heap quads and
  // PART_PLAIN each run of the others: the heap program draws heap quads
  // and no other, wherever the meshes fell in the rows. A gap is bridged
  // only where it holds no quad the list must leave out: none of a segment
  // between, and not a part of the segment before the gap or after it.
  // PART_GLASS: of each segment its glass quads, run by run.
  // can: for each picked segment the directions that can face the eye
  // (`_listVisible`); of such a segment's parts only the groups that hold
  // a quad of one of them are taken (`dirs`). Not with a bridge.
  // canAll: the same for a list whose directions are one set for every
  // segment (the sun's casters: the directions that face the sun), with
  // the groups that hold glass, which casts whichever way it looks.
  _spans(pick, n, counts, offsets, bridge, part = PART_WHOLE, can = null, canAll = -1) {
    const sg = this.seg, mask = this.mask, apart = this.apart, exact = this.exact, dr = this.dirs, parts = this._parts;
    if (bridge !== 0) { can = null; canAll = -1; }
    // (open: the span before ends at its segment's last quad.)
    let k = 0, end = 0, last = 0, q = 0, open = false;
    for (let i = 0; i < n; i++) {
      const at = pick[i], o = at * S_LEN, s0 = sg[o + S_FIRST], s1 = sg[o + S_LAST];
      // The parts of the segment this list takes, and whether it is the
      // list that counts the segment's quads.
      let np = 2, whole = true;
      parts[0] = s0; parts[1] = s1;
      if (part === PART_GLASS) {
        // (Each run of glass quads, off the bits: the lowest slot that
        // holds one, then how many follow it without a gap.)
        np = 0;
        for (let w = 0, g = at * (SEG >> 5); w < SEG >> 5; w++) {
          let bits = this.glassBits[g + w];
          while (bits !== 0) {
            const from = 31 - Math.clz32(bits & -bits), rest = ~(bits >>> from);
            const len = rest === 0 ? 32 - from : Math.min(32 - from, 31 - Math.clz32(rest & -rest));
            parts[np++] = w * 32 + from;
            parts[np++] = w * 32 + from + len - 1;
            bits = from + len >= 32 ? 0 : (bits >>> (from + len)) << (from + len);
          }
        }
      } else if (part !== PART_WHOLE && (mask[at] & M_HEAP)) {
        whole = part === PART_HEAP;
        if (apart[at] && exact) np = this._partsApart(at, whole);
        else if (whole) { parts[0] = sg[o + S_H0]; parts[1] = sg[o + S_H1]; } else {
          // Before the heap range, after it, or both.
          const h0 = sg[o + S_H0], h1 = sg[o + S_H1];
          np = 0;
          if (h0 > s0) { parts[0] = s0; parts[1] = h0 - 1; np = 2; }
          if (h1 < s1) { parts[np] = h1 + 1; parts[np + 1] = s1; np += 2; }
        }
      }
      // Of the parts, what lies in the groups that hold a quad of a
      // direction that can face the eye (all of them: the parts as they
      // are).
      let groups = ALL_GROUPS;
      const c = can !== null ? can[i] : canAll;
      if (c >= 0 && c !== 0x40) {
        const dq = at * 6;
        groups = (c & 1 ? dr[dq] : 0) | (c & 2 ? dr[dq + 1] : 0) | (c & 4 ? dr[dq + 2] : 0) | (c & 8 ? dr[dq + 3] : 0) | (c & 16 ? dr[dq + 4] : 0) | (c & 32 ? dr[dq + 5] : 0);
        if (canAll >= 0 && (mask[at] & M_GLASS)) groups |= this._glassGroups(at);
      }
      for (let j = 0; j < np; j += 2) {
        const p0 = parts[j], p1 = parts[j + 1];
        // (-1: the part whole. Else the groups it reaches into, as bits,
        // taken a run of them at a time.)
        let bits = groups === ALL_GROUPS ? -1 : groups & ((2 << (p1 >> 3)) - 1) & ~((1 << (p0 >> 3)) - 1);
        while (bits !== 0) {
          let first = p0, to = p1;
          if (bits === -1) bits = 0;
          else {
            const g = 31 - Math.clz32(bits & -bits), rest = ~(bits >>> g), e = g + 31 - Math.clz32(rest & -rest);
            if (g << 3 > first) first = g << 3;
            if ((e << 3) - 1 < to) to = (e << 3) - 1;
            bits = (bits >>> e) << e;
          }
          const off = (at * SEG + first) * 24, count = (to - first + 1) * 6;
          const gap = off - end;
          // (A span that does not begin at its segment's first quad has a
          // part of the segment that is not this list's before it.)
          if (k > 0 && (gap === 0 || (gap > 0 && gap <= bridge && open && first === s0 && last !== at && this._clear(last + 1, at)))) {
            counts[k - 1] += count + gap / 4;
          } else {
            offsets[k] = off;
            counts[k++] = count;
          }
          end = off + count * 4;
          last = at;
          open = to === s1;
        }
      }
      // (A segment in parts is counted by the list that draws its heap.)
      if (whole) q += sg[o + S_WORLD] + sg[o + S_BODY] - sg[o + S_GLASS];
    }
    this.tq += q;
    return k;
  }

  // The groups of segment `at` that hold a glass quad, a bit a group.
  _glassGroups(at) {
    const gb = this.glassBits;
    let groups = 0;
    for (let w = 0, g = at * (SEG >> 5); w < SEG >> 5; w++) {
      const bits = gb[g + w];
      if (bits === 0) continue;
      groups |= ((bits & 0xff ? 1 : 0) | (bits & 0xff00 ? 2 : 0) | (bits & 0xff0000 ? 4 : 0) | (bits >>> 24 ? 8 : 0)) << (w * 4);
    }
    return groups;
  }

  // The parts of segment `at`, whose heap quads do not lie together, that
  // are heap quads (`heaps`) or that are the others: first and last slot
  // of each into `_parts`; returns how many numbers that is. Read out of
  // the mirror: a part runs from a quad of its kind to the last one before
  // a quad of the other kind (the empty slots between two of a kind are
  // drawn with them, and draw nothing).
  _partsApart(at, heaps) {
    const m = this.mirror, heap = this.heap, parts = this._parts, o = at * S_LEN, p = at * SEG * 2 + 1;
    let n = 0, from = -1, to = -1;
    for (let i = this.seg[o + S_FIRST], e = this.seg[o + S_LAST]; i <= e; i++) {
      const mat = (m[p + i * 2] >>> 11) & 255;
      if (mat === 0) continue;
      if ((heap[mat] !== 0) === heaps) { if (from < 0) from = i; to = i; }
      else if (from >= 0) { parts[n++] = from; parts[n++] = to; from = -1; }
    }
    if (from >= 0) { parts[n++] = from; parts[n++] = to; }
    return n;
  }

  // May the segments [from, to) be drawn by the list being built although
  // it did not ask for them? Not where they hold what the list must leave
  // out (`this._keepOut`, a mask of kinds).
  _clear(from, to) {
    const mask = this.mask, out = this._keepOut;
    for (let at = from; at < to; at++) if (mask[at] & out) return false;
    return true;
  }

  // A list of spans (counts[i] indices from byte offsets[i] of an index
  // buffer with 24 bytes a slot, as the lists are built and checked) cut
  // into runs of up to RUN slots, in the same order, into `out`. Returns
  // the number of runs.
  // `per`: runs of up to this many slots (RUN at most).
  static runs(counts, offsets, n, out, per = RUN) {
    let k = 0;
    for (let i = 0; i < n; i++) {
      let first = (offsets[i] / 24) | 0, left = (counts[i] / 6) | 0;
      for (; left > per; left -= per, first += per) out[k++] = first | ((per - 1) << RUN_AT);
      if (left > 0) out[k++] = first | ((left - 1) << RUN_AT);
    }
    return k;
  }

  // Draws a list of spans: one instanced draw call whatever their number.
  // The same quads in the same order as a draw call per span. Returns
  // where the runs went (for _again).
  // `per`: the slots an instance draws (RUN unless given). An instance
  // costs the vertex stage that many quads however short its run is, so a
  // list of short runs far apart (the glass: a pane here, a pane there)
  // is drawn with few slots an instance and a list of long spans with RUN.
  _submit(counts, offsets, n, keep = null, per = RUN) {
    if (!n) { if (keep) { keep.n = 0; keep.age = this.runAge; } return; }
    const gl = this.gl;
    // (What every list has asked of the GPU since the renderer last looked.)
    let sum = 0;
    for (let i = 0; i < n; i++) sum += counts[i];
    this.indices += sum;
    this.spans += n;
    // At most a run per span more than whole runs of its slots.
    const most = Math.ceil(sum / (6 * per)) + n;
    if (most > this._runs.length) this._runs = new Uint32Array(Math.max(most, this._runs.length * 2));
    const k = QuadLists.runs(counts, offsets, n, this._runs, per);
    this._send(this._runs, k, keep, per, sum, n);
  }

  // `k` run words into the buffer and one instanced draw of them (`sum`
  // indices, `n` spans, for the keep).
  _send(words, k, keep, per, sum, n) {
    const gl = this.gl;
    this.state.vao(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.runBuf);
    if (this.runAt + k > this.runCap) {
      while (k > this.runCap) this.runCap *= 2;
      gl.bufferData(gl.ARRAY_BUFFER, this.runCap * 4, gl.STREAM_DRAW);
      this.runAt = 0;
      this.runAge++;
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, this.runAt * 4, words, 0, k);
    gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, this.runAt * 4);
    gl.drawElementsInstanced(gl.TRIANGLES, per * 6, gl.UNSIGNED_SHORT, 0, k);
    if (keep) { keep.at = this.runAt; keep.n = k; keep.age = this.runAge; keep.indices = sum; keep.spans = n; keep.per = per; }
    this.runAt += k;
  }

  // Draws once more the list whose runs `keep` says are in the buffer.
  // False when they are no longer there.
  _again(keep) {
    if (keep.age !== this.runAge) return false;
    if (!keep.n) return true;
    const gl = this.gl;
    this.indices += keep.indices;
    this.spans += keep.spans;
    this.state.vao(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.runBuf);
    gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, keep.at * 4);
    gl.drawElementsInstanced(gl.TRIANGLES, (keep.per || RUN) * 6, gl.UNSIGNED_SHORT, 0, keep.n);
    return true;
  }

  // Re-sorts the rows by distance from the camera to their bounds. Called
  // when the camera has moved a couple of metres or the bounds changed; the
  // previous order is nearly right, so an insertion sort is cheap.
  _sortRows(cam) {
    const rows = this.rows, order = this.order, key = this.orderKey, box = this.box;
    if (this.orderRows !== rows) {
      for (let r = 0; r < rows; r++) order[r] = r;
      this.orderRows = rows;
    }
    for (let r = 0; r < rows; r++) {
      const b = r * 6;
      const dx = Math.max(box[b] - cam[0], 0, cam[0] - box[b + 3]), dy = Math.max(box[b + 1] - cam[1], 0, cam[1] - box[b + 4]), dz = Math.max(box[b + 2] - cam[2], 0, cam[2] - box[b + 5]);
      key[r] = dx * dx + dy * dy + dz * dz;
    }
    for (let i = 1; i < rows; i++) {
      const r = order[i], k = key[r];
      let j = i - 1;
      // Rows at the same distance go by index: which of two coplanar quads
      // wins a pixel must not depend on the order the rows were sorted in before.
      for (; j >= 0 && (key[order[j]] > k || (key[order[j]] === k && order[j] > r)); j--) order[j + 1] = order[j];
      order[j + 1] = r;
    }
    this.orderCam[0] = cam[0]; this.orderCam[1] = cam[1]; this.orderCam[2] = cam[2];
  }

  // Opaque scene geometry: segments with world quads that touch the view
  // frustum and can face the camera, plus every segment with body quads.
  // planes: five (nx, ny, nz, d) with n.p + d >= 0 inside; cam: camera
  // position; both in voxels. Returns the number of opaque quads in the
  // segments submitted.
  // Segments with a heap material (M_HEAP) are listed apart: drawHeap
  // submits those, for the program that draws heaps.
  drawVisible(planes, cam) {
    // The list of the frame before, where nothing it was made of has
    // changed and its runs are still in the buffer: drawn again, not cut
    // again. (Its spans may be gone from tc/to: `_viewStale`.)
    // (`_seenOf`: the runs in the buffer are those of the last listing,
    // not of one before a list made for a look and never drawn.)
    if (this.keep && this._seenOf === this._listed && this._viewSame(planes, cam) && this._again(this._seen)) {
      this._viewStale = true;
      return this._viewQuads;
    }
    this._listVisible(planes, cam);
    this._submit(this.tc, this.to, this.tn, this._seen, this.byDir ? this.viewPer : RUN);
    this._seenOf = this._listed;
    this._viewQuads = this.tq;
    return this.tq;
  }

  // Is the scene's list as last made (by anyone: `_listVisible` notes what
  // it lists for) the list for this frustum and eye? (An eye at NaN is
  // never the same: listed.)
  _viewSame(planes, cam) {
    const v = this._viewFor;
    let same = v[23] === this.changed && v[24] === this._viewFlags() && v[25] === this.rows && v[20] === cam[0] && v[21] === cam[1] && v[22] === cam[2];
    for (let i = 0; i < 20 && same; i++) same = v[i] === planes[i];
    return same;
  }

  _viewFlags() {
    return (this.split ? 1 : 0) | (this.byDir ? 2 : 0) | (this.exact ? 4 : 0) | (this.cullBodies ? 8 : 0) | (this.xf !== null ? 16 : 0);
  }

  // The visible segments with a heap material, as drawVisible listed them.
  // Returns how many spans there were.
  drawHeap() {
    if (!this._again(this._seenHeap)) this._submit(this.hc, this.ho, this.hn, this._seenHeap, this.byDir ? this.viewPer : RUN);
    return this.hn;
  }

  // Of those, the segments that hold foliage, each as the heap list has it
  // (the same spans, in the same order): for the pass that lays leaves
  // again where they were drawn, which takes every other quad out in its
  // vertex stage. (It drew the whole heap list for that: in a town that
  // has been through a few blasts, more slots than the plain list, nearly
  // all of them rubble.) Returns how many spans there were.
  drawLeaves() {
    if (!this._again(this._seenLeaf)) this._submit(this.lc, this.lo, this.ln, this._seenLeaf, this.byDir ? this.viewPer : RUN);
    return this.ln;
  }

  _listVisible(planes, cam) {
    // (What the list is made for, for the frame after: drawVisible.)
    const vf = this._viewFor;
    if (vf !== planes) {
      for (let i = 0; i < 20; i++) vf[i] = planes[i];
      vf[20] = cam[0]; vf[21] = cam[1]; vf[22] = cam[2];
    }
    vf[23] = this.changed; vf[24] = this._viewFlags(); vf[25] = this.rows;
    this._listed++;
    const mask = this.mask, sb = this.segBox, oc = this.orderCam, order = this.order;
    const moved = Math.abs(cam[0] - oc[0]) + Math.abs(cam[1] - oc[1]) + Math.abs(cam[2] - oc[2]);
    if (!(moved < 20) || this.orderRows !== this.rows) this._sortRows(cam);
    const pick = this._pick, heap = this._pickHeap, can = this._can, canHeap = this._canHeap, leaf = this._pickLeaf, canLeaf = this._canLeaf;
    let np = 0, nh = 0, nl = 0, na = 0, bodySegments = 0, bodyCulled = 0;
    const cx = cam[0], cy = cam[1], cz = cam[2];
    const cull = this.cullBodies && this.xf !== null, norm = this._norm;
    for (let p = 0; p < 5; p++) norm[p] = Math.hypot(planes[p * 4], planes[p * 4 + 1], planes[p * 4 + 2]);
    this._stamp++;
    const rowMask = this.rowMask, box = this.box;
    for (let i = 0; i < this.rows; i++) {
      const r = order[i], rm = rowMask[r];
      if (!(rm & (M_WORLD | M_BODY))) continue;
      // A row of world quads only is first held against the frustum as a
      // whole (its box holds every segment's): outside one plane, none of
      // its sixteen segments is looked at; inside all five, none of them
      // needs the test again. (Rows are filled chunk by chunk, so a row
      // is a place, and most rows are wholly one or the other.)
      let whole = false;
      const b = r * 6;
      // The directions a face of this row is certainly seen from where the
      // viewer is: those whose side of the row's whole box the viewer is
      // on. A segment holding one of them needs no look at its own box.
      const sure = (cx < box[b] ? 1 : 0) | (cx > box[b + 3] ? 2 : 0) | (cy < box[b + 1] ? 4 : 0) | (cy > box[b + 4] ? 8 : 0)
        | (cz < box[b + 2] ? 16 : 0) | (cz > box[b + 5] ? 32 : 0);
      if (!(rm & M_BODY)) {
        let out = false;
        whole = true;
        for (let p = 0; p < 20 && !out; p += 4) {
          const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2], d = planes[p + 3];
          if (nx * box[nx > 0 ? b + 3 : b] + ny * box[ny > 0 ? b + 4 : b + 1] + nz * box[nz > 0 ? b + 5 : b + 2] + d < 0) out = true;
          else if (!(nx * box[nx > 0 ? b : b + 3] + ny * box[ny > 0 ? b + 1 : b + 4] + nz * box[nz > 0 ? b + 2 : b + 5] + d >= 0)) whole = false;
        }
        if (out) continue;
      }
      for (let s = 0, at = r * SEGS, k = at * 6; s < SEGS; s++, at++, k += 6) {
        const m = mask[at];
        if (!(m & (M_WORLD | M_BODY))) continue;
        if (m & M_BODY) {
          bodySegments++;
          if (cull && !this._bodySeen(at, planes, cx, cy, cz)) { bodyCulled++; continue; }
        } else if (whole) {
          if (!(m & sure) && !((m & 1 && !(cx >= sb[k + 3])) || (m & 2 && !(cx <= sb[k])) || (m & 4 && !(cy >= sb[k + 4])) || (m & 8 && !(cy <= sb[k + 1]))
            || (m & 16 && !(cz >= sb[k + 5])) || (m & 32 && !(cz <= sb[k + 2])))) continue;
        } else {
          // A face is seen only from the open side of its plane: keep the
          // segment if any direction it holds can be.
          // (Written so that a camera at NaN, which a caller may pass to
          // switch this test off, sees everything.)
          if (!(m & sure) && !((m & 1 && !(cx >= sb[k + 3])) || (m & 2 && !(cx <= sb[k])) || (m & 4 && !(cy >= sb[k + 4])) || (m & 8 && !(cy <= sb[k + 1]))
            || (m & 16 && !(cz >= sb[k + 5])) || (m & 32 && !(cz <= sb[k + 2])))) continue;
          let inside = true;
          for (let p = 0; p < 20; p += 4) {
            const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2];
            // The box corner furthest along the plane normal decides.
            if (nx * sb[nx > 0 ? k + 3 : k] + ny * sb[ny > 0 ? k + 4 : k + 1] + nz * sb[nz > 0 ? k + 5 : k + 2] + planes[p + 3] < 0) { inside = false; break; }
          }
          if (!inside) continue;
        }
        // (A segment with heap quads is in both lists: its heap range for
        // the heap program, what lies outside it for the plain one.)
        // The directions that can face the eye by this segment's box
        // (as the tests above have them, so that an eye at NaN sees all).
        const c = m & M_BODY ? 0x40 : (!(cx >= sb[k + 3]) ? 1 : 0) | (!(cx <= sb[k]) ? 2 : 0) | (!(cy >= sb[k + 4]) ? 4 : 0) | (!(cy <= sb[k + 1]) ? 8 : 0)
          | (!(cz >= sb[k + 5]) ? 16 : 0) | (!(cz <= sb[k + 2]) ? 32 : 0);
        if (m & M_HEAP) {
          canHeap[nh] = c; heap[nh++] = at; na += this.apart[at];
          if (m & M_LEAF) { canLeaf[nl] = c; leaf[nl++] = at; }
        }
        if (!(m & M_HEAP) || this.split) { can[np] = c; pick[np++] = at; }
      }
    }
    // (Room for the spans: one a segment, two of the plain list's for a
    // segment drawn in two parts, and of one whose heap quads lie apart as
    // many as its quads could make.)
    // (And of a segment taken by direction, as many as half its groups.)
    const more = na * (SEG >> 1), by = this.byDir ? GROUPS >> 1 : 1;
    if ((np + nh) * by + more > this.tc.length) { this.tc = new Int32Array(((np + nh) * by + more) * 2); this.to = new Int32Array(this.tc.length); }
    if (nh * by + more > this.hc.length) { this.hc = new Int32Array((nh * by + more) * 2); this.ho = new Int32Array(this.hc.length); }
    if (nl > 0 && this.lc.length < this.hc.length) { this.lc = new Int32Array(this.hc.length); this.lo = new Int32Array(this.hc.length); }
    this.bodySegments = bodySegments;
    this.bodyCulled = bodyCulled;
    this.tq = 0;
    // (A bridged gap may not hold a heap segment: the heap program draws
    // those, and drawn here first they would win the depth test. No
    // bridging between heap segments: what lies between two of them
    // belongs to the other program.)
    this._keepOut = M_HEAP;
    this.tn = this._spans(pick, np, this.tc, this.to, this.bridge * 24, this.split ? PART_PLAIN : PART_WHOLE, this.byDir ? can : null);
    this.hn = this._spans(heap, nh, this.hc, this.ho, 0, this.split ? PART_HEAP : PART_WHOLE, this.byDir ? canHeap : null);
    // (The spans' quads are counted for the plain and the heap list only.)
    const tq = this.tq;
    this.ln = this._spans(leaf, nl, this.lc, this.lo, 0, this.split ? PART_HEAP : PART_WHOLE, this.byDir ? canLeaf : null);
    this.tq = tq;
    this._seenLeaf.age = -1;
    this._viewStale = false;
    this._seenHeap.age = -1;
  }

  // Could a body quad of segment `at` be on screen: inside the frustum
  // `planes` and turned toward the viewer at (cx, cy, cz), all in world
  // voxels? A body's quads lie in the body's own frame, so the viewer is
  // taken there (once per body per list) and the segment's faces are tested
  // against its box as the world's are; its place in the world is a sphere
  // around that box. True when it cannot be told (several bodies in the
  // segment, no transform, a viewer at NaN).
  _bodySeen(at, planes, cx, cy, cz) {
    const body = this.segBody[at];
    if (body === MIXED || body === 0) return true;
    const f = this.xf, o = body * XF, k = at * 6, bb = this.bodyBox;
    const qx = f[o], qy = f[o + 1], qz = f[o + 2], qw = f[o + 3];
    // (Scale: body voxels to world voxels.)
    const sc = f[o + 7] / VOXEL, ox = f[o + 4] / VOXEL, oy = f[o + 5] / VOXEL, oz = f[o + 6] / VOXEL;
    if (!(sc > 0)) return true;
    const L = this._local, l = body * 3;
    if (this._localAt[body] !== this._stamp) {
      this._localAt[body] = this._stamp;
      // The viewer, turned back by the body's rotation.
      const vx = cx - ox, vy = cy - oy, vz = cz - oz;
      const tx = 2 * (vy * qz - vz * qy), ty = 2 * (vz * qx - vx * qz), tz = 2 * (vx * qy - vy * qx);
      L[l] = (vx + qw * tx + (ty * qz - tz * qy)) / sc;
      L[l + 1] = (vy + qw * ty + (tz * qx - tx * qz)) / sc;
      L[l + 2] = (vz + qw * tz + (tx * qy - ty * qx)) / sc;
    }
    const lx = L[l], ly = L[l + 1], lz = L[l + 2], m = this.bodyFace[at];
    // (As for the world's segments: a face is seen from the open side of
    // its plane, and a viewer at NaN sees everything.)
    if (!((m & 1 && !(lx >= bb[k + 3])) || (m & 2 && !(lx <= bb[k])) || (m & 4 && !(ly >= bb[k + 4])) || (m & 8 && !(ly <= bb[k + 1]))
      || (m & 16 && !(lz >= bb[k + 5])) || (m & 32 && !(lz <= bb[k + 2])))) return false;
    // The box's centre in the world, and a sphere around the box there (a
    // voxel to spare: quads are grown by half a pixel).
    const ax = (bb[k] + bb[k + 3]) * 0.5 * sc, ay = (bb[k + 1] + bb[k + 4]) * 0.5 * sc, az = (bb[k + 2] + bb[k + 5]) * 0.5 * sc;
    const tx = 2 * (qy * az - qz * ay), ty = 2 * (qz * ax - qx * az), tz = 2 * (qx * ay - qy * ax);
    const wx = ox + ax + qw * tx + (qy * tz - qz * ty), wy = oy + ay + qw * ty + (qz * tx - qx * tz), wz = oz + az + qw * tz + (qx * ty - qy * tx);
    const rad = 0.5 * Math.hypot(bb[k + 3] - bb[k], bb[k + 4] - bb[k + 1], bb[k + 5] - bb[k + 2]) * sc + 1;
    const norm = this._norm;
    for (let p = 0; p < 5; p++) {
      if (planes[p * 4] * wx + planes[p * 4 + 1] * wy + planes[p * 4 + 2] * wz + planes[p * 4 + 3] < -rad * norm[p]) return false;
    }
    return true;
  }

  // Submits the list drawVisible built once more (depth pre-pass, then colour).
  redrawVisible() {
    if (this._again(this._seen)) return;
    // (The runs are gone from the buffer. And the spans from tc/to, where
    // another list has been built since: listed again for the view kept.)
    if (this._viewStale) this._listVisible(this._viewFor, this._viewFor.subarray(20, 23));
    this._submit(this.tc, this.to, this.tn, this._seen, this.byDir ? this.viewPer : RUN);
    this._seenOf = this._listed;
  }

  // Projection of a box (six values at t[k]) onto a light-space axis lies
  // outside [lo, hi]?
  _misses(t, k, ax, ay, az, lo, hi) {
    const a = ax * t[ax > 0 ? k : k + 3] + ay * t[ay > 0 ? k + 1 : k + 4] + az * t[az > 0 ? k + 2 : k + 5];
    const b = ax * t[ax > 0 ? k + 3 : k] + ay * t[ay > 0 ? k + 4 : k + 1] + az * t[az > 0 ? k + 5 : k + 2];
    return b < lo || a > hi;
  }

  // Static shadow casters: segments with world quads that can face the sun
  // (or with world glass) whose bounds project into a light-space rectangle.
  // b: light basis (right in 0..2, up in 3..5, toward the sun in 6..8);
  // rectangle in voxels.
  drawWorldIn(b, x0, y0, x1, y1) {
    this._listWorldIn(b, x0, y0, x1, y1);
    this._submit(this.tc, this.to, this.tn, null, this.byDir ? this.casterPer : RUN);
    return this.tq;
  }

  _listWorldIn(b, x0, y0, x1, y1) {
    this._viewStale = true;
    const mask = this.mask, sb = this.segBox;
    // Faces turned away from the sun are back faces in the depth pass.
    let lit = M_WORLD_GLASS;
    for (let f = 0; f < 6; f++) if ((f & 1 ? b[6 + (f >> 1)] : -b[6 + (f >> 1)]) > 0) lit |= 1 << f;
    const pick = this._pick;
    let np = 0;
    for (let at = 0, n = this.rows * SEGS, k = 0; at < n; at++, k += 6) {
      if (!(mask[at] & lit)) continue;
      if (this._misses(sb, k, b[0], b[1], b[2], x0, x1) || this._misses(sb, k, b[3], b[4], b[5], y0, y1)) continue;
      pick[np++] = at;
    }
    this.tq = 0;
    this._keepOut = 0;
    // (Of a segment, the groups that hold a face toward the sun, or glass.)
    if (this.byDir && np * (GROUPS >> 1) > this.tc.length) { this.tc = new Int32Array(np * GROUPS); this.to = new Int32Array(this.tc.length); }
    this.tn = this._spans(pick, np, this.tc, this.to, this.bridge * 24, PART_WHOLE, null, this.byDir ? lit & M_WORLD : -1);
  }

  // The same for a rectangle of which only some tiles are being redrawn:
  // the segments whose bounds project into one of those, each listed
  // once. The tiles are
  // squares of `tv` voxels, `w` by `h` of them from (X0, Y0) along the
  // light's two axes; `sum` holds, for every corner of that grid (w + 1 a
  // row), how many of the tiles below and left of it are being redrawn. (A
  // caster is taken a twentieth of a voxel larger each way: more than the
  // depth pass grows its quads by.)
  drawWorldInTiles(b, sum, w, h, X0, Y0, tv) {
    this._listWorldInTiles(b, sum, w, h, X0, Y0, tv);
    this._submit(this.tc, this.to, this.tn, null, this.byDir ? this.casterPer : RUN);
    return this.tq;
  }

  _listWorldInTiles(b, sum, w, h, X0, Y0, tv) {
    this._viewStale = true;
    const mask = this.mask, t = this.segBox;
    let lit = M_WORLD_GLASS;
    for (let f = 0; f < 6; f++) if ((f & 1 ? b[6 + (f >> 1)] : -b[6 + (f >> 1)]) > 0) lit |= 1 << f;
    const ax = b[0], ay = b[1], az = b[2], cx = b[3], cy = b[4], cz = b[5];
    const pick = this._pick, n = w + 1, per = 1 / tv, ux0 = X0 - 0.05, uy0 = Y0 - 0.05, ux1 = X0 + w * tv + 0.05, uy1 = Y0 + h * tv + 0.05;
    let np = 0;
    for (let at = 0, end = this.rows * SEGS, k = 0; at < end; at++, k += 6) {
      if (!(mask[at] & lit)) continue;
      // The box's extent along the two axes (as _misses takes it).
      const a0 = ax * t[ax > 0 ? k : k + 3] + ay * t[ay > 0 ? k + 1 : k + 4] + az * t[az > 0 ? k + 2 : k + 5];
      const a1 = ax * t[ax > 0 ? k + 3 : k] + ay * t[ay > 0 ? k + 4 : k + 1] + az * t[az > 0 ? k + 5 : k + 2];
      if (a1 < ux0 || a0 > ux1) continue;
      const c0 = cx * t[cx > 0 ? k : k + 3] + cy * t[cy > 0 ? k + 1 : k + 4] + cz * t[cz > 0 ? k + 2 : k + 5];
      const c1 = cx * t[cx > 0 ? k + 3 : k] + cy * t[cy > 0 ? k + 4 : k + 1] + cz * t[cz > 0 ? k + 5 : k + 2];
      if (c1 < uy0 || c0 > uy1) continue;
      // The tiles it reaches into, and whether any of them is one.
      let i0 = Math.floor((a0 - 0.05 - X0) * per), i1 = Math.floor((a1 + 0.05 - X0) * per);
      let j0 = Math.floor((c0 - 0.05 - Y0) * per), j1 = Math.floor((c1 + 0.05 - Y0) * per);
      if (i0 < 0) i0 = 0;
      if (j0 < 0) j0 = 0;
      if (i1 >= w) i1 = w - 1;
      if (j1 >= h) j1 = h - 1;
      if (sum[(j1 + 1) * n + i1 + 1] - sum[j0 * n + i1 + 1] - sum[(j1 + 1) * n + i0] + sum[j0 * n + i0] > 0) pick[np++] = at;
    }
    this.tq = 0;
    this._keepOut = 0;
    if (this.byDir && np * (GROUPS >> 1) > this.tc.length) { this.tc = new Int32Array(np * GROUPS); this.to = new Int32Array(this.tc.length); }
    this.tn = this._spans(pick, np, this.tc, this.to, this.bridge * 24, PART_WHOLE, null, this.byDir ? lit & M_WORLD : -1);
  }

  // Body quads for a pass that looks at the scene along one direction from
  // far away (the sun's depth pass, the contact map from below): segments
  // holding a face turned toward (dx, dy, dz), a unit vector from the scene
  // to the viewer (a face may be turned away by the cosine `slack` and
  // still count), whose bounds project into the rectangle [x0, x1] x
  // [y0, y1] on the axes b[0..2] and b[3..5], in voxels. Segments that
  // cannot be told are drawn. Returns the quads in the segments submitted.
  drawBodiesToward(dx, dy, dz, slack, b, x0, y0, x1, y1) {
    this._listBodiesToward(dx, dy, dz, slack, b, x0, y0, x1, y1);
    this._submit(this.tc, this.to, this.tn);
    return this.tq;
  }

  _listBodiesToward(dx, dy, dz, slack, b, x0, y0, x1, y1) {
    this._viewStale = true;
    const mask = this.mask, who = this.segBody, bb = this.bodyBox, faces = this.bodyFace, f = this.xf;
    const L = this._local, seen = this._localAt, stamp = ++this._stamp;
    const cull = this.cullBodies && f !== null;
    const pick = this._pick;
    let np = 0, bodySegments = 0, bodyCulled = 0;
    for (let at = 0, n = this.rows * SEGS, k = 0; at < n; at++, k += 6) {
      if (!(mask[at] & M_BODIES)) continue;
      bodySegments++;
      const body = who[at], o = body * XF;
      const sc = f === null ? 0 : f[o + 7] / VOXEL;
      if (cull && body !== MIXED && body !== 0 && sc > 0) {
        const qx = f[o], qy = f[o + 1], qz = f[o + 2], qw = f[o + 3], l = body * 3;
        if (seen[body] !== stamp) {
          seen[body] = stamp;
          // The direction, turned back by the body's rotation.
          const tx = 2 * (dy * qz - dz * qy), ty = 2 * (dz * qx - dx * qz), tz = 2 * (dx * qy - dy * qx);
          L[l] = dx + qw * tx + (ty * qz - tz * qy);
          L[l + 1] = dy + qw * ty + (tz * qx - tx * qz);
          L[l + 2] = dz + qw * tz + (tx * qy - ty * qx);
        }
        const lx = L[l], ly = L[l + 1], lz = L[l + 2], m = faces[at];
        if (!((m & 1 && lx < slack) || (m & 2 && lx > -slack) || (m & 4 && ly < slack) || (m & 8 && ly > -slack)
          || (m & 16 && lz < slack) || (m & 32 && lz > -slack))) { bodyCulled++; continue; }
        // The sphere around the segment's box, against the rectangle.
        const ax = (bb[k] + bb[k + 3]) * 0.5 * sc, ay = (bb[k + 1] + bb[k + 4]) * 0.5 * sc, az = (bb[k + 2] + bb[k + 5]) * 0.5 * sc;
        const tx = 2 * (qy * az - qz * ay), ty = 2 * (qz * ax - qx * az), tz = 2 * (qx * ay - qy * ax);
        const wx = f[o + 4] / VOXEL + ax + qw * tx + (qy * tz - qz * ty), wy = f[o + 5] / VOXEL + ay + qw * ty + (qz * tx - qx * tz), wz = f[o + 6] / VOXEL + az + qw * tz + (qx * ty - qy * tx);
        const rad = 0.5 * Math.hypot(bb[k + 3] - bb[k], bb[k + 4] - bb[k + 1], bb[k + 5] - bb[k + 2]) * sc + 1;
        const px = wx * b[0] + wy * b[1] + wz * b[2], py = wx * b[3] + wy * b[4] + wz * b[5];
        if (px + rad < x0 || px - rad > x1 || py + rad < y0 || py - rad > y1) { bodyCulled++; continue; }
      }
      pick[np++] = at;
    }
    this.bodySegments = bodySegments;
    this.bodyCulled = bodyCulled;
    this.tq = 0;
    this._keepOut = 0;
    this.tn = this._spans(pick, np, this.tc, this.to, this.bridge * 24);
  }

  // Body quads for a pass that redraws a rectangle of a map seen along the
  // axes b[0..2] and b[3..5] (voxels): the segments of the bodies marked
  // `want` in `mark` (one byte per body, `count` of them known) whose
  // sphere reaches into [x0, x1] x [y0, y1]. Segments holding several
  // bodies, and bodies without a transform, count as marked 0 and are not
  // tested. Returns the quads in the segments submitted.
  drawBodies(want, mark, count, b, x0, y0, x1, y1) {
    this._listBodies(want, mark, count, b, x0, y0, x1, y1);
    this._submit(this.tc, this.to, this.tn);
    return this.tq;
  }

  _listBodies(want, mark, count, b, x0, y0, x1, y1) {
    this._viewStale = true;
    const who = this.segBody, flag = this._flag, sp = this.sphere, inv = 1 / VOXEL;
    for (let id = 1; id < count; id++) {
      let on = mark[id] === want ? 1 : 0;
      const k = id * 4, rad = sp[k + 3] * inv;
      if (on === 1 && rad > 0) {
        const wx = sp[k] * inv, wy = sp[k + 1] * inv, wz = sp[k + 2] * inv;
        const px = wx * b[0] + wy * b[1] + wz * b[2], py = wx * b[3] + wy * b[4] + wz * b[5];
        if (px + rad < x0 || px - rad > x1 || py + rad < y0 || py - rad > y1) on = 0;
      }
      flag[id] = on;
    }
    const segs = this.bodySegs, pick = this._pick, n = this.bodySegN;
    let np = 0;
    for (let j = 0; j < n; j++) {
      const at = segs[j], body = who[at];
      if (body !== MIXED && body < count ? flag[body] === 1 : want === 0) pick[np++] = at;
    }
    this.bodySegments = n;
    this.bodyCulled = n - np;
    this.tq = 0;
    // (A body that is not asked for must not be drawn: it belongs to
    // another layer.)
    this._keepOut = M_BODIES;
    this.tn = this._spans(pick, np, this.tc, this.to, this.bridge * 24);
  }

  // The glass that can be on screen: the segments holding any, in the
  // order of the buffer (the order the glass set has), less those whose
  // world quads all lie outside the frustum `planes` (as drawVisible's,
  // voxels). A segment with a body's glass is drawn wherever it is. What
  // is left out has no pixel in the picture: it was a sixth of a city
  // frame's triangles, drawn whichever way the camera looked.
  // Of each segment its glass quads and no other slot, GLASS_PER slots an
  // instance: a segment from its first quad to its last in runs of RUN,
  // for a pane or two among a hundred other quads the vertex stage then
  // threw away, was a quarter of a town frame's triangles at rest (the VR
  // engineer's count: 810 runs of 64 triangles for 1,428 glass quads).
  drawGlass(planes) {
    if (this.glassExact && this.keep) {
      const g = this._glass, k = this._glassRuns(planes);
      // (The same segments in view as the frame before, and their runs
      // still in the buffer: drawn again.)
      if (k < 0 && this._again(g)) return;
      if (g.k === 0) { g.n = 0; g.age = this.runAge; return; }
      this.indices += g.k * 6;
      this.spans += g.k;
      this._send(g.words, g.k, g, GLASS_PER, g.k * 6, g.k);
      return;
    }
    this._glass.seenFor[0] = NaN;
    this._listGlass(planes);
    this._submit(this.tc, this.to, this.tn, null, this.glassExact ? GLASS_PER : RUN);
  }

  // The frame's glass as run words in `_glass.words` (`_glass.k` of them:
  // a glass quad a word, the segments in view in their order, a segment's
  // quads in theirs): what _listGlass lists and QuadLists.runs would cut
  // to runs of one, without doing either a frame. Every glass quad's word
  // is worked out once for each `changed`; a frame holds the glass
  // segments against the frustum and copies the words of those in view.
  // Returns the number of words, or -1 when they are the words of the
  // call before (the same frustum, nothing changed). `_glass.quads`: the
  // glass quads in them.
  _glassRuns(planes) {
    const g = this._glass, segs = this.glassSegs, n = this.glassSegN, mask = this.mask, sb = this.segBox;
    let same = g.made === this.changed;
    if (!same) {
      g.made = this.changed;
      let total = 0;
      for (let j = 0; j < n; j++) total += this.seg[segs[j] * S_LEN + S_GLASS];
      if (g.all.length < total) { g.all = new Uint32Array(total * 2); g.words = new Uint32Array(total * 2); }
      if (g.from.length < n + 1) g.from = new Uint32Array((n + 1) * 2);
      const all = g.all, from = g.from, gb = this.glassBits;
      let k = 0;
      for (let j = 0; j < n; j++) {
        const at = segs[j];
        from[j] = k;
        for (let w = 0, o = at * (SEG >> 5); w < SEG >> 5; w++) {
          let bits = gb[o + w];
          while (bits !== 0) {
            const low = bits & -bits;
            all[k++] = at * SEG + w * 32 + 31 - Math.clz32(low);
            bits ^= low;
          }
        }
      }
      from[n] = k;
    }
    const v = g.seenFor;
    for (let i = 0; i < 20 && same; i++) same = v[i] === planes[i];
    if (same) return -1;
    for (let i = 0; i < 20; i++) v[i] = planes[i];
    const all = g.all, from = g.from, words = g.words;
    let k = 0;
    for (let j = 0; j < n; j++) {
      const at = segs[j], q = at * 6;
      if (!(mask[at] & M_BODY_GLASS)) {
        let inside = true;
        for (let p = 0; p < 20; p += 4) {
          const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2];
          if (nx * sb[nx > 0 ? q + 3 : q] + ny * sb[ny > 0 ? q + 4 : q + 1] + nz * sb[nz > 0 ? q + 5 : q + 2] + planes[p + 3] < 0) { inside = false; break; }
        }
        if (!inside) continue;
      }
      for (let i = from[j], e = from[j + 1]; i < e; i++) words[k++] = all[i];
    }
    g.k = k;
    g.quads = k;
    return k;
  }

  _listGlass(planes) {
    this._viewStale = true;
    const mask = this.mask, sb = this.segBox;
    const segs = this.glassSegs, pick = this._pick, sg = this.seg;
    let np = 0, panes = 0;
    for (let j = 0, n = this.glassSegN; j < n; j++) {
      const at = segs[j], k = at * 6, m = mask[at];
      if (!(m & M_BODY_GLASS)) {
        let inside = true;
        for (let p = 0; p < 20; p += 4) {
          const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2];
          if (nx * sb[nx > 0 ? k + 3 : k] + ny * sb[ny > 0 ? k + 4 : k + 1] + nz * sb[nz > 0 ? k + 5 : k + 2] + planes[p + 3] < 0) { inside = false; break; }
        }
        if (!inside) continue;
      }
      pick[np++] = at;
      panes += sg[at * S_LEN + S_GLASS];
    }
    this.tq = 0;
    this._keepOut = 0;
    // (A span a glass quad at the most, where the lists have room for one
    // a segment.)
    if (this.glassExact && panes > this.tc.length) { this.tc = new Int32Array(panes * 2); this.to = new Int32Array(this.tc.length); }
    this.tn = this._spans(pick, np, this.tc, this.to, this.glassExact ? 0 : this.bridge * 24, this.glassExact ? PART_GLASS : PART_WHOLE);
  }

  // Live quads of a prebuilt subset.
  quads(set) { return this.sets[set].quads; }

  // Draws one prebuilt subset; returns the number of its quads.
  draw(set) {
    const s = this.sets[set];
    this._submit(s.counts, s.offsets, s.n);
    return s.quads;
  }
}

// (For tools that hold the lists in a page and cannot import this module.)
QuadLists.RUN = RUN;
QuadLists.RUN_AT = RUN_AT;

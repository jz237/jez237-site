// A frame as it travels between threads: one ArrayBuffer holding the out
// block and a copy of everything its pointer slots point at that is live,
// with those slots rebased to offsets inside the buffer, so a consumer reads
// `f32[out[OUT.X_PTR] >> 2]` exactly as it does over wasm memory.
//
//   header   HEAD.LEN words (below)
//   camera   8 doubles: the sim camera after the last two steps, alpha, spare
//   out      the 64-slot out block, pointer slots rebased
//   state    STATE_TABLE words (how many floats each of STATE_KEYS has in
//            this packet), then those floats back to back: camera, player,
//            tool, structure, tally, objective, replay (the block out slot
//            REPLAY_PTR points at: the slot is rebased to this copy). The lengths travel with the
//            packet because the engine's state views grow (the tool state
//            gained a float with the flamethrower): nothing here knows them.
//   runs     3 words per quad run: first row, rows, word index of its rows
//   prof, lights, events
//   solids   one float per event record: the solid between it and where the
//            picture is drawn from
//   boxes    the AO volume's dirty boxes, 6 words each (as OCC_DIRTY_PTR has them)
//   xf       body transforms, in whole texture rows of 256 bodies
//   particles
//   quads    the rows of the runs, back to back (every row in a full packet)
//   fine     the fine quad stream (engine/src/detail.rs): 2 words per run
//            of rows that changed (first row, rows: as FINE_DIRTY_PTR has
//            them), then those rows back to back (none in a packet flagged
//            FINE_WHOLE: every row then comes beside it)
//   occ      the bytes of each dirty AO box that an earlier one does not cover
//   sound    the acoustic map's bytes of the same boxes, in the same order
//   water    the water block (out slot 61, engine/src/water/output.rs): its
//            16 words with the four pointers rebased, then the rectangles,
//            the tiles, the list of patches rewritten, the parcels, and the
//            patches, each at its own index (patch p at PATCH_PTR + p * 2592
//            bytes, as in wasm memory). Only the patches of the tiles listed
//            are copied; the bytes of any other patch mean nothing.
//
// The buffers too big to copy whole are not in it: of the quads a packet has
// the rows that changed, of the AO volume and of the acoustic map (what
// stands in the way of sound in each AO texel, sim_acoustics.js) the boxes
// that changed, of the fine quads the rows that changed. The host keeps both
// volumes and the fine rows (`occ`, `sound` and `fine` of PacketFrame) and
// patches them from each packet; a packet flagged OCC_WHOLE
// comes with both whole beside it instead, and one flagged WORLD (the first
// of a new world) with the scene's solid mask as well. The fine rows come
// whole (FINE_WHOLE: a buffer of their own beside the packet, with room for
// twice as many) in a world's first packet that has any, and whenever there
// are more rows than the host's copy has room for: the copy never has to be
// made larger on the host's thread, where growing it cost a frame (12 ms
// for a town in ruins; four times that on a machine four times slower).
import { OUT, QUAD_TEX_W, XF_STRIDE, particleWords, LIGHT_STRIDE, EV, EV_STRIDE } from './engine.js';

export const HEAD = {
  SEQ: 0, STEPS: 1, COMMANDS: 2, FLAGS: 3, RUNS: 4, RUN_TABLE: 5, ENCLOSURE: 6,
  SOLIDS: 7, OCC_BYTES: 8, BYTES: 9, WASM_BYTES: 10, REQUEST: 11,
  // Milliseconds on the sim's thread, as floats: the steps, prepare_render,
  // and filling this packet (the rays for its new events included).
  STEP_MS: 12, PREPARE_MS: 13, COPY_MS: 14,
  SOUND_BYTES: 15,
  // The steps the clock ran for this request, which STEP_MS is the time of
  // (STEPS also counts those a tool asked for as commands).
  PACED: 16,
  // Word index of the fine rows of this packet's fine runs.
  FINE_WORDS: 17,
  // With the clock in the worker, a float: the game seconds its clock
  // asked of it since the packet before (all the time that passed at the
  // rate given, whether or not it was run: STEPS against this is the
  // world's true pace). Under 0: the page keeps the clock, and knows.
  ASKED: 18,
  // The quad lists' account of what this packet's rows changed (word index
  // and words; render_geom.js, QuadLists.writeDelta): the sim's end keeps
  // lists of its own over the rows it sends, and the page's lists take
  // this instead of reading the rows. 0 words: none, the page reads them.
  INDEX_AT: 19, INDEX_WORDS: 20,
  // (An even number of words: the doubles that follow start on 8 bytes.)
  LEN: 22,
};
export const FLAG = { FULL: 1, WORLD: 2, OCC_WHOLE: 4, FINE_WHOLE: 8 };
// The state the host used to ask the engine for, as the frame names it, in
// the order it travels.
export const STATE_KEYS = ['camera', 'playerState', 'toolState', 'structureStats', 'tally', 'objective', 'replay', 'vehicleState', 'game'];
const REPLAY_KEY = STATE_KEYS.indexOf('replay');
// Words of the table in front of the state floats (an even number).
const STATE_TABLE = 12;
// The out block's pointer slots, every one of which the packet rebases to an
// offset in itself. A pointer slot that is not listed here would cross as an
// address in the sim's wasm memory, which means nothing on the page:
// sim_check.mjs fails when OUT has a `_PTR` this list has not.
export const REBASED = ['QUADS_PTR', 'DIRTY_RUNS_PTR', 'XF_PTR', 'OCC_PTR', 'OCC_DIRTY_PTR', 'PROF_PTR', 'PARTICLES_PTR', 'LIGHTS_PTR', 'EVENTS_PTR', 'REPLAY_PTR', 'FINE_PTR', 'FINE_DIRTY_PTR'];

// The out slot of the water block, the block's words and the sizes of what
// it points at (engine/src/water/output.rs), for as long as engine.js does
// not name them.
export const WATER_PTR = OUT.WATER_PTR !== undefined ? OUT.WATER_PTR : 61;
if (OUT.WATER_PTR !== undefined) REBASED.push('WATER_PTR');
export const WATER = { RECT_PTR: 0, RECT_COUNT: 1, TILE_PTR: 3, TILE_COUNT: 4, PATCH_PTR: 5, DIRTY_PTR: 6, DIRTY_COUNT: 7, PARCEL_PTR: 8, PARCEL_COUNT: 9, PATCHES: 12, LEN: 16 };
const WATER_RECT = 8, WATER_TILE = 4, WATER_PARCEL = 8; // floats each
const WATER_PATCH = 18 * 18 * 8;                        // bytes: 18 x 18 texels of four half floats

const ROW_WORDS = QUAD_TEX_W * 2;
// Fine rows the host's copy has room for at the least (4 MB).
const FINE_ROOM = 256;
const XF_ROW = 256; // bodies per row of the transform texture
const XF_MAX = 8192;
const CAM_AT = HEAD.LEN * 4;
const OUT_AT = CAM_AT + 64;
const STATE_AT = OUT_AT + OUT.LEN * 4;
const STATE_FLOATS = (STATE_AT >> 2) + STATE_TABLE;
const GRAIN = 1 << 16;
// The acoustic map has the AO volume's texels: cells of 2 voxels a side
// (the `shift` of Engine.acousticMap).
export const SOUND_SHIFT = 1;

// Box i of a dirty-box table is worth copying: not empty, and no earlier box
// of the table holds all of it (many edits in one place report the same
// texels again and again). Both ends of the transport ask this the same way.
export function occBoxLive(u32, at, i) {
  const p = at + i * 6;
  const x0 = u32[p], y0 = u32[p + 1], z0 = u32[p + 2], x1 = u32[p + 3], y1 = u32[p + 4], z1 = u32[p + 5];
  if (x1 <= x0 || y1 <= y0 || z1 <= z0) return false;
  for (let q = at; q < p; q += 6) {
    if (u32[q] <= x0 && u32[q + 1] <= y0 && u32[q + 2] <= z0 && u32[q + 3] >= x1 && u32[q + 4] >= y1 && u32[q + 5] >= z1) return false;
  }
  return true;
}

const WIDE = 32;

// Copies the live boxes between a volume (layout x + ox * (z + oz * y), from
// byte `vol0` of `vol`) and a packed run of bytes at `at` of `packed`:
// out of the volume when `pack`, into it otherwise.
function occBoxCopy(u32, table, n, ox, oy, oz, vol, vol0, packed, at, pack) {
  for (let i = 0; i < n; i++) {
    if (!occBoxLive(u32, table, i)) continue;
    const p = table + i * 6;
    const x0 = u32[p], y0 = u32[p + 1], z0 = u32[p + 2];
    const x1 = Math.min(u32[p + 3], ox), y1 = Math.min(u32[p + 4], oy), z1 = Math.min(u32[p + 5], oz);
    const w = x1 - x0;
    if (w <= 0 || y1 <= y0 || z1 <= z0) continue;
    for (let y = y0; y < y1; y++) {
      for (let z = z0; z < z1; z++) {
        const v = vol0 + x0 + ox * (z + oz * y);
        // (A short row byte by byte: a view made for it costs more than it saves.)
        if (w >= WIDE) {
          if (pack) packed.set(vol.subarray(v, v + w), at);
          else vol.set(packed.subarray(at, at + w), v);
        } else if (pack) for (let k = 0; k < w; k++) packed[at + k] = vol[v + k];
        else for (let k = 0; k < w; k++) vol[v + k] = packed[at + k];
        at += w;
      }
    }
  }
  return at;
}

// What an event's answer is when the engine was not asked for a ray: under
// nothing, which the page takes as "march the map" (sim_acoustics.js).
export const RAY_NONE = -1;
// The enclosure is asked every so many packets, and at once where the
// listener is further than this (m, summed over the axes) from where it
// was last asked.
const ENCLOSURE_EVERY = 4, ENCLOSURE_NEAR = 3;

// The sim's side: fills packets from a LocalSim's frame.
export class PacketWriter {
  constructor() {
    this._state = new Float32Array(128);
    this._stateLen = new Uint32Array(STATE_TABLE);
    this._solids = new Float32Array(256);
    this._boxes = new Uint32Array(6 * 64);
    this._total = -1;
    // What encloses the listener, as last asked, where it was asked from
    // and how many packets ago (ENCLOSURE_EVERY).
    this._enclosure = 0;
    this._enclosedAt = [NaN, NaN, NaN];
    this._enclosedFor = 0;
    // Bytes of the largest packet of this world so far.
    this._peak = 0;
    // The last packet left the AO volume out: it travels whole, beside it.
    this.whole = false;
    // Every fine row, when the last packet left its fine rows out (null
    // otherwise): a buffer to send beside it, which the host keeps. And the
    // words that buffer has room for, which is the room the host's copy has.
    this.fine = null;
    this._fineRoom = 0;
  }

  // A new world counts its events from nothing.
  reset() {
    this._total = -1;
    this._enclosedAt[0] = NaN;
    this._peak = 0;
  }

  // For a packet that said `whole`: the whole density volume and the whole
  // acoustic map, to send beside it. An engine call, so after the packet
  // is written; and from now they are what the page has been told
  // (Engine.volumeDelta). -> { occ, sound }, buffers of their own.
  wholes(sim) {
    const v = sim.engine.volumeDelta(1);
    return { occ: v.occ.slice().buffer, sound: v.sound.slice().buffer };
  }

  // sim: a LocalSim just prepared. buf: a buffer to fill if it is big enough
  // (null: make one). info: { commands, request, world, stepMs, prepareMs,
  // paced, asked, index } (index: true and the engine's account of this
  // packet's quad rows goes with them; the engine was told the materials'
  // kinds, Engine.quadKinds). Returns the buffer the packet is in.
  write(sim, buf, info) {
    const t0 = performance.now();
    const e = sim.engine, lens = this._stateLen;
    // Everything that calls into the engine first: a call may grow wasm
    // memory, and no view taken before it would survive that.
    let f = sim.frame;
    let st = this._state, stateFloats = 0, replayAt = 0;
    for (let i = 0; i < STATE_KEYS.length; i++) {
      if (i === REPLAY_KEY) replayAt = stateFloats;
      // (Each is a view of engine memory: copied before the next is asked for.)
      const v = f[STATE_KEYS[i]], n = v.length;
      if (stateFloats + n > st.length) {
        const more = new Float32Array((stateFloats + n) * 2);
        more.set(st);
        st = this._state = more;
      }
      st.set(v, stateFloats);
      lens[i] = n;
      stateFloats += n;
    }
    // Where the picture will be drawn from, and so where the audio listens.
    const cx = f.ear(0), cy = f.ear(1), cz = f.ear(2);
    // What encloses it: asked every fourth packet and carried by the three
    // between (the sound engineer's word: what it drives glides over
    // tenths of a second, a walker moves a third of a metre in four steps
    // and a car two), and at once for a new world and where the listener
    // has been put somewhere else (a spawn, a restart, out of a vehicle:
    // further than anything travels in four steps).
    const at = this._enclosedAt;
    const far = !(Math.abs(cx - at[0]) + Math.abs(cy - at[1]) + Math.abs(cz - at[2]) < ENCLOSURE_NEAR);
    if (info.world || far || ++this._enclosedFor >= ENCLOSURE_EVERY) {
      this._enclosure = e.acousticEnclosure(cx, cy, cz);
      at[0] = cx; at[1] = cy; at[2] = cz;
      this._enclosedFor = 0;
    }
    const enclosure = this._enclosure;
    // Only the records nobody has heard yet are worth an answer, and of
    // those only a blast and a shot the engine's own ray: the loudest
    // things there are, where a wall between is plainly heard. The others
    // (fourteen a packet in a collapse, twenty-eight in its worst seconds)
    // say "not measured" (RAY_NONE), and the page marches the map for the
    // one in sixteen of them the director plays at the event's own place
    // (sim_acoustics.js; the sound engineer's count and rule).
    const events = f.out[OUT.EVENT_COUNT], total = f.out[OUT.EVENT_TOTAL];
    const fresh = this._total < 0 ? events : Math.min(events, (total - this._total) >>> 0);
    this._total = total;
    if (events > this._solids.length) this._solids = new Float32Array(events * 2);
    const solids = this._solids;
    for (let i = 0; i < events; i++) {
      if (i < events - fresh) { solids[i] = 0; continue; }
      const m = sim.frame, p = (m.out[OUT.EVENTS_PTR] >> 2) + i * EV_STRIDE;
      const kind = m.f32[p] | 0;
      solids[i] = kind === EV.EXPLOSION || kind === EV.SHOT ? e.acousticOcclusion(cx, cy, cz, m.f32[p + 1], m.f32[p + 2], m.f32[p + 3]) : RAY_NONE;
    }

    // The density volume and the acoustic map: the cells that are not what
    // the page was last told, out of the frame's dirty boxes, as boxes
    // around them with both volumes' bytes (Engine.volumeDelta, the frame
    // engineer's: a dirty box is where the density was worked out again,
    // and three cells in a hundred of it come out different). (More cells
    // than the volume has: the volumes themselves are the smaller parcel,
    // and travel whole beside the packet; the boxes still say where to
    // look.)
    f = sim.frame;
    const ox = f.out[OUT.OCC_SX], oy = f.out[OUT.OCC_SY], oz = f.out[OUT.OCC_SZ];
    const vd = info.world ? null : e.volumeDelta(0);
    const boxes = vd ? vd.count : 0;
    let occBytes = vd ? vd.bytes : 0;
    const whole = info.world || occBytes > ox * oy * oz;
    if (whole) occBytes = 0;
    this.whole = whole;
    // (The boxes are kept here: whoever sends the whole volumes asks the
    // engine for them after this, and what the delta held is then gone.)
    if (boxes * 6 > this._boxes.length) this._boxes = new Uint32Array(boxes * 12);
    if (boxes) this._boxes.set(vd.boxes);

    // The quad lists' account of the rows this packet brings, written by
    // the engine beside the rows (Engine.quadDelta, the frame engineer's):
    // from nothing and over every row for a new world or when every row is
    // sent again. Asked for once a packet and by nobody else: each call
    // counts from the one before.
    const all = sim.frame.full;
    const delta = info.index ? e.quadDelta((info.world || all ? 1 : 0) | (all ? 2 : 0)) : null;
    const indexWords = delta ? delta.length : 0;

    // From here on nothing calls the engine: the views hold.
    f = sim.frame;
    const out = f.out, s8 = f.u8, s32 = f.u32;
    const runs = f.runs;
    let rows = 0;
    for (let i = 0; i < runs; i++) rows += f.runRows(i);
    const prof = out[OUT.PROF_LEN], lights = out[OUT.LIGHT_COUNT] * LIGHT_STRIDE;
    // (Slot 0 is the world: a count of 1 is no body at all.)
    const xf = out[OUT.XF_COUNT] > 1 ? Math.min(Math.ceil(out[OUT.XF_COUNT] / XF_ROW) * XF_ROW, XF_MAX) * XF_STRIDE : 0;
    const particles = particleWords(out[OUT.PARTICLE_COUNT], out[OUT.PARTICLE_DEBRIS]);
    // The fine quad stream: the runs of rows that changed, every row of a
    // new world.
    const fineAll = out[OUT.FINE_ROWS], fineTable = out[OUT.FINE_DIRTY_PTR] >> 2, fineFrom = out[OUT.FINE_PTR] >> 2;
    const fineRuns = info.world ? (fineAll > 0 ? 1 : 0) : out[OUT.FINE_DIRTY_LEN];
    const fineStart = (i) => (info.world ? 0 : Math.min(s32[fineTable + i * 2], fineAll));
    const fineCount = (i) => (info.world ? fineAll : Math.min(s32[fineTable + i * 2 + 1], fineAll - fineStart(i)));
    // Every row beside the packet (a world's first rows, or more rows than
    // the host's copy has room for), in a buffer with room for as many
    // again: the runs then only say which rows changed.
    const fineWhole = fineAll > 0 && (info.world || fineAll * ROW_WORDS > this._fineRoom);
    this.fine = null;
    if (fineWhole) {
      this._fineRoom = Math.max(fineAll * 2, FINE_ROOM) * ROW_WORDS;
      const all = new Uint32Array(this._fineRoom);
      all.set(s32.subarray(fineFrom, fineFrom + fineAll * ROW_WORDS));
      this.fine = all.buffer;
    }
    let fineRows = 0;
    for (let i = 0; i < fineRuns && !fineWhole; i++) fineRows += fineCount(i);

    const runAt = STATE_FLOATS + stateFloats;
    const profAt = runAt + runs * 3, lightAt = profAt + prof, eventAt = lightAt + lights;
    const solidAt = eventAt + events * EV_STRIDE, boxAt = solidAt + events;
    const xfAt = boxAt + boxes * 6, particleAt = xfAt + xf, quadAt = particleAt + particles;
    const fineRunAt = quadAt + rows * ROW_WORDS, fineAt = fineRunAt + fineRuns * 2;
    const occAt = (fineAt + fineRows * ROW_WORDS) * 4;
    const soundAt = occAt + occBytes;
    // The water block and what it points at. (No block: an engine built
    // before the water.) Patches keep their indices, so there is room up to
    // the last one a listed tile has.
    const water = out[WATER_PTR] >> 2;
    const wRects = water ? s32[water + WATER.RECT_COUNT] * WATER_RECT : 0, wTiles = water ? s32[water + WATER.TILE_COUNT] * WATER_TILE : 0;
    const wDirty = water ? s32[water + WATER.DIRTY_COUNT] : 0, wParcels = water ? s32[water + WATER.PARCEL_COUNT] * WATER_PARCEL : 0;
    const wTileFrom = water ? s32[water + WATER.TILE_PTR] >> 2 : 0;
    let wPatches = 0;
    for (let i = 3; i < wTiles; i += WATER_TILE) wPatches = Math.max(wPatches, f.f32[wTileFrom + i] + 1);
    if (water) wPatches = Math.min(wPatches, s32[water + WATER.PATCHES]);
    const waterAt = (soundAt + occBytes + 3) >> 2;
    const wRectAt = waterAt + (water ? WATER.LEN : 0), wTileAt = wRectAt + wRects, wDirtyAt = wTileAt + wTiles, wParcelAt = wDirtyAt + wDirty;
    const wPatchAt = (wParcelAt + wParcels) * 4;
    const indexAt = (wPatchAt + wPatches * WATER_PATCH + 3) >> 2;
    const bytes = (indexAt + indexWords) * 4;
    // Room to spare, so that the next packet a little larger fits as well.
    // A buffer made anew has room for the largest packet of this world so
    // far, not only for this one: three buffers go round, and each would
    // otherwise be made again for every size the wreck's packets reach.
    if (bytes > this._peak) this._peak = bytes;
    if (!buf || buf.byteLength < bytes) buf = new ArrayBuffer(Math.ceil(this._peak * 1.25 / GRAIN) * GRAIN);
    const d8 = new Uint8Array(buf), d32 = new Uint32Array(buf), dF = new Float32Array(buf);
    const copy = (from, at, words) => { if (words) d32.set(s32.subarray(from, from + words), at); };

    d32.fill(0, 0, HEAD.LEN);
    d32[HEAD.SEQ] = f.seq;
    d32[HEAD.STEPS] = f.steps;
    d32[HEAD.COMMANDS] = info.commands;
    d32[HEAD.FLAGS] = (f.full ? FLAG.FULL : 0) | (info.world ? FLAG.WORLD : 0) | (whole ? FLAG.OCC_WHOLE : 0) | (fineWhole ? FLAG.FINE_WHOLE : 0);
    d32[HEAD.RUNS] = runs;
    d32[HEAD.RUN_TABLE] = runAt;
    d32[HEAD.ENCLOSURE] = enclosure;
    d32[HEAD.SOLIDS] = solidAt;
    d32[HEAD.OCC_BYTES] = occAt;
    d32[HEAD.SOUND_BYTES] = soundAt;
    d32[HEAD.BYTES] = bytes;
    d32[HEAD.WASM_BYTES] = e.mem.buffer.byteLength;
    d32[HEAD.REQUEST] = info.request;
    d32[HEAD.PACED] = info.paced || 0;
    d32[HEAD.FINE_WORDS] = fineAt;
    dF[HEAD.STEP_MS] = info.stepMs;
    dF[HEAD.PREPARE_MS] = info.prepareMs;
    dF[HEAD.ASKED] = info.asked >= 0 ? info.asked : -1;
    d32[HEAD.INDEX_AT] = indexAt;
    d32[HEAD.INDEX_WORDS] = indexWords;
    if (indexWords) d32.set(delta, indexAt);
    const cam = new Float64Array(buf, CAM_AT, 8);
    cam.set(f.camPrev, 0);
    cam.set(f.camCur, 3);
    cam[6] = f.alpha;
    d32.set(lens, STATE_AT >> 2);
    dF.set(stateFloats === st.length ? st : st.subarray(0, stateFloats), STATE_FLOATS);

    let q = quadAt;
    for (let i = 0; i < runs; i++) {
      const n = f.runRows(i);
      d32[runAt + i * 3] = f.runStart(i);
      d32[runAt + i * 3 + 1] = n;
      d32[runAt + i * 3 + 2] = q;
      copy(f.runWords(i), q, n * ROW_WORDS);
      q += n * ROW_WORDS;
    }
    for (let i = 0, at = fineAt; i < fineRuns; i++) {
      const start = fineStart(i), n = fineCount(i);
      d32[fineRunAt + i * 2] = start;
      d32[fineRunAt + i * 2 + 1] = n;
      if (fineWhole) continue;
      copy(fineFrom + start * ROW_WORDS, at, n * ROW_WORDS);
      at += n * ROW_WORDS;
    }
    copy(out[OUT.PROF_PTR] >> 2, profAt, prof);
    copy(out[OUT.LIGHTS_PTR] >> 2, lightAt, lights);
    copy(out[OUT.EVENTS_PTR] >> 2, eventAt, events * EV_STRIDE);
    dF.set(events === solids.length ? solids : solids.subarray(0, events), solidAt);
    if (boxes) d32.set(boxes * 6 === this._boxes.length ? this._boxes : this._boxes.subarray(0, boxes * 6), boxAt);
    copy(out[OUT.XF_PTR] >> 2, xfAt, xf);
    copy(out[OUT.PARTICLES_PTR] >> 2, particleAt, particles);
    if (occBytes) {
      d8.set(vd.occ, occAt);
      d8.set(vd.sound, soundAt);
    }

    if (water) {
      copy(water, waterAt, WATER.LEN);
      copy(s32[water + WATER.RECT_PTR] >> 2, wRectAt, wRects);
      copy(wTileFrom, wTileAt, wTiles);
      copy(s32[water + WATER.DIRTY_PTR] >> 2, wDirtyAt, wDirty);
      copy(s32[water + WATER.PARCEL_PTR] >> 2, wParcelAt, wParcels);
      // (Half floats: a patch need not start on a word.)
      for (let i = 3, from = s32[water + WATER.PATCH_PTR]; i < wTiles; i += WATER_TILE) {
        const p = f.f32[wTileFrom + i] * WATER_PATCH;
        if (!(p < wPatches * WATER_PATCH)) continue;
        d8.set(s8.subarray(from + p, from + p + WATER_PATCH), wPatchAt + p);
      }
      d32[waterAt + WATER.RECT_PTR] = wRectAt * 4;
      d32[waterAt + WATER.TILE_PTR] = wTileAt * 4;
      d32[waterAt + WATER.DIRTY_PTR] = wDirtyAt * 4;
      d32[waterAt + WATER.PARCEL_PTR] = wParcelAt * 4;
      d32[waterAt + WATER.PATCH_PTR] = wPatchAt;
    }

    const o = OUT_AT >> 2;
    copy(out.byteOffset >> 2, o, OUT.LEN);
    d32[o + OUT.QUADS_PTR] = 0;
    d32[o + OUT.DIRTY_RUNS_PTR] = runAt * 4;
    d32[o + OUT.DIRTY_RUNS_LEN] = runs;
    d32[o + OUT.XF_PTR] = xfAt * 4;
    d32[o + OUT.OCC_PTR] = 0;
    d32[o + OUT.OCC_DIRTY_PTR] = boxAt * 4;
    d32[o + OUT.OCC_DIRTY_LEN] = boxes;
    d32[o + OUT.PROF_PTR] = profAt * 4;
    d32[o + OUT.PARTICLES_PTR] = particleAt * 4;
    d32[o + OUT.LIGHTS_PTR] = lightAt * 4;
    d32[o + OUT.EVENTS_PTR] = eventAt * 4;
    d32[o + OUT.REPLAY_PTR] = (STATE_FLOATS + replayAt) * 4;
    d32[o + OUT.FINE_PTR] = 0;
    d32[o + OUT.FINE_DIRTY_PTR] = fineRunAt * 4;
    d32[o + OUT.FINE_DIRTY_LEN] = fineRuns;
    d32[o + WATER_PTR] = water ? waterAt * 4 : 0;
    dF[HEAD.COPY_MS] = performance.now() - t0;
    return buf;
  }
}

// The host's side: the frame over the newest packet, as the Sim interface
// describes a frame (sim_local.js). One object for the life of the sim; its
// views are replaced with every packet taken.
export class PacketFrame {
  constructor() {
    this.buffer = null;
    this.out = null;
    this.u8 = this.u32 = this.f32 = null;
    this.seq = 0;
    this.steps = 0;
    this.alpha = 1;
    this.commands = 0;
    this.runs = 0;
    this.full = false;
    // The first frame of a new world (boot, 'init').
    this.world = false;
    this.camPrev = new Float64Array(3);
    this.camCur = new Float64Array(3);
    // (Float arrays of this frame's own, as long as the packets say; a
    // packet is copied into them, so they outlive its buffer.)
    this.camera = this.playerState = this.toolState = this.structureStats = this.tally = this.objective = this.replay = this.vehicleState = this.game = null;
    // Every row of the fine quad stream, kept here and patched from each
    // packet: words of `fine` from `fineAt`.
    this.fine = new Uint32Array(0);
    this.fineAt = 0;
    // The AO volume, kept here and patched from each packet.
    this.occ = null;
    this.occAt = 0;
    // The acoustic map (Engine.acousticMap), texel for texel beside it.
    this.sound = null;
    this.enclosure = 0;
    // About the packet itself: its size, the request it answers, the sim's
    // wasm memory, and the sim thread's milliseconds (steps, prepare, pack).
    this.bytes = 0;
    this.request = 0;
    this.wasmBytes = 0;
    this.stepMs = this.prepareMs = this.copyMs = 0;
    this.paced = 0;
    this.asked = -1;
    // The quad lists' delta for this packet's rows (words of u32 from
    // indexAt; 0 words: none, or the frame was drawn before).
    this.indexAt = 0;
    this.indexWords = 0;
    this._runAt = 0;
    this._solidAt = 0;
  }

  // buf: a packet. occ, sound: the whole AO volume and the whole acoustic
  // map when they came beside the packet; fine: every fine row, likewise.
  take(buf, occ, sound, fine) {
    const u32 = new Uint32Array(buf), f32 = new Float32Array(buf), u8 = new Uint8Array(buf);
    this.buffer = buf;
    this.u8 = u8;
    this.u32 = u32;
    this.f32 = f32;
    const out = this.out = u32.subarray(OUT_AT >> 2, (OUT_AT >> 2) + OUT.LEN);
    this.seq = u32[HEAD.SEQ];
    this.steps = u32[HEAD.STEPS];
    this.commands = u32[HEAD.COMMANDS];
    const flags = u32[HEAD.FLAGS];
    this.full = (flags & FLAG.FULL) !== 0;
    this.world = (flags & FLAG.WORLD) !== 0;
    this.runs = u32[HEAD.RUNS];
    this._runAt = u32[HEAD.RUN_TABLE];
    this.enclosure = u32[HEAD.ENCLOSURE];
    this._solidAt = u32[HEAD.SOLIDS];
    this.bytes = u32[HEAD.BYTES];
    this.request = u32[HEAD.REQUEST];
    this.wasmBytes = u32[HEAD.WASM_BYTES];
    this.stepMs = f32[HEAD.STEP_MS];
    this.prepareMs = f32[HEAD.PREPARE_MS];
    this.copyMs = f32[HEAD.COPY_MS];
    this.paced = u32[HEAD.PACED];
    this.asked = f32[HEAD.ASKED];
    this.indexAt = u32[HEAD.INDEX_AT];
    this.indexWords = u32[HEAD.INDEX_WORDS];
    const cam = new Float64Array(buf, CAM_AT, 8);
    for (let i = 0; i < 3; i++) { this.camPrev[i] = cam[i]; this.camCur[i] = cam[i + 3]; }
    this.alpha = cam[6];
    for (let k = 0, s = STATE_FLOATS, t = STATE_AT >> 2; k < STATE_KEYS.length; k++) {
      const key = STATE_KEYS[k], n = u32[t + k];
      let v = this[key];
      if (v === null || v.length !== n) v = this[key] = new Float32Array(n);
      for (let i = 0; i < n; i++) v[i] = f32[s + i];
      s += n;
    }

    if (fine) {
      this.fine = new Uint32Array(fine);
    } else if ((flags & FLAG.FINE_WHOLE) === 0) {
      // (The sim sends every row before there are more than it last made
      // room for: this copy is never made larger here.)
      for (let i = 0, n = out[OUT.FINE_DIRTY_LEN], t = out[OUT.FINE_DIRTY_PTR] >> 2, at = u32[HEAD.FINE_WORDS]; i < n; i++) {
        const words = u32[t + i * 2 + 1] * ROW_WORDS;
        this.fine.set(u32.subarray(at, at + words), u32[t + i * 2] * ROW_WORDS);
        at += words;
      }
    }
    const ox = out[OUT.OCC_SX], oy = out[OUT.OCC_SY], oz = out[OUT.OCC_SZ];
    if (occ) {
      this.occ = new Uint8Array(occ);
      this.sound = sound ? new Uint8Array(sound) : null;
    } else if (out[OUT.OCC_DIRTY_LEN] > 0 && this.occ && this.occ.length === ox * oy * oz) {
      const table = out[OUT.OCC_DIRTY_PTR] >> 2, n = out[OUT.OCC_DIRTY_LEN];
      occBoxCopy(u32, table, n, ox, oy, oz, this.occ, 0, u8, u32[HEAD.OCC_BYTES], false);
      if (this.sound && this.sound.length === ox * oy * oz) occBoxCopy(u32, table, n, ox, oy, oz, this.sound, 0, u8, u32[HEAD.SOUND_BYTES], false);
    }
    return this;
  }

  runStart(i) { return this.u32[this._runAt + i * 3]; }
  runRows(i) { return this.u32[this._runAt + i * 3 + 1]; }
  runWords(i) { return this.u32[this._runAt + i * 3 + 2]; }
  eventSolid(i) { return this.f32[this._solidAt + i]; }

  // The picture has taken this frame's quad rows, AO boxes and water
  // patches: drawn again (no newer frame has come), it has nothing to upload.
  spend() {
    this.runs = 0;
    this.full = false;
    this.indexWords = 0;
    this.out[OUT.DIRTY_RUNS_LEN] = 0;
    this.out[OUT.OCC_DIRTY_LEN] = 0;
    this.out[OUT.FINE_DIRTY_LEN] = 0;
    this.out[OUT.FINE_CHANGED] = 0;
    const water = this.out[WATER_PTR] >> 2;
    if (water) this.u32[water + WATER.DIRTY_COUNT] = 0;
  }
}

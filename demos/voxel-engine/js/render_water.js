// Water: what the engine's water block describes (engine/src/water/output.rs),
// drawn after the glass and before the soft particles.
//
// - Still bodies are rectangles at a level: one instanced quad each,
//   re-uploaded when the engine says the list changed.
// - Moving water is a 16 x 16 grid per live tile whose heights come from
//   the tile's patch (18 x 18 texels of half floats). The patches live in
//   one atlas, stacked in columns of 64: a patch is 18 texels wide, so a run
//   of consecutive patches in a column is one contiguous block of engine
//   memory and goes up in a single texSubImage2D. Only the patches the
//   engine lists as rewritten are sent. The heights are the engine's drawn
//   levels, already calm where water comes down in lumps, and with them
//   comes each column's churn (in the flow's x channel: the vertex stage
//   takes it off, texel by texel); the fragment stage draws churn as foam,
//   a film as wet ground and slow deep water as still water is drawn.
// - Water in the air is a quad of mist and drops per parcel (a stream
//   while it is young and fast), summed into a layer of reduced resolution
//   as thickness of water and drawn from there as one body, so a jet is a
//   jet with a ragged fringe and not a string of beads.
//
// - A river with a swell running down it comes as cells, each flat at its
//   own level and with its own speed. The still water is drawn from above
//   into a map (the flow map: level and speed, two columns a texel, with
//   coarser levels) whenever its rectangles change, and while a swell
//   runs the rectangles read it: their corners take the level of the
//   water round them, so the cells are one surface that tilts, and the
//   ripples ride the speed at each place, white where it is fast for its
//   depth and on the face of a front.
// - What is wet: a map of the world from above, a texel a water column
//   (`wet`, for the surface shader: wetness and the height of the wet
//   line). Moving water is written into it every frame it moves, still
//   water twice a second, and twice a second all of it is copied a little
//   drier into its other copy: ground is dry a minute and a half after
//   the water left it, a wall dries from the top down. Only where a
//   half-float target can be drawn to, and only from the first water on.
//
// The pass draws into the scene's colour with the scene's depth as a
// texture (no depth buffer is attached while a pass reads it): the shader
// tests against it and learns from the same tap how much water the eye
// looks through. Tiers that refract take a copy of the scene's colour
// first; that copy, and every draw, happens only on frames in which water
// is in view, and still water that is in view but behind something (a full
// tank behind its own walls) is reduced to a probe inside an occlusion
// query until some of it shows. With no water there is nothing: no
// uploads, no copies, no draws.
import { OUT, WATER } from './engine.js';
import { describeProgram, makeTarget, makeTexture, freeTarget, BLEND, CULL, UNIT } from './render_gl.js';
import { FULLSCREEN_VS } from './render_shaders_fx.js';
import { F } from './render_frame.js';
import { WATER_RECT_VS, WATER_RECT_FS, WATER_PROBE_FS, WATER_TILE_VS, WATER_TILE_FS, WATER_PARCEL_VS, WATER_SPRAY_FS, WATER_SPRAY_UP_FS, WATER_BLOB_FS, WATER_LAND_VS, WATER_LAND_FS, WATER_LAND_FADE_FS, WATER_SIDE_VS, WATER_SIDE_FS, WATER_UNDER_FS,
  WATER_WET_TILE_VS, WATER_WET_TILE_FS, WATER_WET_RECT_VS, WATER_WET_RECT_FS, WATER_WET_DRY_FS, WATER_FLOW_VS, WATER_FLOW_FS } from './render_shaders_water.js';

const PATCH = 18;                       // texels along a side of a patch
const PATCH_WORDS = PATCH * PATCH * 4;  // half floats in one
const COLUMN = 64;                      // patches stacked in one column of the atlas
const GRID = 16;                        // quads along a side of a tile
const TILE_M = 1.6;                     // metres along a side of a tile
// Rectangles tested against the view each frame; a scene with more is
// taken to have water in view.
const CULL_MAX = 512;
// The map of what is wet: sim steps between two dryings, the seconds wet
// ground takes to dry, and the metres a second a wet line comes down.
// Sim steps a swell counts as running after the still water's rectangles
// last changed, and the steps it then takes to hand back to calm water.
const SWELL_HOLDS = 30;
const SWELL_FADES = 60;
// Floats a rectangle in the corners' buffer (`_junctions`), and the most
// rectangles the corners' edges are looked for among.
const HOST_STRIDE = 12;
const HOSTS_MAX = 8192;
// Runs of that search on a made-up river in the warm-up.
const EDGES_WARM = 60;
// White where water in the air came down on still water: what a step keeps
// of it and takes off it (half of it gone in a third of a second, all of
// it in under two), and the steps the map is kept up after the last parcel over still
// water.
const LAND_KEEPS = 0.97;
const LAND_LOSES = 0.002;
const LAND_STAYS = 150;
// What a step keeps of a rise of the level that is over (a fifth of it
// left after half a second).
const RISE_KEEPS = 0.95;
const WET_EVERY = 30;
const WET_DRIES = 90;
const WET_FALLS = 0.01;

// A half float as a number (the patches' texels, read on the CPU only for
// the one column the camera stands in).
function half(h) {
  const e = (h >> 10) & 31, m = h & 1023, s = h & 0x8000 ? -1 : 1;
  if (e === 0) return s * m * 5.960464477539063e-8;
  if (e === 31) return m ? NaN : s * Infinity;
  return s * (1 + m / 1024) * Math.pow(2, e - 15);
}

// What `findEdges` works in, kept from call to call so that a call
// allocates nothing: room for so many rectangles.
export function edgeState() {
  return { room: 0, data: new Float32Array(0), x0: null, z0: null, x1: null, z1: null, self: null, order: [], inStart: [], inEnd: [], byX: null, pass: null, count: new Int32Array(8192) };
}

// The T-junctions of a swell's rectangles. A river with a swell on it comes
// as bands and cells that tilt, each corner at a height the map gives it
// (CORNER in render_shaders_water.js); where a rectangle's corner lies part
// of the way along a longer edge of its neighbour, that edge is straight
// between its own two ends and the corner is not on it: a gap or a lap a
// few centimetres tall, a hairline of the bed from a pier to the bank.
// Returns, HOST_STRIDE floats a rectangle (the array is the state's, good
// until the next call): for each of its four corners (0 at x0 z0, 1 at x1
// z0, 2 at x0 z1, 3 at x1 z1) the two ends of the edge it lies along
// (along x the lower end first, along z the higher first; 0, 0: none),
// then the four levels of the rectangles those edges are of. h: an
// edgeState(); f32, rp: the rectangles (WATER.RECT_STRIDE floats each: x0,
// z0, x1, z1, level, ...); n: how many.
//
// How: the rectangles' edges are put in order along the lines they lie on,
// four times over (0: the edges at the rectangles' low z, 1: at their high
// z, 2: low x, 3: high x; by the line, then by where the edge starts), and
// each order is walked once beside the order of the lines' other side: the
// edges of one side of a line do not lie over each other, so the first
// that ends after a corner is the only one that can hold it. An edge is
// two whole numbers, where it starts and where it ends, each its line and
// its place along it in tenths of a metre (which the rectangles' corners
// are whole numbers of; a world is under 3.2 km across). The orders are
// made by counting (how many rectangles have each value of a coordinate,
// in one pass where the water lies within 819 m of the world's corner,
// else a byte at a time), which keeps the order it is given among equals:
// by x, then by z, is the order along the lines of z. (Not kept from the step before and mended: a rectangle more
// near the head of the engine's list renumbers the rest, and what was in
// order is then two halves the wrong way round.) The same work whatever
// the river did, and nothing allocated unless there are more rectangles
// than ever before.
export function findEdges(h, f32, rp, n) {
  const S = WATER.RECT_STRIDE;
  if (n >= h.room) {
    const room = Math.max(1024, n * 2);
    h.data = new Float32Array(room * HOST_STRIDE);
    for (const k of ['x0', 'z0', 'x1', 'z1', 'self', 'byX', 'pass']) h[k] = new Int32Array(room);
    for (let i = 0; i < room; i++) h.self[i] = i;
    for (let k = 0; k < 4; k++) {
      h.order[k] = new Int32Array(room);
      h.inStart[k] = new Int32Array(room);
      h.inEnd[k] = new Int32Array(room);
    }
    h.room = room;
  }
  const d = h.data, x0 = h.x0, z0 = h.z0, x1 = h.x1, z1 = h.z1, order = h.order;
  d.fill(0, 0, n * HOST_STRIDE);
  // The rectangles in whole tenths of a metre, and the largest of them.
  let top = 0;
  for (let i = 0, o = rp; i < n; i++, o += S) {
    x0[i] = (f32[o] * 10 + 0.5) & 32767;
    z0[i] = (f32[o + 1] * 10 + 0.5) & 32767;
    const x = x1[i] = (f32[o + 2] * 10 + 0.5) & 32767, z = z1[i] = (f32[o + 3] * 10 + 0.5) & 32767;
    if (x > top) top = x;
    if (z > top) top = z;
  }
  // (By x; from that by z, which is the order along the lines of z; from
  // that by x again, which is the order along the lines of x.)
  edgeOrder(h, n, top, h.self, x0, h.byX, -1, null, null);
  edgeOrder(h, n, top, h.byX, z0, order[0], 0, x0, x1);
  edgeOrder(h, n, top, h.byX, z1, order[1], 1, x0, x1);
  edgeOrder(h, n, top, order[0], x0, order[2], 2, z0, z1);
  edgeOrder(h, n, top, order[0], x1, order[3], 3, z0, z1);
  edgeWalk(h, f32, rp, n, 0, 1, 0, 1, 0);
  edgeWalk(h, f32, rp, n, 1, 0, 2, 3, 0);
  edgeWalk(h, f32, rp, n, 2, 3, 0, 2, 1);
  edgeWalk(h, f32, rp, n, 3, 2, 1, 3, 1);
  return d;
}

// The rectangles of `from` into `to`, in the order of their number `key`
// (`top` at most), equals left as they were. If it is one of the four
// orders of edges (`k`, 0 to 3; `key` is then the edges' line), each edge
// is written as it lies in the order: where it starts and where it ends
// (its line, then its place along it; `lo`, `hi`: the two ends), and after
// the last an edge that is past every corner.
function edgeOrder(h, n, top, from, key, to, k, lo, hi) {
  if (top < 8192) {
    edgeDigit(h.count, n, from, key, 0, 8191, top + 1, to);
  } else {
    edgeDigit(h.count, n, from, key, 0, 255, 256, h.pass);
    edgeDigit(h.count, n, h.pass, key, 8, 255, 256, to);
  }
  if (k < 0) return;
  const start = h.inStart[k], end = h.inEnd[k];
  for (let t = 0; t < n; t++) {
    const i = to[t], l = key[i] << 16;
    start[t] = l | lo[i];
    end[t] = l | hi[i];
  }
  start[n] = end[n] = 0x7fffffff;
}

// By one digit of `key`: its bits under `mask` after `shift`, `room` values.
function edgeDigit(count, n, from, key, shift, mask, room, to) {
  for (let b = 0; b < room; b++) count[b] = 0;
  for (let t = 0; t < n; t++) count[(key[from[t]] >> shift) & mask]++;
  for (let b = 0, at = 0; b < room; b++) {
    const c = count[b];
    count[b] = at;
    at += c;
  }
  for (let t = 0; t < n; t++) {
    const i = from[t];
    to[count[(key[i] >> shift) & mask]++] = i;
  }
}

// One walk: the rectangles of order `g`, the two corners of each on its
// edge of that side (`ca` where the edge starts, `cb` where it ends),
// against the edges of the lines' other side, order `o`. along: 0 for
// edges that run along x, 1 along z. (The first edge that ends after the
// corner is on the corner's line or a later one; if it also starts before
// the corner, it is on the corner's line and the corner is strictly inside
// it.)
function edgeWalk(h, f32, rp, n, g, o, ca, cb, along) {
  const og = h.order[g], sg = h.inStart[g], eg = h.inEnd[g], oh = h.order[o], sh = h.inStart[o], eh = h.inEnd[o];
  for (let a = 0, t = 0; a < n; a++) {
    let at = sg[a];
    while (eh[t] <= at) t++;
    if (sh[t] < at) edgePut(h.data, f32, rp, og[a], ca, oh[t], along);
    at = eg[a];
    while (eh[t] <= at) t++;
    if (sh[t] < at) edgePut(h.data, f32, rp, og[a], cb, oh[t], along);
  }
}

// Corner `c` of rectangle `j` lies along an edge of rectangle `i`. (One
// edge a corner; of this water, not of a pond a storey over it.)
function edgePut(d, f32, rp, j, c, i, along) {
  const S = WATER.RECT_STRIDE, w = j * HOST_STRIDE + c * 2, r = rp + i * S;
  if (d[w] !== d[w + 1] || Math.abs(f32[r + 4] - f32[rp + j * S + 4]) >= 2) return;
  d[w] = along ? f32[r + 3] : f32[r];
  d[w + 1] = along ? f32[r + 1] : f32[r + 2];
  d[j * HOST_STRIDE + 8 + c] = f32[r + 4];
}

export class WaterPass {
  // float16: a half-float target can be rendered to (the spray layer needs one).
  constructor(gl, state, float16) {
    this.gl = gl;
    this.state = state;
    this.float16 = !!float16;
    const instanced = (attribs, stride) => {
      const set = { vao: gl.createVertexArray(), buf: gl.createBuffer(), cap: 0, count: 0 };
      gl.bindVertexArray(set.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, set.buf);
      for (let i = 0; i < attribs; i++) {
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, 4, gl.FLOAT, false, stride, i * 16);
        gl.vertexAttribDivisor(i, 1);
      }
      return set;
    };
    this.rects = instanced(2, WATER.RECT_STRIDE * 4);
    // Beside each rectangle of still water, for each of its four corners:
    // the edge of another rectangle the corner lies part of the way along
    // (`_junctions`). rev: the revision of the rectangles they are of.
    this.hosts = { buf: gl.createBuffer(), cap: 1024, rev: -1, edges: edgeState() };
    gl.bindBuffer(gl.ARRAY_BUFFER, this.hosts.buf);
    gl.bufferData(gl.ARRAY_BUFFER, this.hosts.cap * 4, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 3; i++) {
      gl.enableVertexAttribArray(2 + i);
      gl.vertexAttribPointer(2 + i, 4, gl.FLOAT, false, HOST_STRIDE * 4, i * 16);
      gl.vertexAttribDivisor(2 + i, 1);
    }
    this.parcels = instanced(2, WATER.PARCEL_STRIDE * 4);
    this.tiles = instanced(1, WATER.TILE_STRIDE * 4);
    // The tile grid: vertex k is corner (k % 17, k / 17), read from gl_VertexID.
    const idx = new Uint16Array(GRID * GRID * 6);
    for (let z = 0, o = 0; z < GRID; z++) {
      for (let x = 0; x < GRID; x++) {
        const a = x + z * (GRID + 1), b = a + 1, c = a + GRID + 1, d = c + 1;
        idx[o++] = a; idx[o++] = c; idx[o++] = b; idx[o++] = b; idx[o++] = c; idx[o++] = d;
      }
    }
    this.grid = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.grid);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    state.vaoObj = undefined;
    this.waves = null;        // tiling waves and foam (Waves), made behind the start card or when there first is water
    this._waves = null;       // ... while they are being made
    this._warmed = null;      // the programs that have drawn once (warmUp)
    this._edgesWarm = 0;      // runs of the corners' search so far (warmUp)
    this._river = null;       // the made-up river they run on
    this._warmAt = 0;
    this._flat = null;        // a texture of no waves, for the frames in which they are still being made
    this._scratch = null;     // one pixel for them to draw into
    this._plain = gl.createVertexArray();
    this._flow = null;        // the still water from above (level, speed), for its rectangles to read
    this._flowRev = -1;       // revision of the rectangles drawn into it
    this._flowSeen = -1;      // revision of the rectangles last looked at for a swell
    this._calm = 0;           // rectangles the still water has when no swell runs
    this._flowAt = -1e9;      // sim step at which they last changed while there were some
    this.swell = 0;           // how much of a swell is running, 0..1
    this.overEye = false;     // some still water stands over the eye's height
    this.landed = false;      // whether the map of where air water came down holds anything
    this._land = null;        // that map and its other copy
    this._landWas = null;
    this._landTime = 0;       // the sim's step count when it was last brought up
    this._landUntil = -1;     // the step it is kept up to
    this._drawnAt = 0;        // when the pass last drew (ms)
    this._wet = null;         // the map of what is wet (a target), made at the first water
    this._wetWas = null;      // ... and its other copy (they change places at each drying)
    this._wetTick = -1;       // the drying it has had (sim steps / WET_EVERY)
    this._wetUntil = -1;      // sim step past which nothing in it can be wet
    this._wetClear = false;   // another scene's: to be emptied
    this._wetRev = -1;        // revision of the still water written into it
    this.atlas = null;        // the patches' texture, made when the first tile appears
    this.atlasCols = 0;
    this.spray = null;        // the layer the parcels are summed into
    this.copy = null;         // the scene's colour before the water (tiers that refract)
    this.copyFormat = 0;
    this.cache = new Map();
    this.P = null;
    this.rectRev = -1;        // revision of the rectangles in the buffer
    this.fresh = true;        // nothing uploaded yet: the dirty list is not enough
    this.inView = false;      // there is water the camera can see this frame
    this.under = -1;          // height of the surface over a camera that is under water (m), else -1
    this.animating = false;   // water in view and the sim clock moved since the last frame
    this._time = -1;
    this._buf = null;
    this._u16 = null;
    this._planes = new Float32Array(20);
    this.uploaded = 0;        // patches sent this frame
    // Still water that is in the view but behind something (a tank's own
    // walls) is found out by an occlusion query around its draw; while the
    // answer is "none of it showed", only a probe is drawn.
    this.hidden = false;
    this._query = null;
    this._asked = false;      // the query's answer is awaited
    this._stale = false;      // ... and is about a time since which other water was drawn
  }

  // The programs for a tier (described, not yet compiled). o: cascades
  // (shadow cascade count), enc (the scene target's encoding define), water
  // (the tier's `water` entry: refract, shadow, ripples, trace, spray), wet
  // (the tier's surfaces draw wet ground from the map of what is wet: then
  // the water does not darken its bed itself, and a film is theirs).
  programs(o) {
    const w = o.water;
    let d = `#define CASCADES ${o.cascades}\n#define SHADOW_TAPS 1\n#define SHADOW_MAX_R 1\n` + o.enc;
    if (w.shadow) d += '#define WATER_SHADOW\n';
    if (o.wet && this.float16) d += '#define WET_MASK\n';
    d += `#define WATER_RIPPLES ${w.ripples}\n#define WATER_TRACE ${w.trace}\n`;
    // (Without the picture of the scene behind: for what is drawn over the dust.)
    const plain = d + '#define WATER_OVER\n';
    if (w.refract) d += '#define WATER_REFRACT\n';
    // Each step of the mirrored ray is longer than the last; the fewer the
    // steps, the faster they grow, to reach as far (about 30 m).
    if (w.trace > 0) d += `#define WATER_GROW ${Math.pow(100, 1 / Math.max(w.trace - 1, 1)).toFixed(3)}\n`;
    const get = (name, vs, fs, defs, init) => {
      const key = name + '|' + defs;
      if (!this.cache.has(key)) this.cache.set(key, describeProgram(vs, fs, defs, name, init));
      return this.cache.get(key);
    };
    const units = (gl, u) => {
      if (u.uWetWas) gl.uniform1i(u.uWetWas, UNIT.uTex4);
      if (u.uFlowMap) gl.uniform1i(u.uFlowMap, UNIT.uTex2);
      if (u.uScene) gl.uniform1i(u.uScene, UNIT.uTex);
      if (u.uPatch) gl.uniform1i(u.uPatch, UNIT.uTex2);
      if (u.uWaves) gl.uniform1i(u.uWaves, UNIT.uTex3);
      if (u.uSpray) gl.uniform1i(u.uSpray, UNIT.uTex4);
      if (u.uLanded) gl.uniform1i(u.uLanded, UNIT.uTex4);
    };
    const P = { refract: !!w.refract, spray: this.float16 ? w.spray : 0 };
    P.rects = get('water still', WATER_RECT_VS, WATER_RECT_FS, this.float16 ? d + '#define WATER_FLOWMAP\n' : d, units);
    P.tiles = get('water moving', WATER_TILE_VS, WATER_TILE_FS, d, units);
    if (P.spray) {
      P.parcels = get('water in the air', WATER_PARCEL_VS, WATER_SPRAY_FS, d, units);
      P.sprayUp = get('water in the air, drawn', FULLSCREEN_VS, WATER_SPRAY_UP_FS, d, units);
      P.sprayOver = get('water in the air, over the dust', FULLSCREEN_VS, WATER_SPRAY_UP_FS, plain, units);
    } else {
      P.parcels = get('water in the air, by the blob', WATER_PARCEL_VS, WATER_BLOB_FS, d, units);
    }
    P.under = get('under water', FULLSCREEN_VS, WATER_UNDER_FS, o.enc, null);
    P.probe = get('water probe', WATER_RECT_VS, WATER_PROBE_FS, '', null);
    P.all = [P.rects, P.tiles, P.parcels, P.under, P.probe];
    if (P.sprayUp) P.all.push(P.sprayUp, P.sprayOver);
    if (this.float16) {
      P.flow = get('still water from above', WATER_FLOW_VS, WATER_FLOW_FS, '', null);
      // (Where water in the air comes down on it: read off that map, and
      // kept in one of its own.)
      P.land = get('water landing on water', WATER_LAND_VS, WATER_LAND_FS, '', units);
      P.landFade = get('white on the water fading', FULLSCREEN_VS, WATER_LAND_FADE_FS, '', units);
      // (And the side of a body that stands over the eye.)
      P.sides = get('still water, its side', WATER_SIDE_VS, WATER_SIDE_FS, d, units);
      P.all.push(P.flow, P.land, P.landFade, P.sides);
    }
    if (this.float16 && o.wet) {
      // (Only where the tier's surfaces read the map: on the others it
      // would be kept and written for nobody.)
      P.wetTiles = get('wet, moving water', WATER_WET_TILE_VS, WATER_WET_TILE_FS, '', units);
      P.wetRects = get('wet, still water', WATER_WET_RECT_VS, WATER_WET_RECT_FS, '', null);
      P.wetDry = get('wet, drying', FULLSCREEN_VS, WATER_WET_DRY_FS, '', units);
      P.all.push(P.wetTiles, P.wetRects, P.wetDry);
    }
    return P;
  }

  // What the first frame with water would otherwise have to do, a few
  // milliseconds of it a call: the wave texture, then one draw with each
  // of the tier's programs into a target of its own (a driver finishes a
  // program when it first draws with it). The renderer calls this from its
  // idle frames (the start card, a menu) until it returns true, and again
  // after a reset, a change of tier and a restored context; it is safe at
  // any time and costs nothing once done. False: there is more to do.
  warmUp() {
    const gl = this.gl, st = this.state;
    if (!this.waves) {
      if (!this._waves) {
        this._waves = new Waves();
        return false;
      }
      if (!this._waves.step(WARM_MS)) return false;
      this.waves = this._waves.texture(gl, st);
      this._waves = null;
      return false;
    }
    // (The search for the corners' edges of a swell, on a made-up river,
    // until the engine that runs this page has compiled it: its first
    // calls, in the first frames of a flood, were milliseconds each.)
    if (this.float16 && this._edgesWarm < EDGES_WARM) {
      const made = 400, river = this._river || (this._river = new Float32Array(made * WATER.RECT_STRIDE));
      if (this._edgesWarm === 0) {
        for (let i = 0; i < made; i++) {
          const z = 7 + (i >> 1) * 0.1, pier = (i >> 1) % 5 * 0.2;
          river.set(i & 1 ? [32.4 + pier, z, 40.5, z + 0.1, 1.2] : [23.5, z, 31.6 - pier, z + 0.1, 1.2], i * WATER.RECT_STRIDE);
        }
      }
      const t0 = performance.now();
      do {
        findEdges(this.hosts.edges, river, 0, made);
        this._edgesWarm++;
      } while (this._edgesWarm < EDGES_WARM && performance.now() - t0 < WARM_MS);
      if (this._edgesWarm >= EDGES_WARM) this._river = null;
      return false;
    }
    const P = this.P;
    if (!P) return true;
    if (this._warmed !== P) {
      this._warmed = P;
      this._warmAt = 0;
    }
    if (this._warmAt >= P.all.length) return true;
    const prog = P.all[this._warmAt++];
    if (!this._scratch) {
      st.texForUpload(UNIT.uTex4, gl.TEXTURE_2D, null);
      this._scratch = makeTarget(gl, 1, 1, gl.RGBA8, gl.NEAREST);
      // (Making a target leaves its texture bound on the unit in use. It is
      // taken off for real, not only in the state's record: a program that
      // reads this unit while it draws into the target would be reading
      // what it writes.)
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.units[st.unit] = null;
      st.target = undefined;
    }
    // One instance of nothing (the buffers hold zeros until there is
    // water: a quad of no size), or the fullscreen triangle, into one pixel.
    const set = prog === P.tiles || prog === P.wetTiles ? this.tiles : prog === P.parcels || prog === P.land ? this.parcels : prog === P.rects || prog === P.probe || prog === P.wetRects || prog === P.flow || prog === P.sides ? this.rects : null;
    st.fbo(this._scratch);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.blend(BLEND.PREMUL);
    // Nothing on the units these programs read: whatever another pass left
    // there may be of a kind their samplers cannot take (a shadow map with
    // a compare mode on the patches' unit: the draw is refused).
    st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
    st.tex(UNIT.uTex2, gl.TEXTURE_2D, null);
    st.tex(UNIT.uTex3, gl.TEXTURE_2D, null);
    st.tex(UNIT.uTex4, gl.TEXTURE_2D, null);
    const u = st.program(prog);
    if (set) {
      this._reserve(set, 16);
      st.vao(set.vao);
      if (u.uAtlas) gl.uniform4i(u.uAtlas, COLUMN, 0, 0, 0);
      if (prog === P.tiles) gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, 1);
      else gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 1);
    } else {
      st.vao(this._plain);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    st.vao(null);
    return this._warmAt >= P.all.length;
  }

  // The wave texture at once, whatever it costs (tens of milliseconds).
  warm() {
    if (!this.waves) this.waves = (this._waves || new Waves()).texture(this.gl, this.state);
    this._waves = null;
  }

  // The texture of small waves to draw with. If it is not made yet (water
  // came before the warm-up was over, or there was no start card): in play
  // a step of it is taken now and the water is drawn flat for this frame,
  // a dozen frames in all; anywhere else (a harness that draws one frame
  // and looks at it) it is finished at once.
  _ripples(paced) {
    if (this.waves) return this.waves;
    const gl = this.gl, st = this.state;
    if (!paced) {
      this.warm();
      return this.waves;
    }
    if (!this._waves) this._waves = new Waves();
    if (this._waves.step(WARM_MS)) {
      this.waves = this._waves.texture(gl, st);
      this._waves = null;
      return this.waves;
    }
    if (!this._flat) {
      // Level water: no slope, mid height, no line of foam.
      st.texForUpload(UNIT.uTex3, gl.TEXTURE_2D, null);
      this._flat = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.REPEAT);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));
      st.units[st.unit] = this._flat;
    }
    return this._flat;
  }

  // P: what programs() returned for the tier being switched to.
  configure(P) {
    this.P = P;
    if (!P.refract && this.copy) {
      freeTarget(this.gl, this.copy);
      this.copy = null;
    }
  }

  // The engine was re-initialised: its buffers hold another scene's water.
  reset() {
    this.rectRev = -1;
    this.hosts.rev = -1;
    this.fresh = true;
    this.rects.count = this.tiles.count = this.parcels.count = 0;
    this.inView = this.animating = false;
    this.under = -1;
    this.hidden = false;
    this._stale = this._asked;
    this._wetClear = true;
    this._wetRev = -1;
    this._flowRev = -1;
    this._flowSeen = -1;
    this._flowAt = -1e9;
    this.swell = 0;
    this.landed = false;
    this._landUntil = -1;
  }

  // The map of what is wet, for the surface shader: a texture laid over
  // the density volume's box (look up at world xz * uOccInv.xy), a texel a
  // water column, RGBA16F, filtered; r: wetness, 1 where water lies and
  // falling to 0 as it dries; b: r times the wet line, the world height
  // water stands or last stood at there (m; it comes down a centimetre a
  // second above water that has fallen): read the line as b / r, which
  // holds at the rim of a wet patch too. (g is the line itself, unfiltered
  // use only.) Null until there has been water, and where no half-float
  // target can be drawn to. Not the same texture from frame to frame: ask
  // each frame.
  get wet() {
    return this._wet ? this._wet.tex : null;
  }

  // Whether a swell is running, and the still water from above for its
  // rectangles to read. A swell is a river cut into cells: many times the
  // rectangles the still water has when it is calm, changing from step to
  // step. (A tank that drains changes its rectangles' level too, and is
  // no swell: it is flat, and reads no map.) The map is drawn again only
  // on frames in which a swell is running, its rectangles changed and
  // water is in view. frame: the frame block (for the box); time: the
  // sim's step count.
  _flowPass(frame, time, f32, rp) {
    const gl = this.gl, st = this.state, P = this.P, n = this.rects.count;
    if (!P || !P.flow || n === 0) {
      this.swell = 0;
      this._flowSeen = -1;
      return;
    }
    if (time < this._flowAt) this._flowAt = -1e9;
    if (this._flowSeen !== this.rectRev) {
      // (The first sight of a scene's still water is not a change; nor is
      // any while the rectangles are as few as at rest.)
      if (this._flowSeen === -1 || n < this._calm) this._calm = n;
      else if (n > this._calm * 2 + 16) this._flowAt = time;
      this._flowSeen = this.rectRev;
    }
    this.swell = Math.max(0, Math.min(1, 1 - (time - this._flowAt - SWELL_HOLDS) / SWELL_FADES));
    // (Water in the air over still water wants the map too: where it
    // comes down is found at the level the map gives: `_landPass`.)
    // (And a body that stands over the eye: its side is found by it.)
    if ((this.swell <= 0 && this.parcels.count === 0 && !this.overEye) || !this.inView || this._flowRev === this.rectRev) return;
    const ix = frame.data[F.OCC_INV], iz = frame.data[F.OCC_INV + 1];
    if (!(ix > 0 && iz > 0)) {
      this.swell = 0;
      this._flowRev = -1;
      return;
    }
    const w = Math.min(1024, Math.max(4, Math.round(5 / ix))), h = Math.min(1024, Math.max(4, Math.round(5 / iz)));
    let t = this._flow;
    if (!t || t.w !== w || t.h !== h) {
      if (t) {
        gl.deleteRenderbuffer(t.rb);
        freeTarget(gl, t);
      }
      st.texForUpload(UNIT.uTex2, gl.TEXTURE_2D, null);
      t = this._flow = makeFlowMap(gl, w, h);
      t.ix = ix;
      t.iz = iz;
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.units[st.unit] = null;
      st.target = undefined;
    }
    this._flowRev = this.rectRev;
    if (this.swell > 0) this._junctions(f32, rp, n);
    st.tex(UNIT.uTex2, gl.TEXTURE_2D, null);
    st.fbo(t);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.blend(BLEND.OFF);
    // Where rectangles lie over each other the higher level is kept.
    st.depth(true, true, gl.LESS);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    st.vao(this.rects.vao);
    gl.uniform4f(st.program(P.flow).uWetInv, ix, iz, 0, 0);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
    st.depth(false, false, gl.LESS);
    st.vao(null);
    st.tex(UNIT.uTex2, gl.TEXTURE_2D, t.tex);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  // What the still water has just been through, as a map from above it
  // reads: white where water in the air has come down on it in the last
  // seconds, and how fast its level is rising (a front that travels).
  // Kept only while something has landed lately or a swell runs
  // (LAND_STAYS steps past either): each frame the
  // sim stepped, the map fades into its other copy, carried with the flow,
  // and the parcels that land in those steps are added. frame: the frame
  // block (for the box); time: the sim's step count.
  _landPass(frame, time) {
    const gl = this.gl, st = this.state, P = this.P;
    const steps = Math.min(time - this._landTime, 6);
    this._landTime = time;
    if (!P || !P.land) {
      this.landed = false;
      return;
    }
    const f = this._flow, live = !!f && this._flowRev === this.rectRev;
    const falling = live && this.parcels.count > 0 && this.rects.count > 0;
    if (steps < 0) this._landUntil = -1;
    // (While a swell runs the map is kept up for the level's rise.)
    if (falling || (live && this.swell > 0)) this._landUntil = time + LAND_STAYS;
    if (!(time < this._landUntil)) {
      this.landed = false;
      return;
    }
    if (steps <= 0) return;
    const ix = frame.data[F.OCC_INV], iz = frame.data[F.OCC_INV + 1];
    if (!(ix > 0 && iz > 0)) return;
    const w = Math.min(1024, Math.max(4, Math.round(4 / ix))), h = Math.min(1024, Math.max(4, Math.round(4 / iz)));
    let t = this._land, fresh = !this.landed;
    if (!t || t.w !== w || t.h !== h) {
      freeTarget(gl, t);
      freeTarget(gl, this._landWas);
      st.texForUpload(UNIT.uTex4, gl.TEXTURE_2D, null);
      t = this._land = makeTarget(gl, w, h, gl.RGBA16F, gl.LINEAR);
      this._landWas = makeTarget(gl, w, h, gl.RGBA16F, gl.LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.units[st.unit] = null;
      st.target = undefined;
      fresh = true;
    }
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.tex(UNIT.uTex2, gl.TEXTURE_2D, live ? f.tex : null);
    if (fresh) {
      st.tex(UNIT.uTex4, gl.TEXTURE_2D, null);
      st.fbo(t);
      // (No white, no water known, no rise.)
      gl.clearColor(0, -1000, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    } else {
      const was = t;
      t = this._land = this._landWas;
      this._landWas = was;
      st.tex(UNIT.uTex4, gl.TEXTURE_2D, was.tex);
      st.fbo(t);
      st.blend(BLEND.OFF);
      st.vao(this._plain);
      const u = st.program(P.landFade), dt = steps / 60;
      gl.uniform4f(u.uFlowInv, 0, 0, 0, live ? 1 : 0);
      gl.uniform4f(u.uFade, dt * ix, dt * iz, Math.pow(LAND_KEEPS, steps), LAND_LOSES * steps);
      gl.uniform4f(u.uRise, dt, Math.pow(RISE_KEEPS, steps), 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.tex(UNIT.uTex4, gl.TEXTURE_2D, null);
    }
    t.ix = ix;
    t.iz = iz;
    if (falling) {
      st.blend(BLEND.ADD);
      st.vao(this.parcels.vao);
      gl.uniform4f(st.program(P.land).uFlowInv, ix, iz, steps / 60 + 0.004, 1);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.parcels.count);
    }
    st.vao(null);
    this.landed = true;
  }

  // Brings the map of what is wet up to this frame. frame: the frame
  // block (for the box); time: the sim's step count; moved: the sim has
  // stepped since the last frame.
  _wetPass(frame, time, moved) {
    const gl = this.gl, st = this.state, P = this.P;
    if (!P || !P.wetTiles) {
      // A tier whose surfaces do not read the map: none is kept.
      if (this._wet) {
        freeTarget(gl, this._wet);
        freeTarget(gl, this._wetWas);
        this._wet = this._wetWas = null;
      }
      return;
    }
    const water = this.rects.count + this.tiles.count > 0;
    if (!this._wet && !water) return;
    const ix = frame.data[F.OCC_INV], iz = frame.data[F.OCC_INV + 1];
    if (!(ix > 0 && iz > 0)) return;
    const w = Math.min(2048, Math.max(1, Math.round(10 / ix))), h = Math.min(2048, Math.max(1, Math.round(10 / iz)));
    let t = this._wet, fresh = this._wetClear;
    if (!t || t.w !== w || t.h !== h) {
      freeTarget(gl, t);
      freeTarget(gl, this._wetWas);
      st.texForUpload(UNIT.uTex4, gl.TEXTURE_2D, null);
      t = this._wet = makeTarget(gl, w, h, gl.RGBA16F, gl.LINEAR);
      this._wetWas = makeTarget(gl, w, h, gl.RGBA16F, gl.LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.units[st.unit] = null;
      st.target = undefined;
      fresh = true;
    }
    const tick = Math.floor(time / WET_EVERY);
    if (fresh || tick < this._wetTick) {
      this._wetClear = false;
      this._wetTick = tick;
      this._wetUntil = -1;
      this._wetRev = -1;
    }
    // Dryings owed (a few at most: after a long pause it is not made up).
    const dry = time < this._wetUntil ? Math.min(tick - this._wetTick, 4) : 0;
    this._wetTick = tick;
    const still = this.rects.count > 0 && (dry > 0 || fresh || this._wetRev !== this.rectRev);
    const moving = this.tiles.count > 0 && this.atlas && (moved || fresh);
    if (!fresh && dry <= 0 && !still && !moving) return;
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    if (dry > 0 && !fresh) {
      // The map as it is, a little drier, into its other copy; the two
      // change places.
      const was = t;
      t = this._wet = this._wetWas;
      this._wetWas = was;
      st.tex(UNIT.uTex4, gl.TEXTURE_2D, was.tex);
      st.fbo(t);
      st.blend(BLEND.OFF);
      st.vao(this._plain);
      gl.uniform4f(st.program(P.wetDry).uDry, dry * WET_EVERY / 60 / WET_DRIES, dry * WET_EVERY / 60 * WET_FALLS, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.tex(UNIT.uTex4, gl.TEXTURE_2D, null);
    }
    st.fbo(t);
    if (fresh) {
      // Dry everywhere, and no wet line anywhere.
      gl.clearColor(0, -1000, 0, -1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    // Water raises what is there, never lowers it.
    st.blend(BLEND.ADD);
    gl.blendEquation(gl.MAX);
    if (still) {
      st.vao(this.rects.vao);
      gl.uniform4f(st.program(P.wetRects).uWetInv, ix, iz, 0, 0);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.rects.count);
      this._wetRev = this.rectRev;
    }
    if (moving) {
      st.tex(UNIT.uTex2, gl.TEXTURE_2D, this.atlas);
      st.vao(this.tiles.vao);
      const u = st.program(P.wetTiles);
      gl.uniform4f(u.uWetInv, ix, iz, 0, 0);
      gl.uniform4i(u.uAtlas, COLUMN, 0, 0, 0);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.tiles.count);
    }
    gl.blendEquation(gl.FUNC_ADD);
    st.vao(null);
    if (water) this._wetUntil = time + (WET_DRIES + 2) * 60;
  }

  // The T-junctions of a swell's rectangles: each corner is given the
  // edge it lies along, if any (`findEdges`), and the vertex stage puts it
  // there. f32, rp: the engine's rectangles; n: how many. Once per change
  // of the rectangles while a swell runs.
  _junctions(f32, rp, n) {
    const gl = this.gl, h = this.hosts;
    h.rev = -1;
    if (n > HOSTS_MAX || n * HOST_STRIDE > h.cap) return;
    const d = findEdges(h.edges, f32, rp, n);
    gl.bindBuffer(gl.ARRAY_BUFFER, h.buf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, d, 0, n * HOST_STRIDE);
    h.rev = this.rectRev;
  }

  _reserve(set, floats) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, set.buf);
    if (floats <= set.cap) return;
    set.cap = Math.max(1024, floats * 2);
    gl.bufferData(gl.ARRAY_BUFFER, set.cap * 4, gl.DYNAMIC_DRAW);
  }

  // Sends patches [first, first + n) to the atlas: one call per column they span.
  _sendPatches(u16, at, first, n) {
    const gl = this.gl;
    while (n > 0) {
      const col = Math.floor(first / COLUMN), row = first % COLUMN, run = Math.min(n, COLUMN - row);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, col * PATCH, row * PATCH, PATCH, PATCH * run, gl.RGBA, gl.HALF_FLOAT, u16, at + first * PATCH_WORDS);
      first += run;
      n -= run;
    }
  }

  // Takes this frame's water in. engine: the sim's frame (its views are
  // current); out: the out block; frame: the frame block, camera already
  // set; cam: the camera position; again: the second eye of a VR frame
  // (everything was uploaded by the first; the dirty list must not be
  // applied twice to a texture that may have grown in between).
  update(engine, out, frame, cam, again) {
    const gl = this.gl, st = this.state;
    const b = out[OUT.WATER_PTR] >> 2, u32 = engine.u32, f32 = engine.f32;
    const rects = this.rects, tiles = this.tiles, parcels = this.parcels;
    const time = out[OUT.STAT_FRAME];
    if (!b) {
      rects.count = tiles.count = parcels.count = 0;
      this.inView = this.animating = false;
      this.under = -1;
      return;
    }
    const nRects = u32[b + WATER.RECT_COUNT], nTiles = u32[b + WATER.TILE_COUNT], nParcels = u32[b + WATER.PARCEL_COUNT];
    const rp = u32[b + WATER.RECT_PTR] >> 2, tp = u32[b + WATER.TILE_PTR] >> 2, pp = u32[b + WATER.PARCEL_PTR] >> 2;
    if (!again) {
      this.uploaded = 0;
      const rev = u32[b + WATER.RECT_REV];
      if (nRects > 0 && (rev !== this.rectRev || nRects !== rects.count)) {
        this._reserve(rects, nRects * WATER.RECT_STRIDE);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, f32, rp, nRects * WATER.RECT_STRIDE);
        // (Room beside them for their corners' edges: zeros, no edge,
        // until a swell asks for them.)
        const h = this.hosts;
        h.rev = -1;
        if (nRects * HOST_STRIDE > h.cap) {
          h.cap = nRects * HOST_STRIDE * 2;
          gl.bindBuffer(gl.ARRAY_BUFFER, h.buf);
          gl.bufferData(gl.ARRAY_BUFFER, h.cap * 4, gl.DYNAMIC_DRAW);
        }
      }
      this.rectRev = rev;
      rects.count = nRects;
      tiles.count = nTiles;
      parcels.count = nParcels;
      if (nParcels > 0) {
        this._reserve(parcels, nParcels * WATER.PARCEL_STRIDE);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, f32, pp, nParcels * WATER.PARCEL_STRIDE);
      }
      if (nTiles > 0) {
        this._reserve(tiles, nTiles * WATER.TILE_STRIDE);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, f32, tp, nTiles * WATER.TILE_STRIDE);
        if (this._buf !== u32.buffer) {
          this._buf = u32.buffer;
          this._u16 = new Uint16Array(this._buf);
        }
        const u16 = this._u16, at = u32[b + WATER.PATCH_PTR] >> 1, slots = u32[b + WATER.PATCHES];
        let all = this.fresh;
        if (!this.atlas || slots > this.atlasCols * COLUMN) {
          // Room for every patch slot there is, and as much again.
          let cols = Math.max(this.atlasCols, 2);
          while (cols * COLUMN < slots) cols *= 2;
          if (this.atlas) gl.deleteTexture(this.atlas);
          st.texForUpload(UNIT.uTex2, gl.TEXTURE_2D, null);
          this.atlas = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.CLAMP_TO_EDGE);
          gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, cols * PATCH, COLUMN * PATCH);
          st.units[st.unit] = this.atlas;
          this.atlasCols = cols;
          all = true;
        }
        st.texForUpload(UNIT.uTex2, gl.TEXTURE_2D, this.atlas);
        if (all) {
          // Up to the last patch a tile has: there may be nothing behind
          // it (a frame that came as a packet holds no more).
          let most = 0;
          for (let i = 0; i < nTiles; i++) most = Math.max(most, f32[tp + i * WATER.TILE_STRIDE + 3] + 1);
          most = Math.min(most, slots);
          this._sendPatches(u16, at, 0, most);
          this.uploaded = most;
        } else {
          // The dirty list is in rising order: runs of neighbours go up together.
          const dp = u32[b + WATER.DIRTY_PTR] >> 2, dn = u32[b + WATER.DIRTY_COUNT];
          for (let i = 0; i < dn;) {
            const first = u32[dp + i];
            let n = 1;
            while (i + n < dn && u32[dp + i + n] === first + n) n++;
            if (first + n <= slots) this._sendPatches(u16, at, first, n);
            i += n;
          }
          this.uploaded = dn;
        }
      }
      // (A frame without tiles sends nothing: when there are tiles again,
      // every patch goes up once rather than trusting the lists across the gap.)
      this.fresh = nTiles === 0;
    }
    this._look(f32, rp, nRects, tp, nTiles, pp, nParcels, frame, cam, u32[b + WATER.PATCH_PTR] >> 1);
    if (!again) {
      this._flowPass(frame, time, f32, rp);
      this._landPass(frame, time);
      this._wetPass(frame, time, time !== this._time);
      this.animating = this.inView && !this.hidden && time !== this._time;
      this._time = time;
    }
  }

  // Is any water in view, and is the camera under a surface? Bounded work:
  // one box test per rectangle (the first CULL_MAX), one per tile and one
  // for all the water in the air together.
  _look(f32, rp, nRects, tp, nTiles, pp, nParcels, frame, cam, patches) {
    const pl = this._planes;
    frame.frustumPlanes(pl, 1, 1280, 720);
    const cx = cam[0], cy = cam[1], cz = cam[2];
    // A box outside one plane with all its corners is not in view.
    const boxSeen = (x0, y0, z0, x1, y1, z1) => {
      for (let k = 0; k < 20; k += 4) {
        const nx = pl[k], ny = pl[k + 1], nz = pl[k + 2];
        if ((nx > 0 ? x1 : x0) * nx + (ny > 0 ? y1 : y0) * ny + (nz > 0 ? z1 : z0) * nz + pl[k + 3] < 0) return false;
      }
      return true;
    };
    let seen = nRects > CULL_MAX, under = -1, over = false;
    for (let i = 0, n = Math.min(nRects, CULL_MAX); i < n; i++) {
      const o = rp + i * WATER.RECT_STRIDE;
      const x0 = f32[o], z0 = f32[o + 1], x1 = f32[o + 2], z1 = f32[o + 3], y = f32[o + 4];
      if (cx >= x0 && cx <= x1 && cz >= z0 && cz <= z1 && cy < y && cy > y - f32[o + 7] - 0.2) under = Math.max(under, y - cy);
      if (y > cy + 0.3) over = true;
      // (A swell lifts a corner over its rectangle's level: half a metre of room.)
      if (!seen) seen = boxSeen(x0, y - 0.1, z0, x1, y + 0.6, z1);
    }
    // A tile: its square of ground, some metres either side of its base
    // (a patch holds heights about it: the mean level of its columns).
    for (let i = 0; i < nTiles && !seen; i++) {
      const o = tp + i * WATER.TILE_STRIDE, x = f32[o], z = f32[o + 1], y = f32[o + 2];
      seen = boxSeen(x, y - 8, z, x + TILE_M, y + 8, z + TILE_M);
    }
    if (!seen && nParcels > 0) {
      // The water in the air: one box round all of it.
      let x0 = 1e9, y0 = 1e9, z0 = 1e9, x1 = -1e9, y1 = -1e9, z1 = -1e9;
      for (let i = 0, o = pp; i < nParcels; i++, o += WATER.PARCEL_STRIDE) {
        const x = f32[o], y = f32[o + 1], z = f32[o + 2];
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (z < z0) z0 = z; if (z > z1) z1 = z;
      }
      seen = boxSeen(x0 - 2, y0 - 2, z0 - 2, x1 + 2, y1 + 2, z1 + 2);
    }
    if (under < 0 && nTiles > 0 && this._u16) {
      const u16 = this._u16;
      for (let i = 0; i < nTiles; i++) {
        const o = tp + i * WATER.TILE_STRIDE, x = cx - f32[o], z = cz - f32[o + 1];
        if (x < 0 || z < 0 || x >= TILE_M || z >= TILE_M) continue;
        // The column the camera stands in: its texel of the tile's patch.
        const t = patches + f32[o + 3] * PATCH_WORDS + ((Math.floor(z * 10) + 1) * PATCH + Math.floor(x * 10) + 1) * 4;
        const top = f32[o + 2] + half(u16[t]), depth = half(u16[t + 1]);
        if (depth > 0.1 && cy < top && cy > top - depth - 0.1) under = Math.max(under, top - cy);
      }
    }
    this.inView = seen;
    this.under = under;
    this.overEye = over;
  }

  // The scene's colour as it stands, for the surface to bend and tint.
  _copyScene(post) {
    const gl = this.gl, st = this.state;
    let c = this.copy;
    if (!c || c.w !== post.w || c.h !== post.h || this.copyFormat !== post.sceneFormat) {
      freeTarget(gl, c);
      st.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
      c = this.copy = makeTarget(gl, post.w, post.h, post.sceneFormat, gl.LINEAR);
      this.copyFormat = post.sceneFormat;
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.units[st.unit] = null;
    }
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, post.sceneColor.fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, c.fbo);
    st.target = undefined;
    st.scissor(false);
    gl.blitFramebuffer(0, 0, post.w, post.h, 0, 0, post.w, post.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  }

  // Asks whether the rectangles about to be drawn show at all, and takes in
  // the answer to the last such question. True when a query was begun (the
  // caller ends it with _asking()); one question at a time.
  _ask() {
    const gl = this.gl;
    if (this._asked) {
      if (!gl.getQueryParameter(this._query, gl.QUERY_RESULT_AVAILABLE)) return false;
      if (!this._stale) this.hidden = !gl.getQueryParameter(this._query, gl.QUERY_RESULT);
      this._asked = this._stale = false;
    }
    if (!this._query) this._query = gl.createQuery();
    gl.beginQuery(gl.ANY_SAMPLES_PASSED_CONSERVATIVE, this._query);
    return true;
  }

  _asking() {
    this.gl.endQuery(this.gl.ANY_SAMPLES_PASSED_CONSERVATIVE);
    this._asked = true;
  }

  // Draws the water over the scene (opaque world, sky and glass are in it;
  // the soft particles are not yet). post: the Post chain; plain: an
  // attribute-less vertex array for the fullscreen draws, left bound;
  // probe: still water that does not show may be left out (frames follow
  // each other, so finding out a frame late that it shows again is fine).
  // Returns the draws issued.
  draw(post, plain, probe) {
    this._over = null;
    if (!this.inView && this.under < 0) return 0;
    const gl = this.gl, st = this.state, P = this.P;
    const waves = this._ripples(probe);
    // What the occlusion query said holds from one frame to the next. After
    // a gap (a page that draws a frame now and then, a tab that was away)
    // it is about another view: the water is drawn, and asked about again.
    const now = performance.now();
    if (now - this._drawnAt > 250) {
      this.hidden = false;
      this._stale = this._asked;
    }
    this._drawnAt = now;
    let draws = 0;
    // Only still water, seen from the air, can be hidden for long.
    const alone = probe && this.rects.count > 0 && this.tiles.count === 0 && this.parcels.count === 0 && this.under < 0;
    if (!alone) {
      this.hidden = false;
      this._stale = this._asked;
    }
    if (this.inView && alone && this.hidden) {
      st.fbo(post.sceneColor);
      st.depth(false, false, gl.LESS);
      st.cull(CULL.OFF);
      st.scissor(false);
      st.blend(BLEND.PREMUL);
      st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
      st.vao(this.rects.vao);
      st.program(P.probe);
      const asked = this._ask();
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.rects.count);
      if (asked) this._asking();
      st.vao(plain);
      return 1;
    }
    if (this.inView) {
      if (P.refract) {
        st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
        this._copyScene(post);
        draws++;
      }
      st.depth(false, false, gl.LESS);
      st.cull(CULL.OFF);
      st.scissor(false);
      st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
      st.tex(UNIT.uTex3, gl.TEXTURE_2D, waves);
      // Water in the air first, as thickness summed at reduced resolution:
      // the moving water under it reads the layer to know where it lands.
      const step = P.spray, layered = this.parcels.count > 0 && step > 0;
      const lw = Math.ceil(post.w / (step || 1)), lh = Math.ceil(post.h / (step || 1));
      if (layered) {
        let layer = this.spray;
        if (!layer || layer.w !== lw || layer.h !== lh) {
          freeTarget(gl, layer);
          st.texForUpload(UNIT.uTex4, gl.TEXTURE_2D, null);
          layer = this.spray = makeLayer(gl, lw, lh);
          gl.bindTexture(gl.TEXTURE_2D, null);
          st.units[st.unit] = null;
          st.target = undefined;
        }
        st.tex(UNIT.uTex4, gl.TEXTURE_2D, null);
        st.fbo(layer);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        st.blend(BLEND.ADD);
        st.vao(this.parcels.vao);
        gl.uniform1i(st.program(P.parcels).uStep, step);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.parcels.count);
        st.tex(UNIT.uTex4, gl.TEXTURE_2D, layer.tex);
        // (Its coarser levels are the mist round the water: WATER_SPRAY_UP_FS.)
        gl.generateMipmap(gl.TEXTURE_2D);
        draws++;
      }
      st.fbo(post.sceneColor);
      st.blend(BLEND.PREMUL);
      if (P.refract) st.tex(UNIT.uTex, gl.TEXTURE_2D, this.copy.tex);
      const under = this.under >= 0 ? 1 : 0;
      if (this.rects.count > 0) {
        st.vao(this.rects.vao);
        const map = this._flow;
        if (P.sides && this.overEye && under === 0 && map && this._flowRev === this.rectRev) {
          // The sides of what stands over the eye first: the surfaces are
          // drawn over them.
          st.tex(UNIT.uTex2, gl.TEXTURE_2D, map.tex);
          const us = st.program(P.sides);
          gl.uniform4f(us.uUnder, 0, 0, 0, 0);
          gl.uniform4f(us.uSideInv, map.ix, map.iz, 0, 1);
          gl.drawArraysInstanced(gl.TRIANGLES, 0, 24, this.rects.count);
          draws++;
        }
        const u = st.program(P.rects);
        gl.uniform4f(u.uUnder, under, 0, 0, 0);
        if (u.uFlowInv) {
          const f = this._flow;
          st.tex(UNIT.uTex2, gl.TEXTURE_2D, f ? f.tex : null);
          // (A cell of a swell is 0.8 m: four texels of the map.)
          // (The map is this frame's only if the swell was in view when the
          // frame was taken in; else the water is drawn calm for a frame.)
          gl.uniform4f(u.uFlowInv, f ? f.ix : 0, f ? f.iz : 0, this.hosts.rev === this.rectRev ? 1 : 0, f && this._flowRev === this.rectRev ? this.swell : 0);
          gl.uniform4f(u.uFlowStep, f ? 4 / f.w : 0, f ? 4 / f.h : 0, f ? 4 / (f.w * f.ix) : 1, f ? 4 / (f.h * f.iz) : 1);
          const l = this.landed ? this._land : null;
          st.tex(UNIT.uTex4, gl.TEXTURE_2D, l ? l.tex : null);
          gl.uniform4f(u.uLandInv, l ? l.ix : 0, l ? l.iz : 0, 0, l ? 1 : 0);
        }
        const asked = alone && this._ask();
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.rects.count);
        if (asked) this._asking();
        draws++;
        // (The unit is the air water's layer's for what is drawn next.)
        if (u.uLandInv) st.tex(UNIT.uTex4, gl.TEXTURE_2D, layered ? this.spray.tex : null);
      }
      if (this.tiles.count > 0 && this.atlas) {
        st.tex(UNIT.uTex2, gl.TEXTURE_2D, this.atlas);
        st.vao(this.tiles.vao);
        const u = st.program(P.tiles);
        gl.uniform4f(u.uUnder, under, 0, 0, 0);
        // (A step of 0 says there is no layer to read this frame.)
        gl.uniform4f(u.uSprayInv, 1 / lw, 1 / lh, layered ? step : 0, 0);
        if (P.tiles.cols !== this.atlasCols) {
          gl.uniform4i(u.uAtlas, COLUMN, 0, 0, 0);
          gl.uniform4f(u.uAtlasInv, 1 / (this.atlasCols * PATCH), 1 / (COLUMN * PATCH), 0, 0);
          P.tiles.cols = this.atlasCols;
        }
        gl.drawElementsInstanced(gl.TRIANGLES, GRID * GRID * 6, gl.UNSIGNED_SHORT, 0, this.tiles.count);
        draws++;
      }
      if (layered) {
        // The water in the air, over the scene as one body.
        st.vao(plain);
        gl.uniform4f(st.program(P.sprayUp).uSprayInv, 1 / lw, 1 / lh, step, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        draws++;
        this._over = this.spray;
      } else if (this.parcels.count > 0) {
        st.vao(this.parcels.vao);
        st.program(P.parcels);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.parcels.count);
        draws++;
      }
    }
    st.vao(plain);
    if (this.under >= 0) {
      // The camera is in the water: absorb, then add the water's own colour.
      st.fbo(post.sceneColor);
      st.depth(false, false, gl.LESS);
      st.cull(CULL.OFF);
      st.scissor(false);
      st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
      const u = st.program(P.under);
      st.blend(BLEND.MULTIPLY);
      gl.uniform4f(u.uUnder, this.under, 0, 1, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.blend(BLEND.ADD);
      gl.uniform4f(u.uUnder, this.under, 1, Math.exp(-0.5 * this.under), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      draws += 2;
    }
    return draws;
  }

  // The water in the air once more, over the dust and smoke that were drawn
  // after it, at part strength. The gas layer knows nothing of the water
  // and covers all of it, though a burst tank's spray is in the cloud of
  // its own wall and not behind it: so some of it shows through. Called by
  // the renderer after the gas, on frames that drew gas; costs one
  // full-screen draw on frames in which water is in the air. Returns the
  // draws issued.
  drawOver(post, plain) {
    const layer = this._over, P = this.P;
    if (!layer || !P.sprayOver) return 0;
    const gl = this.gl, st = this.state;
    st.fbo(post.sceneColor);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.blend(BLEND.PREMUL);
    st.tex(UNIT.uDepth, gl.TEXTURE_2D, post.scene.depth);
    st.tex(UNIT.uTex3, gl.TEXTURE_2D, this.waves || this._flat);
    st.tex(UNIT.uTex4, gl.TEXTURE_2D, layer.tex);
    st.vao(plain);
    gl.uniform4f(st.program(P.sprayOver).uSprayInv, 1 / layer.w, 1 / layer.h, P.spray, OVER);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return 1;
  }
}

// The map the still water is drawn into from above: a half-float target
// with all its coarser levels and a depth buffer of its own.
function makeFlowMap(gl, w, h) {
  const t = { w, h, ix: 0, iz: 0, fbo: gl.createFramebuffer(), tex: null, depth: null, ownsDepth: false, rb: gl.createRenderbuffer() };
  gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
  t.tex = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE);
  gl.texStorage2D(gl.TEXTURE_2D, Math.floor(Math.log2(Math.max(w, h))) + 1, gl.RGBA16F, w, h);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
  gl.bindRenderbuffer(gl.RENDERBUFFER, t.rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, t.rb);
  return t;
}

// The layer water in the air is summed into: a half-float target with a
// few coarser levels, which are made from it after it is drawn.
function makeLayer(gl, w, h) {
  const t = { w, h, fbo: gl.createFramebuffer(), tex: null, depth: null, ownsDepth: false };
  gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
  t.tex = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE);
  gl.texStorage2D(gl.TEXTURE_2D, Math.min(5, Math.floor(Math.log2(Math.max(w, h))) + 1), gl.RGBA16F, w, h);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
  return t;
}

// How much of the water in the air shows through dust and smoke (drawOver).
const OVER = 0.7;

const WAVES = 128;
const TRAINS = 36;
// Milliseconds of the page's thread a step of the warm-up may take.
const WARM_MS = 1.5;

// The small waves every surface is rippled by: a tiling field of 128 x 128
// texels made of trains of sine waves (whole wave numbers, so it repeats),
// most of them running with one wind. r, g: the slope along x and z, 0.5 =
// level, scaled so the steepest texel is at an end of the range; b: the
// height; a: foam cells, 0 on the lines between cells (the distance to the
// nearest of a scatter of points less that to the second nearest).
//
// It is tens of milliseconds of work on the page's thread, so it is made
// in steps: `step(ms)` works for about that long and says whether all of
// it is done, `texture()` uploads the result. Behind the start card a step
// is taken a frame (WaterPass.warmUp); in play, if water comes before
// that is over, a step is taken a frame too and the water is drawn
// without its small waves for those frames (WaterPass._ripples).
class Waves {
  constructor() {
    const N = WAVES;
    this.seed = 0x2545f491;
    this.sin = new Float32Array(N);
    for (let i = 0; i < N; i++) this.sin[i] = Math.sin(i / N * 2 * Math.PI);
    this.h = new Float32Array(N * N);
    this.sx = new Float32Array(N * N);
    this.sz = new Float32Array(N * N);
    this.px = new Uint8Array(N * N * 4);
    // The trains: wave numbers from 2 to 30 across the tile, half of them
    // within a quarter turn of the wind and the rest any way. [i, j,
    // amplitude, phase] each (amplitude 0: none).
    this.trains = new Float32Array(TRAINS * 4);
    for (let w = 0; w < TRAINS; w++) {
      const k = 2 + 28 * this.rnd();
      const dir = (this.rnd() < 0.5 ? (this.rnd() - 0.5) * 1.6 : this.rnd() * 6.2832) + 0.5;
      const i = Math.round(k * Math.cos(dir)), j = Math.round(k * Math.sin(dir));
      if (i === 0 && j === 0) continue;
      this.trains.set([i, j, Math.pow(Math.hypot(i, j), -1.25), Math.floor(this.rnd() * N)], w * 4);
    }
    this.train = 0;     // wave trains laid down
    this.band = 0;      // ... and rows of the one in hand
    this.row = 0;       // rows of texels written
    this.pts = null;    // the foam cells' points
    this.top = 1e-6;
    this.hi = 1e-6;
  }

  rnd() {
    let seed = this.seed;
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    this.seed = seed;
    return (seed >>> 0) / 4294967296;
  }

  // The next piece of the work: bands of rows, of a wave train or of the
  // finished texels, until `ms` milliseconds have gone (one band at least;
  // the first bands of a session run in code that is not compiled yet, so
  // a count of them would not bound the time). True when nothing is left.
  step(ms = 1e9) {
    const N = WAVES, BAND = 16, sin = this.sin, h = this.h, sx = this.sx, sz = this.sz;
    const until = performance.now() + ms;
    while (this.train < TRAINS) {
      const q = this.train * 4, i = this.trains[q], j = this.trains[q + 1], amp = this.trains[q + 2], phase = this.trains[q + 3];
      if (amp > 0) {
        // (N is a power of two: the phase wraps with a mask.)
        for (let y = this.band, o = y * N, end = y + BAND; y < end; y++) {
          for (let x = 0, t = j * y + phase; x < N; x++, o++, t += i) {
            const c = sin[(t + N / 4) & (N - 1)] * amp;
            h[o] += sin[t & (N - 1)] * amp;
            sx[o] += c * i;
            sz[o] += c * j;
          }
        }
        this.band += BAND;
      } else this.band = N;
      if (this.band >= N) {
        this.band = 0;
        this.train++;
      }
      if (performance.now() >= until) return false;
    }
    // Foam: one point in each cell of a 16 x 16 lattice.
    const C = 16, cell = N / C;
    if (!this.pts) {
      let top = 1e-6, hi = 1e-6;
      for (let o = 0; o < N * N; o++) {
        top = Math.max(top, Math.abs(sx[o]), Math.abs(sz[o]));
        hi = Math.max(hi, Math.abs(h[o]));
      }
      this.top = top;
      this.hi = hi;
      const pts = this.pts = new Float32Array(C * C * 2);
      for (let o = 0; o < C * C; o++) {
        pts[o * 2] = ((o % C) + this.rnd()) * cell;
        pts[o * 2 + 1] = (Math.floor(o / C) + this.rnd()) * cell;
      }
      if (performance.now() >= until) return false;
    }
    const pts = this.pts, px = this.px, top = this.top, hi = this.hi;
    while (this.row < N) {
      for (const end = this.row + 4; this.row < end; this.row++) {
        const y = this.row;
        for (let x = 0; x < N; x++) {
          let d1 = 1e9, d2 = 1e9;
          const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
          for (let v = -1; v <= 1; v++) {
            for (let u = -1; u <= 1; u++) {
              const gx = (cx + u + C) % C, gy = (cy + v + C) % C, q = (gx + gy * C) * 2;
              // (The lattice wraps: a point is taken at its nearest image.)
              let dx = pts[q] - x, dy = pts[q + 1] - y;
              dx -= Math.round(dx / N) * N;
              dy -= Math.round(dy / N) * N;
              const d = Math.hypot(dx, dy);
              if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
            }
          }
          const o = (x + y * N) * 4, f = x + y * N;
          px[o] = Math.round(127.5 + 127.5 * sx[f] / top);
          px[o + 1] = Math.round(127.5 + 127.5 * sz[f] / top);
          px[o + 2] = Math.round(127.5 + 127.5 * h[f] / hi);
          px[o + 3] = Math.round(255 * Math.min((d2 - d1) / (cell * 0.75), 1));
        }
      }
      if (this.row < N && performance.now() >= until) return false;
    }
    return true;
  }

  texture(gl, st) {
    while (!this.step());
    st.texForUpload(UNIT.uTex3, gl.TEXTURE_2D, null);
    const t = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, WAVES, WAVES, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.px);
    gl.generateMipmap(gl.TEXTURE_2D);
    st.units[st.unit] = t;
    return t;
  }
}

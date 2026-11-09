// Cascaded sun shadows with caching. Camera cascades are squares centred on
// the camera in light space (rotation-invariant, so turning the head never
// invalidates them) and snapped to a coarse grid that is a whole number of
// shadow texels; the last cascade always covers the entire world and never
// moves.
//
// Each cascade is kept in three layers. The world's holds the static world
// and is redrawn when the cascade moves, the sun moves or the world is
// edited inside it. The resting layer holds the bodies that lie still, and
// nothing else: a body that comes to rest is drawn into it as it stands,
// and where one leaves, the bodies still resting there are drawn again.
// The layer the scene samples is the nearer of those two plus the bodies
// in motion: wherever anything changed, the world's depth is copied over
// the affected rectangle, the resting layer's is laid over it by a pass
// that costs pixels and no geometry, and just the moving bodies that
// reach into it are drawn on top. A tumbling piece of debris therefore
// costs a small copy and a few hundred vertices per frame instead of a
// redraw of the whole world, is never shaded against a stale image of
// itself, and the heap it lands on, which is most of the body quads there
// are once a building is down, is drawn again neither for it nor for the
// rubble that keeps being added to the world under it.
//
// A body rests once neither its transform nor its quads have changed for
// REST frames; the first change takes it out again, in the same frame. What
// is drawn is the same set of surfaces as if every body were redrawn every
// frame, so the map is the same map.
import { F } from './render_frame.js';
import { VOXEL } from './engine.js';
import { SET } from './render_geom.js';
import { makeTexture, makeProgram, CULL, BLEND, UNIT } from './render_gl.js';
import { FULLSCREEN_VS } from './render_shaders_fx.js';

// Lays one depth layer over another: with the depth test on, the nearer of
// the two is left.
const OVER_FS = `
uniform sampler2D uTex;
void main() {
  gl_FragDepth = texelFetch(uTex, ivec2(gl_FragCoord.xy), 0).r;
}
`;

const MAX_CASCADES = 3;
// Texels added around a refreshed rectangle: covers the polygon-offset and
// filter footprint of whatever was drawn at its edge.
const PAD = 3;
// Frames without a change after which a body is drawn into the resting layer.
export const REST = 20;
// Bodies taken into the resting layer in one frame, at most.
const SETTLE = 32;
export const MAX_BODIES = 8192;
// Rectangles of the resting layer redrawn separately in one frame, at most
// (bodies that left it in different places; more are merged).
export const GONE = 4;
// How many rectangles of changed world a cascade keeps apart until its
// layer is redrawn (more go into the one that grows least for them), and
// the tiles a side its layer is redrawn by: where the world changed in
// several places the tiles those rectangles touch are cleared, and only
// what can land in one of them is drawn. (A short list of rectangles, each
// change into the nearest, chained two hundred changes scattered over a
// town into one or two that held most of it: every caster of half a town
// for a few metres of wall here and there.)
const SOFT = 256, TILES = 128;
// What a body is to the resting layer.
export const MOVING = 0, RESTING = 1, ARRIVING = 2;

export function emptyRect(r) { r[0] = r[1] = 1e9; r[2] = r[3] = -1e9; }
export function addRect(r, x0, y0, x1, y1) {
  if (x0 < r[0]) r[0] = x0;
  if (y0 < r[1]) r[1] = y0;
  if (x1 > r[2]) r[2] = x1;
  if (y1 > r[3]) r[3] = y1;
}
// Adds a rectangle to a short list (c.gone, c.goneCount): into one it
// touches, else as a new one, else (the list is full) into the first.
export function addGone(c, x0, y0, x1, y1) {
  const g = c.gone;
  let at = -1;
  for (let i = 0; i < c.goneCount && at < 0; i++) {
    const o = i * 4;
    if (x0 <= g[o + 2] && x1 >= g[o] && y0 <= g[o + 3] && y1 >= g[o + 1]) at = i;
  }
  if (at < 0) {
    if (c.goneCount < GONE) {
      const o = c.goneCount++ * 4;
      g[o] = x0; g[o + 1] = y0; g[o + 2] = x1; g[o + 3] = y1;
      return;
    }
    at = 0;
  }
  const o = at * 4;
  g[o] = Math.min(g[o], x0); g[o + 1] = Math.min(g[o + 1], y0); g[o + 2] = Math.max(g[o + 2], x1); g[o + 3] = Math.max(g[o + 3], y1);
}

// Adds a rectangle where the world changed to a cascade's list of them
// (c.softs, c.softCount): as it is while there is room, else into the one
// that grows least for it.
function addSoft(c, x0, y0, x1, y1) {
  const g = c.softs, n = c.softCount;
  if (n < SOFT) {
    const o = n * 4;
    g[o] = x0; g[o + 1] = y0; g[o + 2] = x1; g[o + 3] = y1;
    c.softCount = n + 1;
    return;
  }
  let best = 0, least = Infinity;
  for (let o = 0, i = 0; i < n; i++, o += 4) {
    const grow = Math.max(g[o + 2], x1) - Math.min(g[o], x0) + Math.max(g[o + 3], y1) - Math.min(g[o + 1], y0) - (g[o + 2] - g[o]) - (g[o + 3] - g[o + 1]);
    if (grow < least) { least = grow; best = i; }
  }
  const o = best * 4;
  g[o] = Math.min(g[o], x0); g[o + 1] = Math.min(g[o + 1], y0); g[o + 2] = Math.max(g[o + 2], x1); g[o + 3] = Math.max(g[o + 3], y1);
}

export class Shadows {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.res = 0;
    this.count = 0;
    // [the world, what the scene samples, bodies at rest]: { tex, fbo: { fbo, w, h } }
    this.layers = [null, null, null];
    this.pOver = makeProgram(gl, FULLSCREEN_VS, OVER_FS, '', 'shadow layers');
    state.prog = null;
    this.plain = gl.createVertexArray();
    this.cascades = [];
    for (let i = 0; i < MAX_CASCADES; i++) {
      this.cascades.push({
        half: 1, world: false, interval: 1, cx: NaN, cy: NaN,
        hard: true,                  // static layer must be redrawn in full
        soft: new Float64Array(4),   // light-space rectangle whose world content is stale
        // The same as the rectangles that together hold every change:
        // what changes in a collapse lies in many places far apart, and
        // the one rectangle around them holds a third of a town.
        softs: new Float64Array(4 * SOFT),
        softCount: 0,
        gone: new Float64Array(4 * GONE), // ... rectangles where a body left the resting layer: stale now
        goneCount: 0,
        came: new Float64Array(4),   // ... where bodies have come to rest and are to be drawn into it
        dyn: new Float64Array(4),    // light-space rectangle whose body content is stale
        last: -1000,
        mat: new Float32Array(16),
      });
      emptyRect(this.cascades[i].soft);
      emptyRect(this.cascades[i].came);
      emptyRect(this.cascades[i].dyn);
    }
    // Per body: MOVING, RESTING (drawn in the resting layer) or ARRIVING
    // (to be drawn into it this frame); frames since it last changed.
    this.rest = new Uint8Array(MAX_BODIES);
    this.quiet = new Uint16Array(MAX_BODIES);
    this.resting = 0;        // bodies in the resting layer
    // How far a body has shifted since its shadow was last drawn (metres),
    // and how far it may before that counts as having moved: a share of
    // the finest cascade's texel on the lowest tier, nothing elsewhere.
    this.drift = new Float32Array(MAX_BODIES);
    this.adrift = false;         // some body has shifted and not been drawn again
    this.slackTexels = 0;
    this.slack = 0;
    this._u = new Float64Array(4);
    this.basis = new Float32Array(9); // light-space right, up, toward-sun
    this.sun = [0, 0, 0];
    this.world = [0, 0, 0];
    this.zMin = 0;
    this.zMax = 1;
    this.kernel = 0.03;
    // Far cascades may pick up world edits a frame or two late. Bodies never
    // wait: a moving body shaded against where it was flickers.
    this.rateLimit = true;
    // Brought up to date at most every `cadence` frames (the governor
    // raises it to 2 on a GPU that cannot keep up, as its last resort
    // before the tier: a moving body is then shaded against where it was
    // for a frame).
    this.cadence = 1;
    this.hadBodies = false;
    this._t = new Int32Array(4);
    // The tiles of one redraw of the world's layer: which they are, how
    // many lie below and left of each corner (so that "does this caster's
    // rectangle touch one" is four reads), and the tiles each rectangle of
    // changed world reaches over.
    this._tileGrid = new Uint8Array(TILES * TILES);
    this._tileSum = new Uint16Array((TILES + 1) * (TILES + 1));
    this._softTiles = new Int16Array(4 * SOFT);
    this._tw = 0;
    this._th = 0;
    // Changes far apart are redrawn tile by tile (off: as the one rectangle
    // around them all, as it was; for comparing).
    this.split = true;
    this.tiles = 0;          // tiles of the world's layers cleared this frame (0: whole rectangles)
    this._begun = false;
    this.rendered = 0;       // cascades whose resting layer was drawn again this frame, in part or whole
    this.redraws = 0;        // rectangles of resting layers drawn again this frame
    this.refreshed = 0;      // body-layer refreshes this frame
    this.casters = 0;        // world quads drawn into static layers this frame
    this.far = null;         // the far field (render_far.js), whose casters go into them too
    this.farCasters = 0;     // far quads drawn into static layers this frame
    this.totalRendered = 0;  // running totals for the caching statistic
    this.totalPossible = 0;
  }

  // The atlas the scene samples: the static layer serves as long as there
  // are no bodies to add to it.
  get tex() { return (this.hadBodies ? this.layers[1] : this.layers[0]).tex; }

  // compare: the scene samples it with a depth comparison (and filtered);
  // otherwise it is only ever read texel by texel, as depth.
  _makeLayer(w, h, compare = true) {
    const gl = this.gl;
    this.state.texForUpload(UNIT.uShadow, gl.TEXTURE_2D, null);
    const tex = makeTexture(gl, gl.TEXTURE_2D, compare ? gl.LINEAR : gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT16, w, h);
    if (compare) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    }
    const fbo = { fbo: gl.createFramebuffer(), w, h };
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex, 0);
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.state.target = undefined;
    return { tex, fbo };
  }

  // camHalf: half-extents (m) of the camera cascades, nearest first.
  // minInterval: fewest frames between world-content refreshes of any cascade.
  configure(res, camHalf, kernel, minInterval = 1) {
    const gl = this.gl;
    const count = camHalf.length + 1;
    // Cascades sit side by side in one atlas; stay inside the texture limit.
    const limit = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
    while (res * count > limit && res > 256) res >>= 1;
    this.kernel = kernel;
    for (let i = 0; i < count; i++) {
      const c = this.cascades[i];
      c.world = i === count - 1;
      c.half = c.world ? 1 : camHalf[i];
      c.interval = Math.max(i + 1, minInterval);
      c.hard = true;
      c.cx = NaN;
    }
    this.sun[0] = NaN; // forces the basis and world fit to be rebuilt
    if (res === this.res && count === this.count && this.layers[0]) return;
    this.res = res;
    this.count = count;
    for (const l of this.layers) {
      if (!l) continue;
      gl.deleteTexture(l.tex);
      gl.deleteFramebuffer(l.fbo.fbo);
    }
    this.layers[0] = this._makeLayer(res * count, res);
    this.layers[1] = this._makeLayer(res * count, res);
    this.layers[2] = this._makeLayer(res * count, res, false);
    this.hadBodies = false;
  }

  invalidate() {
    for (let i = 0; i < this.count; i++) this.cascades[i].hard = true;
  }

  // The world changed inside this box (voxels, max exclusive): the static
  // layer of every cascade it projects into is stale there.
  // (The box is the six values at box[o ..].)
  worldChanged(box, o = 0) {
    const b = this.basis;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let k = 0; k < 8; k++) {
      const px = box[o + (k & 1 ? 3 : 0)] * VOXEL, py = box[o + (k & 2 ? 4 : 1)] * VOXEL, pz = box[o + (k & 4 ? 5 : 2)] * VOXEL;
      const lx = px * b[0] + py * b[1] + pz * b[2], ly = px * b[3] + py * b[4] + pz * b[5];
      x0 = Math.min(x0, lx); x1 = Math.max(x1, lx);
      y0 = Math.min(y0, ly); y1 = Math.max(y1, ly);
    }
    for (let i = 0; i < this.count; i++) {
      addRect(this.cascades[i].soft, x0, y0, x1, y1);
      addSoft(this.cascades[i], x0, y0, x1, y1);
    }
  }

  // Body quads appeared, changed or vanished somewhere.
  bodiesChanged() {
    for (let i = 0; i < this.count; i++) addRect(this.cascades[i].dyn, -1e9, -1e9, 1e9, 1e9);
  }

  // Body `id` changed: it was inside the sphere at (ox, oy, oz) and is now
  // inside the one at (x, y, z), both of radius r (metres; ox is NaN when
  // it was nowhere), and no point of it has moved further than `far`. Both
  // footprints need their body layer rebuilt, and if it lay in the resting
  // layer it is taken out of it: that layer is stale where it lay.
  //
  // With `slackTexels` set (the lowest tier), a body that has shifted by
  // less than that share of the finest cascade's texel since its shadow
  // was last drawn has not moved at all as far as this map goes: the
  // pieces of a heap that is settling shift by a fraction of a millimetre
  // a frame for as long as the solver has them awake, and each would
  // otherwise be drawn again every frame, or cost a redraw of what lies
  // around it every time it stirred.
  bodyMoved(id, ox, oy, oz, x, y, z, r, far = Infinity) {
    if (this.slack > 0) {
      this.drift[id] += far;
      if (this.drift[id] <= this.slack) { this.adrift = true; return; }
      this.drift[id] = 0;
    }
    const b = this.basis;
    const lx = x * b[0] + y * b[1] + z * b[2], ly = x * b[3] + y * b[4] + z * b[5];
    let x0 = lx - r, y0 = ly - r, x1 = lx + r, y1 = ly + r;
    const was = ox === ox;
    const px = was ? ox * b[0] + oy * b[1] + oz * b[2] : lx, py = was ? ox * b[3] + oy * b[4] + oz * b[5] : ly;
    x0 = Math.min(x0, px - r); y0 = Math.min(y0, py - r);
    x1 = Math.max(x1, px + r); y1 = Math.max(y1, py + r);
    this.quiet[id] = 0;
    const rested = this.rest[id] !== MOVING;
    if (rested) { this.rest[id] = MOVING; this.resting--; }
    for (let i = 0; i < this.count; i++) {
      const c = this.cascades[i];
      addRect(c.dyn, x0, y0, x1, y1);
      // (It lay where it was: that is where the resting layer holds it.)
      if (rested) addGone(c, px - r, py - r, px + r, py + r);
    }
  }

  // The world stands still: nothing in it will be drawn again by itself,
  // and what the slack has let lie is now a difference that stays, a body's
  // shade a fraction of a texel from the body for as long as the picture
  // stands (a pause, a heap asleep). Every body that has shifted since it
  // was last drawn is drawn where it is: a moving one with the bodies'
  // layer, one at rest with the resting layer where it lies. Returns how
  // many there were.
  settle(lists, count) {
    if (!this.adrift) return 0;
    this.adrift = false;
    const drift = this.drift, rest = this.rest, sp = lists.sphere, b = this.basis;
    let n = 0;
    for (let id = 1; id < count; id++) {
      const far = drift[id];
      if (!(far > 0)) continue;
      drift[id] = 0;
      const k = id * 4;
      if (!(sp[k + 3] > 0)) continue;
      // (Where it was drawn is within `far` of where it is.)
      const r = sp[k + 3] + far, x = sp[k], y = sp[k + 1], z = sp[k + 2];
      const lx = x * b[0] + y * b[1] + z * b[2], ly = x * b[3] + y * b[4] + z * b[5];
      for (let i = 0; i < this.count; i++) {
        const c = this.cascades[i];
        if (rest[id] === MOVING) addRect(c.dyn, lx - r, ly - r, lx + r, ly + r);
        else addGone(c, lx - r, ly - r, lx + r, ly + r);
      }
      n++;
    }
    return n;
  }

  // No body is in the resting layer any more (the engine holds a new world).
  forget() {
    this.rest.fill(MOVING);
    this.quiet.fill(0);
    this.drift.fill(0);
    this.adrift = false;
    this.resting = 0;
  }

  // Another frame has passed for every body: those that have lain still
  // long enough are to join the resting layer. lists: the quad lists (their
  // spheres around the bodies); count: bodies with a transform.
  _settle(lists, count) {
    const quiet = this.quiet, rest = this.rest, sp = lists.sphere, b = this.basis;
    let taken = 0;
    for (let id = 1; id < count; id++) {
      if (quiet[id] < 65535) quiet[id]++;
      if (rest[id] !== MOVING || quiet[id] < REST || taken >= SETTLE) continue;
      const k = id * 4, r = sp[k + 3];
      // (No sphere: nothing of it in the lists, nothing to draw.)
      if (!(r > 0)) continue;
      const x = sp[k], y = sp[k + 1], z = sp[k + 2];
      const lx = x * b[0] + y * b[1] + z * b[2], ly = x * b[3] + y * b[4] + z * b[5];
      rest[id] = ARRIVING;
      this.drift[id] = 0;
      this.resting++;
      taken++;
      for (let i = 0; i < this.count; i++) addRect(this.cascades[i].came, lx - r, ly - r, lx + r, ly + r);
    }
    return taken;
  }

  // The bodies that were drawn into the resting layer this frame are in it.
  _arrived(count) {
    const rest = this.rest;
    for (let id = 1; id < count; id++) if (rest[id] === ARRIVING) rest[id] = RESTING;
  }

  _setSun(sun, wx, wy, wz) {
    const b = this.basis, s = this.sun;
    if (s[0] === sun[0] && s[1] === sun[1] && s[2] === sun[2] && this.world[0] === wx && this.world[1] === wy && this.world[2] === wz) return;
    s[0] = sun[0]; s[1] = sun[1]; s[2] = sun[2];
    this.world[0] = wx; this.world[1] = wy; this.world[2] = wz;
    // right = up x L, up' = L x right, with a fallback when the sun is overhead.
    let ux = 0, uy = 1, uz = 0;
    if (Math.abs(sun[1]) > 0.99) { ux = 1; uy = 0; }
    let rx = uy * sun[2] - uz * sun[1], ry = uz * sun[0] - ux * sun[2], rz = ux * sun[1] - uy * sun[0];
    const rl = Math.hypot(rx, ry, rz) || 1;
    rx /= rl; ry /= rl; rz /= rl;
    b[0] = rx; b[1] = ry; b[2] = rz;
    b[3] = sun[1] * rz - sun[2] * ry; b[4] = sun[2] * rx - sun[0] * rz; b[5] = sun[0] * ry - sun[1] * rx;
    b[6] = sun[0]; b[7] = sun[1]; b[8] = sun[2];
    // Fit the world box: depth range for every cascade, footprint for the last.
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let k = 0; k < 8; k++) {
      const px = k & 1 ? wx : 0, py = k & 2 ? wy : 0, pz = k & 4 ? wz : 0;
      const lx = px * b[0] + py * b[1] + pz * b[2], ly = px * b[3] + py * b[4] + pz * b[5], lz = px * b[6] + py * b[7] + pz * b[8];
      x0 = Math.min(x0, lx); x1 = Math.max(x1, lx);
      y0 = Math.min(y0, ly); y1 = Math.max(y1, ly);
      z0 = Math.min(z0, lz); z1 = Math.max(z1, lz);
    }
    // Slack so bodies thrown above or beside the world still cast.
    this.zMin = z0 - 4;
    this.zMax = z1 + 16;
    const w = this.cascades[this.count - 1];
    w.half = Math.max(x1 - x0, y1 - y0) * 0.5 + 1.5;
    w.cx = (x0 + x1) * 0.5;
    w.cy = (y0 + y1) * 0.5;
    this.invalidate();
  }

  // Decide what to redraw and write the shadow uniforms into the frame block.
  update(frame, camPos, sun, wx, wy, wz) {
    this._setSun(sun, wx, wy, wz);
    const d = frame.data, b = this.basis;
    const cxl = camPos[0] * b[0] + camPos[1] * b[1] + camPos[2] * b[2];
    const cyl = camPos[0] * b[3] + camPos[1] * b[4] + camPos[2] * b[5];
    const zr = 1 / (this.zMax - this.zMin);
    for (let i = 0; i < this.count; i++) {
      const c = this.cascades[i];
      const texel = 2 * c.half / this.res;
      if (!c.world) {
        // Coarse snap (a whole number of texels): the cascade only moves, and
        // so only re-renders, when the camera has travelled about half/4.
        const snap = Math.max(1, Math.round(c.half * 0.25 / texel)) * texel;
        const nx = Math.round(cxl / snap) * snap, ny = Math.round(cyl / snap) * snap;
        if (nx !== c.cx || ny !== c.cy) { c.cx = nx; c.cy = ny; c.hard = true; }
      }
      // World -> clip for the depth pass (column-major).
      const m = c.mat, ih = 1 / c.half;
      m[0] = b[0] * ih; m[4] = b[1] * ih; m[8] = b[2] * ih; m[12] = -c.cx * ih;
      m[1] = b[3] * ih; m[5] = b[4] * ih; m[9] = b[5] * ih; m[13] = -c.cy * ih;
      m[2] = -2 * b[6] * zr; m[6] = -2 * b[7] * zr; m[10] = -2 * b[8] * zr; m[14] = 2 * this.zMax * zr - 1;
      m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
      // World -> cascade uv + depth for shading: clip * 0.5 + 0.5.
      const o = F.SHADOW_MAT + i * 16;
      for (let k = 0; k < 16; k++) d[o + k] = m[k] * 0.5;
      d[o + 12] += 0.5; d[o + 13] += 0.5; d[o + 14] += 0.5; d[o + 15] = 1;
      d[F.CASCADE_TEXEL + i] = texel;
    }
    this.slack = this.slackTexels * d[F.CASCADE_TEXEL];
    d[F.SHADOW_PARAMS] = 1 / (this.res * this.count);
    d[F.SHADOW_PARAMS + 1] = 1 / this.res;
    d[F.SHADOW_PARAMS + 2] = this.kernel;
    d[F.SHADOW_PARAMS + 3] = this.count;
  }

  // Clips a light-space rectangle to cascade c and converts it to texels
  // (x, y, width, height in this._t). False when nothing is left.
  _texels(c, r, at = 0) {
    const res = this.res, k = res * 0.5 / c.half, o = res * 0.5, t = this._t;
    const x0 = Math.max(0, Math.floor((r[at] - c.cx) * k + o) - PAD), y0 = Math.max(0, Math.floor((r[at + 1] - c.cy) * k + o) - PAD);
    const x1 = Math.min(res, Math.ceil((r[at + 2] - c.cx) * k + o) + PAD), y1 = Math.min(res, Math.ceil((r[at + 3] - c.cy) * k + o) + PAD);
    t[0] = x0; t[1] = y0; t[2] = x1 - x0; t[3] = y1 - y0;
    return x1 > x0 && y1 > y0;
  }

  // The tiles of cascade `c`'s layer (`tile` texels a side) that its
  // rectangles of changed world touch, over the rectangle of tiles around
  // them all (_tw by _th of them, _t in texels): which, in _tileGrid, a row
  // after another; and for every corner of that grid how many lie below
  // and left of it, in _tileSum. Returns how many, or 0 when they nearly
  // fill the rectangle (_t is then the one around the changes themselves,
  // as _texels(c, c.soft) leaves it).
  _tiles(c, tile) {
    const g = this._tileGrid, sum = this._tileSum, t = this._t, at = this._softTiles;
    let n = 0, tx0 = TILES, ty0 = TILES, tx1 = -1, ty1 = -1;
    for (let j = 0; j < c.softCount; j++) {
      if (!this._texels(c, c.softs, j * 4)) continue;
      const a = Math.floor(t[0] / tile), b = Math.floor((t[0] + t[2] - 1) / tile), lo = Math.floor(t[1] / tile), hi = Math.floor((t[1] + t[3] - 1) / tile);
      const o = n++ * 4;
      at[o] = a; at[o + 1] = lo; at[o + 2] = b; at[o + 3] = hi;
      if (a < tx0) tx0 = a;
      if (b > tx1) tx1 = b;
      if (lo < ty0) ty0 = lo;
      if (hi > ty1) ty1 = hi;
    }
    const w = tx1 - tx0 + 1, h = ty1 - ty0 + 1;
    let count = 0;
    if (n > 0) {
      g.fill(0, 0, w * h);
      for (let o = 0; o < n * 4; o += 4) {
        for (let y = at[o + 1] - ty0; y <= at[o + 3] - ty0; y++) g.fill(1, y * w + at[o] - tx0, y * w + at[o + 2] - tx0 + 1);
      }
      sum.fill(0, 0, w + 1);
      for (let y = 0; y < h; y++) {
        const r = (y + 1) * (w + 1);
        let across = 0;
        sum[r] = 0;
        for (let x = 0; x < w; x++) {
          across += g[y * w + x];
          sum[r + x + 1] = sum[r + x - w] + across;
        }
        count += across;
      }
    }
    if (count === 0 || count > 0.7 * w * h) {
      this._texels(c, c.soft);
      return 0;
    }
    this._tw = w;
    this._th = h;
    t[0] = tx0 * tile; t[1] = ty0 * tile; t[2] = w * tile; t[3] = h * tile;
    return count;
  }

  _begin(prog) {
    if (this._begun) return;
    this._begun = true;
    const gl = this.gl, st = this.state;
    // The atlas must not be bound for sampling while it is the target.
    st.tex(UNIT.uShadow, gl.TEXTURE_2D, null);
    st.depth(true, true, gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    st.polygonOffset(true, 1.6, 3);
    st.program(prog);
  }

  // Bring both layers up to date. `prog` and `progBodies` are the depth-only
  // programs for world and body quads, `lists` the quad draw lists, `count`
  // the bodies that have a transform; the quad and transform textures are
  // already bound. Returns the number of redraws of the resting layer in
  // which the world was drawn.
  render(prog, progBodies, lists, frameNo, count = 0) {
    const gl = this.gl, st = this.state, res = this.res, t = this._t, u = this._u, rest = this.rest, basis = this.basis;
    const bodies = lists.quads(SET.BODIES) > 0;
    // First frame with bodies: their layer has never been filled.
    const first = bodies && !this.hadBodies;
    if (first) this.bodiesChanged();
    this.hadBodies = bodies;
    // Not this frame's turn (a cascade that moved cannot wait, nor can a
    // layer that has never been filled: the scene would sample it).
    if (this.cadence > 1 && frameNo % this.cadence !== 0) {
      let must = first;
      for (let i = 0; i < this.count; i++) must = must || this.cascades[i].hard;
      if (!must) { this.rendered = this.redraws = this.refreshed = this.casters = this.farCasters = this.tiles = 0; return 0; }
    }
    const arriving = this._settle(lists, count);
    this.rendered = 0;
    this.redraws = 0;
    this.refreshed = 0;
    this.casters = 0;
    this.farCasters = 0;
    this.tiles = 0;
    this.totalPossible += this.count;
    this._begun = false;
    for (let i = 0; i < this.count; i++) {
      const c = this.cascades[i], hard = c.hard;
      const k = 2 * c.half / (res * VOXEL), x0 = c.cx / VOXEL - res * 0.5 * k, y0 = c.cy / VOXEL - res * 0.5 * k;
      // The world's layer: all of it, or where the world was edited, when
      // the cascade's turn has come.
      let due = hard;
      if (hard) {
        t[0] = 0; t[1] = 0; t[2] = res; t[3] = res;
        addRect(c.dyn, -1e9, -1e9, 1e9, 1e9);
      } else if (this._texels(c, c.soft)) {
        due = !(this.rateLimit && frameNo - c.last < c.interval);
        if (due) addRect(c.dyn, c.soft[0], c.soft[1], c.soft[2], c.soft[3]);
      } else {
        emptyRect(c.soft);
        c.softCount = 0;
      }
      if (due) {
        this._begin(prog);
        st.program(prog);
        st.fbo(this.layers[0].fbo);
        st.viewport(i * res, 0, res, res);
        // Where the world changed in several places, the tiles they touch
        // are cleared and the casters that can land in any of those are
        // drawn once, over the rectangle around them all: what they draw
        // outside the cleared tiles is what the layer holds there already,
        // to the bit, and leaves it as it was. (Not worth it when the
        // tiles nearly fill that rectangle.)
        const tile = res / TILES;
        let tiled = 0;
        if (!hard && this.split && c.softCount > 1) tiled = this._tiles(c, tile);
        gl.uniformMatrix4fv(prog.u.uLightVP, false, c.mat);
        if (tiled > 0) {
          this.tiles += tiled;
          // (`t`: the rectangle of texels around the tiles, from here on.)
          // A row's runs of tiles, each with as many of the rows below as
          // hold the whole of it: one clear.
          const g = this._tileGrid, w = this._tw, h = this._th;
          for (let y = 0; y < h; y++) {
            for (let a = 0; a < w; a++) {
              if (g[y * w + a] === 0) continue;
              let b = a + 1;
              while (b < w && g[y * w + b] !== 0) b++;
              let rows = 1;
              for (; y + rows < h; rows++) {
                let x = a;
                while (x < b && g[(y + rows) * w + x] !== 0) x++;
                if (x < b) break;
              }
              for (let r = 0; r < rows; r++) g.fill(0, (y + r) * w + a, (y + r) * w + b);
              st.scissor(true, i * res + t[0] + a * tile, t[1] + y * tile, (b - a) * tile, rows * tile);
              gl.clear(gl.DEPTH_BUFFER_BIT);
              a = b;
            }
          }
          st.scissor(true, i * res + t[0], t[1], t[2], t[3]);
          this.casters += lists.drawWorldInTiles(basis, this._tileSum, w, h, x0 + t[0] * k, y0 + t[1] * k, tile * k);
        } else {
          st.scissor(true, i * res + t[0], t[1], t[2], t[3]);
          gl.clear(gl.DEPTH_BUFFER_BIT);
          // Only casters that can land in the rectangle being redrawn.
          this.casters += lists.drawWorldIn(basis, x0 + t[0] * k, y0 + t[1] * k, x0 + (t[0] + t[2]) * k, y0 + (t[1] + t[3]) * k);
        }
        if (this.fine) this.fine.drawShadowWorld(c.mat, basis, x0 + t[0] * k, y0 + t[1] * k, x0 + (t[0] + t[2]) * k, y0 + (t[1] + t[3]) * k);
        // What of the far field can shade anything in the cascades
        // (render_far.js, FarField.drawCasters): into the world's layer
        // with the world, under the same scissor, wherever that is drawn.
        // (Like the world's casters where the layer is redrawn in places:
        // what they draw outside the cleared places is what is there.)
        // Not drawn where none of them lies over the scissor's rectangle.
        if (this.far) {
          const w = this.cascades[this.count - 1];
          this.farCasters += this.far.drawCasters(c.mat, basis, w.cx, w.cy, w.half, this.zMin,
            (x0 + t[0] * k) * VOXEL, (y0 + t[1] * k) * VOXEL, (x0 + (t[0] + t[2]) * k) * VOXEL, (y0 + (t[1] + t[3]) * k) * VOXEL);
        }
        emptyRect(c.soft);
        c.softCount = 0;
        c.last = frameNo;
        this.rendered++;
      }
      c.hard = false;
      // The resting layer: all of it, or the rectangles where bodies left
      // it (several are worth their separate redraws only while they are
      // small beside the rectangle around them all: what reaches into two
      // of them is drawn twice).
      const g = c.gone;
      let n = c.goneCount;
      if (hard) {
        g[0] = -1e9; g[1] = -1e9; g[2] = 1e9; g[3] = 1e9;
        n = 1;
      } else if (n > 1) {
        let sum = 0, ux0 = 1e9, uy0 = 1e9, ux1 = -1e9, uy1 = -1e9;
        for (let j = 0; j < n; j++) {
          const o = j * 4;
          sum += (g[o + 2] - g[o]) * (g[o + 3] - g[o + 1]);
          ux0 = Math.min(ux0, g[o]); uy0 = Math.min(uy0, g[o + 1]); ux1 = Math.max(ux1, g[o + 2]); uy1 = Math.max(uy1, g[o + 3]);
        }
        if ((ux1 - ux0) * (uy1 - uy0) < 2 * sum) {
          g[0] = ux0; g[1] = uy0; g[2] = ux1; g[3] = uy1;
          n = 1;
        }
      }
      for (let j = 0; j < n; j++) {
        u[0] = g[j * 4]; u[1] = g[j * 4 + 1]; u[2] = g[j * 4 + 2]; u[3] = g[j * 4 + 3];
        if (!this._texels(c, u)) continue;
        addRect(c.dyn, u[0], u[1], u[2], u[3]);
        this._begin(progBodies);
        st.program(progBodies);
        st.fbo(this.layers[2].fbo);
        st.viewport(i * res, 0, res, res);
        st.scissor(true, i * res + t[0], t[1], t[2], t[3]);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        if (bodies && this.resting > arriving) {
          gl.uniformMatrix4fv(progBodies.u.uLightVP, false, c.mat);
          lists.drawBodies(RESTING, rest, count, basis, x0 + t[0] * k, y0 + t[1] * k, x0 + (t[0] + t[2]) * k, y0 + (t[1] + t[3]) * k);
          if (this.fine) this.fine.drawShadowBodies(c.mat, RESTING, rest, count);
        }
        this.redraws++;
      }
      c.goneCount = 0;
      // The bodies that have just come to rest are drawn into it as it
      // stands: nothing else has to be drawn again for them.
      if (arriving > 0 && this._texels(c, c.came)) {
        addRect(c.dyn, c.came[0], c.came[1], c.came[2], c.came[3]);
        this._begin(progBodies);
        st.program(progBodies);
        st.fbo(this.layers[2].fbo);
        st.viewport(i * res, 0, res, res);
        st.scissor(true, i * res + t[0], t[1], t[2], t[3]);
        gl.uniformMatrix4fv(progBodies.u.uLightVP, false, c.mat);
        lists.drawBodies(ARRIVING, rest, count, basis, x0 + t[0] * k, y0 + t[1] * k, x0 + (t[0] + t[2]) * k, y0 + (t[1] + t[3]) * k);
        if (this.fine) this.fine.drawShadowBodies(c.mat, ARRIVING, rest, count);
      }
      emptyRect(c.came);
    }
    if (arriving > 0) this._arrived(count);
    for (let i = 0; i < this.count; i++) {
      const c = this.cascades[i];
      if (!bodies || !this._texels(c, c.dyn)) { emptyRect(c.dyn); continue; }
      this._begin(progBodies);
      // The world's depth back over the stale rectangle, the resting
      // bodies' laid over it, then the bodies in motion that reach into it.
      const x = i * res + t[0];
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.layers[0].fbo.fbo);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.layers[1].fbo.fbo);
      st.target = undefined;
      st.scissor(false);
      gl.blitFramebuffer(x, t[1], x + t[2], t[1] + t[3], x, t[1], x + t[2], t[1] + t[3], gl.DEPTH_BUFFER_BIT, gl.NEAREST);
      if (this.resting > 0) {
        st.fbo(this.layers[1].fbo);
        st.scissor(true, x, t[1], t[2], t[3]);
        st.polygonOffset(false);
        st.cull(CULL.OFF);
        st.vao(this.plain);
        st.program(this.pOver);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, this.layers[2].tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
        st.polygonOffset(true, 1.6, 3);
        st.cull(CULL.BACK);
      }
      st.program(progBodies);
      st.fbo(this.layers[1].fbo);
      st.viewport(i * res, 0, res, res);
      st.scissor(true, x, t[1], t[2], t[3]);
      gl.uniformMatrix4fv(progBodies.u.uLightVP, false, c.mat);
      const k = 2 * c.half / (res * VOXEL), x0 = c.cx / VOXEL - res * 0.5 * k, y0 = c.cy / VOXEL - res * 0.5 * k;
      lists.drawBodies(MOVING, rest, count, basis, x0 + t[0] * k, y0 + t[1] * k, x0 + (t[0] + t[2]) * k, y0 + (t[1] + t[3]) * k);
      if (this.fine) this.fine.drawShadowBodies(c.mat, MOVING, rest, count);
      emptyRect(c.dyn);
      this.refreshed++;
    }
    if (this._begun) {
      st.scissor(false);
      st.polygonOffset(false);
      st.target = undefined;
    }
    this.totalRendered += this.rendered;
    return this.rendered;
  }
}

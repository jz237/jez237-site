// Contact shadows for everything that moves. Bodies and debris are in
// neither the AO density volume nor the sky-visibility volume (both describe
// the static world), so without help they float: the ground under a slab
// that has just landed is as bright as open pavement.
//
// The help is one small map, drawn from straight below, of what moves over
// every 10 cm of ground around the camera: the height of the lowest body or
// debris surface, how far the texel lies outside that surface (every surface
// is drawn with a margin around it; 0 beneath it, 1 at the margin's rim),
// and how tall the piece stands over its underside (debris; 1 for a body,
// whose thickness is not known and which is in the shadow map anyway). The
// lowest value of each wins. A surface point that looks up then needs a
// single tap: how closely the thing hangs over it, or stands beside it, is
// how much sky it loses, and the soft edge comes from the margin. Debris is
// in no shadow map either, so with a few more taps toward the sun the
// surface shader finds the cube that is in the way.
// One pass over the debris instances and the body quads, redrawn only on
// frames in which something moved; and of the bodies only those in motion
// are drawn in it. The bodies that lie still (which is most of the body
// quads there are once a building is down, with hundreds of surfaces over
// every texel of the heap) are kept in a layer of their own, as the shadow
// maps keep theirs (render_shadow.js): a body that comes to rest is drawn
// into it as it stands, since the lowest value wins in whichever order
// they are drawn; where one leaves, the bodies still resting there are
// drawn again; and when the camera has moved the layer is shifted by whole
// texels with only the strip that came into the map drawn (`shift`; off,
// it is drawn again). The map is then that layer, copied, with what moves drawn
// over it.
import { VOXEL } from './engine.js';
import { describeProgram, makeTarget, BLEND, CULL, UNIT } from './render_gl.js';
import { UTIL, QUAD_DECODE } from './shaders.js';
import { F } from './render_frame.js';
import { SET } from './render_geom.js';
import { emptyRect, addRect, addGone, REST, MAX_BODIES, MOVING, RESTING, ARRIVING, GONE } from './render_shadow.js';

const RES = 512;
const TEXEL = VOXEL;          // metres per texel
const SIZE = RES * TEXEL;     // 51.2 m square
// Heights are stored over this many metres, from 16 m below the camera.
export const CONTACT_RANGE = 25.5;
const BELOW = 16;
// Height at which something stops shadowing the ground under it (metres).
export const CONTACT_RISE = 0.5;
// Width of the margin around a body's faces (metres).
const MARGIN = 0.3;
// A face whose normal points up by more than this is never the lowest
// surface of a solid, and is left out.
const FACE_UP = 0.2;
// The map's two axes in the world, for the draw lists.
const AXES_XZ = new Float32Array([1, 0, 0, 0, 0, 1]);
// Texels around a body's sphere that its faces' margins can reach, and one
// to spare.
const REACH = Math.ceil(MARGIN / TEXEL) + 1;

// With `shift`, positions are taken in texels from a point this far to the
// low side of the world before the map's origin is taken off (see `place`).
const ANCHOR = 4096;

// Where a point of the world lies in the map: straight from the map's
// origin in metres, or (`shift`) by a way that is exact under a move of the
// map. The map's origin is a whole number of texels, and a rasteriser
// snaps vertices to a sub-texel grid (a sixteenth of a texel in the
// software one): a face seen nearly edge-on from below changes what it
// writes with every such step, and taken straight from the origin a
// vertex rounds differently for every origin. So the point is first put
// in texels from a fixed point, which rounds it the same way under every
// origin; from there on the arithmetic is exact (an integer taken off, a
// power of two, one), and the map moved by a texel is the same map moved
// by a texel. A layer drawn around another origin and shifted (the bodies
// at rest) is then to the bit what drawing it again would give, and the
// map does not shimmer as the camera walks.
const HEAD = `
uniform vec4 uMap;   // origin x, origin z, 1 / size, lowest height stored
uniform vec3 uMapAt; // origin x and z in texels from the anchor; whether positions go by it (1) or by uMap (0)
vec4 place(vec3 wp) {
  vec2 t = wp.xz * ${(1 / TEXEL).toFixed(1)} + ${ANCHOR.toFixed(1)};
  vec2 shifted = (t - uMapAt.xy) * ${(2 / RES).toFixed(10)} - 1.0;
  vec2 straight = (wp.xz - uMap.xy) * (uMap.z * 2.0) - 1.0;
  return vec4(uMapAt.z > 0.5 ? shifted : straight, 0.0, 1.0);
}
`;

const QUAD_VS = `
${UTIL}
${QUAD_DECODE}
${HEAD}
out vec2 vP;        // position in the quad's plane, metres from its corner
flat out vec4 vBox; // the quad's extent in that plane, then how much each axis climbs per metre
flat out float vBase;
void main() {
  Quad q;
  // Faces that look up are never the lowest surface of a solid.
  // (The draw ranges also hold world quads that share a segment with a body.)
  if (!decodeQuad(q) || q.body == 0 || qrot(q.rq, faceNormal(q.face)).y > ${FACE_UP.toFixed(2)}) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
  // Metres per voxel of this body.
  float scale = texelFetch(uXf, ivec2((q.body & 255) * 4 + 1, q.body >> 8), 0).w;
  vec2 size = vec2(q.size) * scale;
  vec2 c = q.corner * 0.5 + 0.5;
  vec3 origin = q.world - q.wu * (c.x * size.x) - q.wv * (c.y * size.y);
  vP = c * size + q.corner * ${MARGIN.toFixed(2)};
  vBox = vec4(size, q.wu.y, q.wv.y);
  vBase = origin.y - uMap.w;
  gl_Position = place(origin + q.wu * vP.x + q.wv * vP.y);
}
`;

const QUAD_FS = `
in vec2 vP;
flat in vec4 vBox;
flat in float vBase;
out vec4 oColor;
void main() {
  // The nearest point of the face itself, and how far out in the margin
  // this texel is from it.
  vec2 on = clamp(vP, vec2(0.0), vBox.xy);
  float out_m = length(vP - on);
  float h = vBase + dot(on, vBox.zw);
  // Height of the face (at its edge, in the margin), how far out in the
  // margin, and 1: a body, of no known thickness, and in the shadow map.
  oColor = vec4(clamp(h * ${(1 / CONTACT_RANGE).toFixed(6)}, 0.0, 1.0), out_m * ${(1 / MARGIN).toFixed(4)}, 1.0, 1.0);
}
`;

// A debris cube as the square under it, with a margin in proportion to its
// size: a pebble gets a small faint shadow, a block a wide one.
const CUBE_VS = `
layout(location = 0) in vec4 aPosSize;
${HEAD}
out vec2 vP;
flat out vec4 vCube; // half width, margin, height of the underside, how tall it stands
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  float s = aPosSize.w;
  // Chips smaller than a texel of the map have no shadow it could hold, and
  // being the lowest thing wherever they lie they would stand in for the
  // block above them.
  if (s < 0.07) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
  float half_w = s * 0.55, margin = clamp(s * 1.2, 0.12, ${MARGIN.toFixed(2)});
  vP = c * (half_w + margin);
  vCube = vec4(half_w, margin, aPosSize.y - 0.5 * s - uMap.w, s);
  gl_Position = place(aPosSize.xyz + vec3(vP.x, 0.0, vP.y));
}
`;

const CUBE_FS = `
in vec2 vP;
flat in vec4 vCube;
out vec4 oColor;
void main() {
  float out_m = length(max(abs(vP) - vCube.x, 0.0));
  // Its underside, how far out in the margin, how tall it stands.
  oColor = vec4(clamp(vCube.z * ${(1 / CONTACT_RANGE).toFixed(6)}, 0.0, 1.0), out_m / vCube.y, min(vCube.w, 0.8), 1.0);
}
`;

export class ContactMap {
  // float16: half-float targets can be rendered to (heights to the
  // centimetre; 8 bits give 10 cm steps, which bilinear filtering hides).
  constructor(gl, state, transMask, float16) {
    this.gl = gl;
    this.state = state;
    const format = float16 ? gl.RGBA16F : gl.RGBA8;
    state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
    this.target = makeTarget(gl, RES, RES, format, gl.LINEAR);
    // The bodies at rest, and the target the layer is shifted into when
    // the map moves (the two change places).
    this.layer = makeTarget(gl, RES, RES, format, gl.NEAREST);
    this.spare = makeTarget(gl, RES, RES, format, gl.NEAREST);
    state.units[state.unit] = null;
    state.target = undefined;
    this.pQuads = describeProgram(QUAD_VS, QUAD_FS, '', 'contact quads', (g, u) => {
      if (u.uTransMask) g.uniform1uiv(u.uTransMask, transMask);
    });
    this.pCubes = describeProgram(CUBE_VS, CUBE_FS, '', 'contact debris');
    this.origin = [NaN, NaN, NaN];
    // The same in texels, and where the resting layer was last drawn.
    this.at = new Int32Array(3);
    this.layerAt = new Int32Array(3);
    this.layerValid = false;
    // Per body: MOVING, RESTING (drawn in the resting layer) or ARRIVING
    // (to be drawn into it this frame); the frame of its last change.
    this.rest = new Uint8Array(MAX_BODIES);
    this.since = new Uint32Array(MAX_BODIES);
    this.resting = 0;
    this._tick = 0;
    // Rectangles of the layer (metres, x and z) where a body left it.
    this.gone = new Float64Array(4 * GONE);
    this.goneCount = 0;
    this.came = new Float64Array(4);
    // How far a body has shifted since it was last drawn here (metres),
    // and how far it may before that counts as having moved: a share of a
    // texel on the lowest tier, nothing elsewhere (as for its shadow).
    this.drift = new Float32Array(MAX_BODIES);
    this.adrift = false;
    this.slack = 0;
    // Off: every body is drawn every time, as if all were in motion.
    this.layers = true;
    // When the map moves, the resting layer moves with it and only the
    // strip that came into the map is drawn (and positions are taken the
    // way that makes this exact, see `place`). Off: the layer is drawn
    // again whenever the map has moved.
    this.shift = false;
    this._t = new Int32Array(4);
    this.filled = false;  // the map holds something other than "nothing above"
    // Redrawn at most every `cadence` frames (the governor raises it to 2
    // on a GPU that cannot keep up: what stands still is as it was, what
    // moves is seated a frame late).
    this.cadence = 1;
    this._frame = 0;
    this._owed = false;   // a redraw was put off
    this.live = false;    // surfaces should read it this frame
    this.redrawn = 0;
    this.restDraws = 0;   // draws into the resting layer this frame
  }

  get programs() { return [this.pQuads, this.pCubes]; }
  get tex() { return this.target.tex; }

  // Body `id` changed: it was inside the sphere at (ox, oy, oz) and is now
  // inside the one at (x, y, z), both of radius r (metres; ox is NaN when
  // it was nowhere), and no point of it has moved further than `far`. If
  // it lay in the resting layer it is taken out of it, and the layer is
  // stale where it lay.
  bodyMoved(id, ox, oy, oz, x, y, z, r, far = Infinity) {
    if (this.slack > 0) {
      this.drift[id] += far;
      if (this.drift[id] <= this.slack) { this.adrift = true; return; }
      this.drift[id] = 0;
    }
    this.since[id] = this._tick;
    if (this.rest[id] === MOVING) return;
    this.rest[id] = MOVING;
    this.resting--;
    if (ox === ox) addGone(this, ox - r, oz - r, ox + r, oz + r);
    else this.layerValid = false;
  }

  // The world stands still (as for the shadow, ShadowMap.settle): a body
  // at rest that has shifted since it was drawn into the resting layer is
  // drawn into it where it lies, and the map is put together once more.
  // (The moving ones are drawn where they are whenever the map is.)
  settle(lists, count) {
    if (!this.adrift) return 0;
    this.adrift = false;
    const drift = this.drift, rest = this.rest, sp = lists.sphere;
    let n = 0;
    for (let id = 1; id < count; id++) {
      const far = drift[id];
      if (!(far > 0)) continue;
      drift[id] = 0;
      const k = id * 4;
      if (rest[id] === MOVING || !(sp[k + 3] > 0)) continue;
      const r = sp[k + 3] + far;
      addGone(this, sp[k] - r, sp[k + 2] - r, sp[k] + r, sp[k + 2] + r);
      n++;
    }
    if (n > 0) this._owed = true;
    return n;
  }

  // No body is in the resting layer any more (the engine holds a new world).
  forget() {
    this.rest.fill(MOVING);
    this.since.fill(0);
    this.drift.fill(0);
    this.adrift = false;
    this.resting = 0;
    this.goneCount = 0;
    this.layerValid = false;
    this._tick = 0;
  }

  // Decide whether the map needs redrawing and write its placement into the
  // frame block. changed: something dynamic moved, appeared or vanished
  // since the last frame; any: there is something dynamic at all.
  update(frame, cam, any, changed) {
    const d = frame.data, o = this.origin, at = this.at;
    this._tick++;
    // Snapped to whole texels (and whole height steps) so the map does not
    // swim as the camera moves.
    const ix = Math.round((cam[0] - SIZE * 0.5) / TEXEL), iz = Math.round((cam[2] - SIZE * 0.5) / TEXEL), iy = Math.round((cam[1] - BELOW) / TEXEL);
    const ox = ix * TEXEL, oz = iz * TEXEL, oy = iy * TEXEL;
    const moved = ox !== o[0] || oz !== o[2] || oy !== o[1];
    this.dirty = any ? (changed || moved || !this.filled || this._owed) : this.filled;
    this._owed = false;
    // Not this frame's turn: the map stays as it is (placed where it was
    // drawn), and is owed a redraw.
    if (this.dirty && this.cadence > 1 && this.filled && any && ++this._frame % this.cadence !== 0) {
      this.dirty = false;
      this._owed = true;
      this.live = any;
      d[F.DYN] = o[0]; d[F.DYN + 1] = o[2]; d[F.DYN + 2] = 1 / SIZE; d[F.DYN + 3] = o[1];
      return;
    }
    o[0] = ox; o[1] = oy; o[2] = oz;
    at[0] = ix; at[1] = iy; at[2] = iz;
    this.live = any;
    d[F.DYN] = ox; d[F.DYN + 1] = oz; d[F.DYN + 2] = any ? 1 / SIZE : 0; d[F.DYN + 3] = oy;
  }

  // Clips a rectangle in metres (x0, z0, x1, z1 at r[k]) to the map, with
  // the reach of a face's margin around it, and converts it to texels (x,
  // y, width, height in this._t). False when nothing is left.
  _texels(r, k) {
    const at = this.at, t = this._t;
    const x0 = Math.max(0, Math.floor(r[k] / TEXEL) - at[0] - REACH), y0 = Math.max(0, Math.floor(r[k + 1] / TEXEL) - at[2] - REACH);
    const x1 = Math.min(RES, Math.ceil(r[k + 2] / TEXEL) - at[0] + REACH), y1 = Math.min(RES, Math.ceil(r[k + 3] / TEXEL) - at[2] + REACH);
    t[0] = x0; t[1] = y0; t[2] = x1 - x0; t[3] = y1 - y0;
    return x1 > x0 && y1 > y0;
  }

  // Draws the bodies marked `want` whose margins reach into the texels
  // (x, y, w, h) of the bound layer, after clearing them if `clear`.
  _bodies(lists, count, want, x, y, w, h, clear) {
    const gl = this.gl, at = this.at;
    this.state.scissor(true, x, y, w, h);
    if (clear) gl.clear(gl.COLOR_BUFFER_BIT);
    // (Texels and voxels are the same size.)
    lists.drawBodies(want, this.rest, count, AXES_XZ, at[0] + x - REACH, at[2] + y - REACH, at[0] + x + w + REACH, at[2] + y + h + REACH);
    this.restDraws++;
  }

  // Brings the resting layer to where the map is and up to date: the
  // bodies that have lain still for REST frames join it, and what was made
  // stale is drawn again. The quad program is bound, the blend is MIN and
  // the clear colour "nothing above". Returns whether the layer holds
  // anything.
  _layer(lists, count) {
    const gl = this.gl, st = this.state, rest = this.rest, since = this.since, sp = lists.sphere, at = this.at, was = this.layerAt, t = this._t;
    if (!this.layers) {
      if (this.resting > 0) { rest.fill(MOVING); this.resting = 0; }
      this.layerValid = false;
      this.goneCount = 0;
      return false;
    }
    // Who comes to rest.
    const came = this.came, now = this._tick;
    let arriving = 0;
    emptyRect(came);
    for (let id = 1; id < count; id++) {
      if (rest[id] !== MOVING || now - since[id] < REST) continue;
      const k = id * 4, r = sp[k + 3];
      // (No sphere: nothing of it in the lists, nothing to draw.)
      if (!(r > 0)) continue;
      rest[id] = ARRIVING;
      this.drift[id] = 0;
      arriving++;
      addRect(came, sp[k] - r, sp[k + 2] - r, sp[k] + r, sp[k + 2] + r);
    }
    this.resting += arriving;
    if (this.resting === 0) {
      this.layerValid = false;
      this.goneCount = 0;
      return false;
    }
    const dx = at[0] - was[0], dz = at[2] - was[2];
    if (!this.layerValid || at[1] !== was[1] || Math.abs(dx) >= RES || Math.abs(dz) >= RES || (!this.shift && (dx !== 0 || dz !== 0))) {
      // All of it, the arrivals among the rest.
      for (let id = 1; id < count; id++) if (rest[id] === ARRIVING) rest[id] = RESTING;
      st.fbo(this.layer);
      this._bodies(lists, count, RESTING, 0, 0, RES, RES, true);
    } else {
      if (dx !== 0 || dz !== 0) {
        // The map has moved by whole texels: so does the layer, and the
        // strips that came into it are drawn.
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.layer.fbo);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.spare.fbo);
        st.target = undefined;
        st.scissor(false);
        const x0 = Math.max(0, -dx), x1 = Math.min(RES, RES - dx), y0 = Math.max(0, -dz), y1 = Math.min(RES, RES - dz);
        gl.blitFramebuffer(x0 + dx, y0 + dz, x1 + dx, y1 + dz, x0, y0, x1, y1, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        const l = this.layer;
        this.layer = this.spare;
        this.spare = l;
        st.fbo(this.layer);
        if (dx !== 0) this._bodies(lists, count, RESTING, dx > 0 ? x1 : 0, 0, Math.abs(dx), RES, true);
        if (dz !== 0) this._bodies(lists, count, RESTING, x0, dz > 0 ? y1 : 0, x1 - x0, Math.abs(dz), true);
      } else {
        st.fbo(this.layer);
      }
      // Where bodies left it: the ones still resting there, again.
      for (let j = 0; j < this.goneCount; j++) {
        if (this._texels(this.gone, j * 4)) this._bodies(lists, count, RESTING, t[0], t[1], t[2], t[3], true);
      }
      // The bodies that have just come to rest are drawn into it as it
      // stands: the lowest surface wins in whichever order they come.
      if (arriving > 0) {
        if (this._texels(came, 0)) this._bodies(lists, count, ARRIVING, t[0], t[1], t[2], t[3], false);
        for (let id = 1; id < count; id++) if (rest[id] === ARRIVING) rest[id] = RESTING;
      }
    }
    was[0] = at[0]; was[1] = at[1]; was[2] = at[2];
    this.layerValid = true;
    this.goneCount = 0;
    st.scissor(false);
    return true;
  }

  // Redraw the map if update() found it stale. lists: the quad draw lists
  // (quad and transform textures bound); cubes: the debris instance set
  // ({ vao, count }); count: the bodies that have a transform. Returns the
  // draws issued.
  render(lists, cubes, count = 0) {
    this.redrawn = 0;
    this.restDraws = 0;
    if (!this.dirty) return 0;
    const gl = this.gl, st = this.state, o = this.origin;
    st.tex(UNIT.uDyn, gl.TEXTURE_2D, null);
    st.depth(false, false, gl.LESS);
    st.cull(CULL.OFF);
    st.scissor(false);
    // "Nothing above."
    gl.clearColor(1, 1, 1, 1);
    this.filled = this.live;
    const bodies = this.live && lists.quads(SET.BODIES) > 0;
    let draws = 0, laid = false;
    if (bodies) {
      // The lowest surface wins.
      st.blend(BLEND.MIN);
      const u = st.program(this.pQuads);
      gl.uniform4f(u.uMap, o[0], o[2], 1 / SIZE, o[1]);
      gl.uniform3f(u.uMapAt, this.at[0] + ANCHOR, this.at[2] + ANCHOR, this.shift ? 1 : 0);
      laid = this._layer(lists, count);
      draws += this.restDraws;
    }
    if (laid) {
      // What lies still, as it was drawn, ...
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.layer.fbo);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.target.fbo);
      st.target = undefined;
      gl.blitFramebuffer(0, 0, RES, RES, 0, 0, RES, RES, gl.COLOR_BUFFER_BIT, gl.NEAREST);
      st.fbo(this.target);
    } else {
      st.fbo(this.target);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.clearColor(0, 0, 0, 0);
    if (!this.live) return 0;
    st.blend(BLEND.MIN);
    if (bodies) {
      // ... and over it the bodies in motion: of those the faces the
      // vertex stage keeps (FACE_UP), none of the others would leave a texel.
      const at = this.at;
      lists.drawBodies(MOVING, this.rest, count, AXES_XZ, at[0] - REACH, at[2] - REACH, at[0] + RES + REACH, at[2] + RES + REACH);
      draws++;
    }
    if (cubes.count > 0) {
      const u = st.program(this.pCubes);
      gl.uniform4f(u.uMap, o[0], o[2], 1 / SIZE, o[1]);
      gl.uniform3f(u.uMapAt, this.at[0] + ANCHOR, this.at[2] + ANCHOR, this.shift ? 1 : 0);
      st.vao(cubes.vao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, cubes.count);
      draws++;
    }
    st.blend(BLEND.OFF);
    this.redrawn = draws;
    return draws;
  }
}

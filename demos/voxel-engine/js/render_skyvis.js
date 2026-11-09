// Sky-visibility volume: how much of the sky dome reaches each 0.4 m cell of
// the world. It is what makes interiors darker than exteriors, puts soft
// ambient shadow under trees and overhangs, and lets daylight pool inside
// windows and blast holes, for a single texture tap in the surface shader.
//
// Built on the GPU by sweeping the world top-down one horizontal layer at a
// time: nine directions (straight down, four at 45 degrees, four shallow) each
// carry a transmittance from the layer above through the cell's directional
// opacity, derived from the engine's solid-density volume. After an edit only
// the layers at and below it are swept again, a few per frame.
import { makeProgram, makeTexture, makeTarget, BLEND, CULL, UNIT } from './render_gl.js';

const VS = `
void main() {
  gl_Position = vec4(float((gl_VertexID << 1) & 2) * 2.0 - 1.0, float(gl_VertexID & 2) * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FS = `
uniform sampler3D uOcc;     // solid density, 0.2 m texels, GL axes (x, z, y)
uniform sampler3D uSvA;     // transmittance of the four 45-degree directions
uniform sampler3D uSvB;     // transmittance of the four shallow directions
uniform sampler3D uSkyVis;  // r: combined visibility, g: straight-down transmittance
uniform ivec4 uLayer;       // layer y, then volume size x, z, y in cells
layout(location = 0) out vec4 oA;
layout(location = 1) out vec4 oB;
layout(location = 2) out vec4 oC;

float den(ivec3 t) { return texelFetch(uOcc, t, 0).r; }

// Opacity of a pair of density texels stacked along the travel direction. A
// thin slab across the path (one texel half full) must read opaque, a thin
// wall along it (both half full) only half.
float pair(float a, float b) { return min(1.0, max(a, b) + 2.0 * abs(a - b)); }

bool inside(ivec2 c) { return c.x >= 0 && c.y >= 0 && c.x < uLayer.y && c.y < uLayer.z; }

// Crude opacity of a neighbouring cell from its mean density: a one-voxel
// wall (a quarter of the cell) already blocks.
float cellOpacity(ivec2 c, int y) {
  if (!inside(c)) return 0.0;
  vec3 uvw = (vec3(c.x, c.y, y) * 2.0 + 1.0) / (vec3(uLayer.yzw) * 2.0);
  return min(1.0, 4.0 * texture(uOcc, uvw).r);
}

void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  int y = uLayer.x;
  ivec3 b = ivec3(c * 2, y * 2);
  float d000 = den(b), d100 = den(b + ivec3(1, 0, 0)), d010 = den(b + ivec3(0, 1, 0)), d110 = den(b + ivec3(1, 1, 0));
  float d001 = den(b + ivec3(0, 0, 1)), d101 = den(b + ivec3(1, 0, 1)), d011 = den(b + ivec3(0, 1, 1)), d111 = den(b + ivec3(1, 1, 1));
  // Third GL axis is world y, second is world z.
  float aY = 0.25 * (pair(d000, d001) + pair(d100, d101) + pair(d010, d011) + pair(d110, d111));
  float aX = 0.25 * (pair(d000, d100) + pair(d010, d110) + pair(d001, d101) + pair(d011, d111));
  float aZ = 0.25 * (pair(d000, d010) + pair(d100, d110) + pair(d001, d011) + pair(d101, d111));
  float tX = 1.0 - max(aY, aX);
  float tZ = 1.0 - max(aY, aZ);

  bool top = y + 1 >= uLayer.w;
  vec4 a = vec4(1.0), s = vec4(1.0);
  float up = 1.0;
  if (!top) {
    ivec2 px = c + ivec2(1, 0), nx = c - ivec2(1, 0), pz = c + ivec2(0, 1), nz = c - ivec2(0, 1);
    if (inside(px)) a.r = texelFetch(uSvA, ivec3(px, y + 1), 0).r;
    if (inside(nx)) a.g = texelFetch(uSvA, ivec3(nx, y + 1), 0).g;
    if (inside(pz)) a.b = texelFetch(uSvA, ivec3(pz, y + 1), 0).b;
    if (inside(nz)) a.a = texelFetch(uSvA, ivec3(nz, y + 1), 0).a;
    ivec2 px2 = c + ivec2(2, 0), nx2 = c - ivec2(2, 0), pz2 = c + ivec2(0, 2), nz2 = c - ivec2(0, 2);
    if (inside(px2)) s.r = texelFetch(uSvB, ivec3(px2, y + 1), 0).r;
    if (inside(nx2)) s.g = texelFetch(uSvB, ivec3(nx2, y + 1), 0).g;
    if (inside(pz2)) s.b = texelFetch(uSvB, ivec3(pz2, y + 1), 0).b;
    if (inside(nz2)) s.a = texelFetch(uSvB, ivec3(nz2, y + 1), 0).a;
    up = texelFetch(uSkyVis, ivec3(c, y + 1), 0).g;
  }
  // Shallow rays also cross the neighbouring cell in this layer on the way in.
  s *= 1.0 - vec4(cellOpacity(c + ivec2(1, 0), y), cellOpacity(c - ivec2(1, 0), y),
                  cellOpacity(c + ivec2(0, 1), y), cellOpacity(c - ivec2(0, 1), y));
  a *= vec4(tX, tX, tZ, tZ);
  s *= vec4(tX, tX, tZ, tZ);
  up *= 1.0 - aY;
  oA = a;
  oB = s;
  float vis = 0.30 * up + 0.11 * (a.r + a.g + a.b + a.a) + 0.065 * (s.r + s.g + s.b + s.a);
  // Light that already reached the layer above also seeps down, dimmer.
  if (!top) vis = max(vis, DOWN_DECAY * texelFetch(uSkyVis, ivec3(c, y + 1), 0).r * (1.0 - aY));
  oC = vec4(vis, up, 1.0 - aX, 1.0 - aZ);
}
`;

// Sideways spread within a layer: a decaying flood fill that stands in for
// light bouncing around a room. One step per pass; walls stop it because a
// cell only accepts light along an axis it is open along.
const SPREAD_FS = `
uniform sampler2D uTex;   // r: light, g: straight-down transmittance, b/a: openness along x/z
uniform ivec4 uLayer;
out vec4 oColor;
float light(ivec2 c) {
  // Beyond the edge of the world is open air.
  if (c.x < 0 || c.y < 0 || c.x >= uLayer.y || c.y >= uLayer.z) return 1.0;
  return texelFetch(uTex, c, 0).r;
}
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 m = texelFetch(uTex, c, 0);
  float lx = max(light(c - ivec2(1, 0)), light(c + ivec2(1, 0))) * m.b;
  float lz = max(light(c - ivec2(0, 1)), light(c + ivec2(0, 1))) * m.a;
  oColor = vec4(max(m.r, SIDE_DECAY * max(lx, lz)), m.gba);
}
`;

// Two steps of that spread in one pass: every step used to be a pass and a
// target of its own, eight a layer, and the sweep was most of a frame's
// draw calls and framebuffer switches while a world changes. The first
// step is worked out for the cell and its four neighbours as a pass would
// have stored it (rounded to eight bits: a product of eighths of 255ths is
// never within a two-thousandth of the half that rounding turns on), the
// second from those: the same bytes as two passes.
const SPREAD2_FS = `
uniform sampler2D uTex;   // r: light, g: straight-down transmittance, b/a: openness along x/z
uniform ivec4 uLayer;
out vec4 oColor;
bool inside(ivec2 c) { return c.x >= 0 && c.y >= 0 && c.x < uLayer.y && c.y < uLayer.z; }
float light(ivec2 c) {
  // Beyond the edge of the world is open air.
  return inside(c) ? texelFetch(uTex, c, 0).r : 1.0;
}
// One step at cell c, as a pass of its own would have left it in the target.
float once(ivec2 c) {
  if (!inside(c)) return 1.0;
  vec4 m = texelFetch(uTex, c, 0);
  float lx = max(light(c - ivec2(1, 0)), light(c + ivec2(1, 0))) * m.b;
  float lz = max(light(c - ivec2(0, 1)), light(c + ivec2(0, 1))) * m.a;
  return floor(clamp(max(m.r, SIDE_DECAY * max(lx, lz)), 0.0, 1.0) * 255.0 + 0.5) / 255.0;
}
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 m = texelFetch(uTex, c, 0);
  float lx = max(once(c - ivec2(1, 0)), once(c + ivec2(1, 0))) * m.b;
  float lz = max(once(c - ivec2(0, 1)), once(c + ivec2(0, 1))) * m.a;
  oColor = vec4(max(once(c), SIDE_DECAY * max(lx, lz)), m.gba);
}
`;

const DEFINES = '#define DOWN_DECAY 0.72\n#define SIDE_DECAY 0.8\n';
// Flood-fill steps per layer: light travels this many cells (0.4 m each) sideways.
const SPREAD_STEPS = 8;

// Texture units of the three volumes (45-degree, shallow, combined).
const VOLUME_UNITS = [UNIT.uSvA, UNIT.uSvB, UNIT.uSkyVis];

export class SkyVis {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.prog = makeProgram(gl, VS, FS, DEFINES, 'sky visibility');
    this.spread = makeProgram(gl, VS, SPREAD_FS, DEFINES, 'sky visibility spread');
    this.spread2 = makeProgram(gl, VS, SPREAD2_FS, DEFINES, 'sky visibility spread, two steps');
    // Two steps a pass (off: one, as it was; for comparing).
    this.double = true;
    this.ping = [null, null];
    this.dims = [0, 0, 0];   // cells along x, y, z
    this.vol = [null, null, null];
    this.scratch = [null, null, null];
    this.fbo = null;
    this.cursor = -1;        // next layer to sweep, counting down; -1 = idle
    // Top layer of edits made above the cursor of a sweep in progress. That
    // sweep is left to finish and a second one starts from here afterwards:
    // restarting at every edit would starve the lower layers for as long as
    // edits keep coming.
    this.pending = -1;
    this.layersPerFrame = 4;
    this.swept = 0;
  }

  get texture() { return this.vol[2]; }

  // occ dims are the density volume's (x, y, z) texel counts.
  ensure(ox, oy, oz) {
    const gl = this.gl;
    const sx = ox >> 1, sy = oy >> 1, sz = oz >> 1;
    if (this.vol[0] && sx === this.dims[0] && sy === this.dims[1] && sz === this.dims[2]) return;
    this.dims = [sx, sy, sz];
    const units = VOLUME_UNITS;
    this.fbo = { fbo: gl.createFramebuffer(), w: sx, h: sz };
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.fbo);
    this.state.target = undefined;
    for (let i = 0; i < 3; i++) {
      this.state.texForUpload(units[i], gl.TEXTURE_3D, null);
      this.vol[i] = makeTexture(gl, gl.TEXTURE_3D, i === 2 ? gl.LINEAR : gl.NEAREST, gl.CLAMP_TO_EDGE);
      gl.texStorage3D(gl.TEXTURE_3D, 1, gl.RGBA8, sx, sz, sy);
      this.state.units[units[i]] = this.vol[i];
      this.scratch[i] = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, sx, sz);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this.scratch[i], 0);
      // Leave nothing on the 2D target of a unit the sweep samples as 3D.
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
    for (let i = 0; i < 2; i++) this.ping[i] = makeTarget(gl, sx, sz, gl.RGBA8, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.state.units[this.state.unit] = null;
    this.cursor = sy - 1;
    this.pending = -1;
  }

  // The density volume changed inside this box (density texel coordinates,
  // max exclusive): everything at or below its top must be swept again.
  dirty(y1) {
    const top = Math.min(this.dims[1] - 1, (y1 + 1) >> 1);
    if (this.cursor < 0) this.cursor = top;
    else if (top > this.cursor && top > this.pending) this.pending = top;
  }

  get busy() { return this.cursor >= 0; }

  // Sweep up to `budget` layers (everything outstanding when budget <= 0).
  // The default budget doubles while a second sweep is waiting, which bounds
  // the delay between an edit and its daylight at about 18 frames.
  update(occTex, budget = this.pending >= 0 ? this.layersPerFrame * 2 : this.layersPerFrame) {
    if (this.cursor < 0) return 0;
    const gl = this.gl, st = this.state;
    const sx = this.dims[0], sy = this.dims[1], sz = this.dims[2];
    const units = VOLUME_UNITS;
    st.depth(false, false, gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.OFF);
    st.scissor(false);
    st.tex(UNIT.uOcc, gl.TEXTURE_3D, occTex);
    for (let i = 0; i < 3; i++) st.tex(units[i], gl.TEXTURE_3D, this.vol[i]);
    let n = 0;
    while (this.cursor >= 0 && (budget <= 0 || n < budget)) {
      const y = this.cursor--;
      // Directional transport from the layer above.
      st.fbo(this.fbo);
      gl.uniform4i(st.program(this.prog).uLayer, y, sx, sz, sy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      for (let i = 0; i < 2; i++) {
        gl.readBuffer(gl.COLOR_ATTACHMENT0 + i);
        st.texForUpload(units[i], gl.TEXTURE_3D, this.vol[i]);
        gl.copyTexSubImage3D(gl.TEXTURE_3D, 0, 0, 0, y, 0, 0, sx, sz);
      }
      // Sideways flood fill, ping-ponging between two small targets.
      const two = this.double && SPREAD_STEPS % 2 === 0;
      gl.uniform4i(st.program(two ? this.spread2 : this.spread).uLayer, y, sx, sz, sy);
      let src = this.scratch[2];
      for (let k = 0, passes = two ? SPREAD_STEPS / 2 : SPREAD_STEPS; k < passes; k++) {
        const dst = this.ping[k & 1];
        st.fbo(dst);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, src);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        src = dst.tex;
      }
      st.texForUpload(UNIT.uSkyVis, gl.TEXTURE_3D, this.vol[2]);
      gl.copyTexSubImage3D(gl.TEXTURE_3D, 0, 0, 0, y, 0, 0, sx, sz);
      n++;
      if (this.cursor < 0 && this.pending >= 0) {
        this.cursor = this.pending;
        this.pending = -1;
      }
    }
    st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
    this.swept += n;
    return n * ((this.double && SPREAD_STEPS % 2 === 0 ? SPREAD_STEPS / 2 : SPREAD_STEPS) + 1);
  }
}

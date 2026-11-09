// Dynamic point lights: selection, and occlusion by the static world.
//
// Lights have no shadow maps. Instead each one gets a small octahedral map of
// "distance to the first wall" in every direction, marched once through the
// engine's solid-density volume when the light appears (or the world changes
// near it). Shading a pixel then costs one texture tap per light in range,
// where marching the volume per pixel per light cost several times the rest
// of the frame at the 32-light limit.
import { LIGHT_STRIDE, VOXEL } from './engine.js';
import { F, Frame, MAX_LIGHTS, LIGHT_TILE } from './render_frame.js';
import { makeProgram, makeTexture, makeTarget, BLEND, CULL, UNIT } from './render_gl.js';
import { FRAME } from './shaders.js';

// The atlas holds 8 x 4 maps of LIGHT_TILE texels a side.
const ATLAS_COLS = 8;
const DENSITY_M = 2 * VOXEL; // size of a density texel
// Most maps marched in one frame. A map is about 9,000 rays of up to 100
// steps; lights beyond the budget wait a frame.
const BAKE_BUDGET = 8;
// Lights walked out of the surface they sit on in one frame, at most: a
// blast brings sixteen at once, each some dozens of readings of the density
// volume, and that was a millisecond of one frame; over four frames nobody
// sees it done. (A light not yet placed shines from where the engine put
// it, unoccluded, as one still waiting for its first map does.)
const PLACE_BUDGET = 4;
// A light that is not where any light was a frame ago, but within this of
// one (metres) and of about its reach, is that light, moved: a fire's glow
// follows its fire a little every step. It keeps its slot, its map and the
// place it is shaded from until it has moved LIGHT_REMAP from where the map
// was marched, or its reach has grown past the map's; then it is placed and
// marched again, and shaded from the old map until the new one is there.
// (Taken for a new light at every step, it shone unoccluded until its map
// was marched, and every one of its maps was marched every frame.)
const LIGHT_SAME = 0.75;
const LIGHT_REMAP = 0.4;
// A moved light that then stands still for this many frames in a row is
// placed and marched again from exactly where it stands: a picture that
// stands is the world's, not the road the page took to it (two pages shown
// one stopped world drew its fires' light from where each had last marched
// a map, up to LIGHT_REMAP apart). Two, not one: a display twice as fast
// as the sim shows every place twice.
const LIGHT_STANDS = 2;
// Metres around a lamp that its occlusion march ignores (its own fixture).
const LAMP_SKIP = 0.6;
// Density at which a march sample counts as wall. A one-voxel wall peaks at
// 0.5 between texels; open air next to a surface stays below 0.25.
const WALL = 0.3;

const VS = `
void main() {
  gl_Position = vec4(float((gl_VertexID << 1) & 2) * 2.0 - 1.0, float(gl_VertexID & 2) * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FS = `
${FRAME}
uniform sampler3D uOcc;
uniform vec4 uLight;  // position, radius
uniform vec4 uTile;   // tile origin in texels, tile size, distance to skip at the light
out vec4 oColor;
// Octahedral direction, centre of the map pointing straight down: floors and
// the lower walls, where most light lands, are far from the fold.
vec3 octDecode(vec2 e) {
  vec2 f = e * 2.0 - 1.0;
  vec3 n = vec3(f.x, abs(f.x) + abs(f.y) - 1.0, f.y);
  float t = max(n.y, 0.0);
  n.x += n.x >= 0.0 ? -t : t;
  n.z += n.z >= 0.0 ? -t : t;
  return normalize(n);
}
void main() {
  vec3 dir = octDecode((gl_FragCoord.xy - uTile.xy) / uTile.z);
  float radius = uLight.w;
  // A one-voxel wall is over the threshold for 0.16 m along a ray that
  // crosses it squarely, so steps this short cannot straddle it out to
  // 12 m; a two-voxel wall is safe to three times that.
  float stepLen = max(0.12, radius / float(STEPS));
  float t = uTile.w, prev = 0.0, hit = radius;
  for (int i = 0; i < STEPS; i++) {
    if (t >= radius) break;
    float d = texture(uOcc, (uLight.xyz + dir * t).xzy * uOccInv.xyz).r;
    if (d > WALL) {
      // Place the hit where the density crossed the threshold.
      hit = t - stepLen * (d - WALL) / max(d - prev, 1e-3);
      break;
    }
    prev = d;
    t += stepLen;
  }
  oColor = vec4(clamp(hit / radius, 0.0, 1.0));
}
`;

// Reduces the marched map to its stored size, keeping the farthest of each
// texel's four rays. Shading interpolates between texels; with plain point
// samples a texel that hits the floor just in front of a wall drags the
// wall's distance down and puts a jagged shadow along the bottom of every
// lit wall. Erring toward "far" instead lets light creep about half a texel
// (2 degrees) around an occluder's edge, which reads as soft light.
const PACK_FS = `
uniform sampler2D uTex;
uniform vec4 uTile;   // tile origin in texels
out vec4 oColor;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy - uTile.xy) * 2;
  oColor = vec4(max(max(texelFetch(uTex, c, 0).r, texelFetch(uTex, c + ivec2(1, 0), 0).r),
                     max(texelFetch(uTex, c + ivec2(0, 1), 0).r, texelFetch(uTex, c + ivec2(1, 1), 0).r)));
}
`;

export class LightField {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.prog = makeProgram(gl, VS, FS, `#define STEPS 100\n#define WALL ${WALL}\n`, 'light occlusion');
    this.pack = makeProgram(gl, VS, PACK_FS, '', 'light occlusion pack');
    // Maps are marched at twice the stored resolution, one light at a time.
    this.raw = makeTarget(gl, 2 * LIGHT_TILE, 2 * LIGHT_TILE, gl.R8, gl.NEAREST);
    const w = LIGHT_TILE * ATLAS_COLS, h = LIGHT_TILE * (MAX_LIGHTS / ATLAS_COLS);
    state.texForUpload(UNIT.uLightOcc, gl.TEXTURE_2D, null);
    this.tex = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8, w, h);
    this.fbo = { fbo: gl.createFramebuffer(), w, h };
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    state.target = undefined;
    state.prog = null;
    // A slot keeps its tile for as long as the same light stays in view, so
    // a light is marched once, not every frame. key: the engine's position
    // and radius; pos: where the light is placed for shading.
    this.key = new Float32Array(MAX_LIGHTS * 4);
    this.pos = new Float32Array(MAX_LIGHTS * 4);
    this.used = new Uint8Array(MAX_LIGHTS);   // 0 free, 1 held by a light this frame
    this.stale = new Uint8Array(MAX_LIGHTS);  // map must be marched again
    this.mapped = new Uint8Array(MAX_LIGHTS); // 0 = unoccluded (buried, or occlusion off)
    this.ready = new Uint8Array(MAX_LIGHTS);  // the tile holds a map of this light
    this.unplaced = new Uint8Array(MAX_LIGHTS); // to be placed: new, or the world changed around it
    this.skip = new Float32Array(MAX_LIGHTS); // metres next to the light that the march ignores
    this._at = new Float32Array(MAX_LIGHTS * 4);   // where the engine had each slot's light a frame ago, and its reach
    this._stood = new Uint8Array(MAX_LIGHTS);      // frames in a row it has been there
    this.count = 0;   // one past the highest slot in use
    this.live = 0;    // lights in use this frame
    this.baked = 0;   // maps marched this frame
    this.occlude = true;
    // A light that moved a little keeps its slot and its map (LIGHT_SAME).
    // Off: every light that is not exactly where one was is a new light,
    // as it was (for a comparison).
    this.follow = true;
    this.bakeBudget = BAKE_BUDGET; // maps marched in one frame, at most (the tier may lower it)
    this.placeBudget = PLACE_BUDGET;
    this.changed = false; // light list differs from the previous frame's
    this._last = new Float32Array(MAX_LIGHTS * 8);
    this._p = [0, 0, 0];
    this._src = new Uint8Array(MAX_LIGHTS);   // engine list index held by each slot
    this._prev = new Uint8Array(MAX_LIGHTS);
    this._fresh = new Uint8Array(MAX_LIGHTS);
    this._warm();
  }

  // The first explosion brings twenty lights at once, each to be walked out
  // of the surface it was spawned on: float code the browser has never run,
  // in the one frame that can least afford it (it was half of that frame's
  // JS). Run it beforehand on made-up lights in a made-up volume, then
  // forget them.
  _warm() {
    const dims = [12, 12, 12], u8 = new Uint8Array(12 * 12 * 12), f32 = new Float32Array(MAX_LIGHTS * LIGHT_STRIDE);
    // Solid below a sloping surface, so lights start at every depth in it.
    for (let y = 0; y < 12; y++) for (let z = 0; z < 12; z++) for (let x = 0; x < 12; x++) u8[x + 12 * (z + 12 * y)] = Math.max(0, Math.min(255, (5.5 + 0.2 * x - y) * 160));
    const planes = new Float32Array(20), frame = new Frame();
    for (let i = 0; i < 5; i++) planes[i * 4 + 3] = 1;
    for (let pass = 0; pass < 60; pass++) {
      // Some lights stay from pass to pass, some move, some go.
      const n = 8 + (pass % 3) * 12;
      for (let j = 0; j < n; j++) {
        const o = j * LIGHT_STRIDE, moved = (j + pass) % 4 === 0 ? pass : 0;
        f32[o] = 0.3 + (j * 0.37 + moved * 0.11) % 1.8; f32[o + 1] = 0.5 + (j % 7) * 0.2; f32[o + 2] = 0.3 + (j * 0.53) % 1.8; f32[o + 3] = 3 + (j % 5);
        f32[o + 4] = f32[o + 5] = f32[o + 6] = 1;
      }
      this.update(frame, f32, 0, n, n - 4, planes, u8, 0, dims);
      this.worldChanged(0, 0, 0, 0.5 + (pass % 4), 2, 2);
    }
    for (const a of [this.key, this.pos, this.used, this.stale, this.mapped, this.ready, this.unplaced, this.skip, this._last, this._src, this._prev, this._fresh, this._at, this._stood]) a.fill(0);
    this.count = this.live = 0;
    this.changed = false;
  }

  // Trilinear solid density (0..1) at a point in metres, read from engine memory.
  _density(u8, ptr, dims, x, y, z) {
    const ox = dims[0], oy = dims[1], oz = dims[2];
    const fx = x / DENSITY_M - 0.5, fy = y / DENSITY_M - 0.5, fz = z / DENSITY_M - 0.5;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), z0 = Math.floor(fz);
    const tx = fx - x0, ty = fy - y0, tz = fz - z0;
    let sum = 0;
    for (let k = 0; k < 8; k++) {
      const xi = x0 + (k & 1), yi = y0 + ((k >> 1) & 1), zi = z0 + (k >> 2);
      if (xi < 0 || yi < 0 || zi < 0 || xi >= ox || yi >= oy || zi >= oz) continue;
      sum += u8[ptr + xi + ox * (zi + oz * yi)] * (k & 1 ? tx : 1 - tx) * (k & 2 ? ty : 1 - ty) * (k & 4 ? tz : 1 - tz);
    }
    return sum / 255;
  }

  // Lights are often spawned right at a surface (an impact point, a burning
  // voxel). Marched from there, every ray would start inside the wall, so the
  // light is first walked down the density gradient into open air. Returns
  // false when it is buried too deep to free.
  _lift(u8, ptr, dims, p) {
    const h = DENSITY_M;
    for (let i = 0; i < 5; i++) {
      const d = this._density(u8, ptr, dims, p[0], p[1], p[2]);
      if (d < 0.06) return true;
      const gx = this._density(u8, ptr, dims, p[0] + h, p[1], p[2]) - this._density(u8, ptr, dims, p[0] - h, p[1], p[2]);
      const gy = this._density(u8, ptr, dims, p[0], p[1] + h, p[2]) - this._density(u8, ptr, dims, p[0], p[1] - h, p[2]);
      const gz = this._density(u8, ptr, dims, p[0], p[1], p[2] + h) - this._density(u8, ptr, dims, p[0], p[1], p[2] - h);
      const gl = Math.hypot(gx, gy, gz);
      if (gl < 1e-3) break;
      const s = 0.1 * (1 + d) / gl;
      p[0] -= gx * s; p[1] -= gy * s; p[2] -= gz * s;
    }
    return this._density(u8, ptr, dims, p[0], p[1], p[2]) < WALL * 0.5;
  }

  // Position a slot's light for shading: the engine's position, lifted clear
  // of the surface it may sit on. A light that cannot be freed is left where
  // it is and shines unoccluded rather than being blacked out.
  _place(slot, u8, occPtr, dims) {
    const o = slot * 4, p = this._p, key = this.key, pos = this.pos;
    p[0] = key[o]; p[1] = key[o + 1]; p[2] = key[o + 2];
    const free = this.occlude && this._lift(u8, occPtr, dims, p);
    if (!free) { p[0] = key[o]; p[1] = key[o + 1]; p[2] = key[o + 2]; }
    pos[o] = p[0]; pos[o + 1] = p[1]; pos[o + 2] = p[2];
    this.mapped[slot] = free ? 1 : 0;
  }

  // The density volume changed inside this box (metres): maps of lights that
  // reach it are stale.
  worldChanged(x0, y0, z0, x1, y1, z1) {
    const p = this.pos;
    for (let i = 0; i < this.count; i++) {
      if (!this.used[i]) continue;
      const o = i * 4, r = this.key[o + 3];
      const dx = Math.max(x0 - p[o], 0, p[o] - x1), dy = Math.max(y0 - p[o + 1], 0, p[o + 1] - y1), dz = Math.max(z0 - p[o + 2], 0, p[o + 2] - z1);
      // (It may sit differently now, and its map is stale.)
      if (dx * dx + dy * dy + dz * dz < r * r) this.stale[i] = this.unplaced[i] = 1;
    }
  }

  // Choose this frame's lights and write them into the frame block.
  // f32/ptr/count: the light list (brightest first), entries from index
  // `lamps` on being lamp fixtures; planes: the view frustum in metres, five
  // (nx, ny, nz, d); u8/occPtr/dims: the density volume.
  update(frame, f32, ptr, count, lamps, planes, u8, occPtr, dims) {
    const d = frame.data, key = this.key, pos = this.pos, used = this.used, src = this._src, prev = this._prev;
    const held = this.count;
    prev.set(used);
    used.fill(0);
    let fresh = 0;
    const n = Math.min(count, MAX_LIGHTS);
    for (let j = 0; j < n; j++) {
      const s = ptr + j * LIGHT_STRIDE;
      const x = f32[s], y = f32[s + 1], z = f32[s + 2], r = f32[s + 3];
      if (!(r > 1e-3)) continue;
      // Lights whose whole sphere is off screen light nothing we can see.
      let seen = true;
      for (let i = 0; i < 20; i += 4) {
        const nx = planes[i], ny = planes[i + 1], nz = planes[i + 2];
        if (nx * x + ny * y + nz * z + planes[i + 3] < -r * Math.hypot(nx, ny, nz)) { seen = false; break; }
      }
      if (!seen) continue;
      let slot = -1;
      for (let i = 0; i < held; i++) {
        const o = i * 4;
        if (prev[i] && !used[i] && key[o] === x && key[o + 1] === y && key[o + 2] === z && key[o + 3] === r) { slot = i; break; }
      }
      if (slot >= 0) {
        used[slot] = 1;
        src[slot] = j;
      } else {
        this._fresh[fresh++] = j;
      }
    }
    // Of the lights that are where no light was: one within LIGHT_SAME of
    // a light of the frame before that nobody has claimed, of about its
    // reach, is that light, moved (the nearest such). It keeps the slot;
    // far enough from where its map was marched, or reaching further than
    // the map does, it is placed and marched again from where it is now,
    // and the map it has serves until then. (After every light that stood
    // still has its own slot: a mover must not take a stander's.)
    let left = 0;
    for (let k = 0; k < fresh; k++) {
      const j = this._fresh[k], s = ptr + j * LIGHT_STRIDE;
      const x = f32[s], y = f32[s + 1], z = f32[s + 2], r = f32[s + 3];
      let near = -1, nearD = LIGHT_SAME * LIGHT_SAME;
      for (let i = 0; i < held; i++) {
        if (!prev[i] || used[i]) continue;
        const o = i * 4, dx = key[o] - x, dy = key[o + 1] - y, dz = key[o + 2] - z, kr = key[o + 3];
        const dd = dx * dx + dy * dy + dz * dz;
        if (dd < nearD && r < kr * 1.5 && r > kr * 0.5) { near = i; nearD = dd; }
      }
      if (near < 0 || !this.follow) { this._fresh[left++] = j; continue; }
      const o = near * 4, kr = key[o + 3], at = this._at;
      // (Standing where it stood a frame ago, off the place its map was
      // marched from: LIGHT_STANDS.)
      const stands = at[o] === x && at[o + 1] === y && at[o + 2] === z && at[o + 3] === r;
      this._stood[near] = stands ? Math.min(this._stood[near] + 1, 255) : 0;
      at[o] = x; at[o + 1] = y; at[o + 2] = z; at[o + 3] = r;
      if (nearD >= LIGHT_REMAP * LIGHT_REMAP || r > kr * 1.1 || r < kr * 0.75 || this._stood[near] >= LIGHT_STANDS) {
        key[o] = x; key[o + 1] = y; key[o + 2] = z; key[o + 3] = r;
        this.unplaced[near] = 1;
        this.stale[near] = 1;
      }
      used[near] = 1;
      src[near] = j;
    }
    fresh = left;
    for (let k = 0, slot = 0; k < fresh; k++) {
      while (used[slot]) slot++;
      const j = this._fresh[k], s = ptr + j * LIGHT_STRIDE, o = slot * 4;
      key[o] = f32[s]; key[o + 1] = f32[s + 1]; key[o + 2] = f32[s + 2]; key[o + 3] = f32[s + 3];
      pos[o] = key[o]; pos[o + 1] = key[o + 1]; pos[o + 2] = key[o + 2];
      this.mapped[slot] = 0;
      this.unplaced[slot] = 1;
      // A lamp's light is not blocked by its own fixture.
      this.skip[slot] = j >= lamps ? LAMP_SKIP : 0.2;
      this.stale[slot] = 1;
      this.ready[slot] = 0;
      used[slot] = 1;
      src[slot] = j;
    }
    // Lights to place this frame, within the budget: the new ones first,
    // then those the world changed around.
    let places = this.placeBudget;
    for (let pass = 0; pass < 2 && places > 0; pass++) {
      for (let i = 0; i < MAX_LIGHTS && places > 0; i++) {
        if (!used[i] || !this.unplaced[i] || this.ready[i] !== pass) continue;
        this._place(i, u8, occPtr, dims);
        this.unplaced[i] = 0;
        places--;
      }
    }
    // Maps to march this frame, within the budget; lights never mapped
    // before go first (slot order follows the engine's brightest-first list).
    // (A map is marched from where its light has been placed.)
    let budget = this.bakeBudget;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < MAX_LIGHTS && budget > 0; i++) {
        if (!used[i] || this.stale[i] !== 1 || this.unplaced[i] || this.ready[i] !== pass) continue;
        this.stale[i] = 2;
        this.ready[i] = 1;
        budget--;
      }
    }
    let top = 0, live = 0;
    for (let i = 0; i < MAX_LIGHTS; i++) {
      const o = F.LIGHTS + i * 8;
      if (!used[i]) {
        // An empty slot below the top: out of range of everything.
        d[o + 3] = 1e12;
        d[o + 4] = d[o + 5] = d[o + 6] = d[o + 7] = 0;
        continue;
      }
      // (Its reach as the engine has it now; the map's is the key's.)
      const s = ptr + src[i] * LIGHT_STRIDE, r = f32[s + 3];
      d[o] = pos[i * 4]; d[o + 1] = pos[i * 4 + 1]; d[o + 2] = pos[i * 4 + 2]; d[o + 3] = 1 / (r * r);
      // A light still waiting for its first map shines unoccluded meanwhile.
      // (The last value: 0 for that; else the reach the map was marched
      // with over the light's reach now, which the lookup scales its
      // distances by: 1 for a light that has not moved or grown.)
      d[o + 4] = f32[s + 4]; d[o + 5] = f32[s + 5]; d[o + 6] = f32[s + 6]; d[o + 7] = this.mapped[i] && this.ready[i] ? key[i * 4 + 3] / r : 0;
      top = i + 1;
      live++;
    }
    // Did anything about the lights change since the last frame? (A scene lit
    // only by steady lamps still counts as still for temporal accumulation.)
    const last = this._last, len = Math.max(top, this.count) * 8;
    let changed = false;
    for (let i = 0; i < len; i++) {
      const v = d[F.LIGHTS + i];
      if (v !== last[i]) { changed = true; last[i] = v; }
    }
    this.changed = changed;
    this.count = top;
    this.live = live;
    frame.lightCount = top;
    d[F.CAM_FWD + 3] = top;
  }

  // March the maps of new or invalidated lights. The frame block must be
  // uploaded and an attribute-less vertex array bound. Returns draws issued.
  bake(occTex) {
    const gl = this.gl, st = this.state;
    this.baked = 0;
    let begun = false;
    for (let i = 0; i < this.count; i++) {
      if (!this.used[i] || this.stale[i] !== 2) continue;
      this.stale[i] = 0;
      if (!this.mapped[i]) continue;
      if (!begun) {
        begun = true;
        st.tex(UNIT.uLightOcc, gl.TEXTURE_2D, null);
        st.depth(false, false, gl.LESS);
        st.blend(BLEND.OFF);
        st.cull(CULL.OFF);
        st.scissor(false);
        st.tex(UNIT.uOcc, gl.TEXTURE_3D, occTex);
      }
      const x = (i % ATLAS_COLS) * LIGHT_TILE, y = Math.floor(i / ATLAS_COLS) * LIGHT_TILE, o = i * 4;
      st.tex(UNIT.uTex, gl.TEXTURE_2D, null);
      st.fbo(this.raw);
      let u = st.program(this.prog);
      gl.uniform4f(u.uLight, this.pos[o], this.pos[o + 1], this.pos[o + 2], this.key[o + 3]);
      gl.uniform4f(u.uTile, 0, 0, 2 * LIGHT_TILE, this.skip[i]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.fbo(this.fbo);
      st.viewport(x, y, LIGHT_TILE, LIGHT_TILE);
      st.scissor(true, x, y, LIGHT_TILE, LIGHT_TILE);
      st.tex(UNIT.uTex, gl.TEXTURE_2D, this.raw.tex);
      u = st.program(this.pack);
      gl.uniform4f(u.uTile, x, y, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.scissor(false);
      this.baked++;
    }
    return this.baked * 2;
  }
}

// Lamp lights: emissive voxels of the static world light their surroundings
// once the sun is low. The engine only marks lamp materials as emissive; the
// lights are inferred here from the emissive quads the draw lists collect,
// so carving a lamp away (or breaking it off its post) puts its light out.
const LAMP_CELL = 10;      // voxels: emissive quads this close form one lamp
const LAMP_GAIN = 0.3;     // light intensity per voxel face of full-strength emitter

export class Lamps {
  constructor() {
    this.list = new Float32Array(0); // [x y z radius | r g b _] per lamp, at full strength
    this.count = 0;
    this.max = 12;                   // most lamp lights in use at once (nearest first)
    this._near = new Float32Array(0);
  }

  // How strongly lamps light the scene for a sun elevation (its sine):
  // nothing by day, everything from dusk on.
  gain(sunY) {
    const t = Math.max(0, Math.min(1, (sunY - 0.02) / 0.24));
    return 1 - t * t * (3 - 2 * t);
  }

  // rows: the draw lists' emissive quads (five floats each: centre in voxels,
  // area, material). emission: linear rgb times strength per material.
  rebuild(rows, emission) {
    const cells = new Map();
    for (const q of rows.values()) {
      for (let i = 0; i < q.length; i += 5) {
        // A fixture that straddles a cell edge becomes two lamps sharing
        // its area, which adds up to the same light.
        const key = Math.floor(q[i] / LAMP_CELL) + 128 * (Math.floor(q[i + 1] / LAMP_CELL) + 128 * Math.floor(q[i + 2] / LAMP_CELL));
        let c = cells.get(key);
        if (!c) cells.set(key, c = [0, 0, 0, 0, Infinity, 0, 0, 0]);
        const a = q[i + 3], m = q[i + 4] * 3;
        c[0] += q[i] * a; c[1] += q[i + 1] * a; c[2] += q[i + 2] * a; c[3] += a;
        c[4] = Math.min(c[4], q[i + 1]);
        c[5] += emission[m] * a; c[6] += emission[m + 1] * a; c[7] += emission[m + 2] * a;
      }
    }
    this.count = cells.size;
    if (this.list.length < this.count * 8) {
      this.list = new Float32Array(this.count * 8);
      this._near = new Float32Array(this.count);
    }
    let o = 0;
    for (const c of cells.values()) {
      const area = c[3];
      // Bright enough to read as the light source it is, capped so a wall
      // of lamp voxels does not burn out the scene.
      const k = LAMP_GAIN * Math.min(1, 22 / (LAMP_GAIN * Math.max(c[5], c[6], c[7], 1e-6)));
      this.list[o] = c[0] / area * VOXEL;
      // Just under the fixture: lamps shine down, and the centre is solid.
      this.list[o + 1] = c[4] * VOXEL - 0.15;
      this.list[o + 2] = c[2] / area * VOXEL;
      this.list[o + 3] = Math.min(15, 8 + 0.6 * Math.sqrt(area));
      this.list[o + 4] = c[5] * k; this.list[o + 5] = c[6] * k; this.list[o + 6] = c[7] * k; this.list[o + 7] = 0;
      o += 8;
    }
  }

  // Writes the engine's lights and then the nearest visible lamps into dst
  // (LIGHT_STRIDE floats each); returns the total. planes: view frustum in
  // metres; gain scales the lamps.
  merge(dst, f32, ptr, count, cam, planes, gain) {
    const n = Math.min(count, MAX_LIGHTS), list = this.list, near = this._near;
    for (let i = 0; i < n * LIGHT_STRIDE; i++) dst[i] = f32[ptr + i];
    for (let i = 0; i < this.count; i++) {
      const o = i * 8, x = list[o], y = list[o + 1], z = list[o + 2], r = list[o + 3];
      let d = (x - cam[0]) ** 2 + (y - cam[1]) ** 2 + (z - cam[2]) ** 2;
      for (let p = 0; p < 20; p += 4) {
        const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2];
        if (nx * x + ny * y + nz * z + planes[p + 3] < -r * Math.hypot(nx, ny, nz)) { d = Infinity; break; }
      }
      near[i] = d;
    }
    let total = n;
    for (let k = 0; k < this.max && total < MAX_LIGHTS; k++) {
      let best = -1, bd = Infinity;
      for (let i = 0; i < this.count; i++) {
        if (near[i] < bd) { bd = near[i]; best = i; }
      }
      if (best < 0) break;
      near[best] = Infinity;
      const s = best * 8, o = total * LIGHT_STRIDE;
      dst[o] = list[s]; dst[o + 1] = list[s + 1]; dst[o + 2] = list[s + 2]; dst[o + 3] = list[s + 3];
      dst[o + 4] = list[s + 4] * gain; dst[o + 5] = list[s + 5] * gain; dst[o + 6] = list[s + 6] * gain; dst[o + 7] = 0;
      total++;
    }
    return total;
  }
}

// The fine quad stream: refined voxels drawn at 2.5 cm (engine/src/detail/).
//
// The engine decides which detail is shown fine (nearest first, inside the
// tier's distance and quad budget) and keeps exactly those meshes alive in a
// second quad buffer; everything else it shows as coarse stand-in quads in
// the main stream. So there is nothing to choose here: mirror the buffer
// into a texture and draw what is live, in the scene and in the shadow maps
// (refined voxels are missing from the coarse mesh while they are drawn
// fine, so a pitted wall would leak light if they were not in the maps).
//
// A fine quad is two RG32UI texels (layout: engine/src/detail/fine.rs):
// geometry in quarter voxels, then a normal per corner. The vertex stage
// hands the surface shader the same varyings as a coarse quad plus the
// interpolated normal (`FINE` in shaders.js).
import { OUT, QUAD_TEX_W, VOXEL } from './engine.js';
import { FRAME, UTIL, MAIN_FS, SHADOW_FS, MOTION_FS } from './shaders.js';
import { makeTexture } from './render_gl.js';

// Voxels along a mesh chunk (`mesher::CHUNK`).
const CHUNK_VOXELS = 32;
// Texture unit of the fine stream (render_gl.js hands out 0..19).
const UNIT_FINE = 20;
const ROW_QUADS = QUAD_TEX_W / 2;
// Fine quads in a segment of a row (see `FineDetail`), segments in a row.
const SEG_QUADS = 64;
const SEGS = ROW_QUADS / SEG_QUADS;
// What a segment holds: quads of the world and of bodies for the scene,
// and their casters, which only the shadow passes draw (fine.rs).
const K_WORLD = 1, K_BODY = 2, K_WORLD_CAST = 4, K_BODY_CAST = 8;
// The body a segment's body quads belong to when they are of several.
const MIXED = 0xffff;

const FINE_DECODE = `
#define VOXEL_M ${VOXEL.toFixed(4)}
uniform usampler2D uFine;
uniform sampler2D uXf;

struct Fine {
  vec3 local;   // corner position in the owning grid, voxels
  vec3 world;   // metres
  vec4 rq;      // body rotation
  vec3 pat;     // pattern offset (voxels)
  vec3 du;      // the quad's two edge directions (local axes)
  vec3 dv;
  vec3 wu;      // the same directions in world space
  vec3 wv;
  vec2 corner;  // -1 or +1 along du and dv for this vertex
  vec3 cell;    // the voxel the quad's solid side is in (local)
  vec3 normal;  // occupancy gradient at this corner, body axes (may be 0)
  int open;     // the side this quad's break is lit from, a face direction
  bool own;     // ... which is the way it faces itself
  int mat;
  int face;
  int body;     // 0 = the static world
  bool inner;   // the face lies inside its voxel: a break
  bool pit;     // its voxel is pitted: nearly whole, with a pocket in it
  int cut;      // the side its voxel was broken from (the engine's word: not by the eye, the same for a piece that has moved)
  bool back;    // a backing face: a whole voxel's, behind one drawn at 2.5 cm
  bool caster;  // for the shadow maps only (fine.rs)
  bool bar;     // a face of a bar that stands out of a break, or of the lump it holds (fine.rs FLAG_BAR)
};

// A pass is drawn as instances of one segment (as the main stream's lists
// are runs of slots: render_geom.js): the instance's word is the first
// quad slot of its segment.
layout(location = 0) in uint aSeg;

// Decodes the fine quad for this vertex. False for an empty slot.
bool decodeFine(out Fine o) {
  int qi = int(aSeg) + (gl_VertexID >> 2);
  int ci = gl_VertexID & 3;
  int t = qi * 2;
  ivec2 at = ivec2(t & ${QUAD_TEX_W - 1}, t >> ${Math.log2(QUAD_TEX_W)});
  uvec2 q = texelFetch(uFine, at, 0).rg;
  uint lo = q.r, hi = q.g;
  int mat = int((hi >> 11) & 255u);
  if (mat == 0) return false;
  uvec2 n = texelFetch(uFine, at + ivec2(1, 0), 0).rg;
  o.mat = mat;
  vec3 p = vec3(float(lo & 4095u), float((lo >> 12) & 4095u), float((lo >> 24) | ((hi & 15u) << 8))) * 0.25;
  uint face = (hi >> 4) & 7u;
  float w = float(((hi >> 7) & 3u) + 1u) * 0.25;
  float h = float(((hi >> 9) & 3u) + 1u) * 0.25;
  int body = int(hi >> 19);
  // A bar that stands out of the low side of a piece lies before the
  // piece's first voxel: its place wraps, and the top eight voxels of the
  // range are those before the grid (no piece is a thousand voxels long).
  if (body != 0) p -= 1024.0 * step(1016.0, p);
  uint d = face >> 1;
  bool pos = (face & 1u) == 1u;
  vec2 c = vec2(float(ci & 1), float(ci >> 1));
  if (!pos) c = c.yx;
  vec3 dn, du, dv;
  if (d == 0u) { dn = vec3(1, 0, 0); du = vec3(0, 1, 0); dv = vec3(0, 0, 1); }
  else if (d == 1u) { dn = vec3(0, 1, 0); du = vec3(0, 0, 1); dv = vec3(1, 0, 0); }
  else { dn = vec3(0, 0, 1); du = vec3(1, 0, 0); dv = vec3(0, 1, 0); }
  o.local = p + du * (c.x * w) + dv * (c.y * h) + (pos ? dn * 0.25 : vec3(0.0));
  o.cell = floor(p + 0.01);
  o.du = du;
  o.dv = dv;
  o.corner = c * 2.0 - 1.0;
  o.face = int(face);
  o.body = body;
  // Corner u + 2 v, sixteen bits each: four per axis, offset by 4, then
  // a nibble of the quad's flags.
  int k = int(c.x) + 2 * int(c.y);
  uint code = ((k < 2 ? n.r : n.g) >> uint(16 * (k & 1))) & 65535u;
  o.normal = vec3(float(code & 15u), float((code >> 4) & 15u), float((code >> 8) & 15u)) - 4.0;
  uint flags = ((n.r >> 12) & 15u) | (((n.r >> 28) & 15u) << 4) | (((n.g >> 12) & 15u) << 8) | (((n.g >> 28) & 15u) << 12);
  o.inner = (flags & 1u) != 0u;
  o.back = (flags & 1024u) != 0u;
  o.caster = (flags & 2048u) != 0u;
  o.pit = (flags & 4096u) != 0u;
  o.bar = (flags & 8192u) != 0u;
  // The side the voxel was broken from, or the quad's own where the voxel
  // is wide open on it, and for a face on the voxel's boundary: that one
  // is seen through a gap in the voxel next to it, from that side. (Lit
  // from the voxel's open side instead, the front of a wall whose back
  // was blown off would be lit from the room behind it.)
  o.own = ((flags >> (4u + face)) & 1u) != 0u || !o.inner;
  o.cut = int((flags >> 1) & 7u);
  o.open = o.own ? int(face) : o.cut;
  if (body == 0) {
    o.rq = vec4(0.0, 0.0, 0.0, 1.0);
    o.pat = vec3(0.0);
    o.world = o.local * VOXEL_M;
    o.wu = du;
    o.wv = dv;
  } else {
    ivec2 x = ivec2((body & 255) * 4, body >> 8);
    o.rq = texelFetch(uXf, x, 0);
    vec4 os = texelFetch(uXf, x + ivec2(1, 0), 0);
    o.pat = texelFetch(uXf, x + ivec2(2, 0), 0).xyz;
    o.world = os.xyz + qrot(o.rq, o.local * os.w);
    o.wu = qrot(o.rq, du);
    o.wv = qrot(o.rq, dv);
  }
  return true;
}
`;

// Scene pass: the varyings of MAIN_VS (shaders.js) plus the normal. Bit 23
// of vMatFace marks a face inside its voxel; bits 24..26 hold the side the
// break is lit from, bits 27..28 how many voxels under the surface on
// that side its voxel lies, and bits 29..30 the axis the voxel was broken
// along, plus one (on a face that is not inner: 1 for the skin round a
// pit's mouth); bit 31, on an inner face, that its voxel is pitted.
//
// Lit from where: a break is shaded as the surface it was cut into, from
// a point on that surface, or the inside of a 5 cm pit would be black
// (the light volumes are 20 cm and the pit's own rim shadows it). Which
// side that is comes from the engine: the side the voxel was broken from,
// or the quad's own where the voxel is wide open that way. How far under
// the surface the voxel lies is
// found in the record of the scene as built: where there was air within
// three voxels on that side, else on the nearest side that had any (for a
// face on the wall of a hole: the nearest across its own way, never the
// one behind it). Deeper than that (the wall of a crater, a crack through
// a slab) the side stands as it is.
const FINE_VS = `
${FRAME}
${UTIL}
${FINE_DECODE}
uniform usampler3D uSolid0;  // one bit per voxel: solid when the scene was built
bool wasSolid(ivec3 v) {
  ivec3 size = textureSize(uSolid0, 0); // bytes along x, then z, then y
  if (v.x < 0 || v.y < 0 || v.z < 0 || v.x >= size.x * 8 || v.z >= size.y || v.y >= size.z) return false;
  return ((texelFetch(uSolid0, ivec3(v.x >> 3, v.z, v.y), 0).r >> uint(v.x & 7)) & 1u) != 0u;
}
// The side (face direction) of voxel v nearest to where there was air when
// the scene was built, and in .y how many voxels in (1..3); .y = 0 when
// there was none within three voxels. Of sides equally near, one that looks
// towards the eye (toEye: the way to it) before one that looks away, or a
// wall broken through would be lit from the room behind it; then up first
// (most breaks are seen from above) and down last. across: an axis not to
// look along (-1: none), for a face on the wall of a hole, whose own way is
// over to the hole's other wall and whose back is the matter it is part of.
ivec2 surfaceSide(ivec3 v, int across, vec3 toEye) {
  for (int k = 1; k <= 3; k++) {
    int away = -1;
    for (int i = 0; i < 6; i++) {
      int f = i == 0 ? 3 : (i == 5 ? 2 : (i < 3 ? i - 1 : i + 1));
      if ((f >> 1) == across) continue;
      ivec3 d = ivec3(0);
      d[f >> 1] = (f & 1) * 2 - 1;
      if (wasSolid(v + d * k)) continue;
      if (dot(vec3(d), toEye) >= 0.0) return ivec2(f, k);
      if (away < 0) away = f;
    }
    if (away >= 0) return ivec2(away, k);
  }
  return ivec2(0, 0);
}
invariant gl_Position;
#ifdef MOTION_PASS
// The motion pass (render_post.js BodyMotion): where the vertex was a
// frame ago, by its body's transform then, as MAIN_VS has it for the
// coarse quads. A piece that is all breaks has no other quads to say it.
uniform sampler2D uXfPrev;
out vec4 vClipNow;
out vec4 vClipWas;
#endif
out vec3 vLocal;
out vec3 vWorld;
flat out vec4 vRq;
flat out vec3 vPat;
flat out int vMatFace;
// The material's palette entry, as MAIN_VS hands it on.
uniform usampler2D uPalPack;
flat out vec4 vPal0;
flat out vec4 vPal1;
flat out vec3 vFirst;   // the voxel the quad belongs to (its grid)
out vec3 vFineN;
void main() {
  Fine q;
  if (!decodeFine(q) || q.caster) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    return;
  }
#ifdef MOTION_PASS
  // (The world does not move.)
  if (q.body == 0) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    return;
  }
#endif
  // Half a pixel of growth closes the cracks at T-junctions, as for coarse
  // quads; a fine quad is small, so it is capped at a fifth of a sub-cell.
  vec3 toV = q.world - uCamPos.xyz;
  float dist = length(toV);
  vec3 vdir = toV / max(dist, 1e-4);
  float px = min(dist * uProj.w * uScreen.y, 0.005);
  float cu = dot(q.wu, vdir), cv = dot(q.wv, vdir);
  vec2 g = q.corner * px * inversesqrt(max(1.0 - vec2(cu * cu, cv * cv), 0.09));
  // A backing face meets the surface edge-on all round a hole: grown, it
  // would stick out of the wall as a line. It is seen through gaps only.
  if (q.back) g = vec2(0.0);
  vLocal = q.local + (q.du * g.x + q.dv * g.y) / VOXEL_M;
  vWorld = q.world + q.wu * g.x + q.wv * g.y;
#ifndef FINE_DEPTH
  vRq = q.rq;
  vPat = q.pat;
  vFineN = q.normal;
  vFirst = q.cell;
  uvec2 pal = texelFetch(uPalPack, ivec2(q.mat, 0), 0).rg;
  vPal0 = vec4(uvec4(pal.r, pal.r >> 8, pal.r >> 16, pal.r >> 24) & 255u) * (1.0 / 255.0);
  vPal1 = vec4(uvec4(pal.g, pal.g >> 8, pal.g >> 16, pal.g >> 24) & 255u) * (1.0 / 255.0);
  // A bar (the rod, of the palette's rust; not the lump it holds): on a
  // face turned to the sun a little over half the palette's colour and
  // less of its red (lit, the palette's own went salmon and read as a
  // stick of clay); on the others nearly the palette's own, or the mat
  // of bars across a blackened hole sinks into the soot.
  if (q.bar && q.mat == 30) vPal0.rgb *= mix(vec3(0.9, 0.92, 0.94), vec3(0.55, 0.6, 0.65), clamp(dot(qrot(q.rq, faceNormal(q.face)), uSunDir.xyz) * 3.0, 0.0, 1.0));
  bool traced = q.body == 0 || any(notEqual(q.pat, vec3(0.0)));
  int side = q.face, under = 0;
  ivec3 v = ivec3(floor(q.cell + 0.5));
  // A piece is seen from all round and lies as it fell, whether it still
  // moves or has come to rest in the world: each face as itself. But one
  // that has not moved from where it was cut (cracked off and still
  // wedged in the wall) is lit as the wall is, or its faces down in the
  // hole would be black next to the wall's own.
  bool placed = q.body == 0;
  // (What the lit side takes is a dozen lookups in the record of the scene
  // as built: not for a quad that is turned away or out of the picture.)
  // (By the quad's plane and its voxel's centre: the same answer at all
  // four corners, as the flat varying needs.)
  vec4 clip = uViewProj * vec4(q.world + qrot(q.rq, q.cell + 0.5 - q.local) * VOXEL_M, 1.0);
  bool seen = dot(qrot(q.rq, faceNormal(q.face)), toV) < 0.0 && clip.w > -0.2 && all(lessThan(abs(clip.xy), vec2(clip.w * 1.3 + 0.3)));
  if (!seen) placed = false;
  else if (!placed && traced && abs(q.rq.w) > 0.9995 && distance(q.world, (q.local + q.pat) * VOXEL_M) < 0.03) {
    placed = true;
    v = ivec3(floor(q.cell + q.pat + 0.5));
  }
  if (placed && wasSolid(v)) {
    side = q.open;
    // The way the voxel is open now first: a wall two voxels thick was
    // not broken from the room behind it.
    ivec3 d = ivec3(0);
    d[side >> 1] = (side & 1) * 2 - 1;
    int k = 1;
    // A wall broken on both sides is lit from the side it is seen from:
    // where the open side looks away from the eye and the surface is as
    // near on the other, that one.
    if (!q.own && dot(qrot(q.rq, vec3(d)), uCamPos.xyz - q.world) < 0.0) {
      while (k <= 3 && wasSolid(v - d * k)) k++;
      if (k <= 3) { side ^= 1; d = -d; }
      k = 1;
    }
    while (k <= 3 && wasSolid(v + d * k)) k++;
    if (k <= 3) {
      under = k - 1;
    } else {
      // (A face that looks at a voxel that has gone looks into a hole.)
      ivec2 s = surfaceSide(v, q.own ? side >> 1 : -1, uCamPos.xyz - q.world);
      if (s.y > 0) { side = s.x; under = s.y - 1; }
    }
  }
  // (Bits 29..30: for a break, one more than the axis its voxel was
  // broken along; 0 for any other face. For whatever is to lie along the
  // break as one surface, treads and risers alike: a pattern's lookup.
  // Unlike the side it is lit from, it does not turn with the eye and a
  // piece that has moved has it too.)
  // (On a face that is not inner, bits 29..30 are 1 where it is skin
  // of a voxel that is open through this very face: the skin round the
  // mouth of a pit, or what is left of a face a break runs through. And
  // bit 31, on an inner face: its voxel is pitted, so this is the floor
  // or a wall of a pocket in a surface and not a break in the open.)
  int rim = !q.inner && !q.back && q.cut == q.face ? 1 : 0;
  vMatFace = q.mat | (q.face << 8) | (traced ? 1 << 21 : 0) | (q.body != 0 ? 1 << 22 : 0) | (q.inner ? 1 << 23 : 0) | (side << 24) | (under << 27) | ((q.inner ? (q.cut >> 1) + 1 : rim) << 29) | (q.inner && q.pit ? 1 << 31 : 0);
#endif
  gl_Position = uViewProj * vec4(vWorld, 1.0);
#ifdef MOTION_PASS
  ivec2 xt = ivec2((q.body & 255) * 4, q.body >> 8);
  vec4 wq = texelFetch(uXfPrev, xt, 0);
  vec4 wo = texelFetch(uXfPrev, xt + ivec2(1, 0), 0);
  // A slot that held nothing a frame ago (a body just made) has no "was".
  vec3 was = dot(wq, wq) > 0.5 ? wo.xyz + qrot(wq, vLocal * wo.w) : vWorld;
  vClipNow = gl_Position;
  vClipWas = uPrevViewProj * vec4(was, 1.0);
#endif
}
`;

// Depth only, for the shadow atlas (BODIES_PASS: the body layer).
const FINE_SHADOW_VS = `
${UTIL}
${FINE_DECODE}
uniform mat4 uLightVP;
flat out int vGlass;
void main() {
  Fine q;
  // (Only casters throw shadows: the whole faces of what is drawn at
  // 2.5 cm, a fifth of the quads.)
#ifdef BODIES_PASS
  if (!decodeFine(q) || !q.caster || q.body == 0) {
#else
  if (!decodeFine(q) || !q.caster || q.body != 0) {
#endif
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    return;
  }
  vGlass = 0;
  gl_Position = uLightVP * vec4(q.world + (q.wu * q.corner.x + q.wv * q.corner.y) * 0.001, 1.0);
}
`;

export class FineDetail {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.tex = null;
    this.texRows = 0;
    // The indices of one segment, the same for every segment there is,
    // and the segments of the list being drawn, one instance each. (An
    // index buffer for every slot of the stream, 24 bytes a slot, and a
    // draw inside the driver for every run of a list is what this
    // replaces: the frame engineer's scheme for the main stream.)
    this.vao = gl.createVertexArray();
    const idx = new Uint16Array(SEG_QUADS * 6);
    for (let k = 0, v = 0; k < SEG_QUADS; k++, v += 4) {
      idx[k * 6] = v; idx[k * 6 + 1] = v + 1; idx[k * 6 + 2] = v + 2;
      idx[k * 6 + 3] = v + 2; idx[k * 6 + 4] = v + 1; idx[k * 6 + 5] = v + 3;
    }
    this.buf = gl.createBuffer();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    // The lists submitted this frame, one after another; when the buffer
    // is full it is given new storage and filled from the start (what the
    // GPU has yet to draw keeps the old).
    this.segBuf = gl.createBuffer();
    this.segCap = 4096;
    this.segAt = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.segBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.segCap * 4, gl.STREAM_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, 0);
    gl.vertexAttribDivisor(0, 1);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    state.vaoObj = undefined;
    this.capRows = 0;     // rows the tables have room for
    this.rows = 0;        // rows that hold or held quads
    this.high = 0;        // texels in use
    this.quads = 0;       // live fine quads, for the HUD
    this.changed = false; // the world's fine quads changed in the last sync() (box: changedBox())
    this.changedBodies = false; // ... and those of bodies
    this.p = null;
    this._box = new Int32Array(6);
    // The stream is full of holes, as the main one is (freed slots, slack
    // at the end of each), and every pass wants a part of it: the scene
    // what is in the picture, the world's shadow layer the world's quads
    // that can land in the rectangle being redrawn, the bodies' layer the
    // bodies' quads. So every row is cut into SEGS segments; a segment
    // knows what kinds of quad it holds and the bounds of its world quads
    // (an octant's quads lie together: a segment is a patch of one break),
    // and a pass is a list of segments.
    this.kind = new Uint8Array(0);
    this.box = new Int16Array(0);   // per segment: bounds of its world quads, voxels, max exclusive
    this.who = new Uint16Array(0);  // per segment: the body its body quads belong to (MIXED: several)
    this.list = new Uint32Array(0); // the list being built: first quad slot of each segment
    this.tn = 0;
    this._at = -1;                  // where the list last drawn lies in segBuf (-1: not there)
    // Indices submitted since the caller last set it to 0.
    this.indices = 0;
    // A framebuffer to read the texture through when it has to grow, if
    // this GPU lets an RG32UI texture be read that way (asked at the first
    // growth).
    this._copy = undefined;
  }

  // The programs of a tier. `make(name, vs, fs, defines)` is the renderer's
  // program cache; `defines` are the surface shader's for that tier.
  programs(make, defines) {
    const init = (gl, u) => { if (u.uFine) gl.uniform1i(u.uFine, UNIT_FINE); };
    const set = {
      scene: make('fine', FINE_VS, MAIN_FS, defines + '#define FINE\n'),
      // (Depth only: the same position, none of the surface's lookups.)
      depth: make('fine depth', FINE_VS, 'void main() {}\n', '#define FINE_DEPTH\n'),
      shadow: make('fine shadow', FINE_SHADOW_VS, SHADOW_FS, ''),
      shadowBodies: make('fine shadow bodies', FINE_SHADOW_VS, SHADOW_FS, '#define BODIES_PASS\n'),
      // (How far a body's fine quads have come since the last frame, for
      // the temporal resolve: position only, as the depth pass.)
      motion: make('fine motion', FINE_VS, MOTION_FS, '#define FINE_DEPTH\n#define MOTION_PASS\n'),
    };
    for (const p of Object.values(set)) {
      const base = p.init;
      if (!p.fineInit) {
        p.fineInit = true;
        p.init = (gl, u) => { if (base) base(gl, u); init(gl, u); };
      }
    }
    set.all = [set.scene, set.depth, set.shadow, set.shadowBodies];
    return set;
  }

  // Take a tier's programs and tell the engine the tier's distance and
  // quad budget for fine detail.
  configure(set, q, sim) {
    this.p = set;
    sim.command('detailConfig', q.fineDist ?? 25, q.fineQuads ?? 300000);
    sim.command('detailMarks', q.fineMarks ?? 1);
  }

  // The engine was re-initialised: its fine buffer starts over.
  reset() {
    if (this.tex) this.gl.deleteTexture(this.tex);
    this.tex = null;
    this.texRows = 0;
    this.high = 0;
    this.quads = 0;
    this.rows = 0;
    this.kind.fill(0);
  }

  // Room in the tables for `rows` rows.
  _reserve(rows) {
    if (rows <= this.capRows) return;
    const cap = Math.max(rows * 2, 32);
    const grow = (a, len) => { const b = new a.constructor(len); b.set(a); return b; };
    this.kind = grow(this.kind, cap * SEGS);
    this.box = grow(this.box, cap * SEGS * 6);
    this.who = grow(this.who, cap * SEGS);
    this.list = new Uint32Array(cap * SEGS);
    this.capRows = cap;
  }

  // Read row `r` of the stream again (`u32` from word `base`): what kinds
  // of quad each of its segments holds, and the bounds of its world quads.
  _scan(u32, base, r) {
    const kind = this.kind, box = this.box, who = this.who;
    let p = base + r * QUAD_TEX_W * 2;
    for (let s = 0, at = r * SEGS; s < SEGS; s++, at++) {
      let k = 0, w = 0, x0 = 32767, y0 = 32767, z0 = 32767, x1 = -1, y1 = -1, z1 = -1;
      for (let i = 0; i < SEG_QUADS; i++, p += 4) {
        const hi = u32[p + 1];
        if (((hi >>> 11) & 255) === 0) continue;
        const body = hi >>> 19, cast = (u32[p + 3] >>> 15) & 1;
        if (body) {
          k |= cast ? K_BODY_CAST : K_BODY;
          w = w === 0 || w === body ? body : MIXED;
          continue;
        }
        k |= cast ? K_WORLD_CAST : K_WORLD;
        const lo = u32[p];
        const x = (lo & 4095) >> 2, y = ((lo >>> 12) & 4095) >> 2, z = ((lo >>> 24) | ((hi & 15) << 8)) >> 2;
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (z < z0) z0 = z;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
        if (z > z1) z1 = z;
      }
      kind[at] = k;
      who[at] = w;
      const b = at * 6;
      box[b] = x0; box[b + 1] = y0; box[b + 2] = z0;
      // (A quad reaches at most one voxel beyond the voxel it starts in.)
      box[b + 3] = x1 + 2; box[b + 4] = y1 + 2; box[b + 5] = z1 + 2;
    }
  }

  // Mirror the rows the engine flagged into the texture. frame: the sim's
  // frame, which has every fine row (`fine` from word `fineAt`) and, where
  // the out block says, the runs of rows that changed.
  sync(out, frame) {
    const gl = this.gl, st = this.state;
    const rows = out[OUT.FINE_ROWS], runs = out[OUT.FINE_DIRTY_LEN];
    this.high = Math.min(out[OUT.FINE_HIGH], rows * QUAD_TEX_W);
    this.quads = out[OUT.STAT_FINE_QUADS];
    // Where the stream changed, for the shadow cache: the engine says.
    const where = out[OUT.FINE_CHANGED] >>> 0;
    this.changed = (where & (1 << 30)) !== 0;
    this.changedBodies = where >>> 31 !== 0;
    if (this.changed) {
      const b = this._box, c = CHUNK_VOXELS;
      for (let a = 0; a < 3; a++) {
        b[a] = ((where >>> (5 * a)) & 31) * c;
        b[a + 3] = (((where >>> (15 + 5 * a)) & 31) + 1) * c;
      }
    }
    if (rows === 0) return;
    const u32 = frame.fine, base = frame.fineAt, table = frame.u32;
    const used = Math.ceil(this.high / QUAD_TEX_W);
    this._reserve(used);
    let all = false;
    if (!this.tex || rows > this.texRows) {
      // Storage is immutable: room for the rows destruction will add. When
      // it is outgrown all the same, the rows in use are copied across on
      // the GPU and only what changed this frame is uploaded (sent again
      // in full they were megabytes in the frame of a collapse).
      const old = this.tex, kept = Math.min(this.rows, this.texRows);
      if (old && this._copy === undefined) {
        this._copy = gl.createFramebuffer();
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._copy);
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, old, 0);
        if (gl.checkFramebufferStatus(gl.READ_FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) this._copy = null;
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        st.target = undefined;
      }
      st.texForUpload(UNIT_FINE, gl.TEXTURE_2D, null);
      this.tex = makeTexture(gl, gl.TEXTURE_2D, gl.NEAREST, gl.CLAMP_TO_EDGE);
      st.units[UNIT_FINE] = this.tex;
      this.texRows = Math.max(rows * 2, 32);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32UI, QUAD_TEX_W, this.texRows);
      if (old && this._copy && kept > 0) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._copy);
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, old, 0);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, QUAD_TEX_W, kept);
        gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        st.target = undefined;
      } else {
        all = true;
      }
      if (old) gl.deleteTexture(old);
    }
    if (all) {
      // (A new texture reads zero, as the rows beyond the last quad do.)
      if (used > 0) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, QUAD_TEX_W, used, gl.RG_INTEGER, gl.UNSIGNED_INT, u32, base);
      for (let r = 0; r < used; r++) this._scan(u32, base, r);
    } else if (runs > 0) {
      st.texForUpload(UNIT_FINE, gl.TEXTURE_2D, this.tex);
      const rp = out[OUT.FINE_DIRTY_PTR] >> 2;
      for (let i = 0; i < runs; i++) {
        const start = table[rp + i * 2], n = Math.min(table[rp + i * 2 + 1], rows - start);
        if (n <= 0) continue;
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, start, QUAD_TEX_W, n, gl.RG_INTEGER, gl.UNSIGNED_INT, u32, base + start * QUAD_TEX_W * 2);
        // (Rows beyond the last quad hold nothing and have no tables.)
        for (let r = start, e = Math.min(start + n, used); r < e; r++) this._scan(u32, base, r);
      }
    }
    if (used > this.rows) this.rows = used;
  }

  // Where the world's fine quads changed in the last sync(), for the
  // shadow cache: a box of chunks (voxels, max exclusive).
  changedBox() {
    return this._box;
  }

  // Add segment `at` to the list being built.
  _emit(at) {
    this.list[this.tn++] = at * SEG_QUADS;
  }

  // The segments with something of the scene's in them: bodies' quads
  // wherever they are (they move), the world's inside the frustum
  // `planes` (five planes, voxels).
  _listVisible(planes) {
    const kind = this.kind, sb = this.box;
    this.tn = 0;
    this._at = -1;
    for (let at = 0, n = this.rows * SEGS, k = 0; at < n; at++, k += 6) {
      const m = kind[at] & (K_WORLD | K_BODY);
      if (!m) continue;
      if (m === K_WORLD && planes) {
        let inside = true;
        for (let p = 0; p < 20; p += 4) {
          const nx = planes[p], ny = planes[p + 1], nz = planes[p + 2];
          // The box corner furthest along the plane normal decides.
          if (nx * sb[nx > 0 ? k + 3 : k] + ny * sb[ny > 0 ? k + 4 : k + 1] + nz * sb[nz > 0 ? k + 5 : k + 2] + planes[p + 3] < 0) { inside = false; break; }
        }
        if (!inside) continue;
      }
      this._emit(at);
    }
  }

  // The segments with the world's casters whose bounds project into a light-space
  // rectangle (b: the light's basis, right in 0..2 and up in 3..5; the
  // rectangle in voxels: as `QuadLists.drawWorldIn`), or all of them.
  _listWorldIn(b, x0, y0, x1, y1) {
    const kind = this.kind, t = this.box;
    this.tn = 0;
    this._at = -1;
    for (let at = 0, n = this.rows * SEGS, k = 0; at < n; at++, k += 6) {
      if (!(kind[at] & K_WORLD_CAST)) continue;
      if (b) {
        let lo = 0, hi = 0, miss = false;
        for (let a = 0; a < 6 && !miss; a += 3) {
          const ax = b[a], ay = b[a + 1], az = b[a + 2];
          lo = ax * t[ax > 0 ? k : k + 3] + ay * t[ay > 0 ? k + 1 : k + 4] + az * t[az > 0 ? k + 2 : k + 5];
          hi = ax * t[ax > 0 ? k + 3 : k] + ay * t[ay > 0 ? k + 4 : k + 1] + az * t[az > 0 ? k + 5 : k + 2];
          miss = a === 0 ? hi < x0 || lo > x1 : hi < y0 || lo > y1;
        }
        if (miss) continue;
      }
      this._emit(at);
    }
  }

  // The segments with casters of the bodies whose `mark` is `want` (bodies
  // below `count`; the shadow cache's layers: render_shadow.js). A segment
  // with several bodies' quads goes with want 0, the bodies in motion, as
  // in `QuadLists.drawBodies`. No mark: every body's.
  _listBodies(want, mark, count) {
    const kind = this.kind, who = this.who;
    this.tn = 0;
    this._at = -1;
    for (let at = 0, n = this.rows * SEGS; at < n; at++) {
      if (!(kind[at] & K_BODY_CAST)) continue;
      const b = who[at];
      if (!mark || (b !== MIXED && b < count ? mark[b] === want : want === 0)) this._emit(at);
    }
  }

  // Draw the list last built with `prog`: one instanced draw whatever the
  // number of its segments. (Drawn again, as the scene's is for depth and
  // then colour, it is in the buffer already.)
  _draw(prog) {
    const n = this.tn;
    if (!n) return;
    const gl = this.gl, st = this.state;
    this.indices += n * SEG_QUADS * 6;
    st.tex(UNIT_FINE, gl.TEXTURE_2D, this.tex);
    st.program(prog);
    st.vao(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.segBuf);
    if (this._at < 0) {
      if (this.segAt + n > this.segCap) {
        while (n > this.segCap) this.segCap *= 2;
        gl.bufferData(gl.ARRAY_BUFFER, this.segCap * 4, gl.STREAM_DRAW);
        this.segAt = 0;
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, this.segAt * 4, this.list, 0, n);
      this._at = this.segAt;
      this.segAt += n;
    }
    gl.vertexAttribIPointer(0, 1, gl.UNSIGNED_INT, 0, this._at * 4);
    gl.drawElementsInstanced(gl.TRIANGLES, SEG_QUADS * 6, gl.UNSIGNED_SHORT, 0, n);
  }

  // Scene pass: what is in the frustum `planes` (voxels; none: all of
  // it). With `prepass`, depth first and the surface shader on equal
  // depth, as the caller does for coarse quads; the caller's depth state is
  // put back. Returns the draw calls issued.
  drawScene(prepass, planes) {
    // (No live quad: a tier that asks for none, or nothing broken.)
    if (this.quads === 0 || this.rows === 0 || !this.p) return 0;
    this._listVisible(planes);
    if (!this.tn) return 0;
    const gl = this.gl, st = this.state;
    if (prepass) {
      st.depth(true, true, gl.LESS);
      gl.colorMask(false, false, false, false);
      this._draw(this.p.depth);
      gl.colorMask(true, true, true, true);
      st.depth(true, false, gl.EQUAL);
      this._draw(this.p.scene);
      return 2;
    }
    this._draw(this.p.scene);
    return 1;
  }

  // Shadow atlas: the caller has the target, viewport, scissor and depth
  // state set; `mat` is the cascade's light matrix. The world's layer: the
  // world's quads that can land in the rectangle being redrawn (basis and
  // rectangle as `QuadLists.drawWorldIn`; no basis: all of them).
  drawShadowWorld(mat, basis, x0, y0, x1, y1) {
    if (this.quads === 0 || this.rows === 0 || !this.p) return;
    this._listWorldIn(basis, x0, y0, x1, y1);
    this._shadow(this.p.shadow, mat);
  }

  // ... and a layer of bodies: the quads of the bodies marked `want` (see
  // `_listBodies`).
  drawShadowBodies(mat, want, mark, count) {
    if (this.quads === 0 || this.rows === 0 || !this.p) return;
    this._listBodies(want, mark, count);
    this._shadow(this.p.shadowBodies, mat);
  }

  // The motion pass (render_post.js BodyMotion; the caller has the
  // velocity target, the depth state and last frame's transforms set):
  // list the segments with bodies' quads, then draw them. `listMotion`
  // returns how many there are.
  listMotion() {
    this.tn = 0;
    this._at = -1;
    if (this.quads === 0 || this.rows === 0 || !this.p) return 0;
    const kind = this.kind;
    for (let at = 0, n = this.rows * SEGS; at < n; at++) if (kind[at] & K_BODY) this._emit(at);
    return this.tn;
  }

  drawMotion() {
    this._draw(this.p.motion);
  }

  _shadow(prog, mat) {
    if (!this.tn) return;
    const u = this.state.program(prog);
    this.gl.uniformMatrix4fv(u.uLightVP, false, mat);
    this._draw(prog);
  }
}

// The far field: what stands beyond the box of live voxels, drawn as one
// static mesh (engine/src/scene/far.rs has the data: coarse boxes in the
// world's own voxel coordinates, a terrain, pictures of the live world).
//
// render_far_mesh.js turns the block into quads once, when a scene's far
// field arrives, ordered by distance from the box, so a tier draws a
// prefix of one index buffer in one call. Nothing is uploaded or rebuilt
// after that. The far field is in the scene pass only: in no shadow
// cascade, no contact map, no volume. It is lit by the sun and the sky
// and fogged like everything else, and shadowed by a map of its own: the
// whole mesh drawn once from the sun when the scene starts and again only
// when the sun has moved, never per frame. What the live world casts on
// it is read from the world's cascade.
import { FRAME, UTIL, ATMOSPHERE, SHADOW, SOFT_SHADOW } from './shaders.js';
import { PATTERN } from './render_shaders_surface.js';
import { describeProgram, BLEND, CULL, UNIT, makeTexture } from './render_gl.js';
import { farMesh, VERTEX, GROUND_AT } from './render_far_mesh.js';

// What a tier draws of it: everything within `reach` metres of the box
// (the terrain and the horizon at any reach). `shadow` is the size of its
// shadow map, fitted to the reach.
// (taps: how many times a far pixel reads the far shadow map, 1 or 4.)
export const FAR_TIERS = { low: { reach: GROUND_AT, shadow: 1024, taps: 1 }, medium: { reach: 300, shadow: 2048, taps: 4 }, high: { reach: 300, shadow: 2048, taps: 4 }, ultra: { reach: 300, shadow: 2048, taps: 4 }, capture: { reach: 300, shadow: 2048, taps: 4 } };
// How much of the sky's light reaches the foot of a street between walls
// (the far field's `canyon`: full sky from that height up).
const CANYON_FLOOR = 0.55;

export const FAR_VS = `
${FRAME}
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec4 aColor;
layout(location = 2) in vec4 aNormal;
layout(location = 3) in vec2 aUv;
// A material's palette entry, packed as the surface shader has it.
uniform usampler2D uPalPack;
out vec3 vWorld;
out vec2 vUv;
flat out vec3 vTint;
out vec3 vNormal;       // one a face, but for ground: the land's, from corner to corner
flat out int vMat;       // a plain face's material; 0: the face wears a picture; -1: a cut-out's pane
flat out float vBank;    // 1: a step one voxel high between two ramps of the land (render_far_mesh.js)
flat out vec4 vPal0;     // sRGB colour, variation
flat out vec4 vPal1;     // roughness, emissive, pattern, flags
void main() {
  vWorld = aPos;
  vUv = aUv;
  vTint = pow(aColor.rgb, vec3(2.2));
  vNormal = aNormal.xyz;
  vBank = aNormal.w < -0.5 ? 1.0 : 0.0;
  int id = int(aColor.a * 255.0 + 0.5);
  vMat = id == 255 ? -1 : id;
  uvec2 pal = texelFetch(uPalPack, ivec2(max(vMat, 0), 0), 0).rg;
  vPal0 = vec4(uvec4(pal.r, pal.r >> 8, pal.r >> 16, pal.r >> 24) & 255u) * (1.0 / 255.0);
  vPal1 = vec4(uvec4(pal.g, pal.g >> 8, pal.g >> 16, pal.g >> 24) & 255u) * (1.0 / 255.0);
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`;

// Sun and sky as the surface shader has them on open ground, the far
// field's own shadow, then the same haze.
//
// A plain face is drawn in its material's own surface pattern, from the
// same coordinates the live world's faces use (voxels of the world), so
// the flags of a pavement, the stripes of a lawn and the courses of a
// brick wall run on across the join, and fade into the same average with
// distance. A face that wears a picture takes the atlas instead: what the
// live world's own voxels look like face on (engine/src/scene/far/
// skins.rs), alpha 0 where they are glass: a window is a dark pane with
// the sky in it. On a cut-out's pane alpha 0 is nothing at all.
export const FAR_FS = `
${FRAME}
${UTIL}
${ATMOSPHERE}
${PATTERN}
${SHADOW}
#ifdef SOFT_SHADOW
${SOFT_SHADOW}
#endif
uniform sampler2D uTex;
uniform sampler2DShadow uFarShadow; // the far field's own shadow map
uniform mat4 uFarLight;           // world -> far shadow map uv and depth
uniform vec4 uFarParams;          // world size of a texel of it; how many taps a far pixel takes of it (0 = it is not there); the canyon's height (m, 0 = none) and the sky left at its foot
uniform sampler3D uSkyVis;        // the live world's sky (render_skyvis.js): r how much of it a cell sees
// How far out from the box (m) the far field goes from the sky the box's
// own last cells see to its own reckoning of it.
#define JOIN_REACH 6.0
in vec3 vWorld;
in vec2 vUv;
flat in vec3 vTint;
in vec3 vNormal;
flat in int vMat;
flat in float vBank;
flat in vec4 vPal0;
flat in vec4 vPal1;
out vec4 oColor;
#ifdef HDR_ENCODE
vec3 enc(vec3 c) { return sqrt(min(c, 16.0) * 0.0625); }
#elif defined(HDR_DITHER)
vec3 enc(vec3 c) { return min(c, 64.0) * (0.992 + 0.016 * ign(gl_FragCoord.xy)); }
#else
vec3 enc(vec3 c) { return min(c, 64.0); }
#endif
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
// The surface shader's sun highlight (sunSpecular in shaders.js, to the
// letter: a road seen along its length has its sheen on both sides of
// the join, or none).
vec3 sunSpecular(vec3 n, vec3 v, vec3 l, float rough, vec3 f0) {
  vec3 h = normalize(l + v);
  float ndh = max(dot(n, h), 0.0);
  float ndv = max(dot(n, v), 1e-3);
  float ndl = max(dot(n, l), 1e-3);
  float ldh = max(dot(l, h), 0.0);
  float a = rough * rough;
  float a2 = a * a;
  float d = ndh * ndh * (a2 - 1.0) + 1.0;
  float k = a * 0.5;
  float vis = 0.25 / ((ndl * (1.0 - k) + k) * (ndv * (1.0 - k) + k));
  float f = 1.0 - ldh;
  float f2 = f * f;
  return (f0 + (1.0 - f0) * (f2 * f2 * f)) * min(a2 / (d * d) * vis, 40.0);
}
// Sunlight reaching a point of the far field.
// Inside the square of the cascade that holds the whole world, and no
// nearer the light than its range begins, the near shadows' cascades hold
// everything that can shade the point: the live block, and the far
// field's own casters (FarField.drawCasters). There the point is shaded
// by the world's own function (sunShadow, shaders.js: its bias, its
// taps, its choice of cascade), so the edge of a shadow that crosses the
// join is one line on both sides of it, the block's or a far row's.
// Anywhere else, and on a cut-out's pane (which stands in its own twin's
// place), by the far field's own map: the far solids' faces that look
// away from the sun, so a lit face is never in its own shadow.
float farShadow(vec3 p, vec3 n, bool pane) {
  float ndl = max(dot(n, uSunDir.xyz), 0.0);
  float edge, rTex;
  vec3 w = shadowCoord(CASCADES - 1, p, n, ndl, 0.0, edge, rTex);
  if (!pane && edge >= uShadowParams.y * (float(SHADOW_MAX_R) + 2.0) && w.z >= 0.0) {
    return sunShadow(p, n, ndl, ign(gl_FragCoord.xy), 0.0);
  }
  vec3 q = p + n * uFarParams.x;
  vec3 s = (uFarLight * vec4(q, 1.0)).xyz;
  float lit = 1.0;
  float z = min(s.z, 1.0);
  if (uFarParams.y > 1.5) {
    // Four taps half a texel apart: an edge of a far shadow is a soft
    // line. (One tap of a texel of 35 cm drew the shadow one far gable
    // throws on the next as a stair of lit squares, at dusk, from the
    // box's edge.)
    vec2 h = vec2(0.5 / float(textureSize(uFarShadow, 0).x));
    lit = 0.25 * (textureLod(uFarShadow, vec3(s.xy - h, z), 0.0) + textureLod(uFarShadow, vec3(s.xy + vec2(h.x, -h.y), z), 0.0)
                + textureLod(uFarShadow, vec3(s.xy + vec2(-h.x, h.y), z), 0.0) + textureLod(uFarShadow, vec3(s.xy + h, z), 0.0));
  } else if (uFarParams.y > 0.0) {
    lit = textureLod(uFarShadow, vec3(s.xy, z), 0.0);
  }
  return lit;
}
void main() {
  vec3 face = normalize(vNormal);
  int pattern = vMat > 0 ? int(vPal1.b * 255.0 + 0.5) : 0;
  // A step one voxel high between two ramps of a lawn is the lawn
  // sloping, as it is in the box (the bank of shaders.js): lit as the level
  // ground above and below it and drawn in the lawn's own pattern where
  // it stands, not as a wall of turf with its back to the sun (a row of
  // dark wedges along the join, where the live bank beside them is one
  // lawn).
  bool bank = vBank > 0.5 && pattern == PAT_TURF;
  if (bank) face = vec3(0.0, 1.0, 0.0);
  vec3 n = face;
  vec3 toCam = uCamPos.xyz - vWorld;
  float dist = sqrt(max(dot(toCam, toCam), 1e-8));
  vec3 v = toCam / dist;
  // The face's plane as the surface shader names it: which axis it looks
  // along, its two coordinates in voxels of the world, the voxel under
  // the pixel and its layer along the normal.
  vec3 an = abs(n);
  int axis = an.y > 0.7 ? 1 : (an.x > an.z ? 0 : 2);
  vec3 nl = axis == 0 ? vec3(sign(n.x), 0.0, 0.0) : (axis == 1 ? vec3(0.0, sign(n.y), 0.0) : vec3(0.0, 0.0, sign(n.z)));
  vec3 pc = vWorld * 10.0;
  vec2 uv = axis == 0 ? pc.zy : (axis == 1 ? pc.xz : pc.xy);
  // (A bank's grass is the lawn at its foot, seen as if the step were not
  // there: where the eye's ray through the pixel meets the level below.
  // Looked up where the riser stands, every blade is a stripe as high as
  // the step.)
  if (bank) uv -= v.xz * (fract(pc.y) / max(v.y, 0.12));
  vec2 gx = dFdx(uv), gy = dFdy(uv);
  vec3 tu = axis == 0 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
  vec3 tv = axis == 1 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  // (The atlas is read by the faces that wear a picture only; its
  // derivatives are taken out here, ahead of the branch.)
  vec2 skinDx = dFdx(vUv), skinDy = dFdy(vUv);
  vec4 skin = vec4(1.0);
  vec3 albedo;
  float cavity = 1.0, rough = 1.0, lit = 1.0;
  bool metal = false;
  if (vMat > 0) {
    vec3 vc = floor(pc - nl * 0.5);
    Surf s;
    s.albedo = pow(vPal0.rgb, vec3(2.2));
    s.rough = max(vPal1.r, 0.05);
    s.cavity = 1.0;
    s.bevel = 1.0;
    s.var = vPal0.a * 2.0;
    int flags = int(vPal1.a * 255.0 + 0.5);
#ifdef DETAIL
    // How the face is seen and lit along its own axes, for the relief a
    // pattern has below the face.
    patEye = clamp(vec2(dot(toCam, tu), dot(toCam, tv)) / max(dot(toCam, nl), 0.05 * dist), -3.0, 3.0);
    float sn = dot(uSunDir.xyz, nl);
    patSun = sn > 0.0 ? clamp(vec2(dot(uSunDir.xyz, tu), dot(uSunDir.xyz, tv)) / max(sn, 0.1), -8.0, 8.0) : vec2(0.0);
#endif
    // (A lawn is one lawn at whatever level it lies, as in the box: its
    // patches of lush and dry run on across a step, and across the join.)
    surfacePattern(pattern, uv, gx, gy, pattern == PAT_TURF && axis == 1 ? 0.0 : dot(vc, abs(nl)), axis != 1, (flags & 32) != 0, 1.0, 0.0, vec2(0.0), s);
    albedo = s.albedo * (1.0 + (hash13(vc) - 0.5) * s.var) * vTint;
    cavity = s.cavity;
    rough = s.rough;
    metal = (flags & 128) != 0 && vPal1.r < 0.5;
    lit = s.lit;
    // The pattern's millimetres of relief lean the normal, as on a live face.
    n = normalize(n + tu * s.tilt.x + tv * s.tilt.y);
  } else {
    skin = textureGrad(uTex, vUv, skinDx, skinDy);
    if (vMat < 0) {
      if (skin.a < 0.5) discard;
      skin.a = 1.0;
      // A crown shades itself: a tree on two panes is lit as the live
      // tree's leaves are on average, not as a board in the open.
      cavity = 0.72;
    }
    albedo = skin.rgb * vTint;
  }
  // From here the surface shader's own arithmetic for a face in the open
  // (full sky, no volume AO), so that the two agree where they meet.
  vec3 l = uSunDir.xyz;
  vec3 hemi = mix(uAmbGround.rgb, uAmbSky.rgb, n.y * 0.5 + 0.5);
  // Between walls the sky is half shut out at the foot of the street.
  float open = uFarParams.z > 0.0 ? mix(uFarParams.w, 1.0, clamp(vWorld.y / uFarParams.z, 0.0, 1.0)) : 1.0;
  vec3 f0 = metal ? albedo : vec3(0.04);
  vec3 diff = metal ? albedo * 0.28 : albedo;
  vec3 amb = hemi * open;
  // Beside the box: the sky the live world's last cell sees there, read
  // and weighed as the surface shader does (skyVisibility, and its share
  // of bounce where the sky is shut out), so that the shade on the two
  // sides of the join is one tone whatever stands over it; from there to
  // the far field's own within JOIN_REACH. (The live volume takes all
  // beyond the box for open air: under the el the road's last metres are
  // lighter than a street's foot.)
  vec2 size = 1.0 / uOccInv.xy;
  vec2 off = vWorld.xz - clamp(vWorld.xz, vec2(0.0), size);
  float away = dot(off, off);
  if (away < JOIN_REACH * JOIN_REACH) {
    vec3 sp = vWorld + face * 0.44 + vec3(0.0, 0.12, 0.0);
    sp.xz = clamp(sp.xz, vec2(0.0), size);
    float sv = textureLod(uSkyVis, sp.xzy * uSkyVisInv.xyz, 0.0).r;
    amb = mix(hemi * sv + uAmbGround.rgb * (0.22 * (1.0 - sv)), amb, smoothstep(0.0, JOIN_REACH, sqrt(away)));
  }
  vec3 ambient = diff * amb * cavity;
  float ndl = max(dot(n, l), 0.0);
  if (ndl > 0.0 && uSunDir.w > 0.0) ndl *= farShadow(vWorld, face, vMat < 0);
#ifdef SOFT_SHADOW
  // The dust's own shade and the debris', as the world's ground takes
  // them (the soft shadow map, over the 41 m round the camera): without
  // it the world's lawn darkens under a blast's haze and the far lawn
  // beside it does not, a ruled line where the box ends (the look
  // engineer's finding, 16 October). Outside the map it is 1 before the
  // lookup.
  if (ndl > 0.0) ndl *= softShadow(vWorld + face * 0.03, 1.0);
#endif
  vec3 sun = uSunCol.rgb * (ndl * lit);
  vec3 col = diff * (sun * mix(1.0, cavity, 0.6));
#ifdef SPECULAR
  if (ndl > 0.0) col += sun * sunSpecular(n, v, l, rough, f0);
  if (metal || rough < 0.55) {
    float fr = 1.0 - max(dot(n, v), 0.0);
    float fr2 = fr * fr;
    vec3 fres = f0 + (max(vec3(1.0 - rough), f0) - f0) * (fr2 * fr2 * fr);
    vec3 env = mix(mirrorEnv(normalize(reflect(-v, n) + n * rough)), hemi, rough * rough);
    if (metal) env = mix(env, vec3(luma(env)), 0.55);
    ambient += env * fres * open;
  }
#else
  if (metal) ambient += mirrorEnv(reflect(-v, n)) * f0 * open;
#endif
  col += ambient;
  if (skin.a < 0.999) {
    float fr = 1.0 - max(dot(n, v), 0.0);
    float fr2 = fr * fr;
    vec3 pane = albedo * hemi * 0.06 + mirrorEnv(reflect(-v, n)) * (0.05 + 0.95 * fr2 * fr2);
    col = mix(pane, col, skin.a);
    ambient *= skin.a;
  }
  float fog = fogAmount(-toCam, dist);
  col = hazed(col, -v, fog);
  // (Alpha: the ambient share of the pixel, as the surface shader writes it.)
  float share = luma(ambient) / max(luma(col), 1e-4) * (1.0 - fog);
  oColor = vec4(enc(col), clamp(share, 0.0, 1.0));
}
`;

// The shadow passes: depth only; a cut-out's pane casts where its
// picture is.
// And open work (a deck of ties, scene::far::OPEN) casts as the live el's
// ties do: timbers 30 cm wide at 80 cm, at the places the live ones lie
// at (scene/nyc_el.rs: x from 2 to 5 of every 8 voxels), so that under
// the line the bars of light and shade run on across the join.
// PRESS: the pass into the near shadows' cascades (FarField.drawCasters).
// What stands nearer the light than a cascade's range begins is pressed
// onto its near plane: everything in the cascade is behind it.
const FAR_SHADOW_VS = `
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec4 aColor;
layout(location = 2) in vec4 aNormal;
layout(location = 3) in vec2 aUv;
uniform mat4 uLightVP;
out vec2 vUv;
out float vAlong;
flat out float vCut;
flat out float vOpen;
void main() {
  vUv = aUv;
  vCut = aColor.a > 0.999 ? 1.0 : 0.0;
  vOpen = aNormal.w > 0.5 ? 1.0 : 0.0;
  vAlong = aNormal.w > 0.9 ? aPos.x : aPos.z;
  gl_Position = uLightVP * vec4(aPos, 1.0);
#ifdef PRESS
  gl_Position.z = max(gl_Position.z, -1.0);
#endif
}
`;
const FAR_SHADOW_FS = `
uniform sampler2D uTex;
in vec2 vUv;
in float vAlong;
flat in float vCut;
flat in float vOpen;
void main() {
  if (vCut > 0.5 && texture(uTex, vUv).a < 0.5) discard;
  if (vOpen > 0.5 && fract(vAlong * 1.25 - 0.25) >= 0.375) discard;
}
`;

export class FarField {
  constructor(gl, state) {
    this.gl = gl;
    this.state = state;
    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    // (Made on a unit of its own choosing and the state told so: made on
    // whatever unit happened to be active it took the place of the texture
    // the state still believed was bound there, the heaps' stones.)
    state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, null);
    this.tex = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE);
    state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    this.program = null;
    // Quads in the mesh, and how many of them lie within each reach asked
    // for so far (the mesh is ordered by distance from the box).
    this.quads = 0;
    // Quads in the last draw call of this one (0: none drawn yet).
    this.drawn = 0;
    this.bytes = 0;
    this.buildMs = 0;
    this.atlasBytes = 0;
    // The shadow map: a depth texture, where it was drawn from, and the
    // world -> map matrices for drawing it and for reading it.
    this.shadowProgram = describeProgram(FAR_SHADOW_VS, FAR_SHADOW_FS, '', 'far shadow');
    // What of it casts into the near shadows' cascades (drawCasters): a
    // list of the mesh's own vertices, the quads in it, and how many
    // times the list has been made.
    this.castProgram = describeProgram(FAR_SHADOW_VS, FAR_SHADOW_FS, '#define PRESS\n', 'far casters');
    this.castVao = gl.createVertexArray();
    this.castIbo = gl.createBuffer();
    this.casters = 0;
    this.casterLists = 0;
    this._castFor = '';
    this._castRects = new Float32Array(0);
    this._verts = null;
    this._land = [0, 0];
    this._made = 0;
    this.shadow = null;
    this.shadowDraws = 0;
    this._sun = [NaN, NaN, NaN];
    this._shadowFor = '';
    this._clip = new Float32Array(16);
    this._light = new Float32Array(16);
    this._params = new Float32Array(4);
    this._dist = null;
    this.drawn = 0;
  }

  // Take a scene's far field: `block` as vx_scene_far returns it (null or
  // empty for a scene without one).
  set(block) {
    const gl = this.gl, t0 = performance.now();
    this.quads = 0;
    this._dist = null;
    this._sun[0] = NaN;
    this._params[2] = 0;
    this._verts = null;
    this.casters = 0;
    this._made++;
    const mesh = farMesh(block);
    if (!mesh || !mesh.quads) return;
    this._reach = mesh.reach;
    this._size = mesh.size;
    this._high = mesh.high;
    this._params[2] = mesh.canyon;
    this._params[3] = CANYON_FLOOR;
    // The atlas: three mip levels, which the pictures' gutters are good for.
    this.state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, mesh.atlas.w, mesh.atlas.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, mesh.atlas.pixels);
    gl.generateMipmap(gl.TEXTURE_2D);
    this.atlasBytes = mesh.atlas.w * mesh.atlas.h * 4;
    const q = mesh.quads, idx = new Uint32Array(q * 6);
    for (let i = 0; i < q; i++) idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6);
    this.state.vao(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, VERTEX, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, VERTEX, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.BYTE, true, VERTEX, 16);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 2, gl.UNSIGNED_SHORT, true, VERTEX, 20);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    // (The casters' list reads the same vertices through a list of its own.)
    this.state.vao(this.castVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    for (const [at, n, type, norm, off] of [[0, 3, gl.FLOAT, false, 0], [1, 4, gl.UNSIGNED_BYTE, true, 12], [2, 4, gl.BYTE, true, 16], [3, 2, gl.UNSIGNED_SHORT, true, 20]]) {
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, n, type, norm, VERTEX, off);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.castIbo);
    this._verts = mesh.verts;
    this._land = mesh.land;
    this.quads = q;
    this.bytes = q * (4 * VERTEX + 24) + this.atlasBytes;
    this._dist = mesh.dist;
    this.buildMs = performance.now() - t0;
  }

  // Quads within `reach` metres of the box (they come first in the mesh).
  within(reach) {
    const d = this._dist, r = reach;
    if (!d) return 0;
    let lo = 0, hi = d.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (d[mid] <= r) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  // Bring the shadow map up to date: drawn when there is none for this
  // tier and this light yet (`light`: unit vector toward the sun or the
  // moon; `lit`: one of them is up). `wait`: the light moved a moment ago
  // (a day running fast): leave it a few frames. Returns the draws issued.
  // `busy`: a cascade of the near shadows was redrawn in this frame; a
  // map that is there is then left as it is for up to half a second more
  // (it is of another light or reach, and still a shadow map), so that
  // the far map's redraw does not fall into a frame that already has the
  // near ones'.
  updateShadow(tier, light, lit, frameNo, wait, busy = false) {
    const cfg = FAR_TIERS[tier] || FAR_TIERS.medium, P = this._params;
    if (!this._dist || !lit || !cfg.shadow) {
      P[1] = 0;
      return 0;
    }
    // (What the map depends on: its size and what it holds, not the
    // tier's name. Medium and high share one.)
    const key = cfg.shadow + '|' + cfg.reach + '|' + cfg.taps + '|' + this.quads, s = this._sun;
    if (key === this._shadowFor && s[0] === light[0] && s[1] === light[1] && s[2] === light[2]) return 0;
    if (wait && key === this._shadowFor && frameNo - this._shadowAt < 8) return 0;
    if (busy && this.shadow && P[1] > 0) {
      if (this._due === undefined) this._due = frameNo + 30;
      if (frameNo < this._due) return 0;
    }
    this._due = undefined;
    const gl = this.gl, st = this.state, res = cfg.shadow;
    if (!this.shadow || this.shadow.w !== res) {
      if (this.shadow) { gl.deleteTexture(this.shadow.tex); gl.deleteFramebuffer(this.shadow.fbo); }
      st.texForUpload(UNIT.uFarShadow, gl.TEXTURE_2D, null);
      const tex = makeTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.CLAMP_TO_EDGE);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT16, res, res);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex, 0);
      gl.drawBuffers([gl.NONE]);
      gl.readBuffer(gl.NONE);
      gl.bindTexture(gl.TEXTURE_2D, null);
      st.target = undefined;
      this.shadow = { tex, fbo, w: res, h: res };
    }
    s[0] = light[0]; s[1] = light[1]; s[2] = light[2];
    this._shadowFor = key;
    this._shadowAt = frameNo;
    // Light space as the cascades have it: right = up x L, up' = L x right.
    let ux = 0, uy = 1, uz = 0;
    if (Math.abs(s[1]) > 0.99) { ux = 1; uy = 0; }
    let rx = uy * s[2] - uz * s[1], ry = uz * s[0] - ux * s[2], rz = ux * s[1] - uy * s[0];
    const rl = Math.hypot(rx, ry, rz) || 1;
    rx /= rl; ry /= rl; rz /= rl;
    const vx = s[1] * rz - s[2] * ry, vy = s[2] * rx - s[0] * rz, vz = s[0] * ry - s[1] * rx;
    // Fit what this tier draws: the box and its reach, ground to rooftops.
    const reach = Math.min(cfg.reach, this._reach);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let k = 0; k < 8; k++) {
      const px = k & 1 ? this._size[0] + reach : -reach, py = k & 2 ? this._high : 0, pz = k & 4 ? this._size[1] + reach : -reach;
      const lx = px * rx + py * ry + pz * rz, ly = px * vx + py * vy + pz * vz, lz = px * s[0] + py * s[1] + pz * s[2];
      x0 = Math.min(x0, lx); x1 = Math.max(x1, lx);
      y0 = Math.min(y0, ly); y1 = Math.max(y1, ly);
      z0 = Math.min(z0, lz); z1 = Math.max(z1, lz);
    }
    const hx = (x1 - x0) * 0.5, hy = (y1 - y0) * 0.5, cx = (x0 + x1) * 0.5, cy = (y0 + y1) * 0.5;
    const zr = 1 / (z1 - z0 + 2), zMax = z1 + 1;
    const m = this._clip, d = this._light;
    m[0] = rx / hx; m[4] = ry / hx; m[8] = rz / hx; m[12] = -cx / hx;
    m[1] = vx / hy; m[5] = vy / hy; m[9] = vz / hy; m[13] = -cy / hy;
    m[2] = -2 * s[0] * zr; m[6] = -2 * s[1] * zr; m[10] = -2 * s[2] * zr; m[14] = 2 * zMax * zr - 1;
    m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
    for (let k = 0; k < 16; k++) d[k] = m[k] * 0.5;
    d[12] += 0.5; d[13] += 0.5; d[14] += 0.5; d[15] = 1;
    P[0] = 2 * Math.max(hx, hy) / res;
    P[1] = cfg.taps;
    // Faces that look away from the light only, so no lit face needs a bias.
    st.tex(UNIT.uFarShadow, gl.TEXTURE_2D, null);
    st.fbo(this.shadow);
    st.scissor(false);
    st.depth(true, true, gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.FRONT);
    st.polygonOffset(false);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    st.vao(this.vao);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    const u = st.program(this.shadowProgram);
    gl.uniformMatrix4fv(u.uLightVP, false, m);
    gl.drawElements(gl.TRIANGLES, this.within(cfg.reach) * 6, gl.UNSIGNED_INT, 0);
    this.shadowDraws++;
    return 1;
  }

  // The far field in the near shadows' cascades (render_shadow.js calls
  // this wherever it draws a cascade's world layer, whole or a rectangle
  // of it, under its scissor): what of the far field can shade anything
  // the cascades are read for, so that the world's own shadow lookup
  // finds a far row's shadow in the box, and the far field's finds it
  // beside the box, as sharp as the block's own.
  // `basis`: the cascades' light space (right, up, toward the light);
  // `cx, cy, half`: the square of the cascade that holds the whole world;
  // `zFar`: where the cascades' range ends, away from the light.
  // The list is made when the light, the world's square or the mesh has
  // changed, and not in a frame that only draws: the faces that look away
  // from the light (a lit face is never in its own shadow) of whatever
  // stands on the land, whose corners reach into that square and are
  // nearer the light than the range's end. Returns the quads drawn.
  // `rx0..ry1`: the rectangle of the layer being drawn (light space,
  // metres; all of it where not given). Where none of the casters lies
  // over it nothing is asked of the GPU: most of what a collapse redraws
  // is in the middle of the box, and the far field stands round it.
  drawCasters(mat, basis, cx, cy, half, zFar, rx0 = -Infinity, ry0 = -Infinity, rx1 = Infinity, ry1 = Infinity) {
    if (!this._dist || !this._verts) return 0;
    const gl = this.gl, st = this.state;
    const key = `${this._made}|${basis[6]}|${basis[7]}|${basis[8]}|${cx}|${cy}|${half}|${zFar}`;
    if (key !== this._castFor) {
      this._castFor = key;
      const v = this._verts, f32 = new Float32Array(v.buffer, v.byteOffset, v.byteLength >> 2), i8 = new Int8Array(v.buffer, v.byteOffset, v.byteLength);
      const idx = [], rects = [];
      for (let q = 0; q < this.quads; q++) {
        if (q >= this._land[0] && q < this._land[1]) continue;
        const o = q * 4 * VERTEX;
        if (v[o + 15] === 255) {
          // (A cut-out's pane is lit as what looks at the sky; which way
          // it faces is in its corners. Of two back to back, one.)
          const a = o >> 2, b = (o + VERTEX) >> 2, c = (o + 2 * VERTEX) >> 2;
          const ex = f32[b] - f32[a], ey = f32[b + 1] - f32[a + 1], ez = f32[b + 2] - f32[a + 2], fx = f32[c] - f32[a], fy = f32[c + 1] - f32[a + 1], fz = f32[c + 2] - f32[a + 2];
          if ((ey * fz - ez * fy) * basis[6] + (ez * fx - ex * fz) * basis[7] + (ex * fy - ey * fx) * basis[8] >= 0) continue;
        } else if (i8[o + 16] * basis[6] + i8[o + 17] * basis[7] + i8[o + 18] * basis[8] >= 0) continue;
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z1 = -Infinity;
        for (let c = 0; c < 4; c++) {
          const w = (o + c * VERTEX) >> 2, px = f32[w], py = f32[w + 1], pz = f32[w + 2];
          const lx = px * basis[0] + py * basis[1] + pz * basis[2], ly = px * basis[3] + py * basis[4] + pz * basis[5], lz = px * basis[6] + py * basis[7] + pz * basis[8];
          if (lx < x0) x0 = lx;
          if (lx > x1) x1 = lx;
          if (ly < y0) y0 = ly;
          if (ly > y1) y1 = ly;
          if (lz > z1) z1 = lz;
        }
        if (x1 < cx - half || x0 > cx + half || y1 < cy - half || y0 > cy + half || z1 <= zFar) continue;
        const i = q * 4;
        idx.push(i, i + 1, i + 2, i + 2, i + 1, i + 3);
        rects.push(x0, y0, x1, y1);
      }
      this.casters = idx.length / 6;
      this._castRects = new Float32Array(rects);
      st.vao(this.castVao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.castIbo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);
      this.casterLists++;
    }
    if (!this.casters) return 0;
    // (A quarter of a metre to spare: the list's corners are worked out
    // here and the picture's by the GPU, and one more draw is the safe side.)
    const r = this._castRects, pad = 0.25;
    let over = false;
    for (let i = 0; i < r.length && !over; i += 4) over = r[i] - pad < rx1 && r[i + 2] + pad > rx0 && r[i + 1] - pad < ry1 && r[i + 3] + pad > ry0;
    if (!over) return 0;
    // (The cascades' pass culls the faces that look away from the light:
    // these are the ones this list is of.)
    st.cull(CULL.OFF);
    st.vao(this.castVao);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    gl.uniformMatrix4fv(st.program(this.castProgram).uLightVP, false, mat);
    gl.drawElements(gl.TRIANGLES, this.casters * 6, gl.UNSIGNED_INT, 0);
    st.cull(CULL.BACK);
    return this.casters;
  }

  // One draw into the scene target, after the world's opaque quads (which
  // hide most of it from the street). Returns the draws issued.
  draw(tier) {
    const reach = (FAR_TIERS[tier] || FAR_TIERS.medium).reach;
    const n = this.program ? this.within(reach) : 0;
    this.drawn = n;
    if (!n) return 0;
    const gl = this.gl, st = this.state;
    st.depth(true, true, gl.LESS);
    st.blend(BLEND.OFF);
    st.cull(CULL.BACK);
    st.vao(this.vao);
    st.tex(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    if (this.shadow) st.tex(UNIT.uFarShadow, gl.TEXTURE_2D, this.shadow.tex);
    const u = st.program(this.program);
    if (u.uFarLight) gl.uniformMatrix4fv(u.uFarLight, false, this._light);
    if (u.uFarParams) gl.uniform4fv(u.uFarParams, this._params);
    gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_INT, 0);
    return 1;
  }
}

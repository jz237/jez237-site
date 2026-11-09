// Particle shaders: debris cubes, the soft sprites (dust, smoke, fire,
// sparks) and the upsample that brings a reduced-resolution gas layer back
// into the scene. All lighting is evaluated once per instance in the vertex
// stage; the fragment stage only shapes the puff.
import { VOXEL } from './engine.js';
import { FRAME, UTIL, ATMOSPHERE, LIGHTS, SHADOW, SOFT_SHADOW } from './shaders.js';
import { PATTERN, PAT } from './render_shaders_surface.js';

const COMMON = `
${FRAME}
${UTIL}
${ATMOSPHERE}
${LIGHTS}
${SHADOW}
layout(location = 0) in vec4 aPosSize;
layout(location = 1) in vec4 aQuat;
layout(location = 2) in vec4 aColor;
layout(location = 3) in vec3 aKind; // kind, emissive, opacity
uniform sampler3D uOcc;
uniform sampler3D uSkyVis;
uniform sampler2D uPalette;
float skyVisAt(vec3 p) { return texture(uSkyVis, (p + vec3(0.0, 0.2, 0.0)).xzy * uSkyVisInv.xyz).r; }
`;

// Debris. An instance is a cube to the simulation; drawn, it is a piece of
// what broke: the box is stretched by a shape of its own (a shard for glass,
// a plate for sheet metal, a splinter for timber), every corner is broken
// off it, some barely and some to the middle of its edges (DEBRIS_CHIPS: the
// fragment stage casts the view ray against the box and the eight breaks,
// so the silhouette is a lump's and each break shows as a face),
// and its faces carry the material's pattern, one of them as the weathered
// skin of the wall it came from and the others as broken stone. A piece of
// a tree's crown is not a block at all: its faces are sprays of leaf with
// the air between them (the cells of the stone texture, render_stone.js,
// each a leaf, the gaps cut out), lit softly and through. Everything
// that varies from piece to piece comes from one number, hashed from what
// a piece keeps for life: the instance's colour bytes and the byte the
// engine gives each piece as its own (its place in the buffer changes from
// frame to frame).
export const CUBE_VS = `
${Object.entries(PAT).map(([k, v]) => `#define PAT_${k} ${v}`).join('\n')}
${COMMON}
#ifdef SOFT_SHADOW
${SOFT_SHADOW}
#endif
out vec3 vCube;         // position on the piece's unit cube
out vec3 vWorld;
flat out vec4 vRq;
flat out vec4 vCamL;    // the camera in unit-cube space, w = the piece's seed
flat out vec4 vEdge;    // edge lengths in voxels, w = roughness
flat out vec4 vSun;     // direct light that reaches the piece, a = sky visibility
flat out vec4 vFace;    // point lights on this face, a = its occlusion
flat out vec4 vFog;     // in-scattered fog, a = how much of the piece is left
flat out vec4 vAlbedo;  // linear base colour, a = emissive strength
flat out ivec4 vInfo;   // material, pattern, flags (bit 8: too small on screen for detail, bit 9: foliage, bit 10: torn sheet), face (axis * 2 + positive)
flat out vec3 vNrm;     // the face's normal on the unit cube (not of unit length)
// A corner of the unit cube pulled in toward the piece's middle, each
// corner and each axis by its own amount (the seed's): a box becomes an
// irregular lump with no two edges parallel. For the pieces whose corners
// the fragment stage does not break off: the ones a few pixels across.
vec3 worn(vec3 u, float seed, vec3 most) {
  float k = (u.x > 0.0 ? 1.0 : 0.0) + (u.y > 0.0 ? 2.0 : 0.0) + (u.z > 0.0 ? 4.0 : 0.0);
  // (Grown by a sixth first: a corner comes in by a fifth on average, and
  // the lump should be as much stuff as the box was.)
  return u * 1.17 * (1.0 - most * fract(seed * vec3(7.13, 12.9, 18.7) + k * vec3(0.37, 0.71, 0.53)));
}
void main() {
  // Only the three faces turned toward the camera are drawn: 18 vertices
  // per cube, one face per axis, on whichever side can be seen.
  int d = gl_VertexID / 6;
  int ci = gl_VertexID - d * 6;
  vec2 c = vec2(float((0x16 >> ci) & 1), float((0x34 >> ci) & 1));
  vec3 dn, du, dv;
  if (d == 0) { dn = vec3(1, 0, 0); du = vec3(0, 1, 0); dv = vec3(0, 0, 1); }
  else if (d == 1) { dn = vec3(0, 1, 0); du = vec3(0, 0, 1); dv = vec3(1, 0, 0); }
  else { dn = vec3(0, 0, 1); du = vec3(1, 0, 0); dv = vec3(0, 1, 0); }
  // The colour's alpha byte is the piece's material (255: not known).
  int mat = int(aColor.a * 255.0 + 0.5);
  vec4 p1 = mat < 255 ? texelFetch(uPalette, ivec2(mat, 1), 0) : vec4(1.0, 0.0, 0.0, 0.0);
  int flags = int(p1.a * 255.0 + 0.5), pattern = int(p1.b * 255.0 + 0.5);
  bool glass = (flags & 2) != 0, metal = (flags & 128) != 0 && p1.r < 0.5;
  // Foliage, as the surface shader tells it: loose, mottled and matt.
  bool leaf = (flags & 32) != 0 && pattern == PAT_NOISE && p1.r > 0.8;
  // Metal of any finish tears: its pieces are sheet, whatever it was.
  bool sheet = (flags & 128) != 0;
  // The piece's own number (a byte the engine gives it for life, in the
  // float that is a sprite's opacity) and its colour.
  float own = floor(aKind.z * 255.0 + 0.5);
  float seed = hash13(aColor.rgb * 255.0 + vec3(0.5, 7.5, 3.5) + own * vec3(3.0, 7.0, 13.0));
  float r1 = fract(seed * 13.7), r2 = fract(seed * 29.3);
  vec3 shape;
  // (A pane is a centimetre thick, a coat of plaster or paint two: thin,
  // but never under a few pixels' worth of a 10 cm piece.)
  if (glass) shape = vec3(1.2 + 0.5 * r1, 0.85 + 0.5 * r2, 0.1);
  // (A spray of leaf: wider than the block it was, and flatter.)
  else if (leaf) shape = vec3(1.0 + 0.5 * r1, 1.0 + 0.5 * r2, 0.2 + 0.25 * r1);
  else if (pattern == PAT_FLAT && !metal) shape = vec3(1.1 + 0.4 * r1, 0.8 + 0.4 * r2, 0.3 + 0.15 * r1);
  else if (sheet) shape = vec3(1.15 + 0.5 * r1, 0.75 + 0.5 * r2, 0.07 + 0.06 * r1);
  else if (pattern == PAT_PLANKS) shape = vec3(1.4 + 0.5 * r1, 0.6 + 0.2 * r2, 0.55 + 0.25 * r2);
  else if (pattern == PAT_GRAIN) shape = vec3(0.6 + 0.2 * r2, 1.4 + 0.5 * r1, 0.55 + 0.25 * r2);
  // (A lump of masonry: no two the same, a slab here and a stub there; the
  // same stuff in each, as near as the limits let it. They were all within
  // a quarter of a cube, and a field of them was a spill of dice.)
  else { shape = vec3(0.6 + 0.85 * r1, 0.6 + 0.85 * r2, 0.0); shape.z = clamp(1.0 / (shape.x * shape.y), 0.5, 1.45); }
  float size = aPosSize.w;
  vec4 qc = vec4(-aQuat.xyz, aQuat.w);
  // The simulation rests the cube on the ground: keep the piece's lowest
  // point where the cube's is, whichever way up it lies.
  vec3 ay = abs(qrot(qc, vec3(0.0, 1.0, 0.0)));
  vec3 p = aPosSize.xyz - vec3(0.0, dot(ay, 1.0 - shape) * 0.5 * size, 0.0);
  vec3 camL = qrot(qc, uCamPos.xyz - p) / (shape * max(size, 1e-4));
  bool pos = dot(camL, dn) > 0.0;
  if (!pos) c = c.yx;
  vec3 base = (pos ? dn : vec3(0.0)) - 0.5;
  vec3 unit = du * c.x + dv * c.y + base;
  vec3 nrm = pos ? dn : -dn;
  float pixels = size / max(length(uCamPos.xyz - p) * uProj.w * uScreen.y * 2.0, 1e-6);
  bool tiny = pixels < (leaf ? 2.5 : DEBRIS_DETAIL_PX);
  bool wear = tiny;
  if (wear) {
    // A pane, a sheet and a leaf are worn round their rim, not through.
    vec3 most = glass || sheet || leaf ? vec3(0.42, 0.42, 0.0) : vec3(0.42);
    vec3 a = worn(base, seed, most), b = worn(base + du, seed, most), e = worn(base + du + dv, seed, most), f = worn(base + dv, seed, most);
    unit = c.x < 0.5 ? (c.y < 0.5 ? a : f) : (c.y < 0.5 ? b : e);
    vec3 g = cross(e - a, f - b);
    nrm = dot(g, nrm) < 0.0 ? -g : g;
  }
  vec3 n = normalize(qrot(aQuat, nrm / shape));
  vec3 wp = p + qrot(aQuat, unit * shape * size);
  float sh = uSunDir.w > 0.0 ? sunShadow(p, uSunDir.xyz, 1.0, 0.5, 0.0) : 0.0;
#ifdef SOFT_SHADOW
  // Other pieces between this one and the sun, and the dust it flies in.
  if (sh > 0.0) sh *= softShadow(p, 1.0);
#endif
  float sv = skyVisAt(p);
  // Occlusion from the world around the piece, and from whatever it lies
  // on: the lower a face looks, the more of the ground it sees.
  float ao = 1.0 - 0.6 * texture(uOcc, (p + n * 0.25).xzy * uOccInv.xyz).r;
  float under = texture(uOcc, (p - vec3(0.0, size * 0.5 + 0.1, 0.0)).xzy * uOccInv.xyz).r;
  ao *= 1.0 - 0.45 * under * clamp(0.6 - n.y, 0.0, 1.0);
  vec3 toP = p - uCamPos.xyz;
  float dist = length(toP);
  float fog = fogAmount(toP, dist);
  vCube = unit;
  vWorld = wp;
  vRq = aQuat;
  vCamL = vec4(camL, seed);
  vEdge = vec4(shape * (size / ${VOXEL.toFixed(4)}), max(p1.r, 0.05));
  vSun = vec4(uSunCol.rgb * sh, sv);
  vFace = vec4(uCamFwd.w > 0.0 ? pointLights(p, n, 0.2, p) : vec3(0.0), ao);
  vFog = vec4(fogColor(toP / max(dist, 1e-4)) * fog, 1.0 - fog);
  vAlbedo = vec4(pow(aColor.rgb, vec3(2.2)), aKind.y);
  // A piece a few pixels across is its colour and its light: no pattern,
  // no cut corners (neither would resolve, and both would cost). A spray
  // of leaf stays one down to two and a half pixels on every tier: its one
  // lookup is all it costs, and a green die among leaves is seen at any
  // size. (It was five, and from across a road a hedge went up as green
  // tiles: most of its pieces are three to five pixels there.)
  vInfo = ivec4(mat, pattern, flags | (tiny ? 256 : 0) | (leaf ? 512 : 0) | (sheet && !glass ? 1024 : 0), d * 2 + (pos ? 1 : 0));
  vNrm = nrm;
  gl_Position = uViewProj * vec4(wp, 1.0);
}
`;

export const CUBE_FS = `
${FRAME}
${UTIL}
${ATMOSPHERE}
${PATTERN}
in vec3 vCube;
in vec3 vWorld;
flat in vec4 vRq;
flat in vec4 vCamL;
flat in vec4 vEdge;
flat in vec4 vSun;
flat in vec4 vFace;
flat in vec4 vFog;
flat in vec4 vAlbedo;
flat in ivec4 vInfo;
flat in vec3 vNrm;
uniform sampler2D uStone;  // cells with a tone (r), a lean (gb) and how far inside the cell (a): leaves, here
out vec4 oColor;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
void main() {
  int pattern = vInfo.y, flags = vInfo.z, face = vInfo.w;
  bool small = (flags & 256) != 0;
  float seed = vCamL.w;
  bool glass = (flags & 2) != 0, metal = (flags & 128) != 0 && vEdge.w < 0.5, leaf = (flags & 512) != 0, sheet = (flags & 1024) != 0;
  vec3 x = vCube;
  vec3 nU = normalize(vNrm);
  bool cut = false, gone = false;
  float facet = 1.0;
#ifdef DEBRIS_CHIPS
  if (!small && !leaf) {
    // The view ray against what is left of the box once its corners are
    // off: it goes in through the drawn face (t = 1) or, later, through a
    // break, and has to do so before it leaves. Every corner is broken off
    // by a plane of its own (a piece keeps what is below it): which way the
    // break leans is the seed's, and how deep it goes is spread over the
    // eight, so that a piece always has corners barely touched beside
    // corners gone to the middle of its edges. What is left is a lump with
    // more broken faces than square ones.
    vec3 ro = vCamL.xyz, rd = vCube - ro;
    vec3 sg = vec3(rd.x < 0.0 ? -1.0 : 1.0, rd.y < 0.0 ? -1.0 : 1.0, rd.z < 0.0 ? -1.0 : 1.0);
    vec3 tb = (0.5 * sg - ro) / (sg * max(abs(rd), 1e-6));
    float t0 = 1.0, t1 = min(tb.x, min(tb.y, tb.z));
    // A shard or a plate breaks across its sheet, not through it.
    float across = glass || sheet ? 0.12 : 1.0;
    for (int i = 0; i < DEBRIS_PLANES; i++) {
#if DEBRIS_PLANES == 8
      int k = i;
#else
      // (The cheapest tier breaks four corners, no two on one edge, and
      // deeper: half the work, and still no box.)
      int k = i == 0 ? 0 : (i == 1 ? 3 : (i == 2 ? 5 : 6));
#endif
      vec3 corner = vec3(float(k & 1), float((k >> 1) & 1), float(k >> 2)) * 2.0 - 1.0;
      float fk = float(k);
      vec3 lean = corner * (0.35 + fract(seed * vec3(7.13, 12.9, 18.7) + fk * vec3(0.37, 0.71, 0.53)));
      lean.z *= across;
      vec3 pn = normalize(lean);
      float deep = fract(seed * 43.7 + fk * 0.618);
      float off = dot(pn, corner * 0.5) - (DEBRIS_CUT + 0.37 * deep);
      float dn = dot(pn, rd), t = (off - dot(pn, ro)) / (abs(dn) > 1e-6 ? dn : 1e-6);
      if (dn < 0.0) { if (t > t0) { t0 = t; nU = pn; cut = true; facet = 0.84 + 0.3 * fract(deep * 7.3); } }
      else t1 = min(t1, t);
    }
    // (Discarded at the end: what follows takes screen-space derivatives,
    // and those are not defined once a pixel of the 2 x 2 block has gone.)
    gone = t0 > t1;
    if (cut) x = ro + rd * t0;
  }
#endif
  // Pattern space: the piece's own voxels, set down somewhere of its own in
  // the lattice the patterns are drawn on.
  vec3 pc = x * vEdge.xyz + floor(vec3(fract(seed * 5.3), fract(seed * 11.9), fract(seed * 23.1)) * 61.0);
  vec3 an = abs(nU);
  int axis = an.x > an.y && an.x > an.z ? 0 : (an.y > an.z ? 1 : 2);
  vec2 uv = axis == 0 ? pc.zy : (axis == 1 ? pc.xz : pc.xy);
  float layer = floor(axis == 0 ? pc.x : (axis == 1 ? pc.y : pc.z));
  vec2 gx = dFdx(uv), gy = dFdy(uv);
  vec2 fw = abs(gx) + abs(gy);
  // One face in four pieces out of five is the wall's own surface; a torn
  // sheet keeps its coat on both sides.
  bool skin = !cut && (sheet ? (face >> 1) == 2 : face == int(fract(seed * 3.77) * 7.5));
  // How far from the face's rim, as a share of the piece (cut faces have none).
  int fa0 = face >> 1;
  vec2 fuv0 = fa0 == 0 ? vCube.yz : (fa0 == 1 ? vCube.zx : vCube.xy);
  float rim0 = cut ? 0.5 : 0.5 - max(abs(fuv0.x), abs(fuv0.y));
  Surf s;
  s.albedo = vAlbedo.rgb;
  s.rough = vEdge.w;
  s.cavity = 1.0;
  s.bevel = 1.0;
  s.var = 0.0;
  // (The pattern's taps carry their own gradients, so they may sit in a
  // branch; small is the same for the whole piece.)
  // The wall's pattern on the wall's own face, and wherever the material
  // is the same all through (timber's grain, a sheet's coat, glass). A
  // break through brickwork or tiles shows the inside of the stone, not
  // courses and joints: a small piece with a joint round every face is a
  // die with a white band.
  bool through = skin || glass || sheet || pattern == ${PAT.PLANKS} || pattern == ${PAT.GRAIN};
#ifdef DEBRIS_INSIDE
  // And a break through brick, concrete or plaster shows the inside of
  // the material: the surfaces' pattern lays that on a face that is not
  // weathered, and says so (patInner): the body of the brick with its
  // beds, cement and stones, the coat under the plaster's skin; timber's
  // raw wood comes the same way. What the pattern cannot tell, told as
  // the world's shader tells it: boards are timber and not sheet, and a
  // pale matt wall with no pattern is plaster on a coarse coat. (A
  // broken face was one flat tone to each cell a third of a voxel
  // across: on a lump large on the screen, a chequer of two greys. The
  // tiers with the patterns' detail only: on the lowest, where the
  // inside is a tint and a patch, a piece in flight shows no gain for
  // the words it costs.)
  patWood = (flags & (8 | 128)) == 8;
  patPlaster = pattern == ${PAT.FLAT} && vEdge.w > 0.9 && (flags & (8 | 32 | 128)) == 0 && luma(vAlbedo.rgb) > 0.3;
  through = through || (!metal && (pattern == ${PAT.BRICK} || pattern == ${PAT.CONCRETE} || patPlaster));
#endif
  if (!small && !leaf && through) surfacePattern(pattern, uv, gx, gy, layer, axis != 1, (flags & 32) != 0, skin ? 1.0 : 0.0, 0.0, vec2(0.0), s);
  else s.tilt = vec2(0.0);
  vec4 spray = vec4(0.5, 0.5, 0.5, 1.0);
  if (leaf && !small) {
    // The face as leaves: one cell of the texture is one leaf, some five
    // across the piece; the gaps between them are air, more of it toward
    // the face's rim, and one leaf in five is missing. What is left is a
    // ragged spray whose outline is leaves, not a square.
    int fa = face >> 1;
    vec2 fuv = fa == 0 ? vCube.yz : (fa == 1 ? vCube.zx : vCube.xy);
    vec2 luv = fuv * 0.2 + vec2(fract(seed * 7.1), fract(seed * 3.3)) + float(fa) * 0.37;
    spray = textureGrad(uStone, luv, dFdx(luv), dFdy(luv));
    // (The rim is not the face's square: a round one with three lobes,
    // turned by the piece's seed, so that from across a street a spray is
    // a tuft and no two are the same card.)
    float lobe = 0.5 + 0.5 * sin(atan(fuv.y, fuv.x) * 3.0 + seed * 40.0);
    float rim = min(0.5 - max(abs(fuv.x), abs(fuv.y)), 0.5 - length(fuv) * mix(0.86, 1.3, lobe));
    if (spray.a < mix(0.7, 0.27, smoothstep(0.0, 0.28, rim)) || fract(spray.r * 5.3) < 0.2) gone = true;
    // Young leaves yellow, old ones blue-green, darker toward a leaf's edge.
    s.albedo *= mix(vec3(0.74, 0.9, 0.88), vec3(1.22, 1.08, 0.7), fract(spray.r * 3.7)) * (0.7 + 0.3 * spray.a);
  }
  if (sheet && !small) {
    float fleck = hash13(floor(pc * 2.0) + 5.0);
    if (skin) {
      // The coat: scorched and scuffed toward where the sheet tore.
      float burnt = 1.0 - smoothstep(0.0, 0.16, rim0 + (fleck - 0.5) * 0.1);
      s.albedo *= mix(1.0, 0.25, burnt * 0.8) * (0.86 + 0.28 * fleck);
      s.rough = mix(s.rough, 0.95, burnt);
    } else {
      // The torn edge: bare metal.
      s.albedo = vec3(0.5, 0.51, 0.54) * (0.6 + 0.4 * fleck);
      s.rough = 0.4;
    }
  } else if (!glass && !leaf && !small) {
    // Every piece is dirtier and darker toward its edges than in the
    // middle of a face: no face of it is one flat colour.
    s.albedo *= mix(0.6, 1.0, smoothstep(0.0, 0.16, rim0 + (hash13(floor(pc * 4.0) + 3.0) - 0.5) * 0.08));
  }
  if (!skin && !glass && !metal && !leaf && !sheet && !patInner) {
    // Broken material whose inside the pattern has not laid: the colour
    // of the inside of the stone, deeper and darker than a face that has
    // weathered, grainy at a few centimetres.
    float near = 1.0 - smoothstep(0.12, 0.45, max(fw.x, fw.y));
    float grain = mix(0.5, hash13(floor(pc * 3.0) + 17.0), near);
    s.albedo = max(mix(vec3(luma(s.albedo)), s.albedo, 1.12), 0.0) * (0.6 + 0.28 * grain);
    s.rough = 1.0;
  }
  // (Each break a tone of its own: the lump reads as one in flat light too.)
  s.albedo *= facet;
  // A piece too small for any of that is the mean of it, not the clean
  // colour of the wall's face: broken, dirty, each a tone of its own (the
  // smallest pieces were the brightest things in the air).
  if (small && !glass && !leaf) s.albedo = mix(vec3(luma(s.albedo)), s.albedo, 0.85) * (0.5 + 0.34 * fract(seed * 9.1));
  // The scale turns a normal the other way round from a position.
  // (A torn sheet is bent: its face does not catch the light all at once.)
  if (sheet && skin) nU.xy += vec2(sin(vCube.x * 8.0 + seed * 40.0), sin(vCube.y * 6.0 + seed * 23.0)) * 0.3;
  vec3 n = normalize(qrot(vRq, nU / vEdge.xyz));
  float ndl = max(dot(n, uSunDir.xyz), 0.0);
  if (leaf) {
    // Each leaf turned its own way, and thin: the sun wraps round a spray
    // and comes through it from behind, so no face of it is a dark slab.
    vec3 lean = (face >> 1) == 0 ? vec3(0.0, spray.gb - 0.5) : ((face >> 1) == 1 ? vec3(spray.b - 0.5, 0.0, spray.g - 0.5) : vec3(spray.gb - 0.5, 0.0));
    float sunward = dot(normalize(n + qrot(vRq, lean) * 1.4), uSunDir.xyz);
    ndl = clamp(sunward * 0.55 + 0.45, 0.0, 1.0) * 0.8 + max(-sunward, 0.0) * 0.25;
  }
  float sv = vSun.a, ao = vFace.a * s.cavity;
  vec3 hemi = mix(uAmbGround.rgb, uAmbSky.rgb, n.y * 0.5 + 0.5);
  vec3 ambient = s.albedo * (hemi * sv + uAmbGround.rgb * (0.22 * (1.0 - sv))) * ao;
  vec3 col = s.albedo * (vSun.rgb * ndl + vFace.rgb) + ambient;
  if (glass || metal) {
    // A glass or metal fragment is mostly what it mirrors: a pastel block
    // with a matte face reads as chalk, never as a shard. Each face is one
    // flat mirror, so a tumbling piece flashes as it turns through the
    // sun's reflection: a wide lobe says the flash is coming, a narrow one
    // is the flash.
    vec3 toCam = uCamPos.xyz - vWorld;
    vec3 v = toCam * inversesqrt(max(dot(toCam, toCam), 1e-8));
    float fr = 1.0 - abs(dot(n, v));
    float fr2 = fr * fr;
    vec3 f0 = glass ? vec3(0.08) : s.albedo;
    vec3 env = mirrorEnv(reflect(-v, n)) * (sv * ao);
    float ndh = max(dot(n, normalize(uSunDir.xyz + v)), 0.0);
    float g2 = ndh * ndh, g8 = g2 * g2 * g2 * g2, g32 = g8 * g8 * g8 * g8;
    float glint = glass ? g32 * 0.5 + pow(g32, 12.0) * 14.0 : g32 * 1.2 + pow(g32, 4.0) * 3.0;
    float fres = fr2 * fr2 * fr;
    if (glass) {
      // This pass is opaque, so a shard cannot show what is behind it. It
      // shows what would be: the ground when looked down on, the sky when
      // seen against it, through the glass's own tint. That is enough for
      // a shard to read as clear and not as a slab of teal plastic.
      vec3 through = mirrorEnv(-v) * mix(vec3(1.0), s.albedo * 1.6, 0.45) * (0.35 + 0.65 * sv);
      col = mix(through, env, 0.08 + 0.92 * fres) + col * 0.06 + vSun.rgb * glint;
    } else {
      col = col * 0.2 + env * (f0 + (1.0 - f0) * fres) + vSun.rgb * glint * s.albedo;
    }
  }
  col = (col + s.albedo * vAlbedo.a) * vFog.a + vFog.rgb;
  if (gone) discard;
  // Alpha: the ambient share of the pixel, for screen-space AO.
  float share = clamp(luma(ambient) * vFog.a / max(luma(col), 1e-4), 0.0, 1.0);
#ifdef HDR_ENCODE
  oColor = vec4(sqrt(min(col, 16.0) * 0.0625), share);
#else
  oColor = vec4(min(col, 64.0), share);
#endif
}
`;

// Defines: ONLY_SPARKS / NO_SPARKS select which sprites this program draws
// (with FLAME_FULL, small flames are left out by NO_SPARKS and drawn alone
// by ONLY_FLAMES, at the scene's own size and with a body by day)
// (the rest are collapsed). uStep is the size of a target pixel in scene
// pixels (1 when drawing straight into the scene). A sprite's row is not a
// cube's (engine/src/particles.rs): its kind is the fourth byte of its
// colour, aKind is (unused, opacity, glow), and for a spark aQuat is its
// streak vector over SPARK_REACH metres and its opacity.
// The veil's reach from the eye (metres): all of it nearer than the first,
// none beyond the second. A house across a street is inside it, a tower
// across a plot is not.
const VEIL_REACH = '#define VEIL_NEAR 20.0\n#define VEIL_FAR 38.0';

// A flame's body by day: the least of its shape that burns when it is
// new (an old one keeps only its heart), the width of its edge, the
// least it covers where it burns (thinner, it was salmon on the sky
// again), the opacity at which nothing of it is left but what the
// finer noise tears off, and how far that noise tears it. (Both stages:
// the vertex stage cuts a flame's quad to what the fragment stage can
// draw of it, and ParticlePass counts the quads as they are cut.)
const FLAME_SMALL = 0.5, FLAME_TALL = 1.6;
const FLAME_BODY_YOUNG = 0.1, FLAME_BODY_OLD = 1.7, FLAME_BODY_GONE = 0.1;
const FLAME_BODY = `#define FLAME_BODY_YOUNG ${FLAME_BODY_YOUNG.toFixed(2)}
#define FLAME_BODY_EDGE 0.3
#define FLAME_BODY_OLD ${FLAME_BODY_OLD.toFixed(2)}
#define FLAME_BODY_LEAST 0.9
#define FLAME_BODY_GONE ${FLAME_BODY_GONE.toFixed(2)}
#define FLAME_TORN 0.5`;
// What is left of a flame's quad by day, by the threshold `thr` its body
// is cut at (the fragment stage's, from its opacity): [half-width at its
// foot, half-width at its top, height], each as a share of the quad's,
// or null where nothing of it is drawn. Up to 0.33 the finer noise alone
// can make a body anywhere in the quad, and all of it is kept; from 1.5
// no flame of 12,000 drew a pixel. Between, the trapezoid holds every
// pixel that 12,000 flames drew with the page's own noise, with four
// hundredths to spare each way (a flame worn to its heart is a third of
// its quad, and the rest was depth and noise fetched for nothing).
// The same figures in SOFT_VS; thr as there.
const smooth = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const FLAME_CUT_FROM = 0.33, FLAME_CUT_GONE = 1.5;
// The sky's brightness from which a tier that draws its flames' pass by
// day only draws it (half way to the day's full body).
export const FLAME_BY_DAY_FROM = 0.25;
// Screens' worth of a flame's quad, as a share of the uncut quad's area
// times how many times taller than wide it stands: size (m), opacity,
// day (0..1, the sky's brightness doubled, as the vertex stage has it).
export function flameQuad(size, opacity, day) {
  if (size >= FLAME_SMALL * 1.8) return 0;
  const tongue = (1 - smooth(FLAME_SMALL, FLAME_SMALL * 1.8, size)) * (smooth(0.15, 0.4, opacity) * (1 - day) + day);
  const tall = 1 + (FLAME_TALL - 1) * tongue;
  if (day * tongue <= 0.999) return tall;
  const thr = FLAME_BODY_OLD + (FLAME_BODY_YOUNG - FLAME_BODY_OLD) * smooth(FLAME_BODY_GONE, 0.7, opacity);
  if (thr >= FLAME_CUT_GONE) return 0;
  if (thr <= FLAME_CUT_FROM) return tall;
  return tall * 0.5 * (clamp01(1.4 - 0.62 * thr) + Math.min(Math.max(0.94 - 0.4 * thr, 0.44), 1)) * clamp01(2.0 - 1.1 * thr);
}

export const SOFT_VS = `
${COMMON}
#ifdef SOFT_SHADOW
${SOFT_SHADOW}
#endif
uniform sampler2D uNoise;
// Dust and smoke nearer the eye than this are left out (metres; the same
// figure in ParticlePass._fill).
#define DUST_CLEAR 1.4
${VEIL_REACH}
// One over the share of its opacity the veil holds back at its fullest.
#define DUST_SHOW_VEIL 1.6667
#define SPARK_REACH 8.0
// What dust is paled toward and by how much; and how much of the sky's own
// colour its shaded side takes (the rest is the sky's brightness, grey).
#define DUST_PALE vec3(0.5, 0.47, 0.42)
#define DUST_PALED 0.2
#define DUST_SKY 0.12
// How far from grey a dust's colour is before it counts as its own: the
// span of its channels over the largest, none of the warming beyond the
// second figure.
#define DUST_GREY_LO 0.1
#define DUST_GREY_HI 0.32
// Dust is warm: what a heap of the same stuff shows in the same light (a
// concrete heap is red over blue by a tenth; its cloud was a neutral grey).
#define DUST_WARM vec3(1.08, 1.0, 0.88)
// How far the gaps open dust (smoke's are whole): since the layer itself
// lets what is near be seen (GAS_TAKES_NEAR) they are for the cloud's
// raggedness only, and at full strength they read as windows cut in it.
#define DUST_GAPS 0.5
// What the dust of foliage is turned toward (times its own brightness), and
// how fast with the green in its colour.
#define DUST_BARK vec3(0.46, 0.42, 0.33)
#define DUST_LEAFY 6.0
// Nor does brick go up in red, or timber in orange: ground fine, a thing is
// a powder far paler than itself, and the stronger its colour the more of
// it is lost. Past DUST_OWN_LO of its channels' span over the largest a
// dust turns toward a pale tan powder (as bright as it was if it was dark),
// DUST_POWDERED of the way at DUST_OWN_HI.
#define DUST_POWDER vec3(0.50, 0.41, 0.30)
#define DUST_OWN_LO 0.35
#define DUST_OWN_HI 0.9
#define DUST_POWDERED 0.85
out vec2 vAir;         // the billow noise of the air at this corner (a fixed oblique projection of the world)
flat out vec3 vLit;    // sun-lit colour (or the emissive colour), fog applied
flat out vec3 vAmbUp;  // ambient colour of an upward and a downward facing part
flat out vec3 vAmbDn;
flat out vec3 vFog;    // in-scattered fog
out vec2 vUv;
flat out vec4 vMisc;   // opacity, additive flag, view depth, softness distance
flat out float vTongue; // how far a fire puff is a flame, 0..1
#ifdef FLAME_FULL
flat out vec2 vFlame;  // how far a flame is drawn as the day's body, and its own opacity
#endif
flat out vec2 vSeed;   // kind, per-particle random
flat out float vMark;  // 1 for smoke the engine marks as rising from a seat of fire
flat out vec2 vVeil;   // how far this sprite is veiled (thinned, giving way to what is close behind), and how far it is opened by the veil's gaps, 0..1
// The point lights on a puff of dust or smoke (pointLights is for
// surfaces). A puff has no surface to turn toward a light, and what it
// shows of one is what the dust within a metre or two of the source
// scatters: it falls off much faster than on a wall, where the window is
// kept flat so that bricks beside a lamp do not burn out. With the
// surfaces' falloff the four glows of a burning hedge lit the whole cloud
// of a house's fall one flat cream, by night the brightest thing in the
// picture, and the flames were lost against it; with this one the cloud
// has a lit heart where the fire is and is the colour of its own dust
// elsewhere. PUFF_LIGHT_NEAR: at a radius over its square root (a quarter
// of the light's reach) a puff has half the light a wall there would. At
// 50 the heart is tighter still and the cloud grey by day, but the dust
// of the office's fall, which little burns in, is all but dark at night.
// Per corner: the same loop over the frame's lights as pointLights, one
// division more and one normalisation less for each light in reach.
#define PUFF_LIGHT_NEAR 15.0
// How many times taller than wide a flame's sprite is, and the size (m)
// up to which a fire puff is a flame; at 1.8 times that it is a ball.
#define FLAME_TALL ${FLAME_TALL.toFixed(2)}
#define FLAME_SMALL ${FLAME_SMALL.toFixed(2)}
${FLAME_BODY}
#define FLAME_CUT_FROM ${FLAME_CUT_FROM.toFixed(2)}
#define FLAME_CUT_GONE ${FLAME_CUT_GONE.toFixed(2)}
// By day a flame's body is at least this many times the sky's brightness,
// made up in the orange of a flame, and hides this share of what is
// behind it.
#define FLAME_DAY_LEAST 0.8
#define FLAME_DAY_ORANGE vec3(1.0, 0.35, 0.05)
#define FLAME_COVERS 0.9
// How much the day takes from a fire's light on puffs: divided by one plus
// this times the sky's brightness (0.86 at noon, 0.03 at night).
#define PUFF_LIGHT_DAY 4.5
vec3 puffLights(vec3 wp) {
  vec3 sum = vec3(0.0);
  int cnt = int(uCamFwd.w);
  for (int i = 0; i < cnt; i++) {
    vec4 lp = uLights[2 * i];
    vec3 d = lp.xyz - wp;
    float x = dot(d, d) * lp.w;
    if (x < 1.0) {
      float win = 1.0 - x;
      float w = win * win / ((1.0 + 10.0 * x) * (1.0 + PUFF_LIGHT_NEAR * x));
      vec4 lc = uLights[2 * i + 1];
#ifdef LIGHT_OCC
      if (lc.w > 0.5) w *= lightVisibility(i, lp.xyz, inversesqrt(lp.w) * lc.w, wp);
#endif
      sum += lc.rgb * w;
    }
  }
  return sum / (1.0 + dot(sum, vec3(0.2126, 0.7152, 0.0722)) * 0.2);
}
void main() {
  int kind = int(aColor.a * 255.0 + 0.5);
  float glow = aKind.z, opacity = kind == 3 ? aQuat.w : aKind.y;
#ifdef ONLY_SPARKS
  if (kind != 3) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
#endif
#ifdef FLAME_FULL
  // A small fire puff the engine has not marked is a flame: drawn at the
  // scene's own size, over the gas, not in the layer. (A flame is a body
  // with an edge, and a layer a quarter of the scene's size has no edges:
  // drawn there as a body it was salmon with steps along its rim, and as
  // a glow it was a pale pink ghost on a noon sky.)
  bool flame = kind == 4 && aKind.x < 0.5 && aPosSize.w < FLAME_SMALL * 1.8;
#ifdef FLAME_BY_DAY
  // (A tier that can afford the flames' pass only where it is needed: by
  // day, when the layer's flames cannot be seen. By night they stay in
  // the layer, the glows they were. ParticlePass makes the same test.)
  flame = flame && dot(uAmbSky.rgb, vec3(0.2126, 0.7152, 0.0722)) > ${FLAME_BY_DAY_FROM.toFixed(2)};
#endif
#else
  const bool flame = false;
#endif
#ifdef NO_SPARKS
  if (kind == 3 || flame) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
#endif
#ifdef ONLY_FLAMES
  if (!flame) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
#endif
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vec3 p = aPosSize.xyz;
  float size = aPosSize.w;
  vec3 toCam = uCamPos.xyz - p;
  float dist = length(toCam);
  toCam /= max(dist, 1e-4);
  vec3 wp;
  // A spark carries its streak (tail to head).
  vec3 streak = kind == 3 ? aQuat.xyz * SPARK_REACH : vec3(0.0);
  float tongue = 0.0, day = 0.0;
  float sl = length(streak);
  float px = dist * uProj.w * uScreen.y;
  if (kind == 3 && sl > 0.004) {
    // Never thinner than a pixel and a half: sub-pixel sparks would flicker.
    float w = max(size, px * 3.0);
    vec3 side = normalize(cross(streak, toCam)) * w;
    // From half a width ahead of the head to half a width behind the tail.
    float cap = 0.5 * w / sl;
    wp = p + streak * mix(cap, -1.0 - cap, c.y) + side * (c.x - 0.5);
  } else {
    if (kind == 3) size = max(size, px * 3.0);
    // A flame stands taller than it is wide, on the place it burns at.
    // (A small one: what burns. The great puffs of a blast's ball are balls.)
    // And a bright one: a flame that has risen and thinned is a glow again.
    // (And one that burns: a flash, marked in its row as dust that stands
    // is, is the ball of light it was: a muzzle's is no candle.)
#ifdef FLAME_FULL
    // By day a flame keeps its shape as it thins: it wears away (the
    // fragment stage) instead of going back to a glow.
    day = flame ? min(dot(uAmbSky.rgb, vec3(0.2126, 0.7152, 0.0722)) * 2.0, 1.0) : 0.0;
    tongue = kind == 4 && aKind.x < 0.5 ? (1.0 - smoothstep(FLAME_SMALL, FLAME_SMALL * 1.8, size)) * mix(smoothstep(0.15, 0.4, opacity), 1.0, day) : 0.0;
    day *= tongue;
    // A flame's quad is cut to what is drawn of it by day: its body wears
    // away from the edge as it thins, and an old flame's quad was depth
    // and noise fetched for nothing over all but its heart. (The figures:
    // flameQuad, beside this source. The corner keeps its place in the
    // whole quad, so the picture is the one it was.)
    if (day > 0.999) {
      float thr = mix(FLAME_BODY_OLD, FLAME_BODY_YOUNG, smoothstep(FLAME_BODY_GONE, 0.7, opacity));
      if (thr >= FLAME_CUT_GONE) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
      if (thr > FLAME_CUT_FROM) {
        float across = c.y < 0.5 ? clamp(1.4 - 0.62 * thr, 0.0, 1.0) : clamp(0.94 - 0.4 * thr, 0.44, 1.0);
        c = vec2(0.5 + (c.x - 0.5) * across, c.y * clamp(2.0 - 1.1 * thr, 0.0, 1.0));
      }
    }
#else
    tongue = kind == 4 && aKind.x < 0.5 ? (1.0 - smoothstep(FLAME_SMALL, FLAME_SMALL * 1.8, size)) * smoothstep(0.15, 0.4, opacity) : 0.0;
#endif
    float tall = mix(1.0, FLAME_TALL, tongue);
    vec3 upward = mix(uCamUp.xyz, vec3(0.0, 1.0, 0.0), tongue);
    wp = p + (uCamRight.xyz * (c.x - 0.5) + upward * ((c.y - 0.5) * tall + (tall - 1.0) * 0.3)) * size;
  }
  vec3 albedo = pow(aColor.rgb, vec3(2.2));
  // Dust is handed over as its material's colour mixed two to one with
  // near-white (particles/spawn.rs: (2 c + 200) / 3 in bytes), which makes
  // every cloud the same cream. Take that back out and pale the material
  // a little instead: a brick wall goes up in red-brown dust, concrete in
  // its heap's warm grey, plaster in white, timber in tan. (It was paled two
  // fifths toward a neutral grey, and with the sky's light on it a tower's
  // dust was the white of the clouds behind it.)
  float grey = 0.0;
  if (kind == 1) {
    albedo = pow(clamp(aColor.rgb * 1.5 - 0.392, 0.0, 1.0), vec3(2.2));
    // Leaves do not go up in green dust: what a blast raises from a crown
    // or a hedge is the dust of bark and earth with a little green in it.
    // (A tree blown apart stood in a green fog.)
    float leafy = clamp((albedo.g - max(albedo.r, albedo.b)) * DUST_LEAFY, 0.0, 1.0);
    albedo = mix(albedo, DUST_BARK * (0.6 + dot(albedo, vec3(0.2126, 0.7152, 0.0722))), leafy * 0.85);
    // (One rocket into a brick house raised a pink cloud over it: four in
    // ten of its dust came up in the wall's own red and one in seven in
    // the boards' orange beside the plaster's white, and with the sky
    // behind them that is pink.)
    float most = max(albedo.r, max(albedo.g, albedo.b));
    float own = smoothstep(DUST_OWN_LO, DUST_OWN_HI, (most - min(albedo.r, min(albedo.g, albedo.b))) / max(most, 1e-3));
    albedo = mix(albedo, DUST_POWDER * min(0.35 + 2.0 * most, 1.0), own * DUST_POWDERED);
    albedo = mix(albedo, DUST_PALE, DUST_PALED);
    // Warm what is grey and leave what has a colour of its own: concrete's
    // dust was a neutral grey beside its warm heap, but brick's is red
    // already, and warmed it went up in a pink cloud.
    float top = max(albedo.r, max(albedo.g, albedo.b));
    grey = 1.0 - smoothstep(DUST_GREY_LO, DUST_GREY_HI, (top - min(albedo.r, min(albedo.g, albedo.b))) / max(top, 1e-3));
    albedo *= mix(vec3(1.0), DUST_WARM, grey);
  }
  // Dust and fire thin out toward the eye: what a player stands in is a
  // haze they can see their demolition through, not a wall of one colour
  // (a puff's opacity stands for a cloud seen from outside it).
  float thin = kind == 3 ? 1.0 : mix(0.28, 1.0, smoothstep(1.0, 10.0, dist));
#ifdef FLAME_FULL
  // (A flame's body by day is whole until it is at arm's length: it is
  // small, and thinned it is the pale column it was.)
  thin = mix(thin, max(thin, smoothstep(0.3, 1.5, dist)), day);
#endif
  float veiled = 0.0;
  bool marked = kind == 2 && aKind.x > 0.5;
  // And the dust and smoke right around the eye are not drawn at all: a
  // sprite that close covers the whole screen with a smear that has no
  // shape, and it is the one that hides what the player came to see. The
  // cloud begins a few steps away, where it has billows and an edge.
  if (kind <= 2) {
    // While things fall, the smoke near the eye is a veil
    // (ParticlePass.veil): what blasts and fires raise, the ball a house
    // stood in from the second rocket on. Not the dust of the breaks and
    // the landings (a tower came down in clear air with that veiled too).
    // Nor the smoke the engine marks (a one in the row's unused word, as
    // on the dust that stands): the column over a thing that burns is
    // what the player looks at, and says where the fire is.
    if (kind == 2 && !marked) {
      veiled = (1.0 - uSkyVisInv.w) * (1.0 - smoothstep(VEIL_NEAR, VEIL_FAR, dist));
      thin *= 1.0 - veiled;
    }
    thin *= smoothstep(DUST_CLEAR, DUST_CLEAR * 4.0, dist);
    if (thin <= 0.0) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
  }
  float fog = fogAmount(-toCam * dist, dist);
  float add = 0.0;
  vAmbUp = vAmbDn = vec3(0.0);
  if (glow > 0.0) {
    vLit = albedo * glow * (1.0 - fog);
    add = 1.0;
#ifdef FLAME_FULL
    {
      // By day a flame that is dimmer than the sky cannot be seen as
      // fire, whatever is done with it: its body is made up to the sky's
      // brightness in a flame's orange. At night nothing is added.
      float lack = max(FLAME_DAY_LEAST * dot(uAmbSky.rgb, vec3(0.2126, 0.7152, 0.0722)) - dot(vLit, vec3(0.2126, 0.7152, 0.0722)), 0.0) * day;
      vLit += FLAME_DAY_ORANGE * (lack / dot(FLAME_DAY_ORANGE, vec3(0.2126, 0.7152, 0.0722))) * (1.0 - fog);
      add = 1.0 - FLAME_COVERS * day;
    }
#endif
  } else {
    // The sun reaches a puff through the cloud around it, so it is tested a
    // little way toward the sun as well: the lit skin of a cloud stays
    // bright while its core and its far side go dark.
    float sh = 0.0;
    if (uSunDir.w > 0.0) {
      sh = 0.5 * (sunShadow(p, uSunDir.xyz, 1.0, 0.5, 0.0) + sunShadow(p + uSunDir.xyz * (0.35 + size * 0.5), uSunDir.xyz, 1.0, 0.5, 0.0));
#ifdef SOFT_SHADOW
      // And through the rest of the cloud: the puffs between this one and
      // the sun take its light, so the cloud has a bright side and a dark
      // heart.
      if (sh > 0.0) sh *= softShadow(p, 1.6);
#endif
    }
    // Sunlit dust scatters forward: it glows when seen against the sun.
    float fwd = max(-dot(toCam, uSunDir.xyz), 0.0);
    // (Not the smoke the engine marks: soot takes light, it does not
    // scatter it forward. Black smoke seen toward the sun was pale grey.)
    float phase = 0.6 + (marked ? 0.0 : 1.5 * fwd * fwd * fwd * fwd);
    float sv = skyVisAt(p);
    // By day a fire's light on its own smoke and dust is little beside the
    // sky's: a fifth of it under a noon sky, nearly all of it at night.
    // (Smoke over a burning hedge at noon was lit orange from below as
    // brightly as the sun lit it from above, and orange on grey with the
    // sky behind is pink: the whole sky round a burning house.)
    vec3 pl = uCamFwd.w > 0.0 ? puffLights(p) / (1.0 + PUFF_LIGHT_DAY * dot(uAmbSky.rgb, vec3(0.2126, 0.7152, 0.0722))) : vec3(0.0);
    vLit = albedo * uSunCol.rgb * (sh * 0.62 * phase) * (1.0 - fog);
    vec3 base = uAmbGround.rgb * (0.1 + 0.15 * sv) + pl;
    // (Dust is matter in the air, lit from all round and by itself: under
    // an open sky its shade is the sky's brightness with little of its
    // blue. Smoke takes the sky's colour as it did.)
    vec3 sky = kind == 1 ? mix(vec3(dot(uAmbSky.rgb, vec3(0.2126, 0.7152, 0.0722))), uAmbSky.rgb, DUST_SKY) : uAmbSky.rgb;
    vAmbUp = albedo * (base + sky * (0.06 + 0.5 * sv)) * (1.0 - fog);
    vAmbDn = albedo * (base + uAmbGround.rgb * (0.25 * sv)) * (1.0 - fog);
  }
  vFog = fogColor(-toCam) * fog * (1.0 - add);
  vUv = c;
  // A projection fixed in the world: the billows must not swim through
  // the cloud when the camera turns.
  vec2 air = vec2(wp.x * 0.8 + wp.z * 0.6, wp.y + (wp.x * 0.6 - wp.z * 0.8) * 0.5);
#ifdef PUFFS
  // Billows are broader than a puff: read at the sprite's corners from a
  // coarse level of the noise and interpolated across it, they cost the
  // fragment stage nothing.
  vAir = textureLod(uNoise, air * 0.085 + vec2(dist * 0.013, -uCamPos.w * 0.016), 2.0).rg;
#else
  vAir = vec2(0.5);
#endif
  vec4 clip = uViewProj * vec4(wp, 1.0);
  vMisc = vec4(opacity * thin, add, clip.w, max(size * 0.5, 0.05));
  vSeed = vec2(float(kind), fract(dot(p, vec3(0.731, 0.377, 0.913))));
  vTongue = tongue;
#ifdef FLAME_FULL
  vFlame = vec2(day, opacity);
#endif
  // The gaps open the veiled smoke, and the dust near the eye while things
  // fall (the haze in the rooms of a house with its front off is dust).
  // Not the dust the engine marks as standing (a one in the row's unused
  // word: the cloud over the landing of a great mass, four to eight puffs
  // a landing): that is whole at any distance. (While the mark was on a
  // landing's skirt as well it was opened within 15 m: a wall coming down
  // inside the house a player stands in front of raised it too.)
  bool stands = kind == 1 && aKind.x > 0.5;
  float reach = stands ? 0.0 : 1.0 - smoothstep(VEIL_NEAR, VEIL_FAR, dist);
  float gapped = kind == 2 ? veiled : kind == 1 ? (1.0 - uSkyVisInv.w) * reach * DUST_GAPS : 0.0;
  vVeil = vec2(veiled, gapped) * DUST_SHOW_VEIL;
  vMark = marked ? 1.0 : 0.0;
  gl_Position = clip;
}
`;

export const SOFT_FS = `
${FRAME}
// The least share of its opacity a puff keeps with a surface right behind
// it, and the metres of air behind it at which it keeps all.
#define DUST_SHOW 0.25
#define DUST_SHOW_REACH 12.0
// A veil's gaps: the share of a veiled puff taken away where the noise is
// low, and the span of the noise over which a gap closes.
#define VEIL_OPEN 0.9
#define VEIL_OPEN_LO 0.3
#define VEIL_OPEN_HI 0.8
// Where along a pixel's ray the gaps' noise hangs (metres), and its tiles
// per metre.
#define VEIL_GAP_DIST 6.0
#define VEIL_GAP_SCALE 0.4
${FLAME_BODY}
${VEIL_REACH}
uniform sampler2D uDepth;
uniform sampler2D uNoise;
uniform int uStep;
flat in vec3 vLit;
flat in vec3 vAmbUp;
flat in vec3 vAmbDn;
flat in vec3 vFog;
in vec2 vUv;
in vec2 vAir;
flat in vec4 vMisc;
flat in float vTongue;
#ifdef FLAME_FULL
flat in vec2 vFlame;
#endif
flat in vec2 vSeed;
flat in vec2 vVeil;
#ifdef GAS_MARK
// The gas layer's second attachment: how much of the cover laid down is
// marked smoke (r) of all the cover (a), blended as the colour is, so
// that their ratio is the marked share of what is seen.
flat in float vMark;
layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oMark;
#else
out vec4 oColor;
#endif
void main() {
  vec2 q = vUv * 2.0 - 1.0;
  float r2 = dot(q, q);
  // (A flame fills its quad to the corners; everything else is a disc.)
  if (r2 >= 1.0 && vTongue <= 0.0) discard;
#ifdef SOFT
  // This pass has no depth buffer attached (it samples it instead), so the
  // depth test happens here, first: a sprite behind a wall then costs one
  // fetch per fragment and nothing else. The same comparison fades sprites
  // out where they meet geometry, so there are no hard intersection lines.
  // In a reduced-resolution target each pixel tests against one scene pixel
  // near its centre, the same one the upsample looks at.
  ivec2 dp = ivec2(gl_FragCoord.xy) * uStep + (uStep >> 1);
  float d = texelFetch(uDepth, min(dp, ivec2(uScreen.zw) - 1), 0).r;
  float z = 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
  float fade = clamp((z - vMisc.z) / vMisc.w, 0.0, 1.0);
  if (fade <= 0.0) discard;
  // Dust and smoke show what is in them. Where a surface is close behind a
  // puff (the wall the cloud stands against, a piece falling through it)
  // the puff takes less of the view; against the open (the sky, the far
  // side of the street) it is the cloud it was. So a thing inside its own
  // dust keeps its shape, and stands out against the cloud behind it.
  // Only where the veil is on (the smoke near the eye, while things
  // fall): dust, and a cloud across the street, stand in front of what is
  // behind them.
  float behind = z - vMisc.z, sceneZ = z;
  float show = mix(1.0, mix(DUST_SHOW, 1.0, smoothstep(0.5, DUST_SHOW_REACH, behind)), clamp(vVeil.x, 0.0, 1.0));
#else
  const float fade = 1.0, show = 1.0, behind = 100.0, sceneZ = 0.0;
#endif
  float a = 1.0 - r2;
  int kind = int(vSeed.x + 0.5);
  vec3 col = vLit;
  if (kind <= 2) {
    // Shade the puff as the ball of dust it stands for: the side turned to
    // the sun is lit, the far side is left to the ambient light, and what
    // the sky gives depends on which way that part of the ball faces.
    float nz = sqrt(a);
    vec3 n = uCamRight.xyz * q.x + uCamUp.xyz * q.y - uCamFwd.xyz * nz;
    float lit = clamp(dot(n, uSunDir.xyz) * 0.5 + 0.5, 0.0, 1.0);
#ifdef PUFFS
    // Break the disc into a ragged puff, and let the same noise mottle
    // its light so overlapping puffs do not add up to a flat sheet.
    // Its own slow churn moves the puff's edge...
    float n1 = texture(uNoise, vUv * 0.41 + vSeed.y * vec2(1.0, 1.7) + uCamPos.w * vec2(vSeed.y - 0.5, 0.31) * 0.035).r;
    // ...and noise that hangs in the air and rises through it gives the
    // cloud billows bigger than a puff: thick where it is dark, thin where
    // the light comes through.
    vec2 n2 = vAir;
    a *= smoothstep(0.02, 0.72, a * 0.7 + n1 * 0.62 - 0.06) * (0.5 + n2.r);
    lit = clamp(lit + (n1 - 0.5) * 0.7 + (n2.g - 0.5) * 0.6, 0.0, 1.0);
#endif
    col = vLit * (0.22 + 0.78 * lit * lit) + mix(vAmbDn, vAmbUp, n.y * 0.5 + 0.5);
    // The rim of a puff is where the gaps between puffs are: darker there,
    // and every puff a slightly different tone, so a cloud keeps its lobes.
    col = col * ((0.7 + 0.3 * nz) * (0.86 + 0.28 * vSeed.y)) + vFog;
    // A sprite the camera is inside of would fill the screen: let it go.
    a *= clamp((vMisc.z - 0.1) / (vMisc.w * 1.5), 0.0, 1.0) * show;
    // A veil has gaps. Laid evenly over a house with its front off it is a
    // sheet of tracing paper cut to the house: a noise that hangs in the
    // air opens it, clear where the noise is low, so what stands and what
    // falls are seen through gaps whose edges drift. In the veiled smoke's
    // sprites' own stage, not in the layer: which sprites are opened is
    // told sprite by sprite (vVeil.y).
    // Only in front of what is near: against the sky and the far side of
    // a street the cloud keeps its weight.
    float open = vVeil.y * (1.0 - smoothstep(VEIL_NEAR, VEIL_FAR, sceneZ));
    if (open > 0.0) {
      // The noise hangs in the air some way off along the pixel's own ray
      // (as the gas layer's form does): every puff over a pixel is opened
      // by the same value there, so a gap is a gap through all of them.
      // (Read at each puff's own place, the gaps of one puff were filled
      // by the next behind it.)
      vec2 ndc = (gl_FragCoord.xy * float(uStep)) * uScreen.xy * 2.0 - 1.0;
      vec3 dir = normalize(uCamFwd.xyz + uCamRight.xyz * (ndc.x * uProj.z) + uCamUp.xyz * (ndc.y * uProj.w));
      vec3 gq = (uCamPos.xyz + dir * VEIL_GAP_DIST) * VEIL_GAP_SCALE;
      gq.y -= uCamPos.w * 0.035;
      float glod = max(log2(VEIL_GAP_DIST * 2.0 * uProj.w * uScreen.y * VEIL_GAP_SCALE * 128.0 * float(uStep)), 0.0);
      float g = textureLod(uNoise, vec2(gq.x + gq.z * 0.62, gq.y + gq.z * 0.31), glod).r;
      a *= 1.0 - min(open, 1.0) * VEIL_OPEN * (1.0 - smoothstep(VEIL_OPEN_LO, VEIL_OPEN_HI, g));
    }
  } else if (kind == 4) {
#ifdef FLAME_FULL
    float body = 0.0;
#endif
    // A flame is a tongue, not a ball: broad at its foot, drawn to a point
    // above, leaning as it licks, its edge torn by a noise that climbs
    // through it. (From five metres a hedge fire was "a heap of soft round
    // balls of light".)
    if (vTongue > 0.0) {
      float up = q.y * 0.5 + 0.5;
#ifdef PUFFS
      float lick = texture(uNoise, vec2(vUv.x * 0.37 + vSeed.y * 3.1, vUv.y * 0.23 - uCamPos.w * 0.55 + vSeed.y * 1.7)).r;
#else
      const float lick = 0.5;
#endif
      float lean = (lick - 0.5) * 0.7 * up * up;
      float wide = mix(0.95, 0.22, up * up);
      float fx = (q.x - lean) / wide;
      float flame = max(1.0 - fx * fx, 0.0) * (1.0 - smoothstep(0.55, 1.0, up + (lick - 0.5) * 0.5)) * smoothstep(-1.0, -0.72, q.y);
      a = mix(max(a, 0.0), flame, vTongue);
#ifdef FLAME_FULL
#ifdef PUFFS
      // A finer noise that climbs faster tears the body's edge, more
      // toward its tip: a flame is ragged, not a teardrop.
      float tear = texture(uNoise, vec2(vUv.x * 1.3 + vSeed.y * 5.3, vUv.y * 0.9 - uCamPos.w * 1.1 + vSeed.y * 2.9)).r;
#else
      const float tear = 0.5;
#endif
      body = flame * (0.7 + 0.6 * lick) + (tear - 0.5) * FLAME_TORN * (0.3 + up);
#endif
    }
    // Fire: white-yellow only at its heart, orange around it, red at the
    // edge where it thins, so a fireball has a shape instead of filling
    // the frame with one flat colour.
    col = vLit * vec3(1.0, 0.4 + 0.6 * a, 0.12 + 0.88 * a * a) * (0.35 + 0.9 * a);
    a *= a;
#ifdef FLAME_FULL
    if (vFlame.x > 0.0) {
      // By day a flame is a body with an edge: it hides the sky behind it
      // where it burns and is not there where it does not, and as it
      // thins it wears away from its edge inward instead of going clear.
      // (Added to a noon sky as a soft glow, all of a flame but its heart
      // was a pale pink ghost: orange light on blue.)
      float thr = mix(FLAME_BODY_OLD, FLAME_BODY_YOUNG, smoothstep(FLAME_BODY_GONE, 0.7, vFlame.y));
      float solid = smoothstep(thr, thr + FLAME_BODY_EDGE, body);
      // Hot at its foot and at its heart, red at its tip: by its height
      // more than by its own rim, so that flames side by side are one
      // fire and not a row of outlined shapes.
      float heat = clamp((1.0 - (q.y * 0.5 + 0.5)) * 0.8 + 0.4 * clamp((body - thr) / max(1.0 - thr, 0.05), 0.0, 1.0), 0.0, 1.0);
      // (Never to white: a body of pale yellow from foot to tip was
      // cream on the screen, not fire.)
      vec3 hot = vLit * vec3(1.0, 0.35 + 0.45 * heat, 0.03 + 0.25 * heat * heat) * (0.6 + 0.5 * heat);
      col = mix(col, hot, vFlame.x);
      a = mix(a, solid * max(vFlame.y, FLAME_BODY_LEAST) / max(vFlame.y, 1e-3), vFlame.x);
    }
#endif
  } else {
    a *= a;
  }
  a *= vMisc.x * fade;
  if (a < 0.003) discard;
#ifdef HDR_ENCODE
  oColor = vec4(sqrt(min(col, 16.0) * 0.0625) * a, a * (1.0 - vMisc.y));
#else
  oColor = vec4(min(col, 64.0) * a, a * (1.0 - vMisc.y));
#endif
#ifdef GAS_MARK
  oMark = vec4(a * (1.0 - vMisc.y) * vMark, 0.0, 0.0, a * (1.0 - vMisc.y));
#endif
}
`;

// Brings the reduced-resolution gas layer (premultiplied colour, coverage in
// alpha) up to the scene. Each of the four layer pixels around a scene pixel
// was depth-tested against one known scene pixel; one whose depth disagrees
// with this pixel's saw a different surface (the other side of a silhouette)
// and is weighted down, so smoke neither leaks over a nearer edge nor leaves
// a halo of clear pixels around it.
export const GAS_UP_FS = `
${FRAME}
uniform sampler2D uTex;    // the gas layer
uniform sampler2D uTex2;   // its marked share (r of a), linear
uniform sampler2D uDepth;  // scene depth
uniform sampler2D uNoise;
uniform ivec4 uLayer;      // layer pixel in scene pixels, then the part of uTex in use (w, h)
// The distance at which the cloud's form hangs (metres), noise tiles per
// metre, and the brightest lit dust gets, as the layer stores it.
#define GAS_FORM_DIST 6.0
#define GAS_FORM_SCALE 0.4
// The most of what is behind it a cloud takes in front of a surface near
// the eye.
#define GAS_TAKES_NEAR 0.35
#define GAS_TAKES_MARKED 0.95
// The most of what is behind it a flame hides, and how bright (in lit
// dust's brightest) it is where it hides that much: soon, a flame's red
// rim already hides most of the sky behind it.
#define GAS_FIRE_COVERS 0.85
#define GAS_FIRE_FULL 0.15
// A haze thinner than GAS_HAZE_LO keeps this share of its cover and this
// share of its colour; a cloud thicker than GAS_HAZE_HI all of both.
#define GAS_HAZE_LO 0.1
#define GAS_HAZE_HI 0.55
#define GAS_HAZE_KEEP 0.5
#define GAS_HAZE_COLOUR 0.35
${VEIL_REACH}
#ifdef HDR_ENCODE
#define GAS_DUST_MAX 0.43
#else
#define GAS_DUST_MAX 3.0
#endif
out vec4 oColor;
float viewZ(float d) {
  return 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
}
void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  int step_px = uLayer.x;
  vec2 f = (gl_FragCoord.xy - float(step_px >> 1) - 0.5) / float(step_px);
  ivec2 b = ivec2(floor(f));
  vec2 t = f - vec2(b);
  ivec2 top = uLayer.yz - 1, full = ivec2(uScreen.zw) - 1;
  // Most of most frames has no gas in front of it: the four layer pixels
  // say so before anything else is read.
  ivec2 lp[4];
  vec4 lc[4];
  vec4 any = vec4(0.0);
  for (int k = 0; k < 4; k++) {
    lp[k] = clamp(b + ivec2(k & 1, k >> 1), ivec2(0), top);
    lc[k] = texelFetch(uTex, lp[k], 0);
    any += lc[k];
  }
  if (any.r + any.g + any.b + any.a <= 0.0) discard;
  float z = viewZ(texelFetch(uDepth, ip, 0).r);
  vec4 sum = vec4(0.0);
  float ws = 0.0;
  for (int k = 0; k < 4; k++) {
    float lz = viewZ(texelFetch(uDepth, min(lp[k] * step_px + (step_px >> 1), full), 0).r);
    float dz = (lz - z) / z;
    float w = ((k & 1) == 1 ? t.x : 1.0 - t.x) * ((k >> 1) == 1 ? t.y : 1.0 - t.y) / (0.002 + dz * dz * 400.0) + 1e-5;
    sum += lc[k] * w;
    ws += w;
  }
  vec4 c = sum / ws;
  // The layer is coarse (down to an eighth of the scene), so a cloud comes
  // back from it as a smooth smear with nothing in it. Its form is put in
  // here, at the scene's resolution: a noise that hangs in the air some way
  // off (fixed in the world when the camera turns, drifting upward) carves
  // the smear into billows with an edge, thick where the layer is thick and
  // wisps where it is thin, and lights the bulges.
  if (c.a > 0.004) {
    vec2 ndc = gl_FragCoord.xy * uScreen.xy * 2.0 - 1.0;
    vec3 dir = normalize(uCamFwd.xyz + uCamRight.xyz * (ndc.x * uProj.z) + uCamUp.xyz * (ndc.y * uProj.w));
    vec3 q = (uCamPos.xyz + dir * GAS_FORM_DIST) * GAS_FORM_SCALE;
    q.y -= uCamPos.w * 0.035;
    // Seen along each axis in turn, weighted by how squarely the ray meets
    // that plane, so no direction of view smears it; a plane met at a slant
    // is not read at all (one to three lookups, two on average). The level
    // is the same all over the screen: a pixel at that distance, in texels.
    float lod = max(log2(GAS_FORM_DIST * 2.0 * uProj.w * uScreen.y * GAS_FORM_SCALE * 128.0), 0.0);
    vec3 w = max(dir * dir - 0.18, 0.0);
    w /= w.x + w.y + w.z;
    float n = 0.0;
    if (w.x > 0.0) n += textureLod(uNoise, q.zy + vec2(0.37, 0.0), lod).r * w.x;
    if (w.y > 0.0) n += textureLod(uNoise, q.xz + vec2(0.0, 0.61), lod).g * w.y;
    if (w.z > 0.0) n += textureLod(uNoise, q.xy, lod).r * w.z;
    float a = c.a;
    float e = a + (n - 0.5) * 1.15 * (1.0 - a);
    // (A haze too thin to see stays one: its wisps are a few times as
    // thick as the haze was, not a cloud of their own.)
    float carved = smoothstep(0.24, 0.58, e) * (0.35 + 0.65 * a) * min(a * 8.0, 1.0);
    // Fire and glow are in the same layer, added over the dust: what is
    // brighter than lit dust can be is theirs and is left as it is.
    vec3 glow = max(c.rgb - a * GAS_DUST_MAX, 0.0);
    c.rgb = (c.rgb - glow) * (carved / a * mix(0.8, 1.16, smoothstep(0.2, 0.8, n))) + glow;
    c.a = carved;
  }
  // A cloud never closes: at most three quarters of what is behind it is
  // taken, so the shape of a wall falling in it, or of what still stands
  // behind it, shows through (it took seven eighths, and from the street
  // a house was a ball of dust with a fire under it).
  // And in front of what stands near the eye, at most GAS_TAKES_NEAR: the
  // rooms of a house whose front has just come off are what the player is
  // looking at. Whatever lies between the eye and a surface that near is
  // itself that near, so this is the dust and smoke of the thing in front
  // of the player and no other: a cloud against the sky or in front of
  // the far side of a street keeps its three quarters. (The gaps cut in
  // each puff do not do it alone: a dozen puffs deep, only the very
  // middle of a gap is open. Three seconds after a rocket at its door 42%
  // of Number nine was seen with them, tools/harness/seen_check.mjs.)
  // Whether or not anything is still falling: held only while things
  // fell, the dust left standing in the opened house closed over it
  // again as the last piece came to rest, a flat sheet in the shape of
  // the front from the road for ten seconds more.
  // Fire and glow are not dust and are dimmed by a cloud as they were.
  float near = 1.0 - smoothstep(VEIL_NEAR, VEIL_FAR, z);
  // Not the smoke the engine marks as rising from a seat of fire (carried
  // in the layer's second attachment): a column over a burning van hides
  // what is behind it however near the player stands. One lookup.
  vec4 mk = texture(uTex2, clamp(vec2(b) + t + 0.5, vec2(0.5), vec2(uLayer.yz) - 0.5) / vec2(textureSize(uTex2, 0)));
  float marked = clamp(mk.r / max(mk.a, 0.004), 0.0, 1.0);
  near *= 1.0 - marked;
  // And it may close: a cloud of dust never takes more than three
  // quarters, but black smoke with a wall behind it left the wall a
  // quarter lit through whatever depth of it (a white wall behind three
  // burning wrecks read 195 of 228).
  float takes = mix(mix(0.75, GAS_TAKES_NEAR, clamp(near, 0.0, 1.0)), GAS_TAKES_MARKED, marked);
  vec3 lit = max(c.rgb - c.a * GAS_DUST_MAX, 0.0);
  // A thin wide haze is not a cloud: it takes less than its puffs add up
  // to and shows less of their colour, so the colour of what broke stays
  // where the cloud is thick. (Two seconds after one rocket at the foot of
  // a brick chimney its dust lay thin over everything within fifteen
  // metres: a brick-pink tint on the trees and the houses behind, "a
  // filter".)
  // (Nor is such a column a haze, however thin its top.)
  float thick = max(smoothstep(GAS_HAZE_LO, GAS_HAZE_HI, c.a), marked);
  vec3 dust = c.rgb - lit;
  dust = mix(vec3(dot(dust, vec3(0.2126, 0.7152, 0.0722))), dust, mix(GAS_HAZE_COLOUR, 1.0, thick));
  float keep = mix(GAS_HAZE_KEEP, 1.0, thick) * (1.0 - (1.0 - takes) * c.a);
  // A flame is not light alone: where it is bright it is thick, and hides
  // what is behind it, most of it at a flame's heart. (Added to the sky
  // with nothing taken, a hedge fire's flames against a noon sky were pink
  // and white: orange light on top of blue.)
  float fire = min(dot(lit, vec3(0.2126, 0.7152, 0.0722)) / (GAS_DUST_MAX * GAS_FIRE_FULL), 1.0) * GAS_FIRE_COVERS;
  oColor = vec4(dust * keep + lit * (1.0 - 0.25 * c.a), 1.0 - (1.0 - c.a * keep) * (1.0 - fire));
}
`;

// The soft shadow map: what the shadow atlas leaves out, seen from the sun
// over the ground around the camera (placement: uSoftMap in the frame
// block). Debris goes in as a disc per piece with a margin around
// it, keeping the piece nearest the light and the least distance outside
// one; dust and smoke as the amount of it along each ray and where along
// the ray it lies on average, so that what is beyond the cloud is shaded and
// what is on the sunny side of it is not.
export const SOFT_DEBRIS_VS = `
${FRAME}
layout(location = 0) in vec4 aPosSize;
layout(location = 2) in vec4 aColor;
uniform sampler2D uPalette;
out vec2 vP;
flat out vec4 vPiece;  // half width, margin, depth, least shade (glass lets most light through)
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  int mat = int(aColor.a * 255.0 + 0.5);
  bool glass = mat < 255 && (int(texelFetch(uPalette, ivec2(mat, 1), 0).a * 255.0 + 0.5) & 2) != 0;
  float s = aPosSize.w;
  // A chip smaller than half a texel has no shadow the map could hold.
  if (s < 0.045) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
  // (A lump, not a box: its shadow is round.)
  float half_w = s * 0.5, margin = clamp(s * 0.7, 0.09, 0.2);
  vec3 wp = aPosSize.xyz;
  vec3 m = vec3(dot(uSoftMap[0].xyz, wp) + uSoftMap[0].w, dot(uSoftMap[1].xyz, wp) + uSoftMap[1].w, dot(uSoftMap[2].xyz, wp) + uSoftMap[2].w);
  vP = c * (half_w + margin);
  // The depth of the piece's far side, less a little: it must not shade
  // itself, and the ground it lies on is shaded from its edge outward.
  vPiece = vec4(half_w, margin, m.z + 0.4 * s * length(uSoftMap[2].xyz), glass ? 0.7 : 0.0);
  gl_Position = vec4((m.xy + vP * length(uSoftMap[0].xyz)) * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const SOFT_DEBRIS_FS = `
in vec2 vP;
flat in vec4 vPiece;
out vec4 oColor;
void main() {
  float out_m = max(length(vP) - vPiece.x, 0.0) / vPiece.y;
  oColor = vec4(clamp(vPiece.z, 0.0, 1.0), max(out_m, vPiece.w), 0.0, 0.0);
}
`;

export const SOFT_GAS_VS = `
${FRAME}
layout(location = 0) in vec4 aPosSize;
layout(location = 2) in vec4 aColor; // a sprite's: the kind is the fourth byte
layout(location = 3) in vec3 aKind;  // a sprite's: unused, opacity, glow
out vec2 vUv;
flat out vec2 vGas;    // density at the centre, depth
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  int kind = int(aColor.a * 255.0 + 0.5);
  // Dust and smoke; fire and sparks give light, they do not take it.
  if (kind < 1 || kind > 2 || aKind.z > 0.0) { gl_Position = vec4(0.0, 0.0, -2.0, 1.0); return; }
  vec3 wp = aPosSize.xyz;
  vec3 m = vec3(dot(uSoftMap[0].xyz, wp) + uSoftMap[0].w, dot(uSoftMap[1].xyz, wp) + uSoftMap[1].w, dot(uSoftMap[2].xyz, wp) + uSoftMap[2].w);
  vUv = c;
  // A thin wide puff holds as much dust as a small dense one.
  vGas = vec2(aKind.y * min(aPosSize.w, 3.0), clamp(m.z, 0.0, 1.0));
  gl_Position = vec4((m.xy + (c - 0.5) * (aPosSize.w * length(uSoftMap[0].xyz))) * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const SOFT_GAS_FS = `
in vec2 vUv;
flat in vec2 vGas;
out vec4 oColor;
void main() {
  vec2 q = vUv * 2.0 - 1.0;
  float a = max(1.0 - dot(q, q), 0.0);
  float rho = a * a * vGas.x;
  oColor = vec4(rho, rho * vGas.y, 0.0, 0.0);
}
`;

// Lays the dust (drawn smaller: it is soft anyway) into the map's free channels.
// (Only over the rectangle the cloud covers; toward the rectangle's edge the
// dust is faded out, so that a puff the rectangle cuts through never leaves
// a straight edge in a shadow.)
export const SOFT_MERGE_FS = `
uniform sampler2D uTex;
uniform vec4 uRect;   // the rectangle, map texels: x0, y0, x1, y1
in vec2 vUv;
out vec4 oColor;
void main() {
  vec2 d = min(gl_FragCoord.xy - uRect.xy, uRect.zw - gl_FragCoord.xy);
  oColor = vec4(0.0, 0.0, texture(uTex, vUv).rg * clamp(min(d.x, d.y) / 16.0, 0.0, 1.0));
}
`;

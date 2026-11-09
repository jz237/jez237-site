// Procedural surface detail and volume ambient occlusion for voxel faces.
// Everything is evaluated in pattern space (voxel coordinates of the lattice a
// body was cut from) so detail stays glued to pieces that break off, and every
// line is filtered with screen-space derivatives so nothing shimmers far away.

// The material patterns alone: what the voxel faces and the debris pieces
// share. PATTERN_LEAN (debris on the lowest tier) drops the last texture tap.
//
// Two taps are taken for every pattern, ahead of the branches (broad
// mottling and, with DETAIL, fine speckle). The few a pattern takes for
// itself inside its branch carry explicit gradients (textureGrad): a
// lookup with implicit derivatives inside a branch is undefined where the
// branch is not taken by the whole 2 x 2 block, and compilers that have to
// guarantee it (HLSL behind ANGLE) run every branch for every pixel
// instead. With DETAIL no pattern takes more than four taps in all, and
// none more than the generic pattern it replaced; without DETAIL (the
// lowest tier) each keeps its lines and its broad tone and nothing else.
// Where the noise is not filtered anisotropically (NOISE_ISO: the tiers
// with `aniso` 1) a lookup with gradients is a lookup at the level of
// detail those gradients give, worked out here: the same texels, and the
// software rasteriser the frame is judged on takes a tenth less over the
// whole frame than with textureGrad.
// Mirrors material::PAT_* (engine/src/material.rs): the one place on this
// side where the numbers are written.
export const PAT = { FLAT: 0, BRICK: 1, PLANKS: 2, TILES: 3, NOISE: 4, GRAIN: 5, EMBER: 6, TURF: 7, TARMAC: 8, CONCRETE: 9, METAL: 10, RUBBLE: 11, SOIL: 12 };

// The two greens of a lawn, dry and lush, as factors on the turf material's
// colour: shared with the land drawn beyond the voxel world
// (render_shaders_fx.js), so that the world's edge is hard to find. (The
// table's grass is a paint-box green, twice as bright in green as mown
// grass reflects: a lawn in the sun is olive, not neon.)
export const TURF_DRY = 'vec3(1.02, 0.66, 0.9)', TURF_LUSH = 'vec3(0.7, 0.6, 1.02)';

export const PATTERN = `
${Object.entries(PAT).map(([k, v]) => `#define PAT_${k} ${v}`).join('\n')}
uniform sampler2D uNoise;   // r: blotches, g: streak noise, b: speckle, a: speckle 2

struct Surf {
  vec3 albedo;
  float rough;
  float cavity;   // 1 = open, lower = recessed (mortar, seams)
  float bevel;    // how worn the material's real edges are (the chamfer in MAIN_FS; 0 = a razor)
  float var;      // per-voxel colour jitter amount
  vec2 tilt;      // lean of the surface along the face's two axes (waviness, a brick set askew)
  float lit;      // share of the sun that relief below the face lets through (a joint in the shadow of its brick)
  vec4 noise;     // the pattern's own taps (broad r, g; fine r, g), for whoever shades on: no second lookup
};

// How the face is seen and lit, for relief that sits below it: the tangent
// of the eye's and of the sun's direction along the face's two axes (the
// part along the axis over the part along the normal). The caller sets them
// before surfacePattern; left alone a face is seen and lit square on, and
// relief is drawn flat (debris, the lowest tier).
vec2 patEye = vec2(0.0);
vec2 patSun = vec2(0.0);
// The concrete is reinforced: a break in it shows the ends of its bars.
bool patBars = false;
// A broken face is painted as the inside of its material (surfacePattern,
// where weathered is 0), and three things about the solid there are the
// caller's to say; left alone the pattern goes by the face.
// The pixel's height in the material as it was built, voxels, and the size
// of a pixel in it: a course's bed is a layer of the solid, crossed by a
// broken face whichever way that looks. (y < 0: not given; uv.y on a wall,
// and a level face lies on a bed.)
vec2 patBed = vec2(0.0, -1.0);
// Plaster, render, board: a pale matt skin with no pattern.
bool patPlaster = false;
// Boards of timber (the pattern is metal sheet's too).
bool patWood = false;
// What surfacePattern says back: it laid the inside of the material, and
// the caller is not to pale it as a fracture of an unknown material.
bool patInner = false;

// Second-order detail (speckle, grain, streaks) costs extra texture taps; the
// lowest tier keeps only the broad mottling and the pattern lines.
#ifdef NOISE_ISO
// (The noise is 128 texels a tile.)
vec4 noiseGrad(vec2 c, vec2 dx, vec2 dy) { return textureLod(uNoise, c, 0.5 * log2(max(max(dot(dx, dx), dot(dy, dy)), 1e-12)) + 7.0); }
#else
#define noiseGrad(c, dx, dy) textureGrad(uNoise, c, dx, dy)
#endif
#ifdef DETAIL
#define detailGrad(c, dx, dy) noiseGrad(c, dx, dy)
#else
#define detailGrad(c, dx, dy) vec4(0.5)
#endif
#ifdef DETAIL
#define DETAIL_TAP(uv) texture(uNoise, uv)
#else
#define DETAIL_TAP(uv) vec4(0.5)
#endif
// How worn a material's edges are is read by the chamfer alone (MAIN_FS with BEVEL).
#ifdef BEVEL
#define SURF_BEVEL(x) s.bevel = x
#else
#define SURF_BEVEL(x)
#endif
// Without DETAIL the fine noise is its mean, 0.5: a term that is
// (fine - 0.5) times something is nothing, and is not compiled.
#ifdef DETAIL
#define FINE_PLUS(e) + (e)
#else
#define FINE_PLUS(e)
#endif
#ifdef PATTERN_LEAN
#define BLOT_TAP(uv) vec4(0.5)
#else
#define BLOT_TAP(uv) texture(uNoise, uv)
#endif

#ifndef SURF_ROUGH
#define SURF_ROUGH(x) s.rough = x
#endif

// Coverage of a line of half-width w centred where d = 0, antialiased by fw.
// (Written into the place that asks, not called: a call copies each of its
// arguments into a variable of its own, which for a line this short is
// more of the program than the line. d and fw may be two numbers, the two
// directions of a face at once.)
#define lineMask(d, w, fw) (1.0 - smoothstep((w) - (fw), (w) + (fw), d))

// How much of a feature that is size voxels across survives at fw voxels per
// pixel: all of it while it covers a few pixels, none once it is smaller
// than one. Below that it would be hit by the odd pixel centre and shimmer.
// (Written into the place that asks, as lineMask is; size and fw may be two numbers.)
#define resolved(size, fw) (1.0 - smoothstep(0.25 * (size), 0.9 * (size), fw))

// Grime where rain does not wash a wall: the half metre under an eave, a
// ledge, a balcony. shelter: how much the spot is under one (0 in the open
// and indoors; see skyVisibility); streak: noise that runs down the wall.
// (Written into the place that asks, as lineMask is. c is read twice: hand it a variable.)
#define grimed(c, shelter, streak, weathered) mix(c, (c) * vec3(0.6, 0.63, 0.58), (shelter) * (weathered) * (0.45 + 0.55 * (streak)))

// The slope of a quantity along the face's two axes, from its differences
// on screen (dh) and those of the face's coordinates.
vec2 fineSlope(vec2 dh, vec2 gx, vec2 gy) {
  float jac = gx.x * gy.y - gx.y * gy.x;
  return abs(jac) > 1e-9 ? clamp(vec2(dh.x * gy.y - dh.y * gx.y, dh.y * gx.x - dh.x * gy.x) / jac, -6.0, 6.0) : vec2(0.0);
}

// uv: face-plane coordinates in voxels, gx and gy their screen-space
// derivatives. weathered: 1 on a face that has been out in the rain, 0 on a
// fracture surface (no streaks there). shelter: see grime. quad: the extent
// of the face's quad along uv, voxels (0 when not known): a long thin member
// has its grain along its length.
void surfacePattern(int pattern, vec2 uv, vec2 gx, vec2 gy, float layer, bool wall, bool granular, float weathered, float shelter, vec2 quad, inout Surf s) {
  vec2 fw = abs(gx) + abs(gy);
  float aa = max(fw.x, fw.y);
  // (The colour is worked on in a variable of its own and handed back at
  // the end: every reading and writing of a field of s is a step through
  // the struct, and the patterns touch this one some 41 times.)
  vec3 albedo = s.albedo;
  // Sub-voxel detail dissolves into its average before it can alias.
  float detail = 1.0 - smoothstep(0.2, 0.8, aa);
  // (With the gradients the caller gives, not the lookup's own: the
  // coordinates may jump from pixel to pixel, as a heap's do where its
  // stone changes plane, and a lookup that takes its own differences then
  // reads a coarse level in blocks of four pixels.)
#ifdef NOISE_ISO
  // (One level of detail for both, each adding its scale.)
  float nlod = 0.5 * log2(max(max(dot(gx, gx), dot(gy, gy)), 1e-12)) + 7.0;
#define BLOT_FINE(c, k, lk) textureLod(uNoise, c, nlod + lk)
#else
#define BLOT_FINE(c, k, lk) textureGrad(uNoise, c, gx * k, gy * k)
#endif
#ifndef NO_INSIDE
  // A broken face shows the inside of the material, not its face a shade
  // paler (below). Told here, ahead of the lookups: its grain is a
  // centimetre or two, the fine noise, and where the tier has only the
  // broad lookup that one is taken at the fine scale on such a face, in
  // place of the broad one and not beside it.
  // (The lowest tier lays the inside of brick and concrete alone, and in
  // few words: the software rasteriser pays for every word of a program
  // in every pixel, and the first version of this was a tenth of its frame.)
#ifdef DETAIL
  bool timber = pattern == PAT_GRAIN || (pattern == PAT_PLANKS && patWood);
  patInner = weathered < 0.5 && (pattern == PAT_BRICK || pattern == PAT_CONCRETE || patPlaster || timber);
#else
  patInner = weathered < 0.5 && (pattern == PAT_BRICK || pattern == PAT_CONCRETE);
#endif
#endif
#ifdef PATTERN_LEAN
  vec4 blot = vec4(0.5);
#else
  // (Embers: one field for every layer, so that the heat runs on across
  // the steps of what burns. See PAT_EMBER.)
#if defined(DETAIL) || defined(NO_INSIDE)
  vec4 blot = BLOT_FINE(uv * 0.027 + (pattern == PAT_EMBER ? 0.0 : layer) * 0.173, 0.027, -5.211);
#else
  // (At a scale where the noise's two speckle channels are grains of a
  // centimetre: the stones of concrete.)
  float bk = patInner ? 0.2 : 0.027;
  vec4 blot = BLOT_FINE(uv * bk + (pattern == PAT_EMBER ? 0.0 : layer) * (patInner ? 0.411 : 0.173), bk, (patInner ? -2.32 : -5.211));
#endif
#endif
#ifdef DETAIL
  vec4 fine = BLOT_FINE(uv * 0.31 + layer * 0.411, 0.31, -1.69);
#else
  vec4 fine = vec4(0.5);
#endif
  // (The channels of the two noises the patterns read most, each in a
  // number of its own: read out of the four where it is used, a channel
  // is one more step each time, and these are read 15, 11, 7 and 8 times.)
  float blotR = blot.r, blotG = blot.g, fineG = fine.g, fineB = fine.b;
  s.tilt = vec2(0.0);
  s.lit = 1.0;
  s.noise = vec4(blot.rg, fine.rg);
#ifdef DETAIL
  // The fine noise's differences on screen: its slope along the face's
  // axes is a relief of millimetres for the patterns that want one
  // (relief: how much), at no tap. The differences are taken here, ahead
  // of the branches; the slope is worked out after the patterns, only for
  // those that asked.
  vec2 dfine = vec2(dFdx(fineG), dFdy(fineG));
  float relief = 0.0;
#endif
  // Joints. A pattern with joints along the face's two axes (brick, boards,
  // slabs) says where they are and what they are like, and they are drawn
  // once, after the patterns: one copy of that code, not one per pattern.
#ifdef DETAIL
  // The broadest noise, for the patterns that take it: one lookup, written once.
  vec4 big = vec4(0.5);
  if (pattern == PAT_NOISE || pattern == PAT_RUBBLE || pattern == PAT_SOIL || pattern == PAT_TARMAC || pattern == PAT_CONCRETE) big = detailGrad(uv * 0.0071 + 0.3, gx * 0.0071, gy * 0.0071);
#else
  const vec4 big = vec4(0.5);
#endif
  // The broad mottling of stone, tarmac and concrete: worked out once for the three.
  float blotch = blotR * 0.65 + big.r * 0.35;
#ifdef DETAIL
  // Rain streaks down a wall: noise stretched hard along the vertical. One
  // lookup, written once, for the two patterns that take it (stone and
  // render, cast concrete).
  float streak = 0.5;
  if (wall && (pattern == PAT_CONCRETE || ((pattern == PAT_NOISE || pattern == PAT_RUBBLE) && !granular))) streak = detailGrad(vec2(uv.x * 0.043 + layer * 0.21, uv.y * 0.0031), gx * vec2(0.043, 0.0031), gy * vec2(0.043, 0.0031)).g;
#endif
  // How much of a pattern's joints (bricks, boards, slabs, formwork) there
  // are pixels for, along the face's two axes: asked once for all of them.
  vec2 jsize = pattern == PAT_BRICK ? vec2(2.0, 1.0) : (pattern == PAT_TILES ? vec2(4.0) : (pattern == PAT_CONCRETE ? vec2(3.0) : vec2(2.0)));
  vec2 jres = resolved(jsize, fw);
  bool jointed = false;
  vec2 je = vec2(0.0);      // the pixel's offsets from the nearest joints' centre lines
  vec2 jfade = vec2(0.0);   // how much of each direction's joints there are pixels for
  vec2 javg = vec2(0.0);    // what each direction's joints average to when there are none
  vec4 jshape = vec4(0.0);  // half-width, depth, how far the arris is rounded, 1 = a joint along v ends one across it (a perpend at its bed)
  vec3 jcol = vec3(0.0);    // the joint's floor: mortar, the dark between boards
  vec3 jmix = vec3(0.0);    // sky a joint loses, roughness in it (0: the face's), tone of the wall beyond it
  vec2 jlean = vec2(0.0);   // the face's own lean (a brick set askew, a cupped board)
  float jgrain = 0.0;       // relief of the face's grain
#ifndef NO_INSIDE
  // The inside of the material. The courses and joints of a wall are laid
  // on its face; behind it there is the body of the bricks and the beds
  // they lie in, the stones of the concrete, the coarse coat a plaster's
  // skin was floated on, the wood under the paint. Laid here in place of
  // the pattern, by noise and by the solid's own layers, with nothing that
  // knows where a voxel ends: a piece of wall in the air is thirty pixels
  // to the voxel, and a joint round each of them is a toy brick.
  // (One formula for the four, with each one's figures: a program pays
  // for all it holds wherever it runs.)
  if (patInner) {
#ifndef DETAIL
    // The lowest tier: the body of the brick or the cement, speckled by
    // the grains of the one lookup (its levels fade them with distance),
    // and on a face of brickwork that broke along a bed the mortar, in
    // patches.
    bool brick = pattern == PAT_BRICK;
    vec3 c = albedo * (brick ? vec3(1.16, 1.1, 1.02) : vec3(0.7)) * (0.75 + 0.5 * blot.b);
    float m = brick && !wall ? smoothstep(0.45, 0.55, blotG) : 0.0;
    albedo = mix(c, vec3(0.29, 0.275, 0.245) + c * 0.2, m);
#else
    // (Grains and stones: the fine noise's two broad channels.)
    vec4 grit = fine;
    float seen = resolved(0.3, aa);
    bool brick = pattern == PAT_BRICK, conc = pattern == PAT_CONCRETE;
    // Brick: the body of a brick, the colour it was fired, cleaner and
    // warmer than the skin the weather has had. Concrete: the cement
    // between its stones, darker than the cast face (that is the pale
    // skin of fines the formwork left). Timber: the wood under the paint
    // or the bark, pale and raw. Plaster is a skin: a finger's width of
    // finish on a coarse coat of sand and lime, grey-buff, and that coat
    // is what its broken edge shows.
    vec3 c = brick ? albedo * vec3(1.16, 1.1, 1.02) : (conc ? albedo * 0.7 : (timber ? vec3(0.39, 0.257, 0.117) : vec3(0.23, 0.2, 0.157)) + albedo * (timber ? 0.22 : 0.15));
    // Its grit (the fibres' ends, in timber) and what is dark in it
    // (inclusions in a brick, split stones, torn fibre); in concrete the
    // pale stones too.
    c *= (0.87 + 0.26 * blotR) * (1.0 + ((grit.b - 0.5) * 0.3 + (grit.g - 0.5) * 0.2) * seen);
    c *= 1.0 - smoothstep(0.62, 0.7, grit.r) * ((brick || conc ? 0.28 : 0.14) * seen) + smoothstep(0.6, 0.65, grit.g) * (conc ? 0.4 * seen : 0.0);
#if defined(DETAIL) && !defined(NO_BREAK)
    if (conc && patBars) {
      // Where it is reinforced, the cut ends of its bars every 20 cm,
      // rusty, each in the socket it was torn in.
      float bar = length((fract(uv * 0.5 + 0.25) - 0.5) * 2.0);
      c = mix(c, vec3(0.2, 0.085, 0.04), (1.0 - smoothstep(0.09, 0.1 + aa, bar)) * seen);
      c *= 1.0 - 0.45 * (1.0 - smoothstep(0.1, 0.2 + aa, bar)) * smoothstep(0.08, 0.1, bar) * seen;
    }
#endif
    // The beds of brickwork run through: mortar is a layer of the solid
    // at every course, a ragged crumbling line where a broken face
    // crosses it and the whole of a face that broke along it, brick
    // showing through where the mortar came away with the course above.
    // No perpends: a brick snaps, and the break does not go round it.
#ifdef FINE
    vec2 h = patBed.y < 0.0 ? (wall ? vec2(uv.y, fw.y) : vec2(0.0)) : patBed;
#else
    // (Only the fine layer's program gives a bed: the others do not ask.)
    vec2 h = wall ? vec2(uv.y, fw.y) : vec2(0.0);
#endif
    // (Its half-width and its pixel in variables: lineMask reads each twice.)
    float bw = 0.05 + (grit.r - 0.35) * 0.12 * seen, bfw = h.y + 0.01;
    float m = lineMask(abs(fract(h.x + 0.5) - 0.5), bw, bfw);
    m *= mix(0.5, smoothstep(0.42, 0.52, blotG * 0.3 + grit.g * 0.7), seen);
    m = brick ? mix(0.12, m, resolved(1.0, h.y)) : 0.0;
    albedo = mix(c, vec3(0.29, 0.275, 0.245) * (0.8 + 0.4 * grit.b) + c * 0.2, m);
#endif
    s.cavity = 1.0 - 0.25 * m;
    s.var *= 0.25;
    SURF_ROUGH(1.0);
    SURF_BEVEL(0.3);
  } else
#endif
  if (pattern == PAT_BRICK) {
    // Running-bond brickwork: 30 x 10 cm bricks, recessed mortar joints.
    // Courses and perpends fade each by its own direction, so a wall seen
    // along its length keeps its courses after the perpends have gone.
    float course = floor(uv.y);
    float bx = (uv.x + mod(course, 2.0) * 1.5) / 3.0;
    float brick = floor(bx);
    float f = fract(bx) * 3.0;
    float fy = fract(uv.y);
    float ky = jres.y, kx = jres.x;
    // A brick's own tone, for as long as there are pixels for bricks.
    float own = ky * kx;
    float bh = hash13(vec3(brick, course, layer * 0.5 + 3.0));
    vec3 c = albedo * (0.84 + 0.3 * mix(0.5, bh, own));
    c = mix(c, c * vec3(0.74, 0.7, 0.72), step(0.9, fract(bh * 7.3)) * own);
    c *= 0.9 + 0.2 * blotR FINE_PLUS((fineB - 0.5) * 0.16 * detail);
#ifdef DETAIL
    // The wall is not a drawing of a wall. The mortar sits back a
    // centimetre: seen at a slant it slides under the near brick and the
    // side of the far one shows, and the brick on the sun's side lays its
    // shadow in the joint. No brick is ruled (its edges wander by a few
    // millimetres), its arrises are rounded and catch the light, and its
    // face has the creases of the mould and the odd iron spot. All of it
    // from the two taps every pattern has, and gone before it is smaller
    // than a pixel; none of it on a broken face.
    c *= 1.0 + (fineG - 0.5) * 0.2 * detail;
    c *= 1.0 - 0.45 * smoothstep(0.95, 1.0, fine.a) * detail;
    if (wall) c = grimed(c, shelter, blotG, weathered);
    jlean = (vec2(bh, fract(bh * 13.7)) - 0.5) * (0.07 * own);
#endif
    jointed = true;
    je = vec2(f - 3.0 * step(1.5, f), fy - step(0.5, fy));
    jfade = vec2(kx, ky);
    javg = vec2(0.05, 0.14);
    jshape = vec4(0.07 FINE_PLUS((fine.r - 0.5) * 0.05 * detail), 0.09, 0.08, 1.0);
#ifdef DETAIL
    jcol = vec3(0.52, 0.5, 0.46) * (0.85 + 0.3 * fine.a);
#else
    // (0.85 + 0.3 * 0.5 is 1 in single precision.)
    jcol = vec3(0.52, 0.5, 0.46);
#endif
    jmix = vec3(0.45, 0.95, 0.7);
    jgrain = 0.035;
    albedo = c;
    SURF_BEVEL(0.8);
    s.var *= 0.25;
  } else if (pattern == PAT_PLANKS) {
    // Boards two voxels wide with butt joints staggered per board.
    float across = uv.y * 0.5;
    float plank = floor(across);
    float ph = hash13(vec3(plank, layer, 5.0));
    float along = uv.x + ph * 31.0;
    float seg = floor(along / 24.0);
    float ky = jres.y;
    float tint = mix(0.5, hash13(vec3(plank, seg, layer + 9.0)), ky);
    // (The grain only while it shows: beyond that its lookup is not taken.)
    vec3 c = albedo * (0.8 + 0.34 * tint);
#ifdef DETAIL
    float grain = detail > 0.0 ? detailGrad(vec2(along * 0.021, across * 0.83 + ph), gx * vec2(0.021, 0.415), gy * vec2(0.021, 0.415)).g : 0.5;
    c *= 0.88 + 0.24 * mix(0.5, grain, detail);
#endif
    // Boards are not one sheet: a gap between them that the next board's
    // edge shades, each board leaning and cupped a little, its grain raised.
    float af = fract(along / 24.0), cf = fract(across);
    jointed = true;
    je = vec2((af - step(0.5, af)) * 24.0, (cf - step(0.5, cf)) * 2.0);
    jfade = vec2(jres.x, ky);
    javg = vec2(0.0, 0.05);
    jshape = vec4(0.05, 0.08, 0.06, 0.0);
    jcol = c * 0.4;
    jmix = vec3(0.4, 0.0, 0.7);
#ifdef DETAIL
    jlean = vec2(0.0, ((ph - 0.5) * 0.1 - (cf - 0.5) * 0.12) * ky);
#endif
    jgrain = 0.015;
    albedo = c;
    SURF_BEVEL(0.5);
    s.var *= 0.2;
  } else if (pattern == PAT_TILES) {
    // Square slabs, five voxels to a side, with narrow grooves.
    vec2 t = uv / 5.0;
    vec2 cell = floor(t);
    vec2 f = fract(t) * 5.0;
    vec2 k = jres;
    vec3 c = albedo * (0.88 + 0.22 * mix(0.5, hash13(vec3(cell, layer + 11.0)), k.x * k.y));
    c *= 0.92 + 0.16 * blotR FINE_PLUS((fineB - 0.5) * 0.14 * detail);
    // Slabs are laid, not printed: none lies quite level with the next,
    // the joint between them is a groove with a floor, their arrises are
    // rounded and their face is not smooth.
    jointed = true;
    je = f - 5.0 * step(2.5, f);
    jfade = k;
    javg = vec2(0.03);
    jshape = vec4(0.08, 0.06, 0.1, 0.0);
    jcol = c * 0.5;
    jmix = vec3(0.4, 0.0, 0.75);
#ifdef DETAIL
    float th = hash13(vec3(cell, layer + 4.0));
    jlean = (vec2(th, fract(th * 13.7)) - 0.5) * (0.07 * k.x * k.y);
#endif
    jgrain = 0.03;
    albedo = c;
    SURF_BEVEL(0.6);
    s.var *= 0.3;
  } else if (pattern == PAT_NOISE || pattern == PAT_RUBBLE) {
    // Mottled, gritty surfaces: stone, foliage, char, and rubble (which
    // the surface shader also lights as a heap).
    vec3 c = albedo * (0.82 + 0.36 * blotch);
#ifdef DETAIL
    c *= 1.0 + (fineB - 0.5) * 0.3 * detail;
    if (wall && !granular) {
      c *= 1.0 - 0.22 * weathered * smoothstep(0.52, 0.85, streak);
      c = grimed(c, shelter, streak, weathered);
    }
#endif
    // (Foliage: the table's leaf is a paint-box green too.)
    albedo = granular && pattern == PAT_NOISE ? c * vec3(1.0, 0.74, 1.04) : c;
#ifdef DETAIL
    if (!granular) relief = 0.05;
#endif
    SURF_BEVEL(granular ? 0.45 : 1.0);
    if (pattern == PAT_RUBBLE) s.var *= 0.25;
  } else if (pattern == PAT_SOIL) {
    // Bare earth and gravel: dry and damp patches a few metres across,
    // clods, and stones that catch the light.
#ifdef DETAIL
    float patches = blotR * 0.5 + big.r * 0.5;
#else
    float patches = blotR;
#endif
    vec3 c = albedo * mix(vec3(1.13, 1.08, 1.0), vec3(0.8, 0.78, 0.78), smoothstep(0.3, 0.75, patches));
#ifdef DETAIL
    // (Clods here and smooth earth there, and the stones in drifts, by
    // the broad noise: the fine noise repeats every third of a metre, and
    // at one strength all over bare ground it is a lattice of dark blots.)
    c *= 1.0 + ((fine.r - 0.5) * 0.5 + (fineB - 0.5) * 0.25) * (0.12 + 0.6 * smoothstep(0.4, 0.75, blot.b)) * detail;
    c = mix(c, vec3(0.42, 0.4, 0.36) * (0.7 + 0.6 * fineG), 0.6 * smoothstep(0.8, 0.95, fine.a + (blotG - 0.5) * 0.3) * detail);
    relief = 0.07;
#endif
    albedo = c;
    SURF_ROUGH(1.0);
    SURF_BEVEL(0.3);
    s.var *= 0.5;
  } else if (pattern == PAT_GRAIN) {
    // Wood grain: along a member's length where the quad says which way
    // that is, otherwise up posts and trunks and along x on a floor.
#ifdef DETAIL
    bool up = quad.y > quad.x * 1.9 || (wall && quad.x <= quad.y * 1.9);
    vec2 across = up ? uv : uv.yx, dx = up ? gx : gx.yx, dy = up ? gy : gy.yx;
    float grain = detail > 0.0 ? detailGrad(vec2(across.x * 0.37 + layer * 0.13, across.y * 0.023), dx * vec2(0.37, 0.023), dy * vec2(0.37, 0.023)).g : 0.5;
    albedo *= 0.8 + 0.4 * mix(0.5, grain, detail);
    if (s.rough > 0.9 && up) {
      // Bark (wood that is quite matt): furrowed, dark in the furrow, the
      // ridges leaning to either side.
      albedo *= 0.72 + 0.56 * mix(0.5, grain, detail);
      s.tilt.x = (grain - 0.5) * 0.9 * detail;
    }
#endif
    albedo *= 0.94 + 0.12 * blotR;
    SURF_BEVEL(0.6);
  } else if (pattern == PAT_EMBER) {
    // Burning material (material::PAT_EMBER, the fire system's embers):
    // char with seams that glow. The heat lies in the material and not in
    // its voxels: patches a few voxels across (the broad noise, the same
    // on every layer), breathing in slow waves that cross them. A level
    // and a pace of its own for every voxel is a board of orange and
    // yellow squares.
    // Emission follows the albedo, so dark here is dark there as well.
    float vh = blotG;
    float t = uCamPos.w;
    float beat = 0.5 + 0.5 * sin(t * 6.5 + blot.b * 12.0) * sin(t * 1.7 + blot.a * 7.0);
    // (The broad noise carries the dark between the glow; the fine one
    // only frays it. Half and half, what burns was one marmalade orange.)
    float seam = mix(blotR, blotR * 0.8 + fineB * 0.2, detail);
    float heat = clamp(smoothstep(0.28, 0.8, seam * 0.6 + vh * 0.4) * (0.35 + 0.85 * beat) + 0.06, 0.0, 1.2);
    // (Leaf alight is not a log alight: a hedge or a crown burning is
    // black twigs and curled leaf with sparks in it and flame standing
    // over it, not a slab of one gold. A third of what a timber's embers
    // glow, in the patches that are hot, and char elsewhere; which sprays
    // of it are the sparks, the crown's own shading says.)
    if (granular) heat = clamp(smoothstep(0.4, 0.85, seam * 0.6 + vh * 0.4) * 0.3 * (0.35 + 0.85 * beat) + 0.015, 0.0, 1.2);
    albedo = albedo * mix(granular ? 0.02 : 0.05, 1.0, heat) + vec3(0.0, 0.2, 0.02) * heat * heat * heat;
    SURF_ROUGH(1.0);
    SURF_BEVEL(0.3);
    s.var = 0.0;
  } else if (pattern == PAT_TURF) {
    // Turf. Near, the blades: fine streaks leaning two ways and a speckle
    // of tips. Far, a calm lawn: broad patches from lush to dry and the
    // stripes a mower leaves, and next to none of the per-voxel jitter
    // that makes a lawn a chequerboard.
    float lush = blotR * 0.6 + blotG * 0.4;
    vec3 green = albedo * mix(${TURF_DRY}, ${TURF_LUSH}, smoothstep(0.2, 0.8, lush));
    // (A step one voxel high in a lawn as it was laid is the lawn sloping,
    // not a cut bank: grass like the ground above and below it. Soil shows
    // where the bank is higher, and where the turf is broken.)
    if (wall && (quad.y > 1.5 || weathered < 0.5)) {
      // The side of a sod: soil under a ragged lip of grass.
#ifdef DETAIL
      float lip = mix(0.35, smoothstep(0.55, 0.8, fract(uv.y) + (fineG - 0.5) * 0.3 * detail), resolved(1.0, fw.y));
#else
      float lip = 0.35;
#endif
      albedo = mix(vec3(0.139, 0.074, 0.03) * (0.75 + 0.5 * blotR), green * 0.82, lip);
      SURF_BEVEL(0.45);
    } else {
#ifdef DETAIL
      float near = 1.0 - smoothstep(0.06, 0.3, aa);
      vec2 lean = vec2(uv.x * 0.8 + uv.y * 0.6, uv.y * 0.8 - uv.x * 0.6);
      vec2 lx = vec2(gx.x * 0.8 + gx.y * 0.6, gx.y * 0.8 - gx.x * 0.6), ly = vec2(gy.x * 0.8 + gy.y * 0.6, gy.y * 0.8 - gy.x * 0.6);
      vec4 blades = near > 0.0 ? detailGrad(vec2(lean.x * 0.21, lean.y * 0.043) + layer * 0.31, lx * vec2(0.21, 0.043), ly * vec2(0.21, 0.043)) : vec4(0.5);
      green *= 1.0 + ((blades.b - 0.5) * 0.7 + (blades.a - 0.5) * 0.35 + (fineB - 0.5) * 0.2) * near;
      // Mown in stripes eight voxels wide, until they are too fine to show.
      green *= 1.0 + 0.045 * sin(uv.y * 0.3927) * (1.0 - smoothstep(2.0, 6.0, fw.y));
#endif
      albedo = green;
      SURF_BEVEL(0.2);
    }
    s.var *= 0.22;
  } else if (pattern == PAT_TARMAC) {
    // Tarmac: black binder with pale chippings showing through, patches
    // worn lighter, and the odd crack sealed with tar.
#ifdef DETAIL
    vec3 c = albedo * (0.84 + 0.32 * blotch);
    c = mix(c, c * 2.1 + 0.012, 0.42 * detail * smoothstep(0.62, 0.92, fineB));
    c *= 1.0 - 0.22 * detail * smoothstep(0.7, 0.95, fine.a);
    // Where the broad noise crosses its mid level, in the stretches a
    // finer noise picks out: hairlines that wander for a metre or two and
    // stop. (The noise climbs about 0.03 a voxel there.)
    c *= 1.0 - 0.26 * (1.0 - smoothstep(0.002, 0.004 + aa * 0.04, abs(big.g - 0.5))) * smoothstep(0.54, 0.68, blotG) * (1.0 - smoothstep(0.12, 0.5, aa));
    relief = 0.05;
#else
    vec3 c = albedo * (0.84 + 0.32 * blotR);
#endif
    albedo = c;
    SURF_BEVEL(0.35);
    s.var *= 0.5;
  } else if (pattern == PAT_CONCRETE) {
    // Cast concrete: sand grain and blowholes, and on a wall the lines the
    // formwork left (lifts of 1.5 m, panels 2.4 m long, each a tone of its
    // own, tie holes in every panel), rain streaks and grime under ledges.
#ifdef DETAIL
    vec3 c = albedo * (0.86 + 0.28 * blotch);
    c *= 1.0 + (fineB - 0.5) * 0.2 * detail;
    c *= 1.0 - 0.3 * detail * smoothstep(0.88, 0.97, fine.a);
    relief = 0.035;
#else
    vec3 c = albedo * (0.86 + 0.28 * blotR);
#endif
    float m = 0.0;
#if defined(DETAIL) && !defined(NO_BREAK) && defined(NO_INSIDE)
    if (weathered < 0.5) {
      // A break in concrete shows what it is made of: the stones of its
      // aggregate, some split and dark, some pale; and where it is
      // reinforced, the cut ends of its bars every 20 cm, rusty, each in
      // the socket it was torn in.
      float seen = resolved(0.3, aa);
      c = mix(c, c * vec3(0.66, 0.64, 0.62), smoothstep(0.56, 0.62, fine.r) * 0.8 * seen);
      c = mix(c, c * 1.22, smoothstep(0.6, 0.66, fineG) * 0.7 * seen);
      if (patBars) {
        float bar = length((fract(uv * 0.5 + 0.25) - 0.5) * 2.0);
        c = mix(c, vec3(0.2, 0.085, 0.04), (1.0 - smoothstep(0.09, 0.1 + aa, bar)) * seen);
        c *= 1.0 - 0.45 * (1.0 - smoothstep(0.1, 0.2 + aa, bar)) * smoothstep(0.08, 0.1, bar) * seen;
      }
    } else
#endif
    if (wall) {
      vec2 t = vec2(uv.x / 24.0, (uv.y - 12.0) / 15.0);
      vec2 f = fract(t), g = min(f, 1.0 - f) * vec2(24.0, 15.0);
      vec2 k = jres;
      m = max(lineMask(g.x, 0.045, fw.x) * k.x, lineMask(g.y, 0.045, fw.y) * k.y);
      c *= 0.93 + 0.14 * mix(0.5, hash13(vec3(floor(t), layer + 21.0)), k.x * k.y);
#ifdef DETAIL
      vec2 tie = abs(vec2(fract(t.x * 2.0), fract(t.y)) - 0.5) * vec2(12.0, 15.0);
      c *= 1.0 - 0.5 * (1.0 - smoothstep(0.16, 0.26 + aa, length(tie))) * resolved(0.6, aa);
      c *= 1.0 - 0.2 * weathered * smoothstep(0.5, 0.85, streak);
      c = grimed(c, shelter, streak, weathered);
#endif
    }
    albedo = c * (1.0 - 0.3 * m);
    s.cavity = 1.0 - 0.3 * m;
    SURF_BEVEL(0.7);
  } else if (pattern == PAT_METAL) {
    // Rolled and pressed metal: never quite flat or evenly worn, so that
    // what it mirrors and the sun's highlight break across it.
    albedo *= 0.95 + 0.1 * blotR;
#ifdef DETAIL
    // (From the two taps every pattern has: metal takes none of its own.)
    float brush = (fineG - 0.5) * detail;
    albedo *= 1.0 + brush * 0.1;
    s.rough = clamp(s.rough + brush * 0.08 + (blotG - 0.5) * 0.1, 0.05, 1.0);
    // (Slight: what a mirror shows flips between sky and ground with the
    // lean, and more than this reads as pitting, not as sheet.)
    s.tilt = (blot.rg - 0.5) * 0.025;
#endif
    SURF_BEVEL(0.5);
  } else {
    albedo *= 0.96 + 0.08 * blotR;
#ifdef DETAIL
    if (wall) albedo = grimed(albedo, shelter, blotG, weathered);
#endif
    SURF_ROUGH(clamp(s.rough + (blotG - 0.5) * 0.12, 0.04, 1.0));
    SURF_BEVEL(1.0);
  }
  if (jointed) {
    float w = jshape.x;
    vec2 open = lineMask(abs(je), w, fw);
    vec2 mm = mix(javg, open, jfade);
    float m = max(mm.x, mm.y);
    vec3 face = albedo;
#if defined(DETAIL) && !defined(NO_RELIEF)
    // In relief only while a joint has pixels: a wall across the street, a
    // broken face and a debris piece skip all of it.
    vec2 rk = resolved(0.4, fw) * weathered;
    if (rk.x + rk.y > 0.0) {
      // A joint cut square into the face, half-width w and depth jd
      // (voxels), seen and lit at a slant: its floor slides under the near
      // edge, the side of what lies beyond it comes into view, and the edge
      // on the sun's side lays its shadow across the floor. je: the pixel's
      // offset from the joint's centre line; fw: the size of a pixel.
      // (Worked here for the two directions at once, u's joints in x and
      // v's in y, and not in a function called once for each: one copy of
      // the working, no copies of its arguments, and the joint's own mask
      // is open, above, not asked for again.)
      vec2 jd = jshape.y * rk;
      vec2 es = je - jd * patEye;
      vec2 bed = open * lineMask(abs(es), w, fw);
      vec2 reach = jd * abs(patSun);
      vec2 jsun = smoothstep(reach - fw - 1e-4, reach + fw + 1e-4, w - clamp(es, -w, w) * sign(patSun));
      // The wall faces the eye's side: lit when the sun is on that side too,
      // as far down as the opposite edge lets the sun in.
      vec2 deep = (w + je * sign(patEye)) / max(abs(patEye), 1e-3);
      vec2 jwall = step(0.0, patSun * patEye) * min(abs(patSun), 2.5) * (1.0 - smoothstep(1.4 * w, 2.6 * w, deep * abs(patSun)));
      // x: the share of the pixel that is the joint's floor; y: the share
      // that is the wall beyond; z: the sun on the floor; w: the sun on
      // that wall (both as a multiple of what the face itself gets).
      vec4 ju = vec4(bed.x, open.x - bed.x, jsun.x, jwall.x);
      vec4 jv = vec4(bed.y, open.y - bed.y, jsun.y, jwall.y);
      ju.xy *= 1.0 - open.y * jfade.y * jshape.w;
      mm = mix(javg, vec2(ju.x, jv.x), jfade);
      m = max(mm.x, mm.y);
      vec2 side = vec2(ju.y, jv.y) * jfade;
      s.lit = max((1.0 - ju.x * jfade.x * (1.0 - ju.z)) * (1.0 - jv.x * jfade.y * (1.0 - jv.z)) + side.x * (ju.w - 1.0) + side.y * (jv.w - 1.0), 0.0);
      vec2 arris = (1.0 - open) * (1.0 - smoothstep(vec2(w), w + jshape.z + fw, abs(je)));
      s.tilt = -sign(je) * arris * rk * 0.5;
      relief = jgrain * (1.0 - m);
      face = mix(face, face * jmix.z, max(side.x, side.y) * (1.0 - m));
    }
    s.tilt += jlean * (1.0 - m);
#endif
    // (In a break the joints are half as plain: mortar and brick are
    // both rough and dusted there, and the break's small faces each
    // outlined by a pale bed are a drawing of cubes.)
    m *= 0.45 + 0.55 * weathered;
    albedo = mix(face, jcol, m);
    s.cavity = 1.0 - jmix.x * m;
    SURF_ROUGH(mix(s.rough, jmix.y > 0.0 ? jmix.y : s.rough, m));
  }
#if defined(DETAIL) && !defined(NO_RELIEF)
  // (Less of it the lower the sun stands to the face: a relief of
  // millimetres under a raking sun is as loud as the joints, and its noise
  // repeats: a road at dusk was rippled like water, a yard of soil woven.)
  if (relief * detail > 0.0) s.tilt -= fineSlope(dfine * detail, gx, gy) * (relief / (1.0 + 0.3 * dot(patSun, patSun)));
#endif
  // The material's variation of tone (the palette's fourth byte, what a
  // pattern left of it), carried by noise that does not know the voxels.
  albedo *= 1.0 + ((blotG - 0.5) * 0.8 FINE_PLUS((fine.r - 0.5) * 0.6)) * s.var;
  // Out in the weather everything greys: dust, soot and lichen lie on a
  // face that has stood for years, and what a photograph shows of a brick
  // wall is a fifth less red than a brick broken open. (A broken face keeps
  // the material's own colour; so does what glows.)
  if (pattern != PAT_EMBER) albedo = mix(albedo, vec3(dot(albedo, vec3(0.3, 0.55, 0.15))) * vec3(1.03, 1.0, 0.94), 0.2 * weathered);
  s.albedo = albedo;
}
`;

export const SURFACE = `
${PATTERN}
#ifdef FINE
// Shading normal of a fine quad (render_detail.js). n: its face normal;
// g: the occupancy gradient interpolated from its corners (body axes, zero
// where the surface is flat); p: position in pattern space (voxels); open:
// the open side of its voxel; depth: how far under the surface on that
// side (voxels).
vec3 fineNormal(vec3 n, vec3 g, vec3 p, vec3 open, float depth, float fresh, inout Surf s) {
  // No voxel-edge chamfer inside a break.
  s.bevel = 0.0;
  // The deeper under the surface, the less of the sky a broken face sees.
  s.cavity *= 1.0 / (1.0 + 0.5 * fresh * depth);
  float len = length(g);
  vec3 slope = len > 0.05 ? g / len : n;
  // Mostly the slope; the face keeps a say so flat parts stay flat, and
  // the open side one so the floor of a pit does not turn its back.
  vec3 m = normalize(n * 0.35 + slope * 0.8 + open * 0.55);
  // Grain below the sub-cell: broken stone is not smooth at any scale.
  vec3 q = p * 4.0;
  vec4 grain = texture(uNoise, (abs(n.x) > 0.5 ? q.zy : (abs(n.y) > 0.5 ? q.xz : q.xy)) * 0.11);
  vec3 t1 = abs(n.y) > 0.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 t2 = cross(n, t1);
  return normalize(m + (t1 * (grain.r - 0.5) + t2 * (grain.g - 0.5)) * (0.5 * fresh));
}
#endif
uniform sampler3D uOcc;
uniform sampler3D uSkyVis;
uniform usampler3D uSolid0;  // one bit per voxel: solid when the scene was built

// Was this voxel (coordinates of the scene as built) solid then?
bool wasSolid(ivec3 v) {
  ivec3 size = textureSize(uSolid0, 0); // bytes along x, then z, then y
  if (v.x < 0 || v.y < 0 || v.z < 0 || v.x >= size.x * 8 || v.z >= size.y || v.y >= size.z) return false;
  return ((texelFetch(uSolid0, ivec3(v.x >> 3, v.z, v.y), 0).r >> uint(v.x & 7)) & 1u) != 0u;
}

// What destruction made of a face. fresh: it looks into space that used to
// be solid, so it is a fracture surface. loose: its voxel lies where there
// was air, so it was dropped there (rubble). vc: the voxel in scene
// coordinates, n: the face normal there.
// built: the voxel is where it was when the scene was built, so the as-built
// bits around it say where its real edges are.
void exposure(vec3 vc, vec3 n, bool traced, bool body, int pattern, out float fresh, out float loose, out bool built) {
  fresh = 0.0;
  built = false;
  // The rubble materials: what broken matter comes back as wherever it
  // lands, a heap by nature.
  loose = pattern == PAT_RUBBLE ? 1.0 : 0.0;
  if (!traced) return;
  ivec3 v = ivec3(floor(vc + 0.5));
  // A voxel that was not there in the scene as built is rubble if it is
  // part of the world, and otherwise something placed, not cut out (a crate
  // that stood against a wall must not get a fracture face on that side).
  if (!wasSolid(v)) loose = body ? loose : 1.0;
  else if (wasSolid(v + ivec3(n))) fresh = 1.0;
  else built = true;
}

float occ(vec3 wp) {
  // (Single-level textures are read at level 0: no derivatives, so a tap
  // inside a branch does not force the branch to be taken by every pixel.)
  return textureLod(uOcc, wp.xzy * uOccInv.xyz, 0.0).r;
}

// The solid around p from six lookups, a quarter of a metre off along each
// axis: which way it thins out fastest (the differences, not normalised)
// and how much of it there is (mean). Every way of drawing a heap starts
// from these; they are taken once.
const float HEAP_H = 0.24;
vec3 heapTaps(vec3 p, out float mean) {
  float x0 = occ(p - vec3(HEAP_H, 0.0, 0.0)), x1 = occ(p + vec3(HEAP_H, 0.0, 0.0));
  float y0 = occ(p - vec3(0.0, HEAP_H, 0.0)), y1 = occ(p + vec3(0.0, HEAP_H, 0.0));
  float z0 = occ(p - vec3(0.0, 0.0, HEAP_H)), z1 = occ(p + vec3(0.0, 0.0, HEAP_H));
  mean = (x0 + x1 + y0 + y1 + z0 + z1) * (1.0 / 6.0);
  return vec3(x0 - x1, y0 - y1, z0 - z1);
}

// The way a heap's surface faces: the direction in which the solid around
// the point thins out fastest (g, mean: heapTaps a little off the face). n
// is the fallback where the volume is flat. depth: how far the point lies
// under the smooth surface the volume describes (metres, negative above
// it): lifting the point by it puts every voxel face of the heap on one
// mound.
vec3 heapNormal(vec3 g, float mean, vec3 n, out float depth) {
  float len = length(g);
  // The six taps average to the density at the point; the surface is where
  // it is a half, and the gradient says how far off that is.
  depth = len > 0.02 ? clamp((mean - 0.5) * (2.0 * HEAP_H) / len, -0.12, 0.12) : 0.0;
  // Never far from the face's own direction: the slope is a blur over
  // 20 cm cells and knows nothing of an overhang.
  return normalize(n * 0.6 + (len > 0.02 ? g / len : n));
}

// The mound a heap stands for, where the eye's ray meets it. The density
// volume is smooth; its level LEVEL runs through the terraces' inner
// corners, so every outer corner sticks out of it and nothing of the mound
// lies outside the cubes. wp: the point on the cube's face; n: that face;
// rd: the ray (from the eye, unit); g: heapTaps at wp. hp: where the ray
// meets the mound: back toward the eye where the face lies inside the
// mound, ahead of the face under a corner that sticks out (a march of up to
// 30 cm, in three steps: the volume's cells are 20 cm, and six steps of
// 5 cm found the same surface for three lookups more a pixel). Both are found to the same surface (by the secant through the
// last two readings), so a tread and its riser agree where they meet and
// the stone does not break along the cubes' edges. gone: the ray leaves
// through a corner without meeting the mound: the corner is not drawn.
// Whether there is a mound to stick out of is asked along the mound's own
// normal, not the face's, so that the top of a corner and its side give the
// same answer. Lookups (after the six of heapTaps): 3 inside the mound, up
// to 6 under a corner.
// on: the pixel belongs to the mound (false: rubble with no mound under it,
// which keeps its cubes).
vec3 heapSurface(vec3 wp, vec3 n, vec3 rd, vec3 g, out vec3 hp, out float depth, out bool gone, out bool on) {
  const float LEVEL = 0.58, STEP = 0.1;
  float len = length(g);
  vec3 up = len > 0.02 ? g / len : n;
  float f0 = occ(wp);
  hp = wp;
  gone = false;
  on = true;
  depth = 0.0;
  if (f0 >= LEVEL) {
    // How fast the heap thickens along the ray (per metre): the first guess.
    float along = -dot(g, rd) / (2.0 * HEAP_H);
    if (along > 0.25) {
      float t1 = max((LEVEL - f0) / along, -0.25);
      float f1 = occ(wp + rd * t1);
      float t2 = f0 - f1 > 1e-3 ? clamp(t1 + (LEVEL - f1) * t1 / (f1 - f0), -0.3, 0.0) : t1;
      float f2 = occ(wp + rd * t2);
      float t3 = abs(f2 - f1) > 1e-3 ? clamp(t2 + (LEVEL - f2) * (t2 - t1) / (f2 - f1), -0.3, 0.0) : t2;
      hp = wp + rd * t3;
    } else if (len > 0.02) {
      // Seen along the mound, the ray never comes out of it: the point
      // stays on the cube's face, and how far under the mound's surface
      // that lies is told, so that its light is looked up from above the
      // terraces and not from among them (a lattice of black pits where
      // the sun rakes a crown).
      depth = clamp((f0 - LEVEL) * (2.0 * HEAP_H) / len, 0.0, 0.15);
    }
  } else {
    float t = 0.0, f = f0, f1 = f0;
    bool hit = false;
    for (int i = 0; i < 3; i++) {
      t += STEP;
      f1 = occ(wp + rd * t);
      if (f1 >= LEVEL) { hit = true; break; }
      f = f1;
    }
    if (hit) {
      // Between the last two steps, and once more from there.
      float k = STEP / max(f1 - f, 1e-3);
      float ti = t - (f1 - LEVEL) * k;
      hp = wp + rd * clamp(ti + (LEVEL - occ(wp + rd * ti)) * k, t - STEP, t);
    } else {
      // No mound met in 30 cm. Rubble on a floor slab or a thin drift over
      // a ledge has no mound in it and stays as it is. With the heap or
      // the ground deep under it: if the ray has come out into the air,
      // the corner goes and what lies behind is drawn; if it is still in
      // the heap's skin (a level look along a terrace) the mound is just
      // under the face, and the face stands for it.
      // (And only a corner goes: the mound has to lie within a hand's
      // breadth under the point. A fin of rubble standing out of a heap is
      // not in the mound and is not a corner of it either.)
      // (What stands out of the heap further than that and is no corner
      // of it, a lump laid on it, is not the mound either: it keeps its
      // faces, and its stone lies along them.)
      bool base = occ(wp - up * 0.3) >= 0.8, clear = f < 0.4;
      gone = base && clear && occ(wp - up * 0.12) >= LEVEL;
      on = base && (gone || !clear);
    }
  }
  // (The face keeps a say only where the volume's slope is weak: a fifth
  // of the face in a firm slope turns each face of a stair a little its
  // own way, and where the sun rakes the mound that draws the lattice in
  // lit and unlit faces.)
  return normalize(n * (0.2 * (1.0 - smoothstep(0.1, 0.35, len))) + up);
}

// The same for the lowest tier, at heapTaps' six lookups and no more: one
// step along the ray by the density around the point and its slope. No
// march and nothing discarded: the mound's shading and its stone, without
// its outline.
vec3 heapLean(vec3 wp, vec3 n, vec3 rd, vec3 g, float mean, out vec3 hp) {
  float len = length(g);
  float along = -dot(g, rd) / (2.0 * HEAP_H);
  hp = along > 0.25 ? wp + rd * clamp((0.5 - mean) / along, -0.2, 0.12) : wp;
  return normalize(n * (0.2 * (1.0 - smoothstep(0.1, 0.35, len))) + (len > 0.02 ? g / len : n));
}

// Ambient occlusion from the half-resolution solid-density volume. No tap
// sits closer than one density texel (0.2 m) to the surface plane: nearer
// than that the reading depends on whether the surface falls on an even or
// odd voxel, which shows up as stripes.
// AO_TAPS: 3 (contact ring), 6 (+ room ring), 9 or 13 (+ far taps).
// below: the density a quarter of a metre down the face's second axis (on
// a wall: toward its foot), one of the taps taken anyway.
float volumeAO(vec3 wp, vec3 n, vec3 t1, vec3 t2, out float below) {
#if AO_TAPS == 3
  vec3 o = wp + n * 0.26;
  below = occ(o - t1 * 0.15 - t2 * 0.26);
  float a = occ(o + t1 * 0.3) + occ(o - t1 * 0.15 + t2 * 0.26) + below;
  return clamp(1.0 - a * 0.42, 0.0, 1.0);
#else
  vec3 o = wp + n * 0.23;
  below = occ(o - t2 * 0.25);
  float a = occ(o + t1 * 0.25) + occ(o - t1 * 0.25) + occ(o + t2 * 0.25) + below;
  vec3 o2 = wp + n * 0.62;
#if AO_TAPS == 6
  float b = occ(o2 + (t1 + t2) * 0.42) + occ(o2 - (t1 + t2) * 0.42);
  return clamp(1.0 - a * 0.22 - b * 0.2, 0.0, 1.0);
#else
  float b = occ(o2 + (t1 + t2) * 0.42) + occ(o2 - (t1 + t2) * 0.42) + occ(o2 + (t1 - t2) * 0.42) + occ(o2 - (t1 - t2) * 0.42);
  float c = occ(wp + n * 1.35);
#if AO_TAPS >= 13
  vec3 o3 = wp + n * 1.1;
  float d = occ(o3 + t1 * 1.0) + occ(o3 - t1 * 1.0) + occ(o3 + t2 * 1.0) + occ(o3 - t2 * 1.0);
  return clamp(1.0 - a * 0.2 - b * 0.1 - c * 0.12 - d * 0.07, 0.0, 1.0);
#else
  return clamp(1.0 - a * 0.21 - b * 0.11 - c * 0.16, 0.0, 1.0);
#endif
#endif
#endif
}

uniform sampler2D uDyn;  // what moves, from below (render_contact.js): r height of the lowest surface, g how far outside it (0 beneath, 1 at the margin's rim), b how tall a debris piece stands (1 = a body)

// How much sky a body or a piece of debris takes from wp: 1 beneath something
// that touches it, falling to 0 as the thing hangs CONTACT_RISE above, or as
// wp lies further out beside it, or as wp lies above its top. body: wp is
// on a body's own face.
float contactShadow(vec3 wp, bool body) {
  vec2 uv = (wp.xz - uDynMap.xy) * uDynMap.z;
  vec2 m = min(uv, 1.0 - uv);
  vec3 hm = textureLod(uDyn, uv, 0.0).rgb;
  // Height of the point over the thing's underside.
  float e = wp.y - (hm.r * CONTACT_RANGE + uDynMap.w);
  float hangs = 1.0 - smoothstep(0.0, CONTACT_RISE, -e);
  // A piece whose top is below the point is not in its sky: debris on the
  // seats does not darken the car's roof. On a body the underside that is
  // found a voxel or more below is its own (a piece lying on it may have
  // sunk in a few centimetres). A body's thickness is not known: a floor
  // slab's.
  float tall = body ? 0.05 : (hm.b > 0.9 ? 0.25 : max(hm.b, 0.12));
  float level = 1.0 - smoothstep(0.5 * tall, tall, e);
  float beside = 1.0 - min(hm.g, 1.0);
  return hangs * level * beside * beside * mix(1.0, 0.8, min(hm.g * 6.0, 1.0)) * smoothstep(0.0, 0.04, min(m.x, m.y));
}

// Fraction of the sky dome visible from near the surface: 1 outdoors, falling
// toward 0 deep indoors. Sampled a full cell (0.4 m) off the surface so the
// surface's own cell never contributes.
// shelter: how much the spot is under an overhang out of doors, where grime
// gathers. The volume's second channel is what comes straight down; under
// an eave that is cut off while the rest of the dome is still half open.
// Further down the wall the dome opens up again, and indoors it never does.
float skyVisibility(vec3 wp, vec3 n, out float shelter) {
  vec3 p = wp + n * 0.44 + vec3(0.0, 0.12, 0.0);
  vec2 sv = textureLod(uSkyVis, p.xzy * uSkyVisInv.xyz, 0.0).rg;
#ifdef DETAIL
  shelter = (1.0 - sv.g) * (1.0 - smoothstep(0.5, 0.7, sv.r)) * smoothstep(0.12, 0.35, sv.r);
#else
  shelter = 0.0;
#endif
  return sv.r;
}
`;

// Post chain fragment shaders. All run on a single fullscreen triangle
// (FULLSCREEN_VS) and take their inputs on the fixed units uTex..uTex4.
import { FRAME, UTIL } from './shaders.js';
import { TONEMAP } from './render_shaders_fx.js';

// Scene colour is linear HDR, except on the 8-bit fallback target where it is
// stored square-root encoded.
const DECODE = `
#ifdef HDR_ENCODE
vec3 dec(vec3 c) { return c * c * 16.0; }
vec3 enc(vec3 c) { return sqrt(min(c, 16.0) * 0.0625); }
#else
vec3 dec(vec3 c) { return c; }
vec3 enc(vec3 c) { return c; }
#endif
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`;

// Bloom downsample: the 13-tap filter from Jimenez's "Next generation post
// processing in Call of Duty: Advanced Warfare" (five overlapping 2x2 boxes).
// The first level weights each box by 1 / (1 + luma) so a single hot pixel
// cannot turn into a flickering blob.
export const BLOOM_DOWN_FS = `
${DECODE}
uniform sampler2D uTex;
in vec2 vUv;
out vec4 oColor;
vec2 texel; // of the source; from textureSize, so no per-level uniform is needed
vec3 tap(vec2 o) { return dec(texture(uTex, vUv + o * texel).rgb); }
#ifdef KARIS
vec3 box(vec3 a, vec3 b, vec3 c, vec3 d, inout float wsum, float w) {
  vec3 m = (a + b + c + d) * 0.25;
  float k = w / (1.0 + luma(m));
  wsum += k;
  return m * k;
}
#endif
void main() {
  texel = 1.0 / vec2(textureSize(uTex, 0));
#ifdef BLOOM_CHEAP
  oColor = vec4(enc((tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0))) * 0.25), 1.0);
#else
  vec3 a = tap(vec2(-2.0, -2.0)), b = tap(vec2(0.0, -2.0)), c = tap(vec2(2.0, -2.0));
  vec3 d = tap(vec2(-2.0, 0.0)), e = tap(vec2(0.0, 0.0)), f = tap(vec2(2.0, 0.0));
  vec3 g = tap(vec2(-2.0, 2.0)), h = tap(vec2(0.0, 2.0)), i = tap(vec2(2.0, 2.0));
  vec3 j = tap(vec2(-1.0, -1.0)), k = tap(vec2(1.0, -1.0)), l = tap(vec2(-1.0, 1.0)), m = tap(vec2(1.0, 1.0));
#ifdef KARIS
  float ws = 0.0;
  vec3 s = box(j, k, l, m, ws, 0.5) + box(a, b, d, e, ws, 0.125) + box(b, c, e, f, ws, 0.125)
         + box(d, e, g, h, ws, 0.125) + box(e, f, h, i, ws, 0.125);
  oColor = vec4(enc(s / ws), 1.0);
#else
  vec3 s = (j + k + l + m) * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + e * 0.125;
  oColor = vec4(enc(s), 1.0);
#endif
#endif
}
`;

// Bloom upsample: 3x3 tent, blended additively onto the next larger level.
export const BLOOM_UP_FS = `
${DECODE}
uniform sampler2D uTex;
in vec2 vUv;
out vec4 oColor;
vec2 texel;
vec3 tap(vec2 o) { return dec(texture(uTex, vUv + o * texel).rgb); }
void main() {
  texel = 1.0 / vec2(textureSize(uTex, 0));
  vec3 s = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  oColor = vec4(enc(s * 0.0625), 1.0);
}
`;

// Final grade: bloom mix, sun shafts, exposure, filmic curve, a gentle
// split-tone and contrast lift, vignette, sRGB, and dither. Alpha carries
// luma for the anti-aliasing pass.
export const COMPOSITE_FS = `
${FRAME}
${UTIL}
${DECODE}
${TONEMAP}
uniform sampler2D uTex;   // scene
uniform sampler2D uTex2;  // bloom
uniform sampler2D uTex3;  // shafts
uniform sampler2D uTex4;  // 1x1 adapted exposure
uniform vec4 uPost;       // bloom mix, 1/bloom levels, vignette, shaft strength
uniform vec4 uGradeCool;  // rgb: what shadows are multiplied by; w: saturation
uniform vec4 uGradeWarm;  // rgb: the same for highlights; w: how much saturation the dark tones lose (night)
uniform vec4 uGradeK;     // contrast added, vignette, spare, spare
// The sun's glare: the share of the disc's own brightness at its heart and
// in the veil round it, and how fast each falls with the tangent of the
// angle from the sun.
#define GLARE_HEART 0.07
#define GLARE_HEART_FALL 16.0
#define GLARE_VEIL 0.009
#define GLARE_VEIL_FALL 3.0
in vec2 vUv;
out vec4 oColor;
#ifdef EDGE_AA
// Edge anti-aliasing inside the resolve, for the tier that cannot afford a
// pass of its own: four diagonal taps find the direction of a contrast
// edge and two more average along it (after FXAA's console variant). Works
// on the HDR scene, so lumas are compressed the way the tonemap will and
// the two taps are weighted by them: a bright sky must not eat the edge of
// a dark roof.
float aaLuma(vec3 c) {
  float l = luma(c) * uCamRight.w;
  return l / (1.0 + l);
}
vec3 sceneColor() {
  vec2 t = 1.0 / vec2(textureSize(uTex, 0));
  vec3 m = dec(texture(uTex, vUv).rgb);
  float nw = aaLuma(dec(texture(uTex, vUv + vec2(-0.5, -0.5) * t).rgb)), ne = aaLuma(dec(texture(uTex, vUv + vec2(0.5, -0.5) * t).rgb));
  float sw = aaLuma(dec(texture(uTex, vUv + vec2(-0.5, 0.5) * t).rgb)), se = aaLuma(dec(texture(uTex, vUv + vec2(0.5, 0.5) * t).rgb));
  float lm = aaLuma(m);
  float lMin = min(lm, min(min(nw, ne), min(sw, se))), lMax = max(lm, max(max(nw, ne), max(sw, se)));
  if (lMax - lMin <= max(0.03, lMax * 0.12)) return m;
  vec2 dir = vec2(-((nw + ne) - (sw + se)), (nw + sw) - (ne + se));
  float reduce = max((nw + ne + sw + se) * 0.03125, 0.0078125);
  dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -8.0, 8.0) * t;
  vec3 a = dec(texture(uTex, vUv - dir * (1.0 / 6.0)).rgb), b = dec(texture(uTex, vUv + dir * (1.0 / 6.0)).rgb);
  float wa = 1.0 - aaLuma(a), wb = 1.0 - aaLuma(b);
  return (a * wa + b * wb) / max(wa + wb, 1e-4);
}
#else
vec3 sceneColor() { return dec(texture(uTex, vUv).rgb); }
#endif
void main() {
  vec3 c = sceneColor();
#ifdef BLOOM
  c = mix(c, dec(texture(uTex2, vUv).rgb) * uPost.y, uPost.x);
#endif
#ifdef SHAFTS
  c += uSunGlow.rgb * (texture(uTex3, vUv).r * uPost.w * uFogParams.z);
#endif
#ifdef AUTO_EXPOSURE
  vec2 eye = texelFetch(uTex4, ivec2(0), 0).rg;
#ifdef SUN_GLARE
  // The sun in the view dazzles: a bright heart around its disc and a
  // faint veil over a sixth of the view, as much of both as the disc is
  // seen (the exposure pass counts it). Light added to the scene before
  // the eye's exposure, not a wash laid over the picture: it is as strong
  // as the disc is, and gone behind a roof.
  if (eye.g > 0.0) {
    vec4 sc = uViewProj * vec4(uCamPos.xyz + uSunDir.xyz * 1000.0, 1.0);
    float r = length((vUv - (sc.xy / sc.w * 0.5 + 0.5)) * 2.0 * uProj.zw);
    c += uSunGlow.rgb * (uSunCol.w * eye.g * (GLARE_HEART * exp(-r * GLARE_HEART_FALL) + GLARE_VEIL * exp(-r * GLARE_VEIL_FALL)));
  }
#endif
  c *= eye.r;
#else
  c *= uCamRight.w;
#endif
  // One curve on every tier: the picture must not change character with
  // the quality setting.
  c = tonemapFilmic(c * 1.6);
  // Grade, by the hour (the constants come from Post.finish). Day: cool
  // shadows, warm highlights, a touch more saturation and contrast, colours
  // kept clean. Golden hour: the warm and the cool pulled further apart.
  // Night: blue in the shadows, colour drained from what the moon alone
  // lights (the eye's rods see none) while lamplight keeps its warmth, and
  // less contrast added: the scene has its own.
  float l = luma(c);
  c *= mix(uGradeCool.rgb, uGradeWarm.rgb, smoothstep(0.0, 0.6, l));
  // Saturation goes to colours that have little; one that is already
  // strong (a lawn in the sun, a red door) is left as the light made it.
  float top = max(c.r, max(c.g, c.b));
  float sat = uGradeCool.w - uGradeWarm.w * (1.0 - smoothstep(0.04, 0.3, l));
  sat = mix(sat, min(sat, 1.0), (top - min(c.r, min(c.g, c.b))) / max(top, 1e-4));
  c = mix(vec3(l), c, sat);
  // Contrast on brightness alone: an S-curve on each channel pushes the
  // weakest one down and turns every strong colour toward neon.
  l = luma(c);
  c *= 1.0 + (l * (3.0 - 2.0 * l) - 1.0) * uGradeK.x;
  vec2 q = vUv - 0.5;
  c *= 1.0 - uGradeK.y * smoothstep(0.18, 0.95, dot(q, q) * 2.0);
  c = toSrgb(clamp(c, 0.0, 1.0));
  // Triangular dither, one LSB wide, kills banding in sky and fog gradients.
  float n1 = ign(gl_FragCoord.xy), n2 = ign(gl_FragCoord.xy + 37.0);
  c += (n1 + n2 - 1.0) / 255.0;
  oColor = vec4(c, dot(c, vec3(0.299, 0.587, 0.114)));
}
`;

// FXAA (after Lottes' 3.11): where the four diagonal lumas say there is an
// edge, find which way it runs, walk along it both ways to where it ends,
// and move the lookup across it by where this pixel lies between the two
// ends. Also the upscale filter when the scene is rendered below canvas
// resolution, with a contrast-adaptive sharpen on pixels that are not on an
// edge. With SHARPEN (temporal AA upstream) it only sharpens, and falls back
// to FXAA where the temporal resolve says it had no history to use.
// (It was the console variant, a blur along the edge's direction: that
// rounds the corner of each step and leaves the step, and every coping,
// kerb and road line near level was a run of steps that crawl as the eye
// moves. The blur is kept where the walk has nothing to follow, the short
// steps of a diagonal: the walk alone made a comb of a window's sill.)
// What it costs: a pixel that is not on an edge, the five lookups it had;
// one that is, eight more for its neighbours, two to fourteen along the
// edge and one for the answer, and on a short edge the four of the blur
// it had before as well.
export const FXAA_FS = `
uniform sampler2D uTex;   // tonemapped colour, luma in alpha
uniform sampler2D uTex2;  // temporal resolve: alpha says where it had no usable history
uniform vec4 uTexel;      // z = sharpen amount
in vec2 vUv;
out vec4 oColor;
// How far the walk along an edge goes at each step after the first, in
// texels (20 either way in all), and how much of a pixel a speck with no
// edge to it is blurred by (little: the surfaces' own grain is not noise).
const float FXAA_WALK[6] = float[](1.5, 2.0, 2.0, 2.0, 4.0, 8.0);
#define FXAA_SPECK 0.35
// An edge shorter than this from end to end (pixels) is a step of a
// diagonal, which the walk leaves as it is (both ends are one pixel
// away): there the lookup is blurred along the edge's direction as it
// was before, wholly below it and not at all from twice it on.
#define FXAA_SHORT 2.5
vec3 fxaa(vec4 m, vec2 t) {
  vec4 nw = texture(uTex, vUv + vec2(-0.5, -0.5) * t), ne = texture(uTex, vUv + vec2(0.5, -0.5) * t);
  vec4 sw = texture(uTex, vUv + vec2(-0.5, 0.5) * t), se = texture(uTex, vUv + vec2(0.5, 0.5) * t);
  float lMin = min(m.a, min(min(nw.a, ne.a), min(sw.a, se.a)));
  float lMax = max(m.a, max(max(nw.a, ne.a), max(sw.a, se.a)));
  if (lMax - lMin > max(0.035, lMax * 0.11)) {
    float lN = texture(uTex, vUv - vec2(0.0, t.y)).a, lS = texture(uTex, vUv + vec2(0.0, t.y)).a;
    float lW = texture(uTex, vUv - vec2(t.x, 0.0)).a, lE = texture(uTex, vUv + vec2(t.x, 0.0)).a;
    float lNW = texture(uTex, vUv - t).a, lSE = texture(uTex, vUv + t).a;
    float lNE = texture(uTex, vUv + vec2(t.x, -t.y)).a, lSW = texture(uTex, vUv + vec2(-t.x, t.y)).a;
    float lM = m.a;
    float range = max(max(lN, lS), max(max(lW, lE), lM)) - min(min(lN, lS), min(min(lW, lE), lM));
    // The edge runs along x where the brightness bends more down the
    // column than along the row.
    float bendH = abs(lNW + lSW - 2.0 * lW) + 2.0 * abs(lN + lS - 2.0 * lM) + abs(lNE + lSE - 2.0 * lE);
    float bendV = abs(lNW + lNE - 2.0 * lN) + 2.0 * abs(lW + lE - 2.0 * lM) + abs(lSW + lSE - 2.0 * lS);
    bool level = bendH >= bendV;
    float l1 = level ? lN : lW, l2 = level ? lS : lE;
    float g1 = abs(l1 - lM), g2 = abs(l2 - lM);
    bool first = g1 >= g2;
    float across = (level ? t.y : t.x) * (first ? -1.0 : 1.0);
    float lEdge = 0.5 * ((first ? l1 : l2) + lM), gate = 0.25 * max(g1, g2);
    // Along the edge, on the line between this pixel and its neighbour
    // across it.
    vec2 on = vUv + (level ? vec2(0.0, across * 0.5) : vec2(across * 0.5, 0.0));
    vec2 along = level ? vec2(t.x, 0.0) : vec2(0.0, t.y);
    vec2 u1 = on - along, u2 = on + along;
    float e1 = texture(uTex, u1).a - lEdge, e2 = texture(uTex, u2).a - lEdge;
    bool end1 = abs(e1) >= gate, end2 = abs(e2) >= gate;
    for (int i = 0; i < 6 && !(end1 && end2); i++) {
      if (!end1) { u1 -= along * FXAA_WALK[i]; e1 = texture(uTex, u1).a - lEdge; end1 = abs(e1) >= gate; }
      if (!end2) { u2 += along * FXAA_WALK[i]; e2 = texture(uTex, u2).a - lEdge; end2 = abs(e2) >= gate; }
    }
    float d1 = level ? vUv.x - u1.x : vUv.y - u1.y, d2 = level ? u2.x - vUv.x : u2.y - vUv.y;
    // Nearer one end than the other: across the edge by that much, if at
    // that end the edge turns away from this pixel's side.
    float move = ((d1 < d2 ? e1 : e2) < 0.0) != (lM < lEdge) ? 0.5 - min(d1, d2) / (d1 + d2) : 0.0;
    // A speck with no edge to follow: by how far it stands out of its
    // neighbours.
    float speck = clamp(abs((2.0 * (lN + lS + lW + lE) + lNW + lNE + lSW + lSE) * (1.0 / 12.0) - lM) / max(range, 1e-4), 0.0, 1.0);
    speck = speck * speck * (3.0 - 2.0 * speck);
    move = max(move, speck * speck * FXAA_SPECK);
    vec3 walked = texture(uTex, vUv + (level ? vec2(0.0, move * across) : vec2(move * across, 0.0))).rgb;
    float span = (d1 + d2) / (level ? t.x : t.y);
    if (span >= FXAA_SHORT * 2.0) return walked;
    vec2 dir = vec2(-((nw.a + ne.a) - (sw.a + se.a)), (nw.a + sw.a) - (ne.a + se.a));
    float reduce = max((nw.a + ne.a + sw.a + se.a) * 0.03125, 0.0078125);
    dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -8.0, 8.0) * t;
    vec4 a = 0.5 * (texture(uTex, vUv + dir * (1.0 / 3.0 - 0.5)) + texture(uTex, vUv + dir * (2.0 / 3.0 - 0.5)));
    vec4 b = a * 0.5 + 0.25 * (texture(uTex, vUv - dir * 0.5) + texture(uTex, vUv + dir * 0.5));
    return mix((b.a < lMin || b.a > lMax) ? a.rgb : b.rgb, walked, smoothstep(FXAA_SHORT, FXAA_SHORT * 2.0, span));
  }
  return m.rgb + (m.rgb - (nw.rgb + ne.rgb + sw.rgb + se.rgb) * 0.25) * uTexel.z;
}
// Unsharp mask, limited to the local range so isolated bright pixels do not ring.
vec3 sharpen(vec4 m, vec2 t) {
  vec3 a = texture(uTex, vUv + vec2(t.x, 0.0)).rgb, b = texture(uTex, vUv - vec2(t.x, 0.0)).rgb;
  vec3 c = texture(uTex, vUv + vec2(0.0, t.y)).rgb, d = texture(uTex, vUv - vec2(0.0, t.y)).rgb;
  vec3 lo = min(m.rgb, min(min(a, b), min(c, d))), hi = max(m.rgb, max(max(a, b), max(c, d)));
  return clamp(m.rgb + (m.rgb - (a + b + c + d) * 0.25) * uTexel.z, lo, hi);
}
void main() {
  vec2 t = 1.0 / vec2(textureSize(uTex, 0));
  vec4 m = texture(uTex, vUv);
#ifdef FXAA
  oColor = vec4(fxaa(m, t), 1.0);
#elif defined(SHARPEN)
  // Anti-aliasing was done temporally, except where the resolve had to
  // drop its history: a body in motion, a surface just uncovered. Those
  // pixels get the spatial filter instead of going without.
  oColor = vec4(texture(uTex2, vUv).a > 0.25 ? fxaa(m, t) : sharpen(m, t), 1.0);
#elif defined(SHOW_R)
  oColor = vec4(vec3(1.0 - m.r), 1.0);
#else
  oColor = vec4(m.rgb, 1.0);
#endif
}
`;

const VIEW = `
// View-space distance along the camera axis from a depth-buffer value.
float viewZ(float d) {
  return 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
}
// View-space position (x right, y up, z forward) of a screen point.
vec3 viewPos(vec2 uv, float z) {
  return vec3((uv * 2.0 - 1.0) * uProj.zw * z, z);
}
vec2 pack16(float v) {
  v = clamp(v, 0.0, 1.0) * 255.0;
  return vec2(floor(v) / 255.0, fract(v));
}
float unpack16(vec2 p) { return (p.x * 255.0 + p.y) / 255.0; }
const float AO_FAR = 80.0;
`;

// Screen-space ambient occlusion at half resolution (Alchemy estimator on a
// rotated spiral). Its job is to seat dynamic bodies and debris, which the AO
// volume does not contain, and to add voxel-scale contact shading. The result
// is pre-multiplied by the ambient share stored in the scene's alpha so that
// applying it darkens ambient light only, never direct sun.
export const SSAO_FS = `
${FRAME}
${UTIL}
${VIEW}
uniform sampler2D uDepth;
uniform sampler2D uTex;
in vec2 vUv;
out vec4 oColor;
void main() {
  // Depth is read at exact full-res texel centres. A half-res pixel centre
  // sits on the corner of four texels, where nearest sampling picks one at
  // random and a grazing floor reconstructs as stripes.
  ivec2 ip = ivec2(gl_FragCoord.xy) * 2;
  vec2 uv = (vec2(ip) + 0.5) * uScreen.xy;
  float d = texelFetch(uDepth, ip, 0).r;
  if (d >= 1.0) { oColor = vec4(0.0, 1.0, 1.0, 1.0); return; }
  float z = viewZ(d);
  vec3 p = viewPos(uv, z);
  // Normal from depth, taking the nearer neighbour on each axis so edges do
  // not produce slanted normals.
  vec2 tx = vec2(uScreen.x, 0.0), ty = vec2(0.0, uScreen.y);
  float zl = viewZ(texelFetch(uDepth, ip - ivec2(1, 0), 0).r), zr = viewZ(texelFetch(uDepth, ip + ivec2(1, 0), 0).r);
  float zd = viewZ(texelFetch(uDepth, ip - ivec2(0, 1), 0).r), zu = viewZ(texelFetch(uDepth, ip + ivec2(0, 1), 0).r);
  vec3 dx = abs(zl - z) < abs(zr - z) ? p - viewPos(uv - tx, zl) : viewPos(uv + tx, zr) - p;
  vec3 dy = abs(zd - z) < abs(zu - z) ? p - viewPos(uv - ty, zd) : viewPos(uv + ty, zu) - p;
  vec3 n = normalize(cross(dy, dx));
  const float R = 0.42;
  // Radius in uv, capped so close-ups do not sample half the screen.
  float ruv = min(R / (2.0 * uProj.w * z), 0.08);
  vec2 rs = vec2(ruv * uProj.w / uProj.z, ruv);
  float rot = ign(gl_FragCoord.xy) * 6.2831853;
  float occ = 0.0;
  for (int i = 0; i < SSAO_TAPS; i++) {
    float a = rot + float(i) * 2.3999632;
    float rr = sqrt((float(i) + 0.5) / float(SSAO_TAPS));
    ivec2 sp = ivec2(clamp(uv + vec2(cos(a), sin(a)) * rr * rs, 0.0, 0.9999) * uScreen.zw);
    float sz = viewZ(texelFetch(uDepth, sp, 0).r);
    vec3 v = viewPos((vec2(sp) + 0.5) * uScreen.xy, sz) - p;
    float vv = dot(v, v);
    occ += max(dot(v, n) - 0.012 * z - 0.01, 0.0) / (vv + 0.006) * max(1.0 - vv / (R * R), 0.0);
  }
  float ao = clamp(occ * (0.95 / float(SSAO_TAPS)), 0.0, 1.0);
  ao *= 1.0 - smoothstep(25.0, 45.0, z);
#ifdef AO_SHARE
  ao *= texture(uTex, vUv).a;
#else
  ao *= 0.6;
#endif
  oColor = vec4(ao, pack16(z / AO_FAR), 1.0);
}
`;

// 3x3 depth-aware blur that removes the rotation noise without bleeding
// across silhouettes.
export const SSAO_BLUR_FS = `
${FRAME}
${VIEW}
uniform sampler2D uTex;
in vec2 vUv;
out vec4 oColor;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 m = texelFetch(uTex, c, 0);
  float zc = unpack16(m.gb);
  float sum = m.r, ws = 1.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      if (i == 0 && j == 0) continue;
      vec4 s = texelFetch(uTex, c + ivec2(i, j), 0);
      float dz = (unpack16(s.gb) - zc) / max(zc, 1e-4);
      float w = 1.0 / (1.0 + dz * dz * 900.0);
      sum += s.r * w;
      ws += w;
    }
  }
  oColor = vec4(sum / ws, m.gb, 1.0);
}
`;

// Multiplies the blurred AO into the scene (blend: dst * (1 - src)).
// With AO_BILATERAL the four nearest half-res texels are weighted by depth
// agreement so occlusion does not halo around foreground edges.
export const SSAO_APPLY_FS = `
${FRAME}
${VIEW}
uniform sampler2D uTex;
uniform sampler2D uDepth;
in vec2 vUv;
out vec4 oColor;
void main() {
#ifdef AO_BILATERAL
  float z = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r) / AO_FAR;
  vec2 h = gl_FragCoord.xy * 0.5 - 0.25;
  ivec2 b = ivec2(floor(h));
  vec2 f = fract(h);
  float sum = 0.0, ws = 1e-4;
  for (int k = 0; k < 4; k++) {
    ivec2 o = ivec2(k & 1, k >> 1);
    vec4 s = texelFetch(uTex, b + o, 0);
    float dz = (unpack16(s.gb) - z) / max(z, 1e-5);
    float w = (o.x == 1 ? f.x : 1.0 - f.x) * (o.y == 1 ? f.y : 1.0 - f.y) / (1.0 + dz * dz * 900.0);
    sum += s.r * w;
    ws += w;
  }
  oColor = vec4(vec3(sum / ws), 0.0);
#else
  oColor = vec4(vec3(texture(uTex, vUv).r), 0.0);
#endif
}
`;

// Volumetric sun shafts: a short ray march through the whole-world shadow
// cascade at quarter resolution, accumulating fog that is actually lit.
export const SHAFT_FS = `
${FRAME}
${UTIL}
${VIEW}
uniform sampler2DShadow uShadow;
uniform sampler2D uDepth;
in vec2 vUv;
out vec4 oColor;
void main() {
  float depth = texture(uDepth, vUv).r;
  // The sky already carries its own scattering: march only a short stretch
  // of air in front of it.
  float z = depth >= 1.0 ? 24.0 : min(viewZ(depth), 70.0);
  vec2 q = vUv * 2.0 - 1.0;
  vec3 dir = uCamFwd.xyz + uCamRight.xyz * (q.x * uProj.z) + uCamUp.xyz * (q.y * uProj.w);
  float tMax = z * length(dir);
  dir = normalize(dir);
  int ci = int(uShadowParams.w) - 1;
  mat4 m = uShadowMat[ci];
  vec3 s0 = (m * vec4(uCamPos.xyz, 1.0)).xyz;
  vec3 ds = (m * vec4(dir, 0.0)).xyz;
  float cw = 1.0 / uShadowParams.w;
  float dt = tMax / float(SHAFT_STEPS);
  float t = dt * ign(gl_FragCoord.xy);
  float acc = 0.0;
  for (int i = 0; i < SHAFT_STEPS; i++) {
    vec3 s = s0 + ds * t;
    float lit = 1.0;
    if (s.x > 0.002 && s.x < 0.998 && s.y > 0.002 && s.y < 0.998) lit = texture(uShadow, vec3((s.x + float(ci)) * cw, s.y, min(s.z, 1.0)));
    acc += lit * exp(-uFogParams.x * (uCamPos.y + dir.y * t - uFogParams.y));
    t += dt;
  }
  float sd = max(dot(dir, uSunDir.xyz), 0.0);
  float sd2 = sd * sd;
  float phase = 0.012 + sd2 * 0.25 + sd2 * sd2 * sd2 * 0.75;
  oColor = vec4(vec3(min(acc * dt * uFog.w * phase, 1.0)), 1.0);
}
`;

// Separable 5-tap Gaussian for the shaft buffer (direction in uTexel.xy).
export const BLUR5_FS = `
uniform sampler2D uTex;
uniform vec4 uTexel;
in vec2 vUv;
out vec4 oColor;
void main() {
  vec2 d = uTexel.xy;
  oColor = texture(uTex, vUv) * 0.375 + (texture(uTex, vUv - d) + texture(uTex, vUv + d)) * 0.25
         + (texture(uTex, vUv - d * 2.0) + texture(uTex, vUv + d * 2.0)) * 0.0625;
}
`;

// Eye adaptation without a readback: log-average luminance of the smallest
// bloom level, eased toward over time, kept in a 1x1 float texture that the
// composite samples. METER_SCENE: there is no bloom pyramid and uTex is the
// scene itself, metered on a finer grid of taps (this pass is one pixel).
export const EXPOSURE_FS = `
${DECODE}
uniform sampler2D uTex;   // smallest bloom level
uniform sampler2D uTex2;  // previous exposure
#ifdef METER_SCENE
const int TAPS = 12;
#else
const int TAPS = 4;
#endif
uniform vec4 uAdapt;      // blend factor when closing, open-sky exposure, adaptation strength, key
uniform vec4 uRange;      // lowest and highest exposure (multiples of the open-sky one), blend factor when opening, brightest a pool of light may come out
#ifdef SUN_GLARE
${FRAME}
uniform sampler2D uTex3;  // the scene
// The brightest the scene's sun disc need be to count as seen.
#define GLARE_SEES 6.0
#endif
out vec4 oColor;
void main() {
  float prev = texelFetch(uTex2, ivec2(0), 0).r;
  if (isnan(prev) || isinf(prev) || prev <= 0.0) prev = uAdapt.y;
  // No tap counts for more than this: a fireball in the view for a third
  // of a second is not what the eye should set itself by, or the frame
  // pumps dark and back with every blast.
  float cap = 4.0 / prev;
  // For the brightest part of the view the cap is lower still: a few taps
  // that land on lamps themselves must not close the eye, and would do so
  // further with every frame (the lower the exposure, the more a capped tap
  // counts). At 2.5 times the ceiling, taps over it only bring the
  // exposure down once they are more than a fortieth of the view.
  float capHot = 2.5 * uRange.w / prev;
  float sum = 0.0, lin = 0.0, hot = 0.0, ws = 0.0;
  for (int j = 0; j < TAPS; j++) {
    for (int i = 0; i < TAPS; i++) {
      vec2 uv = (vec2(float(i), float(j)) + 0.5) / float(TAPS);
      // Weight the middle of the view over its edges.
      float w = (i == 0 || i == TAPS - 1 || j == 0 || j == TAPS - 1) ? 0.5 : 1.0;
      float l = min(luma(dec(texture(uTex, uv).rgb)), cap);
      sum += log(max(l, 1e-4)) * w;
      lin += l * w;
      float l2 = min(l, capHot);
      l2 *= l2;
      hot += l2 * l2 * w;
      ws += w;
    }
  }
  // The log average is what a mostly dark view with a pool of lamplight in
  // it reads as dark, and then burns the pool out: a share of the plain
  // average keeps what is lit in range.
  float metered = max(exp(sum / ws), 0.3 * lin / ws);
  // Adapt only part of the way (shade should still read as shade) and
  // within a limited range around the exposure for open sky.
  float ratio = uAdapt.w / (metered * uAdapt.y);
  float target = uAdapt.y * clamp(pow(ratio, uAdapt.z), uRange.x, uRange.y);
  // And never so far open that the brightest part of the view (the fourth
  // power mean follows the lit tenth of it) comes out above uRange.w: the
  // paving under a row of lamps keeps its joints.
  target = max(min(target, uRange.w / max(sqrt(sqrt(hot / ws)), 1e-4)), uAdapt.y * uRange.x);
  // This texel feeds itself every frame: one bad value must not stick.
  if (isnan(target) || isinf(target)) target = uAdapt.y;
  // How much of the sun's disc is in the view, for its glare (the
  // composite reads it beside the exposure): nine taps of the scene on
  // the inner half of the disc, counted where the scene is as bright as
  // the sky draws its sun. A roof, a post or a cloud of dust in front of
  // it takes its share; out of the picture it is none. Not eased: it is
  // this frame's and nothing else's.
  float seen = 0.0;
#ifdef SUN_GLARE
  vec4 sc = uViewProj * vec4(uCamPos.xyz + uSunDir.xyz * 1000.0, 1.0);
  if (sc.w > 0.0 && uSunDir.w > 0.0) {
    vec2 uv = sc.xy / sc.w * 0.5 + 0.5;
    vec2 rad = vec2(0.0044) / uProj.zw;
    float bar = min(luma(uSunGlow.rgb) * uSunCol.w * 0.35, GLARE_SEES);
    for (int i = 0; i < 9; i++) {
      float a = float(i) * 2.399963, r = sqrt(float(i) * 0.125);
      vec2 p = uv + vec2(cos(a), sin(a)) * r * rad;
      if (p.x > 0.0 && p.x < 1.0 && p.y > 0.0 && p.y < 1.0) seen += step(bar, luma(dec(texture(uTex3, p).rgb)));
    }
    seen *= 1.0 / 9.0;
  }
#endif
  // (Closing and opening have their own pace: see the renderer.)
  oColor = vec4(mix(prev, target, target < prev ? uAdapt.x : uRange.z), seen, 0.0, 1.0);
}
`;

// Temporal anti-aliasing resolve. The scene is rendered with a sub-pixel
// jitter; each pixel's world position (from depth) is reprojected into the
// previous frame and the history found there is blended in. History is
// clamped to the colour range of the current 3x3 neighbourhood, which is what
// keeps moving bodies and particles (they have no motion vectors) from
// leaving trails: stale history simply falls outside the range and is cut.
export const TAA_FS = `
${FRAME}
${DECODE}
uniform sampler2D uTex;    // current frame
uniform sampler2D uTex2;   // history
uniform sampler2D uDepth;
uniform sampler2D uTex3;   // how far body pixels moved since the last frame, in uv (0, 0 where nothing did)
uniform vec4 uTaa;         // jitter in uv (x, y), history weight, clamp on/off
uniform vec4 uTaaMotion;   // x > 0.5: uTex3 holds this frame's body motion
in vec2 vUv;
out vec4 oColor;
// Work in a compressed range so one very bright pixel cannot dominate.
vec3 squash(vec3 c) { return c / (1.0 + luma(c)); }
vec3 expand(vec3 c) { return c / max(1.0 - luma(c), 1e-3); }
void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  vec3 cur = squash(dec(texelFetch(uTex, ip, 0).rgb));
  vec3 lo = cur, hi = cur;
  float d = texelFetch(uDepth, ip, 0).r;
  ivec2 nearest = ivec2(0);
  // uTaa.w = 0 means nothing in the world or the view changed this frame:
  // history is then exact, and skipping the clamp lets sub-pixel highlights
  // settle to their true average instead of twinkling with the jitter.
  if (uTaa.w > 0.5) {
    // Reproject using the nearest depth in a small cross so that edges carry
    // the motion of the foreground.
    for (int k = 0; k < 4; k++) {
      ivec2 o = ivec2((k & 1) * 2 - 1, (k >> 1) * 2 - 1);
      vec3 s = squash(dec(texelFetch(uTex, ip + o, 0).rgb));
      lo = min(lo, s); hi = max(hi, s);
      float dk = texelFetch(uDepth, ip + o, 0).r;
      if (dk < d) { d = dk; nearest = o; }
    }
    for (int k = 0; k < 4; k++) {
      ivec2 o = k < 2 ? ivec2(k * 2 - 1, 0) : ivec2(0, k * 2 - 5);
      vec3 s = squash(dec(texelFetch(uTex, ip + o, 0).rgb));
      lo = min(lo, s); hi = max(hi, s);
    }
  } else {
    lo = vec3(0.0);
    hi = vec3(1.0);
  }
  // Where this pixel's surface was a frame ago. The static world is found
  // from depth and the two cameras. A body in motion is not where that
  // says: the motion pass has written how far each of its pixels came, and
  // an edge takes the motion of whatever is in front there, like its depth.
  vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  vec4 pc = uPrevViewProj * vec4(wp.xyz / wp.w, 1.0);
  vec2 huv = pc.xy / pc.w * 0.5 + 0.5 + uTaa.xy;
  float w = uTaa.z;
  vec2 moved = uTaaMotion.x > 0.5 ? texelFetch(uTex3, ip + nearest, 0).rg : vec2(0.0);
  if (moved != vec2(0.0)) huv = vUv + moved + uTaa.xy;
  else if (pc.w <= 0.0) w = 0.0;
  if (huv.x < 0.0 || huv.y < 0.0 || huv.x > 1.0 || huv.y > 1.0) w = 0.0;
  vec3 hist = squash(dec(texture(uTex2, huv).rgb));
  // History feeds itself: a NaN or infinity would otherwise never leave.
  if (any(isnan(hist)) || any(isinf(hist))) hist = cur;
  vec3 kept = clamp(hist, lo, hi);
  // How much of the history the clamp threw away, against how much the
  // neighbourhood varies anyway: near 1 where something moved through.
  vec3 cut = abs(hist - kept);
  float lost = w > 0.0 ? clamp(max(cut.r, max(cut.g, cut.b)) * 6.0 - 0.15, 0.0, 1.0) : 1.0;
  oColor = vec4(enc(expand(mix(cur, kept, w))), lost);
}
`;

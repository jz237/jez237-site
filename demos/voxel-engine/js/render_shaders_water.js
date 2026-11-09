// GLSL of the water pass (render_water.js): still bodies as rectangles, moving
// water as a grid per tile, water in the air as blobs, and the frame as seen
// from under a surface.
//
// The pass draws into the scene's colour with no depth buffer attached and
// reads the scene's depth as a texture, the way the soft particles do: the
// depth test is the first thing the fragment stage does, and the same value
// says how much water the eye looks through.
//
// Defines: CASCADES, SHADOW_TAPS, SHADOW_MAX_R (as for the particles),
// HDR_ENCODE / HDR_DITHER (the scene target's encoding),
// WATER_REFRACT   a copy of the scene's colour (uScene) is there to be read:
//                 what lies under the surface is drawn bent, tinted and
//                 absorbed; without it the surface is blended over it,
// WATER_SHADOW    one tap of the sun's shadow,
// WATER_RIPPLES   2 or 3: taps of the wave texture the small waves are made of
//                 (on moving water the first two are the two phases of a flow map),
// WATER_TRACE     steps a mirrored ray takes through the density volume to
//                 find what stands over the water (0: one tap of the sky
//                 visibility instead),
// WET_MASK        the surfaces of the world draw wet ground themselves from
//                 the map of what is wet (render_water.js): the water does
//                 not darken its bed, and a film under a centimetre is not
//                 a surface at all (it comes in between 1 and 3 cm),
// WATER_OVER      (the water in the air only) drawn once more over the dust.
import { FRAME, UTIL, ATMOSPHERE, SHADOW } from './shaders.js';

// Per metre of water looked through: what is absorbed, by colour, and how
// fast the water's own colour (what its murk scatters back) builds up.
const OPTICS = `
const vec3 ABSORB = vec3(2.8, 1.05, 1.3);
const float MURK = 2.2;
const vec3 SCATTER = vec3(0.004, 0.021, 0.017);
`;

const HEAD = `
${FRAME}
${UTIL}
${ATMOSPHERE}
#ifdef WATER_SHADOW
${SHADOW}
#endif
${OPTICS}
uniform sampler2D uDepth;
uniform sampler2D uNoise;
uniform sampler2D uWaves;   // the pass's own tiling waves: slope x and z, height, foam cells (render_water.js)
uniform sampler3D uSkyVis;
#ifdef WATER_REFRACT
uniform sampler2D uScene;   // the scene's colour as it stood before the water
#endif
#if WATER_TRACE > 0
uniform sampler3D uOcc;
#endif
uniform vec4 uUnder;        // x: 1 while the camera is under a water surface
out vec4 oColor;

#ifdef HDR_ENCODE
vec3 enc(vec3 c) { return sqrt(min(c, 16.0) * 0.0625); }
vec3 dec(vec3 c) { return c * c * 16.0; }
#elif defined(HDR_DITHER)
vec3 enc(vec3 c) { return min(c, 64.0) * (0.992 + 0.016 * ign(gl_FragCoord.xy)); }
vec3 dec(vec3 c) { return c; }
#else
vec3 enc(vec3 c) { return min(c, 64.0); }
vec3 dec(vec3 c) { return c; }
#endif

float viewZ(float d) {
  return 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
}

// The sky as still water mirrors it: the gradient with the broad shapes of
// the cloud deck (one octave of the sky pass's, read at a fixed level: the
// direction comes off a rippled normal and has no usable derivative).
vec3 skyMirror(vec3 d) {
  vec3 c = skyBase(d);
  float h = max(d.y, 0.0);
  vec2 cuv = d.xz / (h + 0.12) * 0.11 + uCamPos.w * vec2(0.0016, 0.0007);
  float cover = uSkyZenith.w;
  float cl = smoothstep(1.0 - cover, 1.28 - cover, textureLod(uNoise, cuv, 1.0).r * 0.8 + 0.1) * smoothstep(0.015, 0.2, h);
  return mix(c, (uSunCol.rgb * 0.16 + uAmbSky.rgb * 0.75) * uSkyHorizon.w, cl * 0.8);
}

// What stands over the water where no picture of it is to be had: banks and
// walls in the light of the day.
vec3 bankColor(float sun) {
  return mix(uGround.rgb, vec3(0.2, 0.19, 0.18), 0.85) * (uSunCol.rgb * (sun * 0.45) + uAmbSky.rgb * 0.7);
}
`;

// Everything a point of a water surface needs to become a colour.
// p: the point; ng: the surface there without its small waves (unit, the
// side the air is on); n: with them; zw: its view depth; dv: depth of water
// under the point (m);
// film: 1 where there is a surface, falling to 0 at a wet edge; foam: 0..1,
// how much of it is white (a little is lace, a lot a sheet with pores);
// grain: noise in 0..1 the foam is cut from;
// caust: the net of light the waves throw on the bed, 0..1 (lines near 1).
// Returns premultiplied colour and coverage.
const SHADE = `
vec4 shadeWater(vec3 p, vec3 ng, vec3 n, float zw, float dv, float film, float foam, float grain, float caust) {
  vec3 toCam = uCamPos.xyz - p;
  float dist = length(toCam);
  vec3 v = toCam / max(dist, 1e-4);
  // Seen from underneath. With the camera in the water that is the surface
  // overhead; with it in the air it is the far side of a wave, which the
  // near side hides.
  bool below = dot(ng, v) < 0.0;
  if (below && uUnder.x < 0.5) discard;
  if (below) { n = -n; ng = -ng; }
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec2 uv = gl_FragCoord.xy * uScreen.xy;

  // Light at the surface: the sun through one tap of the shadow atlas, the
  // sky by how much of it the place can see.
  float sv = textureLod(uSkyVis, (p + vec3(0.0, 0.45, 0.0)).xzy * uSkyVisInv.xyz, 0.0).r;
  float sh = 0.0;
  if (uSunCol.r + uSunCol.g > 1e-4) {
#ifdef WATER_SHADOW
    sh = uSunDir.w > 0.0 ? sunShadow(p, vec3(0.0, 1.0, 0.0), max(uSunDir.y, 0.05), ign(gl_FragCoord.xy), 0.0) : 1.0;
#else
    sh = smoothstep(0.15, 0.6, sv);
#endif
  }
  vec3 sunIn = uSunCol.rgb * (sh * max(uSunDir.y, 0.0));
  vec3 lightIn = sunIn * 0.6 + uAmbSky.rgb * (0.25 + 0.75 * sv);
  // (Foam is not one white: it lies on the waves and the sun rakes it, and
  // the grain it is cut from shades it.)
  vec3 foamCol = vec3(0.82, 0.85, 0.86) * (sunIn * clamp(0.62 + 1.1 * (dot(n, uSunDir.xyz) - uSunDir.y), 0.3, 0.9) + uAmbSky.rgb * (0.3 + 0.7 * sv)) * (0.66 + 0.34 * grain);
  // A film over rough ground is not yet a mirror: the ground's grain stands
  // through it. From a finger deep the surface is the water's own.
  float gloss = 0.4 + 0.6 * smoothstep(0.003, 0.03, dv);

  if (below) {
    // Inside Snell's window the world above shows through, bent; outside it
    // the surface mirrors the water underneath.
    float win = 1.0 - smoothstep(0.7, 1.0, (1.0 - ndv * ndv) * 1.777);
    vec3 deep = SCATTER * lightIn * 2.0;
#ifdef WATER_REFRACT
    vec3 dn = n - ng;
    vec2 off = vec2(dot(dn, uCamRight.xyz) / uProj.z, dot(dn, uCamUp.xyz) / uProj.w) * 0.12;
    vec3 above = dec(textureLod(uScene, uv + off, 0.0).rgb);
    return vec4(enc(mix(deep, above, win * 0.92)) * film, film);
#else
    float a = (1.0 - 0.9 * win) * film;
    return vec4(enc(deep) * a, a);
#endif
  }

  float fr = 1.0 - ndv;
  float fr2 = fr * fr;
  float fres = 0.02 + 0.98 * fr2 * fr2 * fr;

  // What the surface mirrors.
  vec3 r = reflect(-v, n);
  r.y = abs(r.y) + 0.015;
  r = normalize(r);
  vec3 env = skyMirror(r);
#if WATER_TRACE > 0
  // A ray through the density volume finds the bank, the wall or the bridge
  // that stands in the sky's place; where that is on screen its picture is
  // taken from the scene, elsewhere it is a bank in the day's light.
  float t = 0.3, last = 0.0;
  bool hit = false;
  vec3 from = p + vec3(0.0, 0.22, 0.0);
  bool inside = true;
  for (int i = 0; i < WATER_TRACE; i++) {
    vec3 at = from + r * t;
    vec3 q = at.xzy * uOccInv.xyz;
    if (any(greaterThan(abs(q - 0.5), vec3(0.5)))) {
      // Past the edge of the world there is land up to the scene's ground.
      inside = false;
      hit = at.y < uGround.w;
      break;
    }
    if (textureLod(uOcc, q, 0.0).r > 0.35) { hit = true; break; }
    last = t;
    t *= WATER_GROW;
  }
  if (hit && !inside) {
    env = bankColor(sh);
  } else if (hit) {
    // Two halvings between the last free step and the first one inside.
    for (int i = 0; i < 2; i++) {
      float mid = 0.5 * (last + t);
      if (textureLod(uOcc, (from + r * mid).xzy * uOccInv.xyz, 0.0).r > 0.35) t = mid; else last = mid;
    }
    vec3 at = from + r * t;
    // In the day's light, by the sun that reaches the place.
    float lit = 0.0;
#ifdef WATER_SHADOW
    if (uSunDir.w > 0.0 && uSunCol.r + uSunCol.g > 1e-4) lit = sunShadow(at - r * 0.3, -r, 0.5, 0.5, 0.0);
#endif
    vec3 seen = bankColor(lit);
#ifdef WATER_REFRACT
    vec4 hc = uViewProj * vec4(at, 1.0);
    vec2 huv = hc.xy / max(hc.w, 1e-3) * 0.5 + 0.5;
    vec2 hm = min(huv, 1.0 - huv);
    float on = hc.w > 0.1 ? clamp(min(hm.x, hm.y) * 12.0, 0.0, 1.0) : 0.0;
    if (on > 0.0) {
      // The scene there must be the thing the ray met, not something nearer
      // or the sky behind.
      float hz = viewZ(textureLod(uDepth, huv, 0.0).r);
      on *= 1.0 - smoothstep(0.12, 0.3, abs(hz - hc.w) / hc.w);
      if (on > 0.0) seen = mix(seen, dec(textureLod(uScene, huv, 0.0).rgb), on);
    }
#endif
    env = seen;
  } else {
    env *= 0.25 + 0.75 * smoothstep(0.0, 0.35, sv);
  }
#else
  env = mix(bankColor(sh * 0.5), env, smoothstep(0.1, 0.75, sv));
#endif

  // The sun: a tight glint with a faint sheen around it; the small waves
  // break it into glitter.
  vec3 glint = vec3(0.0);
  if (sh > 0.0) {
    vec3 hv = normalize(uSunDir.xyz + v);
    float ndh = max(dot(n, hv), 0.0), vdh = 1.0 - max(dot(v, hv), 0.0);
    float vdh2 = vdh * vdh;
    // (In flat water the sun's image is the sun's size, a dot, and has
    // no sheen round it: the lobes are as wide as the small waves make
    // them. A film in a crater has none, and with the lobes of rippled
    // water the sun's image was four degrees across: from a roof the
    // whole pool was one flat white shape.)
    float rip = smoothstep(0.0, 0.06, length(n - ng));
    vec3 nxh = cross(n, hv);
    float tight = exp(-0.5 * dot(nxh, nxh) * mix(20000.0, 900.0, rip));
    glint = uSunCol.rgb * (sh * film * gloss * min((tight * 140.0 + pow(ndh, 90.0) * 5.0 * (0.15 + 0.85 * rip)) * (0.02 + 0.98 * vdh2 * vdh2 * vdh), 9.0));
  }

  // Through the water: the ray bends toward the vertical at the surface, so
  // the way down is shorter than the line of sight makes it.
  float cosT = sqrt(1.0 - (1.0 - ndv * ndv) * 0.5625);
  float path = max(dv, 0.0) / cosT;
  vec3 T = exp(-ABSORB * path);
  vec3 scat = SCATTER * lightIn * (1.0 - exp(-MURK * path));
  // A film of water wets what it lies on: darker, before it is deep enough
  // to have a colour of its own.
#ifdef WET_MASK
  float wet = 0.0;
#else
  float wet = 0.38 * film;
#endif
  float fog = fogAmount(-toCam, dist);
  // Foam: lace where there is a little, a white sheet where there is a lot.
  float white = smoothstep(0.0, 0.5, foam * 1.25 - (1.0 - grain) * 1.2) * 0.88 * film;
  // Broken water mirrors nothing.
  fres *= (1.0 - 0.9 * white) * gloss;
  glint *= 1.0 - white;
#ifdef WATER_REFRACT
  vec3 dn = n - ng;
  vec2 off = clamp(vec2(dot(dn, uCamRight.xyz) / uProj.z, dot(dn, uCamUp.xyz) / uProj.w) * (0.5 * min(dv, 1.2) / max(zw, 0.4)), -0.04, 0.04);
  // Nothing in front of the surface may be dragged into it.
  if (viewZ(textureLod(uDepth, uv + off, 0.0).r) < zw) off = vec2(0.0);
  vec3 bed = dec(textureLod(uScene, uv + off, 0.0).rgb) * (1.0 - wet);
  // Sunlight comes through the waves gathered into a net of bright lines:
  // sharpest a hand deep, washed out by a metre.
  // (Not in a film: a net of light needs waves, and a film has none.)
  bed *= 1.0 + (caust * 1.2 - 0.24) * (sh * smoothstep(0.03, 0.16, dv) * (1.0 - smoothstep(0.3, 1.2, dv)) * min(uSunDir.y * 2.5, 1.0));
  float mirror = fres * film;
  vec3 surf = scat * (1.0 - mirror) + env * mirror + glint;
  float cover = 1.0 - (1.0 - mirror) * dot(T, vec3(0.3333));
  vec3 col = bed * T * (1.0 - mirror) + mix(surf, fogColor(-v) * cover, fog);
  col = mix(col, hazed(foamCol, -v, fog), white);
  // (The bed is in the colour: where there is water at all this replaces
  // what is there. At a wet edge it comes in with the film.)
  return vec4(enc(col) * film, film);
#else
  // One blend factor for all three colours: the bed comes through by what
  // the water lets through of red, the colour it lets through least; the
  // green and blue it would still pass are added as the light of a dark
  // grey bed, so deep water is green-blue here too.
  float mirror = fres * film;
  float least = min(T.r, min(T.g, T.b));
  vec3 surf = (scat + (T - least) * (0.075 * (sunIn * 0.8 + uAmbSky.rgb * sv))) * (1.0 - mirror) + env * mirror + glint;
  float cover = 1.0 - (1.0 - mirror) * least * (1.0 - wet);
  vec3 col = mix(surf, fogColor(-v) * cover, fog);
  col = mix(col, hazed(foamCol, -v, fog), white);
  cover = mix(cover, 1.0, white);
  // (Deep water has a colour whatever the film says: where a surface is
  // faded out, a fall too tall to draw, all of it goes.)
  float a = smoothstep(0.0, 0.3, film);
  return vec4(enc(col) * a, cover * a);
#endif
}
`;

// The height a corner of a still body's rectangle is drawn at, and how far
// of that a front's crest lifts it (m). xz: the corner; level: its
// rectangle's own.
const CORNER = `
float cornerY(vec2 xz, float level, out float lift) {
  lift = 0.0;
  float y = level;
  if (uFlowInv.w > 0.0) {
    // While a swell runs down a river its rectangles are cells, each flat
    // at its own level. A corner takes the mean level of the water that
    // meets at it: the map read at the four places a cell's half width
    // off it, which are the middles of the cells round it (and lie inside
    // any larger rectangle that ends there). The cells that meet at a
    // corner so give it one height, and the surface is one surface that
    // tilts, however tall the step from one cell to the next: between two
    // cells of a body that touch there is only water. (A wall a cell
    // thick, a dam, has no water in the map where it stands: the pond
    // behind it is not a neighbour. Water a storey over or under this
    // is another body's.)
    vec2 uv = xz * uFlowInv.xy, off = 0.4 * uFlowInv.xy;
    float sum = 0.0, count = 0.0;
    for (int k = 0; k < 4; k++) {
      vec4 c = textureLod(uFlowMap, uv + off * vec2(float(k & 1) * 2.0 - 1.0, float(k >> 1) * 2.0 - 1.0), 0.0);
      float l = c.g / max(c.r, 1e-3);
      if (c.r > 0.5 && abs(l - level) < 2.0) {
        sum += l;
        count += 1.0;
      }
    }
    if (count > 0.0) {
      y += (sum / count - level) * uFlowInv.w;
      // The front of a swell: where the level falls away down the flow
      // the water behind piles up into a crest that stands over the
      // face, and the foot of the face is drawn down a little before it.
      // (The first wave of a bore does stand over the level behind it,
      // by up to the height of the step: the crest is no higher than
      // that, and only where the level bends.)
      vec4 m = textureLod(uFlowMap, uv, 2.0);
      float lv = m.g / max(m.r, 1e-3);
      vec2 fl = m.ba / max(m.r, 1e-3);
      float fs = length(fl);
      if (m.r > 0.03 && fs > 0.4) {
        vec2 st = fl / fs * 2.0 * uFlowInv.xy;
        vec4 mu = textureLod(uFlowMap, uv - st, 2.0), md = textureLod(uFlowMap, uv + st, 2.0);
        float lu = mu.r > 0.03 ? mu.g / mu.r : lv, ld = md.r > 0.03 ? md.g / md.r : lv;
        if (abs(lu - lv) < 2.0 && abs(ld - lv) < 2.0) {
          lift = clamp((lv - 0.5 * (lu + ld)) * 3.0, -0.08, min(0.5, 1.2 * (lu - ld))) * smoothstep(0.8, 1.6, fs) * uFlowInv.w;
          // (A front that travels: the level is rising here, or rose a
          // moment ago. Where the water steps down for good, through the
          // arches of a bridge, the crest and its white stood in the
          // river as two chalk lines for as long as the swell ran.)
          if (uLandInv.w > 0.0) lift *= smoothstep(0.1, 0.5, textureLod(uLanded, xz * uLandInv.xy, 0.0).b);
          y += lift;
        }
      }
    }
  }
  return y;
}
`;

// Still bodies: one quad per rectangle of a body's footprint, at its level.
export const WATER_RECT_VS = `
${FRAME}
layout(location = 0) in vec4 aRect;   // x0, z0, x1, z1 (m)
layout(location = 1) in vec4 aBody;   // level (m), the water's speed x and z there (m/s), depth at the deepest (m)
#ifdef WATER_FLOWMAP
layout(location = 2) in vec4 aHostA;  // corners 0 and 1: the edge of another rectangle each lies on (render_water.js, _junctions)
layout(location = 3) in vec4 aHostB;  // corners 2 and 3
layout(location = 4) in vec4 aHostLevel; // those rectangles' levels (m)
uniform sampler2D uFlowMap;           // the still water from above (WATER_FLOW_FS)
uniform vec4 uFlowInv;                // 1 / the map's width and depth in metres, whether the corners' edges are this frame's, how much of a swell is running (0..1)
uniform sampler2D uLanded;            // what the water has just been through (WATER_LAND_FADE_FS): b, how fast the level rises
uniform vec4 uLandInv;                // 1 / that map's width and depth in metres, -, whether there is one
${CORNER}
#endif
out vec3 vWorld;
out float vZ;
out float vPx;                        // metres a pixel is wide at this corner
out float vLift;                      // how far a front's crest stands over the level here (m)
flat out vec4 vRect;
flat out vec4 vBody;
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vec3 p = vec3(mix(aRect.x, aRect.z, c.x), aBody.x, mix(aRect.y, aRect.w, c.y));
  vLift = 0.0;
#ifdef WATER_FLOWMAP
  p.y = cornerY(p.xz, aBody.x, vLift);
  // A corner that lies part of the way along a longer edge of another
  // rectangle (a river's band that ends at a pier, against the band
  // before it that runs from bank to bank) stands where that edge is:
  // between the heights of the edge's own two ends. By its own four
  // neighbours it stood centimetres off the edge, the two rectangles
  // parted, and the bed was seen through the gap as a hairline from the
  // pier to the bank.
  if (uFlowInv.z > 0.0) {
    vec2 host = gl_VertexID < 2 ? (gl_VertexID == 0 ? aHostA.xy : aHostA.zw) : (gl_VertexID == 2 ? aHostB.xy : aHostB.zw);
    if (host.x != host.y) {
      // (Along x: the lower end first. Along z: the higher first.)
      bool alongX = host.x < host.y;
      vec2 a = alongX ? vec2(host.x, p.z) : vec2(p.x, host.y);
      vec2 b = alongX ? vec2(host.y, p.z) : vec2(p.x, host.x);
      float t = alongX ? (p.x - host.x) / (host.y - host.x) : (p.z - host.y) / (host.x - host.y);
      float level = aHostLevel[gl_VertexID], la, lb;
      float ya = cornerY(a, level, la), yb = cornerY(b, level, lb);
      p.y = mix(ya, yb, t);
      vLift = mix(la, lb, t);
    }
  }
#endif
  // The rectangles of a body meet at T-junctions, where rasterisation
  // leaves cracks. Each is drawn a little too large (two pixels, never more
  // than a column) and the fragment stage cuts it back to its true extent.
  // (Not while a swell runs: its cells share their corners, a face of a
  // front stands at any angle to the eye, and the cut by where the pixel's
  // ray meets a level plane threw out a line of the face at the eye's own
  // height, from bank to bank.)
  float px = length(p - uCamPos.xyz) * uProj.w * uScreen.y;
#ifdef WATER_FLOWMAP
  if (uFlowInv.w <= 0.0)
#endif
  p.xz += (c * 2.0 - 1.0) * min(px * 2.0, 0.1);
  vWorld = p;
  vRect = aRect;
  vBody = aBody;
  vPx = px;
  gl_Position = uViewProj * vec4(p, 1.0);
  vZ = gl_Position.w;
}
`;

export const WATER_RECT_FS = `
${HEAD}
${SHADE}
#ifdef WATER_FLOWMAP
uniform sampler2D uFlowMap;
uniform vec4 uFlowInv;
uniform vec4 uFlowStep;               // a cell's width in the map (u, v) and in metres (x, z)
uniform sampler2D uLanded;            // where water in the air has come down, from above (WATER_LAND_VS)
uniform vec4 uLandInv;                // 1 / that map's width and depth in metres, -, whether there is one
#endif
in vec3 vWorld;
in float vZ;
in float vPx;
in float vLift;
flat in vec4 vRect;
flat in vec4 vBody;
void main() {
  // Which rectangle owns this pixel: where its ray meets the body's level,
  // computed from the pixel alone, so that every rectangle of the body
  // gets the same answer to the last bit and each pixel is drawn once.
  // (While a swell tilts the surface the cells are drawn at their true
  // size and nothing is cut: the corners they share are the same to the
  // last bit, and the rasteriser gives each pixel to one of them.)
  vec2 q = gl_FragCoord.xy * uScreen.xy * 2.0 - 1.0;
  vec3 ray = uCamFwd.xyz + uCamRight.xyz * (q.x * uProj.z) + uCamUp.xyz * (q.y * uProj.w);
#ifdef WATER_FLOWMAP
  float swell = uFlowInv.w;
#else
  const float swell = 0.0;
#endif
  if (swell <= 0.0 && abs(ray.y) > 1e-5) {
    vec2 at = uCamPos.xz + ray.xz * ((vBody.x - uCamPos.y) / ray.y);
    if (at.x < vRect.x || at.x >= vRect.z || at.y < vRect.y || at.y >= vRect.w) discard;
  }
  float zs = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r);
  if (zs < vZ) discard;
  vec3 toP = vWorld - uCamPos.xyz;
  // Water under the point, as far as the scene behind the pixel can say: how
  // far below the surface the line of sight comes down.
  float sink = (zs - vZ) * abs(toP.y) / max(vZ, 1e-3);
  float dv = min(sink, vBody.w);
  float time = uCamPos.w;
  float speed = length(vBody.yz);
  vec2 slope = vec2(0.0), tilt = vec2(0.0);
  float grain = 0.5, net = 0.0, edge = 0.5, rush = 0.0;
  if (swell < 1.0) {
    // Wind ripples that drift with the body's current: two trains of waves
    // crossing each other.
    vec2 xz = vWorld.xz - vBody.yz * time;
    vec4 a = texture(uWaves, xz * 0.21 + time * vec2(0.013, 0.008));
    // (The second is carried a little by the first: no two crests alike.)
    vec4 b = texture(uWaves, vec2(xz.x * 0.8 - xz.y * 0.6, xz.x * 0.6 + xz.y * 0.8) * 0.67 + time * vec2(-0.034, 0.021) + (a.rg - 0.5) * 0.09);
    slope = (a.rg - 0.5) * 0.3 + (b.rg - 0.5) * 0.22;
#if WATER_RIPPLES > 2
    // A slow swell under them.
    slope += (texture(uWaves, xz.yx * 0.047 - time * vec2(0.004, 0.006)).rg - 0.5) * 0.2;
#endif
    grain = (1.0 - a.a) * 0.5 + b.b * 0.5;
    net = 1.0 - min(a.a, b.a);
    edge = a.b;
    slope *= 0.6 + 0.5 * min(speed, 1.5);
  }
#ifdef WATER_FLOWMAP
  if (swell > 0.0) {
    // A swell: the water's speed changes from cell to cell and from step to
    // step, so the ripples ride it for a beat at a time (the two phases of
    // a flow map), by the speed the map gives at this very place, and the
    // surface leans the way its level changes.
    vec2 uv = vWorld.xz * uFlowInv.xy;
    vec4 m = textureLod(uFlowMap, uv, 2.0);
    float has = 1.0 / max(m.r, 1e-3);
    vec2 flow = m.ba * has;
    float fast = length(flow);
    float ph = time * 0.5;
    float f0 = fract(ph), f1 = fract(ph + 0.5), mixab = abs(1.0 - 2.0 * f0);
    vec2 base = vWorld.xz * 0.21 + time * vec2(0.013, 0.008);
    vec2 turned = vec2(vWorld.x * 0.8 - vWorld.z * 0.6, vWorld.x * 0.6 + vWorld.z * 0.8) * 0.67 + time * vec2(-0.034, 0.021);
    vec2 carry = flow * 2.0, carried = vec2(carry.x * 0.8 - carry.y * 0.6, carry.x * 0.6 + carry.y * 0.8) * 0.67;
    carry *= 0.21;
    vec4 a = mix(texture(uWaves, base - carry * (f0 - 0.5)), texture(uWaves, base - carry * (f1 - 0.5) + vec2(0.37, 0.71)), mixab);
    vec4 b = mix(texture(uWaves, turned - carried * (f0 - 0.5)), texture(uWaves, turned - carried * (f1 - 0.5) + vec2(0.53, 0.19)), mixab);
    // (Livelier the faster it runs.)
    vec2 run = ((a.rg - 0.5) * 0.3 + (b.rg - 0.5) * 0.22) * (0.6 + 0.5 * min(fast, 1.5) + 0.9 * smoothstep(1.2, 3.0, fast));
    slope = mix(slope, run, swell);
    grain = mix(grain, (1.0 - a.a) * 0.5 + b.b * 0.5, swell);
    net = mix(net, 1.0 - min(a.a, b.a), swell);
    edge = mix(edge, a.b, swell);
    speed = mix(speed, fast, swell);
    float here = m.g * has;
    vec4 mx = textureLod(uFlowMap, uv + vec2(uFlowStep.x, 0.0), 2.0), mz = textureLod(uFlowMap, uv + vec2(0.0, uFlowStep.y), 2.0);
    // (Toward water of this body only: a pond that stands over the river
    // behind a dam is not a slope of the river's.)
    if (mx.r > 0.03 && abs(mx.g / mx.r - here) < 0.6 && abs(here - vWorld.y) < 0.6) tilt.x = (mx.g / mx.r - here) / uFlowStep.z;
    if (mz.r > 0.03 && abs(mz.g / mz.r - here) < 0.6 && abs(here - vWorld.y) < 0.6) tilt.y = (mz.g / mz.r - here) / uFlowStep.w;
    tilt = clamp(tilt, -0.7, 0.7) * swell;
    // White water: where it runs faster than its depth lets a wave run
    // (over a shelf, along a bank), where it is fast at all, and on the
    // face of a front, where the level steps. In streaks drawn out along
    // the way it runs and carried with it, open water between them: never
    // a net of cells, never all of the river.
    vec2 dir = flow / max(fast, 1e-3);
    vec2 along = vec2(dot(vWorld.xz, dir), dir.x * vWorld.z - dir.y * vWorld.x);
    // (Thin and broken: threads a hand to an arm wide and a few metres
    // long, cut again by a noise that rides with them. Broad bands with
    // straight sides are paint on a road.)
    float ride = time * min(fast, 3.0);
    float streak = textureLod(uWaves, vec2((along.x - ride) * 0.19, along.y * 1.3), 0.0).b;
    float broken = textureLod(uWaves, vec2((along.x - ride) * 0.47 + 0.31, along.y * 0.45 + 0.17), 0.0).b;
    // (In the last metres before the eye a thread is foam: its edge soft,
    // and broken into lace by the cells of the wave texture, which ride
    // with it. Cut hard from noise a few texels across, it was a white
    // parallelogram.)
    float near = 1.0 - smoothstep(1.5, 6.0, vZ);
    float threads = smoothstep(0.4 - 0.16 * near, 0.68 + 0.1 * near, streak) * smoothstep(0.24 - 0.1 * near, 0.58 + 0.1 * near, broken);
    if (near > 0.0) {
      float lace = textureLod(uWaves, vec2((along.x - ride) * 1.9, along.y * 3.1), 0.0).a;
      threads *= mix(1.0, 0.25 + 0.75 * smoothstep(0.08, 0.5, lace), near);
    }
    // The face of a front, where the level falls away down the flow: a
    // bore, breaking white from bank to bank, and leaning to the eye as
    // steeply as a breaking wave does (three times its true slope).
    // (By where the level bends, which is the crest the corners were
    // lifted to: a river that runs down a slope of one in ten all the way
    // is no front, and by its slope alone a shelf was white from edge to
    // edge for as long as the swell ran over it.)
    float roller = smoothstep(0.03, 0.15, vLift);
    float face = roller;
    // (No net of light on the bed under a roller: in a gap of its white
    // it was a honeycomb.)
    net *= 1.0 - roller;
    tilt *= 1.0 + 2.0 * face;
    // The face of a step itself, where the level drops a hand or more in
    // a cell's width along the flow: water going down it, white in
    // strands. (The level a pace up and down the flow, read half a cell
    // wide: the cells join at their corners however tall the step, and
    // the face between a white crest and its foot was a ramp of slate
    // with ruled edges for the frame in which it passed the eye.)
    float steepFace = 0.0;
    vec2 pace = dir * 0.6 * uFlowInv.xy;
    vec4 up = textureLod(uFlowMap, uv - pace, 1.0), dn = textureLod(uFlowMap, uv + pace, 1.0);
    if (up.r > 0.03 && dn.r > 0.03) {
      float drop = up.g / up.r - dn.g / dn.r;
      if (drop < 2.0) {
        float steep = smoothstep(0.3, 0.7, drop / 1.2) * smoothstep(0.8, 1.6, fast);
        // (Of a front that travels, as the crest is: where the water
        // steps down for good off a bank's foot the white lay there in
        // dashes for as long as the swell ran.)
        if (uLandInv.w > 0.0) steep *= smoothstep(0.1, 0.5, texture(uLanded, vWorld.xz * uLandInv.xy).b);
        tilt -= dir * (steep * 0.5);
        face = max(face, steep * (0.55 + 0.45 * smoothstep(0.3, 0.7, streak)));
        steepFace = steep;
      }
    }
    // Behind the crest, within ten metres of the eye, the white is broken
    // into small patches that ride with the water, thinning through pale
    // green to the water between them. Below a dam that has just let go
    // the whole reach from its foot to the front is water that rises and
    // bends: all of it was white, and from the river there a flat white
    // sheet from bank to bank for a second, one patch of the foam's
    // grain filling the view. The crest itself stays whole and white
    // from any distance: it is the front's height that is seen coming. (The patches are the grain the foam is cut from,
    // which so cuts it softly: a white with holes punched in it was
    // paper. Of two sizes: an arm across, and a hand.)
    float tear = 0.0, patchy = 0.5;
    // (Near the eye only, within a few paces: from further off the face
    // keeps its streaks, white run down a slope as off a weir. Patches
    // out to ten metres were, from the bank, a net pulled over the wave.)
    float close = 1.0 - smoothstep(2.5, 6.5, vZ);
    if (close > 0.0 && face > 0.0) {
      // (The crest: within four metres behind water the front has not
      // reached, which lies lower and is not rising: the front's own toe,
      // a cell ahead of its face, rises a metre a second. Below the dam
      // the water ahead is lower too, all the way down, and rising.)
      vec2 fore = vWorld.xz + dir * 4.0;
      vec4 ahead = textureLod(uFlowMap, fore * uFlowInv.xy, 2.0);
      float lead = ahead.r > 0.03 ? smoothstep(0.15, 0.35, here - ahead.g / ahead.r) : 0.0;
      if (uLandInv.w > 0.0) lead *= 1.0 - smoothstep(0.05, 0.3, textureLod(uLanded, fore * uLandInv.xy, 0.0).b);
      // (A steep face alone is no crest: below a dam that has let go the
      // whole reach is a chute a metre down in two.)
      // (The waves' heights riding with the water, with the second train
      // of ripples, which lies turned and is carried its own way: one
      // layer alone repeats every metre and was rows of dashes, two that
      // ride together a weave. Read no finer than a pixel shows: far
      // off, at a low angle, the finest level was a hatching.)
      // (By the pixel's own size here, not the cell's corners': a large
      // rectangle among the cells had a denser pattern than they, and
      // was seen as a square.)
      float lod = max(log2(max(vZ * uProj.w * uScreen.y, 1e-4) * 128.0 * 1.2) + 2.0, 0.0);
      // (Three sizes that share no period, the largest turned: patches an
      // arm across broken by smaller ones. Two of one size in rows were
      // a checkerboard from the bank.)
      vec2 q = vec2(along.x - ride, along.y);
      patchy = textureLod(uWaves, vec2(q.x * 0.31 - q.y * 0.19, q.x * 0.19 + q.y * 0.31) + 0.7, max(lod - 1.3, 0.0)).b * 0.45
        + textureLod(uWaves, q * vec2(0.83, 1.17) + 0.4, lod).b * 0.3 + b.b * 0.25;
      // (And the crest too once it is within arm's reach: from inside it
      // nothing is seen of its height, only a white that fills the view.)
      tear = max(close * (1.0 - lead), 1.0 - smoothstep(1.5, 3.5, vZ)) * smoothstep(0.0, 0.2, face);
      // (Where the eye looks DOWN on the water: at one's feet below the
      // dam, on the flat behind a crest from a bank. Seen along the
      // water, at a glancing ray, the same patches are squashed into
      // dashes in rows, a net pulled over the wave, whatever the slope
      // under them and however fast the level rises: there the white is
      // the face's own, streaked. (The second critic's reading, after
      // three rules of mine by slope, by which way it faces and by the
      // rise had each left the rows on the lower face of the front.))
      tear *= smoothstep(0.22, 0.42, abs(toP.y) / max(length(toP), 1e-3));
    }
    // (Behind the front the threads come in drifts with open water
    // between: the whole river dashed alike was rain on a pond.)
    float drift = smoothstep(0.42, 0.62, textureLod(uWaves, vec2((along.x - ride) * 0.043 + 0.7, along.y * 0.071), 0.0).b);
    // (On open water that is merely fast, next to none: threads are for
    // where it runs faster than its depth lets a wave run, a shelf, a
    // bank's foot. Behind a front the whole river is fast, and its threads,
    // each a pace long and cut where its neighbours are, were from a
    // bridge upright white ticks of one length standing in rows on the
    // water: marks, not spray.)
    rush = ((smoothstep(0.9, 2.0, fast / sqrt(9.8 * max(dv, 0.03))) * smoothstep(0.9, 1.8, fast) * 0.3
      + smoothstep(1.2, 3.2, fast) * 0.12 * drift) * (0.1 + 0.9 * threads)
      + face * 0.9 + smoothstep(0.06, 0.25, length(tilt)) * 0.3) * swell;
    // (Cut from the waves' heights, which are round: the cells' lines are a net.)
    grain = mix(grain, a.b * 0.55 + b.b * 0.45, swell * smoothstep(0.0, 0.2, rush));
    grain = mix(grain, clamp((patchy - 0.5) * 2.0 + 0.47, 0.0, 1.0), tear * swell);
  }
#endif
#ifdef WATER_FLOWMAP
  // Where water in the air has just come down: white, a sheet at the foot
  // of a pour and lace at its rim and where single drops fell.
  if (uLandInv.w > 0.0) rush += texture(uLanded, vWorld.xz * uLandInv.xy).r * 1.2;
#endif
  // No waves in a film of water at the shore.
  slope *= smoothstep(0.0, 0.08, dv);
  vec3 ng = normalize(vec3(-tilt.x, 1.0, -tilt.y));
  vec3 n = normalize(vec3(-tilt.x - slope.x, 1.0, -tilt.y - slope.y));
  // A line of foam where the water meets something, wider where it runs.
  // (Its edge rides the waves.)
  // (Where a swell runs past a pier, a boulder, a bank: a collar of white
  // water a forearm wide. Past something that stands in the water, that
  // is: where what is under the surface climbs steeply to it. Over a
  // shelf the water is shallow everywhere, and a collar as wide as it is
  // deep was the whole shelf painted white.)
  float past = smoothstep(1.0, 2.2, speed) * swell * smoothstep(0.12, 0.35, fwidth(sink) / max(vPx, 1e-4));
  float foam = (1.0 - smoothstep(0.0, 0.05 + 0.06 * min(speed, 1.0) + 0.3 * past, sink + (edge - 0.5) * (0.04 + 0.2 * past))) * (0.25 + 0.35 * min(speed, 1.0) + 0.45 * past);
  float film = smoothstep(0.0, 0.012, sink);
  // Which side of the water the eye is on is for the surface to say, as it
  // truly lies. The face of a front is shaded leaning three times its true
  // slope: seen from behind, from a bridge the front has gone under, that
  // normal points away from the eye, the shading took the face for the
  // far side of a wave, which is not drawn, and the bed showed through the
  // front in a line from bank to bank. Where the top of the surface is
  // seen, its normals are bent back until they face the eye.
  if (uUnder.x < 0.5) {
    vec3 gn = cross(dFdx(vWorld), dFdy(vWorld));
    if (gn.y < 0.0) gn = -gn;
    if (dot(gn, toP) > 0.0) discard;
    vec3 back = -toP / max(length(toP), 1e-4);
    float lack = -dot(ng, back);
    if (lack > 0.0) {
      ng = normalize(ng + back * (lack + 0.02));
      n = normalize(n + back * (lack + 0.02));
    }
  }
  oColor = shadeWater(vWorld, ng, n, vZ, dv, film, min(foam + rush, 0.72), grain, net * net * net);
}
`;

// The still water from above, for itself to read (render_water.js, the
// flow map): a texel two columns wide, r 1 where there is still water, g
// its level (m), b and a its speed x and z (m/s); where rectangles lie
// over each other the higher is kept (a depth test on the level). Its
// coarser levels are the same, premultiplied as it stands: level and speed
// at a place are g, b, a over r.
export const WATER_FLOW_VS = `
layout(location = 0) in vec4 aRect;
layout(location = 1) in vec4 aBody;
uniform vec4 uWetInv;                 // 1 / the map's width and depth in metres
flat out vec3 vVal;
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vVal = aBody.xyz;
  gl_Position = vec4(mix(aRect.xy, aRect.zw, c) * uWetInv.xy * 2.0 - 1.0, 1.0 - clamp(aBody.x * 0.01, 0.0, 1.0) * 2.0, 1.0);
}
`;

export const WATER_FLOW_FS = `
flat in vec3 vVal;
out vec4 oColor;
void main() {
  oColor = vec4(1.0, vVal);
}
`;

// The same rectangles, drawn to no effect inside an occlusion query: is any
// of the still water in front of the scene at all? (A full tank behind its
// own walls is in view all day and never seen.)
export const WATER_PROBE_FS = `
${FRAME}
uniform sampler2D uDepth;
in float vZ;
out vec4 oColor;
void main() {
  float d = texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r;
  if (2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x)) < vZ) discard;
  oColor = vec4(0.0);
}
`;

// Moving water: a grid of 16 x 16 quads per tile, vertices at column
// corners. A patch texel is a column (the tile's 256 with one ring of the
// neighbours'); a corner's height is the mean of the columns around it that
// hold water and are of one surface (see the vertex stage), so the surface
// is one surface from tile to tile, and across a corner where four meet. The flow and the churn of the columns
// go to the fragment stage the same way, as the mean at each corner: the
// churn rides in the flow's x channel (water/output.rs) and has to be taken
// off texel by texel, unfiltered.
export const WATER_TILE_VS = `
${FRAME}
layout(location = 0) in vec4 aTile;   // x0, z0 (m), the height its patch is relative to (m), patch index
uniform sampler2D uPatch;             // per texel: height over the base, depth of water, flow x (+ 32 x churn) and z (+ 64 on loose ground)
uniform ivec4 uAtlas;                 // patches in a column of the atlas
out vec3 vWorld;
out float vZ;
out vec2 vPatch;                      // patch texel coordinates (texel centres at halves)
out vec2 vSlope;
out vec3 vFlow;                       // flow x and z (m/s), churn 0..1
out vec2 vRough;                      // x: columns round this corner stand apart (0..1), y: the bed steps down here (0..1)
out float vDepth;                     // depth of the water that is of the surface at this corner (m)
out float vLoose;                     // the bed here is loose ground: rubble, soil, grass (0..1)
flat out vec2 vOrigin;                // the patch's first texel in the atlas
void main() {
  ivec2 c = ivec2(gl_VertexID % 17, gl_VertexID / 17);
  int slot = int(aTile.w + 0.5);
  ivec2 org = ivec2((slot / uAtlas.x) * 18, (slot % uAtlas.x) * 18);
  ivec2 t = org + c;
  vec4 a = texelFetch(uPatch, t, 0), b = texelFetch(uPatch, t + ivec2(1, 0), 0);
  vec4 d = texelFetch(uPatch, t + ivec2(0, 1), 0), e = texelFetch(uPatch, t + ivec2(1, 1), 0);
  vec4 hs = vec4(a.r, b.r, d.r, e.r);
  vec4 dp = vec4(a.g, b.g, d.g, e.g);
  vec4 ok = step(0.0, dp);
  // (At a corner of the tile the four columns are of four tiles: the ring
  // holds the three that are not this tile's, the corner texel among them,
  // so all four tiles work from the same four.)
  float cnt = ok.x + ok.y + ok.z + ok.w;
  // One surface, whatever the columns say. The corner takes the level of
  // the second lowest of its columns (of two, the lower) and leaves out
  // any that stands 12 to 32 cm or more away from it, over or under: a
  // column the numbers have thrown up, water on a ledge or a heap beside
  // water on the floor, a column that drains down a hole. No spike and no
  // pit can stand on a corner, and what is left of a jump in height is one
  // steep face a column wide, which the fragment stage draws as a fall or,
  // if it is taller than a fall can be, not at all. Over a step in the bed
  // up to a kerb's height the corner is held up to the higher bed, so a
  // sheet reaches the lip it runs over and the fall is drawn on the low
  // side, against the step. (Lumps wider than a column are the engine's
  // to cut: limit() in water/output.rs.)
  vec4 bed = hs - max(dp, 0.0);
  vec4 m = mix(vec4(1e3), hs, ok);
  vec2 lows = min(m.xz, m.yw), highs = max(m.xz, m.yw);
  float lo = min(lows.x, lows.y);
  float ref = cnt > 2.5 ? min(max(lows.x, lows.y), min(highs.x, highs.y)) : lo;
  m = mix(vec4(-1e3), bed, ok * step(ref - 0.32, hs));
  float top = min(max(max(m.x, m.y), max(m.z, m.w)), ref + 0.22);
  vec4 apart = max(smoothstep(0.12, 0.32, hs - max(ref, top)), smoothstep(0.12, 0.32, ref - hs)) * ok;
  vec4 w = ok - apart;
  float wn = max(w.x + w.y + w.z + w.w, 1e-3);
  float h = cnt > 0.0 ? max(dot(hs, w) / wn, top) : 0.0;
  // (The lowest bed among the columns that are of the surface: a hole
  // beside it is not a step in its bed.)
  m = mix(vec4(1e3), bed, step(0.5, w));
  float low = min(min(m.x, m.y), min(m.z, m.w));
  vDepth = cnt > 0.0 ? dot(max(dp, 0.0), w) / wn : 0.0;
  vec4 fx = vec4(a.b, b.b, d.b, e.b);
  vec4 churn = floor(fx * 0.03125 + 0.5);
  fx -= churn * 32.0;
  vec4 fz = vec4(a.a, b.a, d.a, e.a);
  vec4 loose = floor(fz * 0.015625 + 0.5);
  fz -= loose * 64.0;
  vFlow = cnt > 0.0 ? vec3(dot(fx, w), dot(fz, w), dot(churn, w) * 0.0666667) / wn : vec3(0.0);
  vLoose = cnt > 0.0 ? dot(loose, w) / wn : 0.0;
  // The slope, from the pairs of columns that are both of the surface.
  vec2 s = vec2(0.0), sn = vec2(0.0);
  float k;
  k = w.x * w.y; s.x += (hs.y - hs.x) * k; sn.x += k;
  k = w.z * w.w; s.x += (hs.w - hs.z) * k; sn.x += k;
  k = w.x * w.z; s.y += (hs.z - hs.x) * k; sn.y += k;
  k = w.y * w.w; s.y += (hs.w - hs.y) * k; sn.y += k;
  vSlope = clamp(s / max(sn, 1e-3) * 10.0, -2.0, 2.0);
  vRough = cnt > 0.0 ? vec2(max(max(apart.x, apart.y), max(apart.z, apart.w)), smoothstep(0.03, 0.12, top - low)) : vec2(0.0);
  vec3 p = vec3(aTile.x + float(c.x) * 0.1, aTile.z + h, aTile.y + float(c.y) * 0.1);
  vWorld = p;
  vPatch = vec2(c) + 1.0;
  vOrigin = vec2(org);
  gl_Position = uViewProj * vec4(p, 1.0);
  vZ = gl_Position.w;
}
`;

export const WATER_TILE_FS = `
${HEAD}
${SHADE}
uniform sampler2D uPatch;
uniform vec4 uAtlasInv;               // 1 / atlas width, 1 / atlas height
uniform sampler2D uSpray;             // the water in the air (WATER_SPRAY_FS)
uniform vec4 uSprayInv;               // 1 / its width, 1 / its height, scene pixels per pixel of it (0: there is none)
in vec3 vWorld;
in float vZ;
in vec2 vPatch;
in vec2 vSlope;
in vec3 vFlow;
in vec2 vRough;
in float vDepth;
in float vLoose;
flat in vec2 vOrigin;
void main() {
  float zs = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r);
  // (A film of water lies millimetres over its floor: the test gives way by
  // what the depth buffer can resolve.)
  if (zs + 0.002 + vZ * 0.0004 < vZ) discard;
  // (Nothing of the surface at any corner of this triangle: no water here,
  // and none of the lookups below is taken.)
  if (vDepth <= 0.0 && vRough.x <= 0.0) discard;
  vec2 pc = vPatch;
  vec2 gx = dFdx(vWorld.xz), gy = dFdy(vWorld.xz);
  vec2 flow = vFlow.xy;
  float churn = clamp(vFlow.z, 0.0, 1.0);
  float speed = length(flow);
  float time = uCamPos.w;
  // Ripples carried by the flow: the two phases of a flow map, each a noise
  // that rides the water for a beat and is faded out as the other takes over.
  // They are small (the texture repeats every 0.9 m: its waves are a hand
  // to an arm long); the larger shapes of moving water are its own.
  float ph = time * 0.7;
  float f0 = fract(ph), f1 = fract(ph + 0.5);
  vec2 base = vWorld.xz * 1.1 + time * vec2(0.013, 0.008);
  // (Carried no faster than 1.2 m/s: where fast water changes its way from
  // one place to the next the noise would be drawn out into fur.)
  vec2 carry = flow * (min(1.0, 1.2 / max(speed, 1e-3)) * (1.1 / 0.7));
  vec4 a = texture(uWaves, base - carry * (f0 - 0.5));
  vec4 b = texture(uWaves, base - carry * (f1 - 0.5) + vec2(0.37, 0.71));
  float mixab = abs(1.0 - 2.0 * f0);
  vec2 wob = mix(a.rg, b.rg, mixab) - 0.5;
  vec2 slope = wob * 2.0;
  float grain = (1.0 - mix(a.a, b.a, mixab)) * 0.5 + mix(a.b, b.b, mixab) * 0.5;
  float net = 1.0 - mix(a.a, b.a, mixab);
#if WATER_RIPPLES > 2
  slope += (texture(uWaves, vWorld.xz * 2.9 - carry * (f0 - 0.5) * 2.6 + 0.11).rg - 0.5);
#endif
  // The depth, read a little way off where the noise says (up to half a
  // column): the edge of a sheet and the foot of a front are ragged, not
  // the outline of their columns. (Only the depth is read here: the flow's
  // x channel carries the churn too and does not filter; both come from
  // the vertex stage.)
  pc = clamp(pc + wob * 1.3, vec2(1.0), vec2(17.0));
  // Keep the filter's footprint off the ring's corner texels, which hold
  // nothing: in a corner, leave the border band on the axis less deep in it.
  vec2 lo = 1.5 - pc, hi = pc - 16.5;
  vec2 band = max(lo, hi);
  if (band.x > 0.0 && band.y > 0.0) {
    if (band.x < band.y) pc.x = lo.x > 0.0 ? 1.5 : 16.5; else pc.y = lo.y > 0.0 ? 1.5 : 16.5;
  }
  float deep = textureLod(uPatch, (vOrigin + pc) * uAtlasInv.xy, 0.0).g;
  float depth = deep - (grain - 0.35) * 0.004;
  if (depth <= 0.0) discard;
  // (A column left out of the surface, one that drains down a hole ten
  // metres deep, is not the depth of the water here either.)
  deep = min(deep, vDepth * 1.5 + 0.1);
  depth = min(depth, deep);
  // What is left of a jump in height is one steep face a column wide. Up
  // to a kerb's height it is a fall; a taller one would be a wall of water
  // standing where none can stand, and is not drawn (what goes over such
  // an edge is in the air, as parcels).
  vec3 gn = cross(dFdx(vWorld), dFdy(vWorld));
  float stand = smoothstep(0.1, 0.36, abs(gn.y) / max(length(gn), 1e-9));
  if (stand <= 0.0) discard;
  // How much of a body of water this is: nothing in a film, all of it from
  // a shin deep. A film has no waves of its own, and the engine's (a
  // centimetre of water rolling over a street in ridges as high as it is
  // deep) are flattened with them: what is left of a film is its gloss.
  float body = smoothstep(0.01, 0.25, depth);
  // Livelier the faster it runs, and choppy where water comes down into it.
  slope *= (0.05 + 0.2 * min(speed, 2.5)) * body + 0.4 * churn;
  float caust = net * net * net * (0.55 - 0.45 * min(speed, 1.0));
  // Water that has come to rest and has some depth is rippled by the wind
  // as a still body is, by the same two trains of waves (WATER_RECT_FS): a
  // pool that a river has filled does not show where the one ends and the
  // other begins. (Two more taps, taken only there.)
  float still = smoothstep(0.08, 0.35, deep) * (1.0 - smoothstep(0.15, 0.7, speed)) * (1.0 - churn);
  if (still > 0.0) {
    vec4 wa = textureGrad(uWaves, vWorld.xz * 0.21 + time * vec2(0.013, 0.008), gx * 0.21, gy * 0.21);
    vec4 wb = textureGrad(uWaves, vec2(vWorld.x * 0.8 - vWorld.z * 0.6, vWorld.x * 0.6 + vWorld.z * 0.8) * 0.67 + time * vec2(-0.034, 0.021) + (wa.rg - 0.5) * 0.09,
      vec2(gx.x * 0.8 - gx.y * 0.6, gx.x * 0.6 + gx.y * 0.8) * 0.67, vec2(gy.x * 0.8 - gy.y * 0.6, gy.x * 0.6 + gy.y * 0.8) * 0.67);
    slope = mix(slope, ((wa.rg - 0.5) * 0.3 + (wb.rg - 0.5) * 0.22) * 0.6, still);
    float wnet = 1.0 - min(wa.a, wb.a);
    caust = mix(caust, wnet * wnet * wnet, still);
  }
  // The surface's own slope, limited: broken water is drawn white, not as facets.
  // (Thrown-about water least of all: column by column its slopes are
  // noise, and a mirror laid over them is crumpled foil.)
  vec2 lean = vSlope * (0.12 + 0.88 * body) * (1.0 - 0.8 * churn);
  lean *= min(1.0, 0.7 / max(length(lean), 1e-3));
  vec3 ng = normalize(vec3(-lean.x, 1.0, -lean.y));
  vec3 n = normalize(vec3(-lean.x - slope.x, 1.0, -lean.y - slope.y));
  // White where water comes down into it, where it runs fast and where it
  // goes over an edge. (A film does not foam for running: only what is
  // thrown onto it shows, thinly.)
  float steep = dot(vSlope, vSlope);
  float room = smoothstep(0.03, 0.12, depth);
  // (Churn by its square, and half of what it was: a flood that has just
  // left a tank churns all over, and a pool that is white from rim to rim
  // is snow. White is for where it is thrown about hardest, for crests
  // and for falls; the rest is water with a broken surface.)
  float foam = churn * churn * (0.04 + 0.42 * room) + smoothstep(0.03, 0.12, depth) * smoothstep(1.3, 4.0, speed) * 0.4 + room * smoothstep(0.2, 1.2, steep) * 0.45;
  if (uSprayInv.z > 0.0) {
    // Where water in the air comes down on it: the layer holds water at
    // this pixel, about as far from the eye as the surface is.
    vec2 luv = ((gl_FragCoord.xy - 0.5 - floor(uSprayInv.z * 0.5)) / uSprayInv.z + 0.5) * uSprayInv.xy;
    vec4 s = textureLod(uSpray, luv, 0.0);
    foam += smoothstep(0.004, 0.06, s.r) * (1.0 - smoothstep(0.25, 0.9, abs(s.g / max(s.r, 1e-4) - vZ))) * (0.15 + 0.85 * room);
  }
  // (Over a step in the bed, where it runs: a fall. From the corners'
  // own measure of the step, which fades across a column: a face's own
  // steepness is one value a triangle, and foam cut by it is a white
  // triangle.)
  foam += vRough.y * smoothstep(0.2, 1.0, speed) * 0.5 * room;
  // (On loose ground, rubble and soil, water up to a hand deep lies among
  // the lumps and runs in their voids: none of it is broken water, and
  // white on a heap of rubble is snow on rocks.)
  foam *= 1.0 - vLoose * (1.0 - smoothstep(0.12, 0.3, deep));
  // Foam lies on broken water in patches an arm across, open water between
  // them: never one white field.
  // (Thinning out to lace at a patch's rim, not cut off there.)
  // (And carried with the water, as its ripples are, a beat at a time:
  // patches that lay still while the water ran under them made a pour
  // through a breach a white heap that stood there.)
  vec2 lie = vWorld.xz * 0.31 + time * vec2(0.02, -0.013), ride = carry * (0.31 / 1.1);
  foam *= 0.25 + 0.85 * smoothstep(0.2, 0.8, mix(textureLod(uWaves, lie - ride * (f0 - 0.5), 0.0).b, textureLod(uWaves, lie - ride * (f1 - 0.5) + vec2(0.61, 0.23), 0.0).b, mixab));
  // Where the bed is broken ground (it steps from one column to the next:
  // the foot of a heap of rubble, a kerb) water thinner than a hand lies
  // among the lumps, not over them: no surface there. (A heap is drawn as
  // the smooth mound its cubes stand for, and a film laid on the cubes
  // was a field of white teeth.)
#ifdef WET_MASK
  // (The ground under a film is drawn wet by the surface shader: darker,
  // with the sky in it. What the water adds, from a finger deep, is its
  // own surface.)
  // (And on loose ground, soil and grass and rubble, it is theirs up to a
  // few centimetres more: water that thin lies among the grains. A heap,
  // whose bed steps, is kept clear of thin water by the rule below.)
  float film = smoothstep(0.01, 0.03, depth) * (1.0 - vLoose * (1.0 - smoothstep(0.03, 0.08, deep)));
#else
  float film = smoothstep(0.0, 0.008, depth);
#endif
  film *= stand * (1.0 - vRough.y * (1.0 - smoothstep(0.05, 0.12, deep)));
  if (film <= 0.0) discard;
  // (caust: running water blurs the net of light it throws on its bed.)
  // (Never quite a sheet: the darkest of the grain stays open, as pores.)
  // (Never a sheet: the middles of the foam's cells stay open, as pores.)
  oColor = shadeWater(vWorld, ng, n, vZ, deep, film, min(foam, 0.72), grain, caust);
}
`;

// Water in the air: each parcel a quad facing the camera, drawn out along
// the way it flies. A parcel is a bucketful of water that has come apart:
// a thin mist the size of the quad with drops and shreds in it (DROPS), not
// a ball. The parcels are not drawn into the scene one by one: they are
// summed into a layer of reduced resolution as thickness of water along
// the line of sight (WATER_SPRAY_FS), and the layer is drawn as one body
// whose surface leans the way its thickness changes (WATER_SPRAY_UP_FS), so
// the parcels of a jet or a curtain run together into a body with a ragged
// fringe, and one alone is a spatter. Where no float target can be
// rendered to, each is drawn by itself (WATER_BLOB_FS).
export const WATER_PARCEL_VS = `
${FRAME}
${UTIL}
#ifdef WATER_SHADOW
${SHADOW}
#endif
layout(location = 0) in vec4 aPos;    // xyz (m), radius (m)
layout(location = 1) in vec4 aVel;    // xyz (m/s), age (s)
uniform sampler3D uSkyVis;
uniform int uStep;                    // scene pixels per pixel of the target (0: the scene itself)
out vec2 vQ;
flat out vec3 vSide;
flat out vec3 vAlong;
flat out vec3 vFace;
flat out vec4 vBlob;   // view depth of the centre, half width (m), width over length, how white (0..1)
flat out vec4 vLit;    // sun reaching it (rgb), sky visibility
flat out vec4 vCentre; // where it is; w: how much of it is still one stream (0..1)
flat out vec2 vKind;   // a number of its own that it keeps through its flight (0..1); how much of it is a jet's water (0..1)
flat out float vThin;  // its true width over the width it is drawn at (a pixel and a half at least), 0..1
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec3 p = aPos.xyz;
  vec3 toCam = uCamPos.xyz - p;
  float dist = length(toCam);
  toCam /= max(dist, 1e-4);
  float speed = length(aVel.xyz);
  vec3 dir = speed > 0.05 ? aVel.xyz / speed : vec3(0.0, 1.0, 0.0);
  vec3 side = cross(dir, toCam);
  float across = length(side);
  side = across > 0.05 ? side / across : uCamRight.xyz;
  vec3 along = cross(toCam, side);
  // Never thinner than a pixel and a half: a far jet must not flicker.
  float px = dist * uProj.w * uScreen.y * max(float(uStep), 1.0);
  // (Nor wider than a twelfth of the view's height: next to the camera a
  // curtain of them would be drawn over the whole screen many times.)
  // Narrow where it leaves the lip, spreading as it breaks up on its way.
  float age = aVel.w;
  // (A parcel of litres is a mass of water that falls as one: it spreads
  // less than a cupful, which is spray within a second.)
  float heavy = smoothstep(0.05, 0.14, aPos.w);
  float w = min(aPos.w * (1.25 + (1.5 - 0.9 * heavy) * smoothstep(0.15, 1.6, age)), dist * uProj.w * 0.085);
  // (Drawn wider than it is, it holds no more water than it has: a
  // hydrant's spout seen from the far end of the street was thirty
  // parcels each ten times its width and as thick as a jet at arm's
  // length, a white lump a person tall that read as plaster.)
  vThin = clamp(pow(w / max(px * 1.5, 1e-4), 0.7), 0.2, 1.0);
  w = max(w, px * 1.5);
  // Drawn out along its flight by what it travels in a twelfth of a
  // second, as seen: water in the air is streaks, not balls.
  // Its own number: from the way it flies over the ground, which it keeps
  // from the moment it is thrown (its place changes every frame, and a
  // shape taken from that would flicker).
  float own = fract(sin(dot(aVel.xz, vec2(12.9898, 78.233)) + aPos.w * 311.7) * 43758.5453);
  // A jet's water: young and fast, one of a row that is to run together.
  float jet = (1.0 - smoothstep(0.4, 1.6, age)) * smoothstep(1.5, 5.0, speed) * (1.0 - heavy);
  // Unequal: most are short, a few long (by the square of its number);
  // a jet's are all long enough to reach the next.
  float reach = mix(0.35 + 1.3 * own * own, 1.0, jet);
  float l = w * (1.3 + 1.2 * reach) + min(speed * 0.08, 5.0 * w) * across * reach;
  w *= 0.8;
  // Far out along a jet's arc its water has come apart: each piece off its
  // track by up to a hand or two, and of a size of its own (in a row on
  // parallel tracks, all of one size, they were a dotted line).
  float apart = smoothstep(0.5, 1.5, age) * (1.0 - heavy);
  p += (side * (own - 0.5) + along * (fract(own * 7.31) - 0.5) + toCam * (fract(own * 3.17) - 0.5)) * (apart * 0.45);
  float size = mix(1.0, 0.45 + 0.9 * fract(own * 5.13), apart);
  w *= size;
  l *= size;
  vKind = vec2(own, jet);
  vec3 wp = p + side * (c.x * w) + along * (c.y * l);
  vQ = c;
  vSide = side;
  vAlong = along;
  vFace = toCam;
  // Water thrown fast is a stream for the first half second, then spray.
  vCentre = vec4(p, max((1.0 - smoothstep(0.4, 1.6, age)) * smoothstep(1.5, 5.0, speed), heavy));
  float sv = textureLod(uSkyVis, (p + vec3(0.0, 0.2, 0.0)).xzy * uSkyVisInv.xyz, 0.0).r;
  float sh = 0.0;
  if (uSunCol.r + uSunCol.g > 1e-4) {
#ifdef WATER_SHADOW
    sh = uSunDir.w > 0.0 ? sunShadow(p, uSunDir.xyz, 1.0, 0.5, 0.0) : 1.0;
#else
    sh = smoothstep(0.15, 0.6, sv);
#endif
  }
  vLit = vec4(uSunCol.rgb * sh, sv);
  // Water that has been in the air a moment has broken up: it is white.
  // (Only at the lip it leaves is it still clear, for a hand's breadth.)
  float white = 0.35 + smoothstep(0.0, 0.5, age) * 0.4 + smoothstep(3.0, 10.0, speed) * 0.2 + 0.2 * heavy;
  gl_Position = uViewProj * vec4(wp, 1.0);
  vBlob = vec4(gl_Position.w, w, w / l, white);
}
`;

// How much water a parcel has at a point of its quad. q: the point, -1..1
// across and along; k: 1 - |q|^2; w, f: the wave texture at streakUv and
// at fineUv (both drawn out along the flight: what they cut is streaks,
// never dots); stream: how much of the parcel is still one stream.
// x: thickness as a share of the quad's half width, y: how much of that is
// spray (the rest is the stream's body).
const DROPS = `
vec2 streakUv(vec2 q, float shape, float seed) {
  return vec2(q.x * 0.21, q.y * 0.045 / shape) + vec2(seed, seed * 7.3);
}
vec2 fineUv(vec2 q, float shape, float seed) {
  return vec2(q.x * 0.83, q.y * 0.1 / shape) + vec2(seed * 3.1, seed);
}
vec2 drops(float k, vec4 w, vec4 f, float stream) {
  // The body of a stream or of a mass of water: thick at its heart, its
  // outline torn along the flight (never a clean oval).
  // (The noise is taken to its two ends: water in the air is there or it
  // is not. One lump alone is shreds with sky between them; many together
  // fill each other's gaps and are a fall.)
  float torn = smoothstep(0.38, 0.62, w.b * 0.5 + f.b * 0.5);
  float kb = max(k * (0.25 + 1.3 * torn) - 0.2, 0.0);
  float body = kb * sqrt(kb) * stream * 0.5;
  // Spray: shreds drawn out along the flight, their outline the noise's
  // and not the quad's round one, more torn the longer it has flown.
  float cut = k * (0.25 + 1.5 * (w.b * 0.65 + f.b * 0.35)) - 0.3 * (1.0 - stream);
  float spray = smoothstep(0.22, 0.95, cut) * (0.35 + 0.65 * f.b) * (0.13 - 0.06 * stream);
  return vec2(body + spray, spray / max(body + spray, 1e-4));
}
`;

// The layer: r thickness of water (m), g that times its view depth, b that
// times how white it is, a that times the sun reaching it. Blended by adding.
export const WATER_SPRAY_FS = `
${FRAME}
${DROPS}
uniform sampler2D uDepth;
uniform sampler2D uWaves;
uniform int uStep;     // scene pixels per pixel of the layer
in vec2 vQ;
flat in vec4 vBlob;
flat in vec4 vLit;
flat in vec4 vCentre;
flat in vec2 vKind;
flat in float vThin;
out vec4 oColor;
void main() {
  // A head and a trail: round at the front of its flight, thinning to
  // nothing behind, the trail torn into pieces (a jet's is whole, so the
  // row runs together). Never an oval, and never a lens: forty of those
  // from one blast were a burst of blades.
  float along = vQ.y * 0.5 + 0.5;
  float wide = pow(along, 1.3) * sqrt(max(1.0 - pow(along, 7.0), 0.0)) * 1.25;
  float k = wide - vQ.x * vQ.x / max(wide, 0.03);
  if (k <= 0.0) discard;
  // Tested against the farther of two scene pixels of this layer pixel
  // (opposite corners of it): water seen through a lattice, a tower's
  // legs, a railing, is behind the open pixels and stays in the layer; the
  // members in front of it are cut out pixel by pixel when the layer is
  // drawn (WATER_SPRAY_UP_FS). Tested against one pixel, a member a pixel
  // wide took the water of the whole layer pixel with it.
  ivec2 dp = ivec2(gl_FragCoord.xy) * uStep, last = ivec2(uScreen.zw) - 1;
  float d = max(texelFetch(uDepth, min(dp, last), 0).r, texelFetch(uDepth, min(dp + max(uStep - 1, 0), last), 0).r);
  float zs = 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
  // It meets the scene softly, and a blob the camera is inside of is let go.
  float fade = clamp((zs - vBlob.x + vBlob.y) / vBlob.y, 0.0, 1.0) * clamp((vBlob.x - 0.15) / (vBlob.y * 2.0), 0.0, 1.0);
  if (fade <= 0.0) discard;
  float seed = vKind.x;
  vec4 fine = textureLod(uWaves, fineUv(vQ, vBlob.z, seed), 0.0);
  // (The trail's pieces: gaps along the flight, more of them toward the tail.)
  k *= mix(smoothstep(0.38, 0.56, fine.b + (along - 0.5) * 0.5), 1.0, max(vKind.y, smoothstep(0.55, 0.85, along)));
  vec2 dr = drops(k, textureLod(uWaves, streakUv(vQ, vBlob.z, seed), 0.0), fine, vCentre.w);
  // (A thin jet is no fainter than a thick one, only narrower: its water
  // counts as if the parcel were a hand's breadth across at least.)
  float t = dr.x * max(vBlob.y, 0.2) * fade * vThin;
  float lit = clamp(vLit.r / max(uSunCol.r, 1e-4), 0.0, 1.0);
  // (Spray is whiter than the body of the stream it tears off.)
  oColor = vec4(t, t * vBlob.x, t * min(vBlob.w * (0.6 + 0.7 * dr.y), 1.0), t * lit);
}
`;

export const WATER_SPRAY_UP_FS = `
${HEAD}
uniform sampler2D uSpray;
uniform vec4 uSprayInv;   // 1 / layer width, 1 / layer height, scene pixels per layer pixel, how much of it to draw (0..1)
in vec2 vUv;
void main() {
  float stepPx = uSprayInv.z;
  vec2 luv = ((gl_FragCoord.xy - 0.5 - floor(stepPx * 0.5)) / stepPx + 0.5) * uSprayInv.xy;
  // The coarsest level first: where it holds nothing there is no water
  // within a dozen layer pixels, and most of the screen is done in one tap.
  vec4 far = textureLod(uSpray, luv, 3.5);
  if (far.r < 1e-5) discard;
  vec4 s = textureLod(uSpray, luv, 0.0);
  // Round the water, mist: the layer's coarser levels are the same water
  // spread over a hand and an arm's width of the screen.
  vec4 m = textureLod(uSpray, luv, 2.0) * 0.6 + far * 0.4;
  if (s.r < 0.003 && m.r < 0.0015) discard;
  float zs = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r);
  vec2 q = vUv * 2.0 - 1.0;
  vec3 ray = uCamFwd.xyz + uCamRight.xyz * (q.x * uProj.z) + uCamUp.xyz * (q.y * uProj.w);
  vec3 v = -normalize(ray);
  vec2 uv = gl_FragCoord.xy * uScreen.xy;
  vec3 col = vec3(0.0);
  float a = 0.0;
  // The layer is coarser than the scene: what spills over the edge of
  // something nearer is cut off here, pixel by pixel.
  float z = s.g / max(s.r, 1e-5);
  if (s.r >= 0.003 && zs >= z - 0.3) {
    vec3 p = uCamPos.xyz + ray * z;
    // The body's front stands half its thickness toward the eye: it leans the
    // way the thickness changes across the screen.
    vec2 e = uSprayInv.xy;
    vec2 dt = vec2(textureLod(uSpray, luv + vec2(e.x, 0.0), 0.0).r - textureLod(uSpray, luv - vec2(e.x, 0.0), 0.0).r,
      textureLod(uSpray, luv + vec2(0.0, e.y), 0.0).r - textureLod(uSpray, luv - vec2(0.0, e.y), 0.0).r);
    float span = z * uProj.w * 4.0 * uScreen.y * stepPx;   // metres between the taps of a pair
    vec2 g = clamp(dt * (0.5 / max(span, 1e-4)), -0.8, 0.8);
    vec3 n = normalize(v - uCamRight.xyz * g.x - uCamUp.xyz * g.y);
    float fr = 1.0 - clamp(dot(n, v), 0.0, 1.0);
    float fr2 = fr * fr;
    float fres = 0.02 + 0.98 * fr2 * fr2 * fr;
    float sv = textureLod(uSkyVis, (p + vec3(0.0, 0.2, 0.0)).xzy * uSkyVisInv.xyz, 0.0).r;
    vec3 sunIn = uSunCol.rgb * clamp(s.a / s.r, 0.0, 1.0);
    vec3 light = sunIn * (max(uSunDir.y, 0.0) * 0.5 + 0.2) + uAmbSky.rgb * (0.3 + 0.7 * sv);
    vec3 env = mix(bankColor(0.5), mirrorEnv(reflect(-v, n)), smoothstep(0.1, 0.7, sv));
    float ndh = max(dot(n, normalize(uSunDir.xyz + v)), 0.0);
    vec3 glint = sunIn * min(pow(ndh, 260.0) * 4.0, 6.0);
    // Falling water is half air: whiter the longer it has fallen and the
    // more of it the eye looks through.
    float white = clamp(0.2 + s.b / s.r * (0.75 + 2.0 * s.r), 0.0, 0.94);
    // Lit as the body it is, a rough white thing in the day's light: its
    // sunward side bright, the side away from the sun and its thick heart
    // in the sky's light alone, which is blue-grey.
    float facing = clamp(dot(n, uSunDir.xyz) * 1.2 + 0.45, 0.0, 1.0);
    // (Seen against the sun it is bright too: drops throw the light on
    // through themselves. Broken water is never a dim grey thing by day.)
    float through = max(dot(-v, uSunDir.xyz), 0.0);
    facing = max(facing, 0.55 + 0.45 * through * through);
    vec3 foam = vec3(0.78, 0.82, 0.85) * (sunIn * ((max(uSunDir.y, 0.0) * 0.5 + 0.25) * (0.35 + 0.65 * facing) * mix(1.0, 0.8, smoothstep(0.08, 0.5, s.r))) + uAmbSky.rgb * (0.3 + 0.7 * sv));
    // (A hand's thickness of falling water lets a fifth of what is behind
    // it through; a finger's, most of it.)
    float body = 1.0 - exp(-s.r * 16.0);
    // (Drops with air between them mirror next to nothing: a thick body of
    // falling water does, a little.)
    fres *= (1.0 - 0.85 * white) * smoothstep(0.03, 0.3, s.r);
#ifdef WATER_REFRACT
    // A lens: what is behind it, shifted by the way its surface leans.
    // (Faintly: it is drops, not a pane, and a pane's worth of bending cuts
    // what is behind a curtain into strips.)
    vec2 off = clamp(vec2(dot(n, uCamRight.xyz), dot(n, uCamUp.xyz)) * (0.12 * min(s.r, 0.3) / max(z * uProj.w, 0.05)), -0.012, 0.012);
    if (viewZ(textureLod(uDepth, uv + off, 0.0).r) < z) off = vec2(0.0);
    // (Spray is drops with air between them: what it takes out of the light
    // behind is a tenth of what the same thickness of water would.)
    vec3 behind = dec(textureLod(uScene, uv + off, 0.0).rgb) * exp(-ABSORB * min(s.r * 0.25, 0.1));
    col = mix(behind, foam, white) * (1.0 - fres) + env * fres + glint * body;
    a = smoothstep(0.0, 0.7, body);
#else
    col = mix(SCATTER * light * 4.0, foam, white) * (1.0 - fres) + env * fres + glint;
    a = body * clamp(0.35 + 0.65 * white + fres, 0.0, 1.0);
#endif
    col = hazed(col, -v, fogAmount(ray * z, z * length(ray)));
  }
  // The mist: thin, white, lit by the day; behind the body where there is
  // one, by itself where the water is only near.
  float zm = m.g / max(m.r, 1e-5);
  // (Thin: a veil round a fall, not a balloon round every lump of water.)
  float veil = (1.0 - exp(-m.r * 6.0)) * 0.3 * clamp((zs - zm + 0.6) / 0.6, 0.0, 1.0);
  if (veil > 0.002) {
    vec3 pm = uCamPos.xyz + ray * zm;
    float svm = textureLod(uSkyVis, (pm + vec3(0.0, 0.2, 0.0)).xzy * uSkyVisInv.xyz, 0.0).r;
    vec3 lightM = uSunCol.rgb * (clamp(m.a / max(m.r, 1e-5), 0.0, 1.0) * (max(uSunDir.y, 0.0) * 0.4 + 0.2)) + uAmbSky.rgb * (0.3 + 0.7 * svm);
    vec3 mist = hazed(vec3(0.8, 0.84, 0.88) * lightM, -v, fogAmount(ray * zm, zm * length(ray)));
    col = col * a + mist * (veil * (1.0 - a));
    a = a + veil * (1.0 - a);
    col /= max(a, 1e-4);
  }
  if (a < 0.003) discard;
  a *= uSprayInv.w;
  oColor = vec4(enc(col) * a, a);
}
`;

export const WATER_BLOB_FS = `
${HEAD}
${DROPS}
in vec2 vQ;
flat in vec3 vSide;
flat in vec3 vAlong;
flat in vec3 vFace;
flat in vec4 vBlob;
flat in vec4 vLit;
flat in vec4 vCentre;
flat in vec2 vKind;
flat in float vThin;
void main() {
  float r2 = dot(vQ, vQ);
  if (r2 >= 1.0) discard;
  float nz = sqrt(1.0 - r2);
  // The blob bulges toward the camera; it meets the scene softly, and one
  // the camera is inside of is let go.
  float z = vBlob.x - nz * vBlob.y;
  float zs = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r);
  float fade = clamp((zs - z) / vBlob.y, 0.0, 1.0) * clamp((vBlob.x - 0.15) / (vBlob.y * 2.0), 0.0, 1.0);
  if (fade <= 0.0) discard;
  float seed = vKind.x;
  vec4 w = texture(uWaves, streakUv(vQ, vBlob.z, seed));
  vec2 dr = drops(1.0 - r2, w, texture(uWaves, fineUv(vQ, vBlob.z, seed)), vCentre.w);
  float streak = w.b;
  // A flattened ball: the blobs of a jet are one body of water, not beads.
  vec3 n = normalize(vSide * (vQ.x * 0.75) + vAlong * (vQ.y * vBlob.z * 0.75) + vFace * (nz + 0.3));
  vec3 v = vFace;
  float fr = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  float fr2 = fr * fr;
  float fres = 0.02 + 0.98 * fr2 * fr2 * fr;
  vec3 env = mix(bankColor(0.5), mirrorEnv(reflect(-v, n)), smoothstep(0.1, 0.7, vLit.a));
  float ndh = max(dot(n, normalize(uSunDir.xyz + v)), 0.0);
  vec3 glint = vLit.rgb * min(pow(ndh, 300.0) * 5.0, 6.0);
  vec3 light = vLit.rgb * (max(uSunDir.y, 0.0) * 0.5 + 0.2) + uAmbSky.rgb * (0.3 + 0.7 * vLit.a);
  // How much of it is air and droplets: white where the streak is thick.
  float white = clamp(vBlob.w * (0.45 + 1.1 * streak), 0.0, 0.85);
  vec3 foam = vec3(0.8, 0.84, 0.87) * light;
  // Mist with drops in it; many of them make a body.
  float a = min(dr.x * 5.0, 1.0) * (0.4 + 0.5 * white) * fade * vThin;
  vec2 uv = gl_FragCoord.xy * uScreen.xy;
#ifdef WATER_REFRACT
  // A lens: what is behind it, shifted by the way its surface leans.
  vec2 off = clamp(vec2(dot(n, uCamRight.xyz), dot(n, uCamUp.xyz)) * (0.3 * vBlob.y / max(z * uProj.w, 0.05)), -0.04, 0.04);
  if (viewZ(textureLod(uDepth, uv + off, 0.0).r) < z) off = vec2(0.0);
  vec3 behind = dec(textureLod(uScene, uv + off, 0.0).rgb) * vec3(0.88, 0.96, 0.95);
  // (The lens replaces what it covers: it is drawn at twice the weight.)
  a = min(a * 2.0, 1.0);
  vec3 col = mix(behind, foam, white) * (1.0 - fres) + env * fres + glint;
#else
  vec3 col = mix(SCATTER * light * 4.0, foam, white) * (1.0 - fres) + env * fres + glint;
  a = min(a * (0.6 + 0.9 * white + fres), 1.0);
#endif
  vec3 toP = vCentre.xyz - uCamPos.xyz;
  float dist = length(toP);
  col = hazed(col, toP / max(dist, 1e-4), fogAmount(toP, dist));
  if (a < 0.004) discard;
  oColor = vec4(enc(col) * a, a);
}
`;

// The side of a still body that stands over the eye: a pond seen through
// the hole in its dam, a tank through the hole in its wall. One quad a side
// of every rectangle whose level is over the eye, from its edge down to its
// bed; thrown out here where it is seen from inside or has water of its own
// body beside it, and hidden by whatever solid stands in front of it (it
// lies a finger inside the body). It is water about to come out: white
// strands falling from the top, the body's colour lower down. Drawn before
// the surfaces.
export const WATER_SIDE_VS = `
${FRAME}
layout(location = 0) in vec4 aRect;   // x0, z0, x1, z1 (m)
layout(location = 1) in vec4 aBody;   // level (m), the water's speed x and z there (m/s), depth at the deepest (m)
uniform sampler2D uFlowMap;           // the still water from above (WATER_FLOW_FS)
uniform vec4 uSideInv;                // 1 / the map's width and depth in metres, -, whether the map is this frame's
out vec3 vWorld;
out float vZ;
out vec2 vFall;                       // metres below the level, metres along the edge
flat out vec3 vOut;
void main() {
  int side = gl_VertexID / 6, k = gl_VertexID - side * 6;
  vWorld = vec3(0.0);
  vZ = 0.0;
  vFall = vec2(0.0);
  vOut = vec3(0.0, 0.0, 1.0);
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  if (uSideInv.w <= 0.0 || aBody.x < uCamPos.y + 0.3) return;
  vec2 a, b, o;
  if (side == 0) { a = aRect.xy; b = aRect.zy; o = vec2(0.0, -1.0); }
  else if (side == 1) { a = aRect.zy; b = aRect.zw; o = vec2(1.0, 0.0); }
  else if (side == 2) { a = aRect.zw; b = aRect.xw; o = vec2(0.0, 1.0); }
  else { a = aRect.xw; b = aRect.xy; o = vec2(-1.0, 0.0); }
  vec2 mid = 0.5 * (a + b);
  if (dot(uCamPos.xz - mid, o) <= 0.0) return;
  float end = k == 1 || k == 3 || k == 4 ? 1.0 : 0.0, down = k == 2 || k == 4 || k == 5 ? 1.0 : 0.0;
  vec2 xz = mix(a, b, end);
  float fall = down * min(aBody.w, 6.0);
  vec3 p = vec3(xz.x - o.x * 0.03, aBody.x - fall, xz.y - o.y * 0.03);
  vWorld = p;
  vFall = vec2(fall, dot(xz, vec2(-o.y, o.x)));
  vOut = vec3(o.x, 0.0, o.y);
  gl_Position = uViewProj * vec4(p, 1.0);
  vZ = gl_Position.w;
}
`;

export const WATER_SIDE_FS = `
${HEAD}
${SHADE}
uniform sampler2D uFlowMap;
uniform vec4 uSideInv;
in vec3 vWorld;
in float vZ;
in vec2 vFall;
flat in vec3 vOut;
void main() {
  float zs = viewZ(texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r);
  if (zs < vZ) discard;
  // (Water of the same body beside it: no face there.)
  vec4 mo = textureLod(uFlowMap, (vWorld.xz + vOut.xz * 0.3) * uSideInv.xy, 0.0);
  if (mo.r > 0.5 && vWorld.y < mo.g / mo.r + 0.02) discard;
  // Strands that fall, faster the further down, and thin out: a metre
  // under the level the body shows through them.
  float time = uCamPos.w;
  vec4 w = texture(uWaves, vec2(vFall.y * 0.47, (vFall.x - time * (1.6 + 1.2 * sqrt(max(vFall.x, 0.0)))) * 0.13));
  float foam = (0.42 + 0.4 * w.b) * (1.0 - 0.6 * smoothstep(0.3, 1.8, vFall.x));
  vec3 n = normalize(vOut + vec3(vOut.z, 0.0, -vOut.x) * ((w.r - 0.5) * 0.5) + vec3(0.0, (w.g - 0.5) * 0.5, 0.0));
  oColor = shadeWater(vWorld, vOut, n, vZ, clamp(zs - vZ, 0.0, 8.0), 1.0, min(foam, 0.72), 0.4 + 0.6 * w.b, 0.0);
}
`;

// What the still water has just been through, a map from above
// (render_water.js, `_landPass`; a texel a quarter of a metre; r: white
// where water in the air has come down, 0..1; g: the level there a moment
// ago (m; -1000: no water); b: how fast the level is rising or lately rose
// (m/s)). The still water reads r as white, and b to know a front that
// travels from a step that stands. Each parcel about to meet the level
// under it (its flight carried on to the level the map of still water
// gives) adds a patch where it lands; the fade pass lets what is there
// die away over a second or two and carries it with the water's flow.
// Hundreds a second are the white foot of a pour; one drop is a fleck of
// lace that is gone in a moment.
export const WATER_LAND_VS = `
layout(location = 0) in vec4 aPos;    // xyz (m), radius (m)
layout(location = 1) in vec4 aVel;    // xyz (m/s), age (s)
uniform sampler2D uFlowMap;           // the still water from above (makeFlowMap)
uniform vec4 uFlowInv;                // 1 / the map's width and depth in metres; z: seconds this frame covers; w: whether there is a map
out vec2 vQ;
flat out float vHit;
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vQ = c;
  vHit = 0.0;
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  if (uFlowInv.w <= 0.0) return;
  vec3 p = aPos.xyz, v = aVel.xyz;
  vec4 m = textureLod(uFlowMap, p.xz * uFlowInv.xy, 1.0);
  if (m.r < 0.03 || v.y > 1.0) return;
  float lv = m.g / m.r, h = p.y - lv;
  if (h < -0.25) return;
  // (The time to the level, and where that is. Only what lands in the
  // steps this frame covers: a parcel is written once, as it goes in.)
  float t = (v.y + sqrt(v.y * v.y + 19.6 * max(h, 0.0))) / 9.8;
  if (t > uFlowInv.z) return;
  vec2 at = p.xz + v.xz * t;
  vec4 ml = textureLod(uFlowMap, at * uFlowInv.xy, 1.0);
  // (Onto this water, not onto a bank or a pond a storey up.)
  if (ml.r < 0.03 || abs(ml.g / ml.r - lv) > 0.6) return;
  float own = fract(sin(dot(aVel.xz, vec2(12.9898, 78.233)) + aPos.w * 311.7) * 43758.5453);
  // (A little off its own landing, each its own way: what boils round a
  // pour's foot is wider than the pour.)
  float turn = fract(own * 9.17) * 6.283;
  at += vec2(cos(turn), sin(turn)) * (0.35 * fract(own * 4.71));
  float r = 0.3 + 0.3 * own;
  // (By how hard it comes down, and how much of it there is.)
  vHit = (0.2 + 0.25 * smoothstep(2.0, 7.0, -v.y)) * (0.6 + 0.4 * smoothstep(0.03, 0.12, aPos.w));
  gl_Position = vec4((at + c * r) * uFlowInv.xy * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const WATER_LAND_FS = `
in vec2 vQ;
flat in float vHit;
out vec4 oColor;
void main() {
  float body = max(1.0 - dot(vQ, vQ), 0.0);
  oColor = vec4(body * body * vHit, 0.0, 0.0, 0.0);
}
`;

export const WATER_LAND_FADE_FS = `
uniform sampler2D uLanded;            // the map as it was
uniform sampler2D uFlowMap;
uniform vec4 uFlowInv;                // -, -, -, whether there is a map of still water
uniform vec4 uFade;                   // seconds passed over the map's width and depth (m), what is kept of the white, what is taken off it
uniform vec4 uRise;                   // seconds passed, what is kept of a rise that is over
in vec2 vUv;
out vec4 oColor;
void main() {
  vec2 uv = vUv;
  vec4 was = texture(uLanded, vUv);
  float level = -1000.0, rise = was.b * uRise.y;
  if (uFlowInv.w > 0.0) {
    // (Carried with the water: under a pour in a river the white trails
    // away down the current.)
    vec4 m = textureLod(uFlowMap, uv, 1.0);
    if (m.r > 0.03) uv -= m.ba / m.r * uFade.xy;
    // The level a cell wide, against what it was here a moment ago: where
    // a front passes it rises metres a second, and that is remembered for
    // a third of a second behind it.
    vec4 wide = textureLod(uFlowMap, vUv, 2.0);
    if (wide.r > 0.03) {
      level = wide.g / wide.r;
      if (was.g > -500.0) rise = max(rise, (level - was.g) / uRise.x);
    }
  }
  oColor = vec4(max(texture(uLanded, uv).r * uFade.z - uFade.w, 0.0), level, rise, 0.0);
}
`;

// The frame from under a surface: everything is seen through water, as far
// as the scene or, looking up, the surface. Two draws: the first takes out
// what the water absorbs (blended by multiplying), the second adds the
// water's own colour.
export const WATER_UNDER_FS = `
${FRAME}
${OPTICS}
uniform sampler2D uDepth;
uniform vec4 uUnder;   // height of the surface over the camera (m), which draw (0 absorb, 1 scatter), light in the water
in vec2 vUv;
out vec4 oColor;
void main() {
  float d = texelFetch(uDepth, ivec2(gl_FragCoord.xy), 0).r;
  float z = 2.0 * uProj.x * uProj.y / (uProj.y + uProj.x - (d * 2.0 - 1.0) * (uProj.y - uProj.x));
  // The ray through this pixel at unit view depth (as the sky pass builds it).
  vec2 q = vUv * 2.0 - 1.0;
  vec3 ray = uCamFwd.xyz + uCamRight.xyz * (q.x * uProj.z) + uCamUp.xyz * (q.y * uProj.w);
  if (ray.y > 1e-4) z = min(z, uUnder.x / ray.y);
  float path = z * length(ray);
  vec3 T = exp(-ABSORB * (0.12 + 0.35 * path));
  if (uUnder.y < 0.5) {
#ifdef HDR_ENCODE
    oColor = vec4(1.0 - sqrt(T), 0.0);
#else
    oColor = vec4(1.0 - T, 0.0);
#endif
  } else {
    vec3 light = uSunCol.rgb * (max(uSunDir.y, 0.0) * 0.5) + uAmbSky.rgb;
    vec3 c = SCATTER * light * (uUnder.z * 2.2 * (1.0 - exp(-0.9 * path)));
#ifdef HDR_ENCODE
    c = sqrt(min(c, 16.0) * 0.0625);
#endif
    oColor = vec4(c, 0.0);
  }
}
`;

// Where water lies and has lain (render_water.js, the map of what is wet):
// a map of the world from above, a texel a water column, that the surface
// shader reads to draw wet ground. r: wetness, 1 where water lies, lowered
// to 0 by WATER_WET_DRY_FS as time passes; g: the wet line, the world
// height the water stands or last stood at (m); b: r times that line, so
// that a reader who filters the map gets the line itself at the rim of a
// wet patch (b / r) whatever the dry texel beside it holds; a: the bed the
// water lay on (m), under which the wet line does not go while the place
// is wet at all: a floor stays wet as long as its wetness lasts, a wall
// dries from the top down to it. Water is written with a MAX blend, so
// what is there is never lowered by water that is lower.
//
// Moving water: one quad a tile; a texel is a column of its patch.
export const WATER_WET_TILE_VS = `
layout(location = 0) in vec4 aTile;   // x0, z0 (m), the height its patch is relative to (m), patch index
uniform vec4 uWetInv;                 // 1 / the map's width and depth in metres
uniform ivec4 uAtlas;                 // patches in a column of the atlas
out vec2 vCol;                        // column of the tile, 0..16
flat out ivec2 vOrg;                  // the patch's first texel in the atlas
flat out float vBase;
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  int slot = int(aTile.w + 0.5);
  vOrg = ivec2((slot / uAtlas.x) * 18, (slot % uAtlas.x) * 18);
  vCol = c * 16.0;
  vBase = aTile.z;
  gl_Position = vec4((aTile.xy + c * 1.6) * uWetInv.xy * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const WATER_WET_TILE_FS = `
uniform sampler2D uPatch;
in vec2 vCol;
flat in ivec2 vOrg;
flat in float vBase;
out vec4 oColor;
void main() {
  vec2 w = texelFetch(uPatch, vOrg + 1 + ivec2(clamp(vCol, 0.0, 15.5)), 0).rg;
  // (A column with a film on it is wet; one the patch only carries the
  // surface on to, a dry lip, is not.)
  if (w.g <= 0.0005) discard;
  oColor = vec4(1.0, vBase + w.r, vBase + w.r, vBase + w.r - w.g);
}
`;

// Still water: one quad a rectangle of a body's footprint.
export const WATER_WET_RECT_VS = `
layout(location = 0) in vec4 aRect;   // x0, z0, x1, z1 (m)
layout(location = 1) in vec4 aBody;   // level (m), current x and z, depth at the deepest (m)
uniform vec4 uWetInv;
flat out vec2 vLevel;                 // the level and the bed at the body's deepest (m)
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vLevel = vec2(aBody.x, aBody.x - aBody.w);
  gl_Position = vec4(mix(aRect.xy, aRect.zw, c) * uWetInv.xy * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const WATER_WET_RECT_FS = `
flat in vec2 vLevel;
out vec4 oColor;
void main() {
  oColor = vec4(1.0, vLevel.x, vLevel.x, vLevel.y);
}
`;

// Drying: the map as it was, written into its other copy a little drier.
// uDry x: wetness taken off, y: metres the wet line comes down (where it is
// still wet at all).
export const WATER_WET_DRY_FS = `
uniform sampler2D uWetWas;
uniform vec4 uDry;
out vec4 oColor;
void main() {
  vec4 w = texelFetch(uWetWas, ivec2(gl_FragCoord.xy), 0);
  float r = max(w.r - uDry.x, 0.0);
  float g = max(w.g - uDry.y, w.a + 0.02);
  // (Dry: the line and the bed are forgotten. Kept, they came back with
  // the next film that lay there, a metre and a half over it.)
  oColor = r > 0.0 ? vec4(r, g, r * g, w.a) : vec4(0.0, -1000.0, 0.0, -1000.0);
}
`;

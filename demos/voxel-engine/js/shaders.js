// GLSL shared by every pass. Geometry is vertex-pulled: no attributes, every
// quad is one RG32UI texel looked up and expanded from gl_VertexID (layout:
// engine/src/quads.rs).
// Sources carry no #version line; render_gl.js prepends it with the defines
// that select quality-tier variants.
import { VOXEL } from './engine.js';
import { SURFACE, PAT } from './render_shaders_surface.js';
import { LIGHT_TILE } from './render_frame.js';

// Per-frame constants live in one uniform block so a frame costs a single
// buffer upload no matter how many programs run. Everything is a vec4 or mat4
// so the std140 layout is the obvious one; offsets are mirrored in
// render_frame.js.
export const FRAME = `
layout(std140) uniform Frame {
  mat4 uViewProj;
  mat4 uInvViewProj;
  mat4 uPrevViewProj;
  mat4 uShadowMat[3];   // world -> cascade-local uv + depth
  vec4 uCamPos;         // xyz, time (s)
  vec4 uSunDir;         // xyz toward the sun, w = shadow strength
  vec4 uSunCol;         // direct sun radiance, w = disc brightness
  vec4 uSkyZenith;      // rgb, w = cloud cover
  vec4 uSkyHorizon;     // rgb, w = cloud brightness
  vec4 uSunGlow;        // rgb halo/horizon tint toward the sun, w = strength
  vec4 uAmbSky;         // hemisphere ambient from above
  vec4 uAmbGround;      // hemisphere ambient from below (ground bounce)
  vec4 uFog;            // rgb, w = density (1/m) at the base height
  vec4 uFogParams;      // height falloff (1/m), base height, sun in-scatter, max opacity
  vec4 uShadowParams;   // 1/atlas width, 1/atlas height, kernel world radius, cascade count
  vec4 uCascadeTexel;   // world size of one shadow texel per cascade
  vec4 uOccInv;         // 1 / AO volume size in metres, GL axis order (x, z, y)
  vec4 uSkyVisInv;      // 1 / sky-visibility volume size in metres, GL axis order; w = share of their opacity dust and smoke are drawn at (render_particles.js: less while things fall)
  vec4 uScreen;         // 1/w, 1/h, w, h of the scene target
  vec4 uProj;           // near, far, tan(fovx/2), tan(fovy/2)
  vec4 uCamRight;       // xyz, w = exposure
  vec4 uCamUp;          // xyz, w = frame counter
  vec4 uCamFwd;         // xyz, w = point-light count
  vec4 uGround;         // terrain beyond the world: linear albedo, w = height (m)
  vec4 uDynMap;         // contact map: origin x, origin z, 1 / size (0 = nothing in it), lowest height
  vec4 uSoftMap[3];     // world -> soft shadow map (render_particles.js): rows giving u, v and depth; all zero = nothing in it
  vec4 uLights[64];     // per light: [xyz, 1/radius^2], [rgb, 1 = has an occlusion map]
};
`;

export const QUAD_DECODE = `
#define VOXEL_M ${VOXEL.toFixed(4)}
uniform usampler2D uQuads;
uniform sampler2D uXf;
// One bit per material: set when the palette marks it transparent.
uniform uint uTransMask[8];
// The run of quad slots this instance draws (see decodeQuad).
layout(location = 0) in uint aRun;

struct Quad {
  vec3 local;   // corner position in the owning grid, voxels
  vec3 world;   // metres
  vec4 rq;      // body rotation
  vec3 pat;     // pattern offset (voxels)
  vec3 du;      // the quad's two edge directions (local axes)
  vec3 dv;
  vec3 wu;      // the same directions in world space
  vec3 wv;
  vec2 corner;  // -1 or +1 along du and dv for this vertex
  int mat;
  int face;
  int body;     // 0 = the static world
  ivec2 size;   // extent in voxels along du and dv
  bool glass;
};

// Decodes the quad for this vertex. Returns false for an empty slot (the
// draw lists skip those, so this only guards against a stale index) and
// for a slot past the end of its run.
bool decodeQuad(out Quad o) {
  // Indexed and instanced. An instance is a run of up to 32 consecutive
  // slots of the quad texture (aRun: the first slot in its low 26 bits,
  // how many less one above them; render_geom.js, QuadLists._submit), and
  // the indices are the same for every run: four vertices per quad (index
  // = slot within the run * 4 + corner), a third fewer vertex-shader runs
  // than two independent triangles. So a draw list of any number of spans
  // is one draw call.
  int k = gl_VertexID >> 2;
  if (k > int(aRun >> 26u)) return false;
  int qi = int(aRun & 0x3ffffffu) + k;
  int ci = gl_VertexID & 3;
  uvec2 q = texelFetch(uQuads, ivec2(qi & 2047, qi >> 11), 0).rg;
  uint lo = q.r, hi = q.g;
  int mat = int((hi >> 11) & 255u);
  if (mat == 0) return false;
  o.mat = mat;
  o.glass = ((uTransMask[mat >> 5] >> uint(mat & 31)) & 1u) != 0u;
  vec3 p = vec3(float(lo & 1023u), float((lo >> 10) & 1023u), float((lo >> 20) & 1023u));
  uint face = (lo >> 30) | ((hi & 1u) << 2);
  float w = float(((hi >> 1) & 31u) + 1u);
  float h = float(((hi >> 6) & 31u) + 1u);
  int body = int(hi >> 19);
  uint d = face >> 1;
  bool pos = (face & 1u) == 1u;
  vec2 c = vec2(float(ci & 1), float(ci >> 1));
  if (!pos) c = c.yx;
  vec3 dn, du, dv;
  if (d == 0u) { dn = vec3(1, 0, 0); du = vec3(0, 1, 0); dv = vec3(0, 0, 1); }
  else if (d == 1u) { dn = vec3(0, 1, 0); du = vec3(0, 0, 1); dv = vec3(1, 0, 0); }
  else { dn = vec3(0, 0, 1); du = vec3(1, 0, 0); dv = vec3(0, 1, 0); }
  o.local = p + du * (c.x * w) + dv * (c.y * h) + (pos ? dn : vec3(0.0));
  o.du = du;
  o.dv = dv;
  o.size = ivec2(int(w), int(h));
  o.corner = c * 2.0 - 1.0;
  o.face = int(face);
  o.body = body;
  if (body == 0) {
    // The static world never moves: skip the transform fetches.
    o.rq = vec4(0.0, 0.0, 0.0, 1.0);
    o.pat = vec3(0.0);
    o.world = o.local * VOXEL_M;
    o.wu = du;
    o.wv = dv;
  } else {
    ivec2 t = ivec2((body & 255) * 4, body >> 8);
    o.rq = texelFetch(uXf, t, 0);
    vec4 os = texelFetch(uXf, t + ivec2(1, 0), 0);
    o.pat = texelFetch(uXf, t + ivec2(2, 0), 0).xyz;
    o.world = os.xyz + qrot(o.rq, o.local * os.w);
    o.wu = qrot(o.rq, du);
    o.wv = qrot(o.rq, dv);
  }
  return true;
}
`;

// Sky gradient, haze and fog. skyBase is the cheap part (gradient + sun halo)
// used for ambient reflections and fog colour; the sky pass adds disc and clouds.
export const ATMOSPHERE = `
vec3 skyBase(vec3 d) {
  float h = max(d.y, 0.0);
  float sd = max(dot(d, uSunDir.xyz), 0.0);
  vec3 c = mix(uSkyHorizon.rgb, uSkyZenith.rgb, 1.0 - exp(-h * 3.0));
  // Forward scattering: a wide warm halo that hugs the horizon plus a tight one.
  float low = exp(-h * 5.0);
  float sd2 = sd * sd;
  float sd8 = sd2 * sd2; sd8 *= sd8;
  c += uSunGlow.rgb * (uSunGlow.w * (sd2 * 0.18 * low + sd8 * 0.22 * (0.35 + 0.65 * low) + sd8 * sd8 * sd8 * sd8 * 0.5));
  return c;
}

// What a mirror shows of the world around it: the sky above the horizon
// and, below it, the ground in the light of the day (the scene's lawn and
// its streets: half the terrain colour, half grey).
vec3 mirrorEnv(vec3 d) {
  vec3 ground = mix(uGround.rgb, vec3(0.11), 0.7) * (uSunCol.rgb * (max(uSunDir.y, 0.0) * 0.7) + uAmbSky.rgb);
  return mix(ground, skyBase(d), smoothstep(-0.12, 0.06, d.y));
}

// Exponential height fog, integrated analytically along the view ray.
float fogAmount(vec3 v, float dist) {
  float k = uFogParams.x;
  float dy = v.y;
  float t = k * dy;
  float f = abs(t) > 1e-3 ? (1.0 - exp(-t)) / t : 1.0;
  float od = uFog.w * dist * exp(-k * (uCamPos.y - uFogParams.y)) * f;
  return min(1.0 - exp(-od), uFogParams.w);
}

vec3 fogColor(vec3 vn) {
  float sd = max(dot(vn, uSunDir.xyz), 0.0);
  float sd2 = sd * sd;
  return uFog.rgb + uSunGlow.rgb * (uFogParams.z * (sd2 * 0.25 + sd2 * sd2 * sd2 * 0.75));
}

// A colour seen along vn through that amount of haze. Aerial perspective:
// the air takes blue out of the line of sight first and puts blue into it
// first, so the middle distance goes cooler and flatter well before the far
// distance goes pale; thin haze is blue, thick haze the white of the horizon.
vec3 hazed(vec3 col, vec3 vn, float amount) {
  // (t to the powers 0.9, 1 and 1.16, to first order: no pow per pixel.)
  vec3 t = (1.0 - amount) * (1.0 + vec3(0.1, 0.0, -0.16) * amount);
  return col * t + fogColor(vn) * mix(vec3(0.93, 0.98, 1.05), vec3(1.0), amount) * (1.0 - t);
}

vec3 applyFog(vec3 col, vec3 wp) {
  vec3 v = wp - uCamPos.xyz;
  float dist = length(v);
  return hazed(col, v / max(dist, 1e-4), fogAmount(v, dist));
}
`;

export const UTIL = `
vec3 qrot(vec4 q, vec3 v) {
  vec3 t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}
vec3 faceNormal(int face) {
  float s = (face & 1) == 1 ? 1.0 : -1.0;
  int d = face >> 1;
  return d == 0 ? vec3(s, 0.0, 0.0) : (d == 1 ? vec3(0.0, s, 0.0) : vec3(0.0, 0.0, s));
}
// Interleaved gradient noise: a cheap, well-distributed per-pixel dither.
// (Written into the place that asks, not called.)
#define ign(p) fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))))
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
`;

// Dynamic point lights: smooth windowed falloff, loop bounded by the live
// light count so zero lights cost nothing. They cast no shadow maps; with
// LIGHT_OCC each light instead carries a small octahedral map of the distance
// to the first wall in every direction (render_lights.js), so a blast or a
// fire does not light the far side of a wall, for one tap per light in range.
export const LIGHTS = `
#ifdef LIGHT_OCC
uniform sampler2D uLightOcc;
// Must mirror octDecode in render_lights.js: centre of the map looks down.
vec2 octEncode(vec3 d) {
  d /= abs(d.x) + abs(d.y) + abs(d.z);
  vec2 e = d.y <= 0.0 ? d.xz : (1.0 - abs(d.zx)) * vec2(d.x >= 0.0 ? 1.0 : -1.0, d.z >= 0.0 ? 1.0 : -1.0);
  return e * 0.5 + 0.5;
}
// Light i at lpos reaching p. A lit surface point, tested 0.3 m off its
// surface, has the mapped wall along its ray behind it, or at most a few
// centimetres in front where another surface meets it in a corner; a point
// shadowed by even a one-voxel wall has it 0.15 m or more in front. The
// ramp runs between the two.
float lightVisibility(int i, vec3 lpos, float radius, vec3 p) {
  vec3 d = p - lpos;
  float dist = length(d);
  const float half_texel = 0.5 / ${LIGHT_TILE}.0;
  vec2 e = clamp(octEncode(d / max(dist, 1e-4)), half_texel, 1.0 - half_texel);
  vec2 uv = (vec2(float(i & 7), float(i >> 3)) + e) * vec2(0.125, 0.25);
  float wall = textureLod(uLightOcc, uv, 0.0).r * radius;
  return clamp((wall - dist) * 6.0 + 0.9, 0.0, 1.0);
}
#endif
// from: the point whose visibility is tested. For a surface it must be about
// 0.3 m off it along the normal: rays are marched through a 0.2 m density
// volume and would otherwise graze the surface's own cells.
vec3 pointLights(vec3 wp, vec3 n, float wrap, vec3 from) {
  vec3 sum = vec3(0.0);
  int cnt = int(uCamFwd.w);
  for (int i = 0; i < cnt; i++) {
    vec4 lp = uLights[2 * i];
    vec3 d = lp.xyz - wp;
    float d2 = dot(d, d);
    float x = d2 * lp.w;
    if (x < 1.0) {
      float win = 1.0 - x;
      float ndl = dot(n, d) * inversesqrt(d2 + 1e-4);
      float w = win * win / (1.0 + 10.0 * x) * clamp(ndl * (1.0 - wrap) + wrap, 0.0, 1.0);
      vec4 lc = uLights[2 * i + 1];
#ifdef LIGHT_OCC
      // (lc.w: 0 for a light with no map; else its map's reach over its reach now: render_lights.js.)
      if (w > 0.0 && lc.w > 0.5) w *= lightVisibility(i, lp.xyz, inversesqrt(lp.w) * lc.w, from);
#endif
      sum += lc.rgb * w;
    }
  }
  // Lamps and blasts roll off instead of clipping: next to the source the
  // light is many times what it is across the forecourt, and no exposure
  // holds both. The sum is bent over toward a ceiling, keeping its colour,
  // so paving under a row of lamps keeps its joints and a wall beside a
  // blast its bricks.
  return sum / (1.0 + dot(sum, vec3(0.2126, 0.7152, 0.0722)) * 0.2);
}
#ifdef WET_STREET
// What a film of water gives back of the lamps and signs (a street after
// rain, renderer.wetStreet): one GGX lobe a light, with water's Fresnel, so
// that it is a streak toward the eye at a low angle and next to nothing
// seen from above. A light's reflection is seen farther off than its pool
// of light reaches: twice as far, with the same window. Rolled off like
// the pools, to a ceiling near the lamp's own glow.
vec3 pointGlints(vec3 wp, vec3 n, vec3 v, float rough, vec3 from) {
  vec3 sum = vec3(0.0);
  int cnt = int(uCamFwd.w);
  float a = rough * rough, a2 = a * a;
  float ndv = max(dot(n, v), 1e-3);
  for (int i = 0; i < cnt; i++) {
    vec4 lp = uLights[2 * i];
    vec3 d = lp.xyz - wp;
    float d2 = dot(d, d);
    float x = d2 * lp.w * 0.25;
    if (x < 1.0) {
      vec3 l = d * inversesqrt(d2 + 1e-4);
      float ndl = dot(n, l);
      if (ndl > 0.0) {
        vec3 h = normalize(l + v);
        float ndh = max(dot(n, h), 0.0);
        float dd = ndh * ndh * (a2 - 1.0) + 1.0;
        float f = 1.0 - max(dot(l, h), 0.0);
        float f2 = f * f;
        float win = 1.0 - x;
        float w = win * win / (1.0 + 10.0 * x) * ndl * (0.02 + 0.98 * f2 * f2 * f) * min(a2 / (dd * dd) * 0.25 / (ndl * ndv + 0.05), 60.0);
        vec4 lc = uLights[2 * i + 1];
#ifdef LIGHT_OCC
        if (w > 0.0 && lc.w > 0.5) w *= lightVisibility(i, lp.xyz, inversesqrt(lp.w) * lc.w, from);
#endif
        sum += lc.rgb * w;
      }
    }
  }
  return sum / (1.0 + dot(sum, vec3(0.2126, 0.7152, 0.0722)) * 0.2);
}
#endif
`;

// Cascaded sun shadows from one depth atlas (cascades side by side along u).
// Hardware PCF taps on a per-pixel rotated disc; the receiver is pushed along
// its normal in proportion to the texel size and kernel radius, which is what
// keeps 10 cm voxels free of both acne and peter-panning.
// Defines: CASCADES (1..3), SHADOW_TAPS (1, 4, 8, 12), SHADOW_MAX_R, SHADOW_BLEND.
export const SHADOW = `
uniform sampler2DShadow uShadow;
// Taps come in axis-aligned 2x2 blocks exactly one texel apart. Four bilinear
// PCF lookups arranged like that weight all four texel parities equally, so
// the 1-in-4 stipple that stands for glass in the depth atlas resolves to an
// even quarter-strength shadow wherever the block lands, never to a dot
// pattern. Penumbra width comes from spreading the block centres on a
// per-pixel rotated ring.
#define SHADOW_QUADS (SHADOW_TAPS / 4)
#if SHADOW_QUADS == 2
const vec2 RING[2] = vec2[](vec2(0.75, 0.0), vec2(-0.75, 0.0));
#elif SHADOW_QUADS == 3
const vec2 RING[3] = vec2[](vec2(0.8, 0.0), vec2(-0.4, 0.693), vec2(-0.4, -0.693));
#endif

vec3 shadowCoord(int i, vec3 wp, vec3 n, float ndl, float footprint, out float edge, out float rTex) {
  float texel = uCascadeTexel[i];
  // The kernel never shrinks below the pixel's own footprint: shadow detail
  // finer than a pixel (stepped roofs, foliage far away) would otherwise
  // sparkle instead of averaging out.
#if SHADOW_MAX_R == 1
  // (clamp(x, 1, 1).)
  rTex = 1.0;
#else
  rTex = clamp(max(uShadowParams.z, footprint) / texel, 1.0, float(SHADOW_MAX_R));
#endif
  vec3 p = wp + n * (texel * (0.9 + rTex) * (1.3 - ndl));
  vec3 s = (uShadowMat[i] * vec4(p, 1.0)).xyz;
  vec2 m = min(s.xy, 1.0 - s.xy);
  edge = min(m.x, m.y);
  return s;
}

// (One block of four, or one tap, takes neither the kernel's radius nor a
// turn: they are not handed over where nothing reads them.)
#if SHADOW_QUADS > 1
#define SHADOW_TAPS_AT(i, s, rTex, rot) shadowTaps(i, s, rTex, rot)
float shadowTaps(int i, vec3 s, float rTex, vec2 rot) {
#else
#define SHADOW_TAPS_AT(i, s, rTex, rot) shadowTaps(i, s)
float shadowTaps(int i, vec3 s) {
#endif
  float cw = 1.0 / uShadowParams.w;
  vec2 base = vec2((s.x + float(i)) * cw, s.y);
  float z = min(s.z, 1.0);
#if SHADOW_TAPS == 1
  return textureLod(uShadow, vec3(base, z), 0.0);
#else
  vec2 h = uShadowParams.xy * 0.5;
#if SHADOW_MAX_R > 1 && SHADOW_QUADS > 1
  vec2 st = uShadowParams.xy * max(rTex - 1.0, 0.0);
#endif
  float sum = 0.0;
#if SHADOW_QUADS == 1
  // (One block of four: no loop, and no ring. A single block moved round a
  // ring has to be turned from pixel to pixel to spread at all, and on a
  // tier with no pass over time to average the turning that was a
  // two-pixel checkerboard through every penumbra. It stays where it is:
  // three texels of penumbra, the stipple's parities still even, nothing
  // to turn. The kernel's radius still pushes the receiver off its
  // surface, in shadowCoord.)
  {
    vec2 c = base;
#else
  for (int k = 0; k < SHADOW_QUADS; k++) {
    vec2 o = RING[k];
#if SHADOW_MAX_R > 1
    vec2 c = base + vec2(o.x * rot.x - o.y * rot.y, o.x * rot.y + o.y * rot.x) * st;
#else
    // (A kernel of one texel: the ring has no radius, and nothing to turn.)
    vec2 c = base;
#endif
#endif
    sum += textureLod(uShadow, vec3(c - h, z), 0.0) + textureLod(uShadow, vec3(c + vec2(h.x, -h.y), z), 0.0)
         + textureLod(uShadow, vec3(c + vec2(-h.x, h.y), z), 0.0) + textureLod(uShadow, vec3(c + h, z), 0.0);
  }
  return sum * (1.0 / float(SHADOW_TAPS));
#endif
}

// Fraction of sunlight reaching wp (1 = lit). noise in [0, 1); footprint is
// the world-space size of the shaded pixel (0 when it does not matter).
float sunShadow(vec3 wp, vec3 n, float ndl, float noise, float footprint) {
#if SHADOW_MAX_R > 1 && SHADOW_QUADS > 1
  float ang = noise * 6.2831853;
  vec2 rot = vec2(cos(ang), sin(ang));
#else
  const vec2 rot = vec2(1.0, 0.0);
#endif
  float edge, rTex;
  // Keep the kernel off the neighbouring cascade in the atlas.
  float margin = uShadowParams.y * (float(SHADOW_MAX_R) + 2.0);
  const float band = 0.05;
#if CASCADES == 2 && !defined(SHADOW_BLEND)
  // (Two cascades and a dithered hand-over: the pixel takes the one or the
  // other, and the taps are written once, at the one it takes. Written as
  // below, a return in a branch and the taps again after it, a rasteriser
  // that runs both arms of every branch took them twice in every pixel.)
  float edge0, rTex0;
  vec3 s0 = shadowCoord(0, wp, n, ndl, footprint, edge0, rTex0);
  float w = (edge0 - margin) / band;
  bool first = w > 0.0 && w >= fract(noise * 7.0 + 0.37);
  vec3 s = shadowCoord(1, wp, n, ndl, footprint, edge, rTex);
  if (!first && edge < margin) return 1.0;
  if (first) { s = s0; rTex = rTex0; }
  return SHADOW_TAPS_AT(first ? 0 : 1, s, rTex, rot);
#else
#if CASCADES > 1
  for (int i = 0; i < CASCADES - 1; i++) {
    vec3 s = shadowCoord(i, wp, n, ndl, footprint, edge, rTex);
    float w = (edge - margin) / band;
    if (w > 0.0) {
#ifdef SHADOW_BLEND
      float a = SHADOW_TAPS_AT(i, s, rTex, rot);
      if (w >= 1.0) return a;
      float e2, r2;
      vec3 s2 = shadowCoord(i + 1, wp, n, ndl, footprint, e2, r2);
      return mix(SHADOW_TAPS_AT(i + 1, s2, r2, rot), a, w);
#else
      // Dithered hand-over to the next cascade inside the transition band.
      if (w >= fract(noise * 7.0 + 0.37)) return SHADOW_TAPS_AT(i, s, rTex, rot);
#endif
    }
  }
#endif
  vec3 s = shadowCoord(CASCADES - 1, wp, n, ndl, footprint, edge, rTex);
  if (edge < margin) return 1.0;
  return SHADOW_TAPS_AT(CASCADES - 1, s, rTex, rot);
#endif
}
`;

// Sunlight left at a point once what the shadow atlas does not hold has had
// its share: debris in flight and at rest, and the dust and smoke of a
// collapse. One tap of the soft shadow map (render_particles.js), which is
// drawn from the sun over the 41 m around the camera.
export const SOFT_SHADOW = `
uniform sampler2D uSoft;  // r: the debris nearest the light (depth), g: how far outside it (0 behind it, 1 at its rim), b: dust along the ray, a: that times its depth
// dust: how hard the dust shades (1 for a surface; a puff of the cloud
// itself takes more, so that the cloud has a lit side and a dark heart).
float softShadow(vec3 wp, float dust) {
  if (uSoftMap[2].xyz == vec3(0.0)) return 1.0;
  vec3 s = vec3(dot(uSoftMap[0].xyz, wp) + uSoftMap[0].w, dot(uSoftMap[1].xyz, wp) + uSoftMap[1].w, dot(uSoftMap[2].xyz, wp) + uSoftMap[2].w);
  vec2 m = min(s.xy, 1.0 - s.xy);
  float inside = clamp(min(m.x, m.y) * 30.0, 0.0, 1.0);
  if (inside <= 0.0) return 1.0;
  vec4 t = textureLod(uSoft, s.xy, 0.0);
  // Behind a piece by a couple of centimetres or more (depth spans 64 m).
  float pass = 1.0 - 0.92 * (1.0 - smoothstep(0.05, 1.0, t.g)) * smoothstep(0.0, 0.0006, s.z - t.r);
  // Dust thins the light for whatever lies beyond the middle of the cloud;
  // the side of the cloud that faces the sun stays lit. However thick the
  // smoke, some sun comes through and round it: a column's shadow is a
  // shade on the ground, never a black slab (it was one, on a dam, with
  // the breach the player had fired at underneath it).
  if (t.b > 0.002) pass *= mix(1.0, 0.42 / dust + (1.0 - 0.42 / dust) * exp(-0.2 * dust * t.b), smoothstep(-0.02, 0.02, s.z - t.a / t.b));
  return mix(1.0, pass, inside);
}
`;

export const MAIN_VS = `
${FRAME}
${UTIL}
${QUAD_DECODE}
// The optional depth pre-pass and the colour pass run this stage in two
// programs and compare depths for equality.
invariant gl_Position;
out vec3 vLocal;
out vec3 vWorld;
flat out vec4 vRq;
flat out vec3 vPat;
flat out int vMatFace;
#ifndef MOTION_PASS
// The material's palette entry (render_sync.js packs its eight bytes into
// one texel), fetched once per vertex instead of twice per pixel.
uniform usampler2D uPalPack;
flat out vec4 vPal0;    // sRGB colour, variation
flat out vec4 vPal1;    // roughness, emissive, pattern, flags
flat out vec3 vFirst;   // the quad's first voxel (its grid)
#endif
#ifdef GLASS_PASS
flat out vec2 vPane;   // a lean of its own for every pane (quad) of glass
#endif
#ifndef NO_GROW
uniform highp usampler3D uSolid0;  // one bit per voxel: solid when the scene was built (bytes along x, then z, then y)
// Was this voxel solid as the scene was built? (Beyond the box: yes, the
// ground runs on there.)
bool builtAt(ivec3 v) {
  ivec3 size = textureSize(uSolid0, 0);
  if (v.x < 0 || v.y < 0 || v.z < 0 || v.x >= size.x * 8 || v.z >= size.y || v.y >= size.z) return true;
  return ((texelFetch(uSolid0, ivec3(v.x >> 3, v.z, v.y), 0).r >> uint(v.x & 7)) & 1u) != 0u;
}
#endif
#if defined(DETAIL) && !defined(MOTION_PASS)
// How the face is seen and lit along its own axes (u, v, normal as the
// fragment stage takes them), for relief below the face: the vector to
// the eye is linear over a quad, the sun's direction the same all over it.
out vec3 vEyeT;
flat out vec2 vSunT;
#endif
#ifdef MOTION_PASS
// Where this vertex was on screen a frame ago: for the temporal resolve.
uniform sampler2D uXfPrev;   // the body transforms of the previous frame, laid out as uXf
out vec4 vClipNow;
out vec4 vClipWas;
#endif
void main() {
  Quad q;
  // A draw range holds every kind of quad that shares its segment of the
  // buffer; each pass keeps its own (GLASS_PASS: glass, otherwise opaque).
#ifdef GLASS_PASS
  if (!decodeQuad(q) || !q.glass) {
#elif defined(MOTION_PASS)
  if (!decodeQuad(q) || q.glass || q.body == 0) {
#else
  if (!decodeQuad(q) || q.glass) {
#endif
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    return;
  }
  // Greedy quads meet at T-junctions, where rasterisation leaves one-pixel
  // cracks that sparkle against whatever bright thing lies behind. Growing
  // every quad by half a pixel on screen makes neighbours overlap and closes
  // them; each edge direction is compensated for its own foreshortening, or
  // faces seen at a grazing angle would not grow enough.
  vec3 toV = q.world - uCamPos.xyz;
  float dist = length(toV);
  vec3 vdir = toV / max(dist, 1e-4);
  float px = dist * uProj.w * uScreen.y;
  float cu = dot(q.wu, vdir), cv = dot(q.wv, vdir);
  vec2 g = q.corner * px * inversesqrt(max(1.0 - vec2(cu * cu, cv * cv), 0.09));
#ifdef NO_GROW
  // Blended quads must not overlap: the shared edge would be drawn twice
  // and show as a seam. Cracks do not matter in a pass that writes no depth.
  g = vec2(0.0);
#else
  // Where two faces of a thing meet at an arris, both grown, each one's
  // fringe lies in front of the other's last half pixel: in a band a
  // pixel wide along every edge the two faces' colours are swapped, and as
  // the edge crosses the pixel rows that is a row of battlements one pixel
  // high (every coping, kerb and board, on every tier; no pass over the
  // picture can take out a pattern that is really in it). At an arris only
  // one of the two grows: the one that is turned more squarely to the eye.
  // The edge then lies half a pixel to one side, and is a line. Where the
  // surface runs on past the quad's edge, in its own plane, both grow as
  // before: that is where the cracks are. Which it is, the scene as built
  // says (the voxel beyond the edge, in the face's own layer); a face that
  // was not there as built, a break's edge and anything that moves grow
  // as before.
  if (q.body == 0) {
    vec3 nrm = cross(q.du, q.dv) * ((q.face & 1) == 1 ? 1.0 : -1.0);
    ivec3 cell = ivec3(floor(q.local - nrm * 0.5 - (q.du * q.corner.x + q.dv * q.corner.y) * 0.5));
    if (builtAt(cell)) {
      // (Which of the two is turned more squarely: by how far the eye
      // stands off each one's plane. Both planes hold the arris, so that
      // is one answer for every vertex along it, whichever quad of
      // whichever face asks: the two never both stand back. Within a
      // fiftieth of each other both grow, as everything did. A face
      // turned from the eye is not asked about: there the arris is this
      // thing's outline, and a member thinner than a pixel goes on being
      // drawn a pixel wide. And the face that stands back is the one seen
      // more nearly edge-on: no sliver is left to cover the line alone,
      // at any distance, on any tier's pixels.)
      // (Within a thousandth, not a fiftieth: the two distances are the same
      // numbers at every vertex of the arris, so no margin is needed for
      // the two faces to agree, only a hair against both standing back on
      // a rounding. A fiftieth was a band ten centimetres wide at five
      // metres in which every arris seen across its corner had its teeth.)
      float off = abs(dot(cross(q.wu, q.wv), toV)) * 1.001;
      // (And an edge is asked about at its two ends. A quad's edge can be an
      // arris for part of its length and run on in its plane for the rest;
      // growth is a corner's, so one that is nothing at one end and a half
      // pixel at the other tapers along the arris, in front of the face
      // round it: dots of this face's colour a pixel inside that one, one
      // to a voxel row. Where either end is an arris the whole edge stands
      // back; along the part that runs on, the quad beside it in the same
      // plane grows over the join.)
      ivec3 su = ivec3(q.du) * int(q.corner.x), sv = ivec3(q.dv) * int(q.corner.y);
      if (q.corner.x * dot(q.wu, toV) < -off && !(builtAt(cell + su) && builtAt(cell + su - sv * (q.size.y - 1)))) g.x = 0.0;
      if (q.corner.y * dot(q.wv, toV) < -off && !(builtAt(cell + sv) && builtAt(cell + sv - su * (q.size.x - 1)))) g.y = 0.0;
    }
  }
#endif
  vLocal = q.local + (q.du * g.x + q.dv * g.y) / VOXEL_M;
  vWorld = q.world + q.wu * g.x + q.wv * g.y;
  vRq = q.rq;
  vPat = q.pat;
#ifndef MOTION_PASS
  // (The quad's first corner is the same at all four vertices.)
  vec3 first = q.local - q.du * ((q.corner.x * 0.5 + 0.5) * float(q.size.x)) - q.dv * ((q.corner.y * 0.5 + 0.5) * float(q.size.y));
  vFirst = floor(first - faceNormal(q.face) * 0.5 + 0.01);
#ifdef GLASS_PASS
  float ph = hash13(first + q.pat + float(q.face) * 17.0);
  vPane = vec2(ph, fract(ph * 31.7)) - 0.5;
#endif
#ifdef DETAIL
  {
    int ax = q.face >> 1;
    vec3 tu = ax == 0 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0), tv = ax == 1 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0), nl = faceNormal(q.face);
    vec4 back = vec4(-q.rq.xyz, q.rq.w);
    vec3 el = qrot(back, uCamPos.xyz - vWorld), sl = qrot(back, uSunDir.xyz);
    vEyeT = vec3(dot(el, tu), dot(el, tv), dot(el, nl));
    float sn = dot(sl, nl);
    vSunT = sn > 0.0 ? clamp(vec2(dot(sl, tu), dot(sl, tv)) / max(sn, 0.1), -8.0, 8.0) : vec2(0.0);
  }
#endif
  uvec2 pal = texelFetch(uPalPack, ivec2(q.mat, 0), 0).rg;
  vPal0 = vec4(uvec4(pal.r, pal.r >> 8, pal.r >> 16, pal.r >> 24) & 255u) * (1.0 / 255.0);
  vPal1 = vec4(uvec4(pal.g, pal.g >> 8, pal.g >> 16, pal.g >> 24) & 255u) * (1.0 / 255.0);
#endif
  // Bit 21: the quad's voxels can be traced to where they were in the scene
  // as built (the world itself, or a body with a pattern offset: one cut
  // from it); bit 22: it belongs to a body.
  bool traced = q.body == 0 || any(notEqual(q.pat, vec3(0.0)));
  vMatFace = q.mat | (q.face << 8) | ((q.size.x - 1) << 11) | ((q.size.y - 1) << 16) | (traced ? 1 << 21 : 0) | (q.body != 0 ? 1 << 22 : 0);
  gl_Position = uViewProj * vec4(vWorld, 1.0);
#ifdef LEAF_ONLY
  // (For a pass that lays foliage again, clean, over what was laid on it:
  // every quad that is not foliage, by the fragment stage's own test of
  // it, is taken out. The positions of those that stay are the first
  // pass's own, for a depth test at EQUAL.)
  if (!(int(vPal1.b * 255.0 + 0.5) == ${PAT.NOISE} && (int(vPal1.a * 255.0 + 0.5) & 32) != 0 && vPal1.r > 0.8 && q.body == 0)) gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
#endif
#ifdef HEAP_DEPTH
  // (For the heaps' depth laid ahead of the opaque pass, HEAP_DEPTH_FS:
  // foliage is left out, and leaf alight with it: whatever the surface
  // shader takes for leaf (its leafy: the mottled pattern or the ember,
  // granular, matt, the world's). A crown's outline is cut by its
  // leaves, which only the surface shader knows.)
  int depthPat = int(vPal1.b * 255.0 + 0.5);
  if ((depthPat == ${PAT.NOISE} || depthPat == ${PAT.EMBER}) && (int(vPal1.a * 255.0 + 0.5) & 32) != 0 && vPal1.r > 0.8 && q.body == 0) gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
#endif
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

// The depth of the heap list's quads, for laying ahead of the opaque pass
// (renderer.depthFirst), on the tiers whose heap program cuts a mound's
// corners away. It lays depth only where the surface shader certainly
// keeps the pixel. The cut (heapSurface, `gone`) is taken only where the
// density at the point on the face is under the mound's level, 0.58, AND
// the eye's ray meets no density of that level in its three steps of 10 cm
// behind the face. Here a pixel is kept where the density on the face, or
// at one of those same three steps, is 0.62 or more: a level a little
// higher, so that nothing two programs may work out a hair apart can
// leave depth where the surface shader cuts. One lookup inside the mound,
// up to four under a corner that sticks out of it. (With MAIN_VS under
// HEAP_DEPTH, which leaves foliage out.)
export const HEAP_DEPTH_FS = `
${FRAME}
uniform sampler3D uOcc;
in vec3 vWorld;
float occ(vec3 wp) {
  return textureLod(uOcc, wp.xzy * uOccInv.xyz, 0.0).r;
}
void main() {
  const float SURE = 0.62;
  if (occ(vWorld) >= SURE) return;
  vec3 rd = normalize(vWorld - uCamPos.xyz);
  for (int i = 1; i <= 3; i++) {
    if (occ(vWorld + rd * (0.1 * float(i))) >= SURE) return;
  }
  discard;
}
`;

// The motion pass's fragment stage: how far the pixel's surface has come
// since the last frame, in uv (zero is kept for "did not move").
export const MOTION_FS = `
in vec4 vClipNow;
in vec4 vClipWas;
out vec4 oColor;
void main() {
  vec2 d = (vClipWas.xy / vClipWas.w - vClipNow.xy / vClipNow.w) * 0.5;
  // Exactly zero means "no body here" to the resolve.
  if (d == vec2(0.0)) d.x = 1e-6;
  // A fifth of the screen in one frame is not motion: the slot held
  // another body a frame ago, or the piece was behind the camera. Sent
  // off the screen, which the resolve reads as "no history".
  if (vClipWas.w <= 0.0 || max(abs(d.x), abs(d.y)) > 0.2) d = vec2(8.0);
  oColor = vec4(d, 0.0, 1.0);
}
`;

// Depth-only pass for the shadow atlas (define BODIES_PASS for the body
// layer). Glass is stippled 1-in-4, which the
// 2x2 tap blocks of the shadow filter resolve to a quarter-strength shadow.
export const SHADOW_VS = `
${UTIL}
${QUAD_DECODE}
uniform mat4 uLightVP;
flat out int vGlass;
void main() {
  Quad q;
  // The static layer holds the world, the layer on top of it the bodies.
#ifdef BODIES_PASS
  if (!decodeQuad(q) || q.body == 0) {
#else
  if (!decodeQuad(q) || q.body != 0) {
#endif
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    return;
  }
  vGlass = q.glass ? 1 : 0;
  // A couple of millimetres of overlap so cracks cannot leak light.
  gl_Position = uLightVP * vec4(q.world + (q.wu * q.corner.x + q.wv * q.corner.y) * 0.002, 1.0);
}
`;

export const SHADOW_FS = `
flat in int vGlass;
void main() {
  if (vGlass == 1) {
    ivec2 p = ivec2(gl_FragCoord.xy) & 1;
    if (p.x + p.y != 0) discard;
  }
}
`;

// Shared head of the opaque and glass fragment shaders: unpacks the face and
// evaluates the material.
const FACE_SETUP = `
in vec3 vLocal;
in vec3 vWorld;
flat in vec4 vRq;
flat in vec3 vPat;
flat in int vMatFace;
flat in vec4 vPal0;
flat in vec4 vPal1;
flat in vec3 vFirst;
#if defined(DETAIL) && !defined(FINE)
in vec3 vEyeT;
flat in vec2 vSunT;
#endif
out vec4 oColor;

#ifdef HDR_ENCODE
// 8-bit fallback target: squeeze [0, 16] into [0, 1] with a square root.
vec3 enc(vec3 c) { return sqrt(min(c, 16.0) * 0.0625); }
#elif defined(HDR_DITHER)
// Packed 11/10-bit floats step by about 1.5%: dither so smooth gradients
// (sky, fog) do not contour.
vec3 enc(vec3 c) { return min(c, 64.0) * (0.992 + 0.016 * ign(gl_FragCoord.xy)); }
#else
// (Written into the place that asks, not called.)
#define enc(c) min(c, 64.0)
#endif

// (Written into the place that asks: a call would be three times the dot.)
#define luma(c) dot(c, vec3(0.2126, 0.7152, 0.0722))

// Sun specular: GGX with the Schlick-Smith visibility term. Returns the lobe
// including Fresnel, to be multiplied by radiance * ndl.
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
`;

export const MAIN_FS = `
${FRAME}
${UTIL}
${ATMOSPHERE}
${LIGHTS}
${SHADOW}
#ifdef SOFT_SHADOW
${SOFT_SHADOW}
#endif
// Roughness is read by the specular path and by DETAIL's bark (and worked on by
// the chamfer and the wet): a program with none of them does not work it out. (The patterns' other users, the far field
// and the debris, read it and leave SURF_ROUGH alone.)
#if !defined(SPECULAR) && !defined(DETAIL) && !defined(BEVEL) && !defined(WET_MASK)
#define SURF_ROUGH(x)
#endif
${SURFACE}
${FACE_SETUP}
#define VOXEL_FS ${VOXEL.toFixed(4)}
// HEAP: the program that draws the segments holding rubble or foliage
// (QuadLists.drawHeap), and the fine layer's. The heap's mound, its stones,
// a crown's leaves and the cut of their outlines are compiled only there:
// the program that draws everything else does not carry them.
#ifdef HEAP
uniform sampler2D uStone;   // the stones of a heap (render_stone.js): r tone, gb lean, a how far inside the stone
#endif
#ifdef WET_MASK
// Where water lies or has lain, from above (the water pass's, one texel a
// water column over the world's box): r wetness (1 under water and just
// after, 0 dry), b wetness times the height of the wet line (m): looked
// up between a wet column and a dry one, b / r is still the line.
uniform sampler2D uWet;
#endif
#ifdef FINE
// Fine quads (render_detail.js): the occupancy gradient at the quad's corners.
in vec3 vFineN;
#endif
void main() {
  int mat = vMatFace & 255;
  int face = (vMatFace >> 8) & 7;
  int axis = face >> 1;
  vec3 nl = faceNormal(face);
  vec3 pc = vLocal + vPat;
  // Face-plane coordinates (uv.y is up on walls) and the voxel layer along the normal.
  vec2 uv = axis == 0 ? pc.zy : (axis == 1 ? pc.xz : pc.xy);
  vec3 tu = axis == 0 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
  vec3 tv = axis == 1 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  // The voxel under the pixel. Never one outside the quad: the half pixel a
  // quad is grown by reaches over its edge, and at a step the cell there is
  // air, which would shade that fringe as something dropped in the open (a
  // grey dashed line along every step).
  vec2 quadSize = vec2(float(((vMatFace >> 11) & 31) + 1), float(((vMatFace >> 16) & 31) + 1));
#ifdef FINE
  // A fine quad lies in one voxel, which its vertex stage names. (And it
  // carries no size: it counts as one voxel across.)
  vec3 vc = vFirst + vPat;
#else
  vec3 span = axis == 0 ? vec3(0.0, quadSize.x, quadSize.y) : (axis == 1 ? vec3(quadSize.y, 0.0, quadSize.x) : vec3(quadSize.x, quadSize.y, 0.0));
  vec3 vc = clamp(floor(vLocal - nl * 0.5), vFirst, vFirst + max(span - 1.0, 0.0)) + vPat;
#endif
  float layer = dot(vc, abs(nl));
#ifdef FINE
  // A break drawn at 2.5 cm is a staircase of small faces turned three
  // ways. Its material is looked up along the surface it was cut into, one
  // way for all of them and in one layer: looked up face by face, treads
  // and risers take different patches of the pattern and the break is a
  // chequer at the pitch of its steps. (Bits 29 and 30 of the quad's
  // flags: one more than the axis its voxel was broken along, the engine's
  // word, one for the whole voxel, the same from every side and in a
  // piece that has moved.)
  // (Foliage the fine layer draws, where a blast has torn a hedge or a
  // crown, is not a break: see below, where a crown is told.)
  // (And leaf alight, the granular ember: leaf still.)
  int finePat = int(vPal1.b * 255.0 + 0.5);
  bool fineLeaf = (finePat == PAT_NOISE || finePat == PAT_EMBER) && (int(vPal1.a * 255.0 + 0.5) & 32) != 0 && vPal1.r > 0.8 && (vMatFace & (1 << 22)) == 0;
  if ((vMatFace & (1 << 23)) != 0 && !fineLeaf) {
    int cut = ((vMatFace >> 29) & 3) - 1;
    uv = cut == 0 ? pc.zy : (cut == 1 ? pc.xz : pc.xy);
    layer = 0.0;
  }
#endif
#if !defined(FINE) && !defined(NO_BANK) && defined(DETAIL) && !defined(NO_BANKRAY)
  // (For a bank of lawn, below: where the eye's ray through a riser's
  // pixel would meet the tread at the riser's foot, if that ran on under
  // the step.)
  vec3 bankRay = vWorld - uCamPos.xyz;
  bankRay *= (pc.y - vc.y) / max(-bankRay.y, 0.12 * length(bankRay));
  vec2 uvBank = pc.xz + bankRay.xz;
  // (The differences of the face's lookup and of the bank's, taken as four
  // numbers at once: each time differences are asked for the program turns
  // them to the way the screen lies, and that is most of what they cost.)
  vec4 guv = dFdx(vec4(uv, uvBank)), guvY = dFdy(vec4(uv, uvBank));
  vec2 gx = guv.xy, gy = guvY.xy, bgx = guv.zw, bgy = guvY.zw;
#else
  vec2 gx = dFdx(uv), gy = dFdy(uv);
#endif
  vec2 fw = abs(gx) + abs(gy);
#if defined(FINE) && !defined(NO_INSIDE)
  // (For the inside of a material on a broken face: the pixel's height in
  // the solid as built. The faces of a break drawn fine are looked up
  // along the cut, whichever way each of them is turned.)
  patBed = vec2(pc.y, fwidth(pc.y));
#endif

  vec4 p0 = vPal0, p1 = vPal1;
  int flags = int(p1.a * 255.0 + 0.5), pattern = int(p1.b * 255.0 + 0.5);
  Surf s;
  vec3 paletteCol = pow(p0.rgb, vec3(2.2));
  s.albedo = paletteCol;
  SURF_ROUGH(max(p1.r, 0.05));
  s.cavity = 1.0;
  SURF_BEVEL(1.0);
  s.var = p0.a * 2.0;
  float fresh, loose;
  bool built;
  exposure(vc, nl, (vMatFace & (1 << 21)) != 0, (vMatFace & (1 << 22)) != 0, pattern, fresh, loose, built);
#ifdef FINE
  // A face inside its voxel can only be a break. (Not in foliage: a torn
  // hedge has no pale inside.)
  if ((vMatFace & (1 << 23)) != 0 && !fineLeaf) fresh = 1.0;
#endif
  // Broken and dropped material is rough at the scale of a voxel. Fades
  // out before a voxel gets small enough to alias.
  float near = 1.0 - smoothstep(0.3, 0.9, max(fw.x, fw.y));
  vec3 ng = qrot(vRq, nl);
  vec3 t1 = qrot(vRq, tu);
  vec3 t2 = qrot(vRq, tv);
  // The axes the stone of a heap is looked up along (below), in the world.
  vec3 hU = t1, hV = t2;
  // Where light is looked up from: the face itself, except in a heap.
  vec3 lp = vWorld;
  vec4 grain = vec4(0.5);
#ifdef FINE
  // ... and in a break drawn at 2.5 cm: that is lit as the slope its steps
  // stand for, from the surface it was cut into (render_detail.js: which
  // side that is, and fineDepth voxels under it), facing that way.
  vec3 fineOpen = faceNormal((vMatFace >> 24) & 7);
  float fineDepth = clamp(dot(fineOpen, vc - vPat + 0.5 + 0.5 * fineOpen - vLocal), 0.0, 1.0) + float((vMatFace >> 27) & 3);
  ng = qrot(vRq, fineOpen);
  lp += ng * (fineDepth * VOXEL_FS);
  t1 = normalize(cross(ng, abs(ng.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  t2 = cross(ng, t1);
#endif
  // Where a heap's stone is looked up (the face's own plane otherwise), and
  // whether the pixel is a corner that sticks out of the heap (see below).
  vec2 huv = uv;
  // A tree's crown is a heap of leaves: the same mound, in leaf. (Foliage
  // is what is granular, mottled and matt, standing where it grew.)
  // What burns (the fire system's ember material) is lit as one glowing
  // mass, by the slope of the solid around it and hardly by its cubes'
  // faces: a crown alight was a ball of golden dice, every top face
  // bright and every side dark.
  bool ember = pattern == PAT_EMBER;
#if defined(HEAP) && !defined(FINE)
  bool heap = false, gone = false;
  // (Leaf alight, the granular ember, is leaf still: the crown's mound and
  // its sprays, in char and sparks.)
  bool leafy = (pattern == PAT_NOISE || pattern == PAT_EMBER) && (flags & 32) != 0 && p1.r > 0.8 && (vMatFace & (1 << 22)) == 0 && loose == 0.0;
  const bool crumb = false;
#define LOOSE_OR_LEAFY (loose > 0.0 || leafy || ember)
#define ON_FACE (axis != 1 && !heap && !bank)
#define ALONG_MOUND (heap || (laid && !close))
#define PAT_LAYER (heap ? 0.0 : layer)
#elif defined(HEAP)
  // (The fine layer draws foliage too, where a blast has torn a hedge or a
  // crown: voxels with bites out of them, among the crown's own. Lit as
  // faces they are green cubes with ruled sides in the middle of a mound
  // of leaf, and the lowest tier, which has no fine layer, shows the same
  // hedge whole. They are lit as the crown they are part of, the way the
  // lowest tier lights a crown: by the mound's slope from the six lookups,
  // in the crown's sprays. Nothing is cut away.)
  const bool heap = false, gone = false;
  bool leafy = fineLeaf && loose == 0.0;
  const bool crumb = false;
#define LOOSE_OR_LEAFY (loose > 0.0 || leafy || ember)
#define ON_FACE (axis != 1 && !bank)
#define ALONG_MOUND laid
#define PAT_LAYER (leafy ? 0.0 : layer)
#else
  // (Only the heap program has a mound or a crown: constants elsewhere, and
  // what asks for them is not compiled.)
  const bool heap = false, gone = false, leafy = false;
  // Earth, turf and gravel broken open in place (the side of a crater, a
  // trench) are no more cubes than a heap is: lit by the slope of the
  // ground around them, from a point on it, like matter that was dropped.
  // Face by face, every riser of a crater's rim turned from the sun was a
  // black square a hand high.
  // (Told by the pattern, turf and soil: earth, grass and gravel. Not by
  // the granular flag, which leaf, water and what burns carry too.)
  bool crumb = fresh > 0.0 && (pattern == PAT_TURF || pattern == PAT_SOIL) && (vMatFace & (1 << 22)) == 0;
#define LOOSE_OR_LEAFY (loose > 0.0 || ember || crumb)
#define ON_FACE (axis != 1 && !bank)
#define PAT_LAYER (heap ? 0.0 : layer)
#endif
  // (A voxel under two pixels has no stair to take off: beyond that the
  // heap is lit by its slope alone, at the six lookups it always took.)
  // (By the pixel's size at that distance, not by how the face is seen:
  // the top of a hedge seen along its length is foreshortened ten to one,
  // and by that measure the mound ended two metres from the eye, in a
  // step, with a ruled green box beyond.)
  float fwm = max(fw.x, fw.y);
  float fwd = length(vWorld - uCamPos.xyz) * (uProj.w * uScreen.y * 2.0 / VOXEL_FS);
  bool close = fwd < 0.5;
  if (LOOSE_OR_LEAFY) {
    // A heap of dropped voxels is drawn as the mound it stands for: the
    // density volume describes a smooth surface through its terraces, and
    // a pixel is shaded where the eye's ray meets that surface, by its
    // slope, from a point on it, so the cubes neither show their faces nor
    // shadow each other nor step the edge of a shadow that falls across
    // them.
    vec3 hp = vWorld;
    float depth = 0.0;
    // (Rubble that was laid in the world: bodies are not in the density
    // volume, and a piece of wall that lies where it fell is a piece of
    // wall, lit as part of the heap and no more.)
#if defined(HEAP) && !defined(FINE)
    bool laid = leafy || (pattern == PAT_RUBBLE && (vMatFace & (1 << 22)) == 0);
    bool mound = close && laid;
#elif defined(HEAP)
    // (Foliage drawn fine: from the voxel face's own direction, not the
    // side its break opens to.)
    bool laid = leafy, mound = leafy;
    if (leafy) ng = nl;
#endif
    vec3 slope;
    // (The solid around the pixel, from six lookups: on the face itself
    // for the mound, a little off it otherwise. Taken once for all three.)
    float hmean;
#ifndef HEAP
    vec3 hg = heapTaps(vWorld + ng * 0.08, hmean);
    slope = heapNormal(hg, hmean, ng, depth);
#else
    vec3 hg = heapTaps(mound ? vWorld : vWorld + ng * 0.08, hmean);
    if (mound) {
#if defined(DETAIL) && !defined(FINE)
      slope = heapSurface(vWorld, ng, normalize(vWorld - uCamPos.xyz), hg, hp, depth, gone, heap);
#else
      slope = heapLean(vWorld, ng, normalize(vWorld - uCamPos.xyz), hg, hmean, hp);
#ifndef FINE
      heap = hp != vWorld || dot(slope, ng) > 0.75;
#endif
#endif
      // Its stone lies on the mound, not on the cubes' faces: looked up
      // along the mound's own lie, whichever face of a cube the pixel is.
      // (A cube that stands clear of any mound keeps its faces' own.)
      // (Where the point was not moved, it lies on the cube's face: looked
      // up along the face, or a riser would be streaked from above.)
      // (At arm's length a corner cut away is a notch a hand across with
      // ruled sides: there the corner stays, shaded as the mound.)
#if defined(DETAIL) && !defined(FINE)
      if (dot(vWorld - uCamPos.xyz, vWorld - uCamPos.xyz) < 0.8) gone = false;
#endif
    } else {
      slope = heapNormal(hg, hmean, ng, depth);
    }
    // (Further off the cubes stay, and their stone still lies along the
    // heap: the blocks in it are seen from there.)
    if (ALONG_MOUND) {
      vec3 hv = hp * (1.0 / VOXEL_FS);
      // The plane the stone is looked up in: the one of thirteen (the
      // three axes', the six that lean across two of them, the four across
      // all three) that lies nearest the mound's own, the same for every
      // face of a cube: a lookup in the level plane for all draws a steep
      // flank as a comb of streaks, and a lookup of its own for each face
      // draws the heap as a quilt of squares. Where the mound turns from
      // one plane to the next the stones change along a line that follows
      // the mound, not the lattice.
      vec3 as = abs(slope);
      float m1 = max(as.x, max(as.y, as.z)), mn = min(as.x, min(as.y, as.z));
      float m2 = (as.x + as.y + as.z - mn) * 0.7071, m3 = (as.x + as.y + as.z) * 0.5774;
      vec3 q = normalize(sign(slope) * (m3 > max(m1, m2) ? vec3(1.0) : (m2 > m1 ? step(mn + 1e-4, as) : step(m1 - 1e-4, as))));
      // (A face that was not moved onto the mound and stands edge-on to
      // that plane, the side of a lump lying by itself, the riser of a
      // cube that stands proud: there the stone is looked up along the
      // face itself, or it is a comb of streaks. With thirteen planes to
      // choose from that is the case only for a face square to the plane.)
      // (ng is still the face's own normal here, and hU, hV its axes.)
      // (In foliage drawn fine every face edge-on to the plane keeps its
      // own: the walls of a bite stand square to the crown's skin.)
#ifdef FINE
      if (abs(dot(ng, q)) >= 0.3) {
#else
      if (!(hp == vWorld && abs(dot(ng, q)) < 0.3)) {
#endif
        hU = normalize(cross(q, abs(q.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        hV = cross(q, hU);
        huv = vec2(dot(hv, hU), dot(hv, hV));
      }
    }
#endif
    if (ember && !leafy) {
      float gl = length(hg);
      if (gl > 0.02) slope = normalize(ng * 0.25 + hg / gl);
      depth = 0.0;
    }
    ng = slope;
    t1 = normalize(cross(slope, abs(slope.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    t2 = cross(slope, t1);
    lp = hp + slope * (0.1 + depth);
  }
#if !defined(FINE) && !defined(NO_BANK)
  // A step one voxel high in a lawn as it was laid is the lawn sloping:
  // lit as the ground above and below it, not as a wall that turns its
  // back on the sun (the contour lines on every bank of grass).
  bool bank = pattern == PAT_TURF && axis != 1 && (axis == 0 ? quadSize.x : quadSize.y) < 1.5 && fresh + loose == 0.0;
  if (bank) {
    // (And its grass is the lawn at its foot, seen as if the step were
    // not there: the same patches, and the blades as close-set as level
    // ground shows them from this eye. A riser with a pattern of its own,
    // seen square on where the treads are seen at a slant, is a band of
    // another grain between two treads.)
    // (The lowest tier has no blades to match: its broad patches are
    // looked up where the riser stands.)
#if defined(DETAIL) && !defined(NO_BANKRAY)
    huv = uvBank;
    gx = bgx;
    gy = bgy;
    // (And its light is looked up toward that point of the lawn, two
    // voxels at most: a tree's shadow runs on across the step. Looked up
    // on the riser itself, twenty centimetres of height stand for a metre
    // of lawn and the shadow crosses it as a bar; all the way to that
    // point, the lawn behind the step's edge is seen twice and so is a
    // shadow's outline on it.)
    // (ng is still the riser's own normal here.)
    lp += bankRay * (VOXEL_FS * min(1.0, 2.0 / max(length(bankRay.xz), 1e-3))) + ng * 0.03;
#else
    huv = pc.xz;
#endif
    ng = vec3(0.0, 1.0, 0.0);
    // (And the sky's light is looked up as on level ground, along the
    // ground's own axes: with the riser's, one of which stands upright, a
    // lookup goes straight down into the lawn, and every riser of a bank
    // in shadow is a dark line.)
    t1 = vec3(1.0, 0.0, 0.0);
    t2 = vec3(0.0, 0.0, 1.0);
  }
  // (A lawn's light is looked up a voxel above it: a step one voxel high
  // then throws no shadow on the tread below and leaves no dark line at
  // its foot, which are a stair's and not a bank's.)
  // (And a lawn is one lawn at whatever level it lies: its patches of
  // lush and dry run on across a step. Each level with patches of its own
  // is a bank in bands.)
  bool lawn = pattern == PAT_TURF && nl.y > 0.5 && fresh + loose == 0.0 || bank;
  if (lawn) {
    lp += vec3(0.0, VOXEL_FS, 0.0);
    layer = 0.0;
  }
#else
  bool bank = false, lawn = false;
#endif
  float below;
  float ao = volumeAO(lp, ng, t1, t2, below);
  float shelter;
  float sv = skyVisibility(lp, ng, shelter);
  quadSize = axis == 2 ? quadSize : quadSize.yx;
#ifdef DETAIL
  // How the face is seen and lit along its own axes: relief that sits
  // below the face (a pattern's joints) slides and shades by it. (Worked
  // out per vertex; the fine layer's quads have a vertex stage of their
  // own and work it out here.)
#ifdef FINE
  {
    vec4 back = vec4(-vRq.xyz, vRq.w);
    vec3 el = qrot(back, uCamPos.xyz - vWorld), sl = qrot(back, uSunDir.xyz);
    patEye = clamp(vec2(dot(el, tu), dot(el, tv)) / max(dot(el, nl), 0.05 * length(el)), -3.0, 3.0);
    float sn = dot(sl, nl);
    patSun = sn > 0.0 ? clamp(vec2(dot(sl, tu), dot(sl, tv)) / max(sn, 0.1), -8.0, 8.0) : vec2(0.0);
  }
#else
  patEye = clamp(vEyeT.xy / max(vEyeT.z, 0.05 * length(vEyeT)), -3.0, 3.0);
  patSun = vSunT;
#endif
#endif
#if defined(DETAIL) && !defined(NO_BREAK)
  patBars = (flags & 128) != 0;
#endif
  // (And its heat is one field through the solid, not one for each way a
  // face looks: looked up from above with a lean, so that it runs round
  // every corner; on what stands upright it is drawn out into tongues.)
  if (ember && !leafy) huv = pc.xz + pc.y * vec2(0.37, 0.29);
#if defined(DETAIL) && !defined(NO_INSIDE)
  // What the pattern cannot tell of a broken face's material: that boards
  // are timber and not sheet, and that a pale matt wall with no pattern
  // is plaster, render or board, a skin on a coarse coat.
  patWood = (flags & (8 | 128)) == 8;
  patPlaster = pattern == PAT_FLAT && p1.r > 0.9 && (flags & (8 | 32 | 128)) == 0 && luma(paletteCol) > 0.3;
#endif
  surfacePattern(pattern, huv, gx, gy, PAT_LAYER, ON_FACE, (flags & 32) != 0, 1.0 - fresh, shelter, quadSize, s);
  // (The material's variation of tone is in the pattern, by noise: a tone
  // of its own for every voxel draws the lattice on a flat wall.)
#ifdef DETAIL
  if (axis != 1 && loose == 0.0 && !bank && !leafy) {
    // Where a wall stands on the ground, or rises from a ledge, rain
    // splashes soil up it and the damp stays: its lowest hand's breadth is
    // darker and browner, unevenly. (From a tap the ambient occlusion takes
    // anyway: what lies a quarter of a metre down the wall, just in front.)
    float foot = smoothstep(0.3, 0.8, below) * abs(t2.y) * (1.0 - fresh) * smoothstep(0.15, 0.5, sv);
    s.albedo *= mix(vec3(1.0), vec3(0.6, 0.56, 0.5), foot * (0.3 + 0.7 * s.noise.y));
  }
#ifndef NO_DUST
  if ((vMatFace & (1 << 22)) != 0 && (fresh > 0.0 || built)) {
    // A piece of the building that lies in its wreck has the wreck's dust
    // on it: on what faces up, and thick where it lies against the heap or
    // the ground, so that its foot is the colour of what it is sunk in.
    // (How close the world is around it, the ambient occlusion has found.)
    float dust = max(smoothstep(0.1, 0.45, 1.0 - ao), 0.3 * smoothstep(0.3, 0.8, ng.y)) * (0.4 + 0.6 * s.noise.x);
    s.albedo = mix(s.albedo, mix(s.albedo, vec3(0.2, 0.185, 0.165), 0.65), dust);
    s.rough = mix(s.rough, 1.0, dust);
  }
#endif
#endif
#ifdef BEVEL
  if (leafy) s.bevel = 0.0;
#endif
  if (LOOSE_OR_LEAFY) {
    // The grain of broken stone. (Pulled about by the broad noise, so that
    // no stretch of a heap repeats the one beside it.)
#ifdef HEAP
    huv += (s.noise.xy - 0.5) * 1.6;
#endif
    // (Its grain is the pattern's own taps; the lookup goes to its stones.)
#ifdef DETAIL
    grain = s.noise.zwxy;
#else
    grain = s.noise.xyxy;
#endif
  }

#ifdef DETAIL
  vec3 nb = nl + tu * s.tilt.x + tv * s.tilt.y;
#else
  // (Only DETAIL gives a pattern a tilt.)
  vec3 nb = nl;
#endif
  if (bank) nb = tv;
  // A trunk or a post: lit as a round bar, below.
  bool roundBar = false;
#ifndef FINE
  // A trunk is round: its four faces are lit as the quarters of a column
  // (the normal turns from one corner to the other across the face, and
  // meets the next face's at the corner). A trunk is bark (grain, quite
  // matt) standing up, no wider than an arm's length.
  // And a post is a tube. Bare metal with no rolled pattern is tube stock
  // (the material of every lamp post, sign post, rail and canopy frame in
  // a street; nothing that carries a building is drawn in it): a member
  // of it no wider than a forearm and longer than it is wide is lit the
  // same way across its width, standing or lying, in the world or fallen.
  // (Told by the quad: its narrow way, and that it is longer the other
  // way. A square foot's top or a cap stays flat.)
#ifndef NO_TRUNK
  vec2 ext = vec2(dot(span, tu), dot(span, tv));
  bool upright = ext.x < ext.y;
  float girth = upright ? ext.x : ext.y;
  // (A tube at least two voxels across: the strips one voxel wide round
  // the top of a post's square foot are not rods.)
  roundBar = fresh == 0.0 && (pattern == PAT_GRAIN ? p1.r > 0.9 && axis != 1 && upright && girth < 6.5
      : (pattern == PAT_FLAT || (pattern == PAT_METAL && max(p0.r, max(p0.g, p0.b)) < 0.3 && axis != 1 && upright)) && (flags & 128) != 0 && p1.r < 0.5 && max(abs(p0.r - p0.g), abs(p0.g - p0.b)) < 0.1 && girth > 1.5 && girth < 4.5 && ext.x != ext.y);
  if (roundBar) {
    vec3 across = upright ? tu : tv;
    nb += across * ((dot(vLocal - vFirst, across) / girth - 0.5) * 2.0);
  }
#endif
#endif
#ifdef FINE
  {
    // The faces of a break are lit as the slope their steps stand for.
    // What is left of the wall's own face on a voxel that is drawn fine
    // (the skin round a pit a blast left) is still the wall's face: lit as
    // the wall beside it, with its relief. Lit as a slope toward the pit,
    // every pitted voxel was a flat square of another tone, ten
    // centimetres across, with the pit in it.
    vec3 nf = fineNormal(nl, vFineN, vLocal + vPat, fineOpen, fineDepth, fresh, s);
    if (fresh > 0.0) nb = nf;
    else if (((vMatFace >> 29) & 3) == 1 && !leafy) {
      // The skin round the mouth of a pit or along a break (the fine
      // layer's word, bits 29 and 30 on a face that is not inner): spalled
      // back a centimetre or two, ragged, paler, rolling over into the
      // hole. How near the mouth is: how far the solid's gradient there
      // (the fine layer's, across its quad) leans out of the face.
      vec3 gt = vFineN - nl * dot(vFineN, nl);
      float chip = smoothstep(0.3, 0.62, length(gt) / max(length(vFineN), 1e-3) + (s.noise.w - 0.5) * 0.4);
      if (chip > 0.0) {
        s.albedo = mix(s.albedo, mix(s.albedo, vec3(luma(s.albedo)), 0.25) * 1.3 + 0.012, 0.7 * chip);
        SURF_ROUGH(mix(s.rough, 1.0, chip));
        nb += gt * (0.9 * chip);
      }
    }
  }
#endif
#ifdef DETAIL
  float rough = max(fresh * 0.55, loose * 0.7) * near;
#endif
  // Rubble that is smooth is broken glass: shards, not stones (below).
#ifdef NO_HEAP_MATERIALS
  // (For a program that never draws rubble or foliage: the lists keep the
  // segments that hold some apart, for the heap program. Not defined by
  // anything yet: the plain program's to take.)
  const bool shards = false;
#else
  bool shards = pattern == PAT_RUBBLE && p1.r < 0.5;
  vec3 glass = s.albedo;
#endif
  if (fresh + loose > 0.0) {
    // Broken material is rough and uneven in tone at every scale, by noise
    // (the pattern's own taps) and not by voxel: a lean and a tone for
    // every voxel face is a wall of cubes.
    float h2 = s.noise.x * 0.4 + s.noise.w * 0.6;
#ifdef DETAIL
    // (Without DETAIL the fine noise is its mean: the lean is nothing.)
    nb += (tu * (s.noise.z - 0.5) + tv * (s.noise.w - 0.5)) * (1.0 * rough);
#endif
    // A fracture surface is paler and chalkier than the weathered face; a
    // heap is that and dusty: mixed toward the grey of pulverised masonry.
    // (A rubble material has the colour of what it is rubble of: less of
    // the grey for it than for a brick that lies where it fell, and next
    // to no tone per voxel, which is what shows a heap to be cubes.)
#ifdef NO_HEAP_MATERIALS
    const bool rubble = false;
#else
    bool rubble = pattern == PAT_RUBBLE;
#endif
    float own = rubble ? 0.25 : 1.0;
    // (Where the material is not one whose inside the pattern has laid:
    // brick, concrete, plaster and timber are, and are as they come.)
    vec3 pale = s.albedo;
    if (!patInner) {
      pale = s.albedo * (1.06 + 0.28 * mix(0.5, h2, own)) + 0.012;
      // (Paler than the weathered face, but nothing broken is white: the
      // inside of plaster, render or a painted board is its grey or buff
      // core, matt. A break in a white wall drawn whiter than the wall is
      // cut paper, with no shade to show its shape.)
      pale *= vec3(1.02, 1.0, 0.95) / (1.0 + 1.3 * max(luma(pale) - 0.38, 0.0));
    }
    vec3 dusty = mix(pale, vec3(0.2, 0.185, 0.165), rubble ? 0.16 : 0.42) * (0.82 + 0.3 * mix(0.5, h2, own));
    // (No heap is white, whatever fell: dirt and dust come down with it. A
    // heap of plaster as pale as its wall is a snowdrift in the shade.)
    if (rubble) dusty *= vec3(1.03, 1.0, 0.94) / (1.0 + 0.8 * max(luma(dusty) - 0.2, 0.0));
    s.albedo = mix(s.albedo, mix(pale, dusty, loose), min(fresh + loose, 1.0));
    SURF_ROUGH(mix(s.rough, 1.0, (flags & 128) != 0 ? 0.0 : min(fresh + loose, 1.0)));
#ifdef BEVEL
    s.bevel *= 1.0 - loose;
#endif
#ifndef NO_HEAP_MATERIALS
    if (shards) {
      s.albedo = glass;
      SURF_ROUGH(0.1);
    }
#endif
  }
#ifdef FINE
  // A pit a blast left in a surface (the fine layer's word, bit 31 on an
  // inner face: its voxel is nearly whole, with a pocket in it) is darker
  // inside than the wall round its mouth: less of the sky gets in, and the
  // sun only as far as the pit is wide for its depth; and dust lies in it.
  // (By depth inside the voxel alone, every face of a break in the open
  // was darkened too: a column bitten through was a black stump. Depth is
  // not enclosure; the fine layer knows which is which.)
  if (vMatFace < 0 && fresh > 0.0) {
    float sunIn = dot(ng, uSunDir.xyz);
    s.cavity *= 1.0 - 0.5 * smoothstep(0.0, 0.5, fineDepth);
    s.lit *= 1.0 - 0.8 * min(2.0 * fineDepth * sqrt(max(1.0 - sunIn * sunIn, 0.0)) / max(sunIn, 0.2), 1.0);
    s.albedo *= 0.86;
  }
#endif
  // (By the material's own roughness: the pattern's variation of it must
  // not flip single pixels between metal and paint.)
  bool metal = (flags & 128) != 0 && p1.r < 0.5;
  // Sheet metal in a colour is painted (a car, a drum, a sign): the colour
  // is the paint's, matt, under a coat that mirrors without taking the
  // colour on. Bare metal is grey, or pale without being white.
  float paint = 0.0;
#ifndef NO_PAINT
  if (metal) {
    float hi = max(s.albedo.r, max(s.albedo.g, s.albedo.b)), lo = min(s.albedo.r, min(s.albedo.g, s.albedo.b));
    paint = max(smoothstep(0.35, 0.6, (hi - lo) / max(hi, 1e-3)), smoothstep(0.62, 0.75, lo));
  }
#endif
#if defined(BEVEL) && !defined(FINE)
  // Edges. A cast corner, a brick's arris, the lip of a kerb: none is a
  // razor. Where the face ends at an edge of the thing as it was built
  // (the as-built bits: nothing beside it in its plane), the normal rolls
  // over toward the face around the corner in the last centimetre and a
  // half, wider where the edge is chipped, and worn material shows paler;
  // where another face rises from it (a wall from the ground, a sill from a
  // wall) dirt lies in the crease and less sky reaches it. Only real edges:
  // the lattice inside a flat face is not drawn. Near the eye only (a
  // voxel has to be several pixels wide), so at most the faces within a
  // few metres pay the lookups.
  float bevel = s.bevel * (1.0 - smoothstep(0.03, 0.12, fwm)) * (1.0 - min(fresh + loose, 1.0));
  // Painted sheet is pressed, not cut: the edge of a panel is a fold with
  // a radius, seen from across a street. On a thing that was never part
  // of the building (a car, a drum) nothing says where its edges are, and
  // each of its quads is taken for a panel.
  bool panel = paint > 0.5 && !built && fresh + loose == 0.0;
  // (Bare metal is rolled or drawn: a post, a rail, a girder's flange have
  // no razor edge either, and theirs too is seen from across a street.)
  float fold = max(paint, metal ? 0.6 : 0.0);
  if (panel || (metal && built && fresh + loose == 0.0)) bevel = 1.0 - smoothstep(0.12, 0.45, fwm);
  // (A round bar has no arris to wear or to fold: it was a bright ruled
  // seam down every post.)
  if (roundBar) bevel = 0.0;
  // Anything else that was put there and not built (a crate, a bench, a
  // bin): its quads are its boards and parts, and each ends at an edge
  // that is worn like any other.
  bool placed = (vMatFace & (1 << 22)) != 0 && !built && !panel && fresh + loose == 0.0;
  // (Not on a lawn: no dirt gathers in a line where turf steps up, and
  // grass has no arris. It was a ruled hairline at the foot of every step
  // of a bank, and one down every inside corner.)
  if (bevel > 0.0 && (built || panel || placed) && pattern != PAT_TURF) {
    // Where in its voxel the pixel lies. (In the voxel it is shaded as: the
    // half pixel a quad is grown by lies past the edge, and is the edge.)
    vec2 fr = clamp(uv - (axis == 0 ? vc.zy : (axis == 1 ? vc.xz : vc.xy)), 0.0, 1.0) - 0.5;
    vec2 e = 0.5 - abs(fr);
    vec2 sg = sign(fr);
    // Only the quad's own rim can be an edge: inside it the voxel beside
    // this one is part of the same flat face. So a wall's or a lawn's
    // inside pays no lookup at all.
    vec3 lc = vc - vPat - vFirst;
    vec2 at = vec2(dot(lc, tu), dot(lc, tv)), last = vec2(dot(span, tu), dot(span, tv)) - 1.5;
    bvec2 rim = bvec2(sg.x > 0.0 ? at.x > last.x : at.x < 0.5, sg.y > 0.0 ? at.y > last.y : at.y < 0.5);
    ivec3 cell = ivec3(floor(vc + 0.5)), up = ivec3(nl);
    vec2 convex = vec2(0.0), crease = vec2(0.0);
    ivec3 bits = textureSize(uSolid0, 0); // bytes along x, then z, then y
    // (One axis after the other: one copy of the lookups.)
    for (int k = 0; k < 2; k++) {
      if (!rim[k] || e[k] >= (fold > 0.0 ? 0.5 : 0.34)) continue;
      if (panel || placed) { convex[k] = 1.0; continue; }
      ivec3 side = cell + ivec3((k == 0 ? tu : tv) * sg[k]);
      // (Beside the world's last voxel the world goes on, as the far
      // field draws it: no edge there. It was a ruled line along the join,
      // pale on a road and dark on a lawn; the far field's engineer
      // measured it.)
      if (side.x < 0 || side.z < 0 || side.x >= bits.x * 8 || side.z >= bits.y) continue;
      if (!wasSolid(side)) convex[k] = 1.0;
      else if (wasSolid(side + up)) crease[k] = 1.0 - smoothstep(0.0, 0.3, e[k]);
    }
    if (convex.x + convex.y > 0.0) {
      // Chips: the edge is worn more here than there, by the pattern's
      // fine noise, which does not know the voxels.
      vec2 w = 0.09 * (0.8 + 1.6 * smoothstep(0.6, 0.9, s.noise.zw)) * bevel + fw;
      // (A fold's radius is half a hand; paint does not chip like stone.)
      w = mix(w, vec2(0.45) + fw, fold);
      convex *= 1.0 - smoothstep(vec2(0.0), w, e);
      // (A fold a pixel wide turns through its whole angle inside that
      // pixel: what it mirrors is spread over the turn, or the sun in it is
      // a dotted line across a bonnet.)
      if (fold > 0.0) {
        vec2 turn = step(1e-3, convex) * fw / w;
        s.rough = max(s.rough, min(1.5 * max(turn.x, turn.y), 1.0));
      }
    }
    nb += (tu * (convex.x * sg.x) + tv * (convex.y * sg.y)) * mix(0.9, 0.55, fold);
    float worn = max(convex.x, convex.y) * (1.0 - fold), dirt = max(crease.x, crease.y);
    // Worn: toward the pale of the material's own dust. In the crease:
    // darker, and what little sky gets in.
    s.albedo = mix(s.albedo, mix(s.albedo, vec3(luma(s.albedo)), 0.3) * 1.25 + 0.01, worn * 0.45 * bevel);
    s.albedo *= 1.0 - 0.3 * dirt * dirt;
    s.cavity *= 1.0 - 0.45 * dirt;
  }
#endif
  vec3 n = normalize(qrot(vRq, nb));
  // (A round bar is lit and shadowed as round: by its face's own
  // direction one face of a trunk is lit and the next dark to a ruled
  // line, in a raking sun.)
  if (roundBar) ng = n;
  if (ember && !leafy) n = ng;
#ifdef HEAP
  // The stones of a heap and the sprays of a crown: one texture of cells
  // (render_stone.js), looked up along the mound at up to three sizes.
  // Rubble that is a rubble material has stones; a piece of wall lying
  // loose where it fell is lit as part of the heap and keeps its own
  // pattern, here as in the program that draws everything else.
  bool stony = loose > 0.0 && pattern == PAT_RUBBLE;
  vec4 big = vec4(0.5, 0.5, 0.5, 1.0), fines = big, block = big, shade = big;
#ifdef DETAIL
  // How much of each size of stone is left: gravel, chunks, blocks.
  vec3 left = 1.0 - smoothstep(vec3(0.04, 0.12, 0.5), vec3(0.14, 0.45, 1.7), vec3(fwm));
  // (Sprays last by a footprint midway between the pixel's own and the
  // foreshortened one: they are flat on the mound, not on the cube's face.)
  float lumps = leafy ? 1.0 - smoothstep(0.1, 0.5, sqrt(fwm * fwd)) : (stony ? left.z : 0.0);
  // (Not everywhere are there blocks: in places the heap is all small
  // stuff, and a block at the edge of such a place is half under it. And
  // from within a few steps a block is a shape the heap does not have:
  // there it is a third of itself, a change of tone and lie.)
  float bare = stony && !shards ? smoothstep(0.3, 0.45, s.noise.x) * left.z * (0.35 + 0.65 * smoothstep(0.03, 0.1, fwm)) : 0.0;
#else
  // (The lowest tier: stones a hand across, sprays of one size; one
  // lookup.)
  float lumps = leafy ? 1.0 - smoothstep(0.2, 0.7, sqrt(fwm * fwd)) : (stony ? 1.0 - smoothstep(0.25, 0.8, fwm) : 0.0);
#endif
  if (lumps > 0.0) {
    // The level of detail for all of them, worked out once: a pixel's size
    // on the mound (by its distance and how steeply the mound is seen, not
    // by the cube face it happens to fall on: a tread and its riser would
    // read two levels apart and the stair would show as bands; and midway
    // between its length and its width where it is seen at a slant, or a
    // flank turned from the eye is blotches), in texels of a 256 texel
    // tile; each size then adds its own scale.
    vec3 eye = uCamPos.xyz - vWorld;
    float far = length(eye);
    float lod = log2(far * uProj.w * uScreen.y * 2.0 / (VOXEL_FS * sqrt(max(dot(ng, eye) / far, 0.2)))) + 8.0;
#ifdef DETAIL
    // (Each size only where it shows: chunks while they are over a couple
    // of pixels, gravel likewise, blocks where there are any.)
    if (leafy || left.y > 0.0) big = textureLod(uStone, huv * (leafy ? 0.047 : 0.089), lod + (leafy ? -4.41 : -3.49));
    if (leafy || left.x > 0.0) fines = textureLod(uStone, huv.yx * (leafy ? 0.19 : 0.31) + 0.37, lod + (leafy ? -2.4 : -1.69));
    if (bare > 0.0) {
      vec2 buv = huv * 0.021 + 0.61;
      block = textureLod(uStone, buv, lod - 5.57);
      // What stands a hand's breadth toward the sun (the sun along the
      // heap, in the lookup's axes): a block throws its shadow that far.
      vec2 sunward = vec2(dot(uSunDir.xyz, hU), dot(uSunDir.xyz, hV)) / max(dot(uSunDir.xyz, ng), 0.3);
      shade = textureLod(uStone, buv + sunward * (1.3 * 0.021), lod - 5.57);
    }
#else
    big = textureLod(uStone, huv * (leafy ? 0.047 : 0.065), lod + (leafy ? -4.41 : -3.94));
#endif
  }
  if (leafy) {
    // Leaves: the cells are sprays of leaf, each turned its own way, from
    // yellow where it is young to blue-green where it is old, with the
    // dark of the crown's inside between them.
    n = ng;
    if (lumps > 0.0) {
#ifdef DETAIL
      // (One spray in five is not there, and the dark inside shows: a
      // crown of sprays with only a line between them is a cobbled ball.
      // A cell's tone is read as it is, never wrapped: between two cells
      // the lookup blends their tones, and a wrapped blend is a dotted
      // line round every cell.)
      float deep = smoothstep(0.78, 0.82, big.r) * smoothstep(0.05, 0.5, big.a) * 0.45;
      // (The dark between two sprays lies under the upper one, on the side
      // away from the light: a spray lies over the one below it. A dark
      // line all round each is a ball of cobbles. Which side of its spray
      // the pixel is on: the way the spray falls away at its rim, against
      // the sky's light and the sun's.)
      vec2 out2 = big.gb - 0.5;
      float under = clamp(0.5 - 2.2 * dot(hU * out2.x + hV * out2.y, normalize(uSunDir.xyz * 0.6 + vec3(0.0, 0.8, 0.0))), 0.0, 1.0);
      float gap = max((1.0 - smoothstep(0.0, 0.3, big.a)) * (0.08 + 0.5 * under), deep) + (1.0 - smoothstep(0.0, 0.25, fines.a)) * 0.35;
      vec2 lean = (out2 * 1.3 * (1.0 - 0.6 * deep) + (fines.bg - 0.5) * 1.1) * lumps;
      float tone = min(big.r * 1.25, 1.0) * 0.6 + fines.r * 0.4;
      n = normalize(ng + (hU * lean.x + hV * lean.y) * 0.8);
      s.albedo *= mix(vec3(1.0), mix(vec3(0.74, 0.9, 0.88), vec3(1.22, 1.08, 0.7), tone) * (1.0 - 0.55 * min(gap, 1.0)), lumps);
      // (Leaf alight: its sparks are sprays, one small spray here and
      // there glowing and the rest char. By the pattern's noise they were
      // the same blots every third of a metre: a wallpaper of gold.)
      if (ember) s.albedo *= mix(1.0, mix(0.1, 3.0, smoothstep(0.68, 0.88, fines.r) * (1.0 - min(gap, 1.0))), lumps);
      s.cavity *= 1.0 - 0.45 * min(gap, 1.0) * lumps;
      // The crown's outline is leaves, not a curve: where it turns away from
      // the eye the gaps between the sprays are holes. (Only there: nothing
      // lies behind a crown's skin, a hole in its middle would go through.)
      // (And only where the eye does not look down on it: a gap in a
      // crown's outline shows sky; behind a gap in the top or the side of
      // a hedge seen from above is the hedge, and cut there it is a sheet
      // of sprays with the path and the wall showing through.)
      vec3 toEye = normalize(uCamPos.xyz - vWorld);
      float rim = (1.0 - smoothstep(0.12, 0.5, dot(ng, toEye))) * lumps * (1.0 - smoothstep(0.0, 0.3, toEye.y));
      // (Whole sprays are missing there, the ones that show dark further
      // in first and more of them the further round; at the very outline
      // the gaps between those that are left open too. Cutting along the
      // gaps alone is a net, and along the small sprays' pinpricks; and
      // gaps that open a hair's breadth further in are slits and single
      // pixels of sky in the middle of the leaf.)
#ifndef FINE
      if (heap && (big.r > 1.0 - rim * 0.75 || big.a < (rim - 0.6) * 0.75)) gone = true;
#endif
#else
      // (The lowest tier's crown: the mound's slope from the six lookups a
      // heap takes there, and sprays of one size. No cut outline.)
      float gap = max((1.0 - smoothstep(0.0, 0.3, big.a)) * 0.6, smoothstep(0.78, 0.82, big.r) * smoothstep(0.05, 0.5, big.a) * 0.8) * lumps;
      n = normalize(ng + (hU * (big.g - 0.5) + hV * (big.b - 0.5)) * (1.3 * lumps));
      s.albedo *= mix(vec3(1.0), mix(vec3(0.74, 0.9, 0.88), vec3(1.22, 1.08, 0.7), min(big.r * 1.25, 1.0)), lumps) * (1.0 - 0.55 * gap);
      // (Leaf alight: one spray in five glows and the rest are char.)
      if (ember) s.albedo *= mix(1.0, mix(0.12, 2.2, smoothstep(0.72, 0.86, big.r)), lumps);
      s.cavity *= 1.0 - 0.4 * gap;
#endif
    }
  }
#endif
  if (loose > 0.0 || crumb) {
    // Rubble is stones, not cubes, and of every size: blocks a forearm
    // long, which still read as stones from across a street; chunks a hand
    // across among them; gravel between. Each stone has its own tone and
    // lean and a dark gap around it, and each size is gone before its
    // stones are smaller than a couple of pixels. The lowest tier has
    // stones of one size, for the one lookup its grain took.
#ifdef HEAP
    float small = 0.0;
    vec2 lean = vec2(0.0);
    if (stony) {
      float tone = 0.5, gap = 0.0, brown = 0.0;
#ifdef DETAIL
      small = left.y;
      if (lumps > 0.0) {
        // (Half of the large stones are blocks, four in ten of the middle
        // size are chunks; gravel lies wherever neither does.)
        // (A stone ends where its distance inside itself runs out, a
        // little before the next begins: between two cells the lookup
        // blends their tones, and a stone cut out by its tone has that
        // blend for an outline, a hairline of other colours stepped at the
        // texture's own pitch.)
        float slab = smoothstep(0.48, 0.52, block.r) * smoothstep(0.1, 0.25, block.a) * bare;
        float chunk = smoothstep(0.56, 0.6, big.r) * smoothstep(0.1, 0.25, big.a) * left.y * (shards ? 1.0 - left.x : 1.0);
        // In the shadow of a block: anything that is not a block, and a block
        // lower than the one sunward of it.
        // (Soft: full where the point toward the sun lies well inside the
        // block, nothing where it only touches its rim. A hard-edged band
        // of one darkness along every block is a tiger's stripes.)
        float thrown = smoothstep(0.48, 0.52, shade.r) * smoothstep(0.0, 0.6, shade.a) * bare * (1.0 - slab * (1.0 - step(block.r + 0.02, shade.r)));
        s.lit *= 1.0 - 0.6 * thrown;
        // (And what lies among blocks lies lower: less of the sky reaches it.)
        s.cavity *= (1.0 - 0.25 * thrown) * (1.0 - 0.3 * (bare - slab));
        // (A stone's tone is read as it is, never wrapped: see the leaves.)
        float ct = (big.r - 0.58) * 2.38, bt = (block.r - 0.5) * 2.0;
        tone = mix(0.5, fines.r, left.x);
        lean = (fines.bg - 0.5) * left.x;
        gap = (1.0 - smoothstep(0.0, 0.14, fines.a)) * left.x;
        tone = mix(tone, ct, chunk);
        lean = mix(lean, big.gb - 0.5, chunk);
        gap = mix(gap, 1.0 - smoothstep(0.0, 0.24, big.a), chunk);
        // (A block's face is broken stone too: it keeps a part of the
        // gravel's lean, tone and pits.)
        tone = mix(tone, bt + (tone - 0.5) * 0.3, slab);
        lean = mix(lean, (block.gb - 0.5) * 1.8 + lean * 0.45, slab);
        // (No dark line all round a block: that is crazy paving. A block is
        // dark on the side away from the sun, where its shadow falls, and
        // its rim toward the sun is lit by its own lean.)
        gap = mix(gap, max(0.3 * (1.0 - smoothstep(0.0, 0.45, block.a)), gap * 0.35), slab);
        // One stone in four is the brown of fired clay or rusted bar.
        brown = smoothstep(0.72, 0.78, mix(ct, bt, slab)) * max(chunk, slab);
        tone -= 0.35 * brown;
      }
#else
      small = lumps;
      if (lumps > 0.0) {
        tone = mix(0.5, big.r, lumps);
        lean = (big.gb - 0.5) * lumps;
        // (A stone is told from the next by its tone and by which way it
        // leans, its rim toward the sun lit and the other dark: a dark line
        // all round each is crazy paving.)
        gap = (1.0 - smoothstep(0.0, 0.3, big.a)) * 0.5 * lumps;
        brown = smoothstep(0.75, 0.8, big.r) * lumps;
        tone -= 0.35 * brown;
      }
#endif
      if (shards) {
        // Broken glass: a pane comes down as crumbs that hold together in
        // clumps. Pale, in the green of thick glass and greyer than the pane
        // was; every crumb its own tone, from frosted white to the dark you
        // see into, and dark between them (what tells it from snow); and
        // every crumb lies its own way, so that here and there one mirrors
        // the sun or the sky.
        vec3 pane = mix(s.albedo, vec3(luma(s.albedo)), 0.35) * vec3(0.9, 1.0, 0.92);
        s.albedo = pane * (0.25 + 1.0 * tone * tone) * (1.0 - 0.65 * gap);
        // (Three crumbs in ten are clean enough for it; the rest are frosted
        // with dust. From afar none is seen to.)
        SURF_ROUGH(tone > 0.7 ? 0.07 : 0.7);
        lean *= 2.0;
      } else {
        s.albedo = mix(s.albedo, s.albedo * vec3(1.18, 0.86, 0.7), brown * 0.45);
        // A heap is darker than the wall it was: a third of it is the shade
        // between its stones, drawn or not.
        s.albedo *= (0.56 + 0.5 * tone) * (0.94 + 0.12 * grain.r) * (1.0 - 0.45 * gap);
      }
      s.cavity *= 1.0 - 0.5 * gap;
    } else
#endif
    s.albedo *= 0.88 + 0.24 * mix(0.5, grain.r, near);
    // (On the mound the slope is the surface; a cube that stands clear
    // keeps some of its face. A gentle lean besides: a face of the heap
    // turned right out of the sun by its grain reads as a black blot.)
#ifdef HEAP
    n = normalize(mix(n, ng, heap ? 1.0 : 0.7) + (t1 * (grain.r - 0.5) + t2 * (grain.g - 0.5)) * (0.45 * near * (1.0 - 0.6 * small)) + (hU * lean.x + hV * lean.y) * 1.1);
#else
    // (No stones without the heap program: small is 0 and lean is nothing.)
    n = normalize(mix(n, ng, 0.7) + (t1 * (grain.r - 0.5) + t2 * (grain.g - 0.5)) * (0.45 * near));
#endif
    s.cavity *= 0.8 + 0.2 * grain.g;
  }
  // (How much of what a smooth surface mirrors is the sky: see below.)
  float mirrors = 1.0;
#ifdef WET_STREET
  // (How much of a film lies here, for the lamps it gives back: below.)
  float filmed = 0.0;
#endif
#ifdef WET_MASK
  {
    // Wet. What water has stood on, up to the line it stood at, is darker
    // by how much the material drinks, and while it is quite wet a film
    // lies on it and mirrors the sky; as it dries the film goes first and
    // the dark after, in blotches, from a ragged edge.
    vec2 w = textureLod(uWet, vWorld.xz * uOccInv.xy, 0.0).rb;
#ifdef WET_STREET
    // (After rain: quite wet all over, up to the street's line or the
    // water's own where that stood higher.)
    w = vec2(1.0, max(w.g / max(w.r, 1e-3), WET_STREET));
#endif
    float wet = clamp(w.r, 0.0, 1.0);
    wet *= 1.0 - smoothstep(0.0, 0.08, vWorld.y - w.g / max(wet, 1e-3));
    if (wet > 0.0) {
      wet = smoothstep(0.15, 0.55, wet + (s.noise.x - 0.5) * 0.5 * (1.0 - wet));
      // (By the material's own roughness: glass, glazed tile, paint and
      // metal do not drink.)
      float porous = metal || paint > 0.5 ? 0.0 : smoothstep(0.35, 0.8, p1.r);
      s.albedo *= 1.0 - wet * mix(0.1, 0.55, porous);
      // (No film lies on a heap or a crown: water runs down between the
      // stones, which are dark and a little glossy and keep their shapes.
      // A sheet over them is rubble wrapped in cling film.)
      float film = loose > 0.0 || leafy ? 0.0 : smoothstep(0.6, 0.95, wet) * (ng.y > 0.5 ? 1.0 : 0.45);
      s.rough = mix(mix(s.rough, min(s.rough, 0.55), wet), 0.1, film);
      // (Water lies level over the grain.)
      n = normalize(mix(n, ng, 0.7 * film));
      // (A wet street mirrors what stands along it as much as the sky, and
      // that is darker than the sky: the mirror gives back a part.)
      mirrors = 1.0 - 0.45 * film;
#ifdef WET_STREET
      filmed = film;
#endif
    }
  }
#endif
  vec3 toCam = uCamPos.xyz - vWorld;
  vec3 v = toCam * inversesqrt(max(dot(toCam, toCam), 1e-8));
  vec3 l = uSunDir.xyz;

  float ndlg = dot(ng, l);
  // (Leaves let the sun through and scatter it: no hard terminator, and
  // the crown is lit a little way round its side.)
#ifdef HEAP
  if (leafy) ndlg = (ndlg + 0.3) / 1.3;
#endif
  float ndl = ndlg > 0.0 ? max(dot(n, l), 0.0) : 0.0;
#ifdef HEAP
  if (leafy && ndlg > 0.0) ndl = max((dot(n, l) + 0.35) / 1.35, 0.0) * smoothstep(0.0, 0.15, ndlg);
#endif
  // A break is rough below what is drawn: it scatters the sun around its
  // corners instead of going black on the side turned away.
  if (fresh > 0.0 && ndlg > 0.0) ndl = mix(ndl, max((dot(n, l) + 0.4) / 1.4, 0.0), fresh);
  float dist = sqrt(dot(toCam, toCam));
  float sh = 0.0;
  // (A heap's terraces are in the shadow map as the cubes they are: the
  // mound looks for its shadow from a quarter of a metre toward the sun,
  // clear of them, and still finds the wall's.)
  vec3 sp = heap || leafy ? lp + l * 0.25 : lp;
  if (ndlg > 0.0 && uSunCol.r + uSunCol.g > 1e-4) {
#if SHADOW_MAX_R == 1 && CASCADES == 1
    // (One cascade and a kernel of one texel: sunShadow uses neither its
    // noise nor the footprint.)
#define SHADOW_NOISE 0.0
    const float footprint = 0.0;
#else
#define SHADOW_NOISE ign(gl_FragCoord.xy + uCamUp.w * 5.588)
    float footprint = dist * uProj.w * uScreen.y * 2.0;
#endif
    sh = uSunDir.w > 0.0 ? sunShadow(sp, ng, ndlg, SHADOW_NOISE, footprint) : 1.0;
  }

  if (uDynMap.z > 0.0 && ng.y > 0.3) {
    // Something that moves hangs or lies close above: it takes the sky's
    // light and, where it is too small for the shadow map, the sun's.
    // (From the face itself: a heap's lifted light point would sit above
    // the underside of whatever lies on it.)
    float c = contactShadow(vWorld, (vMatFace & (1 << 22)) != 0) * smoothstep(0.3, 0.7, ng.y);
    ao *= 1.0 - 0.85 * c;
#ifndef SOFT_SHADOW
    sh *= 1.0 - 0.5 * c;
#endif
  }
#ifdef SOFT_SHADOW
  // Debris is in no shadow atlas, and neither is dust: both are in the soft
  // map, whatever way the surface faces.
  if (sh > 0.0) sh *= softShadow(vWorld + ng * 0.03, 1.0);
#endif
  vec3 hemi = mix(uAmbGround.rgb, uAmbSky.rgb, n.y * 0.5 + 0.5);
  // Where no sky reaches, a little neutral bounce light remains.
  float open = sv;
  vec3 amb = (hemi * sv + uAmbGround.rgb * (0.22 * (1.0 - sv))) * (ao * s.cavity);

  vec3 f0 = metal ? mix(s.albedo, vec3(0.05), paint) : vec3(0.04);
  vec3 diff = metal ? s.albedo * mix(0.28, 1.0, paint) : s.albedo;
#ifdef SPECULAR
  float gloss = s.rough * (1.0 - 0.5 * paint);
#endif
  vec3 sun = uSunCol.rgb * (ndl * sh * s.lit);
  // A quad narrower than a pixel (stair treads and ledges seen edge-on) is
  // hit by only the odd pixel centre; left at full strength those hits read
  // as sparkles on a dark surface, so its direct light is scaled by coverage.
  vec2 cover = quadSize / max(fw, 1e-4);
  // (Not a bank of grass: it is lit as the lawn it lies in.)
  if (!bank) sun *= clamp(min(cover.x, cover.y), 0.25, 1.0);
  vec3 col = diff * (sun * mix(1.0, s.cavity, 0.6));
  vec3 ambient = diff * amb;
#ifdef SPECULAR
  if (ndl * sh > 0.0) col += sun * sunSpecular(n, v, l, gloss, f0);
  if (metal || s.rough < 0.55) {
    // Smooth and metallic surfaces mirror the sky gradient, dimmed by how
    // much sky the spot can actually see.
    float ndv = max(dot(n, v), 0.0);
    float fr = 1.0 - ndv;
    float fr2 = fr * fr;
    // (A clear coat over paint is no mirror at any angle: orange peel, dust.)
    vec3 fres = f0 + (max(vec3(1.0 - gloss) * (1.0 - 0.45 * paint), f0) - f0) * (fr2 * fr2 * fr);
    vec3 r = reflect(-v, n);
    vec3 env = mix(mirrorEnv(normalize(r + n * gloss)), hemi, gloss * gloss);
    // Bare metal is not a looking glass: what it gives back of a blue sky
    // and a green lawn is mostly their brightness.
    if (metal) env = mix(env, vec3(luma(env)), 0.55 * (1.0 - paint));
    ambient += env * fres * (open * ao * mirrors);
  }
#else
  // Without the specular path metals still need something to reflect.
  if (metal) ambient += mirrorEnv(reflect(-v, n)) * f0 * (open * ao);
#endif
  col += ambient;
#ifdef POINT_LIGHTS
  if (uCamFwd.w > 0.0) col += diff * pointLights(vWorld, n, 0.0, vWorld + ng * 0.32);
#ifdef WET_STREET
  // (The film's own grain is finer than its 0.1: the lobe of a road that
  // is wet, not of a sheet of glass, or a lamp is one hard dot.)
  if (filmed > 0.0 && uCamFwd.w > 0.0) col += pointGlints(vWorld, n, v, 0.42, vWorld + ng * 0.32) * filmed;
#endif
#endif
  // (What glows, glows in its own colour: only an ember's follows its pattern.)
  if (p1.g > 0.0) col += (pattern == PAT_EMBER ? s.albedo : paletteCol) * (p1.g * 18.0);

  float fog = fogAmount(-toCam, dist);
  col = hazed(col, -v, fog);
  // Alpha carries the ambient share of the pixel so screen-space AO can
  // darken ambient light only.
#ifdef HDR_DITHER
  // (The packed target has no alpha, and without screen-space AO nothing
  // would read it: render_post.js, derive.)
  oColor = vec4(enc(col), 1.0);
#else
  float share = luma(ambient) / max(luma(col), 1e-4) * (1.0 - fog);
  // (A heap's terraces are not there: no screen-space darkening in their creases.)
  // (Nor are a lawn's steps: the screen's own darkening laid a soft dark
  // band under the edge of every step of a bank in shadow.)
  if (heap || leafy || lawn) share *= 0.25;
  oColor = vec4(enc(col), clamp(share, 0.0, 1.0));
#endif
  // (Last: a discard ahead of a lookup leaves its derivatives undefined.
  // Not with the depth pre-pass, which has drawn every pixel's depth and
  // waits for its colour.)
#if defined(HEAP) && defined(DETAIL) && !defined(FINE) && !defined(NO_CUT)
  if (gone) discard;
#endif
}
`;

// Glass: what it mirrors over a faint tint, premultiplied, drawn after the
// opaque scene without writing depth. A window is read by its reflection:
// the sky with its clouds drifting across, a dark skyline where the other
// side of the street would be, the ground below that, and the sun as a
// glint. No two panes sit in their frames quite alike and old glass is not
// flat, so the picture breaks from pane to pane and wobbles within one.
export const GLASS_FS = `
${FRAME}
${UTIL}
${ATMOSPHERE}
${LIGHTS}
${SHADOW}
${SURFACE}
${FACE_SETUP}
flat in vec2 vPane;
// The world as a window shows it, looking along d.
vec3 glassEnv(vec3 d) {
  vec3 c = skyBase(d);
  float h = max(d.y, 0.0);
  // One octave of the sky pass's cloud deck: its broad shapes.
  vec2 cuv = d.xz / (h + 0.12) * 0.11 + uCamPos.w * vec2(0.0016, 0.0007);
  float cover = uSkyZenith.w;
  float cl = smoothstep(1.0 - cover, 1.28 - cover, texture(uNoise, cuv).r * 0.8 + 0.1) * smoothstep(0.015, 0.2, h);
  c = mix(c, (uSunCol.rgb * 0.16 + uAmbSky.rgb * 0.75) * uSkyHorizon.w, cl * 0.8);
  // Roofs against the sky: a stepped line a few degrees up, by compass bearing.
  float a = atan(d.z, d.x) * 5.0;
  float roof = 0.03 + 0.16 * mix(hash13(vec3(floor(a), 3.0, 7.0)), hash13(vec3(floor(a) + 1.0, 3.0, 7.0)), smoothstep(0.42, 0.58, fract(a)));
  vec3 light = uSunCol.rgb * (max(uSunDir.y, 0.0) * 0.5) + uAmbSky.rgb;
  c = mix(vec3(0.09, 0.085, 0.08) * light, c, smoothstep(roof - 0.012, roof + 0.012, d.y));
  vec3 ground = mix(uGround.rgb, vec3(0.11), 0.65) * light;
  return mix(ground, c, smoothstep(-0.03, 0.0, d.y));
}
void main() {
  int face = (vMatFace >> 8) & 7;
  int axis = face >> 1;
  vec3 nl = faceNormal(face);
  vec3 pc = vLocal + vPat;
  vec2 uv = axis == 0 ? pc.zy : (axis == 1 ? pc.xz : pc.xy);
  vec3 tu = axis == 0 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
  vec3 tv = axis == 1 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  // Grime so large panes are not perfectly uniform, and the same noise as
  // the glass's waviness.
  vec4 grime = BLOT_TAP(uv * 0.019);
  vec2 lean = vPane * 0.035 + (grime.rg - 0.5) * 0.03;
  vec3 ng = qrot(vRq, nl);
  vec3 n = normalize(qrot(vRq, nl + tu * lean.x + tv * lean.y));
  vec3 toCam = uCamPos.xyz - vWorld;
  float dist = sqrt(max(dot(toCam, toCam), 1e-8));
  vec3 v = toCam / dist;
  vec3 l = uSunDir.xyz;
  vec3 tint = pow(vPal0.rgb, vec3(2.2));

  float ndv = max(dot(n, v), 0.0);
  float fr = 1.0 - ndv;
  float fr2 = fr * fr;
  // Tinted glazing mirrors more and lets less through than a clear pane.
  float dark = 1.0 - luma(tint);
  float f0 = 0.05 + 0.24 * dark * dark;
  float fres = f0 + (1.0 - f0) * (fr2 * fr2);
  float shelter;
  float sv = skyVisibility(vWorld, ng, shelter) * 0.9 + 0.1;
  vec3 hemi = mix(uAmbGround.rgb, uAmbSky.rgb, ng.y * 0.5 + 0.5);
  float body = 0.04 + 0.26 * dark * dark + 0.08 * grime.r;
  vec3 col = tint * hemi * (sv * body) + glassEnv(reflect(-v, n)) * (fres * sv);
  float ndl = dot(ng, l);
  if (ndl > 0.0 && uSunCol.r + uSunCol.g > 1e-4) {
    float sh = uSunDir.w > 0.0 ? sunShadow(vWorld, ng, ndl, ign(gl_FragCoord.xy), 0.0) : 1.0;
    col += uSunCol.rgb * (ndl * sh) * (sunSpecular(n, v, l, 0.09, vec3(f0)) + tint * body * 0.6);
  }
#ifdef POINT_LIGHTS
  if (uCamFwd.w > 0.0) col += tint * body * pointLights(vWorld, ng, 0.0, vWorld + ng * 0.32);
#endif
  float alpha = clamp(body + fres, 0.0, 1.0);
  float fog = fogAmount(-toCam, dist);
  col = mix(col, fogColor(-v) * alpha, fog);
  oColor = vec4(enc(col), alpha);
}
`;

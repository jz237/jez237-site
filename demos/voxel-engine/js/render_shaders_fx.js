// Sky and particle shaders.
import { FRAME, UTIL, ATMOSPHERE, LIGHTS, SHADOW } from './shaders.js';
import { TURF_DRY, TURF_LUSH } from './render_shaders_surface.js';

// One oversized triangle covering the screen; vUv spans [0, 1].
export const FULLSCREEN_VS = `
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 1.0, 1.0);
}
`;

export const SKY_VS = `
${FRAME}
out vec3 vDir;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  // View ray through this corner, built from the camera basis so it is
  // unaffected by sub-pixel jitter.
  vDir = uCamFwd.xyz + uCamRight.xyz * (p.x * uProj.z) + uCamUp.xyz * (p.y * uProj.w);
  gl_Position = vec4(p, 1.0, 1.0);
}
`;

// Analytic sky: gradient and sun halo from skyBase, plus the sun disc, a
// drifting cloud deck and, below the horizon, open country that fades into
// the haze so the world does not end at the edge of the voxel grid.
export const SKY_FS = `
${FRAME}
${UTIL}
${ATMOSPHERE}
uniform sampler2D uNoise;
in vec3 vDir;
out vec4 oColor;
#ifdef HDR_ENCODE
vec3 enc(vec3 c) { return sqrt(min(c, 16.0) * 0.0625); }
#elif defined(HDR_DITHER)
vec3 enc(vec3 c) { return min(c, 64.0) * (0.992 + 0.016 * ign(gl_FragCoord.xy)); }
#else
vec3 enc(vec3 c) { return min(c, 64.0); }
#endif
void main() {
  vec3 d = normalize(vDir);
  vec3 c;
  float gy = uGround.w;
  if (d.y < 0.0 && uCamPos.y > gy + 0.01) {
    float t = (gy - uCamPos.y) / d.y;
    vec3 p = uCamPos.xyz + d * t;
    // The same lawn as the turf voxels (PAT_TURF in render_shaders_surface.js:
    // lush and dry patches, mowing stripes, a trace of per-voxel jitter), so
    // the edge of the voxel world is hard to find. The jitter has no mips:
    // it fades out before a voxel gets smaller than a pixel.
    vec2 vx = p.xz * 10.0;
    float layer = floor(gy * 10.0) - 1.0;
    vec2 mottle = texture(uNoise, vx * 0.027 + layer * 0.173).rg;
    float blot = mottle.r * 0.6 + mottle.g * 0.4;
    float fine = 1.0 - smoothstep(0.25, 0.8, max(fwidth(vx.x), fwidth(vx.y)));
    float jitter = (mottle.g - 0.5) * 0.04 * fine;
    vec3 albedo = uGround.rgb * mix(${TURF_DRY}, ${TURF_LUSH}, smoothstep(0.2, 0.8, blot)) * (1.0 + jitter);
    // (Weathered, as every face in the world is: see surfacePattern.)
    albedo = mix(albedo, vec3(dot(albedo, vec3(0.3, 0.55, 0.15))) * vec3(1.03, 1.0, 0.94), 0.2);
    albedo *= 1.0 + 0.045 * sin(vx.y * 0.3927) * (1.0 - smoothstep(2.0, 6.0, fwidth(vx.y)));
    // Away from the edge of the voxel world the lawn gives way to open
    // country: fields a few tens of metres across behind dark hedges, each
    // its own crop, with woodland here and there, all in the muted tones
    // land has from a distance.
    vec2 beyond = max(max(-p.xz, p.xz - 1.0 / uOccInv.xy), 0.0);
    float away = length(beyond);
    // The scene's lawn runs out within a few metres of its edge: first into
    // rough grass, unmown and duller, then into the fields. Carried on to
    // the horizon it is a sheet of the brightest green in the picture.
    vec3 rough = mix(uGround.rgb * ${TURF_DRY}, vec3(dot(uGround.rgb, vec3(0.3, 0.6, 0.1))), 0.55) * (0.38 + 0.3 * blot);
    albedo = mix(albedo, rough * (1.0 + jitter), smoothstep(0.0, 0.9, away));
    float far = smoothstep(1.5, 6.0, away);
    if (far > 0.0) {
      vec4 wide = texture(uNoise, p.xz * 0.0023 + 0.21);
      // Field boundaries wander a little instead of following a ruled grid.
      vec2 fp = (p.xz + (wide.rg - 0.5) * 22.0) / vec2(43.0, 31.0);
      vec2 cell = floor(fp), f = fract(fp);
      float crop = hash13(vec3(cell, 4.0));
      vec3 land = crop < 0.45 ? vec3(0.07, 0.093, 0.048) : (crop < 0.7 ? vec3(0.105, 0.112, 0.058) : (crop < 0.88 ? vec3(0.155, 0.136, 0.083) : vec3(0.092, 0.076, 0.058)));
      land *= 0.9 + 0.2 * hash13(vec3(cell, 9.0));
      vec2 fwp = fwidth(fp);
      vec2 e = min(f, 1.0 - f);
      float hedge = 1.0 - min(smoothstep(0.0, 0.035 + fwp.x, e.x), smoothstep(0.0, 0.05 + fwp.y, e.y));
      float woods = smoothstep(0.56, 0.66, texture(uNoise, p.xz * 0.0011 + 0.63).r);
      land = mix(land, vec3(0.03, 0.052, 0.028), max(hedge * 0.8, woods));
      // Uneven growth inside a field, so a near one is not a flat sheet,
      // and the rows it was drilled in, each field its own way, until they
      // are too fine for a pixel.
      land *= (0.82 + 0.36 * wide.b) * (0.7 + 0.5 * texture(uNoise, p.xz * 0.013 + 0.4).r);
      float turn = hash13(vec3(cell, 13.0)) * 3.1416;
      float along = dot(p.xz, vec2(cos(turn), sin(turn))) * 2.6;
      land *= 1.0 + 0.11 * sin(along * 6.2832) * (1.0 - hedge) * (1.0 - smoothstep(0.1, 0.35, fwidth(along)));
      albedo = mix(albedo, land, far);
    }
    c = albedo * (uSunCol.rgb * max(uSunDir.y, 0.0) + uAmbSky.rgb);
    // The haze thickens over the distance: the land is gone into it well
    // before the horizon.
    float fog = 1.0 - (1.0 - fogAmount(d * t, t)) * exp(-away * 0.0022);
    c = hazed(c, d, fog);
  } else {
    c = skyBase(d);
#ifdef CLOUDS
    float h = max(d.y, 0.0);
    vec2 uv = d.xz / (h + 0.12) * 0.11 + uCamPos.w * vec2(0.0016, 0.0007);
    float n = texture(uNoise, uv).r * 0.55 + texture(uNoise, uv * 2.9 + 0.37).r * 0.3 + texture(uNoise, uv * 7.3).g * 0.15;
    float cover = uSkyZenith.w;
    float cl = smoothstep(1.0 - cover, 1.28 - cover, n) * smoothstep(0.015, 0.2, h);
    float sd = max(dot(d, uSunDir.xyz), 0.0);
    vec3 lit = (uSunCol.rgb * 0.16 + uAmbSky.rgb * 0.75) * uSkyHorizon.w + uSunGlow.rgb * (sd * sd * sd * 0.18);
    vec3 dark = uAmbSky.rgb * 0.38 + uSkyHorizon.rgb * 0.22;
    c = mix(c, mix(lit, dark, smoothstep(0.35, 1.0, cl) * 0.65), cl * 0.9);
#endif
    float sdot = dot(d, uSunDir.xyz);
    c += uSunGlow.rgb * (uSunCol.w * smoothstep(0.99982, 0.99994, sdot));
    // Haze swallows the lowest part of the sky like any distant object.
    c = mix(c, fogColor(d), uFogParams.w * exp(-max(d.y, 0.0) * 22.0) * 0.6);
  }
  oColor = vec4(enc(c), 0.0);
}
`;

// Simplest possible resolve: exposure, filmic curve, sRGB. The full post chain
// lives in render_shaders_post.js; this is its fallback and the low tier's core.
export const TONEMAP = `
vec3 tonemapFilmic(vec3 x) {
  // ACES fit by Stephen Hill: input transform, RRT+ODT rational, output transform.
  x = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777) * x;
  x = (x * (x + 0.0245786) - 0.000090537) / (x * (0.983729 * x + 0.4329510) + 0.238081);
  x = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602) * x;
  return clamp(x, 0.0, 1.0);
}
vec3 toSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
`;

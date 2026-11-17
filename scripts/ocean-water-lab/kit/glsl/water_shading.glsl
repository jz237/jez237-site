// ============================================================================
//  WATER KIT - surface shading (GLSL 3.30+ / GLSL ES 3.00)
// ----------------------------------------------------------------------------
//  Pure functions, no textures, no engine state. Your material supplies the
//  inputs it already has (sun, a reflection sample, the scene colour behind the
//  surface) and gets radiance back, in linear HDR.
//
//  Units: sunColor is the sun's irradiance on a surface facing it. A white
//  diffuse surface in full sun then has radiance sunColor / PI.
// ============================================================================

#ifndef WATER_PI
#define WATER_PI 3.14159265359
#endif
#define WATER_F0 0.02                    // reflectance of water at normal incidence (n = 1.333)

struct WaterMaterial {
    vec3 extinction;      // per metre, how fast each colour dies under water
    vec3 scatterColor;    // colour deep water sends back up (its "albedo")
    vec3 sssColor;        // tint of sunlight shining through wave crests
    float sssStrength;
    float roughness;      // GGX alpha of the ripples below the smallest simulated wave
    vec3 foamColor;
    float specular;       // sun glitter gain, 1 = physical
};

float waterSaturate(float x) { return clamp(x, 0.0, 1.0); }

// Fresnel reflectance of a surface whose unresolved slopes have std-dev 'sigma'.
// Schlick, with the rough-sea correction from Bruneton, Neyret & Holzschuch 2010:
// a wavy horizon never becomes a perfect mirror.
float waterFresnel(float NdotV, float sigma) {
    float f = pow(1.0 - NdotV, 5.0 * exp(-2.69 * sigma)) / (1.0 + 22.7 * pow(sigma, 1.5));
    return WATER_F0 + (1.0 - WATER_F0) * f;
}

// GGX alpha^2 for this pixel: base ripples plus everything the wave LOD filtered out.
float waterAlpha2(float baseRoughness, float lostSlopeVariance) {
    return clamp(baseRoughness * baseRoughness + lostSlopeVariance, 0.00004, 0.5);
}

// Direction to look up in the sky / reflection probe. Rays that would dive back
// into the sea are lifted to the horizon, and rough distant water looks a little
// above the mirror direction (visible facets tilt towards the viewer), which is
// what draws the darker band under the horizon on a real sea.
vec3 waterReflectDir(vec3 N, vec3 V, float sigma) {
    vec3 R = reflect(-V, N);
    R.y = max(R.y, 0.0) + sigma * 0.9 + 0.01;
    return normalize(R);
}

// Sun glitter: Cook-Torrance with a GGX lobe.
vec3 waterSunSpecular(vec3 N, vec3 V, vec3 L, vec3 sunColor, float alpha2) {
    vec3 H = normalize(V + L);
    float NdotL = waterSaturate(dot(N, L));
    float NdotV = max(dot(N, V), 1e-3);
    float NdotH = waterSaturate(dot(N, H));
    float VdotH = waterSaturate(dot(V, H));
    float d = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
    float D = alpha2 / (WATER_PI * d * d);
    float gv = NdotL * sqrt(NdotV * NdotV * (1.0 - alpha2) + alpha2);
    float gl = NdotV * sqrt(NdotL * NdotL * (1.0 - alpha2) + alpha2);
    float Vis = 0.5 / max(gv + gl, 1e-5);
    float F = WATER_F0 + (1.0 - WATER_F0) * pow(1.0 - VdotH, 5.0);
    return sunColor * min(D * Vis * F * NdotL, 60.0);
}

// Light coming up out of the water body.
//   refraction  scene colour seen through the surface (sea bed, hulls)
//   thickness   metres of water the view ray crosses before hitting that scene
//   crest       0..1, how high this point sits on its wave (thin water = more glow)
vec3 waterBody(vec3 refraction, float thickness, vec3 N, vec3 V, vec3 L,
               vec3 sunColor, vec3 skyAmbient, float crest, WaterMaterial m) {
    vec3 T = exp(-m.extinction * thickness);
    vec3 lightIn = sunColor * (max(L.y, 0.0) / WATER_PI) + skyAmbient;
    vec3 deep = m.scatterColor * lightIn;
    // sunlight entering the back of a wave and leaving towards the eye
    vec3 Lb = normalize(L + N * 0.4);
    float through = pow(waterSaturate(dot(V, -Lb)), 3.0);
    float facing = 0.15 * waterSaturate(L.y * 3.0);
    float sss = (through + facing) * crest * m.sssStrength;
    vec3 scatter = deep + m.sssColor * sunColor * (sss / WATER_PI);
    return refraction * T + scatter * (1.0 - T);
}

// Full surface: body + reflection + sun glitter, then foam on top.
//   reflection  sky / probe radiance along waterReflectDir(...)
//   foam        0..1 coverage after the foam pattern has been applied
vec3 waterShade(vec3 N, vec3 V, vec3 L, vec3 sunColor, vec3 skyAmbient,
                vec3 reflection, vec3 refraction, float thickness,
                float crest, float foam, float lostSlopeVariance, WaterMaterial m) {
    float sigma = sqrt(max(lostSlopeVariance, 0.0));
    float alpha2 = waterAlpha2(m.roughness, lostSlopeVariance);
    float NdotV = max(dot(N, V), 1e-3);
    float F = waterFresnel(NdotV, sigma);
    vec3 body = waterBody(refraction, thickness, N, V, L, sunColor, skyAmbient, crest, m);
    vec3 col = body * (1.0 - F) + reflection * F + waterSunSpecular(N, V, L, sunColor, alpha2) * m.specular;
    float wrapL = waterSaturate(dot(N, L) * 0.6 + 0.4);
    vec3 foamLit = m.foamColor * (sunColor * (wrapL * waterSaturate(L.y * 4.0 + 0.1) / WATER_PI) + skyAmbient);
    return mix(col, foamLit, foam);
}

// ---------------------------------------------------------------------------
//  Procedural foam texture. Two octaves of cellular noise: bubbles and lace.
//  Swap for a real foam texture if you have one.
// ---------------------------------------------------------------------------
vec2 waterHash22(vec2 p) {
    uvec2 q = uvec2(ivec2(floor(p)));
    q = q * uvec2(1597334673u, 3812015801u);
    uint n = (q.x ^ q.y) * 1597334673u;
    uvec2 r = uvec2(n, n * 48271u);
    return vec2(r) * (1.0 / 4294967295.0);
}

// distance to the nearest and second-nearest cell centre
vec2 waterCells(vec2 p) {
    vec2 ip = floor(p), fp = fract(p);
    vec2 d = vec2(8.0);
    for (int y = -1; y <= 1; y++)
        for (int x = -1; x <= 1; x++) {
            vec2 g = vec2(float(x), float(y));
            vec2 r = g + waterHash22(ip + g) - fp;
            float e = dot(r, r);
            if (e < d.x) { d.y = d.x; d.x = e; } else if (e < d.y) d.y = e;
        }
    return sqrt(d);
}

float waterNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = waterHash22(i).x, b = waterHash22(i + vec2(1.0, 0.0)).x;
    float c = waterHash22(i + vec2(0.0, 1.0)).x, d = waterHash22(i + vec2(1.0, 1.0)).x;
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Foam density 0..1 in, visible foam 0..1 out.
//   p          rest position in metres (so the foam rides the waves)
//   windDir    unit vector; foam is drawn out into streaks along the wind
//   footprint  metres of sea per pixel; scales smaller than that fade to their mean
// Foam is a sheet of bubbles with holes in it. Fresh foam is nearly solid; as it
// ages the holes grow until only threads between them are left, then nothing.
float waterFoamMask(vec2 p, vec2 windDir, float density, float footprint) {
    if (density <= 0.02) return 0.0;
    vec2 q = vec2(dot(p, windDir) * 0.6, dot(p, vec2(-windDir.y, windDir.x)));
    float patches = waterNoise(q * 0.27) * 0.6 + waterNoise(q * 0.71 + 9.0) * 0.4;
    float d = clamp(density * (0.6 + 0.8 * patches), 0.0, 1.0);
    float visible = smoothstep(0.02, 0.15, density);
    float farFoam = smoothstep(0.10, 0.65, d);                                 // too far away to see any structure
    float wLace = clamp(0.30 / footprint - 0.5, 0.0, 1.0);
    if (wLace <= 0.0) return farFoam * visible;
    float wFine = clamp(0.09 / footprint - 0.5, 0.0, 1.0);
    vec2 bend = vec2(waterNoise(q * 1.1 + 4.0), waterNoise(q * 1.1 + 19.0)) * 1.8;
    float f1 = waterCells(q * 2.3 + bend).x;                               // 0 at the middle of a hole
    float f2 = wFine > 0.0 ? waterCells(q * 7.9 + bend * 3.0 + 31.0).x : 0.45;
    float hole = (1.0 - d) * 0.95;                                         // hole radius grows as the foam thins
    float sheet = smoothstep(hole - 0.10, hole + 0.14, f1 + 0.45 * (f2 - 0.45) * wFine);
    float bubbles = smoothstep(hole * 0.7 - 0.12, hole * 0.7 + 0.16, f2 + 0.12);
    float nearFoam = sheet * mix(1.0, bubbles, 0.55 * wFine);
    return mix(farFoam, nearFoam, wLace) * visible;
}

// Strong wind draws old foam out into long streaks along the wind (Beaufort 7 and up).
// Returns a foam density to max() into the rest; amount = 0 below ~11 m/s, ~0.6 in a gale.
float waterWindStreaks(vec2 p, vec2 windDir, float amount, float footprint) {
    amount *= 1.0 - smoothstep(1.5, 5.0, footprint);
    if (amount <= 0.0) return 0.0;
    vec2 q = vec2(dot(p, windDir), dot(p, vec2(-windDir.y, windDir.x)));
    q.y += 7.0 * waterNoise(q * vec2(0.018, 0.06));                        // streaks wander a little
    float n = waterNoise(q * vec2(0.03, 0.42)) * 0.6 + waterNoise(q * vec2(0.071, 1.13) + 13.0) * 0.4;
    return amount * smoothstep(0.50, 0.78, n);
}

// Rain: rings spreading from random drops. Returns a slope to subtract from the
// normal (n.xz -= slope * n.y). amount 0..1; fades out once rings are sub-pixel.
vec2 waterRainRipples(vec2 p, float time, float amount, float footprint) {
    amount *= 1.0 - smoothstep(0.03, 0.12, footprint);
    if (amount <= 0.0) return vec2(0.0);
    vec2 slope = vec2(0.0);
    for (int layer = 0; layer < 3; layer++) {
        float fl = float(layer);
        vec2 q = p * (1.15 + 0.45 * fl) + fl * 17.3;               // one drop per cell, cells 0.5 to 0.9 m
        vec2 cell = floor(q);
        vec2 h = waterHash22(cell + fl * 7.0);
        float clock = time * (0.9 + 0.5 * h.x) + h.y * 13.0;      // every cell drips on its own clock
        float t = fract(clock);
        vec2 centre = 0.36 + 0.28 * waterHash22(cell + floor(clock) * 3.0 + 91.0);
        vec2 d = fract(q) - centre;
        float r = length(d);
        float ring = r - t * 0.34;
        float wave = sin(ring * 42.0) * exp(-ring * ring * 130.0) * (1.0 - t) * (1.0 - t);
        slope += d * (wave / max(r, 1e-3));
    }
    return slope * (0.5 * amount);
}

// ============================================================================
//  WATER KIT - surface shading (HLSL: Direct3D 11/12, Unity, Unreal custom nodes)
// ----------------------------------------------------------------------------
//  Generated from glsl/water_shading.glsl - same functions, same names, same math.
//  Pure functions, no textures, no engine state. Your material supplies the
//  inputs it already has (sun, a reflection sample, the scene colour behind the
//  surface) and gets radiance back, in linear HDR.
//
//  Units: sunColor is the sun's irradiance on a surface facing it. A white
//  diffuse surface in full sun then has radiance sunColor / PI.
// ============================================================================
#ifndef WATER_SHADING_HLSL
#define WATER_SHADING_HLSL

#ifndef WATER_LOOP
#define WATER_LOOP [loop]            // these loops exit early on data; do not let the compiler unroll them
#endif

#ifndef WATER_PI
#define WATER_PI 3.14159265359
#endif
#define WATER_F0 0.02                    // reflectance of water at normal incidence (n = 1.333)

struct WaterMaterial {
    float3 extinction;      // per metre, how fast each colour dies under water
    float3 scatterColor;    // colour deep water sends back up (its "albedo")
    float3 sssColor;        // tint of sunlight shining through wave crests
    float sssStrength;
    float roughness;      // GGX alpha of the ripples below the smallest simulated wave
    float3 foamColor;
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
float3 waterReflectDir(float3 N, float3 V, float sigma) {
    float3 R = reflect(-V, N);
    R.y = max(R.y, 0.0) + sigma * 0.9 + 0.01;
    return normalize(R);
}

// Sun glitter: Cook-Torrance with a GGX lobe.
float3 waterSunSpecular(float3 N, float3 V, float3 L, float3 sunColor, float alpha2) {
    float3 H = normalize(V + L);
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
float3 waterBody(float3 refraction, float thickness, float3 N, float3 V, float3 L,
               float3 sunColor, float3 skyAmbient, float crest, WaterMaterial m) {
    float3 T = exp(-m.extinction * thickness);
    float3 lightIn = sunColor * (max(L.y, 0.0) / WATER_PI) + skyAmbient;
    float3 deep = m.scatterColor * lightIn;
    // sunlight entering the back of a wave and leaving towards the eye
    float3 Lb = normalize(L + N * 0.4);
    float through = pow(waterSaturate(dot(V, -Lb)), 3.0);
    float facing = 0.15 * waterSaturate(L.y * 3.0);
    float sss = (through + facing) * crest * m.sssStrength;
    float3 scatter = deep + m.sssColor * sunColor * (sss / WATER_PI);
    return refraction * T + scatter * (1.0 - T);
}

// Full surface: body + reflection + sun glitter, then foam on top.
//   reflection  sky / probe radiance along waterReflectDir(...)
//   foam        0..1 coverage after the foam pattern has been applied
float3 waterShade(float3 N, float3 V, float3 L, float3 sunColor, float3 skyAmbient,
                float3 reflection, float3 refraction, float thickness,
                float crest, float foam, float lostSlopeVariance, WaterMaterial m) {
    float sigma = sqrt(max(lostSlopeVariance, 0.0));
    float alpha2 = waterAlpha2(m.roughness, lostSlopeVariance);
    float NdotV = max(dot(N, V), 1e-3);
    float F = waterFresnel(NdotV, sigma);
    float3 body = waterBody(refraction, thickness, N, V, L, sunColor, skyAmbient, crest, m);
    float3 col = body * (1.0 - F) + reflection * F + waterSunSpecular(N, V, L, sunColor, alpha2) * m.specular;
    float wrapL = waterSaturate(dot(N, L) * 0.6 + 0.4);
    float3 foamLit = m.foamColor * (sunColor * (wrapL * waterSaturate(L.y * 4.0 + 0.1) / WATER_PI) + skyAmbient);
    return lerp(col, foamLit, foam);
}

// ---------------------------------------------------------------------------
//  Procedural foam texture. Two octaves of cellular noise: bubbles and lace.
//  Swap for a real foam texture if you have one.
// ---------------------------------------------------------------------------
float2 waterHash22(float2 p) {
    uint2 q = uint2(int2(floor(p)));
    q = q * uint2(1597334673u, 3812015801u);
    uint n = (q.x ^ q.y) * 1597334673u;
    uint2 r = uint2(n, n * 48271u);
    return float2(r) * (1.0 / 4294967295.0);
}

// distance to the nearest and second-nearest cell centre
float2 waterCells(float2 p) {
    float2 ip = floor(p), fp = frac(p);
    float2 d = float2(8.0, 8.0);
    WATER_LOOP for (int y = -1; y <= 1; y++)
        WATER_LOOP for (int x = -1; x <= 1; x++) {
            float2 g = float2(float(x), float(y));
            float2 r = g + waterHash22(ip + g) - fp;
            float e = dot(r, r);
            if (e < d.x) { d.y = d.x; d.x = e; } else if (e < d.y) d.y = e;
        }
    return sqrt(d);
}

float waterNoise(float2 p) {
    float2 i = floor(p), f = frac(p);
    float2 u = f * f * (3.0 - 2.0 * f);
    float a = waterHash22(i).x, b = waterHash22(i + float2(1.0, 0.0)).x;
    float c = waterHash22(i + float2(0.0, 1.0)).x, d = waterHash22(i + float2(1.0, 1.0)).x;
    return lerp(lerp(a, b, u.x), lerp(c, d, u.x), u.y);
}

// Foam density 0..1 in, visible foam 0..1 out.
//   p          rest position in metres (so the foam rides the waves)
//   windDir    unit vector; foam is drawn out into streaks along the wind
//   footprint  metres of sea per pixel; scales smaller than that fade to their mean
// Foam is a sheet of bubbles with holes in it. Fresh foam is nearly solid; as it
// ages the holes grow until only threads between them are left, then nothing.
float waterFoamMask(float2 p, float2 windDir, float density, float footprint) {
    if (density <= 0.02) return 0.0;
    float2 q = float2(dot(p, windDir) * 0.6, dot(p, float2(-windDir.y, windDir.x)));
    float patches = waterNoise(q * 0.27) * 0.6 + waterNoise(q * 0.71 + 9.0) * 0.4;
    float d = clamp(density * (0.6 + 0.8 * patches), 0.0, 1.0);
    float visible = smoothstep(0.02, 0.15, density);
    float farFoam = smoothstep(0.10, 0.65, d);                                 // too far away to see any structure
    float wLace = clamp(0.30 / footprint - 0.5, 0.0, 1.0);
    if (wLace <= 0.0) return farFoam * visible;
    float wFine = clamp(0.09 / footprint - 0.5, 0.0, 1.0);
    float2 bend = float2(waterNoise(q * 1.1 + 4.0), waterNoise(q * 1.1 + 19.0)) * 1.8;
    float f1 = waterCells(q * 2.3 + bend).x;                               // 0 at the middle of a hole
    float f2 = wFine > 0.0 ? waterCells(q * 7.9 + bend * 3.0 + 31.0).x : 0.45;
    float hole = (1.0 - d) * 0.95;                                         // hole radius grows as the foam thins
    float sheet = smoothstep(hole - 0.10, hole + 0.14, f1 + 0.45 * (f2 - 0.45) * wFine);
    float bubbles = smoothstep(hole * 0.7 - 0.12, hole * 0.7 + 0.16, f2 + 0.12);
    float nearFoam = sheet * lerp(1.0, bubbles, 0.55 * wFine);
    return lerp(farFoam, nearFoam, wLace) * visible;
}

// Strong wind draws old foam out into long streaks along the wind (Beaufort 7 and up).
// Returns a foam density to max() into the rest; amount = 0 below ~11 m/s, ~0.6 in a gale.
float waterWindStreaks(float2 p, float2 windDir, float amount, float footprint) {
    amount *= 1.0 - smoothstep(1.5, 5.0, footprint);
    if (amount <= 0.0) return 0.0;
    float2 q = float2(dot(p, windDir), dot(p, float2(-windDir.y, windDir.x)));
    q.y += 7.0 * waterNoise(q * float2(0.018, 0.06));                        // streaks wander a little
    float n = waterNoise(q * float2(0.03, 0.42)) * 0.6 + waterNoise(q * float2(0.071, 1.13) + 13.0) * 0.4;
    return amount * smoothstep(0.50, 0.78, n);
}

// Rain: rings spreading from random drops. Returns a slope to subtract from the
// normal (n.xz -= slope * n.y). amount 0..1; fades out once rings are sub-pixel.
float2 waterRainRipples(float2 p, float time, float amount, float footprint) {
    amount *= 1.0 - smoothstep(0.03, 0.12, footprint);
    if (amount <= 0.0) return float2(0.0, 0.0);
    float2 slope = float2(0.0, 0.0);
    WATER_LOOP for (int layer = 0; layer < 3; layer++) {
        float fl = float(layer);
        float2 q = p * (1.15 + 0.45 * fl) + fl * 17.3;               // one drop per cell, cells 0.5 to 0.9 m
        float2 cell = floor(q);
        float2 h = waterHash22(cell + fl * 7.0);
        float clock = time * (0.9 + 0.5 * h.x) + h.y * 13.0;      // every cell drips on its own clock
        float t = frac(clock);
        float2 centre = 0.36 + 0.28 * waterHash22(cell + floor(clock) * 3.0 + 91.0);
        float2 d = frac(q) - centre;
        float r = length(d);
        float ring = r - t * 0.34;
        float wave = sin(ring * 42.0) * exp(-ring * ring * 130.0) * (1.0 - t) * (1.0 - t);
        slope += d * (wave / max(r, 1e-3));
    }
    return slope * (0.5 * amount);
}

#endif // WATER_SHADING_HLSL

// ---- lighting for the opaque scene (terrain, floating objects) --------------
uniform vec3 uExtinction;
uniform vec3 uScatterColor;
uniform float uUnderwater;
uniform float uCausticStrength;
uniform float uWaveHs;
uniform float uEnvMaxLod;
uniform float uClipWater;     // 1 in the reflection pass: keep only what is above the surface
uniform vec2 uWetSand;        // how dark wet sand gets 0..1, how far up the beach the surf runs (m)

#ifdef WATER_FFT
#define OCEAN_HEIGHT(p, depth) waterHeightFFT(p, 0.8, depth, 1)
#define OCEAN_CAUSTICS(p, below, strength, pixel) waterCausticsFFT(p, below, strength, pixel)
#else
#define OCEAN_HEIGHT(p, depth) waterHeightApprox(p, 2.5, depth)
#define OCEAN_CAUSTICS(p, below, strength, pixel) waterCaustics(p, below, strength, pixel)
#endif

// albedo, world normal, world position, GGX roughness, how much the material darkens when wet
vec3 shadeOpaque(vec3 albedo, vec3 N, vec3 P, float roughness, float wetDarken, vec3 emissive) {
    float pixel = length(fwidth(P.xz));          // taken before any branching
    vec3 toCam = uCamPos - P;
    float dist = length(toCam);
    vec3 V = toCam / dist;
    vec3 sun = uSunColor * sunVisibilityN(P, N);
    vec3 ambUp = envAmbient(uEnvMaxLod);
    vec3 amb = mix(sampleEnv(N, uEnvMaxLod - 3.0), ambUp, 0.35);
    amb = mix(amb, vec3(dot(amb, vec3(0.2126, 0.7152, 0.0722))), 0.45) * 1.15;      // neutral fill, as if from haze and bounce

    // where is the sea surface at this spot?
    float surf = -1e3;
    if (P.y < uWaveHs * 1.3 + 0.8) {
        vec2 p = P.xz - uWaveOrigin;
        surf = OCEAN_HEIGHT(p, waterDepthAt(P.xz));
    }
    if (uClipWater > 0.5 && P.y < surf + 0.02) discard;
    // the band the surf keeps wet: darker, glossier sand above the waterline
    float runup = uWetSand.x * (1.0 - smoothstep(0.0, uWetSand.y, P.y)) * step(-1.0, P.y);
    albedo *= mix(1.0, wetDarken, runup);
    roughness = mix(roughness, roughness * 0.3, runup);
    if (surf > -1e2) {
        vec2 p = P.xz - uWaveOrigin;
        float below = surf - P.y;
        float wet = smoothstep(-0.4, 0.0, below);
        albedo *= mix(1.0, wetDarken, wet);
        roughness = mix(roughness, roughness * 0.45, wet);
        if (below > 0.0) {
            sun *= exp(-uExtinction * below / max(uSunDir.y, 0.3)) * OCEAN_CAUSTICS(p, below, uCausticStrength, pixel);
            amb *= exp(-uExtinction * below);
        }
    }

    float NdotL = saturate(dot(N, uSunDir));
    float wrapL = saturate(dot(N, uSunDir) * 0.75 + 0.25);
    vec3 col = albedo * (sun * ((0.8 * NdotL + 0.2 * wrapL * wrapL) / PI) + amb);
    vec3 H = normalize(V + uSunDir);
    float a2 = roughness * roughness; a2 *= a2;
    float NdotH = saturate(dot(N, H));
    float d = NdotH * NdotH * (a2 - 1.0) + 1.0;
    col += sun * (0.04 * NdotL * a2 / (PI * d * d) * 0.25);
    col += emissive;

    if (uUnderwater > 0.5) {
        vec3 fogT = exp(-uExtinction * dist);
        vec3 deep = uScatterColor * (uSunColor * (max(uSunDir.y, 0.0) / PI) + ambUp);
        col = col * fogT + deep * (1.0 - fogT);
    }
    return col;
}

// ============================================================================
//  WATER KIT - reference ocean material, fragment stage
// ----------------------------------------------------------------------------
//  Shows how the pieces fit: normals -> ripples -> refraction through the scene
//  colour/depth -> reflection -> foam -> waterShade() -> distance haze.
//  Define WATER_FFT to read the FFT cascades (fft/water_cascades.glsl), leave it
//  out for the analytic wave sum (water_waves.glsl).
//
//  Host must provide:
//    vec3 sampleEnv(vec3 dir, float lod)    sky / reflection probe
//    vec3 envAmbient(float maxLod)          diffuse sky light / PI (your ambient probe)
//    vec3 encodeHDR(vec3) / decodeHDR(vec3) identity on float render targets
//    uCamPos, uSunDir, uSunColor, uTime     the usual frame constants
// ============================================================================
#ifndef WATER_SUN_SHADOW
#define WATER_SUN_SHADOW(p) 1.0        // host: shadow map x cloud shadow at world position p
#endif
in vec2 vRest;
in vec3 vWorld;
in float vDepth;
in float vHeight;

uniform mat4 uView;
uniform mat4 uViewProj;
uniform vec2 uGridCenter;
uniform sampler2D uSceneColor;     // opaque scene, rendered before the water
uniform sampler2D uSceneDepth;
uniform vec2 uInvViewport;
uniform vec2 uNearFar;
uniform float uFoamThreshold;      // whitecap threshold on the Jacobian (from the CPU)
uniform float uFoamGain;
uniform float uWaveHs;             // significant wave height, metres
uniform float uFogDensity;
uniform float uMeshRadius;
uniform float uUnderwater;         // 1 when the camera is below the surface
uniform vec3 uExtinction;
uniform vec3 uScatterColor;
uniform vec3 uSssColor;
uniform float uSssStrength;
uniform float uRoughness;
uniform float uEnvMaxLod;
uniform vec2 uWindDir;             // unit vector, direction the wind sea travels
uniform float uWindStreaks;        // 0 in light wind, about 0.6 in a gale
uniform float uRain;               // 0..1
uniform vec4 uLook;                // artistic gains, 1 = physical: reflection, sun glitter, refraction bend, foam brightness
#ifdef WATER_WEATHER
uniform vec3 uBio;                 // bioluminescence: glow colour x intensity, multiplied with the foam (0 by day)
#endif
#ifdef WATER_PLANAR
uniform sampler2D uReflection;     // scene mirrored in the sea plane; a = 1 where something was drawn
uniform sampler2D uReflDepth;      // its depth buffer
#endif
#ifdef WATER_RIPPLES
uniform sampler2D uRipple;
uniform vec4 uRippleRect;
#endif
#ifdef WATER_FOAM_SIM
uniform sampler2D uFoamTex;        // r = accumulated foam
uniform vec4 uFoamRect;            // centre.x, centre.z, 1 / size, texel size in uv
#endif

out vec4 fragColor;

float linearDepth(float d) {
    float z = d * 2.0 - 1.0;
    return 2.0 * uNearFar.x * uNearFar.y / (uNearFar.y + uNearFar.x - z * (uNearFar.y - uNearFar.x));
}

void main() {
    vec3 toCam = uCamPos - vWorld;
    float dist = length(toCam);
    vec3 V = toCam / dist;
    vec2 restWorld = vRest + uGridCenter;

    // ---- normal: every wave this pixel can resolve --------------------------
    vec2 dpdx = dFdx(vRest), dpdy = dFdy(vRest);
    float footprint = sqrt(abs(dpdx.x * dpdy.y - dpdx.y * dpdy.x));       // metres of sea per pixel
#ifdef WATER_FFT
    WaterDetail wd = waterDetailFFT(vRest, vDepth);
    float foamJ = wd.foamJacobian;
    vec3 coarseN = wd.coarseNormal;
#else
    WaterDetail wd = waterDetail(vRest, dpdx, dpdy, vDepth);
    float foamJ = wd.jacobian;
    vec3 coarseN = normalize(wd.normal);
#endif
    vec3 n = wd.normal;
    float roughGain = 1.0;
#ifdef WATER_WEATHER
    // gust fronts roughen the small ripples, surface slicks flatten them; the large waves are left alone
    WaterRogue rg = waterRogue(restWorld, vDepth);
    float gust = waterGustMask(restWorld);
    vec2 slick = waterSlickMask(restWorld);
    float detailGain = (1.0 + 0.9 * gust) * (1.0 - 0.7 * slick.x);
    vec2 sFull = n.xz / max(n.y, 0.05), sCoarse = coarseN.xz / max(coarseN.y, 0.05);
    vec2 sNew = sCoarse + (sFull - sCoarse) * detailGain - rg.grad;
    n = vec3(sNew.x, 1.0, sNew.y);
    wd.lostVar *= detailGain * detailGain;
    roughGain = (1.0 + 1.5 * gust) * (1.0 - 0.75 * slick.x);
#endif

    float rippleFoam = 0.0;
#ifdef WATER_RIPPLES
    vec2 ruv = (restWorld - uRippleRect.xy) * uRippleRect.z + 0.5;
    vec2 redge = min(ruv, 1.0 - ruv);
    float rin = clamp(min(redge.x, redge.y) * 12.0, 0.0, 1.0);
    if (rin > 0.0) {
        float t = uRippleRect.w;
        float hl = textureLod(uRipple, ruv - vec2(t, 0.0), 0.0).r;
        float hr = textureLod(uRipple, ruv + vec2(t, 0.0), 0.0).r;
        float hd = textureLod(uRipple, ruv - vec2(0.0, t), 0.0).r;
        float hu = textureLod(uRipple, ruv + vec2(0.0, t), 0.0).r;
        vec2 grad = vec2(hr - hl, hu - hd) * (0.5 * uRippleRect.z / t) * rin;
        n.xz -= grad * n.y;
        rippleFoam = clamp(length(grad) * 1.1 - 0.5, 0.0, 1.0) * rin;
    }
#endif
    n.xz -= waterRainRipples(restWorld, uTime, uRain, footprint) * n.y;
#ifdef WATER_SURF
    WaterSurf sf = waterSurf(restWorld, uTime);
    n.xz -= sf.grad * n.y;
#endif
    vec3 N = normalize(n);

    WaterMaterial mat;
    mat.extinction = uExtinction;
    mat.scatterColor = uScatterColor;
    mat.sssColor = uSssColor;
    mat.sssStrength = uSssStrength;
    mat.roughness = uRoughness * roughGain;
    mat.foamColor = vec3(uLook.w);
    mat.specular = uLook.y;

    vec3 skyAmbient = envAmbient(uEnvMaxLod);
    vec3 deepLight = uScatterColor * (uSunColor * (max(uSunDir.y, 0.0) / WATER_PI) + skyAmbient);

    // ---- seen from below: Snell's window ------------------------------------
    if (uUnderwater > 0.5) {
        vec3 Nd = dot(N, V) > 0.0 ? N : -N;
        vec3 T = refract(-V, Nd, 1.333);
        vec3 col;
        if (dot(T, T) < 0.5) {
            // total internal reflection: the surface mirrors the water below it
            vec3 Rd = reflect(-V, Nd);
            col = deepLight * (1.15 + 1.3 * clamp(Rd.y + 0.35, 0.0, 1.0));
        } else {
            float F = waterFresnel(max(dot(-T, Nd), 0.0), 0.0);
            col = sampleEnv(normalize(vec3(T.x, max(T.y, 0.02), T.z)), 0.0) * (1.0 - F);
            col += uSunColor * (40.0 * pow(max(dot(T, uSunDir), 0.0), 20000.0));
        }
        vec3 fogT = exp(-uExtinction * dist);
        fragColor = vec4(encodeHDR(col * fogT + deepLight * (1.0 - fogT)), 1.0);
        return;
    }

    float nv = dot(N, V);
    if (nv < 0.03) N = normalize(N + V * (0.03 - nv));          // never shade a back-facing normal

    // ---- what lies under the surface ----------------------------------------
    vec2 suv = gl_FragCoord.xy * uInvViewport;
    float surfZ = linearDepth(gl_FragCoord.z);
    float sceneZ0 = linearDepth(textureLod(uSceneDepth, suv, 0.0).r);
    float thick0 = max(sceneZ0 - surfZ, 0.0) * dist / surfZ;
    vec2 bend = (mat3(uView) * vec3(N.x, 0.0, N.z)).xy;
    vec2 ruv2 = suv + bend * (0.25 * uLook.z * min(thick0, 4.0) / max(dist, 1.0));
    float sceneZ = linearDepth(textureLod(uSceneDepth, ruv2, 0.0).r);
    if (sceneZ < surfZ) { ruv2 = suv; sceneZ = sceneZ0; }       // do not pull things above water into the refraction
    float thickness = max(sceneZ - surfZ, 0.0) * dist / surfZ;
    vec3 refraction = decodeHDR(textureLod(uSceneColor, ruv2, 0.0).rgb);

    // ---- reflection -----------------------------------------------------------
    float sigma = sqrt(wd.lostVar);
    float alpha = sqrt(waterAlpha2(uRoughness, wd.lostVar));
    vec3 R = waterReflectDir(N, V, sigma);
    vec3 reflection = sampleEnv(R, clamp(alpha * 9.0, 0.0, uEnvMaxLod - 3.0));
#ifdef WATER_PLANAR
    // Nearby objects and the coast, from a render mirrored in the sea plane. A point
    // P + R t on the reflected ray appears where the camera sees its mirror image.
    // t comes from the mirrored depth buffer (how far the flat-sea reflection travels),
    // so near objects keep coherent reflections and far ones break into streaks.
    // the larger waves stretch reflections into streaks; following every ripple would only add speckle
    vec3 Rp = reflect(-V, normalize(mix(coarseN, N, 0.25)));
    float zr = linearDepth(textureLod(uReflDepth, suv, 0.0).r);
    float tr = min(max(zr - surfZ, 0.0) * dist / surfZ, 2.0e4);
    for (int it = 0; it < 2; it++) {
        vec4 rc = uViewProj * vec4(vWorld.x + Rp.x * tr, -vWorld.y - Rp.y * tr, vWorld.z + Rp.z * tr, 1.0);
        if (Rp.y <= 0.0 || rc.w <= 1e-4) break;
        vec2 puv = rc.xy / rc.w * 0.5 + 0.5;
        vec2 inside = step(vec2(0.0), puv) * step(puv, vec2(1.0));
        // the reflected ray leaves the water going away from the camera, so anything the
        // mirrored image shows in front of this point cannot be what it hits
        float zh = linearDepth(textureLod(uReflDepth, puv, 0.0).r);
        if (zh < surfZ * 0.98) break;
        if (it == 1 || zh >= uNearFar.y * 0.99) {
            vec4 planar = textureLod(uReflection, puv, 0.0);
            reflection = mix(reflection, decodeHDR(planar.rgb), planar.a * inside.x * inside.y * (1.0 - smoothstep(0.12, 0.4, alpha)));
            break;
        }
        tr = min((zh - surfZ) * dist / surfZ, 2.0e4);                       // refine with the distance actually found
    }
#endif
    reflection *= uLook.x;

    // ---- foam -----------------------------------------------------------------
    float foam = clamp((uFoamThreshold - foamJ) * uFoamGain, 0.0, 1.0);          // crests breaking right now
    float fin = 0.0;
#ifdef WATER_FOAM_SIM
    vec2 fuv = (restWorld - uFoamRect.xy) * uFoamRect.z + 0.5;
    vec2 fedge = min(fuv, 1.0 - fuv);
    fin = clamp(min(fedge.x, fedge.y) * 10.0, 0.0, 1.0);
    if (fin > 0.0) { vec2 ft = textureLod(uFoamTex, fuv, 0.0).rg; foam = max(foam, max(ft.r, ft.g) * fin); }   // plus the trails they left (g: wakes)
#endif
#ifdef WATER_FFT
    foam = max(foam, wd.foam * (1.0 - fin));                                       // far away: foam kept in the largest cascade
#endif
    if (vDepth < 2.5) {                                                           // swash on the beach
        float sh = 1.0 - vDepth / 2.5;
        float phase = vDepth * 5.0 + uTime * 1.5 + 5.0 * waterNoise(restWorld * 0.12);
        float band = pow(sin(phase) * 0.5 + 0.5, 3.0);
#ifdef WATER_SURF
        foam = max(foam, sh * sh * (0.2 + 0.8 * band) * clamp(max(uWaveHs, uSurf.x) * 1.5, 0.3, 1.0) * uSurf.w);
#else
        foam = max(foam, sh * sh * (0.2 + 0.8 * band) * clamp(uWaveHs * 1.5, 0.3, 1.0));
#endif
    }
#ifdef WATER_WEATHER
    foam = max(foam, max(rg.foam, slick.y * 0.65));
#endif
    foam = max(foam, waterWindStreaks(restWorld, uWindDir, uWindStreaks, footprint));
    foam = clamp(foam + rippleFoam, 0.0, 1.0);
    float foamMask = waterFoamMask(restWorld, uWindDir, foam, footprint);
#ifdef WATER_SURF
    foamMask = max(foamMask, waterSurfFoam(restWorld, sf, footprint));       // breakers bring their own streaky foam
#endif

    // ---- light ----------------------------------------------------------------
    float crest = clamp(vHeight / (0.6 * uWaveHs + 0.05) + 0.2, 0.0, 1.0);
    vec3 sunLit = uSunColor * WATER_SUN_SHADOW(vWorld);
    vec3 col = waterShade(N, V, uSunDir, sunLit, skyAmbient, reflection, refraction,
                          thickness, crest, foamMask, wd.lostVar, mat);
#ifdef WATER_WEATHER
    col += uBio * foamMask * (0.55 + 0.45 * waterWeatherNoise(restWorld * 3.0 + uTime * 2.0));   // plankton lit by the churn
#endif

    // soft edge where the surface meets geometry
    col = mix(decodeHDR(textureLod(uSceneColor, suv, 0.0).rgb), col, clamp(thick0 * 9.0, 0.0, 1.0));

    // distance haze, and a seamless hand-over to the sky at the edge of the mesh
    float fog = 1.0 - exp(-dist * uFogDensity);
    fog = max(fog, smoothstep(0.5, 0.97, dist / uMeshRadius));
    col = mix(col, sampleEnv(normalize(vec3(-V.x, 0.03, -V.z)), 1.5), fog);

    fragColor = vec4(encodeHDR(col), 1.0);
}

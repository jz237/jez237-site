// ============================================================================
//  WATER KIT - wave core (GLSL 3.30+ / GLSL ES 3.00)
// ----------------------------------------------------------------------------
//  A sum of trochoidal (Gerstner) waves whose amplitudes come from a JONSWAP
//  ocean spectrum. The CPU side (WaterPhysics.h / .cs / water_waves.js) builds
//  the wave table and evaluates the very same sum for buoyancy.
//
//  Per wave i the CPU uploads two vec4:
//    uWaveA[i] = (dir.x, dir.z, wavenumber k, amplitude a)
//    uWaveB[i] = (phase now, horizontal amplitude, wavelength, tail slope variance)
//  Waves are sorted longest first. "phase now" already contains time and the
//  floating origin, so shader positions are RELATIVE TO THE WAVE ORIGIN.
//
//  Include this file in any shader that needs the surface: the water material,
//  a foam simulation, caustics on the sea bed, a wet-line on a hull.
// ============================================================================

#ifndef WATER_GEO_WAVES
#define WATER_GEO_WAVES 40          // waves that move vertices (same count on the CPU)
#endif
#ifndef WATER_DETAIL_WAVES
#define WATER_DETAIL_WAVES 24       // shorter waves, used for normals only
#endif
#define WATER_TOTAL_WAVES (WATER_GEO_WAVES + WATER_DETAIL_WAVES)
#ifndef WATER_SHORE_K
#define WATER_SHORE_K 1.5           // how early waves fade in shallow water (same on the CPU)
#endif
#ifndef WATER_DETAIL_DRAG
#define WATER_DETAIL_DRAG 1.8        // how strongly each ripple is pushed around by the longer ones
#endif
#ifndef WATER_CAUSTIC_COUNT
#define WATER_CAUSTIC_COUNT 16        // detail waves that shape the caustics (longest first)
#endif

// Wave table access. Define WATER_WAVE_A / WATER_WAVE_B before including this file
// to read the table from somewhere else (a 64x2 float texture, a uniform block...).
#ifndef WATER_WAVE_A
uniform vec4 uWaveA[WATER_TOTAL_WAVES];
uniform vec4 uWaveB[WATER_TOTAL_WAVES];
#define WATER_WAVE_A(i) uWaveA[i]
#define WATER_WAVE_B(i) uWaveB[i]
#endif

// Level of detail: a wave fades out as it approaches the sampling limit
// (minWavelength = twice the vertex spacing or twice the pixel footprint).
float waterLod(float wavelength, float minWavelength) {
    return clamp(wavelength / minWavelength - 1.0, 0.0, 1.0);
}

// Shallow water: a wave of wavenumber k stops fitting once depth*k gets small.
float waterShore(float k, float depth) {
    return clamp(k * depth * WATER_SHORE_K, 0.0, 1.0);
}

// ---------------------------------------------------------------------------
//  Displacement of the surface point that rests at p (xz, relative to origin).
//  Use in the vertex shader:  worldPos = restPos + waterDisplace(...)
// ---------------------------------------------------------------------------
vec3 waterDisplace(vec2 p, float minWavelength, float depth) {
    vec3 d = vec3(0.0);
    for (int i = 0; i < WATER_GEO_WAVES; i++) {
        vec4 A = WATER_WAVE_A(i);
        vec4 B = WATER_WAVE_B(i);
        float w = waterLod(B.z, minWavelength);
        if (w <= 0.0) break;                       // sorted: everything after is shorter
        w *= waterShore(A.z, depth);
        float th = A.z * dot(A.xy, p) + B.x;
        d.xz -= A.xy * (B.y * w * sin(th));
        d.y += A.w * w * cos(th);
    }
    return d;
}

// ---------------------------------------------------------------------------
//  Per-pixel surface detail from the analytic derivatives of the same sum.
//    p            rest position (relative to the wave origin)
//    dpdx, dpdy   its screen-space derivatives: dFdx(p), dFdy(p)
//  Every wave is filtered against the pixel's extent ALONG THAT WAVE'S OWN
//  DIRECTION. Near the horizon a pixel is long and thin, so waves running
//  across the view stay sharp while waves running along it fade out: exact
//  anisotropic filtering, which a normal map cannot do.
//    normal      world-space normal, NOT normalised (y component = jacobian)
//    jacobian    < 1 where the surface is being squeezed -> whitecaps
//    lostVar     slope variance of everything that was filtered out; feed it to
//                the roughness so distant water glitters instead of aliasing
// ---------------------------------------------------------------------------
struct WaterDetail {
    vec3 normal;
    float jacobian;
    float lostVar;
};

WaterDetail waterDetail(vec2 p, vec2 dpdx, vec2 dpdy, float depth) {
    float sx = 0.0, sz = 0.0, hxx = 0.0, hzz = 0.0, hxz = 0.0, lost = 0.0;
    // narrowest extent of the pixel footprint: no wave shorter than twice this survives
    float major = max(length(dpdx), length(dpdy));
    float minor = abs(dpdx.x * dpdy.y - dpdx.y * dpdy.x) / max(major, 1e-6);
    float cutoff = 3.0 * minor;
    vec2 drag = vec2(0.0);
    for (int i = 0; i < WATER_TOTAL_WAVES; i++) {
        vec4 A = WATER_WAVE_A(i);
        vec4 B = WATER_WAVE_B(i);
        if (B.z <= cutoff) { lost += B.w; break; }
        float span = abs(dot(A.xy, dpdx)) + abs(dot(A.xy, dpdy));
        float l = waterLod(B.z, 3.0 * span + 1e-6);      // gone at 3 pixels per wave, full at 6
        float ka = A.z * A.w;
        lost += (1.0 - l * l) * 0.5 * ka * ka;
        if (l <= 0.0) continue;
        float w = l * waterShore(A.z, depth);
        float th = A.z * dot(A.xy, p + drag) + B.x;           // drag stays zero for the geometry waves
        float s = sin(th), c = cos(th);
        vec2 kd = A.xy * A.z;
        float as = A.w * w * s;
        sx += kd.x * as;
        sz += kd.y * as;
        if (i < WATER_GEO_WAVES) {
            // geometry waves also move the surface sideways
            float hc = B.y * w * c;
            hxx += A.x * kd.x * hc;
            hzz += A.y * kd.y * hc;
            hxz += A.x * kd.y * hc;
        } else {
            // Detail band (it never reaches the CPU, so it is free to be non-linear):
            // each ripple shifts where the shorter ones are sampled, which breaks up
            // the regular lattice a handful of plane waves would otherwise draw.
            drag += A.xy * (as * WATER_DETAIL_DRAG);
        }
    }
    WaterDetail o;
    o.jacobian = (1.0 - hxx) * (1.0 - hzz) - hxz * hxz;
    o.normal = vec3(sx * (1.0 - hzz) + sz * hxz, max(o.jacobian, 0.05), sz * (1.0 - hxx) + sx * hxz);
    o.lostVar = lost;
    return o;
}

// Jacobian only (geometry waves). Cheap enough for a foam simulation texture.
float waterJacobian(vec2 p, float minWavelength, float depth) {
    float hxx = 0.0, hzz = 0.0, hxz = 0.0;
    for (int i = 0; i < WATER_GEO_WAVES; i++) {
        vec4 A = WATER_WAVE_A(i);
        vec4 B = WATER_WAVE_B(i);
        float w = waterLod(B.z, minWavelength);
        if (w <= 0.0) break;
        w *= waterShore(A.z, depth);
        float hc = B.y * w * A.z * cos(A.z * dot(A.xy, p) + B.x);
        hxx += A.x * A.x * hc;
        hzz += A.y * A.y * hc;
        hxz += A.x * A.y * hc;
    }
    return (1.0 - hxx) * (1.0 - hzz) - hxz * hxz;
}

// Surface height above the rest level at p, ignoring the sideways motion.
// Good enough for "is this pixel under water" tests on hulls and terrain.
float waterHeightApprox(vec2 p, float minWavelength, float depth) {
    float h = 0.0;
    for (int i = 0; i < WATER_GEO_WAVES; i++) {
        vec4 A = WATER_WAVE_A(i);
        vec4 B = WATER_WAVE_B(i);
        float w = waterLod(B.z, minWavelength);
        if (w <= 0.0) break;
        h += A.w * w * waterShore(A.z, depth) * cos(A.z * dot(A.xy, p) + B.x);
    }
    return h;
}

// ---------------------------------------------------------------------------
//  Caustics. Sunlight refracted by the surface lands at x - lever * grad(h);
//  where that mapping compresses, light piles up. Brightness = 1 / |det J|.
//  Uses the real wave curvature, so the pattern moves with the actual sea.
//  Returns a multiplier around 1 for direct sunlight at 'depth' metres down.
//  footprint = metres per pixel at the lit surface (length(fwidth(p)) is fine).
// ---------------------------------------------------------------------------
float waterCaustics(vec2 p, float depth, float strength, float footprint) {
    float cxx = 0.0, czz = 0.0, cxz = 0.0;
    vec2 drag = vec2(0.0);
    for (int i = WATER_GEO_WAVES; i < WATER_GEO_WAVES + WATER_CAUSTIC_COUNT; i++) {
        vec4 A = WATER_WAVE_A(i);
        vec4 B = WATER_WAVE_B(i);
        float l = waterLod(B.z, 4.0 * footprint + 1e-6);
        if (l <= 0.0) break;
        float th = A.z * dot(A.xy, p + drag) + B.x;
        float a = A.w * l * waterShore(A.z, depth);
        drag += A.xy * (a * sin(th) * WATER_DETAIL_DRAG);
        float curv = a * A.z * A.z * cos(th);
        cxx += A.x * A.x * curv;
        czz += A.y * A.y * curv;
        cxz += A.x * A.y * curv;
    }
    float lever = min(depth, 6.0) * 0.25 * strength;     // 0.25 = 1 - 1/1.333
    float det = (1.0 + lever * cxx) * (1.0 + lever * czz) - lever * lever * cxz * cxz;
    float focus = 1.0 / max(abs(det), 0.16);
    float fade = clamp(depth * 1.5, 0.0, 1.0);           // no caustics right at the waterline
    return mix(1.0, min(focus, 5.0), fade);
}

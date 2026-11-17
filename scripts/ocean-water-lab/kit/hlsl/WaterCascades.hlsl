// ============================================================================
//  WATER KIT - FFT ocean, sampling for materials and physics (HLSL)
// ----------------------------------------------------------------------------
//  Generated from glsl/fft/water_cascades.glsl - same functions, same names.
//  Bind the three Texture2DArrays the FFT passes produce (one layer per
//  cascade) and set _WaterCascade / _WaterOffset from the host
//  (WaterFFT.Ocean.bind() shows the values). Y up, metres, positions relative
//  to the wave origin.
// ============================================================================
#ifndef WATER_CASCADES_HLSL
#define WATER_CASCADES_HLSL

#ifndef WATER_LOOP
#define WATER_LOOP [loop]            // these loops exit early on data; do not let the compiler unroll them
#endif

#ifndef WATER_CASCADES
#define WATER_CASCADES 4
#endif
#ifndef WATER_SHORE_K
#define WATER_SHORE_K 1.5              // how early waves fade in shallow water
#endif
#ifndef WATER_FOAM_CASCADES
#define WATER_FOAM_CASCADES 2          // cascades whose compression makes whitecaps
#endif

// Texture access. Define these before including the file to read the
// cascades from somewhere else.
#ifndef WATER_DISP
Texture2DArray _WaterDisp;      // (Dx, Dy, Dz, foam) per cascade, mip-mapped
Texture2DArray _WaterDeriv;     // (dh/dx, dh/dz, dDx/dx, dDz/dz)
Texture2DArray _WaterMom;       // (dDx/dz, (dh/dx)^2, (dh/dz)^2, dh/dx * dh/dz)
SamplerState sampler_WaterDisp; // trilinear, anisotropic, repeat
#define WATER_DISP(uv, c, lod) _WaterDisp.SampleLevel(sampler_WaterDisp, float3(uv, float(c)), lod)
#define WATER_DISP_AUTO(uv, c) _WaterDisp.Sample(sampler_WaterDisp, float3(uv, float(c)))
#define WATER_DERIV(uv, c) _WaterDeriv.Sample(sampler_WaterDisp, float3(uv, float(c)))
#define WATER_DERIV_LOD(uv, c, lod) _WaterDeriv.SampleLevel(sampler_WaterDisp, float3(uv, float(c)), lod)
#define WATER_MOM(uv, c) _WaterMom.Sample(sampler_WaterDisp, float3(uv, float(c)))
#define WATER_MOM_LOD(uv, c, lod) _WaterMom.SampleLevel(sampler_WaterDisp, float3(uv, float(c)), lod)
#endif

float4 _WaterCascade[WATER_CASCADES];   // (1 / tile size, texel size in m, k for the shallow-water fade, 0)
float4 _WaterOffset[WATER_CASCADES];    // (wave origin / tile size, wrapped to 0..1; 0, 0)

float2 waterCascadeUv(float2 p, int c) { return p * _WaterCascade[c].x + _WaterOffset[c].xy; }
float waterCascadeShore(int c, float depth) { return clamp(_WaterCascade[c].z * depth * WATER_SHORE_K, 0.0, 1.0); }
// mip level whose texels are about 'size' metres across
float waterCascadeLod(int c, float size) { return max(log2(max(size, 1e-6) / _WaterCascade[c].y), 0.0); }

// ---------------------------------------------------------------------------
//  Vertex stage: offset of the surface point resting at p.
//  minWavelength: twice the mesh spacing here; finer waves are filtered out.
// ---------------------------------------------------------------------------
float3 waterDisplaceFFT(float2 p, float minWavelength, float depth) {
    float3 d = float3(0.0, 0.0, 0.0);
    WATER_LOOP for (int c = 0; c < WATER_CASCADES; c++) {
        float lod = waterCascadeLod(c, 0.5 * minWavelength);
        d += WATER_DISP(waterCascadeUv(p, c), c, lod).xyz * waterCascadeShore(c, depth);
    }
    return d;
}

// ---------------------------------------------------------------------------
//  Fragment stage: normal, compression and roughness at rest position p.
//    normal        not normalised; y is the Jacobian, clamped
//    jacobian      of the whole surface (< 1 where squeezed)
//    foamJacobian  of the breaking-scale cascades only: compare with the whitecap threshold
//    lostVar       slope variance the texture filter removed: add to roughness^2
//    foam          persistent whitecap coverage stored in the largest cascade
//    coarseNormal  normal of the larger waves only (normalised): for effects that
//                  should not follow every ripple, such as planar reflection lookups
// ---------------------------------------------------------------------------
struct WaterDetail {
    float3 normal;
    float jacobian;
    float foamJacobian;
    float lostVar;
    float foam;
    float3 coarseNormal;
};

WaterDetail waterDetailFFT(float2 p, float depth) {
    float sx = 0.0, sz = 0.0, dxx = 0.0, dzz = 0.0, dxz = 0.0, lost = 0.0;
    float fxx = 0.0, fzz = 0.0, fxz = 0.0, foam = 0.0, csx = 0.0, csz = 0.0;
    WATER_LOOP for (int c = 0; c < WATER_CASCADES; c++) {
        float2 uv = waterCascadeUv(p, c);
        float f = waterCascadeShore(c, depth);
        float4 d = WATER_DERIV(uv, c);
        float4 m = WATER_MOM(uv, c);
        lost += f * f * (max(m.y - d.x * d.x, 0.0) + max(m.z - d.y * d.y, 0.0));
        d *= f;
        sx += d.x; sz += d.y; dxx += d.z; dzz += d.w; dxz += m.x * f;
        if (c < WATER_FOAM_CASCADES) { fxx += d.z; fzz += d.w; fxz += m.x * f; csx += d.x; csz += d.y; }
        if (c == 0) foam = WATER_DISP_AUTO(uv, 0).w * f;
    }
    WaterDetail o;
    o.jacobian = (1.0 + dxx) * (1.0 + dzz) - dxz * dxz;
    o.foamJacobian = (1.0 + fxx) * (1.0 + fzz) - fxz * fxz;
    o.normal = float3(-sx * (1.0 + dzz) + sz * dxz, max(o.jacobian, 0.05), -sz * (1.0 + dxx) + sx * dxz);
    o.lostVar = lost;
    o.foam = foam;
    o.coarseNormal = normalize(float3(-csx, 1.0, -csz));
    return o;
}

// Compression of the breaking-scale cascades at p, filtered to 'texel' metres.
// For a foam simulation texture.
float waterFoamJacobianFFT(float2 p, float texel, float depth) {
    float fxx = 0.0, fzz = 0.0, fxz = 0.0;
    WATER_LOOP for (int c = 0; c < WATER_FOAM_CASCADES; c++) {
        float2 uv = waterCascadeUv(p, c);
        float lod = waterCascadeLod(c, texel);
        float f = waterCascadeShore(c, depth);
        float4 d = WATER_DERIV_LOD(uv, c, lod) * f;
        fxx += d.z; fzz += d.w;
        fxz += WATER_MOM_LOD(uv, c, lod).x * f;
    }
    return (1.0 + fxx) * (1.0 + fzz) - fxz * fxz;
}

// Offset of the surface point resting at p, filtered to 'size' metres.
float3 waterOffsetFFT(float2 p, float size, float depth) {
    float3 d = float3(0.0, 0.0, 0.0);
    WATER_LOOP for (int c = 0; c < WATER_CASCADES; c++)
        d += WATER_DISP(waterCascadeUv(p, c), c, waterCascadeLod(c, size)).xyz * waterCascadeShore(c, depth);
    return d;
}

// Surface height above the rest level at world position p (relative to the origin).
// iterations: 0 ignores the sideways motion, 2 is within a few cm.
float waterHeightFFT(float2 p, float size, float depth, int iterations) {
    float2 r = p;
    WATER_LOOP for (int i = 0; i < iterations; i++) r = p - waterOffsetFFT(r, size, depth).xz;
    return waterOffsetFFT(r, size, depth).y;
}

// ---------------------------------------------------------------------------
//  Caustics on a surface 'depth' metres under the water. Sunlight refracted
//  through the ripples lands at x + lever * grad(h); where that mapping
//  squeezes, light piles up. Curvature comes from finite differences of the
//  slope textures. Returns a multiplier around 1 for direct sunlight.
//  footprint = metres per pixel of the lit surface.
// ---------------------------------------------------------------------------
float waterCausticsFFT(float2 p, float depth, float strength, float footprint) {
    float hxx = 0.0, hzz = 0.0, hxz = 0.0;
    WATER_LOOP for (int c = 1; c < WATER_CASCADES; c++) {
        float e = max(_WaterCascade[c].y, footprint);
        float lod = waterCascadeLod(c, footprint);
        float2 uv = waterCascadeUv(p, c);
        float du = e * _WaterCascade[c].x;
        float4 xp = WATER_DERIV_LOD(uv + float2(du, 0.0), c, lod), xm = WATER_DERIV_LOD(uv - float2(du, 0.0), c, lod);
        float4 zp = WATER_DERIV_LOD(uv + float2(0.0, du), c, lod), zm = WATER_DERIV_LOD(uv - float2(0.0, du), c, lod);
        float f = waterCascadeShore(c, depth) / (2.0 * e);
        hxx += (xp.x - xm.x) * f;
        hzz += (zp.y - zm.y) * f;
        hxz += (zp.x - zm.x) * f;
    }
    float lever = min(depth, 6.0) * 0.25 * strength;               // 0.25 = 1 - 1/1.333
    float det = (1.0 + lever * hxx) * (1.0 + lever * hzz) - lever * lever * hxz * hxz;
    float focus = 1.0 / max(abs(det), 0.15);
    return lerp(1.0, min(focus, 5.0), clamp(depth * 1.5, 0.0, 1.0));
}

#endif // WATER_CASCADES_HLSL

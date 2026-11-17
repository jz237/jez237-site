// ============================================================================
//  WATER KIT - FFT ocean, sampling for materials and physics (GLSL)
// ----------------------------------------------------------------------------
//  Reads the textures the FFT passes produce. Positions are in metres relative
//  to the wave origin (the same origin the mesh uses).
//
//  Textures (2D arrays, one layer per cascade, mip-mapped, repeat wrap):
//    disp  = (Dx, Dy, Dz, foam)
//    deriv = (dh/dx, dh/dz, dDx/dx, dDz/dz)
//    mom   = (dDx/dz, (dh/dx)^2, (dh/dz)^2, dh/dx * dh/dz)
//  Mip-mapping does the filtering: a mesh vertex reads the level whose texels
//  match its spacing, a pixel reads with hardware anisotropic filtering, and
//  the slope variance the filter removed comes back as roughness.
//
//  GLSL ES needs "precision highp sampler2DArray;" before this file.
// ============================================================================

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
uniform sampler2DArray uWaterDisp;
uniform sampler2DArray uWaterDeriv;
uniform sampler2DArray uWaterMom;
#define WATER_DISP(uv, c, lod) textureLod(uWaterDisp, vec3(uv, float(c)), lod)
#define WATER_DISP_AUTO(uv, c) texture(uWaterDisp, vec3(uv, float(c)))
#define WATER_DERIV(uv, c) texture(uWaterDeriv, vec3(uv, float(c)))
#define WATER_DERIV_LOD(uv, c, lod) textureLod(uWaterDeriv, vec3(uv, float(c)), lod)
#define WATER_MOM(uv, c) texture(uWaterMom, vec3(uv, float(c)))
#define WATER_MOM_LOD(uv, c, lod) textureLod(uWaterMom, vec3(uv, float(c)), lod)
#endif

uniform vec4 uWaterCascade[WATER_CASCADES];   // (1 / tile size, texel size in m, k for the shallow-water fade, 0)
uniform vec4 uWaterOffset[WATER_CASCADES];    // (wave origin / tile size, wrapped to 0..1; 0, 0)

vec2 waterCascadeUv(vec2 p, int c) { return p * uWaterCascade[c].x + uWaterOffset[c].xy; }
float waterCascadeShore(int c, float depth) { return clamp(uWaterCascade[c].z * depth * WATER_SHORE_K, 0.0, 1.0); }
// mip level whose texels are about 'size' metres across
float waterCascadeLod(int c, float size) { return max(log2(max(size, 1e-6) / uWaterCascade[c].y), 0.0); }

// ---------------------------------------------------------------------------
//  Vertex stage: offset of the surface point resting at p.
//  minWavelength: twice the mesh spacing here; finer waves are filtered out.
// ---------------------------------------------------------------------------
vec3 waterDisplaceFFT(vec2 p, float minWavelength, float depth) {
    vec3 d = vec3(0.0);
    for (int c = 0; c < WATER_CASCADES; c++) {
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
    vec3 normal;
    float jacobian;
    float foamJacobian;
    float lostVar;
    float foam;
    vec3 coarseNormal;
};

WaterDetail waterDetailFFT(vec2 p, float depth) {
    float sx = 0.0, sz = 0.0, dxx = 0.0, dzz = 0.0, dxz = 0.0, lost = 0.0;
    float fxx = 0.0, fzz = 0.0, fxz = 0.0, foam = 0.0, csx = 0.0, csz = 0.0;
    for (int c = 0; c < WATER_CASCADES; c++) {
        vec2 uv = waterCascadeUv(p, c);
        float f = waterCascadeShore(c, depth);
        vec4 d = WATER_DERIV(uv, c);
        vec4 m = WATER_MOM(uv, c);
        lost += f * f * (max(m.y - d.x * d.x, 0.0) + max(m.z - d.y * d.y, 0.0));
        d *= f;
        sx += d.x; sz += d.y; dxx += d.z; dzz += d.w; dxz += m.x * f;
        if (c < WATER_FOAM_CASCADES) { fxx += d.z; fzz += d.w; fxz += m.x * f; csx += d.x; csz += d.y; }
        if (c == 0) foam = WATER_DISP_AUTO(uv, 0).w * f;
    }
    WaterDetail o;
    o.jacobian = (1.0 + dxx) * (1.0 + dzz) - dxz * dxz;
    o.foamJacobian = (1.0 + fxx) * (1.0 + fzz) - fxz * fxz;
    o.normal = vec3(-sx * (1.0 + dzz) + sz * dxz, max(o.jacobian, 0.05), -sz * (1.0 + dxx) + sx * dxz);
    o.lostVar = lost;
    o.foam = foam;
    o.coarseNormal = normalize(vec3(-csx, 1.0, -csz));
    return o;
}

// Compression of the breaking-scale cascades at p, filtered to 'texel' metres.
// For a foam simulation texture.
float waterFoamJacobianFFT(vec2 p, float texel, float depth) {
    float fxx = 0.0, fzz = 0.0, fxz = 0.0;
    for (int c = 0; c < WATER_FOAM_CASCADES; c++) {
        vec2 uv = waterCascadeUv(p, c);
        float lod = waterCascadeLod(c, texel);
        float f = waterCascadeShore(c, depth);
        vec4 d = WATER_DERIV_LOD(uv, c, lod) * f;
        fxx += d.z; fzz += d.w;
        fxz += WATER_MOM_LOD(uv, c, lod).x * f;
    }
    return (1.0 + fxx) * (1.0 + fzz) - fxz * fxz;
}

// Offset of the surface point resting at p, filtered to 'size' metres.
vec3 waterOffsetFFT(vec2 p, float size, float depth) {
    vec3 d = vec3(0.0);
    for (int c = 0; c < WATER_CASCADES; c++)
        d += WATER_DISP(waterCascadeUv(p, c), c, waterCascadeLod(c, size)).xyz * waterCascadeShore(c, depth);
    return d;
}

// Surface height above the rest level at world position p (relative to the origin).
// iterations: 0 ignores the sideways motion, 2 is within a few cm.
float waterHeightFFT(vec2 p, float size, float depth, int iterations) {
    vec2 r = p;
    for (int i = 0; i < iterations; i++) r = p - waterOffsetFFT(r, size, depth).xz;
    return waterOffsetFFT(r, size, depth).y;
}

// ---------------------------------------------------------------------------
//  Caustics on a surface 'depth' metres under the water. Sunlight refracted
//  through the ripples lands at x + lever * grad(h); where that mapping
//  squeezes, light piles up. Curvature comes from finite differences of the
//  slope textures. Returns a multiplier around 1 for direct sunlight.
//  footprint = metres per pixel of the lit surface.
// ---------------------------------------------------------------------------
float waterCausticsFFT(vec2 p, float depth, float strength, float footprint) {
    float hxx = 0.0, hzz = 0.0, hxz = 0.0;
    for (int c = 1; c < WATER_CASCADES; c++) {
        float e = max(uWaterCascade[c].y, footprint);
        float lod = waterCascadeLod(c, footprint);
        vec2 uv = waterCascadeUv(p, c);
        float du = e * uWaterCascade[c].x;
        vec4 xp = WATER_DERIV_LOD(uv + vec2(du, 0.0), c, lod), xm = WATER_DERIV_LOD(uv - vec2(du, 0.0), c, lod);
        vec4 zp = WATER_DERIV_LOD(uv + vec2(0.0, du), c, lod), zm = WATER_DERIV_LOD(uv - vec2(0.0, du), c, lod);
        float f = waterCascadeShore(c, depth) / (2.0 * e);
        hxx += (xp.x - xm.x) * f;
        hzz += (zp.y - zm.y) * f;
        hxz += (zp.x - zm.x) * f;
    }
    float lever = min(depth, 6.0) * 0.25 * strength;               // 0.25 = 1 - 1/1.333
    float det = (1.0 + lever * hxx) * (1.0 + lever * hzz) - lever * lever * hxz * hxz;
    float focus = 1.0 / max(abs(det), 0.15);
    return mix(1.0, min(focus, 5.0), clamp(depth * 1.5, 0.0, 1.0));
}

// ============================================================================
//  WATER KIT - reference ocean material, vertex stage
// ----------------------------------------------------------------------------
//  Mesh: any horizontal grid centred under the camera. aGrid is the rest
//  position in metres relative to the grid centre, aSpacing the distance to the
//  neighbouring vertices there (so waves the mesh cannot resolve fade out
//  instead of aliasing).
//
//  Host must provide:  float waterDepthAt(vec2 worldXZ)   (return 1e4 for open sea)
//  Define WATER_FFT to displace with the FFT cascades instead of the wave sum.
//  Define WATER_SURF (and include water_surf.glsl) for breaking waves on beaches.
//  Define WATER_WEATHER (and include water_weather.glsl) for rogue waves.
// ============================================================================
layout(location = 0) in vec2 aGrid;
layout(location = 1) in float aSpacing;

uniform mat4 uViewProj;
uniform vec2 uGridCenter;      // world xz of the grid centre; also the wave origin
uniform float uGridScale;      // grows with camera height
#ifdef WATER_RIPPLES
uniform sampler2D uRipple;     // r = ripple height
uniform vec4 uRippleRect;      // centre.x, centre.z, 1 / size, texel size in uv
#endif

out vec2 vRest;                // rest position relative to the wave origin
out vec3 vWorld;
out float vDepth;              // water depth at the rest position
out float vHeight;             // wave height above the rest level

void main() {
    vec2 rest = aGrid * uGridScale;
    vec2 restWorld = rest + uGridCenter;
    float depth = waterDepthAt(restWorld);
#ifdef WATER_FFT
    vec3 d = waterDisplaceFFT(rest, 2.0 * aSpacing * uGridScale, depth);
#else
    vec3 d = waterDisplace(rest, 2.0 * aSpacing * uGridScale, depth);
#endif
#ifdef WATER_SURF
    WaterSurf sf = waterSurf(restWorld, uTime);
    d.y += sf.height; d.xz += sf.push;
#endif
#ifdef WATER_WEATHER
    d += waterRogue(restWorld, depth).disp;
#endif
    vHeight = d.y;
#ifdef WATER_RIPPLES
    vec2 ruv = (restWorld - uRippleRect.xy) * uRippleRect.z + 0.5;
    vec2 edge = min(ruv, 1.0 - ruv);
    float inside = clamp(min(edge.x, edge.y) * 12.0, 0.0, 1.0);
    if (inside > 0.0) d.y += textureLod(uRipple, ruv, 0.0).r * inside;
#endif
    vec3 world = vec3(restWorld.x, 0.0, restWorld.y) + d;
    vRest = rest;
    vWorld = world;
    vDepth = depth;
    gl_Position = uViewProj * vec4(world, 1.0);
}

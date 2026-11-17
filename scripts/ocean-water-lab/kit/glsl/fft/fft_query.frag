// ============================================================================
//  WATER KIT - physics query: water state on a small grid around each body
// ----------------------------------------------------------------------------
//  Output texel (b * G + gx, gy) is grid point (gx, gy) of query b. Read it
//  back (asynchronously) and interpolate it in your physics step; see
//  WaterPhysics.h PatchSampler. Uses three frames of displacement to get the
//  water's velocity and acceleration at each point.
//  Host defines WATER_QUERY_DEPTH(p): water depth at p (relative to the origin).
// ============================================================================
#ifndef WATER_QUERY_MAX
#define WATER_QUERY_MAX 32
#endif
#ifndef WATER_QUERY_DEPTH
#define WATER_QUERY_DEPTH(p) 1.0e4
#endif
uniform highp sampler2DArray uWaterDispPrev;
uniform highp sampler2DArray uWaterDispPrev2;
uniform vec4 uQuery[WATER_QUERY_MAX];   // centre x, centre z (relative to the origin), half size, filter size (m)
uniform int uQueryGrid;                 // G
uniform vec2 uQueryDt;                  // seconds from the previous frame, and from the one before that
layout(location = 0) out vec4 out0;     // height, water velocity xyz
layout(location = 1) out vec4 out1;     // water acceleration xyz, depth

vec3 queryCur(vec2 p, float size, float depth) {
    vec3 d = vec3(0.0);
    for (int c = 0; c < WATER_CASCADES; c++)
        d += textureLod(uWaterDisp, vec3(waterCascadeUv(p, c), float(c)), waterCascadeLod(c, size)).xyz * waterCascadeShore(c, depth);
    return d;
}
vec3 queryPrev(vec2 p, float size, float depth) {
    vec3 d = vec3(0.0);
    for (int c = 0; c < WATER_CASCADES; c++)
        d += textureLod(uWaterDispPrev, vec3(waterCascadeUv(p, c), float(c)), waterCascadeLod(c, size)).xyz * waterCascadeShore(c, depth);
    return d;
}
vec3 queryPrev2(vec2 p, float size, float depth) {
    vec3 d = vec3(0.0);
    for (int c = 0; c < WATER_CASCADES; c++)
        d += textureLod(uWaterDispPrev2, vec3(waterCascadeUv(p, c), float(c)), waterCascadeLod(c, size)).xyz * waterCascadeShore(c, depth);
    return d;
}

void main() {
    ivec2 px = ivec2(gl_FragCoord.xy);
    int G = uQueryGrid;
    int b = px.x / G;
    vec2 g = vec2(float(px.x - b * G), float(px.y)) / float(G - 1) * 2.0 - 1.0;
    vec4 q = uQuery[b];
    vec2 p = q.xy + g * q.z;
    float depth = WATER_QUERY_DEPTH(p);
    vec2 r = p;                                                    // rest point that lands on p
    for (int i = 0; i < 4; i++) r = p - queryCur(r, q.w, depth).xz;
    vec3 d0 = queryCur(r, q.w, depth), d1 = queryPrev(r, q.w, depth), d2 = queryPrev2(r, q.w, depth);
    vec3 v1 = (d0 - d1) / uQueryDt.x;
    vec3 v2 = (d1 - d2) / uQueryDt.y;
    vec3 acc = (v1 - v2) * (2.0 / (uQueryDt.x + uQueryDt.y));
    out0 = vec4(d0.y, v1 + acc * (0.5 * uQueryDt.x));
    out1 = vec4(acc, depth);
}

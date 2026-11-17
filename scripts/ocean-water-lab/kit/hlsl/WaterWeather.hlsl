// ============================================================================
//  WATER KIT - sea-surface weather (HLSL): rogue waves, gust fronts, slicks
// ----------------------------------------------------------------------------
//  Generated from glsl/water_weather.glsl - same functions, same names, same math.
//  Set _WaterRogueA/B, _WaterGust and _WaterSlick from the host (see the GLSL
//  header for what each component means).
// ============================================================================
#ifndef WATER_WEATHER_HLSL
#define WATER_WEATHER_HLSL

#ifndef WATER_LOOP
#define WATER_LOOP [loop]            // these loops exit early on data; do not let the compiler unroll them
#endif

float4 _WaterRogueA;               // group centre x, z (world), travel direction x, z
float4 _WaterRogueB;               // crest height (m), wavenumber k (rad/m), carrier phase (rad), group length (m)
float4 _WaterGust;                 // strength 0..1, patch size (m), drift x, drift z (m, accumulated downwind)
float4 _WaterSlick;                // amount 0..1, lane spacing (m), wind direction x, z

struct WaterRogue {
    float3 disp;                      // displacement to add (x, y, z)
    float2 grad;                      // d height / d xz
    float foam;                     // 0..1 where the crest is steep enough to break
};

WaterRogue waterRogue(float2 p, float depth) {
    WaterRogue r;
    r.disp = float3(0.0, 0.0, 0.0); r.grad = float2(0.0, 0.0); r.foam = 0.0;
    float H = _WaterRogueB.x, k = _WaterRogueB.y;
    if (H <= 0.01 || k <= 0.0) return r;
    float2 d = _WaterRogueA.zw, q = p - _WaterRogueA.xy;
    float s = dot(q, d), n = dot(q, float2(-d.y, d.x)), L = _WaterRogueB.w;
    float env = exp(-(s * s) / (L * L) - (n * n) / (9.0 * L * L)) * smoothstep(2.0, 14.0, depth);
    if (env < 1e-3) return r;
    float A = 0.5 * H * env, th = k * s + _WaterRogueB.z;
    float qa = min(A, 0.85 / k);                                  // horizontal amplitude, short of looping
    r.disp = float3(-d.x * qa * sin(th), A * cos(th) + 0.12 * k * A * A * cos(2.0 * th), -d.y * qa * sin(th));
    r.grad = d * (-A * k * sin(th));
    r.foam = smoothstep(0.28, 0.42, k * A) * smoothstep(0.8, 1.0, cos(th));
    return r;
}

float waterWeatherHash(float2 p) {
    float3 q = frac(float3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return frac((q.x + q.y) * q.z);
}
float waterWeatherNoise(float2 p) {
    float2 i = floor(p), f = frac(p);
    float2 u = f * f * (3.0 - 2.0 * f);
    return lerp(lerp(waterWeatherHash(i), waterWeatherHash(i + float2(1.0, 0.0)), u.x),
               lerp(waterWeatherHash(i + float2(0.0, 1.0)), waterWeatherHash(i + float2(1.0, 1.0)), u.x), u.y);
}

// 0..1, how strongly a gust is roughening the water here
float waterGustMask(float2 p) {
    if (_WaterGust.x <= 0.0) return 0.0;
    float2 q = (p - _WaterGust.zw) / max(_WaterGust.y, 1.0);
    float n = 0.65 * waterWeatherNoise(q) + 0.35 * waterWeatherNoise(q * 2.7 + 5.3);
    return smoothstep(0.52, 0.78, n) * _WaterGust.x;
}

// x: 0..1 slick (smooth, glassy), y: 0..1 foam line in the middle of the lane
float2 waterSlickMask(float2 p) {
    if (_WaterSlick.x <= 0.0) return float2(0.0, 0.0);
    float2 w = _WaterSlick.zw;
    float along = dot(p, w), across = dot(p, float2(-w.y, w.x));
    float sp = max(_WaterSlick.y, 2.0);
    // lanes run with the wind and wander slowly across it
    float wander = (waterWeatherNoise(float2(along / (sp * 9.0), 3.1)) - 0.5) * sp * 1.6;
    float n = waterWeatherNoise(float2((across + wander) / sp, along / (sp * 14.0)));
    float lane = smoothstep(0.58, 0.74, n);
    float line = smoothstep(0.78, 0.84, n) * (1.0 - smoothstep(0.86, 0.92, n));
    return float2(lane, line) * _WaterSlick.x;
}

#endif // WATER_WEATHER_HLSL

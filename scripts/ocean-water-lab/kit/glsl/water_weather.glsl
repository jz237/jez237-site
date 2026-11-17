// ============================================================================
//  WATER KIT - sea-surface weather: rogue waves, gust fronts, slicks, glow
// ----------------------------------------------------------------------------
//  waterRogue      a focusing wave group (one freak wave) the host steers across
//                  the sea; add disp in the vertex stage, grad and crest foam in
//                  the fragment stage, and the same height in your physics.
//  waterGustMask   cat's paws: dark, rough patches running ahead of wind gusts.
//  waterSlickMask  Langmuir windrows: glassy lanes along the wind where surface
//                  films damp the ripples, with foam lines collecting in them.
//  Bioluminescence is a colour the host multiplies with the foam coverage.
//  Positions are world xz in metres.
// ============================================================================

uniform vec4 uRogueA;               // group centre x, z (world), travel direction x, z
uniform vec4 uRogueB;               // crest height (m), wavenumber k (rad/m), carrier phase (rad), group length (m)
uniform vec4 uGust;                 // strength 0..1, patch size (m), drift x, drift z (m, accumulated downwind)
uniform vec4 uSlick;                // amount 0..1, lane spacing (m), wind direction x, z

struct WaterRogue {
    vec3 disp;                      // displacement to add (x, y, z)
    vec2 grad;                      // d height / d xz
    float foam;                     // 0..1 where the crest is steep enough to break
};

WaterRogue waterRogue(vec2 p, float depth) {
    WaterRogue r;
    r.disp = vec3(0.0); r.grad = vec2(0.0); r.foam = 0.0;
    float H = uRogueB.x, k = uRogueB.y;
    if (H <= 0.01 || k <= 0.0) return r;
    vec2 d = uRogueA.zw, q = p - uRogueA.xy;
    float s = dot(q, d), n = dot(q, vec2(-d.y, d.x)), L = uRogueB.w;
    float env = exp(-(s * s) / (L * L) - (n * n) / (9.0 * L * L)) * smoothstep(2.0, 14.0, depth);
    if (env < 1e-3) return r;
    float A = 0.5 * H * env, th = k * s + uRogueB.z;
    float qa = min(A, 0.85 / k);                                  // horizontal amplitude, short of looping
    r.disp = vec3(-d.x * qa * sin(th), A * cos(th) + 0.12 * k * A * A * cos(2.0 * th), -d.y * qa * sin(th));
    r.grad = d * (-A * k * sin(th));
    r.foam = smoothstep(0.28, 0.42, k * A) * smoothstep(0.8, 1.0, cos(th));
    return r;
}

float waterWeatherHash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}
float waterWeatherNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(waterWeatherHash(i), waterWeatherHash(i + vec2(1.0, 0.0)), u.x),
               mix(waterWeatherHash(i + vec2(0.0, 1.0)), waterWeatherHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// 0..1, how strongly a gust is roughening the water here
float waterGustMask(vec2 p) {
    if (uGust.x <= 0.0) return 0.0;
    vec2 q = (p - uGust.zw) / max(uGust.y, 1.0);
    float n = 0.65 * waterWeatherNoise(q) + 0.35 * waterWeatherNoise(q * 2.7 + 5.3);
    return smoothstep(0.52, 0.78, n) * uGust.x;
}

// x: 0..1 slick (smooth, glassy), y: 0..1 foam line in the middle of the lane
vec2 waterSlickMask(vec2 p) {
    if (uSlick.x <= 0.0) return vec2(0.0);
    vec2 w = uSlick.zw;
    float along = dot(p, w), across = dot(p, vec2(-w.y, w.x));
    float sp = max(uSlick.y, 2.0);
    // lanes run with the wind and wander slowly across it
    float wander = (waterWeatherNoise(vec2(along / (sp * 9.0), 3.1)) - 0.5) * sp * 1.6;
    float n = waterWeatherNoise(vec2((across + wander) / sp, along / (sp * 14.0)));
    float lane = smoothstep(0.58, 0.74, n);
    float line = smoothstep(0.78, 0.84, n) * (1.0 - smoothstep(0.86, 0.92, n));
    return vec2(lane, line) * uSlick.x;
}

// ============================================================================
//  WATER KIT - breaking surf on a sloping shore
// ----------------------------------------------------------------------------
//  A train of waves of period T arriving over a beach. In shallow water a wave
//  travels at sqrt(g h), so crests slow down and bunch up near the shore; by
//  Green's law their height grows as h^-1/4 until it reaches gamma * h (the
//  breaker index, about 0.78), where they break and roll in as a band of foam.
//
//  Only depth is needed, so it works on any coastline: the direction to the
//  shore is the downhill direction of the depth field.
//
//  Host provides:  WATER_SURF_DEPTH(worldXZ)  water depth in metres (0 on land);
//                  defaults to waterDepthAt(worldXZ).
//  Call waterSurf(worldXZ, time) in the vertex stage (add height, push xz) and
//  in the fragment stage (grad to tilt the normal, waterSurfFoam for the foam).
// ============================================================================

#ifndef WATER_SURF_DEPTH
#define WATER_SURF_DEPTH(p) waterDepthAt(p)
#endif
#ifndef WATER_SURF_SLOPE
#define WATER_SURF_SLOPE 0.05           // nominal beach slope used for the travel time (crests follow depth contours)
#endif
uniform vec4 uSurf;                 // deep-water height (m), period (s), breaker index, foam gain
uniform vec4 uSurfFoam;             // trail (fraction of a wavelength), streakiness 0..1, texture scale, lingering foam 0..1

struct WaterSurf {
    float height;                   // metres above the rest level
    vec2 push;                      // horizontal displacement (sharpens and leans the crests)
    vec2 grad;                      // d height / d xz, for the normal
    float foam;                     // 0..1, breaking crests and the bore behind them
    float breaking;                 // 0..1, how far past the breaking point
    vec2 dir;                       // direction the breakers travel (towards the shore)
    float phase;                    // 0 on a crest, rising to 1 one wavelength seaward
};

WaterSurf waterSurf(vec2 p, float time) {
    WaterSurf s;
    s.height = 0.0; s.push = vec2(0.0); s.grad = vec2(0.0); s.foam = 0.0; s.breaking = 0.0; s.dir = vec2(1.0, 0.0); s.phase = 0.5;
    float H0 = uSurf.x, T = max(uSurf.y, 1.0), gam = uSurf.z;
    if (H0 <= 0.001) return s;
    float h = WATER_SURF_DEPTH(p);
    float h0 = clamp(1.5613 * T * T * 0.06, 3.0, 14.0);          // the shore starts to matter here
    if (h >= h0 * 1.8 || h <= 0.0) return s;
    vec2 e = vec2(1.5, 0.0);
    vec2 g = vec2(WATER_SURF_DEPTH(p + e.xy) - WATER_SURF_DEPTH(p - e.xy),
                  WATER_SURF_DEPTH(p + e.yx) - WATER_SURF_DEPTH(p - e.yx)) / 3.0;
    float sl = length(g);
    if (sl < 1e-3) return s;
    vec2 shore = -g / sl;                                          // towards shallower water
    // travel time to the waterline at the shallow-water speed over a beach of the
    // nominal slope; a function of depth alone, so crests line up with the depth
    // contours and bunch up where the bottom shelves quickly
    float slope = WATER_SURF_SLOPE;
    float tau = 2.0 * sqrt(h / 9.81) / slope;
    float vary = 0.6 * sin(dot(p, vec2(0.031, -0.024))) + 0.4 * sin(dot(p, vec2(-0.013, 0.041)));   // sets vary along the shore
    float psi = 6.2831853 * (time + tau) / T + vary;
    float c = 0.5 + 0.5 * cos(psi);
    float fadeIn = smoothstep(h0 * 1.8, h0, h);
    float Hraw = H0 * pow(h0 / max(h, 0.05), 0.25) * fadeIn;      // Green's law shoaling
    float Hb = gam * h;
    s.breaking = smoothstep(0.75, 1.0, Hraw / max(Hb, 1e-3));
    float H = min(Hraw, Hb);
    float k = mix(1.0, 5.0, smoothstep(h0, h0 * 0.25, h));        // crests sharpen as they shoal
    float ck = pow(c, k);
    float edge = smoothstep(0.0, 0.35, h);
    s.height = H * (ck - 0.55 / sqrt(k + 0.2)) * edge;
    // crests lean shoreward, and once breaking the lip is thrown forward
    s.push = shore * (0.3 * H * sin(psi) + 0.35 * H * s.breaking * smoothstep(0.7, 1.0, c)) * edge;
    s.dir = shore;
    // d psi / d xz = (2 pi / T) d tau / d h * grad h
    vec2 dpsi = (6.2831853 / T) / (slope * sqrt(9.81 * max(h, 0.05))) * g;
    s.grad = H * k * pow(c, max(k - 1.0, 0.0)) * (-0.5 * sin(psi)) * dpsi * edge;
    float ph = fract(psi / 6.2831853);                             // 0 at the crest, rising seaward
    s.phase = ph;
    s.foam = s.breaking * (smoothstep(0.4, 0.0, ph) + 0.8 * smoothstep(0.93, 1.0, ph)) * uSurf.w;
    return s;
}

float waterSurfHash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}
float waterSurfNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(waterSurfHash(i), waterSurfHash(i + vec2(1.0, 0.0)), u.x),
               mix(waterSurfHash(i + vec2(0.0, 1.0)), waterSurfHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Foam coverage 0..1 for the surf: a solid band on each breaking crest that tears
// into streaks along the direction of travel as it is left behind, plus lace
// lingering between the breakers. footprint: metres of water per pixel.
float waterSurfFoam(vec2 p, WaterSurf s, float footprint) {
    if (s.breaking <= 0.001) return 0.0;
    float sc = max(uSurfFoam.z, 0.05);
    vec2 q = p * sc * 1.3;
    // streaks: noise smeared along the direction of travel with a short directional
    // blur, so they follow a curving shore without the texture swirling
    vec2 sd = s.dir * ((0.2 + 3.8 * uSurfFoam.y) / 5.0);
    float n = 0.0;
    for (int k = 0; k < 6; k++) n += waterSurfNoise(q + sd * (float(k) - 2.5));
    n = clamp((n / 6.0 - 0.5) * mix(1.3, 2.3, uSurfFoam.y) + 0.5, 0.0, 1.0);
    n = n * 0.8 + waterSurfNoise(q * 4.3 + 3.1) * 0.2;              // bubbles break the edges up
    float ph = s.phase;
    float age = smoothstep(0.0, max(uSurfFoam.x, 0.02), ph);       // 0 on the crest, 1 at the end of the trail
    float amount = max(1.0 - age, smoothstep(0.97, 1.0, ph)) * s.breaking;
    float soft = 0.05 + footprint * sc * 0.6;
    // fresh foam is dense; as it ages the threshold rises and it tears into streaks
    float thr = mix(0.12, 0.86, pow(1.0 - amount, 0.55));
    float cov = smoothstep(thr, thr + soft, n) * smoothstep(0.0, 0.2, amount);
    cov *= 0.78 + 0.22 * waterSurfNoise(p * sc * 9.0);           // bubbly texture inside the foam
    float lt = 1.0 - 0.4 * uSurfFoam.w;                              // lace left between the breakers
    cov = max(cov, smoothstep(lt, lt + soft, n + 0.12) * s.breaking * uSurfFoam.w);
    return clamp(cov, 0.0, 1.0) * uSurf.w;
}

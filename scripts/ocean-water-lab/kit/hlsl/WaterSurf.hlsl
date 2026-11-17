// ============================================================================
//  WATER KIT - breaking surf on a sloping shore (HLSL)
// ----------------------------------------------------------------------------
//  Generated from glsl/water_surf.glsl - same functions, same names, same math.
//  Define WATER_SURF_DEPTH(p) (water depth in metres at world xz) before
//  including; set _WaterSurf = (height m, period s, breaker index, foam gain).
// ============================================================================
#ifndef WATER_SURF_HLSL
#define WATER_SURF_HLSL

#ifndef WATER_LOOP
#define WATER_LOOP [loop]            // these loops exit early on data; do not let the compiler unroll them
#endif

#ifndef WATER_SURF_DEPTH
#define WATER_SURF_DEPTH(p) waterDepthAt(p)
#endif
#ifndef WATER_SURF_SLOPE
#define WATER_SURF_SLOPE 0.05           // nominal beach slope used for the travel time (crests follow depth contours)
#endif
float4 _WaterSurf;                 // deep-water height (m), period (s), breaker index, foam gain
float4 _WaterSurfFoam;             // trail (fraction of a wavelength), streakiness 0..1, texture scale, lingering foam 0..1

struct WaterSurf {
    float height;                   // metres above the rest level
    float2 push;                      // horizontal displacement (sharpens and leans the crests)
    float2 grad;                      // d height / d xz, for the normal
    float foam;                     // 0..1, breaking crests and the bore behind them
    float breaking;                 // 0..1, how far past the breaking point
    float2 dir;                       // direction the breakers travel (towards the shore)
    float phase;                    // 0 on a crest, rising to 1 one wavelength seaward
};

WaterSurf waterSurf(float2 p, float time) {
    WaterSurf s;
    s.height = 0.0; s.push = float2(0.0, 0.0); s.grad = float2(0.0, 0.0); s.foam = 0.0; s.breaking = 0.0; s.dir = float2(1.0, 0.0); s.phase = 0.5;
    float H0 = _WaterSurf.x, T = max(_WaterSurf.y, 1.0), gam = _WaterSurf.z;
    if (H0 <= 0.001) return s;
    float h = WATER_SURF_DEPTH(p);
    float h0 = clamp(1.5613 * T * T * 0.06, 3.0, 14.0);          // the shore starts to matter here
    if (h >= h0 * 1.8 || h <= 0.0) return s;
    float2 e = float2(1.5, 0.0);
    float2 g = float2(WATER_SURF_DEPTH(p + e.xy) - WATER_SURF_DEPTH(p - e.xy),
                  WATER_SURF_DEPTH(p + e.yx) - WATER_SURF_DEPTH(p - e.yx)) / 3.0;
    float sl = length(g);
    if (sl < 1e-3) return s;
    float2 shore = -g / sl;                                          // towards shallower water
    // travel time to the waterline at the shallow-water speed over a beach of the
    // nominal slope; a function of depth alone, so crests line up with the depth
    // contours and bunch up where the bottom shelves quickly
    float slope = WATER_SURF_SLOPE;
    float tau = 2.0 * sqrt(h / 9.81) / slope;
    float vary = 0.6 * sin(dot(p, float2(0.031, -0.024))) + 0.4 * sin(dot(p, float2(-0.013, 0.041)));   // sets vary along the shore
    float psi = 6.2831853 * (time + tau) / T + vary;
    float c = 0.5 + 0.5 * cos(psi);
    float fadeIn = smoothstep(h0 * 1.8, h0, h);
    float Hraw = H0 * pow(h0 / max(h, 0.05), 0.25) * fadeIn;      // Green's law shoaling
    float Hb = gam * h;
    s.breaking = smoothstep(0.75, 1.0, Hraw / max(Hb, 1e-3));
    float H = min(Hraw, Hb);
    float k = lerp(1.0, 5.0, smoothstep(h0, h0 * 0.25, h));        // crests sharpen as they shoal
    float ck = pow(c, k);
    float edge = smoothstep(0.0, 0.35, h);
    s.height = H * (ck - 0.55 / sqrt(k + 0.2)) * edge;
    // crests lean shoreward, and once breaking the lip is thrown forward
    s.push = shore * (0.3 * H * sin(psi) + 0.35 * H * s.breaking * smoothstep(0.7, 1.0, c)) * edge;
    s.dir = shore;
    // d psi / d xz = (2 pi / T) d tau / d h * grad h
    float2 dpsi = (6.2831853 / T) / (slope * sqrt(9.81 * max(h, 0.05))) * g;
    s.grad = H * k * pow(c, max(k - 1.0, 0.0)) * (-0.5 * sin(psi)) * dpsi * edge;
    float ph = frac(psi / 6.2831853);                             // 0 at the crest, rising seaward
    s.phase = ph;
    s.foam = s.breaking * (smoothstep(0.4, 0.0, ph) + 0.8 * smoothstep(0.93, 1.0, ph)) * _WaterSurf.w;
    return s;
}

float waterSurfHash(float2 p) {
    float3 q = frac(float3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return frac((q.x + q.y) * q.z);
}
float waterSurfNoise(float2 p) {
    float2 i = floor(p), f = frac(p);
    float2 u = f * f * (3.0 - 2.0 * f);
    return lerp(lerp(waterSurfHash(i), waterSurfHash(i + float2(1.0, 0.0)), u.x),
               lerp(waterSurfHash(i + float2(0.0, 1.0)), waterSurfHash(i + float2(1.0, 1.0)), u.x), u.y);
}

// Foam coverage 0..1 for the surf: a solid band on each breaking crest that tears
// into streaks along the direction of travel as it is left behind, plus lace
// lingering between the breakers. footprint: metres of water per pixel.
float waterSurfFoam(float2 p, WaterSurf s, float footprint) {
    if (s.breaking <= 0.001) return 0.0;
    float sc = max(_WaterSurfFoam.z, 0.05);
    float2 q = p * sc * 1.3;
    // streaks: noise smeared along the direction of travel with a short directional
    // blur, so they follow a curving shore without the texture swirling
    float2 sd = s.dir * ((0.2 + 3.8 * _WaterSurfFoam.y) / 5.0);
    float n = 0.0;
    WATER_LOOP for (int k = 0; k < 6; k++) n += waterSurfNoise(q + sd * (float(k) - 2.5));
    n = clamp((n / 6.0 - 0.5) * lerp(1.3, 2.3, _WaterSurfFoam.y) + 0.5, 0.0, 1.0);
    n = n * 0.8 + waterSurfNoise(q * 4.3 + 3.1) * 0.2;              // bubbles break the edges up
    float ph = s.phase;
    float age = smoothstep(0.0, max(_WaterSurfFoam.x, 0.02), ph);       // 0 on the crest, 1 at the end of the trail
    float amount = max(1.0 - age, smoothstep(0.97, 1.0, ph)) * s.breaking;
    float soft = 0.05 + footprint * sc * 0.6;
    // fresh foam is dense; as it ages the threshold rises and it tears into streaks
    float thr = lerp(0.12, 0.86, pow(1.0 - amount, 0.55));
    float cov = smoothstep(thr, thr + soft, n) * smoothstep(0.0, 0.2, amount);
    cov *= 0.78 + 0.22 * waterSurfNoise(p * sc * 9.0);           // bubbly texture inside the foam
    float lt = 1.0 - 0.4 * _WaterSurfFoam.w;                              // lace left between the breakers
    cov = max(cov, smoothstep(lt, lt + soft, n + 0.12) * s.breaking * _WaterSurfFoam.w);
    return clamp(cov, 0.0, 1.0) * _WaterSurf.w;
}

#endif // WATER_SURF_HLSL

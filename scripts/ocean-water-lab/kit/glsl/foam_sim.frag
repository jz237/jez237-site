// ============================================================================
//  WATER KIT - persistent foam (whitecaps that linger and trail behind crests)
// ----------------------------------------------------------------------------
//  State texture (RG16F or RGBA16F): r = whitecap foam 0..1, g = wake foam
//  (boats, splashes; lives longer), laid out over the
//  REST positions of the surface, so sampling it with the rest position makes
//  the foam ride the waves. Each step: decay, then add foam wherever the
//  surface is being squeezed (jacobian below the whitecap threshold).
//  Include water_waves.glsl (or fft/water_cascades.glsl) before this file.
// ============================================================================
#ifndef WATER_FOAM_DEPTH
#define WATER_FOAM_DEPTH(p) 1.0e4          // water depth at p (relative to the wave origin)
#endif
#ifndef WATER_FOAM_JACOBIAN
#define WATER_FOAM_JACOBIAN(p, texel, depth) waterJacobian(p, 2.0 * (texel), depth)   // FFT: waterFoamJacobianFFT
#endif
#ifndef FOAM_SPLATS
#define FOAM_SPLATS 24
#endif
in vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uScroll;                    // uv offset to the same world point in uPrev
uniform vec4 uRect;                      // centre.x, centre.z (relative to the wave origin), size, texel size in metres
uniform float uDecay;                    // exp(-dt / lifetime)
uniform float uWakeDecay;                // exp(-dt / wake lifetime)
uniform float uFoamThreshold;
uniform float uFoamGain;
uniform vec4 uSplats[FOAM_SPLATS];       // uv.x, uv.y, radius in uv, amount (negative: wake foam)
uniform int uSplatCount;
out vec4 fragColor;

void main() {
    vec2 uv = vUv + uScroll;
    vec2 foam = vec2(0.0);
    if (uv.x > 0.0 && uv.y > 0.0 && uv.x < 1.0 && uv.y < 1.0) {
        // old foam spreads a little and thins out
        float t = uRect.w / uRect.z;
        vec2 around = textureLod(uPrev, uv + vec2(t, 0.0), 0.0).rg + textureLod(uPrev, uv - vec2(t, 0.0), 0.0).rg
                    + textureLod(uPrev, uv + vec2(0.0, t), 0.0).rg + textureLod(uPrev, uv - vec2(0.0, t), 0.0).rg;
        vec2 prev = textureLod(uPrev, uv, 0.0).rg;
        foam.x = mix(prev.x, around.x * 0.25, 0.2) * uDecay;
        foam.y = mix(prev.y, around.y * 0.25, 0.1) * uWakeDecay;
    }
    vec2 p = uRect.xy + (vUv - 0.5) * uRect.z;
    float j = WATER_FOAM_JACOBIAN(p, uRect.w, WATER_FOAM_DEPTH(p));
    foam.x = max(foam.x, clamp((uFoamThreshold - j) * uFoamGain, 0.0, 1.0));
    for (int i = 0; i < FOAM_SPLATS; i++) {
        if (i >= uSplatCount) break;
        vec2 q = (vUv - uSplats[i].xy) / uSplats[i].z;
        float a = uSplats[i].w * exp(-dot(q, q));
        if (a >= 0.0) foam.x += a; else foam.y -= a;
    }
    fragColor = vec4(clamp(foam, 0.0, 1.0), 0.0, 1.0);
}

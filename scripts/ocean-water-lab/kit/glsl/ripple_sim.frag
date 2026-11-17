// ============================================================================
//  WATER KIT - interactive ripples (a 2D wave equation on a scrolling texture)
// ----------------------------------------------------------------------------
//  State texture (RGBA16F): r = height, g = height change per step.
//  Run once per fixed step, ping-ponging two textures. The window follows the
//  player; uScroll shifts the old state by a whole number of texels.
//  Disturb it with "splats": hull points hitting the surface, footsteps, oars.
// ============================================================================
#ifndef RIPPLE_SPLATS
#define RIPPLE_SPLATS 24
#endif
in vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uTexel;                     // 1 / resolution
uniform vec2 uScroll;                    // uv offset to the same world point in uPrev
uniform float uC2;                       // (wave speed * dt / dx)^2, keep below 0.5
uniform float uDamping;                  // per step, e.g. 0.997
uniform vec4 uSplats[RIPPLE_SPLATS];     // uv.x, uv.y, radius in uv, surface displacement in metres
uniform int uSplatCount;
out vec4 fragColor;

vec2 state(vec2 uv) {
    if (uv.x <= 0.0 || uv.y <= 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return vec2(0.0);
    return textureLod(uPrev, uv, 0.0).rg;
}

void main() {
    vec2 uv = vUv + uScroll;
    vec2 s = state(uv);
    float l = state(uv - vec2(uTexel.x, 0.0)).r;
    float r = state(uv + vec2(uTexel.x, 0.0)).r;
    float d = state(uv - vec2(0.0, uTexel.y)).r;
    float u = state(uv + vec2(0.0, uTexel.y)).r;
    float vel = (s.g + uC2 * (l + r + d + u - 4.0 * s.r)) * uDamping;
    float h = s.r + vel;
    for (int i = 0; i < RIPPLE_SPLATS; i++) {
        if (i >= uSplatCount) break;
        vec2 q = (vUv - uSplats[i].xy) / uSplats[i].z;
        h += uSplats[i].w * exp(-dot(q, q));          // something pushed the surface here
    }
    h = clamp(h, -0.6, 0.6);
    vec2 e = min(vUv, 1.0 - vUv);
    float fade = clamp(min(e.x, e.y) * 16.0, 0.0, 1.0);   // absorb at the border
    fragColor = vec4(h * fade, vel * fade, 0.0, 1.0);
}

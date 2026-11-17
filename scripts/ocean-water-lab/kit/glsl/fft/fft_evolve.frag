// WATER KIT - FFT pass 2: spectrum at time uTime, 8 real fields packed into two outputs.
uniform highp sampler2DArray uH0;
uniform int uCascade;
uniform int uN;
uniform float uTileSize;
uniform float uTime;                    // seconds, wrapped to [0, WATER_REPEAT_TIME)
uniform float uChoppy;
layout(location = 0) out vec4 out0;
layout(location = 1) out vec4 out1;
void main() {
    ivec2 id = ivec2(gl_FragCoord.xy);
    vec4 h0 = texelFetch(uH0, ivec3(id, uCascade), 0);
    vec4 a, b;
    waterEvolve(waterGridK(id, uN, uTileSize), h0, uTime, uChoppy, a, b);
    out0 = a;
    out1 = b;
}

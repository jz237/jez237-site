// WATER KIT - FFT pass 1: initial amplitudes for one cascade (draw into layer uCascade of the h0 array).
uniform highp sampler2DArray uNoise;    // rg = two standard normal numbers per cell
uniform int uCascade;
uniform int uN;
uniform vec4 uBand;                     // tile size, lowest k, highest k, gain
uniform vec4 uWindA, uWindB, uSwellA, uSwellB;
out vec4 fragColor;
void main() {
    ivec2 id = ivec2(gl_FragCoord.xy);
    ivec2 mirror = (uN - id) % uN;
    vec2 a = texelFetch(uNoise, ivec3(id, uCascade), 0).xy;
    vec2 b = texelFetch(uNoise, ivec3(mirror, uCascade), 0).xy;
    fragColor = waterSpectrumH0(id, uN, uBand, a, b, uWindA, uWindB, uSwellA, uSwellB);
}

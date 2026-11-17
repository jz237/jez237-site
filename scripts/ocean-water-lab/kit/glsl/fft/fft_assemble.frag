// WATER KIT - FFT pass 4: unpack into displacement, derivative and moment layers of cascade uCascade.
uniform highp sampler2D uIn0;
uniform highp sampler2D uIn1;
uniform highp sampler2DArray uPrevDisp; // last frame's displacement array (for the foam channel)
uniform int uCascade;
uniform vec3 uFoam;                     // whitecap threshold, gain, decay per frame
layout(location = 0) out vec4 outDisp;
layout(location = 1) out vec4 outDeriv;
layout(location = 2) out vec4 outMom;
void main() {
    ivec2 id = ivec2(gl_FragCoord.xy);
    float prev = texelFetch(uPrevDisp, ivec3(id, uCascade), 0).w;
    vec4 d, de, m;
    waterAssemble(texelFetch(uIn0, id, 0), texelFetch(uIn1, id, 0), prev, uFoam, d, de, m);
    outDisp = d;
    outDeriv = de;
    outMom = m;
}

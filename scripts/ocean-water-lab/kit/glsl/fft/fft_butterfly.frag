// WATER KIT - FFT pass 3: one butterfly stage along x (uHorizontal = 1) or z.
uniform highp sampler2D uIn0;
uniform highp sampler2D uIn1;
uniform int uN;
uniform int uSub;                       // 2, 4, ... N
uniform int uHorizontal;
layout(location = 0) out vec4 out0;
layout(location = 1) out vec4 out1;
void main() {
    ivec2 id = ivec2(gl_FragCoord.xy);
    int i = uHorizontal == 1 ? id.x : id.y;
    ivec2 s = waterFftSources(i, uSub, uN);
    ivec2 e = uHorizontal == 1 ? ivec2(s.x, id.y) : ivec2(id.x, s.x);
    ivec2 o = uHorizontal == 1 ? ivec2(s.y, id.y) : ivec2(id.x, s.y);
    out0 = waterFftButterfly(texelFetch(uIn0, e, 0), texelFetch(uIn0, o, 0), i, uSub);
    out1 = waterFftButterfly(texelFetch(uIn1, e, 0), texelFetch(uIn1, o, 0), i, uSub);
}

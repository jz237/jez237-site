//@@ shadow.glsl
// ---- sun shadows: two cascades in a depth-texture array, hardware PCF ----------
uniform highp sampler2DArrayShadow uShadowMap;
uniform mat4 uShadowMat[2];             // world -> shadow clip space, per cascade
uniform vec4 uShadowInfo;               // texel size of cascade 0 (m), of cascade 1 (m), on/off, map size

float shadowCascade(vec3 p, int c) {
    vec4 s = uShadowMat[c] * vec4(p, 1.0);
    vec3 q = s.xyz / s.w * 0.5 + 0.5;
    if (q.x <= 0.002 || q.y <= 0.002 || q.x >= 0.998 || q.y >= 0.998 || q.z >= 1.0) return -1.0;
    float t = 1.0 / uShadowInfo.w;
    float r = q.z - (c == 0 ? 0.0006 : 0.0012);
    float v = texture(uShadowMap, vec4(q.xy, float(c), r)) * 2.0;           // 5-tap PCF, each tap a 2x2 compare
    v += texture(uShadowMap, vec4(q.xy + vec2(-1.2, -0.5) * t, float(c), r));
    v += texture(uShadowMap, vec4(q.xy + vec2(1.2, 0.5) * t, float(c), r));
    v += texture(uShadowMap, vec4(q.xy + vec2(-0.5, 1.2) * t, float(c), r));
    v += texture(uShadowMap, vec4(q.xy + vec2(0.5, -1.2) * t, float(c), r));
    return v / 6.0;
}

// direct sun reaching p (n: surface normal, pushes the lookup off the surface)
float sunShadowMap(vec3 p, vec3 n) {
    if (uShadowInfo.z < 0.5) return 1.0;
    float s = shadowCascade(p + n * uShadowInfo.x * 1.5, 0);
    if (s >= 0.0) return s;
    s = shadowCascade(p + n * uShadowInfo.y * 1.5, 1);
    return s >= 0.0 ? s : 1.0;
}

float sunVisibility(vec3 p) { return sunShadowMap(p, vec3(0.0, 1.0, 0.0)) * cloudShadow(p); }
float sunVisibilityN(vec3 p, vec3 n) { return sunShadowMap(p, n) * cloudShadow(p); }

//@@ shadow_depth.frag
out vec4 fragColor;
void main() { fragColor = vec4(1.0); }
//@@ shadow_object.frag
// objects: palm fronds are cut out, so their shadows are too
in vec2 vAux;
uniform int uKind;
out vec4 fragColor;
void main() {
    if (uKind == 6) {
        float t = vAux.x, as = abs(vAux.y);
        float g = fract(t * 24.0 - as * 2.4);
        if (as > 0.07 && (g > 0.58 || as > 1.0 - 0.15 * t)) discard;
    }
    fragColor = vec4(1.0);
}

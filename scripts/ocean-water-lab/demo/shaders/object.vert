layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aAux;       // palms: along / across a frond; boat: part id
uniform mat4 uViewProj;
uniform float uTime;
uniform int uKind;
uniform vec4 uSway;          // wind x, wind z, amplitude, phase (palms)
uniform vec4 uSail;          // billow, flutter, how much sail is set, unused (ship sails)
uniform mat4 uModel;         // rotation + translation
uniform vec3 uScale;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vLocal;             // metres, object space
out vec3 vLocalNormal;
out vec2 vAux;
void main() {
    vec3 l = aPos * uScale;
    if (uSway.z > 0.0) {
        // trunks bend more towards the top; fronds flutter more towards their tips
        float t = uTime * 1.1 + uSway.w;
        float gust = 0.6 + 0.6 * sin(t) + 0.25 * sin(t * 2.3 + 1.7);
        float hgt = max(l.y, 0.0);
        l.xz += uSway.xy * (hgt * hgt * 0.01 * gust * uSway.z);
        if (uKind == 6) l.y += sin(uTime * 3.3 + aAux.x * 5.0 + uSway.w * 3.0) * 0.14 * aAux.x * uSway.z;
    }
    if (uKind == 9) {
        float u = aAux.x, v = aAux.y;
        if (v < 1.5) {
            // canvas bellies forward with the wind; reefed sails are hauled up towards the yard
            float bel = sin(3.14159 * u) * sin(3.14159 * clamp(v, 0.0, 1.0));
            l.x += bel * uSail.x * 0.9 + sin(uTime * 4.0 + u * 7.0 + v * 4.0) * uSail.y * 0.06 * bel;
            l.y += (1.0 - uSail.z) * v * 0.0;
        } else {
            float fu = u;                                              // the flag: waves travel out from the pole
            l.z += sin(uTime * 9.0 - fu * 8.0) * 0.32 * fu + sin(uTime * 5.3 - fu * 5.0) * 0.12 * fu;
        }
    }
    vec4 w = uModel * vec4(l, 1.0);
    vLocal = l;
    vLocalNormal = aNormal;
    vAux = aAux;
    vNormal = mat3(uModel) * normalize(aNormal / uScale);
    vWorld = w.xyz;
    gl_Position = uViewProj * w;
}

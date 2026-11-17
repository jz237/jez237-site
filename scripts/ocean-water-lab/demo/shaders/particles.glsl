//@@ rain.vert
// Rain streaks in a box that moves with the camera. Every position comes from the
// instance id and the time, so nothing is uploaded per frame.
layout(location = 0) in vec2 aCorner;   // x: -1..1 across, y: 0 head .. 1 tail
uniform mat4 uViewProj;
uniform vec3 uCamPos;
uniform float uTime;
uniform vec3 uFall;                     // drop velocity, m/s
uniform float uBox;                     // half size of the box, m
uniform float uShutter;                 // streak length = speed x shutter
uniform float uDropSize;
out vec2 vQ;
out float vFade;
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
    float id = float(gl_InstanceID);
    vec3 r = vec3(h1(id), h1(id + 17.31), h1(id + 41.7));
    vec3 box = vec3(2.0 * uBox, 1.6 * uBox, 2.0 * uBox);
    vec3 p = (r - 0.5) * box + uFall * (uTime * (0.85 + 0.3 * r.z));
    p = mod(p - uCamPos + box * 0.5, box) - box * 0.5 + uCamPos;
    vec3 axis = -uFall * uShutter;
    vec3 side = normalize(cross(axis, uCamPos - p)) * (0.006 + 0.006 * r.y) * uDropSize;
    vec3 w = p + axis * aCorner.y + side * aCorner.x;
    vQ = aCorner;
    float d = length(p - uCamPos);
    vFade = smoothstep(uBox, uBox * 0.4, d) * smoothstep(0.4, 1.5, d) * step(0.0, p.y + 0.3);
    gl_Position = uViewProj * vec4(w, 1.0);
}
//@@ rain.frag
in vec2 vQ;
in float vFade;
uniform float uAmount;
uniform float uEnvMaxLod;
out vec4 fragColor;
// drops refract the sky behind them and catch a little sun: drawn additively
void main() {
    float a = (1.0 - vQ.x * vQ.x) * sin(3.14159 * vQ.y) * vFade * uAmount;
    vec3 c = envAmbient(uEnvMaxLod) * 0.55 + uSunColor * 0.006;
    fragColor = vec4(encodeHDR(c * a), 0.0);
}
//@@ spray.vert
// Spray, splashes and wake mist: CPU particles drawn as soft camera-facing discs.
layout(location = 0) in vec2 aCorner;   // -1..1
layout(location = 1) in vec4 aPosSize;  // per instance: world position, radius
layout(location = 2) in float aAlpha;
uniform mat4 uViewProj;
uniform vec3 uCamRight, uCamUp;
uniform float uEnvMaxLod;
out vec2 vQ;
out float vA;
out vec3 vLit;
void main() {
    vec3 w = aPosSize.xyz + (uCamRight * aCorner.x + uCamUp * aCorner.y) * aPosSize.w;
    vQ = aCorner;
    vA = abs(aAlpha);
    float smoke = step(aAlpha, 0.0);                                    // negative alpha: grey gun smoke
    vec3 V = normalize(uCamPos - aPosSize.xyz);
    float fwd = pow(max(dot(-V, uSunDir), 0.0), 6.0);                      // bright when backlit
    vLit = 0.85 * (uSunColor * (0.6 * max(uSunDir.y, 0.1) / PI + 0.35 * fwd) + envAmbient(uEnvMaxLod)) * mix(1.0, 0.42, smoke);
    gl_Position = uViewProj * vec4(w, 1.0);
}
//@@ spray.frag
in vec2 vQ;
in float vA;
in vec3 vLit;
out vec4 fragColor;
void main() {
    float r2 = dot(vQ, vQ);
    if (r2 > 1.0) discard;
    float a = (1.0 - r2);
    a *= a * vA * (0.75 + 0.5 * hash21(gl_FragCoord.xy * 0.7));
    fragColor = vec4(encodeHDR(vLit) * a, a);
}

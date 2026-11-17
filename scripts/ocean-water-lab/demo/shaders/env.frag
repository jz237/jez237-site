// Bakes sky and clouds into an equirectangular map for reflections and ambient light.
// Blended with the previous bake: the jitter moves each frame, so the cloud
// ray-march noise averages out (directions are fixed, no reprojection needed).
in vec2 vUv;
in vec3 vAmbient;
uniform sampler2D uEnvHistory;
uniform float uHistory;
uniform float uFrame;
uniform int uSteps;
uniform int uLightSteps;
uniform vec3 uCloudAmbBottom;
out vec4 fragColor;
void main() {
    float phi = (vUv.x - 0.5) * 2.0 * PI;
    float theta = vUv.y * PI;                          // matches dirToEquirect(): v = 0 looks straight up
    vec3 d = vec3(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
    vec3 u = vec3(d.x, max(abs(d.y), 0.0), d.z);
    vec3 col = skyAtmosphere(u);
    float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy + uFrame * 5.588238, vec2(0.06711056, 0.00583715))));
    float md;
    vec4 c = cloudMarch(uCamPos, normalize(u), uSteps, uLightSteps, ign, uCloudSun, vAmbient, uCloudAmbBottom, md);
    float haze = 1.0 - exp(-md / mix(38000.0, 12000.0, clamp((uMieScale - 1.0) / 6.0, 0.0, 1.0)));
    c.rgb = mix(c.rgb, col * (1.0 - c.a), haze);
    col = col * c.a + c.rgb;
    if (d.y < 0.0) col = mix(col * 0.55, uDeepColor, saturate(-d.y * 2.5));
    vec3 prev = decodeHDR(texture(uEnvHistory, vUv).rgb);
    fragColor = vec4(encodeHDR(mix(col, prev, uHistory)), 1.0);
}

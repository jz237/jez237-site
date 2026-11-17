// sky behind everything, at full resolution: atmosphere, sun disc, the cloud layer on top
in vec2 vUv;
in vec3 vAmbient;
uniform vec3 uCamRight, uCamUp, uCamFwd;
uniform vec2 uTanFov;       // tan(half fov) * (aspect, 1)
uniform float uUnderwater;
uniform vec3 uScatterColor;
uniform float uEnvMaxLod;
uniform sampler2D uCloudTex; // cloud_pass output: rgb in-scatter, a transmittance
uniform vec4 uMoon;          // direction xyz, star brightness (0 in daytime)
uniform vec4 uBolt;          // lightning: azimuth (rad), top elevation (rad), seed, brightness
uniform vec3 uRainSky;       // rain curtains: amount, time, height they reach (elevation, rad)
out vec4 fragColor;
// a forked lightning channel hanging from the cloud base, drawn in angle space
float boltLine(float az, float el, float baseAz, float top, float seed) {
    if (el < -0.002 || el > top) return 0.0;
    float t = el / max(top, 1e-3);
    float wander = (fbm(vec2(el * 38.0, seed), 4) - 0.5) * 0.09 + (fbm(vec2(el * 160.0, seed + 7.0), 2) - 0.5) * 0.012;
    float d = abs(az - baseAz - wander * (0.4 + 0.6 * (1.0 - t)));
    float w = 0.0009 + 0.0008 * t;
    float core = smoothstep(w, 0.0, d);
    float glow = exp(-d / 0.012) * 0.06;
    // one branch splitting off two thirds of the way down
    float bt = (el - top * 0.25) / (top * 0.4);
    float branch = 0.0;
    if (bt > 0.0 && bt < 1.0) {
        float bw = (fbm(vec2(el * 50.0, seed + 3.0), 3) - 0.5) * 0.05;
        float bd = abs(az - baseAz - wander - (1.0 - bt) * 0.05 * sign(fract(seed) - 0.5) - bw * (1.0 - bt));
        branch = smoothstep(w * 0.7, 0.0, bd) * bt * 0.6;
    }
    return core + branch + glow;
}
float starField(vec3 d) {
    vec3 p = d * 200.0;
    vec3 id = floor(p);
    float h = fract(sin(dot(id, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    vec3 o = vec3(fract(h * 13.1), fract(h * 71.3), fract(h * 37.9));
    float dd = length(fract(p) - o);
    return step(0.982, h) * smoothstep(0.3, 0.0, dd) * (0.4 + 2.0 * fract(h * 97.0));
}
void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec3 d = normalize(uCamFwd + uCamRight * ndc.x * uTanFov.x + uCamUp * ndc.y * uTanFov.y);
    vec3 col;
    if (uUnderwater > 0.5) {
        // nothing but water in every direction the mesh does not cover
        col = uScatterColor * (uSunColor * (max(uSunDir.y, 0.0) / PI) + envAmbient(uEnvMaxLod));
    } else if (d.y >= 0.0) {
        col = skyAtmosphere(d);
        float mu = dot(d, uSunDir);
        col += uCloudSun * (2.0e4 * smoothstep(0.999950, 0.999970, mu));                 // sun disc (0.53 deg)
        col += uCloudSun * (0.5 * pow(saturate(mu), 1200.0));                            // aureole
        if (uMoon.w > 0.0) col += vec3(0.8, 0.88, 1.0) * starField(d) * uMoon.w * 0.004 * smoothstep(0.0, 0.15, d.y);
        vec2 ct = 0.75 / vec2(textureSize(uCloudTex, 0));                     // soft upsample of the reduced-res clouds
        vec4 c = texture(uCloudTex, vUv) * 0.4 + (texture(uCloudTex, vUv + ct) + texture(uCloudTex, vUv - ct)
               + texture(uCloudTex, vUv + vec2(ct.x, -ct.y)) + texture(uCloudTex, vUv + vec2(-ct.x, ct.y))) * 0.15;
        col = col * c.a + c.rgb;
        if (uRainSky.x > 0.0) {
            // grey veils of distant rain hanging under the cloud base, drifting and streaked
            float az = atan(d.z, d.x);
            float where = smoothstep(0.35, 0.72, fbm(vec2(az * 4.0 + uRainSky.y * 0.004, 1.7), 3));
            float streak = 0.7 + 0.3 * vnoise(vec2(az * 260.0, d.y * 9.0 - uRainSky.y * 3.0));
            float fall = 1.0 - smoothstep(0.0, uRainSky.z, d.y);
            vec3 veil = skyAtmosphere(normalize(vec3(d.x, 0.02, d.z))) * 0.85;
            col = mix(col, veil, saturate(uRainSky.x * where * fall * streak));
        }
        if (uBolt.w > 0.0) {
            float az = atan(d.z, d.x), el = asin(clamp(d.y, -1.0, 1.0));
            float da = mod(az - uBolt.x + PI, 2.0 * PI) - PI;
            col += vec3(0.85, 0.88, 1.0) * boltLine(da, el, 0.0, uBolt.y, uBolt.z) * uBolt.w;
        }
    } else {
        col = sampleEnv(normalize(vec3(d.x, 0.03, d.z)), 1.5);                         // open sea beyond the mesh
    }
    fragColor = vec4(encodeHDR(col), 1.0);
}

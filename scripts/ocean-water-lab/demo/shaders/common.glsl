// ---- shared by every demo shader -------------------------------------------
#define PI 3.14159265359
#define saturate(x) clamp(x, 0.0, 1.0)

uniform vec3 uSunDir;        // towards the sun
uniform vec3 uSunColor;      // sun irradiance at sea level (after atmosphere and clouds)
uniform vec3 uCamPos;
uniform float uTime;
uniform vec2 uWaveOrigin;    // world xz the wave phases are relative to
uniform vec2 uIslandPos;
uniform float uTide;         // sea level above mean, metres (the land is lowered instead of the sea raised)
uniform sampler2D uEnv;      // equirectangular sky, mip-mapped

#ifdef LDR_TARGETS
vec3 encodeHDR(vec3 c) { c = max(c, 0.0); return sqrt(c / (1.0 + c)); }
vec3 decodeHDR(vec3 e) { e = e * e; return e / max(1.0 - e, 0.004); }
#else
vec3 encodeHDR(vec3 c) { return c; }
vec3 decodeHDR(vec3 e) { return e; }
#endif

vec2 dirToEquirect(vec3 d) {
    return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, acos(clamp(d.y, -1.0, 1.0)) / PI);
}
vec3 sampleEnv(vec3 d, float lod) {
    return decodeHDR(textureLod(uEnv, dirToEquirect(d), lod).rgb);
}

// Diffuse sky light on an upward-facing surface, divided by PI (so albedo * this = radiance).
// Five taps of the blurred sky: straight up plus four directions 27 degrees above the horizon.
vec3 envAmbient(float maxLod) {
    vec2 s = normalize(uSunDir.xz + vec2(1e-4, 0.0));
    vec3 a = sampleEnv(vec3(0.0, 1.0, 0.0), maxLod - 2.0);
    vec3 b = sampleEnv(normalize(vec3(s.x, 0.5, s.y)), maxLod - 3.0) + sampleEnv(normalize(vec3(-s.x, 0.5, -s.y)), maxLod - 3.0)
           + sampleEnv(normalize(vec3(-s.y, 0.5, s.x)), maxLod - 3.0) + sampleEnv(normalize(vec3(s.y, 0.5, -s.x)), maxLod - 3.0);
    return a * 0.3 + b * 0.175;
}

float hash21(vec2 p) {
    uvec2 q = uvec2(ivec2(floor(p)));
    q = q * uvec2(1597334673u, 3812015801u);
    uint n = (q.x ^ q.y) * 1597334673u;
    return float(n) * (1.0 / 4294967295.0);
}
float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash21(i), b = hash21(i + vec2(1.0, 0.0)), c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p, int octaves) {
    float s = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < octaves; i++) { s += a * vnoise(p); p = m * p; a *= 0.5; }
    return s;
}

// The demo island: a sandy cay with a shelf, analytic so the CPU physics can use
// the same shape. Height in metres, sea level = 0.
float terrainHeight(vec2 p) {
    vec2 q = p - uIslandPos;
    float r = length(q);
    float a = atan(q.y, q.x);
    float R = 95.0 + 22.0 * sin(3.0 * a + 0.6) + 12.0 * sin(5.0 * a - 1.3) + 7.0 * sin(8.0 * a + 2.1);
    if (r < R) {
        float e = (1.0 - r / R) * 95.0;
        return 0.07 * e + 15.0 * smoothstep(22.0, 92.0, e) - uTide;
    }
    float d = r - R;
    return max(-(0.055 * d + 0.0011 * d * d), -70.0) - uTide;
}
float waterDepthAt(vec2 worldXZ) { return max(-terrainHeight(worldXZ), 0.0); }

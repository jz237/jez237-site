//@@ bloom_down.frag
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;          // texel size of the SOURCE
uniform float uThreshold;     // > 0 on the first pass only
out vec4 fragColor;
void main() {
    vec3 c = vec3(0.0);
    c += texture(uTex, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(1.0, -1.0)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(1.0, 1.0)).rgb;
    c *= 0.25;
    if (uThreshold > 0.0) {
        c = min(c, vec3(48.0));
        float b = max(c.r, max(c.g, c.b));
        c *= max(b - uThreshold, 0.0) / max(b, 1e-4);
    }
    fragColor = vec4(c, 1.0);
}
//@@ bloom_up.frag
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
out vec4 fragColor;
void main() {
    vec3 c = vec3(0.0);
    c += texture(uTex, vUv + uTexel * vec2(-0.5, -0.5)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(0.5, -0.5)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(-0.5, 0.5)).rgb;
    c += texture(uTex, vUv + uTexel * vec2(0.5, 0.5)).rgb;
    fragColor = vec4(c * 0.25, 1.0);
}
//@@ composite.frag
// Exposure, tone curve and colour grade. Order: lens (fringing, sharpen) -> bloom ->
// exposure -> white balance -> contrast (scene-referred) -> tone curve -> saturation,
// vibrance, split toning (display-referred) -> gamma -> vignette, grain, dither.
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uExposure;
uniform int uTonemap;          // 0 ACES, 1 AgX, 2 filmic (Hable), 3 Reinhard
uniform vec3 uWhiteBalance;    // per-channel gain from temperature + tint
uniform vec4 uGrade;           // saturation, vibrance, contrast, vignette
uniform vec3 uShadowTint;
uniform vec3 uHighTint;
uniform float uSplit;
uniform vec4 uLens;            // grain, fringing, sharpen, time
uniform vec2 uTexel;
uniform float uFlashScreen;    // lightning lighting up everything a little
uniform vec2 uLensRain;        // drops on the lens: amount, time
uniform float uFade;           // 1 = black (showreel cuts)
uniform vec4 uRays;            // sun on screen (uv), light-shaft strength, 1 / exposure
out vec4 fragColor;

// Raindrops on the lens: each cell may hold a drop that lives a few seconds; a drop
// bends the image behind it like a small lens. Returns the uv offset and an edge term.
vec3 lensDrops(vec2 uv, float scale, float amount, float t, float seed) {
    vec2 aspect = vec2(uTexel.y / uTexel.x, 1.0);
    vec2 g = uv * aspect * scale, cell = floor(g), f = fract(g) - 0.5;
    float h = hash21(cell + seed * 37.0);
    float life = fract(t * (0.08 + 0.1 * h) + h * 7.0);
    if (h > amount || life > 0.85) return vec3(0.0);
    vec2 c = vec2(hash21(cell + 3.7 + seed), hash21(cell + 9.1 + seed)) - 0.5;
    c *= 0.5;
    c.y -= life * life * 0.35;                                   // slides down as it grows heavy
    float r = (0.14 + 0.2 * hash21(cell + 5.3)) * (1.0 - life * 0.4);
    vec2 d = f - c;
    float l = length(d / vec2(1.0, 1.25));
    if (l > r) return vec3(0.0);
    float k = 1.0 - l / r;
    return vec3(-d * (0.4 + 1.6 * k) * 0.9 / (scale * aspect), smoothstep(0.0, 0.12, k) * (1.0 - smoothstep(0.12, 0.35, k)));
}

vec3 agxCurve(vec3 x) {
    vec3 x2 = x * x, x4 = x2 * x2;
    return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
}
vec3 agx(vec3 c) {
    const mat3 inM = mat3(0.842479062253094, 0.0423282422610123, 0.0423756549057051,
                          0.0784335999999992, 0.878468636469772, 0.0784336,
                          0.0792237451477643, 0.0791661274605434, 0.879142973793104);
    const mat3 outM = mat3(1.19687900512017, -0.0528968517574562, -0.0529716355144438,
                           -0.0980208811401368, 1.15190312990417, -0.0980434501171241,
                           -0.0990297440797205, -0.0989611768448433, 1.15107367264116);
    c = inM * max(c, 1e-10);
    c = clamp((log2(c) + 12.47393) / 16.5, 0.0, 1.0);
    c = outM * agxCurve(c);
    return pow(max(c, 0.0), vec3(2.2));
}
vec3 hable(vec3 x) { return ((x * (0.15 * x + 0.05) + 0.004) / (x * (0.15 * x + 0.5) + 0.06)) - 0.0666667; }
vec3 tonemap(vec3 c) {
    if (uTonemap == 1) return agx(c);
    if (uTonemap == 2) return clamp(hable(c * 2.0) / hable(vec3(11.2)), 0.0, 1.0);
    if (uTonemap == 3) return clamp(c * (1.0 + c / 64.0) / (1.0 + c), 0.0, 1.0);
    return clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);     // ACES (Narkowicz 2015)
}
void main() {
    vec2 uv = vUv, q = vUv - 0.5;
    float dropEdge = 0.0;
    if (uLensRain.x > 0.0) {
        vec3 a = lensDrops(vUv, 6.0, uLensRain.x * 0.3, uLensRain.y, 0.0);
        vec3 b = lensDrops(vUv, 15.0, uLensRain.x * 0.4, uLensRain.y * 1.3, 1.0);
        uv += a.xy + b.xy;
        dropEdge = max(a.z, b.z);
    }
    vec3 c;
    if (uLens.y > 0.0) {                                   // lateral chromatic aberration, stronger at the edges
        vec2 o = q * dot(q, q) * uLens.y * 0.03;
        c = vec3(decodeHDR(texture(uScene, uv - o).rgb).r, decodeHDR(texture(uScene, uv).rgb).g, decodeHDR(texture(uScene, uv + o).rgb).b);
    } else c = decodeHDR(texture(uScene, uv).rgb);
    c *= 1.0 - 0.1 * dropEdge;
    if (uLens.z > 0.0) {                                   // unsharp mask
        vec3 nb = decodeHDR(texture(uScene, vUv + vec2(uTexel.x, 0.0)).rgb) + decodeHDR(texture(uScene, vUv - vec2(uTexel.x, 0.0)).rgb)
                + decodeHDR(texture(uScene, vUv + vec2(0.0, uTexel.y)).rgb) + decodeHDR(texture(uScene, vUv - vec2(0.0, uTexel.y)).rgb);
        c = max(c + (c - nb * 0.25) * uLens.z * 1.5, 0.0);
    }
#ifndef LDR_TARGETS
    c += texture(uBloom, uv).rgb * uBloomStrength * (1.0 + 2.0 * uLensRain.x);
#endif
    if (uRays.z > 0.0) {
        // light shafts: bright pixels smeared towards the sun's position on screen
        vec2 d = (uRays.xy - uv) / 32.0, s = uv;
        float decay = 1.0;
        vec3 acc = vec3(0.0);
        for (int i = 0; i < 32; i++) {
            s += d;
            vec3 x = min(decodeHDR(texture(uScene, clamp(s, 0.001, 0.999)).rgb), vec3(2.5 * uRays.w));   // the sun disc must not dominate
            float l = dot(x, vec3(0.2126, 0.7152, 0.0722));
            acc += x * (max(l - 1.0 * uRays.w, 0.0) / max(l, 1e-4)) * decay;
            decay *= 0.95;
        }
        c += acc * (uRays.z * 0.35 / 32.0);
    }
    c *= uExposure * uWhiteBalance * (1.0 + uFlashScreen);
    c = 0.18 * pow(max(c, 0.0) / 0.18, vec3(uGrade.z));          // contrast around middle grey
    c = tonemap(c);
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(vec3(l), c, uGrade.x);
    float chroma = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
    c = mix(vec3(l), c, 1.0 + uGrade.y * (1.0 - chroma));          // vibrance: lift muted colours more
    vec3 tint = mix(uShadowTint, uHighTint, smoothstep(0.05, 0.75, l)) * 2.0;
    c *= mix(vec3(1.0), tint, uSplit);
    c = pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)) * (1.0 - uFade);
    c *= 1.0 - uGrade.w * dot(q, q) * (1.0 + 0.5 * dot(q, q));
    float n = hash21(gl_FragCoord.xy + fract(uLens.w * 7.31) * 512.0) - 0.5;
    c += n * uLens.x * 0.09 * (1.0 - l * 0.6);
    c += (hash21(gl_FragCoord.xy) - 0.5) / 255.0;
    fragColor = vec4(c, dot(c, vec3(0.299, 0.587, 0.114)));
}
//@@ fxaa.frag
// FXAA (Lottes 2009), the compact edge-direction variant: blur along the edge
// direction found from luma, keep the result only if it stays in the local range.
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
out vec4 fragColor;
void main() {
    float lNW = texture(uTex, vUv + vec2(-1.0, -1.0) * uTexel).a;
    float lNE = texture(uTex, vUv + vec2(1.0, -1.0) * uTexel).a;
    float lSW = texture(uTex, vUv + vec2(-1.0, 1.0) * uTexel).a;
    float lSE = texture(uTex, vUv + vec2(1.0, 1.0) * uTexel).a;
    vec4 m = texture(uTex, vUv);
    float lMin = min(m.a, min(min(lNW, lNE), min(lSW, lSE)));
    float lMax = max(m.a, max(max(lNW, lNE), max(lSW, lSE)));
    if (lMax - lMin < max(0.0312, lMax * 0.125)) { fragColor = vec4(m.rgb, 1.0); return; }
    vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), (lNW + lSW) - (lNE + lSE));
    float reduce = max((lNW + lNE + lSW + lSE) * 0.03125, 1.0 / 128.0);
    dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -8.0, 8.0) * uTexel;
    vec3 a = 0.5 * (texture(uTex, vUv + dir * (1.0 / 3.0 - 0.5)).rgb + texture(uTex, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);
    vec3 b = a * 0.5 + 0.25 * (texture(uTex, vUv - dir * 0.5).rgb + texture(uTex, vUv + dir * 0.5).rgb);
    float lb = dot(b, vec3(0.299, 0.587, 0.114));
    fragColor = vec4((lb < lMin || lb > lMax) ? a : b, 1.0);
}

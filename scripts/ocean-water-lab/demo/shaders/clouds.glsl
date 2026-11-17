//@@ clouds.glsl
// ---- volumetric clouds --------------------------------------------------------
// A layer of cloud between two altitudes, ray-marched through tileable 3D noise
// (Schneider 2015, "The real-time volumetric cloudscapes of Horizon Zero Dawn").
// Lighting: a few samples towards the sun, three octaves of multiple scattering
// (Wrenninge 2013), dual-lobe phase function, sky ambient.
uniform highp sampler3D uCloudNoise;    // r = Perlin-Worley, gba = Worley octaves
uniform sampler2D uWeather;             // r = coverage variation, g = cloud type variation
uniform vec4 uCloudLayer;               // bottom (m), top (m), coverage 0..1, density
uniform vec4 uCloudShape;               // type (0 stratus .. 1 towering), base scale (m), detail scale (m), detail erosion
uniform vec3 uCloudWind;                // accumulated drift, metres
uniform float uFlash;                   // lightning flash, 0..1
uniform float uMieScale;                // aerosols (haze between the eye and the clouds)
#define CLOUD_RE 6360000.0
#define CLOUD_SIGMA 0.035               // extinction per metre at density 1

float cRemap(float v, float l0, float h0, float l1, float h1) { return l1 + (v - l0) * (h1 - l1) / (h0 - l0); }

float cloudAltitude(vec3 p) {
    vec3 c = vec3(uCamPos.x, -CLOUD_RE, uCamPos.z);
    return length(p - c) - CLOUD_RE;
}

// vertical shape: stratus is a thin sheet, cumulus a rounded heap, towers reach the top
float cloudProfile(float hf, float type) {
    float stratus = smoothstep(0.0, 0.07, hf) * (1.0 - smoothstep(0.14, 0.3, hf));
    float cumulus = smoothstep(0.0, 0.1, hf) * (1.0 - smoothstep(0.3, 0.85, hf));
    float tower = smoothstep(0.0, 0.08, hf) * (1.0 - smoothstep(0.75, 1.0, hf));
    return type < 0.5 ? mix(stratus, cumulus, type * 2.0) : mix(cumulus, tower, type * 2.0 - 1.0);
}

float cloudDensity(vec3 p, float hf, bool detail) {
    if (hf <= 0.0 || hf >= 1.0) return 0.0;
    vec4 w = textureLod(uWeather, (p.xz + uCloudWind.xz) / 36000.0, 0.0);
    float cover = uCloudLayer.z;
    // weather map (measured range 0.33..0.68) -> where clouds may form; a fraction 'cover' of the sky
    float wn = clamp((w.r - 0.5) / 0.18 * 0.5 + 0.5, 0.0, 1.0);
    float place = smoothstep(1.0 - cover - 0.18, 1.0 - cover + 0.18, wn);
    float closed = smoothstep(0.82, 1.0, cover);
    place = max(place, closed);
    if (place <= 0.01) return 0.0;
    float type = clamp(uCloudShape.x + (w.g - 0.5) * 0.5, 0.0, 1.0);
    float prof = cloudProfile(hf, type);
    vec3 q = p + uCloudWind + vec3(hf * 500.0, 0.0, 0.0);                 // tops lean downwind
    vec4 n = textureLod(uCloudNoise, q / uCloudShape.y, 0.0);
    float wf = n.g * 0.625 + n.b * 0.25 + n.a * 0.125;
    float shape = cRemap(n.r, wf - 1.0, 1.0, 0.0, 1.0);
    shape = clamp((shape - 0.72) / 0.2, 0.0, 1.0);                        // measured range 0.75..0.90 -> 0..1
    float thr = 1.0 - 0.85 * place;
    float base = clamp((shape * prof - thr) / (1.0 - thr + 1e-3), 0.0, 1.0);
    base = max(base, prof * closed * 0.6);                                // a full deck has no holes
    if (!detail || base <= 0.0) return base * uCloudLayer.w;
    vec4 d = textureLod(uCloudNoise, q / uCloudShape.z + vec3(0.37, 0.11, 0.73), 0.0);
    float df = d.g * 0.625 + d.b * 0.25 + d.a * 0.125;
    float dm = mix(df, 1.0 - df, clamp(hf * 4.0, 0.0, 1.0));               // wispy bottoms, billowy tops
    return clamp(cRemap(base, dm * uCloudShape.w, 1.0, 0.0, 1.0), 0.0, 1.0) * uCloudLayer.w;
}

float cloudHG(float mu, float g) { float g2 = g * g; return 0.0795775 * (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * mu, 1.5); }

// distance along rd (from inside the sphere of radius r around c) to its far side
float cloudSphereExit(vec3 ro, vec3 rd, float r) {
    float b = dot(ro, rd), c = dot(ro, ro) - r * r;
    return -b + sqrt(max(b * b - c, 0.0));
}

// rgb = light scattered towards the eye, a = transmittance. sunCol: sunlight at cloud height.
vec4 cloudMarch(vec3 ro, vec3 rd, int steps, int lightSteps, float jitter, vec3 sunCol, vec3 ambTop, vec3 ambBottom, out float meanDist) {
    meanDist = 0.0;
    if (rd.y < -0.01 || uCloudLayer.z <= 0.001) return vec4(0.0, 0.0, 0.0, 1.0);
    vec3 oc = ro - vec3(ro.x, -CLOUD_RE, ro.z);
    float t0 = cloudSphereExit(oc, rd, CLOUD_RE + uCloudLayer.x);
    float t1 = cloudSphereExit(oc, rd, CLOUD_RE + uCloudLayer.y);
    t1 = min(t1, t0 + 20000.0);
    float dt = (t1 - t0) / float(steps);
    float t = t0 + dt * jitter;
    float mu = dot(rd, uSunDir);
    float thick = uCloudLayer.y - uCloudLayer.x;
    vec3 L = vec3(0.0);
    float T = 1.0, wsum = 0.0;
    for (int i = 0; i < 64; i++) {
        if (i >= steps || T < 0.01) break;
        vec3 p = ro + rd * t;
        float hf = (cloudAltitude(p) - uCloudLayer.x) / thick;
        float d = cloudDensity(p, hf, true);
        if (d > 0.001) {
            float sigma = d * CLOUD_SIGMA;
            float tau = 0.0, ls = thick * 0.035;
            for (int j = 0; j < 6; j++) {
                if (j >= lightSteps) break;
                vec3 pl = p + uSunDir * (ls * (float(j) + 0.5));
                tau += cloudDensity(pl, (cloudAltitude(pl) - uCloudLayer.x) / thick, false) * ls;
                ls *= 2.0;
            }
            tau *= CLOUD_SIGMA;
            float scat = 0.0, a = 1.0, b = 1.0, c = 1.0;
            for (int o = 0; o < 3; o++) {                                // multiple scattering octaves
                scat += a * exp(-b * tau) * mix(cloudHG(mu, 0.8 * c), cloudHG(mu, -0.25 * c), 0.3);
                a *= 0.5; b *= 0.45; c *= 0.5;
            }
            float powder = 1.0 - exp(-sigma * 120.0);                    // dark edges seen against the sun
            // light that has diffused down through the column above: in a thick layer this
            // falls off like 1/tau (diffusion), not exp(-tau), which keeps an overcast deck grey
            float tauCol = sigma * thick * (1.0 - hf) * 0.5;
            float diffuse = max(uSunDir.y, 0.03) * 0.8 / (1.0 + 0.11 * tauCol);
            vec3 sunGrey = mix(sunCol, vec3(dot(sunCol, vec3(0.2126, 0.7152, 0.0722))), 0.5);   // many bounces wash the colour out
            vec3 Ls = sunCol * (scat * mix(1.0, powder, 0.5) * 6.5 * 3.14159) + sunGrey * diffuse
                    + mix(ambBottom, ambTop * 1.6, clamp(hf * 1.3, 0.0, 1.0)) + vec3(uFlash * 6.0);
            float Ts = exp(-sigma * dt);
            float absorbed = T * (1.0 - Ts);
            L += Ls * absorbed;
            meanDist += t * absorbed; wsum += absorbed;
            T *= Ts;
        }
        t += dt;
    }
    meanDist = wsum > 0.0 ? meanDist / wsum : t1;
    return vec4(L, T);
}

// How much direct sun reaches point p through the clouds (soft: light scattered forward still arrives).
float cloudShadow(vec3 p) {
    if (uCloudLayer.z <= 0.001 || uSunDir.y < 0.01) return 1.0;
    float sy = max(uSunDir.y, 0.08);
    float tB = (uCloudLayer.x - p.y) / sy, tT = (uCloudLayer.y - p.y) / sy;
    float tau = 0.0, thick = uCloudLayer.y - uCloudLayer.x;
    for (int i = 0; i < 4; i++) {
        float f = (float(i) + 0.5) / 4.0;
        vec3 q = p + vec3(uSunDir.x, 0.0, uSunDir.z) / sy * (uCloudLayer.x + f * thick - p.y) + vec3(0.0, uCloudLayer.x + f * thick - p.y, 0.0);
        tau += cloudDensity(q, f, false);
    }
    tau *= (tT - tB) / 4.0 * CLOUD_SIGMA * 0.25;
    return mix(1.0, exp(-tau), 0.9);
}

//@@ cloud_noise.frag
// Tileable 3D noise for the clouds, one layer per draw: r = Perlin-Worley, gba = Worley octaves.
uniform float uLayer;          // z in [0, 1)
uniform float uSize;
out vec4 fragColor;
vec3 cHash3(vec3 p) {
    uvec3 q = uvec3(ivec3(p) + 4096);
    q = q * uvec3(1597334673u, 3812015801u, 2798796415u);
    q = (q.x ^ q.y ^ q.z) * uvec3(1597334673u, 3812015801u, 2798796415u);
    return vec3(q) * (1.0 / 4294967295.0);
}
float cWorley(vec3 p, float period) {
    vec3 id = floor(p), f = fract(p);
    float d = 1.0;
    for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 o = cHash3(mod(id + g, period));
        vec3 r = g + o - f;
        d = min(d, dot(r, r));
    }
    return 1.0 - clamp(sqrt(d), 0.0, 1.0);
}
float cPerlin(vec3 p, float period) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float r = 0.0;
    float v[8];
    for (int k = 0; k < 8; k++) {
        vec3 o = vec3(float(k & 1), float((k >> 1) & 1), float((k >> 2) & 1));
        vec3 g = normalize(cHash3(mod(i + o, period)) * 2.0 - 1.0);
        v[k] = dot(g, f - o);
    }
    return mix(mix(mix(v[0], v[1], u.x), mix(v[2], v[3], u.x), u.y), mix(mix(v[4], v[5], u.x), mix(v[6], v[7], u.x), u.y), u.z);
}
float cWorleyFbm(vec3 p, float freq) {
    return cWorley(p * freq, freq) * 0.625 + cWorley(p * freq * 2.0, freq * 2.0) * 0.25 + cWorley(p * freq * 4.0, freq * 4.0) * 0.125;
}
void main() {
    vec3 uvw = vec3(gl_FragCoord.xy / uSize, uLayer);
    float pf = 0.0, amp = 1.0, fr = 4.0, norm = 0.0;
    for (int o = 0; o < 6; o++) { pf += cPerlin(uvw * fr, fr) * amp; norm += amp; amp *= 0.5; fr *= 2.0; }
    pf = clamp(pf / norm * 0.9 + 0.5, 0.0, 1.0);
    float w1 = cWorleyFbm(uvw, 4.0), w2 = cWorleyFbm(uvw, 8.0), w3 = cWorleyFbm(uvw, 16.0);
    float pw = cRemap(pf, 0.0, 1.0, w1, 1.0);
    fragColor = vec4(pw, w1, w2, w3);
}

//@@ cloud_weather.frag
// Coverage and type variation over a 36 km tile.
uniform float uSize;
out vec4 fragColor;
vec2 wHash(vec2 p, float period) {
    uvec2 q = uvec2(ivec2(mod(p, period)) + 1024);
    q = q * uvec2(1597334673u, 3812015801u);
    uint n = (q.x ^ q.y) * 1597334673u;
    return vec2(uvec2(n, n * 48271u)) * (1.0 / 4294967295.0);
}
float wNoise(vec2 p, float period) {
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(wHash(i, period).x, wHash(i + vec2(1.0, 0.0), period).x, u.x), mix(wHash(i + vec2(0.0, 1.0), period).x, wHash(i + vec2(1.0, 1.0), period).x, u.x), u.y);
}
void main() {
    vec2 uv = gl_FragCoord.xy / uSize;
    float c = 0.0, a = 0.5, f = 6.0;
    for (int o = 0; o < 5; o++) { c += wNoise(uv * f, f) * a; a *= 0.5; f *= 2.0; }
    float t = wNoise(uv * 3.0 + 17.0, 3.0) * 0.7 + wNoise(uv * 9.0 + 5.0, 9.0) * 0.3;
    fragColor = vec4(c / 0.97, t, 0.0, 1.0);
}

//@@ cloud_pass.frag
// The cloud layer for the camera, at reduced resolution, blended with last frame's
// result (looked up by direction, so camera turns do not smear). The jitter changes
// every frame, so a few frames average out the ray-march noise.
in vec2 vUv;
in vec3 vAmbient;
uniform vec3 uCamRight, uCamUp, uCamFwd;
uniform vec2 uTanFov;
uniform sampler2D uCloudHistory;
uniform mat4 uPrevRot;                  // last frame's projection * rotation (no translation)
uniform float uHistory;                 // 0 = ignore history
uniform float uFrame;
uniform int uSteps;
uniform int uLightSteps;
uniform vec3 uCloudAmbBottom;
out vec4 fragColor;
void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec3 d = normalize(uCamFwd + uCamRight * ndc.x * uTanFov.x + uCamUp * ndc.y * uTanFov.y);
    float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy + uFrame * 5.588238, vec2(0.06711056, 0.00583715))));
    float md;
    vec4 c = cloudMarch(uCamPos, d, uSteps, uLightSteps, ign, uCloudSun, vAmbient, uCloudAmbBottom, md);
    // haze between the eye and the cloud
    float haze = 1.0 - exp(-md / mix(38000.0, 12000.0, clamp((uMieScale - 1.0) / 6.0, 0.0, 1.0)));
    c.rgb = mix(c.rgb, skyAtmosphere(d) * (1.0 - c.a), haze);
    vec4 pc = uPrevRot * vec4(d, 0.0);
    if (uHistory > 0.0 && pc.w > 1e-4) {
        vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
        if (puv.x > 0.0 && puv.y > 0.0 && puv.x < 1.0 && puv.y < 1.0) c = mix(c, texture(uCloudHistory, puv), uHistory);
    }
    fragColor = c;
}

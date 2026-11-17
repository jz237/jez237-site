//@@ atmosphere.glsl
// ---- physically based sky ----------------------------------------------------
// Hillaire 2020, "A Scalable and Production Ready Sky and Atmosphere Rendering
// Technique": transmittance LUT, multiple-scattering LUT, sky-view LUT.
// Earth-like constants; distances in km.
#define ATM_RB 6360.0
#define ATM_RT 6460.0
uniform float uMieScale;                // aerosols: 1 clear, 3 hazy, 8 murky
uniform sampler2D uTransLut;
uniform sampler2D uMultiLut;
const vec3 ATM_RAYLEIGH = vec3(5.802, 13.558, 33.1) * 1e-3;
const float ATM_MIE_SCATTER = 3.996e-3;
const float ATM_MIE_ABSORB = 4.40e-3;
const vec3 ATM_OZONE = vec3(0.650, 1.881, 0.085) * 1e-3;
const float ATM_MIE_G = 0.8;
const vec3 ATM_GROUND_ALBEDO = vec3(0.06);

void atmMedium(float h, out vec3 scR, out float scM, out vec3 ext) {
    float dR = exp(-h / 8.0);
    float dM = exp(-h / 1.2) * uMieScale;
    float dO = max(0.0, 1.0 - abs(h - 25.0) / 15.0);
    scR = ATM_RAYLEIGH * dR;
    scM = ATM_MIE_SCATTER * dM;
    ext = scR + vec3((ATM_MIE_SCATTER + ATM_MIE_ABSORB) * dM) + ATM_OZONE * dO;
}

// nearest positive distance to a sphere of radius r around the planet centre, -1 if none
float atmSphere(vec3 ro, vec3 rd, float r) {
    float b = dot(ro, rd), c = dot(ro, ro) - r * r, d = b * b - c;
    if (d < 0.0) return -1.0;
    d = sqrt(d);
    float t0 = -b - d, t1 = -b + d;
    if (t1 < 0.0) return -1.0;
    return t0 > 0.0 ? t0 : t1;
}

// Bruneton's parametrisation of the transmittance LUT
vec2 atmTransUv(float r, float mu) {
    float H = sqrt(ATM_RT * ATM_RT - ATM_RB * ATM_RB);
    float rho = sqrt(max(r * r - ATM_RB * ATM_RB, 0.0));
    float disc = r * r * (mu * mu - 1.0) + ATM_RT * ATM_RT;
    float d = max(-r * mu + sqrt(max(disc, 0.0)), 0.0);
    float dMin = ATM_RT - r, dMax = rho + H;
    return vec2((d - dMin) / (dMax - dMin), rho / H);
}
void atmTransParams(vec2 uv, out float r, out float mu) {
    float H = sqrt(ATM_RT * ATM_RT - ATM_RB * ATM_RB);
    float rho = H * uv.y;
    r = sqrt(rho * rho + ATM_RB * ATM_RB);
    float dMin = ATM_RT - r, dMax = rho + H;
    float d = dMin + uv.x * (dMax - dMin);
    mu = d == 0.0 ? 1.0 : clamp((H * H - rho * rho - d * d) / (2.0 * r * d), -1.0, 1.0);
}
vec3 atmTransmittance(float r, float mu) { return texture(uTransLut, atmTransUv(r, mu)).rgb; }
vec3 atmMulti(float r, float muS) {
    vec2 uv = vec2(muS * 0.5 + 0.5, (r - ATM_RB) / (ATM_RT - ATM_RB));
    uv = clamp(uv, vec2(0.5 / 32.0), vec2(1.0 - 0.5 / 32.0));
    return texture(uMultiLut, uv).rgb;
}
float atmRayleighPhase(float c) { return 0.0596831 * (1.0 + c * c); }
float atmMiePhase(float c) {                                   // Cornette-Shanks
    float g = ATM_MIE_G, g2 = g * g;
    return 0.1193662 * (1.0 - g2) * (1.0 + c * c) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * c, 1.5));
}

//@@ atm_transmittance.frag
in vec2 vUv;
out vec4 fragColor;
void main() {
    float r, mu;
    atmTransParams(vUv, r, mu);
    vec3 ro = vec3(0.0, r, 0.0), rd = vec3(sqrt(1.0 - mu * mu), mu, 0.0);
    float t = max(atmSphere(ro, rd, ATM_RT), 0.0);
    vec3 od = vec3(0.0), scR, ext;
    float scM, dt = t / 40.0;
    for (int i = 0; i < 40; i++) {
        vec3 p = ro + rd * ((float(i) + 0.5) * dt);
        atmMedium(length(p) - ATM_RB, scR, scM, ext);
        od += ext * dt;
    }
    fragColor = vec4(exp(-od), 1.0);
}

//@@ atm_multi.frag
// light scattered more than once, for a unit sun, as a function of height and sun angle
in vec2 vUv;
out vec4 fragColor;
void main() {
    float muS = vUv.x * 2.0 - 1.0;
    float r = ATM_RB + max(vUv.y, 0.002) * (ATM_RT - ATM_RB);
    vec3 sunDir = vec3(sqrt(max(1.0 - muS * muS, 0.0)), muS, 0.0);
    vec3 ro = vec3(0.0, r, 0.0);
    vec3 L2 = vec3(0.0), F = vec3(0.0), scR, ext;
    float scM;
    for (int i = 0; i < 8; i++) for (int j = 0; j < 8; j++) {
        float ct = 1.0 - 2.0 * (float(i) + 0.5) / 8.0, st = sqrt(1.0 - ct * ct), ph = 6.2831853 * (float(j) + 0.5) / 8.0;
        vec3 rd = vec3(st * cos(ph), ct, st * sin(ph));
        float tG = atmSphere(ro, rd, ATM_RB), tT = atmSphere(ro, rd, ATM_RT);
        float tMax = tG > 0.0 ? tG : tT;
        vec3 T = vec3(1.0), L = vec3(0.0), f = vec3(0.0);
        float dt = tMax / 20.0;
        for (int s = 0; s < 20; s++) {
            vec3 p = ro + rd * ((float(s) + 0.5) * dt);
            float pr = length(p);
            atmMedium(pr - ATM_RB, scR, scM, ext);
            vec3 sampleT = exp(-ext * dt);
            vec3 up = p / pr;
            float mu = dot(up, sunDir);
            float shadow = atmSphere(p, sunDir, ATM_RB) > 0.0 ? 0.0 : 1.0;
            vec3 scat = scR + vec3(scM);
            vec3 S = atmTransmittance(pr, mu) * shadow * scat * 0.0795775;     // isotropic phase 1 / 4 pi
            L += T * (S - S * sampleT) / ext;
            f += T * (scat - scat * sampleT) / ext;
            T *= sampleT;
        }
        if (tG > 0.0) {
            vec3 p = ro + rd * tG, up = normalize(p);
            float mu = dot(up, sunDir);
            L += T * atmTransmittance(ATM_RB, mu) * max(mu, 0.0) * ATM_GROUND_ALBEDO / 3.14159265;
        }
        L2 += L / 64.0;
        F += f / 64.0;
    }
    fragColor = vec4(L2 / max(vec3(1.0) - F, vec3(0.01)), 1.0);
}

//@@ atm_skyview.frag
// sky radiance seen from sea level, for a unit sun; u = azimuth from the sun, v = elevation (squeezed to the horizon)
in vec2 vUv;
out vec4 fragColor;
void main() {
    float az = vUv.x * 3.14159265;
    float v = vUv.y * 2.0 - 1.0;
    float el = sign(v) * v * v * 1.5707963;
    vec3 rd = vec3(cos(el) * cos(az), sin(el), cos(el) * sin(az));
    vec3 sunDir = vec3(sqrt(max(1.0 - uSunDir.y * uSunDir.y, 0.0)), uSunDir.y, 0.0);
    vec3 ro = vec3(0.0, ATM_RB + 0.002, 0.0);
    float tG = atmSphere(ro, rd, ATM_RB), tT = atmSphere(ro, rd, ATM_RT);
    float tMax = min(tG > 0.0 ? tG : tT, 400.0);
    float c = dot(rd, sunDir), pR = atmRayleighPhase(c), pM = atmMiePhase(c);
    vec3 T = vec3(1.0), L = vec3(0.0), scR, ext;
    float scM, t0 = 0.0;
    for (int s = 0; s < 32; s++) {
        float t1 = tMax * pow((float(s) + 1.0) / 32.0, 2.0);
        float dt = t1 - t0, t = t0 + 0.3 * dt;
        t0 = t1;
        vec3 p = ro + rd * t;
        float pr = length(p);
        atmMedium(pr - ATM_RB, scR, scM, ext);
        vec3 sampleT = exp(-ext * dt);
        float mu = dot(p / pr, sunDir);
        float shadow = atmSphere(p, sunDir, ATM_RB) > 0.0 ? 0.0 : 1.0;
        vec3 S = atmTransmittance(pr, mu) * shadow * (scR * pR + vec3(scM * pM)) + atmMulti(pr, mu) * (scR + vec3(scM));
        L += T * (S - S * sampleT) / ext;
        T *= sampleT;
    }
    fragColor = vec4(L, 1.0);
}

// ---- sky: atmosphere look-up table --------------------------------------------
uniform sampler2D uSkyLut;      // atm_skyview output (unit sun)
uniform vec3 uSunIllum;         // sun irradiance above the atmosphere
uniform vec3 uCloudSun;         // sunlight arriving at the cloud layer
uniform float uCloudCover;      // 0..1
uniform vec3 uDeepColor;        // what a ray that dives into the sea brings back
uniform vec3 uNightSky;         // star and moonlit-sky glow added at night

vec3 skyAtmosphere(vec3 v) {
    float el = asin(clamp(v.y, -1.0, 1.0));
    vec2 s = uSunDir.xz, h = v.xz;
    float sl = length(s), hl = length(h);
    float cosAz = (sl > 1e-4 && hl > 1e-4) ? dot(h, s) / (hl * sl) : 1.0;
    float az = acos(clamp(cosAz, -1.0, 1.0));
    float vv = sign(el) * sqrt(abs(el) / 1.5707963);
    vec3 L = decodeHDR(texture(uSkyLut, vec2(az / 3.14159265, vv * 0.5 + 0.5)).rgb) * uSunIllum;
    // under a closed deck the light left is diffuse and grey, brightest towards the horizon
    float deck = smoothstep(0.6, 1.0, uCloudCover);
    vec3 grey = vec3(dot(L, vec3(0.2126, 0.7152, 0.0722)));
    L = mix(L, mix(L, grey, 0.75) * mix(0.62, 0.3, saturate(v.y * 3.0)), deck);
    return L + uNightSky * (0.4 + 0.6 * max(v.y, 0.0));
}

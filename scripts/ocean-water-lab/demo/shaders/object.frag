in vec3 vWorld;
in vec3 vNormal;
in vec3 vLocal;
in vec3 vLocalNormal;
in vec2 vAux;
uniform int uKind;           // 0 crate, 1 barrel, 2 buoy, 3 raft, 4 lighthouse, 5 palm trunk, 6 palm frond, 7 boat, 8 iron, 9 sail, 10 ship
uniform vec3 uTint;
uniform vec3 uScale;
uniform float uSeed;
out vec4 fragColor;

vec3 planks(vec2 uv, vec2 halfSize, float width, vec3 wood, float frame) {
    float x = uv.x / width;
    float id = floor(x);
    float g = abs(fract(x) - 0.5) * 2.0;
    float gap = smoothstep(0.90, 0.99, g);
    float tone = 0.78 + 0.34 * hash21(vec2(id, uSeed));
    float grain = fbm(vec2(uv.x * 55.0, uv.y * 4.0 + id * 7.0), 3);
    vec3 c = wood * tone * (0.82 + 0.36 * grain) * (1.0 - 0.7 * gap);
    if (frame > 0.0) {
        vec2 e = halfSize - abs(uv);
        float f = 1.0 - smoothstep(frame - 0.008, frame, min(e.x, e.y));
        float grain2 = fbm(vec2(uv.y * 5.0, uv.x * 50.0) + 31.0, 3);
        c = mix(c, wood * 0.62 * (0.8 + 0.4 * grain2), f);
    }
    return c;
}

void main() {
    vec3 N = normalize(vNormal);
    vec3 l = vLocal;
    vec3 an = abs(normalize(vLocalNormal));
    vec3 albedo = uTint;
    vec3 emissive = vec3(0.0);
    float rough = 0.75, wetDark = 0.6;
    if (uKind == 0 || uKind == 3) {
        vec2 uv, hs;
        if (an.x > an.y && an.x > an.z) { uv = l.zy; hs = uScale.zy; }
        else if (an.y > an.z) { uv = l.zx; hs = uScale.zx; }
        else { uv = l.xy; hs = uScale.xy; }
        albedo = planks(uv, hs * 0.5, uKind == 0 ? 0.17 : 0.24, uTint, uKind == 0 ? 0.10 : 0.0);
        wetDark = 0.5;
    } else if (uKind == 1) {
        float y = abs(l.y) / (uScale.y * 0.5);
        float hoop = smoothstep(0.035, 0.02, abs(y - 0.36)) + smoothstep(0.035, 0.02, abs(y - 0.86));
        float streak = fbm(vec2(atan(l.z, l.x) * 6.0, l.y * 3.0) + uSeed, 3);
        albedo = mix(uTint * (0.75 + 0.4 * streak), vec3(0.16, 0.15, 0.15), saturate(hoop));
        rough = mix(0.5, 0.35, saturate(hoop));
        wetDark = 0.8;
    } else if (uKind == 2) {
        float band = step(0.5, fract(l.y / 0.62 + 0.15));
        albedo = mix(vec3(0.82, 0.80, 0.76), uTint, band);
        float lamp = step(uScale.y * 0.5 - 0.17, l.y);
        albedo = mix(albedo, vec3(0.05), lamp);
        emissive = vec3(1.0, 0.75, 0.25) * (lamp * 14.0 * step(0.72, fract(uTime * 0.45 + uSeed)));
        rough = 0.4; wetDark = 0.85;
    } else if (uKind == 5) {
        float ring = smoothstep(0.30, 0.48, abs(fract(l.y * 3.1 + 0.3 * fbm(l.xz * 9.0, 2)) - 0.5));
        float grain = fbm(vec2(atan(l.z, l.x) * 3.0, l.y * 10.0) + uSeed, 3);
        albedo = mix(vec3(0.36, 0.30, 0.22), vec3(0.20, 0.16, 0.12), ring) * (0.75 + 0.45 * grain);
        rough = 0.9; wetDark = 0.7;
    } else if (uKind == 6) {
        float t = vAux.x, s = vAux.y, as = abs(s);
        // leaflets: diagonal strips either side of the midrib, cut out between
        float g = fract(t * 24.0 - as * 2.4);
        if (as > 0.07 && (g > 0.58 || as > 1.0 - 0.15 * t)) discard;
        if (dot(N, uCamPos - vWorld) < 0.0) N = -N;
        float tone = hash21(vec2(floor(t * 24.0 - as * 2.4), uSeed + sign(s)));
        albedo = mix(vec3(0.07, 0.20, 0.04), vec3(0.24, 0.36, 0.08), 0.35 * as + 0.4 * tone + 0.3 * t);
        albedo = mix(albedo, vec3(0.40, 0.36, 0.14), step(as, 0.07));
        float backlit = pow(saturate(dot(normalize(vWorld - uCamPos), uSunDir)), 3.0);
        emissive = albedo * uSunColor * (0.35 * backlit) * sunVisibility(vWorld);     // light through the leaves
        rough = 0.6; wetDark = 0.9;
    } else if (uKind == 8) {
        albedo = vec3(0.04); rough = 0.35; wetDark = 1.0;
    } else if (uKind == 9) {
        float u = vAux.x, v = vAux.y;
        if (dot(N, uCamPos - vWorld) < 0.0) N = -N;
        if (v > 1.5) {                                                // black flag
            albedo = vec3(0.02);
            float skull = smoothstep(0.17, 0.15, length((vec2(u, v - 2.0) - vec2(0.3, 0.42)) * vec2(1.0, 1.4)));
            float bones = smoothstep(0.035, 0.02, abs((u - 0.3) - (v - 2.42) * 0.9)) + smoothstep(0.035, 0.02, abs((u - 0.3) + (v - 2.42) * 0.9));
            albedo = mix(albedo, vec3(0.85), saturate(skull + bones * step(abs(u - 0.3), 0.22)));
            rough = 0.9;
        } else {
            // weathered canvas: seams, patches, darker where it is stained
            float seam = smoothstep(0.9, 0.97, abs(fract(u * 9.0) - 0.5) * 2.0);
            float stain = fbm(vec2(u * 3.0, v * 4.0) + uSeed, 3);
            albedo = vec3(0.78, 0.72, 0.6) * (0.75 + 0.35 * stain) * (1.0 - 0.18 * seam);
            float backlit = pow(saturate(dot(normalize(vWorld - uCamPos), uSunDir)), 2.0);
            emissive = albedo * uSunColor * (0.3 * backlit) * sunVisibility(vWorld);
            rough = 0.95; wetDark = 0.9;
        }
    } else if (uKind == 10) {
        int part = int(vAux.x + 0.5);
        float plank = smoothstep(0.86, 0.97, abs(fract(l.y * 3.4) - 0.5) * 2.0);
        float grain = fbm(vec2(l.x * 1.3, floor(l.y * 3.4) * 7.1 + uSeed), 3);
        if (part == 0 || part == 5) {                                // dark oiled planking, a painted band, gun ports
            albedo = vec3(0.17, 0.10, 0.06) * (0.75 + 0.5 * grain) * (1.0 - 0.45 * plank);
            float band = smoothstep(0.04, 0.0, abs(l.y - 0.55) - 0.22);
            albedo = mix(albedo, vec3(0.42, 0.06, 0.04) * (0.8 + 0.3 * grain), band * float(part == 0));
            vec2 gp = vec2(fract((l.x + 7.5) / 3.0), (l.y - 0.55) / 0.42);
            float port = step(abs(gp.x - 0.5), 0.14) * step(abs(gp.y), 0.42) * step(abs(l.x), 7.6) * float(part == 0);
            albedo = mix(albedo, vec3(0.01), port);
            if (part == 5) {                                          // stern gallery windows glow at dusk
                float win = step(abs(fract(l.z * 0.9) - 0.5), 0.2) * step(abs(fract(l.y * 1.1) - 0.5), 0.22) * step(abs(l.x + 12.2), 0.15);
                albedo = mix(albedo, vec3(0.05, 0.05, 0.04), win);
                emissive = vec3(1.0, 0.62, 0.28) * win * 1.1 * smoothstep(6.0, -6.0, degrees(asin(uSunDir.y)));
            }
            rough = 0.7; wetDark = 0.75;
        } else if (part == 1) {
            float dp = smoothstep(0.9, 0.98, abs(fract(l.z * 4.5) - 0.5) * 2.0);
            albedo = vec3(0.45, 0.33, 0.20) * (0.75 + 0.4 * fbm(vec2(l.x * 0.8, floor(l.z * 4.5) * 3.7), 3)) * (1.0 - 0.5 * dp);
            rough = 0.85;
        } else if (part == 2) {
            albedo = vec3(0.55, 0.40, 0.12); rough = 0.4;           // gilded rail
        } else {
            albedo = vec3(0.30, 0.21, 0.12) * (0.8 + 0.3 * grain); rough = 0.8;
        }
    } else if (uKind == 7) {
        int part = int(vAux.x + 0.5);
        if (part == 0) {                                     // hull: white, a stripe, antifouling below the waterline
            float stripe = smoothstep(0.02, 0.0, abs(l.y - 0.22) - 0.05);
            albedo = mix(vec3(0.86, 0.87, 0.88), vec3(0.04, 0.16, 0.42), stripe);
            albedo = mix(albedo, vec3(0.45, 0.07, 0.05), step(l.y, -0.18));
            rough = 0.25; wetDark = 0.95;
        } else if (part == 1) {                              // teak deck
            float plank = smoothstep(0.9, 0.98, abs(fract(l.z * 9.0) - 0.5) * 2.0);
            albedo = vec3(0.50, 0.34, 0.20) * (0.8 + 0.3 * fbm(vec2(l.x * 4.0, floor(l.z * 9.0) * 3.1), 3)) * (1.0 - 0.6 * plank);
            rough = 0.7;
        } else if (part == 2) {                              // windscreen
            albedo = vec3(0.02, 0.03, 0.035); rough = 0.06;
        } else if (part == 3) {                              // upholstery
            albedo = vec3(0.80, 0.76, 0.68); rough = 0.8;
        } else {                                             // outboard
            albedo = vec3(0.03); rough = 0.3;
        }
    } else {
        float hgt = l.y / uScale.y + 0.5;
        float band = step(0.5, fract(hgt * 2.6 + 0.2));
        albedo = mix(vec3(0.86, 0.85, 0.82), vec3(0.70, 0.10, 0.07), band * step(hgt, 0.80));
        float lantern = step(0.82, hgt) * step(hgt, 0.93);
        albedo = mix(albedo, vec3(0.05, 0.06, 0.07), lantern);
        albedo = mix(albedo, vec3(0.25, 0.08, 0.06), step(0.93, hgt));
        emissive = vec3(1.0, 0.82, 0.45) * (lantern * 6.0 * pow(saturate(dot(N, vec3(cos(uTime * 0.8), 0.0, sin(uTime * 0.8)))), 6.0));
        rough = 0.6; wetDark = 0.9;
    }
    vec3 col = shadeOpaque(albedo, N, vWorld, rough, wetDark, emissive);
    fragColor = vec4(encodeHDR(col), 1.0);
}

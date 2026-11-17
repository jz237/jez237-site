in vec3 vWorld;
out vec4 fragColor;
void main() {
    vec2 p = vWorld.xz;
    float e = 0.6;
    float h = terrainHeight(p) + uTide;                 // zones follow the land, not the tide
    float hx = terrainHeight(p + vec2(e, 0.0)) + uTide, hz = terrainHeight(p + vec2(0.0, e)) + uTide;
    // large shape plus dune ripples and rock grain
    float bump = fbm(p * 0.35, 4);
    float bx = fbm((p + vec2(0.3, 0.0)) * 0.35, 4), bz = fbm((p + vec2(0.0, 0.3)) * 0.35, 4);
    float landAmt = smoothstep(1.5, 6.0, h);
    float bumpAmp = mix(0.10, 0.9, landAmt);
    vec3 N = normalize(vec3((h - hx) / e + (bump - bx) * bumpAmp / 0.3, 1.0, (h - hz) / e + (bump - bz) * bumpAmp / 0.3));

    float n1 = fbm(p * 0.06, 4), n2 = fbm(p * 0.9, 3);
    float n3 = fbm(p * 4.0, 3);
    vec3 sand = vec3(0.66, 0.57, 0.42) * (0.84 + 0.2 * n2 + 0.12 * n3);
    vec3 scrub = mix(vec3(0.13, 0.21, 0.07), vec3(0.34, 0.35, 0.15), n2) * (0.7 + 0.6 * n3);
    vec3 rock = vec3(0.34, 0.32, 0.30) * (0.7 + 0.6 * n2);
    float scrubAmt = smoothstep(2.4, 5.5, h + (n1 - 0.5) * 5.0);
    float rockAmt = smoothstep(0.42, 0.62, 1.0 - N.y + (n1 - 0.5) * 0.2) * smoothstep(3.0, 9.0, h);
    vec3 albedo = mix(mix(sand, scrub, scrubAmt), rock, rockAmt);
    // sea bed: sand with patches of weed and stone
    float bed = smoothstep(-1.5, -5.0, h);
    float weed = smoothstep(0.5, 0.66, fbm(p * 0.045 + 7.0, 4)) * bed;
    albedo = mix(albedo, vec3(0.10, 0.17, 0.11) * (0.6 + 0.8 * n2), weed * 0.85);
    // rocky reef patches in the shallows: dark stone with a weedy cap
    float reefN = fbm(p * 0.07 + 13.0, 4);
    float reef = smoothstep(0.60, 0.68, reefN) * smoothstep(-0.6, -2.0, h) * (1.0 - smoothstep(-9.0, -14.0, h));
    vec3 stone = mix(vec3(0.20, 0.21, 0.19), vec3(0.17, 0.24, 0.12), smoothstep(0.4, 0.7, n2)) * (0.65 + 0.6 * n3);
    albedo = mix(albedo, stone, reef);
    N = normalize(N + vec3(bx - bump, 0.0, bz - bump) * reef * 6.0);

    vec3 col = shadeOpaque(albedo, N, vWorld, 0.85, 0.55, vec3(0.0));
    fragColor = vec4(encodeHDR(col), 1.0);
}

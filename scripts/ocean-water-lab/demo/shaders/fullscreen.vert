// one triangle that covers the screen
out vec2 vUv;
out vec3 vAmbient;
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    vUv = p;
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
#ifdef WITH_SKY
    // ambient light on the clouds: a blend of zenith and anti-solar sky, once per frame
    vAmbient = skyAtmosphere(vec3(0.0, 1.0, 0.0)) * 1.4 + skyAtmosphere(normalize(vec3(-uSunDir.x, 0.35, -uSunDir.z))) * 0.8;
#else
    vAmbient = vec3(0.0);
#endif
}

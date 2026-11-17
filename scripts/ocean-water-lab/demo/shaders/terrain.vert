layout(location = 0) in vec3 aPos;
uniform mat4 uViewProj;
uniform float uTide;
out vec3 vWorld;
void main() {
    vec3 p = aPos - vec3(0.0, uTide, 0.0);     // the mesh is built at mean sea level
    vWorld = p;
    gl_Position = uViewProj * vec4(p, 1.0);
}

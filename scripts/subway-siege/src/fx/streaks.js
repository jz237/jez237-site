import * as T from "three";

// Camera-facing capsules stretched along their motion: energy bolts with a
// white-hot core, enemy plasma orbs, velocity-streaked sparks, lens flares and
// the jagged links of third-rail arcs. One instanced draw for all of them.
export const KIND = { bolt: 0, orb: 1, spark: 2, flare: 3, arc: 4 };

const vert = /* glsl */ `
attribute vec2 corner;
attribute vec3 iPos;
attribute vec4 iDir; // xyz = head - tail, w = half width
attribute vec4 iCol; // rgb (HDR), alpha
attribute vec2 iKind; // kind, seed
varying vec2 vSt;
varying float vHalf;
varying float vW;
varying vec4 vCol;
varying vec2 vKind;
void main() {
  vec4 head = viewMatrix * vec4(iPos, 1.0);
  vec4 tail = viewMatrix * vec4(iPos - iDir.xyz, 1.0);
  vec2 d = head.xy - tail.xy;
  float len = length(d);
  vec2 ax = len > 1e-5 ? d / len : vec2(0.0, 1.0);
  vec2 pe = vec2(-ax.y, ax.x);
  float w = iDir.w;
  vec3 c = mix(tail.xyz, head.xyz, corner.x * 0.5 + 0.5);
  c.xy += ax * corner.x * w + pe * corner.y * w;
  vSt = vec2(corner.x * (len * 0.5 + w), corner.y * w);
  vHalf = len * 0.5;
  vW = w;
  vCol = iCol;
  vKind = iKind;
  gl_Position = projectionMatrix * vec4(c, 1.0);
}`;
const frag = /* glsl */ `
uniform float time;
varying vec2 vSt;
varying float vHalf;
varying float vW;
varying vec4 vCol;
varying vec2 vKind;
void main() {
  float dx = max(abs(vSt.x) - vHalf, 0.0);
  float dn = length(vec2(dx, vSt.y)) / vW;
  if (dn >= 1.0) discard;
  float along = clamp(vSt.x / (vHalf + vW) * 0.5 + 0.5, 0.0, 1.0);
  float edge = 1.0 - dn;
  int kind = int(vKind.x + 0.5);
  float seed = vKind.y;
  vec3 col = vCol.rgb;
  vec3 o;
  if (kind == 0) {
    float core = exp(-dn * dn * 22.0);
    float halo = exp(-dn * dn * 3.2) * edge;
    float fade = mix(0.12, 1.0, pow(along, 0.8));
    o = (col * halo + vec3(1.0) * core * 1.8 * mix(0.35, 1.0, along)) * fade;
  } else if (kind == 1) {
    float pulse = 0.75 + 0.25 * sin(time * 19.0 + seed * 40.0);
    float core = exp(-dn * dn * 14.0);
    float ring = exp(-pow((dn - 0.58) / 0.11, 2.0));
    float halo = exp(-dn * dn * 3.0) * edge;
    o = col * (halo * 0.7 + ring * pulse) + vec3(1.0, 0.92, 0.82) * core * 1.6;
  } else if (kind == 2) {
    float core = exp(-dn * dn * 6.0) * edge;
    o = col * core * mix(0.08, 1.0, along * along);
  } else if (kind == 3) {
    o = col * (exp(-dn * dn * 7.0) * 1.4 + exp(-dn * 3.5) * 0.35) * edge;
  } else {
    float flick = step(0.28, fract(sin(seed * 91.7 + floor(time * 38.0) * 13.1) * 43758.5453));
    float core = exp(-dn * dn * 9.0) * edge;
    o = (col * core + vec3(1.0) * exp(-dn * dn * 40.0) * 1.5) * flick;
  }
  gl_FragColor = vec4(o * vCol.a, 1.0);
}`;

export class Streaks {
  constructor(capacity) {
    this.capacity = capacity;
    this.count = 0;
    const g = new T.InstancedBufferGeometry();
    g.setAttribute(
      "corner",
      new T.BufferAttribute(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2),
    );
    g.setIndex([0, 1, 2, 0, 2, 3]);
    // three.js wants a position attribute to size the draw; corners carry the shape.
    g.setAttribute(
      "position",
      new T.BufferAttribute(new Float32Array(12), 3),
    );
    this.pos = new Float32Array(capacity * 3);
    this.dir = new Float32Array(capacity * 4);
    this.col = new Float32Array(capacity * 4);
    this.kind = new Float32Array(capacity * 2);
    this.attrs = [
      ["iPos", this.pos, 3],
      ["iDir", this.dir, 4],
      ["iCol", this.col, 4],
      ["iKind", this.kind, 2],
    ].map(([name, arr, n]) => {
      const a = new T.InstancedBufferAttribute(arr, n).setUsage(
        T.DynamicDrawUsage,
      );
      g.setAttribute(name, a);
      return a;
    });
    this.geometry = g;
    this.uniforms = { time: { value: 0 } };
    this.mesh = new T.Mesh(
      g,
      new T.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
      }),
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 8;
    this.mesh.layers.enable(1);
  }
  begin(time) {
    this.count = 0;
    this.uniforms.time.value = time;
  }
  // Head at (x,y,z); the tail trails back by (dx,dy,dz).
  push(x, y, z, dx, dy, dz, halfWidth, r, g, b, alpha, kind, seed = 0) {
    if (this.count >= this.capacity) return;
    const i = this.count++;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.dir[i * 4] = dx;
    this.dir[i * 4 + 1] = dy;
    this.dir[i * 4 + 2] = dz;
    this.dir[i * 4 + 3] = halfWidth;
    this.col[i * 4] = r;
    this.col[i * 4 + 1] = g;
    this.col[i * 4 + 2] = b;
    this.col[i * 4 + 3] = alpha;
    this.kind[i * 2] = kind;
    this.kind[i * 2 + 1] = seed;
  }
  end() {
    this.geometry.instanceCount = this.count;
    for (const a of this.attrs) {
      a.clearUpdateRanges();
      a.addUpdateRange(0, this.count * a.itemSize);
      a.needsUpdate = true;
    }
  }
}

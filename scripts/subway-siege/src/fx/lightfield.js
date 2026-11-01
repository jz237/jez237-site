import * as T from "three";

// Every bolt, engine, blast and arc is splatted into a top-down irradiance map
// each frame. All lit materials sample it at their world position, so hundreds
// of moving lights cost one small pass instead of hundreds of shader lights.
// The same map drives the volumetric haze, the dust and the lit smoke.
export const FIELD = { minX: -17, minZ: -60, sizeX: 34, sizeZ: 80 };
export const fieldUniforms = {
  lfTex: { value: null },
  lfRect: {
    value: new T.Vector4(FIELD.minX, FIELD.minZ, FIELD.sizeX, FIELD.sizeZ),
  },
  lfGain: { value: 1 },
};
export const FIELD_GLSL = /* glsl */ `
uniform sampler2D lfTex;
uniform vec4 lfRect;
uniform float lfGain;
vec2 lfUv(vec3 w) { return (w.xz - lfRect.xy) / lfRect.zw; }
vec3 lfSample(vec3 w, float lod) {
  vec2 uv = lfUv(w);
  vec2 edge = smoothstep(0.0, 0.03, uv) * smoothstep(1.0, 0.97, uv);
  return textureLod(lfTex, uv, lod).rgb * edge.x * edge.y * lfGain;
}`;

// Inject into every MeshStandard/MeshPhysical material (prototype hook).
export function installFieldLighting() {
  const proto = T.MeshStandardMaterial.prototype;
  if (proto.__lf) return;
  proto.__lf = true;
  proto.onBeforeCompile = function (shader) {
    patchLitShader(shader);
  };
  proto.customProgramCacheKey = function () {
    return "lf1";
  };
}
export function patchLitShader(shader) {
  Object.assign(shader.uniforms, fieldUniforms);
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vLfWorld;",
    )
    .replace(
      "#include <project_vertex>",
      `#include <project_vertex>
      vec4 lfW = vec4(transformed, 1.0);
      #ifdef USE_BATCHING
        lfW = batchingMatrix * lfW;
      #endif
      #ifdef USE_INSTANCING
        lfW = instanceMatrix * lfW;
      #endif
      vLfWorld = (modelMatrix * lfW).xyz;`,
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>\nvarying vec3 vLfWorld;\n${FIELD_GLSL}`,
    )
    .replace(
      "#include <lights_fragment_end>",
      `#include <lights_fragment_end>
      {
        vec3 lfN = inverseTransformDirection(normal, viewMatrix);
        float facing = clamp(0.5 + 0.5 * lfN.y, 0.08, 1.0);
        float lift = max(vLfWorld.y - 0.9, 0.0);
        float height = 1.0 / (1.0 + 0.11 * lift * lift);
        vec3 lf = lfSample(vLfWorld, 0.0) * facing * height;
        reflectedLight.indirectDiffuse += lf * material.diffuseContribution;
        vec3 f0 = mix(vec3(0.04), material.diffuseColor, material.metalness);
        float gloss = 1.0 - material.roughness;
        reflectedLight.indirectSpecular += lf * f0 * (0.25 + 1.1 * gloss * gloss);
      }`,
    );
}

const splatVert = /* glsl */ `
attribute vec4 iA; // x, z, radius, angle
attribute vec4 iB; // rgb intensity, kind (0 point, 1 ring)
attribute vec2 iC; // stretch, shape (point: height ratio, ring: radius ratio)
uniform vec4 lfRect;
varying vec2 vLocal;
varying vec3 vColor;
varying float vKind;
varying float vShape;
varying float vStretch;
void main() {
  vLocal = position.xy;
  vColor = iB.rgb;
  vKind = iB.a;
  vShape = iC.y;
  vStretch = iC.x;
  vec2 l = position.xy * vec2(iA.z * iC.x, iA.z);
  float c = cos(iA.w), s = sin(iA.w);
  vec2 w = iA.xy + vec2(c * l.x - s * l.y, s * l.x + c * l.y);
  gl_Position = vec4((w - lfRect.xy) / lfRect.zw * 2.0 - 1.0, 0.0, 1.0);
}`;
const splatFrag = /* glsl */ `
varying vec2 vLocal;
varying vec3 vColor;
varying float vKind;
varying float vShape;
varying float vStretch;
void main() {
  float d2 = dot(vLocal, vLocal);
  if (d2 > 1.0) discard;
  float win = 1.0 - d2;
  win *= win;
  float e;
  if (vKind < 0.5) {
    float h2 = vShape * vShape;
    e = 0.78 * pow(h2 / (d2 + h2), 1.5) * win + 0.22 * win;
  } else {
    float d = sqrt(d2);
    float t = (d - vShape) / 0.09;
    e = exp(-t * t) + 0.25 * smoothstep(vShape, 0.0, d) * win;
  }
  gl_FragColor = vec4(vColor * e, 1.0);
}`;

export class LightField {
  constructor(renderer, capacity = 1400) {
    this.renderer = renderer;
    this.capacity = capacity;
    this.count = 0;
    const g = new T.InstancedBufferGeometry();
    const plane = new T.PlaneGeometry(2, 2);
    g.index = plane.index;
    g.setAttribute("position", plane.getAttribute("position"));
    this.a = new Float32Array(capacity * 4);
    this.b = new Float32Array(capacity * 4);
    this.c = new Float32Array(capacity * 2);
    for (const [name, arr, n] of [
      ["iA", this.a, 4],
      ["iB", this.b, 4],
      ["iC", this.c, 2],
    ])
      g.setAttribute(
        name,
        new T.InstancedBufferAttribute(arr, n).setUsage(T.DynamicDrawUsage),
      );
    this.geometry = g;
    this.mesh = new T.Mesh(
      g,
      new T.ShaderMaterial({
        uniforms: { lfRect: fieldUniforms.lfRect },
        vertexShader: splatVert,
        fragmentShader: splatFrag,
        blending: T.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
      }),
    );
    this.mesh.frustumCulled = false;
    this.scene = new T.Scene();
    this.scene.add(this.mesh);
    this.camera = new T.Camera();
    this.flashes = [];
    this.setResolution(1);
  }
  setResolution(scale) {
    const w = Math.round(200 * scale),
      h = Math.round((w * FIELD.sizeZ) / FIELD.sizeX);
    this.target?.dispose();
    this.target = new T.WebGLRenderTarget(w, h, {
      type: T.HalfFloatType,
      generateMipmaps: true,
      minFilter: T.LinearMipmapLinearFilter,
      magFilter: T.LinearFilter,
      depthBuffer: false,
    });
    fieldUniforms.lfTex.value = this.target.texture;
  }
  begin() {
    this.count = 0;
  }
  // Point light on the floor. Stretch elongates it along `angle` (radians, 0 = +x).
  add(x, z, color, intensity, radius, stretch = 1, angle = 0, height = 0.35) {
    if (this.count >= this.capacity || intensity <= 0.001) return;
    const i = this.count++,
      a = this.a,
      b = this.b,
      c = this.c;
    a[i * 4] = x;
    a[i * 4 + 1] = z;
    a[i * 4 + 2] = radius;
    a[i * 4 + 3] = angle;
    b[i * 4] = color.r * intensity;
    b[i * 4 + 1] = color.g * intensity;
    b[i * 4 + 2] = color.b * intensity;
    b[i * 4 + 3] = 0;
    c[i * 2] = stretch;
    c[i * 2 + 1] = height;
  }
  ring(x, z, color, intensity, radius, at = 0.8) {
    this.add(x, z, color, intensity, radius, 1, 0, at);
    if (this.count) this.b[(this.count - 1) * 4 + 3] = 1;
  }
  // A light that decays on its own: muzzle flashes, impacts, explosions.
  flash(x, z, color, intensity, radius, decay = 8, drift = 0) {
    this.flashes.push({
      x,
      z,
      r: color.r,
      g: color.g,
      b: color.b,
      intensity,
      radius,
      decay,
      drift,
      t: 0,
    });
    if (this.flashes.length > 160) this.flashes.shift();
  }
  updateFlashes(dt, scroll) {
    const c = this.tmp || (this.tmp = new T.Color());
    this.flashes = this.flashes.filter((f) => {
      f.t += dt;
      f.z += scroll * dt * f.drift;
      const k = f.intensity * Math.exp(-f.t * f.decay);
      if (k < 0.02) return false;
      c.setRGB(f.r, f.g, f.b);
      this.add(f.x, f.z, c, k, f.radius * (1 + f.t * 0.6));
      return true;
    });
  }
  render() {
    const g = this.geometry;
    g.instanceCount = this.count;
    for (const name of ["iA", "iB", "iC"]) {
      const attr = g.getAttribute(name);
      attr.clearUpdateRanges();
      attr.addUpdateRange(0, this.count * attr.itemSize);
      attr.needsUpdate = true;
    }
    const r = this.renderer,
      prev = r.getRenderTarget(),
      clear = r.getClearColor(this.clearTmp || (this.clearTmp = new T.Color())),
      alpha = r.getClearAlpha();
    r.setRenderTarget(this.target);
    r.setClearColor(0x000000, 1);
    r.clear(true, false, false);
    if (this.count) r.render(this.scene, this.camera);
    r.setRenderTarget(prev);
    r.setClearColor(clear, alpha);
  }
}

// Layers of drifting mist that glow wherever the light field is bright.
export function makeHaze(layers) {
  const group = new T.Group();
  const material = (y, density) =>
    new T.ShaderMaterial({
      uniforms: {
        ...fieldUniforms,
        time: { value: 0 },
        scroll: { value: 0 },
        tint: { value: new T.Color(0x64dbcd) },
        density: { value: density },
        layerY: { value: y },
      },
      vertexShader: /* glsl */ `
        varying vec3 vW;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${FIELD_GLSL}
        uniform float time, scroll, density, layerY;
        uniform vec3 tint;
        varying vec3 vW;
        float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.0), f.x), f.y);
        }
        void main() {
          vec2 p = vW.xz * vec2(0.22, 0.16) + vec2(layerY * 3.1, -scroll * 0.16);
          float m = n(p + vec2(time * 0.05, 0.0)) * 0.6 + n(p * 2.3 - vec2(0.0, time * 0.08)) * 0.4;
          m = 0.35 + 0.9 * m * m;
          vec3 lf = lfSample(vW, 2.2) + 0.5 * lfSample(vW, 4.0);
          lf /= 1.0 + dot(lf, vec3(0.33)) * 0.06;
          float wall = smoothstep(12.5, 8.0, abs(vW.x));
          vec3 c = (lf * 0.04 + tint * 0.0025) * m * density * wall;
          gl_FragColor = vec4(c, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      fog: false,
    });
  const heights = [0.75, 1.9, 3.3].slice(0, layers);
  for (const [i, y] of heights.entries()) {
    const m = new T.Mesh(
      new T.PlaneGeometry(26, 78),
      material(y, i === 0 ? 1.15 : 0.9),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, y, -21);
    m.renderOrder = 5;
    group.add(m);
  }
  group.update = (t, scroll, tint) => {
    for (const m of group.children) {
      m.material.uniforms.time.value = t;
      m.material.uniforms.scroll.value = scroll;
      m.material.uniforms.tint.value.copy(tint);
    }
  };
  return group;
}

// Floating motes: dim by default, they sparkle when a bolt passes.
export function makeDust(count) {
  const g = new T.BufferGeometry(),
    pos = new Float32Array(count * 3),
    seed = new Float32Array(count);
  let s = 17;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() * 2 - 1) * 13;
    pos[i * 3 + 1] = 0.15 + rnd() * rnd() * 5;
    pos[i * 3 + 2] = -58 + rnd() * 74;
    seed[i] = rnd();
  }
  g.setAttribute("position", new T.BufferAttribute(pos, 3));
  g.setAttribute("seed", new T.BufferAttribute(seed, 1));
  const points = new T.Points(
    g,
    new T.ShaderMaterial({
      uniforms: {
        ...fieldUniforms,
        time: { value: 0 },
        scroll: { value: 0 },
        pixelScale: { value: 20 },
        tint: { value: new T.Color(0xb6d8cc) },
      },
      vertexShader: /* glsl */ `
        ${FIELD_GLSL}
        attribute float seed;
        uniform float time, scroll, pixelScale;
        uniform vec3 tint;
        varying vec3 vC;
        void main() {
          vec3 p = position;
          p.z = mod(p.z + scroll + 58.0, 74.0) - 58.0;
          p.x += sin(time * (0.2 + seed * 0.3) + seed * 40.0) * 0.4;
          p.y += sin(time * (0.15 + seed * 0.2) + seed * 17.0) * 0.25;
          vec3 lf = lfSample(p, 1.0);
          float tw = 0.6 + 0.4 * sin(time * (2.0 + seed * 5.0) + seed * 90.0);
          vC = (tint * 0.07 + lf * 0.12) * tw;
          vec4 mv = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((0.025 + seed * 0.03) * pixelScale, 1.0, 6.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vC;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          if (r > 1.0) discard;
          gl_FragColor = vec4(vC * (1.0 - r * r), 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  );
  points.frustumCulled = false;
  return points;
}

import * as T from "three";
import { FIELD_GLSL, fieldUniforms } from "./lightfield.js";

// Fireballs that cool through the blackbody ramp into smoke, and the smoke
// itself, lit by whatever is glowing nearby (the light field). Puffs live in
// the tunnel's frame, so they stream past as the line keeps moving.
const NOISE = /* glsl */ `
float hh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + 1.0), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.55;
  for (int i = 0; i < 4; i++) { s += vn(p) * a; p = p * 2.03 + 7.1; a *= 0.5; }
  return s;
}`;

const quad = () => {
  const g = new T.InstancedBufferGeometry();
  g.setAttribute(
    "corner",
    new T.BufferAttribute(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2),
  );
  g.setAttribute("position", new T.BufferAttribute(new Float32Array(12), 3));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  return g;
};
const dynamic = (g, name, n, capacity) => {
  const arr = new Float32Array(capacity * n),
    a = new T.InstancedBufferAttribute(arr, n).setUsage(T.DynamicDrawUsage);
  g.setAttribute(name, a);
  return a;
};
const flush = (g, attrs, count) => {
  g.instanceCount = count;
  for (const a of attrs) {
    a.clearUpdateRanges();
    a.addUpdateRange(0, count * a.itemSize);
    a.needsUpdate = true;
  }
};

export class Smoke {
  constructor(capacity) {
    this.capacity = capacity;
    this.puffs = [];
    const g = quad();
    this.attrs = [
      dynamic(g, "iPos", 4, capacity),
      dynamic(g, "iAge", 4, capacity),
      dynamic(g, "iTint", 3, capacity),
    ];
    this.geometry = g;
    this.uniforms = {
      ...fieldUniforms,
      ambient: { value: new T.Color(0x0b2026) },
    };
    this.mesh = new T.Mesh(
      g,
      new T.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: /* glsl */ `
          ${FIELD_GLSL}
          attribute vec2 corner;
          attribute vec4 iPos;
          attribute vec4 iAge;
          attribute vec3 iTint;
          varying vec2 vUv;
          varying vec4 vAge;
          varying vec3 vLight;
          varying vec3 vTint;
          void main() {
            vec4 mv = viewMatrix * vec4(iPos.xyz, 1.0);
            float a = iAge.y * 6.283 + iAge.x * 1.6 * (iAge.y - 0.5);
            float c = cos(a), s = sin(a);
            mv.xy += vec2(c * corner.x - s * corner.y, s * corner.x + c * corner.y) * iPos.w;
            vUv = corner;
            vAge = iAge;
            vTint = iTint;
            vLight = lfSample(iPos.xyz, 1.5);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          ${NOISE}
          uniform vec3 ambient;
          varying vec2 vUv;
          varying vec4 vAge;
          varying vec3 vLight;
          varying vec3 vTint;
          vec3 blackbody(float t) {
            return vec3(smoothstep(0.0, 0.3, t), smoothstep(0.18, 0.75, t) * 0.82, smoothstep(0.55, 1.1, t) * 0.7);
          }
          void main() {
            float d = length(vUv);
            if (d > 1.0) discard;
            float age = vAge.x, heat = vAge.z;
            float n = fbm(vUv * 1.7 + vAge.y * 23.0 + vec2(0.0, age * 1.3));
            float shape = smoothstep(1.0, 0.18, d + (n - 0.5) * 0.85);
            if (shape <= 0.002) discard;
            float alpha = shape * vAge.w;
            float lump = 0.55 + 0.9 * n;
            vec3 lit = vTint * (ambient * 0.7 + 0.02 + min(vLight, vec3(12.0)) * 0.05) * lump;
            float fireMask = pow(shape, 1.3) * smoothstep(0.2, 0.7, n + heat * 0.45);
            float t = heat * (0.55 + 0.7 * n);
            vec3 fire = blackbody(t) * fireMask * (heat * heat * 18.0 + heat * 3.0);
            gl_FragColor = vec4(lit * alpha + fire * vAge.w, alpha * (1.0 - heat * 0.55));
          }`,
        transparent: true,
        depthWrite: false,
        blending: T.CustomBlending,
        blendSrc: T.OneFactor,
        blendDst: T.OneMinusSrcAlphaFactor,
      }),
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 6;
    this.mesh.layers.enable(1);
  }
  spawn(o) {
    this.puffs.push({
      x: o.x,
      y: o.y ?? 0.8,
      z: o.z,
      vx: o.vx ?? 0,
      vy: o.vy ?? 0,
      vz: o.vz ?? 0,
      size: o.size ?? 1,
      grow: o.grow ?? 1,
      life: o.life ?? 2,
      age: 0,
      heat: o.heat ?? 0,
      cool: o.cool ?? 3,
      drag: o.drag ?? 2.2,
      lift: o.lift ?? 0.6,
      alpha: o.alpha ?? 0.6,
      seed: Math.random(),
      tint: o.tint ?? 0.16,
    });
    if (this.puffs.length > this.capacity)
      this.puffs.splice(0, this.puffs.length - this.capacity);
  }
  update(dt, scroll) {
    const [pos, age, tint] = this.attrs.map((a) => a.array);
    let n = 0;
    this.puffs = this.puffs.filter((p) => {
      p.age += dt;
      if (p.age >= p.life) return false;
      const drag = Math.exp(-dt * p.drag);
      p.vx *= drag;
      p.vz *= drag;
      p.vy = p.vy * drag + (p.lift + p.heat * 2.2) * dt;
      p.x += p.vx * dt;
      p.y = Math.max(0.2, p.y + p.vy * dt);
      p.z += (p.vz + scroll) * dt;
      p.size += p.grow * dt * (1 - p.age / p.life * 0.6);
      p.heat *= Math.exp(-dt * p.cool);
      return true;
    });
    for (const p of this.puffs) {
      const k = p.age / p.life,
        fade = Math.min(1, p.age * 12) * (1 - k) * (1 - k);
      pos[n * 4] = p.x;
      pos[n * 4 + 1] = p.y;
      pos[n * 4 + 2] = p.z;
      pos[n * 4 + 3] = p.size;
      age[n * 4] = p.age;
      age[n * 4 + 1] = p.seed;
      age[n * 4 + 2] = p.heat;
      age[n * 4 + 3] = p.alpha * fade;
      tint[n * 3] = p.tint;
      tint[n * 3 + 1] = p.tint * 0.97;
      tint[n * 3 + 2] = p.tint * 0.94;
      n++;
    }
    flush(this.geometry, this.attrs, n);
  }
}

// Burn marks with embers that cool, left where things blew up.
export class Scorch {
  constructor(capacity = 48) {
    this.capacity = capacity;
    this.marks = [];
    const g = new T.InstancedBufferGeometry();
    const plane = new T.PlaneGeometry(2, 2).rotateX(-Math.PI / 2);
    g.index = plane.index;
    g.setAttribute("position", plane.getAttribute("position"));
    g.setAttribute("uv", plane.getAttribute("uv"));
    this.attrs = [dynamic(g, "iMark", 4, capacity)];
    this.geometry = g;
    this.mesh = new T.Mesh(
      g,
      new T.ShaderMaterial({
        vertexShader: /* glsl */ `
          attribute vec4 iMark; // x, z, size, age
          varying vec2 vUv;
          varying float vAge;
          varying float vSeed;
          void main() {
            vUv = uv * 2.0 - 1.0;
            vAge = iMark.w;
            vSeed = fract(iMark.x * 3.17 + iMark.z * 0.71);
            vec3 p = vec3(position.x * iMark.z + iMark.x, 0.045, position.z * iMark.z + iMark.y);
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          ${NOISE}
          varying vec2 vUv;
          varying float vAge;
          varying float vSeed;
          void main() {
            float d = length(vUv);
            float n = fbm(vUv * 2.4 + vSeed * 31.0);
            float burn = smoothstep(1.0, 0.25, d + (n - 0.5) * 0.7);
            if (burn <= 0.002) discard;
            float fade = 1.0 - smoothstep(6.0, 11.0, vAge);
            float hot = exp(-vAge * 1.3) * smoothstep(0.7, 0.1, d) * smoothstep(0.5, 0.85, n);
            vec3 ember = vec3(1.0, 0.36, 0.08) * hot * 2.6 + vec3(1.0, 0.75, 0.4) * hot * hot * 1.6;
            float a = burn * 0.78 * fade;
            gl_FragColor = vec4(ember * fade, a);
          }`,
        transparent: true,
        depthWrite: false,
        blending: T.CustomBlending,
        blendSrc: T.OneFactor,
        blendDst: T.OneMinusSrcAlphaFactor,
      }),
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
  }
  add(x, z, size) {
    this.marks.push({ x, z, size, age: 0 });
    if (this.marks.length > this.capacity) this.marks.shift();
  }
  update(dt, scroll) {
    const a = this.attrs[0].array;
    this.marks = this.marks.filter((m) => {
      m.age += dt;
      m.z += scroll * dt;
      return m.age < 11 && m.z < 20;
    });
    this.marks.forEach((m, i) => {
      a[i * 4] = m.x;
      a[i * 4 + 1] = m.z;
      a[i * 4 + 2] = m.size;
      a[i * 4 + 3] = m.age;
    });
    flush(this.geometry, this.attrs, this.marks.length);
  }
}

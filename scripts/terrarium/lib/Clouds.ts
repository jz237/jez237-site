import * as THREE from 'three';
import {TANK} from './Case';

/** Tileable 3D noise (Worley-billowed value noise) for cloud detail. */
function cloudNoise(size = 48): THREE.Data3DTexture {
  const data = new Uint8Array(size * size * size);
  const pts: number[][] = [];
  const cells = 6;
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < cells ** 3; i++) pts.push([r(), r(), r()]);
  const worley = (x: number, y: number, z: number) => {
    const fx = x * cells, fy = y * cells, fz = z * cells;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    let d = 9;
    for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const cx = (ix + i + cells) % cells, cy = (iy + j + cells) % cells, cz = (iz + k + cells) % cells;
      const p = pts[cx + cells * (cy + cells * cz)];
      const dx = ix + i + p[0] - fx, dy = iy + j + p[1] - fy, dz = iz + k + p[2] - fz;
      d = Math.min(d, dx * dx + dy * dy + dz * dz);
    }
    return Math.sqrt(d);
  };
  const hash = (x: number, y: number, z: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return h - Math.floor(h);
  };
  const vnoise = (x: number, y: number, z: number, p: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    let s = 0;
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      s += (i ? u : 1 - u) * (j ? v : 1 - v) * (k ? w : 1 - w) * hash((xi + i) % p, (yi + j) % p, (zi + k) % p);
    }
    return s;
  };
  for (let z = 0; z < size; z++) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size, w = z / size;
    const wor = 1 - Math.min(1, worley(u, v, w) * 1.6);
    const wor2 = 1 - Math.min(1, worley((u * 2) % 1, (v * 2) % 1, (w * 2) % 1) * 1.6);
    const per = vnoise(u * 8, v * 8, w * 8, 8) * 0.6 + vnoise(u * 16, v * 16, w * 16, 16) * 0.4;
    const n = wor * 0.55 + wor2 * 0.25 + per * 0.3;
    data[x + size * (y + size * z)] = Math.max(0, Math.min(255, n * 255));
  }
  const t = new THREE.Data3DTexture(data, size, size, size);
  t.format = THREE.RedFormat;
  t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export interface Cloud {
  mesh: THREE.Mesh;
  centre: THREE.Vector3;
  velocity: THREE.Vector3;
  puffs: THREE.Vector4[]; // local centre + radius
  rain: number; // 0..1 current rain rate
  water: number; // 1 full .. 0 wrung out
  squeeze: number; // user squeeze 0..1
  size: number;
  uniforms: Record<string, THREE.IUniform>;
}

const MAX_PUFFS = 10;

export class Clouds {
  readonly group = new THREE.Group();
  readonly clouds: Cloud[] = [];
  readonly shared = {
    tNoise: {value: null as THREE.Data3DTexture | null},
    uTime: {value: 0},
    uLightDir: {value: new THREE.Vector3(0, 1, 0)},
    uLightColor: {value: new THREE.Color(1, 0.85, 0.65)},
    uAmbient: {value: new THREE.Color(0.35, 0.3, 0.26)},
    uGlow: {value: new THREE.Color(1, 0.6, 0.25)},
  };

  constructor() {
    this.shared.tNoise.value = cloudNoise();
    const specs: [number, number, number, number][] = [[-0.16, 0.54, -0.04, 1.0], [0.03, 0.5, 0.02, 0.8], [0.22, 0.545, -0.06, 1.1]];
    specs.forEach(([x, y, z, s], i) => this.add(new THREE.Vector3(x, y, z), s, i * 13.7 + 2));
  }

  add(centre: THREE.Vector3, size: number, seed: number) {
    let s0 = Math.floor(seed * 1000) + 1;
    const r = () => ((s0 = (s0 * 16807) % 2147483647) / 2147483647);
    const puffs: THREE.Vector4[] = [];
    const n = 7 + Math.floor(r() * 3);
    const W = 0.065 * size, H = 0.022 * size, D = 0.035 * size;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) - 0.5;
      const x = t * W * 1.6 + (r() - 0.5) * 0.01;
      const rad = (0.02 + 0.016 * (1 - Math.abs(t) * 1.6) + r() * 0.008) * size;
      puffs.push(new THREE.Vector4(x, (r() * 0.6 + 0.2) * H * (1 - Math.abs(t)), (r() - 0.5) * D * 0.8, rad));
    }
    // a couple of crowning puffs
    for (let i = 0; i < 2; i++) puffs.push(new THREE.Vector4((r() - 0.5) * W * 0.6, H * 0.9, (r() - 0.5) * D * 0.4, (0.022 + r() * 0.01) * size));
    const box = new THREE.Box3();
    for (const p of puffs) box.expandByPoint(new THREE.Vector3(p.x - p.w, p.y - p.w, p.z - p.w)).expandByPoint(new THREE.Vector3(p.x + p.w, p.y + p.w, p.z + p.w));
    box.expandByScalar(0.006);
    const geo = new THREE.BoxGeometry(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
    geo.translate((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2);
    const puffArr = Array.from({length: MAX_PUFFS}, (_, i) => puffs[i] ?? new THREE.Vector4(0, 0, 0, 0));
    const uniforms: Record<string, THREE.IUniform> = {
      ...this.shared,
      uPuffs: {value: puffArr},
      uCount: {value: Math.min(MAX_PUFFS, puffs.length)},
      uBoxMin: {value: box.min.clone()},
      uBoxMax: {value: box.max.clone()},
      uDark: {value: 0},
      uSeed: {value: seed},
      uScale: {value: 1},
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `
varying vec3 vLocal; varying vec3 vCamLocal;
void main(){
  vLocal = position;
  vCamLocal = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
      fragmentShader: /* glsl */ `
precision highp float;
precision highp sampler3D;
uniform sampler3D tNoise; uniform float uTime, uDark, uSeed, uScale; uniform int uCount;
uniform vec4 uPuffs[${MAX_PUFFS}]; uniform vec3 uBoxMin, uBoxMax, uLightDir, uLightColor, uAmbient, uGlow;
varying vec3 vLocal; varying vec3 vCamLocal;
float density(vec3 p){
  float base = 0.0;
  for (int i = 0; i < ${MAX_PUFFS}; i++) {
    if (i >= uCount) break;
    vec4 b = uPuffs[i];
    float d = length(p - b.xyz) / (b.w * uScale);
    base = max(base, 1.0 - d);
  }
  if (base <= 0.0) return 0.0;
  vec3 q = p * 9.0 + vec3(uSeed, uTime * 0.02, uSeed * 0.3);
  float n = texture(tNoise, q).r;
  float n2 = texture(tNoise, q * 3.1 + 0.37).r;
  float shape = base * 2.2 - (1.0 - n) * 0.85 - (1.0 - n2) * 0.25;
  // flatter, denser underside
  return clamp(shape, 0.0, 1.0);
}
vec2 boxHit(vec3 ro, vec3 rd){
  vec3 inv = 1.0 / rd;
  vec3 t0 = (uBoxMin - ro) * inv, t1 = (uBoxMax - ro) * inv;
  vec3 tmin = min(t0, t1), tmax = max(t0, t1);
  return vec2(max(max(tmin.x, tmin.y), tmin.z), min(min(tmax.x, tmax.y), tmax.z));
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec3 ro = vCamLocal;
  vec3 rd = normalize(vLocal - ro);
  vec2 h = boxHit(ro, rd);
  float t0 = max(h.x, 0.0), t1 = h.y;
  if (t1 <= t0) discard;
  const int STEPS = 48;
  float dt = (t1 - t0) / float(STEPS);
  float t = t0 + dt * hash(gl_FragCoord.xy + uTime);
  vec3 col = vec3(0.0);
  float T = 1.0;
  vec3 L = normalize(uLightDir);
  float sigma = 260.0;
  for (int i = 0; i < STEPS; i++) {
    vec3 p = ro + rd * t;
    float d = density(p);
    if (d > 0.002) {
      // light: short march toward the lamp
      float od = 0.0;
      for (int j = 1; j <= 4; j++) od += density(p + L * float(j) * 0.006);
      float shadow = exp(-od * 0.006 * sigma * 1.2);
      float powder = 1.0 - exp(-d * 2.0 * 12.0);
      float hgt = clamp((p.y - uBoxMin.y) / (uBoxMax.y - uBoxMin.y), 0.0, 1.0);
      vec3 amb = uAmbient * mix(0.55, 1.15, hgt);
      vec3 lit = uLightColor * shadow * mix(0.6, 1.0, powder) * 1.25 + amb;
      // a warm under-glow from the lid core
      lit += uGlow * (1.0 - hgt) * 0.05;
      lit *= mix(1.0, 0.32, uDark);
      float a = 1.0 - exp(-d * sigma * dt);
      col += T * a * lit;
      T *= 1.0 - a;
      if (T < 0.02) break;
    }
    t += dt;
    if (t > t1) break;
  }
  float alpha = 1.0 - T;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(centre);
    mesh.renderOrder = 6;
    mesh.frustumCulled = false;
    this.group.add(mesh);
    this.clouds.push({mesh, centre: mesh.position, velocity: new THREE.Vector3(), puffs, rain: 0, water: 1, squeeze: 0, size, uniforms});
  }

  /** Which cloud (if any) a ray hits. */
  pick(ray: THREE.Ray): Cloud | null {
    let best: Cloud | null = null, bd = Infinity;
    const sphere = new THREE.Sphere();
    for (const c of this.clouds) {
      for (const p of c.puffs) {
        sphere.center.set(p.x, p.y, p.z).add(c.centre);
        sphere.radius = p.w * 1.1;
        const hit = ray.intersectSphere(sphere, new THREE.Vector3());
        if (hit) {const d = hit.distanceTo(ray.origin); if (d < bd) {bd = d; best = c;}}
      }
    }
    return best;
  }

  update(dt: number, time: number, wind: THREE.Vector3) {
    this.shared.uTime.value = time;
    const hx = TANK.w / 2 - 0.09, hz = TANK.d / 2 - 0.06;
    for (const c of this.clouds) {
      // drift with the wind; ease back from the glass; slow idle wander
      c.velocity.x += (wind.x * 0.05 + Math.sin(time * 0.1 + c.size * 10) * 0.0004) * dt;
      c.velocity.z += wind.z * 0.05 * dt;
      c.velocity.multiplyScalar(1 - dt * 0.8);
      c.centre.addScaledVector(c.velocity, dt);
      if (Math.abs(c.centre.x) > hx) {c.centre.x = Math.sign(c.centre.x) * hx; c.velocity.x *= -0.3;}
      if (Math.abs(c.centre.z) > hz) {c.centre.z = Math.sign(c.centre.z) * hz; c.velocity.z *= -0.3;}
      c.centre.y = THREE.MathUtils.clamp(c.centre.y, 0.5, TANK.h - 0.07);
      // squeezing wrings rain out; clouds slowly refill from the humid air
      c.rain = THREE.MathUtils.damp(c.rain, c.squeeze * c.water, 4, dt);
      c.water = THREE.MathUtils.clamp(c.water - c.rain * dt * 0.05 + dt * 0.01, 0.15, 1);
      c.uniforms.uDark.value = THREE.MathUtils.damp(c.uniforms.uDark.value as number, c.rain * 0.85 + (1 - c.water) * 0.2, 3, dt);
      c.uniforms.uScale.value = 0.82 + 0.18 * c.water - c.squeeze * 0.06;
    }
  }
}

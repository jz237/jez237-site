// Foam and wakes round legs in the water.
//
// Wherever a leg of a wading, soaking or swimming animal goes through the water surface:
//   - a collar of churned foam hugs the leg at the waterline, frothier while the leg moves;
//   - as the leg moves through the water it leaves foam behind it, patches of bubbles that spread out
//     and break up over a few seconds: the animal's wake, a V of foam behind a walking animal;
//   - and each stride rings the water (Weatherglass's own ripples) where the leg goes in.
// One instanced mesh of flat quads lying on the water, drawn after the water.
import { InstancedMesh, PlaneGeometry, ShaderMaterial, InstancedBufferAttribute, DynamicDrawUsage, Matrix4, Vector3 } from 'three';
import { guardMaterial } from './safety.js';

const VS = `
attribute vec4 aFoam; // x: kind (0 collar, 1 wake), y: age 0..1, z: seed, w: strength
varying vec2 vUv;
varying vec4 vFoam;
void main() {
  vUv = uv * 2.0 - 1.0;
  vFoam = aFoam;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}`;

const FS = `
uniform float uTime;
uniform vec3 uLightColor;
uniform vec3 uSkyColor;
uniform vec3 uLightDir;
uniform float uNight;
varying vec2 vUv;
varying vec4 vFoam;
float fH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float fN(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(fH(i), fH(i + vec2(1, 0)), f.x), mix(fH(i + vec2(0, 1)), fH(i + vec2(1, 1)), f.x), f.y); }
void main() {
  float r = length(vUv);
  if (r > 1.0) discard;
  float a = atan(vUv.y, vUv.x), s = vFoam.z * 37.0, age = vFoam.y;
  // bubbles: two scales of cells, drifting
  float n = fN(vUv * 5.0 + s + uTime * 0.35) * 0.6 + fN(vUv * 13.0 - s - uTime * 0.6) * 0.4;
  float f;
  if (vFoam.x < 0.5) {
    // a collar: a broken ring of froth round the leg, churning
    float ring = smoothstep(0.32, 0.5, r) * smoothstep(1.0, 0.62, r);
    float churn = fN(vec2(a * 3.0 + uTime * 1.7, r * 5.0 - uTime * 2.3) + s);
    f = ring * smoothstep(0.25, 0.6, churn * 0.55 + n * 0.55);
  } else {
    // a wake patch: bubbles breaking up as it spreads, thinning from the middle out, with a fading rim
    float body = smoothstep(1.0, 0.25, r) * smoothstep(0.42 + 0.4 * age, 0.72 + 0.2 * age, n);
    float rim = smoothstep(0.08, 0.0, abs(r - 0.82)) * smoothstep(0.35, 0.6, n) * 0.7;
    f = max(body, rim) * pow(1.0 - age, 1.4);
  }
  f *= vFoam.w;
  if (f < 0.01) discard;
  // lit as a white, rough surface lying flat: the sun (Lambert) and the sky
  vec3 col = 0.78 * (uLightColor * max(uLightDir.y, 0.0) / 3.14159 + uSkyColor * 0.3) + vec3(0.01);
  gl_FragColor = vec4(col * (0.9 + 0.2 * n), clamp(f, 0.0, 0.92));
}`;

const _a = new Vector3(), _b = new Vector3(), _c = new Vector3(), _p = new Vector3(), _M = new Matrix4();

export class Wakes {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    const tier = this.ctx.quality?.tier ?? 1;
    this.N = tier === 0 ? 48 : 160;
    this.wakeOn = tier > 0;
    const g = new PlaneGeometry(1, 1);
    g.rotateX(-Math.PI / 2);
    this.attr = new InstancedBufferAttribute(new Float32Array(this.N * 4), 4);
    this.attr.setUsage(DynamicDrawUsage);
    g.setAttribute('aFoam', this.attr);
    const U = this.ctx.uniforms;
    const m = new ShaderMaterial({
      uniforms: { uTime: U.uTime, uLightColor: U.uLightColor, uSkyColor: U.uSkyColor, uLightDir: U.uLightDir, uNight: U.uNight },
      vertexShader: VS, fragmentShader: FS,
      transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    guardMaterial(m);
    this.im = new InstancedMesh(g, m, this.N);
    this.im.name = 'water-foam';
    this.im.frustumCulled = false;
    this.im.renderOrder = 1.08; // after the water
    this.im.userData.noReflect = true;
    this.im.count = 0;
    this.ctx.scene.add(this.im);
    this.patches = []; // wake patches: {x, y, z, r0, age, life, seed, k}
    this.legState = new WeakMap(); // per leg: where it last went through, and when it last rang the water
  }

  // where this leg goes through the water surface (thigh -> shin -> foot), or null
  crossing(L) {
    const M = this.mod;
    L.a.getWorldPosition(_a);
    L.b.getWorldPosition(_b);
    L.c.getWorldPosition(_c);
    const sy = M.waterSurface(_c.x, _c.z);
    if (sy == null || _c.y > sy) return null;
    // the lowest segment whose top is above the surface
    for (const [lo, hi] of [[_c, _b], [_b, _a]]) {
      if (hi.y >= sy) {
        const t = (sy - lo.y) / Math.max(1e-6, hi.y - lo.y);
        return _p.set(lo.x + (hi.x - lo.x) * t, sy, lo.z + (hi.z - lo.z) * t);
      }
    }
    return null;
  }

  update(dt) {
    const W = this.ctx.modules.water, A = this.attr.array;
    let n = 0;
    const put = (x, y, z, r, kind, age, seed, k) => {
      if (n >= this.N) return;
      _M.makeScale(r * 2, 1, r * 2).setPosition(x, y + 0.0025, z);
      this.im.setMatrixAt(n, _M);
      A[n * 4] = kind;
      A[n * 4 + 1] = age;
      A[n * 4 + 2] = seed;
      A[n * 4 + 3] = k;
      n++;
    };
    // the wake patches spread and fade
    for (let i = this.patches.length - 1; i >= 0; i--) {
      const p = this.patches[i];
      p.age += dt / p.life;
      if (p.age >= 1) this.patches.splice(i, 1);
    }
    for (const d of this.mod.walkers || []) {
      if (!d.feet?.legs?.length || !d.root.visible) continue;
      if ((d.inWater || 0) < 0.05 && d.state !== 'wading' && d.state !== 'soak' && !d.swimming) continue;
      const legR = Math.max(0.015, d.height * 0.085);
      for (const L of d.feet.legs) {
        const p = this.crossing(L);
        let st = this.legState.get(L);
        if (!p) {
          if (st) st.x = null;
          continue;
        }
        if (!st) this.legState.set(L, (st = { x: null, z: 0, ring: Math.random() }));
        const moved = st.x == null ? 0 : Math.hypot(p.x - st.x, p.z - st.z);
        const speed = moved / Math.max(dt, 1e-3);
        // the collar, frothier while the leg moves
        put(p.x, p.y, p.z, legR * (1.6 + Math.min(0.8, speed * 4)), 0, 0, (L.c.id % 97) / 97, Math.min(1, 0.45 + speed * 6));
        // foam left behind as it moves
        if (this.wakeOn && st.x != null && (st.dist = (st.dist || 0) + moved) > legR * 0.9) {
          st.dist = 0;
          if (this.patches.length < this.N - 24) this.patches.push({ x: st.x, y: p.y, z: st.z, r0: legR * 1.5, age: 0, life: 3.2 + Math.random() * 1.8, seed: Math.random(), k: Math.min(1, 0.5 + speed * 5) });
        }
        // the water rings where the leg goes in: with each stride, and now and then while it stands
        st.ring -= dt;
        if (st.ring <= 0 && W?.ripple) {
          st.ring = speed > 0.02 ? 0.45 + Math.random() * 0.3 : 1.8 + Math.random() * 2;
          W.ripple(p.x, p.z, Math.min(0.08, legR * 1.4), speed > 0.02 ? 0.5 : 0.2);
        }
        st.x = p.x;
        st.z = p.z;
      }
    }
    for (const p of this.patches) put(p.x, p.y, p.z, p.r0 * (1 + 2.8 * Math.sqrt(p.age)), 1, p.age, p.seed, p.k);
    this.im.count = n;
    if (n) {
      this.im.instanceMatrix.needsUpdate = true;
      this.attr.needsUpdate = true;
    }
  }
}

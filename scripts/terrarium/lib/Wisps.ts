import * as THREE from 'three';
import type {WindField} from './WindField';
import {TANK} from './Case';

const RIBBONS = 30;
const POINTS = 18;

interface Wisp {
  pts: THREE.Vector3[];
  head: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  life: number;
  width: number;
  alpha: number;
  nextPoint: number;
  alive: boolean;
  seed: number;
}

/**
 * Wind made visible: faint ribbon trails thrown off by each wind stroke that
 * ride the flow, curl in the turbulence and fade.
 */
export class Wisps {
  readonly mesh: THREE.Mesh;
  private wisps: Wisp[] = [];
  private pos: Float32Array;
  private aux: Float32Array;
  private lastSpawn = 0;
  private time = 0;
  readonly uniforms = {uColor: {value: new THREE.Color(0.5, 0.52, 0.55)}, uTime: {value: 0}};

  constructor(private wind: WindField, private groundAt: (x: number, z: number) => number) {
    for (let i = 0; i < RIBBONS; i++) {
      this.wisps.push({pts: Array.from({length: POINTS}, () => new THREE.Vector3()), head: new THREE.Vector3(), vel: new THREE.Vector3(), age: 0, life: 1, width: 0.001, alpha: 0, nextPoint: 0, alive: false, seed: Math.random() * 100});
    }
    const V = RIBBONS * POINTS * 2;
    this.pos = new Float32Array(V * 3);
    this.aux = new Float32Array(V * 3); // side, along, alpha
    const idx: number[] = [];
    for (let r = 0; r < RIBBONS; r++) for (let i = 0; i < POINTS - 1; i++) {
      const a = (r * POINTS + i) * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAux', new THREE.BufferAttribute(this.aux, 3).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(idx);
    this.mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `attribute vec3 aAux; varying vec3 vAux;
void main(){ vAux = aAux; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `uniform vec3 uColor; uniform float uTime; varying vec3 vAux;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float side = vAux.x, u = vAux.y;
  float edge = (1.0 - side * side); edge *= edge;
  float streak = 0.5 + 0.5 * n(vec2(u * 7.0 - uTime * 2.0, side * 1.5 + vAux.z * 40.0)) * n(vec2(u * 17.0 - uTime * 3.0, side * 3.0));
  float taper = smoothstep(0.0, 0.12, u) * smoothstep(1.0, 0.55, u);
  float a = edge * streak * taper * vAux.z;
  gl_FragColor = vec4(uColor * a, a * 0.6);
}`,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 8;
    this.mesh.name = 'wind-wisps';
  }

  /** A wind stroke passing (x, y, z) with velocity (vx, vz) m/s. */
  stroke(x: number, z: number, vx: number, vz: number) {
    const now = this.time;
    const n = now - this.lastSpawn < 0.05 ? 1 : 2 + (Math.random() < 0.5 ? 1 : 0);
    this.lastSpawn = now;
    const sp = Math.hypot(vx, vz);
    if (sp < 0.05) return;
    const px = -vz / sp, pz = vx / sp;
    for (let k = 0; k < n; k++) {
      let w = this.wisps.find((q) => !q.alive);
      if (!w) w = this.wisps.reduce((a, b) => (a.age / a.life > b.age / b.life ? a : b));
      const off = (Math.random() - 0.5) * 0.07;
      const hx = Math.max(-TANK.w / 2 + 0.02, Math.min(TANK.w / 2 - 0.02, x + px * off));
      const hz = Math.max(-TANK.d / 2 + 0.02, Math.min(TANK.d / 2 - 0.02, z + pz * off));
      w.head.set(hx, this.groundAt(hx, hz) + 0.015 + Math.random() * 0.06, hz);
      w.vel.set(vx * 0.35, 0, vz * 0.35);
      for (const p of w.pts) p.copy(w.head);
      w.age = 0;
      w.life = 1.1 + Math.random() * 0.6;
      w.width = 0.003 + Math.random() * 0.004;
      w.alpha = 0.1 + Math.random() * 0.1;
      w.nextPoint = 0;
      w.alive = true;
      w.seed = Math.random() * 100;
    }
  }

  update(dt: number, camera: THREE.Camera) {
    this.time += dt;
    this.uniforms.uTime.value = this.time;
    const local = new THREE.Vector2();
    const cam = camera.position;
    const t = new THREE.Vector3(), v = new THREE.Vector3(), s = new THREE.Vector3();
    this.wisps.forEach((w, r) => {
      const base = r * POINTS * 2;
      if (w.alive) {
        w.age += dt;
        if (w.age > w.life + 0.4) w.alive = false;
        const life = w.age / w.life;
        this.wind.sample(w.head.x, w.head.z, local);
        const turb = this.wind.turbulence(w.head.x, w.head.z);
        // ride the flow, with a little curl so the ribbons twist
        const curl = Math.sin(w.seed + this.time * 2.3) * (0.35 + turb * 0.8) + Math.sin(w.seed * 3.7 + this.time * 5.1) * 0.15;
        const fx = local.x * (0.75 - 0.2 * life) - local.y * curl;
        const fz = local.y * (0.75 - 0.2 * life) + local.x * curl;
        w.vel.x += (fx - w.vel.x) * (1 - Math.exp(-dt * 3));
        w.vel.z += (fz - w.vel.z) * (1 - Math.exp(-dt * 3));
        w.vel.y = Math.sin(w.seed * 3 + this.time * 2.3) * 0.03 + Math.sin(w.seed + this.time * 4.7) * 0.012;
        w.head.addScaledVector(w.vel, dt);
        w.head.x = Math.max(-TANK.w / 2 + 0.01, Math.min(TANK.w / 2 - 0.01, w.head.x));
        w.head.z = Math.max(-TANK.d / 2 + 0.01, Math.min(TANK.d / 2 - 0.01, w.head.z));
        w.head.y = Math.max(w.head.y, this.groundAt(w.head.x, w.head.z) + 0.006);
        w.nextPoint -= dt;
        if (w.nextPoint <= 0) {
          w.nextPoint = 0.018;
          for (let i = POINTS - 1; i > 0; i--) w.pts[i].copy(w.pts[i - 1]);
        }
        w.pts[0].copy(w.head);
      }
      const fade = w.alive ? Math.min(1, w.age / 0.15) * (1 - Math.min(1, Math.max(0, (w.age - w.life) / 0.4))) : 0;
      for (let i = 0; i < POINTS; i++) {
        const p = w.pts[i];
        const a = w.pts[Math.max(0, i - 1)], b = w.pts[Math.min(POINTS - 1, i + 1)];
        t.subVectors(a, b);
        if (t.lengthSq() < 1e-12) t.set(1, 0, 0);
        v.subVectors(cam, p);
        s.crossVectors(t, v).normalize().multiplyScalar(w.width * (1 - (i / POINTS) * 0.6));
        for (const side of [-1, 1]) {
          const k = base + i * 2 + (side > 0 ? 1 : 0);
          this.pos[k * 3] = p.x + s.x * side;
          this.pos[k * 3 + 1] = p.y + s.y * side;
          this.pos[k * 3 + 2] = p.z + s.z * side;
          this.aux[k * 3] = side;
          this.aux[k * 3 + 1] = i / (POINTS - 1);
          this.aux[k * 3 + 2] = w.alpha * fade;
        }
      }
    });
    (this.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.mesh.geometry.attributes.aAux as THREE.BufferAttribute).needsUpdate = true;
  }

  setLight(level: number) {
    this.uniforms.uColor.value.setRGB(0.96, 0.98, 1).multiplyScalar(0.12 + 0.5 * level);
  }
}

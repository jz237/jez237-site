import * as THREE from 'three';
import {TANK} from './Case';
import type {WindField} from './WindField';

const N = 380;

/**
 * Dust and spores drifting in the air: carried exactly by the wind field, so
 * every stroke of the wind tool and every gust shows as a swirl of motes;
 * they glint where the lamp's beam catches them.
 */
export class Motes {
  readonly points: THREE.Points;
  private pos = new Float32Array(N * 3);
  private vel = new Float32Array(N * 3);
  private life = new Float32Array(N);
  private age = new Float32Array(N);
  private size = new Float32Array(N);
  private w = new THREE.Vector2();
  readonly uniforms = {
    uKeyPos: {value: new THREE.Vector3(0, 1.1, 0.3)},
    uKeyTarget: {value: new THREE.Vector3(0, 0.12, 0)},
    uKeyColor: {value: new THREE.Color(1, 0.85, 0.65)},
    uDay: {value: 1},
    uScale: {value: 900},
  };

  constructor(private wind: WindField, private floorAt: (x: number, z: number) => number) {
    for (let i = 0; i < N; i++) this.spawn(i, true);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aFade', new THREE.BufferAttribute(new Float32Array(N), 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: /* glsl */ `
attribute float aFade; attribute float aSize;
uniform vec3 uKeyPos, uKeyTarget, uKeyColor; uniform float uDay, uScale;
varying vec3 vCol;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aSize * uScale / -mv.z, 1.0, 5.0);
  // lit inside the lamp's cone, and brightest seen against the light
  vec3 L = normalize(uKeyPos - position);
  float cone = smoothstep(0.62, 0.8, dot(-L, normalize(uKeyTarget - uKeyPos)));
  vec3 V = normalize(cameraPosition - position);
  float fwd = pow(max(0.0, dot(-V, L)), 6.0);
  vCol = uKeyColor * uDay * (0.05 + 0.5 * cone + 1.6 * fwd * cone) * aFade + vec3(0.012) * aFade;
}`,
      fragmentShader: /* glsl */ `varying vec3 vCol;
void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.1, d); gl_FragColor = vec4(vCol * a, 0.0); }`,
    }));
    this.points.frustumCulled = false;
    this.points.renderOrder = 6;
  }

  private spawn(i: number, anywhere: boolean) {
    const x = (Math.random() - 0.5) * (TANK.w - 0.04), z = (Math.random() - 0.5) * (TANK.d - 0.04);
    const floor = this.floorAt(x, z);
    const y = anywhere ? floor + 0.01 + Math.random() * (TANK.h - 0.06 - floor) : floor + 0.005 + Math.random() * 0.05;
    this.pos.set([x, y, z], i * 3);
    this.vel.set([0, 0, 0], i * 3);
    this.life[i] = 25 + Math.random() * 50;
    this.age[i] = anywhere ? Math.random() * this.life[i] : 0;
    this.size[i] = 0.0005 + Math.random() * 0.0009;
  }

  setPixelScale(s: number) {this.uniforms.uScale.value = s;}

  update(dt: number, day: number, keyPos: THREE.Vector3, keyTarget: THREE.Vector3, keyColor: THREE.Color) {
    const u = this.uniforms;
    u.uDay.value = day;
    u.uKeyPos.value.copy(keyPos);
    u.uKeyTarget.value.copy(keyTarget);
    u.uKeyColor.value.copy(keyColor);
    const fade = this.points.geometry.attributes.aFade as THREE.BufferAttribute;
    const k = 1 - Math.exp(-dt * 4); // motes are light: they follow the air within a fraction of a second
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      let x = this.pos[j], y = this.pos[j + 1], z = this.pos[j + 2];
      this.wind.sample(x, z, this.w);
      const turb = this.wind.turbulence(x, z);
      // the air near the floor drags; warm air rises gently under the lamp
      const floor = this.floorAt(x, z);
      const h = Math.min(1, (y - floor) / 0.04);
      const tx = this.w.x * (0.4 + 0.6 * h), tz = this.w.y * (0.4 + 0.6 * h);
      const ty = 0.004 * day - 0.002 + (Math.random() - 0.5) * (0.02 + turb * 0.4);
      this.vel[j] += (tx - this.vel[j]) * k + (Math.random() - 0.5) * 0.004;
      this.vel[j + 1] += (ty - this.vel[j + 1]) * k;
      this.vel[j + 2] += (tz - this.vel[j + 2]) * k + (Math.random() - 0.5) * 0.004;
      x += this.vel[j] * dt; y += this.vel[j + 1] * dt; z += this.vel[j + 2] * dt;
      this.age[i] += dt;
      const out = Math.abs(x) > TANK.w / 2 - 0.01 || Math.abs(z) > TANK.d / 2 - 0.01 || y > TANK.h - 0.02 || y < floor;
      if (out || this.age[i] > this.life[i]) {this.spawn(i, out); continue;}
      this.pos[j] = x; this.pos[j + 1] = y; this.pos[j + 2] = z;
      const a = this.age[i], l = this.life[i];
      fade.setX(i, Math.min(1, a / 3) * Math.min(1, (l - a) / 3));
    }
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    fade.needsUpdate = true;
  }
}

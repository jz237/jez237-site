import * as THREE from 'three';
import {Clouds, Cloud} from './Clouds';
import type {Surface} from './Surface';
import type {Water} from './Water';
import {WATER_LEVEL, poolDistance} from './Ground';
import {TANK} from './Case';

const smooth = (a: number, b: number, x: number) => {const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t);};

/**
 * The climate inside the glass: clouds you can move and wring out, rain with
 * splashes and ripples, drifting mist, gusts of wind, humidity, wetness and the
 * lamp's day.
 */
export class Weather {
  readonly clouds = new Clouds();
  readonly group = new THREE.Group();
  readonly wind = new THREE.Vector3();
  humidity = 0.45; // 0..1
  wet = 0; // surface wetness
  mist = 0; // ground mist amount
  mistTarget = 0;
  hours = 11.5; // time of day
  timeFlow = 0; // hours per second (0 = paused)
  rainAmount = 0;
  private drops: {p: THREE.Vector3; v: THREE.Vector3; alive: boolean}[] = [];
  private splashes: {p: THREE.Vector3; v: THREE.Vector3; life: number}[] = [];
  private rainLines: THREE.LineSegments;
  private splashPoints: THREE.Points;
  private mistSprites: THREE.Points;
  private mistData: {p: THREE.Vector3; v: THREE.Vector3; s: number}[] = [];
  onRipple?: (x: number, z: number, strength: number) => void;

  constructor(private surface: Surface, private water: Water) {
    this.group.add(this.clouds.group);
    const N = 900;
    for (let i = 0; i < N; i++) this.drops.push({p: new THREE.Vector3(), v: new THREE.Vector3(), alive: false});
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3));
    lg.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(N * 2), 1));
    this.rainLines = new THREE.LineSegments(lg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {uColor: {value: new THREE.Color(0.55, 0.55, 0.52)}},
      vertexShader: `attribute float aA; varying float vA; void main(){ vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uColor; varying float vA; void main(){ gl_FragColor = vec4(uColor * vA * 0.35, 0.0); }`,
    }));
    this.rainLines.frustumCulled = false;
    this.group.add(this.rainLines);
    const S = 500;
    for (let i = 0; i < S; i++) this.splashes.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: 0});
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(S * 3), 3));
    sg.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(S), 1));
    this.splashPoints = new THREE.Points(sg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float aLife; varying float vL; void main(){ vL = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = 0.0025 * 900.0 / -mv.z; }`,
      fragmentShader: `varying float vL; void main(){ float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(vec3(0.6, 0.6, 0.58) * a * vL * 0.6, 0.0); }`,
    }));
    this.splashPoints.frustumCulled = false;
    this.group.add(this.splashPoints);
    // Mist: large soft billows that hug the ground.
    const M = 46;
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(M * 3), 3));
    mg.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(M), 1));
    mg.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(M), 1));
    for (let i = 0; i < M; i++) {
      const x = (Math.random() - 0.5) * (TANK.w - 0.12), z = (Math.random() - 0.5) * (TANK.d - 0.08);
      this.mistData.push({p: new THREE.Vector3(x, 0, z), v: new THREE.Vector3(), s: 0.12 + Math.random() * 0.14});
      (mg.attributes.aSeed as THREE.BufferAttribute).setX(i, Math.random() * 100);
    }
    this.mistSprites = new THREE.Points(mg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {uMist: {value: 0}, uTime: {value: 0}, uColor: {value: new THREE.Color(0.6, 0.58, 0.55)}, uScale: {value: 900}},
      vertexShader: `attribute float aSeed; attribute float aSize; varying float vSeed; uniform float uScale;
void main(){ vSeed = aSeed; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = aSize * uScale / -mv.z; }`,
      fragmentShader: `uniform float uMist, uTime; uniform vec3 uColor; varying float vSeed;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  float billow = n(c * 4.0 + vSeed + uTime * 0.05) * 0.6 + n(c * 9.0 - vSeed) * 0.4;
  float a = smoothstep(0.5, 0.05, r) * (0.4 + 0.6 * billow) * uMist * 0.09;
  gl_FragColor = vec4(uColor * a, a);
}`,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    }));
    this.mistSprites.frustumCulled = false;
    this.mistSprites.renderOrder = 7;
    this.group.add(this.mistSprites);
  }

  /** 0 night .. 1 full day, from the lamp schedule. */
  get daylight() {
    const h = this.hours;
    return smooth(6.5, 8.0, h) * (1 - smooth(19.5, 21.0, h));
  }

  squeeze(c: Cloud | null, amount: number) {
    for (const cl of this.clouds.clouds) cl.squeeze = cl === c ? amount : Math.max(0, cl.squeeze - 0.05);
  }

  update(dt: number, time: number) {
    this.hours = (this.hours + this.timeFlow * dt + 24) % 24;
    this.wind.multiplyScalar(Math.exp(-dt * 0.9));
    this.clouds.update(dt, time, this.wind);
    this.rainAmount = this.clouds.clouds.reduce((s, c) => s + c.rain, 0);
    // humidity rises with rain and mist, dries under the lamp
    const day = this.daylight;
    this.humidity = THREE.MathUtils.clamp(this.humidity + (this.rainAmount * 0.05 + this.mist * 0.03 - (0.004 + 0.006 * day) * (this.humidity - 0.4)) * dt, 0.3, 1);
    this.wet = THREE.MathUtils.clamp(this.wet + (this.rainAmount * 0.35 - 0.012 - 0.02 * day) * dt, 0, 1);
    this.mist = THREE.MathUtils.damp(this.mist, this.mistTarget, this.mistTarget > this.mist ? 0.8 : 0.15, dt);
    this.mistTarget = Math.max(0, this.mistTarget - dt * 0.02);
    this.updateRain(dt, time);
    this.updateMist(dt, time);
  }

  private updateRain(dt: number, time: number) {
    const g = this.rainLines.geometry;
    const pos = g.attributes.position as THREE.BufferAttribute;
    const al = g.attributes.aA as THREE.BufferAttribute;
    // spawn under raining clouds
    for (const c of this.clouds.clouds) {
      if (c.rain < 0.02) continue;
      let n = Math.floor(c.rain * 260 * dt + Math.random());
      for (const d of this.drops) {
        if (n <= 0) break;
        if (d.alive) continue;
        const p = c.puffs[Math.floor(Math.random() * c.puffs.length)];
        d.p.set(c.centre.x + p.x + (Math.random() - 0.5) * p.w * 1.4, c.centre.y + p.y - p.w * 0.5, c.centre.z + p.z + (Math.random() - 0.5) * p.w * 1.2);
        d.v.set(this.wind.x * 0.25, -1.6 - Math.random() * 0.5, this.wind.z * 0.25);
        d.alive = true;
        n--;
      }
    }
    let i = 0;
    for (const d of this.drops) {
      if (d.alive) {
        d.v.y -= 2 * dt;
        d.p.addScaledVector(d.v, dt);
        const ground = this.surface.heightAt(d.p.x, d.p.z);
        const floor = Math.max(ground, poolDistance(d.p.x, d.p.z) < 0 ? WATER_LEVEL : ground);
        if (d.p.y <= floor || Math.abs(d.p.x) > TANK.w / 2 || Math.abs(d.p.z) > TANK.d / 2) {
          d.alive = false;
          if (floor <= WATER_LEVEL + 0.0005 && poolDistance(d.p.x, d.p.z) < 0) {
            if (Math.random() < 0.35) this.water.addRipple(d.p.x, d.p.z, 0.6, time);
          }
          this.spawnSplash(d.p.x, floor, d.p.z);
        }
      }
      const len = 0.012;
      pos.setXYZ(i * 2, d.p.x, d.alive ? d.p.y : -10, d.p.z);
      pos.setXYZ(i * 2 + 1, d.p.x - d.v.x * len / 2, d.alive ? d.p.y - d.v.y * len / 2 * 0.5 + len : -10, d.p.z - d.v.z * len / 2);
      al.setX(i * 2, 0.9);
      al.setX(i * 2 + 1, 0.0);
      i++;
    }
    pos.needsUpdate = true;
    al.needsUpdate = true;
    const sp = this.splashPoints.geometry.attributes.position as THREE.BufferAttribute;
    const sl = this.splashPoints.geometry.attributes.aLife as THREE.BufferAttribute;
    this.splashes.forEach((s, k) => {
      if (s.life > 0) {
        s.life -= dt * 4;
        s.v.y -= 9.8 * dt * 0.4;
        s.p.addScaledVector(s.v, dt);
      }
      sp.setXYZ(k, s.p.x, s.life > 0 ? s.p.y : -10, s.p.z);
      sl.setX(k, Math.max(0, s.life));
    });
    sp.needsUpdate = true;
    sl.needsUpdate = true;
  }

  private spawnSplash(x: number, y: number, z: number) {
    let n = 2;
    for (const s of this.splashes) {
      if (n <= 0) break;
      if (s.life > 0) continue;
      const a = Math.random() * Math.PI * 2, v = 0.08 + Math.random() * 0.12;
      s.p.set(x, y + 0.001, z);
      s.v.set(Math.cos(a) * v, 0.25 + Math.random() * 0.25, Math.sin(a) * v);
      s.life = 1;
      n--;
    }
  }

  private updateMist(dt: number, time: number) {
    const m = this.mistSprites.material as THREE.ShaderMaterial;
    m.uniforms.uMist.value = this.mist;
    m.uniforms.uTime.value = time;
    const pos = this.mistSprites.geometry.attributes.position as THREE.BufferAttribute;
    const size = this.mistSprites.geometry.attributes.aSize as THREE.BufferAttribute;
    this.mistData.forEach((d, i) => {
      d.v.x += (this.wind.x * 0.2 + Math.sin(time * 0.2 + i) * 0.002) * dt;
      d.v.z += (this.wind.z * 0.2 + Math.cos(time * 0.17 + i * 1.7) * 0.002) * dt;
      d.v.multiplyScalar(1 - dt * 0.5);
      d.p.addScaledVector(d.v, dt);
      const hx = TANK.w / 2 - 0.05, hz = TANK.d / 2 - 0.04;
      if (Math.abs(d.p.x) > hx) {d.p.x = Math.sign(d.p.x) * hx; d.v.x *= -0.5;}
      if (Math.abs(d.p.z) > hz) {d.p.z = Math.sign(d.p.z) * hz; d.v.z *= -0.5;}
      d.p.y = this.surface.heightAt(d.p.x, d.p.z) + 0.03 + Math.sin(time * 0.3 + i) * 0.01;
      pos.setXYZ(i, d.p.x, d.p.y, d.p.z);
      size.setX(i, d.s);
    });
    pos.needsUpdate = true;
    size.needsUpdate = true;
  }

  setPixelScale(pixelsPerUnit: number) {
    (this.mistSprites.material as THREE.ShaderMaterial).uniforms.uScale.value = pixelsPerUnit;
  }
}

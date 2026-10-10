import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL, poolDistance} from './Ground';
import type {WindField} from './WindField';

const MAX_DROPS = 2600;
const MAX_CROWNS = 160;
const MAX_BITS = 500;
const TERMINAL = 1.15; // m/s

export interface RainSource {x: number; y: number; z: number; radius: number; rate: number; vx: number; vz: number; cloud: {id: number}}

/**
 * Rain from the clouds: drops fall, drift with the air and land; each landing
 * throws up a crown and droplets (a jet and a ring on water), wets the ground
 * where it fell and disturbs the pool. Streaks are lit by the lamp and glint
 * when backlit; heavy rain also shows as grey shafts under the cloud.
 */
export class Rain {
  readonly group = new THREE.Group();
  private drops: {p: THREE.Vector3; v: THREE.Vector3; alive: boolean; seed: number}[] = [];
  private streaks: THREE.Mesh;
  private iPos: Float32Array;
  private iVel: Float32Array;
  private iSeed: Float32Array;
  private crowns: {p: THREE.Vector3; age: number; life: number; water: boolean; size: number}[] = [];
  private crownMesh: THREE.Mesh;
  private cPos: Float32Array;
  private cAux: Float32Array;
  private bits: {p: THREE.Vector3; v: THREE.Vector3; life: number}[] = [];
  private bitPoints: THREE.Points;
  private shafts: THREE.Mesh;
  private shaftSlots = new Map<number, {seeds: number[]; amt: number; x: number; z: number; y: number; r: number; seen: boolean}>();
  readonly uniforms = {
    uLight: {value: new THREE.Color(1, 0.85, 0.65)},
    uLightPos: {value: new THREE.Vector3(0, 1.1, 0.3)},
    uAmbient: {value: new THREE.Color(0.2, 0.2, 0.2)},
    uFlash: {value: 0},
    uRes: {value: new THREE.Vector2(1, 1)},
    uTime: {value: 0},
  };
  // wetness on the floor: R wet, G raining now
  readonly wetNx = 120;
  readonly wetNz = 50;
  private wet: Float32Array;
  private rainNow: Float32Array;
  private wetPixels: Uint16Array;
  readonly wetTexture: THREE.DataTexture;
  private wetDirty = 0;
  amount = 0; // total rain rate
  onWaterDrop?: (x: number, z: number, strength: number) => void;
  onLand?: () => void;
  private time = 0;

  constructor(private heightAt: (x: number, z: number) => number, private wind: WindField) {
    for (let i = 0; i < MAX_DROPS; i++) this.drops.push({p: new THREE.Vector3(), v: new THREE.Vector3(), alive: false, seed: Math.random()});
    // streaks: instanced camera-facing quads
    const quad = new THREE.InstancedBufferGeometry();
    quad.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0], 3));
    quad.setIndex([0, 1, 2, 1, 3, 2]);
    this.iPos = new Float32Array(MAX_DROPS * 3);
    this.iVel = new Float32Array(MAX_DROPS * 3);
    this.iSeed = new Float32Array(MAX_DROPS);
    quad.setAttribute('iPos', new THREE.InstancedBufferAttribute(this.iPos, 3).setUsage(THREE.DynamicDrawUsage));
    quad.setAttribute('iVel', new THREE.InstancedBufferAttribute(this.iVel, 3).setUsage(THREE.DynamicDrawUsage));
    quad.setAttribute('iSeed', new THREE.InstancedBufferAttribute(this.iSeed, 1).setUsage(THREE.DynamicDrawUsage));
    quad.instanceCount = 0;
    this.streaks = new THREE.Mesh(quad, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: /* glsl */ `
attribute vec3 iPos, iVel; attribute float iSeed;
uniform vec2 uRes; uniform vec3 uLight, uLightPos, uAmbient; uniform float uFlash;
varying vec2 vU; varying vec3 vCol;
void main(){
  float speed = length(iVel);
  vec3 axis = speed > 1e-4 ? iVel / speed : vec3(0.0, -1.0, 0.0);
  float len = clamp(speed * 0.012, 0.004, 0.02) * (0.8 + 0.4 * iSeed);
  float wid = mix(0.00024, 0.00045, fract(iSeed * 7.3));
  vec3 view = normalize(cameraPosition - iPos);
  vec3 side = normalize(cross(axis, view));
  float dist = length(cameraPosition - iPos);
  float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / dist;
  float widPx = max(wid * pxPerM, 1.0);
  float w = widPx / pxPerM;
  vec3 p = iPos + side * position.x * w - axis * len * position.y;
  vU = vec2(position.x, position.y);
  vec3 L = normalize(uLightPos - iPos);
  float fwd = max(0.0, dot(-view, L));
  float back = pow(fwd, 5.0) * 1.6 + pow(fwd, 40.0) * 3.0;
  vCol = ((uAmbient * 0.9 + uLight * (0.3 + back)) * (0.7 + 0.6 * iSeed) + vec3(0.8, 0.86, 1.0) * uFlash * 1.2) * 1.1 * sqrt(wid * pxPerM / widPx);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,
      fragmentShader: /* glsl */ `varying vec2 vU; varying vec3 vCol;
void main(){ float a = exp(-vU.x * vU.x * 2.6) * smoothstep(0.0, 0.14, vU.y) * (1.0 - vU.y) * 1.35; gl_FragColor = vec4(vCol * a, 0.0); }`,
    }));
    this.streaks.frustumCulled = false;
    this.streaks.renderOrder = 7;
    this.group.add(this.streaks);

    // splash crowns
    for (let i = 0; i < MAX_CROWNS; i++) this.crowns.push({p: new THREE.Vector3(), age: 1, life: 0.16, water: false, size: 1});
    const cg = new THREE.InstancedBufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute([-1, -0.35, 0, 1, -0.35, 0, -1, 1, 0, 1, 1, 0], 3));
    cg.setIndex([0, 1, 2, 1, 3, 2]);
    this.cPos = new Float32Array(MAX_CROWNS * 3);
    this.cAux = new Float32Array(MAX_CROWNS * 3);
    cg.setAttribute('iPos', new THREE.InstancedBufferAttribute(this.cPos, 3).setUsage(THREE.DynamicDrawUsage));
    cg.setAttribute('iAux', new THREE.InstancedBufferAttribute(this.cAux, 3).setUsage(THREE.DynamicDrawUsage));
    cg.instanceCount = MAX_CROWNS;
    this.crownMesh = new THREE.Mesh(cg, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: /* glsl */ `
attribute vec3 iPos, iAux; uniform vec3 uLight, uAmbient; uniform float uFlash;
varying vec2 vQ; varying vec3 vAux; varying vec3 vCol; varying float vSquash;
void main(){
  vAux = iAux;
  vec3 view = normalize(cameraPosition - iPos);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), view));
  float R = 0.0055 * iAux.z;
  vec3 p = iPos + right * position.x * R + vec3(0.0, 1.0, 0.0) * position.y * R;
  vQ = position.xy;
  vSquash = max(0.15, abs(view.y));
  vCol = uAmbient * 0.8 + uLight * 0.55 + vec3(0.8, 0.86, 1.0) * uFlash;
  gl_Position = iAux.x < 1.0 ? projectionMatrix * viewMatrix * vec4(p, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
}`,
      fragmentShader: /* glsl */ `varying vec2 vQ; varying vec3 vAux; varying vec3 vCol; varying float vSquash;
void main(){
  float t = vAux.x / 0.16;           // 0..1 over the crown's life
  float water = vAux.y;
  float R = (1.0 - exp(-16.0 * t * 0.16)) * 0.85 + 0.1;
  // ring on the ground (an ellipse seen from the camera's height)
  vec2 q = vec2(vQ.x, vQ.y / vSquash);
  float ring = exp(-pow((length(q) - R) / 0.07, 2.0)) * step(vQ.y, 0.05);
  float a = 0.0;
  if (water < 0.5) {
    // crown: fingers rising from the rim
    float H = 0.35 * sin(3.14159 * min(1.0, t * 1.2));
    float ang = atan(q.y, q.x);
    float fing = smoothstep(0.55, 0.95, cos(ang * 9.0));
    float rimX = abs(vQ.x) < R ? 1.0 : 0.0;
    float finger = rimX * fing * smoothstep(-0.02, 0.0, vQ.y) * (1.0 - smoothstep(H * 0.6, H, vQ.y)) * exp(-pow((abs(vQ.x) - R * 0.9) / 0.12, 2.0));
    a = ring * 0.8 + finger * 0.9;
  } else {
    // jet: a little column thrown up from the centre
    float H = 0.55 * sin(3.14159 * min(1.0, t));
    float jet = exp(-pow(vQ.x / 0.06, 2.0)) * step(0.0, vQ.y) * (1.0 - smoothstep(H * 0.7, H, vQ.y));
    a = ring * 0.5 + jet;
  }
  a *= (1.0 - t) * 0.3;
  gl_FragColor = vec4(vCol * a, 0.0);
}`,
    }));
    this.crownMesh.frustumCulled = false;
    this.crownMesh.renderOrder = 7;
    this.group.add(this.crownMesh);

    // droplets thrown up by splashes
    for (let i = 0; i < MAX_BITS; i++) this.bits.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: 0});
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_BITS * 3), 3).setUsage(THREE.DynamicDrawUsage));
    bg.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(MAX_BITS), 1).setUsage(THREE.DynamicDrawUsage));
    this.bitPoints = new THREE.Points(bg, new THREE.ShaderMaterial({
      uniforms: {...this.uniforms, uScale: {value: 900}},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: `attribute float aLife; varying float vL; uniform float uScale; void main(){ vL = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.2, 0.0011 * uScale / -mv.z); }`,
      fragmentShader: `uniform vec3 uLight, uAmbient; uniform float uFlash; varying float vL; void main(){ float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5)); gl_FragColor = vec4((uAmbient + uLight * 0.6 + uFlash) * a * vL * 0.7, 0.0); }`,
    }));
    this.bitPoints.frustumCulled = false;
    this.group.add(this.bitPoints);

    // rain shafts under heavy clouds: 3 ribbons per cloud, 14 segments
    const SH = 8 * 3, SEG = 14;
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SH * (SEG + 1) * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    sg.setAttribute('aUv', new THREE.BufferAttribute(new Float32Array(SH * (SEG + 1) * 2 * 4), 4).setUsage(THREE.DynamicDrawUsage));
    const sidx: number[] = [];
    for (let r = 0; r < SH; r++) for (let i = 0; i < SEG; i++) {
      const a = (r * (SEG + 1) + i) * 2;
      sidx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    sg.setIndex(sidx);
    this.shafts = new THREE.Mesh(sg, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: `attribute vec4 aUv; varying vec4 vUv; void main(){ vUv = aUv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `uniform float uTime, uFlash; uniform vec3 uLight, uAmbient; varying vec4 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float u = vUv.x, v = vUv.y, amt = vUv.z, seed = vUv.w;
  float streak = n(vec2(u * 14.0 + seed * 20.0, v * 3.0 + uTime * 3.4)) * 0.6 + n(vec2(u * 31.0 - seed * 7.0, v * 5.0 + uTime * 4.6)) * 0.4;
  float clump = n(vec2(u * 3.0 + seed, v * 1.2 + uTime * 0.8));
  float edge = 1.0 - u * u;
  float a = amt * (0.3 + 0.7 * streak) * (0.55 + 0.9 * clump) * 0.17 * edge * smoothstep(0.0, 0.12, v) * smoothstep(1.0, 0.85, v);
  vec3 col = (uAmbient * 1.2 + uLight * 0.25 + vec3(0.8, 0.86, 1.0) * uFlash) * 0.7;
  gl_FragColor = vec4(col * a, a);
}`,
    }));
    this.shafts.frustumCulled = false;
    this.shafts.renderOrder = 6;
    this.group.add(this.shafts);

    this.wet = new Float32Array(this.wetNx * this.wetNz);
    this.rainNow = new Float32Array(this.wetNx * this.wetNz);
    this.wetPixels = new Uint16Array(this.wetNx * this.wetNz * 4);
    this.wetTexture = new THREE.DataTexture(this.wetPixels, this.wetNx, this.wetNz, THREE.RGBAFormat, THREE.HalfFloatType);
    this.wetTexture.magFilter = this.wetTexture.minFilter = THREE.LinearFilter;
    this.wetTexture.needsUpdate = true;
  }

  setResolution(w: number, h: number) {this.uniforms.uRes.value.set(w, h);}
  setPixelScale(s: number) {(this.bitPoints.material as THREE.ShaderMaterial).uniforms.uScale.value = s;}

  /** Wetness under a point (0..1), for the brain and the plants. */
  wetAt(x: number, z: number) {
    const i = Math.min(this.wetNx - 1, Math.max(0, Math.floor((x + TANK.w / 2) / TANK.w * this.wetNx)));
    const j = Math.min(this.wetNz - 1, Math.max(0, Math.floor((z + TANK.d / 2) / TANK.d * this.wetNz)));
    return this.wet[j * this.wetNx + i];
  }

  private deposit(x: number, z: number) {
    const i = Math.min(this.wetNx - 1, Math.max(0, Math.floor((x + TANK.w / 2) / TANK.w * this.wetNx)));
    const j = Math.min(this.wetNz - 1, Math.max(0, Math.floor((z + TANK.d / 2) / TANK.d * this.wetNz)));
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ii = i + di, jj = j + dj;
      if (ii < 0 || jj < 0 || ii >= this.wetNx || jj >= this.wetNz) continue;
      const k = jj * this.wetNx + ii;
      const w = di === 0 && dj === 0 ? 1 : 0.4;
      this.wet[k] = Math.min(1, this.wet[k] + 0.012 * w);
      this.rainNow[k] = Math.min(1, this.rainNow[k] + 0.05 * w);
    }
  }

  private splash(x: number, y: number, z: number, water: boolean) {
    const c = this.crowns.find((q) => q.age >= q.life);
    if (c && Math.random() < 0.7) {c.p.set(x, y + 0.0004, z); c.age = 0; c.life = 0.16; c.water = water; c.size = 0.7 + Math.random() * 0.6;}
    let n = water ? 1 : 2 + (Math.random() < 0.5 ? 1 : 0);
    for (const b of this.bits) {
      if (n <= 0) break;
      if (b.life > 0) continue;
      const a = Math.random() * Math.PI * 2, s = 0.03 + Math.random() * 0.06;
      b.p.set(x, y + 0.001, z);
      b.v.set(Math.cos(a) * s, 0.12 + Math.random() * 0.15, Math.sin(a) * s);
      b.life = 1;
      n--;
    }
  }

  update(dt: number, sources: RainSource[], camera: THREE.Camera, day: number) {
    this.time += dt;
    this.uniforms.uTime.value = this.time;
    this.amount = sources.reduce((s, q) => s + q.rate, 0);
    // spawn
    const w2 = new THREE.Vector2();
    for (const src of sources) {
      const area = (src.radius / 0.05) ** 2;
      let n = Math.floor(650 * Math.pow(src.rate, 0.8) * area * dt + Math.random());
      for (const d of this.drops) {
        if (n <= 0) break;
        if (d.alive) continue;
        const a = Math.random() * Math.PI * 2;
        const r = src.radius * Math.min(1.2, 0.47 * Math.sqrt(-2 * Math.log(1 - 0.985 * Math.random())));
        d.p.set(src.x + Math.cos(a) * r, src.y - Math.random() * 0.01, src.z + Math.sin(a) * r);
        this.wind.sample(d.p.x, d.p.z, w2);
        d.v.set(src.vx + w2.x * 0.3, -0.35 - Math.random() * 0.2, src.vz + w2.y * 0.3);
        d.seed = Math.random();
        d.alive = true;
        n--;
      }
    }
    // fall
    let count = 0;
    for (const d of this.drops) {
      if (!d.alive) continue;
      this.wind.sample(d.p.x, d.p.z, w2);
      d.v.y = Math.max(-TERMINAL, d.v.y - 4 * dt);
      d.v.x += (w2.x * 0.8 - d.v.x) * (1 - Math.exp(-3 * dt));
      d.v.z += (w2.y * 0.8 - d.v.z) * (1 - Math.exp(-3 * dt));
      d.p.addScaledVector(d.v, dt);
      if (Math.abs(d.p.x) > TANK.w / 2 - 0.002 || Math.abs(d.p.z) > TANK.d / 2 - 0.002) {d.alive = false; continue;}
      const inPool = poolDistance(d.p.x, d.p.z) < 0;
      const floor = inPool ? WATER_LEVEL : this.heightAt(d.p.x, d.p.z);
      if (d.p.y <= floor) {
        d.alive = false;
        if (Math.random() < 0.6) this.splash(d.p.x, floor, d.p.z, inPool);
        if (inPool) {if (Math.random() < 0.5) this.onWaterDrop?.(d.p.x, d.p.z, 0.6 + Math.random() * 0.6);}
        else this.deposit(d.p.x, d.p.z);
        this.onLand?.();
        continue;
      }
      this.iPos.set([d.p.x, d.p.y, d.p.z], count * 3);
      this.iVel.set([d.v.x, d.v.y, d.v.z], count * 3);
      this.iSeed[count] = d.seed;
      count++;
    }
    const g = this.streaks.geometry as THREE.InstancedBufferGeometry;
    g.instanceCount = count;
    (g.attributes.iPos as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.iVel as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.iSeed as THREE.BufferAttribute).needsUpdate = true;
    this.streaks.visible = count > 0;
    // crowns
    let live = 0;
    this.crowns.forEach((c, i) => {
      if (c.age < c.life) {c.age += dt; live++;}
      this.cPos.set([c.p.x, c.p.y, c.p.z], i * 3);
      this.cAux.set([c.age < c.life ? c.age : 1, c.water ? 1 : 0, c.size], i * 3);
    });
    (this.crownMesh.geometry.attributes.iPos as THREE.BufferAttribute).needsUpdate = true;
    (this.crownMesh.geometry.attributes.iAux as THREE.BufferAttribute).needsUpdate = true;
    this.crownMesh.visible = live > 0;
    // droplets
    const bp = this.bitPoints.geometry.attributes.position as THREE.BufferAttribute;
    const bl = this.bitPoints.geometry.attributes.aLife as THREE.BufferAttribute;
    let bits = 0;
    this.bits.forEach((b, i) => {
      if (b.life > 0) {
        b.life -= dt * 3.2;
        b.v.y -= 2.8 * dt;
        b.p.addScaledVector(b.v, dt);
        bits++;
      }
      bp.setXYZ(i, b.p.x, b.life > 0 ? b.p.y : -10, b.p.z);
      bl.setX(i, Math.max(0, b.life));
    });
    bp.needsUpdate = bl.needsUpdate = true;
    this.bitPoints.visible = bits > 0;
    this.updateShafts(dt, sources, camera);
    // wetness dries, faster under the lamp and in the wind
    const dry = dt * (0.004 + 0.012 * day + 0.03 * this.wind.energy);
    const fade = Math.exp(-2.5 * dt);
    let any = false;
    for (let k = 0; k < this.wet.length; k++) {
      if (this.wet[k] > 0) {this.wet[k] = Math.max(0, this.wet[k] - dry); any = true;}
      if (this.rainNow[k] > 0) {this.rainNow[k] *= fade; if (this.rainNow[k] < 1e-3) this.rainNow[k] = 0; any = true;}
    }
    this.wetDirty -= dt;
    if (any && this.wetDirty <= 0) {
      this.wetDirty = 1 / 15;
      const toHalf = THREE.DataUtils.toHalfFloat;
      for (let k = 0; k < this.wet.length; k++) {
        this.wetPixels[k * 4] = toHalf(this.wet[k]);
        this.wetPixels[k * 4 + 1] = toHalf(this.rainNow[k]);
      }
      this.wetTexture.needsUpdate = true;
    }
  }

  private updateShafts(dt: number, sources: RainSource[], camera: THREE.Camera) {
    for (const s of this.shaftSlots.values()) s.seen = false;
    for (const src of sources) {
      let slot = this.shaftSlots.get(src.cloud.id);
      if (!slot) {
        if (this.shaftSlots.size >= 8) continue;
        slot = {seeds: [Math.random(), Math.random(), Math.random()], amt: 0, x: src.x, z: src.z, y: src.y, r: src.radius, seen: true};
        this.shaftSlots.set(src.cloud.id, slot);
      }
      slot.seen = true;
      const target = Math.min(1, Math.max(0, (src.rate - 0.45) / 0.9)) * Math.min(1, src.radius / 0.042);
      slot.amt += (target - slot.amt) * (1 - Math.exp(-2 * dt));
      slot.x = src.x; slot.z = src.z; slot.y = src.y; slot.r = src.radius;
    }
    for (const [id, s] of this.shaftSlots) {
      if (!s.seen) s.amt *= Math.exp(-2 * dt);
      if (!s.seen && s.amt < 0.01) this.shaftSlots.delete(id);
    }
    const pos = this.shafts.geometry.attributes.position as THREE.BufferAttribute;
    const uv = this.shafts.geometry.attributes.aUv as THREE.BufferAttribute;
    const SEG = 14;
    const view = new THREE.Vector3();
    let r = 0;
    for (const s of this.shaftSlots.values()) {
      for (let k = 0; k < 3; k++, r++) {
        const sd = s.seeds[k];
        const cx = s.x + (sd - 0.5) * s.r * 0.8, cz = s.z + (((sd * 7.3) % 1) - 0.5) * s.r * 0.6;
        const hw = s.r * (0.5 + 0.3 * sd);
        view.set(camera.position.x - cx, 0, camera.position.z - cz).normalize();
        const sx = -view.z, sz = view.x;
        const ground = this.heightAt(cx, cz);
        for (let i = 0; i <= SEG; i++) {
          const v = i / SEG;
          const y = s.y + (ground - s.y) * v;
          for (const side of [-1, 1]) {
            const q = (r * (SEG + 1) + i) * 2 + (side > 0 ? 1 : 0);
            pos.setXYZ(q, cx + sx * hw * side, y, cz + sz * hw * side);
            uv.setXYZW(q, side, v, s.amt, sd);
          }
        }
      }
    }
    for (; r < 24; r++) for (let i = 0; i <= SEG; i++) for (let side = 0; side < 2; side++) uv.setXYZW((r * (SEG + 1) + i) * 2 + side, 0, 0, 0, 0);
    pos.needsUpdate = uv.needsUpdate = true;
    this.shafts.visible = this.shaftSlots.size > 0;
  }
}

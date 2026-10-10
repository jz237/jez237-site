import * as THREE from 'three';
import {TANK} from './Case';
import type {FogField} from './FogField';
import type {WindField} from './WindField';

/**
 * Renders the fog field as a lit volume: rays are marched through a box over
 * the floor of the case, stopped by the depth of the scene, and shaped by 3-D
 * noise so the layer has a billowing top, wisps where it is thin and soft
 * erosion where it has settled. Light from the lamp scatters forward through
 * it. Freshly poured fog also throws off short-lived billows (sprites).
 */
export class FogVolume {
  readonly mesh: THREE.Mesh;
  readonly puffs: THREE.Points;
  readonly uniforms = {
    tFog: {value: null as THREE.Texture | null},
    uFogBox: {value: new THREE.Vector4(-TANK.w / 2, -TANK.d / 2, TANK.w, TANK.d)},
    tNoise: {value: null as THREE.Texture | null},
    tDepth: {value: null as THREE.Texture | null},
    uUseDepth: {value: 1},
    uInvProj: {value: new THREE.Matrix4()},
    uCamWorld: {value: new THREE.Matrix4()},
    uResolution: {value: new THREE.Vector2(1, 1)},
    uKeyPos: {value: new THREE.Vector3(0, 1, 0)},
    uKeyColor: {value: new THREE.Color(1, 0.85, 0.65)},
    uAmbient: {value: new THREE.Color(0.2, 0.18, 0.16)},
    uFlash: {value: 0},
    uTime: {value: 0},
    uDrift0: {value: new THREE.Vector3()},
    uDrift1: {value: new THREE.Vector3()},
    uBoxMin: {value: new THREE.Vector3()},
    uBoxMax: {value: new THREE.Vector3()},
    uSteps: {value: 36},
  };
  private puffData: {p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; size: number; alpha: number; lift: number}[] = [];
  private puffPos: Float32Array;
  private puffAux: Float32Array;
  readonly puffUniforms = {uScale: {value: 900}, uKeyColor: this.uniforms.uKeyColor, uAmbient: this.uniforms.uAmbient, uTime: this.uniforms.uTime, tNoise: this.uniforms.tNoise, uFlash: this.uniforms.uFlash};
  private windTmp = new THREE.Vector2();

  constructor(private field: FogField, noise: THREE.Texture, private wind: WindField) {
    this.uniforms.tFog.value = field.texture;
    this.uniforms.tNoise.value = noise;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0.5, 0.5, 0.5);
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.BackSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: FOG_FRAG,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.layers.set(1);
    this.mesh.renderOrder = 3;
    this.mesh.visible = false;
    this.mesh.name = 'fog-volume';

    const P = 72;
    for (let i = 0; i < P; i++) this.puffData.push({p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, max: 1, size: 0.02, alpha: 0, lift: 0.02});
    this.puffPos = new Float32Array(P * 3);
    this.puffAux = new Float32Array(P * 3);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(this.puffPos, 3).setUsage(THREE.DynamicDrawUsage));
    pg.setAttribute('aAux', new THREE.BufferAttribute(this.puffAux, 3).setUsage(THREE.DynamicDrawUsage));
    this.puffs = new THREE.Points(pg, new THREE.ShaderMaterial({
      uniforms: this.puffUniforms,
      transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `attribute vec3 aAux; varying vec3 vAux; uniform float uScale;
void main(){ vAux = aAux; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = aAux.x * uScale / -mv.z; }`,
      fragmentShader: /* glsl */ `precision highp sampler3D;
uniform sampler3D tNoise; uniform vec3 uKeyColor, uAmbient; uniform float uTime, uFlash; varying vec3 vAux;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c) * 2.0;
  vec4 n = texture(tNoise, vec3(c * 0.9 + vAux.z, uTime * 0.05 + vAux.z * 3.0));
  // cauliflower: a disc eroded by billows
  float edge = smoothstep(1.0, 0.35, r + (n.r - 0.5) * 0.7);
  float a = edge * (0.55 + 0.45 * n.g) * vAux.y;
  float lit = 0.6 + 0.4 * (0.5 - c.y);
  vec3 col = vec3(0.95, 0.96, 0.98) * (uKeyColor * 0.38 * lit + uAmbient * 0.9 + vec3(0.8, 0.85, 1.0) * uFlash * 0.6);
  gl_FragColor = vec4(col * a, a);
}`,
    }));
    this.puffs.frustumCulled = false;
    this.puffs.layers.set(1);
    this.puffs.renderOrder = 4;
  }

  /** Billows thrown off a pour, moving at (vx, vz) m/s. */
  emit(x: number, y: number, z: number, count: number, vx = 0, vz = 0) {
    for (let n = 0; n < count; n++) {
      let q = this.puffData.find((p) => p.life <= 0);
      if (!q) q = this.puffData.reduce((a, b) => (a.life < b.life ? a : b));
      const a = Math.random() * Math.PI * 2, s = 0.02 + Math.random() * 0.05;
      q.p.set(x + (Math.random() - 0.5) * 0.02, y, z + (Math.random() - 0.5) * 0.02);
      q.v.set(vx + Math.cos(a) * s, 0, vz + Math.sin(a) * s);
      q.max = 1.3 + Math.random() * 1.1;
      q.life = q.max;
      q.size = 0.034 * (0.55 + Math.random() * 0.35);
      q.alpha = 0.32 + Math.random() * 0.22;
      q.lift = 0.008 + Math.random() * 0.02;
    }
  }

  setPixelScale(s: number) {this.puffUniforms.uScale.value = s;}

  update(dt: number, time: number, camera: THREE.PerspectiveCamera, depth: THREE.Texture | null, width: number, height: number) {
    const u = this.uniforms;
    u.uTime.value = time;
    // the noise drifts with the mean wind, sinking slowly
    this.wind.sample(0, 0, this.windTmp);
    const amb = this.wind.ambient;
    u.uDrift0.value.x -= (amb.x * 0.6 + this.windTmp.x * 0.4) * 4.2 * 0.85 * dt;
    u.uDrift0.value.z -= (amb.y * 0.6 + this.windTmp.y * 0.4) * 4.2 * 0.85 * dt;
    u.uDrift0.value.y += 0.06 * dt;
    u.uDrift1.value.x -= (amb.x * 0.6 + this.windTmp.x * 0.4) * 8 * 1.25 * dt;
    u.uDrift1.value.z -= (amb.y * 0.6 + this.windTmp.y * 0.4) * 8 * 1.25 * dt;
    u.uDrift1.value.y += 0.35 * dt;
    u.tDepth.value = depth;
    u.uUseDepth.value = depth ? 1 : 0;
    u.uInvProj.value.copy(camera.projectionMatrixInverse);
    u.uCamWorld.value.copy(camera.matrixWorld);
    u.uResolution.value.set(width, height);
    const top = this.field.maxTop;
    this.mesh.visible = this.field.total > 2e-4 && top > 0;
    if (this.mesh.visible) {
      const y0 = 0.09, y1 = Math.min(TANK.h - 0.02, top + 0.035);
      this.mesh.position.set(-TANK.w / 2 + 0.002, y0, -TANK.d / 2 + 0.002);
      this.mesh.scale.set(TANK.w - 0.004, y1 - y0, TANK.d - 0.004);
      u.uBoxMin.value.set(-TANK.w / 2 + 0.002, y0, -TANK.d / 2 + 0.002);
      u.uBoxMax.value.set(TANK.w / 2 - 0.002, y1, TANK.d / 2 - 0.002);
    }
    // puffs
    let live = 0;
    this.puffData.forEach((q, i) => {
      if (q.life > 0) {
        q.life -= dt;
        this.wind.sample(q.p.x, q.p.z, this.windTmp);
        const k = 1 - Math.exp(-1.6 * dt);
        q.v.x += (this.windTmp.x * 0.8 - q.v.x) * k;
        q.v.z += (this.windTmp.y * 0.8 - q.v.z) * k;
        q.p.addScaledVector(q.v, dt);
        const g = this.field.groundAt(q.p.x, q.p.z) + q.lift;
        q.p.y += (g - q.p.y) * (1 - Math.exp(-3 * dt));
        q.p.x = Math.max(-TANK.w / 2 + 0.02, Math.min(TANK.w / 2 - 0.02, q.p.x));
        q.p.z = Math.max(-TANK.d / 2 + 0.02, Math.min(TANK.d / 2 - 0.02, q.p.z));
        live++;
      }
      const t = 1 - Math.max(0, q.life) / q.max;
      const env = q.life > 0 ? Math.min(1, t / 0.15) * Math.min(1, (1 - t) / 0.5) : 0;
      this.puffPos.set([q.p.x, q.life > 0 ? q.p.y : -10, q.p.z], i * 3);
      this.puffAux.set([q.size * (1 + t * 0.9), q.alpha * env, i * 0.137], i * 3);
    });
    this.puffs.visible = live > 0;
    (this.puffs.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.puffs.geometry.attributes.aAux as THREE.BufferAttribute).needsUpdate = true;
  }
}

const FOG_FRAG = /* glsl */ `
precision highp float;
precision highp sampler3D;
uniform sampler2D tFog, tDepth; uniform sampler3D tNoise;
uniform vec4 uFogBox; uniform float uUseDepth, uFlash, uTime; uniform int uSteps;
uniform mat4 uInvProj, uCamWorld; uniform vec2 uResolution;
uniform vec3 uKeyPos, uKeyColor, uAmbient, uDrift0, uDrift1, uBoxMin, uBoxMax;
varying vec3 vW;
float hg(float c, float g){ float g2 = g * g; return (1.0 - g2) / (12.566 * pow(1.0 + g2 - 2.0 * g * c, 1.5)); }
float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
vec2 boxHit(vec3 ro, vec3 rd){
  vec3 inv = 1.0 / rd;
  vec3 a = (uBoxMin - ro) * inv, b = (uBoxMax - ro) * inv;
  vec3 lo = min(a, b), hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}
float fogDensity(vec3 p, out float billow){
  vec4 f = texture2D(tFog, (p.xz - uFogBox.xy) / uFogBox.zw);
  billow = f.a;
  float D = f.r;
  if (D < 0.004) return 0.0;
  float H = max(0.0, f.g - f.b);
  vec4 nb = texture(tNoise, p * vec3(4.2, 9.0, 4.2) + uDrift0);
  vec4 nd = texture(tNoise, p * vec3(8.0, 13.0, 8.0) + uDrift1);
  float amp = clamp(H, 0.008, 0.1) * (0.55 + 0.45 * billow);
  float topN = f.g + ((nb.r - 0.5) * 1.1 + (nd.r - 0.5) * 0.18) * amp;
  float hf = clamp((p.y - f.b) / max(H, 1e-3), 0.0, 1.0);
  float prof = smoothstep(topN + 0.0015, topN - max(0.0035, 0.3 * H), p.y) * mix(1.22, 0.85, hf);
  // settled fog erodes softly (perlin); fresh fog is lumpy (worley); thin mist goes to tendrils
  float m = mix(nb.a, nb.g, billow) * 0.7 + nd.b * 0.3;
  return D * prof * mix(0.15 + 0.95 * m, 0.72 + 0.38 * m, smoothstep(0.35, 1.0, D));
}
void main(){
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vW - ro);
  vec2 h = boxHit(ro, rd);
  float t0 = max(h.x, 0.0), t1 = h.y;
  if (uUseDepth > 0.5) {
    t1 = min(t1, texture2D(tDepth, gl_FragCoord.xy / uResolution).r);
  }
  if (t1 <= t0) discard;
  int N = uSteps;
  float ds = (t1 - t0) / float(N);
  float t = t0 + ds * ign(gl_FragCoord.xy);
  vec3 col = vec3(0.0);
  float T = 1.0;
  const float sigma = 36.0;
  for (int i = 0; i < 64; i++) {
    if (i >= N || t > t1) break;
    vec3 p = ro + rd * t;
    float billow;
    float dens = fogDensity(p, billow);
    if (dens > 0.001) {
      vec3 L = normalize(uKeyPos - p);
      float b1, b2;
      float od = (fogDensity(p + L * 0.012, b1) * 0.012 + fogDensity(p + L * 0.035, b2) * 0.025) * sigma;
      float c = dot(rd, L);
      float ph0 = mix(hg(c, -0.2), hg(c, 0.72), 0.5);
      float ph1 = mix(hg(c, -0.1), hg(c, 0.4), 0.5);
      float ph2 = mix(hg(c, -0.05), hg(c, 0.18), 0.5);
      float lum = exp(-od) * ph0 + 0.5 * exp(-od * 0.3) * ph1 + 0.25 * exp(-od * 0.1) * ph2;
      vec3 amb = uAmbient * (0.55 + 0.45 * exp(-od * 0.35));
      vec3 Lin = uKeyColor * lum * 2.2 + amb + vec3(0.8, 0.85, 1.0) * uFlash * 1.4;
      float a = 1.0 - exp(-dens * sigma * ds);
      col += T * vec3(0.95, 0.96, 0.98) * Lin * a;
      T *= 1.0 - a;
      if (T < 0.02) break;
    }
    t += ds;
  }
  float alpha = 1.0 - T;
  if (alpha < 0.002) discard;
  gl_FragColor = vec4(col, alpha);
}`;

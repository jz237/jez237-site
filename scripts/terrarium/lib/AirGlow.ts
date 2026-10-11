import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL} from './Ground';

/**
 * The warm, faintly hazy air of a humid case under a lamp: light scattered by
 * the moisture in the air, brightest in the lamp's cone and broken into soft
 * shafts by whatever shades it (the rocks, the plants, the clouds). Rays are
 * marched through the case's air and stopped by the scene's depth; each step
 * asks the lamp's own shadow map and cloud-shadow map whether it is lit.
 */
export class AirGlow {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    tDist: {value: null as THREE.Texture | null},
    tKeyShadow: {value: null as THREE.Texture | null},
    tCloudShade: {value: null as THREE.Texture | null},
    uKeyMat: {value: new THREE.Matrix4()},
    uKeyPos: {value: new THREE.Vector3()},
    uKeyDir: {value: new THREE.Vector3(0, -1, 0)},
    uKeyColor: {value: new THREE.Color()},
    uCone: {value: new THREE.Vector2(0.7, 0.9)},
    uUseShadow: {value: 0},
    uDensity: {value: 1},
    uResolution: {value: new THREE.Vector2(1, 1)},
    uFrame: {value: 0},
    uSteps: {value: 12},
    uBoxMin: {value: new THREE.Vector3(-TANK.w / 2 + 0.004, WATER_LEVEL, -TANK.d / 2 + 0.004)},
    uBoxMax: {value: new THREE.Vector3(TANK.w / 2 - 0.004, TANK.h - 0.006, TANK.d / 2 - 0.004)},
  };
  /** 0..1: how much moisture hangs in the air (humidity, mist, rain). */
  moisture = 0.5;
  enabled = true;

  constructor() {
    const u = this.uniforms;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: u,
      transparent: true, depthWrite: false, depthTest: false, side: THREE.BackSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
precision highp float;
precision highp sampler2DShadow;
uniform sampler2D tDist, tCloudShade; uniform sampler2DShadow tKeyShadow;
uniform mat4 uKeyMat; uniform vec3 uKeyPos, uKeyDir, uKeyColor, uBoxMin, uBoxMax;
uniform vec2 uCone, uResolution; uniform float uUseShadow, uDensity, uFrame; uniform int uSteps;
varying vec3 vW;
float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
vec2 boxHit(vec3 ro, vec3 rd){
  vec3 safe = vec3(abs(rd.x) < 1e-5 ? 1e-5 : rd.x, abs(rd.y) < 1e-5 ? 1e-5 : rd.y, abs(rd.z) < 1e-5 ? 1e-5 : rd.z);
  vec3 inv = 1.0 / safe;
  vec3 a = (uBoxMin - ro) * inv, b = (uBoxMax - ro) * inv;
  vec3 lo = min(a, b), hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}
void main(){
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vW - ro);
  vec2 h = boxHit(ro, rd);
  float t0 = max(h.x, 0.0);
  float t1 = min(h.y, texture2D(tDist, gl_FragCoord.xy / uResolution).r);
  if (!(t1 > t0)) discard;
  float ds = (t1 - t0) / float(uSteps);
  // jittered start, moved on each frame so it reads as fine grain, never a fixed pattern
  float j = fract(ign(gl_FragCoord.xy) + uFrame * 0.618034);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 24; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * (t0 + (float(i) + j) * ds);
    vec3 L = uKeyPos - p;
    float d2 = max(dot(L, L), 1e-4);
    vec3 l = L * inversesqrt(d2);
    float cone = smoothstep(uCone.x, uCone.y, dot(-l, uKeyDir));
    vec4 sc = uKeyMat * vec4(p, 1.0);
    vec3 s = sc.xyz / max(sc.w, 1e-4);
    vec2 uv = clamp(s.xy, 0.0, 1.0);
    float lit = uUseShadow > 0.5 ? textureLod(tKeyShadow, vec3(uv, s.z - 0.0015), 0.0) : 1.0;
    vec3 cloud = textureLod(tCloudShade, uv, 0.0).rgb;
    // mostly forward scattering: brightest looking towards the lamp
    float c = dot(rd, -l);
    float g = 0.45, g2 = g * g;
    float phase = 0.25 + (1.0 - g2) / pow(max(1.0 + g2 - 2.0 * g * c, 1e-3), 1.5) * 0.12;
    acc += cloud * (cone * lit * phase / d2);
  }
  vec3 col = uKeyColor * acc * ds * uDensity;
  if (any(isnan(col)) || any(isinf(col))) discard;
  gl_FragColor = vec4(clamp(col, 0.0, 4.0), 0.0);
}`,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.layers.set(1);
    this.mesh.renderOrder = 1.9;
    this.mesh.name = 'air-glow';
    const mn = u.uBoxMin.value, mx = u.uBoxMax.value;
    this.mesh.position.copy(mn).add(mx).multiplyScalar(0.5);
    this.mesh.scale.copy(mx).sub(mn);
  }

  update(key: THREE.SpotLight, cloudShade: THREE.Texture, dist: THREE.Texture, width: number, height: number, frame: number) {
    const u = this.uniforms;
    u.tDist.value = dist;
    u.tCloudShade.value = cloudShade;
    const depth = key.shadow.map?.depthTexture ?? null;
    u.tKeyShadow.value = depth;
    u.uUseShadow.value = depth ? 1 : 0;
    u.uKeyMat.value.copy(key.shadow.matrix);
    u.uKeyPos.value.copy(key.position);
    u.uKeyDir.value.copy(key.target.position).sub(key.position).normalize();
    u.uCone.value.set(Math.cos(key.angle), Math.cos(key.angle * (1 - key.penumbra)));
    u.uKeyColor.value.copy(key.color).multiplyScalar(key.intensity);
    u.uDensity.value = 0.016 * (0.6 + 0.8 * this.moisture);
    u.uResolution.value.set(width, height);
    u.uFrame.value = frame % 1000;
    // (a shadow sampler must never see anything but the lamp's depth map)
    this.mesh.visible = this.enabled && key.intensity > 0.05 && !!dist && !!depth;
  }
}

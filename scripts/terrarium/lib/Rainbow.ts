import * as THREE from 'three';
import type {RainSource} from './Rain';

const MAX = 14;
/**
 * The lamp hangs nearly overhead, which would put a true bow below the floor
 * from the usual viewpoint; the bow is drawn as if the light came in this much
 * lower (its elevation scaled), as the sun does on a showery afternoon.
 */
const BOW_TILT = 0.63;

interface Sheet {x: number; z: number; bottom: number; top: number; half: number; amt: number; cloudR: number}

/**
 * A rainbow in falling water lit by the lamp. Each rain column (and each squeeze
 * of the misting bottle) is a soft sheet whose colour depends only on the angle
 * between the line of sight and the light: the primary bow at about 41° with red
 * outside, the brighter sky inside it, and a fainter secondary at about 51° with
 * the colours reversed. So it only shows with the lamp behind you, moves as you
 * move, and fades where the cloud shades its own rain.
 */
export class Rainbow {
  readonly mesh: THREE.Mesh;
  private sprays: {from: THREE.Vector3; to: THREE.Vector3; age: number}[] = [];
  private sheets: Sheet[] = [];
  readonly uniforms = {
    uAxis: {value: new THREE.Vector3(0, -1, 0)},
    uLightDir: {value: new THREE.Vector3(0, -1, 0)},
    uLight: {value: new THREE.Color(1, 0.9, 0.75)},
    uStrength: {value: 0},
    uTime: {value: 0},
  };

  constructor(private floorAt: (x: number, z: number) => number) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 4 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aQ', new THREE.BufferAttribute(new Float32Array(MAX * 4 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aCloud', new THREE.BufferAttribute(new Float32Array(MAX * 4 * 4), 4).setUsage(THREE.DynamicDrawUsage));
    const idx: number[] = [];
    for (let i = 0; i < MAX; i++) {const a = i * 4; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);}
    g.setIndex(idx);
    this.mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: /* glsl */ `
attribute vec3 aQ; attribute vec4 aCloud;
varying vec3 vQ; varying vec4 vCloud; varying vec3 vW;
void main(){
  vQ = aQ; vCloud = aCloud; vW = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}`,
      fragmentShader: /* glsl */ `
uniform vec3 uAxis, uLightDir, uLight; uniform float uStrength, uTime;
float rh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float rn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(rh(i), rh(i+vec2(1,0)), f.x), mix(rh(i+vec2(0,1)), rh(i+vec2(1,1)), f.x), f.y); }
varying vec3 vQ; varying vec4 vCloud; varying vec3 vW;
// 0 violet .. 1 red
vec3 spectrum(float t){
  vec3 c = vec3(smoothstep(0.45, 0.75, t) + 0.35 * (1.0 - smoothstep(0.0, 0.18, t)),
                exp(-pow((t - 0.5) / 0.2, 2.0)),
                exp(-pow((t - 0.15) / 0.17, 2.0)));
  return mix(c, vec3(dot(c, vec3(0.333))), 0.2);
}
float band(float t){ return smoothstep(-0.15, 0.12, t) * (1.0 - smoothstep(0.88, 1.15, t)); }
void main(){
  vec3 ray = normalize(vW - cameraPosition);
  float th = degrees(acos(clamp(dot(ray, uAxis), -1.0, 1.0)));
  // (the lamp is a broad source, which widens and softens the bands)
  float t1 = (th - 40.2) / 2.6;
  float t2 = 1.0 - (th - 50.0) / 3.6;
  vec3 col = spectrum(clamp(t1, 0.0, 1.0)) * band(t1)
           + spectrum(clamp(t2, 0.0, 1.0)) * band(t2) * 0.38
           + vec3(0.08) * smoothstep(26.0, 40.2, th) * step(th, 40.4);
  // how much falling water the eye looks through here
  float u = vQ.x, v = vQ.y;
  float dens = exp(-u * u * 3.6) * smoothstep(0.0, 0.18, v) * smoothstep(1.0, 0.7, v) * vQ.z;
  // it lives in the falling drops: streaky, and moving down with them
  dens *= 0.6 + 0.55 * rn(vec2(u * 16.0, v * 4.0 + uTime * 3.2));
  // the cloud shades the top of its own rain: light reaches it slanting in under the edge
  float lit = 1.0;
  if (vCloud.z > 0.0) {
    float up = max(0.0, vCloud.w - vW.y) / max(0.2, -uLightDir.y);
    vec2 back = vW.xz - uLightDir.xz * up;
    lit = smoothstep(vCloud.z * 0.6, vCloud.z * 1.25, length(back - vCloud.xy));
  }
  gl_FragColor = vec4(col * uLight * dens * lit * uStrength * 1.35, 0.0);
}`,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 6;
    this.mesh.name = 'rainbow';
  }

  /** The misting bottle's spray, from the nozzle to where it lands. */
  spray(from: THREE.Vector3, to: THREE.Vector3) {
    // held on one spot, the puffs keep the same cloud of mist going (no stacking)
    const same = this.sprays.find((p) => p.to.distanceTo(to) < 0.03);
    if (same) {same.from.copy(from); same.to.copy(to); same.age = Math.min(same.age, 0.15); return;}
    if (this.sprays.length > 4) this.sprays.shift();
    this.sprays.push({from: from.clone(), to: to.clone(), age: 0});
  }

  /**
   * @param strength 0..1 how strongly the lamp shines (day, clear sky)
   * @param light the lamp's colour now
   */
  update(dt: number, sources: RainSource[], camera: THREE.Camera, keyPos: THREE.Vector3, keyTarget: THREE.Vector3, light: THREE.Color, strength: number) {
    const L = keyTarget.clone().sub(keyPos).normalize();
    const u = this.uniforms;
    u.uLightDir.value.copy(L);
    const e = Math.asin(THREE.MathUtils.clamp(L.y, -1, 1)) * BOW_TILT;
    const h = Math.hypot(L.x, L.z) || 1;
    u.uAxis.value.set(Math.cos(e) * L.x / h, Math.sin(e), Math.cos(e) * L.z / h);
    u.uLight.value.copy(light);
    u.uStrength.value = strength;
    u.uTime.value += dt;
    this.sheets.length = 0;
    for (const s of sources) {
      if (this.sheets.length >= MAX) break;
      this.sheets.push({x: s.x, z: s.z, bottom: this.floorAt(s.x, s.z), top: s.y, half: s.radius * 1.45, amt: Math.min(1.2, s.rate) * 0.8, cloudR: s.radius / 0.72});
    }
    for (const p of this.sprays) p.age += dt;
    this.sprays = this.sprays.filter((p) => p.age < 1.6);
    for (const p of this.sprays) {
      if (this.sheets.length >= MAX) break;
      const k = Math.min(1, p.age / 0.15) * (1 - Math.min(1, p.age / 1.6));
      const x = (p.from.x + p.to.x) / 2, z = (p.from.z + p.to.z) / 2;
      this.sheets.push({x, z, bottom: p.to.y - 0.01, top: Math.max(p.from.y, p.to.y + 0.06), half: 0.06, amt: 0.7 * k, cloudR: 0});
    }
    const g = this.mesh.geometry;
    const pos = g.attributes.position as THREE.BufferAttribute, q = g.attributes.aQ as THREE.BufferAttribute, cl = g.attributes.aCloud as THREE.BufferAttribute;
    const view = new THREE.Vector3();
    for (let i = 0; i < MAX; i++) {
      const s = this.sheets[i];
      for (let k = 0; k < 4; k++) {
        const side = k & 1 ? 1 : -1, top = k & 2 ? 1 : 0;
        if (!s) {pos.setXYZ(i * 4 + k, 0, -1, 0); q.setXYZ(i * 4 + k, 0, 0, 0); continue;}
        // a vertical sheet turned to face the eye
        view.set(camera.position.x - s.x, 0, camera.position.z - s.z).normalize();
        pos.setXYZ(i * 4 + k, s.x - view.z * s.half * side, top ? s.top : s.bottom, s.z + view.x * s.half * side);
        q.setXYZ(i * 4 + k, side, top, s.amt);
        cl.setXYZW(i * 4 + k, s.x, s.z, s.cloudR, s.top);
      }
    }
    pos.needsUpdate = q.needsUpdate = cl.needsUpdate = true;
    this.mesh.visible = this.sheets.length > 0 && strength > 0.01;
  }
}

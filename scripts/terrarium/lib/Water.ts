import * as THREE from 'three';
import {TANK} from './Case';
import {groundHeight, poolDistance, WATER_LEVEL, POOL} from './Ground';
import type {Surface} from './Surface';
import type {Ledge} from './Peaks';

const HZ = TANK.d / 2;

/** Ground-height texture over the pool so the water knows its own depth. */
function bedTexture(x0: number, x1: number, z0: number, z1: number, n = 128) {
  const data = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = x0 + (i / (n - 1)) * (x1 - x0), z = z0 + (j / (n - 1)) * (z1 - z0);
    data[j * n + i] = groundHeight(x, z);
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RedFormat, THREE.FloatType);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export interface Ripple {x: number; z: number; t0: number; strength: number}

const commonGLSL = /* glsl */ `
float wh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(wh(i), wh(i+vec2(1,0)), u.x), mix(wh(i+vec2(0,1)), wh(i+vec2(1,1)), u.x), u.y); }
`;

export class Water {
  readonly group = new THREE.Group();
  readonly uniforms = {
    uTime: {value: 0},
    tRefract: {value: null as THREE.Texture | null},
    tReflect: {value: null as THREE.Texture | null},
    tBed: {value: null as THREE.Texture | null},
    uResolution: {value: new THREE.Vector2(1, 1)},
    uBedBox: {value: new THREE.Vector4()},
    uReflectMatrix: {value: new THREE.Matrix4()},
    uKeyDir: {value: new THREE.Vector3(0, 1, 0)},
    uKeyColor: {value: new THREE.Color(1, 0.85, 0.65)},
    uImpact: {value: new THREE.Vector3(0.06, WATER_LEVEL, 0.07)},
    uRipples: {value: Array.from({length: 12}, () => new THREE.Vector4(0, 0, -100, 0))},
    uRain: {value: 0},
    uAmbient: {value: 1},
  };
  readonly reflectRT: THREE.WebGLRenderTarget;
  private mirrorCam = new THREE.PerspectiveCamera();
  private ripples: Ripple[] = [];
  readonly fall: THREE.Mesh;
  readonly spray: THREE.Points;
  private sprayData: {p: THREE.Vector3; v: THREE.Vector3; life: number; max: number}[] = [];
  readonly surfaceMesh: THREE.Mesh;

  constructor(surface: Surface, private ledges: Ledge[]) {
    const x0 = POOL.cx - POOL.rx * 1.25, x1 = Math.min(TANK.w / 2, POOL.cx + POOL.rx * 1.25);
    const z0 = POOL.cz - POOL.rz * 1.3, z1 = HZ;
    this.uniforms.tBed.value = bedTexture(x0, x1, z0, z1);
    this.uniforms.uBedBox.value.set(x0, z0, x1 - x0, z1 - z0);
    this.reflectRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType});

    // Pool surface
    const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0 - 0.0015, 1, 1);
    geo.rotateX(-Math.PI / 2);
    geo.translate((x0 + x1) / 2, WATER_LEVEL, (z0 + z1 - 0.0015) / 2);
    this.surfaceMesh = new THREE.Mesh(geo, this.surfaceMaterial());
    this.surfaceMesh.layers.set(1);
    this.surfaceMesh.renderOrder = 2;
    this.group.add(this.surfaceMesh);

    // Water seen through the front glass, from the bed up to the surface.
    const face = new THREE.PlaneGeometry(x1 - x0, WATER_LEVEL, 1, 1);
    face.translate((x0 + x1) / 2, WATER_LEVEL / 2, HZ - 0.0012);
    const faceMesh = new THREE.Mesh(face, this.faceMaterial());
    faceMesh.layers.set(1);
    faceMesh.renderOrder = 3;
    this.group.add(faceMesh);

    // Cascade ribbons.
    this.fall = new THREE.Mesh(this.cascadeGeometry(surface), this.fallMaterial());
    this.fall.layers.set(1);
    this.fall.renderOrder = 4;
    this.group.add(this.fall);
    const last = this.cascadePoints[this.cascadePoints.length - 1];
    this.uniforms.uImpact.value.set(last.x, WATER_LEVEL, last.z);

    // Spray and mist at the foot of the falls.
    const N = 260;
    const sp = new THREE.BufferGeometry();
    sp.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    sp.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(N), 1));
    for (let i = 0; i < N; i++) this.sprayData.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: Math.random(), max: 1});
    this.spray = new THREE.Points(sp, new THREE.ShaderMaterial({
      uniforms: {uScale: {value: 900}, uLight: {value: 1}},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float aLife; varying float vL; uniform float uScale;
void main(){ vL = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uScale * (0.004 + 0.012 * (1.0 - aLife)) / -mv.z; }`,
      fragmentShader: `uniform float uLight; varying float vL; void main(){ vec2 c = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.0, length(c)); gl_FragColor = vec4(vec3(0.85, 0.8, 0.72) * a * vL * 0.18 * uLight, 0.0); }`,
    }));
    this.spray.frustumCulled = false;
    this.spray.layers.set(1);
    this.spray.renderOrder = 5;
    this.group.add(this.spray);
  }

  private cascadePoints: THREE.Vector3[] = [];

  /** Builds the flow path from the gap between the peaks down the ledges into the pool. */
  private cascadeGeometry(surface: Surface) {
    const top = (x: number, z: number) => surface.heightAt(x, z);
    // Free falls follow a short parabola away from each lip.
    const fallTo = (a: THREE.Vector3, b: THREE.Vector3, n: number, out: THREE.Vector3[]) => {
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const p = new THREE.Vector3().lerpVectors(a, b, Math.sqrt(t) * 0.45 + t * 0.55);
        p.y = a.y + (b.y - a.y) * t * t;
        out.push(p);
      }
    };
    // Sliding sheets hug the ledge top.
    const slide = (a: THREE.Vector3, b: THREE.Vector3, n: number, out: THREE.Vector3[]) => {
      for (let i = 1; i <= n; i++) {
        const p = new THREE.Vector3().lerpVectors(a, b, i / n);
        p.y = Math.max(p.y, top(p.x, p.z) + 0.0035);
        out.push(p);
      }
    };
    const pts: THREE.Vector3[] = [];
    let prev: THREE.Vector3 | null = null;
    this.ledges.forEach((l, i) => {
      const start = new THREE.Vector3(l.cx - 0.004, 0, l.cz - l.hd * 0.55);
      start.y = top(start.x, start.z) + 0.0035;
      const lip = new THREE.Vector3(l.cx + 0.004, 0, l.cz + l.hd * 0.95);
      lip.y = top(lip.x, lip.z) + 0.003;
      if (prev) fallTo(prev, start, 8 + i, pts);
      else pts.push(start.clone().add(new THREE.Vector3(0, 0.003, -0.008)), start);
      slide(start, lip, 5, pts);
      prev = lip;
    });
    fallTo(prev!, new THREE.Vector3(prev!.x + 0.012, WATER_LEVEL, prev!.z + 0.03), 9, pts);
    this.cascadePoints = pts;
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const segs = 120, across = 6;
    const pos: number[] = [], uv: number[] = [], aux: number[] = [], idx: number[] = [];
    const len = curve.getLength();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      // Width grows as the sheet spreads down the cascade.
      const w = 0.016 + 0.022 * t + 0.008 * Math.sin(t * 9.0);
      const side = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      const steep = Math.min(1, Math.max(0, -tan.y * 1.4));
      const normal = new THREE.Vector3().crossVectors(side, tan).normalize();
      for (let j = 0; j <= across; j++) {
        const v = j / across - 0.5;
        const bulge = (1 - 4 * v * v) * 0.003;
        pos.push(p.x + side.x * v * w + normal.x * bulge, p.y + side.y * v * w + normal.y * bulge, p.z + side.z * v * w + normal.z * bulge);
        uv.push(j / across, t * len);
        aux.push(steep, t);
      }
    }
    for (let i = 0; i < segs; i++) for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j, b = a + across + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('aFlow', new THREE.Float32BufferAttribute(aux, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  private surfaceMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
varying vec3 vW; varying vec4 vClip;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vClip = projectionMatrix * viewMatrix * w; gl_Position = vClip; }`,
      fragmentShader: /* glsl */ `
uniform float uTime, uRain; uniform sampler2D tRefract, tReflect, tBed; uniform vec2 uResolution; uniform vec4 uBedBox;
uniform mat4 uReflectMatrix; uniform vec3 uKeyDir, uKeyColor, uImpact; uniform vec4 uRipples[12];
varying vec3 vW; varying vec4 vClip;
${commonGLSL}
float waveH(vec2 p){
  float h = 0.0;
  h += (wn(p * 90.0 + vec2(uTime * 0.21, uTime * 0.13)) - 0.5) * 0.0005;
  h += (wn(p * 210.0 - vec2(uTime * 0.31, -uTime * 0.27)) - 0.5) * 0.00025;
  // rings spreading from the foot of the falls
  float d = distance(p, uImpact.xz);
  h += sin(d * 520.0 - uTime * 22.0) * 0.00028 * exp(-d * 28.0) * smoothstep(0.004, 0.012, d);
  for (int i = 0; i < 12; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 2.0) continue;
    float rd = distance(p, r.xy);
    float front = age * 0.11;
    h += sin((rd - front) * 900.0) * exp(-pow((rd - front) * 140.0, 2.0)) * r.w * 0.0006 * (1.0 - age / 2.0);
  }
  return h;
}
void main(){
  vec2 bedUv = (vW.xz - uBedBox.xy) / uBedBox.zw;
  float bed = texture2D(tBed, bedUv).r;
  float depth = ${WATER_LEVEL.toFixed(4)} - bed;
  if (depth < -0.0005) discard;
  float e = 0.0004;
  float h0 = waveH(vW.xz);
  vec3 n = normalize(vec3(-(waveH(vW.xz + vec2(e, 0.0)) - h0) / e, 1.0, -(waveH(vW.xz + vec2(0.0, e)) - h0) / e));
  vec3 V = normalize(cameraPosition - vW);
  float cosT = max(dot(n, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec2 suv = gl_FragCoord.xy / uResolution;
  // refraction: shift the view of the bed by the surface slope, more where it is deep
  vec2 roff = n.xz * clamp(depth, 0.0, 0.06) * 2.2;
  vec3 below = texture2D(tRefract, suv + roff).rgb;
  vec3 absorb = exp(-depth * vec3(14.0, 7.0, 10.0));
  vec3 scatter = vec3(0.012, 0.02, 0.012) * (1.0 - absorb.g);
  below = below * absorb + scatter;
  // planar reflection
  vec4 rc = uReflectMatrix * vec4(vW, 1.0);
  vec2 ruv = rc.xy / rc.w + n.xz * 0.04;
  vec3 refl = texture2D(tReflect, ruv).rgb;
  vec3 H = normalize(uKeyDir + V);
  float spec = pow(max(dot(n, H), 0.0), 900.0) * 18.0 + pow(max(dot(n, H), 0.0), 120.0) * 0.4;
  float foamD = distance(vW.xz, uImpact.xz);
  float foam = smoothstep(0.035, 0.0, foamD) * smoothstep(0.35, 0.75, wn(vW.xz * 300.0 + vec2(uTime * 0.6, -uTime)) + 0.3 * smoothstep(0.03, 0.0, foamD));
  vec3 col = below * (1.0 - F) + refl * F + uKeyColor * spec + foam * vec3(0.7, 0.68, 0.62) * 0.6;
  float edge = smoothstep(0.0, 0.004, depth);
  gl_FragColor = vec4(col, edge);
}`,
    });
  }

  private faceMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
uniform float uTime; uniform sampler2D tRefract, tBed; uniform vec2 uResolution; uniform vec4 uBedBox;
varying vec3 vW;
${commonGLSL}
void main(){
  vec2 bedUv = (vec2(vW.x, ${(HZ - 0.004).toFixed(4)}) - uBedBox.xy) / uBedBox.zw;
  float bed = texture2D(tBed, bedUv).r;
  float surf = ${WATER_LEVEL.toFixed(4)} + sin(vW.x * 400.0 + uTime * 3.0) * 0.0002;
  if (vW.y > surf || vW.y < bed - 0.0005) discard;
  vec2 suv = gl_FragCoord.xy / uResolution;
  float wob = (wn(vec2(vW.x * 160.0, uTime * 0.7)) - 0.5) * 0.002;
  vec3 c = texture2D(tRefract, suv + vec2(wob, 0.0)).rgb;
  float d = surf - vW.y;
  c *= exp(-vec3(5.0, 2.6, 3.8) * (0.05 + d * 0.6));
  c += vec3(0.008, 0.016, 0.01);
  // bright meniscus where the surface meets the glass
  float men = exp(-pow((surf - vW.y) / 0.0012, 2.0));
  c += vec3(0.35, 0.36, 0.3) * men;
  gl_FragColor = vec4(c, 1.0);
}`,
    });
  }

  private fallMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: `attribute vec2 aFlow; varying vec2 vUv; varying vec2 vFlow; varying vec3 vW; varying vec3 vN;
void main(){ vUv = uv; vFlow = aFlow; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
uniform float uTime, uAmbient; uniform sampler2D tRefract; uniform vec2 uResolution; uniform vec3 uKeyDir, uKeyColor;
varying vec2 vUv; varying vec2 vFlow; varying vec3 vW; varying vec3 vN;
${commonGLSL}
void main(){
  if (vW.y < ${WATER_LEVEL.toFixed(4)} - 0.0008) discard;
  float steep = vFlow.x;
  float speed = mix(0.12, 0.42, steep);
  float u = vUv.x, v = vUv.y;
  vec2 fp = vec2(u * 9.0, v * 26.0 - uTime * speed * 26.0);
  float streak = wn(vec2(u * 26.0, v * 7.0 - uTime * speed * 7.0)) * 0.6 + wn(fp) * 0.4;
  float churn = wn(vec2(u * 40.0, v * 60.0 - uTime * speed * 60.0));
  float edge = smoothstep(0.0, 0.18, u) * smoothstep(1.0, 0.82, u);
  float aer = mix(0.25, 0.85, steep);
  float foam = smoothstep(0.45 - aer * 0.3, 0.9, streak * 0.7 + churn * 0.45) * edge;
  vec3 n = normalize(vN * (gl_FrontFacing ? 1.0 : -1.0));
  vec3 V = normalize(cameraPosition - vW);
  vec2 suv = gl_FragCoord.xy / uResolution;
  vec3 behind = texture2D(tRefract, suv + vec2((streak - 0.5) * 0.012, 0.0)).rgb;
  float F = 0.02 + 0.98 * pow(1.0 - abs(dot(n, V)), 5.0);
  vec3 lit = uKeyColor * (0.35 + 0.65 * max(dot(n, uKeyDir), 0.0)) * 0.9 + vec3(0.12, 0.1, 0.08) * uAmbient;
  vec3 col = mix(behind * vec3(0.86, 0.92, 0.9), lit * vec3(0.92, 0.93, 0.95), foam * 0.9);
  float spec = pow(max(dot(reflect(-uKeyDir, n), V), 0.0), 60.0) * (0.3 + streak);
  col += uKeyColor * spec * 0.6 + F * 0.15;
  // fade in at the source, out into the pool
  float a = edge * smoothstep(0.0, 0.04, vFlow.y) * (0.55 + 0.45 * foam);
  a *= smoothstep(1.0, 0.94, vFlow.y) * 0.6 + 0.4;
  gl_FragColor = vec4(col, a);
}`,
    });
  }

  setLight(level: number, keyColor: THREE.Color) {
    this.uniforms.uKeyColor.value.copy(keyColor).multiplyScalar(level);
    this.uniforms.uAmbient.value = 0.15 + 0.85 * level;
    (this.spray.material as THREE.ShaderMaterial).uniforms.uLight.value = 0.1 + 0.9 * level;
  }

  addRipple(x: number, z: number, strength: number, time: number) {
    if (poolDistance(x, z) > 0.1) return;
    this.ripples.push({x, z, t0: time, strength});
    if (this.ripples.length > 12) this.ripples.shift();
    this.ripples.forEach((r, i) => this.uniforms.uRipples.value[i].set(r.x, r.z, r.t0, r.strength));
  }

  update(dt: number, time: number, flow: number) {
    this.uniforms.uTime.value = time;
    const pos = this.spray.geometry.attributes.position as THREE.BufferAttribute;
    const life = this.spray.geometry.attributes.aLife as THREE.BufferAttribute;
    const impact = this.uniforms.uImpact.value;
    this.sprayData.forEach((d, i) => {
      d.life -= dt / d.max;
      if (d.life <= 0) {
        d.max = 0.6 + Math.random() * 1.4;
        d.life = 1;
        d.p.set(impact.x + (Math.random() - 0.5) * 0.02, impact.y + 0.002, impact.z + (Math.random() - 0.5) * 0.02);
        const a = Math.random() * Math.PI * 2, s = 0.02 + Math.random() * 0.06 * flow;
        d.v.set(Math.cos(a) * s, 0.03 + Math.random() * 0.08 * flow, Math.sin(a) * s);
      }
      d.v.y -= dt * 0.12;
      d.v.multiplyScalar(1 - dt * 1.5);
      d.p.addScaledVector(d.v, dt);
      if (d.p.y < WATER_LEVEL) d.p.y = WATER_LEVEL;
      pos.setXYZ(i, d.p.x, d.p.y, d.p.z);
      life.setX(i, d.life);
    });
    pos.needsUpdate = true;
    life.needsUpdate = true;
  }

  /** Renders the mirrored view used by the pool surface. */
  renderReflection(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, width: number, height: number) {
    const w = Math.max(1, Math.floor(width / 2)), h = Math.max(1, Math.floor(height / 2));
    if (this.reflectRT.width !== w || this.reflectRT.height !== h) this.reflectRT.setSize(w, h);
    const m = this.mirrorCam;
    m.copy(camera);
    m.layers.set(0);
    const reflectY = (v: THREE.Vector3) => v.set(v.x, 2 * WATER_LEVEL - v.y, v.z);
    const eye = reflectY(camera.position.clone());
    const dir = camera.getWorldDirection(new THREE.Vector3());
    dir.y = -dir.y;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    up.y = -up.y;
    m.position.copy(eye);
    m.up.copy(up);
    m.lookAt(eye.clone().add(dir));
    m.updateMatrixWorld();
    m.projectionMatrix.copy(camera.projectionMatrix);
    m.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    // texture matrix: world -> reflection uv
    this.uniforms.uReflectMatrix.value.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(m.projectionMatrix).multiply(m.matrixWorldInverse);
    const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -WATER_LEVEL + 0.0005);
    const prevClip = renderer.clippingPlanes;
    renderer.clippingPlanes = [clip];
    renderer.setRenderTarget(this.reflectRT);
    renderer.clear();
    renderer.render(scene, m);
    renderer.clippingPlanes = prevClip;
    this.uniforms.tReflect.value = this.reflectRT.texture;
  }
}

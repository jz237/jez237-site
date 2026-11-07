// Effects: lit dust and smoke, additive sparks/fire/glints, rock chips and gold that bounce on the tile floors,
// water splashes and bubbles, drips, spores and embers. Lights for flashes come from the renderer's fixed pool
// (never add or remove lights at runtime: every material would recompile). Purely visual (Math.random).
import * as THREE from '../vendor/three.module.min.js';

export const CALM = { on: false };

const PVERT = /* glsl */ `
attribute float aSize; attribute float aAlpha; attribute vec3 aColor; attribute float aRot;
varying float vAlpha; varying vec3 vColor; varying float vRot; varying vec3 vW;
uniform float uScale;
void main(){
  vAlpha = aAlpha; vColor = aColor; vRot = aRot;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mv = viewMatrix * wp;
  gl_PointSize = aSize * uScale / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
// alpha particles are lit by the lamp (a cone from uLampPos along uLampDir) and a soft ambient; additive ones glow
const PFRAG = /* glsl */ `
uniform sampler2D uTex; uniform float uAdd; uniform vec3 uAmb; uniform vec3 uLampPos; uniform vec3 uLampDir; uniform vec3 uLampCol;
uniform vec4 uPts[6];
varying float vAlpha; varying vec3 vColor; varying float vRot; varying vec3 vW;
void main(){
  vec2 p = gl_PointCoord - 0.5;
  float c = cos(vRot), s = sin(vRot);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
  vec4 t = texture2D(uTex, p);
  float a = t.a * vAlpha;
  if (a < 0.003) discard;
  vec3 col;
  if (uAdd > 0.5) col = vColor * t.rgb;
  else {
    vec3 d = vW - uLampPos; float l = length(d);
    float cone = smoothstep(0.55, 0.92, dot(d / max(l, 1e-3), uLampDir)) / (1.0 + l * l * 0.035);
    vec3 lit = uAmb + uLampCol * cone * 2.2;
    for (int i = 0; i < 6; i++) { vec4 q = uPts[i]; if (q.w <= 0.0) continue; float dd = length(vW - q.xyz); lit += vec3(1.0, 0.62, 0.32) * q.w / (1.0 + dd * dd * 0.25); }
    col = vColor * lit;
  }
  gl_FragColor = vec4(col, a);
}`;

class Pool {
  constructor(n, tex, additive, scale, U) {
    this.n = n; this.i = 0;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 3); this.size = new Float32Array(n); this.alpha = new Float32Array(n); this.col = new Float32Array(n * 3); this.rot = new Float32Array(n);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aRot', new THREE.BufferAttribute(this.rot, 1).setUsage(THREE.DynamicDrawUsage));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.mat = new THREE.ShaderMaterial({ vertexShader: PVERT, fragmentShader: PFRAG, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { uTex: { value: tex }, uScale: { value: scale }, uAdd: { value: additive ? 1 : 0 }, ...U } });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 4 : 3;
    this.p = [];
    for (let k = 0; k < n; k++) this.p.push({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s0: 1, s1: 1, a: 1, r: 1, g: 1, b: 1, rot: 0, vr: 0, drag: 0, grav: 0, fade: 0.3, floor: -1e9 });
    this.live = 0;
  }
  add(o) {
    const q = this.p[this.i]; this.i = (this.i + 1) % this.n;
    Object.assign(q, { drag: 0, grav: 0, fade: 0.3, vr: (Math.random() - 0.5) * 0.6, rot: Math.random() * 6.28, floor: -1e9 }, o);
    q.life = q.max;
    return q;
  }
  update(dt) {
    let live = 0;
    for (let k = 0; k < this.n; k++) {
      const q = this.p[k];
      if (q.life <= 0) { if (this.alpha[k] !== 0) this.alpha[k] = 0; continue; }
      live++;
      q.life -= dt;
      const f = 1 - Math.max(0, q.life) / q.max;
      const dr = Math.exp(-q.drag * dt);
      q.vx *= dr; q.vy = q.vy * dr - q.grav * dt; q.vz *= dr;
      q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.rot += q.vr * dt;
      if (q.y < q.floor) { q.y = q.floor; q.vy = 0; q.vx *= 0.5; }
      this.pos[k * 3] = q.x; this.pos[k * 3 + 1] = q.y; this.pos[k * 3 + 2] = q.z;
      this.size[k] = q.s0 + (q.s1 - q.s0) * Math.sqrt(f);
      const fin = Math.min(1, f / 0.08), fout = Math.min(1, (1 - f) / q.fade);
      this.alpha[k] = q.a * fin * fout;
      this.col[k * 3] = q.r; this.col[k * 3 + 1] = q.g; this.col[k * 3 + 2] = q.b; this.rot[k] = q.rot;
    }
    this.live = live;
    const g = this.points.geometry;
    for (const n of ['position', 'aSize', 'aAlpha', 'aColor', 'aRot']) g.attributes[n].needsUpdate = true;
  }
}

// a lumpy rock chip geometry
function chipGeometry() {
  const g = new THREE.IcosahedronGeometry(0.5, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = 0.7 + Math.random() * 0.45; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.8, p.getZ(i) * k); }
  g.computeVertexNormals();
  return g;
}

export class FX {
  constructor(scene, tex, q, solidAt, requestLight) {
    this.scene = scene; this.q = q; this.solidAt = solidAt; this.requestLight = requestLight;
    const scale = innerHeight * 0.9;
    this.U = { uAmb: { value: new THREE.Color(0.08, 0.07, 0.07) }, uLampPos: { value: new THREE.Vector3() }, uLampDir: { value: new THREE.Vector3(1, 0, 0) }, uLampCol: { value: new THREE.Color(1, 0.85, 0.6) },
      uPts: { value: [0, 1, 2, 3, 4, 5].map(() => new THREE.Vector4()) } };
    this.dustP = new Pool(q.dust, tex.soft, false, scale, this.U);
    this.fireP = new Pool(q.sparks, tex.spark, true, scale, this.U);
    this.glintP = new Pool(240, tex.glint, true, scale, this.U);
    scene.add(this.dustP.points, this.fireP.points, this.glintP.points);
    this.N = q.debris;
    this.chipMat = new THREE.MeshStandardMaterial({ color: 0x8a8076, roughness: 0.92 });
    this.goldMat = new THREE.MeshStandardMaterial({ color: 0xffc04a, roughness: 0.25, metalness: 1, emissive: 0x2a1800 });
    this.rockI = new THREE.InstancedMesh(chipGeometry(), this.chipMat, this.N);
    this.goldI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.5, 0), this.goldMat, 48);
    for (const m of [this.rockI, this.goldI]) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }
    this.deb = { rock: Array.from({ length: this.N }, () => ({ life: 0 })), gold: Array.from({ length: 48 }, () => ({ life: 0 })) };
    this.di = { rock: 0, gold: 0 };
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._s = new THREE.Vector3(); this._p = new THREE.Vector3();
    // shock rings on floors and walls
    this.rings = [];
    const ringMat = new THREE.MeshBasicMaterial({ map: tex.ring, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc890 });
    for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ringMat.clone()); m.visible = false; m.renderOrder = 5; scene.add(m); this.rings.push({ m, t: 0, max: 1, r: 1 }); }
    this.ri = 0;
    // scorch marks
    this.scorches = [];
    const sc = new THREE.MeshBasicMaterial({ map: tex.glow, transparent: true, depthWrite: false, color: 0x000000, opacity: 0.6, polygonOffset: true, polygonOffsetFactor: -4 });
    for (let i = 0; i < 20; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sc); m.visible = false; m.renderOrder = 1; scene.add(m); this.scorches.push(m); }
    this.si = 0;
    this.dustColor = new THREE.Color(0.7, 0.66, 0.6);
  }
  setLook(L) { this.dustColor.fromArray(L.dust); this.U.uAmb.value.fromArray(L.partAmb || [0.06, 0.055, 0.05]); this.chipMat.color.fromArray(L.rock).multiplyScalar(1.4); }

  dust(x, y, z, o = {}) {
    const n = o.n || 1, c = this.dustColor;
    for (let i = 0; i < n; i++) {
      const sp = o.spread ?? 0.5;
      this.dustP.add({ x: x + (Math.random() - 0.5) * sp, y: y + Math.random() * 0.2, z: z + (Math.random() - 0.5) * sp * 0.6,
        vx: (o.vx || 0) + (Math.random() - 0.5) * (o.jit ?? 1.5), vy: (o.vy ?? 0.6) + Math.random() * (o.up ?? 0.8), vz: (o.vz || 0) + (Math.random() - 0.5) * (o.jit ?? 1.5) * 0.6,
        s0: (o.s0 ?? 0.5) * (0.7 + Math.random() * 0.6), s1: (o.s1 ?? 1.8) * (0.7 + Math.random() * 0.6), max: (o.life ?? 2.2) * (0.7 + Math.random() * 0.6), a: o.a ?? 0.45,
        r: (o.col ? o.col[0] : c.r) * (o.k ?? 1), g: (o.col ? o.col[1] : c.g) * (o.k ?? 1), b: (o.col ? o.col[2] : c.b) * (o.k ?? 1), drag: o.drag ?? 1.4, grav: o.grav ?? 0.1, fade: 0.6 });
    }
  }
  sparks(x, y, z, o = {}) {
    const n = Math.round((o.n || 10) * (CALM.on ? 0.6 : 1));
    for (let i = 0; i < n; i++) {
      const a = (o.dir !== undefined ? o.dir + (Math.random() - 0.5) * (o.cone ?? 1.6) : Math.random() * Math.PI * 2), sp = (o.speed ?? 7) * (0.4 + Math.random());
      this.fireP.add({ x, y, z, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + (o.vy || 0), vz: (Math.random() - 0.5) * sp * 0.5,
        s0: o.s ?? 0.16, s1: (o.s ?? 0.16) * 0.3, max: (o.life ?? 0.45) * (0.5 + Math.random()), a: 1, r: o.r ?? 1, g: o.g ?? 0.72, b: o.b ?? 0.35, drag: 0.5, grav: o.grav ?? 9, fade: 0.5 });
    }
  }
  fire(x, y, z, o = {}) {
    const n = o.n || 6;
    for (let i = 0; i < n; i++) {
      this.fireP.add({ x: x + (Math.random() - 0.5) * (o.sp ?? 0.4), y: y + (Math.random() - 0.5) * (o.sp ?? 0.4) * 0.5, z: z + (Math.random() - 0.5) * (o.sp ?? 0.4),
        vx: (o.vx || 0) + (Math.random() - 0.5) * 0.8, vy: (o.vy ?? 1.2) + Math.random() * 1.6, vz: (Math.random() - 0.5) * 0.8,
        s0: (o.s ?? 0.7) * (0.6 + Math.random() * 0.6), s1: (o.s ?? 0.7) * 0.4, max: (o.life ?? 0.5) * (0.6 + Math.random() * 0.7), a: CALM.on ? 0.55 : 0.9,
        r: o.r ?? 1, g: (o.g ?? 0.5) + Math.random() * 0.2, b: o.b ?? 0.18, drag: 2.0, grav: -1.2, fade: 0.7 });
    }
  }
  glint(x, y, z, s = 0.5, col = [1, 0.85, 0.5]) {
    this.glintP.add({ x, y, z, vx: 0, vy: 0.1, vz: 0, s0: s, s1: s * 0.2, max: 0.45 + Math.random() * 0.3, a: 1, r: col[0], g: col[1], b: col[2], drag: 0, grav: 0, fade: 0.8, vr: 1.5 });
  }
  debris(x, y, z, o = {}) {
    const kind = o.gold ? 'gold' : 'rock', list = this.deb[kind], N = list.length;
    const n = o.n || 8;
    for (let i = 0; i < n; i++) {
      const d = list[this.di[kind]]; this.di[kind] = (this.di[kind] + 1) % N;
      const a = (o.dir !== undefined ? o.dir + (Math.random() - 0.5) * (o.cone ?? 2.4) : Math.random() * Math.PI * 2), sp = (o.speed ?? 5) * (0.4 + Math.random());
      Object.assign(d, { x: x + (Math.random() - 0.5) * (o.sp ?? 0.5), y: y + (Math.random() - 0.5) * (o.sp ?? 0.5), z: z + (Math.random() - 0.5) * 0.5,
        vx: Math.cos(a) * sp + (o.vx || 0), vy: Math.sin(a) * sp + (o.vy ?? 2), vz: (Math.random() - 0.5) * sp * 0.5 + 0.6,
        rx: Math.random() * 6, ry: Math.random() * 6, wx: (Math.random() - 0.5) * 14, wy: (Math.random() - 0.5) * 14,
        s: (o.size ?? 0.16) * (0.4 + Math.random() * 1.2), life: (o.life ?? 3.5) + Math.random() * 2, bounces: 0 });
    }
  }
  flash(x, y, z, intensity, color = 0xffa060, dur = 0.35, range = 16) { this.requestLight(x, y, z, intensity * (CALM.on ? 0.35 : 1), color, dur, range); }
  ring(x, y, z, r, color = 0xffc890, vertical = true) {
    const R = this.rings[this.ri]; this.ri = (this.ri + 1) % this.rings.length;
    R.m.position.set(x, y, z); R.m.rotation.set(vertical ? 0 : -Math.PI / 2, 0, 0); R.t = 0; R.max = 0.55; R.r = r; R.m.visible = true; R.m.material.color.set(color);
  }
  scorch(x, y, z, r, vertical) {
    const m = this.scorches[this.si]; this.si = (this.si + 1) % this.scorches.length;
    m.position.set(x, y, z); m.rotation.set(vertical ? 0 : -Math.PI / 2, 0, Math.random() * 6); m.scale.set(r * 2.4, r * 2.4, 1); m.visible = true;
  }
  // dynamite: flash, fireball, sparks, rock chips, a slow cloud that hangs in the lamp light
  explode(x, y, z, size = 1, o = {}) {
    this.flash(x, y + 0.4, z + 1, 60 * size, o.color || 0xffa060, 0.45 + size * 0.1, 22);
    this.fire(x, y, z, { n: Math.round(10 + size * 10), s: 1.4 + size * 0.8, sp: 0.9 * size, life: 0.6, vy: 1.5 });
    this.sparks(x, y, z, { n: Math.round(24 + size * 14), speed: 9 + size * 3 });
    this.debris(x, y, z, { n: Math.round(10 + size * 8), speed: 6 + size * 2, size: 0.16 + size * 0.06 });
    this.dust(x, y, z, { n: Math.round(14 + size * 10), s0: 1.2 + size * 0.6, s1: 3.8 + size * 2.2, life: 5 + size * 1.5, vy: 0.4, up: 1.0, jit: 3 + size, a: 0.5, drag: 0.8, grav: -0.05, spread: 1.4 * size, k: 0.85 });
    this.ring(x, y, z + 0.3, 3 + size * 2.5);
  }
  splash(x, y, z, size = 1) {
    const n = Math.round((10 + size * 12) * (CALM.on ? 0.7 : 1));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (1 + Math.random() * 2.5) * (0.6 + size * 0.4);
      this.dustP.add({ x: x + Math.cos(a) * 0.3, y: y + 0.05, z: z + Math.sin(a) * 0.3, vx: Math.cos(a) * sp, vy: 3 + Math.random() * 4 * (0.6 + size * 0.4), vz: Math.sin(a) * sp * 0.6,
        s0: 0.22 + size * 0.12, s1: 0.8 + size * 0.5, max: 0.9 + Math.random() * 0.6, a: 0.55, r: 0.78, g: 0.88, b: 0.95, drag: 0.8, grav: 10, fade: 0.5 });
    }
    this.ring(x, y + 0.03, z, 1 + size, 0xbfe6ff, false);
  }
  bubbles(x, y, z, n = 3) {
    for (let i = 0; i < n; i++) this.glintP.add({ x: x + (Math.random() - 0.5) * 0.4, y, z: z + (Math.random() - 0.5) * 0.4, vx: 0, vy: 0.8 + Math.random(), vz: 0, s0: 0.12, s1: 0.18, max: 0.8 + Math.random() * 0.6, a: 0.5, r: 0.6, g: 0.85, b: 1, drag: 1, grav: -1, fade: 0.4 });
  }
  clear() {
    for (const P of [this.dustP, this.fireP, this.glintP]) for (const q of P.p) q.life = 0;
    for (const k in this.deb) for (const d of this.deb[k]) d.life = 0;
    for (const R of this.rings) R.m.visible = false;
    for (const m of this.scorches) m.visible = false;
  }
  update(dt) {
    this.dustP.update(dt); this.fireP.update(dt); this.glintP.update(dt);
    for (const kind of ['rock', 'gold']) {
      const list = this.deb[kind], inst = kind === 'rock' ? this.rockI : this.goldI;
      for (let i = 0; i < list.length; i++) {
        const d = list[i];
        if (d.life <= 0) { if (!d.hidden) { this._m.makeScale(0, 0, 0); inst.setMatrixAt(i, this._m); d.hidden = true; } continue; }
        d.hidden = false;
        d.life -= dt;
        d.vy -= 16 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt; d.rx += d.wx * dt; d.ry += d.wy * dt;
        if (Math.abs(d.z) < 1.6 && this.solidAt(d.x, d.y - d.s * 0.4)) {
          if (d.vy < 0) { d.y = Math.floor(d.y - d.s * 0.4) + 1 + d.s * 0.4; if (d.vy < -2 && d.bounces < 3) { d.vy *= -0.32; d.vx *= 0.6; d.wx *= 0.5; d.bounces++; } else { d.vy = 0; d.vx *= 0.85; d.wx *= 0.85; d.wy *= 0.85; } }
          else d.vy = 0;
        }
        if (this.solidAt(d.x + Math.sign(d.vx) * d.s, d.y) && Math.abs(d.z) < 1.6) d.vx *= -0.4;
        const sc = d.s * Math.min(1, d.life / 0.6);
        this._e.set(d.rx, d.ry, 0); this._q.setFromEuler(this._e); this._s.set(sc, sc, sc); this._p.set(d.x, d.y, d.z);
        this._m.compose(this._p, this._q, this._s);
        inst.setMatrixAt(i, this._m);
      }
      inst.instanceMatrix.needsUpdate = true;
    }
    for (const R of this.rings) {
      if (!R.m.visible) continue;
      R.t += dt;
      const f = R.t / R.max;
      if (f >= 1) { R.m.visible = false; continue; }
      const s = R.r * (0.3 + f * 1.2);
      R.m.scale.set(s, s, 1);
      R.m.material.opacity = (1 - f) * (CALM.on ? 0.3 : 0.65);
    }
  }
}

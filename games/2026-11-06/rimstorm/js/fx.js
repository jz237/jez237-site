// Effects (adapted from Swarmbreak for the tube): soft lit smoke that lingers and spreads, additive sparks
// and fire, tumbling rock and metal debris drifting in low gravity, shock rings facing down the tube and a
// FIXED pool of flash lights (only their intensity changes, never their number or visibility).
// Purely visual (uses Math.random), never touches the simulation.
import * as THREE from '../vendor/three.module.min.js';
import { rockGeometry } from './models.js?v=10';

export const CALM = { on: false };
const _pc = new THREE.Color();

const PVERT = /* glsl */ `
attribute float aSize; attribute float aAlpha; attribute vec3 aColor; attribute float aRot;
varying float vAlpha; varying vec3 vColor; varying float vRot;
uniform float uScale;
void main(){
  vAlpha = aAlpha; vColor = aColor; vRot = aRot;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const PFRAG = /* glsl */ `
uniform sampler2D uTex; uniform vec3 uLight; uniform float uAdd;
varying float vAlpha; varying vec3 vColor; varying float vRot;
void main(){
  vec2 p = gl_PointCoord - 0.5;
  float c = cos(vRot), s = sin(vRot);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
  vec4 t = texture2D(uTex, p);
  float a = t.a * vAlpha;
  if (a < 0.003) discard;
  // dust is lit from the upper side by the sun; sparks glow
  vec3 col = uAdd > 0.5 ? vColor * t.rgb : vColor * (uLight * (0.55 + 0.45 * (1.0 - p.y)));
  gl_FragColor = vec4(col, a);
}`;

class Pool {
  constructor(n, tex, additive, scale) {
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
      uniforms: { uTex: { value: tex }, uScale: { value: scale }, uLight: { value: new THREE.Vector3(1, 1, 1) }, uAdd: { value: additive ? 1 : 0 } } });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 3 : 2;
    this.p = [];
    for (let k = 0; k < n; k++) this.p.push({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s0: 1, s1: 1, a: 1, r: 1, g: 1, b: 1, rot: 0, vr: 0, drag: 0, grav: 0, fade: 0.3 });
  }
  add(o) {
    const q = this.p[this.i]; this.i = (this.i + 1) % this.n;
    Object.assign(q, { drag: 0, grav: 0, fade: 0.3, vr: (Math.random() - 0.5) * 0.6, rot: Math.random() * 6.28 }, o);
    q.life = q.max;
    return q;
  }
  update(dt) {
    for (let k = 0; k < this.n; k++) {
      const q = this.p[k];
      if (q.life <= 0) { this.alpha[k] = 0; continue; }
      q.life -= dt;
      const f = 1 - Math.max(0, q.life) / q.max;
      const dr = Math.exp(-q.drag * dt);
      q.vx *= dr; q.vy = q.vy * dr - q.grav * dt; q.vz *= dr;
      q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.rot += q.vr * dt;
      this.pos[k * 3] = q.x; this.pos[k * 3 + 1] = q.y; this.pos[k * 3 + 2] = q.z;
      this.size[k] = q.s0 + (q.s1 - q.s0) * Math.sqrt(f);
      const fin = Math.min(1, f / 0.08), fout = Math.min(1, (1 - f) / q.fade);
      this.alpha[k] = q.a * fin * fout;
      this.col[k * 3] = q.r; this.col[k * 3 + 1] = q.g; this.col[k * 3 + 2] = q.b; this.rot[k] = q.rot;
    }
    const g = this.points.geometry;
    for (const n of ['position', 'aSize', 'aAlpha', 'aColor', 'aRot']) g.attributes[n].needsUpdate = true;
  }
}

export class FX {
  constructor(scene, T, q, heightAt) {
    this.scene = scene; this.q = q; this.heightAt = heightAt;
    const scale = innerHeight * 0.9;
    this.dustP = new Pool(q.dust, T.soft, false, scale);
    this.fireP = new Pool(q.sparks, T.spark, true, scale);
    scene.add(this.dustP.points, this.fireP.points);
    // debris: instanced rock chips + metal shards
    this.debrisN = q.debris;
    this.rockI = new THREE.InstancedMesh(rockGeometry(3, 0.7), new THREE.MeshStandardMaterial({ color: 0x9a968f, roughness: 0.95 }), this.debrisN);
    // metal shards: thin torn triangular plates of hull, bright steel with a hot glow (only values, same program)
    this.metalI = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 3).scale(1, 1, 0.55), new THREE.MeshStandardMaterial({ color: 0x4e535b, roughness: 0.32, metalness: 0.9, emissive: 0x5a2006, envMapIntensity: 0.6 }), this.debrisN);
    for (const m of [this.rockI, this.metalI]) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }
    this.deb = { rock: [], metal: [] };
    for (let i = 0; i < this.debrisN; i++) { this.deb.rock.push({ life: 0 }); this.deb.metal.push({ life: 0 }); }
    this.di = { rock: 0, metal: 0 };
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._s = new THREE.Vector3(); this._p = new THREE.Vector3();
    // flash lights
    this.lights = [];
    for (let i = 0; i < q.flashLights; i++) { const l = new THREE.PointLight(0xffa060, 0, 30, 1.6); scene.add(l); this.lights.push({ l, t: 0, max: 1, i0: 0 }); }
    this.li = 0;
    // shock rings
    this.rings = [];
    const ringMat = new THREE.MeshBasicMaterial({ map: T.ring, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc890 });
    for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ringMat.clone()); m.visible = false; scene.add(m); this.rings.push({ m, t: 0, max: 1, r: 1 }); }
    this.ri = 0;
    this.grav = 1.2;
    this.dustColor = new THREE.Color(0.75, 0.73, 0.7);
  }
  setLook(L) { this.dustColor.set(L.dust); this.dustP.mat.uniforms.uLight.value.set(L.dustLight, L.dustLight, L.dustLight * 1.02); }

  dust(x, y, z, o = {}) {
    const n = o.n || 1, c = this.dustColor;
    for (let i = 0; i < n; i++) {
      const sp = o.spread ?? 0.5;
      this.dustP.add({ x: x + (Math.random() - 0.5) * sp, y: y + Math.random() * 0.2, z: z + (Math.random() - 0.5) * sp,
        vx: (o.vx || 0) + (Math.random() - 0.5) * (o.jit ?? 1.5), vy: (o.vy ?? 0.8) + Math.random() * (o.up ?? 1), vz: (o.vz || 0) + (Math.random() - 0.5) * (o.jit ?? 1.5),
        s0: (o.s0 ?? 0.6) * (0.7 + Math.random() * 0.6), s1: (o.s1 ?? 2.2) * (0.7 + Math.random() * 0.6), max: (o.life ?? 2.5) * (0.7 + Math.random() * 0.6), a: o.a ?? 0.5,
        r: c.r * (o.k ?? 1), g: c.g * (o.k ?? 1), b: c.b * (o.k ?? 1), drag: o.drag ?? 1.2, grav: o.grav ?? 0.15, fade: 0.6 });
    }
  }
  sparks(x, y, z, o = {}) {
    const n = Math.round((o.n || 10) * (CALM.on ? 0.6 : 1));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = Math.random() * Math.PI - (o.down ? 0.4 : 0), sp = (o.speed ?? 8) * (0.4 + Math.random());
      this.fireP.add({ x, y, z, vx: Math.cos(a) * Math.cos(e) * sp + (o.vx || 0), vy: Math.sin(e) * sp * 0.9 + (o.vy || 0), vz: Math.sin(a) * Math.cos(e) * sp * 0.9 + (o.vz || 0),
        s0: o.s ?? 0.22, s1: (o.s ?? 0.22) * 0.3, max: (o.life ?? 0.6) * (0.5 + Math.random()), a: 1, r: o.r ?? 1, g: o.g ?? 0.75, b: o.b ?? 0.4, drag: 0.6, grav: o.grav ?? 1.5, fade: 0.5 });
    }
  }
  fire(x, y, z, o = {}) {
    const n = o.n || 8;
    for (let i = 0; i < n; i++) {
      this.fireP.add({ x: x + (Math.random() - 0.5) * (o.sp ?? 1), y: y + (Math.random() - 0.5) * (o.sp ?? 1) * 0.6, z: z + (Math.random() - 0.5) * (o.sp ?? 1),
        vx: (o.vx || 0) + (Math.random() - 0.5) * 3, vy: 1 + Math.random() * 2.5, vz: (Math.random() - 0.5) * 3,
        s0: (o.s ?? 1.6) * (0.6 + Math.random() * 0.6), s1: (o.s ?? 1.6) * 2.0, max: (o.life ?? 0.55) * (0.6 + Math.random() * 0.7), a: CALM.on ? 0.35 : 0.55,
        r: 1, g: 0.55 + Math.random() * 0.2, b: 0.22, drag: 2.5, grav: -0.5, fade: 0.7 });
    }
  }
  debris(x, y, z, o = {}) {
    const kind = o.metal ? 'metal' : 'rock', list = this.deb[kind];
    const n = o.n || 8;
    for (let i = 0; i < n; i++) {
      const d = list[this.di[kind]]; this.di[kind] = (this.di[kind] + 1) % this.debrisN;
      const a = Math.random() * Math.PI * 2, sp = (o.speed ?? 6) * (0.4 + Math.random());
      Object.assign(d, { x: x + (Math.random() - 0.5) * (o.sp ?? 0.6), y: y + Math.random() * 0.4, z: z + (Math.random() - 0.5) * (o.sp ?? 0.6),
        vx: Math.cos(a) * sp * 0.8 + (o.vx || 0), vy: (Math.random() - 0.3) * sp, vz: Math.sin(a) * sp * 0.8 + (o.vz || 0),
        rx: Math.random() * 6, ry: Math.random() * 6, wx: (Math.random() - 0.5) * 14, wy: (Math.random() - 0.5) * 14,
        s: (o.size ?? 0.18) * (0.4 + Math.random() * 1.2), life: 3 + Math.random() * 2.5, bounces: 0, trail: o.trail ? 0.6 + Math.random() : 0 });
    }
  }
  flash(x, y, z, intensity, color = 0xffa060, dur = 0.35) {
    const k = CALM.on ? 0.35 : 1;
    const L = this.lights[this.li]; this.li = (this.li + 1) % this.lights.length;
    L.l.position.set(x, y + 0.6, z); L.l.color.set(color); L.t = dur; L.max = dur; L.i0 = intensity * k;
  }
  ring(x, y, z, r, color = 0xffc890, max = 0.6) {
    const R = this.rings[this.ri]; this.ri = (this.ri + 1) % this.rings.length;
    R.m.position.set(x, y, z); R.t = 0; R.max = max; R.r = r; R.m.visible = true; R.m.material.color.set(color); R.m.rotation.z = Math.random() * 6;
  }

  // a full explosion: flash, fire ball, sparks, debris, a slow dust cloud that hangs around
  explode(x, y, z, size, o = {}) {
    const g = this.heightAt(x, z);
    this.flash(x, y, z, 14 * size, o.color || 0xffa060, 0.3 + size * 0.1);
    this.fire(x, y, z, { n: Math.round(6 + size * 6), s: 0.9 + size * 0.7, sp: 0.6 * size, vx: o.vx });
    this.sparks(x, y, z, { n: Math.round(10 + size * 10), speed: 6 + size * 3, vx: o.vx });
    if (o.metal) this.debris(x, y, z, { metal: true, n: Math.round(4 + size * 4), speed: 5 + size * 2, size: 0.25 + size * 0.08, vx: o.vx, trail: true });
    if (o.rock !== false) this.debris(x, y, z, { n: Math.round(5 + size * 5), speed: 4 + size * 2, size: 0.12 + size * 0.06, vx: o.vx });
    void g;
    this.dust(x, y, z, { n: Math.round(5 + size * 4), s0: 0.6 + size * 0.3, s1: 2.2 + size * 1.4, life: 2.2 + size * 0.6, vy: 0.2, up: 0.6, jit: 2 + size, a: 0.4, k: o.smoke ?? 0.55, drag: 1, grav: 0.05, spread: 0.6 + size * 0.4 });
    this.ring(x, y, z, 1.6 + size * 2.2, o.ringColor || 0xffc890);
    if (o.shards) this.slag(x, y, z, size, o.vx);
  }
  // machine wreckage: extra torn hull shards plus long-lived hot slag sparks that arc and fall (no rock chips)
  slag(x, y, z, size, vx) {
    this.debris(x, y, z, { metal: true, n: Math.round(2 + size * 3), speed: 7 + size * 2, size: 0.18 + size * 0.06, vx, trail: false });
    this.sparks(x, y, z, { n: Math.round(8 + size * 8), speed: 5 + size * 2.5, s: 0.34, life: 1.1, grav: 4, vx, r: 1, g: 0.58, b: 0.22 });
    this.sparks(x, y, z, { n: Math.round(4 + size * 3), speed: 10 + size * 3, s: 0.16, life: 0.45, grav: 0.5, vx, r: 0.85, g: 0.95, b: 1 });
  }
  // a pop that keeps a minimum size on screen, for kills deep in the tube (dist = distance from the camera)
  pop(x, y, z, dist, color = 0xffa060) {
    const c = _pc.set(color), s = Math.max(0, dist) * 0.16;
    if (s < 5) return;
    this.fireP.add({ x, y, z, vx: 0, vy: 0, vz: 0, s0: s * 0.55, s1: s * 1.25, max: 0.32, a: CALM.on ? 0.45 : 0.95, r: c.r * 2.6 + 0.3, g: c.g * 2.4 + 0.25, b: c.b * 2 + 0.2, drag: 0, grav: 0, fade: 0.8, vr: 0 });
    this.fireP.add({ x, y, z, vx: 0, vy: 0, vz: 0, s0: s * 0.25, s1: s * 0.5, max: 0.2, a: 1, r: 3, g: 2.8, b: 2.4, drag: 0, grav: 0, fade: 0.9, vr: 0 });
    this.ring(x, y, z, s * 0.9, color, 0.45);
  }

  clear() {
    for (const P of [this.dustP, this.fireP]) for (const q of P.p) q.life = 0;
    for (const k of ['rock', 'metal']) for (const d of this.deb[k]) d.life = 0;
    for (const L of this.lights) L.t = 0;
    for (const R of this.rings) R.m.visible = false;
  }
  update(dt) {
    this.dustP.update(dt);
    this.fireP.update(dt);
    for (const kind of ['rock', 'metal']) {
      const list = this.deb[kind], inst = kind === 'rock' ? this.rockI : this.metalI;
      for (let i = 0; i < this.debrisN; i++) {
        const d = list[i];
        if (d.life <= 0) { this._m.makeScale(0, 0, 0); inst.setMatrixAt(i, this._m); continue; }
        d.life -= dt;
        d.vy -= this.grav * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt; d.rx += d.wx * dt; d.ry += d.wy * dt;
        const g = this.heightAt(d.x, d.z) + d.s * 0.4;
        if (d.y < g) {
          d.y = g;
          if (d.vy < -1.2 && d.bounces < 3) { d.vy *= -0.35; d.vx *= 0.6; d.vz *= 0.6; d.wx *= 0.5; d.wy *= 0.5; d.bounces++; if (d.bounces === 1) this.dust(d.x, g, d.z, { n: 1, s0: 0.3, s1: 1.1, life: 1.6, vy: 0.3, up: 0.4, jit: 0.6, a: 0.35 }); }
          else { d.vy = 0; d.vx *= 0.8; d.vz *= 0.8; d.wx *= 0.8; d.wy *= 0.8; }
        }
        if (d.trail > 0 && d.life > 2) { d.trail -= dt; if (Math.random() < 0.5) this.dustP.add({ x: d.x, y: d.y, z: d.z, vx: 0, vy: 0.3, vz: 0, s0: 0.3, s1: 1.2, max: 1.4, a: 0.35, r: 0.15, g: 0.14, b: 0.13, drag: 1, grav: -0.2, fade: 0.7 }); }
        const sc = d.s * Math.min(1, d.life / 0.6);
        this._e.set(d.rx, d.ry, 0); this._q.setFromEuler(this._e); this._s.set(sc, sc, sc); this._p.set(d.x, d.y, d.z);
        this._m.compose(this._p, this._q, this._s);
        inst.setMatrixAt(i, this._m);
      }
      inst.instanceMatrix.needsUpdate = true;
    }
    for (const L of this.lights) {
      // never toggle visibility: the light count must stay fixed or every material recompiles (a long freeze)
      if (L.t <= 0) { L.l.intensity = 0; continue; }
      L.t -= dt;
      const f = Math.max(0, L.t / L.max);
      L.l.intensity = L.i0 * f * f;
    }
    for (const R of this.rings) {
      if (!R.m.visible) continue;
      R.t += dt;
      const f = R.t / R.max;
      if (f >= 1) { R.m.visible = false; continue; }
      const s = R.r * (0.3 + f * 1.2);
      R.m.scale.set(s, s, 1);
      R.m.material.opacity = (1 - f) * (CALM.on ? 0.35 : 0.7);
    }
  }
}

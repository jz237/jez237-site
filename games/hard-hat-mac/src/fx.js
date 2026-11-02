// Pooled GPU point particles: additive (sparks, embers, fireworks) and alpha (dust, steam, confetti).
import * as THREE from 'three';
import { rr, TAU } from './util.js';

const C = new THREE.Color();

class Pool {
  constructor(n, additive) {
    this.n = n; this.i = 0;
    this.pos = new Float32Array(n * 3); this.vel = new Float32Array(n * 3); this.col = new Float32Array(n * 3);
    this.size = new Float32Array(n); this.alpha = new Float32Array(n); this.life = new Float32Array(n); this.max = new Float32Array(n);
    this.grav = new Float32Array(n); this.drag = new Float32Array(n); this.grow = new Float32Array(n); this.s0 = new Float32Array(n); this.flick = new Float32Array(n);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 600 } },
      vertexShader: `attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; uniform float uScale;
        void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / max(.1, -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vC; varying float vA;
        void main(){ float d = length(gl_PointCoord - .5); float a = vA * (1. - smoothstep(${additive ? '.05, .5' : '.25, .5'}, d)); if (a < .01) discard; gl_FragColor = vec4(vC, a); }`,
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false; this.points.renderOrder = additive ? 6 : 4;
  }
  emit(x, y, z, vx, vy, vz, color, size, life, grav = 0, drag = 0, grow = 0, flick = 0) {
    const i = this.i; this.i = (this.i + 1) % this.n;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    C.set(color); this.col[i * 3] = C.r; this.col[i * 3 + 1] = C.g; this.col[i * 3 + 2] = C.b;
    this.s0[i] = size; this.size[i] = size; this.life[i] = life; this.max[i] = life; this.grav[i] = grav; this.drag[i] = drag; this.grow[i] = grow; this.alpha[i] = 1; this.flick[i] = flick;
  }
  update(dt) {
    const { pos, vel, life, max, size, alpha, grav, drag, grow, s0, flick } = this;
    for (let i = 0; i < this.n; i++) {
      if (life[i] <= 0) { if (alpha[i] !== 0) { alpha[i] = 0; } continue; }
      life[i] -= dt; const k = Math.max(0, life[i] / max[i]);
      const dk = Math.exp(-drag[i] * dt);
      vel[i * 3] *= dk; vel[i * 3 + 1] = vel[i * 3 + 1] * dk - grav[i] * dt; vel[i * 3 + 2] *= dk;
      pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      size[i] = s0[i] * (1 + grow[i] * (1 - k));
      alpha[i] = Math.min(1, k * 2.5) * (flick[i] ? .6 + .4 * Math.random() : 1);
    }
    const a = this.points.geometry.attributes;
    a.position.needsUpdate = a.size.needsUpdate = a.alpha.needsUpdate = a.color.needsUpdate = true;
  }
  clear() { this.life.fill(0); this.alpha.fill(0); }
}

export class FX {
  constructor(scene, quality) {
    this.add = new Pool(quality >= 2 ? 5000 : 2500, true);
    this.alpha = new Pool(quality >= 2 ? 3000 : 1600, false);
    scene.add(this.add.points, this.alpha.points);
    this.q = quality;
    // fixed light pool: adding lights at runtime would force every material to recompile
    this.flashes = [0, 1].map(() => { const l = new THREE.PointLight(0xffffff, 0, 60, 1.5); scene.add(l); return { l, t: 0 }; });
    this.fi = 0;
  }
  setScale(h, fov) { const s = h / (2 * Math.tan(fov * Math.PI / 360)); this.add.mat.uniforms.uScale.value = s; this.alpha.mat.uniforms.uScale.value = s; }
  sparks(p, n, color = 0xffd27a) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * TAU, u = rr(-.2, 1), s = rr(2, 6);
      this.add.emit(p.x, p.y, p.z, Math.cos(a) * s * Math.sqrt(1 - u * u), u * s + 1.5, Math.sin(a) * s * Math.sqrt(1 - u * u), color, rr(.03, .07), rr(.25, .6), 14, 1.2);
    }
  }
  dust(p, n) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * TAU, s = rr(.6, 2.2);
      this.alpha.emit(p.x + rr(-.2, .2), p.y + rr(0, .2), p.z + rr(-.2, .2), Math.cos(a) * s, rr(.2, 1.2), Math.sin(a) * s, 0x9a8a72, rr(.25, .45), rr(.6, 1.2), -.4, 2.5, 2.2);
    }
  }
  steam(p, n, speed = 4) {
    for (let k = 0; k < n; k++) this.alpha.emit(p.x + rr(-.25, .25), p.y, p.z + rr(-.25, .25), rr(-.4, .4), speed * rr(.7, 1.2), rr(-.4, .4), 0xe8ecef, rr(.3, .55), rr(.7, 1.3), -.5, 1.2, 3);
  }
  embers(p, n) {
    for (let k = 0; k < n; k++) this.add.emit(p.x + rr(-.3, .3), p.y, p.z + rr(-.3, .3), rr(-.6, .6), rr(.8, 3), rr(-.6, .6), Math.random() < .5 ? 0xff8a2a : 0xffc04a, rr(.04, .09), rr(.8, 2), -.3, .6, 0, 1);
  }
  pour(p, n) {
    for (let k = 0; k < n; k++) this.add.emit(p.x + rr(-.1, .1), p.y, p.z + rr(-.15, .15), rr(-.2, .2), rr(-1, 0), rr(-.2, .2), 0xffa040, rr(.14, .24), rr(.9, 1.2), 9, 0, -.3);
  }
  confetti(p, n) {
    const cols = [0xffc21a, 0xff4a3a, 0x3ac8ff, 0x6ee06e, 0xffffff, 0xff7ad8];
    for (let k = 0; k < n; k++) { const a = Math.random() * TAU, s = rr(2, 7); this.alpha.emit(p.x, p.y, p.z, Math.cos(a) * s, rr(4, 10), Math.sin(a) * s, cols[k % cols.length], rr(.07, .12), rr(2.5, 4.5), 3.5, 1.6); }
  }
  firework(p, color) {
    const n = this.q >= 2 ? 160 : 80;
    for (let k = 0; k < n; k++) {
      const u = rr(-1, 1), a = Math.random() * TAU, r = Math.sqrt(1 - u * u), s = rr(9, 12);
      this.add.emit(p.x, p.y, p.z, Math.cos(a) * r * s, u * s, Math.sin(a) * r * s, k % 7 ? color : 0xffffff, rr(.12, .2), rr(1.2, 2.0), 4, 1.4, -.4, k % 3 === 0 ? 1 : 0);
    }
    const f = this.flashes[this.fi++ % this.flashes.length]; f.l.color.set(color); f.l.position.copy(p); f.t = .6;
  }
  trail(p, color) { this.add.emit(p.x, p.y, p.z, rr(-.3, .3), rr(-1, 0), rr(-.3, .3), color, .1, .5, 2, 1); }
  windStreaks(b, dir, f) {
    if (Math.random() > f * 1.4) return;
    for (let k = 0; k < 2; k++) this.alpha.emit(b.x - dir * 9 + rr(-2, 2), b.y + rr(-.5, 4), b.z + rr(-6, 6), dir * rr(14, 20), rr(-.3, .3), 0, 0xffffff, rr(.05, .09), rr(.7, 1.1), 0, 0, 0);
  }
  update(dt) {
    this.add.update(dt); this.alpha.update(dt);
    for (const f of this.flashes) { f.t = Math.max(0, f.t - dt); f.l.intensity = f.t * 500; }
  }
  clear() { this.add.clear(); this.alpha.clear(); }
}

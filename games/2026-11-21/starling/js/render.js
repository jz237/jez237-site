// STARLING 2026 — renderer. A dusk sky over a lighthouse, flocks of folded machine-birds drawn as one
// instanced mesh with wings flapped in the vertex shader, and an HDR bloom chain.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=101';
import { W, H, TYPES } from './sim.js?v=101';

const PI = Math.PI, TAU = PI * 2, rand = Math.random, FOV = 30, TANH = Math.tan((FOV / 2) * PI / 180);
const NOISE = `float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }`;
const COL = { finch: [0.25, 0.95, 0.85], shrike: [1.0, 0.66, 0.22], heron: [0.78, 0.7, 1.0], kite: [1.0, 0.32, 0.3], roost: [1, 0.8, 0.5] };
const SIZE = { finch: 0.62, shrike: 0.7, heron: 0.95, kite: 1.05 };

class Batch { // additive sprites: 0 soft glow, 1 ring, 2 hot core, 3 streak
  constructor(cap) {
    const g = new THREE.InstancedBufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3)); g.setIndex([0, 1, 2, 0, 2, 3]);
    this.p = new Float32Array(cap * 4); this.s = new Float32Array(cap * 3); this.c = new Float32Array(cap * 4); this.cap = cap; this.n = 0;
    this.ap = new THREE.InstancedBufferAttribute(this.p, 4); this.as = new THREE.InstancedBufferAttribute(this.s, 3); this.ac = new THREE.InstancedBufferAttribute(this.c, 4); for (const a of [this.ap, this.as, this.ac]) a.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('iP', this.ap); g.setAttribute('iS', this.as); g.setAttribute('iC', this.ac);
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute vec4 iP; attribute vec3 iS; attribute vec4 iC; varying vec2 vUv; varying vec4 vC; varying float vS; void main(){ vUv = position.xy; vC = iC; vS = iS.z; float c = cos(iP.w), s = sin(iP.w); vec2 q = position.xy * iS.xy; q = vec2(q.x*c - q.y*s, q.x*s + q.y*c); gl_Position = projectionMatrix * viewMatrix * vec4(iP.xyz + vec3(q, 0.0), 1.0); }',
      fragmentShader: 'varying vec2 vUv; varying vec4 vC; varying float vS; void main(){ float d = length(vUv), a; if (vS < 0.5) a = pow(max(0.0, 1.0 - d), 2.2); else if (vS < 1.5) a = smoothstep(1.0, 0.86, d) * smoothstep(0.6, 0.8, d); else if (vS < 2.5) a = pow(max(0.0, 1.0 - d), 2.0) * 0.7 + smoothstep(0.55, 0.36, d) * 1.6; else a = pow(max(0.0, 1.0 - abs(vUv.y)), 3.0) * pow(max(0.0, 1.0 - abs(vUv.x)), 0.6); gl_FragColor = vec4(vC.rgb * a * vC.a, 1.0); }' });
    this.mesh = new THREE.Mesh(g, m); this.mesh.frustumCulled = false; this.mesh.renderOrder = 20; this.g = g;
  }
  add(x, y, z, sx, sy, rot, r, g, b, a, shape) { if (this.n >= this.cap) return; const i = this.n++, j = i * 4, k = i * 3; this.p[j] = x; this.p[j + 1] = y; this.p[j + 2] = z; this.p[j + 3] = rot; this.s[k] = sx; this.s[k + 1] = sy; this.s[k + 2] = shape; this.c[j] = r; this.c[j + 1] = g; this.c[j + 2] = b; this.c[j + 3] = a; }
  flush() { this.g.instanceCount = this.n; this.ap.needsUpdate = this.as.needsUpdate = this.ac.needsUpdate = true; this.n = 0; }
}

// one folded bird: a kite-shaped body and two wings; `w` is 0 at the shoulder and 1 at the wing tip
function birdGeo() {
  const P = [], Wt = [], tri = (a, b, c) => { for (const v of [a, b, c]) { P.push(v[0], v[1], v[2]); Wt.push(v[3]); } };
  const nose = [0, 0.62, 0, 0], tail = [0, -0.5, 0, 0], sl = [-0.13, 0.05, 0.05, 0], sr = [0.13, 0.05, 0.05, 0], keel = [0, 0, -0.1, 0];
  tri(nose, sl, sr); tri(tail, sr, sl); tri(nose, keel, sl); tri(nose, sr, keel); tri(tail, sl, keel); tri(tail, keel, sr);
  for (const s of [1, -1]) { const root1 = [s * 0.12, 0.2, 0.04, 0], root2 = [s * 0.12, -0.16, 0.04, 0], elbow = [s * 0.55, 0.28, 0.04, 0.5], tip = [s * 1.05, -0.08, 0.04, 1], trail = [s * 0.5, -0.24, 0.04, 0.55]; tri(root1, elbow, root2); tri(elbow, trail, root2); tri(elbow, tip, trail); }
  tri([0, -0.5, 0, 0], [-0.16, -0.78, 0, 0.2], [0.16, -0.78, 0, 0.2]);
  const g = new THREE.InstancedBufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('wt', new THREE.Float32BufferAttribute(Wt, 1)); return g;
}

export class Renderer {
  constructor(canvas) {
    const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); r.outputColorSpace = THREE.LinearSRGBColorSpace; r.autoClear = false;
    this.post = new Post(r); this.scene = new THREE.Scene(); this.cam = new THREE.PerspectiveCamera(FOV, 1, 1, 300); this.time = 0; this.frameN = 0; this.shake = 0; this.flash = 0; this.fade = 1; this.flashCol = new THREE.Color(1, 1, 1); this.opt = { flash: 1 }; this.parts = [];
    this.scene.add(new THREE.HemisphereLight(0xb8a8ff, 0x1a1030, 1.0)); const key = new THREE.DirectionalLight(0xffc890, 2.2); key.position.set(-0.4, 0.5, 0.8); this.scene.add(key);
    // sky: dusk gradient, stars, a moon, cloud bands, and the sea along the bottom
    this.skyU = { t: { value: 0 }, asp: { value: 1 }, sea: { value: 0.1 }, fl: { value: 0 } };
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: this.skyU, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
      fragmentShader: NOISE + `varying vec2 vUv; uniform float t, asp, sea, fl;
        float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec2(11.0, 5.0); a *= 0.5; } return s; }
        void main(){ vec2 p = vec2((vUv.x - 0.5) * asp, vUv.y); float h = clamp((vUv.y - sea) / (1.0 - sea), 0.0, 1.0);
          vec3 col = mix(vec3(1.0, 0.45, 0.2), vec3(0.62, 0.2, 0.42), smoothstep(0.0, 0.22, h)); col = mix(col, vec3(0.16, 0.1, 0.36), smoothstep(0.12, 0.55, h)); col = mix(col, vec3(0.02, 0.03, 0.1), smoothstep(0.45, 1.0, h));
          vec2 sp = p * 90.0; float st = hash(floor(sp)); col += vec3(0.9, 0.95, 1.0) * step(0.992, st) * smoothstep(0.3, 0.7, h) * (0.5 + 0.5 * sin(t * 2.0 + st * 60.0)) * (1.0 - smoothstep(0.0, 0.5, length(fract(sp) - 0.5)));
          vec2 mp = p - vec2(0.3 * asp * 0.5 + 0.1, 0.8); float md = length(mp); col += vec3(1.0, 0.95, 0.85) * (smoothstep(0.052, 0.046, md) * 1.6 + exp(-md * 9.0) * 0.25);
          for (int i = 0; i < 3; i++) { float fi = float(i); vec2 q = vec2(p.x * (1.2 + fi * 0.5) + t * 0.008 * (1.0 + fi) + fi * 7.0, (vUv.y - 0.3 - fi * 0.16) * 7.0); float c = smoothstep(0.52, 0.8, fbm(q) * (1.0 - abs(q.y - 0.3) * 0.9)); vec3 cc = mix(vec3(1.0, 0.5, 0.3), vec3(0.3, 0.16, 0.4), fi / 2.0 + 0.2); col = mix(col, cc, c * 0.55); }
          if (vUv.y < sea) { float d = (sea - vUv.y) / sea; vec3 w = mix(vec3(0.75, 0.3, 0.2), vec3(0.03, 0.05, 0.12), smoothstep(0.0, 0.5, d)); float gl = noise(vec2(p.x * 40.0, d * 60.0 - t * 0.6)) * noise(vec2(p.x * 13.0 + t * 0.2, d * 22.0)); w += vec3(1.0, 0.6, 0.35) * pow(gl, 2.0) * (1.0 - d) * 1.6 * exp(-abs(p.x) * 1.4); col = w; }
          col += vec3(0.5, 0.6, 1.0) * fl * 0.2; gl_FragColor = vec4(col, 1.0); }` }));
    sky.frustumCulled = false; sky.renderOrder = -100; this.scene.add(sky);
    // lighthouse on its rock, behind the play plane
    const std = (c, m, ro, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: ro, ...o }), lh = this.lh = new THREE.Group(), box = new THREE.BoxGeometry(1, 1, 1);
    const add = (geo, mat, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); lh.add(m); return m; };
    add(new THREE.IcosahedronGeometry(1, 1), std(0x1c1826, 0.1, 0.95, { flatShading: true }), 0, -3.2, 0, 4.2, 1.9, 2.4); add(new THREE.IcosahedronGeometry(1, 0), std(0x15121e, 0.1, 0.95, { flatShading: true }), 2.6, -3.4, 0.4, 2.2, 1.2, 1.6);
    add(new THREE.CylinderGeometry(0.42, 0.62, 3.4, 14), std(0xe8e2d8, 0.1, 0.7), 0, -0.9, 0, 1, 1, 1); for (const y of [-1.9, -0.7]) add(new THREE.CylinderGeometry(0.5, 0.54, 0.5, 14), std(0x8a2a2a, 0.1, 0.7), 0, y, 0, 1.06 - (y + 1.9) * 0.1, 1, 1.06 - (y + 1.9) * 0.1);
    add(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 14), std(0x2a2630, 0.6, 0.5), 0, 0.84, 0, 1, 1, 1); this.lamp = add(new THREE.CylinderGeometry(0.34, 0.34, 0.5, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.92, 0.6).multiplyScalar(3) }), 0, 1.15, 0, 1, 1, 1); add(new THREE.ConeGeometry(0.5, 0.42, 10), std(0x2a2630, 0.6, 0.5), 0, 1.62, 0, 1, 1, 1);
    lh.position.set(W / 2, 0, -1.6); this.scene.add(lh);
    // beams
    const beamMat = (frag, u) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: u, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: NOISE + frag });
    this.swU = { t: { value: 0 } }; this.sweep = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0), beamMat('varying vec2 vUv; uniform float t; void main(){ float y = abs(vUv.y - 0.5) * 2.0; float w = mix(0.06, 1.0, vUv.x); float a = pow(max(0.0, 1.0 - y / w), 1.6) * (1.0 - vUv.x * 0.75) * (0.75 + 0.25 * noise(vec2(vUv.x * 30.0 - t * 2.0, y * 4.0))); gl_FragColor = vec4(vec3(1.0, 0.92, 0.62) * a * 0.55, 1.0); }', this.swU)); this.sweep.renderOrder = 5; this.sweep.scale.set(34, 3.4, 1); this.scene.add(this.sweep);
    this.colU = { t: { value: 0 }, a: { value: 0 } }; this.col = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), beamMat('varying vec2 vUv; uniform float t, a; void main(){ float x = abs(vUv.x - 0.5) * 2.0; float n = noise(vec2(vUv.x * 9.0, vUv.y * 22.0 - t * 5.0)); float c = pow(max(0.0, 1.0 - x), 1.3) * (0.6 + 0.6 * n) + pow(max(0.0, 1.0 - x), 9.0) * 1.4; gl_FragColor = vec4(vec3(1.0, 0.93, 0.66) * c * a * 0.55, 1.0); }', this.colU)); this.col.renderOrder = 6; this.col.visible = false; this.scene.add(this.col);
    // the flock: one draw call
    this.CAP = 96; const g = birdGeo(); this.bP = new Float32Array(this.CAP * 4); this.bS = new Float32Array(this.CAP * 4); this.bC = new Float32Array(this.CAP * 4);
    this.baP = new THREE.InstancedBufferAttribute(this.bP, 4); this.baS = new THREE.InstancedBufferAttribute(this.bS, 4); this.baC = new THREE.InstancedBufferAttribute(this.bC, 4); for (const a of [this.baP, this.baS, this.baC]) a.setUsage(THREE.DynamicDrawUsage); g.setAttribute('iP', this.baP); g.setAttribute('iS', this.baS); g.setAttribute('iC', this.baC);
    this.birdU = { t: { value: 0 } };
    this.birds = new THREE.Mesh(g, new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: this.birdU,
      vertexShader: 'attribute float wt; attribute vec4 iP; attribute vec4 iS; attribute vec4 iC; uniform float t; varying vec3 vC; varying float vW; varying float vG; void main(){ vec3 p = position; float f = sin(t * iS.z + iS.y); p.z += wt * f * 0.55; p.y -= wt * abs(f) * 0.12; p.x *= 1.0 - wt * abs(f) * 0.18; p.x *= iS.w; float c = cos(iP.w), s = sin(iP.w); vec2 q = vec2(p.x * c - p.y * s, p.x * s + p.y * c) * iS.x; vC = iC.rgb; vW = wt; vG = iC.a; gl_Position = projectionMatrix * viewMatrix * vec4(iP.xyz + vec3(q, p.z * iS.x), 1.0); }',
      fragmentShader: 'varying vec3 vC; varying float vW; varying float vG; void main(){ vec3 c = vC * (0.5 + 0.9 * vW) + vC * pow(vW, 3.0) * 1.6; c = mix(c, vec3(2.4), vG); gl_FragColor = vec4(c, 1.0); }' }));
    this.birds.frustumCulled = false; this.birds.renderOrder = 10; this.scene.add(this.birds);
    // the Roost: a boss built from primitives
    const ro = this.roost = new THREE.Group(), rm = std(0x3a2a44, 0.5, 0.5, { flatShading: true }), rg = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.6, 0.25).multiplyScalar(2.6) });
    const radd = (geo, mat, x, y, z, sx, sy, sz, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz; ro.add(m); return m; };
    radd(new THREE.IcosahedronGeometry(1, 1), rm, 0, 0, 0, 2.3, 1.5, 1.6); radd(new THREE.SphereGeometry(1, 16, 10), rg, 0, -0.5, 0.9, 0.7, 0.5, 0.5); this.roostW = [];
    for (const s of [1, -1]) { this.roostW.push(radd(box, rm, s * 3.3, 0.4, 0, 3.6, 0.16, 1.5, s * 0.25)); radd(box, rm, s * 2.2, 1.2, 0, 2.2, 0.12, 0.9, s * 0.6); radd(new THREE.ConeGeometry(0.3, 1.2, 8), rm, s * 1.7, -1.2, 0, 1, 1, 1, PI); radd(new THREE.SphereGeometry(1, 10, 8), rg, s * 1.7, -1.0, 0.5, 0.26, 0.26, 0.26); }
    for (let i = 0; i < 7; i++) radd(new THREE.ConeGeometry(0.18, 0.9, 6), rm, (i - 3) * 0.6, 1.5, 0, 1, 1 + (i % 2) * 0.5, 1); ro.visible = false; this.scene.add(ro);
    // the ship: a small original interceptor, nose up
    const sh = this.ship = new THREE.Group(), hull = std(0xe9eef3, 0.5, 0.3), dk = std(0x23262e, 0.6, 0.5), gl = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.32, 1, 0.85).multiplyScalar(2.6) });
    const sadd = (geo, mat, x, y, z, sx, sy, sz, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz; sh.add(m); return m; };
    sadd(new THREE.ConeGeometry(0.2, 1.1, 10), hull, 0, 0.4, 0, 1, 1, 1); sadd(new THREE.CylinderGeometry(0.2, 0.26, 0.5, 10), hull, 0, -0.4, 0, 1, 1, 1); sadd(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.75, 0.3).multiplyScalar(1.6) }), 0, 0.2, 0.16, 0.1, 0.22, 0.08);
    for (const s of [1, -1]) { sadd(box, hull, s * 0.42, -0.3, 0, 0.7, 0.34, 0.06, -s * 0.5); sadd(box, dk, s * 0.7, -0.5, 0, 0.12, 0.7, 0.12); sadd(box, gl, s * 0.7, -0.14, 0.02, 0.05, 0.2, 0.05); sadd(new THREE.SphereGeometry(1, 8, 6), gl, s * 0.7, -0.88, 0, 0.07, 0.1, 0.07); } sadd(new THREE.SphereGeometry(1, 8, 6), gl, 0, -0.7, 0, 0.12, 0.14, 0.12);
    this.scene.add(sh); this.add = new Batch(1600); this.scene.add(this.add.mesh);
  }
  resize(w, h, scale = 1) { const pr = Math.min(window.devicePixelRatio || 1, 2) * scale, pw = Math.max(240, Math.round(w * pr)), ph = Math.max(240, Math.round(h * pr)); this.r.setPixelRatio(1); this.r.setSize(pw, ph, false); this.post.resize(pw, ph, 4); const asp = w / h; this.cam.aspect = asp; const d = Math.max((H / 2 + 0.7) / TANH, (W / 2 + 0.4) / (TANH * asp)); this.camY = H / 2 - 1.1; this.cam.position.set(W / 2, this.camY, d); this.cam.updateProjectionMatrix(); this.camD = d; this.asp = asp; this.skyU.asp.value = asp; this.post.mOut.uniforms.aspect.value = asp;
    this.cam.updateMatrixWorld(true); const v = new THREE.Vector3(W / 2, 0.2, 0).project(this.cam), sea = v.y * 0.5 + 0.5; this.skyU.sea.value = Number.isFinite(sea) ? Math.max(0.03, sea) : 0.08; }
  uv(x, y) { const v = new THREE.Vector3(x, y, 0).project(this.cam); return [v.x * 0.5 + 0.5, v.y * 0.5 + 0.5]; }
  spark(x, y, n, spd, c, size = 0.12, life = 0.5, shape = 0, grav = 0) { for (let i = 0; i < n; i++) { if (this.parts.length > 900) return; const a = rand() * TAU, v = spd * (0.3 + rand() * 0.7); this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: life * (0.5 + rand() * 0.7), m: life, s: size * (0.6 + rand() * 0.8), r: c[0], g: c[1], b: c[2], sh: shape, gr: grav }); } }
  ring(x, y, c, grow) { this.parts.push({ x, y, vx: 0, vy: 0, l: 0.32, m: 0.32, s: 0.3, r: c[0], g: c[1], b: c[2], sh: 1, gr: 0, grow }); }
  event(f) {
    switch (f.k) {
      case 'boom': { const c = COL[f.type] || COL.finch, big = f.big ? 2 : 1; this.spark(f.x, f.y, 10 * big, 7 * big, c, 0.2, 0.55, 3, -6); this.spark(f.x, f.y, 5 * big, 3, [1, 1, 1], 0.32, 0.22); this.ring(f.x, f.y, c, 4 * big); const u = this.uv(f.x, f.y); if (f.big) { this.post.shock(u[0], u[1], f.type === 'roost' ? 0.07 : 0.025); this.shake = Math.max(this.shake, f.type === 'roost' ? 1.6 : 0.5); if (f.type === 'roost') { this.flash = Math.max(this.flash, 0.7 * this.opt.flash); this.spark(f.x, f.y, 90, 14, [1, 0.7, 0.3], 0.3, 1.2, 3, -4); } } break; }
      case 'hit': this.spark(f.x, f.y, 4, 4, [1, 1, 1], 0.1, 0.2); break;
      case 'die': { this.spark(f.x, f.y, 50, 11, [0.3, 1, 0.85], 0.22, 0.9, 3); this.spark(f.x, f.y, 24, 5, [1, 1, 1], 0.34, 0.5); this.ring(f.x, f.y, [0.3, 1, 0.85], 9); const u = this.uv(f.x, f.y); this.post.shock(u[0], u[1], 0.05); this.shake = 1; this.flash = Math.max(this.flash, 0.3 * this.opt.flash); break; }
      case 'ember': this.spark(f.x, f.y, 18, 6, [1, 0.8, 0.3], 0.16, 0.5); this.ring(f.x, f.y, [1, 0.8, 0.3], 7); break;
      case 'beam': this.flash = Math.max(this.flash, 0.16 * this.opt.flash); this.shake = Math.max(this.shake, 0.25); break;
      case 'graze': this.flash = Math.max(this.flash, 0.15 * this.opt.flash); break;
    }
  }
  frame(S, dt) {
    const t = (this.time += dt), B = this.add, p = S.p; this.frameN++; this.skyU.t.value = t; this.skyU.fl.value = p.beamT > 0 ? 1 : 0; this.birdU.t.value = t;
    this.shake *= Math.exp(-dt * 7); const sk = this.shake * 0.3; this.cam.position.set(W / 2 + (rand() - 0.5) * sk, this.camY + (rand() - 0.5) * sk, this.camD);
    // beams
    this.swU.t.value = t; this.sweep.position.set(W / 2, 1.15, -0.8); this.sweep.rotation.z = S.sweep || 1.57; this.lamp.rotation.y = t * 2;
    B.add(W / 2, 1.15, -0.5, 1.6, 1.6, 0, 1, 0.9, 0.6, 0.8, 0);
    if (p.beamT > 0) { const a = Math.min(1, p.beamT / 20) * Math.min(1, (150 - p.beamT) / 8 + 0.3); this.col.visible = true; this.col.position.set(p.beamX, H / 2 + 1, -0.3); this.col.scale.set(3.6, H + 6, 1); this.colU.t.value = t; this.colU.a.value = a; } else this.col.visible = false;
    // the flock
    let n = 0; this.roost.visible = false;
    for (const e of S.foes) {
      if (e.dead) continue; const c = COL[e.type];
      if (e.type === 'roost') { const ro = this.roost; ro.visible = true; ro.position.set(e.x, e.y, 0); ro.rotation.z = Math.sin(t * 1.3) * 0.05; this.roostW[0].rotation.z = 0.25 + Math.sin(t * 3) * 0.18; this.roostW[1].rotation.z = -0.25 - Math.sin(t * 3) * 0.18; if (e.hit > 0) B.add(e.x, e.y, 1, 3.4, 2.4, 0, 1, 1, 1, 0.8, 0); if (e.dz > 0) B.add(e.x, e.y, 1, 3.6, 2.6, t, 1, 0.95, 0.7, 0.5, 1); B.add(e.x, e.y - 0.5, 0.9, 1.6, 1.2, 0, 1, 0.6, 0.25, 0.6, 0); continue; }
      if (n >= this.CAP) break; const j = n * 4, moving = Math.hypot(e.vx, e.vy) > 0.5, ang = moving ? Math.atan2(e.vy, e.vx) - PI / 2 : PI + Math.sin(t * 2 + e.ph) * 0.08, flapF = e.st === 'idle' ? 7 : e.st === 'stoop' ? 3 : 13;
      this.bP[j] = e.x; this.bP[j + 1] = e.y; this.bP[j + 2] = 0; this.bP[j + 3] = ang; this.bS[j] = SIZE[e.type] || 0.7; this.bS[j + 1] = e.ph; this.bS[j + 2] = e.dz > 0 ? 4 : flapF; this.bS[j + 3] = e.st === 'stoop' ? 0.72 : 1;
      this.bC[j] = c[0]; this.bC[j + 1] = c[1]; this.bC[j + 2] = c[2]; this.bC[j + 3] = e.hit > 0 ? 1 : e.dz > 0 ? 0.45 + Math.sin(t * 20 + e.ph) * 0.15 : 0; n++;
      B.add(e.x, e.y, 0.1, 0.9, 0.9, 0, c[0], c[1], c[2], e.st === 'stoop' ? 0.55 : 0.28, 0);
      if (e.st === 'stoop' && this.frameN % 2 === 0) this.parts.push({ x: e.x, y: e.y, vx: 0, vy: 0, l: 0.3, m: 0.3, s: 0.14, r: c[0], g: c[1], b: c[2], sh: 0, gr: 0 });
      if (e.dz > 0 && this.frameN % 5 === 0) this.spark(e.x, e.y, 1, 2, [1, 1, 0.8], 0.09, 0.4);
    }
    this.birds.geometry.instanceCount = n; this.baP.needsUpdate = this.baS.needsUpdate = this.baC.needsUpdate = true;
    // ship
    const sh = this.ship; sh.visible = p.alive && !(p.inv > 0 && (this.frameN & 4)); sh.position.set(p.x, 2, 0); sh.rotation.y = -p.vx * 0.05;
    if (p.alive) { const f = 0.7 + rand() * 0.5; B.add(p.x, 1.05, 0, 0.16, 0.7 * f, 0, 0.3, 1, 0.9, 1, 3); for (const s of [0.7, -0.7]) B.add(p.x + s, 0.95, 0, 0.1, 0.45 * f, 0, 0.3, 1, 0.9, 0.9, 3); if (p.twin > 0) { B.add(p.x, 2, 0, 1.3, 1.3, t * 3, 1, 0.8, 0.3, p.twin < 120 ? 0.3 + Math.sin(t * 20) * 0.3 : 0.6, 1); } }
    for (const s of S.shots) { B.add(s.x, s.y, 0, 0.12, 0.6, 0, 0.5, 1, 0.9, 1, 3); B.add(s.x, s.y + 0.3, 0, 0.22, 0.22, 0, 0.9, 1, 1, 1, 2); }
    for (const b of S.eb) { const c = b.k ? [1, 0.3, 0.6] : [1, 0.6, 0.2], s = b.k ? 0.42 : 0.34; B.add(b.x, b.y, 0.2, s, s, 0, c[0], c[1], c[2], 1, 2); B.add(b.x, b.y, 0.2, s * 2, s * 2, 0, c[0], c[1], c[2], 0.4, 0); }
    for (const m of S.embers) { B.add(m.x, m.y, 0.2, 0.4, 0.4, 0, 1, 0.85, 0.35, 1, 2); B.add(m.x, m.y, 0.2, 0.9, 0.9, t * 4, 1, 0.8, 0.3, 0.9, 1); if (this.frameN % 3 === 0) this.parts.push({ x: m.x, y: m.y + 0.3, vx: (rand() - 0.5), vy: 1.5, l: 0.5, m: 0.5, s: 0.1, r: 1, g: 0.7, b: 0.2, sh: 0, gr: 0 }); }
    let w = 0; for (let i = 0; i < this.parts.length; i++) { const q = this.parts[i]; q.l -= dt; if (q.l <= 0) continue; q.vx *= Math.exp(-2 * dt); q.vy *= Math.exp(-2 * dt); q.vy += q.gr * dt; q.x += q.vx * dt; q.y += q.vy * dt; const f = q.l / q.m, s = q.grow ? q.s + (1 - f) * q.grow : q.s * (0.4 + f * 0.6); B.add(q.x, q.y, 0.3, q.sh === 3 ? s * 2.2 : s, q.sh === 3 ? s * 0.4 : s, q.sh === 3 ? Math.atan2(q.vy, q.vx) : 0, q.r, q.g, q.b, Math.min(1, f * 2.5), q.sh); this.parts[w++] = q; } this.parts.length = w;
    B.flush(); this.flash *= Math.exp(-dt * 6);
    this.post.render(this.scene, this.cam, dt, { bloom: 0.72, flash: this.flash, flashCol: this.flashCol, fade: this.fade, rays: 0, sun: this.post.mRays.uniforms.sun.value });
  }
}

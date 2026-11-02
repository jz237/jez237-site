// Effects: additive point sparks, glass shards, camera-facing ribbons (trails, lightning), floor rings.
import * as THREE from '../vendor/three.module.min.js';

const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _t = new THREE.Vector3();

// ------------------------------------------------------------------ sparks / embers / smoke-glow
const P_VERT = /* glsl */ `
attribute vec3 color; attribute float size; attribute float alpha;
varying vec3 vColor; varying float vAlpha;
uniform float uScale;
void main(){
  vColor = color; vAlpha = alpha;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uScale / max(0.1, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const P_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r); a = a * a * vAlpha;
  float core = exp(-r * 9.0);
  gl_FragColor = vec4(vColor * a + vec3(core * a * 0.6), 1.0);
}`;

export class Sparks {
  constructor(cap) {
    this.cap = cap;
    this.n = 0;
    this.pos = new Float32Array(cap * 3);
    this.col = new Float32Array(cap * 3);
    this.size = new Float32Array(cap);
    this.alpha = new Float32Array(cap);
    this.vel = new Float32Array(cap * 3);
    this.life = new Float32Array(cap);
    this.max = new Float32Array(cap);
    this.drag = new Float32Array(cap);
    this.grav = new Float32Array(cap);
    this.base = new Float32Array(cap * 4); // r g b size
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: P_VERT, fragmentShader: P_FRAG, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, uniforms: { uScale: { value: 300 } },
    });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  // o: { x,y,z, n, speed, up, color (THREE.Color or hex), intensity, size, life, drag, grav, spread, dir:[x,y,z] }
  burst(o) {
    const c = o.color instanceof THREE.Color ? o.color : new THREE.Color(o.color ?? 0xffffff);
    const k = o.intensity ?? 3;
    const n = Math.min(o.n ?? 20, this.cap - this.n);
    for (let j = 0; j < n; j++) {
      const i = this.n++;
      this.pos[i * 3] = o.x + (Math.random() - 0.5) * (o.jitter ?? 0.1);
      this.pos[i * 3 + 1] = o.y ?? 0.4;
      this.pos[i * 3 + 2] = o.z + (Math.random() - 0.5) * (o.jitter ?? 0.1);
      // direction: random sphere, biased by dir/up
      let dx = Math.random() * 2 - 1, dy = Math.random() * 2 - 1, dz = Math.random() * 2 - 1;
      const l = Math.hypot(dx, dy, dz) || 1;
      dx /= l; dy /= l; dz /= l;
      if (o.dir) { const s = o.spread ?? 0.6; dx = o.dir[0] + dx * s; dy = o.dir[1] + dy * s; dz = o.dir[2] + dz * s; }
      dy = Math.abs(dy) * (o.up ?? 0.6) + dy * (1 - (o.up ?? 0.6)) * 0.3;
      const sp = (o.speed ?? 6) * (0.25 + Math.random() * 0.75);
      this.vel[i * 3] = dx * sp; this.vel[i * 3 + 1] = dy * sp; this.vel[i * 3 + 2] = dz * sp;
      const life = (o.life ?? 0.7) * (0.5 + Math.random() * 0.7);
      this.life[i] = life; this.max[i] = life;
      this.drag[i] = o.drag ?? 2.2;
      this.grav[i] = o.grav ?? 9;
      const hue = o.hueJitter ?? 0.08;
      this.base[i * 4] = c.r * k * (1 - hue + Math.random() * hue * 2);
      this.base[i * 4 + 1] = c.g * k * (1 - hue + Math.random() * hue * 2);
      this.base[i * 4 + 2] = c.b * k;
      this.base[i * 4 + 3] = (o.size ?? 0.18) * (0.6 + Math.random() * 0.8);
    }
  }

  update(dt) {
    let i = 0;
    while (i < this.n) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.kill(i); continue; }
      const d = Math.exp(-this.drag[i] * dt);
      this.vel[i * 3] *= d; this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * d - this.grav[i] * dt; this.vel[i * 3 + 2] *= d;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      if (this.pos[i * 3 + 1] < 0.03 && this.vel[i * 3 + 1] < 0) { this.pos[i * 3 + 1] = 0.03; this.vel[i * 3 + 1] *= -0.45; this.vel[i * 3] *= 0.7; this.vel[i * 3 + 2] *= 0.7; }
      const f = this.life[i] / this.max[i];
      const fade = f * f * (3 - 2 * f);
      this.col[i * 3] = this.base[i * 4]; this.col[i * 3 + 1] = this.base[i * 4 + 1]; this.col[i * 3 + 2] = this.base[i * 4 + 2];
      this.alpha[i] = fade;
      this.size[i] = this.base[i * 4 + 3] * (0.4 + 0.6 * f);
      i++;
    }
    const g = this.geo;
    g.setDrawRange(0, this.n);
    for (const k of ['position', 'color', 'size', 'alpha']) { g.attributes[k].needsUpdate = true; }
  }

  kill(i) {
    const j = --this.n;
    if (i === j) return;
    this.pos.copyWithin(i * 3, j * 3, j * 3 + 3);
    this.vel.copyWithin(i * 3, j * 3, j * 3 + 3);
    this.base.copyWithin(i * 4, j * 4, j * 4 + 4);
    this.life[i] = this.life[j]; this.max[i] = this.max[j]; this.drag[i] = this.drag[j]; this.grav[i] = this.grav[j];
  }

  clear() { this.n = 0; this.geo.setDrawRange(0, 0); }
}

// ------------------------------------------------------------------ shards (shattered shield cells, core debris)
export class Shards {
  constructor(cap) {
    this.cap = cap;
    const geo = new THREE.TetrahedronGeometry(0.16, 0);
    geo.scale(1, 0.45, 1.4);
    this.mat = new THREE.MeshStandardMaterial({ color: 0x223344, metalness: 0.3, roughness: 0.25, emissive: 0xffffff, emissiveIntensity: 1 });
    this.mesh = new THREE.InstancedMesh(geo, this.mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.list = [];
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.s = new THREE.Vector3(); this.e = new THREE.Euler();
  }
  burst(o) {
    const c = new THREE.Color(o.color ?? 0xffffff);
    for (let j = 0; j < (o.n ?? 16) && this.list.length < this.cap; j++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (o.speed ?? 6) * (0.3 + Math.random() * 0.7);
      this.list.push({
        x: o.x + (Math.random() - 0.5) * (o.w ?? 1), y: (o.y ?? 0.4) + Math.random() * (o.h ?? 0.4), z: o.z + (Math.random() - 0.5) * 0.4,
        vx: Math.cos(a) * sp * 0.6 + (o.vx ?? 0), vy: 2 + Math.random() * (o.up ?? 5), vz: Math.sin(a) * sp * 0.6 + (o.vz ?? 0),
        rx: Math.random() * 6, ry: Math.random() * 6, wx: (Math.random() - 0.5) * 18, wy: (Math.random() - 0.5) * 18,
        s: (o.scale ?? 1) * (0.5 + Math.random()), life: (o.life ?? 1.6) * (0.6 + Math.random() * 0.6), c, k: o.intensity ?? 2.5,
      });
    }
  }
  update(dt) {
    const L = this.list;
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i];
      p.life -= dt;
      if (p.life <= 0) { L[i] = L[L.length - 1]; L.pop(); continue; }
      p.vy -= 14 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.rx += p.wx * dt; p.ry += p.wy * dt;
      if (p.y < 0.05) { p.y = 0.05; p.vy *= -0.35; p.vx *= 0.6; p.vz *= 0.6; p.wx *= 0.6; p.wy *= 0.6; }
    }
    const cnt = Math.min(L.length, this.cap);
    for (let i = 0; i < cnt; i++) {
      const p = L[i];
      this.e.set(p.rx, p.ry, 0);
      this.q.setFromEuler(this.e);
      const f = Math.min(1, p.life * 2);
      this.s.setScalar(p.s * f);
      this.m.compose(_v.set(p.x, p.y, p.z), this.q, this.s);
      this.mesh.setMatrixAt(i, this.m);
      const glow = p.k * Math.min(1, p.life);
      this.mesh.instanceColor.setXYZ(i, p.c.r * glow, p.c.g * glow, p.c.b * glow);
    }
    this.mesh.count = cnt;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  }
  clear() { this.list.length = 0; this.mesh.count = 0; }
}
// MeshStandardMaterial multiplies instanceColor into diffuse; route it into emissive instead.
export function patchShardMaterial(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n#ifdef USE_INSTANCING_COLOR\n totalEmissiveRadiance = vColor.rgb;\n diffuseColor.rgb = vec3(0.05);\n#endif');
  };
}

// ------------------------------------------------------------------ ribbons: trails and lightning
const R_VERT = /* glsl */ `
attribute float along; attribute float edge;
varying float vAlong; varying float vEdge;
void main(){ vAlong = along; vEdge = edge; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const R_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 uHead; uniform float uOpacity; uniform float uCore;
varying float vAlong; varying float vEdge;
void main(){
  float e = 1.0 - abs(vEdge);
  float a = pow(vAlong, 1.6) * uOpacity;
  vec3 c = mix(uColor, uHead, pow(vAlong, 4.0));
  float core = pow(e, 6.0) * uCore;
  gl_FragColor = vec4((c * e * e + vec3(core)) * a, 1.0);
}`;

export class Ribbon {
  constructor(n, width, color, head = 0xffffff) {
    this.n = n;
    this.width = width;
    this.pts = [];
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 2 * 3);
    const along = new Float32Array(n * 2), edge = new Float32Array(n * 2);
    const idx = [];
    for (let i = 0; i < n; i++) {
      along[i * 2] = along[i * 2 + 1] = i / (n - 1);
      edge[i * 2] = -1; edge[i * 2 + 1] = 1;
      if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('along', new THREE.BufferAttribute(along, 1));
    g.setAttribute('edge', new THREE.BufferAttribute(edge, 1));
    g.setIndex(idx);
    g.setDrawRange(0, 0);
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: R_VERT, fragmentShader: R_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) }, uHead: { value: new THREE.Color(head) }, uOpacity: { value: 1 }, uCore: { value: 0.8 } },
    });
    this.mesh = new THREE.Mesh(g, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
  }
  // pts: array of THREE.Vector3 (oldest first); widths optional per point multiplier
  set(pts, camPos, widthFn) {
    const n = Math.min(pts.length, this.n);
    if (n < 2) { this.geo.setDrawRange(0, 0); return; }
    const off = this.n - n; // keep head at along = 1
    for (let i = 0; i < n; i++) {
      const p = pts[pts.length - n + i];
      const a = pts[Math.max(0, pts.length - n + i - 1)], b = pts[Math.min(pts.length - 1, pts.length - n + i + 1)];
      _t.subVectors(b, a);
      _v.subVectors(camPos, p);
      _w.crossVectors(_t, _v).normalize();
      const w = this.width * (widthFn ? widthFn((i + off) / (this.n - 1)) : 1);
      const k = (i + off) * 6;
      this.pos[k] = p.x - _w.x * w; this.pos[k + 1] = p.y - _w.y * w; this.pos[k + 2] = p.z - _w.z * w;
      this.pos[k + 3] = p.x + _w.x * w; this.pos[k + 4] = p.y + _w.y * w; this.pos[k + 5] = p.z + _w.z * w;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.setDrawRange(off * 6, (n - 1) * 6);
  }
  hide() { this.geo.setDrawRange(0, 0); }
}

// jagged polyline between a and b (midpoint displacement)
export function boltPath(a, b, depth = 5, rough = 0.35) {
  let pts = [a.clone(), b.clone()];
  let amp = a.distanceTo(b) * rough;
  for (let d = 0; d < depth; d++) {
    const next = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const m = pts[i].clone().lerp(pts[i + 1], 0.5);
      m.x += (Math.random() - 0.5) * amp; m.y += (Math.random() - 0.5) * amp * 0.6; m.z += (Math.random() - 0.5) * amp;
      next.push(m, pts[i + 1]);
    }
    pts = next;
    amp *= 0.55;
  }
  return pts;
}

export class Lightning {
  constructor(scene, cap = 14) {
    this.pool = [];
    for (let i = 0; i < cap; i++) {
      const r = new Ribbon(33, 0.07, 0x9ad8ff, 0xffffff);
      r.mat.uniforms.uCore.value = 2.5;
      r.mesh.visible = false;
      scene.add(r.mesh);
      this.pool.push({ r, life: 0, a: new THREE.Vector3(), b: new THREE.Vector3(), t: 0, rough: 0.3, w: 0.07 });
    }
  }
  strike(a, b, color = 0x9ad8ff, life = 0.3, width = 0.08, rough = 0.32) {
    const s = this.pool.find((q) => q.life <= 0) || this.pool[0];
    s.a.copy(a); s.b.copy(b); s.life = life; s.max = life; s.rough = rough; s.t = 0;
    s.r.width = width;
    s.r.mat.uniforms.uColor.value.set(color);
    s.r.mesh.visible = true;
    s.pts = boltPath(s.a, s.b, 5, rough);
  }
  update(dt, camPos) {
    for (const s of this.pool) {
      if (s.life <= 0) continue;
      s.life -= dt; s.t += dt;
      if (s.life <= 0) { s.r.mesh.visible = false; continue; }
      if (s.t > 0.045) { s.t = 0; s.pts = boltPath(s.a, s.b, 5, s.rough); }
      s.r.mat.uniforms.uOpacity.value = Math.min(1, (s.life / s.max) * 2.5) * (0.7 + Math.random() * 0.6) * 2.2;
      s.r.set(s.pts, camPos, () => 1);
    }
  }
}

// ------------------------------------------------------------------ expanding floor rings + domes
const RING_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uT; varying vec2 vUv;
void main(){
  float r = length(vUv - 0.5) * 2.0;
  float ring = exp(-pow((r - uT) * 11.0, 2.0)) + exp(-pow((r - uT * 0.8) * 22.0, 2.0)) * 0.4;
  float a = (1.0 - uT); a *= a;
  gl_FragColor = vec4(uColor * ring * a * 3.0, 1.0);
}`;
const RING_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

export class Rings {
  constructor(scene, cap = 12) {
    this.pool = [];
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < cap; i++) {
      const mat = new THREE.ShaderMaterial({ vertexShader: RING_VERT, fragmentShader: RING_FRAG, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, uniforms: { uColor: { value: new THREE.Color() }, uT: { value: 0 } } });
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      m.renderOrder = 3;
      scene.add(m);
      this.pool.push({ m, life: 0, max: 1, size: 1 });
    }
  }
  spawn(x, z, color, size = 6, life = 0.7, y = 0.04) {
    const s = this.pool.find((q) => q.life <= 0) || this.pool[0];
    s.m.position.set(x, y, z);
    s.m.material.uniforms.uColor.value.set(color);
    s.life = life; s.max = life; s.size = size;
    s.m.visible = true;
  }
  update(dt) {
    for (const s of this.pool) {
      if (s.life <= 0) continue;
      s.life -= dt;
      if (s.life <= 0) { s.m.visible = false; continue; }
      const t = 1 - s.life / s.max;
      s.m.material.uniforms.uT.value = t;
      s.m.scale.setScalar(s.size);
    }
  }
}

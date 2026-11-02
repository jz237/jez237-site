// Meshes for the things on court: paddles, balls, bolts, orbs, drones, cells, cores, hazards.
import * as THREE from '../vendor/three.module.min.js';
import { F, POWERUPS } from './config.js?v=3';
import { CELL_HALF } from './sim.js?v=3';
import { NOISE } from './shaders.js?v=3';
import { Ribbon } from './fx.js?v=3';

export const BALL_Y = 0.36;
const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);

let glowTex = null;
export function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  gr.addColorStop(0.45, 'rgba(255,255,255,0.14)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

export function glowSprite(color, k, scale) {
  const m = new THREE.SpriteMaterial({ map: glowTexture(), color: hdr(color, k), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  const s = new THREE.Sprite(m);
  s.scale.setScalar(scale);
  return s;
}

export function floorGlow(color, k, sx, sz) {
  const geo = new THREE.PlaneGeometry(1, 1);
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: glowTexture(), color: hdr(color, k), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  m.scale.set(sx, 1, sz);
  m.position.y = 0.025;
  m.renderOrder = 2;
  return m;
}

const iconCache = new Map();
export function iconTexture(glyph, color) {
  const key = glyph + color;
  if (iconCache.has(key)) return iconCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 84px "Segoe UI Symbol","Noto Sans Symbols 2","Apple Symbols",sans-serif';
  g.shadowColor = '#' + new THREE.Color(color).getHexString();
  g.shadowBlur = 18;
  g.fillStyle = '#ffffff';
  g.fillText(glyph, 64, 70);
  g.shadowBlur = 0;
  g.fillText(glyph, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  iconCache.set(key, t);
  return t;
}

// ------------------------------------------------------------------ paddles
const AURA_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uAmt;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float f = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 2.2);
  float n = fbm3(vP * 3.0 + vec3(0.0, uTime * 2.5, uTime));
  gl_FragColor = vec4(uColor * f * (0.6 + n * 1.6) * uAmt, 1.0);
}`;
const FRES_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = cameraPosition - w.xyz; vP = position;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export class PaddleView {
  constructor(p, color, env, opts = {}) {
    this.p = p;
    this.side = p.side;
    this.color = new THREE.Color(color);
    const g = new THREE.Group();
    this.group = g;
    const boss = !!opts.boss;
    this.boss = boss;
    const metal = new THREE.MeshStandardMaterial({ color: boss ? 0x1a0a0c : 0x0e131c, metalness: 0.92, roughness: 0.26, envMap: env, envMapIntensity: 1.2 });
    this.metal = metal;
    const H = boss ? 0.5 : 0.34;
    this.bar = new THREE.Mesh(new THREE.BoxGeometry(1, H, 0.5), metal);
    g.add(this.bar);
    this.stripMat = new THREE.MeshBasicMaterial({ color: hdr(color, 4) });
    const s = p.side;
    this.front = new THREE.Mesh(new THREE.BoxGeometry(1, 0.08, 0.04), this.stripMat);
    this.front.position.set(0, 0.02, -s * 0.262);
    g.add(this.front);
    this.top = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, 0.06), this.stripMat);
    this.top.position.set(0, H / 2 + 0.005, 0.06 * s);
    g.add(this.top);
    // end pods (turrets for the boss)
    this.pods = [];
    for (const e of [-1, 1]) {
      const pod = new THREE.Group();
      const body = boss
        ? new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.7, 0.7), metal)
        : new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.56, 24), metal);
      pod.add(body);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(boss ? 0.4 : 0.3, 0.035, 8, 32), this.stripMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.08;
      pod.add(ring);
      if (boss) {
        const gun = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.9, 12), metal);
        gun.rotation.x = Math.PI / 2;
        gun.position.set(0, 0.12, -s * 0.6);
        pod.add(gun);
        const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), this.stripMat);
        muzzle.position.set(0, 0.12, -s * 1.05);
        pod.add(muzzle);
      }
      const thr = glowSprite(color, 2.2, 0.9);
      thr.position.set(0, -0.05, s * 0.42);
      pod.add(thr);
      pod.userData.thr = thr;
      g.add(pod);
      this.pods.push(pod);
    }
    if (boss) {
      this.eye = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), new THREE.MeshBasicMaterial({ color: hdr(0xff2a1a, 6) }));
      this.eye.position.set(0, 0.18, -s * 0.2);
      g.add(this.eye);
      const eg = glowSprite(0xff3020, 4, 1.8);
      this.eye.add(eg);
      this.bar.scale.z = 1.4;
    }
    this.under = floorGlow(color, 1.6, 4, 1.8);
    this.aura = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.ShaderMaterial({
      vertexShader: FRES_VERT, fragmentShader: AURA_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(0xffc23a, 3) }, uTime: { value: 0 }, uAmt: { value: 0 } },
    }));
    this.aura.visible = false;
    g.add(this.aura);
    this.squash = 0;
    this.stunFlick = 0;
    this.H = H;
  }

  update(W, dt, time) {
    const p = this.p, g = this.group;
    const hw = p.hw;
    g.position.set(p.x, this.H / 2 + 0.14, p.z);
    g.rotation.z += (-p.vx * 0.012 - g.rotation.z) * Math.min(1, dt * 10);
    g.rotation.x += (p.vz * 0.012 - g.rotation.x) * Math.min(1, dt * 10);
    const podW = this.boss ? 0.31 : 0.27;
    const barLen = Math.max(0.2, hw * 2 - podW * 1.6);
    this.bar.scale.x = barLen;
    this.front.scale.x = barLen;
    this.top.scale.x = barLen * 0.86;
    this.pods[0].position.x = -hw + podW;
    this.pods[1].position.x = hw - podW;
    // hit squash
    if (W.t - p.hitT < 0.02 && this.lastHit !== p.hitT) { this.squash = 1; this.lastHit = p.hitT; }
    this.squash = Math.max(0, this.squash - dt * 6);
    g.scale.set(1 + this.squash * 0.06, 1 - this.squash * 0.25, 1 + this.squash * 0.2);
    // glow strength: hit flash, fire flash, stun flicker
    const stunned = p.stun > 0;
    let k = 4 + this.squash * 10 + p.flash * 6;
    if (stunned) k = Math.random() < 0.5 ? 0.3 : 6;
    const immune = W.t < p.immuneT && !stunned;
    const c = this.stripMat.color;
    c.copy(this.color).multiplyScalar(k);
    if (immune && Math.sin(time * 40) > 0) c.lerp(new THREE.Color(3, 3, 3), 0.4);
    // thrusters flare with speed
    const sp = Math.min(1, Math.hypot(p.vx, p.vz) / 15);
    for (const pod of this.pods) pod.userData.thr.scale.setScalar(0.6 + sp * 1.4 + Math.random() * 0.15);
    this.under.position.set(p.x, 0.025, p.z);
    this.under.scale.set(hw * 2 + 1.6, 1, 1.9);
    const m = W.meter[p.side];
    const od = m.odTime > 0;
    this.aura.visible = od;
    if (od) {
      this.aura.scale.set(hw + 0.45, 0.55, 0.62);
      this.aura.material.uniforms.uTime.value = time;
      this.aura.material.uniforms.uAmt.value = Math.min(1, m.odTime) * (0.8 + 0.2 * Math.sin(time * 20));
    }
    if (this.eye) {
      const e = 5 + Math.sin(time * 3) * 2 + (W.boss && W.boss.laser && W.boss.laser.charge > 0 ? 8 : 0);
      this.eye.material.color.setRGB(e, e * 0.12, e * 0.06);
    }
  }
  dispose() { this.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
}

// ------------------------------------------------------------------ balls
const BALL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uFire; uniform float uGhost; uniform float uSpinA; uniform float uHeat;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float f = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 2.0);
  float c = cos(uSpinA), s = sin(uSpinA);
  vec3 p = vec3(c * vP.x - s * vP.z, vP.y, s * vP.x + c * vP.z) * 6.0;
  float n = fbm3(p + vec3(0.0, uTime * 3.0, 0.0));
  float band = smoothstep(0.75, 0.95, sin(atan(p.z, p.x) * 3.0 + p.y * 2.0));
  vec3 col = mix(vec3(1.0), uColor, 0.5) * (1.8 + n * 2.2) + uColor * f * 5.0 + vec3(band) * 0.8;
  vec3 fire = mix(vec3(5.0, 1.2, 0.15), vec3(6.0, 4.0, 1.2), n) * (1.0 + f * 2.0);
  col = mix(col, fire, uFire);
  col *= 1.0 + uHeat * 1.5;
  gl_FragColor = vec4(col * (1.0 - uGhost * 0.94), 1.0 - uGhost * 0.9);
}`;

export class BallView {
  constructor(scene, cam) {
    this.mat = new THREE.ShaderMaterial({
      vertexShader: FRES_VERT, fragmentShader: BALL_FRAG, transparent: true,
      uniforms: { uColor: { value: new THREE.Color(1, 1, 1) }, uTime: { value: 0 }, uFire: { value: 0 }, uGhost: { value: 0 }, uSpinA: { value: 0 }, uHeat: { value: 0 } },
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(F.ballR, 32, 16), this.mat);
    this.glow = glowSprite(0xffffff, 2.4, 2.6);
    this.mesh.add(this.glow);
    this.trail = new Ribbon(40, F.ballR * 0.85, 0xffffff, 0xffffff);
    this.hist = [];
    this.spinA = 0;
    this.color = new THREE.Color(1, 1, 1);
    scene.add(this.mesh, this.trail.mesh);
    this.cam = cam;
    this.heat = 0;
  }
  update(W, b, dt, time, colors) {
    const owner = b.owner;
    const target = owner === 1 ? colors[1] : owner === -1 ? colors[-1] : WHITE;
    this.color.lerp(target, Math.min(1, dt * 10));
    const u = this.mat.uniforms;
    u.uColor.value.copy(this.color);
    u.uTime.value = time;
    u.uFire.value += ((b.fire ? 1 : 0) - u.uFire.value) * Math.min(1, dt * 8);
    const ghost = owner && W.fx[owner].ghost > 0 && b.z * owner < -0.5 ? 1 : 0;
    u.uGhost.value += (ghost * (0.85 + Math.sin(time * 18) * 0.1) - u.uGhost.value) * Math.min(1, dt * 8);
    this.spinA += (b.spin * 1.5 + 2) * dt;
    u.uSpinA.value = this.spinA;
    const sp = Math.hypot(b.vx, b.vz);
    this.heat += (Math.min(1, Math.max(0, sp - 18) / 16) - this.heat) * Math.min(1, dt * 4);
    u.uHeat.value = this.heat;
    const y = BALL_Y + (b.caught ? 0.06 : 0);
    this.mesh.position.set(b.x, y, b.z);
    const gk = (b.fire ? 3.5 : 2.2) * (1 - u.uGhost.value);
    this.glow.material.color.copy(b.fire ? FIRE : this.color).multiplyScalar(gk * (1 + this.heat));
    this.glow.scale.setScalar(2.4 + this.heat * 1.6 + (b.fire ? 1 : 0));
    // trail
    const last = this.hist[this.hist.length - 1];
    if (!last || last.distanceToSquared(this.mesh.position) > 0.0025) {
      this.hist.push(this.mesh.position.clone());
      if (this.hist.length > 40) this.hist.shift();
    }
    // teleports (portals) break the trail
    if (last && last.distanceToSquared(this.mesh.position) > 6) this.hist = [this.mesh.position.clone()];
    const tm = this.trail.mat.uniforms;
    tm.uColor.value.copy(b.fire ? FIRE : this.color).multiplyScalar(1.4 + this.heat * 1.5);
    tm.uHead.value.setRGB(3, 3, 3);
    tm.uOpacity.value = 1 - u.uGhost.value;
    this.trail.width = F.ballR * (0.7 + this.heat * 0.6 + (b.fire ? 0.5 : 0));
    this.trail.set(this.hist, this.cam.position, (a) => a);
  }
  remove(scene) {
    scene.remove(this.mesh, this.trail.mesh);
    this.mesh.geometry.dispose(); this.mat.dispose(); this.trail.geo.dispose(); this.trail.mat.dispose();
  }
}
const WHITE = new THREE.Color(1, 1, 1);
const FIRE = new THREE.Color(1, 0.45, 0.08);

// ------------------------------------------------------------------ bolts
export class BoltView {
  constructor(scene, color) {
    this.group = new THREE.Group();
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.1, 8), new THREE.MeshBasicMaterial({ color: hdr(color, 6) }));
    core.rotation.x = Math.PI / 2;
    this.group.add(core);
    this.core = core;
    const flare = floorGlow(color, 2.5, 0.9, 2.6);
    flare.position.y = 0;
    this.group.add(flare);
    this.flare = flare;
    const s = glowSprite(color, 2.5, 1.3);
    this.group.add(s);
    this.sprite = s;
    scene.add(this.group);
  }
  set(o, color) {
    this.group.position.set(o.x, 0.42, o.z);
    this.core.material.color.copy(color).multiplyScalar(6);
    this.flare.material.color.copy(color).multiplyScalar(2.5);
    this.sprite.material.color.copy(color).multiplyScalar(2.5);
    this.group.visible = true;
  }
}

// ------------------------------------------------------------------ power-up orbs
const CORE_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uAmt;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float f = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 1.6);
  float n = fbm3(vP * 5.0 + vec3(uTime * 0.8, uTime * 1.3, 0.0));
  gl_FragColor = vec4(uColor * (f * 2.5 + n * 0.6) * uAmt, 1.0);
}`;

export class OrbView {
  constructor(scene, o) {
    const def = POWERUPS[o.kind];
    this.o = o;
    const g = new THREE.Group();
    this.group = g;
    const col = new THREE.Color(def.color);
    this.shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.62, 0)), new THREE.LineBasicMaterial({ color: hdr(def.color, 3), transparent: true }));
    g.add(this.shell);
    this.core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), new THREE.ShaderMaterial({
      vertexShader: FRES_VERT, fragmentShader: CORE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: col.clone().multiplyScalar(1.5) }, uTime: { value: 0 }, uAmt: { value: 1 } },
    }));
    g.add(this.core);
    this.icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTexture(def.glyph, def.color), color: new THREE.Color(1.6, 1.6, 1.6), transparent: true, depthWrite: false }));
    this.icon.scale.setScalar(0.7);
    g.add(this.icon);
    this.halo = glowSprite(def.color, 1.4, 2.4);
    g.add(this.halo);
    const beamGeo = new THREE.CylinderGeometry(0.22, 0.4, 30, 20, 1, true);
    beamGeo.translate(0, 15, 0);
    this.beam = new THREE.Mesh(beamGeo, new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `uniform vec3 uColor; uniform float uA; varying vec2 vUv; void main(){ float a = pow(max(1.0 - vUv.y, 0.0), 5.0) * uA * 0.55; gl_FragColor = vec4(uColor * a, 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: col.clone().multiplyScalar(2.2) }, uA: { value: 1 } },
    }));
    this.mark = floorGlow(def.color, 1.4, 2.2, 2.2);
    scene.add(g, this.beam, this.mark);
    this.scene = scene;
  }
  update(W, dt, time) {
    const o = this.o;
    const age = W.t - o.born;
    const appear = Math.min(1, age / 0.6);
    const blink = o.life < 3 ? (Math.sin(time * 22) > 0 ? 1 : 0.25) : 1;
    const y = 0.95 + Math.sin(time * 2.4 + o.id) * 0.12;
    this.group.position.set(o.x, y, o.z);
    this.group.scale.setScalar(appear * (1 + Math.sin(time * 5) * 0.04));
    this.shell.rotation.set(time * 0.7, time * 1.1, 0);
    this.core.material.uniforms.uTime.value = time;
    this.core.material.uniforms.uAmt.value = blink;
    this.shell.material.opacity = blink;
    this.icon.material.opacity = blink;
    this.beam.position.set(o.x, 0, o.z);
    this.beam.material.uniforms.uA.value = Math.max(0, 1 - age / 1.4) * 1.2;
    this.beam.visible = age < 1.4;
    this.mark.position.set(o.x, 0.025, o.z);
    this.mark.material.opacity = blink;
  }
  remove() {
    this.scene.remove(this.group, this.beam, this.mark);
  }
}

// ------------------------------------------------------------------ drones
export class DroneView {
  constructor(scene, d, color, env) {
    this.d = d;
    const g = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0x1a2030, metalness: 0.9, roughness: 0.3, envMap: env });
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.28, 0.16, 28), metal);
    g.add(saucer);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: hdr(color, 3) }));
    dome.position.y = 0.06;
    g.add(dome);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.03, 8, 40), new THREE.MeshBasicMaterial({ color: hdr(color, 5) }));
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    this.ring = ring;
    const gl = glowSprite(color, 1.5, 1.6);
    g.add(gl);
    this.group = g;
    this.under = floorGlow(color, 1.2, 1.6, 1.6);
    scene.add(g, this.under);
    this.scene = scene;
  }
  update(W, dt, time) {
    const d = this.d;
    this.group.position.set(d.x, 1.15 + Math.sin(time * 4 + d.id) * 0.08, d.z);
    this.group.rotation.y = time * 3;
    this.under.position.set(d.x, 0.025, d.z);
  }
  remove() { this.scene.remove(this.group, this.under); }
}

// ------------------------------------------------------------------ shield cells
const CELL_VERT = /* glsl */ `
varying vec3 vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position; vN = normal;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vV = cameraPosition - w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const CELL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 uSize; uniform float uHP; uniform float uHit; uniform float uBuild; uniform float uTime; uniform float uSeed;
varying vec3 vL; varying vec3 vN; varying vec3 vV;
${NOISE}
float cracks(vec2 p){
  vec2 i = floor(p), f = fract(p); float m1 = 9.0, m2 = 9.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(hash12(i + g + uSeed), hash12(i + g + uSeed + 7.7));
    float d = length(g + o - f);
    if (d < m1) { m2 = m1; m1 = d; } else if (d < m2) m2 = d;
  }
  return smoothstep(0.07, 0.0, m2 - m1);
}
void main(){
  float by = vL.y / uSize.y * 0.5 + 0.5;
  if (by > uBuild + 0.001) discard;
  vec3 a = abs(vL) / uSize;
  vec3 n = abs(vN);
  vec2 f; vec2 s;
  if (n.x > 0.5) { f = a.yz; s = uSize.yz; } else if (n.y > 0.5) { f = a.xz; s = uSize.xz; } else { f = a.xy; s = uSize.xy; }
  vec2 e = (1.0 - f) * s;
  float edge = exp(-min(e.x, e.y) * 24.0);
  float hex = 0.5 + 0.5 * sin(vL.x * 18.0 + uTime * 2.0) * sin(vL.y * 18.0);
  float fres = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 2.0);
  vec3 col = uColor * (edge * (1.4 + 2.6 * uHP) + (0.07 + hex * 0.05 + fres * 0.25) * (0.35 + uHP));
  float cr = cracks(vL.xy * vec2(3.2, 4.5)) * (1.0 - uHP);
  col += vec3(1.0, 0.85, 0.7) * cr * 3.0;
  col += vec3(1.5) * exp(-uHit * 9.0) * 1.5;
  col += uColor * smoothstep(0.06, 0.0, abs(by - uBuild)) * 6.0 * step(uBuild, 0.999);
  gl_FragColor = vec4(col, 1.0);
}`;

export class CellView {
  constructor(scene, c, color) {
    this.c = c;
    const w = CELL_HALF * 2, h = 0.74, d = F.cellHD * 2;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: CELL_VERT, fragmentShader: CELL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) }, uSize: { value: new THREE.Vector3(w / 2, h / 2, d / 2) }, uHP: { value: 1 }, uHit: { value: 9 }, uBuild: { value: 1 }, uTime: { value: 0 }, uSeed: { value: Math.random() * 50 } },
    });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), this.mat);
    this.mesh.position.set(c.x, h / 2 + 0.02, c.side * F.cellZ);
    this.mesh.renderOrder = 1;
    scene.add(this.mesh);
    this.hp = c.hp;
  }
  update(W, dt, time) {
    const c = this.c, u = this.mat.uniforms;
    u.uTime.value = time;
    u.uHP.value += (c.hp / c.max - u.uHP.value) * Math.min(1, dt * 10);
    u.uHit.value = W.t - c.hitT;
    const b = W.t - c.buildT;
    u.uBuild.value = c.hp > 0 ? Math.min(1, b < 0 ? 1 : b / 0.8) : 0;
    this.mesh.visible = c.hp > 0;
  }
}

// ------------------------------------------------------------------ reactor cores
const CORE_SPHERE = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uDamage; uniform float uHit;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float f = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 2.0);
  float sp = 1.0 + uDamage * 3.0;
  float n = fbm(vP * 2.2 + vec3(0.0, uTime * 0.6 * sp, uTime * 0.3 * sp));
  float veins = smoothstep(0.52, 0.6, n) - smoothstep(0.6, 0.7, n);
  vec3 hot = mix(uColor, vec3(1.0, 0.25, 0.08), uDamage);
  vec3 col = hot * (0.6 + n * 2.4) + hot * f * 4.0 + vec3(1.0, 0.9, 0.8) * veins * (1.0 + uDamage * 4.0);
  float flick = 1.0 - uDamage * 0.5 * step(0.7, fract(sin(uTime * 37.0) * 43758.5));
  col *= flick;
  col += vec3(3.0) * exp(-uHit * 5.0);
  gl_FragColor = vec4(col, 1.0);
}`;

export class CoreView {
  constructor(scene, core, color, env, maxHP) {
    this.core = core;
    const s = core.side;
    const g = new THREE.Group();
    g.position.set(0, 0, s * 13.7);
    const metal = new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.9, roughness: 0.35, envMap: env });
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 2.1, 0.55, 6), metal);
    ped.position.y = 0.27;
    g.add(ped);
    this.mat = new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: CORE_SPHERE,
      uniforms: { uColor: { value: new THREE.Color(color).multiplyScalar(1.3) }, uTime: { value: 0 }, uDamage: { value: 0 }, uHit: { value: 9 } } });
    this.sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 4), this.mat);
    this.sphere.position.y = 1.65;
    g.add(this.sphere);
    this.glow = glowSprite(color, 0.8, 3.4);
    this.sphere.add(this.glow);
    this.ringMat = new THREE.MeshBasicMaterial({ color: hdr(color, 3) });
    this.rings = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.3 + i * 0.18, 0.03, 8, 64), this.ringMat);
      r.position.y = 1.65;
      g.add(r);
      this.rings.push(r);
    }
    // HP pips around the pedestal
    this.pips = [];
    const pipGeo = new THREE.BoxGeometry(0.3, 0.12, 0.16);
    for (let i = 0; i < maxHP; i++) {
      const a = (i / maxHP) * Math.PI * 2;
      const m = new THREE.Mesh(pipGeo, new THREE.MeshBasicMaterial({ color: hdr(color, 4) }));
      m.position.set(Math.cos(a) * 1.85, 0.58, Math.sin(a) * 1.85);
      m.rotation.y = -a;
      g.add(m);
      this.pips.push(m);
    }
    // containment pylons
    for (const x of [-2.6, 2.6]) {
      const py = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), metal);
      py.position.set(x, 1.6, 0);
      g.add(py);
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.34), this.ringMat);
      tip.position.set(x, 3.25, 0);
      g.add(tip);
    }
    this.light = null;
    this.group = g;
    this.color = new THREE.Color(color);
    scene.add(g);
    this.dead = false;
  }
  update(W, dt, time) {
    const c = this.core;
    const dmg = 1 - c.hp / c.max;
    const u = this.mat.uniforms;
    u.uTime.value = time;
    u.uDamage.value += (dmg - u.uDamage.value) * Math.min(1, dt * 3);
    u.uHit.value = W.t - c.hitT;
    this.rings.forEach((r, i) => {
      r.rotation.set(time * (0.4 + i * 0.3) * (1 + dmg * 2), time * (0.25 + i * 0.2), i * 1.1);
    });
    const shake = Math.exp(-(W.t - c.hitT) * 4) * 0.25;
    this.sphere.position.set((Math.random() - 0.5) * shake, 1.65 + Math.sin(time * 1.5) * 0.06, (Math.random() - 0.5) * shake);
    this.pips.forEach((m, i) => {
      const on = i < c.hp;
      m.material.color.copy(on ? (c.hp <= 2 ? RED : this.color) : DIM).multiplyScalar(on ? (c.hp <= 2 && Math.sin(time * 10) > 0 ? 6 : 4) : 1);
    });
    this.sphere.visible = c.hp > 0 || W.t - c.hitT < 0.15;
    this.glow.material.color.copy(this.color).lerp(RED, dmg).multiplyScalar(c.hp > 0 ? 0.8 + Math.sin(time * 6) * 0.25 * dmg : 0);
  }
}
const RED = new THREE.Color(1, 0.12, 0.1);
const DIM = new THREE.Color(0.06, 0.06, 0.08);

// ------------------------------------------------------------------ black holes (arena + singularity power-up)
const DISK_FRAG = /* glsl */ `
uniform float uTime; uniform float uAmt; uniform vec3 uHot; uniform vec3 uCool;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 p = vUv - 0.5; float r = length(p) * 2.0;
  float a = atan(p.y, p.x);
  float spiral = fbm3(vec3(cos(a * 2.0 + r * 7.0 - uTime * 2.4) * 2.0, sin(a * 2.0 + r * 7.0 - uTime * 2.4) * 2.0, r * 3.0));
  float ring = smoothstep(0.2, 0.3, r) * smoothstep(1.0, 0.45, r);
  vec3 col = mix(uHot, uCool, smoothstep(0.25, 0.9, r)) * (0.4 + spiral * 2.2) * ring;
  col += uHot * 6.0 * exp(-pow((r - 0.27) * 30.0, 2.0));
  gl_FragColor = vec4(col * uAmt, 1.0);
}`;

export class HoleView {
  constructor(scene, size = 1, hot = 0xffb050, cool = 0x8a3cff) {
    const g = new THREE.Group();
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.42 * size, 32, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    this.ball.position.y = 0.5;
    g.add(this.ball);
    const geo = new THREE.PlaneGeometry(4.6 * size, 4.6 * size);
    geo.rotateX(-Math.PI / 2);
    this.disk = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uAmt: { value: 1 }, uHot: { value: hdr(hot, 1.6) }, uCool: { value: hdr(cool, 1.2) } },
    }));
    this.disk.position.y = 0.48;
    this.disk.rotation.z = 0.12;
    g.add(this.disk);
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(0.46 * size, 0.025, 8, 64), new THREE.MeshBasicMaterial({ color: hdr(hot, 6) }));
    this.ring.position.y = 0.5;
    g.add(this.ring);
    this.group = g;
    this.size = size;
    scene.add(g);
    this.scene = scene;
  }
  update(time, amt, cam) {
    this.disk.material.uniforms.uTime.value = time;
    this.disk.material.uniforms.uAmt.value = amt;
    this.ring.lookAt(cam.position);
    this.group.scale.setScalar(Math.max(0.01, amt));
  }
  remove() { this.scene.remove(this.group); }
}

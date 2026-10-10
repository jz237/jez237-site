import * as THREE from 'three';
import {S} from './Clouds';

/**
 * Lightning: a jagged channel built by recursive midpoint displacement with
 * forked branches, drawn as a glowing ribbon; a stepped leader that reveals it
 * top-down, then two to four return strokes that flicker the whole case; a
 * purple afterglow; sparks, a scorch flash and cooling embers where it lands
 * (blue spray on water); a halo inside the cloud.
 */
const MAX_PAIRS = 260;

interface Seg {pts: THREE.Vector3[]; level: number; width: number}
interface Bolt {
  mesh: THREE.Mesh;
  uniforms: Record<string, THREE.IUniform>;
  age: number;
  strokes: {t: number; amp: number}[];
  strength: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  water: boolean;
  fired: number;
  active: boolean;
}

function jitter(dir: THREE.Vector3, out: THREE.Vector3) {
  out.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
  out.addScaledVector(dir, -out.dot(dir));
  if (out.lengthSq() < 1e-8) out.set(1, 0, 0).addScaledVector(dir, -dir.x);
  return out.normalize();
}

/** Recursive midpoint displacement between a and b. */
function channel(a: THREE.Vector3, b: THREE.Vector3, levels: number, amp: number): THREE.Vector3[] {
  let pts = [a.clone(), b.clone()];
  let n = a.distanceTo(b) * amp;
  const d = new THREE.Vector3(), j = new THREE.Vector3();
  for (let l = 0; l < levels; l++) {
    const next: THREE.Vector3[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      d.subVectors(q, p).normalize();
      const m = new THREE.Vector3().lerpVectors(p, q, 0.4 + Math.random() * 0.2);
      m.addScaledVector(jitter(d, j), n * (Math.random() * 2 - 1));
      m.addScaledVector(d, n * 0.25 * (Math.random() * 2 - 1));
      next.push(m, q);
    }
    pts = next;
    n *= 0.55;
  }
  return pts;
}

export class Lightning {
  readonly group = new THREE.Group();
  readonly light: THREE.PointLight;
  flash = 0;
  private bolts: Bolt[] = [];
  private sparks: {p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; water: boolean}[] = [];
  private sparkPoints: THREE.Points;
  private sparkPos: Float32Array;
  private sparkAux: Float32Array;
  private decal: THREE.Mesh;
  private decalU = {uFlash: {value: 0}, uEmber: {value: 0}, uSeed: {value: 0}, uRadius: {value: 0.04}};
  private halo: THREE.Sprite;
  private groundGlow: THREE.Sprite;
  private resolution = new THREE.Vector2(1, 1);
  /** Called for each return stroke with its brightness (for sound and the brain). */
  onStroke?: (amp: number, bolt: {start: THREE.Vector3; end: THREE.Vector3; water: boolean; strength: number}, first: boolean) => void;

  constructor(private heightAt: (x: number, z: number) => number) {
    this.light = new THREE.PointLight(new THREE.Color(0.81, 0.85, 1.0), 0, 1.4, 2);
    this.group.add(this.light);
    for (let i = 0; i < 3; i++) this.bolts.push(this.makeBolt());
    // sparks
    const N = 120;
    for (let i = 0; i < N; i++) this.sparks.push({p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, max: 1, water: false});
    this.sparkPos = new Float32Array(N * 3);
    this.sparkAux = new Float32Array(N * 2);
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(this.sparkPos, 3).setUsage(THREE.DynamicDrawUsage));
    sg.setAttribute('aAux', new THREE.BufferAttribute(this.sparkAux, 2).setUsage(THREE.DynamicDrawUsage));
    this.sparkPoints = new THREE.Points(sg, new THREE.ShaderMaterial({
      uniforms: {uScale: {value: 900}},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: /* glsl */ `attribute vec2 aAux; varying vec2 vAux; uniform float uScale;
void main(){ vAux = aAux; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.5, 0.0022 * uScale / -mv.z * (0.6 + aAux.x)); }`,
      fragmentShader: /* glsl */ `varying vec2 vAux;
void main(){ float r = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.0, r) * vAux.x;
  vec3 hot = mix(vec3(1.0, 0.25, 0.05), vec3(1.0, 0.95, 0.85), vAux.x * vAux.x);
  vec3 col = mix(hot, vec3(0.55, 0.75, 1.0), vAux.y);
  gl_FragColor = vec4(col * a * 3.0, 0.0); }`,
    }));
    this.sparkPoints.frustumCulled = false;
    this.group.add(this.sparkPoints);
    // scorch flash and embers, conformed to the ground at the strike
    const dg = new THREE.PlaneGeometry(1, 1, 18, 18).rotateX(-Math.PI / 2);
    this.decal = new THREE.Mesh(dg, new THREE.ShaderMaterial({
      uniforms: this.decalU,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true, polygonOffset: true, polygonOffsetFactor: -2,
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `uniform float uFlash, uEmber, uSeed; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 c = (vUv - 0.5) * 2.0; float r2 = dot(c, c);
  vec3 col = vec3(0.85, 0.9, 1.0) * (exp(-30.0 * r2) * 2.5 + exp(-5.0 * r2) * 0.35) * uFlash;
  float e = smoothstep(0.62, 0.8, n(c * 9.0) * 0.7 + n(c * 23.0) * 0.3) * exp(-2.5 * r2);
  vec3 ember = mix(vec3(1.0, 0.18, 0.03), vec3(1.0, 0.62, 0.25), uEmber);
  col += ember * e * uEmber * 3.0;
  gl_FragColor = vec4(col, 0.0);
}`,
    }));
    this.decal.visible = false;
    this.decal.frustumCulled = false;
    this.group.add(this.decal);
    const glowTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(244,246,255,1)');
      grad.addColorStop(0.25, 'rgba(160,172,255,0.45)');
      grad.addColorStop(1, 'rgba(154,166,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    this.halo = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0}));
    this.groundGlow = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0}));
    this.halo.renderOrder = this.groundGlow.renderOrder = 13;
    this.group.add(this.halo, this.groundGlow);
  }

  private makeBolt(): Bolt {
    const g = new THREE.BufferGeometry();
    const V = MAX_PAIRS * 2;
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(V * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aNext', new THREE.BufferAttribute(new Float32Array(V * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aInfo', new THREE.BufferAttribute(new Float32Array(V * 4), 4).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(MAX_PAIRS * 6), 1).setUsage(THREE.DynamicDrawUsage));
    const uniforms = {
      uRes: {value: this.resolution},
      uWidth: {value: 0.004}, uMinPx: {value: 6}, uRatio: {value: 4},
      uEnv: {value: new THREE.Vector4()}, // main, branches, afterglow, leader reveal
    };
    const mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms,
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, premultipliedAlpha: true, side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
attribute vec3 aNext; attribute vec4 aInfo; uniform vec2 uRes; uniform float uWidth, uMinPx; varying vec4 vInfo;
void main(){
  vInfo = aInfo;
  vec4 c0 = projectionMatrix * viewMatrix * vec4(position, 1.0);
  vec4 c1 = projectionMatrix * viewMatrix * vec4(aNext, 1.0);
  vec2 s0 = c0.xy / c0.w * uRes * 0.5, s1 = c1.xy / c1.w * uRes * 0.5;
  vec2 d = s1 - s0; d = dot(d, d) > 1e-6 ? normalize(d) : vec2(0.0, 1.0);
  vec2 nrm = vec2(-d.y, d.x);
  float px = max(uWidth * aInfo.y * uRes.y * 0.5 * projectionMatrix[1][1] / c0.w, uMinPx * aInfo.y);
  c0.xy += nrm * aInfo.x * px / (uRes * 0.5) * c0.w;
  gl_Position = c0;
}`,
      fragmentShader: /* glsl */ `uniform vec4 uEnv; uniform float uRatio; varying vec4 vInfo;
void main(){
  float a = vInfo.x, lvl = vInfo.z, along = vInfo.w;
  float x = a * uRatio;
  float core = exp(-x * x * 1.6);
  float glow = exp(-a * a * 4.0) * 0.5 + exp(-a * a * 16.0);
  float lead = 1.0 - smoothstep(uEnv.w - 0.03, uEnv.w, along);
  float inCloud = mix(0.25, 1.0, smoothstep(0.0, 0.12, along));
  float vI = (lvl < 0.5 ? uEnv.x : uEnv.y) * lead * inCloud;
  float after = uEnv.z * lead * (lvl < 0.5 ? 1.0 : 0.4);
  vec3 col = vec3(0.92, 0.94, 1.0) * core * 9.0 * vI + vec3(0.5, 0.54, 1.0) * glow * 0.7 * vI + vec3(0.75, 0.55, 1.0) * (core * 1.2 + glow * 0.12) * after;
  gl_FragColor = vec4(col, 0.0);
}`,
    }));
    mesh.frustumCulled = false;
    mesh.renderOrder = 12;
    mesh.visible = false;
    this.group.add(mesh);
    return {mesh, uniforms, age: 0, strokes: [], strength: 1, start: new THREE.Vector3(), end: new THREE.Vector3(), water: false, fired: 0, active: false};
  }

  setResolution(w: number, h: number) {this.resolution.set(w, h);}
  setPixelScale(s: number) {(this.sparkPoints.material as THREE.ShaderMaterial).uniforms.uScale.value = s;}

  strike(start: THREE.Vector3, end: THREE.Vector3, strength: number, water: boolean) {
    let b = this.bolts.find((q) => !q.active);
    if (!b) b = this.bolts.reduce((p, q) => (p.age > q.age ? p : q));
    b.start.copy(start); b.end.copy(end); b.water = water; b.strength = strength;
    b.age = -0.075;
    b.fired = 0;
    b.active = true;
    const t1 = 0.085 + Math.random() * 0.05, t2 = t1 + 0.08 + Math.random() * 0.07, t3 = t2 + 0.09 + Math.random() * 0.08;
    b.strokes = [{t: 0, amp: 1}, {t: t1, amp: 0.6 + Math.random() * 0.3}, {t: t2, amp: 0.4 + Math.random() * 0.3}];
    if (Math.random() < 0.45) b.strokes.push({t: t3, amp: 0.25 + Math.random() * 0.2});
    // geometry: the main channel and its forks
    const segs: Seg[] = [];
    const main = channel(start, end, 5, 0.32);
    segs.push({pts: main, level: 0, width: 1});
    const nb = Math.round(3 * (0.6 + 0.8 * Math.random()));
    for (let k = 0; k < nb; k++) {
      const i0 = Math.floor(main.length * (0.1 + Math.random() * 0.55));
      const a = main[i0];
      const drop = (a.y - end.y) * (0.25 + Math.random() * 0.35);
      const ang = Math.random() * Math.PI * 2;
      const hd = a.distanceTo(end) * (0.15 + Math.random() * 0.25);
      const bEnd = new THREE.Vector3(a.x + Math.cos(ang) * hd, a.y - drop, a.z + Math.sin(ang) * hd * 0.5);
      bEnd.y = Math.max(bEnd.y, this.heightAt(bEnd.x, bEnd.z) + 0.15 * S);
      const pts = channel(a, bEnd, 3, 0.38);
      segs.push({pts, level: 1, width: 0.55});
      if (Math.random() < 0.6) {
        const j0 = Math.floor(pts.length * (0.3 + Math.random() * 0.4));
        const ta = pts[j0];
        const tEnd = ta.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.05, -drop * 0.3, (Math.random() - 0.5) * 0.03));
        segs.push({pts: channel(ta, tEnd, 2, 0.38), level: 2, width: 0.35});
      }
    }
    this.writeBolt(b, segs);
    b.uniforms.uWidth.value = (0.05 + 0.03 * strength) * S * 0.6;
    b.uniforms.uRatio.value = 4;
    b.mesh.visible = true;
    // ground effects
    this.decal.position.set(end.x, 0, end.z);
    const R = (0.7 + 0.35 * strength) * S;
    this.decal.scale.set(R * 2, 1, R * 2);
    const pos = this.decal.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = end.x + pos.getX(i) * R * 2, z = end.z + pos.getZ(i) * R * 2;
      pos.setY(i, this.heightAt(x, z) + 0.0008);
    }
    pos.needsUpdate = true;
    this.decalU.uSeed.value = Math.random() * 100;
    this.decal.visible = !water;
    this.halo.position.copy(start);
    this.groundGlow.position.copy(end).y += 0.1 * S;
  }

  private writeBolt(b: Bolt, segs: Seg[]) {
    const g = b.mesh.geometry;
    const P = g.attributes.position as THREE.BufferAttribute, Nx = g.attributes.aNext as THREE.BufferAttribute, I = g.attributes.aInfo as THREE.BufferAttribute;
    const idx = g.index!;
    let pair = 0, ic = 0;
    for (const s of segs) {
      const n = s.pts.length;
      if (pair + n > MAX_PAIRS) break;
      const startPair = pair;
      for (let i = 0; i < n; i++) {
        const p = s.pts[i];
        const q = i < n - 1 ? s.pts[i + 1] : p.clone().add(p.clone().sub(s.pts[i - 1]));
        const t = i / (n - 1);
        const w = s.width * (s.level === 0 ? 1 - 0.25 * t : 1 - 0.6 * t);
        // along: 0 at the cloud, 1 at the ground (branches inherit roughly)
        const along = s.level === 0 ? t : 0.3 + t * 0.6;
        for (const side of [-1, 1]) {
          const k = pair * 2 + (side > 0 ? 1 : 0);
          P.setXYZ(k, p.x, p.y, p.z);
          Nx.setXYZ(k, q.x, q.y, q.z);
          I.setXYZW(k, side, w, s.level, along);
        }
        pair++;
      }
      for (let i = startPair; i < pair - 1; i++) {
        const a = i * 2;
        idx.setX(ic++, a); idx.setX(ic++, a + 1); idx.setX(ic++, a + 2);
        idx.setX(ic++, a + 1); idx.setX(ic++, a + 3); idx.setX(ic++, a + 2);
      }
    }
    g.setDrawRange(0, ic);
    P.needsUpdate = Nx.needsUpdate = I.needsUpdate = idx.needsUpdate = true;
  }

  private burst(at: THREE.Vector3, n: number, strength: number, water: boolean) {
    for (let k = 0; k < n; k++) {
      let s = this.sparks.find((q) => q.life <= 0);
      if (!s) s = this.sparks[Math.floor(Math.random() * this.sparks.length)];
      const z = Math.random();
      const sp = (1.6 + 4.2 * z * z) * (0.6 + 0.4 * strength) * 0.11;
      const a = Math.random() * Math.PI * 2, up = 0.3 + Math.random() * 0.7;
      s.p.copy(at).y += 0.002;
      s.v.set(Math.cos(a) * sp * (1 - up * 0.5), sp * up, Math.sin(a) * sp * (1 - up * 0.5));
      s.max = s.life = 0.28 + Math.random() * 0.55;
      s.water = water;
    }
  }

  /** Advances bolts; returns the summed flash for lights. `day` dims the flash in daylight. */
  update(dt: number, day: number) {
    let glowAmt = 0, groundAmt = 0, emberAmt = 0, decalFlash = 0;
    for (const b of this.bolts) {
      if (!b.active) continue;
      b.age += dt;
      const t = b.age;
      const u = b.uniforms.uEnv.value as THREE.Vector4;
      let env = 0;
      if (t < 0) {
        // stepped leader: reveal top-down, faint flicker
        u.set((0.1 + 0.12 * Math.random()) * b.strength, 0, 0, 1 + t / 0.075);
      } else {
        b.strokes.forEach((s, i) => {
          const d = t - s.t;
          if (d < 0) return;
          const hold = i === 0 ? 0.045 : 0.025;
          env += s.amp * (d < hold ? 1 : Math.exp(-(d - hold) * 15));
          if (b.fired <= i) {
            b.fired = i + 1;
            this.flash = Math.max(this.flash, Math.min(1, s.amp * b.strength * (0.8 - 0.35 * day)));
            if (i === 0) {
              this.burst(b.end, Math.round(72 * 0.62), b.strength, b.water);
              this.light.position.set(b.end.x, Math.min(0.62, b.end.y + 3 * S), b.end.z);
            } else this.burst(b.end, Math.round(72 * (i === 1 ? 0.23 : 0.15)), b.strength, b.water);
            this.onStroke?.(s.amp, b, i === 0);
          }
        });
        const after = 0.1 * b.strength * Math.exp(-2.4 * t);
        u.set(env * b.strength, env * b.strength * Math.exp(-7 * t), after, 1.5);
        glowAmt = Math.max(glowAmt, (env + 2 * after) * 0.32);
        groundAmt = Math.max(groundAmt, env * Math.exp(-5 * t));
        decalFlash = Math.max(decalFlash, env);
        emberAmt = Math.max(emberAmt, b.water ? 0 : Math.exp(-1.9 * t) * b.strength);
      }
      if (t > 1.6) {b.active = false; b.mesh.visible = false;}
    }
    this.flash = Math.max(0, this.flash - dt * 3.2 * (0.6 + this.flash));
    this.light.intensity = this.flash * 3.2;
    const hm = this.halo.material as THREE.SpriteMaterial;
    hm.opacity = Math.min(1, glowAmt);
    this.halo.scale.setScalar((1.9 + 0.8) * S * 1.4);
    const gm = this.groundGlow.material as THREE.SpriteMaterial;
    gm.opacity = Math.min(1, groundAmt * 1.5);
    this.groundGlow.scale.setScalar((0.42 + 0.22) * S * 1.6);
    this.decalU.uFlash.value = decalFlash;
    this.decalU.uEmber.value = emberAmt;
    if (this.decal.visible && emberAmt < 0.01 && decalFlash < 0.01 && !this.bolts.some((b) => b.active)) this.decal.visible = false;
    // sparks
    this.sparks.forEach((s, i) => {
      if (s.life > 0) {
        s.life -= dt;
        s.v.multiplyScalar(Math.exp(-1.7 * dt));
        s.v.y -= 9 * 0.11 * dt;
        s.p.addScaledVector(s.v, dt);
        const g = this.heightAt(s.p.x, s.p.z);
        if (s.p.y < g) {s.p.y = g; s.v.y *= -0.3; s.v.x *= 0.5; s.v.z *= 0.5;}
      }
      this.sparkPos.set([s.p.x, s.life > 0 ? s.p.y : -10, s.p.z], i * 3);
      this.sparkAux[i * 2] = Math.max(0, s.life / s.max);
      this.sparkAux[i * 2 + 1] = s.water ? 1 : 0;
    });
    (this.sparkPoints.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.sparkPoints.geometry.attributes.aAux as THREE.BufferAttribute).needsUpdate = true;
    return this.flash;
  }
}

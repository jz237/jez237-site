import * as THREE from 'three';
import {TANK} from './Case';
import {groundHeight, poolDistance, WATER_LEVEL, POOL} from './Ground';
import type {Surface} from './Surface';
import type {Ledge} from './Peaks';
import {Ripples} from './Ripples';
import {WIND_GLSL} from './WindField';

const HZ = TANK.d / 2;

/** Ground-height texture over the pool so the water knows its own depth. */
function bedTexture(x0: number, x1: number, z0: number, z1: number, n = 192) {
  // half floats filter linearly on every WebGL 2 device
  const data = new Uint16Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = x0 + (i / (n - 1)) * (x1 - x0), z = z0 + (j / (n - 1)) * (z1 - z0);
    data[j * n + i] = THREE.DataUtils.toHalfFloat(groundHeight(x, z));
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RedFormat, THREE.HalfFloatType);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}


const commonGLSL = /* glsl */ `
float wh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float wn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(wh(i), wh(i+vec2(1,0)), u.x), mix(wh(i+vec2(0,1)), wh(i+vec2(1,1)), u.x), u.y); }
`;

/** How high the sliding sheet rides above the smoothed rock heights (the real rock is rougher). */
const FLOW_DEPTH = 0.007;

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
    uRain: {value: 0},
    uAmbient: {value: 1},
    uFlash: {value: 0},
    tRipple: {value: null as THREE.Texture | null},
    uRippleBox: {value: new THREE.Vector4()},
    uRippleTexel: {value: new THREE.Vector2()},
    uRippleA: {value: 0},
    tWind: {value: null as THREE.Texture | null},
    uWindBox: {value: new THREE.Vector4(-TANK.w / 2, -TANK.d / 2, TANK.w, TANK.d)},
    uGust: {value: new THREE.Vector3()},
  };
  readonly ripples: Ripples;
  private impactT = 0;
  private drips: {p: THREE.Vector3; v: THREE.Vector3; life: number}[] = [];
  private dripPoints: THREE.Points;
  readonly reflectRT: THREE.WebGLRenderTarget;
  private mirrorCam = new THREE.PerspectiveCamera();
  readonly fall: THREE.Mesh;
  readonly spray: THREE.Points;
  private sprayData: {p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; floor: number}[] = [];
  /** Soft mist rising where the falls strike. */
  readonly mist: THREE.Points;
  private mistData: {p: THREE.Vector3; v: THREE.Vector3; life: number; max: number; size: number}[] = [];
  /** Where each fall lands on the ledge below it (the pool's impact is separate). */
  private landings: THREE.Vector3[] = [];
  readonly surfaceMesh: THREE.Mesh;

  constructor(surface: Surface, private ledges: Ledge[]) {
    const x0 = POOL.cx - POOL.rx * 1.25, x1 = Math.min(TANK.w / 2, POOL.cx + POOL.rx * 1.25);
    const z0 = POOL.cz - POOL.rz * 1.3, z1 = HZ;
    this.uniforms.tBed.value = bedTexture(x0, x1, z0, z1);
    this.uniforms.uBedBox.value.set(x0, z0, x1 - x0, z1 - z0);
    this.ripples = new Ripples(this.uniforms.uBedBox.value.clone(), this.uniforms.tBed.value!);
    this.uniforms.uRippleBox.value.copy(this.ripples.box);
    this.uniforms.uRippleTexel.value.set(1 / this.ripples.nx, 1 / this.ripples.nz);
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
    // white water churning where each fall lands on the ledge below
    const foam = this.foamPads();
    foam.layers.set(1);
    foam.renderOrder = 4.5;
    this.group.add(foam);

    // Spray and mist at the foot of the falls.
    const N = 260;
    const sp = new THREE.BufferGeometry();
    sp.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    sp.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(N), 1));
    for (let i = 0; i < N; i++) this.sprayData.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: Math.random(), max: 1, floor: WATER_LEVEL});
    this.spray = new THREE.Points(sp, new THREE.ShaderMaterial({
      uniforms: {uScale: {value: 900}, uLight: {value: 1}},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: `attribute float aLife; varying float vL; uniform float uScale;
void main(){ vL = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uScale * (0.004 + 0.012 * (1.0 - aLife)) / -mv.z; }`,
      fragmentShader: `uniform float uLight; varying float vL; void main(){ vec2 c = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.0, 0.5, length(c))); gl_FragColor = vec4(vec3(0.85, 0.8, 0.72) * a * vL * 0.18 * uLight, 0.0); }`,
    }));
    this.spray.frustumCulled = false;
    this.spray.layers.set(1);
    this.spray.renderOrder = 5;
    this.group.add(this.spray);

    // Mist: soft veils of fine droplets hanging over each strike and the plunge.
    const M = 84;
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(M * 3), 3).setUsage(THREE.DynamicDrawUsage));
    mg.setAttribute('aMist', new THREE.BufferAttribute(new Float32Array(M * 2), 2).setUsage(THREE.DynamicDrawUsage));
    for (let i = 0; i < M; i++) this.mistData.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: Math.random(), max: 2.5, size: 0.02});
    this.mist = new THREE.Points(mg, new THREE.ShaderMaterial({
      uniforms: {
        uScale: {value: 900}, uKeyColor: this.uniforms.uKeyColor, uAmbient: this.uniforms.uAmbient,
        tDist: {value: null as THREE.Texture | null}, uUseDist: {value: 0}, uResolution: this.uniforms.uResolution,
      },
      transparent: true, depthWrite: false,
      vertexShader: `attribute vec2 aMist; varying float vL; varying float vD; uniform float uScale;
void main(){ vL = aMist.x; vec4 mv = modelViewMatrix * vec4(position, 1.0); vD = length(mv.xyz); gl_Position = projectionMatrix * mv; gl_PointSize = min(uScale * aMist.y / max(-mv.z, 0.01), 512.0); }`,
      fragmentShader: `uniform float uAmbient, uUseDist; uniform vec3 uKeyColor; uniform sampler2D tDist; uniform vec2 uResolution; varying float vL; varying float vD;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = exp(-dot(c, c) * 14.0) - 0.03;
  // swells in, then thins away as it rises
  a *= smoothstep(0.0, 0.3, 1.0 - vL) * smoothstep(0.0, 0.6, vL);
  // softly meets the rock and water it drifts against
  if (uUseDist > 0.5) a *= clamp((texture2D(tDist, gl_FragCoord.xy / uResolution).r - vD) / 0.012, 0.0, 1.0);
  if (a <= 0.0) discard;
  vec3 col = uKeyColor * 0.85 + vec3(0.16, 0.15, 0.14) * uAmbient;
  gl_FragColor = vec4(col, a * 0.09);
}`,
    }));
    this.mist.frustumCulled = false;
    this.mist.layers.set(1);
    this.mist.renderOrder = 5;
    this.mist.name = 'falls-mist';
    this.group.add(this.mist);

    // droplets flicked up when the water is touched
    const D = 90;
    for (let i = 0; i < D; i++) this.drips.push({p: new THREE.Vector3(0, -1, 0), v: new THREE.Vector3(), life: 0});
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(D * 3), 3).setUsage(THREE.DynamicDrawUsage));
    dg.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(D), 1).setUsage(THREE.DynamicDrawUsage));
    this.dripPoints = new THREE.Points(dg, new THREE.ShaderMaterial({
      uniforms: {uScale: {value: 900}, uLight: {value: 1}},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, premultipliedAlpha: true,
      vertexShader: `attribute float aLife; varying float vL; uniform float uScale; void main(){ vL = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.5, 0.0028 * uScale / -mv.z); }`,
      fragmentShader: `uniform float uLight; varying float vL; void main(){ vec2 c = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.15, 0.5, length(c))); float glint = (1.0 - smoothstep(0.0, 0.2, length(c - vec2(-0.12, -0.12)))); gl_FragColor = vec4(vec3(0.75, 0.78, 0.8) * (a * 0.5 + glint) * vL * uLight, 0.0); }`,
    }));
    this.dripPoints.frustumCulled = false;
    this.dripPoints.layers.set(1);
    this.dripPoints.renderOrder = 5;
    this.group.add(this.dripPoints);
  }

  private cascadePoints: THREE.Vector3[] = [];

  /** Builds the flow path from the gap between the peaks down the ledges into the pool. */
  private cascadeGeometry(surface: Surface) {
    const top = (x: number, z: number) => surface.heightAt(x, z);
    // the highest rock across the sheet's width: a crest at one side must not poke
    // through it (a wall rising beside it is not something it runs over)
    const topAcross = (x: number, z: number) => {
      const c = top(x, z);
      let m = c;
      for (const s of [-0.013, -0.0065, 0.0065, 0.013]) {const h = top(x + s, z); if (h - c < 0.012) m = Math.max(m, h);}
      return m;
    };
    // anything at all across the width (for keeping a falling sheet off the face)
    const topAll = (x: number, z: number) => Math.max(top(x - 0.024, z), top(x - 0.012, z), top(x, z), top(x + 0.012, z), top(x + 0.024, z));
    // Free falls follow a short parabola away from each lip, kept out in front of
    // the face they drop past.
    const fallTo = (a: THREE.Vector3, b: THREE.Vector3, n: number, out: THREE.Vector3[]) => {
      let z = a.z;
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const p = new THREE.Vector3().lerpVectors(a, b, Math.sqrt(t) * 0.45 + t * 0.55);
        p.y = a.y + (b.y - a.y) * t * t;
        p.z = Math.max(p.z, z);
        // (clear of the rock under it and of the face just behind it)
        if (i < n) for (let k = 0; k < 20 && (topAll(p.x, p.z) > p.y - 0.003 || topAll(p.x, p.z - 0.006) > p.y - 0.001); k++) p.z += 0.002;
        z = p.z;
        out.push(p);
        // air is drawn in as it drops: glassy over the lip, white a few centimetres down
        fallen.push(Math.min(1, (a.y - p.y) / 0.03));
      }
      // (pushed out past where it was aimed, it lands there instead)
      b.z = z;
    };
    // Sliding sheets hug the ledge top.
    const slide = (a: THREE.Vector3, b: THREE.Vector3, n: number, out: THREE.Vector3[]) => {
      for (let i = 1; i <= n; i++) {
        const p = new THREE.Vector3().lerpVectors(a, b, i / n);
        p.y = Math.max(p.y, topAcross(p.x, p.z) + FLOW_DEPTH);
        out.push(p);
        fallen.push(0);
      }
    };
    const pts: THREE.Vector3[] = [];
    const fallen: number[] = [];
    let prev: THREE.Vector3 | null = null;
    this.ledges.forEach((l, i) => {
      const lip = new THREE.Vector3(l.cx + 0.004, 0, l.cz + l.hd * 0.95);
      lip.y = topAcross(lip.x, lip.z) + FLOW_DEPTH;
      let start: THREE.Vector3;
      if (prev) {
        // The ledges are steps whose backs lie under the one above: the water
        // spilling off the lip above strikes this ledge a little out from that
        // face, where it is open to the sky.
        start = new THREE.Vector3((prev.x + l.cx) / 2, 0, prev.z + 0.012);
        for (let k = 0; k < 20 && top(start.x, start.z) > prev.y - 0.025 && start.z < lip.z - 0.012; k++) start.z += 0.003;
        start.y = topAcross(start.x, start.z) + FLOW_DEPTH;
        fallTo(prev, start, 8 + i, pts);
        start.y = topAcross(start.x, start.z) + FLOW_DEPTH;
        pts[pts.length - 1].copy(start);
        this.landings.push(start.clone());
      } else {
        start = new THREE.Vector3(l.cx - 0.004, 0, l.cz - l.hd * 0.55);
        start.y = top(start.x, start.z) + FLOW_DEPTH;
        pts.push(start.clone().add(new THREE.Vector3(0, 0.003, -0.008)), start);
        fallen.push(0, 0);
      }
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
      // A broad sheet, spreading as it goes down the cascade (most of each ledge's width).
      const w = 0.032 + 0.03 * t + 0.007 * Math.sin(t * 9.0);
      // across the sheet: the tank's width, square to the flow (stable even where it drops straight down)
      const side = new THREE.Vector3(1, 0, 0).addScaledVector(tan, -tan.x).normalize();
      const steep = Math.min(1, Math.max(0, -tan.y * 1.4));
      // white water where a fall strikes a ledge and churns across it, and at the plunge
      let churn = 1 - THREE.MathUtils.smoothstep(p.distanceTo(pts[pts.length - 1]), 0.006, 0.04);
      // how far it has fallen since the last lip (from the nearest two path points)
      let k0 = 0, d0 = Infinity, k1 = 0, d1 = Infinity;
      pts.forEach((q, k) => {const d = q.distanceTo(p); if (d < d0) {k1 = k0; d1 = d0; k0 = k; d0 = d;} else if (d < d1) {k1 = k; d1 = d;}});
      const air = (fallen[k0] * d1 + fallen[k1] * d0) / Math.max(1e-6, d0 + d1);
      for (const L of this.landings) churn = Math.max(churn, 1 - THREE.MathUtils.smoothstep(p.distanceTo(L), 0.006, 0.032));
      const normal = new THREE.Vector3().crossVectors(side, tan).normalize();
      // (facing out from the rock and up off the ledges, so the sheet's swell never sinks into them)
      if (normal.y + normal.z < 0) normal.negate();
      for (let j = 0; j <= across; j++) {
        const v = j / across - 0.5;
        const bulge = (1 - 4 * v * v) * 0.003;
        pos.push(p.x + side.x * v * w + normal.x * bulge, p.y + side.y * v * w + normal.y * bulge, p.z + side.z * v * w + normal.z * bulge);
        uv.push(j / across, t * len);
        aux.push(steep, t, churn, air);
      }
    }
    for (let i = 0; i < segs; i++) for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j, b = a + across + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('aFlow', new THREE.Float32BufferAttribute(aux, 4));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  /** Points along the falls and where they strike, each with how far the wet and spray reach (m). */
  wetSpots(max: number) {
    const out: THREE.Vector4[] = [];
    const curve = new THREE.CatmullRomCurve3(this.cascadePoints, false, 'centripetal');
    const n = Math.max(2, max - this.landings.length - 1);
    for (let i = 0; i < n; i++) {
      const p = curve.getPointAt(i / (n - 1));
      out.push(new THREE.Vector4(p.x, p.y, p.z, 0.028 + 0.012 * (i / (n - 1))));
    }
    for (const L of this.landings) out.push(new THREE.Vector4(L.x, L.y, L.z + 0.006, 0.045));
    const im = this.uniforms.uImpact.value;
    out.push(new THREE.Vector4(im.x, im.y, im.z, 0.055));
    return out.slice(0, max);
  }

  /**
   * Churning white water on each ledge where a fall lands, and around the plunge:
   * a low boiling dome of bubbles, solid where the water strikes, breaking into
   * lace as it spreads downstream.
   */
  private foamPads() {
    const spots = [...this.landings.map((p) => ({p, r: 0.024})), {p: this.uniforms.uImpact.value.clone(), r: 0.04}];
    const pos: number[] = [], aux: number[] = [], idx: number[] = [];
    const SEG = 28, RINGS = [0, 0.3, 0.6, 0.85, 1];
    spots.forEach(({p, r}, k) => {
      const base = pos.length / 3;
      RINGS.forEach((f, ri) => {
        const n = ri === 0 ? 1 : SEG;
        for (let i = 0; i < n; i++) {
          const a = (i / SEG) * Math.PI * 2;
          // spreads downstream (toward the glass) more than up
          const rr = r * f * (1 + 0.45 * Math.max(0, Math.sin(a)));
          const dome = 0.0012 + 0.0042 * (1 - f * f);
          pos.push(p.x + Math.cos(a) * rr, p.y + dome, p.z + 0.006 + Math.sin(a) * rr * 0.8);
          aux.push(f, k);
        }
      });
      for (let i = 0; i < SEG; i++) idx.push(base, base + 1 + i, base + 1 + ((i + 1) % SEG));
      for (let ri = 1; ri < RINGS.length - 1; ri++) {
        const a0 = base + 1 + (ri - 1) * SEG, b0 = a0 + SEG;
        for (let i = 0; i < SEG; i++) {
          const i1 = (i + 1) % SEG;
          idx.push(a0 + i, b0 + i, a0 + i1, a0 + i1, b0 + i, b0 + i1);
        }
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aFoam', new THREE.Float32BufferAttribute(aux, 2));
    g.setIndex(idx);
    const m = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
uniform float uTime;
attribute vec2 aFoam; varying vec2 vF; varying vec3 vW;
void main(){
  vF = aFoam;
  vec3 q = position;
  // the dome heaves as the water boils up under it
  q.y += 0.0014 * (1.0 - aFoam.x) * sin(uTime * 8.0 + position.x * 900.0 + position.z * 700.0 + aFoam.y * 2.0);
  vec4 w = modelMatrix * vec4(q, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
uniform float uTime, uAmbient; uniform vec3 uKeyColor;
varying vec2 vF; varying vec3 vW;
${commonGLSL}
void main(){
  float r = vF.x;
  // clots of bubbles boiling up and drifting away from the strike (downstream, +z)
  vec2 p = vW.xz + vec2(0.0, -uTime * 0.012) + vF.y * 0.37;
  float midAA = 1.0 - smoothstep(0.3, 0.8, length(fwidth(vW.xz * 310.0)));
  float big = wn(p * 150.0) * 0.6 + mix(0.5, wn(p * 310.0 + vec2(uTime * 0.9, 0.0)), midAA) * 0.4;
  float fineAA = 1.0 - smoothstep(0.3, 0.8, length(fwidth(vW.xz * 520.0)));
  float fine = mix(0.5, wn(vW.xz * 520.0 + vec2(uTime * 2.3, -uTime * 3.1)), fineAA);
  float pulse = 0.5 + 0.5 * sin(uTime * 6.0 + big * 7.0 + vF.y);
  float core = 1.0 - smoothstep(0.2, 0.7, r + (big - 0.5) * 0.3);
  float clots = smoothstep(0.32, 0.68, big + (fine - 0.5) * 0.25);
  // a mass of white water with a ragged rim: between the clots it is still
  // churned and pale (not clear), so the gaps are shaded, not holes
  float body = 1.0 - smoothstep(0.62, 1.0, r + (big - 0.5) * 0.4);
  float a = body * mix(0.78, 0.96, max(core, clots));
  // lit like a heap of bubbles: bright crowns, faint blue-grey in the hollows
  float shade = 0.7 + 0.2 * clots + 0.08 * fine + 0.06 * pulse * core;
  vec3 col = (uKeyColor * 0.95 + vec3(0.15, 0.145, 0.14) * uAmbient) * shade;
  col = mix(col * vec3(0.8, 0.86, 0.9), col, max(clots, core * 0.6));
  gl_FragColor = vec4(col, a);
}`,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    mesh.name = 'falls-foam';
    return mesh;
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
uniform float uTime, uRain, uFlash, uRippleA, uAmbient; uniform sampler2D tRefract, tReflect, tBed, tRipple; uniform vec2 uResolution, uRippleTexel; uniform vec4 uBedBox, uRippleBox;
uniform mat4 uReflectMatrix; uniform vec3 uKeyDir, uKeyColor, uImpact;
varying vec3 vW; varying vec4 vClip;
${commonGLSL}
${WIND_GLSL}
float rippleH(vec2 uv){ vec4 r = texture2D(tRipple, uv); return mix(r.g, r.r, uRippleA); }
float waveH(vec2 p, float chop){
  float h = 0.0;
  h += (wn(p * 90.0 + vec2(uTime * 0.21, uTime * 0.13)) - 0.5) * 0.0005 * (0.4 + chop);
  h += (wn(p * 210.0 - vec2(uTime * 0.31, -uTime * 0.27)) - 0.5) * 0.00025 * (0.4 + chop * 1.4);
  return h;
}
void main(){
  vec2 bedUv = (vW.xz - uBedBox.xy) / uBedBox.zw;
  float bed = texture2D(tBed, bedUv).r;
  float depth = ${WATER_LEVEL.toFixed(4)} - bed;
  if (depth < -0.0005) discard;
  // wind roughens the surface into cat's paws
  vec2 wv = windAt(vW.xz, uTime);
  float paw = wgn(vW.xz * 18.0 - wv * uTime * 3.0);
  float chop = smoothstep(0.03, 0.6, length(wv)) * (0.6 + 1.2 * smoothstep(0.42, 0.8, paw));
  float e = 0.0004;
  float h0 = waveH(vW.xz, chop);
  vec3 n = normalize(vec3(-(waveH(vW.xz + vec2(e, 0.0), chop) - h0) / e, 1.0, -(waveH(vW.xz + vec2(0.0, e), chop) - h0) / e));
  // simulated ripples: touches, raindrops, wading feet, the falls
  vec2 rpuv = (vW.xz - uRippleBox.xy) / uRippleBox.zw;
  float rs = 0.0018;
  float rx = (rippleH(rpuv + vec2(uRippleTexel.x, 0.0)) - rippleH(rpuv - vec2(uRippleTexel.x, 0.0))) * rs / (2.0 * uRippleTexel.x * uRippleBox.z);
  float rz = (rippleH(rpuv + vec2(0.0, uRippleTexel.y)) - rippleH(rpuv - vec2(0.0, uRippleTexel.y))) * rs / (2.0 * uRippleTexel.y * uRippleBox.w);
  n = normalize(n + vec3(-rx, 0.0, -rz));
  vec3 V = normalize(cameraPosition - vW);
  float cosT = max(dot(n, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec2 suv = gl_FragCoord.xy / uResolution;
  // refraction: shift the view of the bed by the surface slope, more where it is deep
  vec2 roff = n.xz * clamp(depth, 0.0, 0.06) * 2.2;
  vec3 below = texture2D(tRefract, suv + roff).rgb;
  // tea-stained terrarium water: tannins absorb blue first
  vec3 absorb = exp(-(depth + 0.005) * vec3(16.0, 28.0, 52.0));
  vec3 scatter = vec3(0.012, 0.016, 0.008) * (1.0 - absorb.g);
  below = below * absorb + scatter;
  // planar reflection
  vec4 rc = uReflectMatrix * vec4(vW, 1.0);
  vec2 ruv = rc.xy / rc.w + n.xz * 0.04;
  vec3 refl = texture2D(tReflect, ruv).rgb;
  vec3 H = normalize(uKeyDir + V);
  float spec = pow(max(dot(n, H), 0.0), 700.0) * 30.0 + pow(max(dot(n, H), 0.0), 90.0) * 0.6;
  float foamD = distance(vW.xz, uImpact.xz);
  float foam = (1.0 - smoothstep(0.0, 0.035, foamD)) * smoothstep(0.35, 0.75, wn(vW.xz * 300.0 + vec2(uTime * 0.6, -uTime)) + 0.3 * (1.0 - smoothstep(0.0, 0.03, foamD)));
  vec3 col = below * (1.0 - F) + refl * F + uKeyColor * spec + foam * vec3(0.7, 0.68, 0.62) * 0.6 + vec3(0.8, 0.85, 1.0) * uFlash * F * 2.0;
  // ripple faces tilted toward the lamplit lid catch its glow
  vec3 Rv = reflect(-V, n);
  col += uKeyColor * 0.35 * pow(smoothstep(0.55, 1.0, Rv.y), 3.0) * (1.0 - F * 0.5);
  // a bright wet line where the water meets the shore
  col += vec3(0.1, 0.1, 0.09) * (1.0 - smoothstep(0.0008, 0.0035, depth)) * (0.4 + 0.6 * F) * uAmbient;
  float edge = smoothstep(0.0, 0.002, depth);
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
uniform float uTime, uRippleA; uniform sampler2D tRefract, tBed, tRipple; uniform vec2 uResolution; uniform vec4 uBedBox, uRippleBox;
varying vec3 vW;
${commonGLSL}
void main(){
  vec2 bedUv = (vec2(vW.x, ${(HZ - 0.004).toFixed(4)}) - uBedBox.xy) / uBedBox.zw;
  float bed = texture2D(tBed, bedUv).r;
  vec4 rp = texture2D(tRipple, (vec2(vW.x, ${(HZ - 0.006).toFixed(4)}) - uRippleBox.xy) / uRippleBox.zw);
  float surf = ${WATER_LEVEL.toFixed(4)} + sin(vW.x * 400.0 + uTime * 3.0) * 0.0002 + mix(rp.g, rp.r, uRippleA) * 0.00025;
  if (vW.y > surf || vW.y < bed - 0.0005) discard;
  vec2 suv = gl_FragCoord.xy / uResolution;
  float wob = (wn(vec2(vW.x * 160.0, uTime * 0.7)) - 0.5) * 0.002;
  vec3 c = texture2D(tRefract, suv + vec2(wob, 0.0)).rgb;
  float d = surf - vW.y;
  c *= exp(-vec3(5.0, 2.6, 3.8) * (0.05 + d * 0.6));
  c += vec3(0.008, 0.016, 0.01);
  // bright meniscus where the surface meets the glass
  float men = exp(-(((surf - vW.y) / 0.0012) * ((surf - vW.y) / 0.0012)));
  c += vec3(0.16, 0.16, 0.14) * men;
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
      vertexShader: `attribute vec4 aFlow; varying vec2 vUv; varying vec4 vFlow; varying vec3 vW; varying vec3 vN;
void main(){ vUv = uv; vFlow = aFlow; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
uniform float uTime, uAmbient; uniform sampler2D tRefract; uniform vec2 uResolution; uniform vec3 uKeyDir, uKeyColor;
varying vec2 vUv; varying vec4 vFlow; varying vec3 vW; varying vec3 vN;
${commonGLSL}
void main(){
  // how many cycles of the finest noise fall in a pixel: beyond about half, it only
  // aliases into grain (seen at a grazing angle across a ledge), so it is faded out
  // (derivatives taken first, in uniform control flow)
  float fineAA = 1.0 - smoothstep(0.3, 0.8, max(fwidth(vUv.x * 40.0), fwidth(vUv.y * 60.0)));
  float midAA = 1.0 - smoothstep(0.3, 0.8, max(fwidth(vUv.x * 26.0), fwidth(vUv.y * 26.0)));
  if (vW.y < ${WATER_LEVEL.toFixed(4)} - 0.0008) discard;
  float steep = vFlow.x, strike = vFlow.z, air = vFlow.w;
  float speed = mix(0.12, 0.42, max(steep, strike * 0.6));
  float u = vUv.x, v = vUv.y;
  vec2 fp = vec2(u * 9.0, v * 26.0 - uTime * speed * 26.0);
  float streak = mix(0.5, wn(vec2(u * 26.0, v * 7.0 - uTime * speed * 7.0)), midAA) * 0.6 + wn(fp) * 0.4;
  float churn = mix(0.5, wn(vec2(u * 40.0, v * 60.0 - uTime * speed * 60.0)), fineAA);
  // where it strikes a ledge the water boils white: soft clots of bubbles tumbling away
  float boil = wn(vec2(u * 12.0 + sin(uTime * 3.1 + v * 40.0) * 0.5, v * 34.0 - uTime * 2.4)) * 0.6 + mix(0.5, wn(vec2(u * 27.0, v * 70.0 + uTime * 1.3)), midAA) * 0.4;
  float edge = smoothstep(0.0, 0.18, u + (boil - 0.5) * 0.14 * strike) * (1.0 - smoothstep(0.82, 1.0, u - (boil - 0.5) * 0.14 * strike));
  // falling water whitens with the air it draws in; across a ledge and over the
  // lip it runs clear and glassy (streaks there would only read as blotches)
  float aer = smoothstep(0.2, 0.9, air);
  float foam = smoothstep(0.42 - aer * 0.35, 0.82, streak * 0.7 + churn * 0.45) * mix(0.06, 1.0, smoothstep(0.25, 0.75, air));
  // (churned water is white all through, brighter in the clots: never clear between them)
  foam = max(foam * (1.0 - strike * 0.5), strike * (0.6 + 0.4 * smoothstep(0.2, 0.7, boil))) * edge;
  vec3 n = normalize(vN * (gl_FrontFacing ? 1.0 : -1.0));
  vec3 V = normalize(cameraPosition - vW);
  vec2 suv = gl_FragCoord.xy / uResolution;
  // a smooth wobble only: fine noise here would scramble what lies behind into grain
  float wob = wn(vec2(u * 5.0, v * 9.0 - uTime * speed * 9.0)) - 0.5;
  vec3 behind = texture2D(tRefract, suv + vec2(wob * 0.009, wob * 0.003)).rgb;
  float F = 0.02 + 0.98 * pow(1.0 - abs(dot(n, V)), 5.0);
  vec3 lit = uKeyColor * (0.35 + 0.65 * max(dot(n, uKeyDir), 0.0)) * (0.9 + 0.2 * strike) + vec3(0.12, 0.1, 0.08) * uAmbient;
  // bubbles in shadow between the clots read faintly blue-grey
  lit *= mix(1.0, 0.82 + 0.18 * boil, strike);
  vec3 col = mix(behind * vec3(0.86, 0.92, 0.9), lit * vec3(0.92, 0.93, 0.95), foam * 0.9);
  float spec = pow(max(dot(reflect(-uKeyDir, n), V), 0.0), 60.0) * (0.3 + streak);
  col += uKeyColor * spec * 0.6 + F * 0.15;
  // fade in at the source, out into the pool
  float a = edge * smoothstep(0.0, 0.04, vFlow.y) * (0.62 + 0.38 * foam);
  a = max(a, edge * strike * 0.92);
  a *= (1.0 - smoothstep(0.94, 1.0, vFlow.y)) * 0.6 + 0.4;
  gl_FragColor = vec4(col, a);
}`,
    });
  }

  stepRipples(renderer: THREE.WebGLRenderer, dt: number) {
    this.ripples.update(renderer, dt);
    this.uniforms.tRipple.value = this.ripples.texture;
    this.uniforms.uRippleA.value = this.ripples.alpha;
  }

  setPixelScale(s: number) {
    (this.dripPoints.material as THREE.ShaderMaterial).uniforms.uScale.value = s;
    (this.mist.material as THREE.ShaderMaterial).uniforms.uScale.value = s;
  }

  /** The view's distance per pixel (in the glass pass), so the mist fades softly into what it meets. */
  setDistance(tex: THREE.Texture | null) {
    const u = (this.mist.material as THREE.ShaderMaterial).uniforms;
    u.tDist.value = tex;
    u.uUseDist.value = tex ? 1 : 0;
  }

  setLight(level: number, keyColor: THREE.Color) {
    (this.dripPoints.material as THREE.ShaderMaterial).uniforms.uLight.value = 0.15 + 0.85 * level;
    this.uniforms.uKeyColor.value.copy(keyColor).multiplyScalar(level);
    this.uniforms.uAmbient.value = 0.15 + 0.85 * level;
    (this.spray.material as THREE.ShaderMaterial).uniforms.uLight.value = 0.1 + 0.9 * level;
  }

  /** A small disturbance (a lap of the tongue, a raindrop, a footfall). */
  addRipple(x: number, z: number, strength: number, time?: number) {
    void time;
    if (poolDistance(x, z) > 0.02) return;
    this.ripples.add(x, z, 0.0035, -strength * 1.6);
  }

  /** Something touched the water (for the fish). */
  onDisturb?: (x: number, z: number, strength: number) => void;

  /** A finger poked into the water: a dent, a rebound and a few flicked drops. */
  poke(x: number, z: number, strength = 1) {
    if (poolDistance(x, z) > 0.0) return false;
    this.onDisturb?.(x, z, 1.2 * strength);
    this.ripples.add(x, z, 0.006 + 0.003 * strength, -7 * strength);
    this.ripples.add(x, z, 0.0022, 4 * strength);
    this.flick(x, z, Math.round(5 + 6 * strength), 0.25 * strength);
    return true;
  }

  /** A finger drawn through the water leaves a wake. */
  stir(x: number, z: number, speed: number) {
    if (poolDistance(x, z) > 0.0) return;
    const u = Math.min(1, speed * 6);
    this.onDisturb?.(x, z, 0.4 + u);
    this.ripples.add(x, z, 0.0035, -1.4 - 2.2 * u);
    if (Math.random() < u * 0.5) this.flick(x, z, 1, 0.12 * u);
  }

  /** Flicks droplets up from the surface; they ripple where they land. */
  flick(x: number, z: number, n: number, speed: number) {
    for (const d of this.drips) {
      if (n <= 0) break;
      if (d.life > 0) continue;
      const a = Math.random() * Math.PI * 2, s = (0.2 + Math.random() * 0.8) * speed * 0.35;
      d.p.set(x, WATER_LEVEL + 0.002, z);
      d.v.set(Math.cos(a) * s, (0.4 + Math.random() * 0.6) * speed + 0.05, Math.sin(a) * s);
      d.life = 1;
      n--;
    }
  }

  update(dt: number, time: number, flow: number) {
    this.uniforms.uTime.value = time;
    // the falls keep the plunge pool trembling
    this.impactT -= dt;
    if (this.impactT < 0) {
      this.impactT = 0.03 + Math.random() * 0.05;
      const im = this.uniforms.uImpact.value;
      this.ripples.add(im.x + (Math.random() - 0.5) * 0.02, im.z + (Math.random() - 0.5) * 0.02, 0.004, -(0.8 + Math.random() * 1.2) * flow);
    }
    const dp = this.dripPoints.geometry.attributes.position as THREE.BufferAttribute;
    const dl = this.dripPoints.geometry.attributes.aLife as THREE.BufferAttribute;
    this.drips.forEach((d, i) => {
      if (d.life > 0) {
        d.v.y -= 2.4 * dt;
        d.p.addScaledVector(d.v, dt);
        if (d.p.y < WATER_LEVEL && d.v.y < 0) {
          d.life = 0;
          if (poolDistance(d.p.x, d.p.z) < 0) this.ripples.add(d.p.x, d.p.z, 0.0025, -0.9);
        }
      }
      dp.setXYZ(i, d.p.x, d.life > 0 ? d.p.y : -10, d.p.z);
      dl.setX(i, d.life);
    });
    dp.needsUpdate = dl.needsUpdate = true;
    const pos = this.spray.geometry.attributes.position as THREE.BufferAttribute;
    const life = this.spray.geometry.attributes.aLife as THREE.BufferAttribute;
    const impact = this.uniforms.uImpact.value;
    this.sprayData.forEach((d, i) => {
      d.life -= dt / d.max;
      if (d.life <= 0) {
        d.max = 0.6 + Math.random() * 1.4;
        d.life = 1;
        // most at the pool, the rest where each fall strikes a ledge
        const at = Math.random() < 0.55 || !this.landings.length ? impact : this.landings[Math.floor(Math.random() * this.landings.length)];
        d.floor = at === impact ? WATER_LEVEL : at.y;
        d.p.set(at.x + (Math.random() - 0.5) * 0.025, at.y + 0.002, at.z + (Math.random() - 0.5) * 0.02);
        const a = Math.random() * Math.PI * 2, s = 0.02 + Math.random() * 0.06 * flow;
        d.v.set(Math.cos(a) * s, 0.03 + Math.random() * 0.08 * flow, Math.sin(a) * s);
      }
      d.v.y -= dt * 0.12;
      d.v.multiplyScalar(1 - dt * 1.5);
      d.p.addScaledVector(d.v, dt);
      if (d.p.y < d.floor) d.p.y = d.floor;
      pos.setXYZ(i, d.p.x, d.p.y, d.p.z);
      life.setX(i, d.life);
    });
    pos.needsUpdate = true;
    life.needsUpdate = true;
    const mp = this.mist.geometry.attributes.position as THREE.BufferAttribute;
    const ma = this.mist.geometry.attributes.aMist as THREE.BufferAttribute;
    this.mistData.forEach((d, i) => {
      d.life -= dt / d.max;
      if (d.life <= 0) {
        d.max = 1.8 + Math.random() * 2.4;
        d.life = 1;
        // half over the plunge, the rest over the ledges the falls strike
        const pool = i % 2 === 0 || !this.landings.length;
        const at = pool ? impact : this.landings[(i >> 1) % this.landings.length];
        d.size = (pool ? 0.03 : 0.02) * (0.7 + Math.random() * 0.6);
        d.p.set(at.x + (Math.random() - 0.5) * 0.02, at.y + 0.004, at.z + 0.004 + (Math.random() - 0.5) * 0.016);
        d.v.set((Math.random() - 0.5) * 0.01, (0.006 + Math.random() * 0.012) * flow, 0.003 + Math.random() * 0.008);
      }
      d.p.addScaledVector(d.v, dt);
      mp.setXYZ(i, d.p.x, d.p.y, d.p.z);
      ma.setXY(i, d.life, d.size * (1.6 - 0.6 * d.life));
    });
    mp.needsUpdate = ma.needsUpdate = true;
  }

  /** Renders the mirrored view used by the pool surface. */
  renderReflection(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, width: number, height: number) {
    const w = Math.max(1, Math.floor(width / 2)), h = Math.max(1, Math.floor(height / 2));
    if (this.reflectRT.width !== w || this.reflectRT.height !== h) this.reflectRT.setSize(w, h);
    const m = this.mirrorCam;
    m.copy(camera);
    m.layers.set(0);
    m.layers.enable(2);
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

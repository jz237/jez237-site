import * as THREE from 'three';
import {TANK} from './Case';
import type {MossMap} from './Plants';
import type {Surface} from './Surface';
import {WATER_LEVEL, groundHeight} from './Ground';
import {foliageUniforms} from './Foliage';
import {WIND_GLSL} from './WindField';

/**
 * Cushion moss rendered as stacked shells: each layer keeps only the strands
 * tall enough to reach it, so the carpet has real depth, soft tips and
 * self-shadowed gaps.
 */
export class MossShells {
  readonly mesh: THREE.InstancedMesh;
  readonly uniforms = {uShells: {value: 14}, uHeight: {value: 0.0085}, tMoss: {value: null as THREE.Texture | null}, uPress: {value: new THREE.Vector4(0, 0, 0, 0)}};

  /**
   * `rock`: a ready-made base (patches draped over the rocks and the log) whose
   * `aCov` attribute says how much moss grows there, in place of the floor's map.
   */
  constructor(surface: Surface, moss: MossMap, shells = 14, rock?: THREE.BufferGeometry) {
    this.uniforms.uShells.value = shells;
    this.uniforms.tMoss.value = moss.texture;
    if (rock) this.uniforms.uHeight.value = 0.0065;
    const g = rock ?? MossShells.floorGeometry(moss);
    const ROCK = rock ? '#define ROCK_MOSS\n' : '';
    this.mesh = this.build(g, ROCK, shells);
    this.mesh.name = rock ? 'moss-rock' : 'moss-shells';
    // Layer 5: drawn by the main camera, skipped by the pool's mirror render.
    this.mesh.layers.set(5);
  }

  private static floorGeometry(moss: MossMap) {
    const NX = 260, NZ = 108;
    const x0 = -TANK.w / 2 + 0.003, z0 = -TANK.d / 2 + 0.003;
    const W = TANK.w - 0.006, D = TANK.d - 0.006;
    const pos: number[] = [], nrm: number[] = [], idx: number[] = [];
    const keep = new Uint8Array((NX + 1) * (NZ + 1));
    const n = new THREE.Vector3();
    for (let j = 0; j <= NZ; j++) for (let i = 0; i <= NX; i++) {
      const x = x0 + (i / NX) * W, z = z0 + (j / NZ) * D;
      // Shells follow the ground itself; rocks and the log simply cover them.
      const y = groundHeight(x, z);
      const e = 0.002;
      n.set(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
      pos.push(x, y, z);
      nrm.push(n.x, n.y, n.z);
      keep[j * (NX + 1) + i] = moss.at(x, z) > 0.04 && y > WATER_LEVEL + 0.004 && n.y > 0.6 ? 1 : 0;
    }
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      if (keep[a] | keep[b] | keep[c] | keep[d]) idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setIndex(idx);
    return g;
  }

  private build(g: THREE.BufferGeometry, ROCK: string, shells: number) {
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.9});
    const u = this.uniforms;
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, u, {uTime: foliageUniforms.uTime, tWind: foliageUniforms.tWind, uWindBox: foliageUniforms.uWindBox, uGust: foliageUniforms.uGust, uWet: foliageUniforms.uWet, uTank: {value: new THREE.Vector2(TANK.w, TANK.d)}});
      s.vertexShader = s.vertexShader
        .replace('#include <common>', `${ROCK}#include <common>
uniform float uShells, uHeight, uTime; uniform sampler2D tMoss; uniform vec2 uTank; uniform vec4 uPress;
varying float vShell; varying vec3 vMW; varying float vMossH; varying float vMoss; varying float vGust;
#ifdef ROCK_MOSS
attribute float aCov;
#endif
${WIND_GLSL}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>
{
  float sh = float(gl_InstanceID) / (uShells - 1.0);
  vShell = sh;
  #ifdef ROCK_MOSS
  float mm = aCov;
  #else
  float mm = texture2D(tMoss, position.xz / uTank + 0.5).r;
  #endif
  vMoss = mm;
  // cushions: the carpet swells into low mounds
  // cushions: separate mounds of different heights, not an even carpet
  float cush = 0.55 + 0.45 * sin(position.x * 61.0 + sin(position.z * 47.0) * 2.0) * sin(position.z * 53.0 + position.x * 9.0);
  float mound = wgn(position.xz * 38.0 + 3.0);
  mound = mound * mound * (3.0 - 2.0 * mound);
  float h = uHeight * smoothstep(0.03, 0.5, mm) * (0.35 + 0.5 * cush + 1.15 * mound * mound);
  // pressed flat where the lizard lies or walks
  float press = 1.0 - uPress.w * exp(-dot(position.xz - uPress.xy, position.xz - uPress.xy) / (uPress.z * uPress.z));
  h *= press;
  vMossH = h;
  // wind combs the carpet: travelling gust bands lay the tips over and show their paler sides
  vec2 w = windAt(position.xz, uTime);
  float sp = length(w);
  vec2 dir = sp > 1e-4 ? w / sp : vec2(1.0, 0.0);
  float wave = 0.5 + 0.5 * sin(dot(position.xz, dir) * 23.0 - uTime * (2.2 + min(sp * 4.0, 4.0) * 0.5) + wgn(position.xz * 8.0) * 5.0);
  wave = wave * wave * (3.0 - 2.0 * wave);
  float lay = (1.0 - exp(-sp * 2.8)) * (0.6 + 0.8 * wave);
  vGust = wave * (1.0 - exp(-sp * 2.2)) * (0.6 + 0.4 * windTex(position.xz).a);
  vec3 sway = vec3(sin(uTime * 1.3 + position.x * 40.0), 0.0, cos(uTime * 1.1 + position.z * 37.0)) * 0.0004 + vec3(dir.x, 0.0, dir.y) * lay * 0.0045;
  transformed += objectNormal * (sh * h * (1.0 - lay * 0.25) + 0.0004) + sway * sh * sh;
  vMW = transformed;
}`)
        .replace('#include <project_vertex>', `vec4 mvPosition = vec4(transformed, 1.0);
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`);
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `${ROCK}#include <common>
uniform float uWet;
uniform sampler2D tMoss; uniform vec2 uTank;
varying float vShell; varying vec3 vMW; varying float vMossH; varying float vMoss; varying float vGust;
float mh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 mh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float mn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(mh(i), mh(i+vec2(1,0)), f.x), mix(mh(i+vec2(0,1)), mh(i+vec2(1,1)), f.x), f.y); }`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
#ifdef ROCK_MOSS
float mossF = vMoss;
#else
float mossF = texture2D(tMoss, vMW.xz / uTank + 0.5).r;
#endif
// Edges come from the moss map per pixel (not per triangle), so they stay organic.
float edgeN = mh(floor(vMW.xz * 1900.0));
float coverage = smoothstep(0.05, 0.5, mossF);
if (mossF < 0.06 + 0.1 * edgeN || coverage < vShell * (0.85 + 0.3 * edgeN)) discard;
vec2 sp = vMW.xz * 1900.0;
vec2 ci = floor(sp), cf = fract(sp);
vec2 jit = mh2(ci);
float strandH = 0.3 + 0.7 * mh(ci + 3.7) * mh(ci + 1.3);
// strand thins toward its tip
float r = length(cf - (0.25 + 0.5 * jit)) / 0.5;
float keep = strandH - vShell;
if (vShell > 0.02 && (keep < 0.0 || r > 0.95 * (1.0 - vShell / strandH * 0.8))) discard;
float tipLight = smoothstep(0.0, 1.0, vShell);`)
        .replace('#include <color_fragment>', `#include <color_fragment>
{
  float hue = mn(vMW.xz * 60.0);
  // several species side by side: yellow-green sheet moss, deep green cushions, pale blue-grey Leucobryum
  float sp = mn(vMW.xz * 14.0 + 7.0);
  vec3 deep = vec3(0.012, 0.02, 0.006);
  vec3 midC = mix(vec3(0.05, 0.1, 0.018), vec3(0.09, 0.14, 0.02), hue);
  vec3 tip = mix(vec3(0.13, 0.22, 0.035), vec3(0.26, 0.28, 0.06), mn(vMW.xz * 220.0) * 0.7 + mn(vMW.xz * 31.0) * 0.3);
  tip = mix(tip, vec3(0.06, 0.13, 0.03), smoothstep(0.55, 0.7, sp));
  tip = mix(tip, vec3(0.16, 0.21, 0.14), smoothstep(0.78, 0.9, sp));
  midC = mix(midC, vec3(0.04, 0.08, 0.02), smoothstep(0.55, 0.7, sp));
  vec3 c = mix(deep, midC, smoothstep(0.0, 0.5, vShell));
  c = mix(c, tip, smoothstep(0.45, 1.0, vShell) * (0.6 + 0.4 * mh(ci)));
  c *= 0.8 + 0.4 * mh(ci + 9.1);
  c = mix(c, c * 1.5 + vec3(0.012, 0.014, 0.002), clamp(vGust, 0.0, 1.0) * vShell * vShell);
  diffuseColor.rgb = c * mix(1.0, 0.7, uWet);
}`)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(0.95, 0.55, uWet);`)
        .replace('#include <aomap_fragment>', `
{
  float ao = mix(0.25, 1.0, smoothstep(0.0, 0.9, vShell));
  reflectedLight.indirectDiffuse *= ao; reflectedLight.indirectSpecular *= ao; reflectedLight.directDiffuse *= mix(0.45, 1.0, smoothstep(0.0, 0.8, vShell));
}
#include <aomap_fragment>`);
    };
    m.customProgramCacheKey = () => ROCK ? 'moss-shells-rock-v1' : 'moss-shells-v3';
    const mesh = new THREE.InstancedMesh(g, m, shells);
    const I = new THREE.Matrix4();
    for (let i = 0; i < shells; i++) mesh.setMatrixAt(i, I);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.frustumCulled = false;
    return mesh;
  }

  /**
   * Cushions of moss on the rocks and the log: small patches draped over every
   * ledge and shoulder that faces up enough to hold soil, thick in the middle
   * and thinning to nothing at their ragged edges.
   */
  static rockGeometry(hard: THREE.Mesh[], log: THREE.Mesh, rnd: () => number, count = 150) {
    const ray = new THREE.Raycaster();
    (ray as unknown as {firstHitOnly: boolean}).firstHitOnly = true;
    const all = [...hard, log];
    const down = new THREE.Vector3(0, -1, 0);
    const hitAt = (x: number, z: number, y = 0.8) => {
      ray.set(new THREE.Vector3(x, y, z), down);
      const h = ray.intersectObjects(all, false)[0];
      if (!h || !h.face) return null;
      return {p: h.point, n: h.face.normal.clone().transformDirection(h.object.matrixWorld), log: h.object === log};
    };
    const pos: number[] = [], nrm: number[] = [], cov: number[] = [], idx: number[] = [];
    const SEG = 14, RINGS = 3;
    let made = 0;
    for (let i = 0; i < count * 60 && made < count; i++) {
      const x = -0.56 + rnd() * 1.12, z = -0.23 + rnd() * 0.36;
      const c = hitAt(x, z);
      if (!c || c.n.y < 0.5 || c.p.y < 0.13) continue;
      if (c.log && rnd() < 0.7) continue; // the log is mostly bare wood
      if (Math.abs(x - 0.06) < 0.06 && z > -0.14) continue; // not in the falls
      const R = 0.01 + rnd() * rnd() * 0.022;
      const base = pos.length / 3;
      // a centre and rings of points, each dropped onto the stone below it
      const pts: {p: THREE.Vector3; n: THREE.Vector3; k: number}[] = [{p: c.p, n: c.n, k: 1}];
      let misses = 0;
      for (let r = 1; r <= RINGS; r++) for (let a = 0; a < SEG; a++) {
        const ang = (a / SEG) * Math.PI * 2 + r * 0.3;
        const rr = R * (r / RINGS) * (0.75 + 0.5 * rnd());
        const px = x + Math.cos(ang) * rr, pz = z + Math.sin(ang) * rr;
        const h = hitAt(px, pz, c.p.y + 0.03);
        const k = r === RINGS ? 0 : 1 - (r / RINGS) * (0.5 + 0.4 * rnd());
        if (!h || Math.abs(h.p.y - c.p.y) > R * 2) {
          // over an edge: the patch thins out there, lying where the ledge would be
          misses++;
          pts.push({p: new THREE.Vector3(px, c.p.y - rr * 0.3, pz), n: c.n, k: 0});
        } else pts.push({p: h.p, n: h.n, k});
      }
      if (misses > SEG * 1.5) continue;
      for (const q of pts) {
        pos.push(q.p.x + q.n.x * 0.0006, q.p.y + q.n.y * 0.0006, q.p.z + q.n.z * 0.0006);
        nrm.push(q.n.x, q.n.y, q.n.z);
        cov.push(q.k);
      }
      for (let a = 0; a < SEG; a++) idx.push(base, base + 1 + ((a + 1) % SEG), base + 1 + a);
      for (let r = 1; r < RINGS; r++) for (let a = 0; a < SEG; a++) {
        const i0 = base + 1 + (r - 1) * SEG + a, i1 = base + 1 + (r - 1) * SEG + ((a + 1) % SEG);
        const j0 = i0 + SEG, j1 = i1 + SEG;
        idx.push(i0, i1, j0, i1, j1, j0);
      }
      made++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setAttribute('aCov', new THREE.Float32BufferAttribute(cov, 1));
    g.setIndex(idx);
    return g;
  }

  /** Flattens the carpet under a resting body (x, z, radius, amount). */
  press(x: number, z: number, r: number, amount: number) {this.uniforms.uPress.value.set(x, z, r, amount);}
}

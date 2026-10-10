import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {woodTextures, brassRoughness} from './Textures';
import {Condensation} from './Condensation';

export const TANK = {w: 1.2, d: 0.5, h: 0.66};
const HX = TANK.w / 2, HZ = TANK.d / 2;

export interface Pane {
  mesh: THREE.Mesh;
  fog: Condensation;
  /** world → pane uv */
  toUv: (p: THREE.Vector3) => THREE.Vector2 | null;
  normal: THREE.Vector3;
}

const dropletGLSL = /* glsl */ `
vec2 dHash2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float dHash1(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
// Droplet coverage (x), lens normal (yz), in pane metres.
vec3 dropLayer(vec2 p, float scale, float f, float minF, float rMin, float rMax, float seed){
  vec2 g = p * scale + seed;
  vec2 i = floor(g), fr = fract(g);
  vec3 best = vec3(0.0);
  float bestH = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 n = vec2(float(x), float(y));
    vec2 h = dHash2(i + n);
    float h3 = dHash1(i + n + 7.1);
    float exist = step(h3, smoothstep(minF, minF + 0.35, f));
    vec2 c = n + 0.15 + 0.7 * h;
    float r = mix(rMin, rMax, h.x * h.y) * mix(0.55, 1.0, smoothstep(minF, 1.0, f));
    vec2 d = fr - c;
    d.y *= 0.92;
    float dist = length(d) / r;
    float cov = (1.0 - smoothstep(0.82, 1.0, dist)) * exist;
    float hh = sqrt(max(0.0, 1.0 - dist * dist));
    if (cov > best.x || (cov > 0.0 && hh > bestH)) { best = vec3(cov, d / r); bestH = hh; }
  }
  return best;
}
`;

function glassMaterial(fog: THREE.Texture, paneSize: THREE.Vector2, shared: GlassShared) {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x000000, metalness: 0, roughness: 0.035, specularIntensity: 1, ior: 1.52,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.tFog = {value: fog};
    shader.uniforms.uPaneSize = {value: paneSize};
    shader.uniforms.tRefract = shared.tRefract;
    shader.uniforms.uResolution = shared.uResolution;
    shader.uniforms.uHaze = shared.uHaze;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vPaneUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaneUv = uv;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform sampler2D tFog; uniform sampler2D tRefract; uniform vec2 uPaneSize; uniform vec2 uResolution; uniform vec3 uHaze;
varying vec2 vPaneUv;
${dropletGLSL}
float gNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(dHash1(i), dHash1(i+vec2(1,0)), f.x), mix(dHash1(i+vec2(0,1)), dHash1(i+vec2(1,1)), f.x), f.y); }
`)
      .replace('#include <roughnessmap_fragment>', `
vec2 pm = vPaneUv * uPaneSize;
float fogF = texture2D(tFog, vPaneUv).r;
vec3 dBig = dropLayer(pm, 210.0, fogF, 0.42, 0.18, 0.46, 3.7);
vec3 dSmall = dropLayer(pm, 760.0, fogF, 0.16, 0.16, 0.42, 1.3);
float dropCov = max(dBig.x, dSmall.x * (1.0 - dBig.x));
vec2 dropN = dBig.x > 0.0 ? dBig.yz : dSmall.yz;
float smudge = smoothstep(0.55, 0.9, gNoise(pm * 9.0) * 0.6 + gNoise(pm * 31.0) * 0.4);
float roughnessFactor = mix(0.03, 0.16, smudge);
`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition);
  vec2 st0 = dFdx(vPaneUv), st1 = dFdy(vPaneUv);
  vec3 q1perp = cross(q1, normal), q0perp = cross(normal, q0);
  vec3 T = q1perp * st0.x + q0perp * st1.x;
  vec3 B = q1perp * st0.y + q0perp * st1.y;
  float det = max(dot(T, T), dot(B, B));
  float sc = det == 0.0 ? 0.0 : inversesqrt(det);
  vec2 dn = dropN * dropCov;
  normal = normalize(normal + (T * dn.x + B * dn.y) * sc * 1.6);
}
`)
      .replace('#include <opaque_fragment>', `
vec2 suv = gl_FragCoord.xy / uResolution;
float cosT = clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0);
float F = 0.04 + 0.96 * pow(1.0 - cosT, 5.0);
float hazeAmt = smoothstep(0.1, 0.8, fogF) * (1.0 - dropCov) * 0.88;
vec3 bgFog = textureLod(tRefract, suv, 4.2).rgb;
vec3 bgDrop = textureLod(tRefract, suv - dropN * dropCov * 0.018, 0.6).rgb;
float rim = smoothstep(0.55, 0.98, length(dropN)) * dropCov;
vec3 dropCol = bgDrop * (1.0 - rim * 0.65);
vec3 hazeCol = bgFog * 0.8 + uHaze;
float cov = clamp(hazeAmt + dropCov * 0.92, 0.0, 1.0);
vec3 X = (hazeAmt * hazeCol + dropCov * 0.92 * dropCol) / max(cov, 1e-4);
float T = (1.0 - F) * 0.965;
// keep droplet glints bright but below the bloom's star threshold
vec3 rgb = min(outgoingLight * (1.0 + dropCov * 0.25), vec3(mix(6.0, 1.2, dropCov))) + cov * X * T;
float a = 1.0 - T * (1.0 - cov);
gl_FragColor = vec4(rgb, a);
`);
  };
  material.customProgramCacheKey = () => 'terrarium-glass-v1';
  return material;
}

interface GlassShared {
  tRefract: {value: THREE.Texture | null};
  uResolution: {value: THREE.Vector2};
  uHaze: {value: THREE.Color};
}

export class Case {
  readonly group = new THREE.Group();
  /** Glass panes live on layer 1 and are drawn after the scene, with refraction access. */
  readonly glassGroup = new THREE.Group();
  readonly panes: Pane[] = [];
  readonly shared: GlassShared = {tRefract: {value: null}, uResolution: {value: new THREE.Vector2(1, 1)}, uHaze: {value: new THREE.Color(0.02, 0.016, 0.012)}};
  readonly regulatorGlow: THREE.MeshStandardMaterial;
  readonly plaque: {canvas: HTMLCanvasElement; texture: THREE.CanvasTexture};

  constructor() {
    const g = this.group;
    // Walnut plinth on four brass ball feet.
    const wood = woodTextures(1024, 13, [58, 33, 19]);
    wood.color.repeat.set(2, 0.6);
    wood.rough.repeat.copy(wood.color.repeat);
    const walnut = new THREE.MeshPhysicalMaterial({map: wood.color, roughnessMap: wood.rough, roughness: 0.5, clearcoat: 0.7, clearcoatRoughness: 0.12});
    const baseTop = new THREE.Mesh(new RoundedBoxGeometry(HX * 2 + 0.05, 0.034, HZ * 2 + 0.05, 3, 0.006), walnut);
    baseTop.position.y = -0.017;
    const baseLow = new THREE.Mesh(new RoundedBoxGeometry(HX * 2 + 0.075, 0.03, HZ * 2 + 0.075, 3, 0.008), walnut);
    baseLow.position.y = -0.046;
    g.add(baseTop, baseLow);
    const brassR = brassRoughness();
    const brass = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.86, 0.62, 0.33), metalness: 1, roughness: 0.3, roughnessMap: brassR, clearcoat: 0.25, clearcoatRoughness: 0.3});
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 24, 16), brass);
      foot.position.set(sx * (HX + 0.02), -0.066, sz * (HZ + 0.02));
      g.add(foot);
    }
    // Brass trim on the plinth.
    const trimF = new THREE.Mesh(new RoundedBoxGeometry(HX * 2 + 0.058, 0.004, HZ * 2 + 0.058, 2, 0.0015), brass);
    trimF.position.y = -0.032;
    g.add(trimF);

    // Frame: corner posts, top and bottom rails, finials.
    const post = new RoundedBoxGeometry(0.017, TANK.h + 0.012, 0.017, 2, 0.003);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const p = new THREE.Mesh(post, brass);
      p.position.set(sx * HX, TANK.h / 2, sz * HZ);
      g.add(p);
      const fin = new THREE.Mesh(new THREE.SphereGeometry(0.0115, 24, 16), brass);
      fin.position.set(sx * HX, TANK.h + 0.017, sz * HZ);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.007, 0.01, 16), brass);
      neck.position.set(sx * HX, TANK.h + 0.008, sz * HZ);
      g.add(fin, neck);
    }
    for (const y of [0.011, TANK.h - 0.008]) {
      const hgt = y < 0.1 ? 0.024 : 0.018;
      for (const sz of [-1, 1]) {
        const r = new THREE.Mesh(new RoundedBoxGeometry(TANK.w, hgt, 0.012, 2, 0.003), brass);
        r.position.set(0, y, sz * HZ);
        g.add(r);
      }
      for (const sx of [-1, 1]) {
        const r = new THREE.Mesh(new RoundedBoxGeometry(0.012, hgt, TANK.d, 2, 0.003), brass);
        r.position.set(sx * HX, y, 0);
        g.add(r);
      }
    }
    // Lid regulator: a small brass housing with a warm lens (the Weatherglass core).
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.056, 0.016, 48), brass);
    housing.position.set(0, TANK.h + 0.008, 0);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.03, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), brass);
    cap.position.set(0, TANK.h + 0.016, 0);
    cap.scale.y = 0.55;
    this.regulatorGlow = new THREE.MeshStandardMaterial({color: 0x000000, emissive: new THREE.Color(1, 0.62, 0.28), emissiveIntensity: 2.5});
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.004, 40), this.regulatorGlow);
    lens.position.set(0, TANK.h - 0.002, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.003, 12, 48), brass);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, TANK.h - 0.003, 0);
    g.add(housing, cap, lens, ring);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.0025, 8, 6), brass);
      rivet.position.set(Math.cos(a) * 0.044, TANK.h + 0.0165, Math.sin(a) * 0.044);
      g.add(rivet);
    }
    // Plaque with a live readout.
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 96;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    this.plaque = {canvas, texture};
    const plaqueMat = new THREE.MeshPhysicalMaterial({map: texture, metalness: 0.85, roughness: 0.35, emissive: new THREE.Color(1, 1, 1), emissiveMap: texture, emissiveIntensity: 0.0});
    const plaque = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.026, 0.003, 2, 0.001), [brass, brass, brass, brass, plaqueMat, brass]);
    plaque.position.set(0, -0.019, HZ + 0.0265);
    g.add(plaque);
    this.drawPlaque(24, 68);

    g.traverse((o) => {if ((o as THREE.Mesh).isMesh) {o.castShadow = true; o.receiveShadow = true;}});
    lens.castShadow = false;

    // Glass panes with condensation.
    const panes: [string, number, number, THREE.Vector3, THREE.Euler, 'front' | 'side' | 'back' | 'top'][] = [
      ['front', TANK.w, TANK.h, new THREE.Vector3(0, TANK.h / 2, HZ), new THREE.Euler(0, 0, 0), 'front'],
      ['back', TANK.w, TANK.h, new THREE.Vector3(0, TANK.h / 2, -HZ), new THREE.Euler(0, Math.PI, 0), 'back'],
      ['left', TANK.d, TANK.h, new THREE.Vector3(-HX, TANK.h / 2, 0), new THREE.Euler(0, -Math.PI / 2, 0), 'side'],
      ['right', TANK.d, TANK.h, new THREE.Vector3(HX, TANK.h / 2, 0), new THREE.Euler(0, Math.PI / 2, 0), 'side'],
      ['top', TANK.w, TANK.d, new THREE.Vector3(0, TANK.h, 0), new THREE.Euler(-Math.PI / 2, 0, 0), 'top'],
    ];
    panes.forEach(([name, w, h, pos, rot, kind], i) => {
      const size = new THREE.Vector2(w, h);
      const fog = new Condensation(Math.round(w * 220), Math.round(h * 220), size, i + 1, kind);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMaterial(fog.texture, size, this.shared));
      mesh.name = `glass-${name}`;
      mesh.position.copy(pos);
      mesh.rotation.copy(rot);
      mesh.renderOrder = 10;
      mesh.layers.set(1);
      mesh.updateMatrixWorld();
      this.glassGroup.add(mesh);
      const inv = mesh.matrixWorld.clone().invert();
      const normal = new THREE.Vector3(0, 0, 1).applyEuler(rot);
      this.panes.push({
        mesh, fog, normal,
        toUv: (p) => {
          const l = p.clone().applyMatrix4(inv);
          if (Math.abs(l.z) > 0.03 || Math.abs(l.x) > w / 2 || Math.abs(l.y) > h / 2) return null;
          return new THREE.Vector2(l.x / w + 0.5, l.y / h + 0.5);
        },
      });
    });
  }

  drawPlaque(tempC: number, humidity: number) {
    const {canvas, texture} = this.plaque;
    const c = canvas.getContext('2d')!;
    const grd = c.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, '#6b4a22'); grd.addColorStop(1, '#3b2610');
    c.fillStyle = grd; c.fillRect(0, 0, canvas.width, canvas.height);
    c.strokeStyle = 'rgba(255,220,150,.55)'; c.lineWidth = 3; c.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    c.fillStyle = '#f3d79c';
    c.font = '500 30px Georgia, "Times New Roman", serif';
    c.textBaseline = 'middle';
    c.fillText('WEATHERGLASS', 26, 48);
    c.fillStyle = '#ffb44a';
    c.shadowColor = 'rgba(255,150,40,.9)'; c.shadowBlur = 10;
    c.font = '600 28px ui-monospace, Menlo, Consolas, monospace';
    c.fillText(`${tempC.toFixed(0)}°  ${humidity.toFixed(0)}%`, 300, 49);
    c.shadowBlur = 0;
    texture.needsUpdate = true;
  }
}

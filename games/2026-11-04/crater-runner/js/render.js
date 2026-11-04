// Crater Runner renderer: a side-on cinematic camera over a real 3D lunar surface. The ground is built
// in chunks from the same height function the simulation uses on the track (z = 0), widened into
// rolling terrain with decorative craters; gameplay craters are pressed into it in 3D as they appear.
// Long low sun shadows, parallax mountain ranges, the Earth in a black sky, starfield, five looks.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=2';
import { makeTextures } from './textures.js?v=2';
import * as MD from './models.js?v=2';
import { FX, CALM } from './fx.js?v=2';
import { baseH, craterProfile } from './sim.js?v=2';
import { F, THREATS } from './config.js?v=2';

export { CALM };

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), shadow: 4096, msaa: true, bloomLevels: 5, texSize: 1024, earthSize: 1024, groundDx: 0.25, dust: 2400, sparks: 1400, debris: 220, flashLights: 3, ruins: 1, rocksPerChunk: 22 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), shadow: 2048, msaa: true, bloomLevels: 4, texSize: 512, earthSize: 512, groundDx: 0.33, dust: 1500, sparks: 900, debris: 140, flashLights: 2, ruins: 1, rocksPerChunk: 14 },
    low: { name: 'low', dpr: 1, shadow: 1024, msaa: false, bloomLevels: 3, texSize: 512, earthSize: 512, groundDx: 0.5, dust: 800, sparks: 500, debris: 80, flashLights: 1, ruins: 0.6, rocksPerChunk: 8 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ sector looks
export const LOOKS = [
  { // grey highlands: bright, warm low sun, Earth high
    ground: 0xa29f99, rockTint: 0xb9b5ae, sun: 0xfff1de, sunI: 3.3, sunDir: [-0.62, 0.2, -0.42], hemi: 0.5, earthI: 0.14, earthDir: [0.5, 0.13, -0.86],
    exposure: 1.0, dust: 0x9a968f, dustLight: 1.55, ice: 0, ruins: 0, night: false, ridge: [0x8d8a84, 0x77746f, 0x5f5d59], rough: 1, grade: [1.0, 0.99, 0.97] },
  { // dark maria: basalt plains, cooler, Earth to the left
    ground: 0x5e5c59, rockTint: 0x6a6763, sun: 0xffe9d0, sunI: 3.6, sunDir: [-0.7, 0.26, -0.3], hemi: 0.45, earthI: 0.16, earthDir: [-0.38, 0.14, -0.91],
    exposure: 1.12, dust: 0x6f6c68, dustLight: 1.5, ice: 0, ruins: 0, night: false, ridge: [0x6c6965, 0x5b5855, 0x4a4845], rough: 0.8, grade: [0.98, 0.99, 1.02] },
  { // ice crater rim: polar, grazing sun, frost in the shade
    ground: 0x9aa6b3, rockTint: 0xb4c0cc, sun: 0xeef4ff, sunI: 3.0, sunDir: [-0.85, 0.11, -0.22], hemi: 0.55, earthI: 0.18, earthDir: [0.52, 0.1, -0.85],
    exposure: 1.02, dust: 0xb8c0c8, dustLight: 1.6, ice: 1, ruins: 0, night: false, ridge: [0x9ea6ae, 0x8a929b, 0x737a82], rough: 1.2, grade: [0.95, 0.99, 1.06] },
  { // mining base ruins: dusty brown-grey, rusted structures
    ground: 0x8e867c, rockTint: 0x948a7e, sun: 0xffe2c0, sunI: 3.4, sunDir: [-0.58, 0.24, -0.5], hemi: 0.5, earthI: 0.15, earthDir: [0.5, 0.13, -0.86],
    exposure: 1.02, dust: 0x8a8076, dustLight: 1.5, ice: 0, ruins: 1, night: false, ridge: [0x857d74, 0x716a62, 0x5d5751], rough: 1, grade: [1.03, 0.99, 0.95] },
  { // far-side night run: no sun, blue Earthshine, headlights
    ground: 0x8d9097, rockTint: 0x8d9198, sun: 0x9fb6ff, sunI: 1.25, sunDir: [0.3, 0.32, -0.9], hemi: 0.35, earthI: 0, earthDir: [0.45, 0.11, -0.89],
    exposure: 1.55, dust: 0x7c8090, dustLight: 0.9, ice: 0, ruins: 0, night: true, ridge: [0x4e5260, 0x3d404c, 0x2e313a], rough: 1, grade: [0.92, 0.98, 1.1] },
];

// ------------------------------------------------------------------ small deterministic noise for scenery
function h2(x, y) { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vn(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm2(x, y, o = 4) { let s = 0, a = 0.5, t = 0; for (let i = 0; i < o; i++) { s += a * vn(x, y); t += a; x = x * 2.03 + 17.1; y = y * 2.03 + 5.3; a *= 0.5; } return s / t; }

const CH = 32;            // chunk length along x
const DECO = 13;          // decorative crater grid cell
const ZROWS = (() => {
  const z = [];
  for (let v = 34; v > 13; v -= 0.9) z.push(v);
  for (let v = 13; v > -7; v -= 0.3) z.push(v);
  let v = -7, s = 0.35;
  while (v > -120) { z.push(v); v -= s; s *= 1.07; }
  z.push(-120);
  return z;
})();

export class Renderer {
  constructor(canvas, q) {
    this.q = q;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    this.r = r;
    this.scale = 1;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.3, 4200);
    this.post = new Post(r, q);
    this.T = makeTextures(r, q);
    this.env = this.makeEnv();
    this.M = MD.materials(this.T, this.env);
    this.k = 0;
    this.lookI = -1;
    this.look = LOOKS[0];
    this.time = 0;
    this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.camX = 0; this.camY = 2; this.camVY = 0; this.airK = 0;
    this.focusAhead = 6.5;
    this.lights();
    this.sky();
    this.groundMat = this.makeGroundMat();
    this.chunks = new Map();
    this.ridges = this.makeRidges();
    this.fx = new FX(this.scene, this.T, q, (x, z) => this.heightAt(x, z));
    this.views = { rover: new Map(), rocks: new Map(), mines: new Map(), tanks: new Map(), shells: new Map(), flyers: new Map(), bombs: new Map(), drones: new Map() };
    this.bossView = null;
    this.craterSeen = new Map();
    this.W = null;
    this.tracers = this.makeTracers();
    this.markers = this.makeMarkers();
    this.decoRocks = new Map();
    this.ruins = new Map();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
  }

  // ---------------------------------------------------------------- environment, lights, sky
  makeEnv() {
    const pm = new THREE.PMREMGenerator(this.r);
    const s = new THREE.Scene();
    const geo = new THREE.SphereGeometry(10, 32, 16);
    const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: {}, vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ vec3 d = normalize(vP); float g = smoothstep(0.05, -0.25, d.y); vec3 c = mix(vec3(0.004), vec3(0.20,0.195,0.19), g); float sun = pow(max(0.0, dot(d, normalize(vec3(-0.62,0.2,-0.42)))), 400.0) * 60.0; gl_FragColor = vec4(c + sun, 1.0); }' });
    s.add(new THREE.Mesh(geo, mat));
    const rt = pm.fromScene(s, 0.02);
    pm.dispose();
    return rt.texture;
  }
  lights() {
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(this.q.shadow, this.q.shadow);
    const c = sun.shadow.camera;
    c.left = -34; c.right = 40; c.top = 22; c.bottom = -22; c.near = 1; c.far = 220;
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.035;
    this.scene.add(sun, sun.target);
    this.sun = sun;
    this.hemi = new THREE.HemisphereLight(0x0b0d14, 0x3a3734, 0.5);
    this.scene.add(this.hemi);
    this.earthLight = new THREE.DirectionalLight(0x8fb0e8, 0.15);
    this.scene.add(this.earthLight, this.earthLight.target);
  }
  sky() {
    // stars: points on a large sphere that follows the camera, a few bright ones bloom
    const N = 7000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    let s = 7;
    const rr = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < N; i++) {
      let x = rr() * 2 - 1, y = rr() * 2 - 1, z = rr() * 2 - 1;
      // a faint galactic band
      if (i % 3 === 0) { y = (rr() - 0.5) * 0.22; x = rr() * 2 - 1; z = -Math.abs(rr() * 2 - 1); }
      const l = Math.hypot(x, y, z) || 1;
      pos[i * 3] = (x / l) * 3000; pos[i * 3 + 1] = (y / l) * 3000 + 300; pos[i * 3 + 2] = (z / l) * 3000;
      const b = Math.pow(rr(), 5) * 5 + 0.25, t = rr();
      col[i * 3] = b * (t > 0.8 ? 1 : t > 0.6 ? 0.8 : 0.95); col[i * 3 + 1] = b * (t > 0.6 && t < 0.8 ? 0.88 : 0.95); col[i * 3 + 2] = b * (t > 0.8 ? 0.7 : 1.05);
      size[i] = 1.2 + Math.pow(rr(), 6) * 3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    const m = new THREE.ShaderMaterial({ depthWrite: false, uniforms: { uPx: { value: 1 } },
      vertexShader: 'attribute float aSize; attribute vec3 color; varying vec3 vC; uniform float uPx; void main(){ vC = color; gl_PointSize = aSize * uPx; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position.z = gl_Position.w * 0.99999; }',
      fragmentShader: 'varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC * a, 1.0); }',
      blending: THREE.AdditiveBlending, transparent: true });
    this.stars = new THREE.Points(g, m);
    this.stars.frustumCulled = false;
    this.stars.renderOrder = -10;
    this.scene.add(this.stars);
    // the Earth: day map, clouds, atmosphere rim, lit by the real sun direction (phase)
    const em = new THREE.ShaderMaterial({ uniforms: { uMap: { value: this.T.earth }, uClouds: { value: this.T.clouds }, uSun: { value: new THREE.Vector3(-1, 0.2, -0.3) }, uT: { value: 0 }, uI: { value: 1 } },
      vertexShader: 'varying vec3 vN; varying vec2 vUv; varying vec3 vV; void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; gl_Position.z = gl_Position.w * 0.99998; }',
      fragmentShader: `uniform sampler2D uMap; uniform sampler2D uClouds; uniform vec3 uSun; uniform float uT; uniform float uI; varying vec3 vN; varying vec2 vUv; varying vec3 vV;
        void main(){
          vec3 n = normalize(vN); float l = dot(n, normalize(uSun));
          float day = smoothstep(-0.08, 0.25, l);
          vec3 c = texture2D(uMap, vUv + vec2(uT * 0.004, 0.0)).rgb;
          c = pow(c, vec3(2.2));
          float cl = texture2D(uClouds, vUv + vec2(uT * 0.0065, 0.0)).a;
          c = mix(c, vec3(0.9), cl * 0.85);
          vec3 col = c * day * 2.6;
          float rim = pow(1.0 - max(0.0, dot(n, vV)), 3.0);
          col += vec3(0.25, 0.5, 1.0) * rim * (0.25 + day) * 1.6;
          // ocean glint
          vec3 h = normalize(normalize(uSun) + vV);
          col += vec3(1.0, 0.95, 0.85) * pow(max(0.0, dot(n, h)), 60.0) * (1.0 - cl) * day * 1.5;
          gl_FragColor = vec4(col * uI, 1.0);
        }` });
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(70, 48, 32), em);
    this.earth.frustumCulled = false;
    this.earth.renderOrder = -9;
    this.scene.add(this.earth);
    // sun glare (only visible when the sun is in view)
    this.sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: 0xfff6e8, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    this.sunGlow.scale.set(320, 320, 1);
    this.sunGlow.renderOrder = -8;
    this.scene.add(this.sunGlow);
  }

  // ---------------------------------------------------------------- ground
  makeGroundMat() {
    const m = new THREE.MeshStandardMaterial({ map: this.T.regolith, normalMap: this.T.regolithN, normalScale: new THREE.Vector2(1.1, 1.1), roughness: 1, metalness: 0, vertexColors: true, envMap: this.env, envMapIntensity: 0.15 });
    // break up tiling: blend a second, much larger scale of the same textures
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <map_fragment>', `#ifdef USE_MAP
          vec4 texelColor = texture2D(map, vMapUv) * 0.6 + texture2D(map, vMapUv * 0.137 + 0.31) * 0.4;
          diffuseColor *= texelColor * 1.08;
        #endif`)
        .replace('#include <normal_fragment_maps>', `#ifdef USE_NORMALMAP_TANGENTSPACE
          vec3 mapN = (texture2D(normalMap, vNormalMapUv).xyz * 2.0 - 1.0) * 0.65 + (texture2D(normalMap, vNormalMapUv * 0.137 + 0.31).xyz * 2.0 - 1.0) * 0.5;
          mapN.xy *= normalScale;
          normal = normalize(tbn * mapN);
        #else
          #include <normal_fragment_maps>
        #endif`);
    };
    return m;
  }

  // full height at any (x, z): the track profile near z = 0, rolling terrain further out, craters everywhere
  heightAt(x, z) {
    const k = this.k;
    const band = Math.exp(-(z * z) / 30);
    const far = baseH(x, k) * 0.5 + (fbm2(x * 0.025 + k * 7, z * 0.03, 4) - 0.5) * (2 + Math.max(0, -z - 8) * 0.09) + (fbm2(x * 0.18, z * 0.18, 2) - 0.5) * 0.35;
    let h = baseH(x, k) * band + far * (1 - band) + this.deco(x, z);
    const W = this.W;
    if (W) for (const c of W.craters) {
      const dx = x - c.x;
      if (Math.abs(dx) > c.r * 2.2 || Math.abs(z) > c.r * 2.2) continue;
      const d = Math.hypot(dx, z);
      if (d < c.r * 2.2) {
        // on the track the bowl matches the sim exactly; it widens into a round crater away from it
        const exact = craterProfile(c, Math.abs(dx));
        const round = craterProfile(c, d);
        h += (band > 0.95 ? exact : round + (exact - round) * band * band) * c.grow;
      }
    }
    return h;
  }
  deco(x, z) {
    let h = 0;
    const ci = Math.floor(x / DECO), cj = Math.floor(z / DECO);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      const i = ci + a, j = cj + b;
      const r0 = h2(i * 7 + this.k * 131, j * 13);
      if (r0 > 0.55) continue;
      const r = 1.2 + Math.pow(h2(i, j * 3 + 5), 2.4) * 7.5;
      const cx = (i + 0.2 + h2(i + 9, j) * 0.6) * DECO, cz = (j + 0.2 + h2(i, j + 11) * 0.6) * DECO;
      if (Math.abs(cz) - r * 2.2 < 3.5 && cz > -40) continue; // keep the track clear
      const d = Math.hypot(x - cx, z - cz);
      if (d > r * 2.2) continue;
      h += craterProfile({ r, d: 0.18 * r + 0.2, rim: 0.06 * r + 0.05 }, d);
    }
    return h;
  }
  colorAt(x, z, h, base, out) {
    const L = this.look;
    // crater floors darker, fresh rims and ejecta brighter, broad tone variation, frost in polar shade
    const n = fbm2(x * 0.05, z * 0.05, 3);
    let k = 0.82 + (n - 0.5) * 0.45;
    const rel = h - base;
    k *= 1 + Math.max(-0.25, Math.min(0.25, rel * 0.25));
    const ray = fbm2(x * 0.4, z * 0.4, 2);
    k *= 0.92 + ray * 0.16;
    if (z < -30) k *= 0.9;
    out.setHex(L.ground);
    out.multiplyScalar(k);
    if (L.ice) {
      const frost = Math.max(0, Math.min(1, (fbm2(x * 0.07 + 3, z * 0.07, 3) - 0.38) * 3.6 - rel * 0.9));
      out.lerp(_ice, frost * 0.92);
    }
  }

  buildChunk(ci) {
    const dx = this.q.groundDx, nx = Math.round(CH / dx) + 1, nz = ZROWS.length;
    const pos = new Float32Array(nx * nz * 3), nor = new Float32Array(nx * nz * 3), col = new Float32Array(nx * nz * 3), uv = new Float32Array(nx * nz * 2);
    const x0 = ci * CH;
    const hs = new Float32Array(nx * nz);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + i * dx, z = ZROWS[j], k = j * nx + i;
      const h = this.heightAt(x, z);
      hs[k] = h;
      pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
      uv[k * 2] = x / 3.2; uv[k * 2 + 1] = z / 3.2;
    }
    const ch = { ci, x0, nx, nz, dx, hs, pos, nor, col, uv };
    this.normalsAndColors(ch, 0, nx - 1, 0, nz - 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(this.chunkIndex(nx, nz));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, this.groundMat);
    m.receiveShadow = true; m.castShadow = true;
    this.scene.add(m);
    ch.mesh = m;
    ch.rocks = this.scatterRocks(ci);
    ch.ruins = this.look.ruins ? this.scatterRuins(ci) : [];
    return ch;
  }
  chunkIndex(nx, nz) {
    const key = nx + 'x' + nz;
    this._idx = this._idx || new Map();
    if (this._idx.has(key)) return this._idx.get(key);
    const idx = [];
    for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    const attr = new THREE.Uint32BufferAttribute(idx, 1);
    this._idx.set(key, attr);
    return attr;
  }
  normalsAndColors(ch, i0, i1, j0, j1) {
    const { nx, nz, hs, nor, col, x0, dx } = ch;
    const c = _c;
    for (let j = Math.max(0, j0); j <= Math.min(nz - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(nx - 1, i1); i++) {
      const k = j * nx + i;
      const hl = i > 0 ? hs[k - 1] : this.heightAt(x0 + (i - 1) * dx, ZROWS[j]);
      const hr = i < nx - 1 ? hs[k + 1] : this.heightAt(x0 + (i + 1) * dx, ZROWS[j]);
      const ju = Math.max(0, j - 1), jd = Math.min(nz - 1, j + 1);
      const dzz = ZROWS[ju] - ZROWS[jd] || 1;
      const hu = hs[ju * nx + i], hd = hs[jd * nx + i];
      let nX = -(hr - hl) / (2 * dx), nZ = -(hu - hd) / dzz, nY = 1;
      const l = Math.hypot(nX, nY, nZ);
      nor[k * 3] = nX / l; nor[k * 3 + 1] = nY / l; nor[k * 3 + 2] = nZ / l;
      const x = x0 + i * dx, z = ZROWS[j];
      this.colorAt(x, z, hs[k], baseH(x, this.k) * Math.exp(-(z * z) / 30), c);
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
    }
  }
  // re-press the ground where a crater appeared or grew
  updateRegion(cx, rad) {
    for (const ch of this.chunks.values()) {
      if (cx + rad < ch.x0 || cx - rad > ch.x0 + CH) continue;
      const i0 = Math.max(0, Math.floor((cx - rad - ch.x0) / ch.dx)), i1 = Math.min(ch.nx - 1, Math.ceil((cx + rad - ch.x0) / ch.dx));
      let j0 = ch.nz, j1 = 0;
      for (let j = 0; j < ch.nz; j++) if (Math.abs(ZROWS[j]) <= rad) { j0 = Math.min(j0, j); j1 = Math.max(j1, j); }
      if (j0 > j1) continue;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const k = j * ch.nx + i;
        const h = this.heightAt(ch.x0 + i * ch.dx, ZROWS[j]);
        ch.hs[k] = h; ch.pos[k * 3 + 1] = h;
      }
      this.normalsAndColors(ch, i0 - 1, i1 + 1, j0 - 1, j1 + 1);
      const g = ch.mesh.geometry;
      g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true; g.attributes.color.needsUpdate = true;
    }
  }
  scatterRocks(ci) {
    // one instanced mesh per chunk: scattered boulders, a few small ones in the foreground
    const n = this.q.rocksPerChunk;
    const inst = new THREE.InstancedMesh(MD.rockGeometry(ci & 1023, 0.75), this.M.rock, n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const x = ci * CH + h2(ci * 31 + i, 3 + this.k) * CH;
      let z = -4 - Math.pow(h2(ci + 7, i * 5), 1.6) * 70;
      const fore = h2(ci, i + 99) < 0.22;
      if (fore) z = 5 + h2(i, ci) * 7;
      const s = 0.12 + Math.pow(h2(i * 3, ci), 3) * (fore ? 0.45 : z < -20 ? 3.2 : 1.4);
      e.set(h2(i, 2) * 0.5, h2(i, 4) * 6, 0); q.setFromEuler(e);
      p.set(x, this.heightAt(x, z) + s * 0.25, z); sc.set(s * (0.8 + h2(i, 1) * 0.6), s * 0.8, s);
      m4.compose(p, q, sc);
      inst.setMatrixAt(i, m4);
    }
    inst.castShadow = true; inst.receiveShadow = true;
    inst.computeBoundingSphere();
    this.scene.add(inst);
    return [inst];
  }
  scatterRuins(ci) {
    const out = [];
    if (h2(ci, 77) > 0.75 * this.q.ruins) return out;
    const kind = Math.floor(h2(ci, 78) * 4);
    const z = -14 - h2(ci, 79) * 40;
    const x = ci * CH + h2(ci, 80) * CH;
    const g = MD.ruin(kind, ci);
    g.position.set(x, this.heightAt(x, z) - 0.3, z);
    g.rotation.y = h2(ci, 81) * 6;
    g.rotation.z = (h2(ci, 82) - 0.5) * 0.12;
    this.scene.add(g);
    out.push(g);
    return out;
  }
  disposeChunk(ch) {
    this.scene.remove(ch.mesh); ch.mesh.geometry.dispose();
    for (const m of ch.rocks) this.scene.remove(m);
    for (const g of ch.ruins) this.scene.remove(g);
  }
  rebuildGround(sync) { for (const ch of this.chunks.values()) this.disposeChunk(ch); this.chunks.clear(); this.craterSeen.clear(); if (sync) this.buildAll = true; }
  updateGround(camX) {
    const a = Math.floor((camX - 70) / CH), b = Math.floor((camX + 110) / CH);
    for (const [ci, ch] of this.chunks) if (ci < a - 1 || ci > b + 1) { this.disposeChunk(ch); this.chunks.delete(ci); }
    // build at most one chunk a frame (the nearest missing) so nothing stalls
    let built = 0;
    const lim = this.buildAll ? 99 : 2;
    this.buildAll = false;
    for (let ci = a; ci <= b && built < lim; ci++) if (!this.chunks.has(ci)) { this.chunks.set(ci, this.buildChunk(ci)); built++; }
  }
  syncCraters(W) {
    for (const c of W.craters) {
      const seen = this.craterSeen.get(c.id);
      if (seen !== undefined && Math.abs(seen - c.grow) < 0.001) continue;
      this.craterSeen.set(c.id, c.grow);
      this.updateRegion(c.x, c.r * 2.3);
    }
    if (this.craterSeen.size > 200) { const keep = new Set(W.craters.map((c) => c.id)); for (const id of this.craterSeen.keys()) if (!keep.has(id)) this.craterSeen.delete(id); }
  }

  // ---------------------------------------------------------------- mountains: real ranges at distance
  makeRidges() {
    const layers = [];
    const defs = [{ z: -150, h: 14, w: 1, seed: 1 }, { z: -300, h: 34, w: 1, seed: 2 }, { z: -620, h: 80, w: 1, seed: 3 }];
    for (const d of defs) {
      const mat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 1, metalness: 0, map: this.T.regolith, normalMap: this.T.regolithN, normalScale: new THREE.Vector2(2, 2) });
      const L = { def: d, mat, meshes: [] };
      for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.BufferGeometry(), mat); m.receiveShadow = false; m.castShadow = false; this.scene.add(m); L.meshes.push({ m, tile: null }); }
      layers.push(L);
    }
    return layers;
  }
  ridgeH(x, d) {
    const s = d.seed * 17 + this.k * 3;
    const r1 = 1 - Math.abs(fbm2(x * 0.004 + s, s * 0.3, 4) * 2 - 1);
    const r2 = fbm2(x * 0.02 + s, 1.7, 3);
    return d.h * (0.25 + r1 * r1 * 0.9 + r2 * 0.25);
  }
  buildRidge(L, tile) {
    const d = L.def, W2 = 1800, seg = d.z > -200 ? 3 : 6, nx = Math.round(W2 / seg) + 1;
    const rows = [[45, -4, 0], [16, 0.35, 0.3], [0, 0.85, 0.85], [-30, 1, 1], [-75, 0.65, 0.65], [-140, 0.2, 0.3]];
    const pos = [], uv = [], idx = [];
    for (let j = 0; j < rows.length; j++) for (let i = 0; i < nx; i++) {
      const x = tile * W2 + i * seg - 300;
      const [dz, k, nk] = rows[j];
      const rh = this.ridgeH(x + dz * 0.7, d);
      const y = k < 0 ? k : rh * k + (fbm2(x * 0.06, j * 3.1) - 0.5) * d.h * 0.12 * nk;
      pos.push(x, y - 1, d.z + dz * (d.h / 30));
      uv.push(x / 9, (d.z + dz) / 9);
    }
    for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < nx - 1; i++) { const a = j * nx + i, b = a + 1, c = a + nx, e = c + 1; idx.push(a, b, c, b, e, c); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  updateRidges(camX) {
    for (const L of this.ridges) {
      const W2 = 1800, t0 = Math.floor((camX + 300) / W2);
      const want = [t0, (camX + 300) - t0 * W2 > W2 / 2 ? t0 + 1 : t0 - 1];
      for (const slot of L.meshes) if (slot.tile !== null && !want.includes(slot.tile)) slot.tile = null;
      for (const t of want) {
        if (L.meshes.some((s) => s.tile === t)) continue;
        const slot = L.meshes.find((s) => s.tile === null);
        if (!slot) continue;
        slot.m.geometry.dispose();
        slot.m.geometry = this.buildRidge(L, t);
        slot.tile = t;
      }
    }
  }

  // ---------------------------------------------------------------- looks
  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; this.k = i;
    const L = LOOKS[i];
    this.look = L;
    this.sun.color.set(L.sun); this.sun.intensity = L.sunI;
    this.sunDir = new THREE.Vector3(...L.sunDir).normalize();
    this.earthDir = new THREE.Vector3(...L.earthDir).normalize();
    this.hemi.intensity = L.hemi;
    this.earthLight.intensity = L.earthI;
    this.M.rock.color.set(L.rockTint);
    this.ridges.forEach((R, j) => { R.mat.color.set(L.ridge[j]); for (const s of R.meshes) s.tile = null; });
    // the Earth's phase: lit from the real sun direction (night sector: a nearly full Earth)
    this.earth.material.uniforms.uSun.value.copy(L.night ? this.earthDir.clone().negate().add(new THREE.Vector3(0.35, 0.15, 0)).normalize() : this.sunDir);
    this.earth.material.uniforms.uI.value = L.night ? 0.8 : 1;
    this.sunGlow.visible = !L.night;
    this.fx.setLook(L);
    this.rebuildGround(true);
    for (const v of this.views.rover.values()) this.setHeadlights(v, L.night);
  }

  // ---------------------------------------------------------------- shots + warning markers
  makeTracers() {
    const geo = new THREE.CapsuleGeometry(0.07, 0.8, 2, 6);
    const fwd = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 2.6, 1.2), toneMapped: false }), 48);
    const up = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 3.2, 5), toneMapped: false }), 96);
    const shell = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 1.4, 0.4) }), 32);
    for (const m of [fwd, up, shell]) { m.frustumCulled = false; this.scene.add(m); }
    return { fwd, up, shell };
  }
  makeMarkers() {
    const mat = new THREE.MeshBasicMaterial({ map: this.T.ring, color: new THREE.Color(3, 0.6, 0.3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const list = [];
    for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat.clone()); m.rotation.x = -Math.PI / 2; m.visible = false; m.renderOrder = 4; this.scene.add(m); list.push(m); }
    return list;
  }

  // ---------------------------------------------------------------- entities
  setHeadlights(v, on) {
    if (on && !v.lights) {
      v.lights = [];
      for (const z of [-0.6, 0.6]) {
        const s = new THREE.SpotLight(0xfff0d8, 60, 42, 0.42, 0.65, 1.4);
        s.position.set(1.7, 0.45, z);
        s.target.position.set(9, -1.4, z * 1.6);
        v.root.userData.body.add(s, s.target);
        v.lights.push(s);
      }
    }
    if (v.lights) for (const s of v.lights) s.visible = on;
  }
  roverView(r) {
    const root = MD.rover(r.id === 1 ? 0xffffff : 0xffd9a8);
    this.scene.add(root);
    const v = { root, spin: 0, roll: 0, wy: [0, 0, 0, 0, 0, 0], rec: 0, recU: 0, dustT: 0, wasAlive: true, blink: 0 };
    this.setHeadlights(v, this.look.night);
    return v;
  }
  updateRover(v, r, dt) {
    const U = v.root.userData;
    v.root.visible = r.alive && !(r.inv > 0 && r.inv < F.inv && Math.floor(this.time * 14) % 2 === 0);
    if (!r.alive) return;
    v.root.position.set(r.x, r.y, r.z);
    U.body.position.y = MD.RIDE;
    U.body.rotation.z = r.p;
    // each wheel follows its own patch of ground (left and right differ): suspension and body roll
    let left = 0, right = 0;
    U.wheels.forEach((w, i) => {
      const mount = r.y + r.p * w.ax;
      const g = this.heightAt(r.x + w.ax, r.z + w.side * 1.12);
      const bottom = Math.min(mount + F.bumpMax, Math.max(mount - F.droop, r.air ? mount - F.droop * 0.7 : g));
      v.wy[i] += (bottom - v.wy[i]) * Math.min(1, dt * 30);
      if (!isFinite(v.wy[i]) || Math.abs(v.wy[i] - bottom) > 2) v.wy[i] = bottom;
      w.g.position.set(w.ax, v.wy[i] - r.y + MD.WHEEL_R, w.side * 1.12);
      if (w.side < 0) left += v.wy[i]; else right += v.wy[i];
    });
    v.roll += (Math.atan2((left - right) / 3, 2.24) - v.roll) * Math.min(1, dt * 8);
    U.body.rotation.x = v.roll;
    v.spin -= (r.vx * dt) / MD.WHEEL_R;
    for (const w of U.wheels) w.spin.rotation.z = v.spin;
    // arms + shocks from the body to each hub
    U.arms.forEach((a, i) => {
      const w = U.wheels[i];
      const hubY = w.g.position.y, bodyY = MD.RIDE + r.p * w.ax - 0.05;
      const px = w.ax * 0.7, mx = (px + w.ax) / 2, my = (bodyY + hubY) / 2;
      a.arm.position.set(mx, my, w.side * 0.98);
      a.arm.rotation.z = Math.atan2(hubY - bodyY, w.ax - px);
      a.arm.scale.x = Math.hypot(w.ax - px, hubY - bodyY) / 0.9 + 0.1;
      a.shock.position.set(w.ax * 0.9, (bodyY + 0.25 + hubY) / 2, w.side * 0.86);
      a.shock.scale.y = Math.max(0.3, (bodyY + 0.25 - hubY) / 0.5);
    });
    v.rec = Math.max(0, v.rec - dt * 6); v.recU = Math.max(0, v.recU - dt * 6);
    U.fwd.position.x = 1.62 - v.rec * 0.18;
    U.upGun.position.y = -v.recU * 0.12;
    // wheel dust: rooster tails thrown back in clean lunar arcs
    if (!r.air) {
      v.dustT -= dt * (0.6 + r.vx * 0.18);
      if (v.dustT <= 0) {
        v.dustT = 0.05;
        const w = U.wheels[(Math.random() * 6) | 0];
        this.fx.dust(r.x + w.ax - 0.2, v.wy[0] + 0.05, r.z + w.side * 1.12, { n: 1, vx: -r.vx * 0.25 - 1, vy: 1.2 + r.vx * 0.12, up: 1, jit: 0.8, s0: 0.25, s1: 1.1 + r.vx * 0.06, life: 1.4, a: 0.32, drag: 0.4, grav: 1.6, spread: 0.2 });
      }
    }
  }

  sync(W, dt) {
    this.W = W;
    const V = this.views;
    const sync = (map, list, make, upd) => {
      const live = new Set();
      for (const e of list) {
        if (e.dead) continue;
        let v = map.get(e.id);
        if (!v) { v = make(e); map.set(e.id, v); }
        live.add(e.id);
        upd(v, e);
      }
      for (const [id, v] of map) if (!live.has(id)) { this.scene.remove(v.obj || v.root); map.delete(id); }
    };
    // rovers keep their views across deaths (keyed by rover id)
    for (const r of W.rovers) {
      let v = V.rover.get(r.id);
      if (!v) { v = this.roverView(r); V.rover.set(r.id, v); }
      this.updateRover(v, r, dt);
    }
    for (const [id, v] of V.rover) if (!W.rovers.some((r) => r.id === id)) { this.scene.remove(v.root); V.rover.delete(id); }
    sync(V.rocks, W.rocks, (e) => { const obj = MD.rock(e.seed, e.r, e.kind); this.scene.add(obj); return { obj }; },
      (v, e) => { const g = this.heightAt(e.x, 0); v.obj.position.set(e.x, g - (e.kind === 'wall' ? 0.2 : 0), 0); if (e.vx) v.obj.rotation.z = -(e.roll || 0); });
    sync(V.mines, W.mines, () => { const obj = MD.mine(); this.scene.add(obj); return { obj }; },
      (v, e) => { v.obj.position.set(e.x, this.heightAt(e.x, 0) - 0.04, 0); const led = v.obj.userData.led.material; led.emissiveIntensity = (Math.sin(this.time * (e.sig ? 14 : 5)) > 0.2 ? 8 : 0.3); });
    sync(V.tanks, W.tanks, () => { const obj = MD.tank(); this.scene.add(obj); return { obj }; },
      (v, e) => {
        const g = this.heightAt(e.x, 0), g2 = this.heightAt(e.x + 1, 0);
        v.obj.position.set(e.x, g, 0); v.obj.rotation.z = Math.atan2(g2 - g, 1) * 0.8;
        v.obj.userData.gun.position.x = -0.9 + e.recoil * 0.3;
      });
    sync(V.flyers, W.flyers, () => { const obj = MD.flyer(); obj.scale.setScalar(1.5); this.scene.add(obj); return { obj, bank: 0 }; },
      (v, e) => {
        v.obj.position.set(e.x, e.y, 0);
        const rel = e.vx - (W.rovers[0] ? W.rovers[0].vx : 0);
        v.bank += (-rel * 0.06 - v.bank) * Math.min(1, dt * 4);
        v.obj.rotation.set(Math.sin(this.time * 1.7 + e.id) * 0.12, 0, v.bank);
        if (Math.random() < dt * 30) this.fx.fireP.add({ x: e.x - 1.1, y: e.y + 0.05, z: (Math.random() < 0.5 ? -0.55 : 0.55), vx: e.vx - 6, vy: 0, vz: 0, s0: 0.5, s1: 0.1, max: 0.18, a: 0.8, r: 1, g: 0.45, b: 0.2 });
      });
    sync(V.bombs, W.bombs, () => { const obj = MD.bomb(); obj.scale.setScalar(1.5); this.scene.add(obj); return { obj }; },
      (v, e) => {
        v.obj.position.set(e.x, e.y, 0);
        v.obj.rotation.z = Math.atan2(e.vx, -e.vy) * 0.6;
        if (Math.random() < dt * 20) this.fx.dust(e.x, e.y + 0.3, 0, { n: 1, vx: 0, vy: 0.4, up: 0.2, jit: 0.3, s0: 0.2, s1: 0.8, life: 1.2, a: 0.25, k: 0.55, drag: 1, grav: -0.1, spread: 0.05 });
      });
    sync(V.drones, W.drones, () => { const obj = MD.drone(); obj.scale.setScalar(1.25); this.scene.add(obj); return { obj }; },
      (v, e) => { v.obj.position.set(e.x, e.y, 0); v.obj.userData.ring.rotation.x += dt * 9; v.obj.rotation.z = Math.atan2(e.vy, Math.abs(e.vx) + 0.01) * 0.3; });
    // shells + shots as instanced tracers
    const T = this.tracers, m4 = _m4;
    let nf = 0, nu = 0, ns = 0;
    for (const s of W.shots) {
      if (s.kind === 'fwd' && nf < 48) { _q.setFromAxisAngle(_z, Math.PI / 2); m4.compose(_v.set(s.x, s.y, 0), _q, _s.set(1, 1.4, 1)); T.fwd.setMatrixAt(nf++, m4); }
      else if (s.kind === 'up' && nu < 96) { _q.setFromAxisAngle(_z, -Math.atan2(s.vx - (W.rovers[0] ? W.rovers[0].vx : 0), s.vy)); m4.compose(_v.set(s.x, s.y, 0), _q, _s.set(1, 1.2, 1)); T.up.setMatrixAt(nu++, m4); }
    }
    for (const s of W.shells) { if (ns >= 32) break; m4.compose(_v.set(s.x, s.y, 0), _q.identity(), _s.set(s.big ? 1.6 : 1, 1, 1)); T.shell.setMatrixAt(ns++, m4); if (Math.random() < 0.5) this.fx.fireP.add({ x: s.x + 0.2, y: s.y, z: 0, vx: 2, vy: 0, vz: 0, s0: 0.5, s1: 0.1, max: 0.2, a: 0.7, r: 1, g: 0.4, b: 0.15 }); }
    T.fwd.count = nf; T.up.count = nu; T.shell.count = ns;
    T.fwd.instanceMatrix.needsUpdate = T.up.instanceMatrix.needsUpdate = T.shell.instanceMatrix.needsUpdate = true;
    // landing markers under falling bombs (the warning you get from the drop on)
    let mi = 0;
    for (const b of W.bombs) {
      if (mi >= this.markers.length) break;
      const m = this.markers[mi++];
      const f = Math.min(1, b.t / Math.max(0.1, b.T));
      m.visible = true;
      m.position.set(b.tx, this.heightAt(b.tx, 0) + 0.06, 0);
      const s = 2.6 - f * 1.2 + Math.sin(this.time * 12) * 0.08;
      m.scale.set(s, s, 1);
      m.material.opacity = 0.35 + f * 0.55;
    }
    for (; mi < this.markers.length; mi++) this.markers[mi].visible = false;
    this.syncBoss(W, dt);
    this.syncCraters(W);
  }
  syncBoss(W, dt) {
    const b = W.boss;
    if (!b) { if (this.bossView) { this.scene.remove(this.bossView.obj); this.bossView = null; } return; }
    if (!this.bossView || this.bossView.key !== b.key) {
      if (this.bossView) this.scene.remove(this.bossView.obj);
      const obj = MD.boss(b.key);
      this.scene.add(obj);
      this.bossView = { obj, key: b.key, smokeT: 0 };
    }
    const v = this.bossView, P = v.obj.userData;
    const y = b.kind === 'ground' ? (b.gy ?? this.heightAt(b.x, 0)) : b.y;
    v.obj.position.set(b.x, y, b.kind === 'ground' ? 0 : -0.5);
    if (b.kind !== 'ground') v.obj.rotation.set(Math.sin(this.time * 0.8) * 0.05, 0, Math.sin(this.time * 0.6) * 0.06);
    else { const g2 = this.heightAt(b.x + 2, 0); v.obj.rotation.z = Math.atan2(g2 - y, 2) * 0.6; if (P.wheel) P.wheel.rotation.z += dt * 1.6; }
    const hit = b.hitT > 0 ? 1 : 0;
    if (P.core) P.core.material.emissiveIntensity = 6 + hit * 20 + Math.sin(this.time * 6) * 2;
    for (const gl of P.glow) gl.material.emissiveIntensity = 4 + Math.sin(this.time * 9 + gl.id) * 1.5;
    if (b.hp < b.max * 0.5 || b.state === 'dying') {
      v.smokeT -= dt;
      if (v.smokeT <= 0) {
        v.smokeT = b.state === 'dying' ? 0.12 : 0.25;
        this.fx.dust(b.x + (Math.random() - 0.5) * 4, y + 1.5, (Math.random() - 0.5) * 2, { n: 1, vx: -2, vy: 1.5, up: 1, jit: 1, s0: 0.8, s1: 3.2, life: 2.5, a: 0.4, k: 0.25, drag: 0.6, grav: -0.3 });
        if (b.state === 'dying' && Math.random() < 0.5) this.fx.explode(b.x + (Math.random() - 0.5) * 6, y + Math.random() * 3, (Math.random() - 0.5) * 2, 1.2, { metal: true, rock: false, scorch: false });
      }
    }
  }

  // ---------------------------------------------------------------- camera + frame
  addTrauma(t) { this.trauma = Math.min(1, this.trauma + t); }
  resize() {
    const w = innerWidth, h = innerHeight;
    this.r.setPixelRatio(this.q.dpr * this.scale);
    this.r.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const pw = Math.round(w * this.q.dpr * this.scale), ph = Math.round(h * this.q.dpr * this.scale);
    this.post.setSize(pw, ph);
    this.stars.material.uniforms.uPx.value = Math.max(1, this.q.dpr * this.scale);
    for (const p of [this.fx.dustP, this.fx.fireP]) p.mat.uniforms.uScale.value = ph * 0.85;
  }
  setScale(s) { if (Math.abs(s - this.scale) < 0.02) return; this.scale = s; this.resize(); }

  // focus: { x, y, vx }; o: { bossAir, shake, cine }
  updateCamera(dt, focus, o = {}) {
    const aspect = this.camera.aspect, portrait = aspect < 1;
    const ahead = portrait ? 4 : 8 + Math.min(3, (focus.vx - 6) * 0.4);
    const dist = (portrait ? 34 + (1 - aspect) * 16 : 25 + Math.max(0, 1.6 - aspect) * 9 + Math.min(4, (focus.vx - 6) * 0.45)) + (o.bossAir ? 7 : 0);
    const tx = focus.x + ahead;
    if (o.snap) { this.camX = tx; this.camY = focus.y; this.camVY = 0; }
    this.camX += (tx - this.camX) * Math.min(1, dt * 3.2);
    this.airK += ((o.air ? 1 : 0) - this.airK) * Math.min(1, dt * 1.5);
    this.bossK = (this.bossK || 0) + ((o.bossAir ? 1 : 0) - (this.bossK || 0)) * Math.min(1, dt * 1.2);
    const ty = focus.y + this.bossK * 4 + this.airK * 1.6 * (1 - this.bossK);
    // critically damped height follow so jumps read but the horizon stays calm
    const kk = 5;
    this.camVY += ((ty - this.camY) * kk * kk - 2 * kk * this.camVY) * dt;
    this.camY += this.camVY * dt;
    const c = this.camera;
    let px = this.camX - 2, py = this.camY + 3.6 + (portrait ? 4 : 0), pz = dist;
    let lx = this.camX, ly = this.camY + 2.2 + (portrait ? 1.5 : 0);
    if (o.cine) { // title / attract: slow drifting three-quarter view
      const t = this.time * 0.07;
      px = this.camX - 6 + Math.sin(t) * 4; py = this.camY + 2.2 + Math.sin(t * 1.3) * 0.6; pz = 12.5 + Math.cos(t) * 2;
      lx = this.camX - 1.5; ly = this.camY + 1.4;
    }
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.55;
    if (sh > 0) { px += (Math.random() - 0.5) * sh; py += (Math.random() - 0.5) * sh; lx += (Math.random() - 0.5) * sh * 0.5; }
    c.position.set(px, py, pz);
    c.lookAt(lx, ly, 0);
    // sky objects ride with the camera (they are at infinity)
    this.stars.position.copy(c.position);
    this.earth.position.copy(c.position).addScaledVector(this.earthDir, 1900);
    this.sunGlow.position.copy(c.position).addScaledVector(this.sunDir, 1800);
    // the sun's shadow camera follows the action, snapped to texels to stop shimmer
    const L = this.look;
    const keyDir = this.sunDir;
    const cx = Math.round(lx / 0.5) * 0.5;
    this.sun.target.position.set(cx + 4, 0, 0);
    this.sun.position.set(cx + 4, 0, 0).addScaledVector(keyDir, 120);
    this.earthLight.position.copy(this.earthDir).multiplyScalar(100).add(this.sun.target.position);
    this.earthLight.target.position.copy(this.sun.target.position);
    this.updateGround(this.camX);
    this.updateRidges(this.camX);
    void L;
  }

  project(x, y, z, out) {
    _v.set(x, y, z).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }

  render(dt, p = {}) {
    this.time += dt;
    this.earth.material.uniforms.uT.value = this.time;
    this.fx.update(dt);
    const L = this.look;
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    const shocks = p.shocks || [];
    this.post.render(this.scene, this.camera, {
      bloom: 0.7, threshold: 1.2, exposure: L.exposure * (p.exposure ?? 1), chroma: 0.0018, time: this.time, desat: p.desat || 0, fade: p.fade || 0, vignette: 0.42,
      flash: this.flash, tint: _tint.set(...L.grade), shocks, lens: [],
    });
  }
  // a screen flash, kept modest (reduced-flash turns it right down)
  flashScreen(a, color = 0xffffff) { const c = new THREE.Color(color); this.flash.set(c.r, c.g, c.b, Math.max(this.flash.w, a * (CALM.on ? 0.25 : 0.6))); }

  // draw one of everything once at boot so first explosions do not stall on shader compiles
  warmUp() {
    const tmp = [MD.rover(), MD.flyer(), MD.drone(), MD.tank(), MD.mine(), MD.bomb(), MD.rock(1, 0.6, 'boulder'), MD.rock(2, 0.9, 'wall'), MD.boss('warden'), MD.boss('crawler'), MD.boss('excavator'), MD.ruin(0, 1), MD.ruin(1, 2)];
    tmp.forEach((o, i) => { o.position.set(this.camX + i * 3, 2, 0); this.scene.add(o); });
    this.fx.explode(this.camX, 2, 0, 1, { metal: true });
    this.fx.flash(this.camX, 2, 0, 1);
    for (const L of this.fx.lights) L.l.visible = true;
    this.r.compile(this.scene, this.camera);
    this.post.render(this.scene, this.camera, { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] });
    for (const o of tmp) this.scene.remove(o);
    this.fx.clear();
  }
}
const _c = new THREE.Color(), _ice = new THREE.Color(0xdfe8f2), _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _z = new THREE.Vector3(0, 0, 1), _tint = new THREE.Vector3();
void THREATS;

// Invaders 3D Edition — the three.js stage.
// The game logic (game.js) runs exactly as in the Classic Edition on a flat 2D field;
// every frame this module reads that state and draws it as a real-time 3D scene:
// voxel invaders built from the original pixel sprites, a flying player ship, energy
// bunkers, a ringed planet, bloom and screen-space text. It never changes game state.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);

// Heights above the play plane (world Y). The field itself is the XZ plane:
// world X = game x - width/2, world Z = game y - height/2 (down-screen = toward camera).
const PLATE_Y = -30;
const INV_Y = 20;
const PLAYER_Y = 12;
const SHIELD_Y = 10;
const SHOT_Y = 15;
const BOSS_Y = 26;

const QUALITY = [
  { name: 'low', dpr: 1, budget: 1.3e6, msaa: 0, dust: 0.45, debris: 520 },
  { name: 'med', dpr: 1.5, budget: 2.6e6, msaa: 2, dust: 0.75, debris: 900 },
  { name: 'high', dpr: 2, budget: 4.6e6, msaa: 4, dust: 1, debris: 1500 }
];

// ---------------------------------------------------------------------------
// Voxel models from the original pixel sprites
// ---------------------------------------------------------------------------
const FACES = [
  { n: [1, 0, 0], v: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
  { n: [-1, 0, 0], v: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
  { n: [0, 1, 0], v: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
  { n: [0, -1, 0], v: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
  { n: [0, 0, 1], v: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
  { n: [0, 0, -1], v: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] }
];

class BoxBuilder {
  constructor() { this.p = []; this.n = []; this.c = []; this.h = []; this.i = []; }
  box(cx, cy, cz, hx, hy, hz, color, hot) {
    for (const face of FACES) {
      const base = this.p.length / 3;
      for (const v of face.v) {
        this.p.push(cx + v[0] * hx, cy + v[1] * hy, cz + v[2] * hz);
        this.n.push(face.n[0], face.n[1], face.n[2]);
        this.c.push(color ? color[0] : 1, color ? color[1] : 1, color ? color[2] : 1);
        this.h.push(hot || 0);
      }
      this.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }
  geometry(withColor) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    if (withColor) g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('aHot', new THREE.Float32BufferAttribute(this.h, 1));
    g.setIndex(this.i);
    g.computeBoundingSphere();
    return g;
  }
}

// Sculpted voxel extrusion: interior pixels are thicker than edge pixels, so the
// flat sprites become rounded little sculptures.
function voxelModel(pattern, o = {}) {
  const rows = pattern.length;
  const cols = pattern[0].length;
  const filled = (c, r) => r >= 0 && r < rows && c >= 0 && c < cols && pattern[r][c] === '1';
  const gap = o.gap ?? 0.14;
  const half = (1 - gap) / 2;
  const b = new BoxBuilder();
  const voxels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!filled(c, r)) continue;
      let d = 1;
      search: for (d = 1; d < 6; d++) {
        for (let dr = -d; dr <= d; dr++) {
          for (let dc = -d; dc <= d; dc++) if (!filled(c + dc, r + dr)) break search;
        }
      }
      const x = c - (cols - 1) / 2;
      const y = (rows - 1) / 2 - r;
      let depth = Math.min(o.depthMax ?? 2.6, (o.depthBase ?? 1) + (o.depthStep ?? 0.45) * (d - 1));
      if (o.centerBoost) depth += o.centerBoost * Math.max(0, 1 - Math.abs(x) / (cols / 2));
      const color = o.color ? o.color(c, r) : null;
      const hot = o.hot ? o.hot(c, r) : 0;
      b.box(x, y, 0, half, half, depth / 2, color, hot);
      voxels.push({ x, y, z: 0, s: 1 - gap, d: depth, color, hot });
    }
  }
  for (const e of o.extras || []) {
    b.box(e.x, e.y, e.z, e.w / 2, e.h / 2, e.d / 2, e.color, e.hot);
    voxels.push({ x: e.x, y: e.y, z: e.z, s: Math.min(e.w, e.h), d: e.d, color: e.color, hot: e.hot });
  }
  return { geometry: b.geometry(!!o.color), voxels, cols, rows };
}

function unitBox() {
  const b = new BoxBuilder();
  b.box(0, 0, 0, 0.5, 0.5, 0.5, null, 0);
  return b.geometry(false);
}

// MeshStandardMaterial whose glow follows the (instance / vertex) colour, plus "hot" white voxels.
function voxelMaterial({ glow = 0.6, vertexColors = false, roughness = 0.36, metalness = 0.22, color = 0xffffff } = {}) {
  const m = new THREE.MeshStandardMaterial({ color, roughness, metalness, vertexColors });
  m.userData.glow = { value: glow };
  m.onBeforeCompile = shader => {
    shader.uniforms.uGlow = m.userData.glow;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aHot;\nvarying float vHot;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHot = aHot;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uGlow;\nvarying float vHot;')
      .replace('#include <color_fragment>', '#include <color_fragment>\nvec3 glowTint = diffuseColor.rgb;\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), vHot);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += glowTint * uGlow + vec3(vHot * 2.4);')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.rgb = min(gl_FragColor.rgb, vec3(40.0));');
  };
  return m;
}

// ---------------------------------------------------------------------------
// Additive effect batch: streaks, glow sprites, flat rings and floor glows in one draw
// ---------------------------------------------------------------------------
const FX_VERT = `
attribute vec4 aColor;
attribute vec2 aUv;
attribute vec2 aShape;
varying vec4 vColor;
varying vec2 vUv;
varying vec2 vShape;
void main() {
  vColor = aColor; vUv = aUv; vShape = aShape;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}`;
const FX_FRAG = `
varying vec4 vColor;
varying vec2 vUv;
varying vec2 vShape;
void main() {
  float s = vShape.x;
  float a = 0.0;
  float core = 0.0;
  if (s < 0.5) {
    float x = vUv.x;
    a = exp(-x * x * 4.5) * pow(clamp(vUv.y, 0.0, 1.0), 0.8);
    core = exp(-x * x * 34.0) * smoothstep(0.35, 1.0, vUv.y);
  } else if (s < 1.5) {
    float d2 = dot(vUv, vUv);
    a = exp(-d2 * 5.0);
    core = exp(-d2 * 40.0);
  } else if (s < 2.5) {
    float d = length(vUv);
    float w = max(vShape.y, 0.02);
    float k = (d - (1.0 - w)) / w;
    a = exp(-k * k * 2.2) * step(d, 1.0);
  } else {
    float d2 = dot(vUv, vUv);
    a = exp(-d2 * 3.2) * (1.0 - smoothstep(0.75, 1.0, sqrt(d2)));
  }
  vec3 c = vColor.rgb * a + mix(vColor.rgb, vec3(1.0), 0.65) * core * 1.4;
  c *= vColor.a;
  if (dot(c, c) < 1e-6) discard;
  gl_FragColor = vec4(min(c, vec3(40.0)), 1.0);
}`;

class FxBatch {
  constructor(cap) {
    this.cap = cap;
    this.n = 0;
    this.pos = new Float32Array(cap * 12);
    this.col = new Float32Array(cap * 16);
    this.uv = new Float32Array(cap * 8);
    this.shp = new Float32Array(cap * 8);
    const index = new Uint16Array(cap * 6);
    for (let i = 0; i < cap; i++) {
      index.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
    }
    const g = new THREE.BufferGeometry();
    this.aPos = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage);
    this.aUv = new THREE.BufferAttribute(this.uv, 2).setUsage(THREE.DynamicDrawUsage);
    this.aShp = new THREE.BufferAttribute(this.shp, 2).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.aPos);
    g.setAttribute('aColor', this.aCol);
    g.setAttribute('aUv', this.aUv);
    g.setAttribute('aShape', this.aShp);
    g.setIndex(new THREE.BufferAttribute(index, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e9);
    const m = new THREE.ShaderMaterial({
      vertexShader: FX_VERT,
      fragmentShader: FX_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(g, m);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 20;
    this.right = new THREE.Vector3();
    this.up = new THREE.Vector3();
    this.cam = new THREE.Vector3();
  }
  begin(camera) {
    this.n = 0;
    const e = camera.matrixWorld.elements;
    this.right.set(e[0], e[1], e[2]);
    this.up.set(e[4], e[5], e[6]);
    this.cam.setFromMatrixPosition(camera.matrixWorld);
  }
  // 4 corners (12 floats), colours for corners 0/1 and 2/3, uv set, shape id + parameter
  quad(p, ca, cb, uvs, shape, param) {
    if (this.n >= this.cap) return;
    const i = this.n++;
    this.pos.set(p, i * 12);
    const c = this.col;
    const o = i * 16;
    c[o] = ca[0]; c[o + 1] = ca[1]; c[o + 2] = ca[2]; c[o + 3] = ca[3];
    c[o + 4] = ca[0]; c[o + 5] = ca[1]; c[o + 6] = ca[2]; c[o + 7] = ca[3];
    c[o + 8] = cb[0]; c[o + 9] = cb[1]; c[o + 10] = cb[2]; c[o + 11] = cb[3];
    c[o + 12] = cb[0]; c[o + 13] = cb[1]; c[o + 14] = cb[2]; c[o + 15] = cb[3];
    this.uv.set(uvs, i * 8);
    const s = this.shp;
    for (let k = 0; k < 4; k++) { s[i * 8 + k * 2] = shape; s[i * 8 + k * 2 + 1] = param || 0; }
  }
  sprite(x, y, z, size, r, g, b, a) {
    const R = this.right, U = this.up;
    const rx = R.x * size, ry = R.y * size, rz = R.z * size;
    const ux = U.x * size, uy = U.y * size, uz = U.z * size;
    QP[0] = x - rx - ux; QP[1] = y - ry - uy; QP[2] = z - rz - uz;
    QP[3] = x + rx - ux; QP[4] = y + ry - uy; QP[5] = z + rz - uz;
    QP[6] = x + rx + ux; QP[7] = y + ry + uy; QP[8] = z + rz + uz;
    QP[9] = x - rx + ux; QP[10] = y - ry + uy; QP[11] = z - rz + uz;
    CA[0] = r; CA[1] = g; CA[2] = b; CA[3] = a;
    this.quad(QP, CA, CA, UV_SQUARE, 1, 0);
  }
  // camera-facing ribbon from tail to head
  streak(tx, ty, tz, hx, hy, hz, width, tail, head) {
    const dx = hx - tx, dy = hy - ty, dz = hz - tz;
    const vx = (tx + hx) / 2 - this.cam.x, vy = (ty + hy) / 2 - this.cam.y, vz = (tz + hz) / 2 - this.cam.z;
    let sx = dy * vz - dz * vy, sy = dz * vx - dx * vz, sz = dx * vy - dy * vx;
    let len = Math.hypot(sx, sy, sz);
    if (len < 1e-6) { sx = this.right.x; sy = this.right.y; sz = this.right.z; len = 1; }
    const w = width / 2 / len;
    sx *= w; sy *= w; sz *= w;
    QP[0] = tx - sx; QP[1] = ty - sy; QP[2] = tz - sz;
    QP[3] = tx + sx; QP[4] = ty + sy; QP[5] = tz + sz;
    QP[6] = hx + sx; QP[7] = hy + sy; QP[8] = hz + sz;
    QP[9] = hx - sx; QP[10] = hy - sy; QP[11] = hz - sz;
    this.quad(QP, tail, head, UV_STREAK, 0, 0);
  }
  // flat on the XZ plane: shape 2 = ring (param = relative width), 3 = soft disc
  flat(x, y, z, size, r, g, b, a, shape, param) {
    QP[0] = x - size; QP[1] = y; QP[2] = z + size;
    QP[3] = x + size; QP[4] = y; QP[5] = z + size;
    QP[6] = x + size; QP[7] = y; QP[8] = z - size;
    QP[9] = x - size; QP[10] = y; QP[11] = z - size;
    CA[0] = r; CA[1] = g; CA[2] = b; CA[3] = a;
    this.quad(QP, CA, CA, UV_SQUARE, shape, param);
  }
  end() {
    const n = this.n;
    this.mesh.geometry.setDrawRange(0, n * 6);
    for (const [attr, size] of [[this.aPos, 12], [this.aCol, 16], [this.aUv, 8], [this.aShp, 8]]) {
      attr.clearUpdateRanges();
      if (n) attr.addUpdateRange(0, n * size);
      attr.needsUpdate = n > 0;
    }
    this.mesh.visible = n > 0;
  }
}
const QP = new Float32Array(12);
const CA = [0, 0, 0, 0];
const UV_SQUARE = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
const UV_STREAK = new Float32Array([-1, 0, 1, 0, 1, 1, -1, 1]);

// ---------------------------------------------------------------------------
// Shaders for the backdrop
// ---------------------------------------------------------------------------
const NOISE_GLSL = `
float hash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
`;

const SKY_VERT = `varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FRAG = `
varying vec3 vDir;
${NOISE_GLSL}
float starLayer(vec3 d, float scale, float density, float size) {
  vec3 p = d * scale;
  vec3 cell = floor(p);
  float h = hash3(cell);
  if (h < density) return 0.0;
  vec3 star = cell + 0.5 + (vec3(hash3(cell + 3.1), hash3(cell + 7.7), hash3(cell + 1.3)) - 0.5) * 0.7;
  float dist = length(p - star);
  return exp(-dist * dist / (size * size)) * (0.4 + 0.6 * hash3(cell + 9.2));
}
void main() {
  vec3 d = normalize(vDir);
  float band = exp(-pow(dot(d, normalize(vec3(0.35, 0.8, -0.45))), 2.0) * 5.0);
  float n1 = fbm(d * 2.4 + vec3(1.7, 0.0, 3.1));
  float n2 = fbm(d * 3.6 + vec3(-4.2, 2.0, 0.5));
  float n3 = fbm(d * 7.0);
  vec3 col = vec3(0.003, 0.004, 0.014);
  col += vec3(0.20, 0.018, 0.17) * pow(smoothstep(0.35, 0.85, n1), 2.2) * (0.35 + band * 1.4);
  col += vec3(0.0, 0.10, 0.17) * pow(smoothstep(0.38, 0.9, n2), 2.0) * (0.3 + band * 1.2);
  col += vec3(0.05, 0.03, 0.12) * band * n3 * 0.6;
  col *= 0.9;
  float stars = starLayer(d, 420.0, 0.986, 0.16) * 1.4 + starLayer(d, 160.0, 0.993, 0.12) * 4.0;
  vec3 sc = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.75, 0.9), hash3(floor(d * 160.0) + 2.0));
  col += sc * stars * (0.6 + band);
  gl_FragColor = vec4(col, 1.0);
}`;

const PLANET_VERT = `
varying vec3 vN; varying vec3 vObj; varying vec3 vWorld;
void main() {
  vObj = position;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const PLANET_FRAG = `
uniform vec3 uSun; uniform float uTime;
varying vec3 vN; varying vec3 vObj; varying vec3 vWorld;
${NOISE_GLSL}
void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  float ca = cos(uTime * 0.004), sa = sin(uTime * 0.004);
  vec3 p = vec3(ca * vObj.x - sa * vObj.z, vObj.y, sa * vObj.x + ca * vObj.z);
  float h = fbm(p * 2.6);
  float land = smoothstep(0.5, 0.56, h);
  float bands = 0.5 + 0.5 * sin(p.y * 22.0 + fbm(p * 5.0) * 6.0);
  vec3 ocean = vec3(0.012, 0.03, 0.09) + vec3(0.0, 0.03, 0.05) * bands;
  vec3 ground = vec3(0.06, 0.03, 0.09) + vec3(0.05, 0.02, 0.05) * fbm(p * 9.0);
  vec3 albedo = mix(ocean, ground, land);
  float ndl = dot(N, uSun);
  float day = smoothstep(-0.08, 0.45, ndl);
  vec3 col = albedo * day * 2.6;
  float night = 1.0 - smoothstep(-0.25, 0.05, ndl);
  float city = land * smoothstep(0.62, 0.86, fbm(p * 34.0)) * night;
  col += (vec3(1.0, 0.3, 0.8) * 0.55 + vec3(0.2, 0.85, 1.0) * 0.3) * city * 0.5;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  float lit = smoothstep(-0.55, 0.35, ndl);
  col += mix(vec3(0.05, 0.55, 1.0), vec3(1.0, 0.25, 0.75), fres * 0.6) * fres * (0.12 + lit * 2.6);
  gl_FragColor = vec4(col, 1.0);
}`;

const HALO_FRAG = `
uniform vec3 uColor; uniform vec2 uSunScreen;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float d = length(p) * 1.25;
  float outside = smoothstep(0.985, 1.02, d);
  float glow = exp(-max(d - 1.0, 0.0) * 9.0) * outside;
  float side = 0.35 + 0.65 * smoothstep(-0.4, 0.9, dot(normalize(p + 1e-5), uSunScreen));
  gl_FragColor = vec4(uColor * glow * side, 1.0);
}`;
const QUAD_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const RING_FRAG = `
uniform vec3 uSun; uniform float uInner;
varying vec2 vUv; varying vec3 vWorldR;
${NOISE_GLSL}
void main() {
  float r = length(vUv * 2.0 - 1.0);
  if (r < uInner || r > 1.0) discard;
  float t = (r - uInner) / (1.0 - uInner);
  float bands = 0.55 + 0.45 * sin(t * 90.0 + vnoise(vec3(t * 40.0, 0.0, 0.0)) * 4.0);
  bands *= smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.86, t) * (1.0 - 0.7 * smoothstep(0.42, 0.46, t) * smoothstep(0.52, 0.48, t));
  vec3 col = mix(vec3(0.45, 0.2, 0.55), vec3(0.2, 0.55, 0.75), t) * bands * 0.11;
  gl_FragColor = vec4(col, 1.0);
}`;
const RING_VERT = `varying vec2 vUv; varying vec3 vWorldR; void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vWorldR = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;

const PLATE_VERT = `varying vec2 vPos; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vPos = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const PLATE_FRAG = `
uniform float uTime; uniform vec2 uHalf; uniform vec3 uPulse;
varying vec2 vPos;
void main() {
  vec2 p = vPos;
  vec2 q = abs(p) - uHalf;
  float outside = max(q.x, q.y);
  float inside = 1.0 - smoothstep(-2.0, 2.0, outside);
  vec2 g = p; g.y -= uTime * 34.0;
  vec2 f = abs(fract(g / 48.0 - 0.5) - 0.5) * 48.0;
  float line = exp(-min(f.x, f.y) * 0.8);
  float depthFade = 0.45 + 0.55 * smoothstep(-uHalf.y, uHalf.y, p.y);
  float rail = exp(-abs(q.x) * 0.28) * (1.0 - smoothstep(0.0, 24.0, q.y));
  float endRail = exp(-abs(q.y) * 0.35) * (1.0 - smoothstep(0.0, 24.0, q.x)) * 0.5;
  float scan = exp(-pow(fract(uTime * 0.12) * 2.6 - 0.8 - (p.y / uHalf.y) * 0.5, 2.0) * 120.0) * inside;
  vec3 col = vec3(0.04, 0.38, 0.55) * line * inside * depthFade * 0.5;
  col += vec3(0.25, 0.85, 1.0) * rail * 1.5 + vec3(1.0, 0.24, 0.85) * endRail * 1.2;
  col += vec3(0.1, 0.6, 0.8) * scan * 0.25;
  col += uPulse * inside * (0.4 + line);
  float alpha = inside * 0.72 + (1.0 - inside) * exp(-max(outside, 0.0) * 0.06) * 0.35;
  gl_FragColor = vec4(col, alpha);
}`;

const DUST_VERT = `
attribute float aSeed; attribute vec3 aColor;
uniform float uTime; uniform float uProj; uniform float uMinZ; uniform float uRangeZ;
varying vec3 vCol; varying float vA;
void main() {
  vec3 p = position;
  float speed = 40.0 + aSeed * 220.0;
  float k = mod(p.z - uMinZ + uTime * speed, uRangeZ);
  p.z = uMinZ + k;
  float u = k / uRangeZ;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vA = smoothstep(0.0, 0.15, u) * smoothstep(1.0, 0.82, u) * (0.55 + 0.45 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 40.0));
  gl_PointSize = clamp((1.6 + aSeed * 3.2) * uProj / -mv.z, 1.0, 9.0);
  vCol = aColor;
}`;
const DUST_FRAG = `
varying vec3 vCol; varying float vA;
void main() { vec2 c = gl_PointCoord - 0.5; float a = exp(-dot(c, c) * 14.0); gl_FragColor = vec4(vCol * a * vA, 1.0); }`;

const FRESNEL_VERT = `
varying vec3 vN; varying vec3 vV; varying vec3 vObj;
void main() {
  vObj = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const FRESNEL_FRAG = `
uniform vec3 uColor; uniform float uAlpha; uniform float uTime; uniform float uHex; uniform float uHit;
varying vec3 vN; varying vec3 vV; varying vec3 vObj;
void main() {
  float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(f, 2.4);
  float hex = 0.0;
  if (uHex > 0.0) {
    vec2 h = vec2(atan(vObj.z, vObj.x) * 5.0, vObj.y * 8.0);
    vec2 g = abs(fract(h + vec2(0.0, floor(h.x) * 0.5)) - 0.5);
    hex = smoothstep(0.42, 0.5, max(g.x, g.y)) * uHex;
  }
  float wave = 0.5 + 0.5 * sin(vObj.y * 14.0 - uTime * 6.0);
  vec3 c = uColor * (rim * 1.7 + 0.05 + hex * (0.35 + wave * 0.3) + uHit * (0.5 + rim));
  gl_FragColor = vec4(c * uAlpha, 1.0);
}`;

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uFlash: { value: new THREE.Vector3() },
    uVignette: { value: 0.42 },
    uAberr: { value: 0 },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
uniform sampler2D tDiffuse; uniform vec3 uFlash; uniform float uVignette; uniform float uAberr; uniform float uTime; uniform vec2 uRes;
varying vec2 vUv;
void main() {
  vec2 c = vUv - 0.5;
  vec3 col;
  if (uAberr > 0.0001) {
    vec2 off = c * uAberr;
    col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
  } else {
    col = texture2D(tDiffuse, vUv).rgb;
  }
  col += uFlash;
  vec2 a = c * vec2(uRes.x / uRes.y, 1.0);
  float v = smoothstep(0.95, 0.3, length(a) * (uRes.x > uRes.y ? 0.85 : 1.15));
  col *= mix(1.0 - uVignette, 1.0, v);
  float n = fract(sin(dot(vUv * uRes + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * 0.01;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`
};

// ---------------------------------------------------------------------------
// The stage
// ---------------------------------------------------------------------------
export function createStage(opts) {
  const { canvas, fxCanvas, game, colors, patterns, helpers } = opts;
  const params = new URLSearchParams(location.search);
  const touch = navigator.maxTouchPoints > 0;
  const qParam = params.get('q');
  let qi = qParam === 'low' ? 0 : qParam === 'med' ? 1 : qParam === 'high' ? 2 : (touch ? 1 : 2);
  const qPinned = !!qParam;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x010208, 1);
  renderer.info.autoReset = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 8, 140000);
  scene.add(camera);

  const composerTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: QUALITY[qi].msaa });
  const composer = new EffectComposer(renderer, composerTarget);
  composer.addPass(new RenderPass(scene, camera));
  // Safety net: clamp HDR and drop NaNs before bloom can smear them across the frame.
  composer.addPass(new ShaderPass({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { vec3 c = texture2D(tDiffuse, vUv).rgb; if (any(isnan(c))) c = vec3(0.0); gl_FragColor = vec4(clamp(c, 0.0, 40.0), 1.0); }'
  }));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.62, 0.45, 0.86);
  composer.addPass(bloom);
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);
  composer.addPass(new OutputPass());

  const fx2d = fxCanvas.getContext('2d');

  // ---- colour helpers -----------------------------------------------------
  const colorCache = new Map();
  function lin(hex) {
    let c = colorCache.get(hex);
    if (!c) {
      c = new THREE.Color(hex);
      colorCache.set(hex, c);
    }
    return c;
  }
  const rgbCache = new Map();
  function linRgb(str) {
    let c = rgbCache.get(str);
    if (!c) {
      const [r, g, b] = str.split(',').map(v => parseFloat(v) / 255);
      c = new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
      rgbCache.set(str, c);
    }
    return c;
  }
  const arr = c => [c.r, c.g, c.b];

  // ---- lights ---------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0x8fa6ff, 0x1a0820, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.75);
  key.position.set(-0.35, 1, 0.75);
  scene.add(key);
  const rimPink = new THREE.DirectionalLight(0xff3df2, 1.6);
  rimPink.position.set(-1, 0.25, -0.6);
  scene.add(rimPink);
  const rimCyan = new THREE.DirectionalLight(0x35f4ff, 1.5);
  rimCyan.position.set(1, 0.3, -0.5);
  scene.add(rimCyan);
  const flashLights = [];
  for (let i = 0; i < 4; i++) {
    const l = new THREE.PointLight(0xffffff, 0, 520, 1.25);
    l.userData = { life: 0, max: 1, peak: 0 };
    scene.add(l);
    flashLights.push(l);
  }
  let flashCursor = 0;
  function flashLight(x, y, h, hex, peak, life) {
    const l = flashLights[flashCursor++ % flashLights.length];
    l.position.set(wx(x), h, wz(y));
    l.color.copy(lin(hex));
    l.userData.life = life;
    l.userData.max = life;
    l.userData.peak = peak;
    l.intensity = peak;
  }

  // ---- coordinates ------------------------------------------------------------
  function wx(x) { return x - game.width / 2; }
  function wz(y) { return y - game.height / 2; }

  // ---- backdrop: baked nebula cube, planet, rings, dust ---------------------------
  const skyScene = new THREE.Scene();
  const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false }));
  skyScene.add(skyMesh);
  const cubeRT = new THREE.WebGLCubeRenderTarget(touch ? 768 : 1024, { type: THREE.HalfFloatType, generateMipmaps: false });
  const cubeCam = new THREE.CubeCamera(1, 100, cubeRT);
  cubeCam.update(renderer, skyScene);
  skyMesh.geometry.dispose();
  skyMesh.material.dispose();
  scene.background = cubeRT.texture;

  const planetGroup = new THREE.Group();
  scene.add(planetGroup);
  const planetMat = new THREE.ShaderMaterial({ vertexShader: PLANET_VERT, fragmentShader: PLANET_FRAG, uniforms: { uSun: { value: new THREE.Vector3(0, -1, 0) }, uTime: { value: 0 } } });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), planetMat);
  planetGroup.add(planet);
  const haloMat = new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: HALO_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uColor: { value: new THREE.Color(0.25, 0.75, 1.6) }, uSunScreen: { value: new THREE.Vector2(0, -1) } } });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), haloMat);
  const ringMat = new THREE.ShaderMaterial({ vertexShader: RING_VERT, fragmentShader: RING_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: { uSun: { value: new THREE.Vector3() }, uInner: { value: 0.6 } } });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ringMat);
  planetGroup.add(ring);

  const dustMat = new THREE.ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: DUST_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uProj: { value: 600 }, uMinZ: { value: -1200 }, uRangeZ: { value: 2600 } }
  });
  let dust = null;
  function buildDust() {
    if (dust) { scene.remove(dust); dust.geometry.dispose(); }
    const count = Math.round(520 * QUALITY[qi].dust);
    const W = game.width, H = game.height;
    const pos = new Float32Array(count * 3), seed = new Float32Array(count), col = new Float32Array(count * 3);
    const cyan = lin(colors.player), pink = lin(colors.enemy);
    for (let i = 0; i < count; i++) {
      const deep = Math.random();
      pos[i * 3] = rand(-1.9, 1.9) * W;
      pos[i * 3 + 1] = lerp(PLATE_Y - 50, -1700, deep * deep);
      pos[i * 3 + 2] = rand(-1.4, 1.4) * H;
      seed[i] = Math.random();
      const c = Math.random() > 0.78 ? pink : Math.random() > 0.5 ? cyan : lin('#d8e8ff');
      const k = 0.5 + Math.random() * 0.9;
      col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e9);
    dustMat.uniforms.uMinZ.value = -1.4 * H;
    dustMat.uniforms.uRangeZ.value = 2.8 * H;
    dust = new THREE.Points(g, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);
  }

  // ---- arena plate + side pylons ---------------------------------------------
  const plateMat = new THREE.ShaderMaterial({
    vertexShader: PLATE_VERT,
    fragmentShader: PLATE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: { uTime: { value: 0 }, uHalf: { value: new THREE.Vector2(300, 480) }, uPulse: { value: new THREE.Vector3() } }
  });
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), plateMat);
  plate.rotation.x = -Math.PI / 2;
  plate.position.y = PLATE_Y;
  plate.renderOrder = 1;
  scene.add(plate);

  const pylonMat = voxelMaterial({ glow: 0.6 });
  const pylons = new THREE.InstancedMesh(unitBox(), pylonMat, 64);
  pylons.frustumCulled = false;
  scene.add(pylons);
  function layoutArena() {
    const W = game.width, H = game.height;
    const margin = 260;
    plate.scale.set(W + margin * 2, H + margin * 2, 1);
    plateMat.uniforms.uHalf.value.set(W / 2 + 14, H / 2 + 14);
    let n = 0;
    const m = new THREE.Matrix4();
    const steps = Math.max(4, Math.round(H / 110));
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i <= steps && n < 64; i++) {
        const z = -H / 2 + (H * i) / steps;
        m.compose(new THREE.Vector3(side * (W / 2 + 24), PLATE_Y + 13, z), new THREE.Quaternion(), new THREE.Vector3(3.5, 26, 3.5));
        pylons.setMatrixAt(n, m);
        pylons.setColorAt(n, lin(i % 3 ? colors.player : colors.enemy));
        n++;
      }
    }
    pylons.count = n;
    pylons.instanceMatrix.needsUpdate = true;
    if (pylons.instanceColor) pylons.instanceColor.needsUpdate = true;
  }

  // ---- invaders --------------------------------------------------------------
  const invMat = voxelMaterial({ glow: 0.26, roughness: 0.34, metalness: 0.28 });
  const invModels = {};
  const invMeshes = {};
  const INV_CAP = 220;
  for (const kind of ['diver', 'striker', 'drone']) {
    for (let frame = 0; frame < 2; frame++) {
      const pattern = patterns.invaderSprites[kind][frame];
      const model = voxelModel(pattern, {
        depthBase: 1.1,
        depthStep: 0.55,
        depthMax: 2.9,
        extras: [
          { x: -1.95, y: 0.1, z: 1.05, w: 1.25, h: 0.95, d: 1.2, color: null, hot: 1 },
          { x: 1.95, y: 0.1, z: 1.05, w: 1.25, h: 0.95, d: 1.2, color: null, hot: 1 }
        ]
      });
      const keyName = kind + frame;
      invModels[keyName] = model;
      const mesh = new THREE.InstancedMesh(model.geometry, invMat, INV_CAP);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.setColorAt(0, new THREE.Color(1, 1, 1));
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.count = 0;
      scene.add(mesh);
      invMeshes[keyName] = mesh;
    }
  }

  // ---- debris (voxel shatter) --------------------------------------------------
  const debrisMat = voxelMaterial({ glow: 1.3, roughness: 0.4, metalness: 0.1 });
  const DEBRIS_MAX = 1500;
  const debrisMesh = new THREE.InstancedMesh(unitBox(), debrisMat, DEBRIS_MAX);
  debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  debrisMesh.setColorAt(0, new THREE.Color(1, 1, 1));
  debrisMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  debrisMesh.frustumCulled = false;
  debrisMesh.count = 0;
  scene.add(debrisMesh);
  const D = {
    n: 0,
    p: new Float32Array(DEBRIS_MAX * 3),
    v: new Float32Array(DEBRIS_MAX * 3),
    r: new Float32Array(DEBRIS_MAX * 3),
    w: new Float32Array(DEBRIS_MAX * 3),
    c: new Float32Array(DEBRIS_MAX * 3),
    s: new Float32Array(DEBRIS_MAX),
    life: new Float32Array(DEBRIS_MAX),
    max: new Float32Array(DEBRIS_MAX),
    cursor: 0
  };
  let debrisThisFrame = 0;
  function spawnDebris(x, y, z, vx, vy, vz, size, color, life) {
    const cap = QUALITY[qi].debris;
    let i;
    if (D.n < cap) i = D.n++;
    else { i = D.cursor; D.cursor = (D.cursor + 1) % cap; }
    D.p[i * 3] = x; D.p[i * 3 + 1] = y; D.p[i * 3 + 2] = z;
    D.v[i * 3] = vx; D.v[i * 3 + 1] = vy; D.v[i * 3 + 2] = vz;
    D.r[i * 3] = rand(0, TAU); D.r[i * 3 + 1] = rand(0, TAU); D.r[i * 3 + 2] = rand(0, TAU);
    D.w[i * 3] = rand(-14, 14); D.w[i * 3 + 1] = rand(-14, 14); D.w[i * 3 + 2] = rand(-14, 14);
    D.c[i * 3] = color.r; D.c[i * 3 + 1] = color.g; D.c[i * 3 + 2] = color.b;
    D.s[i] = size;
    D.life[i] = life;
    D.max[i] = life;
    debrisThisFrame++;
  }
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();
  const _v = new THREE.Vector3();
  const _v2 = new THREE.Vector3();
  const _s = new THREE.Vector3();
  const _c = new THREE.Color();
  function updateDebris(dt) {
    const g = 640;
    let live = 0;
    const cap = Math.min(D.n, DEBRIS_MAX);
    for (let i = 0; i < cap; i++) {
      if (D.life[i] <= 0) continue;
      D.life[i] -= dt;
      if (D.life[i] <= 0) continue;
      const k = i * 3;
      D.v[k + 1] -= g * dt;
      const drag = Math.pow(0.55, dt);
      D.v[k] *= drag; D.v[k + 2] *= drag;
      D.p[k] += D.v[k] * dt; D.p[k + 1] += D.v[k + 1] * dt; D.p[k + 2] += D.v[k + 2] * dt;
      const floor = PLATE_Y + D.s[i] * 0.5;
      const onPlate = Math.abs(D.p[k]) < game.width / 2 + 14 && Math.abs(D.p[k + 2]) < game.height / 2 + 14;
      if (onPlate && D.p[k + 1] < floor && D.v[k + 1] < 0) {
        D.p[k + 1] = floor;
        D.v[k + 1] *= -0.38;
        D.v[k] *= 0.72; D.v[k + 2] *= 0.72;
        D.w[k] *= 0.6; D.w[k + 1] *= 0.6; D.w[k + 2] *= 0.6;
      }
      D.r[k] += D.w[k] * dt; D.r[k + 1] += D.w[k + 1] * dt; D.r[k + 2] += D.w[k + 2] * dt;
      const t = D.life[i] / D.max[i];
      const size = D.s[i] * Math.min(1, t * 3.2);
      _q.setFromEuler(_e.set(D.r[k], D.r[k + 1], D.r[k + 2]));
      _m.compose(_v.set(D.p[k], D.p[k + 1], D.p[k + 2]), _q, _s.set(size, size, size));
      debrisMesh.setMatrixAt(live, _m);
      const heat = 0.55 + 1.9 * t * t;
      _c.setRGB(D.c[k] * heat + t * t * 0.6, D.c[k + 1] * heat + t * t * 0.5, D.c[k + 2] * heat + t * t * 0.4);
      debrisMesh.setColorAt(live, _c);
      live++;
    }
    debrisMesh.count = live;
    if (live) {
      debrisMesh.instanceMatrix.clearUpdateRanges();
      debrisMesh.instanceMatrix.addUpdateRange(0, live * 16);
      debrisMesh.instanceMatrix.needsUpdate = true;
      debrisMesh.instanceColor.clearUpdateRanges();
      debrisMesh.instanceColor.addUpdateRange(0, live * 3);
      debrisMesh.instanceColor.needsUpdate = true;
    }
  }
  // Explode a voxel model (local voxel list) placed by `matrix`.
  function shatterModel(model, matrix, scale, color, opts = {}) {
    const budget = opts.budget ?? 90;
    const stride = Math.max(1, Math.ceil(model.voxels.length / budget), debrisThisFrame > 500 ? 3 : 1);
    const center = _v2.setFromMatrixPosition(matrix);
    const cx = center.x, cy = center.y, cz = center.z;
    const force = opts.force ?? 1;
    const hot = lin('#ffffff');
    for (let i = 0; i < model.voxels.length; i += stride) {
      const vox = model.voxels[i];
      _v.set(vox.x, vox.y, vox.z).applyMatrix4(matrix);
      let dx = _v.x - cx, dy = _v.y - cy, dz = _v.z - cz;
      const len = Math.hypot(dx, dy, dz) || 1;
      dx /= len; dy /= len; dz /= len;
      const sp = rand(70, 250) * force;
      const c = vox.hot ? hot : vox.color ? _c.setRGB(vox.color[0], vox.color[1], vox.color[2]) : color;
      spawnDebris(_v.x, _v.y, _v.z, dx * sp + rand(-40, 40) + (opts.vx || 0), dy * sp + rand(90, 260) * force, dz * sp + rand(-40, 40) + (opts.vz || 0), scale * vox.s * (stride > 1 ? 1.25 : 1), c.clone ? c.clone() : c, rand(1.0, 1.9) * (opts.life || 1));
    }
  }

  // ---- bunkers -------------------------------------------------------------------
  const shieldMat = voxelMaterial({ glow: 0.28, roughness: 0.25, metalness: 0.35 });
  const shieldMesh = new THREE.InstancedMesh(unitBox(), shieldMat, 600);
  shieldMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shieldMesh.setColorAt(0, new THREE.Color(1, 1, 1));
  shieldMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  shieldMesh.frustumCulled = false;
  shieldMesh.count = 0;
  scene.add(shieldMesh);

  // ---- player ship -----------------------------------------------------------------
  const cyan = arr(lin(colors.player));
  const gold = arr(lin(colors.gold));
  const playerModel = voxelModel(patterns.playerPattern, {
    depthBase: 1.0,
    depthStep: 0.4,
    depthMax: 2.4,
    centerBoost: 1.6,
    color: (c, r) => ((r === 7 || r === 8) && (c === 2 || c === 3 || c === 9 || c === 10)) ? gold : cyan,
    hot: (c, r) => (r === 3 && (c === 5 || c === 7)) ? 1 : 0,
    extras: [
      { x: -3.5, y: -1.7, z: 0.8, w: 2, h: 1.4, d: 1.6, color: gold, hot: 0 },
      { x: 3.5, y: -1.7, z: 0.8, w: 2, h: 1.4, d: 1.6, color: gold, hot: 0 },
      { x: 0, y: 2.0, z: 1.25, w: 1.6, h: 1.4, d: 1.2, color: null, hot: 1 }
    ]
  });
  playerModel.geometry.rotateX(-Math.PI / 2);
  for (const v of playerModel.voxels) { const y = v.y; v.y = v.z; v.z = -y; }
  const playerMat = voxelMaterial({ glow: 0.4, vertexColors: true, roughness: 0.28, metalness: 0.45 });
  const playerMesh = new THREE.Mesh(playerModel.geometry, playerMat);
  scene.add(playerMesh);

  const bubbleMat = new THREE.ShaderMaterial({
    vertexShader: FRESNEL_VERT,
    fragmentShader: FRESNEL_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color() }, uAlpha: { value: 0.5 }, uTime: { value: 0 }, uHex: { value: 0.22 }, uHit: { value: 0 } }
  });
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), bubbleMat);
  bubble.renderOrder = 15;
  scene.add(bubble);
  const odRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 8, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.gold).multiplyScalar(3.2) }));
  odRing.rotation.x = -Math.PI / 2;
  scene.add(odRing);
  const odRing2 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 6, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.gold).multiplyScalar(2.2) }));
  scene.add(odRing2);

  // ---- boss -------------------------------------------------------------------------
  const BOSS_BODY = { carrier: colors.enemy2, interceptor: colors.enemy3, bulwark: colors.player };
  const bossModels = {};
  function bossModel(kind) {
    if (bossModels[kind]) return bossModels[kind];
    const body = arr(lin(BOSS_BODY[kind]));
    const pink = arr(lin(colors.enemy));
    const red = arr(lin(colors.enemy3));
    const accent = (c, r) => {
      if (r >= 2 && r <= 3 && c >= 10 && c <= 13) return pink;
      if (r === 7 && ((c >= 4 && c <= 6) || (c >= 17 && c <= 19))) return pink;
      if (r === 9 && ((c >= 2 && c <= 4) || (c >= 19 && c <= 21))) return red;
      return body;
    };
    const model = voxelModel(patterns.bossPattern, {
      depthBase: 1.3,
      depthStep: 0.7,
      depthMax: 4.2,
      color: accent,
      hot: (c, r) => (r === 4 && (c === 11 || c === 12)) ? 1 : 0,
      extras: kind === 'interceptor'
        ? [{ x: -13.5, y: 1, z: 0, w: 3, h: 1, d: 1.2, color: red, hot: 0 }, { x: 13.5, y: 1, z: 0, w: 3, h: 1, d: 1.2, color: red, hot: 0 }]
        : kind === 'bulwark'
          ? [{ x: 0, y: 6.4, z: 0, w: 8, h: 1.2, d: 3.4, color: body, hot: 0 }, { x: 0, y: -0.5, z: 2.4, w: 3.2, h: 3.2, d: 1.2, color: pink, hot: 0 }]
          : [{ x: 0, y: 0.5, z: 2.2, w: 4, h: 1.2, d: 1, color: pink, hot: 0 }]
    });
    const mat = voxelMaterial({ glow: 0.42, vertexColors: true, roughness: 0.3, metalness: 0.4 });
    const mesh = new THREE.Mesh(model.geometry, mat);
    mesh.visible = false;
    scene.add(mesh);
    bossModels[kind] = { model, mesh, mat };
    return bossModels[kind];
  }
  const bossDome = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), new THREE.ShaderMaterial({
    vertexShader: FRESNEL_VERT,
    fragmentShader: FRESNEL_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(colors.player) }, uAlpha: { value: 0.6 }, uTime: { value: 0 }, uHex: { value: 1 }, uHit: { value: 0 } }
  }));
  bossDome.renderOrder = 15;
  scene.add(bossDome);
  const turretGeo = new THREE.CylinderGeometry(1, 1, 1, 6);
  turretGeo.setAttribute('aHot', new THREE.Float32BufferAttribute(new Float32Array(turretGeo.attributes.position.count), 1));
  const turretMeshes = [0, 1, 2, 3].map(() => {
    const m = new THREE.Mesh(turretGeo, voxelMaterial({ glow: 1, color: 0xffffff, metalness: 0.5, roughness: 0.3 }));
    m.visible = false;
    scene.add(m);
    return m;
  });
  const bossState = { lastX: 0, roll: 0, kind: null };

  // ---- power cores ----------------------------------------------------------------------
  const coreGeos = {};
  function shapeFromPoints(pts) {
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, -y) : s.moveTo(x, -y)));
    s.closePath();
    return s;
  }
  function rectShape(x, y, w, h) { return shapeFromPoints([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]); }
  function iconShapes(type, s) {
    if (type === 'spread') {
      return [-0.65, 0, 0.65].map(a => {
        const pts = [[0, -s], [s * 0.36, s * 0.55], [0, s * 0.2], [-s * 0.36, s * 0.55]];
        return shapeFromPoints(pts.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]));
      });
    }
    if (type === 'laser') return [rectShape(-s * 0.16, -s, s * 0.32, s * 2), rectShape(-s * 0.72, -s * 0.16, s * 1.44, s * 0.32)];
    if (type === 'repair') return [rectShape(-s * 0.22, -s, s * 0.44, s * 2), rectShape(-s, -s * 0.22, s * 2, s * 0.44)];
    if (type === 'overdrive') return [shapeFromPoints([[-0.12, -1], [0.5, -0.1], [0.08, -0.1], [0.32, 1], [-0.5, 0.05], [-0.06, 0.05]].map(([x, y]) => [x * s, y * s]))];
    if (type === 'shield') {
      const hex = r => Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + i / 6 * TAU; return [Math.cos(a) * r * 0.86, Math.sin(a) * r]; });
      const outer = shapeFromPoints(hex(s));
      outer.holes.push(new THREE.Path(hex(s * 0.68).map(([x, y]) => new THREE.Vector2(x, -y))));
      return [outer, shapeFromPoints(hex(s * 0.42))];
    }
    const bomb = new THREE.Shape();
    bomb.absarc(0, -s * 0.18, s * 0.72, 0, TAU, false);
    return [bomb, rectShape(s * 0.18, -s * 0.9, s * 0.24, s * 0.55)];
  }
  function coreGeometry(type) {
    if (coreGeos[type]) return coreGeos[type];
    const g = new THREE.ExtrudeGeometry(iconShapes(type, 9.5), { depth: 3.5, bevelEnabled: true, bevelThickness: 0.9, bevelSize: 0.7, bevelSegments: 1, curveSegments: 10 });
    g.center();
    g.setAttribute('aHot', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count), 1));
    coreGeos[type] = g;
    return g;
  }
  const starShape = (() => {
    const pts = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; const r = i % 2 ? 11 : 17; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    const outer = shapeFromPoints(pts);
    outer.holes.push(new THREE.Path(pts.map(([x, y]) => new THREE.Vector2(x * 0.82, -y * 0.82)).reverse()));
    return outer;
  })();
  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 2, bevelEnabled: false });
  starGeo.center();
  starGeo.setAttribute('aHot', new THREE.Float32BufferAttribute(new Float32Array(starGeo.attributes.position.count), 1));
  const corePool = [];
  function coreObject(i) {
    if (!corePool[i]) {
      const group = new THREE.Group();
      const iconMat = voxelMaterial({ glow: 1.5, metalness: 0.4, roughness: 0.25 });
      const icon = new THREE.Mesh(coreGeometry('spread'), iconMat);
      const star = new THREE.Mesh(starGeo, voxelMaterial({ glow: 1.1, metalness: 0.5, roughness: 0.3 }));
      group.add(icon, star);
      scene.add(group);
      corePool[i] = { group, icon, star, type: null };
    }
    return corePool[i];
  }

  // ---- effects batch + stage-only effects ---------------------------------------------------
  const fx = new FxBatch(3600);
  scene.add(fx.mesh);
  const localRings = [];
  const sparks = [];
  function addRing(x, y, h, maxR, hex, life, width) {
    localRings.push({ x, y, h, r: 0, maxR, c: lin(hex), life, max: life, width: width || 0.12 });
    if (localRings.length > 40) localRings.shift();
  }
  function pulsePlate(hex, k) {
    const c = lin(hex);
    plateMat.uniforms.uPulse.value.set(c.r * k, c.g * k, c.b * k);
  }

  // ---- title-screen showcase formation ------------------------------------------------------
  const showcase = [];
  function buildShowcase() {
    showcase.length = 0;
    const W = game.width, H = game.height;
    const cols = game.compact ? 6 : 8;
    const rowsKinds = ['diver', 'striker', 'striker', 'drone', 'drone'];
    const sx = Math.min(70, W / (cols + 1));
    const sy = 46;
    for (let r = 0; r < rowsKinds.length; r++) {
      for (let c = 0; c < cols; c++) {
        let type = rowsKinds[r];
        if (type === 'drone' && (c + r) % 5 === 0) type = 'splitter';
        showcase.push({ x: W / 2 + (c - (cols - 1) / 2) * sx, y: H * 0.17 + r * sy, baseX: W / 2 + (c - (cols - 1) / 2) * sx, type, zealot: type === 'diver' && c % 3 === 1, col: c, row: r, r: 15, divePhase: null });
      }
    }
  }

  // ---- camera fit ------------------------------------------------------------------------------
  const view = { vw: 1, vh: 1, pitch: 0.95, dist: 1500, lookZ: 0, face: 0.8, scale: 1 };
  const fitV = new THREE.Vector3();
  function placeCamera(pitch, dist, lookZ, sx = 0, sy = 0, yaw = 0) {
    const cx = Math.sin(yaw) * Math.cos(pitch) * dist;
    const cz = Math.cos(yaw) * Math.cos(pitch) * dist;
    camera.position.set(cx + sx, Math.sin(pitch) * dist + sy, lookZ + cz);
    camera.up.set(0, 1, 0);
    camera.lookAt(sx * 0.45, sy * 0.3, lookZ);
    camera.updateMatrixWorld(true);
  }
  function ndc(x, y, z) { return fitV.set(x, y, z).project(camera); }
  function fitCamera() {
    const W = game.width, H = game.height, vw = view.vw, vh = view.vh;
    const hud = document.querySelector('.hud');
    const hudBottom = hud ? hud.getBoundingClientRect().bottom : 70;
    const top = 1 - 2 * Math.max(vh * 0.04, hudBottom + 6) / vh;
    const screenTop = 1 - 2 * 4 / vh;
    const bottom = -1 + 2 * (vh * 0.012) / vh;
    const side = 1 - 2 * (touch ? 10 : 8) / vw;
    const corners = [[-W / 2, 0, -H / 2], [W / 2, 0, -H / 2], [-W / 2, 0, H / 2], [W / 2, 0, H / 2]];
    const raised = [[-W * 0.2, BOSS_Y + 48, -H / 2 + 40], [W * 0.2, BOSS_Y + 48, -H / 2 + 40]];
    const fits = () => corners.every(([x, y, z]) => { const p = ndc(x, y, z); return p.z < 1 && Math.abs(p.x) <= side && p.y <= top && p.y >= bottom; })
      && raised.every(([x, y, z]) => ndc(x, y, z).y <= screenTop);
    let best = null;
    for (let deg = 60; deg <= 78; deg += 2) {
      const pitch = deg * Math.PI / 180;
      let lookZ = 0, dist = 1500, yTop = 0, yBot = 0;
      for (let it = 0; it < 6; it++) {
        let lo = 50, hi = 40000;
        for (let k = 0; k < 30; k++) {
          const mid = (lo + hi) / 2;
          placeCamera(pitch, mid, lookZ);
          if (fits()) hi = mid; else lo = mid;
        }
        dist = hi;
        placeCamera(pitch, dist, lookZ);
        yTop = ndc(0, 0, -H / 2).y;
        yBot = ndc(0, 0, H / 2).y;
        const err = (yTop + yBot) / 2 - (top + bottom) / 2;
        lookZ -= err * H * 0.35;
      }
      const coverage = (yTop - yBot) / (top - bottom);
      const candidate = { pitch, dist, lookZ, coverage };
      if (!best || coverage > best.coverage) best = candidate;
      if (coverage >= 0.9) { best = candidate; break; }
    }
    view.pitch = best.pitch;
    view.dist = best.dist;
    view.lookZ = best.lookZ;
    view.face = best.pitch * 0.8;
    placeCamera(view.pitch, view.dist, view.lookZ);
    // world px -> screen px at the player's depth (used for UI sizes)
    const a = ndc(0, 0, H / 2 - 60).clone();
    const b = ndc(100, 0, H / 2 - 60);
    view.scale = Math.abs(b.x - a.x) / 2 * vw / 100;
    placePlanet();
  }
  function placePlanet() {
    const e = camera.matrixWorld.elements;
    const right = new THREE.Vector3(e[0], e[1], e[2]);
    const up = new THREE.Vector3(e[4], e[5], e[6]);
    const fwd = new THREE.Vector3(-e[8], -e[9], -e[10]);
    const vHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const hHalf = vHalf * camera.aspect;
    const dir = fwd.clone().addScaledVector(up, vHalf * 0.78).addScaledVector(right, hHalf * 0.62).normalize();
    const D = 60000;
    const R = D * vHalf * 0.36;
    planet.position.copy(camera.position).addScaledVector(dir, D);
    planet.scale.setScalar(R);
    const sun = dir.clone().multiplyScalar(0.7).addScaledVector(up, 0.25).addScaledVector(right, 0.65).normalize();
    planetMat.uniforms.uSun.value.copy(sun);
    halo.position.copy(planet.position);
    halo.scale.setScalar(R);
    halo.quaternion.copy(camera.quaternion);
    haloMat.uniforms.uSunScreen.value.set(0.85, 0.35).normalize();
    ring.position.copy(planet.position);
    ring.scale.setScalar(R * 2.1);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0.18, 0.95, 0.25).normalize());
    ringMat.uniforms.uInner.value = 1.35 / 2.1;
  }

  // ---- sizing / quality -------------------------------------------------------------------------
  let lastLayoutKey = '';
  function applyQuality() {
    const q = QUALITY[qi];
    const vw = view.vw, vh = view.vh;
    let dpr = Math.min(q.dpr, window.devicePixelRatio || 1);
    if (vw * vh * dpr * dpr > q.budget) dpr = Math.max(0.6, Math.sqrt(q.budget / (vw * vh)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(vw, vh, false);
    if (composerTarget.samples !== q.msaa) {
      composer.renderTarget1.samples = q.msaa;
      composer.renderTarget2.samples = q.msaa;
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
    }
    composer.setPixelRatio(dpr);
    composer.setSize(vw, vh);
    grade.uniforms.uRes.value.set(vw * dpr, vh * dpr);
    dustMat.uniforms.uProj.value = (vh * dpr / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    view.dpr = dpr;
  }
  function resize(vw, vh) {
    view.vw = Math.max(1, vw);
    view.vh = Math.max(1, vh);
    camera.aspect = view.vw / view.vh;
    camera.updateProjectionMatrix();
    applyQuality();
    const fxDpr = Math.min(2, window.devicePixelRatio || 1);
    fxCanvas.width = Math.round(view.vw * fxDpr);
    fxCanvas.height = Math.round(view.vh * fxDpr);
    fx2d.setTransform(fxDpr, 0, 0, fxDpr, 0, 0);
    fitCamera();
    const layoutKey = game.width + 'x' + game.height + ':' + qi;
    if (layoutKey !== lastLayoutKey) {
      lastLayoutKey = layoutKey;
      layoutArena();
      buildDust();
      buildShowcase();
    }
  }

  // ---- projection helpers -----------------------------------------------------------------------
  const projV = new THREE.Vector3();
  function project(x, y, h = 0) {
    projV.set(wx(x), h, wz(y)).project(camera);
    return { x: (projV.x + 1) / 2 * view.vw, y: (1 - projV.y) / 2 * view.vh };
  }
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -PLAYER_Y);
  const hit = new THREE.Vector3();
  function pointerToGameX(clientX, clientY) {
    const nx = clientX / view.vw * 2 - 1;
    const ny = 1 - clientY / view.vh * 2;
    ray.setFromCamera({ x: nx, y: ny }, camera);
    if (!ray.ray.intersectPlane(plane, hit)) return game.width / 2;
    return hit.x + game.width / 2;
  }
  function fieldScreen() {
    const l = project(0, game.height, 0);
    const r = project(game.width, game.height, 0);
    return { left: l.x, right: r.x };
  }

  // ---- per-frame state ----------------------------------------------------------------------------
  let clock = 0;
  let aberr = 0;
  let bubbleHit = 0;
  let flashVis = 0;
  let introBlend = 0;
  const perf = { acc: 0, frames: 0, window: 0, bad: 0, fps: 60 };
  const facingQ = new THREE.Quaternion();
  const tmpQ = new THREE.Quaternion();
  const xAxis = new THREE.Vector3(1, 0, 0);

  function invPixel(inv) { return inv.type === 'mini' ? 2.1 : inv.type === 'splitter' ? 3.35 : inv.type === 'drone' ? 3 : 3.1; }
  function invKind(inv) { return inv.type === 'striker' ? 'striker' : inv.type === 'diver' ? 'diver' : 'drone'; }
  function invColorHex(inv) {
    if (inv.type === 'splitter' || inv.type === 'mini') return colors.bullet;
    if (inv.type === 'drone') return colors.enemy;
    if (inv.type === 'striker') return colors.enemy2;
    return inv.zealot ? colors.fire : colors.enemy3;
  }

  // Compose an invader's world matrix (also stored on the invader for shatter effects).
  function invaderMatrix(inv, t, out) {
    let bobX = 0, bobY = 0, scale = 1, hOff = 0, roll = 0, yaw = 0, pitchExtra = 0;
    if (!inv.divePhase) {
      if (inv.type === 'striker') {
        bobX = Math.sin(t * 9 + inv.col * 1.7) * 2.3;
        bobY = Math.cos(t * 7 + inv.row) * 1.1;
      } else if (inv.type === 'diver') {
        scale = 1 + Math.sin(t * 7.5 + inv.col) * 0.055;
        bobY = Math.sin(t * 5 + inv.col) * 1.4;
      }
      hOff = Math.sin(t * 2.1 + inv.col * 0.9 + inv.row * 1.3) * 2.2;
      yaw = Math.sin(t * 1.4 + inv.col * 0.7 + inv.row * 0.4) * 0.3;
    } else if (inv.divePhase === 'warning') {
      scale = 1 + Math.sin(t * 28) * 0.08;
      roll = (inv.tilt || 0) * 1.5;
      hOff = 4;
    } else {
      roll = (inv.tilt || 0) * 2.4;
      yaw = (inv.tilt || 0) * 1.6;
      if (inv.divePhase === 'swoop') {
        const span = Math.max(1, (game.player ? game.player.y : game.height) - (inv.diveStartY ?? inv.y));
        const prog = clamp((inv.y - (inv.diveStartY ?? inv.y)) / span, 0, 1);
        hOff = lerp(0, PLAYER_Y - INV_Y + 4, prog) + Math.sin(prog * Math.PI) * 26;
        pitchExtra = prog * 0.55;
      } else if (inv.divePhase === 'return') {
        hOff = 10;
        pitchExtra = -0.25;
      } else {
        hOff = 6;
      }
    }
    const s = invPixel(inv) * scale * 1.2;
    facingQ.setFromAxisAngle(xAxis, -view.face + pitchExtra);
    tmpQ.setFromEuler(_e.set(0, yaw, roll, 'YXZ'));
    facingQ.multiply(tmpQ);
    return out.compose(_v.set(wx(inv.x + bobX), INV_Y + hOff, wz(inv.y + bobY)), facingQ, _s.set(s, s, s));
  }

  function drawInvaders(list, t) {
    for (const k in invMeshes) invMeshes[k].count = 0;
    const white = 1;
    for (const inv of list) {
      const kind = invKind(inv);
      const frame = inv.divePhase ? Math.floor(t * 12) % 2 : game.invaderFrame;
      const mesh = invMeshes[kind + frame];
      if (mesh.count >= INV_CAP) continue;
      if (!inv._m) inv._m = new THREE.Matrix4();
      invaderMatrix(inv, t, inv._m);
      inv._mesh = kind + frame;
      const i = mesh.count++;
      mesh.setMatrixAt(i, inv._m);
      const base = lin(invColorHex(inv));
      const tone = inv.type === 'striker' ? 0.72 : inv.type === 'splitter' || inv.type === 'mini' ? 0.8 : 1;
      inv.hitFlash = Math.max(0, (inv.hitFlash || 0) - 0.06);
      const flash = inv.hitFlash || 0;
      let boost = 1;
      if (inv.divePhase === 'warning') boost = 1.35 + Math.sin(t * 30) * 0.35;
      else if (inv.divePhase === 'swoop') boost = 1.4;
      _c.setRGB(lerp(base.r * boost * tone, white * 2.2, flash), lerp(base.g * boost * tone, white * 2.2, flash), lerp(base.b * boost * tone, white * 2.2, flash));
      mesh.setColorAt(i, _c);
      // floor glow + dive cues
      const X = wx(inv.x), Z = wz(inv.y);
      fx.flat(X, PLATE_Y + 0.5, Z, inv.r * 2.2, base.r, base.g, base.b, 0.1, 3, 0);
      if (inv.zealot || inv.type === 'splitter') {
        const pulse = 0.6 + Math.sin(t * 8 + inv.col) * 0.25;
        _v.setFromMatrixPosition(inv._m);
        fx.sprite(_v.x, _v.y, _v.z, inv.r * 1.6, base.r, base.g, base.b, 0.32 * pulse);
      }
      if (inv.divePhase) drawDiveCue(inv, base, t);
    }
    for (const k in invMeshes) {
      const mesh = invMeshes[k];
      if (!mesh.count) continue;
      mesh.instanceMatrix.clearUpdateRanges();
      mesh.instanceMatrix.addUpdateRange(0, mesh.count * 16);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.clearUpdateRanges();
      mesh.instanceColor.addUpdateRange(0, mesh.count * 3);
      mesh.instanceColor.needsUpdate = true;
    }
  }

  const CUE_PTS = 18;
  function drawDiveCue(inv, base, t) {
    const X = wx(inv.x), Z = wz(inv.y);
    if (inv.divePhase === 'warning') {
      const k = clamp(inv.diveTime / (inv.diveWarning || 0.72), 0, 1);
      const pulse = 0.55 + Math.sin(t * 30) * 0.18;
      fx.flat(X, INV_Y, Z, inv.r + 12 + k * 18, base.r * 2, base.g * 2, base.b * 2, 0.5 + pulse * 0.4, 2, 0.12);
      // dashed approach path toward the player, drawn as glowing beads on the plate
      const p = game.player;
      if (!p) return;
      const tx = wx(p.x), tz = wz(p.y - 10);
      const mx = (X + tx) / 2 + 60 * inv.diveDir, mz = (Z + tz) / 2 - 38;
      for (let i = 1; i < CUE_PTS; i++) {
        const u = i / CUE_PTS;
        if ((i + Math.floor(t * 14)) % 3 === 0) continue;
        const bx = (1 - u) * (1 - u) * X + 2 * (1 - u) * u * mx + u * u * tx;
        const bz = (1 - u) * (1 - u) * Z + 2 * (1 - u) * u * mz + u * u * tz;
        fx.sprite(bx, lerp(INV_Y, PLAYER_Y, u), bz, 3.4, base.r * 2, base.g * 2, base.b * 2, (0.2 + k * 0.5) * (1 - u * 0.4));
      }
    } else if (inv.divePhase === 'swoop' && inv._m) {
      const px = inv.prevX ?? inv.x, py = inv.prevY ?? inv.y;
      _v.setFromMatrixPosition(inv._m);
      const dx = wx(inv.x) - wx(px), dz = wz(inv.y) - wz(py);
      const len = Math.hypot(dx, dz) || 1;
      const trail = 70;
      fx.streak(_v.x - dx / len * trail, _v.y + 2, _v.z - dz / len * trail, _v.x, _v.y, _v.z, 16, [base.r, base.g, base.b, 0], [base.r * 2.4, base.g * 2.4, base.b * 2.4, 0.9]);
      const g = lin(colors.gold);
      fx.streak(_v.x - dx / len * trail * 0.6, _v.y, _v.z - dz / len * trail * 0.6, _v.x, _v.y, _v.z, 6, [g.r, g.g, g.b, 0], [g.r * 3, g.g * 3, g.b * 3, 0.8]);
    } else if (inv.divePhase === 'circle') {
      fx.flat(wx(inv.homeX ?? inv.baseX), INV_Y - 4, wz(inv.homeY ?? inv.baseY), game.compact ? 30 : 40, base.r, base.g, base.b, 0.35, 2, 0.06);
    }
  }

  function drawShields(t) {
    const list = game.shields;
    let n = 0;
    for (const s of list) {
      if (n >= 600) break;
      const ratio = clamp(s.hp / Math.max(1, s.maxHp), 0, 1);
      const flash = s.flash || 0;
      const hex = ratio > 0.66 ? colors.shield : ratio > 0.33 ? colors.gold : colors.enemy3;
      const base = lin(hex);
      const shrink = 1 - (1 - ratio) * 0.18;
      const h = Math.max(s.w, s.h) * 2.1 * (0.4 + 0.6 * ratio);
      _m.compose(_v.set(wx(s.x), SHIELD_Y - (1 - ratio) * 3, wz(s.y)), _q.identity(), _s.set(s.w * shrink, h, s.h * shrink));
      shieldMesh.setMatrixAt(n, _m);
      const k = 0.7 + ratio * 0.2 + flash * 2.2;
      _c.setRGB(base.r * k + flash, base.g * k + flash, base.b * k + flash);
      shieldMesh.setColorAt(n, _c);
      n++;
      if ((n & 3) === 0) fx.flat(wx(s.x), PLATE_Y + 0.5, wz(s.y), s.w * 3.2, base.r, base.g, base.b, 0.07, 3, 0);
    }
    shieldMesh.count = n;
    if (n) {
      shieldMesh.instanceMatrix.clearUpdateRanges();
      shieldMesh.instanceMatrix.addUpdateRange(0, n * 16);
      shieldMesh.instanceMatrix.needsUpdate = true;
      shieldMesh.instanceColor.clearUpdateRanges();
      shieldMesh.instanceColor.addUpdateRange(0, n * 3);
      shieldMesh.instanceColor.needsUpdate = true;
    }
  }

  function playerOffsetZ() {
    const pixel = game.compact ? 3.5 : 4.0;
    return -29.5 + (patterns.playerPattern.length * pixel) / 2;
  }

  function drawPlayer(t, dt) {
    const p = game.player;
    if (!p) { playerMesh.visible = false; bubble.visible = false; odRing.visible = false; odRing2.visible = false; return; }
    const pixel = game.compact ? 3.5 : 4.0;
    const playing = game.state === 'playing' || game.state === 'paused';
    const blink = playing && p.invulnerable > 0 && Math.floor(game.time * 18) % 2 === 0;
    const X = wx(p.x), Z = wz(p.y + playerOffsetZ());
    const hover = Math.sin(clock * 2.4) * 1.6;
    playerMesh.visible = !blink;
    playerMesh.position.set(X, PLAYER_Y + hover, Z);
    const roll = clamp(-p.vx / 680, -1, 1) * 0.62;
    playerMesh.rotation.set(-0.06 + Math.sin(clock * 1.7) * 0.03, clamp(-p.vx / 680, -1, 1) * 0.08, roll, 'YXZ');
    playerMesh.scale.setScalar(pixel);
    playerMesh.updateMatrixWorld();
    // engine flames (three exhausts at the rear)
    const od = game.overdrive > 0;
    const flameCol = lin(od ? colors.gold : colors.fire);
    for (const ex of [-2.9, 0, 2.9]) {
      _v.set(ex, 0, 5.6).applyMatrix4(playerMesh.matrixWorld);
      const len = pixel * (ex === 0 ? 3.4 : 2.5) * (0.75 + Math.sin(clock * 42 + ex) * 0.2) * (od ? 1.5 : 1);
      fx.streak(_v.x, _v.y, _v.z + len * 1.8, _v.x, _v.y, _v.z, pixel * 1.5, [flameCol.r, flameCol.g, flameCol.b, 0], [flameCol.r * 3, flameCol.g * 3, flameCol.b * 3, 1]);
      fx.sprite(_v.x, _v.y, _v.z, pixel * 1.5, flameCol.r * 2, flameCol.g * 2, flameCol.b * 2, 0.6);
    }
    const shipCol = lin(colors.player);
    fx.flat(X, PLATE_Y + 0.5, wz(p.y), 46, shipCol.r, shipCol.g, shipCol.b, 0.45, 3, 0);
    // shield bubble
    bubbleHit = Math.max(0, bubbleHit - dt * 2.5);
    if (p.shield > 0 && playing) {
      const r = helpers.playerShieldRadius();
      bubble.visible = true;
      bubble.position.set(wx(p.x), PLAYER_Y + 2, wz(p.y));
      bubble.scale.set(r, r * 0.62, r);
      bubbleMat.uniforms.uColor.value.copy(lin(p.shield > 40 ? colors.player : colors.red));
      bubbleMat.uniforms.uAlpha.value = clamp(p.shield / 120, 0.18, 0.72) * 0.55;
      bubbleMat.uniforms.uHit.value = bubbleHit;
      bubbleMat.uniforms.uTime.value = clock;
    } else {
      bubble.visible = false;
    }
    odRing.visible = od && playing;
    odRing2.visible = od && playing;
    if (od) {
      const rr = 30 + Math.sin(game.time * 12) * 3;
      odRing.position.set(wx(p.x), PLAYER_Y, wz(p.y));
      odRing.scale.setScalar(rr);
      odRing.rotation.z = clock * 3;
      odRing2.position.copy(odRing.position);
      odRing2.scale.setScalar(rr * 0.8);
      odRing2.rotation.set(clock * 2.3, clock * 1.7, 0);
    }
  }

  function drawBoss(t, dt) {
    const boss = game.boss;
    for (const k in bossModels) bossModels[k].mesh.visible = false;
    bossDome.visible = false;
    turretMeshes.forEach(m => (m.visible = false));
    if (!boss) { bossState.kind = null; return; }
    const entry = bossModel(boss.kind);
    const { mesh, mat } = entry;
    mesh.visible = true;
    const pixel = clamp(4.8 * game.scale, 4, 5.6);
    let introT = 1;
    if (boss.intro > 0) introT = clamp(1 - boss.intro / 1.85, 0, 1);
    const ease = 1 - Math.pow(1 - introT, 3);
    if (bossState.kind !== boss.kind) { bossState.kind = boss.kind; bossState.lastX = boss.x; bossState.roll = 0; }
    const vx = dt > 0 ? (boss.x - bossState.lastX) / dt : 0;
    bossState.lastX = boss.x;
    const targetRoll = clamp(-vx * (boss.kind === 'interceptor' ? 0.0022 : 0.0012), -0.5, 0.5);
    bossState.roll = lerp(bossState.roll, targetRoll, clamp(dt * 5, 0, 1));
    const scale = pixel * 1.2 * (0.82 + ease * 0.18) * (boss.kind === 'interceptor' ? 0.92 : boss.kind === 'bulwark' ? 1.08 : 1);
    facingQ.setFromAxisAngle(xAxis, -view.face);
    tmpQ.setFromEuler(_e.set(0, Math.sin(clock * 0.9) * 0.12, bossState.roll + (boss.intro > 0 ? Math.sin(game.time * 7) * 0.05 * (1 - introT) : 0), 'YXZ'));
    facingQ.multiply(tmpQ);
    const Y = BOSS_Y + (1 - ease) * 340 + Math.sin(clock * 1.3) * 2;
    if (!boss._m) boss._m = new THREE.Matrix4();
    boss._m.compose(_v.set(wx(boss.x), Y, wz(boss.y)), facingQ, _s.set(scale, scale, scale));
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(boss._m);
    mesh.matrixWorld.copy(boss._m);
    boss.hitFlash = Math.max(0, (boss.hitFlash || 0) - dt * 6);
    mat.userData.glow.value = 0.42 + boss.hitFlash * 1.4;
    const body = lin(BOSS_BODY[boss.kind]);
    // engines: flames from the four exhaust ports along the hull's lower edge
    for (const col of [3, 11.5, 20]) {
      _v.set(col - 11.5, -6.2, 0).applyMatrix4(boss._m);
      _v2.set(col - 11.5, -8.6, 0.6).applyMatrix4(boss._m);
      const f = 0.8 + Math.sin(clock * 16 + col) * 0.3;
      const fc = lin(colors.fire);
      fx.streak(_v.x, _v.y, _v.z, lerp(_v.x, _v2.x, f * 1.4), lerp(_v.y, _v2.y, f * 1.4), lerp(_v.z, _v2.z, f * 1.4), pixel * (col === 11.5 ? 2.4 : 1.6), [fc.r * 3, fc.g * 3, fc.b * 3, 1], [fc.r, fc.g, fc.b, 0]);
    }
    fx.flat(wx(boss.x), PLATE_Y + 0.5, wz(boss.y), boss.r * 2.4, body.r, body.g, body.b, 0.5, 3, 0);
    _v.setFromMatrixPosition(boss._m);
    fx.sprite(_v.x, _v.y, _v.z, boss.r * 1.5, body.r, body.g, body.b, 0.12 + boss.hitFlash * 0.4);
    // bulwark energy dome while its turrets stand
    if (boss.kind === 'bulwark' && boss.turrets && boss.turrets.some(tt => !tt.dead) && boss.intro <= 0) {
      bossDome.visible = true;
      bossDome.position.copy(_v);
      bossDome.scale.set(boss.r * 1.45, boss.r * 1.0, boss.r * 1.1);
      bossDome.quaternion.copy(facingQ);
      bossDome.material.uniforms.uTime.value = clock;
      bossDome.material.uniforms.uHit.value = boss.hitFlash * 0.6;
      bossDome.material.uniforms.uAlpha.value = 0.55 + Math.sin(clock * 3) * 0.08;
    }
    // turrets
    const turrets = boss.turrets || [];
    turrets.forEach((tt, i) => {
      const m = turretMeshes[i];
      if (!m) return;
      m.visible = true;
      m.position.set(wx(tt.x), Y + 8, wz(tt.y));
      m.quaternion.setFromAxisAngle(xAxis, Math.PI / 2 - view.face);
      m.rotateY(clock * (tt.dead ? 0 : 1.2));
      m.scale.set(tt.r, 10, tt.r);
      const flash = tt.flash || 0;
      if (tt.dead) {
        m.material.color.setRGB(0.12, 0.05, 0.08);
        m.material.userData.glow.value = 0.05;
        if (Math.random() < dt * 6) sparks.push({ x: tt.x + rand(-6, 6), y: tt.y, h: Y + 12, vx: rand(-10, 10), vy: rand(-30, -10), vh: rand(20, 50), life: 1.2, max: 1.2, c: lin('#6b5a7a'), size: rand(6, 11), smoke: true });
      } else {
        const tc = lin(flash > 0.3 ? '#ffffff' : colors.enemy);
        m.material.color.copy(tc);
        m.material.userData.glow.value = 1 + flash * 2;
        fx.sprite(wx(tt.x), Y + 14, wz(tt.y), tt.r * 0.6, 2, 2, 2, 0.8);
      }
    });
    // beam warning column
    if (boss.warning > 0) {
      const alpha = clamp(boss.warning / 0.82, 0, 1);
      const k = 0.18 + Math.sin(game.time * 42) * 0.08 + (1 - alpha) * 0.25;
      const width = 18 + (1 - alpha) * 18;
      const red = lin(colors.enemy3), g = lin(colors.gold);
      fx.streak(wx(boss.warningX), SHOT_Y, wz(game.height - 18), wx(boss.warningX), SHOT_Y + 4, wz(boss.y + 34), width * 1.6, [g.r * 1.5, g.g * 1.5, g.b * 1.5, k * 2], [red.r * 3, red.g * 3, red.b * 3, k * 3]);
      fx.flat(wx(boss.warningX), PLATE_Y + 0.6, wz(game.height - 60), 26 + (1 - alpha) * 20, red.r * 3, red.g * 3, red.b * 3, 0.9, 2, 0.15);
    }
  }

  function drawBullets() {
    for (const b of game.bullets) {
      const speed = Math.max(1, Math.hypot(b.vx, b.vy));
      const len = b.damage > 1 ? 40 : 30;
      const dx = b.vx / speed * len, dy = b.vy / speed * len;
      const c = lin(b.color);
      const k = b.damage > 1 ? 3.4 : 2.8;
      fx.streak(wx(b.x - dx), SHOT_Y, wz(b.y - dy), wx(b.x), SHOT_Y, wz(b.y), b.damage > 1 ? 9 : 7.5, [c.r, c.g, c.b, 0], [c.r * k, c.g * k, c.b * k, 1]);
      fx.sprite(wx(b.x), SHOT_Y, wz(b.y), b.damage > 1 ? 6.5 : 5.5, c.r * 2, c.g * 2, c.b * 2, 0.9);
    }
    const red = lin(colors.enemy3), gold = lin(colors.gold);
    for (const b of game.enemyBullets) {
      const speed = Math.max(1, Math.hypot(b.vx, b.vy));
      const beam = b.style === 'beam';
      const len = beam ? clamp(speed * 0.2, 70, 96) : clamp(speed * 0.12, 28, 48);
      const dx = b.vx / speed * len, dy = b.vy / speed * len;
      const head = beam ? red : lin(b.color === colors.enemy ? colors.enemy : colors.gold);
      fx.streak(wx(b.x - dx), SHOT_Y + 3, wz(b.y - dy), wx(b.x), SHOT_Y + 3, wz(b.y), beam ? 16 : 11, [red.r, red.g, red.b, 0], [head.r * 3, head.g * 3, head.b * 3, 1]);
      fx.sprite(wx(b.x), SHOT_Y + 3, wz(b.y), (b.r + 2) * 1.5, (beam ? red : gold).r * 2.5, (beam ? red : gold).g * 2.5, (beam ? red : gold).b * 2.5, 1);
      fx.flat(wx(b.x), PLATE_Y + 0.5, wz(b.y), 16, head.r, head.g, head.b, 0.35, 3, 0);
    }
  }

  function drawCores(t) {
    let i = 0;
    for (const core of game.powerups) {
      const o = coreObject(i++);
      if (o.type !== core.type) {
        o.type = core.type;
        o.icon.geometry = coreGeometry(core.type);
        o.icon.material.color.copy(lin(core.color));
        o.star.material.color.copy(lin(core.color));
      }
      o.group.visible = true;
      o.group.position.set(wx(core.x), 22 + Math.sin(core.phase * 0.8) * 3, wz(core.y));
      o.group.quaternion.setFromAxisAngle(xAxis, -view.face * 0.85);
      o.icon.rotation.set(0, Math.sin(core.phase * 0.5) * 0.9, 0);
      o.star.rotation.set(0, -core.phase * 0.35, core.phase * 0.25);
      const c = lin(core.color);
      fx.sprite(wx(core.x), 22, wz(core.y), 26, c.r, c.g, c.b, 0.45);
      fx.flat(wx(core.x), PLATE_Y + 0.5, wz(core.y), 30, c.r, c.g, c.b, 0.45, 3, 0);
    }
    for (; i < corePool.length; i++) corePool[i].group.visible = false;
  }

  function drawParticles() {
    for (const part of game.particles) {
      const c = lin(part.color);
      const a = clamp(part.life * 1.8, 0, 1);
      fx.sprite(wx(part.x), part.h ?? SHOT_Y, wz(part.y), part.r * 2.4, c.r * 2.2, c.g * 2.2, c.b * 2.2, a);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const a = clamp(s.life / s.max, 0, 1);
      if (s.smoke) fx.sprite(wx(s.x), s.h, wz(s.y), s.size * (1.6 - a * 0.6), s.c.r * 0.5, s.c.g * 0.5, s.c.b * 0.5, a * 0.35);
      else fx.sprite(wx(s.x), s.h, wz(s.y), s.size * a, s.c.r * 3, s.c.g * 3, s.c.b * 3, a);
    }
  }

  function drawRings() {
    for (const ring of game.rings) {
      const t = clamp(ring.life / ring.maxLife, 0, 1);
      const c = linRgb(ring.color);
      const w = clamp(ring.width * (0.4 + t * 0.6) * 1.6 / Math.max(8, ring.r), 0.015, 0.35);
      fx.flat(wx(ring.x), SHOT_Y, wz(ring.y), ring.r, c.r * 2.4, c.g * 2.4, c.b * 2.4, t * 0.85, 2, w);
    }
    for (const ring of localRings) {
      const t = clamp(ring.life / ring.max, 0, 1);
      fx.flat(wx(ring.x), ring.h, wz(ring.y), ring.r, ring.c.r * 2.4, ring.c.g * 2.4, ring.c.b * 2.4, t * 0.9, 2, ring.width);
    }
  }

  function stepLocal(dt) {
    for (let i = localRings.length - 1; i >= 0; i--) {
      const r = localRings[i];
      r.life -= dt;
      r.r = r.maxR * (0.15 + (1 - r.life / r.max) * 0.85);
      if (r.life <= 0) localRings.splice(i, 1);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.h += s.vh * dt;
      if (!s.smoke) s.vh -= 300 * dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    if (sparks.length > 260) sparks.splice(0, sparks.length - 260);
    for (const l of flashLights) {
      if (l.userData.life <= 0) { l.intensity = 0; continue; }
      l.userData.life -= dt;
      const k = clamp(l.userData.life / l.userData.max, 0, 1);
      l.intensity = l.userData.peak * k * k;
    }
  }

  // ---- 2D overlay text ---------------------------------------------------------------------------
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  let overlayDirty = true;
  function drawOverlay() {
    const g = fx2d;
    const vw = view.vw, vh = view.vh;
    const need = game.waveBanner || game.pickupLabels.length || game.powerFlash || game.boss || game.showPerf
      || ((game.state === 'playing' || game.state === 'paused') && (game.overdrive > 0 || game.combo > 1.15));
    if (!need && !overlayDirty) return;
    g.clearRect(0, 0, vw, vh);
    overlayDirty = !!need;
    if (!need) return;
    const k = clamp(view.scale, 0.55, 2.2);
    drawBossOverlay(g, k);
    drawWaveBanner(g, k);
    drawPowerFlash(g, k);
    drawLabels(g, k);
    drawComboHud(g, k);
    if (game.showPerf) drawPerf(g);
  }

  function drawWaveBanner(g, k) {
    const banner = game.waveBanner;
    if (!banner) return;
    const t = clamp(banner.life / banner.maxLife, 0, 1);
    const pulse = 0.72 + Math.sin(game.time * 28) * 0.18;
    const h = (banner.subtext ? 86 : 68) * k;
    const yGame = helpers.waveBannerY(banner.subtext ? 86 : 68);
    const y = project(game.width / 2, yGame, INV_Y).y;
    const left = project(0, yGame, INV_Y).x, right = project(game.width, yGame, INV_Y).x;
    const w = right - left;
    const main = banner.boss ? colors.enemy3 : colors.player;
    g.save();
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = clamp(Math.min(1, banner.life * 2) * pulse, 0, 1);
    const grad = g.createLinearGradient(left, 0, right, 0);
    const fill = banner.boss ? '255, 77, 109' : '53, 244, 255';
    grad.addColorStop(0, `rgba(${fill}, 0)`);
    grad.addColorStop(0.2, `rgba(${fill}, 0.16)`);
    grad.addColorStop(0.8, `rgba(${fill}, 0.16)`);
    grad.addColorStop(1, `rgba(${fill}, 0)`);
    g.fillStyle = grad;
    g.fillRect(left - w * 0.15, y - h / 2, w * 1.3, h);
    g.strokeStyle = main;
    g.lineWidth = 2;
    g.shadowColor = main;
    g.shadowBlur = 18;
    g.beginPath();
    const inset = 0.08 + (1 - t) * 0.08;
    g.moveTo(left + w * inset, y - h / 2); g.lineTo(right - w * inset, y - h / 2);
    g.moveTo(left + w * inset, y + h / 2); g.lineTo(right - w * inset, y + h / 2);
    g.stroke();
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `900 ${clamp(game.width * 0.045, 20, 42) * k}px system-ui, sans-serif`;
    g.fillText(banner.text, (left + right) / 2, y - (banner.subtext ? 10 * k : 0));
    if (banner.subtext) {
      g.font = `800 ${clamp(game.width * 0.02, 13, 20) * k}px ${MONO}`;
      g.fillStyle = main;
      g.globalAlpha *= 0.9;
      g.fillText(banner.subtext.toUpperCase(), (left + right) / 2, y + 26 * k);
    }
    g.restore();
  }

  function drawLabels(g, k) {
    if (!game.pickupLabels.length) return;
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `900 ${Math.max(14, Math.min(22, game.width * 0.024)) * k}px ${MONO}`;
    for (const label of game.pickupLabels) {
      const t = clamp(label.life / label.maxLife, 0, 1);
      const pop = 1 + (1 - t) * 0.2;
      const p = project(label.x, label.y, INV_Y + 16);
      g.save();
      g.translate(p.x, p.y);
      g.scale(pop, pop);
      g.globalAlpha = Math.min(1, t * 1.6);
      g.lineWidth = 5;
      g.strokeStyle = 'rgba(0,0,0,0.75)';
      g.strokeText(label.text, 0, 0);
      g.shadowColor = label.color;
      g.shadowBlur = 14;
      g.fillStyle = label.color;
      g.fillText(label.text, 0, 0);
      g.shadowBlur = 0;
      g.fillStyle = '#ffffff';
      g.globalAlpha *= 0.55;
      g.fillText(label.text, 0, -1);
      g.restore();
    }
    g.restore();
  }

  function powerIcon(g, type, color, size) {
    g.save();
    g.fillStyle = color;
    g.strokeStyle = color;
    g.lineWidth = 3;
    g.shadowColor = color;
    g.shadowBlur = 14;
    if (type === 'spread') {
      [-0.65, 0, 0.65].forEach(a => { g.save(); g.rotate(a); g.beginPath(); g.moveTo(0, -size); g.lineTo(size * 0.36, size * 0.55); g.lineTo(0, size * 0.2); g.lineTo(-size * 0.36, size * 0.55); g.closePath(); g.fill(); g.restore(); });
    } else if (type === 'laser') {
      g.fillRect(-size * 0.16, -size, size * 0.32, size * 2); g.fillRect(-size * 0.72, -size * 0.16, size * 1.44, size * 0.32);
    } else if (type === 'shield') {
      g.beginPath();
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i / 6 * TAU; const x = Math.cos(a) * size * 0.86, y = Math.sin(a) * size; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.closePath(); g.stroke(); g.globalAlpha = 0.42; g.fill();
    } else if (type === 'repair') {
      g.fillRect(-size * 0.22, -size, size * 0.44, size * 2); g.fillRect(-size, -size * 0.22, size * 2, size * 0.44);
    } else if (type === 'overdrive') {
      g.beginPath(); g.moveTo(-size * 0.12, -size); g.lineTo(size * 0.5, -size * 0.1); g.lineTo(size * 0.08, -size * 0.1); g.lineTo(size * 0.32, size); g.lineTo(-size * 0.5, size * 0.05); g.lineTo(-size * 0.06, size * 0.05); g.closePath(); g.fill();
    } else if (type === 'bomb') {
      g.beginPath(); g.arc(0, size * 0.18, size * 0.72, 0, TAU); g.fill(); g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(size * 0.24, -size * 0.42); g.lineTo(size * 0.52, -size * 0.86); g.stroke();
    }
    g.restore();
  }

  function drawPowerFlash(g, k) {
    const flash = game.powerFlash;
    if (!flash || !game.player) return;
    const t = clamp(flash.life / flash.maxLife, 0, 1);
    const pop = (1 + (1 - t) * 0.22) * k;
    const p = project(game.player.x, game.player.y - 74, PLAYER_Y + 30);
    g.save();
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = Math.min(1, t * 1.7);
    g.translate(p.x, p.y);
    g.scale(pop, pop);
    g.shadowColor = flash.color;
    g.shadowBlur = 22;
    g.strokeStyle = flash.color;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(0, 0, 30 + (1 - t) * 20, 0, TAU);
    g.stroke();
    g.save(); g.translate(0, -2); powerIcon(g, flash.type, flash.color, 17); g.restore();
    g.font = `900 ${clamp(game.width * 0.023, 14, 22)}px ${MONO}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.globalCompositeOperation = 'source-over';
    g.lineWidth = 5;
    g.strokeStyle = 'rgba(0,0,0,0.72)';
    g.strokeText(flash.text, 0, 46);
    g.fillStyle = flash.color;
    g.fillText(flash.text, 0, 46);
    g.restore();
  }

  function drawComboHud(g, k) {
    if (game.state !== 'playing' && game.state !== 'paused') return;
    const cx = view.vw / 2;
    const y = view.vh - Math.max(26, 30 * k) - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom')) || 0);
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    if (game.overdrive > 0) {
      g.globalCompositeOperation = 'lighter';
      const t = clamp(game.overdrive / (helpers.hasMod('overcharged') ? 6 : 4), 0, 1);
      const barW = Math.min(220 * k, view.vw * 0.5);
      g.fillStyle = 'rgba(255, 255, 255, 0.12)';
      g.fillRect(cx - barW / 2, y + 6 * k, barW, 4);
      g.fillStyle = colors.gold;
      g.shadowColor = colors.gold;
      g.shadowBlur = 12;
      g.fillRect(cx - barW / 2, y + 6 * k, barW * t, 4);
      g.font = `900 ${clamp(game.width * 0.03, 13, 20) * k}px ${MONO}`;
      g.fillText('OVERDRIVE', cx, y - 4 * k);
    } else if (game.combo > 1.15) {
      g.globalAlpha = clamp((game.combo - 1) * 1.4, 0.3, 1);
      g.font = `900 ${clamp(game.width * 0.028, 12, 18) * k}px ${MONO}`;
      g.shadowColor = colors.gold;
      g.shadowBlur = 10;
      g.fillStyle = game.combo > 2.4 ? colors.gold : colors.player;
      g.fillText('COMBO ×' + game.combo.toFixed(1), cx, y);
    }
    g.restore();
  }

  function drawBossOverlay(g, k) {
    const boss = game.boss;
    if (!boss) return;
    const fs = fieldScreen();
    const fieldW = Math.min(view.vw, fs.right - fs.left);
    if (boss.intro > 0) {
      const t = clamp(1 - boss.intro / 1.85, 0, 1);
      g.save();
      g.globalAlpha = 0.3 * (1 - t * 0.25);
      g.fillStyle = 'rgba(1, 2, 8, 0.72)';
      g.fillRect(0, 0, view.vw, view.vh);
      g.globalCompositeOperation = 'lighter';
      g.globalAlpha = 0.2 + Math.sin(game.time * 18) * 0.04;
      g.strokeStyle = colors.enemy3;
      g.lineWidth = 2;
      g.shadowColor = colors.enemy3;
      g.shadowBlur = 24;
      for (let i = 0; i < 9; i++) {
        const yy = view.vh * 0.18 + i * 23 * k;
        g.beginPath();
        g.moveTo(view.vw / 2 - fieldW * 0.32, yy);
        g.lineTo(view.vw / 2 + fieldW * 0.32, yy + Math.sin(game.time * 6 + i) * 5);
        g.stroke();
      }
      g.globalAlpha = 0.85;
      g.shadowBlur = 0;
      g.font = `900 ${clamp(game.width * 0.024, 15, 24) * k}px ${MONO}`;
      g.textAlign = 'center';
      g.fillStyle = '#fff';
      const names = { carrier: 'CARRIER', interceptor: 'INTERCEPTOR', bulwark: 'BULWARK' };
      g.fillText(`WARNING: ${names[boss.kind] || 'CARRIER'} SIGNATURE LOCKED`, view.vw / 2, view.vh * 0.12);
      g.restore();
    }
    // hull bar under the HUD
    const w = Math.min(460 * k, fieldW * 0.6);
    const x = view.vw / 2 - w / 2;
    const hud = document.querySelector('.hud');
    const y = hud ? hud.getBoundingClientRect().bottom + 10 : 64;
    g.save();
    g.fillStyle = 'rgba(255,255,255,0.12)';
    g.fillRect(x, y, w, 6);
    g.fillStyle = colors.enemy2;
    g.shadowColor = colors.enemy2;
    g.shadowBlur = 14;
    g.fillRect(x, y, w * Math.max(0, boss.hp / boss.maxHp), 6);
    g.restore();
    // turret health
    for (const t of boss.turrets || []) {
      if (t.dead || boss.intro > 0) continue;
      const p = project(t.x, t.y + t.r + 6, BOSS_Y);
      const tw = t.r * 2 * k;
      g.fillStyle = 'rgba(255, 255, 255, 0.15)';
      g.fillRect(p.x - tw / 2, p.y, tw, 3);
      g.fillStyle = colors.enemy2;
      g.fillRect(p.x - tw / 2, p.y, tw * clamp(t.hp / t.maxHp, 0, 1), 3);
    }
  }

  function drawPerf(g) {
    const info = renderer.info.render;
    g.save();
    g.font = `700 12px ${MONO}`;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    const x = 8, y = Math.max(84, view.vh * 0.09);
    g.fillStyle = 'rgba(2, 5, 15, 0.74)';
    g.fillRect(x, y, 300, 72);
    g.strokeStyle = 'rgba(53, 244, 255, 0.4)';
    g.strokeRect(x, y, 300, 72);
    const fps = game.pfFps || 0;
    g.fillStyle = fps && fps < 50 ? '#ff4d6d' : '#a7ff3d';
    g.fillText(`${opts.version}  FPS ${fps}  worst ${game.pfWorstShown || 0}ms  hitch/s ${game.pfHitchShown || 0}`, x + 6, y + 7);
    g.fillStyle = '#eaf9ff';
    g.fillText(`q ${QUALITY[qi].name} dpr ${view.dpr.toFixed(2)} calls ${info.calls} tris ${(info.triangles / 1000).toFixed(0)}k`, x + 6, y + 23);
    g.fillText(`bul ${game.bullets.length} eb ${game.enemyBullets.length} part ${game.particles.length} debris ${debrisMesh.count}`, x + 6, y + 39);
    g.fillText(`inv ${game.invaders.length} fx ${fx.n} pitch ${(view.pitch * 180 / Math.PI).toFixed(0)}°`, x + 6, y + 55);
    g.restore();
  }

  // ---- adaptive quality ------------------------------------------------------------------------------
  function trackFrame(dt) {
    if (qPinned || document.hidden) return;
    perf.acc += dt;
    perf.frames++;
    if (perf.acc < 2) return;
    const fps = perf.frames / perf.acc;
    perf.fps = fps;
    perf.acc = 0;
    perf.frames = 0;
    if (game.state !== 'playing') { perf.bad = 0; return; }
    perf.bad = fps < 48 ? perf.bad + 1 : 0;
    if (perf.bad >= 2 && qi > 0) {
      qi--;
      perf.bad = 0;
      applyQuality();
      buildDust();
    }
  }

  // ---- main render ------------------------------------------------------------------------------------
  function render(dt) {
    clock += dt;
    debrisThisFrame = 0;
    trackFrame(dt);
    const t = game.time;
    const p = game.player;
    const playing = game.state === 'playing' || game.state === 'paused';

    // camera: base fit + sway toward the ship + shake; slow drift on the title screen
    introBlend = lerp(introBlend, game.state === 'ready' ? 1 : 0, clamp(dt * 1.8, 0, 1));
    const sway = p ? (p.x - game.width / 2) * 0.05 * (1 - introBlend) : 0;
    const shake = playing ? game.shake : 0;
    const sx = sway + (shake ? rand(-shake, shake) * 0.55 : 0);
    const sy = shake ? rand(-shake, shake) * 0.4 : 0;
    const yaw = Math.sin(clock * 0.16) * 0.1 * introBlend;
    const pitch = view.pitch - 0.08 * introBlend;
    placeCamera(pitch, view.dist * (1 + 0.04 * introBlend), view.lookZ, sx, sy, yaw);
    if (shake) { camera.rotateZ(rand(-1, 1) * shake * 0.0012); camera.updateMatrixWorld(true); }

    fx.begin(camera);
    stepLocal(dt);
    plateMat.uniforms.uTime.value = clock;
    dustMat.uniforms.uTime.value = clock;
    planetMat.uniforms.uTime.value = clock;
    pylonMat.userData.glow.value = 0.55 + Math.sin(clock * 2.2) * 0.2;
    const pulse = plateMat.uniforms.uPulse.value;
    pulse.multiplyScalar(Math.pow(0.04, dt));

    const list = game.invaders.length ? game.invaders : (game.state === 'ready' ? animateShowcase() : game.invaders);
    drawInvaders(list, game.state === 'ready' ? clock : t || clock);
    drawShields(t);
    drawPlayer(t, dt);
    drawBoss(t, dt);
    drawBullets();
    drawCores(t);
    drawParticles();
    drawRings();
    updateDebris(dt);
    fx.end();

    // grade: flash, aberration, vignette
    aberr = Math.max(0, aberr - dt * 0.03);
    // the logic only fades its screen flash while playing; fade our copy on menus too
    flashVis = playing ? game.screenFlash : Math.max(0, Math.min(flashVis, game.screenFlash) - dt * 2);
    const flash = clamp(flashVis, 0, 0.42);
    const fc = linRgb(game.flashColor || '255, 241, 168');
    grade.uniforms.uFlash.value.set(fc.r, fc.g, fc.b).multiplyScalar(flash * 0.32);
    grade.uniforms.uAberr.value = aberr;
    grade.uniforms.uTime.value = clock;
    grade.uniforms.uVignette.value = 0.42 + (game.boss && game.boss.intro > 0 ? 0.2 : 0);
    bloom.strength = 0.62 + flash * 0.5;

    renderer.info.reset();
    composer.render(dt);
    drawOverlay();
  }

  function animateShowcase() {
    const W = game.width;
    const span = Math.min(60, W * 0.08);
    const step = Math.floor(clock / 0.62);
    const phase = ((step % 8) < 4 ? step % 8 : 8 - (step % 8)) - 2;
    for (const inv of showcase) {
      inv.x = inv.baseX + phase * span * 0.25;
    }
    game.invaderFrame = step % 2;
    return showcase;
  }

  // ---- events from the game logic -------------------------------------------------------------------
  const events = {
    invaderKilled(inv, big) {
      const model = invModels[inv._mesh || invKind(inv) + '0'];
      const m = inv._m || invaderMatrix(inv, game.time, new THREE.Matrix4());
      const c = lin(invColorHex(inv)).clone().multiplyScalar(1.4);
      const vx = ((inv.x - (inv.prevX ?? inv.x)) || 0) * 30;
      const vz = ((inv.y - (inv.prevY ?? inv.y)) || 0) * 30;
      shatterModel(model, m, invPixel(inv), c, { force: big ? 1.5 : 1, vx, vz, budget: debrisThisFrame > 400 ? 14 : big ? 90 : 60 });
      _v.setFromMatrixPosition(m);
      if (debrisThisFrame < 400) addRing(inv.x, inv.y, _v.y, big ? 90 : 46, invColorHex(inv), big ? 0.45 : 0.3, 0.14);
      flashLight(inv.x, inv.y, _v.y + 10, invColorHex(inv), big ? 900 : 380, big ? 0.5 : 0.3);
    },
    blockLost(s, hex) {
      const c = lin(hex).clone().multiplyScalar(1.3);
      for (let i = 0; i < 3; i++) spawnDebris(wx(s.x) + rand(-2, 2), SHIELD_Y + rand(-3, 6), wz(s.y) + rand(-2, 2), rand(-70, 70), rand(80, 200), rand(-70, 40), s.w * rand(0.3, 0.5), c, rand(0.7, 1.3));
    },
    turretDown(t) {
      const red = lin(colors.enemy3).clone().multiplyScalar(1.5);
      for (let i = 0; i < 26; i++) spawnDebris(wx(t.x), BOSS_Y + 8, wz(t.y), rand(-200, 200), rand(80, 300), rand(-150, 200), rand(2.5, 5.5), red, rand(0.9, 1.6));
      addRing(t.x, t.y, BOSS_Y + 8, 110, colors.enemy3, 0.45, 0.12);
      flashLight(t.x, t.y, BOSS_Y + 20, colors.enemy3, 1200, 0.5);
      aberr = Math.max(aberr, 0.004);
    },
    bossDown(boss) {
      const entry = bossModels[boss.kind];
      if (entry && boss._m) {
        const c = lin(BOSS_BODY[boss.kind]).clone().multiplyScalar(1.4);
        shatterModel(entry.model, boss._m, clamp(4.8 * game.scale, 4, 5.6) * 1.2, c, { force: 2.2, budget: 260, life: 1.6 });
      }
      addRing(boss.x, boss.y, BOSS_Y, Math.max(game.width, game.height) * 0.8, colors.gold, 0.9, 0.06);
      addRing(boss.x, boss.y, BOSS_Y, 240, '#ffffff', 0.6, 0.15);
      flashLight(boss.x, boss.y, BOSS_Y + 40, colors.gold, 2400, 1.2);
      flashLight(boss.x, boss.y + 40, PLAYER_Y + 40, '#ffffff', 1800, 0.8);
      pulsePlate(colors.gold, 0.8);
      aberr = Math.max(aberr, 0.012);
    },
    playerHit(lifeLost) {
      const p = game.player;
      if (!p) return;
      bubbleHit = 1;
      aberr = Math.max(aberr, lifeLost ? 0.016 : 0.008);
      flashLight(p.x, p.y, PLAYER_Y + 20, colors.red, lifeLost ? 2200 : 900, lifeLost ? 0.8 : 0.4);
      if (lifeLost) {
        playerMesh.updateMatrixWorld();
        const c = lin(colors.player).clone().multiplyScalar(1.4);
        shatterModel(playerModel, playerMesh.matrixWorld, game.compact ? 3.5 : 4, c, { force: 1.6, budget: 110, life: 1.2 });
        addRing(p.x, p.y, PLAYER_Y, 220, colors.red, 0.6, 0.1);
        pulsePlate(colors.red, 0.7);
      }
    },
    bomb() {
      const p = game.player;
      if (!p) return;
      flashLight(p.x, p.y - 200, 140, colors.gold, 2400, 0.9);
      pulsePlate(colors.gold, 1.1);
      aberr = Math.max(aberr, 0.01);
    },
    pickup(core) {
      flashLight(core.x, core.y, 40, core.color, 700, 0.4);
      addRing(core.x, core.y, 22, 70, core.color, 0.4, 0.12);
    },
    muzzle(x, y, hex) {
      const c = lin(hex);
      fx.sprite(wx(x), SHOT_Y, wz(y), 10, c.r * 2, c.g * 2, c.b * 2, 0.8);
    }
  };

  // ---- roster thumbnails for the title panel ------------------------------------------------------------
  // Rendered at 2x into a plain target, then downsampled by the 2D canvas for smooth edges.
  function paintRoster(canvases) {
    const RW = 368, RH = 216;
    const readRT = new THREE.WebGLRenderTarget(RW, RH);
    const scratch = document.createElement('canvas');
    scratch.width = RW;
    scratch.height = RH;
    const sctx = scratch.getContext('2d');
    const tScene = new THREE.Scene();
    tScene.add(new THREE.HemisphereLight(0x8fa6ff, 0x1a0820, 1.2));
    const l = new THREE.DirectionalLight(0xffffff, 2.6);
    l.position.set(-0.4, 0.8, 1);
    tScene.add(l);
    const l2 = new THREE.DirectionalLight(0xff3df2, 1.4);
    l2.position.set(1, 0.2, -0.3);
    tScene.add(l2);
    const tCam = new THREE.PerspectiveCamera(30, RW / RH, 1, 1000);
    const pixels = new Uint8Array(RW * RH * 4);
    for (const cv of canvases) {
      const type = cv.dataset.enemySprite;
      let mesh;
      if (type === 'boss') {
        mesh = new THREE.Mesh(bossModel('carrier').model.geometry, bossModel('carrier').mat);
        mesh.scale.setScalar(2.9);
      } else {
        const kind = type === 'striker' ? 'striker' : (type === 'diver' || type === 'zealot') ? 'diver' : 'drone';
        const hex = type === 'drone' ? colors.enemy : type === 'striker' ? colors.enemy2 : type === 'diver' ? colors.enemy3 : type === 'zealot' ? colors.fire : colors.bullet;
        const m = voxelMaterial({ glow: 0.45, roughness: 0.3, metalness: 0.3, color: new THREE.Color(hex) });
        mesh = new THREE.Mesh(invModels[kind + '0'].geometry, m);
        mesh.scale.setScalar(type === 'splitter' ? 5.6 : 5.2);
      }
      mesh.rotation.set(-0.25, -0.5, 0);
      tScene.add(mesh);
      tCam.position.set(0, 0, 160);
      tCam.lookAt(0, 0, 0);
      renderer.setRenderTarget(readRT);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(tScene, tCam);
      renderer.readRenderTargetPixels(readRT, 0, 0, RW, RH, pixels);
      renderer.setRenderTarget(null);
      tScene.remove(mesh);
      // render targets skip tone mapping and sRGB output, so apply the display gamma here
      const img = sctx.createImageData(RW, RH);
      for (let y = 0; y < RH; y++) {
        for (let x = 0; x < RW; x++) {
          const si = ((RH - 1 - y) * RW + x) * 4;
          const di = (y * RW + x) * 4;
          for (let ch = 0; ch < 3; ch++) img.data[di + ch] = Math.round(255 * Math.pow(pixels[si + ch] / 255, 1 / 2.2));
          img.data[di + 3] = pixels[si + 3];
        }
      }
      sctx.putImageData(img, 0, 0);
      cv.width = 184;
      cv.height = 108;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, 184, 108);
      ctx.drawImage(scratch, 0, 0, 184, 108);
    }
    renderer.setClearColor(0x010208, 1);
    readRT.dispose();
  }

  function info() {
    const r = renderer.info.render;
    return { quality: QUALITY[qi].name, dpr: +view.dpr.toFixed(2), calls: r.calls, tris: r.triangles, fps: Math.round(perf.fps), pitch: Math.round(view.pitch * 180 / Math.PI), debris: debrisMesh.count, fx: fx.n };
  }

  function setQuality(name) {
    const i = QUALITY.findIndex(q => q.name === name);
    if (i >= 0) { qi = i; applyQuality(); buildDust(); }
    return QUALITY[qi].name;
  }

  function debugFx() {
    const bad = { pos: 0, col: 0, shp: 0, uv: 0, debris: 0 };
    for (let i = 0; i < fx.n * 12; i++) if (!Number.isFinite(fx.pos[i])) bad.pos++;
    for (let i = 0; i < fx.n * 16; i++) if (!Number.isFinite(fx.col[i])) bad.col++;
    for (let i = 0; i < fx.n * 8; i++) if (!Number.isFinite(fx.shp[i])) bad.shp++;
    for (let i = 0; i < D.n * 3; i++) if (!Number.isFinite(D.p[i]) || !Number.isFinite(D.c[i])) bad.debris++;
    bad.pulse = plateMat.uniforms.uPulse.value.toArray();
    bad.cam = camera.position.toArray();
    return bad;
  }

  return { resize, render, pointerToGameX, fieldScreen, project, events, paintRoster, info, setQuality, renderer, debugFx };
}

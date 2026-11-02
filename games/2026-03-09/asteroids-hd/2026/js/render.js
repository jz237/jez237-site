// The 3D belt: deep-space sky, a gas giant below the play plane, star dust, a holographic grid that
// bends around gravity, instanced noise-carved rocks, ships with trails, shots, hazards, the Maw, and
// every explosion. Everything is synced from the simulation each frame; nothing here changes W.
import * as THREE from '../vendor/three.module.min.js';
import { F, ARENAS, POWERUPS, KIND_INDEX, ROCK_KINDS } from './config.js?v=1';
import { fwd, dX, dZ } from './sim.js?v=1';
import { NOISE } from './shaders.js?v=1';
import { Post } from './post.js?v=1';
import { Sparks, Shards, patchShardMaterial, Lightning, Rings, Ribbon } from './fx.js?v=1';
import { rockGeometry, buildShip, buildBoss, buildOrb, buildMine, buildDrone } from './models.js?v=1';

const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const { AW, AH } = F;
// reduced flashing (Options)
export const CALM = { on: false };

export function pickQuality(name) {
  const coarse = matchMedia('(pointer:coarse)').matches;
  const mobile = coarse || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const tiers = {
    ultra: { name: 'ultra', pr: 2, msaa: true, bloomLevels: 6, detail: 4, sparks: 7000, debris: 700, stars: 9000 },
    high: { name: 'high', pr: 1.5, msaa: true, bloomLevels: 6, detail: 4, sparks: 4500, debris: 450, stars: 6000 },
    low: { name: 'low', pr: 1.1, msaa: false, bloomLevels: 5, detail: 3, sparks: 2200, debris: 220, stars: 3000 },
  };
  if (name && tiers[name]) return tiers[name];
  return mobile ? { ...tiers.high, name: 'auto-mobile', pr: Math.min(1.7, devicePixelRatio || 1), detail: 3, sparks: 3200, debris: 320 } : tiers.ultra;
}

// ------------------------------------------------------------------ shaders
const SKY_FRAG = /* glsl */ `
uniform vec3 uA, uB, uC; uniform float uTime;
varying vec3 vDir;
${NOISE}
float stars(vec3 d, float sc){
  vec3 p = d * sc; vec3 i = floor(p); vec3 f = fract(p) - 0.5;
  float h = hash13(i);
  vec3 o = vec3(hash13(i + 1.3), hash13(i + 2.7), hash13(i + 5.1)) - 0.5;
  float dist = length(f - o * 0.7);
  float tw = 0.6 + 0.4 * sin(uTime * (1.0 + h * 4.0) + h * 40.0);
  return step(0.93, h) * smoothstep(0.09, 0.0, dist) * (h - 0.93) * 16.0 * tw;
}
void main(){
  vec3 d = normalize(vDir);
  vec3 col = uA;
  float n = fbm(d * 2.0 + vec3(0.0, uTime * 0.004, 0.0));
  float n2 = fbm(d * 4.4 + vec3(5.0, 1.0, uTime * 0.008));
  float n3 = fbm(d * 9.0 + vec3(2.0, 7.0, 0.0));
  col += uB * pow(n, 2.8) * 1.5;
  col += uC * pow(n2, 3.6) * 1.9 * (0.6 + 0.4 * n3);
  col += mix(uB, uC, 0.5) * pow(max(0.0, n3 - 0.5), 2.0) * 0.8;
  col += vec3(stars(d, 230.0) + stars(d, 520.0) * 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;
const SKY_VERT = /* glsl */ `varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;

const PLANET_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 uSun; uniform float uTime;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  vec3 n = normalize(vN);
  float l = max(dot(n, normalize(uSun)), 0.0);
  float bands = fbm(vec3(vP.y * 0.012 + fbm3(vP * 0.004) * 1.5, vP.x * 0.0015 + uTime * 0.004, vP.z * 0.0015));
  vec3 surf = uColor * (0.2 + bands * 1.0);
  float rim = pow(max(1.0 - max(dot(n, normalize(vV)), 0.0), 0.0), 3.0);
  vec3 col = surf * (0.02 + l * 0.75) + uColor * rim * 1.2 * (0.2 + l);
  gl_FragColor = vec4(col * 0.26, 1.0);
}`;
const FRES_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; vP = position; gl_Position = projectionMatrix * viewMatrix * w; }`;

const GRID_VERT = /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GRID_FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uGrid, uP1, uP2; uniform vec2 uHalf;
uniform vec4 uShips[2]; uniform vec4 uWells[4];
uniform vec4 uRip[10]; uniform vec3 uRipCol[10];
uniform float uBoss;
varying vec3 vW;
${NOISE}
float grid(vec2 p, float w){ vec2 fw = fwidth(p); vec2 g = abs(fract(p - 0.5) - 0.5) / max(fw, vec2(1e-4)); return 1.0 - min(min(g.x, g.y) / w, 1.0); }
void main(){
  vec2 p = vW.xz;
  vec2 q = p;
  for (int i = 0; i < 4; i++) { vec4 w = uWells[i]; if (w.z <= 0.0) continue; vec2 d = w.xy - p; float r2 = dot(d, d); q += d * w.z * 1.6 / (r2 + 4.0); }
  vec3 shipC = vec3(0.0);
  for (int i = 0; i < 2; i++) { vec4 s = uShips[i]; if (s.z <= 0.0) continue; vec2 d = s.xy - p; float r2 = dot(d, d); q += d * 0.4 / (r2 + 3.0); shipC += (i == 0 ? uP1 : uP2) * exp(-r2 * 0.05) * 0.5; }
  vec3 ripC = vec3(0.0);
  for (int i = 0; i < 10; i++) {
    vec4 r = uRip[i]; if (r.w <= 0.0) continue;
    vec2 d = p - r.xy; float dist = length(d);
    float front = r.z * 18.0;
    float band = exp(-pow((dist - front) * 1.4, 2.0));
    float fade = exp(-r.z * 2.2) * r.w;
    q += (d / max(dist, 1e-3)) * band * fade * 0.5;
    ripC += uRipCol[i] * band * fade;
  }
  float g1 = grid(q / 2.0, 1.0);
  float g2 = grid(q / 0.5, 0.8) * 0.15;
  vec2 e = abs(p) - uHalf;
  float inside = step(max(e.x, e.y), 0.0);
  float edge = max(e.x, e.y);
  vec3 col = uGrid * (g1 * 0.16 + g2) * (0.35 + 0.65 * inside);
  col *= 0.75 + 0.25 * sin(uTime * 0.7 + p.x * 0.05);
  // the wrap boundary: a bright seam with a soft halo
  float seam = exp(-pow(edge * 3.0, 2.0)) * 1.4 + exp(-abs(edge) * 0.6) * 0.18;
  float dash = 0.6 + 0.4 * step(0.5, fract((p.x + p.y) * 0.25 - uTime * 0.3));
  col += uGrid * seam * dash;
  col += shipC * 0.35 + ripC;
  col += vec3(1.0, 0.1, 0.15) * uBoss * 0.02 * (0.5 + 0.5 * sin(uTime * 2.0 + length(p) * 0.3));
  float far = smoothstep(uHalf.x * 1.6, uHalf.x * 0.9, length(p * vec2(1.0, uHalf.x / uHalf.y)));
  gl_FragColor = vec4(col * far, 1.0);
}`;

const ROCK_VERT = /* glsl */ `
attribute vec4 aRock;
varying vec3 vN; varying vec3 vObj; varying vec3 vW; varying vec4 vRock;
void main(){
  vObj = position;
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vRock = aRock;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const ROCK_FRAG = /* glsl */ `
uniform vec3 uSun, uSunCol, uFill, uRim, uP1, uP2; uniform float uTime;
uniform vec3 uKindCol[7]; uniform vec3 uKindGlow[7];
varying vec3 vN; varying vec3 vObj; varying vec3 vW; varying vec4 vRock;
${NOISE}
void main(){
  int k = int(vRock.x + 0.5);
  vec3 p = vObj * 2.1 + vec3(vRock.w * 37.0, vRock.w * 11.0, 0.0);
  float n = fbm(p);
  float n2 = fbm3(p * 3.7 + 4.0);
  vec3 N = normalize(vN);
  // bump from the noise (screen-space derivatives)
  float h = n * 0.55 + n2 * 0.45;
  vec3 dpx = dFdx(vW), dpy = dFdy(vW);
  float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (hx * r1 + hy * r2);
  N = normalize(abs(det) * N - grad * 1.1);
  vec3 V = normalize(cameraPosition - vW);
  vec3 base = uKindCol[k] * (0.5 + n * 0.85);
  base *= mix(0.55, 1.1, smoothstep(0.3, 0.7, n2));
  float diff = max(dot(N, uSun), 0.0);
  float wrapL = dot(N, uSun) * 0.5 + 0.5;
  vec3 col = base * (uSunCol * diff + uFill * (0.18 + 0.22 * wrapL));
  vec3 H = normalize(uSun + V);
  float sh = k == 2 ? 70.0 : k == 1 ? 46.0 : k == 3 ? 90.0 : 10.0;
  float sk = k == 2 ? 2.4 : k == 1 ? 1.2 : k == 3 ? 1.6 : 0.08;
  col += uSunCol * pow(max(dot(N, H), 0.0), sh) * sk * (k == 2 ? base * 1.6 : vec3(1.0));
  float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  col += uRim * fr * 0.3;
  vec3 g = uKindGlow[k];
  if (k == 4) {
    float vein = smoothstep(0.035, 0.0, abs(fbm3(p * 1.4) - 0.5));
    col += g * vein * (2.6 + 1.6 * sin(uTime * 6.0 + vRock.w * 10.0)) + g * 0.04;
  } else if (k == 3) {
    col += g * (0.35 + pow(n2, 3.0) * 4.0);
  } else if (k == 1) {
    col += g * (fr * 0.9 + 0.06);
  } else if (k == 2) {
    col += g * (0.12 + pow(n2, 4.0) * 3.5) + vec3(1.0, 0.8, 0.4) * pow(hash13(floor(vObj * 18.0)), 40.0) * 6.0;
  } else if (k == 5) {
    col = col * 0.5 + g * 1.8 + vec3(1.6) * fr;
  } else if (k == 6) {
    float vein = smoothstep(0.022, 0.0, abs(fbm3(p * 0.9 + uTime * 0.05) - 0.5));
    col = col * 0.7 + g * vein * (1.6 + 0.8 * sin(uTime * 2.5)) + g * fr * 0.35;
  }
  float own = vRock.z;
  if (abs(own) > 0.01) { vec3 oc = own > 0.0 ? uP1 : uP2; col += oc * (fr * 3.2 + 0.18) * abs(own); }
  col += vec3(vRock.y) * 1.8;
  gl_FragColor = vec4(col, 1.0);
}`;

const SHOT_VERT = /* glsl */ `
attribute vec3 aCol;
varying vec2 vUv; varying vec3 vCol;
void main(){ vUv = uv; vCol = aCol; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`;
const SHOT_FRAG = /* glsl */ `
varying vec2 vUv; varying vec3 vCol;
void main(){
  vec2 p = vUv - 0.5;
  float d = length(vec2(p.x * 2.0, max(abs(p.y) - 0.28, 0.0) * 2.6));
  float core = exp(-d * d * 60.0);
  float glow = exp(-d * d * 7.0);
  float tail = smoothstep(-0.5, 0.4, p.y);
  gl_FragColor = vec4((vCol * glow * 0.9 + vec3(core) * 2.4) * tail, 1.0);
}`;

const FRES_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uAmt; uniform float uTime;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
  float hex = 0.6 + 0.4 * sin(vP.x * 9.0 + uTime * 3.0) * sin(vP.z * 9.0 - uTime * 2.0);
  gl_FragColor = vec4(uColor * (f * 1.4 + 0.04) * hex * uAmt, 1.0);
}`;

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
const UV_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const WARN_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uT; uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5; float r = length(p) * 2.0;
  float edge = exp(-pow((r - 0.96) * 26.0, 2.0));
  float fill = step(r, uT) * 0.22 * (0.6 + 0.4 * sin(uTime * 22.0));
  float rings = step(r, 1.0) * 0.08 * (0.5 + 0.5 * sin(r * 30.0 - uTime * 10.0));
  gl_FragColor = vec4(uColor * (edge * 2.0 + fill + rings), 1.0);
}`;
const LANE_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uAmt; uniform float uTime;
varying vec2 vUv;
void main(){
  float across = abs(vUv.y - 0.5) * 2.0;
  float chev = step(0.5, fract(vUv.x * 18.0 - uTime * 3.0 + across * 0.6));
  float a = (1.0 - smoothstep(0.7, 1.0, across)) * (0.25 + chev * 0.35) + exp(-pow((across - 0.92) * 14.0, 2.0)) * 1.2;
  gl_FragColor = vec4(uColor * a * uAmt, 1.0);
}`;
const BEAM_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uAmt; uniform float uTime;
varying vec2 vUv;
${NOISE}
void main(){
  float across = abs(vUv.x - 0.5) * 2.0;
  float n = fbm3(vec3(vUv.y * 14.0 - uTime * 18.0, across * 3.0, uTime));
  float core = exp(-across * across * 30.0) * 4.0;
  float glow = exp(-across * across * 4.0) * (0.6 + n);
  gl_FragColor = vec4((uColor * glow + vec3(core)) * uAmt * smoothstep(1.0, 0.9, vUv.y), 1.0);
}`;
const CORE_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uHit;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  float n = fbm(vP * 0.9 + vec3(0.0, uTime * 0.6, uTime * 0.3));
  float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.0);
  vec3 col = uColor * (0.6 + n * 3.2) + vec3(1.0, 0.85, 0.5) * pow(n, 4.0) * 8.0 + uColor * f * 2.0 + vec3(uHit * 3.0);
  gl_FragColor = vec4(col, 1.0);
}`;

// ------------------------------------------------------------------ helpers
let glowTex = null;
function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}
function glowSprite(color, k, scale) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: hdr(color, k), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  s.scale.setScalar(scale);
  return s;
}
const iconCache = new Map();
function iconTexture(glyph, color) {
  const key = glyph + color;
  if (iconCache.has(key)) return iconCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 84px "Segoe UI Symbol","Noto Sans Symbols 2","Apple Symbols",sans-serif';
  g.shadowColor = '#' + new THREE.Color(color).getHexString(); g.shadowBlur = 18;
  g.fillStyle = '#ffffff'; g.fillText(glyph, 64, 70); g.shadowBlur = 0; g.fillText(glyph, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  iconCache.set(key, t);
  return t;
}
// wrap copies: where else should something near an edge be drawn?
function ghosts(x, z, r, out) {
  out.length = 0;
  out.push(x, z);
  const nx = x > AW - r ? x - 2 * AW : x < -AW + r ? x + 2 * AW : null;
  const nz = z > AH - r ? z - 2 * AH : z < -AH + r ? z + 2 * AH : null;
  if (nx !== null) out.push(nx, z);
  if (nz !== null) out.push(x, nz);
  if (nx !== null && nz !== null) out.push(nx, nz);
  return out;
}
const GH = [];

// a flat polyline on the play plane (tactical overlay, lanes)
const PATH_VERT = /* glsl */ `attribute float along; varying float vA; void main(){ vA = along; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const PATH_FRAG = /* glsl */ `uniform vec3 uColor; uniform float uDash; uniform float uTime; uniform float uOp; varying float vA;
void main(){ float d = uDash > 0.0 ? step(0.45, fract(vA * uDash - uTime * 1.5)) : 1.0; gl_FragColor = vec4(uColor * d * uOp * (0.4 + 0.6 * smoothstep(0.0, 0.15, vA)), 1.0); }`;
class FlatPath {
  constructor(scene, color, n = 48, width = 0.09, dash = 0) {
    this.n = n; this.width = width;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 2 * 3);
    this.along = new Float32Array(n * 2);
    const idx = [];
    for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('along', new THREE.BufferAttribute(this.along, 1).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(idx);
    g.setDrawRange(0, 0);
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({ vertexShader: PATH_VERT, fragmentShader: PATH_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(color, 2.2) }, uDash: { value: dash }, uTime: { value: 0 }, uOp: { value: 1 } } });
    this.mesh = new THREE.Mesh(g, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 9;
    scene.add(this.mesh);
  }
  // pts: flat [x, z, x, z, ...] (already unwrapped)
  set(pts, y = 0.2) {
    const n = Math.min(pts.length / 2, this.n);
    if (n < 2) { this.geo.setDrawRange(0, 0); return; }
    let total = 0;
    for (let i = 0; i < n; i++) {
      const j0 = Math.max(0, i - 1), j1 = Math.min(n - 1, i + 1);
      let tx = pts[j1 * 2] - pts[j0 * 2], tz = pts[j1 * 2 + 1] - pts[j0 * 2 + 1];
      const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
      const x = pts[i * 2], z = pts[i * 2 + 1];
      if (i > 0) total += Math.hypot(x - pts[i * 2 - 2], z - pts[i * 2 - 1]);
      const k = i * 6, w = this.width;
      this.pos[k] = x - tz * w; this.pos[k + 1] = y; this.pos[k + 2] = z + tx * w;
      this.pos[k + 3] = x + tz * w; this.pos[k + 4] = y; this.pos[k + 5] = z - tx * w;
      this.along[i * 2] = this.along[i * 2 + 1] = total;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.along.needsUpdate = true;
    this.geo.setDrawRange(0, (n - 1) * 6);
  }
  hide() { this.geo.setDrawRange(0, 0); }
}

// ------------------------------------------------------------------ ships
class ShipView {
  constructor(R, ship, color, accent) {
    this.R = R;
    this.color = new THREE.Color(color);
    const b = buildShip(ship.look, color, accent, R.env);
    this.model = b;
    this.root = new THREE.Group();
    b.group.scale.setScalar(1.35);
    this.root.add(b.group);
    this.engines = b.engines.map((p) => {
      const s = glowSprite(accent, 3, 0.9);
      s.position.copy(p).add(new THREE.Vector3(0, 0, 0.25));
      b.group.add(s);
      const f = glowSprite(color, 2.2, 1);
      f.material.rotation = 0;
      b.group.add(f);
      return { p, s, f };
    });
    this.halo = glowSprite(color, 0.6, 5);
    this.halo.position.y = -0.4;
    this.root.add(this.halo);
    this.shield = new THREE.Mesh(new THREE.SphereGeometry(1.55, 32, 20), new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: FRES_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(0x6ad8ff, 1.6) }, uAmt: { value: 0 }, uTime: { value: 0 } } }));
    this.root.add(this.shield);
    this.aura = new THREE.Mesh(new THREE.SphereGeometry(1.3, 24, 16), new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: FRES_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(0xffa02a, 2) }, uAmt: { value: 0 }, uTime: { value: 0 } } }));
    this.aura.scale.set(1, 0.5, 1.4);
    this.root.add(this.aura);
    R.scene.add(this.root);
    // a second copy for drawing across the wrap seam
    this.ghost = b.group.clone();
    this.ghost.scale.setScalar(1.35);
    this.ghost.visible = false;
    R.scene.add(this.ghost);
    this.trail = new Ribbon(48, 0.28, color, 0xffffff);
    this.trail.mat.uniforms.uOpacity.value = 0.55;
    R.scene.add(this.trail.mesh);
    this.pts = [];
    this.lastA = ship.a;
    this.bank = 0;
    this.id = ship.id;
    this.dead = false;
  }
  update(W, s, dt, time) {
    const g = this.model.group;
    const alive = s.alive;
    this.root.visible = alive;
    if (!alive) { this.ghost.visible = false; this.trail.hide(); return; }
    this.root.position.set(s.x, 0, s.z);
    let da = s.a - this.lastA;
    if (da > Math.PI) da -= Math.PI * 2; else if (da < -Math.PI) da += Math.PI * 2;
    this.lastA = s.a;
    this.bank += (clamp(-da / Math.max(dt, 1e-3) * 0.12, -0.7, 0.7) - this.bank) * Math.min(1, dt * 8);
    g.rotation.set(0, -s.a, 0);
    g.rotateZ(this.bank);
    g.position.y = Math.sin(time * 2 + s.id) * 0.05;
    // blink while invulnerable after a hit, ghostly in phase
    const blink = s.inv > 0 && W.t - s.hitT < 1.2 && Math.floor(time * 16) % 2 === 0;
    g.visible = !blink;
    const th = Math.max(0, s.thrustK) + (s.dashT > 0 ? 1.5 : 0) + (s.odTime > 0 ? 0.4 : 0);
    for (const e of this.engines) {
      const k = 0.35 + th * 0.9;
      e.s.scale.setScalar(0.7 + th * 0.5);
      e.f.position.set(e.p.x, e.p.y, e.p.z + 0.35 + th * 0.5);
      e.f.scale.set(0.5 + th * 0.4, 0.5 + th * 0.4, 1).multiplyScalar(0.9 + Math.random() * 0.25);
      e.f.material.opacity = Math.min(1, k);
    }
    const flash = Math.max(0, 1 - (W.t - s.hitT) * 4);
    for (const m of this.model.materials.slice(0, 1)) m.emissive.copy(this.color).multiplyScalar(flash * 2 + (s.odTime > 0 ? 0.4 : 0));
    this.halo.material.color.copy(this.color).multiplyScalar(0.45 + (s.odTime > 0 ? 0.8 : 0) + flash);
    const sh = s.fx.shield > 0 ? 0.55 + 0.25 * s.fx.shield : 0;
    this.shield.material.uniforms.uAmt.value += (sh - this.shield.material.uniforms.uAmt.value) * Math.min(1, dt * 10);
    this.shield.material.uniforms.uTime.value = time;
    this.shield.visible = this.shield.material.uniforms.uAmt.value > 0.01;
    this.aura.material.uniforms.uAmt.value = s.odTime > 0 ? 0.8 + 0.2 * Math.sin(time * 20) : s.fx.phase > 0 ? 0.5 : 0;
    this.aura.material.uniforms.uColor.value.set(s.fx.phase > 0 && s.odTime <= 0 ? 0xb6a8ff : 0xffa02a).multiplyScalar(2);
    this.aura.material.uniforms.uTime.value = time;
    this.aura.visible = this.aura.material.uniforms.uAmt.value > 0;
    this.aura.rotation.y = -s.a;
    // wrap ghost
    ghosts(s.x, s.z, 2.2, GH);
    if (GH.length > 2) {
      this.ghost.visible = g.visible;
      this.ghost.position.set(GH[2], g.position.y, GH[3]);
      this.ghost.rotation.copy(g.rotation);
    } else this.ghost.visible = false;
    // engine trail (world space, broken at the wrap seam)
    const [fx, fz] = fwd(s.a);
    const tx = s.x - fx * 1.0, tz = s.z - fz * 1.0;
    const last = this.pts[this.pts.length - 1];
    if (last && (Math.abs(last.x - tx) > 8 || Math.abs(last.z - tz) > 8)) this.pts.length = 0;
    if (!last || Math.hypot(last.x - tx, last.z - tz) > 0.25) {
      this.pts.push(new THREE.Vector3(tx, 0.05, tz));
      if (this.pts.length > 48) this.pts.shift();
    } else last.set(tx, 0.05, tz);
    this.trail.mat.uniforms.uOpacity.value = 0.22 + Math.min(0.45, th * 0.3);
    this.trail.set(this.pts, this.R.camera.position, (u) => 0.25 + u * 0.75);
  }
  remove() {
    this.R.scene.remove(this.root); this.R.scene.remove(this.ghost); this.R.scene.remove(this.trail.mesh);
  }
}

// ------------------------------------------------------------------ the renderer
export class Renderer {
  constructor(canvas, quality) {
    this.canvas = canvas;
    this.q = quality;
    this.scale = 1;
    this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
    this.r.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.r.toneMapping = THREE.NoToneMapping;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.5, 5000);
    this.camera.position.set(0, 60, 30);
    this.camera.lookAt(0, 0, 0);
    this.post = new Post(this.r, quality);
    this.pmrem = new THREE.PMREMGenerator(this.r);
    this.time = 0;
    this.kick = { chroma: 0, flash: new THREE.Vector4(1, 1, 1, 0) };
    this.calmFlash = new THREE.Vector4();
    this.shocks = [];
    this.ripples = [];
    this.lights = [];
    this.ships = new Map();
    this.orbs = new Map();
    this.mines = new Map();
    this.drones = new Map();
    this.wells = new Map();
    this.warns = new Map();
    this.lanes = new Map();
    this.edgeWarn = [];
    this.colors = { 1: new THREE.Color(0x39f3ff), '-1': new THREE.Color(0xff4fd8) };
    this.build();
    this.resize();
  }

  build() {
    const S = this.scene, q = this.q;
    // sky
    this.skyMat = new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false,
      uniforms: { uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uTime: { value: 0 } } });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(2000, 48, 24), this.skyMat);
    this.sky.renderOrder = -10;
    S.add(this.sky);
    // the gas giant far below the belt
    this.planetMat = new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: PLANET_FRAG, uniforms: { uColor: { value: new THREE.Color() }, uSun: { value: new THREE.Vector3(-0.5, 0.6, -0.4) }, uTime: { value: 0 } } });
    this.planet = new THREE.Mesh(new THREE.SphereGeometry(560, 96, 48), this.planetMat);
    this.planet.position.set(420, -1500, -520);
    S.add(this.planet);
    // star dust: layers of points between the belt and the planet (parallax as the camera moves)
    {
      const n = q.stars;
      const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), alpha = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const y = -4 - Math.pow(Math.random(), 1.6) * 260;
        const spread = 60 + Math.abs(y) * 1.4;
        pos[i * 3] = (Math.random() - 0.5) * spread * 2.4; pos[i * 3 + 1] = y; pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 1.6;
        const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.4, 0.75);
        const k = 0.4 + Math.random() * 1.6;
        col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
        size[i] = 0.18 + Math.random() * 0.5;
        alpha[i] = 0.4 + Math.random() * 0.6;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setAttribute('size', new THREE.BufferAttribute(size, 1));
      g.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
      const sp = new Sparks(1);
      this.dust = new THREE.Points(g, sp.mat.clone());
      this.dust.material.uniforms = { uScale: { value: 300 } };
      this.dust.frustumCulled = false;
      S.add(this.dust);
    }
    // holographic grid under the belt
    const gg = new THREE.PlaneGeometry(AW * 4.2, AH * 4.2, 1, 1);
    gg.rotateX(-Math.PI / 2);
    const ships = [new THREE.Vector4(), new THREE.Vector4()], wells = [0, 0, 0, 0].map(() => new THREE.Vector4());
    const rip = [], ripC = [];
    for (let i = 0; i < 10; i++) { rip.push(new THREE.Vector4()); ripC.push(new THREE.Color()); }
    this.gridMat = new THREE.ShaderMaterial({ vertexShader: GRID_VERT, fragmentShader: GRID_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uGrid: { value: new THREE.Color() }, uP1: { value: this.colors[1] }, uP2: { value: this.colors[-1] }, uHalf: { value: new THREE.Vector2(AW, AH) },
        uShips: { value: ships }, uWells: { value: wells }, uRip: { value: rip }, uRipCol: { value: ripC }, uBoss: { value: 0 } } });
    this.grid = new THREE.Mesh(gg, this.gridMat);
    this.grid.position.y = -1.6;
    this.grid.renderOrder = -2;
    S.add(this.grid);
    // lights
    this.sunDir = new THREE.Vector3(-0.55, 0.75, -0.35).normalize();
    this.sun = new THREE.DirectionalLight(0xfff2e0, 3.2);
    this.sun.position.copy(this.sunDir).multiplyScalar(50);
    S.add(this.sun);
    this.hemi = new THREE.HemisphereLight(0x8fb0ff, 0x100818, 0.55);
    S.add(this.hemi);
    for (let i = 0; i < 8; i++) {
      const L = new THREE.PointLight(0xffffff, 0, 18, 1.6);
      L.position.y = 2.5;
      S.add(L);
      this.lights.push({ L, life: 0, max: 1, k: 0 });
    }
    // rocks: four carved shapes, one instanced draw each
    this.rockMat = new THREE.ShaderMaterial({ vertexShader: ROCK_VERT, fragmentShader: ROCK_FRAG,
      uniforms: { uSun: { value: this.sunDir }, uSunCol: { value: new THREE.Color(0xfff0dc).multiplyScalar(2.6) }, uFill: { value: new THREE.Color(0x6a80c0) }, uRim: { value: new THREE.Color(0x8ab8ff) },
        uP1: { value: this.colors[1] }, uP2: { value: this.colors[-1] }, uTime: { value: 0 },
        uKindCol: { value: [] }, uKindGlow: { value: [] } } });
    const kinds = ['stone', 'ice', 'gold', 'crystal', 'volatile', 'comet'];
    for (const k of kinds) { this.rockMat.uniforms.uKindCol.value.push(new THREE.Color(ROCK_KINDS[k].color)); this.rockMat.uniforms.uKindGlow.value.push(hdr(ROCK_KINDS[k].glow, 1)); }
    this.rockMat.uniforms.uKindCol.value.push(new THREE.Color(0x3a2026)); this.rockMat.uniforms.uKindGlow.value.push(hdr(0xff2a48, 1.2));
    this.rockMeshes = [];
    const CAP = 220;
    for (let v = 0; v < 4; v++) {
      const geo = rockGeometry(101 + v * 57, q.detail);
      const attr = new THREE.InstancedBufferAttribute(new Float32Array(CAP * 4), 4).setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aRock', attr);
      const m = new THREE.InstancedMesh(geo, this.rockMat, CAP);
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.count = 0;
      m.frustumCulled = false;
      S.add(m);
      this.rockMeshes.push({ m, attr, n: 0, cap: CAP });
    }
    // shots
    const sg = new THREE.PlaneGeometry(1, 1);
    sg.rotateX(-Math.PI / 2);
    this.shotCap = 500;
    const shotCol = new THREE.InstancedBufferAttribute(new Float32Array(this.shotCap * 3), 3).setUsage(THREE.DynamicDrawUsage);
    sg.setAttribute('aCol', shotCol);
    this.shotCol = shotCol;
    this.shots = new THREE.InstancedMesh(sg, new THREE.ShaderMaterial({ vertexShader: SHOT_VERT, fragmentShader: SHOT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), this.shotCap);
    this.shots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.shots.frustumCulled = false;
    this.shots.renderOrder = 6;
    this.shots.count = 0;
    S.add(this.shots);
    // effects
    this.sparks = new Sparks(q.sparks);
    S.add(this.sparks.points);
    this.glows = new Sparks(1400);
    S.add(this.glows.points);
    this.debris = new Shards(q.debris);
    this.debris.mesh.geometry.dispose();
    this.debris.mesh.geometry = new THREE.DodecahedronGeometry(0.22, 0);
    this.debrisMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.85, flatShading: true, emissive: 0x1a1410 });
    this.debris.mesh.material = this.debrisMat;
    this.debris.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(q.debris * 3).fill(1), 3);
    S.add(this.debris.mesh);
    this.embers = new Shards(Math.round(q.debris * 0.6));
    patchShardMaterial(this.embers.mat);
    S.add(this.embers.mesh);
    this.rings = new Rings(S, 18);
    this.lightning = new Lightning(S, 24);
    // tactical overlay lines
    this.paths = [];
    for (let i = 0; i < 10; i++) this.paths.push(new FlatPath(S, 0xffffff, 40, 0.13, 0));
    this.markers = [];
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
      m.visible = false;
      m.renderOrder = 9;
      S.add(m);
      this.markers.push(m);
    }
    // the Maw's beam
    const bg = new THREE.PlaneGeometry(1, 1);
    bg.rotateX(-Math.PI / 2);
    bg.translate(0, 0, -0.5);
    this.beam = new THREE.Mesh(bg, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: BEAM_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(0xff2a48, 2.5) }, uAmt: { value: 0 }, uTime: { value: 0 } } }));
    this.beam.visible = false;
    this.beam.renderOrder = 7;
    S.add(this.beam);
  }

  makeEnv(A) {
    const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 16, 8), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: new THREE.Color(A.sky[1]).multiplyScalar(0.5) })));
    const panel = (color, k, x, y, z, w, h) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: hdr(color, k), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
    };
    panel(0xfff2e0, 5, -25, 30, -15, 18, 18);
    panel(A.sky[2], 3, 30, 6, 10, 10, 30);
    panel(A.grid, 2, 0, -30, 0, 40, 40);
    panel(0x8fb0ff, 1.5, 10, 20, 30, 30, 8);
    const t = this.pmrem.fromScene(es, 0.03).texture;
    es.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return t;
  }

  // ------------------------------------------------------------------ binding a match
  setWorld(W, sides) {
    this.W = W;
    const A = W.arena;
    if (this.arenaKey !== A.key) {
      this.arenaKey = A.key;
      this.skyMat.uniforms.uA.value.set(A.sky[0]);
      this.skyMat.uniforms.uB.value.set(A.sky[1]);
      this.skyMat.uniforms.uC.value.set(A.sky[2]);
      this.planetMat.uniforms.uColor.value.set(A.planet);
      this.gridMat.uniforms.uGrid.value.copy(hdr(A.grid, 1.2));
      if (this.env) this.env.dispose();
      this.env = this.makeEnv(A);
      this.hemi.color.set(A.sky[2]).lerp(new THREE.Color(0x8fb0ff), 0.6);
    }
    this.sides = sides;
    for (const s of [1, -1]) if (sides && sides[s]) this.colors[s].set(sides[s].color);
    for (const v of this.ships.values()) v.remove();
    this.ships.clear();
    for (const s of W.ships) {
      const info = sides && sides[s.side];
      this.ships.set(s.id, new ShipView(this, s, info ? info.color : s.side === 1 ? 0x39f3ff : 0xff4fd8, info ? info.accent || 0xffffff : 0xffffff));
    }
    for (const m of [this.orbs, this.mines, this.drones, this.wells, this.warns, this.lanes]) { for (const v of m.values()) this.scene.remove(v.group || v.mesh || v); m.clear(); }
    this.sparks.clear(); this.glows.clear(); this.debris.clear(); this.embers.clear();
    this.shocks = []; this.ripples = [];
    // hazards
    if (this.hole) { this.scene.remove(this.hole.group); this.hole = null; }
    if (W.hole) this.hole = this.makeHole(4.2, 0xffb050, 0x8a3cff);
    if (this.portalViews) { for (const p of this.portalViews) this.scene.remove(p.group); this.portalViews = null; }
    if (W.portals.length) this.portalViews = W.portals.map((p, i) => this.makePortal(p, i));
    if (this.bossView) { this.scene.remove(this.bossView.group); this.bossView = null; }
    if (W.boss) this.bossView = this.makeBoss();
    this.gridMat.uniforms.uBoss.value = W.boss ? 1 : 0;
  }

  makeHole(size, hot, cool) {
    const g = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.42 * size, 32, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    g.add(ball);
    const geo = new THREE.PlaneGeometry(4.6 * size, 4.6 * size);
    geo.rotateX(-Math.PI / 2);
    const disk = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uAmt: { value: 1 }, uHot: { value: hdr(hot, 1.6) }, uCool: { value: hdr(cool, 1.2) } } }));
    disk.rotation.z = 0.12;
    g.add(disk);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46 * size, 0.025 * size, 8, 64), new THREE.MeshBasicMaterial({ color: hdr(hot, 6) }));
    g.add(ring);
    this.scene.add(g);
    return { group: g, disk, ring, size };
  }

  makePortal(p, i) {
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    const col = i ? 0xff7ad8 : 0x5affd8;
    const geo = new THREE.PlaneGeometry(4.4, 4.4);
    geo.rotateX(-Math.PI / 2);
    const disk = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uAmt: { value: 0.8 }, uHot: { value: hdr(col, 1.4) }, uCool: { value: hdr(0x2040ff, 0.8) } } }));
    g.add(disk);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.08, 10, 64).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: hdr(col, 4) }));
    g.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.03, 6, 64).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: hdr(col, 2) }));
    g.add(ring2);
    this.scene.add(g);
    return { group: g, disk, ring, ring2, col };
  }

  makeBoss() {
    const b = buildBoss(this.env);
    const shellGeo = b.shell.geometry;
    shellGeo.setAttribute('aRock', new THREE.InstancedBufferAttribute(new Float32Array([6, 0, 0, 0.37]), 4));
    const shell = new THREE.InstancedMesh(shellGeo, this.rockMat, 1);
    shell.setMatrixAt(0, new THREE.Matrix4().makeScale(5.6, 4.2, 5.6));
    shell.frustumCulled = false;
    b.group.remove(b.shell);
    b.group.add(shell);
    const eyes = [];
    for (let i = 0; i < 4; i++) {
      const eg = new THREE.Group();
      const ball = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 16), new THREE.MeshStandardMaterial({ color: 0x220608, metalness: 0.3, roughness: 0.2, envMap: this.env, emissive: hdr(0xff2a48, 1.4) }));
      eg.add(ball);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 10), new THREE.MeshBasicMaterial({ color: hdr(0xffd060, 6) }));
      pupil.position.y = 0.75;
      eg.add(pupil);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x1a1012, metalness: 0.4, roughness: 0.5, envMap: this.env }));
      eg.add(lid);
      const glow = glowSprite(0xff2a48, 2.5, 4);
      eg.add(glow);
      this.scene.add(eg);
      eyes.push({ g: eg, ball, pupil, lid, glow });
    }
    const core = new THREE.Mesh(new THREE.SphereGeometry(3.1, 48, 32), new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: CORE_FRAG, uniforms: { uColor: { value: hdr(0xff3a2a, 1) }, uTime: { value: 0 }, uHit: { value: 0 } } }));
    core.visible = false;
    b.group.add(core);
    const coreGlow = glowSprite(0xff4a2a, 2.2, 16);
    coreGlow.visible = false;
    b.group.add(coreGlow);
    this.scene.add(b.group);
    return { group: b.group, shell, spikes: b.spikes, eyes, core, coreGlow, phase: 1 };
  }

  // ------------------------------------------------------------------ per-frame sync
  sync(W, dt, ov) {
    if (W !== this.W) this.setWorld(W, this.sides);
    this.time += dt;
    const t = this.time;
    this.skyMat.uniforms.uTime.value = t;
    this.planetMat.uniforms.uTime.value = t;
    this.rockMat.uniforms.uTime.value = t;
    this.gridMat.uniforms.uTime.value = t;
    this.sky.position.copy(this.camera.position);
    // ships
    const seen = new Set();
    for (const s of W.ships) {
      let v = this.ships.get(s.id);
      if (!v) { v = new ShipView(this, s, s.side === 1 ? 0x39f3ff : 0xff4fd8, 0xffffff); this.ships.set(s.id, v); }
      v.update(W, s, dt, t);
      seen.add(s.id);
    }
    for (const [id, v] of this.ships) if (!seen.has(id)) { v.remove(); this.ships.delete(id); }
    const su = this.gridMat.uniforms.uShips.value;
    for (let i = 0; i < 2; i++) { const s = W.ships[i]; if (s && s.alive) su[i].set(s.x, s.z, 1, 0); else su[i].set(0, 0, 0, 0); }
    this.syncRocks(W, t);
    this.syncShots(W);
    this.syncOrbs(W, dt, t);
    this.syncMines(W, t);
    this.syncDrones(W, dt, t);
    this.syncWells(W, t);
    this.syncHazards(W, dt, t);
    if (this.bossView) this.syncBoss(W, dt, t);
    // ripples into the grid
    const ru = this.gridMat.uniforms.uRip.value, rc = this.gridMat.uniforms.uRipCol.value;
    this.ripples = this.ripples.filter((r) => (r.age += dt) < 2.2);
    for (let i = 0; i < 10; i++) { const r = this.ripples[i]; if (r) { ru[i].set(r.x, r.z, r.age, r.k); rc[i].copy(r.color); } else ru[i].set(0, 0, 0, 0); }
    // effects
    this.sparks.update(dt);
    this.glows.update(dt);
    this.debris.update(dt);
    this.embers.update(dt);
    this.rings.update(dt);
    this.lightning.update(dt, this.camera.position);
    this.updateLights(dt);
    this.drawOverlay(W, ov);
  }

  syncRocks(W, t) {
    for (const rm of this.rockMeshes) rm.n = 0;
    const m4 = _m4, q = _q, s = _s, p = _p;
    for (const r of W.rocks) {
      const rm = this.rockMeshes[r.seed % 4];
      const ki = KIND_INDEX[r.kind] ?? 0;
      const flash = Math.max(0, 1 - (W.t - r.hitT) * 8);
      const own = r.owner && r.ownT > 0 ? r.owner * Math.min(1, r.ownT / F.ownTime * 1.4) : 0;
      const seed = (r.seed % 997) / 997;
      // spin about a per-rock axis
      const ax = _v.set(Math.sin(r.seed * 0.37), Math.cos(r.seed * 0.11), Math.sin(r.seed * 0.73)).normalize();
      const spin = (0.25 + (r.seed % 13) / 13 * 0.9) * (r.kind === 'comet' ? 3 : 1) / Math.sqrt(r.size);
      q.setFromAxisAngle(ax, t * spin + seed * 6.28);
      const sc = r.r * (W.t - r.born < 0.25 ? 0.6 + (W.t - r.born) * 1.6 : 1);
      s.setScalar(sc);
      ghosts(r.x, r.z, r.r, GH);
      for (let g = 0; g < GH.length; g += 2) {
        if (rm.n >= rm.cap) break;
        p.set(GH[g], 0, GH[g + 1]);
        m4.compose(p, q, s);
        rm.m.setMatrixAt(rm.n, m4);
        rm.attr.setXYZW(rm.n, ki, flash, own, seed);
        rm.n++;
      }
    }
    for (const rm of this.rockMeshes) {
      rm.m.count = rm.n;
      rm.m.instanceMatrix.needsUpdate = true;
      rm.attr.needsUpdate = true;
    }
  }

  syncShots(W) {
    let n = 0;
    const m4 = _m4, q = _q, s = _s, p = _p;
    const col = this.shotCol;
    for (const b of W.bullets) {
      if (n >= this.shotCap) break;
      const sp = Math.hypot(b.vx, b.vz) || 1;
      const ang = Math.atan2(b.vx, -b.vz);
      q.setFromAxisAngle(_up, -ang);
      let w = 0.45, len = 1.5, c;
      if (b.kind === 'rail') { w = 0.6; len = 3.4; c = _c.set(0xe0d0ff).multiplyScalar(3); }
      else if (b.kind === 'missile') { w = 0.6; len = 1.1; c = _c.set(0xff8a3a).multiplyScalar(3.4); }
      else if (b.kind === 'boss') { w = 0.8; len = 1.4; c = _c.set(0xff2a48).multiplyScalar(3.2); }
      else if (b.kind === 'drone') { w = 0.35; len = 1.1; c = _c.set(0x9affc0).multiplyScalar(3); }
      else c = _c.copy(this.colors[b.side] || this.colors[1]).multiplyScalar(3.2);
      if (b.spentLocal) continue;
      s.set(w, 1, len * Math.min(1, sp / 30 + 0.4));
      ghosts(b.x, b.z, 1, GH);
      for (let g = 0; g < GH.length && n < this.shotCap; g += 2) {
        p.set(GH[g], 0.25, GH[g + 1]);
        m4.compose(p, q, s);
        this.shots.setMatrixAt(n, m4);
        col.setXYZ(n, c.r, c.g, c.b);
        n++;
      }
      // missiles leave smoke and fire
      if (b.kind === 'missile' && Math.random() < 0.7) this.sparks.burst({ x: b.x, y: 0.25, z: b.z, n: 1, speed: 1, color: 0xff8a3a, intensity: 2, size: 0.35, life: 0.35, drag: 3, flat: 0.2 });
    }
    this.shots.count = n;
    this.shots.instanceMatrix.needsUpdate = true;
    col.needsUpdate = true;
  }

  syncOrbs(W, dt, t) {
    const seen = new Set();
    for (const o of W.orbs) {
      let v = this.orbs.get(o.id);
      if (!v) {
        const P = POWERUPS[o.kind];
        const b = buildOrb(P.color, this.env);
        const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTexture(P.glyph, P.color), transparent: true, depthWrite: false, depthTest: false }));
        icon.scale.setScalar(1.25);
        icon.position.y = 1.35;
        icon.renderOrder = 8;
        b.group.add(icon);
        const glow = glowSprite(P.color, 1.6, 3.6);
        b.group.add(glow);
        this.scene.add(b.group);
        v = { ...b, icon, glow, born: t };
        this.orbs.set(o.id, v);
      }
      seen.add(o.id);
      const age = t - v.born;
      const blink = o.life < 3 ? (Math.floor(t * 8) % 2 ? 0.35 : 1) : 1;
      v.group.position.set(o.x, 0.3 + Math.sin(t * 3 + o.id) * 0.15, o.z);
      v.group.scale.setScalar(Math.min(1, age * 3) * (0.95 + Math.sin(t * 5) * 0.05));
      v.core.rotation.set(t * 1.3, t * 0.9, 0);
      v.ring.rotation.set(Math.PI / 2 + Math.sin(t) * 0.4, t * 1.5, 0);
      v.ring2.rotation.set(t * 1.1, Math.PI / 2, t);
      v.glow.material.opacity = blink;
      v.icon.material.opacity = blink;
    }
    for (const [id, v] of this.orbs) if (!seen.has(id)) { this.scene.remove(v.group); this.orbs.delete(id); }
  }

  syncMines(W, t) {
    const seen = new Set();
    for (const m of W.mines) {
      let v = this.mines.get(m.id);
      if (!v) { v = buildMine(this.colors[m.side].getHex()); this.scene.add(v.group); this.mines.set(m.id, v); }
      seen.add(m.id);
      v.group.position.set(m.x, 0.2, m.z);
      v.group.rotation.set(t * 0.8, t * 1.2, 0);
      const on = m.armT > 0 ? 0.3 : Math.floor(t * (m.life < 4 ? 10 : 3)) % 2 ? 1 : 0.15;
      v.light.material.color.copy(this.colors[m.side]).multiplyScalar(5 * on);
    }
    for (const [id, v] of this.mines) if (!seen.has(id)) { this.scene.remove(v.group); this.mines.delete(id); }
  }

  syncDrones(W, dt, t) {
    const seen = new Set();
    for (const d of W.drones) {
      let v = this.drones.get(d.id);
      if (!v) { v = buildDrone(this.colors[d.side].getHex(), this.env); v.glow = glowSprite(this.colors[d.side].getHex(), 1.5, 1.6); v.group.add(v.glow); this.scene.add(v.group); this.drones.set(d.id, v); }
      seen.add(d.id);
      v.group.position.set(d.x, 0.5, d.z);
      v.group.rotation.y = -d.ang;
    }
    for (const [id, v] of this.drones) if (!seen.has(id)) { this.scene.remove(v.group); this.drones.delete(id); }
  }

  syncWells(W, t) {
    const seen = new Set();
    const wu = this.gridMat.uniforms.uWells.value;
    let wi = 0;
    if (W.hole && wi < 4) wu[wi++].set(W.hole.x, W.hole.z, 3, 0);
    for (const w of W.wells) {
      let v = this.wells.get(w.id);
      if (!v) { v = this.makeHole(1.6, 0xd890ff, 0x6a2aff); this.wells.set(w.id, v); }
      seen.add(w.id);
      const amt = Math.min(1, w.life * 1.5, (W.t - w.born) * 3);
      v.group.position.set(w.x, 0.2, w.z);
      v.group.scale.setScalar(Math.max(0.01, amt));
      v.disk.material.uniforms.uTime.value = t;
      v.ring.lookAt(this.camera.position);
      if (wi < 4) wu[wi++].set(w.x, w.z, 1.5 * amt, 0);
    }
    while (wi < 4) wu[wi++].set(0, 0, 0, 0);
    for (const [id, v] of this.wells) if (!seen.has(id)) { this.scene.remove(v.group); this.wells.delete(id); }
  }

  syncHazards(W, dt, t) {
    if (this.hole) {
      this.hole.group.position.set(W.hole.x, -0.2, W.hole.z);
      this.hole.disk.material.uniforms.uTime.value = t;
      this.hole.ring.lookAt(this.camera.position);
      if (Math.random() < 0.5) {
        const a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 8;
        this.glows.burst({ x: W.hole.x + Math.cos(a) * r, y: 0, z: W.hole.z + Math.sin(a) * r, n: 1, speed: 0.1, color: 0xffb050, intensity: 1.2, size: 0.3, life: 1.4, drag: 0, flat: 0, dir: [-Math.cos(a) * 4, 0, -Math.sin(a) * 4], spread: 0 });
      }
    }
    if (this.portalViews) for (const p of this.portalViews) {
      p.disk.material.uniforms.uTime.value = t * (p === this.portalViews[0] ? 1 : -1);
      p.ring.scale.setScalar(1 + Math.sin(t * 3) * 0.04);
      p.ring2.rotation.y = t * 0.5;
    }
    // storm warnings
    const seen = new Set();
    for (const st of W.strikes) {
      let v = this.warns.get(st.id);
      if (!v) {
        const geo = new THREE.PlaneGeometry(st.r * 2, st.r * 2);
        geo.rotateX(-Math.PI / 2);
        v = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: WARN_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          uniforms: { uColor: { value: hdr(0xb46bff, 1.8) }, uT: { value: 0 }, uTime: { value: 0 } } }));
        v.renderOrder = 3;
        this.scene.add(v);
        this.warns.set(st.id, v);
      }
      seen.add(st.id);
      v.position.set(st.x, 0.1, st.z);
      v.material.uniforms.uT.value = 1 - st.t / st.max;
      v.material.uniforms.uTime.value = t;
      if (Math.random() < 0.15) this.lightning.strike(new THREE.Vector3(st.x + (Math.random() - 0.5) * 6, 14, st.z + (Math.random() - 0.5) * 6), new THREE.Vector3(st.x + (Math.random() - 0.5) * st.r, 6, st.z + (Math.random() - 0.5) * st.r), 0xb46bff, 0.12, 0.05, 0.3);
    }
    for (const [id, v] of this.warns) if (!seen.has(id)) { this.scene.remove(v); this.warns.delete(id); }
    // crystal arcs
    if (W.arcs.length && (this.arcT = (this.arcT || 0) - dt) <= 0) {
      this.arcT = 0.07;
      for (const [ia, ib] of W.arcs.slice(0, 10)) {
        const a = W.rocks.find((r) => r.id === ia), b = W.rocks.find((r) => r.id === ib);
        if (!a || !b) continue;
        const bx = a.x + dX(a.x, b.x), bz = a.z + dZ(a.z, b.z);
        this.lightning.strike(_va.set(a.x, 0.2, a.z), _vb.set(bx, 0.2, bz), 0xc08aff, 0.09, 0.06, 0.22);
      }
    }
    // comet lanes
    const ls = new Set();
    for (const L of W.lanes) {
      const key = L.x + ':' + L.z;
      ls.add(key);
      let v = this.lanes.get(key);
      if (!v) {
        const geo = new THREE.PlaneGeometry(140, 6.8);
        geo.rotateX(-Math.PI / 2);
        v = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: LANE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          uniforms: { uColor: { value: hdr(0x5affd8, 1.6) }, uAmt: { value: 0 }, uTime: { value: 0 } } }));
        v.position.set(L.x, 0.05, L.z);
        v.rotation.y = -Math.atan2(L.dz, L.dx);
        v.renderOrder = 3;
        this.scene.add(v);
        this.lanes.set(key, v);
        v.userData.born = t;
      }
      v.material.uniforms.uAmt.value = Math.min(1, (t - v.userData.born) * 3) * (0.7 + 0.3 * Math.sin(t * 14));
      v.material.uniforms.uTime.value = t;
    }
    for (const [k, v] of this.lanes) if (!ls.has(k)) { this.scene.remove(v); this.lanes.delete(k); }
    // comets burn
    for (const r of W.rocks) if (r.kind === 'comet' && Math.random() < 0.9) {
      this.sparks.burst({ x: r.x, y: 0, z: r.z, n: 2, speed: 2, color: 0x6affff, intensity: 2.5, size: 0.5, life: 0.5, drag: 2.5, flat: 0.3 });
    }
    // wave warnings along an edge
    for (const e of this.edgeWarn) {
      e.t -= dt;
      e.m.visible = e.t > 0;
      e.m.material.opacity = Math.max(0, Math.min(1, e.t * 2)) * (0.6 + 0.4 * Math.sin(t * 16));
    }
    this.edgeWarn = this.edgeWarn.filter((e) => { if (e.t <= 0) this.scene.remove(e.m); return e.t > 0; });
  }

  syncBoss(W, dt, t) {
    const B = W.boss, v = this.bossView;
    v.group.position.set(B.x, 0, B.z);
    v.group.rotation.y = -B.rot;
    v.spikes.rotation.y = t * 0.1;
    const two = B.phase === 2;
    if (two && v.phase !== 2) { v.phase = 2; v.shell.visible = false; v.spikes.visible = false; v.core.visible = true; v.coreGlow.visible = true; }
    v.core.material.uniforms.uTime.value = t;
    v.core.material.uniforms.uHit.value = Math.max(0, 1 - (W.t - B.hitT) * 6);
    v.core.scale.setScalar(1 + Math.sin(t * 4) * 0.04);
    v.coreGlow.material.opacity = 0.7 + Math.sin(t * 6) * 0.2;
    B.eyes.forEach((e, i) => {
      const ev = v.eyes[i];
      ev.g.visible = !two;
      ev.g.position.set(e.x, 1.2, e.z);
      const alive = e.hp > 0;
      const open = alive && e.open;
      ev.lid.scale.y += ((open ? 0.12 : 1) - ev.lid.scale.y) * Math.min(1, dt * 10);
      ev.lid.position.y = 0.05;
      ev.pupil.visible = open;
      const hit = Math.max(0, 1 - (W.t - e.hitT) * 6);
      ev.ball.material.emissive.set(alive ? 0xff2a48 : 0x050202).multiplyScalar(alive ? 1.2 + hit * 3 : 1);
      ev.glow.material.opacity = alive ? (open ? 0.9 : 0.25) : 0;
      // look at the player
      const P = W.ships[0];
      if (P) ev.pupil.position.set(clamp(dX(e.x, P.x) * 0.04, -0.5, 0.5), 0.75, clamp(dZ(e.z, P.z) * 0.04, -0.5, 0.5));
      if (!alive && Math.random() < 0.3) this.sparks.burst({ x: e.x, y: 1.4, z: e.z, n: 1, speed: 1.5, color: 0xff6a2a, intensity: 1.5, size: 0.5, life: 0.8, drag: 1.5, flat: 0.5 });
    });
    // beam
    const bm = B.beam;
    if (bm) {
      const [fx, fz] = fwd(bm.ang);
      const len = 46;
      const ox = B.x + fx * B.r * 0.8, oz = B.z + fz * B.r * 0.8;
      this.beam.visible = true;
      this.beam.position.set(ox, 0.6, oz);
      this.beam.rotation.y = -bm.ang;
      const fire = bm.state === 'fire';
      this.beam.scale.set(fire ? 3.4 : 0.35 + (1 - bm.t / 1.7) * 0.4, 1, len);
      this.beam.material.uniforms.uAmt.value = fire ? 1.2 : 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 30)) * (1 - bm.t / 1.7);
      this.beam.material.uniforms.uTime.value = t;
      if (fire && Math.random() < 0.8) this.sparks.burst({ x: ox, y: 0.6, z: oz, n: 4, speed: 8, color: 0xff3a2a, intensity: 3, size: 0.4, life: 0.4, flat: 0.4 });
    } else this.beam.visible = false;
  }

  // ------------------------------------------------------------------ tactical overlay (AI plans)
  drawOverlay(W, ov) {
    let pi = 0, mi = 0;
    const line = (pts, color, dash, op = 1) => {
      const p = this.paths[pi++];
      if (!p) return;
      p.mat.uniforms.uColor.value.copy(color).multiplyScalar(2);
      p.mat.uniforms.uDash.value = dash;
      p.mat.uniforms.uTime.value = this.time;
      p.mat.uniforms.uOp.value = op;
      p.set(pts, 0.35);
    };
    const mark = (x, z, r, color, op = 1) => {
      const m = this.markers[mi++];
      if (!m) return;
      m.visible = true;
      m.position.set(x, 0.3, z);
      m.scale.setScalar(r);
      m.material.color.copy(color).multiplyScalar(2.2 * op);
    };
    if (ov && ov.tactical && ov.ai) {
      for (const side of [1, -1]) {
        const ai = ov.ai[side];
        if (!ai || !ai.ship.alive) continue;
        const s = ai.ship, P = ai.plan, c = this.colors[side];
        if (P.aimRel) {
          line([s.x, s.z, s.x + P.aimRel.dx, s.z + P.aimRel.dz], c, 0.9, 0.9);
          mark(s.x + P.aimRel.dx, s.z + P.aimRel.dz, 0.8, c);
        }
        if (P.move) {
          const mx = s.x + dX(s.x, P.move.x), mz = s.z + dZ(s.z, P.move.z);
          line([s.x, s.z, mx, mz], _c2.copy(c).lerp(WHITE, 0.5), 2.2, 0.35);
        }
        for (const q of P.threats.slice(0, 3)) if (!q.lane && !q.beam) mark(s.x + q.px + q.vx * 0, s.z + q.pz, (q.r || 0.5) + 0.7, RED, Math.min(1, q.w));
        if (P.shard) {
          const r = W.rocks.find((k) => k.id === P.shard.rock);
          if (r) line([r.x, r.z, r.x + dX(r.x, P.shard.fx), r.z + dZ(r.z, P.shard.fz)], GOLD, 1.4, 0.9);
        }
      }
    }
    while (pi < this.paths.length) this.paths[pi++].hide();
    while (mi < this.markers.length) this.markers[mi++].visible = false;
  }

  // ------------------------------------------------------------------ events
  flashLight(x, z, color, k, life, y = 2.5) {
    const l = this.lights.reduce((a, b) => (a.life < b.life ? a : b));
    l.L.position.set(x, y, z);
    l.L.color.set(color);
    l.k = k; l.life = life; l.max = life;
  }
  updateLights(dt) {
    for (const l of this.lights) {
      if (l.life <= 0) { l.L.intensity = 0; continue; }
      l.life -= dt;
      l.L.intensity = Math.max(0, l.life / l.max) * l.k * (CALM.on ? 0.5 : 1);
    }
  }
  ripple(x, z, color, k) {
    this.ripples.push({ x, z, color: new THREE.Color(color), k, age: 0 });
    if (this.ripples.length > 10) this.ripples.shift();
  }
  shock(x, z, k) {
    this.shocks.push({ p: new THREE.Vector3(x, 0, z), age: 0, k });
    if (this.shocks.length > 6) this.shocks.shift();
  }
  flash(k, color = 0xffffff) {
    const c = _c.set(color);
    this.kick.flash.set(c.r, c.g, c.b, Math.max(this.kick.flash.w, k));
  }

  explode(x, z, size, color, o = {}) {
    const k = size;
    this.sparks.burst({ x, y: 0.3, z, n: Math.round(30 * k), speed: 7 * Math.sqrt(k), color, intensity: 3.5, size: 0.3, life: 0.7, drag: 1.6, flat: 0.45 });
    this.sparks.burst({ x, y: 0.3, z, n: Math.round(14 * k), speed: 3 * Math.sqrt(k), color: 0xffffff, intensity: 2.2, size: 0.45, life: 0.35, drag: 3, flat: 0.5 });
    this.glows.burst({ x, y: 0.3, z, n: Math.round(6 * k), speed: 2 * Math.sqrt(k), color: o.smoke ?? 0xff8a3a, intensity: 1.1, size: 1.6 * Math.sqrt(k), life: 1.1, drag: 1.2, flat: 0.4 });
    this.rings.spawn(x, z, color, 3 * k, 0.6, 0.1);
    this.flashLight(x, z, color, 30 * k, 0.4);
    if (k >= 2) this.shock(x, z, Math.min(1, k * 0.35));
    this.ripple(x, z, color, Math.min(1.5, 0.3 * k));
  }

  event(e, W) {
    const P1 = this.colors[1], P2 = this.colors[-1];
    const sideCol = (s) => (s === 1 ? P1 : s === -1 ? P2 : WHITE);
    switch (e.k) {
      case 'fire': {
        if (e.kind === 'drone') break;
        const s = W.ships.find((q) => q.id === e.id);
        if (s) {
          const [fx, fz] = fwd(s.a);
          const c = e.kind === 'rail' ? 0xe0d0ff : e.kind === 'missile' ? 0xff8a3a : sideCol(e.side).getHex();
          this.sparks.burst({ x: s.x + fx * 1.4, y: 0.25, z: s.z + fz * 1.4, n: e.kind === 'rail' ? 12 : 4, speed: 5, color: c, intensity: 3, size: 0.22, life: 0.18, dir: [fx * 2, 0, fz * 2], spread: 0.5, flat: 0.3, drag: 6 });
          this.flashLight(s.x + fx * 1.5, s.z + fz * 1.5, c, e.kind === 'rail' ? 14 : 5, 0.08, 1);
        }
        break;
      }
      case 'rock': {
        const K = ROCK_KINDS[e.kind] || ROCK_KINDS.stone;
        const glow = e.kind === 'stone' ? 0xffb070 : K.glow;
        const big = [0, 0.7, 1.1, 1.8, 2.6][e.size];
        this.explode(e.x, e.z, big, glow, { smoke: e.kind === 'ice' ? 0x6ab0ff : e.kind === 'gold' ? 0xffc040 : 0x8a6a50 });
        _c.set(K.color);
        this.debris.burst({ x: e.x, y: 0, z: e.z, n: Math.round(4 * e.size * e.size), speed: 7 + e.size * 2, w: e.size, h: 0.5, up: 3, scale: 0.6 + e.size * 0.45, life: 1.0 + e.size * 0.3, color: K.color, intensity: 1, vx: e.vx * 0.5, vz: e.vz * 0.5, drag: 0.8 });
        if (e.kind !== 'stone') this.embers.burst({ x: e.x, y: 0, z: e.z, n: 4 + e.size * 4, speed: 8, w: e.size, h: 0.5, up: 3, scale: 0.5, life: 1, color: glow, intensity: 2.5, drag: 1.2 });
        if (e.kind === 'gold') { this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 50, speed: 9, color: 0xffd23f, intensity: 4, size: 0.3, life: 1.0, drag: 1.5, flat: 0.4 }); }
        break;
      }
      case 'chip': this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 7, speed: 5, color: 0xffc080, intensity: 2.5, size: 0.2, life: 0.3, flat: 0.4, drag: 3 }); this.flashLight(e.x, e.z, 0xffa060, 4, 0.08, 1); break;
      case 'spark': this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 6, speed: 4, color: 0xffffff, intensity: 2, size: 0.2, life: 0.25, flat: 0.4, drag: 3 }); break;
      case 'hit': {
        const c = sideCol(e.side);
        this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 40, speed: 9, color: 0xff4050, intensity: 3.5, size: 0.28, life: 0.5, flat: 0.45, drag: 2 });
        this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 14, speed: 5, color: c, intensity: 3, size: 0.4, life: 0.4, flat: 0.5, drag: 2 });
        this.rings.spawn(e.x, e.z, 0xff4050, 4, 0.4, 0.12);
        this.flashLight(e.x, e.z, 0xff5040, 16, 0.25);
        this.shock(e.x, e.z, 0.35 + e.dmg * 0.15);
        this.kick.chroma = Math.min(0.012, this.kick.chroma + 0.003 * e.dmg);
        break;
      }
      case 'shield': this.rings.spawn(e.x, e.z, 0x6ad8ff, 5, 0.45, 0.15); this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 20, speed: 6, color: 0x6ad8ff, intensity: 3, size: 0.25, life: 0.35, flat: 0.5 }); break;
      case 'dodge': this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 10, speed: 3, color: 0xffffff, intensity: 2, size: 0.3, life: 0.3, flat: 0.4 }); break;
      case 'bump': this.sparks.burst({ x: e.x, y: 0.2, z: e.z, n: Math.round(4 + e.k2 * 14), speed: 4 + e.k2 * 5, color: 0xffd0a0, intensity: 2.5, size: 0.2, life: 0.35, flat: 0.4, drag: 3 }); break;
      case 'boom': {
        const k = e.small ? 0.8 : e.r / 2;
        this.explode(e.x, e.z, k, e.src === 'mine' ? 0xff3a5a : 0xff6a1a);
        if (!e.small) { this.rings.spawn(e.x, e.z, 0xffa040, e.r * 2.2, 0.6, 0.12); this.flash(0.08, 0xffa060); }
        break;
      }
      case 'mineboom': break;
      case 'ko': {
        const c = e.boss ? 0xff4a2a : sideCol(e.side).getHex();
        this.explode(e.x, e.z, 4.5, c);
        this.explode(e.x, e.z, 2.5, 0xffffff);
        this.embers.burst({ x: e.x, y: 0, z: e.z, n: 60, speed: 14, w: 1, h: 0.5, up: 4, scale: 1.2, life: 2.6, color: c, intensity: 3, drag: 0.5 });
        this.debris.burst({ x: e.x, y: 0, z: e.z, n: 40, speed: 12, w: 1, h: 0.5, up: 4, scale: 1.4, life: 3, color: 0x404850, intensity: 1, drag: 0.4 });
        this.rings.spawn(e.x, e.z, c, 22, 1.2, 0.15);
        this.shock(e.x, e.z, 1);
        this.flash(0.35, c);
        this.flashLight(e.x, e.z, c, 90, 1.2, 4);
        break;
      }
      case 'orb': this.rings.spawn(e.x, e.z, POWERUPS[e.kind].color, 3, 0.5, 0.1); break;
      case 'pu': {
        const c = POWERUPS[e.kind].color;
        this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 40, speed: 7, color: c, intensity: 3.5, size: 0.28, life: 0.6, flat: 0.5 });
        this.rings.spawn(e.x, e.z, c, 5, 0.5, 0.12);
        this.flashLight(e.x, e.z, c, 14, 0.3);
        break;
      }
      case 'orbgone': this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 12, speed: 3, color: 0x8899aa, intensity: 1.5, size: 0.25, life: 0.4, flat: 0.5 }); break;
      case 'dash': {
        const s = W.ships.find((q) => q.side === e.side);
        if (s) { const [fx, fz] = fwd(s.a); this.sparks.burst({ x: s.x, y: 0.2, z: s.z, n: 26, speed: 6, color: sideCol(e.side), intensity: 3, size: 0.35, life: 0.4, dir: [-fx * 3, 0, -fz * 3], spread: 0.6, flat: 0.3 }); }
        this.ripple(e.x, e.z, sideCol(e.side), 0.4);
        break;
      }
      case 'od': this.rings.spawn(e.x, e.z, 0xffa02a, 8, 0.7, 0.12); this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 60, speed: 10, color: 0xffa02a, intensity: 3.5, size: 0.3, life: 0.6, flat: 0.5 }); this.flash(0.1, 0xffa040); this.shock(e.x, e.z, 0.6); break;
      case 'wave': {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(e.edge < 2 ? 1.2 : AW * 2, e.edge < 2 ? AH * 2 : 1.2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: hdr(0xff6a3a, 3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
        m.position.set(e.edge === 0 ? -AW : e.edge === 1 ? AW : 0, 0.1, e.edge === 2 ? -AH : e.edge === 3 ? AH : 0);
        this.scene.add(m);
        this.edgeWarn.push({ m, t: 1.6 });
        break;
      }
      case 'strike': {
        for (let i = 0; i < 3; i++) this.lightning.strike(_va.set(e.x + (Math.random() - 0.5) * 3, 30, e.z + (Math.random() - 0.5) * 3), _vb.set(e.x + (Math.random() - 0.5) * 1.5, 0, e.z + (Math.random() - 0.5) * 1.5), 0xd0b0ff, 0.35, 0.22, 0.25);
        this.explode(e.x, e.z, 2, 0xb46bff);
        this.flash(CALM.on ? 0.05 : 0.22, 0xc8b0ff);
        this.flashLight(e.x, e.z, 0xc8b0ff, 70, 0.4, 6);
        break;
      }
      case 'arc': this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 16, speed: 5, color: 0xc08aff, intensity: 3, size: 0.25, life: 0.3, flat: 0.5 }); break;
      case 'portal': {
        for (const [x, z] of [[e.x, e.z], [e.x2, e.z2]]) { this.rings.spawn(x, z, 0x5affd8, 5, 0.5, 0.12); this.sparks.burst({ x, y: 0.3, z, n: 20, speed: 5, color: 0x5affd8, intensity: 3, size: 0.25, life: 0.4, flat: 0.5 }); }
        break;
      }
      case 'eat': this.sparks.burst({ x: e.x, y: 0.3, z: e.z, n: 20, speed: 4, color: 0xffb050, intensity: 3, size: 0.3, life: 0.5, flat: 0.4 }); break;
      case 'nova': this.rings.spawn(e.x, e.z, 0xffffff, 22, 0.8, 0.15); this.explode(e.x, e.z, 2.2, 0xffffff); this.shock(e.x, e.z, 1); this.flash(0.18); break;
      case 'well': this.rings.spawn(e.x, e.z, 0xc070ff, 4, 0.5, 0.1); break;
      case 'bossfire': this.sparks.burst({ x: e.x, y: 1.2, z: e.z, n: e.ring ? 30 : 8, speed: e.ring ? 9 : 4, color: 0xff2a48, intensity: 3, size: 0.3, life: 0.3, flat: 0.5 }); this.flashLight(e.x, e.z, 0xff2a48, e.ring ? 30 : 8, 0.15); break;
      case 'bosshit': this.sparks.burst({ x: e.x, y: 1, z: e.z, n: 10, speed: 5, color: 0xffa040, intensity: 3, size: 0.25, life: 0.3, flat: 0.5 }); break;
      case 'bossblock': this.sparks.burst({ x: e.x, y: 0.6, z: e.z, n: 5, speed: 3, color: 0x8a7a70, intensity: 1.5, size: 0.2, life: 0.25, flat: 0.5 }); break;
      case 'eyedown': this.explode(e.x, e.z, 3.2, 0xff2a48); this.flash(0.12, 0xff4040); break;
      case 'phase2': {
        this.explode(e.x, e.z, 5, 0xff4a2a);
        this.debris.burst({ x: e.x, y: 0, z: e.z, n: 80, speed: 14, w: 8, h: 1, up: 4, scale: 2, life: 3, color: 0x4a3036, intensity: 1, drag: 0.5 });
        this.flash(0.3, 0xff5030);
        break;
      }
      case 'beam': this.flash(CALM.on ? 0.04 : 0.12, 0xff3040); this.shock(e.x, e.z, 0.7); break;
      case 'spit': this.sparks.burst({ x: e.x, y: 0.5, z: e.z, n: 30, speed: 6, color: 0xff5a3a, intensity: 2.5, size: 0.4, life: 0.5, flat: 0.5 }); break;
      case 'heal': this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 20, speed: 3, color: 0x4dff8a, intensity: 3, size: 0.3, life: 0.6, flat: 0.5 }); break;
    }
  }

  project(x, y, z) {
    _p.set(x, y, z).project(this.camera);
    return { x: (_p.x * 0.5 + 0.5) * this.cssW, y: (-_p.y * 0.5 + 0.5) * this.cssH, behind: _p.z > 1 };
  }

  resize() {
    const w = innerWidth, h = innerHeight;
    this.cssW = w; this.cssH = h;
    const pr = Math.min(devicePixelRatio || 1, this.q.pr) * this.scale;
    this.pr = pr;
    this.r.setPixelRatio(1);
    this.r.setSize(Math.round(w * pr), Math.round(h * pr), false);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.post.setSize(Math.round(w * pr), Math.round(h * pr));
    if (this.dust) this.dust.material.uniforms.uScale.value = h * pr * 0.9;
    this.sparks.mat.uniforms.uScale.value = h * pr * 0.9;
    this.glows.mat.uniforms.uScale.value = h * pr * 0.9;
  }

  render(dt, look) {
    const shocks = [];
    for (const s of this.shocks) {
      s.age += dt;
      const pp = this.project(s.p.x, s.p.y, s.p.z);
      if (pp.behind) continue;
      shocks.push(new THREE.Vector4(pp.x / this.cssW, 1 - pp.y / this.cssH, s.age * 0.9 * s.k, Math.max(0, 1 - s.age * 1.4) * s.k * (CALM.on ? 0.3 : 1)));
    }
    this.shocks = this.shocks.filter((s) => s.age < 0.8);
    const lens = [];
    const addLens = (x, z, k, rad) => {
      const c = this.project(x, 0, z);
      if (c.behind) return;
      const e = this.project(x + rad, 0, z);
      const r = Math.hypot(e.x - c.x, e.y - c.y) / this.cssH;
      lens.push(new THREE.Vector4(c.x / this.cssW, 1 - c.y / this.cssH, r, k));
    };
    if (this.W && this.W.hole) addLens(this.W.hole.x, this.W.hole.z, 0.5, 4.2);
    if (this.W) for (const w of this.W.wells) if (lens.length < 3) addLens(w.x, w.z, 0.4 * Math.min(1, w.life, (this.W.t - w.born) * 2), 1.6);
    if (this.W && this.W.boss && this.W.boss.phase === 2 && lens.length < 3) addLens(this.W.boss.x, this.W.boss.z, 0.18, 3);
    const k = this.kick;
    k.chroma = Math.max(0, k.chroma - dt * 0.05);
    k.flash.w = Math.max(0, k.flash.w - dt * 1.8);
    const calm = CALM.on;
    if (calm) this.calmFlash.copy(k.flash).setW(Math.min(0.05, k.flash.w * 0.15));
    this.post.render(this.scene, this.camera, {
      bloom: (look.bloom ?? 1) * (calm ? 0.8 : 1), threshold: 1.0, exposure: look.exposure ?? 1.0, chroma: calm ? 0.001 : 0.0018 + k.chroma + (look.chroma || 0),
      vignette: 0.5, time: this.time, desat: look.desat || 0, fade: look.fade || 0, flash: calm ? this.calmFlash : k.flash,
      tint: look.tint || ONE3, shocks, lens,
    });
  }
}
const _p = new THREE.Vector3(), _v = new THREE.Vector3(), _va = new THREE.Vector3(), _vb = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _c = new THREE.Color(), _c2 = new THREE.Color();
const WHITE = new THREE.Color(1, 1, 1), RED = new THREE.Color(1, 0.15, 0.2), GOLD = new THREE.Color(1, 0.8, 0.25);
const ONE3 = new THREE.Vector3(1, 1, 1);

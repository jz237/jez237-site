import * as THREE from 'three';
import {TANK} from './Case';

// Terrain: an analytic height field (metres) used by the mesh, the plants and the lizard.
export const WATER_LEVEL = 0.105;
export const POOL = {cx: 0.31, cz: 0.115, rx: 0.3, rz: 0.17};
const HX = TANK.w / 2 - 0.0015, HZ = TANK.d / 2 - 0.0015;

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {s += a * noise(x * f, y * f); a *= 0.5; f *= 2.03;}
  return s;
}
const gauss = (dx: number, dz: number, rx: number, rz: number) => Math.exp(-((dx / rx) ** 2 + (dz / rz) ** 2));
const smooth = (a: number, b: number, x: number) => {const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t);};

/** 0 outside the pool, 1 in its deep centre. Negative distance is inside. */
export function poolDistance(x: number, z: number) {
  const a = Math.atan2(z - POOL.cz, x - POOL.cx);
  const wobble = 0.07 * Math.sin(a * 3 + 0.8) + 0.05 * Math.sin(a * 5 - 1.3) + 0.04 * (fbm(x * 9, z * 9) - 0.5);
  return Math.hypot((x - POOL.cx) / POOL.rx, (z - POOL.cz) / POOL.rz) - 1 + wobble;
}

export function groundHeight(x: number, z: number) {
  let h = 0.146 - z * 0.1;
  h += 0.075 * gauss(x + 0.05, z + 0.15, 0.26, 0.11);
  h += 0.05 * gauss(x - 0.43, z + 0.16, 0.15, 0.1);
  h += 0.04 * gauss(x + 0.46, z + 0.17, 0.13, 0.09);
  h += 0.012 * gauss(x + 0.34, z - 0.04, 0.2, 0.12);
  h += (fbm(x * 14 + 3, z * 14) - 0.5) * 0.012 + (fbm(x * 55, z * 55) - 0.5) * 0.003;
  const d = poolDistance(x, z);
  const bed = 0.046 + (fbm(x * 20, z * 20) - 0.5) * 0.008;
  const t = smooth(0.18, -0.4, d);
  return h + (bed - h) * t;
}

/** Ground mesh plus the cut-away substrate seen through the glass. */
export class Ground {
  readonly mesh: THREE.Mesh;
  readonly walls: THREE.Mesh;
  readonly uniforms = {uTime: {value: 0}, uWet: {value: 0}, uCaustic: {value: 1}, tMoss: {value: null as THREE.Texture | null}};

  constructor() {
    const NX = 360, NZ = 150;
    const geo = new THREE.PlaneGeometry(HX * 2, HZ * 2, NX, NZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, groundHeight(pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();
    this.mesh = new THREE.Mesh(geo, this.groundMaterial());
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.name = 'ground';

    // Walls follow the perimeter just inside the glass.
    const wallPos: number[] = [];
    const wallUv: number[] = [];
    const idx: number[] = [];
    const edge = (x0: number, z0: number, x1: number, z1: number, n: number) => {
      const base = wallPos.length / 3;
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
        const h = groundHeight(x, z);
        wallPos.push(x, 0.0, z, x, h, z);
        const s = Math.abs(x1 - x0) > 0 ? x : z;
        wallUv.push(s, 0, s, h);
      }
      for (let i = 0; i < n; i++) {const a = base + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);}
    };
    edge(-HX, HZ, HX, HZ, 480);
    edge(HX, HZ, HX, -HZ, 200);
    edge(HX, -HZ, -HX, -HZ, 480);
    edge(-HX, -HZ, -HX, HZ, 200);
    const wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(wallPos, 3));
    wg.setAttribute('uv', new THREE.Float32BufferAttribute(wallUv, 2));
    wg.setIndex(idx);
    wg.computeVertexNormals();
    this.walls = new THREE.Mesh(wg, this.wallMaterial());
    this.walls.receiveShadow = true;
    this.walls.name = 'substrate';
  }

  private groundMaterial() {
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.9});
    const u = this.uniforms;
    m.onBeforeCompile = (s) => {
      s.uniforms.uTime = u.uTime;
      s.uniforms.uWet = u.uWet;
      s.uniforms.tMoss = u.tMoss;
      s.uniforms.uCaustic = u.uCaustic;
      s.uniforms.uTank = {value: new THREE.Vector2(TANK.w, TANK.d)};
      s.uniforms.uWater = {value: WATER_LEVEL};
      s.uniforms.uPool = {value: new THREE.Vector4(POOL.cx, POOL.cz, POOL.rx, POOL.rz)};
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vW;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec3 vW; uniform float uTime, uWet, uWater, uCaustic; uniform vec4 uPool; uniform sampler2D tMoss; uniform vec2 uTank;
${GROUND_GLSL}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
GroundSample gs = groundSample(vW, uTime, uWet, uWater, texture2D(tMoss, vW.xz / uTank + 0.5).r);
diffuseColor.rgb = gs.color;`)
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = gs.rough;')
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(normalize(gs.normal), 0.0)).xyz);`)
        .replace('#include <aomap_fragment>', `
reflectedLight.indirectDiffuse *= gs.ao; reflectedLight.indirectSpecular *= gs.ao; reflectedLight.directDiffuse *= mix(1.0, gs.ao, 0.5);
#include <aomap_fragment>
reflectedLight.directDiffuse += gs.caustic * gs.color * 1.4 * uCaustic;`);
    };
    m.customProgramCacheKey = () => 'terrarium-ground-v1';
    return m;
  }

  private wallMaterial() {
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.92});
    m.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vSub; varying vec3 vWn;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSub = uv; vWn = normalize(mat3(modelMatrix) * objectNormal);');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec2 vSub; varying vec3 vWn;
${WALL_GLSL}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
WallSample ws = wallSample(vSub);
diffuseColor.rgb = ws.color;`)
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = ws.rough;')
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  vec3 nW = normalize(vWn);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 side = normalize(cross(up, nW));
  vec3 nP = normalize(nW + side * ws.slope.x + up * ws.slope.y);
  normal = normalize((viewMatrix * vec4(nP, 0.0)).xyz);
}`)
        .replace('#include <aomap_fragment>', `
reflectedLight.indirectDiffuse *= ws.ao; reflectedLight.directDiffuse *= mix(1.0, ws.ao, 0.7); reflectedLight.indirectSpecular *= ws.ao;
#include <aomap_fragment>`);
    };
    m.customProgramCacheKey = () => 'terrarium-wall-v1';
    return m;
  }
}

const NOISE_GLSL = /* glsl */ `
float gh1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 gh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(gh1(i), gh1(i+vec2(1,0)), f.x), mix(gh1(i+vec2(0,1)), gh1(i+vec2(1,1)), f.x), f.y); }
float gfbm(vec2 p){ float s = 0.0, a = 0.5; for(int i=0;i<5;i++){ s += a*gn(p); p = p*2.03 + 17.0; a *= 0.5; } return s; }
// Pebble field: x = height (0..1), y = cell id, z = edge distance
vec3 pebbles(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0; vec2 id = vec2(0.0);
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 n = vec2(float(x), float(y));
    vec2 h = gh2(i + n);
    vec2 r = n + 0.5 + 0.38 * (h - 0.5) * 2.0 - f;
    r *= vec2(1.0 + 0.35 * h.x, 1.0 + 0.35 * h.y);
    float d = length(r);
    if(d < d1){ d2 = d1; d1 = d; id = i + n; } else if(d < d2) d2 = d;
  }
  float e = d2 - d1;
  float h = sqrt(max(0.0, 1.0 - d1 * d1 * 1.25)) * smoothstep(0.0, 0.18, e);
  return vec3(h, gh1(id * 1.37), e);
}
`;

const GROUND_GLSL = NOISE_GLSL + /* glsl */ `
struct GroundSample { vec3 color; float rough; vec3 normal; float ao; float caustic; };
float groundBumps(vec2 p, float moss){
  float soil = gfbm(p * 140.0) * 0.6 + gn(p * 600.0) * 0.4;
  float mossH = gfbm(p * 260.0) * 0.6 + gn(p * 900.0) * 0.4;
  return mix(soil * 0.0012, mossH * 0.0018, moss);
}
GroundSample groundSample(vec3 w, float t, float wet, float water, float mossMap){
  GroundSample g;
  vec2 p = w.xz;
  float under = smoothstep(water - 0.001, water - 0.008, w.y);
  float shore = smoothstep(water + 0.025, water + 0.001, w.y) * (1.0 - under);
  float moss = smoothstep(0.05, 0.6, mossMap) * (1.0 - under) * (1.0 - shore * 0.85);
  vec3 soil = vec3(0.1, 0.065, 0.04) * (0.7 + 0.6 * gfbm(p * 60.0));
  // leaf litter flecks
  float litter = smoothstep(0.72, 0.8, gn(p * 90.0 + 3.1)) * (1.0 - moss);
  soil = mix(soil, vec3(0.22, 0.12, 0.05) * (0.7 + 0.5 * gn(p * 300.0)), litter * 0.8);
  float speck = smoothstep(0.93, 0.97, gn(p * 700.0));
  soil = mix(soil, vec3(0.5, 0.48, 0.44), speck * 0.5 * (1.0 - moss));
  vec3 mossC = mix(vec3(0.05, 0.1, 0.018), vec3(0.14, 0.22, 0.035), gfbm(p * 40.0));
  mossC = mix(mossC, vec3(0.22, 0.26, 0.05), smoothstep(0.6, 0.85, gn(p * 220.0)) * 0.5);
  mossC *= 0.6 + 0.6 * gn(p * 900.0);
  vec3 col = mix(soil, mossC, moss);
  // pool bed: rounded pebbles under clear water
  vec3 pb = pebbles(p * 130.0);
  vec3 stone = mix(vec3(0.16, 0.13, 0.1), vec3(0.42, 0.36, 0.28), pb.y) * (0.45 + 0.55 * pb.x);
  stone = mix(stone, vec3(0.05, 0.06, 0.03), (1.0 - smoothstep(0.0, 0.12, pb.z)) * 0.6);
  stone = mix(stone, vec3(0.1, 0.14, 0.05), smoothstep(0.55, 0.8, gn(p * 30.0)) * 0.5);
  float bedMix = under;
  col = mix(col, stone, bedMix);
  // wet gravel at the margin
  float grit = gn(p * 900.0) * 0.6 + gn(p * 2400.0) * 0.4;
  vec3 gravel = mix(vec3(0.06, 0.05, 0.04), vec3(0.2, 0.17, 0.13), grit) * (0.8 + 0.4 * gn(p * 150.0));
  col = mix(col, gravel, shore * (1.0 - moss));
  // wet margin
  col *= mix(1.0, 0.55, shore + wet * (1.0 - moss) * 0.4);
  g.color = col;
  g.rough = mix(mix(0.92, 0.82, moss), 0.35, max(shore, bedMix * 0.6));
  g.rough = mix(g.rough, 0.45, wet * 0.6);
  // bump normal
  float e = 0.0006;
  float h0 = groundBumps(p, moss) + pb.x * 0.0025 * bedMix;
  float hx = groundBumps(p + vec2(e, 0.0), moss) + pebbles((p + vec2(e, 0.0)) * 130.0).x * 0.0025 * bedMix;
  float hz = groundBumps(p + vec2(0.0, e), moss) + pebbles((p + vec2(0.0, e)) * 130.0).x * 0.0025 * bedMix;
  vec3 dx = vec3(e, hx - h0, 0.0), dz = vec3(0.0, hz - h0, e);
  vec3 nb = normalize(cross(dz, dx));
  vec3 n = normalize(cross(dFdy(w), dFdx(w)));
  if (n.y < 0.0) n = -n;
  // tilt the bump normal into the geometric normal frame
  g.normal = normalize(n + (nb - vec3(0.0, 1.0, 0.0)) * 1.2);
  g.ao = mix(0.75 + 0.25 * smoothstep(0.0, 1.0, gn(p * 300.0)), 0.6 + 0.4 * pb.x, bedMix);
  // caustics on the pool bed
  vec2 cp = p * 38.0;
  float c1 = gn(cp + vec2(t * 0.35, t * 0.22)), c2 = gn(cp * 1.37 - vec2(t * 0.27, -t * 0.31));
  float caustic = pow(1.0 - abs(c1 - c2) * 2.2, 6.0);
  g.caustic = caustic * under * 0.9;
  return g;
}
`;

const WALL_GLSL = NOISE_GLSL + /* glsl */ `
struct WallSample { vec3 color; float rough; vec2 slope; float ao; };
WallSample wallSample(vec2 uv){
  WallSample s;
  float x = uv.x, y = uv.y;
  float layer = 0.042 + (gfbm(vec2(x * 9.0, 1.0)) - 0.5) * 0.012;
  // drainage pebbles
  vec3 pb = pebbles(vec2(x, y) * vec2(110.0, 120.0));
  vec3 peb = mix(vec3(0.17, 0.13, 0.09), vec3(0.5, 0.42, 0.32), pb.y) * (0.35 + 0.65 * pb.x);
  peb = mix(peb, vec3(0.62, 0.55, 0.45), smoothstep(0.85, 1.0, pb.y) * 0.5);
  float gap = 1.0 - smoothstep(0.0, 0.1, pb.z);
  peb = mix(peb, vec3(0.03, 0.022, 0.016), gap * 0.85);
  // soil with fibres, bark and perlite
  float fib = gn(vec2(x * 900.0, y * 140.0 + gn(vec2(x * 40.0, y * 40.0)) * 6.0));
  vec3 soil = vec3(0.09, 0.055, 0.032) * (0.6 + 0.7 * gfbm(vec2(x, y) * 220.0));
  soil = mix(soil, vec3(0.2, 0.12, 0.06), smoothstep(0.72, 0.9, fib) * 0.5);
  float bark = smoothstep(0.78, 0.86, gn(vec2(x, y) * vec2(160.0, 260.0)));
  soil = mix(soil, vec3(0.16, 0.08, 0.04), bark * 0.7);
  float perl = smoothstep(0.94, 0.985, gn(vec2(x, y) * 520.0));
  soil = mix(soil, vec3(0.62, 0.6, 0.55), perl * 0.7);
  // roots
  float rootN = abs(gn(vec2(x * 70.0, y * 26.0) + gn(vec2(x, y) * 30.0) * 2.0) - 0.5);
  float root = (1.0 - smoothstep(0.0, 0.025, rootN)) * smoothstep(layer, layer + 0.02, y);
  soil = mix(soil, vec3(0.3, 0.2, 0.11), root * 0.7);
  float isPeb = 1.0 - smoothstep(layer - 0.004, layer + 0.004, y);
  vec3 col = mix(soil, peb, isPeb);
  s.color = col;
  s.rough = mix(0.95, 0.6, isPeb);
  // slope from pebble domes (finite difference)
  float e = 0.0008;
  float hx = pebbles(vec2(x + e, y) * vec2(110.0, 120.0)).x, hy = pebbles(vec2(x, y + e) * vec2(110.0, 120.0)).x;
  s.slope = isPeb * vec2(pb.x - hx, pb.x - hy) * 1.2;
  s.ao = mix(0.8 + 0.2 * gn(vec2(x, y) * 300.0), 0.25 + 0.75 * pb.x * (1.0 - gap * 0.7), isPeb);
  return s;
}
`;

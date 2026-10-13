import * as THREE from 'three';
import {TANK} from './Case';
import CAVE from './cave.json';

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

/** Where the cascade lands: the plunge pocket is scoured deepest here. */
export const PLUNGE = {x: 0.1, z: 0.075};

/**
 * Water depth inside the pool (0 outside): a pebbly shelf about 2 cm deep that
 * a lizard can wade across, and a plunge pocket scoured out under the falls.
 */
export function poolDepth(x: number, z: number) {
  const d = poolDistance(x, z);
  if (d >= 0) return 0;
  const shelf = 0.0175 * smooth(0.0, -0.3, d);
  const pocket = 0.05 * gauss(x - PLUNGE.x - 0.03, z - PLUNGE.z, 0.13, 0.085) * smooth(0.0, -0.22, d);
  // a basin dug down into the substrate along the front glass, so the water
  // column shows through the cut-away, deepest in the middle of the pool's front
  const basin = 0.045 * smooth(0.0, -0.19, d) * smooth(0.09, 0.21, z);
  const ripples = (fbm(x * 26, z * 26) - 0.5) * 0.004 * smooth(0.0, -0.12, d);
  return Math.max(0, shelf + Math.max(pocket, basin) + ripples);
}

function landHeight(x: number, z: number) {
  let h = 0.146 - z * 0.1;
  h += 0.075 * gauss(x + 0.05, z + 0.15, 0.26, 0.11);
  h += 0.032 * gauss(x - 0.43, z + 0.17, 0.15, 0.09);
  h += 0.04 * gauss(x + 0.46, z + 0.17, 0.13, 0.09);
  h += 0.012 * gauss(x + 0.34, z - 0.04, 0.2, 0.12);
  // the wings at either end: a mossy mound against each side glass and a low bank at the back
  h += 0.04 * gauss(x + 0.7, z + 0.12, 0.11, 0.11) + 0.018 * gauss(x + 0.66, z - 0.1, 0.1, 0.08);
  h += 0.035 * gauss(x - 0.7, z + 0.13, 0.12, 0.1) + 0.014 * gauss(x - 0.68, z - 0.08, 0.09, 0.08);
  // low hummocks and a root-raised bank give the floor some relief
  h += 0.008 * gauss(x + 0.22, z - 0.12, 0.07, 0.05) + 0.006 * gauss(x - 0.47, z - 0.02, 0.06, 0.06);
  h += (fbm(x * 14 + 3, z * 14) - 0.5) * 0.012 + (fbm(x * 55, z * 55) - 0.5) * 0.003;
  return h;
}

/** 0..1: the levelled floor of the cave and the apron at its mouth. */
export function caveFloorWeight(x: number, z: number) {
  const e1 = Math.hypot((x - CAVE.x) / (CAVE.rx + 0.03), (z - CAVE.z) / (CAVE.rz + 0.03));
  const M = CAVE.mouth;
  const e2 = Math.hypot((x - M.x) / (M.rx + 0.02), (z - M.z - 0.03) / 0.065);
  return Math.max(1 - smooth(0.8, 1.0, e1), 1 - smooth(0.3, 1.0, e2));
}

/** True on the cave floor and its apron, which are kept clear of plants. */
export function caveKeepClear(x: number, z: number) {
  return caveFloorWeight(x, z) > 0.01;
}
export {CAVE};

export function groundHeight(x: number, z: number) {
  const d = poolDistance(x, z);
  if (d < 0) return WATER_LEVEL - poolDepth(x, z);
  // the bank slopes down to the water line as a gravel beach
  const h = landHeight(x, z);
  // a higher bank gets a longer beach, so the shore stays walkable
  const t = smooth(0.16 + Math.max(0, h - WATER_LEVEL) * 7, 0.0, d);
  const g = h + (WATER_LEVEL - h) * t;
  // the cave's floor is worn level, with a little grit
  const c = caveFloorWeight(x, z);
  return c > 0 ? g + (CAVE.floor + (fbm(x * 60, z * 60) - 0.5) * 0.002 - g) * c : g;
}

/** Ground mesh plus the cut-away substrate seen through the glass. */
export class Ground {
  readonly mesh: THREE.Mesh;
  readonly walls: THREE.Mesh;
  readonly uniforms = {uTime: {value: 0}, uWet: {value: 0}, uCaustic: {value: 1}, tMoss: {value: null as THREE.Texture | null}, tWetMap: {value: null as THREE.Texture | null}};

  constructor() {
    const NX = Math.round(300 * TANK.w), NZ = 150;
    const geo = new THREE.PlaneGeometry(HX * 2, HZ * 2, NX, NZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const cave = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, groundHeight(pos.getX(i), pos.getZ(i)));
      cave[i] = caveFloorWeight(pos.getX(i), pos.getZ(i));
    }
    geo.setAttribute('aCave', new THREE.BufferAttribute(cave, 1));
    geo.computeVertexNormals();
    this.mesh = new THREE.Mesh(geo, this.groundMaterial());
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.name = 'ground';

    // Walls follow the perimeter just inside the glass.
    const wallPos: number[] = [];
    const wallUv: number[] = [];
    const wallTop: number[] = [];
    const idx: number[] = [];
    const edge = (x0: number, z0: number, x1: number, z1: number, n: number) => {
      const base = wallPos.length / 3;
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
        const h = groundHeight(x, z);
        wallPos.push(x, 0.0, z, x, h, z);
        const s = Math.abs(x1 - x0) > 0 ? x : z;
        wallUv.push(s, 0, s, h);
        // where the surface is above this column (under the pool: its bed), and whether it is wet
        wallTop.push(h, poolDistance(x, z) < 0 ? 1 : 0, h, poolDistance(x, z) < 0 ? 1 : 0);
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
    wg.setAttribute('aTop', new THREE.Float32BufferAttribute(wallTop, 2));
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
      s.uniforms.tWetMap = u.tWetMap;
      s.uniforms.uCaustic = u.uCaustic;
      s.uniforms.uTank = {value: new THREE.Vector2(TANK.w, TANK.d)};
      s.uniforms.uWater = {value: WATER_LEVEL};
      s.uniforms.uPool = {value: new THREE.Vector4(POOL.cx, POOL.cz, POOL.rx, POOL.rz)};
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vW; attribute float aCave; varying float vCave;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz; vCave = aCave;');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec3 vW; varying float vCave; uniform float uTime, uWet, uWater, uCaustic; uniform vec4 uPool; uniform sampler2D tMoss, tWetMap; uniform vec2 uTank;
${GROUND_GLSL}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
vec4 wetMap = texture2D(tWetMap, vW.xz / uTank + 0.5);
GroundSample gs = groundSample(vW, uTime, clamp(max(uWet * 0.35, wetMap.r * 1.4), 0.0, 1.0), uWater, texture2D(tMoss, vW.xz / uTank + 0.5).r, vCave, wetMap.rg);
diffuseColor.rgb = gs.color;`)
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = gs.rough;')
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(normalize(gs.normal), 0.0)).xyz);`)
        .replace('#include <aomap_fragment>', `
reflectedLight.indirectDiffuse *= gs.ao; reflectedLight.indirectSpecular *= gs.ao; reflectedLight.directDiffuse *= mix(1.0, gs.ao, 0.5);
#include <aomap_fragment>
reflectedLight.directDiffuse += gs.caustic * gs.color * 1.4 * uCaustic;
// a puddle mirrors the lamp-lit case behind it, strongly at a glancing view
{ float fr = pow(1.0 - clamp(normalize(cameraPosition - vW).y, 0.0, 1.0), 4.0);
  reflectedLight.indirectSpecular += gs.puddle * (0.05 + 0.9 * fr) * vec3(0.15, 0.13, 0.1) * (0.2 + 0.8 * uCaustic); }`);
    };
    m.customProgramCacheKey = () => 'terrarium-ground-v5';
    return m;
  }

  private wallMaterial() {
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.92});
    m.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vSub; varying vec3 vWn; attribute vec2 aTop; varying vec2 vTop;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSub = uv; vTop = aTop; vWn = normalize(mat3(modelMatrix) * objectNormal);');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec2 vSub; varying vec3 vWn; varying vec2 vTop;
${WALL_GLSL}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
WallSample ws = wallSample(vSub, vTop.x, vTop.y);
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
    m.customProgramCacheKey = () => 'terrarium-wall-v2';
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
// Rounded stones lying in a layer, each a dome that hides the ones behind it
// (fill ~1: packed; less: scattered). x = height 0..1 (0 between them), y = id, z = 1 - r/R.
vec3 stones(vec2 p, float fill){
  vec2 i = floor(p), f = fract(p);
  float best = 0.0, id = 0.0, rim = 0.0;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 n = vec2(float(x), float(y));
    vec2 h = gh2(i + n);
    vec2 r = n + 0.5 + (h - 0.5) * 0.55 - f;
    float a = h.x * 6.2832;
    r = mat2(cos(a), -sin(a), sin(a), cos(a)) * r;
    r.x *= 0.8 + 0.4 * h.y;
    float R = fill * (0.5 + 0.22 * h.y);
    float d = length(r) / R;
    if (d < 1.0) {
      float hh = sqrt(1.0 - d * d) * (0.65 + 0.35 * h.x);
      if (hh > best) { best = hh; id = gh1(i + n + 0.37); rim = 1.0 - d; }
    }
  }
  return vec3(best, id, rim);
}
`;

const GROUND_GLSL = NOISE_GLSL + /* glsl */ `
struct GroundSample { vec3 color; float rough; vec3 normal; float ao; float caustic; float puddle; };
float groundBumps(vec2 p, float moss){
  // humus: crumbs and grains, with flat bark chips lying on top
  vec3 crumb = pebbles(p * 520.0);
  vec3 chip = pebbles(p * vec2(150.0, 260.0) + 3.0);
  float soil = gfbm(p * 140.0) * 0.45 + crumb.x * 0.55 + smoothstep(0.78, 0.84, chip.y) * chip.x * 0.8;
  float mossH = gfbm(p * 260.0) * 0.6 + gn(p * 900.0) * 0.4;
  return mix(soil * 0.0016, mossH * 0.0018, moss);
}
// rings from raindrops landing in a puddle: the slope they put on the water
vec2 rainRings(vec2 p, float t){
  vec2 s = vec2(0.0);
  for(int k=0;k<2;k++){
    vec2 q = p * 95.0 + float(k) * 3.7;
    vec2 i = floor(q), f = fract(q) - 0.5;
    vec2 h = gh2(i + float(k) * 11.0);
    vec2 d = f - (h - 0.5) * 0.4;
    float r = length(d);
    float ph = fract(t * (1.1 + h.y) + h.x);
    float R = ph * 0.45;
    float wv = sin((r - R) * 48.0) * exp(-(((r - R) / 0.08) * ((r - R) / 0.08))) * (1.0 - ph);
    s += d / max(r, 1e-3) * wv;
  }
  return s;
}
GroundSample groundSample(vec3 w, float t, float wet, float water, float mossMap, float cave, vec2 wetMap){
  GroundSample g;
  vec2 p = w.xz;
  float under = (1.0 - smoothstep(water - 0.008, water - 0.001, w.y));
  float shore = (1.0 - smoothstep(water + 0.001, water + 0.025, w.y)) * (1.0 - under);
  float moss = smoothstep(0.05, 0.6, mossMap) * (1.0 - under) * (1.0 - shore * 0.85);
  // dark, damp humus (the case's air never lets it dry out)
  vec3 soil = vec3(0.064, 0.042, 0.027) * (0.7 + 0.6 * gfbm(p * 60.0));
  // crumbs and grains catch the light; bark chips are redder
  vec3 crumb = pebbles(p * 520.0);
  soil *= 0.7 + 0.6 * crumb.x * (0.6 + 0.8 * crumb.y);
  vec3 chip = pebbles(p * vec2(150.0, 260.0) + 3.0);
  // (a scatter of chips with soft edges: packed edge to edge they read as cracked, dried mud)
  soil = mix(soil, vec3(0.12, 0.065, 0.035) * (0.7 + 0.5 * chip.x), smoothstep(0.78, 0.84, chip.y) * smoothstep(0.1, 0.4, chip.x) * 0.75);
  // leaf litter flecks
  float litter = smoothstep(0.72, 0.8, gn(p * 90.0 + 3.1)) * (1.0 - moss);
  soil = mix(soil, vec3(0.22, 0.12, 0.05) * (0.7 + 0.5 * gn(p * 300.0)), litter * 0.8);
  float speck = smoothstep(0.93, 0.97, gn(p * 700.0));
  soil = mix(soil, vec3(0.5, 0.48, 0.44), speck * 0.5 * (1.0 - moss));
  // under the shell moss: the shaded depths of the carpet
  vec3 mossC = mix(vec3(0.02, 0.04, 0.008), vec3(0.06, 0.1, 0.018), gfbm(p * 40.0));
  mossC = mix(mossC, vec3(0.1, 0.13, 0.03), smoothstep(0.6, 0.85, gn(p * 220.0)) * 0.4);
  mossC *= 0.6 + 0.6 * gn(p * 900.0);
  vec3 col = mix(soil, mossC, moss);
  // pool bed: dark silt and sand with scattered pebbles, algae and sunken leaves
  float depthB = clamp((water - w.y) / 0.05, 0.0, 1.0);
  vec3 silt = mix(vec3(0.07, 0.055, 0.035), vec3(0.15, 0.12, 0.08), gfbm(p * 70.0)) * (0.8 + 0.4 * gn(p * 600.0));
  silt = mix(silt, vec3(0.035, 0.03, 0.02), depthB * 0.6);
  vec3 pb = stones(p * 160.0, 0.75);
  float pebMask = smoothstep(0.55, 0.85, gn(p * 22.0 + 4.0)) * (1.0 - depthB * 0.5);
  vec3 stone = mix(vec3(0.07, 0.06, 0.05), vec3(0.22, 0.19, 0.15), pb.y) * (0.45 + 0.55 * pb.x);
  stone = mix(stone, vec3(0.03, 0.03, 0.02), (1.0 - smoothstep(0.0, 0.25, pb.z)) * 0.5);
  // fine sand rippled by the flow, with stones scattered over it (not a paving)
  float ripple = sin(dot(p, vec2(0.6, 0.8)) * 260.0 + gn(p * 30.0) * 6.0) * 0.5 + 0.5;
  silt = mix(silt, silt * 1.25 + vec3(0.02, 0.018, 0.012), ripple * 0.35 * (1.0 - depthB * 0.5));
  vec3 bedC = mix(silt, stone * (0.7 + 0.5 * fract(pb.y * 13.7)), pebMask * step(0.8, pb.y) * smoothstep(0.0, 0.15, pb.x) * 0.85);
  // green-brown algae film and dark sunken leaves
  bedC = mix(bedC, vec3(0.04, 0.07, 0.025), smoothstep(0.5, 0.8, gfbm(p * 25.0 + 9.0)) * 0.7);
  float leaf = smoothstep(0.82, 0.86, gn(p * 55.0 + 2.0)) * smoothstep(0.3, 0.5, gn(p * 300.0));
  bedC = mix(bedC, vec3(0.08, 0.04, 0.015), leaf * 0.8);
  float bedMix = under;
  col = mix(col, bedC, bedMix);
  // the wet beach: dark sand and mud, a few pebbles
  float grit = gn(p * 900.0) * 0.6 + gn(p * 2400.0) * 0.4;
  vec3 sand = mix(vec3(0.07, 0.055, 0.035), vec3(0.16, 0.13, 0.09), grit) * (0.75 + 0.45 * gn(p * 120.0));
  // scattered pebbles, not a paving: only some cells hold a stone
  float beachStone = step(0.62, pb.y) * smoothstep(0.15, 0.4, pb.x);
  sand = mix(sand, stone * 0.9, max(pebMask * 0.6, 0.35) * beachStone);
  col = mix(col, sand, shore * (1.0 - moss));
  // the cave floor and its apron: dry grit and small stones, worn smooth
  float caveK = smoothstep(0.25, 0.85, cave) * (1.0 - under);
  vec3 grit2 = mix(vec3(0.06, 0.046, 0.032), vec3(0.13, 0.105, 0.075), grit) * (0.8 + 0.35 * gn(p * 140.0));
  grit2 = mix(grit2, soil, 0.3 * (1.0 - smoothstep(0.5, 0.95, cave)));
  // a few loose pebbles, not a paving: only some cells hold a (small, rounded) stone
  vec3 cpb = pebbles(p * 300.0 + 11.0);
  float caveStones = step(0.88, cpb.y) * smoothstep(0.3, 0.6, cpb.x);
  vec3 pebble = mix(vec3(0.1, 0.085, 0.07), vec3(0.2, 0.17, 0.13), fract(cpb.y * 7.3)) * (0.8 + 0.2 * cpb.x);
  grit2 = mix(grit2, pebble, caveStones * 0.9);
  col = mix(col, grit2, caveK);
  // wet margin
  col *= mix(1.0, 0.6, shore + wet * (1.0 - moss) * 0.4);
  g.color = col;
  // damp: a soft sheen on the humus and moss
  g.rough = mix(mix(0.74, 0.72, moss), 0.35, max(shore, bedMix * 0.6));
  g.rough = mix(g.rough, 0.45, wet * 0.6);
  // bump normal
  float e = 0.0006;
  float pbk = 0.0018 * max(bedMix, shore) * pebMask * step(0.8, pb.y);
  // silt under the water and the cave's grit are smooth; the crumb relief belongs to the dry soil
  float soilK = 1.0 - max(max(bedMix, shore), caveK) * 0.85;
  float h0 = groundBumps(p, moss) * soilK + pb.x * pbk;
  float hx = groundBumps(p + vec2(e, 0.0), moss) * soilK + stones((p + vec2(e, 0.0)) * 160.0, 0.75).x * pbk;
  float hz = groundBumps(p + vec2(0.0, e), moss) * soilK + stones((p + vec2(0.0, e)) * 160.0, 0.75).x * pbk;
  vec3 dx = vec3(e, hx - h0, 0.0), dz = vec3(0.0, hz - h0, e);
  vec3 nb = normalize(cross(dz, dx));
  vec3 n = normalize(cross(dFdy(w), dFdx(w)));
  if (n.y < 0.0) n = -n;
  // tilt the bump normal into the geometric normal frame
  g.normal = normalize(n + (nb - vec3(0.0, 1.0, 0.0)) * 1.2);
  g.ao = mix(0.75 + 0.25 * smoothstep(0.0, 1.0, gn(p * 300.0)), 0.6 + 0.4 * pb.x, bedMix);
  // puddles: when the open floor is soaked its hollows fill, deepest first,
  // and shrink back as it dries; a dark, glassy film with rings while it rains
  float level = clamp((wetMap.x - 0.5) / 0.5, 0.0, 1.0);
  g.puddle = 0.0;
  if (level > 0.0) {
    float hollow = gfbm(p * 16.0 + 5.0) * 0.75 + gn(p * 70.0) * 0.25;
    float thr = mix(0.24, 0.52, level);
    float pud = (1.0 - smoothstep(thr - 0.03, thr, hollow)) * smoothstep(0.0, 0.08, level);
    // (the cave's roof keeps its floor dry; the worn apron outside it puddles readily)
    pud *= smoothstep(0.94, 0.985, n.y) * (1.0 - moss) * (1.0 - under) * (1.0 - shore);
    vec2 rings = rainRings(p, t) * 0.35 * clamp(wetMap.y * 3.0, 0.0, 1.0);
    g.color = mix(g.color, g.color * 0.42 + vec3(0.003, 0.005, 0.007), pud);
    g.rough = mix(g.rough, 0.035, pud);
    g.normal = normalize(mix(g.normal, n, pud) + vec3(rings.x, 0.0, rings.y) * pud);
    g.ao = mix(g.ao, 1.0, pud * 0.5);
    g.puddle = pud;
  }
  // caustics on the pool bed
  vec2 cp = p * 38.0;
  float c1 = gn(cp + vec2(t * 0.35, t * 0.22)), c2 = gn(cp * 1.37 - vec2(t * 0.27, -t * 0.31));
  float caustic = pow(1.0 - abs(c1 - c2) * 2.2, 6.0);
  g.caustic = caustic * under * 0.55 * (1.0 - depthB * 0.6);
  return g;
}
`;

const WALL_GLSL = NOISE_GLSL + /* glsl */ `
struct WallSample { vec3 color; float rough; vec2 slope; float ao; };
// fine roots hanging down from the surface: wavering threads that thin and end
float wallRoots(float x, float y, float top){
  float r = 0.0;
  float depth = top - y;
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float K = k == 0 ? 11.0 : (k == 1 ? 27.0 : 63.0);
    float w = (gn(vec2(x * 5.0 + fk * 7.0, y * 16.0 + fk)) - 0.5) * 0.9 + (gn(vec2(x * 40.0 + fk * 3.0, y * 90.0)) - 0.5) * 0.18;
    float u = x * K + w;
    float id = floor(u);
    float h = gh1(vec2(id, fk * 5.1 + 1.0));
    float len = (0.012 + 0.07 * h) * (k == 0 ? 1.0 : (k == 1 ? 0.7 : 0.4));
    float wid = (k == 0 ? 0.0009 : (k == 1 ? 0.0005 : 0.00028)) * (1.0 - 0.7 * clamp(depth / len, 0.0, 1.0));
    float d = abs(fract(u) - 0.5) / K;
    float on = step(k == 0 ? 0.45 : 0.3, gh1(vec2(id * 1.7, fk + 3.0)));
    r = max(r, (1.0 - smoothstep(wid * 0.4, wid, d)) * (1.0 - smoothstep(len * 0.55, len, depth)) * on * (0.55 + 0.45 * (1.0 - fk * 0.3)));
  }
  return r * smoothstep(0.0, 0.004, depth);
}
WallSample wallSample(vec2 uv, float top, float wet){
  WallSample s;
  float x = uv.x, y = uv.y;
  // (kept at least 2 cm under the surface: where the bed dips, the pebbles do too)
  float layer = min(0.06 + (gfbm(vec2(x * 9.0, 1.0)) - 0.5) * 0.014, top - 0.022);
  // drainage layer: rounded river pebbles heaped against the glass, tan to grey-brown
  vec2 pq = vec2(x, y) * vec2(70.0, 76.0);
  bool lowLayer = y < layer + 0.006;
  vec3 pb = lowLayer ? stones(pq, 1.05) : vec3(0.0);
  float hue = fract(pb.y * 7.13);
  vec3 pc = mix(vec3(0.36, 0.25, 0.15), vec3(0.62, 0.48, 0.31), hue);
  pc = mix(pc, vec3(0.46, 0.42, 0.38), step(0.72, fract(pb.y * 3.7)) * 0.8);
  pc = mix(pc, vec3(0.5, 0.27, 0.14), step(0.82, fract(pb.y * 5.9)) * 0.75);
  pc = mix(pc, vec3(0.74, 0.65, 0.52), step(0.88, pb.y) * 0.7);
  pc = mix(pc, vec3(0.2, 0.15, 0.1), step(fract(pb.y * 11.3), 0.15) * 0.7);
  pc *= 0.85 + 0.3 * gn(vec2(x, y) * 1100.0 + pb.y * 50.0);
  float gap = 1.0 - smoothstep(0.02, 0.2, pb.x);
  vec3 peb = pc * (0.35 + 0.65 * sqrt(pb.x));
  // soil washed down between the top stones, and the dark between them all
  float fill = smoothstep(layer - 0.012, layer, y);
  peb = mix(peb, vec3(0.02, 0.014, 0.01), max(gap, fill * (1.0 - smoothstep(0.3, 0.7, pb.x))));
  // soil: dark humus with fibres, bark chips and perlite; darker and finer near the top
  float grain = gfbm(vec2(x, y) * 300.0);
  vec3 soil = vec3(0.06, 0.037, 0.022) * (0.65 + 0.7 * grain);
  float fib = gn(vec2(x * 700.0 + gn(vec2(x, y) * 60.0) * 4.0, y * 700.0) * mat2(0.8, -0.6, 0.6, 0.8));
  soil = mix(soil, vec3(0.14, 0.085, 0.045), smoothstep(0.75, 0.92, fib) * 0.4);
  // flat bark flakes lying in the mix (fewer where the noise says so), and the odd grain of perlite
  vec3 chip = stones(vec2(x, y) * vec2(110.0, 260.0) + 7.0, 0.5 + 0.35 * gn(vec2(x, y) * 40.0));
  float chipOn = step(0.95 - 0.08 * gn(vec2(x, y) * 25.0 + 3.0), chip.y) * smoothstep(0.0, 0.2, chip.x) * smoothstep(0.3, 0.6, gn(vec2(x, y) * 900.0 + chip.y * 30.0) + chip.x * 0.4);
  soil = mix(soil, mix(vec3(0.07, 0.036, 0.018), vec3(0.15, 0.075, 0.035), fract(chip.y * 9.1)) * (0.6 + 0.5 * chip.x), chipOn * 0.7);
  // crumbs: the mix is granular, each grain catching a little light
  vec3 crumb = stones(vec2(x, y) * 1300.0 + 5.0, 1.0);
  soil *= 0.62 + 0.55 * crumb.x * (0.7 + 0.6 * crumb.y);
  vec3 perlite = stones(vec2(x, y) * 700.0 + 3.0, 0.4);
  soil = mix(soil, vec3(0.55, 0.53, 0.5) * (0.5 + 0.5 * perlite.x), step(0.975, perlite.y) * smoothstep(0.0, 0.3, perlite.x) * 0.6);
  float depth = top - y;
  soil *= mix(0.7, 1.0, smoothstep(0.0, 0.03, depth));
  // the top: a band of leaf litter and moss pressed against the glass
  float litterBand = (1.0 - smoothstep(0.004, 0.011 + 0.006 * gn(vec2(x * 30.0, 2.0)), depth)) * (1.0 - wet);
  vec3 lf = depth < 0.02 ? stones(vec2(x * 70.0, y * 420.0) + 2.0, 0.95) : vec3(0.0);
  vec3 litter = mix(vec3(0.12, 0.06, 0.025), vec3(0.3, 0.17, 0.07), lf.y) * (0.45 + 0.4 * lf.x + 0.3 * gn(vec2(x * 600.0, y * 2000.0)));
  litter = mix(litter, vec3(0.04, 0.075, 0.018) * (0.7 + 0.5 * lf.x), step(0.8, fract(lf.y * 5.3)));
  soil = mix(soil, litter, litterBand * smoothstep(0.0, 0.1, lf.x) * step(0.25, lf.y) * smoothstep(0.25, 0.5, gn(vec2(x * 300.0, y * 900.0)) + 0.3));
  // roots
  float root = wallRoots(x, y, top) * (1.0 - wet) * smoothstep(layer, layer + 0.01, y);
  soil = mix(soil, vec3(0.42, 0.32, 0.2) * (0.8 + 0.3 * gn(vec2(x, y) * 800.0)), root * 0.85);
  float isPeb = 1.0 - smoothstep(layer - 0.003, layer + 0.003, y);
  vec3 col = mix(soil, peb, isPeb);
  // under the pool: wet and darker
  col *= mix(1.0, 0.7, wet);
  s.color = col;
  s.rough = mix(mix(0.95, 0.38, isPeb * (1.0 - gap)), 0.35, wet * 0.5);
  // slope from the pebble domes (finite difference)
  float e = 0.0006;
  float hx = lowLayer ? stones(vec2(x + e, y) * vec2(70.0, 76.0), 1.05).x : 0.0, hy = lowLayer ? stones(vec2(x, y + e) * vec2(70.0, 76.0), 1.05).x : 0.0;
  s.slope = isPeb * clamp(vec2(pb.x - hx, pb.x - hy) * 3.0, -1.5, 1.5) + (1.0 - isPeb) * (root * vec2(0.0, 0.15) + chip.x * chipOn * vec2(0.1));
  s.ao = mix(0.8 + 0.2 * grain, 0.15 + 0.85 * pb.x, isPeb);
  return s;
}
`;

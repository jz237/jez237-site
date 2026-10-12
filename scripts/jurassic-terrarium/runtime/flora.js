// Mesozoic planting: tree ferns and cycads where Weatherglass grew broadleaf trees, fern carpets over the
// meadows and horsetails along the water. Plants are built like Weatherglass's own trees (floragen.js:
// textured frond cards with alpha-to-coverage edges), instanced, and bent about their roots by
// Weatherglass's wind field (windAt) plus a per-plant spring when an animal pushes through.
import {
  Group, InstancedMesh, MeshStandardMaterial, MeshDepthMaterial, RGBADepthPacking, Matrix4, Quaternion, Vector3,
  Vector4, Vector2, Color, DoubleSide, InstancedBufferAttribute, DynamicDrawUsage,
} from 'three';
import { frondAtlas, plantGeometry, BASE_H } from './floragen.js';

const UP = new Vector3(0, 1, 0);
const _top = new Vector3();

const JUNGLE = {
  grass: new Color(0x1c3614).convertSRGBToLinear(),
  dry: new Color(0x3e4424).convertSRGBToLinear(),
  foliage: new Color(0x2c4a22).convertSRGBToLinear(),
  foliage2: new Color(0x3d5a26).convertSRGBToLinear(),
};

export class Flora {
  constructor(ctx, S, rand) {
    this.ctx = ctx;
    this.S = S; // metres -> units
    this.rand = rand;
    this.group = new Group();
    this.group.name = 'jurassic-flora';
    this.uniforms = {
      uFTime: { value: 0 },
      uFWind: { value: 0.2 },
      uTint: { value: new Color(1, 1, 1) },
      uFWindDir: { value: new Vector2(0.94, 0.34) },
      // a roar close by: plants within the radius shiver (x, z, radius, strength 0..1)
      uShiver: { value: new Vector4(0, 0, 0, 0) },
    };
    this.obstacles = []; // {x, z, r} trunks for the dinosaurs' route finder
    this.placements = {};
    this.plan();
  }

  // ---------------------------------------------------------------- where things grow
  plan() {
    const { ctx, rand } = this;
    const T = ctx.terrain;
    const sh = T.shape;
    const box = ctx.box;
    const cabin = sh.CABIN;
    const P = (this.placements = { treefern: [], cycad: [], fern: [], horsetail: [], fernlet: [], redplant: [] });
    const taken = [];
    const free = (x, z, r) => taken.every((t) => Math.hypot(t.x - x, t.z - z) > t.r + r);
    const inBox = (x, z, m) => Math.abs(x) < box.halfW - m && Math.abs(z) < box.halfD - m;
    const denAt = window.__jtDenAt || (() => false);
    const nearCabin = (x, z, r) =>
      (cabin && Math.hypot(x - cabin.x, z - cabin.z) < (cabin.padRadius || 0.75) + r) || denAt(x, z, r);
    const water = (x, z) => Math.max(T.lakeMask(x, z), T.riverMask(x, z));
    const add = (kind, x, z, scale, r, block) => {
      P[kind].push({ x, z, y: T.height(x, z), scale, rot: rand() * Math.PI * 2, v: Math.floor(rand() * 8) });
      taken.push({ x, z, r });
      if (block) this.obstacles.push({ x, z, r: block });
    };
    const groveAt = (cx, cz, n, spread) => {
      for (let i = 0; i < n * 6 && n > 0; i++) {
        const a = rand() * Math.PI * 2, d = spread * Math.sqrt(rand());
        const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
        if (!inBox(x, z, 0.35) || nearCabin(x, z, 0.3) || water(x, z) > 0.2 || T.slope(x, z) > 0.45) continue;
        const kind = rand() < 0.6 ? 'treefern' : 'cycad';
        const r = kind === 'treefern' ? 0.18 : 0.12;
        if (!free(x, z, r)) continue;
        add(kind, x, z, (kind === 'treefern' ? 0.75 : 1.0) + rand() * 0.5, r, kind === 'treefern' ? 0.05 : 0.04);
        n--;
      }
    };
    // tall tree ferns standing over the jungle like the palms in a diorama, around the edges and up the
    // foothills where they frame the scene
    const heroes = [[-7.6, 1.6], [-6.8, -1.6], [-5.2, -2.6], [-3.3, 0.9], [-1.6, -1.9], [2.4, -1.5], [3.4, 1.0],
      [7.5, -2.4], [8.0, 0.4], [7.0, 2.6], [-8.0, -0.3], [0.9, 2.9]];
    for (const [hx, hz] of heroes) {
      for (let t = 0; t < 12; t++) {
        const x = hx + (rand() - 0.5) * 0.6, z = hz + (rand() - 0.5) * 0.6;
        if (!inBox(x, z, 0.4) || nearCabin(x, z, 0.3) || water(x, z) > 0.15 || T.slope(x, z) > 0.6 || !free(x, z, 0.22)) continue;
        add('treefern', x, z, 1.45 + rand() * 0.55, 0.22, 0.06);
        break;
      }
    }
    // browse trees: tall tree ferns on open, gentle ground, their crowns at the height a Brachiosaurus
    // feeds (scaled to fit when the mesh loads), placed so it can stand beside them inside the glass
    const browse = [];
    for (let tries = 0; tries < 4000 && browse.length < 5; tries++) {
      const x = (rand() * 2 - 1) * 7.2, z = (rand() * 2 - 1) * 2.4;
      const h = T.height(x, z);
      if (h < 0.05 || h > 0.9 || T.slope(x, z) > 0.14 || water(x, z) > 0.05 || nearCabin(x, z, 0.6)) continue;
      if (!free(x, z, 0.35) || browse.some((b) => Math.hypot(b.x - x, b.z - z) < 2.2)) continue;
      // open ground around it for the browser to stand on
      let open = 0;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2, sx = x + Math.cos(a) * 1.7, sz = z + Math.sin(a) * 1.7;
        if (Math.abs(sx) < 6.7 && Math.abs(sz) < 1.75 && T.slope(sx, sz) < 0.2 && water(sx, sz) < 0.1) open++;
      }
      if (open < 2) continue;
      browse.push({ x, z });
      add('treefern', x, z, 1.6, 0.25, 0.06);
      P.treefern[P.treefern.length - 1].wantTop = 2.2; // crown this far above its foot
    }
    // where Weatherglass's hero trees stood, and a few groves
    groveAt(-3.95, 0.25, 4, 0.6);
    groveAt(-3.75, 2.4, 3, 0.45);
    groveAt(3.3, 0.35, 3, 0.5);
    groveAt(-4.95, 1.5, 3, 0.4);
    // scattered tree ferns and cycads by the terrain's tree suitability
    let tries = 0;
    let want = 34;
    while (want > 0 && tries++ < 12000) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.4), z = (rand() * 2 - 1) * (box.halfD - 0.4);
      // meadow edges and the lower mountain slopes, like the palms climbing the peaks in a jungle diorama
      const s = Math.max(sh.suitability(x, z, 'tree'), 0.7 * sh.suitability(x, z, 'pine'));
      if (rand() > s * 1.6 || water(x, z) > 0.15 || nearCabin(x, z, 0.35) || T.slope(x, z) > 0.62) continue;
      const kind = rand() < 0.55 ? 'treefern' : 'cycad';
      const r = kind === 'treefern' ? 0.2 : 0.13;
      if (!free(x, z, r)) continue;
      add(kind, x, z, (kind === 'treefern' ? 0.65 : 0.9) + rand() * 0.5, r, kind === 'treefern' ? 0.05 : 0.04);
      want--;
    }
    // ferns carpet the meadows, thickest under the tree ferns
    const tier = ctx.quality?.tier ?? 1; // 0 low, 1 medium, 2 high
    tries = 0;
    want = [180, 330, 450][tier] ?? 330;
    while (want > 0 && tries++ < 20000) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.15), z = (rand() * 2 - 1) * (box.halfD - 0.15);
      const g = sh.suitability(x, z, 'grass');
      const near = P.treefern.some((t) => Math.hypot(t.x - x, t.z - z) < 0.5);
      if (rand() > g * 1.4 + (near ? 0.5 : 0) || water(x, z) > 0.1 || nearCabin(x, z, 0.1)) continue;
      if (!free(x, z, 0.035)) continue;
      add('fern', x, z, 1.3 + rand() * 1.0, 0.035, 0);
      want--;
    }
    // a carpet of small ferns over everything that isn't water, rock, path or building
    tries = 0;
    want = [700, 1400, 2200][tier] ?? 1400;
    while (want > 0 && tries++ < 60000) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.1), z = (rand() * 2 - 1) * (box.halfD - 0.1);
      const g = Math.max(sh.suitability(x, z, 'grass'), 0.6 * sh.suitability(x, z, 'flower'));
      const sl = T.slope(x, z);
      if (rand() > g * 1.8 + 0.15 || water(x, z) > 0.08 || nearCabin(x, z, 0.05) || sl > 0.7) continue;
      add('fernlet', x, z, 1.3 + rand() * 1.3, 0.0, 0);
      want--;
    }
    // crimson rosettes in drifts under the tree ferns and along the paths
    tries = 0;
    want = [80, 160, 240][tier] ?? 160;
    while (want > 0 && tries++ < 30000) {
      const host = P.treefern.length && rand() < 0.7 ? P.treefern[Math.floor(rand() * P.treefern.length)] : null;
      const x = host ? host.x + (rand() - 0.5) * 0.9 : (rand() * 2 - 1) * (box.halfW - 0.2);
      const z = host ? host.z + (rand() - 0.5) * 0.9 : (rand() * 2 - 1) * (box.halfD - 0.2);
      if (Math.abs(x) > box.halfW - 0.15 || Math.abs(z) > box.halfD - 0.15) continue;
      if (water(x, z) > 0.08 || nearCabin(x, z, 0.05) || T.slope(x, z) > 0.6) continue;
      if (!free(x, z, 0.03)) continue;
      add('redplant', x, z, 1.2 + rand() * 1.0, 0.03, 0);
      want--;
    }
    // horsetails crowd the shore of the lake and the river banks
    tries = 0;
    want = [40, 70, 90][tier] ?? 70;
    while (want > 0 && tries++ < 20000) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.2), z = (rand() * 2 - 1) * (box.halfD - 0.2);
      const w = water(x, z);
      if (w < 0.05 || w > 0.45 || T.slope(x, z) > 0.5 || nearCabin(x, z, 0.2)) continue;
      if (!free(x, z, 0.03)) continue;
      add('horsetail', x, z, 0.8 + rand() * 0.6, 0.03, 0);
      want--;
    }
  }

  // ---------------------------------------------------------------- meshes
  async load() {
    this.plants = [];
    this.live = [];
    this.grid = new Map();
    this.cell = 0.5;
    const tier = this.ctx.quality?.tier ?? 1;
    this.atlas = frondAtlas(tier === 0 ? 512 : 1024);
    const M = new Matrix4(), q = new Quaternion(), s = new Vector3(), t = new Vector3(), col = new Color();
    for (const [kind, list] of Object.entries(this.placements)) {
      const variants = kind === 'treefern' || kind === 'cycad' ? 4 : 3;
      for (let vi = 0; vi < variants; vi++) {
        const mine = list.filter((p) => p.v % variants === vi);
        if (!mine.length) continue;
        const geo = plantGeometry(kind, vi);
        const H = geo.boundingBox.max.y; // height at scale 1
        const im = new InstancedMesh(geo, this.material(kind), mine.length);
        const attr = new InstancedBufferAttribute(new Float32Array(mine.length * 2), 2);
        attr.setUsage(DynamicDrawUsage);
        geo.setAttribute('aBend', attr);
        const mo = Flora.MOTION[kind] || Flora.MOTION.fern;
        mine.forEach((p, i) => {
          q.setFromAxisAngle(UP, p.rot);
          // same size as the planting it replaces; browse trees sized so the crown is at the wanted height
          const sc = p.wantTop ? p.wantTop / H : (p.scale * BASE_H[kind]) / H;
          s.set(sc, p.wantTop ? sc : sc * (0.92 + ((p.v * 0.137) % 0.16)), sc);
          t.set(p.x, p.y - 0.004, p.z);
          M.compose(t, q, s);
          im.setMatrixAt(i, M);
          // a little colour variation per plant
          const k = 1.0 + ((p.v * 0.618 + i * 0.31) % 1) * 0.26;
          col.setRGB(k, k * (0.97 + ((i * 0.13) % 0.06)), k * 0.95);
          im.setColorAt(i, col);
          p.top = p.y + H * s.y; // crown height, for browsers
          const rec = { x: p.x, z: p.z, y: p.y, H: Math.max(0.02, H * s.y), give: mo.give, k: mo.k, crown: !!mo.crown,
            attr, i, bx: 0, bz: 0, vx: 0, vz: 0, tx: 0, tz: 0, live: false };
          this.plants.push(rec);
          const key = Math.floor(p.x / this.cell) * 4096 + Math.floor(p.z / this.cell);
          if (!this.grid.has(key)) this.grid.set(key, []);
          this.grid.get(key).push(rec);
        });
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = kind === 'treefern' || kind === 'cycad';
        if (im.castShadow) im.customDepthMaterial = this.depthMaterial(kind);
        im.receiveShadow = true;
        im.frustumCulled = false;
        im.name = `flora-${kind}-${vi}`;
        this.group.add(im);
      }
    }
  }

  // How each kind moves. flex: wind bend (radians per unit of wind); give: how far a body can push it
  // aside (0 = not at all); curve: how the bend is spread up the plant (higher = stiff stem, supple top);
  // k: spring stiffness, i.e. how fast it swings back once released.
  static MOTION = {
    fern: { flex: 0.48, give: 1.0, curve: 1.3, k: 70 },
    fernlet: { flex: 0.56, give: 1.0, curve: 1.2, k: 90 },
    redplant: { flex: 0.3, give: 0.8, curve: 1.4, k: 110 },
    horsetail: { flex: 0.5, give: 0.9, curve: 1.1, k: 60 },
    treefern: { flex: 0.15, give: 0.22, curve: 3.0, k: 25, crown: true },
    cycad: { flex: 0.12, give: 0.35, curve: 2.0, k: 45 },
  };

  // Every plant bends about its own root by a 2D bend vector (radians at the tip, pointing where the
  // top goes): wind (computed here in the shader, gusts rolling across the case) plus a per-plant
  // spring bend (aBend, simulated on the CPU when an animal pushes through it).
  // the bend about the root (wind field + spring + shiver), shared by the colour and shadow materials
  bendChunk(kind) {
    const M = Flora.MOTION[kind] || Flora.MOTION.fern;
    return `#include <begin_vertex>
  #ifdef USE_INSTANCING
  mat4 toW = modelMatrix * instanceMatrix;
  #else
  mat4 toW = modelMatrix;
  #endif
  vec3 base = toW[3].xyz;
  float ph = dot(base.xz, vec2(3.7, 2.9));
  // Weatherglass's wind: the simulated field (the wind tool, gusts) and its travelling gusts
  vec2 wv = windAt(base.xz);
  float wl = length(wv);
  vec2 bend = aBend + wv * ${(M.flex * 0.42).toFixed(3)}
    + uFWindDir * ${(M.flex * 0.06).toFixed(3)} * sin(uFTime * 0.9 + ph)                               // never quite still
    + vec2(sin(uFTime * 5.3 + aPh + ph), cos(uFTime * 4.7 + aPh * 1.3)) * ${(M.flex * 0.05).toFixed(3)} * min(wl, 2.0); // flutter
  float shD = length(base.xz - uShiver.xy);
  if (uShiver.w > 0.0 && shD < uShiver.z)
    bend += vec2(sin(uFTime * 41.0 + ph * 3.0), cos(uFTime * 37.0 + ph * 2.0)) * uShiver.w * (1.0 - shD / uShiver.z) * 0.22;
  float bl = min(length(bend), 1.35);
  if (bl > 1e-4) {
    float ang = bl * pow(clamp(aT, 0.0, 1.3), ${M.curve.toFixed(2)});
    vec3 axis = vec3(bend.y, 0.0, -bend.x) / max(length(bend), 1e-5);
    vec3 vw = (toW * vec4(transformed, 1.0)).xyz;
    vec3 r = vw - base;
    float c = cos(ang), s = sin(ang);
    vec3 rr = r * c + cross(axis, r) * s + axis * dot(axis, r) * (1.0 - c);
    transformed += inverse(mat3(toW)) * (rr - r);
  }`;
  }

  head() {
    return `${this.ctx.GLSL_COMMON}
uniform float uFTime;
uniform vec2 uFWindDir;
uniform vec4 uShiver;
attribute float aT;
attribute float aPh;
attribute vec2 aBend;
`;
  }

  hookUniforms(sh) {
    Object.assign(sh.uniforms, this.ctx.uniforms);
    const U = this.uniforms;
    sh.uniforms.uFTime = U.uFTime;
    sh.uniforms.uFWindDir = U.uFWindDir;
    sh.uniforms.uShiver = U.uShiver;
    sh.uniforms.uTint = U.uTint;
  }

  // Shaded like Weatherglass's foliage: frond atlas with alpha-to-coverage, ambient occlusion in the heart
  // of the plant (vertex colour), per-plant colour variation (instance colour), a soft glow when lit from
  // behind, and alpha kept up at a distance so canopies stay full instead of thinning and sparkling.
  material(kind) {
    const tier = this.ctx.quality?.tier ?? 1;
    const m = new MeshStandardMaterial({
      map: this.atlas, vertexColors: true, roughness: 0.78, metalness: 0, side: DoubleSide,
      alphaTest: 0.5, alphaToCoverage: tier > 0, envMapIntensity: 0.55,
    });
    m.onBeforeCompile = (sh) => {
      this.hookUniforms(sh);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + this.head() + 'varying vec3 vFWorld;\nvarying float vTrunk;')
        .replace('#include <begin_vertex>', this.bendChunk(kind))
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  vFWorld = (toW * vec4(transformed, 1.0)).xyz;\n  vTrunk = uv.x < -0.5 ? 1.0 : 0.0;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uTint;\nuniform vec3 uLightDir;\nuniform vec3 uLightColor;\nvarying vec3 vFWorld;\nvarying float vTrunk;')
        .replace('#include <map_fragment>', `
  if (vTrunk > 0.5) {
    diffuseColor.rgb *= vec3(0.36, 0.25, 0.16) * 1.6; // fibrous trunk: brown, shaded by the vertex colour
  } else {
    vec4 tx = texture2D(map, vMapUv);
    vec2 ts = vMapUv * vec2(textureSize(map, 0));
    float lod = max(0.0, 0.5 * log2(max(dot(dFdx(ts), dFdx(ts)), dot(dFdy(ts), dFdy(ts)))));
    tx.a = clamp(tx.a * (1.0 + lod * 0.32), 0.0, 1.0); // keep fronds full at a distance
    diffuseColor *= tx;
  }`)
        .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= uTint;')
        .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
  if (vTrunk < 0.5) {
    // light through the fronds when the sun is behind them
    vec3 V = normalize(cameraPosition - vFWorld);
    float back = pow(clamp(dot(V, -uLightDir), 0.0, 1.0), 3.0);
    reflectedLight.indirectDiffuse += diffuseColor.rgb * uLightColor * back * 0.28;
  }`);
    };
    m.customProgramCacheKey = () => `jt-flora-${kind}`;
    return m;
  }

  depthMaterial(kind) {
    const m = new MeshDepthMaterial({ map: this.atlas, alphaTest: 0.5, depthPacking: RGBADepthPacking, side: DoubleSide });
    m.onBeforeCompile = (sh) => {
      this.hookUniforms(sh);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + this.head())
        .replace('#include <begin_vertex>', this.bendChunk(kind));
    };
    m.customProgramCacheKey = () => `jt-flora-depth-${kind}`;
    return m;
  }

  // a roar at (x, z): plants within r shiver, fading out
  shiver(x, z, r, strength = 1) {
    this.uniforms.uShiver.value.set(x, z, r, strength);
  }

  // spheres along animals' bodies (from the runtime each frame): {x, y, z, r}
  setPushers(list) {
    this.pushers = list;
  }

  // The springs: plants touched by a body are driven towards a bend away from it (flattened when the
  // body is right over them); released, they swing back and wobble a little before settling. Only
  // plants that are being touched or still moving are simulated.
  simulate(dt) {
    if (!this.plants || dt <= 0) return;
    dt = Math.min(dt, 1 / 30);
    const G = this.grid, cs = this.cell;
    const touched = this._touched || (this._touched = new Set());
    touched.clear();
    for (const s of this.pushers || []) {
      const reachMax = s.r + 0.45;
      const i0 = Math.floor((s.x - reachMax) / cs), i1 = Math.floor((s.x + reachMax) / cs);
      const j0 = Math.floor((s.z - reachMax) / cs), j1 = Math.floor((s.z + reachMax) / cs);
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const list = G.get(i * 4096 + j);
          if (!list) continue;
          for (const p of list) {
            if (!p.give) continue;
            // vertical: low bodies push low plants; only a head up in the fronds pushes a crown
            if (p.crown ? s.y < p.y + p.H * 0.6 || s.y > p.y + p.H * 1.25 : s.y - s.r > p.y + p.H * 1.15 || s.y + s.r < p.y) continue;
            const dx = p.x - s.x, dz = p.z - s.z, d = Math.hypot(dx, dz);
            const reach = s.r + (p.crown ? p.H * 0.25 : p.H * 0.55);
            if (d >= reach) continue;
            const k = 1 - d / reach;
            const mag = Math.min(1.45, (0.35 + 1.25 * k) * k * 1.6) * p.give;
            const ux = d > 1e-4 ? dx / d : 1, uz = d > 1e-4 ? dz / d : 0;
            if (!touched.has(p) || mag > Math.hypot(p.tx, p.tz)) {
              p.tx = ux * mag;
              p.tz = uz * mag;
            }
            touched.add(p);
            if (!p.live) {
              p.live = true;
              this.live.push(p);
            }
          }
        }
      }
    }
    const dirty = this._dirty || (this._dirty = new Set());
    dirty.clear();
    for (let n = this.live.length - 1; n >= 0; n--) {
      const p = this.live[n];
      const on = touched.has(p);
      if (!on) p.tx = p.tz = 0;
      // pushed: give way quickly; released: a softer, under-damped return (a little overshoot)
      const K = on ? p.k * 2.5 : p.k, C = 2 * Math.sqrt(K) * (on ? 0.9 : 0.38);
      p.vx += (K * (p.tx - p.bx) - C * p.vx) * dt;
      p.vz += (K * (p.tz - p.bz) - C * p.vz) * dt;
      p.bx += p.vx * dt;
      p.bz += p.vz * dt;
      if (!on && Math.abs(p.bx) + Math.abs(p.bz) + 0.1 * (Math.abs(p.vx) + Math.abs(p.vz)) < 0.002) {
        p.bx = p.bz = p.vx = p.vz = 0;
        p.live = false;
        this.live[n] = this.live[this.live.length - 1];
        this.live.pop();
      }
      const a = p.attr.array;
      a[p.i * 2] = p.bx;
      a[p.i * 2 + 1] = p.bz;
      dirty.add(p.attr);
    }
    for (const attr of dirty) attr.needsUpdate = true;
  }

  update(dt) {
    // a deep, mossy jungle floor instead of a bright meadow: Weatherglass recomputes its seasonal
    // palette every frame and copies it into the terrain and grass shaders afterwards
    const sea = this.ctx.world.seasonal;
    if (sea?.grass) {
      sea.grass.lerp(JUNGLE.grass, 0.75);
      sea.grassDry?.lerp(JUNGLE.dry, 0.7);
      sea.foliage?.lerp(JUNGLE.foliage, 0.35);
      sea.foliage2?.lerp(JUNGLE.foliage2, 0.35);
    }
    const U = this.uniforms;
    U.uFTime.value += dt;
    this.simulate(dt);
    // the prevailing wind swings slowly round
    const wa = 0.35 + 0.5 * Math.sin(U.uFTime.value * 0.031) + 0.25 * Math.sin(U.uFTime.value * 0.083);
    U.uFWindDir.value.set(Math.cos(wa), Math.sin(wa));
    U.uShiver.value.w = Math.max(0, U.uShiver.value.w - dt * 0.6);
    // seasons: ferns brown a little in autumn and dull in winter
    const env = this.ctx.modules.life?.env;
    if (env) {
      const a = env.autumn || 0, wi = env.winter || 0;
      U.uTint.value.setRGB(1 + 0.18 * a - 0.12 * wi, 1 - 0.08 * a - 0.12 * wi, 1 - 0.3 * a - 0.05 * wi);
    }
  }
}

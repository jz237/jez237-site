// Mesozoic planting: tree ferns and cycads where Weatherglass grew broadleaf trees, fern carpets over the
// meadows and horsetails along the water. Plants are instanced Blender meshes (scripts/.../blender/flora.py);
// a small shader patch bends them in the wind, more the higher a vertex sits on the plant.
import {
  Group, InstancedMesh, MeshStandardMaterial, Matrix4, Quaternion, Vector3, Vector4, Vector2, Color, DoubleSide,
  InstancedBufferAttribute, DynamicDrawUsage,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

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
      uTime: { value: 0 },
      uWind: { value: 0.2 },
      uTint: { value: new Color(1, 1, 1) },
      uWindDir: { value: new Vector2(0.94, 0.34) },
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
    want = [450, 900, 1500][tier] ?? 900;
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
  async load(base) {
    this.plants = [];
    this.live = [];
    this.grid = new Map();
    this.cell = 0.5;
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const kinds = Object.keys(this.placements);
    await Promise.all(
      kinds.map(async (kind) => {
        const gltf = await loader.loadAsync(new URL(`${kind}.glb`, base).href);
        const meshes = [];
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((o) => o.isMesh && meshes.push(o));
        const list = this.placements[kind];
        meshes.forEach((m, vi) => {
          const mine = list.filter((p) => p.v % meshes.length === vi);
          if (!mine.length) return;
          m.geometry.computeBoundingBox();
          const bb = m.geometry.boundingBox;
          const im = new InstancedMesh(m.geometry, this.material(kind, bb.min.y, bb.max.y), mine.length);
          const M = new Matrix4(), q = new Quaternion(), s = new Vector3(), t = new Vector3();
          mine.forEach((p, i) => {
            q.setFromAxisAngle(UP, p.rot);
            if (p.wantTop) {
              // scale this one so the crown lands at its wanted height (the transform is linear in scale)
              M.compose(t.set(0, 0, 0), q, s.setScalar(this.S)).multiply(m.matrixWorld);
              const h1 = _top.set(0, bb.max.y, 0).applyMatrix4(M).y;
              p.scale = (p.wantTop + 0.004) / Math.max(h1, 1e-4);
            }
            const sc = p.scale * this.S;
            s.set(sc, sc, sc);
            t.set(p.x, p.y - 0.004, p.z);
            M.compose(t, q, s);
            // the compressed mesh is stored normalised; its node carries the real size and offset
            M.multiply(m.matrixWorld);
            im.setMatrixAt(i, M);
            p.top = _top.set(0, bb.max.y, 0).applyMatrix4(M).y; // crown height, for browsers
          });
          im.instanceMatrix.needsUpdate = true;
          // per-plant spring bend, written by simulate()
          const attr = new InstancedBufferAttribute(new Float32Array(mine.length * 2), 2);
          attr.setUsage(DynamicDrawUsage);
          im.geometry = im.geometry.clone();
          im.geometry.setAttribute('aBend', attr);
          const mo = Flora.MOTION[kind] || Flora.MOTION.fern;
          mine.forEach((p, i) => {
            im.getMatrixAt(i, M);
            const top = _top.set(0, bb.max.y, 0).applyMatrix4(M).y;
            const rec = { x: p.x, z: p.z, y: p.y, H: Math.max(0.02, top - p.y), give: mo.give, k: mo.k, crown: !!mo.crown,
              attr, i, bx: 0, bz: 0, vx: 0, vz: 0, tx: 0, tz: 0, live: false };
            this.plants.push(rec);
            const key = Math.floor(p.x / this.cell) * 4096 + Math.floor(p.z / this.cell);
            if (!this.grid.has(key)) this.grid.set(key, []);
            this.grid.get(key).push(rec);
          });
          im.castShadow = kind === 'treefern' || kind === 'cycad';
          im.receiveShadow = true;
          im.frustumCulled = false;
          im.name = `flora-${kind}-${vi}`;
          this.group.add(im);
        });
      }),
    );
  }

  // sway is measured within each mesh's own bounding box (the compressed geometry is normalised), so the
  // same numbers work whatever the plant's size: 0 at the root, 1 at the top, tip moving a fraction of the
  // plant's height
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
  material(kind, y0 = 0, y1 = 1) {
    const U = this.uniforms;
    const M = Flora.MOTION[kind] || Flora.MOTION.fern;
    const m = new MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0, side: DoubleSide });
    const h = Math.max(1e-4, y1 - y0);
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = U.uTime;
      sh.uniforms.uWind = U.uWind;
      sh.uniforms.uWindDir = U.uWindDir;
      sh.uniforms.uTint = U.uTint;
      sh.uniforms.uShiver = U.uShiver;
      sh.vertexShader = sh.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform float uTime;\nuniform float uWind;\nuniform vec2 uWindDir;\nuniform vec4 uShiver;\nattribute vec2 aBend;',
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
  #ifdef USE_INSTANCING
  mat4 toW = modelMatrix * instanceMatrix;
  #else
  mat4 toW = modelMatrix;
  #endif
  vec3 base = toW[3].xyz;
  float ph = dot(base.xz, vec2(3.7, 2.9));
  float f = clamp((position.y - (${y0.toFixed(4)})) / ${h.toFixed(4)}, 0.0, 1.2); // 0 at the root, 1 at the top
  // wind: a steady lean down-wind and gusts that roll across the case, with a quick flutter on top
  vec2 across = vec2(-uWindDir.y, uWindDir.x);
  float gust = 0.5 + 0.5 * sin(dot(base.xz, uWindDir) * 1.3 - uTime * 1.7 + sin(dot(base.xz, across) * 0.8 + uTime * 0.37) * 1.6);
  float wl = uWind * ${M.flex.toFixed(3)} * (0.2 + 0.8 * gust * gust);
  vec2 bend = aBend + uWindDir * wl
    + vec2(sin(uTime * 6.7 + ph * 2.3), cos(uTime * 5.9 + ph * 1.7)) * 0.035 * uWind * ${M.flex.toFixed(3)} * (0.5 + gust) * 2.0;
  // a roar close by: everything shivers
  float shD = length(base.xz - uShiver.xy);
  if (uShiver.w > 0.0 && shD < uShiver.z)
    bend += vec2(sin(uTime * 41.0 + ph * 3.0), cos(uTime * 37.0 + ph * 2.0)) * uShiver.w * (1.0 - shD / uShiver.z) * 0.22;
  float bl = min(length(bend), 1.45);
  if (bl > 1e-4) {
    // rotate about the root, the stem curving most towards the top (keeps the frond lengths)
    float ang = bl * pow(f, ${M.curve.toFixed(2)});
    vec3 axis = vec3(bend.y, 0.0, -bend.x) / max(length(bend), 1e-5);
    vec3 vw = (toW * vec4(transformed, 1.0)).xyz;
    vec3 r = vw - base;
    float c = cos(ang), s = sin(ang);
    vec3 rr = r * c + cross(axis, r) * s + axis * dot(axis, r) * (1.0 - c);
    transformed += inverse(mat3(toW)) * (rr - r);
  }`,
        );
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uTint;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= uTint;');
    };
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
    U.uTime.value += dt;
    this.simulate(dt);
    // the prevailing wind swings slowly round
    const wa = 0.35 + 0.5 * Math.sin(U.uTime.value * 0.031) + 0.25 * Math.sin(U.uTime.value * 0.083);
    U.uWindDir.value.set(Math.cos(wa), Math.sin(wa));
    U.uShiver.value.w = Math.max(0, U.uShiver.value.w - dt * 0.6);
    const w = this.ctx.world;
    U.uWind.value += ((w.windEnergy || 0) * 1.5 + 0.15 - U.uWind.value) * Math.min(1, dt);
    // seasons: ferns brown a little in autumn and dull in winter
    const env = this.ctx.modules.life?.env;
    if (env) {
      const a = env.autumn || 0, wi = env.winter || 0;
      U.uTint.value.setRGB(1 + 0.18 * a - 0.12 * wi, 1 - 0.08 * a - 0.12 * wi, 1 - 0.3 * a - 0.05 * wi);
    }
  }
}

// Mesozoic planting: tree ferns and cycads where Weatherglass grew broadleaf trees, fern carpets over the
// meadows and horsetails along the water. Plants are instanced Blender meshes (scripts/.../blender/flora.py);
// a small shader patch bends them in the wind, more the higher a vertex sits on the plant.
import {
  Group, InstancedMesh, MeshStandardMaterial, Matrix4, Quaternion, Vector3, Color, DoubleSide,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const UP = new Vector3(0, 1, 0);
const JUNGLE = {
  grass: new Color(0x23401a).convertSRGBToLinear(),
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
    this.uniforms = { uTime: { value: 0 }, uWind: { value: 0.2 }, uTint: { value: new Color(1, 1, 1) } };
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
        add(kind, x, z, (kind === 'treefern' ? 1.1 : 1.3) + rand() * 0.6, r, kind === 'treefern' ? 0.05 : 0.04);
        n--;
      }
    };
    // where Weatherglass's hero trees stood, and a few groves
    groveAt(-3.95, 0.25, 4, 0.6);
    groveAt(-3.75, 2.4, 3, 0.45);
    groveAt(3.3, 0.35, 3, 0.5);
    groveAt(-4.95, 1.5, 3, 0.4);
    // scattered tree ferns and cycads by the terrain's tree suitability
    let tries = 0;
    let want = 64;
    while (want > 0 && tries++ < 12000) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.4), z = (rand() * 2 - 1) * (box.halfD - 0.4);
      // meadow edges and the lower mountain slopes, like the palms climbing the peaks in a jungle diorama
      const s = Math.max(sh.suitability(x, z, 'tree'), 0.7 * sh.suitability(x, z, 'pine'));
      if (rand() > s * 1.6 || water(x, z) > 0.15 || nearCabin(x, z, 0.35) || T.slope(x, z) > 0.62) continue;
      const kind = rand() < 0.55 ? 'treefern' : 'cycad';
      const r = kind === 'treefern' ? 0.2 : 0.13;
      if (!free(x, z, r)) continue;
      add(kind, x, z, (kind === 'treefern' ? 1.0 : 1.2) + rand() * 0.6, r, kind === 'treefern' ? 0.05 : 0.04);
      want--;
    }
    // ferns carpet the meadows, thickest under the tree ferns
    const tier = ctx.quality?.tier ?? 1; // 0 low, 1 medium, 2 high
    tries = 0;
    want = [120, 220, 300][tier] ?? 220;
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
    want = [50, 100, 150][tier] ?? 100;
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
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const kinds = Object.keys(this.placements);
    await Promise.all(
      kinds.map(async (kind) => {
        const gltf = await loader.loadAsync(new URL(`${kind}.glb`, base).href);
        const meshes = [];
        gltf.scene.traverse((o) => o.isMesh && meshes.push(o));
        const list = this.placements[kind];
        meshes.forEach((m, vi) => {
          const mine = list.filter((p) => p.v % meshes.length === vi);
          if (!mine.length) return;
          const im = new InstancedMesh(m.geometry, this.material(kind), mine.length);
          const M = new Matrix4(), q = new Quaternion(), s = new Vector3(), t = new Vector3();
          mine.forEach((p, i) => {
            q.setFromAxisAngle(UP, p.rot);
            const sc = p.scale * this.S;
            s.set(sc, sc, sc);
            t.set(p.x, p.y - 0.004, p.z);
            M.compose(t, q, s);
            im.setMatrixAt(i, M);
          });
          im.instanceMatrix.needsUpdate = true;
          im.castShadow = kind === 'treefern' || kind === 'cycad';
          im.receiveShadow = true;
          im.frustumCulled = false;
          im.name = `flora-${kind}-${vi}`;
          this.group.add(im);
        });
      }),
    );
  }

  material(kind) {
    if (!this._mats) this._mats = {};
    if (this._mats[kind]) return this._mats[kind];
    const m = new MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0, side: DoubleSide });
    const U = this.uniforms;
    const amp = { fern: 0.05, fernlet: 0.05, redplant: 0.03, horsetail: 0.08, treefern: 0.07, cycad: 0.03 }[kind] || 0.05;
    const H = { fern: 1.0, fernlet: 0.8, redplant: 0.7, horsetail: 1.6, treefern: 5.5, cycad: 2.6 }[kind] || 1.0; // metres
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = U.uTime;
      sh.uniforms.uWind = U.uWind;
      sh.uniforms.uTint = U.uTint;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uWind;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
  #ifdef USE_INSTANCING
  float ph = dot(instanceMatrix[3].xz, vec2(3.7, 2.9));
  #else
  float ph = 0.0;
  #endif
  float sway = pow(clamp(position.y / ${H.toFixed(2)}, 0.0, 1.2), 1.5); // 0 at the root .. 1 at the top
  float gust = sin(uTime * 1.3 + ph) * 0.6 + sin(uTime * 2.9 + ph * 1.7) * 0.4;
  transformed.x += sway * sway * ${amp.toFixed(3)} * (0.4 + uWind) * gust / 1.0 * 8.0;
  transformed.z += sway * sway * ${amp.toFixed(3)} * (0.4 + uWind) * sin(uTime * 1.1 + ph * 0.7) * 4.0;`,
        );
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uTint;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= uTint;');
    };
    this._mats[kind] = m;
    return m;
  }

  update(dt) {
    // a deep, mossy jungle floor instead of a bright meadow: Weatherglass recomputes its seasonal
    // palette every frame and copies it into the terrain and grass shaders afterwards
    const sea = this.ctx.world.seasonal;
    if (sea?.grass) {
      sea.grass.lerp(JUNGLE.grass, 0.6);
      sea.grassDry?.lerp(JUNGLE.dry, 0.55);
      sea.foliage?.lerp(JUNGLE.foliage, 0.35);
      sea.foliage2?.lerp(JUNGLE.foliage2, 0.35);
    }
    const U = this.uniforms;
    U.uTime.value += dt;
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

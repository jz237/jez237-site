// The infected cast: loads the character GLBs, dresses them with runtime materials, and exposes actors whose
// pose is set every frame by the choreography (src/film/choreo.js). Deterministic: actors hold no motion state.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';
import { dressCreature } from './materials.js';
import { Rig } from './rig.js';
import { addHair } from './hair.js';

// hair styles per cast member (strand cards skinned to the head bone); exported for tools/creatures/view.html
export const HAIR = {
  // wet, matted, dull yellowed grey; centre parting; thick tapered locks at the sides and back, 2-3 strays over the face
  homeowner: {
    seed: 31, clumps: 135, perClump: [6, 9], clumpRadius: 0.0075, width: [0.0035, 0.0065], conv: 0.8, length: [0.17, 0.29], backLen: 0.55,
    color: 0x72777f, colorDark: 0x19191b, cardShade: [0.8, 1.1], salt: 0.26, tipColor: 0x2e0c08, dirty: 0.7, frizz: 0.1,
    lift: [0.0015, 0.006], part: 0.003, sweep: 0.2, faceClear: 0.036, strays: 1, plaster: { face: 2, neck: 5 }, plasterWidth: 0.003,
    flyaways: 10, wet: true, roughness: 0.55, gloss: 0.12, gravity: [0, -1, -0.1], cling: 0.25, kink: 0.006, hairline: 12, rootLift: 0.15,
    cap: { color: 0x26272a, height: 0.003, shells: 4, density: 0.85, cell: 0.0008, rootCover: 0.97, hairline: 7 },
  },
  // short, rain- and blood-soaked, matted flat to the scalp: flattened clumped shells
  wreck: { buzz: true, flat: 4, color: 0x201c1a, height: 0.0085, shells: 14, density: 0.86, cell: 0.0008, clump: 0.0065, strand: 0.0009, blood: 0.6, tint: 0x3a0906, roughness: 0.36, gloss: 0, hairline: 7 },
  facepaint: { buzz: true, color: 0x1e1b19, height: 0.0045, density: 0.72, rootCover: 0.97 }, // under the hood: <= 5 mm
  brute: { buzz: true, color: 0x1f1c1a, height: 0.005, density: 0.85, rootCover: 0.98 }, // dense dark root layer: no bald read at 6-25 m
  crawler: { buzz: true, color: 0x24211e, height: 0.0045, density: 0.8, rootCover: 0.98 },
  walker: { buzz: true, color: 0x2a2622, height: 0.0045, density: 0.78, rootCover: 0.98 }, // seen knees-down only; no bald head if it ever enters frame
  // long dark wet hair, read at 8-12 m: thick clumped locks over a dark cap
  screamer: {
    seed: 53, clumps: 130, perClump: [8, 12], length: [0.22, 0.40], clumpRadius: 0.012, width: [0.004, 0.007],
    color: 0x3a332c, colorDark: 0x14110f, tipColor: 0x1e0907, dirty: 0.3, frizz: 0.1, lift: [0.002, 0.008], part: 0.006,
    faceClear: 0.03, strays: 2, flyaways: 8, wet: true, roughness: 0.42, gloss: 0.35,
    cap: { color: 0x1a1714, height: 0.003, shells: 4, density: 0.85, cell: 0.0008, rootCover: 0.97 },
  },
};

// v2 cast (docs/briefs/CREATURES-v2.md) -> preferred model files (first listed in the manifest wins).
// Fallbacks are the v1 test GLBs so staging works while a file is being rebuilt.
export const CAST = {
  facepaint: ['facepaint.glb', 'hero.glb', 'hero_test.glb'],
  homeowner: ['homeowner.glb', 'homeowner_test.glb', 'hero_test.glb'],
  wreck: ['wreck.glb', 'window_test.glb', 'hero_test.glb'],
  scarecrow: ['scarecrow.glb', 'watcher_test.glb', 'hero_test.glb'],
  screamer: ['screamer.glb', 'screamer_test.glb', 'common_test.glb'],
  brute: ['brute.glb', 'common_test.glb', 'hero_test.glb'],
  walker: ['walker.glb', 'common_test.glb', 'hero_test.glb'],
  crawler: ['crawler.glb', 'common_test.glb', 'hero_test.glb'],
};
// v1 actor names still read by older choreography: non-enumerable aliases onto the v2 actors
const ALIAS = { hero: 'facepaint', window: 'wreck', watcher: 'scarecrow' };

async function exists(url) {
  try { const r = await fetch(url, { method: 'HEAD' }); return r.ok; } catch (e) { return false; }
}

export class Actor {
  constructor(name, root) {
    this.name = name;
    this.root = root; // THREE.Group placed in the world
    this.rig = new Rig(root);
    this.visible = false;
    root.visible = false;
    this.meshes = [];
    root.traverse((o) => { if (o.isMesh) { this.meshes.push(o); o.frustumCulled = false; } });
  }
  place(x, y, z, yaw = 0) {
    this.root.position.set(x, y, z);
    this.root.rotation.set(0, yaw, 0);
  }
  show(v) { this.root.visible = v; this.visible = v; }
}

export async function loadCast({ scene, baseUrl = 'assets/creatures/', quality = 'high', onProgress } = {}) {
  const draco = new DRACOLoader();
  draco.setDecoderPath(new URL('../../vendor/three/addons/libs/draco/gltf/', import.meta.url).href);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  const cache = new Map();
  const files = {};
  let available = null;
  try { const r = await fetch(baseUrl + 'manifest.json', { cache: 'no-store' }); if (r.ok) available = new Set((await r.json()).files); } catch (e) { /* probe instead */ }
  for (const [name, list] of Object.entries(CAST)) {
    for (const f of list) {
      const ok = available ? available.has(f) : (cache.has(f) || await exists(baseUrl + f));
      if (ok) { files[name] = f; cache.set(f, null); break; }
    }
  }
  const unique = [...new Set(Object.values(files))];
  let done = 0;
  for (const f of unique) {
    const g = await loader.loadAsync(baseUrl + f);
    dressCreature(g.scene, { normalScale: quality === 'low' ? 0.7 : 1.0 });
    cache.set(f, g);
    done++;
    onProgress && onProgress(done / unique.length);
  }
  const group = new THREE.Group();
  group.name = 'Cast';
  scene.add(group);
  const actors = {};
  const used = new Map();
  for (const [name, f] of Object.entries(files)) {
    const g = cache.get(f);
    if (!g) continue;
    // first user takes the original, later ones a skeleton-aware clone (shares geometry + materials)
    const root = used.has(f) ? skeletonClone(g.scene) : g.scene;
    used.set(f, true);
    root.name = 'actor_' + name;
    group.add(root);
    if (HAIR[name]) {
      try { addHair(root, HAIR[name]); } catch (e) { console.warn('[prh] hair failed for', name, e); }
    }
    actors[name] = new Actor(name, root);
    actors[name].file = f;
  }
  for (const [old, now] of Object.entries(ALIAS)) {
    if (actors[now] && !(old in actors)) Object.defineProperty(actors, old, { value: actors[now], enumerable: false });
  }
  return { group, actors, files };
}

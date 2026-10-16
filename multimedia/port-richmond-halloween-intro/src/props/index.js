// PROPS for the Port Richmond Halloween intro (v2 "HIDE"): Halloween set dressing, the 3607 animatronic skeleton
// display, the hero pumpkin, whole-film rain, the 3607 TV room (TV flicker only - v1's scare-one window impact is
// retired), the 3609 door + front room (scare three refuge), the abandoned car (CAR agent), leaves.
//
//   const props = await loadProps({ renderer, scene, world, quality, onProgress, lightPool });
//   props.root            THREE.Group (already added to `scene`)
//   props.anchors         { name: { position: Vector3, quaternion?: Quaternion, ...extra, note } }
//   props.update(t, cam)  deterministic: every state derives from t + src/film/cues.js (call before rendering)
//   props.setQuality(q)   'low' | 'medium' | 'high'
//   props.api             story-prop controls (see docs/props-notes.md)
//
// Lights follow src/lightpool.js: small sources are registered with the pool; the 3607 TV light, the 3609 room
// lamp and the animatronic's red LED eye light are dedicated lights (created once here, intensity driven over
// time). If no pool is passed, a local one is created and updated by props.update().
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { LightPool } from '../lightpool.js';
import * as TIMINGS from './timings.js';
import { groundY, setGroundSampler, buildWorldGroundSampler, worldAnchor, HERO } from './site.js';
import { getNightEnv } from './glass.js';
import { buildDoor3609 } from './door3609.js';
import { buildRoom3609 } from './room3609.js';
import { buildHouse3607 } from './house3607.js';
import { buildCar } from './car.js';
import { buildCandy, buildCandyBowl } from './story.js';
import { interiorize } from './interior.js';
import { mergeStatic } from './geo.js';
import { buildDressing } from './dressing.js';
import { buildPorch } from './porch.js';
import { buildLeaves } from './leaves.js';
import { buildAnimatronic } from './animatronic.js';
import { buildRain } from './rain.js';

export {
  railTapTimes, railTaps, phoneBuzzTimes, binImpactTimes, binImpacts, doorImpactTimes, keyJingleTimes, keyJingles,
  windGusts, leafGustTimes, carRattleTimes, windowImpactTimes,
} from './timings.js';

const DEBUG = typeof location !== 'undefined' && /propsdebug=1/.test(location.search);
const ASSET_BASE = new URL('../../assets/props/', import.meta.url).href;
const DRACO_PATH = new URL('../../vendor/three/addons/libs/draco/', import.meta.url).href;

export async function loadProps({ renderer, scene, world = null, quality = 'high', onProgress = null, lightPool = null, porchStoop = null } = {}) {
  const t0 = performance.now();
  const progress = (f, label) => { try { onProgress && onProgress(Math.min(1, f), label); } catch (e) { /* ignore */ } };
  const root = new THREE.Group();
  root.name = 'Props';
  scene.add(root);

  // ---- ground: sample the ported world if it is there ----
  if (world) {
    if (typeof world.groundY === 'function') setGroundSampler((x, z) => world.groundY(x, z, NaN));
    else if (typeof world.groundHeightAt === 'function') setGroundSampler((x, z) => world.groundHeightAt(x, z));
    else if (typeof world.heightAt === 'function') setGroundSampler((x, z) => world.heightAt(x, z));
    else {
      try {
        const s = buildWorldGroundSampler(world);
        if (s) setGroundSampler(s.sample);
      } catch (e) { console.warn('[props] world ground sampling failed, using the game-data ground model', e); }
    }
  }
  progress(0.05, 'props: ground');

  // ---- shared context ----
  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
  const gltfLoader = new GLTFLoader().setDRACOLoader(draco);
  const gltfCache = new Map();
  const matCache = new Map();
  const ownPool = !lightPool;
  const pool = lightPool || new LightPool(scene, { points: 8, spots: 3, shadowSpots: 2, quality });
  // which openings the world leaves open (see-through) - otherwise its opaque night glass + back cap is in place
  const wa = (n) => (world && world.anchors && world.anchors[n]) || null;
  const open = {
    door3609: !world || !!(wa('opening_3609_door') || {}).empty,
    win3607a: !world || !!(wa('opening_3607_window') || wa('win_3607_g2') || {}).seeThrough,
    win3607b: !world || !!(wa('win_3607_g1') || {}).seeThrough,
    win3609a: !world || !!(wa('win_3609_g2') || {}).seeThrough,   // z 0.90
    win3609b: !world || !!(wa('win_3609_g1') || {}).seeThrough,   // z 2.50
    win3602up: !world || !!(wa('win_3602_u1') || {}).seeThrough,
    win3605u1: !!(world && (wa('win_3605_u1') || {}).seeThrough),   // curtain window (front-layered unless see-through)
    win3603a: !world || !!(wa('win_3603_g2') || {}).seeThrough,   // z 15.91
  };
  const ctx = {
    renderer, scene, world, quality, lightScale: 1, open, hasWorld: !!world,
    porchStoop: porchStoop || '3611',
    envMap: scene.environment ? null : getNightEnv(renderer),
    groundY,
    worldAnchor: (...names) => worldAnchor(world, ...names),
    loadGLTF(file) {
      if (!gltfCache.has(file)) gltfCache.set(file, gltfLoader.loadAsync(ASSET_BASE + file));
      return gltfCache.get(file);
    },
    mat(key, make) { if (!matCache.has(key)) matCache.set(key, make()); return matCache.get(key); },
    // sealed 3609 room (set by room3609.js): can a world-space Box3 be seen through the door's window?
    portal: null,
    portalSees(box) {
      const P = ctx.portal;
      if (!P || !P.active) return true;
      for (const pl of P.planes) {
        _pv.set(pl.normal.x > 0 ? box.max.x : box.min.x, pl.normal.y > 0 ? box.max.y : box.min.y, pl.normal.z > 0 ? box.max.z : box.min.z);
        if (pl.distanceToPoint(_pv) < 0) return false;
      }
      return true;
    },
  };
  const _pv = new THREE.Vector3();

  // ---- build components (each isolated: one failure must not take down the rest) ----
  const parts = {};
  const errors = [];
  async function part(name, fn) {
    const ts = performance.now();
    try { parts[name] = await fn(); if (DEBUG) console.log('[props] built', name, Math.round(performance.now() - ts) + ' ms'); }
    catch (e) { errors.push(name); console.error('[props] failed to build', name, e); }
  }
  const order = [
    ['door3609', () => buildDoor3609(ctx)],
    ['room3609', () => buildRoom3609(ctx)],
    ['house3607', () => buildHouse3607(ctx)],
    ['leaves', () => buildLeaves(ctx)],
    ['rain', () => buildRain(ctx)],
  ];
  // v1-only beats retired cleanly (DRESS v2): the phone, the recycling toter/bin-knock, and the 3605 upstairs
  // curtain twitch are no longer built at all (not just disabled by a NEVER cue) - none of them appear in the v2
  // structure (docs/DESIGN-v2.md). The candy pail's GLB pieces/materials are still built below (buildCandy) for
  // the INDOOR candy bowl (ACT 4); its outdoor tipped-pail display is skipped the same way (see story.js).
  let k = 0;
  for (const [name, fn] of order) { await part(name, fn); progress(0.1 + 0.4 * (++k / order.length), 'props: ' + name); }
  // GLB-backed parts in parallel
  await Promise.all([
    part('car', () => buildCar(ctx)),
    part('candy', () => buildCandy(ctx)),
    part('dressing', () => buildDressing(ctx)),
    part('porch', () => buildPorch(ctx)),
    part('animatronic', () => buildAnimatronic(ctx)),
  ]);
  progress(0.9, 'props: assets');
  // the 3609 candy bowl uses the candy pail's pieces; it lives in the room (interior lighting, culled with it)
  if (parts.room3609 && parts.candy) {
    try {
      const bowl = buildCandyBowl(ctx, parts.room3609.anchors.candyBowl3609, parts.candy.api);
      parts.room3609.group.attach(bowl.group);
      interiorize(bowl.group, 0.2);
      mergeStatic(bowl.group);
    } catch (e) { console.error('[props] candy bowl', e); }
  }

  const anchors = {};
  const sources = [];
  const updaters = [];
  for (const [name, p] of Object.entries(parts)) {
    if (!p) continue;
    if (p.group) root.add(p.group);
    if (p.extras) for (const x of p.extras) root.add(x);
    if (p.anchors) Object.assign(anchors, p.anchors);
    if (p.sources) sources.push(...p.sources);
    if (p.update) updaters.push(p.update);
  }
  // street props that are hidden while the camera is sealed inside the 3609 room and their bounds miss the door window
  // (world-space bounds taken once; margins cover their animation: the toter falls ~1 m, bottles roll to the gutter)
  const sealables = [];
  root.updateMatrixWorld(true);
  const sealable = (obj, margin) => {
    if (!obj) return;
    const b = new THREE.Box3().setFromObject(obj);
    if (!b.isEmpty()) sealables.push({ obj, box: b.expandByScalar(margin) });
  };
  sealable(parts.car?.group, 0.5);
  sealable(parts.candy?.group, 0.3);
  sealable(parts.porch?.group, 0.5);
  sealable(parts.animatronic?.group, 0.5);
  for (const x of parts.house3607?.extras || []) sealable(x, 0.3);
  // the world's dark interior linings behind the story openings are redundant with our rooms (ENV notes say so);
  // left visible, the 3609 lining's front face hides the closed door from inside the room
  if (world && world.linings) {
    if (parts.room3609 && world.linings['3609']) world.linings['3609'].visible = false;
    if (parts.house3607 && world.linings['3607']) world.linings['3607'].visible = false;
  }
  // dedicated lights (fixed set, created once)
  const tvLight = parts.house3607 ? pool.dedicated(parts.house3607.tvLight) : null;
  const roomLamp = parts.room3609 ? pool.dedicated(parts.room3609.lamp) : null;
  const animatronicEyeLight = parts.animatronic?.eyeLight ? pool.dedicated(parts.animatronic.eyeLight) : null;
  // pool sources (logical lights, never added/removed after load)
  const registered = sources.map((s) => pool.register(s));

  progress(1, 'props: ready');
  const buildMs = Math.round(performance.now() - t0);

  let currentQuality = quality;
  const api = {
    // 3607: scare one window + TV room
    windowImpact: parts.house3607?.api.windowImpact,
    window3607: parts.house3607?.api.window,
    tv: parts.house3607?.api.tv,
    tvLight,
    // 3609: door + keys + refuge room
    door: parts.door3609?.api,
    roomLamp,
    room3609: parts.room3609?.api,
    // candy (indoor bowl pieces only - the outdoor pail is retired), porch figures, the 3607 animatronic, rain, car, leaves
    candyPail: parts.candy?.api,
    porch: parts.porch?.api,
    animatronic: parts.animatronic?.api,
    animatronicEyeLight,
    rain: parts.rain?.api,
    car: parts.car?.api,
    // ---- CAR agent: v2 cars (docs/car-notes.md) ----
    carA: parts.car?.api.carA || null,
    carB: parts.car?.api.carB || null,
    puddle: parts.car?.api.puddle || null,
    // ---- end CAR agent ----
    carDoorRattle: parts.car ? (t) => parts.car.api.carDoorRattle(t) : () => ({ door: 0, rock: 0 }),
    abandonedCarRearGlass: parts.car?.api.rearGlass || null,
    leaves: parts.leaves?.api,
    dressing: parts.dressing?.api,
    // exported deterministic event times (seconds) for the audio
    railTapTimes: TIMINGS.railTapTimes,
    doorImpactTimes: TIMINGS.doorImpactTimes,
    keyJingleTimes: TIMINGS.keyJingleTimes,
    windowImpactTimes: TIMINGS.windowImpactTimes,
    carRattleTimes: TIMINGS.carRattleTimes,
    leafGustTimes: TIMINGS.leafGustTimes,
    animatronicClacks: TIMINGS.animatronicClacks,
    timings: TIMINGS,
    lightPool: pool,
    lightSources: registered,
    // global scale for all prop light intensities (calibrate against the world's exposure)
    setLightScale(s) {
      ctx.lightScale = s;
      parts.house3607?.api.setLightScale(s); parts.room3609?.api.setLightScale(s); parts.animatronic?.api.setLightScale(s); parts.car?.api.setLightScale(s);
    },
    get lightScale() { return ctx.lightScale; },
    errors,
    openings: open,
    stats: () => stats(root, buildMs, registered.length),
  };

  function setQuality(q) {
    currentQuality = q;
    ctx.quality = q;
    parts.leaves?.setQuality?.(q);
    parts.rain?.setQuality?.(q);
    // lamp shadow map size can change (castShadow is fixed at load by the light-pool rules)
    if (roomLamp && roomLamp.castShadow) {
      const s = q === 'high' ? 1024 : 512;
      if (roomLamp.shadow.mapSize.x !== s) { roomLamp.shadow.mapSize.set(s, s); if (roomLamp.shadow.map) { roomLamp.shadow.map.dispose(); roomLamp.shadow.map = null; } }
    }
  }

  return {
    root,
    anchors,
    api,
    setQuality,
    get quality() { return currentQuality; },
    update(t, camera) {
      for (const u of updaters) u(t, camera);
      for (let i = 0; i < sealables.length; i++) sealables[i].obj.visible = ctx.portalSees(sealables[i].box);
      if (ownPool && camera) pool.update(t, camera);
    },
  };
}

function stats(root, buildMs, nSources) {
  let meshes = 0, tris = 0, instances = 0;
  const mats = new Set();
  root.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry;
    const n = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
    const c = o.isInstancedMesh ? o.count : 1;
    tris += n * c; instances += c;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m));
  });
  return { meshes, instances, triangles: Math.round(tris), materials: mats.size, buildMs, poolSources: nSources };
}

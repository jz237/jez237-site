// PORT RICHMOND: the game's Witte St 3600 block (E Venango corner .. E Pacific St / the terminal wall) ported to
// Three.js and lit for a cold, wet Halloween night. ENV agent module; contract in docs/DESIGN.md, notes in
// docs/world-notes.md.
//
//   const world = await loadWorld({ renderer, scene, quality: 'high', onProgress, lightPool });
//   world.root, world.anchors, world.lights, world.update(t, camera), world.setQuality(q), world.groundY(x, z),
//   world.flickerTimes, world.flickerAt(t)
//
// Everything is the game's own data: chunk shells/ground/wires (data/derived/world chunk JSON), every focus /
// district kit piece and street prop at its placements.json transform (data/derived/kit + kit_staging FBX), the
// game's fleet cars (tools/gis/fleet.py pieces), the game's textures (tools/textures). See tools/world/*.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { LightPool } from '../lightpool.js';
import {
  makeShared, uberMaterial, lampMaterial, glassMaterial, foliageMaterial, texturedKitMaterial, groundMaterial,
  wireMaterial, haloMaterial, FAKE_MAX, LAMP_MAX,
} from './materials.js';
import { mergeInstances } from './merge.js';
import { makeSky, makeEnvironment, SKY_DEFAULTS } from './sky.js';
import { GroundHeight } from './ground.js';
import { flickerAt, FLICKER_EPISODES, FLICKER_EVENTS } from './flicker.js';

const BASE = new URL('../../assets/world/', import.meta.url).href;
const DRACO_PATH = new URL('../../vendor/three/addons/libs/draco/gltf/', import.meta.url).href;

// ---- photometry (Three physical units: candela for punctual lights). Tuned for AgX tone mapping, exposure 1.0.
export const LAMP = {
  cobra: { color: new THREE.Color(0.80, 0.93, 1.0), intensity: 420, distance: 34, angle: 1.2, penumbra: 0.7, emissive: 18 },
  porch: { color: new THREE.Color(1.0, 0.58, 0.28), intensity: 16, distance: 10, emissive: 9 },
  window: { intensity: 2.2, distance: 5.5 },
};
export const RECOMMENDED_EXPOSURE = 1.0;

// chunk slot -> ground/wall material recipe (game textures; wet street surfaces get puddles)
const GROUND_RECIPES = {
  M_Asphalt: { tex: 'T_Asphalt', n: 'T_Asphalt_N', r: 'T_Asphalt_R', rough: 0.95, wetDark: 0.34, wetRough: 0.34, pudLo: 0.74, pudAmt: 1, ns: 0.8, gutterK: 0.34, depK: 0.3, wetRefl: 1.8 },
  M_Sidewalk: { tex: 'T_Sidewalk', n: 'T_Sidewalk_N', r: 'T_Sidewalk_R', rough: 1.0, wetDark: 0.56, wetRough: 0.58, pudLo: 0.76, pudAmt: 0.9, ns: 0.8, depK: 0.3, wetRefl: 1.0 },
  M_Curb: { tex: 'T_Curb', n: 'T_Curb_N', rough: 0.85, wetDark: 0.62, wetRough: 0.6, ns: 0.8 },
  M_Gutter: { tex: 'T_Gutter', n: 'T_Gutter_N', r: 'T_Gutter_R', rough: 1.0, wetDark: 0.55, wetRough: 0.45, pudLo: 0.6, pudAmt: 1, gutter: true, gutterK: 0.3, depK: 0.2 },
  M_Lot: { tex: 'T_Lot', rough: 0.9, wetDark: 0.75, wetRough: 0.65, pudLo: 0.6, pudAmt: 0.8 },
  M_Concrete: { tex: 'T_Concrete', rough: 0.85, wetDark: 0.78, wetRough: 0.65, pudLo: 0.66, pudAmt: 0.6 },
  M_Path: { tex: 'T_Concrete', rough: 0.85, wetDark: 0.78, wetRough: 0.65 },
  M_Paint_White: { tex: 'T_PaintWhite', rough: 0.6, wetDark: 0.85, wetRough: 0.5 },
  M_Paint_Yellow: { tex: 'T_PaintYellow', rough: 0.6, wetDark: 0.85, wetRough: 0.5 },
  M_Ground: { tex: 'T_Ground', rough: 0.95, wetDark: 0.8, wetRough: 0.8 },
  M_Grass: { tex: 'T_Grass', rough: 0.95, wetDark: 0.85, wetRough: 0.85 },
  M_Dirt: { tex: 'T_DirtLot', rough: 0.95, wetDark: 0.7, wetRough: 0.7, pudLo: 0.62, pudAmt: 0.7 },
  M_DirtPacific: { tex: 'T_DirtLot', rough: 0.95, wetDark: 0.7, wetRough: 0.7, pudLo: 0.62, pudAmt: 0.7, k: 0.9 },
  M_Roof: { tex: 'T_Roof', rough: 0.85, wetDark: 0.8, wetRough: 0.6 },
  M_Roof_Focus: { tex: 'T_Roof', rough: 0.85, wetDark: 0.8, wetRough: 0.6 },
  M_Brick_Row: { tex: 'T_Brick_Row', n: 'T_Brick_Row_N', rough: 0.88, wall: true },
  M_Brick_Focus: { tex: 'T_Brick_Row', n: 'T_Brick_Row_N', rough: 0.88, wall: true },
  M_Brick_Commercial: { tex: 'T_Brick_Commercial', rough: 0.88, wall: true },
  M_Civic: { tex: 'T_Brick_Commercial', rough: 0.88, wall: true },
  M_Wall_BrickPaint: { tex: 'T_BrickPainted', rough: 0.8, wall: true },
  M_Wall_BrickPaintFresh: { tex: 'T_BrickPainted', rough: 0.75, wall: true },
  M_Wall_Formstone: { tex: 'T_Formstone', rough: 0.85, wall: true },
  M_Wall_Stucco: { tex: 'T_Stucco', rough: 0.9, wall: true },
  M_Wall_StuccoDash: { tex: 'T_StuccoDash', rough: 0.92, wall: true },
  M_Wall_Siding: { tex: 'T_VinylSiding', n: 'T_VinylSiding_N', rough: 0.55, wall: true },
  M_Wall_Cedar: { tex: 'T_CedarLap', rough: 0.7, wall: true },
  M_Wall_Shake: { tex: 'T_CedarShake', rough: 0.85, wall: true },
  M_Wall_Parge: { tex: 'T_Parge', rough: 0.9, wall: true },
  M_Wall_Panel: { tex: 'T_FacadePanel', rough: 0.55, wall: true },
  M_Wall_Concrete: { tex: 'T_Concrete', rough: 0.9, wall: true },
  M_Wall_CMU: { tex: 'T_CMU_Painted', rough: 0.9, wall: true },
  M_Wall_CMUSplit: { tex: 'T_CMU_Painted', rough: 0.92, wall: true },
  M_Wall_CMURib: { tex: 'T_CMU_Painted', rough: 0.9, wall: true },
  M_Wall_MetalPanel: { tex: 'T_MetalPanel_DarkGrey', rough: 0.5, wall: true },
  M_Wall_Ledgestone: { tex: 'T_StoneVeneer_Ledgestone', rough: 0.9, wall: true },
  M_Wall_FieldstoneVeneer: { tex: 'T_StoneVeneer_Fieldstone', rough: 0.9, wall: true },
  M_Wall_FieldstoneCoursed: { tex: 'T_StoneVeneer_Fieldstone', rough: 0.9, wall: true },
  M_Wall_WoodPlank: { tex: 'T_WoodLook_Plank', rough: 0.7, wall: true },
  M_Wall_CastStone: { tex: 'T_CastStone_Block', rough: 0.85, wall: true },
  M_Wall_SteelSash: { tex: 'T_GlassBlock', rough: 0.4, wall: true },
  M_Wall_CorrugatedVRib: { tex: 'T_CorrugatedSteel_VRib', rough: 0.5, wall: true },
  M_Wall_PaintedAshlar: { tex: 'T_Ashlar', rough: 0.85, wall: true },
  M_Wall_EIFS: { tex: 'T_Stucco', rough: 0.8, wall: true },
  M_Wall_FauxStoneVinyl: { tex: 'T_StoneVeneer_Fieldstone', rough: 0.64, wall: true },
  M_Industrial: { tex: 'T_Industrial', rough: 0.8, wall: true },
  M_RB_Ashlar: { tex: 'T_Ashlar', rough: 0.85, wall: true, k: 0.5 },
  M_RB_AshlarCoping: { tex: 'T_Ashlar', rough: 0.85, wall: true, k: 0.35 },
  M_RB_Steel: { tex: 'T_RustSteel', rough: 0.7, wall: true },
  M_Rail_Steel: { flat: [0.2, 0.13, 0.08], rough: 0.55 },
  M_Ballast: { flat: [0.14, 0.12, 0.1], rough: 1.0 },
};

// focus finish wall slots: they carry the game's weathering coordinates (UV1) -> damp foot
const FOCUS_FINISH = new Set(['M_Brick_Focus', 'M_Wall_BrickPaint', 'M_Wall_BrickPaintFresh', 'M_Wall_Formstone', 'M_Wall_Stucco',
  'M_Wall_StuccoDash', 'M_Wall_Siding', 'M_Wall_Cedar', 'M_Wall_Shake', 'M_Wall_Parge', 'M_Wall_Panel', 'M_Wall_Concrete',
  'M_Wall_CMU', 'M_Wall_CMUSplit', 'M_Wall_CMURib', 'M_Wall_MetalPanel', 'M_Wall_Ledgestone', 'M_Wall_WoodPlank',
  'M_Wall_CastStone', 'M_Wall_CorrugatedVRib', 'M_Wall_FieldstoneCoursed', 'M_Wall_PaintedAshlar', 'M_Wall_FieldstoneVeneer']);

const TEX_GROUP_OPTS = {
  T_ChainLink: { alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.6 },
  T_FlagUS: { side: THREE.DoubleSide, roughness: 0.85 },
  T_GlassBlock: { roughness: 0.25 },
  T_SignAtlas_Reg: { roughness: 0.4 },
};

function nameOfPrim(o) {
  return (o.material && o.material.name) || 'none';
}

export async function loadWorld({ renderer, scene, quality = 'high', onProgress, lightPool, baseUrl, openWindows = [] } = {}) {
  const base = baseUrl || BASE;
  const tier = quality === 'low' ? 'lo' : 'hi';
  const progress = { json: 0, kit: 0, cars: 0, ground: 0, tex: 0 };
  const weights = { json: 0.04, kit: 0.42, cars: 0.18, ground: 0.14, tex: 0.22 };
  const report = () => {
    if (!onProgress) return;
    let f = 0;
    for (const k in weights) f += weights[k] * Math.min(1, progress[k]);
    onProgress(Math.min(0.99, f));
  };

  const root = new THREE.Group();
  root.name = 'WitteWorld';
  const shared = makeShared();

  // ---------------------------------------------------------------------------------------------- loading
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_PATH);
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(draco);
  const loadGLB = (file, key) => new Promise((resolve, reject) => {
    gltfLoader.load(`${base}${file}`, resolve, (e) => { if (e.total) { progress[key] = e.loaded / e.total; report(); } }, reject);
  });
  const dataP = fetch(`${base}witte_world.json`).then((r) => { if (!r.ok) throw new Error(`witte_world.json ${r.status}`); return r.json(); });
  const [data, kitG, carsG, groundG] = await Promise.all([dataP.then((d) => { progress.json = 1; report(); return d; }),
    loadGLB('witte_kit.glb', 'kit'), loadGLB('witte_cars.glb', 'cars'), loadGLB('witte_ground.glb', 'ground')]);
  progress.kit = progress.cars = progress.ground = 1;
  report();

  // textures (game textures converted to WebP by tools/world/make_textures.mjs)
  const texLoader = new THREE.TextureLoader();
  const aniso = Math.min(renderer.capabilities.getMaxAnisotropy(), quality === 'low' ? 2 : quality === 'medium' ? 4 : 8);
  const texCache = new Map();
  const texNames = new Set();
  for (const r of Object.values(GROUND_RECIPES)) { if (r.tex) texNames.add(r.tex); if (r.n) texNames.add(r.n); if (r.r) texNames.add(r.r); }
  for (const s of Object.values(data.slots)) if (s.group && s.group.startsWith('tex:')) texNames.add(s.group.slice(4));
  texNames.add('T_LeafAtlasFocus');
  texNames.add('T_WeedAtlas');
  if (data.bladeAtlas) texNames.add('T_Blades');
  let texDone = 0;
  await Promise.all([...texNames].map((n) => new Promise((resolve) => {
    texLoader.load(`${base}tex/${tier}/${n}.webp`, (t) => {
      t.flipY = false; // glTF UV convention (all geometry comes through Blender's glTF exporter)
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = aniso;
      t.colorSpace = /_(N|R)$/.test(n) ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      t.name = n;
      texCache.set(n, t);
      progress.tex = ++texDone / texNames.size;
      report();
      resolve();
    }, undefined, () => { console.warn(`[world] texture missing: ${n}`); progress.tex = ++texDone / texNames.size; resolve(); });
  })));
  const tex = (n) => (n ? texCache.get(n) || null : null);

  // ---------------------------------------------------------------------------------------------- kit + cars
  const lib = new Map();
  for (const g of [kitG, carsG]) {
    for (const node of g.scene.children) {
      const prims = [];
      node.traverse((o) => { if (o.isMesh) prims.push({ geometry: o.geometry, slot: nameOfPrim(o) }); });
      lib.set(node.name, prims);
    }
  }
  // street-name blades: the game's atlas cells per sign face (front/back picked by the blade face normal, as the game's
  // M_PR_BladeAtlas does: front = (n.x - n.y) >= 0 in UE local = (n.x - n.z) >= 0 in the glTF piece frame)
  const signGroup = new THREE.Group();
  signGroup.name = 'WitteStreetSigns';
  if (data.signs && data.signs.length && tex('T_Blades')) {
    const geos = [];
    for (const sg of data.signs) {
      const T = sg.T;
      const m4 = new THREE.Matrix4().compose(new THREE.Vector3(T[0], T[1], T[2]), new THREE.Quaternion(T[3], T[4], T[5], T[6]),
        new THREE.Vector3(T[7], T[8], T[9]));
      for (const prim of lib.get(sg.mesh) || []) {
        if (prim.slot !== 'M_Blade_A' && prim.slot !== 'M_Blade_B') continue;
        const g = prim.geometry.clone();
        for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
        const N = g.attributes.normal, U = g.attributes.uv;
        const cellBase = prim.slot === 'M_Blade_A' ? 0 : 2;
        for (let i = 0; i < U.count; i++) {
          const front = (N.getX(i) - N.getZ(i)) >= 0;
          const r = sg.rects[cellBase + (front ? 0 : 1)];
          U.setXY(i, r[0] + U.getX(i) * (r[2] - r[0]), r[1] + U.getY(i) * (r[3] - r[1]));
        }
        g.applyMatrix4(m4);
        geos.push(g.index ? g.toNonIndexed() : g);
      }
    }
    if (geos.length) {
      const bm = new THREE.Mesh(mergeGeometries(geos, false), texturedKitMaterial(shared, tex('T_Blades'), { roughness: 0.35 }));
      bm.name = 'StreetNameBlades';
      bm.castShadow = true;
      bm.receiveShadow = true;
      signGroup.add(bm);
    }
  }
  root.add(signGroup);

  const dropDetail = quality === 'low';     // detail meshes are built but hidden on 'low' (setQuality can show them)
  // optional extra see-through windows (PROPS supports them; only 3609 / 3607 have interior linings behind)
  const swaps = [];
  for (const nm of openWindows) {
    const a = data.anchors[nm];
    if (!a || !a.bottom || !lib.has(`${a.piece}__open`)) { console.warn(`[world] openWindows: cannot open ${nm}`); continue; }
    swaps.push({ name: nm, pos: a.bottom, from: a.piece, to: `${a.piece}__open` });
  }
  const merged = mergeInstances(lib, data, { dropDetail: false, farAll: quality === 'low', swaps });
  if (merged.missing.length) console.warn('[world] pieces missing from the library:', merged.missing);
  for (const g of [kitG, carsG]) g.scene.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });

  const mats = {
    opaque: uberMaterial(shared),
    lamp: lampMaterial(shared),
    glass: glassMaterial(shared),
    leaves: foliageMaterial(shared, tex('T_LeafAtlasFocus')),
    weeds: foliageMaterial(shared, tex('T_WeedAtlas'), { weeds: true }),
  };
  const texMats = new Map();
  const kitGroup = new THREE.Group();
  kitGroup.name = 'WitteKit';
  const detailMeshes = [];
  const reflSkip = [];
  let kitTris = 0;
  for (const m of merged.meshes) {
    let mat = mats[m.group];
    if (!mat && m.group.startsWith('tex:')) {
      const tn = m.group.slice(4);
      if (!texMats.has(tn)) texMats.set(tn, texturedKitMaterial(shared, tex(tn), TEX_GROUP_OPTS[tn] || {}));
      mat = texMats.get(tn);
    }
    if (!mat) mat = mats.opaque;
    const mesh = new THREE.Mesh(m.geometry, mat);
    mesh.name = `kit_${m.group}_${m.cell}${m.detail ? '_detail' : ''}${m.cast ? '_cast' : ''}`;
    mesh.castShadow = !!m.cast;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    if (m.detail) detailMeshes.push(mesh);
    if (m.detail || m.group === 'weeds') reflSkip.push(mesh);   // not drawn into the puddle reflection
    kitTris += m.geometry.index.count / 3;
    kitGroup.add(mesh);
  }
  root.add(kitGroup);
  for (const d of detailMeshes) d.visible = !dropDetail;

  // ---------------------------------------------------------------------------------------------- chunk shells / ground
  const groundGroup = new THREE.Group();
  groundGroup.name = 'WitteGround';
  const groundMeshes = [];
  const gmeta = data.ground;
  let groundTris = 0;
  const groundSrc = [];
  groundG.scene.traverse((o) => { if (o.isMesh) groundSrc.push(o); });
  for (const o of groundSrc) {
    const slot = o.name.replace(/_\d+$/, '');
    const meta = gmeta[slot] || gmeta[nameOfPrim(o)] || {};
    const key = meta.tex !== undefined ? slot : nameOfPrim(o);
    const rec = GROUND_RECIPES[key] || GROUND_RECIPES[nameOfPrim(o)];
    let mat;
    if (key === 'M_Wire' || nameOfPrim(o) === 'M_Wire') {
      mat = wireMaterial(shared);
    } else if (rec && rec.flat) {
      mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(...rec.flat), roughness: rec.rough, metalness: 0.3 });
    } else {
      const r = rec || { tex: meta.tex, rough: 0.85, wall: true };
      mat = groundMaterial(shared, {
        map: tex(r.tex || meta.tex), normalMap: tex(r.n), roughMap: tex(r.r), k: (meta.color_scale || 1) * (r.k || 1),
        rough: r.rough ?? 0.85, pudLo: r.pudLo ?? 0.6, pudAmt: r.pudAmt ?? 0, wetDark: r.wetDark ?? (r.wall ? 0.9 : 0.8),
        wetRough: r.wetRough ?? (r.wall ? 0.85 : 0.7), normalScale: r.ns ?? 1, name: key, alphaGutter: !!r.gutter,
        gutterK: r.gutterK ?? 0, depK: r.depK ?? 0, wetRefl: r.wetRefl ?? 0,
        dampFoot: !!(r.wall && FOCUS_FINISH.has(key) && o.geometry.attributes.uv1),
      });
    }
    o.material = mat;
    o.castShadow = !meta.ground && key !== 'M_Wire';
    o.receiveShadow = true;
    o.matrixAutoUpdate = false;
    o.updateMatrixWorld(true);
    groundTris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3;
    if (meta.ground && key !== 'M_Gutter' && key !== 'M_Paint_White' && key !== 'M_Paint_Yellow') groundMeshes.push(o);
  }
  groundGroup.add(groundG.scene);
  root.add(groundGroup);
  const groundH = new GroundHeight(groundMeshes, { cell: 1.0 });

  // wetness map (tools/world/pack_world.py bake_wetness: curb water, low spots, road mask)
  if (data.wet) {
    await new Promise((resolve) => texLoader.load(`${base}tex/wet.png`, (t) => {
      t.flipY = false; t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      shared.uWetTex.value = t;
      const [x0, z0, x1, z1] = data.wet.bounds;
      shared.uWetBounds.value.set(x0, z0, 1 / (x1 - x0), 1 / (z1 - z0));
      resolve();
    }, undefined, () => resolve()));
  }

  // interior linings behind the story openings (hollow game shells): inward-facing dark boxes; PROPS' rooms sit inside
  const linings = {};
  for (const [addr, L] of Object.entries(data.linings || {})) {
    const w = L.x[1] - L.x[0], h = L.y[1] - L.y[0], d = L.z[1] - L.z[0];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0.018, 0.016, 0.015), roughness: 0.95, side: THREE.BackSide }));
    mesh.position.set((L.x[0] + L.x[1]) / 2, (L.y[0] + L.y[1]) / 2, (L.z[0] + L.z[1]) / 2);
    mesh.name = `Interior${addr}Lining`;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    root.add(mesh);
    linings[addr] = mesh;
  }
  const groundY = (x, z, fallback = 0) => groundH.y(x, z, fallback);

  // ---------------------------------------------------------------------------------------------- sky, haze, fill
  const sky = makeSky();
  root.add(sky);
  const envMap = makeEnvironment(renderer, sky);
  if (!scene.environment) scene.environment = envMap;
  if (scene.environmentIntensity !== undefined) scene.environmentIntensity = 0.5;
  if (!scene.fog) scene.fog = new THREE.FogExp2(SKY_DEFAULTS.fog.clone(), 0.0098);
  if (!scene.background) scene.background = SKY_DEFAULTS.zenith.clone();
  const hemi = new THREE.HemisphereLight(new THREE.Color(0.06, 0.066, 0.088), new THREE.Color(0.03, 0.025, 0.02), 3.6);
  hemi.name = 'WitteNightFill';
  root.add(hemi);

  // ---------------------------------------------------------------------------------------------- lamps
  const pool = lightPool || new LightPool(scene, { points: 8, spots: 3, shadowSpots: quality === 'low' ? 1 : 2, quality });
  const ownPool = !lightPool;
  const lamps = [];
  const lights = { hemisphere: hemi, pool };
  data.lamps.forEach((l, i) => {
    const P = new THREE.Vector3(...l.pos);
    const e = { id: l.id, index: l.index ?? i, kind: l.kind, position: P, lit: l.lit !== false, failing: !!l.failing };
    if (l.kind === 'cobra') {
      const src = LAMP.cobra;
      e.color = src.color.clone();
      e.intensity = src.intensity;
      e.distance = src.distance;
      e.angle = src.angle;
      e.penumbra = src.penumbra;
      e.lightPos = P.clone().add(new THREE.Vector3(0, -0.12, 0));
      // cobra heads throw their light forward over the street (house-side cutoff): tilt the cone along the arm
      const arm = l.base ? new THREE.Vector3(P.x - l.base[0], 0, P.z - l.base[2]) : new THREE.Vector3(Math.sign(-P.x || 1), 0, 0);
      if (arm.lengthSq() < 1e-6) arm.set(Math.sign(-P.x || 1), 0, 0);
      arm.normalize();
      e.target = e.lightPos.clone().add(new THREE.Vector3(arm.x * 2.6, -8, arm.z * 2.6));
      e.dir = e.target.clone().sub(e.lightPos).normalize();
      e.k = l.failing ? flickerAt : () => 1;
      e.emissive = src.emissive;
      e.source = pool.register({ id: e.id, kind: 'spot', position: e.lightPos, target: e.target, color: e.color, intensity: e.intensity,
        distance: e.distance, decay: 2, angle: e.angle, penumbra: e.penumbra, priority: l.shadow ? 2.0 : 1.0,
        wantsShadow: !!l.shadow, intensityAt: e.k });
    } else {
      const src = LAMP.porch;
      e.color = src.color.clone();
      e.intensity = e.lit ? src.intensity : 0;
      e.distance = src.distance;
      e.lightPos = P.clone();
      e.k = () => 1;
      e.emissive = e.lit ? src.emissive : 0;
      if (e.lit) {
        e.source = pool.register({ id: e.id, kind: 'point', position: e.lightPos, color: e.color, intensity: e.intensity,
          distance: e.distance, decay: 2, priority: 1.2 });
      }
    }
    lamps.push(e);
    lights[e.id] = e;
  });
  lights.failing = lamps.find((e) => e.failing) || null;

  // lamp halos (one instanced draw call)
  const haloLamps = lamps.filter((e) => e.kind === 'cobra' || e.lit);
  const halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), haloMaterial(), haloLamps.length);
  halos.name = 'LampHalos';
  halos.frustumCulled = false;
  halos.renderOrder = 5;
  {
    const m = new THREE.Matrix4();
    haloLamps.forEach((e, i) => {
      const r = e.kind === 'cobra' ? 3.4 : 1.1;
      const p = e.kind === 'cobra' ? e.lightPos.clone().add(new THREE.Vector3(0, -0.05, 0)) : e.lightPos;
      m.makeScale(r, r, r).setPosition(p);
      halos.setMatrixAt(i, m);
      halos.setColorAt(i, new THREE.Color(0, 0, 0));
    });
    halos.instanceMatrix.needsUpdate = true;
  }
  root.add(halos);
  const haloK = { cobra: 0.016, lantern: 0.03 };

  // lit-window spill on the sidewalk (fake layer only, no pool slot)
  const winSpill = [];
  const litRows = data.instances.filter((r) => r[15]);
  for (const r of litRows) {
    const pos = new THREE.Vector3(r[2], r[3], r[4]);
    const q = new THREE.Quaternion(r[5], r[6], r[7], r[8]);
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
    const lc = r[15];
    winSpill.push({ position: pos.clone().add(new THREE.Vector3(0, 0.8, 0)).addScaledVector(fwd, -0.35),
      color: new THREE.Color(lc[0], lc[1], lc[2]).multiplyScalar(1 / Math.max(lc[0], lc[1], lc[2], 1e-3)),
      intensity: LAMP.window.intensity * Math.max(lc[0], lc[1], lc[2]), distance: LAMP.window.distance, dir: fwd });
  }

  // ---------------------------------------------------------------------------------------------- anchors
  const anchors = {};
  const toVec = (a) => (Array.isArray(a) && a.length === 3 && typeof a[0] === 'number' ? new THREE.Vector3(a[0], a[1], a[2]) : a);
  const conv = (o) => {
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === 'quaternion' && Array.isArray(v)) out[k] = new THREE.Quaternion(v[0], v[1], v[2], v[3]);
      else if (['position', 'bottom', 'normal', 'hinge', 'latch', 'topStep', 'target', 'lookAt', 'origin', 'forward', 'foot', 'alongLeft', 'a', 'b'].includes(k)) out[k] = toVec(v);
      else if (k === 'rails' && Array.isArray(v)) out[k] = v.map((r) => ({ ...r, wallEnd: toVec(r.wallEnd), streetEnd: toVec(r.streetEnd) }));
      else if (k === 'treads' && Array.isArray(v)) out[k] = v.map((t) => ({ ...t, centre: toVec(t.centre) }));
      else if (k === 'vents' && Array.isArray(v)) out[k] = v.map(toVec);
      else out[k] = v;
    }
    return out;
  };
  for (const [k, v] of Object.entries(data.anchors)) {
    if (k === 'places') continue;
    anchors[k] = conv(v);
  }
  anchors.places = {};
  for (const [k, v] of Object.entries(data.anchors.places || {})) anchors.places[k] = conv(v);
  for (const [k, v] of Object.entries(anchors.places)) if (!anchors[k]) anchors[k] = v;
  for (const sw of swaps) if (anchors[sw.name]) anchors[sw.name].seeThrough = true;

  // walkable surface height: the drawn ground plus the game's stoop treads (oriented boxes from the stoop anchors)
  const treads = [];
  for (const [k, a] of Object.entries(anchors)) {
    if (!k.startsWith('stoop_') || !a.treads) continue;
    const n = a.normal.clone().setY(0).normalize();
    const along = new THREE.Vector3(-n.z, 0, n.x);
    for (const tr of a.treads) treads.push({ c: tr.centre, n, along, halfD: tr.depth / 2 + 0.01, halfW: a.width / 2, y: tr.y });
  }
  const tv = new THREE.Vector3();
  function surfaceY(x, z, fallback = 0) {
    let y = groundH.y(x, z, fallback);
    for (const tr of treads) {
      tv.set(x - tr.c.x, 0, z - tr.c.z);
      if (Math.abs(tv.dot(tr.n)) <= tr.halfD && Math.abs(tv.dot(tr.along)) <= tr.halfW && tr.y > y) y = tr.y;
    }
    return y;
  }

  // ---------------------------------------------------------------------------------------------- update
  const camPos = new THREE.Vector3();
  const haloCol = new THREE.Color();
  let fakeMax = quality === 'low' ? 12 : FAKE_MAX;
  // preallocated fake-lamp candidates (no per-frame allocation)
  const cand = [];
  for (const e of lamps) cand.push({ e, w: null, I: 0, score: 0 });
  for (const w of winSpill) cand.push({ e: null, w, I: 0, score: 0 });
  const order = cand.slice();
  const byScore = (a, b) => b.score - a.score || (a.e ? a.e.index : 1000) - (b.e ? b.e.index : 1000);
  function update(t, camera) {
    shared.uTime.value = t;
    sky.material.uniforms.uTime.value = t;
    if (camera) camera.getWorldPosition(camPos);
    // the pool is a pure function of (t, camera, sources): evaluating it here gives the same assignment main.js gets
    if (camera) pool.update(t, camera);
    for (const e of lamps) e.real = 0;
    const matchSlot = (l) => {
      if (l.intensity <= 0) return;
      for (const e of lamps) {
        if (!e.source) continue;
        if (e.lightPos.distanceToSquared(l.position) < 1e-6) {
          const want = e.intensity * e.k(t);
          e.real = want > 0 ? Math.min(1, l.intensity / want) : 1;
          return;
        }
      }
    };
    for (const l of pool.points) matchSlot(l);
    for (const l of pool.spots) matchSlot(l);
    // fake lamp layer: every lamp at full strength minus what the pool already serves for real
    for (const c of cand) {
      if (c.e) {
        c.I = c.e.intensity * c.e.k(t) * (1 - c.e.real);
        const d = c.e.lightPos.distanceTo(camPos);
        c.score = c.I > 0.001 ? c.I / (1 + d * d * 0.01) : -1;
      } else {
        c.I = c.w.intensity;
        const d = c.w.position.distanceTo(camPos);
        c.score = (c.w.intensity * 6) / (1 + d * d * 0.02);
      }
    }
    order.sort(byScore);
    let n = 0;
    while (n < order.length && n < fakeMax && order[n].score > 0) n++;
    for (let i = 0; i < FAKE_MAX; i++) {
      const P = shared.uFakePos.value[i], C = shared.uFakeCol.value[i], D = shared.uFakeDir.value[i];
      if (i >= n) { P.set(0, -1000, 0, 0.001); C.set(0, 0, 0, -2); continue; }
      const f = order[i];
      if (f.e) {
        const e = f.e;
        P.set(e.lightPos.x, e.lightPos.y, e.lightPos.z, e.distance);
        C.set(e.color.r * f.I, e.color.g * f.I, e.color.b * f.I, e.kind === 'cobra' ? Math.cos(e.angle) : -2);
        if (e.kind === 'cobra') D.set(e.dir.x, e.dir.y, e.dir.z, Math.cos(e.angle * (1 - e.penumbra)));
      } else {
        const w = f.w;
        P.set(w.position.x, w.position.y, w.position.z, w.distance);
        C.set(w.color.r * f.I, w.color.g * f.I, w.color.b * f.I, Math.cos(1.45));
        D.set(w.dir.x, w.dir.y, w.dir.z, Math.cos(0.9));
      }
    }
    shared.uFakeCount.value = n;
    // emissive lamp heads / lantern glass follow their lamp (flicker included)
    for (const e of lamps) {
      if (e.index >= LAMP_MAX) continue;
      const k = e.lit ? e.k(t) : 0;
      shared.uLampI.value[e.index].set(e.color.r, e.color.g, e.color.b).multiplyScalar(e.emissive * k);
    }
    for (let i = 0; i < haloLamps.length; i++) {
      const e = haloLamps[i];
      const k = (e.lit ? e.k(t) : 0) * (e.kind === 'cobra' ? haloK.cobra : haloK.lantern) * e.emissive;
      haloCol.setRGB(e.color.r * k, e.color.g * k, e.color.b * k);
      halos.setColorAt(i, haloCol);
    }
    if (halos.instanceColor) halos.instanceColor.needsUpdate = true;
    if (reflection.enabled && camera) reflection.render(camera);
  }

  // ---------------------------------------------------------------------------------------------- planar reflection (high)
  const reflection = makeReflection(renderer, scene, shared, groundY, reflSkip);
  reflection.enabled = quality === 'high';
  shared.uReflOn.value = reflection.enabled ? 1 : 0;

  function setHaloStrength(cobra = 0.016, lantern = 0.03) { haloK.cobra = cobra; haloK.lantern = lantern; }

  function setQuality(q) {
    quality = q;
    for (const d of detailMeshes) d.visible = q !== 'low';
    fakeMax = q === 'low' ? 12 : FAKE_MAX;
    reflection.enabled = q === 'high';
    shared.uReflOn.value = reflection.enabled ? 1 : 0;
  }

  // the world adds itself to the scene (the lead may re-parent world.root). No shader warm-up here: main.js compiles
  // everything once all lights exist (a compile now built programs for the wrong light count and output target)
  scene.add(root);
  if (onProgress) onProgress(1);

  const stats = { kitTris, groundTris, instances: merged.placed, meshes: kitGroup.children.length + groundSrc.length + 2,
    lamps: lamps.length, litWindows: winSpill.length };
  const world = {
    root, anchors, lights, update, setQuality, setHaloStrength, halos, groundY, surfaceY, ground: groundH, flickerTimes: FLICKER_EPISODES, flickerEvents: FLICKER_EVENTS, flickerAt, linings,
    recommendedExposure: RECOMMENDED_EXPOSURE, envMap, sky, shared, data, stats, reflection, lamps,
    dispose() { draco.dispose(); reflection.dispose(); if (ownPool) scene.remove(pool.group); },
  };
  return world;
}

// Planar reflection for the wet street (high quality): the scene mirrored about the local road plane at the
// camera, rendered at half resolution into a linear HDR target and sampled by the puddles. The road rises ~1 m
// over the block, so the plane follows the ground under a point ahead of the camera.
function shadowReady(scene) {
  let ok = true;
  scene.traverse((o) => { if (o.isLight && o.castShadow && !o.shadow.map) ok = false; });
  return ok;
}

function makeReflection(renderer, scene, shared, groundY, skip = []) {
  const size = new THREE.Vector2();
  let rt = null;
  const mirrorCam = new THREE.PerspectiveCamera();
  const tmp = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const planePt = new THREE.Vector3();
  const view = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const target = new THREE.Vector3();
  const rot = new THREE.Matrix4();
  const textureMatrix = new THREE.Matrix4();
  const clipPlane = new THREE.Plane();
  const clipBias = 0.003;
  const q = new THREE.Vector4();
  const plane = new THREE.Vector4();
  const vis = new Array(skip.length);
  let shadowsOk = false;
  function ensure() {
    renderer.getDrawingBufferSize(size);
    const w = Math.max(2, Math.floor(size.x / 2)), h = Math.max(2, Math.floor(size.y / 2));
    if (!rt) {
      rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 0 });
      rt.texture.generateMipmaps = false;
      shared.uReflTex.value = rt.texture;
    } else if (rt.width !== w || rt.height !== h) {
      rt.setSize(w, h);
    }
  }
  const self = {
    enabled: false,
    render(camera) {
      ensure();
      camera.getWorldPosition(tmp);
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      if (camDir.lengthSq() < 1e-6) camDir.set(0, 0, -1);
      camDir.normalize();
      const py = groundY(tmp.x + camDir.x * 5, tmp.z + camDir.z * 5, groundY(tmp.x, tmp.z, 0));
      if (tmp.y <= py + 0.02) return;
      // mirror the camera about the plane y = py (three/addons Reflector construction)
      planePt.set(tmp.x, py, tmp.z);
      rot.extractRotation(camera.matrixWorld);
      view.copy(planePt).sub(tmp).reflect(up).negate().add(planePt);
      lookAt.set(0, 0, -1).applyMatrix4(rot).add(tmp);
      target.copy(planePt).sub(lookAt).reflect(up).negate().add(planePt);
      mirrorCam.position.copy(view);
      mirrorCam.up.set(0, 1, 0).applyMatrix4(rot).reflect(up);
      mirrorCam.lookAt(target);
      mirrorCam.far = camera.far;
      mirrorCam.layers.mask = camera.layers.mask;
      mirrorCam.updateMatrixWorld();
      mirrorCam.projectionMatrix.copy(camera.projectionMatrix);
      // texture matrix (world -> reflection uv)
      textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
      textureMatrix.multiply(mirrorCam.projectionMatrix);
      textureMatrix.multiply(mirrorCam.matrixWorldInverse);
      shared.uReflMatrix.value.copy(textureMatrix);
      // oblique near plane = the mirror plane (Lengyel), so nothing below the road leaks in
      clipPlane.normal.set(0, 1, 0);
      clipPlane.constant = -py;
      clipPlane.applyMatrix4(mirrorCam.matrixWorldInverse);
      plane.set(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);
      const pm = mirrorCam.projectionMatrix;
      q.x = (Math.sign(plane.x) + pm.elements[8]) / pm.elements[0];
      q.y = (Math.sign(plane.y) + pm.elements[9]) / pm.elements[5];
      q.z = -1.0;
      q.w = (1.0 + pm.elements[10]) / pm.elements[14];
      plane.multiplyScalar(2.0 / plane.dot(q));
      pm.elements[2] = plane.x;
      pm.elements[6] = plane.y;
      pm.elements[10] = plane.z + 1.0 - clipBias;
      pm.elements[14] = plane.w;
      // render
      const prevRT = renderer.getRenderTarget();
      const prevXr = renderer.xr.enabled;
      const prevAuto = renderer.shadowMap.autoUpdate;
      renderer.xr.enabled = false;
      // reuse this frame's shadow maps once they exist (first frame: let the reflection pass create them)
      if (!shadowsOk) shadowsOk = shadowReady(scene);
      if (shadowsOk) renderer.shadowMap.autoUpdate = false;
      shared.uReflOn.value = 0;
      shared.uReflTex.value = null; // never sample the target being drawn (feedback loop)
      for (let i = 0; i < skip.length; i++) { vis[i] = skip[i].visible; skip[i].visible = false; }
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, mirrorCam);
      for (let i = 0; i < skip.length; i++) skip[i].visible = vis[i];
      renderer.setRenderTarget(prevRT);
      shared.uReflTex.value = rt.texture;
      shared.uReflOn.value = 1;
      renderer.xr.enabled = prevXr;
      renderer.shadowMap.autoUpdate = prevAuto;
    },
    dispose() { if (rt) rt.dispose(); },
  };
  return self;
}

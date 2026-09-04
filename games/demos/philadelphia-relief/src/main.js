/**
 * Philadelphia Relief — application entry point.
 *
 * Load order is deliberate: terrain metadata and the heightmap first (nothing
 * can be placed on the ground without them), then the overlays in parallel.
 * Anything that fails to arrive is reported and switched off rather than
 * allowed to blank the screen.
 */

import * as THREE from '../vendor/three.module.min.js?v=philly-20260904';

import { createStore } from './state.js?v=philly-20260904';
import { CAMERA, CONTROLS } from './schema.js?v=philly-20260904';
import { effectiveLight } from './solar.js?v=philly-20260904';
import { getEra, eraRules, landmarkInEra } from './eras.js?v=philly-20260904';
import {
  createProjection, createElevationSampler, metersPerPixel, equivalentZoom,
  scaleBar, compassPoint, formatLatLon, easeInOutCubic, lerp, lerpAngle,
} from './geo.js?v=philly-20260904';
import { PRESETS, HOME_PRESET, getPreset, presetPatch } from './presets.js?v=philly-20260904';
import {
  TOURS, DEFAULT_TOUR, getTour, tourDuration, tourShotStart, tourFrame,
} from './tours.js?v=philly-20260904';
import {
  decodeState, encodeState, buildShareUrl, readViewName, cleanViewName,
} from './urlstate.js?v=philly-20260904';
import {
  ASSETS, MODE, assess, webglFailure, syntheticGrid,
} from './degraded.js?v=philly-20260904';
import {
  decodeHeightmap, buildMacroGrid, createTerrain, warpForDistance, fogDensityFor,
} from './terrain.js?v=philly-20260904';
import { createSky, sunDirection } from './sky.js?v=philly-20260904';
import { createPostFX } from './postfx.js?v=philly-20260904';
import { createCameraRig } from './camera.js?v=philly-20260904';
import { createLabelLayer, buildLabelCandidates } from './labels.js?v=philly-20260904';
import { createStructures } from './structures.js?v=philly-20260904';
import {
  TIER_PLAN, shouldActivateZone, distanceToBox, tierAssetPath,
} from './structures-data.js?v=philly-20260904';
import { createAdaptiveQuality, resolveQuality } from './adaptive.js?v=philly-20260904';
import {
  decodeFlood, floodSelection, floodLegend, FEMA_STYLE, SLR_STYLE,
} from './flood.js?v=philly-20260904';
import { buildLandmarkModels } from './landmark-models.js?v=philly-20260904';
import {
  groupLines, collectRings, buildLineMesh, buildAreaMesh, setVec3,
} from './vectors.js?v=philly-20260904';
import {
  buildControls, buildLayerToggles, buildPresets, buildQuickJumps,
  createSearch, buildSearchIndex, createDialogs, createCard, applyThemeChrome, toast,
  enumLabel, setValueNote, renderFloodLegend, renderEraBanner,
} from './ui.js?v=philly-20260904';
import { getTheme } from './themes.js?v=philly-20260904';

const LIGHT_BOUNDS = { altMin: CONTROLS.sunAltitude.min, altMax: CONTROLS.sunAltitude.max };

const $ = (id) => document.getElementById(id);
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ONBOARD_KEY = 'philly3d.seen.v1';

const dom = {
  canvas: $('canvas'), stage: $('stage'), labelHost: $('labelHost'),
  loading: $('loading'), loadingBar: $('loadingBar'), loadingMessage: $('loadingMessage'),
  degraded: $('degraded'), degradedTitle: $('degradedTitle'),
  degradedMessage: $('degradedMessage'), degradedClose: $('degradedClose'),
  studio: $('studio'), studioBody: $('studioBody'), studioToggle: $('studioToggle'),
  studioGroups: $('studioGroups'), layerToggles: $('layerToggles'),
  shots: $('shots'), shotsToggle: $('shotsToggle'),
  presetList: $('presetList'), quickJumps: $('quickJumps'),
  outPreset: $('outPreset'), outBlurb: $('outBlurb'), outCoords: $('outCoords'),
  outElev: $('outElev'), outBearing: $('outBearing'), outPitch: $('outPitch'),
  outZoom: $('outZoom'), outFps: $('outFps'),
  scaleLine: $('scaleLine'), scaleLabel: $('scaleLabel'),
  btnPlay: $('btnPlay'), playIcon: $('playIcon'), timelineTrack: $('timelineTrack'),
  timelineFill: $('timelineFill'), timelineShots: $('timelineShots'),
  timelineTime: $('timelineTime'),
  searchInput: $('searchInput'), searchResults: $('searchResults'),
  onboarding: $('onboarding'), obStart: $('obStart'), obTour: $('obTour'),
};

// ---------------------------------------------------------------------------
// Asset loading
// ---------------------------------------------------------------------------

function setProgress(fraction, message) {
  if (dom.loadingBar) dom.loadingBar.style.width = `${Math.round(fraction * 100)}%`;
  if (message && dom.loadingMessage) dom.loadingMessage.textContent = message;
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'default' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`${path}: failed to decode`));
    img.src = path;
  });
}

/** Pull the packed heightmap through a canvas to get at its bytes. */
function readImagePixels(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
  if (!ctx) throw new Error('2D canvas unavailable for heightmap decode');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function loadEverything() {
  const results = {};
  const data = {};
  const hashPatch = decodeState(window.location.hash) || {};
  const quality = resolveQuality(hashPatch.quality || 'auto', null);

  setProgress(0.05, 'Reading elevation model…');
  try {
    data.terrain = await fetchJson('data/terrain.json');
    results.terrain = true;
  } catch (error) {
    console.warn('[philly-relief] terrain metadata unavailable:', error.message);
    results.terrain = false;
  }

  if (results.terrain) {
    setProgress(0.18, 'Downloading terrain…');
    try {
      const img = await loadImage('data/heightmap.webp');
      setProgress(0.48, 'Decoding elevation…');
      const pixels = readImagePixels(img);
      if (pixels.width !== data.terrain.width || pixels.height !== data.terrain.height) {
        throw new Error(`heightmap is ${pixels.width}x${pixels.height}, `
          + `expected ${data.terrain.width}x${data.terrain.height}`);
      }
      const decoded = decodeHeightmap(pixels, data.terrain);
      if (decoded.probeFailures.length) {
        // Integrity probes exist precisely so this can never pass silently.
        console.warn('[philly-relief] heightmap integrity probes failed:',
          decoded.probeFailures);
      }
      data.grid = decoded.grid;
      results.heightmap = true;
    } catch (error) {
      console.warn('[philly-relief] heightmap unavailable:', error.message);
      results.heightmap = false;
    }
  } else {
    results.heightmap = false;
  }

  setProgress(0.62, 'Loading map layers…');
  const overlays = ASSETS.filter((a) => !a.required);
  const loaded = await Promise.all(overlays.map(async (asset) => {
    try {
      return { asset, value: await fetchJson(asset.path) };
    } catch (error) {
      console.warn(`[philly-relief] ${asset.id} unavailable:`, error.message);
      return { asset, value: null };
    }
  }));
  for (const { asset, value } of loaded) {
    results[asset.id] = value !== null;
    data[asset.id] = value;
  }

  setProgress(0.78, 'Loading buildings…');
  data.structures = await loadStructures(quality);
  results.structures = !!data.structures;

  // Schematic landmark models and their information cards are enhancements:
  // without them the map still draws every footprint and label.
  [data.landmarkModels, data.landmarkCards] = await Promise.all([
    optionalJson('data/landmark-models.json'), optionalJson('data/landmark-cards.json')]);

  setProgress(0.82, 'Building the scene…');
  return { results, data };
}

async function optionalJson(path) {
  try {
    return await fetchJson(path);
  } catch (error) {
    console.warn(`[philly-relief] ${path} unavailable:`, error.message);
    return null;
  }
}

async function fetchBinary(path) {
  const response = await fetch(path, { cache: 'default' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.arrayBuffer();
}

/**
 * The structures layer is a manifest plus one binary stream per zone and
 * height tier. Only the tiers the quality mode asks for are fetched, so a
 * phone in performance mode never downloads the rowhouse fabric at all.
 * A tier that fails to arrive is skipped; the manifest failing means no layer.
 */
async function loadStructures(quality, existing = null, activeZones = null) {
  let manifest = existing?.manifest;
  if (!manifest) {
    try {
      manifest = await fetchJson('data/structures/buildings.json');
    } catch (error) {
      console.warn('[philly-relief] structures manifest unavailable:', error.message);
      return null;
    }
  }
  const want = new Set(TIER_PLAN[quality] || TIER_PLAN.balanced);
  const tierBuffers = existing?.tierBuffers || new Map();
  const jobs = [];
  for (const zone of manifest.zones || []) {
    // Suburban zones are lazy: fetched once the camera approaches them.
    if (zone.lazy && !(activeZones && activeZones.has(zone.id))) continue;
    for (const tier of zone.tiers || []) {
      if (!want.has(tier.tier) || tierBuffers.has(tier.file)) continue;
      jobs.push((async () => {
        try {
          tierBuffers.set(tier.file, await fetchBinary(tierAssetPath(tier.file, manifest.format)));
        } catch (error) {
          console.warn(`[philly-relief] structures tier ${tier.file} unavailable:`,
            error.message);
        }
      })());
    }
  }
  await Promise.all(jobs);

  let bridges = existing?.bridges ?? null;
  if (bridges === null) {
    try {
      bridges = await fetchJson(`data/structures/${manifest.bridgesFile || 'bridges.json'}`);
    } catch (error) {
      console.warn('[philly-relief] bridges unavailable:', error.message);
      bridges = { bridges: [] };
    }
  }
  return { manifest, tierBuffers, bridges };
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
  const { results, data } = await loadEverything();
  const status = assess(results);

  // Fall back to a synthetic surface only when the real one is unreachable.
  let meta = data.terrain;
  let grid = data.grid;
  if (status.mode === MODE.FALLBACK) {
    meta = fallbackMeta();
    grid = syntheticGrid(meta.width, meta.height);
  }

  const projection = createProjection(meta);
  const sampleElevation = createElevationSampler(grid, meta.width, meta.height, projection);

  const store = createStore(decodeState(window.location.hash) || {});
  if (status.disableLayers.length) {
    const off = {};
    for (const id of status.disableLayers) off[id] = false;
    store.set({ layers: off }, { source: 'degraded' });
  }

  const renderer = createRenderer();
  if (!renderer) {
    showBanner(webglFailure('unsupported'));
    finishLoading();
    return;
  }

  // Quality: the setting is a manual level or "auto", which hands the
  // effective level to the adaptive controller; everything that costs
  // (terrain mesh, structure tiers, pixel ratio) follows the effective level.
  let effectiveQuality = resolveQuality(store.value('quality'), null);
  let adaptive = store.value('quality') === 'auto'
    ? createAdaptiveQuality({ start: effectiveQuality }) : null;

  const scene = new THREE.Scene();
  const sky = createSky(THREE);
  scene.add(sky.mesh);

  const macro = buildMacroGrid(grid, meta.width, meta.height, 256);
  let terrain = createTerrain(THREE, { meta, grid, macro, quality: effectiveQuality });
  scene.add(terrain.mesh);

  const overlayRoot = new THREE.Group();
  overlayRoot.name = 'overlays';
  scene.add(overlayRoot);
  const overlays = buildOverlays(data, { projection, sampleElevation }, overlayRoot);

  // Flood hazard data is fetched the first time its layer is switched on:
  // FEMA zones and NOAA sea-level scenarios are each a packed binary plus a
  // manifest, decoded into draped area meshes that join the overlay set.
  const flood = { manifests: {}, entries: {}, pending: {}, announced: new Set() };
  const FLOOD_FILES = { fema: 'fema-nfhl', slr: 'noaa-slr' };
  const FLOOD_NOTES = {
    fema: 'FEMA flood zones: a simplified National Flood Hazard Layer, not for insurance or '
      + 'permitting decisions',
    slr: 'NOAA sea-level scenarios show the scale of potential flooding, not exact locations',
  };
  function ensureFlood(source) {
    if (flood.entries[source]) return Promise.resolve();
    if (flood.pending[source]) return flood.pending[source];
    flood.pending[source] = (async () => {
      try {
        const [manifest, buffer] = await Promise.all([
          fetchJson(`data/flood/${FLOOD_FILES[source]}.json`),
          fetchBinary(`data/flood/${FLOOD_FILES[source]}.bin`),
        ]);
        const decoded = decodeFlood(buffer);
        const entries = [];
        for (const [cls, polys] of decoded.classes) {
          const name = manifest.classes[cls];
          const style = source === 'fema' ? FEMA_STYLE[name] : SLR_STYLE;
          if (!style) continue;
          const entry = buildAreaMesh(THREE, polys.map((poly) => poly.ring),
            { projection, sampleElevation }, {
              kind: 'flood', color: style.color, opacity: style.opacity, renderOrder: 8,
              name: `flood-${source}-${name}`,
            });
          if (!entry) continue;
          entry.layer = 'flood';
          entry.kind = 'flood';
          entry.floodKey = `${source}:${name}`;
          entry.polygons = polys.length;
          entry.mesh.visible = false;
          overlayRoot.add(entry.mesh);
          overlays.areas.push(entry);
          overlays.all.push(entry);
          entries.push(entry);
        }
        flood.manifests[source] = manifest;
        flood.entries[source] = entries;
        recolorOverlays(overlays, getTheme(store.value('theme')));
      } catch (error) {
        console.warn(`[philly-relief] flood data ${source} unavailable:`, error.message);
        flood.manifests[source] = null;
        flood.entries[source] = [];
      } finally {
        delete flood.pending[source];
        adaptive?.disturb();
        applyState(store.get(), { terrain, sky, overlays, structures, postfx, ui, flood, force: true });
      }
    })();
    return flood.pending[source];
  }

  let structures = null;
  if (data.structures) {
    structures = createStructures(THREE, {
      manifest: data.structures.manifest,
      tierBuffers: data.structures.tierBuffers,
      bridgesDoc: data.structures.bridges,
      landmarkModels: packLandmarkModels(data, projection, sampleElevation),
      projection,
      sampleElevation,
      quality: effectiveQuality,
    });
    scene.add(structures.group);
    fillStructureFacts(data.structures.manifest, structures);
  }

  const postfx = createPostFX(THREE, renderer);

  const rig = createCameraRig(THREE, {
    store,
    // The stage holds the canvas and the label layer, so gestures that start
    // on a label (dense over the skyline) still drive the camera.
    dom: dom.stage,
    projection,
    sampleElevation,
    getExaggeration: () => (store.isLayerOn('terrain') ? store.value('exaggeration') : 0),
    onInteract: () => motion.interrupt(),
  });

  const labels = createLabelLayer(THREE, {
    container: dom.labelHost,
    projection,
    sampleElevation,
    onSelect: (item) => {
      motion.flyTo({ lon: item.lon, lat: item.lat }, { label: item.name });
      if (item.kind === 'landmark') ui.openCard(item.name);
    },
  });
  const landmarksForEra = (era) => (data.landmarks ? {
    ...data.landmarks,
    landmarks: (data.landmarks.landmarks || []).filter((l) => landmarkInEra(l, era)),
  } : data.landmarks);
  labels.setCandidates(buildLabelCandidates(data.places, landmarksForEra(store.value('era'))));
  store.subscribe((state, changed) => {
    if (changed.has('era')) {
      labels.setCandidates(buildLabelCandidates(data.places, landmarksForEra(state.era)));
    }
  });

  const motion = createMotion(store, projection);
  const ui = wireInterface({ store, motion, data, projection, rig, structures });

  // A click on the canvas (a press that neither moved nor lingered) picks a
  // landmark model and opens its card. Labels handle their own clicks.
  const picker = new THREE.Raycaster();
  const pickPoint = new THREE.Vector2();
  let press = null;
  dom.stage.addEventListener('pointerdown', (event) => {
    press = event.button === 0 && event.target === renderer.domElement
      ? { x: event.clientX, y: event.clientY, at: performance.now() } : null;
  });
  dom.stage.addEventListener('pointerup', (event) => {
    const start = press;
    press = null;
    if (!start || !structures || event.target !== renderer.domElement) return;
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved > 4 || performance.now() - start.at > 500) return;
    const rect = dom.stage.getBoundingClientRect();
    pickPoint.set(((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1);
    picker.setFromCamera(pickPoint, rig.camera);
    const model = structures.pickLandmark(picker);
    if (model) ui.openCard(model.landmark);
  });

  applyState(store.get(), { terrain, sky, overlays, structures, postfx, ui, flood, force: true });
  store.subscribe((state) => applyState(state, { terrain, sky, overlays, structures, postfx, ui, flood }));

  // Structure tiers follow the effective quality and the set of active zones.
  // Raising the quality later means the rowhouse tier was never fetched;
  // lowering it on a phone frees that memory again. Suburban zones join the
  // active set as the camera approaches them and are never dropped.
  const activeZones = new Set((data.structures?.manifest.zones || [])
    .filter((z) => !z.lazy).map((z) => z.id));
  let tierSync = Promise.resolve();
  function syncTiers(level) {
    if (!structures || !data.structures) return;
    const wanted = new Set(TIER_PLAN[level] || TIER_PLAN.balanced);
    tierSync = tierSync.then(async () => {
      const fresh = await loadStructures(level, data.structures, activeZones);
      if (!fresh) return;
      for (const zone of fresh.manifest.zones || []) {
        if (!activeZones.has(zone.id)) continue;
        for (const tier of zone.tiers || []) {
          const have = structures.hasTier(zone.id, tier.tier);
          const buffer = fresh.tierBuffers.get(tier.file);
          if (wanted.has(tier.tier) && !have && buffer) structures.addTier(zone, tier, buffer);
          if (!wanted.has(tier.tier) && have) {
            structures.removeTier(zone.id, tier.tier);
            fresh.tierBuffers.delete(tier.file);
          }
        }
      }
      structures.setTheme(getTheme(store.value('theme')));
      adaptive?.disturb();
    }).catch((error) => console.warn('[philly-relief] tier sync failed:', error));
  }

  // The 1776 view draws an approximate built-up extent traced from Faden's
  // 1777 plan; it is fetched the first time that era is chosen.
  const eraExtent = { entries: null, pending: null };
  function ensureEraExtent() {
    if (eraExtent.entries || eraExtent.pending) return eraExtent.pending || Promise.resolve();
    eraExtent.pending = (async () => {
      try {
        const doc = await fetchJson('data/eras/philadelphia-1776.geojson');
        const entry = buildAreaMesh(THREE, collectRings(doc), { projection, sampleElevation }, {
          kind: 'era', color: '#f2b45c', opacity: 0.34, renderOrder: 9, name: 'era-1776-extent',
        });
        eraExtent.entries = [];
        if (entry) {
          entry.layer = 'era';
          entry.kind = 'era';
          entry.mesh.visible = false;
          overlayRoot.add(entry.mesh);
          overlays.areas.push(entry);
          overlays.all.push(entry);
          eraExtent.entries.push(entry);
          recolorOverlays(overlays, getTheme(store.value('theme')));
        }
      } catch (error) {
        console.warn('[philly-relief] 1776 extent unavailable:', error.message);
        eraExtent.entries = [];
      } finally {
        eraExtent.pending = null;
        applyState(store.get(), { terrain, sky, overlays, structures, postfx, ui, flood, force: true });
      }
    })();
    return eraExtent.pending;
  }
  store.subscribe((state, changed) => {
    if (changed.has('era') && eraRules(state.era).extent1776) ensureEraExtent();
  });
  if (eraRules(store.value('era')).extent1776) ensureEraExtent();

  const qualityNote = () => setValueNote('quality',
    store.value('quality') === 'auto' ? enumLabel('quality', effectiveQuality) : '');
  function applyQuality(level, message) {
    if (level === effectiveQuality) return;
    effectiveQuality = level;
    rebuildTerrain(level);
    syncTiers(level);
    qualityNote();
    if (message) toast(message);
  }
  store.subscribe((state, changed) => {
    if (!changed.has('quality')) return;
    if (state.quality === 'auto') {
      // Start adapting from wherever we are: no jump on the way in.
      adaptive = createAdaptiveQuality({ start: effectiveQuality });
    } else {
      adaptive = null;
      applyQuality(state.quality);
    }
    qualityNote();
  });
  qualityNote();

  store.subscribe((state, changed) => {
    if (!changed.has('layers.flood') && !changed.has('floodMode')) return;
    if (!state.layers.flood) return;
    const source = state.floodMode === 'slr' ? 'slr' : 'fema';
    ensureFlood(source);
    if (!flood.announced.has(source)) {
      flood.announced.add(source);
      toast(FLOOD_NOTES[source]);
    }
  });
  if (store.isLayerOn('flood')) ensureFlood(store.value('floodMode') === 'slr' ? 'slr' : 'fema');

  // ---- resize -------------------------------------------------------------
  let viewW = 1;
  let viewH = 1;

  function resize() {
    const rect = dom.stage.getBoundingClientRect();
    viewW = Math.max(1, Math.round(rect.width));
    viewH = Math.max(1, Math.round(rect.height));
    const quality = effectiveQuality;
    const cap = quality === 'performance' ? 1 : quality === 'cinematic' ? 2 : 1.5;
    adaptive?.disturb();
    const ratio = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(ratio);
    renderer.setSize(viewW, viewH, false);
    postfx.setSize(viewW, viewH, ratio);
    rig.setAspect(viewW / viewH);
    for (const entry of overlays.lines) {
      entry.material.uniforms.uResolution.value.set(viewW, viewH);
    }
    structures?.setResolution(viewW, viewH);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- frame loop ---------------------------------------------------------
  const sunDir = new THREE.Vector3();
  let lastRenderInfo = null;
  let lastLight = null;

  // Read-only diagnostics for the QA harness and curious readers. Nothing in
  // the app depends on it.
  window.philadelphiaRelief = Object.freeze({
    stats: () => ({
      structures: structures ? structures.stats() : null,
      structureTiers: structures ? structures.loadedTiers : [],
      buildingsLoaded: structures ? structures.buildingTotal : 0,
      bridges: structures ? structures.bridges : [],
      drawCalls: lastRenderInfo ? lastRenderInfo.calls : 0,
      triangles: lastRenderInfo ? lastRenderInfo.triangles : 0,
      quality: store.value('quality'),
      effectiveQuality,
      adaptive: adaptive
        ? { level: adaptive.level, fps: Math.round(adaptive.fps), steps: adaptive.steps }
        : null,
      zones: [...activeZones],
      flood: {
        loaded: Object.keys(flood.entries),
        visible: overlays.all.filter((e) => e.layer === 'flood' && e.mesh.visible).map((e) => e.floodKey),
        polygons: overlays.all.filter((e) => e.layer === 'flood' && e.mesh.visible)
          .reduce((a, e) => a + (e.polygons || 0), 0),
      },
      landmarkModels: structures ? structures.landmarkModelCount : 0,
      card: ui.cardName,
      viewName: ui.viewName,
      era: {
        id: store.value('era'),
        year: structures ? structures.eraYear : 9999,
        bridges: structures ? structures.visibleBridges : [],
        motorwaysVisible: overlays.all.some((e) => e.kind === 'road-1' && e.mesh.visible),
        railVisible: overlays.all.some((e) => e.layer === 'rail' && e.mesh.visible),
        extent1776Visible: overlays.all.some((e) => e.layer === 'era' && e.mesh.visible),
      },
      light: lastLight ? {
        clock: lastLight.clock, weather: lastLight.weather, night: lastLight.night,
        sunAzimuth: Math.round(lastLight.sunAzimuth * 10) / 10,
        sunAltitude: Math.round(lastLight.sunAltitude * 10) / 10,
        trueAltitude: Math.round(lastLight.trueAltitude * 10) / 10,
        keyLight: Math.round(lastLight.keyLight * 100) / 100,
        fogDensity: Math.round(lastLight.fogDensity * 100) / 100,
      } : null,
    }),
  });
  let last = performance.now();
  let labelClock = 0;
  let zoneClock = 0;
  const zoneFrustum = new THREE.Frustum();
  const zoneMatrix = new THREE.Matrix4();
  const zoneBox = new THREE.Box3();
  let fpsAccum = 0;
  let fpsFrames = 0;
  let running = true;
  let elapsed = 0;

  function renderFrame(dt) {
    motion.update(dt);

    const state = store.get();
    const exaggeration = state.layers.terrain ? state.exaggeration : 0;
    const pose = rig.update(dt, { snap: false });
    rig.setAspect(viewW / viewH);

    const camera = rig.camera;
    const now = rig.pose();

    // Terrain detail follows the camera: the warp concentrates mesh density
    // around wherever the orbit target has landed.
    terrain.uniforms.uCenter.value.set(
      (now.lon - projection.bounds.west) / (projection.bounds.east - projection.bounds.west),
      (projection.bounds.north - now.lat) / (projection.bounds.north - projection.bounds.south));
    terrain.uniforms.uWarp.value = warpForDistance(now.dist);
    terrain.uniforms.uCameraPos.value.copy(camera.position);
    terrain.uniforms.uExag.value = exaggeration;

    // Suburban structure zones load once they are in view and near enough:
    // a coarse reach test first, then the zone's box against the frustum.
    zoneClock += dt;
    if (zoneClock >= 0.5 && structures && data.structures) {
      zoneClock = 0;
      let joined = false;
      let frustumReady = false;
      for (const zone of data.structures.manifest.zones || []) {
        if (activeZones.has(zone.id) || !shouldActivateZone(zone, now)) continue;
        if (!frustumReady) {
          zoneFrustum.setFromProjectionMatrix(zoneMatrix.multiplyMatrices(
            camera.projectionMatrix, camera.matrixWorldInverse));
          frustumReady = true;
        }
        const b = zone.bounds;
        zoneBox.min.set(projection.lonToX(b.west), -50, projection.latToZ(b.north));
        zoneBox.max.set(projection.lonToX(b.east), 6000, projection.latToZ(b.south));
        if (!zoneFrustum.intersectsBox(zoneBox)) continue;
        const eyeGap = distanceToBox(camera.position.x, camera.position.z, {
          minX: zoneBox.min.x, maxX: zoneBox.max.x, minZ: zoneBox.min.z, maxZ: zoneBox.max.z });
        if (eyeGap > 30000) continue;
        activeZones.add(zone.id);
        joined = true;
      }
      if (joined) syncTiers(effectiveQuality);
    }

    const light = effectiveLight(state, LIGHT_BOUNDS);
    lastLight = light;
    sunDirection(light.sunAzimuth, light.sunAltitude, sunDir);
    terrain.uniforms.uSunDir.value.copy(sunDir);
    sky.uniforms.uSunDir.value.copy(sunDir);
    sky.uniforms.uSunAltitude.value = light.sunAltitude;
    sky.uniforms.uHaze.value = light.fogDensity;
    sky.uniforms.uNight.value = 1 - light.twilight;

    elapsed += dt * state.animationSpeed;
    const lift = 30 + now.dist * 0.0016;
    for (const entry of overlays.lines) {
      const u = entry.material.uniforms;
      u.uExag.value = exaggeration;
      u.uLift.value = lift;
      u.uNear.value = camera.near;
    }
    for (const entry of overlays.areas) {
      const u = entry.material.uniforms;
      u.uExag.value = exaggeration;
      u.uLift.value = entry.kind === 'water' ? lift * 0.45 : entry.kind === 'flood' ? lift * 0.6 : lift * 0.3;
      u.uCameraPos.value.copy(camera.position);
      u.uFogDensity.value = terrain.uniforms.uFogDensity.value;
      if (entry.kind === 'water') {
        u.uSunDir.value.copy(sunDir);
        u.uTime.value = elapsed;
      }
    }

    if (structures) {
      structures.update({
        camera, state, exaggeration, dt, sunDir, light,
        fogDensity: terrain.uniforms.uFogDensity.value,
      });
    }

    renderer.setRenderTarget(postfx.renderTarget);
    renderer.clear();
    renderer.render(scene, camera);
    // Snapshot before the post-FX passes reset the counters.
    lastRenderInfo = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
    postfx.composite();

    labelClock += dt;
    if (labelClock > 1 / 24) {
      labelClock = 0;
      labels.update(camera, {
        width: viewW,
        height: viewH,
        exaggeration,
        density: state.labelDensity,
        size: state.labelSize,
        showPlaces: state.layers.places,
        showLandmarks: state.layers.landmarks,
      });
    }

    ui.updateReadout({ pose: now, groundY: pose.groundY, viewH, dt });
  }

  function tick(timestamp) {
    if (!running) return;
    const rawDt = (timestamp - last) / 1000;
    const dt = Math.min(0.1, rawDt) || 0.016;
    last = timestamp;

    fpsAccum += dt;
    fpsFrames += 1;
    if (fpsAccum >= 0.5) {
      ui.setFps(fpsFrames / fpsAccum);
      fpsAccum = 0;
      fpsFrames = 0;
    }

    renderFrame(dt);

    if (adaptive) {
      const level = adaptive.sample(rawDt);
      if (level !== effectiveQuality) {
        const step = adaptive.steps.at(-1);
        const name = enumLabel('quality', level);
        applyQuality(level, step?.reason === 'headroom'
          ? `Quality raised to ${name}: there is headroom`
          : `Quality set to ${name} to keep the map smooth (${step?.fps ?? '?'} fps)`);
      }
    }
    requestAnimationFrame(tick);
  }

  // Pause when the tab is hidden so a backgrounded map costs nothing.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      last = performance.now();
      adaptive?.disturb();
      requestAnimationFrame(tick);
    }
  });

  dom.canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    running = false;
    showBanner(webglFailure('lost'));
  });

  ui.setCapture(() => {
    adaptive?.disturb();
    renderFrame(0);
    return dom.canvas;
  });
  function rebuildTerrain(quality) {
    scene.remove(terrain.mesh);
    terrain.dispose();
    terrain = createTerrain(THREE, { meta, grid, macro, quality });
    terrain.setTheme(store.value('theme'));
    scene.add(terrain.mesh);
    applyState(store.get(), { terrain, sky, overlays, structures, postfx, ui, flood, force: true });
    resize();
    adaptive?.disturb();
  }

  if (status.mode !== MODE.FULL) {
    showBanner(status);
    if (status.disableLayers.length) {
      ui.layerToggles.disable(status.disableLayers, 'This layer’s data could not be loaded.');
    }
  }

  requestAnimationFrame(tick);
  finishLoading();

  if (!window.location.hash && !readSeen()) {
    dom.onboarding.hidden = false;
    dom.obStart?.focus();
  }
}

function fallbackMeta() {
  const west = -75.8;
  const east = -74.7;
  const south = 39.7;
  const north = 40.55;
  const lat0 = (south + north) / 2;
  const mLat = 111132.92 - 559.82 * Math.cos(2 * lat0 * Math.PI / 180);
  const mLon = 111412.84 * Math.cos(lat0 * Math.PI / 180);
  return {
    width: 512,
    height: 512,
    bounds: { west, east, south, north },
    elevation: { min: 0, max: 190, step: 1 },
    projection: {
      lat0, lon0: (west + east) / 2,
      metersPerDegLat: mLat, metersPerDegLon: mLon,
      widthM: (east - west) * mLon, heightM: (north - south) * mLat,
    },
    stats: { sampleSpacingM: 0 },
    probes: [],
    synthetic: true,
  };
}

function createRenderer() {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas: dom.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.autoClear = false;
    return renderer;
  } catch (error) {
    console.error('[philly-relief] WebGL unavailable:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Overlay construction
// ---------------------------------------------------------------------------

function buildOverlays(data, ctx, root) {
  const lines = [];
  const areas = [];

  const add = (entry, layer, kind) => {
    if (!entry) return;
    entry.layer = layer;
    entry.kind = kind || layer;
    root.add(entry.mesh);
    (entry.mesh.material.uniforms.uResolution ? lines : areas).push(entry);
  };

  // Water: polygons first (the river sheets), then the line network on top.
  if (data.water) {
    const rings = collectRings(data.water);
    add(buildAreaMesh(THREE, rings, ctx, {
      kind: 'water', color: '#12283f', renderOrder: 6, name: 'water-areas',
    }), 'water', 'water');

    const byRank = groupLines(data.water, (p) => (p.rank <= 2 ? 'major' : 'minor'));
    for (const [rank, parts] of byRank) {
      add(buildLineMesh(THREE, parts, ctx, {
        width: rank === 'major' ? 3.4 : 1.5,
        color: '#2c4d66',
        opacity: rank === 'major' ? 1 : 0.8,
        renderOrder: 12,
        name: `water-${rank}`,
      }), 'water', `water-${rank}`);
    }
  }

  if (data.parks) {
    add(buildAreaMesh(THREE, collectRings(data.parks), ctx, {
      kind: 'park', color: '#3f5a3a', opacity: 0.4, renderOrder: 4, name: 'parks',
    }), 'parks', 'park');
  }

  if (data.roads) {
    const byTier = groupLines(data.roads, (p) => p.t);
    for (const tier of [3, 4, 2, 1]) {
      const parts = byTier.get(tier);
      if (!parts) continue;
      add(buildLineMesh(THREE, parts, ctx, {
        width: tier === 1 ? 2.2 : tier === 2 ? 1.4 : 0.9,
        color: '#ffd9a8',
        opacity: 1,
        renderOrder: 14 + (4 - tier),
        name: `roads-${tier}`,
      }), 'roads', `road-${tier}`);
    }
  }

  if (data.rail) {
    const byKind = groupLines(data.rail, (p) => p.k);
    for (const [kind, parts] of byKind) {
      add(buildLineMesh(THREE, parts, ctx, {
        width: kind === 1 ? 1.5 : 1.2,
        color: '#e8ddd0',
        opacity: 0.85,
        renderOrder: 13,
        name: `rail-${kind}`,
      }), 'rail', `rail-${kind}`);
    }
  }

  if (data.boundaries) {
    const byLevel = groupLines(data.boundaries, (p) => p.lvl);
    for (const [level, parts] of byLevel) {
      add(buildLineMesh(THREE, parts, ctx, {
        width: level === 6 ? 2.0 : 1.0,
        color: '#f2e2c8',
        opacity: level === 6 ? 1 : 0.5,
        renderOrder: 11,
        name: `boundary-${level}`,
      }), 'boundaries', `boundary-${level}`);
    }
  }

  return { lines, areas, all: [...lines, ...areas] };
}

// ---------------------------------------------------------------------------
// State -> scene
// ---------------------------------------------------------------------------

let lastTheme = null;

function applyState(state, ctx) {
  const { terrain, sky, overlays, structures, postfx, ui, flood, force } = ctx;
  const theme = getTheme(state.theme);

  if (force || state.theme !== lastTheme) {
    lastTheme = state.theme;
    terrain.setTheme(state.theme);
    sky.setTheme(state.theme);
    applyThemeChrome(state.theme);
    recolorOverlays(overlays, theme);
    structures?.setTheme(theme);
  }
  if (structures) structures.group.visible = !!state.layers.structures;

  const light = effectiveLight(state, LIGHT_BOUNDS);
  const u = terrain.uniforms;
  u.uKey.value = light.keyLight;
  u.uAmbient.value = light.ambient;
  u.uFogDensity.value = fogDensityFor(light.fogDensity);
  u.uContourStrength.value = state.layers.contours ? state.contourStrength : 0;
  u.uContourInterval.value = state.contourInterval;
  u.uHillshade.value = state.layers.hillshade ? 1 : 0;
  u.uReliefOn.value = state.layers.terrain ? 1 : 0;

  postfx.setIntensity(light.glow * 0.85);
  postfx.setThreshold(state.theme === 'noir' ? 0.5 : 0.72);
  postfx.setVignette(0.28 + light.fogDensity * 0.35);

  const selection = flood ? floodSelection(state, flood.manifests) : null;
  const era = eraRules(state.era);
  structures?.setEra(era.year);
  for (const entry of overlays.all) {
    let on = !!state.layers[entry.layer];
    if (entry.layer === 'flood') on = !!selection && selection.keys.has(entry.floodKey);
    if (entry.layer === 'era') on = era.extent1776;
    if (entry.layer === 'rail' && !era.rail) on = false;
    if (entry.kind === 'road-1' && era.motorways === 'hide') on = false;
    entry.mesh.visible = on;
    const uu = entry.mesh.material.uniforms;
    if (entry.layer === 'roads' && uu.uOpacity) {
      const tier = Number(entry.kind.split('-')[1]);
      // Secondary roads and ramps are context, not subject: at full strength
      // the network read as the map and buried the relief underneath it.
      uu.uOpacity.value = state.roadOpacity
        * (tier === 1 ? 1 : tier === 2 ? 0.6 : tier === 3 ? 0.3 : 0.25)
        * (tier === 1 && era.motorways === 'ghost' ? 0.3 : 1);
    } else if (entry.layer === 'boundaries' && uu.uOpacity) {
      const level = Number(entry.kind.split('-')[1]);
      uu.uOpacity.value = state.boundaryOpacity * (level === 6 ? 1 : 0.55);
    } else if (entry.kind === 'water') {
      uu.uIntensity.value = light.waterIntensity;
    } else if (entry.layer === 'water' && uu.uOpacity) {
      uu.uOpacity.value = 0.35 + light.waterIntensity * 0.65;
    }
  }

  ui?.syncControls(state);
  if (selection) renderFloodLegend($('floodLegend'), floodLegend(selection, flood.manifests));
  renderEraBanner($('eraBanner'), getEra(state.era),
    () => ui?.store?.set({ era: 'present' }, { source: 'ui' }));
  // In clock mode the sun sliders are overridden; say so in their readouts.
  setValueNote('sunAzimuth', light.clock ? `${Math.round(light.sunAzimuth)}° by the clock` : '');
  setValueNote('sunAltitude', light.clock
    ? `${Math.round(light.trueAltitude)}° by the clock${light.night ? ' (night)' : ''}` : '');
}

function recolorOverlays(overlays, theme) {
  for (const entry of overlays.all) {
    const u = entry.mesh.material.uniforms;
    if (entry.kind === 'water') {
      setVec3(u.uColor.value, theme.water);
      setVec3(u.uShallow.value, theme.waterShallow);
      setVec3(u.uSpecColor.value, theme.waterSpec);
      setVec3(u.uFogTint.value, theme.fogTint);
      setVec3(u.uFogColor.value, theme.fog);
    } else if (entry.layer === 'water') {
      setVec3(u.uColor.value, theme.waterShallow);
    } else if (entry.layer === 'parks') {
      setVec3(u.uColor.value, theme.park);
      setVec3(u.uFogColor.value, theme.fog);
    } else if (entry.layer === 'roads') {
      const tier = Number(entry.kind.split('-')[1]);
      setVec3(u.uColor.value, theme.road[Math.min(2, tier - 1)] || theme.road[0]);
    } else if (entry.layer === 'rail') {
      setVec3(u.uColor.value, theme.rail);
    } else if (entry.layer === 'boundaries') {
      setVec3(u.uColor.value, theme.boundary);
    } else if (entry.layer === 'flood' || entry.layer === 'era') {
      setVec3(u.uFogColor.value, theme.fog);
    }
  }
}

// ---------------------------------------------------------------------------
// Camera motion: preset transitions, fly-to, and the flythrough
// ---------------------------------------------------------------------------

function createMotion(store, projection) {
  let active = null;      // { from, to, t, duration, kind }
  let tourTime = 0;
  let playing = false;
  let tour = getTour(DEFAULT_TOUR);
  let caption = null;
  const listeners = new Set();

  const flyDuration = REDUCED_MOTION ? 0.2 : 1.9;

  function notify() {
    for (const fn of listeners) fn({ playing, tourTime, tour, caption });
  }

  function snapshot() {
    const s = store.get();
    const out = {};
    for (const key of Object.keys(CAMERA)) out[key] = s[key];
    return out;
  }

  return {
    onChange(fn) { listeners.add(fn); },

    get playing() { return playing; },
    get tourTime() { return tourTime; },
    get tour() { return tour; },
    get duration() { return tourDuration(tour); },
    get caption() { return caption; },

    /** Switch tours; playback restarts from that tour's first shot. */
    setTour(id) {
      const next = getTour(id);
      if (!next || next === tour) return;
      const wasPlaying = playing;
      this.stop();
      tour = next;
      tourTime = 0;
      caption = null;
      if (wasPlaying) this.play(); else notify();
    },

    /** Jump to the start of the previous / next shot in the current tour. */
    step(delta) {
      const frame = tourFrame(tour, tourTime);
      if (!frame) return;
      const n = tour.shots.length;
      const target = (frame.index + delta + n) % n;
      this.seek(tourShotStart(tour, target));
      if (!playing) this.play();
    },

    /** Restage the whole scene as a preset, easing the camera into place. */
    toPreset(id, { immediate = false } = {}) {
      const patch = presetPatch(id);
      if (!patch) return;
      this.stop();
      if (immediate || REDUCED_MOTION) {
        store.set(patch, { source: 'preset' });
        return;
      }
      // Look and layers switch at once; only the camera is eased, so the new
      // lighting is established while the move is still happening.
      const { layers, ...rest } = patch;
      const cameraKeys = {};
      const lookKeys = {};
      for (const [key, value] of Object.entries(rest)) {
        if (key in CAMERA) cameraKeys[key] = value;
        else lookKeys[key] = value;
      }
      store.set({ ...lookKeys, layers }, { source: 'preset' });
      active = { from: snapshot(), to: cameraKeys, t: 0, duration: flyDuration, kind: 'preset' };
    },

    /** Move the camera to a place without disturbing the current look. */
    flyTo(target, { label } = {}) {
      this.stop();
      const from = snapshot();
      const clamped = projection.clamp(target.lon, target.lat);
      const to = {
        camLon: clamped.lon,
        camLat: clamped.lat,
        camDist: target.camDist ?? Math.min(from.camDist, 16000),
        camBearing: target.camBearing ?? from.camBearing,
        camPitch: target.camPitch ?? from.camPitch,
      };
      if (REDUCED_MOTION) {
        store.set(to, { source: 'fly' });
      } else {
        active = { from, to, t: 0, duration: flyDuration, kind: 'fly' };
      }
      if (label) toast(`Flying to ${label}`);
    },

    play() {
      playing = true;
      active = null;
      notify();
    },

    pause() {
      playing = false;
      notify();
    },

    toggle() {
      if (playing) this.pause(); else this.play();
    },

    seek(seconds) {
      const total = tourDuration(tour) || 1;
      tourTime = ((seconds % total) + total) % total;
      const frame = tourFrame(tour, tourTime);
      if (frame?.patch) store.set(frame.patch, { source: 'tour' });
      caption = frame?.caption || null;
      notify();
    },

    stop() {
      if (playing) {
        playing = false;
        caption = null;
        notify();
      }
      active = null;
    },

    /** A user grabbing the camera pauses playback rather than fighting it. */
    interrupt() {
      if (playing) {
        playing = false;
        caption = null;
        toast('Tour paused');
        notify();
      }
      active = null;
    },

    update(dt) {
      if (playing) {
        tourTime = (tourTime + dt * store.value('animationSpeed')) % (tourDuration(tour) || 1);
        const frame = tourFrame(tour, tourTime);
        if (frame?.patch) store.set(frame.patch, { source: 'tour' });
        caption = frame?.caption || null;
        notify();
        return;
      }
      if (!active) return;
      active.t = Math.min(1, active.t + dt / active.duration);
      const e = easeInOutCubic(active.t);
      const patch = {};
      for (const [key, target] of Object.entries(active.to)) {
        const from = active.from[key];
        if (key === 'camBearing') patch[key] = lerpAngle(from, target, e);
        else if (key === 'camDist') patch[key] = Math.exp(lerp(Math.log(from), Math.log(target), e));
        else patch[key] = lerp(from, target, e);
      }
      store.set(patch, { source: 'fly' });
      if (active.t >= 1) active = null;
    },
  };
}

// ---------------------------------------------------------------------------
// Interface wiring
// ---------------------------------------------------------------------------

function wireInterface(deps) {
  const { store, motion, data, projection, rig, structures } = deps;

  const controls = buildControls(store, dom.studioGroups);
  const layerToggles = buildLayerToggles(store, dom.layerToggles);
  const presets = buildPresets(dom.presetList, (id) => motion.toPreset(id));
  buildQuickJumps(dom.quickJumps, (jump) => motion.flyTo(jump, { label: jump.name }));
  buildQuickJumps($('structureJumps'), (jump) => motion.flyTo(jump, { label: jump.name }),
    'structures');

  const dialogs = createDialogs(['about', 'shortcuts', 'share']);
  let viewName = readViewName(window.location.hash);
  if (viewName) toast(`Shared view: ${viewName}`);
  // Choosing another scene restages the view, so the shared name comes off.
  store.subscribe((state, changed) => {
    if (changed.has('preset') && viewName) {
      viewName = '';
      api.syncControls(state);
    }
  });

  // Share dialog: name the view (optional) and copy a link that carries the
  // whole state as a delta from its preset.
  const shareName = $('shareName');
  const shareUrl = $('shareUrl');
  const refreshShareUrl = () => {
    if (!shareUrl) return;
    shareUrl.textContent = buildShareUrl(window.location.href, store.get(), shareName?.value || '');
  };
  shareName?.addEventListener('input', refreshShareUrl);
  $('shareCopy')?.addEventListener('click', async () => {
    const name = cleanViewName(shareName?.value || '');
    viewName = name;
    const url = buildShareUrl(window.location.href, store.get(), name);
    try {
      await navigator.clipboard.writeText(url);
      toast(name ? `Link to "${name}" copied` : 'Link to this view copied');
    } catch {
      // Clipboard is blocked outside a secure context or without permission;
      // putting the URL in the address bar still lets the reader copy it.
      history.replaceState(null, '', url);
      toast('Link is in the address bar');
    }
    dialogs.close();
    api.syncControls(store.get());
  });
  function openShareDialog() {
    if (shareName) shareName.value = viewName || '';
    refreshShareUrl();
    dialogs.open('share');
  }
  let captureFn = null;

  const landmarkByName = (name) => (data.landmarks?.landmarks || []).find((l) => l.n === name);
  const card = createCard({
    cards: data.landmarkCards?.cards || null,
    onFly: (name) => {
      const landmark = landmarkByName(name);
      if (!landmark) return;
      motion.flyTo({ lon: landmark.lon, lat: landmark.lat,
        camDist: Math.min(store.value('camDist'), 3200) }, { label: name });
    },
    onChange: (name) => {
      const model = name && structures ? structures.modelByLandmark(name) : null;
      structures?.setSelectedModel(model ? model.index : -1);
    },
  });
  const modelCount = $('aboutModelCount');
  if (modelCount) modelCount.textContent = String(structures?.landmarkModelCount || 0);

  const searchEntries = buildSearchIndex(data.places, data.landmarks,
    { cards: data.landmarkCards?.cards || {} });
  createSearch({
    input: dom.searchInput,
    results: dom.searchResults,
    entries: searchEntries,
    onSelect: (entry) => {
      if (entry.kind === 'preset') {
        motion.toPreset(entry.presetId);
      } else if (entry.kind === 'tour') {
        motion.setTour(entry.tourId);
        motion.play();
      } else if (entry.kind === 'era') {
        store.set({ era: entry.eraId }, { source: 'search' });
      } else if (entry.kind === 'flood') {
        store.set({ layers: { flood: true }, floodMode: entry.floodMode }, { source: 'search' });
        toast(entry.floodMode === 'slr' ? 'Sea level rise is on the map' : 'FEMA flood zones are on the map');
      } else {
        motion.flyTo(entry.jump || entry, { label: entry.name });
      }
      if (entry.kind === 'landmark') card.open(entry.name, { focus: false });
    },
  });

  // ---- panels -------------------------------------------------------------
  const NARROW = window.matchMedia('(max-width: 820px)');
  const sheets = [];

  function setupPanel(panel, toggle) {
    const body = panel.querySelector('.panel-body');
    function set(collapsed) {
      panel.classList.toggle('collapsed', collapsed);
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.querySelector('.panel-toggle-label').textContent = collapsed ? 'Show' : 'Hide';
      if (body) body.setAttribute('aria-hidden', String(collapsed && !NARROW.matches));
      // On a phone these are bottom sheets over the map, so only one may be up
      // at a time; on a desktop they are side panels and can both stay open.
      if (!collapsed && NARROW.matches) {
        for (const other of sheets) if (other.panel !== panel) other.set(true);
      }
      document.body.classList.toggle('sheet-open',
        NARROW.matches && sheets.some((sh) => !sh.panel.classList.contains('collapsed')));
    }
    toggle.addEventListener('click', () => set(!panel.classList.contains('collapsed')));
    const api = { panel, set, isCollapsed: () => panel.classList.contains('collapsed') };
    sheets.push(api);
    set(NARROW.matches);   // start collapsed on a phone; the map comes first
    return api;
  }
  const studioPanel = setupPanel(dom.studio, dom.studioToggle);
  setupPanel(dom.shots, dom.shotsToggle);

  // ---- timeline -----------------------------------------------------------
  const tourSelect = $('tourSelect');
  for (const tour of TOURS) {
    const option = document.createElement('option');
    option.value = tour.id;
    option.textContent = tour.name;
    option.title = tour.blurb;
    tourSelect.appendChild(option);
  }
  tourSelect.value = motion.tour.id;
  tourSelect.addEventListener('change', () => motion.setTour(tourSelect.value));

  function buildMarkers(tour) {
    dom.timelineShots.innerHTML = '';
    const total = tourDuration(tour);
    tour.shots.forEach((shot, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'timeline-shot';
      b.title = shot.caption?.title || getPreset(shot.preset)?.name || shot.preset;
      b.setAttribute('aria-label', `Jump to ${b.title}`);
      b.style.left = `${(tourShotStart(tour, i) / total) * 100}%`;
      b.addEventListener('click', (event) => {
        event.stopPropagation();
        motion.seek(tourShotStart(tour, i));
        motion.play();
      });
      dom.timelineShots.appendChild(b);
    });
  }
  buildMarkers(motion.tour);

  dom.btnPlay.addEventListener('click', () => motion.toggle());
  $('btnPrevShot').addEventListener('click', () => motion.step(-1));
  $('btnNextShot').addEventListener('click', () => motion.step(1));
  dom.timelineTrack.addEventListener('click', (event) => {
    const rect = dom.timelineTrack.getBoundingClientRect();
    motion.seek(((event.clientX - rect.left) / rect.width) * motion.duration);
  });

  const captionEl = $('caption');
  const captionTitle = $('captionTitle');
  const captionText = $('captionText');
  const captionSource = $('captionSource');
  let lastCaption = null;
  let lastTourId = motion.tour.id;

  motion.onChange(({ playing, tourTime, tour, caption }) => {
    if (tour.id !== lastTourId) {
      lastTourId = tour.id;
      buildMarkers(tour);
      if (tourSelect.value !== tour.id) tourSelect.value = tour.id;
    }
    dom.btnPlay.setAttribute('aria-pressed', String(playing));
    dom.btnPlay.setAttribute('aria-label', playing ? `Pause ${tour.name}` : `Play ${tour.name}`);
    dom.playIcon.textContent = playing ? '❚❚' : '▶';
    const total = tourDuration(tour) || 1;
    dom.timelineFill.style.width = `${(tourTime / total) * 100}%`;
    dom.timelineTime.textContent = formatClock(tourTime);
    const frame = tourFrame(tour, tourTime);
    [...dom.timelineShots.children].forEach((node, i) => {
      node.setAttribute('aria-current', String(frame?.index === i));
    });

    // Captions only change when the shot does, so the live region is not
    // re-announced every frame.
    if (caption !== lastCaption) {
      lastCaption = caption;
      if (caption) {
        captionTitle.textContent = caption.title;
        captionText.textContent = caption.text;
        captionSource.textContent = caption.source ? `Source: ${caption.source}` : '';
        captionEl.hidden = false;
      } else {
        captionEl.hidden = true;
      }
    }
  });

  // ---- cinema mode ----------------------------------------------------------
  // Everything but the map and the captions goes away. The tour keeps its
  // controls in a small cluster that fades with the cursor.
  let cinema = false;
  let cursorTimer = 0;
  let sheetsBeforeCinema = [];
  const cinemaBar = $('cinemaBar');
  const setCinema = (on) => {
    cinema = !!on;
    document.body.classList.toggle('cinema', cinema);
    cinemaBar.hidden = !cinema;
    $('btnCinema').setAttribute('aria-pressed', String(cinema));
    $('mbCinema').setAttribute('aria-pressed', String(cinema));
    if (cinema) {
      // Desktop panels are simply hidden by CSS and come back untouched. On a
      // phone an open sheet also hides the caption (body.sheet-open), so the
      // sheets are put away for the show and restored on exit.
      sheetsBeforeCinema = NARROW.matches ? sheets.filter((sh) => !sh.isCollapsed()) : [];
      for (const sh of sheetsBeforeCinema) sh.set(true);
      card.close();
      $('cinemaPlay').focus();
      armCursorTimer();
    } else {
      document.body.classList.remove('hide-cursor');
      clearTimeout(cursorTimer);
      for (const sh of sheetsBeforeCinema) sh.set(false);
      sheetsBeforeCinema = [];
      syncMobileBar();
      $('btnCinema').focus();
    }
  };
  function armCursorTimer() {
    document.body.classList.remove('hide-cursor');
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => {
      if (cinema) document.body.classList.add('hide-cursor');
    }, 2600);
  }
  window.addEventListener('pointermove', () => { if (cinema) armCursorTimer(); }, { passive: true });
  $('btnCinema').addEventListener('click', () => setCinema(!cinema));
  $('cinemaExit').addEventListener('click', () => setCinema(false));
  $('cinemaPlay').addEventListener('click', () => motion.toggle());
  $('cinemaPrev').addEventListener('click', () => motion.step(-1));
  $('cinemaNext').addEventListener('click', () => motion.step(1));
  motion.onChange(({ playing }) => {
    $('cinemaPlay').textContent = playing ? '❚❚' : '▶';
    $('mbPlay').setAttribute('aria-pressed', String(playing));
    $('mbPlay').querySelector('span').textContent = playing ? '❚❚' : '▶';
  });

  // ---- phone toolbar --------------------------------------------------------
  const sheetButtons = [[$('mbShots'), sheets.find((sh) => sh.panel === dom.shots)],
    [$('mbStudio'), sheets.find((sh) => sh.panel === dom.studio)]];
  function syncMobileBar() {
    for (const [btn, sh] of sheetButtons) btn.setAttribute('aria-pressed', String(!sh.isCollapsed()));
  }
  for (const [btn, sh] of sheetButtons) {
    btn.addEventListener('click', () => { sh.set(!sh.isCollapsed()); syncMobileBar(); });
  }
  for (const sh of sheets) sh.panel.querySelector('.panel-toggle').addEventListener('click', syncMobileBar);
  $('mbHome').addEventListener('click', () => motion.toPreset(HOME_PRESET));
  $('mbPlay').addEventListener('click', () => motion.toggle());
  $('mbCinema').addEventListener('click', () => setCinema(true));

  // ---- top bar actions ----------------------------------------------------
  $('btnHome').addEventListener('click', () => motion.toPreset(HOME_PRESET));
  $('btnAbout').addEventListener('click', () => dialogs.open('about'));
  $('btnKeys').addEventListener('click', () => dialogs.open('shortcuts'));
  $('btnFull').addEventListener('click', toggleFullscreen);
  $('btnShot').addEventListener('click', () => saveScreenshot(captureFn, store));
  $('btnShare').addEventListener('click', () => api.openShare());
  // Phones have no header share button; the studio sheet carries one.
  $('btnShareStudio')?.addEventListener('click', () => api.openShare());
  $('btnReset').addEventListener('click', () => {
    motion.stop();
    store.reset({ source: 'ui' });
    toast('Everything back to defaults');
  });
  dom.degradedClose?.addEventListener('click', () => { dom.degraded.hidden = true; });

  dom.obStart?.addEventListener('click', () => {
    dom.onboarding.hidden = true;
    markSeen();
  });
  dom.obTour?.addEventListener('click', () => {
    dom.onboarding.hidden = true;
    markSeen();
    motion.play();
  });

  const spacing = data.terrain?.stats?.sampleSpacingM;
  const spacingNode = $('aboutSpacing');
  if (spacingNode && spacing) spacingNode.textContent = `${spacing} m`;

  // ---- keyboard -----------------------------------------------------------
  window.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    if (dialogs.openId && event.key !== 'Escape') return;

    const key = event.key;
    const shift = event.shiftKey;

    if (key >= '1' && key <= String(Math.min(9, PRESETS.length))) {
      motion.toPreset(PRESETS[Number(key) - 1].id);
      event.preventDefault();
      return;
    }

    switch (key) {
      case ' ':
        motion.toggle();
        event.preventDefault();
        break;
      case 'h': case 'H':
        motion.toPreset(HOME_PRESET);
        break;
      case 'f': case 'F':
        toggleFullscreen();
        break;
      case 'v': case 'V':
        setCinema(!cinema);
        break;
      case 'p': case 'P':
        saveScreenshot(captureFn, store);
        break;
      case 'c': case 'C':
        studioPanel.set(!studioPanel.isCollapsed());
        break;
      case 'l': case 'L': {
        const on = store.isLayerOn('places') || store.isLayerOn('landmarks');
        store.set({ layers: { places: !on, landmarks: !on } }, { source: 'key' });
        break;
      }
      case '[':
        motion.step(-1);
        break;
      case ']':
        motion.step(1);
        break;
      case '/':
        dom.searchInput.focus();
        dom.searchInput.select();
        event.preventDefault();
        break;
      case '?':
        dialogs.open('shortcuts');
        event.preventDefault();
        break;
      case 'Escape':
        if (card.openName) card.close();
        else if (cinema) setCinema(false);
        else motion.stop();
        break;
      case '+': case '=':
        rig.nudge({ zoom: 1 / 1.25 });
        break;
      case '-': case '_':
        rig.nudge({ zoom: 1.25 });
        break;
      case 'ArrowUp':
        rig.nudge(shift ? { pitch: 3 } : { panY: -60 });
        event.preventDefault();
        break;
      case 'ArrowDown':
        rig.nudge(shift ? { pitch: -3 } : { panY: 60 });
        event.preventDefault();
        break;
      case 'ArrowLeft':
        rig.nudge(shift ? { bearing: -5 } : { panX: -60 });
        event.preventDefault();
        break;
      case 'ArrowRight':
        rig.nudge(shift ? { bearing: 5 } : { panX: 60 });
        event.preventDefault();
        break;
      default:
        break;
    }
  });

  // ---- URL sync -----------------------------------------------------------
  let hashTimer = 0;
  let ownHash = '';
  store.subscribe((state) => {
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      const encoded = [encodeState(state), viewName ? `n=${encodeURIComponent(viewName)}` : '']
        .filter(Boolean).join('&');
      ownHash = `#${encoded}`;
      history.replaceState(null, '', encoded ? ownHash : window.location.pathname);
    }, 350);
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash === ownHash) return;
    // A pasted named link names the view even without a reload; the name is
    // applied after the state so a scene change in the same link cannot
    // clear it.
    const name = readViewName(window.location.hash);
    const patch = decodeState(window.location.hash);
    if (patch) {
      motion.stop();
      store.set(patch, { source: 'hash' });
    }
    if (name !== viewName) {
      viewName = name;
      api.syncControls(store.get());
    }
  });

  // ---- readout ------------------------------------------------------------
  let fps = 0;
  let readoutClock = 0;

  const api = {
    layerToggles,
    store,
    openCard(name, options) { return card.open(name, options); },
    closeCard() { card.close(); },
    get cardName() { return card.openName; },
    syncControls(state) {
      controls.sync(state);
      layerToggles.sync(state);
      presets.sync(state);
      const preset = getPreset(state.preset);
      // A shared link can carry a name; it heads the readout until a preset
      // restages the view.
      dom.outPreset.textContent = viewName || (preset ? preset.name : 'Custom view');
      dom.outBlurb.textContent = viewName
        ? (preset ? `${preset.name}, shared by link.` : 'A named view shared by link.')
        : (preset ? preset.blurb : 'Your own framing and light.');
    },
    get viewName() { return viewName; },
    setViewName(name) { viewName = cleanViewName(name); this.syncControls(store.get()); },
    openShare() { openShareDialog(); },
    setFps(value) { fps = value; },
    setCapture(fn) { captureFn = fn; },

    updateReadout({ pose, groundY, viewH, dt }) {
      readoutClock += dt;
      if (readoutClock < 0.1) return;
      readoutClock = 0;

      const state = store.get();
      const exag = state.layers.terrain ? state.exaggeration : 1;
      const elevation = exag > 0 ? groundY / exag : 0;
      const mpp = metersPerPixel(pose.dist, pose.fov, viewH);

      dom.outCoords.textContent = formatLatLon(pose.lat, pose.lon);
      dom.outElev.textContent = `${Math.round(elevation)} m`;
      dom.outBearing.textContent = `${Math.round(pose.bearing)}° ${compassPoint(pose.bearing)}`;
      dom.outPitch.textContent = `${Math.round(pose.pitch)}°`;
      dom.outZoom.textContent = `z${equivalentZoom(mpp, pose.lat).toFixed(1)}`;
      dom.outFps.textContent = fps ? String(Math.round(fps)) : '—';

      const bar = scaleBar(mpp, 120);
      dom.scaleLine.style.width = `${Math.round(bar.pixels)}px`;
      dom.scaleLabel.textContent = bar.label;
    },
  };
  return api;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Schematic landmark models, packed for the structures shader (or null). */
function packLandmarkModels(data, projection, sampleElevation) {
  const doc = data.landmarkModels;
  if (!doc || !Array.isArray(doc.models)) return null;
  const anchors = new Map((data.landmarks?.landmarks || []).map((l) => [l.n, { lon: l.lon, lat: l.lat }]));
  return buildLandmarkModels(doc, {
    anchors,
    toWorld: (lon, lat) => [projection.lonToX(lon), projection.latToZ(lat)],
    groundAt: (x, z) => sampleElevation(projection.xToLon(x), projection.zToLat(z)),
  });
}

/** The About panel quotes the manifest so its numbers cannot drift. */
function fillStructureFacts(manifest, structures) {
  const set = (id, text) => {
    const node = $(id);
    if (node) node.textContent = text;
  };
  const counts = manifest.sourceCounts || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const pct = (k) => `${Math.round(((counts[k] || 0) / total) * 100)}%`;
  set('aboutBuildingCount', (manifest.totals?.buildings || 0).toLocaleString());
  set('aboutMeasuredPct', pct('measured'));
  set('aboutEstimatedPct',
    `${Math.round((((counts.levels || 0) + (counts.default || 0)) / total) * 100)}%`);
  set('aboutCuratedCount', String(counts.curated || 0));
  set('aboutBridgeCount', String((structures?.bridges || []).length));
  const dated = manifest.dated || {};
  set('aboutDatedCurated', String(dated.curated ?? 0));
  set('aboutDatedOsm', String(dated.osm ?? 0));
  set('aboutUndated', (dated.undated ?? 0).toLocaleString());
  set('aboutBridgeNames', (structures?.bridges || []).map((b) => b.name).join(', '));
}

function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    el.requestFullscreen?.().catch(() => toast('Fullscreen was refused by the browser'));
  } else {
    document.exitFullscreen?.();
  }
}

function saveScreenshot(captureFn, store) {
  if (!captureFn) return;
  try {
    const canvas = captureFn();
    if (!canvas.toBlob) {
      toast('This browser cannot export the canvas');
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        toast('Could not capture the frame');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `philadelphia-relief-${store.value('preset')}-${stamp()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast('Saved a PNG of this view');
    }, 'image/png');
  } catch (error) {
    console.warn('[philly-relief] screenshot failed:', error);
    toast('Could not capture the frame');
  }
}

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
    + `-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function showBanner(status) {
  if (!dom.degraded) return;
  dom.degradedTitle.textContent = status.title;
  dom.degradedMessage.textContent = status.message;
  dom.degraded.hidden = false;
}

function finishLoading() {
  setProgress(1, 'Ready');
  dom.loading?.classList.add('done');
  setTimeout(() => dom.loading?.remove(), 800);
}

function readSeen() {
  try {
    return localStorage.getItem(ONBOARD_KEY) === '1';
  } catch {
    return false;   // private mode; showing the intro again is harmless
  }
}

function markSeen() {
  try {
    localStorage.setItem(ONBOARD_KEY, '1');
  } catch {
    /* storage unavailable; nothing to do */
  }
}

boot().catch((error) => {
  console.error('[philly-relief] failed to start:', error);
  showBanner({
    title: 'The map could not start',
    message: `Something went wrong while loading: ${error.message}. `
      + 'Reloading the page usually clears it.',
  });
  finishLoading();
});

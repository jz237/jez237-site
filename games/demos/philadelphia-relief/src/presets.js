/**
 * Authored camera + lighting setups, and the flythrough that strings them
 * together.
 *
 * Each preset is a complete look: where the camera sits, how the light falls,
 * how thick the air is, and which layers matter for that particular story. A
 * preset is not a bookmark — switching to one restages the whole scene.
 *
 * Pure data + pure blending maths, so the tests can verify every transition
 * without a renderer.
 */

import { lerp, lerpAngle, easeInOutCubic, clamp } from './geo.js?v=philly-2026090608';
import { CONTROLS, CAMERA, LAYERS, coercePatch } from './schema.js?v=philly-2026090608';

/** Keys that are angles and must take the short way round when blending. */
const ANGLE_KEYS = new Set(['camBearing', 'sunAzimuth']);

/**
 * Controls a preset deliberately does not touch.
 *
 * Quality is a statement about the viewer's hardware and animation speed is a
 * statement about their patience. Neither belongs to the authored look, so
 * selecting a shot must not stomp on either.
 */
export const PRESET_EXCLUDED = new Set(['quality', 'animationSpeed', 'floodMode', 'seaLevelRise',
  'timeMode', 'dayOfYear', 'clockHour', 'weather', 'era', 'imageryDetail',
  'compareMode', 'comparePosition']);
/** Layers that are the viewer's own choice: a preset never switches them. */
export const PRESET_EXCLUDED_LAYERS = new Set(['flood']);

export const PRESETS = [
  {
    id: 'skyline',
    name: 'Philadelphia, between two rivers',
    blurb:
      'The Schuylkill meets a city of towers and rowhouses, with the Delaware beyond. ' +
      'Real aerial photography reveals the rooftops and street grid. ' +
      'Follow the rivers into the hills that shaped Philadelphia.',
    camera: {
      camLon: -75.1655, camLat: 39.9505, camDist: 4600, camBearing: 32, camPitch: 58,
    },
    settings: {
      theme: 'dusk', fov: 40, exaggeration: 2,
      sunAzimuth: 208, sunAltitude: 28, keyLight: 1.1, ambient: 0.68,
      fogDensity: 0.32, glow: 0.16, waterIntensity: 0.85,
      contourStrength: 0.18, contourInterval: 25,
      roadOpacity: 0.65, boundaryOpacity: 0.15, labelDensity: 0.28, labelSize: 1,
      structureDetail: 0.75, structureHeight: 1,
    },
    layers: { terrain: true, imagery: true, hillshade: true, contours: false, water: false,
      parks: false, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'hidden-reef',
    name: 'Levittown · The Hidden Reef',
    blurb:
      'The Hidden Reef aquarium store at 4501 New Falls Road, Levittown. ' +
      'Select the store label for its address, phone number and official website.',
    camera: {
      camLon: -74.8827262, camLat: 40.1368222, camDist: 1050, camBearing: 325, camPitch: 42,
    },
    settings: {
      theme: 'dusk', fov: 40, exaggeration: 1,
      sunAzimuth: 208, sunAltitude: 28, keyLight: 1.1, ambient: 0.68,
      fogDensity: 0.32, glow: 0.16, waterIntensity: 0.85,
      contourStrength: 0.18, contourInterval: 25,
      roadOpacity: 0.65, boundaryOpacity: 0.15, labelDensity: 0.75, labelSize: 1,
      structureDetail: 0.75, structureHeight: 1,
    },
    layers: { terrain: true, imagery: true, hillshade: true, contours: false, water: false,
      parks: false, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'bauder-signs',
    name: 'Philadelphia · Bauder Signs',
    blurb:
      'Bauder Signs at 3613 Witte Street, Philadelphia. ' +
      'Select the pin for its address and business information.',
    camera: {
      camLon: -75.09834015, camLat: 39.99592532, camDist: 650, camBearing: 20, camPitch: 20,
    },
    settings: {
      theme: 'dusk', fov: 40, exaggeration: 1,
      sunAzimuth: 208, sunAltitude: 28, keyLight: 1.1, ambient: 0.68,
      fogDensity: 0.32, glow: 0.16, waterIntensity: 0.85,
      contourStrength: 0.18, contourInterval: 25,
      roadOpacity: 0.65, boundaryOpacity: 0.15, labelDensity: 0.75, labelSize: 1,
      structureDetail: 0.75, structureHeight: 1,
    },
    layers: { terrain: true, imagery: true, hillshade: true, contours: false, water: false,
      parks: false, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'architecture',
    name: 'Center City architecture',
    blurb:
      'Stone civic landmarks, glass towers, and brick neighborhoods. ' +
      'Facade finishes and street widths are illustrative; footprints come from OpenStreetMap.',
    camera: {
      camLon: -75.1665, camLat: 39.9532, camDist: 1500, camBearing: 235, camPitch: 68,
    },
    settings: {
      theme: 'dusk', fov: 40, exaggeration: 1.2,
      sunAzimuth: 208, sunAltitude: 28, keyLight: 1.1, ambient: 0.68,
      fogDensity: 0.32, glow: 0.16, waterIntensity: 0.85,
      contourStrength: 0.18, contourInterval: 25,
      roadOpacity: 0.65, boundaryOpacity: 0.15, labelDensity: 0.28, labelSize: 1,
      structureDetail: 0.75, structureHeight: 1,
    },
    layers: { terrain: true, imagery: true, hillshade: true, contours: false, water: false,
      parks: false, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: true },
  },
  {
    id: 'ben-franklin-bridge',
    name: 'Benjamin Franklin Bridge',
    blurb:
      'From the Camden bank looking back across the Delaware: the 1926 ' +
      'suspension span and the city street grid in aerial photography. ' +
      'Its 1,750 ft main span was the longest in the ' +
      'world when it opened.',
    camera: {
      camLon: -75.1285, camLat: 39.9519, camDist: 4400, camBearing: 292, camPitch: 66,
    },
    settings: {
      theme: 'dusk', fov: 44, exaggeration: 1.5,
      sunAzimuth: 128, sunAltitude: 28, keyLight: 1.1, ambient: 0.68,
      fogDensity: 0.34, glow: 0.16, waterIntensity: 0.9,
      contourStrength: 0.12, contourInterval: 25,
      roadOpacity: 0.65, boundaryOpacity: 0.1, labelDensity: 0.4, labelSize: 1,
      structureDetail: 0.7, structureHeight: 1.15,
    },
    layers: { terrain: true, imagery: true, hillshade: true, contours: false, water: false,
      parks: false, roads: true, rail: true, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'overview',
    name: 'The Delaware Valley',
    blurb:
      'The whole region in one frame: the Delaware running southwest past the ' +
      'city, the Schuylkill dropping in from the northwest, and the Piedmont ' +
      'rising behind the Fall Line.',
    camera: {
      camLon: -75.20, camLat: 40.02, camDist: 86000, camBearing: 38, camPitch: 63,
    },
    settings: {
      theme: 'dusk', fov: 40, exaggeration: 10,
      sunAzimuth: 116, sunAltitude: 19, keyLight: 1.2, ambient: 0.42,
      fogDensity: 0.40, glow: 0.34, waterIntensity: 0.8,
      contourStrength: 0.28, contourInterval: 50,
      roadOpacity: 0.3, boundaryOpacity: 0.38, labelDensity: 0.38, labelSize: 1,
      structureDetail: 0.6, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: true, roads: true, rail: false, boundaries: true,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'dawn-delaware',
    name: 'Dawn over the Delaware',
    blurb:
      'First light from the east, low across the estuary. The tidal flats below ' +
      'the airport are the lowest ground for fifty kilometres, and at this sun ' +
      'angle the whole river reads as a single sheet of light.',
    camera: {
      camLon: -75.135, camLat: 39.945, camDist: 27000, camBearing: 104, camPitch: 77,
    },
    settings: {
      theme: 'dusk', fov: 46, exaggeration: 8,
      sunAzimuth: 99, sunAltitude: 5, keyLight: 1.6, ambient: 0.34,
      fogDensity: 0.5, glow: 0.55, waterIntensity: 1,
      contourStrength: 0.16, contourInterval: 25,
      roadOpacity: 0.24, boundaryOpacity: 0.18, labelDensity: 0.36, labelSize: 1,
      structureDetail: 0.7, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: true, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'schuylkill-flyover',
    name: 'Schuylkill Flyover',
    blurb:
      'Low and fast up the Schuylkill, out of Center City through the Manayunk ' +
      'narrows toward Conshohocken. The valley walls tighten to about a ' +
      'kilometre here — the reason the canal, the railroad and the expressway ' +
      'all share the same floor.',
    camera: {
      camLon: -75.232, camLat: 40.028, camDist: 9500, camBearing: 306, camPitch: 79,
    },
    settings: {
      theme: 'dusk', fov: 54, exaggeration: 6,
      sunAzimuth: 236, sunAltitude: 24, keyLight: 1.3, ambient: 0.4,
      fogDensity: 0.36, glow: 0.42, waterIntensity: 0.95,
      contourStrength: 0.3, contourInterval: 20,
      roadOpacity: 0.55, boundaryOpacity: 0.18, labelDensity: 0.55, labelSize: 1.05,
      structureDetail: 0.7, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: true, roads: true, rail: true, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'wissahickon',
    name: 'Wissahickon Valley',
    blurb:
      'A 60 m gorge cut straight into the Piedmont, entirely inside the city ' +
      'limits. Tight contours at a 10 m interval show how abruptly the ' +
      'Chestnut Hill upland drops to the creek.',
    camera: {
      camLon: -75.213, camLat: 40.047, camDist: 5600, camBearing: 197, camPitch: 74,
    },
    settings: {
      theme: 'verdant', fov: 44, exaggeration: 5,
      sunAzimuth: 288, sunAltitude: 33, keyLight: 1.2, ambient: 0.4,
      fogDensity: 0.2, glow: 0.24, waterIntensity: 0.85,
      contourStrength: 0.62, contourInterval: 10,
      roadOpacity: 0.34, boundaryOpacity: 0.14, labelDensity: 0.62, labelSize: 1.05,
      structureDetail: 0.5, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: true, roads: true, rail: false, boundaries: false,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'main-line-ridge',
    name: 'Main Line Ridge',
    blurb:
      'Looking west along the divide the Pennsylvania Railroad was built on. ' +
      'Everything north of this crest drains to the Schuylkill; everything ' +
      'south of it runs to Cobbs and Darby Creeks. The towns are strung along ' +
      'the ridge because the track was.',
    camera: {
      camLon: -75.335, camLat: 40.022, camDist: 15000, camBearing: 289, camPitch: 71,
    },
    settings: {
      theme: 'verdant', fov: 40, exaggeration: 7,
      sunAzimuth: 203, sunAltitude: 29, keyLight: 1.22, ambient: 0.36,
      fogDensity: 0.28, glow: 0.28, waterIntensity: 0.8,
      contourStrength: 0.55, contourInterval: 20,
      roadOpacity: 0.3, boundaryOpacity: 0.34, labelDensity: 0.6, labelSize: 1.05,
      structureDetail: 0.5, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: true, roads: true, rail: true, boundaries: true,
      places: true, landmarks: true, structures: false },
  },
  {
    id: 'night-metro',
    name: 'Night Metro',
    blurb:
      'After dark the terrain drops back and the built pattern takes over — ' +
      'the grid in the centre, the ring of expressways, and the rail lines ' +
      'radiating out along the valleys they were surveyed into.',
    camera: {
      camLon: -75.152, camLat: 39.968, camDist: 41000, camBearing: 44, camPitch: 66,
    },
    settings: {
      theme: 'noir', fov: 42, exaggeration: 9,
      sunAzimuth: 318, sunAltitude: 3, keyLight: 0.5, ambient: 0.2,
      fogDensity: 0.42, glow: 0.72, waterIntensity: 0.6,
      contourStrength: 0.12, contourInterval: 50,
      roadOpacity: 0.95, boundaryOpacity: 0.3, labelDensity: 0.55, labelSize: 1,
      structureDetail: 0.85, structureHeight: 1,
    },
    layers: { terrain: true, imagery: false, hillshade: true, contours: true, water: true,
      parks: false, roads: true, rail: true, boundaries: true,
      places: true, landmarks: true, structures: false },
  },
];

export const PRESET_IDS = PRESETS.map((p) => p.id);

/**
 * The opening shot: what a clean load shows and where Home returns. It is the
 * first card by convention, and the schema defaults are its values exactly
 * (a test holds the two together).
 */
export const HOME_PRESET = PRESETS[0].id;

export function getPreset(id) {
  return PRESETS.find((p) => p.id === id) || null;
}

/**
 * The full state patch a preset represents: camera, look and layers, with
 * every key present so a transition never leaves a stale value behind.
 */
export function presetPatch(id) {
  const preset = getPreset(id);
  if (!preset) return null;
  return coercePatchWithLayers({
    ...preset.camera,
    ...preset.settings,
    layers: { ...preset.layers },
    preset: preset.id,
  });
}

function coercePatchWithLayers(patch) {
  const clean = coercePatch(patch);
  clean.preset = patch.preset;
  return clean;
}

/**
 * Blend two presets into an intermediate patch.
 *
 * Numbers interpolate, angles take the short arc, and anything discrete (the
 * theme, the contour interval, layer toggles) snaps at the midpoint. Snapping
 * rather than cross-fading is deliberate: a half-on layer or a blended enum is
 * never what the author meant, and the midpoint is where the camera is moving
 * fastest, so the switch is the least visible there.
 */
export function blendPresets(fromId, toId, t, easing = easeInOutCubic) {
  const a = presetPatch(fromId);
  const b = presetPatch(toId);
  if (!a || !b) return null;
  return blendPatches(a, b, t, easing);
}

/**
 * Blend two complete state patches (the shape presetPatch returns), with the
 * same rules as a preset transition. Tours use this to move between a preset
 * and a camera override without needing a preset for every stop.
 */
export function blendPatches(a, b, t, easing = easeInOutCubic) {
  if (!a || !b) return null;
  const e = easing(clamp(t, 0, 1));
  const out = {};

  for (const key of [...Object.keys(CONTROLS), ...Object.keys(CAMERA)]) {
    const av = a[key];
    const bv = b[key];
    if (av === undefined || bv === undefined) continue;
    const spec = CONTROLS[key] || CAMERA[key];
    if (spec.kind === 'enum') {
      out[key] = e < 0.5 ? av : bv;
    } else if (ANGLE_KEYS.has(key)) {
      out[key] = lerpAngle(av, bv, e);
    } else if (key === 'camDist') {
      // Distance is perceived logarithmically: a linear ramp from 86 km to
      // 5.6 km spends most of the shot already close in and feels like it
      // slams to a stop.
      out[key] = Math.exp(lerp(Math.log(av), Math.log(bv), e));
    } else {
      out[key] = lerp(av, bv, e);
    }
  }

  out.layers = {};
  for (const id of Object.keys(LAYERS)) {
    out.layers[id] = e < 0.5 ? !!a.layers?.[id] : !!b.layers?.[id];
  }
  out.preset = e < 0.5 ? a.preset : b.preset;
  return out;
}

/**
 * The flythrough. `hold` is the still time on a shot, `travel` the time spent
 * moving to the next one; both in seconds at 1x animation speed.
 */
export const TOUR = [
  { preset: 'skyline', hold: 5, travel: 6 },
  { preset: 'ben-franklin-bridge', hold: 5, travel: 8 },
  { preset: 'overview', hold: 4.5, travel: 7 },
  { preset: 'dawn-delaware', hold: 5.5, travel: 7 },
  { preset: 'schuylkill-flyover', hold: 5, travel: 6.5 },
  { preset: 'wissahickon', hold: 5, travel: 7 },
  { preset: 'main-line-ridge', hold: 5, travel: 7.5 },
  { preset: 'night-metro', hold: 6, travel: 8 },
];

export const TOUR_DURATION = TOUR.reduce((sum, s) => sum + s.hold + s.travel, 0);

/**
 * Resolve the tour to a concrete state at time `t` seconds (looping).
 *
 * Returns the blended patch plus which shot we are on and how far through, so
 * the timeline UI and the readout can render from the same source of truth.
 */
export function tourAt(t) {
  const total = TOUR_DURATION;
  if (!(total > 0)) return null;
  let time = t % total;
  if (time < 0) time += total;

  for (let i = 0; i < TOUR.length; i += 1) {
    const shot = TOUR[i];
    if (time < shot.hold) {
      return {
        index: i,
        shot: shot.preset,
        phase: 'hold',
        localT: shot.hold > 0 ? time / shot.hold : 1,
        patch: presetPatch(shot.preset),
      };
    }
    time -= shot.hold;
    if (time < shot.travel) {
      const next = TOUR[(i + 1) % TOUR.length];
      const localT = shot.travel > 0 ? time / shot.travel : 1;
      return {
        index: i,
        shot: shot.preset,
        nextShot: next.preset,
        phase: 'travel',
        localT,
        patch: blendPresets(shot.preset, next.preset, localT),
      };
    }
    time -= shot.travel;
  }
  // Floating-point tail: land on the last shot rather than returning null.
  const last = TOUR.length - 1;
  return {
    index: last, shot: TOUR[last].preset, phase: 'hold', localT: 1,
    patch: presetPatch(TOUR[last].preset),
  };
}

/** Absolute tour time at which shot `index` begins its hold. */
export function tourTimeForShot(index) {
  let t = 0;
  for (let i = 0; i < TOUR.length; i += 1) {
    if (i === index) return t;
    t += TOUR[i].hold + TOUR[i].travel;
  }
  return 0;
}

/**
 * Named destinations for the quick-jump chips. Each carries its own framing,
 * because "go to Manayunk" should mean a shot of the river gorge, not the
 * overview camera re-centred on a point.
 *
 * `group: 'structures'` chips sit under their own heading. The bridge chips
 * are placed on each span's OSM centerline midpoint (data/structures/
 * bridges.json) and look back along the span toward the city; a test holds
 * them to the data.
 */
export const QUICK_JUMPS = [
  { id: 'center-city', name: 'Center City', lon: -75.1635, lat: 39.9526,
    camDist: 11000, camBearing: 42, camPitch: 70 },
  { id: 'south-philadelphia', name: 'South Philadelphia', lon: -75.1650, lat: 39.9130,
    camDist: 13000, camBearing: 18, camPitch: 72 },
  { id: 'university-city', name: 'University City', lon: -75.1932, lat: 39.9522,
    camDist: 8000, camBearing: 68, camPitch: 71 },
  { id: 'manayunk', name: 'Manayunk', lon: -75.2246, lat: 40.0262,
    camDist: 6000, camBearing: 305, camPitch: 76 },
  { id: 'chestnut-hill', name: 'Chestnut Hill', lon: -75.2085, lat: 40.0729,
    camDist: 8000, camBearing: 200, camPitch: 70 },
  { id: 'wissahickon-valley', name: 'Wissahickon Valley', lon: -75.2135, lat: 40.0555,
    camDist: 5600, camBearing: 197, camPitch: 74 },
  { id: 'northeast-philadelphia', name: 'Northeast Philadelphia', lon: -75.0330, lat: 40.0620,
    camDist: 18000, camBearing: 232, camPitch: 68 },
  { id: 'king-of-prussia', name: 'King of Prussia', lon: -75.3960, lat: 40.0893,
    camDist: 13000, camBearing: 128, camPitch: 70 },
  { id: 'valley-forge', name: 'Valley Forge', lon: -75.4586, lat: 40.1015,
    camDist: 9000, camBearing: 96, camPitch: 73 },
  { id: 'main-line', name: 'The Main Line', lon: -75.3350, lat: 40.0220,
    camDist: 15000, camBearing: 289, camPitch: 71 },
  { id: 'media', name: 'Media', lon: -75.3877, lat: 39.9168,
    camDist: 11000, camBearing: 40, camPitch: 70 },
  { id: 'doylestown', name: 'Doylestown', lon: -75.1299, lat: 40.3101,
    camDist: 14000, camBearing: 214, camPitch: 69 },
  // Looking up the Delaware toward the falls at Trenton, with the Levitt
  // sections filling the flat terrace in the foreground.
  { id: 'levittown', name: 'Levittown', lon: -74.8380, lat: 40.1548,
    camDist: 13000, camBearing: 42, camPitch: 70 },
  { id: 'camden', name: 'Camden', lon: -75.1196, lat: 39.9259,
    camDist: 12000, camBearing: 292, camPitch: 71 },
  { id: 'cherry-hill', name: 'Cherry Hill', lon: -75.0246, lat: 39.9268,
    camDist: 14000, camBearing: 280, camPitch: 70 },

  { id: 'walt-whitman-bridge', name: 'Walt Whitman Bridge', group: 'structures',
    lon: -75.1293, lat: 39.9052, camDist: 3800, camBearing: 318, camPitch: 75 },
  { id: 'betsy-ross-bridge', name: 'Betsy Ross Bridge', group: 'structures',
    lon: -75.0659, lat: 39.9848, camDist: 3600, camBearing: 333, camPitch: 75 },
  { id: 'tacony-palmyra-bridge', name: 'Tacony-Palmyra Bridge', group: 'structures',
    lon: -75.0432, lat: 40.0123, camDist: 3200, camBearing: 5, camPitch: 75 },
  { id: 'commodore-barry-bridge', name: 'Commodore Barry Bridge', group: 'structures',
    lon: -75.3697, lat: 39.8265, camDist: 4500, camBearing: 356, camPitch: 74 },
  { id: 'sports-complex', name: 'Sports Complex', group: 'structures',
    lon: -75.167, lat: 39.9045, camDist: 4200, camBearing: 15, camPitch: 71 },
];

/**
 * Guided, captioned tours.
 *
 * A tour is an ordered list of shots. Each shot is a preset, optionally with a
 * camera override so a tour can visit a bridge or a block without the app
 * growing a preset for it, plus a caption: a title, one or two sentences, and
 * the source the sentences rest on. Captions are shown while the shot holds
 * and are read to assistive tech through an aria-live region.
 *
 * Every factual sentence here names its source. Heights come from the same
 * data the map draws; spans and dates are public reference values and are
 * labelled as such; nothing is presented as more certain than its source.
 *
 * Pure module — the tests drive every tour through every seam.
 */

import { presetPatch, blendPatches, TOUR } from './presets.js?v=philly-2026090609';
import { coercePatch } from './schema.js?v=philly-2026090609';

const OSM = 'OpenStreetMap contributors (ODbL); heights as measured in the OSM data';
const REFS = 'Public reference values (rounded); see bridges.json and the About panel';
const DEM = 'This map’s elevation data: USGS 3DEP / SRTM via AWS Terrain Tiles';
const WIKI = 'Wikipedia (public reference)';

const AERIAL_PRESETS = new Set(['skyline', 'ben-franklin-bridge', 'night-metro']);

/** City tours show real aerial detail and keep schematic structures optional. */
function withAerial(shot) {
  if (!AERIAL_PRESETS.has(shot.preset)) return shot;
  return {
    ...shot,
    override: {
      ...(shot.override || {}),
      layers: { ...(shot.override?.layers || {}), imagery: true, structures: false },
    },
  };
}

const GRAND_CAPTIONS = {
  skyline: {
    title: 'Philadelphia Skyline',
    text: 'Center City stands on the grid laid out for William Penn in the 1680s. ' +
      'Comcast Technology Center, about 340 m, is the tallest building in Pennsylvania.',
    source: `${OSM}; ${WIKI}` },
  'ben-franklin-bridge': {
    title: 'Benjamin Franklin Bridge',
    text: 'Opened in 1926. Its 533 m main span was the longest suspension span in the ' +
      'world until 1929. It connects Philadelphia with Camden across the Delaware.',
    source: REFS },
  overview: {
    title: 'The Delaware Valley',
    text: 'Ninety-four kilometres from the Piedmont to the coastal plain, with only about ' +
      '380 m of relief between them — which is why the vertical scale is exaggerated.',
    source: DEM },
  'dawn-delaware': {
    title: 'Dawn over the Delaware',
    text: 'The Delaware is tidal all the way to Trenton. The airport sits on the filled ' +
      'Hog Island marshes, among the lowest ground in the region.',
    source: `${DEM}; ${WIKI}` },
  'schuylkill-flyover': {
    title: 'Schuylkill Flyover',
    text: 'Between Manayunk and Conshohocken the valley narrows to about a kilometre. ' +
      'A canal opened here in 1819; the railroad and the expressway followed the same floor.',
    source: `${DEM}; ${WIKI}` },
  wissahickon: {
    title: 'Wissahickon Valley',
    text: 'Wissahickon Creek has cut a gorge roughly 60 m deep into the schist, entirely ' +
      'inside the city limits. The 10 m contours show how sharply the upland drops.',
    source: DEM },
  'main-line-ridge': {
    title: 'Main Line Ridge',
    text: 'The Main Line towns follow the railroad alignment of the 1830s along the divide ' +
      'between the Schuylkill and the creeks that run south to the Delaware.',
    source: `${DEM}; ${WIKI}` },
  'night-metro': {
    title: 'Night Metro',
    text: 'After dark the built pattern reads: the grid in the centre, the expressway ' +
      'ring, and the rail lines radiating along the valleys they were surveyed into.',
    source: OSM },
};

export const TOURS = [
  {
    id: 'grand',
    name: 'The Grand Tour',
    blurb: 'All eight shots: skyline, the bridge, and out across the whole valley.',
    // Derived from the flythrough definition so the two cannot drift apart.
    shots: TOUR.map((s) => withAerial({ ...s, caption: GRAND_CAPTIONS[s.preset] })),
  },
  {
    id: 'skyline',
    name: 'Skyline Close-Up',
    blurb: 'The towers, City Hall and University City, block by block.',
    shots: [
      { preset: 'skyline', hold: 5, travel: 6, caption: {
        title: 'Center City',
        text: 'About 12,000 real building footprints stand here at measured OSM heights where ' +
          'the data has them, with estimates or public reference heights otherwise.',
        source: OSM } },
      { preset: 'skyline', hold: 6, travel: 5,
        override: { camLon: -75.1635, camLat: 39.9526, camDist: 2600, camBearing: 205, camPitch: 72 },
        caption: {
          title: 'City Hall',
          text: 'Completed in 1901, City Hall was the tallest habitable building in the world ' +
            'until 1908. Its 167 m tower is drawn as a curated box on top of the real footprint.',
          source: `${WIKI}; ${REFS}` } },
      { preset: 'skyline', hold: 6, travel: 5,
        override: { camLon: -75.1690, camLat: 39.9545, camDist: 3200, camBearing: 250, camPitch: 74 },
        caption: {
          title: 'Market West',
          text: 'Comcast Technology Center (about 340 m, measured) and One Liberty Place ' +
            '(288 m, a public reference height — OSM has none) anchor the cluster.',
          source: `${OSM}; ${REFS}` } },
      { preset: 'skyline', hold: 6, travel: 6,
        override: { camLon: -75.1932, camLat: 39.9522, camDist: 3800, camBearing: 70, camPitch: 73 },
        caption: {
          title: 'University City',
          text: 'Penn and Drexel on the west bank of the Schuylkill, with the FMC Tower and ' +
            'Cira Centre at the river.',
          source: OSM } },
      { preset: 'skyline', hold: 5, travel: 0, caption: {
        title: 'Back to the skyline',
        text: 'Drag from any building to keep exploring; click a landmark for its card.',
        source: 'This map' } },
    ].map(withAerial),
  },
  {
    id: 'crossings',
    name: 'Delaware Crossings',
    blurb: 'Five bridges over the Delaware, from the Ben Franklin down to the Commodore Barry.',
    shots: [
      { preset: 'ben-franklin-bridge', hold: 6, travel: 7, caption: {
        title: 'Benjamin Franklin Bridge (1926)',
        text: 'Suspension. Main span about 533 m, towers about 116 m above the water; ' +
          'carries I-676 and the PATCO line.',
        source: REFS } },
      { preset: 'ben-franklin-bridge', hold: 6, travel: 7,
        override: { camLon: -75.1293, camLat: 39.9052, camDist: 3800, camBearing: 318, camPitch: 75 },
        caption: {
          title: 'Walt Whitman Bridge (1957)',
          text: 'Suspension. Main span about 610 m; carries I-76 toward the airport and South Jersey.',
          source: REFS } },
      { preset: 'ben-franklin-bridge', hold: 6, travel: 7,
        override: { camLon: -75.0659, camLat: 39.9848, camDist: 3600, camBearing: 333, camPitch: 75 },
        caption: {
          title: 'Betsy Ross Bridge (1976)',
          text: 'A continuous steel truss below the deck, main span about 222 m. ' +
            'Drawn here as chords and diagonals under the roadway.',
          source: REFS } },
      { preset: 'ben-franklin-bridge', hold: 6, travel: 8,
        override: { camLon: -75.0432, camLat: 40.0123, camDist: 3200, camBearing: 5, camPitch: 75 },
        caption: {
          title: 'Tacony–Palmyra Bridge (1929)',
          text: 'A steel tied arch beside a bascule span that still opens for river traffic.',
          source: REFS } },
      { preset: 'ben-franklin-bridge', hold: 6, travel: 0,
        override: { camLon: -75.3697, camLat: 39.8265, camDist: 4500, camBearing: 356, camPitch: 74 },
        caption: {
          title: 'Commodore Barry Bridge (1974)',
          text: 'A cantilever truss with a main span about 501 m — among the longest of its ' +
            'kind in the world.',
          source: REFS } },
    ].map(withAerial),
  },
  {
    id: 'rivers',
    name: 'Rivers & Ridges',
    blurb: 'The land itself: the estuary, the Schuylkill gorge, the Wissahickon and the Main Line.',
    shots: [
      { preset: 'overview', hold: 5, travel: 7, caption: {
        title: 'The Delaware Valley',
        text: 'The Fall Line runs through the city: Piedmont rock upstream, coastal-plain ' +
          'sediment downstream. Every hill here is a real one, stretched to read.',
        source: DEM } },
      { preset: 'dawn-delaware', hold: 5.5, travel: 7, caption: {
        title: 'The estuary',
        text: 'Tidal flats, filled marsh and the lowest ground for fifty kilometres.',
        source: DEM } },
      { preset: 'schuylkill-flyover', hold: 5, travel: 6.5, caption: {
        title: 'The Schuylkill narrows',
        text: 'The valley walls tighten to about a kilometre between Manayunk and Conshohocken.',
        source: DEM } },
      { preset: 'wissahickon', hold: 5, travel: 7, caption: {
        title: 'Wissahickon gorge',
        text: 'Roughly 60 m deep in this data, cut straight into the Piedmont.',
        source: DEM } },
      { preset: 'main-line-ridge', hold: 5, travel: 0, caption: {
        title: 'The divide',
        text: 'North of this crest water runs to the Schuylkill; south of it, to Cobbs and ' +
          'Darby Creeks and the Delaware.',
        source: DEM } },
    ],
  },
];

export const DEFAULT_TOUR = 'grand';

export function getTour(id) {
  return TOURS.find((t) => t.id === id) || null;
}

/** The complete state patch a shot represents (preset plus any override). */
export function shotPatch(shot) {
  const base = presetPatch(shot.preset);
  if (!base) return null;
  if (!shot.override) return base;
  const clean = coercePatch(shot.override);
  return { ...base, ...clean, layers: { ...base.layers, ...(clean.layers || {}) }, preset: base.preset };
}

export function tourDuration(tour) {
  return (tour?.shots || []).reduce((sum, s) => sum + (s.hold || 0) + (s.travel || 0), 0);
}

/** Absolute tour time at which shot `index` begins its hold. */
export function tourShotStart(tour, index) {
  let t = 0;
  for (let i = 0; i < tour.shots.length; i += 1) {
    if (i === index) return t;
    t += (tour.shots[i].hold || 0) + (tour.shots[i].travel || 0);
  }
  return 0;
}

/**
 * Resolve a tour to a concrete state at time `t` seconds (looping), plus the
 * caption to show. During a travel the caption of the shot being left stays
 * up until the midpoint, then the next one takes over.
 */
export function tourFrame(tour, t) {
  const total = tourDuration(tour);
  if (!tour || !(total > 0)) return null;
  let time = t % total;
  if (time < 0) time += total;

  for (let i = 0; i < tour.shots.length; i += 1) {
    const shot = tour.shots[i];
    if (time < shot.hold) {
      return {
        index: i, shot, phase: 'hold', localT: shot.hold > 0 ? time / shot.hold : 1,
        patch: shotPatch(shot), caption: shot.caption,
      };
    }
    time -= shot.hold;
    if (time < shot.travel) {
      const next = tour.shots[(i + 1) % tour.shots.length];
      const localT = shot.travel > 0 ? time / shot.travel : 1;
      return {
        index: i, shot, nextShot: next, phase: 'travel', localT,
        patch: blendPatches(shotPatch(shot), shotPatch(next), localT),
        caption: localT < 0.5 ? shot.caption : next.caption,
      };
    }
    time -= shot.travel;
  }
  const last = tour.shots.length - 1;
  return { index: last, shot: tour.shots[last], phase: 'hold', localT: 1,
    patch: shotPatch(tour.shots[last]), caption: tour.shots[last].caption };
}

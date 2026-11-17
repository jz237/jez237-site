// =============================================================================
//  Ocean Water Lab - every tunable, the game-look scenes, and the exporters.
//  One table drives the advanced panel, saving/loading presets and the engine
//  snippets, so a new parameter only has to be added here (and used in main.js).
// =============================================================================
(function (root) {
  'use strict';

  // [key, group, label, min, max, step, default, format]
  // format: ms deg km m m0 s x f0 f1 f2 f3 pct ev pm kg
  var PARAMS = [
    // ---- waves (FFT spectrum: JONSWAP wind sea + swell) --------------------------
    ['wind', 'waves', 'Wind speed', 0.5, 30, 0.1, 9, 'ms'],
    ['windDir', 'waves', 'Wind heading', 0, 360, 1, 35, 'deg'],
    ['fetch', 'waves', 'Fetch', 5, 1000, 5, 300, 'km'],
    ['gamma', 'waves', 'Peak sharpness', 1, 7, 0.1, 3.3, 'f1'],
    ['spread', 'waves', 'Crest length', 0.3, 4, 0.05, 1, 'x'],
    ['chop', 'waves', 'Choppiness', 0, 1.5, 0.01, 1, 'f2'],
    ['waveScale', 'waves', 'Height scale', 0.1, 2.5, 0.01, 1, 'x'],
    ['detail', 'waves', 'Ripple detail', 0, 2.5, 0.01, 1, 'x'],
    ['swell', 'waves', 'Swell height', 0, 6, 0.05, 0.7, 'm'],
    ['swellLen', 'waves', 'Swell length', 20, 500, 5, 90, 'm0'],
    ['swellDir', 'waves', 'Swell heading', 0, 360, 1, 80, 'deg'],
    ['swellSpread', 'waves', 'Swell focus', 2, 90, 1, 30, 'f0'],
    ['seed', 'waves', 'Random seed', 1, 9999, 1, 1337, 'f0'],
    ['timeScale', 'waves', 'Time scale', 0, 2, 0.01, 1, 'x'],
    // ---- foam ---------------------------------------------------------------------
    ['foam', 'foam', 'Whitecaps', 0, 4, 0.05, 1, 'x'],
    ['foamLife', 'foam', 'Foam lifetime', 0.5, 15, 0.1, 3.2, 's'],
    ['foamBright', 'foam', 'Foam brightness', 0.2, 1.6, 0.01, 0.92, 'f2'],
    ['streaks', 'foam', 'Wind streaks', 0, 3, 0.05, 1, 'x'],
    ['shoreFoam', 'foam', 'Shore foam', 0, 2, 0.05, 1, 'x'],
    ['wake', 'foam', 'Wake foam', 0, 3, 0.05, 1, 'x'],
    ['wakeLife', 'foam', 'Wake lifetime', 1, 40, 0.5, 14, 's'],
    // ---- optics -------------------------------------------------------------------
    ['absR', 'optics', 'Absorb red', 0.02, 1.5, 0.005, 0.42, 'pm'],
    ['absG', 'optics', 'Absorb green', 0.005, 0.8, 0.001, 0.085, 'pm'],
    ['absB', 'optics', 'Absorb blue', 0.005, 0.8, 0.001, 0.05, 'pm'],
    ['scatterCol', 'optics', 'Scatter colour', 0, 0, 0, '#0e62ff', 'color'],
    ['scatterAmt', 'optics', 'Scatter amount', 0, 0.15, 0.0005, 0.022, 'f3'],
    ['sssCol', 'optics', 'Crest glow colour', 0, 0, 0, '#05574c', 'color'],
    ['sss', 'optics', 'Crest glow', 0, 4, 0.05, 1, 'x'],
    ['rough', 'optics', 'Roughness', 0.2, 4, 0.01, 1, 'x'],
    ['reflect', 'optics', 'Reflection', 0, 1.5, 0.01, 1, 'x'],
    ['spec', 'optics', 'Sun glitter', 0, 4, 0.05, 1, 'x'],
    ['refract', 'optics', 'Refraction bend', 0, 4, 0.05, 1, 'x'],
    ['caustics', 'optics', 'Caustics', 0, 4, 0.05, 1, 'x'],
    // ---- shore ----------------------------------------------------------------------
    ['tide', 'shore', 'Tide level', -2, 3, 0.05, 0, 'm'],
    ['tideRange', 'shore', 'Tide swing', 0, 2, 0.05, 0, 'm'],
    ['tidePeriod', 'shore', 'Tide period', 20, 900, 5, 180, 's'],
    ['surf', 'shore', 'Surf height', 0, 4, 0.05, 0.8, 'm'],
    ['surfPeriod', 'shore', 'Surf period', 4, 18, 0.1, 9, 's'],
    ['breakRatio', 'shore', 'Breaker index', 0.4, 1.3, 0.01, 0.78, 'f2'],
    ['surfTrail', 'shore', 'Foam trail', 0.05, 1, 0.01, 0.35, 'f2'],
    ['surfStreaks', 'shore', 'Foam streaks', 0, 1, 0.01, 0.5, 'f2'],
    ['foamScale', 'shore', 'Foam scale', 0.2, 3, 0.01, 1, 'x'],
    ['foamLinger', 'shore', 'Lingering foam', 0, 1, 0.01, 0.25, 'f2'],
    ['wetSand', 'shore', 'Wet sand', 0, 1, 0.01, 0.7, 'f2'],
    // ---- sky ----------------------------------------------------------------------
    ['sunElev', 'sky', 'Sun height', -20, 85, 0.5, 34, 'deg'],
    ['sunAz', 'sky', 'Sun bearing', 0, 360, 1, 238, 'deg'],
    ['moon', 'sky', 'Moonlight', 0, 3, 0.01, 1, 'x'],
    ['clouds', 'sky', 'Cloud cover', 0, 1, 0.01, 0.42, 'pct'],
    ['cloudType', 'sky', 'Cloud type', 0, 1, 0.01, 0.75, 'f2'],
    ['cloudBase', 'sky', 'Cloud base', 300, 4000, 10, 1500, 'm0'],
    ['cloudTop', 'sky', 'Cloud top', 1000, 9000, 50, 4200, 'm0'],
    ['cloudDensity', 'sky', 'Cloud density', 0.2, 3, 0.01, 1, 'x'],
    ['cloudSpeed', 'sky', 'Cloud drift', 0, 4, 0.01, 1, 'x'],
    ['haze', 'sky', 'Haze', 0, 6, 0.05, 0, 'f2'],
    ['fog', 'sky', 'Sea fog', 0, 6, 0.05, 1, 'x'],
    // ---- weather --------------------------------------------------------------------
    ['rain', 'weather', 'Rain', 0, 1, 0.01, 0, 'pct'],
    ['rainSize', 'weather', 'Drop size', 0.4, 2.5, 0.01, 1, 'x'],
    ['rainSplash', 'weather', 'Rain splashes', 0, 2, 0.05, 1, 'x'],
    ['rainShafts', 'weather', 'Rain curtains', 0, 1, 0.01, 0.6, 'f2'],
    ['lensRain', 'weather', 'Lens drops', 0, 1, 0.01, 0, 'f2'],
    ['gusts', 'weather', 'Gust fronts', 0, 1, 0.01, 0.3, 'f2'],
    ['gustSize', 'weather', 'Gust size', 15, 400, 5, 90, 'm0'],
    ['spindrift', 'weather', 'Spindrift', 0, 2, 0.05, 1, 'x'],
    ['lightning', 'weather', 'Lightning', 0, 1, 0.01, 0, 'pct'],
    ['rogue', 'weather', 'Rogue wave', 0, 30, 0.5, 0, 'm'],
    ['rogueEvery', 'weather', 'Rogue every', 15, 600, 5, 90, 's'],
    ['slicks', 'weather', 'Slicks', 0, 1, 0.01, 0, 'f2'],
    ['slickSpace', 'weather', 'Slick spacing', 4, 80, 1, 18, 'm0'],
    ['bio', 'weather', 'Bioluminescence', 0, 3, 0.05, 0, 'x'],
    ['bioCol', 'weather', 'Glow colour', 0, 0, 0, '#2a9dff', 'color'],
    // ---- camera + grade -------------------------------------------------------------
    ['ev', 'grade', 'Exposure', -3, 3, 0.05, 0, 'ev'],
    ['temp', 'grade', 'Temperature', -1, 1, 0.01, 0, 'f2'],
    ['tint', 'grade', 'Tint', -1, 1, 0.01, 0, 'f2'],
    ['sat', 'grade', 'Saturation', 0, 2, 0.01, 1, 'x'],
    ['vib', 'grade', 'Vibrance', -1, 1, 0.01, 0, 'f2'],
    ['contrast', 'grade', 'Contrast', 0.5, 1.6, 0.01, 1, 'x'],
    ['shadowTint', 'grade', 'Shadow tint', 0, 0, 0, '#808080', 'color'],
    ['highTint', 'grade', 'Highlight tint', 0, 0, 0, '#808080', 'color'],
    ['split', 'grade', 'Split toning', 0, 1, 0.01, 0, 'f2'],
    ['bloom', 'grade', 'Bloom', 0, 4, 0.05, 1, 'x'],
    ['vignette', 'grade', 'Vignette', 0, 1.5, 0.01, 0.32, 'f2'],
    ['grain', 'grade', 'Film grain', 0, 1, 0.01, 0, 'f2'],
    ['ca', 'grade', 'Lens fringing', 0, 1, 0.01, 0, 'f2'],
    ['sharpen', 'grade', 'Sharpen', 0, 1, 0.01, 0, 'f2'],
    ['fov', 'grade', 'Field of view', 20, 100, 1, 50, 'deg'],
    ['rays', 'grade', 'Light shafts', 0, 2, 0.01, 0.6, 'f2'],
    // ---- physics + boat -----------------------------------------------------------
    ['density', 'physics', 'Water density', 990, 1300, 1, 1025, 'kg'],
    ['drag', 'physics', 'Drag', 0.1, 4, 0.01, 1, 'x'],
    ['throttle', 'physics', 'Boat throttle', 0, 1, 0.01, 0.75, 'pct'],
    ['spray', 'physics', 'Spray', 0, 3, 0.05, 1, 'x']
  ];
  // on/off switches and multiple choice, also saved with presets
  var SWITCHES = {
    planar: ['optics', 'Planar reflections', true],
    palms: ['shore', 'Palm trees', true],
    fxaa: ['grade', 'FXAA', true],
    boat: ['physics', 'Speedboat', true],
    autopilot: ['physics', 'Autopilot', true],
    follow: ['physics', 'Chase camera', false]
  };
  var CHOICES = {
    tonemap: ['grade', 'Tone curve', 'aces', [['aces', 'ACES'], ['agx', 'AgX'], ['filmic', 'Filmic'], ['reinhard', 'Reinhard']]],
    vessel: ['physics', 'Vessel', 'speedboat', [['speedboat', 'Speedboat'], ['ship', 'Pirate ship']]]
  };
  var GROUPS = [
    ['waves', 'Waves'], ['foam', 'Foam'], ['optics', 'Optics'], ['shore', 'Shore'],
    ['sky', 'Sky'], ['weather', 'Weather'], ['grade', 'Camera + grade'], ['physics', 'Physics + vessels']
  ];

  // water bodies: absorption per metre, scatter colour x amount, crest glow colour
  var LOOKS = {
    ocean: { absR: 0.42, absG: 0.085, absB: 0.05, scatterCol: '#0e62ff', scatterAmt: 0.022, sssCol: '#05574c', sss: 1.0 },
    lagoon: { absR: 0.32, absG: 0.055, absB: 0.045, scatterCol: '#0ec8ff', scatterAmt: 0.07, sssCol: '#0fccad', sss: 1.1 },
    coast: { absR: 0.55, absG: 0.22, absB: 0.38, scatterCol: '#66ff99', scatterAmt: 0.04, sssCol: '#33993d', sss: 0.8 },
    tropical: { absR: 0.30, absG: 0.042, absB: 0.035, scatterCol: '#14dcff', scatterAmt: 0.085, sssCol: '#1ae6c8', sss: 1.35 },
    emerald: { absR: 0.50, absG: 0.11, absB: 0.16, scatterCol: '#2aff9a', scatterAmt: 0.05, sssCol: '#3cff9e', sss: 2.2 },
    navy: { absR: 0.46, absG: 0.11, absB: 0.06, scatterCol: '#0a3cff', scatterAmt: 0.012, sssCol: '#0a4a66', sss: 0.8 },
    surfwater: { absR: 0.34, absG: 0.05, absB: 0.06, scatterCol: '#1ec8d8', scatterAmt: 0.05, sssCol: '#28e0b4', sss: 1.5 }
  };

  // Scene looks. Names describe the look; the comments say which kind of game
  // each is tuned after. Every scene starts from the defaults, so a scene only
  // lists what differs. 'cam' frames the shot: target x, z, yaw, pitch, distance.
  var SCENES = {
    // turquoise lagoon, white sand, hard noon light, saturated grade (Vice City-style coast)
    tropical: {
      label: 'Tropical Bay',
      p: { wind: 5.5, windDir: 300, fetch: 120, chop: 0.95, swell: 0.9, swellLen: 140, swellDir: 255, foam: 0.7,
           sunElev: 58, sunAz: 25, clouds: 0.34, cloudType: 0.82, cloudBase: 1300, cloudTop: 3800, haze: 0.3,
           surf: 1.1, surfPeriod: 10, shoreFoam: 1.2, caustics: 1.6, look: 'tropical',
           temp: 0.08, sat: 1.18, vib: 0.25, contrast: 1.06, bloom: 1.2, ev: -0.35, palms: true, boat: true, autopilot: true },
      cam: [-80, 22, 0.25, 0.14, 30], boat: [-40, -40, 30]
    },
    // low sun through haze, warm sky and a long gold glitter path (Los Santos sunset-style)
    golden: {
      label: 'Golden Coast',
      p: { wind: 7, windDir: 200, fetch: 300, chop: 1.0, swell: 1.2, swellLen: 160, swellDir: 220, foam: 0.9,
           sunElev: 3.5, sunAz: 196, clouds: 0.3, cloudType: 0.45, cloudBase: 1900, cloudTop: 4200, haze: 2.2, fog: 1.6,
           surf: 0.9, look: 'coast', spec: 1.4,
           temp: 0.22, tint: 0.04, sat: 1.12, contrast: 1.08, bloom: 1.8, split: 0.35, shadowTint: '#5a6f8c', highTint: '#ffb070',
           palms: true, boat: true, autopilot: true },
      cam: [-40, 15, 0.28, 0.06, 30], boat: [-30, -5, 25]
    },
    // sailing a brig across a lively sea in the afternoon (pirate-adventure sailing)
    pirate: {
      label: 'Pirate Seas',
      p: { wind: 11, windDir: 250, fetch: 400, chop: 1.08, swell: 1.6, swellLen: 150, swellDir: 240, foam: 1.1,
           sunElev: 24, sunAz: 120, clouds: 0.45, cloudType: 0.8, cloudBase: 1300, cloudTop: 4200, haze: 0.6, look: 'emerald', sss: 1.9,
           sat: 1.12, vib: 0.2, contrast: 1.08, bloom: 1.2, vessel: 'ship', boat: true, autopilot: true, throttle: 1, palms: true },
      cam: [40, -40, 2.4, 0.1, 44], boat: [40, -40, 40]
    },
    // big clear-water surf rolling in over a reef at high tide, foam torn into long streaks (Los Santos beach-style)
    surfbeach: {
      label: 'Big Surf',
      p: { wind: 6, windDir: 330, fetch: 200, chop: 1.0, swell: 1.4, swellLen: 180, swellDir: 340, foam: 0.8,
           sunElev: 52, sunAz: 40, clouds: 0.2, cloudType: 0.7, haze: 0.4, look: 'surfwater',
           tide: 0.6, surf: 2.4, surfPeriod: 9.5, breakRatio: 0.8, shoreFoam: 1.4, surfTrail: 0.5, surfStreaks: 0.75, foamScale: 1.0, foamLinger: 0.4,
           caustics: 1.8, sat: 1.1, vib: 0.2, contrast: 1.05, ev: -0.25, palms: true, boat: false },
      cam: [-70, 19, 0.32, 0.95, 42]
    },
    // category-4 storm: torrential rain, gust fronts, spindrift, lightning and rogue waves
    hurricane: {
      label: 'Hurricane',
      p: { wind: 26, windDir: 20, fetch: 1000, gamma: 4.2, chop: 1.2, swell: 4.0, swellLen: 240, swellDir: 30, foam: 1.5,
           foamLife: 6, streaks: 0.55, sunElev: 12, sunAz: 200, clouds: 1.0, cloudType: 1.0, cloudBase: 450, cloudTop: 7000,
           cloudDensity: 1.8, cloudSpeed: 3.5, haze: 3, fog: 2.4, rain: 1, rainSize: 1.1, rainSplash: 1.6, rainShafts: 1, lensRain: 0.45,
           gusts: 0.9, gustSize: 140, spindrift: 1.7, lightning: 0.85, rogue: 16, rogueEvery: 45, look: 'emerald', sss: 2.2,
           surf: 3.5, surfPeriod: 13, tide: 1.2, temp: -0.25, sat: 0.65, contrast: 1.25, vignette: 0.7, ev: -0.5, grain: 0.2,
           split: 0.35, shadowTint: '#3e5a66', highTint: '#9aa49c', palms: false, boat: false },
      cam: [60, -60, 2.6, 0.13, 42], boat: [80, -60, 40]
    },
    // gale, huge swell, rain, lightning, green light through the crests (pirate-adventure storm)
    storm: {
      label: 'Pirate Storm',
      p: { wind: 19, windDir: 60, fetch: 600, gamma: 3.8, chop: 1.18, swell: 3.0, swellLen: 200, swellDir: 70, foam: 1.3,
           foamLife: 5, streaks: 0.7, sunElev: 18, sunAz: 120, clouds: 0.97, cloudType: 1.0, cloudBase: 600, cloudTop: 6000,
           cloudDensity: 1.4, cloudSpeed: 2.5, haze: 1.5, fog: 3, rain: 0.85, lightning: 0.55, look: 'emerald', sss: 2.6,
           surf: 2.4, surfPeriod: 12, temp: -0.22, sat: 0.72, contrast: 1.2, vignette: 0.6, ev: -0.7, grain: 0.15, split: 0.3, shadowTint: '#4a6a78', highTint: '#9aa8a0',
           palms: false, boat: false },
      cam: [60, -60, 3.0, 0.06, 34], boat: [80, -60, 40]
    },
    // deep clear navy water, scattered fair-weather cumulus (open-sea adventure)
    deep: {
      label: 'Deep Ocean',
      p: { wind: 12, windDir: 20, fetch: 700, chop: 1.08, swell: 1.8, swellLen: 180, swellDir: 50, foam: 1.1,
           sunElev: 42, sunAz: 150, clouds: 0.28, cloudType: 0.7, cloudBase: 1400, cloudTop: 3600, look: 'navy',
           spec: 1.0, contrast: 1.05, sat: 1.08, palms: false, boat: true, autopilot: true },
      cam: [150, -150, -2.09, 0.12, 22], boat: [170, -115, 30]
    },
    // moon path on a slow swell, stars, cool grade
    night: {
      label: 'Moonlit',
      p: { wind: 4.5, windDir: 100, chop: 0.9, swell: 0.8, swellLen: 120, foam: 0.6, sunElev: -14, sunAz: 30, moon: 1.4,
           clouds: 0.18, cloudType: 0.45, haze: 0.2, look: 'ocean', temp: -0.25, sat: 0.85, contrast: 1.1, bloom: 1.6,
           vignette: 0.5, ev: -0.6, bio: 1.3, throttle: 0.6, palms: true, boat: true, autopilot: true },
      cam: [-30, 10, 0.52, 0.1, 24], boat: [-50, -15, 26]
    },
    // dawn calm: a near mirror with pink haze (open-world lake/sea at dawn)
    glass: {
      label: 'Glass Calm',
      p: { wind: 1.4, windDir: 140, fetch: 20, chop: 0.6, swell: 0.25, swellLen: 80, foam: 0, sunElev: 6, sunAz: 110,
           clouds: 0.22, cloudType: 0.3, cloudBase: 2200, cloudTop: 3600, haze: 3.2, fog: 2.2, surf: 0.3, look: 'ocean',
           temp: 0.05, tint: 0.1, sat: 0.95, contrast: 0.96, bloom: 1.4, split: 0.25, shadowTint: '#6a6a9a', highTint: '#ffc2a8',
           palms: true, boat: false },
      cam: [-20, 30, -1.22, 0.05, 28], boat: [0, 20, 40]
    }
  };

  // ---------------------------------------------------------------------------
  function defaults() {
    var o = {};
    PARAMS.forEach(function (p) { o[p[0]] = p[6]; });
    for (var k in SWITCHES) o[k] = SWITCHES[k][2];
    for (k in CHOICES) o[k] = CHOICES[k][2];
    return o;
  }
  function hexToRgb(h) {
    var n = parseInt(String(h).replace('#', ''), 16);
    if (!isFinite(n)) n = 0x808080;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function fmt(kind, v) {
    switch (kind) {
      case 'ms': return v.toFixed(1) + ' m/s';
      case 'deg': return Math.round(v) + '°';
      case 'km': return Math.round(v) + ' km';
      case 'm': return v.toFixed(v < 10 ? 2 : 1) + ' m';
      case 'm0': return Math.round(v) + ' m';
      case 's': return v.toFixed(1) + ' s';
      case 'x': return v.toFixed(2) + '×';
      case 'f0': return String(Math.round(v));
      case 'f1': return v.toFixed(1);
      case 'f2': return v.toFixed(2);
      case 'f3': return v.toFixed(3);
      case 'pct': return Math.round(v * 100) + '%';
      case 'ev': return (v >= 0 ? '+' : '') + v.toFixed(2) + ' EV';
      case 'pm': return v.toFixed(3) + '/m';
      case 'kg': return Math.round(v) + ' kg/m³';
    }
    return String(v);
  }
  function snapshot(state) {
    var o = {};
    PARAMS.forEach(function (p) { o[p[0]] = state[p[0]]; });
    for (var k in SWITCHES) o[k] = state[k];
    for (k in CHOICES) o[k] = state[k];
    return o;
  }

  // ---- exporters ---------------------------------------------------------------
  // derived: values main.js computed for the current frame (sea state, sun, etc.)
  function v3(a, d) { return a.map(function (x) { return (+x).toFixed(d || 4); }).join(', '); }
  function exportJSON(state, derived) {
    return JSON.stringify({ format: 'ocean-water-lab/1', scene: state.scene || 'custom', params: snapshot(state), derived: derived }, null, 2);
  }
  function exportKit(state, d) {
    // the exact uniforms the kit's shaders read, plus the spectrum for WaterFFT
    return [
      '// Water Kit - uniforms for kit/glsl/ocean.frag or the HLSL port (same names).',
      '// Spectrum (WaterFFT.Ocean.setParams / WaterFFT C++ port):',
      '//   windSpeed ' + state.wind + ', windDirection ' + (state.windDir * Math.PI / 180).toFixed(4) + ' rad, fetchKm ' + state.fetch +
        ', gamma ' + state.gamma + ', spreadScale ' + state.spread,
      '//   choppiness ' + state.chop + ', amplitudeScale ' + state.waveScale + ', detailScale ' + state.detail +
        ', swellHeight ' + state.swell + ', swellLength ' + state.swellLen + ', swellDirection ' + (state.swellDir * Math.PI / 180).toFixed(4) +
        ', swellSpread ' + state.swellSpread + ', foamAmount ' + state.foam + ', seed ' + state.seed,
      'uExtinction     = (' + v3(d.extinction) + ');',
      'uScatterColor   = (' + v3(d.scatter) + ');',
      'uSssColor       = (' + v3(d.sss) + ');',
      'uSssStrength    = ' + (+state.sss).toFixed(3) + ';',
      'uRoughness      = ' + d.roughness.toFixed(5) + ';',
      'uFoamThreshold  = ' + d.foamThreshold.toFixed(5) + ';',
      'uFoamGain       = ' + d.foamGain.toFixed(4) + ';',
      'uWaveHs         = ' + d.hs.toFixed(3) + ';',
      'uWindStreaks    = ' + d.windStreaks.toFixed(4) + ';',
      'uRain           = ' + (+state.rain).toFixed(3) + ';',
      'uFogDensity     = ' + d.fogDensity.toExponential(3) + ';',
      'uLook           = (' + v3([state.reflect, state.spec, state.refract, state.foamBright], 3) + ');   // reflection, glitter, refraction bend, foam brightness',
      'uSurf           = (' + v3([state.surf, state.surfPeriod, state.breakRatio, state.shoreFoam], 3) + ');   // height m, period s, breaker index, shore foam',
      'uSurfFoam       = (' + v3([state.surfTrail, state.surfStreaks, state.foamScale, state.foamLinger], 3) + ');   // trail, streaks, scale, lingering foam',
      'uGust           = (' + v3([state.gusts, state.gustSize], 3) + ', drift x, drift z);   // drift accumulates wind x time',
      'uSlick          = (' + v3([state.slicks, state.slickSpace], 3) + ', wind dir x, wind dir z);',
      'uRogueB         = (' + (+state.rogue).toFixed(2) + ' m crest, k, phase, group length)   // every ' + state.rogueEvery + ' s; see water_weather.glsl',
      'uBio            = bioCol x ' + state.bio + ' x night factor   // bioCol ' + state.bioCol,
      'sea level       = ' + state.tide + ' m + ' + state.tideRange + ' m * sin(2 pi t / ' + state.tidePeriod + ' s)   // raise your water plane (or lower the land) by this',
      'foam sim decay  = exp(-dt / ' + state.foamLife + ');  wake decay = exp(-dt / ' + state.wakeLife + ');',
      'sun direction   = (' + v3(d.sunDir) + ');  sun colour = (' + v3(d.sunColor) + ');',
      'buoyancy: waterDensity ' + state.density + ' kg/m3, drag x' + state.drag
    ].join('\n');
  }
  function exportUnity(state, d) {
    var kmh = state.wind * 3.6, c = hexToRgb(state.scatterCol), absorbDist = 1 / Math.max(state.absG, 1e-3);
    return [
      '// Unity - option A: the kit HLSL in your own shader (exact). Property names follow the kit uniforms.',
      'using UnityEngine;',
      'public class OceanLook : MonoBehaviour {',
      '    public Material water;',
      '    void OnEnable() {',
      '        water.SetVector("uExtinction", new Vector4(' + v3(d.extinction) + ', 0));',
      '        water.SetVector("uScatterColor", new Vector4(' + v3(d.scatter) + ', 0));',
      '        water.SetVector("uSssColor", new Vector4(' + v3(d.sss) + ', 0));',
      '        water.SetFloat("uSssStrength", ' + (+state.sss).toFixed(3) + 'f);',
      '        water.SetFloat("uRoughness", ' + d.roughness.toFixed(5) + 'f);',
      '        water.SetFloat("uFoamThreshold", ' + d.foamThreshold.toFixed(5) + 'f);',
      '        water.SetFloat("uFoamGain", ' + d.foamGain.toFixed(4) + 'f);',
      '        water.SetVector("uLook", new Vector4(' + v3([state.reflect, state.spec, state.refract, state.foamBright], 3) + '));',
      '        water.SetVector("uSurf", new Vector4(' + v3([state.surf, state.surfPeriod, state.breakRatio, state.shoreFoam], 3) + '));',
      '        water.SetVector("uSurfFoam", new Vector4(' + v3([state.surfTrail, state.surfStreaks, state.foamScale, state.foamLinger], 3) + '));',
      '        // tide: move the water plane to ' + state.tide + ' m, swinging ' + state.tideRange + ' m over ' + state.tidePeriod + ' s',
      '    }',
      '}',
      '',
      '// Option B: HDRP Water System, closest equivalents (approximate; field names vary by HDRP version).',
      '// WaterSurface ws = GetComponent<WaterSurface>();',
      '// ws.largeWindSpeed = ' + kmh.toFixed(1) + 'f;            // km/h',
      '// ws.largeOrientationValue = ' + Math.round(state.windDir) + 'f;',
      '// ws.largeChaos = ' + (1 / Math.max(state.spread, 0.3) * 0.5).toFixed(2) + 'f;              // lower = longer crests',
      '// ws.ripplesWindSpeed = ' + Math.min(state.wind * 3.6 * state.detail, 15).toFixed(1) + 'f;',
      '// ws.scatteringColor = new Color(' + v3(c, 3) + ');',
      '// ws.absorptionDistance = ' + absorbDist.toFixed(1) + 'f;          // metres, from the green absorption',
      '// ws.causticsIntensity = ' + (0.5 * state.caustics).toFixed(2) + 'f;',
      '// ws.simulationFoamAmount = ' + Math.min(state.foam * 0.5, 1).toFixed(2) + 'f;'
    ].join('\n');
  }
  function exportUnreal(state, d) {
    var lp = d.lp, hs = d.hs;
    return [
      '// Unreal Engine - Water plugin, closest equivalents (approximate).',
      '// Gerstner wave generator (UGerstnerWaterWaveGeneratorSimple):',
      'NumWaves                  = 16',
      'Seed                      = ' + state.seed,
      'MinWavelength             = ' + Math.max(lp * 0.06, 0.5).toFixed(1),
      'MaxWavelength             = ' + (Math.max(lp, state.swell > 0.1 ? state.swellLen : 0) * 1.3).toFixed(1),
      'MinAmplitude              = ' + (hs * 0.02).toFixed(3),
      'MaxAmplitude              = ' + (Math.max(hs * 0.35, state.swell * 0.5)).toFixed(3),
      'WindAngleDeg              = ' + Math.round(state.windDir),
      'DirectionAngularSpreadDeg = ' + Math.round(clamp(160 / Math.max(state.spread, 0.3), 10, 180)),
      'SmallWaveSteepness        = ' + clamp(0.35 * state.chop, 0, 1).toFixed(2),
      'LargeWaveSteepness        = ' + clamp(0.18 * state.chop, 0, 1).toFixed(2),
      '',
      '// Single Layer Water material outputs:',
      'Scattering Coefficients   = (' + v3(d.scatter.map(function (x) { return x * 10; }), 4) + ')   // per metre',
      'Absorption Coefficients   = (' + v3(d.extinction, 4) + ')   // per metre',
      'Phase G                   = 0.2',
      '// Tide: offset the Water Body by ' + (state.tide * 100).toFixed(0) + ' cm (swing ' + (state.tideRange * 100).toFixed(0) + ' cm over ' + state.tidePeriod + ' s).',
      '// Shore waves: Water Body Ocean "Shore wave" settings are the nearest match; exact surf = kit WaterSurf.hlsl.',
      '// Exact option: wrap kit/hlsl/*.hlsl in Custom nodes and feed the uniforms from the Kit tab.'
    ].join('\n');
  }
  function exportGodot(state, d) {
    return [
      '# Godot 4 - ShaderMaterial running the kit GLSL (ported to .gdshader), exact uniform values.',
      'extends MeshInstance3D',
      'func _ready():',
      '    var m: ShaderMaterial = get_active_material(0)',
      '    m.set_shader_parameter("uExtinction", Vector3(' + v3(d.extinction) + '))',
      '    m.set_shader_parameter("uScatterColor", Vector3(' + v3(d.scatter) + '))',
      '    m.set_shader_parameter("uSssColor", Vector3(' + v3(d.sss) + '))',
      '    m.set_shader_parameter("uSssStrength", ' + (+state.sss).toFixed(3) + ')',
      '    m.set_shader_parameter("uRoughness", ' + d.roughness.toFixed(5) + ')',
      '    m.set_shader_parameter("uFoamThreshold", ' + d.foamThreshold.toFixed(5) + ')',
      '    m.set_shader_parameter("uFoamGain", ' + d.foamGain.toFixed(4) + ')',
      '    m.set_shader_parameter("uLook", Vector4(' + v3([state.reflect, state.spec, state.refract, state.foamBright], 3) + '))',
      '    m.set_shader_parameter("uSurf", Vector4(' + v3([state.surf, state.surfPeriod, state.breakRatio, state.shoreFoam], 3) + '))',
      '    m.set_shader_parameter("uSurfFoam", Vector4(' + v3([state.surfTrail, state.surfStreaks, state.foamScale, state.foamLinger], 3) + '))',
      '    # tide: water plane at ' + state.tide + ' m, swinging ' + state.tideRange + ' m over ' + state.tidePeriod + ' s'
    ].join('\n');
  }
  function clamp(x, a, b) { return Math.min(Math.max(x, a), b); }

  root.OceanParams = {
    PARAMS: PARAMS, SWITCHES: SWITCHES, CHOICES: CHOICES, GROUPS: GROUPS, LOOKS: LOOKS, SCENES: SCENES,
    defaults: defaults, hexToRgb: hexToRgb, fmt: fmt, snapshot: snapshot,
    exporters: { json: exportJSON, kit: exportKit, unity: exportUnity, unreal: exportUnreal, godot: exportGodot }
  };
})(typeof window !== 'undefined' ? window : this);

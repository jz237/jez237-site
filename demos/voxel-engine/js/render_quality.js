// Quality tiers and the resolution auto-scaler.

// Every renderer feature is switched from here. Fields:
//   scale        starting render scale (fraction of canvas resolution)
//   shadowRes    size of one shadow cascade; camCascades = half-extents (m) of
//                the camera-centred cascades (a whole-world cascade is always added)
//   shadowTaps   PCF taps (1, 4, 8, 12), shadowMaxR = kernel radius cap in texels
//   kernel       shadow penumbra radius in metres where resolution allows
//   aoTaps       volume AO taps (3, 6, 9, 13); ssao = screen-space AO taps (0 = off)
//   bloom        pyramid levels (0 = off); bloomCheap = 4-tap downsample
//   taa          temporal AA (FXAA still runs when off and fxaa is set); edgeAA = edge
//                anti-aliasing inside the composite, for a tier with no pass after it
//   detail       sub-voxel surface detail taps (speckle, grain, rain streaks)
//   lightOcc     point lights are blocked by walls (one map tap per light)
//   lamps        most emissive-voxel lamp lights in use at once after dusk
//   shadowInterval  fewest frames between shadow refreshes while things move
//   shadowSlack  how far a body at rest may shift, in texels of the finest shadow
//                cascade, before its shadow is drawn again (0: any change at all)
//   contactSlack the same for the contact map under it, in metres
//   contactShift the contact map's layer of bodies at rest moves with the map as the
//                camera walks instead of being drawn again; on where not given (false:
//                the layer is drawn again, with positions rounded the old way)
//   lightBakes   occlusion maps of point lights marched per frame, at most (8 where
//                not given; a light waiting for its map shines unoccluded)
//   skyLayers    layers of the sky-visibility volume swept per frame after an edit
//                (nine passes each; twice as many while a second sweep waits). 4
//                where not given: daylight reaches a new hole within 18 frames
//   aniso        anisotropic filtering of the detail noise (1 = off)
//   surfaceOff   parts of the surface shading the tier goes without (each name N
//                gives `#define NO_N`; shaders.js and render_shaders_surface.js say
//                what each is): MOUND heaps and crowns as mounds (the heap program),
//                BEVEL edge wear and creases,
//                RELIEF joints and micro relief, BANKRAY and BANK the lawn bank,
//                WET, BREAK the break in concrete, DUST, PAINT, TRUNK round trunks.
//                What goes on a tier is what a picture pair shows is not seen to
//                go (the second critic's judgement 17 for the lists below), its
//                cost second. The cost: what the surface shading added since 15
//                October is to come down to 5% of a frame on low and 15% on medium
//                over six views (the software frame; tools/perf/surface_cost.mjs
//                measures it); both tiers are over that with these lists and wait
//                on segments drawn in two parts and on a lighter mound, and the
//                tool holds them to what they read meanwhile. high and ultra keep
//                everything.
//   softShadow   debris and dust cast sun shadows through the soft shadow map
//                (otherwise the sun is only dimmed beneath a piece of debris)
//   gasRes       dust, smoke and fire are drawn at 1 / gasRes of the scene resolution
//                at best (1 = straight into the scene, which no tier asks for:
//                a cloud gets its form where the layer is brought back up),
//                coarser when they would cover more than gasFill screens of
//                pixels at the resolution in use, down to 1 / gasCoarsest (an
//                eighth where the tier does not say; a sixteenth on low, where
//                a collapse seen from inside its cloud is 100 to 260 screens of
//                sprites); softParticles = noise-shaped puffs
//   flames       small flames are drawn at the scene's own size, in a pass of
//                their own after the gas, as bodies by day (render_particles.js;
//                its quads are counted in ParticlePass.flameFill). Off: they
//                stay in the gas layer, glows that the day all but hides
//   fineDist     broken matter is drawn at 2.5 cm within this distance (m), up to
//                fineQuads fine quads in all (render_detail.js; the engine picks).
//                0: not at all, breaks are drawn as whole voxels
//   fineMarks    how much of the marks a blast leaves on what faces it is
//                drawn (engine/src/detail/decor.rs, MARKS): 1 where the tier
//                does not say; 0.5 on medium, where one rocket's marks at
//                0.6 and more take the budget from the breaks beyond 9 m
//   water        how water is drawn (render_water.js): refract = what lies under a
//                surface is drawn bent and tinted from a copy of the scene (else the
//                surface is blended over it), shadow = one tap of the sun's shadow,
//                ripples = trains of small waves crossing each other (2 or 3), trace =
//                steps a mirrored ray takes to find banks and walls (0 = none), spray =
//                water in the air is summed at 1 / spray of the scene resolution
export const TIERS = {
  low: {
    scale: 0.7, shadowRes: 1024, camCascades: [], shadowTaps: 4, shadowMaxR: 1, shadowBlend: false, kernel: 0.03,
    aoTaps: 3, ssao: 0, bloom: 0, bloomCheap: true, bloomMix: 0, fxaa: false, sharpen: false, taa: false,
    shafts: 0, bevel: false, specular: false, clouds: true, vignette: 0.22, softParticles: false,
    ssaoBilateral: false, autoExposure: true, shaftStrength: 0, shadowInterval: 2, detail: false, lightOcc: true, lamps: 6, gasRes: 4, gasFill: 1.5, gasCoarsest: 16, edgeAA: true, aniso: 1, softShadow: false, wet: false, flames: false,
    fineDist: 0, fineQuads: 0, shadowSlack: 0.25, contactSlack: 0.025, skyLayers: 2, lightBakes: 4,
    // (What the second critic did not find missing, low as it is beside
    // low cut, its judgement 17: round trunks, paint. (The far field's
    // shadow lookup was a third, and is no longer in the surface shading
    // of any tier: the far field's casters are in the cascades.) The
    // mound stays: without it a heap is a stepped pyramid of cubes and a
    // crown a lattice of pits. The bank stays: without it a lawn is three
    // dark terraces, on the tier a headset gets.)
    surfaceOff: ['TRUNK', 'PAINT'],
    water: { refract: false, shadow: false, ripples: 2, trace: 0, spray: 2 },
  },
  medium: {
    scale: 1, shadowRes: 2048, camCascades: [12], shadowTaps: 4, shadowMaxR: 2, shadowBlend: false, kernel: 0.025,
    aoTaps: 6, ssao: 6, bloom: 5, bloomCheap: true, bloomMix: 0.07, fxaa: true, sharpen: true, taa: false,
    shafts: 0, bevel: true, specular: true, clouds: true, vignette: 0.25, softParticles: true,
    ssaoBilateral: false, autoExposure: true, shaftStrength: 0, shadowInterval: 1, detail: true, lightOcc: true, lamps: 10, gasRes: 2, gasFill: 2.5, aniso: 1, softShadow: true, wet: true, flames: true,
    fineDist: 20, fineQuads: 100000, fineMarks: 0.5,
    // (One switch at a time under the second critic's eye, its judgement
    // 17: the edge wear is not seen to go. The joints
    // in relief are the whole of what makes a brick wall at two metres a
    // wall of bricks and not a wall with bricks printed on it, and stay;
    // so does the bank's ray, without which a lawn is three ribbed steps;
    // wet stays until it is judged with water in the picture.)
    surfaceOff: ['BEVEL'],
    water: { refract: true, shadow: true, ripples: 2, trace: 8, spray: 2 },
  },
  high: {
    scale: 1, shadowRes: 2048, camCascades: [7, 20], shadowTaps: 8, shadowMaxR: 3, shadowBlend: true, kernel: 0.03,
    aoTaps: 9, ssao: 8, bloom: 6, bloomCheap: false, bloomMix: 0.075, fxaa: true, sharpen: true, taa: true,
    shafts: 14, bevel: true, specular: true, clouds: true, vignette: 0.25, softParticles: true,
    ssaoBilateral: true, autoExposure: true, shaftStrength: 1.2, shadowInterval: 1, detail: true, lightOcc: true, lamps: 12, gasRes: 2, gasFill: 4, aniso: 2, softShadow: true, wet: true, flames: true,
    fineDist: 32, fineQuads: 400000,
    water: { refract: true, shadow: true, ripples: 3, trace: 12, spray: 2 },
  },
  ultra: {
    scale: 1, shadowRes: 2048, camCascades: [7, 20], shadowTaps: 12, shadowMaxR: 4, shadowBlend: true, kernel: 0.035,
    aoTaps: 13, ssao: 12, bloom: 6, bloomCheap: false, bloomMix: 0.075, fxaa: true, sharpen: true, taa: true,
    shafts: 20, bevel: true, specular: true, clouds: true, vignette: 0.25, softParticles: true,
    ssaoBilateral: true, autoExposure: true, shaftStrength: 1.2, shadowInterval: 1, detail: true, lightOcc: true, lamps: 12, gasRes: 2, gasFill: 4, aniso: 4, softShadow: true, wet: true, flames: true,
    fineDist: 40, fineQuads: 800000,
    water: { refract: true, shadow: true, ripples: 3, trace: 16, spray: 2 },
  },
};
// For recording video through the software rasteriser, where a frame costs
// seconds of CPU and four fifths of that is per pixel, spread thinly over
// every pass (no single feature is worth more than a few percent). So:
// medium's look at 0.8 of the resolution, upscaled with the sharpen, less
// the screen-space AO (the contact map seats what moves) and with the gas
// layer at a quarter. Updates are paced as in play, since a frame of video
// follows the one before, not settled in full for every frame. For full
// resolution add scale=1 to the URL.
TIERS.capture = {
  ...TIERS.medium, paced: true, scale: 0.8, aoTaps: 3, ssao: 0, bloom: 4, gasRes: 4,
};
// The tiers the auto-scaler moves between, cheapest first.
export const TIER_ORDER = ['low', 'medium', 'high', 'ultra'];

const TARGET_MS = 1000 / 60;
// Triangles a frame may submit before the geometry counts as what makes it
// slow (the low tier's budget: tools/perf/frame_budgets.mjs).
export const GEOMETRY_BUDGET = 1.0e6;
// Scene pixels a tier starts at when adapting (a 1280x720 canvas starts at
// full resolution, a 4K one at about a third), and the fewest it may drop to.
export const START_PIXELS = { low: 0.6e6, medium: 1.0e6, high: 1.6e6, ultra: 2.1e6 };
const FLOOR_PIXELS = 640 * 360;

// Scale limits for a canvas of `pixels` device pixels: [min, start] for a tier.
// The floor is an absolute pixel count, so a high-DPI canvas can go as low
// as a small one, not just to half its own size.
export function scaleRange(tier, pixels) {
  const q = (v) => Math.round(v * 20) / 20;
  const min = Math.max(0.25, Math.min(0.5, q(Math.sqrt(FLOOR_PIXELS / Math.max(pixels, 1)))));
  // A tier outside the auto-scaler's ladder (capture) starts like medium.
  const start = Math.max(min, Math.min(1, q(Math.sqrt((START_PIXELS[tier] || START_PIXELS.medium) / Math.max(pixels, 1)))));
  return [min, start];
}

// What each level of thrift saves (Renderer._applyThrift): 1 the gas
// layer's budget halved, sky visibility and light maps at half their rate;
// 2 also the contact map every other frame; 3 also the shadows of moving
// bodies every other frame (flicker on what tumbles: the last thing before
// the tier).
export const THRIFT_MAX = 3;
// Levels taken before the resolution is touched when pixels are the cost.
const THRIFT_FIRST = 2;

const WINDOW = 32;
// Frames at the start of a session whose GPU times are not looked at, and
// the most time that may take (ms).
const WARM_UP = 24;
const WARM_LEAST = 8;
const WARM_MS = 1500;
// No GPU time counts for more than this (ms).
const GPU_MOST = 1000;
// A GPU time is news for this many frames after it was told. (A timer's
// result comes a frame or three after its frame, a fence's the frame
// after; one that nothing has renewed for longer is the time of a frame
// long gone.)
export const GPU_FRESH = 12;
// A step down is judged on this many ms of frames (twice as many without a
// GPU time) and at least TRIAL_FRAMES of them, the first TRIAL_SKIP left
// out (twice as many after a change of tier).
const TRIAL_MS = 900;
const TRIAL_SKIP = 4;
const TRIAL_FRAMES = 12;
// Headroom (the frame's share of time over what it takes) under which a
// frame is far over, and the share of late frames that says the same
// without a GPU time.
const FAR_OVER = 0.5;
const LATE_FAR = 0.6;
// How long (ms) the GPU's time must have been far over before that is
// acted on as such: a second of it is a burst (programs used for the first
// time when the first blast goes off), and what a burst costs is a trial,
// which is taken back, not everything at once and for good.
const FAR_FOR = 1500;
// A frame that takes this many times its period, whoever is to blame, and
// how long (ms) such frames must have kept coming for the picture to go
// to its cheapest: three seconds of nothing else is the machine drowning.
const DROWN = 2.5;
const DROWN_FOR = 3000;
// What one frame may add to that count, ms.
const DROWN_MOST = 1000;
// The time a timer query reports runs from the frame's first command to
// its last as the GPU's process came to them. Where the page needed about
// as long to issue them (within this factor and this many ms), the time
// says how slow the page was and bounds the GPU's work only from above.
const SPAN_SHARE = 1.25;
const SPAN_SLACK = 1;
// For a lower resolution to stand, the GPU time must come down by this
// share of what the pixels predict; without a GPU time, the share of late
// frames must fall to this share of what it was. A lower tier must leave
// no more than this share of the time.
const PIXELS_MUST_BUY = 0.4;
const LATE_MUST_BUY = 0.6;
const TIER_MUST_BUY = 0.85;
// Thrift must leave no more than this share of the time.
const THRIFT_MUST_BUY = 0.94;
// How long a step that bought nothing is not tried again (ms).
const SCALE_HOLD = 60000;
const TIER_HOLD = 120000;
// No display refreshes slower than this (ms): a cadence beyond it is never
// mistaken for the display's own.
const SLOWEST_DISPLAY = 45;

// Holds the frame rate by trading, in this order, what a player notices
// least: `thrift` (THRIFT below: the gas layer and the volumes, then the
// contact map every other frame), resolution, and at the floor of that
// the shadows of moving bodies every other frame and then the quality
// tier. A frame that is slow because of its geometry (`geometry` in
// update(): the renderer's count of triangles against what a frame may
// submit) is not helped by fewer pixels: there the thrift goes all the way
// before the resolution is touched.
//
// With a measured GPU time (timer query, or the renderer's fence estimate)
// it steers by that against a budget and can jump straight to the scale the
// budget allows. A frame that is slow because the simulation was busy, or a
// display that simply refreshes at 30 or 50 Hz, does not move it.
//
// Without any GPU time it only sees frame intervals. It learns the display's
// own cadence from them and reacts to frames that miss it, ignoring frames
// in which the main thread was the busy one. It cannot see headroom, so it
// probes upward now and then and backs off for longer each time a probe
// costs frames.
//
// Every downward move can be undone: scale and tier both come back after a
// sustained calm stretch (one late frame now and then does not start the
// wait again).
//
// What it is told is not always the GPU. A frame in which a shader was
// compiled or a texture reallocated reports a GPU time of hundreds of
// milliseconds: the time is taken as the median of the last five, never
// more than a tenth of a second, and nothing is concluded from the first
// frames of a session or of a tier. And a slow processor looks like a slow
// card through every measure there is (the driver's own work stretches a
// timer query and a fence alike, and makes frames late): so a step down
// (thrift, resolution, tier) taken while the frame is somewhat over its
// time is a trial. If what was measured does not come down by a good part
// of what the step should buy, the step is taken back and not tried again
// for a minute (twice as long each time it fails): a machine whose card
// is fine does not pay in picture for its processor. Not so when the
// frame is far over (more than twice its time): there every step is taken
// at once and kept, tried or not, helped or not. A cheap picture that did
// not help costs the player little; a dear one at three frames a second
// costs them the game.
export class AutoScale {
  constructor() {
    this.period = TARGET_MS;   // estimated display refresh period, ms
    this.minScale = 0.5;
    this.maxScale = 1;
    this.intervals = new Float32Array(WINDOW);
    this.sorted = new Float32Array(WINDOW);
    this.seen = 0;
    this.upDelay = 3000;       // calm time required before raising the scale
    this.tierDelay = 15000;    // and before raising the tier
    this.recent = new Float32Array(5); // the last GPU times told
    this._m = new Float32Array(5);
    // Time left (ms) in which the resolution, and the tier, may not be
    // lowered again, a step down having bought nothing; and how long the
    // next such wait will be.
    this.scaleHold = 0;
    this.scaleHoldNext = SCALE_HOLD;
    this.tierHold = 0;
    this.tierHoldNext = TIER_HOLD;
    this.thriftHold = 0;
    this.thriftHoldNext = SCALE_HOLD;
    this._samples = new Float32Array(128);
    this.reset();
  }

  // Clears the short-term state (after a tier or resolution change made by
  // someone else). What was learned about the display and the back-off
  // delays are kept.
  reset() {
    this.gpu = 0;          // smoothed GPU ms
    this.gpuSamples = 0;
    this.missRate = 0;     // smoothed share of frames that missed the display's cadence
    this.slowFor = 0;      // ms spent over budget
    this.fastFor = 0;      // ms spent comfortably under
    this.floorFor = 0;     // ms spent over budget at the minimum scale
    this.sinceChange = 0;  // ms since the last move in either direction
    this.raised = 0;       // 1 = scale was raised and is on probation, 2 = tier was
    this.lagFor = 0;       // ms of frames arriving much slower than the believed refresh
    this.probe = 0;        // frames left in a display-rate calibration
    this.probeFrom = 1;    // scale to return to after it
    this.probeCadence = 0; // frame interval when it started
    this.scale = 1;
    this.tierStep = 0;     // -1 / +1 when the tier should change
    this.thrift = 0;       // 0 .. THRIFT_MAX: how much of the cheap work is being saved
    this.told = 0;         // GPU times taken into `recent`
    // A step down on trial: 1 = resolution, 2 = tier, 3 = thrift; what was measured
    // before it (GPU ms, or the share of late frames), the share of that
    // it may still cost for the step to stand, the scale (or level of
    // thrift) to go back to, and what has been measured since.
    this.trial = 0;
    this.trialBefore = 0;
    this.trialWant = 0;
    this.trialFrom = 1;
    this.trialFor = 0;
    this.trialSum = 0;
    this.trialN = 0;
    this.trialSeen = 0;
    this.trialTimed = false; // the trial is judged on GPU times (or on late frames)
    this.trialOdd = 0;     // frames in a row that had the other kind of evidence
    this.tierBefore = -1;  // the measure when a tier down was asked for (-1: not a trial)
    this.tierTimed = false; // and whether it is a GPU time
    this.timed = false;    // the last frame seen had a GPU time
    this.undoing = false;  // the tier up now asked for takes a failed trial back
    this.wasLong = false;  // the frame before took over a quarter of a second
    this.far = false;      // far over, as the last update saw it
    this.farFor = 0;       // ms the GPU's time has been far over
    this.drownFor = 0;     // ms of frames that took several times their period
    this.age = 0;          // ms of frames seen
    this.probeFor = 0;     // ms the calibration has run
  }

  // Frames in which nothing was drawn have gone by (the start card, a
  // menu, a pause): the time since the last picture is not a frame's, and
  // what was being counted against the frames before it is not carried
  // over to the frames after. (The page's last frames before a start
  // card are its first ones, a second each on a slow processor; taken
  // together with the card's seconds as one more slow frame, they were
  // "drowning", and play began on the cheapest picture.)
  rested() {
    this.drownFor = this.farFor = this.lagFor = this.slowFor = 0;
    this.wasLong = false;
  }

  // Median of the last GPU times told (up to five; of two, the lesser).
  _median() {
    const r = this.recent, m = this._m, n = Math.min(this.told, 5);
    for (let i = 0; i < n; i++) {
      const v = r[i];
      let j = i - 1;
      for (; j >= 0 && m[j] > v; j--) m[j + 1] = m[j];
      m[j + 1] = v;
    }
    return m[(n - 1) >> 1];
  }

  // Lower quartile of recent frame intervals: the display's refresh period
  // as long as at least a quarter of the frames are on time.
  _cadence(dt) {
    this.intervals[this.seen % WINDOW] = dt;
    this.seen++;
    const n = Math.min(this.seen, WINDOW), s = this.sorted;
    for (let i = 0; i < n; i++) s[i] = this.intervals[i];
    // Insertion sort: 32 nearly-sorted floats.
    for (let i = 1; i < n; i++) {
      const v = s[i];
      let j = i - 1;
      for (; j >= 0 && s[j] > v; j--) s[j + 1] = s[j];
      s[j + 1] = v;
    }
    return s[n >> 2];
  }

  // The renderer switched tier as asked (dir -1 or +1).
  tierChanged(dir) {
    this.tierStep = 0;
    // (A tier put back because the step down bought nothing is not a raise
    // on probation: it is where the picture belongs.)
    this.raised = dir > 0 && !this.undoing ? 2 : 0;
    this.undoing = false;
    this.sinceChange = 0;
    this.slowFor = this.fastFor = this.floorFor = 0;
    this.missRate = Math.min(this.missRate, 0.1);
    this.gpuSamples = 0; // the old tier's GPU time says nothing about the new one
    this.told = 0;
    this.trial = 0;
    // The tier went down to save time: it has to, or it comes back.
    if (dir < 0 && this.tierBefore >= 0) this._try(2, this.tierBefore, TIER_MUST_BUY, this.tierTimed);
    this.tierBefore = -1;
  }

  // A step down has just been made: `before` is what was measured, `want`
  // the share of it that may be left for the step to stand.
  // timed: `before` is a GPU time, and so is what the step is judged on.
  _try(kind, before, want, timed) {
    this.trialTimed = timed;
    this.trialOdd = 0;
    this.trial = kind;
    this.trialBefore = before;
    this.trialWant = want;
    this.trialFor = this.trialSum = this.trialN = this.trialSeen = 0;
  }

  _setScale(from, to, raised) {
    // Carry the GPU estimate over to the new resolution instead of waiting
    // for the average to catch up (it would trigger a second step).
    this.gpu *= (to * to) / (from * from);
    this.missRate = Math.min(this.missRate, 0.1);
    this.raised = raised;
    this.sinceChange = 0;
    this.slowFor = this.fastFor = 0;
    return to;
  }

  // dt: ms since the previous frame. gpuMs: latest GPU frame time, or -1.
  // busyMs: main-thread time spent in this frame before rendering started
  // (simulation, game logic), or -1 when unknown. scale: current render
  // scale. canDrop / canRaise: whether a lower / higher tier may be used.
  // geometry: the frame's triangles as a share of what a frame may submit
  // (over 1: the geometry is the cost, whatever the resolution).
  // Leaves the new scale in this.scale and the level of thrift in
  // this.thrift; this.tierStep becomes -1 or +1 when the tier should
  // change and stays so until tierChanged() is called.
  // spanMs: how long the page's thread took to issue the commands of the
  // frame gpuMs is the time of (0: not known).
  // gpuAge: frames drawn since gpuMs was told (0: it is this frame's
  // news). A time that nothing renews says nothing about the frames after
  // it: past GPU_FRESH frames it is as if there were none. (The renderer
  // keeps the last time it was told; a timer whose results stopped
  // coming, or a run in which nothing more was sent to the GPU, had the
  // time of one early frame, seconds long, told again every frame, and
  // everything was given up for it in three seconds.)
  update(dt, gpuMs, busyMs, scale, canDrop, canRaise, geometry = 0, spanMs = 0, gpuAge = 0) {
    this.scale = scale;
    if (gpuAge > GPU_FRESH) gpuMs = -1;
    // One long gap is a pause (the first frame, a hidden tab, a
    // breakpoint) and says nothing. Frames that keep coming that slowly
    // are the machine, and the time to act: a scaler that looks away
    // from frames over a quarter of a second stays where it is at three
    // frames a second, whatever it is on.
    const long = dt > 250, pause = dt <= 0 || dt > 5000 || (long && !this.wasLong);
    this.wasLong = long;
    if (pause) return;
    const cadence = Math.max(4, this._cadence(dt));
    const busy = busyMs > 0.5 * dt;
    const timed = gpuMs >= 0;
    if (timed !== this.timed) {
      // The kind of evidence changed (a GPU time came, or the last one
      // is no longer news): what was counted on the other kind is not
      // carried over. (The lag is counted in every frame and looked at
      // in those without a GPU time: seconds of it from frames that had
      // one sent the first frame without straight to the calibration.)
      this.timed = timed;
      this.lagFor = 0;
      this.missRate = 0;
    }
    if (this.seen >= 8) {
      if (cadence < this.period * 1.3) {
        // Faster than believed, or only a little slower: follow it. A GPU
        // that cannot keep up shows as whole missed refreshes, never as this.
        this.period += (cadence - this.period) * 0.2;
        this.lagFor = 0;
      } else if (!busy) {
        // Frames keep arriving much slower than the believed refresh rate:
        // either the GPU is missing every other refresh, or the display (or
        // a browser throttle) really is that slow. Resolved below.
        this.lagFor += dt;
      }
    }
    let slow, fast, headroom = 1, sample = -1, g = gpuMs;
    // Frames that take several times their period, one after another:
    // counted whatever the cause (an on-time frame takes some of the count
    // back, not all of it).
    // (One frame counts for a second at most, however long it took: a
    // gap is one frame, and drowning is many. And not the page's first
    // frames, which compile, allocate and upload: a second each on a slow
    // processor, and nothing to do with the frames of play.)
    this.drownFor = dt > DROWN * Math.max(TARGET_MS, this.period) ? this.drownFor + Math.min(dt, DROWN_MOST) : Math.max(0, this.drownFor - 4 * dt);
    if (this.seen <= WARM_LEAST) this.drownFor = 0;
    if (this.scaleHold > 0) this.scaleHold -= dt;
    if (this.tierHold > 0) this.tierHold -= dt;
    if (this.thriftHold > 0) this.thriftHold -= dt;
    this.age += dt;
    if (timed && (this.seen <= WARM_LEAST || (this.seen <= WARM_UP && this.age < WARM_MS))) {
      // The first frames compile, allocate and upload: their times say
      // nothing about the frames to come. (Eight of them whatever they
      // take, then a second and a half at most: at three frames a second
      // 24 frames are eight seconds.)
      this.told = 0;
      this.sinceChange += dt;
      return;
    }
    if (timed) {
      // One frame's time can be anything (a program compiled, a target
      // reallocated, the page hidden): the median of the last five.
      g = Math.min(gpuMs, GPU_MOST);
      // A time no longer than the page took to issue the frame is the
      // page's: the GPU did its work somewhere inside it, and how much is
      // not known. Such a time may still say that there is room (the
      // GPU's work is no more than it), never that there is none. A slow
      // processor beside a card that is fine read as a slow card in every
      // frame of a collapse.
      if (spanMs > 0 && g < spanMs * SPAN_SHARE + SPAN_SLACK) g = Math.min(g, 0.7 * Math.max(TARGET_MS, this.period));
      this.recent[this.told % 5] = g;
      this.told++;
      sample = this._median();
      this.gpu = this.gpuSamples ? this.gpu + (sample - this.gpu) * 0.15 : sample;
      this.gpuSamples++;
      // The GPU finishes well inside the believed period and frames still
      // come slowly: it is the display. (By the times told, not by the
      // estimate: after a change of resolution that is a prediction, and
      // a frame the pixels did not speed up would pass for a slow display.)
      if (this.lagFor > 1000 && sample < 0.85 * this.period) {
        if (cadence <= SLOWEST_DISPLAY) this.period = cadence;
        this.lagFor = 0;
      }
      // Leave about a third of the frame for the simulation and the browser.
      headroom = 0.7 * Math.max(TARGET_MS, this.period) / Math.max(this.gpu, 0.05);
      slow = headroom < 0.9;
      fast = headroom > 1.25;
    } else {
      if (this.probe > 0) {
        // Calibration in progress: a few frames at the lowest resolution
        // (a second and a half of them at most).
        this.probeFor += dt;
        if (--this.probe === 0 || this.probeFor > WARM_MS) {
          this.probe = 0;
          if (cadence > this.probeCadence * 0.8 && cadence <= SLOWEST_DISPLAY) {
            // No faster even with next to nothing to draw: the display sets
            // the pace. Believe it and put the resolution back.
            this.period = cadence;
            this.scale = this._setScale(scale, this.probeFrom, 0);
          }
          // Otherwise the GPU was (or still is) the limit: stay down here
          // and let the ordinary control take over.
          this.lagFor = 0;
        }
        return;
      }
      if (this.lagFor > 750) {
        if (scale > this.minScale + 1e-3 && !this.tierStep) {
          this.probe = 24;
          this.probeFor = 0;
          this.probeFrom = scale;
          this.probeCadence = cadence;
          this.scale = this._setScale(scale, this.minScale, 0);
          return;
        }
        if (cadence <= SLOWEST_DISPLAY) this.period = cadence;
        this.lagFor = 0;
      }
      // A frame well over the display's period (or over 60 Hz, on a faster
      // display) missed a refresh. One whose time went on the main thread
      // says nothing about the GPU.
      const missed = dt > 1.5 * Math.max(TARGET_MS, this.period) && !busy;
      this.missRate += ((missed ? 1 : 0) - this.missRate) * 0.08;
      slow = this.missRate > 0.25;
      fast = this.missRate < 0.03;
      sample = missed ? 1 : 0;
    }
    // Drowning: frames have taken several times their period for seconds.
    // Whatever the GPU's time says, that is slow.
    const drowned = this.drownFor > DROWN_FOR;
    if (drowned) {
      slow = true;
      fast = false;
    }
    this.sinceChange += dt;
    this.slowFor = slow ? this.slowFor + dt : 0;
    // (A late frame now and then costs some of the calm counted so far,
    // not all of it: on a slow processor there is always one.)
    this.fastFor = fast ? this.fastFor + dt : Math.max(0, this.fastFor - 4 * dt);
    if (!slow) this.floorFor = 0;
    if (this.tierStep) return; // waiting for the renderer to switch tier

    // Far over: the GPU has taken more than twice its time for a second
    // and a half (or, without a GPU time, most frames are late), or the
    // frames have been drowning. There nothing is tried and nothing is
    // taken back: every step down is taken and kept, because the one
    // thing worse than a cheap picture that did not help is a dear one at
    // three frames a second.
    this.farFor = timed && headroom < FAR_OVER ? this.farFor + dt : 0;
    const far = drowned || (timed ? this.farFor > FAR_FOR : this.missRate > LATE_FAR);
    this.far = far;
    if (this.trial && far) this.trial = 0;
    // A frame with the other kind of evidence than a trial is judged on
    // (no GPU time where it is judged on them: the frames after a menu,
    // until a time is told again) is not one of the trial's. If it stays
    // that way the measure the step was to be held to is gone, and the
    // step stands.
    if (this.trial && timed !== this.trialTimed) {
      if (++this.trialOdd <= GPU_FRESH) return;
      this.trial = 0;
    }
    if (this.trial) {
      // A step down is on trial: nothing else moves until it is judged,
      // on the middle of the times told since (a change has costs of its
      // own in the frames that follow it: programs used for the first
      // time, targets made) or, without times, on the share of late frames.
      const kind = this.trial, was = this.trialTimed, need = (kind === 2 ? 1.5 : 1) * (was ? TRIAL_MS : 2 * TRIAL_MS);
      this.trialOdd = 0;
      this.trialFor += dt;
      // (The first frames after it still report the frames before.)
      if (++this.trialSeen > (kind === 2 ? 2 : 1) * TRIAL_SKIP && this.trialN < 128) {
        if (timed) {
          // (Kept in order: the middle one is the median.)
          const m = this._samples, v = g;
          let k = this.trialN - 1;
          for (; k >= 0 && m[k] > v; k--) m[k + 1] = m[k];
          m[k + 1] = v;
        } else {
          this.trialSum += sample;
        }
        this.trialN++;
      }
      if (this.trialFor < need || this.trialN < TRIAL_FRAMES) return;
      const after = was ? this._samples[this.trialN >> 1] : this.trialSum / this.trialN;
      this.trial = 0;
      this.slowFor = 0;
      if (after > this.trialWant * this.trialBefore) {
        // It bought too little: whatever is slow, this was not what it
        // needed. Back, and not again for a while.
        if (kind === 1) {
          this.scale = this._setScale(scale, this.trialFrom, 0);
          if (timed) this.gpu = after;
          this.scaleHold = this.scaleHoldNext;
          this.scaleHoldNext = Math.min(this.scaleHoldNext * 2, 10 * SCALE_HOLD);
        } else if (kind === 2) {
          this.tierStep = 1;
          this.undoing = true;
          this.tierHold = this.tierHoldNext;
          this.tierHoldNext = Math.min(this.tierHoldNext * 2, 10 * TIER_HOLD);
        } else {
          this.thrift = this.trialFrom;
          this.thriftHold = this.thriftHoldNext;
          this.thriftHoldNext = Math.min(this.thriftHoldNext * 2, 10 * SCALE_HOLD);
        }
        return;
      }
      if (kind === 1) this.scaleHoldNext = SCALE_HOLD;
      else if (kind === 2) this.tierHoldNext = TIER_HOLD;
      else this.thriftHoldNext = SCALE_HOLD;
      if (timed) this.gpu = after;
    }

    if (this.slowFor > 400) {
      this.slowFor = 0;
      this.fastFor = 0;
      // Slowness right after a raise means the raise did not hold: undo it
      // and wait twice as long before trying again.
      const failed = this.sinceChange < 5000 ? this.raised : 0;
      if (failed === 1) this.upDelay = Math.min(this.upDelay * 2, 60000);
      if (failed === 2) this.tierDelay = Math.min(this.tierDelay * 2, 300000);
      this.raised = 0;
      // The cheap things first: two levels of them before a pixel is given
      // up, all of them when it is the geometry that costs, and the last
      // one in any case before the tier goes.
      const lower = scale > this.minScale + 1e-3 && (this.scaleHold <= 0 || far);
      const want = geometry > 1 || !lower || far ? THRIFT_MAX : THRIFT_FIRST;
      if (failed === 2) {
        this.tierStep = -1;
      } else if (this.thrift < want && (this.thriftHold <= 0 || far)) {
        // (All of it at once: one level is too little to be seen to work.)
        this.trialFrom = this.thrift;
        this.thrift = want;
        this.sinceChange = 0;
        if (!far) this._try(3, timed ? this.gpu : this.missRate, THRIFT_MUST_BUY, timed);
      } else if (lower) {
        // Pixel cost goes roughly with scale squared; aim a little under budget.
        let next = scale - 0.1;
        if (timed) next = Math.min(scale - 0.05, Math.floor(scale * Math.sqrt(headroom / 1.1) * 20) / 20);
        next = Math.max(this.minScale, next);
        // (Drowning, the GPU's time says nothing to aim by: all the way.)
        if (drowned) next = this.minScale;
        // What it has to buy: a good part of what the pixels predict
        // (with a GPU time), or most of the late frames.
        const before = timed ? this.gpu : this.missRate, pixels = (next * next) / (scale * scale);
        this.trialFrom = scale;
        scale = this._setScale(scale, next, 0);
        if (!far) this._try(1, before, timed ? 1 - PIXELS_MUST_BUY * (1 - pixels) : LATE_MUST_BUY, timed);
      } else if (canDrop && (this.tierHold <= 0 || far)) {
        // Nothing left but the tier: after 1.6 s of it, or at once when the
        // frame is nowhere near fitting (its programs are ready by then).
        this.floorFor += far || (timed && headroom < 0.6) ? 1600 : 400;
        if (this.floorFor >= 1600) {
          this.floorFor = 0;
          this.tierStep = -1;
          this.tierBefore = far ? -1 : timed ? this.gpu : this.missRate;
          this.tierTimed = timed;
        }
      }
    } else if (this.raised) {
      if (this.sinceChange > 5000) {
        // The raise held; the next one need not wait as long.
        if (this.raised === 1) this.upDelay = Math.max(3000, this.upDelay / 2);
        else this.tierDelay = Math.max(15000, this.tierDelay / 2);
        this.raised = 0;
      }
    } else if (scale < this.maxScale - 1e-3) {
      if (this.fastFor > this.upDelay && this.sinceChange > this.upDelay) {
        let next = scale + 0.1;
        if (timed) {
          // Where the pixels predict (cost with the square of the scale,
          // which errs on the safe side: not all of a frame is pixels).
          // In steps of a fifth, unless the GPU's time says that the
          // whole resolution fits with a fifth to spare: a GPU that is
          // all but idle after a bad two seconds gets its pixels back in
          // one move, not in three over a quarter of a minute.
          const fits = scale * Math.sqrt(headroom / 1.1);
          next = fits >= this.maxScale * 1.2 ? this.maxScale : Math.min(scale + 0.2, Math.floor(fits * 20 + 1e-6) / 20);
        }
        if (next > scale + 0.04) scale = this._setScale(scale, Math.min(this.maxScale, next), 1);
      }
    } else if (this.thrift > 0) {
      // Resolution is back: the cheap things return one at a time (all of
      // them where the GPU has its time nearly twice over: a level is
      // worth a twentieth of a frame).
      if (this.fastFor > this.upDelay && this.sinceChange > this.upDelay) {
        this.thrift = timed && headroom > 1.7 ? 0 : this.thrift - 1;
        this.raised = 1;
        this.sinceChange = 0;
        this.fastFor = 0;
        this.gpuSamples = Math.min(this.gpuSamples, 1);
      }
    } else if (canRaise && this.fastFor > this.tierDelay && this.sinceChange > this.tierDelay && (!timed || headroom > 1.7)) {
      this.tierStep = 1;
    }
    this.scale = Math.round(scale * 20) / 20;
  }
}

// Whether the opaque pass lays the plain list's depth first
// (renderer.depthFirst), decided on the machine the page runs on. The
// picture is the same to the pixel either way, so nothing here can be
// seen; what differs is what the GPU is asked to shade (a GPU that tests
// depth before it shades skips the walls behind a wall) against a second
// pass of the plain list's triangles, and which of the two is more no
// machine can say for another. So it is tried: frames are drawn without,
// with, without, with, without (DEPTH_BLOCKS), the GPU's time for a frame
// read in each, and it is kept only if both times it was on the GPU's time
// was below that of the block before it AND of the block after it, by a
// share that is not noise: a load that climbs or eases through the trial,
// or a blast that falls into one block of it, decides nothing. Where the
// two times disagree nothing is concluded and it is asked again soon.
// Tried again when the scene or the tier changes (reset()) and every so
// often, since a street whole and a street in ruins are not the same
// question.
//
// NOTHING HERE IS COLLECTED. The times are read from the renderer's own
// timer, held in this object for the second a trial lasts and dropped;
// they are not stored, not logged, not sent, and not put in any report.
// The owner has not agreed to a performance report and this is not one:
// keep it so.
// Frames drawn after a reset before the first trial (nothing is concluded
// from the first frames of a scene or of a tier).
const DEPTH_SETTLE = 120;
// Frames drawn after anything else moved the GPU's time (the scaler's
// resolution, thrift, a rest) before a trial starts.
const DEPTH_CALM = 20;
const DEPTH_BLOCKS = 5;
// Of each block, the first times are not read (the first use of a program
// compiles it) and this many are; a block that has not had them in this
// many frames gives the trial up.
const DEPTH_SKIP = 1;
const DEPTH_TAKE = 6;
const DEPTH_BLOCK_MOST = 120;
// The GPU's time must fall by this share, and by this much (the timer's
// own grain is a tenth of a millisecond), for the depth to be laid first;
// by a larger share where the time is the fence's estimate, which is
// coarser.
const DEPTH_MUST_BUY = 0.03;
const DEPTH_MUST_BUY_COARSE = 0.07;
const DEPTH_LEAST_MS = 0.15;
// And by this many times what the scatter of the times themselves leaves
// unsure of a block's middle: where frames differ from one another by more
// than the depth could buy, nothing is concluded.
const DEPTH_SURE = 3;
// Frames drawn between a trial and the next; after one that concluded
// nothing.
const DEPTH_AGAIN = 1800;
const DEPTH_SOON = 300;

function median(a) {
  const s = a.slice().sort((x, y) => x - y), n = s.length;
  return n & 1 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

// How far off a block's median may be, squared: from the middle half of
// its times' distances to it (1.86 = 1.2533 * 1.4826: a median's error
// from a median distance, were the times bell-shaped).
function unsure2(a, mid) {
  const d = median(a.map((v) => Math.abs(v - mid))) * 1.86;
  return d * d / a.length;
}

export class DepthTrial {
  constructor() {
    this.trials = 0;
    this.reset();
  }

  // The scene or the tier changed: off, and decided again.
  reset() {
    this.on = false;
    // '' until a trial has ended; then 'first' or 'last' (the readout's word).
    this.verdict = '';
    this.block = -1;
    this.wait = DEPTH_SETTLE;
    this._times = [];
    this._meds = [];
    this._unsure = [];
    this._skip = 0;
    this._frames = 0;
  }

  _open() {
    this._times.length = 0;
    this._skip = DEPTH_SKIP;
    this._frames = 0;
  }

  _giveUp(wait) {
    this.block = -1;
    this.wait = Math.max(this.wait, wait);
  }

  // Once before each frame is drawn. steady: nothing else that moves the
  // GPU's time has changed since the last frame (resolution, thrift, tier,
  // a rest, a trial of the scaler's own). canTry: a trial may start now
  // (there is a GPU time and it is news; where it is only the fence's,
  // frames are being missed for the GPU). Returns whether this frame lays
  // the depth first.
  frame(steady, canTry) {
    if (this.block < 0) {
      if (!steady) { this.wait = Math.max(this.wait, DEPTH_CALM); return this.on; }
      if (this.wait > 0) { this.wait--; return this.on; }
      if (!canTry) return this.on;
      this.block = 0;
      this._meds.length = 0;
      this._unsure.length = 0;
      this._open();
    } else if (!steady) {
      this._giveUp(DEPTH_CALM);
      return this.on;
    } else if (++this._frames > DEPTH_BLOCK_MOST) {
      this._giveUp(DEPTH_AGAIN);
      return this.on;
    }
    return (this.block & 1) === 1;
  }

  // The GPU's time for a frame, when it is told. first: whether that frame
  // laid the depth first. coarse: the time is the fence's estimate.
  sample(ms, first, coarse = false) {
    if (this.block < 0 || !(ms >= 0) || first !== ((this.block & 1) === 1)) return;
    if (this._skip > 0) { this._skip--; return; }
    this._times.push(ms);
    if (this._times.length < DEPTH_TAKE) return;
    const mid = median(this._times);
    this._meds.push(mid);
    this._unsure.push(unsure2(this._times, mid));
    if (++this.block < DEPTH_BLOCKS) { this._open(); return; }
    const m = this._meds, u = this._unsure, must = coarse ? DEPTH_MUST_BUY_COARSE : DEPTH_MUST_BUY;
    // (With, at block i, under the block without at j.)
    const under = (i, j) => m[j] - m[i] >= Math.max(m[j] * must, DEPTH_LEAST_MS, DEPTH_SURE * Math.sqrt(u[i] + u[j]));
    const buys = (i) => under(i, i - 1) && under(i, i + 1);
    const one = buys(1), two = buys(3);
    this.trials++;
    this.block = -1;
    if (one === two) {
      this.on = one;
      this.verdict = one ? 'first' : 'last';
      this.wait = DEPTH_AGAIN;
    } else {
      this.wait = DEPTH_SOON;
    }
    this._times.length = 0;
    this._meds.length = 0;
    this._unsure.length = 0;
  }
}

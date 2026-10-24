# Globes on jez237.com

Original: https://github.com/willwaltz/globes
Author: Will Waltz · MIT License
Upstream commit: 93c3b814bbca53463e8207b8e3c95fca8940dff5
Imported: 2026-10-22 · Hosting build: 1.14.0
Public routes: https://jez237.com/demos/globes/ (the five original globes) and
https://jez237.com/demos/betta-bowl/ (the **Living Silk** betta bowl, on its own)

The upstream source and MIT attribution are retained. Hosting adds the gallery
return link, clearer WebGPU messages, and the **Living Silk** betta bowl, built from
the same source as a page of its own (`betta.html`). The five original scenes and
their solver quality defaults are preserved. Fonts and runtime dependencies are
local; the betta uses its existing immutable R2 texture references (not newly
generated art).

## Living Silk — Betta Atelier integration

Direct link: https://jez237.com/demos/betta-bowl/ (`../globes/?globe=betta`, the
link before 1.12, is sent there). A desktop launch into this scene defaults to a
64³ water grid and one ray per pixel (60 fps observed on the host Radeon 8060S
at 1200×900, versus 11 fps at the original 128³/four-ray setting). Phones retain
the original 48³ default; this is touch-emulated layout validation, not a physical
phone benchmark. Explicit `?res=128&aa=4` overrides remain available. Switching
scenes keeps the grid chosen at startup, as in the upstream application.

The specimen is imported from
`../betta-atelier/src/fish.js` with optional compact tessellation. It keeps the
shared anatomy, breathing, one-second flare and synchronized gaze, with the
full-fin compliance and head-led turning revision described below.
The Atelier's normal tessellation is unchanged. The standalone compiled demo was
rebuilt as Atelier 1.10 to adopt the shared motion and shader changes (see its
README).

`src/fish/Betta.ts` evaluates the same vertex deformations on the CPU, refits a
stackless triangle BVH, and uploads it to an RGBA32F texture. `bettaWGSL.ts`
intersects the actual volumetric surfaces **after glass/water refraction**, with
sand/water occlusion and translucent fin continuation. It is not a billboard or
a WebGL canvas overlaid on the globe. A compact atlas reuses the existing skin,
caudal and macro photographs; it does not publish a new copy of those assets.

The water starts still. Sixteen solver probes supply the water velocity used by
the membrane drag and swimming-effort model. The specimen is now 42% of the
original integration's linear size (`0.105` versus `0.25` model-to-globe scale).
`bettaSwim.mjs` chooses destinations throughout the usable water volume, with
slow cruises, short bursts, coasting and quiet hovering. Acceleration-limited
heading and shallow pitch keep translation aligned with the nose; actual yaw
rate drives the shared body/fin bend. Look-ahead steering avoids the glass.

Version 1.4 removes the continuous positional pin over the inner half of each
broad fin. Radial segments still resist stretching; reduced cross-ray shear,
gentler pose springs and distributed billowing let the proximal/middle membrane
bend under water pressure as well as the fringe. Display increases tension and
transports existing folds with the one-second rest-fan opening; it does not erase
flow-driven deformation. The paired-fin flank guard uses the curved local normal.

Version 1.5 pulls the broad-fin compliance back from 1.4, which over-corrected:
cross-ray shear/bend constants are about 0.45/0.15/0.15/0.075, billowing is
`0.05 + drive*0.095`, turn-sweep is `0.30*turnBend*v`, and stiffness rises toward
the root (`3.8 + 36*(1-v)^2.4`, plus a display-flare term). The root third now
holds its shape under swimming load while the free edge still lags and flutters;
pectoral/other fins (kind ≥ 3) are unchanged.

The 1.5 realism pass is in the ray tracer, not the animation. Each triangle's
fin `(u,v)` is stored in a one-texel-per-triangle side table appended after the
triangle block (the 4-texel triangle stride is unchanged; height uses
`order.length*5`). The shader uses it for:
- **Fin rays**: fine ridges plus branching ray splits near the fringe, faded by
  the actual pixel footprint so zoomed-out views do not shimmer.
- **Translucent fins**: light passes through the membrane tinted by the fin hue,
  more clear toward the fringe, with a lit back-face glow when the sun is behind.
- **Sun occlusion**: up to four membrane hits darken a point by the fin hue, so
  the body sits in the tinted shadow of its own dorsal/anal fins; skin and eye
  block fully.
- **Cast shadow on the sand**: a four-tap soft shadow of the whole fish. From
  the near-overhead sun it is a thin sliver in side views; that is physical.
- **Skin**: a restrained sheen and thin-film colour shift on scale tiles.
These are rendering approximations, not a spectral or subsurface model. Desktop
default (64³, one ray) still measured 60 fps on the host at 1200×900.

Version 1.6 adds the betta's **surface air gulp** (bettas are labyrinth fish and
really do take air at the surface). `bettaWater.mjs` reads the water surface under
the snout from an eight-probe vertical density column (probe slots 16-23 of the
64-probe fluid sensor, 0.016 globe units apart, centred on the resting level;
slots 16+ are otherwise unused in this scene) and interpolates where the density
crosses the sim's `iso`. It returns null with no crossing, so a missing or
disturbed reading never triggers anything. `bettaSwim.mjs` then runs an
independent `rise -> gulp -> dive` cycle: the first trip comes 22-36 s after
load, later ones every 60-110 s, from its own random stream, so existing routes
are unchanged. A trip starts only while the globe is upright (effective gravity
within ~10 degrees of vertical), the measured surface is within 0.04 of the sim's
level (calm, not sloshing), the whole body is wet, the betta is not bursting or
turning sharply, and aborts to a dive if any of that is lost. The fish rises with
its lips held ~3 mm under the measured surface and pitches to ~0.85 rad (~49
degrees nose-up); the Atelier then opens the mouth (`gulp`) and pulses the gill
cover (`gulpGill`) for 1.6 s before it dives. These host-driven values override
the breathing rhythm only while larger. Limits: trips happen
only in an upright globe; the surface is read once per frame with the sim's 1-2
frame readback delay, so the lip height is held to within ~3 mm, not exactly.

Version 1.7 adds four realism behaviours (Atelier 1.9 shares the fin changes):
- **Attached pelvic feelers.** The two ventral feelers are rooted at a computed
  belly insertion point and solved with extra constraint passes, so they read as
  attached in every pose (`pelvicInsertion` in `../betta-atelier/src/fish.js`).
- **Gulp ripples and bubbles.** The fish makes a small, bounded push into the
  water (the coupling was one-way before). `Betta.takeDisturbance()` reports it once
  per frame; `main.ts` forwards it to `FluidSim.push(at, speed, radius)` (a downward
  Gaussian velocity delta in `grid_update.wgsl`'s `fishPush`, capped at
  `MAX_PUSH = 0.15`) and to `Splash.emit(...)`, a new `spEmit` kernel that spawns
  bubbles. While its lip is within 0.03 of the film, the first 0.34 s of the gulp
  dimples the surface (about 10 mm, with a ring ripple). On the dive, while the dive
  timer is above 0.55, bubbles leave the lip at 14 per second (about ten). The fish
  senses the push only through its existing flow probes, and the jolt reference
  smoothing keeps it from startling at its own ripple.
- **Hover sculling.** `hover`, `surface` and `gulp` modes drive continuous alternating
  pectoral fanning (`SCULL_HZ = 3.8` in `swim-gait.js`).
- **Startle response.** A sudden flow or rotation change (jolt, measured against a
  1.5 /s-smoothed reference so steady swirling does not trigger it) above
  `STARTLE_JOLT = 1.25`, at most once per 10 s, starts a 0.9 s `startle`: a C-bend
  away from the disturbance, a dart at about 4x cruise speed, pectorals tucked,
  then a glide. A startle within 0.1 of the film also dives and releases about
  fourteen bubbles in its first 0.4 s. It sets a heading target and the voluntary
  `steerRate`, so head-led turn history and the separation of passive spin from
  deliberate turning are preserved. Idle water reads 0, a gentle drag ~0.4, a brisk
  swipe ~1.3 and a flick above 2.

Frame time was unchanged: interleaved old/new Chrome WebGPU runs at 64³, one ray,
1200×900 gave 58-60 fps in idle, full-gulp and strong-flick windows for both builds.

Version 1.8 adds three behaviours and animated caustics (Atelier 1.10 shares the poses):
- **Mirror display.** Every minute or two, at the end of a leg near the glass, it swims
  to the wall, faces its reflection obliquely and flares its fins for 5-8 s
  (`mirror` in `src/fish/bettaSwim.mjs`; `Betta.ts` turns `swim.flaring` into the display
  request). The globe renders no true reflection of the fish; the behaviour implies one.
- **Inspection lap.** A slow circuit of the globe (about 1.5-2.5 turns of arc at
  `LAP_SPEED = 0.058`) in one direction, with a gentle vertical drift.
- **Resting on the sand.** It sinks to the measured sand height plus `REST_HEIGHT` and
  holds for 7-14 s with its fins easy, if it is near the middle of the bowl.
- All three use their own seeded random stream and start only in measured, upright, wet
  water with no gulp due soon; a startle, a flow knock or air above ends them early.
  Cooldowns are 60-120 s (mirror), 120-200 s (lap) and 70-130 s (rest).
- **Caustics.** `betta_dapple` (`bettaWGSL.ts`) projects each shaded point up the sun
  direction to the surface and sums seven faint plane-wave ripples, giving a moving web of
  bright and dark lines on the fish's skin and fins, with ambient light modulated a
  little as well. The sand shader applies the same function while the betta is active, so
  the sand under and around it matches in both render passes. It is analytic: the
  simulated surface is flat in this globe's idle, so the real light volume has no caustic
  structure to show; where the volume has structure (tilting, gulp ripples) the analytic
  term fades out and the simulated light is used.
- Frame time: interleaved old/new Chrome WebGPU runs at 64³, one ray, with frame-rate
  limit off: about 82-87 fps at 1200×900 for both builds (idle and flick windows), and
  about 4-7 fps lower at 1920×1440 (roughly +1 ms per frame, 56-64 fps against 61-63).

Limits: the push and bubbles are artistic, not a coupled free-surface solver; the
Firefox check confirmed the new sim kernels compile under naga, with the betta itself
checked on the published site.

Version 1.9 (Atelier 1.11) makes the fish move only by swimming, and stops it chasing its tail:
- **Stroke-limited speed.** `SwimGait.stroke` goes back into `BettaSwim.advance(..., stroke)`;
  speed can rise by at most `STROKE_ACCEL = 1.1` x stroke per second. Slowing is drag and is not
  limited. With no stroke reading (tests, a bare sim) there is no limit.
- **Every move is along the body axis.** The hold at the film and the rest descent used to slide
  the fish up and down while the tail was easy. The rise now creeps up the last millimetres on
  the fins, the lips are trimmed by head tilt alone (`pitchForMouth`), the descent to the sand is
  a nose-down swim, and the dive does not start its speed until the head has tipped over
  (`smooth(0.1, -0.25, pitch)`). The old dive lunged up the water column while still nose-up.
- **Gravity only for a fish that is out of the water.** It was applied in proportion to dryness,
  so a tail that briefly cleared the film during the dive pitch-over shoved the whole fish down.
  It is now `smooth(0.35, 0.9, dryness)`.
- **No goals it can only circle.** `chooseTarget` rejects goals closer than `MIN_LEG = 0.22` in
  plan or steeper than `MAX_SLOPE = 0.32`; the heading error fades as the goal gets nearer in
  plan (`smooth(0.03, 0.12, ...)`) and a goal counts as reached when passed over. A failsafe
  (`yawAccum`, 6 s decay, `SPIN_LIMIT = 1.6 pi`) abandons any goal it still turns about.
- Headless numbers, 8 seeds x 600 s with a gulp trip every ~10 s: unexplained movement (faster
  than its strongest recent stroke could drive) 0.00% in every mode (old: 37% burst, 11% rise,
  8% dive); sideways slip 0.00% (old: 46% gulp, 30% rest). Net turn in any 8 s window: under 1
  revolution in calm and turbulent water (old: 2.8-3.3). Tests: `node --test betta-swim.test.mjs`
  runs 23 locomotion tests (16 before).

Version 1.10 (Atelier unchanged) makes the pointer follow-through quicker when you hold and
move the globe:
- **Stiffer grab spring.** While held, the globe follows the hand through a critically damped
  spring at 26 rad/s (was 12 rad/s), so it trails a steady drag by about 77 ms instead of 160 ms.
  Container acceleration is still capped at 3 g, which bounds how hard a quick flick can slosh the
  water; a sweep measured the same ~3 g side acceleration ceiling and a lower peak solver speed
  than before (17.9 vs 20.5).
- **Quicker custom cursor.** The software ring follows at rate 40 (was 24). A drawn cursor can
  only move once per rendered frame, so if frames stay slower than ~34 ms for a second the system
  pointer takes over (`html.custom-cursor` is removed), and the drawn one returns after three
  seconds of quick frames.
- **Adaptive sharpness** (`src/app/adaptiveScale.mjs`, `?adapt=0` turns it off). Frame time
  scales with canvas pixels, so on hi-dpi or large windows the canvas drops 0.8x per level (to a
  floor of 0.6 px per CSS px, at most 5 levels) when frames average over 22 ms, in jumps of 1-3
  levels depending on how slow. A step that does not make frames at least 8% quicker (the screen
  itself is the limit) is taken back and held for 64 s; sharpness is offered back after 8 s of
  quick frames, and a failed offer doubles the wait. Tests: `node --test adaptive-scale.test.mjs`.
- Measured on the loaded host (Chrome WebGPU, real mouse drag): 1080p at 1x, lag behind the hand
  p50 147 to 59 ms, p95 205 to 90 ms at ~54 fps; 1440p at 2x, 25.8 to ~40 fps and lag 114/203 to
  ~51/90 ms (p50/p95), with the canvas settling at 2100-2600 px wide.
- Limits: numbers are from a shared, loaded machine; Firefox and a physical phone were not
  re-measured; a quick flick sloshes a little more than before (still capped).


The neck now leads the route, instead of rotating about the center of the fish.
`BodyMotion.advanceTurn()` carries a history of local tangent angles down the
trunk: the rear keeps the old direction while the head changes course, then
uncoils progressively. This is a reduced-order head-following approximation,
informed by the original koi's chain, not a verbatim copy of that chain.
Integrated centerline length is preserved, local curvature is limited to prevent
a hinge behind the skull, and sharp maneuvers can reach a 2.95-radian (~169°)
head-to-tail change. That is an animation limit, not a measured biological angle.
Ordinary destinations favor ahead-of-head exploration, with occasional reversals;
explicit sharp-turn steering has a bounded acceleration and a separate rate
limit. Only voluntary `steerRate` enters the muscle history. Fluid rotation still
drives actual pose/relative drag but cannot alone trigger a muscular U-turn.

`bettaWater.mjs` samples sixteen **anatomically attached 3D probes**, including
the trunk, back, tail, forward clearance and both flanks. The full solver current
drives whole-fish translation with the koi's 0.9-second added-mass lag and finite
station-keeping drag; the former 0.075-per-axis drift cap is removed. A
least-squares fit to differences in velocity across the wet probes supplies
water-driven yaw, pitch and roll. Uniform flow does not invent spin; opposing
shear can rotate the body even with zero mean flow. Righting and steering recover
as the disturbance subsides. There is no procedural turbulence/wobble source.

The fixed resting-water-height clamp is also removed. Wetness and upper
probes request escape toward the water's actual centroid; partial exposure adds
effective gravity, as for the koi. The animated silhouette is constrained against
the spherical glass and sampled sand bed, not an invisible horizontal ceiling.
The shared fin solver uses full 3D body-relative fluid velocity and angular
motion while pitching/rolling, so transported water does not create false drag.
The Atelier accepts optional host-owned `locomotion`
(position/velocity/speed in model units, heading/pitch/roll in radians, angularVelocity/steerRate,
drive and mode); without it the standalone choreography still runs. The shared
solver source includes the flexibility changes; the standalone published bundle
adopted them in Atelier 1.8.
This is an artistic coupling, not a fully coupled
fish/fluid solver or instantaneous collision against every turbulent wave. The
betta does not eat the Koi scene's food. The **Flare fins / Relax fins** button controls the display; each opening
takes one second, with partly open fins in the resting pose.

Checks: `node --test bvh.test.mjs betta-swim.test.mjs betta-water.test.mjs betta-flex.test.mjs`, `node --test
../betta-atelier/fin-dynamics.test.mjs`, `npm run build`, and real WebGPU browser
checks of the betta, scene switching, current/tilt response and phone layout.
The locomotion tests cover multi-minute 3D exploration, bounded nose-led travel,
rest/burst variation, frame-rate independence, pause and strong reversing flow.
Water tests separately cover uniform translation, three-axis differential flow,
partial wetness, actual bed readings, stronger inertial transport, reversal,
recovery, free vertical slosh and violent-flow containment. Browser QA uses real
pointer-driven water agitation, compares the previous release's response, and
checks animated vertex clearance, fin attachment, flare controls and phone layout.
The flexibility checks measure quarter-span and mid-span response, both signs of
near-U flexion, arc length/curvature bounds, release without snapping, frame-rate
independence and separation of passive spin from deliberate turning. Inspect
actual WebGPU side/overhead turn sequences as well as scalar checks; fin-to-fin
self-collision is still approximate, not a full cloth/contact solver.
Use `npm run web -- --host 127.0.0.1` for browser development (`npm run dev` starts
Electron). `?qa` exposes the same local inspection object as a dev build.
Version 1.11 (Atelier 1.12) stops the pectoral fins changing size when the swim mode changes:
- The startle tuck is a soft spring and a gentler fold, and the fin's beat power and cadence
  follow slow filtered copies of the tail's effort (`pectoralEffort`, `pectoralScull`) instead
  of the tail itself. See Atelier 1.12 in `../betta-atelier/README.md` for the numbers.
- Headless replay of the live 1.10 behaviour (56 mode changes): worst fin-size jump 0.18 to 0.055
  of rest area; cruise to startle +0.09..0.18 to under 0.015. Synthetic chain on the real fin
  geometry: 0.21 to 0.03.
- Limits: the glide-to-hover change that remains (0.04-0.05) is the trunk straightening after a
  turn; the startle fold is now subtle rather than a dramatic tuck.

Version 1.12 (Atelier unchanged) makes the betta's globe a real betta bowl, with a lid that comes
off, and gives it a page of its own:
- **Its own page.** `betta.html` (`<html data-globes="betta">`) shows the betta alone, and
  `index.html` the five original globes (`src/app/catalog.ts`). `npm run build:betta` builds it as a
  standalone folder (`dist-betta/index.html` and its assets) for `demos/betta-bowl/`. Each page
  builds only its own globe shaders before the first frame (`GlobeView.precompile`'s variants),
  so the bowl starts sooner and the globes' page no longer builds the betta's.
- **An open mouth** (`src/render/bowl.ts`). The glass is cut off at 0.88 along the globe's axis
  (a mouth ~11 cm across on the ~24 cm bowl), and a rolled bead of glass (a torus, ~2 mm tube)
  runs round it. The bowl variant of the globe shader (`bowlEntryWGSL`, `bowlTraceWGSL` in
  `shaders.ts`; the other globes' shaders are unchanged) lets rays in and out of the mouth with no
  glass and hands them on to the bead and the lid.
- **The lid**, solid glass ~3.8 mm thick with a bullnose edge, a mushroom knob, eight 3 mm air
  vents (a betta breathes at the surface) and a collar under it that drops into the mouth so it
  cannot slide off. The bead and the lid are marched as distance fields and refract, reflect and
  absorb like the bowl's own glass, with total internal reflection inside them (the edges carry
  light round and read darker, as thick glass does). Its geometry is a sphere grown to take in the
  lid wherever it is; pixels where a ray meets none of the bowl are left to the backdrop
  (`maskNode`).
- **Lift lid / Replace lid** (1.12 only: see 1.13) (or a click on the lid, or on the open mouth). It came off only from
  an upright bowl: it rises until its collar clears the mouth, then is carried up and away out of
  sight (`src/interaction/BowlLid.ts`, 2.6 s). While it is off, the bowl tips at most 25 degrees
  (`GlobeController.tiltLimit`): from ~47 degrees the water would pour out of the mouth.
- **The water stays in.** `FluidSim.mouth` holds the particles under a plane at 0.85 along the
  globe's axis (`g2p.wgsl`), as under the lid and its collar, treated like the glass.
- **Development.** The betta's R2 textures allow only `https://jez237.com` (CORS), so
  `npm run web` serves them through the dev server (`vite.config.ts`). A copy of the page on any
  other site (Hidden Reef included) would load the bowl but not the fish's textures unless R2's
  CORS allows that origin, or the page is embedded from jez237.com.
- Measured in Chrome WebGPU on the RTX 5090 host: 60 fps (the display's limit) with the lid on,
  coming off and going back on. Limits: the lid casts no shadow or caustic of its own into the
  water, the spray above the water still meets the glass's whole sphere, and the lid is not
  physically simulated (it is carried on a fixed path).

Version 1.13 (Atelier unchanged) makes feeding the only reason the lid comes off, and feeds the fish:
- **Feed** (or a click on the lid) replaces Lift lid / Replace lid. The solver cannot let water
  leave the bowl, so instead of a realistic spill an open bowl is never moved: `Feeding.ts` locks
  the bowl (`GlobeController.locked`: no hold starts, one under way is let go) and waits for it to
  stand still (`GlobeController.settled`), lifts the lid (2.2 s), lets four pellets go one at a time
  through the mouth, and puts the lid back on 1.8 s after the last is eaten, or after 30 s
  whatever is left. The bowl is freed once the lid is seated. **Close lid** ends it early. The 1.12
  tilt limit for an open bowl is gone (it can no longer be tipped open).
- **Pellets** (`FishFood.pellets`, the betta's page only): ~1 mm reddish-brown balls that fall
  through the air, dimple the film where they land (`FluidSim.push`), float held at the film (the
  water's density at their centre kept at the surface's level) and are carried along it, kept
  within 0.72 of the axis, and sink after 45-90 s. The koi and reef globes keep their flakes; the
  pellet shading is compiled into the bowl's shader only (`foodWGSL(round)`).
- **The betta eats** (`Betta` is now a `Feeder`; `feed` mode in `bettaSwim.mjs`): it takes a
  pellet off the film from below as bettas do, lining up under the film a rise's length short of
  it (`FEED_RISE` ground per unit of height), turning to it, then rising lips first with the head
  tipped up, and sucks it in from 5.5 mm. A strike that ends at the film without it is a miss: it
  drops back and comes round again. Swallowing it holds still; then it tips down off the film.
- Tests: `node --test betta-swim.test.mjs` adds a feeding test (24 in all): three seeds reach a
  pellet on the film lips first without the lips breaking the surface, swallow, and leave off. A
  headless sweep of 80 seeds and pellet spots reached every pellet (median 6.0 s from anywhere in
  the bowl, slowest 9.3 s) with no breach. In the browser (manual stepping) the whole cycle ran:
  lid off, four pellets in, all eaten, lid back on, bowl free.

Version 1.14 (Atelier unchanged) furnishes the bowl (`src/render/bowlScape.ts`, compiled into the
bowl's shader only; the other globes' shaders are unchanged):
- **Gravel, as interactive as the sand.** The bed is river gravel (~5 mm pebbles with smaller ones
  between them, a shallower bed than the sand's: `GRAVEL.level`). It flows exactly as the sand
  does (the same solver and settings), and the pebbles go with it: `FluidSim.gravel` keeps, for
  each column of the bed, how far its surface's pebbles have been carried from where they lay at
  rest (`gravel_gather.wgsl` adds up the flow each sand substep, `gravel_drift.wgsl` carries the
  offsets along it, semi-Lagrangian; `gravel_carry.wgsl` turns them with the glass). The sand
  texture publishes them (`sand_extend.wgsl`, its b and a), and the shader draws each pebble where
  the flow has taken it: tip the bowl and the pebbles visibly slide downhill and pile up. Pebbles are
  2D cells across the bed with a rounded top, a lean of their own and dark crevices between them,
  shaded by the plant's and the leaf's shadows and the caustics; those against the glass are drawn
  there too.
- **Driftwood and anubias.** A bark-textured branch with a side branch, an anubias rhizome along it
  and eleven broad leaves on stalks (round cones, capsules and curved blades, traced exactly). They
  cast shadows on the gravel and darken it where the wood touches it.
- **An Indian almond leaf** floats on the water (`src/interaction/BowlLife.ts`): columns of density
  probes under it find the film's height and slope, so it bobs and tilts with the surface; it is
  carried by the water at the film and slowly drawn to the glass by the meniscus, where it turns to
  lie along it, as a floating leaf does.
- **The bubble nest** on the glass at the waterline (front right, turning with the bowl): up to
  170 small bubbles in two layers, thin-film tinted with a glint. A gentle tilt leaves it be; a hard
  shake breaks it up (bubbles lost for each rad/s the bowl turns faster than 1.2). The betta rebuilds
  it: each trip to the film for air adds bubbles, and it goes up sooner while the nest is broken
  (`bettaSwim.mjs gulpUrge`).
- **The fish swims round the wood** (`bettaSwim.mjs` obstacles): it does not choose a place to go,
  rest or display that the wood blocks, steers off it when near, and its body is held out of the
  wood's core.
- Tests: `node --test betta-swim.test.mjs` adds an obstacle test (25 in all). In the browser
  (manual stepping): after a 57 degree tilt the pebbles have been carried up to 0.6-0.8 of a world
  unit where the bed slid, the leaf drifts to the glass, the nest keeps 142 of its 145 bubbles
  through a gentle tilt and 86 through a hard 3 s shake. Limits: the leaf and nest are drawn, not
  simulated as particles (they follow the probed surface); the wood and plant do not move.
- Measured with GPU timestamps on the RTX 5090 host: the first gravel (3D cells and noise) cost
  ~8 ms a frame; as 2D cells with no noise its cost is lost in the frame-to-frame variation of the
  shared GPU. The other globes' pages are unchanged.

## Browser compatibility

Firefox compiles WGSL with naga, which is stricter than Chrome's Tint. Builds up to
1.6.0 failed there with `Abstract types may only appear in constant expressions` in
the Koi `koi_map` function, because upstream called `mix()` with only literal
arguments (`mix(0.0045, 0.0025, 0.5)`); naga cannot constant-fold `mix`, so the
abstract result reached a runtime expression. It is now the literal `0.0035`, the
identical value. Keep all-literal builtin calls (`mix`, `pow`, `smoothstep`, ...) out
of runtime WGSL. Verified by driving stock Firefox 158 with WebGPU enabled
(`geckodriver`) through all six scenes: no validation errors, and the scenes render.
A cold first load there compiles shaders for roughly 30-60 s, so the loading
screen lingers. This is a Firefox pipeline-compile cost, not a hang.

When the globes cannot start, the page shows a calm notice over the loading backdrop,
never the raw browser error (the full error stays in the console as
`[globes] could not start:`). `classifyFailure()` in `src/gpu/device.ts` picks one of
four notices: `no-webgpu` (no `navigator.gpu`; no retry button), `no-gpu` (no adapter or
the device could not be created), `shader` (the browser's WebGPU rejected generated
WGSL or a pipeline, matched by message), and `other`. The splash carries
`data-problem` for QA. Checked in Chrome by faking each failure at the WebGPU API, and
in stock Firefox 158 with `dom.webgpu.enabled` off, which is the real no-WebGPU case.

The separate willwaltz/webgpu-ray-tracing project is an optional experimental
browser patch, not a site dependency. No custom browser is installed or required.

## Rebuild

Node >=22.12 is required. In this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
rsync -a --delete dist/ ../../demos/globes/
cp LICENSE ../../demos/globes/LICENSE
cp node_modules/three/LICENSE ../../demos/globes/THREE-LICENSE.txt
cp node_modules/@fontsource-variable/inter/LICENSE ../../demos/globes/INTER-LICENSE.txt
npm run build:betta
rsync -a --delete dist-betta/ ../../demos/betta-bowl/
cp LICENSE ../../demos/betta-bowl/LICENSE
cp node_modules/three/LICENSE ../../demos/betta-bowl/THREE-LICENSE.txt
cp node_modules/@fontsource-variable/inter/LICENSE ../../demos/betta-bowl/INTER-LICENSE.txt
```

Then regenerate the gallery from the repository root with
`node scripts/build-demos.mjs`. Preserve `docs/images/hero.jpg` credit: the
catalog preview is an original project screenshot, not a locally generated image.

Use the site's guarded full-site publisher from a complete clean publishing
checkout. Sparse task checkouts are editing-only.

## Controls and requirements

Drag to tilt, Ctrl+drag to spin, scroll/pinch to zoom, arrows to change scenes,
right-click on Koi or Anemone Reef to drop food. WebGPU and a fast GPU are required.
The original automatically selects a 48-cubed grid for small coarse-pointer
screens, compared with 128-cubed on desktop. `?res=48&aa=1` explicitly selects a
lighter desktop run without changing defaults.

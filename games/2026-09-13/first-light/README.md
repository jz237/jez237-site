# First Light: Keystone Waters

An immersive freshwater angling sim for the browser, set on real Pennsylvania water. **This build (v0.6.0, watch demo)** is Lake Nockamixon's Three Mile Run cove at first light from a fishing kayak: the lake renderer, sky, clock, weather, shoreline and interactive surface from the v0.1.0 water slice, plus a rod in your hands, three rigs, a charge-and-release cast, line physics, lures that behave as their kinds do, a camera that follows the lure under the surface, and the first fish: eleven largemouth living on the cover with their own minds, a bite you have to set, a fight you can lose two ways, and a catch card at the end (see `CONCEPT.md` and `SPEC.md`).

Live: `https://jez237.com/games/2026-09-13/first-light/`

## Play

Press **Paddle out**. Drag the scene to look around. **Hold the mouse button** (still, for a moment) to load the rod and **release** to cast where you are looking; **Space** reels, **F** twitches the rod, **Tab** changes rig (finesse worm, topwater walker, squarebill), **C** follows the lure underwater while you work it and returns you to the seat. When a fish takes, set the hook with **F** or by reeling; during the fight **Space** reels, **A / D** put side pressure on, **W** lifts the rod and **S** bows to a jump. **W / S** paddle, **A / D** turn, **X** drops or lifts the anchor, **P** puts the polarized lenses on, **T** cycles the time rate (real, 1×, 4×, 12×), **1 / 2 / 3** skip to dawn, dusk or night, **Esc** opens the menu; right-click tosses a pebble. Phones get hold buttons for paddle, turn, reel and cast (hold to load, release to throw), tap buttons for twitch, anchor, lenses, rig and menu, and drag-to-look; gamepads use the left stick to paddle and turn, the right stick to look, LT to load and release a cast, RT to reel, RB to twitch, A for anchor, X for lenses, Start for the menu.

The menu has graphics tiers (Adaptive, High, Medium, Low, Saver at 30 fps for phones), the time rate, a weather preset (calm dawn, light breeze, overcast, rain), a Steady camera option that damps the kayak's pitch and roll (also on automatically under `prefers-reduced-motion`), and a field-of-view slider. The hour slider and skip buttons live on the HUD.

## Casting and retrieving (v0.2.0)

- **Tackle chain** (`tackle.js`): rods, reels, lines and lures with real ratings; the weakest link (line test, drag setting, leader, rod class) is shown on the HUD and a lure outside the rod's weight range casts short.
- **Cast** (`angling.js`): power loads over 1.3 s; release throws the lure on a ballistic arc with quadratic drag and wind toward the reticle; splashdown stamps the surface impulses and the ripple field. About 28 m at full power on the finesse rig.
- **Line** (`line.js`): a 24-node Verlet chain from the bending rod tip; air nodes sag, submerged nodes drag and rise or sink with the line type, and the lure node floats, sinks at its rate, or dives to a target depth on the retrieve. Tension is how taut the chain is. The line is drawn as a camera-facing ribbon, so the underwater part refracts through the surface.
- **Lures**: the walker zigzags on top with each twitch, the Texas-rigged worm sinks and hops off the bottom, the squarebill dives while reeling and floats up at rest.
- **Technique recognizer** (`technique.js`): a three-second window over reeling and twitches names what you are doing (straight retrieve, slow roll, stop & go, twitching, lift & drop, walking the dog, dead stick).

## Watch Demo (v0.6.0)

**Watch Ray fish** on the menu (or leave the menu idle for 75 s) starts a self-playing episode with the real simulation and the player's own input path (`demo.js`). The angler brain scores the cove's cover against the light, distance and what it has already tried, picks a rig and a named technique, and says why in a caption ("Low light and calm water. Walking the walker over the weed bed."). It paddles to the spot, anchors, aims and casts, works the lure with a technique executor (reel and twitch patterns with human jitter, which the recognizer reads back as the intended technique), sets the hook a beat after the take, fights with a reaction delay (bows to jumps, leans on runs), releases, and moves on after refusals or a quiet spell. The director cuts to the lure cam when a fish follows, slows time for a jump and holds the hero shot on a landing; a governor runs the clock forward through quiet stretches. Press any key or tap to take the rod with the fish, tackle and spot as they are. The episode report (`__FIRST_LIGHT.demoReport()`) lists casts, encounters, strikes, landed and lost fish, every decision with its reason, and which shot covered each event. First headless episode: a fish inspected on the lure cam, a slow-motion jump, a landing on the hero shot, 5 casts in 270 s.

## The first fish (v0.4.0)

- **Population** (`fish.js`): ten largemouth spawned on the cove's cover (laydowns, dock, weed bed, stumps, pads) with lengths from 28 to 54 cm and their own boldness, plus one legend, the Ridge Fish, under the north laydown. Persistent for the session; aversion to a lure family grows with every escape and catch.
- **Brain** (`fish-brain.js`): HOLD on structure, CRUISE, INSPECT (shadow the lure from below and behind for one to four seconds), STRIKE, BITE, REFUSE (turn away and sulk for a while), FLEE (the kayak inside its spook radius or a splash within two metres), RESTING after release. Strike chance each half second is boldness × diel activity (`species.js`, crepuscular peaks at dawn and dusk) × technique match × lure family × (1 − aversion). A dead-sticked lure rarely draws a strike; walking the dog does.
- **Bite and set**: the fish holds the lure; set the hook with F, or by reeling, inside about 1.2 s. Too early pulls it away; too late and it spits.
- **Fight** (`fight.js`): runs, sulks, head-shakes and jumps; tension from the fish's pull against your drag and reeling; drag slips above its setting and pays line out. Space reels, A/D sweep the rod for side pressure (which blunts a run), W lifts the rod, S bows to a jump. Slack through a head-shake or a jump drains the hook's hold; tension past the weakest link for about a second breaks it. A tired fish within reach of the rod tip is landed.
- **Landing**: the fish comes to hand in front of the camera, wet and breathing, with a catch card (size class, length, weight from the length-weight curve, rig, lure, technique, fight time, conditions). Release puts it back to rest nearby and logs the catch to the journal (`first_light_journal_v1`).
- **The body** (`fish-photo.js`, v0.5.0): built from reference photographs. A side-on and a top-down studio photo of a largemouth were generated with GPT Image through fal and cut from their backgrounds; `source/fish-from-photo.py` reads the photographed silhouette station by station (the back found by scanning to the first run of dark pixels under the pale fin membranes, the belly by a morphological opening that drops the fin bumps, the width from the top view), writes a 64-station profile, the flank texture and a fin card. The loft follows that profile, each body row samples the photographed row, and the dorsal, anal, pelvic and caudal fins are the photo's own pixels on a sagittal card; both bend with the spine wave. Judged against the photo in a studio pose (`compare-fish.py`): bounding-box aspect 0.414 vs 0.419, silhouette IoU 0.86, mean colour difference 40/255 under scene lighting. The procedural body (`fish-body.js`) remains the fallback if the assets fail to load.

## Under the surface (v0.3.0)

- **The surface from below** (`lake-under-fragment.js`): water-to-air Fresnel with total internal reflection outside Snell's window (48.6°), the above-water world refracted through the window from the same refraction target, the underwater world mirrored across the surface where reflection is total (a flipped mirror pass on High, the deep colour on lower tiers), the sun's glow through the window, absorption along the path to the eye. Hysteresis around the waterline keeps a bobbing eye from flickering between the two surface shaders.
- **Water column** (`optics.js`): exponential-squared fog from the optical preset and clarity (about 8 m visibility in green water at clarity 1), swapped per render pass so the above-water world seen through the window keeps its air haze; dimmer, greener ambient light underwater.
- **Effects** (`underwater-fx.js`): suspended particulate drifting in a box around the camera; light shafts as a screen-space overlay from the sun's projected position, fading with depth and gone at night.
- **Lure cam**: C (or the Cam button, or Y on a gamepad) follows the lure from behind and slightly below while it is in the water; reel, twitch and technique readouts keep working; it returns to the seat when the lure comes in.

## What the water slice contains

- **Real sun and clock.** Sunrise and sunset are computed for the lake (40.46°N, 75.24°W) with the NOAA solar algorithm; the game clock starts 25 minutes before today's sunrise and runs at 4× by default so a session covers a dawn window. Real-time mode follows the wall clock.
- **The lake.** After the Storm's water renderer retuned for a reservoir: fetch-limited wind waves (twelve Gerstner bands, 0.4–6 m, amplitude scaled by wind and by local openness so sheltered water stays glassy), a full-resolution refraction target with depth-guided offsets and Beer–Lambert freshwater absorption, a mirrored-camera planar reflection with a mip-blurred sky fallback, capillary detail, rain rings, wind lanes, a world-space foam and shoreline-wetness atlas, and moving caustics on the bed.
- **Polarized lenses.** The Fresnel term is the real dielectric split into s and p polarization for water (n = 1.333); the lenses remove the s-polarized glare, so near Brewster's angle the surface opens up and the bottom shows through.
- **The ripple field.** A GPU ping-pong 2D wave equation on a 48 m atlas that follows the kayak, fed by pebbles, paddle strokes and the wake; its heights and slopes feed the water shader and the foam.
- **The cove.** A hand-built analytic bed for the Three Mile Run arm: the open lake to the south-west, a steep wooded north shore with a riprap point, a gentle south shore with a gravel flat, dock, milfoil bed and lily pads at the creek mouth, a mid-cove hump and the old channel. It is an approximation for play, not surveyed bathymetry.
- **The banks.** Dense pines and oaks along the waterline with a cheaper backdrop forest behind, grass to the water, cattails in the shallows, all wind-swayed and reflected.
- **First-light mist**, a sun-driven sky with clouds and stars, and a sit-on-top kayak that rides the surface, drifts with the wind, stops on the bank and leaves a wake.

## Water and physical approximations

Waves are analytic bands, not a spectrum simulation; the ripple field is a linear wave equation with damping, so big splashes do not break. Reflections are planar. Mist is three low sheets of noise alpha. The bed is analytic and the cove shape is invented from the real lake's character rather than surveyed. There is no underwater camera yet; the surface shader assumes the eye is above the water.

## Source and verification

Everything is ES modules loaded through a cache-busted importmap (`node source/version-assets.mjs` after edits). Three.js r185 is vendored in `vendor/`. Pure modules have node tests: `npm test` runs `tests/*.test.mjs` (solar position, clock and time-zone round trips, wave dispersion and the CPU inverse, ripple-scheme stability, bed encoding and cove shape, shore distance).

Browser verification uses the QA hook `window.__FIRST_LIGHT`: `step(dt)`, `drive(seconds)`, `render()`, `pixelStats()`, `stats()`, `state()`, `setTime(hour)`, `setClockRate(rate)`, `setWeather(name)`, `setWind(ms, fromDeg)`, `polarized(bool)`, `addRipple(x, z, kind)`, `setCamera(name)`, `quality(tier)`, `forceSize(w, h)`, `debug()`. Occluded tabs throttle animation frames, so drive the simulation by hand and read pixel statistics rather than trusting frame rate.

Tooling installed for the next milestones (fish assets): Blender 4.5.13 LTS (`~/.local/bin/blender`), meshoptimizer 0.24 and gltfpack in `workspace/tools/first-light-tools`, and a Python venv with numpy, Pillow and scipy in `workspace/tools/first-light-venv`.

Textures are CC0 from Poly Haven (see `ASSET-LICENSES.md`).

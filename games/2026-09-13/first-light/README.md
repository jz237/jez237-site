# First Light: Keystone Waters

An immersive freshwater angling sim for the browser, set on real Pennsylvania water. **This build (v0.2.0, cast and retrieve)** is Lake Nockamixon's Three Mile Run cove at first light from a fishing kayak: the lake renderer, sky, clock, weather, shoreline and interactive surface from the v0.1.0 water slice, plus a rod in your hands, three rigs, a charge-and-release cast, line physics and lures that behave as their kinds do. Fish arrive in the next milestone (see `CONCEPT.md` and `SPEC.md`).

Live: `https://jez237.com/games/2026-09-13/first-light/`

## Play

Press **Paddle out**. Drag the scene to look around. **Hold the mouse button** (still, for a moment) to load the rod and **release** to cast where you are looking; **Space** reels, **F** twitches the rod, **Tab** changes rig (finesse worm, topwater walker, squarebill). **W / S** paddle, **A / D** turn, **X** drops or lifts the anchor, **P** puts the polarized lenses on, **T** cycles the time rate (real, 1×, 4×, 12×), **1 / 2 / 3** skip to dawn, dusk or night, **Esc** opens the menu; right-click tosses a pebble. Phones get hold buttons for paddle, turn, reel and cast (hold to load, release to throw), tap buttons for twitch, anchor, lenses, rig and menu, and drag-to-look; gamepads use the left stick to paddle and turn, the right stick to look, LT to load and release a cast, RT to reel, RB to twitch, A for anchor, X for lenses, Start for the menu.

The menu has graphics tiers (Adaptive, High, Medium, Low, Saver at 30 fps for phones), the time rate, a weather preset (calm dawn, light breeze, overcast, rain), a Steady camera option that damps the kayak's pitch and roll (also on automatically under `prefers-reduced-motion`), and a field-of-view slider. The hour slider and skip buttons live on the HUD.

## Casting and retrieving (v0.2.0)

- **Tackle chain** (`tackle.js`): rods, reels, lines and lures with real ratings; the weakest link (line test, drag setting, leader, rod class) is shown on the HUD and a lure outside the rod's weight range casts short.
- **Cast** (`angling.js`): power loads over 1.3 s; release throws the lure on a ballistic arc with quadratic drag and wind toward the reticle; splashdown stamps the surface impulses and the ripple field. About 28 m at full power on the finesse rig.
- **Line** (`line.js`): a 24-node Verlet chain from the bending rod tip; air nodes sag, submerged nodes drag and rise or sink with the line type, and the lure node floats, sinks at its rate, or dives to a target depth on the retrieve. Tension is how taut the chain is. The line is drawn as a camera-facing ribbon, so the underwater part refracts through the surface.
- **Lures**: the walker zigzags on top with each twitch, the Texas-rigged worm sinks and hops off the bottom, the squarebill dives while reeling and floats up at rest.
- **Technique recognizer** (`technique.js`): a three-second window over reeling and twitches names what you are doing (straight retrieve, slow roll, stop & go, twitching, lift & drop, walking the dog, dead stick).

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

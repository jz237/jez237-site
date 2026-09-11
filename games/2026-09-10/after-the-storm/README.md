# After the Storm

A browser jet-ski game built around shared waves, hull response and modern water rendering. Free ride is the initial mode. Racing offers an original nine-venue interpretation of Wave Race 64's core mechanics; the earlier coastal salvage voyage remains available.

## Play

On Windows, double-click **Play After the Storm.cmd**. It opens the racing/free-riding game. Node.js is required and is already installed on the creation machine.

Alternatively, run `npm start` from this folder, then open:
- Racing and free ride: http://127.0.0.1:4174/race.html
- Salvage voyage: http://127.0.0.1:4174/

No build, npm install, API key, account or paid service is required. This folder can be served by any static web server; relative imports support hosting inside another site's subdirectory. Three.js 0.180.0 is bundled under its MIT licence in vendor/THREE-LICENSE.txt. Optional Google Fonts fall back to system fonts offline.

## Racing controls

| Action | Player 1 | Player 2 |
| --- | --- | --- |
| Throttle / steer | W / A D | Up / Left Right |
| Brake | Space | Right Ctrl |
| Slide | Left Shift | Right Shift |
| Absorb wave impact | B | Period |
| Trim forward / back | Q / E | [ / ] |
| Recover when stranded | R | Backspace |
| Camera | C | / |
| Pause | Escape or Enter in two-player mode | Escape or Enter |

A fresh throttle press as GO appears gives maximum power. Hold rearward trim while steering for a quick turn. Hard collisions and bad stunt landings can eject the rider; tap throttle to remount faster.

Keyboard steering is 20% gentler; analogue steering is unchanged. After a brief period stuck on shore, the ski returns to its last safe water position, facing away from the beach. R (P2: Backspace) recovers immediately when stranded. If the tide has exposed that spot, recovery searches nearby water. Lap and buoy progress are preserved.

In solo modes, arrow keys also drive. Drag to orbit and scroll to zoom; each split-screen half controls its own camera. Forward ramp trim gives a lower, shorter jump; rearward trim gives a higher, longer jump.

Free ride includes four floating ramps and twelve air, surface and dive rings in each venue. The first ramp is ahead of the start; the HUD points toward the nearest ramp. There is no stunt timer. Collected rings return after ten seconds, and missed rings can be retried after two seconds. Long swells are 2.1 times taller and longer, with unchanged fine ripples; rendering, buoyancy and floating ramp contact use the same surface model.

Stunts: hold 1 for a flip, 2/3 for barrel rolls, then release before landing. 4/5/6 select standing, handstand and backward poses; 7 somersaults from standing; F dives during descent.

Standard gamepads: left stick steering/trim, right trigger throttle, left trigger brake, right shoulder slide, bottom face button absorb, top face button camera, Start pause. For stunts, hold left shoulder with the top face button for flip, left/right face buttons for rolls, D-pad up/right/down for poses, bottom face button for somersault, and left trigger for dive. Physical gamepad hardware has not been tested.

## Modes and decisions

- **Free ride:** explore any venue and compare calm water, wind chop and storm swell with a restrained contact/speed display.
- **Championship:** four riders, six/seven/eight-round circuits, Normal/Hard/Expert and Reverse, qualification points, previous-result starting grids and class unlocks. Normal begins with an optional warm-up; pause to begin the circuit. Restart replays the current round with its original points and grid.
- **Single race / time trial:** three laps by default, adjustable to 4/5/6/9. Pass red buoys on the right and yellow on the left. Correct passes build five power levels; a miss resets power. Five misses or five seconds outside the course disqualify. Time trials compare completed laps against the best lap, including a saved record.
- **Stunts:** four timed checkpoints, chained rings, air rotations and rider poses. Choose routes through the mandatory checkpoint gates.
- **Two players:** horizontal split screen, independent riders and tuning, same-rider matches, optional catch-up, and swappable liveries for different riders.

Citadel Sound raises its sluice from lap two on Hard and above. Port Meridian opens a shorter, narrow service tunnel from the start on higher classes. The outer channels remain valid alternatives. Structures have solid walls, gates and roof clearance, and the chase cameras avoid them. Tempest Island's ebb exposes a coral shoal beside the main channel. Glacier ice drifts at the same locations used for collisions.

## Salvage voyage

Recover three cargoes and return before an eight-minute storm window closes. WASD/arrows drive, S reverses, Space brakes, and holding E recovers cargo or unloads at the dock below 1 m/s. F finishes a partial voyage after delivery. Drag/scroll controls the camera; Escape pauses.

Capacity is three units; the objectives weigh 1/2/2. More cargo reduces acceleration, turning and top speed. Recoveries take 22/34/46 seconds; unloading takes three seconds. Shallows, reefs, dock piles, wreck impacts and late storm exposure threaten the hull. Success, partial delivery, failure and restart are implemented.

## Records, sound and saves

Pelican Park has a swimming dolphin guide. Complete its timed run through all twelve rings, with a flip, both rolls, standing, handstand, backwards ride, somersault and submarine dive, to unlock **Ride the dolphin** in Pelican Park Free ride. The bonus survives reload and portable saves. The dolphin has an animated flexible body, fins and flukes, and no engine sound.

Eight local ElevenLabs clips provide idle/load engines, water rush, wind, splash, hull impact, race cues and an optional instrumental loop. Pitch and mix respond to throttle, speed and water contact. Split-screen engines are independent. No announcer or narration is used. Generation consumed 868 existing credits with no purchase; playing requires no account or service call. A synthesized fallback handles missing files.

Options & saves manages rider names, tuning, graphics, sea preferences, stereo/mono/headphones, volume and original optional music. Sound begins only after starting. Solo results support initials, top-three times, best laps and stunt scores; custom sea states are unranked. Reached-course and class restrictions follow championship progress.

Export portable JSON by downloading or copying the displayed text. Import through a file picker or paste, review the validation summary, then replace the save. Erasing/importing/resetting offers session Undo. Invalid data is rejected before changing progress. Browser storage retains progress; the export is the durable backup.

## Blender watercraft model

The Tideline R-01 replaces the original primitive craft with a Blender-authored hull, contoured pearl deck and livery hood, stepped stitched saddle, ribbed footwells, intake louvers, mirrors, detailed steering hardware, boarding platform and jet pump. Rider liveries and the moving handlebar/nozzle groups remain connected to the game; the live dashboard is retained. Salvage keeps its cargo rack and winch.

Editable source: **source/blender/Tideline R-01.blend**. Standard interchange asset: **dist/assets/Tideline R-01.glb**. Front/rear studio PNGs and the reproducible **build_jetski.py** are beside the Blender file. The meshes are original geometry built in Blender 5.2; the watercraft works with the detailed Blender rider and articulated pose rig.

The browser loads the Blender-evaluated meshes from tideline-r01.json/bin. Geometry is shared across rider colours and merged into 19 material/articulation batches per craft. The original built-in craft is a fallback if these assets cannot load. Run Blender in background with `--python source/blender/build_jetski.py` to rebuild the model, exports and studio renders. Blender is only needed for editing/rebuilding; playing requires no Blender installation.

## Detailed Blender riders

Adult riders now have shaped faces, eyes and lips, open-face helmets, clear goggles, chin straps, fitted flotation vests with webbing and reflective strips, contoured wetsuit limbs, individual gripping fingers and molded water boots. Four complexion variants accompany the rider liveries. The same detailed geometry is used for seated riding and stunts.

The 15-part pose rig keeps hands on the steering grips and feet planted during riding, with subtle breathing, a forward lean at speed, head turns and impact compression. These are articulated real-time characters, with simplified faces and procedural motion; they are not scanned people or cloth simulations.

Editable source with pose bones and jet-ski context: **source/blender/Coastal Rider.blend**. Standard geometry export: **dist/assets/Coastal Rider.glb**. Use **source/blender/build_rider.py** in Blender to regenerate the model, runtime buffers and front/rear renders. The game shares the asset geometry across riders and retains the earlier rider as an asset-loading fallback.

## On-screen pace

Racing and free riding now run in **real seconds**, using fixed 1/60-second physics steps. Gravity, waves, weather, animation and race clocks share that clock. Speed feel comes from actual acceleration plus a progressively lower chase camera and a smoothly widening 58–76 degree field of view. Both split-screen cameras respond independently. Camera clearance includes wave crests, ramps and enclosed passages.

## Engine and hull response

The default Mara ski reached 60 km/h in approximately 2.52 seconds on calm water in the unobstructed benchmark, sustaining about 97 km/h. Storm swell reduced cruise to about 88 km/h. These are actual simulated speeds; turns, contact, intake ventilation and impacts affect the result. Rivals use predictive steering and part throttle to negotiate the stronger wave response.

Twelve hull patches apply independent immersion pressure, relative-water damping and planing lift. Their forces generate heave, pitch and roll through rotational inertia. Steering has yaw inertia, contact-dependent authority and side grip. An unsupported hull follows gravity; landing pressure produces drag, spray and suspension load. The rider bends knees and elbows while fixed-length inverse kinematics keeps gloves on the steering grips and boots on the footwells.

## Water and physical approximations

The GPU and CPU share fourteen dispersive wave bands with horizontal trochoidal displacement. CPU height queries invert that displacement, matching the rendered surface. World-space wake packets remain after the emitting ski has left, affect subsequent hull contact, spread and decay. Bow sheets, ballistic droplets and fine wind-dragged mist respond to contact and motion.

A reprojected foam atlas retains foam and bubbles after breaking crests and shallow shoreline breakers. Water includes depth-dependent absorption/refraction, roughness-filtered planar reflections with a sky fallback, forward light scattering through backlit crests, sun glints, fine ripples, caustics and rain rings. Environment lighting refreshes with weather; wet rocks change color and roughness, and ground-conforming contact shadows anchor vegetation. Adaptive graphics reduces reflection, foam and screen resolution when needed.

This remains an interactive approximation rather than CFD. Waves do not overturn into fully simulated water volumes; foam and spray use a surface atlas, sheets and particles. Reflections remain planar. The ebb is compressed into a race, and stunt poses/dives are arcade maneuvers. Ramps heave as rigid platforms. The jet ski and riders are modeled in Blender; scenery remains procedural. The original salvage mode retains its earlier driving rules but shares the upgraded water rendering. Sound uses local ElevenLabs clips with synthesized fallback; physical gamepad hardware and mobile touch input are not verified.

## Source and verification

`npm test` runs the automated suite. All 106 tests pass, covering all 36 course/class routes, championship scoring/unlocks/restart, salvage outcomes, full park mastery, rider actions, two-player controls, water response, moving hazards/passages, saves and audio assets/mixing.

Use `race.html?verify=1` for visible development controls. The verification driver supplies ordinary helm input at either real time or a 4x verification clock; it does not teleport or grant progress. The salvage harness at `/?verify=1` includes a full voyage and bounded seeded failure scenarios. These panels are absent from normal play.

Core browser modules: race-core.js and championship.js (rules), hydrodynamics.js (hull), simulation.js/ocean.js/water-detail.js (shared water), course-world.js/courses.js/course-passages.js (venues), race-view.js (presentation), race-options.js/race-records.js (saves), and audio.js (sound). See PARITY.md for the requirement audit and VALIDATION.md for browser evidence.

## Photographic coastline update — September 10, 2026

Terrain blends local photographic sand, coastal rock and forest-floor maps according to slope, elevation and shoreline wetness. Triplanar mapping avoids stretched cliff textures; normal and roughness maps respond to lighting. Shared collision/render heights include eroded bank detail. Submerged terrain retains the moving water caustics.

Palms have curved trunks and individually shaped leaflets; pines have branching crowns; broadleaf trees have layered foliage. Instanced grass, shrubs, pebbles and driftwood dress the coast. Weather drives foliage sway. Low graphics omits ground grass and shortens the foliage draw distance. Racing and salvage both use the new surfaces and vegetation.

The ground textures are photographs; trees and terrain remain procedural real-time models, not scanned full environments. Buildings remain simplified, ground dressing is decorative, and this does not add a walking mode. Foliage shadows use static rest poses while leaves sway slightly.

## Published routes

- [Play racing / free ride](https://jez237.com/games/2026-09-10/after-the-storm/race.html)
- [Play salvage](https://jez237.com/games/2026-09-10/after-the-storm/)
- [Games catalog](https://jez237.com/games/)

Source is maintained in `jz237/jez237-site`, on the separate worktree branch `codex/after-the-storm-coast-20260910`. The route contains source, assets, tests and Blender files and can be served as a static directory.

After changing browser modules or styles, run `node source/version-assets.mjs` to regenerate both HTML import maps and content-versioned asset URLs. It supports the published flat layout and the downloadable package with a `dist/` folder.

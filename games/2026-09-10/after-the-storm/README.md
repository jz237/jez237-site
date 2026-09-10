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

Keyboard steering is 20% gentler; analogue steering is unchanged. After a brief period stuck on shore, the ski returns to its last safe water position, facing away from the beach. R (P2: Backspace) recovers immediately when stranded. If the tide has exposed that spot, recovery searches nearby water. Lap and buoy progress are preserved.

In solo modes, arrow keys also drive. Drag to orbit and scroll to zoom; each split-screen half controls its own camera. Forward ramp trim gives a lower, shorter jump; rearward trim gives a higher, longer jump.

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

Racing and free riding play at **2x real time** for twice the on-screen motion. Hull physics, shared waves, wakes, spray and chase cameras advance together in fixed simulation steps. Countdown and menu remain normal speed. The HUD speed is the simulated speed; race clocks, weather progression and timed challenges run twice as fast in real time. Pause still stops play. The development driver retains its separate 4x rate.

## Faster engine update

All four riders now have 30% higher rated top speed and 50% more engine acceleration. In an unobstructed full-throttle test, the default Mara ski sustained about 86 km/h in calm water (previously 66), reaching 60 km/h in 2.9 seconds (previously 5.85). Storm swell reduced sustained speed to about 81 km/h. Actual course speed depends on turns, buoy power and water contact. Rivals use part throttle to maintain a safe course pace.

## Water and physical approximations

The GPU and CPU share fourteen dispersive wave bands, craft disturbances, landing pressure waves and the water-level datum. Hull support samples bow/stern/edges; heave, pitch/roll, planing, gravity, ventilation of the jet intake, airborne motion and impact loss affect handling. Spray carries hull momentum. The water uses depth-dependent absorption, refraction, Fresnel reflection, HDR reflection targets, sun glints, fine ripples, caustics, shoreline wash, rain rings and persistent aerated wakes.

This is a real-time approximation, not CFD. Reflections are planar; spray, foam, caustics and currents are procedural. The ebb is compressed into a race. Stunt poses/dives are arcade maneuvers. The jet ski and riders are modeled in Blender; scenery remains procedural. Sound is synthesized and subjective listening quality remains unverified. The original salvage mode retains its earlier handling model. Mobile touch controls are not provided.

## Source and verification

`npm test` runs the automated suite. The latest full run passed 79 tests covering all 36 course/class routes, championship scoring/unlocks/restart, salvage outcomes, stunts, two-player controls, water response, moving hazards/passages, saves and sound graphs.

Use `race.html?verify=1` for visible development controls. The verification driver supplies ordinary helm input at a 4x clock; it does not teleport or grant progress. The salvage harness at `/?verify=1` includes a full voyage and bounded seeded failure scenarios. These panels are absent from normal play.

Core files: dist/race-core.js and championship.js (rules), hydrodynamics.js (hull), simulation.js/ocean.js/water-detail.js (shared water), course-world.js/courses.js/course-passages.js (venues), race-view.js (presentation), race-options.js/race-records.js (saves), and audio.js (sound). See PARITY.md for the requirement audit and VALIDATION.md for browser evidence.

## Photographic coastline update — September 10, 2026

Terrain blends local photographic sand, coastal rock and forest-floor maps according to slope, elevation and shoreline wetness. Triplanar mapping avoids stretched cliff textures; normal and roughness maps respond to lighting. Shared collision/render heights include eroded bank detail. Submerged terrain retains the moving water caustics.

Palms have curved trunks and individually shaped leaflets; pines have branching crowns; broadleaf trees have layered foliage. Instanced grass, shrubs, pebbles and driftwood dress the coast. Weather drives foliage sway. Low graphics omits ground grass and shortens the foliage draw distance. Racing and salvage both use the new surfaces and vegetation.

The ground textures are photographs; trees and terrain remain procedural real-time models, not scanned full environments. Buildings remain simplified, ground dressing is decorative, and this does not add a walking mode. Foliage shadows use static rest poses while leaves sway slightly.

## Published routes

- [Play racing / free ride](https://jez237.com/games/2026-09-10/after-the-storm/race.html)
- [Play salvage](https://jez237.com/games/2026-09-10/after-the-storm/)
- [Games catalog](https://jez237.com/games/)

Source is maintained in `jz237/jez237-site`, on the separate worktree branch `codex/after-the-storm-coast-20260910`. The route contains source, assets, tests and Blender files and can be served as a static directory.

# Current feature-parity and ElevenLabs update — September 10, 2026

This section supersedes older sound/gameplay descriptions below.

- Final full suite: **106/106 passed**, 63.95 seconds. Includes all 36 venue/class routes, four championships, split-screen, scoring/unlocks/records, failures/restart, shore rescue, salvage and water physics.
- New integration checks prove rocket starts, quick-turn contact restrictions, fast shoreline ejection, bounded remount tapping, mass-dependent craft collisions and momentum conservation.
- Browser park mastery: 52.217 seconds, 12/12 rings, eight required moves, four checkpoints, no crashes, 10,539 points. The same ordinary-input driver passes in Node. The browser granted the saved bonus and rendered the dolphin in Free ride. High-quality final window: 60 FPS; no JavaScript errors.
- Wipeout inspection intentionally released an incomplete flip and held at 5.80 seconds. The rider separates from the hull, which slows, then returns through a continuous remount. Inspection identified and corrected the inward fall direction before publication.
- Eight ElevenLabs WAV exports were generated in the authenticated web UI from original speech-free prompts, using 868 existing credits and no purchase. Local MP3s use -20 LUFS / -2 dBTP normalization. PROVENANCE.json records their hashes. Browser status confirmed all 8/8 decoded. Tests cover throttle revving, ventilation, stereo, mono, dolphin engine muting, bounded one shots and missing-file fallback. No announcer or TTS is used.
- The dolphin has a travelling vertical body wave, independent fins/flukes, a safe-water guide route and a saved bonus mount. Its ride uses arcade hull response rather than a biological swimming simulation.
- Both HTML pages version all 41 browser modules. The package includes the new source, local clips and original WAV exports.

Subjective listening quality and physical gamepad hardware remain unverified. Water is an analytic surface approximation; course layouts and assets are original. See PARITY.md for the reference matrix.

---

# Previous realism upgrade — September 10, 2026

This section supersedes historical physics, clock and performance descriptions below.

- Full regression suite: 92/92 passed. After the final hull-attached spray refinement, 14 focused physics/rider/wake/spray checks passed, including one new test; 93 distinct tests are now covered. The full suite includes all 36 venue/class routes, four championships, timed stunts, split-screen, shore rescue, salvage success/failure, restart, saves and audio graphs.
- Twelve immersion patches produce independent pressure, relative-water damping and planing lift, summed into heave and angular moments. Tests verify asymmetric waves roll/pitch the hull, planing raises it, unsupported gravity, landing loads and 60/120 Hz convergence.
- CPU inverse queries agree with horizontally displaced wave vertices within 4 mm in the tested grid across calm/chop/storm. A denser exploratory storm sweep found approximately 1.01 mm maximum difference. The GPU and CPU use the same spectrum and four inverse iterations.
- Wake packets remain in world space and alter hull response after their emitter leaves. Fine mist responds to wind more strongly than ballistic droplets. Chine/nozzle origins follow hull pitch, roll and local vertical velocity. Rider IK keeps arm/leg lengths and planted boots while tracking rotating grips through suspension compression.
- Deep-water, full-throttle Mara benchmark: calm 97.09 km/h, chop 94.26 km/h, storm 88.39 km/h (final-ten-second mean). 0–60 km/h: 2.52 / 2.52 / 2.53 seconds respectively. Storm produced ten measured landings. Actual course speeds depend on contact, steering and power.
- Browser real-time Tempest/storm free ride: ramp launch, ring collection, landing and braking completed in 6.733 simulation seconds / 6.980 wall seconds including startup overhead. Rate explicitly 1. Peak sampled clearance 4.916 m; one ring / 50 points. The speed-dependent camera widened to about 69 degrees at 65 km/h.
- Browser airborne inspection: 4.916 m clearance, zero load/wet contact. Landing inspection: suspension compression 0.130 m, approximately 8.18 g support load, fully wet hull; spray/foam and rider pose inspected. Camera clearance was extended over floating ramps after noticing a foreground obstruction.
- Browser full Tempest/storm race: 183.167 seconds, all 72 gates, zero misses, 40 landings. Adaptive graphics retained High, final measured window 60 FPS. Some startup verification windows measured 46–53 FPS; these are host measurements rather than a universal guarantee.
- Browser Amber/chop split-screen on Low: P1 won at 166.417 seconds with 72 gates; P2 had 70 gates when the match ended. Both had zero misses. Final measured window 60 FPS. Both views use the shared wake field; the foam atlas expands to include both human riders.
- Rendering includes a reprojected/advection/decay foam atlas, shallow-breaker sources, ballistic chine sheets, droplets and wind-dragged mist. Reflections have filtered roughness and edge sky fallback; backlit crests scatter light. Environment reflections refresh with weather. Wet rock roughness/color and terrain-conforming vegetation contact shadows were visually checked. Excess foam coverage was reduced after visual inspection.
- No JavaScript errors in the rendered jump, race or split-screen checks. Earlier shader compiler warnings predate the final floor-height function cleanup.
- Content-versioned module import maps cover every first-party browser module. `source/version-assets.mjs` regenerates the maps and stylesheet URLs for the published and downloadable layouts.

Physical limitations: analytic height-field water does not overturn into volumes. Hull lift/drag/pressure are calibrated game approximations, not CFD. Reflections remain planar; spray uses sheets and particles, and foam uses an atlas. Ramps heave rigidly. The earlier salvage mode retains its original driving rules.

---

# Coastline publication validation — 2026-09-10

- `npm test`: 79/79 passing after shared terrain-height changes (19.95 seconds).
- Browser Tempest Island / Wind chop / Normal: completed three laps in 178.250 simulated seconds, 72 gates passed, zero misses, ten landings. Adaptive selected High; final FPS window 60. No console warnings or errors.
- Visually inspected tropical palms, forested Greyhaven, shadows/reflections, shoreline ground and the salvage dock after casting off. No shader errors.
- Games catalog inline JavaScript syntax passes. New game is in the existing Arcade and Featured catalog filters and in `content/site.json`.
- All 12 local photographic texture files have provenance and SHA-256 hashes in `assets/terrain/manifest.json`.

FPS is a short desktop measurement, not a guarantee for all devices. Trees and structures remain procedural real-time geometry; the terrain surface maps are photographic. Static foliage shadows are an approximation.

---

# Jet ski edition verification — September 10, 2026

## Detailed Blender riders

All 79 tests pass. New export checks cover finite normals, human-scale bounds, the 15 articulated parts and GLB integrity. Pose checks verify steering-grip tracking, planted feet, impact compression, connected arm endpoints and a complete somersault cycle. Hull physics and all existing course, championship, recovery, multiplayer and salvage checks continue to pass.

The rider is original Blender geometry with shaped facial features, open-face helmet, clear goggles, straps, contoured wetsuit limbs, fitted flotation vest, gripping fingers and boots. Four complexion variants share the geometry. Editable Coastal Rider.blend includes pose bones and the approved jet ski as context; a GLB and compact runtime geometry are also saved. Blender front/rear renders were inspected and refined to seat the rider properly, shorten the exposed neck, close joint openings and flatten the webbing.

Browser Greyhaven, wind chop: the new riders completed three laps in 129.533 seconds with 72 crossings, no missed buoys and one measured landing. Close chase views showed multiple liveries, moving poses, hull contact and wakes. High quality reported 60 FPS in the final measurement window. Runtime error/warning logs were empty, so asset fallbacks were not used. The visible verification driver used ordinary inputs at 4x clock; no record was saved.

A browser Pelican stunt run also completed all four checkpoints with six rings and six tricks, scoring 6,745 in 58.133 simulation seconds. Its final High-quality window reported 56 FPS; no runtime warnings or errors appeared. Salvage cast-off loaded and ran the new seated rider without errors.

Faces and pose articulation remain simplified real-time approximations; this is not photogrammetry, facial capture or cloth simulation.


## Blender watercraft replacement

Built and rendered the original Tideline R-01 in Blender 5.2.1 LTS, then integrated its evaluated geometry into both racing and salvage. Editable .blend, a reproducible Blender Python builder, standard GLB, compact runtime JSON/binary and two studio renders are saved. The craft has 76,488 triangles in 19 shared material/articulation batches; existing rider and stunt rigs are retained.

All 76 tests pass, including export bounds, finite unit normals, articulated group presence and GLB integrity. Browser racing loaded the new model without fallback or runtime warnings. A three-lap Greyhaven run in wind chop finished in 129.533 seconds, with 72 crossings, zero misses and one measured landing. High quality reported 60 FPS in the final measured window. The visible ordinary-input verification driver retained its 4x clock. Close chase-camera screenshots showed multiple rider liveries, the remodeled stern/seat, water contact and wakes. No QA result was saved.

The normal salvage page also loaded without errors; cast-off was visually inspected with the retained rack and winch equipment. The new model does not change hull physics, doubled normal playback, softened keyboard steering or shore recovery. Studio renders were inspected from both ends; a missing handlebar stem was corrected before the final export.


## Shore recovery and keyboard steering

All 75 tests pass. Four new checks cover sustained ordinary throttle into a beach, automatic safe-water recovery and departure; manual recovery without awarding progress or moving an afloat rider; rejection of a safe point exposed by changing depth; and 20% softer keyboard steering for both players with unchanged analogue input. The course-out fixture now uses open water, since being placed on land correctly triggers rescue.

Recovery waits 1.5 simulation seconds of grounding/pinned shore contact, or R/Backspace requests it immediately while stranded. It validates depth, nearby rocks and passage structures, resets hull motion, and preserves checkpoints/laps. A browser reload and free-ride start displayed the new rescue control and produced no runtime errors.


## Doubled on-screen playback

Normal riding now advances at 2x wall time while preserving 1/60-second physics steps. Visual effects and chase cameras use the same playback rate; menu and countdown remain normal speed. The separate development driver remains 4x. Browser DOM timing advanced from 7.067 to 20.933 game seconds over 6.902 real seconds (approximately 2x, with HUD sampling delay). Pause and a clean runtime error log were checked. JavaScript syntax validation passed. This change affects presentation scheduling; the previously passing 71 simulation tests were not rerun because their fixed-step physics is unchanged.


## Faster engine update

All 71 tests pass after increasing every rider's rated speed by 30% and engine acceleration by 50%. The race driver uses part throttle to keep its safe course pace; human inputs retain the full throttle range. No speedometer multiplier or physics clock change is used for normal play.

The default rider was driven at full throttle for 30 seconds over deep, unobstructed water using the actual shared wave model. Calm water: last-ten-second mean 85.91 km/h versus 65.96 before, and 0–60 km/h in 2.90 seconds versus 5.85. Chop: 84.16 km/h and 2.95 seconds. Storm: 81.17 km/h and 3.08 seconds, with four measured landings. The new speed regression also verifies braking below 20% of cruising speed within two seconds in all three sea states.

The full suite rechecked all 36 course/class routes, four complete championship circuits, both passage paths, stunts, multiplayer and the unchanged salvage loop. Fresh browser race: Greyhaven, calm water, three laps finished in 124.717 seconds with 72 crossings and no missed buoys. High graphics reported 60 FPS in the final window; wake/contact rendering inspected and browser error log empty. The verification driver used ordinary part-throttle inputs at its visible 4x clock. Earlier browser race timings below describe the preceding engine tune.


## Final integrated audit

The final automated suite passes **70/70 tests**. Earlier counts below are historical milestones. All 36 venue/class routes and complete Normal, Hard, Expert and Reverse championships pass ordinary-input simulation. Additional tests cover round checkpoint restoration, lap comparisons, trailing rivals, colour selection/save validation and ramp trim affecting ballistic jump height.

The browser Normal championship included its actual Pelican warm-up, all six races, round transitions, final standings and a Hard unlock retained after reloading the normal game URL. Nia finished champion with 33 points; the other riders scored 25, 18 and 8.

| Round | Time (seconds) | Finish | Cumulative points | Crossings / misses | Landings |
| --- | ---: | ---: | ---: | ---: | ---: |
| Greyhaven | 125.667 | 2 | 4 | 72 / 0 | 0 |
| Amber Bay | 162.600 | 1 | 11 | 72 / 0 | 1 |
| Reedwater | 153.250 | 1 | 18 | 72 / 0 | 0 |
| Citadel | 187.250 | 2 | 22 | 72 / 0 | 12 |
| Port Meridian | 202.483 | 2 | 26 | 72 / 0 | 1 |
| Tempest | 180.567 | 1 | 33 | 72 / 0 | 15 |

The visible verification driver supplied ordinary controls with a 4x simulation clock. It did not teleport or award progress. These High-quality runs reported approximately 60 FPS in their final measured windows. Performance is specific to this machine and those windows.

- A fresh round-two restart retained the first round's four points and second-place grid, reset the current lap/time, then produced the correct total of eleven points after completing Amber Bay. The corresponding test also restarts a scored round without duplicating points.
- Time trial completed in 124.617 seconds with 72 crossings and no misses. Its result table sorted the stored QA record ahead of the current run. The saved best lap (35.367 seconds) was displayed and used for lap comparisons. Both positive and negative lap deltas and a nearby trailing-rival indicator were observed. These QA results were not saved as new records.
- Same-rider colour enforcement and different-rider colour swapping were checked in the menu and actual Amber Bay split-screen rendering. Player-two colour/rider preferences were restored afterward.
- All nine venues were visually inspected with the final renderer. This included Amber Bay split screen, Reedwater fog, Glacier's ice and shore contact, Pelican docks, Citadel/Port water and scenery, Neon night reflections, and Tempest. Starting-view screenshots supplement the complete race and passage inspections documented below; they do not by themselves establish traversal coverage.
- Browser error logs remained empty. Normal mode hides verification controls. The Windows launcher now opens racing/free ride, and the salvage voyage remains linked.

Limits: procedural scenery and sampled hydrodynamics are not photogrammetry or CFD. Reflections are planar and foam/spray/caustics are approximations. Physical gamepads, subjective sound quality, mobile touch input and performance on other machines have not been verified. See PARITY.md for the complete requirement matrix.

## Automated simulation

`npm test`: 8 tests passed.

- Full voyage through ordinary throttle, helm, brake and interaction inputs: success after 323.90 game seconds, all three cargoes delivered, 89.06% hull remaining.
- Cargo capacity and reduced loaded speed.
- Proximity, low speed and sustained winch time requirements.
- Partial success only after unloading at the dock.
- Reef collision failure, storm deadline failure and clean restart state.
- Pause freezes mission time/position; finite shared-wave samples and navigable objective locations.

## Browser checks

The running WebGL game was inspected in the Codex browser.

- Normal Cast off button enters the playable scene.
- Explicit development harness at `?verify=1` sailed the actual game at a 12x clock using the same input-driven simulation. No teleporting in the full voyage. It recovered all three cargoes, unloaded twice and showed the success screen: $2,750 banked, 89% hull, 02:36 remaining.
- Sail again restored all three objectives and 100% hull.
- Seeded reef-impact scenario showed hull 0 and the hull-loss screen.
- Seeded weather-deadline scenario showed 00:00 and the harbour-closure screen, with storm waves and rain visible.
- Escape paused the game at 08:00; the clock remained at 08:00 while the menu was inspected. Resume voyage returned to play.
- Low graphics rendered successfully without browser errors. Adaptive remains the default on a fresh load.
- Screenshots inspected calm water, underwater visibility, pier reflections, jet ski/rider/cargo, navigation markers, full-hold return, harbour geometry and storm/failure presentation.
- Visual fixes included less pale deep water, smoother coherent rock geometry, corrected gabled roofs, clearer horizon framing, improved pine silhouettes and pier sign orientation. Jet ski follow-up added a continuous hull, articulated rider, environment reflections, shared bow/wake displacement, concentrated water tessellation, steerable nozzle, spray fans and irregular wake foam.
- No errors were reported in the browser console during the tested flows.

## Scope of verification

The complete voyage test was accelerated; a separate unaccelerated human playthrough was not performed. Synthesized audio initialization and control paths are implemented, but sound quality was not audited by listening. Desktop keyboard and mouse are the intended input devices. Other hardware and mobile touch gameplay are not certified.

## Water realism pass

- Normal-speed browser inspection covered dock reflections, travelling wakes, side spray and shallow-water caustics.
- Directional surface spectrum expanded to fourteen independently phased, dispersive waves; CPU buoyancy and GPU surface height still use the same definition.
- Fine slope textures use mipmaps; reflections use HDR where available and roughness filtering. Sun glints account for normal variation across pixels.
- Spray launch and descending water impacts each have a passing regression test.
- The initial shader compilation error from a reserved GLSL identifier was corrected before validation; the running revised surface compiled successfully.

Latest water refinement: all eight simulation and spray tests passed. Browser shader compilation reported no errors; visually inspected the new foam and aerated wake during the automated voyage.
Browser voyage after refinement completed all three deliveries in 323.86 simulated seconds with 89.38% hull; no browser errors.

Racing foundation: 17 tests passed, including complete races for all four riders, buoy side rules, backwards crossings, power penalties, boundary timer, tuning, records, additive rival wakes and salvage regression. Rendered browser race completed all 48 crossings without misses. QA record saved and remained visible after a fresh page load. Pause and restart checked; four-rider wakes and buoys visually inspected with no browser errors. Automated browser racing uses ordinary helm input at accelerated speed; all-course manual playability and physical gamepad testing remain outstanding.

Course/championship and physical water update:
- 26 tests passed: 36 venue/class traversals, complete Normal championship, original points thresholds, grid order, unlocks, reverse geometry, changing weather, hull equilibrium/gravity/landings, shared-water regressions.
- Browser: Neon Reach finished in 165.300 seconds with 72 crossings/zero misses. Tempest Island custom storm finished in 189.167 seconds with 72 crossings/zero misses/28 detected landings; custom sea record form correctly unavailable.
- Visual: inspected water, airborne hulls, rain, four riders, city lighting and glacier scenery. No browser runtime errors during these runs.
- Not yet validated: every venue visually, complete championship browser transitions, physical gamepad, split-screen (not implemented), stunt systems (not implemented).


## Latest contact and momentum pass

- 35 automated tests pass. Four new checks cover impact waves entering buoyancy and decaying, stern-intake ventilation and recovery, airborne throttle/brake behavior, and momentum-preserving nozzle/chine spray.
- All 36 venue/class routes complete without missed buoys. The AI now aims toward the legal side of each crossing, correcting a borderline Expert Citadel miss exposed by reduced airborne drag.
- Storm browser run: Tempest Island, three laps, custom storm sea, 186.800 seconds, 72 crossings, zero misses, 31 wave landings. Water surface, four-craft wake/foam, airborne hulls and spray visually inspected. No browser rendering errors.
- Restart resets per-vessel landing counters so the previous run cannot emit a stale landing burst.
- This validates simulated inputs and rendered frames; it is not a claim of CFD accuracy or a measured real-craft comparison.

- Rendered Pelican Park stunt routine completed four checkpoints, seven rings and seven tricks, with four ramp landings and two failed trick landings. Inspected the rider pose, rings and clear water.
- Inspected Neon Reach at night after the lighting changes: reflected windows and dark transmitted water remain visible; no shader/runtime errors.
- Free ride is now the initial mode, with a reduced HUD showing contact state and speed.


## Two-player split screen

- 41 tests pass. Two independent human input streams complete every competitive venue. Same-rider selection keeps separate tuning/state; catch-up remains bounded and only assists the trailer. A DQ awards the other player; pause freezes both; fresh state resets both. Keyboard routing, analogue gamepad input and odd-height viewport partitioning are tested.
- Rendered Tempest Island custom storm match completed with P2 winning at 183.850 seconds. Both riders were Mara Vale; P1 passed 71 gates with zero misses, P2 completed all 72 with zero misses. P1 had 26 wave landings. Each half showed its own view, wave contact, spray, wake and reflected shoreline. No browser errors.
- The automated runs use ordinary control inputs at an accelerated clock. Two-person human play and physical gamepad hardware are not claimed as tested.

- Low-graphics Neon Reach browser match: P1 won at 173.617 seconds; both riders had zero misses. The last measured frame window reported 60 FPS on this host. Night reflections, wake/foam and both viewports were inspected; no runtime errors.
- Pause held both clocks at 0:28.517 across independent UI reads; Resume returned both views to racing. Restart restored both players to lap 1, time 0:00.000, zero speed, zero misses and zero power with a new countdown.


## Options, saves and audio

- Full 50-test suite passed. After adding controller stunt/trim mappings, all 16 affected save/audio/versus tests passed; there are now 51 tests. Tests cover nested import validation, schema migration, storage-failure atomicity, complete save round-trip, record scope/undo, name sanitization, independent engine responses, mono centering, preview expiry and bounded original music phrases. Audio graph tests use a Web Audio API test double and are not a listening test.
- In-app browser: renamed Mara Vale to Mara Current; reloaded and verified the menu/record name and Mono setting persisted. Restored default names/Stereo. Erased the existing Greyhaven QA record, verified its absence, used Undo and verified its original time/best lap returned.
- Invalid pasted JSON showed an error and no replacement button. The existing exported save was re-imported unchanged; a fresh page retained its original QA record and settings.
- Chrome: Download save file produced an actual 450-byte JSON file. Node parsed it through the production import validator. Selecting that file through the native browser file chooser populated the import preview successfully.
- Chrome test profile: changed a rider name, reset all progress, then Undo restored that name. Headphones/music settings survived reload. Test changes were restored to defaults. Music preview and normal play initialized without console errors; Escape opened pause. No claim of subjective sound-quality review or physical gamepad testing.
- The embedded browser did not produce a file in Downloads; the same export remains available as visible copyable JSON. The UI accurately reports that a download was requested rather than asserting the file was saved.

Final options verification: all 52 tests pass. Undoing a record erase preserves new records earned afterward. Player 2 tuning changed with a native slider key press persisted across reload before any race was started; the test value was restored. Browser console remained free of runtime errors.


Water datum / floating scenery verification (2026-09-10):
- All 57 tests pass. Five new regressions cover a smooth ebb, hull equilibrium on the moving datum and restart, actual high-water passage versus low-water collision, ice collision at its drifting position, and floating-object attitude against a known inclined surface.
- Existing 36 venue/class route traversals, head-to-head runs, stunt routes, complete Normal championship, salvage success/failure/restart and water-response tests still pass.
- Rendered Tempest Island, Normal, venue sea: 181.433 seconds, 72 crossings, zero misses, 20 measured landings, High quality, final frame window 60 FPS.
- Rendered Glacier Passage, Normal, venue sea: 187.650 seconds, 72 crossings, zero misses, three measured landings, High quality, final frame window 60 FPS.
- In-app screenshots inspected water contact, changing reflected shoreline, wave-driven marker tilt and icy-water reflections. Browser error log empty. The visible verification driver used ordinary helm input with a 4x simulation clock. No records from these runs were saved.
- Tide rate is compressed for gameplay; current paths are analytic approximations. No full fluid solver or physical controller validation is claimed.


## Course-passage milestone (2026-09-10)

- All 64 automated tests pass. Seven new tests cover closed/raised gate collision, walls/roof, harbour floor, ordered shortcut planes in Expert/Reverse, actual outer-first-lap/sluice-later-lap driving, continued optional outer-route playability, stunt checkpoint preservation in all eight passage venue/class combinations, and camera sight-line collision.
- Rendered Citadel Sound Hard completed 84 crossings with zero misses in 181.317 seconds, with 14 measured landings. High graphics, final measured window 60 FPS.
- Rendered Port Meridian Reverse completed 96 crossings with zero misses in 196.383 seconds. High graphics, final measured window 60 FPS. Inspection held at 50.150 seconds at the narrow tunnel entrance; riders and reflected structures were visible, and continuing the same run reached the result screen.
- Citadel inspection held at 77.950 seconds on lap two with the sluice raised and three riders approaching its interior. Shared waves, wake/foam, the lifted grille and reflected sign were visible.
- No runtime errors appeared in these browser checks. Verification uses ordinary helm input with a 4x simulation clock. No records from these runs were saved.
- Corrected route checkpoint ordering, carved the shortcut floor, lengthened entrance funnels, kept stunt guidance through mandatory checkpoints, and added camera collision. Static rock bases now sample nearby terrain so they sit into slopes; the outer-channel sign has support posts.


## Larger waves and free-ride stunt playground — September 10, 2026

- 85 automated tests pass. Existing race, championship, timed stunt, split-screen, speed, shore recovery, tide and salvage loops remain covered.
- Four long-wave bands have 2.1x amplitude and wavelength, with deep-water dispersion recalculated. The ten smaller bands retain their previous scale. CPU buoyancy and GPU displacement share the spectrum.
- Every free-ride venue now has four floating ramps and twelve rings. Ramp footprints and landing corridors are verified in water in all 36 venue/class combinations.
- Ordinary helm verification launches from the first ramp, collects an air ring, lands, and brakes in all nine venues under calm, chop and storm conditions (27 runs).
- Free ride remains active beyond the timed mode's deadline. Ring cooldowns permit another collection. New sessions reset score and rings. Floating visual decks, hull contact and attached rings share the same tide/swell height function.
- A browser free-ride run on Tempest Island in storm swell completed the jump, ring and landing: 50 points, one ring, approximately 4.54 m peak clearance above the sampled water; no JavaScript errors.
- Ramp frames, pontoons, contrasting edges, chevrons and signs were visually checked. Labels face the approach. A compact HUD gives the nearest ramp direction, score and trick keys.
- Ramps are rigid platforms with filtered wave heave; they do not simulate mooring ropes or structural flex. Rings are arcade stunt targets.

- Browser timed Stunt Run on Tempest Island / storm: completed in 71.30 simulation seconds, 4/4 checkpoints, 8 rings, 6 tricks, 6 landings, 6,616 points. High graphics; final frame-rate window 60 FPS. No JavaScript errors.

# Wave Race parity audit

Target: an original browser implementation of Wave Race 64's gameplay features, with modern water graphics. Preserve the user's priority: believable water and jet-ski response come before secondary content. The salvage voyage remains at index.html; race.html hosts racing and free riding.

## Reference requirements

Primary reference: [Nintendo instruction booklet](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_8/Manual_Nintendo64_WaveRace64_EN.pdf), pages 6–17. Scoring detail: [US manual page 13](https://www.manualslib.com/manual/4366169/Nintendo-Wave-Race-64.html?page=13).

Firsthand course observations: [Disco1960 course FAQ](https://gamefaqs.gamespot.com/n64/199278-wave-race-64/faqs/35473) and [Jdude84 course FAQ](https://gamefaqs.gamespot.com/n64/199278-wave-race-64/faqs/3344). Higher classes open the fortress gate from lap two; a harbour tunnel is available throughout higher-class races. These mechanics use original layouts and scenery here.

## Current implementation and evidence

`npm test`: all 106 tests pass. Test files are in tests/. Detailed browser evidence and earlier milestones are in VALIDATION.md.

The baseline is the original 1996 release described in the Nintendo booklet and [Nintendo operation card scan](https://nintendo64.pl/wp-content/uploads/Wave-Race-64-USA-Quick-Reference-Card.pdf). Course names, layouts, music and visual assets are original. This is gameplay feature equivalence, not an emulated ROM. The later Japanese Shindou edition's ghost/rumble extensions are not represented as part of this baseline.

| Newly closed gap | Current evidence |
| --- | --- |
| Rocket start | A fresh throttle edge near green grants maximum power; early held and late inputs do not. Integrated countdown test passes. |
| Quick turn | Rearward trim plus steering increases contact-dependent yaw/grip with a speed cost. Turn comparison and airborne restrictions pass. |
| Collision stability, wipeout and remount | Rider masses vary with stability; collision impulses conserve momentum. Hard shore/craft collisions and bad stunts eject the rider. Throttle tapping shortens a continuous remount. Real shoreline test and rendered wipeout inspection pass. |
| Practice dolphin and bonus mount | Flexible original dolphin and safe-water guide. All twelve rings and eight moves in a timed park run unlock the mount. Ordinary-input and browser runs earned 10,539 points in 52.217 seconds, without crashes; saved unlock and rendered mount verified. |
| ElevenLabs sound with minimal voice | Eight local generated clips: engine layers, water, wind, splash, impact, cue and optional instrumental. No announcer/TTS. Browser decoded 8/8; stereo, pause, mute, fallback and asset checks pass. Used 868 existing credits, no purchase. |

| Requirement | Current evidence |
| --- | --- |
| Four riders with distinct speed, acceleration, grip and handling; adjustable tuning | race-core.js, rider selection and persistence; race/versus/save tests |
| Four-rider championship, 6/7/8 venues, Normal/Hard/Expert/Reverse, previous finish determines grid | championship.js, courses.js; complete circuits in all four classes tested, plus all 36 venue/class routes. Browser Normal warm-up, six rounds, final standings and persisted Hard unlock verified. Round restart restores pre-round points and grid |
| Original scoring and qualification | 7/4/2/1 points, DQ zero. Normal thresholds 1/2/4/8/12/16; Hard 2/4/6/10/14/21/28; Expert 2/4/8/12/16/23/30/37. Scoring and grid tests |
| Nine venues including practice; changing conditions and course obstacles | Nine distinct layouts/scenery; lake fog clears; island swell and ebb expose a coral shoal; ice drifts at collision-consistent positions. courses/course-environment tests |
| Lap-dependent fortress passage and harbour alternative | course-passages.js shared by geometry, collisions, checkpoint guidance and chase cameras. Tests verify closed/open gate, floor/walls/roof, ordered checkpoint crossings, alternate outer path, all classes/reverse, and mandatory stunt checkpoints. Rendered Hard Citadel and Reverse Port races completed without misses |
| Red/right, yellow/left, five power levels, missed-buoy reset, five-miss DQ and five-second course-out | race-core.js and race tests. Neutral channel checkpoints span both legal routes and award no buoy power |
| Three laps by default, configurable lap count | menu and race-core.js; separate record keys by lap count |
| Time trials, best lap, top-three records, initials, tuning distinction, reached-course restrictions | race-records.js, race-feedback.js and menu/record tests; browser persistence, saved best-lap comparison and ranked result table checked. Custom sea states are unranked |
| Stunts: four timed checkpoints, ring chains, rotations, rider poses, somersault and dive | stunts.js/stunt-rider.js; all nine normal routes plus all passage-venue classes tested; Pelican routine inspected in browser. Forward/back trim changes real ramp takeoff velocity and jump height |
| Two-player horizontal split screen, same-rider selections, tuning and optional catch-up | player-input.js/race-view.js; all eight competitive venues complete via independent controls. Rendered same-rider storm and low-quality night matches, pause/restart verified. Swappable liveries checked in Amber Bay; same-rider alternate colour enforced |
| Options, names, sound modes, music, record erase, portable saves | race-options.js/race-records.js/audio.js; browser import/export/download/undo/reset/persistence verified; automated Web Audio graph coverage |
| Convincing shared water surface and physical hull response | shared CPU/GPU spectrum, heave/pitch/roll, planing, airborne motion, wet grip/intake, landing disturbances, momentum-carrying spray, Fresnel/depth/reflections/caustics/foam. Hydrodynamics, spray and water-response tests; rendered storm/free-riding inspections |
| Pause/restart, camera orbit and adaptive graphics | keyboard and browser checks; independent split cameras; passage camera collision. High and Low rendering inspected with no runtime errors. Lap delta and nearest trailing-rival feedback tested and observed |
| Original salvage loop and saved source | all three recoveries/two deliveries, partial success, capacity/damage/failure/restart covered by simulation and browser checks; README.md and source ZIP |

## Completion audit

- All nine venues inspected in the final renderer, including Amber Bay split screen, Reedwater fog, Glacier scenery, Neon reflections and Tempest water. Full-course passage, storm and night multiplayer runs supplement the starting-view sweep.
- Normal championship completed in the browser through warm-up, all six transitions, champion result and persisted Hard unlock. A round-two restart retained the first-round points and starting grid. Hard, Expert and Reverse complete circuits and unlock rules passed simulation tests.
- Integrated checks covered water contact, jumps and landing effects, cameras, time trials, stunts, split screen, pause/restart and save flows. Tested High runs reported about 60 FPS in their final measured windows; this is not a universal performance guarantee. Browser runtime error logs were empty.
- Rechecked the gameplay matrix against the reference manual. This is an original browser interpretation of its core feature set, with the explicit approximations below; it does not reproduce Nintendo assets, exact course layouts or hardware presentation.

## Deliberate approximations and verification limits

Buoyancy uses distributed support, not CFD. Reflection is planar. Foam, caustics, spray and current paths are procedural approximations. Tempest's ebb is compressed into a race. Stunt dive/poses are arcade maneuvers. Sound uses local ElevenLabs clips with synthesized fallback; subjective listening quality and physical gamepad hardware remain unverified. The original salvage mode retains its earlier handling model. Nintendo assets and course layouts are not reproduced.

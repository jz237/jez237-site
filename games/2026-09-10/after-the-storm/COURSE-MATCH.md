# Original course matching — active work

Goal: match the original Wave Race 64 courses, including recognisable geography,
buoy arrangements, obstacles, race ramps, alternate paths and lap changes.
The previous PARITY.md only established broad gameplay systems. It does **not**
prove this course-matching goal. None of the nine courses is signed off yet.

## Reference evidence

- [Illustrated Normal routes](https://chirimenzeyo.ari-jigoku.com/game__waverace/01_wr_64/kouryaku_1_normal.html)
- [Hard routes](https://chirimenzeyo.ari-jigoku.com/game__waverace/01_wr_64/kouryaku_2_hard.html)
- [Expert routes](https://chirimenzeyo.ari-jigoku.com/game__waverace/01_wr_64/kouryaku_3_expert.html)
- [Reverse routes](https://chirimenzeyo.ari-jigoku.com/game__waverace/01_wr_64/kouryaku_4_reverse.html)
- [Pyro Vesten's firsthand course observations/maps](https://www.cheatcodes.com/guide/faq-course-maps-wave-race-64-n64-23194/)
- [Disco1960's course walkthrough](https://gamefaqs.gamespot.com/n64/199278-wave-race-64/faqs/35473)
- [Original Nintendo presentation](https://www.nintendo.co.jp/n01/n64/software/nus_p_nwrj/index.html)

Illustrated maps are inspection references in work/course-reference; they are
not shipped game textures. World distances are reconstruction estimates.
The four difficulty pages have been retrieved, and all eight Reverse diagrams,
all six Normal diagrams, plus Expert City/Glacier and Hard/Expert Beach inspected.
Remaining diagrams still require inspection before their buoy layouts are authored.

## Course requirements and current state

| Course | Distinctive requirements | State |
| --- | --- | --- |
| Sunny Beach | Long sandbar, parallel straights, tight ends, open sea and mainland, difficulty-specific slalom | Rebuilt geography; exact buoy placements and visual sign-off pending |
| Sunset Bay | L-shaped landmass, orange water, race jump, piers and bypass choices | Rebuilt island/route and race ramp; piers, bypasses and buoy placement pending |
| Drake Lake | Irregular square loop, small island, fog clearing, posts, slowing weeds | Rebuilt banks/island, posts and wet-hull weed resistance; route/visual checks pending |
| Marine Fortress | Storm, fortress-shaped shoreline, crates, lap-dependent gate | Rebuilt eastern arm, northwestern breakwater, fort walls, difficulty-specific crates and curved lap-two gate; original buoys, southern projections and final visual comparison pending |
| Port Blue | Tanker, working dock, winding narrow tunnel, Hard route choice, Expert/Reverse outer closures, class-specific jump | Rebuilt geography/tunnel and corrected required Expert/Reverse inner route; race jump, original buoy patterns and final visual matching pending |
| Twilight City | Angular urban channel, walls, race ramps and alternate routes | Existing generic course; full reconstruction pending |
| Glacier Coast | Constricted coast, ice ramps/sliding, breakable ice hazards | Existing generic course; full reconstruction pending |
| Southern Island | Connected islands/piers, dropping water, exposed ship and changing routes | Existing generic course; full reconstruction pending |
| Dolphin Park | Enclosed basin, kidney island, two main ramps, jetties and tunnel | Existing generic course; full reconstruction pending |

Each course requires visual comparison, ordinary-input traversal on all classes,
actual obstacle/ramp/shortcut interactions, and regression checks for stunts and
split-screen. Passing navigation alone is insufficient. Existing record keys also
need layout revisions so old course times cannot compete with reconstructed ones.

Do not publish or declare course parity from this initial geography pass.

## First geography milestone — September 10, 2026

- Sunny Beach, Sunset Bay and Drake Lake now use explicit authored shorelines and route shapes in classic-courses.js. Legacy internal IDs are retained for compatibility; record revision handling remains outstanding.
- Sunset's ramp is available in race modes, with a navigable outer bypass. Drake's eight posts retain collisions; wet hulls lose speed in the same elliptical weed patches rendered by the scene.
- New checks cover land/water cross-sections, L-shaped geography, race-ramp presence, continuous route clearance and actual weed drag. An additional collision test covers escape from a post overlap.
- Full suite: 110/110 passed in 67.05 seconds. After adding the last overlap test, all five focused reconstruction tests passed; 111 distinct checks are covered. No runtime code changed after the full run.
- Browser Sunny Beach / Normal / chop: 161.733 seconds, 72 gates, zero misses, nine landings. Sunset Bay / Normal / chop: 246.900 seconds, 72 gates, zero misses, two landings. Both finished second; High graphics and 60 FPS in final measurement windows. Runtime error logs were empty.
- Browser Drake Lake / Expert / venue conditions: 186.617 seconds, 96 gates, zero misses, no wave landings, second place. High graphics, final 60 FPS; runtime error log empty.
- First inspection confirmed the sandbar/mainland separation and L-shaped minimap, with reflected coast and the race jump. Final scenery, pier collision, original buoy patterns and water palette matching are still required.

This milestone is local only. Production still serves the previous completed gameplay release.

## Fortress geography milestone — September 10, 2026

- Reconstructed the Marine Fortress landmass from the Normal/Hard/Expert illustrated maps, including the projecting eastern arm and the northwestern breakwater. Floating wooden crates now have difficulty-specific counts (3/7/10) and share their rendered movement with collision.
- The inner passage follows a curved route with a separate physical gate arch. Riders that entered the outer route before the gate opened finish that route. Shortcut checkpoint planes require actual crossings; the exit rejoins in the direction of travel.
- Navigation follows the dense authored shoreline bends, preserving normal steering inputs and checkpoint adjudication. Airborne hulls can clear low terrain; descending hulls still collide.
- Full regression suite: 115/115 passed, 71.31 seconds. All four fortress classes completed through ordinary inputs with zero misses in the direct simulation.
- Browser Marine Fortress / Expert / venue conditions: 233.117 seconds, 96 gates, zero misses, 15 landings, second place. High graphics, 60 FPS in the final measurement window, no runtime errors.
- The browser minimap confirms the long eastern arm and distinct inner/outer routes. Gate inspection reached lap two, but its paused overlay obscured the scene: final unobscured visual comparison is still required. Exact buoy patterns, southern breakwater detail and original stunt placement remain incomplete.
- Inspected Normal, Hard and Expert Port Blue reference diagrams for the next reconstruction. No Port Blue geometry has been changed in this milestone.

This remains a local reconstruction milestone, not a publication or a course-parity sign-off.

## Port Blue geography milestone — September 10, 2026

- Reconstructed the long tanker and outer dock basin using the inspected Normal/Hard/Expert diagrams. The tanker has a solid collision footprint, hull/deck mesh, stern bridge, pipework and railings. Its mesh is separated from the rendered seabed to prevent rocky terrain protruding beneath its sides.
- Hard and above can take the winding low-roof inner channel; Normal keeps it closed. Both sides of the continuous tunnel use shared mitered wall centerlines for rendering and hull/camera collision. The outer route remains available.
- Fixed ambiguous checkpoint selection where the branch and outer route approach each other: the nearer checkpoint supplies the crossing plane. No stationary or arbitrary progress is granted.
- Focused geography/passage checks: 17/17 passed. Full suite: 116/116 passed in 74.49 seconds. After separating rendered ship/dock meshes from the seabed and adding concrete quays/cranes, all 10 geography tests passed again. The collision height field retains the same maximum of ship, dock and shore heights.
- Browser Expert / venue conditions: 208.767 seconds, 96 gates, zero misses, no wave landings, third place. High graphics and 60 FPS in the final measurement window; runtime errors empty. Inspected the water-filled bent tunnel and tanker side during ordinary-input traversal.
- Browser Normal / venue conditions: 220.683 seconds, 72 gates, zero misses, no wave landings, third place; High graphics and final 60 FPS.
- Added explicit concrete quay meshes and working-harbor cranes/containers, and excluded vegetation from ship/dock footprints.
- Original class-dependent bow jump is not implemented yet. Original buoy placement, port fittings and final material/detail comparison remain outstanding. These are required before course parity can be signed off.

Local-only milestone; production remains on the previous gameplay release.

## Port Blue difficulty correction — September 10, 2026

The Expert walkthrough explicitly says the easier outer dock route is blocked and the inner route is mandatory. This supersedes the previous milestone's assertion that the outer route remains available in every class. Hard retains the choice; Expert and Reverse now use authored inner-route anchors and physical northern/southern quay closures. Closed areas share their footprint with terrain collision and explicit concrete meshes. Required-course checkpoints follow the inner route directly rather than projecting the former outer checkpoints onto it.

Focused tests cover all four class states, dry closure footprints, actual hull contact, continuous route clearance, Hard's optional outer race, Expert/Reverse navigation and stunt progression. All 18 focused geography/passage tests pass. Full regression suite: 117/117 passed in 75.03 seconds. Browser Expert / venue conditions finished in 197.300 seconds with 96 checkpoints, zero misses, one wave landing and third place; High graphics, final 60 FPS, no runtime errors. The rendered minimap follows the required winding route.

Additional source findings for the remaining jump work:
- Normal's bow jump can be bypassed on the inside.
- Hard widens it but leaves a narrow gap on the right.
- Expert closes that gap and requires a jump before the final turn.
- The Reverse diagram shows separate small jump blocks; do not assume the Expert ramp simply rotates to face the rider.
- The Reverse Sunset walkthrough explicitly calls its backward-facing ramp an obstacle. Existing global reversal of race-ramp direction must be replaced with source-appropriate fixed ramp geometry and backward-contact behavior when this work is implemented.

The bow jump is still pending. This correction is not a full course-parity sign-off or a publication.

## Fixed ramp orientation milestone — September 10, 2026

- Authored race ramps now preserve their physical world direction in Reverse. Sunset Bay no longer rotates its ramp to launch reversed riders.
- Raised rear faces are visible and solid. A low backward approach loses forward speed and is separated from the face without receiving lift; an airborne hull above the ramp or a rider outside its width can clear it. Generated stunt ramps retain their mode-specific approach direction.
- Focused ramp/geography tests: 18/18 passed, including backward contact, airborne clearance, lateral bypass and forward launch behavior.
- This implements the backward-obstacle behavior described in the Reverse Sunset source. Port Blue's class-specific jump geometry remains to be authored. Exact ramp dimensions, original buoy placements and scenery fidelity remain subject to final course comparison.
- Full suite: 118/118 passed in 75.91 seconds. Browser Reverse Sunset Bay / venue conditions: 222.133 seconds, 96 checkpoints, zero misses, three wave landings, third place. High graphics, final 60 FPS; no runtime errors. This is traversal evidence, not a substitute for exact source-level buoy and obstacle matching.

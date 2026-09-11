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
| Port Blue | Tanker, working dock, winding narrow tunnel, Hard route choice, Expert/Reverse outer closures, class-specific jump | Rebuilt geography/tunnel, required Expert/Reverse inner route and class-specific bow jumps; original buoy patterns and final visual/scale matching pending |
| Twilight City | Angular urban channel, jump-or-dive wall, low sand point, four race ramps and metal balls | Rebuilt channel/quays, sand point, ramps and metal props; wall shortcut, original buoys and final visual matching pending |
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

## Port Blue bow jump milestone — September 10, 2026

- Normal and Reverse have three separated small ramps at the bow. Hard has a wider jump with an outside water gap; Expert's larger jump spans the racing corridor. Dimensions are reconstruction estimates from the illustrated reference maps, not extracted original geometry.
- Port Blue now uses an explicit mapped course boundary for out-of-bounds adjudication and visible perimeter floats. The old fixed 30-metre distance from generated checkpoints wrongly excluded Hard's outside bypass. Other courses retain their existing boundary behavior pending their original layouts.
- A real-step Hard bypass test crosses the jump area without ramp contact or leaving the boundary. An ordinary-input Expert race contacts the bow jump and lands on every lap, with zero missed checkpoints.
- Focused geography/ramp checks: 13/13 passed. Exact original buoy coordinates, jump scale/detail comparison and the remaining courses still require work.
- Full suite: 120/120 passed in 74.67 seconds. Browser Expert / venue conditions: 201.483 seconds, 96 checkpoints, zero misses, three jump landings, third place. High graphics, final 60 FPS.
- Extended the existing verification-only apex/landing controls to race ramps. The first apex inspection caught an oversized sign obstructing the camera; wide ramps now use a capped side-mounted sign. The game physics did not change after the full-suite run.
- Reinspection after the sign fix showed the ski visibly airborne beyond the ramp, with an unobstructed forward view: apex 2.569 metres above the local wave surface at 52.19 km/h, zero wet contact, zero compression/load. Runtime errors were empty. This proves the rendered jump interaction; original scale and final detailing are still estimates pending comparison.

## Twilight City geography milestone — September 10, 2026

- Rebuilt the outer race route, narrow northern bend, diagonal return basin, central/eastern quays and low sand point from the Hard/Expert maps, also inspecting the Reverse diagram. Added four fixed race ramps; the first moves farther from the future wall position in Expert/Reverse, as shown in the reference.
- Metal balls now render as buoyant steel spheres using their physical obstacle positions. Concrete quay meshes are separated from rendered seabed vegetation. The existing night skyline and reflected windows remain; architecture/material fidelity is not yet signed off.
- The jump-or-dive shortcut wall is NOT implemented. The current guided route uses the outer route. Original buoy positions are still generated. Exact obstacle counts also need class-specific review: the shared Hard extra-obstacle rule currently adds four, while the city Hard reference appears to show the baseline clusters. Do not treat this milestone as final obstacle parity.
- Improved guidance around fixed ramp backs and aimed obstacle detours beyond the obstacle. Starting rear-ramp avoidance too far away caused a nearby Reverse buoy miss; closer avoidance fixes it. Free-ride ramp placement now checks the longer landing corridor and can use another safe part of the course when a quarter is too narrow, while keeping ramps separated.
- Full suite: 121/121 passed in 80.93 seconds. All classes finish via ordinary inputs under the existing regression limits. No test expectations were relaxed.
- Browser Hard / venue conditions before the final navigation refinements: 289.183 seconds, 84 checkpoints, zero misses, four landings, fourth place; High graphics and final 60 FPS, no runtime errors.
- Visual inspection during the corrected Reverse run confirmed the concrete waterfront, reflected city windows and distinct diagonal course shape. The final course-match audit must still compare the shortcut, buoys, obstacle counts and original stunt placements.

This is local only and has not been published. Glacier Coast, Southern Island and Dolphin Park still need geography reconstruction.
- Corrected browser Reverse / venue conditions completed in 288.200 seconds: 96 checkpoints, zero misses, one landing, third place. High graphics, final 60 FPS; runtime errors empty.

## Twilight City obstacle correction — September 10, 2026

- Magnified the Hard, Expert and Reverse reference diagrams to distinguish dots partly covered by the plotted route. Hard/Reverse show five balls in the northern cluster and four in the southern row. Expert shows seven in each cluster. This supersedes the earlier rough count and shared extra-obstacle rule.
- Added explicit per-class obstacle arrays: Hard/Reverse have nine balls; Expert has fourteen. The optional Normal version uses the Hard layout, since the original Normal championship does not include Twilight City. Instantiation clones these arrays so runtime state cannot alter the authored layout.
- Updated cluster positions from the diagrams, including the middle northern balls and staggered Expert southern row. Exact world scale remains an estimate; the diagrams are references, not shipped artwork.
- All four classes completed ordinary-input direct simulations with zero misses: Normal 271.083 s, Hard 276.383 s, Expert 287.583 s, Reverse 288.050 s.
- The wall shortcut and original race buoy placement remain outstanding. No publication or full-parity sign-off is implied.
- Full regression suite: 122/122 passed in 78.91 seconds. The rendered Expert cluster was inspected during the browser race, with no runtime errors.
- Next wall-shortcut work must support both over-wall jump clearance and below-wall dive clearance using shared visible/collision geometry. Existing submarine control only triggers during airborne descent and lasts 1.25 seconds; verify the actual timing window rather than assuming a moved ramp automatically makes the dive possible.
- Browser Expert / venue conditions finished in 287.583 seconds, with 96 checkpoints, zero misses, six landings and second place. High graphics and final 60 FPS.


## Twilight City wall shortcut — September 10, 2026

- Implemented the inner jump/dive shortcut with a finite raised concrete wall. Its visible mesh, hull collision and camera obstruction share the same dimensions. The main outer route remains available; Reverse guidance uses that route.
- Hard's nearer first ramp launches over the wall. Expert's farther ramp requires a descending submarine dive. The dive now lasts 1.5 seconds and targets a deeper submerged draft so the existing larger waves do not force the hull into the wall underside. Activation still requires airborne descent; ordinary stunt activation and resurfacing tests pass.
- Actual-step tests verify three Hard over-wall crossings and three Expert below-wall crossings, zero wall impacts and zero missed checkpoints. A separate Expert outer-route run completes all checkpoints. Surface collision, finite ends and camera clearance are also covered.
- All 127 regression tests passed in 81.32 seconds. This includes the new shortcut tests and existing stunt/playground coverage. No expectations were relaxed. Subsequent edits only clarify the course description and add F dive on descent to the visible controls.
- Browser Expert / venue conditions: inspected at the wall at 18.833 seconds, hull y -1.21 metres with 0.23 seconds of dive remaining. Rendered wall and underwater route were visible. Completed in 275.300 seconds, second place, 96 checkpoints, zero misses, High graphics and final 60 FPS. No runtime errors were reported at the inspection.
- The course shape, scale and generated checkpoint sequence remain reconstruction estimates. This milestone supersedes the earlier missing-wall notes; it does not establish full original-course parity. Glacier Coast, Southern Island, Dolphin Park, original buoy sequences and remaining course details still require work. Local only; not published.
- Browser Hard wall inspection: 14.750 seconds, hull y 2.27 metres above the 1.35-metre wall top, no dive active, 60 km/h. The ski was visibly airborne above the wall and the chase view was unobstructed. No runtime errors.


## Glacier Coast geography reconstruction — September 10, 2026

- Inspected the Expert and Reverse Cool Wave maps and their guide text in the saved reference set. The Reverse diagram is rotated; fixed ramp directions must remain in world space. Replaced the generic looping channel with the long peninsula, narrow western straight, northern coastline/corner and eastern return shown in the Expert diagram.
- Authored three west-straight ramps and one eastern return ramp, plus ten small floating ice hazards near the western straight and northeast return. Scale, ice counts/positions and ramp dimensions remain estimates; this is not final obstacle parity.
- Direct Expert and Reverse three-lap runs finish with zero missed generated checkpoints, at 225.267 and 232.300 seconds respectively. Fixed ramp backs remain physical obstacles in Reverse. Tests separately check mapped land/water points and preservation of ramp orientation.
- Browser inspection caught decorative large ice rocks protruding into navigable water without matching collision. Their complete footprint must now lie on land. Small physical ice obstacles remain buoyant and retain their existing shared collision/render motion.
- Still required: the broad northern rideable ice shelf, southern slalom ice sheets, low-grip momentum-preserving traversal and steering consequences, original buoy coordinates/colors, and full source comparison. The guide explicitly describes almost no steering while riding ice; ordinary hull/land collision does not satisfy that requirement. Do not claim Glacier Coast feature parity from navigation tests.
- Full regression suite: 129/129 passed in 80.84 seconds. Browser Expert completed in 225.267 seconds, second place, 96 checkpoints, zero misses and three landings; High graphics, final 60 FPS. The later decorative-rock placement change affects scenery only; reloaded browser reported no runtime errors. Local only, not published.


## Rideable ice — work in progress, not a release

- Added five outlined ice surfaces from the Glacier Coast diagram: the northern shelf and four southern floes. Mesh extrusion and contact use the same polygon outlines and elevations. New ice-surfaces.js supplies contact/support independently from the water solver.
- Contact preserves horizontal momentum with mild friction, removes water propulsion and lateral water grip, damps yaw inertia, and supports the hull above the ice. Leaving resumes wave buoyancy. Open-water rescue destinations exclude sheets; a ski stopped on ice can be recovered. Ice/shore contact preserves tangential velocity instead of reversing the entire velocity.
- Three focused tests pass for momentum/no steering grip, wave-contact restoration and finite polygon boundaries. These tests do not establish race integration or original physics parity.
- Integration is currently failing: Expert reaches five missed checkpoints at 239.750 seconds; Reverse remains at checkpoint 20 after 363.650 seconds near the northern shelf. Approach guidance is provisional and must be corrected; do not relax checkpoint tests or publish this state. Full regression suite and browser verification must run after fixing the route. Steering-induced loss of balance and matching original buoy sequences also remain outstanding.


### Ice integration follow-up — still work in progress

- Refresh individual wave-height samples and the water datum during ice support while applying no water force. This prevents stale submerged samples from being reused when the ski leaves a sheet. Added a regression check for moving waves and a stopped-on-ice rescue check preserving lap/progress.
- Northern shelf guidance now has separate approach, entry and exit points for each direction, committed per lap. Added the mapped outer perimeter rather than a generated-checkpoint distance corridor; the original broad northern turn must remain legal water.
- Reverse now completes three laps at 283.217 seconds with one miss (gate 7 on lap 2, map approximately 185,404 on south-1). The earlier northern stall is resolved in this run. Expert still fails at five misses at 207.850 seconds: gates 26 and 28 on each of the first two laps near map 149,413 and 103,452, plus gate 11 on lap 2 near map 186,88. These remaining generated checkpoint/source alignment problems are not accepted as parity.
- Focused ice and shore-recovery checks: 9/9 passed. Full suite and browser verification remain pending until integration failures are fixed. Changes remain uncommitted and unpublished.


## Glacier Coast mapped buoys and ice integration — September 10, 2026

- Reinspected Expert and Reverse diagrams. Expert has sixteen course buoys and Reverse fifteen; consecutive colors are intentional. Reverse map coordinates are rotated 180 degrees into the same world geography. Added per-class buoy coordinates/colors and retained the authored finish plane. Optional Normal/Hard use the Expert pattern because the original championship offers this venue only in Expert/Reverse.
- Mapped gates preserve the buoy position and derive a crossing direction from the local course tangent. Navigation now uses actual route indices for uneven checkpoint spacing. Buoy-side adjudication remains unchanged. Pixel-to-world scale and precise crossing-plane orientation remain reconstruction estimates.
- Set the approach angle before the northern shelf and the Reverse southern floe. Motion while on ice still has no water propulsion or lateral grip; navigation does not move the ski or advance checkpoints directly. Direct ordinary-input runs now finish with zero misses: Expert 350.650 seconds, Reverse 356.733 seconds. This supersedes earlier failing ice integration runs.
- Full-suite first run: 132 passed, three failed. The stunt regression came from dividing uneven race buoys into four timed sections; stunt mode now builds its own evenly spaced internal route gates. Direct Glacier stunt verification completes all four checkpoints in 99.850 seconds with 2,800 points. Original stunt-object placement is still outstanding.
- The two remaining first-run failures were the old 20,000-step (333-second) simulation cutoff. Expanded those test budgets to 36,000 steps (ten minutes) to cover the requested 5–10-minute session and the approximately six-minute ice course. Finish, no-DQ, checkpoint-count and zero-miss assertions remain intact. The focused geography test uses a 400-second budget.
- Browser Reverse / venue conditions completed in 356.733 seconds, third place, 48 checkpoints (16 per lap including finish), zero misses and seven landings, High graphics and final 60 FPS. No runtime errors on the inspected run. Source images remain reference-only and are not shipped.
- Still incomplete: steering-induced loss of balance on ice, detailed ice/obstacle size matching, final visual comparison, other courses' original buoy sequences, Southern Island and Dolphin Park reconstruction. No full-parity or publication claim.

- Final guidance correction: a two-point ice approach must retain its exit target until reached; previously it was released on first contact. Optional Normal/Hard now use an earlier final-floe approach to account for their lower guided pace. Direct final runs: Normal 357.267 s, Hard 345.550 s, Expert 350.650 s, Reverse 328.583 s, all zero misses. No checkpoint thresholds or physics were weakened for these corrections.
- Added a verification-only ice-slide hold. Browser inspection at 16.183 seconds on south-4 showed hull y 0.56 m, zero water contact and 39.28 km/h over the rendered slab; no runtime errors. Ice shapes/materials are still simplified and some buoy/ice edge detail needs final visual alignment.
- Final full regression suite: 135/135 passed in 87.91 seconds, covering every venue/class, stunt checkpoints, two-player races, ice contact and recovery. Local only; not published.
- Final browser Reverse verification after the exit-target fix: 328.583 seconds, second place, 48 checkpoints, zero misses, six landings, High graphics and final 60 FPS. Runtime errors empty.

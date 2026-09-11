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
The four difficulty pages and local diagrams have been retrieved. Per-course
transcription and verification evidence is recorded below. Untouched buoy layouts
still require their own source comparison before they can be signed off.

## Course requirements and current state

| Course | Distinctive requirements | State |
| --- | --- | --- |
| Sunny Beach | Long sandbar, parallel straights, tight ends, open sea and mainland, difficulty-specific slalom | Rebuilt sandbar; original class buoy maps and metal-ball rows transcribed and race-tested; final shoreline/visual sign-off pending |
| Sunset Bay | L-shaped landmass, orange water, race jump, piers and bypass choices | Rebuilt island/ramp, original class buoy sequences, Expert slalom, steel balls and physical piers; all-class under-pier traversal, penalized final-lap bypass, shared three-wave field and moored launches verified; source calibration and visual sign-off pending |
| Drake Lake | Irregular square loop, small island, fog clearing, posts, slowing weeds | Rebuilt banks/island, posts and wet-hull weed resistance; all four original buoy sequences transcribed and race-tested; complete 13-post layout and clean all-class approaches verified; class-specific weed beds and both island channels mapped and tested; shortcut time advantage and final visual checks pending |
| Marine Fortress | Storm, fortress-shaped shoreline, crates, lap-dependent gate | Mapped original class buoys, boundary, finish, crates/timber, southern stone arches and lap-two gate; northern wave-assisted ridge and safe detour tested; source height/timing calibration and final visual comparison pending |
| Port Blue | Tanker, working dock, winding narrow tunnel, Hard route choice, Expert/Reverse outer closures, class-specific jump | Rebuilt geography/tunnel, required Expert/Reverse inner route and class-specific bow jumps; all four original buoy patterns and moved Reverse finish mapped and race-tested; final boundary/visual/scale matching pending |
| Twilight City | Angular urban channel, jump-or-dive wall, low sand point, four race ramps and metal balls | Rebuilt channel/quays, four ramps, class-specific metal props and tested jump/dive wall; original buoys and final visual matching pending |
| Glacier Coast | Constricted coast, ice ramps/sliding, breakable ice hazards | Reconstructed peninsula, original Expert/Reverse buoys, four fixed ramps, rideable ice and balance wipeouts; final source/visual sign-off pending |
| Southern Island | Connected islands/piers, dropping water, exposed ship and changing routes | Reconstructed islands, physical piers/ship, all four buoy maps and two ramps; grid-start ship jump, forward first-lap dives and all-class later-lap passages verified; final source/visual sign-off pending |
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


## Ice balance — work in progress

- Added speed-dependent balance strain from sustained hard steering on ice. The hull visibly rolls as strain builds; continuing to hold throttle once tilted increases strain. Releasing steering restores balance. Crossing the limit uses the existing physical wipeout/remount flow and displays an ice-specific warning.
- The guided rider uses small steering corrections on ice rather than holding full steering indefinitely. This does not grant hull steering grip or propulsion. Existing momentum support, wave refresh and rescue behavior remain.
- Focused ice, rider-action and shore-recovery tests: 16/16 passed, including actual race-loop ice wipeout and releasing steering before the tip. Full course integration is not signed off: latest Expert direct run finishes in 373.700 seconds with one missed buoy. The earlier zero-miss route changed when the controls/roll behavior changed; final-floe approach still needs correction. Do not relax the zero-miss assertion.
- No full regression rerun or browser balance inspection yet. These new balance changes remain uncommitted and unpublished; the previous committed ice/buoy milestone remains 07497110e.


## Glacier Coast balance and slalom correction — September 10, 2026

- Sustained hard steering on moving ice now builds balance strain and visible lean; continuing throttle while tilted worsens it. Releasing steering restores balance without changing horizontal momentum. Tipping uses the existing wipeout/remount system. The AI keeps corrections small on ice rather than holding full steering indefinitely.
- Revisited the guide instruction to avoid the middle floes on Expert and slide over the last one. Corrected the southern route, which had incorrectly crossed the middle sheets, and removed the old final-floe guide. Buoy world positions and side rules are unchanged; checkpoint tangents follow the corrected course line.
- Direct final three-lap runs all have zero misses: Normal 324.300 s, Hard 316.950 s, Expert 303.417 s, Reverse 326.617 s. This resolves the previous balance-integration miss without relaxing its test.
- Focused ice, rider-action and shore-recovery checks passed 16/16. Added ordinary-input verification for deliberately holding hard steering on ice. Browser inspection triggered a wipeout at 18.250 seconds and exposed the fallen rider intersecting the slab. The rendered fallen-rider bounds are now lifted above the ice surface; the correction only applies where an ice polygon exists.
- Balance thresholds and detailed original ice dimensions still need fidelity review. Full original course parity remains incomplete and this work is not published.
- Full regression suite: 137/137 passed in 87.73 seconds. After the render-only clearance fix, the browser reinspection showed the whole fallen rider above the ice with no runtime errors. Local only; not published.


## Southern Island geography and tide clearance — September 10, 2026

- Inspected the Normal and Expert Southern Island maps. Replaced the generic enclosed island circuit with a long eastern sand island, a round western islet, open water between them, and exposed shoal fringes. World scale and shoreline heights remain estimates from the diagrams.
- Added the long eastern deck, diagonal connecting pier, southern cross-pier and short southern spur as wooden decks. Visible geometry and finite hull/camera barriers share dimensions. The existing continuous ebb creates less water depth over shoals and more clearance beneath the piers.
- Actual-step test at the southern cross-pier blocks the ski at high tide and permits a low-tide crossing beneath the deck. Relocated the existing tide/reef probe from the obsolete generated reef at (101,72) to the reconstructed eastern shoal at (118.4,100); the high-water pass/low-water collision requirements are unchanged.
- The guided outer route stays outside the exposed shoals, including a wider northern turn and southern approach around the pier. Direct three-lap checks: Normal 268.717 s, Expert 263.750 s, Reverse 277.750 s, all zero misses. These are legal outer-route checks, not proof of the original inner racing lines.
- Focused geography/tide checks passed 8/8. Removed the decorative rock at the old island center, which is now open water. Browser inspection reported no runtime errors.
- Still required: the ship and jump, original buoy sequences and class-specific racing lines, checkpoint-compatible inner shortcuts, pier supports/central platform detail, proper course signage and original stunt locations. The physical tide-dependent underpass alone does not establish shortcut parity. Local only, not published.
- Full regression suite: 140/140 passed in 90.11 seconds. Browser Expert / venue conditions finished in 263.583 seconds, third place, 96 checkpoints, zero misses and 29 wave landings; High graphics, final 60 FPS. Added a verification-only pier-approach hold for closer visual inspection after the regression run; gameplay code is unchanged.
- Pier-approach browser hold at 59.833 seconds confirmed the wooden deck location and unobstructed outer bypass, with no runtime errors. Decks currently lack supporting piles and central platform detail; those remain required visual/physical work.


## Southern Island pier supports — September 10, 2026

- Added paired supporting piles along the mapped wooden decks and a polygonal central platform matching the diagram's broad junction. The terrain is graded below the platform so it does not protrude through the timber deck. Pile spacing, diameters and vertical dimensions remain reconstruction estimates pending original-detail comparison.
- Rendering, hull collision and camera obstruction share pile centers/radii and platform boundaries. Pile geometry is cached per fixed deck rather than rebuilt for every collision query. Gaps between piles retain low-tide clearance; supporting piles themselves remain solid below the deck.
- Focused barrier/geography checks passed 10/10, covering Southern Island high/low-tide crossings, actual outer-route completion, platform collision, pile contact and Twilight City wall behavior. A subsequent rescue fix rejects destinations inside raised decks or piles; Southern Island/shore-recovery checks passed 10/10 after that change.
- Browser hold at 59.833 seconds confirms visible piles beneath the southern deck and an unobstructed outer bypass, with no runtime errors. The course still needs its ship/jump, original buoy sequences, checkpoint-compatible inner shortcuts and remaining detail; this does not establish full course parity. Local only, not published.
- Full regression run for the pile/platform change: 142/142 passed in 92.99 seconds. The later rescue-destination edit was verified by the focused Southern Island/shore-recovery run noted above.
- Browser Expert finished with the supported piers in 263.583 seconds, third place, 96 checkpoints, zero misses and 29 landings; High graphics, final 60 FPS.


## Southern Island ship and boat jump — September 11, 2026

- Added the northern ship with a pointed hull footprint, timber deck, cabin/windows and edge trim. Hull and cabin collision share their visible dimensions and follow the tide vertically. This is simplified moored-vessel motion; detailed original hull shape and wave-driven rocking remain unfinished.
- Added the southwest-facing boat jump near the mapped position. Adjusted its height and approach slightly after actual physics tests showed an initial short landing on the ship. World scale and ramp profile are reconstruction estimates. The exterior seabed drops more steeply beyond the mapped shoal, preserving the inner exposed shoal while keeping the ramp approach open at low tide.
- Actual-step tests launch from the ramp, cross above the ship's physical hull, and land with zero collision at high and low tide. Surface hull collision remains active at both tide levels. Reverse preserves the fixed ramp direction.
- Full suite: 145/145 passed in 93.89 seconds. Subsequent changes only add a verification input path and ship-deck visual detail/remove the obstructing jump label. The new verification path drives from the normal race grid using ordinary inputs, without changing position or awarding progress.
- Browser jump apex: 33.217 seconds, 5.628 metres above the local water, 58.17 km/h, zero water contact/load/compression, no runtime errors. It exposes the remaining checkpoint mismatch: the guided jump currently misses a generated race buoy. The direct high-speed tests prove physical clearance; the browser apex alone does not prove a successful landing or original race-route parity. Original Southern Island buoys/class routes must replace the generated pattern before the shortcut can be signed off.
- Remaining work includes original buoy sequences, class-specific ship-side choices, checkpoint-compatible pier shortcuts, remaining jumps/signage and source-level visual comparison. Local only; not published.
- Follow-up of the grid-start verification path beyond its apex found a short landing at 34.400 seconds with ship contact after the generated-buoy miss reduced power. Keep this failure visible until original buoy placement and the valid approach are implemented. Do not move the ship/ramp merely to hide the failed low-power line. Reinspection of the deck/label visual change showed an unobstructed view and no runtime errors.


### Southern Island original buoy maps — 2026-09-11, work in progress

Replaced generated alternating checkpoints with transcribed Normal (11), Hard (11), Expert (12), and Reverse (12) buoy sequences, plus the finish. Positions and red/right versus yellow/left colors follow the four original guide images in `work/course-reference`. Expert geography uses the same map with a 128 pixel left margin; Reverse is rotated about the 425 by 652 geography, excluding its extra text margin. Added the mapped outer course boundary. Layout revision is now 3; saved-record key separation remains pending.

Validation: all three new `southern-buoy-maps` tests pass, checking counts, full color sequences, ordered route projections, distinctive class coordinates, and retained physical ramp orientation. These are transcription checks, not proof of full course parity. The existing Southern geography suite currently passes seven of eight tests: its full-race outer-line verification fails with five missed buoys. Direct runs show Normal/Hard/Expert missing eastern gates while Reverse completes all three laps with zero misses (349.58 seconds). The old broad outer route is incompatible with original gate placement. Keep the reference buoys fixed and reconstruct the class-specific approach lines, tidal shoal clearance and pier shortcuts next. A trial increasing global gate approach distance was reverted after an outside-course failure; no checkpoint tolerances or adjudication rules were relaxed. This unfinished reconstruction has not been published.


### Southern Island approach correction — 2026-09-11

Resolved the original-buoy race failure described above by reshaping the eastern approach line and retaining a wide northern turn around the exposed island tip. No buoy positions, colors, gate widths, side rules or miss penalties were changed. The green outer shoal now deepens to -3 m at its edge and rises toward the inner shallows, instead of treating essentially the entire mapped green area as an exposed plateau. This bathymetry is an approximation from the map, not a measured original elevation match. The inner shoal still emerges on ebb; the tide test now samples map pixel (344,450), world (107.2,100), instead of the outer fringe.

All 17 focused tests pass, including ordinary-input three-lap completion with zero misses and no disqualification in all four classes, original buoy transcription, wet eastern yellow approaches at low tide, exposed inner shoal, physical pier clearance, supporting piles and high/low-water ship jumps. These do not prove original shortcut parity or a valid grid-start ship-jump landing, which remain pending. Browser inspection shows correct buoy rendering and no logged errors during the race. Full regression: 149/149 tests passed in 98.14 seconds (`work/southern-original-buoys-tests.log`). No publication yet.

Browser completion: Normal, course sea state, high graphics, 5:05.983 total, zero misses, 36 checkpoints passed, first place, 24 landings, no logged browser errors. Reported 60 fps at the finish; this is a single end-of-race reading, not a performance benchmark.


### Grid-start ship-jump audit — 2026-09-11

The previous inspection activated within 90 m of the ramp while still beside the island, cutting across the northern land and missing the third buoy. It now stays on the race route until the first two buoys are passed and the island tip is rounded. A focused test verifies first ramp contact with three legitimately earned power units and zero misses, using ordinary helm inputs from the grid.

The landing remains incomplete: default course-sea run reaches the ramp at 35.20 s / 16.51 m/s, but contacts the ship before landing at 37.48 s. Full-throttle and longer/aligned run-up experiments, a northern ramp lane, and an earned-full-power lap-two attempt also hit the ship in course waves. Those experimental driver changes were removed; the retained change only fixes premature activation. No ship geometry, ramp geometry, physics, power awards or buoy adjudication was changed. The clean high-speed seeded jump tests must not be presented as evidence of a successful grid-start approach. Next work must resolve the actual launch trajectory/landing clearance and verify the return to the remaining original buoy sequence.


### Ship jump through a normal race start — 2026-09-11

Resolved the demonstrated short landing through helm inputs: a 30 m run-up followed by a takeoff heading 0.4 radians west of the ramp axis crosses the lower forward hull. Full throttle provides the run-up, with three power units earned from the original buoy sequence. No positions, velocities, progress, power or launch impulses are injected, and neither ship/ramp geometry nor physics changed. The inspection driver returns to the normal route after the actual water-landing event.

The new regression starts a four-rider Normal race at the grid in course waves, checks original buoy power at ramp contact, checks every frame of the jump for collision, requires more than ten frames over the physical ship polygon above its deck, verifies landing outside the hull with speed above 10 m/s, and continues all three laps with zero misses and no disqualification. It passes: ship overflight spans 37 frames, clean landing at 36.75 seconds, full race finishes at 442.78 seconds. Solo ordinary-input trial also clears the hull (33 overflight frames). All 11 Southern geography tests pass in 12.12 seconds. This proves one Normal first-lap ship-jump line, not every rider/class/sea-state combination or the still-unfinished pier shortcuts.

Visual inspection confirms the ski above the forward deck at the 35.60 s apex (6.21 m above local water, 60.99 km/h). The landing-inspection button now resumes a held jump rather than restarting a different race, so apex and landing can be inspected as one continuous trajectory.

Continuous browser landing inspection: 36.833 s, 40.57 km/h, full water contact, 0.133 compression, load 8.59, zero misses, no console errors. The game correctly reports HARD LANDING. The deck briefly occludes the chase view during water contact; ship-jump camera clearance remains a visual refinement to address.


### Ship landing camera clearance — 2026-09-11

Changed both chase cameras' raised-barrier visibility origin from the smoothed look-ahead target to the actual ski hull position plus 0.15 m. Looking ahead could leave a clear target ray while the ship deck occluded the player behind it. A head-height origin also left the lower ski hidden and was rejected during visual inspection. Hull-based clearance moves the camera in front of the obstructing deck during the hard water landing, then normal smoothing restores follow distance.

Replayed the same grid-start ship jump in the browser: at the unchanged 36.833 s landing, the rider, ski and contact foam are visible instead of the ship filling the foreground. No browser errors. All 12 existing barrier and passage checks passed. The split-screen camera uses the same fix; split-screen rendering was not separately inspected in this pass. This is a camera-only change; jump physics, race rules and buoy geometry are unchanged.


### Southern pier jump restored — 2026-09-11

Added the missing southern jump at original Normal-map pixel (189,477), pointed southeast toward the southern pier. It shares physical and rendered ramp dimensions, floats with water level, and retains its fixed world orientation in Reverse. Width 13 m, length 10 m and height 2.1 m are estimated reconstruction dimensions; the source map does not supply elevations. The new focused test verifies mapped placement, Reverse orientation and actual ramp contact followed by flight.

First-lap under-pier shortcut remains incomplete. A seeded 20 m/s calm-water approach with a late descent dive reaches beneath the pier but the existing 1.5 s dive expires before clearing its far edge (first collision at 3.60 s, map 240.61/528.62, dive remaining zero). This is deck contact, not a support-pile collision. An experimental 2.6 m ramp height did not resolve the issue and was reverted. Normal surface approach correctly hits the high-water deck. Original southern yellow-buoy checkpoint coverage also needs to permit the inner shortcut without relaxing side rules or granting progress. Do not claim this new ramp proves the original jump/dive shortcut.


### Southern high-water dive clearance and checkpoint span — 2026-09-11

A 0.08 radian southward adjustment from the ramp axis, with a dive triggered on descent below 0.6 m above the sampled water, clears both edges of the southern pier at high tide. Seeded approach trials at 20, 22 and 24 m/s passed without collision. The new paired regression retains the 20 m/s case: the surface landing hits the deck, while the late dive passes under it for multiple simulation frames and emerges beyond map y533. No ramp or dive physics changes were required. This is a seeded approach validation, not yet a grid-start shortcut completion.

The original southern buoy now spans 110 m across both outer and inner routes, instead of the generic 23 m checkpoint width that rejected the source-map shortcut. This applies to the corresponding Normal, Hard, Expert and Reverse map buoy; its position, color, crossing plane, side rule, sequence and course boundary are unchanged. The 110 m span is a reconstruction choice based on covering the mapped water routes, not a measured original engine constant. Other mapped buoys retain 23 m. Paired crossing tests confirm central and inner-route crossings earn progress while wrong-side crossings still miss. All 17 Southern geography and buoy-map tests pass in 12.14 seconds, including all four outer races and the grid-start ship jump. Still required: a normal grid-start southern shortcut in course waves, return to the east-side buoy sequence, late-lap under-pier routes and visual inspection.


### Normal grid-start pier dive — 2026-09-11

Added an ordinary-input verification route that follows the original buoys from the grid, approaches the southern ramp from 10 m back, takes a late descent dive toward the gap at map (235,540), and rejoins the eastern sequence around the island's southern end. A longer 20 m run-up stalled at the pier until low tide and was rejected; the retained line passes on lap one without any collision or wait for the tide. No physics, geometry, power or checkpoint progress is injected.

The four-rider course-wave regression checks ramp contact, zero collision throughout the shortcut, more than ten frames physically below the deck with an active dive, exit on lap one before 90 seconds, and all three laps finished without misses or disqualification. It passes with 33 under-deck frames and a 298.67 s race finish. All 15 Southern tests pass in 14.14 s. The browser adds an Inspect pier dive button to hold this same run beneath the deck. This validates the Normal approach; class-specific Hard/Expert/Reverse shortcut lines, later-lap surface routes and full course parity remain outstanding.

Browser inspection at 77.80 s confirms the rider and ski submerged between the physical pier supports on lap one: hull y -2.586 m, speed 64.71 km/h, dive remaining 0.683 s, zero misses, no browser errors. The screenshot shows the deck above the submerged rider and the solid piles to either side.


Follow-up class verification: Hard also clears the first-lap dive with zero collisions/misses and finishes in 314.48 s. The regression now covers both Normal and Hard, and passes after selecting the approach checkpoint by its authored span rather than a fixed sequence number. Expert is explicitly still failing the intended early shortcut: the trial collides at the pier until the tide falls (6,900 collision frames), despite eventually finishing without missed buoys; that eventual finish is not shortcut parity. Reverse is excluded from this forward-ramp inspection path.

Full regression suite: 155/155 passed in 98.67 s (`work/southern-pier-dive-full-tests.log`). The subsequent Normal/Hard targeted check passed in 4.47 s. Browser Normal shortcut race completed first in 4:58.667 with zero misses, 36 passed checkpoints, and course sea state/high graphics. No publication yet.


### Expert first-lap pier dive corrected — 2026-09-11

Expert now targets map x232 instead of x235 at the same south-side exit, accommodating the different approach after its extra western buoy. All movement still comes from ordinary throttle, steering and late-dive inputs. The four-rider run records zero shortcut collision frames, 30 frames physically below the deck, exits the approach at 79.60 s on lap one, and finishes in 299.32 s with zero misses. No geometry, dive duration, engine power or gate logic changed.

The full grid-start shortcut regression now covers Normal, Hard and Expert and passes in 6.68 s. It still requires ramp contact, no collision throughout the shortcut, more than ten frames beneath the deck with an active dive, exit before 90 s on lap one, and clean three-lap completion. Expert remains submerged briefly as buoyancy raises it after the dive timer expires; the test now counts active-dive frames rather than incorrectly requiring the timer to stay active on every subsequent submerged frame. Reverse and later-lap surface shortcut routes remain outstanding.

Expert browser inspection at 79.05 s: lap one, zero misses, 63.77 km/h, hull y -3.013 m, dive remaining 0.333 s. The rider is visibly submerged beneath the deck between its supports; no logged browser errors.


### Later-lap surface passage, forward classes — 2026-09-11

Added an ordinary-input inspection route for the low-tide southern pier passage on laps two and three. It leaves the original outer first lap intact, takes the western side of the southern jump, aligns at map (236,495), and runs straight between supports before rejoining the eastern sequence. A nearer alignment point at y507 clipped a pile in Normal/Hard and was rejected. The retained route never commands a jump or dive.

The new grid-start regression covers Normal, Hard and Expert for all three laps. On both later laps it requires over ten frames physically under the deck, zero shortcut collisions, no ramp contact, zero dive timer, and clean race completion. It passes in 6.92 s. Recorded total races: Normal 302.90 s, Hard 412.50 s, Expert 314.58 s; all zero misses. Hard's slower approach is not claimed as an optimized original racing line. A browser Inspect low-tide pier button holds the same route under the deck on lap two. Reverse still needs its own later-lap approach.

Browser inspection confirms the Normal surface passage at 181.35 s on lap two: speed 48.43 km/h, hull y -2.185 m, dive remaining zero, no missed buoys and no browser errors. The ski is visibly riding the water beneath the exposed deck between supports. All 19 Southern geography/buoy tests passed in 25.72 s.


### Reverse later-lap pier route — 2026-09-11

Reverse now has a separate verification path that retains the outer first lap, aligns south of the pier on laps two and three, crosses north between its supports, and rejoins the original reversed buoy sequence without using the fixed ramp backwards. Earlier diagonal entries hit the southern spur or piles and were replaced by two straight alignment points. A remaining lap-two collision came from a wave lifting the hull into the deck, not a misplaced obstacle.

The retained driver samples the shared wave model for the approaching entry window and issues normal brake input at the alignment point when clearance is insufficient. This is predictive verification guidance, not a change to player physics or an exact reproduction of original rival AI. It never changes position, tide, collision, power, progress or dive state. With the brief clearance wait it completes at 318.78 s with zero misses/collisions, 35 under-deck frames on lap two and 61 on lap three. No jump or dive input is used.

The new regression checks the outer first lap, actual braking, physical clearance on both later laps, no ramp contact or diving, and clean three-lap completion. It and the three-forward-class surface regression pass in 9.19 s. The browser low-tide inspection now selects the corresponding Reverse crossing stage. This establishes one viable Reverse surface route; it does not establish parity for the remaining courses or original rival behavior.

Reverse browser inspection: 139.93 s, lap two, zero misses, speed 47.36 km/h, hull y -3.037 m and dive remaining zero. The ski is visible riding beneath the pier between supports; no browser errors.


### Sunny Beach original class slaloms — 2026-09-11

Replaced generated alternating gates with the illustrated Normal/Hard/Expert 13-buoy sequences and the distinct Reverse 11-buoy sequence, plus each finish. Added the mapped three-ball Hard row and five-ball Expert/Reverse rows. Balls use the existing steel sphere rendering and actual obstacle collision; they are not yellow navigation buoys. All class diagrams were inspected this pass. The map transform uses (168,250) as origin at 0.75 m/pixel; Expert's left margin differs by 35 pixels and Reverse rotates about map (179,261). These transforms/scale are reconstruction estimates against shared landmarks.

The north-east route bend now approaches at x24 instead of x35, matching the tighter reversed shoreline line. Reverse's near-shore red buoy retains its mapped center and right-pass rule, with a 2 m approach offset instead of the generic 7 m. The navigation margin is capped relative to that offset; all existing 7 m mapped gates retain their previous 4 m margin. Neither gate width nor missed-buoy rules were relaxed. The land remains the earlier approximate sandbar model, so exact shoreline, mainland and visual fidelity still need comparison.

Focused tests verify original counts, complete color sequences, ordered progression, selected class coordinates, metal barrier counts and complete zero-miss races in all four classes. All three tests pass in 4.92 s after the steel-ball visual correction. Normal/Hard/Expert/Reverse total race times: 214.73 / 226.42 / 241.75 / 246.03 seconds. The original course requirement is not signed off solely from these navigation tests. Layout revision is now 3; saved-record separation remains a later release requirement.


Regression evidence: the full suite initially passed 157/160 tests in 102.63 s. The three failures were stale assumptions in `race.test`: generated gate colors at fixed indices, a sub-180-second generic course limit, and (0,0) being out-of-course. Updated these to select gates by actual side, retain a bounded 600-second session limit, and test a verified outside-boundary point (-200,0). All six race tests then passed in 4.41 s, including every rider finishing with zero misses, wrong-side power reset/disqualification, backwards-crossing rejection and the unchanged five-second outside rule. The full suite was not rerun after these test-only fixture corrections; the changed Sunny steel-ball mapping also passed its three focused tests separately.

Browser Reverse completion: 4:06.033, second place, zero misses, 36 passed gates, high graphics/course sea state, no console errors. Rendered slalom and shoreline were inspected; original visual matching is still pending. No publication yet.


### Sunset Bay original buoy sequences — 2026-09-11

Inspected all four original Sunset Bay maps and replaced generated alternating buoys with Normal 14, Hard 15, Expert 16 and Reverse 12 buoy sequences, each plus a finish. Normal uses the existing map origin (245,275) at 0.75 m/pixel; Hard is translated seven pixels left, Expert sixty pixels right, and Reverse rotated about (256,276) to align the source geography. Scale/alignment are reconstruction estimates, and the original artwork is not shipped. Added the mapped outer boundary.

Expert's tighter western and southern slalom requires its own approach route. A new optional anchorsByClass field supports that route independently of Port Blue's required-tunnel logic. The original buoy centers, colors, side rules and penalties remain unchanged. Initial Expert trials missed its western yellow and southern yellow; the corrected approach line now clears both on every lap.

Three focused tests pass in 5.86 s: original counts/full color sequences/selected coordinates and ordered gates; isolated Expert route selection without tunnel-rule leakage; and ordinary-input three-lap completion in all four classes with zero misses/DQ. Total races Normal/Hard/Expert/Reverse: 264.12 / 300.95 / 277.95 / 290.20 s. Another 25 classic-course, passage and Sunny Beach tests pass in 9.25 s. These checks do not prove Sunset Bay's original metal-ball cluster, physical piers or final-lap out-of-bounds shortcut, all still pending, nor full visual parity. Layout revision is now 3; record-key separation remains pending before release.

Browser Expert race completed in 4:37.950, second place, zero misses, 51 passed checkpoints, high graphics and course sea state. The rendered slalom was inspected and no browser errors were logged. This does not sign off the still-pending source-specific scenery or shortcuts.


### Sunset Bay metal-ball clusters — 2026-09-11

Added ten physical steel balls to Hard, Expert and Reverse; Normal stays clear. Hard/Expert use three staggered rows of 3/4/3 at the illustrated bend. Reverse uses its separately mapped 3/4/3 cluster. Pixel connected-component measurements of the dark dots distinguished the ten cluster objects from adjacent dotted boundary markers; those boundary markers were not converted to obstacles. Sphere radius 0.85 m is a reconstruction estimate because the guide symbols are not physical-scale drawings.

All four Sunset tests pass in 6.07 s, including ordinary-input three-lap races on every class without missed buoys, original buoy transcription, exact cluster counts/rows and collision/separation against the actual steel obstacles. Rendering uses the existing floating steel-ball model shared with collision positions. Physical piers, final-lap shortcut and final visual sign-off remain unfinished.

Browser visual check: Reverse held at 6.683 s with zero misses. Steel spheres are visible along the left edge of the racing line, separate from colored navigation buoys. The debug-only Inspect metal cluster button holds near existing metal obstacles for repeatable visual review; the full ten-object count is covered by source transcription and tests, not claimed from the cropped camera view. No browser errors were observed.

### Sunset Bay physical piers — 2026-09-11

The previous `piers` definitions were not consumed by the world renderer or collision solver. Replaced them with two wooden crossbars using the shared deck/support geometry, at the map-derived west-straight locations (133,144) and (132,299). Deck bottoms at 2.8 m and 14 m support spacing are reconstruction estimates, not measured original elevations or exact pile placement.

Five focused tests pass in 6.32 s. Ordinary-input four-rider races now require exactly one under-deck crossing of each pier on each of three laps, in all four classes, with zero nearby collision frames and zero missed buoys. Normal/Hard/Expert/Reverse finish in 264.12 / 309.52 / 277.95 / 290.20 s. Separate checks prove solid decks and piles, finite above-deck clearance, and unobstructed under-deck camera paths.

Browser inspection in Normal/course sea/high graphics held the actual grid-start run at 31.983 s: hull y -0.451 m, deck underside 2.8 m, zero collisions or misses. The rider and ski are visible beneath the wooden deck between solid support piles, with rivals ahead and the mapped ramp beyond. Browser error log is empty. The existing Inspect pier approach control now also inspects this Sunset passage. Final-lap out-of-bounds bypass, moored boats and final source/visual comparison remain pending; no parity or publication claim.

Next shortcut requirement clarified from the retrieved Normal guide: the last-lap hairpin exit skips three buoys and should incur three misses. It is viable only with zero or one prior miss; two or more prior misses must cause the existing five-miss disqualification before finishing. The guide estimates about two seconds saved. This is not yet implemented/verified as a continuous route; do not grant checkpoint credit or suppress penalties to make it pass.

Full-suite follow-up initially found 163/165 passing in 69.96 s. One stale fixture still expected zero Expert metal balls; corrected to ten. The other failure was real: the engine-tuned championship rider became pinned on a Sunset support pile. Rival local obstacle avoidance now includes physical pier piles whenever the deck has surface clearance, using the same pile coordinates/radii as collision and penalizing detours into adjoining supports. No checkpoint or hull state is injected. All five Sunset checks still pass (6.67 s), and the complete Hard/Expert/Reverse tuned championship test passes in 40.84 s. A fresh full regression run follows this actual navigation fix.

Post-fix Hard browser inspection: 31.483 s, hull y 0.087 m, underside 2.8 m, zero collisions/misses and no browser errors. The craft remains visible between the piles beneath the deck, with the ramp visible beyond.

Final full regression: 165/165 passed in 107.18 s (work/sunset-piers-full-tests-fixed.log). This proves the current automated coverage, not complete original-course parity. Changes remain local.

### Sunset Bay final-lap outside shortcut — 2026-09-11

Inspected the original Normal map and its accompanying text again. The finish line extends from map (250,300) to (420,300), while the driving lane starts near (290,302). The earlier symmetric 46 m checkpoint could not accept the source shortcut. The finish now uses the mapped horizontal span while retaining the original starting lane, and the visible gantry uses the same endpoints. Reverse reverses the finish direction but does not inherit the forward bypass rule. Layout revision is 4.

The final hairpin can be exited at approximately (468,455), steering toward (410,290). The ordinary-input driver passes the hairpin buoy, incurs two misses along the outbound line, then reaches the extended finish before the next buoy's crossing plane. At this authored finish, remaining bypassed buoys are charged as misses, with the existing power reset and five-miss disqualification. A finish crossing cannot bypass more than the final three buoys, run backward, or extend beyond the mapped endpoints. No clean checkpoint credit, teleportation or course-out exemption is introduced. The rule also retains penalties if attempted on an earlier lap; the verification driver chooses the last lap, as the source recommends.

Four focused tests pass in 4.75 s: finish endpoints/start lane, three skipped-buoy penalties with zero/one/two prior misses, rejection of remote/backward/early crossings, and complete three-lap ordinary-input races in Normal/Hard/Expert. Shortcut races finish in 247.67 / 283.95 / 260.10 s with exactly three misses, zero collisions during the shortcut, and 2.72 / 2.73 / 2.77 seconds outside the boundary. Two prior misses cause disqualification before any finish time is awarded. These tests establish the route and penalty behavior; they do not establish the original guide's approximately two-second time gain, which remains a scale/handling calibration requirement. The verifier uses full throttle during the shortcut, whereas default navigation uses conservative part throttle.

The source also describes three fixed consecutive waves after the jump, and moored boats appear at the pier ends. Those details and final visual comparison remain outstanding; do not sign off Sunset Bay yet.

Browser Normal shortcut run completed first in 4:07.667 with exactly three misses, 45 adjudicated checkpoints, course sea state and high graphics (59 FPS in the final measurement). Browser error log is empty. The result confirms successful delivery of the final-lap shortcut in the rendered game; final gantry/source visual matching remains part of the course sign-off.

Full regression after the finish/shortcut change: 169/169 passed in 108.34 s (work/sunset-shortcut-full-tests.log). No publication; full course parity remains incomplete.

### Sunset Bay three-wave straight — 2026-09-11

The retrieved Normal guide explicitly describes three consecutive waves immediately after the jump and recommends forward weight plus B to reduce bouncing. Added a localized three-crest field centered on the jump's western straight, starting near map (130,223), spaced 14 m apart, with 0.9 m peak contribution and a 28 m lateral taper. These dimensions and the slow 1.2 m surge are reconstruction estimates. This is a localized shoaling/standing-wave approximation, not a measured original waveform or a fluid-breaking solver. Exact shape, timing and class-specific visual comparison remain open.

The CPU surface query and the GPU displaced mesh add the same field at world coordinates; water normals and foam sampling include it too. Race switching, restarting and returning to salvage configure/reset the same uniform. No decorative-only wave meshes or independent buoyancy animation are used. Rival input uses forward lean and reduced throttle in this region, and commits to the next buoy's correct side earlier so the crests do not force a last-second airborne turn. The initial Hard driver missed that buoy twice; retained earlier alignment resolves the failure without shrinking the wave effect or widening the checkpoint.

All nine Sunset buoy/pier/shortcut checks pass (7.04 s). Four new checks pass in 82 ms: three ordered localized crests after the jump, matching displaced/inverted CPU surface queries, actual hull airtime and loaded landings, and clearing the field on other courses/salvage. A controlled 15 m/s traversal produces two loaded landings and 151 airborne frames; forward lean reduces peak load from 6.59 to 6.28 times static weight and airtime to 149 frames. These figures demonstrate a physical response, not original-game numerical parity.

Hard/high/course-sea browser inspection at 37.033 s shows the raised rollers and troughs across the straight, reflected piers, and riders following the surface. Hull y -1.106 m, sampled water -1.212 m, current load 1.15, zero misses. Browser error log is empty. The Inspect Sunset waves control holds this ordinary grid-start run between the first two crests. The full race and regression checks continue below.

Full regression initially found 172/173 passing (74.91 s). The tuned Hard championship rider was trapped after entering a pier-pile overlap. This was an existing barrier-response defect: unlike rock contact, pile contact only reverted to the previous position, which could itself overlap. Piles now use their shared radius to separate an intersecting hull before reflecting inward velocity. A direct overlap-and-power-away regression passes; Hard/Expert/Reverse championships pass in 40.19 s. All 14 wave, pier and shortcut checks pass in 7.23 s. No navigation progress is granted by collision recovery.

The first Hard browser race finished second in 5:00.350, zero misses, 48 adjudicated checkpoints and nine landings, with no browser errors. Its final high-graphics measurement was 38 FPS while other checks were running. Replaced four finite-difference roller samples for normals with a shared analytic height/gradient evaluation, reducing repeated exponentials. A final browser run uses that shader and the pile-contact fix. These are approximate surging rollers; moored boats, waveform/source calibration and final Sunset visual sign-off remain open.

Final full regression: 174/174 passed in 110.89 s (work/sunset-rollers-full-tests-fixed.log). The analytic-normal shader-only refinement was subsequently loaded in the browser; CPU wave/collision/race behavior is unchanged by that refinement. No publication or original-course sign-off.

Final Hard browser run with analytic normals and pile separation: second place, 5:00.117, zero misses, 48 adjudicated checkpoints, eight landings, high graphics/course sea state, final measurement 60 FPS. No browser errors.

### Sunset Bay moored launches — 2026-09-11

Added two original launch models at the western pier ends shown on the Normal source map, approximately (90,146) and (93,299), reused across classes with the common geography. Each has a shaped white hull, deck rim, cockpit/seat, windshield, canopy supports, fenders and outboard. Vessel type/detail and 3.5 m by 10 m dimensions are reconstruction estimates; no source artwork or extracted models are shipped.

The launch heave, pitch and roll use the same four-point wave pose as their collision transform. Hull contact uses the shared seven-point footprint and finite vertical bounds; the cockpit/canopy uses a conservative finite box. Both camera views stop at the same transformed hull/cabin. Tests prove pose variation, above/below/side clearance, an actual surface hull strike followed by reversing away, and camera clearance. These are collision approximations, not detailed rigid-body boat simulation. Horizontal moorings are fixed; no rope/tension simulation is claimed.

The southern deck previously extended left to map x86.7, through the second launch's mooring area. Corrected it to approximately x99–176, centered at x137.5 with 57.75 m length, while retaining the existing interior passage supports with explicit offsets. The western overhang/support placement remains an estimate; no exact original pile arrangement is claimed. An initial automatic redistribution of supports hit the normal racing line and was rejected. All 17 focused boat, wave, pier and shortcut checks pass in 6.97 s; the subsequent camera addition passes all four boat checks in 115 ms.

Full suite: 177/177 passed in 112.45 s (work/sunset-moorings-full-tests.log). The camera-clearance addition was made after that run and separately passes all four boat tests; total coverage is now 178 checks. The inspection control includes a close-up camera after an ordinary grid-start approach because the default chase angle hid the launch behind the verification panel. Only the inspection camera changes; race position/progress remain untouched. Final source/visual parity remains incomplete.

The close-up at 29.733 s confirms the first launch alongside its pier, with canopy, windshield, hull and fenders visible; zero misses and no browser errors. Added two visually sagging mooring lines per boat, updated from deck cleats to fixed pier attachments as each hull rocks. This is visual attachment only; the fixed horizontal anchor remains the physics approximation. Camera and rope presentation updates do not alter the passing race/collision solver.

### Drake Lake original buoy sequences — 2026-09-11

Inspected the four local illustrated maps (Normal/Hard/Expert 420 by 486 pixels; Reverse 562 by 466 including annotations). Replaced generated alternating buoys with 12 Normal, 13 Hard, 16 Expert and 16 Reverse, plus the finish. Positions use the existing origin (200,240) at 0.75 m/pixel; Reverse is aligned by (420-x,478-y). Colored-marker component checks supplement visual transcription; coordinates are rounded reconstruction readings, not extracted original game coordinates. The source artwork remains outside the shipped game. Layout revision is 3.

Hard and Expert now have distinct authored southern routes through the post area; Reverse retains the reversed common route with its own original buoy sequence. None gains Port Blue's mandatory-tunnel behavior. All four classes complete three ordinary-input laps with zero missed buoys/DQ in 236.13 / 253.37 / 241.20 / 251.55 s. Three new tests pass in 5.97 s, checking complete color/count sequences, selected source coordinates, ordered checkpoint projections, isolated class route selection, retained eight posts/two weed patches, and full race completion. Hard/Expert/Reverse each enter the southern post region on all three laps.

A stricter diagnostic exposes unfinished approaches: Hard contacts a post once per lap near map (239,392), and Reverse contacts one near (290,380) on lap three. Expert has zero post-region collision frames. Do not mistake the no-miss finishes for clean obstacle-route verification. Hard/Reverse approaches, the original northern-island inner/outer choice, Expert/Reverse extra weed distribution, fog/source calibration and final visual comparison remain pending.

Expert browser race completed second in 4:01.200, zero misses, 51 adjudicated checkpoints, high graphics/course sea state and final 60 FPS. The scene/minimap show the mapped loop and class buoys; browser error log is empty. This does not sign off the remaining approaches or source scenery.

Full regression first found 180/181 passing. Changed championship results alter the later grid; in the Hard Twilight City round a rider entered the inner channel beyond the next unpassed branch checkpoint. The driver aimed beyond that plane indefinitely, still stuck at 597 s. The test timeout was not increased. Channel guidance now recognizes this late entry, returns behind the checkpoint with ordinary helm inputs, and approaches again; the existing crossing adjudicator alone awards progress. A seeded regression returns over 9 m behind the plane and crosses in 6.83 s, with one passed gate and no misses. The complete Hard/Expert/Reverse championship test passes in 41.16 s. This fixes an exposed navigation defect without changing Drake's buoy data or granting checkpoint credit.

Next approach evidence: an ordinary-input temporary Hard waypoint at map (228,382), before buoy 12, clears all three post passages with zero post-region collision frames and zero missed buoys, finishing in 260.57 s. (230,384) also clears but takes 271.52 s; (232,379) and (234,384) still contact posts. These experiments do not alter saved guidance yet. The retained game driver still needs the clean approach integrated and Reverse needs its own verified line.

Final full regression: 182/182 passed in 115.70 s (work/drake-buoys-full-tests-fixed.log). The generated finish anchor/span still needs its own source alignment check. No publication or course sign-off.

### Drake Lake complete post cluster and clean approaches — 2026-09-11

Rechecking the original map's brown obstacle markers exposed an important omission: all four diagrams contain **13 posts**, not the eight previously reconstructed. Connected-component inspection found thirteen separate 20-pixel markers on each map. Replaced the approximate eight-post layout with the thirteen source centers; Normal/Hard/Expert coincide. Applying the existing Reverse-map alignment yields a +4 pixel x / +3 pixel z offset of that cluster relative to Normal. This is diagram alignment, not a claim of measured original world coordinates. Earlier eight-post clearance evidence is superseded.

The additional posts invalidated the preliminary Normal/Reverse clearance. Retained ordinary-helm approaches now use map (293,395) before Normal buoy 12, (228,382) before Hard buoy 12, and (277,383) before Reverse buoy 3. Expert needs no additional waypoint. These are reconstructed navigation choices inside the mapped course, not original opponent AI. Per-rider/per-lap approach state only controls throttle/steering; tests prove that reaching a waypoint cannot increment checkpoints or laps. The actual gate crossing still adjudicates progress and misses.

All four classes finish three laps with zero missed buoys and zero collision frames across a bounding region containing **all thirteen** posts (x -22 to 76 m, z 80 to 130 m), on all three laps. The earlier narrower region was expanded before this check. The original thirteen positions and Reverse alignment have an independent transcription assertion. Rendered post radii now match collision radii. A stale eight-post assertion in the existing weed test was corrected. Full regression and final browser inspection follow below.

The first exploratory guide pass ran against only eight posts; its completed full-suite log (work/drake-post-guidance-full-tests.log) is not evidence for the corrected layout. The final run uses work/drake-thirteen-posts-full-tests.log. Northern island route choice, class-specific weed layout, finish alignment and final visual/source calibration remain unfinished.

Final Hard browser inspection of the corrected cluster holds at 78.083 s on lap one, next buoy 13, zero misses and zero collision timer. The scene visibly shows the wooden post field around the ski, with the white bands, reflections and class buoys. Browser error log is empty. Continuing the same run verifies the complete race rather than restarting at the obstacle.

Final full regression: 184/184 passed in 114.90 s (work/drake-thirteen-posts-full-tests.log). Hard browser continuation finished second in 4:21.033, zero misses, 42 adjudicated checkpoints, high graphics/course sea state and final 60 FPS. Browser errors remain empty. No publication or complete course-parity claim.

### Drake Lake class-specific weed beds — 2026-09-11

Inspected the green patch markers on all four source diagrams. Normal and Hard each have three markers around the northern island; Expert adds three along the western bank, and Reverse contains the corresponding six with the established diagram alignment. Replaced the two approximate legacy ellipses, including the unsupported southeast patch near map (320,352), with the mapped 3/3/6/6 layouts. Centers and ellipse extents use the observed marker bounds; these are reconstruction estimates, not original game's measured collision volumes. Reverse retains the source alignment offset of +4/+3 pixels relative to normalized forward geometry.

The same selected class-specific resistance array drives scenery placement and wet-hull drag. Two new tests pass in 80.5 ms: exact patch counts/centers/class selection and Reverse alignment; and an actual coasting hull through an extra Expert patch, compared with clear water on the same terrain. The Expert hull slows without a shore collision; Normal has no drag at that location, dry/airborne hulls receive none, and resistance is bounded by the ellipse. All 20 existing Drake and reconstructed-course checks also pass (6.05 s), including clean three-lap post passages in all classes.

The northern-island inner/outer traversal, finish alignment, exact weed shape/drag calibration and final source/visual matching remain outstanding. The field renderer is still a lightweight instanced-leaf approximation.

Final regression: 186/186 passed in 115.20 s (work/drake-weeds-full-tests.log). The final renderer replaces rectangular leaves with tapered curved blades and per-instance color variation; this visual-only refinement was inspected in the browser at the northern island (28.95 s, six Expert beds, zero misses). The completed Expert browser race finished second in 4:02.850, zero misses, 51 checkpoints, high graphics/course sea state, final 52 FPS, and an empty error log. The inspection is near a bed, not evidence of entering it; actual wet-hull slowdown is covered by the coasting physics test. No publication or full parity claim.

### Drake Lake source finish span — 2026-09-11

All three forward diagrams show the finish stripe across map x 357–408 at z 267. The Reverse diagram has x 8–59 at z 209; its established 420-x / 478-z normalization gives x 361–412 at z 269. Added per-class finish lines using those endpoints, preserving the starting lane while replacing the generated oblique crossing plane and width. The existing shared finish geometry drives the visible gantry and checkpoint span. Coordinates remain map-derived estimates, not extracted original world data. Drake gains no Sunset-style checkpoint bypass.

The narrower, northward finish changes the starting grid heading and exposed a Reverse first-lap post contact near map (242.5,392.5). An ordinary-helm approach at (254,398) before Reverse buoy 4 clears that row; it changes steering only, not race progress. All four classes now complete three laps with zero missed buoys and zero collision frames in the complete thirteen-post region. Eleven focused tests pass (6.21 s), including exact class finish endpoints, valid crossings near either bank, rejection of backward crossings, and existing Sunset finish/shortcut behavior. Full regression and browser verification are recorded below when complete.

Northern-island inner/outer navigation and full visual/handling calibration remain unfinished. No course sign-off or publication.

Final finish-line regression: 188/188 passed in 112.59 s (work/drake-finish-full-tests.log). The rendered Reverse race finished second in 4:33.000 with zero misses, 51 adjudicated checkpoints, high graphics/course sea state and final 60 FPS. Browser error log was empty. The results overlay obscures the gantry in the final screenshot, so this is race/runtime verification, not full visual sign-off of the finish structure.

### Drake Lake island route access — 2026-09-11

The Normal source diagram explicitly describes the inner/right island route as faster with a sharper next bend, and the outer/left route as gentler but longer. Added an ordinary-input inspection driver for the inner passage in both directions. It does not move the craft or bypass checkpoint rules. Tests now drive both the existing outer route and the inner passage for all three laps in every class, proving physical traversal through separate north/south observation bands, zero missed buoys, and zero island passage collision frames.

The initial Reverse probe stayed in navigable water but accumulated 3.97 seconds of an out-of-course warning: Drake previously used distance from the checkpoint polyline as its boundary. The course now uses its existing mapped nineteen-vertex outer shoreline polygon. Both island channels remain inside; points beyond the outer shore remain outside. All eight complete route/class runs have zero out-of-course time after that correction. Land collision is unchanged.

The verification helm uses cautious 0.32 throttle and short waypoints to avoid the sharp mainland entrance; it is not reconstructed opponent strategy or proof of the original shortcut time advantage. Forward and Reverse clean traversal is now established, but relative route timing, exit handling and full visual/source calibration remain unverified. All eleven focused Drake tests pass in 12.74 seconds. Full regression and rendered passage inspection follow below.

Final regression: 190/190 passed in 115.35 s (work/drake-island-full-tests.log). Reverse browser inspection held at 90.367 s in the narrow inner channel, with visible water between island and mainland, zero collision timer, zero misses and zero out-of-course time. Continuing the same race finished fourth in 5:25.133, zero misses, 51 checkpoints, high graphics/course sea state and final 53 FPS. Error log remained empty. The slow verification result is not evidence of a competitive shortcut. No publication or full parity sign-off.

### Marine Fortress original directional buoys — 2026-09-11

Inspected Normal, Hard, Expert and Reverse source diagrams (1_normal_4_marine_fortress.png; 2_hard/3_expert/4_reverse_4_maline_fortress.png). Replaced generated directional buoys with the observed 8/6/6/6 markers and RRRLRRRR / RRLRRR / RRLRRR / RRRLRR sequences. Hard removes Normal's additional northern and eastern-turn red buoys; Expert's eastern-arm red is slightly farther north. Reverse positions use the diagram alignment (466-x,564-z), an estimated normalization rather than original extracted world coordinates.

Retained invisible route controls to adjudicate the long first-lap outer detour and optional later shortcut. These are reconstruction infrastructure, not claimed original visible buoys. Controls are sampled at a consistent density across classes, omitted within 20 m of source buoy gates to prevent duplicate close crossing planes. Passage setup now selects the actual directional buoy at the eastern shortcut entrance, so it cannot erase that source marker while converting interior route controls to neutral channel checks. The first version exposed exactly that problem in Expert and Reverse; those missing markers were corrected before validation.

Reverse has ordinary-helm approach points before its yellow buoy and final red buoy so the rider uses the correct side. The driver changes throttle and steering only. All classes finish three laps with zero misses: Normal 255.450 s, Hard 239.983 s, Expert 237.967 s, Reverse 286.117 s. These are reconstruction AI times, not timing parity. Ten focused buoy/passage tests pass (9.96 s), including exact counts/positions, first-lap outer detour, later gate traversal, continued optional outer route, physical gate/roof/wall collision and passage ordering.

Mapped southern fort projections, exact class crate positions, boundary/finish alignment and full visual/handling comparison remain unfinished. No complete course sign-off or publication. Full regression and browser inspection follow below.

Full regression: 192/192 passed in 115.48 s (work/fortress-buoys-full-tests.log). Reverse browser inspection reached the physical open gate on lap two at 126.633 s with zero missed buoys; the passage walls, overhead structure and water clearance are visible. The same race was resumed for completion. A presentation-only correction now labels neutral route checks “Follow the course” rather than incorrectly calling every neutral check a finish gate; the actual finish retains its label.

Reverse browser continuation finished second in 4:46.117, zero misses, 78 adjudicated checks (including invisible route controls), twelve landings, high graphics/course sea state and final 60 FPS. Error log remained empty. This verifies the race and gate behavior, not exact original art or timing.

Reloaded final renderer and confirmed “FOLLOW THE COURSE” during a neutral Normal-class route check on lap two (1:47.117), with zero misses and no browser errors.

### Marine Fortress crate and timber layouts — 2026-09-11

Read exact brown marker components (RGB 121,75,51) from all four diagrams. The 20-pixel diamonds and 21-pixel narrow rectangles identify distinct obstacle silhouettes: Normal has three crates; Hard four crates and three narrow debris markers; Expert/Reverse seven crates and four narrow debris markers. The prior 3/7/10/10 reconstruction incorrectly treated all objects as crates and placed both shortcut obstacles far from their source centers. The corrected 3/7/11/11 layout includes the Expert shortcut crates at map (178,266) and (126,329). Source marker centers are rounded to whole map pixels.

The reversed obstacle diagram aligns exactly with Expert under (465-x,564-z), so Expert and Reverse now share the same normalized object positions. This pixel-component evidence refines the earlier approximate x=466 buoy alignment; that one-pixel buoy alignment discrepancy remains to be reconciled in the next course alignment pass. No claim of original extracted world coordinates.

Narrow markers now render as floating timber boards (1.6 by 0.3 m, 0.22 m thick) with shared wave pitch/roll instead of crates. Dimensions and material appearance are reconstruction choices. Their conservative circular contact radius is 0.82 m; full oriented timber collision and free drift are not implemented. Three-dimensional crate art is unchanged. All four class races and optional/mandatory gate-route tests remain clean: ten focused tests pass in 9.92 s. An independent source-count/type/position test also passes. The legacy Expert obstacle-count assertion was corrected from ten to eleven.

Full regression ran 193 tests in 113.64 s: 192 passed, with only the obsolete ten-obstacle assertion failing (work/fortress-obstacles-full-tests.log). After correcting that assertion to the independently transcribed eleven-marker source layout, all fifteen classic-course tests passed in 1.46 s. Runtime code did not change for that correction; the full suite was not redundantly rerun. Expert browser inspection at 38.017 s visibly shows crates and low timber on the water, seven crates/four timber in status, zero misses and no errors. The same race continues below.

Expert browser continuation finished fourth in 4:13.400 with zero misses, 75 adjudicated checks, fourteen landings, high graphics/course sea state and final 60 FPS. Browser error log remained empty. No publication or complete course-parity claim.

### Marine Fortress finish alignment and southern projection investigation — 2026-09-11

Aligned the finish to the source horizontal stripe from map (9,272) to (108,272), preserving the starting lane. The renderer and adjudication share that 79.2 m span; the existing generated diagonal/46 m gate is superseded. Reverse now uses the same (465-x,564-z) diagram normalization established independently by all eleven brown obstacle components, correcting its previous estimated one-pixel x discrepancy. The six Reverse buoy positions are now (289,244), (347,182), (191,170), (154,139), (156,101), (66,202). No skipped-checkpoint finish bypass is enabled.

Twelve focused Fortress/passage tests pass in 10.19 s: all class races, directional markers, physical passage behavior, optional outer route, obstacle layout and shared finish endpoints/crossing direction. The full suite and rendered Reverse run are tracked below.

Southern projection evidence: the Normal green land color is RGB (99,140,79). Reading horizontal spans after a 5-pixel close to bridge the overlaid racing line yields four separated projections. At y=505 the spans are x108–134,146–174,189–217,240–261; at y=520 x108–133,150–177,195–224; at y=540 x107–133,155–181; at y=555 x108–132,160–169. Current fortLand ends near y=507 and omits these shapes. However the orange racing line visibly crosses the projections, so making them full-height dry terrain would contradict the depicted traversable route. Their vertical clearance/submersion requires gameplay reference before authoring collision. This investigation does not establish their height or complete that feature. A web guide search did not resolve this southern structure question; references to jumping the stone ridge concern the northern opening straight and must not be misapplied to the southern projections. No geometry was invented from that unrelated description.

Final regression: 194/194 passed in 136.21 s (work/fortress-finish-full-tests.log). The aligned Reverse browser race finished second in 4:55.117 with zero misses, 78 adjudicated checks, eight landings, high graphics/course sea state and final 51 FPS. Browser error log was empty. A gameplay reference was located: https://www.youtube.com/watch?v=uJgdqbWBels (ModernXP, Full Game 100% Walkthrough HD), Marine Fortress chapter at 7:38; browser tab 5 paused near 8:17. The inspected frame did not establish southern projection height; it is a reference for further inspection, not evidence of completed geometry. No publication or course sign-off.

### Marine Fortress southern stone arches — 2026-09-11

Resolved the map-height ambiguity by inspecting ModernXP's original-game footage around 8:54: https://www.youtube.com/watch?v=uJgdqbWBels&t=534s . The rider travels beneath a dark stone overhead structure, with successive arch openings visible ahead beside the pink boundary buoys. These are overhead stone projections, not dry fingers across the racing line. This direct frame evidence supersedes the unresolved height note above. The embedded YouTube player failed with Error 153; the normal player worked after ad dismissal. No video artwork or Nintendo assets are shipped.

Added four radial stone arch spans using the mapped southern footprints: centerline map endpoints (120,494)–(120,560), (159,493)–(170,553), (192,484)–(213,533), (224,476)–(253,506), widths 25/26/25/25 map pixels. Sixteen shared collision/render sections per arch approximate the curved soffit, with solid end feet, 11 m tops and roughly 6.8 m maximum opening clearance. Those heights are reconstruction estimates, not measured original dimensions. The existing terrain stays below the passage; solid overhead sections and feet provide the structure. Stone arches omit the generic yellow barrier stripes.

Tests prove open water beneath each arch, solid roof and feet, and camera clipping before the roof. Actual three-lap races in every class pass beneath all four arches on lap one with zero missed buoys and zero collision frames under the openings. Both new tests pass in 10.37 s; all ten Fortress buoy/passage checks also pass in 15.00 s, including first-lap detour and later optional gate shortcut. This establishes functional overhead passage, not final visual or dimensional parity. Browser inspection follows below.

The initial section-box render produced visible stair steps and was replaced after browser inspection by a continuous extruded profile per arch. Collision now interpolates the same sampled underside between sections and conservatively accounts for hull radius; early spatial rejection avoids evaluating distant roof profiles. Roof/profile join continuity is checked independently. Final smooth arch inspection at 69.483 s on Normal shows successive open spans above the racing water, zero misses, zero collision timer and no errors. Seven targeted arch/general-barrier tests passed in 12.09 s before the equivalent early-rejection optimization; the final full suite follows below.

Final Normal browser run (reloaded after profile collision interpolation) finished third in 4:15.600, zero misses, 78 adjudicated checks, 25 landings, high graphics/course sea state and final 60 FPS. Browser error log was empty. The separate profile-join continuity test passes in 67 ms. Stone surface detailing and exact original dimensions remain unfinished; these four overhead routes are now physically represented and tested.

Full regression: 196/196 passed in 167.09 s (work/fortress-arches-full-tests.log); the additional profile-join test was added after that process loaded its tests and passed separately as recorded above. No publication or full course-parity sign-off.

### Records separated by reconstructed layout — 2026-09-11

Time/lap leaderboards and stunt-score tables now include the course's layoutRevision in their keys. All existing callers (record saving, time-trial reference laps, results, course records and options management) resolve the same current layout automatically. Unversioned legacy records remain intact in browser saves and exported files but are never selected as current-layout records for reconstructed courses. The unchanged practice course keeps its existing keys until it receives a layout revision. This does not relabel legacy results as belonging to a reconstructed course.

Validation accepts both legacy keys and bounded revision suffixes, preserving older revisions alongside current results. Import/file-size limits and bounded record-table counts allow multiple retained layouts. Erase/undo affects only the selected layout; settings, rider names, unlocks, reached courses, park bonus and preferences remain intact. Twelve save/record tests pass (70.76 ms), including old/new times and scores surviving reload and export/import without mixing, independent revision/class/lap scopes, malformed suffix rejection, atomic import, storage failure and undo. No racing-physics code changed, so the unrelated full race simulation suite was not rerun.

Browser checks loaded the current course leaderboard and options record management, switched to stunt scores, and returned no errors. Portable-save help now explains why earlier course results remain in exports but are absent from current leaderboards. Future course geometry or stunt-layout changes that invalidate records must increment layoutRevision before publication. Existing local layout revisions are still under development; this is release preparation, not a claim of full course parity or a deployment.

### Marine Fortress mapped perimeter — 2026-09-11

Extracted the 146 dark perimeter marker centers (RGB 62,62,62; connected components over twenty pixels) from the Normal map. Ordered neighboring markers and simplified the closed outline to 36 vertices at one-pixel tolerance (0.8 m in the reconstruction). Hard's 146 extracted markers coincide exactly; Expert's 145 detected markers also coincide (one is obscured/absent). Reverse's 146 normalized markers lie within 1.414 pixels of the common marker set using (465-x,564-z). This supports a common course outline across classes, with map precision limits.

The course now supplies that polygon to both existing perimeter-buoy rendering and out-of-course detection. This removes the artificial inner/outer ribbons generated from checkpoint positions. A concrete corrected location is map (25,400): the source places it inside the broad western water, while the former checkpoint-distance rule excluded it by more than 30 m. Tests verify inclusion there and in the southern return, exclusion beyond the eastern/western edges, and actual retirement after remaining outside for five seconds. Layout revision increments to four so results from the earlier boundary remain separate.

All thirteen existing Fortress/arch/passage tests pass (12.94 s), including three-lap class races, all four overhead spans, first-lap detour and later optional shortcut. The two new boundary tests pass in 88.80 ms. Initial retirement assertion used the wrong display string and was corrected to the existing “Outside course for five seconds” result; retirement behavior was already correct. Full course visual/handling sign-off remains open. Browser inspection follows below.

Browser inspection at 69.483 s on Normal shows the mapped pink perimeter running outside the four southern arch openings, with zero misses, zero collision timer and no errors. This run loaded immediately before the metadata-only revision increment; geometry and rendering match the final files. Validation for this change consists of the fifteen focused tests and rendered inspection above; the full suite was not repeated after these passed. No publication or complete course sign-off.


### Marine Fortress northern wave-assisted ridge — 2026-09-11

The Normal diagram explicitly draws a straight wave-assisted alternative across the northern stone ridge. The former land polygon made this finger too thick, while its shared 6.5 m terrain cap made it effectively a wall. Corrected the finger using the map silhouette: at x81 the green spans approximately y133–142, with a broader irregular western tip. Capped this northern region at .75 m; that elevation is a reconstruction estimate, not a measured original-game height. Rendering and contact detection continue to use the same ground function and shared water model. No invisible launch ramp or injected vertical velocity was added.

Removed neutral route checks from the northern half of the course, allowing the source's straight crossing without artificial missed-buoy penalties. Southern checks remain to enforce the first-lap outer route. Original directional buoys are unchanged. Reverse AI's last buoy approach now activates only within 30 m; before that it follows the authored bend around the fort rather than aiming through the landmass. This range is optional approach metadata and does not award checkpoint progress. Layout revision is now five.

Ordinary-input verification steers toward map x81, brakes near y175 to time the swell, and accelerates across the ridge. Three nearby timing choices (4.25/4.5/4.75 s brake interval) cross solid ground with zero impact timer, zero misses, and minimum hull-bottom clearance above .15 m. The central timing completes all three laps with every check adjudicated and no misses or DQ. The same approach without the wait hits the ridge, demonstrating that the feature still depends on water support. Ten existing Fortress/passage tests pass, including the safe route in all four classes and the outer-first/inner-later rules. Both new ridge tests pass in 2.39 s.

Browser inspection of the actual crossing held at 18.300 s: hull y1.616 m above a .75 m ridge, 53.86 km/h, zero misses and zero collision timer. The wave covers the low rock crest in this frame; the rider and hull sit on the same raised surface. No browser runtime errors. This establishes a working wave-dependent choice, not original timing equivalence, success probability, height calibration, or full course visual sign-off. The reference art remains outside the shipped game.

The continued browser run finished third in 255.717 s (lap times 92.567/81.750/81.400), 57 adjudicated checks, zero misses, 26 landings, High graphics and a final measured 60 FPS. The timed first-lap crossing is not yet calibrated as a faster route; this remains an explicit fidelity gap.

Full regression completed: 203/203 tests passed in 181.00 s (work/fortress-ridge-full-tests.log), including all venue/class routes and championships. The additional mistimed-approach assertion was added after that full run started and passed separately alongside the clean-crossing test (2/2 in 2.39 s). Final subsequent runtime edits were comments only, followed by refreshed import-map hashes. No publication or course sign-off.


### Port Blue directional buoys and Reverse finish — 2026-09-11

Read all four local illustrated course maps. Red/yellow connected-color components identify eight directional buoys in Normal and nine in Hard, Expert and Reverse. Hard is vertically shifted +26 pixels relative to Normal; Expert is +9 pixels. Their eight common markers coincide after these offsets. Hard and Expert add a yellow marker at normalized (78,439) on the western bow return, after the southern red buoy in race order. This replaces the earlier alternating generated marker pattern; neutral route controls remain separate and award no buoy power.

Reverse is not just a reversed forward start. Green tanker silhouettes give best overlap at (438-x,569-y): 25,747 matching green pixels, compared with 25,673 at y570 and 25,671 at y568. Used that alignment to normalize its nine individually read markers. The sequence from its actual finish is LRRRRLLLR: (49,428), (82,466), (168,354), (169,322), (181,292), (106,85), (73,137), (52,187), (51,267). Reverse's loop now starts at normalized y384 instead of the forward opening straight near y267. Measurements are map-pixel reconstruction precision, not exact world-coordinate extraction from the original game.

The visible red finish stroke on Normal occupies x31–89, rows266–268; Hard's same stroke is rows292–294 and Expert's275–277. The forward span now uses x31–89 at y267. Reverse's stroke occupies x352–404, rows184–186, giving normalized x34–86 at y384. The existing boat grid follows these aligned finish gates. Revision increments to three to separate records from the earlier layout.

Passage entry/exit selection preserves original directional markers at both ends, rather than neutralizing them as channel controls. The optional Hard tunnel previously aimed directly between sparsely distributed checks and could cut through a wall at a bend. Channel helm guidance now projects onto the authored passage polyline and looks a short distance ahead, then aims through the unchanged checkpoint plane nearby. Mandatory Expert/Reverse channel checks use their projected path fractions too. This adjusts steering only, never position, velocities, scores or checkpoint progress. Reverse's final red buoy has a bounded west-side approach to avoid a last-moment wrong-side crossing.

Tests compare every class's source marker centers/order, finish direction/span and neutral passage checks. Five full three-lap runs verify Normal outer, Hard inner, Hard outer, Expert inner and Reverse inner, with zero misses or DQ and all checks crossed. Interior visits are measured against the actual tunnel path. The outer-route test initially selected a transient AI route flag only once; the existing checkpoint logic legitimately resets that flag. Corrected the test to provide ordinary outer-route helm guidance while preserving the real race world, collisions and adjudication. Final focused tests pass 2/2 in13.44 s.

Rendered Hard completed second in245.633 s, 84 checks, zero misses, High graphics and final60 FPS. Reverse tunnel inspection held at52.850 s on lap1, showing two riders navigating the bend with zero misses and no browser errors. That run completed third in283.350 s with75 checks and zero misses. These two runs preceded the final finish-span precision correction; a final-file browser run follows. Concrete wall and tanker detailing, exact original speeds and a final course comparison remain unfinished. No publication or course sign-off.

Final-file Reverse browser run: third in290.617 s, lap times101.417/95.167/94.033, zero misses,75 adjudicated checks, one landing, High graphics and final measured60 FPS. Browser runtime errors remained empty. The altered tunnel guidance is exercised by this run; no race progress was injected.

Final regression:206/206 tests passed in177.23 s (work/port-buoys-final-tests.log), including all venues/classes, championships, stunts and shared passage tests. The earlier206-test run also passed but preceded the precision correction and mandatory-channel guidance; the final run is the authoritative result for the committed runtime. This work remains local and unpublished.

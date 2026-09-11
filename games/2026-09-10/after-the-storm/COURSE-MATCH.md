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
| Sunny Beach | Long sandbar, parallel straights, tight ends, open sea and mainland, difficulty-specific slalom | Rebuilt sandbar and class buoy maps; original twelve-ring, single-ramp stunt route implemented and driven; final shoreline/visual/timing sign-off pending |
| Sunset Bay | L-shaped landmass, orange water, race jump, piers and bypass choices | Rebuilt island/ramp, original class buoy sequences, Expert slalom, steel balls and physical piers; all-class under-pier traversal, penalized final-lap bypass, shared three-wave field and moored launches verified; original nine-ring/two-ramp stunt route implemented; source calibration and visual sign-off pending |
| Drake Lake | Irregular square loop, small island, fog clearing, posts, slowing weeds | Rebuilt banks/island, posts and wet-hull weed resistance; all four original buoy sequences transcribed and race-tested; complete 13-post layout and clean all-class approaches verified; class-specific weed beds and both island channels mapped and tested; sixteen-ring/three-jump stunt reconstruction implemented; shortcut time advantage and final visual checks pending |
| Marine Fortress | Storm, fortress-shaped shoreline, crates, lap-dependent gate | Mapped original class buoys, boundary, finish, crates/timber, southern stone arches and lap-two gate; northern wave-assisted ridge and safe detour tested; fifteen-ring/two-jump stunt reconstruction implemented; source height/timing calibration and final visual comparison pending |
| Port Blue | Tanker, working dock, winding narrow tunnel, Hard route choice, Expert/Reverse outer closures, class-specific jump | Rebuilt geography/tunnel, required Expert/Reverse inner route and class-specific bow jumps; all four original buoy patterns and moved Reverse finish mapped and race-tested; preliminary sixteen-ring/three-jump stunt route with independent forward tunnel implemented; final boundary/visual/scale matching pending |
| Twilight City | Angular urban channel, jump-or-dive wall, low sand point, four race ramps and metal balls | Rebuilt channel/quays, mapped Hard/Expert/Reverse buoy patterns and Reverse route, four ramps, class-specific metal props and jump/dive wall; final source precision and visual matching pending |
| Glacier Coast | Constricted coast, ice ramps/sliding, breakable ice hazards | Reconstructed peninsula, original Expert/Reverse buoys, four fixed ramps, rideable ice and balance wipeouts; final source/visual sign-off pending |
| Southern Island | Connected islands/piers, dropping water, exposed ship and changing routes | Reconstructed islands, physical piers/ship, all four buoy maps and two ramps; grid-start ship jump, forward first-lap dives and all-class later-lap passages verified; final source/visual sign-off pending |
| Dolphin Park | Curved island, jetties, tunnel; distinct warm-up and stunt props | Mapped island, islets, jetty, arch and ten-ring/four-ramp stunt route implemented; full mastery run verified; warm-up layout and original timing/visual calibration pending |

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


### Twilight City source-marker reconstruction — work in progress, 2026-09-11

Uncommitted reconstruction in classic-courses.js, course-passages.js and race-core.js. Read local Hard/Expert/Reverse maps. Hard and Expert share 15 directional markers (12 yellow,3 red); Reverse has16 (10 yellow,6 red). Normal uses the Hard arrangement as a non-original free-selection fallback; Twilight City is absent from the original Normal championship. The mapping is now explicitly transcribed and checked in tests/city-buoys.test.mjs. Small split color components and anti-aliased outlines make center readings approximate within about two pixels; they are not extracted original engine coordinates.

Reverse normalized by (517-x,581-y), consistent with common water-outline bounds and finish placement. Its purple route was independently traced because its southern line differs from the existing forward anchors. cityReversePath is stored in forward-traversal order in the reverse-reference image; getCourse's existing reversal provides the actual race direction. An initial accidental double reversal was corrected before the latest tests. Finish aligned to map x240–319,y428. The existing mapped water outline is now also the out-of-course polygon, replacing checkpoint-distance ribbons that wrongly excluded the inner wall route.

Outer directional markers remain colored and retain their positions through passage configuration. The inner route uses distinct neutral branch checks. Their lateral spans now follow the actual ground banks, with .85 m hull clearance; the city entrance is a wide basin rather than a constant-width tube. Passage width changed6→8 m based on the roughly24-pixel central gap. An AI rider that has drifted well outside the shortcut returns to the outer guidance instead of trying to steer through the island. No race progress is injected. Layout revision3 is still under development, not released.

All four class settings finish three laps with zero misses in the mapped-course focused test, but regression remains INCOMPLETE. Full run work/city-buoys-full-tests.log:205/208 pass; failures are Hard-jump/Expert-dive every lap, outer-route completion under the old20000-step budget, and tuned Hard/Expert/Reverse championships. Pre-ramp-correction probes finished Hard in374.25 s and Expert in412.05 s; outer Expert453.55 s. Tuned rider2 completed standalone classes in353–377 s with two misses, but a full tuned championship could fail to finish its round within24000 steps. Do not simply lengthen the test limits or call this complete: wall approaches and recovery need fixing.

A Hard first-lap diagnostic showed26.27 s at gate5, with1380 collision-timer frames. The hull cleared the wall center at14.483 s,y1.581 but descended into its finite back edge at14.533 s,y1.276, then remained pinned near map272.8,232.7. Gate17 also took16.08 s with81 collision frames. Other gate intervals mostly2–7 s. This identifies real navigation/clearance issues rather than merely a stale test timeout.

The map's first-ramp rectangle is approximately15×27 pixels. Updated its race footprint from10×14 m to12×22 m at both Hard and Expert positions, keeping height2.7 m as the existing estimate. Latest focused run work/city-wall-focused.log:5/7 pass, including marker checks and all four three-lap races; the two existing barrier route tests still fail their results assertions. This latest runtime has NOT received a passing full suite. Next work should inspect actual full-hull clearances and gate17 approaches, plus the tuned championship round failure.

Browser selection initially stalled during the concurrent full suite. A fresh preview loaded correctly after the suite finished; old tab1 is now about:blank and active game is in-app browser1/tab7 at localhost4174/race.html?verify=1. cityTab is its previous CUA binding. Expert inspection held at14.733 s,lap1,hull y-2.71 m,dive remaining .12 s,zero misses,showing the rider beneath the wall. That browser frame predates the12×22 m ramp correction. No final current-file visual validation or publication. The latest runtime files remain uncommitted; this entry is a progress record, not a course sign-off.


### Twilight City wall and approach regression repair — 2026-09-11

Revalidated the uncommitted source-marker reconstruction. The12×22 m first-ramp footprint now clears Hard's wall on every lap. Further diagnostics showed the remaining delays came from buoy approaches: the seven-metre generic offset aimed forward riders into the northern sand point and quay edges. Forward Twilight marker offsets now use3.5 m, retaining the same physical buoy centers, crossing-plane orientations and required passing sides. Reverse retains7 m with its independently traced line. No collision geometry was weakened and no checkpoint progress is injected.

After this change the existing Hard-jump/Expert-dive test passes every lap with zero wall impacts and zero missed buoys. The outer-route test also passes its unchanged20000-step bound. All four class settings pass three-lap mapped-marker tests with zero misses; Reverse remains independently checked. Existing test limits were not enlarged. Final classic-course/barrier run:20/20 pass in7.91 s (work/city-classic-barriers-final.log). Championship and remaining regression results follow once complete.

Final-file Hard browser inspection held at14.450 s,lap1,hull y2.15 m,dive0,zero misses,with the hull visibly above the wall. Continued race finished first in295.733 s,81 adjudicated checks,zero misses,nine landings,High graphics and final60 FPS. Browser runtime errors were empty. The prior browser load stall did not recur in the fresh preview. Final Expert inspection is in progress.


Expert final browser inspection held at14.783 s,lap1,hull y-2.64 m,dive remaining .20 s,zero misses. The full race finished first in294.017 s,81 checks,zero misses,ten landings,High graphics and final60 FPS. Both forward wall behaviors now have actual rendered evidence with the corrected ramp.

The last championship regression was isolated to Reverse Twilight City with rider2,engine+1,grid[2,3,0,1]. The rider finished at368.50 s, but the40 s finish-wait period exceeded the24000-step test bound. Repeated quay-corner impacts before the western red markers at(23,451) and(41,374) cost10–23 s per section. Added ordinary helm approach points(30,475) and(31,405), with bounded activation ranges and moderate throttle, retaining the Reverse marker offsets and geometry. The exact championship-grid probe now finishes the race, including its finish wait, at385.48 s. The standard rider's same course probe finishes at385.28 s with zero misses. The faster rider still incurs three misses in that specific probe; this does not establish ideal AI performance or original timing parity. The existing championship assertion is being rerun; it has not been weakened or given a longer timeout.


Final regression for the complete Twilight reconstruction and repairs:208/208 tests pass in201.24 s (work/city-final-regression.log). This includes the unchanged tuned Hard/Expert/Reverse championship test, all venue/class races, every-lap Hard jump/Expert dive checks, outer route, stunts and shared physics. Earlier failing-run notes above are retained as history, not the final validation result. No test budgets or assertions were relaxed. Final CPU-intensive regression completed before the successful fresh-preview Reverse setup; the earlier browser automation timeouts during course selection were not reproduced after that reload. Reverse final-file browser run follows.


Final-file Reverse browser race finished first in345.283 s,lap times120.467/117.433/107.383,75 adjudicated checks,zero misses,zero landings,High graphics and final60 FPS. Runtime error log empty. Together with the Hard/Expert visual checks and208-test final suite, this closes the identified reconstruction regressions. Exact source timing, final geography/material comparison, original stunt layouts and whole-goal parity remain unverified or incomplete. The game is still unpublished at this checkpoint.

### Dolphin Park source reconstruction — 2026-09-11

Located Nintendo's official reprint of 64DREAM December1996, printed pp90–91 (PDF page13). The illustrated stunt map shows a C-shaped main island, zigzag jetty, two eastern islets, ten rings, three western ramps and one southwestern ramp. Transcribed approximate pixel coordinates, checkpoint order and boundary into source/dolphin-map.json. This is reference data, not a runtime change. Scale, ramp sizes and tunnel alignment remain uncalibrated. The guide's other stunt maps are available on PDF pages13–14 for subsequent reconstruction.

Source: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf

Inspected original gameplay https://www.youtube.com/watch?v=KkOAS5kXZ_I at15,20,25,30,35,40,45,50 seconds. The last sampled ring awards500; the map independently establishes ten rings. The starting view places the jetty left and rock arch right. The route passes three grouped ramps before its final section. Timer values observed13.8 at15s,13.4 at25s,8.4 at30s,10.8 at45s; continuous frame inspection is still needed to establish reset rules. Do not retain the generated twelve-ring arrangement as original parity or replace timers from these isolated samples alone.

Local PDFs and inspection renders are outside the shipped tree in work/course-reference. Both downloads and all19 page renders completed. Previous208-test result remains valid for unchanged runtime; no new gameplay validation claimed. Nothing published.


### Dolphin Park playable reconstruction — 2026-09-11

Connected the transcribed map through dolphin-course.js and CLASSIC_COURSES.practice, layout revision1. World conversion uses half a metre per reference pixel around(420,310); this is an estimate. Authored terrain replaces the circular basin with a C-shaped island and two eastern islets. The inner jetty has ten solid timber spans with separate collidable piles. A sixteen-section rock arch crosses the northeastern islet. Its north/south axis, roof heights, pier clearances and terrain elevations remain estimates requiring footage calibration. Removed the obsolete generic park buildings/piers.

Stunt mode now uses the original ten ring centers, three grouped western ramps, fourth southwestern ramp, three intermediate checkpoint spans and finish. Class selection preserves the forward stunt layout. Free ride currently exposes this same four-ramp layout; the distinct two-ramp warm-up arrangement remains unfinished. Timer remains38 seconds per section, pending original timing and world-scale calibration. No claim of full course parity.

Updated the ordinary-input mastery driver to follow the authored objects, pace the closely grouped jumps, perform three different aerial rotations, dive and complete water poses. It cannot grant progress. Existing mastery assertions pass without relaxing score, crash, trick or ring requirements. Browser full run:56.417 seconds,10069 points,10/10 rings,8/8 mastery moves,zero crashes,four landings,High graphics,60 FPS,errors[]. Initial apex inspection exposed a camera-blocking ramp sign; removed park ramp billboards and used timber decks. Also removed race directional buoys and the duplicate finish gantry from the authored stunt presentation, resized checkpoint labels, and rounded/textured the arch. Final departure view shows one start banner and an open rock arch with no browser errors.

First full regression:208/211 pass. Failures were the old12-ring assumption, unversioned practice-record expectation, and free-ride driver assuming an air ring after its first ramp. Updated the first two to the actual reconstructed layout; legacy layout0 records remain explicitly tested. The free-ride driver now follows the authored route and tracks the first ramp's actual landing counter, excluding preceding wave landings. Its unchanged launch/ring/landing tests now pass for calm,chop,storm. Final focused regressions9/9 pass. Added a powered-hull traversal test under the arch and between jetty supports. Its first fixture aimed directly at a real support; moving the fixture to the midpoint between supports verified clear passage without changing geometry. Dolphin tests4/4 pass. Final full regression pending below.

Final full regression:211/211 pass in175.27 seconds (work/dolphin-final-regression.log). The subsequently added powered passage test passes separately in the4-test Dolphin suite (work/dolphin-traversal-tests.log); thus212 distinct tests have passing evidence, with no claim that the full invocation included that last test. Final changes after the regression are rendering-only deck materials/seams and documentation. No publication or full-parity sign-off.

Final deck visual check: apex held at34.117 seconds,3.99 m above the sampled water,49.41 km/h. Timber-colored planks replace the temporary bark texture, the ramp billboard is gone, and the rider remains visible between the grouped ramps. Browser error log empty. This checks rendering and actual airtime, not original ramp dimensions or timing parity.


### Sunny Beach authored stunt route — 2026-09-11

Used 64DREAM December1996 printed p90 (PDF page13), crop x0,y1170,w880,h630 from a4000-pixel-long-edge render. Reference: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf . The diagram contains twelve rings and one ramp, with a close pair after the jump. Its leftmost course end is cropped out. Original footage https://www.youtube.com/watch?v=A-FLTLuPHuM inspected at11,16,21,26 seconds confirms an end-turn checkpoint and water-level rings after the jump. That checkpoint's exact position is still estimated.

sunny-stunts.js maps the hand-drawn horizontal circuit onto the existing vertical Sunny shoreline: longitudinal scale.42 m/pixel, with a piecewise cross-shore fit preserving the narrow island and wet slalom lanes. This is not a uniform metric reconstruction. It provides distinct stunt anchors, twelve ordered ring centers, one forward jump and four checkpoint spans. Race-mode anchors, buoys and hazards are unchanged. Sunny layout revision4 isolates revised records, including stunt scores. All class selections use the forward stunt arrangement and exclude race-only metal balls. Free ride keeps its existing four-ramp playground, explicitly separate from the original stunt layout; Dolphin Park keeps its authored free-water arrangement.

A source-object verification driver uses only steering, throttle, braking, trim and trick inputs. Initially it missed the final ring because it aimed three metres past the crossing plane while turning through the last slalom. Reducing that look-ahead to1.3 m clears all twelve without moving or enlarging rings. Four class selections complete all four checkpoints,12/12 rings,a clean backflip and zero crashes. Combined Sunny/stunt/playground/park-master tests20/20 pass. The existing all-nine stunt completion test also passes with the new geometry.

Browser inspection held the actual jump apex at41.150 seconds,3.738 m above water,44.94 km/h. Continuing finished in67.017 seconds with10089 points,12/12 rings,one landing,zero misses or crashes,High graphics,60 FPS and no browser errors. Added red-and-white vertex colors to authored-course rings with a single material per ring; their dimensions and interaction planes are unchanged. Final visual check and full regression follow below.

Original fifteen-second-scale checkpoint timing, exact ring elevations, the cropped checkpoint coordinates and final geography/visual matching remain uncalibrated. Current section timer remains38 seconds. This is a course-specific reconstruction step, not full parity or a publication.

Final full regression:215/215 pass in169.48 seconds (work/sunny-stunts-final-regression.log). The final ring colors were visually checked at the same jump apex with no browser errors. Review then caught that merely owning stunt-layout data could hide a course's race buoys/gantry. course-world.js now enables authored-stunt visuals only when the active course is flagged stunt or freeStunts. Final Sunny race-mode startup visibly retains its finish gantry and race presentation; final stunt-mode browser run follows. This rendering-only correction does not alter physics or adjudication. No publication.

Final-file stunt browser run after the race/stunt rendering correction:67.017 seconds,10089 points,12/12 rings,4/4 checkpoints,one landing,zero crashes,High graphics,60 FPS,errors[]. The goal remains active; this source route is not signed off for original scale, timing or exact visual fidelity.


### Sunset Bay authored stunt route — 2026-09-11

Transcribed Nintendo's reprinted 64DREAM December1996 p90 (PDF page13), crop x1100,y1930,w920,h700 at4000 pixels on the long edge. The map shows four rings before the first end turn, two after the jump between the piers, and three in the final inner bay: nine total, with two ramps, three intermediate checkpoint spans and finish. Source: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf . Re-inspected the saved source crop alongside the rendered first jump.

sunset-stunts.js fits these objects to the existing pier stations with a piecewise longitudinal transform. It also transcribes the distinct stunt boundary; the race boundary incorrectly disqualified the original outer stunt route. The cropped far-right boundary is estimated, as are metric scale, ramp dimensions, ring elevation and38-second section timers. Sunset layout revision5 separates changed records. All classes use the forward stunt arrangement; race objects remain unchanged and free ride retains its separate generated playground.

The ordinary-input verification driver now starts flips only after actual ramp contact, avoiding accidental flip attempts during shorter wave launches. No physical forces, ring progress or checkpoint awards are injected. New tests exercise all four class selections, collect all nine rings, launch from both ramps, cross beneath both piers between their solid supports, complete all checkpoints and land a clean flip with zero stunt crashes. Existing assertions and test budgets were not relaxed. Final full regression:218/218 pass in178.75 seconds (work/sunset-stunts-final-regression.log).

Final-file browser apex inspection held at27.983 seconds,4.176 m above sampled water and51.11 km/h. The two post-jump rings and next pier are visibly aligned with the route. Full browser completion evidence follows below. This is a source-layout reconstruction, not final original scale, timing or visual parity. Nothing published.

Final browser run completed in90.100 seconds with7859 points,9/9 rings,4/4 checkpoints,40 tricks,zero stunt crashes and no disqualification. High graphics,60 FPS and browser error log empty. Seven landings include ordinary wave airtime, not seven ramp jumps. The separate physics test identifies both actual ramp contacts. Six other original stunt layouts and Dolphin warm-up remain unfinished; all nine courses still require final source calibration and visual sign-off.


### Drake Lake stunt source and playable reconstruction — 2026-09-11

Re-inspected Nintendo's 64DREAM December1996 reprint, printed p91 (PDF page13), rendering a4000-pixel-long-edge crop at x3130,y220,w860,h670. source/drake-map.json preserves the approximate shorelines, ring centers, ramps, checkpoint spans, visible posts and weed clumps. The diagram shows sixteen rings and three closely grouped jumps. Its route starts with three rings, crosses a checkpoint, threads the outer small-island channel including four close rings, then passes another checkpoint before the three jumps. Two rings lead into checkpoint three; the final three rings approach the finish through the post area.

Source: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf . The source is a hand-drawn diagram, not a metric survey. Its orientation differs from the existing race map. drake-stunts.js uses a manually fitted correspondence to the existing shoreline rather than claiming a uniform pixel transform. All384 sampled points of the fitted circuit stay at least.8 m below baseline water. Race geography, marker positions and race ramps are unchanged. Layout revision4 separates revised records.

The sixteen-ring, three-ramp arrangement replaces the generated stunt objects. All four class selections use identical forward rings, normal-class posts and weeds. The illustration shows seven post symbols and six weed clumps, but does not establish whether it draws every physical obstacle. The existing thirteen posts and three mapped weed beds are retained pending continuous original stunt-footage comparison; their exact stunt-mode parity remains unverified. The authored-layout adapter now permits explicit stunt rocks/resistance, preserving solid posts rather than clearing every course's obstacles. Free ride remains a separate generated four-ramp playground.

The ordinary-input driver completes all sixteen rings in sequence, contacts all three ramps, records three landings, completes a clean flip and all four checkpoints with zero stunt crashes in each class. Probe duration71.900 s,score13620. No physics, progress or scoring is injected. Focused Drake/shared-stunt tests10/10 pass in1.63 s. Full regression and rendered verification are in progress. Ramp height3.1 m, width17 m, length14 m, ring height1.35 m and38-second checkpoint allowances remain estimates; none is claimed to reproduce original timing or dimensions. This course has no final visual sign-off and nothing has been published.

Final regression:221/221 pass in161.64 seconds (work/drake-stunts-final-regression.log). Browser apex inspection at39.717 seconds showed the actual first jump,3.766 m above sampled water,51.26 km/h,with the next two timber ramps visible ahead. Full rendered run completed in71.900 seconds,13620 points,16/16 rings,4/4 checkpoints,three landings,zero stunt crashes,High graphics,60 FPS and errors[]. This verifies current rendering and mechanics, not exact source fidelity.

Original footage https://www.youtube.com/watch?v=nvCLdJ5drVU was inspected at15,30 and40 seconds using the browser player. The15-second frame shows red/white upright rings at water level; the30-second frame shows the next timber ramp during the grouped-jump sequence; the40-second frame shows a substantial timber post immediately beside a final-section ring. A moving frame around18 seconds also shows weed clumps in the ring route. These observations support retaining physical posts/weeds but do not establish their complete count. The original ramp has a curved rising deck profile; the current simple ramp and exact post-to-ring offsets remain visual/interaction mismatches to resolve. The original video's faster progress is not an isolated timing calibration because its rider speed and stunt choices differ. No original timers were inferred from the sparse frames.

Five other original stunt layouts, Dolphin Park warm-up, course-specific dimensional/timing calibration and final visual comparisons remain unfinished. Goal active; this reconstruction remains local and unpublished.


### Marine Fortress authored stunt route — 2026-09-11

Transcribed the fifteen-ring/two-jump diagram from Nintendo's 64DREAM December1996 reprint, printed p91 (PDF page13). The4000-pixel-long-edge crop is x1980,y1030,w860,h680; source/fort-stunt-map.json records ring centers, jumps and checkpoint spans. The second ring is partially clipped by the illustration edge and its exact center remains estimated. The route includes five rings approaching the first checkpoint, a ring around the northern point, the first jump and two rings before checkpoint two, two more rings before the arch section, two in that section, then the second jump and a three-ring finish approach. Source: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf .

fort-stunts.js fits the source object sequence to the existing race shoreline and physical arch route; it is not a uniform metric conversion of the stylized diagram. Layout revision6 isolates changed records. Race buoys, terrain, gate and race obstacles remain unchanged. All class selections use the same forward stunt layout with no race cargo, while free ride retains its separate generated playground. All384 sampled route points remain below baseline water by at least.8 m.

Initial ordinary-input run completed but missed the first post-jump ring and middle final-slalom ring. The first ramp's smoothed path tangent aimed away from its landing ring. Aligned the launch with that ring and supplied a helm approach point before the ramp. The final slalom now requests9 m/s from the verification driver instead of13 m/s; it still uses ordinary throttle and steering. Ring positions/radii, checkpoint limits and physics were not relaxed to pass. All four class settings now collect all fifteen in sequence, use both ramps, complete all checkpoints, land a clean flip and incur zero stunt crashes. Physical traversal also passes beneath all four arch openings with zero barrier collision frames. Focused Fortress/shared-stunt suite10/10 pass in1.64 s.

Current ramps are17 m wide,14 m long and3.1 m high; rings use1.35 m center height and2.8 m radius, and checkpoint timers remain38 seconds. These are estimates requiring original footage calibration, along with the precise wall/ring offsets and original visual comparison. Current probe finishes in94.067 seconds with11347 points. Browser and full-suite evidence follow; no publication or full-parity sign-off.

Final full regression:224/224 pass in172.12 seconds (work/fort-stunts-final-regression.log). Final-file browser apex held at27.950 seconds,3.492 m above the sampled water,45.08 km/h,with the first landing ring visible directly ahead. Continued run finished in94.067 seconds,11347 points,15/15 rings,4/4 checkpoints,zero stunt crashes,High graphics,60 FPS and browser errors[]. Ten landings include ordinary wave airtime; the separate physics test establishes both actual ramp contacts and all four unobstructed arch traversals.

Original footage https://www.youtube.com/watch?v=eVQDfMX75hU inspected after starting the player, paused at25,30,40,45 seconds. At25s the broad timber jump spans much of the channel. At30s a ring sits beside a block-textured seawall with a checkpoint beyond. At40s the rider is in open water; at45s a passed-ring award is visible beside a substantial wall support. These frames do not prove exact arch count or spacing. They expose remaining visual gaps: our smooth inland wall and sloped grassy bank do not match the original masonry at the waterline, and the original jump width/profile needs measurement. Those differences are not covered by the passing traversal tests. No timer or scale changes were inferred from these sparse frames. Four remaining courses still use generated stunt layouts; Dolphin warm-up and all final calibration/visual sign-offs remain unfinished. Nothing published.


### Port Blue stunt source transcription — 2026-09-11

Re-inspected Nintendo's 64DREAM December1996 reprint, printed p91 (PDF page13), using a4000-pixel-long-edge crop x3080,y1880,w910,h670. source/port-stunt-map.json now preserves sixteen ring centers, three ramp centers, four checkpoint spans, two visible dock cargo centers and their ordered sections. Source: https://assets.topics.apps-jp.nintendo.com/uploads/files/2022/08/03/00/27/03/820845/53229_1996_12_02.pdf . The first jump precedes three rings and checkpoint one. Seven rings cross the upper dock region, followed by three close exit rings and checkpoint two. Three rings round the bow before checkpoint three. Two jumps complete the return toward finish. The hand-drawn diagram is not a metric survey.

Inspected current runtime before implementation. Port's stunt mode still inherits generated objects and a race-derived passage. Normal has passage.enabled=false; Expert and Reverse retain race closedAreas. getCourse ground/renderGround functions close over the original course object, so modifying arrays or flags only on a spread copy does not rebuild the collision floor. An authored stunt conversion needs an independently configured forward passage and matching ground, with race restrictions preserved for actual races. Ring placement also needs footage confirmation: distributing the seven dock rings along arbitrary fractions of the current winding tunnel would be unsupported by the diagram alone.

Located original all-course footage https://www.youtube.com/watch?v=RWIpYVIzh5I with Port Blue chapter4:39. Browser tab19 reached the page but playback switched to an advertisement at0.917/30.061 seconds. Repeated normal UI play attempts left the video paused; no Port gameplay frame was inspected, and no visual confirmation is claimed. This is a reference-player issue, not a whole-goal blocker. Next work should inspect another original Port stunt recording or restore playback, then fit and implement the source route with independently constructed passage geometry.

This commit changes reference data and documentation only. Runtime remains at the verified Marine Fortress reconstruction; prior224/224 tests still describe that unchanged runtime. Port Blue still has a generated stunt layout. All previously listed final source calibration and visual requirements remain outstanding. Nothing published; goal active.


### Port Blue preliminary playable stunt fit — 2026-09-11

Implemented port-stunts.js from the transcribed sixteen-ring/three-jump sequence. This is a preliminary fit to the existing dock channel, explicitly not final original positional fidelity: the seven dock rings currently follow available channel bends, while source footage is still needed to confirm their exact locations and relationship to the roof. The two cargo symbols in the source are not yet placed. Retained the source order of first jump, three rings, checkpoint; seven dock rings, three exit rings, checkpoint; three bow rings, checkpoint; two return jumps, finish. Port layout revision4 separates changed records.

The authored layout requests a fresh Normal forward course before opening a cloned passage. This rebuilds the ground closure without Expert/Reverse race blockages, preserves actual race restrictions, and opens the stunt tunnel on Normal too. All class selections produce identical stunt passage paths, rings and ground. Free ride retains its separate generated four-ramp arrangement. New tests explicitly check a point blocked in Expert race but wet in stunt mode and confirm converting Normal leaves its original race tunnel disabled.

Initial ordinary-input run timed out at52.317 s before checkpoint two after collecting thirteen rings. Increasing the dock steering target from8 to9 m/s clears that section within the unchanged38-second allowance. No checkpoint time, ring radius or physics was relaxed. All four class probes finish in81.217 seconds with13230 points,16/16 rings,4/4 checkpoints,three ramp contacts,three landings,clean flips and zero stunt crashes. Passage collision checks remain zero while the hull spends1461 simulated frames beneath the roof. Focused Port/shared-stunt tests10/10 pass in1.65 seconds. Full regression and rendered inspection follow.

Ramps remain17 m wide,14 m long,3.1 m high; rings remain1.35 m high with2.8 m radius. These dimensions, dock correspondence, original cargo and checkpoint timing are uncalibrated. This preliminary runtime replacement does not close the Port source-matching requirement. Nothing published.

Original playback succeeded in a fresh Chrome tab (browser2/tab818374553) at https://www.youtube.com/watch?v=RWIpYVIzh5I&t=279s . Inspected opening view around293.7 s, then303.7,308.7,318.7 and328.7 s. Dock rings run beside substantial rusted walls/supports; the later view shows the exit-ring group in open water by the ship and checkpoint. The328.7-second view shows a jump near the finish. Sparse frames do not establish all dimensions or timer resets, but they resolve the earlier reference-player issue.

The new footage contradicted placing two exit rings under the roof. Moved the three exit rings to race-map coordinates(250,291),(224,295),(195,305), beyond the final roof segment, and retained the full winding approach as helm waypoints. A new geometric assertion requires every exit ring to be farther from the roof centerline than passage width plus ring radius. The first corrected run missed one ring during the sharp exit turn. Slowing the helm before the final tunnel bend to5 m/s, then accelerating toward the rings, clears all sixteen without moving the corrected rings or enlarging their radii. Final focused Port suite3/3 passes; full suite is rerunning because the source correction followed the earlier227/227 pass in177.85 s.

The prior tunnel screenshot held at27.083 s with a visible rider and rings; it predates the exit-ring correction. Current final run was visually inspected approaching a return ramp. Remaining visible mismatches include the plain tunnel walls/roof versus original rusted dock structures, missing source cargo, exact seven dock-ring locations and jump/finish spacing. Passing the navigation tests does not close those differences. No publication.

Final-file browser run after the source exit-ring correction completed in82.033 seconds,13186 points,16/16 rings,4/4 checkpoints,three landings,zero stunt crashes,High graphics,60 FPS and errors[]. The final return-ramp view was also inspected. Full regression result follows after the active process completes. Three courses still have generated stunt layouts, and Port remains a preliminary positional reconstruction despite this playable sequence.

Final full regression after the exit correction:227/227 pass in182.84 seconds (work/port-stunts-exit-regression.log). All existing test limits retained. This closes the introduced runtime regressions, not original geometry/visual/timing parity.


### Twilight City stunt branch research — 2026-09-11

Re-inspected Nintendo's 64DREAM December1996 printed p92 (PDF page14), crop x1750,y350,w1230,h1000 at4000 pixels on the long edge. The right edge is clipped in the supplied source page, not merely this inspection crop. Saved source/city-stunt-map.json with the six-ring shortcut, three-ring outer branch, visible second jump/ring, five-ring cluster, checkpoint spans and two partially visible finish rings/ramps. Do not treat edge observations as complete centers or infer a verified total count from them.

The guide describes using the opening jump for a submarine shortcut through submerged rings and past the wall, collecting six rings on that path, three more than on the outer path. This is a substantive branch requirement: a correct stunt reconstruction must include both routes and must not require collecting both branches in a normal lap. The guide also describes two consecutive ramps near the finish and obstacles around them. Current generated stunts do not encode this course-specific arrangement.

Inspected original recording https://www.youtube.com/watch?v=J2P3ChbV2vU in Chrome browser2/tab818374555 at10,12,14,15,65,70,75 seconds. Opening frames show the approach ramp, airtime and return toward water; these samples do not yet locate the exact submerged-ring crossings. At65s a650 ring award appears among the metal obstacles, establishing a13-ring chain at that instant, not the total course count. The recording description says it uses a pause trick, so its elapsed video time and high score are unsuitable for normal timing calibration. Period-key frame stepping works in this player at approximately1/30-second increments and can resolve the dive more closely.

This is reference data and a clarified course requirement, not a runtime replacement. Twilight City still uses generated stunt objects. Next work must confirm the complete finish arrangement, identify submerged rings from frame-by-frame footage, implement both opening routes and test actual dive/outer-path traversal. Prior227/227 regression result still applies to the unchanged Port reconstruction. Full goal remains active and unpublished.


### Twilight City stunt implementation in progress — 2026-09-11

Added uncommitted city-stunts.js with the six-ring inner branch, three-ring outer branch, shared second-jump ring, five-ring cluster and two provisional finish rings. The resulting17-object layout is a working hypothesis from the visible/partial map, not a verified total. Three shortcut rings are provisionally submerged at race-map(269,251),(269,243),(269,235). Four ramps retain estimated race-derived dimensions. The clipped finish correspondence remains unverified. Layout revision4 and a fresh forward course prevent class reversal from changing the stunt geometry. Default navigation follows the outer branch; the source-object verifier has separate inner and outer target lists.

Extended the authored verifier to request an actual descending dive after the marked opening ramp, suppressing a conflicting flip there. Input flags alone drive physics. Corrected an intermediate aliasing bug: outer target tangent edits now operate on cloned targets so they do not mutate shared inner targets. The opening dive currently collects the first two submerged rings but resurfaces too soon for the third. The inner verifier reaches all four checkpoints in roughly104 seconds, but misses that ring and the final ring and incurs one stunt wipeout. The outer verifier still times out before checkpoint one. No score, checkpoint timer, ring radius or collision volume was relaxed to hide these failures.

Current shared-stunt regression:6/7 pass; the all-nine real-helm completion test fails on neon with checkpoint timeout. A direct aiInput probe times out at38.033 s,checkpoint0,next gate8,world(131.145,-172.999),speed.983 m/s,near the northern outer bend. This is an authoritative failure of the candidate, not a passing playable reconstruction. Next work should inspect that gate's bank clearance, correct outer approaches, finish the dive timing and final jumps, then run the relevant suite and browser inspection. The prior227/227 result applies only to the committed Port version, not these new files.

Files remain local and uncommitted: city-stunts.js, classic-courses.js, race-verification.js and this log. No asset cache refresh or browser validation has been claimed for this candidate. Do not publish or mark parity complete. The full goal remains active.


### Twilight City approach diagnosis — 2026-09-11

Revalidated the unfinished files and reproduced the timeout. A half-second helm trace found a shoreline impact at28.5 seconds, world(127.5,-185.9), followed by recovery into open water and slow turning. The earlier final-position snapshot alone did not expose that impact. Added an intermediate water-channel approach at race-map(357,55) between the second and third outer rings. Also found three sampled path positions crossing the inner quay near race-map(55,388); routed that bend through(48,383). Ring positions, terrain, physics, radii and timers were not changed. Added a straight approach before the first finish jump and slower steering targets around the tight shared bend.

The complete384-sample navigation curve is now below the collision shoreline threshold in all four class selections. Both opening branches collect their own rings with ordinary helm controls: six inner rings including the powered dive, or three outer rings, without collecting the alternate branch or recording a stunt crash. These limited regressions intentionally do not claim full-course completion.

Current inner verification finishes in95.383 seconds with4/4 checkpoints,zero stunt crashes and12/14 selected-route rings; shared rings13 and15 (zero-based object indices) still miss. Both generic AI and the outer verifier still time out at38.017 seconds before checkpoint one, after collecting all three outer rings. The first checkpoint approach/timing remains unresolved. Focused city/shared tests8/9 pass in1.02 seconds; the existing all-nine completion test still fails on neon. Log:work/city-stunts-corner-check.log. No existing assertion or time allowance was weakened.

Updated the reference status to acknowledge the preliminary runtime candidate. Exact source fidelity, missing metal props, final-ring approaches, outer completion, full regression and visual inspection remain outstanding. These files remain uncommitted and unpublished; no asset-cache or browser verification claimed.


### Twilight City finish obstacles and result evidence — 2026-09-11

Re-inspected the official source crop and the original recording https://www.youtube.com/watch?v=J2P3ChbV2vU at35,40,60,65,80,85 and approximately87 seconds. At65s four visibly spiked metal floats span the channel between the two finish jumps. Added that four-float row to city-stunts.js using the existing mapped race-row coordinates(108,485),(108,496),(108,507),(108,518). Footage confirms type, count in this row and relative placement; exact stunt spacing remains provisional. The second-jump area's other hazards still need continuous inspection before copying them from a race class.

Added optional spiked rendering to ball obstacles: a small metal core and six cones whose tips stay within the existing collision radius. Other ball obstacles retain spherical appearance. All four new floats block a surface hull in isolated contact tests; the row survives all four class conversions. This restores actual obstacles rather than decorative markers. Normal race arrays are unchanged.

The original result screen reads TIME00000,STUNTS41012,RINGS05250,TOTAL46262.5250 equals50 times the sum1..14 and is consistent with a fourteen-ring uninterrupted shortcut run. Alongside the visible650 award near the finish, this supports the provisional inner-route count, but does not prove absence of other optional rings. This pause-trick recording is still unsuitable for normal time or stunt-score calibration.

Focused city/barrier/environment/shared-stunt tests21/22 pass in11.50 seconds (work/city-stunt-metal-check.log); the unchanged all-nine completion assertion still fails on neon's outer checkpoint timeout. Three city-specific tests pass, covering navigable route samples, both opening branches via actual controls and physical collision with every finish float.

Refreshed53 module hashes and ran the current files in the browser. Inner route completes in95.433 seconds,8567 points,13/14 chosen-route rings,4/4 checkpoints,four landings,zero stunt crashes,High graphics and a final60 FPS reading. Shared object13 remains missed. The metal inspection pauses at77.883 seconds withfour obstacles detected, but the camera sees the raised ramp in the foreground; that screenshot does not establish close-up visual fidelity of the spike meshes. The urban architecture, ramp scale, ring heights and exact geometry remain visibly different from the source, and the inspection camera needs a better angle for the floats. No complete visual sign-off or full-suite pass is claimed.

The outer timeout, remaining ring approach, complete source geometry and full-course parity remain unresolved. Current changes remain local, uncommitted and unpublished. No live test process remains after the focused suite exited1.


### Twilight City inner-route completion — 2026-09-11

Corrected shared ring13's normal to follow the straight channel beside the quay (world tx0,tz1). The prior averaged normal pointed diagonally around the next bend and its centered approach intersected the quay corner. This changes the estimated ring orientation, not its center, radius, height, nearby terrain or physics. Its exact original orientation remains uncalibrated.

Also corrected the outer verification list: tangent recomputation now applies only to steering waypoints. Ring, ramp and checkpoint targets retain the actual physical objects' directions instead of inheriting a different averaged route direction. Added a regression that checks every target against its physical crossing plane.

Ordinary helm input now completes the inner route in all four class selections with14/14 selected-route rings,all4 checkpoints,a powered dive andzero stunt crashes. The Normal probe completes in95.467 seconds. The untouched outer branch remains uncollected, as intended for mutually exclusive opening routes. New full-inner-route and crossing-direction regressions pass; focused city/shared checks11/12 pass in1.03 seconds (work/city-stunt-inner-complete-check.log). The existing all-nine generic-helm completion test still fails on neon. No assertion, timer, ring radius or physics was relaxed.

A detailed outer trace shows the third ring at approximately28 seconds, the long northern straight through36 seconds, and braking for the western turn at37 seconds. Both the outer verifier and generic AI still expire at38.017 seconds before checkpoint one. Increasing early target speeds in isolated probes did not resolve it; those experimental speed changes were not saved. Source video frames25,30 and32 seconds show the inner corridor, northern turn, then first gantry and following ramp, but do not yet establish precise checkpoint placement. No checkpoint move was made based on the timeout.

Refreshed53 module hashes. Browser verification follows. Full source matching, outer-route completion, remaining courses and publication are still pending; the goal is not complete.

Final-file browser run confirms95.467 seconds,10776 points,14/14 inner-route rings in one chain,4/4 checkpoints,four landings,zero stunt crashes,High graphics and final60 FPS. Inspected the completed results screen. This proves the current inner loop, not original dimensions, timing, complete city visuals or the still-failing outer branch. Changes remain uncommitted and unpublished.


### Original Twilight City timer correction — 2026-09-11

Found and inspected a second original recording: https://www.youtube.com/watch?v=-y1Du4ftw0k (Cyberman65). Critical viewing issue: locator-based seeking scrolls the YouTube player down, clipping roughly300 pixels from the top of an836-pixel video and hiding the HUD. This was page scroll, not missing HUD in the recording. After each seek, scroll the page upward before inspecting the screenshot. CUA tab.scroll([1600,200],'up',2) restores the full frame. Avoid interpreting a cropped player as a cropped source.

Original visible values: start at5s shows20.0 seconds;10s shows15.7;20s shows5.7;23s shows2.7 approaching checkpoint one;24s shows14.8 andTIME EXTEND/TIME100. Near34s the second checkpoint approach shows4.7; near35s it shows14.1 andTIME EXTEND/TIME230. Near42s the third checkpoint shows14.9 andTIME EXTEND, facing the first finish ramp. These establish a20-second first section and15-second resets for the three subsequent sections, without carrying remaining time forward. Saved observations and source in source/city-stunt-map.json. Some whole-second frame-step timestamps are approximate; HUD tenths were read directly. The official manual confirms checkpoint-based extensions and five points per remaining tenth: https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_8/Manual_Nintendo64_WaveRace64_EN.pdf .

Replaced Twilight City's estimated38-second section limits with20/15/15/15. createStunt now initializes from the first authored checkpoint limit, createRace passes the active course to it, and a successful checkpoint resets to the next section's authored limit. Other courses retain their existing38-second estimates until independently calibrated. Added a mechanics regression proving per-section initialization/reset, no carryover and the correct100-point bonus for2.0 seconds remaining.

This source correction deliberately invalidates the previous95.467-second inner-route pass: that run used the wrong time allowances. Current focused city/shared tests10/13 pass; three traversal checks fail (opening branches, complete inner route, all-nine generic helm). The timer mechanics check passes. Log:work/city-original-timers-check.log. Existing traversal assertions remain in place and were not weakened or skipped. Port/Drake regression6/6 passes in.74 seconds (work/stunt-timer-regression-check.log). Refreshed53 module hashes; no browser run of the new timer values yet.

The correct next work is to calibrate the city's route distances, craft pace and jump timing against this original footage. Increasing the timer to hide the timeout would contradict the source. Both city branches now require pacing reconstruction under the actual original allowances. No course-parity sign-off, full-suite pass or publication is claimed. Changes remain local and uncommitted; no test process remains running.

### Twilight launch measurements — 2026-09-11

Reopened the Cyberman65 reference and inspected three full HUD frames: remaining19.7/speed16, remaining18.7/speed68, remaining17.7/speed95. Thus the original reaches68 km/h by1.3 race seconds and95 by2.3 seconds, still approaching the opening ramp on water. Exact original rider/tuning and throttle timing are unverified. Saved the observations, uncertainty and comparison in source/city-launch-calibration.json.

Added reproducible source/probe-launch.mjs. It retains the countdown and compares held throttle against throttle pressed at GO for all four riders in an isolated calm deep-water fixture. At2.3 seconds the presets reach50.654–64.499 km/h; Mara reaches56.411. Both launch inputs produce identical curves despite correctly differing rocketStarted flags: the current rocketStart only sets power=5, already full in stunt/practice mode. Consequently a missing timed input in the verifier cannot explain this local acceleration gap. This fixture measures acceleration, not course traversal or original rocket-start fidelity. The saved diagnostic checks finite simulation values and that the rider stays active.

Acceleration and the verifier's low cruising target must be calibrated before treating the remaining timing mismatch as a course-scale measurement. No global speed multiplier, geometry scaling or timer relaxation was applied from this single unknown original rider setup. Course completion still fails under the corrected original allowances; remaining courses and publication remain outstanding.

### Acceleration response candidate — 2026-09-11

Implemented a local acceleration candidate in race-core.js: multiply the prior net longitudinal engine force by1 + throttle * (.85 +2.4 * speedRatioSquared). This increases launch and mid-speed response without an instantaneous velocity boost, while retaining wave-dependent intake, braking, hull drag and rider ratings. Full-throttle balanced-rider samples in the same calm fixture are15.93/67.22/95.87 km/h at.3/1.3/2.3 seconds, versus original16/68/95. At10 seconds the candidate reaches100.92 km/h. Original rider identity/tuning remain uncertain; this is an envelope fit rather than a recovered original physics formula. Earlier sixth-power resistance experiments changed partial-throttle cruising too much and were replaced, not shipped.

Added a source-backed speed-envelope regression, including sustained speed and throttle-release checks. Full final-candidate suite:234 tests,222 pass,12 fail,113.084 seconds; work/acceleration-response-regression.log. All failures remain visible. Besides the existing city timing failures, affected traversal cases include city wall shortcuts, Drake gates, Fortress stunts/ridge, Glacier classes, Port stunts/pier routes and the aggregate venue checks. The faster response changes approach and landing timing; these regressions require correction before release. This candidate has no full-loop sign-off and must not be published as parity.

Added source/probe-city-pace.mjs for ordinary-control traces of both openings. Final candidate inner ramp contact occurs8.967 seconds at50.97 km/h. It hits rings0/1, misses dive ring2, then hits3/4 and expires at20 seconds before ring5/checkpoint1. The outer branch hits its first ring at17.683 seconds and also expires at20. Source and verifier cruising speeds still differ substantially. No checkpoint timer, radius, route assertion or geometry was relaxed. Trace:work/city-response-pace.json.

Refreshed53 module hashes and opened the final candidate in Chrome on127.0.0.1:4174. Inspected the rendered craft, water reflections and start corridor. Browser error log is empty, but the observed run only reached the opening straight; it is not a completed browser loop. All test processes have completed. Changes remain local and uncommitted; pending work includes approach/jump regressions, original route dimensions and remaining course reconstruction.

### Port and Fortress guided approaches repaired — 2026-09-11

Added source/probe-stunt-crossings.mjs to report ring crossings, ramp contact heading/yaw, landings and verification target changes without modifying simulation progress. The acceleration candidate's misses were lateral: Port ring10 at roughly4.1 metres from centre after the tunnel exit bend; Fortress ring6 at roughly4.2 metres after the first ramp. Both exceed the unchanged2.8-metre ring radius. A ramp trace showed appreciable yaw at takeoff, where reduced water contact prevents steering from correcting the trajectory.

Updated the ordinary-control stunt guide to slow to7 m/s while aligning heading/yaw before climbing a ramp, brake when more than2 m/s above the target speed, and require a waypoint crossing within2 metres of its centreline before advancing. Port now holds6 m/s through ring10 after the5 m/s tunnel exit waypoint rather than accelerating to9 m/s before completing the bend. These are driving inputs only; no ring positions/radii, checkpoint timers, world geometry, collision handling, scoring, acceleration or test assertions changed in this repair.

Port/ Fortress focused checks6/6 pass across all four class selections, including every ring, checkpoint, jump, roof/arch clearance and zero collisions. Normal ordinary-input traces finish Port at82.483 seconds with16 rings and Fortress at91.267 seconds with15 rings. Logs:work/stunt-exit-check.log, work/port-stunt-repaired.json, work/fort-stunt-repaired.json. All authored-stunt plus speed checks27/30 pass; only the existing Twilight openings/completion and aggregate nine-venue stunt check fail. Full suite224/234 passes in113.141 seconds (work/stunt-repair-full-regression.log), improving from222/234. Ten remaining failures cover city timing/wall shortcuts, Drake gates, Fortress ridge, Glacier classes, Southern Island race pier approaches and aggregate venue checks. No assertions were weakened.

Refreshed53 module hashes. Browser Port verification is in progress; opening jump and the first eight consecutive rings in the tunnel were observed with an empty error log. Course parity and original geography/timing remain incomplete; local changes are not published. The full test process is complete.

Browser Port run subsequently completed and its result screen was inspected:82.483 seconds,13175 points,16/16 rings in one chain,4/4 checkpoints,three landings,zero crashes/misses and empty console error log. The corrected exit ring was observed as the chain increased from10 through13. This confirms the repaired traversal in the renderer. Performance is not signed off: the diagnostic ended atLow quality and1 FPS, and simulation advanced slowly in this browser session. The cause (foreground/background throttling, rendering cost or environment) has not been isolated; do not describe this as a smooth60-FPS browser pass. No game/test process is left awaiting completion. Original scale/timing, remaining traversal failures, rendering performance and remaining courses still require work before publication.

### Browser frame-cadence isolation — 2026-09-11

Added a performance readout and Render scene checkbox to the existing verify-only panel. The readout exposes document visibility/focus, animation callback interval, synchronous JavaScript frame duration, quality and phase. The checkbox temporarily skips visual updates/drawing for a controlled comparison; it does not advance or award simulation progress. Ordinary game pages render as before, with no extra controls.

Fresh Chrome menu scene, High quality: visible/focused,1000 ms frame interval,5.9 ms synchronous CPU frame. With rendering disabled through the checkbox: still visible/focused,1000 ms interval,0.1 ms CPU. Restoring rendering:1000 ms interval,5.5 ms CPU, empty console error log. Saved source/frame-cadence-check.json. The one-second callback cadence persists without drawing, so the prior1-FPS result cannot be attributed to the water shader from this evidence. This does not establish the exact environmental/scheduling cause or actual GPU performance; the document explicitly reported visible/focused, so hidden-tab status is not proven. Drawing was restored after the comparison.

The attempted browser-internal graphics diagnostic page was blocked by browser URL policy; it was not accessed or worked around. The comparison above used only the local game's own visible controls and telemetry. No browser settings changed. Refreshed53 module hashes. Rendering performance still needs a representative foreground verification, and all ten previously recorded traversal failures/course-fidelity gaps remain open. No publication or parity claim.

### Freestanding-obstacle approach braking — 2026-09-11

Added source/probe-race-gates.mjs, an ordinary-aiInput three-lap diagnostic recording misses and collision starts in each class. Drake's failing gate test actually traced to two post contacts on Expert laps2/3 at gate14 (141.233/214.000 seconds, speeds13.57/13.27 m/s); all gates were counted correctly. Normal, Hard and Reverse had no contacts or misses. Log:work/drake-response-trace.json.

The shared AI now caps throttle at.28 and brakes above9 m/s while performing its existing detour around a freestanding obstacle intersecting the intended path. It resumes its previous cruise command after that threat clears. Structural pier/roof supports retain the prior passage approach, distinguished in the obstacle list by fixedSupport. This separation avoids disturbing tide-sensitive pier approach timing; an initial broader braking experiment produced a Sunset Reverse miss and was narrowed before final verification. Player controls, acceleration, obstacle positions, gate geometry, collisions and scoring remain unchanged by this repair.

Focused Drake/Glacier/Sunset checks13/13 pass (work/free-obstacle-check.log). Drake completes all three laps in every class with all mapped gates and no post contacts. Glacier's Expert/Reverse gate-completion checks also pass. The Glacier diagnostic still records some physical contacts: gate-completion success is not a collision-free or source-fidelity claim. Final full suite227/234 passes in181.735 seconds (work/free-obstacle-full-regression.log), up from224/234; the aggregate nine-venue/four-class ordinary racing completion check now passes. Seven failures remain: city wall jump/dive; city stunt opening; full city stunt route; Fortress ridge wave crossing; Southern Island first-lap pier dive; Southern Island later-lap low-tide pier traversal; aggregate nine-venue stunt completion. Assertions remain intact.

Refreshed53 module hashes and passed diff whitespace checking. All diagnostic and regression processes completed. No new rendered race loop or smooth-frame-rate claim is made this turn. Original course dimensions/timing/visuals, unfinished Glacier/Southern stunt layouts and publication remain outstanding; the active parity goal is not complete.

### Southern Island pier approaches — 2026-09-11

Correction: the outstanding first-lap dive and later-lap low-tide pier checks belong to Southern Island (tempest), not Port Blue. Their authoritative tests are in tests/southern-geography.test.mjs. Earlier log summaries using Port for these pier failures were mislabeled.

Added source/probe-southern-pier.mjs to trace ordinary-control stages, ramp contact heading/yaw, collisions and misses. The initial dive struck a support atx15.36 nearz157.25/164.35 rather than failing solely on dive depth. After lining up farther ahead of the ramp, a slower crossing also exhausted the existing1.5-second dive before the rear deck edge. No pier supports, deck height, dive duration or physics were changed.

The dive guide now lines up25 metres before the ramp, limits that approach to12 m/s, aims its crossing through the existing support gap towardmap(242,540), and targets24 m/s through the jump/dive before rejoining the outer route at25 m/s. Normal/Hard/Expert clear the actual dive and support rows without contact. Normal and Expert also finish all three laps with every buoy; Hard still misses gate4 on lap3 at227.883 seconds, well after the first-lap dive stage completed. Trace:work/southern-dive-miss-trace.json. The full-race assertion remains failing and unchanged.

For the later-lap surface route, the guide slows before the right-angle approach and holds10 m/s under the deck. Forward classes now use the existing Reverse route's style of clearance check: wait at the approach until the shared wave model predicts water below-.7 metres across the expected crossing window. All four classes pass the actual lap2/lap3 surface traversal checks, with no dive, jump or pier collision. Original geometry, tide model and clearance remain unchanged. Log:work/southern-surface-window-check.log (2/2 checks,13.555 seconds).

Southern geography plus speed checks18/19 pass in41.429 seconds; only the full-race first-lap-dive scenario fails (work/southern-pier-final-check.log). Subsequently changed that scenario to independent Normal/Hard/Expert subtests so a Hard failure no longer prevents Expert from running. Every original assertion is retained. Final class check:Normal and Expert pass;Hard fails on its later buoy miss; the parent fails accordingly (work/southern-dive-classes-check.log). Do not compare its raw test count directly with the previous234-test suite because it now includes three child tests. No full-suite rerun or new browser loop is claimed this turn.

Refreshed53 module hashes; all diagnostic/test processes completed. Remaining work includes Hard's later missed buoy, city jump/dive and stunt timing, Fortress ridge crossing, original dimensions/timing/visuals, the unfinished original Glacier/Southern stunt layouts, representative performance verification and publication. Changes remain local and uncommitted; full parity is not achieved.

### Southern Hard ship-side buoy recovery — 2026-09-11

Added source/probe-southern-gate.mjs for a detailed ordinary-input trace of the remaining Hard lap3 gate4 miss. The ski crossed at lateral-8.55 metres, outside the required side of the mapped buoy (offset7, side+1). It was approaching nearly along the checkpoint plane after going around the ship; steering at a point beyond the plane caused a premature wrong-side crossing. Baseline trace:work/southern-hard-gate4.json.

Added an authored recoverWrongSide flag to that Hard buoy and propagated it into the race gate. The AI can then aim8 metres upstream on the legal side when approaching from the wrong side within24 metres. It still has to physically cross and pass the existing scoring test. Buoy position, width, offset, side, collision model and progression logic are unchanged. The final flag applies only to this ship-side Hard approach. Broader versions were tested, found to regress Drake/Sunset, and removed. No obstacleGate history flag remains in the final code.

Southern first-lap dive/full-race subtests now pass Normal, Hard and Expert. The focused Drake/Sunset/Southern checks6/6 pass. Final full suite232/237 passes in143.774 seconds (work/authored-gate-full-regression.log). Five failures remain: city wall jump/dive; city stunt openings; complete city stunt route; Fortress ridge wave crossing; aggregate nine-venue stunt completion. The prior Southern later-lap surface fixes also pass in the full suite. Total includes the three class subtests added previously; assertions remain intact. Refreshed53 module hashes and passed diff whitespace checking. All test processes completed.

While waiting for tests, inspected the original Glacier Coast stunt recording https://www.youtube.com/watch?v=1L0akpI2nuk in Chrome. The stationary pre-launch HUD visibly shows20.0 seconds and0 km/h. Saved source/glacier-stunt-reference.json with this limited observation. Subsequent checkpoint allowances, ring/ramp sequence and precise layout remain unmeasured. The original Glacier/Southern stunt layouts, original scale/timing/visual fidelity, remaining specialized traversal failures and representative performance verification are still required. No new rendered game-loop proof, publication or parity sign-off is claimed.

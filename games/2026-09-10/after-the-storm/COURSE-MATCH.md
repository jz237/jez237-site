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

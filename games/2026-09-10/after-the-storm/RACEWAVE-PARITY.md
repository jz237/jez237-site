# RaceWave46 / Wave Race 64 gameplay reconstruction

Active objective, October 14, 2026: incorporate the installed RaceWave46 game's
mechanics and features into this browser game while preserving its detailed
Blender craft/riders, water, scenery and high-resolution rendering. This document
supersedes any claim that the earlier broad gameplay audit established complete
parity. The work remains in progress; it is not a course-parity sign-off.

## Reference identity and reproducible analysis

- Installed reference: `D:/Games/RaceWave46`, Windows v1.0.0. Its README and release
  notes describe the original game plus ghosts, remappable controls, per-player
  rumble, enhanced two-player detail, Dolphin Park free ride, and multiple display
  layouts.
- User-provided ROM: Wave Race 64 USA revision 1, 8,388,608 bytes, cartridge NWRE.
  Input SHA-256: `aa2e8aa8d10c6abc38333b277fe5e3933973a402f8b795d3578133ec193590b2`.
  Its actual format is 16-bit byte-swapped, despite the `.n64` extension.
- Normalized big-endian SHA-256:
  `f35d2423ebcb86eaf86fa935b613c7532b123a7bc50fb74996984c3b02fc3999`.
- EVO X2 has REA 6.4.0 and Ghidra 12.1.4. REA rejects this ISA revision: its
  verified MIPS lane requires MIPS32r2. Direct installed Ghidra analysis used
  `MIPS:BE:64:64-32addr` with the o32 compiler convention, without changing REA's
  admission checks. A separately identified ELF loader carrier maps the initial
  ROM image at its real entry address.
- ROM `0x1000` maps to RAM `0x80046800`. Initialized memory ends at
  `0x800eedd0`; the entry stub clears 967,120 BSS bytes. Ghidra recovered
  pseudocode for 896 initial-image functions. That is static analysis, not proof
  of all runtime behavior. Other code overlays have separate mappings.
- Private scripts/evidence are retained outside this public tree in
  `D:/Projects/.tmp/racewave-parity`. The Ghidra project is on EVO X2 at
  `/home/jez237/racewave-analysis-20261014/GhidraWaveRace`. Raw ROM bytes,
  decompressed reference graphics, and recovered pseudocode are not part of this
  website change.

## Source-confirmed numeric rules

`FUN_80094acc` reads the signed 16-bit points table at RAM `0x800eabb0` /
ROM `0xa53b0`: **7, 4, 2, 1**; the disqualification field produces zero. The
browser championship already uses those values.

Qualification data starts at ROM `0xa53bc`. Overlay instructions at ROM
`0x1b5e90`–`0x1b5eb4` index it with a 16-byte class stride and a two-byte round
stride. Normal includes a zero-point warm-up slot; the competitive thresholds
are **1/2/4/8/12/16**, **2/4/6/10/14/21/28**, and
**2/4/8/12/16/23/30/37**. These match the existing competitive rules.

The stunt timer table is unsigned bytes at ROM `0x93a80` / RAM `0x800d9280`.
`FUN_80075310` initializes milliseconds from the first byte; `FUN_800783ac`
resets the timer from the corresponding checkpoint byte. Time remaining does
not carry into the next section.

| Course slot | Inferred venue | Section allowances, seconds | Stunt ramps | Rings |
| --- | --- | --- | ---: | ---: |
| 0 | Dolphin Park | 15 / 15 / 15 / 15 | 4 | 10 |
| 1 | Sunny Beach | 15 / 15 / 15 / 10 | 1 | 12 |
| 2 | Sunset Bay | 15 / 15 / 10 / 10 | 2 | 9 |
| 3 | Marine Fortress | 20 / 15 / 15 / 15 | 2 | 15 |
| 4 | Drake Lake | 15 / 15 / 15 / 15 | 3 | 16 |
| 5 | Port Blue | 15 / 25 / 10 / 15 | 4 | 16 |
| 6 | Twilight City | 20 / 15 / 15 / 15 | 5 | 17 |
| 7 | Southern Island | 20 / 15 / 20 / 15 | 2 | 10 |
| 8 | Glacier Coast | 20 / 20 / 20 / 20 | 0 | 14 |

Numeric slots, allowances and object counts are directly observed. Venue labels
are strongly supported inferences from independent behavior, circuit order and
object arrangements; the original title bitmaps have not been decoded. Slot 7
lowers actual water vertices over successive laps. Slot 4 contains weed slowdown
zones and the fog-clear trigger. These resolve the earlier 3/4 and 7/8 ordering
assumptions; do not interchange the Southern and Glacier rules.

`FUN_80095050` selects per-course descriptors. `FUN_80095a28` decompresses kind 5
geometry to `0x802d6800` and directly copies kind 6 companion data to
`0x80306800`. `FUN_80071e70` reads the stunt route, ramp and ring pointer tables
at ROM `0x90d3c`, `0x90ecc`, and `0x91084`. All nine companion structures were
extracted with bounded range and sentinel checks. Applying the initial-image
mapping to these pointers produces invalid coordinates. Physical scale, heading
conversion, obstacle contact and ordinary-input traversal still need calibration.

## Implemented feature pass

| Feature | Implementation and verification boundary |
| --- | --- |
| Best complete time-trial ghost | Measured hull position/heading/attitude at 20 Hz, bounded compressed storage, interpolation, compatible course revision/class/laps/rider/tuning/sea/seed, best total-time retention. Visual only: no physics, wakes, collision or progress. Matching starts reuse the recorded wave seed. |
| Ghost persistence and visibility | Portable saves include a bounded library of nine setups, visibility preference, erase/undo. Old saves gain defaults; malformed imports are rejected before replacement. |
| Horizontal and vertical two-player display | Exact physical-pixel partitions, matching cameras/refraction/HUD/pointer orbit and independently clipped lens effects. No graphics quality reduction is forced by the layout. |
| Separate player windows | One authoritative host, full-resolution Player 2 presentation and controls, shared pause/restart, bounded snapshot delivery, reconnect and safe paused split fallback. Actual OS minimization and physical controllers remain unverified. |
| Two-player Dolphin Park | Untimed exploration with normal water/stunt physics, both riders, same-rider alternate livery, independent cameras, pause/restart. No racing gate/DQ/lap-finish logic. |
| Independent Player 2 stunts and dive | Gamepad modifier controls and numpad 1–7 / apostrophe defaults; both riders can use the same mechanics. |
| Remappable controls | Bounded per-player keyboard/button/axis settings, inversion, 0–35% deadzone with 5% default, conflict checks, safe key capture and defaults reset. Touch actions remain independent of physical-key rebinding. |
| Per-player rumble | Actual collision, landing and hull-load transitions; 25% default, independent strengths, throttled calls and cancellation. Fake actuators cover failure handling; physical hardware remains unverified. |
| Stunt water conditions | Stunts consistently use venue conditions and permit their normal score saving; ordinary race/free-ride sea preferences are retained. |

The initial integrated full run checked **471 tests: 467 passed, four failed**.
One cache test needed its mode expectations updated for two-player Dolphin
Park. The other failures reproduced on unchanged source: the cornering fixture
omitted actual yaw, and the detailed-model fixture installed its fetch mock
after the asset store captured the native fetch. Their assertions were retained
and the fixtures repaired. The subsequent affected-feature run passed **97/97**,
including these repairs, existing competitive two-player routes, controls,
ghosts, rumble, portable records, model geometry and camera/lens tests. The
entire long suite has not been rerun after those focused repairs.

A direct full three-lap simulation produced a valid
192.550-second ghost containing 3,852 samples (58,159 serialized bytes), with all
42 checkpoints, no DQ, and no missing recording section.

Local browser verification at High graphics confirmed:

- Vertical Dolphin Park views each used 640×720 pixels on a 1280×720 canvas,
  with matching HUDs, separate cameras and a 512×576 refraction target. Both
  riders remained in untimed free ride; Player 2 input moved its own craft.
- A normal-condition Sunny Beach time trial finished in 193.000 seconds with
  42 checkpoints and zero misses, saving 3,861 samples in 58,885 serialized bytes.
  Reload/start reused seed 52, displayed the ghost, and recorded a fresh run.
- The first ghost clone attempt exposed an oversized Three.js LOD-cache copy.
  The display clone now shares detailed geometry and omits runtime metadata;
  its regression verifies that metadata is never serialized and original
  geometry/material ownership is preserved.
- Rebinding throttle from W to K drove the live craft; portable export included
  the binding and ghost. Restoring defaults and cancelling capture with Escape
  retained the paused modal state and left no held input.
- Simultaneous Player 1 driving and Player 2 Right Ctrl braking worked after
  removing capture-only shortcut filtering from active gameplay. Recognized
  gameplay chords prevent browser shortcut handling during play.
- Stunt mode selects and locks venue water conditions. Physical gamepads and
  actuators remain untested; unit tests use independent fake devices.

## Required remaining work

1. Use the extracted original stunt structures and units to calibrate all nine
   routes, rings, jumps, checkpoints and section schedules. Current City uses
   48/27/27/35 rather than 20/15/15/15; most other schedules are still estimates.
   Faster steering-driver probes alone cannot traverse the current City geometry
   within the original schedule while retaining all rings. Do not conceal that
   mismatch with longer timers or simply make the route impossible.
2. Complete source-course comparison after the integrated Southern and Glacier
   replacements. Both now use recovered geometry and source Stunt schedules;
   exact handling and visual sign-off remain outstanding, as does Glacier
   full-ring mastery.
3. Calibrate exact scoring/penalties and motion against the recovered control
   transitions, training lesson progression, dolphin unlock timing,
   race conditions, course hazards, opponent behavior and handling against the
   recovered code and actual reference play. Existing broad coverage is not proof
   of exact parity.
4. Assess any remaining relevant installed enhancements and physical-controller
   verification. Separate-window suspension has controlled-visibility and real
   event-loop-stall coverage; OS minimization controls are unavailable here.
   Account-backed achievements need
   separate scope/access assessment; no credentials or paid service are assumed.
5. Complete all-class ordinary-input course comparison, full regression checks,
   browser save/reload/control/ghost flows and hardware verification where
   available. Then follow the existing committed/pushed deployment wrapper.

Keep the ongoing goal active until those requirements have concrete evidence.
No purchases or new paid services are authorized.

## ROM motion and buoy pass — October 14, 2026

The same private ROM now supplies all nine single-player race marker tables,
with separate class, multiplayer and alternate route groups. Marker centers
are the authored x/z fields; a derived 142-unit offset controls orientation,
not the physical buoy position. Suppressed raw types and alternate branches
were distinguished before comparing them to the browser maps.

Marine Fortress Hard and Expert each omitted a red marker present in their
native tables at `[3244,887]` (ROM `0x2b7f50` and `0x2b82c0`). The already
authored Normal marker at world `(120,-24.8)` matches its fitted position.
Both classes now retain it before the final red, restoring seven colored
markers. Fortress layout revision is 7, separating older times and ghosts.
The later Glacier collision pass resolves its 16-versus-15 Reverse marker
discrepancy. Port's ordered markers and Twilight Normal's empty original table need consumer
interpretation before further changes.

`FUN_80063c88`, `FUN_80064c0c` and `FUN_80065c18` establish submarine entry,
hold, release, wet contact and buoyancy suppression. The flat-body native
coefficient changes from 0.03 to 0.003. Entry requires accelerator, sufficient
speed and an airborne stick gesture; continued holding has a 30-update wet
contact allowance. Releasing ends the action. The speed HUD multiplies native
speed by 1.8; the browser expresses the entry threshold as 60 km/h. Dedicated
trick keys represent the source stick gesture. The 60 Hz distributed-pressure
solver remains a reconstruction: its damping and resurfacing trajectory are
not a port of the native solver.

The browser now suppresses support while dive is held, counts immersed time,
and restores buoyancy on release or allowance exhaustion. It preserves actual
position and momentum through the return to the surface. Existing Twilight
and Southern verification drivers hold and release the same input a player
uses. Their ramp approaches were adjusted for the speed requirement; no ring
completion or hull position is injected.

`FUN_800783ac` leaves an expired stunt timer at zero while momentum lasts;
`FUN_80063c88` cuts thrust. A valid next checkpoint resets both allowance and
coast counter. The browser now permits that rescue and ends the coast below
10 km/h or after approximately ten seconds. Previous immediate retirement
was incorrect.

Native move recognition is not restricted to stunt mode; scoring dispatch is.
All racing modes now share the held flips, left/right rolls, standing,
handstand, backwards and rider-somersault transitions. Regular races show
the movement and landing result without stunt points. Demo riders release a
rotation before landing instead of receiving an automatic completed flip.
Ring contact accepts either side, missed timed rings remain available, and
only consecutive ring numbers extend the timed score chain. Free ride retains
its existing returning-ring scoring. Swept contact now includes the thin
aperture volume, including vertical entry, using the source 32/112 ratio of
slab half-depth to radius. Existing ring dimensions, probe height, floating
offsets and exact scoring/pose timings still need calibration. Shore recovery
cancels unfinished rotations and poses while preserving earned progress.

The initial source-layout fit exposed shared geography errors: Glacier's
northern crossing intersected over 71 metres of the former solid floor, outside
its ice support. Southern's ring 3 intersects the current ship. Fits against independently authored buoys
have RMS residuals of roughly 4.4/6.0 metres, so they locate discrepancies but
do not prove exact terrain. That audit also identified twelve stationary breakable Glacier spheres,
replacing the former ten drifting obstacles in the collision pass below.
Do not lengthen the original section schedules to conceal these mismatches.

Private decoding recovered Glacier's 165 collision planes and 127 shoreline
segments. All 124 upward-triangle interior checks agreed with the native
spatial grid; reconstructed vertices were within 0.0131 native units of integer
coordinates. The north has an open western water channel followed by an
eastern ice shelf at native Y=30, with submerged slopes to Y=-60. The narrowest
measured water cross-section is 267.204 native units. This establishes the
required kind of shoreline correction. The collision pass below applies one
shared unrotated coordinate convention; native handling remains separate work.

The initial complete motion run passed 482/485. Its three dive regressions
were repaired: the city driver now enters fast enough with forward trim and
holds the input, the park driver maintains accelerator through the submarine,
and the two-player fixture supplies the required speed/accelerator. The city
test retains actual under-wall clearance and verifies a real dive on each lap;
the wet allowance may expire before a still-submerged hull crosses the wall.
All 43 affected integration checks then passed. The final complete regression
run passed **487/487 in 442.55 seconds**. Independent review found no remaining
issue in the contact/recovery fixes; 4,000 deterministic ring segments matched
a separate finite-cylinder intersection check.

High-quality browser verification completed the corrected Twilight inner
routine with all 14 selected rings, four checkpoints, no crash or DQ and a
final 60 FPS reading. Dolphin mastery completed all ten rings and eight moves
in 53.717 seconds, scoring 10,277 without a crash. A manual time-trial
handstand retained zero stunt points and the detailed rider/craft. Vertical
two-player racing showed an independent P1 handstand and P2 standing ride,
both at zero stunt points, using two 640×720 High views. This is functional
rendering evidence, not a claim of constant 60 FPS in every split-screen scene.
Mode switching exposed a stale cached rank display, which now uses the same
HUD cache in stunt and race modes. Shore recovery also cancels unfinished
rotations and poses while retaining earned progress. No gameplay/runtime
console errors were observed; the existing missing favicon request remains.

## Glacier collision and breakable-ice pass — October 15, 2026

Glacier now uses a single unrotated `.025` scale for the recovered numeric
object and collision families, rather than fitting each family to the earlier
illustrated-map reconstruction. Relative geometry is source-derived; the SI
interpretation remains conditional on the logical-clock and HUD calibration.
No original rendered meshes, textures, ROM segments or decompiler output are
shipped. Independently tessellated modern scenery follows the recovered planes.

The two shoreline chains contain 127 segments. Their peninsula is closed;
the distant northern mainland endpoints use an explicitly inferred closure.
The contact mesh has 124 upward triangles in ten components and 41 finite
vertical side/rear faces. Submerged skirts remain submerged; the western water
channel is open, followed by the eastern Y=30 ice shelf. There are no separate
Glacier ramp objects: the three western launches and central wedge are static
floor geometry. Backside wall contacts cannot grant ramp lift, and a swept
crossing above the finite wall stays clear. Background land heights and distant
scenery are still independently authored.

All four classes now retain sixteen visible markers. The first three share
the same source rows; Reverse restores the omitted `[-3518,-132]` marker.
Source headings use the 4096-step angular conversion, and the finish half-span
is 500 native units. Existing steering offsets and colored-buoy finite spans
remain reconstruction choices, not proven native scoring rules. Glacier layout
revision 3 separates these records and ghosts from the former course.

Twelve ice blocks use fixed XYZ positions and radius 50 native units. Eighteen
hidden boundary spheres retain fixed XYZ and radius 25. Fixed-sphere contact
uses the two source-derived hull-axis probes with radius 12; static floors and
walls use the twelve observed hull points. Fast swept contact prevents tunneling.
Breakage uses approach normal speed, explicit numeric rider-slot stability and
stance factors. Breaking contact still resolves; every later racer sees the
same broken obstacle. Eight varied procedural fragments per impact are bounded
to two recent events. Replay captures preserve intact/broken state and analytic
fragments across clock rewind without changing live collision state.

Glacier Stunt now has fourteen source rings at absolute Y=60, half-depth 32,
radius 112 and probe offset 8, with four actual checkpoint limits of 20 seconds.
Raw type-8 navigation guides award no checkpoint. The ordinary-input inspection
controller may leave a missed optional ring behind and recover an overshot
steering guide; it cannot move craft, grant objective progress, or extend time.
The inspected run crossed four finite checkpoint planes at 12.850, 29.983,
45.483 and 58.650 seconds, collecting nine actual rings with no wipeout or DQ.
This proves a traversable course under the source limits, not all-ring mastery.
All four race classes also completed three laps with 51 gate passes, zero
misses and no DQ using ordinary helm inputs.

The live water solver remains the modern pressure reconstruction. Faceted
contact preserves its actual wet samples, including mixed water/floor contact;
it does not globally disable water because the center lies over an ice polygon.
The interim solid response distributes translation and rotation using the
observed equal-point geometry; it is not the original point-constraint engine.
The former arbitrary sustained-steering ice timer is unused by source facets.
The new independent `native-hull.js` kernel reproduces the twelve equal-weight
points, 66 pair constraints, one Jacobi pass, radius-dependent point damping,
and source frame fit. The separate `native-water.js` component implements
ordinary numeric rider profiles, the two rear jets, lower-point gravity,
flat-water buoyancy, wet-group drag, and five-substep state timing. Modern
wave-gradient pressure is explicitly approximate; source stunt/joint/recovery
forces are not yet ported. Neither component is connected to live racing.
The kernel tests distinguish a one-point velocity projection
from a whole-hull positional correction. Live force/control integration remains
required before claiming native handling.

The native HUD reads **whole logical-frame displacement**, accumulated across
five body substeps. It does not read a point velocity or the final substep's
speed. Conditional on km/h and 50 ms logical frames, `.025` units/mapping and
100 Hz substeps agree with HUD factor 1.8. The observed integration gain is
`.992` without a division by five. Source lower-point gravity corresponds to
an arcade mean near 32 m/s² before water and damping; it must not silently be
replaced with an assumed 9.81 calibration in the future source-physics port.
The logical clock has not yet been compared to measured reference wall time.

Southern's numeric reconstruction is now integrated; the October 15 section below
supersedes the earlier disabled module and illustrated geography. The source
selector previously called race/stunt in intermediate private notes is **player
count**. Southern has two additional fixed mast-base spheres in single player,
including Stunt, absent in two player; its 26 hidden XZ spheres follow the water
datum in both layouts. Reverse retains the ordinary pier ramp.



Independent review also corrected the interim contact response's conversion
between body angular impulses and the rendered hull's Y-X-Z Euler rates.
Finite-difference probes verify that a banked contact actually stops entering
the plane without adding kinetic energy. The final Stunt checkpoint now keeps
its scored remaining time instead of resetting an absent fifth section to the
old generic 38-second default, consistent with the source finish exception.
The current High-quality browser run finished in 58.650 seconds with nine rings,
2,605 points, four checkpoints, zero crashes or DQ, and 6.833 seconds remaining.
Its final measurement window reported approximately 60 FPS and 884,000 triangles.
No gameplay console errors occurred; the existing favicon 404 remains.


Final complete regression after the contact and finish-timer review: **567/567
passed in 294.72 seconds**. This includes all nine venues/classes, championship
progression, original-allowance Glacier inspection, breakable shared/replay
state, source geometry, prepared hull/water components and Southern numeric
fixtures. Source parity and production publication remain pending the remaining
items above; these tests do not establish original runtime equivalence.


## Southern source integration and player windows — October 15, 2026

The live Southern course uses the unrotated conditional .025 scale for every
source center, direction, plane, fixed volume and Stunt item. It replaces the
illustrated-map shoreline, floating above-water ship box, authored 4.2 m BOAT JUMP
and generic 38-second Stunt route. Layout revision 2 separates its records and
ghosts. No original rendered assets, raw executable or recovered pseudocode
are distributed.

All 59 finite shoreline edges were independently matched to their raw source
rows and outward normals. Their consumer is height-independent: XZ hull points
collide even while airborne. They are separate from sea datum and rendering.
The long 45-edge ribbon is a narrow raised structure at observed top Y=50, with
small island accents. Modern vegetation,
materials, distant scenery and detailed riders remain in use.

All 305 source planes remain: 287 upward faces and 18 side/downward bow faces.
A further 17 fixed runtime projection volumes supply the submerged ship hull,
full deck, pier sections and finish posts. This corrects the earlier inference
that no grid plane beneath ring3 meant no deck collision. The deck volume spans
native X=125..450, Z=-5150..-4550, Y=-700..-50. The visible deck is fixed at Y=-50;
it does not follow the tide. Independent modern hull/cabin/mast artwork uses
these measured bounds without copying the original display list.

The ordinary ramp has three finite projection volumes and keeps raw heading 45
in every class including Reverse. Stunt uses the source 33/308-degree pair.
The source axes are slightly nonorthogonal; dual-coordinate intersections
preserve all interval tests instead of assuming a perfect rotation matrix.
The three source upper-point side-contact exclusions are retained. Flagged
ramp/reef contacts retain physical response while reporting 40% impact strength.
The live impulse remains an explicitly interim rigid-craft response; native
pointwise projection, including outgoing velocity in volumes, is not claimed.

Source tide starts at zero and follows a shared **human** completed-lap latch:
first lap completion lowers toward -100, second toward -150, in discrete one-unit
outer updates. AI laps cannot trigger it; either human can in two player. Stunt
retains initial water. The browser maps the outer update to its conditional 20 Hz
logical-clock policy; reference wall-time calibration remains outstanding.
Source mainstate 0x66/67 initializes -150 for a special post-race four-rider
Southern presentation, not ordinary Time Trial. It must not alter Time Trial's
initial datum. Recovery rejects source shores, shallow floors and solid volumes
without deleting earned race/Stunt progress.

The Southern Stunt layout has ten source rings at absolute Y=0/60, four actual
checkpoint rows 1/2/5/0 and 20/15/20/15-second allowances. Raw type 8 guides are
unscored. Authored steering targets only issue helm inputs. A default-grid,
rider 0/seed 17/course-sea run physically collected all ten rings and four
checkpoints in 54.716667 s. Section times 13.616667/12.233333/16.250000/12.616667 s
remain below their allowances, with no overtime, crash or DQ. Ring 6/9 navigation
lines shift along the actual apertures; physical ring centers and radii do not
move. Independent raw-floor/volume checks cover all 47 route targets.

The same run was rendered at High, 1280x720, approximately 923k triangles and 55 FPS
in the final measurement window. The partly submerged deck/masts were also
inspected at 18.583 s after four actual rings, with zero collision. No gameplay
console errors occurred; the existing favicon 404 remains. Later modern artwork
changes require the normal final asset/browser refresh.

`native-rider-forces.js` is an isolated preparation for native handling: explicit
previous-frame joint trim, auxiliary yaw, roll/flip point impulses and held-action
decisions, with raw arithmetic comparisons. It does not fabricate a physical
joint or connect itself to live racing. A future adapter must interleave these
stages with jet, gravity, water and contact in the observed order; appending the
whole helper after a water pass is not equivalent. Full rider constraints,
wave-cell data/input conditioning and source action/scoring integration remain.

Separate player windows now keep one authoritative race in the main window and
give Player 2 its own full-resolution camera, water rendering, HUD and input.
The child receives bounded presentation snapshots through a checked same-origin
MessagePort; it cannot step physics or write records. Closing or reloading the
child pauses the race and restores the split display. Reopening preserves the
same race, while restarting creates a fresh presentation generation. Replay
temporarily shows a standby screen in Player 2 and restores its live state.

Browser checks verified two 1280x720 High canvases, independent throttle,
pause/resume, close/reload, reconnect, restart and replay. A real 1.1-second
host event-loop stall paused without advancing simulation time or position.
Controlled visibility tests covered visible-child pumping and suspension when
both windows are hidden. Actual OS minimization and physical gamepad/rumble
hardware remain unverified because those controls are unavailable here. Idle
menu/replay connections now remain healthy beyond the former 20-second timeout;
fake-clock tests also cover finite loading timeouts and stale-child recovery.

The isolated `native-stunt-scoring.js` state machine reproduces observed pose
entry/hold/release values, checkpoint-local repeat flags, standing-to-somersault
transition, landing arc coefficients, ring streaks, checkpoint time rounding
and delayed finish settlement. Its 26 focused tests and 1,513 private numeric
comparisons passed. It emits queued awards rather than claiming native popup
display timing. It is not yet connected to live Stunt scoring: the required
articulated motion, landing and arc inputs must be supplied first.

The final Southern race pilot passed all four solo classes, all four four-rider
classes, and the boosted rider 2 Normal championship fixture. Each human
completed three laps with every gate, zero misses and no DQ. The pilot only
chooses throttle, steering, braking, trim and damping; choosing inputs leaves
position, velocity and progress unchanged. Source floor contact and racer
contact remain active during these checks.

The refreshed browser Stunt run retained all ten rings and four checkpoints in
54.716667 seconds, with 3,500 points, no crash/DQ/overtime and 2.383333 seconds
remaining. High 1280x720 reported about 60 FPS and 926k triangles in the final
window. The ordinary-race tide inspection reached datum -2.5 at 78.4 seconds,
after the human entered lap 2 with zero misses. The earlier deck/mast inspection
was repeated after the artwork refresh. No gameplay console errors occurred.

Complete regression initially passed 631/632: the source-route dispatch skipped
the shared exhibition traffic controller, so Southern's demo pack crowded.
Restoring the common control-only traffic/flip wrapper fixed that existing
regression. The targeted demo passed, followed by **632/632 tests in 294.00
seconds**. This is a checked implementation milestone, not full reference parity
or a production deployment.


## Sunny source geometry and handling preparation — October 15, 2026

Sunny Beach now uses slot 1's four source buoy tables and quantized headings,
20 closed sandbar edges plus 29 open outer-coast edges, 231 finite upward floor
faces and 39 open-chain boundary markers. The outer coast receives no invented
closing contact edge. The small source sandbar is horizontal in the shared
world frame. Four hidden fixed XYZ spheres remain in every player/class family;
visible static balls number 0/3/5/5 in ordinary classes and 4 in Stunt. All remain
physical. Sixteen single-player render-only placements select independently
authored beach furniture; their original identities/artwork are not claimed.
Two-player selection omits those decorations while retaining its source solids.

The fixed Stunt ramp uses six finite projection volumes at native Y−24. No
scripted takeoff impulse is added. Twelve absolute-Y rings retain the source
112-unit radius, 32-unit depth and 8-unit probe offset. Checkpoints 5/10/16/0 use
the original 15/15/15/10-second limits. Layout revision 6 separates new records
from the earlier geometry and admission rules. Sunny ordinary races have no
ramp: the older helper that inserted a displaced Stunt ramp is disabled for
source venues. The browser course-out envelope remains authored; the native
course-out rule is unresolved.

Authored ordinary-input paths passed all four solo classes, all four four-rider
classes and the boosted rider 2 Normal fixture at seed 17/60 Hz. The refreshed
Normal championship fixture won 39 points and unlocked Hard. Its Sunny round
finished second by 0.400667 seconds, with zero human misses and no ordinary ramp.
Source navigation remains a browser controller; the Surf profile permits faster
exhibition inputs without changing the source venue-condition path. Tests also
retain the opening exhibition's speed and completion checks for seeds 23/619.
These are bounded checks, not all-seed or native-handling guarantees.

Browser High 1280×720 collected all 12 rings and 4 checkpoints in 43.733333 s,
scoring 4,450 points with no crash/DQ/overtime and 1.433333 s remaining. Calm
finished in 43.466667 s in simulation. An apex inspection at 26.783333 s showed
six collected rings and a hull 6.216760 m above water. Camera suspension now
keeps the tall-launch rider fully in frame; framing checks cover 30/60/144 Hz.
The final held apex frame reported about 60 FPS and 1.143 million triangles.
High-resolution craft, rider, water, reflections and scenery remain active.

A refreshed browser time trial using the source human admission rules finished
three laps in 202.415 s with 42 visible passes, no misses/DQ and no ramp landings.
The final High 1280×720 window reported about 60 FPS and 1.365 million triangles.
The only browser console error in the checks was the existing favicon 404.

Human admission on Sunny and Southern now follows the recovered primary source
graph at 20 Hz, including real unscored guide planes. Colored buoys have the
25-native-unit wrong-side tolerance and coarse region admission, with current
sample/armed/side history rather than a local swept-width rule. Ordinary finish
admission preserves the source one-sided bound and course slack. Source crossing
offsets provide millisecond lap adjustment. Visible passed counts remain separate
from raw node progress. AI admission remains the browser swept rule; host lap
legality and five-miss DQ are explicit policies. Southern record revision is now
3. All four classes on both live source venues still finish with zero human
misses. The source leaf passes 61 tests, including 51 raw-backed fixture cases;
four additional live tests cover scheduling, pause, ownership and remote planes.

The native handling adapter now conditions raw controls, interleaves trim,
gravity, yaw, manipulation and water in observed order, and supports explicit
source actor/action states. Its optional 19-point articulated rider uses 22 links
and eight constraint passes, latching physical torsoRoot/joint 2 after tick 5 for
the next logical frame. Caller-authored pose/rest/history and actual auxiliary
grip anchors remain mandatory. No constant joint or visual-bone substitute is
fabricated. Ninety-seven focused handling tests pass; 2,780 captured default-water
numeric values remain unchanged. This adapter is separate from live race-core.

The isolated triangular water field reproduces signed Q8.8 storage, finite hex
patch updates, field queries and sine-line forcing. Twenty-one focused tests
pass; private raw checks match 1,655 prepared kernel vertices exactly. Amplitude
20 scales forcing (conditionally ±0.5 m), without a global height cap. Original
camera selection, phase/RNG history and special wakes remain separate work;
the live browser still uses its modern water/pressure model.

The ring scoring preparation now distinguishes object identity from chain order:
City's repeated 3/4/5 orders can each score once as separate objects. The existing
live ring loop already retains separate object status. Native score popup
settlement and articulated arc inputs remain to be connected to live scoring.

Port static preparation includes its genuinely different 1P/2P companion data:
117/109 shore edges, an open 29-edge coast, no active 3D grid floors, source ramp
volumes and the 16-ring Stunt layout. Twelve objects are defined as dynamic,
never falsely frozen as source solids. The isolated floating-object kernel has
15 focused tests for springs, buoyancy, contact order and craft/object recoil.
Neither Port module is live yet. Recovered source evidence stays private.

The first full regression found 19 failures: synthetic open-water/ice fixtures
inherited Sunny's new source solids, the old ramp helper inserted a race ramp,
and the conservative source pilot reduced Surf exhibition pace. Independent
synthetic fixtures now isolate those physics checks; the optional-ramp traversal
check uses an explicit authored circuit, source races retain their real ramp
selection, and the Surf controller keeps the existing speed checks. Corrected
focused checks pass. Final complete regression is recorded below when finished.


The completed regression passed **842/842 tests in 312.12 seconds**. The exact
Normal cup and refreshed source-gate browser run were checked after removing
the spurious ordinary Sunny ramp. Independent physics fixtures preserve their
original assertions without inheriting live venue collision data.

Auxiliary rider anchors and a modern anatomy provider are also prepared. The
recovered pivot/history/semicircle mechanics supply actual physical grip outputs
to the 19-point rider solve. Twenty-two new focused tests passed. The default
geometry comes from the existing modern rider rig; it does not claim original
pose/radius equivalence. Actor animation, special crouch and live integration
remain pending. These preparations do not replace the live handling model.

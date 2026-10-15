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


## Source water and boundary collision integration — October 15, 2026 (in progress)

The live venue sea now uses the reconstructed signed Q8.8 triangular field,
with source noise, sine forcing and finite camera-selected hex updates. Shared
ordinary gameplay selects variant 0, including Stunt. Course slots 0..8 use
1P amplitudes 20/20/20/40/10/30/20/25/25 and forward 2P amplitudes
15/15/15/35/5/20/15/20/20. Reverse and Stunt use the 1P table. These are
initialization/forcing amplitudes, never global height limits. Private raw
checks cover 288 gameplay setup combinations, 62 amplitude cases, eight mode
cases, three initialization-camera cases and 80 PRNG steps.

The source random primitive is a 32-bit LCG, multiplier 0x41c64e6d and increment
0x3039. Water consumes its low 15 bits. Browser initialization uses the normalized
stored wave seed with that algorithm; it does not reproduce the original shared
global PRNG history. The browser resets forcing phase for reproducible seeded
ghosts. The original field initializer does not reset global phase, so original
cross-course phase history remains unimplemented. Restart/ghost metadata and
field initialization now use the same normalized seed, including API values
outside the UI's seed range.

Field setup performs two noise passes, clears previous patch centers to zero,
and does not stamp/update a patch. Initial source camera basis comes from eye
[1,1,1], target [0,0,0], FOV75, up [0,1,0], near10, offsets [0,3]. The first
post-hull frame solves the ordinary virtual follow camera. Subsequent forcing
uses the previous snapped center and camera orientation; patches select the
updated camera, P2 before P1, including double evolution in overlap. The virtual
source camera selects water independently of the high-resolution modern camera.
The source camera obstacle correction and scripted per-racer scene modes remain
unimplemented. The explicit host logical clock remains 20 Hz pending wall-time
calibration against actual reference play.

A host-owned water state now feeds CPU height queries and the existing High mesh,
reflections, refraction and detailed materials. Render interpolation uses source
triangles and signed whole-height/datum wrapping. It does not add modern swell
or impose original low-resolution image/mesh output. Actual Radeon GLES3 vertex
and fragment shaders each passed 2,084 numeric fixtures, including negative
coordinates, torus seams, non-flat gradients and extreme datums. Maximum observed
error was 0.0000366 world units at the extreme datum fixtures. Explicit reciprocal
multiplication/float rounding removes real GPU seam mismatches found in the
first implementation. Modern custom sea choices remain separate enhancements.

Replays and player-window packets carry bounded copies of the rendered height
field, datum and revision. They do not contain field velocity, forcing phase,
RNG or source camera history, and cannot step the host water. Pause/replay,
independent races, source phase, P2/P1 ordering, seed reconstruction and snapshot
bounds have dedicated checks. The separate native handling adapter can now
consume raw cell impulses through createNativeWaterCellSurface(field), preserving
the distinction between the source plane query and rendered surface height.
The live craft still uses the modern pressure/rigid-body solver; this is an
incomplete integration, not native handling parity. Extra wave airborne/landing
events expose that dependency. Native pointwise course contact hooks and a shared
100 Hz hull/20 Hz water host are the next integration requirement.

Boundary markers are now recovered physical fixed spheres: radius25 plus probe12
native, stored absolute Y0 except Southern's non-tag5 tide overwrite. Sunny has
39 markers, Southern79 and Glacier90. Glacier's18 hidden XYZ spheres are a
distinct family with no marker-center duplicates. Port51 and Sunset81 are also
prepared. Loaded source order is visible XZ, markers, hidden XYZ; contacts query
the native 4x4 grid, visit candidates descending, and stop at the first overlap
for each latched +27/−9 probe. Full penetration shifts all12 hull points and
kicks three velocities even for separating motion, without sphere recoil. The
exact isolated kernel has raw fixtures. Its live bridge currently retains the
translation and mean kick in the modern rigid craft; native pointwise constraint
response remains separate. Marker artwork now shares its fixed/tidal datum rather
than bobbing on modern waves. Their spheres do not establish a course-out rule.

The modern steering bridge now permits jet yaw at low speed, so a wet craft can
turn while thrust presses against a shore. This fixes the Southern Reverse solo
stall without moving course geometry or awarding progress. The older City
Normal shortcut requires pullback lean like Hard to clear its actual finite
crossbar under the new water; ordinary input alone completes 81 gates with no
misses. Port's older Stunt controller uses a 2.5m lookahead and physically clears
all16 rings/four checkpoints/three ramps. Its extra wave landings remain an
unresolved native-hull dependency; the existing exact three-landings test has not
been weakened.

Sunny's jump/ring steering speed was recalibrated through controls only. A fresh
browser run using the source seed primitive finished in45.366667 seconds with
12/12 rings, chain12, all4 checkpoints, 4,370 points and no misses/DQ/crash/overtime.
The final allowance was0.933333 seconds. High1280x720 remained near60FPS. A held
apex at26.95 seconds had hull clearance4.651159m, all of the rider in frame,
1.086 million triangles and near60FPS. These results supersede the earlier
45.60-second run using the interim RNG. The browser console had only the existing
favicon404. This browser evidence does not establish all-course/full-native parity.

All standard record/ghost layout revisions advance for the new water. Marker
changes additionally advance Sunny/Southern/Glacier's geometry revisions. Existing
saved records remain archived in their prior scopes. Identical Glacier1P/2P
object families retain the same GPU-world cache key.

The first integrated regression was924/953. After source-seed, camera, marker,
controller and factual-fixture corrections, a second checkpoint was960/980.
That checkpoint still had20 failures: some stale revision assertions and actual
legacy-course/native-water/modern-hull traversal failures. Subsequent focused
checks pass Sunny12-ring traversal in all four class selections, source sphere
integration, source water/window/replay, and cache behavior. Full parity and
production deployment remain pending. No failed dynamic assertion, physical
ring, source timer or wave amplitude has been relaxed to hide these gaps.


The source-water browser replay returned to the held26.95s apex with live
racer/time fingerprint unchanged; host water remained frame539/phase19. A real
separate-window Sunny check used two1280x720 High canvases. At paused44.816667s,
both49,152-sample fields had revision896, datum0 and full-array hash4144679575;
three world-space queries also matched exactly. The child held display-only
storage while the host retained its solver. No child console errors occurred.


The latest complete released-feature regression is **974/985 in56.68 seconds**
(private full-tests-native-water-after-controls.tap). Eleven failures remain:
beach-break frequency under the new field; two City dive/ring checks; Port Hard
ordinary traversal and the aggregate course/cup checks it blocks; Fortress ridge
and aggregate Stunt traversal; Southern boosted-pilot placing; Glacier timed
Stunt navigation; and Port's extra wave landings. Port now collects all16 rings
and four checkpoints in80.983333s, but the unchanged three-landings assertion
correctly reports27. These are unresolved integration gaps, not a green milestone.
No new commit, push or deployment is being claimed for this work in progress.

## Native ordinary handling preview — October 15, 2026 (in progress)

The source point solver now has a runnable integration preview. Explicit
`createRace({physics:'native',mode:'time',course:getCourse('greyhaven')})`
attaches the twelve-point hull, physical auxiliary anchors, nineteen-point
rider, source cell water impulses, finite shore/floor/box responses and fixed
sphere contacts. It bypasses the modern pressure solver, rigid contacts,
kinematic ramp launches, rescue and rider-collision mutation. The default game
continues to use the existing physics while the native integration is incomplete.
The preview is currently restricted to Sunny Beach source-water time trials;
it is marked unranked and cannot replace existing time-trial ghosts or records.
The local verification page can select it with `verify&nativePhysics`.

`native-race-world.js` owns one clock for up to four adapters: prepare ALL
riders, then five hull ticks visiting racers in descending order on each tick,
then complete ALL physical rider solves, then advance shared water and any
floating objects. Input, physical coefficients and water options are sampled
once per outer frame. Independent render-rate accumulators cannot move water
between opponents' hull passes. Source cameras receive the hull's actual XZ
forward components including pitch, rather than a normalized heading vector.
Pause preserves the fractional tick. Failed hooks fault the owner explicitly
instead of continuing with unequal racer clocks. The .025 world scale and
browser wall-time accumulation remain explicit host choices; the later timer
audit below establishes10ms/50ms of source game time.

The pure `native-racer-presentation.js` bridge copies physical pose/velocity,
point wet flags and separate integer source HUD telemetry. Its wet fractions
and rate estimates are display policy. It does not infer native landing,
wipeout, ramp, trick or scoring decisions from those display values. The
physical rider retains independently authored modern anatomy and steering
supports; the original animation/actor machine has not been reconstructed.
Collision candidate bins and derived clipping normals retain the explicit
precision/order limitations exported by `source-native-contacts.js`.

Recovered B/R controls are now in the adapter. B starts only on its qualified
fresh edge, changes final selected gravity before all five hull ticks, then
compresses the nineteen physical rider targets and adds its manipulation delta
before the negative-up projection. The factor recovers across eleven binary32
updates; release still affects its current frame before resetting. R raises
lateral velocity retention, preserves the prior roll-balance value while held,
and slews back by .01 per logical frame on release. Actor23 cuts an existing
engine immediately. The source A/Z accelerator is digital; the browser brake
releases it and coasts. No reverse thrust was invented. Native tuning defaults
are explicit5/5/5 from the recovered human profile; the modern tuning sliders
have not been silently remapped to mechanically coupled native fields.
The private bounded B/R/control audit covers1,845 raw instruction cases.

`native-floating-world.js` also connects the existing runtime-kind9 object
kernel to the shared clock and actual field. Its after-water motion samples
the source4d30c normalized plane expression, not the rendered triangle height.
Contacts retain per-hull, per-frame impact maxima and object recoil without
inventing a floor contact or activating contact-drive. Twelve Port definitions
produce identical shared two-player object/water histories at30/60/144Hz.
This is a host integration component; Port's source scene and native gameplay
are still pending and are not enabled by this preview.

The first complete regression after the ordinary native bridge and B/R
integration is **1,057/1,068 in56.58s** (private
`full-tests-native-world-preview.tap`). The same eleven integration failures
remain. The subsequent floating-object and beach-presentation changes still
require a new complete regression. The beach shaders now share native water
heights, and crest history records actual field revisions rather than querying
an analytic past that the field does not contain. Its unchanged frequency test
still fails at12 course /34 surf breakers; thresholds and waves were retained.

In the browser, the native preview rendered High1280x720 at about60FPS with
roughly1.14 million triangles. At111.48s, hull tick11148 and water frame2229 were
consistent with a partial outer frame. Actual keyboard B produced gravity
−.3360000550746918 and factor.8999999761581421; held R produced retention
.974081814289093 with the default rider0 profile. Ghost recording remained
disabled. Replay returned to paused221.25s with hull tick22125 and water
frame4425 unchanged. Only the existing favicon404 was reported. Full-course
native handling, starts, recovery, named gestures/tricks, native AI and native
racer contacts remain required before parity or production publication.

The subsequent cadence audit confirms source game time: shared race setup
requests three video interrupts per logical update; the rider loop performs
five hull passes; active ordinary/Stunt timers increment50, and the actual HUD
divides that counter by1000 and60. Thus20 outer updates and100 hull passes
equal one displayed source second. Forty-eight bounded raw scheduler/timer
fixtures pass. The original update queue holds one message and drops excess
sends under load, so this does not assert exact20Hz hardware wall time or the
browser accumulator's catch-up policy as original behavior.

Review also caught a control-facing derivative bug: refreshing presentation
history on both outer frames and render calls gave yaw-feedback controllers
different rates at different host refresh rates. History now updates only on
the world's physical tick callback. Native human input providers are sampled
inside frame preparation, and terminal race results stop on the outer boundary
without consuming a render-dependent extra hull tick. Fixed-time closed-loop
hull, source progression and complete water states now match exactly across
30/60/144Hz. The authored verification driver is separate from original AI.

The completed driver check covers all sixteen Sunny rider/class combinations;
fourteen are clean. Jonas retains one actual miss in Hard (raw row47) and one
in Expert (raw row46). The balanced rider clears all four classes cleanly with
identical physical/progression/water/driver histories at30/60/144Hz, both at a
common40s sample and at the final result. Seed17 balanced finish times are
108.329,106.577,107.092 and107.446s for Normal/Hard/Expert/Reverse. These are
authored steering/throttle runs through the unchanged source human judge,
not original AI, teleports, alternate gate admission or modified navigation.

The final browser run used source seed783 and completed three Normal laps
with zero misses/DQ at outer frame2207 /hull tick11035 /game time110.35s.
High1280x720 remained around60FPS, with unranked ghost recording disabled.
The49,152 field heights had revision2207, phase7, datum0 and Int16LE FNV1a
hash3294072020. Both native beach programs compiled during actual rendering;
after explicit helper-result initialization only the existing favicon404
remained in that browser navigation's console.

The latest complete regression is **1,102/1,113 in58.23s** (private
`full-tests-native-world-final-verified.tap`), retaining the same eleven
integration failures listed above. A later83-check focused pass verifies the
new empty `racingBuoys` hook and established handling/contact/world behavior.
Raw contact order is primary route7e8c8, hidden/boundary fixed7ef80, then generic
objects7ecbc. The legacy `primarySpheres` API name denotes that final GENERIC
phase; racing-route contacts have their own earlier hook. That route-buoy
kernel and original wipeout/recovery state remain active reconstruction work.
No production deployment or full-parity completion is claimed.

The subsequent native-preview milestone implements primary racing buoy contacts
and shared motion. All selected primary rows retain their source array order,
with descending first-overlap searches for the two cached hull probes. Movable
buoys use the checked binary32 30/70 penetration split; fixed checkpoint/finish
endpoints retain full craft separation and their distinct radii. Point velocity
uses the10ms hull clock while buoy recoil velocity uses the50ms object clock.
The kernel matches80 private prepared contact fixtures and63 motion steps.
Coincident centers remain explicit unresolved contacts rather than invented
normals. Initial loaderY0/zero velocity, separate physics/render flags and the
absence of original countdown/route-activation history are documented limits.

The host now orders completed hulls, shared water, current-center adjudication,
then one ascending buoy-motion pass. Buoyancy uses the recovered normalized
source plane query, including its datum exactly once. The immutable admission
layout accepts the current node position for heading/side/region decisions;
checkpoint spans continue to use their fixed endpoint geometry. A prepared
Sunny core regression produces an actual collision where a static judge would
award power but the displaced-center source judge correctly records a miss.
All riders share one mutable primary array; there are no per-rider buoy copies.

Seven independently accumulated native impact channels and a shared normal
are now connected to the native adapter. The normal follows each family's own
strict maximum increase in traversal order, including fixed/primary endpoints
and generic floaters. Equal impacts preserve it; simulation0 preparation
preserves all channels/normal/box latch. Marked boxes attenuate only their
recorded impact by source float32(.4), retaining their full physical response.
The legacy three-field contact-drive report remains separate and cannot supply
a missing normal. Completed snapshots and browser telemetry copy all channels.

Existing high-resolution buoy bodies follow these physical positions, with an
authored submerged lower body to meet the waterline without snapping physics
to a rendered surface. Fixed endpoint bodies are native-preview-only display
objects. Bounded replay snapshots contain copied positions/endpoints/visibility,
without velocities or simulation ownership; replay interpolates those display
values and never advances native motion. The browser replay check held hull
tick10820, water frame2164 and buoy motion2164 while viewing recorded103.10s,
then returned to live result108.20s with all three clocks unchanged.

One High1280x720 browser run completed three Sunny Normal laps in107.70s with
zero misses/DQ, hull tick10770, water/buoy frame2154. A normal-speed run completed
in108.10s with zero misses, holding about60FPS during active play; both runs
remained unranked with saved ghost recording disabled. Their differing browser
seeds are not a same-seed determinism comparison. Native time-trial scope and
the authored verification driver remain distinct from original AI and full
ordinary race integration.

Two additional isolated modules reconstruct the post-hull recovery lifecycle
and procedural actor23 falling pose. Recovery matches892 applicable private
prepared instruction fixtures, including severe/stumble thresholds, five-frame
staging, joint2-versus-datum recognition, recovery input edges and deferred
actor blending. The procedural pose/history helpers match260 producer and240
history comparisons using independently authored prepared rigs. Their fixed
native dimensions do not establish original artwork or arbitrary modern-rig
equivalence. They are not yet bound into the playable host: actor7 needs an
independently authored85-frame recovery provider, compatible rig/history
integration and actual physical rider presentation before that lifecycle can
be enabled. No source animation records are published.

The complete regression after this milestone is **1,176/1,187 in58.60s**
(`full-tests-native-primary-final.tap` privately). The same eleven integration
failures remain; all74 newly added checks since the preceding1,113-test run
pass. Full native course/actor/stunt/AI/racer-contact integration and production
publication remain outstanding.

## Native physical rider and recovery — October 15, 2026

The Sunny native preview now binds the recovered post-hull lifecycle to the
actual twelve-point hull and nineteen-point rider. Completed impacts decide
after all five hull ticks. The preceding actor/countdown still controls those
ticks; input muting and actor23 engine clearing apply on their proper later
frames. Crash effects change actual velocities/damping once, retain the twelve
saved float32 coefficients, and restore them through actor7's recovered gates.
The recovery datum test reads the previous solved physical joint2, never a pose
target. Persistent actor joint types, auxiliary mode, B completion and body/link
solves follow the recovered decision/evaluation/completion ordering. Scene0
skips physical pose work without inventing missed animation updates. The water
follow camera receives the completed actor/frame after these solves.

Procedural actor23 falling and the common actor24 stumble now supply physical
targets. Actor24 uses the actual previous auxiliary pivot/history and retained
yaw-only basis; its numeric producer matches18 private whole-source fixtures at
both native and host scales,36 exact comparisons. The alternate record-dependent
actor24 branch explicitly rejects instead of silently selecting the common
geometry. Actor7 uses new authored water/stern/climb/seated poses with recovered
85-frame playback,56 damping restoration and77 ordinary-return timing. It captures
the actual fallen entry pose once. Current and pending providers evaluate without
stepping physics; exactly one auxiliary and one body solve follow each active
frame, including blends.

This retains the declared authored rest anatomy, steering-circle radius,
endpoint-history lengths and imported-target blend. Those choices and the new
remount art are not original pose-record or geometry parity. Original normalized
pose-block blending, the alternate stumble records and the remaining actors
still require equivalent integration. No source animation, mesh or texture data
is published.

The detailed rider now follows all15 anatomical segments derived from actual
solved world points. The complete hull basis transforms them once; modern extra
bank, stunt rotations and wipeout root offsets are bypassed for this path. Mesh
geometry, materials, shadows and LOD stay intact. If detailed assets fail, the
existing built-in rider meshes receive the same explicit targets. Repeated
rendering cannot run modern rider springs/IK or pump physical history. Replay
copies and interpolates endpoint positions only, keeping solved-frame provenance
discrete; incompatible/native-modern boundaries select recorded states.

A repeatable development inspector drives from Sunny's ordinary grid into the
real first enabled colored buoy using accelerator/steering only, then releases
controls. With wave seed17 it records C38=10.117209434509277 at5.55s, enters23
at5.80s,7 at7.15s, restores damping at9.90s and returns22 at11.25s. It changes
no spawn, collision flag, physical point, actor, timer or progress. The collision
correctly retains its actual missed buoy. Complete collision/recovery/hull/rider/
water/buoy histories match at30/60/144Hz. Separate prepared qualified-impact
traces cover severe entry for all four ordinals, moderate24 recovery, prior-joint
datum admission, a scene0 gap and independent rider ownership.

High1280x720 browser checks held the real fall at hull tick580/body and auxiliary
solve116/water frame116, climbed at920/184/184, and returned to ordinary at
1125/225/225. A separate full three-lap run completed in108.85s with no misses/DQ,
tick10885/frame2177 and physical detailed-rider rendering enabled. These are
functional browser checks, not source full-game trajectory or artwork sign-off.
Paused replay held recorded7.3833s while live time11.25s, hull tick1125,
water/body/auxiliary frame225 and buoy-motion225 remained fixed. Returning to
the held inspection restored the exact live pose/progress/telemetry/water
fingerprint. The console contained only the existing favicon404.

The complete regression is **1,237/1,248 in61.68s** (private
`full-tests-native-recovery-final.tap`). All61 additions since the preceding
1,187-test run pass. The same eleven previously listed integration failures
remain. One older primary-contact fixture was updated to replace its complete
prepared physical bundle, including the recovery owner; its literal contact,
current-center judge and motion assertions remain unchanged. Native racing
outside Sunny time-trial preview, remaining actors/stunts, original AI, racer
contacts, course sign-offs and production publication are still outstanding.

## Native craft contacts and two-player races — October 15, 2026

`native-craft-contact.js` now reconstructs the global craft-pair kernel. Four
cached probes per craft retain binary32 positions and previous-refit deltas.
All total craft participate, independently of the human-camera count. Ascending
craft pairs and probe pairs use the recovered 78-unit center admission and strict
24-unit probe overlap. Centers/probes remain frozen for the complete pass;
every overlap translates all twelve hull points and changes the proper three
point velocities. Zero or separating incoming motion still receives physical
separation, while only a strict positive family maximum replaces C40 and the
shared impact normal. Native work arrays retain float32 accumulation across
all overlaps before conversion back to world units.

The world prepares every racer, runs one global contact pass before each of
the five descending hull groups, and refreshes each individual craft's probes
immediately after its actual hull refit. Reset seeds zero deltas; ordinary
refresh and recovered world-wrap history remain distinct. Proxy ownership is
atomic across construction failures, including a later preowned hull or an
invalid water surface. Snapshots, rendering, pause and result display cannot
consume a pass or advance its history. Actual closing hulls now produce C40
and enter actors 23, 7 and 22 through the existing recovery lifecycle without synthetic
impact injection. Coincident admitted probe centers remain explicitly
unsupported: the leaf rejects the entire pass before contact mutation rather
than guessing source exception behavior or a normal.

The private comparison checks **2,007 exact prepared-source comparisons**,
including 1,251 consumer responses with 10,953 ordered contacts and independent
cold/reset/refit producers. This establishes the declared leaf arithmetic,
not complete-game bit-identical trajectories: the surrounding host hull still
uses its documented SI/double fitting and authored rig choices.

A separate bounded 27-case source audit confirms that the contact flag defaults
to 1 and that no human-count condition surrounds its observed reader. The
global scene words gate the entire five-hull loop. Simulation0 still has input,
retained-pose, camera and water-selection work outside that loop; it is not a
complete original pause contract. Main-state21 can admit water with no hull
ticks. These frontend schedules remain unported. The ordinary world therefore
requires a shared nonzero simulation state; browser pause uses its explicit
inactive-host policy. Numeric setups distinguish total craft from human count,
including 4/1, 1/1 and 2/2. The direct-reference scan does not exclude every
unidentified indirect writer or prove a time-trial frontend count.

The opt-in native preview now admits Sunny Beach **two-player races** alongside
time trials, with both independently controlled physical riders, the 2P source
water amplitudes, selected class object families and actual shared contacts.
Normal/Hard/Expert/Reverse have 43/46/48/48 fixed-sphere definitions in the checked
source-family order and no 2P decorative colliders. Seed 17 riders 0/2 complete
all four three-lap matches cleanly at 109.65/106.75/107.60/108.20 game seconds;
their actual contact counts are 13/115/115/48. Complete physical/progress/water
finish histories match at 30/60/144 Hz. These steering providers are authored
verification controls, not original AI. Single input objects or logical-frame
providers apply only to P1; arrays supply independent player streams.

Native versus uses the normal winner/result display and stays unranked.
Unsupported native catch-up assistance is disabled with an explanation, while
its saved modern preference is retained. Ordinary race/championship AI, native
Free Ride/Stunt, other native venues and source starts remain outside admission.

Separate player windows now transport bounded physical 15-segment target poses,
integer HUD/actor/frame telemetry and primary-buoy display rows. They carry no
solver ownership or mutable physics buffers. Recorded endpoints interpolate;
native actor/frame metadata and fixed spans remain discrete. Detailed and
fallback meshes use the actual full hull transform once, bypassing modern
extra bank/stunt/wipeout offsets. The child no longer imports race-core merely
to obtain display colors.

High 1280×720 browser verification completed the Normal match with 42/39 actual
passes, zero misses/DQ and the correct Player 1 winner at 109.648 s. Separate
High 1280×720 views held the first genuine contact at 11.05 s, hull tick 1105 and
water/body/auxiliary frame 221. Both windows agreed on racer coordinates, native
HUD values, source frames, 59 primary rows and all 49,152 water heights
(Int16LE FNV1a 2879715165), including identical sampled heights. Pausing from P2
left the complete exposed physical/water fingerprint unchanged. Browser keyboard
events in P2 drove only that rider:4.2s of accelerator moved it about 78 m while
P1 remained neutral. The saved enabled assistance preference also survived
normal native Start, reload and the contact inspector. Parent console had only
the existing favicon 404; the child console was clear. OS minimization and
physical-controller verification remain outstanding.

The final complete regression is **1,284/1,295 in 69.09 s** (private
`full-tests-native-craft-contact-final.tap`). All 47 additions since 1,248 pass;
the same eleven integration failures remain, with their names compared exactly
to the preceding full run. No source ROM, original art or raw disassembly is
published. Remaining native actors/tricks, original AI, course geometry and
mode integration, the existing failures and full course sign-offs still block
parity and production publication. The ongoing goal remains active.

## Original AI foundations and input phases — October 15, 2026

Three isolated original-opponent kernels are now reconstructed. They are
prerequisites for a complete native AI controller; ordinary race/championship
AI is still outside native admission.

`native-ai-route.js` compiles the separate four-avatar navigation graphs and
advances their persistent navigation index using the recovered binary32 plane
tests. Branch selection follows selected avatar B68, independently of grid
slot and physical profile. These links differ from the primary buoy judge's
links and award no power, laps or finishes. Current movable node centers can
be supplied explicitly. Detached graph/state snapshots permit an explicit
caller-selected table change without inventing course-family policy. The
private comparison covers 54 nonempty compatible 1P table/class records,
2,681 nodes, 21,448 forward/backward links, 48 plane decisions and 24 initial
windows. This does not establish menu reachability or the distinct 2P loader.

`native-ai-steering.js` reproduces the bounded steering/trim calculation with
explicit target, body axes, predicted motion, turn budget and recovery state.
Its binary32 thresholds, asymmetric recovery clearing, two-stage 35-unit
steering update, wrong-way flag, sharp-turn trim and stuck override match all
595 prepared raw-source cases. The upstream target/correction producers remain
external inputs; the initial route target is not a substitute for final aim.

`native-ai-power.js` reproduces the power selector before shared actor factors.
All 3,664 prepared raw/public cases agree, including difficulty/role tables,
relative slot-zero progress, strict steering thresholds, marked contact,
counter and course overrides, retained prior values, and the final 0.5–1.2
clamp. Unknown state semantics retain explicit native field names. Reverse
class is not guessed to be another difficulty index. These leaves consume
caller-supplied producer state and do not fabricate ranking or flags.

The adapter now separates human identity, input dispatch and computer physical
profile. Trusted frame options can apply source AI takeover to a human craft
without changing its physical coefficients or resetting button history. Raw AI
input requires its explicit power baseline and bypasses only the human stick
curve. The recovered shared button edges, slew, gesture thresholds, actor
factors and mute behavior remain in place. Private comparison covers 1,664 AI
shared-input cases, 441 human curve cases and 48 human gate cases. Original
circle/stunt history fields and their stunt consumers remain unported; this
is not a complete 61184 or native stunt implementation.

The independently selected computer profile uses the recovered four families
of steering, engine, contact, lateral, roll and pivot coefficients and hull
damping. Its tuning dependencies differ from human interpolation. All 108
prepared computer-profile cases and 1,296 public numeric field comparisons
agree. The source 1.2 baseline reaches the actual jet without an invented cap
of 1. The surrounding hull retains its documented SI/double fitting; exact
whole-craft trajectories and the other 16ce consumers are not established.

The multi-craft world now offers a pre-frame hook, then samples ALL inputs in
descending order before preparing ANY craft's forces. Captured source/action
state and controller history are consumed once. An explicit sample survives a
failed force preparation without polling again; implicit standalone preparation
still validates before committing. Adapter re-entry during sampling, force
preparation, hull stepping or deferred body completion rejects without a second
history update or solve. An independent review reproduced and verified those
boundaries. No navigation hook is yet installed in the playable native host.

Native result/finish-wait updates now belong solely to completed 50 ms frames.
The render-facing step previously advanced finish-wait a second time. A prepared
two-game-second fixture now advances it by exactly two seconds at 30/60/144 Hz;
this check does not admit native championship. Mixed computer/human physical
profiles also retain identical source histories across those render rates.

The final complete regression is **1,358/1,369 in 69.26 s** (private
`full-tests-native-ai-foundation-final.tap`). All 74 additions since 1,295 pass.
The same eleven failure names match both preceding full runs exactly. Final
High 1280×720 browser checks retain the 11.05 s contact at hull tick 1105,
source frame 221 and C40 1.861451268196106 on both craft. Separate windows
match all 49,152 water heights (Int16LE FNV1a 2879715165), sampled water values,
native HUD and coordinates. Pausing from P2 preserves the entire exposed
physical/water/racer state. Continuing completes the Normal match with the
expected Player 1 win at 109.648 s, 42/39 passes and zero misses/DQ. The child
console is clear; the parent retains one resource 404. Detailed riders and full
resolution remain in both views. Verification pilots remain authored controls.

Remaining original AI work includes lookahead/final aim, body-motion prediction,
course/obstacle/floor/proximity corrections, water trim, throttle/actors,
initialization and RNG history, shared primary judgment, ranking and finishes.
These must be composed with explicit source ownership before native race or
championship admission. The existing course/mode failures, remaining actors and
tricks, other native venues, full course sign-offs and hardware verification
also remain open. ROM bytes, raw disassembly and recovered art stay private.
The goal is active; this local milestone is not production publication.

## Original AI input producer — October 15, 2026

The selected-racer AI input producer is now composed as an isolated numeric
module, `native-ai-driver.js`. Prepared source state passes through motion
prediction, two-pass lookahead and final aim, course/floor/player corrections,
steering, two actual triangular-plane water queries, water trim, conditional
traffic/button selection, power, and the final action-request tail, in source
order. Source phase 650 selects the full driving routine only at 3; other
phases run the separate start-input routine and preserve AI history, actions
and prior power. This is ready for prepared-state use. Initialization,
ranking, geometry producers and action consumers still block playable native
race/championship AI admission.

`native-ai-target.js` keeps the four-avatar navigation window separate from
temporary lookahead. It recomputes metrics between both target advances, then
selects near aim and the final segment. Current buoy centers can move while
their initialized gate endpoints stay fixed. The recovered finite-line side
test's degenerate arithmetic, previous-color fallback, division versus rounded
reciprocal normalization and Southern Island lap-dependent skips are retained.
An all-skipped invalid cycle rejects atomically. The private raw/public
comparison passes all 1,467 fixtures, including 501 full target pipelines,
78,183 exact binary32 fields, 11,169 segments and 32,523 integer/window fields.
All 53 inventoried conditional branches take both outcomes in that audit.

`native-ai-motion.js` predicts from the preceding actual normalized body
movement, tracks source recovery phases and signed slow/dry/behind counters,
and evaluates proximity and the selected water circle. Proximity scans the
first explicit count of the raw generic-object table. Its supported capacity
of 64 is corroborated by three original loader bounds, independently of the
consumer. Nearby-object flag 98, circle flag A4, dry-contact latch 9c and
retained flag 94 remain distinct. Human identity and source slot zero are also
distinct selectors. All 1,094 bounded raw/public cases agree. The downstream
steering input now accepts negative signed-counter overflow, matching the
source's signed comparison instead of treating it as a stuck override.

`native-ai-corrections.js` implements all 65 ordinary and 36 Reverse escape
rectangles, including open boundaries, later-overlap precedence, lap/height
gates and signed counters. The delayed floor correction and primary-human
avoidance follow afterward. Course/floor overrides change direction without
inventing a new point or distance; actual player avoidance replaces the point
and rebuilds the segment. All 10,221 isolated cases and 404 composed correction
plus steering cases match the original execution. Every one of the 101
independently inventoried positive region-store locations is dynamically
covered. Source escape vectors are not silently normalized, and player
avoidance has no added distance gate.

`native-ai-actions.js` preserves center/512-forward native water sampling,
datum-aware raw plane heights, actor-specific button handling, source camera
quad degeneracies, strict traffic-speed comparisons, training triggers and
the final course-specific action requests. Its 8,464 prepared raw/public cases
agree. Power reads the pre-tail steering value; a later action may change the
returned axes. The last-steering AI field retains the pre-tail value. The
previous-navigation word is one shared global passed between selected racers
in actual input order. An action request is returned explicitly for its real
consumer; it is not a completed actor or substitute animation. The independent
start leaf passes all 1,470 prepared cases and leaves retained AI/power fields
untouched.

The assembled producer agrees on all 253 prepared executions of the original
driving/start routines and their numeric callees: 205 driving and 48 start
cases, with 14,364 compared output fields. These executions include the actual
water-query instructions against the same prepared lattice. Only square root
is intercepted with a host result rounded to binary32. An independently
reviewed moved-center execution adds a persisted regression for fixed
endpoints, persistent navigation 0 versus temporary target 2, full corrected
segment and exact controls. Three independent integration reviews found no
concrete composition defects. These are bounded prepared-field comparisons,
not a complete original-game trajectory or R4300 floating-point-environment
proof.

A separate integration fixture sends four prepared AI streams through the
real mixed human/computer physical profiles, hull solvers, articulated rider
solvers, navigation and common input path. All-racer navigation precedes
descending input sampling. Twenty outer frames produce 100 hull ticks and
exactly 80 AI samples, with identical complete control/state/physical/water
histories at 30/60/144 Hz. Pause and snapshots consume no samples. Starts,
rank records, camera/circle geometry and retained state are explicit fixture
inputs; this does not establish the native grid, rank producer or a completed
original-opponent race.

The complete regression run passes **1,455/1,466 in 89.68 s** (private
`full-tests-native-ai-driver-final.tap`). All 97 additions in that run pass;
the eleven failure names match the preceding foundation run exactly. The
subsequently added moved-center regression also passes in the **11/11** driver
test run, bringing this milestone's additions to 98 without further runtime
changes. All 218 module versions are present in the three HTML import maps.

The updated browser build loads and executes the assembled producer against
an isolated prepared input without changing the playable world. High
1280×720 separate player views retain the 11.05 s contact at hull tick 1105,
source frame 221 and C40 1.861451268196106 on both craft. They agree on racer
coordinates, native HUD, all 49,152 water heights (Int16LE FNV1a 2879715165)
and sampled heights. Pausing from P2 preserves the exposed complete
physical/water/racer fingerprint. The authored verification controls finish
the Normal match with the expected Player 1 win at 109.648 s, 42/39 passes,
zero misses/DQ and 13 contacts. The child console is clear. This parent run
records two favicon 404s and the existing foam shader's compiler warning about
potentially uninitialized fragment variables; no AI module request fails.

Remaining live integration includes original cold/reset/retained-state and
role/RNG initialization, course-family/context selection, all-racer legal-lap
progress and ranking/finishes, native camera/circle/raw-object producers, and
the actual action/actor consumers. Complete frontend scheduling, remaining
native actors/tricks, other native modes/venues, existing course failures,
course sign-offs and hardware checks remain open. ROM bytes, disassembly and
original art stay private. Default gameplay remains modern; native admission
remains Sunny Beach time trials and two-player races. No production release
or spending occurred. The goal remains active.

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
| Online two-player extension | Private WebRTC invite link/return code, one host simulation, independent full-resolution views and local controls, shared pause/restart, stale-input release and paused recovery. Free STUN without a paid relay; restrictive-network support and physical controller hardware remain unverified. See [ONLINE-MULTIPLAYER.md](ONLINE-MULTIPLAYER.md). |
| Two-player Dolphin Park | Untimed exploration with normal water/stunt physics, both riders, same-rider alternate livery, independent cameras, pause/restart. No racing gate/DQ/lap-finish logic. |
| Independent Player 2 stunts and dive | Gamepad modifier controls and numpad 1–7 / apostrophe defaults; both riders can use the same mechanics. |
| Remappable controls | Bounded per-player keyboard/button/axis settings, inversion, 0–35% deadzone with 5% default, conflict checks, safe key capture and defaults reset. Touch actions remain independent of physical-key rebinding. |
| Per-player rumble | Actual collision, landing and hull-load transitions; 25% default, independent strengths, throttled calls and cancellation. Fake actuators cover failure handling; physical hardware remains unverified. |
| Stunt water conditions | Stunts consistently use venue conditions and permit their normal score saving; ordinary race/free-ride sea preferences are retained. |
| Global scoring | Published worldwide race-time and stunt-score boards, separated by event, course, class, laps, sea state, tuning category and layout revision. Explicit posting, local records retained, previews/demos/free ride/versus/DQ excluded. See [GLOBAL-SCORING.md](GLOBAL-SCORING.md). |

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
ticks. At this checkpoint these frontend schedules remained unported; the
October 16 simulation0 checkpoint below adds the ordinary zero-physics outer
schedule. Browser pause retains its explicit inactive-host policy. Numeric setups distinguish total craft from human count,
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

## AI setup, source standings and action history — October 15, 2026

Five further numeric components now close source dependencies around the
selected-racer input producer. They remain isolated from playable admission
until the earlier primary lap/finish logic, source geometry/context producers
and complete action-pose lifecycle are composed.

`native-ai-initialization.js` returns exact partial setup writes and the shared
unsigned32 RNG step. It distinguishes source slot, selected avatar, physical
profile, source setup order, rank order and human identity. All four stored
slots receive the source's actual setup mask, including when active count is
zero. Unwritten motion history, slow/contact flags, prior raw input and action
phase remain retained. Unknown physical-profile words leave the turn budget
untouched. Nested motion patches must be merged explicitly with actual prior
state; the initializer supplies no fabricated cold/reset history or seed.

The role/trait selector preserves actual two-draw consumption and its unusual
modulo fallback, including explicit reads/writes of the adjacent slot-four
scratch word. Repeating prepared scans reject atomically; no wrap correction
or fifth racer is invented. The field-60 setup loop writes only the retained
slot-three context. Setup also returns exact inverse-order stores, the
qualifying runtime-type index prefix and camera byte masks. Those indices are
separate from the later raw-prefix proximity scan. Camera XZ/alpha and omitted
words remain retained. Private comparison covers **992 exact returning cases**,
**130 matching deterministic source-repeat rejections**, **10,062 RNG words**
and 509,950 serialized field entries. Boot memory clearing and the external
boot seed word are recorded separately as provenance, not later setup defaults.

`native-ai-context.js` selects and refreshes the actual target-table window.
Setup state 21 or source mode 1 forces primary. Port Blue's avatar-one branch
selects secondary except at source difficulty 2. Ordinary Twilight City keeps
its native variant selector, five ordered open regions, retained route flag
and late finished override; Reverse retains the record's family. Table
overrides never overwrite the record family or persistent navigation row.
Compiled table/window ownership and current source row validity are explicit.
All **12,120** prepared original context/helper executions agree, including
**96,960** window fields. No arithmetic helper is intercepted in this audit.

`native-primary-standings.js` reconstructs the final ordinary primary tail's
legal-lap/finish-plane history, selected progress row, projection distance and
ranking metric. It consumes the earlier judge's retained row, actual lap and
the separate primary next/previous links, with complete current displaced
centers. Coarse region sharing preserves only the first/last matches; course 2
uses its longer finish neighborhood. Previous-link traversal is bounded by
the actual primary count. The Fortress alternate branch changes the segment
reference while retaining the craft-to-selected-node delta. Signed32 prefix
arithmetic precedes binary32 conversion; only the upper fraction is clamped.
Finished/DQ records retain metric and distance while legal history and the
selected row still update. All **2,638** prepared original tail executions
agree, including actual region helpers and rounded host square root.

`native-race-ranking.js` provides the separate finish reconciliation and
ordinary sort, in source order after all ascending primary tails. Finish
reconciliation can displace a metric through signed integer truncation and
adjust equal finish times using old places and the selected primary human.
The rank phase uses immediate nested strict comparisons, so equal metrics can
change relative order after another swap. Activity, main-state, mode, phase,
finish flag and count gates preserve inactive fields and array suffixes.
All **1,429** prepared original-prefix/public comparisons agree. Prior timing
and primary calls are supplied as completed inputs in that audit; persistent
record saving and later versus finalization remain outside its scope. The
later versus branch can overwrite the two human places without rewriting the
order array, so their inverse relationship is only a sort-boundary guarantee.

A coherent synthetic integration fixture now passes four actual primary
metrics through one native rank phase and then the next full AI input calls.
Source places [3,0,1,2] drive the expected role-dependent power values while
selected human slot 2 remains independent of slot zero. It preserves the
separate primary and AI tables/rows and explicit retained state. This verifies
producer boundaries, not a source-initialized grid or complete race.

`native-rider-action-dispatch.js` supplies the missing common-input gesture
history tail, conditional eligible post-hull action dispatch, inversion/arc
history, numeric actor initializers and the dive-return request. Raw and
pre-curve axes, filtered held bits and the actual engine mask stay distinct.
There must be one direction-history owner when it is wired into input latching.
Short counters wrap; exact diagonal edges are not decomposed. Source action
clearing precedes scene/alternate rejection, manipulation-three retains its
request, and idle RNG is consumed only on its actual eligible branch. The
private comparison passes **5,036** cases plus **2,237** conditional RNG checks
and eight pose-dispatch argument checks. Returned actor requests and joint
type/mode recipes are numeric consumers, not completed physical poses.

Three independent reviews found no concrete defects within these contracts.
The complete suite is **1,533/1,544 in 71.14 s** (private
`full-tests-native-ai-context-standings-final.tap`). All **77** new tests pass;
the eleven failure names match both preceding full runs exactly. The prior
milestone's additional moved-center test is also included in this full run.
All 223 module versions are regenerated in the three HTML import maps.

Fresh browser imports execute prepared samples of all five new modules at
High 1280×720. Both player windows retain the same 11.05 s contact, tick 1105,
frame 221, C40 values and all 49,152 water heights/hash 2879715165. Their native
HUD, coordinates, sampled heights and physical rider rendering agree. The
child console is clear; the reloaded parent records only the favicon 404.
The playable host is unchanged from the preceding completed Normal match.

Remaining integration is concrete: the earlier ordinary primary lap/finish/
timing and table-family effects; source setup and shared RNG scheduling;
native camera/circle/object coordinate producers; one latched action/history
owner; and equivalent physical targets plus post-pose completion for actors
8/9/17/10/25. Ordinary Sunny race has no direct Stunt-tail request 1/2, but
gesture sequences and idle selection are alternate actor triggers, so their
absence is not a reachability proof. Unsupported actions must be implemented
before admission. Other native modes/venues, course geometry/sign-offs, the
eleven existing failures and hardware checks remain open. No original bytes
or art are published, no money was spent, and production remains unchanged.

## Physical action lifecycle integration — October 15, 2026

The additional action path now composes with the actual five-tick hull and
nineteen-point rider adapter. It is explicitly enabled with retained
`riderActions` history, idle fields and scene/RNG context. The playable host
keeps its existing admission while complete source setup and shared scheduling
are assembled; this does not establish a complete original-AI race.

The input latch has one owner for direction mask15f6 and six separate retained
gesture words. It captures raw/pre-curve input, actual engine mask and source
context once before any racer prepares forces. An explicit latch survives a
failed preparation without polling again; an implicit failed preparation
commits neither history. Rendering, paused calls and snapshot reads cannot
advance it. Optional `sourceState.sourceTick` supplies the actual shared
unsigned clock, including a retained nonzero epoch. Omitting it retains the
declared preview logical-frame clock; no epoch is inferred from old history.

An AI producer's unsigned `action16f4` can now travel beside its raw controls
through the same word consumed by manipulation and post-hull actor selection.
Conflicting explicit writes reject before latching. Preparation counts actual
hull-up sign transitions, applies the source new-arc resets, and preserves an
already-active arc. Completed dry/no-contact frames now wrap signed32 rather
than saturating; wet contact does not clear that counter. A real driver-tail
request2 reaches an actual pending actor9 pose in the integrated test.

`native-rider-action-pose-lifecycle.js` provides the numeric completion rules
for actors8/9/17/10/25: evaluator-frame holds/jumps, ordered grip changes,
physical-mode changes and ordinary-return requests. Actor10 preserves the
49-frame idle wrapper and its four actual choices; actor25 evaluates its fixed
sample and stores frame0. All **5,273** prepared original/public leaf cases
agree. A further **104** prepared integration cases execute the actual common
request and initializer consumers, checking eligibility/priority, request
clearing before scene rejection, same-pending no-ops and completion returns.
These are bounded source executions, not observed full gameplay replays.

The source common request clears C6c on every successful immediate or pending
request. The adapter now owns that single idle counter, committing decision
and completion resets; the old reset-only recovery alias is removed. Recovery
snapshots use schema v2 and reject the old duplicate-field representation.
Restoring any active blend or actor17 requires its actual physical mode beside
already-restored physical points/types. A peer review caught and fixed an
actor8 exit-blend restore that otherwise inferred the wrong auxiliary mode.

`authored-native-action-poses.js` supplies new, length-preserving anatomical
paths for the five actors using the high-resolution rig's rest dimensions and
actual hull frame. It preserves the recovered evaluator bounds, including
actor17's next38 stop, idle restarts and actor25's alternate fixed4/8 samples.
Current and pending targets evaluate independently. Holds, grip changes and
initialization remain lifecycle-owned, followed by one auxiliary solve, rider
preprocessing and one nineteen-point solve. Actor9's authored auxiliary grip
ordering follows the final actual point types after source completion writes.
Geometry, imported-point blend and that grip adaptation are explicitly authored;
they do not prove original animation-target geometry parity.

Physical tests cover handstand hold/release and crash/remount, backwards hold
and skip, standing normal/fast release, all four idle choices/cancellation,
both dive branches, current/pending action blending and retained-clock history.
Four actual action riders produce identical hull, rider and water state at
30/60/144 Hz, retaining descending input/completion and conditional shared-RNG
order. No fixed joint, ordinary-pose fallback or suppressed request is used.

Feedback cue recipes remain visible effects. The bounded synchronous cue
callgraph consumes zero shared game-PRNG draws; its separate audio selector
and downstream audio thread are not reconstructed by this milestone. No
invented game-RNG draw is added for a cue.

The final complete suite is **1,592/1,603 in 122.21 s** (private
`full-tests-native-rider-actions-final.tap`). All **59** added tests pass; the
eleven failure names match the preceding 1,544-test baseline exactly. Three
independent reviews cover numeric leaves, adapter ownership/order and physical
pose integration. The active-blend restore finding is included in this final
run. All **225** module versions are regenerated in the three HTML import maps.

High-resolution browser review rendered twelve actual solved action samples
using the unchanged detailed Blender craft and rider (47 meshes / 347,340
vertices per rider), with no collapsed presentation segments or console
warnings/errors. The temporary review page is private and removed from the
served tree. Fresh native two-player windows remain High 1280×720 at the same
11.05 s contact: tick 1105, frame 221, both C40 impacts 1.861451268196106, matching
positions/HUD and all 49,152 water heights/hash 2879715165. Both visible riders
use solved physical poses. The child console is clear; the parent has only
the existing favicon 404. These checks preserve presentation and the admitted
host preview; they do not enable the additional path with invented scene/RNG
defaults.

Remaining integration includes earlier primary lap/finish/timing and record
effects; full source setup/retained history/shared-RNG scheduling; actual native
camera/circle/object producers; feedback/audio and stunt scoring; then a full
native Sunny opponent race. Other native modes/venues, course geometry and
sign-offs, the eleven existing course failures and hardware checks remain
open. Default gameplay remains modern, and native admission remains Sunny
time trials and two-player races. No original bytes/art are published, no
money was spent, and this milestone is not pushed or deployed.

## Ordinary race update composition — October 15, 2026

The primary judge now has the preceding source scratch/nearest-node producer,
complete ordinary lap/timing/finish routine, and following result bookkeeping.
These remain prepared numeric consumers; a complete source-initialized race is
not admitted by this milestone.

`native-primary-gate-judge.js` preserves the actual source side history,
checkpoint endpoint projection, directional one-sided bound and first/last
coarse-region sharing. Its **2,688** raw/public cases agree. The complete
`native-primary-scratch-context.js` then matches **2,337** original executions,
including **518,814** retained record words. It selects actual body or alternate
XYZ, compares only previous/current/next with source tie priority, updates the
separate retained 2c48 row, and produces Drake weeds and Port/City region cues.
No AI navigation cursor or broad nearest-route search is substituted.

`native-primary-race-progress.js` matches **5,568** complete prepared source
executions, including **1,236,096** record words, scoped shared globals and
ordered audio entry arguments. It covers 50 ms signed timers and saturation,
side awards, human misses/DQ, fractional checkpoint timing, nine-slot rolling
lap/miss history, best-lap flags, finish allocation and course-family changes.
Crossing interpolation consumes the actual previous body center (+BE4/BEC),
whose producer stores the center before the five hull ticks. Timing words
2a9c..2c20 have one 98-word owner, stopping before status 2c24. An independent
17-case source review found no concrete defect.

`native-race-finalization.js` matches **327** prepared original ordinary result
updates. Record saving precedes ranking; split feedback, versus final-time
place overrides, primary-route gap and finish-wait counting follow it. Full
five-word record rows shift while four replacement words retain the fifth.
Versus places may differ from the independently sorted order3990. External
overlays remain ordered recipes, and their continuation reads fresh flags
after the three prelude calls rather than caching their eligibility.

`native-primary-race-phase.js` composes the actual ascending scratch→judge pairs,
finish-metric reconciliation, record saving, old-place capture, one rank pass
and finalization. Its canonical state retains all 222 unsigned bit-pattern
words per racer, including untouched navigation/unknown fields. Typed leaf
views are temporary; finish-time reconciliation writes back into timing[14]
before records run. Projection39a0 is the separate per-slot source array.
Comparison splits, reverse bits, player count and difficulty metadata share
their original owners. Zero active count retains scratch XYZ, and invalid
prepared input rejects atomically. All **135** prepared original outer numeric
updates agree, including **116,328** record words and all scoped globals,
tables, scratch, order and effects. This executes the actual paired numeric
callees, not completed-tail stubs.

`native-ai-perception.js` matches **354** prepared comparisons for procedural
water-mesh XZ/snap/selection-circle arithmetic, the literal current-object
prefix and retained graphics-buffer corner selection. It preserves the
radius16 center-index quirk and stored signed16 vertices. Active AI reads the
preceding circle; camera/water patch production happens after the hull phase.
The actual camera-corner XZ writer remains unknown after bounded resident,
common-overlay and nineteen scene-overlay searches. Nine original buffer-toggle
executions establish its selector lifetime, not its missing producer. No
modern frustum, assumed zero corners or player-index buffer choice is supplied.

All **86** added tests pass. The complete suite is **1,678/1,689 in 94.63 s**
(private `full-tests-native-primary-phase-private.tap`), with the same eleven
failure names as the preceding completed run. All **231** module versions are
regenerated in the three HTML import maps. Fresh browser imports reproduce
the prepared four-racer phase's 888 words and ordered effects. The existing
native two-player preview remains High 1280×720 at 11.05 s, tick1105/frame221,
with matching positions, both contact impacts and all 49,152 water heights
(hash2879715165). Detailed physical riders, water and shoreline remain visible;
the child console is clear and the parent retains only its favicon404.

Source reset/startup, coherent shared RNG scheduling, native camera/patch and
current-object producers, overlay/audio consumers, mode11 stunt scoring and a
full source opponent race remain open. Other native venues/modes, course
geometry/sign-offs, the eleven existing failures and hardware checks also
remain. The live preview admission and high-resolution rendering are unchanged.
No original executable bytes or artwork are published, no money was spent,
and this milestone is not pushed or deployed.

## Race startup and canonical shared state — October 15, 2026

The new prepared startup path composes selective reset75310 and its complete
EED70/EE9C0 terminal, source prestart stages, countdown/launch boost and the
ordinary numeric race update. Additional ordinary consumers now implement
status counters, native speed display and its separate16-bit random sequence,
wrong-way warnings, missed-buoy power feedback and both retirement paths.
These are verified source consumers and canonical adapters; complete original
initialization and a live source opponent race remain open.

`native-race-state.js` retains one1693-word race window1f94..3a04 and one
1442-word HUD window7788..8e0c. All four222-word records, persistent course
tables, setup order26c0, ranking3990, per-slot projection39a0, shared scratch
and HUD byte latches derive from those owners. The optional168-word i1 and
50-word profile spans retain their own memory. ProfileB338 supplies difficulty
when present; a duplicate scene difficulty is rejected. Signed reset and
unsigned progress views share the same reverse halfword. The old phase DTO
exists only as a detached compatibility view and is committed back immediately.
Missing raw words reject rather than becoming guessed zero state.

Reset retains unwritten timing/history, inactive slots, setup/rank arrays and
unselected course records. It uses reference+24/+28 rather than moving buoy
centers, exact A0/A4/B4 links and source search-budget exhaustion. Cold reset
touches the actual course9..11 table tails only. The terminal reads prior HUD
palette history before clearing it, preserves opaque supplied presentation
words, and writes only active latch bytes. No original palettes/artwork are
embedded in these modules.

The prestart counter advances on source display-stage calls, after the CPU
update: ten ordinary solo calls, fifty other solo calls or forty-six two-player
calls. Phase650 and simulation648 remain distinct. Countdown retraction precedes
charge decrement, and launch power uses actual pressedB58 edges and independent
latch bytes. The new charge15 transition opens the clock after that frame's
earlier timing pass; the following pass adds50ms. No high-resolution render
callback advances these numeric producers.

Prepared original-instruction comparisons for the new consumers:

| Consumer | Exact cases |
| --- | ---: |
| Selective reset75310 before its terminal | 126 |
| Complete EED70 terminal and EE9C0 palette | 870 |
| Original i1 initializer, dispatcher and complete status body | 6,970 |
| Countdown/start-boost F03E0 | 6,976 |
| Status/timer prelude FC39C | 196 |
| Speed display F23A0 and separate Math_Rand ED304 | 561 |
| Direction/wrong-way EF504 | 6,196, plus1,834 readonly helper cases |
| Missed-buoy/power F0E7C with real retirement | 880 |
| Separate adjacent palette counter block | 210 |
| Allowed-area warning F1CFC with real retirement | 860 |

The ordinary79528 adapter additionally matches135 complete prepared executions
over all1693 race and1442 HUD words, including previously untyped retained
history. The canonical prestart adapters reproduce the same6,970 original
stage fixtures over23,370,410 owner words; these reuse the stage evidence,
not additional unique source cases. Nine original reset→terminal→countdown
sequences cover1,080 repeated source calls with complete state hashes and
ordered operations. Initial phase1 is an explicit prepared input in that
sequence proof, not a claim that main initialization has been reconstructed.
An independent30-case ownership/table-offset/halfword/roundtrip review found
no further concrete defect.

F1CFC's actual eligibility halfword is missesEnabled72e, not configuredLaps728.
Its counter1 reaches0 before retirement on the next call; source actors23/7
freeze an existing warning. F0E7C animates allowed misses through the configured
limit and can retire after its actual17-call feedback delay. It also preserves
the separate power1 interruption and power0 expiration. EF504 reads prior2c60
before its later wrong-way increment/audio. Its exact512-word readonly angle
table remains an explicit input, without an acos/atan2 replacement. F23A0
updates canonical2c00/2c04 and carries its own16-bit seed6f00 in racer order;
it does not consume the32-bit AI initialization RNG.

All144 added tests pass. The complete suite is1,822/1,833 in117.97s, with the
same eleven failure names as the preceding completed run. All241 module
versions are regenerated in the three HTML import maps. Browser imports
reproduce a prepared120-call startup sequence, ending with phase3, clock open
and independently timed powers[5,4,1,0]. The retained native two-player preview
is still High1280×720 at11.05s, tick1105/frame221, with matching positions,
both contact impacts and all49,152 water heights (hash2879715165). Detailed
physical riders, water and shoreline remain visible; the child console is
clear and the parent retains only its existing favicon404.

The new leaves are connected through canonical prepared-state adapters, not
enabled as a complete live startup. Required source-stage transition recipes,
remaining retained placement/indicator consumers, original main/update
initialization, physical grid/start actor15, source camera/current-object
producers and shared32-bit RNG/AI scheduling remain open. The adjacent palette
helper covers its numeric counter block only, not original drawing. Mode11
stunt scoring, all venue/mode sign-offs, the eleven existing course failures
and hardware checks also remain. The modern high-resolution renderer and
existing native preview admission are unchanged. No original executable bytes
or artwork are published, no money was spent, and this checkpoint is local.

## Shared water initialization, grid placement and ordinary HUD composition — October 15, 2026

The prepared ordinary race update now expands all eight numeric HUD consumers
in their original order: status, direction, speed, conditional countdown,
placement, rivals, missed-buoy feedback and boundary warnings. The conditional
countdown gate reads fresh canonical status after the first three consumers.
Each consumer's writes reach the following consumer immediately. A later
failure cannot partially commit earlier state. Physical updates and the i1
update/display stages remain separate source-frame calls.

The combined coordinator matches63 complete prepared original79528 executions
with all eight numeric bodies expanded. Checks include473 source consumers'
entry/exit states,4,526 ordered tail operations, complete final race/HUD words and
2,965,710 intermediate owner words. The actual selected angle table is supplied
privately; sine samples remain explicit prepared RAM data. Audio entry and
profiling calls retain their stated boundaries. These are prepared numeric
composition checks, without source startup or complete-race admission.

Placement feedback includes source row easing, actual body15c0 offsets,
proximity pulses and the1→2→3→0 place-change animation. Rival indicators
retain the original signed-place filter, inclusive1024-unit/135-degree bounds,
unnormalized cameraF0/F4 axis and supplied angle/sine lookups. The complete
placement/rival bodies match4,540 original prepared cases and564 additional
ED154 helper cases, covering all32+5 store sites and complete race/HUD words.
Original sine-table generation is not established by these prepared lookups.

Both native camera records are inside the1442-word HUD owner. Direction and
rival adapters derive temporary views from its current7c80+index*10c records;
a duplicate caller camera view is rejected. Direction uses64/6c, whereas
rivals use rawF0/F4. The reached rival corner coefficient7a50 also comes from
the canonical HUD word, without assuming its usual2/3 value. Independent review
found and resolved an additional duplicate camera view in the Fortress gate
cue: primary judging now derives the same selected HUD coordinates. Near,
far and swapped-camera regressions produce cue counts1/0/1 and reject a
conflicting caller view.

The new complete water-noise preparation returns all49,152 height/velocity
pairs and the next unsigned32-bit RNG word together. Four complete original
4F790 executions compare every cell and final RNG state, including amplitude0,
1,20 and127. Each executes98,316 actual47E50 calls and98,304 actual rounding
helpers: zero amplitude still advances the stream. The shared800D4640 owner
is distinct from the speed display's16-bit6f00 seed. This closes4F790 only;
the surrounding field-template setup, boot seed and intervening RNG consumers
remain explicit initialization dependencies.

The bounded948DC wave selector matches803 actual cases, including its genuine
shared RNG call. Pending player half60c is separate from active playersDab28.
Complete6AC84 placement selection matches2,459 prepared original cases over
22,131 packedF32 matrix arguments, including ordinary, demo and training
branches. The separate67E40 computer-profile selector matches2,052 bounded
flag-loop cases. These include the prior accepted32 wave/168 placement cases.
The grid adapter reads canonical26c0 rather than ranking3990 and returns the
actual matrix-constructor arguments. It does not yet evaluate48854, initialize
the physical hull/rider, select the actor15 launch pose or copy camera history.

All62 added tests pass. The full suite is1,884/1,895 in103.52s, with the same
eleven existing failure names. All246 module versions are regenerated in the
three HTML maps. Browser and Node agree on an authored47-call full ordinary
sequence, ending phase2, clock open, next-frame time50 and launch power5, plus
the complete water initializer. This is prepared numeric execution, not a
complete live source startup. The retained native two-player preview remains
High1280×720 at11.05s, tick1105/frame221, with matching racer positions and all
49,152 water heights (hash2879715165). Detailed riders, water and shoreline
remain visible; child console is clear, parent retains its favicon404.

The isolated offline original-ROM CPU host now builds and completes one
neutral30-second boot. It records1,157 original87134 reader calls; every sampled
corner X/Z remains zero. Its graphics-free runtime cannot identify the missing
coordinate producer or establish an ordinary controller-driven race. No
installed executable/profile was changed. This runtime observation is separate
from the prepared original-instruction proofs and is not console/GPU timing.

Full main/update initialization, actor15/rest-pose and physical bootstrap,
course0 sequence progression, camera/current-object producers, all shared RNG
callers, result-stage transitions and a live source opponent race remain open.
Mode11 scoring, venue/mode sign-offs, eleven existing course failures and
hardware checks remain. High-resolution rendering and live preview admission
are unchanged. No original executable bytes/artwork are published, no money was
spent, and this checkpoint is local.

## Course-zero sequence and packed starting transforms — October 15, 2026

The prepared i1 update now composes its first-update initializer with the
course-zero sequence in the actual source order. The initializer retains the
one-shot latch until the following logical display. Sequence setup copies the
retained template, keeps noncompacted sentinel slots, accumulates signed widths
and emits its audio entry before advancing the row. The display expansion
preserves shared style writes, paused movement, strict expiry and the final
glyph before clearing the active flag. Its new high-resolution draw recipes
use logical screen coordinates and do not replay the original numeric routine.

The sequence leaf matches856 original prepared initializer/update/display
executions. The canonical outer update additionally matches162 complete5800
cases, checking543,186 owner words and129 ordered operations. A separate full
5AE4/5DF4 comparison expands actual6BD8 and its three reached drawing helpers:
554/554 cases match1,857,562 complete owner words and9,902 ordered operations.
This includes396 source-derived graphics-head advancements,38 first-display
early returns and118 paused displays whose later continuation restores
activity. Earlier graphics/resource/result entries retain their explicit
prepared-return or pending-effect boundaries. No original images or text are
embedded in the new recipes, and their modern presentation remains separate.

Grid placement can now continue through the complete numeric matrix
constructor, signed16.16 packing and actual physical decoder. The transient
decoded axes retain quantization; physics must not substitute the pre-pack
floats. All source arithmetic and write order are retained, including the
signed32-to-float rounding before decoding fixed-point elements. Degenerate
constructors return only their reached scratch writes, without inventing a
prior packed destination. The adapter leaves decoded output null on those
bounded partial paths; this does not claim the original physical initializer
skips decoding its own retained matrix.

Constructor/packer and decoder match952 original-instruction cases over22,080
whole scratch/packed words and27,506 ordered writes. A further128 combined
6AC84→constructor→packer→decoder executions match the canonical grid adapter,
including ordinary, reverse, two-player, secondary-row, demo, training and
degenerate branches. These check4,096 scratch/packed words,2,016 decoded words
and401,280 unchanged canonical owner words. These are transient numeric views;
they do not create a second physical matrix owner or initialize a hull/rider.

All41 added tests pass. The full suite is1,925/1,936 in109.23s, with the same
eleven existing failure names. All248 module versions are refreshed in the
three HTML maps. Browser and Node agree on400 prepared update/display steps
for each of one-player and two-player mode, plus packed-grid/training/partial
matrix checks. The retained live preview remains High1280×720 at11.05s,
tick1105/frame221, with matching racer positions and all49,152 water heights
(hash2879715165). Detailed riders, water and shoreline remain visible; child
console is clear and parent retains its existing favicon404.

Complete live source startup still requires main configuration, physical
6390C/62E50 ownership and actor15/frame56 pose evaluation. The source transforms
its local centroid separately before its points and refits its final hull
axes; existing preview initialization is not that bootstrap. Camera/current-
object producers, complete shared RNG history, result transitions, mode11
scoring, venue/hardware sign-offs and the eleven course failures remain open.
High-resolution rendering and live preview admission are unchanged. This
checkpoint is local, no original executable bytes/artwork are published, and
no money was spent.

## Main configuration, startup fades and rider start-pose math — October 15, 2026

The prepared main configuration now preserves the original order of wave
selection, class changes, lap retention, player counts, rider traits and both
camera mode words. Stunt can consume a random wave before its fixed override;
Reverse changes the class after the earlier wave choice. The mode4 profile
view extends its existing owner from50 to52 words for the four adjacent rider
flags, while bounded older paths continue to accept50 words. No overlapping
flag or physical-body owner is added. Activity, event and the misses switch
retain their actual earlier values.

The shared-state adapter expands both reached fade initializers at their call
positions. Mixed byte, halfword and word stores return to the existing HUD
owner. All five fade slots copy the supplied retained template; supported
properties retain their source store order and distinctions between fade types.
The required resource descriptor, body-tune and final audio effects remain
ordered pending consumers. Their later effects are not silently omitted from a
complete-startup claim. Invalid late dependencies leave every supplied owner
unchanged, including RNG, HUD and profile flags.

Direct configuration matches1,880 original prepared executions. An independent
complete main/fade composition matches another1,350 actual-source cases over
4,598,526 canonical owner values and155,043 ordered operations. The proof
separately replays356,839 actual resource stores at their source positions;
the resulting complete-before-audio state is intentionally distinct from the
adapter's resource-pending state. Standalone fades match396 original cases,
checking571,032 complete HUD words and6,744 ordered stores. These checks do not
replace the remaining resource consumers with neutral results.

The new start-pose kernel selects descriptor7's85-frame range and evaluates
the supplied18 signed bone records through the reached body transforms,
shoulder passes, arm IK and nineteen plus six physical targets. Full hull axes
and retained yaw remain independent inputs. Frame84 returns the source's
terminal result; later requests evaluate84. All130 original-instruction cases
match30,810 pose/target words, including bent-arm and fallback branches,
noncardinal yaw, tilted hulls and guarded zero directions. Frame records must
be supplied as original private views or independently authored compatible
data; no original animation/rest table is embedded in public code. The live
actor15 initializer, phase completion, histories and physical bootstrap remain
separate integration work.

All49 new tests pass. The full suite is1,974/1,985 in94.71s, with the same eleven
existing failure names. All251 module versions are regenerated in the three
HTML maps. Browser and Node agree on the new configuration/fade/pose cases in
both windows, and the400-step one-player/two-player sequence regression still
matches. The retained preview remains High1280×720 at11.05s, tick1105/frame221,
with four craft contacts, matching racer positions and49,152 matching water
heights (hash2879715165). Detailed riders, water and shoreline remain visible;
the child console is clear and the parent retains its existing favicon404.

A fresh read-only query used EVO X2's installed Ghidra12.1.4 and existing
analysis project. All2,113 exported instruction words across42 functions match
the private normalized ROM; the project's nine files remain byte-identical.
The inspected audio call graph has no direct shared-LCG call, but startup
audio reaches blocking message queues and scheduler resumption. This static
finding does not close asynchronous audio/scheduling effects or justify a
no-op replacement. No software was installed or purchased.

Complete live main/update and physical startup, resource consumers, actor15
admission, camera/current-object producers, full RNG/AI scheduling, result
transitions, mode11 scoring, venue/hardware checks and the eleven existing
course failures remain open. High-resolution presentation is retained. This
checkpoint is local; no original executable bytes/artwork are published and no
money was spent.

## Resource descriptor setup and actor15 completion — October 15, 2026

The two resource initializers reached by main configuration can now expand at
their source call positions. Their descriptor and selector writes use three
disjoint retained owners, alongside the existing HUD. Resource800DB330 is
distinct from profile801CB330; logical avatar IDs remain separate from the
shifted descriptor-template indices. Duplicate special IDs retain the last
matching selector, and lookup relocation preserves every repeated store and
unsigned overflow. Course sentinels retain descriptor prefixes, while present
entries preserve full cursor words separately from low24 descriptor addresses.
Duplicate course IDs update their slot map twice in order.

Expansion is explicit through expandResourceInitializers. The previous default
contract still returns required pending resource entries and needs no new
descriptor owners/tables. When expanded, neither initializer remains pending
for replay. These helpers perform no transfer, queue operation or RNG draw.
Later loading/decompression, post-load HUD fixups, physical body tune consumers
and final audio remain separate startup work. No loaded-resource count, return
value or original table is invented.

The complete reached resource leaves match2,308 original-instruction cases,
293,660 ordered operations and3,492,004 complete owner words. A fresh complete
main execution additionally seeds all three resource spans before each of1,350
actual runs. Both adapter options match2,700 complete canonical states over
9,388,752 owner values and664,225 ordered operations. Actual356,839 resource
stores and98,550 fade stores remain at their original call positions. Nine
unsupported count cases reject under both options; seven late-dependency
checks confirm atomicity, and default no-owner/no-table compatibility passes.

Actor15 now has its exact type/mode initializer and its own post-pose completion
branch. A nonnegative result advances the stored frame only in actual phase2
or3; other phases hold the frame. A negative result still queues the earlier
ordinary22 blend, while active blends bypass the actor-specific phase branch.
Phase650 is transient caller context, separate from simulation648 and action
completion records. Restoring an actor label does not reinitialize physical
points. The existing lifecycle's fourth argument is preserved, with phase in
the fifth context argument. Source comparisons match48 supported post-pose
records and two initializer type/mode recipes. This does not claim complete
immediate actor requests, pose blending, physical bootstrap or live admission;
the explicit frame/yaw provider and canonical phase latch still need wiring.

All38 added tests pass. The full suite is2,012/2,023 in97.87s with the same
eleven existing failure names. All252 module versions are refreshed in the
three HTML maps. Both browser windows match Node on prepared resource and
actor15 completion cases, and the400-step sequence regression still matches
for one and two players. The retained preview remains High1280×720 at11.05s,
tick1105/frame221, with matching racer positions and49,152 water heights
(hash2879715165). The child console is clear; the parent retains its favicon404.
This is another local checkpoint, with no original executable bytes/artwork
published and no money spent. Complete live startup and the other listed
gameplay, venue and hardware gaps remain open.

## Physical hull startup and separate-window recovery — October 15, 2026

The native Sunny Beach preview now prepares its twelve physical points from
the decoded packed16.16 starting transform. The source transforms its descending
local centroid separately, then refits the hull axes and horizontal yaw frame.
The new recipe preserves that order, source Float32 rounding, all66 pair rests
and coefficients, radius-dependent damping, extrema and four proxy centers.
A vertical forward requires the actual retained yaw values. Caller-owned local
shape and selected damping values remain explicit; unsupported degenerate
arithmetic rejects before installation.

The existing live hull owner receives the prepared points, center, frame,
rests, damping and cleared velocities. The initial physical rider is seeded
from the same prepared start. No packed matrix, raw body buffer or second set
of physical points is retained. Browser pose conversion and independently
authored hull geometry are adaptation choices. The subsequent hull solver is
not claimed to be bit-identical to all original simulation ticks, and actor,
target, resource and scene initialization remain separate integration work.

The authored verification helm now reads the HUD's next visible buoy and its
current physical center. Its steering target follows bounded lateral movement
and allows contact clearance; route geometry, physical buoys, controls mapping,
source judging and progress remain unchanged. It holds its established steering
correction through the final approach. This is driving policy, not the original
AI. A detached observation records the judge's actual sampled center before
the subsequent buoy-motion pass, so diagnostics no longer compare a preceding
decision against a later or static center.

Twenty recorded original-instruction executions match4,440 exact Float32
words, plus2,120 existing-owner world-unit conversion checks, with zero errors.
All66 focused hull/start/host/helm tests pass, including sixteen rider/class
finishes and exact30/60/144Hz comparisons. Additional ordinary-input probes
finish heavy Expert/Reverse time trials and Normal/Reverse two-player races
without misses or disqualification. These checks do not establish parity on
other venues or admit original AI/main startup into the live preview.

A browser rendering stall exposed a separate-window recovery gap: reopening
the surviving named Player2 document does not reload it, so its initial hello
was not repeated. Explicit reopening now requests an authenticated handshake
from that same document and rebuilds the private channel. A healthy view keeps
its port; stale controls and old generations remain rejected. The existing
finite loading timeout and paused fallback are retained. All20 focused window
transport and physical-presentation tests pass, including this reproduction.

The local browser reproduces that stale-link pause and reconnects the same
document without navigation, at the unchanged11.05s, hull tick1105 and water
frame221. The new channel advances from generation1 to2 and returns both views
to High1280x720. The physical rider poses and craft positions agree in both
windows, with zero misses and no console errors. The four recorded craft
contacts and both impact values remain the same across recovery.

The full suite checks2,049 tests:2,038 pass, with the same eleven existing
course/wave/competition calibration failures. All255 module hashes are refreshed
in the three HTML maps. High-resolution craft, riders, water and scenery remain
the existing presentation. Complete parity and physical-controller/OS-window
sign-off remain open; no original executable bytes/artwork are published and
no money was spent.

## Online two-player extension — October 15, 2026

Version2.20.0 adds private online racing beyond the reference game's local
multiplayer. A host invite link and guest return code establish genuine WebRTC
data channels using free STUN. No paid relay, Worker, database or billing resource
was added. Networks requiring TURN remain unsupported; this is private invitation
play. Joining instructions and the connection limitations are documented in
[ONLINE-MULTIPLAYER.md](ONLINE-MULTIPLAYER.md).

The existing host simulation owns both riders, collisions, source water, buoy
judging, laps and results. The guest supplies bounded Player2 controls only and
renders its own detailed scene with local camera, graphics, audio, rumble and
keyboard/gamepad/touch preferences. It has no race/physics owner. The existing
versus rules exclude online results from solo worldwide scores, records, ghosts
and championship unlocks. Local layouts remain available.

The wire codec preserves detached signed16 source-water and Float32 surface/pose
arrays exactly, with bounded gzip, fragments, reassembly and validation. Active
snapshots are limited to20Hz with one in-flight capture; paused/results views
use1Hz. Input goes neutral after250ms. Missing heartbeat, loading failure or a
stopped peer pauses the host. Reconnection retains the actual paused state and
requires explicit resume; fresh invitations request a current descriptor.

All12 new online tests pass: exact modern/native snapshots and array detachment,
fragment ordering/duplicates/expiry, decompression limits, signal expiry/build/
session validation, Player2-only authority, descriptor/capability bounds, stale
input/generation rejection, paused traffic pacing, interruption state retention
and role-specific data channels. The full suite checks2,061 tests:2,050 pass,
with the same eleven existing gameplay calibration failures. The260 root module
hashes are refreshed across four HTML import maps.

Two isolated browser contexts established three real data channels. High graphics
rendered both full1280x720 views. Normal keyboard input moved only its assigned
rider. Both pause/resume controls agreed at21.016666666666755s, with identical
positions and all49,152 source-water heights (hash2881229044). A new invitation
retained that race in generation2; Restart created generation3. Online Dolphin
Park Free Ride loaded in a390px phone viewport, and its normal Auto throttle
control moved Player2. This is emulation, not physical-phone certification.

The optional native Sunny preview also rendered both physical riders and the
59-node source buoy presentation, with exact host/guest positions and source
water at1.03s, hull tick103/water frame20 (hash2102279823). Evo X2's installed
Chrome155 and Node24 then provided a real second-computer peer on the same LAN.
It received that physical scene and drove Player2 through normal controls;
both views paused at57.91s/water frame1158 with matching positions and source
water (hash2900909254). Suspending only that guest tab paused the host at73s.
Two subsequent host samples retained the same positions, time and water
(hash4144957531); reactivation restored readiness while preserving the pause.
Evo's headless software renderer required Low for responsive input; the separate
High1280x720 checks remain the graphics evidence. This does not establish
arbitrary WAN/NAT connectivity, physical-controller support or complete original
gameplay parity. Only favicon404s appeared in the valid desktop browser flows;
no original executable bytes/artwork were added and no money was spent.

## Source launch phase coupling — October 15, 2026 (integration in progress)

The physical adapter now accepts the actual signed launch phase650 separately
from simulation648. It captures that word with each five-tick control frame and
passes it to rider pose completion. The existing action-source phase can supply
the same value; conflicting writers reject before controls or physics change.
An active unblended starting actor15 requires this explicit phase. Simulation1
can run hull physics with muted engine input while phase0/1 holds the animation;
phase2/3 releases its advancement. No browser phase is substituted.

The actual ordinary outer caller completes the physical riders before the
launch controller and the later i1 race-status update. A read-only Ghidra query
on Evo X2 matches5,426 instruction words in five existing scheduling functions,
with all nine project files unchanged. Its analyzed program lacks a function
at the requested9345C entry; that omission was recorded without creating or
reanalyzing it. Separate original-instruction checks cover3,072 prepared
physical-scheduling cases and eight prepared launch sequences for four modes
with one/two players. Controller, individual hull/pose, primary progress,
graphics, camera/audio/OS and other overlay entries remain explicit boundaries.

The existing canonical countdown and status implementations match all3,375
retained words/scene fields across890 recorded frames, including launch-power
writes and cue order, with zero differences. All eight new phase tests and all
84 affected checks pass, including shared two-rider completion and exact
30/60/144Hz comparisons. The full suite checks2,069 tests:2,058 pass, with the
same eleven existing calibration failures. No assertion was relaxed.

This is local integration work. The normal native preview still begins with
actor22 after its browser countdown. Installing equivalent high-resolution
starting artwork and connecting the verified sequence to the live shared race
owner remain pending; these checks do not establish complete startup or
gameplay parity.

## Physical starting-pose provider — October 15, 2026 (local integration)

The lifecycle can now evaluate actor15 through the reconstructed numeric
evaluator using eighteen explicitly supplied selected records. The bridge
reads the current physical hull and four separately supplied retained yaw
words, selects the requested descriptor7 frame, and converts its nineteen
body plus six auxiliary goals to world units once. It owns no animation clock,
frame cache or source scene. It does not resize the selected anatomy.

Optional startup seeds the actual25 physical positions from evaluated frame56,
clears their stored deltas, and installs actor15/frame56, its exact19 point
types and physical mode1. Initialization runs no auxiliary or body solve.
Independent rest lengths and circle radius remain their existing inputs;
they are not inferred from the launch pose. Subsequent pose completion and
the outgoing ordinary-riding blend use the existing lifecycle and once-per-
frame physical solvers. This is the pose/type portion of startup, not the
whole original retained-body initializer.

Private read-only ROM sampling now covers all85 actual descriptor7 frames
both level and tilted:170 cases,27,540 pose words and12,750 mapped point
words match the numeric implementation exactly. The bridge's12,750 converted
world values also match. Original animation records and derived samples stay
private; none are included in the public provider or its authored fixtures.

All eleven new provider/physical tests and118 affected checks pass, covering
held/advancing phases, the real outgoing blend, zero initialization solves,
independent rest mechanics, two riders and exact30/60/144Hz physical outcomes.
The full suite checks2,080 tests:2,069 pass, with the same eleven existing
calibration failures and no relaxed assertions. Equivalent high-resolution
start artwork and live shared countdown ownership remain pending. The normal
native host still starts22; this local checkpoint is not a new live release.

The refreshed261-module browser build renders at High1280x720 in the ordinary
game and optional native preview. Its existing native recovery inspection
reaches5.8s/hull tick580 with116 body and116 auxiliary solves and the detailed
physical rider visible. Only a favicon404 appears; no game exception was
observed. This checks the current presentation after integration, not new
high-resolution actor15 artwork or original-ROM gameplay equivalence.

## Detailed rider launch geometry — October 15, 2026 (local integration)

The physical lifecycle can now create newly authored boarding records for
ordinary starting frames56..84 from the detailed rider's neutral anatomy and
steering supports. It reads the actual prepared hull's retained yaw owner.
The recovered hybrid placement, three shoulder passes, arm IK and point
mapping evaluate those records with twelve explicit modern anatomical
dimensions. The original fixed-dimension mode remains the default numeric
API and still matches both170 original-record and130 synthetic comparisons.
The adapted mode does not assert original pose-coordinate or body-force
calibration equality.

The authored rider boards from the rear, lifts its legs clear of the larger
modern saddle/foot decks, and settles into normal riding. The final target
pose matches the neutral model within5mm in the tested level scene. A rendered
inspection exposed seat intersection in the initial authored path; that path
was corrected before the final checks. No original animation records or mesh
assets were included. Record generation owns no private frame clock, phase,
input processing or blend. The separate physical rest lengths, grip-circle
radius and histories keep their existing owners.

All eleven new detailed-launch checks and129 affected checks pass. Real
physical holds, advancement and the outgoing ordinary blend agree exactly
across30/60/144Hz for all four numeric rider profiles; two starting riders
observe the same phase until the after-water boundary. The full suite checks
2,091 tests:2,080 pass, with the same eleven existing calibration failures.
The original calibration assertions were not relaxed.

An isolated local1280x720 inspection uses the actual detailed craft/rider,
physical points and renderer:198,068 triangles, nine sampled physical frames,
equal body/auxiliary solve counts, and a completed actor15-to22 blend, with
no console errors or warnings. Its prepared phase inputs are a test fixture;
it is not a live race/countdown claim. The temporary inspection page/helper
were moved out of the public source after checking. The normal native host
still begins22 after its browser countdown; connecting the verified canonical
race/HUD/i1 sequence and migrating live power ownership remain the next work.
This checkpoint is local, not a new live release.

## Live shared native start — October 15, 2026 (v2.21.0)

This supersedes the earlier pending live-start notes. The opt-in native Sunny
Beach Time trial/Two-player host now initializes actor15/frame56 and one
canonical race/HUD/i1 owner. The actual physical adapter reads that owner's
simulation648 and phase650. Each logical frame completes five hull/rider ticks,
water, primary judging, and the primary/floating object pass before countdown
and prestart-status operations run. The normal simulation1 prestart evolves
water and physical history with muted engine input. The source phase2 release
opens the record clocks; its following physical frame advances the starting
pose. There is no independent browser countdown epoch for this path.

Power, misses and the overlapping source-judge fields are read/write views of
that canonical owner. A source boost write therefore reaches the actual next
physical control frame, and a genuine wrong-side crossing increments the miss
counter once. Per-racer lap/total milliseconds use the factored original clock
block; the HUD, online view, lap/finish times and versus DQ result read those
record clocks. Physical/presentation time continues to drive waves and scenery.
Finished/DQ records stop independently; pause stops both physical and canonical
owners. Separate windows and online snapshots carry bounded labels/cues and
display values, with no simulation owner transferred.

The live runtime entry matches all3,375 retained words/scene fields and ordered
cues against eight prepared original-instruction sequences,890 total frames.
Factoring the clock preserves the existing full primary-progress comparison:
5,568 cases/1,236,096 record words and17 independent review cases/3,774 words.
These are bounded prepared comparisons; physics, original graphics/audio/OS,
other overlay calls and several enclosing handlers remain declared boundaries.

Thirteen new live-start checks cover actual start-edge sampling, per-player
boosts/clocks, one-count misses, independent finish/DQ, pause, exact30/60/144Hz
state and online codec/interpolation. The final focused start/online selection
passes25 checks. The inspection helm waits until the boost window closes and
continues following a buoy's actual displacement near its crossing plane.
Its sixteen real three-lap rider/class cases retain their existing zero/one
miss limits. The heavy Hard diagnostic moves from old browser-start row47 to
row29 under actual prestart water phasing; Expert remains row46. Both are
genuine wrong-side observations, not forgiven passes or a parity sign-off.
The final full suite checks2,104 tests:2,093 pass with exactly the same eleven
existing course-calibration failures. The new DQ display check uses an explicit
prepared record flag; it is not presented as an ordinary-input DQ playthrough.

An ordinary local keyboard start renders High1280x720, holds the stopwatch at
zero before GO and earns maximum power from a timed fresh throttle edge. Two
isolated local browsers then complete a real WebRTC start/restart. Both show
READY/3/2/1/GO, source boarding/riding poses and independent keyboard input.
Their differently timed edges produce power5 and3. Shared pause holds each
record at3.000s with exact host/guest positions and source water
(frame168/hash560161409); both views render High1280x720. Only favicon404s
appear. This adds local two-browser evidence; the earlier Evo X2 second-PC
check applies to v2.20.0, and arbitrary WAN/NAT/hardware coverage remains open.

Fresh browser memory still uses an explicit zero-word policy before the actual
startup writes, plus existing browser grid/progress initialization. It is not
proof of a cold-ROM memory image. Full primary reset/navigation/progress/result
integration, prestart judging, original AI, special outer states, remaining
venues/modes, source force calibration with modern anatomy, and the eleven
existing course-calibration failures remain unfinished. Default modern play,
worldwide solo scoring and the high-resolution artwork stay available. The
native inspection remains opt-in and excluded from competitive records.

To inspect the current native path, open `race.html?verify=1&nativePhysics=1`
and choose Sunny Beach, Venue conditions, Time trial or Two players. The
equivalent online host entry is `online.html?verify=1&nativePhysics=1`; its guest
needs only the normal invite flow. These remain reconstruction inspection
entries while the full objective is unfinished.

## Live source lap and race rules — October 15, 2026 (v2.22.0)

This replaces the v2.21 browser progress/lap initialization and its split
clock/judge/countdown schedule. The admitted Sunny Beach Time trial and
Two-player preview now loads the selected raw primary rows through the recovered
numeric initializer, runs the complete numeric race reset and startup HUD, then
calls the complete ordinary primary race update and all eight numeric HUD
consumers. The order is five physical hull/rider ticks, source camera/water,
primary scratch/progress/ranking/records and the ordered HUD consumers
(including countdown), primary/floating object motion, then numeric i1 status.
Prestart judging is active. There is no second browser lap judge or clock.

The initial finish crossing moves source lap0 to lap1 without awarding a
completed lap. The final completed race retains lap3 and three saved lap times;
its finish flag and reconciled record time own completion. Legal-lap/checkpoint
counters, delayed missed-buoy power loss/retirement, allowed-region warnings,
wrong-direction counters, versus order/gaps and numeric record saving share the
same canonical race/HUD owner. Source results/menu transition callees are still
pending dependencies; the high-resolution host consumes the resulting finish
or DQ status and stops the race. In-memory numeric record insertion is covered;
native record-book persistence is not implemented.

Water and HUD consumers now read the same canonical camera eye, target and
basis fields. Only projection metadata remains outside those admitted fields.
The ordinary body view reads the actual hull center, its pre-hull retained
center, completed actor/mode and impacts. The source dry-contact counter16D0 is
separate from the airborne/no-contact counter16DC. The field named B98 by the
speed overlay receives applied jet force, not displacement speed. High-resolution
boundary countdown and wrong-way text use the source fields, including in
Player2's online/separate view. Equal simultaneous source finishes display a tie.

New source evidence includes the EVO X2 read-only Ghidra query of six existing
functions: 3,834 instruction words match the supplied ROM and all nine project
files remain unchanged. The complete original sine initialization matches all
4,096 output words; using ordinary Math.sin would differ at 413 stores.
Row loading plus primary initialization match 32 bounded cases/58,890 words,
including preserved unused words and all source types. This found and corrected
the Dolphin Park type26 route group. The dry-contact/posture helpers match
1,944/33 isolated original-instruction cases.

Fifty-two actual browser-host physical/camera/object samples, spanning starts,
passes, a miss, lap changes and finishes, match the original whole ordinary
race routine and all eight numeric overlays: 163,020 final canonical words,
ordered effects and overlay stores agree. This compares bounded numeric calls
on supplied physical inputs, not original-game trajectories or full boot.

The full suite checks 2,117 tests: 2,106 pass, with the same eleven existing
course-calibration failures. All sixteen native rider/class three-lap runs and
four native two-player class matches retain their previous zero/one-miss limits;
the heavy profile's Hard/Expert diagnostic rows remain29/46. The prepared recoil
test now supplies a complete lap1/row2 numeric state; its exact physical contact,
moving-versus-static side decision and buoy-motion assertions are preserved.
Online scalar display values canonicalize signed zero at serialization; physical
float words, hull/rider arrays and source water data are unchanged.

A fresh ordinary keyboard browser run shows source lap0 then lap1, zero
pre-GO record time, a timed start boost, one genuine miss with delayed power
loss, and a paused 8.200-second record at source frame220. Its 204 observed
frames render High1280x720. Two isolated local browsers establish actual WebRTC,
start with independent controls, enter lap1 and pause with identical positions,
speeds, 4.600-second record clocks and source water frame200/hash2595691067.
Both views render High1280x720. This is local two-browser evidence; it does not
extend the earlier v2.20 second-PC result to arbitrary WAN/NAT or hardware.

Fresh web memory is an explicit policy: zero unwritten words, three confirmed
readonly numeric HUD constants and empty selected-course record times, followed
by the actual reset/startup writes. Physical grid placement still uses the
browser's prepared grid; this is not a source cold-boot/EEPROM claim. Original
AI, remaining venues/modes, result/menu transitions, record persistence, shared
RNG/camera special branches, source force calibration with modern anatomy and
the eleven existing calibration failures remain unfinished. Default modern
play, global solo scoring and the high-resolution assets remain available.
The native preview stays opt-in and excluded from competitive records.

## Source physical starting grid — October 15, 2026 (v2.23.0)

The admitted Sunny Beach native Time trial and two-player previews now consume
the recovered grid placement and packed16.16 transform through the physical
hull initializer. The one canonical race owner selects the grid before the
water follow lag, previous craft positions or starting rider are created.
The high-resolution renderer receives the resulting physical pose. Its visible
gate art cannot move that spawn. Reverse uses its selected source finish row
and forward direction; the two players retain the source lateral offsets.

Grid placement reads the initialized tangent78/7C. The judging consumer's
color-aligned80/84 fields are distinct and are zero at the finish. The source
computer-profile selector reads canonical scene half4964 and simulation state;
fresh web play explicitly initializes the halfword to zero. Packed matrices
are consumed directly, without converting the decoded basis back into Euler
angles and packing it again. No second mutable physical or camera owner is added.

Fifty-two bounded startup cases cover all four Sunny classes, all four rider
choices, one/two players and retained profile-selection branches. Original
numeric grid, matrix and physical-start routines match 1,664 packed/decoded
words and 6,760 live physical field words. Their original numeric execution
uses 571,819 counted instructions under the retained interpreter convention.
Prior frozen evidence is unchanged. Authored local shape, prepared actor data
and the documented arithmetic boundaries remain explicit inputs; this is not
an original cold-boot, animation-asset or whole-trajectory equivalence claim.

The recovery inspection now steers toward the actual moving buoy and damps yaw
over the logical control interval. The ordinary inspection helm anticipates
150ms of measured hull drift while steering, with a 3m buoy-clearance target.
Neither changes physical state, buoys, progress or the judge. The existing zero/one-miss acceptance limits and
severe-impact recovery assertions remain in force.

The final complete suite checks 2,120 tests: 2,109 pass, with exactly the same
eleven existing failures. All sixteen native rider/class three-lap runs and
four native two-player class matches pass, including the unchanged cadence,
collision/recovery and zero/one-miss assertions.

An ordinary solo keyboard run enters source lap1 and pauses at frame 220 with
8.200s on the source record clock. Two isolated local browsers establish actual
WebRTC, accept independent throttle inputs and pause at frame 200 with matching
positions, speeds, 4.600s clocks and source water hash4048089368. Solo and both
online views render High1280x720; a running online view was visually checked.
Only the development favicon returns 404. These are local browser checks, not
an additional second-computer/WAN compatibility claim.

The full gameplay objective remains active: original AI, other native venues
and modes, result/menu bodies, persistence, shared RNG/camera special branches,
force calibration with the authored anatomy and the existing course failures
still require work. Native preview admission and competitive-record exclusion
remain unchanged; global solo scoring and online two-player play stay available.

## Shoreline surface overlap — October 15, 2026 (v2.24.0)

A reported online view showed striped sand, flat pale patches and a broken
boundary through the water. The course renderer drew the finite contact floors
as a second mesh over the photographic terrain, which already sampled those
same floors. Coplanar surfaces with different materials competed in the depth
buffer, including the underwater refraction image.

The textured terrain now owns that visible surface. The duplicate floor draw
is removed; source floor arrays, physical contacts, height queries and source
water simulation are unchanged. Glacier's separate ice sheets and vertical
contact walls retain their own rendering. Sunny retains all 231 contact
triangles while removing 149,887 duplicated tessellated render triangles.

Fresh local online browsers establish WebRTC, drive and steer independently,
and render clean shore and seabed views at High1280x720 on both players. The
moving view was visually checked; only the development favicon returns404.
This fixes rendering overlap without reducing water or terrain resolution.
The 48 focused surface/contact checks pass. The complete suite remains at
2,109 passes out of 2,120 tests, with the same eleven existing failures.

## Source result entry — October 15, 2026 (prepared integration)

The complete numeric result-entry routines6DCC,6FE0 and7394 now have an
explicit implementation and a canonical status entry that expands the chosen
routine at its original call site. They preserve previous/current game states,
initialization flags, result delays, selected-body16C8 timing, signed cup
qualification flags, winner counters, menu choices and external-call order.
The four cup qualification halfwords use the existing extended profile owner;
there is no separate copy of the flags. Subsequent winner-HUD writes follow the
transition, including source ties and disqualifications.

Private execution of the original overlay instructions matches1,200 prepared
entry cases and96 combined finish-status/entry cases:23,731 ordered operations
and the resulting canonical scene, race, HUD, profile and overlay storage.
All57 non-stack store sites in the three entry routines are reached. The
416-instruction source interval has412 visited instruction addresses across
these cases; this is bounded numeric evidence with explicit prepared inputs.
Audio, fade and menu-widget callees remain ordered dependencies. Six new tests
cover finish/tie/DQ ownership, timing, signed qualification and atomic failure.
All450 selected native race regression tests pass, including driven three-lap
and render-cadence checks. The previously recorded full-suite baseline above
is separate from this selected regression run.

This checkpoint is not connected to the live race scheduler or published as a
new gameplay release. The next result updates63B4/6550/6B00 also handle record
initials and save/menu routing. Those consumers, their canonical storage and
zero-simulation scheduling must be integrated before replacing the current
live result flow. Native persistence, other venues/modes, original AI and the
remaining whole-game parity items above remain incomplete.

## Source result updates — October 15, 2026 (prepared integration)

The original DQ, finish and tie update bodies63B4/6550/6B00 now have numeric
implementations against the shared state. They retain the source delay and
button gates, signed timer wrapping, cup-round updates, three-byte record
initials and terminator, normal/reverse/best-lap/stunt record destinations,
unlock bit, and ordered requests to persistence and menu routines.

The optional saveWordsB280 owner ends atB308, before the separate wave rows
andB32C metadata. Byte writes preserve adjacent data in the canonical record
and save spans. A later best-lap flag read observes earlier name stores even
in an explicit prepared memory-alias case. No second record book is created.

An explicit transition-expansion option runs numeric7570, the fade property
initializer and its reached slot reset at the call site, before the caller's
later HUD test. This matters when starting a fade resets the completion flag:
the same call must not also enter the next menu based on the old flag.

Private original-instruction comparison matches3,170 prepared cases, including
192 with those real nested transition/fade bodies. All481 instructions and all
26 non-stack store sites in the three update bodies are reached. The comparison
checks ordered operations and resulting scene/race/HUD/profile/save storage.
Seven new focused tests and457 selected native regression tests pass; the final
memory-read ordering adjustment also passes the original comparison and28
focused checks. These checks do not claim a new full-suite baseline.

A fresh read-only EVO X2 Ghidra query confirms the result-pose producer in
5DE24; all2,780 exported instruction words match the provided ROM and all nine
analysis-project files retain their hashes. A separate save-routine query
reported a missing analyzed function and was not counted as successful merely
because the headless process exited zero. The existing database was preserved.

This remains local prepared integration. Original77F5C unfinished-racer time
estimation, further fade/menu/save callees, the live16C8 result-pose producer,
zero-simulation scheduling and actual durable record storage still require
integration. The public game remains on the verifiedv2.24 shoreline release;
the full gameplay parity objective remains incomplete.

## Source rider result selection — October 15, 2026 (prepared integration)

The result-code subsection of5DE24 now preserves the retained16C8 gate,
finish-before-retirement priority, record and mode11 choices, signed cup
qualification tests, overlapping effect/solo/versus tables, and ordered writes
to both selected bodies. Ties write the secondary body before the primary;
aliased selected slots retain both writes. A solo table result4 is stored
before its source overwrite to3. The canonical state exposes a read-only view
and bypasses this subsection for actual simulation0, as the original caller
does. No second body or race owner is created.

The complete numeric5DD04 support scan uses actual hull point90 and datum2458:
start ten native units below the point, check floor then box, descend sixteen
units after misses, and stop at the strict lower bound. Its reached geometry
query returns remain explicit inputs. The original7F448/7FAE4 geometry
consumers are not replaced with rendered terrain or reconstructed contact
normals. Their exact integration remains required before admitting live use.

Private execution of the original selector gate and nested5DD04 matches2,984
prepared cases,2,783 ordered operations and all four resulting body words.
All21 result-code store sites are reached. There are557 observed geometry
queries; their positions, order and return consumption match. The comparison
also checks every case through the canonical view and verifies input owners
remain unchanged. The preceding motion arithmetic is an explicit prepared
carry, with its gate-delay store checked separately; the whole5DE24 actor is
not claimed. All48 focused body/state/result regression tests pass.

This checkpoint is local and unpublished. Body16C8 lifetime and actor-phase
scheduling, the exact geometry query producers, source result/menu scheduling
and persistence remain unfinished. The live site remainsv2.24.0; full gameplay
parity remains incomplete.

## Source retirement support queries — October 15, 2026 (prepared integration)

Numeric7F448 floor and7FAE4 box queries now consume original-layout native
geometry directly. The floor query retains truncated coordinate selection,
signed grid bounds, axis order and masked shifts, original cell/list offsets,
one-based candidate order, three clip predicates, and inclusive0..16 depth.
Its first accepted surface returns immediately even at zero depth. Runtime
boxes are visited last-to-first, preserve their original nonorthogonal axes,
exclude each far interval endpoint, and retain earlier faces on distance ties.
Returned normals preserve float32 arithmetic and signed zero.

The5DD04 retirement scan can now execute these queries against supplied
geometry. The prepared-return input remains available for bounded audits;
ambiguous inputs supplying both forms reject. This removes the query-return
boundary when actual geometry is supplied, without substituting render meshes
or reconstructed collision bins for the source records.

Private execution of both complete original query functions matches2,606
cases, including924 Sunny Beach record checks and162 original ramp-profile
boundary checks. Penetration and normal float32 bits match, including zero-depth
hits and negative-zero normals. All seven output-store sites are reached.
A separate comparison executes complete5DD04 with actual nested7F448/7FAE4:
967cases and5,125query calls match scan results, positions, order and returns.
No geometry query return is intercepted in that composed comparison.

All53 focused support/body/state/result tests pass. The earlier2,984result
selector cases still match. These are numeric consumer and integration checks
against prepared geometry owners, not evidence of original course bootstrap
or live retirement animation. Live geometry installation, body16C8 lifetime,
descending actor scheduling and remaining source result/menu flow still need
integration. The public game remainsv2.24.0 and full parity is incomplete.

## Local rider result ownership — October 15, 2026

The ordinary Sunny Time/Versus runtime now installs the verified floor-query
records and invokes result selection inside each descending actor phase, after
the completed hull summary and before its decision/pose. The query uses actual
hull point0 and the current water datum. There is no parallel body16C8 owner:
the existing lifecycle selectedActor field is that source word. Cross-player
writes reach the following rider before its decision, and all operations are
validated before any owner changes. The selected code persists across frames.

The original62F44..631F0 initialization also exposes a previous gap:1446 starts
at10, not the generic lifecycle's disabled-1. The native race start now installs
that delay. It holds while16C8 is negative and the existing eligible actor
branch consumes it after selection. Generic prepared recovery fixtures retain
their explicit caller-selected timing.

Four local runtime tests cover partial/paused calls, actual-point retirement,
descending tie writes before judging, retained codes and atomic invalid-target
rejection. A private comparison captures15 actual actor boundaries following
130ordinary frames with explicitly prepared finish/DQ flags. The original
selector and complete nested5DD04/7F448/7FAE4 match ordered operations and final
body words, including six actual geometry queries. These fixtures establish
integration ordering, not driven-finish or complete post-race replay fidelity.

The selected native regression run passes670tests. It began before the final
startup-delay correction;38 focused lifecycle/start/result tests pass after
that correction, and the captured original-instruction comparison was repeated
on the final code. This is separate from the earlier full-game suite baseline.

This checkpoint is local and unpublished. The browser still stops ordinary
updates on its result screen; a finish first detected by later primary judging
does not yet receive the next source actor phase. Continuing the original
result schedule, equivalent result-actor poses/completion, zero-simulation
dispatch, fades/menus and persistence remain required. Full gameplay parity
and the complete native result flow remain unfinished.

## Result rider lifecycle and numeric poses — October 15, 2026

The existing rider lifecycle now handles the six result actors' original
initializers and post-pose transitions. Successful entry applies each actor's
actual nineteen point types. A negative evaluator return outside an active
blend clears the selection countdown while retaining the selected result code
and current animation frame. Actor5 additionally clears the recovery input
lock and requests actor7/frame0 with float32 .05/hold1; the other result actors
request ordinary22/frame0 with .15/hold0. Active blends skip these consumers.
The shared request owner still controls initialization, frame holds and blends.

The shared selected-record pose evaluator now includes the six original result
descriptors, with counts89/100/54/79/40/54 and their terminal/clamp behavior.
Actors1/4/6 use yaw-relative free arms,2/3 retain the second fitted arm, and5
uses full-hull decoding without shoulder fitting or head replacement. Physical
nineteen-point and six auxiliary goals use the existing original numeric mapping.
No pose clock, original animation assets or second body owner is introduced.

Original-instruction comparison matches720 prepared post-pose cases and18
initializer cases. A separate comparison executes original5CD24 dispatch,
54130/52E90 evaluation, reached helpers and both25-point copy routines against
144 synthetic selected-record/body cases: all23,328 pose words and10,800 target
words match exactly, including terminal frames, four rider slots and tilted
noncardinal hulls. Only the existing float32 square-root boundary is intercepted.
The shared actor15 evaluator still matches its prior130 original-code fixtures.
All259 selected rider/lifecycle/authored-rig/result-owner regression tests pass.

This is a local, unpublished numeric implementation. The lifecycle's browser
pose provider still needs equivalent high-resolution result motion records;
it must not replace them with a neutral pose or reuse startup artwork as a
finished result animation. Normal driven finishes, post-result world updates,
original61708 result-input handling, result/menu scheduling, fades and persistent
records remain unfinished. Publicv2.24.0 and the broader parity gaps are unchanged.

## Detailed result motion integration — October 15, 2026

The native lifecycle now supplies high-resolution record poses for all six
result actors. Private inspection of all416 original motion frames established
the distinct two-hand/one-hand celebrations, slump, low crouch, backward fall
and disappointed gesture. The public implementation contains newly authored
angular/root keyframes on the existing detailed anatomy, with original frame
counts and numeric evaluation. It includes no original animation record arrays.
These are authored motion interpretations, not coordinate-exact original art.

Start and result providers share record decoding, anatomy measurement and
world conversion. Current/pending result poses use the existing held blend;
one auxiliary solve and one actual nineteen-point solve follow each active
logical frame. Freed hands do not drag the craft's auxiliary handlebar goals.
Actor5 follows the full hull without reading retained yaw and returns through
the actual7 remount path. The crouch is adapted to the taller modern saddle:
the rider moves above the rear step before lowering and rises before returning.
This explicit geometry policy prevents the initial visible saddle intersection.

Ten new tests cover all416 authored samples, endpoint dimensions, fixed craft
supports, distinct gestures, final rest alignment, pure seeking, the source
delay/held blend, all six physical sequences for all four riders, and30/60/144Hz equality.
The selected rider/lifecycle suite passes269 tests;34 additional ordinary
race/grid/host/world regression tests pass. Prepared result selections are
used here; they are not evidence of normal driven-finish scheduling.

A fresh local browser inspected the actual detailed Blender rider and craft
at1500x900 using default result providers and actual physical solves. All six
completed without console warnings/errors, returned to22, and only5 entered7.
Body and auxiliary solve counts agreed for every sequence. The inspection is
a separate studio scene, not a full-game results screen or original-trajectory
comparison. Final module hashes and screenshots are retained privately.

This checkpoint remains local and unpublished. Browser race results still
stop normal world updates; source61708 result-input handling and the original
result/menu update sequence, fades, unfinished-place estimation and persistence
remain open. The broader full-game parity objective is still incomplete.

## Result input handoff — October 15, 2026

The adapter can now run the original human-input dispatch decision against
the actual rider lifecycle's signed1446 countdown. Zero still polls human
input; negative values invoke an explicitly supplied source AI producer.
Original61708 calls616B0, which runs80400 then common61184 and skips the final
human stick curve. Actor number, finished record, scene phase and computer
physical profile do not select this branch. No parallel finish timer is added.

The explicit sourceAIInput option requires a physical lifecycle and human
default origin. It polls only the selected producer, captures the prior
controls and scene at the logical boundary, transports raw AI axes/power/16f4
through the existing consumers, and retains held-button/direction history.
The source input latch samples once before physical preparation and all five
hull ticks. Conflicting caller origins reject. The human identity and fixed
physical profile survive takeover. Existing prepared callers without this
option retain their explicit dispatch; a missing AI context is not fabricated.

Private execution of original61708/616B0/61184/61644 matches148 prepared cases
(22,762 executed instructions under the existing evaluator's counting rule).
These cover signed countdown boundaries, two racer slots, mapped controller
records, missing controllers, result/remount/riding actors, scene gates and
crash muting. The80400 output is prepared at its call boundary; this audit
does not claim original AI execution. Original six-byte device-copy tails
were also checked privately; the browser still supplies adapted controls.

Tests connect the actual reconstructed AI driver in both phase3 and phase4,
and all six complete physical result sequences switch on the following frame
without polling a human device. Button releases and one input sample per
frame are checked. Celebration and fall/remount control history and physical
state agree at30/60/144Hz at the same exact simulation instant. The cadence
fixture now clips its final render interval, avoiding a comparison against
a partially begun next frame. All560 selected control/AI/rider/lifecycle/
adapter/host/world/grid/ordinary-result regression tests pass.

A fresh local browser also ran all six actual physical result sequences and
verified the input switch using the checked source module hashes. It reported
no console errors or warnings. This was a prepared numeric browser probe,
not a full-game UI or driven-finish replay. The first probe lacked the required
retained yaw from prepared hull startup; the final probe uses that actual owner.

This checkpoint remains unpublished. The normal host still needs complete
retained AI context/history initialization and the original result/world/menu
schedule before enabling this option. Shared RNG/camera context, zero-simulation
dispatch, fades, unfinished-place estimation and persistent native records
remain open, alongside the broader gameplay parity gaps. Livev2.24.0 is unchanged.

## Unfinished-rider result estimates — October 15, 2026

Original77F5C is now reconstructed in the primary standings module and exposed
through the canonical race state. It sets the actual1FD4 one-shot latch,
projects the rider against the previous primary node, walks initialized A0
links and length88 fields through the final finish, and estimates remaining
time with original float32 operation order and place-dependent speed. It then
clamps times in slot order, performs the original nested strict place swaps,
and copies place words to26C0 on nonzero courses. Finished/DQ slots retain
their places but still receive the source time clamp. No finish flag is invented.

prepareNativeRaceResultStageUpdate can expand the77F5C call with explicit
expandEstimates:true and actual primary records/body positions, committing
its writes at the existing finish/DQ caller boundary. Default dependency
recipes remain unchanged. Repeated calls skip without requiring geometry.
The same canonical latch stops subsequent primary clock updates.

Private whole-routine execution matches220 prepared cases,35,672 counted
instructions, all ordered writes and all1,693 final race words per case.
There are no intercepted arithmetic callees. Seven tests cover remaining laps,
projection clamps, strict ties, place swaps, DQ/finish exclusions, one-shot
reads, source stage expansion, initialization from all four Sunny classes and
the canonical clock consumer. All174 selected primary/state/result/host/world
regression tests pass. These are prepared numeric cases, not a driven finish.
Malformed walks, nonfinite arithmetic and out-of-range signed conversions
reject without committing state; no substitute estimate is produced.

The normal host still needs its complete result/world/menu schedule, fades,
AI context and persistence before this can be enabled through ordinary play.
This checkpoint is local and unpublished; the broader parity goal remains open.
The user additionally requested the original music from the existing locally
provided Wave Race64 ROM; soundtrack extraction and integration are now active.


## Original soundtrack files (v2.25.0)

The supplied USA Rev1 ROM's sequence and instrument banks were extracted
privately and rendered offline on EVO X2 with seq64 and FluidSynth. Fifteen
standalone stereo MP3 files provide the title theme, nine course themes and
five finish/retirement cues. The browser downloads only the selected music
when Background music or Preview music is enabled. Course/result selection
works in the race view and the online guest; host playback uses the race view.
Pause/mute preserves playback position, new races reset it, stereo/mono/
headphones use the existing sound options, and only two decoded tracks stay
cached. The original sequence loop boundaries preserve introductions.

This uses the original melodies and instrument samples, rendered through
MIDI/SoundFont synthesis: envelopes and reverb approximate the N64 audio
engine. It is not a bit-exact hardware recording. Final-lap variants remain
future work. The public assets contain MP3s, hashes and provenance; the ROM,
raw banks, MIDI sequences and extraction tools remain private. No paid service
or soundtrack download was used.

Validation: all fifteen files decode as stereo in Chrome with exact manifest
durations. The 28 focused music, audio and online tests pass. The full suite
(before two additional focused tests) reports 2,172 passes and the same eleven
pre-existing course/gameplay failures out of 2,183 tests. Native result work
above remains opt-in; this release does not claim complete gameplay parity.


## Original fade progression - October 16, 2026

The earlier native result checkpoints through unfinished-rider estimates were
included as source in published v2.25.0. Their historical unpublished notes
above describe the state at each checkpoint; ordinary result scheduling remains
unfinished and those routines are still opt-in.

New native-race-fade-update.js reconstructs 1E71A8 and the numeric state changes
of 7280/73A0/74BC/76C0. prepareNativeRaceFadeAdvance commits them to the existing
canonical HUD owner, preserving signed halfword wrap, alpha float32 ordering,
curtain position thresholds, alternating frame selection and the original
one-update completion pulse. Completion restores the supplied nine-word
template before writing the pulse. A following inactive update clears it.
Unknown types preserve storage except for that required pulse clear.

The existing EVO X2 Ghidra export of 800922E4 establishes its call after CPU
world/overlay updates and before the separate display/results dispatcher.
It must not be advanced from interpolated rendering. The curtain projection/
view matrix calls (including their HUD8A34 perspective-normal write) and sound
remain explicit ordered effects requiring their own consumers. Their execution
and high-resolution curtain rendering are not claimed by this checkpoint.
Nonfinite division inputs reject without mutating caller state.

Private execution of the original routine and all four numeric callees matches
655 prepared cases, 31,222 counted instructions, 2,671 ordered writes and all
944,510 compared HUD words. Graphics matrix and audio calls are intercepted
boundaries with exact argument comparison. Canonical transport also preserves
all other state owners and supplied inputs. Five new tests cover complete fade
sequences, the real tie-result completion consumer, curtain thresholds/calls,
signed wrap and atomic invalid-input rejection. All 124 selected fade, main,
state, result, launch, host and world regression tests pass.

This fade checkpoint is local. Complete normal post-race world/menu scheduling,
source AI initialization/history, presentation effects and native persistence
remain required before normal driven finishes can use the full source sequence.

## Original simulation0 outer updates - October 16, 2026

The ordinary native world now separates its outer clock from actual hull ticks.
Shared simulation0 continues descending input sampling, control preparation and
rider summaries while skipping the five contact/hull passes and physical rider
solves. Motion-summary fields retain their prior values, as in source65C18.
The six result actors retain their lifecycle and physical pose, then resume
without skipping an animation solve. Standalone adapters also support fractional
and deferred inactive frames. Host pause (active:false) still holds all clocks.

Water still selects camera patches in player2/player1 order, but suppresses
forcing and evolution during simulation0. This exposes the required ordinary
world capability; it does not enable complete normal post-race UI scheduling,
scripted main21, or exact source camera trajectories. Complete retained AI
history/shared RNG, fade presentation consumers and menu/reset sequencing remain
required before enabling the original result sequence in ordinary driven races.

A fresh read-only Ghidra query on EVO X2 verified the gates in665B0,65C18,
5DE24,50F8C and51238 without changing the nine project files. Private execution
of the original665B0 caller through its camera-call boundary covers80 cases and
7,483 counted instructions. Inputs/preparation/contact/hull/summary callees are
explicit intercepted boundaries. All40 ordinary-world comparisons match caller
order and gating; the40 scripted main21 cases are excluded from browser parity.
Input call types are normalized for order comparison, not proof of AI outputs.

New tests cover active/inactive/resumed physics, 30/60/144Hz equality, standalone
and deferred frames, and all six result actors. An isolated Chrome numeric probe
also froze and resumed all six actors without console errors. This is numeric
browser verification, not a completed visual result-flow test. The full run
reported2,182 passes out of2,194, the eleven existing course/gameplay failures,
and one obsolete assertion requiring simulation0 to reject. That assertion was
updated to verify the new zero-hull schedule and its contact suite passed9/9.
The final focused regression run passes70/70, including the added deferred-frame test.
This checkpoint remains local and does not change the published soundtrack.

## Post-adjudication object-motion gate - October 16, 2026

The canonical launch runtime now exposes its actual signed activity624 value as
the object-motion gate. The host reads that gate after ordinary adjudication,
before the shared primary/generic motion pass. Simulation648 is independent:
simulation0 can retain every hull and physical rider while free objects continue
moving. An activity value other than -1 suppresses both object motion families.
Both bridges still observe each outer frame, so their scheduling stays aligned
when motion resumes. Explicit preview motion switches and host pause retain
their existing behavior. This does not add motion for unsupported object kinds.

A fresh read-only EVO X2 Ghidra query of6E3A8,7DBC0,6E0F4 and8E794 left all nine
project files unchanged. Original6E3A8 execution covers150 prepared cases and
2,590 counted instructions, with empty course effect arrays and explicit callee
boundaries. The intercepted79528 changes activity to test that the caller reads
the post-adjudication value. All100 mode0/1 cases match20 distinct actual host
configurations;50 mode11 cases remain outside the admitted native host modes.
This verifies schedule gates, not the intercepted callee bodies or full original
trajectories. The39 selected host, ordinary race, grid start, result owner,
floating and primary-object regression tests pass, including20 combinations of
activity, simulation and player count plus explicit pause/resume checks.

Normal finish-to-menu integration still needs the complete logical display
dispatcher, source AI context, fade presentation consumers and menu/reset/save
effects. The current browser stop-at-results policy has not been removed.
This checkpoint is local; live remains v2.25.0 ORIGINAL MUSIC.

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
2. Replace the generic Glacier and Southern stunt placeholders. In particular,
   Glacier's source has no authored stunt ramps; its ice geography matters.
3. Calibrate exact scoring/penalties and motion against the recovered control
   transitions, training lesson progression, dolphin unlock timing,
   race conditions, course hazards, opponent behavior and handling against the
   recovered code and actual reference play. Existing broad coverage is not proof
   of exact parity.
4. Implement and verify the native separate-player-window equivalent and any
   remaining relevant installed enhancements. Account-backed achievements need
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
Glacier Reverse still has an unresolved 16-versus-15 marker discrepancy; Port's
ordered markers and Twilight Normal's empty original table need consumer
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

The original Glacier/Southern stencil cannot yet replace the generic layouts
without shared geography work. Glacier's northern crossing intersects over
71 metres of the current solid floor, outside its ice support. Southern's
ring 3 intersects the current ship. Fits against independently authored buoys
have RMS residuals of roughly 4.4/6.0 metres, so they locate discrepancies but
do not prove exact terrain. The source has twelve stationary breakable Glacier
spheres; the browser's ten drifting ice obstacles still need replacement.
Do not lengthen the original section schedules to conceal these mismatches.

Private decoding recovered Glacier's 165 collision planes and 127 shoreline
segments. All 124 upward-triangle interior checks agreed with the native
spatial grid; reconstructed vertices were within 0.0131 native units of integer
coordinates. The north has an open western water channel followed by an
eastern ice shelf at native Y=30, with submerged slopes to Y=-60. The narrowest
measured water cross-section is 267.204 native units. This establishes the
required kind of shoreline correction; native material/friction behavior and
the final browser coordinate mapping remain separate work.

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

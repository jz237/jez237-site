# Beginner's recovered pipe passages (mm-37, local)

The local native Beginner board now includes its tall blue pipe and the two
lower entrances joining into one Y-shaped outlet. These are in the actual
`native-courses/beginner.json` campaign definition. They were previously absent
from the recovered board.

## Original evidence

The recovered actor table places the upper inlet (18) at cell 64,78, height
16264, and its outlet housing (21) at 67,78, height 16176; camera bands 23–44.
The lower inlets (19/20) are at 81,86 and 87,86, height 16176. They share housing
22 at 84,94, height 16128; camera bands 34–61. The earlier reference frames at
52/56 seconds show the tall shaft and the joined lower Y, respectively.

`native-pipes.mjs` records the original decisions without moving a physical body:

| Handler | Original entry/release law | Original destination | Occupied fallback | Horizontal release velocity |
|---|---|---|---|---|
| 18, `0x17192` | Broad cell window; no action at integer height ≤16192; housing collision at ≥16248; clear horizontal velocity at 16224–16247; release below 16224 | (524,612), then query floor | (516,612) | (+4,0) |
| 19/20, `0x172e6` | Bounded horizontal window; release only in the inlet row and its three accepted columns, otherwise housing collision | (668,740), then query floor | (668,732) | (0,+4) |
| 32, `0x17464` | Intermediate reference: no action at ≤16256; housing at ≥16304; clear horizontal velocity at 16288–16303; release below 16288 | (620,596), then query floor | (620,604) | (0,−4) |

The upper handler's inner cell window also sets contact type 18/cooldown 255.
Release sets cooldown 18; it preserves the old contact type when releasing
outside that inner window. Handler 18 destroys non-player creatures reaching
its release branch. Lower handlers preserve movement mode; upper and orange
handlers clear it. Vertical velocity survives release. All request sound 28.
These distinctions are covered by source execution, not inferred from footage.

The clearance helper uses the previously recovered strict octagonal horizontal
distance test, with threshold 112. The original relocates to the fallback eight
source units behind its nominal exit when occupied. This source relocation is
**not applied** to the remake. Real marble contact controls separation throughout
the continuous passage; exact correspondence to the source's occupancy timing
is still unverified.

A private Unicorn harness executed the four original handlers for **1,057
cases**, covering horizontal/fractional boundaries, integer height bands, both
clearance results, motion/contact preservation and the upper creature branch.
The recovered helper matches every execution. This harness stubs the clearance
return, floor lookup and sound service; it is not execution of a complete race.
The clearance helper itself was checked in the earlier Silly transfer audit.
Original bytes, disassembly and execution fixtures remain outside this repository.

Intermediate's decision helper is recovered here, but its orange physical pipe
has not yet been added to the native campaign.

## Continuous geometry and motion

The upper pipe descends through the recovered opening and bends toward its
original outlet. The lower assembly is one closed wall mesh with three open
ports. Its two entrances use rounded rectangular bells and join a common bore.
The renderer and Rapier consume that same mesh, including the junction and rims.

`fork.merge` reverses traversal sampling and flow along the existing fork
geometry. Shaped-opening radius checks also reverse, so entry clearance and
bonus tracking agree with the actual mouth. Generic imported merging pipes
choose the entered physical branch; native Beginner entries use their recovered
capture windows. Neither chooses a random exit.

The adapter requires both the original camera band and contact with the real
open bore. Upper horizontal clearing becomes bounded damping while gravity
continues the descent. After capture, bounded flow carries the sphere around
the bends. Flow targets the recovered four-source-unit release speed: **11 world
units/s** at the current unit scale and 20 Hz native update rate. There are no
position or velocity assignments during passage. The 40-unit acceleration cap,
interior curves and transit duration remain physical adaptations requiring
reference calibration.

Initial lower bends intersected the solid approach platform and blocked entry.
Moving the descent beyond the actual ledge cleared that obstruction in both
the visible mesh and the collider. No extra floor or invisible bypass was added.

The simultaneous two-player encounter exposed excessive contact penetration
with the old very short prediction margin. Pipe courses now prepare Rapier
contact constraints 0.15 world units ahead and use contact frequency 120. These
solver settings leave both sphere radii and all track geometry unchanged. The
paired check measures penetration below 1% of marble radius; a separate settled
floor check verifies that the larger prediction margin does not leave the marble
hovering. This is one tested simultaneous entry, not exhaustive paired coverage.

The upper passage awards 4000 and the shared lower passage 2000 on physically
crossing the outlet. Current claims remain once per player per assembly. Exact
original repeat/alternate-entry award policy is still open. Replays retain the
entered branch and restore mid-passage state deterministically.

The native descending pipes do not inherit the powered lift's vacuum sound
loop. Their original sound-28 sample and complete cue timing remain to be
restored; the existing reward effect is still provisional.

## Validation and remaining work

The full suite passed **407/407** (282,447 ms). After removing an unused
occupancy scan and rejecting reversed Silly imports, the focused pipe,
Silly-transfer and audio suites passed **39/39**. The final bundle build and
diff check passed. The full-suite count also includes older reconstruction
tests; it does not certify native whole-campaign completion.

`tests/native-pipes.test.mjs` checks:

- Recovered decision boundaries, occupied exits and movement/contact states.
- Actual native-board upper/left/right passages with bounded normal steering,
  zero falls, outlet awards, continuous steps below 0.15 and snapshot replay.
- A closed shared Y mesh, physical ray contact against its rounded entry walls,
  correct direction/clearance when merging and generic import branch selection.
- Inactive camera bands, positions outside the bore and malformed imports.
- Simultaneous lower entries, independent rewards and contact separation, plus
  settled floor contact under the updated solver settings.

The browser's actual Beginner picker entry shows the tall pipe and joined Y
with no warning/error logs. This is a visual integration check, not a browser
completion of the race. Full timed Beginner routes, alternate routes, creature
behavior inside pipes, original transit/exit timing, sound 28 and final silhouette
polish remain open. Other campaign release requirements are tracked in
`NATIVE-CAMPAIGN.md` and `PARITY.md`.

# Ultimate's changing final room

Status: reference-informed reconstruction; exact dimensions, complete cell masks,
phase origin, difficulty scaling and timed campaign acceptance remain open.

## Primary evidence

- [Ironclaw / World of Longplays Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8), 315-346s.
- [Hipoonios Amiga recording](https://www.youtube.com/watch?v=K_F_IbG87LM), 225-258s, corroborates topology. Its clock remains at 99; do not use it to calibrate ordinary time allowances.

The first recording shows one dark exit from the small steelie platform below
the four ice pyramids. It crosses a disappearing straight walkway to a white
junction, follows staggered dark crossings down to a white lower landing, climbs
a ramp, crosses a turquoise strip, and returns along a changing gold path to the
flag. The old reconstruction instead had two fixed sloping branches and a
three-unit blinking gap on the left. It omitted most of this sequence.

Private 4fps frames from 320-335.75s were aligned vertically against the stationary
gold goal graphic, removing camera scrolling. Three successive entry gaps open
within these sampled intervals:

| Entry segment | First opening | Repeated opening |
|---|---|---|
| Upper | 320.75-321.00s | 326.75-327.00s |
| Middle | 322.25-322.50s | 328.25-328.50s |
| Lower | 323.75-324.00s | 329.75-330.00s |

The pattern supports a six-second cycle, an approximately 1.5s absence, and a
1.5s delay between entry segments. The whole entry is present for part of the
cycle. Absolute phase at course start and other difficulty settings are not
established by this excerpt.

Comparing aligned lower-room frames also shows that the dark corners disappear;
they are not permanent waiting pads. The white junctions and bottom landing
remain visible. The initial development fixture incorrectly kept dark turns
fixed; that version was corrected before publication. A temporal top-color
analysis assisted inspection but is not itself treated as a recovered tile map.

## Current reconstruction

`ultimate-finish.mjs` defines the complete sequence in the shared course model:

- Three full disappearing entry spans, at the same elevation as the steelie exit.
- A white junction and staggered lower crossings, including disappearing turns.
- A white lower landing, a rising ramp and a low-friction turquoise return.
- A white upper junction, three gold disappearing spans and the goal approach.

Both upper campaign routes merge at the steelie platform and use this final
sequence. The unsupported fixed right finish bypass is removed. The alternate
route still visits the right hazard rooms and outer ice lane. Cell width 2.4,
heights 4/6, the precise zigzag footprint and the continued phase sequence beyond
the sampled entry are reconstructed. They require further pixel-to-world mapping;
this release does not claim complete final-room parity.

All spans are closed solids down to the base; support and visible bodies switch
together. Stationary disappearing pieces use world-aligned grid/masonry so their
textures meet the fixed surfaces. Their corners use the same rounding as fixed
boards, in both the visible mesh and convex collider. Dark slate keeps stone's
friction while distinguishing the changing route; goal spans retain gold.

The demo uses normal bounded steering and waits for sufficient remaining support
before entering a span. It does not disable hazards, move marbles directly, alter
human torque, or extend race clocks. Main solo 96.375s and paired 96.375/102.375s
finish with zero falls in measured full runs. The longer untimed traversal is not
evidence that the timed campaign is balanced. Complete timed acceptance remains
open; both demo speed and physical calibration need further work.

## Verification scope

Native collision rays verify disappearance of entry spans and dark corners,
absence of hidden support below the gold crossing, a continuous climb within 1%
of the marble radius, and the icy upper surface. Snapshot continuation preserves
the same presence cycle. Complete-route tests retain bounded-input and zero-fall
checks for both upper routes and paired main play.

Untimed test observation limits increased from 90 to 150s for paired Ultimate and
from 120 to 180s for the two full solo routes, because the previous limits described
the abbreviated fixed finish. Race clocks and timed acceptance were unchanged.


## September 22 — recovered original terrain states

The private original resource now supplies the four complete changing-height
states. This replaces the static patch approximation in a local native-board
fixture. The published campaign still uses the earlier authored reconstruction;
this is not a new public release or a complete Ultimate parity claim.

### Original evidence

The source trigger entry at resource `0x26a4` has range bytes `0x18,0x30` and
script pointer `0x2c42`. The script creates graphics subtype 25. Its frame
sequence at `0x2c1e` contains four pairs: graphic rows 78, 108, 138, 168, and
height-table pointers `0x288e`, `0x2972`, `0x2a56`, `0x2b3a`, followed by a
32-bit -1 terminator. Every height table replaces indices 0–111 in the shared
terrain table. All 272 changing vertex references in Ultimate resolve through
these tables, affecting 369 cells.

The executable at `0xffba` registers subtype 25 for streamed background updates.
At `0x1e040–0x1e0c2`, it wraps the sequence at the terminator, starts reading
30 graphic rows and advances the sequence pointer. When that read completes,
`0x1e104–0x1e146` copies the corresponding terrain table to `0x798`. The redraw
swap at `0x1de10` requests the next frame. This is a discrete replacement of
height data; the original does not interpolate smoothly between these states.

**The trigger range is a camera-loading range, not player regions 24–48.**
`0xd6c4–0xd6ea` subtracts the course's initial scroll from old/new camera scroll,
then shifts by four. Those band indices reach the actor loader at `0xd768`.
They must not be passed to the region helper introduced for race finishes.
The private fixture currently uses explicitly provisional region activation
9–12 and 1.5 seconds per state, based on the earlier six-second video observation.
Exact camera activation, disk-read cadence, phase origin and difficulty behavior
remain unfinished. Region activation is an authoring option, not a recovered
claim about this original actor.

Decoding the height words with the original difference dictionary and row bases
gives heights 16316, 16352, 16356, 16360, 16364 and 16368. The lowest value is a
real lower surface in the source height query, not a null corner. At the final
gate's middle tile, states 0, 2 and 3 supply the raised approach, while state 1
lowers it. The previous fixed patch left a wall at this gate because it omitted
the changing vertex values.

### Runtime support

Optional terrain animation type `terrain-sequence` accepts:

- `frames`: two to eight lists of replacement cells, in ordinary terrain cell
  format. Every replacement references an existing grid cell; frame zero must
  match the base cells. Unlisted cells retain their base heights.
- `secondsPerFrame`: an authored interval, 0.05–30 seconds.
- `activationRegions`: an inclusive pair of authored player regions.
- `initialRegions` and ordered `gates`: the same local-grid region format used
  by native wave imports. Course navigation supplies its shared region state
  when it references the same terrain part.

Each frame compiles to a complete welded solid mesh. One Rapier triangle-mesh
collider switches to that frame, retaining original cliff planes and eliminating
separate moving/fixed edge contacts. The renderer selects the corresponding
cached mesh and relief texture; its graph and masonry remain world-aligned.
Textures and cached geometry are released on course changes. A lowered piece
removes support at the former height. It does not leave an invisible raised
collider. Player/body/controller state restores through the ordinary snapshot.

The generic region controller holds its last frame while inactive and starts at
frame zero upon reactivation. That authored behavior is tested; original actor
unloading/reloading and capture-state eligibility still need exact integration.

### Checks and limits

Seven new tests cover closed meshes and undersides, both-player activation,
support removal, all four collider states, snapshot restoration, matching
30/60/120 fps outcomes, malformed imports and the authoring geometry budget.
The full regression suite passes **229/229**, 282010.9911 ms. Final rendering
changes were also built and checked in the local browser.

On the recovered full board, **17,700** top-face probes across all four states
have no missing hits and maximum height error **0.000002802 units**. All four
meshes have balanced closed edges and 12,604–12,628 triangles. The previously
blocked final approach now finishes with ordinary steering in **97 ticks**,
zero falls, from its local gate test start. Both original race starts remain
grounded. This measures the final approach, not a complete race.

Browser inspection shows different changing layouts, matching relief coloring,
textured solid walls and an idle marble on a fixed platform without falls;
no captured warnings/errors. The native boards still need rounded silhouettes,
original actor placement/behavior, a complete normal-input route, original
camera activation and timing, plus calibrated damage/death handling on lowered
surfaces. Scale remains provisional. None of these checks certifies full parity.

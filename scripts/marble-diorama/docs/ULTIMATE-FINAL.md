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

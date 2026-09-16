# Ultimate opening: reference correction needed

Source: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
Inspected the existing private video at 269–287 seconds and a four-frame-per-second
sequence at 278–283 seconds. These are video timestamps, not race-clock values.
Reference images remain outside the published game.

## Observed route

- The starting field has a white recessed approach to its front edge.
- Around 278 seconds the marble leaves that edge and reaches the separate
  square platform immediately below it. A gold mechanism occupies its center.
- The marble bounces there before reaching the lower left platform around
  280 seconds. The other lower platform remains to its right.
- It rolls from the left platform onto the left turquoise bridge around
  282–283 seconds, without visiting the lower right platform.
- A visible `2000` award accompanies the left-platform/bridge passage. The
  exact triggering boundary still needs a closer trace; it is not established
  merely by the score appearing there.

## Contradiction with the current reconstruction

`src/ultimate.mjs` currently sends the main route through three serial launches:
one on the start field, then the first and second islands, before reaching a
third island which feeds both bridges. That compulsory route is inconsistent
with the observed opening. The two lower platforms should be treated as
branches in the next geometry correction, rather than requiring a visit to both.
The reference does not establish the right branch's complete traversal or the
gold mechanism's launch law. Do not infer those from a still frame.

This matters to campaign calibration: optimizing demo speed around the current
serial route would preserve a known layout error. Fix the opening's topology
and verify its approaches, drops, branch transfers and award trigger before
using Ultimate's elapsed time to calibrate clocks or human steering. Preserve
the shared render/collision geometry and normal-input requirement.

## September 16 controller experiments

Removing Silly's upper stop caused falls; moving its apex did not improve the
whole run. Increasing broad-route braking assumptions from 1.5 to 1.8–2.4
caused worse carryover and, at higher values, falls. Replacing the approach-speed
expression with the constant-deceleration form alone also reduced campaign
carryover. These trials were discarded. No human physics, route, clock or demo
controller change from those experiments is included in the renderer checkpoint.

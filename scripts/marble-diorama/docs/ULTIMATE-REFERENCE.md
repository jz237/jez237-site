# Ultimate opening: observed topology and reconstruction

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

## Contradiction found in the earlier reconstruction

The earlier `src/ultimate.mjs` sent the main route through three serial launches:
one on the start field, then the first and second islands, before reaching a
third island which feeds both bridges. That compulsory route was inconsistent
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

## September 21 correction

The start now drops to one upper launcher island. Its left and right arms send
the marble to separate lower islands and separate flat ice bridges. Neither
branch requires the other island. The arms articulate on contact, using the
same hinged mesh for physics and rendering. The guide solids remain provisional.

A new regression drives each opening without moving bodies or extending clocks:
exactly one spring event, a grounded landing on the chosen island, no visit to
the opposite island, a visibly moving arm, arrival on its ice bridge and no falls.
This verifies the implemented branch topology, not the original launch law.
Paired arms, stroke, velocities and dimensions are reconstructed; the initial
white recess and exact 2000 award trigger still need correction/measurement.


## September 21: launcher landing award (mm-24)

A closer 25fps trace of the same local recording from 280.08-280.52s narrows
the award to arrival on the left landing island, before the turquoise bridge:

- Through approximately 280.20s the score reads 48590.
- At approximately 280.24s it reads 50590: an exact 2000 increase. The marble
  is arriving behind the gold guide, partially occluded by it.
- The following frames show 50600 and a floating 2000 label while the marble
  emerges onto the platform. The extra ten is a separate progress increment.
- The bridge is reached later, around 282s; walking onto it is not the observed
  award boundary.

This establishes the amount and passage, but the occluded contact does not
recover a pixel-exact collision boundary. The original repeat policy, failure
cases, paired credit and right-hand route's award remain unverified.

The reconstruction now pays 2000 for each player's completed catapult flight
onto its associated lower island. It requires real upward support, a preceding
airborne flight from that launcher, and a landing within the current floor's
rotated footprint and height. A wrong first landing consumes the pending flight;
ordinary drops, overhead passage, falling/respawning and repeated claims do not
pay. Each launcher can be claimed once per player per race. Symmetric right-side
behavior and this repeat policy are explicit reconstruction choices.

The floor reference stays attached through workshop moves/rotations and JSON
round trips. Removing the destination removes the launch award association.
The existing landing reward notification and effects bus report the award;
that cue is designed, not recovered Amiga audio. Replay/record physics version
is mm-24 because scoring outcomes changed. No geometry, steering, launch force,
clock allowance or demo route was changed.

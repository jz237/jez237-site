# Silly's original red transfer

## Recovered behavior

The Silly actor table identifies one inlet (subtype 34 at cell 89,90,
height 16244) and two outlet housings (35 and 36 at cells 92,86 and 86,86,
height 16308), loaded in camera bands 20–51. Dispatch at 0x16a74 leads to
the inlet routine 0x175dc–0x17708. Actor-minus-player cell differences must
both equal one: the accepted player cell is 88,89, source coordinates
704–711 by 712–719.

`native-transfer.mjs` records these decisions without moving a body:

- At integer height 16276 or below, add 9/16 to vertical velocity, clear
  horizontal velocity, and set movement mode 2. At integer height 16244,
  the source additionally raises the position by two units.
- Above 16276, request a two-way random choice. This happens near the top,
  not on first entry. Zero selects (684,688); nonzero selects (732,688).
- Helper 0x15fc8 checks active other players, then the pools at 0xbbe and
  0x1530. Miniatures at 0x1ae6 are not scanned. Height is not tested.
  Integer horizontal differences must satisfy
  `16 * max(abs(dx), abs(dz)) + 6 * min(abs(dx), abs(dz)) < 112`.
  A blocked selected exit switches to the other, without checking whether
  that second exit is clear. The earlier arcade analogy did not establish
  these exact Amiga rules.
- Release sets horizontal velocity to (0,-4), preserves vertical velocity,
  clears movement mode, sets contact cooldown 18/type 34 and player state 3,
  and requests sound 37. The source moves directly to the selected exit
  and queries its floor. This is evidence about the original, not permission
  to teleport the remake's physical sphere.

## Independent execution check

A private Unicorn 2.1.4 harness executes the original 68000 inlet bytes and
the full occupancy helper for 118 cases: inlet boundaries, fractional heights,
both random outcomes, clearance boundaries, and both occupied exits. The new
intent results match all executions. The harness supplies deterministic random
returns and a destination floor height; sound and terrain-service calls are
intercepted. The occupancy helper's multiplication support is supplied directly.
This verifies the handler and clearance logic, not the complete game loop,
random-number generator, floor lookup or sound playback. Original bytes and
execution fixtures remain outside the published repository.

## Continuous physical adapter

An imported `nativeTransfer: true` powered fork requires a reverse native camera
and matching native dynamics. `native-transfer-physics.mjs` checks the actual
open bore before applying any force. It applies the source 9/16 velocity step
as acceleration at the native rate and scale. Existing downward gravity remains
active. The source's position nudge becomes physical lift from the supporting
floor; horizontal velocity clearing becomes bounded centering. Neither position
nor velocity is assigned by the adapter.

The source threshold selects the outlet using current player and creature
positions. The selected branch persists through the physical journey and replay.
An authored smooth, open three-way passage connects the recovered inlet and
outlets. Its bends use bounded airflow with the actual native gravity, replacing
the old hardcoded 9.81 compensation. Geometry, contact and traversal scoring use
the same mesh and center curves. Scoring tracks the common inlet before the
branch is selected. Generic custom pipes and the existing published reconstructed
campaign retain their previous behavior.

The latest private native Silly board completes both horns without steering,
falling or teleporting. Maximum measured step is 0.080865 world units at 120 Hz;
each passage awards 2000. The browser preview also reports the 2000 bonus and
zero falls. Current full travel takes 3.175–3.192 seconds from rest at the inlet;
that has not yet been matched to the shorter observed Amiga passage. Public
tests cover the source rules, physical lift, delayed selection,
current occupied-exit positions, inactive players, import validation, continuous
travel and replay from inside the passage.

## Remaining parity work

The branch RNG remains a deterministic hash, not the original global RNG.
Continuous travel through the upper bends necessarily replaces an original
internal relocation; bend dimensions, transit duration, horizontal exit speed
and preserved exit lift still need calibration against Amiga footage. Original
outlet-housing contact handlers (35/36) and looped side details remain open.
The original sound identifier is recovered, but the runtime still uses authored
airflow and reward effects. Scoring's once-per-race policy is still provisional.
The native fixture has not replaced the published campaign. Full-course controls,
paired traversal, presentation polish and release acceptance remain outstanding.

# Hard landings and dizziness

## Primary observations

[Ironclaw / World of Longplays Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8), difficulty 0, local 25fps copy:

- Aerial: the marble drops from the peg-platform end onto the lower lane around
  173.2-173.6s. Blue strokes circle it from approximately 173.56 through 174.96s
  (1.44s including the final sampled frame). There is no enemy at the landing.
- A second Aerial drop onto the white descending ramp has blue marks from about
  177.24 through 178.48s (1.28s). The marble continues moving during the effect.
- Ultimate: after a larger descent into the gray room, the effect appears around
  293.16-295.96s (2.84s). The neighboring muncher makes the immediate trigger in
  this example ambiguous. It is not evidence that munchers simply stun.
- Ultimate opening: the ordinary drop onto the launcher has blue marks around
  278.2-279.0s, while the subsequent catapult landing at approximately
  280.3-281.5s has none in the inspected 10fps sequence. This supports treating
  an assisted launch differently, but does not recover the original immunity
  rule or establish the unobserved right-hand route.
- These marbles remain intact and resume from their current track position.
  There is no acid-style dissolution, fragment return or respawn in this effect.

Durations were estimated from 25fps frames, checking the blue-dominant pixels
against full-frame and close-up contact sheets. They are visible-effect times,
not recovered control-lock timers. Original input is not shown. The connection
between impact severity and duration is an inference from these examples;
original thresholds, severity law, influence of simulation slowdown, collision
immunity and difficulty dependence remain unverified.

## Initial reconstruction in mm-23 (control lock superseded)

All six original course rule sets enable `landingStun`. Bonus and existing custom
courses retain their own rules; imported courses can explicitly enable this
validated boolean. A hard landing temporarily blocks steering and turbo while
ordinary Rapier momentum, gravity, rotation and collisions continue. It does not
count a death, move the marble, disable its collider or stop either player's
clock. A second player keeps independent control. The HUD says DIZZY and three
blue curved marks orbit the actual interpolated marble. Their pose uses the
simulation clock so pausing or seeking does not advance the animation.

A landing requires at least 12 unsupported simulation ticks and a real contact
with an upward-facing track/moving-platform surface. Side impacts, other marbles
and enemies are excluded. Severity is incoming normal velocity relative to the
contact surface, including the velocity of moving platforms. The reconstructed
threshold is 6.5 world units/second; duration is `0.8 + 0.35 * (speed - 6.5)`
seconds, capped at 2.85s and rounded to 120Hz ticks. These numeric choices are
provisional calibration, not original constants. An impulse-launch flight is
exempt from dizziness until its first landing, matching the inspected Ultimate
transfer. The launch state survives replay snapshots and is consumed at contact;
subsequent ordinary drops still stun. This exemption is an inferred rule, not
recovered Amiga code. No course dimensions, steering strength, demo routes or
clock allowances were changed to compensate.

The existing impact sound is joined by a short newly designed warble. This is
not an authentic recovered Amiga cue. Exact original mark shape, orbit cadence,
marble appearance during dizziness, controls and sound remain open.

## Verification scope

Regression checks exercise actual small/hard landings, reduced control and
recovery, retained momentum, independent player control and clocks, no death
or respawn, side-wall exclusion, snapshot restoration and moving-surface relative
velocity, an actual catapult flight and a later unassisted drop. The reference
renderer follows the marble and disappears on recovery or timeout. A replay test exposed Rapier 0.20 restored wrappers reporting body
handle zero for an unparented static collider; the landing query now identifies
authored moving bodies explicitly, preserving the same outcome after restore.

This restores a missing mechanic but does not establish complete landing or
Amiga feature parity. See VALIDATION.md for the release checks and remaining
full timed campaign failures.

## September 22 executable audit and mm-32 correction

The privately decoded Amiga executable is identified in TWO-PLAYER-RULES.md.
The original normal-input routine at `0x12f8c` still runs in dizzy state 1:
state dispatch at `0x13f44` leads to `0x1427c`, which invokes input at `0x1428e`
and ordinary motion/collision at `0x14298`. At `0x1307e–0x130cc`, state 1
attenuates the input by the recovery counter at player offset `0x60`.
Ignoring original integer rounding, its multiplier is `(31 - counter) / 32`.
State 5 shares this path with a separate minimum numerator of four; that state
is not being conflated with landing dizziness here.

The state-1 update at `0x142aa–0x142f4` reduces the remaining damage byte at
`0x61`, then raises or lowers the recovery counter toward it, returning to
ordinary state when the recovery counter reaches zero. For a single isolated
surviving impact this produces a rising then falling counter: steering weakens
and returns during the visible effect. The prior remake discarded all input
for the full effect duration, which is contradicted by this code.

mm-32 keeps input direction and turbo available and multiplies applied steering
torque by the counter attenuation. It leaves physical momentum, collisions and
independent player control intact. The counter is evaluated from simulation
ticks, so restored snapshots and input recordings recover identical responses.
For a 32-update recovery its counter runs 0 -> 16 -> 0, giving approximately
97% -> 47% -> 97% input before ordinary 100% control returns.

### Calibration limits

The existing 6.5-unit impact threshold and speed-to-duration approximation are
retained. The counter envelope is fitted to that duration using the existing
clock-rate approximation and the original 30 updates per clock unit, rounded
to an even update count. Its surviving range is limited to 62 updates (peak
counter 31). This is an explicit adapter between the current Rapier calibration
and the recovered input law, not an exact original impact model.

The original landing branch at `0x152d2–0x15300` derives damage from vertical
height difference, not measured normal impact speed. It calls `0x14884`, which
accumulates damage, handles existing recovery state and can enter a shattering
path when the resulting half-sum exceeds 31. Those height units, accumulated
impacts, severe-landing death behavior, exact integer input rounding and
wall-clock cadence still require calibration. The earlier launcher exemption
also remains inferred. Do not mark complete landing parity from this correction.

Eight focused landing checks pass, including actual hard contact, steering
weaker than an unstunned marble but stronger than coasting, independent second
player response, restoration, recovery and the original attenuation fractions.

A normal-input event trace exercises an actual Ultimate opening stun at tick
1459 (12.158s), followed by launcher activation at tick 1559. The full untimed
solo route finishes in 90.117s without a fall. Aerial's current normal demo
finishes in 54.508s but triggers no stun; its drop geometry and path remain a
specific comparison gap against the original Aerial observations above. The
local Aerial browser demo passes (54.51s, 4,942 points, zero falls, no errors),
but that alone does not verify original landing placement or difficulty.

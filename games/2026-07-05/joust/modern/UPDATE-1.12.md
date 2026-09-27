# Modern Joust 1.12 — flight controls

## 1.12.1 — ledge alignment

Standing artwork is anchored at the painted feet, in both facing directions.
Landing now requires the feet to be above a platform, preventing the old body
overlap margin from holding a rider in the air beyond either ledge. Wrapped
platform support and the 1.12 control tuning are preserved.

## 1.12.0

Left and right now accelerate the rider on every simulation tick, without needing
to flap. Opposite input brakes quickly, and releasing the direction slows drift.

Held flapping repeats six times per second instead of ten. Each airborne stroke
has less upward impulse, climb speed is capped at 1.6 native pixels per tick
instead of 4, and rapid taps cannot bypass the stroke interval. A stroke also
slows an existing fall so the gentler lift still allows recovery near the lava.

Platform and ceiling rebounds are small and stay damped on following ticks.
Equal-height rider collisions retain their overlap separation but no longer
launch the player away at full horizontal speed.

The Modern flight profile runs on the shared engine's fixed ticks. It applies to
both players, keyboard, touch and gamepad. Enemy AI, Retro physics, arena geometry,
scoring and joust height rules retain their existing behavior.

Verification: 12 new control tests, nine existing runtime tests and all 22 browser
checks pass. Cases include actual sprite/platform contacts, drift distance,
reversal time, held and rapid flaps, fall recovery, lava-troll escape, respawn,
two-player recoil, enemy behavior and identical outcomes at 30/60/144 display Hz.
Browser input checks also confirm steering and reversing with no flap held.

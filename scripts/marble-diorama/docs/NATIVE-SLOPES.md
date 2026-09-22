# Silly uphill acceleration

The original Amiga code reverses **slope acceleration** in Silly. This does not
reverse free-fall gravity or establish a reversed-input rule.

## Source evidence

- `0xe872` reads the actor's fixed-point X, Z and height. `0xe944` extracts X/Z
  offsets within an eight-unit cell into globals `0x6d2` and `0x6d4`.
- `0xea10–0xeada` computes the current triangle's two height differences in
  `0x6d8` and `0x6da`. The same differences determine the interpolated floor
  height, showing these are terrain gradients, not controller input.
- `0x14a88–0x14b1e` multiplies either signed gradient by four when its magnitude
  is at least 12. It shifts the gradient left 11 bits, yielding a velocity
  increment of `gradient / 32` in source units. It adds that increment when
  course index is four (Silly), and subtracts it for other courses.
- The player ground-update path calls this routine at `0x156dc`. The separate
  airborne rule still subtracts `3/8` from vertical velocity and limits descent
  to five source units per update.

The previous note that Silly's general slope behavior was unknown is superseded
by this evidence. Its two-outlet red transfer remains a separate unfinished
mechanism; reversing slope acceleration does not reproduce that mechanism.

## Physical adapter

Native Silly courses enable `nativeDynamics.uphillSlopes: true`. Import validation
requires a native reverse camera. Other courses retain their existing behavior.
`native-slopes.mjs` uses the contact normal from the real board collider,
transforms its gradient into source coordinates, and scales the recovered
velocity increment by distance and squared update rate.

The adapter applies an impulse tangent to the plane. It cancels the ordinary
downhill component of gravity and adds the uphill component. Downward normal
loading and airborne gravity remain unchanged. A factor of `7/5` accounts for
the solid sphere's rolling inertia when a force is applied at its center. This
is a physical adaptation of the source's planar velocity change. No active
position, rotation or velocity is assigned by this adapter.

A cached contact manifold can briefly be empty at a triangle join. In that case,
the adapter checks the closest point on the same closed collider. Support must
be within 0.002 units of the real sphere radius, and its normal must point upward.
It does not enlarge a collider or create a hidden support. The global contact
prediction settings are unchanged.

## Verification

Tests check both source signs, the signed magnitude-12 threshold, rotation,
tangential force, automatic uphill/downhill rolling, flat-floor stability,
unchanged free flight, imports and exact snapshot continuation. On a 1:4 ramp,
the recovered horizontal acceleration is 3.125 world units/s². Measured means
were 3.0887 unrotated and 3.1019 rotated, within 2%; existing rolling resistance
accounts for part of that difference. Steady rolling speed and spin agree
within 2%, and contact height stays within 1% of marble radius.

Four actual Silly opening slopes were separately tested from rest for 90 physics
ticks. Each produced approximately 0.981 units of rise, zero falls, a maximum
step below 0.049 and contact-height error below 0.0014. The browser preview shows
the marble on the recovered uphill zigzags. These are slope checks, not proof
of a complete timed course or all original motion states.

Remaining: full source drag/control calibration, ice and steep-slope behavior,
state-specific exclusions, full normal-input routes, transfer integration and
campaign release. The recovered fixture is still private and the published
authored Silly course does not yet use this rule.

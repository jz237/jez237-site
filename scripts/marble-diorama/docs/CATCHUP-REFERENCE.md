# Amiga catch-up and camera audit — September 22, 2026

## Evidence and current mismatch

The private executable and decoding method are identified in
[TWO-PLAYER-RULES.md](TWO-PLAYER-RULES.md). This is static code evidence; a paired
original gameplay trace is still needed to map the screen coordinates and
course-specific destinations into the reconstructed 3D boards.

The remake currently follows the average of active marble positions and reduces
zoom as their distance grows. It has no off-screen catch-up relocation or
penalty. That is a known functional gap, not a completed two-player rule.

## Trigger and relocation

- `0x13a0a` iterates player records. It excludes inactive, timed-out and finished
  records before entering the catch-up branch and requires two selected players
  (`0x13a84–0x13a8c`).
- For ordinary courses, the low word of the projected position at player offset
  `0x1e` must exceed 264; for Silly (course index 4), it must be below 30.
  These are strict inequalities (`0x13a90–0x13ac4`).
- Player movement state `0x36 == 2` is excluded. The animation/state byte at
  `0x1a` must be 0, 1 or 5 (`0x13ac8–0x13ae4`). The meaning and timing of all
  these state values must be verified before mapping them to remake states.
- `0x123ac` selects a course destination relative to the other player using
  course-specific tile/region lists. It searches candidate coordinates with
  collision/occupancy checks, region preference and a screen-position band.
  The ordinary band is relative to the clamped other-player position minus 32
  and plus 64; Beginner/Intermediate region exceptions extend the upper bound
  by 160. Silly instead uses minus 64 and plus 32. There are fallbacks to
  candidates in the visible 8–232 range. It is not simply the other player's
  current position, the last checkpoint or the follower's last safe position.
- `0x13af2–0x13b66` installs that destination and its height/region, zeros
  velocities and clears movement/animation history.
- `0x13b6e–0x13b88` subtracts five from the **integer** clock word, retaining
  fractional counters unless the subtraction is negative. Negative results
  become exactly one with both fractional counters cleared. Exactly zero is
  not replaced with one.
- The routine requests effect 19, enters state 4, increments the same loss
  counter used by the ending bonus, and initializes recovery fields. It is a
  relocation/recovery event, not a physical fall through the board.

## Camera dependency

The projection at `0x6918` stores two words: horizontal is `136 + y - x`;
vertical is `108 + height + scroll - floor((x + y) / 2)`. These are original
coordinate conventions, not Three.js world coordinates.

The camera routine at `0xd320` selects an extreme eligible projected position:
minimum on ordinary courses, maximum on Silly. It does not average the players.
It uses scrolling limits at `0x234c/0x234e`, tiered speeds and state-dependent
eligibility. Its projected coordinate orientation, scale, screen origin and
scrolling cadence need correspondence checks against original playback before
being converted into the diorama's fixed simulation coordinates.

The executable's initial limits are 128 and 184. Its initial speed tiers are
1, 2 and 4, with distance thresholds 16 and 48. Course destination tables are
loaded separately: `0x3176` selects `PrcTrack`, `BegTrack`, `IntTrack`, `AerTrack`,
`SilTrack` or `UltTrack`; `0x31b8` takes the loaded resource's second pointer as
the catch-up table at `0x129fc`. The executable alone does not contain those
course-specific destination lists.

## Implementation requirements still open

1. Capture an original two-player separation/catch-up sequence, including Silly,
   with the course landmarks and clock visible.
2. Map original projection, leader eligibility and scroll bounds to authored
   world coordinates. Rendering aspect ratio, quality and user zoom must never
   determine whether a gameplay penalty occurs.
3. Reconstruct safe destination lists/region exceptions for all six courses
   from course geometry, separate from demonstration-controller waypoints.
4. Integrate relocation, original integer-clock penalty, loss counting,
   recovery, effect and visible explanation on the fixed simulation clock.
5. Test both leaders, reverse Silly travel, alternate regions, moving/absent
   surfaces, ineligible states, low clocks, pause/restart and snapshot/replay.

No distance-only teleport or new threshold has been enabled from this audit.

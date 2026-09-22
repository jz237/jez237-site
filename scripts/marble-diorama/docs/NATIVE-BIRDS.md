# Silly birds: recovered controller

## Source evidence

The Silly track header at +0x24 supplies four animation sequences to the
runtime at 0x1d334. The runtime's five lane starts are cells (57,63), (55,63),
(49,58), (47,58), and (41,58). Every bird starts at the cell center and source
height 16344. These are factual coordinates and behavior; original bitmap
assets remain private.

- **Activation, 0xd7ea–0xd85a:** crossing into camera bands 3–27 inclusive
  enables spawning. Leaving stops new allocations without removing live birds.
- **Allocation, 0x1cdd6–0x1cf7e:** ten slots, checked every eighth source update.
  Two ordered passes allocate at most one bird each. The first seeks an empty
  lane; the second also accepts a lane with one bird at least four cells ahead.
  Retiring birds still occupy their lane until removal. Lane starts request
  sounds 38–42 respectively.
- **Emergence:** two frames, eight updates per frame, no translation.
- **Flight, 0x1cf80–0x1d1b8:** the bird travels along decreasing source z at
  two or four units per update. Slow flight holds each of two wing frames for
  four updates; fast flight holds each for one. A cooldown counts completed
  animation cycles, not individual updates. With no bird ahead, slow flight
  can switch to fast for four or five cycles. Otherwise it switches to slow
  for one or two cycles. Slot order affects same-update neighbor observations.
- **Wall:** terrain strictly above the flight height starts a 24-frame
  retirement at one update per frame. The source rounds the previous z down
  to four units. The recovered controller reports that coordinate as an intent;
  it does not apply an active-position snap in the 3D game.
- **Marble contact, 0x1d1ba–0x1d29a:** only a flying bird can hit. It starts a
  separate four-frame retirement, four updates per frame, and requests sound
  20. The player enters animation 11 with byte +0x61 set to 102. **102 is an
  initialization marker, not a duration:** 0x133ca converts it to 36 before
  running that player program. The source's 12-by-12 contact rectangle is not
  used as an invisible 3D hit box; the future adapter must require real contact.

## Implementation and verification

`native-bird.mjs` implements the allocation, camera gate, source-clock movement,
neighbor rule, wing cadence, retirement and contact intents. State is plain data
for snapshots. Its seeded random choices reproduce replay behavior but do not
claim to reproduce the original global, hardware-influenced random stream.
Tests can inject the same random choices as a reference trace.

Nine tests cover ordered allocation and spacing boundaries, emergence and
speed transitions, neighbor blocking, camera departure/reentry, strict wall
height, separate retirement deadlines, one-shot contact, slot reuse, and
identical snapshot continuation when source updates are grouped differently.

A private diagnostic samples the actual recovered Silly terrain solids along
all five lanes. With isolated simultaneous starts and injected zero random
choices, lane 3 meets its wall at update 41, lanes 2/4 at 73, and lanes 0/1 at
86. All retire 24 updates later. Four lanes stop at source z 304, while lane 3
stops at 400. This validates controller paths against reconstructed terrain;
it is not original-binary execution or a normal-input playthrough.

## Physical integration

The local runtime now accepts `birdSequence: true` and ten unique
`nativeBirdSlot` enemies on a course with a reverse native camera and matching
physics rate. The new Silly fixture retains the recovered board and flags.
Camera departure stops spawning while existing birds finish their flights.

Newly drawn purple bodies, heads, beaks, wings and tails use the same closed
solids for rendering and convex contact. Source poses interpolate at 120 Hz.
The source height anchors the bottom of the flying shape; the body's origin
is explicitly half a radius above that height. Continuous casts of those solids
stop at the actual wall surface. An active bird never applies the source's
cell-alignment snap. Emergence and retirement are non-colliding animation phases.

Real marble contact starts a 36-source-update break-apart phase, then a
24-update reassembly at the existing safe respawn position. The loss is counted
at the reassembly transition, once. Source 0x143c8 dispatches player animation
11 through 0x13384; 0x143e6 selects animation 4 with marker101, which becomes24.
Eight closed patterned sectors expand from the actual impact pose and contract
at the respawn point. Their 3D paths are newly drawn, preserving the source
phase durations rather than claiming identical bitmap trajectories. The
original respawn search and early exit when the destination remains obstructed
still need integration. Newly synthesized flight, hit, wall and reform cues
are routed to the effects bus; original sample parity remains open.

Physical tests cover slot validation, closed changing solids, continuous wall
stops, actual marble contact, separate deadlines, one loss, exact snapshot
continuation, and native birds in the demo's motion forecast. A private
1,800-tick original-board diagnostic produces 31 emergences, 25 wall stops and
22 removals. Every live collider retains exactly the rendered vertices and the
correct enabled state. Maximum displacement is 0.091668 world units per physics
step. This diagnostic fixes camera entry and disables the player for coverage;
it does not prove an ordinary timed race.

Local browser inspection of a physical encounter shows purple birds in
different wing poses and the player's patterned fragments. The stationary
preview can be hit again after returning to the flight lane. Safe respawn
selection, source bitmap silhouette comparison, human audio listening, complete
normal-input races, and release validation remain open. The published campaign
still uses authored birds until the recovered campaign replacement is ready.

The integration passes the full 349-test suite (285002.4834 ms). The subsequent
native demo forecast and rotated-facing correction pass all six focused
physical bird tests (5255.8638 ms); the nine controller tests also pass. Build
and diff checks pass, and local browser warnings/errors are empty. No human
audio listening or physical-phone check has been performed for this milestone.

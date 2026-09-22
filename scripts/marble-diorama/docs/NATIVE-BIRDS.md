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

## Remaining integration

This module is not yet connected to the campaign or runtime bundle. The current
published birds still use authored crossing loops. Remaining work includes
shared visible/contact geometry, continuous movement to real wall contact,
emergence and retirement visuals, player animation 11 and its physical recovery,
sound playback, native course configuration, physical encounters and replay
tests, browser inspection, and full-course acceptance. No bird parity or
publication claim follows from these controller tests alone.

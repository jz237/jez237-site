# Aerial peg beds

## Primary reference

[Ironclaw / World of Longplays Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8), local 25 fps copy.

Aligned crops at 161.28-162.60 seconds show a bed with twelve flush silver caps.
A stroke starts around 161.56, reaches full height by 161.72, holds through
162.08, and withdraws by 162.28. These observations support an approximately
0.20-second rise, 0.36-second hold and 0.20-second return; they are not a claim
of recovered internal game ticks.

The 166.20-169.44 sequence shows four pegs rising together around 167.28-167.88,
then a perpendicular line of three around 168.12-168.72. Consequently a single
synchronized line of three pegs was inadequate. The source shows longer flush
intervals as well as these closely spaced strokes.

## Published reconstruction (before native source recovery)

Each of the three current bed locations has a 3x4 grid of rounded metal pegs.
The caps sit 0.002 units above their supporting flat surface, avoiding buried
caps. The upper bed is moved slightly back onto its landing; the lower bed is
placed on the straight flat stretch after its turn. Each peg has a closed round
hull whose visible vertices also form its physical collider.

The stroke uses the measured durations above. A seeded, stateless selector
chooses one row, one column, or an idle slot every 0.88 seconds. The original
selection law, idle probability, exact dimensions and positions remain unknown.
This selector is a reproducible approximation, not a recovered Amiga algorithm.
The same simulation clock controls rendering, collision and proximity sound.
Physics/replay version is `rapier-0.20.0-mm-17`.

Demo routes stop before each bed and forecast a crossing window from the shared
peg poses, allowing for acceleration and the marble radius. They use ordinary
bounded movement input; they cannot disable the pegs or reposition the marble.

## Verification

Tests check all three twelve-cap layouts, both perpendicular line orientations,
flush return, input validation, round hulls, physical lifting of a resting marble,
render/collider pose agreement, and exact mid-stroke snapshot restoration.
The existing paired Aerial traversal retains its zero-fall and bounded-input
assertions. Browser close-ups show flush caps, three raised pegs, and the
perpendicular four-peg line without captured warnings or errors.

This corrects one hazard family. Full Amiga parity remains incomplete.


## September 22: recovered native group controller (local only)

The executable's separate controller at `0x1d3ec` updates three 20-byte bed
records at Aerial actor-root `0x1758 + 0x23c`. It is not the regular actor
script interpreter. The `root + 0x68` single-peg graphic table is not the table
used by this routine. Four group tables at `root + 0x278` point to graphics
44–47, 48–51, 52–55 and 56–59 respectively. Each table has 13 frames:
`1,2,3,4,4,4,4,4,4,4,3,2,1`, followed by its terminator. There is no divider.
The next wait is `random(4) * 16` original updates; zero still waits until the
next controller call before starting another stroke.

The selector at `0x1d456–0x1d586` chooses:

| Pattern | Start row | Start column | Linear index stride |
|---|---|---|---|
| 0 | random(4) | 0 | 1 |
| 1 | random(2) | random(3) | 3 |
| 2 | random(2) | 0 | 4 |
| 3 | random(2) | 0 | 2 |

The code marks exactly THREE collision entries, starting at `bed*12 + row*3 +
column`. Columns vary fastest in the coordinate table. In particular pattern 3
must not be silently changed to a conventional reversed diagonal: its recovered
indices are `[0,2,4]` or `[3,5,7]` within a bed. The group sprites have now been independently decoded from the original Aerial
image bank. They show THREE caps in every pattern, correcting the earlier
four-peg video interpretation. Pattern 3 draws cells `[2,4,6]` or `[5,7,9]`, a
true diagonal. Its collision mask is shifted two entries earlier. The native
3D reconstruction uses the DRAWN cells for both mesh and physical collision;
the original mismatched mask is retained only as reference data.

`0x1d87e` activates the family while EITHER active player occupies region 4 or 5.
It initializes 36 entries at `0x18a6`, using source cells:

- Bed 0: columns 69–71, rows 55–58, height 16300.
- Bed 1: columns 69–71, rows 63–66, height 16280.
- Bed 2: columns 76–78, rows 74–77, height 16280.

Leaving both regions clears per-peg collision flags and freezes the group
counters. Re-entry resumes those counters. Initialization samples an otherwise
unused legacy wait-pattern choice; sound choices are sampled after all group
updates. The new controller preserves these call positions, with an injectable
random source for comparison. The game uses a snapshot-preserved local seeded
random generator; original global RNG/call-order parity is not claimed.

The optional `pegSequence` definition supplies 36 ordered `native-peg` parts
and the same update rate as the native camera. Both mesh and physical solid use
one interpolated height. The four raised graphic levels are recovered as
5, 12, 17 and 19 pixels above the flush caps, rather than four equal steps.
The local fixture maps those vertical source units through its native height
scale. Caps are 0.01 units above the board to eliminate coplanar flicker, with
rounded closed hulls. Current generic proximity machinery sound follows actual movement;
the two original sample variants per bed have not been assigned to audio assets.
The native fixture's 20 Hz clock and cap diameter remain provisional. Public authored Aerial is unchanged by this optional implementation.

### Collision reference and limits

`0x1da80–0x1dbf6` restores the prior planar position on entry to a selected cell.
If the prior position was already in that cell and integer height matches the
bed, it adds 12 height units, sets upward velocity to 7 and halves each planar
velocity plus an independent ±0.375, then plays cue 11. Other contacts below
12 units reverse both planar components; higher contacts still restore position.
`sourcePegContact` retains this classification for reference. Runtime contact
uses the real rounded moving hull, which physically lifts and blocks marbles;
it does not reproduce those cell-wide snaps or randomized eruption velocities.
The recovered rise increments 5, 7, 5 and 2 units now produce a physical
upward throw near the source's 7-unit velocity. A paired regression places one
marble on the corrected diagonal's end and another on the original stray
collision cell: only the first rises, without an injected spring event or a
position snap. Exact planar scatter and original cell-based impact responses
remain different; copying invisible cell reactions would contradict the
request's requirement that graphics and physical surfaces agree.

### Checks for this native implementation

- Independent reading of the original group tables agrees over 4,000 updates /
  12,000 bed observations, including unload/re-entry, random call ranges/order,
  selected cells, collision flags and frame levels.
- Six regressions cover all selectors and wait values, two-player activation,
  source collision classification, schema constraints, actual solid lifting,
  remote-marble isolation and exact mid-stroke paired snapshot continuation.
- A local approach using ordinary forward input enters original region 5 at
  physics tick 186 with zero falls, waking all three beds. All 36 cap centers
  have matching original terrain support within 0.000001 unit.
- Browser inspection shows raised pegs at 179.6 and clean flush caps at 179.1,
  after fixing coplanar flicker. No captured console warnings/errors.

This is a local family/approach check, not completion of the native timed race.
Native-board publication and remaining campaign parity are still pending.


### Sprite-bank evidence follow-up

The private original `Aerial.ilb` SHA-256 is
`3d80a5709bb1d4fbcf294d6c97a04b0333da5d54b7095a4ccc3b36080ce2f5f6`.
ByteRun1 decompression produces a 63-image bank with 20-byte records. Group
images 44–59 have four planar bitplanes. Reading their six-pixel cap-rim motif
and applying the actor descriptor's draw offset recovers these row-major cells:
`[0,1,2]`, `[0,3,6]`, `[0,4,8]`, `[2,4,6]`. The source bed's first flush cap rim
is at image y=19; raised rims at 14,7,2,0 give lifts 5,12,17,19. This is asset
measurement, independent of the reconstructed model or its tests. Source art
is retained privately for comparison and is not included in the game bundle.

The 12,000-observation comparison now checks sprite-derived occupied cells as
well as the original collision masks. Two further regressions cover the true
diagonal, measured height curve, physical launch speed and absence of a false
launch on the original's stray collision cell. All eight peg tests pass.

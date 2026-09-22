# Original terrain data audit — September 22, 2026

**Status: decoded and cross-checked privately; not yet integrated into the
playable courses.** The authored Three.js courses still approximate original
geometry. This audit is an input to correcting them, not a parity claim.

## Source and method

The six course resources come from the private preserved disk identified in
[PRACTICE-SCORING.md](PRACTICE-SCORING.md). The executable and relocation method
are identified in [TWO-PLAYER-RULES.md](TWO-PLAYER-RULES.md). No original program
was executed. The audit reads relocated data and interprets the terrain setup
and query routines. Original resources and generated geometry dumps are not
included in the site.

The resource's first root pointer is the terrain metadata. It contains a list
of rectangular vertex patches, cyclic signed-byte height patterns, a stream
of per-chunk patch masks and changing-terrain references, and row-relative
compression tables. The setup at `0xdebc` processes diagonal bands of 24 rows;
the masks skip patches outside each band. They are not course-wide enable flags.

The expansion at `0xe158` writes four independent corner heights at a vertex.
This is necessary at cliffs: neighbouring faces can have different heights at
the same horizontal coordinate. Averaging these four values would remove
original ledges or create unintended slopes.

The independent height query at `0xe944/0xea10` divides the board into eight-unit
tiles and interpolates one of two triangles. In tile-local coordinates, the
diagonal is `x == y`. For the expansion-buffer corner order, a tile uses:

| Tile corner | Vertex | Corner slot, zero based |
|---|---|---:|
| Near left | `(x, y)` | 2 |
| Near right | `(x + 1, y)` | 1 |
| Far left | `(x, y + 1)` | 3 |
| Far right | `(x + 1, y + 1)` | 0 |

Stored heights near `0x4000` are course heights. Zero is the absent-terrain
value, not the board's base. Rendering absent vertices as height zero would
produce enormous incorrect slopes. A mesh conversion must preserve absent
triangles and build separate solid sidewalls down to the diorama platform.

## Cross-check results

The private decoder expanded every patch in order within its original chunk
mask. A second implementation decoded the resource's compression dictionary
and executable height-difference table, including the corner-order rotation
between setup and querying. Every checked static vertex's four heights can be
represented by its original row's dictionary. Changing vertices were excluded
from this comparison.

| Course | Patches | Expanded vertices | Static vertices checked | Changing vertex references |
|---|---:|---:|---:|---:|
| Practice | 66 | 2,017 | 2,005 | 12 |
| Beginner | 79 | 2,813 | 2,793 | 20 |
| Intermediate | 71 | 2,420 | 2,310 | 110 |
| Aerial | 78 | 1,744 | 1,744 | 0 |
| Silly | 110 | 4,032 | 4,032 | 0 |
| Ultimate | 53 | 2,589 | 2,317 | 272 |

All **15,201** checked static vertices passed. This verifies representation and
corner ordering; dictionary membership alone does not prove every world
position or gameplay interaction.

As a separate spatial check, 731 of the 732 recovered catch-up candidates lie
on complete static terrain tiles. Ultimate's candidate `(13, 13, region 0)`
does not. Keep that exception explicit: do not invent a floor beneath it or
silently move the candidate. The original selection routine performs an
occupancy/height check and can reject candidates.

A private six-course projection shows the expected course silhouettes,
banked Practice runs, Intermediate ramps, Aerial branches, Silly maze and
Ultimate ice field. Original playback comparisons and conversion to the
remake's scale remain necessary.

## Changing surfaces

All additional chunk commands encountered are indirect terrain codes beginning
at `0x800`. They replace a vertex record through a runtime height table, rather
than simply raising the top of a static rectangular patch.

Intermediate's terrain initializer at course-resource offset `0x1b9c` writes
66 height codes. Its update routine at `0x1c38` selects a group from the
animation argument, writes three codes per longitudinal position, and uses
different edge profiles at transitions. The 19 center-height entries describe
offsets `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 18, 19, 22, 23, 26, 30`
above the resting height. These are original numeric data, unlike the current
smoothstep approximation in `wave.mjs`.

The mapping from animation frames to elapsed simulation time, reset/activation
conditions, multiple simultaneous crests, edge records and the remainder of
the changing-surface states still need decoding. Do not substitute these
heights into the current wave function without that mapping.

## Integration still required

### Region boundaries also recovered

The resource's third root pointer contains ordered five-byte region gates.
The audit recovered 10, 16, 15, 22, 12 and 17 gates for Practice through Ultimate.
At `0x12b9e`, the game compares the previous and current tile coordinates. A
gate applies when the marble leaves its inclusive row/column span; the side
of the new coordinate selects the next region. It is not a point-in-polygon
lookup, and a broad swept trigger would change the original crossing behavior.
Region `255` enters the finish branch. Ordering matters: the first applicable
gate ends the search, including when it leaves the region unchanged.

For Practice, the scoring shelf transitions include leaving row 60 into
region 1, row 70 into region 2, and column 65 into region 3, within their
specified spans. These provide actual coordinate anchors for the scoring
offsets documented in PRACTICE-SCORING.md. They have not been stretched onto
the remake's currently rectangular targets.

### Remaining integration

1. Recover and verify changing-surface states and their animation schedules.
2. Calibrate the original coordinate scale and marble radius against playback.
3. Generate shared visible/collision meshes, keeping cliff corner heights,
   holes, solid diorama sides, readable graph lines and the requested edge finish.
4. Move starts, goals, regions and actors into the same coordinate system.
   Do not stretch original catch-up coordinates onto the approximate demo route.
5. Revalidate all routes, hazards, scoring, timed completion and two-player
   catch-up before releasing replacement geometry.

The private working files are `terrain-private.py`, `check-terrain-private.py`,
`plot-terrain-private.py`, the six generated terrain JSON files and
`terrain-overview-private.png` in the September 22 audit directory. They are
research artifacts; no terrain changes were published from this audit.

## Shared terrain compiler implemented

`terrain-geometry.mjs` now builds the visible and Rapier mesh directly from
independent tile-corner heights. A static `terrain` CourseDefinition part uses
`cellSize` and `cells: [[column, row, h00, h10, h01, h11], ...]`. Heights are
relative to the part's `y`; the grid is centered on its `x`/`z`, with an optional
rotation. `w` and `d` must be integer multiples of `cellSize`. A null corner
removes its triangle. Each supplied cell must retain the 00/11 diagonal and at
least one complete triangle. Missing cells remain holes.

The compiler keeps each original diagonal and plane, removes buried internal
walls, and closes exposed walls and undersides at local height `-h`. Adjacent
tiles can retain different heights at cliffs. Crossing cliff profiles split
at their intersection; wall boundaries split at neighboring vertex levels
to avoid unmatched edges. Terrain tops bypass the flat-polygon union pass:
that pass removed one Practice triangle during the six-course validation.
Existing floor/ribbon joining is unchanged. Static terrain currently rejects
motion, presence, rise, bank and bevel settings instead of silently ignoring
them. The editor can import a terrain CourseDefinition; cell authoring is not
yet exposed in the piece palette.

Private fixtures compiled all six recovered terrains at a provisional scale
of 0.1375 world units per original unit (1.1 per tile). Downward Rapier rays at
the interior of every present original triangle were compared against
independently calculated source planes:

| Course | Original triangles checked | Missing hits | Maximum height error |
|---|---:|---:|---:|
| Practice | 3,473 | 0 | 0.00002747 |
| Beginner | 4,783 | 0 | 0.00003357 |
| Intermediate | 4,137 | 0 | 0.00003663 |
| Aerial | 2,590 | 0 | 0.00003052 |
| Silly | 7,130 | 0 | 0.00004273 |
| Ultimate | 4,425 | 0 | 0.00002137 |

All **26,538** checks passed. Every mesh edge has balanced winding and at least
two incident faces. Practice and Intermediate each have one four-face vertical
edge where separate footprints touch at a corner; these are closed junctions,
not ordinary two-face manifold edges. Do not call the complete meshes manifold.

The fixtures retain static patch values at changing vertices solely to test
the compiler. They contain no restored actors, starts, goals or demo routes,
and are not replacement campaign definitions. The local browser imported the
rebuilt Practice fixture successfully and displayed its banks, holes, solid
textured walls, grid and wood platform without captured warnings/errors.
Silhouette rounding, scale calibration and moving-surface integration remain
required. No campaign geometry or physics version changes in this compiler
checkpoint. The decoded original resource files remain outside the site.

The subsequent [native wave integration](INTERMEDIATE-WAVES.md#native-moving-terrain-integration)
adds optional `animation` metadata on terrain parts. It retains the solid
resting board, derives raised kinematic faces from original corner states and
shares them with rendering. Direct generic `motion` on a terrain part is still
rejected. The existing six public campaign definitions have not been switched
to recovered terrain by these compiler/integration checkpoints.

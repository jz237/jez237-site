# Native acid controller

The native-board adapter now uses the recovered acid routes, animation clock,
camera bands and five-slot loader. The public authored campaign still uses its
existing approximate patrols until the native campaign is ready to replace it.

## Recovered rules

- Actor family: track header `+0x20`, global `0x1be48`; source courses 2 and 5
  (Intermediate and Ultimate). Five actor slots, each `0x42` bytes.
- Loader `0x1b7b0`: camera-band entry, direct-route duplicate suppression,
  random choice between two lists, and allocation before unloading. A full
  pool ends the entry scan and still reaches the unloading pass. Region 5
  chooses one route; other indirect entries attempt six allocations.
- Routes contain signed three-byte column/row/next-index nodes. The logical
  origin starts at column/row times eight, without a center offset.
- Direction selection `0x1be4c` / `0x1beba`: advance a reached node, prefer X
  when the preceding X velocity was zero, otherwise prefer Z. Each completed
  cycle advances one eight-unit cell along one axis.
- Animation update `0x1b670`: positive X/Z sequences have seven frames;
  negative X/Z sequences have fourteen. Normally each frame takes two source
  updates. Region 6 uses one update while an active player is in region 6,
  sampled when a new direction is selected.
- Contact `0x1bad8`: the contacted actor's frame divider becomes 28 without
  resetting its counter. At that deadline it becomes one; the next cycle
  boundary selects the normal divider again. Original sound request: `0x1d`.

The local resource decoder recovered 14 possible Intermediate routes and four
Ultimate routes. Original bitmap art and track resources remain private.

## Physical and visual implementation

`native-acid.mjs` owns the source controller. `native-acid-physics.mjs` turns
frame bounds into newly drawn, low, lobed solids. One set of closed triangles
serves both the visible puddle and Rapier contact sensor, preserving the empty
notches along its outline. Frame poses interpolate on the 120 Hz simulation
clock with up to one source update of presentation delay. Rendering interpolates
those same physical poses; route-origin changes never teleport the puddle.

The adapter samples actual board support. Radial columns that extend beyond a
flat supporting edge are trimmed in both meshes; an unsupported center disables
both display and contact. Ray-query coordinates round sub-float seam residue to
`1e-7` world units. This does not change actor or player coordinates. Native
route checks found flat support throughout, with only those numerical seam
misses in the unrounded queries.

Actual sensor contact triggers capture and the frame hold. The captured marble
presentation follows the live puddle; it does not reconstruct an independent
patrol from elapsed time. Hidden slots do not bubble audibly. Snapshots retain
route choices, slot generations, counters, frame poses and capture state.

## Verification and remaining work

Focused tests cover forward/backward timing, alternating axes, retained-counter
capture holds, region 6 acceleration, allocation/unloading order, validation,
closed footprints, continuous physical movement, exact render/sensor vertices,
rotated edge support, and deterministic replay during capture.

Private route checks walk every recovered route through a complete controller
cycle and sample all 40 rim vertices per distinct frame. This is route/support
coverage, not a complete timed playthrough or execution of the original binary.
A local Ultimate encounter produces an ordinary sensor capture at physics tick
78, without forcing actor or player states. Browser inspection confirms the
moving/stretching puddles and capture presentation.

All 18 routes also run in explicit native-board loader fixtures for 1,800
physics ticks each, in batches of up to five pools. The largest center movement
per physics step is 0.04725 world units; the largest individual vertex movement
is 0.09022. Every live sensor matches its rendered geometry and the final 60
ticks replay identically after restoration. These fixtures use inactive players
to isolate patrol coverage. The complete regression suite passes 330 tests.

The lobed artwork is newly authored from recovered bounds, not the original
silhouette. The seeded random adapter is not the original shared RNG stream.
The existing 300-tick acid recovery and fragment paths remain approximate, as
do the synthesized effects. Original captured-player animation and reformation
timing, safe respawn selection around moving hazards, ordinary paired/timed
routes, and the native campaign release still need acceptance work.

# Aerial's four final hammers

Status: recovered script timing and collision-region reference; local native-board
integration. **The public authored Aerial board still omits this group. Full
feature parity is not complete.**

## Original evidence

The four orange moving objects on the final narrow return are visible at
181.5–185.3 seconds in the existing local copy of the
[Amiga longplay](https://www.youtube.com/watch?v=Nfa2etJ84_8).
They are separate from the silver peg beds and red throwing paddle.

Static inspection of the Aerial resource and original executable identifies
subtype 12. The trigger at track offset `0x1a16` loads a group in camera bands
40–64. The special allocator at executable `0xf842` selects one of four groups
of four scripts. Each actor starts at source x=105, y=108/106/104/102, height
16228. Coordinate units for collision are eight per terrain cell.

All sixteen scripts first wait for region 10 (opcode 17). The region-entry
notification at `0x12b02` releases waiting actors. Initial delays are:

| Pattern | Four delays, original updates | Wait after each stroke |
| --- | --- | --- |
| 0 | 30, 0, 30, 0 | 60 |
| 1 | 0, 30, 60, 0 | 90 |
| 2 | 90, 60, 30, 0 | 90 |
| 3 | 0, 90, 30, 60 | 90 |

Each stroke has sixteen graphic entries, two updates per entry. The graphic
IDs are 31,32,33,34,34,35,36,37,38,38,38,38,39,32,31,40. After the stroke, the
script selects the empty graphic table and waits before repeating forever.
The pattern is selected on allocation, not randomly reselected per stroke.

## Drawing and collision are distinct in the original

The update routine writes the current graphic, then advances its pointer. The
collision routine at `0x178a6` reads that advanced pointer. Consequently, the
drawn graphic and collision rectangle can differ for one two-update interval.
The reference controller retains both values.

Graphic bytes 4–7 define the ground-plane rectangle. It expands from `(0,0,8,8)`
to `(-8,0,16,8)`, with a three-unit marble margin. Lower bounds are exclusive;
upper bounds are inclusive. A marble entering from outside is blocked; one
already inside the expanded rectangle is struck. Wait state disables this
collision check. Even the final zero-size rectangle retains the margin before
the wait begins. `aerialHammerContact` preserves this classification as a
reference; the original impulse, stun, audio and integration order remain open.

## Local diorama integration

`hammerSequence` names four `profile: "hammer"` moving parts, a chosen pattern,
and an explicit update rate. Native courses use camera-band loading and region
10 entry. A spatial trigger is also available for isolated workshop inspection.
Simulation owns the controller and includes it in snapshots. Rendering and
Rapier use the same rounded head/stem mesh and hinge pose. The narrow shoulders
remain empty because collision uses the complete moving triangle mesh.

The 3D head, stem, dimensions and pitch are a **reconstruction**, not a recovered
solid model. Rapier contacts use that physical model; the original rectangle
classifier above is not yet the gameplay response. Private native fixtures
retain the provisional 20 updates/second used by the terrain research. Exact
wall-clock cadence and the original global random generator/call order have
not been verified. Existing nearby machinery/impact effects apply; original
hammer cue mapping is still open.

## Verification

- An independent private bytecode reader checks 1,000 updates for each of the
  sixteen source scripts: 16,000 matching placement, graphic-write and collision
  rectangle observations. Original resources remain outside the site.
- Regressions cover all four patterns, region waiting, unload/re-entry, exact
  rectangle endpoints, the drawing/collision pointer difference, closed outward
  mesh faces, physical contact with a resting marble and snapshot continuation.
- A local run on recovered Aerial terrain loads at camera band 40 / simulation
  tick 1002 while in region 8. Ordinary positive-x steering reaches region 10
  and activates the four actors at tick 1170, with zero falls. This begins near
  the final junction; it is not a full Aerial race.
- Browser inspection shows staggered raised mallets on the recovered final
  branch, with no captured warnings/errors. Placement height is taken from the
  source resource. Remaining shape/cadence/response limitations are above.

The original peg selector, six vacuum actors, throwing paddle, other-course
actors and complete native campaign integration remain separate work.

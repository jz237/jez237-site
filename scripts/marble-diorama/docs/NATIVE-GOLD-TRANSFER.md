# Ultimate gold transfer: recovered rules and physical passage

The original gold objects at Ultimate's opening are a transfer inlet and two
static outlet housings. The older remake's hinged catapults and aimed launch
impulses are not supported by the recovered program. The mm-39 native campaign
includes a continuous gold passage with a shared inlet and two exits. Its curved
housing is an authored physical adaptation; the original static housing's
silhouette and collision form still need refinement.

## Source evidence

The Ultimate actor table includes these three entries at source height 16384:

| Type | Cell X,Z | Loading bands | Script offset | Handler |
|---|---|---|---|---|
| 37 inlet | 23,32 | 0–12 | 10022 | `0x1774c` |
| 38 outlet | 31,32 | 0–15 | 10046 | `0x17866` |
| 39 outlet | 31,40 | 0–15 | 10070 | `0x17866` |

Each script initializes its actor, references the empty graphic sentinel at
offset 9946 (`0xffffffff`), then waits with count zero. There is no hinged-arm
animation in these scripts. The earlier reference sequence at 278–283 seconds
shows the recessed gold inlet, separate gold outlet housings and a 2000 award.
Its apparent movement was previously misidentified as a catapult launch.

The inlet handler accepts integer player cells X 22–23, Z 31–32, only while
integer height is **below 16352**. It then:

1. Clears movement mode, stops sound 12 and sets contact cooldown to 18.
2. Sets horizontal velocity to (+4,0), retaining vertical velocity.
3. Requests one random value with limit 2. A nonzero result initially selects
   (240,256); zero selects (240,320).
4. Checks only that selected outlet with clearance threshold 112. If occupied,
   it chooses the other outlet without checking it again.
5. Assigns the chosen source destination, queries its floor, sets contact type
   37 and player state 3, and requests sound 28.

The random mapping is the reverse of the red Silly transfer's branch ordering.
The shared occupancy helper uses integer planar coordinates and the strict
octagonal distance test documented in NATIVE-TRANSFER.md; it ignores height.
Original RNG state and complete race scheduling are not emulated by the new
decision helper.

The two outlet handlers share a broad-phase window: actor minus integer player
X and Z must each be at least −24 and below 40. They call collision form 6.
This window is not a solid collider. Form 6 contains three bounded collision
planes, including two side planes and a rear plane; the final record carries
the end flag in its normal word. A future mesh must represent the visible
housing, rather than turning the entire broad-phase window into a box.

## Verification

`src/native-gold-transfer.mjs` describes these decisions without mutating a
player. Its unit tests cover the exact cell and height boundaries, random call
timing, both choices, occupied and doubly occupied exits, inactive encounters,
self exclusion, integer/height-independent clearance, and housing windows.

A private Unicorn harness executed the original inlet and both housing
handlers for **792 cases**. Every case matches the helper, including destination,
retained vertical velocity, movement/contact state, cooldown and the ordered
RNG, clearance and sound calls. The harness stubs RNG results, occupancy results,
floor lookup and audio services. It does not execute the full race or the
collision form itself. The clearance helper was separately recovered and
checked during the Silly audit.

Original executable bytes, track resources, disassembly, screenshots and
execution fixtures remain outside the published repository.

## Physical integration (mm-39)

`native-courses/ultimate.json` now contains a stationary brass fork beneath the
existing two-by-two inlet hole. Two explicit foundation tunnels admit the
connecting passage without changing recovered top cells, outlet ramps or island
positions. The tube mesh is shared by rendering and collision. Its welded shell
has exactly two oppositely wound faces per edge; all animated terrain frames
compile with the tunnels present.

`native-gold-physics.mjs` applies the recovered camera-band, inlet threshold,
random mapping and occupied-exit fallback inside the real passage. It retains
the selected exit through downstream travel and replay, and applies bounded
force through the visible bore. It never assigns the original destination or
velocity to the active body. Original RNG state is still replaced by the
simulation's deterministic seed/tick choice.

The fork exposed two shared transfer bugs, now covered by regression tests:
an infinite tilted outlet plane could stop flow deep inside a curved passage,
and nearest-centerline progress could jump between perpendicular chamber legs
despite continuous physical movement. Outlet cutoff now requires arrival near
the path end. Bonus tracking accepts that chamber transition only while both
positions remain inside the real chamber and the physical step is small; a
large position jump still cancels the pending award.

Both exits pass localized normal-input tests with zero falls, continuous motion,
a 2000 traversal award, and exact mid-passage snapshot/replay. The maximum
observed single-step displacement was 0.09654 world units. A paired entry pays
both players by tick 650 with zero falls; minimum center separation is 1.09732
for two radius-0.55 marbles (less than 0.0055 penetration). The focused pipe,
gold and traversal suites pass 24/24. These tests begin at the inlet island;
they do not prove a complete Ultimate route.

Full regression: 423/423 passed in 285,943 ms; bundle build and diff whitespace
checks passed. The local Ultimate title view loads the new assembly without
browser warnings or errors. This suite also includes legacy reconstruction
tests and is not a full native-campaign parity claim.

The unchanged 150,000-vertex authoring limit is respected: terrain estimate
133,740 plus actual welded tube vertices 14,928 totals 148,668. When a tube's
conservative chord estimate alone causes a budget failure, validation resolves
its actual mesh before rejecting it. Oversized geometry remains rejected.

## Acceptance still required

- Refine the static gold housing silhouette and bounded collision form against
  the original. The local browser shows curved brass outlet bells; these are
  not yet a match for the original canopy shapes.
- Calibrate passage dimensions, transit and exit motion. Continuous travel is
  deliberate; exact original teleport timing cannot be copied literally.
- Recover exact award timing and repeat/paired policy. The current physical
  traversal award is once per player per assembly.
- Restore original effect data and timing, including the transfer cue.
- Verify complete Ultimate routes with normal controls, timed and paired,
  including occupied exits and downstream encounters. Neither the 792 source
  cases nor the localized physical tests establish full-course parity.

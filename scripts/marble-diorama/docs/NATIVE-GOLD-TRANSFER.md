# Ultimate gold transfer: recovered rules, physical integration pending

The original gold objects at Ultimate's opening are a transfer inlet and two
static outlet housings. The older remake's hinged catapults and aimed launch
impulses are not supported by the recovered program. The native campaign does
not yet include a physical replacement; adding catapults would preserve the
wrong behavior.

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

## Required integration

- Restore the recessed inlet and both static gold housings in the actual
  `native-courses/ultimate.json` board. Keep the native island/branch layout.
- Build and test a continuous physical transfer that matches its visible
  geometry. The source's instantaneous destination assignment must not be
  copied into Rapier. Do not introduce hinged catapults or reuse the old aimed
  launch impulses as recovered behavior.
- Inspect the connecting geometry against the solid foundations and original
  openings. The inlet's two-by-two hole is already present in native terrain;
  the outlet ramps remain part of the recovered surface.
- Apply the original loaded encounter, below-threshold choice and occupied-exit
  fallback only in the real passage. Calibrate dimensions, transit, exit motion
  and repeat awards; restore the original sound data and timing.
- Verify both branches with normal input, paired encounters, replay and full
  Ultimate routes before publication. The 792 source cases do not establish
  any of those physical acceptance requirements.

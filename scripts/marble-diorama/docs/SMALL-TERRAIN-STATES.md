# Practice and Beginner changing terrain

September 22 recovery checkpoint. This is **not full course parity** and is not
yet enabled in the public campaign. Original binaries, decoded geometry and
inspection fixtures remain outside the site repository.

## Original behavior recovered

Practice has six height states affecting twelve vertices around source tiles
x=16..18, y=16..19 (twenty adjacent cells). Its script initializes the first
state, waits 150 actor updates, and tests both active players against the 3×3
footprint beginning at (16,16). A player still there triggers the forward
animation, a hold, a slower reverse animation and removal. Arriving after the
test does not trigger it. Departing after a successful test does not cancel it.

Using initialization as update 1, the visible state writes are:

| Update | State |
| --- | --- |
| 1 | 0 |
| 155, 157, 159, 161, 163 | 1, 2, 3, 4, 5 |
| 228, 238, 248, 258, 268 | 4, 3, 2, 1, 0 |

The player test occurs on update 151. Repeated writes of an already visible
state at updates 153 and 218 do not change the surface. Removal is update 273.
The original condition also requests cue 33; that cue is not connected here.

Beginner has seven states affecting twenty vertices at x=61..65, y=56..59
(twenty-six adjacent cells). Its forward and reverse animation uses a divider
of two updates with waits of fifteen and thirty updates. The cycle lasts
73 updates. Relative to initialization, states 1..6 appear at updates
5, 7, 9, 11, 13, 15; states 5..0 at 34, 36, 38, 40, 42, 44. The second cycle
starts at update 74. Two other actors at this origin use separate graphic
animations; those are not restored by this terrain implementation.

## Evidence and decoding

Practice actor entry 0x111c selects paired animation table 0x1092; the condition
branches to 0x10fa, and the reverse table is 0x10c6. Its six terrain tables begin
at 0xfae and contain nine words each. Beginner entry 0x1c1e selects forward table
0x1a4e, then reverse table 0x1a8a. Seven terrain tables beginning at 0x198a contain
twelve words each. Addresses refer to the privately flattened track resources.

Original actor routines 0xfbe0 and 0xf778 write the current frame **before**
advancing its pointer. The script interpreter selects tables without writing
them immediately. Waits, loop setup and animation setup terminate or continue
the interpreter according to the original state transitions; initialization
writes the first frame immediately. Height decoding includes the four-byte
pattern form as well as encoded high/low corners, and rotates runtime corner
ordering to the static terrain compiler's ordering.

A separate bounded Python model reads the original script words and frame
pointers, independently of the runtime's authored event lists. Both condition
outcomes for each course match across 600 updates: **2,400 frame comparisons**.
This verifies relative update timing, not updates per second.

## Shared runtime

`terrain-sequence` can now use a `timeline` instead of uniform
`secondsPerFrame`:

```js
timeline: {
  rate: 20,
  durationTicks: 27,
  loop: true,
  events: [[1, 0], [5, 1], [7, 2], [19, 0]]
}
```

Event ticks are inclusive, strictly increasing and bounded by the duration.
Each event selects a previously compiled complete surface/collider. The last
write remains through waits. A non-looping timeline retains its final state.
An optional non-looping `condition: {tick, bounds: [x0,z0,x1,z1]}` tests any
active player's local grid tile once; upper bounds are exclusive. Failed
conditions retain frame zero. Condition decisions and activation time are
part of simulation snapshots. Imports limit duration, rate, event count,
frame indices and condition bounds, in addition to existing geometry budgets.

## Validation and limits

- All thirteen state meshes have closed, balanced edges. **54,319** top-plane
  probes have no missing hits; maximum error is **0.000005603 units**.
- The actual live simulation reaches every recovered state. Practice's idle
  marble is set rolling by the raised starting surface; continuing without
  steering eventually falls. This is not a full-course traversal test.
- Tests cover unequal holds, exact loop boundaries, both players, footprint
  boundaries, one-time condition decisions, snapshots, 30/60/120 rendering
  fps and invalid imports. Full suite: **233/233**, 281550.0741 ms.
- Build passes. Local browser imports show the changed slopes, grid, shading
  and solid walls, with no captured warnings/errors. Beginner's inspection
  fixture deliberately uses 2 updates/s and a start near the actor to make
  state changes easier to inspect; this is not timing evidence.

The private full-course fixtures use provisional 20 updates/s and scale 0.1375.
They enable the controller across the full racing-region range for inspection.
The original trigger bytes identify **camera loading bands**, not player
regions. That loader, actor removal/recreation, exact wall-clock cadence,
other actors, cue 33, physical damage behavior, rounding, camera framing and
full timed traversal still require integration/verification. Public authored
layouts and physics identity mm-35 remain unchanged.

# Recovered slinky rules — physical integration pending

The published green enemies still use the earlier curling/proximity
reconstruction. This pass adds a tested source-coordinate controller and
recovers the original routes and animation timings. It does **not** yet replace
their drawing or collision behavior. Full object parity remains incomplete.

## Identity and resources

Course header +0x1c feeds global 0x1abe0. The loader at 0x1a138 explicitly loads
`slink.vlb`. Its green body and yellow mouth match the slinky enemies in the
recordings. Original artwork stays private; the eventual 3D model must be new.

The eight-byte camera entries point to routes of three-byte records:
column, row, next-node index. Spawn coordinates are cell centers (`cell*8+4`).
There are three Beginner, two Intermediate and four Ultimate actors:

| Course / actor | Starting cell | Region | Camera interval |
|---|---|---|---|
| Beginner 1 | 51, 45 | 3 | 8–28 |
| Beginner 2 | 45, 51 | 3 | 8–28 |
| Beginner 3 | 61, 51 | 4 | 9–30 |
| Intermediate 1 | 44, 33 | 1 | 4–21 |
| Intermediate 2 | 32, 45 | 2 | 4–21 |
| Ultimate 1 | 40, 48 | 4 | 0–25 |
| Ultimate 2 | 41, 57 | 4 | 0–25 |
| Ultimate 3 | 58, 52 | 5 | 6–32 |
| Ultimate 4 | 64, 49 | 5 | 6–32 |

All three course resources contain the same animation sequences: idle 11
frames, walking 8, jump 34, capture 30, miss 26, directional recovery 4, and
stationary slide 1. A frame lasts two source updates during normal patrol
and directional recovery, and one during jump, capture, miss and route return.
This is not a generic repeating 0.6-second curl.

## Rules recovered

- **Patrol (0x1b274 / 0x1ac50):** each completed walk covers one eight-unit
  cell along one board axis. The preferred axis alternates based on the last
  step. At a route node the next link is selected; returning to the starting
  node inserts the idle sequence. The route includes additional return nodes.
- **Target selection (0x1af26):** a player must be active, in the same region,
  in an eligible animation and not falling. Absolute planar velocity summed
  across both axes must exceed 0.75 source units. A player already targeted by
  another jumping slinky is excluded. Two eligible players are compared by
  cell-column plus cell-row progress; player zero wins ties.
- **Attack range (0x1b20a):** the source approximate distance must be strictly
  above 24 and below 40 source units. These checks run at patrol animation
  boundaries, not continuously every rendered frame.
- **Jump (0x1a214–0x1a438):** phases 6 through 37 use a recovered 32-value height
  table with a 32-unit peak. Pursuit requires a grounded player at the same
  terrain height. Each update starts planar velocity at displacement/16,
  then adds 1/32 of the difference toward an eight-unit desired velocity.
  Reusing last frame's velocity would produce a different trajectory.
  The source rejects movement onto a different terrain height.
- **Landing (0x1b472):** below seven units produces a capture intent; from
  seven to below twelve produces a four-unit push intent; otherwise it misses.
  Capture and miss use distinct animations before returning to the nearest
  route node. These intents do not move or kill a player in the new module.
- **Contact recovery (0x1aa38 / 0x1b3a4):** hitting a patrolling or returning
  slinky transfers incoming planar motion to its slide state. Source drag mode
  2 multiplies the normal drag table by four. Once stopped, it plays a recovery
  pose chosen from the impact direction, then jumps at the contacting player.
  A lower terrain boundary starts recovery; a higher boundary starts the jump
  immediately. Repeated bumps do not replace an active attack target.
- **Camera lifecycle:** entry is latched until the next source update;
  departure removes the actor and a later entry resets its state.

The reference state retains original grid alignment after an attack so it can
be compared with the recovered branches. That alignment must **not** be applied
as a position snap to a Rapier actor. Physical integration must make route
return visible and continuous, use the same articulated solids for drawing and
contact, and resolve capture/push intents against actual contact. The original
proximity box and player position rollback are not suitable replacements.

## Evidence and acceptance still required

Ten regressions cover strict range and movement thresholds, paired target
reservation, axis selection, animation boundaries, pursuit arithmetic, landing
intents, slide recovery, height boundaries, camera reset, snapshots and event
delivery at different update cadences. Events are preserved when multiple
source updates occur in one call and are not repeated between source updates.

An independent Python integer transcription agrees with 8,100 observations
across all nine original routes and all seven controller modes. Animation
lengths also match all three original course resources. Inputs are synthetic;
this is a comparison with recovered branches, not original-game execution or
proof of physical course traversal.

Still required: a new articulated 3D body and matching collision solids,
physical slide/jump/route-return integration, real capture and rebound behavior,
capture/reassembly animation and effects, original update-rate calibration,
ordinary approaches on every native board, paired encounters, editor/replay
checks and publication. Neither the source controller nor the private resource
decoding changes the public game's enemies yet.

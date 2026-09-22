# Recovered slinky rules and physical integration

The published green enemies still use the earlier curling/proximity
reconstruction. Local native-board fixtures now use the recovered controller
with new articulated green tubes and yellow mouths. Their visible triangles
also supply their physical contact surfaces. The public campaign has not yet
been replaced, and full object parity remains incomplete.

## Identity and resources

Course header +0x1c feeds global 0x1abe0. The loader at 0x1a138 explicitly loads
`slink.vlb`. Its green body and yellow mouth match the slinky enemies in the
recordings. Original artwork stays private; the 3D model is newly constructed.

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

## Physical adapter

An optional `nativeSlinky` definition on a `muncher` selects a source region,
camera activation interval, and route of `[column, row, nextIndex]` records.
It requires matching native camera, dynamics and terrain-navigation settings.
The older authored enemy definitions retain their existing behavior.

`native-slinky-physics.mjs` drives a kinematic articulated body. The source
controller runs at the native rate, with root positions and mesh vertices
interpolated at 120 Hz. Rendering interpolates those same physical poses.
Walking advances across each cell continuously, including animation wraps and
changes of direction. The source's post-attack cell alignment is converted
into visible route-return movement. Its below-floor landing squash is kept
above the supporting terrain through the visible body geometry.

`slinky-shape.mjs` constructs a ribbed hollow tube, an inner wall and annular
end rims. The green shell and yellow mouth are both triangle meshes; a capsule
or hidden filled mouth is not used. Vertex correspondence stays fixed when a
walking direction changes. Source jump/capture/recovery states bend and squash
the same geometry used by Rapier.

Actual patrol/return contacts invoke the recovered slide and retaliation rules
using incoming marble velocity. They no longer immediately remove the player.
A capture intent alone has no effect: the target must contact the closing
body during the capture state. Contact disables control and collision; the
captured shell stays at that measured contact position while shrinking inside
the mouth. The loss is recorded once when the source capture sequence ends,
then eight solid sectors reform at the saved respawn destination. Rebound is supplied by physical
shell contacts; the source's direct player-velocity replacement is not applied.
Reassembly currently takes 90 physics ticks and uses new fragment paths; the
original player reformation program still needs calibration. Capture, release
and physical bump have separate effects-bus cues. These cues are newly
synthesized effects, not recovered Amiga samples. The source requests sound
0x1a at capture (0x1b540), then 0x0f/0x10 and 0x13 at release/reformation
(0x1b606, 0x14706); exact sample restoration remains open.

If support disappears beneath a slinky or it is displaced over an edge, its
same body is released to gravity and retired after the native fall distance.
Camera reentry restores the kinematic patrol. A void sentinel is never used as
a physical height. Board collider handles are saved explicitly with snapshots:
classifying restored static terrain by a collider wrapper's parent association
could otherwise report a false void before the first replayed step.

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

Nine additional physical regressions cover definition validation, rotated
coordinates, mesh topology and throat rays, shared collision vertices,
continuous patrol articulation and route return, deterministic snapshots,
moving-player acquisition, contact-driven recovery, physical capture and the
absence of proximity-only removal. All nine native actors also completed
5,400 physics ticks each on their respective private boards with continuous
patrol and shared-mesh checks. These patrol fixtures explicitly load actors
and disable the player; they are not ordinary camera traversal evidence.

The subsequent capture pass adds unsupported-body fall/reentry and exact
capture-to-respawn replay checks, plus presentation, delayed single-loss and
paired sound-key regressions. The full suite passes 322 tests. In a private
Beginner encounter with a stationary marble beside the route, real contact
occurs at tick 234, capture at 532, loss/reformation at 672, and respawn at 762.
The browser inspection shows the marble inside the closing mouth while its
fall count is still zero, followed by eight reassembling sectors and one loss.
The pause panel now sits in a corner; phone touch controls hide while paused.
Desktop and 390-by-844 viewport inspection passed. This is not physical-phone
performance evidence or original-sample listening verification.

The Beginner encounter fixture imported through the local editor and rendered
the three green/yellow bodies without browser warnings or errors. A stationary
player remained racing with no falls during that inspection. This is visual
and import evidence, not a complete encounter playthrough.

Still required: original reassembly timing, sound samples, update-rate
and rebound calibration, ordinary approaches on every native board, paired
encounters, complete editor/replay acceptance and publication. The native
fixture data and these runtime improvements are not published yet.

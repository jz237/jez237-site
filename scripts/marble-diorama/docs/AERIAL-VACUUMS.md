# Aerial vacuum deployment and capture

## Original evidence

[Ironclaw / World of Longplays Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8), inspected from the local 25 fps video.
Close-up crops at 147.40-149.72 seconds, sampled every 0.08 seconds, show:

- A yellow rounded intake with a recessed solid interior, rather than a frame
  through which the scenery remains visible.
- The marble breaking into colored fragments around 147.64-147.72. Fragments
  converge on the intake and disappear by approximately 148.36.
- Fragments returning above the track from approximately 148.68, then gathering
  into a marble by 149.64-149.72. Total capture/reform duration is about 2.1s.
- The yellow mouth sinking into the track between approximately 149.08 and
  149.32. It does not simply disappear at full height.

These are approximate video observations. Sampling, camera movement and the
original sprite frames limit precision. The private reference sheet is not
redistributed in the game.

## Implementation

All three mouths now use a 0.24-second rise/retraction at the ends of their
existing presence windows. Their concave meshes have rounded lips, a recessed
cavity and a solid rear housing. The same vertices form their physical colliders.
A ray can enter the aperture and then hits the back wall; it cannot pass through
an empty rear frame.

Each vacuum zone links to its mouth. A shared pose function controls the mesh,
kinematic collision surface and intake position. Suction and proximity audio
follow that position, scale with deployment, and cease when the intake center
passes below the track. There is no active suction point left above a buried
nozzle. Workshop validation rejects unsupported motion on linked mouths.

Vacuum capture has a separate 252-tick / 2.1-second recovery interval. Eight
closed spherical sectors retain the player's striped marble material. They draw
into the intake, disappear briefly, scatter back and assemble at the same saved
position used by physical respawn. The fragments are presentation, not eight
independent colliding marbles. Their poses are pure functions of the simulation
clock; the saved capture state makes pause and replay deterministic. The existing
vacuum and break cues are triggered on capture. Ordinary falls retain their
previous behavior.

Physics/replay version is `rapier-0.20.0-mm-18`.

## Limits

Ten-second repeat cycles and the 3/5/6-second windows remain provisional, as do
precise placement, dimensions, orientation, force, capture threshold, eight-sector
fragment layout and curved fragment paths. The recording establishes the broad
sequence and approximate durations, not an exact original algorithm. Capture
sound has not been certified against the original effects. Other death causes
still use the earlier generic effect and recovery interval. Full parity remains
incomplete.

## Checks

Tests cover cavity clearance and the rear wall, physical retraction, shared
moving suction position, silence below the surface, capture duration, physical
respawn at the reassembly destination, snapshot restoration, stable fragment
poses when paused, and closed fragment geometry with the original marble volume.
Browser close-ups verify the full intake, fragment intake, partial withdrawal,
returning fragments, full withdrawal and the restored marble without captured
warnings/errors.


## Track-edge alignment follow-up (mm-19)

The 150.80s frame shows the first two mouths on the rear edge of one zigzag
leg, facing onto the track, and the third mouth turned onto the following leg.
The earlier reconstruction incorrectly gave all three the same orientation.
The housings now align with the supporting edge: two on the [-2,36] to [-12,44]
authoring segment, one on the [-12,44] to [0,52] segment. Their fractional
positions (0.25,0.70,0.50) and 1.3-unit centerline offset remain approximations;
the original absolute dimensions have not been recovered. A collider ray checks
that a point in front of each opening lies on the playable surface.

A linked housing now owns the intake origin and facing direction. The zone's
local intakeHeight specifies the height within that housing. Editing either the
housing or its linked zone moves/rotates both, and deleting either removes the
complete hazard. JSON export/import retains the relationship. Stale absolute
zone coordinates cannot leave a second invisible suction point behind.
Physical front-side capture and rear-side rejection also pass after moving and
rotating the edited housing. Existing acid, pipe, landing-pad and general editor
transform checks retain their behavior.


September 21 mm-22 presentation correction: spherical sectors now use their
proper portion of the full marble texture, and return rotations converge to
identity before physical respawn. This removes extra repeated stripes and a
final rotation discontinuity. Capture durations and physical outcomes are unchanged.

## September 22 — six recovered actor scripts (local native boards)

Static inspection establishes **six** Aerial mouths, not three. The public
reconstruction still has three; this new controller is integrated into the local
native-board fixture pending campaign replacement and acceptance.

| Actor | Source cell x,z | Subtype | Wake region |
|---|---|---|---|
| 0 | 39,36 | 11 | 30 |
| 1 | 47,36 | 11 | 31 |
| 2 | 50,47 | 13 | 32 |
| 3 | 33,42 | 11 | 33 |
| 4 | 41,42 | 11 | 34 |
| 5 | 44,53 | 13 | 35 |

All six use source height 16300 and camera loading band 6–30. Region entry
wakes a waiting mouth. Eight deployment graphics, two holding graphics and
nine withdrawal graphics run at divider two. After deployment and each hold
loop, either active player in the mouth's region or the next region keeps it
open. Otherwise it withdraws and waits for a new entry. Region 4 clears the
preceding group. A captured player keeps the mouth occupied for 32 native
updates, then redirects it into withdrawal/removal. Unload/reload starts a
fresh group. Controller state and pending callbacks are saved in snapshots.

The front attraction rectangle, smaller capture rectangle and signed fixed-point
velocity increment are recovered from both subtype handlers. Attraction is
active only in the holding phase. These fields rotate/translate with the actual
housing, and audio uses the same active intake. Contact against the housing uses
its rendered solid mesh throughout deployment and withdrawal. The source body
block/crush classifier is reference evidence only; it does **not** cause
invisible rectangular collisions or position rollback.

### Evidence and checks

- An independent interpreter reads original script words and graphic tables.
  Three 1,000-update scenarios agree on **17,640 actor states**, including two
  players, capture retirement, region-4 clearing and reloading.
- On recovered Aerial terrain, the original camera loads the group at band 6
  (simulation tick 186). Ordinary positive-z steering enters region 30 and wakes
  mouth 0 at tick 354, with zero falls. It reaches its holding image.
- All six intake centers have supporting original terrain at the expected
  marble-radius distance; maximum ray error is below 0.000001 world unit.
- Regressions cover validation, script frames, paired occupancy, attraction
  boundaries/quantization, edited mouths, active sound state, real-marble
  capture, solid colliders and snapshot continuation.
- Browser inspection shows a rounded, recessed yellow housing on the original
  zigzag, zero falls and no captured warnings/errors. That visual fixture uses
  an inspection-only loading band; the original band/gate are checked above.

### Remaining differences

The native fixture uses the existing provisional **20 updates/second**. The
synthetic test fixture uses 50 to exercise a non-divisor clock; this is **not
evidence of the Amiga's cadence**. Script counts are recovered, but wall-clock
cadence is unverified. The source fragment routine staggers eight fragments by
two updates and hides each after eight updates. The last disappears around
update 22, before the 32-update capture counter expires. Dividing 32 by the
approximate visible inhale duration would therefore be an invalid calibration.

Housing dimensions and the mapping of sprites to four deployment heights remain
reconstructed. The existing 2.1-second fragment/reform presentation is unchanged;
it is not a port of the source screen-space fragment algorithm. Original body
response, the subtype-13 previous-position ambiguity, sound assignment, and
repeated tile-entry callbacks inside region 4 remain open. These checks verify
a local interaction, not a complete original Aerial race. Full parity and public
native-board replacement remain incomplete.

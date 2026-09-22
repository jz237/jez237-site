# Native Practice training objects (mm-41, local)

The recovered Practice board now includes ten red physical rails. Eight frame
the upper training pits and two guard the lower approach. They were absent
from the native board, although the older reconstruction had different rails.
The three landing shelves now use source-coordinate reward bands and physical
landing detection. Full-start alternate shelf routes remain unverified.

## Original rail evidence

The Practice actor scripts initialize eight short rails (types 26–29) in camera
bands 0–10, and two long rails (types 30–31) in bands 6–29. Their graphic pointer
4010 is the empty sentinel; the red artwork belongs to the static board. Type
17 controls the changing training steps and has no rail contact handler.

| Type | Actor cells X,Z | Handler |
|---|---|---|
| 26 | 24,16; 24,28; 24,34 | `0x16d0e` |
| 27 | 16,24; 28,24; 34,24 | `0x16ca4` |
| 28 | 28,16 | `0x16de4` |
| 29 | 16,28 | `0x16d78` |
| 30 | 48,51 | `0x16ebc` |
| 31 | 52,47 | `0x16e50` |

The handlers compare integer actor-minus-player coordinates. Interior hits
request a rebound on the axis across the rail. End zones additionally rebound
along the rail only when velocity points toward that end. All accepted hits
request sound 34. At `0x1807c–0x180a0`, the original restores the previous
coordinate and negates the corresponding velocity. The remake does not copy
those position/velocity assignments: Rapier resolves contact against the visible
rail surface.

`trainingRailContact` records those original decisions without moving a player.
A private Unicorn harness executed all six original handlers for 5,850 boundary,
side and endpoint cases with negative, zero and positive velocity. Every case
matches the helper. Only the audio service is stubbed. The harness stops before
the original position rollback. This establishes the source window and rebound
logic, not exact physical equivalence of a rounded 3D rail.

## Shared physical geometry

Each rail uses a closed capsule-shaped mesh with rounded ends and a circular
cross-section. Its linear rise follows the supporting slope. The eight short
rails descend six source height units; the two long rails are level at 16348.
Their placement uses the recovered actors and contact extents, inset by the
source marble radius, with heights measured from the existing collision terrain.
The 3D thickness and rounded contact response are authored approximations.

The `rail` profile is a static wall in CourseDefinition. Render and collision
use the same 386 vertices per rail, including rotations and slope. Validation
counts those vertices and rejects moving, bevelled, banked or invalid profiles.
There are no invisible collision boxes, active body snaps or extra rebounds.
The physical rails remain part of the diorama when the camera scrolls away;
their native band is evidence about original loading rather than a reason to
make a visible nearby rail intangible.

## Validation and limits

Full regression: **433/433** passed in 322,416 ms. The bundle builds successfully;
browser warning/error logs are empty. The full suite includes tests of older
reconstructions and does not prove complete native-campaign parity.

- Every rail is closed, outward-wound and has exactly two opposite faces per
  edge. Ray tests hit the rendered side skin from both directions on all ten.
- A bounded-input approach contacts a real red rail collider continuously and
  restores exactly from a mid-approach snapshot. It has no falls. This is one
  contact scenario, not exhaustive rail traversal or turbo calibration.
- Existing full-start native Practice solo and paired routes still finish on
  difficulties 0 and 7. These routes do not cover all optional training paths.
- The local title view shows the ten rails around the original pits and lower
  approach. Native foundation rounding and course framing remain separate work.
- The actual browser's two-player Watch demo completes with both players
  finished, zero falls and scores 1533/1534. This demo is untimed; the separate
  model tests exercise timed difficulties 0 and 7.
- Exact original sound 34 is not yet restored. Current contacts use the remake's
  measured-impact audio. Rebound calibration, top/below-rail behavior and paired
  rail encounters still need acceptance against original gameplay.
- PRACTICE-SCORING.md describes previous work on the older reconstruction;
  its route checks do not validate these newly integrated boards.

## Native landing awards

A separate private harness now executes the original landing branch from
`0x1534c` to `0x155d2`. All 2,079 checked cases agree on course/region gates,
both player bits, all four initial claim masks, and offsets −9 through 33.
The marker, effect, multiply and award service calls are stubbed; this is not
an execution of the original airborne/landing detection or a full race.

After an eligible Practice landing in region 1, 2 or 3, the original consumes
the player's shared claim and requests effect 42 even if the coordinate does
not pay. Region 1 uses integer Z minus 488, region 2 uses Z minus 568, and region
3 uses X minus 528. Negative offsets do not pay; nonnegative offsets select
`min(13, 7 + floor(offset / 4))`, with the recovered 3000–6000 amounts.
Other regions/courses and an already-used player bit have no effect.

The integrated intent function matches all 2,079 original branch cases. Scoring
uses the actual marble position in the recovered terrain frame and its current
navigation region. One claim is shared across the three shelves per player;
falls and snapshots preserve it. A negative-offset landing consumes the claim
without points and still emits an effect event.

Physical contact ends the airborne interval. The adapter qualifies a descending
marble more than eight source height units above the floor, or over a void.
It does not move the marble. This adapts the original descent rule; original
contact-type scheduling and other airborne-mode entry paths remain unverified.

Seven red/cream numbered bands are derived directly in the view from the same
source intervals. They are explanatory paint on the existing flat shelves,
not a claim of exact original bitmap artwork. The final 6,000 band caps the
award beyond the painted interval. Paint does not constrain the source region
or create a separate collision area. Translation and rotation are tested;
arbitrary shelf reshaping in the editor remains outside this validation.

### Landing validation and limits

- All 21 localized physical drops (three shelves, seven bands) award exactly
  once with the expected amount and no falls. These fixtures begin above the
  shelves with the corresponding navigation region; they do not prove access
  from the starting line.
- Walking and shallow hops do not claim an award. Negative-offset claims,
  independent two-player awards, fall/respawn retention, and exact midair replay
  restoration pass in the six focused tests.
- Existing timed full-start Practice main routes still pass solo and paired
  on difficulties 0 and 7. They bypass the optional landing shelves.
- Full-start alternate approach experiments using bounded normal input stall
  on the uphill approach near source X425, Z453. No successful alternate route
  has been added. Route choice and control calibration still need investigation.
- Browser inspection confirms paint appears on all three shelves. At the title
  overview it is small; course framing and final artwork remain unfinished.
- Effect 42 currently uses the remake's collect cue. The exact original sound
  remains to be restored and checked by listening.

# Intermediate traveling wave strip

## Primary evidence

Reference: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
Inspected the local original recording from 121-131s, with a denser 121-126s
sequence at 0.20s intervals. Reference frames remain private.

The upper green section is a continuous straight strip. Discrete raised crests
move toward its far end, separated by long flat areas. The wave has a steep
rear face and a longer rounded forward slope. The flat surface does not sink
into alternating negative troughs. Up to two crests appear on the visible strip.
The previously authored two short sinusoidal sections did not match this.

Approximate manual front-edge crest positions in the 498px-wide frames:

| Video time | Crest screen x | Notes |
|---|---:|---|
| 121.0s | 151 | First visible crest |
| 122.0s | 224 | Same crest |
| 123.0s | 293 | Same crest |
| 124.0s | 371 | Same crest, approaching the end |
| 124.0s | 198 | Following crest |

The camera scrolls vertically, so these x measurements avoid that scroll.
They imply approximately 73px/s travel and about 173px crest separation,
or roughly 2.4s between crests. The edge is pixelated and the chosen landmark
is approximate; this is not a recovered original numeric constant.

## Implementation, physics version mm-20

- One continuous 16.4-unit strip connects the existing entrance and exit.
- Positive asymmetric crests repeat every 2.4s, separated by 9.6 units. Each
  crest is 3.6 units long and 2.2 units high, with a short smooth rear rise and
  a longer smooth forward descent. The two end anchors taper over 0.8 units.
- Panels use a shared height function. Both top and bottom edges join exactly.
  Undersides retain the flat footprint rather than opening gaps between tilted
  slabs. The same eight vertices drive each rendered panel and convex collider.
- Graph lines and textured side colors use shared world coordinates on waves,
  preventing per-panel resets and triangular stripe discontinuities.
- The alternate-route demo observes a rising entrance crest, then crosses using
  ordinary bounded steering/turbo. It keeps speed through the straight section
  and begins the exit turn earlier; it receives no injected position or velocity.
- Imported sinusoidal waves retain their existing shape. New crest fields are
  validated, serialized normally and evaluated on the physics clock.

## Checks and limits

New tests cover positive/flat profile intervals, measured-direction propagation,
periodicity, shared top and bottom edges through two periods, valid JSON round
trips and malformed crest fields. A physical marble is lifted by a passing crest;
a mid-motion snapshot restores the same subsequent contact outcome.

The complete orange-pipe alternate route passes with no falls. Separate native
runs beginning at the wave entrance with phase offsets 0, 0.25, 0.5 and 0.75 all
finish with zero falls (15.94-17.66s from that entrance to the course finish).

The scale, exact strip orientation/placement, profile dimensions, end taper,
original sprite sequence and marble response remain reconstructed. The lower
narrow rolling lanes still require separate comparison. This change improves a
specific observed mismatch; it does not establish full Intermediate parity.

### Lower-lane observation

The visible upper portions of both lower cyan ramps are pixel-identical in
all eight sampled frames from 123.0 through 124.4s (0.2s increments, fixed
camera). Compared source rectangles x=0..99/y=235..349 and
x=166..293/y=244..349. The upper traveling strip visibly changes in those same
frames. This supports keeping those visible lower sections static; it does not
prove the shape or behavior of every section outside those rectangles. Do not
add lower-lane motion merely because earlier checklists called it missing.


## Workshop follow-up

Wave strips now carry a validated optional strip identifier and appear as one
object in the editor. Move and rotation transform every panel together around
the strip center. Rotation updates the motion heading with the editor's correct
sign instead of writing the forbidden static angle. Remove and the erase tool
remove the entire grouped strip and clear linked route references.

Older imported waves without a strip identifier remain individually editable;
rotating them also keeps their course data valid. The identifier is authoring
metadata only: wave motion and campaign physics remain at mm-20.

Regression checks transform all eight vertices of every panel through several
wave phases, verify joined top/bottom edges, compare compiled JSON round trips,
query live collider tops and restore physical lifting from snapshots. Unrelated
parts and other wave groups remain unchanged. A shared waypoint used in several
routes moves once; moving a start, goal or unlinked hazard no longer shifts all
unattached demo waypoints.

Browser checks on a custom copy of Intermediate verify whole-strip selection,
rotation, movement, removal, undo/redo, undoing all edits and immediate playtest.
No custom test course was saved. No warnings/errors were captured.

## Original height tables recovered, September 22

The [terrain audit](TERRAIN-REFERENCE.md) located Intermediate's original
initializer, update routine, center-height values and edge-profile tables in
the course resource. This supersedes the missing-data assumption behind the
current smoothstep profile. Frame timing, activation/reset conditions and
complete changing terrain still require mapping; the recovered tables have
not yet replaced the playable strip.

## Native corner states and launch sequence implemented

`intermediate-wave-state.mjs` now expresses the original wave in height units
and native actor updates, independently of the current approximate strip. It
returns all four corner heights at each left, center and right vertex record
for 22 longitudinal rows. Interior center records cover three vertices. The
tall left edge is 48 original units above the lane; it rises with the crest
except at the final outer corner. Right-side entries, complete connections and
exits retain their distinct fixed and absent corners. They cannot be modeled
by a uniform cross-section or by stretching the center curve across the lane.

The original resource's 19 height samples and eleven phase rows define the
shape. A private independent reader decoded all original bit-packed and
byte-pattern corner records. Its **96** initial/single/multiple-wave states
match all **25,344** corner values returned by the implementation. The check
includes every argument 0–90 and overlapping actor orders. State resets once
per update, then actors overwrite their rows in order; heights are neither
added nor combined by taking their maximum.

### Actor sequence

- Five starting animation frames use divider 4, then two frames use divider 2.
- Nineteen four-frame traveling loops and seven ending frames use divider 1.
- Frame 30 releases eligibility for another wave. This is animation update 47.
- Animation reaches frame 90 and removal after 107 animation updates.
- A newly allocated actor first spends one update initializing its script.
  The initializer ends on the first animation command; it does not run that
  command's counter during the same update. Repeated launches are therefore
  **48 native updates apart**, including initialization, while a player remains
  active in original region 9 or 10. Either player can enable a launch, and two
  players do not create duplicate waves.
- Leaving those regions prevents new launches; existing crests finish, and
  released eligibility waits for a player to return.

Evidence is in the private original executable: allocation at 0xf6f4/0xf96a,
state-3 initialization at 0xfb18, state-2 counters at 0xfbe0, launch eligibility
at 0xfc8a, loop count at 0x101a0/0x101c2, removal at 0x102e6/0xf9a2 and initial
eligibility at 0x3044. The resource sequence begins at 0x1a78. Inspection of
0xfd02 and 0xfc6a also confirms that the terrain table resets every active
update, but slow startup actors write it only on their divider's due updates.
The state machine exposes those writes explicitly rather than retaining a
previous crest through intervening updates.

### Geometry checks and remaining integration

The private fixture applies the changing corner records to their original
vertices (x81–85, y77–98), including all **115 affected cells**, then compiles
the entire board. Across the 96 states, **22,080** independent Rapier height
probes pass, with no missing hits and maximum error 0.00005188 world units.
No state has open or unbalanced mesh edges. These are static snapshots of
deformation, not a test of kinematic velocity transfer or a complete race.

Five new regressions cover edge/connection/end shapes, stable holes, actor
overwrite order, update counters, initialization, both-player eligibility,
leaving/re-entering trigger regions and deterministic JSON state restoration.
Together with terrain and existing wave-contact tests, **13/13** pass.

The new module is not connected to the campaign yet. Native update frequency
in seconds, shared occupancy with non-wave actors, region transitions, moving
collider velocity transfer and calibrated scale remain required. Rendering
and physical deformation must share the chosen interpolation. The current
published `wave.mjs` strip and mm-35 behavior are unchanged; do not call these
checks full moving-wave or Intermediate parity.

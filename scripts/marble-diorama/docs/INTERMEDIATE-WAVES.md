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

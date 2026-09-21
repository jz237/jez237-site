# Aerial peg beds

## Primary reference

[Ironclaw / World of Longplays Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8), local 25 fps copy.

Aligned crops at 161.28-162.60 seconds show a bed with twelve flush silver caps.
A stroke starts around 161.56, reaches full height by 161.72, holds through
162.08, and withdraws by 162.28. These observations support an approximately
0.20-second rise, 0.36-second hold and 0.20-second return; they are not a claim
of recovered internal game ticks.

The 166.20-169.44 sequence shows four pegs rising together around 167.28-167.88,
then a perpendicular line of three around 168.12-168.72. Consequently a single
synchronized line of three pegs was inadequate. The source shows longer flush
intervals as well as these closely spaced strokes.

## Reconstruction

Each of the three current bed locations has a 3x4 grid of rounded metal pegs.
The caps sit 0.002 units above their supporting flat surface, avoiding buried
caps. The upper bed is moved slightly back onto its landing; the lower bed is
placed on the straight flat stretch after its turn. Each peg has a closed round
hull whose visible vertices also form its physical collider.

The stroke uses the measured durations above. A seeded, stateless selector
chooses one row, one column, or an idle slot every 0.88 seconds. The original
selection law, idle probability, exact dimensions and positions remain unknown.
This selector is a reproducible approximation, not a recovered Amiga algorithm.
The same simulation clock controls rendering, collision and proximity sound.
Physics/replay version is `rapier-0.20.0-mm-17`.

Demo routes stop before each bed and forecast a crossing window from the shared
peg poses, allowing for acceleration and the marble radius. They use ordinary
bounded movement input; they cannot disable the pegs or reposition the marble.

## Verification

Tests check all three twelve-cap layouts, both perpendicular line orientations,
flush return, input validation, round hulls, physical lifting of a resting marble,
render/collider pose agreement, and exact mid-stroke snapshot restoration.
The existing paired Aerial traversal retains its zero-fall and bounded-input
assertions. Browser close-ups show flush caps, three raised pegs, and the
perpendicular four-peg line without captured warnings or errors.

This corrects one hazard family. Full Amiga parity remains incomplete.

# Silly upward transfer

## Observed sequence

[Ironclaw's Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8),
215.5–218.5s, shows entry below a downward-facing red bell, disappearance into
its neck, then emergence from a flared upper outlet. Entry is visible near
216.3s and the 2000 award appears near 217.9s. The red housing holds its
orientation relative to the board. A second upper horn and looped side detail
are visible. [Hipoonios' Amiga replay](https://www.youtube.com/watch?v=K_F_IbG87LM),
164–166s, shows emergence from that other horn (upper/right in the isometric
image), whereas Ironclaw emerges from the lower/left horn. Both outlets are
functional in the reference; the selection rule and internal motion are unknown. This is not evidence for a rotating wheel carrying the marble.
Private `iron-lift-*` frames, `iron-lift-motion.jpg` and `transfer-enlarged.png`
retain the observations. The latter is only a nearest-neighbor inspection crop.

## Reconstructed physical passage

The former uniform sloping tube becomes a downward-facing bell, vertical neck,
curved upper passage and flared outlet. A shared `tubeRadiusAt` function provides
the mouth/throat radii to mesh generation, scoring and airflow. Inner and outer
surfaces and open annular rims belong to the same visible/collision mesh.
The upper course assembly, its enemies, routes, goal and checkpoints move up
six units together, allowing an eight-unit floor-to-floor ascent.

A bounded acceleration follows the center curve and centers the sphere inside
the bore. It acts through Rapier impulses; it never sets the marble's position,
velocity, rotation or visibility. The player retains its real body and collisions.
Airflow is limited to the interior and inlet reach, ends beyond the outlet, and
slows near the exit so the marble can land on the upper platform. The demo sends
zero steering during carriage and brakes at the landing. Completing the whole
passage still pays the reference-verified 2000 once per player.

Imported static tubes may carry validated `flare`, `flowSpeed` and
`flowExitSpeed` values. Existing uniform unpowered pipes are unchanged. Replay
stores ordinary physics state and the active-transfer indicator. A synthetic
airflow effect uses the effects bus only while a racing marble is being carried;
it is not claimed as the original Amiga effect.

## Evidence limits

Both upper outlets now work. The side loops are not yet reconstructed. The exact Amiga routing/selection rule needs verification. Exact cross-sections, scale, upper-platform
height, transfer duration, suction law and outlet velocity remain provisional.
The current force law is a physical reconstruction, not recovered Amiga code.
The later source audit recovers Silly's uphill slope acceleration while airborne
gravity stays downward; see [NATIVE-SLOPES.md](NATIVE-SLOPES.md). The red transfer's
selection and carriage law remain separate from that slope rule.

## Checks

A marble starting at the actual inlet rises and exits with no steering, earns
2000 without falling, and reproduces the same state/events after a mid-passage
snapshot. Every measured step remains continuous. Geometry and airflow share
cross-sections; tests reject forces outside the bore and validate imports.
Existing solo and paired full-course tests retain collection, transfer, zero-fall
and finish-time assertions. The paired demo's right bird-field speed is 3.8,
using the same bounded controls and unchanged bird flight/collision definitions.

The second-exit evidence is retained in `hip-transfer-motion.jpg` and individual
`hip-transfer-*` frames; it must not be replaced by a decorative closed horn.


## Second outlet (mm-16)

The transfer now has one downward bell and two upper horns feeding the left and
right maze approaches. Three tube legs meet a hollow convex chamber. Chamber
faces covering ports are removed, and their exact rim vertices join the legs.
Both sides of the wall and the mouth rims use the shared render/collision mesh;
there are no closed overlapping walls or invisible shortcuts. A manifold check
requires exactly two incident triangles at every wall edge. Both inlet-to-outlet
physics tests rise continuously, award 2000, and replay from an in-flight snapshot.

A seeded choice is retained for the whole passage and replayed with the player's
state. A nearby marble at the chosen exit causes the other outlet to be preferred
when that outlet is clear. Demo steering resumes on the maze connected to the
actual exit. The right approach passes around the new horn's lip. The force slows
inside the chamber before accelerating along the chosen outlet; chamber inclusion
uses the same inner convex hull as its physical wall.

### Additional reference and its limits

[Marble Love's arcade collision reconstruction](https://github.com/magno73/marble-love/blob/113cf5de969ff62cb1d7b901340206f30122f658/packages/engine/src/sub-29cce.ts)
contains two-way random exit choices in `runTube22` and `runTube25`, with a
proximity check before selecting a destination. Its
[proximity helper](https://github.com/magno73/marble-love/blob/113cf5de969ff62cb1d7b901340206f30122f658/packages/engine/src/string-helper-17cb8.ts)
checks active objects around that destination. This was read as behavioral
reference only; no source was copied or executed. The public source labels these
handlers as Beginner mechanisms; the available level-five start snapshots did
not identify the Silly transfer's handler. Consequently this supports an arcade
analogy, **not a verified Silly or Amiga selection rule**. The seeded hash,
clearance distance, choice timing, symmetric branch dimensions and chamber shape
remain reconstruction choices. The two functioning Amiga exits themselves are
verified by the two recordings above.

The same repository describes a Silly trackball sign change. That alone does not
establish the Amiga's screen-space input or gravity behavior, so neither has
been changed on that basis.

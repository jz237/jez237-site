# Silly miniature inhabitants

## Amiga reference

[Ironclaw's Amiga longplay](https://www.youtube.com/watch?v=Nfa2etJ84_8),
210–215s, shows three distinct small forms in the inset room: three reflective
marbles, three green creatures alternating between upright and curled poses,
and three low green puddles. The room scrolls into view at 210s; 211–213s gives
clearer full-room coverage. The 213.5–214s collection displays +3 and 500.
[Hipoonios' Amiga replay](https://www.youtube.com/watch?v=K_F_IbG87LM), 160–164s,
also shows the differing silhouettes; its clock is at 99 in these frames, so
it is not evidence for normal clock decrement.

Private full frames and contact sheets are retained in the September 21 audit
folder (`iron-mini-contact.jpg`, `mini-shapes-contact.png`, individual
`iron-mini-detail-*` frames and `hip-mini-search.jpg`). These are observations
of the original; exact starting coordinates and movement paths are not recovered.

## Implementation

The former six identical spheres become nine inhabitants: three steelies,
three curling munchers and three deforming acid puddles. `kind: mini` remains
collectible; its optional `form` selects the physical and visible form. Old
imported miniatures without this field retain their spherical shape.

Steelies roll and have dark reflective materials. Munchers remain upright,
turn gradually and articulate the same foot/body/head/mouth solids used by
native collision. Puddles remain low and deform their complete concave triangle
mesh; collision does not fill in their notches. Walking forms use bounded
horizontal forces instead of sphere rolling torque. Their 0.12 mass and center
of mass stay fixed while the shape changes, preventing animated mass changes
from shifting the supporting foot through the floor. Visual and collision
animation both use simulation time and the same cached shapes.

Contact retains the existing +500 points and +3 clock units, disables the
collected body, and triggers the existing collection sound/notice. The demo
continues to collect six inhabitants (three per player in paired play); three
additional inhabitants are available to the player. Its right bird-field
approach uses speed 3.2 instead of 2.5 to clear the flight corridor after the
changed pickup timing. No bird path, collider, clock or physical control limit
was weakened.

## Validation and remaining work

Native tests cover all three forms settling within 1% of miniature radius,
constant mass, visible/collision vertex agreement, changing poses, exact
snapshot continuation, physical contact collection and disabled collected
bodies. Course import retains forms and rejects invalid types. The existing
Silly solo and paired demos still require their six pickups, transfer rewards,
zero falls and original finish-time limits.

Browser close-ups of the actual Silly board confirm the upright/curling poses
and low lobed puddle, without captured warnings/errors.

The original room's exact tiny track layout, creature scale, starting positions,
fleeing/patrol paths, animation cadence and repeat/respawn policy remain open.
These meshes are reference-informed reconstructions. The red upward-transfer
housing and any special uphill-gravity law remain separate unfinished work.

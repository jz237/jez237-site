# Silver angelfish · Pterophyllum scalare

Two individually animated fish were authored in Blender 5.2 from the owner's
silver-and-black angelfish photograph. This is an original model, not a purchased
asset or a photographic billboard. Both fish share the same mesh and embedded
photographic flank/median-fin pigment, 1536-pixel scale-normal and pectoral-tissue maps; their sizes and
motion phases differ. The owner-supplied photograph is UV-mapped onto the curved
body, preserving its silver scales, gill details, iris and stripe through the eye.

The mesh has a deep, compressed flank, vertical pigment bands, shallow integrated eye contours, gill-cover seams, lips, nostrils, thin dorsal/anal/caudal membranes,
individual fin rays, dark reinforced leading edges with warm pale rims, short
anterior fin spines, paired pectoral fins and two tapering pelvic streamers.
The fine dark bars in the median fins come from the same reference photograph.
Routine cruising keeps the head steady while a traveling wave builds toward the
rear trunk. Forward speed controls a visible inward fold of the free dorsal and
anal tips; they reopen during coasting and hovering. Tail strokes quicken with
propulsive effort, with independent stroke/coast timing for each animal. The
tail fan bends behind the peduncle rather than wagging the whole fish. Median fins,
pectoral fins and streamers have separate GPU motion. Alternating pectoral
strokes and median-fin waves continue during gliding; shadow geometry follows the
same deformation. No additional per-frame CPU vertex upload is needed.

## Behavioral interpretation

The two fish retain individual goals and a loose companion preference. They avoid
crowding each other and prefer extra room from the smaller fish. This is a chosen
display behavior, not a claim that these two fish form a breeding pair. They hover
near planting, vary their cruising speed,
yield to nearby inhabitants, and approach falling food with brief bursts and
braking. A bite must be close to the mouth and transfers the existing food's
nitrogen through the tank's existing digestion accounting. A lost or unreachable
food target is released. Nighttime activity is reduced. A glass tap produces a
brief startle response. Turning stays upright, with modest pitch and filtered angular velocity. If a turn
is obstructed, they commit to a short fin-led retreat into clear water before
trying again, rather than alternating their heading at the contact boundary.

Webb and Fairchild (2001) compared hovering, median/paired-fin swimming,
body/caudal-fin swimming, burst-and-coast and maneuvering in angelfish and two
other species. Their comparison supports distinguishing fin-led routine movement
from high-effort body/tail propulsion. It does not provide the exact animation
frequencies used here.

The visible fin folding and its degree follow the owner's observation. The
study supports multiple swimming gaits; it does not establish the exact fold
angles or tail-beat frequencies used by this animation. The fin-contact margin
also covers the stronger strokes so extra flexibility does not permit clipping.

- [Original study: performance and maneuverability](https://doi.org/10.1139/z01-146)

Gómez-Laplaza and Morgan (2003) found that previous social rank and context affected
angelfish locomotion, feeding latency and consumption. This supports individual
variation rather than an identical synchronized feeding loop; it does not supply
the exact speeds or fin frequencies used here.

- [Original study: social rank, locomotion and feeding](https://pubmed.ncbi.nlm.nih.gov/12689421/)
- [Original study: growth and reproduction under different diets](https://pmc.ncbi.nlm.nih.gov/articles/PMC4299979/)

Motion speeds, turn rates, body flex and timing are qualitative animation choices,
not measured Pterophyllum kinematics. Contact volumes include the tall fins and
streamers; short swept steps check motion against planting, hardscape and the
other inhabitants. The contact approximation is fitted from the Blender mesh, with allowances for
fin motion. It checks current leaf positions and gently resolves contact from a
swaying leaf. The fish explore open passages in depth, including behind planting;
a dense stand is still an obstruction, not an invitation to pass through it.
The pelvic streamers sweep forward and back independently at their free ends.

The aquarium is an educational display, not a recommended stocking list. Adult
angelfish can prey on small fish and shrimp. See the [Angelfish Society morphology and feeding discussion](https://www.theangelfishsociety.org/newsletters/2013_Sept_LowRes_v30.pdf). Compatibility depends on sizes,
individuals and husbandry; consult the store about a real community.

Blender source: scripts/rotatable-aquascape/model-source/silver-angelfish.blend.
Rebuild script: model-source/build_angelfish.py. No paid assets or services used.

Nearby leaves and hardscape trigger a brief, deliberate forward extension of the
pelvic fins, followed by relaxation and a cooldown. The hinge movement remains
independent on each side, including visible forward/back sweeps between inspections.
This is an illustrative inspection behavior requested for the display, not a claim
that its trigger distance or timing has been measured in angelfish. The articulated
collision envelope follows the pelvic pose and prevents an extension through a
surface. The living close-up demonstrates the extension at a larger scale.

## Visible ventilation

Angelfish now pulse their gill covers and make small mouth openings in the tank
and living close-up. The oral expansion precedes the opercular pulse. Each fish
has a separate continuous breathing phase, which continues while hovering and
quickens modestly with sustained effort. The eyes and anterior head stay steady.
The tetras and Corydoras also have coordinated oral/opercular motion; Corydoras
retain their separate substrate-picking movement. Pausing freezes ventilation.

This illustrates the coupled buccal and opercular pumps described in
[Hughes (1960), A Comparative Study of Gill Ventilation in Marine Teleosts](https://journals.biologists.com/jeb/article/37/1/28/13294/A-Comparative-Study-of-Gill-Ventilation-in-Marine).
That comparison is not a measurement of these three aquarium species. The phase
offset, amplitudes and frequencies here are visual choices, not measured
species-specific rates or a simulation of gill pressures and oxygen uptake.

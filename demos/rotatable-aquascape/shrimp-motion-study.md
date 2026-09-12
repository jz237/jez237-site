# Cherry shrimp body movement — research and implementation

Updated 12 September 2026. The model represents Neocaridina davidi. No published N. davidi routine-swimming abdominal angle time series was located in this research. Joint amplitudes, frequencies and behavioral timings below are animation choices, not species measurements.

## Evidence used

- [UF/IFAS: Cherry Shrimp Neocaridina davidi](https://ask.ifas.ufl.edu/publication/IN1301) identifies five pairs of abdominal pleopods used for swimming, distinct from the walking and feeding legs. This is the species-specific anatomical reference.
- [Takeuchi et al. (2008), Morphological Asymmetry of the Abdomen and Behavioral Laterality in Atyid Shrimps](https://bioone.org/journals/zoological-science/volume-25/issue-4/zsj.25.355/Morphological-Asymmetry-of-the-Abdomen-and-Behavioral-Laterality-in-Atyid/10.2108/zsj.25.355.pdf) examines Neocaridina denticulata, a related atyid. Abdominal flexion and extension drive backward tail-flip escapes, while lateral abdominal rotation contributes to steering. This supports a jointed abdomen and the distinction between forward swimming and escape strokes; it does not supply cherry-shrimp routine-swimming angles.
- [2025 study: Going around the bend to understand the role of leg coalescence in metachronal swimming](https://pubmed.ncbi.nlm.nih.gov/40309898/) combines live Palaemon vulgaris observations and a robotic analog. Pleopods bend and group during recovery; their power and recovery motions differ. These are comparative caridean mechanics, not direct cherry-shrimp measurements.

## What changed

The six overlapping abdominal shell segments now hinge as a connected chain. Segment centers, attached swimmerets and the tail fan all inherit those joint transformations. The head, eyes, rostrum and front walking-leg attachments remain stable. Segments retain their geometry instead of stretching like soft rubber.

The animation varies abdominal posture during grazing, walking, takeoff, travel and landing. The abdomen extends modestly during travel and settles into a slightly curled posture at landing. Small independent adjustments interrupt long stationary grazing poses. Subtle lateral flex follows swimming turns. Routine forward trips do not use a large repeated escape curl.

Five swimmeret pairs use staggered strokes with continuous phase across speed changes. Their blades spread more during the power stroke and fold during recovery. Stroke rate eases with activity. Walking legs draw inward during swimming and return toward the leaf at landing. Tail-fan spread varies with activity and posture.

All six shrimp share the original detailed geometry and render batches. Leaf-contact paths, swimming route clearance, individual behavior and pause remain active. This is an evidence-informed animation, not a measured species-specific biomechanics reconstruction or a fluid dynamics solver.


## Contact and escape response update

Walking legs now begin at embedded thoracic hip sockets, with a continuous socket-to-upper-leg-to-knee chain. Tests cast through the modeled shell to verify that each of the ten roots lies inside it.

Grazers use articulated-body-sized collision volumes with checks along both translation and turning, rather than testing only the destination. These cover neighboring grazers, botanical leaves and stems, scanned fern fronds, hardscape envelopes, tank boundaries, substrate and the glass plumbing. Swimmers yield when blocked; moving landing points cannot cause a jump when a route clears. The slower snail is allocated a suitable clear leaf first. If no plant path fits an animal, a glass path is used rather than placing it inside ground cover.

Fish contact is tested along the fish's motion in three dimensions, so a fast crossing cannot skip over a shrimp and projected overlap at a different depth does not count. On contact, the fish is held outside the shrimp's body. The shrimp selects a short backward/upward escape path, briefly flexes its abdomen and then settles back. A cooldown prevents repeated continuous contact from restarting the animation. If all escape exits are blocked, it makes a small defensive posture adjustment rather than crossing an obstacle. These timings and the return behavior are illustrative animation choices.

Collision shapes conservatively approximate bodies and hardscape. Individual antenna hairs, each toe and the fluid displaced by a tail stroke are not separately simulated. Original detailed rendered geometry is retained; nearby animated collision surfaces are cached per frame.

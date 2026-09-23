# Clownfish host-centered movement — September 23, 2026

User request: visibly dart in, out and around the anemones, rather than cruise
above them. Keep the pair near their host, with independent timing and spacing.

The Florida Aquarium describes clownfish as staying close to their host and
using its tentacles for protection:
https://www.flaquarium.org/explore/habitats/heart-of-the-sea/clownfish/

The University of Michigan Animal Diversity Web species account describes
swimming in and out of protective tentacles:
https://animaldiversity.org/accounts/Amphiprion_percula/

These support host-centered excursions and returns, not a fixed orbit or
permanent hovering in open water. The aquarium's illustrated dart speeds,
turn rates and pause durations are artistic parameters, not measured values
from these sources. No claim that every clownfish will host every anemone.

Implementation: plan short clear routes to inner canopy, outer foraging space,
and perimeter points; pause briefly after reaching a point; turn before thrust,
accelerate into short darts, slow before arrival. Independent random choices
for each fish. Use the actual lowered anemone center, not the old design-height
anchor. Restrict food pursuit to the host neighborhood. Existing swept hard
obstacle tests, fish spacing, breathing, flexible bodies, independent fins and
recovery remain active. The tentacles provide occlusion and soft shelter, not
an impenetrable spherical wall.

Evidence: `host-garden-motion.json` and `host-garden-clowns-*.png` show the
actual renderer over approximately 44 simulation seconds. Separate deterministic
navigation checks require near/far occupancy, completed returns, pauses and
faster bursts, without fish overlap. Screenshots were reviewed as a sequence.

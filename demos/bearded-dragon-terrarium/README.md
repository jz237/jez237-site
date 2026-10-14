# Bearded Dragon · Desert Terrarium

A separate dry habitat for the dragon formerly in Weatherglass's rainforest. The supplied enclosure image guided its wide black frame, sandstone basking shelf, two shelters, weathered driftwood, sandy soil, desert backdrop, overhead lamps, food and water dishes. One living bearded dragon retains the original sculpt, 50-bone rig, scales, independent toes, breathing, blinking, hunting, grazing, memory and temperature-driven activity. Its feet and navigation sample the actual rocks and driftwood. No other animals share its enclosure.

- Live route: https://jez237.com/demos/bearded-dragon-terrarium/
- Build: `npm ci && npm run build`
- Controls: drag to orbit, scroll/pinch to zoom, Follow dragon, Feed cricket (then tap to place), Fresh greens, colour morphs and a lamp schedule. Keys F, M, H, R, 1 and 2. `?ui=0` hides the UI.
- Model: the user's existing procedural dragon from `scripts/terrarium/`, retained here with its baked binary.
- Backdrop and sandstone texture: built-in ImageGen, with the user's image as the composition reference. The log uses CC0 Poly Haven Rough Wood maps on custom closed, displaced branches. Aloe, cacti and shrubs are 3D geometry guided by the [fal GPT Image 2 plant studies and prompts](references/plants/README.md). See [asset credits](public/ATTRIBUTION.md).
- Habitat conditions are illustrative simulation values. Heat/light fade at night, and the dragon rests in the cool shelter. Its warm ledge, cool shaded hide, ventilation and internal UVB tube follow the broad layout principles in the [RSPCA bearded dragon guidance](https://www.rspca.org.uk/adviceandwelfare/pets/other/beardeddragon).
- The rainforest remains at https://jez237.com/demos/terrarium/ with its fish and toad and no dragon.

The public build is in `demos/bearded-dragon-terrarium/`. The preview and catalog cover are captured from the running 3D scene.

The enclosure measures 1.6 × 0.9 × 0.64 metres in scene units. Its expanded front-to-back depth provides 50% more floor area than the original 0.6-metre depth, with food and water near the front, planting along the edges and connected roaming space across the full floor. The dragon, shelters and climbing wood retain their scale.

Locomotion uses planted stance feet, separate limb steps, a flexible trunk and an articulated tail with gravity, inertia and contact friction. Tail physics runs at a fixed 120 Hz with stronger damping and a firmer, tapered muscle constraint. Parallel transport keeps its cross-section from flipping at vertical hangs; the pelvis follows the trunk independently of tail contact. The tail collides against the full wood/stone meshes along each segment, including its visible skin thickness; unsupported sections sag freely. Swept contacts prevent tunneling, and each solid resolves a contact manifold without opposing per-triangle kicks.

Feet use precise surface rays, lift before advancing over a riser, and approach the landing orientation during swing. Carried knee and hand frames avoid IK singularity spins. Navigation preserves usable corners, reduces speed on climbs and descents, and routes the trunk around tall faces rather than cutting across drops. Support queries distinguish a floor from an overhead branch; the dragon follows gradual upright turns, hunts and chews crickets, and turns outwards before settling inside the cool hide. Regression tests cover planted feet, cadence, belly lift, limb lengths, overhead clearance, tail suspension and collisions, variable frame times, vertical tail orientation, isolated pelvis control, knee/hand singularities, ledge footholds, touchdown and route corners.

Forepaws remain outside their shoulders on narrow perches. Unsupported paw height follows the shoulder, and the sculpt's outward/backward elbow direction guides the forelimb IK. A narrow-ramp descent regression checks that the elbows stay outside the body rather than folding up across the shoulders.

Cave rear walls follow the rounded openings and sit inside the stone arches, avoiding an exposed dark rectangle behind the cool hide. Individual aloe blades and shrub stems bend down under contact with the dragon's body, feet, and tail, then recover gradually. Their roots stay anchored; margin teeth, seed clusters, geometry normals, and shadows follow the same bends. Broad shallow body contacts leave low leaves beneath the belly alone. Plant regressions check pressure clearance, recovery, rooted geometry, frame cadence, and overhead passes.

The feeding tray follows the original reference: a thick chipped oval stone rim and a properly closed basin, using the existing sandstone photograph. Fourteen edible portions combine 56 cupped, torn greens with textured squash chunks and slices. The bowl participates in foothold and tail collisions. The dragon keeps its chest and head raised to the salad when grazing; bites remove portions and the Greens control restores the full salad.

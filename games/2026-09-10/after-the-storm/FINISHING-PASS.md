# Coastal finishing pass — 13 September 2026

This release builds on TIDELINE 2.1.1 and the wet-sand update. It keeps the authored courses, rider models, mobile controls, demos and saved records.

- Measured landings emit expanding translucent water sheets, alongside existing ballistic spray. Nearby hard landings add a few lens droplets that drain away in under 1.5 seconds. Impact sound combines splash with a bounded hull thump, after the audio start gesture.
- Strong wakes from other racers add bounded sideways pressure and roll. Crossing angle and speed govern the response; bracing reduces it. Vertical launch and pitch still come from the shared rendered wave and hull-contact solver. Ordinary venue wakes retain their previous handling.
- Rider springs prepare the body for descending landings, counter rapid roll, and recover gradually after impact. Hands/boots remain anchored with anatomical IK.
- Recent wet-sand film supports thin retreating streaks and broken foam deposits. Rock spray emits when an advancing actual crest reaches an exposed rock waterline.
- Seagrass blades have curved silhouettes and feathered edges. Silver fish flanks catch scene lighting more sharply; their existing independent swimming and schooling behavior is preserved.
- Groves mix sizes, trees, shrubs, driftwood and rocks. Temperate courses reuse the textured evergreen from the site's **Mini Moto — Pine Ridge Park**, by **chipchaunceytheonlyone**. See `assets/scenery/PROVENANCE.json`. The repacked tree is approximately 1.1 MB rather than the original 6.3 MB GLB. Tropical courses retain palms and broadleaf trees.
- A maximum of 600 trees per venue and spatial instance batches bound scenery cost. Automatic quality reduces distant scenery in two stages before reducing water quality, and restores it cautiously. Split views use both cameras for culling.

## Validation

Run `node --test tests/*.test.mjs`. Specific regression coverage includes analytic wake gradients, source exclusion, crossing direction, rider bracing/recovery/pause, impact bounds, and scenery-before-water quality reduction. Existing tests cover all courses/classes, demos, jumps, failure/restart and anatomical articulation.

Visual inspection pages use the real game rendering:
- `source/finishing-review.html`: coastal groves, Mini Moto pines, measured landing with a held inspection frame.
- `source/shoreline-review.html`: wave wash, draining sand, graphics transitions.
- `source/underwater-review.html`: above/below water, habitat changes, passing-craft fish responses.

Browser checks include desktop rendering and a simulated 844×390 phone layout. This does not establish performance on physical phones. Splash sheets, lens droplets and rock spray are bounded visual approximations, not volumetric fluid simulation. Lens droplets are transparent overlays rather than true screen refraction. No full Wave Race feature-parity claim is made.

# Underwater scenery

Added on top of TIDELINE 2.1.1, including the newer rider and close-camera work.

- Seeded habitat placement in submerged areas beside every venue's racing routes.
- Silver fish schools with local alignment, cohesion, separation, gradual upright turns, variable depth, bursts, glides and inspection pauses. Approaching moving racers trigger a temporary flight response; schools regroup afterward. Larger individuals occur occasionally.
- Flexible traveling body waves with steady heads and independently moving fins. Animation phases accumulate continuously when swimming speed changes.
- Instanced seagrass, bending with the actual shared wave slope, with density reduced at lower quality settings.
- Photographic rock clusters, shells, a submerged anchor, broken pier timbers and an open-rib skiff wreck where enough habitat sites exist.
- Seabed ripple shading under the existing moving caustics. Objects participate in the normal water refraction and depth passes.
- Bounded sediment particles from fast shallow passes and shallow landings; particles settle/fade below the water surface.

The scenery is decorative: it does not add invisible collision obstacles or alter race routes, handling, wave physics, rider models, camera behavior or mobile controls. Fish use a lightweight local behavior simulation, not a complete ecosystem. Wrecks and plants are procedural geometry. Visibility depends on the existing venue water clarity, depth, wave angle and lighting.

Validation: habitat coverage for all nine venues; fish depth and upright limits; scatter/recovery behavior; sediment conditions; existing rider animation and close-camera tests. A developer review page at source/underwater-review.html provides above-water and close-up habitat inspection. Its underwater inspection hides the water surface for asset review; the normal game always uses the full ocean renderer.

Release check: all 312 Node tests passed (2026-09-12); browser inspection found no shader errors in the final habitat review. The running demo progressed with the new scenery enabled.

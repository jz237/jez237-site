# Immersion pass - v2.2.0

Builds on v2.1.2 and main 5fa4c44d7. Existing courses, rules, saves, demos, mobile controls, fish behavior and shared wave/hull solver are preserved.

## Six improvements

1. Breaking crests: green backlit faces, foam advected down surface gradients, and bounded wind-blown particles emitted from elevated, curved crests. Spray uses the same CPU waves as buoyancy; calmer sections emit less.
2. Tropical vegetation: fuller palm crowns with upright young fronds, denser broadleaf branches, continuous leaf UVs and procedural veins/mottling. Existing varied trunks and Mini Moto evergreen assets remain. All receive moving cloud shade.
3. Shore flow: a local 96 m shallow-water grid stores wash, routes it around raised rocks and downhill, retains it in depressions, and infiltrates gradually. Transparent film is separate from persistent wet-sand history. Rock interiors are excluded from film rendering. Foam follows terrain slope near shore.
4. Tactile riding: small contact-dependent reactive steering corrections shared by handlebars and hand targets, stronger high-speed body lean, softened knee compression, and bounded landing translation of camera and target together to preserve horizon stability.
5. Speed and sound: existing close spray, wakes and landing sheets combine with intake-ventilation pitch rise. Three rival engines use camera-relative stereo bearing, distance attenuation, filtering and Doppler. Pause, mono and split-screen settings are respected.
6. Coherent light: sky clouds and sunlight attenuation share a moving world-space field across terrain, water, trees, skis and riders. Wet clothing has stronger highlights. Distance haze softens remote scenery.

## Validation

The full suite passed (328 tests), followed by targeted reruns after visual tuning and an additional passing rival-audio integration test (329 total cases). Coverage includes courses, demo navigation, completion, failure/restart, jumps, rider articulation, frame-rate behavior and pause.

Browser inspection uses real WebGL on desktop and a simulated phone viewport. Shoreline inspection showed exposed rocks with thin retained wash and shrinking wet area after retreat. Tropical foliage, racing waves, landing poses, adaptive quality and runtime spatial-engine output were inspected. Physical phone performance has not been measured.

Review pages: source/immersion-review.html (wash, recession, cloud advance), source/finishing-review.html (groves and landing), race.html?verify=1 (race diagnostics).

## Practical limits

Crests, spray and runoff are real-time approximations, not overturning volumetric fluid. Shore water uses 2 m cells near the camera, retaining overlapping cells as it moves; distant pools are not persisted. Leaf detail is procedural shading rather than new scans. Cloud lighting approximates a horizontal layer. Rival audio is stereo rather than HRTF. No full Wave Race feature-parity claim. No purchases or new external services.

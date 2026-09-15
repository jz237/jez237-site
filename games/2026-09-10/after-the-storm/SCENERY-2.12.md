# Sky and scenery — v2.12.0

## Changes

- The shared panorama sampler uses explicit angular texture gradients at the longitude wrap. A narrow edge feather joins the image boundaries in the sky, water, and environment reflections. Rain streaks are shorter so close drops do not stretch into long scratches.
- All nine venues gain deterministic dry-bank dressing outside the race corridor and ramp approaches. Natural venues receive rock clusters, low vegetation, and fallen timber; Drake Lake also receives reed clumps.
- Marine Fortress has staggered stone blocks, varied coloration, and damp lower walls. Concrete and metal have joints, grain, salt weathering, and rust variation.
- Port Blue and Twilight City have weathered paving on flat elevated ground, quay bollards, and lamps. City windows are integrated into the facades instead of stacking overlapping window boxes.
- Glacier Coast has taller distant peaks, blue ice strata, fractures, and snow on upward-facing ice. Lake mountains have more height and distant vegetation remains venue-specific.
- Scenery is instanced, shared by spatial batches, and culled at distances appropriate to graphics quality. Both cameras retain scenery in split-screen.

## Validation

- 38 targeted Node checks passed: placement on all nine venues and four difficulties, route and ramp clearance, deterministic density limits, full demo driving, existing riding/landing/spray checks, and phone resolution budgets.
- Browser visual inspection covers the nine venues, the shared sky wrap at multiple angles in daylight and night, and phone-sized rendering. See the final task report for live publication confirmation.
- Final 390 x 780 Medium demo sample: 60 fps, 16.8 ms frame P95, 13.8 ms CPU P95 over 240 frames on the development computer; no browser console errors.
- Source review and JavaScript syntax checks accompany actual WebGL shader compilation. Shader-name and program-cache conflicts found during development were corrected.

## Limits

This is a real-time browser scenery pass, not a photorealistic offline render. The sky is still a photographic panorama with procedural atmosphere; the feathered edge is a practical join. New dry-bank props are decorative and do not introduce new race collisions. The established terrain, route geometry, wake physics, and speed settings remain authoritative. Mobile testing uses a phone-sized browser viewport on the development computer, not a physical phone.

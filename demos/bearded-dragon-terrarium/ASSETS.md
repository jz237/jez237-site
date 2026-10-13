# Desert terrarium image assets

Created with the built-in ImageGen tool, using the user's attached terrarium photograph as a composition and material reference. No CLI or API fallback was used. All selected images were copied unchanged into this project's public directory; the enclosure, animal and furnishings remain interactive 3D geometry.

| Asset | Saved source path | Prompt specification |
| --- | --- | --- |
| Desert panorama | `scripts/bearded-dragon-terrarium/public/desert-panorama-v2.png` | Photographic arid mountain valley, panoramic 2.8:1 composition. Rocky ochre and mauve desert mountains, blue sky with scattered clouds, desert scrub and Joshua trees. Warm golden sunset on the left, cool blue daylight on the right, matching the reference enclosure's backdrop. Generate only the landscape texture; no animal, enclosure, lamps, foreground furnishings, lettering or watermark. |
| Driftwood grain | `scripts/bearded-dragon-terrarium/public/driftwood-grain-v2.png` | Square, tileable, flat diffuse material texture of pale sun-bleached desert driftwood. Long vertical grain, splintered fibres, deep brown-gray cracks and silver-beige ridges. No object silhouette, perspective scene, separate background, text or watermark. |
| Sandstone | `scripts/bearded-dragon-terrarium/public/sandstone-v2.png` | Square, seamless, orthographic macro material texture of rough warm beige and ochre sandstone. Natural erosion pits, fine mineral grains, subtle sedimentary layers and hairline fractures. Neutral diffuse lighting. No outline, landscape, objects, text or watermark. |

The deployment copies these textures to `demos/bearded-dragon-terrarium/`. The gallery cover at `demos/assets/bearded-dragon-terrarium-v2.jpg` is a screenshot of the running scene, not a generated image of the finished enclosure.

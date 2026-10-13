# Bearded Dragon · Desert Terrarium

A separate dry habitat for the dragon formerly in Weatherglass's rainforest. The supplied enclosure image guided its wide black frame, sandstone basking shelf, two shelters, weathered driftwood, sandy soil, desert backdrop, overhead lamps, food and water dishes. One living bearded dragon retains the original sculpt, 50-bone rig, scales, independent toes, breathing, blinking, hunting, grazing, memory and temperature-driven activity. Its feet and navigation sample the actual rocks and driftwood. No other animals share its enclosure.

- Live route: https://jez237.com/demos/bearded-dragon-terrarium/
- Build: `npm ci && npm run build`
- Controls: drag to orbit, scroll/pinch to zoom, Follow dragon, Feed cricket (then tap to place), Fresh greens, colour morphs and a lamp schedule. Keys F, M, H, R, 1 and 2. `?ui=0` hides the UI.
- Model: the user's existing procedural dragon from `scripts/terrarium/`, retained here with its baked binary.
- Backdrop, driftwood grain and sandstone texture: built-in ImageGen, with the user's image as the composition reference. The branches, arches, cacti and other furnishings are actual procedural 3D geometry. See [asset prompts and local paths](public/ASSETS.md).
- Habitat conditions are illustrative simulation values. Heat/light fade at night, and the dragon rests in the cool shelter. Its warm ledge, cool shaded hide, ventilation and internal UVB tube follow the broad layout principles in the [RSPCA bearded dragon guidance](https://www.rspca.org.uk/adviceandwelfare/pets/other/beardeddragon).
- The rainforest remains at https://jez237.com/demos/terrarium/ with its fish and toad and no dragon.

The public build is in `demos/bearded-dragon-terrarium/`. The preview and catalog cover are captured from the running 3D scene.

Locomotion uses planted stance feet, separate limb steps, a flexible trunk and a dragging tail. Support queries distinguish a floor from an overhead branch; the dragon climbs the stone steps, follows gradual upright turns, hunts and chews crickets, and turns outwards before settling inside the cool hide. Regression tests cover planted feet, turn support, overhead clearance, limb lengths, tail contact and head/jaw motion.

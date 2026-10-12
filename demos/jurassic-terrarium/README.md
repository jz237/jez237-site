# Jurassic Terrarium

A miniature prehistoric world sealed in a brass-framed glass case. Dinosaurs live in the
[Weatherglass](../weatherglass/) landscape under weather you control. You can grab the clouds,
wring out rain, stir the wind, pour fog, wipe the glass, and run the sun and seasons. The animals
roam the valley, graze, drink at the lake, rest at night and react to each other.

- **Demo:** https://jez237.com/demos/jurassic-terrarium/
- **Source:** `scripts/jurassic-terrarium/` in this repository.

## Status

All six animals from the concept are in the case. It is still being refined, and published as it grows.

| Animal | Status |
|---|---|
| Tyrannosaurus rex | in the case, with a den under a basalt overhang |
| Pteranodon (2) | in the case, soaring |
| Brachiosaurus | in the case: browses the conifers, drinks, dozes standing |
| Stegosaurus (2) | in the case: grazes, drinks, swings its spiked tail; flees the T. rex |
| Triceratops (3) | in the case: a herd that grazes and drinks; one may stand its ground against the T. rex with a horn display |

How they move and what's around them:

- Animals steer smoothly along their routes and their bodies curve along the arc they walk.
- The trunk swings over each planted foot.
- The head flicks to look at something and holds there while the neck catches up.
- Ferns lean away and press down as an animal pushes through them.
- The waterfall steps down through three white-water cascades into the front pool.
- The front pool has eelgrass meadows streaming in the current and stones on its bed.
- Mossy boulders line the pool's bank.
- The case sits in a warm, lamplit study, softly out of focus (backdrop built from a generated photo).

## How the dinosaurs are made

Every animal is modelled from code and rendered in Blender 4.5. Nothing is downloaded or traced.

1. **Research.** Proportions, posture, skin evidence, colours and gaits come from published
   skeletal reconstructions and papers. Examples:
   - lipped T. rex jaws (Cullen et al. 2023);
   - T. rex skin of fine scales (Bell et al. 2017);
   - Stegosaurus plate layout (Gilmore 1914).

   Reference plates from an image model are used only to check silhouettes.
2. **Sculpt.** Each species is a signed-distance sculpture: lofted bodies, limbs, horns, frills,
   plates and claws, blended smoothly. It is sampled on a dense grid (about 38 million voxels for
   the T. rex) and meshed with OpenVDB inside Blender.
3. **Skin.** A procedural Cycles material builds the skin:
   - pebbly scales, larger dorsal feature scales and tubercles;
   - skin folds where the body bends;
   - countershading, bands and mottling.

   It is baked from the high-resolution sculpture onto a ~60 000-triangle game mesh, giving colour,
   normal, roughness and occlusion textures. UV seams follow the anatomy: along the belly, and on
   the inner side of each limb.
4. **Rig.** The bones follow the skeleton. Skin weights come from the same sculpture, so the
   muscles blend between bones.
5. **Animation.** Gait cycles come from a pose solver with leg IK. Digitigrade hind legs use a
   pantograph constraint: the metatarsus stays parallel to the femur, as in birds. Planted feet
   don't slide, because the terrarium moves each animal at its clip's stride speed.
6. **Suppleness.** Walking clips carry a travelling S-wave: the trunk flexes with each stride, the bend
   passing forward up the neck (the head counter-turns to hold its gaze) and back down the tail. On top
   of the clips, a live layer (`runtime/flex.js`) does three things:
   - it bends the body along the path when turning, capped at about 65° end to end;
   - it turns the neck and head towards whatever the animal watches, such as the T. rex, its prey or a
     neighbour;
   - it gives each tail segment springy follow-through.
7. **Planting.** The valley is replanted for the Mesozoic. Tree ferns, cycads, fern clumps (some with red
   young fronds) and horsetails are modelled procedurally in Blender (`blender/flora.py`) and instanced
   with a wind-sway shader. They replace Weatherglass's oaks, birches and cherries, and thin out its
   flowers and grass. The conifers and shrubs stay.
8. **Sound.** Voices are synthesised live with Web Audio through Weatherglass's audio engine, so its
   sound button and volume apply. They are informed by living archosaurs (crocodilians and birds boom,
   hiss and grunt with closed mouths): the T. rex's deep rasping growl, snorts, grunts, a sauropod's
   rumble, pterosaur croaks, and footfalls synced to each gait.
9. **Weather.** Skin darkens and turns glossy in rain. A nearby lightning strike sends animals running.
   At night, or in a storm, the T. rex retires to its den: a basalt overhang sculpted and baked the same
   way, over a level shelf patched into the terrain.
10. **Terrarium.** A small module joins Weatherglass's simulation loop. It plans routes with A* over
   a walkability grid of the terrain, which keeps animals off cliffs, deep water, trees and the hut.
   It then drives behaviour: idle, wander, sniff, roar, graze, drink and sleep at night.

The case is a long, low display cabinet, 18 × 8 units under a lid at 5.6. Weatherglass's box is 12 × 8 × 7.4, and everything in it sizes itself from one constant, which the page build patches. Like a museum diorama, the animals are shown large against the landscape, at 1 unit ≈ 5.5 m. Tall tree ferns frame the scene like palms over a carpet of about 1,400 ferns, crimson rosettes and cycads, and a row of warm display spotlights under the lid lights the case, brightest at dusk and at night; Weatherglass's grass, flowers and pines are thinned, and its ground pushed to a deep moss green.

## Provenance

- The landscape, weather, glass, sound and controls are the original Weatherglass page, unchanged
  apart from small hosting patches applied by `scripts/jurassic-terrarium/tools/build-page.mjs`:
  - the names on the title, HUD and plaque;
  - a module hook;
  - a loading hold while the models download.
- Three.js r186 is bundled in that page (MIT; see `THREE-LICENSE.txt`). The dinosaur runtime reuses
  it rather than loading a second copy.
- The dinosaur models, textures and animation are generated by the scripts in
  `scripts/jurassic-terrarium/blender/`.

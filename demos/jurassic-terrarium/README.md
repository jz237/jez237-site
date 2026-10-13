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
- Feet plant on the real ground on slopes and banks (two-bone leg IK), and chests rise and fall with breathing; an animal that has just run pants.
- The Pteranodons now and then dive to the pool, skim the surface and snatch a fish, leaving rings on the water.
- The Brachiosaurus crops tree-fern crowns, bowing its neck into lower ones; torn fronds tumble down.
- When the T. rex roars, the planting round it shivers and every herbivore within earshot turns to look.
- Babbling water at the cascades, cicadas by day and frogs by the pool at night; a lantern glows at the end of the jetty.
- A Triceratops nest: one of the herd guards a clutch of eggs; about a minute in they rock, crack and three hatchlings climb out, grow and trot after their mother (`?hatch=<seconds>` to set the time).
- Weather changes behaviour: in rain the herbivores shelter under the tree ferns and the T. rex retreats to its den; when the sun comes out on soaked ground, steam rises off the jungle.
- A warm Mesozoic climate: the case opens in early summer, so fireflies come out over the jungle at night.
- Tall tree ferns at a Brachiosaurus's feeding height stand in the open, so it browses often.

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

Detail pass (v1.15):

- Every plant is built from many small parts: fronds of separate leaflets, monkey-puzzle conifers of whorled scale-leaved branchlets, ginkgos with clusters of fan leaves, vines festooned from the tree-fern crowns, moss at the trunk feet, fern carpets in many shades.
- On the floor: fallen logs with moss and bracket fungi, mushroom clusters, leaf litter, pebbles along the banks.
- Air: warm shafts of light from the lid lamps with dust turning in them, low haze between the trees, mist off the falls; at night faint moonbeams and fireflies over the pool.
- Animals: 4K skin on the T. rex and Brachiosaurus, glassy wet eyes with eyeshine at night, soft contact shadows under bodies and feet, footprints in soft ground, ripples and wakes when they wade or drink, wet skin after wading.

v1.17:

- 4K skins on every animal; fine face scales on the Triceratops (behind the beak, round the eyes, the jaw), T. rex (snout, jaws, lips) and Brachiosaurus.
- Distant ferns swap smoothly to a simpler version, so the full-detail leaflets don't shimmer from afar.
- Voices: every call has five variants and never repeats twice running; herd contact calls answered by a herd mate, hatchling peeps (urgent when lost, and the mother answers), the T. rex's stalking growl, sleepers' breathing, the Brachiosaurus rumbling as it browses.
- Things to do (in the field guide): Drop food, and the plant-eaters come to eat it bite by bite; tap the glass and nearby animals startle, the closest shy away and the T. rex may roar back; Photo mode for a slow, letterboxed, shallow-focus camera drifting round one animal after another (Esc or click to leave).

v1.19 (after the "Terrarium Terramundi" reference):

- A painted backdrop inside the back glass: misty layered mountains and forest in two layers that shift against each other as you turn the case. It follows the time of day and the weather (`?backdrop=0` to hide it).
- Rockwork: hundreds of rounded, moss-capped boulders stacked on the mountainsides, lining the stream banks and the pool's rim; rubble heaped either side of the cave mouth, with a flickering amber glow inside the den (`?rocks=0`).
- Frothier cascades: a broad churned plunge with a foam tongue downstream, droplets thrown up and falling back, and mist drifting off.
- Mist lying in bands between the rows of trees at the back, thickest in the morning and after rain, and cloud wisps wrapped round the peaks.
- A shallower substrate, half as deep. The soil cut-away has more dangling roots, and a bed of rounded pebbles at the bottom.
- Footpaths: a winding dirt track from the cabin door down to the jetty, and a branch that crosses the stream on stepping stones and climbs to the cave. Lantern posts along the way light up at dusk (`?paths=0`).
- More fallen logs, sawn stumps by the cabin and snapped ones in the forest (roots, moss, bracket fungi), and a woodpile stacked against the cabin wall.
- Dense conifer stands at the back and on the foothills: monkey puzzles and a redwood-type conifer of the cypress family (a Jurassic group), with a buttressed red-brown trunk and flat, feathery sprays. Monkey-puzzle limbs are now clad in leaves, with crossed shoots that never vanish edge-on.

v1.20 (animals no longer pass through trees or sink into the stream):

- Every trunk now blocks each animal by its real body width, so the route finder keeps whole bodies clear. Each conifer grove is closed as a whole, so the herds walk round a grove rather than threading between its trees.
- A body guard runs on the final pose every frame. The body is tested as a chain of capsules, one per bone, sized from that animal's own skin (horns, frill and belly included). If any part reaches into a trunk or the cabin, the animal slides off it.
- The stream is no longer walked along or down the cascades, which buried the legs in the falls. It's crossed at two shin-deep fords and on the footpath's stepping stones. The path doubles as the corridor between the two halves of the case, and trees are kept back from it.
- Hatchlings swim, with the water at mid-leg, where the water is deeper than their legs.
- If an animal stops making progress, it re-plans its route, and after a second failure it stops and rests.

v1.21:

- The Brachiosaurus roams the whole case again (about 93% of the floor, up from about 70%). The den rock is now solid for every animal except the T. rex, so the wide no-go margin round the rock is gone. It's too big to run from the T. rex: it turns and watches instead.
- On the trail:
  - Animals sometimes walk the footpath and cross the stream on the stepping stones; a herd follows in single file a few seconds apart.
  - An animal slows behind one moving ahead of it instead of walking into its tail.
  - Feet splash wherever they come down in water.
  - Footprints are pressed into the dirt path.
  - Hatchlings paddle when they swim, bobbing with rings spreading round them.
- Branches react to bodies. Monkey-puzzle, redwood, ginkgo, tree-fern and cycad branches part round a passing back, neck or head, shiver while it moves and are dragged its way. Heads in a crown sway the whole tree, and a body pushing through at pace shakes a few leaves loose. Conifer trunks are solid up through the crown.

v1.21.1: the field guide minimises to a small pill (tap its heading; phones start minimised, and your choice is remembered). Minimised, it hides the Drop food and Photo mode row too.

v1.22 (close-up skin and faces):

- Light through thin skin. When the sun is behind them, Triceratops frills, Stegosaurus plates and Pteranodon wing membranes (veins and all) glow warm red-orange. They're found by measuring how thin each part of the model is, and only flat parts count, so cone tips stay dark.
- Mud. Wading leaves the legs and belly muddy up to the water line, with flecks above it. It's near-black and glistening while wet, then dries to a pale crust and slowly wears off; rain washes it away sooner. Walking along muddy banks dirties the feet.
- Neck creases deepen as the neck bends, and the sheen breaks up across the scales.
- Faces:
  - eyelids blink, sometimes twice;
  - eyelids droop at night and close in sleep;
  - eyes dart in small quick saccades towards whatever the animal is watching;
  - nostrils flare with each breath, flutter on a sniff and open wide on a roar;
  - the throat pulses while an animal calls;
  - saliva strings between the T. rex's teeth as its jaws open on a roar, sagging and snapping one by one.
- `?skindebug=1` shows the measured layers: thin skin red, mud green, neck blue.

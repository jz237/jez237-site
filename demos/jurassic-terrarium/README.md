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

v1.23 (more life in the movement, perching Pteranodons):

- New idles, layered on the animals' own poses:
  - shaking off water after wading, a wet-dog shake rippling down the body with drops flying off;
  - yawning, with the head up, the jaw gaping and the eyes squeezed shut;
  - rubbing against a tree trunk, side-on, leaning in and swaying up and down while the tree shakes and drops leaves;
  - dust-bathing (Triceratops and Stegosaurus): lying down and rolling with dust kicked up, coming up dusty;
  - scratching the flank with a hind foot, head turned to it.
- A little more side-to-side weight shift as they walk. Long animals no longer circle a goal that's very close by.
- Pteranodons land and perch on big boulders, the cabin's ridge and the den rock:
  - a curving approach that slows, with braking wingbeats at the end;
  - wings folded tight and standing on all fours as pterosaurs did;
  - preening and looking about;
  - flying off when their time is up or when something comes close.

v1.24 (Documentary mode replaces Photo mode):

- **Choosing what to film.** A director watches the case and scores what's happening: a hunt, a standoff, a stream crossing, a hatching, hatchlings swimming or following their mother, a Pteranodon landing or fishing, a roar, a dust bath, browsing, drinking, sleep. It stays with a story and cuts away early only for something better.
- **Shots.** Each story is filmed in a few shots chosen to suit it: a side tracking shot, a slow push-in, a low hero angle, an orbit, a long-lens shot from across the case, a high crane shot, a chase behind a flier.
- **Clear views.** The crew searches for a clear line of sight past plants, rocks, the den, hills and other animals, and moves or cuts if the view gets blocked mid-shot.
- **Look.** Shallow focus, letterbox bars, and a caption naming the animal (with its Latin name) and what it's doing. Esc or a click leaves.

v1.24.1: smooth legs:
- A planted foot that would over-stretch its leg now drags a little instead of popping free in one frame.
- Feet ease out of the hold when they lift off.
- The walk clip slows right down to match a slow start, rather than running ahead of the body.
- Standing feet stay planted during a shake, a rub or a yawn.

v1.24.2:
- **Knees:** they no longer bend backwards. Sauropod legs are near-straight pillars, and the foot solver took the bend direction from the current pose, which flips on an almost straight leg. Knees now always bend forwards and elbows backwards.
- **Weatherglass pines:** the Brachiosaurus gives them a wide berth, so its legs, neck and tail don't keep getting shoved off them as it passes (behind the cabin especially). It straddles low cycads.
- **Standing animals:** one pressed off an obstacle takes a step away instead of sliding.
- **Demo-page card:** a new image of the current terrarium.

v1.24.3: phones and tablets (desktop unchanged):
- **Smaller skins on phones and tablets.** The cast's 4096 px skins need about 1.3 GB of graphics memory, more than a phone has; running out lost the WebGL context and Chrome then blocked WebGL on the page ("Error creating WebGL context"). On phones and tablets each skin is now shrunk to 2048 px as it loads (1024 px on devices with 4 GB of RAM or less), one species at a time. `?skins=1024|2048` forces a size and `?skins=4096` full size.
- **No reload loop.** On phones and tablets a lost WebGL context no longer reloads the page automatically; it shows a message with a reload and a lighter reload (`?quality=low&skins=1024`).
- **Plain-words message.** When a phone or tablet browser won't provide WebGL 2 at all, the page explains what happened and what to do instead of showing the raw three.js error.

v1.25: wind:
- **Chimney smoke:** in a wind the cabin's smoke streams off as one long ribbon instead of separate puffs. It lies down flatter the harder it blows and is torn ragged by gusts. In still air it rises in a column.
- **Mist and wisps:** the valley mist, low haze, peak wisps and waterfall mist ride Weatherglass's wind field instead of drifting on their own. They slide downwind, lean away from where they lie and settle back when it calms. In a gale they are drawn into ragged streaks and thinned, and the peak wisps stream off the summits like banner clouds. The haze travels across the case and wraps round.
- **Steam and spray:** steam rising after rain, and the fine spray at the foot of the cascades, blow where the wind takes them.
- **Plants:** the idle sway follows the prevailing wind, so plants, smoke and mist all lean the same way.
- Weatherglass's own clouds and fog already followed the wind and still do.

v1.26: weather on the animals, breath, a softer backdrop:
- **Rain on the animals:** wet skin shows rivulets trickling down the flanks and beads on the back, and tiny splash rings pop on the upward faces while it rains. Water drips from chins, throats, bellies and tails, drawn out as it falls. When the rain stops, each animal gives a wet-dog shake and is only damp afterwards.
- **Wind:** in a strong wind the animals turn their tails to it and mostly hunker down rather than wander. Their eyes narrow against the wind, and a little against the rain. Footfall and dust-bath dust blows away downwind.
- **Breath:** on cold mornings, in winter and in rain-cooled air, each breath leaves the nostrils as a puff of vapour in time with the breathing (quicker after a run), carried off on the wind. A roar blows out a great cloud.
- **Backdrop:** the painting melts into the case. It hazes towards the case's own mist colour where it meets the ground, and two bands of ground mist follow the rise and fall of the ground along the back and drift with the wind, so there is no hard line where the ground ends and the picture starts. `?blend=0` shows the plain painting for comparison.

v1.27: skin up close:
- **Scales in relief:** each species has its own scale pattern, worked out per pixel from the skin's own body coordinates, raised in relief and shaded dark in the crevices:
  - T. rex: fine pebbly scales with scattered tubercles along the back;
  - Triceratops: big polygonal plates, with grooves branching over the frill like blood vessels;
  - Stegosaurus: pebbly scales and bony knobs, with smoother grooved plates;
  - Brachiosaurus: large rosettes;
  - Pteranodon: a fine grain.
- **Only when close:** the detail sharpens in as the camera comes closer (Documentary mode especially) and fades out wherever a scale would be smaller than a few pixels, so wide views don't shimmer. It costs about 0.4 ms in a full-screen close-up. `?scales=0` turns it off for comparison.

v1.28: footprints that last:
- **Real hollows:** prints have flat floors, steep walls and a rim of mud pushed up round them, all lit by the sun: the wall and rim facing it catch the light, the far wall falls into shadow. Heavier animals press deeper.
- **Tracks:** prints last for 6–10 minutes instead of about a minute and a half, so the animals' comings and goings build up into tracks along the banks, the trail and wet ground.
- **Rain:** rain fills the prints with water that mirrors the dark trees at a low angle and the sky from above, catches the sun as a glint and rings with raindrops while it rains. Mud by the water seeps a little in straight away. Afterwards they dry out over a few minutes, and heavy rain slowly wears them away.

v1.29: set pieces:
- **Standoff:** when the T. rex charges a Triceratops that stands its ground, they have a real standoff. The Triceratops faces it square, lowers its horns, bellows and stamps a forefoot (dust, a thud, a tremor). The rest of the herd runs to its side and lines up facing the predator. The T. rex prowls round them at a wary distance, head low and watching, stops to roar, makes one feinting rush that pulls up short, then roars again and stalks off. It won't hunt again for a while. Over 20 simulated minutes this happened about four times.
- **Brachiosaurus at the pool:** it now walks down to the big pool, turns to face the water and drinks sip after sip. Its neck bows from the base until the muzzle meets the surface (the clip alone stopped more than a metre short), rings spread from the muzzle, and water runs off its chin between sips. Before this, the giant couldn't find a drinking spot at all. Every drinker now turns to face the water first.
- **Pteranodon skimming:** a fishing dive is now a low, level skim across the pool, the beak cutting a wake of rings and flicking spray, then the snatch, a burst of spray and the climb away with a fish thrashing in its beak.
- **Documentary:** the director treats these as top stories. The standoff is filmed as a two-shot with both animals in frame, the drinking on the head down at the water, and the skim with its own caption. The crew no longer parks the camera inside a tree's crown.

v1.30: nights:
- **Warm light on the animals:** after dark, the cabin's hearth glows out through its windows and lights animals passing close, warm and flickering, with a pool of firelight on the ground round the cabin. The jetty lantern does the same, and so do the lanterns along the footpath (the two with an animal nearest them). This is worked out in the animals' own skin shader, so the rest of the scene costs nothing extra.
- **Eyeshine:** awake animals' eyes throw light back in the dark: amber for the T. rex, green for Triceratops, gold for Stegosaurus, blue for Brachiosaurus. It's brightest when they look straight at you and flares near a light. Shut eyes don't shine, so you'll mostly see it on the T. rex prowling at night.
- **Lightning:** a strike rims every animal in hard cold light, darkens its near side and flares the painted sky behind it, so for an instant they stand out as silhouettes.

v1.31: flesh in motion:
- **Soft flesh:** each animal's belly, throat and the mass of its thighs are soft. They lag behind the body as it speeds up, slows and turns, drop and bounce back with each footfall (harder at a run and for the heavy animals), and settle when it stops. The soft regions are found from the bone each part of the skin hangs from and which way it faces, then blended smoothly into the rest of the body.
- **Breathing:** the ribcage swells and falls with each breath, deeper and quicker after a run.
- **Muscle:** the muscle at the top of each leg bunches as the leg swings away from rest.
- `?flesh=0` turns it off for comparison (and `?flesh=3` exaggerates it).

v1.32: snow and frost on the animals:
- **Snow lying:** while it snows, snow settles on whatever faces up (backs, necks, the tops of tails, plates and frills), with a little thickness to it, a ragged edge and glints of crystals in the light. Very little settles on animals sheltering or in the den. It melts off in a thaw or when they wade.
- **Shaking it off:** an animal with snow piling up shakes it off now and then in a burst of powder.
- **Frost:** in a hard cold, rime forms on frills, plates and horns and lightly on the back.

v1.33: family and social moments; two fixes:
- **Calves at play:** two Triceratops calves square up and butt heads, backing off and charging in with little hops and puffs of dust.
- **Mother and calf:** the mother turns to a calf and bows her head to it; it comes up under her muzzle and reaches up to her.
- **Sparring:** the two Stegosaurus take turns turning their tails to each other and swinging the spikes, the other rearing back.
- **The herd asleep together:** at nightfall the first to settle lies down where it is; the rest come over and lie side by side with it, all facing the same way. (The mother sleeps by her nest.)
- **Mind the calf:** the Brachiosaurus lifts its neck and looks down to let a calf or small animal walk underneath.
- **Documentary:** it films each of these with its own caption.
- **Fix: smoke against the wind tool.** A wind stroke drawn across the chimney smoke used to land on the ground behind the cabin, and the smoke, caught in that gust's side-draught, blew the wrong way. A stroke passing over the plume now blows at the plume itself.
- **Fix: screen flicker when a meteor crosses the night sky.** The meteor's shader could produce an invalid pixel at its tail, which the bloom spread over the whole screen as black frames. It's clamped, and the sky's glowing layers are now guarded like the water's.

v1.34: painted end walls:
- **Ends:** both end walls now carry the painted valley, carried on from the back wall round each corner (mirrored there, so the horizon and colours meet without a seam), with the same haze where it meets the ground.
- **Ground mist:** the mist bands now run round the back corners and part way down each end.
- **See-through when turned:** like the back, each end is painted only on its inside. Turn the case to look along its length and the near end is clear glass while the far end is the backdrop.

v1.35: Pteranodon wings:
- **Flexible curving:** each wing is a chain of springs on top of the flapping animation. The joints further out lag behind the stroke and the air holds them bent against it, so on the downstroke the wing bows and the tips trail upward, and at the top of the upstroke they trail down and whip through. Folded on a perch, the wing stays still.
- **Billowing membrane:** the membrane bellies against the air: lifted on each downstroke, pressed down on the upstroke, most across the middle of the span, with a light flutter in a glide.
- **Detail:** fine stiffening fibres (actinofibrils) run out across the membrane, slanting back towards the trailing edge. They show as faint ridges close up and as dark lines when the wing is against the light, alongside the veins. The wing is smooth skin; scales are on the body only.

v1.36: game trails:
- **Trample map:** a low-resolution map of the whole case that every walking animal presses into round its body, the heavy ones harder. It recovers over a few minutes, so a route used again and again becomes a trail and an abandoned one grows back.
- **What it changes:** Weatherglass's grass lies short and flat along a trail, the planted ferns are trodden down and splayed out, and the ground wears to bare earth. `?trails=0` turns it off for comparison.

v1.37: every tree in hand; right-drag pans:
- **Grab any tree:** with the hand, any tree can be grabbed by its crown and pulled about: the conifers, redwoods, tree ferns, cycads and the rest of the planting, as well as Weatherglass's own trees. It leans after the hand, shakes leaves loose and startles the birds. Let go and it whips back and sways to rest; a click without a drag flicks it.
- **Mouse:** the right button now slides the view around (pan) while the left button turns it; Shift + right still turns it. The pan reaches the ends of the wider case.

v1.37.1: the view stays put:
- **No idle drift:** Weatherglass slowly swung the camera round after 30 seconds without input. Once the view could be slid off-centre with the right button, that swing carried the whole case across the screen, and it came back every time you stopped. It's off: the view only moves when you move it.
- **No stuck drags:** a mouse drag now ends the moment no button is held, even if the release was missed (let go outside the window, a context menu), so the view can't get stuck sliding with the mouse.

v1.38: touching the animals; footsteps by surface:
- **Touch:** with the hand, click an animal to poke it, or hold and move over it to stroke it. Animals under the hand take priority over trees. Each answers in character:
  - Triceratops: poked, it swings round and lowers its horns with a bellow; stroked, it leans into the hand with its eyes half-closed and honks softly.
  - A calf: poked, it starts, peeps and scampers to its mother; stroked, it leans in and peeps.
  - Stegosaurus: poked, it turns its tail on you and swings it with a hiss.
  - T. rex: poked, it snaps round and roars; stroked, it puts up with it for a moment, growls, then rounds on you.
  - Brachiosaurus: it rumbles, turns and bows its long neck down to peer at the hand.
  - Pteranodon: on a perch it takes off; in the air it croaks and beats its wings.

  Hovering makes an animal glance at the hand. An animal busy with something bigger (a standoff, a hunt, drinking, a family moment) only looks round.
- **Footsteps:** each footfall sounds like what it lands on: a splash and plop in water, a sucking squelch in mud on the banks or wet ground, crunching gravel on the footpath, packed snow, or a thud with planting brushed aside on ordinary ground. The big animals are deeper and heavier on all of them.

v1.39: feeding:
- **A food for each:** "Feed" opens a menu of four foods:
  - Ferns (fronds and red cycad seeds): for the Triceratops and Stegosaurus.
  - A branch, hung on a rope from the lid at the height the Brachiosaurus browses: it reaches up and strips it.
  - A fish, tossed into the pool, flopping and splashing until a Pteranodon dives and snatches it.
  - Meat: the T. rex stalks over, sniffs it, pulls it in under its jaws, stoops to it and tears at it, wrenching its head from side to side.
- **From your hand:** a quick click drops the food. Press and hold to feed from your hand: the food stays in the hand, follows it, and the animals come to it there. The Brachiosaurus browses the branch you hold up, a Pteranodon swoops at a fish dangled over the water, and the T. rex snatches the meat out of your hand. Let go and whatever is left falls (or the branch stays hung).
- **Eating you can see:** jaws work between mouthfuls, scraps fall (fronds, seeds, meat), the food shrinks bite by bite, with crop and tear sounds. Each animal's belly fills as it eats and slowly goes down over a few minutes. A full animal lies down to sleep it off.
- **Documentary:** it films the feeding ("feeding", "stripping a branch", "tearing at a meal") and the nap afterwards ("sleeping it off").

v1.40: hot days, jostling at the food, colours through the year:
- **Cooling off:** on hot, sunny days the animals go to cool off:
  - the plant-eaters wade into the shallows of the pool or at the stream's fords, stand in the water, stamp up splashes and dip to drink, and the calves hop and splash about beside their mother;
  - Triceratops and Stegosaurus go to the mud hole on the pool's bank and roll in it, coming out caked from head to tail (it dries pale and flakes away over a few minutes);
  - the T. rex lies down in the stream and soaks;
  - the Brachiosaurus wades in.

  The documentary films them ("cooling off in the shallows", "wallowing in the stream", "a mud bath").
- **Jostling at the food:**
  - at a shared pile the bigger animal pushes in, so a smaller one gets a threat display, starts back, and edges in again a few seconds later;
  - a Stegosaurus swings its tail at anyone crowding it;
  - calves dart in for a stolen mouthful and scamper back to their mother;
  - when the T. rex comes for its meat, every plant-eater near it scatters.
- **Colours through the year:** in spring the frills, plates and crests flush bright red-orange for the breeding season (stronger on the males). In winter the hide goes duller, greyer and dustier. Calves are mottled and dappled, with pale broken bands across the back, fading as they grow up.

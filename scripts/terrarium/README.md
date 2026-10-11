# Weatherglass Terrarium

A glass-cased rainforest terrarium with a living bearded dragon. It is a photoreal companion to
[Weatherglass](../weatherglass/) and works the same way: the weather lives inside the box. You
can grab the clouds under the brass lid, wring rain out of them, shake them into thunderstorms,
stir the air, pour fog, mist the plants, touch the pool and wipe the fogged glass. After rain the
leaves bead and drip, puddles gather, and with the lamp behind you a rainbow can show in the rain.
The bearded dragon basks, roams the whole case, wades in the shallows, drinks, signals, hunts
crickets, grazes from a dish of greens, licks droplets off the leaves and shelters from storms in a
cave in the rock. Its colour follows its temperature and mood.

- Demo: https://jez237.com/demos/terrarium/
- Source: `scripts/terrarium/` (this folder). The public build lives in `demos/terrarium/`.

## Controls

| Tool | What it does |
|---|---|
| **Hand** | Grab a cloud to move it or fling it. Hold still on it, or scroll down over it, to squeeze out rain. Shake it hard to build a charge until lightning strikes. Right-click a cloud to shrink it; hold the right button to evaporate it. Touch or drag through the pool to make ripples and splashes. Brush over plants to part them, and tap the lizard to touch it. Dragging anywhere else turns the view; scroll or pinch to zoom right in. |
| **Cloud** | Hold to condense a new cloud, or to grow one you press on. Drag to stretch it out. Push clouds together to merge them: a big, wet cloud turns into a storm. |
| **Wind** | Drag across the case to blow a gust. Faint wisps and drifting dust trace the air. The grass parts along the stroke, loose leaves lift and tumble, and plants, moss, water, rain, fog and clouds all follow the flow. |
| **Fog** | Hold or drag to pour fog. It spreads out, runs downhill, pools on the water and burns off under the lamp. |
| **Wipe** | Drag across the glass to clear condensation. |
| **Feed** | Drop a cricket in. The lizard spots it, stalks it, fixes on it and strikes. Tap the stone dish to refill its greens. |
| **Mist** | Tap or hold to spray a fine mist from a bottle. It wets the leaves and the dragon comes over to lick the droplets off. Mist its face and it blinks and licks its lips. With the lamp behind you, a small rainbow can show in the spray. |

Other controls:

- The **eye** button follows the lizard with a close camera.
- The **palette** button, or `M`, cycles the dragon's colour morph: normal (wild-type), red, citrus and hypo (pale, with clear claws).
- Right-clicking a cloud with any tool shrinks it, and holding the button evaporates it.
- The **lamp schedule** dial sets the time of day. The lamp behaves like Weatherglass's sun.
  - **Its arc:** it rises at about 6:15 and sets at about 18:15, sweeping from left to right, so shadows swing through the day.
  - **Its light:** brightness follows its height, growing and fading over hours and warming to amber and orange near the horizon.
  - **The dial:** moving it makes the light glide rather than jump.
  - **The play button:** runs a day in about four minutes.
- At night the lamp goes off, the lid core glows blue and the lizard goes to sleep.
- Keys `1`–`7` choose tools, `M` changes the colour morph, and `H` hides the controls.
- `?ui=0` gives a clean presentation view.

## How it is made

Everything runs live in the browser with Three.js and WebGL 2. Nothing is pre-rendered video.

### The lizard

The bearded dragon (*Pogona vitticeps*) is sculpted in code, not downloaded.

- **Sculpt and bake.** `tools/bake-lizard.mjs` builds it from signed-distance primitives.
  - A lofted body follows keyframed cross-sections. The trunk is a broad, flat oval and the tail is thick at the base.
  - The head is a spade in plan, with proportions measured from photographs: from the ear to the snout it is about twice as long as it is deep at the eye. It has wide, spiny jowls, a flat crown edged by sharp canthal ridges, low brows overhanging the eyes and a forehead sloping to a blunt nose. A scaly turret surrounds each eye, a deep, dark ear opening sits behind the corner of the mouth, the lips swell slightly where the labial scales sit, and the mouth turns up at the back in the agamid "smile".
  - The limbs are sturdy and sprawling, with long knuckled toes and long, curved dark claws. A lateral body fold carries the fringe.
  - A separate mouth slit lets the jaw open onto a pink interior.
  - Sparse surface nets mesh it, the vertices are projected back onto the exact surface, and meshoptimizer simplifies it to about 150 000 triangles.
- **Skinning and spines.** Every primitive carries its bones, so skin weights come from the same soft blend that joins the shapes. That gives 50 bones: spine, tail, jaw, throat, limbs and every digit. About 1 600 spines and raised tubercles are grown on the surface, so the outline is rough up close, not just the shading:
  - rows of beard spines across the throat, with the longest along its outer edge under the jaw;
  - the great spines fanning back from behind each ear, the spiny jowl around the ear, and the nape and neck clusters;
  - a three-row flank fringe;
  - paravertebral rows and a dense field of low dorsal tubercles;
  - raised scales and spines over the flanks, neck, temples and cheeks, and studded limbs;
  - rows along the tail sides.
- **Nostril.** A rimmed, dark nostril opening sits on each side of the snout.
- **Lighting bake.** Ambient occlusion is baked from the distance field.
- **Skin shader.** One field of 3D Voronoi scales changes size, shape and overlap across the body, with an analytic height gradient so the scales stay sharp in close-up and fade cleanly at a distance.
  - **Scale types:** the limbs and tail carry large keeled scales that overlap toward the toes and the tail tip. Each one points down its own limb, taken from the bone it is skinned to. The back and flanks have small keeled scales, the belly small smooth overlapping ones, and the head and throat fine round beads. A row of rectangular labial plates runs along each lip.
  - **Pattern:** golden tan. A pale stripe runs down the spine between two rows of irregular dark blotches, with pale stripes along each side of the back and darker reticulated flanks with pale spots. There are dark bars on the nape, fine speckling, and banded legs and tail.
  - **Face:** an orange flush on the jowls, the beard's base and around the eyes, a browner mottled crown, a dark eye stripe, cream lips and an ivory beard and spines. The beard darkens to black during display.
  - **Eyes:** a golden-amber iris with radial fibres, flecks and a round black pupil, under a clear-coated cornea. Lids of concentric orange-brown scale rings close from below.
  - **Tone:** the golden-orange drifts in hue across the body, the legs are warmer and the tail duller, and each scale varies a little. The lamp glows through thin parts (spines, beard, toes and the lateral fringe).
  - **Colour change:** like a real dragon it darkens when cool, to absorb more heat, and pales as it warms. Under stress (storms, lightning, sudden movement) the beard goes black. While basking it flattens its body to catch more light.
  - **Morphs:** four colour palettes: normal, red, citrus and hypo. Choose with the palette button, `M` or `?morph=`.
- **Rig** (`lib/LizardRig.ts`):
  - **Gait:** a trot-like gait with diagonal limb pairs. Feet stay planted, the heel peels off before lift-off, the toes roll, and steps re-aim mid-swing. Two-bone IK keeps elbows and knees sprawled outward. Feet grip the edge of narrow perches such as the log.
  - **Body:** the trunk bends in a standing wave timed to the steps, while the head counter-rotates to keep its gaze steady. The tail is a follow-the-leader rope: its base is carried a little clear of the ground on the move, and the rest drags. In a sprint the body rises, the nose lifts and the tail comes off the ground.
  - **Head and breathing:** quick saccadic head turns, eye saccades, blinking, flank breathing and throat pumping. The beard puffs during display, and the jaw and tongue move.
- **Behaviour** (`lib/LizardBrain.ts`):
  - **Navigation:** routes come from A* over a walkability grid that prefers clearance from walls, rock edges and plants. A shallow pebble shelf lets the lizard wade across the pool to reach the far bank. It steers smoothly around corners, slides along obstacles, re-plans when blocked or stalled and gives up gracefully. It only heads for places it can reach, and it favours parts of the case it has not visited lately.
  - **Moving around:** bursts and freezes with head scanning. It turns its head toward the route before setting off, and stops now and then to tongue-tap the ground.
  - **Temperature:** its body temperature follows its surroundings over tens of seconds. The basking lamp warms it; shade, the cave, rain and wet skin cool it. A cold dragon makes for the lamp and stays until it has warmed up; a hot one gapes and soon moves off.
  - **Basking and soaking:** it basks under the lamp with the chest raised and the body flattened, sometimes with the mouth open to shed heat. It also soaks in the shallows.
  - **Drinking:** the head is lowered until the mouth meets the water, and each lap ripples it. After rain or misting it walks over to the wet plants, stretches up to a leaf tip and laps the droplets off it, sometimes knocking a drop loose.
  - **Greens:** now and then it grazes from the dish of torn greens and squash, nipping out one piece at a time and chewing.
  - **Signalling:** head-bob displays and slow arm waves.
  - **Hunting:** stalking from a reachable stand-off point, fixation and a strike. A cricket within reach is taken with a flick of the sticky tongue and reeled in; one further off gets a lunge. Crickets sometimes hop away at the last moment, and the strike misses. It grabs the cricket crosswise and thrashes its head to subdue it. Then it chews the cricket in bite by bite, with a crunch at each snap of the jaws, while the cricket's legs kick less and less. It swallows with its head raised and its throat bulging, then licks its lips. Crickets it cannot reach are watched, not chased.
  - **Storms:** a storm sends it hurrying to its cave without the usual stops. There it turns round to face out of the mouth and watches the storm, flinching and blinking at the thunder. If night falls it sleeps there, and it comes out once the weather has been clear for a few seconds.
  - **Rest and reactions:** it sleeps flat at night and flinches from fast movement nearby. Close lightning sends it running; distant lightning makes it freeze and stare. It closes its eyes when touched. Plants part around its body as it pushes through.

All motion constants are illustrative. They are not measured from real bearded dragons.

### The case and its landscape

- **Peaks.** The two basalt massifs and their cascade ledges are baked by `tools/bake-peaks.mjs`. They are clusters of leaning, faceted columns with proud fracture ridges and inclined strata, also meshed from a distance field with baked occlusion. The shader adds dark stone, lichen, moss on upward faces and in crevices, and a wet streak down the cascade.
- **Cave.** A cave is hollowed into the foot of the left massif (`lib/cave.json`): a low chamber with a levelled floor of grit and loose pebbles, and an arched mouth framed by jamb rocks.
  - **Floor and roof:** the surface map keeps two heights. Rays cast up from the ground find the ceiling, so the floor is what feet stand on and the roof is what the rain, clouds, lightning and camera see.
  - **Shelter:** rain lands on the roof, and the floor stays dry.
  - **Clear ground:** plants are kept off the floor and its apron.
- **Water.**
  - The pool has a wadeable pebble-and-silt shelf and a plunge pocket scoured out under the falls. Its tea-stained water absorbs light with depth, refracts the bed and reflects the scene through a planar mirror render.
  - A GPU wave simulation (two height buffers, 120 steps a second) carries ripples from fingers and stirring, raindrops, wading feet, lapping, falling crickets, the falls and lightning strikes. Waves reflect off the shore and die away, and ripple faces catch the lamp. Touching the water flicks up droplets that ripple where they land.
  - Wind roughens the surface into cat's paws.
  - The water column is visible through the front glass, its surface line moving with the ripples.
  - The cascade is a set of flowing, foaming ribbons with spray.
- **Planting.**
  - **Moss:** 14-layer shell-rendered moss. It grows in mounded cushions of several species with soil showing between them, and wind combs it in visible gust bands.
  - **Ferns:** CC0 scanned fern clumps with backlit translucency, filling the back of the case.
  - **Leafy plants:** procedurally modelled Pilea, Fittonia, earth-star bromeliads and creeping fig.
  - **Understorey (`lib/Flora.ts`):**
    - red-hearted Neoregelia bromeliads and ferns rooted in the rock shelves;
    - air plants on the log;
    - a flowering miniature orchid and Calathea with feathered leaves;
    - sedges along the shore, spikemoss carpets and mushrooms by the log;
    - creeping fig climbing the peaks;
    - twigs and pebbles, and leaves floating on the pool.
  - **Litter:** several hundred fallen leaves on crumbly humus with bark chips.
  - **Meadow (`lib/Meadow.ts`):** about 7 000 fine grass and sedge blades in clumps across open soil, along the shore and at the front glass.
  - **Wind response:** every plant reads the wind where each of its parts stands, not just at its root. A gust crossing a fern bends its near fronds first, and a wind stroke parts the meadow along its path while gusts run through it in waves. Plants flutter in turbulence and flash their paler undersides in gusts.
  - **Loose leaves (`lib/LeafDrift.ts`):** dead leaves lie on the floor. A strong enough local wind lifts them; they tumble with the air, flutter down and settle again, or float on the pool.
  - **Dust (`lib/Motes.ts`):** motes and spores ride the wind field exactly, and glint where they cross the lamp's beam.
- **Substrate.** A cut-away front shows drainage pebbles, soil, bark, perlite and roots.
- **Glass.**
  - The glass is drawn in its own pass with access to a mip-mapped copy of the scene behind it.
  - Fog blurs what is behind it, and droplets act as small lenses with rims and highlights.
  - Condensation is simulated per pane: it collects at cool edges, can be wiped away, and sheds drips that leave clear trails.
  - Faint smudges vary the reflections.
- **Room and camera.** The room around the case has a walnut table, an Edison lamp and out-of-focus house plants. Post-processing adds ground-truth ambient occlusion, bloom, depth of field focused on the orbit target, ACES tone mapping, a vignette, film grain and faint chromatic aberration.

### Weather

The weather systems follow Weatherglass's design, rescaled to this case.

- **Air.** A small 2-D incompressible flow field covers the case. It uses semi-Lagrangian advection and a Jacobi pressure projection, and walls turn the flow aside. Wind strokes, rain-cloud downdraughts, lightning and the lamp's slow convection all stir it.
- **Clouds.** Each cloud is a cluster of puffs on jelly springs, ray-marched as a volume from a smooth signed distance field eroded by tileable Perlin–Worley noise. The lighting uses dual-lobe phase functions and powder darkening.
  - **Squeezing:** a squeezed cloud squashes, trembles, greys and darkens underneath, and rains harder the wetter it is.
  - **Storms:** merged clouds pool their water, and a big, wet cloud builds storm towers and an anvil. A storm has a life: it rains itself out over about a minute, and then it clears. A cloud too big for the case is squeezed to fit, rather than jostling against the glass.
  - **Shrinking:** right-clicking a cloud evaporates part of it and calms it. Hold the button and it thins away.
  - **Shadows:** clouds cast soft shadows through the lamp, and cloud cover and storms dim the case.
- **Lightning.** Shaking a cloud, or a storm on its own, builds charge, and it flickers inside the cloud before it strikes. A hard shake takes a few seconds to bring a strike.
  - **The bolt:** a branching channel made by recursive midpoint displacement. A stepped leader reveals it, then two to four return strokes flash the whole case.
  - **The strike:** it hits high ground or the water nearby, throwing sparks and cooling embers (blue spray on water).
  - **Reactions:** thunder rolls in after a delay, the air is pushed outward and the crickets scatter.
- **Rain.**
  - Drops fall from the cloud base, drift with the air and land as splash crowns and droplets, or as jets and ripples on the pool.
  - Each drop shows as a streak: its blur over about a fortieth of a second. The streak is lit by the lamp and glints when backlit.
  - Heavy rain shows as grey shafts under the cloud.
  - The soil darkens only where it actually rained, then dries under the lamp and in the wind.
  - **Puddles:** where open, level soil is soaked, the hollows fill first and grow into dark, glassy puddles, with rings from the drops landing in them. They shrink again as the floor dries. The cave's roof keeps its floor dry, but the worn apron at its mouth puddles readily.
  - **Wet leaves:** after rain the leaves are beaded with water that glints in the lamp, and drops fall from the leaf tips for a minute or so.
  - **Rainbow:** where the lamp shines through falling rain or mist, a bow can appear: about 41° from the point opposite the light, red outside, with a fainter, reversed secondary bow beyond it. It only shows with the lamp behind you, it moves as you move, and the cloud shades the top of its own rain. The lamp hangs almost overhead, so the bow is drawn as if the light came in lower, as the sun does on a showery afternoon.
- **Misting.** The misting bottle throws fine droplets that slow within a hand's breadth and drift down. They wet the leaves and raise the humidity.
- **Fog.** A shallow-fluid grid holds density, layer thickness, freshness and momentum. Fog spreads where it is poured, runs downhill, levels like a liquid, drifts with the air, and burns off under the lamp or in strong wind. It is ray-marched as a lit volume with billowing tops and wispy edges, stopped by the scene's depth, and fresh pours throw off billows.
- **Climate.** Rain and fog raise the humidity, which drives condensation on the glass and wetness on the leaves, rock and skin. The lamp's arc sets the lights and the lizard's day.
- **Crickets.** Feeder crickets are modelled as house crickets (*Acheta domesticus*):
  - **Body:** a round head with glossy compound eyes and palps, a saddle-shaped pronotum, veined folded forewings and a segmented abdomen.
  - **Appendages:** long sweeping antennae and tail cerci, and on females an ovipositor.
  - **Legs:** jointed walking legs, and drumstick hind legs with spurred shins.
  - **Movement:** they scuttle on a tripod gait and hop with the hind legs kicking out. When caught, they kick.
- **Sound.** All sound is procedural Web Audio:
  - the cascade, rain hiss and ticks, drips and cricket chirps;
  - a whoosh that follows wind strokes;
  - squish, grab, fling and merge sounds for the clouds, and crackles in charged clouds;
  - thunder (an immediate crack, then a delayed rolling rumble);
  - splashes when the water is touched;
  - a rising hiss as a cloud evaporates, and crunches as the lizard eats;
  - the click and hiss of the misting bottle.

  Sound starts only after you interact with the page.

## Assets and licences

Scanned models are CC0 from [Poly Haven](https://polyhaven.com), reused from this site's 3D aquarium. See `public/models/ATTRIBUTION.md`.

- Rock Moss Set 01 (Kless Gyzen)
- Dead Tree Trunk 02 (Jenelle van Heerden, Rico Cilliers)
- Fern 02 (Rob Tuytel, Rico Cilliers)
- Moss 01 (Rob Tuytel)

The fern scans are 2K or downscaled to 1K for this demo.

The lizard, peaks, plants, water, clouds, fog, lightning, textures and sounds are all generated in code. Three.js, three-mesh-bvh and meshoptimizer are MIT-licensed. No paid services or image or video generators are used.

## Build

Requires Node 22.13 or newer. From this folder:

```sh
npm ci
npm run dev            # http://127.0.0.1:5191/ (lizard-study.html is a dev-only rig and shading page)
npm run build          # bakes the lizard and peaks, type-checks, builds, publishes to demos/terrarium/
npm test               # rig, navigation and geometry checks
```

The bakes are deterministic and skip themselves when their sources are unchanged.

Development URL options:

- `?frames=N` renders a fixed number of frames for screenshots.
- `?sim=S` simulates S seconds before the first frame.
- `?crickets=N` drops crickets in at load.
- `?ao=0`, `?dof=0` and `?bloom=0` turn off individual effects.
- `?quality=full` disables adaptive quality.
- `?hours=H` starts at a given time of day.
- `?morph=normal|red|citrus|hypo` chooses the dragon's colour morph.
- `?lite` starts lighter: a lower pixel ratio, no multisampling, ambient occlusion or depth of field, fewer moss layers and a smaller shadow map.
- `?debug` shows a small panel with the build, the GPU, its relevant WebGL extensions, the frame rate, which effects are on, anything turned off after a black picture, and any errors. Use it to report a problem from a phone. It also appears on its own if drawing fails.
- `?cam=x,y,z&target=x,y,z` places the camera.

## Performance

The full effects are tuned for desktop GPUs. If frames are sustained-slow, the demo steps down gradually in this order:

1. pixel ratio;
2. depth of field and the cloud and fog ray-march steps;
3. ambient occlusion;
4. moss layers.

It never decides from device labels. Use `?quality=full` to keep every effect on.

Some phone GPUs fail where desktop ones do not, so there are some safeguards.

- **Bad pixels:** one shader producing a NaN or an infinity in a single pixel would be smeared by the glass blur, the depth of field and the bloom's widest level across the whole frame, which shows as a black screen. Every pass that blurs therefore reads the scene through a clean-up step: bad pixels become black specks and extreme highlights are capped.
- **Shader compiling:** all shaders are compiled behind the loading screen, in parallel where the browser supports it, rather than stalling the first frames.
- **Black picture:** the finished picture is sampled every second and a half at first (by the clock), then less often. If it comes out black twice in a row, effects are turned off one at a time until the scene shows: bloom, ambient occlusion, depth of field, multisampling, then the whole post-processing chain.
- **Frame errors:** three.js stops its animation loop for good at the first exception, which would leave a blank case with the controls and sound still working. Each frame is guarded instead: the loop carries on, a failure that keeps repeating turns the effects down, and the diagnostics panel appears.
- **Stalls:** if no frame finishes for 14 seconds, or every fallback has been used, the diagnostics panel appears with the reason.
- **Lost GPU context:** if the browser takes the GPU context away, the page reloads once in `?lite` mode.
- **Float textures:** only half-float data textures are filtered, because 32-bit float filtering is missing on many phones.

## Limits

This is a real-time artistic reconstruction, not a path-traced or biologically measured model:

- Glass, water optics, caustics, cloud and fog lighting are approximations.
- The wind and fog are 2-D fields.
- The cascade is not a fluid simulation.
- The lizard's anatomy follows bearded-dragon references, but its proportions, gait and behaviour are illustrative.
- Very close views show the limits of the procedural scales and the scan textures.

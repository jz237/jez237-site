# Weatherglass Terrarium

A glass-cased rainforest terrarium with a living bearded dragon. It is a photoreal companion to
[Weatherglass](../weatherglass/) and works the same way: the weather lives inside the box. You
can grab the clouds under the brass lid, wring rain out of them, shake them into thunderstorms,
stir the air, pour fog, touch the pool and wipe the fogged glass. The bearded dragon basks,
roams the whole case, wades in the shallows, drinks, signals and hunts crickets.

- Demo: https://jez237.com/demos/terrarium/
- Source: `scripts/terrarium/` (this folder). The public build lives in `demos/terrarium/`.

## Controls

| Tool | What it does |
|---|---|
| **Hand** | Grab a cloud to move it or fling it. Hold still on it, or scroll down over it, to squeeze out rain. Shake it hard to build a charge until lightning strikes. Touch or drag through the pool to make ripples and splashes. Brush over plants to part them, and tap the lizard to touch it. Dragging anywhere else turns the view; scroll or pinch to zoom right in. |
| **Cloud** | Hold to condense a new cloud, or to grow one you press on. Drag to stretch it out. Push clouds together to merge them: a big, wet cloud turns into a storm. |
| **Wind** | Drag across the case to blow a gust. Faint wisps trace the air. Plants, moss, water, rain, fog and clouds all follow the flow. |
| **Fog** | Hold or drag to pour fog. It spreads out, runs downhill, pools on the water and burns off under the lamp. |
| **Wipe** | Drag across the glass to clear condensation. |
| **Feed** | Drop a cricket in. The lizard spots it, stalks it, fixes on it and strikes. |

Other controls:

- The **eye** button follows the lizard with a close camera.
- The **lamp schedule** dial sets the time of day. The play button lets the day run on its own.
- At night the lamp goes off, the lid core glows blue and the lizard goes to sleep.
- Keys `1`–`6` choose tools, and `H` hides the controls.
- `?ui=0` gives a clean presentation view.

## How it is made

Everything runs live in the browser with Three.js and WebGL 2. Nothing is pre-rendered video.

### The lizard

The bearded dragon (*Pogona vitticeps*) is sculpted in code, not downloaded.

- **Sculpt and bake.** `tools/bake-lizard.mjs` builds it from signed-distance primitives.
  - A lofted body follows keyframed cross-sections. The trunk is a broad, flat oval and the tail is thick at the base.
  - The head is short and blunt, with wide jowls, a flat crown, brow ridges, eye sockets, small nostrils and ear openings.
  - The limbs are sturdy and sprawling, with long knuckled toes and dark claws. A lateral body fold carries the fringe.
  - A separate mouth slit lets the jaw open onto a pink interior.
  - Sparse surface nets mesh it, the vertices are projected back onto the exact surface, and meshoptimizer simplifies it to about 150 000 triangles.
- **Skinning and spines.** Every primitive carries its bones, so skin weights come from the same soft blend that joins the shapes. That gives 50 bones: spine, tail, jaw, throat, limbs and every digit. Over 700 spines and tubercles are grown on the surface:
  - rows of beard spines across the throat and jaw;
  - the spiny jowl around each ear, and the nape and neck clusters;
  - a three-row flank fringe;
  - paravertebral and scattered dorsal tubercles;
  - rows along the tail sides.
- **Lighting bake.** Ambient occlusion is baked from the distance field.
- **Skin shader.** The shader grows domed 3D Voronoi scales with an analytic height gradient, so they stay sharp in close-up and fade cleanly at a distance. The colouring is sandy tan with dark, reticulated dorsal blotches in loose bands, pale spots, blotched flanks, fine speckling and a banded tail. The face has an orange flush on the jowls and around the eyes, a dark eye stripe and pale lips. The belly is cream, and the beard darkens to black during display. The eyes have a clear-coated cornea over a painted iris, and eyelids that close from below.
- **Rig** (`lib/LizardRig.ts`):
  - **Gait:** a trot-like gait with diagonal limb pairs. Feet stay planted, the heel peels off before lift-off, the toes roll, and steps re-aim mid-swing. Two-bone IK keeps elbows and knees sprawled outward. Feet grip the edge of narrow perches such as the log.
  - **Body:** the trunk bends in a standing wave timed to the steps, while the head counter-rotates to keep its gaze steady. The tail is a follow-the-leader rope: its base is carried a little clear of the ground on the move, and the rest drags. In a sprint the body rises, the nose lifts and the tail comes off the ground.
  - **Head and breathing:** quick saccadic head turns, eye saccades, blinking, flank breathing and throat pumping. The beard puffs during display, and the jaw and tongue move.
- **Behaviour** (`lib/LizardBrain.ts`):
  - **Navigation:** routes come from A* over a walkability grid that prefers clearance from walls, rock edges and plants. A shallow pebble shelf lets the lizard wade across the pool to reach the far bank. It steers smoothly around corners, slides along obstacles, re-plans when blocked or stalled and gives up gracefully. It only heads for places it can reach, and it favours parts of the case it has not visited lately.
  - **Moving around:** bursts and freezes with head scanning. It turns its head toward the route before setting off, and stops now and then to tongue-tap the ground.
  - **Basking and soaking:** it basks under the lamp with the chest raised, sometimes with the mouth open to shed heat. It also soaks in the shallows.
  - **Drinking:** the head is lowered until the mouth meets the water, and each lap ripples it.
  - **Signalling:** head-bob displays and slow arm waves.
  - **Hunting:** stalking from a reachable stand-off point, fixation and a lunging strike with tongue reach, then chewing and lip-licking. Crickets it cannot reach are watched, not chased.
  - **Rest and reactions:** it sleeps flat at night and flinches from fast movement nearby. Close lightning sends it running; distant lightning makes it freeze and stare. It closes its eyes when touched. Plants part around its body as it pushes through.

All motion constants are illustrative. They are not measured from real bearded dragons.

### The case and its landscape

- **Peaks.** The two basalt massifs and their cascade ledges are baked by `tools/bake-peaks.mjs`. They are clusters of leaning, faceted columns with proud fracture ridges and inclined strata, also meshed from a distance field with baked occlusion. The shader adds dark stone, lichen, moss on upward faces and in crevices, and a wet streak down the cascade.
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
  - **Wind response:** plants bend with the local wind, flutter in turbulence and flash their paler undersides in gusts.
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
  - **Storms:** merged clouds pool their water, and a big, wet cloud builds storm towers and an anvil.
  - **Shadows:** clouds cast soft shadows through the lamp, and cloud cover and storms dim the case.
- **Lightning.** Shaking a cloud, or a storm on its own, builds charge, and it flickers inside the cloud before it strikes.
  - **The bolt:** a branching channel made by recursive midpoint displacement. A stepped leader reveals it, then two to four return strokes flash the whole case.
  - **The strike:** it hits high ground or the water nearby, throwing sparks and cooling embers (blue spray on water).
  - **Reactions:** thunder rolls in after a delay, the air is pushed outward and the crickets scatter.
- **Rain.**
  - Drops fall from the cloud base, drift with the air and land as splash crowns and droplets, or as jets and ripples on the pool.
  - Heavy rain shows as grey shafts under the cloud.
  - The soil darkens only where it actually rained, then dries under the lamp and in the wind.
- **Fog.** A shallow-fluid grid holds density, layer thickness, freshness and momentum. Fog spreads where it is poured, runs downhill, levels like a liquid, drifts with the air, and burns off under the lamp or in strong wind. It is ray-marched as a lit volume with billowing tops and wispy edges, stopped by the scene's depth, and fresh pours throw off billows.
- **Climate.** Rain and fog raise the humidity, which drives condensation on the glass and wetness on the leaves, rock and skin. The lamp schedule sets the lights and the lizard's day.
- **Sound.** All sound is procedural Web Audio:
  - the cascade, rain hiss and ticks, drips and cricket chirps;
  - a whoosh that follows wind strokes;
  - squish, grab, fling and merge sounds for the clouds, and crackles in charged clouds;
  - thunder (an immediate crack, then a delayed rolling rumble);
  - splashes when the water is touched.

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

## Performance

The full effects are tuned for desktop GPUs. If frames are sustained-slow, the demo steps down gradually in this order:

1. pixel ratio;
2. depth of field and the cloud and fog ray-march steps;
3. ambient occlusion;
4. moss layers.

It never decides from device labels. Use `?quality=full` to keep every effect on.

## Limits

This is a real-time artistic reconstruction, not a path-traced or biologically measured model:

- Glass, water optics, caustics, cloud and fog lighting are approximations.
- The wind and fog are 2-D fields.
- The cascade is not a fluid simulation.
- The lizard's anatomy follows bearded-dragon references, but its proportions, gait and behaviour are illustrative.
- Very close views show the limits of the procedural scales and the scan textures.

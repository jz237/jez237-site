# Weatherglass Terrarium

A glass-cased rainforest terrarium with a living bearded dragon. It is a photoreal companion to
[Weatherglass](../weatherglass/), keeping its "weather in a box" idea: clouds float under a brass
lid, and you can move them, wring out rain, blow wind, fill the case with mist and wipe the
fogged glass. The lizard basks, explores, drinks, signals and hunts crickets.

- Demo: https://jez237.com/demos/terrarium/
- Source: `scripts/terrarium/` (this folder). The public build lives in `demos/terrarium/`.

## Controls

| Tool | What it does |
|---|---|
| **Hand** | Drag to look around, scroll or pinch to zoom. Grab a cloud to move it. Tap the lizard to touch it. |
| **Rain** | Press and hold a cloud to wring out rain. The cloud darkens and shrinks as it empties, then refills slowly. |
| **Mist** | Hold anywhere to fill the case with low mist. |
| **Wind** | Drag across the scene to blow a gust through the plants, clouds, rain and mist. |
| **Wipe** | Drag across the glass to clear condensation. Drips run down as the air gets wetter. |
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

The bearded dragon is sculpted in code, not downloaded.

- **Sculpt and bake.** `tools/bake-lizard.mjs` builds an agamid from signed-distance primitives.
  - These include a lofted body with keyframed cross-sections, sprawling limbs with knuckled toes and claws, brow ridges, eye sockets, nostrils, ear pits and a lateral body fold.
  - A separate mouth slit lets the jaw open onto a pink interior.
  - Sparse surface nets mesh it, the vertices are projected back onto the exact surface, and meshoptimizer simplifies it to about 130 000 triangles.
- **Skinning and spines.** Every primitive carries its bones, so skin weights come from the same soft blend that joins the shapes. That gives 50 bones: spine, tail, jaw, throat, limbs and every digit. Around 400 spines and tubercles are grown on the surface: the beard, ear clusters, flank fringe and back rows.
- **Lighting bake.** Ambient occlusion is baked from the distance field.
- **Skin shader.** The shader grows domed 3D Voronoi scales with an analytic height gradient, so they stay sharp in close-up and fade cleanly at a distance. It adds:
  - head plates;
  - a salt-and-pepper scale tint;
  - paravertebral chevrons and dorsolateral spots;
  - tail bands;
  - an eye stripe;
  - a beard that darkens during display.

  The eyes have a clear-coated cornea over a painted iris, and eyelids that close from below.
- **Rig** (`lib/LizardRig.ts`):
  - **Gait:** a trot-like gait with diagonal limb pairs. Feet stay planted, the heel peels off before lift-off, the toes roll, and steps re-aim mid-swing. Two-bone IK keeps elbows and knees sprawled outward. Feet grip the edge of narrow perches such as the log.
  - **Body:** the trunk bends in a standing wave timed to the steps, while the head counter-rotates to keep its gaze steady. The tail is a follow-the-leader rope that drags on the ground and swings with a small travelling wobble.
  - **Head and breathing:** quick saccadic head turns, eye saccades, blinking, flank breathing and throat pumping. The beard puffs during display, and the jaw and tongue move.
- **Behaviour** (`lib/LizardBrain.ts`):
  - **Moving around:** short bursts and freezes with head scanning, using A* paths on a walkability grid around rock, water and planting.
  - **Basking:** with the chest raised, sometimes with the mouth open to shed heat.
  - **Drinking:** the head is lowered until the mouth meets the water, and each lap ripples it.
  - **Signalling:** head-bob displays and slow arm waves.
  - **Hunting:** stalking, fixation and a lunging strike with tongue reach, then chewing and lip-licking.
  - **Rest and reactions:** it sleeps flat at night, flinches from fast movement nearby and closes its eyes when touched.

All motion constants are illustrative. They are not measured from real bearded dragons.

### The case and its landscape

- **Peaks.** The two basalt massifs and their cascade ledges are baked by `tools/bake-peaks.mjs`. They are clusters of leaning, faceted columns with proud fracture ridges and inclined strata, also meshed from a distance field with baked occlusion. The shader adds dark stone, lichen, moss on upward faces and in crevices, and a wet streak down the cascade.
- **Water.**
  - The pool refracts its pebble bed, absorbs light with depth and reflects the scene through a planar mirror render.
  - Its surface ripples from the falls, from rain and from the lizard's tongue, and caustics play on the bed.
  - The water column is visible through the front glass with a bright meniscus line.
  - The cascade is a set of flowing, foaming ribbons with spray.
- **Planting.**
  - **Moss:** 14-layer shell-rendered cushion moss with self-shadowed strands.
  - **Ferns:** CC0 scanned fern clumps with backlit translucency and sway.
  - **Leafy plants:** procedurally modelled Pilea, Fittonia, creeping fig and red-bronze earth-star bromeliads.
  - **Litter:** fallen leaves.
- **Substrate.** A cut-away front shows drainage pebbles, soil, bark, perlite and roots.
- **Glass.**
  - The glass is drawn in its own pass with access to a mip-mapped copy of the scene behind it.
  - Fog blurs what is behind it, and droplets act as small lenses with rims and highlights.
  - Condensation is simulated per pane: it collects at cool edges, can be wiped away, and sheds drips that leave clear trails.
  - Faint smudges vary the reflections.
- **Clouds.** They are ray-marched volumes built from puffs and tileable 3D Worley-value noise, with light marched toward the lamp.
- **Room and camera.** The room around the case has a walnut table, an Edison lamp and out-of-focus house plants. Post-processing adds ground-truth ambient occlusion, bloom, depth of field focused on the orbit target, ACES tone mapping, a vignette, film grain and faint chromatic aberration.

### Weather and sound

- **Weather.** Rain, mist and wind change the humidity, which drives condensation on the glass and wetness on the soil, leaves, rock and skin. The lamp schedule sets the lights and the lizard's day.
- **Sound.** All sound is procedural Web Audio: the cascade, rain ticking on the glass, drips, wind and cricket chirps. It starts only after you interact with the page.

## Assets and licences

Scanned models are CC0 from [Poly Haven](https://polyhaven.com), reused from this site's 3D aquarium. See `public/models/ATTRIBUTION.md`.

- Rock Moss Set 01 (Kless Gyzen)
- Dead Tree Trunk 02 (Jenelle van Heerden, Rico Cilliers)
- Fern 02 (Rob Tuytel, Rico Cilliers)
- Moss 01 (Rob Tuytel)

The fern scans are 2K or downscaled to 1K for this demo.

The lizard, peaks, plants, water, clouds, textures and sounds are all generated in code. Three.js, three-mesh-bvh and meshoptimizer are MIT-licensed. No paid services or image or video generators are used.

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

The full effects are tuned for desktop GPUs. If frames are sustained-slow, the demo steps down gradually: pixel ratio first, then depth of field, ambient occlusion and moss layers. It never decides from device labels. Use `?quality=full` to keep every effect on.

## Limits

This is a real-time artistic reconstruction, not a path-traced or biologically measured model:

- Glass, water optics, caustics and cloud lighting are approximations.
- The cascade is not a fluid simulation.
- The lizard's anatomy is stylised from bearded-dragon references, and its gait and behaviour are illustrative.
- Very close views show the limits of the procedural scales and the scan textures.

# Living Reef — first 3D preview

Separate reef option built from the current jez237 planted aquarium renderer.
The reference supplied September 22 guides the two islands, archways, white sand
channel, corals, anemones and fish palette. All scenery and inhabitants have 3D
volume; the reference image is not used as a scene background.

**Publication boundary:** jez237.com and jz237/jez237-site only. Do not add the reef
option to Hidden Reef until the user approves its realism. The planted aquarium
and its shared freshwater biology/chemistry bundles are unchanged.

## Develop and build

- `npm run dev:reef` — local preview at port 5240.
- `npm run build:reef` — type-check, build and copy to `demos/reef-aquarium/`.
- `npm run check:reef` — browser behavior, controls, collision and mobile checks.
  Inspect `reef/qa/front.png`, `angle.png` and `mobile.png` before releasing.

The small jez237-only selector is maintained by `scripts/reef_navigation.mjs`.
Shared aquarium rebuilds preserve it without adding it to either Hidden Reef copy.

## Current visual pass

Irregular forked coral with rounded growth tips, rock-attached bases, closed thin
plate skeletons, and procedural limestone albedo/normal/roughness maps. The QA
run includes coral and anemone close-ups for checking tissue detail as well as full views.
Anemones have continuous rounded skin, a rock-anchored column and oral disc,
individual curved tentacles, and root-to-tip GPU deformation shared across views.
A geometry check guards against inward-facing tentacle surfaces.

Basic anemone anatomy is informed by the [National Aquarium](https://aqua.org/explore/animals/anemones)
and [Oregon Coast Aquarium](https://aquarium.org/animals/bubble-tip-anemone/).
The reference guides the artistic appearance; flow and tissue shading are illustrative,
not a species-calibrated fluid or subsurface-scattering simulation.

## Marine fish detail

Six Blender-authored species now use generated photographic-style references, individually traced volumetric bodies, fine skin/fin textures, shallow eyes and body-conforming gills. Rooted fin flex and separate pectoral pivots preserve attachments during swimming; mouth positions follow each species anatomy for food contact. Geometry/textures are shared across 20 inhabitants.

See [model-source/README.md](model-source/README.md) for references, exact GPT Image prompts, the editable Blender file and regeneration instructions. The six full-resolution embedded GLBs add approximately 5.5 MB to first load and are cached as versioned assets. Tests inspect the actual exported meshes, embedded images, paired fins/gills and closed bodies. Macro review covers all six species. These models remain artistic approximations rather than taxonomic specimens.

## Rendering and behavior

Shared water, glass, contact shading, adaptive effects and reflection scheduling.
Merged coral/rock geometry, instanced rubble and food, generated cached materials,
GPU body waves and soft-tentacle deformation. Full geometry stays present at every
effects tier. Auto lowers expensive optical effects only after sustained slow frames.
Fish maintain individual goals and speed variation, loose species association,
separation, swept obstacle tests, stable upright turns and actual food consumption.
Clownfish stay near their anemone. Pause freezes biological time. Freshwater assets
are not loaded by the reef and the reef is not loaded by the planted aquarium.

Behavior rates and the mixed display are illustrative, not experimentally calibrated
species measurements or a tank stocking recommendation. Collisions use conservative
volumes rather than triangle-perfect anatomical contact. Further work: more accurate
species anatomy/textures, detailed polyp tissue, indirect reef lighting and improved
local routing through tight spaces. This first preview is not yet photographic parity
with the supplied reference or the mature planted aquarium.

Natural-history references: Monterey Bay Aquarium's
[clownfish](https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/clownfish)
and [coral reefs](https://www.montereybayaquarium.org/animals-the-ocean/ecosystems/coral-reefs).
No purchased models, paid generation or paid assets were used.

## Scanned rock and retained geometry detail

Locally hosted CC0 Seaside Rock surface maps by Dimitrios Savva / Poly Haven:
https://polyhaven.com/a/seaside_rock (license: https://polyhaven.com/license).
See assets/README.md for provenance. The maps are used on volumetric 3D rock,
with small irregular crust colors baked once into vertices. This is an artistic
live-rock material, not a scan of living coral. The three 1K maps add 2.49 MB to
first load; rendering starts after all maps and lighting are ready.

Anemones retain shared indexed vertices. All expanded attributes match the prior
geometry exactly; buffer storage decreases from 28,717,200 to 7,621,920 bytes.
Triangle count, shape, color, normals and animation attributes are unchanged.

## Rock-attached polyp gardens

560 polyps follow the actual rock triangles instead of spherical support cushions.
Zoanthid crowns include recessed mouths, patterned oral discs and two alternating
fringes with 3,072 tapered tentacles. Roots remain fixed while the GPU adds subtle
current motion. Stony corallites remain rigid. Indexed geometry forms one mesh.

Anatomy reference: [Museums Victoria zoanthids](https://collections.museumsvictoria.com.au/species/8619).
Colors and movement are illustrative, not a calibrated species simulation.
No image from that source is embedded or redistributed.

A temporary X/Z triangle index accelerates exact vertical attachment queries.
Regression tests compare it against Three.js through overhangs and depth limits.
It is discarded after construction; no per-frame surface search. The rejected
raycast prototype took 7.0 seconds locally to start; the final detailed version
takes 1.78 seconds (prior accepted 1.45), while both sustain about 60 FPS on the
local test computer. Other devices remain unmeasured.

## Stony coral growth and tissue

Branching colonies now have finer tapered tips, rounded terminal growth, smoother
seams and sparse modeled radial corallite cups. Plate colonies have asymmetric
folds, scalloped margins and a narrow pale growth edge. Baked diffuse, normal and
roughness maps add smaller corallites and tissue variation between modeled cups.
The three full-resolution 512-pixel maps add 0.87 MB to the first download; their
deterministic source is retained under model-source. No runtime texture synthesis.

Morphology inspiration: [Corals of the World, Acropora loripes](https://www.coralsoftheworld.org/species_factsheets/species_factsheet_summary/acropora-loripes/)
and [Smithsonian coral anatomy](https://ocean.si.edu/ocean-life/invertebrates/corals-and-coral-reefs).
This is an artistic mixed reef, not a species-exact model. No reference images
from these sources are redistributed.

Indexed buffers for the representative colony/plate fixture use 1,643,836 bytes
versus 2,674,320 previously, despite added geometry. This is a fixture memory
comparison, not a claim about total GPU memory. The scene reports 3,671,150
rendered triangles versus 2,931,102 before. Local checks hold about 60 FPS and
reach ready in 1.65 seconds versus 1.78 previously; other hardware is unmeasured.
The reef still falls short of the photographic reference, especially branch
joins, island silhouettes, lighting and underwater depth.

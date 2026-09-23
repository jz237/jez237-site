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

## Water light and sand relief

Reef-only material hooks add an animated interference pattern to shadowed direct
diffuse illumination, with stronger response on upward-facing surfaces. Caves
do not receive emissive caustics. The shared biological clock freezes the pattern
on pause; blue hour reduces it. Existing fish, polyp and anemone deformation hooks
are preserved. Color attenuation uses only the camera ray length inside the tank,
so rotating or approaching it does not count the surrounding room as water.
This is an artistic approximation, not a fluid or spectral-light simulation.

Lower ambient/front fill and stronger overhead lighting separate exposed tops
from sheltered recesses. Sand has shallow geometric ripples and drifts; all 1,600
rubble instances remain, with finer sizes and positions on that same surface.
No new render pass, draw group, image asset or triangle is required. The full
scene still reports 3,671,150 triangles. Local QA: ready 1650 ms versus 1653 prior,
approximately 60 FPS both; no evidence yet for other hardware. Reef resemblance
has improved, but regular rock silhouettes and coral architecture remain gaps.

## Coral growth and attached bases

Primary branches now have individually varied shoulders, stronger taper, flared
junctions and staggered lateral growth. Child thickness follows the supporting
branch instead of a uniform fraction independent of attachment location. Fine
rounded tips and corallite detail remain. These are artistic growth shapes, not
a calibrated biological growth simulation or a watertight fused skeleton.

Thin irregular basal tissue follows the actual rock surface. Steep gaps and
disconnected lower-shelf fragments are excluded; the old flattened spherical
support discs are removed. A slope/ledge regression checks attachment and outward
normals. The temporary surface index is shared with the existing polyp attachment.
No per-frame surface searches or new image assets are introduced.

## Eroded live-rock geometry

Each rock now has distinct large-scale contours, deeper rounded cavities and
eroded seams. The rock surfaces retain all 243,340 triangles and scanned maps.
Coral bases, polyps and anemone feet resample the changed supporting surfaces;
three zoanthid beds spread farther across safe attachment areas. These are
modeled cavities in solid stone, not internal connected reef porosity.

Retaining shared vertices reduces the merged rock buffers from 32,120,880 to
8,345,412 bytes (74%). Regression checks compare expanded position, normal, UV
and color arrays exactly, enforce bounded displacement and outward normals,
and retain the surface-query comparison against Three.js raycasts. This memory
figure is for rock geometry, not total GPU memory. Local QA runs around 60 FPS
with startup 1634 ms versus 1675 previously; other devices remain unmeasured.

## Attached encrusting tissue

Ten low coral crusts use clipped copies of actual rock triangles, with uneven
margins, shallow skeletal ridges and existing fine tissue maps. They share the
merged hard-coral draw mesh and add no image download or render pass. Surface
indices place neighboring polyp beds above the added tissue. Colors and mixed
colony arrangements are artistic, not a species-specific ecological model.
A geometry regression checks finite indexed attributes, nondegenerate clipped
triangles, and thin attachment to an eroded rock fixture. The new crusts total
11,097 source triangles; scene render triangles rise 0.55%. Full QA remains near
60 FPS locally, startup 1666 ms versus 1634 previously. Other hardware unmeasured.

## Branching growth diversity

Branching colonies use three artistic architectures: broad canopies, compact
bushes and taller antlers. Shorter terminal branchlets retain thicker, rounded
growth tips; primary stems spread and bend at different heights. Core tissue is
less saturated and darker than the growing tips. Existing corallite cups, maps,
branch counts, indexed geometry and material draw groups are retained. This is
not a named-species growth model. Joins still use overlapping flared surfaces.
Tests compare reproducible silhouettes and rounded tips with equal detail counts.
Rendered triangles remain 3,725,742; local QA ready 1632 ms versus 1666 previously,
with roughly 60 FPS. Feeding and conservative collision bounds follow new shapes.

## Radial anemone anatomy and flow

All 540 tentacles retain their detailed indexed skins, attached roots and joined
rounded tips. Cubic curves create varied outward arches, with slower shared surge
and delayed tip response. Circular-row shading seams are smoothed and closed tips
have valid normals. The disc has folds and an actual recessed oral center; hidden
column caps no longer fill that depression. This remains artistic motion, without
fluid dynamics, self-contact or measured species-specific tissue mechanics.
Unused UV buffers are removed from this vertex-colored material. Anemone geometry
uses 7,320,528 bytes versus 7,621,920 previously, despite the more detailed discs.
Raycasts verify the oral recess; normals, roots and 540 tips are checked. Motion
frames are saved with desktop, oblique, close-up and mobile evidence.

## Receding reef depth

Seven smaller eroded stones and three full branching colonies extend behind the
central sand channel. They have real volume, use the same fine indexed surfaces
and share existing merged material groups. A separate seeded random stream keeps
the established foreground corals, anemones and rubble stable. Attachments sample
the actual stone surface and new obstacles join the fish navigation system.
No new texture downloads or capture passes. Scene triangles rise from 3,750,342
to 4,045,478 (7.87%); local startup 1789 ms versus 1644, with approximately 60 FPS.
Other hardware is unmeasured. Front, oblique, rear macro and phone evidence are
retained in qa; the remaining reference gap is acknowledged in overnight-progress.

## Underwater fish material calibration

The reef runtime removes the exported clearcoat/metallic sheen, reduces optical
contrast and separates eye, skin and fin roughness. Reference scale, iris and fin
textures remain intact. A neutral albedo multiplier compensates for photographic
lighting already present in the source images, with stronger compensation on the
orange anthias. These are visual calibration values, not measured fish-tissue
optical constants. All Blender geometry, textures, motion and breathing remain.
No new textures, geometry or rendering passes are introduced.

## Curved rock attachment for branching colonies

When a colony has an actual rock hit, its thin basal tissue is clipped directly
from that stone's triangles. It follows curved relief instead of ending at a
sampled grid boundary, with a fine irregular margin and color tied to its branches.
The generic height-sampled fallback remains for unsupported authoring fixtures.
No fine branch, corallite, polyp or texture detail is removed. The curved-foot
regression raycasts every fixture vertex back to its support, verifies thin
attachment and checks nondegenerate triangles. Rendered scene triangles decrease
from4,045,478 to4,027,708; local QA remains near60FPS, ready1755ms.

## Irregular spreading branch architecture

Primary stems attach at individually sampled positions across the living crust,
with a central fallback when a sample hits a disconnected ledge. Colony growth
has a directional bias, uneven fork spacing and variable canopy height. Slender
branch proportions retain rounded tips, all raised cups and the same geometry
count. Shared fine tissue maps repeat at a smaller physical scale on stems.
The procedural random stream is unchanged, preserving other scenery placement.
These are visual growth rules, not a biological growth simulation.

## Live-rock surface mosaic

The rock now carries multiscale, volume-based coralline coloration, with broken
patch boundaries and fine mottling baked into its retained vertices once during
loading. Distributed small colonies clip directly to exposed rock triangles and
reuse the existing coral maps/material. Their placement uses a separate random
stream; fish, branches, anemones and rubble are not reshuffled. Hidden rock hits
are skipped. No additional textures, draw groups or per-frame noise calculation.
Existing collision volumes and all fine rock and organism geometry are retained.
This is visual surface growth, not a model of coral ecology or succession.

Patch construction rejects out-of-range triangles before allocating vertex
records. Thirty varied fixtures match the previous algorithm's attributes and
indices exactly. Rock raycasts also use tight bounding boxes. These changes
reduce setup work without simplifying the visible surface.

## Folded plating corals

Shelves now have asymmetric lobes, uneven broad folds and finer edge ruffles.
Their skeleton becomes thinner at the growing margin, with separate underside
ridges and smaller physical tissue-map repeats. All192angular samples and36rings
remain in each closed plate; the mesh and buffer counts are unchanged.
Navigation spheres are derived from each actual mesh instead of a guessed height.
Local vertex cells plus a maximum-edge padding enclose the incident triangles.
Fixtures verify coverage of vertices and triangle interiors across sizes/phases,
outward normals and positive skeleton thickness. The visual growth pattern is
artistic; collision volumes remain conservative approximations.

## Reef overhead lighting and water calibration

The key light sits above the coral canopy, giving branches and overlapping shelves
clearer directional shading. Exposure and fill preserve readable fish markings.
ReefWater configures the two shared surface shaders locally: the reflected LED
height, width and depth match this tank's fixture, with a blue-white spectrum.
Reflected-water attenuation uses the same bounded color coefficients as the reef
materials, instead of the freshwater tint. Fresnel, total internal reflection,
meniscus, ripple geometry and full depth tracing remain intact. No new render
passes, maps or geometry. The reef-only adapter leaves freshwater files unchanged.
An above-water inspection view is included in release screenshots. This is still
an artistic real-time lighting approximation, not physically measured radiometry.

## Colonies on sloping rock shoulders

Eleven smaller branching colonies now occupy inspected exposed rock sites between
the large crowns. Growth combines the support face normal with upward direction;
primary roots resample the actual rock in that local frame and a thin clipped
living foot follows its relief. Stable independent seeds preserve every existing
organism and rubble position. Initial trials intersecting prominent encrusting
colonies were rejected; published sites retain the sand channel and host areas.
Full transformed geometry determines conservative fish navigation spheres.

The colonies share the existing merged coral material, maps and render passes.
Their286,453 additional source triangles retain rounded tips, fine surface maps
and raised corallites. Only accepted anchor sites generate at startup. Fixtures
check root attachment on horizontal, tilted and near-vertical support, finite
geometry and containment by the navigation volume. Growth and spacing remain
artistic approximations; this does not establish species-level coral ecology.

## Curved anemone tissue motion

Tentacles retain all 540 strands and their original mesh resolution, with slimmer
shafts, smaller pale terminal areas and continuous terminal curve handles.
A compact four-byte encoded tangent per vertex lets animated normals follow the
curved centerline instead of assuming every strand grows straight upward.
The rooted quadratic displacement envelope combines slow surge and a weaker
phase-delayed eddy; motion scales with arc length to prevent short strands folding.
This is an artistic current and curved-centerline shading approximation, not a
physical fluid or tissue simulation.

Regression checks compare analytic bending derivatives to finite differences,
encoded axes to mesh centerlines, and sampled deformation determinants to a
positive bound. All 171,840 anemone triangles remain; buffers use 7,725,024 bytes
(previously 7,320,528). No new maps, downloads or render passes.

## Distinct encrusting coral tissue

The ten large rock-attached colonies now have their own baked tissue material.
Irregularly spaced coral cups combine recessed centers, uneven rims and fine
radial ribs; smoothly summed profiles avoid discontinuous nearest-cell borders.
The original three-dimensional attached skin and all branching, plate and polyp
geometry are retained. This is original artistic anatomy, not a species ID.

Regenerate three 512px maps with `python reef/model-source/bake_encrusting_maps.py`
(numpy/Pillow). All synthesis runs offline. PNGs retain full-resolution pixels,
637,268 additional download bytes. The additional material uses the existing
standard shader and adds one merged draw group, with roughly 4MiB of texture
storage including mipmaps in an uncompressed RGBA upload. Existing maps and
geometry are unchanged. Tests check wrapped texture edges, positive unit
normals and download budget; visual review remains a separate requirement.

## Fin attachments and moving membrane shading

The runtime now evaluates the same cubic body outline used by the Blender
authoring script when deciding which fin vertices are free to flex. The tail
field begins at the body endpoint, with a smooth transition away from the root.
Pectoral pivots follow the body's lateral displacement while retaining their
independent strokes. Existing fish geometry and embedded images are untouched.

A three-component fin-field gradient is computed once per shared template.
Vertex normals account for both the traveling body wave and the additional fin
ripple, including the depth derivative of sloping pectoral tissue. The previous
shader changed fin positions without changing their normals to match, and applied
a body-wave lighting slope to pectorals that did not receive that displacement.
Regression checks cover pinned insertions across all six body profiles and1,800
sloped tissue samples against independently displaced tangent vectors. This is
procedural animation, not a measured biomechanical model. Additional gradient
buffers use553,392bytes across six shared templates; no new maps or passes.


## Reef surface reflections

The front camera sits closer to tank mid-height, exposing more of the rippled
underside. The reef adapter strengthens the same three broad crossing waves in
both vertex displacement and analytic normals; fine-wave filtering and the
narrow glass meniscus remain unchanged. This is a procedural circulation field,
not a fluid solver. Freshwater wave shaders are untouched.

ReefReflections extends only the underside water capture vertically by50%,
using1024x1536 at full quality to preserve the existing pixels per view angle.
The original narrow planar capture excluded some scenery reached by the bent
reflection rays. The existing depth search can now find more of that geometry,
without inventing reflected coral or painting a surface texture. Camera objects
are reused; adaptive capture resolution/MSAA/scheduling continue to apply.
The extra vertical area is dropped when automatic effects disable depth tracing,
and restored when full effects return. Above-water and glass captures remain unchanged. This adds render-target area
and memory, not a new render pass or model/texture download. Geometry counts,
organisms and source textures are retained. Regression checks cover projection,
view-camera isolation, density, reuse and adaptive target resizing.

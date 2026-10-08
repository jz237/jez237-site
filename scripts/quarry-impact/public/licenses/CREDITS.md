# Credits and asset provenance

## Reference arena overhaul

Original Quarry Impact fabrication and geology additions are released as CC0 1.0:
`arena-industrial.glb`, `wheel-machining.glb`, and the added fracture relief/bedding
planes in `arena-escarpment.glb`. They are authored locally with Blender 5.2.1 LTS.
Editable scenes, scripts, original input hashes and output hashes are retained in
`source/models/*-manifest.json`. The underlying original quarry derivative meshes
and their source licenses remain as recorded below. No source quarry/car GLB is
overwritten. Wheel machining is an original separate addition to the attributed
Car Concept derivatives. New fictional signage and HUD typography are original
game authoring, with the already bundled licensed font unchanged.

The arena reuses Poly Haven CC0 photographic `circuit_asphalt`, `gravel`, `scree`
and quarry geology maps, plus the existing workyard concrete photograph. Their
source URLs, licenses and original file checksums remain in the retained asset
manifests. New crest conifers reuse the existing attributed scanned branch
geometry and material maps. All 38 bundled ElevenLabs clips are retained. The
user-provided art-direction screenshot is not distributed or used as a texture.
No purchases or sound generation were made for this pass.

## Fluid effects

The fire and smoke atlases are original Quarry Impact procedural authoring, released under CC0 1.0 Universal: https://creativecommons.org/publicdomain/zero/1.0/. They are rendered from a Blender 5.2.1 LTS Mantaflow fuel/gas simulation, then assembled into animated texture atlases. Authoring and packing scripts, the editable Blender scene, render-frame checksums, adjustments and final asset hashes are recorded in `source/fx/manifest.json` and `source/structural-realism.md`. Blender itself is an authoring tool and is not bundled into gameplay. No downloaded third-party fire footage or paid service is used.

## Cars

The released car models derive from **Car Concept**, model and textures by **Eric Chadwick**, copyright **2024 Darmstadt Graphics Group GmbH**, distributed through the Khronos glTF Sample Assets repository under **Creative Commons Attribution 4.0 International**.

- Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept

- License: https://creativecommons.org/licenses/by/4.0/

- The original starting model was created by Unity Fan and released as CC0; the prepared Khronos asset carries the attribution license above.

- Changes for Quarry Impact: normalized dimensions and wheel pivots, wheel alignment, three silhouette variants, panel and glass classification, logo/plate replacement, gameplay materials, batching, damage deformation and detachable parts. The refined Blender models split front and rear bodywork into separate damageable panels; add 1.2 mm inner sheets and boundary rims while preserving exterior normals and UVs; add an engine bay, radiator, hoses, crash rails, strut braces and underfloor exhaust; reduce hidden detail density; and correct window-gasket and rear-glass classification.

- Original README and license are retained in `source/reference/`. Khronos marks are excluded from the asset copyright license; steering emblem and license-plate logo materials were replaced. No affiliation or endorsement is claimed.

The early fully scripted body study remains reproducible through `tools/cars.py`; it is not the final vehicle artwork. Final bodies are prepared with `tools/prepare_concept.py`, then `tools/refine_cars.py`. The refinement removes an obsolete engine placeholder and connects the recessed radiator, hollow crash rails, brackets, hoses and engine assembly. The coupe rear adds an original recessed plate pocket, lamp dividers, bumper reinforcement, mounting hardware and hollow exhaust outlets, using the existing materials and image bytes. Its local panel edits preserve the source silhouette, untouched exterior normals and damage identities. The refined editable Blender files are in `source/models-refined/`; final model hashes, sizes and triangle counts are recorded in `source/vehicle-refinement-manifest.json` and `source/model-manifest.json`.

The additional coupe detail pass is reproduced by `tools/detail-coupe.py` from the retained refined coupe scene. It adds an original clipped cooling aperture, recessed grille and surround, four damageable lamp lenses with optical dividers, wheel fasteners, tire ribs, drilled-brake details and cabin piping. Existing photographic images and material slots are retained. The source asset attribution above continues to apply. The separate editable scene is `source/models-detailed/coupe.blend`; input and output checksums are recorded in `source/coupe-detail-manifest.json`. Runtime paint, glass, lamp wear and dent shading are original game code.

## Scenery

Photographic textures, HDRI and scanned rocks from **Poly Haven**, **CC0 1.0**:

- https://polyhaven.com/a/gravel_floor

- https://polyhaven.com/a/rock_boulder_dry

- https://polyhaven.com/a/rock_face_03

- https://polyhaven.com/a/aerial_asphalt_01

- https://polyhaven.com/a/asphalt_02

- https://polyhaven.com/a/brown_mud_leaves_01

- https://polyhaven.com/a/coast_sand_rocks_02

- https://polyhaven.com/a/forrest_ground_01

- https://polyhaven.com/a/forrest_ground_03

- https://polyhaven.com/a/bark_brown_02

- https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky

- https://polyhaven.com/a/rock_moss_set_01

- https://polyhaven.com/a/fir_sapling

- https://polyhaven.com/a/fir_sapling_medium

- https://polyhaven.com/a/fir_tree_01

- https://polyhaven.com/a/corrugated_iron_02

- https://polyhaven.com/a/rock_ground

- License: https://polyhaven.com/license

The last three ground/bark texture sets were copied from the user's existing After the Storm project. The scanned rock set was copied from the user's rotatable-aquascape project and reduced in Blender to approximately 1,500 triangles per rock. Texture download URLs and hashes are recorded in `public/assets/manifest.json`. Scenery generation, terrain, industrial structures, ramps, barriers, signs and effects are original Quarry Impact code.

The quarry workshop uses **Corrugated Iron 02**, photographed by **Sergej Majboroda** and processed by **Jenelle van Heerden**, from Poly Haven under CC0. Its original 2k color and 1k normal/packed ARM JPEG maps retain the documented 2.7-metre physical scale on walls and roof. `tools/prepare-industrial-material.mjs` is an explicit development download with source checksum verification; it is never called during builds or gameplay.

The geological material uses **Rock Face 03**, photographed by **Dario Barresi** and processed by **Rico Cilliers**, from Poly Haven under **CC0 1.0**. Original 2k diffuse/OpenGL normal and 1k roughness JPEGs retain the documented **2.7-metre** physical scale. `tools/prepare-geology-material.mjs` verifies official file checksums and byte counts, then records exact local SHA-256 hashes in `public/assets/manifest.json`. The images are bundled locally without resizing, recoloring or re-encoding; no request occurs during gameplay. `source/geology-material.md` records preparation, physical scale and reviewed material parameters. Existing Rock Boulder Dry photographs remain unchanged. No paid assets or audio generation were used.

The road-facing quarry cut is original Blender geometry with fragments derived from the CC0 **Rock Moss Set 01** scan. Its editable scene, frozen boundary reference, source records and generated-file hashes are retained under `source/models/quarry-cut*`; `tools/author-quarry-cut.py` reproduces the geometry and shared collision proxy. Runtime detail levels reuse the existing **Rock Boulder Dry** wall maps and rock scan atlas rather than embedding duplicate textures in the GLB.

The adjoining extraction bay is original Blender geometry using the same credited wall maps and scanned fragments. `tools/author-quarry-extension.py` reproduces its fractured faces, collapse chute, rubble, detail levels and collision surface. Its editable scene, preserved boundary reference and generated-file hashes are retained under `source/models/quarry-extension*`. The asset adds no textures or externally sourced artwork.

The eastern quarry bay is original Blender geometry using the existing CC0 **Rock Boulder Dry** maps and **Rock Moss Set 01** fragments. Its editable source, frozen boundaries, original apron normals, generator and output hashes are retained under `tools/author-quarry-east-bay.py` and `source/models/quarry-east-bay*`. The exact wall and large rubble proxies are shared by local and online physics. No new textures or imagery were downloaded.

The western extraction wall is original Blender geometry with fragments derived from the credited CC0 **Rock Moss Set 01** scan. It uses the shared **Rock Face 03** photographic wall material with the existing secondary Rock Boulder Dry maps; no textures are embedded or duplicated in the model. The editable scene, frozen boundary reference, generator and generated-file hashes are retained under `source/models/quarry-west-wall*` and `tools/author-quarry-west-wall.py`. Wall geometry and major rubble proxies are shared by local and online physics. No paid assets or new audio generation were used.

The connected gravel lane and shoulders are original Blender geometry, material masks and placement work. They reuse the existing CC0 gravel, mud and Rock Ground maps, with small fragments from the credited rock scan. `tools/author-quarry-road-approach.py` reproduces the surface and fragments from frozen road and terrain references. Editable source and generated-file hashes are retained under `source/models/quarry-road-approach*`. This pass adds no texture files or purchased assets.

The paved circuit uses **Asphalt 02**, by **Rob Tuytel**, from Poly Haven under **CC0 1.0**. Original two-kilopixel color/normal and one-kilopixel roughness JPEGs retain the documented three-metre scale; `tools/prepare-circuit-material.mjs` verifies the official source checksums and records local hashes. **Aerial Asphalt 01** supplies only broad color variation at thirty metres, matching the current asset page and numeric dimensions. Its older API scale string says fifteen metres; that metadata discrepancy is retained in the manifest. The former two-metre runtime scale was incorrect for this aerial photograph. No photograph is re-encoded. Finite repair polygons, paired rubber paths and mineral deposits are original engineering data in `source/circuit-surface.json`, rasterized locally by `tools/generate-circuit-surface.mjs`; they are not photographs or newly generated AI artwork. Existing gravel, mud and forest-floor photographs retain their credits above. No paid assets or audio generation were used.

The connected roadside approach is original Blender geometry and placement work, using the same CC0 scanned fragments with **Rock Ground** by **Rob Tuytel**, also CC0 from Poly Haven. Original 2k color/normal and 1k roughness JPEGs retain its documented 1.5-metre physical scale, blended into the existing gravel and mud maps. `tools/prepare-roadside-material.mjs` verifies the official source checksums and records local SHA-256 hashes; downloads are an explicit development step, never part of gameplay. `tools/author-quarry-roadside.py` and `tools/quarry_surface_clip.py` reproduce the deposited ground, graded fragments, material masks and shared collision data; editable source and hashes are retained under `source/models/quarry-roadside*`. Grouped understory reuses the credited scanned fir saplings. No audio generation or purchases were needed for this scenery pass.

The distant pine, spruce, hemlock and maple silhouette images were reused from the user's existing **First Light** project. Its README documents these as generated reference images using its GPT Image through fal workflow, subsequently cut out and reduced to tree cards. They are reused generated artwork under the original generation account terms, not represented as CC0 photographs. All four card species retain the same documented origin. First Light's pine/spruce geometry is documented as original procedural Blender work. The unused legacy needle texture was omitted from this release because no specific image-origin record was found. File hashes, original documentation links and this limitation are recorded in `public/licenses/First-Light-PROVENANCE.md`; the original asset-credit file is retained in `source/reference/First-Light-ASSET-LICENSES.md`. No new purchase or generation was involved.

Scanned fir trees use **Poly Haven Fir Sapling** and **Fir Sapling Medium**, **CC0 1.0**. Young firs retain three variants, reduced from 433,021 total triangles to 42,000; runtime instances stand approximately 0.57–3.05 metres high. Medium firs retain three variants from 1,533,513 source triangles, each with a 150,000-triangle near model and a 40,000-triangle distant model (570,000 total bundled triangles), instanced as 48 trees approximately 4–10 metres high. Normal and ARM maps were reduced to 1k; diffuse maps remain 2k. Images are JPEG quality 90 where re-encoded. The mature trees and 45 young saplings are batched into 56-metre spatial cells, with shared materials and distance-based detail levels preserving scenery in reflection and shadow views. The authored roadside retains both mature anchors at the new exact ground height, replaces one isolated sapling, and adds ten young trees in sheltered groups; 6,043 low grass blades provide ground cover between bare channels. These plants add no texture maps.

Runtime models are `public/models/fir-medium-a.glb`, `fir-medium-b.glb`, `fir-medium-c.glb`, and `fir-saplings-lod.glb`. `tools/prepare-fir-medium.py` and `prepare-fir-saplings.py` reproduce preparation; `tools/export-prepared-firs.py` re-exports the saved Blender scenes, and `tools/split-fir-medium.py` exports each medium variant below the static host’s 25 MiB per-file limit. Runtime materials and geometry remain shared across spatial instances to avoid copying large meshes or re-uploading duplicate textures. Editable results and prepared-model hashes/counts are retained under `source/models/`; original download URLs and hashes are recorded in `source/reference/fir_sapling/manifest.json` and `source/reference/fir_sapling_medium/manifest.json`. Distant tree silhouettes use the previously credited First Light generated images. Terrain, roadside vegetation, material layering and weathering shaders are original Quarry Impact code.

The forest edge above the extraction bay recomposes 50 existing distant cards and adds 14 short cards from the same credited images, leaving 320 off-sector cards unchanged. Three additional scanned firs reuse only the existing distant geometry, bringing the medium-tree instance count to 51. Shared placement data keeps their solid trunks at the same terrain height in solo and online play. This composition adds no maps or materials.

The northern arena headwall is original Blender geometry using the existing CC0 Rock Boulder Dry maps and Rock Moss Set 01 fragments credited above. Its generator, editable scene, frozen boundary and output hashes are under `tools/author-quarry-headwall.py` and `source/models/quarry-headwall*`. The forest composition reuses 31 existing First Light tree cards, retaining their previously documented provenance. This pass adds no maps, generated imagery or purchased assets.

The arena material mask is original Quarry Impact engineering data: authored vehicle paths, working areas, deposits and sediment distribution measured against the existing puddle contours. Editable definitions, the offline generator and compressed/decoded hashes are retained in `source/arena-floor-mask*` and `tools/generate-arena-mask.mjs`. It reuses the credited CC0 gravel, mud and Rock Ground photographs. No new photograph, generated artwork or purchased asset was used for this surface pass.

The northern woodland adds three mature variants from Poly Haven **Fir Tree 01**, under CC0 1.0. Original download URLs, source checksums and license records are retained in `source/reference/fir_tree_01/`; `tools/restore-scenery-sources.py` restores the large original files excluded from the release repository. Preparation retains complete needle pieces with distance-dependent cross-section compensation, simplifies woody geometry, and preserves the original A/B photographed trunk maps and repeating UVs. The source C trunk has no texture coordinates and receives a documented cylindrical projection using the existing branch material. `tools/prepare-north-fir-geometry.py` and `tools/author-north-firs.py` reproduce the runtime variants; editable Blender scenes are retained locally, and exact generated-file hashes are recorded under `source/models/quarry-north-fir*`. The oversized editable scenes are reproduced with those tools rather than included in static delivery. Runtime geometry uses Draco compression with a locally bundled Apache-licensed decoder. New twig and trunk photographs retain their CC0 source records in `public/assets/manifest.json`; reused young firs, material maps and distant cards retain the provenance above.

The northern backdrop atlases are rendered derivatives of the same prepared **Fir Tree 01** CC0 scan, using its existing bark and twig photographs together with the credited **Fir Sapling Medium** branch/normal maps. They are not new photography or newly generated AI artwork. The bake reads the actual decoded runtime geometry and exact bundled image bytes; it adds no external source asset. Eight azimuths and two elevations produce unlit albedo/coverage and object-normal/depth images, with no baked sun, ambient occlusion, fog or instance tint. Local preparation and packing scripts preserve source UV transforms and fractional needle coverage. The six PNGs are bundled under `public/models/north-backdrop-*`; source/model/image hashes, generated byte counts and output hashes are recorded in `source/models/quarry-north-backdrop-manifest.json`. Reproduction uses `tools/decode-north-draco.mjs`, `tools/prepare-north-backdrop.py`, `tools/bake-north-backdrop.py` and `tools/pack-north-backdrop.py`; the channel and projection contract is documented in `source/models/quarry-north-backdrop.md`. This preparation used only the existing freely licensed local assets, without a purchase, download or sound-generation request.

The northern forest-floor material weights and stand placements are original Quarry Impact work. `source/north-forest-floor.json`, `src/quarry-north-forest.json`, `src/quarry-north-backdrop.json` and `tools/generate-north-floor.mjs` reproduce the locally bundled mask; its manifest records source hashes and compressed/decoded output hashes. The backdrop extension fits six litter areas to the actual 52 tree roots, joins them to the foreground stands, and preserves the existing mineral crest and authored openings. It reuses the same photographs and changes no terrain heights. The needle litter uses **Forrest Ground 03**, by **Rob Tuytel**, from Poly Haven under **CC0 1.0**, at its documented two-metre scale. `tools/prepare-north-floor-material.mjs` verifies the official checksums and bundles the original color, normal and roughness photographs. Existing mud and gravel sources are reused. A locally bounded gravel treatment shares photograph phase and shading across the original northern crest. No paid asset, generated image or additional sound generation was used for this woodland update.

The western road-verge dressing in `src/scenery-west-verge.ts` uses original bent grass geometry, existing CC0 Poly Haven young-fir meshes and the existing photographed scree materials. Deterministic placement creates interrupted shoulder pockets with three spatial detail groups. It adds no downloaded image or separately licensed asset, and does not change the terrain or collision surfaces.

## Sound

The wreck-topology refinement, shared deformation field, five-second inspection view, shallow bank relief and additional verge placement are original Quarry Impact code. Foreground forest replacements reuse the already credited Poly Haven fir geometry and materials. This revision introduces no new third-party assets, generated sounds or purchases.

All 38 runtime sound effects: **ElevenLabs**, generated September 27–28, 2026 from original Quarry Impact prompts using the user's account. They are provided under the applicable ElevenLabs account terms, not represented as CC0. No Wreckfest audio was used. File-level prompts, settings, hashes and post-processing are in `public/audio/manifest.json`; original MP3s are in `source/audio/`. Private quota records are excluded from publication.

The vehicle-fire update adds three dedicated recordings: sustained flame roar, irregular burning-material crackle and a short fuel-vapor burst. These used 170 included credits with overages disabled and no additional spending. Fire and smoke volume shading, local noise, buoyancy and emission placement are original game code; no third-party VFX image or video was used. See `source/vehicle-fire.md` and `tools/fire-audio.py`.

## Software and typography

- Three.js — MIT.

- Rapier / Dimforge — Apache-2.0.

- Google Draco — Apache-2.0; the locally bundled decoder comes from the pinned Three.js distribution. Its license is included in `public/models/draco/LICENSE`.

- Vite and TypeScript — their bundled open-source licenses.

- Montserrat — SIL Open Font License; license is included under `public/fonts/`.

- Third-party runtime license texts are bundled under `public/licenses/` and copied into the static build.

Wreckfest 2 served only as a gameplay and fidelity reference. No Wreckfest branding, models, textures, code or audio is bundled.

## Industrial workyard detail

The containers, tracked excavator, conveyor, workshop, silos and worn concrete barriers are original Blender geometry, authored with `tools/author-workyard.py`. Editable source and export hashes are in `source/models/quarry-workyard*`. The fence uses original rounded fittings and a filtered chain-link shader. Terrain dressing reuses the credited gravel and scree photographs.

New photographic materials, all **CC0 1.0** from Poly Haven:

- [Container Side](https://polyhaven.com/a/container_side), **Dimitrios Savva**, 1.94 m scale.
- [Rusty Painted Metal](https://polyhaven.com/a/rusty_painted_metal), **Amal Kumar**, 2.2 m scale.
- [Concrete Layers 02](https://polyhaven.com/a/concrete_layers_02), **Rob Tuytel**, 2 m scale.

The nine original 2k JPEGs are bundled locally with their source URLs, official checksums and local hashes in `public/assets/workyard/manifest.json`; source metadata is retained in `source/workyard/`. Existing cladding maps are reused. The crash sound refinement reuses the existing ElevenLabs recordings; this update generated no additional audio and incurred no asset purchases.

## Bramble V8 replacement model

Muscle Car 3D Model by **BrightRetro**, released under **CC-BY 3.0**.
Source: https://opengameart.org/content/muscle-car-3d-model
License: https://creativecommons.org/licenses/by/3.0/

Adapted for Quarry Impact: geometry format conversion, shading and recolorable
paint, separate damage panels and wheel pivots, tire sizing and inner structure.
BrightRetro does not endorse this game. Original archive and provenance are
preserved under source/vehicles/brightretro-muscle.

The estate development candidate also uses this attributed base, with a new
cargo cabin, roof, glazing, pillars and four separate door assemblies.

### Ironvale Utility

Original coupe-utility conversion for Quarry Impact, derived from BrightRetro's
Muscle Car 3D Model under CC-BY 3.0. Attribution and modification details:
[ironvale-utility.txt](ironvale-utility.txt).

### Original small, commercial and special vehicles

The [Rook 1100](ROOK-1100.md), [Rillford Carrier](RILLFORD-CARRIER.md),
[Tern 1400](TERN-1400.md), [Marten 1600](MARTEN-1600.md), and
[Ravine 1800](RAVINE-1800.md) use original Quarry Impact bodywork, interiors and
mechanical artwork. The road cars share wheel tooling; the Ravine uses original
off-road wheels. Existing bundled engine audio
is reused; model-specific provenance and beta limitations are in those notes.

### Fitted reinforcement

The optional impact beams, sill rails, bracing, mounting pads and fasteners are
original procedural Quarry Impact geometry. They use vehicle-specific mounting
layouts shared with the collision simulation. The underlying vehicle credits
and licenses above continue to apply.

## Calder Shuttle

Original Quarry Impact short-wheelbase minibus: [authorship and reuse](CALDER-SHUTTLE.md).

- Hartwell Regent: original Quarry Impact full-size saloon, including original project wheel artwork. See [HARTWELL-REGENT.md](HARTWELL-REGENT.md).

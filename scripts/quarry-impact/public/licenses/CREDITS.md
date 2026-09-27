# Credits and asset provenance

## Cars

The released car models derive from **Car Concept**, model and textures by **Eric Chadwick**, copyright **2024 Darmstadt Graphics Group GmbH**, distributed through the Khronos glTF Sample Assets repository under **Creative Commons Attribution 4.0 International**.

- Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept

- License: https://creativecommons.org/licenses/by/4.0/

- The original starting model was created by Unity Fan and released as CC0; the prepared Khronos asset carries the attribution license above.

- Changes for Quarry Impact: normalized dimensions and wheel pivots, wheel alignment, three silhouette variants, panel and glass classification, logo/plate replacement, gameplay materials, batching, damage deformation and detachable parts. The refined Blender models split front and rear bodywork into separate damageable panels; add 1.2 mm inner sheets and boundary rims while preserving exterior normals and UVs; add an engine bay, radiator, hoses, crash rails, strut braces and underfloor exhaust; reduce hidden detail density; and correct window-gasket and rear-glass classification.

- Original README and license are retained in `source/reference/`. Khronos marks are excluded from the asset copyright license; steering emblem and license-plate logo materials were replaced. No affiliation or endorsement is claimed.

The early fully scripted body study remains reproducible through `tools/cars.py`; it is not the final vehicle artwork. Final bodies are prepared with `tools/prepare_concept.py`, then `tools/refine_cars.py`. The refined editable Blender files are in `source/models-refined/`; final model hashes, sizes and triangle counts are recorded in `source/vehicle-refinement-manifest.json` and `source/model-manifest.json`.

## Scenery

Photographic textures, HDRI and scanned rocks from **Poly Haven**, **CC0 1.0**:

- https://polyhaven.com/a/gravel_floor

- https://polyhaven.com/a/rock_boulder_dry

- https://polyhaven.com/a/aerial_asphalt_01

- https://polyhaven.com/a/brown_mud_leaves_01

- https://polyhaven.com/a/coast_sand_rocks_02

- https://polyhaven.com/a/forrest_ground_01

- https://polyhaven.com/a/bark_brown_02

- https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky

- https://polyhaven.com/a/rock_moss_set_01

- https://polyhaven.com/a/fir_sapling

- https://polyhaven.com/a/fir_sapling_medium

- License: https://polyhaven.com/license

The last three ground/bark texture sets were copied from the user's existing After the Storm project. The scanned rock set was copied from the user's rotatable-aquascape project and reduced in Blender to approximately 1,500 triangles per rock. Texture download URLs and hashes are recorded in `public/assets/manifest.json`. Scenery generation, terrain, industrial structures, ramps, barriers, signs and effects are original Quarry Impact code.

The distant pine and spruce silhouette images were reused from the user's existing **First Light** project. Its README documents these as generated reference images using its GPT Image through fal workflow, subsequently cut out and reduced to tree cards. They are reused generated artwork under the original generation account terms, not represented as CC0 photographs. The retained hemlock and maple cards have the same documented origin. First Light's pine/spruce geometry is documented as original procedural Blender work. The unused legacy needle texture was omitted from this release because no specific image-origin record was found. File hashes, original documentation links and this limitation are recorded in `public/licenses/First-Light-PROVENANCE.md`; the original asset-credit file is retained in `source/reference/First-Light-ASSET-LICENSES.md`. No new purchase or generation was involved.

Scanned fir trees use **Poly Haven Fir Sapling** and **Fir Sapling Medium**, **CC0 1.0**. Young firs retain three variants, reduced from 433,021 total triangles to 42,000; runtime instances stand approximately 0.85–3.05 metres high. Medium firs retain three variants from 1,533,513 source triangles, each with a 150,000-triangle near model and a 40,000-triangle distant model (570,000 total bundled triangles), instanced as 48 trees approximately 4–10 metres high. Normal and ARM maps were reduced to 1k; diffuse maps remain 2k. Images are JPEG quality 90 where re-encoded. The mature trees and 36 young saplings are batched into 56-metre spatial cells, with shared materials and distance-based detail levels preserving scenery in reflection and shadow views.

Runtime models are `public/models/fir-medium-a.glb`, `fir-medium-b.glb`, `fir-medium-c.glb`, and `fir-saplings-lod.glb`. `tools/prepare-fir-medium.py` and `prepare-fir-saplings.py` reproduce preparation; `tools/export-prepared-firs.py` re-exports the saved Blender scenes, and `tools/split-fir-medium.py` exports each medium variant below the static host’s 25 MiB per-file limit. Runtime materials and geometry remain shared across spatial instances to avoid copying large meshes or re-uploading duplicate textures. Editable results and prepared-model hashes/counts are retained under `source/models/`; original download URLs and hashes are recorded in `source/reference/fir_sapling/manifest.json` and `source/reference/fir_sapling_medium/manifest.json`. Distant tree silhouettes use the previously credited First Light generated images. Terrain, roadside vegetation, material layering and weathering shaders are original Quarry Impact code.

## Sound

All runtime sound effects: **ElevenLabs**, generated September 27, 2026 from original Quarry Impact prompts using the user's account. They are provided under the applicable ElevenLabs account terms, not represented as CC0. No Wreckfest audio was used. File-level prompts, settings, hashes and post-processing are in `public/audio/manifest.json`; original MP3s and quota records are in `source/audio/`.

## Software and typography

- Three.js — MIT.

- Rapier / Dimforge — Apache-2.0.

- Vite and TypeScript — their bundled open-source licenses.

- Montserrat — SIL Open Font License; license is included under `public/fonts/`.

- Third-party runtime license texts are bundled under `public/licenses/` and copied into the static build.

Wreckfest 2 served only as a gameplay and fidelity reference. No Wreckfest branding, models, textures, code or audio is bundled.

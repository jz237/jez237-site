# Credits and asset provenance

## Cars

The released car models derive from **Car Concept**, model and textures by **Eric Chadwick**, copyright **2024 Darmstadt Graphics Group GmbH**, distributed through the Khronos glTF Sample Assets repository under **Creative Commons Attribution 4.0 International**.

- Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept
- License: https://creativecommons.org/licenses/by/4.0/
- The original starting model was created by Unity Fan and released as CC0; the prepared Khronos asset carries the attribution license above.
- Changes for Quarry Impact: normalized dimensions and wheel pivots, wheel alignment, three silhouette variants, panel and glass classification, logo/plate replacement, gameplay materials, batching, damage deformation and detachable parts.
- Original README and license are retained in `source/reference/`. Khronos marks are excluded from the asset copyright license; steering emblem and license-plate logo materials were replaced. No affiliation or endorsement is claimed.

The early fully scripted body study remains reproducible through `tools/cars.py`; it is not the final vehicle artwork. Final bodies are prepared with `tools/prepare_concept.py`.

## Scenery

Photographic textures, HDRI and scanned rocks from **Poly Haven**, **CC0 1.0**:

- https://polyhaven.com/a/rock_boulder_dry
- https://polyhaven.com/a/aerial_asphalt_01
- https://polyhaven.com/a/brown_mud_leaves_01
- https://polyhaven.com/a/coast_sand_rocks_02
- https://polyhaven.com/a/forrest_ground_01
- https://polyhaven.com/a/bark_brown_02
- https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky
- https://polyhaven.com/a/rock_moss_set_01
- License: https://polyhaven.com/license

The last three ground/bark texture sets were copied from the user's existing After the Storm project. The scanned rock set was copied from the user's rotatable-aquascape project and reduced in Blender to approximately 1,500 triangles per rock. Texture download URLs and hashes are recorded in `public/assets/manifest.json`. Scenery generation, terrain, industrial structures, ramps, barriers, signs and effects are original Quarry Impact code.

Pine/spruce geometry, photographic foliage cards, and needle texture were reused from the user's existing **First Light** project. That project's original asset-credit file accompanies this project under `source/reference/First-Light-ASSET-LICENSES.md`; no new purchase or generation was involved.

## Sound

All runtime sound effects: **ElevenLabs**, generated September 27, 2026 from original Quarry Impact prompts using the user's account. They are provided under the applicable ElevenLabs account terms, not represented as CC0. No Wreckfest audio was used. File-level prompts, settings, hashes and post-processing are in `public/audio/manifest.json`; original MP3s and quota records are in `source/audio/`.

## Software and typography

- Three.js — MIT.
- Rapier / Dimforge — Apache-2.0.
- Vite and TypeScript — their bundled open-source licenses.
- Montserrat — SIL Open Font License; license is included under `public/fonts/`.
- Third-party runtime license texts are bundled under `public/licenses/` and copied into the static build.

Wreckfest 2 served only as a gameplay and fidelity reference. No Wreckfest branding, models, textures, code or audio is bundled.

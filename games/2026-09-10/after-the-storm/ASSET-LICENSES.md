# Asset licenses

Eight clips in assets/audio were generated with the user's ElevenLabs account from original prompts on September 10, 2026. They are provided under the applicable account terms, not represented as CC0. No Nintendo audio was sampled and no narration or voice imitation was requested. PROVENANCE.json records file hashes and processing. Original WAV exports accompany the downloadable source. The procedural Web Audio effects remain as a fallback. Dolphin geometry is original procedural work.

Photographic terrain and bark maps are by Poly Haven contributors and distributed under CC0 1.0 (public domain). No purchase or subscription was used. The bundled images are unmodified original JPEG maps at 1K/2K resolution.

- [Coast Sand 02 — Rob Tuytel](https://polyhaven.com/a/coast_sand_02)
- [Coast Sand Rocks 02 — Rob Tuytel](https://polyhaven.com/a/coast_sand_rocks_02)
- [Forest Ground 01](https://polyhaven.com/a/forrest_ground_01)
- [Bark Brown 02](https://polyhaven.com/a/bark_brown_02)
- [Poly Haven license](https://polyhaven.com/license) · [CC0 deed](https://creativecommons.org/publicdomain/zero/1.0/)

Exact download URLs and SHA-256 hashes are recorded in `assets/terrain/manifest.json`. All textures load locally; the game makes no runtime request to Poly Haven.

Tree, grass, shrub, pebble and driftwood geometry in `coastal-scenery.js` is original procedural work. Jet-ski and rider geometry is original Blender work, with editable sources under `source/blender/`. Three.js is bundled under the MIT license; see `vendor/THREE-LICENSE.txt`.

The `*-lod.json/bin` meshes are lower-detail derivatives of those original Blender models, generated offline with meshoptimizer 0.24.0 (MIT, Arseny Kapoulkine). The authoring script is `source/build-lod.mjs`; meshoptimizer is not shipped or required at runtime. Full-detail models remain available for close views. Bone attachment groups, material assignments and normals are retained in the derivatives.

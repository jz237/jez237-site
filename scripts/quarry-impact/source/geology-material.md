# Quarry geological material

The primary material is [Rock Face 03](https://polyhaven.com/a/rock_face_03), photographed by Dario Barresi and processed by Rico Cilliers, from Poly Haven under [CC0 1.0](https://polyhaven.com/license). It depicts rough fractured rock rather than a rounded weathered boulder surface. This document records original asset preparation, the implemented material and the scope of visual review. Performance and release validation are separate.

## Original files and reproduction

Run `node tools/prepare-geology-material.mjs` explicitly during development. The Node-only tool verifies the current official [asset metadata](https://api.polyhaven.com/info/rock_face_03) and [file records](https://api.polyhaven.com/files/rock_face_03), checks pinned official MD5 values and byte counts, and records local SHA-256 hashes in `public/assets/manifest.json`. Existing valid files are reused. A changed source record fails for review. Nothing downloads during gameplay or ordinary builds.

| Bundled file | Source map | Original size | Official MD5 |
| --- | --- | ---: | --- |
| `public/assets/geology_rock_diff.jpg` | 2k diffuse | 3,814,362 bytes | `657add9e8a8dffaeed19bdfc58078b59` |
| `public/assets/geology_rock_nor_gl.jpg` | 2k OpenGL normal | 4,473,242 bytes | `279b33e71ae6275cafa24e6597024c98` |
| `public/assets/geology_rock_rough.jpg` | 1k roughness | 638,904 bytes | `bbb2c7dafde3f81808fa7404d4527a56` |

Total original JPEG payload: **8,926,508 bytes**. Images are copied byte for byte, with no resize, color alteration, synthesized pixels, channel repacking or re-encoding. Diffuse is interpreted as sRGB; normal and roughness are linear material data. Assuming RGBA8 GPU storage, the three maps require approximately **48 MiB including mipmaps**; this is an estimate, not measured GPU memory.

## Physical scale and integration boundary

The official Rock Face 03 metadata reports **2699.9995708465576 × 2699.9995708465576 mm**, agreeing with the asset page's **2.7 m** scale. Use that physical scale for registered color, normal and roughness sampling.

The existing [Rock Boulder Dry](https://polyhaven.com/a/rock_boulder_dry) set is unchanged. Its current [official metadata](https://api.polyhaven.com/info/rock_boulder_dry) reports **1799.9999523162842 × 1800.0001907348633 mm**, agreeing with the page's **1.8 m** scale. The previous nominal 3.6 m quarry-wall tile enlarges its features about twofold. Existing source images and their manifest records are preserved; the 1.8 m confirmation is recorded here for a secondary weathered-rock treatment.

## Implemented material

`src/scenery-geology-material.ts` supplies the shared wall material. It preserves wall geometry, UV buffers, model files, collisions and lighting, but samples the photographs in world metres rather than the retained UVs. Three planar projections use normalized absolute world-normal components raised to the sixth power as blend weights. Rock Face 03 uses a 2.7-metre tile; Rock Boulder Dry uses a 1.8-metre tile. The primary uses three translated samples per projection to reduce obvious repetition. Color, normal and roughness share the same offsets and weights, with explicit texture derivatives for mip selection. Derivative tangent frames transform each projected normal into the lighting frame before blending. No displacement is used.

The primary diffuse multiplier is `0.92`. Rock Boulder Dry contributes at most `0.22`, through a smooth broad weathering mask, and its diffuse RGB is multiplied by `(0.65, 0.48, 0.34)` in linear space. Measured linear RGB means used to choose that palette adjustment were approximately `(0.2309, 0.1442, 0.08275)` for Rock Face 03 and `(0.3983, 0.3373, 0.2706)` for Rock Boulder Dry. After the multipliers, the secondary mean is approximately 21–22% brighter per channel than the primary mean, before its limited blend weight. This keeps weathering within the same warm stone palette instead of replacing entire brown faces with nearly white stone. These are shader adjustments; the original JPEG bytes remain unchanged.

Primary normal XY strength is `0.95`, secondary strength `0.55`. Source roughness remains spatially varying, bounded to `0.46–0.99` for the primary and `0.56–0.99` for the secondary. The earlier broad `0.84` roughness floor is absent. Existing gravel color supplies sparse fines on near-horizontal surfaces, selected by slope and a local mask capped at `0.62`; those areas approach roughness `0.94` and locally soften the normal detail. This is a bounded deposit treatment rather than blanket normal flattening over the wall.

## Visual review and limits

The first candidate was rejected: its high-contrast secondary blend created conspicuous white islands across whole faces in the ordinary east-road chase and close headwall views. The second candidate, recorded in `outputs/cliff-material/candidate2`, was accepted as a bounded material improvement after matched 1440p arena/east-road/legacy-road chase views and headwall, East Bay and legacy close views were inspected against `outputs/cliff-material/baseline`. Angular mineral detail is more readable and the large white replacement patches are gone. The inspected stills revealed no new conspicuous bright material join or stretched projection.

This acceptance concerns appearance in those views, not a claim that motion, all camera angles or performance have passed. Regular legacy terrace silhouettes, abrupt geometric ledges, sparse rubble and some repeated crack motifs remain visible. A new material alone does not produce Wreckfest 2 fidelity.

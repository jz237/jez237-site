# First Light tree assets reused by Quarry Impact

Verified against the user's existing `jez237-site` checkout at commit `9cef73066064ddcc585f1b8c61b46b27aded2f08` on September 27, 2026. Every retained file listed below is byte-identical to its First Light counterpart under `games/2026-09-13/first-light/assets/trees/`.

## Generated tree silhouettes

First Light's [README, Photographic trees (v0.56.0)](https://github.com/jz237/jez237-site/blob/9cef73066064ddcc585f1b8c61b46b27aded2f08/games/2026-09-13/first-light/README.md#photographic-trees-v0560) records pine, spruce and hemlock as generated isolated reference images, cut from white backgrounds and reduced to tree cards. Its Broadleaves (v0.58.0) section records maple as generated through the same process. Its [art pipeline](https://github.com/jz237/jez237-site/blob/9cef73066064ddcc585f1b8c61b46b27aded2f08/games/2026-09-13/first-light/ART-PIPELINE.md) identifies that reference workflow as GPT Image through fal (`openai/gpt-image-2`).

These are reused generated images under the original generation account terms, not identified as CC0 photographs. The source project records the generation process, but the original prompts and generation receipts are not present in this source snapshot. Quarry Impact incurred no new generation or purchase for these images. The current scene loads pine and spruce as distant billboards; hemlock and maple are retained legacy assets.

| Quarry Impact file | SHA-256 |
| --- | --- |
| `public/models/pine.webp` | `7ce3d246da5e4b26e6453e90f3932d36fe224cb6f15292c941676d03066641a7` |
| `public/models/spruce.webp` | `9ed33ca58f765b586ecca4ef5bd9f163d400f6f744dc8c09c8e0fa82723df5f2` |
| `public/models/hemlock.webp` | `04a9aa8be677b859ffc686347a512fa59e8733ae538d5521639a8564bad6c86f` |
| `public/models/maple.webp` | `308f7959b7bb6ad04d2e660f94811d7b5568265947da0c7f650913949e01f1af` |

## Original procedural geometry

The [First Light asset credits](https://github.com/jz237/jez237-site/blob/9cef73066064ddcc585f1b8c61b46b27aded2f08/games/2026-09-13/first-light/ASSET-LICENSES.md) identify its plant geometry as original to that project. Its Real trees (v0.63.0) README section and [Blender source](https://github.com/jz237/jez237-site/blob/9cef73066064ddcc585f1b8c61b46b27aded2f08/games/2026-09-13/first-light/source/blender/build_trees.py) describe seeded procedural pine and spruce geometry. The GLBs carry geometry without embedded photographic textures. These models are retained legacy assets; Quarry Impact's current near forest uses separately credited Poly Haven scanned firs.

| Quarry Impact file | SHA-256 |
| --- | --- |
| `public/models/pine3d.glb` | `37c678546de6a69af6b4a4a9782d4236461f9989fce44fc72b7e3869f99203d5` |
| `public/models/spruce3d.glb` | `26f516877e2697486449e22583e9a21e1ec2f2de51118c5335a8756e81de467f` |

## Omitted legacy texture

The removed legacy `public/models/needle.webp` was byte-identical to First Light's texture (SHA-256 `e3f91f8567ec9062d471fba5d8993964e30ab6c3ad722c0fec0f85d235ca1510`), but its image origin is not explicitly identified in that project's credits, README or available source manifests. Do not infer CC0 or the tree-reference generation pipeline for it. The current Quarry Impact source does not load this texture. It was removed from `public/models/` and the current model manifest to avoid bundling an asset with unresolved image provenance. The original remains untouched in the First Light project.

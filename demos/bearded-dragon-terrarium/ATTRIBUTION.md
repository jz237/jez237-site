# Materials and visual references

- Rough Wood, Rob Tuytel. https://polyhaven.com/a/rough_wood — CC0.
  The desert log uses the original 2K diffuse, OpenGL normal, packed ambient
  occlusion/roughness, and displacement maps. Surface displacement is applied to
  the closed branch geometry used for both drawing and collision. Download URLs
  and SHA-256 checksums: materials/rough_wood/PROVENANCE.json.

- Dead Tree Trunk 02, photography by Jenelle van Heerden, processing by Rico Cilliers. https://polyhaven.com/a/dead_tree_trunk_02
- Rock Moss Set 01, Kless Gyzen. https://polyhaven.com/a/rock_moss_set_01
- CC0 dedication: https://polyhaven.com/license

The retained original GLTF assets and 2K maps are served locally. The current
desert log uses custom closed branch geometry with the Rough Wood maps listed
above. The Poly Haven assets are CC0 and were downloaded without purchase.

- Desert plant studies: generated through fal with `openai/gpt-image-2`,
  medium quality, 1536 × 1024, text-to-image. Aloe and cactus reference PNGs
  are bundled in `plants/`; clean cuticle regions supply material color.
  Leaf shape, thickness, teeth, cactus ribs, areoles, spines, flower petals,
  shrub branches, leaves, and seeds are custom 3D geometry. All three study
  images, original prompts, generation settings, and result checksums are
  retained in the source under `references/plants/`.

- Fern 02, scanned by Rob Tuytel, modeled by Rico Cilliers. https://polyhaven.com/a/fern_02
  Adapted as ornamental fronds; not a species-accurate aquatic botany model. Original alpha mask used for the frond edges.

- Moss 01, Rob Tuytel. https://polyhaven.com/a/moss_01 — CC0.
  Original curved shoot meshes and 2K color, normal, packed roughness and alpha maps are bundled locally. Scattered on bark and rock as ornamental moss; the terrestrial source is an artistic adaptation, not an exact aquatic species. See moss_01/PROVENANCE.json for original download URLs and checksums.
- Rock Moss Set 01 also uses its original 2K ambient-occlusion map to retain crevice shading. Source download URL and checksum: rock_moss_set_01/AO_PROVENANCE.json.

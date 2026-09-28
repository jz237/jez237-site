# East quarry extraction bay

This original authored rock section covers 25–55 degrees, immediately east of the northern headwall. It replaces only the corresponding legacy cliff triangles and overlapping legacy scatter. Three independent ten-degree chunks each contain rock and rubble meshes at near and far detail.

## Reproduction

The frozen base is exported by the shared-geometry validation tool before layout replacement. Run the installed Blender 5.2 executable with `--background --python tools/author-quarry-east-bay.py` from the project root. The tool reads `source/models/quarry-east-bay-base.json`, the referenced frozen terrain, and `public/models/rocks-lod.glb`; it writes the editable Blender source, texture-free runtime GLB, exact wall collision JSON and SHA-256 manifest. It does not alter the existing headwall, forest or roadway assets.

## Geometry contract

The original lower apron rows 0–6, outer crest row 30, and angular profiles at 25 and 55 degrees retain their original positions. The left boundary uses the accepted headwall's continuous U phase and actual protected shading data. The preserved apron uses the original ring's per-band smooth normals from `quarry-east-bay-apron-normals.json`, retaining separate normals across actual bench edges. Both sides of the row-6 interface share the original apron-top normal, with a short transition into the new face through row 6.5; the angular end normals remain pinned. Any inherited gap under the old toe is closed with an additive terrain-conforming skirt; no original apron triangle is moved. Both LODs use the same chunk edge samples. The exact near-wall triangulation supplies shared browser/server collision. Larger fragments have explicit convex proxies. Smaller fragments are partly embedded visual rubble on the benches and in the concentrated collapse fan. The fan extends from the cleft down across the unchanged apron onto the exact terrain at the toe.

Runtime nodes are `EastBayRock_{0,1,2}_{near,far}` and `EastBayRubble_{0,1,2}_{near,far}`. The rock material uses the existing 3.6 m Rock Boulder Dry UV convention; the loader restores Blender V. Rubble keeps the source scan atlas coordinates and must not have V flipped. Vertex color supplies restrained mineral variation. No image is embedded or newly downloaded.

## Asset sources

The wall geometry is authored for Quarry Impact. Runtime rock photographs reuse Poly Haven's [Rock Boulder Dry](https://polyhaven.com/a/rock_boulder_dry), and rubble reuses the existing [Rock Moss Set 01](https://polyhaven.com/a/rock_moss_set_01) scan atlas and geometry. Those source assets are CC0; their original records remain in the project asset manifests and credits. The generated model and exact source/asset hashes are recorded in `quarry-east-bay-manifest.json`.

This document describes the candidate's reproducible construction. Visual acceptance and measured performance are recorded separately after in-game review.

## Validation note

Blender custom split-normal storage introduces a measured maximum 0.13952 degree spread between incident/cross-LOD normals on the new row-6 transition (0.13558 degree from the ideal source direction). The original lower apron remains within the tighter 0.029 degree bound. The final GLB keeps Blender's standard export without a normal-buffer postprocess; this small directional encoding difference does not alter any vertex, UV, index, collision input or silhouette.

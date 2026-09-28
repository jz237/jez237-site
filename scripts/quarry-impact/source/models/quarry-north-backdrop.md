# Northern fir backdrop atlases

These derived CC0 assets use the exact accepted runtime near geometry from
`quarry-north-fir-{0,1,2}.glb`. They do not alter those models, their editable
Blender files, the foreground placement data, or collision shapes.

Reproduce from the repository root:

```text
node tools/decode-north-draco.mjs
python tools/prepare-north-backdrop.py
blender --background --python tools/bake-north-backdrop.py
python tools/pack-north-backdrop.py
```

The preparation step extracts the actual embedded runtime branch and twig maps,
including their existing reduced normal-map resolution. Bark and foliage color
come from the locally bundled public textures. Original repeating branch UV
transforms and normal strength 1 are preserved. Emission-only renders contain
no sun, ambient occlusion, exposure, fog, or instance tint. Object normals include
the source tangent normal texture and the visible double-sided surface response.

Each variant has eight azimuths and two elevations (−10° and +25°), packed into
two 1024 × 2048 RGBA PNGs. Tiles are 256 × 512 pixels with an eight-pixel gutter;
the usable image is 240 × 496. Views are ordered by elevation, then azimuth,
four tiles per row. All image rows and metadata rectangles use a top origin.
Load with `flipY=false`; the rectangle excludes its gutter.

The common normalized frame is 0.55 units wide and 1.10 high, centered at
(0, 0.5, 0), with Y up and the accepted root baseline at Y=0. Azimuth starts
at +Z and increases toward +X. Metadata records the exact orthonormal view
basis, projected geometry bounds, and depth range. Positive depth points toward
the source camera. Reconstructed object position is:

```text
center + right * ((imageU - 0.5) * frameWidth)
       + up * ((0.5 - imageV) * frameHeight)
       + direction * mix(depthMin, depthMax, encodedDepth)
```

Albedo RGB is straight sRGB; alpha is linear fractional coverage. The other
texture is entirely linear: RGB encodes `(objectNormal + 1) / 2`, and alpha
encodes view depth. Do not use its alpha as opacity. No roughness is baked;
the runtime material supplies that scalar.

The authoring renders are 512 × 1024. Premultiplied linear attributes are area
filtered before unpremultiplication and PNG packing, preserving thin needle
coverage. Transparent RGB/normal/depth values are filled from the nearest valid
surface within each tile. Alpha remains zero in gutters. Runtime sampling must
clamp within each selected tile and limit mip level to 3 to prevent neighboring
view leakage. Continuous view weighting and depth reprojection are required;
nearest-angle selection alone would produce visible changes in silhouette.

`quarry-north-backdrop-manifest.json` records source model/image hashes, output
sizes/hashes, projection coverage checks, and the 64 MiB texture allocation
including mipmaps. `src/quarry-north-backdrop-atlas.json` is the runtime basis
contract. Temporary EXR/NPZ frames stay under ignored `outputs/` and can be
regenerated. Licensing follows the recorded Poly Haven `fir_tree_01` and shared
`fir_sapling_medium` CC0 sources; no new external inputs were used.

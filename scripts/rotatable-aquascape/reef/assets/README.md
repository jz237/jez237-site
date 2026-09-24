# Rock material provenance

Seaside Rock by Dimitrios Savva / Poly Haven, CC0.
Source: https://polyhaven.com/a/seaside_rock
License: https://polyhaven.com/license
Retrieved September 22, 2026. No purchase or paid API used.

Unmodified 1K JPG diffuse, OpenGL normal and roughness maps from:
https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/seaside_rock/

The scanned material was previously used as a surface on fully volumetric reef geometry.
It is coastal stone, not a biological specimen. Small coralline/olive crust colors
are an artistic overlay baked into the geometry. All maps are locally hosted;
visitors do not contact Poly Haven. Diffuse is sRGB; other maps are linear.

## Original porous limestone surface (current rock material)

`limestone/map.png` and `limestone/normalMap.png` are original periodic 1024px
maps baked locally by `model-source/bake_limestone_maps.py` on September 24, 2026.
The two files total 3,526,638 bytes. Albedo is sRGB; normal RGB and roughness in
its alpha channel are linear. Irregular dissolution pockets, offset chambers,
worn rims, mineral grains, sheltered films and fine multicolored coralline
growth are an artistic carbonate study,
not a scan or a biological identification. No purchased/generated image is used.
The previous CC0 maps remain here for provenance and comparison but are no
longer loaded by the reef. Three directional projections avoid stretched pores
on vertical walls and undercuts. Pores are surface relief; the unchanged eroded
rock geometry supplies the actual volume and silhouettes.

The September24 refinement adds periodic connected growth fields with pale
advancing margins and shallow granular relief. The same masks drive diffuse,
normal and roughness details, preserving earlier dissolution pockets. Compared
in full-tank and fixed close-up views against the original reef reference.
No additional texture lookup, sampler, draw call, triangle or runtime synthesis.

## Original plate-coral surface maps

plate/map.png, normalMap.png and roughnessMap.png are original periodic maps,
baked locally by model-source/bake_plate_maps.py on September23,2026. Three512px
maps total692895bytes. Diffuse is sRGB; normal/roughness are linear. Inspired by
Montipora-like immersed cups, asymmetric hoods and short tissue ridges; no external
photograph or paid image service was used.

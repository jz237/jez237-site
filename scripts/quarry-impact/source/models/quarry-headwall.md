# Northern quarry headwall

Reproduce with Blender 5.2:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python tools/author-quarry-headwall.py
```

The generator reads the frozen `quarry-headwall-base.json` boundary and the
existing `public/models/rocks-lod.glb` scan. It writes only the new headwall GLB,
editable Blender scene, shared collision JSON, and asset manifest. It does not
regenerate the accepted extraction cut, wall extension, road, or roadside.

The sector runs from 350 degrees through 25 degrees. Authoring uses continuous
angles 350 through 385; runtime removal ranges are `[350, 360)` and `[0, 25)`.
Three spatial sections use boundaries 350, 362, 374, and 385. Legacy rows 0–6,
the two angular ends, and the crest stay fixed. The source boundary records the
sub-picometre correction needed to use canonical column 0 at the 360-degree seam.
All base terrain, road, and arena geometry remains unchanged.

An additive 149-triangle skirt closes the inherited air gap below the original
toe. Its upper edges are the unchanged toe edges; its lower boundary follows
the exact terrain triangle crossings 2 cm below the terrain or buried toe.
Concave polygons are triangulated without splitting the original upper edges.
The shared JSON records this appended range as `toeClosure`, separately from
the original 17,030 wall triangles. Both visual LODs include the same closure.

The twelve runtime mesh nodes are `HeadwallRock_{0,1,2}_{near,far}` and
`HeadwallRubble_{0,1,2}_{near,far}`. They use world coordinates and two material
placeholders, with no embedded images. Rock uses the shared Rock Boulder Dry
maps at 3.6 metres per source tile, and vertex color supplies mineral variation.
The loader restores Blender's V convention for rock only and removes tangents
before using derivative normal frames. Rubble retains the existing scan atlas.

The exact near wall supplies shared collision. `wallSections` identifies its
triangle ranges. Major rubble blocks have simplified convex hulls; the smaller
embedded high-wall fragments are decorative. Both LODs retain identical radial
samples at section boundaries. Rubble anchors use the highest actual wall
intersection over their lower footprint, including overhangs.

Original authored wall geometry is part of Quarry Impact. Rubble derives from
Poly Haven's [Rock Moss Set 01](https://polyhaven.com/a/rock_moss_set_01), CC0.
The wall reuses [Rock Boulder Dry](https://polyhaven.com/a/rock_boulder_dry), CC0.
Source downloads, authors, and hashes are retained in the project's existing
asset provenance records. This milestone downloads no assets and adds no maps.

The generated manifest records measured mesh counts, rubble placements, and
the SHA-256 and byte count of each output. Runtime visual acceptance and shared
collision validation are recorded separately by the release workflow.

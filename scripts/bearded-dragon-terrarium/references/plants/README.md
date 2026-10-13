# Desert plant references

Three photographic reference studies were generated through **fal** using
**openai/gpt-image-2**, text-to-image mode, medium quality, 1536 × 1024 PNG,
one image per request. The user authorized a total spending cap of $0.20.
The three requests were submitted once; their request IDs and image checksums
are recorded in the adjacent result JSON files.

- [Aloe rosette and leaf detail](aloe-rosette-reference.png)
- [Ribbed cacti, areoles, skin, and flower detail](cactus-reference.png)
- [Dry desert shrub, twigs, leaves, and seed detail](dry-shrub-reference.png)
- [Complete prompts and generation settings](generation-input.json)

The studies guide the 3D plants in `lib/DesertPlants.ts`: curved fleshy aloe
leaves with fine marginal teeth; rounded cactus ribs with staggered woolly
areoles and separate radial spines; and irregular tapered shrub branches,
curled leaves, and papery seeds. They are generated visual references rather
than field photographs or scientific specimen records.

The unmodified aloe and cactus PNGs are also bundled in `public/plants`.
The material shader samples uninterrupted leaf/epidermis regions, excluding
backgrounds and photographed spines. Geometry supplies the silhouette,
thickness, teeth, areoles, and spines, while the sampled color and procedural
micro-bump provide surface detail. The shrub study is used for form and color
guidance only. Plant materials respond to the terrarium lights.

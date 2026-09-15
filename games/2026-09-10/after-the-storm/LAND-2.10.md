# Land graphics — v2.10.0

The supplied reference was present in both requests. This pass addresses the land specifically: fractured rocky islands, foliage-covered slopes, fuller tree silhouettes and varied beach edges.

## Rendering

- Eroded island ridges replace the smooth Gaussian mounds. Deterministic, domain-warped ridge noise supplies gullies and broken silhouettes at multiple scales. Three distance layers use 80, 48 and 32 subdivisions, drawn as one land mesh per layer.
- A new generated granite albedo is shared by cliffs, coastal rocks and the terrain rock blend. Triplanar mapping avoids stretched cliff UVs. The broad pattern uses a larger world scale on distant islands; local surface normals, wetness and lighting stay live.
- Slope-dependent vegetation shades flatter ledges and valleys. Instanced boulders break up the island toes.
- Existing First Light oak/maple cutouts provide photographic canopy detail on three crossed planes. Shared images, alpha testing and spatial batches keep their cost low. Understory clusters fill gaps; palms retain 3D curved fronds and now have fuller crowns and curved trunks.
- Small pebble clusters populate dry beaches above the navigable water. The original course terrain, hull collision, wave physics, controls and speed limit remain unchanged.

## Verification

- Procedural terrain tests check finite bounded elevations, submerged island boundaries, deterministic variation and continuity of the base noise.
- Browser race inspections cover Sunny Beach and Sunset Bay at 1280×720 medium, using the rolling frame meter. Early race windows were 59.5–60.0 fps, frame P95 16.8 ms. These are host measurements, not physical-phone performance guarantees.
- Final Sunset Bay at 1280×720 medium: 60.0 fps, frame P95 16.8 ms, CPU P95 15.3 ms. The visible scene included 491 distant trees and 158 island-edge boulders; the main render reported 155 draw calls.
- Final 844×390 landscape low: 60.0 fps, frame P95 16.8 ms, CPU P95 13.1 ms; unobstructed demo view and no console errors.
- 31 targeted tests passed, including the full demo route regression.
- No shader or console errors in those inspections. Race and demo regression checks are recorded in `land-final-check.log` (local ignored log).

## Assets and limits

Granite: [assets/terrain/coastal-granite-v1.png](assets/terrain/coastal-granite-v1.png), generated using built-in image_gen. Exact prompt and tree provenance: [assets/scenery/LAND-PROVENANCE.json](assets/scenery/LAND-PROVENANCE.json).

Tree images: [oak](assets/scenery/first-light-oak.webp), [maple](assets/scenery/first-light-maple.webp), reused unchanged from the site's committed First Light game. No external paid generation service was used in this pass.

The islands are procedural scenery outside the race routes. Photographic broadleaf canopies are crossed cutouts, so they do not have the close-range depth of a fully modelled tree. Palms and nearby existing pine models retain their 3D geometry. The source image guides appearance; the game is not an exact reproduction of that image.

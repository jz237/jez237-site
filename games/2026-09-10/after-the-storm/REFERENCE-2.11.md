# Reference graphics pass — v2.11.0

The supplied first image is the visual target; the second image shows the shipped phone view. This pass specifically addresses the visible cellular foam grid, blurred phone rendering, sparse shoreline, weak spray, and inconsistent distant land lighting. It does not claim to reproduce the reference's photorealism.

## Changes

- Replaced the Voronoi foam lattice with periodic multiscale density. Fresh froth has irregular opaque cores, granular edges and clear gaps. Older foam erodes into separate patches; aeration and shoreline wetness still use the existing history atlas.
- Stronger filtered water normals, wave-face shading and finite sun glints. Redistributed existing water vertices toward the rider for better close-range crest silhouettes, retaining the shared displacement and buoyancy model.
- Spray projection now follows render-buffer height and lens FOV. Faster outward chine spray, higher nozzle plumes and brighter broken spray sheets retain real hull velocity, contact and turning response.
- Jittered dry-shore surveys add clustered rocks, palms, broadleaf trees and ground cover near the course. Distant palms use curved frond ribbons; nearby palms retain separate leaflets. This keeps the fuller shoreline within a practical rendering budget.
- Distant island ridges have gentler massing. Rock textures now sample world units on instances. Distant trees and boulders use the same atmospheric fade as their island, eliminating pale cutout silhouettes.
- A revised coherent cloud panorama supplies both visible sky and reflections. Sun alignment and venue lighting are preserved. The returned image is 1774×887, despite a higher requested resolution; this is not a 4K upgrade.
- Low graphics keeps CSS-pixel clarity on small phones, with a 620,000-pixel raster budget. Medium and High are bounded at 1.2 and 2.3 million pixels. Rotation recalculates that budget. The portrait demo gently recenters its subject if shoreline camera avoidance pushes it toward the edge.
- Reused the existing PMREM generator on course changes, removing an unnecessary renderer allocation.

## Verification

- 36 targeted tests passed: all demo venues/routes, camera turn limits, doubled speed and partial throttle, spray motion, water interactions and terrain bounds.
- 12 further checks passed: pixel-budget/rotation invariants and riding-immersion regressions.
- Live browser shader compilation caught a reserved GLSL identifier during development; it was corrected before release.
- Inspected the actual running game at phone portrait and landscape/desktop viewport sizes. Performance figures below are measurements on the development computer, not physical-phone guarantees.

Measured rolling windows after the palm optimization:

| View | Quality | FPS | Frame P95 | CPU P95 |
| --- | --- | --- | --- | --- |
| 390×780 portrait | Low | 60.0 | 16.8 ms | 13.2 ms |
| 390×780 portrait | Medium | 60.0 | 16.7 ms | 13.5 ms |
| 1280×720 landscape | Medium | 58.3 | 16.8 ms | 16.5 ms |
| 1280×720 landscape | High | 53.3 | 33.4 ms | 21.9 ms |

High intentionally costs more. The adaptive preset can choose Medium or Low, and the denser land still varies in cost by view. These are 240-frame measurement windows, not minimum-frame-rate guarantees.

## Assets and limits

New sky: [coastal-clouds-v3.png](assets/sky/coastal-clouds-v3.png). Generated using built-in image_gen; [exact prompt and provenance](assets/sky/COASTAL-CLOUDS-V3.json).

Water uses planar reflections and screen-space refraction, with simulated foam and ballistic spray rather than volumetric fluid simulation. Broadleaf trees remain photographic crossed cards; distant palms have simplified geometry. Clouds use a static panorama with slow drift and dynamic tint. These remain visible differences from the reference image.

Other agents' changes on main were incorporated before editing. Course collision, objectives, controls, wave physics, speed limits and the rest of the website are preserved.

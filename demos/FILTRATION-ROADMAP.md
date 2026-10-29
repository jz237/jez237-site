# Filtration demo inventory and next studies

Reviewed October 28, 2026 against the current `jz237/jez237-site` checkout and the running demos. The main gallery previously listed 26 exhibits. Two existing filtration exhibits were reachable within the site but absent from that gallery; this update registers them alongside the new AC70, bringing the gallery to 29.

| Exhibit | Existing coverage | Location |
| --- | --- | --- |
| AquaClear Atelier — new | Current AC70 hang-on-back filter; 15 assemblies; intake, magnetic impeller, foam, rear carbon/front BIOMAX, spillway, refiltration, care | `/demos/aquaclear-studio/` |
| FiltoClear 5200 Studio — existing | Pressurized pond canister; 32 assemblies; foam stack, UV core, normal water path, Easy-Clean and pond sizing | `/demos/filtoclear-studio/` |
| Inside the Reef — existing | Sump system, fleece roller, protein skimmer, live-rock biology and return pump | `/demos/reef-filtration/` |
| The Living Reef — existing | Reef aquarium and water chemistry; links to the filtration studio | `/demos/reef-aquarium/` |
| The Living Aquascape — existing | Planted aquarium and photographic ecosystem exploration | `/demos/rotatable-aquascape/`, alternate `/demos/living-aquascape/` |
| Koi Pond Garden — existing | Pond ecosystem and navigation to the FiltoClear study | `/demos/koi-pond-garden/` |

The alternate photographic aquarium, the Hidden Reef koi mount and Philadelphia's Cesium support folder are not additional independent gallery exhibits. Do not recreate the separate Hidden Reef storefront in this repository. This inventory does not claim to enumerate every experiment on the separately maintained storefront/Lab.

## Revised order

### AC70 realism update — implemented October 28, 2026

- Six close-up guided chapters with subdued context and dedicated pump, foam, media and spillway camera positions.
- A working impeller close-up with an open teaching section, the same rotor as the main assembly, and axial-in/radial-out arrows. Pause freezes it; care disables operation.
- Clean versus loaded foam: visible upstream deposits, incoming debris captured at the foam, lower normal delivery and a labeled bypass. These are qualitative illustrations.
- Curved, animated spillway water meeting an adjustable surface; interfering surface waves, small bubbles/droplets, and a 0–38 mm water-level control with the manufacturer's maximum-gap reference mark.
- Nonmetallic case materials, finer foam detail, less overlap in ceramic placement and revised lighting. Still an educational reconstruction, not a photoreal scan.

### Second AC70 realism pass — implemented October 28, 2026

1. **Photograph-guided geometry:** visually checked the official AC70 gallery, A16331 cover and A16316 impeller cover. Corrected smoky thin walls, drafted case, perforated lid/side badge, blue foam, woven bags, hollow extension and rectangular pump cover. This remains an approximate reconstruction; no measured CAD was supplied.
2. **Water optics:** mirrored-camera scene reflection, depth-aware screen refraction, Fresnel blending, waterline detail and restrained procedural moving light patterns. Uses bounded lower-resolution targets on mobile; rendering is suspended when water is hidden. Not ray tracing or CFD.
3. **Surface and contact detail:** procedural molding grain, ceramic pores, actual alpha-cutout fabric weave, wet/dry roughness, filtered contact shadows and fitted lid seams. No purchased or copied image assets.

The next precision step is measured geometry or a physical scan, particularly the concealed volute and impeller dimensions. A future optical pass could add depth-aware absorption and better refraction at screen edges; the current sheet uses the horizontal surface's reflection approximation. Ceramic pieces now use a conservative sphere-envelope packing approximation, varied profiles and shaded bores. A further material pass adds cellular foam, finer flexible bags, physically transmissive plastic and studio reflection panels; it remains a real-time educational reconstruction. See `aquaclear-studio/README.md` for references, rendering limits and tests.

### Next distinct filter mechanisms

1. **Air-driven sponge filter.** Best next distinct mechanism: airlift, bubbles entraining water, sponge surfaces, gentle circulation, air line and check-valve placement. Show the air and water as different paths. No current gallery exhibit focuses on this mechanism.
2. **Undergravel filter.** A useful contrast: gravel as the bed, slotted plates, lift tubes, trapped detritus and maintenance. Explain conventional and reverse-flow arrangements separately.
3. **Wet/dry trickle filter.** Show a distributor, oxygen-exposed biological media, sump water level and return. Differentiate it from the existing submerged live-rock sump exhibit.

The protein skimmer, fleece roller and return pump already have a dedicated existing studio. Improve those exhibits when a specific teaching gap appears rather than building duplicate demos. Another branded canister is a lower priority unless its mechanism adds a distinct lesson.

Before starting another study, recheck `demos/catalog.json`, actual demo directories and the manufacturer's current manual. Use primary manufacturer sources, original procedural geometry, local runtime dependencies, actual screenshots and clear limits on any illustrative simulation. No links to competing aquarium retailers are needed.

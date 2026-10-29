# Filtration demo inventory and next studies

Reviewed October 28, 2026 against the current `jz237/jez237-site` checkout and the running demos. The gallery now lists 30 exhibits, including the new Trickle Atelier. The earlier AC70 update also registered two existing filtration exhibits that had been absent from the gallery.

| Exhibit | Existing coverage | Location |
| --- | --- | --- |
| Trickle Atelier — new | Original wet/dry circuit; 18 assemblies; distributor, open bio-balls, baffles, return pump, seven close-ups and power-off reserve lab | `/demos/trickle-studio/` |
| AquaClear Atelier — existing | Current AC70 hang-on-back filter; 15 assemblies; intake, magnetic impeller, foam, rear carbon/front BIOMAX, spillway, refiltration, care | `/demos/aquaclear-studio/` |
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

### Wet/dry trickle study — implemented October 28, 2026

The user chose this mechanism ahead of the sponge filter. Trickle Atelier provides a complete gravity-drain/pumped-return circuit, an actual perforated distributor, 96 ribbed bio-balls, water-level and loaded-pad controls, finite power-off drain-down, low-level pump stop and high-fill overflow warning. It shares the HOB exhibit's visual/control system and local rendering dependencies. Seven guided close-ups, four care stages and 18 selectable assemblies are supported on desktop/mobile. See `trickle-studio/README.md` for references, simulation limits, architecture and tests. The original design is educational rather than a branded product replica or installation plan.

### Next distinct filter mechanisms

1. **Undergravel filter.** Gravel as the bed, slotted plates, lift tubes, trapped detritus and maintenance. Explain conventional and reverse-flow arrangements separately. This adds a larger system-level study after wet/dry.
2. **Air-driven sponge filter.** A smaller distinct mechanism, deferred by user preference: airlift, bubbles entraining water, sponge surfaces, gentle circulation, air line and check-valve placement. Show the air and water as different paths. No current gallery exhibit focuses on this mechanism.

The protein skimmer, fleece roller and return pump already have a dedicated existing studio. Improve those exhibits when a specific teaching gap appears rather than building duplicate demos. Another branded canister is a lower priority unless its mechanism adds a distinct lesson.

Before starting another study, recheck `demos/catalog.json`, actual demo directories and the manufacturer's current manual. Use primary manufacturer sources, original procedural geometry, local runtime dependencies, actual screenshots and clear limits on any illustrative simulation. No links to competing aquarium retailers are needed.

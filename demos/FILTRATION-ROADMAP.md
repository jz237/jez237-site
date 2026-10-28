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

### AC70 improvements to consider

The flow view now uses small tangent-aligned 3D arrows, including in paused views. Further improvements below are proposals, not implemented features:

- A guided water journey with camera close-ups and one highlighted stage at a time, so the inlet, impeller, foam, upper media and spillway are easy to follow.
- A magnified working impeller view that exposes the blades and pump chamber, synchronized with the main model.
- A clearer clean-versus-loaded media comparison: visible debris caught at the foam, reduced passage through it, and an explicitly labeled bypass. Keep this qualitative; do not invent calibrated clogging or chemistry values.
- A more natural spillway sheet and surface ripples, with adjustable aquarium water level and a visible manufacturer reference mark.

### Next distinct filter mechanisms

1. **Air-driven sponge filter.** Best next distinct mechanism: airlift, bubbles entraining water, sponge surfaces, gentle circulation, air line and check-valve placement. Show the air and water as different paths. No current gallery exhibit focuses on this mechanism.
2. **Undergravel filter.** A useful contrast: gravel as the bed, slotted plates, lift tubes, trapped detritus and maintenance. Explain conventional and reverse-flow arrangements separately.
3. **Wet/dry trickle filter.** Show a distributor, oxygen-exposed biological media, sump water level and return. Differentiate it from the existing submerged live-rock sump exhibit.

The protein skimmer, fleece roller and return pump already have a dedicated existing studio. Improve those exhibits when a specific teaching gap appears rather than building duplicate demos. Another branded canister is a lower priority unless its mechanism adds a distinct lesson.

Before starting another study, recheck `demos/catalog.json`, actual demo directories and the manufacturer's current manual. Use primary manufacturer sources, original procedural geometry, local runtime dependencies, actual screenshots and clear limits on any illustrative simulation. No links to competing aquarium retailers are needed.

# Reef filtration studio

Separate 3D educational exhibit, linked from the reef's top learning toolbar and Water & flow lesson. Original procedural geometry; no purchased assets, generated images, external runtime libraries, or aquarium model download. Uses the repository's installed Three.js/Vite versions.

## Exhibit

- Whole sump: viewing panes, overflow, backup drain, over/under/over baffles and return riser.
- Fleece roller: 8 selectable assemblies, continuous textured strip, support cradle, supply/take-up spools, motor, inlet and level sensor. The accelerated clogging experiment shows the upstream level through a temporary translucent cloth, advances the rolls briefly, lowers the level, then stops the motor.
- Protein skimmer: 11 assemblies, hollow tapered chamber and neck, annular waste cup, lid, perforated diffuser, pinned needle wheel, pump, venturi, air silencer/hose and water outlet. Water, air and waste follow distinct animated routes.
- Live rock: 3 perforated teaching sections and 2 enlarged symbolic microbial communities. Explains nitrogen transformation without presenting it as nutrient export or a removable cartridge.
- Return pump: 7 assemblies, wet rotor, curved impeller vanes, shaft/bearing supports, casing, volute, seal, intake guard and vibration cradle.

42 selectable components in total. Each has its own name, purpose and care/context note. Smooth separation slider and assembly sequence; labels, click picking, keyboard-accessible part selector, isolate/clear, orbit/zoom, camera presets, fit/reset, flow toggle and motion pause. Each system has four reader-paced explanations. Static water-route guide and primary reference links remain below the 3D view.

This is a generic teaching reconstruction, not product CAD, an equipment sizing tool, a service procedure or a water-chemistry solver. Flows, timings, proportions and microbe sizes are illustrative. Manufacturer sources are linked beside the relevant topics.

## Build and verification

From `scripts/rotatable-aquascape`:

```
npm run build:filtration
npm run check:filtration
npm run build:reef
npm run check:reef
node filtration/qa/performance.mjs
```

The build copies the same assets into `demos/reef-filtration` and both stores' `showroom/filtration`. Browser QA supports `FILTRATION_TEST_BASE` for a deployed URL. Raw captures are saved under `.qa-results/filtration`. The benchmark compares the existing reef before/after serially and separately measures this exhibit; the baseline can be set with `REEF_BASELINE`.

No filtration module is imported into the reef renderer. Navigation loads it only when requested. The new scene stops rendering when paused and settled, suspends while hidden/offscreen, and starts paused for reduced-motion preferences. Reduced-motion explosion changes are immediate; explicitly playing a sequence opts into animation.

Publishing follows the existing current-main, clean/pushed, whole-site staging gates. Hidden Reef and jez237 use separate Cloudflare accounts; do not assume one account's authorization covers the other.

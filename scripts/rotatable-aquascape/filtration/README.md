# Reef filtration studio

Separate 3D educational exhibit, linked from the reef's top learning toolbar and Water & flow lesson. Original procedural geometry, using the repository's installed Three.js/Vite versions. Five GPT Image appearance references are saved in `qa/references/`, with exact prompts in `qa/reference-prompts.json`. These images guide the materials and geometry; they are not loaded by the exhibit or presented as manufacturer specifications. No purchased assets or paid API calls.

## Exhibit

- Whole sump: viewing panes, overflow, backup drain, over/under/over baffles and return riser.
- Fleece roller: 8 selectable assemblies, continuous textured strip, support cradle, supply/take-up spools, motor, inlet and level sensor. The accelerated clogging experiment shows the upstream level through a temporary translucent cloth, advances the rolls briefly, lowers the level, then stops the motor.
- Protein skimmer: 11 assemblies, hollow tapered chamber and neck, annular waste cup, lid, perforated diffuser, pinned needle wheel, pump, venturi, air silencer/hose and water outlet. Water, air and waste follow distinct animated routes.
- Live rock: one irregular porous solid, cut into 3 inspectable teaching sections, with mineral texture, coralline color variation and an animated magnified biofilm diagram. Explains nitrogen transformation without presenting it as nutrient export or a removable cartridge.
- Return pump: 7 assemblies, hollow wet-rotor cavity, swept impeller vanes, ceramic shaft/bearing seats, textured molded casing, expanding volute, wet-side O-ring, intake cage, helical outlet thread and vibration cradle. A section-cutaway button reveals the rotor while retaining the discharge; an inspection-speed slider slows the motion.

The return-pump view includes six reader-paced lessons and a three-route comparison of qualitative pump/plumbing curves. The operating point moves with added vertical lift and friction at one pump setting; no numerical flow or equipment size is predicted. Practical notes cover vibration, intake obstructions, wet-side care, evaporation, drain-back and restart sequencing, with primary sources linked. See `qa/return-pump-review.md` for before/after renders and performance, and `qa/publication-return-pump.json` for production verification.

40 selectable components in total. Each has its own name, purpose and care/context note. Smooth separation slider and assembly sequence; labels, click picking, keyboard-accessible part selector, isolate/clear, orbit/zoom, camera presets, fit/reset, flow toggle and motion pause. Each system has four reader-paced explanations. Static water-route guide and primary reference links remain below the 3D view.

The whole system, fleece roller, skimmer and return pump also have four-step animated cutaways below their 3D controls. `See how it works` jumps to the guide; each step's `Find this part in 3D` returns to and selects the corresponding component. The whole-system guide distinguishes main sump flow from the skimmer's local loop. The roller follows debris onto used fleece and shows sensor-triggered advance and stop. The skimmer separates rising foam/waste from the lower water outlet, and the pump traces the center inlet through the impeller and volute.

These SVG guides animate only on request, finish after one 16-second cycle, honor local/global pause and suspend offscreen or in a hidden tab. Numbered steps remain usable without animation. They add no image downloads or additional WebGL context. The accepted magnified live-rock biofilm remains separate and unchanged.

This is a generic teaching reconstruction, not product CAD, an equipment sizing tool, a service procedure or a water-chemistry solver. Flows, timings, proportions and microbe sizes are illustrative. Manufacturer sources are linked beside the relevant topics.

## Build and verification

From `scripts/rotatable-aquascape`:

```
npm run build:filtration
npm run check:filtration
node filtration/qa/process-guides.mjs
node filtration/qa/biofilm.mjs
node filtration/qa/realism-browser.mjs
```

After changing `RockGeometry.ts`, run `npm run bake:filtration-rock` before building. This generates the complete mesh offline and packs it into `rock-layers.bin.gz`. The runtime downloads and decompresses it only when Living rock is selected, then retains it for reuse. The packed positions are quantized at approximately 0.000061 model units; triangle topology is preserved. No generated reference image is needed at runtime.

`qa/realism-review.md` records the reference comparison, before/after evidence, limitations and measured performance. Material batching preserves the 40 selectable/explodable components and independently animated groups. Acrylic walls have actual thickness; equipment has recessed fasteners, ribs, seals and molded edges. Fleece has fiber and wound-roll detail. Neutral studio lighting, reflection and soft contact shadows replace the flat diagram stage.

The build copies the same assets into `demos/reef-filtration` and both stores' `showroom/filtration`. Browser QA supports `FILTRATION_TEST_BASE` for a deployed URL. Raw captures are saved under `.qa-results/filtration`. The realism benchmark compares the previously published filtration build and the revised exhibit serially. `qa/performance.mjs` is the earlier reef integration benchmark; rerun it if the aquarium integration changes. Aquarium source changes also require the established `build:reef` / `check:reef` workflow.

No filtration module is imported into the reef renderer. Navigation loads it only when requested. The new scene stops rendering when paused and settled, suspends while hidden/offscreen, and starts paused for reduced-motion preferences. Reduced-motion explosion changes are immediate; explicitly playing a sequence opts into animation.

Publishing follows the existing current-main, clean/pushed, whole-site staging gates. Hidden Reef and jez237 use separate Cloudflare accounts; do not assume one account's authorization covers the other.

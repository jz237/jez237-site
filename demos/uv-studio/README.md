# UV Atelier — study 038

A buildless, self-hosted Three.js educational inline ultraviolet stage at `/demos/uv-studio/`. Included only through the Aquarium Filtration collection on the main demos gallery. The separate Hidden Reef storefront is not edited here.

## Reference and boundaries

Original geometry informed by Aquatop's Eliminator E-36 compact PL lamp, dry socket, closed-end quartz sleeve, opaque body, threaded cap, stepped fittings, seals, external ballast and two brackets. External supply pump is contextual and not supplied with the real UV. Body dimensions, internal guide geometry and three illustrated trajectories are not factory CAD or a hydraulic simulation. The lamp stays dark while parts are separated or serviced; cutaway glow is explicitly an illustration of invisible UV-C.

- Manufacturer: https://www.aquatop.com/eliminator-series-in-line-uv-36w-sterilizer-1250-gph.html
- Official assembly/service PDF: https://cdn.shopify.com/s/files/1/1270/1103/files/eliminator-series-manual.pdf
- Store: https://www.thehiddenreef.com/at-uv-sterilizer-36w.html
- UK DWI principles: https://www.dwi.gov.uk/private-water-supplies/pws-installations/treatment-guide-2/uv-disinfection/
- EPA UV guidance: https://www.epa.gov/system/files/documents/2022-10/ultraviolet-disinfection-guidance-manual-2006.pdf

Reference checked 2026-10-31. The legacy manual/store state 1,250 GPH for E-36; the current manufacturer product page displays 2,641 GPH. Do not silently choose a flow as a validated organism-specific treatment rating. All experiment inputs remain normalized. No dose targets, kill percentages, disease cures or aquarium sizing predictions are made. Manufacturer care directions govern real service; demonstration is not a substitute.

## Model and controls

14 selectable assemblies, four scene modes, ten guided lessons, eight experiments, four independent sliders, five knowledge checks, camera presets, pointer picking, labels, pause, slow motion, orbit, flow arrows and UV overlay. Keyboard tabs use arrows/Home/End; viewport Space pauses and F fits. Reduced motion starts paused. Mobile has a stacked layout. WebGL failure leaves static educational content available.

`simulation.js` is pure deterministic comparative physics: lamp output × water transmission × sleeve transmission × relative residence time. Sleeve transmission is an illustrative attenuation factor, not measured chemistry. Throughput scales with delivery; relative residence scales inversely. UV holds off at zero flow as a teaching safeguard, not an asserted E-36 hardware interlock. Path factors are illustrative. Macro lesions depict prevented replication without organisms disappearing. Do not describe this as a physical dose solver.

`model.js` builds the apparatus, textured materials, quartz highlights, threaded joints, molded fittings, service motion, water cues and enlarged cell. Shared hardware shader, studio lighting and bevel geometry are imported from sibling studies; do not alter those without checking affected demos. No paid services or external asset CDNs.

The 24-model-second service sequence isolates power and supply, withdraws the lamp straight, separates its socket, inspects/cleans the sleeve, reseats the assembly, then refills with the lamp off. Only after completion are fresh-lamp and clean-sleeve controls applied and UV enabled again. Pause, slow motion, care reading, hidden documents and exploded mode obey the common clock. Reset clears all transient state. `window.uvStudio.snapshot()` exposes state/effects for QA.

## Checks and publishing

- `node --check demos/uv-studio/studio.js` (and model/simulation/data)
- `node scripts/uv-studio/simulation.test.mjs`
- `node scripts/uv-studio/qa.cjs [base demo URL]`
- `node scripts/uv-studio/inspect.cjs [base demo URL]` for screenshot review
- `node scripts/build-demos.mjs` rebuilds collection and gallery; 11 filter studies, one main-gallery collection card.

Gallery artwork must be an actual render of the demo. Inspect desktop, mobile, assembled, cutaway, exploded, micro and service views. Commit and push the reviewed website before using the required outer wrapper:

`node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy`

Never make another full-site staging copy. Verify live module bytes, browser operation and the collection link after wrapper success. HTML may be augmented by middleware; do not compare raw HTML hashes.

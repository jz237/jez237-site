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

14 selectable assemblies, four scene modes, ten guided lessons, eight experiments, four independent sliders, five knowledge checks, camera presets, pointer picking, labels, pause, slow motion, orbit, flow arrows and UV overlay. Keyboard tabs use arrows/Home/End; viewport Space pauses and F fits. Animation starts immediately, including with the OS reduced-motion preference, as expressly requested by the owner. Reduced motion selects Light graphics and disables ambient orbit; Pause remains available. Mobile has a stacked layout. WebGL failure or context loss switches to a running Canvas 2D circuit driven by the same simulation.

`simulation.js` is pure deterministic comparative physics: lamp output × water transmission × sleeve transmission × relative residence time. Sleeve transmission is an illustrative attenuation factor, not measured chemistry. Throughput scales with delivery; relative residence scales inversely. UV holds off at zero flow as a teaching safeguard, not an asserted E-36 hardware interlock. Path factors are illustrative. Macro lesions depict prevented replication without organisms disappearing. Do not describe this as a physical dose solver.

`model.js` builds the apparatus, textured materials, quartz highlights, threaded joints, molded fittings, service motion, water cues and enlarged cell. Shared hardware shader, studio lighting and bevel geometry are imported from sibling studies; do not alter those without checking affected demos. No paid services or external asset CDNs.

The 24-model-second service sequence isolates power and supply, withdraws the lamp straight, separates its socket, inspects/cleans the sleeve, reseats the assembly, then refills with the lamp off. Only after completion are fresh-lamp and clean-sleeve controls applied and UV enabled again. Pause, slow motion, care reading, hidden documents and exploded mode obey the common clock. Reset clears all transient state. `window.uvStudio.snapshot()` exposes state/effects for QA.

## Checks and publishing

- `node --check demos/uv-studio/studio.js` (and model/simulation/data)
- `node scripts/uv-studio/simulation.test.mjs`
- `node scripts/uv-studio/qa.cjs [base demo URL]`
- `node scripts/uv-studio/inspect.cjs [base demo URL]` for screenshot review
- `node scripts/uv-studio/v4-check.cjs [base demo URL]` for integrated parcel, cloth contact, circuit, graphics loss, low-spec hints and slow-frame adaptation
- `node scripts/build-demos.mjs` rebuilds collection and gallery; 11 filter studies, one main-gallery collection card.

Gallery artwork must be an actual render of the demo. Inspect desktop, mobile, assembled, cutaway, exploded, micro and service views. Commit and push the reviewed website before using the required outer wrapper:

`node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy`

Never make another full-site staging copy. Verify live module bytes, browser operation and the collection link after wrapper success. HTML may be augmented by middleware; do not compare raw HTML hashes.

## v2 — continuous assembly separation

The persistent Exploded view range control scrubs separation from 0–100%, with native pointer, touch and arrow-key support. Moving it enters assembly inspection and isolates UV/pump power while parts are separated. As of v3, returning to 0% automatically restores Cutaway once the parts finish seating, resuming the previous operation without another click. Geometry smoothly follows the requested separation, and the camera fits intermediate extents while retaining an existing orbit during scrubbing. Reset and other modes return the slider to 0%. Power stays isolated until a returning assembly is fully seated. The slider remains usable while the operating animation is paused.

## v3 — resume after reassembly

The frame loop leaves assembly inspection only when both the requested and rendered separation reach zero. Operation then resumes through the normal simulation gate, preserving explicit Pause, pump, lamp and care-reading settings. The camera retains the slider framing/orbit rather than snapping to another preset. Reopening during a closing animation keeps operation isolated.


## v4 — optics, contextual circuit and resilient animation

- `materials.js` generates deterministic stipple, rubber, brushed-metal and cloth maps locally. Quartz and water share a depth-guarded scene capture, with restrained refraction, Fresnel edges and moving water highlights. The water clock follows delivered flow and freezes with the pump. The paired compact lamp has separate highlights, end collars and pins. Shared sibling demo files are unchanged.
- Track a water parcel launches a single amber tracer with a short trail. Its elapsed **model seconds** and relative exposure are integrated over its actual journey, including changes to the controls. The reference journey integrates to 1×; faster flow shortens it. With the pump stopped, position and UV exposure hold while time in the chamber continues. With UV off and pump on, water continues without accumulating more exposure. Pause freezes all clocks. This remains an illustrative comparison, never measured residence, fluence or organism survival.
- `serviceWipe()` is the shared source for the cloth contact front and the deposit mask. During service seconds 13.2–15.7, a cloth wraps the fully extracted sleeve and traverses its length. Each deposit is removed only once that front reaches its original position. The wipe persists through reseating; UV remains off until refill completes.
- `circuit.js` adds a tank, screened pickup, separate mechanical cartridge, pump connections and a return loop. The full circuit is an optional study; dimensions, routing, flow arrows and internal guides are illustrative, not installation instructions or factory internals.
- Graphics Auto starts in Balanced, or Light for reduced-motion/low-spec hardware hints. Sustained frame times above approximately 38 ms lower quality to Light. Sustained times above 100 ms in Light select the animated diagram. Startup, brief stalls and hidden-tab gaps do not trigger a pause. Detailed and Light are explicit user overrides. Light reduces pixel density, particles, refraction captures and shadows; it never changes the simulation speed or state.
- `fallback.js` draws the aquarium circuit with Canvas 2D when WebGL 2 is unavailable, the graphics context is lost, or the user chooses Diagram. It continues water arrows and the amber parcel using the same clocks, power controls, separation interlock and Pause. This is a simpler educational view, not equivalent 3D geometry. A functioning modern browser is still required.
- `performance.js` contains the independently tested governor. `v4-check.cjs` injects slow animation frames, low hardware hints and real WebGL context loss. Regular QA also forces WebGL unavailable and verifies reduced-motion startup. These checks simulate constraints; they do not certify every older computer.

The release entry points and local modules use `?v=4` cache keys. Keep the single Aquarium Filtration link on the main demos gallery. Do not change Hidden Reef or its image-processing pipeline when publishing this independent exhibit.

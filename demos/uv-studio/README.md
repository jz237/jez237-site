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
- Graphics Auto starts in Balanced, or Light for reduced-motion/low-spec hardware hints. Sustained frame times above approximately 38 ms lower quality to Light. Sustained times above 100 ms in Light select the animated diagram. A Balanced start that stays under 20 ms for two sample windows steps up to Detailed, and returns to Balanced for good above about 22 ms. Startup, brief stalls and hidden-tab gaps do not trigger a pause. Detailed and Light are explicit user overrides. Light reduces pixel density, particles, refraction captures and shadows; it never changes the simulation speed or state.
- `fallback.js` draws the aquarium circuit with Canvas 2D when WebGL 2 is unavailable, the graphics context is lost, or the user chooses Diagram. It continues water arrows and the amber parcel using the same clocks, power controls, separation interlock and Pause. This is a simpler educational view, not equivalent 3D geometry. A functioning modern browser is still required.
- `performance.js` contains the independently tested governor. `v4-check.cjs` injects slow animation frames, low hardware hints and real WebGL context loss. Regular QA also forces WebGL unavailable and verifies reduced-motion startup. These checks simulate constraints; they do not certify every older computer.

The release entry points and local modules use `?v=4` cache keys. Keep the single Aquarium Filtration link on the main demos gallery. Do not change Hidden Reef or its image-processing pipeline when publishing this independent exhibit.


## v5 — inspection, mechanical service and diagnostic studies

Approved six-part update, November 1, 2026. No sibling filter runtime or separate Hidden Reef source is changed.

1. **Sliding section:** a bounded front-sector window moves along the housing while the rear shell stays in place. Annular end faces retain wall thickness. The amber boundary marks the explanatory opening; this is not a removable service panel.
2. **Mechanical service:** `studies.js/servicePose()` separates cap rotation/thread travel, straight withdrawal, socket-pin release, lateral lamp parking, sleeve extraction, cleaning, sleeve seating, lamp alignment, reconnection, axial insertion, and final cap rotation. The cable follows the displaced cap. The sleeve seats before the lamp and socket reconnect; the cap is closed before the refill phase. The 24 model seconds and two illustrated cap turns are not manufacturer procedure timings or turn counts.
3. **Surface detail:** molded socket seams, retainer edges, textured rubber, subtle quartz polish variation and instanced surface droplets on the extracted wet sleeve. The sleeve already has separate inner/outer walls. Droplets are hidden in normal submerged operation. The existing shared cloth contact/deposit-removal function is retained.
4. **Paired comparisons:** `createComparison()` launches two parcels together. Clean/fouled quartz, fresh/reduced lamp output, and reference/faster flow alter one variable per pair. Exposure integrates over each parcel's actual transit. A finished parcel waits while water continues; Replay both starts a new synchronized trial. Native Pause, pump/UV power and slow speed apply. The two scenes share one renderer and optical capture; phones stack them vertically. Values are normalized, not measured dose or survival.
5. **Particle shielding:** a magnified teaching scene shows an organism attached to debris and a separate free-floating organism. Prefiltration moves the particle **and attached organism together** to the screen. The free-floating example remains downstream. Violet dots illustrate shielding, not ray tracing. Capture of this example is not a filter efficiency claim. Principle: the linked DWI UV guide, checked November 1, 2026.
6. **Find the problem:** four cases present fouled quartz, an overdue lamp, stopped circulation and excessive delivery relative to the reference. Inspect circulation, quartz and lamp history; diagnose; apply a correction. Wrong guesses do not alter equipment. Ordinary fault-setting controls are locked/hidden while a case is active. Sleeve-only service leaves lamp output unchanged; lamp-only service leaves sleeve condition unchanged. The combined maintenance demonstration remains available separately. Next case and End challenge reset transient state.

The service timeline is pointer/touch/keyboard accessible. Scrubbing pauses operation at the chosen phase; Resume service continues from there. UV stays off throughout the open-unit sequence. Pause remains explicit, automatic startup and adaptive graphics remain in place. The Canvas fallback has paired parcel and particle-shielding drawings driven by the same study clocks, plus a bounded scan window. It represents service through its phase indicator rather than detailed 3D motion.

`advanced-model.js` owns the two comparison chambers and shielding exhibit. `studies.js` owns pure pose, comparison and case logic. Read-only `uvStudio.snapshot()` now includes `comparison`, `challenge`, scan position, cap angle, socket gap, wet-droplet visibility and advanced-scene diagnostics. Low quality reduces particle counts and uses the existing no-capture optical treatment. Microbes, optical geometry, material detail and water paths remain illustrative.

Checks: the existing simulation suite, `scripts/uv-studio/studies.test.mjs`, existing browser regression suite, v4 resilience checks, and `scripts/uv-studio/v5-check.cjs`. Screenshots are under ignored `tmp/uv-qa/v5/`. Keep release asset byte checks current. The updated entry point, model, materials, simulation, studies and fallback use v5 cache keys; unchanged performance/circuit helpers keep v4. The single Aquarium Filtration collection link is preserved.

Validation on November 1, 2026: both pure suites, the full original browser regression, v4 resilience checks and v5 study checks passed. The v5 run exercised all four diagnoses/corrections, timeline scrubbing and resume, comparison pause, particle capture, 390-pixel phone layout and forced WebGL failure with reduced-motion startup. Desktop scan, close service, comparison and shielding screenshots plus phone 3D/diagram views were inspected. No browser errors were recorded. These are simulated hardware constraints, not certification of every PC.

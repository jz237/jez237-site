# Skimmer Atelier

Public route: `/demos/skimmer-studio/`. Eighth child of the single Aquarium Filtration collection. Keep one collection card in Website Demos and preserve every existing direct demo URL.

## Scope and sources

Original marine in-sump needle-wheel protein skimmer. Not a commercial replica, sizing tool, CFD solver or chemical kinetics simulation. Twelve assemblies, eight lessons, seven experiments, a four-stage bubble journey and enlarged air–water interface diagram. The reef-sump exhibit has a simpler skimmer; this standalone study supplies the detailed explanation.

Primary references reviewed 2026-10-31:

- Royal Exclusiv Double Cone operating manual: https://www.royalexclusiv.com/images/content/bk_dc/eng/bk_dc_operating_maintenance_eng.pdf
- RK2 foam fractionation principles: https://www.rk2.com/facts-about-fracs.php
- Tropical Marine Centre protein skimming: https://tropicalmarinecentre.com/ib/learn-more/filtration-systems/protein-skimming

No manufacturer specifications or tank-capacity claims are assigned to the invented geometry. Saltwater is the context; specialist freshwater fractionators are acknowledged. Do not claim that dark collection alone proves greater organic mass removal, or that skimming replaces biological treatment. No retailer links, external runtime dependencies, ozone equipment or paid services.

## Implementation and constraints

- `model.js`: sectioned body/cone/neck/cup, needle-wheel pins, perforated diffuser, silencer and airline, adjustable outlet, cup drain, sump and support. Up to 6,200 bubble sprites and 3,600 instanced translucent foam cells. Foam crosses the lip and the cup fills; overflow returns below. Color and animation are explanatory, not measured concentrations or bubble trajectories. Shared local materials, geometry helpers, optics and lighting are imported without changing other demos.
- `simulation.js`: dimensionless lagged pump/air delivery, water level response to sump depth and outlet restriction, qualitative foam stability, wetness and collection. Time and collection are accelerated. Cup contents persist through preset changes; Empty cup and Reset are explicit. A temporary disturbance decays over 14 simulated seconds; this is not a real feeding recovery prediction. Neck film reduces foam modestly; Clean neck resets it.
- `studio.js`: orbit/zoom, component selector and raycast, assembled/cutaway/exploded/macro, four close-ups, eight manual lessons, four-stage guided journey, experiments, live cup history and microscope controls. Diagnostic `window.skimmerStudio.snapshot()` returns copied state; no hidden simulation-step API. Pause freezes physical clocks. Care and Exploded suspend operation; hidden tabs stop rendering and simulation; reduced-motion starts paused and does not auto-play the guide. WebGL failure leaves authored learning content usable.
- `data.js`: authored assembly notes, source-informed lessons, seven presets and journey route.

Microscope: a simplified amphiphile has a water-compatible head outside the interface and a water-avoiding tail toward air. Bubble, molecules and animation scales are independently enlarged. Colored arrows and the journey marker deliberately draw through surfaces for teaching. Geometry follows an original conceptual installation, not fabrication instructions. Assembled restores front walls; Exploded separates selected service assemblies and hides operating liquids.

Shared dependencies: Three.js and OrbitControls from AquaClear; environment/metal finishes from Drum; molded finishes, annulus/distributor helpers, optics and CSS base from Sand (whose CSS also imports Trickle). Retain these routes when reorganizing. Local release query keys start at v=1; increment them together for later revisions. Shared modules keep their own existing versions.

## Verification and publishing

From the website checkout:

```
node scripts/skimmer-studio/simulation.test.mjs
node scripts/skimmer-studio/inspect.cjs
node scripts/skimmer-studio/qa.cjs http://127.0.0.1:8822/demos/skimmer-studio/
node scripts/skimmer-studio/release-check.cjs
node scripts/build-demos.mjs
```

`inspect.cjs` captures hero, pump, neck, cup and microscope for visual review. `qa.cjs` tests assembly modes, pause, rotor and arrows, all lessons, journey completion and pause, air restriction, power failure, flooding, service actions, microscope controls, care suspension, mobile overflow, reduced motion, WebGL fallback, failed requests and console errors. Screenshots go to ignored `tmp/skimmer-qa/`. `simulation.test.mjs` checks wet/dry relationships, bounds, failures, disturbance recovery and service actions.

`release-check.cjs` verifies the eight-study collection, navigation, final exploded view and refreshes the actual cover from the local preview.

Cover `demos/assets/skimmer-studio.jpg` is a 1440×900 screenshot of the actual working application. Collection catalog, builder label, count and main collection description must stay synchronized.

Use the user-required deployment workflow: source/runtime checks, committed and pushed update, then `node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy`. Reuse the existing public stage; no full-site copies or raw Wrangler deployments. Preserve Philadelphia Functions and the private relay. Run browser QA on the live route after the wrapper succeeds.

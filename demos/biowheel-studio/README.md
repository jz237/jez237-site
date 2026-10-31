# Bio-Wheel Atelier

Route `/demos/biowheel-studio/`, field study 037. Added October 31, 2026. It belongs inside the single Aquarium Filtration collection, not as a separate main-gallery card.

## Design and sources

Original teaching geometry based on the classic Marineland Penguin return-driven biological wheel. This is not proprietary CAD, a dimensional product replica, an Emperor spray-bar model, a calibrated hydraulic model or aquarium-sizing advice. The 32-pleat count and relative proportions are explanatory choices.

- [Marineland product manuals](https://www.marineland.com/customer-service/product-manuals), Penguin 100/150/200/350 parts, setup and care. Manufacturer diagrams distinguish intake, impeller, cartridge, biological wheel and bearings. The separate Emperor spray-bar mechanism is intentionally excluded.
- [Penguin manual](https://www.marineland.com/~/media/Project/SpectrumCommerce/Marineland/Files/Product%20Files/Aquarium%20Products/Penguin/PenguinManual100150200350.pdf).
- [UF/IFAS, Ammonia in Aquatic Systems](https://ask.ifas.ufl.edu/publication/FA031): attached biological filtration, oxygen/alkalinity requirements, establishment and nitrate accumulation.
- [US EPA, Nutrient Control Design Manual](https://www.epa.gov/sites/default/files/2019-08/documents/nutrient_control_design_manual.pdf): aerobic nitrification versus nitrogen removal.

No links to competing aquarium retailers. No store inventory claim is made. Hidden Reef's storefront is controlled separately by OpenClaw on Evo X2; this release is only on jez237.com.

## What is modeled

- Four views: complete assembly, selected-wall cutaway, exploded assemblies and enlarged attached biofilm.
- Fourteen selectable parts and nine guided lessons; eight experiments isolate cartridge loading, intake restriction, axle obstruction, aquarium water height, establishment, power loss and lack of priming.
- Pleated fibrous media, end spokes, shaft and bearing seats; separate rotating magnetic impeller, motor body, intake/strainer, ribbed cartridge, individual carbon granules, molded body seams and hardware.
- Object-space hardware finishes reuse the roller's v4 helper. Local procedural fiber map, pleat relief, retained moisture, discoloration, wet sheen, droplets, deforming return sheet, bubbles and surface ripples. There are no external image/CDN dependencies.
- Water turns the biological wheel. Its lower arc moves downstream with the return. Wheel speed settles rather than instantly changing. A blocked axle stops the wheel while the pump continues; restrictions reduce delivery. Rotation is illustrative and deliberately slow enough to inspect, never presented as a biological performance score.
- One marked pleat stays attached to the same material throughout rotation. The complete water tracer follows the intake, pump, cartridge, wheel trough and receiving aquarium. Flow arrows stop when the flow stops.
- The enlarged substrate carries irregular transparent colonies and rodlike cell abstractions. Colored markers illustrate ammonia → nitrite → nitrate and oxygen delivery; they are not microscopy or a simulation of specific microbial species. The establishment slider compares states, not a real-time cycling clock.
- Separate 15-model-second cartridge and bearing-service animations, each with five captioned stages. They represent a human disconnecting power, opening the filter, servicing, re-seating/refilling, then restarting. Cartridge replacement resets loading but retains establishment. Axle service keeps the same wheel moist and clears the obstruction. Real manufacturer procedures remain authoritative.

## Runtime and safeguards

### Water realism update — v2

`water.js` now owns the return sheet, receiving surface, impact effects and subtle moving floor caustics. The sheet follows the actual plastic trough and angled lip, then follows a gravity-shaped arc to the current aquarium level. Lower water creates a longer fall; lower delivery narrows both the sheet and its bubble/splash footprint. Small waves deform the geometry, while fine moving surface detail bends the reflections. Foam patches drift outward, entrained bubbles descend and rise, and small droplets leave the landing zone. These are illustrative visual units, not measured hydraulics.

`optics.js` captures the actual scene for planar aquarium reflections and depth-guarded refraction. It restores render target, visibility, clear color, tone mapping, shadow settings and XR state after each capture. The reflection camera clips at the aquarium surface; the falling sheet and filter chamber use refraction and studio highlights rather than incorrectly reusing that horizontal reflection plane. Captures are skipped for hidden water, exploded views and the microscope. Resolution is capped and smaller on mobile. Screen-space refraction cannot show objects outside the camera frame; this is a real-time approximation, not path tracing.

All water geometry, shader detail and particles use the simulation clock, so pause and reading modes remain consistent. The full curtain and its impact particles disappear as return delivery falls to zero. Main water rendering replaces the old bright drawn ripple pattern; the maintenance tray and enlarged biofilm keep a lighter independent finish. The cartridge-loading input now has a unique ID, fixing a collision with the loading overlay that positioned its slider across the 3D view.

`simulation.js` contains substepped normalized flow, inertia, moisture, service state and the teaching dry-start interlock. This interlock is not claimed as real product electronics. All animation uses simulation time/travel; pause, exploded mode, Care reading view and hidden documents freeze it. Reduced motion starts paused and leaves orbit/zoom available. All topics remain readable when WebGL is unavailable.

`model.js` owns geometry and rendering; `finishes.js` owns texture/shader detail; `data.js` owns components, lessons, experiments and quizzes; `studio.js` owns interaction and camera. The pump and cartridge close-ups hide obstructing assemblies, restoring them when the view ends. Runtime inspection is available through `window.biowheelStudio.snapshot()` and `.reset()`.

## Verification

From this checkout, with a local HTTP server on port 8823:

```text
node scripts/biowheel-studio/simulation.test.mjs
node scripts/biowheel-studio/water.test.mjs
node scripts/biowheel-studio/water-qa.cjs
node scripts/biowheel-studio/inspect.cjs
node scripts/biowheel-studio/qa.cjs
node scripts/build-demos.mjs
```

The pure tests cover rotation causality, jam isolation, restriction, moisture retention, priming, bypass, service and timestep stability. Browser QA checks all views/parts/lessons, full service sequences and preservation of biology, pause, Care freeze, mobile, reduced motion, WebGL fallback and errors. It captures the actual 1440×900 cover in `demos/assets/biowheel-studio.jpg`; diagnostic images are ignored under `tmp/biowheel-qa/`. Pass a live origin to QA to avoid overwriting the cover.

Water-specific tests additionally check that the sheet clears the solid lip and lands at every modeled water height, responds to delivery, freezes on pause, stops/restarts with the pump, and hides its scene captures in separated/microscope views. Browser checks include the cartridge-loading control, mobile rendering and shader errors. `release-check.cjs` refreshes the gallery cover and checks the collection links and detail views.

After tests, commit and push, then use the mandatory `deploy-reusing-stage.mjs --deploy` wrapper. Reuse the existing stage; preserve Pages Functions and the rest of the site. Do not create a new full-site copy or modify sibling demos to add this exhibit.

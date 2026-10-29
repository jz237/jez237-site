# Moving Bed Atelier

Published route: `/demos/moving-bed-studio/` · gallery exhibit 031 · October 29, 2026.

An original, detailed moving-bed biological filtration exhibit. This extends the canister, HOB and wet/dry studies with the distinct behavior of an aerated carrier bed. It does not reproduce a particular commercial filter or claim measured product geometry.

## Learning experience

- Eighteen selectable assemblies: reactor, cover, inlet, solids basket, coarse pad, two retaining screens, moving carriers, enlarged carrier, diffusers, manifold, airline/check valve, diaphragm pump, baffle, return pump, return riser, drain and support.
- Nine guided lessons move from the two separate circuits through mechanical pretreatment, plume-driven circulation, protected surfaces, nitrification, crowding, air loss, fresh media and system care.
- Six experiments compare normal operation, weak aeration, crowding, air failure, water-pump failure and fresh media. Air, water, media load and illustrative biofilm stage also have individual controls.
- Enlarged carrier with removable shell, internal webs, exaggerated attached film and labeled symbolic transport markers. Biology cards distinguish ammonia, nitrite and nitrate, show simplified balanced reactions and explain oxygen/alkalinity requirements. Three comprehension questions include feedback.
- Linear diaphragm-pump teaching section with copper windings, permanent-magnet rod, flexing opposed membranes, retaining rings and exposed valve ports. No rotary crank is depicted.
- Assembled, cutaway, exploded and flow views; separate care study; individual component isolation; perspective/front/top cameras; orbit, zoom, pause, one-third speed, gold carrier highlight, labels and reset.

## Construction and animation

`data.js` contains explanations, references, lessons, experiment presets and relative operating conditions. `simulation.js` is a deterministic, DOM-free kinematic circulation study. `model.js` constructs procedural geometry/materials and renders state. `studio.js` owns UI, clocks, cameras, picking and the browser loop. `studio.css` extends the existing Atelier presentation without changing shared styles. All runtime assets are local; no paid service or remote model is required.

The default population is 354 individual instanced carriers; the controls range from 227 to 558. The chamber has two diffuser rails and up to 480 representative bubbles, expanding impact rings, an animated water surface, depth tint, waterline detail and shared bounded reflection/refraction. White molded carriers have hollow ribs, central bores and internal webs. Rounded acrylic, edge highlights, slight polishing marks, contact shadows, fasteners, unions, grilles, textured foam and an elevated air-pump stand complete the assembly.

Each carrier has a distinct position, velocity, phase and rotation. A prescribed spatial flow field rises near the center, spreads near the top and returns near the walls, with asymmetric depth/time perturbations. Small positive buoyancy remains as air declines. Three spatial-hash position-constraint passes use conservative sphere envelopes to prevent major overlap; this is not rib-level rigid-body collision. Air strength decays smoothly; water through-flow is independent. A fixed 1/60-second simulation step allows up to three updates per rendered frame. Reset restores the deterministic initial state without rebuilding GPU resources.

Air and water arrows use independently integrated phases, so adjusting a rate does not jump their positions. Pausing freezes operating clocks, media, surface ripples, bubble motion, transport markers and pump motion. Slow motion advances these clocks at one third speed. Care, exploded and isolated modes suspend operating effects. The enlarged carrier and pump section animate their explanatory mechanisms while the main bed is suspended. Reduced-motion preference starts paused; keyboard tabs use arrow/Home/End navigation and all parts are available through a native select.

The read-only `window.movingBedStudio.snapshot()` exposes state, motion bounds, population, effect visibility and renderer diagnostics for QA. It is not an editor API.

## Accuracy and limits

This is a conceptual, gravity-fed sump section with off-screen supply/return connections. Water levels stay fixed when the return pump stops. No drain-down volume or real installation behavior is implied; the separate Trickle Atelier demonstrates a different, explicit drain-down model.

The model does not calculate fluid dynamics, oxygen transfer, water chemistry, nitrification rates, growth, tank capacity, pressure loss or manufacturer media fill limits. Relative media load is not a percentage of literal vessel displacement. Particle counts are representative. Carrier geometry has no manufacturer surface-area rating. Film, microorganisms/patches and colored transport markers are exaggerated illustrations, not microscopy or molecular simulation. Color and visible movement cannot establish biological readiness. Nitrate still needs managed export or treatment elsewhere.

Pump stroke/frequency and flexible membranes are slowed conceptual approximations. Valve ports are exposed, but the section does not solve changing chamber volume, valve airflow or alternating electromagnetic fields. Chamber wall/panel cuts and exploded offsets are teaching devices, not servicing instructions. Real equipment must be installed, tested and maintained according to its own manuals.

## Primary references

References checked October 29, 2026. Manufacturer names describe sources, not sponsorship or an exact model claim. No competing aquarium-store links are included.

- [Evolution Aqua K1 media](https://evolutionaqua.com/k1-media/): floating media and protected internal attachment surfaces.
- [Evolution Aqua aeration FAQ](https://support.evolutionaqua.com/hc/en-gb/articles/30268358171025-Do-I-need-an-airpump-for-NexusPlus): air-driven media circulation and increased aeration requirements with media load.
- [Evolution Aqua operating manuals](https://evolutionaqua.com/nexus-instruction-manuals), including the [Nexus 320 manual](https://www.evolutionaqua.com/pub/media/bss/productattachment/EA-Nexus320-Manual.pdf): mechanical/biological stages, new-media behavior and maintenance context. The exhibit does not reproduce Nexus construction.
- [University of Florida, ammonia in aquatic systems](https://ask.ifas.ufl.edu/publication/fa031): nitrification, oxygen, alkalinity, water chemistry and biological establishment.
- [Oklahoma State, small-scale aquaponics](https://extension.okstate.edu/fact-sheets/principles-of-small-scale-aquaponics): filtration and biological treatment principles.
- [HIBLOW, linear diaphragm pumps](https://www.hiblow-usa.com/2025/02/05/how-does-a-linear-diaphragm-air-pump-work/): electromagnets oscillate a permanent-magnet rod, opposed diaphragms move air, and one-way valves direct flow.

## Verification and maintenance

From the repository root:

```text
node scripts/moving-bed-studio/simulation.test.mjs
node scripts/moving-bed-studio/qa.cjs http://127.0.0.1:8818/demos/moving-bed-studio/
node scripts/build-demos.mjs
```

Serve the repository through a local HTTP server first. The browser script accepts `PLAYWRIGHT_CORE_PATH` and `CHROME_PATH`; defaults match the current Windows workspace. Artifacts go under ignored `tmp/moving-bed-qa/`. `preview.cjs` is a shorter visual capture helper. The gallery uses an actual 1440×900 browser screenshot, not a concept rendering.

The numerical checks cover deterministic replay/reset, finite positions, chamber bounds, conservative overlap limits, changing height/depth, weaker motion with air loss, continuing mixing with water loss and correct populations. Browser checks cover all parts, lessons and presets, pause, one-third timing, separate supplies, macro controls, biology feedback, care/exploded suspension, keyboard tabs, desktop/mobile overflow, reduced motion and WebGL failure with retained educational content. Screenshot review covers the main assembly, open carrier, pump section and mobile layout.

Shared imports are intentionally pinned to existing AquaClear material-5 and Trickle v3 modules. Changes to those modules need regression checks in both existing exhibits. New exhibit modules use `v=1`; bump the new module/CSS keys together when publishing subsequent changes. Register/update the catalog, regenerate all gallery pages, commit/push, then use the workspace's mandatory `deploy-reusing-stage.mjs --deploy` wrapper. Never create a full-site staging copy or bypass Pages Functions verification.

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

The default population is 354 individual instanced carriers; the controls range from 227 to 558. The chamber has two diffuser rails and up to 480 representative bubbles, expanding impact rings, an animated water surface, depth tint, waterline detail and bounded reflection/refraction in its own optics module. White molded carriers have hollow ribs, central bores and internal webs. Rounded acrylic, edge highlights, slight polishing marks, contact shadows, fasteners, unions, grilles, textured foam and an elevated air-pump stand complete the assembly.

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

Remaining shared imports are intentionally pinned to existing AquaClear material-5 and Trickle v3 modules. Changes to those shared modules need regression checks in both existing exhibits. Water optics now live in a local `optics.js` fork so this exhibit can be tuned independently. New exhibit modules use `v=3`; bump the new module/CSS keys together when publishing subsequent changes. Register/update the catalog, regenerate all gallery pages, commit/push, then use the workspace's mandatory `deploy-reusing-stage.mjs --deploy` wrapper. Never create a full-site staging copy or bypass Pages Functions verification.

## Three refinement passes — October 29, 2026 (v2)

1. **Water and media legibility:** depth-graded water faces, animated waterline seams, smaller varied bubbles, subtle surface breakup and less uniform carrier material. Tracing one gold carrier now draws its recent actual simulated path (up to 100 samples), with pause/reset behavior. `water-detail.js` owns these bounded visual effects. These are artistic cues, not a fluid solver.
2. **Construction and close-up detail:** 24 actual holes replace decorative cover-vent strips; larger pipe ends have lips and dark interior bores; carrier ribs/webs gain rounded edges in macro geometry; biofilm strips follow each web normal. The linear air-pump membranes flex across a radial mesh rather than a single cone, and exposed one-way valve flaps alternate with its illustrative stroke. Stroke, valve motion and frequency are explanatory approximations.
3. **Teaching views:** dedicated rolling-bed, diffuser, mechanical-stage and retaining-screen close-ups; a labeled media-hidden diffuser study; independent water/air/local-circulation arrow switches. Focused views replace the large heading with a compact caption, preserving model visibility.

`refinement-qa.cjs` verifies all four close-ups, media restoration, route toggles, trace pause, valve motion, real vent count, mobile layout and the new filtration collection. The original interaction suite still covers the complete experience. All filter studies are now children of `/demos/aquarium-filtration/`; direct URLs are unchanged.


## Water and material realism — October 29, 2026 (v3)

`materials.js` adds object-space procedural microstructure to six distinct surfaces: molded plastic, carrier polymer, rubber, brushed metal, porous diffuser rails and illustrative biofilm. Grain follows the geometry rather than stretching a bitmap across UVs. Color, roughness and normal variation are tuned separately; metal uses fine directional brushing and carriers retain their off-white molded appearance.

The local `optics.js` combines broad surface swell, smaller advected ripples, perturbed reflection/refraction and restrained plume highlights. `model.js` adds broad geometric waves beneath that fine shading. `water-detail.js` adds animated floor light patterns and 48 small wet beads above the assembled reactor's waterline. The floor patterns are an artistic caustic approximation, not ray-traced light transport. Surface effects remain illustrative, not a fluid simulation. Beads are hidden in cutaway/teaching modes to avoid floating in space.

All animation uses the existing simulation clock: pause and care modes freeze surface and floor-light motion. Reflection/refraction remain resolution-capped, and no new textures, external services or paid assets are needed. The other filter demos retain their existing renderers and materials.

Run `node scripts/moving-bed-studio/texture-qa.cjs` against the local server (or pass the full deployed URL). It checks shader loading, six material profiles, the detailed water surface, pause/care clocks, assembled/cutaway bead visibility and mobile overflow, and captures surface, diffuser, carrier, film and metal close-ups. The full interaction and refinement suites continue to cover the existing learning experience.

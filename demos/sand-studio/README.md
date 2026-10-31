# Sand Atelier

Public route: `/demos/sand-studio/`. Child of the single Aquarium Filtration collection at `/demos/aquarium-filtration/`. Do not add a second top-level aquarium demo entry.

## Educational scope

Original gravity-return fluidized-sand biofilter, not a commercial replica or an engineering design. A water pump feeds a bottom plenum/distributor; upward flow expands silica media; water exits near the top into an open receiver. Cutaway opens the front vessel and plenum wall. Assembled restores them. Exploded separates service assemblies while suspending the simulation. Twelve assemblies, eight manually paced lessons, six experiments and a grain/biofilm microscope.

Primary references (checked 2026-10-31):

- Pentair AES filtration catalog, Tech Talk 112 and biological filtration: https://pentairaes.com/media/docs/04-PAES-Master-Catalog-39th-Edition-Filtration.pdf
- Pentair QuikSand operating instructions (freeboard, gravity return, restart precautions and media maturity): https://pentairaes.com/media/docs/FB700_QuikSand_biofilter_0413.pdf
- University of Florida IFAS, recirculating systems principles: https://ask.ifas.ufl.edu/publication/FA099
- University of Florida IFAS, establishment and monitoring: https://ask.ifas.ufl.edu/publication/FA101

No retailer links or external runtime assets. The shared local Three.js runtime and established studio lighting are reused without editing the other filters.

## Implementation

- `model.js`: 12,000 instanced faceted grains, deterministic continuous up/down movement, reactor fittings, rippled water, arrow routes, carryover route and separate microscope. Grain size is exaggerated; motion is not collision simulation or CFD. Generated canvas textures retain asset independence. Phase advances only with the simulation clock.
- `simulation.js`: dimensionless flow lag, size-dependent fluidization threshold, biofilm-sensitive expansion, damped settling/restart and persistent illustrative media loss. Reset replenishes media. The activity index depends on establishment, oxygen and flow; it is not a measured treatment rate. No concentrations or water safety prediction.
- `studio.js`: orbit/zoom, raycast and keyboard-accessible assembly selector, view presets, tabs, lessons, controls, reduced-motion default pause, hidden-tab suspension and WebGL fallback.
- `data.js`: authored assembly notes, lessons and presets.

Transparent water is lightly tinted with a separate animated surface/meniscus so it remains visible. Arrows are a teaching overlay drawn through plumbing. Macro grain, film, organisms and molecules have independently enlarged scales; transformations show nitrification order only. No fictional aeration, instantaneous biological maturation or nitrogen disappearance.

`window.sandStudio.snapshot()` exposes read-only copied diagnostics for QA. No hidden stepping API. Power off decays flow and settles the bed; Pause freezes all physical clocks. Care and Exploded suspend operation without changing the pump preference. Lessons are manually advanced.

## Checks and publishing

Run from the website source checkout:

```
node scripts/sand-studio/simulation.test.mjs
node scripts/sand-studio/qa.cjs http://127.0.0.1:8821/demos/sand-studio/
node scripts/build-demos.mjs
```

Browser tests use the existing local Chrome/Playwright installation and save review screenshots under ignored `tmp/sand-qa/`. Tests cover operation, restart, irreversible loss until reset, biological controls, pause, lessons, cutaway/exploded/macro, mobile overflow, reduced motion and a WebGL failure. `preview.cjs` provides a short render check.

Screenshot cover: `demos/assets/sand-studio.jpg`, 1440×900, captured from the actual application. Keep the collection count and main collection description current. Bump local `?v=1` module/style keys together when revising a published release.

Follow root AGENTS deployment rules: tested, committed and pushed source, then `node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy`. Reuse the existing stage; no new full-site copies or direct Wrangler deployments. Preserve Philadelphia service routes and the private relay.

## Second edition: eight refinement passes

The user requested eight further improvement iterations. Local module/style cache keys are now `v=2`; shared dependencies keep their existing versions.

1. **Grain kinematics.** `grains.js` replaces abrupt vertical reversals with bounded continuous turns, lateral drift, variable tumbling and grain-size variation. Deterministic continuity and bounds tests plus a browser render check passed.
2. **Bed and carryover.** Settled and expanded volumes account for media lost. Flow arrows integrate delivery rather than jumping when flow changes. Representative escaped grains finish their four-second drain path and accumulate in the basin; smaller grains leave first. Mass/height, settling, restart and flow-continuity tests cover the qualitative model.
3. **Water optics.** `optics.js` captures one reduced-resolution scene with a depth texture. Modest refraction, view-depth tint and moving surface highlights keep grains readable. Shader state is restored after capture. Main render owns shadow updates. Surface geometry is horizontal in both the vessel and receiving basin.
4. **Materials and fabrication.** `finishes.js` adds molded micro-roughness, softened manufactured edges, quieter metal, rubber feet, union grips, fasteners and an equipment plaque. Procedural assets stay local. Render checks cover shader compilation.
5. **Working mechanical detail.** `mechanics.js` supplies genuinely perforated distributor geometry, annular flanges, a seven-vane rotor under a transparent teaching cover, a pump cable and distributor flow indicators. The plenum retains a solid bottom. The section toggle affects the cutaway; Assembled restores the ordinary housing. Rotor speed follows integrated pump delivery and freezes on pause.
6. **Attached biofilm.** `biofilm.js` positions clustered, instanced cells directly on the irregular grain surface with fine gel strands. New-grain/established-film comparison controls adjust the existing maturity parameter; the visual layer can be hidden. This is an illustrative comparison, not time-lapse growth or species identification.
7. **Guided learning.** `journey.js` defines a four-stage, manually startable water journey with captions and camera focus. An enlarged cyan marker is deliberately visible through surfaces. Starting resets to the working-bed condition; Pause, reduced motion, Care and view changes are respected. A bounded 60-simulated-second chart records bed height relative to the original settled bed; loss therefore remains visible.
8. **Presentation and performance.** Larger default framing, narrow-screen framing, collision-aware labels and leader lines, reduced label count on phones, return impact ripples and small splash droplets. Grain matrix uploads stop while paused or in the microscope. The wet details share the physical clock. The existing interactions, lessons and accessible fallbacks remain available.

Additional checks:

```
node scripts/sand-studio/grains.test.mjs
node scripts/sand-studio/refinement.test.mjs
node scripts/sand-studio/refinement-qa.cjs
node scripts/sand-studio/release-check.cjs
```

`refinement-qa.cjs` captures the pump section, four guided stages, bed-history view, mature biofilm and phone layout. It checks guide completion/pause/stop, history, micro comparison and layer visibility, mechanical controls, wet-animation pause, reduced motion and skipped grain uploads. Existing `qa.cjs` remains the baseline regression suite. Figures are illustrative throughout: no CFD, collision solver, pump curve, real chemical concentration or capacity prediction has been added.

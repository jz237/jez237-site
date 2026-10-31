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

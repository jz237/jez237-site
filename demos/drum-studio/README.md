# Drum Atelier

Route: `/demos/drum-studio/` · filtration exhibit 033 · October 30, 2026.

An original interactive gravity-fed rotating drum filter. It joins the existing filter studies inside `/demos/aquarium-filtration/`, rather than adding another main-gallery filter card. Geometry is procedural and illustrative, not a commercial product replica or measured CAD.

## Experience

- Eighteen selectable assemblies, assembled/cutaway/exploded views, component isolation, orbit, camera presets, fullscreen, pause and one-third speed.
- Nine guided lessons, six close-ups and six experiments: normal operation, loaded screen, heavy solids, lost rinse pressure, circulation stopped and blocked waste.
- Separate normal filtration, reverse wash and waste-export arrows. The trough remains stationary while the drum and gear train turn.
- Fine screen weave, removable-panel cage, gear teeth, support rollers, a rinse strainer/pump, six brass nozzles, fan sprays, captured deposits and traveling waste droplets.
- Two water levels and a clean-side float, with masked ripple surfaces, planar reflection, depth-guarded refraction and material grain.
- An enlarged woven-screen study built from actual crossing wires, with 60/100/150 micrometre nominal aperture comparisons and enlarged rigid particles.
- Keyboard tabs and native component selection, reduced-motion pause, mobile layout, readable explanations and sources if WebGL is unavailable.

## Operating model

`simulation.js` is deterministic and independent of the renderer. Seventy-two angular sectors accumulate a bounded relative load when submerged. A finer selected screen retains a greater illustrative fraction of incoming material. Sector angle follows the same drum angle used by the visible screen and gear train.

The dirty-water reference level is held at 2.4 model units. The clean-side head difference approaches a qualitative function of circulation setting and mean screen loading. At a head difference above 0.27 model units, automatic mode requests a wash. The controller waits 0.8 simulated seconds, runs an 11.8-second wash, then allows 2 seconds of recovery. The drum completes a little over one revolution per wash. Sectors near the top lose load in proportion to rinse strength. These values are chosen for readable demonstrations and are **not equipment settings or physical measurements**.

Insufficient recovery ends in a fault. A blocked waste route stops the wash; circulation loss during washing also stops it in this model. A manual request uses the same sequence. No hydraulic drain-down, real pressure, controller certification, or actual safety interlock is simulated. Reset/Normal operation explicitly clears the demonstration fault.

The animation uses bounded 1/60-second simulation steps. Pause freezes operating clocks, water, drum motion and particles. Macro view suspends the machine while its separate illustrative particle clock runs; pause freezes that clock too. Care, exploded and isolated views suspend operation. Camera transitions remain available while paused.

## Architecture and rendering

- `index.html` / `studio.css`: responsive Atelier layout, learning panels and accessible controls.
- `data.js`: original component explanations, lessons, experiments and primary-source links.
- `simulation.js`: loading, water-level response, rinse state machine and deterministic reset.
- `model.js`: procedural mechanical geometry, masked cutaway, instanced particles, macro weave and state-driven render updates.
- `optics.js`: local adaptation of the Moving Bed optics, with separate dirty/clean surface masks. Both surfaces share scene captures; the clean-water level is the reflection reference, so dirty-side reflection is an approximation. It is not ray tracing or CFD.
- `studio.js`: UI, camera, picking, clocks, renderer and read-only `window.drumStudio.snapshot()` diagnostics.

Local dependencies reuse the existing Three.js/OrbitControls, AquaClear studio environment, Trickle rounded geometry, and Moving Bed material microstructure. Those modules are unchanged. Changing a shared module requires regression checks in its existing consumers. Current new-runtime cache keys are `v=2`; bump affected module/CSS keys together for subsequent publications.

Cutaway uses a fixed world-space plane, so the opening does not rotate with the drum. The complete screen returns in Assembled and Exploded views. The microscopic opening count is deliberately reduced/enlarged to remain visible. The main screen uses derivative-filtered procedural weave coverage; the macro uses actual wire geometry. The particles are illustrative, not a calibrated screen-efficiency test. Flexible waste, clumping, orientation and screen condition can affect real capture.

No purchased assets, external runtime service or new dependency installation is required. The gallery cover is an actual 1440×900 browser screenshot.

## Sources and educational boundaries

Primary references checked October 30, 2026:

- [AquaForte drum-filter principle](https://www.aqua-forte.com/products/pond-swimming-pond-filters/drum-filters): inside-to-outside screening and a separate reverse rinse/waste route.
- [TinyDrum operating manual](https://www.tinydrum.de/site/assets/files/1295/manual_drum_filter.pdf): construction, sensor/controller, drive, rinse system, waste trough and maintenance topics. Its described level arrangement is not copied wholesale into this gravity-fed model.
- [OASE gravity-fed drum filter](https://www.oase.com/en-US/pond-and-water-garden/proficlear-premium-compact-l-gravity-fed): a mechanical stage in a gravity-fed treatment system.
- [ProfiDrum FAQs](https://www.profidrum.com/faqs): distinction between gravity-fed and pump-fed arrangements.

The educational design does not carry a manufacturer's flow capacity, pressure, screen efficiency, installation level, waste-water consumption or maintenance interval. It removes suspended material conceptually; it does not calculate dissolved waste removal, nitrification, oxygen or water chemistry. Those distinctions are also visible in the demo, with a link to Moving Bed for the next biological stage. All sources are manufacturers; there are no competing aquarium-store links.

## Checks and publication

From the existing repository checkout, serve locally, then run:

```text
node scripts/drum-studio/simulation.test.mjs
node scripts/drum-studio/qa.cjs http://127.0.0.1:8820/demos/drum-studio/
node scripts/moving-bed-studio/refinement-qa.cjs http://127.0.0.1:8820
node scripts/build-demos.mjs
```

The browser scripts accept `PLAYWRIGHT_CORE_PATH` and `CHROME_PATH`. `preview.cjs` is the shorter visual review helper. Ignored screenshots go under `tmp/drum-qa/`. Numerical tests cover repeatable loading, recovery, fault cases, stop/manual operation, aperture comparison and reset. Browser checks cover actual wash recovery, clock freezing, all component isolation states, six close-ups, nine lessons, all modes, mobile overflow, keyboard tabs, reduced motion and WebGL fallback.

Update the child catalog, main collection count, collection introduction, roadmap and actual screenshot when changing the inventory. The collection remains a single main-gallery entry. Commit and push source, then use the mandatory workspace `deploy-reusing-stage.mjs --deploy` wrapper. Do not create another full-site stage or bypass Functions/preview/production checks.


## Graphics refinement — October 30, 2026 (v2)

A local `finish.js` replaces the coarse shared metal treatment with subtle directional brushing and distance-filtered microstructure. The shared filter materials remain unchanged. Steel, dark molded components and brass retain distinct finishes; screen highlights and captured deposits are less uniform.

`detail.js` adds thin enclosure seams, lid seals, 36 cage-mounted panel clamps, hex nozzle shoulders and dark apertures, motor vents/fasteners, 64 stationary wet wall beads and an actual controller display texture. The display reports the same filter state and relative load as the learning panel; its canvas only updates when the state or quantized load changes.

Spray fans now carry animated streaks and breakup; elongated instanced drops vary in size and follow an accelerating fall. Impact rings and a moving trough film make wash collection visible. Residual drips/film fade over a short period after washing. These are bounded artistic effects driven by the existing simulation clock, not a liquid or spray solver. Pause freezes the runoff decay; reset clears it; suspended views hide the operating effects.

The two-level water surfaces use gentler ripple normals and an approximate view-depth absorption tint. The depth estimate comes from the existing refraction capture and is not a full optical path through the vessel. Reflection/refraction resolutions remain bounded and the main operating model is unchanged. The browser regression adds runoff pause/decay checks and verifies the new material/detail path loads without shader errors. Review main, rinse, macro and mobile captures before publication.

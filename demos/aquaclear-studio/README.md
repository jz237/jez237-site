# AquaClear Atelier

Original educational reconstruction of the **current Fluval AquaClear AC70**, item 19615. Editable ES modules live directly here; no separate generated build or package installation is required. This exhibit is independently authored and is not manufacturer CAD.

Serve the repository over HTTP, then open `/demos/aquaclear-studio/`. All runtime dependencies are local. `vendor/` reuses the existing FiltoClear Three.js distribution and preserves its MIT license. No purchased assets, external font requests, model downloads or API keys are required by this exhibit. The site’s existing middleware may add its shared analytics markup.

## Experience

- Fifteen selectable assemblies, corresponding to the manual's included component groups.
- Assembled, cutaway, continuous exploded and directional water-flow views. Small three-dimensional arrows follow each path tangent; their heads remain directional when motion is paused. Cyan identifies intake, mint return, and amber refiltration or bypass.
- Instanced ceramic rings with actual holes, granular carbon, procedural foam pores, ribbed basket, motor, rotor, intake and leveling device.
- Six guided close-up chapters with camera transitions and subdued surrounding parts; the pump chapter exposes a sectioned housing and the same spinning rotor used by the full model.
- Flow-lab pump study, paused/reduced-motion compatibility, illustrative axial-in/radial-out arrows, and clean/loaded foam comparison with retained brown deposits on the upstream underside. Enlarged incoming particles stop at that face. Restricted media reduces normal delivery and activates the labeled amber bypass.
- A curved spillway sheet meeting the selected aquarium surface, mesh-based interference ripples, small impact bubbles and splash droplets. Water-level control spans 0–38 mm below the output with the manufacturer maximum-gap reference mark. No water simulation runs during care or explosion.
- Four care stages with pump animation disabled; single-component inspection; orbit, fit, camera presets, fullscreen, labels and pause controls.
- Responsive layout, keyboard component selector and tabs, reduced-motion support, and a text explorer when WebGL is unavailable.

## Evidence and limits

Reviewed 2026-10-28:

- [Fluval AC70 product specifications](https://fluvalaquatics.com/us/shop/product/aquaclear-ac70-power-filter-40-70-us-gal-152-265-l): 40–70 US gal, 300 US GPH maximum, 7 W at 120 V / 60 Hz, item 19615.
- [Current AC20/30/50/70 manual](https://fluvalaquatics.com/manuals/AC20_30_50_70_Manual_English.pdf): component list on PDF page 2; media layout on page 5; mounting on page 6; priming on page 7; pump care on page 8; refiltration and water-level guidance on page 9.
- [Manufacturer FAQ](https://fluvalaquatics.com/us/faqs/aquaclear): water path and care context.

The current AC70 has foam below **carbon at the rear and BIOMAX at the front**. Do not replace this with the legacy AquaClear 70 media stack or AC110 geometry. The internal channel layout, tubing proportions, rotor speed, pores and exploded offsets are approximate. The small aquarium section is context, not a stocking recommendation. The seal and lever now use dark material colors instead of the earlier copper teaching tint. Water markers represent direction, not bubbles or measured velocity.

The flow slider is lever travel, not measured GPH. Only the manufacturer's maximum specification and “up to 50% at minimum” refiltration statement are factual ratings. Intermediate animation mapping and bypass severity are qualitative. The water uses analytic mesh deformation, a mirrored-camera planar reflection, depth-guarded screen-space refraction and Fresnel blending. The sheet shares the surface reflection approximation; this is not ray tracing or CFD. Procedural moving caustic-like light on the cropped tank floor is artistic, not a light-transport simulation. The pump section is an illustrative open quadrant, not measured volute geometry. Ceramic positions are distributed with variation, not physically settled by a rigid-body solver. No chemistry, CFD, cycle-time or livestock safety simulation is claimed. Care text links to the manual instead of presenting the animation as a service procedure.

## Photo-reference and optical rendering update — October 28, 2026

The product gallery and replacement-part photos were visually inspected on the manufacturer's site. The reference corrections are:

- [Current AC70 product gallery](https://fluvalaquatics.com/us/shop/product/aquaclear-ac70-power-filter-40-70-us-gal-152-265-l): smoke-clear housing and intake, blue foam, mesh around ceramic media, black motor. The case now has thinner drafted walls and visible rim thickness; intake extension has a real open bore.
- [A16331 cover](https://fluvalaquatics.com/us/shop/product/filter-cover-for-ac-series-ac70): broad perforated top panel with a stepped edge and a dark side badge, replacing the invented solid ribbed plate. Perforations are geometry, not a painted dot pattern.
- [A16316 impeller cover](https://fluvalaquatics.com/us/shop/product/impeller-cover-for-ac-series-ac70): rectangular plate, round intake socket and retaining flange, replacing a simple circular cap. The manufacturer's manual table appears to list the case number in this cover's AC70 cell; this exhibit does not offer ordering advice.

These are photograph-guided shape and material corrections. Exact dimensions, tolerances, concealed channels and impeller blade geometry remain approximate; no measured CAD or scan was available. Source photographs are references only and are not copied into the public assets.

Scene optics render into two targets capped at 1024 pixels wide, with half resolution below 760 CSS pixels. A depth texture prevents sampling foreground objects into the refracted view. Reflection clips the scene to the water plane, is suppressed at/below the plane, and excludes teaching arrows. Floating-point targets fall back to unsigned-byte targets where necessary. Capture restores renderer state in a `finally` block and is skipped in care, explosion, cutaway and isolation. Pause freezes waves and light patterns while camera movement remains available.

Materials include original procedural plastic grain, ceramic bump detail, cutout woven cloth, wet/dry roughness changes and filtered contact shadows. The projected light patterns and refracted screen edges remain real-time approximations. Texture detail and rendering passes introduce no network asset dependencies.

## Maintenance and checks

`data.js`: content, primary sources and qualitative flow mapping. `model.js`: procedural geometry, assembly offsets and water traces. `effects.js`: procedural waterfall/surface, debris capture and open pump section. `optics.js`: bounded offscreen reflection/refraction captures and water shader. `detail.js`: perforated cover, hollow tubes, pump cover, procedural grain, cloth and light-pattern materials. `studio.js`: UI, selection, guided camera and state. `studio.css`: responsive layout.

Run from the repository root:

```sh
node --check demos/aquaclear-studio/model.js
node --check demos/aquaclear-studio/studio.js
node scripts/aquaclear-studio/qa.cjs http://127.0.0.1:8818/demos/aquaclear-studio/
node scripts/aquaclear-studio/optics-qa.cjs http://127.0.0.1:8818/demos/aquaclear-studio/
node scripts/build-demos.mjs
```

QA uses Playwright and Chrome; set `CHROME_PATH` when necessary. It checks all components, display modes, isolation, care, tour completion, pause, camera drag, keyboard tabs, mobile overflow, reduced motion, WebGL failure, console and failed requests. Upgrade checks also cover sheet-to-water contact at three levels, clean/loaded deposit counts and delivery, rotating/paused pump, care shutdown and mobile pump framing. Optics QA additionally checks grazing/underwater views and renderer-state restoration; the main suite checks bounded desktop/mobile capture sizes and capture shutdown during care. Screenshots go to ignored `tmp/aquaclear-qa/`. The read-only `window.filterStudio.snapshot()` is for diagnostics.

The gallery cover is a screenshot of the working demo. Capture with `scripts/aquaclear-studio/covers.cjs` against the local server; pass `aquaclear-studio` to capture only this exhibit; without a name it also captures the pond and reef exhibits. Add the public files and gallery together. Follow root AGENTS.md and the workspace `deploy-reusing-stage.mjs` wrapper; do not deploy static-only or create another full-site staging copy. Hidden Reef storefront/Lab are separate projects.

# AquaClear Atelier

Original educational reconstruction of the **current Fluval AquaClear AC70**, item 19615. Editable ES modules live directly here; no separate generated build or package installation is required. This exhibit is independently authored and is not manufacturer CAD.

Serve the repository over HTTP, then open `/demos/aquaclear-studio/`. All runtime dependencies are local. `vendor/` reuses the existing FiltoClear Three.js distribution and preserves its MIT license. No purchased assets, tracking SDKs, external font requests, model downloads or API keys.

## Experience

- Fifteen selectable assemblies, corresponding to the manual's included component groups.
- Assembled, cutaway, continuous exploded and directional water-flow views. Small three-dimensional arrows follow each path tangent; their heads remain directional when motion is paused. Cyan identifies intake, mint return, and amber refiltration or bypass.
- Instanced ceramic rings with actual holes, granular carbon, procedural foam pores, ribbed basket, motor, rotor, intake and leveling device.
- Six guided chapters, adjustable illustrative refiltration and a restricted-media example.
- Four care stages with pump animation disabled; single-component inspection; orbit, fit, camera presets, fullscreen, labels and pause controls.
- Responsive layout, keyboard component selector and tabs, reduced-motion support, and a text explorer when WebGL is unavailable.

## Evidence and limits

Reviewed 2026-10-28:

- [Fluval AC70 product specifications](https://fluvalaquatics.com/us/shop/product/aquaclear-ac70-power-filter-40-70-us-gal-152-265-l): 40–70 US gal, 300 US GPH maximum, 7 W at 120 V / 60 Hz, item 19615.
- [Current AC20/30/50/70 manual](https://fluvalaquatics.com/manuals/AC20_30_50_70_Manual_English.pdf): component list on PDF page 2; media layout on page 5; mounting on page 6; priming on page 7; pump care on page 8; refiltration and water-level guidance on page 9.
- [Manufacturer FAQ](https://fluvalaquatics.com/us/faqs/aquaclear): water path and care context.

The current AC70 has foam below **carbon at the rear and BIOMAX at the front**. Do not replace this with the legacy AquaClear 70 media stack or AC110 geometry. The internal channel layout, tubing proportions, rotor speed, pores and exploded offsets are approximate. The small aquarium section is context, not a stocking recommendation. The seal's copper tint is a teaching convention. Water markers represent direction, not bubbles or measured velocity.

The flow slider is lever travel, not measured GPH. Only the manufacturer's maximum specification and “up to 50% at minimum” refiltration statement are factual ratings. Intermediate animation mapping and bypass severity are qualitative. No chemistry, CFD, cycle-time or livestock safety simulation is claimed. Care text links to the manual instead of presenting the animation as a service procedure.

## Maintenance and checks

`data.js`: content, primary sources and qualitative flow mapping. `model.js`: procedural geometry, assembly offsets and water traces. `studio.js`: UI, selection, camera and state. `studio.css`: responsive layout.

Run from the repository root:

```sh
node --check demos/aquaclear-studio/model.js
node --check demos/aquaclear-studio/studio.js
node scripts/aquaclear-studio/qa.cjs http://127.0.0.1:8818/demos/aquaclear-studio/
node scripts/build-demos.mjs
```

QA uses Playwright and Chrome; set `CHROME_PATH` when necessary. It checks all components, display modes, isolation, care, tour completion, pause, camera drag, keyboard tabs, mobile overflow, reduced motion, WebGL failure, console and failed requests. Screenshots go to ignored `tmp/aquaclear-qa/`. The read-only `window.filterStudio.snapshot()` is for diagnostics.

The gallery cover is a screenshot of the working demo. Capture with `scripts/aquaclear-studio/covers.cjs` against the local server; it also captures the existing pond and reef exhibits. Add the public files and gallery together. Follow root AGENTS.md and the workspace `deploy-reusing-stage.mjs` wrapper; do not deploy static-only or create another full-site staging copy. Hidden Reef storefront/Lab are separate projects.
